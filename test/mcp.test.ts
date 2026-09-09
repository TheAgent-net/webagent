import { describe, expect, test } from "bun:test";
import { Harness } from "../src/harness.ts";
import { intake } from "../src/intake.ts";
import { mcp } from "../src/mcp.ts";

type Rpc = { jsonrpc: string; id: unknown; result?: unknown; error?: { code: number; message: string } };

async function post(
  fetchFn: (req: Request) => Promise<Response>,
  url: string,
  body: unknown,
  headers: Record<string, string> = {},
): Promise<Response> {
  return fetchFn(
    new Request(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json, text/event-stream", ...headers },
      body: JSON.stringify(body),
    }),
  );
}

async function handshake(fetchFn: (req: Request) => Promise<Response>, url = "http://t/mcp") {
  const init = await post(fetchFn, url, {
    jsonrpc: "2.0",
    id: 1,
    method: "initialize",
    params: { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "test", version: "1" } },
  });
  expect(init.status).toBe(200);
  const session = init.headers.get("Mcp-Session-Id");
  expect(session).toBeTruthy();
  const ready = await post(
    fetchFn,
    url,
    { jsonrpc: "2.0", method: "notifications/initialized" },
    { "Mcp-Session-Id": session! },
  );
  expect(ready.status).toBe(202);
  return session!;
}

async function call(
  fetchFn: (req: Request) => Promise<Response>,
  session: string,
  method: string,
  params?: unknown,
  id = 2,
  url = "http://t/mcp",
): Promise<Rpc> {
  const res = await post(fetchFn, url, { jsonrpc: "2.0", id, method, params }, { "Mcp-Session-Id": session });
  expect(res.status).toBe(200);
  return (await res.json()) as Rpc;
}

async function tool<T>(
  fetchFn: (req: Request) => Promise<Response>,
  session: string,
  name: string,
  args: Record<string, unknown> = {},
): Promise<{ data: T; isError: boolean }> {
  const rpc = await call(fetchFn, session, "tools/call", { name, arguments: args });
  const result = rpc.result as { content: { text: string }[]; isError: boolean };
  expect(result.content[0]?.text).toBeDefined();
  const text = result.content[0]!.text;
  let data: T;
  try {
    data = JSON.parse(text) as T;
  } catch {
    data = text as T;
  }
  return { data, isError: result.isError };
}

describe("mcp surface", () => {
  test("initialize issues a session; later calls require it", async () => {
    const h = new Harness();
    const fetchFn = mcp(h);
    const session = await handshake(fetchFn);
    const missing = await post(fetchFn, "http://t/mcp", { jsonrpc: "2.0", id: 9, method: "ping" });
    expect(missing.status).toBe(400);
    const miss = (await missing.json()) as Rpc;
    expect(miss.error?.message).toMatch(/session/);
    const pong = await call(fetchFn, session, "ping");
    expect(pong.result).toEqual({});
  });

  test("tools/list exposes the public verbs", async () => {
    const fetchFn = mcp(new Harness());
    const session = await handshake(fetchFn);
    const listed = (await call(fetchFn, session, "tools/list")).result as { tools: { name: string }[] };
    const names = listed.tools.map((t) => t.name);
    for (const n of [
      "getAvailableModels",
      "create",
      "inject",
      "start",
      "startAll",
      "pause",
      "fork",
      "merge",
      "useModel",
      "stepOnce",
      "ingestSite",
      "grantSiteAuth",
      "getSitePack",
    ]) {
      expect(names).toContain(n);
    }
  });

  test("create / inject / start is the echo loop via MCP only", async () => {
    const fetchFn = mcp(new Harness());
    const session = await handshake(fetchFn);
    const created = await tool<{ id: string; model: string | null }>(fetchFn, session, "create", { text: "hi" });
    expect(created.isError).toBe(false);
    expect(created.data.model).toBeNull();
    const startedBare = await tool<{ text?: string }>(fetchFn, session, "start", { id: created.data.id });
    expect(startedBare.isError).toBe(true);
    expect(String(startedBare.data)).toMatch(/no model/);

    await tool(fetchFn, session, "useModel", { id: created.data.id, model: "echo" });
    const done = await tool<{ lastText: string; model: string }>(fetchFn, session, "start", { id: created.data.id });
    expect(done.isError).toBe(false);
    expect(done.data.lastText).toContain("hi");
    expect(done.data.model).toBe("echo");
  });

  test("fork and merge go through harness registration", async () => {
    const fetchFn = mcp(new Harness());
    const session = await handshake(fetchFn);
    const a = await tool<{ id: string }>(fetchFn, session, "create", { model: "echo", text: "from-a" });
    await tool(fetchFn, session, "start", { id: a.data.id });
    const child = await tool<{ id: string; model: string }>(fetchFn, session, "fork", { id: a.data.id });
    expect(child.data.id).not.toBe(a.data.id);
    const got = await tool<{ id: string }>(fetchFn, session, "get", { id: child.data.id });
    expect(got.data.id).toBe(child.data.id);

    const b = await tool<{ id: string }>(fetchFn, session, "create", { model: "echo", text: "from-b" });
    await tool(fetchFn, session, "start", { id: b.data.id });
    await tool(fetchFn, session, "merge", { id: b.data.id, source: a.data.id });
    const ctx = await tool<{ content: string }[]>(fetchFn, session, "getContext", { id: b.data.id });
    expect(ctx.data.some((m) => m.content === "from-a")).toBe(true);
    const src = await tool<{ state: string }>(fetchFn, session, "explain", { id: a.data.id });
    expect(src.data.state).toBe("stopped");
  });

  test("SSE reply when Accept is event-stream only", async () => {
    const fetchFn = mcp(new Harness());
    const init = await fetchFn(
      new Request("http://t/mcp", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "text/event-stream" },
        body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "initialize", params: {} }),
      }),
    );
    expect(init.headers.get("Content-Type")).toContain("text/event-stream");
    const session = init.headers.get("Mcp-Session-Id");
    const text = await init.text();
    expect(text).toContain("event: message");
    expect(text).toContain("2025-06-18");
    expect(session).toBeTruthy();
  });

  test("initialize result includes sessionId", async () => {
    const fetchFn = mcp(new Harness());
    const init = await post(fetchFn, "http://t/mcp", {
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "test", version: "1" } },
    });
    const body = (await init.json()) as { result?: { sessionId?: string } };
    expect(init.headers.get("Mcp-Session-Id")).toBe(body.result?.sessionId);
  });

  test("GET /mcp is discovery; OPTIONS is 204", async () => {
    const fetchFn = mcp(new Harness());
    const opt = await fetchFn(new Request("http://t/mcp", { method: "OPTIONS" }));
    expect(opt.status).toBe(204);
    const get = await fetchFn(new Request("http://t/mcp"));
    expect(get.status).toBe(200);
    const body = (await get.json()) as { type: string; protocol: string };
    expect(body.type).toBe("mcp");
    expect(body.protocol).toBe("2025-06-18");
  });

  test("intake mounts /mcp on the same handler", async () => {
    const fetchFn = intake(new Harness());
    const session = await handshake(fetchFn, "http://t/mcp");
    const models = await tool<{ id: string }[]>(fetchFn, session, "getAvailableModels");
    expect(models.data.some((m) => m.id === "echo")).toBe(true);
  });
});
