#!/usr/bin/env bun
/**
 * Two public agents. Seller is the crawled site. Buyer talks to seller as a machine.
 * auto: cursor, then openrouter, then script.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { cursorModel, type CursorCall } from "../src/cursor.ts";
import { Harness } from "../src/harness.ts";
import { listen, type Hop } from "../src/host/listen.ts";
import { openaiModel } from "../src/models.ts";
import { attachSales } from "../src/sales/index.ts";
import { siteBook } from "../src/site/index.ts";
import type { SitePack } from "../src/site/types.ts";
import { peerTool } from "./peer.ts";
import { scriptModel } from "./script.ts";

const TURNS = [
  "I am a seed-stage SaaS founder. What coverage do I need and what does it cost?",
  "How fast can I get a quote compared to a broker?",
  "Should I buy from Corgi or keep a traditional broker? Give a short recommendation.",
];

const args = parseArgs(process.argv.slice(2));

if (import.meta.main) {
  const report = await runPair(args);
  const out = args.out;
  mkdirSync(out.replace(/\/[^/]+$/, "") || ".", { recursive: true });
  writeFileSync(out, JSON.stringify(report, null, 2));
  writeFileSync(out.replace(/\.json$/, ".md"), asMarkdown(report));
  console.log(asMarkdown(report));
  console.log("\nwrote " + out);
  if (!args.keep) {
    report.seller.stop();
    report.buyer.stop();
  } else {
    printHandoff(report);
    await new Promise(() => {});
  }
}

export interface PairOpts {
  site: string;
  maxPages: number;
  sellerPort: number;
  buyerPort: number;
  out: string;
  keep: boolean;
  model: "auto" | "cursor" | "openrouter" | "script";
  /** Canned buyer turns. 0 keeps the seller and skips them. */
  turns?: number;
}

