#!/usr/bin/env bash
# Deploy to production via docker-compose
# Usage: ./scripts/deploy.sh [version]
set -euo pipefail

VERSION="${1:-latest}"
COMPOSE_FILE="docker-compose.yml"

echo "==> Deploying venue-booking-system:$VERSION"

# Pull or build image
if [[ "$VERSION" == "latest" ]]; then
  echo "==> Building fresh image..."
  bash "$(dirname "$0")/build.sh" "$VERSION"
fi

# Export version for docker-compose
export APP_VERSION="$VERSION"

# Bring up with zero-downtime swap
echo "==> Starting new container..."
docker compose -f "$COMPOSE_FILE" up -d --remove-orphans

# Wait for health check
echo "==> Waiting for health check..."
MAX_RETRIES=12
COUNT=0
until docker compose -f "$COMPOSE_FILE" exec -T app wget -qO- http://localhost:8080/health 2>/dev/null; do
  COUNT=$((COUNT + 1))
  if [[ $COUNT -ge $MAX_RETRIES ]]; then
    echo "ERROR: Health check failed after $MAX_RETRIES attempts. Rolling back..."
    docker compose -f "$COMPOSE_FILE" down
    exit 1
  fi
  echo "  Waiting... ($COUNT/$MAX_RETRIES)"
  sleep 5
done

echo "==> Deployment successful. App running at http://localhost:${PORT:-8080}"

# Prune dangling images
docker image prune -f --filter "dangling=true" > /dev/null 2>&1 || true
