import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { defaultHarness } from "../src/harness.ts";
import { Tenants } from "../src/host/tenant.ts";
import { openPack } from "../src/pack/build.ts";
import { loadContent } from "../src/pack/content.ts";
import { docsLookupTool, getProvider } from "../src/pack/docs.ts";
import { getReport, onboard } from "../src/pack/onboard.ts";
import { refreshPack, refreshTenant, startRefresh } from "../src/pack/refresh.ts";
import { hashedEmbed } from "../src/retrieve/embed.ts";
import { localProvider, selectProvider, supermemoryProvider } from "../src/retrieve/provider.ts";
import type { PageShot } from "../src/site/types.ts";
import { openStore } from "../src/store/sqlite.ts";

/* A fake company site. Tests change `body` to simulate a content update. */
const body: Record<string, string> = {
  "/": "<h1>Acme Voice</h1><p>Acme Voice answers your phone calls with a calm voice agent for small clinics and shops.</p>",
  "/pricing": "<h1>Pricing</h1><p>The starter plan costs 49 dollars per month and includes 500 calls with email support.</p>",
  "/docs": "<h1>Docs</h1><p>Connect your phone number in the dashboard, then pick a voice and publish the agent.</p>",
};
const page = (title: string, html: string) =>
  `<!doctype html><html><head><title>${title}</title><meta name="description" content="${title} at Acme Voice"></head><body>` +
  `<nav><a href="/">Home</a> <a href="/pricing">Pricing</a> <a href="/docs">Docs</a></nav>${html}</body></html>`;

let site: ReturnType<typeof Bun.serve>;
let origin = "";
let work = "";

beforeAll(() => {
  site = Bun.serve({
    port: 0,
    hostname: "127.0.0.1",
    fetch(req) {
      const path = new URL(req.url).pathname;
      if (path === "/sitemap.xml") {
        const locs = Object.keys(body).map((p) => `<url><loc>${origin}${p}</loc></url>`).join("");
        return new Response(`<?xml version="1.0"?><urlset>${locs}</urlset>`, { headers: { "Content-Type": "application/xml" } });
      }
      const html = body[path];
      if (!html) return new Response("not found", { status: 404 });
      return new Response(page(path === "/" ? "Acme Voice" : path.slice(1), html), { headers: { "Content-Type": "text/html" } });
    },
  });
  origin = "http://127.0.0.1:" + site.port;
  work = mkdtempSync(join(tmpdir(), "wa-onboard-"));
});

afterAll(() => {
  site.stop(true);
  rmSync(work, { recursive: true, force: true });
});

async function start(id: string) {
  const store = openStore(":memory:");
  const done = await onboard(origin + "/", {
    id,
    store,
    packs: work,
    visuals: false,
    embed: false,
    publicUrl: "https://cloud.test",
    domains: ["agent." + id + ".test"],
    log: () => {},
  });
  return { store, done };
}

describe("onboard", () => {
  test("onboard writes the pack, adds the tenant, and prints the snippets", async () => {
    const { store, done } = await start("acme");
    const tenant = store.getTenant("acme")!;
    expect(tenant.pack).toBe(join(work, "acme"));
    expect(tenant.domains).toEqual(["agent.acme.test"]);
    expect(store.findTenant("agent.acme.test")?.id).toBe("acme");
    const pack = JSON.parse(readFileSync(join(work, "acme", "pack.json"), "utf8")) as { id: string; origin: string };
    expect(pack.id).toBe("acme");
    expect(pack.origin).toBe(origin);
    expect(existsSync(join(work, "acme", "evals.json"))).toBe(true);
    expect(loadContent(join(work, "acme"))!.pages.length).toBe(3);

    const report = getReport(done);
    expect(report).toContain("https://cloud.test/t/acme/");
    expect(report).toContain('<script src="https://cloud.test/t/acme/widget.js" async></script>');
    expect(report).toContain("connect-src https://cloud.test");
    expect(report).toContain("https://cloud.test/t/acme/chat");
    expect(report).toContain("facts sheet");
    expect(done.snippets.tagManager).toContain("widget.js");
  });

  test("bad tenant id fails", async () => {
    const store = openStore(":memory:");
    await expect(onboard(origin, { id: "Bad Id", store, packs: work, visuals: false, log: () => {} })).rejects.toThrow(/tenant id/);
  });

  test("a pack with stored content opens without a crawl", async () => {
    await start("offline");
    const broken = (async () => {
      throw new Error("no network");
    }) as unknown as typeof fetch;
    const runtime = await openPack(join(work, "offline"), { fetch: broken, embed: false });
    expect(runtime.pages.length).toBe(3);
    expect(runtime.chunks.some((c) => c.url.endsWith("/pricing"))).toBe(true);
  });
});

