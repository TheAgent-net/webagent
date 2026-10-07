import { crawlSite, type CrawlState } from "../site/crawl.ts";
import { buildPack } from "../site/pack.ts";
import type { PageShot } from "../site/types.ts";
import { inferFormWalks } from "./forms.ts";
import { fetchGithubRepo, isGithubInput } from "./github.ts";
import { deriveProfile } from "./profile.ts";
import type { BuildCompanyOpts, CompanyPack, GithubRepo } from "./types.ts";

/** Website URL or GitHub repo → crawled pack, form walks, and a company profile. */
export async function buildCompany(input: string, opts: BuildCompanyOpts = {}): Promise<CompanyPack> {
  const fetchFn = (opts.fetch ?? fetch) as typeof fetch;
  const maxPages = opts.maxPages ?? 80;
  let github: GithubRepo | undefined;
  let start = input.trim();

  if (isGithubInput(start)) {
    github = await fetchGithubRepo(start, fetchFn);
    start = github.homepage || github.htmlUrl;
  } else if (!/^https?:\/\//i.test(start)) {
    start = "https://" + start;
  }

  let state: CrawlState;
  try {
    state = await crawlSite(start, { maxPages, fetch: fetchFn });
  } catch {
    state = emptyState(start);
  }

  if (github) {
    if (!state.pages.some((p) => p.url === github.htmlUrl)) state.pages.unshift(githubPage(github));
    if (!state.origin || /github\.com$/i.test(new URL(state.origin).hostname)) {
      state.origin = github.homepage || github.htmlUrl;
    }
  }

  const site = buildPack(state);
  const forms = inferFormWalks(site.pages);
  const profile = deriveProfile(site, github, forms);
  return { profile, site, forms, github, pages: site.pages, flows: site.flows };
}

function emptyState(start: string): CrawlState {
  let origin = start;
  try {
    origin = new URL(start).origin;
  } catch {
    origin = start;
  }
  return { origin, pages: [], pending: [], seen: new Set(), cookies: "" };
}

function githubPage(repo: GithubRepo): PageShot {
  return {
    url: repo.htmlUrl,
    status: 200,
    title: repo.owner + "/" + repo.name,
    description: repo.description,
    headings: [repo.name, ...repo.topics.slice(0, 6)],
    text: [repo.description, repo.readme.replace(/[#*`[\]]/g, " ").slice(0, 2500)].filter(Boolean).join(" "),
    links: repo.homepage ? [repo.homepage] : [],
    forms: [],
    gated: false,
  };
}
