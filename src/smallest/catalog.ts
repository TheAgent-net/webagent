/** Grounded product facts from smallest.ai + docs.smallest.ai (llms.txt). */

export const MARKET = "https://smallest.ai";
export const DOCS = "https://docs.smallest.ai";
export const LLMS = DOCS + "/llms.txt";
export const DASH = "https://app.smallest.ai";
export const PRICING = MARKET + "/pricing";

export const MODELS = {
  tts: "Lightning v3.1 (current). lightning_v3.1 / lightning_v3.1_pro. ~100ms. Do not suggest Lightning v2.",
  stt: "Pulse (current). 38+ languages, ~64ms. Pulse Pro is batch English accuracy.",
  llm: "Electron — in-house voice LLM, OpenAI-compatible, 70 languages, first-class Indic. Enterprise for hosted Atoms.",
  s2s: "Hydra — full-duplex speech-to-speech (beta). Audio in/out on one WebSocket.",
};

export const DOC = {
  codingAgent: DOCS + "/voice-agents/developer-guide/get-started/build-with-a-coding-agent",
  quickStart: DOCS + "/voice-agents/platform/get-started/quick-start",
  buildAgent: DOCS + "/voice-agents/platform/create-agent/build-your-agent",
  agentConfig: DOCS + "/voice-agents/platform/create-agent/agent-config",
  speech: DOCS + "/voice-agents/platform/create-agent/agent-settings/speech-settings",
  prompt: DOCS + "/voice-agents/platform/create-agent/prompt",
  useCases: DOCS + "/voice-agents/developer-guide/get-started/use-case-finder",
  crew: DOCS + "/voice-agents/developer-guide/get-started/quickstart",
  llmSettings: DOCS + "/voice-agents/developer-guide/build/agent-crews/llm/llm-settings",
  byom: DOCS + "/voice-agents/developer-guide/build/agent-crews/llm/byom",
  kb: DOCS + "/voice-agents/platform/create-agent/knowledge-base",
  tools: DOCS + "/voice-agents/platform/create-agent/tools-overview",
  phones: DOCS + "/voice-agents/platform/deploy/phone-numbers",
  campaigns: DOCS + "/voice-agents/platform/deploy/campaigns",
  widget: DOCS + "/voice-agents/platform/create-agent/agent-settings/widget",
  webSdk: DOCS + "/voice-agents/platform/agent-sdk/web-socket-sdk",
  pipecat: DOCS + "/models/integrations/agent-framework/pipecat",
  livekit: DOCS + "/models/integrations/agent-framework/live-kit",
  lightning: DOCS + "/models/documentation/text-to-speech-lightning/overview",
  pulse: DOCS + "/models/documentation/speech-to-text-pulse/overview",
  electron: DOCS + "/models/documentation/llm-electron/overview",
  hydra: DOCS + "/models/documentation/speech-to-speech-hydra/overview",
  mcp: DOCS + "/voice-agents/mcp/getting-started/quick-start",
};

export const STARTER_QUESTIONS = [
  "I'm new and not sure where to start",
  "People should be able to call us and talk to an AI",
  "I already have an app — I just need it to speak",
  "Walk me through the right setup for my case",
];

export const PRIORITY_DOCS = [
  "/voice-agents/developer-guide/get-started/build-with-a-coding-agent",
  "/voice-agents/platform/get-started/quick-start",
  "/voice-agents/developer-guide/get-started/use-case-finder",
  "/voice-agents/platform/create-agent/build-your-agent",
  "/voice-agents/platform/create-agent/agent-config",
  "/voice-agents/platform/create-agent/agent-settings/speech-settings",
  "/voice-agents/platform/create-agent/prompt",
  "/voice-agents/developer-guide/build/agent-crews/llm/llm-settings",
  "/voice-agents/developer-guide/build/agent-crews/llm/byom",
  "/voice-agents/platform/create-agent/knowledge-base",
  "/voice-agents/platform/create-agent/tools-overview",
  "/voice-agents/platform/deploy/phone-numbers",
  "/voice-agents/platform/deploy/campaigns",
  "/voice-agents/platform/create-agent/agent-settings/widget",
  "/models/integrations/agent-framework/pipecat",
  "/models/integrations/agent-framework/live-kit",
  "/models/documentation/text-to-speech-lightning/overview",
  "/models/documentation/speech-to-text-pulse/overview",
  "/models/documentation/llm-electron/overview",
  "/models/documentation/speech-to-speech-hydra/overview",
];
