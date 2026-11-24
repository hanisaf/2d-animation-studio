# Safadi Animation Studio — Visual Improvements Implementation Plan

Technical analysis and phased implementation plan for **Section 2 — Visual Improvements (Highest Impact)** from [`ENGINE_ANALYSIS.md`](ENGINE_ANALYSIS.md).

---

## 1. Engine Constraints & Non-Negotiable Invariants

Auditing [`engine/`](../engine/), [`studio/`](../studio/), and the test suite established four hard constraints that every visual upgrade must uphold:

1. **Pure Function of `t` (Parallel & Parity Safe):** Every frame must remain 100% deterministic from `t` alone. [`scripts/test-javascript-export.mjs`](../scripts/test-javascript-export.mjs) (lines 86–93) enforces pixel parity (`diff.count < 128`) between the Studio canvas and standalone exported JS bundles.
2. **No `OfflineAudioContext` at Draw Time:** [`scripts/test-javascript-export.mjs`](../scripts/test-javascript-export.mjs) (line 117) sets `window.OfflineAudioContext = undefined` in exported players. Audio-driven lip sync must therefore operate on **precomputed or deterministic data**, never live Web Audio decoding inside `drawFrame(t)`.
3. **Pure-Vector SVG Export:** [`scripts/test-svg-export.mjs`](../scripts/test-svg-export.mjs) (line 53) asserts that `exportCharacterSvg()` emits **zero `<image>` elements** and zero `NaN`/`Infinity` values across all 17 characters and poses. Any offscreen-canvas compositing (`drawImage`, `source-atop`, bloom, cast shadows) must gracefully bypass/no-op when `X` is a `C2S` vector context, while geometric primitives (`taperStroke`) must emit pure canvas paths.
4. **Zero Extra Script Files Required:** [`studio/javascript-export.js`](../studio/javascript-export.js) (line 22), [`scripts/build-family-fighter.mjs`](../scripts/build-family-fighter.mjs) (line 5), and [`studio.html`](../studio.html) (lines 46–49) hardcode the existing four engine files (`core.js`, `persp.js`, `callout.js`, `timeline.js`). Placing all new helpers inside these four files gives **automatic compatibility** with standalone JS exports, CLI renders, arcade games, and tests without wiring new script loaders.

---

## 2. Detailed Design for Each Visual Improvement

### 2.1 Animated Paper Grain & Stable Per-Object Line Boil
**Target files:** [`engine/timeline.js`](../engine/timeline.js) (lines 87–112), [`engine/core.js`](../engine/core.js) (lines 55–62)

* **Current behavior:**
  1. `makeGrain()` generates a single static `1920×1080` noise + vignette canvas (`mulberry(5)`). During camera dollies/pans, static grain produces a "dirty glass" artifact, and full-frame `multiply` over 2M pixels is expensive on CPU Skia.
  2. `boilSeed(t)` initializes one global `_rnd` stream per frame. If a sparkle, prop, or second character appears or disappears earlier in draw order, every subsequent shape's jitter stream shifts and visibly pops.
* **Design:**
  1. **Split Vignette & Animated Tiled Grain (`engine/timeline.js`):**
     - Cache **4 small tileable grain canvases** (`256×256` each, seeds `5, 17, 31, 47`) as `CanvasPattern`s, created lazily per `X` via a `WeakMap` (matching the pattern in [`locations/dces/dces.js`](../locations/dces/dces.js), lines 37–49).
     - On each frame, select `grainIdx = Math.floor(t * BOIL + 1e-6) & 3` and translate the pattern by a deterministic offset `(hash(frame * 3.1) * 256, hash(frame * 7.3) * 256)` so grain organically "boils" at 12 fps without visible tiling repetition.
     - Cache the **vignette** separately as a radial gradient drawn with `source-over`.
     - Continue skipping grain & vignette completely when `{ transparent: true }`.
     - Support optional per-scene tuning: `SCENE?.grain` (default `1`, `0` to disable) and `SCENE?.vignette` (default `1`).
  2. **Scoped Per-Object Boil (`engine/core.js`):**
     - Extend `withBoil(px, fn, seed)` with an optional `seed` parameter (string or number). When `seed != null`, save `_rnd`, swap in `mulberry(hashSeed(seed) ^ (Math.floor(t * BOIL + 1e-6) * 2654435761))`, and restore `_rnd` in `finally`.
     - Existing `withBoil(px, fn)` calls remain 100% backwards-compatible; rigs and scenes can pass a stable key (e.g., `withBoil(o.boil ?? .7, () => { ... }, o.seed ?? 'jester')`) so objects never disturb one another's line boil.

