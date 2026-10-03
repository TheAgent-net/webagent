import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { crawlSite } from "../../src/site/crawl.ts";
import { extractPage } from "../../src/site/extract.ts";
import { pageFromMarkdown, parseLlmsIndex, rankDocLinks } from "../../src/site/llms.ts";
import { buildPack } from "../../src/site/pack.ts";
import type { CrawlState } from "../../src/site/crawl.ts";
import type { PageShot } from "../../src/site/types.ts";
import { defaultQueryEmbed, fillVectors, indexPages, type EmbedFn, type RetrievalInfo } from "../../src/retrieve/index.ts";
import { loadPackConfig, packPolicy } from "../../src/pack/load.ts";

const DIR = fileURLToPath(new URL(".", import.meta.url));
const UA = "webagent-ingest/0.4";
const MARKET = "https://supermemory.com";
const DOCS = "https://supermemory.ai/docs";
const LLMS = DOCS + "/llms.txt";

const PRIORITY = [
  "/docs/quickstart",
  "/docs/overview/what-is-supermemory",
  "/docs/concepts/memory-vs-rag",
  "/docs/concepts/how-it-works",
  "/docs/concepts/graph-memory",
  "/docs/concepts/user-profiles",
  "/docs/ingestion/add-memories",
  "/docs/recall/search",
  "/docs/concepts/container-tags",
  "/docs/using-supermemory",
  "/docs/integrations/supermemory-sdk",
  "/docs/integrations/ai-sdk",
  "/docs/integrations/cursor",
  "/docs/integrations/claude-code",
  "/docs/integrations/grok-bot",
  "/docs/supermemory-mcp/mcp",
  "/docs/self-hosting/overview",
  "/docs/overview/comparison",
  "/docs/overview/billing",
];

export async function build(opts: {
  maxPages?: number;
  fetch?: typeof fetch;
  embed?: EmbedFn | false;
  cachePath?: string;
} = {}) {
  const config = loadPackConfig(DIR);
  const policy = packPolicy(config);
  const fetchFn = (opts.fetch ?? fetch) as typeof fetch;
  const max = opts.maxPages ?? 180;
  const marketingBudget = Math.min(24, Math.max(6, Math.floor(max * 0.15)));
  const docsBudget = Math.max(24, max - marketingBudget);

  const [marketing, docs] = await Promise.all([
    crawlMarketing(fetchFn, marketingBudget),
    crawlDocs(fetchFn, docsBudget),
  ]);
  const pages = dedupe([...marketing, ...docs]);
  const state: CrawlState = {
    origin: MARKET,
    pages,
    pending: [],
    seen: new Set(pages.map((p) => p.url)),
    cookies: "",
  };
  const site = buildPack(state);
  site.starterQuestions = config.widget.chips;
  const chunks = indexPages(pages, policy);
  let retrieval: RetrievalInfo = { mode: "lexical", embedded: 0 };
  try {
    retrieval = await fillVectors(chunks, {
      embed: opts.embed,
      cachePath: opts.embed === false ? undefined : opts.cachePath ?? join(process.cwd(), ".retrieve-cache-supermemory.json"),
    });
  } catch (err) {
    console.error("supermemory embeddings failed — lexical fallback:", err instanceof Error ? err.message : err);
  }
  const embedQuery = typeof opts.embed === "function" ? opts.embed : retrieval.mode === "hybrid" ? defaultQueryEmbed() : undefined;
  site.facts = [
    "Pocket facts — do not recite on the first turn. Explore the visitor, then spend these only when they match what they said.",
    ...site.facts,
    `Docs origin ${DOCS}. ${docs.length} doc pages, ${marketing.length} marketing pages, ${chunks.length} chunks, retrieval ${retrieval.mode}.`,
    "First path is the hosted Memory API. Self-host only if data must stay local. Memory + profile + SuperRAG share one containerTag.",
  ];
  return {
    origin: MARKET,
    docsOrigin: DOCS,
    site,
    pages,
    chunks,
    retrieval,
    embedQuery,
    facts: site.facts,
    starterQuestions: config.widget.chips,
  };
}

async function crawlMarketing(fetchFn: typeof fetch, maxPages: number): Promise<PageShot[]> {
  try {
    const state = await crawlSite(MARKET + "/", { maxPages, fetch: fetchFn });
    const pages = state.pages.filter((p) => p.status > 0 && !isMapFile(p.url));
    if (pages.length) return pages;
  } catch {
    /* fall through */
  }
  const home = await getHtml(MARKET + "/", fetchFn);
  return home ? [home] : [];
}

async function crawlDocs(fetchFn: typeof fetch, budget: number): Promise<PageShot[]> {
  const indexTxt = await getText(LLMS, fetchFn);
  const links = rankDocLinks(parseLlmsIndex(indexTxt || ""), PRIORITY).slice(0, budget);
  const pages: PageShot[] = [];
  if (indexTxt) {
    pages.push({
      url: LLMS,
      status: 200,
      title: "supermemory docs index",
      description: "Machine-readable index of every docs page.",
      headings: ["llms.txt"],
      text: indexTxt.slice(0, 5000),
      links: links.map((l) => l.url),
      forms: [],
      gated: false,
    });
  }
  const batch = 8;
  for (let i = 0; i < links.length && pages.length < budget + 1; i += batch) {
    const chunk = links.slice(i, i + batch);
    const got = await Promise.all(chunk.map((l) => getDoc(l.mdUrl, fetchFn)));
    for (const p of got) if (p) pages.push(p);
  }
  return pages;
}

async function getDoc(mdUrl: string, fetchFn: typeof fetch): Promise<PageShot | null> {
  const md = await getText(mdUrl, fetchFn);
  if (md && looksLikeMarkdown(md)) return pageFromMarkdown(mdUrl, md);
  return getHtml(mdUrl.replace(/\.md$/, ""), fetchFn);
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

async function getHtml(url: string, fetchFn: typeof fetch): Promise<PageShot | null> {
  try {
    const res = await fetchFn(url, { headers: { "User-Agent": UA, Accept: "text/html" } });
    const ctype = res.headers.get("content-type") ?? "";
    const body = await res.text();
    if (ctype.includes("markdown") || looksLikeMarkdown(body)) return pageFromMarkdown(url, body, res.status);
    if (!res.ok) return null;
    return extractPage(body, res.url || url, res.status);
  } catch {
    return null;
  }
}

function looksLikeMarkdown(s: string): boolean {
  return /^#\s|^>\s/m.test(s.slice(0, 400));
}

function isMapFile(url: string): boolean {
  return /\.xml($|\?)/i.test(url) || /sitemap/i.test(url);
}

function dedupe(pages: PageShot[]): PageShot[] {
  const seen = new Set<string>();
  const out: PageShot[] = [];
  for (const p of pages) {
    if (seen.has(p.url)) continue;
    seen.add(p.url);
    out.push(p);
  }
  return out;
}
