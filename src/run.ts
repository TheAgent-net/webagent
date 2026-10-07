import { Context, type Message } from "./context.ts";
import type { HookBag } from "./hooks.ts";
import { oneStep } from "./loop.ts";
import type { ModelShelf } from "./models.ts";
import { guardTool } from "./policy.ts";
import {
  CANCELLED,
  CREATED,
  PAUSED,
  PHASE_IDLE,
  RUNNING,
  STATE_NAME,
  STOPPED,
  type RunState,
} from "./state.ts";
import type { Tool, ToolInfo } from "./tools.ts";

export interface CreateOpts {
  model?: string;
  tools?: Tool[];
  messages?: Message[];
  instruction?: string;
  hooks?: HookBag;
  /** Shared spine for fork — do not pass from apps. */
  context?: Context;
}

export interface Explain {
  id: string;
  state: string;
  phase: number;
  step: number;
  model: string | null;
  lastText: string;
}

const EVENT_CAP = 32;

export class Run {
  readonly id: string;
  state: RunState = CREATED;
  phase = PHASE_IDLE;
  step = 0;
  modelId: string | null = null;
  readonly context: Context;
  tools: Tool[] = [];
  hooks: HookBag;
  readonly ac = new AbortController();
  lastText = "";
  private readonly events: { t: string; d?: unknown }[] = [];
  private waiters: ((v: Explain) => void)[] = [];
  private pauseAfterStep = false;

  constructor(
    id: string,
    private readonly models: ModelShelf,
    opts: CreateOpts = {},
  ) {
    this.id = id;
    this.context = opts.context ?? new Context();
    if (opts.instruction) this.context.append({ role: "system", content: opts.instruction });
    if (opts.messages) this.context.appendMany(opts.messages);
    if (opts.model) this.modelId = opts.model;
    if (opts.tools) {
      for (let i = 0; i < opts.tools.length; i++) this.tools.push(guardTool(opts.tools[i]!));
    }
    this.hooks = opts.hooks ?? {};
  }

  setPhase(p: number): void {
    this.phase = p;
  }

  useModel(id: string): this {
    this.modelId = id;
    this.emit("model", id);
    return this;
  }

  getModelBinding(): string | null {
    return this.modelId;
  }

  clearModel(): this {
    this.modelId = null;
    this.emit("model", null);
    return this;
  }

  useTool(tool: Tool): this {
    this.tools.push(guardTool(tool));
    return this;
  }

  removeTool(name: string): this {
    this.tools = this.tools.filter((t) => t.name !== name);
    return this;
  }

  listTools(): ToolInfo[] {
    return this.tools.map((t) => ({ name: t.name, description: t.description, schema: t.schema }));
  }

  inject(input: { text?: string; messages?: Message[]; model?: string; vars?: string }): this {
    if (input.model) this.modelId = input.model;
    if (input.text) this.context.append({ role: "user", content: input.text });
    if (input.messages) this.context.appendMany(input.messages);
    if (input.vars) this.context.append({ role: "pin", content: input.vars });
    this.emit("inject");
    return this;
  }

  getContext(): readonly Message[] {
    return this.context.view();
  }

  async start(): Promise<Explain> {
    if (this.state === STOPPED || this.state === CANCELLED) throw new Error("run is finished");
    this.state = RUNNING;
    this.pauseAfterStep = false;
    this.emit("start");
    try {
      while (this.state === RUNNING && !this.pauseAfterStep) {
        const r = await oneStep(this, this.models);
        this.step++;
        this.lastText = r.text;
        if (r.stopped) break;
        if (this.ac.signal.aborted) break;
        // One user turn: stop after a step with no tools left to do.
        // start() on a fresh inject runs until the model replies without tools,
        // or pause() is requested. Consecutive start() after a reply is idle.
        if (this.needsMore()) continue;
        break;
      }
    } catch (e) {
      this.hooks.onError?.(this.id, e);
      throw e;
    }
    if (this.ac.signal.aborted) {
      this.state = CANCELLED;
      this.finish();
    } else if (this.pauseAfterStep) {
      this.state = PAUSED;
      this.hooks.onPause?.(this.id);
      this.emit("pause");
    } else {
      this.state = PAUSED;
    }
    return this.explain();
  }

  /** Public: exactly one loop cycle. */
  async stepOnce(): Promise<Explain> {
    if (this.state === STOPPED || this.state === CANCELLED) throw new Error("run is finished");
    this.state = RUNNING;
    try {
      const r = await oneStep(this, this.models);
      this.step++;
      this.lastText = r.text;
    } catch (e) {
      this.hooks.onError?.(this.id, e);
      throw e;
    }
    this.state = PAUSED;
    return this.explain();
  }

  async retryStep(): Promise<Explain> {
    return this.stepOnce();
  }

  skipStep(): Explain {
    this.step++;
    this.emit("skip");
    return this.explain();
  }

  pause(): void {
    this.pauseAfterStep = true;
  }

  resume(): Promise<Explain> {
    return this.start();
  }

  stop(): Explain {
    this.state = STOPPED;
    this.hooks.onStop?.(this.id);
    this.emit("stop");
    this.finish();
    return this.explain();
  }

  cancel(): Explain {
    this.ac.abort();
    this.state = CANCELLED;
    this.hooks.onStop?.(this.id);
    this.emit("cancel");
    this.finish();
    return this.explain();
  }

  fork(opts?: { model?: string }): Run {
    const child = new Run(this.id + ":f" + this.step, this.models, {
      hooks: this.hooks,
      context: this.context.fork(),
    });
    child.modelId = opts?.model ?? this.modelId;
    child.tools = this.tools;
    this.hooks.onFork?.(this.id, child.id);
    this.emit("fork", child.id);
    return child;
  }

  merge(source: Run): Explain {
    this.context.absorb(source.context);
    source.stop();
    this.hooks.onMerge?.(source.id, this.id);
    this.emit("merge", source.id);
    return this.explain();
  }

  explain(): Explain {
    return {
      id: this.id,
      state: STATE_NAME[this.state]!,
      phase: this.phase,
      step: this.step,
      model: this.modelId,
      lastText: this.lastText,
    };
  }

  async wait(): Promise<Explain> {
    if (this.state === STOPPED || this.state === CANCELLED) return this.explain();
    return new Promise((r) => this.waiters.push(r));
  }

  async *eventStream(): AsyncGenerator<{ t: string; d?: unknown }> {
    for (let i = 0; i < this.events.length; i++) yield this.events[i]!;
  }

  private needsMore(): boolean {
    const v = this.context.view();
    const last = v[v.length - 1];
    return last?.role === "tool";
  }

  private emit(t: string, d?: unknown): void {
    if (this.events.length >= EVENT_CAP) this.events.shift();
    this.events.push(d === undefined ? { t } : { t, d });
  }

  private finish(): void {
    const snap = this.explain();
    const w = this.waiters;
    this.waiters = [];
    for (let i = 0; i < w.length; i++) w[i]!(snap);
  }
}
