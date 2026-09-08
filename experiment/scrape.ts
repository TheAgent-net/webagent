#!/usr/bin/env bun
/**
 * One-shot Firecrawl crawl of a public site. Writes markdown files.
 * The live agent reads those files. It does not call Firecrawl.
 */
import { isBlog, saveCorpus, type CorpusPage } from "../src/site/corpus.ts";

const ORIGIN = process.argv[2] || "https://www.corgi.insure";
const OUT = process.argv[3] || "corpus/corgi";
const LIMIT = Number(process.env.FIRECRAWL_LIMIT || 200);

if (import.meta.main) {
  const key = process.env.FIRECRAWL_API_KEY ?? "";
  if (!key) throw new Error("missing FIRECRAWL_API_KEY");
  const pages = await crawlSite(ORIGIN, key, LIMIT);
  const saved = saveCorpus(OUT, ORIGIN, pages);
  console.log("wrote " + saved + " pages to " + OUT);
}

interface FireDoc {
  markdown?: string;
  metadata?: {
    title?: string | string[];
    description?: string | string[];
    sourceURL?: string;
    url?: string;
    statusCode?: number;
  };
}

export async function crawlSite(origin: string, key: string, limit: number): Promise<CorpusPage[]> {
  const start = await fire("https://api.firecrawl.dev/v2/crawl", key, {
    method: "POST",
    body: JSON.stringify({
      url: origin,
      limit,
      crawlEntireDomain: true,
      sitemap: "include",
      excludePaths: ["blog", "blog/*"],
      scrapeOptions: { formats: ["markdown"], onlyMainContent: true },
    }),
  });
  const id = String((start as { id?: string }).id ?? "");
  if (!id) throw new Error("firecrawl crawl did not return an id: " + JSON.stringify(start).slice(0, 400));
  console.log("crawl id " + id);
  const byUrl = new Map<string, FireDoc>();
  let next: string | undefined = "https://api.firecrawl.dev/v2/crawl/" + id;
  while (next) {
    const st = (await fire(next, key, { method: "GET" })) as {
      status?: string;
      completed?: number;
      total?: number;
      next?: string | null;
      data?: FireDoc[];
    };
    console.log("status " + (st.status ?? "?") + " " + (st.completed ?? 0) + "/" + (st.total ?? 0));
    if (st.status === "failed") throw new Error("firecrawl crawl failed");
    for (const doc of st.data ?? []) {
      const url = String(doc.metadata?.url || doc.metadata?.sourceURL || "");
      if (url) byUrl.set(url, doc);
    }
    if (st.status === "completed") {
      next = st.next || undefined;
      continue;
    }
    next = st.next || "https://api.firecrawl.dev/v2/crawl/" + id;
    await sleep(2500);
  }
  return [...byUrl.values()].map(asPage).filter((p) => p.url && p.text && !isBlog(p.url));
}

function asPage(doc: FireDoc): CorpusPage {
  const meta = doc.metadata ?? {};
  const url = String(meta.url || meta.sourceURL || "");
  const title = first(meta.title) || url;
  const text = (doc.markdown ?? "").trim();
  return {
    url,
    title,
    description: first(meta.description),
    headings: headingsFrom(text),
    text,
    status: meta.statusCode ?? 200,
  };
}

function first(v: string | string[] | undefined): string {
  if (Array.isArray(v)) return v[0] ?? "";
  return v ?? "";
}

function headingsFrom(md: string): string[] {
  const out: string[] = [];
  for (const line of md.split("\n")) {
    const m = /^(#{1,3})\s+(.+)$/.exec(line.trim());
    if (m) out.push(m[2]!.replace(/[#*_`]/g, "").trim());
  }
  return out.slice(0, 20);
}

async function fire(url: string, key: string, init: { method: string; body?: string }): Promise<unknown> {
  const res = await fetch(url, {
    method: init.method,
    headers: { Authorization: "Bearer " + key, "Content-Type": "application/json" },
    body: init.body,
  });
  const text = await res.text();
  if (res.status >= 300) throw new Error("firecrawl " + res.status + ": " + text.slice(0, 800));
  return JSON.parse(text) as unknown;
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
