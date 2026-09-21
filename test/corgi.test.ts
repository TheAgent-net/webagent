import { describe, expect, test } from "bun:test";
import { Harness } from "../src/harness.ts";
import { buildPack } from "../src/site/pack.ts";
import type { CrawlState } from "../src/site/crawl.ts";
import {
  attachSales,
  mapRisks,
  reportText,
  vulnerabilityReport,
  quoteGuideTool,
  corgiAgentCard,
  corgiConnectPrompt,
  corgiCopyPrompt,
  corgiHost,
  Sessions,
  speedCorgiHtml,
} from "../src/sales/index.ts";
import { Room } from "../src/host/room.ts";
import { scorePrompt } from "../src/sales/gepa.ts";
import { SALES_V2 } from "../src/sales/seeds.ts";
import { extractKnown, knownPin } from "../src/sales/known.ts";

function corgiCrawl(): CrawlState {
  return {
    origin: "https://www.corgi.insure",
    pages: [
      {
        url: "https://www.corgi.insure/",
        status: 200,
        title: "Corgi Insurance",
        description: "Startup insurance, quoted in minutes",
        headings: ["Seed", "Series A", "Growth"],
        text: "Business Insurance at the Speed of Compute. Get a quote in minutes. Pre-seed & Seed: CGL, D&O, Tech E&O, Cyber. About $2,000–$4,000/yr.",
        links: [],
        forms: [],
        gated: false,
      },
      {
        url: "https://www.corgi.insure/customers/intryc",
        status: 200,
        title: "Intryc - Corgi Customer",
        description: "Intryc customer story",
        headings: ["Intryc"],
        text: "Intryc is a SaaS company that chose Corgi for their startup insurance.",
        links: [],
        forms: [],
        gated: false,
      },
      {
        url: "https://www.corgi.insure/customers/imagine-ai",
        status: 200,
        title: "Imagine AI - Corgi Customer",
        description: "Imagine AI customer story",
        headings: ["Imagine AI"],
        text: "Imagine AI builds LLM agents and chose Corgi for E&O and cyber coverage.",
        links: [],
        forms: [],
        gated: false,
      },
    ],
    pending: [],
    seen: new Set(),
    cookies: "",
  };
}

describe("vulnerability assessment", () => {
  test("AI startup gets vulnerability list with likelihood estimates", () => {
    const note = mapRisks({ category: "AI", does: "LLM agents for customer support" });
    expect(note.vulnerabilities.length).toBeGreaterThanOrEqual(3);
    expect(note.vulnerabilities.some((v) => v.likelihood === "high")).toBe(true);
    expect(note.vulnerabilities.every((v) => v.pctChance.length > 0)).toBe(true);
    expect(note.vulnerabilities.every((v) => v.coverageLine.length > 0)).toBe(true);
    expect(note.vulnerabilities.every((v) => v.typicalLimit.length > 0)).toBe(true);
    expect(note.estimatedPremium).toContain("$");
    expect(note.proof.name).toBe("Imagine AI");
  });

  test("SaaS startup gets different vulnerabilities than AI", () => {
    const saas = mapRisks({ category: "SaaS", does: "B2B analytics platform" });
    const ai = mapRisks({ category: "AI", does: "LLM agents" });
    expect(saas.offer).not.toBe(ai.offer);
    expect(saas.estimatedPremium).not.toBe(ai.estimatedPremium);
    expect(saas.proof.name).toBe("Intryc");
  });

  test("fintech gets higher-risk cyber vulnerabilities", () => {
    const note = mapRisks({ category: "fintech", does: "payment processing for SMBs" });
    expect(note.vulnerabilities.some((v) => /fraud|funds/i.test(v.risk))).toBe(true);
    expect(note.estimatedPremium).toContain("$");
    expect(note.offer).toMatch(/cyber/i);
  });

  test("health-tech gets HIPAA/PHI vulnerabilities", () => {
    const note = mapRisks({ category: "health-tech", does: "patient data management" });
    expect(note.vulnerabilities.some((v) => /HIPAA|PHI/i.test(v.risk))).toBe(true);
  });

  test("crypto gets protocol and regulatory risks", () => {
    const note = mapRisks({ category: "crypto", does: "DeFi lending protocol" });
    expect(note.vulnerabilities.some((v) => /smart contract|protocol|hack/i.test(v.risk))).toBe(true);
    expect(note.vulnerabilities.some((v) => /regulatory|securities/i.test(v.risk))).toBe(true);
  });

  test("unknown category falls back gracefully", () => {
    const note = mapRisks({ category: "underwater basket weaving", does: "artisan goods" });
    expect(note.vulnerabilities.length).toBeGreaterThanOrEqual(3);
    expect(note.offer).toMatch(/Seed/i);
    expect(note.estimatedPremium).toContain("$");
  });

  test("stage is preserved in the note", () => {
    const note = mapRisks({ category: "SaaS", does: "analytics", stage: "Series A" });
    expect(note.stage).toBe("Series A");
  });
});

