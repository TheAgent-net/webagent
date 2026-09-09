/** Typed Graph RAG for Composio apps. Route a request by kind and use, then docs. */

export type NodeKind = "app" | "kind" | "use" | "page";

export interface GraphNode {
  id: string;
  kind: NodeKind;
  label: string;
  /** Extra facts. App: slug, auth, tools. Page: url, role. Use: verbs. */
  meta: Record<string, string>;
}

export interface GraphEdge {
  from: string;
  rel: "in_kind" | "solves" | "docs" | "faq";
  to: string;
}

export interface AppGraph {
  origin: string;
  builtAt: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface AppHit {
  slug: string;
  name: string;
  kind: string;
  auth: string;
  tools: number;
  score: number;
  why: string[];
  url: string;
}

export interface PageHit {
  url: string;
  title: string;
  role: string;
  score: number;
  snippet: string;
}

export interface GraphAsk {
  apps: AppHit[];
  pages: PageHit[];
  kinds: string[];
  uses: string[];
}

export const CORPUS_COMPOSIO = "corpus/composio";
