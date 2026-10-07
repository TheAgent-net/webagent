import type { Room } from "../host/room.ts";
import { connectHowTo, renderCopyPrompt } from "./prompt.ts";
import type { AgentPackConfig } from "./types.ts";

export function packAgentCard(base: string, room: Room, config: AgentPackConfig, session?: string) {
  const guide = connectHowTo(base, config.brand.name, session);
  const skills = config.skills?.length
    ? config.skills
    : [
        {
          id: "docs",
          name: "Docs retrieval",
          description: "Look up the matching public page and cite one URL.",
          tags: ["docs", "retrieval"],
        },
      ];
  return {
    type: "webagent",
    name: config.brand.name,
    description: config.card?.description || config.brand.tagline,
    url: base,
    mcp: base + "/mcp",
    chat: base + "/chat",
    live: base + "/live",
    widget: base + "/widget.js",
    runId: room.run.id,
    protocol: "2025-06-18",
    documentationUrl: config.docs?.origin || config.origin,
    defaultInputModes: ["text", "application/json"],
    defaultOutputModes: ["application/json", "text"],
    capabilities: { streaming: true, tools: true, pushNotifications: false },
    preferredTransport: "HTTP+JSON",
    supportedInterfaces: [
      { url: base + "/chat", protocolBinding: "HTTP+JSON", protocolVersion: "1.0" },
      { url: base + "/mcp", protocolBinding: "MCP", protocolVersion: "2025-06-18" },
    ],
    skills,
    howToConnect: guide,
    instructions: config.card?.instructions || config.sales?.instruction || config.brand.tagline,
    connectPrompt: guide,
    copyPrompt: renderCopyPrompt(config, base),
  };
}
