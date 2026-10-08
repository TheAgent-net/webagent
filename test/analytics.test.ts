import { describe, expect, test } from "bun:test";
import { generateNonce, sign } from "web-bot-auth";
import { signerFromJWK } from "web-bot-auth/crypto";
import { defaultHarness } from "../src/harness.ts";
import { classifyRow, getCdnLast, getCdnToken, pullCdn, readCdnRows, startCdn } from "../src/host/cdn.ts";
import { getSecretKey, lockSecret, unlockSecret } from "../src/host/secret.ts";
import { cloud } from "../src/host/cloud.ts";
import { readSignals, scoreBeacon, BROWSER_THRESHOLD } from "../src/host/collect.ts";
import { getFeatures, getLabel, scoreRules, scoreConversations } from "../src/host/score.ts";
import { Tenants, type OpenTenant } from "../src/host/tenant.ts";
import { checkIp, clearDirectories, matchCidr, proveVisitor, Ranges, readPrefixes, verifySignature } from "../src/host/verify.ts";
import { classifyVisitor } from "../src/host/visitor.ts";
import { openStore } from "../src/store/sqlite.ts";
import type { Store, Turn } from "../src/store/store.ts";
import { widgetJs } from "../src/widget/widget.ts";

const req = (ua: string, headers: Record<string, string> = {}) => new Request("http://x/", { headers: { "user-agent": ua, ...headers } });

describe("classify", () => {
  const table: [string, string, string | undefined, Record<string, string>?][] = [
    ["Mozilla/5.0 AppleWebKit/537.36; compatible; ChatGPT-User/1.0; +https://openai.com/bot", "assistant", "chatgpt"],
    ["Mozilla/5.0 (compatible; Claude-User/1.0; +Claude-User@anthropic.com)", "assistant", "claude"],
    ["Mozilla/5.0 (compatible; Perplexity-User/1.0)", "assistant", "perplexity"],
    ["Mozilla/5.0 (compatible; Kimi-User/1.0)", "assistant", "kimi"],
    ["Mozilla/5.0 (compatible; GPTBot/1.2; +https://openai.com/gptbot)", "crawler", "openai"],
    ["Mozilla/5.0 (compatible; ClaudeBot/1.0)", "crawler", "anthropic"],
    ["CCBot/2.0 (https://commoncrawl.org/faq/)", "crawler", "commoncrawl"],
    ["Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)", "crawler", "google"],
    ["Mozilla/5.0 (compatible; YandexBot/3.0)", "crawler", undefined],
    ["curl/8.4", "script", undefined],
    ["python-requests/2.31", "script", undefined],
    ["Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/120.0 Safari/537.36", "browser", undefined],
    ["Mozilla/5.0 (compatible; ChatGPT Agent)", "browser", "chatgpt"],
    ["Mozilla/5.0 Chrome/130", "human", undefined, { accept: "text/html", "sec-fetch-dest": "document" }],
    ["Mozilla/5.0 Chrome/130", "assistant", "mcp", { "mcp-protocol-version": "2025-06-18" }],
  ];
  for (const [ua, kind, family, headers] of table) {
    test(`${kind}: ${ua.slice(0, 50)}`, () => {
      const v = classifyVisitor(req(ua, headers));
      expect(v.kind).toBe(kind as never);
      expect(v.family).toBe(family);
      expect(v.verified).toBe(false);
    });
  }
  test("a common word matches only as a product token", () => {
    expect(classifyVisitor(req("Mozilla/5.0 Chrome/130 Operator mode", { "sec-fetch-dest": "document" })).kind).toBe("human");
  });
});

