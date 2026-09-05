/**
 * One public run. The browser page and a machine client (MCP / POST) share it.
 * Does not change the loop — only inject / start / getContext.
 */
import type { Harness } from "../harness.ts";
import type { Run } from "../run.ts";

export type Side = "human" | "machine";

export interface RoomEvent {
  t: "say" | "reply" | "hello";
  from?: Side;
  text?: string;
  runId?: string;
}

export interface RoomOpts {
  model?: string;
  run?: Run;
  instruction?: string;
}

const ROOM_INSTRUCTION =
  "You are the public agent. Humans use the web page. Machines use MCP or JSON. Answer both. Be brief.";

export class Room {
  readonly run: Run;
  private readonly live = new Set<(ev: RoomEvent) => void>();

  constructor(private readonly harness: Harness, modelOrOpts: string | RoomOpts = "echo") {
    const opts: RoomOpts = typeof modelOrOpts === "string" ? { model: modelOrOpts } : modelOrOpts;
    this.run =
      opts.run ??
      harness.create({
        model: opts.model ?? "echo",
        instruction: opts.instruction ?? ROOM_INSTRUCTION,
      });
  }

  peek() {
    return { runId: this.run.id, ...this.run.explain(), messages: this.run.getContext() };
  }

  async say(from: Side, text: string) {
    const msg = text.trim();
    if (!msg) return this.peek();
    this.run.inject({ text: `[${from}] ${msg}` });
    this.emit({ t: "say", from, text: msg });
    const ex = await this.harness.scheduler.run(() => this.run.start());
    this.emit({ t: "reply", text: ex.lastText });
    return { ...ex, from };
  }

  subscribe(fn: (ev: RoomEvent) => void): () => void {
    this.live.add(fn);
    fn({ t: "hello", runId: this.run.id });
    return () => this.live.delete(fn);
  }

  stream(): Response {
    const enc = new TextEncoder();
    let off = () => {};
    let timer: ReturnType<typeof setInterval> | undefined;
    const stream = new ReadableStream<Uint8Array>({
      start: (ctrl) => {
        const send = (ev: RoomEvent) => ctrl.enqueue(enc.encode(`data: ${JSON.stringify(ev)}\n\n`));
        off = this.subscribe((ev) => send(ev));
        timer = setInterval(() => ctrl.enqueue(enc.encode(": ping\n\n")), 15000);
      },
      cancel: () => {
        off();
        if (timer) clearInterval(timer);
      },
    });
    return new Response(stream, {
      headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
    });
  }

  private emit(ev: RoomEvent): void {
    for (const fn of this.live) fn(ev);
  }
}
