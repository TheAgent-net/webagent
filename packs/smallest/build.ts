import { buildSmallest } from "../../src/smallest/build.ts";
import type { EmbedFn } from "../../src/retrieve/embed.ts";

export async function build(opts: {
  maxPages?: number;
  fetch?: typeof fetch;
  embed?: EmbedFn | false;
  cachePath?: string;
} = {}) {
  const pack = await buildSmallest(opts);
  return {
    origin: pack.origin,
    docsOrigin: pack.docsOrigin,
    site: pack.site,
    pages: pack.pages,
    chunks: pack.chunks,
    retrieval: pack.retrieval,
    embedQuery: pack.embedQuery,
    facts: pack.facts,
    starterQuestions: pack.starterQuestions,
  };
}
