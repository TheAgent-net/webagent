/**
 * Cloud: one service that hosts every tenant.
 *
 * - `/t/<id>/…` goes to tenant `<id>`. Every single-pack route works under this prefix.
 * - A request whose host name is a tenant domain goes to that tenant with no prefix.
 * - `routes` runs first. Use it for the dashboard API (`/webagent/api`), the product site, and other service routes.
 */
import { corsPreflight, withCors } from "./cors.ts";
import { publicUrl } from "./host.ts";
import type { Tenants } from "./tenant.ts";

export type Route = (req: Request, url: URL) => Promise<Response | null> | Response | null;

export interface CloudOpts {
  /** Local URL, used when no proxy header or `WEBAGENT_PUBLIC_URL` gives one. */
  fallbackUrl?: string;
  /** Service routes. The first one that returns a response wins. */
  routes?: Route[];
}

const PREFIX = /^\/t\/([a-z0-9][a-z0-9_-]{0,62})(\/.*)?$/;

export function cloud(tenants: Tenants, opts: CloudOpts = {}): (req: Request) => Promise<Response> {
  const fallback = opts.fallbackUrl ?? "http://127.0.0.1:8787";
  return async (req: Request) => {
    const url = new URL(req.url);
    for (const route of opts.routes ?? []) {
      const res = await route(req, url);
      if (res) return res;
    }

    const hit = PREFIX.exec(url.pathname);
    if (hit) {
      const id = hit[1]!;
      const rest = hit[2] || "/";
      const base = (r: Request) => publicUrl(r, fallback) + "/t/" + id;
      return forward(tenants, id, base, req, url, rest);
    }

    const host = (req.headers.get("x-forwarded-host") || req.headers.get("host") || "").split(",")[0]!.trim();
    const owner = host ? tenants.forDomain(host) : undefined;
    if (owner) {
      const base = (r: Request) => {
        const proto = r.headers.get("x-forwarded-proto") || new URL(r.url).protocol.replace(":", "");
        return proto + "://" + host;
      };
      return forward(tenants, owner.id, base, req, url, url.pathname);
    }

    if (req.method === "OPTIONS") return corsPreflight();
    if (url.pathname === "/health") return withCors(Response.json({ ok: true, tenants: tenants.list().length }));
    if (url.pathname === "/") {
      return new Response("webagent cloud. Agents live at /t/<site>/.\n", {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }
    return new Response("not found", { status: 404 });
  };
}

async function forward(
  tenants: Tenants,
  id: string,
  base: (req: Request) => string,
  req: Request,
  url: URL,
  path: string,
): Promise<Response> {
  let live;
  try {
    live = await tenants.get(id, base);
  } catch (err) {
    console.error("tenant " + id + " failed to open:", err instanceof Error ? err.message : err);
    return withCors(new Response("agent unavailable", { status: 503 }));
  }
  if (!live) return withCors(new Response("unknown site", { status: 404 }));
  const inner = new URL(url);
  inner.pathname = path;
  return live.mounted.fetch(new Request(inner, req));
}

export interface ServeCloudOpts extends CloudOpts {
  port?: number;
  hostname?: string;
}

/** Bind the cloud on one port. */
export function serveCloud(tenants: Tenants, opts: ServeCloudOpts = {}): { url: string; stop: () => void } {
  const port = opts.port ?? 8787;
  const local = "http://127.0.0.1:" + port;
  const server = Bun.serve({
    port,
    hostname: opts.hostname ?? "0.0.0.0",
    idleTimeout: 120,
    fetch: cloud(tenants, { ...opts, fallbackUrl: opts.fallbackUrl ?? local }),
  });
  const url = process.env.WEBAGENT_PUBLIC_URL?.replace(/\/+$/, "") || "http://127.0.0.1:" + server.port;
  return { url, stop: () => server.stop(true) };
}
