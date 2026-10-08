export { embedText, indexPages, kindOfUrl } from "./chunk.ts";
export {
  cosine,
  defaultQueryEmbed,
  EMBED_MODEL,
  fillVectors,
  hashedEmbed,
  type EmbedFn,
  type FillVectorsOpts,
} from "./embed.ts";
export { compilePolicy, DEFAULT_POLICY, pathOf } from "./policy.ts";
export { expandQuery, searchHits, searchHitsHybrid } from "./search.ts";
export type {
  DocChunk,
  DocHit,
  RetrievalInfo,
  RetrieveCorpus,
  RetrievePolicy,
  RetrievePolicyJson,
  SearchOpts,
} from "./types.ts";
export {
  getContainerTag,
  localProvider,
  selectProvider,
  supermemoryProvider,
  type Passage,
  type RetrievalConfig,
  type RetrieveProvider,
} from "./provider.ts";
