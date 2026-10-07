/**
 * Provider: where a pack finds passages for a question.
 *
 * - `local`: BM25 plus embeddings over the pack chunks. This is the default.
 * - `supermemory`: the hosted Supermemory API. One container tag per tenant.
 *
 * Read the Supermemory key only from `SUPERMEMORY_API_KEY`. Do not log it. Do not print it.
 */
import { createHash } from "node:crypto";
import type { PageShot } from "../site/types.ts";
import { indexPages } from "./chunk.ts";
import { DEFAULT_POLICY } from "./policy.ts";
import { searchHits, searchHitsHybrid } from "./search.ts";
import type { EmbedFn, RetrieveCorpus, RetrievePolicy } from "./types.ts";

/** One search result. */
export interface Passage {
  url: string;
  title: string;
  text: string;
  score: number;
  section?: string;
  kind?: string;
}

export interface SearchExtra {
  /** Words that narrow a local search. Remote providers ignore it. */
  focus?: string;
}

export interface RetrieveProvider {
  /** `local` or `supermemory`. */
  readonly name: string;
  search(query: string, k: number, extra?: SearchExtra): Promise<Passage[]>;
  /** Add or replace pages. Return how many pages the provider took. */
  add(pages: PageShot[]): Promise<number>;
}

/** Pack config key `retrieval`. */
export interface RetrievalConfig {
  provider?: "local" | "supermemory";
  /** Supermemory container. Default: `webagent-<pack id>`. */
  containerTag?: string;
}

/* ---------- local ---------- */

export interface LocalSource {
  corpus: () => RetrieveCorpus;
  policy?: RetrievePolicy;
  /** Query embedder. Read at each search, so a key set later takes effect. */
  embed?: () => EmbedFn | undefined;
}

/** BM25 plus embeddings over the pack chunks. Hybrid when any chunk has a vector. */
export function localProvider(source: LocalSource): RetrieveProvider {
  const policy = source.policy ?? DEFAULT_POLICY;
  return {
    name: "local",
    async search(query, k, extra) {
      const corpus = source.corpus();
      const hybrid = !!corpus.chunks?.some((c) => c.vector?.length);
      const opts = { focus: extra?.focus, limit: k };
      const hits = hybrid
        ? await searchHitsHybrid(corpus, query, source.embed?.(), policy, opts)
        : searchHits(corpus, query, policy, opts);
      return hits.map((h) => ({ url: h.url, title: h.title, text: h.snippet, score: h.score, section: h.section, kind: h.kind }));
    },
    async add(pages) {
      const corpus = source.corpus();
      const known = new Set(pages.map((p) => p.url));
      corpus.pages = [...corpus.pages.filter((p) => !known.has(p.url)), ...pages];
      corpus.chunks = [...(corpus.chunks ?? []).filter((c) => !known.has(c.url)), ...indexPages(pages, policy)];
      return pages.length;
    },
  };
}

/* ---------- supermemory ---------- */

export const SUPERMEMORY_URL = "https://api.supermemory.ai";

export interface SupermemoryOpts {
  /** API key. Default: env `SUPERMEMORY_API_KEY`. */
  key?: string;
  containerTag: string;
  /** API base. Default: `https://api.supermemory.ai`. */
  base?: string;
  /** HTTP client. Tests give a fake. */
  fetch?: typeof fetch;
  /** Request time limit in milliseconds. */
  timeout?: number;
}

interface SearchReply {
  results?: {
    documentId?: string;
    title?: string | null;
    score?: number;
    metadata?: Record<string, unknown> | null;
    content?: string | null;
    chunks?: { content?: string; score?: number; isRelevant?: boolean }[];
  }[];
}

/**
 * Supermemory documents API.
 * - Add: `POST /v3/documents` with `content`, `containerTag`, `customId`, `metadata`.
 * - Search: `POST /v3/search` with `q`, `containerTag`, `limit`.
 */
