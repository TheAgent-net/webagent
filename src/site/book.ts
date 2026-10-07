import { crawlSite, resumeCrawl, type CrawlState } from "./crawl.ts";
import { buildPack } from "./pack.ts";
import type { AuthGrant, IngestOpts, SitePack } from "./types.ts";

let seq = 0;

export interface SiteJob {
  id: string;
  pack: SitePack;
  state: CrawlState;
}

/** Jobs live beside the harness, not inside the loop. */
export class SiteBook {
  private readonly jobs = new Map<string, SiteJob>();

  get(id: string): SiteJob | undefined {
    return this.jobs.get(id);
  }

  list(): { id: string; origin: string; complete: boolean; pages: number }[] {
    const out: { id: string; origin: string; complete: boolean; pages: number }[] = [];
    for (const j of this.jobs.values()) {
      out.push({ id: j.id, origin: j.pack.origin, complete: j.pack.complete, pages: j.pack.pages.length });
    }
    return out;
  }

  async ingest(url: string, opts: IngestOpts = {}): Promise<SiteJob> {
    const state = await crawlSite(url, opts);
    const job: SiteJob = { id: "s" + ++seq, pack: buildPack(state), state };
    this.jobs.set(job.id, job);
    return job;
  }

  async grant(id: string, grant: AuthGrant, opts: IngestOpts = {}): Promise<SiteJob> {
    const job = this.jobs.get(id);
    if (!job) throw new Error("unknown site " + id);
    const state = await resumeCrawl(job.state, grant, opts);
    job.state = state;
    job.pack = buildPack(state);
    return job;
  }
}

const books = new WeakMap<object, SiteBook>();

/** One book per harness instance — no Harness API change. */
export function siteBook(owner: object): SiteBook {
  let b = books.get(owner);
  if (!b) {
    b = new SiteBook();
    books.set(owner, b);
  }
  return b;
}
