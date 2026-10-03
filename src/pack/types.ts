import type { EmbedFn, DocChunk, RetrievalInfo, RetrievePolicy, RetrievePolicyJson } from "../retrieve/types.ts";
import type { PageShot, SitePack } from "../site/types.ts";
import type { Visual } from "../site/visual.ts";
import type { Tool } from "../tools.ts";

export interface AgentBrand {
  name: string;
  tagline: string;
  colors: {
    ink: string;
    paper: string;
    muted: string;
    line: string;
    wash: string;
    accent: string;
    fab: string;
    fabText: string;
    /** Panel glass color. Default: paper at 88%. */
    glass?: string;
  };
  fonts: {
    display: string;
    body: string;
    google?: string;
  };
  logo?: string;
  fabLabel: string;
  wordmark?: string;
}

export interface AgentWidget {
  welcomeTitle: string;
  welcomeBody: string;
  /** Hint bubbles shown above the pill on focus. The widget shows up to three. */
  chips: string[];
  /** Hints typed into the idle pill, one after another. Default: chips. */
  hints?: string[];
  copyHeadline: string;
  copyPrompt: string;
  placeholder: string;
  markdown: boolean;
}

export interface AgentSales {
  technique?: string;
  instruction?: string;
}

export interface AgentModel {
  id: string;
  apiBase?: string;
  reasoningEffort?: string;
}

export interface AgentHostCfg {
  port: number;
  publicUrl?: string;
  cors?: boolean;
}

export interface AgentDocs {
  origin?: string;
  llmsTxt?: string;
}

export interface AgentSkill {
  id: string;
  name: string;
  description: string;
  tags?: string[];
}

export interface AgentCardCfg {
  description?: string;
  instructions?: string;
}

export interface AgentPackConfig {
  id: string;
  origin: string;
  docs?: AgentDocs;
  brand: AgentBrand;
  widget: AgentWidget;
  sales?: AgentSales;
  model?: AgentModel;
  host?: AgentHostCfg;
  retrieve?: RetrievePolicyJson;
  tools?: string[];
  skills?: AgentSkill[];
  card?: AgentCardCfg;
  /** Visual blocks from `visuals.json`. The loader sets this. */
  visuals?: Visual[];
  /** Pack folder on disk. The loader sets this. */
  dir?: string;
}

export interface PackRuntime {
  config: AgentPackConfig;
  dir: string;
  instruction: string;
  policy: RetrievePolicy;
  site: SitePack;
  pages: PageShot[];
  chunks: DocChunk[];
  retrieval?: RetrievalInfo;
  embedQuery?: EmbedFn;
  /** Embedding of each visual's description, by visual id. Empty without an embedder. */
  visualVectors?: Map<string, number[]>;
}

export interface PackToolAttach {
  (h: import("../harness.ts").Harness, run: import("../run.ts").Run, runtime: PackRuntime): void | Promise<void>;
}

export interface PackBuildFn {
  (opts?: { maxPages?: number; fetch?: typeof fetch; embed?: EmbedFn | false; cachePath?: string }): Promise<
    | PackRuntime
    | {
        pages: PageShot[];
        chunks?: DocChunk[];
        retrieval?: RetrievalInfo;
        embedQuery?: EmbedFn;
        site?: SitePack;
        facts?: string[];
        starterQuestions?: string[];
        origin?: string;
        docsOrigin?: string;
      }
  >;
}

export type { Tool };
