import { embedInput, indexDocs } from "./chunk.ts";
import { cosine, type EmbedFn } from "./embed.ts";
import type { DocChunk, DocHit, DocKind, SmallestPack } from "./types.ts";

export { indexDocs } from "./chunk.ts";

const ALIAS: [RegExp, string[]][] = [
  [/\b(tts|text[- ]?to[- ]?speech|synthesi|speak|voice clone|lightning)\b/, ["lightning", "tts"]],
  [/\b(stt|speech[- ]?to[- ]?text|transcri|dictat|caption|pulse)\b/, ["pulse", "stt"]],
  [/\b(llm|language model|electron|brain)\b/, ["electron", "llm"]],
  [/\b(hydra|speech[- ]?to[- ]?speech|s2s|full[- ]?duplex)\b/, ["hydra", "s2s"]],
  [/\b(atoms|hosted|dashboard|phone|telephony|inbound|outbound|campaign|voice agent|create an agent)\b/, ["atoms", "platform", "agent"]],
  [/\b(interrupt|voicemail|speech speed|denois|turn detection|speech settings|wait for user)\b/, ["speech", "interruptions"]],
  [/\b(widget|web sdk|embed)\b/, ["widget", "web"]],
  [/\b(knowledge|faq|pdf|kb)\b/, ["knowledge", "base"]],
  [/\b(crew|byom|custom llm)\b/, ["crew", "byom"]],
];

const K1 = 1.2;
const B = 0.75;

export function searchDocs(pack: SmallestPack, query: string, opts?: { focus?: DocKind | "any"; limit?: number }): DocHit[] {
  return rankHits(pack, query, undefined, opts);
}

export async function searchDocsHybrid(
  pack: SmallestPack,
  query: string,
  embed: EmbedFn | undefined,
  opts?: { focus?: DocKind | "any"; limit?: number },
): Promise<DocHit[]> {
  let qvec: number[] | undefined;
  const chunks = pack.chunks?.length ? pack.chunks : indexDocs(pack.pages);
  if (embed && chunks.some((c) => c.vector?.length)) {
    const got = await embed([queryEmbedText(query)]);
    qvec = got[0];
  }
  return rankHits(pack, query, qvec, opts);
}

export function expandQuery(query: string): string[] {
  const p = queryParts(query);
  return uniq([...p.core, ...p.extra]);
}

function rankHits(
  pack: SmallestPack,
  query: string,
  qvec: number[] | undefined,
  opts?: { focus?: DocKind | "any"; limit?: number },
): DocHit[] {
  const chunks = pack.chunks?.length ? pack.chunks : indexDocs(pack.pages);
  const q = query.trim();
  if (!q || !chunks.length) return [];
  const parts = queryParts(q);
  const terms = uniq([...parts.core, ...parts.extra]);
  const integration = wantsIntegration(q);
  const focus = opts?.focus && opts.focus !== "any" ? opts.focus : undefined;
  const pool = chunks.filter((c) => {
    if (focus && c.kind !== focus && !(focus === "guide" && (c.kind === "platform" || c.kind === "guide"))) return false;
    if (c.kind === "integration" && !integration) return false;
    return true;
  });
  const lex = bm25(pool, parts);
  const maxLex = Math.max(...lex, 0.0001);
  const scored: { i: number; score: number }[] = [];
  for (let i = 0; i < pool.length; i++) {
    const c = pool[i]!;
    let s = lex[i]! / maxLex;
    if (qvec && c.vector?.length) s = 0.5 * s + 0.5 * Math.max(0, cosine(qvec, c.vector));
    s += kindPrior(c, integration) * 0.01;
    if (s <= 0) continue;
    scored.push({ i, score: s });
  }
  scored.sort((a, b) => b.score - a.score);
  const seen = new Set<string>();
  const out: DocHit[] = [];
  for (const row of scored) {
    const c = pool[row.i]!;
    if (seen.has(c.url)) continue;
    seen.add(c.url);
    out.push({
      title: c.title,
      url: c.url,
      section: c.section,
      kind: c.kind,
      snippet: snippetAround(c.text, terms),
      score: Math.round(row.score * 1000) / 1000,
    });
    if (out.length >= (opts?.limit ?? 4)) break;
  }
  return out;
}

