import type { Room } from "../host/room.ts";
import type { CompanyPack } from "./types.ts";

export function companyCopyPrompt(base: string, name: string): string {
  return `Go talk to the ${name} agent at ${base} and figure out.`;
}

export function companyConnectPrompt(base: string, pack: CompanyPack, session?: string): string {
  const chat = base + "/chat";
  const payload = session
    ? `{"text":"<what you need from ${pack.profile.name}>","session":"${session}"}`
    : `{"text":"<what you need from ${pack.profile.name}>"}`;
  return [
    `You reached ${pack.profile.name} — public webagent.`,
    "Do not scrape this page.",
    "",
    pack.profile.tagline,
    "",
    "Say what you want. The agent will ask 1–2 follow-ups, walk any matching form, then give a short brief.",
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

export function companyAgentCard(base: string, room: Room, pack: CompanyPack, session?: string) {
  const p = pack.profile;
  const guide = companyConnectPrompt(base, pack, session);
  return {
    type: "webagent",
    name: p.name,
    description: `${p.name} webagent. ${p.tagline} Built from ${p.origin}${p.github ? " and " + p.github : ""}.`,
    url: base,
    mcp: base + "/mcp",
    chat: base + "/chat",
    live: base + "/live",
    runId: room.run.id,
    protocol: "2025-06-18",
    documentationUrl: p.website || p.origin,
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
        id: "site-guide",
        name: "Site guide",
        description: "Answer from crawled pages. Walk the visitor through a matching flow.",
        tags: ["site", "guide"],
      },
      {
        id: "form-walk",
        name: "Form walkthrough",
        description: "If the site has forms, walk them field by field.",
        tags: ["form", "signup", "contact"],
      },
      {
        id: "company-brief",
        name: "Company brief",
        description: "Short pitch: what the company does for this visitor and what to do next.",
        tags: ["sales", "brief"],
      },
    ],
    howToConnect: guide,
    instructions: p.tagline,
    connectPrompt: guide,
    copyPrompt: companyCopyPrompt(base, p.name),
  };
}
