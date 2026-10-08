/**
 * Auth: the dashboard API trusts the Agent-net platform session.
 *
 * - The browser sends the `agentnet_session` cookie. We send that cookie to `GET {platform}/auth/me`.
 * - We keep each answer for 30 s. The cache key is the SHA-256 of the cookie value.
 * - We never log a cookie or a key.
 * - `Authorization: Bearer <WEBAGENT_ADMIN_KEY>` is the super admin. It may read every org. It may not write.
 */
import { createHash, timingSafeEqual } from "node:crypto";

export type Role = "owner" | "admin" | "member";

export interface Membership {
  org: string;
  role: Role;
  status: string;
}

/** The person (or the super admin) that sent the request. */
export interface User {
  id: string;
  email: string;
  memberships: Membership[];
  /** True for the `WEBAGENT_ADMIN_KEY` bearer. */
  super: boolean;
}

/** Why there is no user: no valid session (`login`), or the platform failed (`server`). */
export type Failure = "login" | "server";

export interface PlatformOpts {
  /** Platform base URL. Default: `AGENTNET_PLATFORM_URL`, else `http://platform:8000`. */
  url?: string;
  /** Super admin key. Default: `WEBAGENT_ADMIN_KEY`. Empty turns the bearer off. */
  adminKey?: string;
  /** Fetch for `/auth/me`. Tests pass a fake. */
  fetch?: typeof fetch;
  /** Clock. Tests set it. */
  now?: () => number;
}

export const SESSION_COOKIE = "agentnet_session";
const CACHE_MS = 30_000;
const TIMEOUT_MS = 3000;
const CACHE_CAP = 10_000;
const ROLES: Role[] = ["owner", "admin", "member"];

/** Client for the platform session check. */
export class Platform {
  private readonly url: string;
  private readonly adminKey: string;
  private readonly send: typeof fetch;
  private readonly now: () => number;
  private readonly cache = new Map<string, { user: User | undefined; until: number }>();

  constructor(opts: PlatformOpts = {}) {
    this.url = (opts.url ?? process.env.AGENTNET_PLATFORM_URL ?? "http://platform:8000").replace(/\/+$/, "");
    this.adminKey = opts.adminKey ?? process.env.WEBAGENT_ADMIN_KEY ?? "";
    this.send = opts.fetch ?? fetch;
    this.now = opts.now ?? Date.now;
  }

  /** Get the user of the request. Return a failure when there is no valid session. */
  async getUser(req: Request): Promise<User | Failure> {
    const bearer = /^Bearer\s+(.+)$/i.exec(req.headers.get("authorization") ?? "")?.[1]?.trim();
    if (bearer !== undefined) {
      if (!this.adminKey || !sameText(bearer, this.adminKey)) return "login";
      return { id: "super", email: "", memberships: [], super: true };
    }
    const session = getCookie(req, SESSION_COOKIE);
    if (!session) return "login";
    const key = createHash("sha256").update(session).digest("hex");
    const hit = this.cache.get(key);
    if (hit && hit.until > this.now()) return hit.user ?? "login";

    let res: Response;
    try {
      res = await this.send(this.url + "/auth/me", {
        headers: { cookie: SESSION_COOKIE + "=" + session, accept: "application/json" },
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    } catch (err) {
      console.warn("platform auth failed: " + (err instanceof Error ? err.name : "error"));
      return "server";
    }
    if (res.status === 401 || res.status === 403) {
      this.keep(key, undefined);
      return "login";
    }
    if (!res.ok) {
      console.warn("platform auth failed: HTTP " + res.status);
      return "server";
    }
    const user = readUser(await res.json().catch(() => undefined));
    if (!user) {
      console.warn("platform auth failed: bad /auth/me body");
      return "server";
    }
    this.keep(key, user);
    return user;
  }

  private keep(key: string, user: User | undefined): void {
    if (this.cache.size >= CACHE_CAP) this.cache.clear();
    this.cache.set(key, { user, until: this.now() + CACHE_MS });
  }
}

/** True when the user may read the org: an active membership, or the super admin. */
export function canRead(user: User, org: string): boolean {
  return user.super || user.memberships.some((m) => m.org === org && m.status === "active");
}

/** True when the user may write in the org: an active `owner` or `admin`. The super admin only reads. */
export function canWrite(user: User, org: string): boolean {
  return user.memberships.some((m) => m.org === org && m.status === "active" && (m.role === "owner" || m.role === "admin"));
}

/**
 * Check a write request against cross-site use.
 * - The body must be `application/json`. A plain HTML form cannot send it.
 * - When `Origin` is present, it must be in `origins`.
 * Return the reason when the request fails the check.
 */
export function checkWrite(req: Request, origins: string[]): { status: number; reason: string } | undefined {
  const type = (req.headers.get("content-type") ?? "").split(";")[0]!.trim().toLowerCase();
  if (type !== "application/json") return { status: 415, reason: "Send the body as application/json." };
  const origin = req.headers.get("origin");
  if (origin !== null && !origins.includes(origin)) return { status: 403, reason: "This origin may not write." };
  return undefined;
}

/** Read the dashboard origins from `WEBAGENT_DASHBOARD_ORIGINS`. */
export function listOrigins(text = process.env.WEBAGENT_DASHBOARD_ORIGINS ?? "https://app.agentnet.market"): string[] {
  return text
    .split(",")
    .map((o) => o.trim().replace(/\/+$/, ""))
    .filter(Boolean);
}

/** Check the `/auth/me` body. Keep only what we use. */
function readUser(body: unknown): User | undefined {
  if (!body || typeof body !== "object") return undefined;
  const b = body as Record<string, unknown>;
  if (b.user_id === undefined || b.user_id === null || !Array.isArray(b.memberships)) return undefined;
  const memberships: Membership[] = [];
  for (const raw of b.memberships) {
    if (!raw || typeof raw !== "object") continue;
    const m = raw as Record<string, unknown>;
    const role = m.role as Role;
    if (m.org_id === undefined || m.org_id === null || !ROLES.includes(role)) continue;
    memberships.push({ org: String(m.org_id), role, status: String(m.status ?? "") });
  }
  return { id: String(b.user_id), email: typeof b.email === "string" ? b.email : "", memberships, super: false };
}

/** Constant-time text compare. Hash both sides so the lengths match. */
export function sameText(a: string, b: string): boolean {
  const x = createHash("sha256").update(a).digest();
  const y = createHash("sha256").update(b).digest();
  return timingSafeEqual(x, y) && a.length === b.length;
}

/** Read one raw cookie value from the request. */
export function getCookie(req: Request, name: string): string | undefined {
  const raw = req.headers.get("cookie");
  if (!raw) return undefined;
  for (const part of raw.split(";")) {
    const eq = part.indexOf("=");
    if (eq < 0) continue;
    if (part.slice(0, eq).trim() === name) return part.slice(eq + 1).trim() || undefined;
  }
  return undefined;
}
