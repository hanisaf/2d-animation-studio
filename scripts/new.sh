#!/usr/bin/env bash
# Create a new, self-contained asset folder from a template and register it.
#   scripts/new.sh character princess_petunia             → characters/princess_petunia/{asset.js, README.md, princess_petunia.js} (+ registry.js)
#   scripts/new.sh location  castle_kitchen               → locations/castle_kitchen/{asset.js, README.md, castle_kitchen.js} (+ registry.js)
#   scripts/new.sh series    auditions ["Professor Safadi Studio"]  → scenes/auditions/series.js (+ registry.js series; add it to movieSeries by hand)
#   scripts/new.sh scene     auditions scene37_auditions  → scenes/auditions/scene37_auditions/{asset.js, README.md, scene.js} (+ the series' scene list)
# Then: fill in README.md (description / script), put reference art in the folder and list it in asset.js.
set -euo pipefail
cd "$(dirname "$0")/.."
usage() { sed -n '2,7p' "$0"; exit 1; }
kind="${1:-}"; [[ "$kind" =~ ^(character|location|series|scene)$ ]] || usage
titled() { python3 -c "import sys; print(' '.join(w.capitalize() for w in sys.argv[1].split('_') if not (w.startswith('scene') and w[5:].isdigit())))" "$1"; }

if [ "$kind" = series ]; then
  name="${2:-}"; category="${3:-}"; [[ "$name" =~ ^[a-z0-9_]+$ ]] || usage
  dir="scenes/$name"; [ -e "$dir" ] && { echo "$dir already exists"; exit 1; }
  mkdir -p "$dir"
  python3 - "$name" "$(titled "$name")" "$category" <<'PY'
import sys, re
name, title, category = sys.argv[1:]
esc = lambda v: v.replace('\\', '\\\\').replace("'", "\\'")
t = open('scripts/templates/series/series.js').read()
open(f'scenes/{name}/series.js', 'w').write(t.replace('__NAME__', name).replace('__TITLE__', esc(title)).replace('__CATEGORY__', esc(category)))
s = open('registry.js').read()
s, n = re.subn(r"(\n  series: \[)(.*?)(\n  \],)", lambda m: m.group(1) + m.group(2) + f"\n    '{name}'," + m.group(3), s, count=1, flags=re.S)
assert n, 'could not find the series list in registry.js'
open('registry.js', 'w').write(s)
PY
  echo "created $dir/series.js and registered it in registry.js (add it to movieSeries to put it in the movie)"
  exit 0
fi

if [ "$kind" = scene ]; then
  series="${2:-}"; name="${3:-}"; [[ "$series" =~ ^[a-z0-9_]+$ && "$name" =~ ^[a-z0-9_]+$ ]] || usage
  [ -f "scenes/$series/series.js" ] || { echo "no series scenes/$series (create it first: scripts/new.sh series $series)"; exit 1; }
  if grep -qr --include=series.js "'$name'" scenes; then echo "scene id $name is already used (ids are unique across all series)"; exit 1; fi
  dir="scenes/$series/$name"
else
  name="${2:-}"; [[ "$name" =~ ^[a-z0-9_]+$ ]] || usage
  dir="${kind}s/$name"; series=""
fi
[ -e "$dir" ] && { echo "$dir already exists"; exit 1; }
title="$(titled "$name")"
mkdir -p "$dir"
for f in scripts/templates/"$kind"/*; do
  out="$dir/$(basename "$f" | sed "s/__NAME__/$name/")"
  sed -e "s/__NAME__/$name/g" -e "s/__TITLE__/$title/g" -e "s/__SERIES__/$series/g" "$f" > "$out"
done
python3 - "$kind" "$name" "$series" <<'PY'
import sys, re
kind, name, series = sys.argv[1:]
if kind == 'scene':
    p = f'scenes/{series}/series.js'
    s, n = re.subn(r"(\n  scenes: \[)(.*?)(\n  \],)", lambda m: m.group(1) + m.group(2) + f"\n    '{name}'," + m.group(3), open(p).read(), count=1, flags=re.S)
else:
    p, sec = 'registry.js', kind + 's'
    s, n = re.subn(r"(\n  %s: \[)(.*?)(\])" % sec, lambda m: m.group(1) + (m.group(2) + ", '%s'" % name if m.group(2).strip() else "'%s'" % name) + m.group(3), open(p).read(), count=1)
assert n, f'could not find the list to add {name} to in {p}'
open(p, 'w').write(s)
PY
echo "created $dir/ ($(ls "$dir" | tr '\n' ' ')) and registered it$([ -n "$series" ] && echo " in scenes/$series/series.js" || echo " in registry.js")"
