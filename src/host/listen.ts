import type { Harness } from "../harness.ts";
import type { Run } from "../run.ts";
import { host } from "./host.ts";
import { tapFetch, type Hop } from "./hop.ts";
import { Room } from "./room.ts";

export type { Hop } from "./hop.ts";

export interface ListenOpts {
  port?: number;
  hostname?: string;
  model?: string;
  publicUrl?: string;
  run?: Run;
  onHop?: (hop: Hop) => void;
}

export interface Hosted {
  url: string;
  room: Room;
  stop: () => void;
}

/** Bind the public agent. HTTPS when WEBAGENT_TLS_CERT + WEBAGENT_TLS_KEY (or a proxy sets WEBAGENT_PUBLIC_URL). */
export function listen(harness: Harness, opts: ListenOpts = {}): Hosted {
  const port = opts.port ?? 8787;
  const hostname = opts.hostname ?? "0.0.0.0";
  const room = new Room(harness, { model: opts.model ?? "echo", run: opts.run });
  const tls = tlsEnv();
  const localProto = tls ? "https" : "http";
  const printed =
    opts.publicUrl?.replace(/\/+$/, "") ||
    process.env.WEBAGENT_PUBLIC_URL?.replace(/\/+$/, "") ||
    `${localProto}://127.0.0.1:${port}`;

  const server = Bun.serve({
    port,
    hostname,
    tls,
    fetch: opts.onHop ? tapFetch(host(harness, room, printed), opts.onHop) : host(harness, room, printed),
  });
  const bound = opts.publicUrl?.replace(/\/+$/, "") ||
    process.env.WEBAGENT_PUBLIC_URL?.replace(/\/+$/, "") ||
    `${localProto}://127.0.0.1:${server.port}`;

  return {
    url: bound,
    room,
    stop: () => server.stop(true),
  };
}

function tlsEnv(): { cert: ReturnType<typeof Bun.file>; key: ReturnType<typeof Bun.file> } | undefined {
  const certPath = process.env.WEBAGENT_TLS_CERT;
  const keyPath = process.env.WEBAGENT_TLS_KEY;
  if (!certPath || !keyPath) return undefined;
  return { cert: Bun.file(certPath), key: Bun.file(keyPath) };
}
