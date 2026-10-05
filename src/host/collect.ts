/**
 * Collect: the widget beacon. One beacon per page view.
 *
 * - `POST /collect` reads the behavior signals, scores them, and stores one `beacon` event.
 * - A high score marks the widget conversation of that session as an agent browser.
 * - `GET /botd.js` serves the BotD library (MIT) as one ES module. Bun builds it once from node_modules.
 *
 * The beacon holds no keystroke contents and no query strings. The raw IP is never stored.
 */
import { conversationId, type Store } from "../store/store.ts";
import { classifyAgent, hashIp } from "./visitor.ts";

/** Largest beacon body, in bytes. */
export const BEACON_MAX = 8 * 1024;
/** Score at or above this value means an agent browser. */
export const BROWSER_THRESHOLD = 0.5;

const SESSION_OK = /^[a-zA-Z0-9_-]{8,80}$/;

/** Clean beacon signals. Every number is capped. */
export interface Signals {
  session?: string;
  page?: string;
  ref?: string;
  /** Time on page before the beacon, in milliseconds. */
  ms: number;
  botd?: { bot: boolean; kind?: string; error?: boolean };
  webdriver: boolean;
  touch: boolean;
  /** Mouse moves. */
  moves: number;
  clicks: number;
  /** Clicks with no mouse move since the last click. */
  bare: number;
  /** Clicks that the page made, not the user (`isTrusted` false). */
  untrusted: number;
  /** Gaps between key presses in the widget field, in milliseconds. No key values. */
  keys: number[];
  /** Scroll steps, in pixels. */
  scrolls: number[];
  focus: number;
  blur: number;
  hidden: number;
  /** innerWidth, innerHeight, screen width, screen height, outerWidth, outerHeight. */
  view: number[];
}

const num = (v: unknown, max: number): number => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.max(-max, Math.min(max, Math.round(n))) : 0;
};
const count = (v: unknown, max = 100_000): number => Math.max(0, num(v, max));
const list = (v: unknown, cap: number, max: number): number[] => (Array.isArray(v) ? v.slice(0, cap).map((x) => num(x, max)) : []);

/** Keep the origin and the path. Drop the query and the hash: they can hold personal data. */
export function cleanUrl(v: unknown): string | undefined {
  if (typeof v !== "string" || !v) return undefined;
  try {
    const u = new URL(v);
    if (u.protocol !== "http:" && u.protocol !== "https:") return undefined;
    return (u.origin + u.pathname).slice(0, 300);
  } catch {
    return undefined;
  }
}

/** Validate and cap one raw beacon. */
export function readSignals(raw: unknown): Signals {
  const b = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const botd = b.botd && typeof b.botd === "object" ? (b.botd as Record<string, unknown>) : undefined;
  const session = typeof b.session === "string" && SESSION_OK.test(b.session) ? b.session : undefined;
  return {
    session,
    page: cleanUrl(b.page),
    ref: cleanUrl(b.ref),
    ms: count(b.ms, 3_600_000),
    botd: botd
      ? { bot: botd.bot === true, kind: typeof botd.kind === "string" ? botd.kind.slice(0, 40) : undefined, error: !!botd.error || undefined }
      : undefined,
    webdriver: b.webdriver === true,
    touch: b.touch === true,
    moves: count(b.moves),
    clicks: count(b.clicks),
    bare: count(b.bare),
    untrusted: count(b.untrusted),
    keys: list(b.keys, 200, 60_000).filter((k) => k >= 0),
    scrolls: list(b.scrolls, 100, 100_000),
    focus: count(b.focus, 10_000),
    blur: count(b.blur, 10_000),
    hidden: count(b.hidden, 10_000),
    view: list(b.view, 6, 100_000).filter((k) => k >= 0),
  };
}

const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / (xs.length || 1);
/** Coefficient of variation: spread over mean. Small means machine-even. */
export function getSpread(xs: number[]): number {
  const m = mean(xs);
  if (!xs.length || m <= 0) return 0;
  return Math.sqrt(mean(xs.map((x) => (x - m) ** 2))) / m;
}

/** Window sizes that headless and agent browsers use often. */
const AGENT_VIEWS = new Set(["800x600", "1024x768", "1280x720", "1280x800", "1280x1024", "1440x900", "1920x1080"]);

export interface BeaconScore {
  score: number;
  /** Signals that added to the score. */
  hits: string[];
}

/**
 * Agent-browser score, 0..1. Each signal adds a part. No single signal passes the threshold.
 * Human signs (curved mouse paths, uneven typing) take a part away.
 */
