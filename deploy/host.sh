#!/usr/bin/env bash
# Run this on the EC2 host. Starts systemd for a tree already in $ROOT,
# or clones the apps branch when GitHub credentials are available.
set -euo pipefail

ROOT="${WEBAGENT_ROOT:-/opt/webagent}"
BRANCH="${WEBAGENT_BRANCH:-cursor/composio-agent-e5be}"
REPO="${WEBAGENT_REPO:-https://github.com/TheAgent-net/webagent.git}"
PORT="${WEBAGENT_PORT:-8787}"
RUN_USER="$(id -un)"
BUN="${BUN:-}"

install_pkg() {
  if command -v "$1" >/dev/null; then
    return 0
  fi
  if command -v dnf >/dev/null; then
    sudo dnf install -y "$@"
  elif command -v yum >/dev/null; then
    sudo yum install -y "$@"
  elif command -v apt-get >/dev/null; then
    sudo apt-get update -y
    sudo apt-get install -y "$@"
  else
    echo "need $* on PATH"
    exit 1
  fi
}

install_pkg git
command -v curl >/dev/null || install_pkg curl

if [ -z "$BUN" ]; then
  if [ -x "$HOME/.bun/bin/bun" ]; then
    BUN="$HOME/.bun/bin/bun"
  elif command -v bun >/dev/null; then
    BUN="$(command -v bun)"
  else
    curl -fsSL https://bun.sh/install | bash
    BUN="$HOME/.bun/bin/bun"
  fi
fi
export PATH="$(dirname "$BUN"):$PATH"
sudo mkdir -p /usr/local/bin
sudo ln -sfn "$BUN" /usr/local/bin/bun

sudo mkdir -p "$ROOT"
sudo chown "$RUN_USER:$(id -gn)" "$ROOT"

have_tree() {
  [ -f "$ROOT/src/cli.ts" ] && [ -f "$ROOT/deploy/apps.service" ]
}

if [ ! -d "$ROOT/.git" ] && ! have_tree; then
  tmp="$(mktemp -d)"
  git clone "$REPO" "$tmp/webagent"
  if [ -f "$ROOT/.env" ]; then
    cp "$ROOT/.env" "$tmp/webagent/.env"
    chmod 600 "$tmp/webagent/.env"
  fi
  find "$ROOT" -mindepth 1 -maxdepth 1 ! -name '.env' -exec rm -rf {} +
  shopt -s dotglob
  mv "$tmp/webagent"/* "$ROOT/"
  shopt -u dotglob
  rm -rf "$tmp"
fi

cd "$ROOT"
if [ -d .git ]; then
  if git fetch origin "$BRANCH"; then
    git checkout "$BRANCH"
    git pull --ff-only origin "$BRANCH" || true
  else
    echo "git remote unavailable — using the tree already in $ROOT"
  fi
fi

if ! have_tree; then
  echo "missing $ROOT/src/cli.ts — copy the repo with deploy/push.sh or clone with GitHub credentials"
  exit 1
fi

bun install

if [ ! -f "$ROOT/.env" ]; then
  echo "missing $ROOT/.env — write OPENAI_API_KEY and WEBAGENT_PUBLIC_URL, then rerun"
  exit 1
fi
chmod 600 "$ROOT/.env"

sudo cp "$ROOT/deploy/apps.service" /etc/systemd/system/webagent-apps.service
sudo sed -i "s|^User=.*|User=$RUN_USER|" /etc/systemd/system/webagent-apps.service
sudo sed -i "s|WorkingDirectory=.*|WorkingDirectory=$ROOT|" /etc/systemd/system/webagent-apps.service
sudo sed -i "s|EnvironmentFile=-.*|EnvironmentFile=-$ROOT/.env|" /etc/systemd/system/webagent-apps.service
sudo sed -i "s|^Environment=PATH=.*|Environment=PATH=$(dirname "$BUN"):/usr/local/bin:/usr/bin|" /etc/systemd/system/webagent-apps.service
sudo sed -i "s|^ExecStart=.*|ExecStart=$BUN src/cli.ts apps :$PORT|" /etc/systemd/system/webagent-apps.service
sudo systemctl daemon-reload
sudo systemctl enable --now webagent-apps
sudo systemctl restart webagent-apps
sleep 2
sudo systemctl --no-pager --full status webagent-apps || true
curl -sS "http://127.0.0.1:${PORT}/agent.json"
echo
