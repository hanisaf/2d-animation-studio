#!/usr/bin/env bash
# Quick checks while animating.
#   scripts/preview.sh sheet scene01_juggling 1,4,8,12     contact sheet → out/check/<scene>.jpg
#   scripts/preview.sh clip  scene01_juggling 7.5:14       low-cost MP4 of a time range → out/<scene>/clip_*.mp4
#   scripts/preview.sh studio                              serve + open the studio (browse assets, play, export MP4)
set -euo pipefail
cd "$(dirname "$0")/.."
case "${1:-}" in
  sheet)  node render.mjs --scene="$2" --sheet="$3" --cols="${4:-3}" ;;
  clip)   node render.mjs --scene="$2" --clip="$3" ;;
  studio) exec node serve.mjs --open ;;                              # http://localhost:5173 (Ctrl+C to stop)
  *) sed -n '2,5p' "$0"; exit 1 ;;
esac
