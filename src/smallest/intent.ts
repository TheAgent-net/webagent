import type { Channel, Direction, Intent, Scale } from "./types.ts";

export function emptyIntent(): Intent {
  return { languages: [], tools: [], notes: "" };
}

export function mergeIntent(base: Intent, patch: Partial<Intent>): Intent {
  return {
    useCase: patch.useCase || base.useCase,
    channel: patch.channel || base.channel,
    direction: patch.direction || base.direction,
    languages: uniq([...(base.languages ?? []), ...(patch.languages ?? [])]),
    customLlm: patch.customLlm ?? base.customLlm,
    noisy: patch.noisy ?? base.noisy,
    scale: patch.scale || base.scale,
    tools: uniq([...(base.tools ?? []), ...(patch.tools ?? [])]),
    notes: [base.notes, patch.notes].filter(Boolean).join(" ").trim(),
  };
}

/** Pull a structured intent out of free text. Safe to call every turn. */
export function inferIntent(text: string, prior: Intent = emptyIntent()): Intent {
  const t = text.toLowerCase();
  const patch: Partial<Intent> = { notes: text.trim(), languages: langsFrom(t), tools: toolsFrom(t) };

  const use = useCaseFrom(t);
  if (use) patch.useCase = use;

  const channel = channelFrom(t);
  if (channel) patch.channel = channel;

  const dir = directionFrom(t);
  if (dir) patch.direction = dir;

  if (/own (llm|model)|custom (llm|model)|byom|bring your own|crew|groq|together\.ai|openrouter/.test(t)) {
    patch.customLlm = true;
  } else if (/standard agent|dashboard|single prompt|template|no code|platform llm/.test(t)) {
    patch.customLlm = false;
  }

  if (/noisy|call.?center|warehouse|factory floor|background (noise|sound)/.test(t)) patch.noisy = true;
  if (/quiet|headset|office/.test(t)) patch.noisy = false;

  const scale = scaleFrom(t);
  if (scale) patch.scale = scale;

  const merged = mergeIntent(prior, patch);
  if (merged.channel === "phone" && !merged.direction && /campaign|dial|we call/.test(t)) {
    merged.direction = "outbound";
  }
  if ((merged.channel === "web" || merged.channel === "mobile" || merged.channel === "models") && !merged.direction) {
    merged.direction = "none";
  }
  if (!merged.languages.length && merged.useCase) merged.languages = ["en"];
  return merged;
}

export function missingFields(intent: Intent): string[] {
  const miss: string[] = [];
  if (!intent.useCase) miss.push("useCase");
  if (!intent.channel) miss.push("channel");
  if (intent.channel === "phone" && !intent.direction) miss.push("direction");
  if (intent.channel === "own_stack" && intent.customLlm === undefined) {
    /* orchestrator is enough; LLM default Electron */
  }
  if (intent.channel === "phone" && intent.customLlm === undefined && /complex|multi.?agent|own llm/.test(intent.notes.toLowerCase())) {
    miss.push("customLlm");
  }
  return miss;
}

export function enoughIntent(intent: Intent): boolean {
  return missingFields(intent).length === 0;
}

/** One question. Never dump a form. */
export function nextQuestion(intent: Intent): string | null {
  const miss = missingFields(intent);
  if (!miss.length) return null;
  const field = miss[0]!;
  if (field === "useCase") {
    return "What should the agent do — support, outbound sales, bookings, collections, or something else?";
  }
  if (field === "channel") {
    return `For ${intent.useCase || "this"}, do you want a phone number, a website/widget, a mobile app, or Smallest models inside your own stack (Pipecat/LiveKit)?`;
  }
  if (field === "direction") {
    return "Should customers call in, should the agent dial out, or both?";
  }
  if (field === "customLlm") {
    return "Is the platform LLM (Electron / GPT-4.1) enough, or do you need your own model and custom per-turn logic?";
  }
  return null;
}

