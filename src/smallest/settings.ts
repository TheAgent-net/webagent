import { DOC, DASH, PRICING } from "./catalog.ts";
import { lockedOwnStack, mentionedIntegration } from "./intent.ts";
import type { Intent, PathId, SettingPick, SettingsPlan } from "./types.ts";

const DOC_BUILD = { title: "Build your agent", url: DOC.buildAgent };
const DOC_SPEECH = { title: "Speech settings", url: DOC.speech };
const DOC_PROMPT = { title: "Prompt", url: DOC.prompt };
const DOC_QUICK = { title: "Quick start", url: DOC.quickStart };
const DOC_CODE = { title: "Build with a coding agent", url: DOC.codingAgent };

/** Best path + settings for this intent. Defaults are the docs defaults. */
export function recommendSettings(intent: Intent): SettingsPlan {
  const path = pickPath(intent);
  const useCase = intent.useCase || "general voice agent";
  const langs = intent.languages.length ? intent.languages : ["en"];
  const outbound = intent.direction === "outbound" || intent.direction === "both";
  const inbound = intent.direction === "inbound" || intent.direction === "both";
  const campaign = intent.scale === "campaign" || useCase === "outbound_sales";
  const supporty = useCase === "support" || useCase === "booking" || useCase === "ivr";
  const sensitive = useCase === "collections" || /health|hipaa|finance|bank|pii/.test(intent.notes.toLowerCase());
  const indic = langs.some((l) => ["hi", "ta", "te", "bn"].includes(l));
  const manyLangs = langs.length > 2 || langs.some((l) => !["en", "hi"].includes(l));

  const models: SettingPick[] = [];
  const required: SettingPick[] = [];
  const speech: SettingPick[] = [];
  const extras: SettingPick[] = [];
  const docs = [DOC_BUILD, DOC_SPEECH, DOC_PROMPT];

  if (path === "models_only") {
    models.push(modelPick(intent, indic, manyLangs, useCase));
    docs.push({ title: "Lightning TTS", url: DOC.lightning }, { title: "Pulse STT", url: DOC.pulse });
    return finish(path, intent, useCase, models, required, speech, extras, docs, [
      "Get an API key at " + DASH + "/dashboard/api-keys",
      useCase === "transcription" ? "Call Pulse: POST /waves/v1/stt/?model=pulse (or Pulse Pro for batch English)." : "Call Lightning v3.1: POST /waves/v1/lightning-v3.1/get_speech with a real voice_id from get_voices.",
      "For streaming agents use /waves/v1/tts/live (SSE/WSS) and wss://api.smallest.ai/waves/v1/stt/live?model=pulse.",
    ]);
  }

  if (mentionedIntegration(intent.notes) && path !== "own_stack" && path !== "models_only") {
    extras.push({
      name: "If you must keep your current stack",
      value: "Second path only — Lightning + Pulse in Pipecat or LiveKit. Start on Atoms unless you cannot move.",
      why: "Naming Pipecat/LiveKit is not a reason to skip Smallest's own agent stack.",
    });
  }

  if (path === "own_stack") {
    const orch = /livekit/.test(intent.notes.toLowerCase()) ? "livekit" : /pipecat/.test(intent.notes.toLowerCase()) ? "pipecat" : "pipecat_or_livekit";
    models.push(
      { name: "TTS", value: manyLangs ? "lightning_v3.1_pro" : "lightning_v3.1", why: "Current Waves TTS. Sub-100ms. Never Lightning v2.", default: "lightning_v3.1" },
      { name: "STT", value: "pulse", why: "Realtime STT, 38+ languages, word timestamps.", default: "pulse" },
      { name: "LLM", value: intent.customLlm ? "your OpenAI-compatible model" : "Electron at https://api.smallest.ai/waves/v1", why: "Electron drops into any OpenAI slot (base_url + key).", default: "electron" },
    );
    if (orch === "livekit") {
      docs.push({ title: "LiveKit", url: DOC.livekit });
    } else if (orch === "pipecat") {
      docs.push({ title: "Pipecat", url: DOC.pipecat });
    } else {
      docs.push({ title: "Pipecat", url: DOC.pipecat }, { title: "LiveKit", url: DOC.livekit });
    }
    return finish(path, intent, useCase, models, required, speech, extras, docs, ownStackSteps(orch));
  }

  const llm = pickLlm(intent, indic, supporty);
  models.push(
    { name: "Model (slm_model)", value: llm.value, why: llm.why, default: "electron" },
    { name: "TTS engine", value: manyLangs ? "Lightning v3.1 Pro" : "Lightning v3.1 (Waves)", why: "Hosted Atoms synthesizer. Preview a real voice_id before save.", default: "Lightning v3.1" },
    { name: "STT", value: "Pulse (platform)", why: "Platform listens with Pulse. No extra setup." },
  );

  required.push(
    { name: "Name", value: nameFor(useCase), why: "Internal label. Callers never hear it." },
    { name: "Prompt", value: "Role, flow, dos/don'ts, end conditions. Phone-short. One question at a time.", why: "Largest quality lever. Keep product facts in-prompt; big/changing docs in a KB." },
    { name: "Voice", value: voiceFor(intent, indic), why: "Must cover every supported language. Preview first.", default: "library preview" },
    { name: "Language", value: `default ${langs[0]}; supported ${langs.join(", ")}`, why: "Unlisted languages are not handled. API: language.default + language.supported." },
    { name: "First message", value: firstMessageFor(intent, useCase), why: "Spoken on pickup. Max 500 chars. Two sentences. Without it outbound feels broken." },
  );

  speech.push(
    { name: "Speech speed", value: speedFor(useCase), why: "Docs default 1.2x (0.5–2). Slow down for collections/wellness; keep 1.2 for support.", default: "1.2x" },
    { name: "Allow interruptions", value: intent.noisy ? "Off (half-duplex — noisy line)" : "On", why: "On unless agent-to-agent or very noisy. Docs default On.", default: "On" },
    { name: "Interruption backoff", value: outbound ? "1s" : "0s", why: "Grace period after the agent starts talking. Default 0s.", default: "0s" },
    { name: "Wait for user first", value: inbound && useCase === "ivr" ? "On" : "Off", why: "Only for inbound when the caller should state intent. Mutually exclusive with mute-until-first.", default: "Off" },
    { name: "Mute user until first bot response", value: outbound ? "On" : "Off", why: "Stops outbound 'hello?' from stepping on the opener.", default: "Off" },
    { name: "Smart turn detection", value: supporty && !intent.noisy ? "On (wait 3s)" : "Off", why: "Predicts end-of-utterance. Adds a little latency. English/Hindi only. Default Off.", default: "Off" },
    { name: "Voice detection confidence", value: intent.noisy ? "0.8" : "0.7", why: "Higher = less noise. Do not push below 0.1 or above 0.9.", default: "0.7" },
    { name: "Min volume / trigger / release", value: intent.noisy ? "0.7 / 0.25s / 0.5s" : "0.6 / 0.2s / 0.4s", why: "Docs defaults. Change one at a time on real calls.", default: "0.6 / 0.2s / 0.4s" },
    { name: "Denoising", value: intent.noisy || campaign ? "On" : "Off (platform may already enable when supported)", why: "Caller-side noise filter. Turn off only if it eats soft speech.", default: "Off in Speech tab; on by default when the model supports it" },
    { name: "Handle unrecognised speech", value: "On (keep built-in repeats)", why: "Asks the caller to repeat instead of going silent. Default On.", default: "On" },
    { name: "Voicemail detection", value: outbound ? "On + short end text" : "Off", why: "Essential for outbound at scale. Without it every mailbox eats the full prompt.", default: "Off" },
    { name: "PII redaction", value: sensitive ? "On" : "Off", why: "Redacts transcripts. Can hurt QA completeness. Default Off.", default: "Off" },
    { name: "Background sound", value: useCase === "collections" || useCase === "sales" ? "Office (light)" : "None", why: "Office / Cafe / Call Center / Static. Default None.", default: "None" },
    { name: "Speech formatting", value: langs.some((l) => l === "en" || l === "hi") ? "On" : "Off (English/Hindi only)", why: "Punctuation and entity formatting. Default On where supported.", default: "On" },
  );

  if (intent.channel === "phone" || !intent.channel) {
    extras.push({
      name: "Phone number",
      value: inbound && outbound ? "Rent/bring a number: Answers on (inbound) + Dials from (outbound)" : inbound ? "Attach under Answers on" : outbound ? "Caller ID under Dials from (or fromNumber per call)" : "Skip if web-only",
      why: "Inbound and outbound are separate attachments.",
    });
    docs.push({ title: "Phone numbers", url: DOC.phones });
  }
  if (intent.channel === "web" || useCase === "embed") {
    extras.push({ name: "Widget / Web SDK", value: "Embed the Atoms widget; API key stays on your server", why: "Web-call-only agents skip telephony." });
    docs.push({ title: "Widget", url: DOC.widget }, { title: "Agent Web SDK", url: DOC.webSdk });
  }
  if (intent.channel === "mobile") {
    extras.push({ name: "Mobile SDK", value: "React Native / iOS / Android / Flutter over raw WebSocket, PCM16", why: "See agent-sdk mobile cookbooks." });
  }
  if (intent.tools.includes("kb") || supporty || useCase === "booking") {
    extras.push({ name: "Knowledge base", value: "Ingest PDFs/URLs/text, attach globalKnowledgeBaseId", why: "Stops invented policies. Required for production support." });
    docs.push({ title: "Knowledge base", url: DOC.kb });
  }
  if (intent.tools.includes("crm") || intent.tools.includes("calendar") || intent.tools.includes("payment") || intent.tools.includes("transfer")) {
    extras.push({
      name: "Tools",
      value: intent.tools.filter((x) => x !== "kb" && x !== "voicemail").join(", ") || "API + transfer",
      why: "Org-level Tools library. CRM/calendar/Stripe via integrations; transfer and end_call are built-in.",
    });
    docs.push({ title: "Tools", url: DOC.tools });
  }
  if (campaign || outbound) {
    extras.push({ name: "Campaigns / CPS", value: "Audience list + timezone-aware campaign. Cap calls-per-second so the carrier is not overrun.", why: "Outbound at scale." });
    extras.push({ name: "Concurrency", value: "Reserve per-agent seats under the org limit", why: "Simultaneous live calls." });
    docs.push({ title: "Campaigns", url: DOC.campaigns });
  }
  extras.push({
    name: "Timeouts",
    value: useCase === "survey" || useCase === "support" ? "Session cap 30–45 min" : campaign ? "Lower session cap (stuck-call safety)" : "Default 1800s",
    why: "sessionTimeoutConfig.timeoutTimeInSecs default 1800s.",
  });
  extras.push({
    name: "LLM temperature (crew only)",
    value: supporty || useCase === "collections" ? "0.2–0.3" : useCase === "sales" || useCase === "outbound_sales" ? "0.7–0.8" : "0.5",
    why: "Crew OpenAIClient. Support wants consistent; sales can be warmer.",
  });
  extras.push({ name: "max_tokens (crew)", value: "100–200", why: "Shorter replies = faster audio." });
  extras.push({ name: "Publish + activate", value: "Publish draft → mark revision live", why: "Published-but-not-activated is why callers say nothing changed." });

  if (path === "atoms_crew") docs.push({ title: "Crew CLI", url: DOC.crew }, { title: "BYOM", url: DOC.byom }, { title: "LLM settings", url: DOC.llmSettings });
  docs.push({ title: "Use-case finder", url: DOC.useCases }, DOC_QUICK, DOC_CODE);

  const steps =
    path === "atoms_crew"
      ? [
          "pip install smallestai; set SMALLEST_API_KEY.",
          "smallestai agent-crew init — flat server.py + assistant.py. Point OpenAIClient at your model.",
          "Deploy: smallestai agent-crew deploy --entry-point server.py, then Make Live.",
          "Attach telephony if you want phone. Place a real test call.",
        ]
      : [
          "Open " + DASH + " → Create Agent → template closest to " + useCase + " (or scratch + Single Prompt).",
          "Fill the five required fields: name, prompt, voice, language, model = " + llm.value + ".",
          "Set first_message. Attach KB and tools that match this use case.",
          "Speech tab: apply the table below. Change one advanced knob at a time.",
          inbound || outbound ? "Telephony: rent or SIP a number; Answers on / Dials from." : "Skip phone. Ship the widget or Web SDK.",
          "Test Agent (web + interrupt + unexpected). Publish, then mark the revision live.",
          campaign ? "Create an audience + campaign. Turn voicemail detection on first." : "Optional: webhooks, post-call metrics, prompt scoring.",
        ];

  return finish(path, intent, useCase, models, required, speech, extras, docs, steps);
}

