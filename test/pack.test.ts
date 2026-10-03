import { describe, expect, test } from "bun:test";
import { Harness } from "../src/harness.ts";
import { host } from "../src/host/host.ts";
import { Room } from "../src/host/room.ts";
import { Sessions } from "../src/host/sessions.ts";
import { extractBrand, loadPackConfig, renderCopyPrompt } from "../src/pack/index.ts";
import { DEFAULT_POLICY, indexPages, searchHits, searchHitsHybrid } from "../src/retrieve/index.ts";
import { hashedEmbed } from "../src/retrieve/embed.ts";
import { reasoningEffortFor } from "../src/models.ts";
import { packWidget } from "../src/widget/widget.ts";
import type { PageShot } from "../src/site/types.ts";

const HOME = `<!doctype html><html><head>
<title>Acme Voice | Home</title>
<meta name="description" content="Acme builds quiet phones for teams."/>
<meta name="theme-color" content="#112233"/>
<meta property="og:site_name" content="Acme Voice"/>
</head><body><h1>Quiet phones</h1><p>For support teams.</p></body></html>`;

function page(url: string, title: string, text: string): PageShot {
  return {
    url,
    status: 200,
    title,
    description: title,
    headings: [title],
    text: text + " " + "x".repeat(80),
    links: [],
    forms: [],
    gated: false,
  };
}

describe("pack load", () => {
  test("loads packs/smallest brand, model, retrieve priors, copy prompt", () => {
    const config = loadPackConfig("packs/smallest");
    expect(config.id).toBe("smallest");
    expect(config.brand.name).toBe("Smallest AI");
    expect(config.brand.colors.ink).toBe("#191919");
    expect(config.brand.fabLabel).toBe("Ask Smallest");
    expect(config.model?.id).toBe("gpt-6-astra");
    expect(config.host?.port).toBe(8789);
    expect(config.host?.publicUrl).toContain("smallest.agentnet.it.com");
    expect(config.retrieve?.preferTerms).toContain("atoms");
    expect(config.widget.copyPrompt).toContain("Talk to the Smallest agents at {{chat}}");
    const copy = renderCopyPrompt(config, "https://smallest.agentnet.it.com");
    expect(copy).toContain("Talk to the Smallest agents at https://smallest.agentnet.it.com/chat");
    expect(copy).toContain("never GET, browse, or probe");
  });
});

describe("from-url brand extract", () => {
  test("reads name, tagline, theme-color from homepage HTML", async () => {
    const brand = await extractBrand(HOME, "https://acme.test");
    expect(brand.name).toBe("Acme Voice");
    expect(brand.tagline).toMatch(/quiet phones/i);
    expect(brand.colors.accent).toBe("#112233");
    expect(brand.fabLabel).toContain("Acme");
  });

  test("from-url writes a pack from mocked fetch", async () => {
    const { mkdtempSync, readFileSync, rmSync } = await import("node:fs");
    const { tmpdir } = await import("node:os");
    const { join } = await import("node:path");
    const { fromUrl } = await import("../src/pack/from-url.ts");
    const out = mkdtempSync(join(tmpdir(), "wa-pack-"));
    const fetchFn = (async (input: string | URL | Request) => {
      const url = String(input);
      if (url.includes("llms.txt") || url.includes("robots.txt") || url.includes("sitemap")) {
        return new Response("no", { status: 404 });
      }
      return new Response(HOME, { headers: { "Content-Type": "text/html" } });
    }) as typeof fetch;
    try {
      const got = await fromUrl("https://acme.test/", { out, fetch: fetchFn, embed: false, maxPages: 2 });
      expect(got.config.brand.name).toBe("Acme Voice");
      expect(got.config.widget.markdown).toBe(true);
      const written = JSON.parse(readFileSync(join(out, "pack.json"), "utf8")) as { id: string; origin: string };
      expect(written.origin).toBe("https://acme.test");
      expect(readFileSync(join(out, "instruction.md"), "utf8")).toMatch(/Acme Voice/);
    } finally {
      rmSync(out, { recursive: true, force: true });
    }
  });
});

describe("hybrid retrieve without product names", () => {
  test("indexes and ranks generic pages", async () => {
    const pages = [
      page("https://acme.test/docs/start", "Quick start", "Create an agent on the dashboard and mark it live."),
      page("https://acme.test/docs/other", "Other stack", "Keep your own pipeline plugin if you must."),
    ];
    const chunks = indexPages(pages, DEFAULT_POLICY);
    expect(chunks.length).toBeGreaterThanOrEqual(2);
    expect(chunks.every((c) => c.kind === "page")).toBe(true);
    const hits = searchHits({ origin: "https://acme.test", pages, chunks }, "how do I start");
    expect(hits[0]?.url).toContain("/docs/start");
    const hybrid = await searchHitsHybrid(
      { origin: "https://acme.test", pages, chunks },
      "stand up an agent",
      hashedEmbed,
      DEFAULT_POLICY,
    );
    expect(hybrid.length).toBeGreaterThan(0);
    const blob = JSON.stringify({ chunks, hits, hybrid });
    expect(blob).not.toMatch(/smallest|composio|corgi/i);
  });
});