describe("ip ranges", () => {
  test("cidr matches v4 and v6", () => {
    expect(matchCidr("20.171.206.5", "20.171.206.0/24")).toBe(true);
    expect(matchCidr("20.171.207.5", "20.171.206.0/24")).toBe(false);
    expect(matchCidr("::ffff:20.171.206.5", "20.171.206.0/24")).toBe(true);
    expect(matchCidr("2001:4860:4801:10::5", "2001:4860:4801:10::/64")).toBe(true);
    expect(matchCidr("2001:4860:4801:11::5", "2001:4860:4801:10::/64")).toBe(false);
    expect(matchCidr("2001:4860:c::1f", "2001:4860:c::10/124")).toBe(true);
    expect(matchCidr("2001:4860:c::20", "2001:4860:c::10/124")).toBe(false);
    expect(matchCidr("1.2.3.4", "::/0")).toBe(false);
    expect(matchCidr("not-an-ip", "1.2.3.0/24")).toBe(false);
  });

  test("published range file sets verified for the claimed family only", async () => {
    const table = new Ranges();
    const file = { creationTime: "x", prefixes: [{ ipv4Prefix: "23.98.142.176/28" }, { ipv6Prefix: "2a0b:4f00::/32" }, { other: 1 }] };
    expect(readPrefixes(file)).toEqual(["23.98.142.176/28", "2a0b:4f00::/32"]);
    const n = await table.refresh([{ family: "chatgpt", kind: "assistant", url: "https://ranges.test/a.json" }], async () => Response.json(file));
    expect(n).toBe(1);
    const chatgpt = classifyVisitor(req("ChatGPT-User/1.0", { "x-forwarded-for": "23.98.142.180, 10.0.0.1" }));
    expect(checkIp(new Request("http://x/", { headers: { "x-forwarded-for": "23.98.142.180" } }), chatgpt, table).verified).toBe(true);
    expect(checkIp(new Request("http://x/", { headers: { "cf-connecting-ip": "2a0b:4f00::9" } }), chatgpt, table).verified).toBe(true);
    expect(checkIp(new Request("http://x/", { headers: { "x-real-ip": "8.8.8.8" } }), chatgpt, table).verified).toBe(false);
    const claude = classifyVisitor(req("Claude-User/1.0"));
    expect(checkIp(new Request("http://x/", { headers: { "x-real-ip": "23.98.142.180" } }), claude, table).verified).toBe(false);
    /* A failed refresh keeps the last good copy. */
    await table.refresh([{ family: "chatgpt", kind: "assistant", url: "https://ranges.test/a.json" }], async () => new Response("no", { status: 500 }));
    expect(table.has("chatgpt", "23.98.142.180")).toBe(true);
  });
});

describe("signature", () => {
  /* RFC 9421 Appendix B.1.4 test key. Public test material, not a secret. */
  const KEY = {
    kty: "OKP",
    crv: "Ed25519",
    alg: "EdDSA",
    kid: "test-key-ed25519",
    d: "n4Ni-HpISpVObnQMW0wOhCKROaIKqKtW_2ZYb2p9KcU",
    x: "JrQLj5P_89iXES9-vFgrIy29clF9CC_oPPsw3c5D0bs",
  };
  const PUBLIC = { kty: KEY.kty, crv: KEY.crv, x: KEY.x };
  const AGENT = 'sig1="https://chatgpt.com";type=directory';

  async function signed(url: string, ua = "Mozilla/5.0 Chrome/130"): Promise<Request> {
    const now = new Date();
    const fields = await sign(new Request(url, { headers: { "Signature-Agent": AGENT } }), {
      signer: await signerFromJWK(KEY),
      created: now,
      expires: new Date(now.getTime() + 60_000),
      nonce: generateNonce(),
    });
    return new Request(url, {
      headers: { Signature: fields.signature, "Signature-Input": fields.signatureInput, "Signature-Agent": AGENT, "user-agent": ua },
    });
  }

  test("valid signature proves the signer", async () => {
    clearDirectories();
    const asked: string[] = [];
    const fake = async (url: string) => {
      asked.push(url);
      return Response.json({ keys: [PUBLIC] });
    };
    const r = await signed("https://acme.test/chat");
    expect((await verifySignature(r, { fetch: fake }))?.agent).toBe("chatgpt.com");
    expect(asked).toEqual(["https://chatgpt.com/.well-known/http-message-signatures-directory"]);
    const v = await proveVisitor(r, classifyVisitor(r), { fetch: fake });
    expect(v).toMatchObject({ kind: "browser", family: "chatgpt", verified: true });
    expect(asked).toHaveLength(1);
  });

  test("wrong key, wrong host, or a failed fetch gives no proof", async () => {
    clearDirectories();
    const other = { kty: "OKP", crv: "Ed25519", x: "11qYAYKxCrfVS_7TyWQHOg7hcvPapiMlrwIaaPcHURo" };
    const r = await signed("https://acme.test/chat");
    expect(await verifySignature(r, { fetch: async () => Response.json({ keys: [other] }) })).toBeUndefined();
    clearDirectories();
    const moved = new Request("https://evil.test/chat", { headers: r.headers });
    expect(await verifySignature(moved, { fetch: async () => Response.json({ keys: [PUBLIC] }) })).toBeUndefined();
    clearDirectories();
    expect(await verifySignature(r, { fetch: async () => { throw new Error("down"); } })).toBeUndefined();
    clearDirectories();
    const huge = "x".repeat(70_000);
    expect(await verifySignature(r, { fetch: async () => new Response(huge) })).toBeUndefined();
    expect(await verifySignature(new Request("https://acme.test/"), {})).toBeUndefined();
  });
});

