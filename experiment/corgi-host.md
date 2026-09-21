# Hosting the Corgi insurance advisor at corgi.agentnet.it.com

The Corgi agent runs on the same EC2 instance as the Composio agent,
in a **separate checkout** (`/opt/webagent-corgi`) so switching Corgi
does not move the live Composio branch. It binds port **8788**
(composio uses 8787). Nginx routes by `server_name`.

Live: `https://corgi.agentnet.it.com/`

## DNS

Cloudflare proxied A record:

```
corgi.agentnet.it.com  →  54.89.43.219  (proxied)
```

Cloudflare terminates HTTPS; nginx sees HTTP on port 80.

## Quick deploy (on the EC2 host)

```bash
# copies OPENAI_API_KEY from /opt/webagent/.env
curl -fsSL https://raw.githubusercontent.com/TheAgent-net/webagent/cursor/corgi-webagent-e5be/deploy/corgi-host.sh | bash
```

This installs bun, checks out the branch, starts `webagent-corgi.service` on port 8788.

## Add the nginx server block

```bash
cd /opt/webagent-corgi
bash deploy/corgi-front.sh
```

This appends a `server_name corgi.agentnet.it.com` block to the existing
nginx.conf and reloads. It does not touch `app.agentnet.market` or
`composio.agentnet.it.com`.

## Verify

```bash
# local
curl -sS http://127.0.0.1:8788/agent.json | jq .name
# via nginx
curl -sS http://127.0.0.1/agent.json -H "Host: corgi.agentnet.it.com" | jq .name
# public (after Cloudflare propagates)
curl -sS https://corgi.agentnet.it.com/agent.json | jq .name
```

Human URL: `https://corgi.agentnet.it.com/`
Machine: `POST https://corgi.agentnet.it.com/chat` with `{"text":"..."}` (reuse `session`).
Agent card: `https://corgi.agentnet.it.com/agent.json`
Connect prompt: `https://corgi.agentnet.it.com/llms.txt`

## Architecture

```
Cloudflare (HTTPS :443)
  → EC2 nginx (:80, server_name corgi.agentnet.it.com)
    → bun webagent corgi (:8788)
       ├── crawls www.corgi.insure on startup (40 pages)
       ├── attachSales: GEPA prompt + map_risks + quote_guide + site_lookup
       ├── human GET / → branded landing page + floating chat widget
       ├── machine GET / → agent card JSON
       ├── POST /chat → session-isolated sales conversation
       └── GET /llms.txt → one-step connect prompt for peer agents
```

## Coexistence with Composio agent

| | Composio | Corgi |
|---|---|---|
| Host | composio.agentnet.it.com | corgi.agentnet.it.com |
| Port | 8787 | 8788 |
| Service | webagent-apps.service | webagent-corgi.service |
| Checkout | /opt/webagent | /opt/webagent-corgi |
| Env file | /opt/webagent/.env | /opt/webagent-corgi/.env.corgi |
| Branch | cursor/a2a-simple-connect-e5be (live) | cursor/corgi-webagent-e5be |

Both use the same nginx container, different `server_name` blocks.
