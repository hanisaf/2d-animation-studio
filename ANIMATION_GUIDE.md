# Animation guide

Read this before writing a scene, rig or set. It is modelled on PDoomVideo's guide: the same "pure function of time" discipline, adapted to a 2D canvas cartoon.

## How a scene works

Every asset is a self-contained folder (see `docs/HANDBOOK.md` §8): a scene is `scenes/<id>/` with `asset.js` (title, logline, cast, locations, audio), `README.md` (synopsis, script, shot list: **write it first**) and `scene.js`, wrapped in an IIFE so its helpers stay private:

```js
(() => {
  const R = LOCATIONS.throne_room, U = JF_UNIT, JZ = R.MARK.z;
  function opening(t, lt, dur) { ... }             // a shot: paints the WHOLE frame
  function payoff(t, lt, dur) { ... }
  scene({ duration: 20, fps: 24, bpm: 100,          // id, title and audio come from the folder's asset.js
          shots: [[0, opening], [8.5, payoff]] });
})();
```

- A shot is called as `fn(t, lt, dur)`: scene time, time since the shot started, and shot length. Cuts land on each shot's start time. Several shots can share one camera function to make a continuous move (see `camA` in scene 01).
- **Frames render in parallel and out of order.** Every shot must be a pure function of `t`. Keep no state between frames and never call `Math.random()`. Use `hash(i)` for stable randomness and `jit(a)` for hand-drawn wobble.
- Create assets with `scripts/new.sh character|location|scene <name>`: it makes the folder from a template and adds the name to `registry.js`. Extra code files go in the folder and in its `asset.js` `files` list.

## Canvas, sets and the camera

- The frame is 1920×1080, with y pointing down.
- **Sets are 3D** (`engine/persp.js`). World axes are X right, Y up (floor = 0) and Z into the screen; a person is about 170 units tall. A shot builds a camera: `const P = persp({ x, y: eyeHeight, z, f: 1000, hy: horizonY })`.
  - `P.p(X, Y, Z)` returns `[sx, sy, k]`, where `k` is px per world unit at that depth.
  - To dolly, move `z`. To tilt up, raise `hy`. For a telephoto look, raise `f`.
  - Optional 3D camera angles: pass `yaw`, `pitch`, `roll` (radians) or `lookAt: [X, Y, Z]` for orbiting / 2-point / 3-point perspective shots (when omitted, the fast 1-point path runs unchanged).
  - To keep a character's feet at a fixed screen height while dollying, solve `hy = feetY - y * k` (see `camA` / `camB`).