describe("collect", () => {
  const agentLike = readSignals({
    session: "w12345678abc",
    page: "https://acme.test/pricing?email=a@b.c#x",
    ms: 9000,
    webdriver: true,
    moves: 0,
    clicks: 4,
    bare: 4,
    keys: [8, 8, 8, 8, 8, 8, 8],
    scrolls: [720, 720, 720, 720],
    view: [1280, 720, 1280, 720, 1280, 720],
    botd: { bot: false },
  });
  const humanLike = readSignals({
    session: "w12345678abd",
    page: "https://acme.test/",
    ms: 21000,
    moves: 140,
    clicks: 3,
    bare: 0,
    keys: [120, 340, 90, 210, 410, 160, 95, 280],
    scrolls: [33, 120, 57, 300, -80, 12],
    view: [1512, 845, 1512, 982, 1512, 945],
  });

  test("agent-like signals pass the threshold, human-like do not", () => {
    expect(scoreBeacon(agentLike).score).toBeGreaterThanOrEqual(BROWSER_THRESHOLD);
    expect(scoreBeacon(humanLike).score).toBeLessThan(BROWSER_THRESHOLD);
  });

  test("no single signal decides", () => {
    const base = { moves: 50, clicks: 1, bare: 0, view: [1512, 845, 1600, 1000] };
    for (const one of [{ webdriver: true }, { botd: { bot: true } }, { clicks: 3, bare: 3 }, { keys: [3, 3, 3, 3, 3, 3] }]) {
      expect(scoreBeacon(readSignals({ ...base, ...one })).score).toBeLessThan(BROWSER_THRESHOLD);
    }
  });

  test("payload is capped and the query is dropped", () => {
    expect(agentLike.page).toBe("https://acme.test/pricing");
    const big = readSignals({ session: "bad id!", keys: Array(5000).fill(1), clicks: 1e12, view: [1, 2, 3, 4, 5, 6, 7, 8] });
    expect(big.session).toBeUndefined();
    expect(big.keys).toHaveLength(200);
    expect(big.clicks).toBe(100_000);
    expect(big.view).toHaveLength(6);
  });

  const echoTenant: OpenTenant = async (tenant) => ({ harness: defaultHarness(), listen: { model: "echo", card: { name: tenant.name } } });
  function setup(): { store: Store; fetch: (req: Request) => Promise<Response> } {
    const store = openStore(":memory:");
    store.putTenant({ id: "acme", name: "ACME", pack: "/none", domains: [], origins: [], settings: {}, created: 1 });
    return { store, fetch: cloud(new Tenants(store, { open: echoTenant }), { fallbackUrl: "http://cloud.test" }) };
  }
  const beacon = (body: object | string) =>
    new Request("http://cloud.test/t/acme/collect", {
      method: "POST",
      headers: { "content-type": "text/plain", "user-agent": "Mozilla/5.0 Chrome/130" },
      body: typeof body === "string" ? body : JSON.stringify(body),
    });

  test("beacon stores an event and marks the widget chat as an agent browser", async () => {
    const { store, fetch } = setup();
    await fetch(
      new Request("http://cloud.test/t/acme/chat", {
        method: "POST",
        headers: { "content-type": "application/json", "user-agent": "Mozilla/5.0 Chrome/130" },
        body: JSON.stringify({ text: "hello", session: "w12345678abc", channel: "widget" }),
      }),
    );
    expect(store.getConversation("acme:w12345678abc")!.kind).toBe("human");
    const res = await fetch(beacon({ ...agentLike, session: "w12345678abc", page: "https://acme.test/pricing?x=1" }));
    expect(res.status).toBe(204);
    const [event] = store.listEvents("acme", { type: "beacon" });
    expect(event!.kind).toBe("browser");
    expect(event!.path).toBe("/pricing");
    expect((event!.data as { score: number }).score).toBeGreaterThanOrEqual(BROWSER_THRESHOLD);
    expect(store.getConversation("acme:w12345678abc")!.kind).toBe("browser");
    expect(store.countEvents("acme", "path").find((r) => r.key === "/collect")).toBeUndefined();
  });

  test("a chat after an agent beacon opens as an agent browser", async () => {
    const { store, fetch } = setup();
    await fetch(beacon({ ...agentLike, session: "w87654321xyz" }));
    await fetch(
      new Request("http://cloud.test/t/acme/chat", {
        method: "POST",
        headers: { "content-type": "application/json", "user-agent": "Mozilla/5.0 Chrome/130" },
        body: JSON.stringify({ text: "hi", session: "w87654321xyz", channel: "widget" }),
      }),
    );
    expect(store.getConversation("acme:w87654321xyz")!.kind).toBe("browser");
  });

  test("human beacon stays human, bad body is 400, big body is 413", async () => {
    const { store, fetch } = setup();
    expect((await fetch(beacon(humanLike))).status).toBe(204);
    expect(store.listEvents("acme", { type: "beacon" })[0]!.kind).toBe("human");
    expect((await fetch(beacon("{not json"))).status).toBe(400);
    expect((await fetch(beacon("x".repeat(9000)))).status).toBe(413);
  });

  test("botd.js serves an ES module", async () => {
    const { fetch } = setup();
    const res = await fetch(new Request("http://cloud.test/t/acme/botd.js"));
    expect(res.status).toBe(200);
    expect(await res.text()).toContain("export");
  });
});

