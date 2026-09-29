import type { PageShot } from "../site/types.ts";
import { PRIORITY_DOCS } from "./catalog.ts";
import type { DocChunk, DocHit, DocKind, SmallestPack } from "./types.ts";

const ALIAS: [RegExp, string[]][] = [
  [/\b(tts|text[- ]?to[- ]?speech|synthesi|speak|voice clone|lightning)\b/, ["lightning", "tts"]],
  [/\b(stt|speech[- ]?to[- ]?text|transcri|dictat|caption|pulse)\b/, ["pulse", "stt"]],
  [/\b(llm|language model|electron|brain)\b/, ["electron", "llm"]],
  [/\b(hydra|speech[- ]?to[- ]?speech|s2s|full[- ]?duplex)\b/, ["hydra", "s2s"]],
  [/\b(pipecat|livekit|own stack|waves|orchestrat)\b/, ["pipecat", "livekit", "waves"]],
  [/\b(atoms|hosted|dashboard|phone|telephony|inbound|outbound|campaign)\b/, ["atoms", "platform", "phone"]],
  [/\b(interrupt|voicemail|speech speed|denois|turn detection|speech settings)\b/, ["speech", "interruptions"]],
  [/\b(widget|web sdk|embed)\b/, ["widget", "web"]],
  [/\b(knowledge|faq|pdf|kb)\b/, ["knowledge", "base"]],
  [/\b(crew|byom|custom llm)\b/, ["crew", "byom"]],
];

export function indexDocs(pages: PageShot[]): DocChunk[] {
  const chunks: DocChunk[] = [];
  for (const p of pages) {
    if (!p.url || p.status < 200 || p.status >= 400) continue;
    const kind = kindOf(p.url);
    const section = p.headings[0] || p.title || pathTitle(p.url);
    const text = [p.title, p.description, p.headings.join(" "), p.text].filter(Boolean).join("\n");
    if (!text.trim()) continue;
    chunks.push({
      id: p.url,
      url: p.url,
      title: p.title || pathTitle(p.url),
      section,
      kind,
      headings: p.headings.slice(0, 16),
      text: text.replace(/\s+/g, " ").trim().slice(0, 8000),
      priority: priorityOf(p.url, kind),
    });
  }
  return chunks;
}

export function searchDocs(pack: SmallestPack, query: string, opts?: { focus?: DocKind | "any"; limit?: number }): DocHit[] {
  const chunks = pack.chunks?.length ? pack.chunks : indexDocs(pack.pages);
  const q = query.trim();
  if (!q || !chunks.length) return [];
  const parts = queryParts(q);
  const terms = uniq([...parts.core, ...parts.extra]);
  const df = docFreq(chunks, terms);
  const focus = opts?.focus && opts.focus !== "any" ? opts.focus : undefined;
  const scored: DocHit[] = [];
  for (const c of chunks) {
    if (focus && c.kind !== focus && !(focus === "guide" && (c.kind === "platform" || c.kind === "guide"))) continue;
    const score = scoreChunk(c, parts, df, chunks.length);
    if (score <= 0) continue;
    scored.push({
      title: c.title,
      url: c.url,
      section: c.section,
      kind: c.kind,
      snippet: snippetAround(c.text, terms),
      score: Math.round(score * 100) / 100,
    });
  }
  scored.sort((a, b) => b.score - a.score);
  const seen = new Set<string>();
  const out: DocHit[] = [];
  for (const h of scored) {
    if (seen.has(h.url)) continue;
    seen.add(h.url);
    out.push(h);
    if (out.length >= (opts?.limit ?? 4)) break;
  }
  return out;
}

export function expandQuery(query: string): string[] {
  const p = queryParts(query);
  return uniq([...p.core, ...p.extra]);
}

function queryParts(query: string): { core: string[]; extra: string[] } {
  const core = tokenize(query).filter((t) => t.length > 1 && !STOP.has(t));
  const extra: string[] = [];
  const lower = query.toLowerCase();
  for (const [re, aliases] of ALIAS) {
    if (re.test(lower)) extra.push(...aliases);
  }
  return { core, extra: extra.filter((t) => t.length > 1 && !STOP.has(t)) };
}

