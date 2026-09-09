import { describe, expect, test } from "bun:test";
import { runPair } from "../experiment/run.ts";

delete process.env.WEBAGENT_PUBLIC_URL;

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
});