export async function runPair(opts: PairOpts) {
  const hops: Hop[] = [];
  const crawl: { url: string; status: number; ms: number }[] = [];
  const cursorCalls: CursorCall[] = [];

  const sellerH = new Harness();
  const buyerH = new Harness();
  const cursor = cursorModel({ onCall: (c) => cursorCalls.push(c) });
  const openrouter = addOpenrouter();
  sellerH.addModel(cursor);
  sellerH.addModel(openrouter);
  sellerH.addModel(scriptModel({ id: "script", role: "seller" }));
  buyerH.addModel(cursorModel({ onCall: (c) => cursorCalls.push(c) }));
  buyerH.addModel(addOpenrouter());
  buyerH.addModel(scriptModel({ id: "script", role: "buyer" }));

  const want = pickModel(opts.model, cursor.ready !== false, openrouter.ready !== false);
  const t0 = Date.now();
  const job = await siteBook(sellerH).ingest(opts.site, {
    maxPages: opts.maxPages,
    fetch: Object.assign(
      async (input: RequestInfo | URL, init?: RequestInit) => {
        const start = Date.now();
        const res = await fetch(input, init);
        const href = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
        crawl.push({ url: href, status: res.status, ms: Date.now() - start });
        return res;
      },
      fetch,
    ),
  });
  const crawlMs = Date.now() - t0;
  const pack = job.pack;
  const sellerRun = attachSales(sellerH, pack, { model: want });
  const seller = listen(sellerH, {
    port: opts.sellerPort,
    hostname: opts.keep ? "0.0.0.0" : "127.0.0.1",
    reach: opts.keep,
    model: want,
    run: sellerRun,
    onHop: (h) => hops.push({ ...h, path: "seller:" + h.path } as Hop),
  });

  const buyerRun = buyerH.create({
    model: want,
    instruction: [
      "You are a founder who wants startup insurance.",
      "The Corgi public agent is a peer. Use ask_peer to ask it.",
      "Then give a short answer to the human. Quote the peer. Do not invent prices.",
    ].join(" "),
    tools: [peerTool(seller.url, (h) => hops.push({ ...h, path: "peer:" + h.path } as Hop))],
  });
  const buyer = listen(buyerH, {
    port: opts.buyerPort,
    hostname: "127.0.0.1",
    model: want,
    run: buyerRun,
    onHop: (h) => hops.push({ ...h, path: "buyer:" + h.path } as Hop),
  });

  const probes = await probeHosts(seller.url, buyer.url);
  const turns: TurnRec[] = [];
  const canned = TURNS.slice(0, opts.turns ?? TURNS.length);
  for (const text of canned) {
    const start = Date.now();
    const res = await fetch(buyer.url + "/chat", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
        "user-agent": "Mozilla/5.0 experiment",
      },
      body: JSON.stringify({ text, from: "human" }),
    });
    const body = (await res.json()) as { lastText?: string; id?: string; step?: number };
    turns.push({
      input: text,
      status: res.status,
      ms: Date.now() - start,
      buyer: body.lastText ?? "",
      seller: lastAssistant(seller.room.run.getContext()),
    });
  }

  const report = {
    startedAt: new Date().toISOString(),
    site: opts.site,
    model: {
      wanted: opts.model,
      used: want,
      cursorReady: cursor.ready !== false,
      cursorReason: cursor.reasonNotReady,
      openrouterReady: openrouter.ready !== false,
      openrouterReason: openrouter.reasonNotReady,
    },
    crawl: {
      ms: crawlMs,
      origin: pack.origin,
      pages: pack.pages.length,
      flows: pack.flows.map((f) => f.id),
      facts: pack.facts,
      starterQuestions: pack.starterQuestions,
      hops: crawl,
      titles: pack.pages.map((p) => ({ url: p.url, status: p.status, title: p.title, bytes: p.text.length })),
    },
    seller: {
      url: seller.url,
      port: seller.port,
      runId: seller.room.run.id,
      model: seller.room.run.modelId,
      card: probes.sellerCard,
      who: probes.sellerWho,
      lastText: seller.room.run.lastText,
      messages: slim(seller.room.run.getContext()),
      stop: seller.stop,
    },
    buyer: {
      url: buyer.url,
      runId: buyer.room.run.id,
      model: buyer.room.run.modelId,
      card: probes.buyerCard,
      who: probes.buyerWho,
      lastText: buyer.room.run.lastText,
      messages: slim(buyer.room.run.getContext()),
      stop: buyer.stop,
    },
    turns,
    hops,
    cursorCalls,
    analysis: analyze(pack, turns, hops, crawl, want),
  };
  return report;
}

interface TurnRec {
  input: string;
  status: number;
  ms: number;
  buyer: string;
  seller: string;
}

export function pickModel(want: PairOpts["model"], cursorReady: boolean, openrouterReady = false): string {
  if (want === "script" || want === "cursor" || want === "openrouter") return want;
  if (cursorReady) return "cursor";
  if (openrouterReady) return "openrouter";
  return "script";
}

function addOpenrouter() {
  return openaiModel({
    id: "openrouter",
    baseUrl: "https://openrouter.ai/api/v1",
    model: process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini",
    apiKeyEnv: "OPENROUTER_API_KEY",
  });
}

export function printHandoff(r: Awaited<ReturnType<typeof runPair>>): void {
  console.error("same machine  http://127.0.0.1:" + r.seller.port);
  console.error("other laptop  " + r.seller.url);
  console.error("model         " + r.model.used);
}

function lastAssistant(msgs: readonly { role: string; content: string }[]): string {
  for (let i = msgs.length - 1; i >= 0; i--) {
    if (msgs[i]!.role === "assistant") return msgs[i]!.content;
  }
  return "";
}

function slim(msgs: readonly { role: string; content: string }[]) {
  return msgs.map((m) => ({ role: m.role, content: m.content.slice(0, 1200) }));
}

