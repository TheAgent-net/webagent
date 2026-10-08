import { describe, expect, test } from "bun:test";
import { Database } from "bun:sqlite";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { apiRoute } from "../src/admin/api.ts";
import { csvCell } from "../src/admin/csv.ts";
import { groupQuestions } from "../src/admin/stats.ts";
import { defaultHarness } from "../src/harness.ts";
import { cloud } from "../src/host/cloud.ts";
import { frontRoute } from "../src/host/front.ts";
import { Tenants, type OpenTenant } from "../src/host/tenant.ts";
import type { Onboarded, OnboardOpts } from "../src/pack/onboard.ts";
import { openStore } from "../src/store/sqlite.ts";
import type { Store } from "../src/store/store.ts";

const NOW = Date.UTC(2026, 9, 5, 12, 0, 0);
const HOUR = 3_600_000;
const SUPER = "super-key-for-tests-0123456789";
const ORIGIN = "https://app.agentnet.market";
const API = "http://cloud.test/webagent/api";

const echoTenant: OpenTenant = async (tenant) => ({
  harness: defaultHarness(),
  listen: { model: "echo", card: { name: tenant.name } },
});

/** Platform users by session cookie value. */
const USERS: Record<string, object> = {
  owner: { user_id: 1, email: "o@acme.dev", memberships: [{ org_id: "org1", role: "owner", status: "active", slug: "acme" }] },
  member: { user_id: 2, email: "m@acme.dev", memberships: [{ org_id: "org1", role: "member", status: "active" }] },
  invited: { user_id: 3, email: "i@acme.dev", memberships: [{ org_id: "org1", role: "admin", status: "invited" }] },
  other: { user_id: 4, email: "x@beta.dev", memberships: [{ org_id: "org2", role: "admin", status: "active" }] },
};

function seed(store: Store): void {
  const add = (id: string, name: string, org?: string) =>
    store.putTenant({ id, name, pack: "/none", domains: [], origins: [], settings: {}, created: 1, ...(org ? { org } : {}) });
  add("acme", "Acme Inc", "org1");
  add("beta", "Beta Co", "org2");
  add("loose", "Loose");
  const talk = (session: string, kind: "human" | "assistant", extra: Record<string, unknown>, turns: [string, string][]) => {
    const id = "acme:" + session;
    store.openConversation({ id, tenant: "acme", session, channel: kind === "human" ? "widget" : "chat", kind, verified: false, at: NOW - 5 * HOUR, ...extra });
    turns.forEach(([said, reply], i) => store.addTurn({ conversation: id, at: NOW - 5 * HOUR + i * 1000, from: kind === "human" ? "human" : "machine", said, reply, ms: 120 }));
    return id;
  };
  talk("h1", "human", { page: "https://acme.test/pricing" }, [["What does it cost?", "It costs 10 dollars. See pricing."]]);
  talk("h2", "human", { handoff: true }, [["what does it cost", "See pricing."]]);
  talk("h3", "human", {}, [["Hello", "<script>alert(1)</script> Here: [[show:pricing]]"]]);
  talk("a1", "assistant", { family: "chatgpt", verified: true, label: "intelligent", score: 0.91 }, [
    ["Compare plans", "Pro and Team."],
    ["=SUM(A1)", "No."],
  ]);
  talk("a2", "assistant", { family: "claude", label: "script", score: 0.1 }, [["ping", "pong"]]);
  store.addFeedback({ tenant: "acme", conversation: "acme:h1", vote: -1, note: "wrong", at: NOW - HOUR });
  store.addFeedback({ tenant: "acme", conversation: "acme:a1", vote: 1, at: NOW - HOUR });
  store.addHandoff({ tenant: "acme", conversation: "acme:h2", email: "maya@acme.dev", note: "Call me", at: NOW - 4 * HOUR });
  const ev = (e: Partial<Parameters<Store["addEvent"]>[0]>) =>
    store.addEvent({ tenant: "acme", at: NOW - 2 * HOUR, type: "request", kind: "assistant", verified: false, ...e });
  ev({ path: "/llms.txt", family: "chatgpt", verified: true, ipHash: "ip1" });
  ev({ path: "/chat", family: "chatgpt", verified: true, ipHash: "ip1" });
  ev({ path: "/.well-known/agent-card.json", family: "claude", ipHash: "ip2" });
  ev({ path: "/", kind: "crawler", family: "openai", ipHash: "ip3" });
  ev({ type: "beacon", kind: "browser", family: "comet", session: "b1", data: { page: "https://acme.test/pricing" } });
  ev({ type: "cdn", kind: "assistant", family: "perplexity", path: "/docs", data: { n: 5 } });
  ev({ tenant: "beta", path: "/llms.txt", ipHash: "ip9" });
}

