import type { PageShot, SitePack } from "../site/types.ts";

export type Channel = "phone" | "web" | "mobile" | "own_stack" | "models";
export type Direction = "inbound" | "outbound" | "both" | "none";
export type Scale = "prototype" | "production" | "campaign";
export type PathId = "atoms_standard" | "atoms_crew" | "own_stack" | "models_only";

export interface Intent {
  useCase?: string;
  channel?: Channel;
  direction?: Direction;
  languages: string[];
  customLlm?: boolean;
  noisy?: boolean;
  scale?: Scale;
  tools: string[];
  notes: string;
}

export interface SettingPick {
  name: string;
  value: string;
  why: string;
  default?: string;
}

export interface SettingsPlan {
  path: PathId;
  pathWhy: string;
  useCase: string;
  models: SettingPick[];
  required: SettingPick[];
  speech: SettingPick[];
  extras: SettingPick[];
  firstMessage: string;
  implementation: string[];
  docs: { title: string; url: string }[];
  summary: string;
}

export interface SmallestPack {
  origin: string;
  docsOrigin: string;
  site: SitePack;
  pages: PageShot[];
  marketing: PageShot[];
  docs: PageShot[];
  facts: string[];
  starterQuestions: string[];
}

export type FetchLike = (input: string | URL | Request, init?: RequestInit) => Promise<Response>;

export interface BuildSmallestOpts {
  maxPages?: number;
  fetch?: FetchLike;
}
