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

  test("tool step keeps the assistant tool call in history", async () => {
    const seen: string[] = [];
    const tool: Tool = {
      name: "lookup",
      async call() {
        return { city: "X" };
      },
    };
    const model: Model = {
      id: "toolish",
      ready: true,
      supportsTools: true,
      async reason(req, out) {
        const last = req.messages[req.messages.length - 1];
        seen.push(last?.role ?? "none");
        if (last?.role === "tool") {
          const prior = req.messages[req.messages.length - 2];
          expect(prior?.role).toBe("assistant");
          expect(prior?.toolCalls?.[0]).toEqual({ id: "c1", name: "lookup", arguments: { city: "X" } });
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
    await run.start();
    expect(seen).toEqual(["user", "tool"]);
    const roles = run.getContext().map((m) => m.role);
    expect(roles).toContain("assistant");
    expect(run.getContext().some((m) => m.role === "assistant" && m.toolCalls?.[0]?.id === "c1")).toBe(true);
  });

  test("stop during an in-flight start stays stopped", async () => {
    let release!: () => void;
    const gate = new Promise<void>((r) => {
      release = r;
    });
    const h = new Harness();
    h.addModel({
      id: "slow",
      ready: true,
      async reason(_r, out) {
        await gate;
        out.pushText("late");
      },
    });
    const run = h.create({ model: "slow" });
    run.inject({ text: "x" });
    const pending = run.start();
    const before = run.explain();
    run.stop();
    release();
    const ex = await pending;
    expect(ex.state).toBe("stopped");
    expect(ex.step).toBe(before.step);
    expect(ex.lastText).toBe(before.lastText);
    expect(run.getContext().some((m) => m.content === "late")).toBe(false);
  });

  test("stop during a tool step leaves no unmatched tool calls", async () => {
    let release!: () => void;
    let entered!: () => void;
    const gate = new Promise<void>((r) => {
      release = r;
    });
    const inTool = new Promise<void>((r) => {
      entered = r;
    });
    const tool: Tool = {
      name: "lookup",
      async call() {
        entered();
        await gate;
        return { city: "X" };
      },
    };
    const model: Model = {
      id: "toolish",
      ready: true,
      supportsTools: true,
      async reason(_req, out) {
        out.pushToolDelta(0, "c1", "lookup", '{"city":"X"}');
      },
    };
    const h = new Harness();
    h.addModel(model);
    const run = h.create({ model: "toolish", tools: [tool] });
    run.inject({ text: "go" });
    const pending = run.start();
    await inTool;
    run.stop();
    release();
    await pending;
    const ctx = run.getContext();
    const assistant = ctx.find((m) => m.role === "assistant" && (m.toolCalls?.length ?? 0) > 0);
    expect(assistant?.toolCalls?.map((c) => c.id)).toEqual(["c1"]);
    const tools = ctx.filter((m) => m.role === "tool");
    expect(tools).toHaveLength(1);
    expect(tools[0]?.toolCallId).toBe("c1");
    expect(tools[0]?.content).toContain("city");
  });

  test("stop on a later tool keeps earlier results", async () => {
    let release!: () => void;
    let entered!: () => void;
    const gate = new Promise<void>((r) => {
      release = r;
    });
    const inSecond = new Promise<void>((r) => {
      entered = r;
    });
    const first: Tool = {
      name: "one",
      async call() {
        return { n: 1 };
      },
    };
    const second: Tool = {
      name: "two",
      async call() {
        entered();
        await gate;
        return { n: 2 };
      },
    };
    const model: Model = {
      id: "pair",
      ready: true,
      supportsTools: true,
      async reason(_req, out) {
        out.pushToolDelta(0, "c1", "one", "{}");
        out.pushToolDelta(1, "c2", "two", "{}");
      },
    };
    const h = new Harness();
    h.addModel(model);
    const run = h.create({ model: "pair", tools: [first, second] });
    run.inject({ text: "go" });
    const pending = run.start();
    await inSecond;
    run.stop();
    release();
    await pending;
    const tools = run.getContext().filter((m) => m.role === "tool");
    expect(tools).toHaveLength(2);
    expect(tools[0]?.toolCallId).toBe("c1");
    expect(tools[0]?.content).toContain("1");
    expect(tools[1]?.toolCallId).toBe("c2");
    expect(tools[1]?.content).toContain("2");
  });

  test("repeated forks keep distinct ids", () => {
    const h = new Harness();
    const parent = h.create();
    const a = h.fork(parent.id);
    const b = h.fork(parent.id);
    expect(a.id).not.toBe(b.id);
    expect(h.get(a.id)).toBe(a);
    expect(h.get(b.id)).toBe(b);
    expect(h.listRuns()).toHaveLength(3);
  });

  test("merge of a fork keeps the shared prefix once", () => {
    const h = new Harness();
    const parent = h.create({ model: "echo" });
    parent.inject({ text: "shared" });
    const child = h.fork(parent.id);
    child.inject({ text: "branch" });
    parent.merge(child);
    const texts = parent.getContext().map((m) => m.content);
    expect(texts.filter((t) => t === "shared")).toHaveLength(1);
    expect(texts).toContain("branch");
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
    b.merge(a);
    expect(b.getContext().filter((m) => m.content === "from-a")).toHaveLength(1);
  });

  test("stop during beforeReason does not call the model", async () => {
    let release!: () => void;
    const gate = new Promise<void>((r) => {
      release = r;
    });
    let reasoned = false;
    const h = new Harness();
    h.addModel({
      id: "slow",
      ready: true,
      async reason(_r, out) {
        reasoned = true;
        out.pushText("late");
      },
    });
    const run = h.create({
      model: "slow",
      hooks: {
        beforeReason: async () => {
          await gate;
        },
      },
    });
    run.inject({ text: "x" });
    const pending = run.start();
    run.stop();
    release();
    const ex = await pending;
    expect(ex.state).toBe("stopped");
    expect(reasoned).toBe(false);
  });

  test("a thrown tool hook still fills every tool result", async () => {
    const model: Model = {
      id: "pair",
      ready: true,
      supportsTools: true,
      async reason(_req, out) {
        out.pushToolDelta(0, "c1", "one", "{}");
        out.pushToolDelta(1, "c2", "two", "{}");
      },
    };
    const h = new Harness();
    h.addModel(model);
    const run = h.create({
      model: "pair",
      tools: [
        { name: "one", async call() { return { n: 1 }; } },
        { name: "two", async call() { return { n: 2 }; } },
      ],
      hooks: {
        beforeTool: (_id, name) => {
          if (name === "two") throw new Error("boom");
          return "allow";
        },
      },
    });
    run.inject({ text: "go" });
    await expect(run.start()).rejects.toThrow(/boom/);
    expect(run.explain().state).not.toBe("running");
    const tools = run.getContext().filter((m) => m.role === "tool");
    expect(tools.map((m) => m.toolCallId).sort()).toEqual(["c1", "c2"]);
    expect(tools.some((m) => m.content.includes("boom"))).toBe(true);
  });

  test("afterTool throw keeps the successful tool result", async () => {
    const model: Model = {
      id: "pair",
      ready: true,
      supportsTools: true,
      async reason(_req, out) {
        out.pushToolDelta(0, "c1", "one", "{}");
        out.pushToolDelta(1, "c2", "two", "{}");
      },
    };
    const h = new Harness();
    h.addModel(model);
    const run = h.create({
      model: "pair",
      tools: [
        { name: "one", async call() { return { n: 1 }; } },
        { name: "two", async call() { return { n: 2 }; } },
      ],
      hooks: {
        afterTool: (_id, name) => {
          if (name === "one") throw new Error("hook");
        },
      },
    });
    run.inject({ text: "go" });
    await expect(run.start()).rejects.toThrow(/hook/);
    expect(run.explain().state).not.toBe("running");
    const tools = run.getContext().filter((m) => m.role === "tool");
    expect(tools[0]?.toolCallId).toBe("c1");
    expect(tools[0]?.content).toContain("1");
    expect(tools[0]?.content).not.toContain("tool_error");
    expect(tools.map((m) => m.toolCallId).sort()).toEqual(["c1", "c2"]);
  });

  test("stop during beforeTool stubs the remaining calls", async () => {
    let release!: () => void;
    let entered!: () => void;
    const gate = new Promise<void>((r) => {
      release = r;
    });
    const inHook = new Promise<void>((r) => {
      entered = r;
    });
    const model: Model = {
      id: "pair",
      ready: true,
      supportsTools: true,
      async reason(_req, out) {
        out.pushToolDelta(0, "c1", "one", "{}");
        out.pushToolDelta(1, "c2", "two", "{}");
      },
    };
    const h = new Harness();
    h.addModel(model);
    const run = h.create({
      model: "pair",
      tools: [
        { name: "one", async call() { return { n: 1 }; } },
        { name: "two", async call() { return { n: 2 }; } },
      ],
      hooks: {
        beforeTool: async (_id, name) => {
          if (name === "two") {
            entered();
            await gate;
          }
          return "allow" as const;
        },
      },
    });
    run.inject({ text: "go" });
    const pending = run.start();
    await inHook;
    run.stop();
    release();
    await pending;
    const tools = run.getContext().filter((m) => m.role === "tool");
    expect(tools).toHaveLength(2);
    expect(tools[0]?.toolCallId).toBe("c1");
    expect(tools[0]?.content).toContain("1");
    expect(tools[1]?.toolCallId).toBe("c2");
    expect(tools[1]?.content).toContain("stopped");
    expect(tools[1]?.content).not.toContain("\"n\":2");
  });

  test("stop during beforeTool does not append after it returns", async () => {
    let release!: () => void;
    let entered!: () => void;
    const gate = new Promise<void>((r) => {
      release = r;
    });
    const inHook = new Promise<void>((r) => {
      entered = r;
    });
    const h = new Harness();
    h.addModel({
      id: "slow",
      ready: true,
      supportsTools: true,
      async reason(_req, out) {
        out.pushToolDelta(0, "c1", "lookup", "{}");
      },
    });
    const run = h.create({
      model: "slow",
      tools: [{ name: "lookup", async call() { return { late: true }; } }],
      hooks: {
        beforeTool: async () => {
          entered();
          await gate;
          return "allow" as const;
        },
      },
    });
    run.inject({ text: "go" });
    const pending = run.start();
    await inHook;
    run.stop();
    const frozen = run.getContext().map((m) => m.content);
    release();
    await pending;
    expect(run.getContext().map((m) => m.content)).toEqual(frozen);
    expect(frozen.some((c) => c.includes("late"))).toBe(false);
  });

  test("a rejected in-flight tool does not write after stop", async () => {
    let reject!: (e: Error) => void;
    let entered!: () => void;
    const gate = new Promise<never>((_, r) => {
      reject = r;
    });
    const inTool = new Promise<void>((r) => {
      entered = r;
    });
    const h = new Harness();
    h.addModel({
      id: "boom",
      ready: true,
      supportsTools: true,
      async reason(_req, out) {
        out.pushToolDelta(0, "c1", "lookup", "{}");
      },
    });
    const run = h.create({
      model: "boom",
      tools: [{
        name: "lookup",
        async call() {
          entered();
          await gate;
          return { n: 1 };
        },
      }],
    });
    run.inject({ text: "go" });
    const pending = run.start();
    await inTool;
    run.stop();
    const frozen = run.getContext().map((m) => `${m.role}:${m.content}`);
    reject(new Error("exploded"));
    try {
      await pending;
    } catch {
      // throw is optional; the invariant is that history stays frozen
    }
    expect(run.getContext().map((m) => `${m.role}:${m.content}`)).toEqual(frozen);
  });

  test("duplicate tool ids in one step each get a result", async () => {
    const model: Model = {
      id: "dup",
      ready: true,
      supportsTools: true,
      async reason(_req, out) {
        out.pushToolDelta(0, "c1", "one", "{}");
        out.pushToolDelta(1, "c1", "two", "{}");
      },
    };
    const h = new Harness();
    h.addModel(model);
    const run = h.create({
      model: "dup",
      tools: [
        { name: "one", async call() { return { n: 1 }; } },
        { name: "two", async call() { return { n: 2 }; } },
      ],
      hooks: {
        beforeTool: (_id, name) => {
          if (name === "two") throw new Error("dup");
          return "allow";
        },
      },
    });
    run.inject({ text: "go" });
    await expect(run.start()).rejects.toThrow(/dup/);
    expect(run.explain().state).not.toBe("running");
    const tools = run.getContext().filter((m) => m.role === "tool");
    expect(tools).toHaveLength(2);
    expect(tools[0]?.toolCallId).toBe("c1");
    expect(tools[0]?.content).toContain("1");
    expect(tools[1]?.toolCallId).toBe("c1");
    expect(tools[1]?.content).toContain("dup");
  });

  test("reused tool ids still get a result on a later throw", async () => {
    let turn = 0;
    const model: Model = {
      id: "again",
      ready: true,
      supportsTools: true,
      async reason(req, out) {
        if (req.messages[req.messages.length - 1]?.role === "tool") {
          out.pushText("ok");
          return;
        }
        turn++;
        out.pushToolDelta(0, "c1", "lookup", "{}");
      },
    };
    const h = new Harness();
    h.addModel(model);
    const run = h.create({
      model: "again",
      tools: [{ name: "lookup", async call() { return { n: turn }; } }],
      hooks: {
        beforeTool: () => {
          if (turn > 1) throw new Error("again");
          return "allow";
        },
      },
    });
    run.inject({ text: "one" });
    await run.start();
    run.inject({ text: "two" });
    await expect(run.start()).rejects.toThrow(/again/);
    const tools = run.getContext().filter((m) => m.role === "tool" && m.toolCallId === "c1");
    expect(tools.length).toBeGreaterThanOrEqual(2);
    expect(tools[tools.length - 1]?.content).toContain("again");
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
    expect(run.skipStep().step).toBe(0);
  });

  test("absorb picks up a suffix written after an empty merge", () => {
    const parent = new Context();
    parent.append({ role: "user", content: "shared" });
    const child = parent.fork();
    parent.absorb(child);
    child.append({ role: "user", content: "later" });
    parent.absorb(child);
    expect(parent.view().map((m) => m.content)).toEqual(["shared", "later"]);
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
