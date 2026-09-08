import { describe, expect, test } from "bun:test";
import { Assembler } from "../src/assembler.ts";
import { Context } from "../src/context.ts";
import { Harness } from "../src/harness.ts";
import { intake } from "../src/intake.ts";
import { mapOpenAI, openaiModel, type Model } from "../src/models.ts";
import type { Tool } from "../src/tools.ts";

describe("assembler", () => {
  test("parses tool JSON once at end, not per chunk", () => {
    const a = new Assembler();
    a.pushToolDelta(0, "c1", "lookup", '{"ci');
    a.pushToolDelta(0, undefined, undefined, 'ty":"Bangalore"}');
    const out = a.end();
    expect(out.toolCalls).toEqual([{ id: "c1", name: "lookup", arguments: { city: "Bangalore" } }]);
  });
});

describe("copy-on-write context", () => {
  test("fork shares spine until a write", () => {
    const a = new Context();
    a.append({ role: "user", content: "hi" });
    const b = a.fork();
    expect(a.view()).toBe(b.view());
    b.append({ role: "assistant", content: "yo" });
    expect(a.view()).not.toBe(b.view());
    expect(a.length).toBe(1);
    expect(b.length).toBe(2);
  });
});

describe("mapOpenAI", () => {
  test("maps pin to system and keeps tool call ids", () => {
    const mapped = mapOpenAI([
      { role: "pin", content: "fact" },
      { role: "assistant", content: "", toolCalls: [{ id: "c1", name: "lookup", arguments: { city: "X" } }] },
      { role: "tool", content: "{\"ok\":true}", toolCallId: "c1" },
    ]);
    expect(mapped[0]).toEqual({ role: "system", content: "fact" });
    expect(mapped[1]).toEqual({
      role: "assistant",
      content: null,
      tool_calls: [{ id: "c1", type: "function", function: { name: "lookup", arguments: "{\"city\":\"X\"}" } }],
    });
    expect(mapped[2]).toEqual({ role: "tool", content: "{\"ok\":true}", tool_call_id: "c1" });
  });

  test("openaiModel sends mapped frames to a live endpoint", async () => {
    const prev = process.env.OPENAI_REASONING_EFFORT;
    delete process.env.OPENAI_REASONING_EFFORT;
    let seen: Record<string, unknown> | undefined;
    const server = Bun.serve({
      port: 0,
      fetch: async (req) => {
        seen = (await req.json()) as Record<string, unknown>;
        return Response.json({
          choices: [{ message: { content: "from-live", tool_calls: [{ id: "c1", function: { name: "lookup", arguments: "{\"q\":\"x\"}" } }] } }],
        });
      },
    });
    try {
      const model = openaiModel({
        id: "mock",
        baseUrl: String(server.url).replace(/\/+$/, "") + "/v1",
        model: "mock-llm",
        ready: true,
      });
      const a = new Assembler();
      await model.reason(
        {
          messages: [{ role: "pin", content: "keep" }, { role: "user", content: "hi" }],
          tools: [{ name: "lookup", description: "d", schema: { type: "object" } }],
        },
        a,
      );
      const out = a.end();
      expect(out.text).toBe("from-live");
      expect(out.toolCalls[0]?.name).toBe("lookup");
      const msgs = seen!.messages as { role: string }[];
      expect(msgs[0]!.role).toBe("system");
      expect(seen!.reasoning_effort).toBeUndefined();
    } finally {
      if (prev === undefined) delete process.env.OPENAI_REASONING_EFFORT;
      else process.env.OPENAI_REASONING_EFFORT = prev;
      server.stop(true);
    }
  });

  test("gpt-5 chat completions send reasoning_effort none", async () => {
    const prev = process.env.OPENAI_REASONING_EFFORT;
    delete process.env.OPENAI_REASONING_EFFORT;
    let seen: Record<string, unknown> | undefined;
    const server = Bun.serve({
      port: 0,
      fetch: async (req) => {
        seen = (await req.json()) as Record<string, unknown>;
        return Response.json({ choices: [{ message: { content: "ok" } }] });
      },
    });
    try {
      const model = openaiModel({
        id: "mock",
        baseUrl: String(server.url).replace(/\/+$/, "") + "/v1",
        model: "gpt-5.6-luna",
        ready: true,
      });
      const a = new Assembler();
      await model.reason({ messages: [{ role: "user", content: "hi" }], tools: [{ name: "lookup" }] }, a);
      expect(seen!.reasoning_effort).toBe("none");
      expect(seen!.model).toBe("gpt-5.6-luna");
    } finally {
      if (prev === undefined) delete process.env.OPENAI_REASONING_EFFORT;
      else process.env.OPENAI_REASONING_EFFORT = prev;
      server.stop(true);
    }
  });
});

describe("models", () => {
  test("getAvailableModels lists echo ready and openrouter not ready without a key", () => {
    const prev = process.env.OPENROUTER_API_KEY;
    delete process.env.OPENROUTER_API_KEY;
    const h = new Harness();
    h.addModel({
      id: "openrouter",
      ready: false,
      reasonNotReady: "missing OPENROUTER_API_KEY",
      supportsTools: true,
      async reason() {},
    });
    const list = h.getAvailableModels();
    expect(list.some((m) => m.id === "echo" && m.ready)).toBe(true);
    expect(list.some((m) => m.id === "openrouter" && !m.ready)).toBe(true);
    if (prev) process.env.OPENROUTER_API_KEY = prev;
  });

  test("no model bound fails closed", async () => {
    const h = new Harness();
    const run = h.create();
    run.inject({ text: "hi" });
    await expect(run.start()).rejects.toThrow(/no model/);
  });

  test("useModel binds for the next step", async () => {
    const h = new Harness();
    const run = h.create();
    run.useModel("echo").inject({ text: "hello world" });
    const ex = await run.start();
    expect(ex.lastText).toContain("hello world");
    expect(ex.model).toBe("echo");
  });
});