export function supermemoryProvider(opts: SupermemoryOpts): RetrieveProvider {
  const key = opts.key ?? process.env.SUPERMEMORY_API_KEY ?? "";
  if (!key) throw new Error("supermemory: SUPERMEMORY_API_KEY is not set");
  const base = (opts.base ?? SUPERMEMORY_URL).replace(/\/+$/, "");
  const tag = cleanTag(opts.containerTag);
  const fetchFn = opts.fetch ?? fetch;
  const timeout = opts.timeout ?? 15000;
  const post = async (path: string, body: unknown): Promise<unknown> => {
    const res = await fetchFn(base + path, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + key },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(timeout),
    });
    /* Do not echo the reply body. It can hold request data. */
    if (!res.ok) throw new Error("supermemory " + path + " " + res.status);
    return res.json();
  };
  return {
    name: "supermemory",
    async search(query, k) {
      const reply = (await post("/v3/search", { q: query, containerTag: tag, limit: k })) as SearchReply;
      const out: Passage[] = [];
      for (const r of reply.results ?? []) {
        const meta = r.metadata ?? {};
        const chunks = (r.chunks ?? []).filter((c) => c.content && c.isRelevant !== false);
        const text = chunks.length ? chunks.map((c) => c.content!.trim()).join("\n") : (r.content ?? "");
        if (!text.trim()) continue;
        out.push({
          url: typeof meta.url === "string" ? meta.url : "",
          title: r.title || (typeof meta.title === "string" ? meta.title : ""),
          text: text.slice(0, 1600),
          score: Math.round((r.score ?? chunks[0]?.score ?? 0) * 1000) / 1000,
          kind: "page",
        });
      }
      return out.slice(0, k);
    },
    async add(pages) {
      let n = 0;
      const good = pages.filter((p) => p.url && p.status >= 200 && p.status < 400 && (p.text || p.title));
      /* Send four at a time. */
      for (let i = 0; i < good.length; i += 4) {
        const batch = good.slice(i, i + 4);
        await Promise.all(
          batch.map((p) =>
            post("/v3/documents", {
              content: pageText(p),
              containerTag: tag,
              customId: pageId(p.url),
              metadata: { url: p.url, title: p.title || p.url, source: "webagent" },
            }),
          ),
        );
        n += batch.length;
      }
      return n;
    },
  };
}

/** Container tag rule: letters, digits, `-`, `_`, `.`, at most 100 characters. */
export function cleanTag(tag: string): string {
  return tag.replace(/[^a-zA-Z0-9_.-]+/g, "-").slice(0, 100);
}

/** Stable document id for one page URL. The same page replaces its old copy. */
export function pageId(url: string): string {
  return "page-" + createHash("sha256").update(url).digest("hex").slice(0, 40);
}

function pageText(p: PageShot): string {
  return [p.title ? "# " + p.title : "", p.url, p.description, p.text].filter(Boolean).join("\n\n").slice(0, 60000);
}

/* ---------- select ---------- */

const warned = new Set<string>();

export interface SelectOpts {
  /** Id for the default container tag. */
  id: string;
  config?: RetrievalConfig;
  local: RetrieveProvider;
  env?: Record<string, string | undefined>;
  fetch?: typeof fetch;
  /** Warning sink. Default: `console.error`. */
  warn?: (line: string) => void;
}

/** Container tag for a pack: the config value or `webagent-<id>`. */
export function getContainerTag(id: string, config?: RetrievalConfig): string {
  return cleanTag(config?.containerTag || "webagent-" + id);
}

/** Pick the provider from the pack config. Fall back to local without a key. Warn once per pack. */
export function selectProvider(opts: SelectOpts): RetrieveProvider {
  if (opts.config?.provider !== "supermemory") return opts.local;
  const env = opts.env ?? process.env;
  const key = env.SUPERMEMORY_API_KEY;
  if (!key) {
    if (!warned.has(opts.id)) {
      warned.add(opts.id);
      (opts.warn ?? console.error)("retrieval: SUPERMEMORY_API_KEY is not set. Pack " + opts.id + " uses local search.");
    }
    return opts.local;
  }
  return supermemoryProvider({ key, containerTag: getContainerTag(opts.id, opts.config), fetch: opts.fetch });
}
