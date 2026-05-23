#!/usr/bin/env bash
# Fetch JetBrains Mono web fonts into public/fonts.
# Run once locally; commit the .woff2 files so the build is self-contained.

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
