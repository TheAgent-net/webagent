/**
 * Verify: prove that a visitor is the agent it claims to be. Set `verified`.
 *
 * Two proofs:
 * - Published IP ranges. The check is synchronous. It reads ranges from memory.
 *   A background job refreshes the ranges once a day. The last good copy stays in memory and on disk.
 * - Web Bot Auth (RFC 9421 HTTP message signatures). The check is async.
 *   It fetches the key directory named in `Signature-Agent` and keeps it in a cache.
 *
 * No function in this file throws into the request path.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { HTTP_MESSAGE_SIGNATURES_DIRECTORY, parseSignatureAgentCard, verify, type WebBotVerifier } from "web-bot-auth";
import { verifierFromJWK } from "web-bot-auth/crypto";
import type { VisitorKind } from "../store/store.ts";
import { getClientIp, type Visitor } from "./visitor.ts";

export type Fetch = (url: string, init?: RequestInit) => Promise<Response>;

/* ---------- IP ranges ---------- */

/** One published range list. `family` must match the family that `classifyVisitor` gives. */
export interface RangeSource {
  family: string;
  kind: VisitorKind;
  url: string;
}

/** Range lists that we confirmed. Each one is JSON with `prefixes: [{ ipv4Prefix | ipv6Prefix }]`. */
export const RANGE_SOURCES: RangeSource[] = [
  { family: "chatgpt", kind: "assistant", url: "https://openai.com/chatgpt-user.json" },
  { family: "openai", kind: "crawler", url: "https://openai.com/gptbot.json" },
  { family: "openai", kind: "crawler", url: "https://openai.com/searchbot.json" },
  { family: "perplexity", kind: "assistant", url: "https://www.perplexity.com/perplexity-user.json" },
  { family: "perplexity", kind: "crawler", url: "https://www.perplexity.com/perplexitybot.json" },
  { family: "google", kind: "crawler", url: "https://developers.google.com/static/crawling/ipranges/common-crawlers.json" },
  { family: "google", kind: "assistant", url: "https://developers.google.com/static/crawling/ipranges/user-triggered-fetchers.json" },
  { family: "google", kind: "assistant", url: "https://developers.google.com/static/crawling/ipranges/user-triggered-agents.json" },
  { family: "bing", kind: "crawler", url: "https://www.bing.com/toolbox/bingbot.json" },
];

interface Cidr {
  v6: boolean;
  base: bigint;
  bits: number;
}

/** Parse an IPv4 or IPv6 address. An IPv4-mapped IPv6 address becomes IPv4. */
export function parseIp(text: string): { v6: boolean; n: bigint } | undefined {
  let s = text.trim().replace(/^\[|\]$/g, "");
  const zone = s.indexOf("%");
  if (zone >= 0) s = s.slice(0, zone);
  const mapped = /^::ffff:(\d+\.\d+\.\d+\.\d+)$/i.exec(s);
  if (mapped) s = mapped[1]!;
  if (/^\d+\.\d+\.\d+\.\d+$/.test(s)) {
    const parts = s.split(".").map(Number);
    if (parts.some((p) => p > 255)) return undefined;
    return { v6: false, n: BigInt(((parts[0]! << 24) >>> 0) + (parts[1]! << 16) + (parts[2]! << 8) + parts[3]!) };
  }
  if (!s.includes(":") || !/^[0-9a-f:.]+$/i.test(s)) return undefined;
  /* Write an embedded IPv4 tail as two hex groups. */
  const v4 = /(\d+\.\d+\.\d+\.\d+)$/.exec(s);
  if (v4) {
    const ip = parseIp(v4[1]!);
    if (!ip || ip.v6) return undefined;
    s = s.slice(0, -v4[1]!.length) + (ip.n >> 16n).toString(16) + ":" + (ip.n & 0xffffn).toString(16);
  }
  const halves = s.split("::");
  if (halves.length > 2) return undefined;
  const read = (h: string) => (h ? h.split(":").map((g) => (/^[0-9a-f]{1,4}$/i.test(g) ? parseInt(g, 16) : NaN)) : []);
  const head = read(halves[0]!);
  const back = halves.length === 2 ? read(halves[1]!) : [];
  const fill = 8 - head.length - back.length;
  if (halves.length === 1 ? fill !== 0 : fill < 1) return undefined;
  const groups = [...head, ...Array(halves.length === 2 ? fill : 0).fill(0), ...back];
  if (groups.length !== 8 || groups.some((g) => Number.isNaN(g))) return undefined;
  return { v6: true, n: groups.reduce((acc, g) => (acc << 16n) + BigInt(g), 0n) };
}

