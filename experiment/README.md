# Pair experiment

Two public agents. One crawled site. One network report.

Story of the thread that built this: [CONVERSATION.md](../CONVERSATION.md). Live Corgi numbers: [corgi-analysis.md](corgi-analysis.md).

```sh
bun experiment/run.ts --site https://www.corgi.insure
```

| Agent | Role | Port (CLI default) |
| --- | --- | --- |
| Seller | Sales pack (`attachSales`): `map_risks` + pinpoint report | 8787 via `webagent pair` (0 in tests) |
| Buyer | Founder. Tool `ask_peer` → seller `/chat` as a machine | 8788 |

Model: `cursor` when `CURSOR_API_KEY` is set. Otherwise `script` (calls the same tools, no Cursor network).

Flags: `--site` `--max-pages` `--seller-port` `--buyer-port` `--model auto|cursor|script` `--out` `--keep`.

Composio Graph RAG (separate host): [composio.md](composio.md). `webagent apps`. EC2 host: [apps-host.md](apps-host.md).
