/**
 * Public MCP for one tenant: one `ask` tool that talks to the public agent.
 * The cloud uses this in place of the full harness MCP. A visitor cannot create runs, pick models, or crawl.
 */
import { MCP_PROTOCOL, rpc } from "../mcp.ts";

export interface AskReply {
  lastText: string;
  session: string;
  visuals?: object[];
}

/** Say one message. `session` is the chat session. Return the reply. */
export type Ask = (text: string, session: string) => Promise<AskReply | Response>;

const ALLOW = "GET, POST, DELETE, OPTIONS";
const SESSION_OK = /^[A-Za-z0-9_-]{1,80}$/;

interface Rpc {
  id?: unknown;
  method?: unknown;
  params?: { name?: unknown; arguments?: Record<string, unknown> };
}

/** Fetch handler for `/mcp` in tenant mode. */
export function askMcp(name: string, ask: Ask): (req: Request) => Promise<Response> {
  const label = name || "this site";
  const tool = {
    name: "ask",
    description:
      `Ask the ${label} agent a question in plain words. ` +
      "Send the same session on every later call to keep one conversation.",
    inputSchema: {
      type: "object",
      properties: {
        text: { type: "string", description: "Your question." },
        session: { type: "string", description: "Session from the last reply. Leave empty on the first call." },
      },
      required: ["text"],
    },
  };
  return async (req: Request) => {
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: { Allow: ALLOW } });
    if (req.method === "DELETE") return new Response(null, { status: 204 });
    if (req.method === "GET") {
      return Response.json(
        { type: "mcp", protocol: MCP_PROTOCOL, tools: ["ask"], howToConnect: "POST JSON-RPC initialize, then tools/call ask {text, session}." },
        { headers: { Allow: ALLOW } },
      );
    }
    if (req.method !== "POST") return new Response("method not allowed", { status: 405, headers: { Allow: ALLOW } });

    let msg: Rpc;
    try {
      msg = (await req.json()) as Rpc;
    } catch {
      return rpc(req, null, undefined, { code: -32700, message: "parse error" });
    }
    if (!msg || typeof msg.method !== "string") return rpc(req, msg?.id, undefined, { code: -32600, message: "invalid request" });
    if (!("id" in msg)) return new Response(null, { status: 202 });

    if (msg.method === "initialize") {
      const sid = "m" + crypto.randomUUID().replace(/-/g, "").slice(0, 20);
      const res = await rpc(req, msg.id, {
        protocolVersion: MCP_PROTOCOL,
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: label, version: "1" },
        instructions: `Call the ask tool to talk to the ${label} agent.`,
        sessionId: sid,
      });
      res.headers.set("Mcp-Session-Id", sid);
      res.headers.set("MCP-Protocol-Version", MCP_PROTOCOL);
      return res;
    }
    if (msg.method === "ping") return rpc(req, msg.id, {});
    if (msg.method === "tools/list") return rpc(req, msg.id, { tools: [tool] });
    if (msg.method !== "tools/call") return rpc(req, msg.id, undefined, { code: -32601, message: "method not found" });
    if (msg.params?.name !== "ask") return rpc(req, msg.id, undefined, { code: -32602, message: "unknown tool; use ask" });

    const args = msg.params.arguments ?? {};
    const text = typeof args.text === "string" ? args.text.trim().slice(0, 4000) : "";
    if (!text) return rpc(req, msg.id, undefined, { code: -32602, message: "text is required" });
    const given = typeof args.session === "string" ? args.session.trim() : "";
    const header = req.headers.get("Mcp-Session-Id") ?? "";
    const session = SESSION_OK.test(given) ? given : SESSION_OK.test(header) ? header : "m" + crypto.randomUUID().replace(/-/g, "").slice(0, 20);

    const out = await ask(text, session);
    if (out instanceof Response) {
      const body = (await out.json().catch(() => ({}))) as { lastText?: string };
      return rpc(req, msg.id, { content: [{ type: "text", text: body.lastText || "The agent is not available now." }], isError: true });
    }
    return rpc(req, msg.id, {
      content: [{ type: "text", text: out.lastText }],
      structuredContent: { lastText: out.lastText, session: out.session, ...(out.visuals ? { visuals: out.visuals } : {}) },
    });
  };
}
