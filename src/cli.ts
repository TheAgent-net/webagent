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
  console.error("  webagent pair <url>          two agents: site seller + buyer (Cursor SDK)");
  console.error("  webagent corgi [addr]        Corgi insurance advisor (crawl + sales)");
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
    const url = args[1] || "https://www.corgi.insure";
    const { runPair, asMarkdown } = await import("../experiment/run.ts");
    const report = await runPair({
      site: url,
      maxPages: 40,
      sellerPort: 8787,
      buyerPort: 8788,
      out: "experiment/last-report.json",
      keep: args.includes("--keep"),
      model: "auto",
    });
    console.log(asMarkdown(report));
    if (!args.includes("--keep")) {
      report.seller.stop();
      report.buyer.stop();
    } else {
      console.error("seller " + report.seller.url);
      console.error("buyer  " + report.buyer.url);
      await new Promise(() => {});
    }
    break;
  }
  case "corgi": {
    const addr = args[1] || ":8787";
    const port = Number(addr.replace(/^.*:/, "")) || 8787;
    const { attachSales, corgiPublicDescription } = await import("./sales/index.ts");
    const { corgiHost } = await import("./sales/host.ts");
    const { siteBook } = await import("./site/index.ts");
    const { Room } = await import("./host/room.ts");
    const { Sessions } = await import("./sales/sessions.ts");
    const { openaiModel } = await import("./models.ts");

    const hasKey = !!process.env.OPENAI_API_KEY;
    if (hasKey) {
      h.addModel(
        openaiModel({
          id: "openai",
          baseUrl: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
          model: process.env.OPENAI_MODEL || "gpt-5.6-luna",
          apiKeyEnv: "OPENAI_API_KEY",
        }),
      );
    }
    const modelId = hasKey ? "openai" : "echo";

    console.error("crawling https://www.corgi.insure ...");
    const job = await siteBook(h).ingest("https://www.corgi.insure", { maxPages: 40 });
    console.error(`  ${job.pack.pages.length} pages, ${job.pack.flows.length} flows`);

    const run = attachSales(h, job.pack, { model: modelId });
    const room = new Room(h, { run, model: modelId });
    const sessions = new Sessions(h, room);
    const publicUrlStr = process.env.WEBAGENT_PUBLIC_URL || "http://" + lanIp() + ":" + port;

    const tls = tlsEnv();
    const server = Bun.serve({
      port,
      hostname: "0.0.0.0",
      idleTimeout: 120,
      tls,
      fetch: corgiHost(h, room, publicUrlStr, sessions),
    });

    const bound = publicUrlStr || `http://127.0.0.1:${server.port}`;
    console.error(`corgi agent ${bound}`);
    console.error(`  human   ${bound}/`);
    console.error(`  machine ${bound}/agent.json  run ${room.run.id}`);
    console.error(`  chat    POST ${bound}/chat`);
    console.error(`  local   http://127.0.0.1:${server.port}/`);
    await new Promise(() => {});
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

function lanIp(): string {
  try {
    const { networkInterfaces } = require("node:os");
    for (const addrs of Object.values(networkInterfaces())) {
      for (const a of (addrs as any[]) ?? []) {
        if (a.family === "IPv4" && !a.internal) return a.address;
      }
    }
  } catch {
    /* no interfaces */
  }
  return "127.0.0.1";
}

function tlsEnv(): { cert: ReturnType<typeof Bun.file>; key: ReturnType<typeof Bun.file> } | undefined {
  const certPath = process.env.WEBAGENT_TLS_CERT;
  const keyPath = process.env.WEBAGENT_TLS_KEY;
  if (!certPath || !keyPath) return undefined;
  return { cert: Bun.file(certPath), key: Bun.file(keyPath) };
}
