/**
 * Onboard: add one company to the hosted service.
 *
 * 1. Build a pack from the company URL into `<packs>/<id>`.
 * 2. Capture visuals when Chromium is available. Skip them when it is not.
 * 3. Write starter cases to `evals.json` when the pack has none.
 * 4. Add the tenant to the store.
 * 5. Return the preview URL, the snippets, and the company checklist.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import type { EmbedFn } from "../retrieve/embed.ts";
import { getChrome } from "../site/visual.ts";
import type { Store, Tenant } from "../store/store.ts";
import { fromUrl } from "./from-url.ts";
import { starterCases } from "./tune.ts";
import type { AgentPackConfig } from "./types.ts";

export const TENANT_ID = /^[a-z0-9][a-z0-9_-]{0,62}$/;
/** Agent-net org id. */
export const ORG_ID = /^[A-Za-z0-9_-]{1,64}$/;

export interface OnboardOpts {
  id: string;
  store: Store;
  /** Tenant name. Default: the brand name from the site. */
  name?: string;
  /** Custom host names that map to this tenant. */
  domains?: string[];
  /** Page origins that may embed the widget. Empty means any. */
  origins?: string[];
  /** Agent-net org id that owns the site. Default: the org of the old tenant row. */
  org?: string;
  /** Folder that holds one pack per tenant. Default: `packs`. */
  packs?: string;
  /** Capture visuals. Default: on when Chromium is found. */
  visuals?: boolean;
  /** Public base URL of the service. Default: `WEBAGENT_PUBLIC_URL`, else `http://127.0.0.1:8787`. */
  publicUrl?: string;
  maxPages?: number;
  fetch?: typeof fetch;
  embed?: EmbedFn | false;
  log?: (line: string) => void;
}

/** Text the company copies into its site. */
export interface Snippets {
  preview: string;
  script: string;
  /** Google Tag Manager variant of the script tag. */
  tagManager: string;
  csp: string[];
  llms: string;
}

export interface Onboarded {
  tenant: Tenant;
  dir: string;
  config: AgentPackConfig;
  pages: number;
  visuals: number;
  snippets: Snippets;
  checklist: string[];
}

export async function onboard(url: string, opts: OnboardOpts): Promise<Onboarded> {
  if (!TENANT_ID.test(opts.id)) throw new Error("bad tenant id: use a-z, 0-9, - and _ (at most 63 characters)");
  if (opts.org !== undefined && !ORG_ID.test(opts.org)) throw new Error("bad org id: use A-Z, a-z, 0-9, - and _ (at most 64 characters)");
  const log = opts.log ?? ((line: string) => console.error(line));
  const dir = resolve(opts.packs || "packs", opts.id);
  let visuals = opts.visuals ?? true;
  if (visuals && !hasChrome()) {
    log("visual capture skipped: no Chromium found (set WEBAGENT_CHROME)");
    visuals = false;
  }

  log("crawling " + url + " ...");
  const got = await fromUrl(url, { out: dir, maxPages: opts.maxPages, fetch: opts.fetch, embed: opts.embed, visuals });

  /* The pack id is the tenant id. The default retrieval container uses it. */
  const config = { ...got.config, id: opts.id };
  delete config.visuals;
  delete config.dir;
  writeFileSync(join(dir, "pack.json"), JSON.stringify(config, null, 2) + "\n");

  const pages = readPageCount(dir);
  if (!existsSync(join(dir, "evals.json"))) {
    writeFileSync(join(dir, "evals.json"), JSON.stringify(starterCases(config.brand.name), null, 2) + "\n");
  }

  const old = opts.store.getTenant(opts.id);
  const tenant: Tenant = {
    id: opts.id,
    name: opts.name || old?.name || config.brand.name || opts.id,
    pack: dir,
    domains: opts.domains?.length ? opts.domains : old?.domains ?? [],
    origins: opts.origins?.length ? opts.origins : old?.origins ?? [],
    settings: { ...(old?.settings ?? {}), source: url },
    created: old?.created ?? Date.now(),
  };
  const org = opts.org || old?.org;
  if (org) tenant.org = org;
  opts.store.putTenant(tenant);

  const publicUrl = (opts.publicUrl || process.env.WEBAGENT_PUBLIC_URL || "http://127.0.0.1:8787").replace(/\/+$/, "");
  return {
    tenant,
    dir,
    config,
    pages,
    visuals: got.config.visuals?.length ?? 0,
    snippets: getSnippets(publicUrl, opts.id),
    checklist: getChecklist(),
  };
}

export function getSnippets(publicUrl: string, id: string): Snippets {
  const base = publicUrl.replace(/\/+$/, "");
  const origin = new URL(base).origin;
  const widget = `${base}/t/${id}/widget.js`;
  return {
    preview: `${base}/t/${id}/`,
    script: `<script src="${widget}" async></script>`,
    tagManager: [
      "<script>",
      "  (function () {",
      '    var s = document.createElement("script");',
      `    s.src = "${widget}";`,
      "    s.async = true;",
      "    document.head.appendChild(s);",
      "  })();",
      "</script>",
    ].join("\n"),
    csp: [`script-src ${origin}`, `connect-src ${origin}`, `img-src ${origin}`, `style-src ${origin}`, `font-src ${origin}`],
    llms: `- [Ask our agent](${base}/t/${id}/chat): POST {"text": "your question"} to get an answer from our site agent.`,
  };
}

/** What the company does. Required steps first, then optional steps. See `docs/onboarding.md`. */
export function getChecklist(): string[] {
  return [
    "required  send the site URL and the emails for the dashboard",
    "required  review the agent in the preview (about 30 min)",
    "required  fill the facts sheet: docs/facts-sheet.md (about 15 min)",
    "required  paste the script tag on every page (about 5 min)",
    "required  allow our origin in your CSP, if you have one (about 5 min)",
    "required  give a handoff target: email, Slack, or webhook (about 2 min)",
    "required  legal: privacy line, cookie category, DPA (docs/legal)",
    "optional  connect Cloudflare read-only for agent analytics",
    "optional  add the line to your /llms.txt",
    "optional  review the weekly gap report",
    "optional  use your own model or retrieval keys",
  ];
}

/** Text for the terminal after `webagent onboard`. */
export function getReport(done: Onboarded): string {
  const s = done.snippets;
  return [
    `onboarded ${done.tenant.id} (${done.tenant.name}): ${done.pages} pages, ${done.visuals} visuals`,
    `  pack     ${done.dir}`,
    ...(done.tenant.org ? [`  org      ${done.tenant.org}`] : []),
    ...(done.tenant.domains.length ? [`  domains  ${done.tenant.domains.join(", ")}`] : []),
    "",
    "preview",
    "  " + s.preview,
    "",
    "script tag (paste before </body>)",
    "  " + s.script,
    "",
    "CSP (add our origin to these directives)",
    ...s.csp.map((line) => "  " + line),
    "",
    "llms.txt line",
    "  " + s.llms,
    "",
    "company checklist",
    ...done.checklist.map((line) => "  " + line),
  ].join("\n");
}

export function hasChrome(): boolean {
  try {
    getChrome();
    return true;
  } catch {
    return false;
  }
}

function readPageCount(dir: string): number {
  try {
    return (JSON.parse(readFileSync(join(dir, "pages.json"), "utf8")) as unknown[]).length;
  } catch {
    return 0;
  }
}
