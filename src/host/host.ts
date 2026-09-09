import type { Harness } from "../harness.ts";
import { intake } from "../intake.ts";
import { agentCard, CARD_PATHS, connectPrompt, linkHeader, type AgentCardMeta } from "./card.ts";
import { corsPreflight, withCors } from "./cors.ts";
import { clientKind, wantsAgentCard } from "./detect.ts";
import { chatPage } from "./page.ts";
import { Room } from "./room.ts";
import { looksLikeSitePage, siteResponse } from "./site.ts";

export function publicUrl(req: Request, fallback: string): string {
  const env = process.env.WEBAGENT_PUBLIC_URL;
  if (env) return env.replace(/\/+$/, "");
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  const proto = req.headers.get("x-forwarded-proto") || new URL(req.url).protocol.replace(":", "");
  if (host) return `${proto}://${host}`;
  return fallback;
}

/** Public host: humans get the page, machines get MCP / JSON. Same room. */
export function host(
  harness: Harness,
  room: Room,
  fallbackUrl = "http://127.0.0.1:8787",
  meta: AgentCardMeta = {},
): (req: Request) => Promise<Response> {
  const api = intake(harness);
  return async (req: Request) => {
    if (req.method === "OPTIONS") return corsPreflight();
    return withCors(await route(req, harness, room, fallbackUrl, meta, api));
  };
}

async function route(
  req: Request,
  harness: Harness,
  room: Room,
  fallbackUrl: string,
  meta: AgentCardMeta,
  api: (req: Request) => Promise<Response>,
): Promise<Response> {
  const url = new URL(req.url);
  const kind = clientKind(req);
  const base = publicUrl(req, fallbackUrl);
  const card = () => jsonCard(base, room, meta);

  if (url.pathname === "/who") return Response.json({ kind, runId: room.run.id });
  if (url.pathname === "/connect.txt") {
    return new Response(connectPrompt(base), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }
  if (CARD_PATHS.has(url.pathname)) return card();
  if (url.pathname === "/live") return room.stream();
  if (url.pathname === "/chat" && req.method === "POST") {
    const body = (await req.json().catch(() => ({}))) as { text?: string; from?: "human" | "machine" };
    return Response.json(await room.say(chatFrom(req, body), body.text ?? ""));
  }
  if ((req.method === "GET" || req.method === "HEAD") && url.pathname !== "/") {
    const asset = siteResponse(url);
    if (asset) return asset;
    if (kind === "human" && looksLikeSitePage(url.pathname) && !reserved(url.pathname)) {
      return Response.redirect("https://composio.dev" + url.pathname + url.search, 302);
    }
  }
  if (url.pathname === "/" && req.method === "GET") {
    if (wantsAgentCard(url) || kind === "machine") return card();
    return chatPage(room, base);
  }
  if (url.pathname === "/" && req.method === "POST" && kind === "machine") {
    const raw = await req.text();
    try {
      const body = JSON.parse(raw) as { method?: string; text?: string };
      if (body.method) {
        return api(
          new Request(new URL("/mcp", req.url), {
            method: "POST",
            headers: req.headers,
            body: raw,
          }),
        );
      }
      if (body.text) return Response.json(await room.say("machine", body.text));
    } catch {
      /* fall through */
    }
  }
  return api(req);
}

function chatFrom(req: Request, body: { from?: "human" | "machine" }): "human" | "machine" {
  if (body.from === "human" || body.from === "machine") return body.from;
  const ua = req.headers.get("user-agent") ?? "";
  if (/mozilla/i.test(ua) && !/bot|curl\/|claude|gptbot|httpie|python-requests/i.test(ua)) return "human";
  return clientKind(req);
}

function reserved(pathname: string): boolean {
  if (pathname === "/mcp" || pathname === "/chat" || pathname === "/live" || pathname === "/who") return true;
  if (pathname === "/health" || pathname === "/models" || pathname === "/connect.txt") return true;
  if (pathname.startsWith("/runs") || pathname.startsWith("/sites")) return true;
  return CARD_PATHS.has(pathname);
}

function jsonCard(base: string, room: Room, meta: AgentCardMeta): Response {
  const res = Response.json(agentCard(base, room, meta));
  res.headers.set("Link", linkHeader(base));
  res.headers.set("Cache-Control", "no-store");
  return res;
}
