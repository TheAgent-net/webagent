/**
 * Clean RAG chunks. Drop tables, nav, and long tool schemas. Keep FAQ and prose.
 */
import type { CorpusPage } from "../site/corpus.ts";
import { faqsFrom, pageRole } from "./parse.ts";

export interface TextChunk {
  id: string;
  url: string;
  title: string;
  role: string;
  text: string;
}

export function chunkPages(pages: CorpusPage[]): TextChunk[] {
  const out: TextChunk[] = [];
  const seen = new Set<string>();
  for (const p of pages) {
    const role = pageRole(p.url);
    if (role === "catalog") continue;
    const url = p.url.replace(/\.md$/i, "");
    for (const faq of faqsFrom(p.text)) {
      const text = (faq.q + " " + faq.a).replace(/\s+/g, " ").trim();
      if (text.length < 40) continue;
      add(out, seen, {
        id: "faq:" + slug(url + ":" + faq.q),
        url,
        title: faq.q,
        role: "faq",
        text: text.slice(0, 700),
      });
    }
    const prose = cleanText(p.text);
    if (prose.length < 80) continue;
    const parts = splitProse(prose);
    parts.forEach((text, i) => {
      add(out, seen, {
        id: "prose:" + slug(url) + ":" + i,
        url,
        title: p.title.replace(/\s+\|.*$/, "").trim() || url,
        role: role === "app" ? "guide" : role,
        text,
      });
    });
  }
  return out;
}

export function cleanText(md: string): string {
  return md
    .replace(/^---[\s\S]*?---\n/, "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/^\|.*\|$/gm, "")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#{1,3}\s+/gm, "")
    .replace(/\bCopy page\b/gi, "")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+/g, " ")
    .trim();
}

function splitProse(text: string): string[] {
  const blocks = text.split(/\n\n+/).map((b) => b.trim()).filter((b) => b.length > 60);
  const out: string[] = [];
  let buf = "";
  for (const b of blocks) {
    if (/^[-*]\s*Category:|^Tools \(\d+\)|^Slug:/i.test(b)) continue;
    buf = buf ? buf + " " + b : b;
    if (buf.length >= 420) {
      out.push(buf.slice(0, 700));
      buf = "";
    }
    if (out.length >= 4) break;
  }
  if (buf.length > 80 && out.length < 4) out.push(buf.slice(0, 700));
  return out;
}

function add(out: TextChunk[], seen: Set<string>, c: TextChunk): void {
  if (seen.has(c.id) || seen.has(c.text.slice(0, 80))) return;
  seen.add(c.id);
  seen.add(c.text.slice(0, 80));
  out.push(c);
}

function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 80);
}
