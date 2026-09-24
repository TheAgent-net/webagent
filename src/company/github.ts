import type { GithubRepo } from "./types.ts";

const REPO_RE = /(?:https?:\/\/)?(?:www\.)?github\.com\/([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)/i;
const SHORT_RE = /^([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)$/;

export function parseGithubInput(input: string): { owner: string; name: string } | undefined {
  const trimmed = input.trim().replace(/\.git$/i, "").replace(/\/+$/, "");
  const full = REPO_RE.exec(trimmed);
  if (full) return { owner: full[1]!, name: full[2]!.replace(/\.git$/i, "") };
  const short = SHORT_RE.exec(trimmed);
  if (short && !trimmed.includes(".")) return { owner: short[1]!, name: short[2]! };
  return undefined;
}

export function isGithubInput(input: string): boolean {
  return Boolean(parseGithubInput(input));
}

export async function fetchGithubRepo(
  input: string,
  fetchFn: (input: string | URL | Request, init?: RequestInit) => Promise<Response> = fetch,
): Promise<GithubRepo> {
  const parsed = parseGithubInput(input);
  if (!parsed) throw new Error("not a github repo: " + input);
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "webagent-company/0.4",
  };
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (token) headers.Authorization = "Bearer " + token;

  const metaRes = await fetchFn(`https://api.github.com/repos/${parsed.owner}/${parsed.name}`, { headers });
  if (!metaRes.ok) throw new Error(`github repo ${metaRes.status}: ${(await metaRes.text()).slice(0, 240)}`);
  const meta = (await metaRes.json()) as {
    html_url?: string;
    description?: string;
    homepage?: string;
    topics?: string[];
    language?: string;
    stargazers_count?: number;
    owner?: { login?: string };
    name?: string;
  };

  let readme = "";
  try {
    const raw = await fetchFn(`https://api.github.com/repos/${parsed.owner}/${parsed.name}/readme`, {
      headers: { ...headers, Accept: "application/vnd.github.raw" },
    });
    if (raw.ok) readme = (await raw.text()).slice(0, 12000);
  } catch {
    /* optional */
  }

  const homepage = httpUrl(meta.homepage) || firstExternalUrl(readme);
  return {
    owner: meta.owner?.login || parsed.owner,
    name: meta.name || parsed.name,
    htmlUrl: meta.html_url || `https://github.com/${parsed.owner}/${parsed.name}`,
    description: (meta.description || "").trim(),
    homepage,
    topics: meta.topics ?? [],
    language: meta.language || undefined,
    stars: meta.stargazers_count ?? 0,
    readme,
  };
}

export function firstExternalUrl(md: string): string | undefined {
  const re = /https?:\/\/[^\s)<>"'`]+/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(md))) {
    const raw = m[0].replace(/[.,;:]+$/, "");
    try {
      const u = new URL(raw);
      if (/github\.com|githubusercontent\.com|shields\.io|badge|img\.shields/i.test(u.hostname)) continue;
      if (u.protocol !== "http:" && u.protocol !== "https:") continue;
      return u.origin + (u.pathname === "/" ? "" : u.pathname);
    } catch {
      /* skip */
    }
  }
  return undefined;
}

function httpUrl(s?: string): string | undefined {
  if (!s) return undefined;
  try {
    const u = new URL(s.startsWith("http") ? s : "https://" + s);
    if (u.protocol !== "http:" && u.protocol !== "https:") return undefined;
    return u.origin + (u.pathname === "/" ? "" : u.pathname);
  } catch {
    return undefined;
  }
}
