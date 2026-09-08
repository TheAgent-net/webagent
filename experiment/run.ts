#!/usr/bin/env bun
/**
 * Two public agents. Seller is the crawled site. Buyer talks to seller as a machine.
 * auto and live: first ready of cursor, openai, openrouter, ollama (or a test mock host).
 * Fail closed if no live LLM is ready. There is no script model.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { cursorModel, type CursorCall } from "../src/cursor.ts";
import { Harness } from "../src/harness.ts";
import { listen, type Hop } from "../src/host/listen.ts";
import { ollamaModel, openaiModel, probeOllama, type ModelCall } from "../src/models.ts";
import { attachSales } from "../src/sales/index.ts";
import { CORPUS_CORGI, hasCorpus, loadCorpus, siteBook } from "../src/site/index.ts";
import type { SitePack } from "../src/site/types.ts";
import { peerTool } from "./peer.ts";

const LIVE = ["cursor", "openai", "openrouter", "ollama", "mock"] as const;

const TURNS = [
  "Hi. I need insurance for my startup.",
  "I am Maya Chen, founder of Northline. We are a seed-stage SaaS company. We sell B2B analytics to other software teams.",
  "Our biggest worry is a customer data breach and a product outage. What should we buy, what does it cost, and should we use Corgi or a broker?",
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
    console.error("hosts still up: seller " + report.seller.url + "  buyer " + report.buyer.url);
    await new Promise(() => {});
  }
}

export type PairModel = "auto" | "live" | "cursor" | "openai" | "openrouter" | "ollama" | "mock";

export interface PairOpts {
  site: string;
  maxPages: number;
  sellerPort: number;
  buyerPort: number;
  out: string;
  keep: boolean;
  model: PairModel;
  /** Local page files. When set, skip the live crawl. */
  corpus?: string;
  /** Test only. OpenAI-compatible /v1 host. Bound as `mock`. */
  liveUrl?: string;
}

