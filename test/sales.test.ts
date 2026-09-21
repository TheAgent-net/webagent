import { describe, expect, test } from "bun:test";
import { onFront, runGepa, scorePrompt } from "../src/sales/gepa.ts";
import { LIBRARIAN, SALES_V2, seedPrompts } from "../src/sales/seeds.ts";
import { SALES_PROMPT_ID, SALES_PROMPT_MEAN, salesInstruction } from "../src/sales/prompt.ts";
import { mapRisks, reportText } from "../src/sales/risks.ts";
import { attachSales } from "../src/sales/attach.ts";
import { Harness } from "../src/harness.ts";
import { buildPack } from "../src/site/pack.ts";
import type { CrawlState } from "../src/site/crawl.ts";

describe("gepa on sales prompt", () => {
  test("librarian loses to the sales-v2 seed on report and risks", () => {
    const lib = scorePrompt(LIBRARIAN);
    const sales = scorePrompt(SALES_V2);
    expect(sales.report).toBeGreaterThan(lib.report);
    expect(sales.risks).toBeGreaterThan(lib.risks);
    expect(sales.penalty).toBeGreaterThan(lib.penalty);
  });

  test("GEPA winner is on the front and beats librarian mean", () => {
    const { winner, all, front } = runGepa(seedPrompts());
    expect(front.some((c) => c.id === winner.id)).toBe(true);
    const lib = all.find((c) => c.id === "librarian")!;
    expect(winner.mean).toBeGreaterThan(lib.mean);
    expect(SALES_PROMPT_MEAN).toBe(winner.mean);
    expect(SALES_PROMPT_ID.length).toBeGreaterThan(0);
  });

  test("a worse prompt is not on the Pareto front", () => {
    const { all } = runGepa(seedPrompts());
    const front = onFront(all);
    expect(front.every((c) => c.id !== "librarian")).toBe(true);
  });
});

describe("map_risks and report", () => {
  test("AI startup gets AI risks, penalties, and a category customer", () => {
    const note = mapRisks({ category: "AI", does: "LLM agents for support" });
    expect(note.risks.some((r) => /AI|model|vendor/i.test(r))).toBe(true);
    expect(note.penalties.length).toBeGreaterThan(0);
    expect(note.proof.name).toMatch(/Imagine AI/i);
    const text = reportText(note);
    expect(text).toContain("What's at risk:");
    expect(text).toContain("How Corgi covers it:");
    expect(text).toContain("Why Corgi:");
    expect(text).toContain("If you are not insured:");
    expect(text).toContain("Usually");
    expect(text).toContain("name and best email");
    expect(text.length).toBeLessThan(2400);
  });

  test("SaaS seed maps to Intryc and a seed stack", () => {
    const note = mapRisks({ category: "SaaS", does: "B2B analytics" });
    expect(note.offer).toMatch(/Seed/i);
    expect(note.proof.name).toMatch(/Intryc/i);
    expect(note.costBand).toMatch(/2,000|2k/i);
  });
});

describe("attachSales", () => {
  test("binds the GEPA instruction and map_risks", () => {
    const h = new Harness();
    const pack = buildPack(emptyCrawl());
    const run = attachSales(h, pack, { model: "echo" });
    const sys = run.getContext().find((m) => m.role === "system")!.content;
    expect(sys).toContain("short pitch");
    expect(sys).toContain("contact details");
    expect(sys).toContain("not insured");
    expect(sys).toContain(pack.origin);
    expect(run.listTools().some((t) => t.name === "map_risks")).toBe(true);
    expect(salesInstruction(pack)).toContain("map_risks");
  });
});

function emptyCrawl(): CrawlState {
  return {
    origin: "https://www.corgi.insure",
    pages: [
      {
        url: "https://www.corgi.insure/",
        status: 200,
        title: "Corgi",
        description: "Startup insurance",
        headings: ["Seed"],
        text: "Quote in minutes",
        links: [],
        forms: [],
        gated: false,
      },
    ],
    pending: [],
    seen: new Set(),
    cookies: "",
  };
}
