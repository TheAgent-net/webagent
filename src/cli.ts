#!/usr/bin/env bun
import { existsSync } from "node:fs";
import { networkInterfaces } from "node:os";
import { join } from "node:path";
import { defaultHarness } from "./harness.ts";
import { listen } from "./host/listen.ts";

const args = process.argv.slice(2);
const h = defaultHarness();

if (!args[0] || args[0] === "help") {
  console.error("usage:");
  console.error("  webagent models                 list available models");
  console.error("  webagent ask <text>             one echo run");
  console.error("  webagent from-url <url>         crawl a site → write a pack");
  console.error("  webagent serve --pack <dir>     host a pack (widget + POST /chat)");
  console.error("  webagent capture --pack <dir>   save site visuals for the widget (Chromium)");
  console.error("  webagent tune --pack <dir>      GEPA: tune the pack instruction on evals.json");
  console.error("  webagent serve [addr]           generic host, no pack");
  console.error("  webagent cloud [addr]           host every tenant (--packs <dir> --db <file>)");
  console.error("  webagent tenant add <id> --pack <dir> [--domain a,b] [--origin https://x]");
  console.error("  webagent tenant list            list tenants in the store");
  console.error("  webagent csp <site-url> [--cloud <public-url>]  check if the site CSP lets the widget load");
  console.error("  webagent demo <name>            pixel-clone pack.origin + inject widget");
  console.error("  webagent ingest <url>           crawl a site, build flows, attach a run");
  console.error("  webagent company <src> [addr]   website or GitHub → crawl, forms, live webagent");
  console.error("  webagent pair <url>             two agents: site seller + buyer (Cursor SDK)");
  console.error("  webagent apps [addr]            Composio Graph RAG host (local corpus)");
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
  case "from-url": {
    const url = args[1];
    if (!url) {
      console.error("usage: webagent from-url <url> [--out packs/_generated/<host>]");
      process.exit(2);
    }
    const out = flag(args, "--out");
    const { fromUrl } = await import("./pack/from-url.ts");
    console.error("crawling " + url + " ...");
    const got = await fromUrl(url, { out, maxPages: Number(process.env.WEBAGENT_MAX_PAGES) || 80 });
    console.error("wrote pack " + got.dir);
    console.error("  " + got.config.brand.name + " — " + got.config.brand.tagline);
    console.error("serve with: webagent serve --pack " + got.dir);
    break;
  }
  case "demo": {
    const name = args[1];
    if (!name) {
      console.error("usage: webagent demo <name> [addr] [--refresh] [--site-port N]");
      process.exit(2);
    }
    const addr = positional(args.slice(2)) || ":8787";
    const sitePort = Number(flag(args, "--site-port") || 0) || Number(addr.replace(/^.*:/, "")) + 1;
    const refresh = args.includes("--refresh");
    const dir = packDirFor(name);
    const { loadPackConfig } = await import("./pack/load.ts");
    const { ensureDemoClone } = await import("./pack/clone.ts");
    const { serveDemoSite } = await import("./pack/demo-site.ts");
    const config = loadPackConfig(dir);
    if (!config.origin) {
      console.error("pack.json missing origin — demo cannot pixel-clone the webpage");
      process.exit(2);
    }
    const site = join(process.cwd(), "demo", name, "site");
    const widgetOrigin = process.env.WEBAGENT_PUBLIC_URL || "http://" + lanIp() + ":" + (Number(addr.replace(/^.*:/, "")) || 8787);
    console.error("pixel-cloning " + config.origin + " → " + site + (refresh ? " (refresh)" : ""));
    const packP = startPack(h, dir, addr);
    try {
      const cloned = await ensureDemoClone({ origin: config.origin, out: site, refresh });
      console.error(
        `  clone   ${cloned.files} files  ${Math.round(cloned.htmlBytes / 1024)}kb html` +
          (cloned.fresh ? "  fresh" : "  cached") +
          (cloned.landed && cloned.landed !== config.origin ? "  via " + cloned.landed : ""),
      );
    } catch (err) {
      console.error(err instanceof Error ? err.message : String(err));
      process.exit(1);
    }
    await packP;
    serveDemoSite(site, sitePort, widgetOrigin);
    console.error(`  demo    http://127.0.0.1:${sitePort}/  (pixel clone + ${widgetOrigin}/widget.js)`);
    await new Promise(() => {});
    break;
  }
  case "smallest": {
    await startPack(h, "packs/smallest", positional(args.slice(1)) || ":8789");
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
  case "tune": {
    const pack = flag(args, "--pack");
    if (!pack) {
      console.error("usage: webagent tune --pack <dir> [--budget 8] [--model <judge and reflect model>]");
      process.exit(2);
    }
    if (!process.env.OPENAI_API_KEY) {
      console.error("tune runs the real agent and a judge model: set OPENAI_API_KEY");
      process.exit(2);
    }
    const { openPack } = await import("./pack/build.ts");
    const { loadCases, starterCases, tunePrompt, tuneReport } = await import("./pack/tune.ts");
    const { embedVisuals } = await import("./pack/docs.ts");
    const { writeFileSync } = await import("node:fs");
    const runtime = await openPack(pack, { maxPages: Number(process.env.WEBAGENT_MAX_PAGES) || 220 });
    await embedVisuals(runtime).catch(() => 0);
    const own = existsSync(join(runtime.dir, "evals.json"));
    const cases = own
      ? loadCases(runtime.dir)
      : starterCases(runtime.config.brand.name, runtime.pages.map((p) => new URL(p.url).pathname));
    if (!own) console.error("no evals.json: using the generic starter cases");
    console.error(`tuning ${runtime.config.id} on ${cases.length} cases ...`);
    const { best, pool } = await tunePrompt(runtime, cases, {
      budget: Number(flag(args, "--budget")) || 8,
      model: flag(args, "--model"),
      log: (line) => console.error("  " + line),
    });
    writeFileSync(join(runtime.dir, "instruction.tuned.md"), best.text.trim() + "\n");
    writeFileSync(join(runtime.dir, "tune-report.md"), tuneReport(pool, best) + "\n");
    console.error(`best ${best.id} mean ${best.mean.toFixed(3)} (seed ${pool[0]!.mean.toFixed(3)})`);
    console.error(`wrote ${join(runtime.dir, "instruction.tuned.md")} and tune-report.md. Review it, then copy it over instruction.md.`);
    break;
  }
  case "capture": {
    const pack = flag(args, "--pack");
    if (!pack) {
      console.error("usage: webagent capture --pack <dir> [--url <site>] [--pages /,/pricing,https://other.site/page] [--max 8] [--max-visuals 40]");
      process.exit(2);
    }
    const { loadPackConfig } = await import("./pack/load.ts");
    const { captureVisuals } = await import("./site/visual.ts");
    const config = loadPackConfig(pack);
    const clone = join(process.cwd(), "demo", config.id, "site");
    let url = flag(args, "--url");
    let stop = () => {};
    if (!url && existsSync(join(clone, "index.html"))) {
      const { serveDemoSite } = await import("./pack/demo-site.ts");
      const site = serveDemoSite(clone, 0, "http://127.0.0.1");
      url = "http://127.0.0.1:" + site.port;
      stop = site.stop;
    }
    url ||= config.origin;
    const pages = flag(args, "--pages")?.split(",").map((p) => p.trim()).filter(Boolean);
    console.error("capturing visuals from " + url + " ...");
    try {
      const visuals = await captureVisuals(url, {
        out: config.dir!,
        pages,
        maxPages: Number(flag(args, "--max")) || 8,
        maxVisuals: Number(flag(args, "--max-visuals")) || 40,
      });
      for (const v of visuals) console.error(`  ${v.kind.padEnd(8)} ${v.id.padEnd(36)} ${v.page}`);
      console.error(`wrote ${visuals.length} visuals to ${join(config.dir!, "visuals.json")}`);
    } finally {
      stop();
    }
    break;
  }
  case "cloud": {
    const { openStore } = await import("./store/sqlite.ts");
    const { Tenants } = await import("./host/tenant.ts");
    const { serveCloud } = await import("./host/cloud.ts");
    const store = openStore(flag(args, "--db"));
    const tenants = new Tenants(store, { packs: flag(args, "--packs") || "packs" });
    const added = tenants.sync();
    const addr = positional(args.slice(1)) || ":8787";
    const port = Number(addr.replace(/^.*:/, "")) || 8787;
    const served = serveCloud(tenants, { port });
    console.error(`cloud ${served.url}`);
    if (added.length) console.error("  added   " + added.join(", "));
    for (const t of tenants.list()) {
      console.error(`  ${t.id.padEnd(14)} ${served.url}/t/${t.id}/widget.js` + (t.domains.length ? "  " + t.domains.join(", ") : ""));
    }
    await new Promise(() => {});
    break;
  }
  case "csp": {
    const site = args[1];
    const cloudUrl = flag(args, "--cloud") || process.env.WEBAGENT_PUBLIC_URL;
    if (!site || !cloudUrl) {
      console.error("usage: webagent csp <site-url> --cloud <public-url>  (or set WEBAGENT_PUBLIC_URL)");
      process.exit(2);
    }
    const { checkCsp, formatCsp } = await import("./host/csp.ts");
    const report = await checkCsp(site, cloudUrl);
    console.log(formatCsp(report));
    process.exit(report.ok ? 0 : 1);
  }
  case "tenant": {
    const { openStore } = await import("./store/sqlite.ts");
    const store = openStore(flag(args, "--db"));
    const verb = args[1];
    if (verb === "add") {
      const id = args[2];
      const pack = flag(args, "--pack");
      if (!id || !/^[a-z0-9][a-z0-9_-]{0,62}$/.test(id) || !pack || !existsSync(join(pack, "pack.json"))) {
        console.error("usage: webagent tenant add <id> --pack <dir with pack.json> [--domain a,b] [--origin https://x]");
        process.exit(2);
      }
      const list = (v?: string) => (v ? v.split(",").map((x) => x.trim()).filter(Boolean) : []);
      const old = store.getTenant(id);
      const { resolve } = await import("node:path");
      store.putTenant({
        id,
        name: flag(args, "--name") || old?.name || id,
        pack: resolve(pack),
        domains: list(flag(args, "--domain")).length ? list(flag(args, "--domain")) : old?.domains ?? [],
        origins: list(flag(args, "--origin")).length ? list(flag(args, "--origin")) : old?.origins ?? [],
        settings: old?.settings ?? {},
        created: old?.created ?? Date.now(),
      });
      console.error((old ? "updated " : "added ") + id);
    } else {
      for (const t of store.listTenants()) console.log([t.id, t.name, t.pack, t.domains.join(","), t.origins.join(",")].join("\t"));
    }
    store.close();
    break;
  }
  case "serve": {
    const pack = flag(args, "--pack");
    const addr = positional(args.slice(1)) || ":8787";
    if (pack) {
      await startPack(h, pack, addr);
      await new Promise(() => {});
      break;
    }
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

async function startPack(h: ReturnType<typeof defaultHarness>, dir: string, addr: string): Promise<void> {
  const port = Number(addr.replace(/^.*:/, "")) || 8787;
  const { servePack } = await import("./pack/serve.ts");
  console.error("opening pack " + dir + " ...");
  const { hosted, runtime, modelName } = await servePack(dir, {
    harness: h,
    port,
    publicUrl: process.env.WEBAGENT_PUBLIC_URL || "http://" + lanIp() + ":" + port,
    maxPages: Number(process.env.WEBAGENT_MAX_PAGES) || 220,
  });
  console.error(`agent ${hosted.url}`);
  const visualN = runtime.visualVectors?.size ?? 0;
  const visualT = runtime.config.visuals?.length ?? 0;
  console.error(
    `  pack    ${runtime.config.id}  ${runtime.pages.length} pages  ${runtime.chunks.length} chunks` +
      (visualT ? `  ${visualN}/${visualT} visuals` : ""),
  );
  console.error(`  model   ${modelName}${modelName === "echo" ? " — OPENAI_API_KEY missing, replies echo" : ""}`);
  console.error(`  human   ${hosted.url}/`);
  console.error(`  widget  ${hosted.url}/widget.js`);
  console.error(`  machine ${hosted.url}/agent.json  run ${hosted.room.run.id}`);
  console.error(`  chat    POST ${hosted.url}/chat`);
}

function packDirFor(name: string): string {
  const demo = join(process.cwd(), "demo", name, "pack");
  if (existsSync(demo)) return demo;
  return join(process.cwd(), "packs", name);
}

function flag(argv: string[], name: string): string | undefined {
  const i = argv.indexOf(name);
  if (i >= 0 && argv[i + 1] && !argv[i + 1]!.startsWith("-")) return argv[i + 1];
  const pref = name + "=";
  const hit = argv.find((a) => a.startsWith(pref));
  return hit ? hit.slice(pref.length) : undefined;
}

function positional(argv: string[]): string | undefined {
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]!;
    if (a.startsWith("--")) {
      if (!a.includes("=") && argv[i + 1] && !argv[i + 1]!.startsWith("-")) i++;
      continue;
    }
    return a;
  }
  return undefined;
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
