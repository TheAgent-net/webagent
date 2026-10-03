import { join } from "node:path";
import { cosine, defaultQueryEmbed, fillVectors, type EmbedFn } from "../retrieve/embed.ts";
import { expandQuery, searchHits, searchHitsHybrid } from "../retrieve/search.ts";
import type { RetrievePolicy } from "../retrieve/types.ts";
import { describeVisual, findVisuals, type Visual } from "../site/visual.ts";
import type { Tool } from "../tools.ts";
import type { PackRuntime } from "./types.ts";

export function docsLookupTool(runtime: PackRuntime, hint?: string): Tool {
  const policy: RetrievePolicy = runtime.policy;
  return {
    name: "docs_lookup",
    description:
      "Hybrid search over crawled pages (BM25 + embeddings when available). Returns the best sections with URLs, plus matching site visuals when the pack has them. Use for a quote, an implementation detail, or a visual.",
    schema: {
      type: "object",
      properties: {
        query: { type: "string" },
        focus: { type: "string" },
      },
      required: ["query"],
    },
    async call(args) {
      const query = String(args.query ?? "").trim();
      const focus = typeof args.focus === "string" ? args.focus : undefined;
      const hybrid = runtime.chunks.some((c) => c.vector?.length);
      const embed = packEmbedder(runtime);
      const corpus = { origin: runtime.config.origin, pages: runtime.pages, chunks: runtime.chunks };
      const hits = hybrid
        ? await searchHitsHybrid(corpus, query, embed, policy, { focus, limit: 4 })
        : searchHits(corpus, query, policy, { focus, limit: 4 });
      const expanded = expandQuery(query, policy);
      /* The brand name is on most visuals, so it says nothing about which one fits. */
      const brand = runtime.config.brand.name.replace(/[^a-z0-9]+/gi, " ").trim();
      const topic = brand ? query.replace(new RegExp(`\\b${brand.split(" ").join("\\s*")}\\b`, "gi"), " ") : query;
      const visuals = await relevantVisuals(runtime, topic, expanded, embed);
      return {
        query,
        expanded,
        hits,
        ...(visuals.length ? { visuals } : {}),
        source: hybrid ? "hybrid" : "lexical",
        model: runtime.retrieval?.model,
        hint:
          hint ??
          (hits.length
            ? "Quote only the snippets. Cite one URL."
            : "No matching page in the pack. Do not invent a URL or setting."),
      };
    },
  };
}

/** Cosine floor for a visual to reach the model at all. The model makes the final call. */
export const VISUAL_FLOOR = 0.3;

/**
 * Find visuals by meaning: embed the question and compare it with each visual's description.
 * Without embeddings, fall back to word ranking. Each candidate carries what it shows, so the model can judge.
 */
export async function relevantVisuals(
  runtime: PackRuntime,
  topic: string,
  expanded: string[],
  embed?: EmbedFn,
): Promise<{ id: string; kind: string; label: string; shows: string; page: string; relevance?: number }[]> {
  const visuals = runtime.config.visuals ?? [];
  if (!visuals.length || !topic.trim()) return [];
  const shape = (v: Visual, relevance?: number) => ({
    id: v.id,
    kind: v.kind,
    label: v.label,
    shows: describeVisual(v, runtime.config.dir, 240),
    page: v.page,
    ...(relevance === undefined ? {} : { relevance: Math.round(relevance * 100) / 100 }),
  });
  const vectors = runtime.visualVectors;
  if (vectors?.size && embed) {
    try {
      const [q] = await embed([topic]);
      if (q?.length) {
        return visuals
          .map((v) => ({ v, score: vectors.has(v.id) ? cosine(q, vectors.get(v.id)!) : 0 }))
          .filter((x) => x.score >= VISUAL_FLOOR)
          .sort((a, b) => b.score - a.score)
          .slice(0, 3)
          .map((x) => shape(x.v, x.score));
      }
    } catch {
      /* fall through to word ranking */
    }
  }
  return findVisuals(visuals, topic, expanded).map((v) => shape(v));
}

/** Embed every visual description once at start. Reuse the cache across restarts. */
export async function embedVisuals(runtime: PackRuntime, embed?: EmbedFn | false): Promise<number> {
  const visuals = runtime.config.visuals ?? [];
  if (!visuals.length || embed === false) return 0;
  const items = visuals.map((v) => ({
    id: "visual:" + v.id,
    kind: "visual",
    title: v.label,
    section: v.label,
    url: new URL(v.page, runtime.config.origin + "/").href,
    text: describeVisual(v, runtime.config.dir),
    vector: undefined as number[] | undefined,
  }));
  const got = await fillVectors(items as never, {
    embed: embed || undefined,
    cachePath: join(process.cwd(), `.retrieve-cache-visuals-${runtime.config.id}.json`),
  });
  if (!got.embedded) return 0;
  runtime.visualVectors = new Map(items.filter((x) => x.vector?.length).map((x) => [x.id.slice(7), x.vector!]));
  return runtime.visualVectors.size;
}

function packEmbedder(runtime: PackRuntime): EmbedFn | undefined {
  if (runtime.embedQuery) return runtime.embedQuery;
  if (runtime.retrieval?.mode !== "hybrid") return undefined;
  return defaultQueryEmbed();
}