function bm25(chunks: DocChunk[], parts: { core: string[]; extra: string[] }): number[] {
  const docs = chunks.map((c) => tokenize(embedInput(c) + " " + c.title + " " + c.section));
  const N = docs.length || 1;
  const avgdl = docs.reduce((s, d) => s + d.length, 0) / N;
  const df = new Map<string, number>();
  const terms = uniq([...parts.core, ...parts.extra]);
  for (const t of terms) {
    let n = 0;
    for (const d of docs) if (d.includes(t)) n++;
    df.set(t, n);
  }
  return chunks.map((c, i) => {
    const doc = docs[i]!;
    const dl = doc.length || 1;
    let score = c.priority * 0.08;
    if (c.kind === "integration") score += 5;
    else if (c.kind === "platform") score += 0.35;
    const title = c.title.toLowerCase();
    const section = c.section.toLowerCase();
    const url = c.url.toLowerCase();
    for (const t of parts.core) {
      score += termScore(t, doc, dl, avgdl, N, df.get(t) ?? 0, title, section, url, 1);
    }
    for (const t of parts.extra) {
      score += termScore(t, doc, dl, avgdl, N, df.get(t) ?? 0, title, section, url, 0.28);
    }
    return score;
  });
}

function termScore(
  t: string,
  doc: string[],
  dl: number,
  avgdl: number,
  N: number,
  dft: number,
  title: string,
  section: string,
  url: string,
  w: number,
): number {
  const tf = countIn(doc, t) + (title.includes(t) ? 2 : 0) + (section.includes(t) ? 1.5 : 0) + (url.includes(t) ? 1.5 : 0);
  if (tf <= 0) return 0;
  const idf = Math.log(1 + (N - dft + 0.5) / (dft + 0.5));
  const den = tf + K1 * (1 - B + B * (dl / (avgdl || 1)));
  return w * idf * ((tf * (K1 + 1)) / den);
}

function kindPrior(c: DocChunk, integration: boolean): number {
  if (c.kind === "integration") return integration ? 4 : 0;
  if (c.kind === "platform") return integration ? 0 : 3;
  if (c.kind === "guide") return 2;
  if (c.kind === "model") return 1.2;
  return 0.2;
}

function queryEmbedText(query: string): string {
  const parts = queryParts(query);
  const kind = wantsIntegration(query) ? "integration" : "platform";
  return ["[" + kind + "]", query.trim(), ...parts.core, ...parts.extra.filter((t) => t !== "atoms" && t !== "platform" && t !== "agent")]
    .filter(Boolean)
    .join("\n")
    .slice(0, 2400);
}

function queryParts(query: string): { core: string[]; extra: string[] } {
  const core = tokenize(query).filter((t) => t.length > 1 && !STOP.has(t));
  const extra: string[] = [];
  const lower = query.toLowerCase();
  for (const [re, aliases] of ALIAS) {
    if (re.test(lower)) extra.push(...aliases);
  }
  if (!wantsIntegration(query)) extra.push("atoms", "platform", "agent");
  else {
    if (/\bpipecat/.test(lower)) extra.push("pipecat", "smallestttsservice");
    if (/\blive[- ]?kit/.test(lower)) extra.push("livekit");
  }
  return { core, extra: extra.filter((t) => t.length > 1 && !STOP.has(t)) };
}

function wantsIntegration(query: string): boolean {
  const t = query.toLowerCase();
  return (
    (/\b(keep|stay|must keep|wire|plugin|pipecat-ai|livekit-agents)\b/.test(t) &&
      /\b(pipecat|livekit|own stack|pipeline)\b/.test(t)) ||
    /\b(pipecat-ai|livekit-agents|smallestttsservice|smalleststtservice)\b/.test(t)
  );
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
  return s.toLowerCase().split(/[^a-z0-9_+-]+/).filter((t) => t.length > 1);
}

function countIn(doc: string[], t: string): number {
  let n = 0;
  for (const x of doc) if (x === t) n++;
  return n;
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
  "it", "in", "my", "is", "to", "of", "or", "an", "as", "at", "on", "be", "do", "we", "me", "if",
]);
