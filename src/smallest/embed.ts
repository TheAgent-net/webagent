import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { embedInput } from "./chunk.ts";
import type { DocChunk } from "./types.ts";

export const EMBED_MODEL = process.env.SMALLEST_EMBED_MODEL || "text-embedding-3-small";

export type EmbedFn = (texts: string[]) => Promise<number[][]>;

export interface FillVectorsOpts {
  embed?: EmbedFn | false;
  cachePath?: string;
  model?: string;
}

export async function fillVectors(chunks: DocChunk[], opts: FillVectorsOpts = {}): Promise<{ mode: "hybrid" | "lexical"; model?: string; embedded: number }> {
  if (opts.embed === false || !chunks.length) return { mode: "lexical", embedded: 0 };
  const fn = typeof opts.embed === "function" ? opts.embed : autoEmbedder();
  if (!fn) return { mode: "lexical", embedded: 0 };
  const model = opts.model || (typeof opts.embed === "function" ? "custom" : EMBED_MODEL);
  const cache = loadCache(opts.cachePath, model);
  const missing: { i: number; hash: string; text: string }[] = [];
  for (let i = 0; i < chunks.length; i++) {
    const c = chunks[i]!;
    const text = embedInput(c);
    const hash = sha256(model + "\n" + c.id + "\n" + text);
    c.hash = hash;
    const hit = cache.get(hash);
    if (hit) c.vector = hit;
    else missing.push({ i, hash, text });
  }
  const batch = 64;
  for (let i = 0; i < missing.length; i += batch) {
    const slice = missing.slice(i, i + batch);
    const vecs = await fn(slice.map((s) => s.text));
    for (let j = 0; j < slice.length; j++) {
      const row = slice[j]!;
      const v = vecs[j];
      if (!v?.length) continue;
      const unit = l2(v);
      chunks[row.i]!.vector = unit;
      cache.set(row.hash, unit);
    }
  }
  const used = new Map<string, number[]>();
  for (const c of chunks) {
    if (c.hash && c.vector?.length) used.set(c.hash, c.vector);
  }
  saveCache(opts.cachePath, model, used);
  const embedded = used.size;
  return { mode: embedded ? "hybrid" : "lexical", model: embedded ? model : undefined, embedded };
}

export function cosine(a: number[], b: number[]): number {
  const n = Math.min(a.length, b.length);
  if (!n) return 0;
  let s = 0;
  for (let i = 0; i < n; i++) s += a[i]! * b[i]!;
  return s;
}

export function hashedEmbed(texts: string[]): Promise<number[][]> {
  return Promise.resolve(texts.map((t) => hashedVector(t, 128)));
}

export function defaultQueryEmbed(): EmbedFn | undefined {
  return autoEmbedder();
}

function autoEmbedder(): EmbedFn | undefined {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return undefined;
  const base = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/+$/, "");
  const model = EMBED_MODEL;
  return async (texts) => openaiEmbed(base, key, model, texts);
}

async function openaiEmbed(base: string, key: string, model: string, texts: string[]): Promise<number[][]> {
  const resp = await fetch(base + "/embeddings", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + key },
    body: JSON.stringify({ model, input: texts }),
  });
  if (resp.status >= 300) throw new Error(`embed ${resp.status}: ${(await resp.text()).slice(0, 400)}`);
  const json = (await resp.json()) as { data?: { index: number; embedding: number[] }[] };
  const data = json.data ?? [];
  const out: number[][] = Array.from({ length: texts.length }, () => []);
  for (const row of data) {
    if (row.embedding?.length) out[row.index] = l2(row.embedding);
  }
  return out;
}

function hashedVector(text: string, dim: number): number[] {
  const v = new Array(dim).fill(0);
  for (const tok of text.toLowerCase().split(/[^a-z0-9]+/).filter((t) => t.length > 1)) {
    const h = fnv(tok) >>> 0;
    v[h % dim] += 1;
    v[(h >>> 8) % dim] += 0.4;
  }
  return l2(v);
}

function l2(v: number[]): number[] {
  let n = 0;
  for (const x of v) n += x * x;
  const d = Math.sqrt(n) || 1;
  return v.map((x) => x / d);
}

function sha256(s: string): string {
  return createHash("sha256").update(s).digest("hex");
}

function fnv(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h;
}

function loadCache(path: string | undefined, model: string): Map<string, number[]> {
  const m = new Map<string, number[]>();
  if (!path || !existsSync(path)) return m;
  try {
    const raw = JSON.parse(readFileSync(path, "utf8")) as { model?: string; items?: Record<string, number[]> };
    if (raw.model !== model || !raw.items) return m;
    for (const [k, v] of Object.entries(raw.items)) if (v?.length) m.set(k, v);
  } catch {
    /* ignore corrupt cache */
  }
  return m;
}

function saveCache(path: string | undefined, model: string, cache: Map<string, number[]>): void {
  if (!path || !cache.size) return;
  mkdirSync(dirname(path), { recursive: true });
  const items: Record<string, number[]> = {};
  for (const [k, v] of cache) items[k] = v;
  writeFileSync(path, JSON.stringify({ model, items }));
}
