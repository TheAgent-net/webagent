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

function defaultEffort(model: string): string | undefined {
  return /^gpt-5(\.|-)/.test(model) ? "none" : undefined;
}

function lastUser(msgs: readonly Message[]): string {
  for (let i = msgs.length - 1; i >= 0; i--) {
    if (msgs[i]!.role === "user") return msgs[i]!.content;
  }
  return "";
}

export interface ModelCall {
  id: string;
  ms: number;
  text: string;
  error?: string;
}

export interface OpenAIOpts {
  id: string;
  baseUrl: string;
  model: string;
  /** When set, the model is not ready until this env var has a value. */
  apiKeyEnv?: string;
  /** Override ready. Use after a probe. */
  ready?: boolean;
  reasonNotReady?: string;
  /** Chat Completions reasoning setting. GPT-5.6 needs `none` to use tools here. */
  reasoningEffort?: string;
  onCall?: (call: ModelCall) => void;
}

export function openaiModel(opts: OpenAIOpts): Model {
  const key = opts.apiKeyEnv ? (process.env[opts.apiKeyEnv] ?? "") : "";
  const needsKey = Boolean(opts.apiKeyEnv);
  const ready = opts.ready ?? Boolean(opts.baseUrl && opts.model && (!needsKey || key));
  const reasonNotReady =
    opts.reasonNotReady ?? (needsKey && !key ? "missing " + opts.apiKeyEnv : undefined);
  return {
    id: opts.id,
    ready,
    reasonNotReady: ready ? undefined : reasonNotReady,
    supportsTools: true,
    supportsStream: false,
    async reason(req, out, signal) {
      if (!ready) throw new Error("model not ready: " + (reasonNotReady ?? opts.id));
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (key) headers.Authorization = "Bearer " + key;
      const body: Record<string, unknown> = { model: opts.model, messages: mapOpenAI(req.messages) };
      const effort = opts.reasoningEffort ?? process.env.OPENAI_REASONING_EFFORT ?? defaultEffort(opts.model);
      if (effort) body.reasoning_effort = effort;
      if (req.tools.length) {
        body.tools = req.tools.map((t) => ({
          type: "function",
          function: { name: t.name, description: t.description ?? "", parameters: t.schema ?? { type: "object", properties: {} } },
        }));
      }
      const t0 = Date.now();
      try {
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
        opts.onCall?.({ id: opts.id, ms: Date.now() - t0, text: msg.content ?? "" });
      } catch (e) {
        const err = e instanceof Error ? e.message : String(e);
        opts.onCall?.({ id: opts.id, ms: Date.now() - t0, text: "", error: err });
        throw e;
      }
    },
  };
}

/** Map webagent frames onto the OpenAI chat schema. Pin becomes system. */
export function mapOpenAI(messages: readonly Message[]): Record<string, unknown>[] {
  const out: Record<string, unknown>[] = new Array(messages.length);
  for (let i = 0; i < messages.length; i++) {
    const m = messages[i]!;
    if (m.role === "pin") {
      out[i] = { role: "system", content: m.content };
      continue;
    }
    if (m.role === "tool") {
      out[i] = { role: "tool", content: m.content, tool_call_id: m.toolCallId ?? "c0" };
      continue;
    }
    if (m.role === "assistant" && m.toolCalls && m.toolCalls.length > 0) {
      const calls: Record<string, unknown>[] = new Array(m.toolCalls.length);
      for (let j = 0; j < m.toolCalls.length; j++) {
        const c = m.toolCalls[j]!;
        calls[j] = {
          id: c.id,
          type: "function",
          function: { name: c.name, arguments: JSON.stringify(c.arguments ?? {}) },
        };
      }
      out[i] = { role: "assistant", content: m.content || null, tool_calls: calls };
      continue;
    }
    out[i] = { role: m.role, content: m.content };
  }
  return out;
}

export function ollamaHost(): string {
  return (process.env.OLLAMA_HOST ?? "http://127.0.0.1:11434").replace(/\/+$/, "");
}

export function ollamaName(): string {
  return process.env.OLLAMA_MODEL ?? "qwen2.5:7b";
}

export function ollamaV1(host = ollamaHost()): string {
  return host.replace(/\/v1$/, "") + "/v1";
}

/** Local OpenAI-compatible model. Ready when the host is up or the caller says so. */
export function ollamaModel(opts: { ready?: boolean; onCall?: (call: ModelCall) => void } = {}): Model {
  const opted = Boolean(process.env.OLLAMA_HOST || process.env.OLLAMA_MODEL);
  const ready = opts.ready ?? opted;
  return openaiModel({
    id: "ollama",
    baseUrl: ollamaV1(),
    model: ollamaName(),
    ready,
    reasonNotReady: ready ? undefined : "ollama host is down",
    onCall: opts.onCall,
  });
}

export async function probeOllama(host = ollamaHost()): Promise<boolean> {
  const base = host.replace(/\/+$/, "").replace(/\/v1$/, "");
  try {
    const res = await fetch(base + "/api/tags", { signal: AbortSignal.timeout(800) });
    return res.ok;
  } catch {
    return false;
  }
}