interface SetupOpts {
  platform?: typeof globalThis.fetch;
  onboard?: (url: string, opts: OnboardOpts) => Promise<Onboarded>;
  /** The fake onboard waits for this promise. */
  gate?: Promise<void>;
  cdnFetch?: (url: string, init?: RequestInit) => Promise<Response>;
  env?: Record<string, string | undefined>;
}

function setup(opts: SetupOpts = {}) {
  const store = openStore(":memory:");
  seed(store);
  const tenants = new Tenants(store, { open: echoTenant });
  let clock = NOW;
  const calls: string[] = [];
  const platform: typeof globalThis.fetch =
    opts.platform ??
    ((async (url: string | URL | Request, init?: RequestInit) => {
      calls.push(String(url));
      const cookie = new Headers(init?.headers).get("cookie") ?? "";
      const user = USERS[cookie.replace(/^agentnet_session=/, "")];
      return user ? Response.json(user) : Response.json({ detail: "login" }, { status: 401 });
    }) as unknown as typeof globalThis.fetch);
  const fakeOnboard = async (url: string, o: OnboardOpts): Promise<Onboarded> => {
    await opts.gate;
    const old = o.store.getTenant(o.id)!;
    o.store.putTenant({ ...old, org: o.org });
    return { tenant: old, dir: old.pack, config: { brand: { name: "Acme Docs" } }, pages: 1, visuals: 0 } as unknown as Onboarded;
  };
  const route = apiRoute(tenants, {
    adminKey: SUPER,
    fetch: platform,
    url: "http://platform.test",
    now: () => clock,
    publicUrl: "https://agentnet.it.com",
    origins: [ORIGIN],
    onboard: opts.onboard ?? fakeOnboard,
    packs: mkdtempSync(join(tmpdir(), "packs-")),
    cdnFetch: opts.cdnFetch,
    env: opts.env ?? {},
  });
  const fetch = cloud(tenants, { fallbackUrl: "http://cloud.test", routes: [route] });
  const call = (path: string, who?: string, init: RequestInit = {}) => {
    const headers = new Headers(init.headers);
    if (who === "super") headers.set("authorization", "Bearer " + SUPER);
    else if (who) headers.set("cookie", "theme=dark; agentnet_session=" + who);
    return fetch(new Request(API + path, { ...init, headers }));
  };
  const send = (method: string, path: string, who: string, body?: unknown, headers: Record<string, string> = {}) =>
    call(path, who, {
      method,
      headers: { "content-type": "application/json", origin: ORIGIN, ...headers },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  /** Read a JSON reply. Tests check the shape, so the type is open. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const read = async (res: Response | Promise<Response>): Promise<any> => (await res).json();
  return { store, tenants, route, call, send, read, calls, tick: (ms: number) => (clock += ms) };
}

describe("dashboard api auth", () => {
  test("no session, a bad session, or a wrong bearer is 401 login", async () => {
    const { call, read } = setup();
    for (const res of [await call("/orgs/org1/sites"), await call("/orgs/org1/sites", "nobody")]) {
      expect(res.status).toBe(401);
      expect(await read(res)).toMatchObject({ error: "login" });
    }
    const bearer = await call("/orgs/org1/sites", undefined, { headers: { authorization: "Bearer wrong" } });
    expect(bearer.status).toBe(401);
  });

  test("no active membership is 403 role", async () => {
    const { call, read } = setup();
    for (const who of ["other", "invited"]) {
      const res = await call("/orgs/org1/sites", who);
      expect(res.status).toBe(403);
      expect(await read(res)).toMatchObject({ error: "role" });
    }
    expect((await call("/orgs/bad%20org/sites", "owner")).status).toBe(403);
  });

  test("a site of another org or an unknown site is 404 site", async () => {
    const { call, read } = setup();
    for (const path of ["/orgs/org1/sites/beta/overview", "/orgs/org1/sites/nobody/overview", "/orgs/org1/sites/loose/settings", "/orgs/org1/sites/BAD/overview"]) {
      const res = await call(path, "owner");
      expect(res.status).toBe(404);
      expect(await read(res)).toMatchObject({ error: "site" });
    }
    expect((await call("/orgs/org1/sites/acme/nothing", "owner")).status).toBe(404);
    expect((await call("/nothing", "owner")).status).toBe(404);
  });

  test("a member reads but does not write. An owner writes", async () => {
    const { call, send, read } = setup();
    expect((await call("/orgs/org1/sites/acme/settings", "member")).status).toBe(200);
    const denied = await send("PUT", "/orgs/org1/sites/acme/settings", "member", { paused: true });
    expect(denied.status).toBe(403);
    expect(await read(denied)).toMatchObject({ error: "role" });
    expect((await send("POST", "/orgs/org1/sites/acme/reload", "member")).status).toBe(403);
    expect((await send("PUT", "/orgs/org1/sites/acme/settings", "owner", { paused: true })).status).toBe(200);
  });

  test("the super admin bearer reads every org and does not write", async () => {
    const { call, send, read } = setup();
    const one = await read(call("/orgs/org1/sites", "super"));
    expect(one.items.map((s: { id: string }) => s.id)).toEqual(["acme"]);
    const two = await read(call("/orgs/org2/sites", "super"));
    expect(two.items.map((s: { id: string }) => s.id)).toEqual(["beta"]);
    expect((await call("/orgs/org2/sites/beta/overview", "super")).status).toBe(200);
    expect((await send("POST", "/orgs/org1/sites/acme/reload", "super")).status).toBe(403);
  });

  test("the platform answer is cached for 30 s per cookie", async () => {
    const { call, calls, tick } = setup();
    await call("/orgs/org1/sites", "owner");
    await call("/orgs/org1/sites", "owner");
    await call("/orgs/org1/sites", "nobody");
    await call("/orgs/org1/sites", "nobody");
    expect(calls).toHaveLength(2);
    expect(calls[0]).toBe("http://platform.test/auth/me");
    tick(31_000);
    await call("/orgs/org1/sites", "owner");
    expect(calls).toHaveLength(3);
  });

  test("a platform failure is 502 server and is not cached", async () => {
    let n = 0;
    const { call, read } = setup({
      platform: (async () => {
        n++;
        throw new Error("down");
      }) as unknown as typeof globalThis.fetch,
    });
    const res = await call("/orgs/org1/sites", "owner");
    expect(res.status).toBe(502);
    expect(await read(res)).toMatchObject({ error: "server" });
    await call("/orgs/org1/sites", "owner");
    expect(n).toBe(2);
  });

  test("a write needs JSON and a listed origin", async () => {
    const { send, read } = setup();
    const evil = await send("PUT", "/orgs/org1/sites/acme/settings", "owner", { paused: true }, { origin: "https://evil.test" });
    expect(evil.status).toBe(403);
    expect(await read(evil)).toMatchObject({ error: "origin" });
    const form = await send("PUT", "/orgs/org1/sites/acme/settings", "owner", { paused: true }, { "content-type": "text/plain" });
    expect(form.status).toBe(415);
    const blank = await send("PUT", "/orgs/org1/sites/acme/settings", "owner", { paused: true }, { origin: "null" });
    expect(blank.status).toBe(403);
  });

  test("the old /admin pages are gone", async () => {
    const { store, tenants, route } = setup();
    const fetch = cloud(tenants, { fallbackUrl: "http://cloud.test", routes: [route, frontRoute(store, { dir: tmpdir() })] });
    expect((await fetch(new Request("http://cloud.test/admin"))).status).toBe(404);
    expect((await fetch(new Request("http://cloud.test/admin/t/acme"))).status).toBe(404);
  });
});

describe("dashboard api reads", () => {
  test("sites list", async () => {
    const { call, read } = setup();
    const body = await read(call("/orgs/org1/sites", "member"));
    expect(body.items).toEqual([
      { id: "acme", name: "Acme Inc", domains: [], origins: [], widgetUrl: "https://agentnet.it.com/t/acme/widget.js", paused: false, created: 1 },
    ]);
  });

  test("overview shape", async () => {
    const { call, read } = setup();
    const o = await read(call("/orgs/org1/sites/acme/overview?days=7", "member"));
    expect(o.range).toEqual({ days: 7, since: Date.UTC(2026, 8, 29) });
    expect(o.kpis).toEqual({
      human: 3,
      agent: 2,
      agentVerifiedShare: 0.5,
      intelligent: 1,
      agentsSeen: expect.any(Number),
      handoffs: 1,
      thumbsDownRate: 0.5,
      votes: 2,
    });
    expect(o.funnel.map((s: { step: string }) => s.step)).toEqual(["seen", "found", "talked", "intelligent"]);
    expect(o.funnel[2]).toEqual({ step: "talked", label: "Talked on chat or MCP", n: 2 });
    expect(o.days).toHaveLength(7);
    expect(o.days[6]).toEqual({ day: "2026-10-05", human: 3, agent: 2 });
    expect(o.families[0]).toMatchObject({ family: "chatgpt", requests: 2, verifiedShare: 1, conversations: 1 });
    expect(o.checklist.map((s: { id: string }) => s.id)).toEqual(["script", "csp", "handoff", "conversation", "cdn"]);
    expect(Object.keys(o.checklist[0]).sort()).toEqual(["done", "hint", "id", "label"]);
    const month = await read(call("/orgs/org1/sites/acme/overview", "member"));
    expect(month.range.days).toBe(30);
    expect(month.days).toHaveLength(30);
    expect((await call("/orgs/org1/sites/acme/overview?days=8", "member")).status).toBe(400);
  });

  test("conversations list, filters, and validation", async () => {
    const { call, read } = setup();
    const all = await read(call("/orgs/org1/sites/acme/conversations", "member"));
    expect(all.total).toBe(5);
    const h1 = all.items.find((c: { session: string }) => c.session === "h1")!;
    expect(h1).toEqual({
      session: "h1",
      channel: "widget",
      kind: "human",
      family: null,
      verified: false,
      score: null,
      label: null,
      page: "https://acme.test/pricing",
      handoff: false,
      started: NOW - 5 * HOUR,
      updated: NOW - 5 * HOUR,
      turns: 1,
      firstQuestion: "What does it cost?",
    });
    const agents = await read(call("/orgs/org1/sites/acme/conversations?kind=assistant&limit=1", "member"));
    expect(agents.total).toBe(2);
    expect(agents.items).toHaveLength(1);
    const found = await read(call("/orgs/org1/sites/acme/conversations?q=pricing&handoff=false", "member"));
    expect(found.items.map((c: { session: string }) => c.session).sort()).toEqual(["h1", "h3"]);
    for (const q of ["kind=robot", "limit=101", "limit=0", "offset=-1", "handoff=yes", "channel=sms", "q=" + "x".repeat(201)]) {
      const res = await call("/orgs/org1/sites/acme/conversations?" + q, "member");
      expect(res.status).toBe(400);
      expect(await read(res)).toMatchObject({ error: "bad_request" });
    }
  });

  test("transcript with feedback and handoffs", async () => {
    const { call, read } = setup();
    const t = await read(call("/orgs/org1/sites/acme/conversations/h1", "member"));
    expect(t.conversation.session).toBe("h1");
    expect(t.turns).toEqual([
      { id: expect.any(Number), at: NOW - 5 * HOUR, from: "human", said: "What does it cost?", reply: "It costs 10 dollars. See pricing.", visual: null, ms: 120 },
    ]);
    expect(t.feedback).toEqual([{ turn: null, vote: -1, note: "wrong", at: NOW - HOUR }]);
    expect(t.handoffs).toEqual([]);
    const h2 = await read(call("/orgs/org1/sites/acme/conversations/h2", "member"));
    expect(h2.handoffs).toEqual([{ email: "maya@acme.dev", note: "Call me", at: NOW - 4 * HOUR }]);
    const h3 = await read(call("/orgs/org1/sites/acme/conversations/h3", "member"));
    expect(h3.turns[0].reply).toBe("<script>alert(1)</script> Here: [[show:pricing]]");
    expect((await call("/orgs/org1/sites/acme/conversations/nobody", "member")).status).toBe(404);
    expect((await call("/orgs/org2/sites/beta/conversations/h1", "other")).status).toBe(404);
  });

  test("traffic shape", async () => {
    const { call, read } = setup();
    const t = await read(call("/orgs/org1/sites/acme/traffic?days=7", "member"));
    expect(Object.keys(t).sort()).toEqual(["browserPages", "byDay", "cdn", "families", "paths"]);
    expect(t.byDay).toContainEqual({ day: "2026-10-05", key: "assistant", n: 3 });
    expect(t.families[0]).toEqual({ family: "chatgpt", kind: "assistant", requests: 2, verifiedShare: 1 });
    expect(t.families).toContainEqual({ family: "openai", kind: "crawler", requests: 1, verifiedShare: 0 });
    expect(t.paths).toContainEqual({ path: "/llms.txt", n: 1, verified: 1 });
    expect(t.browserPages).toEqual([{ page: "https://acme.test/pricing", n: 1 }]);
    expect(t.cdn).toEqual({ connected: true, rows: [{ key: "perplexity", n: 5 }] });
  });

  test("questions shape", async () => {
    const { call, read } = setup();
    const q = await read(call("/orgs/org1/sites/acme/questions", "member"));
    expect(q.top[0]).toMatchObject({ n: 2, lastAt: expect.any(Number), session: expect.stringMatching(/^h[12]$/) });
    expect(q.top[0].text.toLowerCase()).toContain("what does it cost");
    expect(q.gaps).toContainEqual({ session: "h2", said: "what does it cost", reason: "handoff", at: expect.any(Number) });
    expect(q.gaps).toContainEqual({ session: "h1", said: "What does it cost?", reason: "thumbs_down", at: expect.any(Number) });
  });

  test("CSV export defuses formulas", async () => {
    const { call } = setup();
    const res = await call("/orgs/org1/sites/acme/export.csv?what=turns&days=7", "member");
    expect(res.headers.get("content-type")).toContain("text/csv");
    expect(res.headers.get("content-disposition")).toContain("acme-turns-7d.csv");
    const text = await res.text();
    expect(text).toContain("'=SUM(A1)");
    expect(text).not.toMatch(/(^|,)=SUM/m);
    const rows = (await (await call("/orgs/org1/sites/acme/export.csv", "member")).text()).trim().split("\r\n");
    expect(rows[0]).toStartWith("id,started,updated,channel,kind");
    expect(rows).toHaveLength(6);
    expect((await call("/orgs/org1/sites/acme/export.csv?what=all", "member")).status).toBe(400);
  });
});

describe("dashboard api writes", () => {
  test("settings read and write", async () => {
    const { store, tenants, call, send, read } = setup();
    const s = await read(call("/orgs/org1/sites/acme/settings", "member"));
    expect(s).toEqual({
      install: {
        scriptTag: '<script src="https://agentnet.it.com/t/acme/widget.js" async></script>',
        llmsLine: "- [Talk to the Acme Inc agent](https://agentnet.it.com/t/acme/chat): POST JSON {text, session}",
        csp: [
          "script-src https://agentnet.it.com",
          "connect-src https://agentnet.it.com",
          "img-src https://agentnet.it.com",
          "font-src https://agentnet.it.com",
          "style-src 'unsafe-inline'",
        ],
      },
      domains: [],
      origins: [],
      handoff: { email: "", webhook: "", slack: "" },
      cap: 0,
      paused: false,
      cdn: null,
    });
    await tenants.get("acme", () => "http://cloud.test/t/acme");
    const res = await send("PUT", "/orgs/org1/sites/acme/settings", "owner", {
      origins: ["https://www.acme.test", "https://acme.test/"],
      domains: ["Agent.Acme.test"],
      handoff: { email: "team@acme.test", webhook: "https://hooks.acme.test/x", slack: "https://hooks.slack.com/services/x" },
      cap: 500,
      paused: true,
    });
    expect(res.status).toBe(200);
    const next = await read(res);
    expect(next.origins).toEqual(["https://www.acme.test", "https://acme.test"]);
    expect(next.domains).toEqual(["agent.acme.test"]);
    expect(next.cap).toBe(500);
    expect(next.paused).toBe(true);
    const t = store.getTenant("acme")!;
    expect(t.settings.handoff).toEqual({ email: "team@acme.test", webhook: "https://hooks.acme.test/x", slack: "https://hooks.slack.com/services/x" });
    expect(t.org).toBe("org1");
    expect(tenants.isOpen("acme")).toBe(false);
    const cleared = await read(send("PUT", "/orgs/org1/sites/acme/settings", "owner", { handoff: { slack: "" }, cap: 0 }));
    expect(cleared.handoff).toEqual({ email: "team@acme.test", webhook: "https://hooks.acme.test/x", slack: "" });
    expect(cleared.cap).toBe(0);
  });

  test("settings validation keeps the old tenant", async () => {
    const { store, send, read } = setup();
    const bad = [
      { handoff: { webhook: "http://hooks.acme.test/x" } },
      { handoff: { slack: "#sales" } },
      { handoff: { email: "nope" } },
      { origins: ["javascript:alert(1)"] },
      { origins: "https://acme.test" },
      { domains: ["not a host"] },
      { cap: -1 },
      { cap: 1.5 },
      { paused: "yes" },
      { name: "Hacked" },
    ];
    for (const body of bad) {
      const res = await send("PUT", "/orgs/org1/sites/acme/settings", "owner", body);
      expect(res.status).toBe(400);
      expect(await read(res)).toMatchObject({ error: "bad_request", reason: expect.any(String) });
    }
    const t = store.getTenant("acme")!;
    expect(t.name).toBe("Acme Inc");
    expect(t.settings).toEqual({});
    expect((await send("PUT", "/orgs/org1/sites/acme/settings", "owner", undefined)).status).toBe(400);
  });

  test("cdn connect checks the token, stores it locked, and never sends it back", async () => {
    const token = "cf_token_ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const zone = "0123456789abcdef0123456789abcdef";
    const seen: string[] = [];
    const cdnFetch = async (_url: string, init?: RequestInit) => {
      const auth = new Headers(init!.headers).get("authorization")!;
      seen.push(auth);
      if (auth !== "Bearer " + token) return new Response("no", { status: 403 });
      return Response.json({ data: { viewer: { zones: [{ httpRequestsAdaptiveGroups: [{ count: 9, dimensions: { userAgent: "ChatGPT-User/1.0", verifiedBotCategory: "AI Assistant" } }] }] } }, errors: null });
    };
    const env = { WEBAGENT_SECRET_KEY: "k".repeat(40) };
    const { store, send, call, read } = setup({ cdnFetch, env });

    const wrong = await send("PUT", "/orgs/org1/sites/acme/settings", "owner", { cdn: { zone, token: "cf_wrong_ABCDEFGHIJKLMNOPQRSTUV" } });
    expect(wrong.status).toBe(400);
    expect((await read(wrong)).reason).toContain("Cloudflare refused the token");
    expect(store.getTenant("acme")!.settings.cdn).toBeUndefined();

    const ok = await send("PUT", "/orgs/org1/sites/acme/settings", "owner", { cdn: { zone, token } });
    expect(ok.status).toBe(200);
    const body = await ok.text();
    expect(body).not.toContain(token);
    expect(JSON.parse(body).cdn).toEqual({ provider: "cloudflare", zone, token: "dashboard", last: null });
    const stored = JSON.stringify(store.getTenant("acme")!.settings);
    expect(stored).not.toContain(token);
    expect(stored).toContain('"token":"v1:');

    const pulled = await read(send("POST", "/orgs/org1/sites/acme/cdn/pull", "owner"));
    expect(pulled).toEqual({ day: "2026-10-04", rows: 1, stored: 1, skipped: false });
    expect(seen.at(-1)).toBe("Bearer " + token);
    const again = await read(send("POST", "/orgs/org1/sites/acme/cdn/pull", "owner"));
    expect(again.skipped).toBe(true);
    const s = await read(call("/orgs/org1/sites/acme/settings", "member"));
    expect(s.cdn.last).toMatchObject({ day: "2026-10-04", ok: true, rows: 1, reason: null });
    expect((await send("POST", "/orgs/org1/sites/acme/cdn/pull", "member")).status).toBe(403);

    const zoneOnly = await read(send("PUT", "/orgs/org1/sites/acme/settings", "owner", { cdn: { zone: "f".repeat(32) } }));
    expect(zoneOnly.cdn).toMatchObject({ zone: "f".repeat(32), token: "dashboard", last: null });

    const off = await read(send("PUT", "/orgs/org1/sites/acme/settings", "owner", { cdn: null }));
    expect(off.cdn).toBeNull();
    expect(store.getTenant("acme")!.settings.cdn).toBeUndefined();
    expect((await send("POST", "/orgs/org1/sites/acme/cdn/pull", "owner")).status).toBe(409);
  });

  test("cdn token needs the secret key, and a bad body changes nothing", async () => {
    const zone = "0123456789abcdef0123456789abcdef";
    const { store, send, read } = setup({ env: {} });
    const noKey = await send("PUT", "/orgs/org1/sites/acme/settings", "owner", { cdn: { zone, token: "cf_token_ABCDEFGHIJKLMNOPQRSTUVWXYZ" } });
    expect(noKey.status).toBe(503);
    expect((await read(noKey)).reason).toContain("WEBAGENT_SECRET_KEY");
    for (const cdn of [{ zone: "nope", token: "cf_token_ABCDEFGHIJKLMNOPQRSTUVWXYZ" }, { zone }, { zone, token: "short" }, { zone, token: "x".repeat(30), extra: 1 }, "on"]) {
      const res = await send("PUT", "/orgs/org1/sites/acme/settings", "owner", { cdn, paused: true });
      expect(res.status).toBe(400);
    }
    expect(store.getTenant("acme")!.settings).toEqual({});
  });

  test("reload closes the tenant", async () => {
    const { tenants, send } = setup();
    await tenants.get("acme", () => "http://cloud.test/t/acme");
    const res = await send("POST", "/orgs/org1/sites/acme/reload", "owner");
    expect(res.status).toBe(204);
    expect(tenants.isOpen("acme")).toBe(false);
  });

  test("create site is 202, then ready. A taken id is 409", async () => {
    let open = () => {};
    const gate = new Promise<void>((done) => (open = done));
    const { store, route, call, send, read } = setup({ gate });
    // The host gives the id `acme`. The seed already has it.
    const taken = await send("POST", "/orgs/org1/sites", "owner", { url: "https://www.acme.dev/docs" });
    expect(taken.status).toBe(409);
    const made = await send("POST", "/orgs/org1/sites", "owner", { url: "https://docs.newco.dev", id: "newco" });
    expect(made.status).toBe(202);
    expect(await read(made)).toEqual({ id: "newco", status: "building" });
    expect(await read(call("/orgs/org1/sites/newco/status", "member"))).toEqual({ status: "building" });
    open();
    await route.builds.wait("newco");
    expect(await read(call("/orgs/org1/sites/newco/status", "member"))).toEqual({ status: "ready" });
    const t = store.getTenant("newco")!;
    expect(t.org).toBe("org1");
    expect(t.name).toBe("Acme Docs");
    expect(t.origins).toEqual(["https://docs.newco.dev"]);
    const again = await send("POST", "/orgs/org1/sites", "owner", { url: "https://docs.newco.dev", id: "newco" });
    expect(again.status).toBe(409);
    expect(await read(again)).toMatchObject({ error: "conflict" });
    const list = await read(call("/orgs/org1/sites", "member"));
    expect(list.items.map((s: { id: string }) => s.id)).toEqual(["acme", "newco"]);
  });

  test("create site derives the id from the host and checks input", async () => {
    const { send, read } = setup();
    const res = await send("POST", "/orgs/org1/sites", "owner", { url: "shop.zeta.io", name: "Zeta" });
    expect(await read(res)).toEqual({ id: "shop", status: "building" });
    for (const body of [
      { url: "http://127.0.0.1/" },
      { url: "http://localhost:8000" },
      { url: "ftp://acme.dev" },
      { url: "https://user:pw@acme.dev" },
      { url: "https://platform.internal" },
      { url: "https://ok.dev", id: "Bad Id" },
      { url: "https://ok.dev", extra: 1 },
      {},
    ]) {
      expect((await send("POST", "/orgs/org1/sites", "owner", body)).status).toBe(400);
    }
    expect((await send("POST", "/orgs/org1/sites", "member", { url: "https://ok.dev" })).status).toBe(403);
  });

  test("a failed build reads as failed", async () => {
    const { route, call, send, read } = setup({
      onboard: async () => {
        throw new Error("crawl found no pages");
      },
    });
    await send("POST", "/orgs/org1/sites", "owner", { url: "https://empty.dev" });
    await route.builds.wait("empty");
    const s = await read(call("/orgs/org1/sites/empty/status", "owner"));
    expect(s.status).toBe("failed");
    expect(s.error).toContain("crawl found no pages");
  });
});

describe("access CORS", () => {
  function front(origins: string[]) {
    const store = openStore(":memory:");
    const route = frontRoute(store, { dir: tmpdir(), siteOrigins: origins });
    return (path: string, init: RequestInit) => {
      const req = new Request("http://cloud.test" + path, init);
      return route(req, new URL(req.url)) as Promise<Response>;
    };
  }

  test("a listed site origin gets CORS on preflight and POST", async () => {
    const call = front(["https://agentnet.market"]);
    const pre = await call("/access", { method: "OPTIONS", headers: { origin: "https://agentnet.market", "access-control-request-method": "POST" } });
    expect(pre.status).toBe(204);
    expect(pre.headers.get("access-control-allow-origin")).toBe("https://agentnet.market");
    expect(pre.headers.get("access-control-allow-methods")).toContain("POST");
    const res = await call("/access", {
      method: "POST",
      headers: { origin: "https://agentnet.market", "content-type": "application/json" },
      body: JSON.stringify({ site: "acme.dev", email: "maya@acme.dev" }),
    });
    expect(res.status).toBe(200);
    expect(res.headers.get("access-control-allow-origin")).toBe("https://agentnet.market");
  });

  test("another origin gets no CORS", async () => {
    const call = front(["https://agentnet.market"]);
    const pre = await call("/access", { method: "OPTIONS", headers: { origin: "https://evil.test" } });
    expect(pre.status).toBe(403);
    expect(pre.headers.get("access-control-allow-origin")).toBeNull();
    const res = await call("/access", {
      method: "POST",
      headers: { origin: "https://evil.test", "content-type": "application/json" },
      body: JSON.stringify({ site: "acme.dev", email: "maya@acme.dev" }),
    });
    expect(res.headers.get("access-control-allow-origin")).toBeNull();
  });
});

describe("store", () => {
  test("an old tenants table gets the org column", () => {
    const file = join(mkdtempSync(join(tmpdir(), "db-")), "old.db");
    const db = new Database(file, { create: true });
    db.exec(
      "create table tenants (id text primary key, name text not null, pack text not null, domains text not null default '[]', origins text not null default '[]', settings text not null default '{}', created integer not null)",
    );
    db.query("insert into tenants (id, name, pack, created) values ('old', 'Old', '/p', 1)").run();
    db.close();
    const store = openStore(file);
    expect(store.getTenant("old")!.org).toBeUndefined();
    store.putTenant({ ...store.getTenant("old")!, org: "org9" });
    expect(store.getTenant("old")!.org).toBe("org9");
    store.close();
    expect(openStore(file).getTenant("old")!.org).toBe("org9");
  });

  test("sum, group, and per-day counts", () => {
    const store = openStore(":memory:");
    seed(store);
    const since = NOW - 24 * HOUR;
    expect(store.sumEvents("acme", { since, type: "cdn" })).toBe(5);
    expect(store.sumEvents("acme", { since, type: "request", kinds: ["assistant"], distinct: true })).toBe(2);
    expect(store.sumEvents("acme", { since, type: "request", paths: ["/llms.txt", "/.well-known/agent-card.json"] })).toBe(2);
    const families = store.groupEvents("acme", "family", { since, type: "request" });
    expect(families.find((c) => c.key === "chatgpt")).toEqual({ key: "chatgpt", n: 2, verified: 2 });
    expect(store.sumConversations("acme", since)).toEqual({ total: 5, human: 3, agent: 2, intelligent: 1, deep: 1, handoff: 1, verified: 1 });
    expect(store.countMatches("acme", { kind: "human" })).toBe(3);
    expect(store.countMatches("acme", { text: "pricing" })).toBe(3);
    expect(store.countMatches("acme", { text: "pricing", handoff: false })).toBe(2);
    expect(store.listQuestions("acme")[0]!.said).toBe("=SUM(A1)");
  });
});

describe("helpers", () => {
  test("csv cells quote and defuse formulas", () => {
    expect(csvCell('a "b", c')).toBe('"a ""b"", c"');
    for (const bad of ["=1+1", "+1", "-1", "@SUM(A1)"]) expect(csvCell(bad)).toBe("'" + bad);
    expect(csvCell(undefined)).toBe("");
  });

  test("questions group simple duplicates", () => {
    const groups = groupQuestions([
      { conversation: "x:1", said: "What does it cost?", at: 1 },
      { conversation: "x:2", said: "what does it cost", at: 2 },
      { conversation: "x:3", said: "Hi, what does it cost?", at: 3 },
      { conversation: "x:4", said: "Who are you?", at: 4 },
    ]);
    expect(groups[0]!.n).toBe(3);
    expect(groups[0]!.conversation).toBe("x:3");
    expect(groups[1]!.text).toBe("Who are you?");
  });
});
