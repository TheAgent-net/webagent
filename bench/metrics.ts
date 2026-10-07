import os from "node:os";

export interface Sample {
  t: number;
  rss: number;
  heap: number;
  external: number;
  inflight: number;
  cpu: number;
  elu?: number;
}

export interface TurnStat {
  tokens: number;
  tools: string[];
  queuedMs: number;
  ttfbMs: number;
  e2eMs: number;
  ok: boolean;
}

export interface Report {
  harness: string;
  concurrency: number;
  tps: number;
  maxInflight: number;
  durationSec: number;
  turns: number;
  ok: number;
  turnsPerSec: number;
  tokensPerSec: number;
  toolsPerSec: number;
  peakRssMb: number;
  peakHeapMb: number;
  rssPerInflightMb: number;
  cpuPct: number;
  queued: { p50: number; p99: number };
  ttfb: { p50: number; p99: number };
  e2e: { p50: number; p99: number };
  throttleShare: number;
}

export function startSampler(inflight: () => number): { samples: Sample[]; stop: () => void } {
  const samples: Sample[] = [];
  const t0 = performance.now();
  let lastCpu = process.cpuUsage();
  let lastWall = t0;
  const eluFn = (performance as unknown as { eventLoopUtilization?: () => { utilization: number } }).eventLoopUtilization;
  const cores = Math.max(1, os.cpus().length);

  const tick = () => {
    const now = performance.now();
    const cpu = process.cpuUsage(lastCpu);
    const wall = (now - lastWall) * 1000;
    lastCpu = process.cpuUsage();
    lastWall = now;
    const mem = process.memoryUsage();
    samples.push({
      t: (now - t0) / 1000,
      rss: mem.rss,
      heap: mem.heapUsed,
      external: mem.external,
      inflight: inflight(),
      cpu: wall > 0 ? ((cpu.user + cpu.system) / wall) * 100 / cores : 0,
      elu: eluFn?.().utilization,
    });
  };

  tick();
  const id = setInterval(tick, 100);
  return {
    samples,
    stop() {
      clearInterval(id);
      tick();
    },
  };
}

export function summarize(
  meta: { harness: string; concurrency: number; tps: number; maxInflight: number; durationSec: number },
  turns: TurnStat[],
  samples: Sample[],
): Report {
  const ok = turns.filter((t) => t.ok);
  const wall = Math.max(0.001, meta.durationSec);
  const tokens = ok.reduce((a, t) => a + t.tokens, 0);
  const tools = ok.reduce((a, t) => a + t.tools.length, 0);
  const peakRss = Math.max(0, ...samples.map((s) => s.rss));
  const peakHeap = Math.max(0, ...samples.map((s) => s.heap));
  const peakIn = Math.max(1, ...samples.map((s) => s.inflight), 1);
  const queued = ok.map((t) => t.queuedMs);
  const ttfb = ok.map((t) => t.ttfbMs);
  const e2e = ok.map((t) => t.e2eMs);
  const throttled = queued.filter((ms) => ms > 2).length;

  return {
    ...meta,
    turns: turns.length,
    ok: ok.length,
    turnsPerSec: ok.length / wall,
    tokensPerSec: tokens / wall,
    toolsPerSec: tools / wall,
    peakRssMb: peakRss / 1024 / 1024,
    peakHeapMb: peakHeap / 1024 / 1024,
    rssPerInflightMb: peakRss / 1024 / 1024 / peakIn,
    cpuPct: avg(samples.map((s) => s.cpu)),
    queued: pct(queued),
    ttfb: pct(ttfb),
    e2e: pct(e2e),
    throttleShare: queued.length ? throttled / queued.length : 0,
  };
}

export function printReport(r: Report): void {
  const row = (k: string, v: string) => console.log(k.padEnd(22) + v);
  row("harness", r.harness);
  row("concurrency", String(r.concurrency));
  row("tps / maxInflight", `${r.tps} / ${r.maxInflight}`);
  row("turns ok/total", `${r.ok}/${r.turns}  (${r.turnsPerSec.toFixed(1)}/s)`);
  row("tokens/s", r.tokensPerSec.toFixed(1));
  row("tools/s", r.toolsPerSec.toFixed(1));
  row("peak rss / heap", `${r.peakRssMb.toFixed(1)} / ${r.peakHeapMb.toFixed(1)} MB`);
  row("rss per inflight", `${r.rssPerInflightMb.toFixed(2)} MB`);
  row("cpu %", r.cpuPct.toFixed(1));
  row("queue p50/p99", `${r.queued.p50.toFixed(1)} / ${r.queued.p99.toFixed(1)} ms`);
  row("ttfb p50/p99", `${r.ttfb.p50.toFixed(1)} / ${r.ttfb.p99.toFixed(1)} ms`);
  row("e2e p50/p99", `${r.e2e.p50.toFixed(0)} / ${r.e2e.p99.toFixed(0)} ms`);
  row("throttle share", (r.throttleShare * 100).toFixed(1) + "%");
}

function pct(xs: number[]): { p50: number; p99: number } {
  if (!xs.length) return { p50: 0, p99: 0 };
  const s = xs.slice().sort((a, b) => a - b);
  const at = (p: number) => s[Math.min(s.length - 1, Math.floor(p * (s.length - 1)))]!
  return { p50: at(0.5), p99: at(0.99) };
}

function avg(xs: number[]): number {
  if (!xs.length) return 0;
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}
