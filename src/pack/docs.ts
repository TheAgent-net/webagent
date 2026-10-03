import { defaultQueryEmbed, type EmbedFn } from "../retrieve/embed.ts";
import { expandQuery, searchHits, searchHitsHybrid } from "../retrieve/search.ts";
import type { RetrievePolicy } from "../retrieve/types.ts";
import { findVisuals } from "../site/visual.ts";
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
      const visuals = findVisuals(runtime.config.visuals ?? [], topic, expanded).map((v) => ({
        id: v.id,
        kind: v.kind,
        label: v.label,
        page: v.page,
      }));
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

function packEmbedder(runtime: PackRuntime): EmbedFn | undefined {
  if (runtime.embedQuery) return runtime.embedQuery;
  if (runtime.retrieval?.mode !== "hybrid") return undefined;
  return defaultQueryEmbed();
}
