import type { Harness } from "../harness.ts";
import type { Run } from "../run.ts";
import { attachPack } from "../site/attach.ts";
import type { Tool } from "../tools.ts";
import { enoughIntent, inferIntent, isGreeting, isInfoQuestion, lockedOwnStack, mentionedIntegration, mergeIntent, nextQuestion, stillExploring } from "./intent.ts";
import { defaultQueryEmbed, type EmbedFn } from "./embed.ts";
import { smallestInstruction } from "./prompt.ts";
import { expandQuery, searchDocs, searchDocsHybrid } from "./retrieve.ts";
import { recommendSettings } from "./settings.ts";
import type { Channel, Direction, DocKind, Intent, Scale, SmallestPack } from "./types.ts";

export function attachSmallest(h: Harness, pack: SmallestPack, opts?: { model?: string }): Run {
  const run = attachPack(h, pack.site, { model: opts?.model, instruction: smallestInstruction(pack) });
  const capture = captureIntentTool();
  const rec = recommendSettingsTool();
  const docs = docsLookupTool(pack);
  h.addTool(capture);
  h.addTool(rec);
  h.addTool(docs);
  run.useTool(capture);
  run.useTool(rec);
  run.useTool(docs);
  run.inject({
    vars: [
      "You are the Smallest assistant. Lead with Smallest's own agent stack (Atoms).",
      "If they asked about Smallest, answer it. Do not start a use-case interview on a product question.",
      "Explore the visitor first when they want a setup. Do not dump products or a company brief.",
      "Greeting only: two short sentences on how you can help, then one open question about them.",
      "If they mention Pipecat or LiveKit, do not start there. Atoms first. That stack is only if they must keep it.",
      "Docs at " + pack.docsOrigin + ". Retrieval: " + (pack.retrieval?.mode ?? "lexical") + ", " + (pack.chunks?.length ?? 0) + " chunks. docs_lookup Atoms/platform first.",
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
      const said = String(args.said ?? "");
      const inferred = inferIntent(said);
      const patch = fromArgs(args);
      if (stillExploring(inferred.notes) && !inferred.useCase) delete patch.useCase;
      const intent = mergeIntent(inferred, patch);
      if (isInfoQuestion(said) || isInfoQuestion(intent.notes)) {
        return {
          intent,
          enough: false,
          mode: "answer",
          next_question: null,
          hint: "They asked about Smallest. Call docs_lookup and answer. Do not interview. Do not ask next_question.",
        };
      }
      const next = nextQuestion(intent);
      const enough = enoughIntent(intent);
      return {
        intent,
        enough,
        mode: enough ? "plan" : "discover",
        next_question: next,
        hint: enough
          ? mentionedIntegration(intent.notes) && !lockedOwnStack(intent.notes)
            ? "Enough. Call recommend_settings. Path must be Atoms first. Treat Pipecat/LiveKit as a footnote only if they must keep that pipeline."
            : "Call recommend_settings now with these fields. Do not ask another question."
          : isGreeting(said) || isGreeting(intent.notes)
            ? "Greeting. Two short sentences on how you can help, then ask next_question. Do not name products."
            : mentionedIntegration(intent.notes) && !lockedOwnStack(intent.notes)
              ? "They named another stack. Do not start there. Offer Smallest's own agent (Atoms) as the first way, then ask only next_question."
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
      const inferred = inferIntent(String(args.notes ?? args.use_case ?? ""));
      const patch = fromArgs(args);
      if (stillExploring(inferred.notes) && !inferred.useCase) delete patch.useCase;
      const intent = mergeIntent(inferred, patch);
      if (!intent.notes) intent.notes = String(args.notes ?? "");
      if (!enoughIntent(intent)) {
        const next = nextQuestion(intent);
        return {
          enough: false,
          next_question: next,
          hint: "Not enough yet. Ask next_question. Do not write the plan or name products they did not mention.",
        };
      }
      const plan = recommendSettings(intent);
      return { ...plan, enough: true, report: planText(plan) };
    },
  };
}

export function docsLookupTool(pack: SmallestPack): Tool {
  return {
    name: "docs_lookup",
    description:
      "Hybrid search over crawled smallest.ai + docs.smallest.ai (BM25 + embeddings when available). Returns the best sections with URLs. Use for a quote, setting, or implementation detail. Not on greetings.",
    schema: {
      type: "object",
      properties: {
        query: { type: "string" },
        focus: { type: "string", description: "model | platform | integration | guide | any" },
      },
      required: ["query"],
    },
    async call(args) {
      const query = String(args.query ?? "").trim();
      const focus = asFocus(args.focus);
      const hybrid = (pack.chunks ?? []).some((c) => c.vector?.length);
      const hits = hybrid
        ? await searchDocsHybrid(pack, query, packEmbedder(pack), { focus, limit: 4 })
        : searchDocs(pack, query, { focus, limit: 4 });
      return {
        query,
        expanded: expandQuery(query),
        hits,
        source: hybrid ? "hybrid" : "lexical",
        model: pack.retrieval?.model,
        hint: hits.length
          ? "Prefer an Atoms/platform URL. Cite an integration URL only if they must keep that stack. Quote only the snippets."
          : "No matching page in the pack. Do not invent a URL or setting.",
      };
    },
  };
}

function packEmbedder(pack: SmallestPack): EmbedFn | undefined {
  if (pack.embedQuery) return pack.embedQuery;
  if (pack.retrieval?.mode !== "hybrid") return undefined;
  return defaultQueryEmbed();
}

function asFocus(v: unknown): DocKind | "any" | undefined {
  if (typeof v !== "string") return undefined;
  const t = v.toLowerCase().trim();
  if (t === "model" || t === "platform" || t === "integration" || t === "guide" || t === "any") return t;
  return undefined;
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
  if (t.includes("own") && (t.includes("stack") || t.includes("pipeline"))) return "own_stack";
  if (/\b(keep|stay|must).{0,24}(pipecat|livekit)\b/.test(t)) return "own_stack";
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