function finish(
  path: PathId,
  intent: Intent,
  useCase: string,
  models: SettingPick[],
  required: SettingPick[],
  speech: SettingPick[],
  extras: SettingPick[],
  docs: { title: string; url: string }[],
  implementation: string[],
): SettingsPlan {
  const firstMessage = firstMessageFor(intent, useCase);
  const summary = [
    pathLabel(path) + " for " + useCase + (intent.channel ? " on " + intent.channel : "") + ".",
    models[0] ? "Brain: " + models[0].value + "." : "",
    speech.find((s) => s.name === "Allow interruptions") ? "Interruptions " + speech.find((s) => s.name === "Allow interruptions")!.value + "." : "",
    "Pricing: " + PRICING + ".",
  ]
    .filter(Boolean)
    .join(" ");
  return { path, pathWhy: pathWhy(path, intent), useCase, models, required, speech, extras, firstMessage, implementation, docs: dedupeDocs(docs), summary };
}

function pickPath(intent: Intent): PathId {
  if (intent.channel === "own_stack" || intent.useCase === "self_host" || lockedOwnStack(intent.notes)) return "own_stack";
  if (intent.channel === "models" || intent.useCase === "transcription" || intent.useCase === "voice_clone") {
    return "models_only";
  }
  if (intent.useCase === "tts" && (intent.channel === "models" || /models? only|api only|no agent/.test(intent.notes.toLowerCase()))) {
    return "models_only";
  }
  if (intent.customLlm || /crew|multi.?agent|custom per-turn/.test(intent.notes.toLowerCase())) return "atoms_crew";
  return "atoms_standard";
}

