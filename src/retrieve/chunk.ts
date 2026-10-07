import { DEFAULT_POLICY, pathOf } from "./policy.ts";
import type { PageShot } from "../site/types.ts";
import type { DocChunk, RetrievePolicy } from "./types.ts";

const WIN = 900;
const OVERLAP = 140;

export function indexPages(pages: PageShot[], policy: RetrievePolicy = DEFAULT_POLICY): DocChunk[] {
  const chunks: DocChunk[] = [];
  for (const p of pages) {
    if (!p.url || p.status < 200 || p.status >= 400) continue;
    const kind = policy.kindOf(p.url);
    const title = p.title || pathTitle(p.url);
    const body = [p.description, p.text].filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
    if (!body && !title) continue;
    const parts = splitPage(title, p.headings, body);
    const pri = policy.priorityOf(p.url, kind);
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]!;
      chunks.push({
        id: p.url + "#" + slug(part.section) + "-" + i,
        url: p.url,
        title,
        section: part.section,
        kind,
        headings: p.headings.slice(0, 16),
        text: part.text.slice(0, 4000),
        priority: pri,
      });
    }
  }
  return chunks;
}

export function kindOfUrl(url: string, policy: RetrievePolicy = DEFAULT_POLICY): string {
  return policy.kindOf(url);
}

export function embedText(c: Pick<DocChunk, "title" | "section" | "kind" | "text" | "url">): string {
  return ["[" + c.kind + "]", c.title, c.section !== c.title ? c.section : "", pathOf(c.url), c.text]
    .filter(Boolean)
    .join("\n")
    .slice(0, 2400);
}

function splitPage(title: string, headings: string[], body: string): { section: string; text: string }[] {
  const heads = uniq(headings.map((h) => h.trim()).filter((h) => h.length > 2));
  const cuts: { at: number; section: string }[] = [{ at: 0, section: title }];
  const lower = body.toLowerCase();
  for (const h of heads) {
    const i = lower.indexOf(h.toLowerCase());
    if (i >= 8) cuts.push({ at: i, section: h });
  }
  cuts.sort((a, b) => a.at - b.at);
  const raw: { section: string; text: string }[] = [];
  for (let i = 0; i < cuts.length; i++) {
    const start = cuts[i]!.at;
    const end = i + 1 < cuts.length ? cuts[i + 1]!.at : body.length;
    const text = body.slice(start, end).trim();
    if (text.length >= 40) raw.push({ section: cuts[i]!.section, text });
  }
  if (!raw.length) raw.push({ section: title, text: body || title });
  const out: { section: string; text: string }[] = [];
  for (const r of raw) {
    if (r.text.length <= WIN) {
      out.push(r);
      continue;
    }
    for (const w of windows(r.text, WIN, OVERLAP)) out.push({ section: r.section, text: w });
  }
  return out;
}

function windows(text: string, size: number, overlap: number): string[] {
  const out: string[] = [];
  let i = 0;
  while (i < text.length) {
    out.push(text.slice(i, i + size).trim());
    if (i + size >= text.length) break;
    i += size - overlap;
  }
  return out.filter((s) => s.length >= 40);
}

function pathTitle(url: string): string {
  const parts = pathOf(url).split("/").filter(Boolean);
  return (parts[parts.length - 1] || "page").replace(/[-_]/g, " ");
}

function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || "s";
}

function uniq(xs: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const x of xs) {
    const k = x.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(x);
  }
  return out;
}