describe("widget from brand", () => {
  test("emits CSS variables and copy prompt from pack brand", () => {
    const config = loadPackConfig("packs/smallest");
    const html = packWidget("https://smallest.agentnet.it.com", "run-1", config);
    expect(html).toContain("--wa-ink: #191919");
    expect(html).toContain("--wa-paper: #ffffff");
    expect(html).toContain("Ask Smallest");
    expect(html).toContain("Talk to the Smallest agents");
    expect(html).toContain("innerHTML = rich(");
    expect(html).toContain("getElementById(\"wa-hint\")");
    expect(html).toContain("HINTS");
    expect(html).toContain("wa-lead");
    expect(html).toContain("wa-ask");
  });
});

describe("luna reasoning", () => {
  test("Luna defaults to medium; other GPT-5 stay none unless set", () => {
    expect(reasoningEffortFor("gpt-5.6-luna")).toBe("medium");
    expect(reasoningEffortFor("gpt-5.6-luna", "high")).toBe("high");
    expect(reasoningEffortFor("gpt-5.4")).toBe("none");
    expect(reasoningEffortFor("gpt-6-astra")).toBeUndefined();
  });

  test("Luna with tools uses /responses; without tools uses chat completions", async () => {
    const { Assembler } = await import("../src/assembler.ts");
    const { openaiModel } = await import("../src/models.ts");
    const calls: { url: string; body: Record<string, unknown> }[] = [];
    const realFetch = globalThis.fetch;
    process.env.WA_TEST_KEY = "k";
    globalThis.fetch = (async (url: string, init: RequestInit) => {
      calls.push({ url, body: JSON.parse(String(init.body)) });
      const json = url.endsWith("/responses")
        ? { output: [{ type: "message", content: [{ type: "output_text", text: "ok" }] }] }
        : { choices: [{ message: { content: "ok" } }] };
      return new Response(JSON.stringify(json));
    }) as typeof fetch;
    try {
      const model = openaiModel({ id: "o", baseUrl: "https://api.test/v1", model: "gpt-5.6-luna", apiKeyEnv: "WA_TEST_KEY" });
      const tool = { name: "docs_lookup", description: "d", schema: { type: "object", properties: {} } };
      await model.reason({ messages: [{ role: "user", content: "hi" }], tools: [tool] } as never, new Assembler());
      await model.reason({ messages: [{ role: "user", content: "hi" }], tools: [] } as never, new Assembler());
    } finally {
      globalThis.fetch = realFetch;
      delete process.env.WA_TEST_KEY;
    }
    expect(calls[0]!.url).toBe("https://api.test/v1/responses");
    expect(calls[0]!.body.reasoning).toEqual({ effort: "medium" });
    expect(calls[0]!.body.reasoning_effort).toBeUndefined();
    expect(calls[1]!.url).toBe("https://api.test/v1/chat/completions");
    expect(calls[1]!.body.reasoning_effort).toBe("medium");
  });
});

describe("smallest pack tools", () => {
  test("attachPackTools registers capture_intent, recommend_settings, docs_lookup", async () => {
    const { attachAgent, attachPackTools } = await import("../src/pack/attach.ts");
    const { loadInstruction, loadPackConfig, packPolicy } = await import("../src/pack/load.ts");
    const { buildPack } = await import("../src/site/pack.ts");
    const dir = "packs/smallest";
    const config = loadPackConfig(dir);
    const runtime = {
      config,
      dir,
      instruction: loadInstruction(dir, config),
      policy: packPolicy(config),
      site: buildPack({ origin: config.origin, pages: [], pending: [], seen: new Set<string>(), cookies: "" }),
      pages: [],
      chunks: [],
    };
    const h = new Harness();
    const run = attachAgent(h, runtime, { model: "echo" });
    await attachPackTools(h, run, runtime);
    const names = run.listTools().map((t) => t.name);
    expect(names).toContain("capture_intent");
    expect(names).toContain("recommend_settings");
    expect(names).toContain("docs_lookup");
  });
});

describe("pack host session", () => {
  test("GET /chat how-to and session reuse", async () => {
    const config = loadPackConfig("packs/smallest");
    const h = new Harness();
    const room = new Room(h);
    const sessions = new Sessions(h, room);
    const fetchFn = host(h, room, "https://pack.test", { name: config.brand.name }, sessions, config);

    const how = await fetchFn(new Request("http://t/chat", { headers: { Accept: "application/json", "User-Agent": "curl/8" } }));
    const body = (await how.json()) as { ok: boolean; how: string; hint: string };
    expect(body.ok).toBe(true);
    expect(body.how).toMatch(/POST JSON/);
    expect(body.hint).toMatch(/Do not GET/i);

    const a = await fetchFn(
      new Request("http://t/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: "what is atoms", session: "s1" }),
      }),
    );
    const one = (await a.json()) as { session: string; runId: string; company: string };
    expect(one.session).toBe("s1");
    expect(one.company).toBe("Smallest AI");
    const b = await fetchFn(
      new Request("http://t/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: "still atoms", session: "s1" }),
      }),
    );
    const two = (await b.json()) as { runId: string };
    expect(two.runId).toBe(one.runId);
  });
});
