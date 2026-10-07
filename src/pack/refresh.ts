/**
 * Refresh: keep a pack current with its site.
 *
 * 1. Fetch the site again (sitemap, links, `llms.txt`).
 * 2. Compare the hash of each page with the stored hash in `content.json`.
 * 3. When no page changed, stop. Write nothing.
 * 4. Else write the new pages, rebuild the chunks, and embed only new chunk text (the cache holds the rest).
 * 5. Capture visuals again only for changed pages, when Chromium is available.
 * 6. Send changed pages to a remote retrieval provider when the pack uses one.
 *
 * The caller reloads the tenant. `refreshTenant` does all of this for one tenant.
 * Only one refresh runs at a time in a process.
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { indexPages } from "../retrieve/chunk.ts";
import { defaultQueryEmbed, EMBED_MODEL, fillVectors, type EmbedFn } from "../retrieve/embed.ts";
import { getContainerTag, localProvider, selectProvider } from "../retrieve/provider.ts";
import { crawlSite } from "../site/crawl.ts";
import type { PageShot } from "../site/types.ts";
import { captureVisuals, getChrome, type Visual } from "../site/visual.ts";
import type { Tenants } from "../host/tenant.ts";
import { hashPage, loadContent, saveContent, type StoredPage } from "./content.ts";
import { getLlmsPages } from "./from-url.ts";
import { loadPackConfig, packPolicy } from "./load.ts";

export interface RefreshOpts {
  fetch?: typeof fetch;
  /** Embedder for new chunk text. `false` skips embeddings. Default: OpenAI when `OPENAI_API_KEY` is set. */
  embed?: EmbedFn | false;
  /** Capture visuals for changed pages. Default: on when Chromium is found. */
  visuals?: boolean;
  maxPages?: number;
  /** Env for the retrieval provider key. Default: `process.env`. */
  env?: Record<string, string | undefined>;
  log?: (line: string) => void;
}

export interface RefreshResult {
  id: string;
  dir: string;
  changed: string[];
  added: string[];
  removed: string[];
  same: number;
  /** True when the pages changed and the pack was written again. */
  rebuilt: boolean;
  /** Chunks embedded in this refresh. Cached chunks do not count. */
  embedded: number;
  visuals: number;
  /** Pages sent to a remote retrieval provider. */
  pushed: number;
  /** Why the refresh did nothing, for example a pack with its own `build.ts`. */
  skipped?: string;
  ms: number;
}

/** Refresh one pack folder. Do not reload any tenant. */
export async function refreshPack(dir: string, opts: RefreshOpts = {}): Promise<RefreshResult> {
  const started = Date.now();
  const config = loadPackConfig(dir);
  const root = config.dir!;
  const log = opts.log ?? ((line: string) => console.error(line));
  const fetchFn = opts.fetch ?? fetch;
  if (existsSync(join(root, "build.ts"))) {
    /* A pack with its own build step loads its own pages. Refresh does not know them. */
    return {
      id: config.id,
      dir: root,
      changed: [],
      added: [],
      removed: [],
      same: 0,
      rebuilt: false,
      embedded: 0,
      visuals: 0,
      pushed: 0,
      skipped: "pack has its own build.ts",
      ms: Date.now() - started,
    };
  }
  const stored = loadContent(root);
  const before = new Map<string, StoredPage>((stored?.pages ?? []).map((p) => [p.url, p]));

  const max = Math.max(opts.maxPages ?? (Number(process.env.WEBAGENT_MAX_PAGES) || 80), before.size);
  const state = await crawlSite(config.origin, { maxPages: max, fetch: fetchFn });
  const llms = await getLlmsPages(config.origin, fetchFn);
  const fetched = dedupe([...state.pages, ...llms]);
  const good = fetched.filter((p) => p.status >= 200 && p.status < 400);
  if (!good.length) throw new Error("refresh " + config.id + ": the site gave no pages. Content kept.");

  const pages: PageShot[] = [];
  const changed: string[] = [];
  const added: string[] = [];
  let same = 0;
  for (const p of fetched) {
    const old = before.get(p.url);
    const ok = p.status >= 200 && p.status < 400;
    if (!ok) {
      /* A page that failed this time keeps its old copy. */
      if (old && p.status === 0) {
        pages.push(old);
        same++;
      }
      continue;
    }
    pages.push(p);
    if (!old) added.push(p.url);
    else if (old.hash !== hashPage(p)) changed.push(p.url);
    else same++;
  }
  const kept = new Set(pages.map((p) => p.url));
  const removed = [...before.keys()].filter((url) => !kept.has(url));

  const result: RefreshResult = {
    id: config.id,
    dir: root,
    changed,
    added,
    removed,
    same,
    rebuilt: false,
    embedded: 0,
    visuals: 0,
    pushed: 0,
    ms: 0,
  };

  const fresh = [...changed, ...added];
  const provider = remoteProvider(config.id, config.retrieval, opts);
  const pushTag = provider ? provider.name + ":" + getContainerTag(config.id, config.retrieval) : undefined;
  const pushAll = !!pushTag && stored?.pushed !== pushTag;

  if (!fresh.length && !removed.length && stored && !pushAll) {
    result.ms = Date.now() - started;
    return result;
  }

  /* Pages changed. Write them and rebuild the chunks. */
  if (fresh.length || removed.length || !stored) {
    saveContent(root, config.origin, pages, stored?.pushed);
    writeFileSync(
      join(root, "pages.json"),
      JSON.stringify(
        pages.map((p) => ({ url: p.url, title: p.title, status: p.status, headings: p.headings.slice(0, 8) })),
        null,
        2,
      ) + "\n",
    );
    result.rebuilt = true;
    result.embedded = await embedChunks(root, pages, config, opts);
    result.visuals = await recapture(root, config.origin, fresh, removed, config.visuals ?? [], opts, log);
  }

  /* Send changed pages to the remote provider. Send all pages the first time. */
  if (provider && pushTag) {
    const send = pushAll ? pages : pages.filter((p) => fresh.includes(p.url));
    try {
      result.pushed = send.length ? await provider.add(send) : 0;
      saveContent(root, config.origin, pages, pushTag);
    } catch (err) {
      log("refresh " + config.id + ": retrieval push failed: " + (err instanceof Error ? err.message : String(err)));
    }
  }

  result.ms = Date.now() - started;
  return result;
}

