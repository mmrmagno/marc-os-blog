#!/usr/bin/env bash
# Roll back to a previous image tag.
# Usage: ./scripts/rollback.sh <git-sha>     e.g. ./scripts/rollback.sh sha-abc1234

set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "usage: $0 <image-tag>   (e.g. sha-abc1234, or a semver tag)"
  exit 1
fi

TAG="$1"
cd "$(dirname "$0")/.."

# Patch .env to pin the tag, then up.
sed -i.bak "s|^IMAGE_TAG=.*|IMAGE_TAG=ghcr.io/mmrmagno/marc-os-blog:${TAG}|" .env
docker compose pull
docker compose up -d --remove-orphans
docker compose ps

echo "✓ rolled back to ${TAG}. Original .env saved to .env.bak"
