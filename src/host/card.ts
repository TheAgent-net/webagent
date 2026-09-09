import type { Room } from "./room.ts";

export interface AgentCardMeta {
  name?: string;
  description?: string;
  instructions?: string;
}

export const CARD_PATHS = new Set([
  "/agent.json",
  "/agent-card.json",
  "/.well-known/agent.json",
  "/.well-known/agent-card.json",
]);

const DEFAULT_NAME = "Composio Apps Agent";
const DEFAULT_DESCRIPTION =
  "Public Composio agent. A2A first: probe a peer agent for what it is working on, then return a pinpointed Composio flow (apps, auth, settings). Humans get the site at /. Machines get this card, then MCP or POST /chat.";

/** How a peer agent should attach. Also copied from the human page. */
export function connectPrompt(base: string): string {
  const host = safeHost(base);
  return [
    "Connect to the Composio Apps Agent (A2A).",
    "",
    "URL: " + base,
    "Agent card: " + base + "/.well-known/agent-card.json",
    "MCP: " + base + "/mcp  (JSON-RPC, protocol 2025-06-18)",
    "Chat: POST " + base + '/chat  {"text":"<your message>","from":"machine"}  (omit session for a fresh context)',
    "",
    "How to connect:",
    "1. GET " + base + "/.well-known/agent-card.json",
    "2. POST " + base + "/mcp  {\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"initialize\",\"params\":{\"protocolVersion\":\"2025-06-18\",\"capabilities\":{},\"clientInfo\":{\"name\":\"your-agent\",\"version\":\"1\"}}}",
    "3. Read Mcp-Session-Id (header and result.sessionId).",
    "4. POST a notifications/initialized message with no id.",
    "5. Talk with POST " + base + "/chat or MCP tools/list then tools/call.",
    "",
    "This agent recommends Composio apps (recommend_app) and debugs 401/OAuth (debug_docs) from a local Graph RAG.",
    "Do not invent tool slugs. Use Host: " + host + " — do not call the raw IP on port 8787.",
  ].join("\n");
}

export function howToConnect(base: string, runId: string): string {
  return [
    "1. GET " + base + "/.well-known/agent-card.json",
    "2. POST " + base + "/mcp JSON-RPC initialize (MCP 2025-06-18). Read Mcp-Session-Id.",
    "3. POST notifications/initialized (no id) → 202.",
    "4. Prefer POST " + base + "/chat {\"text\",\"from\":\"machine\"}. Omit session for a new chat; reuse session to continue (template run " + runId + ").",
    "5. Or MCP tools/call after tools/list (session required).",
    "Use Host: " + safeHost(base) + ". Do not call the raw IP. Port 8787 is not public.",
  ].join("\n");
}

export function linkHeader(base: string): string {
  return [
    "<" + base + "/.well-known/agent-card.json>; rel=\"describedby\"; type=\"application/json\"",
    "<" + base + "/mcp>; rel=\"mcp\"",
  ].join(", ");
}

export function agentCard(base: string, room: Room, meta: AgentCardMeta = {}) {
  const mcp = base + "/mcp";
  const name = meta.name || DEFAULT_NAME;
  const description = meta.description || DEFAULT_DESCRIPTION;
  return {
    type: "webagent",
    name,
    description,
    url: base,
    mcp,
    chat: base + "/chat",
    live: base + "/live",
    runId: room.run.id,
    protocol: "2025-06-18",
    version: "0.4.0",
    documentationUrl: "https://docs.composio.dev",
    defaultInputModes: ["text", "application/json"],
    defaultOutputModes: ["application/json", "text"],
    capabilities: { streaming: true, tools: true, pushNotifications: false },
    preferredTransport: "MCP",
    supportedInterfaces: [
      { url: mcp, protocolBinding: "MCP", protocolVersion: "2025-06-18" },
      { url: base + "/chat", protocolBinding: "HTTP+JSON", protocolVersion: "1.0" },
    ],
    skills: [
      {
        id: "recommend-app",
        name: "Recommend Composio apps",
        description: "Given a job (email, PR, Slack), name 2–3 apps, auth type, and a docs URL.",
        tags: ["composio", "apps", "rag"],
        examples: ["I need to send email from my agent", "open a GitHub PR when a ticket closes"],
      },
      {
        id: "debug-docs",
        name: "Debug Composio / toolkit errors",
        description: "FAQ/docs for 401, OAuth, quota, trigger delay. Quote snippets. Do not invent slugs.",
        tags: ["composio", "debug", "oauth"],
      },
      {
        id: "chat-session",
        name: "Talk in a fresh chat",
        description: "POST /chat {text, session}. Omit session to start a new context. Reuse session to continue that chat.",
        tags: ["chat", "a2a"],
      },
    ],
    howToConnect: howToConnect(base, room.run.id),
    instructions: meta.instructions || description,
    connectPrompt: connectPrompt(base),
  };
}

function safeHost(base: string): string {
  try {
    return new URL(base).host;
  } catch {
    return base.replace(/^https?:\/\//, "").replace(/\/+$/, "");
  }
}