describe("refresh", () => {
  test("refresh finds changed and unchanged pages and embeds only new text", async () => {
    await start("fresh");
    const dir = join(work, "fresh");
    const quiet = { visuals: false, embed: hashedEmbed, log: () => {} } as const;

    const none = await refreshPack(dir, quiet);
    expect(none.rebuilt).toBe(false);
    expect(none.changed).toEqual([]);
    expect(none.same).toBe(3);

    const old = body["/pricing"]!;
    body["/pricing"] = "<h1>Pricing</h1><p>The starter plan costs 59 dollars per month and includes 600 calls with chat support.</p>";
    const first = await refreshPack(dir, quiet);
    expect(first.changed).toEqual([origin + "/pricing"]);
    expect(first.same).toBe(2);
    expect(first.rebuilt).toBe(true);
    expect(first.embedded).toBeGreaterThan(0);
    const stored = loadContent(dir)!.pages.find((p) => p.url.endsWith("/pricing"))!;
    expect(stored.text).toContain("59 dollars");

    body["/docs"] = "<h1>Docs</h1><p>Connect your phone number in settings, then pick a voice and press publish.</p>";
    const second = await refreshPack(dir, quiet);
    expect(second.changed).toEqual([origin + "/docs"]);
    expect(second.embedded).toBeGreaterThan(0);
    expect(second.embedded).toBeLessThan(first.embedded);
    body["/pricing"] = old;
  });

  test("refresh tenant reloads it and records the result", async () => {
    const { store } = await start("loaded");
    const tenants = new Tenants(store, {
      open: async (t) => ({ harness: defaultHarness(), listen: { model: "echo", card: { name: t.name } } }),
    });
    await tenants.get("loaded", () => "http://cloud.test/t/loaded");
    expect(tenants.isOpen("loaded")).toBe(true);

    const same = await refreshTenant(tenants, "loaded", { visuals: false, embed: false, log: () => {} });
    expect(same.rebuilt).toBe(false);
    expect(tenants.isOpen("loaded")).toBe(true);

    body["/"] = body["/"]!.replace("calm voice agent", "calm and fast voice agent");
    const lines: string[] = [];
    const moved = await refreshTenant(tenants, "loaded", { visuals: false, embed: false, log: (l) => lines.push(l) });
    expect(moved.changed).toEqual([origin + "/"]);
    expect(tenants.isOpen("loaded")).toBe(false);
    expect((store.getTenant("loaded")!.settings.refresh as { changed: number }).changed).toBe(1);
    expect(lines.join("\n")).toContain("1 changed");
  });

  test("two refreshes do not overlap", async () => {
    const { store } = await start("serial");
    await start("serial2").then(({ store: other }) => store.putTenant({ ...other.getTenant("serial2")! }));
    const tenants = new Tenants(store, { open: async () => ({ harness: defaultHarness(), listen: { model: "echo" } }) });
    let active = 0;
    let peak = 0;
    const slow = (async (input: string | URL | Request, init?: RequestInit) => {
      active++;
      peak = Math.max(peak, active);
      await Bun.sleep(2);
      try {
        return await fetch(input, init);
      } finally {
        active--;
      }
    }) as typeof fetch;
    /* Each refresh fetches one page at a time. Two refreshes at once would show two fetches in flight. */
    await Promise.all([
      refreshTenant(tenants, "serial", { fetch: slow, visuals: false, embed: false, log: () => {} }),
      refreshTenant(tenants, "serial2", { fetch: slow, visuals: false, embed: false, log: () => {} }),
    ]);
    expect(peak).toBe(1);
  });

  test("the refresh loop runs on its timer and stops", async () => {
    const { store } = await start("loop");
    const tenants = new Tenants(store, { open: async () => ({ harness: defaultHarness(), listen: { model: "echo" } }) });
    const lines: string[] = [];
    const loop = startRefresh(tenants, 20, { visuals: false, embed: false, log: (l) => lines.push(l) });
    for (let i = 0; i < 100 && !lines.length; i++) await Bun.sleep(10);
    loop.stop();
    expect(lines.some((l) => l.startsWith("refresh loop"))).toBe(true);
  });
});

