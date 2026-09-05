/**
 * Cursor SDK as a Model control. The loop stays generic.
 * One-shot Agent.prompt per reason step. Cursor tools stay empty.
 */
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { Assembler } from "./assembler.ts";
import type { Model, ModelRequest } from "./models.ts";

export interface CursorCall {
  ms: number;
  text: string;
  usage?: { inputTokens?: number; outputTokens?: number; totalTokens?: number };
  error?: string;
}

export interface CursorOpts {
  id?: string;
  model?: string;
  apiKeyEnv?: string;
  onCall?: (call: CursorCall) => void;
}

export function cursorModel(opts: CursorOpts = {}): Model {
  const envName = opts.apiKeyEnv ?? "CURSOR_API_KEY";
  const key = process.env[envName] ?? "";
  const modelId = opts.model ?? process.env.CURSOR_MODEL ?? "composer-2.5";
  let cwd = "";

  return {
    id: opts.id ?? "cursor",
    ready: Boolean(key),
    reasonNotReady: key ? undefined : "missing " + envName,
    supportsTools: true,
    supportsStream: false,
    async reason(req, out, signal) {
      if (!key) throw new Error("model not ready: missing " + envName);
      if (!cwd) cwd = mkdtempSync(join(tmpdir(), "webagent-cursor-"));
      const t0 = Date.now();
      try {
        const Agent = await loadAgent();
        const result = (await Agent.prompt(buildPrompt(req), {
          apiKey: key,
          model: { id: modelId },
          local: { cwd },
          tools: [],
        })) as CursorResult;
        if (signal?.aborted) throw new Error("aborted");
        if (result.status === "error") throw new Error(result.error?.message ?? "cursor error");
        const text = result.result ?? "";
        applyReply(text, out);
        opts.onCall?.({
          ms: result.durationMs ?? Date.now() - t0,
          text,
          usage: result.usage,
        });
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        opts.onCall?.({ ms: Date.now() - t0, text: "", error: msg });
        throw e;
      }
    },
  };
}

interface CursorResult {
  status?: string;
  result?: string;
  durationMs?: number;
  usage?: { inputTokens?: number; outputTokens?: number; totalTokens?: number };
  error?: { message?: string };
}

type AgentCtor = {
  prompt: (message: string, options: Record<string, unknown>) => Promise<unknown>;
};

async function loadAgent(): Promise<AgentCtor> {
  try {
    const mod = (await import("@cursor/sdk")) as { Agent: AgentCtor };
    return mod.Agent;
  } catch {
    const mod = (await import("@cursor/sdk/bundled")) as { Agent: AgentCtor };
    return mod.Agent;
  }
}

function buildPrompt(req: ModelRequest): string {
  return [
    "You are the language model for one webagent reason step.",
    "Reply with JSON only. No markdown.",
    'Shape: {"content":"string","tool_calls":[{"id":"c1","name":"tool","arguments":{}}]}',
    "If you can answer, set tool_calls to [].",
    "Do not use a shell. Do not edit files. Produce only this JSON.",
    "",
    "Tools:",
    JSON.stringify(req.tools),
    "",
    "Messages:",
    JSON.stringify(req.messages),
  ].join("\n");
}

/** Map a Cursor reply onto the assembler. Parse JSON here only for the Cursor envelope. */
export function applyReply(raw: string, out: Assembler): void {
  const parsed = readJson(raw);
  if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
    const obj = parsed as Record<string, unknown>;
    const content = typeof obj.content === "string" ? obj.content : "";
    const calls = obj.tool_calls ?? obj.toolCalls;
    if (content || Array.isArray(calls)) {
      if (content) out.pushText(content);
      if (Array.isArray(calls)) pushCalls(calls, out);
      return;
    }
  }
  out.pushText(raw);
}

function pushCalls(calls: unknown[], out: Assembler): void {
  for (let i = 0; i < calls.length; i++) {
    const tc = calls[i];
    if (!tc || typeof tc !== "object") continue;
    const rec = tc as Record<string, unknown>;
    const fn = rec.function && typeof rec.function === "object" ? (rec.function as Record<string, unknown>) : undefined;
    const name = String(rec.name ?? fn?.name ?? "");
    if (!name) continue;
    const id = String(rec.id ?? "c" + i);
    const rawArgs = rec.arguments ?? fn?.arguments;
    const args = typeof rawArgs === "string" ? rawArgs : JSON.stringify(rawArgs ?? {});
    out.pushToolDelta(i, id, name, args);
  }
}

function readJson(raw: string): unknown {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const fence = /```(?:json)?\s*([\s\S]*?)```/i.exec(trimmed);
  const body = fence ? fence[1]!.trim() : trimmed;
  const start = body.indexOf("{");
  const end = body.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(body.slice(start, end + 1));
  } catch {
    return null;
  }
}
