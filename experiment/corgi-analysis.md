# Corgi pair — interview first, local corpus

Site: https://www.corgi.insure  
Latest run: 2026-09-08T02:12:48Z  
Branch: `cursor/live-pair-llms-e5be`  
Model: **openai** `gpt-5.6-luna` on both hosts  
Corpus: `corpus/corgi` (42 pages). Blog paths are omitted. The seller reads those files. It does not call Firecrawl at run time.

```
human ──POST /chat──► buyer (openai)
                         │ ask_peer
                         ▼
                      seller interviews ── note_visitor + site_lookup(files) + map_risks
```

## What ran

| Agent | Role | Bind | Model |
| --- | --- | --- | --- |
| Seller | Corgi sales run (`attachSales`, sales-v3) | `r1` | `openai` / gpt-5.6-luna |
| Buyer | Founder. `ask_peer` → seller `/chat` as a machine | `r2` | `openai` / gpt-5.6-luna |

| Metric | Value |
| --- | --- |
| Corpus pages | 42 (local files, no blogs) |
| Agent hops | 15 (2 human, 13 machine) |
| Peer calls | 3 |
| Live model calls | 11 |
| Turn wall time | 2.9 s, 7.5 s, 9.7 s |

## The three turns

**Turn 1 — “Hi. I need insurance for my startup.”**  
Seller did not dump the site. It asked: “What’s your startup’s company name?”  
Buyer quoted that question.

**Turn 2 — Maya Chen, founder of Northline, seed-stage SaaS, B2B analytics**  
Seller called tools, then wrote a personal report for **Maya Chen at Northline**: Seed pack (CGL, D&O, Tech E&O, Cyber), Intryc as the file-backed customer, no invented price on this turn.

**Turn 3 — data breach + outage, cost, Corgi or a broker**  
Seller stayed on Northline by name. It mapped the stated worries to Cyber and Tech E&O, used the file cost band **$2,000–$4,000 / year**, and recommended Corgi first unless contracts need unusual endorsements.

## What this proves

- Firecrawl ran once. The agent retrieves from `corpus/corgi/pages/*.md`.
- The conversation asks for company and founder before it recommends.
- The report uses those names. It is not a generic site dump.
- Buyer quotes the peer. It does not invent a company or a price.

```sh
export OPENAI_API_KEY=…
export OPENAI_MODEL=gpt-5.6-luna
bun experiment/run.ts --site https://www.corgi.insure --model openai --corpus corpus/corgi
```
