import type { Harness } from "../harness.ts";
import type { Run } from "../run.ts";
import { attachPack } from "../site/attach.ts";
import type { Tool } from "../tools.ts";
import { enoughIntent, inferIntent, isGreeting, mergeIntent, nextQuestion, emptyIntent } from "./intent.ts";
import { smallestInstruction } from "./prompt.ts";
import { recommendSettings } from "./settings.ts";
import type { Channel, Direction, Intent, Scale, SmallestPack } from "./types.ts";

export function attachSmallest(h: Harness, pack: SmallestPack, opts?: { model?: string }): Run {
  const run = attachPack(h, pack.site, { model: opts?.model, instruction: smallestInstruction(pack) });
  const capture = captureIntentTool();
  const rec = recommendSettingsTool();
  h.addTool(capture);
  h.addTool(rec);
  run.useTool(capture);
  run.useTool(rec);
  run.inject({
    vars: [
      "Explore the visitor first. Do not dump products, models, or a company brief.",
      "First turn: two short sentences on how you can help, then one open question about them.",
      "Name a Smallest path only after it matches what they said.",
      "Docs at " + pack.docsOrigin + ". " + pack.docs.length + " doc pages in the pack — look them up after you know what they need.",
    ].join("\n"),
  });
  return run;
}

export function captureIntentTool(): Tool {
  return {
    name: "capture_intent",
    description:
      "Merge what the visitor said into a structured intent and return the single next question, or enough=true.",
    schema: {
      type: "object",
      properties: {
        said: { type: "string" },
        use_case: { type: "string" },
        channel: { type: "string" },
        direction: { type: "string" },
        languages: { type: "string" },
        custom_llm: { type: "boolean" },
        noisy: { type: "boolean" },
        scale: { type: "string" },
        tools: { type: "string" },
      },
      required: ["said"],
    },
    async call(args) {
      const inferred = inferIntent(String(args.said ?? ""));
      const patch = fromArgs(args);
      const intent = mergeIntent(inferred, patch);
      const next = nextQuestion(intent);
      const enough = enoughIntent(intent);
      return {
        intent,
        enough,
        next_question: next,
        hint: enough
          ? "Call recommend_settings now with these fields. Do not ask another question."
          : isGreeting(String(args.said ?? "")) || isGreeting(intent.notes)
            ? "Greeting. Two short sentences on how you can help, then ask next_question. Do not name products."
            : "Ask only next_question. Reflect one thing they said. Do not dump a catalog.",
      };
    },
  };
}

export function recommendSettingsTool(): Tool {
  return {
    name: "recommend_settings",
    description:
      "Return the best Smallest path and the exact agent/model settings for this use case. Call once intent is enough.",
    schema: {
      type: "object",
      properties: {
        use_case: { type: "string" },
        channel: { type: "string" },
        direction: { type: "string" },
        languages: { type: "string" },
        custom_llm: { type: "boolean" },
        noisy: { type: "boolean" },
        scale: { type: "string" },
        tools: { type: "string" },
        notes: { type: "string" },
      },
      required: ["use_case"],
    },
    async call(args) {
      const intent = mergeIntent(emptyIntent(), fromArgs(args));
      if (!intent.useCase) intent.useCase = String(args.use_case ?? "support");
      if (!intent.notes) intent.notes = String(args.notes ?? "");
      const plan = recommendSettings(intent);
      return { ...plan, report: planText(plan) };
    },
  };
}

function fromArgs(args: Record<string, unknown>): Partial<Intent> {
  const languages = split(args.languages);
  const tools = split(args.tools);
  return {
    useCase: str(args.use_case),
    channel: asChannel(str(args.channel)),
    direction: asDirection(str(args.direction)),
    languages,
    customLlm: typeof args.custom_llm === "boolean" ? args.custom_llm : undefined,
    noisy: typeof args.noisy === "boolean" ? args.noisy : undefined,
    scale: asScale(str(args.scale)),
    tools,
    notes: str(args.notes) || str(args.said) || "",
  };
}

function planText(plan: ReturnType<typeof recommendSettings>): string {
  const lines = [
    "For you: " + plan.useCase,
    "Path: " + plan.path + " — " + plan.pathWhy,
    "Settings:",
    ...[...plan.models, ...plan.required, ...plan.speech, ...plan.extras].slice(0, 16).map((s) => `- ${s.name}: ${s.value} (${s.why})`),
    "Do this next:",
    ...plan.implementation.map((s, i) => `${i + 1}. ${s}`),
    plan.docs[0] ? "Doc: " + plan.docs[0].url : "",
  ];
  return lines.filter(Boolean).join("\n");
}

function split(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(String).map((s) => s.trim()).filter(Boolean);
  if (typeof v === "string") return v.split(/[,|]/).map((s) => s.trim()).filter(Boolean);
  return [];
}

function str(v: unknown): string | undefined {
  if (typeof v !== "string") return undefined;
  const s = v.trim();
  return s || undefined;
}

function asChannel(v?: string): Channel | undefined {
  if (!v) return undefined;
  const t = v.toLowerCase();
  if (t.includes("own") || t.includes("pipecat") || t.includes("livekit")) return "own_stack";
  if (t.includes("model")) return "models";
  if (t.includes("mobile") || t.includes("ios") || t.includes("android")) return "mobile";
  if (t.includes("web") || t.includes("widget")) return "web";
  if (t.includes("phone") || t.includes("tel")) return "phone";
  return undefined;
}

function asDirection(v?: string): Direction | undefined {
  if (!v) return undefined;
  const t = v.toLowerCase();
  if (t === "both") return "both";
  if (t.includes("out")) return "outbound";
  if (t.includes("in")) return "inbound";
  if (t.includes("none")) return "none";
  return undefined;
}

function asScale(v?: string): Scale | undefined {
  if (!v) return undefined;
  const t = v.toLowerCase();
  if (t.includes("campaign") || t.includes("bulk")) return "campaign";
  if (t.includes("prod") || t.includes("live")) return "production";
  if (t.includes("proto") || t.includes("test")) return "prototype";
  return undefined;
}
