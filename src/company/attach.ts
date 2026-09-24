import type { Harness } from "../harness.ts";
import type { Run } from "../run.ts";
import { attachPack } from "../site/attach.ts";
import type { Tool } from "../tools.ts";
import { companyInstruction } from "./prompt.ts";
import type { CompanyPack, FormWalk } from "./types.ts";

/** Bind a crawled company pack: site lookup, site flows, and form walks. */
export function attachCompany(h: Harness, pack: CompanyPack, opts?: { model?: string }): Run {
  const run = attachPack(h, pack.site, { model: opts?.model, instruction: companyInstruction(pack) });
  const walk = walkFormTool(pack.forms);
  const brief = companyBriefTool(pack);
  h.addTool(walk);
  h.addTool(brief);
  run.useTool(walk);
  run.useTool(brief);
  if (pack.profile.github || pack.github) {
    run.inject({
      vars: [
        pack.github
          ? `GitHub ${pack.github.owner}/${pack.github.name}: ${pack.github.description}. Stars ${pack.github.stars}. ${pack.github.language || ""}`
          : "",
        pack.github?.readme ? pack.github.readme.slice(0, 1500) : "",
      ]
        .filter(Boolean)
        .join("\n"),
    });
  }
  return run;
}

export function walkFormTool(forms: FormWalk[]): Tool {
  return {
    name: "walk_form",
    description:
      "Walk a crawled form field by field. Pass the form id from the pack (signup, contact, demo, quote, …).",
    schema: {
      type: "object",
      properties: { form_id: { type: "string" } },
      required: ["form_id"],
    },
    async call(args) {
      const id = String(args.form_id ?? "");
      const form = forms.find((f) => f.id === id || f.id.startsWith(id) || f.name.toLowerCase() === id.toLowerCase());
      if (!form) {
        return {
          error: "unknown_form",
          available: forms.map((f) => ({ id: f.id, name: f.name, url: f.url })),
        };
      }
      return {
        id: form.id,
        name: form.name,
        purpose: form.purpose,
        url: form.url,
        method: form.method,
        action: form.action,
        steps: form.fields.map((f, i) => ({
          step: i + 1,
          field: f.name,
          type: f.type,
          why: f.why,
        })),
        hint: "Ask for one field at a time. Skip anything they already gave.",
      };
    },
  };
}

export function companyBriefTool(pack: CompanyPack): Tool {
  return {
    name: "company_brief",
    description: "Grounded one-pager: who the company is, how it matches this visitor, and the next form or page.",
    schema: {
      type: "object",
      properties: { need: { type: "string" } },
    },
    async call(args) {
      const need = String(args.need ?? "").toLowerCase();
      const form =
        pack.forms.find((f) => need && (f.id.includes(need) || f.name.toLowerCase().includes(need) || f.purpose.toLowerCase().includes(need))) ||
        pack.forms[0];
      const flow =
        pack.flows.find((f) => need && (f.id.includes(need) || f.name.toLowerCase().includes(need))) || pack.flows[0];
      return {
        name: pack.profile.name,
        tagline: pack.profile.tagline,
        website: pack.profile.website,
        github: pack.profile.github,
        need: args.need || "",
        offers: pack.profile.offers.slice(0, 5),
        next: form
          ? { kind: "form", id: form.id, name: form.name, url: form.url }
          : flow
            ? { kind: "flow", id: flow.id, name: flow.name, url: flow.steps[0]?.url }
            : { kind: "site", url: pack.profile.website || pack.profile.origin },
      };
    },
  };
}
