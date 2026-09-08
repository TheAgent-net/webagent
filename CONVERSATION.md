# Conversation

This file is a readme of the cloud-agent threads on the Corgi pair.

Site under test: https://www.corgi.insure

## This thread — interview first, local corpus

Ask: scrape Corgi with Firecrawl, store files, retrieve from those files (no API at run time). The seller must interview the incoming agent first (company, founder, field, risks) and then recommend something personal.

What changed:

- One-shot scrape: `bun experiment/scrape.ts` → `corpus/corgi` (42 pages). Blog paths are omitted.
- `site_lookup` reads those files. The pair does not call Firecrawl.
- Sales prompt **sales-v3** (GEPA winner): ask company name and founder name first.
- `note_visitor` saves those facts. `map_risks` puts them on the report.

What ran on 2026-09-08 with **openai / gpt-5.6-luna**:

| | |
| --- | --- |
| Corpus | 42 local pages (no blogs) |
| Peer calls | 3 |
| Turn 1 | Seller asked for the company name |
| Turn 2 | Report for Maya Chen / Northline, Seed pack, Intryc |
| Turn 3 | Cyber + Tech E&O for the stated worries, $2k–$4k, Corgi first |

Full transcript: [experiment/corgi-analysis.md](experiment/corgi-analysis.md).

```sh
export OPENAI_API_KEY=…
export OPENAI_MODEL=gpt-5.6-luna
bun experiment/run.ts --site https://www.corgi.insure --model openai --corpus corpus/corgi
```

## Earlier — GPT-5.6 Luna pair (site crawl)

Same three founder turns, but the seller jumped to a report from a live crawl. No interview. See the git history of this file.

## Earlier — GPT-4o mini pair

`openai` became a live model. Default `gpt-4o-mini`. No script model.

## Earlier thread — pair harness

PR: https://github.com/TheAgent-net/webagent/pull/1  
Branch: `cursor/layered-cake-harness-a1aa`

That thread built two hosts, hop traces, and the pair driver.
