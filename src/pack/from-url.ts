import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { crawlSite } from "../site/crawl.ts";
import { indexPages } from "../retrieve/chunk.ts";
import { fillVectors, type EmbedFn } from "../retrieve/embed.ts";
import { DEFAULT_POLICY } from "../retrieve/policy.ts";
import { brandFromPages, defaultWidget, extractBrand } from "./brand.ts";
import { defaultInstruction } from "./load.ts";
import type { AgentPackConfig } from "./types.ts";

const UA = "webagent-ingest/0.4";

export interface FromUrlOpts {
  out?: string;
  maxPages?: number;
  fetch?: typeof fetch;
  embed?: EmbedFn | false;
}

export async function fromUrl(start: string, opts: FromUrlOpts = {}): Promise<{ dir: string; config: AgentPackConfig }> {
  const origin = new URL(start).origin;
  const host = new URL(origin).hostname.replace(/^www\./, "");
  const out = opts.out || join(process.cwd(), "packs", "_generated", host);
  const fetchFn = opts.fetch ?? fetch;
  const max = opts.maxPages ?? 80;

  const state = await crawlSite(start, { maxPages: max, fetch: fetchFn });
  const llmsPages = await tryLlms(origin, fetchFn);
  const pages = [...state.pages, ...llmsPages];
  const homeHtml = await getText(origin + "/", fetchFn);
  const brand = homeHtml
    ? await extractBrand(homeHtml, origin, pages[0])
    : brandFromPages(pages, origin);
  const chips = (pages[0]?.headings ?? [])
    .filter((h) => h.length > 8 && h.length < 60)
    .slice(0, 4)
    .map((h) => "What should I know about " + h + "?");
  if (!chips.length) chips.push("What does this site offer?", "Where do I start?");
  const widget = defaultWidget(brand, chips);
  const llmsTxt = llmsPages[0]?.url;
  const config: AgentPackConfig = {
    id: host,
    origin,
    docs: llmsTxt ? { origin, llmsTxt } : { origin },
    brand,
    widget,
    sales: { technique: "help-from-docs" },
    model: { id: "gpt-4o-mini" },
    host: { port: 8787 },
    skills: [
      {
        id: "docs",
        name: "Docs retrieval",
        description: "Look up the matching public page and cite one URL.",
        tags: ["docs", "retrieval"],
      },
    ],
    card: {
      description: brand.tagline,
      instructions: "Help visitors using retrieved docs. No product-specific interview.",
    },
  };

  const chunks = indexPages(pages, DEFAULT_POLICY);
  try {
    await fillVectors(chunks, { embed: opts.embed, cachePath: join(out, "retrieve-cache.json") });
  } catch {
    /* lexical is fine */
  }

  mkdirSync(out, { recursive: true });
  writeFileSync(join(out, "pack.json"), JSON.stringify(config, null, 2) + "\n");
  writeFileSync(join(out, "instruction.md"), defaultInstruction(config) + "\n");
  writeFileSync(
    join(out, "pages.json"),
    JSON.stringify(
      pages.map((p) => ({ url: p.url, title: p.title, status: p.status, headings: p.headings.slice(0, 8) })),
      null,
      2,
    ) + "\n",
  );
  return { dir: out, config };
}

async function tryLlms(origin: string, fetchFn: typeof fetch) {
  const urls = [origin + "/llms.txt", origin.replace(/\/$/, "") + "/docs/llms.txt"];
  for (const url of urls) {
    const txt = await getText(url, fetchFn);
    if (txt && /https?:\/\//.test(txt) && txt.length > 40) {
      return [
        {
          url,
          status: 200,
          title: "docs index",
          description: "llms.txt",
          headings: ["llms.txt"],
          text: txt.slice(0, 5000),
          links: [...txt.matchAll(/https?:\/\/[^\s)]+/g)].map((m) => m[0]).slice(0, 40),
          forms: [],
          gated: false,
        },
      ];
    }
  }
  return [];
}

async function getText(url: string, fetchFn: typeof fetch): Promise<string> {
  try {
    const res = await fetchFn(url, { headers: { "User-Agent": UA, Accept: "text/html,text/plain" } });
    if (!res.ok) return "";
    return await res.text();
  } catch {
    return "";
  }
}
