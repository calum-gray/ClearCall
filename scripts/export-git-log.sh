#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/git-log.txt"
{
  echo "ClearCall Clara — Git log export for Canvas submission"
  echo "Generated: $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
  echo
  git -C "$ROOT" log --decorate --stat --all
} > "$OUT"
echo "Wrote $OUT"
