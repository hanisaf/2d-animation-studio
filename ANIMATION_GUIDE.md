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
  - To keep a character's feet at a fixed screen height while dollying, solve `hy = feetY - y * k` (see `camA` / `camB`).
- **Layers:** call `set.back(P, t, { splitZ })`, then the characters, then `set.front(P, t, { splitZ })`. Anything nearer than `splitZ` (columns, for example) is painted over the characters.
- **Depth of field:** wrap the set in `layer(() => set.back(...), { blur })`. Blur by about 0 px in wide shots and 3–4.5 px in close ones.
- **2D camera** for shake or roll on top: `camBegin(cx, cy, zoom, rot)` … `camEnd()`, with `shakeXY(t, amount)`.

## Drawing API (`engine/core.js`)

- `shape(pts, { fill, stroke, lw | lwPx, smooth, closed, alpha, dash })` fills or strokes a point list. Pass `smooth: true` for a Catmull-Rom curve and `stroke: null` for no outline. `lw` is in local units (it scales with the character); `lwPx` is in screen px.
- `line(pts, o)`, `ellipse(cx, cy, rx, ry, o)`, `circle`, `rectPts`, `ellPts`, `starPts`, `linGrad`, `radGrad`, `mixCol`, `rgba`.
- `ik2(root, target, a, b, prefDir)` is two-bone IK for arms and legs. `polyAt` and `polySlice` walk along limbs.
- `withBoil(px, fn)` sets the linework jitter (characters use about 0.7 px; sets use 0).
- Timing helpers:
  - `seg(t, a, b)` gives 0..1 progress through [a, b].
  - `kf(t, [[t0, v0], [t1, v1]…], ease)` interpolates keyframes; values may be numbers or arrays.
  - Easings: `ease`, `easeIn`, `easeOut`, `backOut` (overshoot), `elasticOut`.
  - `kick(t, t0, decay)` is an impulse, and `boing(t, t0, freq, decay)` is a damped wobble.
  - `wob(t, freq, phase)` is a sine, and `pulse(t)` hits on the beat of `bpm`.
- **Callouts:** `callout(text, ax, ay, age, { dx, dy, size, cps, hold, kind: 'talk' | 'shout' | 'think' })` draws a speech bubble whose tail points at (ax, ay). Wrap `*words*` in asterisks to colour them. It returns `{ talking }`; feed that to `lipFlap(t, talking, restMouth)` for the mouth.
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