describe("vulnerability report text", () => {
  test("vulnerability report is a short pitch with coverage and a contact ask", () => {
    const note = mapRisks({ category: "AI", does: "LLM agents" });
    const report = vulnerabilityReport(note);
    expect(report).toContain("What's at risk:");
    expect(report).toContain("How Corgi covers it:");
    expect(report).toContain("Why Corgi:");
    expect(report).toContain("If you are not insured:");
    expect(report).toContain("Usually");
    expect(report).toContain("name and best email");
    expect(report).toContain("$");
    expect(report).toContain("Tech E&O");
    expect(note.vulnerabilities[0] && report.includes(note.vulnerabilities[0].pctChance)).toBe(true);
  });

  test("short pitch includes estimated premium, chance, uninsured cost, and contact ask", () => {
    const note = mapRisks({ category: "SaaS", does: "B2B analytics" });
    const report = reportText(note);
    expect(report).toContain("How Corgi covers it:");
    expect(report).toContain("$");
    expect(report).toContain("name and best email");
    expect(report).toContain("If you are not insured:");
    expect(report).toContain("Usually");
    expect(report).toMatch(/15–20%|25–30%/);
  });
});

describe("quote guide tool", () => {
  test("returns form fields organized by section", async () => {
    const tool = quoteGuideTool();
    expect(tool.name).toBe("quote_guide");
    const result = (await tool.call({ stage: "seed", category: "SaaS" })) as any;
    expect(result.steps.length).toBeGreaterThanOrEqual(4);
    expect(result.steps[0].section).toBe("Company basics");
    expect(result.steps[0].fields.length).toBeGreaterThanOrEqual(3);
    expect(result.steps.some((s: any) => s.section === "Coverage selection")).toBe(true);
    expect(result.steps.some((s: any) => s.section === "Risk questions")).toBe(true);
    expect(result.cta.fast).toContain("corgi.insure");
    expect(result.cta.guided).toContain("book-a-demo");
  });
});

describe("corgi agent card", () => {
  test("card has corgi-specific skills and branding", () => {
    const h = new Harness();
    const room = new Room(h);
    const card = corgiAgentCard("https://corgi.test", room);
    expect(card.name).toBe("Corgi");
    expect(card.type).toBe("webagent");
    expect(card.description).toContain("insurance");
    expect(card.description).toContain("vulnerabilities");
    expect(card.skills.some((s: any) => s.id === "risk-assessment")).toBe(true);
    expect(card.skills.some((s: any) => s.id === "quote-guide")).toBe(true);
    expect(card.documentationUrl).toBe("https://www.corgi.insure");
    expect(card.chat).toBe("https://corgi.test/chat");
    expect(card.mcp).toBe("https://corgi.test/mcp");
  });

  test("connect prompt guides agents to provide startup details", () => {
    const prompt = corgiConnectPrompt("https://corgi.test");
    expect(prompt).toContain("Corgi");
    expect(prompt).toContain("stage");
    expect(prompt).toContain("industry");
    expect(prompt).toContain("POST");
    expect(prompt).toContain("/chat");
    expect(prompt).toContain("vulnerabilities");
  });

  test("connect prompt includes session when provided", () => {
    const prompt = corgiConnectPrompt("https://corgi.test", "s123");
    expect(prompt).toContain("s123");
    expect(prompt).toContain("Stay in this conversation");
  });

  test("copy prompt is a one-liner to talk to Corgi", () => {
    const prompt = corgiCopyPrompt("https://corgi.test");
    expect(prompt).toBe("Go talk to the Corgi agent at https://corgi.test and figure out.");
    expect(prompt.includes("\n")).toBe(false);
  });
});

