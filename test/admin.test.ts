import { describe, expect, test } from "bun:test";
import { adminRoute } from "../src/admin/route.ts";
import { mintKey } from "../src/admin/auth.ts";
import { csvCell } from "../src/admin/csv.ts";
import { groupQuestions } from "../src/admin/stats.ts";
import { defaultHarness } from "../src/harness.ts";
import { cloud } from "../src/host/cloud.ts";
import { Tenants, type OpenTenant } from "../src/host/tenant.ts";
import { openStore } from "../src/store/sqlite.ts";
import type { Store } from "../src/store/store.ts";

const NOW = Date.UTC(2026, 9, 5, 12, 0, 0);
const HOUR = 3_600_000;
const SUPER = "super-key-for-tests-0123456789";
const ORIGIN = "http://cloud.test";

const echoTenant: OpenTenant = async (tenant) => ({
  harness: defaultHarness(),
  listen: { model: "echo", card: { name: tenant.name } },
});

function seed(store: Store): void {
  const add = (id: string, name: string) =>
    store.putTenant({ id, name, pack: "/none", domains: [], origins: [], settings: {}, created: 1 });
  add("acme", "Acme Inc");
  add("beta", "Beta Co");
  const talk = (session: string, kind: "human" | "assistant", extra: Record<string, unknown>, turns: [string, string][]) => {
    const id = "acme:" + session;
    store.openConversation({ id, tenant: "acme", session, channel: kind === "human" ? "widget" : "chat", kind, verified: false, at: NOW - 5 * HOUR, ...extra });
    turns.forEach(([said, reply], i) => store.addTurn({ conversation: id, at: NOW - 5 * HOUR + i * 1000, from: kind === "human" ? "human" : "machine", said, reply, ms: 120 }));
    return id;
  };
  talk("h1", "human", {}, [["What does it cost?", "It costs 10 dollars."]]);
  talk("h2", "human", { handoff: true }, [["what does it cost", "See pricing."]]);
  talk("h3", "human", {}, [["Hello", "<script>alert(1)</script> Here: [[show:pricing]]"]]);
  talk("a1", "assistant", { family: "chatgpt", verified: true, label: "intelligent", score: 0.91 }, [
    ["Compare plans", "Pro and Team."],
    ["=SUM(A1)", "No."],
  ]);
  talk("a2", "assistant", { family: "claude", label: "script", score: 0.1 }, [["ping", "pong"]]);
  store.updateConversation("acme:a1", { label: "intelligent" });
  store.addFeedback({ tenant: "acme", conversation: "acme:h1", vote: -1, at: NOW - HOUR });
  store.addFeedback({ tenant: "acme", conversation: "acme:a1", vote: 1, at: NOW - HOUR });
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

function setup() {
  const store = openStore(":memory:");
  seed(store);
  const tenants = new Tenants(store, { open: echoTenant });
  const route = adminRoute(tenants, { key: SUPER, secret: "test-secret", publicUrl: "https://agents.test", now: () => NOW });
  const fetch = cloud(tenants, { fallbackUrl: ORIGIN, routes: [route] });
  const get = (path: string, cookie = "") => fetch(new Request(ORIGIN + path, { headers: { cookie } }));
  const post = (path: string, fields: Record<string, string>, cookie = "", headers: Record<string, string> = {}) =>
    fetch(
      new Request(ORIGIN + path, {
        method: "POST",
        headers: { cookie, origin: ORIGIN, "content-type": "application/x-www-form-urlencoded", ...headers },
        body: new URLSearchParams(fields).toString(),
      }),
    );
  /** Sign in with a key. Return the session cookie, or "" on failure. */
  const login = async (key: string): Promise<{ cookie: string; status: number }> => {
    const page = await get("/admin/login");
    const token = csrfOf(await page.text());
    const loginCookie = cookieOf(page, "wa_login");
    const res = await post("/admin/login", { key, csrf: token, next: "/admin" }, "wa_login=" + loginCookie);
    const session = cookieOf(res, "wa_admin");
    return { cookie: session ? "wa_admin=" + session : "", status: res.status };
  };
  return { store, tenants, get, post, login };
}

function csrfOf(html: string): string {
  return /name="csrf" value="([^"]+)"/.exec(html)?.[1] ?? "";
}

function cookieOf(res: Response, name: string): string {
  for (const c of res.headers.getSetCookie()) {
    const m = new RegExp("^" + name + "=([^;]*)").exec(c);
    if (m) return m[1]!;
  }
  return "";
}

