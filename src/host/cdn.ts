/**
 * CDN: an optional read-only link to the company's CDN. It counts HTML-only agents
 * (for example ChatGPT-User) that fetch the company site and never run the widget.
 *
 * Cloudflare first. Tenant settings:
 *   settings.cdn = { provider: "cloudflare", zone: "<zone id>", tokenEnv: "<env var name>" }
 *
 * The API token needs Analytics:Read only. It comes from the env var that `tokenEnv` names.
 * Never store the token in the database. Never log it.
 *
 * Each pull reads the last day of request counts, grouped by user agent and verified bot category.
 * It stores one `cdn` event per group, with the count in `data.n`.
 */
import type { Store, TrafficEvent, VisitorKind } from "../store/store.ts";
import { classifyAgent } from "./visitor.ts";
import type { Fetch } from "./verify.ts";

export interface CdnSettings {
  provider: "cloudflare";
  zone: string;
  /** Name of the env var that holds the API token. */
  tokenEnv: string;
}

export const CLOUDFLARE_GRAPHQL = "https://api.cloudflare.com/client/v4/graphql";
const DAY = 24 * 60 * 60 * 1000;
const HOUR = 60 * 60 * 1000;
const ROW_CAP = 1000;

/** One group of requests from the CDN. */
export interface CdnRow {
  ua: string;
  /** Cloudflare verified bot category. Empty when Cloudflare did not verify the bot. */
  category: string;
  n: number;
}

/** Read and check `settings.cdn`. Undefined when it is missing or wrong. */
export function getCdnSettings(settings: Record<string, unknown>): CdnSettings | undefined {
  const cdn = settings.cdn as Partial<CdnSettings> | undefined;
  if (!cdn || cdn.provider !== "cloudflare") return undefined;
  if (typeof cdn.zone !== "string" || !/^[a-f0-9]{32}$/i.test(cdn.zone)) return undefined;
  if (typeof cdn.tokenEnv !== "string" || !/^[A-Z_][A-Z0-9_]{0,63}$/.test(cdn.tokenEnv)) return undefined;
  return { provider: "cloudflare", zone: cdn.zone, tokenEnv: cdn.tokenEnv };
}

const QUERY_FIELDS = (withCategory: boolean) => `
query ($zone: string!, $since: Time!, $until: Time!) {
  viewer {
    zones(filter: { zoneTag: $zone }) {
      httpRequestsAdaptiveGroups(
        limit: ${ROW_CAP}
        filter: { datetime_geq: $since, datetime_lt: $until, requestSource: "eyeball" }
        orderBy: [count_DESC]
      ) {
        count
        dimensions { userAgent${withCategory ? " verifiedBotCategory" : ""} }
      }
    }
  }
}`;

/** Read rows from one GraphQL answer. Throw with the API message on an error answer. */
export function readCdnRows(body: unknown): CdnRow[] {
  const b = body as {
    errors?: { message?: string }[] | null;
    data?: { viewer?: { zones?: { httpRequestsAdaptiveGroups?: unknown[] }[] } };
  };
  if (b?.errors?.length) throw new Error("cloudflare: " + (b.errors[0]?.message ?? "error"));
  const groups = b?.data?.viewer?.zones?.[0]?.httpRequestsAdaptiveGroups ?? [];
  const rows: CdnRow[] = [];
  for (const g of groups.slice(0, ROW_CAP)) {
    const row = g as { count?: unknown; dimensions?: { userAgent?: unknown; verifiedBotCategory?: unknown } };
    const n = Number(row.count);
    if (!Number.isFinite(n) || n <= 0) continue;
    rows.push({
      ua: typeof row.dimensions?.userAgent === "string" ? row.dimensions.userAgent : "",
      category: typeof row.dimensions?.verifiedBotCategory === "string" ? row.dimensions.verifiedBotCategory : "",
      n: Math.round(n),
    });
  }
  return rows;
}

