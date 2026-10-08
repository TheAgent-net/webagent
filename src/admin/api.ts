/**
 * Api: the dashboard JSON API under `/webagent/api`. Plug it into `cloud(tenants, { routes })`.
 * The contract is `docs/dashboard-api.md`.
 *
 * - Auth comes from the Agent-net platform session (see `auth.ts`).
 * - A member of the org reads. An `owner` or `admin` writes.
 * - A site of another org is `404`.
 */
import { checkCdn, getCdnSettings, getCdnToken, getDay, runCdn } from "../host/cdn.ts";
import type { Route } from "../host/cloud.ts";
import { publicUrl } from "../host/host.ts";
import { getSecretKey, lockSecret, SECRET_ENV } from "../host/secret.ts";
import type { Fetch } from "../host/verify.ts";
import { Limiter } from "../host/limit.ts";
import type { Tenants } from "../host/tenant.ts";
import { ORG_ID, TENANT_ID } from "../pack/onboard.ts";
import type { Channel, Conversation, ConversationFilter, Store, Tenant, VisitorKind } from "../store/store.ts";
import { canRead, canWrite, checkWrite, listOrigins, Platform, type PlatformOpts, type User } from "./auth.ts";
import { Builds, type BuildsOpts } from "./build.ts";
import { conversationsCsv, turnsCsv } from "./csv.ts";
import { getSettings, readCdn, readSettings } from "./settings.ts";
import {
  DAY_MS,
  getOverview,
  groupQuestions,
  listDays,
  listFamilies,
  listGaps,
  listSteps,
  MACHINE_KINDS,
} from "./stats.ts";

export interface ApiOpts extends PlatformOpts, BuildsOpts {
  /** Public URL for install snippets. Default: `WEBAGENT_PUBLIC_URL`, else the request origin. */
  publicUrl?: string;
  /** Origins that may write. Default: `WEBAGENT_DASHBOARD_ORIGINS`. */
  origins?: string[];
  /** Fetch for the CDN API. Tests pass a fake. */
  cdnFetch?: Fetch;
  /** Env for the secret key and CDN tokens. Default `process.env`. */
  env?: Record<string, string | undefined>;
}

export const API_BASE = "/webagent/api";

type Code = "login" | "role" | "site" | "bad_request" | "conflict" | "rate" | "server" | "origin" | "route";

const ORG_PATH = /^\/webagent\/api\/orgs\/([^/]+)\/sites(?:\/([^/]+)(\/.*)?)?$/;
const KINDS: VisitorKind[] = ["human", "assistant", "browser", "crawler", "script"];
const LABELS = ["intelligent", "script", "unclear", "human"];
const CHANNELS: Channel[] = ["widget", "chat", "mcp"];
const RANGES = [7, 30, 90];
const BODY_CAP = 64 * 1024;
const TOP_ROWS = 15;

/** An error reply that a handler throws. */
class Refusal extends Error {
  constructor(
    readonly status: number,
    readonly code: Code,
    readonly reason: string,
  ) {
    super(reason);
  }
}

