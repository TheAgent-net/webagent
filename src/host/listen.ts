import type { Harness } from "../harness.ts";
import type { Run } from "../run.ts";
import type { AgentPackConfig } from "../pack/types.ts";
import type { AgentCardMeta } from "./card.ts";
import type { Store } from "../store/store.ts";
import { host, restoreFrom } from "./host.ts";
import { tapFetch, type Hop } from "./hop.ts";
import { Room, type Finish } from "./room.ts";
import { Sessions } from "./sessions.ts";

export type { Hop } from "./hop.ts";
export type { AgentCardMeta } from "./card.ts";

export interface ListenOpts {
  port?: number;
  hostname?: string;
  model?: string;
  publicUrl?: string;
  run?: Run;
  onHop?: (hop: Hop) => void;
  card?: AgentCardMeta;
  pack?: AgentPackConfig;
  /** Last step on every reply. */
  finish?: Finish;
  /** Durable record of chats and traffic. */
  store?: Store;
  /** Tenant id for stored rows. */
  tenant?: string;
  /** Public base URL for one request. Overrides `publicUrl` (multi-tenant routing). */
  base?: (req: Request) => string;
}

/** One agent mounted as a fetch handler, without a server. */
export interface Mounted {
  room: Room;
  sessions: Sessions;
  fetch: (req: Request) => Promise<Response>;
}

/** Build the room, sessions, and fetch handler. `listen` and the multi-tenant cloud both use this. */
export function mount(harness: Harness, opts: ListenOpts = {}, fallbackUrl = "http://127.0.0.1:8787"): Mounted {
  const room = new Room(harness, { model: opts.model ?? "echo", run: opts.run, finish: opts.finish });
  const tenant = opts.tenant || "default";
  const sessions = new Sessions(harness, room, opts.store ? restoreFrom(opts.store, tenant) : undefined);
  const fetch = host(harness, room, fallbackUrl, opts.card, sessions, opts.pack, {
    store: opts.store,
    tenant,
    base: opts.base,
  });
  return { room, sessions, fetch };
}

export interface Hosted {
  url: string;
  room: Room;
  sessions: Sessions;
  stop: () => void;
}

/** Bind the public agent. HTTPS when WEBAGENT_TLS_CERT + WEBAGENT_TLS_KEY (or a proxy sets WEBAGENT_PUBLIC_URL). */
export function listen(harness: Harness, opts: ListenOpts = {}): Hosted {
  const port = opts.port ?? 8787;
  const hostname = opts.hostname ?? "0.0.0.0";
  const tls = tlsEnv();
  const localProto = tls ? "https" : "http";
  const printed =
    opts.publicUrl?.replace(/\/+$/, "") ||
    process.env.WEBAGENT_PUBLIC_URL?.replace(/\/+$/, "") ||
    `${localProto}://127.0.0.1:${port}`;

  const { room, sessions, fetch } = mount(harness, opts, printed);
  const server = Bun.serve({
    port,
    hostname,
    tls,
    fetch: opts.onHop ? tapFetch(fetch, opts.onHop) : fetch,
  });
  const bound = opts.publicUrl?.replace(/\/+$/, "") ||
    process.env.WEBAGENT_PUBLIC_URL?.replace(/\/+$/, "") ||
    `${localProto}://127.0.0.1:${server.port}`;

  return {
    url: bound,
    room,
    sessions,
    stop: () => server.stop(true),
  };
}

function tlsEnv(): { cert: ReturnType<typeof Bun.file>; key: ReturnType<typeof Bun.file> } | undefined {
  const certPath = process.env.WEBAGENT_TLS_CERT;
  const keyPath = process.env.WEBAGENT_TLS_KEY;
  if (!certPath || !keyPath) return undefined;
  return { cert: Bun.file(certPath), key: Bun.file(keyPath) };
}