describe("parallel runs", () => {
  test("many starts overlap", async () => {
    const h = new Harness();
    let peak = 0;
    let now = 0;
    const slow: Model = {
      id: "slow",
      ready: true,
      async reason(_req, out) {
        now++;
        if (now > peak) peak = now;
        await Bun.sleep(15);
        now--;
        out.pushText("ok");
      },
    };
    h.addModel(slow);
    const ids: string[] = [];
    for (let i = 0; i < 20; i++) {
      const r = h.create({ model: "slow" });
      r.inject({ text: "x" + i });
      ids.push(r.id);
    }
    const results = await h.startAll(ids);
    expect(results).toHaveLength(20);
    expect(peak).toBeGreaterThan(1);
  });
});

describe("controls", () => {
  test("step is one cycle", async () => {
    const h = new Harness();
    const run = h.create({ model: "echo" });
    run.inject({ text: "once" });
    const a = await run.stepOnce();
    const b = await run.stepOnce();
    expect(a.step).toBe(1);
    expect(b.step).toBe(2);
  });

  test("fork uses another model and does not rewrite parent", async () => {
    const h = new Harness();
    h.addModel({
      id: "other",
      ready: true,
      async reason(_r, out) {
        out.pushText("from-other");
      },
    });
    const parent = h.create({ model: "echo" });
    parent.inject({ text: "shared" });
    await parent.start();
    const child = h.fork(parent.id, { model: "other" });
    child.inject({ text: "child-only" });
    const ex = await child.start();
    expect(ex.lastText).toBe("from-other");
    expect(parent.getContext().some((m) => m.content === "child-only")).toBe(false);
  });

  test("merge folds source into target and stops source", async () => {
    const h = new Harness();
    const a = h.create({ model: "echo" });
    const b = h.create({ model: "echo" });
    a.inject({ text: "from-a" });
    b.inject({ text: "from-b" });
    await a.start();
    await b.start();
    b.merge(a);
    expect(a.explain().state).toBe("stopped");
    expect(b.getContext().some((m) => m.content === "from-a")).toBe(true);
  });

  test("inject mid-run adds user text", async () => {
    const h = new Harness();
    const run = h.create({ model: "echo" });
    run.inject({ text: "first" });
    await run.start();
    run.inject({ text: "second" });
    const ex = await run.start();
    expect(ex.lastText).toContain("second");
  });

  test("stop ends the run", () => {
    const h = new Harness();
    const run = h.create({ model: "echo" });
    run.stop();
    expect(run.explain().state).toBe("stopped");
  });

  test("cancel aborts", () => {
    const h = new Harness();
    const run = h.create({ model: "echo" });
    run.cancel();
    expect(run.explain().state).toBe("cancelled");
  });
});

describe("tools and policy", () => {
  test("tool loop then final text", async () => {
    let calls = 0;
    const tool: Tool = {
      name: "lookup",
      async call(args) {
        calls++;
        return { city: args.city };
      },
    };
    const model: Model = {
      id: "toolish",
      ready: true,
      supportsTools: true,
      async reason(req, out) {
        const last = req.messages[req.messages.length - 1];
        if (last?.role === "tool") {
          out.pushText("done");
          return;
        }
        out.pushToolDelta(0, "c1", "lookup", '{"city":"X"}');
      },
    };
    const h = new Harness();
    h.addModel(model);
    const run = h.create({ model: "toolish", tools: [tool] });
    run.inject({ text: "go" });
    const ex = await run.start();
    expect(calls).toBe(1);
    expect(ex.lastText).toBe("done");
    const frames = run.getContext();
    const asked = frames.find((m) => m.role === "assistant" && m.toolCalls?.length);
    expect(asked?.toolCalls?.[0]?.name).toBe("lookup");
    expect(frames.some((m) => m.role === "tool")).toBe(true);
  });

  test("dangerous tool never executes", async () => {
    let ran = false;
    const tool: Tool = {
      name: "transfer_funds",
      async call() {
        ran = true;
        return { ok: true };
      },
    };
    const model: Model = {
      id: "bad",
      ready: true,
      async reason(req, out) {
        if (req.messages[req.messages.length - 1]?.role === "tool") {
          out.pushText("blocked-seen");
          return;
        }
        out.pushToolDelta(0, "x", "transfer_funds", "{}");
      },
    };
    const h = new Harness();
    h.addModel(model);
    const run = h.create({ model: "bad", tools: [tool] });
    run.inject({ text: "pay" });
    await run.start();
    expect(ran).toBe(false);
  });
});

describe("hooks", () => {
  test("beforeReason can redirect the model", async () => {
    const h = new Harness();
    h.addModel({
      id: "alt",
      ready: true,
      async reason(_r, out) {
        out.pushText("alt-model");
      },
    });
    const run = h.create({
      model: "echo",
      hooks: {
        beforeReason: () => ({ redirect: { model: "alt" } }),
      },
    });
    run.inject({ text: "x" });
    expect((await run.start()).lastText).toBe("alt-model");
  });
});

describe("intake", () => {
  test("POST /runs and GET /models", async () => {
    const h = new Harness();
    const fetch = intake(h);
    const models = await fetch(new Request("http://t/models"));
    expect((await models.json() as { id: string }[]).some((m) => m.id === "echo")).toBe(true);
    const res = await fetch(
      new Request("http://t/runs", { method: "POST", body: JSON.stringify({ text: "ping", model: "echo" }) }),
    );
    const body = (await res.json()) as { lastText: string };
    expect(body.lastText).toContain("ping");
  });
});