function pickLlm(intent: Intent, indic: boolean, supporty: boolean): { value: string; why: string } {
  if (intent.customLlm) return { value: "crew + your OpenAI-compatible model", why: "Custom LLM or per-turn logic needs a crew, not the standard platform LLM." };
  if (/realtime|emotive|expressive/.test(intent.notes.toLowerCase())) {
    return { value: "GPT Realtime (emotive)", why: "Emotive models match caller tone. Higher credit use. Electron is still the voice default." };
  }
  if (indic) return { value: "electron", why: "Best Indic + voice-agent tool calling. Hosted Electron is Enterprise; otherwise GPT-4.1 and confirm." };
  if (supporty) return { value: "electron", why: "Docs: Electron is the overall best voice choice — lowest latency, stays on-prompt. Fallback GPT-4o/GPT-4.1." };
  return { value: "electron", why: "Default brain. Switch to GPT-4.1 only for a specific frontier need." };
}

function modelPick(intent: Intent, indic: boolean, manyLangs: boolean, useCase: string): SettingPick {
  if (useCase === "transcription") return { name: "STT", value: "pulse" + (intent.scale === "production" ? " (or Pulse Pro for batch English)" : ""), why: MODELS_STT };
  if (useCase === "speech_to_speech") return { name: "S2S", value: "hydra", why: "Full-duplex audio in/out. Beta." };
  if (useCase === "voice_clone") return { name: "TTS + clone", value: "Lightning v3.1 + instant clone", why: "Clone from a short sample, then synthesize." };
  return { name: "TTS", value: manyLangs || indic ? "lightning_v3.1_pro" : "lightning_v3.1", why: "Current TTS. 70+ languages on Pro." };
}

