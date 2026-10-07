import type { Message } from "../src/context.ts";
import type { Model } from "../src/models.ts";

/** Deterministic model for the pair test when Cursor is not ready. Calls one tool, then answers. */
export function scriptModel(opts: { id: string; role: "seller" | "buyer" }): Model {
  return {
    id: opts.id,
    ready: true,
    supportsTools: true,
    supportsStream: false,
    async reason(req, out) {
      const last = req.messages[req.messages.length - 1];
      if (last?.role === "tool") {
        out.pushText(replyAfterTool(opts.role, last.content));
        return;
      }
      const user = lastUser(req.messages);
      if (opts.role === "seller" && req.tools.some((t) => t.name === "map_risks")) {
        out.pushText("Mapping risks for this startup.");
        out.pushToolDelta(0, "c1", "map_risks", JSON.stringify(askOf(user)));
        return;
      }
      const tool = opts.role === "seller" ? "site_lookup" : "ask_peer";
      if (!req.tools.some((t) => t.name === tool)) {
        out.pushText("No peer tool is bound.");
        return;
      }
      out.pushText(opts.role === "seller" ? "Looking up the crawled site." : "Asking the Corgi agent.");
      out.pushToolDelta(
        0,
        "c1",
        tool,
        JSON.stringify(opts.role === "seller" ? { query: queryOf(user) } : { text: user }),
      );
    },
  };
}

function replyAfterTool(role: "seller" | "buyer", raw: string): string {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return raw.slice(0, 800);
  }
  if (role === "buyer") return buyerReply(data);
  return sellerReply(data);
}

function askOf(text: string): { category: string; does: string } {
  const t = text.toLowerCase();
  let category = "other";
  if (/ai|llm|agent/.test(t)) category = "AI";
  else if (/saas|software/.test(t)) category = "SaaS";
  else if (/fintech|payment/.test(t)) category = "fintech";
  else if (/crypto|web3/.test(t)) category = "crypto";
  else if (/health|med/.test(t)) category = "health-tech";
  return { category, does: text.slice(0, 160) };
}

function sellerReply(data: unknown): string {
  const rec = asRec(data);
  if (typeof rec.report === "string" && rec.report) return rec.report;
  const hits = Array.isArray(rec.hits) ? rec.hits : [];
  const lines: string[] = [];
  for (let i = 0; i < hits.length && i < 4; i++) {
    const hit = asRec(hits[i]);
    const title = String(hit.title ?? "");
    const snippet = String(hit.snippet ?? hit.text ?? "").slice(0, 280);
    if (title || snippet) lines.push((title ? title + ": " : "") + snippet);
  }
  if (!lines.length) return "I do not have that on the crawled pages. Ask about coverage, cost, or a quote.";
  return lines.join("\n");
}

function buyerReply(data: unknown): string {
  const rec = asRec(data);
  const text = String(rec.lastText ?? rec.text ?? rec.reply ?? "").trim();
  if (text) return "Corgi agent said:\n" + text;
  return "Corgi agent reply:\n" + JSON.stringify(data).slice(0, 800);
}

function lastUser(msgs: readonly Message[]): string {
  for (let i = msgs.length - 1; i >= 0; i--) {
    if (msgs[i]!.role === "user") return msgs[i]!.content.replace(/^\[(human|machine)\]\s*/, "");
  }
  return "";
}

function queryOf(text: string): string {
  return text.slice(0, 160);
}

function asRec(v: unknown): Record<string, unknown> {
  return v !== null && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
}