/** Kind from a Cloudflare verified bot category. Undefined when the category says nothing useful. */
function getCategoryKind(category: string): VisitorKind | undefined {
  const c = category.toLowerCase();
  if (!c) return undefined;
  if (/assistant|ai agent|fetcher/.test(c)) return "assistant";
  if (/crawler|search engine|archiver|ai search|optimization/.test(c)) return "crawler";
  return "script";
}

/** Sort one CDN row into kind and family, with the same rules as `classifyVisitor`. */
export function classifyRow(row: CdnRow): { kind: VisitorKind; family?: string; verified: boolean } {
  const agent = classifyAgent(row.ua);
  const fromCategory = getCategoryKind(row.category);
  const verified = !!row.category;
  if (agent) {
    /* Trust the agent table for the kind. A verified category can upgrade a script. */
    const kind = agent.kind === "script" && fromCategory ? fromCategory : agent.kind;
    return { kind, family: agent.family, verified };
  }
  if (fromCategory) return { kind: fromCategory, verified };
  if (!row.ua) return { kind: "script", verified: false };
  return { kind: /mozilla\//i.test(row.ua) ? "human" : "script", verified: false };
}

export interface PullOpts {
  fetch?: Fetch;
  /** End of the window. Default: now, cut to the hour. */
  until?: number;
  /** Env to read the token from. Default `process.env`. */
  env?: Record<string, string | undefined>;
}

export interface PullResult {
  rows: number;
  stored: number;
  since: number;
  until: number;
  /** True when this window was already pulled. */
  skipped?: boolean;
}

async function ask(fetcher: Fetch, token: string, zone: string, since: number, until: number, withCategory: boolean) {
  const res = await fetcher(CLOUDFLARE_GRAPHQL, {
    method: "POST",
    signal: AbortSignal.timeout(20_000),
    headers: { "content-type": "application/json", authorization: "Bearer " + token },
    body: JSON.stringify({
      query: QUERY_FIELDS(withCategory),
      variables: { zone, since: new Date(since).toISOString(), until: new Date(until).toISOString() },
    }),
  });
  if (!res.ok) throw new Error("cloudflare status " + res.status);
  return readCdnRows(await res.json());
}

/** Pull the last day of CDN counts for one tenant and store them as `cdn` events. */
export async function pullCdn(store: Store, tenant: string, opts: PullOpts = {}): Promise<PullResult> {
  const t = store.getTenant(tenant);
  if (!t) throw new Error("unknown tenant " + tenant);
  const cdn = getCdnSettings(t.settings);
  if (!cdn) throw new Error('tenant ' + tenant + ' has no valid settings.cdn ({ provider: "cloudflare", zone, tokenEnv })');
  const token = (opts.env ?? process.env)[cdn.tokenEnv];
  if (!token) throw new Error("env var " + cdn.tokenEnv + " is not set");
  const until = opts.until ?? Math.floor(Date.now() / HOUR) * HOUR;
  const since = until - DAY;
  const done = store.listEvents(tenant, { type: "cdn", since: until, limit: 1 });
  if (done.some((e) => e.at === until)) return { rows: 0, stored: 0, since, until, skipped: true };

  const fetcher = opts.fetch ?? fetch;
  let rows: CdnRow[];
  try {
    rows = await ask(fetcher, token, cdn.zone, since, until, true);
  } catch (err) {
    /* Some plans do not have the bot category field. Ask again without it. */
    if (!(err instanceof Error) || !/cloudflare:/.test(err.message)) throw err;
    rows = await ask(fetcher, token, cdn.zone, since, until, false);
  }

  let stored = 0;
  for (const row of rows) {
    const who = classifyRow(row);
    const event: TrafficEvent = {
      tenant,
      at: until,
      type: "cdn",
      kind: who.kind,
      family: who.family,
      verified: who.verified,
      ua: row.ua || undefined,
      data: { n: row.n, category: row.category || undefined, since, until, provider: "cloudflare" },
    };
    store.addEvent(event);
    stored++;
  }
  return { rows: rows.length, stored, since, until };
}
