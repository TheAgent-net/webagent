import { describe, expect, test } from "bun:test";
import { pickModel, printHandoff, runPair } from "../experiment/run.ts";
import { Harness } from "../src/harness.ts";
import { listen } from "../src/host/listen.ts";
import { openaiModel } from "../src/models.ts";
import { attachSales } from "../src/sales/index.ts";
import { buildPack } from "../src/site/pack.ts";
import type { CrawlState } from "../src/site/crawl.ts";

function mockSite() {
  return Bun.serve({
    port: 0,
    fetch(req) {
      const url = new URL(req.url);
      if (url.pathname === "/robots.txt") return new Response("Sitemap: /sitemap.xml\n");
      if (url.pathname === "/sitemap.xml") {
        return new Response(
          `<?xml version="1.0"?><urlset><loc>${url.origin}/</loc><loc>${url.origin}/quote</loc><loc>${url.origin}/help</loc></urlset>`,
          { headers: { "content-type": "application/xml" } },
        );
      }
      if (url.pathname === "/quote") {
        return html("Get a quote", `<h1>Get a quote</h1><p>Seed packages start at $2000. Quotes in minutes.</p>`);
      }
      if (url.pathname === "/help") {
        return html("Help", `<h1>Help</h1><p>A broker takes days. We do not.</p>`);
      }
      return html(
        "Corgi Mock",
        `<meta name="description" content="Startup insurance in minutes.">
         <h1>Startup insurance</h1><p>CGL D&amp;O Cyber for seed founders.</p>
         <a href="/quote">Get a quote</a><a href="/help">Help</a>`,
      );
    },
  });
}

function html(title: string, body: string) {
  return new Response(`<!doctype html><html><head><title>${title}</title></head><body>${body}</body></html>`, {
    headers: { "content-type": "text/html" },
  });
}

describe("pair experiment", () => {
  test("two hosts, buyer asks seller, hops are recorded", async () => {
    const site = mockSite();
    try {
      const report = await runPair({
        site: String(site.url),
        maxPages: 10,
        sellerPort: 0,
        buyerPort: 0,
        out: "experiment/last-report.json",
        keep: false,
        model: "script",
      });
      try {
        expect(report.seller.url).toMatch(/^http/);
        expect(report.buyer.url).toMatch(/^http/);
        expect(report.seller.runId).not.toBe(report.buyer.runId);
        expect(report.model.used).toBe("script");
        expect(report.crawl.pages).toBeGreaterThan(0);
        expect(report.turns.length).toBe(3);
        expect(report.turns[0]!.buyer.length).toBeGreaterThan(0);
        expect(report.turns[0]!.seller.length).toBeGreaterThan(0);
        expect(report.turns[0]!.seller).toMatch(/\$2000|quote|minutes|Seed/i);
        expect(report.analysis.peerCalls).toBeGreaterThan(0);
        expect(report.hops.some((h) => h.kind === "machine")).toBe(true);
        const sellerCard = report.seller.card as { type?: string };
        expect(sellerCard.type).toBe("webagent");
      } finally {
        report.seller.stop();
        report.buyer.stop();
      }
    } finally {
      site.stop(true);
    }
  }, 30000);

  test("turns 0 keeps a seller and skips canned buyer turns", async () => {
    const site = mockSite();
    try {
      const report = await runPair({
        site: String(site.url),
        maxPages: 10,
        sellerPort: 0,
        buyerPort: 0,
        out: "experiment/last-report.json",
        keep: false,
        model: "script",
        turns: 0,
      });
      try {
        expect(report.turns.length).toBe(0);
        expect(report.seller.url).toMatch(/^http/);
        expect(report.seller.runId.length).toBeGreaterThan(0);
        expect(report.analysis.peerCalls).toBe(0);
        const card = (await fetch(report.seller.url + "/agent.json").then((r) => r.json())) as { runId: string };
        expect(card.runId).toBe(report.seller.runId);
      } finally {
        report.seller.stop();
        report.buyer.stop();
      }
    } finally {
      site.stop(true);
    }
  }, 30000);

  test("handoff loopback uses the listen port, not a tunnel port", () => {
    const lines: string[] = [];
    const prev = console.error;
    console.error = (m: unknown) => {
      lines.push(String(m));
    };
    try {
      printHandoff({
        seller: { url: "https://agent.example", port: 8787 },
        model: { used: "openrouter" },
      } as Parameters<typeof printHandoff>[0]);
    } finally {
      console.error = prev;
    }
    expect(lines.some((l) => l.includes("127.0.0.1:8787"))).toBe(true);
    expect(lines.some((l) => l.includes("127.0.0.1:443"))).toBe(false);
  });

  test("auto picks cursor, then openrouter, then script", () => {
    expect(pickModel("auto", true, true)).toBe("cursor");
    expect(pickModel("auto", false, true)).toBe("openrouter");
    expect(pickModel("auto", false, false)).toBe("script");
    expect(pickModel("openrouter", true, true)).toBe("openrouter");
  });
});

const live = Boolean(process.env.OPENROUTER_API_KEY);

describe("openrouter live", () => {
  test.skipIf(!live)("auto is openrouter and two chats share one run", async () => {
    const h = new Harness();
    h.addModel(
      openaiModel({
        id: "openrouter",
        baseUrl: "https://openrouter.ai/api/v1",
        model: process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini",
        apiKeyEnv: "OPENROUTER_API_KEY",
      }),
    );
    expect(h.getAvailableModels().find((m) => m.id === "openrouter")?.ready).toBe(true);
    const pack = buildPack(liveCrawl());
    const run = attachSales(h, pack, { model: "openrouter" });
    const hosted = listen(h, { port: 0, hostname: "127.0.0.1", run });
    try {
      const card = (await fetch(hosted.url + "/agent.json").then((r) => r.json())) as { runId: string };
      expect(card.runId).toBe(hosted.room.run.id);
      const a = await chat(hosted.url, "Remember the word pomegranate. Reply in one short sentence.");
      expect(a.id).toBe(card.runId);
      expect(a.model).toBe("openrouter");
      const afterFirst = hosted.room.run.getContext().length;
      const b = await chat(hosted.url, "What word did I ask you to remember?");
      expect(b.id).toBe(card.runId);
      expect(b.model).toBe("openrouter");
      const ctx = hosted.room.run.getContext().map((m) => m.content).join("\n");
      expect(ctx).toContain("pomegranate");
      expect(hosted.room.run.getContext().length).toBeGreaterThan(afterFirst);
    } finally {
      hosted.stop();
    }
  }, 90000);
});

async function chat(url: string, text: string) {
  const res = await fetch(url + "/chat", {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json", "user-agent": "curl/8" },
    body: JSON.stringify({ text }),
  });
  expect(res.ok).toBe(true);
  return (await res.json()) as { id: string; model: string; lastText: string; step: number };
}

function liveCrawl(): CrawlState {
  return {
    origin: "https://www.corgi.insure",
    pages: [
      {
        url: "https://www.corgi.insure/",
        status: 200,
        title: "Corgi",
        description: "Startup insurance",
        headings: ["Seed"],
        text: "Quote in minutes. Seed packages start at $2000.",
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
