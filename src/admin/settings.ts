/**
 * Settings: the install snippets and the site settings for the dashboard API.
 */
import { getCdnLast, getCdnSettings, ZONE_ID, type CdnLast } from "../host/cdn.ts";
import { isEmail } from "../host/handoff.ts";
import type { Store, Tenant } from "../store/store.ts";

export interface Handoff {
  email: string;
  webhook: string;
  slack: string;
}

export interface Settings {
  install: { scriptTag: string; llmsLine: string; csp: string[] };
  domains: string[];
  origins: string[];
  handoff: Handoff;
  /** Most turns in one month. `0` means no cap. */
  cap: number;
  paused: boolean;
  /** The CDN link. `null` when there is none. Never holds the token. */
  cdn: CdnView | null;
}

export interface CdnView {
  provider: "cloudflare";
  zone: string;
  /** Where the token lives. */
  token: "dashboard" | "env" | "none";
  last: CdnLast | null;
}

/** A checked `cdn` body. `null` removes the link. */
export type CdnBody = null | { zone: string; token?: string };

const HOST_NAME = /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z][a-z0-9-]{0,61}[a-z0-9]$/;
const FIELDS = new Set(["domains", "origins", "handoff", "cap", "paused", "cdn"]);
const CDN_FIELDS = new Set(["zone", "token"]);
const TOKEN_TEXT = /^[A-Za-z0-9_-]{20,200}$/;
const HANDOFF_FIELDS = new Set(["email", "webhook", "slack"]);
const LIST_CAP = 50;
const CAP_TOP = 100_000_000;

/** The settings of one site. `ours` is the public origin of this service. */
export function getSettings(tenant: Tenant, ours: string): Settings {
  const raw = (tenant.settings.handoff ?? {}) as Record<string, unknown>;
  const text = (v: unknown) => (typeof v === "string" ? v : "");
  const cap = Number(tenant.settings.cap);
  return {
    install: {
      scriptTag: `<script src="${ours}/t/${tenant.id}/widget.js" async></script>`,
      llmsLine: `- [Talk to the ${tenant.name} agent](${ours}/t/${tenant.id}/chat): POST JSON {text, session}`,
      csp: [`script-src ${ours}`, `connect-src ${ours}`, `img-src ${ours}`, `font-src ${ours}`, "style-src 'unsafe-inline'"],
    },
    domains: tenant.domains,
    origins: tenant.origins,
    handoff: { email: text(raw.email), webhook: text(raw.webhook), slack: text(raw.slack) },
    cap: Number.isInteger(cap) && cap > 0 ? cap : 0,
    paused: tenant.settings.paused === true,
    cdn: getCdnView(tenant.settings),
  };
}

function getCdnView(settings: Record<string, unknown>): CdnView | null {
  const raw = settings.cdn as { zone?: unknown } | undefined;
  if (!raw || typeof raw.zone !== "string") return null;
  const cdn = getCdnSettings(settings);
  return {
    provider: "cloudflare",
    zone: raw.zone,
    token: cdn?.token ? "dashboard" : cdn?.tokenEnv ? "env" : "none",
    last: getCdnLast(settings) ?? null,
  };
}

/**
 * Check the `cdn` field of a settings body. The caller checks the token with Cloudflare and locks it.
 * - `null` removes the link.
 * - `{ zone, token? }` sets the link. Without a token, a stored token must exist.
 */
export function readCdn(tenant: Tenant, value: unknown): { cdn?: CdnBody; errors: string[] } {
  if (value === null) return { cdn: null, errors: [] };
  if (!value || typeof value !== "object" || Array.isArray(value)) return { errors: ["CDN must be an object or null."] };
  const errors: string[] = [];
  const v = value as Record<string, unknown>;
  for (const k of Object.keys(v)) if (!CDN_FIELDS.has(k)) errors.push("Unknown CDN field: " + k.slice(0, 40) + ".");
  const zone = typeof v.zone === "string" ? v.zone.trim().toLowerCase() : "";
  if (!ZONE_ID.test(zone)) errors.push("Zone ID is not valid. Copy the 32 characters from the zone Overview page in Cloudflare.");
  let token: string | undefined;
  if (v.token !== undefined) {
    token = typeof v.token === "string" ? v.token.trim() : "";
    if (!TOKEN_TEXT.test(token)) errors.push("API token is not valid. Paste the token that Cloudflare showed when you made it.");
  } else if (!getCdnSettings(tenant.settings)) errors.push("Add an API token.");
  return errors.length ? { errors } : { cdn: { zone, ...(token ? { token } : {}) }, errors };
}

