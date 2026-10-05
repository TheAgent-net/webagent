/**
 * Visitor: sort one request into human, crawler, assistant, browser (agent browser), or script.
 * This first version reads the user agent only. Signature and IP checks add `verified`.
 */
import type { VisitorKind } from "../store/store.ts";
import { clientKind } from "./detect.ts";

export interface Visitor {
  kind: VisitorKind;
  /** Agent family, for example `chatgpt`. Empty for humans and unknown scripts. */
  family?: string;
  /** True only when a signature or a published IP range proves the claim. */
  verified: boolean;
  ua: string;
}

/** User agent → kind and family. Order matters: the first match wins. */
const AGENTS: { pattern: RegExp; kind: VisitorKind; family: string }[] = [
  { pattern: /ChatGPT-User/i, kind: "assistant", family: "chatgpt" },
  { pattern: /Claude-User/i, kind: "assistant", family: "claude" },
  { pattern: /Perplexity-User/i, kind: "assistant", family: "perplexity" },
  { pattern: /MistralAI-User/i, kind: "assistant", family: "mistral" },
  { pattern: /DuckAssistBot/i, kind: "assistant", family: "duckduckgo" },
  { pattern: /GPTBot|OAI-SearchBot/i, kind: "crawler", family: "openai" },
  { pattern: /ClaudeBot|Claude-SearchBot|anthropic-ai/i, kind: "crawler", family: "anthropic" },
  { pattern: /PerplexityBot/i, kind: "crawler", family: "perplexity" },
  { pattern: /Google-Extended|Googlebot|GoogleOther/i, kind: "crawler", family: "google" },
  { pattern: /bingbot/i, kind: "crawler", family: "bing" },
  { pattern: /CCBot/i, kind: "crawler", family: "commoncrawl" },
  { pattern: /Bytespider/i, kind: "crawler", family: "bytedance" },
  { pattern: /Applebot/i, kind: "crawler", family: "apple" },
  { pattern: /meta-externalagent|facebookexternalhit/i, kind: "crawler", family: "meta" },
  { pattern: /Amazonbot/i, kind: "crawler", family: "amazon" },
];

export function classifyVisitor(req: Request): Visitor {
  const ua = req.headers.get("user-agent") ?? "";
  for (const a of AGENTS) {
    if (a.pattern.test(ua)) return { kind: a.kind, family: a.family, verified: false, ua };
  }
  if (req.headers.get("mcp-protocol-version") || req.headers.get("mcp-session-id") || req.headers.get("a2a-version")) {
    return { kind: "assistant", family: "mcp", verified: false, ua };
  }
  if (clientKind(req) === "human") return { kind: "human", verified: false, ua };
  return { kind: "script", verified: false, ua };
}

/** Salted hash of the client IP. Never store the raw IP. */
export function hashIp(req: Request): string | undefined {
  const ip =
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (!ip) return undefined;
  const salt = process.env.WEBAGENT_IP_SALT || "webagent";
  return new Bun.CryptoHasher("sha256").update(salt + ip).digest("hex").slice(0, 16);
}
