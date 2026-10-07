#!/usr/bin/env bash
# From a machine that can SSH to the EC2 host:
#   WEBAGENT_HOST=ec2-user@ec2-xx.compute.amazonaws.com ./deploy/push.sh
# Ships the local tree over SSH. The EC2 box does not need GitHub credentials.
set -euo pipefail

HOST="${WEBAGENT_HOST:?set WEBAGENT_HOST to user@host}"
ROOT="${WEBAGENT_ROOT:-/opt/webagent}"
ENV_FILE="${WEBAGENT_ENV:-.env}"
HERE="$(cd "$(dirname "$0")/.." && pwd)"
SSH_OPTS=(-o StrictHostKeyChecking=accept-new)
if [ -n "${WEBAGENT_SSH_KEY:-}" ]; then
  SSH_OPTS+=(-i "$WEBAGENT_SSH_KEY")
fi

ssh "${SSH_OPTS[@]}" "$HOST" "sudo mkdir -p $ROOT && sudo chown \$(id -un):\$(id -gn) $ROOT"
if [ -f "$ENV_FILE" ]; then
  scp "${SSH_OPTS[@]}" "$ENV_FILE" "$HOST:$ROOT/.env"
  ssh "${SSH_OPTS[@]}" "$HOST" "chmod 600 $ROOT/.env"
fi

# Keep host .env; skip local secrets, deps, and keys.
tar -C "$HERE" \
  --exclude=.env \
  --exclude=node_modules \
  --exclude='*.pem' \
  --exclude=.tokens.json \
  --exclude=.profiles.json \
  -czf - . \
  | ssh "${SSH_OPTS[@]}" "$HOST" "tar -C $ROOT --exclude=.env -xzf -"

ssh "${SSH_OPTS[@]}" "$HOST" "bash -s" < "$(dirname "$0")/host.sh"