/** One line for logs. */
export function describeRefresh(r: RefreshResult): string {
  if (r.skipped) return `refresh ${r.id}: skipped, ${r.skipped}`;
  return (
    `refresh ${r.id}: ${r.changed.length} changed, ${r.added.length} added, ${r.removed.length} removed, ${r.same} same` +
    (r.rebuilt ? `, rebuilt, ${r.embedded} embedded, ${r.visuals} visuals` : ", no change") +
    (r.pushed ? `, ${r.pushed} pushed` : "") +
    ` (${r.ms} ms)`
  );
}

let lock: Promise<unknown> = Promise.resolve();

/** Run jobs one after another. A failed job does not block the next. */
function withLock<T>(job: () => Promise<T>): Promise<T> {
  const next = lock.then(job, job);
  lock = next.catch(() => undefined);
  return next;
}

/** Refresh one tenant, then reload it when its pack changed. Record the result in the tenant settings. */
export function refreshTenant(tenants: Tenants, id: string, opts: RefreshOpts = {}): Promise<RefreshResult> {
  return withLock(async () => {
    const tenant = tenants.store.getTenant(id);
    if (!tenant) throw new Error("unknown tenant: " + id);
    const log = opts.log ?? ((line: string) => console.error(line));
    const result = await refreshPack(tenant.pack, { ...opts, log });
    if (result.rebuilt || result.pushed) tenants.reload(id);
    const now = tenants.store.getTenant(id) ?? tenant;
    tenants.store.putTenant({
      ...now,
      settings: {
        ...now.settings,
        refresh: {
          at: Date.now(),
          changed: result.changed.length,
          added: result.added.length,
          removed: result.removed.length,
          rebuilt: result.rebuilt,
        },
      },
    });
    log(describeRefresh(result));
    return result;
  });
}

export interface RefreshLoop {
  stop(): void;
}

/**
 * Refresh every tenant, one at a time, every `everyMs`. The first pass starts after `everyMs`.
 * A failed tenant logs its error. The loop goes on.
 */
export function startRefresh(tenants: Tenants, everyMs: number, opts: RefreshOpts = {}): RefreshLoop {
  const log = opts.log ?? ((line: string) => console.error(line));
  let timer: ReturnType<typeof setTimeout> | undefined;
  let stopped = false;
  const pass = async () => {
    for (const t of tenants.list()) {
      if (stopped) return;
      try {
        await refreshTenant(tenants, t.id, { ...opts, log });
      } catch (err) {
        log("refresh " + t.id + " failed: " + (err instanceof Error ? err.message : String(err)));
      }
    }
  };
  const plan = () => {
    if (stopped) return;
    timer = setTimeout(() => {
      pass().finally(plan);
    }, everyMs);
    timer.unref?.();
  };
  plan();
  return {
    stop() {
      stopped = true;
      if (timer) clearTimeout(timer);
    },
  };
}

