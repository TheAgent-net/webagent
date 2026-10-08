import { describe, expect, test } from "bun:test";
import { composePrompt, REPLY_SHAPE } from "../src/pack/attach.ts";
import { loadPackConfig, packPolicy } from "../src/pack/index.ts";
import { checkReply, paretoFront, pickParent, type Candidate, type CaseScore, type TuneCase } from "../src/pack/tune.ts";

const ids = new Set(["plans", "token-cost"]);
const pricing: TuneCase = {
  id: "pricing",
  turns: ["What does it cost?"],
  goal: "Give the plan prices first.",
  expect: { visual: true, calls: ["docs_lookup"], say: ["\\$19|19 USD"], never: ["enterprise only"] },
};

describe("tune checks", () => {
  test("a good reply passes every check", () => {
    const reply = "Plans start free. Pro is **$19 a month**.\n\n[[show:plans]]\n\n- Max is $100.";
    const got = checkReply(pricing, { replies: [reply], calls: ["docs_lookup"] }, ids);
    expect(got.failed).toEqual([]);
    expect(got.pass).toBe(1);
  });

  test("checks catch a heading lead, tool names, a fake visual, and a missing call", () => {
    const reply = "## Pricing\n\nI used docs_lookup. Is that ok? Anything else?\n\n[[show:made-up]]";
    const got = checkReply(pricing, { replies: [reply], calls: [] }, ids);
    expect(got.failed).toContain("answer first: lead is not a heading and is 45 words or fewer");
    expect(got.failed).toContain("no tool names or JSON");
    expect(got.failed).toContain("at most one question");
    expect(got.failed).toContain("at most one visual, with a real id");
    expect(got.failed).toContain("calls docs_lookup");
  });
});

describe("tune selection", () => {
  const score = (id: string, s: number): CaseScore => ({ id, score: s, checks: s, judge: s, failed: [], note: "", reply: "", calls: [] });
  const cand = (id: string, a: number, b: number): Candidate => ({ id, text: id, cases: [score("a", a), score("b", b)], mean: (a + b) / 2 });

  test("the front keeps every candidate that leads on some case", () => {
    const pool = [cand("seed", 0.5, 0.5), cand("gen1", 0.9, 0.2), cand("gen2", 0.4, 0.8), cand("gen3", 0.3, 0.3)];
    expect(paretoFront(pool).map((p) => p.id).sort()).toEqual(["gen1", "gen2"]);
    expect(["gen1", "gen2"]).toContain(pickParent(pool, () => 0.1).id);
  });
});

describe("one system prompt", () => {
  test("pack instruction, then reply shape; visuals stay out of the prompt", () => {
    const config = loadPackConfig("packs/smallest");
    const runtime = { config, dir: "", instruction: "PACK RULES", policy: packPolicy(config), site: {} as never, pages: [], chunks: [] };
    expect(composePrompt(runtime)).toBe("PACK RULES\n\n" + REPLY_SHAPE);
    config.visuals = [{ id: "x", kind: "figure", label: "X", text: "", page: "/", selector: "#x", image: "visuals/x.jpg", width: 1, height: 1 }];
    expect(composePrompt(runtime, "TRY THIS")).toBe("TRY THIS\n\n" + REPLY_SHAPE);
    expect(REPLY_SHAPE).toContain("the docs do not specify");
  });
});

describe("starter cases", () => {
  test("every pack gets generic cases; pricing joins only with a pricing page", async () => {
    const { starterCases } = await import("../src/pack/tune.ts");
    const plain = starterCases("Acme", ["/", "/docs"]);
    expect(plain.map((c) => c.id)).toEqual(["greeting", "what-is", "how-it-works", "get-started", "standalone", "unknown-fact", "off-topic", "injection"]);
    expect(starterCases("Acme", ["/pricing"]).some((c) => c.id === "pricing")).toBe(true);
    const unknown = plain.find((c) => c.id === "unknown-fact")!;
    const reply = "The docs do not specify a latency number.";
    expect(checkReply(unknown, { replies: [reply], calls: [] }, new Set()).failed.some((f) => f.includes("docs"))).toBe(true);
  });
});
