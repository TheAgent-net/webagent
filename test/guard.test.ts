import { describe, expect, test } from "bun:test";
import { defaultHarness, Harness } from "../src/harness.ts";
import { cloud } from "../src/host/cloud.ts";
import { checkCsp, checkPolicy, formatCsp, parseCsp, readMeta } from "../src/host/csp.ts";
import { asksHuman, cutNote, isEmail, offersTeam, getTranscriptUrl } from "../src/host/handoff.ts";
import { Limiter, getMonthStart } from "../src/host/limit.ts";
import { isAllowed } from "../src/host/origin.ts";
import { Room } from "../src/host/room.ts";
import { Sessions } from "../src/host/sessions.ts";
import { Tenants, type OpenTenant } from "../src/host/tenant.ts";
import { loadPackConfig } from "../src/pack/index.ts";
import { openStore } from "../src/store/sqlite.ts";
import type { Store, Tenant } from "../src/store/store.ts";
import { packWidget, widgetJs } from "../src/widget/widget.ts";

const echoTenant: OpenTenant = async (tenant) => ({
  harness: defaultHarness(),
  listen: { model: "echo", card: { name: tenant.name } },
});

interface Sent {
  url: string;
  body: Record<string, unknown>;
}

function setup(patch: Partial<Tenant> = {}) {
  const store = openStore(":memory:");
  const tenant: Tenant = {
    id: "acme",
    name: "Acme",
    pack: "/none",
    domains: [],
    origins: [],
    settings: {},
    created: 1,
    ...patch,
  };
  store.putTenant(tenant);
  const sent: Sent[] = [];
  const outbound = (async (url: string | URL | Request, init?: RequestInit) => {
    sent.push({ url: String(url), body: JSON.parse(String(init?.body ?? "{}")) });
    return new Response("ok");
  }) as typeof fetch;
  const tenants = new Tenants(store, { open: echoTenant, outbound });
  return { store, tenants, sent, fetch: cloud(tenants, { fallbackUrl: "http://cloud.test" }) };
}

function update(store: Store, id: string, patch: Partial<Tenant>): void {
  store.putTenant({ ...store.getTenant(id)!, ...patch });
}

const post = (path: string, body: object, headers: Record<string, string> = {}) =>
  new Request("http://cloud.test" + path, {
    method: "POST",
    headers: { "content-type": "application/json", "user-agent": "Mozilla/5.0 Chrome/130", ...headers },
    body: JSON.stringify(body),
  });

async function waitFor(check: () => boolean, ms = 1000): Promise<void> {
  const end = Date.now() + ms;
  while (!check() && Date.now() < end) await Bun.sleep(5);
}

describe("rate limits", () => {
  test("bucket refills over time", () => {
    let now = 0;
    const limiter = new Limiter(100, () => now);
    for (let i = 0; i < 3; i++) expect(limiter.take("k", 3).ok).toBe(true);
    const no = limiter.take("k", 3);
    expect(no.ok).toBe(false);
    expect(no.wait).toBe(20);
    now += 20_000;
    expect(limiter.take("k", 3).ok).toBe(true);
  });

  test("key map stays under its cap", () => {
    const limiter = new Limiter(50);
    for (let i = 0; i < 500; i++) limiter.take("k" + i, 5);
    expect(limiter.size).toBeLessThanOrEqual(50);
  });

  test("chat gets 429 after the session limit", async () => {
    const { fetch } = setup({ settings: { limits: { chatSession: 2 } } });
    const ask = () => fetch(post("/t/acme/chat", { text: "hi", session: "w11111111" }));
    expect((await ask()).status).toBe(200);
    expect((await ask()).status).toBe(200);
    const res = await ask();
    expect(res.status).toBe(429);
    expect(Number(res.headers.get("retry-after"))).toBeGreaterThan(0);
    expect(((await res.json()) as { lastText: string }).lastText).toContain("wait");
  });

  test("chat gets 429 after the IP limit", async () => {
    const { fetch } = setup({ settings: { limits: { chatIp: 2 } } });
    const ask = (s: string, ip: string) =>
      fetch(post("/t/acme/chat", { text: "hi", session: s }, { "x-forwarded-for": ip }));
    expect((await ask("waaaaaaaa", "1.2.3.4")).status).toBe(200);
    expect((await ask("wbbbbbbbb", "1.2.3.4")).status).toBe(200);
    expect((await ask("wcccccccc", "1.2.3.4")).status).toBe(429);
    expect((await ask("wdddddddd", "5.6.7.8")).status).toBe(200);
  });
});

