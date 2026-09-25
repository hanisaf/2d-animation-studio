#!/usr/bin/env bash
# Compile one scene to video: paints every frame, then encodes out/<scene>/<scene>.mp4 (with audio if the scene has one).
#   scripts/build_scene.sh scene01_juggling [--workers=6]
set -euo pipefail
cd "$(dirname "$0")/.."
[ $# -ge 1 ] || { echo "usage: $0 <scene_id> [render.mjs options]"; node render.mjs --list; exit 1; }
id="$1"; shift
node render.mjs --scene="$id" --build "$@"
echo "→ out/$id/$id.mp4"
