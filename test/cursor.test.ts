import { describe, expect, test } from "bun:test";
import { Assembler } from "../src/assembler.ts";
import { applyReply, cursorModel } from "../src/cursor.ts";
import { defaultHarness } from "../src/harness.ts";

describe("cursor model", () => {
  test("lists cursor and stays closed without a key", () => {
    const prev = process.env.CURSOR_API_KEY;
    delete process.env.CURSOR_API_KEY;
    const m = cursorModel();
    expect(m.id).toBe("cursor");
    expect(m.ready).toBe(false);
    expect(m.reasonNotReady).toContain("CURSOR_API_KEY");
    const h = defaultHarness();
    expect(h.getAvailableModels().some((x) => x.id === "cursor" && !x.ready)).toBe(true);
    if (prev) process.env.CURSOR_API_KEY = prev;
  });

  test("applyReply maps JSON content and tool calls", () => {
    const a = new Assembler();
    applyReply('{"content":"hi","tool_calls":[{"id":"c1","name":"site_lookup","arguments":{"query":"cost"}}]}', a);
    const out = a.end();
    expect(out.text).toBe("hi");
    expect(out.toolCalls).toEqual([{ id: "c1", name: "site_lookup", arguments: { query: "cost" } }]);
  });

  test("applyReply reads a fenced envelope", () => {
    const a = new Assembler();
    applyReply('```json\n{"content":"ok","tool_calls":[]}\n```', a);
    expect(a.end().text).toBe("ok");
  });

  test("applyReply keeps plain text when JSON is absent", () => {
    const a = new Assembler();
    applyReply("just words", a);
    expect(a.end().text).toBe("just words");
  });
});
