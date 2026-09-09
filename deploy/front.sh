#!/usr/bin/env bash
# Publish the apps agent on composio.agentnet.it.com via the existing
# docker nginx (port 80 + 443). Does not change app.agentnet.market.
#
# HTTPS listens only when a Let's Encrypt certificate is present. There is
# no self-signed fallback: a fresh host serves HTTP (and ACME) until certbot
# issues a trusted cert, then 443 is enabled. Deploy fails if issuance fails.
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
NGINX_CONF="${WEBAGENT_NGINX_CONF:-/home/ec2-user/agentnet-platform/deploy/nginx.conf}"
CERT_DIR="$(dirname "$NGINX_CONF")/certs"
MARKER="Composio webagent"
HOST_NAME="${WEBAGENT_FRONT_HOST:-composio.agentnet.it.com}"
HOST_ALIASES="${WEBAGENT_FRONT_HOST_ALIASES:-ec2-54-89-43-219.compute-1.amazonaws.com}"
PORT="${WEBAGENT_PORT:-8787}"
LE_FULL="/etc/letsencrypt/live/${HOST_NAME}/fullchain.pem"
LE_KEY="/etc/letsencrypt/live/${HOST_NAME}/privkey.pem"

if [ ! -f "$NGINX_CONF" ]; then
  echo "missing $NGINX_CONF"
  exit 1
fi

GW="$(docker inspect agentnet-nginx --format '{{range .NetworkSettings.Networks}}{{.Gateway}}{{end}}')"
if [ -z "$GW" ]; then
  echo "could not read docker gateway for agentnet-nginx"
  exit 1
fi

mkdir -p "$CERT_DIR/acme/.well-known/acme-challenge"

strip_marker() {
  python3 - "$NGINX_CONF" "$MARKER" <<'PY'
import sys
from pathlib import Path
p = Path(sys.argv[1])
marker = sys.argv[2]
text = p.read_text()
idx = text.find("# " + marker)
if idx >= 0:
    p.write_text(text[:idx].rstrip() + "\n")
PY
}

write_nginx() {
  local with_tls="$1"
  strip_marker
  if [ "$with_tls" = 1 ]; then
    cat >> "$NGINX_CONF" <<EOF

# ${MARKER} — dedicated Host only. Not app.agentnet.market.
server {
    listen 80;
    listen 443 ssl;
    server_name ${HOST_NAME} ${HOST_ALIASES};
    ssl_certificate /etc/nginx/certs/composio.crt;
    ssl_certificate_key /etc/nginx/certs/composio.key;

    location /.well-known/acme-challenge/ {
        root /etc/nginx/certs/acme;
        default_type text/plain;
    }

    location / {
        proxy_pass http://${GW}:${PORT};
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header X-Forwarded-Host \$host;
        proxy_read_timeout 120s;
        proxy_buffering off;
    }
}
EOF
  else
    cat >> "$NGINX_CONF" <<EOF

# ${MARKER} — dedicated Host only. Not app.agentnet.market.
# HTTP only until Let's Encrypt issues a certificate (no self-signed fallback).
server {
    listen 80;
    server_name ${HOST_NAME} ${HOST_ALIASES};

    location /.well-known/acme-challenge/ {
        root /etc/nginx/certs/acme;
        default_type text/plain;
    }

    location / {
        proxy_pass http://${GW}:${PORT};
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header X-Forwarded-Host \$host;
        proxy_read_timeout 120s;
        proxy_buffering off;
    }
}
EOF
  fi
}

reload_nginx() {
  if ! docker exec agentnet-nginx nginx -t; then
    if [ -f "$NGINX_CONF.bak.composio" ]; then
      cp -a "$NGINX_CONF.bak.composio" "$NGINX_CONF"
    fi
    echo "nginx -t failed; restored backup"
    exit 1
  fi
  docker exec agentnet-nginx nginx -s reload
}

has_le_live() {
  sudo test -f "$LE_FULL" && sudo test -f "$LE_KEY"
}

copy_le_certs() {
  if [ -r "$LE_FULL" ] && [ -r "$LE_KEY" ]; then
    cp "$LE_FULL" "$CERT_DIR/composio.crt"
    cp "$LE_KEY" "$CERT_DIR/composio.key"
  else
    sudo cp "$LE_FULL" "$CERT_DIR/composio.crt"
    sudo cp "$LE_KEY" "$CERT_DIR/composio.key"
    sudo chown "$(id -un):$(id -gn)" "$CERT_DIR/composio.crt" "$CERT_DIR/composio.key"
  fi
  chmod 644 "$CERT_DIR/composio.crt"
  chmod 600 "$CERT_DIR/composio.key"
}

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
    return 1
  fi
}

issue_le_cert() {
  if ! command -v certbot >/dev/null; then
    install_pkg certbot || {
      echo "certbot is not installed and could not be installed"
      return 1
    }
  fi
  local email_args=(--register-unsafely-without-email)
  if [ -n "${WEBAGENT_ACME_EMAIL:-}" ]; then
    email_args=(--email "$WEBAGENT_ACME_EMAIL")
  fi
  sudo certbot certonly --webroot \
    -w "$CERT_DIR/acme" \
    -d "$HOST_NAME" \
    --non-interactive --agree-tos --keep-until-expiring \
    "${email_args[@]}"
}

install_renew_hook() {
  local dest=/etc/letsencrypt/renewal-hooks/deploy/composio-nginx.sh
  local cfg=/etc/letsencrypt/renewal-hooks/deploy/composio-nginx.env
  sudo mkdir -p /etc/letsencrypt/renewal-hooks/deploy
  sudo install -m 755 "$HERE/composio-renew-hook.sh" "$dest"
  # Bake the deployed hostname so renewals follow WEBAGENT_FRONT_HOST.
  {
    printf 'WEBAGENT_FRONT_HOST=%q\n' "$HOST_NAME"
    printf 'WEBAGENT_CERT_DIR=%q\n' "$CERT_DIR"
  } | sudo tee "$cfg" >/dev/null
  sudo chmod 644 "$cfg"
  sudo systemctl enable --now certbot-renew.timer 2>/dev/null \
    || sudo systemctl enable --now certbot.timer 2>/dev/null \
    || true
}

drop_unmanaged_certs() {
  # Leftover self-signed material must not be treated as a managed cert.
  rm -f "$CERT_DIR/composio.crt" "$CERT_DIR/composio.key"
}

cp -a "$NGINX_CONF" "$NGINX_CONF.bak.composio"

tls=0
if has_le_live; then
  copy_le_certs
  tls=1
else
  drop_unmanaged_certs
fi

write_nginx "$tls"
reload_nginx

if [ "$tls" != 1 ]; then
  echo "no Let's Encrypt cert for $HOST_NAME — issuing via HTTP-01 webroot"
  if issue_le_cert && has_le_live; then
    copy_le_certs
    tls=1
    write_nginx 1
    reload_nginx
  fi
fi

install_renew_hook

if [ "$tls" != 1 ]; then
  echo "front http://${HOST_NAME}/ (HTTPS disabled: no managed certificate)"
  echo "failing deploy until certbot can issue a certificate for $HOST_NAME"
  exit 1
fi

echo "front https://${HOST_NAME}/"
curl -sS -m 10 --resolve "${HOST_NAME}:443:127.0.0.1" "https://${HOST_NAME}/.well-known/agent-card.json"
echo
