/** Simple CORS helpers for public agents. */

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept, MCP-Protocol-Version, MCP-Session-Id, X-Agent, A2A-Version, X-Session-Id",
  "Access-Control-Expose-Headers": "X-Session-Id, Link",
  "Access-Control-Max-Age": "86400",
} as const;

export function corsPreflight(): Response {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export function withCors(res: Response): Response {
  const out = new Response(res.body, res);
  out.headers.set("Access-Control-Allow-Origin", "*");
  out.headers.set("Access-Control-Expose-Headers", "X-Session-Id, Link");
  return out;
}
