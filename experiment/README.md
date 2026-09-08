# Pair experiment

Two public agents. One crawled site. One network report.

Buyer and seller are **separate harnesses**. Each binds a live LLM. There is no script model.

Story of the first thread: [CONVERSATION.md](../CONVERSATION.md). Live Corgi numbers: [corgi-analysis.md](corgi-analysis.md).

```sh
# one-shot scrape (needs FIRECRAWL_API_KEY). Agent later reads files only.
bun experiment/scrape.ts https://www.corgi.insure corpus/corgi
bun experiment/run.ts --site https://www.corgi.insure --model live --corpus corpus/corgi
```

| Agent | Role | Port (CLI default) |
| --- | --- | --- |
| Seller | Sales pack (`attachSales`): interview, `note_visitor`, file `site_lookup`, `map_risks` | 8787 via `webagent pair` (0 in tests) |
| Buyer | Founder. Tool `ask_peer` → seller `/chat` as a machine | 8788 |

| `--model` | Bind |
| --- | --- |
| `live` / `auto` | First ready of `cursor`, `openai`, `openrouter`, `ollama`. Throw if none. |
| `cursor` / `openai` / `openrouter` / `ollama` | That id. Fail closed if it is not ready. |

Flags: `--site` `--corpus` `--max-pages` `--seller-port` `--buyer-port` `--model` `--out` `--keep`.

When `--site` is corgi.insure and `corpus/corgi` exists, the pair loads those files. It does not crawl or call Firecrawl.

The seller closer is a short personal readme (`map_risks` → `reportText`). Sample: [northline-brief.md](northline-brief.md). GEPA table: [gepa/result.md](gepa/result.md).
