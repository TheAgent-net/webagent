#!/usr/bin/env bash
# Run this on the EC2 host. Installs Corgi in /opt/webagent-corgi so the
# Composio agent at /opt/webagent (port 8787) keeps running.
set -euo pipefail

ROOT="${WEBAGENT_ROOT:-/opt/webagent-corgi}"
BRANCH="${WEBAGENT_BRANCH:-cursor/corgi-webagent-e5be}"
REPO="${WEBAGENT_REPO:-https://github.com/TheAgent-net/webagent.git}"
PORT="${WEBAGENT_CORGI_PORT:-8788}"
ENV_SRC="${WEBAGENT_ENV_SRC:-/opt/webagent/.env}"
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

if [ ! -f "$ROOT/.env.corgi" ]; then
  if [ -f "$ENV_SRC" ]; then
    cp "$ENV_SRC" "$ROOT/.env.corgi"
    chmod 600 "$ROOT/.env.corgi"
  else
    echo "missing $ENV_SRC — write OPENAI_API_KEY into $ROOT/.env.corgi and rerun"
    exit 1
  fi
fi
if grep -q "^WEBAGENT_PUBLIC_URL=" "$ROOT/.env.corgi"; then
  sed -i "s|^WEBAGENT_PUBLIC_URL=.*|WEBAGENT_PUBLIC_URL=https://corgi.agentnet.it.com|" "$ROOT/.env.corgi"
else
  echo "WEBAGENT_PUBLIC_URL=https://corgi.agentnet.it.com" >> "$ROOT/.env.corgi"
fi

sudo tee /etc/systemd/system/webagent-corgi.service >/dev/null <<EOF
[Unit]
Description=Corgi insurance advisor webagent
After=network.target

[Service]
Type=simple
User=$(id -un)
WorkingDirectory=$ROOT
Environment=PATH=$(dirname "$BUN_BIN"):/usr/local/bin:/usr/bin
EnvironmentFile=-$ROOT/.env.corgi
ExecStart=$BUN_BIN src/cli.ts corgi :$PORT
Restart=on-failure
RestartSec=3
TimeoutStopSec=15

[Install]
WantedBy=multi-user.target
EOF
sudo systemctl daemon-reload
sudo systemctl enable --now webagent-corgi
sleep 2
sudo systemctl --no-pager --full status webagent-corgi || true
curl -sS "http://127.0.0.1:${PORT}/agent.json"
echo
