import { describe, expect, test } from "bun:test";
import { Assembler } from "../src/assembler.ts";
import { Context } from "../src/context.ts";
import { Harness } from "../src/harness.ts";
import type { Model } from "../src/models.ts";
import { Scheduler } from "../src/scheduler.ts";

describe("perf: assembler", () => {
  test("JSON.parse runs once at end, never per chunk", () => {
    const orig = JSON.parse;
    let parses = 0;
    JSON.parse = ((...args: Parameters<typeof JSON.parse>) => {
      parses++;
      return orig.apply(JSON, args);
    }) as typeof JSON.parse;
    try {
      const a = new Assembler();
      a.pushToolDelta(0, "c1", "lookup", "");
      for (let i = 0; i < 250; i++) {
        a.pushToolDelta(0, undefined, undefined, i === 0 ? '{"n":' : i === 249 ? "1}" : " ");
      }
      expect(parses).toBe(0);
      const out = a.end();
      expect(parses).toBe(1);
      expect(out.toolCalls[0]?.arguments).toEqual({ n: 1 });
    } finally {
      JSON.parse = orig;
    }
  });

  test("thousands of text chunks join without parsing", () => {
    const orig = JSON.parse;
    let parses = 0;
    JSON.parse = ((...args: Parameters<typeof JSON.parse>) => {
      parses++;
      return orig.apply(JSON, args);
    }) as typeof JSON.parse;
    try {
      const a = new Assembler();
      const n = 5000;
      for (let i = 0; i < n; i++) a.pushText("x");
      const out = a.end();
      expect(out.text.length).toBe(n);
      expect(out.toolCalls).toEqual([]);
      expect(parses).toBe(0);
    } finally {
      JSON.parse = orig;
    }
  });
});

describe("perf: copy-on-write context", () => {
  test("many forks share the parent spine until a write", () => {
    const parent = new Context();
    for (let i = 0; i < 1500; i++) parent.append({ role: "user", content: "m" + i });
    const kids: Context[] = new Array(400);
    for (let i = 0; i < kids.length; i++) kids[i] = parent.fork();

    const spine = parent.view();
    for (let i = 0; i < kids.length; i++) expect(kids[i]!.view()).toBe(spine);

    kids[0]!.append({ role: "assistant", content: "only-child-0" });
    expect(parent.view()).toBe(spine);
    expect(kids[1]!.view()).toBe(spine);
    expect(kids[0]!.view()).not.toBe(spine);
    expect(parent.length).toBe(1500);
    expect(kids[0]!.length).toBe(1501);
    expect(kids[2]!.length).toBe(1500);
  });

  test("forks stay cheaper than cloning the log", () => {
    const parent = new Context();
    for (let i = 0; i < 2000; i++) parent.append({ role: "user", content: "row-" + i });
    const frames = parent.view();

    const tClone = performance.now();
    for (let i = 0; i < 300; i++) frames.slice();
    const cloneMs = performance.now() - tClone;

    const tFork = performance.now();
    for (let i = 0; i < 300; i++) parent.fork();
    const forkMs = performance.now() - tFork;

    // COW fork is a flag + object; must beat a full array copy on this size.
    expect(forkMs).toBeLessThan(cloneMs + 8);
    expect(parent.view()).toBe(frames);
  });
});

describe("perf: scheduler", () => {
  test("in-flight never exceeds the cap under backlog", async () => {
    const s = new Scheduler(5);
    let now = 0;
    let peak = 0;
    const jobs = new Array(20);
    for (let i = 0; i < jobs.length; i++) {
      jobs[i] = s.run(async () => {
        now++;
        if (now > peak) peak = now;
        await Bun.sleep(6);
        now--;
        return i;
      });
    }
    const out = await Promise.all(jobs);
    expect(out).toHaveLength(20);
    expect(peak).toBeLessThanOrEqual(5);
    expect(peak).toBe(5);
  });
});

describe("perf: parallel runs", () => {
  test("startAll fans out and stays under the harness cap", async () => {
    const h = new Harness({ maxInflight: 8 });
    let now = 0;
    let peak = 0;
    const slow: Model = {
      id: "slow",
      ready: true,
      async reason(_req, out) {
        now++;
        if (now > peak) peak = now;
        await Bun.sleep(8);
        now--;
        out.pushText("ok");
      },
    };
    h.addModel(slow);
    const ids: string[] = [];
    for (let i = 0; i < 24; i++) {
      const r = h.create({ model: "slow" });
      r.inject({ text: "x" + i });
      ids.push(r.id);
    }
    const results = await h.startAll(ids);
    expect(results).toHaveLength(24);
    expect(results.every((e) => e.lastText === "ok")).toBe(true);
    expect(peak).toBeGreaterThan(1);
    expect(peak).toBeLessThanOrEqual(8);
  });

  test("event log stays capped while injects keep coming", async () => {
    const h = new Harness();
    const run = h.create();
    for (let i = 0; i < 80; i++) run.inject({ text: "n" + i });
    const ev: { t: string }[] = [];
    for await (const e of run.eventStream()) ev.push(e);
    expect(ev.length).toBe(32);
    expect(run.getContext().length).toBe(80);
  });
});
