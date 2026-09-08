import { describe, expect, test } from "bun:test";
import { pickModel, runPair } from "../experiment/run.ts";
import { Harness } from "../src/harness.ts";
import { openaiModel } from "../src/models.ts";
import { peerTool } from "../experiment/peer.ts";

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
    const llm = mockLlm();
    try {
      const report = await runPair({
        site: String(site.url),
        maxPages: 10,
        sellerPort: 0,
        buyerPort: 0,
        out: "experiment/last-report.json",
        keep: false,
        model: "mock",
        liveUrl: llm.url + "v1",
      });
      try {
        expect(report.seller.url).toMatch(/^http/);
        expect(report.buyer.url).toMatch(/^http/);
        expect(report.seller.runId).not.toBe(report.buyer.runId);
        expect(report.model.used).toBe("mock");
        expect(report.crawl.pages).toBeGreaterThan(0);
        expect(report.turns.length).toBe(3);
        expect(report.turns[0]!.buyer.length).toBeGreaterThan(0);
        expect(report.turns[0]!.seller.length).toBeGreaterThan(0);
        expect(report.turns.some((t) => /\$2000|quote|minutes|Seed|company|founder/i.test(t.seller))).toBe(true);
        expect(report.analysis.peerCalls).toBeGreaterThan(0);
        expect(report.hops.some((h) => h.kind === "machine")).toBe(true);
        const sellerCard = report.seller.card as { type?: string };
        expect(sellerCard.type).toBe("webagent");
      } finally {
        report.seller.stop();
        report.buyer.stop();
      }
    } finally {
      llm.stop();
      site.stop(true);
    }
  }, 30000);

  test("auto and live fail closed when no LLM is ready", () => {
    const all = { cursor: true, openrouter: true, ollama: true };
    expect(pickModel("auto", all)).toBe("cursor");
    expect(pickModel("auto", { cursor: false, openai: true, openrouter: true, ollama: true })).toBe("openai");
    expect(pickModel("auto", { cursor: false, openrouter: true, ollama: true })).toBe("openrouter");
    expect(pickModel("auto", { cursor: false, openrouter: false, ollama: true })).toBe("ollama");
    expect(pickModel("auto", { cursor: false, openrouter: false, ollama: false, openai: true })).toBe("openai");
    expect(pickModel("auto", { cursor: false, openrouter: false, ollama: false, mock: true })).toBe("mock");
    expect(pickModel("live", { cursor: false, openrouter: false, ollama: true })).toBe("ollama");
    expect(pickModel("openai", { cursor: false, openrouter: false, ollama: true, openai: true })).toBe("openai");
    expect(pickModel("mock", { cursor: false, openrouter: false, ollama: true, mock: true })).toBe("mock");
    expect(pickModel("openrouter", all)).toBe("openrouter");
    expect(() => pickModel("auto", { cursor: false, openrouter: false, ollama: false })).toThrow(/no live model/);
    expect(() => pickModel("live", { cursor: false, openrouter: false, ollama: false })).toThrow(/no live model/);
  });

  test("two live models talk over ask_peer", async () => {
    const llm = mockLlm();
    try {
      const sellerH = new Harness();
      const buyerH = new Harness();
      const sellerModel = openaiModel({
        id: "live-seller",
        baseUrl: llm.url + "v1",
        model: "mock",
        ready: true,
      });
      const buyerModel = openaiModel({
        id: "live-buyer",
        baseUrl: llm.url + "v1",
        model: "mock",
        ready: true,
      });
      sellerH.addModel(sellerModel);
      buyerH.addModel(buyerModel);
      const seller = sellerH.create({
        model: "live-seller",
        instruction: "You sell insurance. Use site_lookup.",
        tools: [
          {
            name: "site_lookup",
            description: "Search the pack",
            schema: { type: "object", properties: { query: { type: "string" } } },
            async call() {
              return { hits: [{ title: "Cost", snippet: "Seed packages start at $2000." }] };
            },
          },
        ],
      });
      const sellerHost = Bun.serve({
        port: 0,
        fetch: async (req) => {
          if (new URL(req.url).pathname === "/chat" && req.method === "POST") {
            const body = (await req.json()) as { text?: string };
            seller.inject({ text: "[machine] " + (body.text ?? "") });
            const ex = await seller.start();
            return Response.json({ lastText: ex.lastText, id: seller.id });
          }
          return new Response("no", { status: 404 });
        },
      });
      try {
        const buyer = buyerH.create({
          model: "live-buyer",
          instruction: "Ask the peer, then quote it.",
          tools: [peerTool(String(sellerHost.url).replace(/\/+$/, ""))],
        });
        buyer.inject({ text: "[human] What does seed coverage cost?" });
        const ex = await buyer.start();
        expect(ex.lastText).toMatch(/\$2000|Corgi|peer|seed/i);
        expect(seller.lastText).toMatch(/\$2000|Seed/i);
        expect(llm.calls).toBeGreaterThan(1);
      } finally {
        sellerHost.stop(true);
      }
    } finally {
      llm.stop();
    }
  }, 15000);
});

function mockLlm() {
  let calls = 0;
  const server = Bun.serve({
    port: 0,
    fetch: async (req) => {
      calls++;
      const body = (await req.json()) as {
        messages?: { role: string; content?: string }[];
        tools?: { function?: { name?: string } }[];
      };
      const last = body.messages?.[body.messages.length - 1];
      const names = (body.tools ?? []).map((t) => t.function?.name ?? "");
      if (last?.role === "tool") {
        const raw = String(last.content ?? "");
        const text =
          /\$2,?000|Seed|quote|minutes/i.test(raw)
            ? "Seed packages start at $2000. Quotes in minutes."
            : raw.slice(0, 240);
        return Response.json({ choices: [{ message: { content: text } }] });
      }
      const tool = names.includes("ask_peer")
        ? "ask_peer"
        : names.includes("map_risks")
          ? "map_risks"
          : names.includes("site_lookup")
            ? "site_lookup"
            : "";
      if (tool) {
        const args =
          tool === "ask_peer"
            ? { text: "What does seed coverage cost?" }
            : tool === "map_risks"
              ? { category: "SaaS", does: "seed-stage SaaS founder" }
              : { query: "seed cost" };
        return Response.json({
          choices: [
            {
              message: {
                content: tool === "ask_peer" ? "Asking the Corgi agent." : "Looking up coverage.",
                tool_calls: [{ id: "c1", function: { name: tool, arguments: JSON.stringify(args) } }],
              },
            },
          ],
        });
      }
      return Response.json({ choices: [{ message: { content: "No tool is bound." } }] });
    },
  });
  return {
    url: String(server.url),
    get calls() {
      return calls;
    },
    stop: () => server.stop(true),
  };
}
