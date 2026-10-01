import { PRIORITY_DOCS } from "./catalog.ts";
import { compilePolicy } from "../retrieve/policy.ts";
import type { RetrievePolicy, RetrievePolicyJson } from "../retrieve/types.ts";

/** Atoms-first retrieve policy. Data, not host code. */
export const SMALLEST_RETRIEVE_JSON: RetrievePolicyJson = {
  aliases: [
    { match: "\\b(tts|text[- ]?to[- ]?speech|synthesi|speak|voice clone|lightning)\\b", terms: ["lightning", "tts"] },
    { match: "\\b(stt|speech[- ]?to[- ]?text|transcri|dictat|caption|pulse)\\b", terms: ["pulse", "stt"] },
    { match: "\\b(llm|language model|electron|brain)\\b", terms: ["electron", "llm"] },
    { match: "\\b(hydra|speech[- ]?to[- ]?speech|s2s|full[- ]?duplex)\\b", terms: ["hydra", "s2s"] },
    { match: "\\b(atoms|hosted|dashboard|phone|telephony|inbound|outbound|campaign|voice agent|create an agent)\\b", terms: ["atoms", "platform", "agent"] },
    { match: "\\b(interrupt|voicemail|speech speed|denois|turn detection|speech settings|wait for user)\\b", terms: ["speech", "interruptions"] },
    { match: "\\b(widget|web sdk|embed)\\b", terms: ["widget", "web"] },
    { match: "\\b(knowledge|faq|pdf|kb)\\b", terms: ["knowledge", "base"] },
    { match: "\\b(crew|byom|custom llm)\\b", terms: ["crew", "byom"] },
  ],
  preferTerms: ["atoms", "platform", "agent"],
  extraRules: [
    { match: "\\bpipecat", terms: ["pipecat", "smallestttsservice"] },
    { match: "\\blive[- ]?kit", terms: ["livekit"] },
  ],
  kindRules: [
    { match: "/text-to-speech|/lightning", kind: "model" },
    { match: "/speech-to-text|pulse", kind: "model" },
    { match: "electron|/llm-", kind: "model" },
    { match: "hydra|speech-to-speech", kind: "model" },
    { match: "/integrations/|pipecat|live-kit|livekit", kind: "integration" },
    { match: "/platform/|/voice-agents/", kind: "platform" },
    { match: "/developer-guide/", kind: "guide" },
    { match: "docs\\.smallest\\.ai", kind: "guide" },
  ],
  defaultKind: "marketing",
  kindPriors: { integration: 4, platform: 3, guide: 2, model: 1.2 },
  kindBoosts: { integration: 5, platform: 0.35 },
  kindPriority: { platform: 4.5, guide: 3, integration: 0.2, marketing: 0, model: 1 },
  defaultPriority: 1,
  priorityPaths: PRIORITY_DOCS,
  integrationKind: "integration",
  platformKind: "platform",
  guideKind: "guide",
  queryKindDefault: "platform",
  queryEmbedSkip: ["atoms", "platform", "agent"],
};

const compiled = compilePolicy(SMALLEST_RETRIEVE_JSON);

function wantsOwnStack(query: string): boolean {
  const t = query.toLowerCase();
  return (
    (/\b(keep|stay|must keep|wire|plugin|pipecat-ai|livekit-agents)\b/.test(t) &&
      /\b(pipecat|livekit|own stack|pipeline)\b/.test(t)) ||
    /\b(pipecat-ai|livekit-agents|smallestttsservice|smalleststtservice)\b/.test(t)
  );
}

export const SMALLEST_POLICY: RetrievePolicy = {
  ...compiled,
  extraTerms(query) {
    if (!wantsOwnStack(query)) return [];
    return compiled.extraTerms(query);
  },
  wantsIntegration: wantsOwnStack,
  queryKind(query) {
    return wantsOwnStack(query) ? "integration" : "platform";
  },
};
