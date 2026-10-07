import { Harness } from "../../src/harness.ts";
import type { Assembler } from "../../src/assembler.ts";
import type { Model } from "../../src/models.ts";
import type { Tool } from "../../src/tools.ts";
import type { HarnessAdapter, ListenOpts, TurnEvent } from "./types.ts";

export function webagentAdapter(): HarnessAdapter {
  return {
    id: "webagent",
    async listen(opts: ListenOpts) {
      const h = new Harness({ maxInflight: opts.maxInflight });
      h.addModel(streamModel(opts.providerUrl));
      const cpu = cpuSpin();
      const io = ioLookup(opts.providerUrl);
      h.addTool(cpu);
      h.addTool(io);

      const server = Bun.serve({
        port: 0,
        fetch(req) {
          const path = new URL(req.url).pathname;
          if (req.method !== "POST" || path !== "/turn") return new Response("not found", { status: 404 });
          return turn(h, req, cpu, io);
        },
      });

      return {
        url: String(server.url).replace(/\/+$/, ""),
        async close() {
          server.stop(true);
        },
      };
    },
  };
}

function turn(h: Harness, req: Request, cpu: Tool, io: Tool): Response {
  const arrived = performance.now();
  const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>();
  const writer = writable.getWriter();
  const enc = new TextEncoder();
  const write = (ev: TurnEvent) => writer.write(enc.encode(`data: ${JSON.stringify(ev)}\n\n`));

  void (async () => {
    try {
      const body = (await req.json().catch(() => ({}))) as { text?: string };
      const run = h.create({
        model: "bench",
        tools: [cpu, io],
        hooks: {
          onToken: (_id, chunk) => {
            if (chunk) void write({ t: "token", d: chunk });
          },
          afterTool: (_id, name) => {
            void write({ t: "tool", d: name });
          },
        },
      });
      run.inject({ text: body.text || "go" });
      await h.scheduler.run(async () => {
        void write({ t: "queued", ms: performance.now() - arrived });
        await run.start();
      });
      void write({ t: "done" });
    } catch (e) {
      void write({ t: "error", d: e instanceof Error ? e.message : String(e) });
    } finally {
      await writer.close();
    }
  })();

  return new Response(readable, { headers: { "Content-Type": "text/event-stream" } });
}

/** Reads paced OpenAI SSE into the existing assembler. Bench-only. */
function streamModel(baseUrl: string): Model {
  return {
    id: "bench",
    ready: true,
    supportsTools: true,
    supportsStream: true,
    async reason(req, out, signal) {
      const resp = await fetch(baseUrl.replace(/\/+$/, "") + "/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "bench", stream: true, messages: req.messages, tools: req.tools }),
        signal,
      });
      if (resp.status >= 300 || !resp.body) throw new Error(`provider ${resp.status}`);
      await pipeSse(resp.body, out);
    },
  };
}

async function pipeSse(body: ReadableStream<Uint8Array>, out: Assembler): Promise<void> {
  const reader = body.getReader();
  const dec = new TextDecoder();
  let buf = "";
  while (true) {
    const step = await reader.read();
    if (step.done) break;
    buf += dec.decode(step.value, { stream: true });
    let cut = buf.indexOf("\n\n");
    while (cut >= 0) {
      const block = buf.slice(0, cut);
      buf = buf.slice(cut + 2);
      handleBlock(block, out);
      cut = buf.indexOf("\n\n");
    }
  }
  if (buf) handleBlock(buf, out);
}

function handleBlock(block: string, out: Assembler): void {
  for (const line of block.split("\n")) {
    const raw = line.startsWith("data:") ? line.slice(5).trim() : "";
    if (!raw || raw === "[DONE]") continue;
    let ev: { choices?: { delta?: { content?: string; tool_calls?: ToolDelta[] } }[] };
    try {
      ev = JSON.parse(raw) as typeof ev;
    } catch {
      continue;
    }
    const delta = ev.choices?.[0]?.delta;
    if (!delta) continue;
    if (delta.content) out.pushText(delta.content);
    const tcs = delta.tool_calls;
    if (!tcs) continue;
    for (let i = 0; i < tcs.length; i++) {
      const tc = tcs[i]!;
      out.pushToolDelta(tc.index ?? i, tc.id, tc.function?.name, tc.function?.arguments);
    }
  }
}

interface ToolDelta {
  index?: number;
  id?: string;
  function?: { name?: string; arguments?: string };
}

function cpuSpin(): Tool {
  return {
    name: "cpu_spin",
    description: "short CPU hash",
    schema: { type: "object", properties: { n: { type: "number" } } },
    async call() {
      const t0 = performance.now();
      let h = 2166136261;
      const bytes = new Uint8Array(4096);
      crypto.getRandomValues(bytes);
      while (performance.now() - t0 < 10) {
        for (let i = 0; i < bytes.length; i++) h = Math.imul(h ^ bytes[i]!, 16777619);
      }
      return { ok: true, hash: h, ms: performance.now() - t0 };
    },
  };
}

function ioLookup(providerUrl: string): Tool {
  return {
    name: "io_lookup",
    description: "I/O fetch to the provider delay",
    schema: { type: "object", properties: { ms: { type: "number" } } },
    async call(args, signal) {
      const ms = typeof args.ms === "number" ? args.ms : 80;
      const res = await fetch(providerUrl.replace(/\/+$/, "") + "/delay?ms=" + ms, { signal });
      return (await res.json()) as Record<string, unknown>;
    },
  };
}