function useCaseFrom(t: string): string | undefined {
  if (/collect|debt|dunn|recovery/.test(t)) return "collections";
  if (/book|appoint|schedul|calendar|reserv/.test(t)) return "booking";
  if (/survey|research|nps|feedback/.test(t)) return "survey";
  if (/ivr|rout(e|ing)|triage/.test(t)) return "ivr";
  if (/transcri|dictat|caption|stt|pulse/.test(t) && !/agent|phone|call/.test(t)) return "transcription";
  if (/(clone|cloned) voice|voice clone/.test(t)) return "voice_clone";
  if (/campaign|outbound sales|lead gen|cold call/.test(t)) return "outbound_sales";
  if (/sales|demo book|qualifier/.test(t)) return "sales";
  if (/hydra|speech.?to.?speech|s2s/.test(t)) return "speech_to_speech";
  if (/(just |only )?(tts|text to speech|lightning)/.test(t) && !/agent|sales|outbound|support/.test(t)) return "tts";
  if (/self.?host|on.?prem/.test(t)) return "self_host";
  if (/support|help ?desk|customer service|faq|inbound/.test(t)) return "support";
  if (/embed|widget|website agent/.test(t)) return "embed";
  if (/voice agent|phone agent|ai agent/.test(t)) return "support";
  return undefined;
}

function channelFrom(t: string): Channel | undefined {
  if (/pipecat|livekit|agora|ten framework|own stack|own pipeline/.test(t)) return "own_stack";
  if (/react native|ios|swift|android|kotlin|flutter|mobile app/.test(t)) return "mobile";
  if (/widget|web sdk|embed|website|browser/.test(t) && !/phone|inbound|outbound/.test(t)) return "web";
  if (/just (tts|stt|api)|models? only|transcri(be|ption) api/.test(t)) return "models";
  if (/phone|telephony|number|inbound|outbound|sip|twilio|campaign/.test(t)) return "phone";
  return undefined;
}

function directionFrom(t: string): Direction | undefined {
  if (/\bboth\b|inbound and outbound|in and out/.test(t)) return "both";
  if (/outbound|we call|dial|campaign|cold call/.test(t)) return "outbound";
  if (/inbound|they call|customers call|call in/.test(t)) return "inbound";
  if (/no phone|web only|no (calls|telephony)/.test(t)) return "none";
  return undefined;
}

function scaleFrom(t: string): Scale | undefined {
  if (/campaign|bulk|thousand|10k|scale out/.test(t)) return "campaign";
  if (/production|go live|live traffic/.test(t)) return "production";
  if (/prototype|poc|try|test|sandbox/.test(t)) return "prototype";
  return undefined;
}

function langsFrom(t: string): string[] {
  const map: [RegExp, string][] = [
    [/\bhindi\b|\bhi\b/, "hi"],
    [/\bspanish\b|\bespañol\b|\bes\b/, "es"],
    [/\bfrench\b|\bfr\b/, "fr"],
    [/\bgerman\b|\bde\b/, "de"],
    [/\bportuguese\b|\bpt\b/, "pt"],
    [/\btamil\b/, "ta"],
    [/\btelugu\b/, "te"],
    [/\bbengali\b|\bbangla\b/, "bn"],
    [/\benglish\b|\ben\b/, "en"],
    [/\bindic\b|indian english/, "hi"],
  ];
  const out: string[] = [];
  for (const [re, code] of map) if (re.test(t)) out.push(code);
  return uniq(out);
}

function toolsFrom(t: string): string[] {
  const out: string[] = [];
  if (/knowledge|faq|pdf|docs|policy/.test(t)) out.push("kb");
  if (/hubspot|salesforce|pipedrive|crm|zendesk/.test(t)) out.push("crm");
  if (/calendar|calendly|outlook|google cal/.test(t)) out.push("calendar");
  if (/transfer|human|escalate|handoff/.test(t)) out.push("transfer");
  if (/stripe|payment|pay/.test(t)) out.push("payment");
  if (/voicemail/.test(t)) out.push("voicemail");
  if (/dtmf|keypad|press [0-9]/.test(t)) out.push("dtmf");
  if (/webhook/.test(t)) out.push("webhooks");
  return uniq(out);
}

function uniq(xs: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const x of xs) {
    const k = x.toLowerCase();
    if (!k || seen.has(k)) continue;
    seen.add(k);
    out.push(x);
  }
  return out;
}
