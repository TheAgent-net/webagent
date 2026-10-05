/**
 * Visitor: sort one request into human, crawler, assistant, browser (agent browser), or script.
 *
 * Order of checks:
 * 1. The hand table below. It gives the family and the kind for agents we know well.
 * 2. The ai.robots.txt list (`robots.json`). It maps an agent name to a kind.
 * 3. `isbot`. It catches every other bot, tool, and headless browser.
 * 4. MCP and A2A headers. Then the browser check in `detect.ts`.
 *
 * This file reads headers only. `verify.ts` sets `verified` from IP ranges and signatures.
 * Keep `classifyVisitor` synchronous and fast. It runs on every request.
 */
import { isbot } from "isbot";
import type { VisitorKind } from "../store/store.ts";
import { clientKind } from "./detect.ts";
/*
 * Snapshot of https://raw.githubusercontent.com/ai-robots-txt/ai.robots.txt/main/robots.json
 * Taken 2026-10-05. License: MIT (ai.robots.txt contributors).
 * Refresh: download the file again to this path.
 */
import robots from "./robots.json" with { type: "json" };

export interface Visitor {
  kind: VisitorKind;
  /** Agent family, for example `chatgpt`. Empty for humans and unknown scripts. */
  family?: string;
  /** True only when a signature or a published IP range proves the claim. */
  verified: boolean;
  ua: string;
}

/** Agent sort for one user agent. */
export interface Agent {
  kind: VisitorKind;
  family?: string;
}