describe("pause and cap", () => {
  test("paused tenant gives a fixed reply with no model call", async () => {
    const { store, fetch } = setup({ settings: { paused: true } });
    const res = await fetch(post("/t/acme/chat", { text: "hello", session: "w22222222" }));
    expect(res.status).toBe(200);
    const body = (await res.json()) as { lastText: string; hold: string };
    expect(body.hold).toBe("paused");
    expect(body.lastText).toContain("not available");
    expect(store.getConversation("acme:w22222222")).toBeUndefined();
    const machine = await fetch(post("/t/acme/chat", { text: "hello" }, { "user-agent": "curl/8" }));
    expect(machine.status).toBe(503);
    expect(((await machine.json()) as { reason: string }).reason).toBe("paused");
  });

  test("monthly cap stops chat after the cap", async () => {
    const { store, fetch } = setup({ settings: { cap: 1 } });
    const first = await fetch(post("/t/acme/chat", { text: "one", session: "w33333333" }));
    expect(((await first.json()) as { hold?: string }).hold).toBeUndefined();
    expect(store.countTurns("acme", getMonthStart())).toBe(1);
    const second = await fetch(post("/t/acme/chat", { text: "two", session: "w33333333" }));
    expect(((await second.json()) as { hold: string }).hold).toBe("cap");
    update(store, "acme", { settings: { cap: 10 } });
    const third = await fetch(post("/t/acme/chat", { text: "three", session: "w33333333" }));
    expect(((await third.json()) as { hold?: string }).hold).toBeUndefined();
  });
});

describe("origin allowlist", () => {
  test("unknown origin gets 403, listed origin and machines pass", async () => {
    const { fetch } = setup({ origins: ["https://acme.com"] });
    const bad = await fetch(post("/t/acme/chat", { text: "hi" }, { origin: "https://evil.test" }));
    expect(bad.status).toBe(403);
    const good = await fetch(post("/t/acme/chat", { text: "hi" }, { origin: "https://acme.com" }));
    expect(good.status).toBe(200);
    expect(good.headers.get("access-control-allow-origin")).toBe("*");
    const own = await fetch(post("/t/acme/chat", { text: "hi" }, { origin: "http://cloud.test" }));
    expect(own.status).toBe(200);
    const machine = await fetch(post("/t/acme/chat", { text: "hi" }, { "user-agent": "curl/8" }));
    expect(machine.status).toBe(200);
    const feedback = await fetch(post("/t/acme/feedback", { session: "x", vote: 1 }, { origin: "https://evil.test" }));
    expect(feedback.status).toBe(403);
  });

  test("empty list allows any origin", () => {
    expect(isAllowed("https://any.test", [], "http://cloud.test/t/acme")).toBe(true);
    expect(isAllowed("https://ACME.com", ["https://acme.com/"], "http://cloud.test")).toBe(true);
    expect(isAllowed(null, ["https://acme.com"], "http://cloud.test")).toBe(true);
  });

  test("widget carries the allowed origins", async () => {
    const { fetch } = setup({ origins: ["https://acme.com/"] });
    const js = await (await fetch(new Request("http://cloud.test/t/acme/widget.js"))).text();
    expect(js).toContain('const ORIGINS = ["https://acme.com"]');
    expect(() => new Function(js)).not.toThrow();
  });
});

describe("tenant mode", () => {
  test("generic intake routes are hidden, MCP stays", async () => {
    const { fetch } = setup();
    expect((await fetch(post("/t/acme/runs", { text: "x", model: "echo" }, { "user-agent": "curl/8" }))).status).toBe(404);
    expect((await fetch(new Request("http://cloud.test/t/acme/models"))).status).toBe(404);
    expect((await fetch(new Request("http://cloud.test/t/acme/health"))).status).toBe(404);
    expect((await fetch(new Request("http://cloud.test/t/acme/runs/r1"))).status).toBe(404);
    expect((await fetch(post("/t/acme/sites", { url: "http://x.test" }, { "user-agent": "curl/8" }))).status).toBe(404);
    const init = await fetch(
      post("/t/acme/mcp", { jsonrpc: "2.0", id: 1, method: "initialize", params: {} }, { "user-agent": "curl/8" }),
    );
    expect(init.status).toBe(200);
    expect(init.headers.get("mcp-session-id")).toBeTruthy();
  });

  test("paused tenant blocks MCP", async () => {
    const { fetch } = setup({ settings: { paused: true } });
    const res = await fetch(post("/t/acme/mcp", { jsonrpc: "2.0", id: 1, method: "initialize" }, { "user-agent": "curl/8" }));
    expect(res.status).toBe(503);
  });
});

