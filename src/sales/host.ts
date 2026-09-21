/**
 * Public host for the Corgi insurance advisor.
 * Humans get the branded page + chat widget. Machines get agent card + POST /chat.
 */
import type { Harness } from "../harness.ts";
import { intake } from "../intake.ts";
import { corsPreflight, withCors } from "../host/cors.ts";
import { clientKind, wantsAgentCard } from "../host/detect.ts";
import { Room } from "../host/room.ts";
import { Sessions } from "./sessions.ts";
import { corgiAgentCard, corgiConnectPrompt } from "./card.ts";
import { corgiChatPage } from "./page.ts";
import { corgiSiteResponse } from "./site.ts";
import { knownPin } from "./known.ts";

const CARD_PATHS = new Set([
  "/agent.json",
  "/agent-card.json",
  "/.well-known/agent.json",
  "/.well-known/agent-card.json",
]);

const TEXT_CARD_PATHS = new Set(["/connect.txt", "/llms.txt", "/.well-known/llms.txt"]);

export function publicUrl(req: Request, fallback: string): string {
  const env = process.env.WEBAGENT_PUBLIC_URL;
  if (env) return env.replace(/\/+$/, "");
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  const proto = req.headers.get("x-forwarded-proto") || new URL(req.url).protocol.replace(":", "");
  if (host) return `${proto}://${host}`;
  return fallback;
}

export function corgiHost(
  harness: Harness,
  room: Room,
  fallbackUrl = "http://127.0.0.1:8787",
  sessions?: Sessions,
): (req: Request) => Promise<Response> {
  const api = intake(harness);
  const bag = sessions ?? new Sessions(harness, room);
  return async (req: Request) => {
    if (req.method === "OPTIONS") return corsPreflight();
    return withCors(await route(req, harness, bag, fallbackUrl, api));
  };
}

function readSessionId(req: Request, bodySession?: string | null): string | undefined {
  if (bodySession) return bodySession;
  const hdr = req.headers.get("x-session-id");
  if (hdr) return hdr;
  const cookie = req.headers.get("cookie");
  if (cookie) {
    const m = cookie.match(/wa_session=([^;]+)/);
    if (m) return m[1];
  }
  return undefined;
}

function sessionCookie(id: string): string {
  return `wa_session=${id}; Path=/; SameSite=Lax`;
}

function withSession(res: Response, id: string): Response {
  const out = new Response(res.body, res);
  out.headers.set("X-Session-Id", id);
  out.headers.append("Set-Cookie", sessionCookie(id));
  return out;
}

async function route(
  req: Request,
  harness: Harness,
  sessions: Sessions,
  fallbackUrl: string,
  api: (req: Request) => Promise<Response>,
): Promise<Response> {
  const url = new URL(req.url);
  const kind = clientKind(req);
  const base = publicUrl(req, fallbackUrl);
  const lobby = sessions.lobby;

  if (url.pathname === "/who") return Response.json({ kind, runId: lobby.run.id });

  if (TEXT_CARD_PATHS.has(url.pathname)) {
    const sid = existingSession(req, sessions);
    const body = corgiConnectPrompt(base, sid ?? undefined);
    const res = new Response(body, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        Link: linkHeader(base),
        "Cache-Control": "no-store",
        Vary: "Accept, User-Agent, Sec-Fetch-Dest",
      },
    });
    return sid ? withSession(res, sid) : res;
  }

  if (CARD_PATHS.has(url.pathname)) {
    const sid = existingSession(req, sessions);
    return jsonCard(base, lobby, sid ?? undefined);
  }

  if (url.pathname === "/session" && (req.method === "POST" || req.method === "GET")) {
    const hit = sessions.open(readSessionId(req));
    return withSession(Response.json({ session: hit.id, runId: hit.room.run.id }), hit.id);
  }

  if (url.pathname === "/live") {
    const hit = sessions.open(readSessionId(req, url.searchParams.get("session")));
    return withSession(hit.room.stream(), hit.id);
  }

  if ((req.method === "GET" || req.method === "HEAD") && url.pathname !== "/") {
    const asset = corgiSiteResponse(url, req);
    if (asset) return asset;
  }

  if (url.pathname === "/chat" && req.method === "POST") {
    const body = (await req.json().catch(() => ({}))) as {
      text?: string;
      from?: "human" | "machine";
      session?: string;
    };
    const hit = sessions.open(readSessionId(req, body.session));
    pinKnown(hit.room, body.text ?? "");
    const ex = await hit.room.say(chatFrom(req, body), body.text ?? "");
    return withSession(Response.json({ ...ex, session: hit.id, runId: hit.room.run.id }), hit.id);
  }

  if (url.pathname === "/" && req.method === "GET") {
    if (wantsAgentCard(url) || kind === "machine") {
      const sid = existingSession(req, sessions);
      return jsonCard(base, lobby, sid ?? undefined);
    }
    return corgiChatPage(lobby, base, req);
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
        pinKnown(hit.room, body.text);
        const ex = await hit.room.say("machine", body.text);
        return withSession(Response.json({ ...ex, session: hit.id, runId: hit.room.run.id }), hit.id);
      }
    } catch {
      /* fall through */
    }
  }

  return api(req);
}

function pinKnown(room: Room, upcoming: string): void {
  const msgs = [...room.run.getContext(), { role: "user" as const, content: upcoming }];
  room.run.inject({ vars: knownPin(msgs) });
}

function existingSession(req: Request, sessions: Sessions): string | null {
  const sid = readSessionId(req);
  if (sid && sessions.get(sid)) return sid;
  return null;
}

function chatFrom(req: Request, body: { from?: "human" | "machine" }): "human" | "machine" {
  if (body.from === "human" || body.from === "machine") return body.from;
  const ua = req.headers.get("user-agent") ?? "";
  if (/mozilla/i.test(ua) && !/bot|curl\/|claude|gptbot|httpie|python-requests|cursor|electron|playwright|headless/i.test(ua)) {
    return "human";
  }
  return clientKind(req);
}

function linkHeader(base: string): string {
  return [
    `<${base}/llms.txt>; rel="alternate"; type="text/plain"`,
    `<${base}/.well-known/agent-card.json>; rel="describedby"; type="application/json"`,
    `<${base}/chat>; rel="webagent-chat"`,
  ].join(", ");
}

function jsonCard(base: string, room: Room, session?: string): Response {
  const card = corgiAgentCard(base, room, session);
  const res = Response.json(card);
  res.headers.set("Link", linkHeader(base));
  res.headers.set("Cache-Control", "no-store");
  return res;
}
