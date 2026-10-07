/**
 * Hybrid ask: typed graph walk + cleaned RAG, then rerank docs.
 */
import type { CorpusPage } from "../site/corpus.ts";
import type { SitePack } from "../site/types.ts";
import { chunkPages, type TextChunk } from "./clean.ts";
import { queryGraph } from "./query.ts";
import { searchChunks } from "./rag.ts";
import { rerankDocs } from "./rerank.ts";
import type { AppGraph, GraphAsk } from "./types.ts";

export function chunksFromPack(pack: SitePack): TextChunk[] {
  const pages: CorpusPage[] = pack.pages.map((p) => ({
    url: p.url,
    title: p.title,
    description: p.description,
    headings: p.headings,
    text: p.text,
    status: p.status,
  }));
  return chunkPages(pages);
}

export function askApps(graph: AppGraph, chunks: TextChunk[], question: string, limit = 6): GraphAsk {
  const graphHit = queryGraph(graph, question, limit);
  const lex = searchChunks(chunks, question, 12);
  const pages = rerankDocs(question, graphHit.pages, lex, limit, graphHit.apps);
  return { ...graphHit, pages };
}
