import { existsSync, readFileSync, statSync } from "node:fs";
import { join, normalize } from "node:path";
import type { Message } from "../context.ts";
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
import { conversationId, type Channel, type Store, type Tenant } from "../store/store.ts";
import { Room } from "./room.ts";
import { Sessions } from "./sessions.ts";
import { classifyVisitor, hashIp, type Visitor } from "./visitor.ts";
import { asksHuman, cutNote, getTarget, isEmail, offersTeam, sendHandoff, getTranscriptUrl } from "./handoff.ts";
import { getHold, getLimits, HOLD_TEXT, Limiter, refuseRate, type Limits, type Rule } from "./limit.ts";
import { refuseOrigin, isAllowed } from "./origin.ts";
import { serveBotd, checkSession, cleanUrl, collect } from "./collect.ts";
import { askMcp } from "./ask.ts";
import { checkIp, hasSignature, proveVisitor } from "./verify.ts";

/** Multi-tenant parts. All optional: a single-pack host works without them. */
export interface HostExtra {
  store?: Store;
  /** Tenant id for stored rows. Default `default`. */
  tenant?: string;
  /** Public base URL for this request (for example `https://agent.example.com/t/acme`). */
  base?: (req: Request) => string;

  /* Guard options. */
  /** Page origins that may call from a browser when the store has no tenant row. Empty means any. */
  origins?: string[];
  /** Hide the generic intake routes (`/runs`, `/models`, `/health`, `/sites`). The cloud sets it. Keep `/mcp`. */
  locked?: boolean;
  /** Rate limiter. Default: one limiter for this host. */
  limiter?: Limiter;
  /** Fetch for outbound handoff calls. Tests pass a fake. */
  outbound?: typeof fetch;
}

interface Scope {
  store?: Store;
  tenant: string;
  visitor: Visitor;
  /* Guard fields. */
  /** Stored tenant row, read once per request so settings changes apply at once. */
  row?: Tenant;
  limits: Limits;
  limiter: Limiter;
  /** Allowed page origins. Empty means any. */
  origins: string[];
  locked: boolean;
  outbound?: typeof fetch;
  /** Analytics: signature proof that runs in the background. It never rejects. */
  proof?: Promise<Visitor>;
}

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
  extra: HostExtra = {},
): (req: Request) => Promise<Response> {
  const api = intake(harness);
  const bag = sessions ?? new Sessions(harness, room);
  const tenant = extra.tenant || "default";
  const limiter = extra.limiter ?? new Limiter();
  return async (req: Request) => {
    if (req.method === "OPTIONS") return corsPreflight();
    const row = readTenant(extra.store, tenant);
    const scope: Scope = {
      store: extra.store,
      tenant,
      visitor: classifyVisitor(req),
      row,
      limits: getLimits(row),
      limiter,
      origins: row?.origins ?? extra.origins ?? [],
      locked: !!extra.locked,
      outbound: extra.outbound,
    };
    /* Analytics: check IP ranges now (sync). Check signatures in the background. */
    scope.visitor = checkIp(req, scope.visitor);
    if (scope.store && hasSignature(req)) scope.proof = proveVisitor(req, scope.visitor);
    track(req, scope);
    const base = extra.base ? extra.base(req) : publicUrl(req, fallbackUrl);
    const refused = checkRequest(req, scope, base);
    if (refused) return withCors(refused);
    return withCors(await route(req, harness, bag, fallbackUrl, meta, api, pack, scope, extra.base));
  };
}

/* ---- Guard: origin allowlist, rate limits, pause, and cap. ---- */

function readTenant(store: Store | undefined, id: string): Tenant | undefined {
  if (!store) return undefined;
  try {
    return store.getTenant(id);
  } catch {
    return undefined;
  }
}

/** Paths that a browser page calls with a body. They obey the origin allowlist. */
const BROWSER_PATHS = new Set(["/chat", "/feedback", "/handoff", "/collect"]);

