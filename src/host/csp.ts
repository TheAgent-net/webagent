/**
 * CSP: find the Content-Security-Policy rules on a site that block the widget.
 *
 * - Read the `Content-Security-Policy` header and each CSP `<meta>` tag.
 * - Check the directives that the widget needs against our origin.
 * - Give the exact directive lines to put in the policy.
 *
 * The report-only header does not block. This module ignores it.
 */

/** Directives that the widget needs, and why. */
export const NEEDS = {
  "script-src": "load widget.js",
  "connect-src": "send chat requests and read the live stream",
  "img-src": "show visuals",
  "font-src": "load visual fonts",
  "style-src": "load visual styles and the inline widget style",
} as const;

export type Need = keyof typeof NEEDS;

/** One parsed policy: directive name to its source list. */
export type Policy = Map<string, string[]>;

export interface Check {
  directive: Need;
  ok: boolean;
  /** The directive that decides: the directive itself or `default-src`. Empty when none applies. */
  from: string;
  /** Why it blocks. */
  why?: string;
  /** The full directive line to put in the policy. */
  line?: string;
}

export interface CspReport {
  site: string;
  origin: string;
  /** Each enforced policy text, with where it came from. */
  policies: { from: "header" | "meta"; text: string }[];
  checks: Check[];
  ok: boolean;
  /** Lines to put in the policy. One per blocked directive. */
  lines: string[];
  /** A fetch error, if the page did not load. */
  error?: string;
}

/** Parse one policy text. The first instance of a directive wins, as browsers do. */
export function parseCsp(text: string): Policy {
  const out: Policy = new Map();
  for (const part of text.split(";")) {
    const words = part.trim().split(/\s+/).filter(Boolean);
    const name = words.shift()?.toLowerCase();
    if (!name || out.has(name)) continue;
    out.set(name, words);
  }
  return out;
}

/** Read every CSP meta tag in a page. */
export function readMeta(html: string): string[] {
  const out: string[] = [];
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    const equiv = attr(tag, "http-equiv");
    if (!equiv || equiv.toLowerCase() !== "content-security-policy") continue;
    const content = attr(tag, "content");
    if (content) out.push(decode(content));
  }
  return out;
}

function attr(tag: string, name: string): string | undefined {
  const m = new RegExp("\\b" + name + "\\s*=\\s*(\"([^\"]*)\"|'([^']*)'|([^\\s>]+))", "i").exec(tag);
  return m ? (m[2] ?? m[3] ?? m[4]) : undefined;
}