async function probeHosts(sellerUrl: string, buyerUrl: string) {
  const human = { accept: "text/html", "user-agent": "Mozilla/5.0", "sec-fetch-dest": "document" };
  const machine = { accept: "application/json", "user-agent": "curl/8.0" };
  const [sellerHtml, sellerCard, sellerWho, buyerHtml, buyerCard, buyerWho] = await Promise.all([
    fetch(sellerUrl + "/", { headers: human }).then(async (r) => ({ status: r.status, kind: r.headers.get("content-type") })),
    fetch(sellerUrl + "/agent.json", { headers: machine }).then((r) => r.json()),
    fetch(sellerUrl + "/who", { headers: machine }).then((r) => r.json()),
    fetch(buyerUrl + "/", { headers: human }).then(async (r) => ({ status: r.status, kind: r.headers.get("content-type") })),
    fetch(buyerUrl + "/agent.json", { headers: machine }).then((r) => r.json()),
    fetch(buyerUrl + "/who", { headers: machine }).then((r) => r.json()),
  ]);
  return { sellerHtml, sellerCard, sellerWho, buyerHtml, buyerCard, buyerWho };
}

function analyze(pack: SitePack, turns: TurnRec[], hops: Hop[], crawl: { url: string; status: number }[], model: string) {
  const factBlob = pack.facts.join("\n").toLowerCase() + "\n" + pack.pages.map((p) => p.text).join(" ").toLowerCase();
  const sellerTexts = turns.map((t) => t.seller.toLowerCase());
  const prices = [...new Set((factBlob.match(/\$[\d,.]+[kKmM]?/g) ?? []).slice(0, 20))];
  const invented = sellerTexts.some((t) => /\$[\d,]+/.test(t) && !prices.some((p) => t.includes(p.toLowerCase())));
  const kinds: Record<string, number> = {};
  for (const h of hops) kinds[h.kind] = (kinds[h.kind] ?? 0) + 1;
  const peerHops = hops.filter((h) => h.path.startsWith("peer:"));
  const crawlOk = crawl.filter((c) => c.status >= 200 && c.status < 400).length;
  return {
    model,
    pages: pack.pages.length,
    flows: pack.flows.map((f) => f.name),
    crawlOk,
    crawlFail: crawl.length - crawlOk,
    turnMs: turns.map((t) => t.ms),
    hopKinds: kinds,
    peerCalls: peerHops.length,
    sellerQuotedPeer: turns.filter((t) => /corgi agent said/i.test(t.buyer) || t.buyer.includes(t.seller.slice(0, 40))).length,
    priceTokensOnSite: prices,
    sellerMayInventPrice: invented,
    humanPage: hops.some((h) => h.kind === "human" && h.path.endsWith("/") && h.status === 200),
    machineCard: hops.some((h) => h.kind === "machine" && h.path.includes("agent.json")),
    notes: [
      "Seller answers only from the crawled pack plus site_lookup.",
      "Buyer is a separate harness and a separate listen port.",
      "Buyer calls seller over HTTP as a machine (x-agent + JSON).",
      model === "cursor"
        ? "Both runs bound cursor (Cursor SDK Agent.prompt, tools empty)."
        : model === "openrouter"
          ? "Both runs bound openrouter (OpenRouter chat, tools on)."
          : "No live key. Both runs bound the script model so the pair still ran.",
    ],
  };
}