/** Path to the rate rule keyed by hashed IP. */
const IP_RULES: Record<string, Rule> = {
  "/chat": "chatIp",
  "/": "chatIp",
  "/mcp": "mcp",
  "/collect": "collect",
  "/feedback": "feedback",
  "/handoff": "handoff",
};

/** Refuse a request before it reaches a route. Return undefined to let it through. */
function checkRequest(req: Request, scope: Scope, base: string): Response | undefined {
  if (req.method !== "POST") return undefined;
  const path = new URL(req.url).pathname;
  if (BROWSER_PATHS.has(path) && !isAllowed(req.headers.get("origin"), scope.origins, base)) return refuseOrigin();
  const rule = IP_RULES[path];
  const ip = rule ? hashIp(req) : undefined;
  if (rule && ip) {
    const take = scope.limiter.take(scope.tenant + "|" + rule + "|" + ip, scope.limits[rule]);
    if (!take.ok) return refuseRate(take.wait);
  }
  if (path === "/mcp") {
    const hold = getHold(scope.row, scope.store);
    if (hold) return Response.json({ error: "unavailable", reason: hold, lastText: HOLD_TEXT[hold] }, { status: 503 });
  }
  return undefined;
}

/** Rate limit one chat session. Return the 429 reply, or undefined. */
function limitSession(scope: Scope, session: string | undefined): Response | undefined {
  if (!session || !/^[\w-]{1,80}$/.test(session)) return undefined;
  const take = scope.limiter.take(scope.tenant + "|chatSession|" + session, scope.limits.chatSession);
  return take.ok ? undefined : refuseRate(take.wait);
}

/** The fixed reply when the tenant is paused or over its monthly cap. No model call. */
function getHoldReply(scope: Scope, side: "human" | "machine", session: string | undefined): Response | undefined {
  const hold = getHold(scope.row, scope.store);
  if (!hold) return undefined;
  const lastText = HOLD_TEXT[hold];
  if (side === "human") return Response.json({ lastText, hold, session });
  return Response.json({ error: "unavailable", reason: hold, lastText }, { status: 503 });
}

/** `POST /feedback {session, turn?, vote, note?}`: one vote on one reply. */
async function addFeedback(req: Request, scope: Scope): Promise<Response> {
  const body = (await req.json().catch(() => ({}))) as { session?: unknown; turn?: unknown; vote?: unknown; note?: unknown };
  const vote = body.vote === 1 || body.vote === "up" ? 1 : body.vote === -1 || body.vote === "down" ? -1 : 0;
  if (!vote) return Response.json({ error: "bad_vote", reason: "Send vote 1 or -1." }, { status: 400 });
  const found = findConversation(scope, body.session);
  if (found instanceof Response) return found;
  let turn: number | undefined;
  if (body.turn !== undefined && body.turn !== null) {
    turn = Number(body.turn);
    if (!Number.isInteger(turn) || !scope.store!.listTurns(found).some((t) => t.id === turn)) {
      return Response.json({ error: "bad_turn", reason: "Unknown turn for this session." }, { status: 400 });
    }
  }
  scope.store!.addFeedback({ tenant: scope.tenant, conversation: found, turn, vote, note: cutNote(body.note), at: Date.now() });
  return Response.json({ ok: true });
}

/** `POST /handoff {session, email, note?}`: store the request and tell the team. Do not wait for the team. */
async function addHandoff(req: Request, scope: Scope): Promise<Response> {
  const body = (await req.json().catch(() => ({}))) as { session?: unknown; email?: unknown; note?: unknown };
  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!isEmail(email)) return Response.json({ error: "bad_email", reason: "Send a valid email." }, { status: 400 });
  const found = findConversation(scope, body.session);
  if (found instanceof Response) return found;
  const note = cutNote(body.note);
  const at = Date.now();
  scope.store!.addHandoff({ tenant: scope.tenant, conversation: found, email, note, at });
  const notice = {
    tenant: scope.tenant,
    brand: scope.row?.name || scope.tenant,
    conversation: found,
    email,
    note,
    transcript: getTranscriptUrl(scope.tenant, found, scope.row?.org),
    at,
  };
  void sendHandoff(getTarget(scope.row?.settings), notice, scope.outbound ?? fetch);
  return Response.json({ ok: true });
}

