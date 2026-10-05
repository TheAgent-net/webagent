/**
 * CSV: export conversations or turns for a date range.
 * A cell that starts with `=`, `+`, `-`, `@`, tab, or CR gets a leading quote mark. Spreadsheets then show it as text.
 */
import type { Conversation, Store } from "../store/store.ts";

/** Most conversations in one export. */
const EXPORT_CAP = 20_000;

export function csvCell(value: unknown): string {
  let text = value === undefined || value === null ? "" : String(value);
  if (/^[=+\-@\t\r]/.test(text)) text = "'" + text;
  return /[",\n\r]/.test(text) ? '"' + text.replace(/"/g, '""') + '"' : text;
}

function line(cells: unknown[]): string {
  return cells.map(csvCell).join(",") + "\r\n";
}

/** Every conversation updated since `since`, newest first, up to the cap. */
export function listAll(store: Store, tenant: string, since: number): Conversation[] {
  const out: Conversation[] = [];
  for (let offset = 0; out.length < EXPORT_CAP; offset += 500) {
    const page = store.listConversations(tenant, { since, limit: 500, offset });
    out.push(...page);
    if (page.length < 500) break;
  }
  return out.slice(0, EXPORT_CAP);
}

export function conversationsCsv(store: Store, tenant: string, since: number): string {
  let out = line(["id", "started", "updated", "channel", "kind", "family", "verified", "label", "score", "handoff", "turns", "page"]);
  for (const c of listAll(store, tenant, since)) {
    out += line([
      c.id,
      new Date(c.started).toISOString(),
      new Date(c.updated).toISOString(),
      c.channel,
      c.kind,
      c.family,
      c.verified,
      c.label,
      c.score,
      !!c.handoff,
      c.turns,
      c.page,
    ]);
  }
  return out;
}

export function turnsCsv(store: Store, tenant: string, since: number): string {
  let out = line(["conversation", "at", "from", "said", "reply", "visual", "ms"]);
  for (const c of listAll(store, tenant, since)) {
    for (const t of store.listTurns(c.id)) {
      out += line([t.conversation, new Date(t.at).toISOString(), t.from, t.said, t.reply, t.visual, t.ms]);
    }
  }
  return out;
}
