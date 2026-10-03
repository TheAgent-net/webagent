#!/usr/bin/env bash
# Create the Cloudflare proxied A record for supermemory.agentnet.it.com.
#   CF_API_TOKEN=... ./deploy/supermemory-dns.sh
set -euo pipefail

TOKEN="${CF_API_TOKEN:?set CF_API_TOKEN}"
ZONE_NAME="${CF_ZONE_NAME:-agentnet.it.com}"
HOST="${WEBAGENT_SUPERMEMORY_HOST:-supermemory.agentnet.it.com}"
IP="${WEBAGENT_ORIGIN_IP:-54.89.43.219}"

api() {
  local method="$1" path="$2" data="${3:-}"
  if [ -n "$data" ]; then
    curl -fsS -X "$method" "https://api.cloudflare.com/client/v4${path}" \
      -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
      --data "$data"
  else
    curl -fsS -X "$method" "https://api.cloudflare.com/client/v4${path}" \
      -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json"
  fi
}

ZONE_ID="$(api GET "/zones?name=${ZONE_NAME}" | python3 -c 'import json,sys; d=json.load(sys.stdin); print(d["result"][0]["id"])')"
NAME="$HOST"
EXISTING="$(api GET "/zones/${ZONE_ID}/dns_records?name=${NAME}&type=A" | python3 -c 'import json,sys; d=json.load(sys.stdin); r=d.get("result") or []; print(r[0]["id"] if r else "")')"
BODY=$(python3 - <<PY
import json
print(json.dumps({
  "type": "A",
  "name": "$NAME",
  "content": "$IP",
  "ttl": 1,
  "proxied": True,
}))
PY
)
if [ -n "$EXISTING" ]; then
  api PUT "/zones/${ZONE_ID}/dns_records/${EXISTING}" "$BODY" >/dev/null
  echo "updated ${NAME} -> ${IP} (proxied)"
else
  api POST "/zones/${ZONE_ID}/dns_records" "$BODY" >/dev/null
  echo "created ${NAME} -> ${IP} (proxied)"
fi
dig +short "$NAME" A || true
