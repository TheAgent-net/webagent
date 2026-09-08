import { describe, expect, test } from "bun:test";
import { onFront, runGepa, scorePrompt } from "../src/sales/gepa.ts";
import { LIBRARIAN, SALES_V2, SALES_V3, SALES_V4, seedPrompts } from "../src/sales/seeds.ts";
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

  test("sales-v3 interviews for company and founder", () => {
    const v3 = scorePrompt(SALES_V3);
    const v2 = scorePrompt(SALES_V2);
    expect(v3.discover).toBeGreaterThan(v2.discover);
    expect(SALES_V3).toMatch(/company name/);
    expect(SALES_V3).toMatch(/founder name/);
    expect(SALES_V3).toMatch(/note_visitor/);
  });

  test("sales-v4 beats v3 on cover, readme, and teach", () => {
    const v3 = scorePrompt(SALES_V3);
    const v4 = scorePrompt(SALES_V4);
    expect(v4.cover).toBeGreaterThan(v3.cover);
    expect(v4.readme).toBeGreaterThan(v3.readme);
    expect(v4.teach).toBeGreaterThan(v3.teach);
    expect(v4.discover).toBe(1);
    expect(SALES_V4).toMatch(/SPIN|need-payoff|Challenger|SNAP/i);
    expect(SALES_V4).toMatch(/how much we cover|\$1M per claim/i);
  });

  test("GEPA winner is on the front and beats librarian mean", () => {
    const { winner, all, front } = runGepa(seedPrompts());
    expect(front.some((c) => c.id === winner.id)).toBe(true);
    const lib = all.find((c) => c.id === "librarian")!;
    expect(winner.mean).toBeGreaterThan(lib.mean);
    expect(SALES_PROMPT_MEAN).toBe(winner.mean);
    expect(SALES_PROMPT_ID.length).toBeGreaterThan(0);
    expect(winner.text).toMatch(/company name|founder name/i);
    expect(winner.text).toMatch(/readme|# For /i);
    expect(winner.id).toMatch(/sales-v4|m1|m2/);
    expect(winner.mean).toBeGreaterThan(0.9);
  });

  test("a worse prompt is not on the Pareto front", () => {
    const { all } = runGepa(seedPrompts());
    const front = onFront(all);
    expect(front.every((c) => c.id !== "librarian")).toBe(true);
  });
});

describe("map_risks and report", () => {
  test("AI startup gets AI risks, penalties, and a category customer", () => {
    const note = mapRisks({ category: "AI", does: "LLM agents for support", company: "Northline", founder: "Maya Chen" });
    expect(note.risks.some((r) => /AI|model|vendor/i.test(r))).toBe(true);
    expect(note.penalties.length).toBeGreaterThan(0);
    expect(note.proof.name).toMatch(/Imagine AI/i);
    const text = reportText(note);
    expect(text).toContain("# For Maya Chen — Northline");
    expect(text).toContain("Maya Chen");
    expect(text).toContain("Northline");
    expect(text).toMatch(/What can go wrong/);
    expect(text).toMatch(/\$1M/);
    expect(text).toMatch(/If you skip insurance/);
    expect(text).toMatch(/## Next/);
    expect(note.covers.some((c) => /E&O|Cyber/i.test(c.line))).toBe(true);
    expect(text.length).toBeLessThan(2200);
  });

  test("SaaS seed maps to Intryc and a seed stack", () => {
    const note = mapRisks({ category: "SaaS", does: "B2B analytics" });
    expect(note.offer).toMatch(/Seed/i);
    expect(note.proof.name).toMatch(/Intryc/i);
    expect(note.costBand).toMatch(/2,000|2k/i);
    expect(note.next.url).toContain("package-selection");
  });

  test("sales instruction omits the app quote on a non-Corgi pack", () => {
    const pack = buildPack({
      origin: "https://example.com",
      pages: [
        {
          url: "https://example.com/",
          status: 200,
          title: "Example",
          description: "",
          headings: [],
          text: "Hello",
          links: [],
          forms: [],
          gated: false,
        },
      ],
      pending: [],
      seen: new Set(),
      cookies: "",
    });
    expect(pack.flows.every((f) => f.id !== "app_quote")).toBe(true);
    expect(salesInstruction(pack)).not.toContain("package-selection");
  });
});

describe("attachSales", () => {
  test("binds the interview instruction, map_risks, and note_visitor", async () => {
    const h = new Harness();
    const pack = buildPack(emptyCrawl());
    const run = attachSales(h, pack, { model: "echo" });
    const sys = run.getContext().find((m) => m.role === "system")!.content;
    expect(sys).toContain("pinpoint report");
    expect(sys).toMatch(/company name|founder name/i);
    expect(sys).toContain(pack.origin);
    expect(run.listTools().some((t) => t.name === "map_risks")).toBe(true);
    expect(run.listTools().some((t) => t.name === "note_visitor")).toBe(true);
    expect(salesInstruction(pack)).toContain("map_risks");
    expect(salesInstruction(pack)).toContain("package-selection");
    expect(salesInstruction(pack)).toContain("app.corgi.insure");
    expect(salesInstruction(pack)).toMatch(/CGL/);
    expect(salesInstruction(pack)).toMatch(/Tech E&O/);
    expect(salesInstruction(pack)).not.toMatch(/tejaskumar|gamil|555-1234/i);
    expect(pack.flows.some((f) => f.id === "app_quote")).toBe(true);
    expect(run.listTools().some((t) => t.name === "flow_app_quote")).toBe(true);
    const visitor = run.tools.find((t) => t.name === "note_visitor")!;
    const before = run.getContext().length;
    const saved = await visitor.call({ company: "Northline", founder: "Maya Chen", field: "SaaS", does: "B2B analytics", stage: "seed" });
    expect(JSON.stringify(saved)).toMatch(/Northline|Maya Chen/);
    expect(run.getContext().length).toBe(before);
    expect(run.getContext().every((m) => m.role !== "pin" || !/Visitor note/.test(m.content))).toBe(true);
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
