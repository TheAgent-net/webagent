export type ClientKind = "human" | "machine";

const MACHINE_UA =
  /bot|gptbot|claude|anthropic|curl\/|httpie|python-requests|go-http|axios|undici|node-fetch|wget\/|aiohttp|okhttp|java\/|libwww|scrapy|puppeteer|playwright|cursor-ide|openai|copilot|gemini-bot|bytespider|slurp|bingbot|duckduckbot|facebookexternalhit|a2a\/|mcp-client|webagent/i;

/**
 * Browser vs AI client.
 * Fail toward machine when unsure so A2A and APIs stay reachable.
 * A real document navigation (browser tab) is always human, even HeadlessChrome.
 */
export function clientKind(req: Request): ClientKind {
  const ua = req.headers.get("user-agent") ?? "";
  const accept = (req.headers.get("accept") ?? "").toLowerCase();
  const dest = (req.headers.get("sec-fetch-dest") ?? "").toLowerCase();

  if (req.headers.get("mcp-protocol-version") || req.headers.get("mcp-session-id")) return "machine";
  if (req.headers.get("x-agent") || req.headers.get("a2a-version") || req.headers.get("a2a-extensions")) {
    return "machine";
  }
  if (dest === "document" || dest === "iframe") return "human";
  if (MACHINE_UA.test(ua)) return "machine";
  if (req.method === "GET" && accept.includes("text/html") && !accept.includes("application/json")) return "human";
  if (
    accept.includes("text/event-stream") ||
    accept.includes("application/json") ||
    accept.includes("application/mcp") ||
    accept.includes("application/ld+json")
  ) {
    return "machine";
  }
  if (req.method === "GET" && /mozilla|chrome|safari|firefox|edg\//i.test(ua)) return "human";
  return "machine";
}

/** Query flags that force the agent card even from a browser. */
export function wantsAgentCard(url: URL): boolean {
  const q = url.searchParams;
  return q.get("agent") === "1" || q.get("format") === "json" || q.get("card") === "1";
}
