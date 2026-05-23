#!/usr/bin/env bash

set -euo pipefail

cd "$(dirname "$0")/.."

if [[ ! -f .env ]]; then
  echo "✗ .env missing — copy .env.example and fill it in." >&2
  exit 1
fi

echo "→ git pull"
git fetch --tags origin main
git reset --hard origin/main

echo "→ docker compose pull"
docker compose pull

echo "→ docker compose up -d"
docker compose up -d --remove-orphans

echo "→ pruning dangling images"
docker image prune -f

echo "→ status"
docker compose ps
