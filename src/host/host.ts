import type { Harness } from "../harness.ts";
import { intake } from "../intake.ts";
import { clientKind } from "./detect.ts";
import { chatPage, sayHow } from "./page.ts";
import { Room } from "./room.ts";

export function publicUrl(req: Request, fallback: string): string {
  const env = process.env.WEBAGENT_PUBLIC_URL;
  if (env) return env.replace(/\/+$/, "");
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  const proto = req.headers.get("x-forwarded-proto") || new URL(req.url).protocol.replace(":", "");
  if (host) return `${proto}://${host}`;
  return fallback;
}

/** Public host: humans get the page, machines get MCP / JSON. Same room. */
export function host(harness: Harness, room: Room, fallbackUrl = "http://127.0.0.1:8787"): (req: Request) => Promise<Response> {
  const api = intake(harness, room);
  return async (req: Request) => {
    const url = new URL(req.url);
    const kind = clientKind(req);
    const base = publicUrl(req, fallbackUrl);

    if (url.pathname === "/who") return Response.json({ kind, runId: room.run.id });
    if (url.pathname === "/agent.json") return Response.json(card(base, room));
    if (url.pathname === "/live") {
      const accept = req.headers.get("Accept") ?? "";
      if (!accept.includes("text/event-stream")) {
        return Response.json({
          runId: room.run.id,
          stream: base + "/live",
          hint: "This is a live stream. Do not wait for it to finish. POST /chat to talk.",
        });
      }
      return room.stream();
    }
    if (url.pathname === "/chat" && req.method === "POST") {
      const body = (await req.json().catch(() => ({}))) as { text?: string; from?: "human" | "machine" };
      return Response.json(await room.say(chatFrom(req, body), body.text ?? ""));
    }
    if (url.pathname === "/" && req.method === "GET") {
      if (kind === "human") return chatPage(room, base);
      return Response.json(card(base, room));
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
  };
}

function chatFrom(req: Request, body: { from?: "human" | "machine" }): "human" | "machine" {
  if (body.from === "human" || body.from === "machine") return body.from;
  const ua = req.headers.get("user-agent") ?? "";
  if (/mozilla/i.test(ua) && !/bot|curl\/|claude|gptbot|httpie|python-requests/i.test(ua)) return "human";
  return clientKind(req);
}

function card(base: string, room: Room) {
  return {
    type: "webagent",
    url: base,
    mcp: base + "/mcp",
    chat: base + "/chat",
    live: base + "/live",
    runId: room.run.id,
    protocol: "2025-06-18",
    how: sayHow(room.run.id),
  };
}
