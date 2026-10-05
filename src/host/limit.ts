/**
 * Limit: token buckets per key, plus the per-tenant monthly cap and pause switch.
 *
 * - One bucket holds `n` tokens and refills `n` tokens per minute.
 * - Keys are a hashed IP or a session id. Never a raw IP.
 * - The map has a key cap. The least recently used key goes first.
 */
import type { Store, Tenant } from "../store/store.ts";

/** Requests per minute for each rule. */
export interface Limits {
  /** Chat turns per minute from one IP. */
  chatIp: number;
  /** Chat turns per minute in one session. */
  chatSession: number;
  /** Beacons per minute from one IP on `/collect`. */
  collect: number;
  /** MCP calls per minute from one IP. */
  mcp: number;
  /** Votes per minute from one IP. */
  feedback: number;
  /** Handoff requests per minute from one IP. */
  handoff: number;
}

export type Rule = keyof Limits;

export const LIMITS: Limits = {
  chatIp: 20,
  chatSession: 6,
  collect: 60,
  mcp: 60,
  feedback: 30,
  handoff: 5,
};

const ENV: Record<Rule, string> = {
  chatIp: "WEBAGENT_LIMIT_CHAT_IP",
  chatSession: "WEBAGENT_LIMIT_CHAT_SESSION",
  collect: "WEBAGENT_LIMIT_COLLECT",
  mcp: "WEBAGENT_LIMIT_MCP",
  feedback: "WEBAGENT_LIMIT_FEEDBACK",
  handoff: "WEBAGENT_LIMIT_HANDOFF",
};

const KEY_CAP = 20_000;

/** Defaults, then env, then `tenant.settings.limits`. A value of 0 or less turns the rule off. */
export function getLimits(tenant?: Tenant): Limits {
  const out = { ...LIMITS };
  for (const rule of Object.keys(out) as Rule[]) {
    const env = process.env[ENV[rule]];
    if (env !== undefined && env !== "" && Number.isFinite(Number(env))) out[rule] = Number(env);
  }
  const own = tenant?.settings.limits;
  if (own && typeof own === "object") {
    for (const [rule, value] of Object.entries(own as Record<string, unknown>)) {
      if (rule in out && typeof value === "number" && Number.isFinite(value)) out[rule as Rule] = value;
    }
  }
  return out;
}

interface Bucket {
  tokens: number;
  at: number;
}

/** Result of one take. `wait` is the number of seconds until one token is back. */
export interface Take {
  ok: boolean;
  wait: number;
}

export class Limiter {
  private readonly buckets = new Map<string, Bucket>();

  constructor(
    private readonly cap = KEY_CAP,
    private readonly now: () => number = Date.now,
  ) {}

  /** Take one token from the bucket for `key`. `perMinute` is the bucket size and the refill rate. */
  take(key: string, perMinute: number): Take {
    if (!(perMinute > 0)) return { ok: true, wait: 0 };
    const now = this.now();
    const rate = perMinute / 60_000;
    const old = this.buckets.get(key);
    const tokens = old ? Math.min(perMinute, old.tokens + (now - old.at) * rate) : perMinute;
    if (old) this.buckets.delete(key);
    if (tokens < 1) {
      this.buckets.set(key, { tokens, at: now });
      return { ok: false, wait: Math.max(1, Math.ceil((1 - tokens) / rate / 1000)) };
    }
    this.buckets.set(key, { tokens: tokens - 1, at: now });
    this.clear();
    return { ok: true, wait: 0 };
  }

  /** Number of keys in memory. */
  get size(): number {
    return this.buckets.size;
  }

  /** Drop the least recently used keys past the cap. */
  private clear(): void {
    while (this.buckets.size > this.cap) {
      const key = this.buckets.keys().next().value;
      if (key === undefined) break;
      this.buckets.delete(key);
    }
  }
}

/** The 429 reply. Humans get a short text in `lastText` so the widget can show it. */
export function refuseRate(wait: number): Response {
  return Response.json(
    {
      error: "rate_limited",
      reason: "Too many requests. Wait and try again.",
      lastText: "You are sending messages very fast. Please wait a moment and try again.",
      retryAfter: wait,
    },
    { status: 429, headers: { "Retry-After": String(wait) } },
  );
}

/** A hold on a tenant: the reason it does not answer now. */
export type Hold = "paused" | "cap";

export const HOLD_TEXT: Record<Hold, string> = {
  paused: "This assistant is not available right now. Please contact the team directly.",
  cap: "This assistant has reached its limit for this month. Please contact the team directly.",
};

/** First millisecond of the current month in UTC. */
export function getMonthStart(now = Date.now()): number {
  const d = new Date(now);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1);
}

/** Return why this tenant must not answer, or undefined when it may answer. */
export function getHold(tenant: Tenant | undefined, store: Store | undefined, now = Date.now()): Hold | undefined {
  if (!tenant) return undefined;
  if (tenant.settings.paused === true) return "paused";
  const cap = Number(tenant.settings.cap);
  if (store && Number.isFinite(cap) && cap > 0) {
    try {
      if (store.countTurns(tenant.id, getMonthStart(now)) >= cap) return "cap";
    } catch (err) {
      console.error("count turns failed:", err instanceof Error ? err.message : err);
    }
  }
  return undefined;
}
