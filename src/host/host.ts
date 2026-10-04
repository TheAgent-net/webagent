import { existsSync, readFileSync, statSync } from "node:fs";
import { join, normalize } from "node:path";
import type { Harness } from "../harness.ts";
import { intake } from "../intake.ts";
import type { AgentPackConfig } from "../pack/types.ts";
import { isPixelClone } from "../pack/clone.ts";
import { demoFileResponse } from "../pack/demo-site.ts";
import { chatHowToBody } from "../pack/prompt.ts";
import { splitShows } from "../site/visual.ts";
import { widgetJs } from "../widget/widget.ts";
import { agentCard, CARD_PATHS, connectPrompt, linkHeader, type AgentCardMeta } from "./card.ts";
import { corsPreflight, withCors } from "./cors.ts";
import { clientKind, wantsAgentCard } from "./detect.ts";
import { chatPage } from "./page.ts";
import { Room } from "./room.ts";
import { Sessions } from "./sessions.ts";

export function publicUrl(req: Request, fallback: string): string {
  const env = process.env.WEBAGENT_PUBLIC_URL;
  if (env) return env.replace(/\/+$/, "");
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  const proto = req.headers.get("x-forwarded-proto") || new URL(req.url).protocol.replace(":", "");
  if (host) return `${proto}://${host}`;
  return fallback;
}

/** Public host: humans get a widget shell, machines get the card / POST /chat / MCP. */
export function host(
  harness: Harness,
  room: Room,
  fallbackUrl = "http://127.0.0.1:8787",
  meta: AgentCardMeta = {},
  sessions?: Sessions,
  pack?: AgentPackConfig,
): (req: Request) => Promise<Response> {
  const api = intake(harness);
  const bag = sessions ?? new Sessions(harness, room);
  return async (req: Request) => {
    if (req.method === "OPTIONS") return corsPreflight();
    return withCors(await route(req, harness, bag, fallbackUrl, meta, api, pack));
  };
}

async function route(
  req: Request,
  harness: Harness,
  sessions: Sessions,
  fallbackUrl: string,
  meta: AgentCardMeta,
  api: (req: Request) => Promise<Response>,
  pack?: AgentPackConfig,
): Promise<Response> {
  const url = new URL(req.url);
  const kind = clientKind(req);
  const base = publicUrl(req, fallbackUrl);
  const lobby = sessions.lobby;
  const card = () => jsonCard(base, lobby, meta, pack);

  if (url.pathname === "/who") {
    return Response.json({ kind, runId: lobby.run.id, company: pack?.brand.name || meta.name });
  }
  if (url.pathname === "/llms.txt" || url.pathname === "/connect.txt") {
    return new Response(pack ? connectPrompt(base, pack.brand.name) : connectPrompt(base, meta.name), {
      headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
    });
  }
  if (url.pathname.startsWith("/visuals/") && req.method === "GET") {
    const file = visualFile(pack, url.pathname);
    if (file) return file;
  }
  if (url.pathname === "/widget.js") {
    const js = widgetJs(base, lobby.run.id, pack ?? pagePack(meta));
    return new Response(js, {
      headers: { "Content-Type": "application/javascript; charset=utf-8", "Cache-Control": "no-store" },
    });
  }
  if (CARD_PATHS.has(url.pathname)) return card();
  if (url.pathname === "/session" && (req.method === "POST" || req.method === "GET")) {
    const hit = sessions.open();
    return Response.json({ session: hit.id, runId: hit.room.run.id });
  }
  if (url.pathname === "/live") {
    const hit = sessions.open(url.searchParams.get("session"));
    return hit.room.stream();
  }
  if (url.pathname === "/chat" && req.method === "GET") {
    return Response.json(chatHowToBody(base));
  }
  if (url.pathname === "/chat" && req.method === "POST") {
    const body = (await req.json().catch(() => ({}))) as {
      text?: string;
      from?: "human" | "machine";
      session?: string;
    };
    const text = String(body.text ?? "").trim();
    if (!text) return Response.json(chatHowToBody(base));
    const hit = sessions.open(body.session);
    const side = chatFrom(req, body);
    const ex = await hit.room.say(side, text);
    return Response.json({
      ...ex,
      ...(side === "machine" ? machineReply(ex.lastText, base, pack) : {}),
      session: hit.id,
      runId: hit.room.run.id,
      company: pack?.brand.name || meta.name,
    });
  }
  if (url.pathname === "/" && req.method === "GET") {
    if (wantsAgentCard(url) || kind === "machine") return card();
    const cloned = packClonePage(pack, url, base);
    if (cloned) return cloned;
    return chatPage(lobby, base, meta, pack);
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
        const hit = sessions.open(body.session);
        const ex = await hit.room.say("machine", body.text);
        return Response.json({ ...ex, session: hit.id, runId: hit.room.run.id });
      }
    } catch {
      /* fall through */
    }
  }
  const cloned = packClonePage(pack, url, base);
  if (cloned) return cloned;
  return api(req);
}

