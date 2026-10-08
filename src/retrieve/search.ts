import { embedText, indexPages } from "./chunk.ts";
import { cosine, type EmbedFn } from "./embed.ts";
import { DEFAULT_POLICY } from "./policy.ts";
import type { DocChunk, DocHit, RetrieveCorpus, RetrievePolicy, SearchOpts } from "./types.ts";

const K1 = 1.2;
const B = 0.75;

export { indexPages } from "./chunk.ts";

export function searchHits(
  corpus: RetrieveCorpus,
  query: string,
  policy: RetrievePolicy = DEFAULT_POLICY,
  opts?: SearchOpts,
): DocHit[] {
  return rankHits(corpus, query, policy, undefined, opts);
}

export async function searchHitsHybrid(
  corpus: RetrieveCorpus,
  query: string,
  embed: EmbedFn | undefined,
  policy: RetrievePolicy = DEFAULT_POLICY,
  opts?: SearchOpts,
): Promise<DocHit[]> {
  let qvec: number[] | undefined;
  const chunks = corpus.chunks?.length ? corpus.chunks : indexPages(corpus.pages, policy);
  if (embed && chunks.some((c) => c.vector?.length)) {
    const got = await embed([queryEmbedText(query, policy)]);
    qvec = got[0];
  }
  return rankHits(corpus, query, policy, qvec, opts);
}

export function expandQuery(query: string, policy: RetrievePolicy = DEFAULT_POLICY): string[] {
  const p = queryParts(query, policy);
  return uniq([...p.core, ...p.extra]);
}

function rankHits(
  corpus: RetrieveCorpus,
  query: string,
  policy: RetrievePolicy,
  qvec: number[] | undefined,
  opts?: SearchOpts,
): DocHit[] {
  const chunks = corpus.chunks?.length ? corpus.chunks : indexPages(corpus.pages, policy);
  const q = query.trim();
  if (!q || !chunks.length) return [];
  const parts = queryParts(q, policy);
  const terms = uniq([...parts.core, ...parts.extra]);
  const integration = policy.wantsIntegration(q);
  const focus = opts?.focus && opts.focus !== "any" ? opts.focus : undefined;
  const pool = chunks.filter((c) => {
    if (focus && c.kind !== focus && !policy.focusExpand(focus, c.kind)) return false;
    if (c.kind === policy.integrationKind && !integration) return false;
    return true;
  });
  const lex = bm25(pool, parts, policy);
  const maxLex = Math.max(...lex, 0.0001);
  const scored: { i: number; score: number }[] = [];
  for (let i = 0; i < pool.length; i++) {
    const c = pool[i]!;
    let s = lex[i]! / maxLex;
    if (qvec && c.vector?.length) s = 0.5 * s + 0.5 * Math.max(0, cosine(qvec, c.vector));
    s += kindPrior(c, integration, policy) * 0.01;
    for (const t of parts.core) {
      if (t.length >= 4 && urlSegments(c.url).includes(t)) s += 0.08;
    }
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

function bm25(chunks: DocChunk[], parts: { core: string[]; extra: string[] }, policy: RetrievePolicy): number[] {
  const docs = chunks.map((c) => tokenize(embedText(c) + " " + c.title + " " + c.section));
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
    score += policy.kindBoosts[c.kind] ?? 0;
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
  const tf = countIn(doc, t) + (title.includes(t) ? 2 : 0) + (section.includes(t) ? 1.5 : 0) + urlTermBoost(url, t);
  if (tf <= 0) return 0;
  const idf = Math.log(1 + (N - dft + 0.5) / (dft + 0.5));
  const den = tf + K1 * (1 - B + B * (dl / (avgdl || 1)));
  return w * idf * ((tf * (K1 + 1)) / den);
}

/** A query word that is a path segment (cursor, grok) is a named page, not a generic topic. */
function urlSegments(url: string): string[] {
  return url.replace(/^https?:\/\/[^/]+/i, "").toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
}

function urlTermBoost(url: string, t: string): number {
  if (!url.includes(t)) return 0;
  if (t.length >= 4 && urlSegments(url).includes(t)) return 5;
  return 1.5;
}

function kindPrior(c: DocChunk, integration: boolean, policy: RetrievePolicy): number {
  if (c.kind === policy.integrationKind) return integration ? (policy.kindPriors[c.kind] ?? 4) : 0;
  if (policy.kindPriors[c.kind] != null) {
    if (c.kind === policy.platformKind) return integration ? 0 : policy.kindPriors[c.kind]!;
    return policy.kindPriors[c.kind]!;
  }
  return 0.2;
}

function queryEmbedText(query: string, policy: RetrievePolicy): string {
  const parts = queryParts(query, policy);
  const kind = policy.queryKind(query);
  const skip = new Set(policy.queryEmbedSkip);
  return ["[" + kind + "]", query.trim(), ...parts.core, ...parts.extra.filter((t) => !skip.has(t))]
    .filter(Boolean)
    .join("\n")
    .slice(0, 2400);
}

function queryParts(query: string, policy: RetrievePolicy): { core: string[]; extra: string[] } {
  const core = tokenize(query).filter((t) => t.length > 1 && !STOP.has(t));
  const extra: string[] = [];
  const lower = query.toLowerCase();
  for (const alias of policy.aliases) {
    if (alias.re.test(lower)) extra.push(...alias.terms);
  }
  extra.push(...policy.extraTerms(query));
  if (!policy.wantsIntegration(query)) extra.push(...policy.preferTerms);
  return { core, extra: extra.filter((t) => t.length > 1 && !STOP.has(t)) };
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
