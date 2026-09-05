#!/usr/bin/env bun
import { writeFileSync } from "node:fs";
import { webagentAdapter } from "./adapters/webagent.ts";
import type { HarnessAdapter } from "./adapters/types.ts";
import { runLoad } from "./loadgen.ts";
import { printReport, startSampler, summarize } from "./metrics.ts";
import { startProvider } from "./provider.ts";

const adapters: Record<string, () => HarnessAdapter> = {
  webagent: webagentAdapter,
};

const args = parse(process.argv.slice(2));
const make = adapters[args.harness];
if (!make) {
  console.error("unknown harness " + args.harness + " (have: " + Object.keys(adapters).join(", ") + ")");
  process.exit(2);
}

const provider = startProvider({ tps: args.tps });
const adapter = make();
const server = await adapter.listen({ providerUrl: provider.url, maxInflight: args.maxInflight });
const inflight = { n: 0 };
const sampler = startSampler(() => inflight.n);

const t0 = performance.now();
const turns = await runLoad({
  url: server.url,
  concurrency: args.concurrency,
  durationSec: args.duration,
  warmupSec: args.warmup,
  rate: args.rate,
  inflight,
});
const durationSec = Math.max(0.001, (performance.now() - t0) / 1000 - args.warmup);

sampler.stop();
const report = summarize(
  {
    harness: adapter.id,
    concurrency: args.concurrency,
    tps: args.tps,
    maxInflight: args.maxInflight,
    durationSec,
  },
  turns,
  sampler.samples,
);
printReport(report);
writeFileSync(new URL("./last-report.json", import.meta.url), JSON.stringify({ report, turns: turns.length }, null, 2));

await server.close();
await provider.close();

function parse(argv: string[]) {
  const out = {
    harness: "webagent",
    concurrency: 128,
    duration: 20,
    warmup: 2,
    tps: 40,
    maxInflight: 64,
    rate: undefined as number | undefined,
  };
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i]!;
    const v = argv[i + 1];
    if (k === "--harness" && v) out.harness = v;
    if (k === "--concurrency" && v) out.concurrency = Number(v);
    if (k === "--duration" && v) out.duration = Number(v);
    if (k === "--warmup" && v) out.warmup = Number(v);
    if (k === "--tps" && v) out.tps = Number(v);
    if (k === "--max-inflight" && v) out.maxInflight = Number(v);
    if (k === "--rate" && v) out.rate = Number(v);
  }
  return out;
}
