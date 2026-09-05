#!/usr/bin/env bun
import { defaultHarness } from "./harness.ts";
import { listen } from "./host/listen.ts";

const args = process.argv.slice(2);
const h = defaultHarness();

if (!args[0] || args[0] === "help") {
  console.error("usage:");
  console.error("  webagent models              list available models");
  console.error("  webagent ask <text>          one echo run");
  console.error("  webagent serve [addr]        public HTTPS host (default :8787)");
  console.error("  webagent ingest <url>        crawl a site, build flows, attach a run");
  console.error("  webagent pair <url> [--keep] [--turns N]   site seller. 0 turns = host only");
  process.exit(args[0] ? 0 : 2);
}

switch (args[0]) {
  case "models":
    for (const m of h.getAvailableModels()) {
      console.log(`${m.ready ? "ok" : "  "}  ${m.id.padEnd(16)} ${m.ready ? "ready" : m.reason}`);
    }
    break;
  case "ask": {
    const text = args.slice(1).join(" ") || "hello";
    const run = h.create({ model: "echo" });
    run.inject({ text });
    const ex = await run.start();
    console.log(ex.lastText);
    break;
  }
  case "ingest": {
    const url = args[1];
    if (!url) {
      console.error("usage: webagent ingest <url>");
      process.exit(2);
    }
    const { attachPack, siteBook } = await import("./site/index.ts");
    const book = siteBook(h);
    let job = await book.ingest(url);
    if (job.pack.authAsk) {
      console.error("auth needed:", job.pack.authAsk.message);
      console.error(JSON.stringify(job.pack.authAsk, null, 2));
      console.error("paste a Cookie header and press enter (empty to stop):");
      const cookies = (await Bun.stdin.text()).trim();
      if (cookies) job = await book.grant(job.id, { cookies });
    }
    const run = job.pack.pages.length ? attachPack(h, job.pack, { model: "echo" }) : undefined;
    console.log(JSON.stringify({ id: job.id, runId: run?.id, pack: job.pack }, null, 2));
    break;
  }
  case "pair": {
    const url = args.slice(1).find((a) => !a.startsWith("-")) || "https://www.corgi.insure";
    const { printHandoff, runPair, asMarkdown } = await import("../experiment/run.ts");
    const report = await runPair({
      site: url,
      maxPages: 40,
      sellerPort: 8787,
      buyerPort: 8788,
      out: "experiment/last-report.json",
      keep: args.includes("--keep"),
      model: "auto",
      turns: flagNum(args, "--turns", 3),
    });
    console.log(asMarkdown(report));
    if (!args.includes("--keep")) {
      report.seller.stop();
      report.buyer.stop();
    } else {
      printHandoff(report);
      await new Promise(() => {});
    }
    break;
  }
  case "serve": {
    const addr = args[1] || ":8787";
    const port = Number(addr.replace(/^.*:/, "")) || 8787;
    const hosted = listen(h, { port });
    console.error(`agent ${hosted.url}`);
    console.error(`  human   ${hosted.url}/`);
    console.error(`  machine ${hosted.url}/mcp  run ${hosted.room.run.id}`);
    await new Promise(() => {});
    break;
  }
    default:
    console.error("unknown command");
    process.exit(2);
}

function flagNum(argv: string[], name: string, fallback: number): number {
  const i = argv.indexOf(name);
  if (i < 0) return fallback;
  const n = Number(argv[i + 1]);
  return Number.isInteger(n) && n >= 0 ? n : fallback;
}