/* ---------- parts ---------- */

function remoteProvider(id: string, config: Parameters<typeof selectProvider>[0]["config"], opts: RefreshOpts) {
  if (config?.provider !== "supermemory") return undefined;
  const local = localProvider({ corpus: () => ({ origin: "", pages: [] }) });
  const chosen = selectProvider({ id, config, local, env: opts.env, fetch: opts.fetch, warn: opts.log });
  return chosen === local ? undefined : chosen;
}

/** Index the pages and fill the embedding cache. Only text that is not in the cache goes to the embedder. */
async function embedChunks(
  root: string,
  pages: PageShot[],
  config: ReturnType<typeof loadPackConfig>,
  opts: RefreshOpts,
): Promise<number> {
  const embed = opts.embed === false ? undefined : typeof opts.embed === "function" ? opts.embed : defaultQueryEmbed();
  if (!embed) return 0;
  let count = 0;
  const counted: EmbedFn = (texts) => {
    count += texts.length;
    return embed(texts);
  };
  const chunks = indexPages(pages, packPolicy(config));
  try {
    await fillVectors(chunks, { embed: counted, cachePath: join(root, "retrieve-cache.json"), model: typeof opts.embed === "function" ? "custom" : EMBED_MODEL });
  } catch (err) {
    (opts.log ?? console.error)("refresh " + config.id + ": embeddings failed: " + (err instanceof Error ? err.message : String(err)));
  }
  return count;
}

/** Capture visuals for changed pages. Keep the visuals of other pages. Drop visuals of removed pages. */
async function recapture(
  root: string,
  origin: string,
  fresh: string[],
  removed: string[],
  old: Visual[],
  opts: RefreshOpts,
  log: (line: string) => void,
): Promise<number> {
  const pathOf = (url: string) => {
    try {
      return new URL(url).pathname;
    } catch {
      return url;
    }
  };
  const gone = new Set(removed.map(pathOf));
  const touched = new Set(fresh.map(pathOf));
  let keep = old.filter((v) => !gone.has(v.page));
  const wanted = opts.visuals ?? !opts.fetch;
  if (!wanted || !touched.size || !old.length) {
    if (keep.length !== old.length) writeVisuals(root, keep);
    return 0;
  }
  try {
    getChrome();
  } catch {
    log("refresh: no Chromium found. Visuals kept as they were.");
    if (keep.length !== old.length) writeVisuals(root, keep);
    return 0;
  }
  /* Capture into a side folder, then merge. */
  const side = join(root, ".refresh-visuals");
  rmSync(side, { recursive: true, force: true });
  try {
    const paths = [...touched].slice(0, 8);
    const got = await captureVisuals(origin, { out: side, pages: paths, maxPages: paths.length });
    keep = keep.filter((v) => !touched.has(v.page));
    const used = new Set(keep.map((v) => v.id));
    mkdirSync(join(root, "visuals"), { recursive: true });
    for (const v of got) {
      let id = v.id;
      for (let n = 2; used.has(id); n++) id = v.id + "-" + n;
      used.add(id);
      const image = moveFile(side, root, v.image, id);
      const html = v.html ? moveFile(side, root, v.html, id) : undefined;
      keep.push({ ...v, id, image, ...(html ? { html } : {}) });
    }
    const fonts = join(side, "visuals", "fonts.css");
    if (existsSync(fonts)) {
      const target = join(root, "visuals", "fonts.css");
      const lines = new Set([
        ...(existsSync(target) ? readFileSync(target, "utf8").split("\n") : []),
        ...readFileSync(fonts, "utf8").split("\n"),
      ]);
      writeFileSync(target, [...lines].filter(Boolean).join("\n") + "\n");
    }
    writeVisuals(root, keep);
    return got.length;
  } catch (err) {
    log("refresh: visual capture skipped: " + (err instanceof Error ? err.message : String(err)));
    if (keep.length !== old.length) writeVisuals(root, keep);
    return 0;
  } finally {
    rmSync(side, { recursive: true, force: true });
  }
}

function moveFile(from: string, to: string, rel: string, id: string): string {
  const ext = rel.slice(rel.lastIndexOf("."));
  const next = "visuals/" + id + ext;
  copyFileSync(join(from, rel), join(to, next));
  return next;
}

function writeVisuals(root: string, visuals: Visual[]): void {
  writeFileSync(join(root, "visuals.json"), JSON.stringify(visuals, null, 2) + "\n");
}

function dedupe(pages: PageShot[]): PageShot[] {
  const seen = new Set<string>();
  return pages.filter((p) => (seen.has(p.url) ? false : (seen.add(p.url), true)));
}
