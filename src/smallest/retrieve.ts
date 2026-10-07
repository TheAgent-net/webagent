import { expandQuery as expandHits, searchHits, searchHitsHybrid } from "../retrieve/search.ts";
import { indexPages } from "../retrieve/chunk.ts";
import type { EmbedFn } from "../retrieve/embed.ts";
import { SMALLEST_POLICY } from "./policy.ts";
import type { DocHit, DocKind, SmallestPack } from "./types.ts";

export function indexDocs(pages: SmallestPack["pages"]) {
  return indexPages(pages, SMALLEST_POLICY);
}

export function searchDocs(pack: SmallestPack, query: string, opts?: { focus?: DocKind | "any"; limit?: number }): DocHit[] {
  return searchHits(pack, query, SMALLEST_POLICY, opts) as DocHit[];
}

export async function searchDocsHybrid(
  pack: SmallestPack,
  query: string,
  embed: EmbedFn | undefined,
  opts?: { focus?: DocKind | "any"; limit?: number },
): Promise<DocHit[]> {
  return (await searchHitsHybrid(pack, query, embed, SMALLEST_POLICY, opts)) as DocHit[];
}

export function expandQuery(query: string): string[] {
  return expandHits(query, SMALLEST_POLICY);
}