/** Conversation id for a session, or an error reply. */
function findConversation(scope: Scope, session: unknown): string | Response {
  if (!scope.store) return Response.json({ error: "no_store", reason: "This host keeps no chats." }, { status: 501 });
  if (typeof session !== "string" || !/^[\w-]{1,80}$/.test(session)) {
    return Response.json({ error: "bad_session", reason: "Send the session from the chat reply." }, { status: 400 });
  }
  const id = conversationId(scope.tenant, session);
  if (!scope.store.getConversation(id)) {
    return Response.json({ error: "unknown_session", reason: "No chat has this session." }, { status: 404 });
  }
  return id;
}

/* ---- End guard. ---- */

/** Log one request as a traffic event. Skip the live stream and preflight noise. */
function track(req: Request, scope: Scope): void {
  if (!scope.store) return;
  const url = new URL(req.url);
  if (url.pathname === "/live" || url.pathname === "/favicon.ico") return;
  if (url.pathname === "/collect" || url.pathname === "/botd.js") return;
  const store = scope.store;
  const at = Date.now();
  const write = (visitor: Visitor) => {
    try {
      store.addEvent({
        tenant: scope.tenant,
        at,
        type: "request",
        kind: visitor.kind,
        family: visitor.family,
        verified: visitor.verified,
        path: url.pathname,
        session: url.searchParams.get("session") || undefined,
        ipHash: hashIp(req),
        ua: visitor.ua,
      });
    } catch (err) {
      console.error("track failed:", err instanceof Error ? err.message : err);
    }
  };
  /* Analytics: a signed request waits for its proof. The reply does not wait. */
  if (scope.proof) void scope.proof.then(write);
  else write(scope.visitor);
}

/** Say one message in a session and store the turn. */
async function talk(
  sessions: Sessions,
  session: string | undefined,
  side: "human" | "machine",
  text: string,
  scope: Scope,
  channel: Channel,
  page?: string,
) {
  const hit = sessions.open(session);
  const t0 = Date.now();
  const ex = await hit.room.say(side, text);
  const handoff = offersTeam(ex.lastText || "") || asksHuman(text);
  let turnId: number | undefined;
  if (scope.store) {
    try {
      const id = conversationId(scope.tenant, hit.id);
      const human = side === "human";
      scope.store.openConversation({
        id,
        tenant: scope.tenant,
        session: hit.id,
        channel,
        kind: human ? "human" : scope.visitor.kind === "human" ? "script" : scope.visitor.kind,
        family: human ? undefined : scope.visitor.family,
        verified: !human && scope.visitor.verified,
        page: cleanUrl(page),
        at: t0,
      });
      /* Analytics: apply the beacon verdict and the signature proof. */
      const store = scope.store;
      if (channel === "widget") checkSession(store, scope.tenant, hit.id);
      void scope.proof?.then((v) => {
        if (!v.verified) return;
        try {
          store.updateConversation(id, { verified: true, family: v.family, ...(v.kind !== "human" ? { kind: v.kind } : {}) });
        } catch {
          /* the store can be closed */
        }
      });
      turnId = scope.store.addTurn({
        conversation: id,
        at: t0,
        from: side,
        said: text,
        reply: ex.lastText || "",
        visual: /\[\[show:([\w-]+)\]\]/.exec(ex.lastText || "")?.[1],
        ms: Date.now() - t0,
      });
      if (handoff) scope.store.updateConversation(id, { handoff: true });
    } catch (err) {
      console.error("store turn failed:", err instanceof Error ? err.message : err);
    }
  }
  /* The widget shows the handoff form only when a store can keep the request. */
  return { hit, ex, turnId, handoff: handoff && !!scope.store };
}

