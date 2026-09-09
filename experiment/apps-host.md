# Host the Composio agent on EC2

The process binds `0.0.0.0:8787`. systemd keeps it up. Put secrets in `/opt/webagent/.env`. Do not commit that file.

## On the instance

```sh
sudo mkdir -p /opt/webagent
# write OPENAI_API_KEY and WEBAGENT_PUBLIC_URL=http://<public-ip>:8787
sudo tee /opt/webagent/.env >/dev/null <<EOF
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-4o-mini
WEBAGENT_PUBLIC_URL=https://composio.agentnet.it.com
EOF
chmod 600 /opt/webagent/.env
curl -fsSL https://raw.githubusercontent.com/TheAgent-net/webagent/cursor/composio-agent-e5be/deploy/host.sh | bash
```

Open TCP **8787** on the security group. Do not bind 80 or 443 — AgentNet already uses those.

Host this agent used: `ec2-user@ec2-54-89-43-219.compute-1.amazonaws.com` (Amazon Linux 2023). `host.sh` uses `dnf` when `apt-get` is missing, and bun from `~/.bun/bin`.

Check:

```sh
curl -sS http://127.0.0.1:8787/agent.json
curl -sS -X POST http://127.0.0.1:8787/chat \
  -H 'content-type: application/json' \
  -d '{"text":"I need to email customers","from":"human"}'
```

Human URL: `https://composio.agentnet.it.com/`  
Machine: `POST https://composio.agentnet.it.com/chat` with `{"text":"..."}` (reuse `session`).

Port 8787 is bound on the instance. `deploy/front.sh` adds a dedicated nginx `server_name` for `composio.agentnet.it.com`. It does not change `app.agentnet.market`. Point a Cloudflare proxied A record at `54.89.43.219`. HTTPS is enabled only after Let's Encrypt issues a certificate (HTTP-01 via the ACME webroot); there is no self-signed fallback. Set `WEBAGENT_ACME_EMAIL` if you want a contact on the cert.

## From a laptop with SSH

```sh
WEBAGENT_HOST=ec2-user@ec2-54-89-43-219.compute-1.amazonaws.com \
WEBAGENT_SSH_KEY=~/.ssh/tejas.pem \
WEBAGENT_ENV=.env \
./deploy/push.sh
```