describe("score", () => {
  const turn = (at: number, said: string, reply: string, ms = 800): Turn => ({ conversation: "c", at, from: "machine", said, reply, ms });

  test("follow-ups with model timing score as intelligent", () => {
    const turns = [
      turn(0, "What plans do you offer for small teams?", "We offer Starter, Growth, and Enterprise plans. Starter includes five seats and email support."),
      turn(9_000, "Does the Starter plan include email support on weekends?", "Starter email support runs on weekdays. Growth adds weekend coverage."),
      turn(23_000, "How much more is Growth with weekend coverage per seat?", "Growth costs twelve dollars more per seat each month."),
    ];
    const f = getFeatures(turns);
    expect(f.turns).toBe(3);
    expect(f.follow).toBe(1);
    expect(f.distinct).toBe(1);
    expect(f.timing).toBe("model");
    expect(getLabel(scoreRules(f))).toBe("intelligent");
  });

  test("repeated payloads at exact intervals score as a script", () => {
    const turns = [0, 1, 2, 3, 4].map((i) => turn(i * 5_000 + i * 800, "price list", "Plans start at ten dollars."));
    const f = getFeatures(turns, new Map([["price list", 3]]));
    expect(f.distinct).toBe(0.2);
    expect(f.repeat).toBe(1);
    expect(f.timing).toBe("exact");
    expect(getLabel(scoreRules(f))).toBe("script");
  });

  test("millisecond gaps count as instant", () => {
    const turns = [turn(0, "a question here", "reply one", 50), turn(60, "another question", "reply two", 50)];
    expect(getFeatures(turns).timing).toBe("instant");
  });

  test("scoreConversations labels idle chats once and skips the judge", async () => {
    const store = openStore(":memory:");
    const add = (session: string, kind: "assistant" | "human", texts: string[]) => {
      const id = "acme:" + session;
      store.openConversation({ id, tenant: "acme", session, channel: "chat", kind, verified: false, at: 0 });
      texts.forEach((t, i) => store.addTurn({ conversation: id, at: i * 2_000, from: kind === "human" ? "human" : "machine", said: t, reply: "ok", ms: 10 }));
    };
    add("s1", "assistant", ["ping", "ping", "ping", "ping"]);
    add("s2", "assistant", ["ping"]);
    add("h1", "human", ["hello there"]);
    const out = await scoreConversations(store, "acme", { judge: false, now: 60 * 60 * 1000 });
    expect(out.map((s) => s.id).sort()).toEqual(["acme:h1", "acme:s1", "acme:s2"]);
    expect(store.getConversation("acme:h1")!.label).toBe("human");
    expect(store.getConversation("acme:s1")!.label).toBe("script");
    expect(out.find((s) => s.id === "acme:s2")!.features!.repeat).toBe(1);
    expect(await scoreConversations(store, "acme", { judge: false, now: 60 * 60 * 1000 })).toHaveLength(0);
  });
});