describe("corgi host routing", () => {
  test("human GET / returns HTML with corgi branding", async () => {
    const h = new Harness();
    const pack = buildPack(corgiCrawl());
    const run = attachSales(h, pack, { model: "echo" });
    const room = new Room(h, { run, model: "echo" });
    const sessions = new Sessions(h, room);
    const fetchFn = corgiHost(h, room, "https://corgi.test", sessions);

    const res = await fetchFn(
      new Request("http://t/", {
        headers: { Accept: "text/html", "User-Agent": "Mozilla/5.0", "Sec-Fetch-Dest": "document" },
      }),
    );
    expect(res.headers.get("content-type")).toContain("text/html");
    const html = await res.text();
    expect(html).toContain("Corgi");
    expect(html).toContain("Insurance");
    expect(html).toContain("Speed of Compute");
    expect(html).toContain("wa-fab");
    expect(html).toContain("wa-chip");
    expect(html).toContain("#FF5C00");
    expect(html).toContain("#FDFBF6");
    expect(html).toContain("#ff5c00");
    expect(html).toContain("#ff7d33");
    expect(html).toContain("#191919");
    expect(html).toContain("wa-btn-orange");
    expect(html).toContain("wa-press");
    expect(html).toContain("--pressable-depth:4px");
    expect(html).toContain("superellipse(1.6)");
    expect(html).toContain("#cc4a00");
    expect(html).toContain("#626262");
    expect(html).toContain("#e1e1e1");
    expect(html).toContain("Ask Corgi");
    expect(html).toContain("lastText");
    expect(html).toContain("Go talk to the Corgi agent");
    expect(html).toContain("what's at risk");
    expect(html).toContain("not insured");
    expect(html).toContain("ask for your email");
    expect(html).not.toContain("You reached Corgi");
  });

  test("machine GET / returns agent card JSON", async () => {
    const h = new Harness();
    const pack = buildPack(corgiCrawl());
    const run = attachSales(h, pack, { model: "echo" });
    const room = new Room(h, { run, model: "echo" });
    const sessions = new Sessions(h, room);
    const fetchFn = corgiHost(h, room, "https://corgi.test", sessions);

    const res = await fetchFn(
      new Request("http://t/", { headers: { Accept: "application/json", "User-Agent": "curl/8" } }),
    );
    const card = (await res.json()) as any;
    expect(card.type).toBe("webagent");
    expect(card.name).toBe("Corgi");
    expect(card.skills.some((s: any) => s.id === "risk-assessment")).toBe(true);
    expect(res.headers.get("access-control-allow-origin")).toBe("*");
  });

  test("POST /chat returns a response with session", async () => {
    const h = new Harness();
    const pack = buildPack(corgiCrawl());
    const run = attachSales(h, pack, { model: "echo" });
    const room = new Room(h, { run, model: "echo" });
    const sessions = new Sessions(h, room);
    const fetchFn = corgiHost(h, room, "https://corgi.test", sessions);

    const res = await fetchFn(
      new Request("http://t/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: "We are a seed SaaS startup" }),
      }),
    );
    const body = (await res.json()) as any;
    expect(body.lastText).toContain("seed SaaS startup");
    expect(body.session).toBeTruthy();
    expect(body.runId).toBeTruthy();
  });

  test("same session keeps conversation context", async () => {
    const h = new Harness();
    const pack = buildPack(corgiCrawl());
    const run = attachSales(h, pack, { model: "echo" });
    const room = new Room(h, { run, model: "echo" });
    const sessions = new Sessions(h, room);
    const fetchFn = corgiHost(h, room, "https://corgi.test", sessions);

    const first = await fetchFn(
      new Request("http://t/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: "hello from corgi test", session: "corgi-test-1" }),
      }),
    );
    const firstBody = (await first.json()) as any;
    expect(firstBody.session).toBe("corgi-test-1");

    const second = await fetchFn(
      new Request("http://t/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: "follow up", session: "corgi-test-1" }),
      }),
    );
    const secondBody = (await second.json()) as any;
    expect(secondBody.runId).toBe(firstBody.runId);
    const chatRoom = sessions.get("corgi-test-1")!;
    const pin = chatRoom.run.getContext().filter((m) => m.role === "pin").pop()?.content ?? "";
    expect(pin.toLowerCase()).toContain("do not re-ask");
  });

  test("GET /agent.json returns card", async () => {
    const h = new Harness();
    const room = new Room(h);
    const sessions = new Sessions(h, room);
    const fetchFn = corgiHost(h, room, "https://corgi.test", sessions);

    const res = await fetchFn(new Request("http://t/agent.json"));
    expect(res.ok).toBe(true);
    const card = (await res.json()) as any;
    expect(card.name).toBe("Corgi");
  });

  test("serves captured Corgi homepage assets", async () => {
    const h = new Harness();
    const room = new Room(h);
    const sessions = new Sessions(h, room);
    const fetchFn = corgiHost(h, room, "https://corgi.test", sessions);
    const logo = await fetchFn(new Request("http://t/images/corgi%20logo%20vector.svg"));
    expect(logo.ok).toBe(true);
    expect(logo.headers.get("content-type")).toContain("svg");
    const gz = await fetchFn(
      new Request("http://t/images/corgi%20logo%20vector.svg", { headers: { "Accept-Encoding": "gzip" } }),
    );
    expect(gz.headers.get("content-encoding")).toBe("gzip");
    expect(gz.headers.get("cache-control") ?? "").toContain("max-age");
  });

  test("speedCorgiHtml collapses image optimizer URLs and drops trackers", () => {
    const raw =
      '<img src="/_next/image?url=%2Fimages%2Fhero.webp&amp;w=640&amp;q=75" srcset="/_next/image?url=%2Fimages%2Fhero.webp&amp;w=750&amp;q=75 750w"/>' +
      '<script src="https://www.googletagmanager.com/gtag/js?id=G-X"></script>' +
      '<script src="/_next/static/chunks/app.js"></script>';
    const out = speedCorgiHtml(raw);
    expect(out).toContain("/images/hero.webp");
    expect(out).not.toContain("/_next/image");
    expect(out).not.toContain("googletagmanager");
    expect(out).toContain("/_next/static/chunks/app.js");
  });

  test("GET /llms.txt returns connect prompt", async () => {
    const h = new Harness();
    const room = new Room(h);
    const sessions = new Sessions(h, room);
    const fetchFn = corgiHost(h, room, "https://corgi.test", sessions);

    const res = await fetchFn(new Request("http://t/llms.txt"));
    expect(res.ok).toBe(true);
    const text = await res.text();
    expect(text).toContain("Corgi");
    expect(text).toContain("POST");
  });
});

