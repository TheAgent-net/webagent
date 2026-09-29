import { crawlSite } from "../site/crawl.ts";
import { extractPage } from "../site/extract.ts";
import type { PageShot } from "../site/types.ts";
import { DOCS, LLMS, MARKET, PRIORITY_DOCS } from "./catalog.ts";
import { pageFromMarkdown, parseLlmsTxt, rankDocs } from "./markdown.ts";
import type { FetchLike } from "./types.ts";

const UA = "webagent-ingest/0.4";

export interface SmallestCrawl {
  origin: string;
  docsOrigin: string;
  marketing: PageShot[];
  docs: PageShot[];
  pages: PageShot[];
}

/** Marketing origin + every docs.smallest.ai page listed in llms.txt (.md). */
export async function crawlSmallest(opts: { maxPages?: number; fetch?: FetchLike } = {}): Promise<SmallestCrawl> {
  const fetchFn = (opts.fetch ?? fetch) as typeof fetch;
  const max = opts.maxPages ?? 220;
  const marketingBudget = Math.min(40, Math.max(8, Math.floor(max * 0.2)));
  const docsBudget = Math.max(20, max - marketingBudget);

  const [marketing, docs] = await Promise.all([
    crawlMarketing(fetchFn, marketingBudget),
    crawlDocs(fetchFn, docsBudget),
  ]);

  const pages = [...marketing, ...docs];
  return { origin: MARKET, docsOrigin: DOCS, marketing, docs, pages };
}

async function crawlMarketing(fetchFn: typeof fetch, maxPages: number): Promise<PageShot[]> {
  try {
    const state = await crawlSite(MARKET + "/", { maxPages, fetch: fetchFn });
    const pages = state.pages.filter((p) => p.status > 0);
    if (pages.length) return pages;
  } catch {
    /* fall through to a direct home fetch */
  }
  const home = await getHtml(MARKET + "/", fetchFn);
  return home ? [home] : [];
}

async function crawlDocs(fetchFn: typeof fetch, budget: number): Promise<PageShot[]> {
  const indexTxt = await getText(LLMS, fetchFn);
  const links = rankDocs(parseLlmsTxt(indexTxt || ""), PRIORITY_DOCS).slice(0, budget);
  const pages: PageShot[] = [];
  if (indexTxt) {
    pages.push({
      url: LLMS,
      status: 200,
      title: "Smallest AI docs index",
      description: "Machine-readable index of every docs page.",
      headings: ["llms.txt"],
      text: indexTxt.slice(0, 5000),
      links: links.map((l) => l.url),
      forms: [],
      gated: false,
    });
  }

  const extra = [
    DOCS + "/voice-agents/developer-guide/get-started/build-with-a-coding-agent.md",
    DOCS + "/voice-agents/platform/get-started/quick-start.md",
  ];
  const seen = new Set(links.map((l) => l.mdUrl));
  for (const mdUrl of extra) {
    if (seen.has(mdUrl)) continue;
    seen.add(mdUrl);
    links.unshift({
      title: mdUrl.split("/").pop() || mdUrl,
      url: mdUrl.replace(/\.md$/, ""),
      mdUrl,
      description: "",
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
  const html = await getHtml(mdUrl.replace(/\.md$/, ""), fetchFn);
  return html;
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
  return /^#\s|^\s*> This page is part of Smallest/m.test(s.slice(0, 400));
}