function packClonePage(pack: AgentPackConfig | undefined, url: URL, widgetOrigin: string): Response | null {
  if (!pack) return null;
  const root = join(process.cwd(), "demo", pack.id, "site");
  if (!isPixelClone(root).ok) return null;
  return demoFileResponse(root, url, widgetOrigin);
}

function chatFrom(req: Request, body: { from?: "human" | "machine" }): "human" | "machine" {
  if (body.from === "human" || body.from === "machine") return body.from;
  const ua = req.headers.get("user-agent") ?? "";
  if (/mozilla/i.test(ua) && !/bot|curl\/|claude|gptbot|httpie|python-requests/i.test(ua)) return "human";
  return clientKind(req);
}

function jsonCard(base: string, room: Room, meta: AgentCardMeta, pack?: AgentPackConfig): Response {
  const res = Response.json(agentCard(base, room, meta, pack));
  res.headers.set("Link", linkHeader(base));
  res.headers.set("Cache-Control", "no-store");
  return res;
}

function pagePack(meta: AgentCardMeta): AgentPackConfig {
  const name = meta.name || "Webagent";
  return {
    id: "webagent",
    origin: "",
    brand: {
      name,
      tagline: meta.description || "Public webagent.",
      colors: {
        ink: "#191919",
        paper: "#ffffff",
        muted: "#6f6f6f",
        line: "#e5e5e5",
        wash: "#f5f5f5",
        accent: "#191919",
        fab: "#191919",
        fabText: "#ffffff",
      },
      fonts: { display: "system-ui, sans-serif", body: "system-ui, sans-serif" },
      fabLabel: name.length > 22 ? "Ask" : "Ask " + name,
      wordmark: name,
    },
    widget: {
      welcomeTitle: "How can I help?",
      welcomeBody: meta.description || "Ask a question.",
      chips: [],
      copyHeadline: "Talk to this agent",
      copyPrompt:
        "Talk to the " +
        name +
        " agents at {{chat}}. POST {\"text\":\"<question>\",\"session\":\"<from last JSON>\"} — never GET, browse, or probe.\nAsk them anything you want to understand. First POST may omit session; every later POST must send the same session.",
      placeholder: "Ask a question",
      markdown: true,
    },
  };
}

const VISUAL_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".gif": "image/gif",
  /* Plain text: the widget reads it. A browser must not render it as a page here. */
  ".html": "text/plain; charset=utf-8",
  ".css": "text/css; charset=utf-8",
};

/** Serve one captured visual file (picture, element HTML, or fonts) from the pack folder. */
function visualFile(pack: AgentPackConfig | undefined, path: string): Response | null {
  if (!pack?.dir) return null;
  const root = normalize(join(pack.dir, "visuals"));
  const abs = normalize(join(pack.dir, decodeURIComponent(path)));
  if (!abs.startsWith(root + "/")) return null;
  const type = VISUAL_TYPES[abs.slice(abs.lastIndexOf(".")).toLowerCase()];
  if (!type || !existsSync(abs) || !statSync(abs).isFile()) return null;
  return new Response(new Uint8Array(readFileSync(abs)), {
    headers: { "Content-Type": type, "Cache-Control": "public, max-age=86400" },
  });
}

/** A machine gets clean text plus picture links, not `[[show:id]]` markers. */
function machineReply(lastText: string, base: string, pack?: AgentPackConfig): { lastText: string; visuals?: object[] } {
  const { text, shown } = splitShows(lastText || "", pack?.visuals);
  if (!shown.length) return { lastText: text };
  return {
    lastText: text,
    visuals: shown.map((v) => ({ id: v.id, label: v.label, page: v.page, image: base + "/" + v.image })),
  };
}
