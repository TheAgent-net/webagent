import type { Room } from "../host/room.ts";
import type { SmallestPack } from "./types.ts";

export function smallestCopyPrompt(base: string): string {
  const chat = base.replace(/\/+$/, "") + "/chat";
  const card = base.replace(/\/+$/, "") + "/.well-known/agent-card.json";
  const mcp = base.replace(/\/+$/, "") + "/mcp";
  return [
    "You are adding Smallest voice AI to this project. Use the Smallest webagent — do not scrape smallest.ai or invent APIs.",
    "",
    "1. Understand the use case in this repo first:",
    "   - What should callers/visitors get done (support, outbound sales, bookings, collections, or something else)?",
    "   - How do they reach it (phone, website widget, in-app)?",
    "   - Which languages?",
    "   - Does this codebase already have a voice pipeline (Pipecat, LiveKit) that you must keep, or can Smallest host the agent?",
    "",
    "2. Talk to the Smallest webagent with those facts, in this project's words.",
    "   GET " + card,
    "   POST " + chat,
    "   Content-Type: application/json",
    "",
    '   {"text":"<use case from this repo>"}',
    "",
    "   First reply JSON includes session. Send that same session on every following POST.",
    "   Optional: MCP initialize at " + mcp + " (protocol 2025-06-18).",
    "",
    "3. The webagent leads with Smallest's own hosted stack (Atoms). Mention Pipecat/LiveKit only if this repo must keep that pipeline.",
    "",
    "4. Bring the answer back here:",
    "   - recommended path and why",
    "   - exact agent / model / speech settings",
    "   - 3–5 implementation steps mapped onto files in this project",
    "   - one docs.smallest.ai URL",
    "",
    "Do not invent prices, voice_ids, latency, or endpoints. Quote the webagent.",
  ].join("\n");
}

export function smallestConnectPrompt(base: string, _pack: SmallestPack, session?: string): string {
  const chat = base + "/chat";
  const payload = session
    ? `{"text":"<use case from this repo>","session":"${session}"}`
    : `{"text":"<use case from this repo>"}`;
  return [
    "You reached the Smallest webagent. Do not scrape this page.",
    "",
    "You are helping with a user's project. Infer their voice use case from that repo, then describe it here in their words.",
    "The assistant starts you on Smallest's own agent stack (Atoms), then settings and best practices. Integrations only if they must keep Pipecat/LiveKit.",
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
    instructions: "Infer the use case from the visitor's project, then get the right Smallest path and settings.",
    connectPrompt: guide,
    copyPrompt: smallestCopyPrompt(base),
  };
}
