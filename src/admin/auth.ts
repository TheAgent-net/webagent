/**
 * Auth: admin keys, signed session cookies, and CSRF tokens.
 *
 * - The super key comes from `WEBAGENT_ADMIN_KEY`. It sees every tenant.
 * - A tenant key looks like `<tenant>.<secret>`. The store keeps only a salted SHA-256 hash.
 * - The session cookie is `<payload>.<HMAC>`. Remove a key to end its sessions.
 * - Every comparison runs in constant time.
 */
import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import type { Tenant } from "../store/store.ts";

/** One stored tenant key. The raw key is never stored. */
export interface KeyRecord {
  label: string;
  salt: string;
  hash: string;
  created: number;
}

/** Who is signed in. */
export interface Session {
  role: "super" | "tenant";
  /** Tenant id for a tenant admin. */
  tenant?: string;
  /** First 16 characters of the key hash. The key must still exist. */
  key: string;
  /** Random value. The CSRF token derives from it. */
  nonce: string;
  /** Expiry time in milliseconds. */
  exp: number;
}

export const SESSION_TTL = 12 * 60 * 60 * 1000;

/** Hex SHA-256 of salt and key. */
export function hashKey(key: string, salt: string): string {
  return createHash("sha256").update(salt + ":" + key).digest("hex");
}

/** Make a new tenant key. Show `key` once. Store `record`. */
export function mintKey(tenant: string, label = "admin", now = Date.now()): { key: string; record: KeyRecord } {
  const key = tenant + "." + randomBytes(24).toString("base64url");
  const salt = randomBytes(16).toString("hex");
  return { key, record: { label, salt, hash: hashKey(key, salt), created: now } };
}

/** Stored key records of one tenant. Bad entries are skipped. */
export function listKeys(tenant: Tenant): KeyRecord[] {
  const raw = tenant.settings.adminKeys;
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (r): r is KeyRecord =>
      !!r && typeof r === "object" && typeof (r as KeyRecord).salt === "string" && typeof (r as KeyRecord).hash === "string",
  );
}

/** The record that matches the key, or undefined. Checks every record in constant time. */
export function matchKey(records: KeyRecord[], key: string): KeyRecord | undefined {
  let hit: KeyRecord | undefined;
  for (const r of records) if (sameText(hashKey(key, r.salt), r.hash) && !hit) hit = r;
  return hit;
}

/** Constant-time text compare. Hash both sides so the lengths match. */
export function sameText(a: string, b: string): boolean {
  const x = createHash("sha256").update(a).digest();
  const y = createHash("sha256").update(b).digest();
  return timingSafeEqual(x, y) && a.length === b.length;
}

/** Short mark of the super key. A new key ends old super sessions. */
export function superMark(adminKey: string): string {
  return createHash("sha256").update("super:" + adminKey).digest("hex").slice(0, 16);
}

export function signSession(secret: string, session: Session): string {
  const body = Buffer.from(JSON.stringify(session)).toString("base64url");
  return body + "." + mac(secret, "session." + body);
}

/** Read and check a session token. Undefined when the token is bad or old. */
export function readSession(secret: string, token: string | undefined, now = Date.now()): Session | undefined {
  if (!token) return undefined;
  const dot = token.indexOf(".");
  if (dot < 1) return undefined;
  const body = token.slice(0, dot);
  if (!sameText(token.slice(dot + 1), mac(secret, "session." + body))) return undefined;
  try {
    const s = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as Session;
    if (typeof s.exp !== "number" || s.exp < now) return undefined;
    if (s.role !== "super" && s.role !== "tenant") return undefined;
    if (s.role === "tenant" && typeof s.tenant !== "string") return undefined;
    if (typeof s.key !== "string" || typeof s.nonce !== "string") return undefined;
    return s;
  } catch {
    return undefined;
  }
}

/** CSRF token for one session. */
export function csrfToken(secret: string, nonce: string): string {
  return mac(secret, "csrf." + nonce);
}

export function randomToken(): string {
  return randomBytes(18).toString("base64url");
}

function mac(secret: string, text: string): string {
  return createHmac("sha256", secret).update(text).digest("base64url");
}

/** Read one cookie value from the request. */
export function getCookie(req: Request, name: string): string | undefined {
  const raw = req.headers.get("cookie");
  if (!raw) return undefined;
  for (const part of raw.split(";")) {
    const eq = part.indexOf("=");
    if (eq < 0) continue;
    if (part.slice(0, eq).trim() === name) return decodeURIComponent(part.slice(eq + 1).trim());
  }
  return undefined;
}

/** Set-Cookie value. HttpOnly and SameSite=Lax. Secure on HTTPS. */
export function makeCookie(name: string, value: string, opts: { secure: boolean; maxAge: number }): string {
  const parts = [name + "=" + encodeURIComponent(value), "Path=/admin", "HttpOnly", "SameSite=Lax", "Max-Age=" + opts.maxAge];
  if (opts.secure) parts.push("Secure");
  return parts.join("; ");
}

/** True when the client used HTTPS (direct or behind a proxy). */
export function isSecure(req: Request): boolean {
  const proto = req.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  return (proto || new URL(req.url).protocol.replace(":", "")) === "https";
}
