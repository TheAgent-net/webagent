# Hosted cloud

One service hosts the webagent for many companies. Each company is a **tenant**. Each tenant has one **pack** folder.

## Architecture

```text
 visitor browser            AI assistant / crawler
   │  <script src=…/t/acme/widget.js>   │  POST /t/acme/chat
   ▼                                     ▼
 Cloudflare (TLS, cache, WAF)
   │
   ▼
 nginx :80/443   deploy/nginx-cloud.conf
   │  SSE /live: no buffering, long read time
   ▼
 bun src/cli.ts cloud :8790   deploy/cloud.service
   │
   ├─ service routes (/admin, /health)
   ├─ /t/<id>/…  ──────────────┐
   ├─ custom domain → tenant ──┤
   │                           ▼
   │                  Tenants (src/host/tenant.ts)
   │                    open on first request, keep warm, close the oldest past WEBAGENT_TENANT_CAP
   │                           │
   │                           ▼
   │                  readyPack(packs/<id>)  → Harness + Run + docs_lookup
   │                           │
   │                           ├─ content.json  stored pages (no crawl at open)
   │                           ├─ retrieve-cache.json  chunk embeddings
   │                           └─ retrieval provider: local (BM25 + embeddings) or Supermemory
   │
   ├─ Store (SQLite, WEBAGENT_DB): tenants, conversations, turns, events, feedback
   └─ refresh loop (WEBAGENT_REFRESH_HOURS): one tenant at a time
```

## Routes per tenant

Every route of a single pack host works under `/t/<id>`. A custom domain gets the same routes with no prefix.

| Route | Purpose |
| --- | --- |
| `GET /t/<id>/` | Preview page. A person talks to the agent here. |
| `GET /t/<id>/widget.js` | The widget script. The company pastes one tag for it. |
| `POST /t/<id>/chat` | One question, one reply. Body: `{"text": "…", "session": "…"}`. |
| `GET /t/<id>/chat` | How to use the chat route. |
| `GET /t/<id>/live` | Server-sent events for one session. |
| `POST /t/<id>/session` | Open a session. |
| `GET /t/<id>/llms.txt` | Text for AI agents: how to connect. |
| `GET /t/<id>/agent.json` | Agent card. Also `/.well-known/agent-card.json`. |
| `GET /t/<id>/visuals/…` | Captured site visuals. |
| `GET /health` | Service health and tenant count. |

## Store tables

The store is SQLite. The file is `WEBAGENT_DB`. See `src/store/sqlite.ts`.

| Table | Holds |
| --- | --- |
| `tenants` | Id, name, pack folder, custom domains, allowed origins, settings (JSON). |
| `conversations` | One row per chat session: channel, visitor kind, agent family, label, handoff. |
| `turns` | One row per question and reply, with reply time. |
| `events` | Traffic signals. The IP is a salted hash. The raw IP is never stored. |
| `feedback` | Up and down votes with an optional note. |

The refresh job writes its last result to `tenants.settings.refresh`.

## Jobs

### Refresh

Refresh keeps a pack current with its site. Code: `src/pack/refresh.ts`.

1. Fetch the site again: sitemap, links, and `llms.txt`.
2. Compare a hash of each page with the hash in `content.json`.
3. When no page changed, stop. Write nothing.
4. When pages changed, write the pages, rebuild the chunks, and embed only new chunk text. The embedding cache holds the rest.
5. Capture visuals again only for changed pages. This needs Chromium. Without Chromium, the old visuals stay.
6. When the pack uses Supermemory, send the changed pages. The first refresh sends all pages.
7. Reload the tenant. The next request opens the new pack.

Only one refresh runs at a time in one process. A failed fetch keeps the old content. Refresh skips a pack that has its own `build.ts`, because that pack loads its own pages.

- Run it once: `bun src/cli.ts refresh --tenant <id> --db <file>`.
- Run it on a timer: set `WEBAGENT_REFRESH_HOURS` (for example `24`). Default `0` means off.

The CLI refresh runs in its own process. It cannot reload a tenant in the running service. Restart the service, or use the timer in the service.

### Retrieval provider

`docs_lookup` asks a retrieval provider for passages. Code: `src/retrieve/provider.ts`.

| Provider | Config | Notes |
| --- | --- | --- |
| `local` | default | BM25 plus OpenAI embeddings over the pack chunks. Lexical only without `OPENAI_API_KEY`. |
| `supermemory` | `"retrieval": {"provider": "supermemory"}` | Hosted Supermemory API. One container tag per tenant. |

Set the provider in `pack.json`:

```json
{ "retrieval": { "provider": "supermemory", "containerTag": "webagent-acme" } }
```

- The default container tag is `webagent-<pack id>`.
- The key comes only from `SUPERMEMORY_API_KEY`. Do not put it in `pack.json`.
- Without the key, the pack uses local search. The service warns once per pack.
- When a Supermemory search fails, `docs_lookup` uses local search for that question.
- Run `refresh` once after you set the provider. It sends the pages to Supermemory.

## Environment variables

Put these in `/opt/webagent-cloud/.env.cloud`. Do not commit this file. Do not paste the values in chat or logs.

