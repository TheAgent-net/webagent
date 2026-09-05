# Pair experiment

Two public agents. One crawled site. One network report.

Story of the thread that built this: [CONVERSATION.md](../CONVERSATION.md). Live Corgi numbers: [corgi-analysis.md](corgi-analysis.md).

```sh
bun experiment/run.ts --site https://www.corgi.insure
```

| Agent | Role | Port (CLI default) |
| --- | --- | --- |
| Seller | Site pack from the URL. `site_lookup` + flows | 8787 via `webagent pair` (0 in tests) |
| Buyer | Founder. Tool `ask_peer` → seller `/chat` as a machine | 8788 |

Model: `cursor` when `CURSOR_API_KEY` is set. Otherwise `script` (calls the same tools, no Cursor network).

Flags: `--site` `--max-pages` `--seller-port` `--buyer-port` `--model auto|cursor|script` `--out` `--keep`.
