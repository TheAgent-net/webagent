import { describe, expect, test } from "bun:test";
import { Assembler } from "../src/assembler.ts";
import { Context } from "../src/context.ts";
import { Harness } from "../src/harness.ts";
import { intake } from "../src/intake.ts";
import type { Model } from "../src/models.ts";
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

describe("models", () => {
  test("toOpenAI maps pin to system", async () => {
    const { toOpenAI } = await import("../src/models.ts");
    const out = toOpenAI([
      { role: "system", content: "you are the apps agent" },
      { role: "pin", content: "Local corpus at corpus/composio." },
      { role: "user", content: "send email" },
    ]);
    expect(out[1]).toEqual({ role: "system", content: "Local corpus at corpus/composio." });
    expect(out.map((m) => (m as { role: string }).role)).not.toContain("pin");
  });

  test("toOpenAI keeps assistant tool_calls ahead of tool results", async () => {
    const { toOpenAI } = await import("../src/models.ts");
    const out = toOpenAI([
      { role: "user", content: "email customers" },
      {
        role: "assistant",
        content: "",
        toolCalls: [{ id: "c1", name: "recommend_app", arguments: { request: "email customers" } }],
      },
      { role: "tool", content: "{\"apps\":[]}", toolCallId: "c1" },
      { role: "tool", content: "orphan", toolCallId: "missing" },
    ]);
    expect(out[1]).toEqual({
      role: "assistant",
      content: null,
      tool_calls: [
        {
          id: "c1",
          type: "function",
          function: { name: "recommend_app", arguments: "{\"request\":\"email customers\"}" },
        },
      ],
    });
    expect(out[2]).toEqual({ role: "tool", content: "{\"apps\":[]}", tool_call_id: "c1" });
    expect(out).toHaveLength(3);
  });

  test("start records tool_calls so a second model step can run", async () => {
    const h = new Harness();
    let n = 0;
    h.addModel({
      id: "mock",
      ready: true,
      supportsTools: true,
      async reason(req, out) {
        n++;
        if (n === 1) {
          out.pushToolDelta(0, "c1", "lookup", '{"q":"x"}');
          return;
        }
        const asst = req.messages.find((m) => m.role === "assistant" && m.toolCalls?.length);
        expect(asst?.toolCalls?.[0]).toEqual({ id: "c1", name: "lookup", arguments: { q: "x" } });
        expect(req.messages.some((m) => m.role === "tool" && m.toolCallId === "c1")).toBe(true);
        out.pushText("gmail");
      },
    });
    const lookup = {
      name: "lookup",
      async call() {
        return { ok: true };
      },
    };
    h.addTool(lookup);
    const run = h.create({ model: "mock", tools: [lookup] });
    run.inject({ text: "email customers" });
    const ex = await run.start();
    expect(n).toBe(2);
    expect(ex.lastText).toBe("gmail");
  });

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