| Variable | Purpose | Default |
| --- | --- | --- |
| `OPENAI_API_KEY` | Model replies and embeddings. Without it, replies echo. | unset |
| `WEBAGENT_PUBLIC_URL` | Public base URL, for example `https://cloud.agentnet.it.com`. Used in snippets and links. | from the request |
| `WEBAGENT_DB` | SQLite file. | `data/webagent.db` |
| `WEBAGENT_ADMIN_KEY` | Key for the `/admin` dashboard. | unset |
| `WEBAGENT_SESSION_SECRET` | Signs dashboard sessions. Use a long random value. | unset |
| `WEBAGENT_IP_SALT` | Salt for the IP hash in `events`. Use a long random value. | `webagent` |
| `SUPERMEMORY_API_KEY` | Key for the Supermemory provider. | unset |
| `WEBAGENT_REFRESH_HOURS` | Hours between refresh passes. `0` is off. | `0` |
| `WEBAGENT_TENANT_CAP` | Most tenants open at once. | `32` |
| `WEBAGENT_MAIL_WEBHOOK` | Webhook that sends handoff mail. | unset |
| `WEBAGENT_MAX_PAGES` | Most pages per crawl. | `80` (onboard), `220` (open) |
| `WEBAGENT_CHROME` | Chromium path for visual capture. | auto |

## Add a tenant

Onboard does all steps in one command:

```sh
bun src/cli.ts onboard https://acme.com --id acme \
  --name "Acme" --domain agent.acme.com --origin https://acme.com \
  --packs /opt/webagent-cloud/packs --db /opt/webagent-cloud/data/webagent.db
```

1. It builds the pack in `packs/acme`: brand, hints, `content.json`, `evals.json`.
2. It captures visuals when Chromium is available. Add `--no-visuals` to skip.
3. It adds the tenant to the store.
4. It prints the preview URL, the script tag, the CSP lines, the `llms.txt` line, and the company checklist.

The running service opens the new tenant on its first request. You do not need a restart.

Other commands:

- `bun src/cli.ts tenant add <id> --pack <dir> [--domain a,b] [--origin https://x]` adds a pack you built yourself.
- `bun src/cli.ts tenant list` lists the tenants.
- The service adds each folder in `--packs` that has a `pack.json` when it starts.

Then send the company [onboarding.md](onboarding.md) and [facts-sheet.md](facts-sheet.md).

## Run locally

```sh
bun install
bun src/cli.ts onboard https://example.com --id demo --no-visuals --db data/local.db
bun src/cli.ts cloud :8790 --packs packs --db data/local.db
open http://127.0.0.1:8790/t/demo/
```

Without `OPENAI_API_KEY`, the agent echoes. Set the key for real replies.

## Deploy

The host is EC2 with nginx and systemd. Cloudflare is in front.

1. Point the DNS name (for example `cloud.agentnet.it.com`) to the host in Cloudflare. Turn on the proxy.
2. On the host, run:

   ```sh
   WEBAGENT_BRANCH=<branch> bash deploy/cloud.sh
   ```

   The first run writes `/opt/webagent-cloud/.env.cloud` and stops. Fill the file. Run the script again.
3. Install nginx once: `WEBAGENT_NGINX=1 WEBAGENT_BRANCH=<branch> bash deploy/cloud.sh`.
4. Add each custom domain to `server_name` in `deploy/nginx-cloud.conf`.

The script is safe to run again. It pulls the branch, runs `bun install`, restarts `webagent-cloud`, and checks `/health`. On failure, it prints the last journal lines.

### Move the Supermemory site into the cloud

The Supermemory agent now runs alone: folder `/opt/webagent-supermemory`, service `webagent-supermemory` on `:8791`, host `supermemory.agentnet.it.com`. Move it into the cloud as tenant `supermemory`. Existing embeds keep working because the domain maps to the tenant with no prefix.

1. Deploy the cloud (see above).
2. Copy the pack:

   ```sh
   cp -r /opt/webagent-supermemory/packs/supermemory /opt/webagent-cloud/packs/supermemory
   ```

3. Add the tenant with the old host name:

   ```sh
   cd /opt/webagent-cloud
   bun src/cli.ts tenant add supermemory --pack packs/supermemory \
     --domain supermemory.agentnet.it.com --db data/webagent.db
   ```

4. Check it on the local port:

   ```sh
   curl -s -H 'Host: supermemory.agentnet.it.com' http://127.0.0.1:8790/agent.json
   curl -s -H 'Host: supermemory.agentnet.it.com' http://127.0.0.1:8790/widget.js | head -c 200
   ```

5. In nginx, remove the old `supermemory.agentnet.it.com` server block. Keep the name in `server_name` of `nginx-cloud.conf`. Run `sudo nginx -t && sudo systemctl reload nginx`.
6. Stop the old service:

   ```sh
   sudo systemctl disable --now webagent-supermemory
   ```

7. Keep `/opt/webagent-supermemory` for one week. Then remove it.

The old URLs (`https://supermemory.agentnet.it.com/widget.js`, `/chat`, `/live`) keep working. The new URLs under `https://cloud.agentnet.it.com/t/supermemory/` also work.

To roll back, start `webagent-supermemory` again and restore its nginx server block.
