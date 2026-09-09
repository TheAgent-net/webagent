import type { Assembler } from "./assembler.ts";
import type { Message } from "./context.ts";

export interface ModelRequest {
  messages: readonly Message[];
  tools: { name: string; description?: string; schema?: Record<string, unknown> }[];
}

export interface Model {
  id: string;
  /** Stream into the assembler. Do not parse tool JSON here. */
  reason(req: ModelRequest, out: Assembler, signal?: AbortSignal): Promise<void>;
  supportsTools?: boolean;
  supportsStream?: boolean;
  /** False if a key/endpoint is missing. Still listed. */
  ready?: boolean;
  reasonNotReady?: string;
}

export interface ModelInfo {
  id: string;
  ready: boolean;
  reason?: string;
  supportsTools: boolean;
  supportsStream: boolean;
}

export class ModelShelf {
  private readonly byId = new Map<string, Model>();

  add(model: Model): void {
    this.byId.set(model.id, model);
  }

  get(id: string): Model | undefined {
    return this.byId.get(id);
  }

  list(): ModelInfo[] {
    const out: ModelInfo[] = [];
    for (const m of this.byId.values()) {
      out.push(info(m));
    }
    return out;
  }

  info(id: string): ModelInfo | undefined {
    const m = this.byId.get(id);
    return m ? info(m) : undefined;
  }

  async check(id: string): Promise<ModelInfo> {
    const m = this.byId.get(id);
    if (!m) return { id, ready: false, reason: "unknown model", supportsTools: false, supportsStream: false };
    return info(m);
  }
}

function info(m: Model): ModelInfo {
  const ready = m.ready !== false;
  return {
    id: m.id,
    ready,
    reason: ready ? undefined : m.reasonNotReady ?? "not ready",
    supportsTools: !!m.supportsTools,
    supportsStream: !!m.supportsStream,
  };
}

/** Built-in: no network, deterministic. Always ready. */
export function echoModel(): Model {
  return {
    id: "echo",
    ready: true,
    supportsTools: false,
    supportsStream: false,
    async reason(req, out) {
      const last = lastUser(req.messages);
      out.pushText('You said: "');
      out.pushText(last);
      out.pushText('".');
    },
  };
}

function lastUser(msgs: readonly Message[]): string {
  for (let i = msgs.length - 1; i >= 0; i--) {
    if (msgs[i]!.role === "user") return msgs[i]!.content;
  }
  return "";
}

export function openaiModel(opts: { id: string; baseUrl: string; model: string; apiKeyEnv: string }): Model {
  const key = process.env[opts.apiKeyEnv] ?? "";
  return {
    id: opts.id,
    ready: Boolean(key && opts.baseUrl && opts.model),
    reasonNotReady: key ? undefined : `missing ${opts.apiKeyEnv}`,
    supportsTools: true,
    supportsStream: false,
    async reason(req, out, signal) {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (key) headers.Authorization = "Bearer " + key;
      const body: Record<string, unknown> = { model: opts.model, messages: toOpenAI(req.messages) };
      if (req.tools.length) {
        body.tools = req.tools.map((t) => ({
          type: "function",
          function: { name: t.name, description: t.description ?? "", parameters: t.schema ?? { type: "object", properties: {} } },
        }));
      }
      const resp = await fetch(opts.baseUrl.replace(/\/+$/, "") + "/chat/completions", {
        method: "POST",
        headers,
        body: JSON.stringify(body),
        signal,
      });
      if (resp.status >= 300) throw new Error(`model ${resp.status}: ${(await resp.text()).slice(0, 2048)}`);
      const json = (await resp.json()) as {
        choices?: { message?: { content?: string; tool_calls?: { id?: string; function?: { name?: string; arguments?: string } }[] } }[];
      };
      const msg = json.choices?.[0]?.message;
      if (!msg) throw new Error("model returned no choices");
      if (msg.content) out.pushText(msg.content);
      const tcs = msg.tool_calls;
      if (tcs) {
        for (let i = 0; i < tcs.length; i++) {
          const tc = tcs[i]!;
          out.pushToolDelta(i, tc.id, tc.function?.name, tc.function?.arguments);
        }
      }
    },
  };
}

/** Map harness frames onto OpenAI chat roles. Pin becomes system. */
export function toOpenAI(messages: readonly Message[]): Record<string, unknown>[] {
  const out: Record<string, unknown>[] = [];
  const pending = new Set<string>();
  for (let i = 0; i < messages.length; i++) {
    const m = messages[i]!;
    if (m.role === "pin") {
      out.push({ role: "system", content: m.content });
      pending.clear();
      continue;
    }
    if (m.role === "tool") {
      const id = m.toolCallId ?? "";
      if (!id || !pending.has(id)) continue;
      out.push({ role: "tool", content: m.content, tool_call_id: id });
      continue;
    }
    if (m.role === "assistant" && m.toolCalls?.length) {
      pending.clear();
      const calls = m.toolCalls.map((tc, j) => {
        const id = tc.id || "call_" + j;
        pending.add(id);
        return {
          id,
          type: "function",
          function: { name: tc.name, arguments: JSON.stringify(tc.arguments ?? {}) },
        };
      });
      out.push({ role: "assistant", content: m.content || null, tool_calls: calls });
      continue;
    }
    pending.clear();
    out.push({ role: m.role, content: m.content });
  }
  return out;
}
