import { describe, expect, test } from "bun:test";
import { onAppsFront, runAppsGepa, scoreAppsPrompt } from "../src/apps/gepa.ts";
import { APPS_CATALOG_V1, APPS_CONSULTANT_V2, APPS_LIBRARIAN, appsSeedPrompts } from "../src/apps/seeds.ts";
import { APPS_PROMPT_ID, APPS_PROMPT_MEAN, appsInstruction } from "../src/apps/prompt.ts";

describe("gepa on composio apps prompt", () => {
  test("librarian loses to consultant-v2 on probe, a2a, usecase, and flow", () => {
    const lib = scoreAppsPrompt(APPS_LIBRARIAN);
    const consult = scoreAppsPrompt(APPS_CONSULTANT_V2);
    expect(consult.probe).toBeGreaterThan(lib.probe);
    expect(consult.a2a).toBeGreaterThan(lib.a2a);
    expect(consult.usecase).toBeGreaterThan(lib.usecase);
    expect(consult.flow).toBeGreaterThan(lib.flow);
    expect(consult.pinpoint).toBeGreaterThan(lib.pinpoint);
  });

  test("catalog-v1 is still a dump and loses on a2a and probe", () => {
    const cat = scoreAppsPrompt(APPS_CATALOG_V1);
    const consult = scoreAppsPrompt(APPS_CONSULTANT_V2);
    expect(consult.a2a).toBeGreaterThan(cat.a2a);
    expect(consult.probe).toBeGreaterThan(cat.probe);
    expect(consult.flow).toBeGreaterThan(cat.flow);
  });

  test("GEPA winner is on the front and beats librarian mean", () => {
    const { winner, all, front } = runAppsGepa(appsSeedPrompts());
    expect(front.some((c) => c.id === winner.id)).toBe(true);
    const lib = all.find((c) => c.id === "librarian")!;
    expect(winner.mean).toBeGreaterThan(lib.mean);
    expect(APPS_PROMPT_MEAN).toBe(winner.mean);
    expect(APPS_PROMPT_ID.length).toBeGreaterThan(0);
    expect(winner.score.a2a).toBe(1);
    expect(winner.score.probe).toBe(1);
    expect(winner.score.usecase).toBe(1);
  });

  test("a worse prompt is not on the Pareto front", () => {
    const { all } = runAppsGepa(appsSeedPrompts());
    const front = onAppsFront(all);
    expect(front.every((c) => c.id !== "librarian")).toBe(true);
    expect(front.every((c) => c.id !== "catalog-v1")).toBe(true);
  });

  test("bound instruction probes A2A and returns a pinpointed flow", () => {
    const sys = appsInstruction();
    expect(sys).toMatch(/recommend_app/);
    expect(sys).toMatch(/A2A/);
    expect(sys).toMatch(/peer agent/i);
    expect(sys).toMatch(/Ask a few questions/i);
    expect(sys).toMatch(/\*\*Flow:\*\*/);
    expect(sys).toMatch(/\*\*Settings:\*\*/);
    expect(sys).toMatch(/choose Composio/);
    expect(sys).toMatch(/pinpointed implementation/);
    expect(sys).not.toMatch(/You help one builder pick apps and debug them/);
  });
});
