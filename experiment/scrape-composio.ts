#!/usr/bin/env bun
/**
 * One-shot Firecrawl crawl of Composio docs and the toolkit catalog.
 * Writes markdown files. The live agent reads those files. It does not call Firecrawl.
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { clipAppPage } from "../src/apps/parse.ts";
import { saveCorpus, type CorpusPage } from "../src/site/corpus.ts";
import { buildGraph, saveGraph } from "../src/apps/graph.ts";
import { CORPUS_COMPOSIO } from "../src/apps/types.ts";

const DOCS = "https://docs.composio.dev";
const OUT = process.argv.slice(2).find((a) => !a.startsWith("--")) || CORPUS_COMPOSIO;
const LIMIT = Number(process.env.FIRECRAWL_LIMIT || 400);

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

/** Popular apps + auth/error docs. A blind crawl of 400 pages often misses these. */
const MUST = [
  "/toolkits.md",
  "/docs/quickstart.md",
  "/docs/authentication.md",
  "/docs/authentication/custom-app-vs-managed-app.md",
  "/docs/authentication/controlling-scopes.md",
  "/docs/triggers.md",
  "/docs/configuring-sessions.md",
  "/docs/how-composio-works.md",
  "/kb/guide/faqs.md",
  "/kb/guide/platform-google-oauth.md",
  "/kb/guide/sdk-tool-execution-retries.md",
  "/reference/errors.md",
  "/reference/v3/errors.md",
  ...[
    "gmail", "github", "slack", "outlook", "googlecalendar", "notion", "googlesheets",
    "supabase", "hubspot", "linear", "airtable", "jira", "discord", "microsoft_teams",
    "asana", "salesforce", "calendly", "trello", "clickup", "stripe", "mailchimp",
    "attio", "googlemeet", "dropbox", "confluence", "zendesk", "pagerduty", "zoom",
    "linkedin", "twitter", "googledrive", "googledocs", "tavily", "perplexityai",
    "whatsapp", "telegram", "resend", "sendgrid", "gitlab",
  ].flatMap((s) => ["/toolkits/" + s + ".md", "/kb/toolkit/" + s, "/kb/guide/toolkits-" + s + ".md"]),
];

export async function crawlAll(key: string, limit: number): Promise<CorpusPage[]> {
  const byUrl = new Map<string, CorpusPage>();
  const docs = await crawlSite(DOCS, key, limit, {
    includePaths: [
      "docs",
      "docs/*",
      "kb",
      "kb/*",
      "reference",
      "reference/*",
      "toolkits",
      "toolkits/*",
      "examples",
      "examples/*",
    ],
  });
  for (const p of docs) byUrl.set(normUrl(p.url), clip(p));
  const hasCatalog = [...byUrl.values()].some((p) => /All Toolkits/.test(p.text) && /\| Slug \|/.test(p.text));
  if (!hasCatalog) {
    const cat = (await fetchMd(DOCS + "/toolkits.md")) || (await scrapeOneRetry(DOCS + "/toolkits.md", key));
    if (cat) byUrl.set(normUrl(cat.url), cat);
  }
  for (const path of MUST) {
    const url = DOCS + path;
    const cur = byUrl.get(normUrl(url));
    if (cur && !thinPage(cur)) continue;
    const page = (await fetchMd(url)) || (await scrapeOneRetry(url, key));
    if (page) byUrl.set(normUrl(page.url), keepBetter(cur, clip(page)));
  }
  return [...byUrl.values()];
}

function normUrl(url: string): string {
  return url.replace(/\.md$/i, "").replace(/\/$/, "");
}

function clip(p: CorpusPage): CorpusPage {
  const u = p.url.toLowerCase();
  if (!/\/toolkits\/[^/]+/.test(u) || /\/toolkits(\.md)?$/.test(u.replace(/\/$/, ""))) return p;
  return { ...p, text: clipAppPage(p.text) };
}

/** Merge on-disk pages with MUST scrapes. No full crawl. */
export async function fillMust(key: string, dir: string): Promise<CorpusPage[]> {
  const byUrl = new Map<string, CorpusPage>();
  for (const p of loadPages(dir)) byUrl.set(normUrl(p.url), clip(p));
  const need = MUST.filter((path) => {
    const cur = byUrl.get(normUrl(DOCS + path));
    return !cur || thinPage(cur);
  });
  await pool(need, 6, async (path) => {
    const url = DOCS + path;
    console.log("fetch " + url);
    const page = (await fetchMd(url)) || (await scrapeOneRetry(url, key));
    if (page) byUrl.set(normUrl(page.url), keepBetter(byUrl.get(normUrl(url)), clip(page)));
  });
  return [...byUrl.values()];
}

async function pool<T>(items: T[], n: number, fn: (item: T) => Promise<void>): Promise<void> {
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(n, items.length) }, async () => {
      while (i < items.length) {
        const item = items[i++]!;
        try {
          await fn(item);
        } catch (err) {
          console.error("skip " + String(item) + " " + (err instanceof Error ? err.message : err));
        }
      }
    }),
  );
}