---

### 2.2 Unified Lighting, Cel-Shading & Cast Floor Shadows
**Target files:** [`engine/core.js`](../engine/core.js) (lines 187–201)

* **Current behavior:** Characters paint with fixed palettes and a generic dark floor oval (`ellipse(0, .15, 4, .75)`), so they do not react to warm indoor windows, cool nighttime/blue screens, or directional key lights.
* **Design:** Add two composable, opt-in rendering helpers in `engine/core.js` using pooled offscreen `_layers` canvases (with automatic passthrough when `X` is a `C2S` SVG context or `_probe`):
  1. **`lit(fn, o)` — Character/Prop Cel-Lighting & Tint Pass:**
     - Options `o` (or inherited from an active `withLight(lightCfg, fn)` scope):
       - `dir`: `[lx, ly]` light direction in screen space (e.g., `[-1, -0.8]` = top-left key light).
       - `rim`: rim highlight color & alpha (e.g., `'rgba(255,244,210,0.45)'`) + `rimPx` (e.g., `4` screen px).
       - `shade`: shadow-side cel tint (e.g., `'rgba(35,20,55,0.16)'`) + `shadePx` (offset opposite `dir`).
       - `tint`: ambient environmental tint/wash (e.g., `'rgba(160,195,255,0.14)'` for night or monitor glow).
     - **Compositing algorithm (2 scratch canvases from `_layers`):**
       1. Paint `fn()` into offscreen canvas `A` (capturing exact alpha silhouette and preserving the anchors object returned by `fn()`).
       2. *Ambient tint (if set):* Composite `tint` onto `A` with `source-atop` (or `multiply` masked via `destination-in`).
       3. *Directional rim light (if set):* Copy `A` to scratch canvas `B`, punch out `A` shifted by `(-lx * rimPx, -ly * rimPx)` via `destination-out` (leaving a clean crescent mask along the lit edge), fill `B` with `rim` via `source-in`, and composite `B` onto `A` with `screen` / `source-over`.
       4. *Directional cel-shadow (if set):* Same crescent mask shifted along `(+lx * shadePx, +ly * shadePx)`, filled with `shade`, composited with `source-atop`.
       5. Blit `A` onto `X` in screen space and return the anchors from `fn()`.
     - **Benefit:** Zero changes required inside the 17 character rigs. Any scene or stage can wrap `lit(() => jester(...), R.light)` and receive directional rim lighting, cel shadows, and ambient integration while keeping `{ head, mouth, handL, ... }` anchors intact.
  2. **`castShadow(fn, footX, footY, o)` — Projected Silhouette Floor Shadow:**
     - Paints `fn()` into an offscreen scratch canvas, silhouettes it to a single shadow color (`source-in`, default `'rgba(38,20,32,0.22)'`), and draws it onto `X` anchored at `(footX, footY)` using a perspective shear matrix (`transform(1, 0, skewX, scaleY, footX, footY)` with `scaleY ≈ 0.22–0.32` and `skewX` driven by light X) plus optional soft blur (`blur: 2`).
     - Characters already support `noShadow: true` (e.g., [`jester_fester.js`](../characters/jester_fester/jester_fester.js) line 36, [`alma.js`](../characters/alma/alma.js) line 46), so scenes can suppress the default oval cleanly when using `castShadow()`.
  3. **Location Light Presets (Optional Convention):**
     - Locations can optionally expose `light: { dir, rim, shade, tint, shadowSkew }` on `LOCATIONS.<id>` (e.g., warm golden window key light for `throne_room`, crisp daylight for `dces`), picked up automatically by `withLight(R.light, ...)` and `drawCharacterView()`.

---

### 2.3 Tapered / Variable-Width Brush Strokes
**Target files:** [`engine/core.js`](../engine/core.js) (lines 64–108)

* **Current behavior:** All `line()` and `shape()` calls use uniform `X.lineWidth`, giving hair strands, eyebrows, smiles, and action lines a uniform vector thickness.
* **Design:** Add `taperStroke(pts, o = {})` to `engine/core.js`:
  - **API:** `taperStroke(pts, { w0, w1, wMid, profile, fill, stroke, smooth, cap, alpha })`
    - `w0`, `w1`, `wMid`: widths at start, end, and midpoint (or a custom `profile: f => width` function; supports `lwPx` scaling via `pxScale()`).
    - `smooth`: when `true` or a tension number, subdivides the Catmull-Rom curve into dense polyline samples (~6–8 segments per span) so the ribbon bends smoothly without pinching.
    - Respects active `JIT` boil by jittering the centerline once before offsetting left/right normals so both edges remain coherent.
  - **Algorithm:**
    1. Compute cumulative arc length `u ∈ [0, 1]` and unit normals at each vertex (with miter clamping on sharp bends).
    2. Emit the left contour `p[i] + n[i] * r(u)` forward and the right contour `p[i] - n[i] * r(u)` backward, with optional rounded start/end cap arcs.
    3. Fill the resulting closed polygon with `o.fill ?? o.col ?? PAL.ink` (and optional outline if `o.stroke` is specified).
  - **SVG Export Compatibility:** Emits a single pure vector `<path>`—100% compatible with `canvas2svg` and `test-svg-export.mjs`.

