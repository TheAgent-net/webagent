/**
 * Cleaned lexical RAG over FAQ and prose chunks. No embeddings.
 */
import type { TextChunk } from "./clean.ts";

const STOP = new Set([
  "the", "and", "for", "you", "are", "what", "does", "can", "how", "from", "with", "this", "that",
  "need", "get", "our", "your", "want", "using", "composio", "please", "help", "into", "my",
  "an", "to", "of", "in", "on", "or", "is", "it", "we", "i", "a",
]);

export interface ChunkHit {
  id: string;
  url: string;
  title: string;
  role: string;
  snippet: string;
  score: number;
}

export function searchChunks(chunks: TextChunk[], question: string, limit = 12): ChunkHit[] {
  const words = tokens(question);
  const q = question.toLowerCase();
  if (!words.length) return [];
  const scored: ChunkHit[] = [];
  for (const c of chunks) {
    const hay = (c.title + " " + c.text).toLowerCase();
    let score = 0;
    for (const w of words) {
      if (c.title.toLowerCase().includes(w)) score += w.length * 2;
      else if (hay.includes(w)) score += w.length;
    }
    if (c.role === "faq") score += 3;
    if (/\b401\b/.test(q) && /401/.test(hay)) score += 10;
    if (/\boauth|blocked|quota|scope/.test(q) && /oauth|blocked|quota|scope/.test(hay)) score += 6;
    if (score <= 0) continue;
    scored.push({
      id: c.id,
      url: c.url,
      title: c.title,
      role: c.role,
      snippet: snippetAround(c.text, words),
      score,
    });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit);
}

function tokens(q: string): string[] {
  return q
    .toLowerCase()
    .split(/\W+/)
    .filter((w) => w.length > 1 && !STOP.has(w));
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
  const start = Math.max(0, idx - 40);
  return text.slice(start, start + 280).replace(/\s+/g, " ").trim();
}