export function apiRoute(tenants: Tenants, opts: ApiOpts = {}): Route & { builds: Builds } {
  const platform = new Platform(opts);
  const builds = new Builds(tenants, opts);
  const origins = opts.origins ?? listOrigins();
  const now = opts.now ?? Date.now;
  const store = tenants.store;
  const limiter = new Limiter();
  const env = opts.env ?? process.env;

  async function handle(req: Request, url: URL): Promise<Response> {
    const path = url.pathname.replace(/\/+$/, "");
    const hit = ORG_PATH.exec(path);
    if (!hit) throw new Refusal(404, "route", "This API route does not exist.");
    const org = hit[1]!;
    const siteId = hit[2];
    const rest = hit[3] ?? "";
    const method = req.method;
    const write = method !== "GET" && method !== "HEAD";

    const user = await platform.getUser(req);
    if (user === "login") throw new Refusal(401, "login", "Sign in to Agent-net first.");
    if (user === "server") throw new Refusal(502, "server", "The sign-in check failed. Try again.");
    if (!ORG_ID.test(org) || !canRead(user, org)) throw new Refusal(403, "role", "You are not a member of this org.");
    if (write) checkWriter(req, user, org);
    const ours = (opts.publicUrl ?? publicUrl(req, url.origin)).replace(/\/+$/, "");

    if (!siteId) {
      if (method === "GET") return sendJson({ items: listSites(org, ours) });
      if (method === "POST") return addSite(req, org);
      throw refuseMethod();
    }
    const tenant = TENANT_ID.test(siteId) ? store.getTenant(siteId) : undefined;
    if (!tenant || tenant.org !== org) throw new Refusal(404, "site", "This site does not exist in this org.");

    if (rest === "/settings" && method === "PUT") return putSettings(req, tenant, ours);
    if (rest === "/cdn/pull" && method === "POST") return pullNow(tenant);
    if (rest === "/reload" && method === "POST") {
      tenants.reload(tenant.id);
      return new Response(null, { status: 204, headers: HEADERS });
    }
    if (write) throw refuseMethod();

    if (rest === "/status") return sendJson(builds.getStatus(tenant));
    if (rest === "/settings") return sendJson(getSettings(tenant, ours));
    const days = readDays(url.searchParams);
    const t = now();
    const since = Math.floor(t / DAY_MS) * DAY_MS - (days - 1) * DAY_MS;
    if (rest === "/overview") return sendJson(getOverviewBody(store, tenant, ours, days, since, t));
    if (rest === "/conversations") return sendJson(getConversations(store, tenant, url.searchParams, since));
    if (rest.startsWith("/conversations/")) return sendJson(getTranscript(store, tenant, rest.slice("/conversations/".length)));
    if (rest === "/traffic") return sendJson(getTraffic(store, tenant, since));
    if (rest === "/questions") return sendJson(getQuestions(store, tenant, since));
    if (rest === "/export.csv") {
      const what = url.searchParams.get("what") ?? "conversations";
      if (what !== "conversations" && what !== "turns") throw refuse("Set what to conversations or turns.");
      const body = what === "turns" ? turnsCsv(store, tenant.id, since) : conversationsCsv(store, tenant.id, since);
      return new Response(body, {
        headers: {
          ...HEADERS,
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="${tenant.id}-${what}-${days}d.csv"`,
        },
      });
    }
    throw new Refusal(404, "route", "This API route does not exist.");
  }

  function checkWriter(req: Request, user: User, org: string): void {
    const bad = checkWrite(req, origins);
    if (bad) throw new Refusal(bad.status, bad.status === 403 ? "origin" : "bad_request", bad.reason);
    if (!canWrite(user, org)) throw new Refusal(403, "role", "Only an owner or an admin of this org can change it.");
  }

  function listSites(org: string, ours: string) {
    return tenants
      .list()
      .filter((t) => t.org === org)
      .map((t) => ({
        id: t.id,
        name: t.name,
        domains: t.domains,
        origins: t.origins,
        widgetUrl: `${ours}/t/${t.id}/widget.js`,
        paused: t.settings.paused === true,
        created: t.created,
      }));
  }

  async function addSite(req: Request, org: string): Promise<Response> {
    const body = await readBody(req);
    for (const k of Object.keys(body)) if (!["url", "id", "name"].includes(k)) throw refuse("Unknown field: " + k.slice(0, 40) + ".");
    const site = typeof body.url === "string" ? readSiteUrl(body.url) : undefined;
    if (!site) throw refuse("Send url as a public http or https address, for example https://acme.dev.");
    if (body.id !== undefined && (typeof body.id !== "string" || !TENANT_ID.test(body.id))) {
      throw refuse("The id must match ^[a-z0-9][a-z0-9_-]{0,62}$.");
    }
    if (body.name !== undefined && (typeof body.name !== "string" || !body.name.trim() || body.name.length > 120)) {
      throw refuse("The name must be text of 1 to 120 characters.");
    }
    const id = (body.id as string | undefined) ?? getSiteId(new URL(site).hostname);
    if (!id) throw refuse("Send an id. The host name gives no valid id.");
    if (store.getTenant(id)) throw new Refusal(409, "conflict", "The id " + id + " is already taken.");
    if (!limiter.take("site|" + org, 5).ok || !builds.hasRoom()) {
      throw new Refusal(429, "rate", "Too many builds run now. Try again in a few minutes.");
    }
    builds.start({ url: site, id, org, name: (body.name as string | undefined)?.trim() });
    return sendJson({ id, status: "building" }, 202);
  }

  async function putSettings(req: Request, tenant: Tenant, ours: string): Promise<Response> {
    const body = await readBody(req);
    const first = readSettings(store, tenant, body);
    const hasCdn = !!body && typeof body === "object" && !Array.isArray(body) && "cdn" in body;
    const cdnBody = hasCdn ? readCdn(tenant, (body as Record<string, unknown>).cdn) : undefined;
    const errors = [...first.errors, ...(cdnBody?.errors ?? [])];
    if (errors.length) throw refuse(errors.join(" "));

    /* Check a new zone or token with Cloudflare before anything changes. */
    let cdn: Record<string, unknown> | null | undefined;
    if (cdnBody?.cdn === null) cdn = null;
    else if (cdnBody?.cdn) {
      const { zone, token } = cdnBody.cdn;
      const old = getCdnSettings(tenant.settings);
      let locked: string | undefined;
      if (token) {
        const key = getSecretKey(env);
        if (!key) throw new Refusal(503, "server", "The server cannot store CDN tokens yet. Ask the operator to set " + SECRET_ENV + ".");
        locked = lockSecret(token, key);
      }
      let plain: string;
      try {
        plain = token ?? getCdnToken(old!, env);
      } catch (err) {
        throw refuse("The stored token cannot be used: " + (err instanceof Error ? err.message : "unknown") + ". Add the token again.");
      }
      try {
        await checkCdn(zone, plain, opts.cdnFetch ?? fetch, now());
      } catch (err) {
        throw refuse(readCdnError(err));
      }
      cdn = locked
        ? { provider: "cloudflare", zone, token: locked }
        : { provider: "cloudflare", zone, ...(old?.token ? { token: old.token } : { tokenEnv: old?.tokenEnv }) };
    }

    /* Read the tenant again after the waits, so a write in the meantime is not lost. */
    const fresh = store.getTenant(tenant.id) ?? tenant;
    const result = readSettings(store, fresh, body);
    if (result.errors.length) throw refuse(result.errors.join(" "));
    const next = result.tenant;
    if (cdn === null) {
      delete next.settings.cdn;
      delete next.settings.cdnLast;
    } else if (cdn) {
      const before = fresh.settings.cdn as { zone?: string } | undefined;
      next.settings.cdn = cdn;
      if (before?.zone !== cdn.zone) delete next.settings.cdnLast;
    }
    store.putTenant(next);
    tenants.reload(tenant.id);
    return sendJson(getSettings(next, ours));
  }

  async function pullNow(tenant: Tenant): Promise<Response> {
    if (!getCdnSettings(tenant.settings)) throw new Refusal(409, "conflict", "This site has no CDN link. Connect Cloudflare in the settings first.");
    if (!limiter.take("cdn|" + tenant.id, 5).ok) throw new Refusal(429, "rate", "Too many pulls. Wait one minute.");
    try {
      const out = await runCdn(store, tenant.id, { fetch: opts.cdnFetch, env, until: Math.floor(now() / DAY_MS) * DAY_MS });
      return sendJson({ day: getDay(out.since), rows: out.rows, stored: out.stored, skipped: out.skipped === true });
    } catch (err) {
      throw new Refusal(502, "server", readCdnError(err));
    }
  }

  const route = async (req: Request, url: URL): Promise<Response | null> => {
    if (url.pathname !== API_BASE && !url.pathname.startsWith(API_BASE + "/")) return null;
    try {
      return await handle(req, url);
    } catch (err) {
      if (err instanceof Refusal) return sendError(err.status, err.code, err.reason);
      console.error("dashboard api failed:", err instanceof Error ? err.message : err);
      return sendError(500, "server", "The server had an error. Try again.");
    }
  };
  return Object.assign(route, { builds });
}

const HEADERS = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };

function sendJson(body: unknown, status = 200): Response {
  return Response.json(body, { status, headers: HEADERS });
}

function sendError(status: number, code: Code, reason: string): Response {
  return sendJson({ error: code, reason }, status);
}

function refuse(reason: string): Refusal {
  return new Refusal(400, "bad_request", reason);
}

function refuseMethod(): Refusal {
  return new Refusal(405, "route", "This method is not allowed on this route.");
}

/** Read a JSON object body. The body is at most 64 KB. */
async function readBody(req: Request): Promise<Record<string, unknown>> {
  if (Number(req.headers.get("content-length") ?? 0) > BODY_CAP) throw new Refusal(413, "bad_request", "The body is too large.");
  const text = await req.text();
  if (text.length > BODY_CAP) throw new Refusal(413, "bad_request", "The body is too large.");
  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    throw refuse("The body is not valid JSON.");
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) throw refuse("Send a JSON object.");
  return body as Record<string, unknown>;
}

/** `days` is 7, 30, or 90. Default 30. */
function readDays(q: URLSearchParams): number {
  const raw = q.get("days");
  if (raw === null || raw === "") return 30;
  const days = Number(raw);
  if (!RANGES.includes(days)) throw refuse("Set days to 7, 30, or 90.");
  return days;
}

/** An http(s) origin plus path for a public host name. Undefined for an IP address, a local name, or a user name. */
export function readSiteUrl(text: string): string | undefined {
  const raw = text.trim();
  if (!raw || raw.length > 500) return undefined;
  let u: URL;
  try {
    u = new URL(/^https?:\/\//i.test(raw) ? raw : "https://" + raw);
  } catch {
    return undefined;
  }
  const host = u.hostname.toLowerCase();
  if (u.protocol !== "https:" && u.protocol !== "http:") return undefined;
  if (u.username || u.password || u.port) return undefined;
  if (!host.includes(".") || host.startsWith("[") || /^[\d.]+$/.test(host)) return undefined;
  if (/(^|\.)(localhost|local|internal|lan|home|arpa)$/.test(host)) return undefined;
  return u.origin + (u.pathname === "/" ? "" : u.pathname);
}

/** Site id from a host name: the first label after `www.`. */
export function getSiteId(host: string): string | undefined {
  const label = host.toLowerCase().replace(/^www\./, "").split(".")[0] ?? "";
  const id = label.replace(/[^a-z0-9_-]/g, "-").replace(/^[^a-z0-9]+/, "").slice(0, 63);
  return TENANT_ID.test(id) ? id : undefined;
}

function getShare(part: number, whole: number): number {
  return whole ? Math.round((part / whole) * 1000) / 1000 : 0;
}

function getOverviewBody(store: Store, tenant: Tenant, ours: string, days: number, since: number, now: number) {
  const o = getOverview(store, tenant.id, since);
  const cells = store.listConversationDays(tenant.id, since);
  const cell = (day: string, key: string) => cells.find((c) => c.day === day && c.key === key)?.n ?? 0;
  return {
    range: { days, since },
    kpis: {
      human: o.sum.human,
      agent: o.sum.agent,
      agentVerifiedShare: getShare(o.sum.verified, o.sum.agent),
      intelligent: o.sum.intelligent,
      agentsSeen: o.seen,
      handoffs: o.sum.handoff,
      thumbsDownRate: getShare(o.down, o.votes),
      votes: o.votes,
    },
    funnel: [
      { step: "seen", label: "Agents seen", n: o.funnel.seen },
      { step: "found", label: "Read llms.txt or the agent card", n: o.funnel.read },
      { step: "talked", label: "Talked on chat or MCP", n: o.funnel.talked },
      { step: "intelligent", label: "Intelligent, two turns or more", n: o.funnel.deep },
    ],
    days: listDays(since, now).map((day) => ({ day, human: cell(day, "human"), agent: cell(day, "agent") })),
    families: listFamilies(store, tenant.id, since).map((f) => ({
      family: f.family,
      requests: f.requests,
      verifiedShare: getShare(f.verified, f.requests),
      conversations: f.conversations,
    })),
    checklist: listSteps(store, tenant, ours).map((s) => ({ id: s.id, label: s.label, done: s.done, hint: s.hint })),
  };
}

function getItem(store: Store, c: Conversation) {
  return {
    session: c.session,
    channel: c.channel,
    kind: c.kind,
    family: c.family ?? null,
    verified: c.verified,
    score: c.score ?? null,
    label: c.label ?? null,
    page: c.page ?? null,
    handoff: !!c.handoff,
    started: c.started,
    updated: c.updated,
    turns: c.turns,
    firstQuestion: store.listTurns(c.id)[0]?.said ?? "",
  };
}

/** Read the list filter. An unknown value is a `400`. */
function readFilter(q: URLSearchParams, since: number): ConversationFilter {
  const pick = <T extends string>(name: string, allowed: readonly T[]): T | undefined => {
    const v = q.get(name);
    if (v === null || v === "") return undefined;
    if (!allowed.includes(v as T)) throw refuse(`Set ${name} to one of: ${allowed.join(", ")}.`);
    return v as T;
  };
  const handoff = pick("handoff", ["true", "false"] as const);
  const text = (q.get("q") ?? "").trim();
  if (text.length > 200) throw refuse("The search text can have at most 200 characters.");
  const whole = (name: string, fallback: number, low: number, high: number): number => {
    const v = q.get(name);
    if (v === null || v === "") return fallback;
    const n = Number(v);
    if (!Number.isInteger(n) || n < low || n > high) throw refuse(`Set ${name} to a whole number from ${low} to ${high}.`);
    return n;
  };
  return {
    since,
    kind: pick("kind", KINDS),
    label: pick("label", LABELS),
    channel: pick("channel", CHANNELS),
    handoff: handoff === undefined ? undefined : handoff === "true",
    text: text || undefined,
    limit: whole("limit", 25, 1, 100),
    offset: whole("offset", 0, 0, 1_000_000),
  };
}

function getConversations(store: Store, tenant: Tenant, q: URLSearchParams, since: number) {
  const filter = readFilter(q, since);
  return {
    total: store.countMatches(tenant.id, filter),
    items: store.listConversations(tenant.id, filter).map((c) => getItem(store, c)),
  };
}

function getTranscript(store: Store, tenant: Tenant, raw: string) {
  let session: string;
  try {
    session = decodeURIComponent(raw);
  } catch {
    throw new Refusal(404, "site", "This conversation does not exist.");
  }
  const c = session && session.length <= 200 && !session.includes("/") ? store.getConversation(tenant.id + ":" + session) : undefined;
  if (!c || c.tenant !== tenant.id) throw new Refusal(404, "site", "This conversation does not exist.");
  return {
    conversation: getItem(store, c),
    turns: store.listTurns(c.id).map((t) => ({
      id: t.id ?? null,
      at: t.at,
      from: t.from,
      said: t.said,
      reply: t.reply,
      visual: t.visual ?? null,
      ms: t.ms,
    })),
    feedback: store
      .listFeedback(tenant.id, c.started)
      .filter((f) => f.conversation === c.id)
      .map((f) => ({ turn: f.turn ?? null, vote: f.vote, note: f.note ?? null, at: f.at })),
    handoffs: store
      .listHandoffs(tenant.id, c.started)
      .filter((h) => h.conversation === c.id)
      .map((h) => ({ email: h.email, note: h.note ?? null, at: h.at })),
  };
}

function getTraffic(store: Store, tenant: Tenant, since: number) {
  const id = tenant.id;
  const machine = { since, type: "request", kinds: MACHINE_KINDS };
  const families = MACHINE_KINDS.flatMap((kind) =>
    store
      .groupEvents(id, "family", { since, type: "request", kinds: [kind] })
      .filter((c) => c.key)
      .map((c) => ({ family: c.key, kind, requests: c.n, verifiedShare: getShare(c.verified, c.n) })),
  ).sort((a, b) => b.requests - a.requests);
  const cdnRows = store.groupEvents(id, "family", { since, type: "cdn" }).map((c) => ({ key: c.key || "unknown", n: c.n }));
  return {
    byDay: store.listEventDays(id, "kind", { since, type: "request" }),
    families,
    paths: store
      .groupEvents(id, "path", machine)
      .slice(0, TOP_ROWS)
      .map((c) => ({ path: c.key || "/", n: c.n, verified: c.verified })),
    browserPages: store
      .groupEvents(id, "page", { since, type: "beacon", kinds: ["browser"] })
      .map((c) => ({ page: c.key || "unknown", n: c.n })),
    cdn: { connected: cdnRows.length > 0 || !!tenant.settings.cdn, rows: cdnRows },
  };
}

function getQuestions(store: Store, tenant: Tenant, since: number) {
  const sessionOf = (conversation: string) => conversation.slice(tenant.id.length + 1);
  return {
    top: groupQuestions(store.listQuestions(tenant.id, since, 5000)).map((g) => ({
      text: g.text,
      n: g.n,
      lastAt: g.last,
      session: sessionOf(g.conversation),
    })),
    gaps: listGaps(store, tenant.id, since).map((g) => ({
      session: g.conversation.session,
      said: g.first,
      reason: g.handoff ? "handoff" : "thumbs_down",
      at: g.conversation.updated,
    })),
  };
}

/** A plain reason for a CDN failure. The token is never in it. */
function readCdnError(err: unknown): string {
  const text = err instanceof Error ? err.message : "";
  if (/^cloudflare: /.test(text)) return "Cloudflare refused the request: " + text.slice("cloudflare: ".length) + ".";
  if (/^cloudflare status /.test(text)) return "Cloudflare did not answer (" + text.slice("cloudflare ".length) + "). Try again.";
  if (text) return text.replace(/\.?$/, ".");
  return "The CDN check failed. Try again.";
}
