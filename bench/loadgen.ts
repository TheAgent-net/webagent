import type { TurnEvent } from "./adapters/types.ts";
import type { TurnStat } from "./metrics.ts";

export interface LoadOpts {
  url: string;
  concurrency: number;
  durationSec: number;
  warmupSec: number;
  rate?: number;
  inflight?: { n: number };
}

export async function oneTurn(base: string, text = "go"): Promise<TurnStat> {
  const t0 = performance.now();
  let ttfb = -1;
  let queuedMs = 0;
  let tokens = 0;
  const tools: string[] = [];
  let ok = false;

  const res = await fetch(base.replace(/\/+$/, "") + "/turn", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "text/event-stream" },
    body: JSON.stringify({ text }),
  });
  if (!res.body) return { tokens: 0, tools, queuedMs: 0, ttfbMs: 0, e2eMs: performance.now() - t0, ok: false };

  await readSse(res.body, (ev) => {
    if (ttfb < 0) ttfb = performance.now() - t0;
    if (ev.t === "token") tokens++;
    if (ev.t === "tool") tools.push(ev.d);
    if (ev.t === "queued") queuedMs = ev.ms;
    if (ev.t === "done") ok = true;
    if (ev.t === "error") ok = false;
  });

  return {
    tokens,
    tools,
    queuedMs,
    ttfbMs: ttfb < 0 ? performance.now() - t0 : ttfb,
    e2eMs: performance.now() - t0,
    ok,
  };
}

export async function runLoad(opts: LoadOpts): Promise<TurnStat[]> {
  const turns: TurnStat[] = [];
  const inflight = opts.inflight ?? { n: 0 };
  const stopAt = performance.now() + (opts.warmupSec + opts.durationSec) * 1000;
  const measureFrom = performance.now() + opts.warmupSec * 1000;

  const worker = async () => {
    while (performance.now() < stopAt) {
      inflight.n++;
      const stat = await oneTurn(opts.url);
      inflight.n--;
      if (performance.now() >= measureFrom) turns.push(stat);
    }
  };

  if (opts.rate && opts.rate > 0) {
    const gap = 1000 / opts.rate;
    const jobs: Promise<void>[] = [];
    while (performance.now() < stopAt) {
      jobs.push(
        (async () => {
          inflight.n++;
          const stat = await oneTurn(opts.url);
          inflight.n--;
          if (performance.now() >= measureFrom) turns.push(stat);
        })(),
      );
      await Bun.sleep(gap);
    }
    await Promise.all(jobs);
    return turns;
  }

  const n = Math.max(1, opts.concurrency);
  await Promise.all(Array.from({ length: n }, () => worker()));
  return turns;
}

async function readSse(body: ReadableStream<Uint8Array>, onEv: (ev: TurnEvent) => void): Promise<void> {
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
      for (const line of block.split("\n")) {
        const raw = line.startsWith("data:") ? line.slice(5).trim() : "";
        if (!raw) continue;
        try {
          onEv(JSON.parse(raw) as TurnEvent);
        } catch {
          /* ignore */
        }
      }
      cut = buf.indexOf("\n\n");
    }
  }
}
