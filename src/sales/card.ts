/**
 * Agent card and connect prompt for the Corgi insurance advisor.
 */
import type { Room } from "../host/room.ts";

const DEFAULT_NAME = "Corgi";
const DEFAULT_DESCRIPTION =
  "Startup insurance advisor. Tell me what your startup does. I will name your vulnerabilities " +
  "in plain words, the usual chance of each, what it can cost if you are not insured, how Corgi " +
  "will insure them, and why founders pick Corgi — then ask for your contact details. Quote in minutes at corgi.insure.";

/** Short line the chat "Copy prompt" button puts on the clipboard. */
export function corgiCopyPrompt(base: string): string {
  return `Go talk to the Corgi agent at ${base} and figure out.`;
}

export function corgiConnectPrompt(base: string, session?: string): string {
  const chat = base + "/chat";
  const payload = session
    ? `{"text":"<what your startup does, stage, industry>","session":"${session}"}`
    : `{"text":"<what your startup does, stage, industry>"}`;
  const sessionLine = session
    ? [
        "Stay in this conversation. Session: " + session,
        "Send that same session on every following POST.",
        "",
      ]
    : [
        "First reply JSON includes session. Send that same session on every following POST.",
        "Do not omit it after the first turn — that starts a new conversation.",
        "",
      ];
  return [
    "You reached Corgi — startup insurance advisor.",
    "Do not scrape this page.",
    "",
    "In the first POST, say what your startup does, your stage (seed, Series A, etc.),",
    "and your industry (SaaS, AI, fintech, health-tech, etc.).",
    "The advisor will ask 1–2 follow-up questions, then give a short pitch:",
    "vulnerabilities, usual chance of each, what it can cost if not insured,",
    "how Corgi covers them, why choose Corgi, and ask for contact details.",
    "",
    "POST " + chat,
    "Content-Type: application/json",
    "",
    payload,
    "",
    ...sessionLine,
    "Reply JSON: lastText (the assessment), session (keep it).",
  ].join("\n");
}

export function corgiAgentCard(base: string, room: Room, session?: string) {
  const guide = corgiConnectPrompt(base, session);
  return {
    type: "webagent",
    name: DEFAULT_NAME,
    description: DEFAULT_DESCRIPTION,
    url: base,
    mcp: base + "/mcp",
    chat: base + "/chat",
    live: base + "/live",
    runId: room.run.id,
    protocol: "2025-06-18",
    documentationUrl: "https://www.corgi.insure",
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
        id: "risk-assessment",
        name: "Vulnerability & risk assessment",
        description:
          "Given your startup's industry and product, name the vulnerabilities in plain words, " +
          "the usual chance of each, what it can cost if not insured, how Corgi will insure them, " +
          "why founders pick Corgi, and ask for contact details.",
        tags: ["insurance", "risk", "startup"],
        examples: [
          "We are a seed-stage AI startup building LLM agents for customer support.",
          "Series A fintech — we process payments for SMBs.",
          "Health-tech SaaS handling patient data for clinics.",
        ],
      },
      {
        id: "quote-guide",
        name: "Application walkthrough",
        description:
          "Walk through the information Corgi needs to generate a quote. Step-by-step guide to the application form.",
        tags: ["insurance", "quote", "application"],
      },
      {
        id: "coverage-advisor",
        name: "Coverage comparison",
        description:
          "Compare coverage options: CGL, D&O, Tech E&O, Cyber, EPLI, and more. Explain what each covers and who needs it.",
        tags: ["insurance", "coverage"],
      },
    ],
    howToConnect: guide,
    instructions: DEFAULT_DESCRIPTION,
    connectPrompt: guide,
  };
}