function addKey(store: Store, id: string): string {
  const { key, record } = mintKey(id, "test", NOW);
  const t = store.getTenant(id)!;
  store.putTenant({ ...t, settings: { ...t.settings, adminKeys: [record] } });
  return key;
}

describe("admin auth", () => {
  test("login required: pages redirect and CSV is 401", async () => {
    const { get } = setup();
    const res = await get("/admin/t/acme");
    expect(res.status).toBe(303);
    expect(res.headers.get("location")).toBe("/admin/login?next=%2Fadmin%2Ft%2Facme");
    expect((await get("/admin/t/acme/export.csv")).status).toBe(401);
  });

  test("other paths pass through to the cloud", async () => {
    const { get } = setup();
    expect((await get("/administrator")).status).toBe(404);
    expect(await (await get("/")).text()).toContain("webagent cloud");
  });

  test("wrong key is rejected", async () => {
    const { store, login } = setup();
    addKey(store, "acme");
    for (const key of ["nope", "acme.wrong", SUPER + "x"]) {
      const r = await login(key);
      expect(r.status).toBe(401);
      expect(r.cookie).toBe("");
    }
  });

  test("login without the CSRF cookie is rejected", async () => {
    const { post } = setup();
    const res = await post("/admin/login", { key: SUPER, csrf: "x" });
    expect(res.status).toBe(403);
  });

  test("super admin sees the tenant list", async () => {
    const { get, login } = setup();
    const { cookie } = await login(SUPER);
    expect(cookie).not.toBe("");
    const html = await (await get("/admin", cookie)).text();
    expect(html).toContain("Acme Inc");
    expect(html).toContain("Beta Co");
    expect((await get("/admin/t/beta", cookie)).status).toBe(200);
  });

  test("tenant admin cannot read another tenant", async () => {
    const { store, get, login } = setup();
    const key = addKey(store, "acme");
    const { cookie } = await login(key);
    expect(cookie).not.toBe("");
    const home = await get("/admin", cookie);
    expect(home.status).toBe(303);
    expect(home.headers.get("location")).toBe("/admin/t/acme");
    expect((await get("/admin/t/acme", cookie)).status).toBe(200);
    for (const path of ["/admin/t/beta", "/admin/t/beta/conversations", "/admin/t/beta/export.csv", "/admin/t/nobody"]) {
      expect((await get(path, cookie)).status).toBe(404);
    }
  });

  test("a removed key ends its sessions", async () => {
    const { store, get, login } = setup();
    const key = addKey(store, "acme");
    const { cookie } = await login(key);
    const t = store.getTenant("acme")!;
    store.putTenant({ ...t, settings: { ...t.settings, adminKeys: [] } });
    expect((await get("/admin/t/acme", cookie)).status).toBe(303);
  });

  test("a forged cookie is rejected", async () => {
    const { get } = setup();
    const body = Buffer.from(JSON.stringify({ role: "super", key: "x", nonce: "n", exp: NOW + HOUR })).toString("base64url");
    expect((await get("/admin", "wa_admin=" + body + ".bad")).status).toBe(303);
  });

  test("logout clears the session", async () => {
    const { get, post, login } = setup();
    const { cookie } = await login(SUPER);
    const csrf = csrfOf(await (await get("/admin", cookie)).text());
    const res = await post("/admin/logout", { csrf }, cookie);
    expect(res.status).toBe(303);
    expect(res.headers.getSetCookie().join(";")).toContain("Max-Age=0");
  });

  test("cookie is HttpOnly, SameSite=Lax, and Secure on https", async () => {
    const { get, post } = setup();
    const page = await get("/admin/login");
    const token = csrfOf(await page.text());
    const res = await post("/admin/login", { key: SUPER, csrf: token }, "wa_login=" + cookieOf(page, "wa_login"), {
      "x-forwarded-proto": "https",
    });
    const set = res.headers.getSetCookie().find((c) => c.startsWith("wa_admin="))!;
    expect(set).toContain("HttpOnly");
    expect(set).toContain("SameSite=Lax");
    expect(set).toContain("Secure");
  });
});

