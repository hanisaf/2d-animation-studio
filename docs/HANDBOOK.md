# Jester Fester: project handbook

Everything you need to pick this project up on another machine: what it is, how to move and set it up, how the pieces fit together, the full API, the scenes made so far, and step-by-step workflows for adding more.

> **Quick start on a new machine**
> ```bash
> npm install                 # puppeteer-core, mp4-muxer + a bundled ffmpeg for this OS
> node render.mjs --doctor    # checks Node, Chrome, ffmpeg, fonts, renders a test frame
> npm run studio              # opens the studio: browse assets, play scenes, export MP4 in the browser
> scripts/build_movie.sh      # or: render every scene from the command line → out/movie.mp4
> ```

---

## Contents

1. [What this project is](#1-what-this-project-is)
2. [Moving to a new machine](#2-moving-to-a-new-machine)
3. [Project map](#3-project-map)
4. [How a frame gets made](#4-how-a-frame-gets-made)
5. [Command reference](#5-command-reference)
6. [Core concepts](#6-core-concepts)
7. [Engine API reference](#7-engine-api-reference)
8. [Assets: characters, locations, scenes](#8-assets-characters-locations-scenes)
9. [Workflows](#9-workflows)
10. [Style rules](#10-style-rules)
11. [Troubleshooting](#11-troubleshooting)
12. [Status, limitations and ideas](#12-status-limitations-and-ideas)

---

## 1. What this project is

*Jester Fester* is a 2D cartoon series animated **entirely in code**. No drawing program and no video editor are involved:

- Characters are JavaScript functions that draw themselves on an HTML canvas from a set of pose options (arm targets, eye shape, mouth, hat droop…).
- Locations are 3D sets drawn in one-point perspective, so a virtual camera can dolly, tilt and pan through them.
- A scene is a list of *shots*. Each shot is a function that paints the whole frame for a given time `t`.
- The **studio** (`studio.html`, served by `npm run studio`) plays scenes live in the browser, lets you browse every character pose and fly a camera through every location, and **exports MP4 straight from the browser** (WebCodecs): no image frames on disk.
- `render.mjs` is the command-line route: it opens the same page in headless Chrome, paints every frame (24 fps, 1920×1080) in parallel to JPEGs, and encodes an MP4 with ffmpeg.

The architecture follows the sibling project `../PDoomVideo` (a p5.brush watercolour music video): a storyboard, an animation guide, rigs as functions, pure-function frames, and contact sheets to check the work. The main difference is that this project uses clean Canvas 2D ink-and-fill drawing instead of WebGL watercolour. That suits a cartoon look, renders in milliseconds per frame, and has no GPU dependency.

**Current cast:** Jester Fester (the jester) and Princess Pearl (a plush rainbow dolphin in a crown).
**Current set:** the throne room.
**Current scenes:** `scene01_juggling` (30 s) and `scene02_fired` (37 s). The movie is 1:07.

---

## 2. Moving to a new machine

### 2.1 What to copy

Copy the whole `JesterFester/` folder **except**:

| Skip | Why |
|---|---|
| `node_modules/` (~100 MB) | Platform-specific (the bundled ffmpeg binary differs per OS). Recreate it with `npm install` |
| `out/` (can exceed 1 GB) | Renders, all regenerable. Keep only the MP4s you want to archive |
| `.DS_Store` | macOS clutter |

`.gitignore` already excludes `node_modules/` and `out/`, so the cleanest way to move is git:

```bash
cd JesterFester
git init
git add .
git commit -m "Jester Fester: scenes 01–02"
git remote add origin <your private repo URL>
git push -u origin main
```

Then run `git clone <url>` on the new machine. Without git, make a zip instead:

```bash
zip -r jester-fester.zip JesterFester -x "JesterFester/node_modules/*" "JesterFester/out/*" "*.DS_Store"
```

> The reference images (`characters/*/reference.*`, `locations/*/reference_*.jpg`) are part of the project. Keep them: they're the model sheets for the art.

### 2.2 Requirements

| Tool | Version | Notes |
|---|---|---|
| **Node.js** | 18+ (developed on 25.2) | https://nodejs.org |
| **Google Chrome** | any recent version | Found automatically at the default install path on macOS, Windows and Linux. Otherwise pass `--chrome=<path>` or set `CHROME=<path>`. Chromium or Edge work too via that flag |
| **ffmpeg** | nothing to install | The `ffmpeg-static` npm package supplies one. A system `ffmpeg` on the PATH takes priority, and `FFMPEG=<path>` overrides both |
| **Python 3** | any | Used only by `scripts/new.sh` to edit `registry.js` |
| **Internet** | for fonts | Bubble and SFX fonts (Fredoka, Luckiest Guy) load from Google Fonts. Offline renders fall back to Chalkboard SE / Marker Felt / system fonts |
| **bash** | any | For `scripts/*.sh`. On Windows use Git Bash or WSL, or call `node render.mjs …` directly |

npm packages (pinned in `package-lock.json`): `puppeteer-core` 24.x (drives Chrome for `render.mjs`), `ffmpeg-static` 5.x (ffmpeg 6.0 binary) and `mp4-muxer` 5.x (MP4 writer for the studio's in-browser export).

The studio's **Export** buttons need a browser with WebCodecs H.264: Chrome or Edge 94+ (Safari and Firefox can view but not export).

### 2.3 Set up and verify

```bash
npm install
node render.mjs --doctor
```

`--doctor` prints a checklist:

```
✔ Node.js 25.2.1
✔ npm packages installed
✔ Chrome: /Applications/Google Chrome.app/Contents/MacOS/Google Chrome
✔ ffmpeg: …/node_modules/ffmpeg-static/ffmpeg (ffmpeg version 6.0)
✔ studio loads · 4 scenes registered · "scene01_juggling" is 30s @ 24 fps
✔ web fonts (Fredoka, Luckiest Guy) loaded
✔ test frame rendered → out/check/doctor.png
```

Anything marked ✘ comes with a suggested fix. Open `out/check/doctor.png` to confirm the picture looks right, then build:

```bash
scripts/build_movie.sh      # about 1 minute on a 10-core laptop
```

---

## 3. Project map

```
JesterFester/
├── README.md                  overview + common commands
├── SERIES.md                  the series bible: premise, tone, look, cast / sets / episodes (links into the folders)
├── ANIMATION_GUIDE.md         short brief on writing scenes/rigs (the rules; this handbook has the detail)
├── docs/HANDBOOK.md           ← this file
├── package.json / -lock.json  npm dependencies
├── registry.js                ★ the asset folder names + the movie order
├── studio.html                the studio page; also the page render.mjs paints frames in (?render)
├── studio/                    the studio UI: studio.js (asset browsers, player) · export.js (in-browser MP4) · studio.css
├── serve.mjs                  tiny local web server for the studio (npm run studio → http://localhost:5173)
├── render.mjs                 the command-line renderer / encoder / movie assembler / doctor
│
├── engine/                    shared code, loaded before everything else
│   ├── core.js                canvas globals, math, timing, jitter, shapes, IK, 2D camera, overlays, SFX, iris, layers, measure
│   ├── persp.js               3D one-point perspective camera for sets
│   ├── callout.js             speech / shout / thought bubbles + lip-flap
│   ├── timeline.js            scene registry, CHARACTERS/LOCATIONS registries, paintFrame/drawFrame, grain
│   └── showcase.js            model sheets, character views, location views (used by the studio + test scenes)
│
├── characters/                every folder: asset.js (manifest) · README.md (description) · code · reference art
│   ├── jester_fester/         jester_fester.js (rig + poses) · juggling.js (cascade + balls) · reference.webp
│   └── princess_pearl/        princess_pearl.js (rig + poses) · reference.webp
│
├── locations/
│   └── throne_room/           throne_room.js (3D set, spots, cameras) · reference_hall.jpg · reference_throne.jpg
│
├── scenes/                    every folder: asset.js · README.md (synopsis, script, shot list) · scene.js · (audio.mp3)
│   ├── scene01_juggling/
│   └── scene02_fired/
│
├── scripts/
│   ├── build_scene.sh         paint + encode one scene
│   ├── build_movie.sh         build all scenes in movie order + join
│   ├── preview.sh             contact sheet / preview clip / open the studio
│   ├── new.sh                 create a character / location / scene folder from a template + register it
│   └── templates/             character/ · location/ · scene/ (asset.js, README.md, code)
│
└── out/                       (generated, git-ignored)
    ├── check/                 contact sheets, doctor.png
    ├── <scene>/frames/        f00000.jpg … one per frame
    ├── <scene>/<scene>.mp4    the encoded scene
    ├── <scene>/clip_a-b.mp4   quick preview clips
    ├── movie_list.txt         concat list
    └── movie.mp4              all scenes joined
```

---

## 4. How a frame gets made

```
render.mjs ──launches──▶ headless Chrome ──opens──▶ studio.html?render&scene=<id>
                                                  │
     loads in order:  engine/core.js → persp.js → callout.js → timeline.js → showcase.js → registry.js
                      → for every folder in registry.js: <folder>/asset.js (the manifest), then the files it lists
                        characters → locations → scenes  (each registers itself / calls scene({...}))
                                                  │
render.mjs calls window.renderAt(t) ─────────────▶ drawFrame(t)   (engine/timeline.js)
                                                  1. reset: T = t, reseed boil jitter, clear overlays/camera
                                                  2. find the shot whose start ≤ t, call shot(t, lt, dur)
                                                        a shot typically does:
                                                        P = persp(camera(t))                 3D camera
                                                        layer(() => set.back(P, t), {blur})  the set, softened
                                                        character(sx, sy, s, pose)           rigs
                                                        set.front(P, t)                      near pillars over the characters
                                                        callout(...) / sfx(...) / iris(...)  queued overlays
                                                  3. multiply paper grain + vignette
                                                  4. paint overlays (bubbles, SFX, iris) in screen space
                                                  │
                          ◀──── canvas.toDataURL (JPEG) ─────┘
render.mjs writes out/<scene>/frames/f#####.jpg   (N parallel Chrome pages; any order)
then ffmpeg: frames + audio (or silence) → H.264 CRF 17, AAC 192k, 24 fps → out/<scene>/<scene>.mp4
--movie: ffmpeg concat (stream copy) of the scene MP4s in REGISTRY.movie order → out/movie.mp4
```

Performance: a frame paints in about 2–10 ms. With 8 workers a 30 s scene (720 frames) takes around 15 s to paint and 15 s to encode.

**The same frames, two ways to a video.** Both paths call the very same `drawFrame(t)`, so their pictures are identical:

| | Studio **Export** button (browser) | `render.mjs --build` (command line) |
|---|---|---|
| How | canvas → WebCodecs H.264 encoder → mp4-muxer, in memory | JPEG per frame on disk → ffmpeg x264 |
| Speed | ~90–140 fps (a 30 s scene in ~5–8 s) | ~15 s paint + ~15 s encode per 30 s scene |
| Output | a download (`<scene>.mp4` / `movie.mp4`) | `out/<scene>/<scene>.mp4`, `out/movie.mp4` |
| Quality | 4 / 8 / 16 Mbps presets | x264 CRF 17 (visually lossless), larger files |
| Audio | yes, when opened via `npm run studio` (http); skipped under `file://` | yes, always |
| Best for | "I like it, export it" while working | batch builds, archival masters, CI, other machines without a GUI |

---

## 5. Command reference

### 5.1 `render.mjs`

Run from the project root. `--scene` defaults to the first entry of `REGISTRY.movie`.

| Command | What it does | Output |
|---|---|---|
| `node render.mjs --doctor` | Checks the environment and renders a test frame | `out/check/doctor.png` |
| `node render.mjs --list` | Lists registered characters, locations, scenes and the movie order | — |
| `node render.mjs --modelsheet=<character> [--t=1.1]` | A character's model sheet (every registered pose) | `out/check/modelsheet_<id>.png` |
| `node render.mjs --location=<id> [--character=<id>] [--spot=<name>]` | Every camera preset of a location on one labelled sheet, optionally with a stand-in on a spot | `out/check/location_<id>.jpg` |
| `--scene=<id> --sheet=1,4.5,9 [--cols=3] [--w=640] [--out=path.jpg]` | **Contact sheet**: several times on one image, with per-frame ms. The main way to check work | `out/check/<id>.jpg` |
| `--scene=<id> --stills=5,12.5 [--out=dir]` | Full-resolution PNGs | `out/<id>/stills/t5_00.png` … |
| `--scene=<id> --clip=6:12` | Quick preview MP4 of a time range (no audio) | `out/<id>/clip_6-12.mp4` |
| `--scene=<id> --frames[=a:b] [--workers=N] [--resume]` | Paints frames. With no range the frames folder is **wiped first** (so there are no stale frames); `--resume` keeps existing ones | `out/<id>/frames/` |
| `--scene=<id> --encode` | Frames + audio → MP4 | `out/<id>/<id>.mp4` |
| `--scene=<id> --build` | `--frames` then `--encode` | same |
| `--movie [--skip-build]` | Builds every scene in `REGISTRY.movie` (or re-encodes existing frames with `--skip-build`) and joins them | `out/movie.mp4` |

Global options: `--chrome=<path>` (or `CHROME=`), `--fps=<n>` (overrides the scene's fps), `--workers=<n>` (default: CPU cores − 2, capped at 8), and the `FFMPEG=<path>` environment variable.

**Consecutive-frame sheet** (for checking motion around a hit):

```bash
node render.mjs --scene=scene01_juggling --cols=6 --w=420 \
  --sheet=$(python3 -c "print(','.join(f'{23.28+i/24:.4f}' for i in range(12)))")
```

### 5.2 Scripts

| Script | Use |
|---|---|
| `scripts/build_scene.sh <id> [render options]` | Compiles one scene → `out/<id>/<id>.mp4` |
| `scripts/build_movie.sh [--skip-build]` | Compiles every scene, joined → `out/movie.mp4` |
| `scripts/preview.sh sheet <id> <times> [cols]` | Contact sheet |
| `scripts/preview.sh clip <id> <a:b>` | Preview clip |
| `scripts/preview.sh studio` | Starts `serve.mjs` and opens the studio in your default browser (same as `npm run studio`) |
| `scripts/new.sh character\|location\|scene <name>` | Creates a self-contained folder (`asset.js`, `README.md`, code) from `scripts/templates/<kind>/` and registers it (a new scene is also appended to the movie order) |

### 5.3 The studio

```bash
npm run studio          # = node serve.mjs --open → http://localhost:5173/  (Ctrl+C to stop; port: node serve.mjs 8080)
```

You can also double-click `studio.html` (`file://`): everything works except that exports can't read scene audio files there.

The sidebar lists every asset from `registry.js`:

**🎬 Scenes** (movie scenes numbered, 🧪 test scenes after them)
- A **shot timeline**: one block per shot, labelled with the shot function's name. Click one to jump to its start; the playing shot is highlighted.
- A scrubber, ⏮ ◀︎ ▶ ▶︎ ⏭, speed (¼× – 2×) and loop. The readout shows time, frame number, the shot and the time inside the shot.
- **Audio preview**: if the scene's `audio` file exists, it plays in sync (the header shows `audio: ♪ …` or `none yet`).
- **⬇ Export scene MP4** / **⬇ Export movie MP4** (all scenes in `REGISTRY.movie` order), with a quality preset, a progress bar with an ETA, and **Cancel**. The file downloads when done. Warnings (e.g. audio skipped) show in the status line.
- **📷 Snapshot PNG**: the current frame at full 1920×1080.

**🎭 Characters**
- **Pose** view: pick any registered pose chip. The **Backdrop** is Paper, or a location at true scale (standing on its stage mark, background softened). Adjust **Zoom**, and toggle **animate** (boil, blinks, idle motion).
- **Model sheet** view: every pose on one page (also `node render.mjs --modelsheet=<id>`).
- The reference image sits beside the pose chips; click it to enlarge.

**🏰 Locations**
- **Camera presets** (chips), plus sliders for `x` pan, `y` eye height, `z` dolly, `f` focal and `hy` tilt.
- **Mouse**: drag to pan/tilt, wheel to dolly, ⇧+wheel to zoom (focal). **Keys**: `W/S` dolly, `A/D` pan, `Q/E` up/down, `R/F` tilt, ⇧ = faster.
- The camera readout (`{ x, y, z, f, hy }`) has **Copy camera**, ready to paste into `persp(…)` in a scene.
- **Stand-in**: drop any character in any pose onto one of the location's **spots** (stage mark, before the dais, throne seat, …) to check scale and framing.

**📄 Docs:** every asset's `README.md` opens beside the preview (toggle with the 📄 Docs button; the choice is remembered). Links between READMEs open the linked asset. The sidebar's **Project** section opens `README.md`, `SERIES.md`, `ANIMATION_GUIDE.md` and this handbook full-width. Docs need `npm run studio` (http); from `file://` the pane explains how to open them.

**Keys everywhere:** Space = play/pause (or animate on/off). In scenes: ←/→ = one frame, ⇧+←/→ = 1 s, Home/End.

**URLs:** `/?scene=scene02_fired&t=25.9`, `/?character=princess_pearl`, `/?location=throne_room`, `/?doc=SERIES.md`.

If a script has an error, it's printed in red at the top of the page (and in the DevTools console).

---

## 6. Core concepts

### 6.1 Frames are pure functions of time

Frames are painted **in parallel and out of order**, so a shot must compute everything from `t`:

- no variables that carry over between frames and no simulation "steps";
- no `Math.random()`: use `hash(i)` for stable randomness, and `jit(a)` for jitter that changes 12× per second ("boil");
- physics is written in closed form (see `dropY()` in scene 02 for bounces, and `cascade()` for juggling).

### 6.2 Scenes, shots and cuts

```js
scene({ id, title, duration, fps: 24, bpm: 100, audio: 'scenes/<id>/audio.mp3',
        shots: [[0, shotA], [7.5, shotB], ...] });
```

A shot is `fn(t, lt, dur)`. `t` is scene time, `lt` is the time since the shot started and `dur` is the shot length. The shot paints the **entire** frame. A cut happens at each shot's start time. For one continuous camera move across several shots, give them the same camera function of `t` (scene 01's `camA` spans 0–14 s across two shots).

### 6.3 World, sets and the perspective camera

Sets are 3D. The axes are **X right, Y up (floor = 0), Z into the screen**, in world units: Fester is about 170 tall, Pearl sitting is about 180.

```js
const P = persp({ x, y: eyeHeight, z, f: 1000, hy: horizonY });
const [sx, sy, k] = P.p(X, Y, Z);      // screen point + px-per-world-unit at that depth
```

- **Dolly**: change `z`. **Pan**: change `x`. **Tilt up**: raise `hy` (the whole world slides down the screen). **Zoom / telephoto**: raise `f`.
- **Keep a character's feet at a fixed screen height** while the camera moves by solving `hy = feetY - y * k`, where `k = f / (Zchar - z)`. Every scene camera uses this idiom.
- To place a character, project its floor point and scale by depth: `jester(sx, sy, JF_UNIT * k, pose)`.

### 6.4 Layers, depth of field and draw order

```js
layer(() => set.back(P, t, { splitZ: charZ }), { blur: 2.6 });   // softened set
character(...);                                                  // sharp
set.front(P, t, { splitZ: charZ });                              // pillars nearer than the character
```

`back()` paints everything farther than `splitZ`, and `front()` paints what is nearer. Blur of about 0 px suits wide shots and 2–4.5 px suits medium and close shots. A background character (e.g. Pearl behind Fester) can be painted **inside** the layer so it softens too.

### 6.5 Overlays

`callout`, `sfx`, `flash` and `iris` don't draw immediately. They queue an overlay that is painted last, in screen space, above the grain. So text is always crisp and always on top, whatever the camera does. Call `iris()` after any callout if the iris should cover it.

### 6.6 Boil

Character outlines are re-jittered 12 times per second (`BOIL = 12`), about 0.6–0.7 px, which gives the hand-drawn "living line". Sets are drawn with no jitter. Control it with `withBoil(px, fn)` or a rig's `boil` option.

### 6.7 Anchors and measure()

Rigs return screen-space **anchors** (`head`, `mouth`, `hatTip`, `handL`…). Scenes use them to attach props (the ball balanced on Fester's hat), aim speech-bubble tails and centre the iris. If you need an anchor *before* deciding the pose (e.g. the bubble decides whether the mouth flaps), use `const A = measure(() => pearl(...))`. It runs the draw on an invisible canvas, so nothing is painted twice.

---

## 7. Engine API reference

### 7.1 Globals (`engine/core.js`)

| Name | Meaning |
|---|---|
| `W, H` | 1920, 1080 |
| `X` | the current `CanvasRenderingContext2D` (swapped by `layer`/`measure`) |
| `T` | current frame time |
| `PAL` | shared colours: `ink, inkSoft, cream, white, crimson, plum, gold, goldDk, goldLt, blue, green, orange, sky, rose, pink` |
| `BPM, BEAT_OFF` | tempo grid (set from the scene's `bpm` / `beatOffset`) |
| `FONT_SFX, FONT_TALK` | font stacks for SFX (Luckiest Guy) and bubbles (Fredoka) |

### 7.2 Math and timing

| Function | Returns |
|---|---|
| `clamp(x, a=0, b=1)`, `lerp(a, b, x)`, `frac(x)`, `mixPt(p, q, k)` | the basics |
| `seg(t, a, b)` | 0..1 progress of t through [a, b] |
| `ease`, `easeIn`, `easeOut`, `backOut` (overshoot), `elasticOut` | easings of 0..1 |
| `kf(t, [[t0, v0], [t1, v1], …], easeFn=ease)` | keyframe interpolation; values can be numbers or arrays |
| `kick(t, t0, decay=6)` | an impulse: 0 before t0, 1 at t0, then decays |
| `boing(t, t0, freq=3, decay=5)` | a damped cosine wobble starting at t0 |
| `wob(t, freq=1, phase=0)` | a sine in −1..1 |
| `pulse(t, k=6)` / `beatPos(t)` | 1 on each beat of `BPM`, then decays / fractional beat count |
| `hash(i)` | stable pseudo-random 0..1 |
| `jit(a)` | boil jitter in ±a (changes 12×/s) |
| `mixCol(hexA, hexB, k)`, `rgba(hex, a)` | colour mixing |

### 7.3 Drawing

| Function | Notes |
|---|---|
| `shape(pts, o)` | a polygon or curve. `o`: `fill`, `stroke` (defaults to ink; `null` = none), `lw` (local units) or `lwPx` (screen px), `smooth` (`true` or 0..1 = Catmull-Rom), `closed` (default true), `alpha`, `dash`, `cap` |
| `line(pts, o)` | an open stroke; `o.stroke`/`o.col`, `lw`/`lwPx`, `smooth`, `cap`, `dash` |
| `ellipse(cx, cy, rx, ry, o)`, `circle(cx, cy, r, o)` | `o.rot` rotates the ellipse |
| `rectPts`, `ellPts(cx, cy, rx, ry, n, rot)`, `starPts(cx, cy, r, inner, n, rot)` | point generators |
| `linGrad(x0, y0, x1, y1, [[0, c], [1, c]])`, `radGrad(x, y, r0, r1, stops)` | gradients (use as `fill`) |
| `tracePath(pts, closed, smooth)` + `paintPath(o)` | low level: build a path, then fill/stroke it (for clipping) |
| `polyLen`, `polyAt(pts, f)`, `polySlice(pts, f0, f1)` | walking along limbs (stripes, bands) |
| `ik2(root, target, lenA, lenB, prefDir)` | two-bone IK → `{ joint, end }`; picks the bend toward `prefDir` |
| `toPx(x, y)` | local point → screen px (for anchors) |
| `withBoil(px, fn)`, `pxScale()` | jitter amount; current px per local unit |

### 7.4 Cameras, layers and FX

| Function | Notes |
|---|---|
| `persp(cam)` (persp.js) | → `P` with `p(X,Y,Z)`, `k(Z)`, `visible(Z)`, `poly([[X,Y,Z]…])` (near-clipped polygon), `line(...)`, `plane(Z, fn)` (draw in world units on a screen-facing plane; local y = −Y), `floorCircle(X, Z, r, Y, n)` |
| `camBegin(cx, cy, zoom, rot)` / `camEnd()` | 2D screen camera over the frame (roll, shake, punch-in). One level only. `toScreen()` maps through it |
| `shakeXY(t, amount)` | deterministic shake offset `[dx, dy]`; pass `W/2 - dx, H/2 - dy` to `camBegin` |
| `layer(fn, { blur, filter })` | paints fn into an offscreen layer, then composites it with a CSS filter |
| `measure(fn)` | runs fn invisibly and returns its result (anchors) |
| `sfx(txt, x, y, size, colour, age, { life, rot, scale })` | comic sound effect: pops in, wobbles, fades |
| `flash(k, colour)` | full-frame flash |
| `iris(cx, cy, r, colour)` | classic iris-out: everything outside the circle is filled |

### 7.5 Callouts (`engine/callout.js`)

```js
const said = callout(text, ax, ay, age, {
  dx, dy,          // bubble centre offset from the anchor (px); it's clamped so the bubble stays in frame
  size: 56,        // font px
  maxW: 720,       // wrap width px
  cps: 18,         // typing speed, chars per second
  hold: 1.6,       // seconds the full line stays up after typing (or dur: total)
  kind: 'talk',    // 'talk' | 'shout' (spiky) | 'think' (cloud with dots)
  accent,          // colour for *asterisked* words
});
jester(..., { mouth: lipFlap(t, said.talking, 'grin') });
```

- `text` may contain `*emphasis*`.
- `(ax, ay)` is where the tail points. Aim it beside the head (e.g. `sx + 3.9*s, sy - 16.6*s` for Fester) so the tail doesn't cross the face.
- `age` is the seconds since the line started. The call returns `{ talking, visible }`.
- `lipFlap(t, talking, rest, shapes)` cycles mouth shapes about 9× per second while talking.

### 7.6 Timeline (`engine/timeline.js`)

| Name | Notes |
|---|---|
| `scene(def)` | registers a scene (see 6.2) |
| `SCENES`, `CHARACTERS`, `LOCATIONS` | registries: rigs set `CHARACTERS.<name> = { draw, unit, palette }` and sets set `LOCATIONS.<name> = obj` |
| `useScene(id)` | selects the scene (sets BPM) |
| `drawFrame(t, sc = SCENE)` | paints one complete scene frame (see §4) |
| `paintFrame(t, fn)` | paints one complete frame with any painter `fn(t)`, with the same reset / grain / overlays as scenes (the studio's character and location views use it) |
| `shotAt(scene, t)` | `{ index, t0, end, fn }` for the shot playing at t |

### 7.7 Showcase (`engine/showcase.js`) and in-browser export (`studio/export.js`)

| Name | Notes |
|---|---|
| `drawModelSheet(entry, t)` | every pose of `CHARACTERS.<name>` on one labelled page |
| `drawCharacterView(entry, pose, t, { location, zoom })` | one pose, big, on paper or on a location's stage mark |
| `drawLocationView(loc, cam, t, { character, pose, spot })` | a set through a free camera, with an optional stand-in |
| `drawPose(entry, name, x, y, s, t)`, `poseNames(entry)`, `paperBackdrop()` | helpers |
| `exportVideo({ scenes: [ids], fps, bitrate, onProgress(p, msg), signal })` | → MP4 `Blob` (with `.warnings`, `.frames`, `.seconds`). Paints each frame, encodes with WebCodecs, muxes with mp4-muxer |
| `downloadBlob(blob, name)` | saves a Blob as a download |

---

## 8. Assets: characters, locations, scenes

### 8.1 Every asset is a self-contained folder

Everything about a character, location or scene lives in its own folder: code, description, script, reference art and audio. `registry.js` only lists the folder names (and the movie order).

```
characters/<id>/                      locations/<id>/                     scenes/<id>/
├── asset.js    manifest              ├── asset.js    manifest            ├── asset.js    manifest
├── README.md   who they are, look,   ├── README.md   description,        ├── README.md   synopsis, script,
│               personality, rig API  │               layout, spots,      │               shot list, editing notes
├── <id>.js     the rig + poses       │               cameras             ├── scene.js    the shots
├── …           skills/props (e.g.    ├── <id>.js     the 3D set +        └── audio.mp3   soundtrack (optional)
│               juggling.js)          │               spots + cameras
└── reference.* reference art         └── reference_*  reference art
```

**The manifest (`asset.js`)** is read by the studio and the renderer:

```js
asset({
  title: 'Fired!',                                  // display name
  logline: 'Fester tells Princess Pearl a chicken joke…',
  files: ['scene.js'],                              // code in this folder, in load order
  docs: 'README.md',                                // the description / script (default README.md)
  refs: ['reference.webp'],                         // reference art in this folder (characters, locations)
  audio: 'audio.mp3',                               // scenes: soundtrack (optional; silence if missing)
  cast: ['princess_pearl', 'jester_fester'],        // scenes: character ids (the studio cross-links them)
  locations: ['throne_room'],                       // scenes: location ids
});
```

Paths in a manifest are relative to its folder. A scene's `id`, `title` and `audio` come from its manifest, so `scene.js` only declares `duration`, `fps`, `bpm` and `shots`.

**Loading.** For each folder in `registry.js` (characters → locations → scenes), the studio loads `asset.js` and then the files it lists. So a scene can use any character or location.

**The code registers the runtime parts:**
- `CHARACTERS.<id> = { draw, unit, size, poses }`: poses appear as the studio's pose chips and the model sheet.
- `LOCATIONS.<id> = { back, front, MARK, spots, cameras, … }`: spots and cameras appear in the location browser.
- `scene({ duration, fps, bpm, shots })`.

**In the studio**, every asset shows its README in the docs pane (📄 Docs) beside the preview, with its reference art and cross-links: a scene's cast and locations, and the scenes a character or location appears in.

### 8.2 The assets so far

| Asset | Folder docs |
|---|---|
| 🎭 Jester Fester | [characters/jester_fester/README.md](../characters/jester_fester/README.md): personality, look and palette, proportions, poses, rig + juggling API |
| 🎭 Princess Pearl | [characters/princess_pearl/README.md](../characters/princess_pearl/README.md): personality, look and palette, spine rig, poses, API |
| 🎓 Professor Safadi | [characters/safadi/README.md](../characters/safadi/README.md): personality, powers, look and palette, proportions, poses, rig + `safadiBoard` API |
| 💃 Alma | [characters/alma/README.md](../characters/alma/README.md): personality, dance powers, look and palette, proportions, poses, rig + `almaDance` API |
| 🏰 Throne room | [locations/throne_room/README.md](../locations/throne_room/README.md): description, layout and coordinates, spots, camera presets, API |
| 🏫 Dove Creek Elementary | [locations/dces/README.md](../locations/dces/README.md): description, layout and coordinates, spots, camera presets, API |
| 🎬 01 Juggling in the throne room | [scenes/scene01_juggling/README.md](../scenes/scene01_juggling/README.md): synopsis, script, shot list, constants |
| 🎬 02 Fired! | [scenes/scene02_fired/README.md](../scenes/scene02_fired/README.md): synopsis, script, shot list, constants |
| 🎬 03 Once a dragon | [scenes/scene03_once_a_dragon/README.md](../scenes/scene03_once_a_dragon/README.md): synopsis, script, shot list, constants |
| 🎬 04 The healthy promise | [scenes/scene04_healthy_promise/README.md](../scenes/scene04_healthy_promise/README.md): synopsis, script, shot list, constants |

The series-level story, tone and episode list are in [SERIES.md](../SERIES.md).

**Model sheets** (every registered pose of a character on one page): the studio's character browser → *Model sheet*, or from the command line:

```bash
node render.mjs --modelsheet=jester_fester          # → out/check/modelsheet_jester_fester.png
```

---

## 9. Workflows

### 9.1 Iterating on a scene

1. Keep the studio open (`npm run studio`) on the scene. Edit `scenes/<id>/scene.js`, then reload the page (⌘R / Ctrl+R) to see the change; scrub, play and step frames.
2. For fixed side-by-side comparisons, check a contact sheet: `node render.mjs --scene=<id> --sheet=<times> --cols=3` and open `out/check/<id>.jpg`.
   - Check the first and last frame of each shot, the moment of each hit, and every cut.
   - Check that text is readable, faces aren't covered, and nothing important is cut off at the frame edge.
3. Check motion with a consecutive-frame sheet (§5.1) or `--clip=a:b`.
4. When you like it: **⬇ Export scene MP4** in the studio (fast, downloads the file), or build with `scripts/build_scene.sh <id>` / `scripts/build_movie.sh` for the command-line masters in `out/`.

### 9.2 Adding a character

1. `scripts/new.sh character <name>` creates `characters/<name>/` with `asset.js`, a `README.md` skeleton and `<name>.js` (a placeholder rig with two poses), and registers it.
2. Put the reference art in the folder, list it in `asset.js` (`refs`), set the `title` and `logline`, and write the `README.md`: who they are, look and palette, proportions, poses, API.
3. Build the rig following `jester_fester.js` (a limbed human) or `princess_pearl.js` (a spine-based creature):
   - `name(x, y, s, o)` with `(x, y)` = the ground point and `s` = px per unit;
   - `withBoil(o.boil ?? .7, …)` around the drawing;
   - IK targets for limbs; face options for expressions;
   - return screen anchors via `toPx()`;
   - `CHARACTERS.<name> = { draw, unit, palette }`.
4. Fill in the registration (`size`, `poses`) and iterate in the studio's character browser (Pose and Model sheet views, with the README beside them; reload after each edit) until every pose reads well.
5. Add a line for the character to `SERIES.md` → Cast.

### 9.3 Adding a location

1. `scripts/new.sh location <name>` creates `locations/<name>/` with `asset.js`, a `README.md` skeleton and `<name>.js` (a perspective-set template: floor + back wall), and registers it.
2. Build it in world units following `throne_room.js`:
   - big surfaces via `P.poly([...])` (near-clipped);
   - fronto-parallel pieces via `P.plane(Z, fn)`;
   - depth-sorted *items* (`{ z, draw }`) split between `back()` and `front()` by `splitZ`;
   - expose a `MARK` (where characters stand) and any helper anchors.
3. Register `spots` and `cameras` in the code (see the throne room's `README.md`), then fly through it in the studio's location browser with a stand-in character to check scale.
4. Keep sets jitter-free (JIT 0) and use `lwPx` outlines around 1.5–2 px.
5. Document its description, layout, spots and cameras in its `README.md`, add reference art to the folder (`refs` in `asset.js`), and add a line to `SERIES.md` → Sets.

### 9.4 Adding a scene

1. `scripts/new.sh scene sceneNN_name` creates `scenes/sceneNN_name/` with `asset.js`, a `README.md` skeleton and a working `scene.js`, and adds it to the registry **and the end of the movie order**. Reorder `REGISTRY.movie` if needed.
2. Write the scene's `README.md` first: synopsis, script (time · who · line/action) and shot list. Set `title`, `logline`, `cast` and `locations` in `asset.js`.
3. Implement the shots. The template has one working shot (Fester in the throne room with a callout). Useful patterns to copy:
   - a camera that keeps the feet at a screen height (`hy = feetY - y*k`);
   - `layer()` depth of field;
   - `measure()` → `callout()` → `lipFlap()` for dialogue;
   - `kick/boing` for impacts, and `shakeXY` + `camBegin` for shake;
   - `iris()` to end.
4. Add the scene to `SERIES.md` → Episodes, and keep its README's script and shot list in step with the code.

### 9.5 Adding audio

1. Save the file as `scenes/<id>/audio.mp3` (the `audio` field in the scene's `asset.js`; any format the browser and ffmpeg can read works if you change the name there).
2. Set `bpm` (and `beatOffset` in seconds, if the first beat isn't at 0) in `scene({...})`. Then `pulse(t)` hits on the song's beats.
3. Re-time hits to land on beats: beat n falls at `beatOffset + n * 60 / bpm`. Put key times (e.g. `HITS`, `FIRE`) on that grid.
4. Rebuild. The encoder muxes the audio, trimmed to the video length. Without audio, a silent track is added so scenes always concatenate cleanly.

### 9.6 Changing resolution or frame rate

- Frame rate: set `fps` per scene (or pass `--fps=` to the renderer). Everything is time-based, so motion is unaffected.
- Resolution: `W`/`H` in `engine/core.js` and the `<canvas width/height>` in `studio.html`. The layouts assume 1920×1080, so camera framings may need re-tuning.

---

## 10. Style rules

- **Look:** a clean 2D cartoon.
  - Characters have flat, saturated fills with plum ink outlines (Fester `#3B2530`, Pearl a softer `#5B3552`) and a light line boil.
  - Sets are pastel with gentle gradients, thin outlines and no boil.
  - Paper grain and a soft vignette go over everything.
- **Readability:**
  - One focal action per shot.
  - Keep the lead character large: about 55–75% of frame height in medium shots.
  - Soften the background (depth of field).
- **Motion:**
  - The camera always drifts, pushes or tilts.
  - Characters bob, and hats, bells and tails swing.
  - Use anticipation before big actions, squash on impacts and overshoot on poses.
  - Mood changes go through a blink or squeeze and an emote; faces never snap.
- **Text:**
  - One short callout at a time, beside the head (the tail must not cross the face).
  - A few SFX, only on hits.
  - No labels or captions.
- **Continuity:** keep the screen direction consistent in shot/reverse-shot. Recurring gags are welcome: balls bonking Fester, *"story of my life"*.

---

## 11. Troubleshooting

| Symptom | Fix |
|---|---|
| `Chrome: not found` / launch errors | Install Chrome, or run `node render.mjs --chrome="/path/to/chrome" …` (or `export CHROME=…`). Chromium and Edge also work |
| ffmpeg errors / not found | `npm install` (reinstalls `ffmpeg-static` for this OS), or install ffmpeg, or set `FFMPEG=/path/to/ffmpeg` |
| Bubble text looks different (not rounded) | The Google Fonts didn't load (offline). Connect and re-render; `--doctor` reports font status |
| A page error during render (`[page error] …`) | A JS error in a scene or rig. Open `studio.html?scene=<id>&t=<time>` in Chrome to see it (red text + DevTools console) |
| The video shows an old version of a shot | You rendered with `--resume` or a range. A full `--frames` / `--build` wipes the frames first; delete `out/<id>/frames` if unsure |
| The movie is missing a scene | Add it to `REGISTRY.movie` in `registry.js` |
| A registry edit by `new.sh` failed | It needs `python3`. Edit `registry.js` by hand: add `name: ['file.js'],` under the right section |
| A character is huge, tiny or off-frame | Check the camera: `k = f / (Zchar - cam.z)`; feet y = `hy + cam.y * k` |
| Something draws enormous or garbled | An object is at or behind the camera (`Z - cam.z` ≤ 15). Use `P.visible(Z)` / `P.poly` (they near-clip), and don't draw characters behind the camera |
| The shell scripts don't run on Windows | Use Git Bash or WSL, or call `node render.mjs --scene=<id> --build` / `--movie` directly |
| `studio.html` shows "no scene loaded" | The `?scene=` id is wrong, or a script failed to load (check the console) |
| Studio export: "no WebCodecs video encoder" | Use Chrome or Edge 94+, or use `node render.mjs --build` |
| Studio export: "mp4-muxer is not loaded" | Run `npm install` (it lives in `node_modules/mp4-muxer`) |
| Studio export has no sound | Open the studio with `npm run studio` (http://localhost:5173), not by double-clicking `studio.html`: under `file://` the browser can't read the audio file |
| `npm run studio`: port already in use | `node serve.mjs 8080 --open` (any free port) |
| Studio: red error `…/asset.js is missing` | Every folder listed in `registry.js` needs an `asset.js` (copy one from `scripts/templates/<kind>/`) |
| Studio: an asset's docs say "Couldn't load … README.md" | Create the README (or fix the `docs` field in `asset.js`) |
| Studio shows an old version after editing | Reload the page. `serve.mjs` sends `no-store`, so a plain reload always picks up changes |

---

## 12. Status, limitations and ideas

**Done**
- Engine: perspective sets, 2D camera, depth of field, callouts (talk/shout/think, auto-clamped to the frame), SFX, iris, boil, measure, grain.
- Renderer: sheets, stills, clips, parallel frames, encode, movie join, doctor.
- Studio: scene player with shot timeline and audio preview; character browser (poses, model sheet, true-scale backdrop); location browser (camera presets, fly-through, copy camera, stand-ins on spots); in-browser MP4 export of a scene or the whole movie.
- Characters: Fester (full body rig + juggling) and Pearl (spine rig: lying, sitting, pointing, turning).
- Set: the throne room.
- Scenes 01 and 02; the movie is 1:07.

**Known limitations**
- No soundtrack or voices yet; every scene has a silent audio track, and the beat grid is a placeholder 100 BPM.
- Fonts need internet at render time.
- Fester is always drawn facing the camera (he turns his head, not his body). For profile or walking-away shots, add a side view to the rig.
- Pearl has no voice-sync beyond `lipFlap`.
- The project isn't under version control yet; see §2.1 to set up git.

**Ideas for next scenes**
- Scene 03: the audition. A line of replacement jesters (new characters) fail spectacularly, and Fester sneaks back in disguise.
- New sets: the castle kitchen, the courtyard, the dungeon.
- Recurring gags: the ball that always finds his head, and the chicken joke's return.
