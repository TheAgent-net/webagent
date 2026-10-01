import type { PageShot } from "../site/types.ts";

export type EmbedFn = (texts: string[]) => Promise<number[][]>;

export interface DocChunk {
  id: string;
  url: string;
  title: string;
  section: string;
  kind: string;
  headings: string[];
  text: string;
  priority: number;
  hash?: string;
  vector?: number[];
}

export interface DocHit {
  title: string;
  url: string;
  section: string;
  kind: string;
  snippet: string;
  score: number;
}

export interface RetrievalInfo {
  mode: "hybrid" | "lexical";
  model?: string;
  embedded: number;
}

export interface RetrieveCorpus {
  origin: string;
  docsOrigin?: string;
  pages: PageShot[];
  chunks?: DocChunk[];
  retrieval?: RetrievalInfo;
  embedQuery?: EmbedFn;
}

export interface RetrieveAlias {
  match: string;
  terms: string[];
}

export interface RetrieveKindRule {
  match: string;
  kind: string;
}

export interface RetrieveExtraRule {
  match: string;
  terms: string[];
}

/** JSON-safe retrieve policy stored on a pack. */
export interface RetrievePolicyJson {
  aliases?: RetrieveAlias[];
  preferTerms?: string[];
  extraRules?: RetrieveExtraRule[];
  kindRules?: RetrieveKindRule[];
  defaultKind?: string;
  kindPriors?: Record<string, number>;
  kindBoosts?: Record<string, number>;
  kindPriority?: Record<string, number>;
  defaultPriority?: number;
  priorityPaths?: string[];
  integrationKind?: string;
  platformKind?: string;
  guideKind?: string;
  integrationMatch?: string;
  queryKindDefault?: string;
  queryEmbedSkip?: string[];
}

export interface RetrievePolicy {
  aliases: { re: RegExp; terms: string[] }[];
  preferTerms: string[];
  kindPriors: Record<string, number>;
  kindBoosts: Record<string, number>;
  integrationKind: string;
  platformKind: string;
  guideKind: string;
  queryEmbedSkip: string[];
  wantsIntegration: (query: string) => boolean;
  extraTerms: (query: string) => string[];
  kindOf: (url: string) => string;
  priorityOf: (url: string, kind: string) => number;
  queryKind: (query: string) => string;
  focusExpand: (focus: string, kind: string) => boolean;
}

export interface SearchOpts {
  focus?: string;
  limit?: number;
}
