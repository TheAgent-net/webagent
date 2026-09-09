export type ClientKind = "human" | "machine";

/** Anything that is an agent, IDE, headless browser, or HTTP library — not a person in a tab. */
const MACHINE_UA =
  /bot|gptbot|claude|anthropic|cursor|electron|vscode|codex|aider|playwright|puppeteer|headless|jsdom|happy-dom|curl\/|httpie|python-requests|python-urllib|go-http|axios|undici|node-fetch|node\/|bun\/|wget\/|aiohttp|okhttp|java\/|libwww|scrapy|openai|copilot|gemini|bytespider|slurp|bingbot|duckduckbot|facebookexternalhit|a2a\/|mcp-client|mcp\/|webagent|composio-agent/i;

/**
 * Browser tab vs peer agent.
 *
 * Humans: a browser that asked for HTML. Mobile Safari often sends dest=document
 * (or no Fetch Metadata at all) and omits Sec-Fetch-User — that is still a person.
 *
 * Machines: MCP/A2A headers, agent UAs, or Accept that prefers JSON/plain.
 * Cursor/Playwright are machine via UA even when they spoof dest=document.
 */
export function clientKind(req: Request): ClientKind {
  const ua = req.headers.get("user-agent") ?? "";
  const accept = (req.headers.get("accept") ?? "").toLowerCase();
  const dest = (req.headers.get("sec-fetch-dest") ?? "").toLowerCase();
  const mode = (req.headers.get("sec-fetch-mode") ?? "").toLowerCase();
  const user = req.headers.get("sec-fetch-user") ?? "";

  if (req.headers.get("mcp-protocol-version") || req.headers.get("mcp-session-id")) return "machine";
  if (req.headers.get("x-agent") || req.headers.get("a2a-version") || req.headers.get("a2a-extensions")) {
    return "machine";
  }
  if (req.headers.get("x-session-id")) return "machine";
  if (MACHINE_UA.test(ua)) return "machine";
  if (acceptPrefersMachine(accept)) return "machine";
  if (!acceptPrefersHtml(accept)) return "machine";

  if (user === "?1") return "human";
  if (dest === "document" || dest === "iframe") return "human";
  if (!dest && (mode === "navigate" || !mode) && looksLikeBrowser(ua)) return "human";
  return "machine";
}

/** Query flags that force the agent card even from a browser. */
export function wantsAgentCard(url: URL): boolean {
  const q = url.searchParams;
  return q.get("agent") === "1" || q.get("format") === "json" || q.get("card") === "1";
}

/** Query flags that force the human site even from a machine-looking client. */
export function wantsHumanPage(url: URL): boolean {
  const q = url.searchParams;
  return q.get("human") === "1" || q.get("view") === "site";
}

/** JSON agent card only when the client asked for JSON. Default machine body is text/plain. */
export function wantsJsonCard(req: Request, url: URL): boolean {
  const q = url.searchParams;
  if (q.get("format") === "json" || q.get("card") === "1") return true;
  const accept = (req.headers.get("accept") ?? "").toLowerCase();
  if (!accept || accept === "*/*") return false;
  const json = accept.includes("application/json");
  const text = accept.includes("text/plain") || accept.includes("text/markdown");
  return json && !text;
}

function firstConcreteType(accept: string): string {
  for (const part of accept.split(",")) {
    const type = part.split(";")[0]?.trim().toLowerCase() ?? "";
    if (!type || type === "*/*") continue;
    return type;
  }
  return "";
}

function acceptPrefersHtml(accept: string): boolean {
  const first = firstConcreteType(accept);
  return first === "text/html" || first === "application/xhtml+xml";
}

function acceptPrefersMachine(accept: string): boolean {
  const first = firstConcreteType(accept);
  return (
    first === "application/json" ||
    first === "text/plain" ||
    first === "text/event-stream" ||
    first === "application/mcp" ||
    first === "application/ld+json"
  );
}

function looksLikeBrowser(ua: string): boolean {
  return /mozilla/i.test(ua);
}