- **Layers & depth sorting:** call `set.back(P, t, { splitZ })`, then the characters, then `set.front(P, t, { splitZ })`. Anything nearer than `splitZ` (columns, for example) is painted over the characters. For scenes with multiple characters/props at arbitrary depths, use `const st = depthStage(P); st.add(zOrPt, fn); st.flush();`.
- **Depth of field, bloom & grading:** wrap the set in `layer(() => set.back(...), { blur })` (resolution ramps smoothly from full to half over `blur: 0.5–1.5`; supports `composite`, `alpha`, and explicit `scale`, including `scale: 1` for full resolution). Use `bloom(fn, { radius, strength })` for glowing lights/magic/sparkles and `grade({ warmth, tint, mode, alpha })` for shot-level colour grading (applied before grain and speech bubbles).
- **Static backgrounds:** `staticLayer(key, fn, options)` caches up to four layers, including baked blur/filter effects. Use it only for painters whose pixels stay fixed for the same key; include every camera, split-depth, palette, lighting, and set-option input in the key. Scene, effective M2/M3 flags, transform, blur/filter, and resolution are included automatically; scene selection clears the cache. Keep animated sets and boiling linework in `layer()` instead. See [the handbook example](docs/HANDBOOK.md#64-layers-depth-of-field-and-draw-order).
- **Lighting & cast shadows (M3):** wrap a shot or character in `withLight({ dir, rim, rimPx, shade, shadePx, tint, shadowColor, shadowSkew }, () => ...)`, then draw subjects with `lit(() => ...)` or `castShadow(() => ..., footX, footY, { reflect, reflectScale, blur })` (runs the character painter once and returns its anchors). Pass `noShadow: fxEnabled('m3')` to the character rig when using `castShadow`.
- **Feature toggles (M2 / M3):** both M2 (`taperStroke`, `trail`, `smear`, `spring`) and M3 (`lit`, `castShadow`) default to **on** and can be toggled in the Studio UI (`brush & motion (M2)`, `lighting & shadows (M3)`), via URL (`?m2=0&m3=0`), CLI (`node render.mjs ... --no-m2 --no-m3`), standalone embeds (`data-m2="false"` / `{ m2: false }`), or per scene (`scene({ fx: { m2: false, m3: false }, ... })`).
- **2D camera** for shake or roll on top: `camBegin(cx, cy, zoom, rot)` … `camEnd()`, with `shakeXY(t, amount)`.

## Drawing API (`engine/core.js`)

- `shape(pts, { fill, stroke, lw | lwPx, smooth, closed, alpha, dash })` fills or strokes a point list. Pass `smooth: true` for a Catmull-Rom curve and `stroke: null` for no outline. `lw` is in local units (it scales with the character); `lwPx` is in screen px.
- `taperStroke(pts, { w0, wMid, w1, lwPx, profile, fill, smooth, alpha })` paints a variable-width brush ribbon (pure vector path; SVG-export safe).
- `line(pts, o)`, `ellipse(cx, cy, rx, ry, o)`, `circle`, `rectPts`, `ellPts`, `starPts`, `linGrad`, `radGrad`, `mixCol`, `rgba`.
- `ik2(root, target, a, b, prefDir)` is two-bone IK for arms and legs. `polyAt` and `polySlice` walk along limbs.
- `withBoil(px, fn, seed)` sets the linework jitter (characters use about 0.7 px; sets use 0). Pass a stable `seed` (e.g. `'jester'`) to isolate a character's jitter from earlier draw calls.
- Timing & motion helpers:
  - `seg(t, a, b)` gives 0..1 progress through [a, b].
  - `kf(t, [[t0, v0], [t1, v1]…], ease)` interpolates keyframes; values may be numbers or arrays.
  - Easings: `ease`, `easeIn`, `easeOut`, `backOut` (overshoot), `elasticOut`.
  - `spring(t, t0, { freq, damp })` transitions 0 → 1 with damped spring overshoot; `kick(t, t0, decay)` is an impulse; `boing(t, t0, freq, decay)` is a damped wobble.
  - `trail(t, fn, { steps, dt, alpha })` paints sub-frame motion afterimages; `smear(ptsNow, ptsPrev, o)` paints a swept motion-blur hull.
  - `wob(t, freq, phase)` is a sine, and `pulse(t)` hits on the beat of `bpm`.
- **Callouts & lip sync:** `callout(text, ax, ay, age, { dx, dy, size, cps, hold, speaker, kind: 'talk' | 'shout' | 'think' | 'whisper' | 'robot' })` draws a speech bubble whose tail points at (ax, ay). Wrap `*words*` in asterisks to colour them. It returns `{ talking, visible, viseme, mouth }`; pass `said` or `said.talking` to `lipFlap(t, said, restMouth)` to sync mouth shapes directly to dialogue syllables (or recorded TTS envelopes in `voice.js`).
- **Effects:**
  - `sfx(txt, x, y, size, colour, age)` is a comic sound effect that pops in and fades out.
  - `flash(k)` is a full-frame flash, and `iris(cx, cy, r)` is an iris-out.
  - These all draw as overlays above everything, in screen space.

## Characters

A character is a function `name(x, y, s, o) → anchors`. `(x, y)` is the floor point between the feet and `s` is px per local unit. In a set, use `s = UNIT * P.k(Z)`. It returns screen-px anchors (`head`, `mouth`, `hatTip`, `handL`, …) that scenes use to attach props, callouts and irises. See `characters/jester_fester/README.md` for Fester's full pose and face options.

**Mood changes are animated, never snapped.** Go through a blink, squeeze or squash and land the new face on an emote pop. Hold expressions long enough to read (at least 0.3 s).

## Style rules

- **Look:** a clean cartoon. Characters use flat saturated fills and plum ink outlines. Sets use pastel fills and gentle gradients, with thinner outlines.
- **Motion:** everything moves. The camera always drifts, pushes or tilts. Characters bob, and their hat tips and bells swing. Use anticipation (a crouch) before big actions, squash on impacts and overshoot on poses (`backOut`, `boing`).
- **Readability:** one focal action per shot, with a clear silhouette. Keep the lead character large (about 55–75% of frame height in medium shots) and soften the background behind them.
- **Text:** one callout at a time, placed beside the head so the tail doesn't cross the face. Use few SFX, and only on hits.

## Checking your work

```bash
node render.mjs --scene=<id> --sheet=1,2.5,4,6 --cols=3 --out=out/check/a.jpg   # contact sheet
node render.mjs --scene=<id> --sheet=$(python3 -c "print(','.join(f'{10+i/24:.4f}' for i in range(6)))") --cols=6   # consecutive frames
node render.mjs --scene=<id> --clip=6:12                                          # preview MP4 of a range
node render.mjs --modelsheet=jester_fester                                        # a character's model sheet
node render.mjs --location=dces --character=jester_fester                         # every camera of a set, stand-in on the mark
```

Check the first and last frame of every shot, motion across consecutive frames around each hit, every cut, and whether the text is readable. Then build with `scripts/build_scene.sh <id>`.
