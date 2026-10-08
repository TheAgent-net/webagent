/**
 * Content: the stored copy of the site pages that a pack answers from.
 * The file is `content.json` in the pack folder.
 * A pack with this file opens without a crawl. `refresh.ts` keeps it current.
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { PageShot } from "../site/types.ts";

export const CONTENT_FILE = "content.json";

/** One stored page plus the hash of its text. */
export interface StoredPage extends PageShot {
  hash: string;
}

export interface Content {
  origin: string;
  /** Time of the last fetch, in milliseconds. */
  saved: number;
  pages: StoredPage[];
  /** Retrieval provider and container that have the current pages, for example `supermemory:webagent-acme`. */
  pushed?: string;
}

/** Hash of the page text that the agent reads. Links and forms do not count. */
export function hashPage(page: Pick<PageShot, "title" | "description" | "headings" | "text">): string {
  const body = [page.title, page.description, page.headings.join("\n"), page.text.replace(/\s+/g, " ").trim()].join("\n");
  return createHash("sha256").update(body).digest("hex").slice(0, 32);
}

export function hasContent(dir: string): boolean {
  return existsSync(join(dir, CONTENT_FILE));
}

export function loadContent(dir: string): Content | undefined {
  const file = join(dir, CONTENT_FILE);
  if (!existsSync(file)) return undefined;
  try {
    const raw = JSON.parse(readFileSync(file, "utf8")) as Content;
    if (!Array.isArray(raw.pages)) return undefined;
    for (const p of raw.pages) p.hash ||= hashPage(p);
    return raw;
  } catch {
    return undefined;
  }
}

/** Write the pages. Keep only pages with a good status. Write to a temp file, then rename. */
export function saveContent(dir: string, origin: string, pages: PageShot[], pushed?: string): Content {
  const content: Content = {
    origin,
    saved: Date.now(),
    pages: pages.filter((p) => p.status >= 200 && p.status < 400).map((p) => ({ ...p, hash: hashPage(p) })),
    ...(pushed ? { pushed } : {}),
  };
  const file = join(dir, CONTENT_FILE);
  writeFileSync(file + ".tmp", JSON.stringify(content) + "\n");
  renameSync(file + ".tmp", file);
  return content;
}