describe("known facts from the thread", () => {
  test("seed SaaS chip fills product, stage, category and is ready for map_risks", () => {
    const k = extractKnown([
      { role: "user", content: "We are a seed-stage SaaS startup building B2B analytics" },
    ]);
    expect(k.stage).toBe("seed");
    expect(k.category).toBe("SaaS");
    expect(k.does).toMatch(/B2B analytics/i);
    expect(k.readyForRisks).toBe(true);
    const pin = knownPin([{ role: "user", content: "We are a seed-stage SaaS startup building B2B analytics" }]);
    expect(pin).toContain("Call map_risks this turn");
    expect(pin).toContain("do not re-ask");
  });

  test("does not forget first-turn facts on a follow-up", () => {
    const k = extractKnown([
      { role: "user", content: "[human] We are a seed-stage SaaS startup building B2B analytics" },
      { role: "assistant", content: "What made insurance come up?" },
      { role: "user", content: "[human] An enterprise customer asked for a COI." },
    ]);
    expect(k.category).toBe("SaaS");
    expect(k.stage).toBe("seed");
    expect(k.whyNow).toMatch(/COI/i);
    expect(k.readyForRisks).toBe(true);
  });

  test("infers AI from LLM agents", () => {
    const k = extractKnown([{ role: "user", content: "We are an AI startup building LLM agents, just raised our seed round" }]);
    expect(k.category).toBe("AI");
    expect(k.stage).toBe("seed");
    expect(k.readyForRisks).toBe(true);
  });
});

describe("sales prompt GEPA scoring", () => {
  test("v2 prompt scores high on inquisitive goal", () => {
    const score = scorePrompt(SALES_V2);
    expect(score.inquisitive).toBeGreaterThan(0.5);
    expect(score.discover).toBeGreaterThan(0.5);
    expect(score.risks).toBeGreaterThan(0);
    expect(score.report).toBeGreaterThan(0);
    expect(score.short).toBeGreaterThan(0.5);
    expect(SALES_V2.toLowerCase()).toContain("contact details");
    expect(SALES_V2.toLowerCase()).toContain("how corgi will insure");
    expect(SALES_V2.toLowerCase()).toContain("not insured");
    expect(SALES_V2.toLowerCase()).toContain("probability");
    expect(SALES_V2.toLowerCase()).toContain("never re-ask");
    expect(SALES_V2.toLowerCase()).toContain("last answer");
  });
});

describe("attachSales with quote_guide", () => {
  test("binds map_risks and quote_guide tools", () => {
    const h = new Harness();
    const pack = buildPack(corgiCrawl());
    const run = attachSales(h, pack, { model: "echo" });
    const tools = run.listTools();
    expect(tools.some((t) => t.name === "map_risks")).toBe(true);
    expect(tools.some((t) => t.name === "quote_guide")).toBe(true);
    expect(tools.some((t) => t.name === "site_lookup")).toBe(true);
  });
});