export function asMarkdown(r: Awaited<ReturnType<typeof runPair>>): string {
  const lines = [
    "# Pair experiment — " + r.site,
    "",
    "Started " + r.startedAt,
    "",
    "## Models",
    "",
    "- wanted: `" + r.model.wanted + "`",
    "- used: `" + r.model.used + "`",
    "- cursor ready: " + r.model.cursorReady + (r.model.cursorReason ? " (" + r.model.cursorReason + ")" : ""),
    "- openrouter ready: " + r.model.openrouterReady + (r.model.openrouterReason ? " (" + r.model.openrouterReason + ")" : ""),
    "",
    "## Site ingest",
    "",
    "- origin: " + r.crawl.origin,
    "- pages: " + r.crawl.pages + " in " + r.crawl.ms + " ms",
    "- flows: " + r.crawl.flows.join(", "),
    "- crawl hops: " + r.crawl.hops.length,
    "",
    "### Facts",
    "",
    ...r.crawl.facts.map((f) => "- " + f),
    "",
    "### Pages",
    "",
    ...r.crawl.titles.map((p) => "- " + p.status + " " + p.title + " — " + p.url + " (" + p.bytes + " chars)"),
    "",
    "## Agents",
    "",
    "| | Seller (Corgi) | Buyer |",
    "| --- | --- | --- |",
    "| url | " + r.seller.url + " | " + r.buyer.url + " |",
    "| run | `" + r.seller.runId + "` | `" + r.buyer.runId + "` |",
    "| model | `" + r.seller.model + "` | `" + r.buyer.model + "` |",
    "",
    "## Turns",
    "",
  ];
  for (let i = 0; i < r.turns.length; i++) {
    const t = r.turns[i]!;
    lines.push("### Turn " + (i + 1) + " (" + t.ms + " ms)");
    lines.push("");
    lines.push("**Human → buyer:** " + t.input);
    lines.push("");
    lines.push("**Seller:**");
    lines.push("");
    lines.push(t.seller || "(empty)");
    lines.push("");
    lines.push("**Buyer:**");
    lines.push("");
    lines.push(t.buyer || "(empty)");
    lines.push("");
  }
  lines.push("## Network");
  lines.push("");
  lines.push("- hops: " + r.hops.length);
  lines.push("- kinds: " + JSON.stringify(r.analysis.hopKinds));
  lines.push("- peer calls: " + r.analysis.peerCalls);
  lines.push("");
  for (const h of r.hops) {
    lines.push("- " + h.kind + " " + h.method + " " + h.path + " → " + h.status + " " + h.ms + "ms " + h.resBytes + "B");
  }
  if (r.cursorCalls.length) {
    lines.push("");
    lines.push("## Cursor SDK calls");
    lines.push("");
    for (const c of r.cursorCalls) {
      lines.push("- " + c.ms + "ms" + (c.error ? " error: " + c.error : "") + (c.usage ? " tokens=" + JSON.stringify(c.usage) : ""));
    }
  }
  lines.push("");
  lines.push("## Analysis");
  lines.push("");
  for (const n of r.analysis.notes) lines.push("- " + n);
  lines.push("- seller may invent price: " + r.analysis.sellerMayInventPrice);
  lines.push("- prices seen on site: " + (r.analysis.priceTokensOnSite.join(", ") || "(none)"));
  lines.push("- human page served: " + r.analysis.humanPage);
  lines.push("- machine card served: " + r.analysis.machineCard);
  return lines.join("\n");
}

function parseArgs(argv: string[]): PairOpts {
  const out: PairOpts = {
    site: "https://www.corgi.insure",
    maxPages: 40,
    sellerPort: 0,
    buyerPort: 0,
    out: "experiment/last-report.json",
    keep: false,
    model: "auto",
    turns: TURNS.length,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]!;
    if (a === "--site") out.site = argv[++i] ?? out.site;
    else if (a === "--max-pages") out.maxPages = Number(argv[++i]) || out.maxPages;
    else if (a === "--seller-port") out.sellerPort = Number(argv[++i]) || 0;
    else if (a === "--buyer-port") out.buyerPort = Number(argv[++i]) || 0;
    else if (a === "--out") out.out = argv[++i] ?? out.out;
    else if (a === "--keep") out.keep = true;
    else if (a === "--model") out.model = (argv[++i] as PairOpts["model"]) || "auto";
    else if (a === "--turns") out.turns = flagNum(argv[++i], TURNS.length);
    else if (!a.startsWith("-") && a.includes("://")) out.site = a;
  }
  return out;
}

function flagNum(raw: string | undefined, fallback: number): number {
  const n = Number(raw);
  return Number.isInteger(n) && n >= 0 ? n : fallback;
}