describe("admin pages", () => {
  test("overview renders numbers from seeded data", async () => {
    const { get, login } = setup();
    const { cookie } = await login(SUPER);
    const res = await get("/admin/t/acme?days=7", cookie);
    expect(res.status).toBe(200);
    expect(res.headers.get("content-security-policy")).toContain("script-src 'nonce-");
    const html = await res.text();
    const tile = (label: string) => new RegExp("<dt>" + label + "</dt><dd>([^<]*)").exec(html)?.[1];
    expect(tile("Human conversations")).toBe("3");
    expect(tile("Agent conversations")).toBe("2");
    expect(tile("Intelligent agent conversations")).toBe("1");
    // Beacon browser 1 + CDN assistant 5 + assistant visitors 2.
    expect(tile("Agents seen on site")).toBe("8");
    expect(tile("Handoffs")).toBe("1");
    expect(tile("Thumbs-down rate")).toBe("50%");
    expect(html).toContain("Agent funnel");
    expect(html).toContain("<svg class=\"chart\"");
    expect(html).toContain("chatgpt");
    expect(html).toMatch(/Done: <\/span>Script tag seen/);
    expect(html).toMatch(/Not done: <\/span>Handoff set/);
  });

  test("conversations list filters and links to the transcript", async () => {
    const { get, login } = setup();
    const { cookie } = await login(SUPER);
    const html = await (await get("/admin/t/acme/conversations?kind=assistant", cookie)).text();
    expect(html).toContain("/admin/t/acme/c/a1");
    expect(html).not.toContain("/admin/t/acme/c/h1");
    const text = await (await get("/admin/t/acme/conversations?q=pricing", cookie)).text();
    expect(text).toContain("/admin/t/acme/c/h2");
    expect(text).not.toContain("/admin/t/acme/c/a2");
  });

  test("transcript escapes HTML and shows visual chips", async () => {
    const { get, login } = setup();
    const { cookie } = await login(SUPER);
    const html = await (await get("/admin/t/acme/c/h3", cookie)).text();
    expect(html).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
    expect(html).not.toContain("<script>alert(1)");
    expect(html).toContain('<span class="chip">visual: pricing</span>');
    expect((await get("/admin/t/beta/c/h3", cookie)).status).toBe(404);
  });

  test("traffic and questions pages render", async () => {
    const { get, login } = setup();
    const { cookie } = await login(SUPER);
    const traffic = await (await get("/admin/t/acme/traffic", cookie)).text();
    expect(traffic).toContain("/llms.txt");
    expect(traffic).toContain("https://acme.test/pricing");
    expect(traffic).toContain("perplexity");
    const beta = await (await get("/admin/t/beta/traffic", cookie)).text();
    expect(beta).toContain("Connect Cloudflare (read-only)");
    const questions = await (await get("/admin/t/acme/questions", cookie)).text();
    expect(questions).toMatch(/What does it cost\?<\/a><\/td><td class="n">2</);
    expect(questions).toContain("thumbs down");
    expect(questions).toContain("handoff");
  });

  test("CSRF is rejected without a token or from another origin", async () => {
    const { store, get, post, login } = setup();
    const { cookie } = await login(SUPER);
    expect((await post("/admin/t/acme/settings", { name: "Hacked" }, cookie)).status).toBe(403);
    expect((await post("/admin/t/acme/settings", { name: "Hacked", csrf: "wrong" }, cookie)).status).toBe(403);
    const csrf = csrfOf(await (await get("/admin/t/acme/settings", cookie)).text());
    const cross = await post("/admin/t/acme/settings", { name: "Hacked", csrf }, cookie, { origin: "https://evil.test" });
    expect(cross.status).toBe(403);
    expect(store.getTenant("acme")!.name).toBe("Acme Inc");
  });

  test("settings save persists and keeps admin keys", async () => {
    const { store, tenants, get, post, login } = setup();
    const key = addKey(store, "acme");
    const { cookie } = await login(key);
    const page = await (await get("/admin/t/acme/settings", cookie)).text();
    expect(page).toContain(`&lt;script src=&quot;https://agents.test/t/acme/widget.js&quot; async&gt;&lt;/script&gt;`);
    expect(page).toContain("connect-src https://agents.test");
    const csrf = csrfOf(page);
    await tenants.get("acme", () => ORIGIN + "/t/acme");
    const res = await post(
      "/admin/t/acme/settings",
      {
        csrf,
        name: "Acme",
        origins: "https://www.acme.test\nhttps://acme.test",
        domains: "agent.acme.test",
        handoff_email: "team@acme.test",
        handoff_webhook: "https://hooks.acme.test/x",
        handoff_slack: "#sales",
        cap: "500",
        paused: "on",
      },
      cookie,
    );
    expect(res.status).toBe(303);
    const t = store.getTenant("acme")!;
    expect(t.name).toBe("Acme");
    expect(t.origins).toEqual(["https://www.acme.test", "https://acme.test"]);
    expect(t.domains).toEqual(["agent.acme.test"]);
    expect(t.settings.handoff).toEqual({ email: "team@acme.test", webhook: "https://hooks.acme.test/x", slack: "#sales" });
    expect(t.settings.cap).toBe(500);
    expect(t.settings.paused).toBe(true);
    expect((t.settings.adminKeys as unknown[]).length).toBe(1);
    expect(tenants.isOpen("acme")).toBe(false);
    // The session still works after the save.
    expect((await get("/admin/t/acme/settings?ok=saved", cookie)).status).toBe(200);
  });

  test("settings reject bad values and keep the old tenant", async () => {
    const { store, get, post, login } = setup();
    const { cookie } = await login(SUPER);
    const csrf = csrfOf(await (await get("/admin/t/acme/settings", cookie)).text());
    const res = await post("/admin/t/acme/settings", { csrf, origins: "javascript:alert(1)", handoff_webhook: "http://x.test" }, cookie);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("Origin is not valid");
    expect(html).toContain("https URL");
    expect(store.getTenant("acme")!.origins).toEqual([]);
  });

  test("reload button closes the tenant", async () => {
    const { tenants, get, post, login } = setup();
    const { cookie } = await login(SUPER);
    await tenants.get("acme", () => ORIGIN + "/t/acme");
    const csrf = csrfOf(await (await get("/admin/t/acme/settings", cookie)).text());
    expect((await post("/admin/t/acme/reload", { csrf }, cookie)).status).toBe(303);
    expect(tenants.isOpen("acme")).toBe(false);
  });

  test("CSV export of conversations and turns", async () => {
    const { get, login } = setup();
    const { cookie } = await login(SUPER);
    const res = await get("/admin/t/acme/export.csv?what=conversations&days=7", cookie);
    expect(res.headers.get("content-type")).toContain("text/csv");
    expect(res.headers.get("content-disposition")).toContain("acme-conversations-7d.csv");
    const rows = (await res.text()).trim().split("\r\n");
    expect(rows[0]).toStartWith("id,started,updated,channel,kind");
    expect(rows).toHaveLength(6);
    const turns = await (await get("/admin/t/acme/export.csv?what=turns", cookie)).text();
    expect(turns).toContain('"<script>alert(1)</script> Here: [[show:pricing]]"'.replace(/"/g, ""));
    expect(turns).toContain("'=SUM(A1)");
  });
});

describe("admin helpers", () => {
  test("csv cells quote and defuse formulas", () => {
    expect(csvCell('a "b", c')).toBe('"a ""b"", c"');
    expect(csvCell("=1+1")).toBe("'=1+1");
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

describe("store aggregates", () => {
  test("sum, group, and per-day counts", () => {
    const store = openStore(":memory:");
    seed(store);
    const since = NOW - 24 * HOUR;
    expect(store.sumEvents("acme", { since, type: "cdn" })).toBe(5);
    expect(store.sumEvents("acme", { since, type: "request", kinds: ["assistant"], distinct: true })).toBe(2);
    expect(store.sumEvents("acme", { since, type: "request", paths: ["/llms.txt", "/.well-known/agent-card.json"] })).toBe(2);
    expect(store.sumEvents("acme", { since: NOW })).toBe(0);
    const families = store.groupEvents("acme", "family", { since, type: "request" });
    expect(families.find((c) => c.key === "chatgpt")).toEqual({ key: "chatgpt", n: 2, verified: 2 });
    expect(store.groupEvents("acme", "page", { type: "beacon" })[0]!.key).toBe("https://acme.test/pricing");
    const days = store.listEventDays("acme", "kind", { type: "request" });
    expect(days).toContainEqual({ day: "2026-10-05", key: "assistant", n: 3 });
    const sum = store.sumConversations("acme", since);
    expect(sum).toEqual({ total: 5, human: 3, agent: 2, intelligent: 1, deep: 1, handoff: 1, verified: 1 });
    expect(store.listConversationDays("acme")).toEqual([
      { day: "2026-10-05", key: "agent", n: 2 },
      { day: "2026-10-05", key: "human", n: 3 },
    ]);
    const questions = store.listQuestions("acme");
    expect(questions).toHaveLength(6);
    expect(questions[0]!.said).toBe("=SUM(A1)");
    expect(store.listQuestions("beta")).toHaveLength(0);
  });
});