export function parseCidr(text: string): Cidr | undefined {
  const [addr, size] = text.trim().split("/");
  const ip = parseIp(addr ?? "");
  if (!ip) return undefined;
  const max = ip.v6 ? 128 : 32;
  const bits = size === undefined ? max : Number(size);
  if (!Number.isInteger(bits) || bits < 0 || bits > max) return undefined;
  const shift = BigInt(max - bits);
  return { v6: ip.v6, base: (ip.n >> shift) << shift, bits };
}

function contains(cidr: Cidr, ip: { v6: boolean; n: bigint }): boolean {
  if (cidr.v6 !== ip.v6) return false;
  const shift = BigInt((cidr.v6 ? 128 : 32) - cidr.bits);
  return (ip.n >> shift) << shift === cidr.base;
}

/** True when the address is inside the CIDR block. Bad input gives false. */
export function matchCidr(ip: string, cidr: string): boolean {
  const a = parseIp(ip);
  const c = parseCidr(cidr);
  return !!a && !!c && contains(c, a);
}

/** Read `prefixes` from one published range file. */
export function readPrefixes(body: unknown): string[] {
  const list = (body as { prefixes?: unknown })?.prefixes;
  if (!Array.isArray(list)) return [];
  const out: string[] = [];
  for (const p of list) {
    const v = (p as { ipv4Prefix?: unknown; ipv6Prefix?: unknown }) ?? {};
    const s = typeof v.ipv4Prefix === "string" ? v.ipv4Prefix : typeof v.ipv6Prefix === "string" ? v.ipv6Prefix : "";
    if (s && parseCidr(s)) out.push(s);
  }
  return out;
}

interface RangeCopy {
  family: string;
  kind: VisitorKind;
  prefixes: string[];
  at: number;
}

/** In-memory range table, one list per source URL. */
export class Ranges {
  private copies = new Map<string, RangeCopy>();
  private byFamily = new Map<string, Cidr[]>();

  /** Replace the prefixes of one source. */
  set(source: RangeSource, prefixes: string[], at = Date.now()): void {
    this.copies.set(source.url, { family: source.family, kind: source.kind, prefixes, at });
    this.rebuild();
  }

  /** True when the address is in a range of this family. */
  has(family: string, ip: string): boolean {
    const a = parseIp(ip);
    if (!a) return false;
    return (this.byFamily.get(family) ?? []).some((c) => contains(c, a));
  }

  get size(): number {
    let n = 0;
    for (const list of this.byFamily.values()) n += list.length;
    return n;
  }

  /** Fetch every source. Keep the old copy of a source that fails. Return the count of sources that loaded. */
  async refresh(sources = RANGE_SOURCES, fetcher: Fetch = fetch): Promise<number> {
    let ok = 0;
    await Promise.all(
      sources.map(async (source) => {
        try {
          const res = await fetcher(source.url, { signal: AbortSignal.timeout(15_000), redirect: "follow" });
          if (!res.ok) return;
          const text = await res.text();
          if (text.length > 2_000_000) return;
          const prefixes = readPrefixes(JSON.parse(text));
          if (!prefixes.length) return;
          this.set(source, prefixes);
          ok++;
        } catch {
          /* keep the last good copy */
        }
      }),
    );
    return ok;
  }

  /** Load the last good copy from disk. */
  load(file: string): void {
    try {
      if (!existsSync(file)) return;
      const saved = JSON.parse(readFileSync(file, "utf8")) as Record<string, RangeCopy>;
      for (const [url, copy] of Object.entries(saved)) {
        if (!Array.isArray(copy?.prefixes) || typeof copy.family !== "string") continue;
        this.copies.set(url, { ...copy, prefixes: copy.prefixes.filter((p) => typeof p === "string" && parseCidr(p)) });
      }
      this.rebuild();
    } catch {
      /* a bad file is the same as no file */
    }
  }

  save(file: string): void {
    try {
      mkdirSync(dirname(file), { recursive: true });
      writeFileSync(file, JSON.stringify(Object.fromEntries(this.copies)));
    } catch (err) {
      console.error("save ranges failed:", err instanceof Error ? err.message : err);
    }
  }