const MODELS_STT = "Pulse is current STT. Pulse Pro is pre-recorded English accuracy.";

function speedFor(useCase: string): string {
  if (useCase === "collections" || useCase === "survey") return "1.0x";
  if (useCase === "ivr") return "1.3x";
  return "1.2x";
}

function voiceFor(intent: Intent, indic: boolean): string {
  if (indic) return "Indic-capable library voice (e.g. aarush for Hindi + Indian English) — confirm via get_voices";
  if (intent.useCase === "collections") return "Calm, low-energy library voice — preview before save";
  if (intent.useCase === "sales" || intent.useCase === "outbound_sales") return "Warm, clear library voice (e.g. quinn / rachel) — preview first";
  return "Professional library voice (e.g. zorin) that covers every supported language";
}

function nameFor(useCase: string): string {
  const map: Record<string, string> = {
    support: "Support inbound",
    outbound_sales: "Outbound sales",
    sales: "Sales qualifier",
    collections: "Collections",
    booking: "Booking",
    survey: "Survey",
    ivr: "Inbound router",
    embed: "Site voice",
  };
  return map[useCase] || "Voice agent";
}

function firstMessageFor(intent: Intent, useCase: string): string {
  const lang = intent.languages[0] === "hi" ? "Hindi or English, matching the caller" : "the default language";
  if (intent.direction === "outbound" || useCase === "outbound_sales") {
    return `Hi, this is {{agent_name}} from {{company}}. I'm calling about {{reason}} — is now a bad time? (${lang}, two sentences.)`;
  }
  if (useCase === "booking") return "Hi, you've reached {{company}} scheduling. What day works for you?";
  if (useCase === "collections") return "Hi, this is {{agent_name}} from {{company}} about your account. Can you confirm I'm speaking with {{customer_name}}?";
  if (useCase === "ivr") return "";
  return "Hi, you've reached {{company}}. How can I help today?";
}