describe("sessions", () => {
  test("eviction removes the run from the harness", () => {
    const h = new Harness();
    const room = new Room(h, "echo");
    const sessions = new Sessions(h, room, undefined, 2);
    const first = sessions.open("a1").room.run.id;
    sessions.open("b1");
    sessions.open("a1");
    sessions.open("c1");
    expect(h.get(first)).toBeDefined();
    expect(sessions.get("b1")).toBeUndefined();
    expect(sessions.size).toBe(2);
    expect(h.getHealth().runs).toBe(3);
    expect(h.remove("nope")).toBe(false);
  });

  test("remove stops the run", () => {
    const h = new Harness();
    const run = h.create({ model: "echo" });
    expect(h.remove(run.id)).toBe(true);
    expect(run.explain().state).toBe("stopped");
    expect(h.get(run.id)).toBeUndefined();
  });
});

describe("feedback", () => {
  test("vote is stored with the turn id", async () => {
    const { store, fetch } = setup();
    const res = await fetch(post("/t/acme/chat", { text: "hi", session: "w44444444", channel: "widget" }));
    const body = (await res.json()) as { turnId: number };
    expect(body.turnId).toBeGreaterThan(0);
    const vote = await fetch(post("/t/acme/feedback", { session: "w44444444", turn: body.turnId, vote: -1, note: " slow " }));
    expect(vote.status).toBe(200);
    const rows = store.listFeedback("acme");
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ conversation: "acme:w44444444", turn: body.turnId, vote: -1, note: "slow" });
  });

  test("bad vote, unknown session, and unknown turn fail", async () => {
    const { fetch } = setup();
    await fetch(post("/t/acme/chat", { text: "hi", session: "w55555555" }));
    expect((await fetch(post("/t/acme/feedback", { session: "w55555555", vote: 3 }))).status).toBe(400);
    expect((await fetch(post("/t/acme/feedback", { session: "wnothere1", vote: 1 }))).status).toBe(404);
    expect((await fetch(post("/t/acme/feedback", { session: "w55555555", turn: 999, vote: 1 }))).status).toBe(400);
  });
});

describe("handoff", () => {
  test("patterns", () => {
    expect(offersTeam("I can connect you with our sales team to talk pricing.")).toBe(true);
    expect(offersTeam("Would you like to talk to one of our specialists?")).toBe(true);
    expect(offersTeam("Our team will reach out within a day.")).toBe(true);
    expect(offersTeam("The API returns JSON.")).toBe(false);
    expect(asksHuman("Can I talk to a human?")).toBe(true);
    expect(asksHuman("I want to speak with sales")).toBe(true);
    expect(asksHuman("human please")).toBe(true);
    expect(asksHuman("How do humans use this?")).toBe(false);
    expect(isEmail("a.b+c@acme.co")).toBe(true);
    expect(isEmail("nope@")).toBe(false);
    expect(isEmail("a@b.c<script>")).toBe(false);
    expect(cutNote("x".repeat(5000))!.length).toBe(1000);
    expect(getTranscriptUrl("acme", "acme:w1", "org1")).toBe(
      "https://app.agentnet.market/app/org1/webagent/sites/acme/conversations/w1",
    );
    expect(getTranscriptUrl("acme", "acme:w1")).toBe("https://app.agentnet.market/");
  });

  test("detected, stored, and sent to the webhook and Slack", async () => {
    const { store, sent, fetch } = setup({
      org: "org1",
      settings: { handoff: { webhook: "https://hooks.acme.test/in", slack: "https://hooks.slack.test/x" } },
    });
    const res = await fetch(post("/t/acme/chat", { text: "Can I talk to a human?", session: "w66666666" }));
    const body = (await res.json()) as { handoff: boolean };
    expect(body.handoff).toBe(true);
    expect(store.getConversation("acme:w66666666")!.handoff).toBe(true);

    expect((await fetch(post("/t/acme/handoff", { session: "w66666666", email: "bad" }))).status).toBe(400);
    const ok = await fetch(post("/t/acme/handoff", { session: "w66666666", email: "jo@acme.test", note: "Call me" }));
    expect(ok.status).toBe(200);
    const rows = store.listHandoffs("acme");
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ conversation: "acme:w66666666", email: "jo@acme.test", note: "Call me" });

    await waitFor(() => sent.length >= 2);
    const hook = sent.find((s) => s.url === "https://hooks.acme.test/in")!;
    expect(hook.body).toMatchObject({
      type: "handoff",
      conversation: "acme:w66666666",
      email: "jo@acme.test",
      transcript: "https://app.agentnet.market/app/org1/webagent/sites/acme/conversations/w66666666",
    });
    const slack = sent.find((s) => s.url === "https://hooks.slack.test/x")!;
    expect(String(slack.body.text)).toContain("jo@acme.test");
  });

  test("a reply that offers the team flags the chat", async () => {
    const { store, fetch } = setup();
    const res = await fetch(post("/t/acme/chat", { text: "I can connect you with our sales team", session: "w77777777" }));
    expect(((await res.json()) as { handoff: boolean }).handoff).toBe(true);
    expect(store.listConversations("acme", { handoff: true }).map((c) => c.id)).toEqual(["acme:w77777777"]);
  });

  test("email target without a mail webhook is skipped, not a crash", async () => {
    const old = process.env.WEBAGENT_MAIL_WEBHOOK;
    delete process.env.WEBAGENT_MAIL_WEBHOOK;
    try {
      const { sent, fetch } = setup({ settings: { handoff: { email: "team@acme.test" } } });
      await fetch(post("/t/acme/chat", { text: "talk to sales", session: "w88888888" }));
      const ok = await fetch(post("/t/acme/handoff", { session: "w88888888", email: "jo@acme.test" }));
      expect(ok.status).toBe(200);
      await Bun.sleep(20);
      expect(sent).toHaveLength(0);
    } finally {
      if (old !== undefined) process.env.WEBAGENT_MAIL_WEBHOOK = old;
    }
  });
});