/**
 * Check a settings body and make the new tenant.
 * - The body is any subset of `domains`, `origins`, `handoff`, `cap`, `paused`, `cdn`. Other keys are errors.
 * - This function does not change `cdn`. Use `readCdn` for it.
 * - An empty handoff text clears that target.
 * When there are errors, the tenant does not change.
 */
export function readSettings(store: Store, tenant: Tenant, body: unknown): { tenant: Tenant; errors: string[] } {
  const errors: string[] = [];
  if (!body || typeof body !== "object" || Array.isArray(body)) return { tenant, errors: ["Send a JSON object."] };
  const b = body as Record<string, unknown>;
  for (const k of Object.keys(b)) if (!FIELDS.has(k)) errors.push("Unknown field: " + k.slice(0, 40) + ".");
  const next: Tenant = { ...tenant, settings: { ...tenant.settings } };

  if ("origins" in b) {
    const list = readList(b.origins, "origins", errors);
    const origins: string[] = [];
    for (const o of list) {
      const origin = readOrigin(o);
      if (origin) origins.push(origin);
      else errors.push("Origin is not valid: " + o.slice(0, 200) + ". Use the form https://www.example.com.");
    }
    next.origins = [...new Set(origins)];
  }

  if ("domains" in b) {
    const domains: string[] = [];
    for (const raw of readList(b.domains, "domains", errors)) {
      const d = raw.trim().toLowerCase();
      if (!HOST_NAME.test(d)) errors.push("Domain is not valid: " + raw.slice(0, 200) + ".");
      else {
        const owner = store.findTenant(d);
        if (owner && owner.id !== tenant.id) errors.push("Domain " + d + " belongs to a different site.");
        else domains.push(d);
      }
    }
    next.domains = [...new Set(domains)];
  }

  if ("handoff" in b) {
    const h = b.handoff;
    if (!h || typeof h !== "object" || Array.isArray(h)) errors.push("Handoff must be an object.");
    else {
      const old = (tenant.settings.handoff ?? {}) as Record<string, unknown>;
      const out: Record<string, string> = {};
      for (const k of HANDOFF_FIELDS) if (typeof old[k] === "string" && old[k]) out[k] = old[k] as string;
      for (const [k, v] of Object.entries(h as Record<string, unknown>)) {
        if (!HANDOFF_FIELDS.has(k)) {
          errors.push("Unknown handoff field: " + k.slice(0, 40) + ".");
          continue;
        }
        if (typeof v !== "string") {
          errors.push("Handoff " + k + " must be text.");
          continue;
        }
        const value = v.trim();
        if (!value) delete out[k];
        else if (k === "email" && !isEmail(value)) errors.push("Handoff email is not valid.");
        else if (k !== "email" && !isHttps(value)) errors.push("Handoff " + k + " must be an https URL.");
        else out[k] = value;
      }
      if (Object.keys(out).length) next.settings.handoff = out;
      else delete next.settings.handoff;
    }
  }

  if ("cap" in b) {
    const cap = b.cap;
    if (typeof cap !== "number" || !Number.isInteger(cap) || cap < 0 || cap > CAP_TOP) {
      errors.push("Cap must be a whole number from 0 to " + CAP_TOP + ".");
    } else if (cap === 0) delete next.settings.cap;
    else next.settings.cap = cap;
  }

  /* `cdn` is checked by `readCdn`. The token check needs Cloudflare. */

  if ("paused" in b) {
    if (typeof b.paused !== "boolean") errors.push("Paused must be true or false.");
    else next.settings.paused = b.paused;
  }

  return errors.length ? { tenant, errors } : { tenant: next, errors };
}

function readList(value: unknown, name: string, errors: string[]): string[] {
  if (!Array.isArray(value) || value.some((v) => typeof v !== "string")) {
    errors.push(name[0]!.toUpperCase() + name.slice(1) + " must be a list of text.");
    return [];
  }
  if (value.length > LIST_CAP) {
    errors.push(name[0]!.toUpperCase() + name.slice(1) + " can have at most " + LIST_CAP + " items.");
    return [];
  }
  return (value as string[]).map((v) => v.trim()).filter(Boolean);
}

/** The origin of an http(s) origin text, or undefined. A path, a query, or a user name is not valid. */
function readOrigin(text: string): string | undefined {
  try {
    const u = new URL(text);
    if (u.protocol !== "https:" && u.protocol !== "http:") return undefined;
    if (u.origin !== text.toLowerCase().replace(/\/+$/, "")) return undefined;
    return u.origin;
  } catch {
    return undefined;
  }
}

function isHttps(text: string): boolean {
  try {
    const u = new URL(text);
    return u.protocol === "https:" && !u.username && !u.password && text.length <= 2000;
  } catch {
    return false;
  }
}
