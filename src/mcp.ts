/**
 * Streamable HTTP MCP (2025-06-18) over the public harness/run controls.
 * No private loop path — every verb is create/start/pause/fork/… already on Harness or Run.
 */
import type { Harness } from "./harness.ts";
import type { Run } from "./run.ts";
import { attachPack } from "./site/attach.ts";
import { siteBook } from "./site/book.ts";
import type { AuthGrant } from "./site/types.ts";

export const MCP_PROTOCOL = "2025-06-18";

export interface McpServerInfo {
  name?: string;
  version?: string;
}

const DEFAULT_SERVER_INFO = { name: "webagent", version: "0.4.0" };

interface ToolDef {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  call: (h: Harness, args: Record<string, unknown>) => Promise<unknown> | unknown;
}

const ID = {
  type: "object",
  properties: { id: { type: "string", description: "run id" } },
  required: ["id"],
} as const;

const TOOLS: ToolDef[] = [
  {
    name: "getAvailableModels",
    description: "list registered models (includes not-ready)",
    inputSchema: { type: "object", properties: {} },
    call: (h) => h.getAvailableModels(),
  },
  {
    name: "getAvailableTools",
    description: "list tools on the harness shelf",
    inputSchema: { type: "object", properties: {} },
    call: (h) => h.getAvailableTools(),
  },
  {
    name: "getLimits",
    description: "scheduler cap and current inflight",
    inputSchema: { type: "object", properties: {} },
    call: (h) => h.getLimits(),
  },
  {
    name: "getHealth",
    description: "run counts by state",
    inputSchema: { type: "object", properties: {} },
    call: (h) => h.getHealth(),
  },
  {
    name: "create",
    description: "new run; unbound until useModel / create.model / inject.model",
    inputSchema: {
      type: "object",
      properties: {
        model: { type: "string" },
        instruction: { type: "string" },
        text: { type: "string", description: "optional first user inject" },
      },
    },
    call: (h, a) => {
      const run = h.create({ model: optStr(a, "model"), instruction: optStr(a, "instruction") });
      const text = optStr(a, "text");
      if (text) run.inject({ text });
      return run.explain();
    },
  },
  {
    name: "get",
    description: "explain one run",
    inputSchema: ID,
    call: (h, a) => must(h, a).explain(),
  },
  {
    name: "listRuns",
    description: "explain every run, optionally filtered by state name",
    inputSchema: { type: "object", properties: { state: { type: "string" } } },
    call: (h, a) => h.listRuns({ state: optStr(a, "state") }),
  },
  {
    name: "start",
    description: "run the loop until a reply (or pause/cancel); scheduled",
    inputSchema: ID,
    call: async (h, a) => {
      const [ex] = await h.startAll([str(a, "id")]);
      return ex;
    },
  },
  {
    name: "startAll",
    description: "start many runs in parallel (scheduler-capped)",
    inputSchema: {
      type: "object",
      properties: { ids: { type: "array", items: { type: "string" } } },
      required: ["ids"],
    },
    call: (h, a) => {
      const ids = a.ids;
      if (!Array.isArray(ids) || ids.some((x) => typeof x !== "string")) throw new Error("ids must be string[]");
      return h.startAll(ids as string[]);
    },
  },
  {
    name: "pause",
    description: "finish the current step, then freeze",
    inputSchema: ID,
    call: (h, a) => {
      const r = must(h, a);
      r.pause();
      return r.explain();
    },
  },
  {
    name: "resume",
    description: "continue a paused run",
    inputSchema: ID,
    call: (h, a) => must(h, a).resume(),
  },
  {
    name: "stop",
    description: "end the run",
    inputSchema: ID,
    call: (h, a) => must(h, a).stop(),
  },
  {
    name: "cancel",
    description: "abort in-flight I/O",
    inputSchema: ID,
    call: (h, a) => must(h, a).cancel(),
  },
  {
    name: "stepOnce",
    description: "exactly one loop cycle",
    inputSchema: ID,
    call: (h, a) => must(h, a).stepOnce(),
  },
  {
    name: "retryStep",
    description: "run one more cycle",
    inputSchema: ID,
    call: (h, a) => must(h, a).retryStep(),
  },
  {
    name: "skipStep",
    description: "advance the step counter without a cycle",
    inputSchema: ID,
    call: (h, a) => must(h, a).skipStep(),
  },
  {
    name: "useModel",
    description: "bind a model for the next reason step",
    inputSchema: {
      type: "object",
      properties: { id: { type: "string" }, model: { type: "string" } },
      required: ["id", "model"],
    },
    call: (h, a) => must(h, a).useModel(str(a, "model")).explain(),
  },
  {
    name: "getModelBinding",
    description: "current model id or null",
    inputSchema: ID,
    call: (h, a) => ({ model: must(h, a).getModelBinding() }),
  },
  {
    name: "clearModel",
    description: "unbind; next start fails closed",
    inputSchema: ID,
    call: (h, a) => must(h, a).clearModel().explain(),
  },
  {
    name: "useTool",
    description: "attach a shelf tool to the run",
    inputSchema: {
      type: "object",
      properties: { id: { type: "string" }, name: { type: "string" } },
      required: ["id", "name"],
    },
    call: (h, a) => {
      const name = str(a, "name");
      const tool = h.tools.get(name);
      if (!tool) throw new Error("unknown tool " + name);
      const r = must(h, a);
      r.useTool(tool);
      return r.listTools();
    },
  },
  {
    name: "removeTool",
    description: "drop a tool from the run",
    inputSchema: {
      type: "object",
      properties: { id: { type: "string" }, name: { type: "string" } },
      required: ["id", "name"],
    },
    call: (h, a) => {
      const r = must(h, a);
      r.removeTool(str(a, "name"));
      return r.listTools();
    },
  },
  {
    name: "listTools",
    description: "tools attached to this run",
    inputSchema: ID,
    call: (h, a) => must(h, a).listTools(),
  },
  {
    name: "inject",
    description: "add user text / model / pinned vars",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string" },
        text: { type: "string" },
        model: { type: "string" },
        vars: { type: "string" },
      },
      required: ["id"],
    },
    call: (h, a) =>
      must(h, a)
        .inject({ text: optStr(a, "text"), model: optStr(a, "model"), vars: optStr(a, "vars") })
        .explain(),
  },
  {
    name: "getContext",
    description: "message log (shared spine until a write)",
    inputSchema: ID,
    call: (h, a) => must(h, a).getContext(),
  },
  {
    name: "fork",
    description: "child shares context until either writes; registered on the harness",
    inputSchema: {
      type: "object",
      properties: { id: { type: "string" }, model: { type: "string" } },
      required: ["id"],
    },
    call: (h, a) => h.fork(str(a, "id"), { model: optStr(a, "model") }).explain(),
  },
  {
    name: "merge",
    description: "absorb source into target and stop source",
    inputSchema: {
      type: "object",
      properties: { id: { type: "string" }, source: { type: "string" } },
      required: ["id", "source"],
    },
    call: (h, a) => {
      const target = must(h, a);
      const src = h.get(str(a, "source"));
      if (!src) throw new Error("unknown run " + a.source);
      return target.merge(src);
    },
  },
  {
    name: "explain",
    description: "id, state, step, model, lastText",
    inputSchema: ID,
    call: (h, a) => must(h, a).explain(),
  },
  {
    name: "events",
    description: "bounded event log (cap 32)",
    inputSchema: ID,
    call: async (h, a) => {
      const out: { t: string; d?: unknown }[] = [];
      for await (const e of must(h, a).eventStream()) out.push(e);
      return out;
    },
  },
  {
    name: "ingestSite",
    description: "crawl a website, build flows, pause if sign-in is needed",
    inputSchema: {
      type: "object",
      properties: { url: { type: "string" }, maxPages: { type: "number" } },
      required: ["url"],
    },
    call: async (h, a) => {
      const job = await siteBook(h).ingest(str(a, "url"), { maxPages: typeof a.maxPages === "number" ? a.maxPages : undefined });
      let runId: string | undefined;
      if (job.pack.pages.length) runId = attachPack(h, job.pack).id;
      return { id: job.id, runId, pack: job.pack };
    },
  },
  {
    name: "grantSiteAuth",
    description: "resume a crawl after the site owner signs in",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string" },
        cookies: { type: "string" },
        user: { type: "string" },
        password: { type: "string" },
      },
      required: ["id"],
    },
    call: async (h, a) => {
      const grant: AuthGrant = { cookies: optStr(a, "cookies"), user: optStr(a, "user"), password: optStr(a, "password") };
      const job = await siteBook(h).grant(str(a, "id"), grant);
      let runId: string | undefined;
      if (job.pack.pages.length) runId = attachPack(h, job.pack).id;
      return { id: job.id, runId, pack: job.pack };
    },
  },
  {
    name: "getSitePack",
    description: "flows, facts, instruction, starter questions for a crawled site",
    inputSchema: ID,
    call: (h, a) => {
      const job = siteBook(h).get(str(a, "id"));
      if (!job) throw new Error("unknown site " + a.id);
      return job.pack;
    },
  },
];

