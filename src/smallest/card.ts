import type { Room } from "../host/room.ts";
import type { SmallestPack } from "./types.ts";

export function smallestCopyPrompt(base: string): string {
  return `Go talk to the Smallest AI agent at ${base} and figure out.`;
}

export function smallestConnectPrompt(base: string, _pack: SmallestPack, session?: string): string {
  const chat = base + "/chat";
  const payload = session
    ? `{"text":"<what you want to build with Smallest>","session":"${session}"}`
    : `{"text":"<what you want to build with Smallest>"}`;
  return [
    "You reached Smallest AI — public webagent for voice-agent implementation.",
    "Do not scrape this page.",
    "",
    "Say what you are building. The assistant starts you on Smallest's own agent stack (Atoms), then settings and best practices. Integrations only if you must keep your stack.",
    "",
    "POST " + chat,
    "Content-Type: application/json",
    "",
    payload,
    "",
    session
      ? "Stay in this conversation. Session: " + session
      : "First reply JSON includes session. Send that same session on every following POST.",
    "",
    "Reply JSON: lastText, session (keep it).",
  ].join("\n");
}

export function smallestAgentCard(base: string, room: Room, pack: SmallestPack, session?: string) {
  const guide = smallestConnectPrompt(base, pack, session);
  return {
    type: "webagent",
    name: "Smallest AI",
    description:
      "Smallest AI assistant. Helps you understand and use Smallest — Atoms first, best-practice settings, integrations only if you must keep your own stack.",
    url: base,
    mcp: base + "/mcp",
    chat: base + "/chat",
    live: base + "/live",
    runId: room.run.id,
    protocol: "2025-06-18",
    documentationUrl: pack.docsOrigin,
    defaultInputModes: ["text", "application/json"],
    defaultOutputModes: ["application/json", "text"],
    capabilities: { streaming: true, tools: true, pushNotifications: false },
    preferredTransport: "HTTP+JSON",
    supportedInterfaces: [
      { url: base + "/chat", protocolBinding: "HTTP+JSON", protocolVersion: "1.0" },
      { url: base + "/mcp", protocolBinding: "MCP", protocolVersion: "2025-06-18" },
    ],
    skills: [
      {
        id: "intent",
        name: "Intent discovery",
        description: "Ask one question at a time until the use case, channel, and direction are clear.",
        tags: ["intent", "discovery"],
      },
      {
        id: "settings",
        name: "Settings advisor",
        description: "Lead with Atoms (Smallest's own agent stack), then settings, telephony, KB, and tools.",
        tags: ["settings", "voice", "atoms"],
      },
      {
        id: "implement",
        name: "Implementation plan",
        description: "Concrete next steps and the matching docs page.",
        tags: ["docs", "implementation"],
      },
      {
        id: "docs",
        name: "Docs retrieval",
        description: "Look up the matching smallest.ai / docs.smallest.ai section and cite one URL.",
        tags: ["docs", "retrieval"],
      },
    ],
    howToConnect: guide,
    instructions: "Say what you are building. Get the right Smallest path and settings.",
    connectPrompt: guide,
    copyPrompt: smallestCopyPrompt(base),
  };
}
