import type { Harness } from "../harness.ts";
import type { Run } from "../run.ts";
import { attachPack } from "../site/attach.ts";
import type { SitePack } from "../site/types.ts";
import type { Tool } from "../tools.ts";
import { salesInstruction } from "./prompt.ts";
import { mapRisks, reportText, vulnerabilityReport } from "./risks.ts";

/** Bind the Corgi (or any) pack as a sales person. Public controls only. */
export function attachSales(h: Harness, pack: SitePack, opts?: { model?: string }): Run {
  const run = attachPack(h, pack, { model: opts?.model, instruction: salesInstruction(pack) });
  const risk = riskTool();
  const quote = quoteGuideTool();
  h.addTool(risk);
  h.addTool(quote);
  run.useTool(risk);
  run.useTool(quote);
  return run;
}

export function riskTool(): Tool {
  return {
    name: "map_risks",
    description:
      "Given category, what the startup does, and optionally stage, return grounded risks, vulnerabilities with likelihood estimates, penalties, proof, package recommendation, and premium estimate.",
    schema: {
      type: "object",
      properties: {
        category: { type: "string" },
        does: { type: "string" },
        stage: { type: "string" },
      },
      required: ["category", "does"],
    },
    async call(args) {
      const note = mapRisks({
        category: String(args.category ?? ""),
        does: String(args.does ?? ""),
        stage: args.stage ? String(args.stage) : undefined,
      });
      return {
        ...note,
        report: reportText(note),
        vulnerabilityReport: vulnerabilityReport(note),
      };
    },
  };
}

export function quoteGuideTool(): Tool {
  return {
    name: "quote_guide",
    description:
      "Explain what information Corgi needs to generate a quote. Walk the user through the application form fields step by step.",
    schema: {
      type: "object",
      properties: {
        stage: { type: "string", description: "pre-seed, seed, series-a, growth" },
        category: { type: "string", description: "SaaS, AI, fintech, etc." },
      },
    },
    async call(args) {
      const stage = String(args.stage ?? "seed").toLowerCase();
      const category = String(args.category ?? "tech").toLowerCase();
      return {
        title: "What Corgi needs for a quote",
        note: "Corgi can generate a quote in minutes. Here is what they will ask:",
        steps: [
          {
            step: 1,
            section: "Company basics",
            fields: [
              { field: "Company legal name", why: "Matches your incorporation docs" },
              { field: "DBA / trade name", why: "If different from legal name" },
              { field: "State of incorporation", why: "Determines regulatory requirements" },
              { field: "Business address", why: "Rating territory and COI" },
              { field: "Website URL", why: "Underwriters review your public product" },
            ],
          },
          {
            step: 2,
            section: "Business details",
            fields: [
              { field: "Industry / category", why: "Determines risk class", hint: category },
              { field: "What does the company do (one line)", why: "Product risk assessment" },
              { field: "Date founded", why: "Track record and tail risk" },
              { field: "Annual revenue (or projected)", why: "Scales E&O and CGL premiums" },
              { field: "Total funding raised", why: "D&O limits and premium tier" },
              { field: "Number of employees (W-2 + 1099)", why: "EPLI eligibility and rating" },
            ],
          },
          {
            step: 3,
            section: "Coverage selection",
            fields: [
              { field: "Which lines do you need?", why: "CGL, D&O, Tech E&O, Cyber are the core four for startups", hint: "Corgi recommends all four for " + stage },
              { field: "Desired limits", why: "Most startups start at $1M per occurrence / $2M aggregate" },
              { field: "Effective date", why: "When coverage should start — can be same day for some lines" },
            ],
          },
          {
            step: 4,
            section: "Risk questions",
            fields: [
              { field: "Any prior claims or lawsuits?", why: "Affects eligibility and pricing" },
              { field: "Do you handle PII, PHI, or financial data?", why: "Cyber premium adjustment" },
              { field: "Any existing insurance policies?", why: "Avoids coverage gaps or overlaps" },
              { field: "SOC 2 or similar compliance?", why: "May qualify for cyber premium discount" },
            ],
          },
          {
            step: 5,
            section: "Contact & next steps",
            fields: [
              { field: "Contact name and email", why: "Where Corgi sends the quote" },
              { field: "Timeline", why: "Need a COI this week? Or just exploring?" },
            ],
          },
        ],
        cta: {
          fast: "Get a quote at https://www.corgi.insure — most startups finish in under 10 minutes",
          guided: "Book a demo at https://www.corgi.insure/book-a-demo for a walkthrough",
        },
      };
    },
  };
}