const BY_NAME = new Map(TOOLS.map((t) => [t.name, t]));
const MCP_ALLOW = "GET, POST, DELETE, OPTIONS";

/** Fetch handler for one MCP endpoint. Mount at /mcp or use standalone. */
export function mcp(harness: Harness, serverInfo: McpServerInfo = {}): (req: Request) => Promise<Response> {
  const info = {
    name: serverInfo.name || DEFAULT_SERVER_INFO.name,
    version: serverInfo.version || DEFAULT_SERVER_INFO.version,
  };
  const sessions = new Set<string>();
  let seq = 0;

  return async (req: Request) => {
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: { Allow: MCP_ALLOW } });
    if (req.method === "DELETE") {
      const sid = req.headers.get("Mcp-Session-Id") ?? "";
      if (sid) sessions.delete(sid);
      return new Response(null, { status: 204 });
    }
    if (req.method === "GET") {
      const discover = {
        type: "mcp",
        protocol: MCP_PROTOCOL,
        howToConnect:
          "Do not handshake MCP to talk. POST /chat {\"text\":\"...\"} and reuse session from the reply. MCP initialize is optional.",
      };
      return Response.json(discover, { headers: { Allow: MCP_ALLOW } });
    }
    if (req.method !== "POST") {
      return new Response("method not allowed", { status: 405, headers: { Allow: MCP_ALLOW } });
    }

    let msg: Rpc;
    try {
      msg = (await req.json()) as Rpc;
    } catch {
      return rpc(req, null, undefined, { code: -32700, message: "parse error" });
    }

    if (!msg || typeof msg.method !== "string") {
      return rpc(req, msg?.id, undefined, { code: -32600, message: "invalid request" });
    }

    const isNote = !("id" in msg);
    if (isNote) return new Response(null, { status: 202 });

    if (msg.method === "initialize") {
      const sid = "s" + ++seq;
      sessions.add(sid);
      const res = await rpc(req, msg.id, {
        protocolVersion: MCP_PROTOCOL,
        capabilities: { tools: { listChanged: false } },
        serverInfo: info,
        sessionId: sid,
      });
      res.headers.set("Mcp-Session-Id", sid);
      res.headers.set("MCP-Protocol-Version", MCP_PROTOCOL);
      return res;
    }

    const sid = req.headers.get("Mcp-Session-Id") ?? "";
    if (!sid || !sessions.has(sid)) {
      const res = await rpc(req, msg.id, undefined, {
        code: -32000,
        message: "missing session; POST initialize first",
      });
      return new Response(res.body, { status: 400, headers: res.headers });
    }

    try {
      const result = await dispatch(harness, msg.method, msg.params);
      return rpc(req, msg.id, result);
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e));
      const code = err.message.startsWith("unknown method") ? -32601 : -32603;
      return rpc(req, msg.id, undefined, { code, message: err.message });
    }
  };
}

