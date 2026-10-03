#!/usr/bin/env bash
# Run on the EC2 host. Installs SuperMemory in /opt/webagent-supermemory so
# Composio (:8787), Corgi (:8788), and Smallest (:8789) keep running.
set -euo pipefail

ROOT="${WEBAGENT_ROOT:-/opt/webagent-supermemory}"
BRANCH="${WEBAGENT_BRANCH:-cursor/supermemory-pack-e5be}"
REPO="${WEBAGENT_REPO:-https://github.com/TheAgent-net/webagent.git}"
PORT="${WEBAGENT_SUPERMEMORY_PORT:-8791}"
ENV_SRC="${WEBAGENT_ENV_SRC:-/opt/webagent/.env}"
PUBLIC_URL="${WEBAGENT_PUBLIC_URL:-https://supermemory.agentnet.it.com}"
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
if git show-ref --verify --quiet "refs/heads/$BRANCH"; then
  git checkout "$BRANCH"
else
  git checkout -B "$BRANCH" FETCH_HEAD
fi
git pull --ff-only origin "$BRANCH" || git reset --hard FETCH_HEAD
bun install

if [ ! -f "$ROOT/.env.supermemory" ]; then
  if [ -f "$ENV_SRC" ]; then
    cp "$ENV_SRC" "$ROOT/.env.supermemory"
    chmod 600 "$ROOT/.env.supermemory"
  else
    echo "missing $ENV_SRC — write OPENAI_API_KEY into $ROOT/.env.supermemory and rerun"
    exit 1
  fi
fi
if grep -q "^WEBAGENT_PUBLIC_URL=" "$ROOT/.env.supermemory"; then
  sed -i "s|^WEBAGENT_PUBLIC_URL=.*|WEBAGENT_PUBLIC_URL=$PUBLIC_URL|" "$ROOT/.env.supermemory"
else
  echo "WEBAGENT_PUBLIC_URL=$PUBLIC_URL" >> "$ROOT/.env.supermemory"
fi
if grep -q "^WEBAGENT_MAX_PAGES=" "$ROOT/.env.supermemory"; then
  sed -i "s|^WEBAGENT_MAX_PAGES=.*|WEBAGENT_MAX_PAGES=${WEBAGENT_MAX_PAGES:-180}|" "$ROOT/.env.supermemory"
else
  echo "WEBAGENT_MAX_PAGES=${WEBAGENT_MAX_PAGES:-180}" >> "$ROOT/.env.supermemory"
fi
# Pack pins the model. Drop a copied Composio OPENAI_MODEL so it cannot override.
if grep -q "^OPENAI_MODEL=" "$ROOT/.env.supermemory"; then
  sed -i "/^OPENAI_MODEL=/d" "$ROOT/.env.supermemory"
fi

sudo tee /etc/systemd/system/webagent-supermemory.service >/dev/null <<EOF
[Unit]
Description=supermemory webagent (pack)
After=network.target

[Service]
Type=simple
User=$(id -un)
WorkingDirectory=$ROOT
Environment=PATH=$(dirname "$BUN_BIN"):/usr/local/bin:/usr/bin
EnvironmentFile=-$ROOT/.env.supermemory
ExecStart=$BUN_BIN src/cli.ts serve --pack packs/supermemory :$PORT
Restart=on-failure
RestartSec=3
TimeoutStopSec=20

[Install]
WantedBy=multi-user.target
EOF
sudo systemctl daemon-reload
sudo systemctl enable --now webagent-supermemory
sudo systemctl restart webagent-supermemory
echo "waiting for supermemory pack crawl on :$PORT ..."
for i in $(seq 1 90); do
  if curl -fsS -m 2 "http://127.0.0.1:${PORT}/agent.json" >/tmp/sm-agent.json 2>/dev/null; then
    sudo systemctl --no-pager --full status webagent-supermemory || true
    cat /tmp/sm-agent.json
    echo
    exit 0
  fi
  sleep 4
done
sudo systemctl --no-pager --full status webagent-supermemory || true
echo "supermemory did not answer /agent.json on :$PORT"
exit 1