describe("csp", () => {
  const site = "https://acme.com/";
  const agent = "https://agent.example.com";

  test("no default-src and no directive allows all", () => {
    expect(checkPolicy(parseCsp("frame-ancestors 'none'"), site, agent).every((c) => c.ok)).toBe(true);
  });

  test("default-src 'self' blocks and gives full lines", () => {
    const checks = checkPolicy(parseCsp("default-src 'self'"), site, agent);
    expect(checks.every((c) => !c.ok)).toBe(true);
    expect(checks.find((c) => c.directive === "script-src")!.line).toBe("script-src 'self' https://agent.example.com");
    expect(checks.find((c) => c.directive === "style-src")!.line).toBe(
      "style-src 'self' https://agent.example.com 'unsafe-inline'",
    );
  });

  test("host, wildcard, and scheme sources allow our origin", () => {
    const text =
      "script-src https://agent.example.com; connect-src *.example.com; img-src https:; font-src *; style-src 'unsafe-inline' https://agent.example.com";
    expect(checkPolicy(parseCsp(text), site, agent).every((c) => c.ok)).toBe(true);
  });

  test("'none' and strict-dynamic block", () => {
    const checks = checkPolicy(parseCsp("script-src 'nonce-abc' 'strict-dynamic'; connect-src 'none'"), site, agent);
    expect(checks.find((c) => c.directive === "script-src")!.ok).toBe(false);
    expect(checks.find((c) => c.directive === "connect-src")!.line).toBe("connect-src https://agent.example.com");
  });

  test("meta tags and headers are read", async () => {
    expect(readMeta(`<meta content="img-src 'self'" http-equiv="Content-Security-Policy">`)).toEqual(["img-src 'self'"]);
    const fake = (async () =>
      new Response(`<html><head><meta http-equiv="content-security-policy" content="font-src 'self'"></head></html>`, {
        headers: { "content-security-policy": "connect-src 'self' https://api.acme.com" },
      })) as unknown as typeof fetch;
    const report = await checkCsp(site, agent + "/t/acme", fake);
    expect(report.origin).toBe(agent);
    expect(report.policies).toHaveLength(2);
    expect(report.ok).toBe(false);
    expect(report.lines).toEqual([
      "connect-src 'self' https://api.acme.com https://agent.example.com",
      "font-src 'self' https://agent.example.com",
    ]);
    expect(formatCsp(report)).toContain("BLOCKS connect-src");
  });

  test("fetch error is reported, not thrown", async () => {
    const fail = (async () => {
      throw new Error("offline");
    }) as unknown as typeof fetch;
    const report = await checkCsp(site, agent, fail);
    expect(report.ok).toBe(false);
    expect(report.error).toBe("offline");
  });
});

describe("widget", () => {
  test("script parses with feedback, handoff, and origin check", () => {
    const config = loadPackConfig("packs/smallest");
    const html = packWidget("https://agent.test", "run-1", config, ["https://acme.com"]);
    const script = html.match(/<script>([\s\S]*)<\/script>/)?.[1] ?? "";
    expect(() => new Function(script)).not.toThrow();
    expect(script).toContain("/feedback");
    expect(script).toContain("/handoff");
    expect(script).toContain("We share this chat with the ");
    expect(widgetJs("https://agent.test", "run-1", config)).toContain("const ORIGINS = []");
  });
});
