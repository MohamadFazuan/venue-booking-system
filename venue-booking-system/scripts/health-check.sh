#!/usr/bin/env bash
# Verify running container is healthy
set -euo pipefail

HOST="${1:-localhost}"
PORT="${2:-8080}"
URL="http://$HOST:$PORT/health"

echo "==> Health check: $URL"

RESPONSE=$(curl -sf --max-time 5 "$URL" 2>&1) || {
  echo "FAIL: No response from $URL"
  exit 1
}

echo "==> Response: $RESPONSE"

if echo "$RESPONSE" | grep -q '"status":"ok"'; then
  echo "==> PASS: Service is healthy"
else
  echo "FAIL: Unexpected response"
  exit 1
fi
