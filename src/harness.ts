import { cursorModel } from "./cursor.ts";
import { echoModel, ModelShelf, ollamaModel, openaiModel, type Model, type ModelInfo } from "./models.ts";
import { Run, type CreateOpts, type Explain } from "./run.ts";
import { Scheduler } from "./scheduler.ts";
import { STATE_NAME, type RunState } from "./state.ts";
import { ToolShelf, type Tool, type ToolInfo } from "./tools.ts";

let seq = 0;
function nextId(): string {
  return "r" + ++seq;
}

export class Harness {
  readonly models = new ModelShelf();
  readonly tools = new ToolShelf();
  readonly scheduler: Scheduler;
  private readonly runs = new Map<string, Run>();

  constructor(opts?: { maxInflight?: number }) {
    this.scheduler = new Scheduler(opts?.maxInflight ?? 1024);
    this.models.add(echoModel());
  }

  addModel(model: Model): this {
    this.models.add(model);
    return this;
  }

  addTool(tool: Tool): this {
    this.tools.add(tool);
    return this;
  }

  getAvailableModels(): ModelInfo[] {
    return this.models.list();
  }

  getAvailableTools(): ToolInfo[] {
    return this.tools.list();
  }

  getLimits() {
    return { maxInflight: this.scheduler.max, inflight: this.scheduler.inflight, runs: this.runs.size };
  }

  getHealth() {
    const byState: Record<string, number> = {};
    for (const r of this.runs.values()) {
      const n = STATE_NAME[r.state]!;
      byState[n] = (byState[n] ?? 0) + 1;
    }
    return { inflight: this.scheduler.inflight, runs: this.runs.size, byState };
  }

  create(opts: CreateOpts = {}): Run {
    const run = new Run(nextId(), this.models, opts);
    this.runs.set(run.id, run);
    return run;
  }

  fork(id: string, opts?: { model?: string }): Run {
    const parent = this.runs.get(id);
    if (!parent) throw new Error("unknown run " + id);
    const child = parent.fork(opts);
    this.runs.set(child.id, child);
    return child;
  }

  get(id: string): Run | undefined {
    return this.runs.get(id);
  }

  listRuns(filter?: { state?: string }): Explain[] {
    const out: Explain[] = [];
    for (const r of this.runs.values()) {
      const ex = r.explain();
      if (filter?.state && ex.state !== filter.state) continue;
      out.push(ex);
    }
    return out;
  }

  /** Start many runs without waiting for each other (scheduler-capped). */
  startAll(ids: string[]): Promise<Explain[]> {
    return Promise.all(
      ids.map((id) => {
        const r = this.runs.get(id);
        if (!r) return Promise.reject(new Error("unknown run " + id));
        return this.scheduler.run(() => r.start());
      }),
    );
  }
}

export function defaultHarness(): Harness {
  const h = new Harness();
  h.addModel(cursorModel());
  if (process.env.OPENROUTER_API_KEY) {
    h.addModel(
      openaiModel({
        id: "openrouter",
        baseUrl: "https://openrouter.ai/api/v1",
        model: process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini",
        apiKeyEnv: "OPENROUTER_API_KEY",
      }),
    );
  } else {
    h.addModel(
      openaiModel({
        id: "openrouter",
        baseUrl: "https://openrouter.ai/api/v1",
        model: "openai/gpt-4o-mini",
        apiKeyEnv: "OPENROUTER_API_KEY",
      }),
    );
  }
  h.addModel(
    openaiModel({
      id: "openai",
      baseUrl: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      apiKeyEnv: "OPENAI_API_KEY",
    }),
  );
  h.addModel(ollamaModel());
  return h;
}

export type { RunState };