/** Hand table: user agent → kind and family. Order matters: the first match wins. */
const AGENTS: { pattern: RegExp; kind: VisitorKind; family: string }[] = [
  { pattern: /ChatGPT-User/i, kind: "assistant", family: "chatgpt" },
  { pattern: /ChatGPT Agent|ChatGPT-Agent/i, kind: "browser", family: "chatgpt" },
  { pattern: /Claude-User|Claude-Web/i, kind: "assistant", family: "claude" },
  { pattern: /Claude-Code/i, kind: "assistant", family: "claude" },
  { pattern: /Perplexity-User/i, kind: "assistant", family: "perplexity" },
  { pattern: /Comet\//, kind: "browser", family: "perplexity" },
  { pattern: /MistralAI-User/i, kind: "assistant", family: "mistral" },
  { pattern: /DuckAssistBot/i, kind: "assistant", family: "duckduckgo" },
  { pattern: /Google-Agent|GoogleAgent-Mariner/i, kind: "browser", family: "google" },
  { pattern: /GoogleAgent-URLContext|Gemini-Deep-Research|Google-NotebookLM/i, kind: "assistant", family: "google" },
  { pattern: /GPTBot|OAI-SearchBot|OAI-AdsBot/i, kind: "crawler", family: "openai" },
  { pattern: /ClaudeBot|Claude-SearchBot|anthropic-ai/i, kind: "crawler", family: "anthropic" },
  { pattern: /PerplexityBot/i, kind: "crawler", family: "perplexity" },
  { pattern: /Google-Extended|Googlebot|GoogleOther|Google-CloudVertexBot/i, kind: "crawler", family: "google" },
  { pattern: /bingbot/i, kind: "crawler", family: "bing" },
  { pattern: /CCBot/i, kind: "crawler", family: "commoncrawl" },
  { pattern: /Bytespider|TikTokSpider|DoubaoBot/i, kind: "crawler", family: "bytedance" },
  { pattern: /Applebot/i, kind: "crawler", family: "apple" },
  { pattern: /meta-externalfetcher/i, kind: "assistant", family: "meta" },
  { pattern: /meta-externalagent|facebookexternalhit|FacebookBot|meta-webindexer/i, kind: "crawler", family: "meta" },
  { pattern: /Amzn-User/i, kind: "assistant", family: "amazon" },
  { pattern: /Amazonbot|Amzn-SearchBot/i, kind: "crawler", family: "amazon" },
  { pattern: /Browserbase/i, kind: "browser", family: "browserbase" },
];

/** Automation browsers. They run JavaScript, so treat them as agent browsers. */
const AUTOMATION = /HeadlessChrome|Playwright|Puppeteer|PhantomJS|Selenium|Lightpanda/i;

/** Bot words that mean bulk collection, not a single fetch. */
const CRAWL_WORDS = /crawl|spider|slurp|bot\b|bot\/|archiver|indexer/i;

/** Agent names that are also common words. Match them only as a product token (`Name/1.0`). */
const WEAK = new Set(["Code", "Cursor", "Spider", "Trae", "LCC", "YaK", "OpenAI", "Operator", "Devin", "UseAI", "opencode"]);

interface RobotsEntry {
  function?: string;
  operator?: string;
}

/** Kind for one ai.robots.txt entry, from its `function` text. */
function getRobotsKind(entry: RobotsEntry): VisitorKind {
  const job = entry.function ?? "";
  if (/^AI Agents$/i.test(job)) return "browser";
  if (/assistant|user-initiated|user prompts|coding agents|learning companion|live chat/i.test(job)) return "assistant";
  return "crawler";
}

/** Short family name: the agent name in lowercase, without the version and the `-user` / `bot` tail. */
function getRobotsFamily(name: string): string {
  return name
    .toLowerCase()
    .replace(/\/.*$/, "")
    .replace(/[-_ ]?(user|bot|searchbot|agent|crawler|spider|fetcher)$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const ROBOTS: { token: string; kind: VisitorKind; family: string }[] = Object.entries(robots as Record<string, RobotsEntry>)
  .map(([token, entry]) => ({ token, kind: getRobotsKind(entry), family: getRobotsFamily(token) }))
  .sort((a, b) => b.token.length - a.token.length);

const ROBOTS_BY_TOKEN = new Map(ROBOTS.map((r) => [r.token.toLowerCase(), r]));

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** One pass over all strong names. The longest name wins at the same place. */
const ROBOTS_STRONG = new RegExp(
  "(?<![A-Za-z0-9])(" +
    ROBOTS.filter((r) => !WEAK.has(r.token)).map((r) => escape(r.token)).join("|") +
    ")(?![A-Za-z0-9])",
  "i",
);
const ROBOTS_WEAK = new RegExp(
  "(?<![A-Za-z0-9])(" + ROBOTS.filter((r) => WEAK.has(r.token)).map((r) => escape(r.token)).join("|") + ")/",
);

/** Small memo. The same user agent comes back often. */
const MEMO = new Map<string, Agent | null>();
const MEMO_CAP = 2000;

/** Sort one user agent. Return null for a plain browser (no agent sign). */
export function classifyAgent(ua: string): Agent | null {
  const known = MEMO.get(ua);
  if (known !== undefined) return known;
  const found = findAgent(ua);
  if (MEMO.size >= MEMO_CAP) MEMO.delete(MEMO.keys().next().value!);
  MEMO.set(ua, found);
  return found;
}

function findAgent(ua: string): Agent | null {
  if (!ua) return null;
  for (const a of AGENTS) {
    if (a.pattern.test(ua)) return { kind: a.kind, family: a.family };
  }
  const hit = ROBOTS_STRONG.exec(ua) ?? ROBOTS_WEAK.exec(ua);
  if (hit) {
    const r = ROBOTS_BY_TOKEN.get(hit[1]!.toLowerCase());
    if (r) return { kind: r.kind, family: r.family };
  }
  if (AUTOMATION.test(ua)) return { kind: "browser" };
  if (isbot(ua)) return { kind: CRAWL_WORDS.test(ua) ? "crawler" : "script" };
  return null;
}

export function classifyVisitor(req: Request): Visitor {
  const ua = req.headers.get("user-agent") ?? "";
  const agent = classifyAgent(ua);
  if (agent) return { kind: agent.kind, family: agent.family, verified: false, ua };
  if (req.headers.get("mcp-protocol-version") || req.headers.get("mcp-session-id") || req.headers.get("a2a-version")) {
    return { kind: "assistant", family: "mcp", verified: false, ua };
  }
  if (clientKind(req) === "human") return { kind: "human", verified: false, ua };
  return { kind: "script", verified: false, ua };
}

/** Client IP from proxy headers. Use it only for checks. Never store it. */
export function getClientIp(req: Request): string | undefined {
  const ip =
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return ip || undefined;
}

/** Salted hash of the client IP. Never store the raw IP. */
export function hashIp(req: Request): string | undefined {
  const ip = getClientIp(req);
  if (!ip) return undefined;
  const salt = process.env.WEBAGENT_IP_SALT || "webagent";
  return new Bun.CryptoHasher("sha256").update(salt + ip).digest("hex").slice(0, 16);
}
