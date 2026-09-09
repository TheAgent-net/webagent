#!/usr/bin/env bash
# certbot deploy hook: copy the renewed lineage into the nginx bind-mount
# and reload. Installed to /etc/letsencrypt/renewal-hooks/deploy/ by front.sh.
#
# The hostname comes from composio-nginx.env (written by front.sh from
# WEBAGENT_FRONT_HOST). Do not hard-code the default domain here.
set -euo pipefail

CONFIG="${WEBAGENT_FRONT_HOOK_CONFIG:-/etc/letsencrypt/renewal-hooks/deploy/composio-nginx.env}"
if [ -f "$CONFIG" ]; then
  # shellcheck disable=SC1090
  . "$CONFIG"
fi

HOST_NAME="${WEBAGENT_FRONT_HOST:-composio.agentnet.it.com}"
DEST="${WEBAGENT_CERT_DIR:-/home/ec2-user/agentnet-platform/deploy/certs}"

case " ${RENEWED_DOMAINS:-} " in
  *" ${HOST_NAME} "*) ;;
  *) exit 0 ;;
esac

LINEAGE="${RENEWED_LINEAGE:-/etc/letsencrypt/live/${HOST_NAME}}"

cp "$LINEAGE/fullchain.pem" "$DEST/composio.crt"
cp "$LINEAGE/privkey.pem" "$DEST/composio.key"
owner="$(stat -c '%U:%G' "$DEST" 2>/dev/null || true)"
if [ -n "$owner" ]; then
  chown "$owner" "$DEST/composio.crt" "$DEST/composio.key"
fi
chmod 644 "$DEST/composio.crt"
chmod 600 "$DEST/composio.key"
docker exec agentnet-nginx nginx -s reload
