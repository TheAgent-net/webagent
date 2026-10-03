import type { Harness } from "../../src/harness.ts";
import type { Run } from "../../src/run.ts";
import type { PackRuntime } from "../../src/pack/types.ts";
import type { Tool } from "../../src/tools.ts";
import {
  enoughIntent,
  inferIntent,
  isGreeting,
  isInfoQuestion,
  mentionedOtherStack,
  mergeIntent,
  nextQuestion,
  stillExploring,
  type MemoryIntent,
  type Persist,
  type Residency,
  type Who,
} from "./intent.ts";
import { planText, recommendPath } from "./recommend.ts";

/** Add the setup tools. The rules for when to call them live in instruction.md. */
export function attach(h: Harness, run: Run, _runtime: PackRuntime): void {
  const capture = captureIntentTool();
  const rec = recommendPathTool();
  h.addTool(capture);
  h.addTool(rec);
  run.useTool(capture);
  run.useTool(rec);
}

export function captureIntentTool(): Tool {
  return {
    name: "capture_intent",
    description:
      "Merge what the visitor said into a structured SuperMemory intent and return the single next question, or enough=true.",
    schema: {
      type: "object",
      properties: {
        said: { type: "string" },
        use_case: { type: "string" },
        who: { type: "string" },
        persist: { type: "string" },
        residency: { type: "string" },
        stack: { type: "string" },
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
          hint: "They asked about SuperMemory. Call docs_lookup and answer. Do not interview. Do not ask next_question.",
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
          ? mentionedOtherStack(intent.notes)
            ? "Enough. Call recommend_path. Path must be hosted SuperMemory first. Treat Mem0/Pinecone/LangChain as a footnote only if they must keep that stack."
            : "Call recommend_path now with these fields. Do not ask another question."
          : isGreeting(said) || isGreeting(intent.notes)
            ? "Greeting. Two short sentences on how you can help, then ask next_question. Do not name products."
            : mentionedOtherStack(intent.notes)
              ? "They named another stack. Do not start there. Offer hosted SuperMemory as the first way, then ask only next_question."
              : "Ask only next_question. Reflect one thing they said. Do not dump a catalog.",
      };
    },
  };
}

export function recommendPathTool(): Tool {
  return {
    name: "recommend_path",
    description:
      "Return the best SuperMemory path (hosted API, plugin/MCP, or self-host) and the exact next steps. Call once intent is enough.",
    schema: {
      type: "object",
      properties: {
        use_case: { type: "string" },
        who: { type: "string" },
        persist: { type: "string" },
        residency: { type: "string" },
        stack: { type: "string" },
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
      const plan = recommendPath(intent);
      return { ...plan, enough: true, report: planText(plan) };
    },
  };
}

function fromArgs(args: Record<string, unknown>): Partial<MemoryIntent> {
  return {
    useCase: str(args.use_case),
    who: asWho(str(args.who)),
    persist: asPersist(str(args.persist)),
    residency: asResidency(str(args.residency)),
    stack: str(args.stack),
    notes: str(args.notes) || str(args.said) || "",
  };
}

function str(v: unknown): string | undefined {
  if (typeof v !== "string") return undefined;
  const s = v.trim();
  return s || undefined;
}

function asWho(v?: string): Who | undefined {
  if (!v) return undefined;
  const t = v.toLowerCase();
  if (t.includes("tenant") || t.includes("customer")) return "tenant";
  if (t.includes("project") || t.includes("workspace")) return "project";
  if (t.includes("user")) return "user";
  return undefined;
}

function asPersist(v?: string): Persist | undefined {
  if (!v) return undefined;
  const t = v.toLowerCase();
  if (t.includes("both")) return "both";
  if (t.includes("doc") || t.includes("rag") || t.includes("pdf")) return "docs";
  if (t.includes("mem") || t.includes("pref")) return "memory";
  return undefined;
}

function asResidency(v?: string): Residency | undefined {
  if (!v) return undefined;
  const t = v.toLowerCase();
  if (/\b(local|on-?prem|air-?gap|vpc|cannot leave)\b/.test(t)) return "must_stay_local";
  if (/\b(hosted|cloud|api)\b/.test(t)) return "hosted";
  return undefined;
}
