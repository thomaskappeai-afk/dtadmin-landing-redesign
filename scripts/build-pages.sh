#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
rm -rf dist dist-v1 dist-v2 /tmp/dtadmin-v1-src
npm run build
mv dist dist-v2
git worktree add --detach /tmp/dtadmin-v1-src v1
(
  cd /tmp/dtadmin-v1-src
  npm ci --silent
  npm run build
  mv dist "$ROOT/dist-v1"
)
git worktree remove --force /tmp/dtadmin-v1-src
mv dist-v1 dist
mkdir -p dist/v2
cp -a dist-v2/. dist/v2/
rm -rf dist-v2
printf 'v1\n' > dist/VERSION.txt
printf 'v2\n' > dist/v2/VERSION.txt
echo "Built Pages artifact: $(find dist -type f | wc -l) files"
