/**
 * Tenants: the registry of companies on one hosted service.
 * A tenant opens on its first request and stays warm. The oldest closes past the cap.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import type { PackRuntime } from "../pack/types.ts";
import type { Store, Tenant } from "../store/store.ts";
import { Limiter } from "./limit.ts";
import { mount, type ListenOpts, type Mounted } from "./listen.ts";

export interface LiveTenant {
  tenant: Tenant;
  mounted: Mounted;
  runtime?: PackRuntime;
  opened: number;
}

/** Open one tenant's agent. Default: `readyPack` on the tenant's pack folder. */
export type OpenTenant = (
  tenant: Tenant,
  base: (req: Request) => string,
) => Promise<{ harness: import("../harness.ts").Harness; listen: ListenOpts; runtime?: PackRuntime }>;

export interface TenantsOpts {
  /** Folder with one pack per subfolder. Each pack with a `pack.json` becomes a tenant. */
  packs?: string;
  /** Most tenants kept open at once. */
  cap?: number;
  open?: OpenTenant;
  /** Fetch for outbound handoff calls. Tests pass a fake. */
  outbound?: typeof fetch;
}

const ID_OK = /^[a-z0-9][a-z0-9_-]{0,62}$/;

export class Tenants {
  private readonly live = new Map<string, Promise<LiveTenant>>();
  private readonly cap: number;
  private readonly openOne: OpenTenant;
  /** One rate limiter for every tenant. Keys carry the tenant id. */
  private readonly limiter = new Limiter();

  constructor(
    readonly store: Store,
    private readonly opts: TenantsOpts = {},
  ) {
    this.cap = opts.cap ?? (Number(process.env.WEBAGENT_TENANT_CAP) || 32);
    this.openOne = opts.open ?? openPackTenant;
  }

  /** Add every pack folder that is not yet a tenant. Return the ids that were added. */
  sync(): string[] {
    const dir = this.opts.packs;
    if (!dir || !existsSync(dir)) return [];
    const added: string[] = [];
    for (const name of readdirSync(dir).sort()) {
      const file = join(dir, name, "pack.json");
      if (!existsSync(file) || !ID_OK.test(name) || this.store.getTenant(name)) continue;
      let label = name;
      try {
        const cfg = JSON.parse(readFileSync(file, "utf8")) as { brand?: { name?: string } };
        label = cfg.brand?.name || name;
      } catch {
        /* keep the folder name */
      }
      this.store.putTenant({
        id: name,
        name: label,
        pack: resolve(dir, name),
        domains: [],
        origins: [],
        settings: {},
        created: Date.now(),
      });
      added.push(name);
    }
    return added;
  }

  list(): Tenant[] {
    return this.store.listTenants();
  }

  /** Tenant for a request host name (custom domain), if one is set. */
  forDomain(host: string): Tenant | undefined {
    return this.store.findTenant(host);
  }

  /** Open (or reuse) one tenant. Undefined when the id is unknown. */
  async get(id: string, base: (req: Request) => string): Promise<LiveTenant | undefined> {
    const known = this.live.get(id);
    if (known) {
      this.live.delete(id);
      this.live.set(id, known);
      return known;
    }
    const tenant = this.store.getTenant(id);
    if (!tenant) return undefined;
    const opening = this.openOne(tenant, base).then(({ harness, listen, runtime }) => ({
      tenant,
      runtime,
      opened: Date.now(),
      mounted: mount(harness, {
        ...listen,
        store: this.store,
        tenant: tenant.id,
        base,
        origins: tenant.origins,
        locked: true,
        outbound: this.opts.outbound,
        limiter: this.limiter,
      }),
    }));
    this.live.set(id, opening);
    opening.catch(() => this.live.delete(id));
    while (this.live.size > this.cap) {
      const oldest = this.live.keys().next().value;
      if (oldest === undefined) break;
      this.live.delete(oldest);
    }
    return opening;
  }

  /** Close a tenant so the next request opens it fresh (after a pack update). */
  reload(id: string): void {
    this.live.delete(id);
  }

  isOpen(id: string): boolean {
    return this.live.has(id);
  }
}

async function openPackTenant(tenant: Tenant) {
  const { readyPack } = await import("../pack/serve.ts");
  const ready = await readyPack(tenant.pack, { maxPages: Number(process.env.WEBAGENT_MAX_PAGES) || 220 });
  return { harness: ready.harness, listen: ready.listen, runtime: ready.runtime };
}