function pathLabel(path: PathId): string {
  if (path === "atoms_crew") return "Atoms crew (custom LLM)";
  if (path === "own_stack") return "Own stack + Smallest models";
  if (path === "models_only") return "Models API only";
  return "Atoms standard (platform LLM)";
}

function pathWhy(path: PathId, intent: Intent): string {
  if (path === "atoms_crew") return "Custom LLM or per-turn logic on Atoms. Standard Atoms agents go live faster — crew only when you need it.";
  if (path === "own_stack") {
    return "You asked to keep your orchestrator. Atoms is still the default Smallest path; this is the exception — Lightning + Pulse in that stack.";
  }
  if (path === "models_only") return "You asked for a models API, not a conversation agent.";
  if (mentionedIntegration(intent.notes)) {
    return "Smallest's own agent stack (Atoms) first. You mentioned another orchestrator — use it only if you must keep that pipeline.";
  }
  return intent.channel === "web"
    ? "Atoms first: dashboard template + widget. Fastest way to a working Smallest agent."
    : "Atoms first: dashboard or SDK create_agent, then a real test call. Best-practice speech settings live here.";
}

function ownStackSteps(orch: string): string[] {
  const preface = "Confirm you must keep this stack. Otherwise create the agent on Atoms — phone, widget, and speech settings are already there.";
  if (orch === "livekit") {
    return [
      preface,
      'pip install "livekit-agents[smallestai]"',
      'AgentSession(stt=smallestai.STT(), tts=smallestai.TTS(model="lightning_v3.1"), llm=...)',
      "Pull real voice_ids via get_voices. Guide: " + DOC.livekit,
    ];
  }
  if (orch === "pipecat") {
    return [
      preface,
      'pip install "pipecat-ai[smallest]"  # SmallestTTSService + SmallestSTTService',
      "Do not hand-roll the Waves WebSocket.",
      "Guide: " + DOC.pipecat,
    ];
  }
  return [
    preface,
    "If you stay: Pipecat or LiveKit official plugins, or standalone Waves SDK.",
    'Pipecat: pip install "pipecat-ai[smallest]". LiveKit: pip install "livekit-agents[smallestai]".',
    "TTS lightning_v3.1, STT pulse, LLM Electron or yours. Confirm voice_ids against live docs.",
  ];
}

function dedupeDocs(docs: { title: string; url: string }[]): { title: string; url: string }[] {
  const seen = new Set<string>();
  const out: { title: string; url: string }[] = [];
  for (const d of docs) {
    if (seen.has(d.url)) continue;
    seen.add(d.url);
    out.push(d);
  }
  return out;
}
