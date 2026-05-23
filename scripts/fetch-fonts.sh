#!/usr/bin/env bash

set -euo pipefail

VERSION="${JBM_VERSION:-2.304}"
TMP="$(mktemp -d)"
DEST="$(dirname "$0")/../public/fonts"

mkdir -p "$DEST"

echo "→ downloading JetBrains Mono v${VERSION}"
curl -fsSL \
  "https://github.com/JetBrains/JetBrainsMono/releases/download/v${VERSION}/JetBrainsMono-${VERSION}.zip" \
  -o "$TMP/jbm.zip"

echo "→ extracting"
unzip -q "$TMP/jbm.zip" -d "$TMP/jbm"

echo "→ copying woff2 (regular + bold)"
cp "$TMP/jbm/fonts/webfonts/JetBrainsMono-Regular.woff2" "$DEST/"
cp "$TMP/jbm/fonts/webfonts/JetBrainsMono-Bold.woff2"    "$DEST/"

rm -rf "$TMP"
echo "✓ done"
ls -la "$DEST"
