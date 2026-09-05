import { phaseOf, textForPhase, toolForPhase } from "./scenario.ts";

export interface ProviderOpts {
  tps: number;
  port?: number;
}

export interface ProviderServer {
  url: string;
  close: () => Promise<void>;
}

/** OpenAI-compatible SSE at a fixed tokens/sec. Stateless; phase from last role. */
export function startProvider(opts: ProviderOpts): ProviderServer {
  const gap = opts.tps <= 0 ? 0 : 1000 / opts.tps;
  const server = Bun.serve({
    port: opts.port ?? 0,
    async fetch(req) {
      const url = new URL(req.url);
      if (req.method === "GET" && url.pathname === "/delay") {
        const ms = Math.min(5000, Math.max(0, Number(url.searchParams.get("ms") ?? "80")));
        if (ms) await Bun.sleep(ms);
        return Response.json({ ok: true, ms });
      }
      if (req.method !== "POST" || !url.pathname.endsWith("/chat/completions")) {
        return new Response("not found", { status: 404 });
      }
      const body = (await req.json().catch(() => ({}))) as { messages?: { role?: string }[] };
      const phase = phaseOf(body.messages ?? []);
      const tokens = textForPhase(phase);
      const tool = toolForPhase(phase);

      const stream = new ReadableStream<Uint8Array>({
        async start(ctrl) {
          const enc = new TextEncoder();
          const send = (delta: unknown) => {
            ctrl.enqueue(enc.encode(`data: ${JSON.stringify({ choices: [{ delta }] })}\n\n`));
          };
          try {
            for (let i = 0; i < tokens.length; i++) {
              if (req.signal?.aborted) break;
              send({ content: (i === 0 ? "" : " ") + tokens[i] });
              if (gap) await Bun.sleep(gap);
            }
            if (tool) {
              const id = "c" + phase;
              send({ tool_calls: [{ index: 0, id, function: { name: tool.name, arguments: "" } }] });
              for (const ch of chunks(tool.args, 4)) {
                if (gap) await Bun.sleep(gap);
                send({ tool_calls: [{ index: 0, function: { arguments: ch } }] });
              }
            }
            ctrl.enqueue(enc.encode("data: [DONE]\n\n"));
          } finally {
            ctrl.close();
          }
        },
      });
      return new Response(stream, { headers: { "Content-Type": "text/event-stream" } });
    },
  });
  return {
    url: String(server.url).replace(/\/+$/, ""),
    async close() {
      server.stop(true);
    },
  };
}

function chunks(s: string, n: number): string[] {
  const out: string[] = [];
  for (let i = 0; i < s.length; i += n) out.push(s.slice(i, i + n));
  return out;
}
