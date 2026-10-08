/**
 * CDN: an optional read-only link to the company's CDN. It counts HTML-only agents
 * (for example ChatGPT-User) that fetch the company site and never run the widget.
 *
 * Cloudflare first. Tenant settings:
 *   settings.cdn = { provider: "cloudflare", zone: "<zone id>", tokenEnv: "<env var name>" }
 *   settings.cdn = { provider: "cloudflare", zone: "<zone id>", token: "<locked token>" }
 *
 * The API token needs Zone, Analytics, Read only. It comes from one of two places:
 * - `tokenEnv`: the env var that the operator set.
 * - `token`: the token that the site owner sent through the dashboard, locked with `secret.ts`.
 * Never store a plain token. Never log it. Never send it back through the API.
 *
 * Each pull reads one full UTC day of request counts, grouped by user agent and verified bot category.
 * It stores one `cdn` event per group, with the count in `data.n`.
 * `startCdn` pulls every hour. A day that is already stored is skipped, so each day counts once.
 */
import type { Store, TrafficEvent, VisitorKind } from "../store/store.ts";
import { classifyAgent } from "./visitor.ts";
import { getSecretKey, SECRET_ENV, unlockSecret } from "./secret.ts";
import type { Fetch } from "./verify.ts";

export interface CdnSettings {
  provider: "cloudflare";
  zone: string;
  /** Name of the env var that holds the API token. */
  tokenEnv?: string;
  /** The API token, locked with `lockSecret`. */
  token?: string;
}

/** The last pull of one site. Stored in `settings.cdnLast`. */
export interface CdnLast {
  at: number;
  /** UTC day of the pulled window, `YYYY-MM-DD`. */
  day: string;
  ok: boolean;
  rows: number;
  reason: string | null;
}

export const ZONE_ID = /^[a-f0-9]{32}$/i;
const ENV_NAME = /^[A-Z_][A-Z0-9_]{0,63}$/;

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
  if (typeof cdn.zone !== "string" || !ZONE_ID.test(cdn.zone)) return undefined;
  if (typeof cdn.token === "string" && cdn.token) return { provider: "cloudflare", zone: cdn.zone, token: cdn.token };
  if (typeof cdn.tokenEnv === "string" && ENV_NAME.test(cdn.tokenEnv)) return { provider: "cloudflare", zone: cdn.zone, tokenEnv: cdn.tokenEnv };
  return undefined;
}

/** The plain API token of a CDN link. Throw a plain reason when it is not available. */
export function getCdnToken(cdn: CdnSettings, env: Record<string, string | undefined> = process.env): string {
  if (cdn.token) {
    const key = getSecretKey(env);
    if (!key) throw new Error(SECRET_ENV + " is not set on the server");
    const token = unlockSecret(cdn.token, key);
    if (!token) throw new Error("the stored token cannot be read. Connect the CDN again");
    return token;
  }
  const token = cdn.tokenEnv ? env[cdn.tokenEnv] : undefined;
  if (!token) throw new Error("env var " + cdn.tokenEnv + " is not set");
  return token;
}

/** Read the last pull from settings. Undefined when there is none. */
export function getCdnLast(settings: Record<string, unknown>): CdnLast | undefined {
  const last = settings.cdnLast as Partial<CdnLast> | undefined;
  if (!last || typeof last.at !== "number" || typeof last.day !== "string") return undefined;
  return { at: last.at, day: last.day, ok: last.ok === true, rows: Number(last.rows) || 0, reason: typeof last.reason === "string" ? last.reason : null };
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
  const zones = b?.data?.viewer?.zones;
  if (Array.isArray(zones) && zones.length === 0) throw new Error("cloudflare: the token cannot read this zone");
  const groups = zones?.[0]?.httpRequestsAdaptiveGroups ?? [];
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
  /** End of the window. Default: the start of the current UTC day. */
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
  if (res.status === 401 || res.status === 403) throw new Error("Cloudflare refused the token. Give it Zone, Analytics, Read for this zone");
  if (!res.ok) throw new Error("cloudflare status " + res.status);
  return readCdnRows(await res.json());
}