  private rebuild(): void {
    const next = new Map<string, Cidr[]>();
    for (const copy of this.copies.values()) {
      const list = next.get(copy.family) ?? [];
      for (const p of copy.prefixes) {
        const c = parseCidr(p);
        if (c) list.push(c);
      }
      next.set(copy.family, list);
    }
    this.byFamily = next;
  }
}

/** Shared range table for this process. */
export const ranges = new Ranges();

export interface RangeOpts {
  /** Disk copy. Default `data/ranges.json` (gitignored). */
  file?: string;
  everyMs?: number;
  fetch?: Fetch;
}

let rangeTimer: ReturnType<typeof setInterval> | undefined;

/** Load the disk copy, refresh now, then refresh once a day. Return a stop function. Call it once per process. */
export function startRanges(opts: RangeOpts = {}): () => void {
  const file = opts.file ?? process.env.WEBAGENT_RANGES_FILE ?? "data/ranges.json";
  const every = opts.everyMs ?? 24 * 60 * 60 * 1000;
  const stop = () => {
    if (rangeTimer) clearInterval(rangeTimer);
    rangeTimer = undefined;
  };
  if (rangeTimer) return stop;
  ranges.load(file);
  const run = async () => {
    const ok = await ranges.refresh(RANGE_SOURCES, opts.fetch);
    if (ok) ranges.save(file);
  };
  void run();
  rangeTimer = setInterval(() => void run(), every);
  (rangeTimer as { unref?: () => void }).unref?.();
  return stop;
}

/** Synchronous IP check. Set `verified` when the client IP is in the ranges of the claimed family. */
export function checkIp(req: Request, visitor: Visitor, table: Ranges = ranges): Visitor {
  if (visitor.verified || !visitor.family || visitor.kind === "human") return visitor;
  try {
    const ip = getClientIp(req);
    if (ip && table.has(visitor.family, ip)) return { ...visitor, verified: true };
  } catch {
    /* fall through */
  }
  return visitor;
}

/* ---------- Web Bot Auth signatures ---------- */

/** Signer host → family. Other hosts keep the host name as the family. */
const SIGNERS: { pattern: RegExp; family: string }[] = [
  { pattern: /(^|\.)(chatgpt\.com|openai\.com)$/, family: "chatgpt" },
  { pattern: /(^|\.)(anthropic\.com|claude\.ai|claude\.com)$/, family: "claude" },
  { pattern: /(^|\.)perplexity\.(ai|com)$/, family: "perplexity" },
  { pattern: /(^|\.)browserbase\.com$/, family: "browserbase" },
  { pattern: /(^|\.)google\.com$/, family: "google" },
  { pattern: /(^|\.)amazon\.com$/, family: "amazon" },
];

export function getSignerFamily(host: string): string {
  const h = host.toLowerCase();
  return SIGNERS.find((s) => s.pattern.test(h))?.family ?? h;
}

export interface SignatureOpts {
  fetch?: Fetch;
  now?: Date;
  /** Time budget for one directory fetch, in milliseconds. */
  timeoutMs?: number;
  /** Largest directory body, in bytes. */
  maxBytes?: number;
  /** Directory cache time, in milliseconds. */
  ttlMs?: number;
}

export interface Signed {
  /** Host of the signer, from `Signature-Agent`. */
  agent: string;
  keyid: string;
}

interface DirectoryCopy {
  at: number;
  ttl: number;
  verifiers: WebBotVerifier[];
}

const DIRECTORIES = new Map<string, DirectoryCopy>();
const DIRECTORY_CAP = 256;
const FAIL_TTL = 5 * 60 * 1000;

/** Clear the key directory cache (for tests). */
export function clearDirectories(): void {
  DIRECTORIES.clear();
}

export function hasSignature(req: Request): boolean {
  return !!(req.headers.get("signature") && req.headers.get("signature-input"));
}

/** Read a body with a size cap. Stop early when the body is too large. */
async function readBody(res: Response, max: number): Promise<string | undefined> {
  const size = Number(res.headers.get("content-length") || 0);
  if (size > max) return undefined;
  if (!res.body) return "";
  const reader = res.body.getReader();
  const parts: Uint8Array[] = [];
  let n = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    n += value.byteLength;
    if (n > max) {
      await reader.cancel().catch(() => {});
      return undefined;
    }
    parts.push(value);
  }
  return new TextDecoder().decode(Buffer.concat(parts));
}

