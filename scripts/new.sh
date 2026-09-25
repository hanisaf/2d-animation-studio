#!/usr/bin/env bash
# Create a new, self-contained asset folder from a template and register it in registry.js.
#   scripts/new.sh character princess_petunia     → characters/princess_petunia/{asset.js, README.md, princess_petunia.js}
#   scripts/new.sh location  castle_kitchen       → locations/castle_kitchen/{asset.js, README.md, castle_kitchen.js}
#   scripts/new.sh scene     scene03_auditions    → scenes/scene03_auditions/{asset.js, README.md, scene.js} (+ movie order)
# Then: fill in README.md (description / script), put reference art in the folder and list it in asset.js.
set -euo pipefail
cd "$(dirname "$0")/.."
kind="${1:-}"; name="${2:-}"
[[ "$kind" =~ ^(character|location|scene)$ && "$name" =~ ^[a-z0-9_]+$ ]] || { sed -n '2,6p' "$0"; exit 1; }
dir="${kind}s/$name"; [ -e "$dir" ] && { echo "$dir already exists"; exit 1; }
title="$(python3 -c "import sys; print(' '.join(w.capitalize() for w in sys.argv[1].split('_') if not (w.startswith('scene') and w[5:].isdigit())))" "$name")"
mkdir -p "$dir"
for f in scripts/templates/"$kind"/*; do
  out="$dir/$(basename "$f" | sed "s/__NAME__/$name/")"
  sed -e "s/__NAME__/$name/g" -e "s/__TITLE__/$title/g" "$f" > "$out"
done
python3 - "${kind}s" "$name" <<'PY'
import sys, re
sec, name = sys.argv[1:]
s = open('registry.js').read()
def add(key, s):
    return re.sub(r"(\n  %s: \[)(.*?)(\])" % key, lambda m: m.group(1) + (m.group(2) + ", '%s'" % name if m.group(2).strip() else "'%s'" % name) + m.group(3), s, count=1)
s = add(sec, s)
if sec == 'scenes': s = add('movie', s)
open('registry.js', 'w').write(s)
PY
echo "created $dir/ ($(ls "$dir" | tr '\n' ' ')) and registered it in registry.js"
