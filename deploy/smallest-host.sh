#!/usr/bin/env bash
# Run on the EC2 host. Installs Smallest in /opt/webagent-smallest so
# Composio (/opt/webagent :8787) and Corgi (/opt/webagent-corgi :8788) keep running.
set -euo pipefail

ROOT="${WEBAGENT_ROOT:-/opt/webagent-smallest}"
BRANCH="${WEBAGENT_BRANCH:-cursor/smallest-chat-ui-e5be}"
REPO="${WEBAGENT_REPO:-https://github.com/TheAgent-net/webagent.git}"
PORT="${WEBAGENT_SMALLEST_PORT:-8789}"
ENV_SRC="${WEBAGENT_ENV_SRC:-/opt/webagent/.env}"
PUBLIC_URL="${WEBAGENT_PUBLIC_URL:-https://smallest.agentnet.it.com}"
BUN_BIN="${WEBAGENT_BUN:-$HOME/.bun/bin/bun}"

if [ ! -x "$BUN_BIN" ] && [ -x /usr/local/bin/bun ]; then
  BUN_BIN=/usr/local/bin/bun
fi
if [ ! -x "$BUN_BIN" ]; then
  curl -fsSL https://bun.sh/install | bash
  BUN_BIN="$HOME/.bun/bin/bun"
fi
export PATH="$(dirname "$BUN_BIN"):$PATH"

sudo mkdir -p "$ROOT"
sudo chown "$(id -un):$(id -gn)" "$ROOT"
if [ ! -d "$ROOT/.git" ]; then
  git clone --branch "$BRANCH" --single-branch "$REPO" "$ROOT"
fi
cd "$ROOT"
git fetch origin "$BRANCH"
git checkout "$BRANCH"
git pull --ff-only origin "$BRANCH"
bun install

if [ ! -f "$ROOT/.env.smallest" ]; then
  if [ -f "$ENV_SRC" ]; then
    cp "$ENV_SRC" "$ROOT/.env.smallest"
    chmod 600 "$ROOT/.env.smallest"
  else
    echo "missing $ENV_SRC — write OPENAI_API_KEY into $ROOT/.env.smallest and rerun"
    exit 1
  fi
fi
if grep -q "^WEBAGENT_PUBLIC_URL=" "$ROOT/.env.smallest"; then
  sed -i "s|^WEBAGENT_PUBLIC_URL=.*|WEBAGENT_PUBLIC_URL=$PUBLIC_URL|" "$ROOT/.env.smallest"
else
  echo "WEBAGENT_PUBLIC_URL=$PUBLIC_URL" >> "$ROOT/.env.smallest"
fi
# Always pin GPT-6 Astra. Copied Composio .env often has OPENAI_MODEL=gpt-4o-mini.
if grep -q "^OPENAI_MODEL=" "$ROOT/.env.smallest"; then
  sed -i "s|^OPENAI_MODEL=.*|OPENAI_MODEL=gpt-6-astra|" "$ROOT/.env.smallest"
else
  echo "OPENAI_MODEL=gpt-6-astra" >> "$ROOT/.env.smallest"
fi

sudo tee /etc/systemd/system/webagent-smallest.service >/dev/null <<EOF
[Unit]
Description=Smallest AI settings advisor webagent
After=network.target

[Service]
Type=simple
User=$(id -un)
WorkingDirectory=$ROOT
Environment=PATH=$(dirname "$BUN_BIN"):/usr/local/bin:/usr/bin
EnvironmentFile=-$ROOT/.env.smallest
Environment=OPENAI_MODEL=gpt-6-astra
ExecStart=$BUN_BIN src/cli.ts smallest :$PORT
Restart=on-failure
RestartSec=3
TimeoutStopSec=20

[Install]
WantedBy=multi-user.target
EOF
sudo systemctl daemon-reload
sudo systemctl enable --now webagent-smallest
sudo systemctl restart webagent-smallest
sleep 3
sudo systemctl --no-pager --full status webagent-smallest || true
curl -sS "http://127.0.0.1:${PORT}/agent.json"
echo