function decode(s: string): string {
  return s
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

/** True when one source expression allows `origin`. `self` is the site origin. */
export function allowsSource(source: string, origin: URL, self: URL): boolean {
  const s = source.toLowerCase();
  if (s === "*") return origin.protocol === "https:" || origin.protocol === "http:";
  if (s === "'self'") return origin.origin === self.origin;
  if (s.startsWith("'")) return false;
  if (/^[a-z][a-z0-9+.-]*:$/.test(s)) return origin.protocol === s || (s === "http:" && origin.protocol === "https:");
  const m = /^(?:([a-z][a-z0-9+.-]*):\/\/)?(\*\.)?([^/:]+|\*)(?::(\d+|\*))?(\/.*)?$/.exec(s);
  if (!m) return false;
  const [, scheme, wild, hostName, port] = m;
  if (scheme) {
    if (scheme + ":" !== origin.protocol && !(scheme === "http" && origin.protocol === "https:")) return false;
  } else if (origin.protocol !== self.protocol && !(self.protocol === "http:" && origin.protocol === "https:")) {
    return false;
  }
  const host = origin.hostname.toLowerCase();
  if (wild) {
    if (!host.endsWith("." + hostName)) return false;
  } else if (hostName !== "*" && host !== hostName) {
    return false;
  }
  const want = origin.port || (origin.protocol === "https:" ? "443" : "80");
  if (port === "*") return true;
  const have = port || (scheme === "http" ? "80" : scheme === "https" ? "443" : origin.protocol === "https:" ? "443" : "80");
  return want === have;
}

/** Check one policy for each needed directive. */
export function checkPolicy(policy: Policy, siteUrl: string, cloudOrigin: string): Check[] {
  const self = new URL(siteUrl);
  const origin = new URL(cloudOrigin);
  return (Object.keys(NEEDS) as Need[]).map((directive) => {
    const from = policy.has(directive) ? directive : policy.has("default-src") ? "default-src" : "";
    if (!from) return { directive, ok: true, from };
    const sources = policy.get(from)!;
    const keep = sources.filter((x) => x.toLowerCase() !== "'none'");
    const fix = (why: string, add: string[]): Check => ({
      directive,
      ok: false,
      from,
      why,
      line: [directive, ...keep, ...add.filter((a) => !keep.some((k) => k.toLowerCase() === a.toLowerCase()))].join(" "),
    });
    if (directive === "script-src" && sources.some((x) => x.toLowerCase() === "'strict-dynamic'")) {
      return fix("'strict-dynamic' ignores host sources. Load widget.js from a script tag with the page nonce.", [
        origin.origin,
      ]);
    }
    const hasOrigin = sources.some((x) => allowsSource(x, origin, self));
    const inline =
      directive !== "style-src" ||
      sources.some((x) => x.toLowerCase() === "'unsafe-inline'") ||
      (!policy.has("style-src") && !policy.has("default-src"));
    if (hasOrigin && inline) return { directive, ok: true, from };
    const add: string[] = [];
    if (!hasOrigin) add.push(origin.origin);
    if (!inline) add.push("'unsafe-inline'");
    const why = [
      !hasOrigin ? from + " does not allow " + origin.origin + " (" + NEEDS[directive] + ")" : "",
      !inline ? "the widget adds an inline style, so style-src needs 'unsafe-inline'" : "",
    ]
      .filter(Boolean)
      .join(". ");
    return fix(why + ".", add);
  });
}

/**
 * Fetch a page and report the CSP directives that block the widget.
 * The dashboard calls this with its own `fetchFn`. Never throws.
 */
export async function checkCsp(
  siteUrl: string,
  cloudOrigin: string,
  fetchFn: typeof fetch = fetch,
): Promise<CspReport> {
  const origin = new URL(cloudOrigin).origin;
  const report: CspReport = { site: siteUrl, origin, policies: [], checks: [], ok: true, lines: [] };
  let res: Response;
  try {
    res = await fetchFn(siteUrl, {
      redirect: "follow",
      headers: { accept: "text/html" },
      signal: AbortSignal.timeout(10_000),
    });
  } catch (err) {
    report.error = err instanceof Error ? err.message : String(err);
    report.ok = false;
    return report;
  }
  const page = res.url || siteUrl;
  const header = res.headers.get("content-security-policy");
  if (header) {
    /* Several headers arrive joined by a comma. Each one is a separate policy. */
    for (const text of header.split(",")) if (text.trim()) report.policies.push({ from: "header", text: text.trim() });
  }
  const html = await res.text().catch(() => "");
  for (const text of readMeta(html)) report.policies.push({ from: "meta", text });
  for (const p of report.policies) {
    for (const check of checkPolicy(parseCsp(p.text), page, origin)) {
      report.checks.push(check);
      if (!check.ok) {
        report.ok = false;
        if (check.line && !report.lines.includes(check.line)) report.lines.push(check.line);
      }
    }
  }
  return report;
}

/** Plain text report for the CLI. */
export function formatCsp(report: CspReport): string {
  const out: string[] = ["CSP check for " + report.site + " (agent origin " + report.origin + ")"];
  if (report.error) {
    out.push("  could not load the page: " + report.error);
    return out.join("\n");
  }
  if (!report.policies.length) {
    out.push("  no Content-Security-Policy found. The widget can load.");
    return out.join("\n");
  }
  for (const p of report.policies) out.push("  policy (" + p.from + "): " + p.text);
  for (const c of report.checks) {
    out.push("  " + (c.ok ? "ok     " : "BLOCKS ") + c.directive + (c.ok ? "" : "  " + (c.why ?? "")));
  }
  if (report.ok) out.push("  The widget can load.");
  else {
    out.push("", "Put these directives in the policy (replace the old directive line):");
    for (const line of report.lines) out.push("  " + line + ";");
  }
  return out.join("\n");
}
