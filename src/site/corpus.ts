/**
 * On-disk site corpus. The agent reads these files. It does not call a scrape API.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { buildPack } from "./pack.ts";
import type { PageShot, SitePack } from "./types.ts";

export interface CorpusPage {
  url: string;
  title: string;
  description: string;
  headings: string[];
  text: string;
  status: number;
}

export interface CorpusIndex {
  origin: string;
  savedAt: string;
  source: "firecrawl" | "files";
  pages: { url: string; title: string; file: string }[];
}

export function saveCorpus(dir: string, origin: string, pages: CorpusPage[]): number {
  const pageDir = join(dir, "pages");
  rmSync(pageDir, { recursive: true, force: true });
  mkdirSync(pageDir, { recursive: true });
  const seen = new Set<string>();
  const index: CorpusIndex = { origin, savedAt: new Date().toISOString(), source: "firecrawl", pages: [] };
  for (const p of pages) {
    if (!p.url || !p.text) continue;
    const file = fileName(p.url, seen);
    writeFileSync(join(pageDir, file), asMarkdown(p));
    index.pages.push({ url: p.url, title: p.title, file });
  }
  writeFileSync(join(dir, "index.json"), JSON.stringify(index, null, 2));
  writeFileSync(
    join(dir, "README.md"),
    [
      "# Site corpus",
      "",
      "Scraped once with Firecrawl. The public agent reads these files.",
      "It does not call Firecrawl at run time.",
      "",
      "- Origin: " + origin,
      "- Pages: " + index.pages.length,
      "- Saved: " + index.savedAt,
      "",
      "Lookup scores `pages/*.md` and returns snippets.",
    ].join("\n"),
  );
  return index.pages.length;
}

export function hasCorpus(dir: string): boolean {
  return existsSync(join(dir, "index.json")) && existsSync(join(dir, "pages"));
}

/** Build a SitePack from local markdown files. No network. */
export function loadCorpus(dir: string): SitePack {
  const index = JSON.parse(readFileSync(join(dir, "index.json"), "utf8")) as CorpusIndex;
  const pages: PageShot[] = [];
  const listed = index.pages.length
    ? index.pages.map((p) => ({ url: p.url, title: p.title, file: p.file }))
    : readdirSync(join(dir, "pages"))
        .filter((f) => f.endsWith(".md"))
        .map((f) => ({ url: "", title: "", file: f }));
  for (const row of listed) {
    const raw = readFileSync(join(dir, "pages", row.file), "utf8");
    pages.push(pageFromMarkdown(raw, row.url, row.title));
  }
  const pack = buildPack({
    origin: index.origin,
    pages,
    pending: [],
    seen: new Set(pages.map((p) => p.url)),
    cookies: "",
  });
  pack.corpusDir = dir;
  return pack;
}

export function lookupCorpus(
  dir: string,
  query: string,
  limit = 6,
): { url: string; title: string; file: string; snippet: string }[] {
  const pack = loadCorpus(dir);
  const words = query
    .toLowerCase()
    .split(/\W+/)
    .filter((w) => w.length > 2 && !STOP.has(w));
  const scored: { score: number; url: string; title: string; file: string; snippet: string }[] = [];
  const index = JSON.parse(readFileSync(join(dir, "index.json"), "utf8")) as CorpusIndex;
  const fileOf = new Map(index.pages.map((p) => [p.url, p.file]));
  for (const p of pack.pages) {
    const hay = (p.title + " " + p.headings.join(" ") + " " + p.text).toLowerCase();
    let score = 0;
    for (const w of words) if (hay.includes(w)) score += w.length;
    if (!words.length) score = 1;
    if (score > 0) {
      scored.push({
        score,
        url: p.url,
        title: p.title,
        file: fileOf.get(p.url) ?? basename(p.url),
        snippet: snippetAround(p.text, words),
      });
    }
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map(({ url, title, file, snippet }) => ({ url, title, file, snippet }));
}

function pageFromMarkdown(raw: string, urlHint: string, titleHint: string): PageShot {
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
  const url = meta.url || urlHint;
  const title = meta.title || titleHint || firstHeading(body) || url;
  const headings = headingsFrom(body);
  return {
    url,
    status: Number(meta.status || 200),
    title,
    description: meta.description || "",
    headings,
    text: body.trim(),
    links: [],
    forms: [],
    gated: false,
  };
}

function asMarkdown(p: CorpusPage): string {
  return [
    "---",
    "url: " + p.url,
    "title: " + p.title.replace(/\n/g, " "),
    "description: " + (p.description || "").replace(/\n/g, " "),
    "status: " + p.status,
    "---",
    "",
    p.text.trim(),
    "",
  ].join("\n");
}

function fileName(url: string, seen: Set<string>): string {
  let path = "/";
  try {
    path = new URL(url).pathname || "/";
  } catch {
    path = url;
  }
  let base = path.replace(/\/+$/, "") || "home";
  base = base.replace(/^\//, "").replace(/[^a-zA-Z0-9/_-]+/g, "-").replace(/\//g, "__") || "home";
  if (base === "home" || path === "/") base = "home";
  let name = base + ".md";
  let n = 2;
  while (seen.has(name)) {
    name = base + "-" + n + ".md";
    n++;
  }
  seen.add(name);
  return name;
}

function firstHeading(md: string): string {
  for (const line of md.split("\n")) {
    const m = /^(#{1,3})\s+(.+)$/.exec(line.trim());
    if (m) return m[2]!.replace(/[#*_`]/g, "").trim();
  }
  return "";
}

function headingsFrom(md: string): string[] {
  const out: string[] = [];
  for (const line of md.split("\n")) {
    const m = /^(#{1,3})\s+(.+)$/.exec(line.trim());
    if (m) out.push(m[2]!.replace(/[#*_`]/g, "").trim());
  }
  return out.slice(0, 40);
}

function snippetAround(text: string, words: string[]): string {
  const lower = text.toLowerCase();
  let idx = 0;
  for (const w of words) {
    const i = lower.indexOf(w);
    if (i >= 0) {
      idx = i;
      break;
    }
  }
  const start = Math.max(0, idx - 60);
  return text.slice(start, start + 420).replace(/\s+/g, " ").trim();
}

const STOP = new Set([
  "the", "and", "for", "you", "are", "what", "does", "can", "how", "from", "with", "this", "that",
  "need", "get", "our", "your", "should", "give", "short", "keep", "than", "compared", "about",
]);
