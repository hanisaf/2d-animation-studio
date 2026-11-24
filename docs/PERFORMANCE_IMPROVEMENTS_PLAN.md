# Safadi Animation Studio — Performance Improvements Implementation Plan

Technical audit and phased implementation plan addressing **Section 3 — Performance Improvements** in [`ENGINE_ANALYSIS.md`](ENGINE_ANALYSIS.md#3-performance-improvements).

---

## 1. Baseline Status Audit (What's Already Done vs. Remaining)

Recent commit `fe08eff` (M1–M5 visual upgrades) already landed two partial pieces of Section 3.2. Every other performance bottleneck remains open:

| # | Area from `ENGINE_ANALYSIS.md` | Current Status | Remaining Work |
|---|---|---|---|
| **3.1** | Eliminate per-shape `X.getTransform()` allocations | **Open** | `pxScale()` and `toPx()` still call `X.getTransform()` on every shape/anchor ([`engine/core.js`](../engine/core.js), lines 92 & 254). |
| **3.2** | Avoid full-res `1920×1080` `blur()` & `multiply` passes | **Partial** | Half-res `layer()` blur (`blur >= 2`) and `256×256` tiled grain + separate vignette are done. **Still open:** static background caching, sub-2px blur/transition smoothness, full-frame `1920×1080` scratch passes in M3 (`lit`/`castShadow`), and benchmarking `source-over` vs. `multiply` grain on CPU Skia. |
| **3.3** | Memoize text measurement in speech bubbles | **Open** | [`engine/callout.js`](../engine/callout.js) (lines 118–184) still re-tokenizes, double-measures every word, and measures every character + calls `save/restore` per character on every frame. |
| **3.4** | Speed up CLI rendering (`render.mjs`) 3–5× | **Open** | [`render.mjs`](../render.mjs) (lines 61–116) still uses `toDataURL()` → Base64 over CDP → disk JPEGs → `ffmpeg` re-encode, and opens redundant probe + encode browser pages. |
| **3.5** | Shrink standalone JavaScript exports | **Open** | [`studio/javascript-export.js`](../studio/javascript-export.js) (lines 35–58) still bundles all 17 characters (507 KB) + 19 locations (671 KB) and embeds raw Base64 WAV (~43 MB for a 168 s lesson). |
| **3.6** | Precompute static set geometry & cap preview FPS | **Open** | Heavy sets ([`throne_room.js`](../locations/throne_room/throne_room.js), [`soccer_field.js`](../locations/soccer_field/soccer_field.js), [`family_kitchen.js`](../locations/family_kitchen/family_kitchen.js)) recompute static geometry/colors every frame; [`studio/studio.js`](../studio/studio.js) (lines 202–235) and exported JS players run 60–120 Hz `requestAnimationFrame` loops without capping character/location/embed playback to 24 fps. |

---

## 2. Non-Negotiable Invariants

Every optimization must preserve:
1. **Pure `f(t)` Determinism & Parity:** Frames render identically in any order and in parallel workers. [`scripts/test-javascript-export.mjs`](../scripts/test-javascript-export.mjs) (lines 86–93) enforces pixel parity (`diff.count < 128`, `diff.max <= 32`) between Studio and offline JS bundles. Any cache must be strictly keyed on all visual inputs (never leaking state across frames or scenes).
2. **Pure-Vector SVG Export:** [`scripts/test-svg-export.mjs`](../scripts/test-svg-export.mjs) (line 53) asserts zero `<image>` tags and zero `NaN`/`Infinity` across all 17 characters and model sheets. Offscreen caches (e.g., `staticLayer`, stained-glass bitmap cache) must bypass cleanly when `_isVectorCtx()` is true.
3. **Zero Extra Engine Scripts:** Keep all runtime engine additions inside the existing 4 files (`core.js`, `persp.js`, `callout.js`, `timeline.js`) so arcade games, comics, and standalone JS exports inherit every speedup automatically.
4. **Offline Export Compatibility:** Standalone JS bundles must make zero network requests and work with `window.OfflineAudioContext = undefined`.

---

## 3. Detailed Technical Design

### 3.1 Eliminate Per-Shape `X.getTransform()` Allocations
**Target files:** [`engine/core.js`](../engine/core.js) (lines 92–126, 254), [`engine/timeline.js`](../engine/timeline.js) (lines 138–150), [`studio/svg-export.js`](../studio/svg-export.js) (lines 6–39)

* **Problem:** Across characters, locations, and scenes, there are ~661 direct `X.scale` / `X.transform` / `X.setTransform` / `X.resetTransform` calls, so a manual `scaleStack` helper in `core.js` alone would miss direct context calls. Meanwhile, `pxScale()` and `toPx()` call `X.getTransform()` (allocating a new `DOMMatrix`) 1–3× per `shape()`, `line()`, `ellipse()`, and anchor lookup.
* **Design — Transparent Zero-Alloc Affine Matrix Tracker:**
  1. Add `_trackCtx(ctx)` in `engine/core.js`, attaching a hidden state object (via a `Symbol` or `WeakMap`, installed once per context instance) containing a flat pre-allocated `Float64Array` stack (`[a, b, c, d, e, f, sc]` × depth, growing automatically if needed) and stack pointer `sp`.
  2. Wrap `save`, `restore`, `translate`, `scale`, `rotate`, `transform`, `setTransform`, and `resetTransform` on the tracked `ctx` to mirror the 6-float affine matrix in-place with **zero heap allocations**:
     - `translate(x, y)` updates only `e, f` (does **not** invalidate cached `sc`).
     - `scale(sx, sy)` updates `a, b, c, d` and marks `sc = -1`.
     - `rotate(rad)` updates `a, b, c, d` via `cos/sin` and marks `sc = -1` (handles non-uniform squash/stretch + rotation accurately).
     - `transform(a, b, c, d, e, f)` multiplies the 2×3 matrix in-place and marks `sc = -1`.
     - `setTransform(...)` supports both 6-number and 1-arg `DOMMatrixInit` forms (needed by [`locations/house/house.js`](../locations/house/house.js), line 379) and resets `sc = -1`.
     - `save()` / `restore()` push/pop 7 numbers (`a, b, c, d, e, f, sc`) in the flat array.
  3. Call `_trackCtx(X)` at the start of `paintFrame()` (right before `X.setTransform(1,0,0,1,0,0)`), inside `_getLayer()`, on `_probe`, and in `exportCharacterSvg()`.
  4. Rewrite `pxScale()` and `toPx(x, y)` to read directly from the tracked 6-float matrix when present (computing `sc = Math.hypot(a, b) || 1` lazily once per scale change), with safe fallback to `X.getTransform()` if called on an untracked external canvas (e.g., standalone arcade games or comics).
  5. **Hot-path cleanup in `paintPath()` & `tracePath()`:**
     - Compute `pxScale()` at most once inside `paintPath()`, and skip calling it altogether when `o.lwPx == null && o.lw != null`.
     - Avoid allocating a `pts.map(...)` array inside `tracePath()` when `JIT === 0` and reuse jittered coordinates cleanly when `JIT > 0`.

---

### 3.2 Layer Caching, Blur Efficiency & M3 Scratch Cost
**Target files:** [`engine/core.js`](../engine/core.js) (lines 305–438), [`engine/timeline.js`](../engine/timeline.js) (lines 88–134), [`engine/showcase.js`](../engine/showcase.js) (lines 30–45)

* **Static Background Layer Cache (`staticLayer(key, fn, o = {})`):**
  - Add a bounded LRU cache (default max **4** offscreen canvases, cleared automatically on `useScene()` change) in `engine/core.js`.
  - `staticLayer(key, fn, o)`:
    - Bypasses directly to `layer(fn, o)` when `_isVectorCtx()` is true or `key == null`.
    - Builds a canonical string key including `SCENE?.id`, `FX.m2`, `FX.m3`, `o.blur`, `o.filter`, `o.scale`, and caller's `key` (e.g., serialized camera `{x,y,z,f,hy,dir,yaw,pitch,roll}` + `splitZ` + set variant).
    - On cache hit: blits the cached offscreen canvas onto `X` with `drawImage` in <0.2 ms instead of repainting hundreds of set polygons and re-running CSS blur every frame.
    - On cache miss: renders `fn()` into a pooled cache canvas (at `o.scale` if blurred, applying CSS blur/filter **once** when baking the cache entry so cache hits don't re-blur).
  - **Immediate automatic adoption:**
    - Use `staticLayer()` in [`engine/showcase.js`](../engine/showcase.js) (line 35, `drawCharacterView`) when standing on a static location backdrop while previewing a character pose (currently blurs the whole location every frame).
    - Document `staticLayer()` for static-camera shots (e.g., lecture-hall / chalkboard episodes where the set doesn't animate; scenes with animated set elements like swaying banners or flickering candles continue using `layer()`).
* **Refining `layer()` & M3 (`lit` / `castShadow`) Scratch Passes:**
  - In `layer()` ([`engine/core.js`](../engine/core.js), line 317): lower the auto-half-res threshold from `blur >= 2` to `blur >= 1.25` (or smoothly choose `0.5` for `blur >= 1.5`, `0.75` for `0.8 <= blur < 1.5`) so the dozens of scenes using `blur: 1.5–1.8` also avoid full-1080p Gaussian blur without a visible jump during focus pulls.
  - In `castShadow()` ([`engine/core.js`](../engine/core.js), lines 415–432): render the blurred shadow silhouette `cvB` at **half resolution (`960×540`)** with half blur radius (`blurPx * 0.5`) — a soft ground shadow at `0.26` vertical scale is visually indistinguishable at half resolution and avoids a full `1920×1080` blur pass per character.
* **Paper Grain Blend Mode Benchmark (`engine/timeline.js`):**
  - Benchmark current `256×256` `CanvasPattern` with `globalCompositeOperation = 'multiply'` vs. a pre-baked alpha-darkening grain tile composited with `source-over` in headless Chrome (CPU Skia). Adopt `source-over` only if it delivers a measurable ms/frame reduction while staying visually faithful on both light and dark scenes; otherwise retain the current `256×256` tiled `multiply` pass.

---

### 3.3 Memoize Speech Bubble Layout & Text Metrics
**Target files:** [`engine/callout.js`](../engine/callout.js) (lines 110–186)

* **Problem:** Every frame a callout is visible, `drawBubble()` re-splits `*emphasis*` tokens, calls `X.measureText(wd.w)` **twice** per word, calls `X.measureText(ch)` for every character, and wraps every single character in `X.save(); X.translate(); X.scale(pop, pop); X.fillText(); X.restore()` even after `pop === 1`.
* **Design:**
  1. Add a bounded layout cache `_BUBBLE_CACHE = new Map()` (max 256 entries, FIFO eviction) keyed by `${_fontGen}|${font}|${maxW}|${text}`.
  2. **Font-load invalidation guard:** Track `_fontGen` (incremented whenever `document.fonts` fires `loadingdone`, plus checking `document.fonts?.size` if `document.fonts` exists). This guarantees bubbles measured before Google Fonts (`Fredoka`) finish loading are never stuck with fallback system-font widths.
  3. Cache entry structure:
     - `sp`: space width
     - `lines`: array of `{ width, words: [{ w, f, charWidths: Float32Array }] }`
     - `maxLineW`: `Math.max(...widths)`
  4. **Fast character draw loop:**
     - Read precomputed `cw = wd.charWidths[ci]` (zero `X.measureText` calls after frame 1).
     - When `age >= 2.5` (`pop === 1`, true for 90%+ of visible characters on screen), skip `X.save() / translate() / scale() / restore()` entirely and emit `X.fillStyle = ...; X.fillText(ch, x, y)` directly (only switching `X.fillStyle` when the color actually changes). Keep the `save/translate/scale/restore` pop transform only for the 1–3 actively animating newest characters (`0 < age < 2.5`).
     - Pixel placement remains 100% identical because each character still draws at its exact cumulative `x`.

---

### 3.4 Speed Up CLI Rendering (`render.mjs`) by 3–5×
**Target files:** [`render.mjs`](../render.mjs), [`studio/studio.js`](../studio/studio.js) (lines 18–40), [`studio/export.js`](../studio/export.js) (lines 11–102)

* **Current bottlenecks in `render.mjs`:**
  1. Redundant browser tabs: `--build` opens & closes a probe page, then `W` worker pages, then another page in `encode()` just for audio.
  2. Every frame undergoes synchronous `canvas.toDataURL('image/jpeg', 0.95)` → Base64 (+33%) → CDP JSON serialization → `.tmp` file write + `renameSync` → `ffmpeg` JPEG decode + H.264 encode.
* **Design — Hybrid Local-HTTP + Parallel WebCodecs Pipeline (with Piped `ffmpeg` Fallback):**
  1. **Ephemeral Local HTTP Server inside `render.mjs`:**
     - Launch an in-process `http.createServer` on `127.0.0.1:0` serving the repo root (read-only) + a binary upload endpoint (`POST /__upload?name=...`) that streams raw binary request bodies straight to disk (or pipes to `ffmpeg` stdin).
     - Navigate Puppeteer pages to `http://127.0.0.1:<port>/studio.html?render&scene=...` instead of `file://` (also enabling `fetch(sc.audio)` in headless Chrome).
     - Eliminates 100% of Base64 encoding and CDP JSON payloads for video chunks and frames.
  2. **Reuse Worker `#0` for Metadata + Audio (Zero Extra Pages):**
     - Open worker `#0` first to get `info` (duration, fps, audio) and kick off soundtrack synthesis/check in parallel while spawning workers `#1..W-1`. Never open separate probe or encode pages.
  3. **Fast Path (Default for `--build` and `--movie`): Parallel WebCodecs Chunked Encoding:**
     - Add a reusable `exportVideoRange({ id, startFrame, endFrame, fps, bitrate, codec })` helper in [`studio/export.js`](../studio/export.js) (exposed on `window` in `?render` mode) that paints `[startFrame, endFrame)` with `drawFrame(i / fps)` → `new VideoFrame(canvas, ...)` → `VideoEncoder` → `Mp4Muxer` (video-only, keyframe at `i === startFrame` and every `fps * 2` frames).
     - Probe `VideoEncoder.isConfigSupported` once on worker `#0` to pick a single common H.264 codec profile (`avc1.640028` / `avc1.4d0028` / `avc1.42002a`) shared by all workers so SPS/PPS headers match identically.
     - Divide `totalFrames` into `W` contiguous chunks. Each worker encodes its chunk directly from GPU/Canvas memory (zero JPEG encode, zero Base64, zero disk frames) and `POST`s the resulting binary `.mp4` chunk to `/__upload?name=part_XX.mp4`.
     - Once all workers finish (and soundtrack WAV is written if synthesized), run a single fast `ffmpeg -f concat -safe 0 -i parts.txt -i <audio> -c:v copy -c:a aac -b:a 192k -movflags +faststart out/<id>/<id>.mp4` (<1 s, zero video re-encoding), then clean up temporary `parts/`.
     - Default `--bitrate=14000000` (14 Mbps for crisp 1080p mastering, configurable via `--bitrate=<bps>`).
  4. **Automatic Fallback & `--encoder=ffmpeg` Mode (for Chromium without H.264 or archival `libx264 -crf 17`):**
     - If `VideoEncoder` H.264 is unsupported (e.g., stripped Linux Chromium) or the user passes `--encoder=ffmpeg`, automatically fall back to **parallel chunked piped `ffmpeg`**: each worker runs `canvas.toBlob(..., 'image/jpeg', 0.95)` and streams binary frames over `POST /__pipe?w=<worker>` directly into a per-worker `ffmpeg -f image2pipe` process, then concatenates the `W` MP4 segments with `-c copy` — still **zero disk JPEGs and zero Base64/CDP overhead**.
  5. **Accelerate `--clip`, `--frames`, and `--encode` (Full Backwards Compatibility):**
     - `--clip=a:b`: uses WebCodecs fast path (or binary HTTP pipe to `ffmpeg`) instead of Base64 `frameOf()`.
     - `--frames` / `--resume` / `--encode`: preserved for workflows needing individual JPEGs on disk, upgraded to use `canvas.toBlob` + binary HTTP upload instead of `toDataURL` + Base64 over CDP.

---

### 3.5 Shrink Standalone JavaScript Exports
**Target files:** [`engine/timeline.js`](../engine/timeline.js) (lines 64–73), [`characters/neptune/asset.js`](../characters/neptune/asset.js), [`characters/princess_pearl/asset.js`](../characters/princess_pearl/asset.js), [`characters/sami/asset.js`](../characters/sami/asset.js), [`studio/javascript-export.js`](../studio/javascript-export.js), [`studio/music.js`](../studio/music.js), [`scripts/test-javascript-export.mjs`](../scripts/test-javascript-export.mjs)

* **Dependency Pruning (Eliminating ~1.0+ MB of Dead Code per Bundle):**
  - Auditing all 17 characters and 19 locations found **exactly 3 cross-character runtime dependencies** that previously motivated bundling all characters/locations:
    1. [`characters/neptune/neptune.js`](../characters/neptune/neptune.js) (line 136) calls `jfEmote(...)` from `jester_fester`.
    2. [`characters/princess_pearl/princess_pearl.js`](../characters/princess_pearl/princess_pearl.js) (line 111) calls `jfEmote(...)` from `jester_fester`.
    3. [`characters/sami/sami.js`](../characters/sami/sami.js) (lines 73–88) calls `sfSandal`, `sfChiton`, `sfWreath` from `safadi` (when `outfit === 'greek'`).
  - **Fix:**
    1. Support an optional `uses` array on character and location `asset.js` manifests (e.g., `uses: ['character:jester_fester']` on `neptune` and `princess_pearl`; `uses: ['character:safadi']` on `sami`).
    2. Extend `sceneDeps(id)` in [`engine/timeline.js`](../engine/timeline.js) (lines 64–73) to transitively follow `uses` on characters and locations as well as scenes, while preserving canonical `REGISTRY` load order.
    3. Update [`studio/javascript-export.js`](../studio/javascript-export.js) (lines 28–36) to use `sceneDeps(id)` (stripping `scene.js` from borrowed helper scenes, matching existing behavior) instead of blindly bundling all 17 characters and 19 locations.
    4. Validate across **all 83 scenes** using [`scripts/test-javascript-export.mjs`](../scripts/test-javascript-export.mjs) (lines 194–201, which already mounts and renders every shot of every scene in isolation). If any scene omits a used character/location from its `asset.js` `cast`/`locations`, add it to that scene's `asset.js`.
* **Compressed Audio Embedding (~12–16× Smaller `.with-sound.js` Bundles):**
  - Replace `sceneWavBlob(buffer)` in [`studio/javascript-export.js`](../studio/javascript-export.js) (line 52) with a new helper `sceneCompressedAudioBlob(buffer)` (placed in `studio/music.js` or `studio/export.js`) using the browser's WebCodecs `AudioEncoder` + `Mp4Muxer` (already loaded in [`studio.html`](../studio.html), line 55):
    - Prefer **AAC in M4A (`mp4a.40.2`, `audio/mp4`, 128 kbps)** (universally playable in Chrome, Safari, Firefox, Edge `<audio>` tags).
    - Fall back to **Opus in MP4 (`opus`, `audio/mp4`, 96 kbps)** if AAC encoding isn't supported.
    - Fall back to `sceneWavBlob(buffer)` (`audio/wav`) only if WebCodecs `AudioEncoder` is unavailable.
  - Expected size reduction for `scene40_access_recirculation.with-sound.js` (168 s): **~44 MB → ~3.5 MB** (~12× smaller).
  - **Test update:** Update [`scripts/test-javascript-export.mjs`](../scripts/test-javascript-export.mjs) (lines 57, 128–135, 169) to accept `data:audio/mp4;base64,` (or `audio/wav` fallback) and verify non-silent audio via playback / decoded audio energy rather than parsing raw WAV PCM bytes directly.

---

### 3.6 Precompute Static Set Geometry, Color Cache & Cap Preview FPS
**Target files:** [`engine/core.js`](../engine/core.js) (lines 62–66), [`locations/throne_room/throne_room.js`](../locations/throne_room/throne_room.js), [`locations/soccer_field/soccer_field.js`](../locations/soccer_field/soccer_field.js), [`locations/family_kitchen/family_kitchen.js`](../locations/family_kitchen/family_kitchen.js), [`studio/studio.js`](../studio/studio.js) (lines 202–235), [`studio/javascript-export.js`](../studio/javascript-export.js) (lines 164–174)

* **Global Color Parsing Cache (`engine/core.js`):**
  - Cache parsed 24-bit integer RGB values per hex string in `_HEX_CACHE` (`Map`) inside `mixCol()` and `rgba()`, eliminating repeated `.slice(1)` + `parseInt(..., 16)` across all 19 locations and 17 characters.
* **Static Geometry Precomputation in Heavy Sets:**
  1. **[`locations/throne_room/throne_room.js`](../locations/throne_room/throne_room.js):**
     - `ceiling()` (lines 30–50): Precompute the 16 strip colors (`CEIL_COLS`), the 17 strip `x` & `vY(x)` heights, the 5 transverse arch 3D point arrays, and the 10 diagonal bay rib 3D point arrays once at IIFE init.
     - `stainedGlass()` (lines 69–103): Precompute the 190 tile colors once and bake the static mosaic + castle + lightning bolt + lead lines into a lazy offscreen `520×960` canvas (bypassed when `_isVectorCtx()`), drawing only the animated shimmer sweep and frame mullions per frame.
     - `floor()` (lines 180–213): Precompute all marble swirl 3D polylines (up to 96 swirls × 17 trig points) and the 46 flower petal `(pxx, pz, rot)` records once at init.
     - `dais()` (lines 215–224) & `fountain()` (lines 294–299): Precompute step arcs, rug polygon, and static water-jet polylines once at init.
  2. **[`locations/soccer_field/soccer_field.js`](../locations/soccer_field/soccer_field.js) (lines 79–100):**
     - Precompute `_staticHulls = shadowCasters().map(pts => hull(pts.map(cast)))` once instead of re-running convex hull on every building/goal/pole every frame.
  3. **[`locations/family_kitchen/family_kitchen.js`](../locations/family_kitchen/family_kitchen.js) (lines 74–85):**
     - Memoize `COL(col, k)` and string-color box shading lookups per palette in a small cache so `box()` stops calling `mixCol` 2× per box per frame.
* **Cap Passive Preview & Embed Playback FPS (`studio/studio.js` & `studio/javascript-export.js`):**
  - In [`studio/studio.js`](../studio/studio.js) (lines 202–206): extend `frameKey()` to return `char:${S.id}:${Math.floor(S.t * 24)}` and `loc:${S.id}:${Math.floor(S.t * 24)}` (24 fps) so passive character/location preview playback stops painting at 60–120 Hz. Interactive edits (camera dragging, wheel zoom, sliders, pose/backdrop clicks) continue setting `S.dirty = true` directly, keeping camera navigation instant at full display refresh rate.
  - In [`studio/javascript-export.js`](../studio/javascript-export.js) (lines 164–174): deduplicate `tick(now)` frames by `Math.floor(t * (sc.fps || 24))` so standalone embedded players also paint at 24 fps instead of 60–120 fps (while `seek()`, `setPlaybackRate()`, and end-of-scene still redraw immediately).

---

## 4. Phased Implementation Roadmap

| Phase | Scope | Key Files | Expected Win |
|---|---|---|---|
| **P1 — Core Runtime Hot Path** | Zero-alloc `_trackCtx` (`pxScale` + `toPx`), `paintPath` cleanup, `mixCol`/`rgba` hex cache, `callout` text-metric memoization + settled-char fast path. | [`engine/core.js`](../engine/core.js), [`engine/timeline.js`](../engine/timeline.js), [`engine/callout.js`](../engine/callout.js), [`studio/svg-export.js`](../studio/svg-export.js) | Immediate 15–35% faster frame rendering across all 83 scenes, games, and Studio; zero GC churn from `DOMMatrix` / `measureText`. |
| **P2 — Layers, Static Sets & Preview FPS** | `staticLayer()` LRU cache (+ `drawCharacterView` adoption), `layer()` blur threshold & half-res `castShadow`, grain `source-over` benchmark, static precomputation in `throne_room` / `soccer_field` / `family_kitchen`, 24 fps preview + embed cap. | [`engine/core.js`](../engine/core.js), [`engine/timeline.js`](../engine/timeline.js), [`engine/showcase.js`](../engine/showcase.js), `locations/*/`, [`studio/studio.js`](../studio/studio.js), [`studio/javascript-export.js`](../studio/javascript-export.js) | 2–5× lower CPU/battery in Studio previews and static-backdrop scenes; 20–40% faster heavy-set frames. |
| **P3 — Shrunk Standalone JS Exports** | Transitive `uses` in `sceneDeps()`, pruned bundling in `javascript-export.js`, WebCodecs AAC/Opus audio embedding (`audio/mp4`) with WAV fallback, update `test-javascript-export.mjs`. | [`engine/timeline.js`](../engine/timeline.js), `characters/*/asset.js`, [`studio/javascript-export.js`](../studio/javascript-export.js), [`studio/music.js`](../studio/music.js), [`scripts/test-javascript-export.mjs`](../scripts/test-javascript-export.mjs) | ~90% smaller silent JS bundles (~1.2 MB → ~100–200 KB) and ~10–15× smaller voiced JS bundles (~44 MB → ~3–4 MB). |
| **P4 — Fast CLI Rendering (`render.mjs`)** | Ephemeral local HTTP server, eliminate probe/encode pages, parallel WebCodecs chunked H.264 + `ffmpeg -c copy` concat, piped `ffmpeg` fallback (`--encoder=ffmpeg`), accelerated `--clip` & `--frames`. | [`render.mjs`](../render.mjs), [`studio/export.js`](../studio/export.js), [`studio/studio.js`](../studio/studio.js) | **3–5× faster** `--build`, `--movie`, and `--clip` renders with zero intermediate JPEGs and zero Base64/CDP overhead. |

---

## 5. Verification & Benchmarking Strategy

### Before/After Performance Benchmarks
Record baseline numbers *before* P1 and re-measure after each phase:
1. **Per-frame render time (`ms/frame`):** `node render.mjs --scene=scene01_juggling --sheet=1,4,8,12,18,25` (tests `throne_room`, `layer()` blur, speech bubbles, multiple characters) + `scene14_offside_trap` (`soccer_field`) + `scene74_thanksgiving_feast` (`family_kitchen`) + `scene76_day_on_ice` (M2/M3 `lit`/`castShadow`).
2. **CLI full build time:** Wall-clock time for `node render.mjs --scene=scene01_juggling --build` and `--clip=6:12` (comparing output MP4 duration, resolution, frame count, and audio sync via `ffprobe`).
3. **JS export bundle sizes:** Byte sizes of `scene01_juggling.silent.js`, `scene01_juggling.with-sound.js`, and `scene40_access_recirculation.with-sound.js` before vs. after P3.
4. **Visual parity check:** Pixel-diff before/after PNG stills (`--stills`) of `scene01_juggling`, `scene14_offside_trap`, `scene74_thanksgiving_feast`, and `scene76_day_on_ice` to confirm no visual regressions.

### Automated Regression Suite
Run after each phase and in a full final pass:
- `node scripts/test-svg-export.mjs` — verifies zero `<image>` tags, valid SVG across all 17 characters and model sheets, transparent PNG/GIF export, and intact `X` tracking on `C2S`.
- `node scripts/test-javascript-export.mjs` — verifies pixel parity (`diff.count < 128`), offline font loading, compressed audio playback, and isolated rendering of **all 83 scenes** (catches any missing `cast`/`locations`/`uses` dependencies).
- `node scripts/test-player-controls.mjs` — verifies standalone JS player controls with the 24 fps frame deduplication.
- `node scripts/test-family-fighter-arenas.mjs` & `node scripts/test-fighting-poses-browser.mjs` — confirms arcade games sharing `engine/core.js` remain unaffected.
- `node render.mjs --doctor` — verifies headless Chrome + `ffmpeg` health.

---

## 6. Open Decisions to Confirm Before Coding

1. **Default CLI encoder in `render.mjs --build`:** Should **parallel WebCodecs + `ffmpeg -c copy`** be the default for `--build` / `--movie` (fastest, 3–5× speedup, with `--encoder=ffmpeg` available for archival `libx264 -crf 17`), or should WebCodecs be opt-in via `--fast` while keeping piped `ffmpeg` as default? *(Recommended: WebCodecs default with automatic fallback to piped `ffmpeg` if H.264 WebCodecs is unavailable, plus `--encoder=ffmpeg` flag for archival CRF 17.)*
2. **Standalone JS export audio format:** Is **AAC-in-M4A (`data:audio/mp4;base64,`, 128 kbps)** via WebCodecs `AudioEncoder` + `mp4-muxer` (with automatic fallback to WAV) acceptable for `.with-sound.js` bundles, and updating [`scripts/test-javascript-export.mjs`](../scripts/test-javascript-export.mjs) accordingly? *(Recommended: Yes — universally supported by all modern browsers and ~12–16× smaller.)*
3. **Rollout cadence:** Implement all 4 phases (P1 → P4) in sequence with full verification at the end, or pause after each phase for review and benchmark check-in?