async function dispatch(h: Harness, method: string, params: unknown): Promise<unknown> {
  if (method === "ping") return {};
  if (method === "tools/list") {
    return {
      tools: TOOLS.map((t) => ({ name: t.name, description: t.description, inputSchema: t.inputSchema })),
    };
  }
  if (method === "tools/call") {
    const p = (params ?? {}) as { name?: string; arguments?: Record<string, unknown> };
    const def = p.name ? BY_NAME.get(p.name) : undefined;
    if (!def) throw new Error("unknown tool " + (p.name ?? ""));
    try {
      const data = await def.call(h, p.arguments ?? {});
      return { content: [{ type: "text", text: JSON.stringify(data) }], isError: false };
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      return { content: [{ type: "text", text: message }], isError: true };
    }
  }
  throw new Error("unknown method " + method);
}

interface Rpc {
  jsonrpc?: string;
  id?: unknown;
  method?: string;
  params?: unknown;
}

interface RpcErr {
  code: number;
  message: string;
}

function rpc(req: Request, id: unknown, result?: unknown, error?: RpcErr): Promise<Response> | Response {
  const body = error
    ? { jsonrpc: "2.0", id: id ?? null, error }
    : { jsonrpc: "2.0", id: id ?? null, result };
  if (wantsSSE(req)) {
    return new Response(`event: message\ndata: ${JSON.stringify(body)}\n\n`, {
      headers: { "Content-Type": "text/event-stream" },
    });
  }
  return Response.json(body);
}

function wantsSSE(req: Request): boolean {
  const accept = req.headers.get("Accept") ?? "";
  return accept.includes("text/event-stream") && !accept.includes("application/json");
}

function must(h: Harness, args: Record<string, unknown>): Run {
  const id = str(args, "id");
  const r = h.get(id);
  if (!r) throw new Error("unknown run " + id);
  return r;
}

function str(args: Record<string, unknown>, key: string): string {
  const v = args[key];
  if (typeof v !== "string" || !v) throw new Error("missing " + key);
  return v;
}

function optStr(args: Record<string, unknown>, key: string): string | undefined {
  const v = args[key];
  if (v === undefined || v === null || v === "") return undefined;
  if (typeof v !== "string") throw new Error(key + " must be a string");
  return v;
}
