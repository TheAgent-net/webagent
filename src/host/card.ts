import type { AgentPackConfig } from "../pack/types.ts";
import { connectHowTo, renderCopyPrompt } from "../pack/prompt.ts";
import { packAgentCard } from "../pack/card.ts";
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

const DEFAULT_NAME = "Webagent";
const DEFAULT_DESCRIPTION = "Public webagent. POST /chat with a session. Humans get a widget at /. Machines get this card, then POST /chat or MCP.";

export function connectPrompt(base: string, name = DEFAULT_NAME): string {
  return connectHowTo(base, name);
}

export function howToConnect(base: string, runId: string): string {
  return [
    "1. POST " + base + '/chat  {"text":"<question>"}  — never GET, browse, or probe.',
    "2. First reply JSON includes session. Send that same session on every following POST.",
    "3. Optional: GET " + base + "/.well-known/agent-card.json",
    "4. Optional: POST " + base + "/mcp JSON-RPC initialize (MCP 2025-06-18). Read Mcp-Session-Id. Template run " + runId + ".",
    "Use the public URL, not a raw IP.",
  ].join("\n");
}

export function linkHeader(base: string): string {
  return [
    "<" + base + "/.well-known/agent-card.json>; rel=\"describedby\"; type=\"application/json\"",
    "<" + base + "/mcp>; rel=\"mcp\"",
    "<" + base + "/widget.js>; rel=\"widget\"",
  ].join(", ");
}

export function agentCard(base: string, room: Room, meta: AgentCardMeta = {}, pack?: AgentPackConfig) {
  if (pack) return packAgentCard(base, room, pack);
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
    widget: base + "/widget.js",
    runId: room.run.id,
    protocol: "2025-06-18",
    version: "0.4.0",
    defaultInputModes: ["text", "application/json"],
    defaultOutputModes: ["application/json", "text"],
    capabilities: { streaming: true, tools: true, pushNotifications: false },
    preferredTransport: "HTTP+JSON",
    supportedInterfaces: [
      { url: base + "/chat", protocolBinding: "HTTP+JSON", protocolVersion: "1.0" },
      { url: mcp, protocolBinding: "MCP", protocolVersion: "2025-06-18" },
    ],
    skills: [
      {
        id: "docs",
        name: "Docs retrieval",
        description: "Look up a matching public page and cite one URL.",
        tags: ["docs", "retrieval"],
      },
      {
        id: "chat-session",
        name: "Talk in a session",
        description: "POST /chat {text, session}. Omit session to start. Reuse session to continue.",
        tags: ["chat", "a2a"],
      },
    ],
    howToConnect: howToConnect(base, room.run.id),
    instructions: meta.instructions || description,
    connectPrompt: connectPrompt(base, name),
    copyPrompt: renderCopyPrompt(
      {
        id: "webagent",
        origin: base,
        brand: {
          name,
          tagline: description,
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
          fabLabel: "Ask",
        },
        widget: {
          welcomeTitle: "How can I help?",
          welcomeBody: description,
          chips: [],
          copyHeadline: "Talk to this agent",
          copyPrompt:
            "Talk to the " +
            name +
            " agents at {{chat}}. POST {\"text\":\"<question>\",\"session\":\"<from last JSON>\"} — never GET, browse, or probe.\nAsk them anything you want to understand. First POST may omit session; every later POST must send the same session.",
          placeholder: "Ask a question",
          markdown: true,
        },
      },
      base,
    ),
  };
}