/** Directory URL for one `Signature-Agent` entry. HTTPS only. */
function getDirectoryUrl(uri: string, type: string): string | undefined {
  try {
    const url = new URL(uri);
    if (url.protocol !== "https:") return undefined;
    if (type === "directory" && (url.pathname === "/" || url.pathname === "")) {
      return url.origin + HTTP_MESSAGE_SIGNATURES_DIRECTORY;
    }
    return url.href;
  } catch {
    return undefined;
  }
}

async function getJson(url: string, opts: SignatureOpts): Promise<unknown> {
  const res = await (opts.fetch ?? fetch)(url, {
    signal: AbortSignal.timeout(opts.timeoutMs ?? 1500),
    redirect: "error",
    headers: { accept: "application/http-message-signatures-directory+json, application/json" },
  });
  if (!res.ok) throw new Error("directory status " + res.status);
  const text = await readBody(res, opts.maxBytes ?? 64 * 1024);
  if (text === undefined) throw new Error("directory too large");
  return JSON.parse(text);
}

/** Fetch the keys for one signer, or read them from the cache. */
async function getVerifiers(uri: string, type: string, opts: SignatureOpts): Promise<WebBotVerifier[]> {
  const url = getDirectoryUrl(uri, type);
  if (!url) return [];
  const now = Date.now();
  const cached = DIRECTORIES.get(url);
  if (cached && now - cached.at < cached.ttl) return cached.verifiers;
  let verifiers: WebBotVerifier[] = [];
  let ttl = opts.ttlMs ?? 60 * 60 * 1000;
  try {
    let body = await getJson(url, opts);
    if (type === "cimd") {
      const card = parseSignatureAgentCard(body, url);
      body = card.jwks ?? (card.jwks_uri && getDirectoryUrl(card.jwks_uri, "jwks_uri") ? await getJson(card.jwks_uri, opts) : {});
    }
    const keys = (body as { keys?: unknown })?.keys;
    if (Array.isArray(keys)) {
      for (const key of keys.slice(0, 32)) {
        try {
          verifiers.push(await verifierFromJWK(key as JsonWebKey));
        } catch {
          /* skip a key we cannot use */
        }
      }
    }
  } catch {
    verifiers = [];
    ttl = FAIL_TTL;
  }
  if (DIRECTORIES.size >= DIRECTORY_CAP) DIRECTORIES.delete(DIRECTORIES.keys().next().value!);
  DIRECTORIES.set(url, { at: now, ttl, verifiers });
  return verifiers;
}

/** Verify a Web Bot Auth signature. Return the signer, or undefined. Never throw. */
export async function verifySignature(req: Request, opts: SignatureOpts = {}): Promise<Signed | undefined> {
  if (!hasSignature(req)) return undefined;
  try {
    let agent = "";
    const done = await verify(req, {
      now: opts.now,
      maxAge: 300,
      clockSkew: 30,
      resolver: async (candidate) => {
        const entry = candidate.signatureAgent;
        if (!entry) throw new Error("no Signature-Agent");
        const url = getDirectoryUrl(entry.uri, entry.type);
        if (!url) throw new Error("Signature-Agent must use https");
        agent = new URL(url).hostname;
        const hit = (await getVerifiers(entry.uri, entry.type, opts)).find((v) => v.keyid === candidate.keyid);
        if (!hit) throw new Error("unknown key");
        return hit;
      },
    });
    return agent ? { agent, keyid: done.keyid } : undefined;
  } catch {
    return undefined;
  }
}

export interface ProveOpts extends SignatureOpts {
  /** Total time budget, in milliseconds. Past it, keep the visitor as it is. */
  budgetMs?: number;
}

/**
 * Prove a signed visitor. Resolve to the same visitor when the proof fails or runs out of time.
 * A browser user agent with a valid agent signature becomes an agent browser.
 */
export async function proveVisitor(req: Request, visitor: Visitor, opts: ProveOpts = {}): Promise<Visitor> {
  const budget = opts.budgetMs ?? 2000;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const late = new Promise<undefined>((resolve) => {
    timer = setTimeout(() => resolve(undefined), budget);
  });
  try {
    const signed = await Promise.race([verifySignature(req, opts), late]);
    if (!signed) return visitor;
    const kind: VisitorKind = visitor.kind === "human" ? "browser" : visitor.kind === "script" ? "assistant" : visitor.kind;
    return { ...visitor, kind, family: visitor.family || getSignerFamily(signed.agent), verified: true };
  } catch {
    return visitor;
  } finally {
    if (timer) clearTimeout(timer);
  }
}
