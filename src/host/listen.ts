import { networkInterfaces } from "node:os";
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
  /** Print a LAN (or WEBAGENT_PUBLIC_URL) address another laptop can hit. */
  reach?: boolean;
  run?: Run;
  onHop?: (hop: Hop) => void;
}

export interface Hosted {
  url: string;
  /** Bound listen port. Use this for a same-machine URL, not a tunnel URL. */
  port: number;
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
  const printed = showUrl(opts, localProto, port);

  const server = Bun.serve({
    port,
    hostname,
    tls,
    idleTimeout: 120,
    fetch: opts.onHop ? tapFetch(host(harness, room, printed), opts.onHop) : host(harness, room, printed),
  });
  const boundPort = server.port ?? port;
  const bound = showUrl(opts, localProto, boundPort);

  return {
    url: bound,
    port: boundPort,
    room,
    stop: () => server.stop(true),
  };
}

/** Address another machine on the same LAN can open. Loopback if none. */
export function localAddr(): string {
  try {
    const nets = networkInterfaces();
    for (const addrs of Object.values(nets)) {
      for (const a of addrs ?? []) {
        if (a.family === "IPv4" && !a.internal) return a.address;
      }
    }
  } catch {
    /* no interfaces in this process */
  }
  return "127.0.0.1";
}

function showUrl(opts: ListenOpts, proto: string, port: number): string {
  const set = opts.publicUrl?.replace(/\/+$/, "") || process.env.WEBAGENT_PUBLIC_URL?.replace(/\/+$/, "");
  if (set) return set;
  if (opts.reach) return `${proto}://${localAddr()}:${port}`;
  return `${proto}://127.0.0.1:${port}`;
}

function tlsEnv(): { cert: ReturnType<typeof Bun.file>; key: ReturnType<typeof Bun.file> } | undefined {
  const certPath = process.env.WEBAGENT_TLS_CERT;
  const keyPath = process.env.WEBAGENT_TLS_KEY;
  if (!certPath || !keyPath) return undefined;
  return { cert: Bun.file(certPath), key: Bun.file(keyPath) };
}
