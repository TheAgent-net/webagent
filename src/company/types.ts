import type { PageShot, SiteFlow, SitePack } from "../site/types.ts";

export interface GithubRepo {
  owner: string;
  name: string;
  htmlUrl: string;
  description: string;
  homepage?: string;
  topics: string[];
  language?: string;
  stars: number;
  readme: string;
}

export interface FormField {
  name: string;
  type: string;
  why: string;
}

/** One on-site form turned into a field-by-field agentic walk. */
export interface FormWalk {
  id: string;
  name: string;
  purpose: string;
  url: string;
  action: string;
  method: string;
  fields: FormField[];
}

export interface CompanyProfile {
  name: string;
  tagline: string;
  origin: string;
  website?: string;
  github?: string;
  audience: string;
  offers: string[];
  ctas: { label: string; url: string }[];
}

export interface CompanyPack {
  profile: CompanyProfile;
  site: SitePack;
  forms: FormWalk[];
  github?: GithubRepo;
  pages: PageShot[];
  flows: SiteFlow[];
}

export type FetchLike = (input: string | URL | Request, init?: RequestInit) => Promise<Response>;

export interface BuildCompanyOpts {
  maxPages?: number;
  fetch?: FetchLike;
}