---

### 2.4 Perspective Upgrade: 3D Yaw/Pitch/Roll Camera & Multi-Depth Stage Queue
**Target files:** [`engine/persp.js`](../engine/persp.js) (lines 1–52)

* **Current behavior:**
  1. `persp(cam)` assumes camera forward is strictly `+Z` or `-Z` (`dir = ±1`); no horizontal orbit/pan (2-point perspective) or true 3D vertical tilt (3-point perspective).
  2. Depth occlusion uses a single `splitZ` cutoff (`set.back(..., { splitZ })`, characters, `set.front(..., { splitZ })`), which cannot cleanly interleave multiple characters standing at different Z depths among columns/props.
* **Design (100% Backwards-Compatible Fast Path):**
  1. **Extend `cam` with Optional 3D Angles:** `{ x, y, z, f, hy, dir, yaw: 0, pitch: 0, roll: 0, lookAt }`:
     - **Fast path (`!yaw && !pitch && !roll && !lookAt`):** Keeps the exact existing projection math bit-for-bit so all 83 existing scenes and 19 locations render identically with zero overhead.
     - **3D path (when any angle or `lookAt: [tx, ty, tz]` is given):**
       - Build a 3×3 world-to-camera rotation basis `(right, up, fwd)` from `yaw` (around Y), `pitch` (around camera X), and `roll` (around camera Z), incorporating `dir`.
       - Transform world point `(X, Y, Z)` into camera space `(cx, cy, cz)`.
       - Near-plane clipping (`cz >= NEAR`) in `poly()` and `line()` runs against `cz = NEAR` in camera space, so `P.poly()` and `P.line()` work at arbitrary camera angles.
       - `P.p(X, Y, Z)` returns `[W / 2 + cx * f / cz, c.hy - cy * f / cz, f / cz]`.
       - `P.plane(z, fn)` stays exact on the fast path; when 3D rotation is active, compute the local 2D affine approximation or provide `P.billboard(x, y, z, fn)` for screen-facing sprites/characters during orbiting shots.
  2. **Multi-Depth Stage Queue (`depthStage(P)` in `engine/persp.js`):**
     ```js
     const st = depthStage(P);
     st.add(z, () => { ... });       // or st.add([x, y, z], fn) for yaw/pitch cameras
     st.char(z, () => jester(...));  // optional lit/castShadow integration
     st.flush();                     // sorts far → near by P.depth() and paints in order
     ```
     - Works alongside existing `back()` / `front()` locations and enables clean interleaving of arbitrary characters, props, and foreground architecture at multiple depths.

---

### 2.5 Audio-Driven Lip Sync & Secondary Motion / Smear Helpers
**Target files:** [`engine/callout.js`](../engine/callout.js) (lines 13–28), [`studio/music.js`](../studio/music.js) (lines 164–180), [`scripts/tts_gemini.mjs`](../scripts/tts_gemini.mjs) (lines 52–94), [`engine/core.js`](../engine/core.js) (lines 18–43)

* **Current behavior:**
  - `lipFlap(t, talking, rest, shapes)` ignores what is actually being said or heard and cycles pseudo-randomly via `hash(Math.floor(t * 9))`.
  - Fast movements (punches, juggling throws, hat snaps) have no built-in follow-through spring or motion-smear helpers.
