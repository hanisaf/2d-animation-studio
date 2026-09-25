#!/usr/bin/env bash
# Compile every scene listed in REGISTRY.movie (registry.js) and join them, in order, into out/movie.mp4.
#   scripts/build_movie.sh              rebuild all scenes, then join
#   scripts/build_movie.sh --skip-build re-join the scene videos already in out/ (re-encodes from existing frames)
set -euo pipefail
cd "$(dirname "$0")/.."
node render.mjs --movie "$@"
