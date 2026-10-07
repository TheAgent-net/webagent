# Corgi pair — end-to-end report

Site: https://www.corgi.insure  
Run: 2026-09-02T23:07:45Z (repeat after lookup rank)  
Branch: `cursor/layered-cake-harness-a1aa`

## What ran

Two **separate** webagent hosts. Same public controls. The loop did not change.

| Agent | Role | Bind | URL |
| --- | --- | --- | --- |
| Seller | Public Corgi agent. Pack from a same-origin crawl. Tools: `site_lookup`, `flow_*` | `r1` | `http://127.0.0.1:8787` |
| Buyer | Founder. Tool `ask_peer` posts to seller `/chat` as a machine (`x-agent: buyer`) | `r2` | `http://127.0.0.1:8788` |

A human browser on `/` gets the chat page. A machine (`Accept: application/json`, curl, `x-agent`) gets `/agent.json` and `/mcp`. Both sides share one `Room` per host.

```
human ──POST /chat──► buyer (8788)
                         │
                         │ ask_peer
                         ▼
                      seller (8787) ──site_lookup──► crawled pack (corgi.insure)
```

## Cursor SDK (LLM control)

`cursorModel` is a `useModel` control (`src/cursor.ts`). Each reason step calls `@cursor/sdk` `Agent.prompt` with Cursor tools **empty**. Webagent still owns `site_lookup` / `ask_peer`.

| Check | Result |
| --- | --- |
| `CURSOR_API_KEY` in this VM | unset |
| `defaultHarness()` lists `cursor` | yes, `ready: false`, reason `missing CURSOR_API_KEY` |
| Pair model used | `script` (same tools, no Cursor network) |
| Direct `Agent.prompt` without model | `Local SDK agents require an explicit model` |
| Direct `Agent.prompt` + `composer-2.5` | 15.6s then `{ status: "error", error: "Invalid User API Key" }` |

Fail closed is correct. Set `CURSOR_API_KEY` and re-run:

```sh
export CURSOR_API_KEY=…
bun experiment/run.ts --site https://www.corgi.insure --model cursor
```

## Site ingest (live)

| Metric | Value |
| --- | --- |
| Origin | `https://www.corgi.insure` |
| Pages kept | 40 (cap) |
| Crawl hops | 44 (robots + two sitemaps + pages) |
| HTTP status | **44 × 200** |
| Wall time | 2.1–5.0 s |
| Slowest page | `/customers/intryc` 327 ms; `/sitemap.xml` 284 ms |
| Flows inferred | search, browse, account, checkout, change, support, **quote** |
| Auth wall | none on the public set |
| `robots.txt` | `Disallow: /studio`, `/api/`, **`/instant-quote`** |

The quote form itself is blocked for crawlers. The pack can talk about quotes. It cannot walk the live quote API.

Homepage extract (public copy):

- “Business Insurance at the Speed of Compute.”
- “Get a quote in minutes.”
- Packages: Pre-Seed & Seed (CGL, D&O, Tech E&O, Cyber); Series A (+ Media, EPLI); Growth (+ Fiduciary); Custom (+ HNOA).
- Contrast with “legacy” carriers: broker review, quote adjustment, manual risk audit, underwriting 3+ days.

Cost page (`/blog/startup-insurance-cost-by-stage`) is in the 40-page set. The HTML on that page (not invented) states typical annual packages:

- Eligible pre-revenue / early-revenue: **$2,000–$4,000** for ~$1M limits on the core stack
- Next stage (EPLI / more D&O): **$10,000–$25,000+** (D&O alone often **$5,000–$10,000**)
- Scale: **$30,000–$100,000+**, limits often **$5M+**

Press pages also state **$160M Series B** and **$1.3B / $2.6B** valuation. Those are company-finance numbers, not premiums. The script model did **not** invent a premium dollar figure (`sellerMayInventPrice: false`). Its snippets ranked the cost page but still opened on nav chrome, so those $2k–$4k lines did not appear in the relayed text. That is the Cursor step.

## Turns (human → buyer → seller)

Script model: buyer always calls `ask_peer`; seller always calls `site_lookup`; each quotes the peer / the hits. Three peer POSTs. Round trip **1–5 ms** on localhost (no LLM).

**Turn 1 — “seed-stage SaaS… coverage… cost?”**  
Seller hits: home (full-stack, pass speed to founders), partnerships (partner cost FAQ), **Cost by Stage** (Old Models Fail / Coverage Stack / Lower Premiums / Corgi vs Brokers), D&O blog (defence costs).  
Buyer: prefixed `Corgi agent said:` and relayed the same text.

**Turn 2 — “How fast vs a broker?”**  
Seller hits: home (“No confusion, no waiting. Get a quote in minutes.”), partnerships (underwrite directly, reduce broker friction), blog, book-a-demo.  
Buyer: relayed.

**Turn 3 — “Corgi or a traditional broker?”**  
Seller hits: AI insurance (enterprise coverage language), Series B press, **Corgi vs Vouch** (Vouch described as a broker to other carriers), Cost by Stage again.  
Buyer: relayed.

With `CURSOR_API_KEY` the same hops run; the text would be a composed answer instead of raw snippets.

## Network (agent hosts)

| Kind | Method | Path | Status | Bytes |
| --- | --- | --- | --- | --- |
| human | GET | seller `/` | 200 | 1856 |
| machine | GET | seller `/agent.json` | 200 | 192 |
| machine | GET | seller `/who` | 200 | 31 |
| human | GET | buyer `/` | 200 | 1856 |
| machine | GET | buyer `/agent.json` | 200 | 192 |
| machine | GET | buyer `/who` | 200 | 31 |
| machine | POST | seller `/chat` ×3 | 200 | ~1.4–1.5 KB |
| machine | POST | peer `/chat` ×3 | 200 | same bodies (buyer→seller) |
| machine | POST | buyer `/chat` ×3 | 200 | ~1.4–1.6 KB |

Kinds: **2 human, 13 machine**. Detect is correct: Mozilla + `Sec-Fetch-Dest: document` → human; curl / `x-agent` / JSON → machine.

Crawl network is **outbound to corgi.insure** (44 GETs). Agent network is **localhost only**.

## Gaps

1. **No usable Cursor key** in this VM. SDK is installed (`@cursor/sdk@1.0.30`). Inference did not run.
2. **Next.js chrome** is in the HTML (nav, Material icons). Snippets still pick up some of it. Rank + later-match helps; a real LLM would filter it.
3. **`/instant-quote` is robots-disallowed.** The public agent cannot complete a purchase from the crawl.
4. **Generic flow names** (checkout, change) come from the airline-oriented infer list plus a new `quote` kind. The pack still answers insurance questions via `site_lookup`.
5. Script buyer **relays** seller text. It does not write a founder recommendation. That is the Cursor step.

## Replay

```sh
bun test
bun experiment/run.ts --site https://www.corgi.insure
# hosts: bun src/cli.ts pair https://www.corgi.insure --keep
```

Human: open seller `:8787` and buyer `:8788`.  
Machine: `curl -s localhost:8787/agent.json`.