/** Rebuild a stored conversation as context messages, so a chat survives a restart. */
export function restoreFrom(store: Store, tenant: string): (session: string) => Message[] {
  return (session) => {
    try {
      return store.listTurns(conversationId(tenant, session)).flatMap((t): Message[] => [
        { role: "user", content: `[${t.from}] ${t.said}` },
        { role: "assistant", content: t.reply },
      ]);
    } catch {
      return [];
    }
  };
}

async function route(
  req: Request,
  harness: Harness,
  sessions: Sessions,
  fallbackUrl: string,
  meta: AgentCardMeta,
  api: (req: Request) => Promise<Response>,
  pack: AgentPackConfig | undefined,
  scope: Scope,
  baseFor?: (req: Request) => string,
): Promise<Response> {
  const url = new URL(req.url);
  const kind = clientKind(req);
  const base = baseFor ? baseFor(req) : publicUrl(req, fallbackUrl);
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
    const js = widgetJs(base, lobby.run.id, pack ?? pagePack(meta), scope.origins);
    return new Response(js, {
      headers: { "Content-Type": "application/javascript; charset=utf-8", "Cache-Control": "no-store" },
    });
  }
  if (CARD_PATHS.has(url.pathname)) return card();
  /* Analytics: widget beacon and the BotD script. */
  if (url.pathname === "/collect" && req.method === "POST") return collect(req, scope);
  if (url.pathname === "/botd.js" && req.method === "GET") return serveBotd();
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
      channel?: string;
      page?: string;
    };
    const text = String(body.text ?? "").trim();
    if (!text) return Response.json(chatHowToBody(base));
    const side = chatFrom(req, body);
    const refused = getHoldReply(scope, side, body.session) ?? limitSession(scope, body.session);
    if (refused) return refused;
    const channel: Channel = body.channel === "widget" ? "widget" : "chat";
    const { hit, ex, turnId, handoff } = await talk(sessions, body.session, side, text, scope, channel, body.page);
    return Response.json({
      ...ex,
      ...(side === "machine" ? machineReply(ex.lastText, base, pack) : {}),
      session: hit.id,
      runId: hit.room.run.id,
      company: pack?.brand.name || meta.name,
      turnId,
      handoff,
    });
  }
  if (url.pathname === "/feedback" && req.method === "POST") return addFeedback(req, scope);
  if (url.pathname === "/handoff" && req.method === "POST") return addHandoff(req, scope);
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
        const inner = new Request(new URL("/mcp", req.url), {
          method: "POST",
          headers: req.headers,
          body: raw,
        });
        return scope.locked ? publicMcp(scope, sessions, base, pack, meta)(inner) : api(inner);
      }
      if (body.text) {
        const refused = getHoldReply(scope, "machine", body.session) ?? limitSession(scope, body.session);
        if (refused) return refused;
        const { hit, ex, turnId, handoff } = await talk(sessions, body.session, "machine", body.text, scope, "chat");
        return Response.json({ ...ex, session: hit.id, runId: hit.room.run.id, turnId, handoff });
      }
    } catch {
      /* fall through */
    }
  }
  const cloned = packClonePage(pack, url, base);
  if (cloned) return cloned;
  /* Tenant mode: `/mcp` offers one `ask` tool, never raw harness control. */
  if (scope.locked && url.pathname === "/mcp") return publicMcp(scope, sessions, base, pack, meta)(req);
  /* Tenant mode: hide `/runs`, `/models`, `/health`, and `/sites`. */
  if (scope.locked && url.pathname !== "/mcp") return new Response("not found", { status: 404 });
  return api(req);
}

/** Tenant-mode MCP. Each `ask` call is one stored chat turn on channel `mcp`. */
function publicMcp(scope: Scope, sessions: Sessions, base: string, pack: AgentPackConfig | undefined, meta: AgentCardMeta) {
  return askMcp(pack?.brand.name || meta.name || "", async (text, session) => {
    const refused = getHoldReply(scope, "machine", session) ?? limitSession(scope, session);
    if (refused) return refused;
    const { hit, ex } = await talk(sessions, session, "machine", text, scope, "mcp");
    return { ...machineReply(ex.lastText, base, pack), session: hit.id };
  });
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
