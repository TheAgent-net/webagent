# Hosting the supermemory advisor at supermemory.agentnet.it.com

The SuperMemory agent runs on the same EC2 instance as Composio, Corgi, and
Smallest, in a **separate checkout** (`/opt/webagent-supermemory`) so it does
not move those live branches. It binds port **8791**. Nginx routes by `server_name`.

Live: `https://supermemory.agentnet.it.com/`

Model: **gpt-6-astra** (pinned in the SuperMemory pack). A copied Composio `.env`
must not switch it to `gpt-4o-mini`.

## DNS

Cloudflare proxied A record (same as Smallest / Corgi):

```
supermemory.agentnet.it.com  →  54.89.43.219  (proxied)
```

Cloudflare terminates HTTPS; nginx sees HTTP on port 80.

## Quick deploy (on the EC2 host)

```bash
# copies OPENAI_API_KEY from /opt/webagent/.env
WEBAGENT_BRANCH=cursor/supermemory-pack-e5be bash deploy/supermemory-host.sh
bash deploy/supermemory-front.sh
```

## Verify

```bash
curl -sS http://127.0.0.1:8791/agent.json | jq .name
curl -sS http://127.0.0.1/agent.json -H "Host: supermemory.agentnet.it.com" | jq .name
curl -sS https://supermemory.agentnet.it.com/agent.json | jq .name
```

Human URL: `https://supermemory.agentnet.it.com/`
Machine: `POST https://supermemory.agentnet.it.com/chat` with `{"text":"...","session":"..."}`. GET `/chat` only returns how-to JSON — it does not start a run.

## Coexistence

| | Composio | Corgi | Smallest | SuperMemory |
|---|---|---|---|---|
| Host | composio.agentnet.it.com | corgi.agentnet.it.com | smallest.agentnet.it.com | supermemory.agentnet.it.com |
| Port | 8787 | 8788 | 8789 | 8791 |
| Service | webagent-apps.service | webagent-corgi.service | webagent-smallest.service | webagent-supermemory.service |
| Checkout | /opt/webagent | /opt/webagent-corgi | /opt/webagent-smallest | /opt/webagent-supermemory |
