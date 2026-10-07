/**
 * Build: onboard a new site in the background and keep its status.
 *
 * - The status lives in memory while the build runs.
 * - The tenant row keeps the last status in `settings.build`, so it stays after a restart.
 * - A build that was running when the service stopped reads as `failed`.
 */
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import type { Tenants } from "../host/tenant.ts";
import { onboard, type Onboarded, type OnboardOpts } from "../pack/onboard.ts";
import type { Tenant } from "../store/store.ts";

export type BuildStatus = "building" | "ready" | "failed";

export interface Build {
  status: BuildStatus;
  error?: string;
}

export type OnboardSite = (url: string, opts: OnboardOpts) => Promise<Onboarded>;

export interface BuildsOpts {
  /** Folder that holds one pack per tenant. Default: `packs`. */
  packs?: string;
  /** Most builds at once. */
  cap?: number;
  /** Onboard function. Tests pass a fake. */
  onboard?: OnboardSite;
}

/** One site to build. */
export interface SiteOrder {
  url: string;
  id: string;
  org: string;
  name?: string;
}

const ERROR_CAP = 300;

export class Builds {
  private readonly live = new Map<string, Build>();
  private readonly pending = new Map<string, Promise<void>>();
  private readonly packs: string;
  private readonly cap: number;
  private readonly onboard: OnboardSite;

  constructor(
    private readonly tenants: Tenants,
    opts: BuildsOpts = {},
  ) {
    this.packs = opts.packs ?? "packs";
    this.cap = opts.cap ?? 2;
    this.onboard = opts.onboard ?? onboard;
  }

  /** Number of builds that run now. */
  running(): number {
    let n = 0;
    for (const b of this.live.values()) if (b.status === "building") n++;
    return n;
  }

  /** True when one more build may start. */
  hasRoom(): boolean {
    return this.running() < this.cap;
  }

  /** Add the tenant row and start the build. Do not wait for it. */
  start(order: SiteOrder): void {
    const store = this.tenants.store;
    const host = new URL(order.url).hostname;
    const row: Tenant = {
      id: order.id,
      name: order.name || host,
      pack: resolve(this.packs, order.id),
      domains: [],
      origins: [new URL(order.url).origin],
      settings: { source: order.url, build: { status: "building" } },
      created: Date.now(),
      org: order.org,
    };
    store.putTenant(row);
    this.live.set(order.id, { status: "building" });

    const done = this.onboard(order.url, {
      id: order.id,
      store,
      org: order.org,
      name: order.name,
      packs: this.packs,
      maxPages: Number(process.env.WEBAGENT_MAX_PAGES) || 80,
      log: (line) => console.error("build " + order.id + ": " + line),
    }).then(
      (got) => {
        const t = store.getTenant(order.id) ?? got.tenant;
        const name = order.name || got.config.brand?.name || t.name;
        store.putTenant({ ...t, name, settings: { ...t.settings, build: { status: "ready" } } });
        this.live.set(order.id, { status: "ready" });
        this.tenants.reload(order.id);
      },
      (err: unknown) => {
        const error = "The build failed: " + (err instanceof Error ? err.message : String(err)).slice(0, ERROR_CAP);
        console.error("build " + order.id + " failed:", err instanceof Error ? err.message : err);
        const t = store.getTenant(order.id);
        if (t) store.putTenant({ ...t, settings: { ...t.settings, build: { status: "failed", error } } });
        this.live.set(order.id, { status: "failed", error });
      },
    );
    this.pending.set(order.id, done);
    void done.finally(() => this.pending.delete(order.id));
  }

  /** Wait until the build of one site ends. Tests use it. */
  async wait(id: string): Promise<void> {
    await this.pending.get(id);
  }

  /** The build status of one site. */
  getStatus(tenant: Tenant): Build {
    const live = this.live.get(tenant.id);
    if (live) return live;
    const saved = tenant.settings.build as Build | undefined;
    if (saved?.status === "building") return { status: "failed", error: "The build stopped when the service stopped." };
    if (saved?.status === "failed") return { status: "failed", error: typeof saved.error === "string" ? saved.error : undefined };
    if (saved?.status === "ready" || existsSync(join(tenant.pack, "pack.json"))) return { status: "ready" };
    return { status: "failed", error: "The site has no pack." };
  }
}
