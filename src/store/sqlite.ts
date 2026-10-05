/** SQLite store. Bun has the driver built in. Use `:memory:` for tests. */
import { Database } from "bun:sqlite";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import type {
  Conversation,
  ConversationFilter,
  ConversationGroup,
  Count,
  EventFilter,
  ConversationSum,
  DayCount,
  EventGroup,
  EventSum,
  Feedback,
  Handoff,
  Question,
  Store,
  Tenant,
  TrafficEvent,
  Turn,
  VisitorKind,
} from "./store.ts";

const SCHEMA = `
create table if not exists tenants (
  id text primary key, name text not null, pack text not null,
  domains text not null default '[]', origins text not null default '[]',
  settings text not null default '{}', created integer not null
);
create table if not exists conversations (
  id text primary key, tenant text not null, session text not null, channel text not null,
  kind text not null, family text, verified integer not null default 0, score real, label text,
  page text, handoff integer not null default 0,
  started integer not null, updated integer not null, turns integer not null default 0
);
create index if not exists conversations_tenant on conversations (tenant, updated desc);
create table if not exists turns (
  id integer primary key autoincrement, conversation text not null, at integer not null,
  side text not null, said text not null, reply text not null, visual text, ms integer not null, tokens integer
);
create index if not exists turns_conversation on turns (conversation, id);
create table if not exists events (
  id integer primary key autoincrement, tenant text not null, at integer not null, type text not null,
  kind text not null, family text, verified integer not null default 0, path text, session text,
  ip_hash text, ua text, data text
);
create index if not exists events_tenant on events (tenant, at);
create table if not exists feedback (
  id integer primary key autoincrement, tenant text not null, conversation text not null,
  turn integer, vote integer not null, note text, at integer not null
);
create index if not exists feedback_tenant on feedback (tenant, at);
create table if not exists handoffs (
  id integer primary key autoincrement, tenant text not null, conversation text not null,
  email text not null, note text, at integer not null
);
create index if not exists handoffs_tenant on handoffs (tenant, at);
create index if not exists turns_at on turns (at);
`;

const DAY = "strftime('%Y-%m-%d', at / 1000, 'unixepoch')";
const DAY_UPDATED = "strftime('%Y-%m-%d', started / 1000, 'unixepoch')";

type Row = Record<string, unknown>;

const CONVERSATION_FIELDS = new Set([
  "channel", "kind", "family", "verified", "score", "label", "page", "handoff", "started", "updated", "turns",
]);

export function openStore(path = process.env.WEBAGENT_DB || "data/webagent.db"): Store {
  if (path !== ":memory:") mkdirSync(dirname(path), { recursive: true });
  return new SqliteStore(new Database(path, { create: true }));
}

export class SqliteStore implements Store {
  constructor(private readonly db: Database) {
    db.exec("pragma journal_mode = wal;");
    db.exec(SCHEMA);
    addColumn(db, "tenants", "org", "text");
  }

  putTenant(t: Tenant): void {
    this.db
      .query(
        `insert into tenants (id, name, pack, domains, origins, settings, created, org) values (?, ?, ?, ?, ?, ?, ?, ?)
         on conflict (id) do update set name = excluded.name, pack = excluded.pack, domains = excluded.domains,
         origins = excluded.origins, settings = excluded.settings, org = excluded.org`,
      )
      .run(
        t.id,
        t.name,
        t.pack,
        JSON.stringify(t.domains),
        JSON.stringify(t.origins),
        JSON.stringify(t.settings),
        t.created,
        t.org ?? null,
      );
  }

  getTenant(id: string): Tenant | undefined {
    const row = this.db.query("select * from tenants where id = ?").get(id) as Row | null;
    return row ? tenantFrom(row) : undefined;
  }

  listTenants(): Tenant[] {
    return (this.db.query("select * from tenants order by id").all() as Row[]).map(tenantFrom);
  }

  findTenant(domain: string): Tenant | undefined {
    const host = domain.toLowerCase().replace(/:\d+$/, "");
    return this.listTenants().find((t) => t.domains.some((d) => d.toLowerCase() === host));
  }

