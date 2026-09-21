#!/usr/bin/env bash
# Add or refresh corgi.agentnet.it.com on the existing docker nginx (80 + 443).
# Does not change app.agentnet.market or composio.agentnet.it.com.
set -euo pipefail

NGINX_CONF="${WEBAGENT_NGINX_CONF:-/home/ec2-user/agentnet-platform/deploy/nginx.conf}"
CERT_DIR="${WEBAGENT_CERT_DIR:-/home/ec2-user/agentnet-platform/deploy/certs}"
MARKER="Corgi webagent"
HOST_NAME="${WEBAGENT_CORGI_HOST:-corgi.agentnet.it.com}"
PORT="${WEBAGENT_CORGI_PORT:-8788}"

if [ ! -f "$NGINX_CONF" ]; then
  echo "nginx.conf not found at $NGINX_CONF"
  exit 1
fi

GW="$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.Gateway}}{{end}}' agentnet-nginx 2>/dev/null || true)"
if [ -z "$GW" ]; then
  GW="172.19.0.1"
  echo "warning: could not read docker gateway, defaulting to $GW"
fi

mkdir -p "$CERT_DIR"
if [ ! -f "$CERT_DIR/corgi.crt" ]; then
  openssl req -x509 -nodes -newkey rsa:2048 -days 825 \
    -keyout "$CERT_DIR/corgi.key" \
    -out "$CERT_DIR/corgi.crt" \
    -subj "/CN=${HOST_NAME}"
  chmod 644 "$CERT_DIR/corgi.crt"
  chmod 600 "$CERT_DIR/corgi.key"
fi

BLOCK=$(cat <<EOF

# ${MARKER} — ${HOST_NAME} only.
upstream corgi_bun {
    server ${GW}:${PORT};
    keepalive 32;
}

server {
    listen 80;
    listen 443 ssl;
    http2 on;
    server_name ${HOST_NAME};
    ssl_certificate /etc/nginx/certs/corgi.crt;
    ssl_certificate_key /etc/nginx/certs/corgi.key;

    gzip on;
    gzip_min_length 256;
    gzip_vary on;
    gzip_proxied any;
    gzip_types text/plain text/css text/html application/javascript application/json image/svg+xml;

    location /live {
        proxy_pass http://corgi_bun;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header X-Forwarded-Host \$host;
        proxy_read_timeout 120s;
        proxy_buffering off;
    }

    location / {
        proxy_pass http://corgi_bun;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header X-Forwarded-Host \$host;
        proxy_read_timeout 120s;
        proxy_buffering on;
    }
}
EOF
)

python3 - "$NGINX_CONF" "$MARKER" "$BLOCK" <<'PY'
import sys
from pathlib import Path
path = Path(sys.argv[1])
marker = "# " + sys.argv[2]
block = sys.argv[3]
if not block.endswith("\n"):
    block += "\n"
text = path.read_text()
start = text.find(marker)
if start < 0:
    path.write_text(text.rstrip() + "\n" + block)
    print("added corgi server block")
    raise SystemExit(0)
depth = 0
started = False
end = len(text)
j = start
while j < len(text):
    ch = text[j]
    if ch == "{":
        depth += 1
        started = True
    elif ch == "}":
        depth -= 1
        if started and depth == 0:
            k = j + 1
            while k < len(text) and text[k] in " \t\r\n":
                k += 1
            rest = text[k:]
            if rest.startswith("upstream ") or rest.startswith("server {"):
                j += 1
                continue
            end = j + 1
            break
    j += 1
path.write_text(text[:start].rstrip() + "\n" + block + text[end:].lstrip("\n"))
print("replaced corgi server block")
PY

if ! docker exec agentnet-nginx nginx -t; then
  echo "nginx config test failed — revert $NGINX_CONF"
  exit 1
fi
docker exec agentnet-nginx nginx -s reload
echo "front https://${HOST_NAME}/"
curl -sS -m 10 "http://127.0.0.1/agent.json" -H "Host: ${HOST_NAME}"
echo
