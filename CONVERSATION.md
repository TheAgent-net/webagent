# Conversation

This file is a readme of the Cursor cloud-agent thread that produced the pair experiment on this branch.

PR: https://github.com/TheAgent-net/webagent/pull/1  
Branch: `cursor/layered-cake-harness-a1aa`  
Site under test: https://www.corgi.insure

## What was asked

1. Test with **https://www.corgi.insure**.
2. Create **two separate agents**.
3. Power them with the **Cursor SDK** as the LLM (`@cursor/sdk`).
4. Produce a full **end-to-end experiment**: network, each agent’s output, analysis.

The harness rules from earlier in the same thread still apply: no slots, no Go port, loop stays generic, products sit on top, choosing a model is a control.

## What we built

Two public hosts. Two harnesses. One crawled site.

```
human ──POST /chat──► buyer :8788
                         │ ask_peer (machine JSON, x-agent)
                         ▼
                      seller :8787 ──site_lookup──► pack from corgi.insure
```

| Piece | Where | Job |
| --- | --- | --- |
| Cursor as a model | `src/cursor.ts` | `useModel("cursor")`. One `@cursor/sdk` `Agent.prompt` per reason step. Cursor tools stay empty. |
| Hop trace | `src/host/hop.ts` | Record method, path, kind (human vs machine), status, bytes, body clip. Do not read SSE. |
| Existing run on listen | `src/host/room.ts` | A site pack can be the public room. |
| Pair driver | `experiment/run.ts` | Crawl → two `listen()` ports → three founder turns → JSON + markdown report. |
| Script fallback | `experiment/script.ts` | Same tools as Cursor. Used when `CURSOR_API_KEY` is missing. |
| Peer tool | `experiment/peer.ts` | Buyer calls seller `/chat`. |
| Live report | `experiment/corgi-analysis.md` | Numbers from the Corgi run. |
| How to replay | `experiment/README.md` | Flags and ports. |

CLI:

```sh
bun src/cli.ts pair https://www.corgi.insure
# or
bun experiment/run.ts --site https://www.corgi.insure --keep
```

## What we ran

Live crawl of corgi.insure, then the pair, on this VM.

| Metric | Result |
| --- | --- |
| Pages | 40 (cap) |
| Crawl hops | 44, all HTTP 200 |
| Crawl time | about 2–5 s |
| Seller | `http://127.0.0.1:8787` run `r1` |
| Buyer | `http://127.0.0.1:8788` run `r2` |
| Agent hops | 15 (2 human, 13 machine) |
| Peer calls | 3 |
| Local turn time | 1–5 ms (no LLM) |
| Model used | `script` |

`robots.txt` on Corgi blocks `/studio`, `/api/`, and **`/instant-quote`**. The pack can talk about quotes. It cannot walk the quote form.

Human `GET /` is the chat page. Machine `GET /` or `/agent.json` is the card (`type: webagent`, `mcp`, `chat`, `live`, `runId`, protocol `2025-06-18`).

## Cursor SDK

The SDK is a dependency (`@cursor/sdk@1.0.30`). `defaultHarness()` always lists `cursor`. Ready only when `CURSOR_API_KEY` is set. Fail closed otherwise.

On this VM:

| Probe | Result |
| --- | --- |
| `CURSOR_API_KEY` | unset |
| Listed model | `cursor`, not ready, `missing CURSOR_API_KEY` |
| `Agent.prompt` without a model id | error: local agents require `model: { id }` |
| `Agent.prompt` + `composer-2.5` | 15.6 s, then `Invalid User API Key` |

The pair still ran so we could measure crawl, hops, and tool I/O. To power both agents with Cursor:

```sh
export CURSOR_API_KEY=…
bun experiment/run.ts --site https://www.corgi.insure --model cursor
```

## The three turns

Human text went to the **buyer**. Buyer called **seller**. Seller searched the pack.

1. *I am a seed-stage SaaS founder. What coverage do I need and what does it cost?*  
   Hits: home (full-stack, speed to founders), partnerships, **cost by stage**, D&O blog.
2. *How fast can I get a quote compared to a broker?*  
   Hits: “Get a quote in minutes”, underwrite directly, book-a-demo.
3. *Should I buy from Corgi or keep a traditional broker?*  
   Hits: AI insurance page, Series B press, **Corgi vs Vouch** (Vouch as a broker to other carriers), cost by stage again.

The script buyer prefixes `Corgi agent said:` and relays snippets. It does not write a founder recommendation. That is the Cursor step.

The crawled cost page (not invented) states typical annual packages: about **$2k–$4k** early, **$10k–$25k** next stage, **$30k–$100k+** at scale. Press pages also mention a **$160M** Series B. The script model did not invent a premium (`sellerMayInventPrice: false`). Nav chrome on the Next.js HTML still leaked into some snippets.

## Fixes during the run

1. `site_lookup` first required the whole query as one substring, then ranked by any token and always hit the first nav pages. It now **scores words** and takes a snippet near a later match.
2. The script model reused an old tool result on later turns. It now treats a tool reply only when that message is **last**.
3. Flow infer gained a **quote** kind so insurance sites get “how do I get a quote?”.

## Tests

`bun test` — 45 pass. New coverage: `test/cursor.test.ts`, `test/pair.test.ts`, hop recording on `listen`, ranked `site_lookup` on the mock airline site.

## What this conversation did not ship

- Phone number or React embed (called out as not built earlier).
- A live Cursor-composed dialogue (no usable key on the VM).
- A completed instant quote (robots block `/instant-quote`).

## Read next

- Product front door: [README.md](README.md)
- Live numbers: [experiment/corgi-analysis.md](experiment/corgi-analysis.md)
- Replay flags: [experiment/README.md](experiment/README.md)
