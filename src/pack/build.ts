import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { fillVectors, defaultQueryEmbed, type EmbedFn } from "../retrieve/embed.ts";
import { indexPages } from "../retrieve/chunk.ts";
import type { RetrievalInfo } from "../retrieve/types.ts";
import { crawlSite } from "../site/crawl.ts";
import { extractPage } from "../site/extract.ts";
import { buildPack } from "../site/pack.ts";
import type { CrawlState } from "../site/crawl.ts";
import type { PageShot } from "../site/types.ts";
import { loadContent } from "./content.ts";
import { loadInstruction, loadPackConfig, packPolicy, resolvePackDir } from "./load.ts";
import type { AgentPackConfig, PackBuildFn, PackRuntime } from "./types.ts";

const UA = "webagent-ingest/0.4";

export interface BuildAgentOpts {
  maxPages?: number;
  fetch?: typeof fetch;
  embed?: EmbedFn | false;
  cachePath?: string;
}

export async function openPack(dir: string, opts: BuildAgentOpts = {}): Promise<PackRuntime> {
  const root = resolvePackDir(dir);
  const config = loadPackConfig(root);
  const instruction = loadInstruction(root, config);
  const policy = packPolicy(config);
  const custom = await loadBuild(root);
  if (custom) {
    const built = await custom({
      maxPages: opts.maxPages,
      fetch: opts.fetch,
      embed: opts.embed,
      cachePath: opts.cachePath,
    });
    if (isRuntime(built)) {
      return { ...built, config: built.config ?? config, dir: root, instruction: built.instruction || instruction, policy: built.policy ?? policy };
    }
    const pages = built.pages ?? [];
    const chunks = built.chunks ?? indexPages(pages, policy);
    const site = built.site ?? siteFrom(pages, built.origin || config.origin);
    if (built.facts?.length) site.facts = built.facts;
    if (built.starterQuestions?.length) site.starterQuestions = built.starterQuestions;
    return {
      config,
      dir: root,
      instruction: withStats(instruction, pages, chunks.length, built.retrieval?.mode),
      policy,
      site,
      pages,
      chunks,
      retrieval: built.retrieval,
      embedQuery: built.embedQuery,
    };
  }
  return buildFromOrigin(config, root, instruction, opts);
}

export async function buildFromOrigin(
  config: AgentPackConfig,
  dir: string,
  instruction: string,
  opts: BuildAgentOpts = {},
): Promise<PackRuntime> {
  const policy = packPolicy(config);
  const fetchFn = opts.fetch ?? fetch;
  const max = opts.maxPages ?? 80;
  /* A pack with stored content opens without a crawl. `refresh.ts` keeps the content current. */
  const stored = loadContent(dir);
  let pages: PageShot[];
  if (stored?.pages.length) {
    pages = stored.pages;
  } else {
    const state = await crawlSite(config.origin, { maxPages: max, fetch: fetchFn });
    const extra = await crawlDocs(config, fetchFn, Math.max(10, Math.floor(max * 0.6)));
    pages = dedupePages([...state.pages, ...extra]);
  }
  const cachePath = opts.cachePath ?? (stored ? join(dir, "retrieve-cache.json") : undefined);
  const crawlState: CrawlState = {
    origin: config.origin,
    pages,
    pending: [],
    seen: new Set(pages.map((p) => p.url)),
    cookies: "",
  };
  const site = buildPack(crawlState);
  site.starterQuestions = config.widget.chips.length ? config.widget.chips : site.starterQuestions;
  const chunks = indexPages(pages, policy);
  let retrieval: RetrievalInfo = { mode: "lexical", embedded: 0 };
  try {
    retrieval = await fillVectors(chunks, { embed: opts.embed, cachePath: opts.embed === false ? undefined : cachePath });
  } catch (err) {
    console.error("embeddings failed — lexical fallback:", err instanceof Error ? err.message : err);
  }
  const embedQuery = typeof opts.embed === "function" ? opts.embed : retrieval.mode === "hybrid" ? defaultQueryEmbed() : undefined;
  return {
    config,
    dir,
    instruction: withStats(instruction, pages, chunks.length, retrieval.mode),
    policy,
    site,
    pages,
    chunks,
    retrieval,
    embedQuery,
  };
}

async function crawlDocs(config: AgentPackConfig, fetchFn: typeof fetch, budget: number): Promise<PageShot[]> {
  const llms = config.docs?.llmsTxt;
  if (!llms) return [];
  const pages: PageShot[] = [];
  const txt = await getText(llms, fetchFn);
  if (!txt) return [];
  pages.push({
    url: llms,
    status: 200,
    title: "docs index",
    description: "Machine-readable index of docs pages.",
    headings: ["llms.txt"],
    text: txt.slice(0, 5000),
    links: [],
    forms: [],
    gated: false,
  });
  const mdUrls = [...txt.matchAll(/https?:\/\/[^\s)]+\.md/g)].map((m) => m[0]).slice(0, budget);
  const batch = 8;
  for (let i = 0; i < mdUrls.length && pages.length < budget + 1; i += batch) {
    const chunk = mdUrls.slice(i, i + batch);
    const got = await Promise.all(chunk.map((u) => getPage(u, fetchFn)));
    for (const p of got) if (p) pages.push(p);
  }
  return pages;
}

async function getText(url: string, fetchFn: typeof fetch): Promise<string> {
  try {
    const res = await fetchFn(url, { headers: { "User-Agent": UA, Accept: "text/plain,text/markdown,text/html" } });
    if (!res.ok) return "";
    return await res.text();
  } catch {
    return "";
  }
}

async function getPage(url: string, fetchFn: typeof fetch): Promise<PageShot | null> {
  try {
    const res = await fetchFn(url, { headers: { "User-Agent": UA, Accept: "text/html,text/markdown,text/plain" } });
    const body = await res.text();
    if (!res.ok) return null;
    return extractPage(body, res.url || url, res.status);
  } catch {
    return null;
  }
}

async function loadBuild(dir: string): Promise<PackBuildFn | undefined> {
  const path = resolve(dir, "build.ts");
  if (!existsSync(path)) return undefined;
  const mod = (await import(pathToFileURL(path).href)) as { build?: PackBuildFn };
  return typeof mod.build === "function" ? mod.build : undefined;
}

function isRuntime(v: unknown): v is PackRuntime {
  return !!v && typeof v === "object" && "config" in v && "chunks" in v && "pages" in v && "site" in v;
}

function siteFrom(pages: PageShot[], origin: string) {
  return buildPack({
    origin,
    pages,
    pending: [],
    seen: new Set(pages.map((p) => p.url)),
    cookies: "",
  });
}

function withStats(instruction: string, pages: PageShot[], chunks: number, mode?: string): string {
  return (
    instruction.trim() +
    "\n\nCrawled " +
    pages.length +
    " pages, " +
    chunks +
    " indexed sections" +
    (mode ? ", retrieval " + mode : "") +
    "."
  );
}

function dedupePages(pages: PageShot[]): PageShot[] {
  const seen = new Set<string>();
  const out: PageShot[] = [];
  for (const p of pages) {
    if (seen.has(p.url)) continue;
    seen.add(p.url);
    out.push(p);
  }
  return out;
}