function scoreChunk(
  c: DocChunk,
  parts: { core: string[]; extra: string[] },
  df: Map<string, number>,
  n: number,
): number {
  const title = c.title.toLowerCase();
  const heads = c.headings.join(" ").toLowerCase();
  const url = c.url.toLowerCase();
  const body = c.text.toLowerCase();
  let score = c.priority;
  if (c.kind !== "marketing") score += 1.5;
  score += weigh(parts.core, df, n, title, heads, url, body, 1);
  score += weigh(parts.extra, df, n, title, heads, url, body, 0.28);
  return score;
}

function weigh(
  terms: string[],
  df: Map<string, number>,
  n: number,
  title: string,
  heads: string,
  url: string,
  body: string,
  w: number,
): number {
  let score = 0;
  for (const t of terms) {
    const idf = Math.log(1 + n / (1 + (df.get(t) ?? 0)));
    if (title.includes(t)) score += 12 * idf * w;
    if (heads.includes(t)) score += 7 * idf * w;
    if (pathOf(url).includes(t)) score += 8 * idf * w;
    const tf = count(body, t);
    if (tf) score += Math.min(4, 1 + Math.log(tf)) * idf * w;
  }
  return score;
}

function docFreq(chunks: DocChunk[], terms: string[]): Map<string, number> {
  const df = new Map<string, number>();
  for (const t of terms) {
    let n = 0;
    for (const c of chunks) {
      const hay = (c.title + " " + c.headings.join(" ") + " " + c.text + " " + c.url).toLowerCase();
      if (hay.includes(t)) n++;
    }
    df.set(t, n);
  }
  return df;
}

function kindOf(url: string): DocKind {
  const p = pathOf(url);
  if (p.includes("/text-to-speech") || p.includes("lightning")) return "model";
  if (p.includes("/speech-to-text") || p.includes("pulse")) return "model";
  if (p.includes("electron") || p.includes("/llm-")) return "model";
  if (p.includes("hydra") || p.includes("speech-to-speech")) return "model";
  if (p.includes("/integrations/") || p.includes("pipecat") || p.includes("live-kit") || p.includes("livekit")) {
    return "integration";
  }
  if (p.includes("/platform/") || p.includes("/voice-agents/")) return "platform";
  if (p.includes("/developer-guide/")) return "guide";
  if (p.includes("docs.smallest.ai")) return "guide";
  return "marketing";
}

function priorityOf(url: string, kind: DocKind): number {
  const p = pathOf(url);
  const i = PRIORITY_DOCS.findIndex((d) => p.includes(d));
  if (i >= 0) return 4 - i * 0.05;
  if (kind === "marketing") return 0;
  return 1;
}

function snippetAround(text: string, terms: string[]): string {
  const lower = text.toLowerCase();
  let idx = 0;
  for (const t of terms) {
    const i = lower.indexOf(t);
    if (i >= 0) {
      idx = i;
      break;
    }
  }
  const start = Math.max(0, idx - 80);
  return text.slice(start, start + 420).replace(/\s+/g, " ").trim();
}

function tokenize(s: string): string[] {
  return s.toLowerCase().split(/[^a-z0-9+]+/).filter(Boolean);
}

function count(hay: string, needle: string): number {
  if (!needle) return 0;
  let n = 0;
  let from = 0;
  while (from < hay.length) {
    const i = hay.indexOf(needle, from);
    if (i < 0) break;
    n++;
    from = i + needle.length;
  }
  return n;
}

function pathOf(url: string): string {
  try {
    return new URL(url).pathname.toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}

function pathTitle(url: string): string {
  const parts = pathOf(url).split("/").filter(Boolean);
  return (parts[parts.length - 1] || "page").replace(/[-_]/g, " ");
}

function uniq(xs: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const x of xs) {
    if (seen.has(x)) continue;
    seen.add(x);
    out.push(x);
  }
  return out;
}

const STOP = new Set([
  "the", "and", "for", "you", "are", "what", "does", "can", "how", "from", "with", "this", "that",
  "need", "get", "our", "your", "should", "give", "short", "keep", "than", "about", "use", "using",
]);
