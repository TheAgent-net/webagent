import type { Harness } from "../harness.ts";
import { intake } from "../intake.ts";
import { agentCard, CARD_PATHS, connectPrompt, linkHeader, TEXT_CARD_PATHS, type AgentCardMeta } from "./card.ts";
import { corsPreflight, withCors } from "./cors.ts";
import { clientKind, wantsAgentCard, wantsHumanPage, wantsJsonCard } from "./detect.ts";
import { chatPage } from "./page.ts";
import { Room } from "./room.ts";
import { readSessionId, sessionCookie, Sessions } from "./sessions.ts";
import { looksLikeSitePage, siteResponse } from "./site.ts";
import type { McpServerInfo } from "../mcp.ts";

export function publicUrl(req: Request, fallback: string): string {
  const env = process.env.WEBAGENT_PUBLIC_URL;
  if (env) return env.replace(/\/+$/, "");
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  const proto = req.headers.get("x-forwarded-proto") || new URL(req.url).protocol.replace(":", "");
  if (host) return `${proto}://${host}`;
  return fallback;
}

/** Public host: humans get the page, machines get a text card then POST /chat. Each chat is a fresh run. */
export function host(
  harness: Harness,
  room: Room,
  fallbackUrl = "http://127.0.0.1:8787",
  meta: AgentCardMeta = {},
  sessions?: Sessions,
  mcpInfo?: McpServerInfo,
): (req: Request) => Promise<Response> {
  const api = intake(harness, mcpInfo);
  const bag = sessions ?? new Sessions(harness, room);
  return async (req: Request) => {
    if (req.method === "OPTIONS") return corsPreflight();
    return withCors(await route(req, harness, bag, fallbackUrl, meta, api));
  };
}

async function route(
  req: Request,
  harness: Harness,
  sessions: Sessions,
  fallbackUrl: string,
  meta: AgentCardMeta,
  api: (req: Request) => Promise<Response>,
): Promise<Response> {
  const url = new URL(req.url);
  const kind = clientKind(req);
  const base = publicUrl(req, fallbackUrl);
  const lobby = sessions.lobby;

  if (url.pathname === "/who") return Response.json({ kind, runId: lobby.run.id });
  if (TEXT_CARD_PATHS.has(url.pathname)) return textCard(req, sessions, base);
  if (CARD_PATHS.has(url.pathname)) return jsonCard(base, lobby, meta);
  if (url.pathname === "/session" && (req.method === "POST" || req.method === "GET")) {
    const hit = sessions.knownOrMint(readSessionId(req, undefined, { query: false }));
    return withSession(Response.json({ session: hit.id, runId: hit.room.run.id }), hit.id);
  }
  if (url.pathname === "/live") {
    const hit = sessions.open(readSessionId(req, url.searchParams.get("session")));
    return withSession(hit.room.stream(), hit.id);
  }
  if (url.pathname === "/chat" && req.method === "POST") {
    const body = (await req.json().catch(() => ({}))) as {
      text?: string;
      from?: "human" | "machine";
      session?: string;
    };
    const hit = sessions.open(readSessionId(req, body.session));
    const ex = await hit.room.say(chatFrom(req, body), body.text ?? "");
    return withSession(Response.json({ ...ex, session: hit.id, runId: hit.room.run.id }), hit.id);
  }
  if ((req.method === "GET" || req.method === "HEAD") && url.pathname !== "/") {
    const asset = siteResponse(url);
    if (asset) return asset;
    if (kind === "human" && looksLikeSitePage(url.pathname) && !reserved(url.pathname)) {
      return Response.redirect("https://composio.dev" + url.pathname + url.search, 302);
    }
  }
  if (url.pathname === "/" && req.method === "GET") {
    const forceHuman = wantsHumanPage(url);
    const forceAgent = wantsAgentCard(url);
    if (!forceHuman && (forceAgent || kind === "machine")) {
      if (wantsJsonCard(req, url)) {
        const sid = existingSession(req, sessions);
        if (sid) return withSession(jsonCard(base, lobby, meta, sid), sid);
        return jsonCard(base, lobby, meta);
      }
      return textCard(req, sessions, base);
    }
    return chatPage(lobby, base);
  }
  if (url.pathname === "/" && req.method === "POST" && kind === "machine") {
    const raw = await req.text();
    try {
      const body = JSON.parse(raw) as { method?: string; text?: string; session?: string };
      if (body.method) {
        return api(
          new Request(new URL("/mcp", req.url), {
            method: "POST",
            headers: req.headers,
            body: raw,
          }),
        );
      }
      if (body.text) {
        const hit = sessions.open(readSessionId(req, body.session));
        const ex = await hit.room.say("machine", body.text);
        return withSession(Response.json({ ...ex, session: hit.id, runId: hit.room.run.id }), hit.id);
      }
    } catch {
      /* fall through */
    }
  }
  return api(req);
}

function existingSession(req: Request, sessions: Sessions): string | undefined {
  const sticky = readSessionId(req, undefined, { query: false });
  if (sticky && sessions.get(sticky)) return sticky;
  return undefined;
}

function textCard(req: Request, sessions: Sessions, base: string): Response {
  const sid = existingSession(req, sessions);
  const res = new Response(connectPrompt(base, sid), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      Link: linkHeader(base),
      "Cache-Control": "no-store",
      Vary: "Accept, User-Agent, Sec-Fetch-Dest, Sec-Fetch-User, Sec-Fetch-Mode",
    },
  });
  return sid ? withSession(res, sid) : res;
}

function chatFrom(req: Request, body: { from?: "human" | "machine" }): "human" | "machine" {
  if (body.from === "human" || body.from === "machine") return body.from;
  const ua = req.headers.get("user-agent") ?? "";
  if (/mozilla/i.test(ua) && !/bot|curl\/|claude|gptbot|httpie|python-requests|cursor|electron|playwright|headless/i.test(ua)) {
    return "human";
  }
  return clientKind(req);
}

function reserved(pathname: string): boolean {
  if (pathname === "/mcp" || pathname === "/chat" || pathname === "/live" || pathname === "/who") return true;
  if (pathname === "/session" || pathname === "/health" || pathname === "/models") return true;
  if (pathname.startsWith("/runs") || pathname.startsWith("/sites")) return true;
  return TEXT_CARD_PATHS.has(pathname) || CARD_PATHS.has(pathname);
}

function jsonCard(base: string, room: Room, meta: AgentCardMeta, session?: string): Response {
  const res = Response.json(agentCard(base, room, meta, session));
  res.headers.set("Link", linkHeader(base));
  res.headers.set("Cache-Control", "no-store");
  return res;
}

function withSession(res: Response, id: string): Response {
  const out = new Response(res.body, res);
  out.headers.set("X-Session-Id", id);
  out.headers.append("Set-Cookie", sessionCookie(id));
  return out;
}
