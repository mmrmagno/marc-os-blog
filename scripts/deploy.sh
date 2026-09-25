#!/usr/bin/env bash

set -euo pipefail

cd "$(dirname "$0")/.."

if [[ ! -f .env ]]; then
  echo "✗ .env missing: copy .env.example and fill it in." >&2
  exit 1
fi

echo "→ docker compose pull"
docker compose pull

echo "→ docker compose up -d"
docker compose up -d --remove-orphans

echo "→ pruning dangling images"
docker image prune -f

echo "→ status"
docker compose ps

echo "→ waiting for /healthz"
for _ in $(seq 1 20); do
  if docker exec marc-os-app wget -qO- http://127.0.0.1:8080/healthz >/dev/null 2>&1; then
    echo "deploy: marc-os-app healthy"
    exit 0
  fi
  sleep 3
done

echo "✗ deploy: marc-os-app not healthy within 60s" >&2
docker compose ps >&2
docker compose logs --tail 50 app >&2
exit 1
