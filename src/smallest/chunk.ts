import { embedText, indexPages, kindOfUrl } from "../retrieve/chunk.ts";
import { SMALLEST_POLICY } from "./policy.ts";
import type { PageShot } from "../site/types.ts";
import type { DocChunk, DocKind } from "./types.ts";

export function indexDocs(pages: PageShot[]): DocChunk[] {
  return indexPages(pages, SMALLEST_POLICY) as DocChunk[];
}

export function kindOf(url: string): DocKind {
  return kindOfUrl(url, SMALLEST_POLICY) as DocKind;
}

export function embedInput(c: Pick<DocChunk, "title" | "section" | "kind" | "text" | "url">): string {
  return embedText(c);
}