describe("cdn", () => {
  const answer = {
    data: {
      viewer: {
        zones: [
          {
            httpRequestsAdaptiveGroups: [
              { count: 120, dimensions: { userAgent: "Mozilla/5.0 AppleWebKit/537.36; compatible; ChatGPT-User/1.0", verifiedBotCategory: "AI Assistant" } },
              { count: 40, dimensions: { userAgent: "Mozilla/5.0 (compatible; GPTBot/1.2)", verifiedBotCategory: "AI Crawler" } },
              { count: 900, dimensions: { userAgent: "Mozilla/5.0 (Macintosh) Chrome/130 Safari/537.36", verifiedBotCategory: "" } },
              { count: 7, dimensions: { userAgent: "curl/8.4", verifiedBotCategory: "" } },
              { count: 0, dimensions: { userAgent: "empty" } },
            ],
          },
        ],
      },
    },
    errors: null,
  };

  test("rows parse and classify", () => {
    const rows = readCdnRows(answer);
    expect(rows).toHaveLength(4);
    expect(classifyRow(rows[0]!)).toEqual({ kind: "assistant", family: "chatgpt", verified: true });
    expect(classifyRow(rows[1]!)).toEqual({ kind: "crawler", family: "openai", verified: true });
    expect(classifyRow(rows[2]!).kind).toBe("human");
    expect(classifyRow(rows[3]!).kind).toBe("script");
    expect(() => readCdnRows({ errors: [{ message: "unknown field" }] })).toThrow("cloudflare: unknown field");
  });

  test("pull stores cdn events once per window, with a fake fetch", async () => {
    const store = openStore(":memory:");
    const zone = "0123456789abcdef0123456789abcdef";
    store.putTenant({ id: "acme", name: "ACME", pack: "/none", domains: [], origins: [], settings: { cdn: { provider: "cloudflare", zone, tokenEnv: "ACME_CF_TOKEN" } }, created: 1 });
    const calls: { auth: string; body: { query: string; variables: { zone: string } } }[] = [];
    const fake = async (_url: string, init?: RequestInit) => {
      const body = JSON.parse(String(init!.body));
      calls.push({ auth: new Headers(init!.headers).get("authorization")!, body });
      /* First answer: the plan has no bot category field. */
      if (calls.length === 1) return Response.json({ data: null, errors: [{ message: "unknown field verifiedBotCategory" }] });
      return Response.json(answer);
    };
    const until = Date.UTC(2026, 9, 5, 12);
    const out = await pullCdn(store, "acme", { fetch: fake, until, env: { ACME_CF_TOKEN: "test-token" } });
    expect(out).toMatchObject({ rows: 4, stored: 4, until, since: until - 86_400_000 });
    expect(calls).toHaveLength(2);
    expect(calls[0]!.auth).toBe("Bearer test-token");
    expect(calls[0]!.body.variables.zone).toBe(zone);
    expect(calls[0]!.body.query).toContain("verifiedBotCategory");
    expect(calls[1]!.body.query).not.toContain("verifiedBotCategory");
    const events = store.listEvents("acme", { type: "cdn" });
    expect(events).toHaveLength(4);
    const chatgpt = events.find((e) => e.family === "chatgpt")!;
    expect(chatgpt.kind).toBe("assistant");
    expect(chatgpt.data!.n).toBe(120);
    expect(JSON.stringify(events)).not.toContain("test-token");
    const again = await pullCdn(store, "acme", { fetch: fake, until, env: { ACME_CF_TOKEN: "test-token" } });
    expect(again.skipped).toBe(true);
  });

  test("a locked token unlocks only with the same key", () => {
    const key = getSecretKey({ WEBAGENT_SECRET_KEY: "a".repeat(40) })!;
    const locked = lockSecret("cf-token-value", key);
    expect(locked).toStartWith("v1:");
    expect(locked).not.toContain("cf-token-value");
    expect(unlockSecret(locked, key)).toBe("cf-token-value");
    expect(unlockSecret(locked, getSecretKey({ WEBAGENT_SECRET_KEY: "b".repeat(40) })!)).toBeUndefined();
    expect(getSecretKey({ WEBAGENT_SECRET_KEY: "short" })).toBeUndefined();
    const cdn = { provider: "cloudflare" as const, zone: "0123456789abcdef0123456789abcdef", token: locked };
    expect(getCdnToken(cdn, { WEBAGENT_SECRET_KEY: "a".repeat(40) })).toBe("cf-token-value");
    expect(() => getCdnToken(cdn, {})).toThrow("WEBAGENT_SECRET_KEY");
  });

  test("the hourly job pulls each linked site once per day and stores the last pull", async () => {
    const store = openStore(":memory:");
    const zone = "0123456789abcdef0123456789abcdef";
    store.putTenant({ id: "acme", name: "ACME", pack: "/none", domains: [], origins: [], settings: { cdn: { provider: "cloudflare", zone, tokenEnv: "ACME_CF_TOKEN" } }, created: 1 });
    store.putTenant({ id: "beta", name: "BETA", pack: "/none", domains: [], origins: [], settings: {}, created: 1 });
    process.env.ACME_CF_TOKEN = "test-token";
    let calls = 0;
    const fake = async () => {
      calls++;
      return Response.json(answer);
    };
    try {
      const stop = startCdn(store, () => ["acme", "beta"], { fetch: fake, delayMs: 0, everyMs: 20 });
      await Bun.sleep(80);
      stop();
    } finally {
      delete process.env.ACME_CF_TOKEN;
    }
    expect(calls).toBe(1);
    expect(store.listEvents("acme", { type: "cdn" })).toHaveLength(4);
    const last = getCdnLast(store.getTenant("acme")!.settings)!;
    expect(last).toMatchObject({ ok: true, rows: 4, reason: null });
    expect(store.getTenant("beta")!.settings).toEqual({});
  });

  test("missing token env or settings fails with the env name only", async () => {
    const store = openStore(":memory:");
    store.putTenant({ id: "acme", name: "ACME", pack: "/none", domains: [], origins: [], settings: { cdn: { provider: "cloudflare", zone: "0123456789abcdef0123456789abcdef", tokenEnv: "ACME_CF_TOKEN" } }, created: 1 });
    store.putTenant({ id: "beta", name: "BETA", pack: "/none", domains: [], origins: [], settings: {}, created: 1 });
    await expect(pullCdn(store, "acme", { env: {} })).rejects.toThrow("env var ACME_CF_TOKEN is not set");
    await expect(pullCdn(store, "beta", { env: {} })).rejects.toThrow("settings.cdn");
  });
});

describe("widget", () => {
  test("emitted script still parses and carries the beacon", () => {
    const pack = {
      id: "x",
      origin: "",
      brand: {
        name: "X",
        tagline: "",
        colors: { ink: "#000", paper: "#fff", muted: "#666", line: "#eee", wash: "#f5f5f5", accent: "#000", fab: "#000", fabText: "#fff" },
        fonts: { display: "a", body: "b" },
        fabLabel: "Ask",
        wordmark: "X",
      },
      widget: { welcomeTitle: "", welcomeBody: "", chips: [], copyHeadline: "", copyPrompt: "", placeholder: "", markdown: true },
    };
    const js = widgetJs("http://cloud.test/t/acme", "r1", pack as never);
    expect(() => new Function(js)).not.toThrow();
    expect(js).toContain('BASE + "/collect"');
    expect(js).toContain('BASE + "/botd.js"');
    expect(js).toContain("webagentConsent === false");
  });
});