export function scoreBeacon(s: Signals): BeaconScore {
  let score = 0;
  const hits: string[] = [];
  const add = (name: string, part: number) => {
    score += part;
    hits.push(name);
  };
  if (s.webdriver) add("webdriver", 0.35);
  if (s.botd?.bot) add("botd", 0.35);
  if (s.clicks > 0 && s.bare / s.clicks >= 0.5 && !s.touch) add("bareClicks", 0.25);
  if (s.untrusted > 0) add("untrusted", 0.1);
  if (s.keys.length >= 5) {
    const avg = mean(s.keys);
    if (avg < 15) add("instantKeys", 0.25);
    else if (getSpread(s.keys) < 0.15) add("evenKeys", 0.2);
    else if (getSpread(s.keys) > 0.4) add("humanKeys", -0.15);
  }
  if (s.scrolls.length >= 3) {
    const steps = s.scrolls.filter((x) => x !== 0);
    const top = new Map<number, number>();
    for (const x of steps) top.set(x, (top.get(x) ?? 0) + 1);
    const mode = Math.max(0, ...top.values());
    const tall = s.view[1] ?? 0;
    if (steps.length >= 3 && mode / steps.length >= 0.8 && tall && Math.abs(mean(steps)) >= tall * 0.5) add("pageScroll", 0.15);
  }
  const [w, h, sw, sh] = s.view;
  if (w && h && AGENT_VIEWS.has(w + "x" + h) && sw === w && sh === h) add("bareWindow", 0.15);
  if (s.moves === 0 && s.clicks === 0 && s.keys.length === 0 && s.ms >= 10_000 && !s.touch) add("still", 0.1);
  if (s.moves >= 20 && s.clicks > 0 && s.bare === 0) add("humanMouse", -0.2);
  return { score: Math.max(0, Math.min(1, Math.round(score * 100) / 100)), hits };
}

/** Sessions that a beacon marked as an agent browser. Keyed `<tenant>:<session>`. Capped. */
const BROWSER_SESSIONS = new Set<string>();
const SESSION_CAP = 5000;

/** Mark the widget conversation of a session as an agent browser. Remember the session for a chat that starts later. */
export function markBrowser(store: Store, tenant: string, session: string): void {
  const id = conversationId(tenant, session);
  if (!BROWSER_SESSIONS.has(id)) {
    if (BROWSER_SESSIONS.size >= SESSION_CAP) BROWSER_SESSIONS.delete(BROWSER_SESSIONS.values().next().value!);
    BROWSER_SESSIONS.add(id);
  }
  const c = store.getConversation(id);
  if (c && c.channel === "widget" && c.kind === "human") store.updateConversation(id, { kind: "browser" });
}

/** Apply an earlier beacon verdict to a conversation that just opened. */
export function checkSession(store: Store, tenant: string, session: string): void {
  if (BROWSER_SESSIONS.has(conversationId(tenant, session))) markBrowser(store, tenant, session);
}

/** `POST /collect`. Always answer fast. Return 204 for a stored beacon. */
export async function collect(req: Request, where: { store?: Store; tenant: string }): Promise<Response> {
  const size = Number(req.headers.get("content-length") || 0);
  if (size > BEACON_MAX) return new Response(null, { status: 413 });
  let raw: unknown;
  try {
    const text = await req.text();
    if (text.length > BEACON_MAX) return new Response(null, { status: 413 });
    raw = JSON.parse(text);
  } catch {
    return new Response(null, { status: 400 });
  }
  if (!where.store) return new Response(null, { status: 204 });
  try {
    const s = readSignals(raw);
    const { score, hits } = scoreBeacon(s);
    const browser = score >= BROWSER_THRESHOLD;
    const ua = req.headers.get("user-agent") ?? "";
    const agent = classifyAgent(ua);
    const { session, page, ref, ...rest } = s;
    where.store.addEvent({
      tenant: where.tenant,
      at: Date.now(),
      type: "beacon",
      kind: browser ? "browser" : "human",
      family: agent?.family,
      verified: false,
      path: page ? new URL(page).pathname : undefined,
      session,
      ipHash: hashIp(req),
      ua,
      data: { ...rest, page, ref, score, hits },
    });
    if (browser && session) markBrowser(where.store, where.tenant, session);
  } catch (err) {
    console.error("collect failed:", err instanceof Error ? err.message : err);
  }
  return new Response(null, { status: 204 });
}

let botd: Promise<string | undefined> | undefined;

/** Build BotD once and keep it in memory. Undefined when the build fails. */
export function buildBotd(): Promise<string | undefined> {
  botd ??= (async () => {
    try {
      const entry = Bun.resolveSync("@fingerprintjs/botd/dist/botd.esm.js", import.meta.dir);
      const out = await Bun.build({ entrypoints: [entry], format: "esm", minify: true, target: "browser" });
      if (!out.success || !out.outputs[0]) return undefined;
      return await out.outputs[0].text();
    } catch (err) {
      console.error("botd build failed:", err instanceof Error ? err.message : err);
      return undefined;
    }
  })();
  return botd;
}

/** `GET /botd.js`. */
export async function serveBotd(): Promise<Response> {
  const js = await buildBotd();
  if (!js) return new Response("/* botd unavailable */", { status: 503, headers: { "Content-Type": "application/javascript" } });
  return new Response(js, {
    headers: { "Content-Type": "application/javascript; charset=utf-8", "Cache-Control": "public, max-age=86400" },
  });
}