export async function runPair(opts: PairOpts) {
  const hops: Hop[] = [];
  const crawl: { url: string; status: number; ms: number }[] = [];
  const cursorCalls: CursorCall[] = [];
  const modelCalls: ModelCall[] = [];
  const onCall = (c: ModelCall) => modelCalls.push(c);

  const sellerH = new Harness();
  const buyerH = new Harness();
  const cursor = cursorModel({ onCall: (c) => cursorCalls.push(c) });
  const openai = addOpenAI(onCall);
  const openrouter = addOpenrouter(onCall);
  const ollamaUp = await probeOllama();
  const ollama = ollamaModel({ ready: ollamaUp, onCall });
  sellerH.addModel(cursor);
  sellerH.addModel(openai);
  sellerH.addModel(openrouter);
  sellerH.addModel(ollama);
  buyerH.addModel(cursorModel({ onCall: (c) => cursorCalls.push(c) }));
  buyerH.addModel(addOpenAI(onCall));
  buyerH.addModel(addOpenrouter(onCall));
  buyerH.addModel(ollamaModel({ ready: ollamaUp, onCall }));
  if (opts.liveUrl) {
    const base = opts.liveUrl.replace(/\/+$/, "");
    sellerH.addModel(openaiModel({ id: "mock", baseUrl: base, model: "mock", ready: true, onCall }));
    buyerH.addModel(openaiModel({ id: "mock", baseUrl: base, model: "mock", ready: true, onCall }));
  }

  const want = pickModel(opts.model, {
    cursor: cursor.ready !== false,
    openai: openai.ready !== false,
    openrouter: openrouter.ready !== false,
    ollama: ollamaUp,
    mock: Boolean(opts.liveUrl),
  });
  const t0 = Date.now();
  const corpusDir = pickCorpus(opts);
  let pack: SitePack;
  if (corpusDir) {
    pack = loadCorpus(corpusDir);
    crawl.push({ url: "file:" + corpusDir, status: 200, ms: Date.now() - t0 });
  } else {
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
    pack = job.pack;
  }
  const crawlMs = Date.now() - t0;
  const sellerRun = attachSales(sellerH, pack, { model: want });
  sellerRun.inject({
    vars: [
      "Interview first. Ask for company name and founder name if they are missing.",
      "If they already named the company, the founder, the field or what they sell, infer the rest and write the report.",
      "If they ask what to buy or what it costs, write the short personal readme. Do not ask another discovery question.",
      "Then call note_visitor, site_lookup on the local files, and map_risks.",
      "Use only the customer name the tool returns.",
      "Do not invent Shopify or any other name.",
      "Answer the latest visitor question. Do not repeat an old report.",
    ].join(" "),
  });
  const seller = listen(sellerH, {
    port: opts.sellerPort,
    hostname: "127.0.0.1",
    model: want,
    run: sellerRun,
    onHop: (h) => hops.push({ ...h, path: "seller:" + h.path } as Hop),
  });

  const buyerRun = buyerH.create({
    model: want,
    instruction: [
      "You are a founder who wants startup insurance.",
      "The Corgi public agent is a peer.",
      "On every human message you must call ask_peer with that message. Do not answer from memory.",
      "If the peer asks a question, tell the human that question. Do not invent a company or founder name.",
      "After the tool returns, give a short answer to the human. Quote the peer.",
      "Do not invent a dollar amount. If the peer did not state a price, say the peer did not state a price.",
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
  for (const text of TURNS) {
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
      openaiReady: openai.ready !== false,
      openaiReason: openai.reasonNotReady,
      openaiName: process.env.OPENAI_MODEL || "gpt-4o-mini",
      openrouterReady: openrouter.ready !== false,
      openrouterReason: openrouter.reasonNotReady,
      ollamaReady: ollamaUp,
      ollamaReason: ollama.reasonNotReady,
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
      corpus: pack.corpusDir ?? "",
    },
    seller: {
      url: seller.url,
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
    modelCalls,
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

export interface ModelReady {
  cursor: boolean;
  openai?: boolean;
  openrouter: boolean;
  ollama: boolean;
  mock?: boolean;
}

function pickCorpus(opts: PairOpts): string | undefined {
  if (opts.corpus) return opts.corpus;
  try {
    const host = new URL(opts.site).hostname.replace(/^www\./, "");
    if (host === "corgi.insure" && hasCorpus(CORPUS_CORGI)) return CORPUS_CORGI;
  } catch {
    return undefined;
  }
  return undefined;
}

/** Pick a bound live model. Fail closed when none is ready. */
export function pickModel(want: PairModel, ready: ModelReady): string {
  if (want === "cursor" || want === "openai" || want === "openrouter" || want === "ollama" || want === "mock") {
    return want;
  }
  const first = LIVE.find((id) => ready[id]);
  if (first) return first;
  throw new Error("no live model is ready (cursor, openai, openrouter, or ollama)");
}

function addOpenAI(onCall: (c: ModelCall) => void) {
  return openaiModel({
    id: "openai",
    baseUrl: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    apiKeyEnv: "OPENAI_API_KEY",
    onCall,
  });
}

function addOpenrouter(onCall: (c: ModelCall) => void) {
  return openaiModel({
    id: "openrouter",
    baseUrl: "https://openrouter.ai/api/v1",
    model: process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini",
    apiKeyEnv: "OPENROUTER_API_KEY",
    onCall,
  });
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
      pack.corpusDir
        ? "Seller reads local corpus files with site_lookup. No scrape API at run time."
        : "Seller answers only from the crawled pack plus site_lookup.",
      "Seller interviews first: company, founder, field, then a personal report.",
      "Buyer is a separate harness and a separate listen port.",
      "Buyer calls seller over HTTP as a machine (x-agent + JSON).",
      "Both runs bound a live LLM. Buyer and seller are separate harnesses.",
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
    "- openai ready: " + r.model.openaiReady + (r.model.openaiReason ? " (" + r.model.openaiReason + ")" : ""),
    "- openai name: `" + r.model.openaiName + "`",
    "- openrouter ready: " + r.model.openrouterReady + (r.model.openrouterReason ? " (" + r.model.openrouterReason + ")" : ""),
    "- ollama ready: " + r.model.ollamaReady + (r.model.ollamaReason ? " (" + r.model.ollamaReason + ")" : ""),
    "",
    "## Site ingest",
    "",
    "- origin: " + r.crawl.origin,
    "- pages: " + r.crawl.pages + " in " + r.crawl.ms + " ms",
    "- corpus: " + (r.crawl.corpus || "(live crawl)"),
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
    "| | Seller (Corgi) | Buyer (founder) |",
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
  if (r.modelCalls.length) {
    lines.push("");
    lines.push("## Live model calls");
    lines.push("");
    for (const c of r.modelCalls) {
      lines.push("- `" + c.id + "` " + c.ms + "ms" + (c.error ? " error: " + c.error : "") + (c.text ? " " + c.text.slice(0, 80).replace(/\n/g, " ") : ""));
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
    model: "live",
    corpus: "",
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]!;
    if (a === "--site") out.site = argv[++i] ?? out.site;
    else if (a === "--max-pages") out.maxPages = Number(argv[++i]) || out.maxPages;
    else if (a === "--seller-port") out.sellerPort = Number(argv[++i]) || 0;
    else if (a === "--buyer-port") out.buyerPort = Number(argv[++i]) || 0;
    else if (a === "--out") out.out = argv[++i] ?? out.out;
    else if (a === "--corpus") out.corpus = argv[++i] ?? "";
    else if (a === "--keep") out.keep = true;
    else if (a === "--model") {
      const v = argv[++i] ?? "live";
      if (v === "script") throw new Error("script model is removed. Use a live LLM.");
      if (
        v !== "auto" &&
        v !== "live" &&
        v !== "cursor" &&
        v !== "openai" &&
        v !== "openrouter" &&
        v !== "ollama" &&
        v !== "mock"
      ) {
        throw new Error("unknown model " + v);
      }
      out.model = v;
    }
    else if (!a.startsWith("-") && a.includes("://")) out.site = a;
  }
  return out;
}
