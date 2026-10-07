/**
 * Fuse graph hits and cleaned RAG chunks, then rerank.
 * Reciprocal rank fusion plus role and error-code features. No extra model.
 */
import type { PageHit } from "./types.ts";
import type { ChunkHit } from "./rag.ts";

export function rerankDocs(
  query: string,
  graphPages: PageHit[],
  chunks: ChunkHit[],
  limit = 6,
  apps: { slug: string }[] = [],
): PageHit[] {
  const q = query.toLowerCase();
  const words = q.split(/\W+/).filter((w) => w.length > 2);
  const lead = apps.slice(0, 3).map((a) => a.slug.toLowerCase()).filter(Boolean);
  const fused = new Map<string, { hit: PageHit; rrf: number; graph: number; lex: number }>();

  graphPages.forEach((p, i) => {
    const key = p.url + "|" + p.title;
    const cur = fused.get(key) ?? { hit: p, rrf: 0, graph: 0, lex: 0 };
    cur.rrf += 1 / (60 + i);
    cur.graph = p.score;
    if ((p.snippet || "").length > (cur.hit.snippet || "").length) cur.hit = { ...cur.hit, snippet: p.snippet };
    fused.set(key, cur);
  });
  chunks.forEach((c, i) => {
    const key = c.url + "|" + c.title;
    const asPage: PageHit = { url: c.url, title: c.title, role: c.role, score: c.score, snippet: c.snippet };
    const cur = fused.get(key) ?? { hit: asPage, rrf: 0, graph: 0, lex: 0 };
    cur.rrf += 1 / (60 + i);
    cur.lex = c.score;
    if ((c.snippet || "").length > (cur.hit.snippet || "").length) cur.hit = { ...cur.hit, snippet: c.snippet, role: c.role };
    fused.set(key, cur);
  });

  const ranked = [...fused.values()].map((v) => {
    const hay = (v.hit.title + " " + v.hit.snippet).toLowerCase();
    let score = v.rrf * 50 + v.graph * 0.12 + v.lex * 0.18;
    if (v.hit.role === "faq") score += 5;
    else if (v.hit.role === "auth" || v.hit.role === "debug") score += 2;
    for (const w of words) if (hay.includes(w)) score += Math.min(w.length, 8) * 0.25;
    if (/\b401\b/.test(q) && /401/.test(hay)) score += 10;
    if (/\b403\b/.test(q) && /403/.test(hay)) score += 8;
    if (/quota|rate limit/.test(q) && /quota|rate limit/.test(hay)) score += 8;
    if (/blocked/.test(q) && /blocked/.test(hay)) score += 8;
    const place = lead.findIndex((s) => v.hit.url.toLowerCase().includes(s) || v.hit.title.toLowerCase().includes(s));
    if (place === 0) score += 10;
    else if (place === 1) score += 6;
    else if (place === 2) score += 3;
    return { ...v.hit, score };
  });
  ranked.sort((a, b) => b.score - a.score);
  return ranked.slice(0, limit);
}