/** Pull the last day of CDN counts for one tenant and store them as `cdn` events. */
export async function pullCdn(store: Store, tenant: string, opts: PullOpts = {}): Promise<PullResult> {
  const t = store.getTenant(tenant);
  if (!t) throw new Error("unknown tenant " + tenant);
  const cdn = getCdnSettings(t.settings);
  if (!cdn) throw new Error('tenant ' + tenant + ' has no valid settings.cdn ({ provider: "cloudflare", zone, tokenEnv })');
  const token = getCdnToken(cdn, opts.env);
  const until = opts.until ?? Math.floor(Date.now() / DAY) * DAY;
  const since = until - DAY;
  /* Other cdn rows can be newer than this window, so look at every row from `until` on. */
  const done = store.listEvents(tenant, { type: "cdn", since: until, limit: ROW_CAP * 400 });
  if (done.some((e) => e.at === until)) return { rows: 0, stored: 0, since, until, skipped: true };

  const rows = await askBoth(opts.fetch ?? fetch, token, cdn.zone, since, until);

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

/** Ask with the bot category field. Some plans do not have it: then ask again without it. */
async function askBoth(fetcher: Fetch, token: string, zone: string, since: number, until: number): Promise<CdnRow[]> {
  try {
    return await ask(fetcher, token, zone, since, until, true);
  } catch (err) {
    if (!(err instanceof Error) || !/cloudflare:/.test(err.message)) throw err;
    return await ask(fetcher, token, zone, since, until, false);
  }
}

/** Check a zone and token with one small query (the last full hour). Throw a plain reason on a refusal. */
export async function checkCdn(zone: string, token: string, fetcher: Fetch = fetch, now = Date.now()): Promise<void> {
  const until = Math.floor(now / HOUR) * HOUR;
  await askBoth(fetcher, token, zone, until - HOUR, until);
}

export function getDay(at: number): string {
  return new Date(at).toISOString().slice(0, 10);
}

/** Store the last pull in `settings.cdnLast`. Read and write with no wait between, so no other write is lost. */
export function markCdn(store: Store, tenant: string, last: CdnLast): void {
  const t = store.getTenant(tenant);
  if (!t || !t.settings.cdn) return;
  store.putTenant({ ...t, settings: { ...t.settings, cdnLast: last } });
}

/** Pull one site and store the result in `settings.cdnLast`. A failure is stored, then thrown. */
export async function runCdn(store: Store, tenant: string, opts: PullOpts = {}): Promise<PullResult> {
  const now = opts.until ?? Date.now();
  try {
    const out = await pullCdn(store, tenant, opts);
    if (!out.skipped) markCdn(store, tenant, { at: Date.now(), day: getDay(out.since), ok: true, rows: out.rows, reason: null });
    return out;
  } catch (err) {
    const reason = err instanceof Error ? err.message : "the pull failed";
    markCdn(store, tenant, { at: Date.now(), day: getDay(Math.floor(now / DAY) * DAY - DAY), ok: false, rows: 0, reason });
    throw err;
  }
}

/** Pull every site with a CDN link once an hour. The first pass runs after `delayMs`. Return a stop function. */
export function startCdn(store: Store, list: () => string[], opts: { everyMs?: number; delayMs?: number; fetch?: Fetch } = {}): () => void {
  let busy = false;
  const run = async () => {
    if (busy) return;
    busy = true;
    try {
      for (const id of list()) {
        const t = store.getTenant(id);
        if (!t || !getCdnSettings(t.settings)) continue;
        try {
          const out = await runCdn(store, id, { fetch: opts.fetch });
          if (!out.skipped) console.error(`cdn ${id}: ${out.rows} rows for ${getDay(out.since)}`);
        } catch (err) {
          console.error(`cdn ${id}: ${err instanceof Error ? err.message : "pull failed"}`);
        }
      }
    } finally {
      busy = false;
    }
  };
  const first = setTimeout(() => void run(), opts.delayMs ?? 60_000);
  const timer = setInterval(() => void run(), opts.everyMs ?? HOUR);
  return () => {
    clearTimeout(first);
    clearInterval(timer);
  };
}
