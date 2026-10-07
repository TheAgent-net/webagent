import { describe, expect, test } from "bun:test";
import { defaultHarness } from "../src/harness.ts";
import { cloud } from "../src/host/cloud.ts";
import { Tenants, type OpenTenant } from "../src/host/tenant.ts";
import { classifyVisitor } from "../src/host/visitor.ts";
import { openStore } from "../src/store/sqlite.ts";
import type { Store } from "../src/store/store.ts";

const echoTenant: OpenTenant = async (tenant) => ({
  harness: defaultHarness(),
  listen: { model: "echo", card: { name: tenant.name } },
});

function setup(): { store: Store; tenants: Tenants; fetch: (req: Request) => Promise<Response> } {
  const store = openStore(":memory:");
  const add = (id: string, domains: string[] = []) =>
    store.putTenant({ id, name: id.toUpperCase(), pack: "/none", domains, origins: [], settings: {}, created: 1 });
  add("acme");
  add("beta", ["agent.beta.test"]);
  const tenants = new Tenants(store, { open: echoTenant });
  return { store, tenants, fetch: cloud(tenants, { fallbackUrl: "http://cloud.test" }) };
}

const chat = (path: string, body: object, headers: Record<string, string> = {}) =>
  new Request("http://cloud.test" + path, {
    method: "POST",
    headers: { "content-type": "application/json", "user-agent": "Mozilla/5.0 Chrome/130", ...headers },
    body: JSON.stringify(body),
  });

describe("cloud", () => {
  test("prefix routes to the tenant and stores the turn", async () => {
    const { store, fetch } = setup();
    const res = await fetch(chat("/t/acme/chat", { text: "hello", session: "w12345678", channel: "widget", page: "https://acme.test/pricing" }));
    expect(res.status).toBe(200);
    const body = (await res.json()) as { session: string; company: string };
    expect(body.session).toBe("w12345678");
    expect(body.company).toBe("ACME");
    const c = store.getConversation("acme:w12345678")!;
    expect(c.channel).toBe("widget");
    expect(c.kind).toBe("human");
    expect(c.page).toBe("https://acme.test/pricing");
    expect(c.turns).toBe(1);
    expect(store.listTurns(c.id)[0]!.said).toBe("hello");
    expect(store.countEvents("acme", "path").find((r) => r.key === "/chat")?.n).toBe(1);
    expect(store.listConversations("beta")).toHaveLength(0);
  });

  test("unknown tenant is 404", async () => {
    const { fetch } = setup();
    const res = await fetch(new Request("http://cloud.test/t/nobody/chat"));
    expect(res.status).toBe(404);
  });

  test("custom domain routes without prefix", async () => {
    const { store, fetch } = setup();
    const res = await fetch(chat("/chat", { text: "hi", session: "m1abcdef" }, { host: "agent.beta.test", "user-agent": "ChatGPT-User/1.0" }));
    expect(res.status).toBe(200);
    const c = store.getConversation("beta:m1abcdef")!;
    expect(c.kind).toBe("assistant");
    expect(c.family).toBe("chatgpt");
    expect(c.channel).toBe("chat");
  });

  test("widget base carries the tenant prefix", async () => {
    const { fetch } = setup();
    const js = await (await fetch(new Request("http://cloud.test/t/acme/widget.js"))).text();
    expect(js).toContain("http://cloud.test/t/acme");
  });

  test("a stored chat resumes after the tenant reopens", async () => {
    const { tenants, fetch } = setup();
    await fetch(chat("/t/acme/chat", { text: "first", session: "w99999999" }));
    tenants.reload("acme");
    await fetch(chat("/t/acme/chat", { text: "second", session: "w99999999" }));
    const live = await tenants.get("acme", () => "http://cloud.test/t/acme");
    const room = live!.mounted.sessions.get("w99999999")!;
    const said = room.run.getContext().filter((m) => m.role === "user").map((m) => m.content);
    expect(said).toEqual(["[human] first", "[human] second"]);
  });
});

describe("visitor", () => {
  const req = (ua: string, headers: Record<string, string> = {}) =>
    new Request("http://x/", { headers: { "user-agent": ua, ...headers } });
  test("assistant fetch vs crawler vs script vs human", () => {
    expect(classifyVisitor(req("Mozilla/5.0 AppleWebKit/537.36; compatible; ChatGPT-User/1.0")).kind).toBe("assistant");
    expect(classifyVisitor(req("Mozilla/5.0 (compatible; GPTBot/1.2)")).kind).toBe("crawler");
    expect(classifyVisitor(req("curl/8.4")).kind).toBe("script");
    expect(classifyVisitor(req("Mozilla/5.0 Chrome/130", { accept: "text/html", "sec-fetch-dest": "document" })).kind).toBe("human");
  });
});

describe("tenant mcp", () => {
  const rpcCall = (body: object, sid?: string) =>
    new Request("http://cloud.test/t/acme/mcp", {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json", "user-agent": "mcp-client/1.0", ...(sid ? { "mcp-session-id": sid } : {}) },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, ...body }),
    });

  test("only the ask tool, and each call is a stored mcp turn", async () => {
    const { store, fetch } = setup();
    const init = await fetch(rpcCall({ method: "initialize", params: {} }));
    const sid = init.headers.get("mcp-session-id")!;
    expect(sid).toBeTruthy();
    const list = (await (await fetch(rpcCall({ method: "tools/list" }, sid))).json()) as { result: { tools: { name: string }[] } };
    expect(list.result.tools.map((t) => t.name)).toEqual(["ask"]);
    const bad = (await (await fetch(rpcCall({ method: "tools/call", params: { name: "create", arguments: {} } }, sid))).json()) as { error?: object };
    expect(bad.error).toBeTruthy();
    const ask = (await (await fetch(rpcCall({ method: "tools/call", params: { name: "ask", arguments: { text: "what is this?" } } }, sid))).json()) as {
      result: { structuredContent: { session: string } };
    };
    expect(ask.result.structuredContent.session).toBe(sid);
    const c = store.getConversation("acme:" + sid)!;
    expect(c.channel).toBe("mcp");
    expect(c.turns).toBe(1);
  });
});