function thinPage(p: CorpusPage): boolean {
  return !/Category:/i.test(p.text) && !/\| Slug \|/.test(p.text);
}

function keepBetter(a: CorpusPage | undefined, b: CorpusPage | null): CorpusPage {
  if (!a) return b!;
  if (!b) return a;
  const score = (p: CorpusPage) =>
    p.text.length + (/Category:/i.test(p.text) ? 8000 : 0) + (/\| Slug \|/.test(p.text) ? 20000 : 0);
  return score(a) >= score(b) ? a : b;
}

function loadPages(dir: string): CorpusPage[] {
  const indexFile = join(dir, "index.json");
  if (!existsSync(indexFile)) return [];
  const index = JSON.parse(readFileSync(indexFile, "utf8")) as {
    pages: { url: string; title: string; file: string }[];
  };
  const rows = index.pages.length
    ? index.pages
    : readdirSync(join(dir, "pages")).filter((f) => f.endsWith(".md")).map((file) => ({ url: "", title: "", file }));
  const out: CorpusPage[] = [];
  for (const row of rows) {
    const raw = readFileSync(join(dir, "pages", row.file), "utf8");
    const meta: Record<string, string> = {};
    let body = raw;
    if (raw.startsWith("---\n")) {
      const end = raw.indexOf("\n---\n", 4);
      if (end > 0) {
        for (const line of raw.slice(4, end).split("\n")) {
          const i = line.indexOf(":");
          if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
        }
        body = raw.slice(end + 5);
      }
    }
    out.push({
      url: meta.url || row.url,
      title: meta.title || row.title,
      description: meta.description || "",
      headings: [],
      text: body.trim(),
      status: 200,
    });
  }
  return out;
}

export async function crawlSite(
  origin: string,
  key: string,
  limit: number,
  extra: Record<string, unknown> = {},
): Promise<CorpusPage[]> {
  const start = await fire("https://api.firecrawl.dev/v2/crawl", key, {
    method: "POST",
    body: JSON.stringify({
      url: origin,
      limit,
      crawlEntireDomain: true,
      sitemap: "include",
      scrapeOptions: { formats: ["markdown"], onlyMainContent: true },
      ...extra,
    }),
  });
  const id = String((start as { id?: string }).id ?? "");
  if (!id) throw new Error("firecrawl crawl did not return an id: " + JSON.stringify(start).slice(0, 400));
  console.log("crawl id " + id + " for " + origin);
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
  return [...byUrl.values()].map(asPage).filter((p) => p.url && p.text);
}

async function scrapeOne(url: string, key: string): Promise<CorpusPage | null> {
  const raw = await fire("https://api.firecrawl.dev/v2/scrape", key, {
    method: "POST",
    body: JSON.stringify({ url, formats: ["markdown"], onlyMainContent: true }),
  });
  const doc = (raw as { data?: FireDoc }).data ?? (raw as FireDoc);
  const page = asPage(doc);
  return page.url && page.text ? page : null;
}

async function scrapeOneRetry(url: string, key: string, tries = 4): Promise<CorpusPage | null> {
  for (let i = 0; i < tries; i++) {
    try {
      return await scrapeOne(url, key);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (!/429|rate limit/i.test(msg) || i === tries - 1) throw err;
      const wait = 15000 * (i + 1);
      console.log("rate limit, wait " + wait + "ms");
      await sleep(wait);
    }
  }
  return null;
}

/** Composio serves page.md as the source. Prefer this over Firecrawl for catalog and FAQs. */
async function fetchMd(url: string): Promise<CorpusPage | null> {
  const mdUrl = url.endsWith(".md") ? url : url.replace(/\/?$/, "") + ".md";
  try {
    const res = await fetch(mdUrl, { headers: { Accept: "text/markdown, text/plain, */*" } });
    if (res.status >= 300) return null;
    const text = (await res.text()).trim();
    if (text.length < 40 || /^<!doctype html/i.test(text)) return null;
    return {
      url: mdUrl.replace(/\.md$/i, ""),
      title: firstHeading(text) || mdUrl,
      description: "",
      headings: headingsFrom(text),
      text,
      status: 200,
    };
  } catch {
    return null;
  }
}

function firstHeading(md: string): string {
  for (const line of md.split("\n")) {
    const m = /^(#{1,3})\s+(.+)$/.exec(line.trim());
    if (m) return m[2]!.replace(/[#*_`]/g, "").trim();
  }
  return "";
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

if (import.meta.main) {
  const key = process.env.FIRECRAWL_API_KEY ?? "";
  if (!key) throw new Error("missing FIRECRAWL_API_KEY");
  const mustOnly = process.argv.includes("--must");
  const pages = mustOnly ? await fillMust(key, OUT) : await crawlAll(key, LIMIT);
  const saved = saveCorpus(OUT, DOCS, pages);
  const graph = buildGraph(DOCS, pages);
  saveGraph(OUT, graph);
  console.log("wrote " + saved + " pages and " + graph.nodes.length + " graph nodes to " + OUT);
}