  openConversation(c: Omit<Conversation, "started" | "updated" | "turns"> & { at?: number }): Conversation {
    const old = this.getConversation(c.id);
    if (old) return old;
    const at = c.at ?? Date.now();
    this.db
      .query(
        `insert into conversations (id, tenant, session, channel, kind, family, verified, score, label, page, handoff, started, updated, turns)
         values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
      )
      .run(
        c.id,
        c.tenant,
        c.session,
        c.channel,
        c.kind,
        c.family ?? null,
        c.verified ? 1 : 0,
        c.score ?? null,
        c.label ?? null,
        c.page ?? null,
        c.handoff ? 1 : 0,
        at,
        at,
      );
    return this.getConversation(c.id)!;
  }

  getConversation(id: string): Conversation | undefined {
    const row = this.db.query("select * from conversations where id = ?").get(id) as Row | null;
    return row ? conversationFrom(row) : undefined;
  }

  updateConversation(id: string, patch: Partial<Omit<Conversation, "id" | "tenant" | "session">>): void {
    const sets: string[] = [];
    const vals: (string | number | null)[] = [];
    for (const [key, value] of Object.entries(patch)) {
      if (value === undefined || !CONVERSATION_FIELDS.has(key)) continue;
      sets.push(key + " = ?");
      vals.push(typeof value === "boolean" ? (value ? 1 : 0) : (value as string | number | null));
    }
    if (!sets.length) return;
    this.db.query(`update conversations set ${sets.join(", ")} where id = ?`).run(...vals, id);
  }

  listConversations(tenant: string, f: ConversationFilter = {}): Conversation[] {
    const [where, vals] = conversationWhere(tenant, f);
    vals.push(Math.min(f.limit ?? 50, 500), f.offset ?? 0);
    const rows = this.db
      .query(`select * from conversations where ${where} order by updated desc limit ? offset ?`)
      .all(...vals) as Row[];
    return rows.map(conversationFrom);
  }

  countMatches(tenant: string, f: ConversationFilter = {}): number {
    const [where, vals] = conversationWhere(tenant, f);
    const row = this.db.query(`select count(*) as n from conversations where ${where}`).get(...vals) as Row | null;
    return Number(row?.n ?? 0);
  }

  countConversations(tenant: string, by: ConversationGroup, since = 0): Count[] {
    const key = by === "day" ? DAY_UPDATED : `coalesce(${by}, '')`;
    return this.db
      .query(
        `select ${key} as key, count(*) as n, sum(verified) as verified from conversations
         where tenant = ? and started >= ? group by key order by n desc`,
      )
      .all(tenant, since)
      .map(countFrom);
  }

  addTurn(t: Turn): number {
    const res = this.db
      .query("insert into turns (conversation, at, side, said, reply, visual, ms, tokens) values (?, ?, ?, ?, ?, ?, ?, ?)")
      .run(t.conversation, t.at, t.from, t.said, t.reply, t.visual ?? null, t.ms, t.tokens ?? null);
    this.db.query("update conversations set turns = turns + 1, updated = ? where id = ?").run(t.at, t.conversation);
    return Number(res.lastInsertRowid);
  }

  listTurns(conversation: string): Turn[] {
    return (this.db.query("select * from turns where conversation = ? order by id").all(conversation) as Row[]).map(
      (r) => ({
        id: Number(r.id),
        conversation: String(r.conversation),
        at: Number(r.at),
        from: r.side === "machine" ? "machine" : "human",
        said: String(r.said),
        reply: String(r.reply),
        visual: (r.visual as string | null) ?? undefined,
        ms: Number(r.ms),
        tokens: r.tokens == null ? undefined : Number(r.tokens),
      }),
    );
  }

  addEvent(e: TrafficEvent): void {
    this.db
      .query(
        `insert into events (tenant, at, type, kind, family, verified, path, session, ip_hash, ua, data)
         values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(
        e.tenant,
        e.at,
        e.type,
        e.kind,
        e.family ?? null,
        e.verified ? 1 : 0,
        e.path ?? null,
        e.session ?? null,
        e.ipHash ?? null,
        e.ua ? e.ua.slice(0, 400) : null,
        e.data ? JSON.stringify(e.data) : null,
      );
  }

  listEvents(tenant: string, f: EventFilter = {}): TrafficEvent[] {
    const where = ["tenant = ?"];
    const vals: (string | number)[] = [tenant];
    if (f.type) (where.push("type = ?"), vals.push(f.type));
    if (f.kind) (where.push("kind = ?"), vals.push(f.kind));
    if (f.since) (where.push("at >= ?"), vals.push(f.since));
    vals.push(Math.min(f.limit ?? 100, 1000));
    const rows = this.db
      .query(`select * from events where ${where.join(" and ")} order by at desc limit ?`)
      .all(...vals) as Row[];
    return rows.map((r) => ({
      id: Number(r.id),
      tenant: String(r.tenant),
      at: Number(r.at),
      type: String(r.type),
      kind: r.kind as VisitorKind,
      family: (r.family as string | null) ?? undefined,
      verified: !!r.verified,
      path: (r.path as string | null) ?? undefined,
      session: (r.session as string | null) ?? undefined,
      ipHash: (r.ip_hash as string | null) ?? undefined,
      ua: (r.ua as string | null) ?? undefined,
      data: r.data ? (JSON.parse(String(r.data)) as Record<string, unknown>) : undefined,
    }));
  }

  countEvents(tenant: string, by: EventGroup, since = 0, f: { type?: string; kind?: VisitorKind } = {}): Count[] {
    const key = by === "day" ? DAY : `coalesce(${by}, '')`;
    const where = ["tenant = ?", "at >= ?"];
    const vals: (string | number)[] = [tenant, since];
    if (f.type) (where.push("type = ?"), vals.push(f.type));
    if (f.kind) (where.push("kind = ?"), vals.push(f.kind));
    return this.db
      .query(
        `select ${key} as key, count(*) as n, sum(verified) as verified from events
         where ${where.join(" and ")} group by key order by n desc`,
      )
      .all(...vals)
      .map(countFrom);
  }

  addFeedback(f: Feedback): void {
    this.db
      .query("insert into feedback (tenant, conversation, turn, vote, note, at) values (?, ?, ?, ?, ?, ?)")
      .run(f.tenant, f.conversation, f.turn ?? null, f.vote, f.note ?? null, f.at);
  }

  listFeedback(tenant: string, since = 0): Feedback[] {
    return (
      this.db.query("select * from feedback where tenant = ? and at >= ? order by at desc").all(tenant, since) as Row[]
    ).map((r) => ({
      id: Number(r.id),
      tenant: String(r.tenant),
      conversation: String(r.conversation),
      turn: r.turn == null ? undefined : Number(r.turn),
      vote: Number(r.vote) > 0 ? 1 : -1,
      note: (r.note as string | null) ?? undefined,
      at: Number(r.at),
    }));
  }

  close(): void {
    this.db.close();
  }

  /* Guard and handoff methods. */
  countTurns(tenant: string, since: number): number {
    const row = this.db
      .query(
        `select count(*) as n from turns where at >= ? and conversation in
         (select id from conversations where tenant = ? and updated >= ?)`,
      )
      .get(since, tenant, since) as Row | null;
    return Number(row?.n ?? 0);
  }

  addHandoff(h: Handoff): number {
    const res = this.db
      .query("insert into handoffs (tenant, conversation, email, note, at) values (?, ?, ?, ?, ?)")
      .run(h.tenant, h.conversation, h.email, h.note ?? null, h.at);
    this.db.query("update conversations set handoff = 1 where id = ?").run(h.conversation);
    return Number(res.lastInsertRowid);
  }

  listHandoffs(tenant: string, since = 0): Handoff[] {
    return (
      this.db.query("select * from handoffs where tenant = ? and at >= ? order by at desc").all(tenant, since) as Row[]
    ).map((r) => ({
      id: Number(r.id),
      tenant: String(r.tenant),
      conversation: String(r.conversation),
      email: String(r.email),
      note: (r.note as string | null) ?? undefined,
      at: Number(r.at),
    }));
  }
  sumEvents(tenant: string, f: EventSum = {}): number {
    const [where, vals] = eventWhere(tenant, f);
    const value = f.distinct ? VISITOR_COUNT : "coalesce(sum(" + EVENT_N + "), 0)";
    const row = this.db.query(`select ${value} as n from events where ${where}`).get(...vals) as Row | null;
    return Number(row?.n ?? 0);
  }

  groupEvents(tenant: string, by: EventGroup | "page", f: EventSum = {}): Count[] {
    const key = by === "day" ? DAY : by === "page" ? "coalesce(json_extract(data, '$.page'), '')" : `coalesce(${eventColumn(by)}, '')`;
    const [where, vals] = eventWhere(tenant, f);
    const value = f.distinct ? VISITOR_COUNT : "sum(" + EVENT_N + ")";
    return this.db
      .query(
        `select ${key} as key, ${value} as n, sum(case when verified = 1 then ${EVENT_N} else 0 end) as verified
         from events where ${where} group by key order by n desc`,
      )
      .all(...vals)
      .map(countFrom);
  }

  listEventDays(tenant: string, by: "kind" | "family", f: EventSum = {}): DayCount[] {
    const [where, vals] = eventWhere(tenant, f);
    const value = f.distinct ? VISITOR_COUNT : "sum(" + EVENT_N + ")";
    const column = by === "kind" ? "kind" : "family";
    return (
      this.db
        .query(
          `select ${DAY} as day, coalesce(${column}, '') as key, ${value} as n from events
           where ${where} group by day, key order by day, key`,
        )
        .all(...vals) as Row[]
    ).map((r) => ({ day: String(r.day), key: String(r.key), n: Number(r.n) }));
  }

  sumConversations(tenant: string, since = 0): ConversationSum {
    const row = this.db
      .query(
        `select count(*) as total,
           coalesce(sum(kind = 'human'), 0) as human,
           coalesce(sum(kind != 'human'), 0) as agent,
           coalesce(sum(label = 'intelligent'), 0) as intelligent,
           coalesce(sum(label = 'intelligent' and turns >= 2), 0) as deep,
           coalesce(sum(handoff), 0) as handoff,
           coalesce(sum(verified), 0) as verified
         from conversations where tenant = ? and started >= ?`,
      )
      .get(tenant, since) as Row;
    return {
      total: Number(row.total),
      human: Number(row.human),
      agent: Number(row.agent),
      intelligent: Number(row.intelligent),
      deep: Number(row.deep),
      handoff: Number(row.handoff),
      verified: Number(row.verified),
    };
  }

  listConversationDays(tenant: string, since = 0): DayCount[] {
    return (
      this.db
        .query(
          `select ${DAY_UPDATED} as day, case when kind = 'human' then 'human' else 'agent' end as key, count(*) as n
           from conversations where tenant = ? and started >= ? group by day, key order by day, key`,
        )
        .all(tenant, since) as Row[]
    ).map((r) => ({ day: String(r.day), key: String(r.key), n: Number(r.n) }));
  }

  listQuestions(tenant: string, since = 0, limit = 2000): Question[] {
    return (
      this.db
        .query(
          `select t.conversation as conversation, t.said as said, t.at as at from turns t
           join conversations c on c.id = t.conversation
           where c.tenant = ? and t.at >= ? and t.said != '' order by t.at desc limit ?`,
        )
        .all(tenant, since, Math.min(limit, 10000)) as Row[]
    ).map((r) => ({ conversation: String(r.conversation), said: String(r.said), at: Number(r.at) }));
  }
}

/** Count that a CDN row adds. Other rows add 1. */
const EVENT_N = "coalesce(cast(json_extract(data, '$.n') as integer), 1)";
/** Distinct visitors. A row with no visitor mark counts once. */
const VISITOR_COUNT = "count(distinct coalesce(ip_hash, session, ua, 'row' || id))";

function eventColumn(by: EventGroup): string {
  return by === "kind" ? "kind" : by === "family" ? "family" : by === "path" ? "path" : "type";
}

function conversationWhere(tenant: string, f: ConversationFilter): [string, (string | number)[]] {
  const where = ["tenant = ?"];
  const vals: (string | number)[] = [tenant];
  if (f.kind) (where.push("kind = ?"), vals.push(f.kind));
  if (f.label) (where.push("label = ?"), vals.push(f.label));
  if (f.channel) (where.push("channel = ?"), vals.push(f.channel));
  if (f.handoff !== undefined) (where.push("handoff = ?"), vals.push(f.handoff ? 1 : 0));
  if (f.since) (where.push("updated >= ?"), vals.push(f.since));
  if (f.text) {
    where.push("id in (select conversation from turns where said like ? or reply like ?)");
    const like = "%" + f.text.replace(/[%_]/g, "") + "%";
    vals.push(like, like);
  }
  return [where.join(" and "), vals];
}

/** Add a column to an old table when the column is missing. */
function addColumn(db: Database, table: string, column: string, type: string): void {
  const columns = db.query(`pragma table_info(${table})`).all() as Row[];
  if (!columns.some((c) => c.name === column)) db.exec(`alter table ${table} add column ${column} ${type}`);
}

function eventWhere(tenant: string, f: EventSum): [string, (string | number)[]] {
  const where = ["tenant = ?", "at >= ?"];
  const vals: (string | number)[] = [tenant, f.since ?? 0];
  if (f.type) (where.push("type = ?"), vals.push(f.type));
  if (f.kinds?.length) (where.push(`kind in (${f.kinds.map(() => "?").join(", ")})`), vals.push(...f.kinds));
  if (f.paths?.length) (where.push(`path in (${f.paths.map(() => "?").join(", ")})`), vals.push(...f.paths));
  return [where.join(" and "), vals];
}

function tenantFrom(r: Row): Tenant {
  return {
    id: String(r.id),
    name: String(r.name),
    pack: String(r.pack),
    domains: JSON.parse(String(r.domains)) as string[],
    origins: JSON.parse(String(r.origins)) as string[],
    settings: JSON.parse(String(r.settings)) as Record<string, unknown>,
    created: Number(r.created),
    ...(r.org == null ? {} : { org: String(r.org) }),
  };
}

function conversationFrom(r: Row): Conversation {
  return {
    id: String(r.id),
    tenant: String(r.tenant),
    session: String(r.session),
    channel: r.channel as Conversation["channel"],
    kind: r.kind as VisitorKind,
    family: (r.family as string | null) ?? undefined,
    verified: !!r.verified,
    score: r.score == null ? undefined : Number(r.score),
    label: (r.label as string | null) ?? undefined,
    page: (r.page as string | null) ?? undefined,
    handoff: !!r.handoff,
    started: Number(r.started),
    updated: Number(r.updated),
    turns: Number(r.turns),
  };
}

function countFrom(r: unknown): Count {
  const row = r as Row;
  return { key: String(row.key ?? ""), n: Number(row.n), verified: Number(row.verified ?? 0) };
}
