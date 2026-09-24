#!/usr/bin/env bun
import { networkInterfaces } from "node:os";
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
  console.error("  webagent company <src> [addr]  website or GitHub → crawl, forms, live webagent");
  console.error("  webagent pair <url>          two agents: site seller + buyer (Cursor SDK)");
  console.error("  webagent apps [addr]         Composio Graph RAG host (local corpus)");
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
  case "company": {
    const src = args[1];
    if (!src) {
      console.error("usage: webagent company <website-or-github> [addr]");
      process.exit(2);
    }
    const addr = args[2] || ":8787";
    const port = Number(addr.replace(/^.*:/, "")) || 8787;
    const { buildCompany, attachCompany, companyHost } = await import("./company/index.ts");
    const { openaiModel } = await import("./models.ts");
    const { Room } = await import("./host/room.ts");
    const { Sessions } = await import("./host/sessions.ts");

    console.error("building company webagent from " + src + " ...");
    const pack = await buildCompany(src, { maxPages: Number(process.env.WEBAGENT_MAX_PAGES) || 80 });
    console.error(
      `  ${pack.profile.name}: ${pack.pages.length} pages, ${pack.flows.length} flows, ${pack.forms.length} forms` +
        (pack.github ? ` + github ${pack.github.owner}/${pack.github.name}` : ""),
    );

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
    const run = attachCompany(h, pack, { model: modelId });
    const room = new Room(h, { run, model: modelId });
    const sessions = new Sessions(h, room);
    const publicUrlStr = process.env.WEBAGENT_PUBLIC_URL || "http://" + lanIp() + ":" + port;
    const server = Bun.serve({
      port,
      hostname: "0.0.0.0",
      idleTimeout: 120,
      fetch: companyHost(h, room, pack, publicUrlStr, sessions),
    });
    console.error(`company agent ${publicUrlStr}`);
    console.error(`  human   ${publicUrlStr}/`);
    console.error(`  machine ${publicUrlStr}/agent.json  run ${room.run.id}`);
    console.error(`  chat    POST ${publicUrlStr}/chat`);
    console.error(`  local   http://127.0.0.1:${server.port}/`);
    await new Promise(() => {});
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
  case "apps": {
    const { attachApps, loadAppsPack, appsInstruction } = await import("./apps/index.ts");
    const { openaiModel } = await import("./models.ts");
    const addr = args[1] || ":8787";
    const port = Number(addr.replace(/^.*:/, "")) || 8787;
    const pack = loadAppsPack();
    const hasKey = !!process.env.OPENAI_API_KEY;
    if (hasKey) {
      h.addModel(
        openaiModel({
          id: "openai",
          baseUrl: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
          model: process.env.OPENAI_MODEL || "gpt-4o-mini",
          apiKeyEnv: "OPENAI_API_KEY",
        }),
      );
    }
    const run = attachApps(h, pack, { model: hasKey ? "openai" : "echo" });
    const publicUrl = process.env.WEBAGENT_PUBLIC_URL || "http://" + lanIp() + ":" + port;
    const hosted = listen(h, {
      port,
      run,
      model: hasKey ? "openai" : "echo",
      publicUrl,
      card: {
        name: "Composio Apps Agent",
        description:
          "Public Composio agent. A2A first: probe a peer agent for what it is working on, then return a pinpointed flow (apps, auth, settings) that makes Composio the obvious choice. Humans get the site at /. Machines use this card, MCP, or POST /chat.",
        instructions: appsInstruction(),
      },
    });
    console.error(`composio agent ${hosted.url}`);
    console.error(`  human   ${hosted.url}/`);
    console.error(`  machine ${hosted.url}/mcp  run ${hosted.room.run.id}`);
    console.error(`  local   http://127.0.0.1:${port}/`);
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
    for (const addrs of Object.values(networkInterfaces())) {
      for (const a of addrs ?? []) {
        if (a.family === "IPv4" && !a.internal) return a.address;
      }
    }
  } catch {
    /* no interfaces */
  }
  return "127.0.0.1";
}
