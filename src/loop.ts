import { Assembler, type ToolCall } from "./assembler.ts";
import type { Context } from "./context.ts";
import { decide, type HookBag } from "./hooks.ts";
import type { Model, ModelShelf } from "./models.ts";
import { blockedAction } from "./policy.ts";
import type { Tool } from "./tools.ts";
import { CANCELLED, PHASE_IDLE, PHASE_REASON, PHASE_TOOL, STOPPED } from "./state.ts";

export interface PendingBatch {
  text: string;
  calls: ToolCall[];
  results: (Record<string, unknown> | null)[];
  /** Index of a tool.call that has not settled yet, or -1. */
  busy: number;
}

export interface LoopHost {
  id: string;
  context: Context;
  modelId: string | null;
  tools: Tool[];
  phase: number;
  state: number;
  hooks: HookBag;
  ac: AbortController;
  pending: PendingBatch | null;
  setPhase(p: number): void;
}

/** Write the assistant tool_calls frame and one result per call. Safe to call twice. */
export function commitPending(host: LoopHost, fallback: string | null): void {
  const p = host.pending;
  if (!p) return;
  host.pending = null;
  host.context.append({ role: "assistant", content: p.text, toolCalls: p.calls });
  const stub = fallback
    ? { error: fallback === "stopped" ? "stopped" : "tool_error", reason: fallback }
    : { error: "tool_error", reason: "missing" };
  for (let i = 0; i < p.calls.length; i++) {
    const result = p.results[i] ?? stub;
    host.context.append({ role: "tool", content: JSON.stringify(result), toolCallId: p.calls[i]!.id });
  }
}

export async function oneStep(host: LoopHost, models: ModelShelf): Promise<{ text: string; stopped?: boolean }> {
  if (isClosed(host)) return { text: "", stopped: true };
  let modelId = host.modelId;
  const verdict = await decide(host.hooks.beforeReason, host.id, modelId);
  if (isClosed(host)) return { text: "", stopped: true };
  if (verdict === "deny") return { text: "", stopped: true };
  if (typeof verdict === "object" && verdict.redirect.model) modelId = verdict.redirect.model;

  if (!modelId) throw new Error("no model bound");
  const model: Model | undefined = models.get(modelId);
  if (!model) throw new Error("unknown model " + modelId);
  if (model.ready === false) throw new Error("model not ready: " + (model.reasonNotReady ?? modelId));
  if (isClosed(host)) return { text: "", stopped: true };

  host.setPhase(PHASE_REASON);
  const assembler = new Assembler();
  const onToken = host.hooks.onToken;
  const wrapped = onToken
    ? tokenTee(assembler, (c) => onToken(host.id, c))
    : assembler;

  const toolDesc = host.tools.map((t) => ({ name: t.name, description: t.description, schema: t.schema }));
  await model.reason({ messages: host.context.view(), tools: toolDesc }, wrapped, host.ac.signal);

  const out = assembler.end();
  host.hooks.afterReason?.(host.id, out.text);
  if (isClosed(host)) {
    host.setPhase(PHASE_IDLE);
    return { text: out.text, stopped: true };
  }

  if (out.toolCalls.length === 0) {
    if (out.text) host.context.append({ role: "assistant", content: out.text });
    host.setPhase(PHASE_IDLE);
    return { text: out.text };
  }

  host.setPhase(PHASE_TOOL);
  host.pending = {
    text: out.text,
    calls: out.toolCalls,
    results: out.toolCalls.map(() => null),
    busy: -1,
  };
  try {
    for (let i = 0; i < out.toolCalls.length; i++) {
      const tc = out.toolCalls[i]!;
      if (isClosed(host) || !host.pending) return { text: out.text, stopped: true };
      let name = tc.name;
      const tv = await decide(host.hooks.beforeTool, host.id, name, tc.arguments);
      if (isClosed(host) || !host.pending) return { text: out.text, stopped: true };
      if (tv === "deny") {
        host.pending.results[i] = { error: "blocked_by_hook", reason: "denied" };
        continue;
      }
      if (typeof tv === "object" && tv.redirect.tool) name = tv.redirect.tool;

      const policy = blockedAction(name);
      if (policy) {
        host.pending.results[i] = { error: "blocked_by_policy", reason: policy };
        continue;
      }

      const tool = findTool(host.tools, name);
      host.pending.busy = i;
      const result = tool
        ? await tool.call(tc.arguments, host.ac.signal)
        : { error: "unknown_tool", reason: name };
      const rec = result as Record<string, unknown>;
      const failed = rec != null && "error" in rec;
      if (host.pending) {
        host.pending.busy = -1;
        if (!isClosed(host) || !failed) host.pending.results[i] = rec;
      }
      if (isClosed(host)) {
        const keep = host.pending?.results.some((r) => r != null);
        if (keep) commitPending(host, "stopped");
        else host.pending = null;
        return { text: out.text, stopped: true };
      }
      host.hooks.afterTool?.(host.id, name, result);
    }
    if (isClosed(host)) {
      commitPending(host, "stopped");
      return { text: out.text, stopped: true };
    }
    commitPending(host, null);
    return { text: out.text };
  } catch (e) {
    if (host.pending && !isClosed(host)) {
      const reason = e instanceof Error ? e.message : String(e);
      commitPending(host, reason);
    } else {
      host.pending = null;
    }
    throw e;
  } finally {
    host.setPhase(PHASE_IDLE);
  }
}

function isClosed(host: LoopHost): boolean {
  return host.state === STOPPED || host.state === CANCELLED;
}

function findTool(tools: Tool[], name: string): Tool | undefined {
  for (let i = 0; i < tools.length; i++) if (tools[i]!.name === name) return tools[i];
  return undefined;
}

function tokenTee(inner: Assembler, onChunk: (c: string) => void): Assembler {
  const orig = inner.pushText.bind(inner);
  inner.pushText = (c: string) => {
    orig(c);
    if (c) onChunk(c);
  };
  return inner;
}
