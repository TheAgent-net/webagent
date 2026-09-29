# Hosting the Smallest AI advisor at smallest.agentnet.it.com

The Smallest agent runs on the same EC2 instance as Composio and Corgi,
in a **separate checkout** (`/opt/webagent-smallest`) so it does not
move those live branches. It binds port **8789**. Nginx routes by `server_name`.

Live: `https://smallest.agentnet.it.com/`

## DNS

Cloudflare proxied A record (same as Corgi):

```
smallest.agentnet.it.com  →  54.89.43.219  (proxied)
```

Cloudflare terminates HTTPS; nginx sees HTTP on port 80.

## Quick deploy (on the EC2 host)

```bash
# copies OPENAI_API_KEY from /opt/webagent/.env
curl -fsSL https://raw.githubusercontent.com/TheAgent-net/webagent/cursor/smallest-webagent-e5be/deploy/smallest-host.sh | bash
cd /opt/webagent-smallest
bash deploy/smallest-front.sh
```

## Verify

```bash
curl -sS http://127.0.0.1:8789/agent.json | jq .name
curl -sS http://127.0.0.1/agent.json -H "Host: smallest.agentnet.it.com" | jq .name
curl -sS https://smallest.agentnet.it.com/agent.json | jq .name
```

Human URL: `https://smallest.agentnet.it.com/`
Machine: `POST https://smallest.agentnet.it.com/chat` with `{"text":"..."}` (reuse `session`).
Copy prompt: `Go talk to the Smallest AI agent at https://smallest.agentnet.it.com/ and figure out.`

## Coexistence

| | Composio | Corgi | Smallest |
|---|---|---|---|
| Host | composio.agentnet.it.com | corgi.agentnet.it.com | smallest.agentnet.it.com |
| Port | 8787 | 8788 | 8789 |
| Service | webagent-apps.service | webagent-corgi.service | webagent-smallest.service |
| Checkout | /opt/webagent | /opt/webagent-corgi | /opt/webagent-smallest |