* **Design:**
  1. **Unified Deterministic Syllable Scheduler (Synthesized Voices):**
     - Extract the syllable-parsing logic in [`studio/music.js`](../studio/music.js) (lines 164–179) into a shared pure helper `dialogueSyllables(line, voice)` in `engine/callout.js` (returning `[{ at, dur, vowel }]`, memoized per line).
     - `studio/music.js` calls `dialogueSyllables()` to schedule audio syllables, guaranteeing **exact alignment** between synthesized audio and mouth shapes.
     - Map each active vowel to a viseme bucket:
       - `a` → `'open'` / `'O'` (wide open)
       - `o`, `u` → `'o'` (rounded)
       - `e`, `i`, `y` → `'grin'` (wide teeth/smile)
       - Gaps between words/syllables → `rest` / `'smile'` (natural mouth closure).
  2. **Precomputed Audio Envelopes (Recorded Gemini TTS in `voice.js`):**
     - In [`scripts/tts_gemini.mjs`](../scripts/tts_gemini.mjs) (lines 70–93), while processing the 24 kHz PCM (adjusted for `tts.tempo`), compute a compact 24 fps quantized mouth-shape string `env` (4 states from RMS energy + zero-crossing rate: `.` closed, `s` slight, `o` round, `a` wide—~70 bytes per 3-second line).
     - Embed `env: '...saoo.sa...'` alongside `dur` and `src` in `voiceClips({ ... })` inside `voice.js`.
     - Zero runtime audio decoding, zero `OfflineAudioContext`, 100% deterministic across studio, headless Chrome, and offline standalone JS bundles.
     - Add an offline `--envelopes` / `--all-envelopes` flag to `scripts/tts_gemini.mjs` to backfill `env` into existing `voice.js` files from cached MP3s without calling the Gemini API.
  3. **Backwards-Compatible `callout()` + `lipFlap()` Integration:**
     - `callout()` tracks the active line's viseme/envelope and returns `{ talking, visible, mouth, open }`.
     - `lipFlap(t, talkingOrSaid, rest, shapes)`:
       - When passed a `said` object—or when passed `true` while an active `SCENE?.dialogue` line is speaking at time `t`—uses the TTS `env` (if available) or `dialogueSyllables()` vowel viseme, remapped into `shapes` so characters with restricted mouth sets (e.g., Princess Pearl's `['open', 'o', 'flat']`) never receive an unsupported mouth key.
       - Falls back to the existing `hash(Math.floor(t * 9))` behavior when no dialogue line matches (e.g., character showcase `talk` pose).
  4. **Secondary Motion & Smear Primitives (`engine/core.js`):**
     - `spring(t, t0, { freq, damp })` — damped spring transition (`0 → 1` with controllable overshoot), complementing `boing()`.
     - `trail(t, fn, { steps: 4, dt: 0.015, alpha: 0.35 })` — evaluates a pure painter `fn(t - i * dt)` at previous sub-frame timestamps with decaying alpha for ghost/afterimage motion trails.
     - `smear(ptsNow, ptsPrev, { fill, alpha })` — builds a swept motion-blur hull connecting a limb/prop's previous and current positions (or `smearArc` built on `taperStroke`).

---

### 2.6 Subtle Color Grading & Downscaled Bloom
**Target files:** [`engine/core.js`](../engine/core.js) (lines 187–201), [`engine/timeline.js`](../engine/timeline.js) (lines 100–112)

* **Current behavior:** `layer()` runs CSS filters at full `1920×1080` and only composites with `source-over`. Glowing elements lack soft bloom, and shots have no lightweight color-grading pass.
* **Design:**
  1. **Enhance `layer(fn, o)` (`engine/core.js`):**
     - Add optional `composite` (default `'source-over'`), `alpha` (default `1`), and `scale` (default `1`, auto-defaulting to `0.5` when `blur >= 2` for ~4× faster DoF blur with virtually identical softness).
     - Bypass offscreen canvas cleanly when `X` is a `C2S` SVG context (calling `fn()` directly so SVG export stays pure vector).
  2. **Add `bloom(fn, o = {})` (`engine/core.js`):**
     - Paints `fn()` onto `X` normally (unless `o.glowOnly`), and also renders `fn()` into a **1/4-resolution (`480×270`)** pooled offscreen canvas, compositing it back with `globalCompositeOperation = 'screen'` (or `'lighter'`), `filter = blur(radius / 4)`, and `globalAlpha = o.strength ?? 0.55`.
     - At 1/16th the pixel count of 1080p, bloom runs in ~1–2 ms/frame and elevates glowing elements (Alma's dance aura, stained-glass sunbeams, robot eyes, lightning).
  3. **Optional Shot/Scene Color Grade (`grade(o)` in `core.js` / `timeline.js`):**
     - Lightweight post-pass queued to run right before `flushOverlays()` (keeping speech bubbles crisp and ungraded): supports `{ tint, mode, warmth, vignette }` via subtle `soft-light` / `multiply` washes. Skipped when `transparent: true`.

---

## 3. Phased Implementation Plan

| Milestone | Scope & Files | Risk / Impact |
|---|---|---|
| **M1 — Grain, Scoped Boil & `layer()` Upgrade** | [`engine/core.js`](../engine/core.js), [`engine/timeline.js`](../engine/timeline.js) | **Low risk / Immediate global upgrade.** Animated 12 fps tiled grain + separated vignette; scoped `withBoil(px, fn, seed)`; `layer()` `scale` + `composite` + `alpha` + `C2S` guard; `bloom()` and `grade()`. |
| **M2 — Tapered Brush Strokes & Motion Smears** | [`engine/core.js`](../engine/core.js) | **Zero breaking change (pure additive).** Add `taperStroke()`, `spring()`, `trail()`, and `smear()`. |
| **M3 — Unified Lighting & Cast Shadows** | [`engine/core.js`](../engine/core.js), [`engine/showcase.js`](../engine/showcase.js) | **Opt-in additive.** Add `withLight()`, `lit()`, and `castShadow()`, plus optional `LOCATIONS.<id>.light` support in `drawCharacterView()`. |
| **M4 — 3D Yaw/Pitch Camera & `depthStage`** | [`engine/persp.js`](../engine/persp.js) | **Zero-regression fast path.** Add optional `yaw`, `pitch`, `roll`, `lookAt` to `persp()` (preserving exact math when all are 0) + `depthStage(P)` painter's sorter. |
| **M5 — Audio-Driven Lip Sync** | [`engine/callout.js`](../engine/callout.js), [`studio/music.js`](../studio/music.js), [`scripts/tts_gemini.mjs`](../scripts/tts_gemini.mjs) | **High perceived polish.** Shared `dialogueSyllables()`, viseme-aware `callout()`/`lipFlap()` with shape-set remapping, and compact 24 fps PCM envelope generation in `tts_gemini.mjs` (plus offline `--envelopes` backfill). |
| **M6 — Showcase Adoption & Documentation** | 1–2 showcase scenes (e.g., `scene01_juggling` or a visual demo scene), [`ANIMATION_GUIDE.md`](../ANIMATION_GUIDE.md), [`docs/HANDBOOK.md`](HANDBOOK.md) | Demonstrate every new feature via before/after contact sheets and document all new APIs for future scenes and AI coding agents. |

---

## 4. Verification & QA Strategy

After each milestone (and in a full final pass):

1. **Automated Regression Suite:**
   - `node scripts/test-svg-export.mjs` — verifies zero `<image>` tags, valid SVG across all 17 character rigs and model sheets, and intact transparent PNG/GIF export.
   - `node scripts/test-javascript-export.mjs` — verifies pixel-identical rendering between Studio and offline standalone JS bundles (`OfflineAudioContext = undefined`) across all 83 scenes, plus chunk-boundary audio parity.
   - `node scripts/test-family-fighter.mjs` & `node scripts/test-family-fighter-arenas.mjs` — ensures arcade games sharing `engine/core.js` & `engine/timeline.js` remain green.
   - `node render.mjs --doctor` — verifies headless Chrome rendering.
2. **Visual Before/After Contact Sheets:**
   - Generate `--sheet` contact sheets before and after changes for:
     - `scene01_juggling` (grain, DoF blur, rim light, bloom on sparkles, syllable lip sync)
     - A Gemini TTS lecture scene (e.g., `scene27_dynamics_of_mirroring`, verifying envelope-driven lip sync)
     - `scene48_the_trolls` (mixed raster costumes + vector characters + crowds)
     - `--modelsheet=alma` & `--modelsheet=jester_fester` (verify `taperStroke`, `bloom` on Alma's aura, SVG export).
   - Compare `ms/frame` timings printed by `--sheet` to confirm visual upgrades preserve or improve frame render speed.

---

## 5. Open Design Decisions to Confirm Before Implementation

1. **Global defaults for existing 83 scenes:** Turn on **animated 12 fps grain** and **syllable-synced `lipFlap`** globally by default (immediately upgrading all 83 scenes), while keeping **lighting (`lit`/`castShadow`), `bloom`, `grade`, `taperStroke`, and 3D `yaw/pitch`** opt-in per scene/rig so no existing scene's art direction shifts unexpectedly. *(Recommended)*
2. **Existing TTS scenes (`voice.js`):** Include an offline `--envelopes` / `--all-envelopes` utility flag in [`scripts/tts_gemini.mjs`](../scripts/tts_gemini.mjs) to backfill `env` lip-sync envelopes into existing `voice.js` files from cached MP3s without calling the Gemini API. *(Recommended)*
3. **Rollout cadence:** Implement all engine milestones (M1–M5) together and validate with a full test + contact-sheet pass, or execute one milestone at a time with visual review between each.
