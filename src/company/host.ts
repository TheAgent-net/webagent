import type { Harness } from "../harness.ts";
import { intake } from "../intake.ts";
import { corsPreflight, withCors } from "../host/cors.ts";
import { clientKind, wantsAgentCard } from "../host/detect.ts";
import { publicUrl } from "../host/host.ts";
import { Room } from "../host/room.ts";
import { Sessions } from "../host/sessions.ts";
import { companyAgentCard, companyConnectPrompt } from "./card.ts";
import { companyPage } from "./page.ts";
import type { CompanyPack } from "./types.ts";

const CARD_PATHS = new Set([
  "/agent.json",
  "/agent-card.json",
  "/.well-known/agent.json",
  "/.well-known/agent-card.json",
]);

export function companyHost(
  harness: Harness,
  room: Room,
  pack: CompanyPack,
  fallbackUrl = "http://127.0.0.1:8787",
  sessions?: Sessions,
): (req: Request) => Promise<Response> {
  const api = intake(harness);
  const bag = sessions ?? new Sessions(harness, room);
  return async (req: Request) => {
    if (req.method === "OPTIONS") return corsPreflight();
    return withCors(await route(req, harness, bag, pack, fallbackUrl, api));
  };
}

async function route(
  req: Request,
  harness: Harness,
  sessions: Sessions,
  pack: CompanyPack,
  fallbackUrl: string,
  api: (req: Request) => Promise<Response>,
): Promise<Response> {
  const url = new URL(req.url);
  const kind = clientKind(req);
  const base = publicUrl(req, fallbackUrl);
  const lobby = sessions.lobby;

  if (url.pathname === "/who") return Response.json({ kind, runId: lobby.run.id, company: pack.profile.name });
  if (url.pathname === "/llms.txt" || url.pathname === "/connect.txt") {
    return new Response(companyConnectPrompt(base, pack), {
      headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
    });
  }
  if (CARD_PATHS.has(url.pathname)) {
    const res = Response.json(companyAgentCard(base, lobby, pack));
    res.headers.set("Cache-Control", "no-store");
    return res;
  }
  if (url.pathname === "/session" && (req.method === "POST" || req.method === "GET")) {
    const hit = sessions.open();
    return Response.json({ session: hit.id, runId: hit.room.run.id });
  }
  if (url.pathname === "/live") {
    const hit = sessions.open(url.searchParams.get("session"));
    return hit.room.stream();
  }
  if (url.pathname === "/chat" && req.method === "POST") {
    const body = (await req.json().catch(() => ({}))) as {
      text?: string;
      from?: "human" | "machine";
      session?: string;
    };
    const hit = sessions.open(body.session);
    const ex = await hit.room.say(body.from === "machine" ? "machine" : chatFrom(req), body.text ?? "");
    return Response.json({ ...ex, session: hit.id, runId: hit.room.run.id, company: pack.profile.name });
  }
  if (url.pathname === "/" && req.method === "GET") {
    if (wantsAgentCard(url) || kind === "machine") return Response.json(companyAgentCard(base, lobby, pack));
    return companyPage(lobby, base, pack);
  }
  if (url.pathname === "/" && req.method === "POST" && kind === "machine") {
    const raw = await req.text();
    try {
      const body = JSON.parse(raw) as { method?: string; text?: string; session?: string };
      if (body.method) {
        return api(
          new Request(new URL("/mcp", req.url), { method: "POST", headers: req.headers, body: raw }),
        );
      }
      if (body.text) {
        const hit = sessions.open(body.session);
        const ex = await hit.room.say("machine", body.text);
        return Response.json({ ...ex, session: hit.id, runId: hit.room.run.id });
      }
    } catch {
      /* fall through */
    }
  }
  return api(req);
}

function chatFrom(req: Request): "human" | "machine" {
  const ua = req.headers.get("user-agent") ?? "";
  if (/mozilla/i.test(ua) && !/bot|curl\/|claude|gptbot|httpie|python-requests/i.test(ua)) return "human";
  return clientKind(req);
}