/* ---------- retrieval provider ---------- */

interface Sent {
  url: string;
  auth: string;
  body: Record<string, unknown>;
}

function fakeApi(reply: (url: string, body: Record<string, unknown>) => unknown, status = 200) {
  const sent: Sent[] = [];
  const fetchFn = (async (input: string | URL | Request, init?: RequestInit) => {
    const url = String(input);
    const headers = new Headers(init?.headers);
    const body = JSON.parse(String(init?.body ?? "{}")) as Record<string, unknown>;
    sent.push({ url, auth: headers.get("authorization") ?? "", body });
    return Response.json(reply(url, body), { status });
  }) as typeof fetch;
  return { sent, fetchFn };
}

const shot = (url: string, title: string, text: string): PageShot => ({
  url,
  status: 200,
  title,
  description: "",
  headings: [title],
  text,
  links: [],
  forms: [],
  gated: false,
});

const searchReply = {
  results: [
    {
      documentId: "d1",
      title: "Pricing",
      score: 0.91,
      metadata: { url: "https://acme.test/pricing", title: "Pricing" },
      chunks: [{ content: "The starter plan costs 49 dollars.", score: 0.9, isRelevant: true }],
    },
  ],
  total: 1,
};

describe("retrieval provider", () => {
  test("supermemory add and search send the right request", async () => {
    const { sent, fetchFn } = fakeApi((url) => (url.endsWith("/v3/search") ? searchReply : { id: "x", status: "queued" }));
    const provider = supermemoryProvider({ key: "sm-test-key", containerTag: "webagent-acme", fetch: fetchFn });
    const n = await provider.add([shot("https://acme.test/pricing", "Pricing", "The starter plan costs 49 dollars.")]);
    expect(n).toBe(1);
    expect(sent[0]!.url).toBe("https://api.supermemory.ai/v3/documents");
    expect(sent[0]!.auth).toBe("Bearer sm-test-key");
    expect(sent[0]!.body.containerTag).toBe("webagent-acme");
    expect(String(sent[0]!.body.customId)).toMatch(/^page-[a-f0-9]+$/);
    expect(String(sent[0]!.body.content)).toContain("49 dollars");
    expect((sent[0]!.body.metadata as { url: string }).url).toBe("https://acme.test/pricing");

    const found = await provider.search("how much", 3);
    expect(sent[1]!.url).toBe("https://api.supermemory.ai/v3/search");
    expect(sent[1]!.body).toEqual({ q: "how much", containerTag: "webagent-acme", limit: 3 });
    expect(found).toEqual([
      { url: "https://acme.test/pricing", title: "Pricing", text: "The starter plan costs 49 dollars.", score: 0.91, kind: "page" },
    ]);
  });

  test("a failed request does not show the key", async () => {
    const { fetchFn } = fakeApi(() => ({ error: "Unauthorized" }), 401);
    const provider = supermemoryProvider({ key: "sm-secret-value", containerTag: "t", fetch: fetchFn });
    const err = await provider.search("x", 2).catch((e: Error) => e);
    expect(err).toBeInstanceOf(Error);
    expect((err as Error).message).toContain("401");
    expect((err as Error).message).not.toContain("sm-secret-value");
  });

  test("no key falls back to local and warns once", () => {
    const local = localProvider({ corpus: () => ({ origin: "https://acme.test", pages: [] }) });
    const warnings: string[] = [];
    const pick = () =>
      selectProvider({ id: "nokey", config: { provider: "supermemory" }, local, env: {}, warn: (l) => warnings.push(l) });
    expect(pick()).toBe(local);
    expect(pick()).toBe(local);
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain("SUPERMEMORY_API_KEY");
    const chosen = selectProvider({ id: "key", config: { provider: "supermemory", containerTag: "my tag" }, local, env: { SUPERMEMORY_API_KEY: "k" } });
    expect(chosen.name).toBe("supermemory");
  });

  test("docs_lookup uses the provider and falls back to local on error", async () => {
    await start("lookup");
    const runtime = await openPack(join(work, "lookup"), { embed: false });
    runtime.config.retrieval = { provider: "supermemory" };
    const { sent, fetchFn } = fakeApi(() => searchReply);
    getProvider(runtime, { fetch: fetchFn, env: { SUPERMEMORY_API_KEY: "k" } });
    const tool = docsLookupTool(runtime);
    const out = (await tool.call({ query: "price" })) as { source: string; hits: { url: string; snippet: string }[] };
    expect(out.source).toBe("supermemory");
    expect(out.hits[0]!.url).toBe("https://acme.test/pricing");
    expect(sent[0]!.body.containerTag).toBe("webagent-lookup");

    runtime.provider = { name: "supermemory", search: async () => Promise.reject(new Error("down")), add: async () => 0 };
    const errors = console.error;
    console.error = () => {};
    try {
      const back = (await tool.call({ query: "starter plan price" })) as { source: string; hits: { url: string }[] };
      expect(back.source).toBe("lexical");
      expect(back.hits[0]!.url).toBe(origin + "/pricing");
    } finally {
      console.error = errors;
    }
  });

  test("local provider is the default for docs_lookup", async () => {
    await start("local");
    const runtime = await openPack(join(work, "local"), { embed: false });
    const out = (await docsLookupTool(runtime).call({ query: "starter plan price" })) as { source: string; hits: { url: string }[] };
    expect(runtime.provider?.name).toBe("local");
    expect(out.source).toBe("lexical");
    expect(out.hits[0]!.url).toBe(origin + "/pricing");
  });

  test("refresh sends pages to supermemory once, then only changed pages", async () => {
    await start("pushed");
    const dir = join(work, "pushed");
    const cfg = JSON.parse(readFileSync(join(dir, "pack.json"), "utf8")) as Record<string, unknown>;
    cfg.retrieval = { provider: "supermemory", containerTag: "acme-docs" };
    writeFileSync(join(dir, "pack.json"), JSON.stringify(cfg));
    const api = fakeApi(() => ({ id: "x", status: "queued" }));
    const both = (async (input: string | URL | Request, init?: RequestInit) =>
      String(input).startsWith("https://api.supermemory.ai") ? api.fetchFn(input, init) : fetch(input, init)) as typeof fetch;
    const opts = { fetch: both, visuals: false, embed: false as const, env: { SUPERMEMORY_API_KEY: "k" }, log: () => {} };

    const all = await refreshPack(dir, opts);
    expect(all.pushed).toBe(3);
    expect(api.sent.every((s) => s.body.containerTag === "acme-docs")).toBe(true);

    const still = await refreshPack(dir, opts);
    expect(still.pushed).toBe(0);

    const old = body["/docs"]!;
    body["/docs"] = "<h1>Docs</h1><p>A new setup guide: connect the number, choose a voice, test a call, and go live.</p>";
    const one = await refreshPack(dir, opts);
    expect(one.pushed).toBe(1);
    expect((api.sent.at(-1)!.body.metadata as { url: string }).url).toBe(origin + "/docs");
    body["/docs"] = old;
  });
});
