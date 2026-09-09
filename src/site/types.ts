/** Same-origin page snapshot from the crawl. */
export interface PageShot {
  url: string;
  status: number;
  title: string;
  description: string;
  headings: string[];
  text: string;
  links: string[];
  forms: FormShot[];
  gated: boolean;
}

export interface FormShot {
  action: string;
  method: string;
  fields: { name: string; type: string }[];
}

/** Pause: the crawler hit a wall and needs the site owner. */
export interface AuthAsk {
  url: string;
  reason: "login_form" | "status" | "challenge";
  message: string;
  fields: { name: string; type: string }[];
}

/** Resume crawl after the owner signs in. */
export interface AuthGrant {
  cookies?: string;
  user?: string;
  password?: string;
}

export interface SiteFlow {
  id: string;
  name: string;
  purpose: string;
  steps: { url: string; title: string; hint: string }[];
}

/** What a public run needs to answer visitors. */
export interface SitePack {
  origin: string;
  crawledAt: string;
  complete: boolean;
  pages: PageShot[];
  flows: SiteFlow[];
  instruction: string;
  facts: string[];
  starterQuestions: string[];
  authAsk?: AuthAsk;
  /** Local folder of page files. Lookup reads these. No scrape API at run time. */
  corpusDir?: string;
}

export interface IngestOpts {
  maxPages?: number;
  auth?: AuthGrant;
  onAuth?: (ask: AuthAsk) => Promise<AuthGrant | null>;
  fetch?: typeof fetch;
}