#!/usr/bin/env bash
# Install or update the webagent cloud on the EC2 host. Run it again to update.
#
# - Clones or pulls $WEBAGENT_BRANCH into /opt/webagent-cloud.
# - Runs bun install.
# - Installs deploy/cloud.service as webagent-cloud and restarts it.
# - Checks /health. On failure, prints the last journal lines and exits 1.
# - With WEBAGENT_NGINX=1, installs deploy/nginx-cloud.conf and reloads nginx.
#
# The other services on the host (/opt/webagent, /opt/webagent-smallest, ...) do not change.
# Secrets live in /opt/webagent-cloud/.env.cloud. This script does not print them.
set -euo pipefail

ROOT="${WEBAGENT_ROOT:-/opt/webagent-cloud}"
BRANCH="${WEBAGENT_BRANCH:?set WEBAGENT_BRANCH to the git branch to deploy}"
REPO="${WEBAGENT_REPO:-https://github.com/TheAgent-net/webagent.git}"
PORT="${WEBAGENT_CLOUD_PORT:-8790}"
SERVICE="webagent-cloud"
ENV_FILE="$ROOT/.env.cloud"
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

mkdir -p "$ROOT/data" "$ROOT/packs"

if [ ! -f "$ENV_FILE" ]; then
  cat > "$ENV_FILE" <<'EOF'
# webagent cloud settings. See docs/cloud.md. Fill the values, then run deploy/cloud.sh again.
OPENAI_API_KEY=
WEBAGENT_PUBLIC_URL=https://cloud.agentnet.it.com
WEBAGENT_DB=/opt/webagent-cloud/data/webagent.db
WEBAGENT_ADMIN_KEY=
WEBAGENT_SESSION_SECRET=
WEBAGENT_IP_SALT=
SUPERMEMORY_API_KEY=
WEBAGENT_REFRESH_HOURS=0
WEBAGENT_TENANT_CAP=32
WEBAGENT_MAIL_WEBHOOK=
EOF
  chmod 600 "$ENV_FILE"
  echo "wrote $ENV_FILE. Fill it, then run this script again."
  exit 1
fi
chmod 600 "$ENV_FILE"

UNIT=/etc/systemd/system/$SERVICE.service
sudo cp "$ROOT/deploy/cloud.service" "$UNIT"
sudo sed -i "s|^User=.*|User=$(id -un)|" "$UNIT"
sudo sed -i "s|^WorkingDirectory=.*|WorkingDirectory=$ROOT|" "$UNIT"
sudo sed -i "s|^Environment=PATH=.*|Environment=PATH=$(dirname "$BUN_BIN"):/usr/local/bin:/usr/bin|" "$UNIT"
sudo sed -i "s|^Environment=WEBAGENT_DB=.*|Environment=WEBAGENT_DB=$ROOT/data/webagent.db|" "$UNIT"
sudo sed -i "s|^EnvironmentFile=.*|EnvironmentFile=-$ENV_FILE|" "$UNIT"
sudo sed -i "s|^ExecStart=.*|ExecStart=$BUN_BIN src/cli.ts cloud :$PORT --packs $ROOT/packs --db $ROOT/data/webagent.db|" "$UNIT"
sudo systemctl daemon-reload
sudo systemctl enable "$SERVICE"
sudo systemctl restart "$SERVICE"

if [ "${WEBAGENT_NGINX:-0}" = "1" ]; then
  sudo cp "$ROOT/deploy/nginx-cloud.conf" /etc/nginx/conf.d/webagent-cloud.conf
  sudo nginx -t
  sudo systemctl reload nginx
fi

for _ in $(seq 1 20); do
  if curl -fsS "http://127.0.0.1:${PORT}/health"; then
    echo
    echo "$SERVICE is up on :$PORT"
    exit 0
  fi
  sleep 1
done

echo "$SERVICE did not answer /health on :$PORT"
sudo systemctl --no-pager --full status "$SERVICE" || true
sudo journalctl -u "$SERVICE" -n 80 --no-pager || true
exit 1
