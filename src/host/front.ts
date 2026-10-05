/**
 * Front: the agentnet product site on the cloud root.
 *
 * - Static files from the `web/` folder (`/`, `/options/<name>/`, assets).
 * - `POST /access {site, email}`: a request to get an agent. Stored as a traffic event on tenant `_site`.
 * - A landing site on another origin may post to `/access` when `WEBAGENT_SITE_ORIGINS` lists that origin.
 */
import { existsSync, readFileSync, statSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";
import type { Store } from "../store/store.ts";
import { Limiter } from "./limit.ts";
import { hashIp } from "./visitor.ts";
import type { Route } from "./cloud.ts";

const TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
};

/** Tenant id for rows that belong to the product site, not to a customer. */
export const SITE_TENANT = "_site";

const EMAIL_OK = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,24}$/;

export interface FrontOpts {
  /** Folder with the site files. Default `web`. */
  dir?: string;
  /** Requests per minute per client for `/access`. */
  perMinute?: number;
  /** True when the request belongs to a tenant (a custom domain). The site then steps aside. */
  skip?: (req: Request) => boolean;
  /** Origins that may post to `/access` from a browser. Default: `WEBAGENT_SITE_ORIGINS` (comma list). */
  siteOrigins?: string[];
}

export function frontRoute(store: Store, opts: FrontOpts = {}): Route {
  const root = resolve(opts.dir ?? "web");
  const limiter = new Limiter();
  const perMinute = opts.perMinute ?? 5;
  const siteOrigins = opts.siteOrigins ?? listSiteOrigins();
  return async (req, url) => {
    if (opts.skip?.(req)) return null;
    if (url.pathname === "/access") {
      const cors = getCors(req, siteOrigins);
      if (req.method === "OPTIONS") {
        return new Response(null, { status: cors ? 204 : 403, headers: cors ?? { Vary: "Origin" } });
      }
      const res = await addAccess(req, store, limiter, perMinute);
      res.headers.set("Vary", "Origin");
      for (const [k, v] of Object.entries(cors ?? {})) res.headers.set(k, v);
      return res;
    }
    if (req.method !== "GET" && req.method !== "HEAD") return null;
    if (url.pathname.startsWith("/t/") || url.pathname.startsWith("/admin") || url.pathname.startsWith("/webagent/")) return null;
    return serveFile(root, url.pathname);
  };
}

/** Read the landing site origins from `WEBAGENT_SITE_ORIGINS`. */
export function listSiteOrigins(text = process.env.WEBAGENT_SITE_ORIGINS ?? ""): string[] {
  return text
    .split(",")
    .map((o) => o.trim().replace(/\/+$/, ""))
    .filter(Boolean);
}

/** CORS headers for `/access` when the request origin is a listed site origin. */
function getCors(req: Request, origins: string[]): Record<string, string> | undefined {
  const origin = req.headers.get("origin");
  if (!origin || !origins.includes(origin)) return undefined;
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

/** Serve one file from the site folder. A folder path serves its `index.html`. */
function serveFile(root: string, path: string): Response | null {
  let rel: string;
  try {
    rel = decodeURIComponent(path);
  } catch {
    return null;
  }
  let abs = normalize(join(root, rel));
  if (abs !== root && !abs.startsWith(root + "/")) return null;
  if (existsSync(abs) && statSync(abs).isDirectory()) {
    if (!path.endsWith("/")) return Response.redirect(path + "/", 301);
    abs = join(abs, "index.html");
  }
  const type = TYPES[extname(abs).toLowerCase()];
  if (!type || !existsSync(abs) || !statSync(abs).isFile()) return null;
  /* Keep notes and briefs private: only site assets are served. */
  const html = type.startsWith("text/html");
  return new Response(new Uint8Array(readFileSync(abs)), {
    headers: {
      "Content-Type": type,
      "Cache-Control": html ? "no-cache" : "public, max-age=3600",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

async function addAccess(req: Request, store: Store, limiter: Limiter, perMinute: number): Promise<Response> {
  if (req.method !== "POST") return Response.json({ error: "method", reason: "Send POST." }, { status: 405 });
  const ip = hashIp(req) ?? "local";
  const take = limiter.take("access|" + ip, perMinute);
  if (!take.ok) {
    return Response.json(
      { error: "rate", reason: "Too many requests. Try again in a minute." },
      { status: 429, headers: { "Retry-After": String(take.wait) } },
    );
  }
  const body = (await req.json().catch(() => ({}))) as { site?: unknown; email?: unknown };
  const email = typeof body.email === "string" ? body.email.trim().slice(0, 254) : "";
  const site = typeof body.site === "string" ? readSite(body.site) : undefined;
  if (!site) return Response.json({ error: "site", reason: "Enter your website address." }, { status: 400 });
  if (!EMAIL_OK.test(email)) return Response.json({ error: "email", reason: "Enter a work email." }, { status: 400 });
  store.addEvent({
    tenant: SITE_TENANT,
    at: Date.now(),
    type: "access",
    kind: "human",
    verified: false,
    ipHash: ip === "local" ? undefined : ip,
    data: { site, email },
  });
  return Response.json({ ok: true });
}

/** Normalize a site address to an https origin. Undefined when it is not a public web address. */
function readSite(raw: string): string | undefined {
  const text = raw.trim().slice(0, 300);
  if (!text) return undefined;
  try {
    const url = new URL(/^https?:\/\//i.test(text) ? text : "https://" + text);
    if (!/^https?:$/.test(url.protocol) || !url.hostname.includes(".")) return undefined;
    return url.origin;
  } catch {
    return undefined;
  }
}
