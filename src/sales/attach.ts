import type { Harness } from "../harness.ts";
import type { Run } from "../run.ts";
import { attachPack } from "../site/attach.ts";
import type { SitePack } from "../site/types.ts";
import type { Tool } from "../tools.ts";
import { salesInstruction } from "./prompt.ts";
import { mapRisks, reportText } from "./risks.ts";

/** Bind the Corgi (or any) pack as a sales person. Public controls only. */
export function attachSales(h: Harness, pack: SitePack, opts?: { model?: string }): Run {
  const run = attachPack(h, pack, { model: opts?.model, instruction: salesInstruction(pack) });
  const risk = riskTool();
  const visitor = visitorTool(run);
  h.addTool(risk);
  h.addTool(visitor);
  run.useTool(risk);
  run.useTool(visitor);
  return run;
}

export function riskTool(): Tool {
  return {
    name: "map_risks",
    description: "Given field, what they do, company, and founder, return grounded risks, penalties, proof, and a package.",
    schema: {
      type: "object",
      properties: {
        category: { type: "string" },
        does: { type: "string" },
        company: { type: "string" },
        founder: { type: "string" },
        stage: { type: "string" },
      },
      required: ["category", "does"],
    },
    async call(args) {
      const note = mapRisks({
        category: String(args.category ?? ""),
        does: String(args.does ?? ""),
        company: String(args.company ?? ""),
        founder: String(args.founder ?? ""),
        stage: String(args.stage ?? ""),
      });
      return { ...note, report: reportText(note) };
    },
  };
}

export function visitorTool(run: Run): Tool {
  return {
    name: "note_visitor",
    description: "Save company name, founder name, field, what they do, and stage before you recommend.",
    schema: {
      type: "object",
      properties: {
        company: { type: "string" },
        founder: { type: "string" },
        field: { type: "string" },
        does: { type: "string" },
        stage: { type: "string" },
      },
      required: ["company", "founder", "field"],
    },
    async call(args) {
      const note = {
        company: String(args.company ?? "").trim(),
        founder: String(args.founder ?? "").trim(),
        field: String(args.field ?? "").trim(),
        does: String(args.does ?? "").trim(),
        stage: String(args.stage ?? "").trim(),
      };
      // Do not inject a pin here. A pin between tool_calls and tool results breaks OpenAI.
      void run;
      return {
        saved: true,
        ...note,
        recap:
          (note.founder || "Founder") +
          " at " +
          (note.company || "(company)") +
          " · " +
          (note.field || "(field)") +
          (note.stage ? " · " + note.stage : "") +
          (note.does ? " — " + note.does : ""),
      };
    },
  };
}
