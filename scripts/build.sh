#!/usr/bin/env bash
# Build production Docker image
set -euo pipefail

IMAGE_NAME="venue-booking-system"
VERSION="${1:-$(git describe --tags --always --dirty 2>/dev/null || echo "dev")}"

echo "==> Building $IMAGE_NAME:$VERSION"

docker build \
  --file Dockerfile \
  --tag "$IMAGE_NAME:$VERSION" \
  --tag "$IMAGE_NAME:latest" \
  --build-arg VITE_APP_VERSION="$VERSION" \
  --label "org.opencontainers.image.version=$VERSION" \
  --label "org.opencontainers.image.created=$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
  .

echo "==> Build complete: $IMAGE_NAME:$VERSION"
echo "==> Run: docker run -p 8080:8080 $IMAGE_NAME:$VERSION"
