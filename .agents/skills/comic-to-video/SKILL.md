---
name: comic-to-video
description: Convert any registered Safadi Animation Studio comic into an animated MP4 video using direct Studio JavaScript-rendered frames, Veo 3.1 (native audio), and ffmpeg (subtitles/overlays & assembly). Use whenever the user asks to turn a comic into a video, animate a comic with Veo, build a comic video storyboard, or re-roll/assemble comic video shots; not for static comic print pages (use create-comic) or classic JS animation scenes.
---

# Comic to Video (Studio JS → Veo 3.1)

Turn any registered comic in `comics/<book_id>/<comic_id>/` directly into an animated MP4 video using **clean Studio JavaScript-rendered frames** + **Veo 3.1** + **`ffmpeg`** — skipping Nano Banana 2.1 keyframe restyling.

All repository paths below are relative to the project root.

---

## 1. Workflow Overview

1. **Plan & Visual Frame Check (`--plan`, zero API cost):**
   - Renders every panel cleanly (no speech bubbles, no panel borders) recomposed natively to `16:9` (`1280×720` or `1920×1080`) or `9:16` (`720×1280` or `1080×1920`) via `panel.draw(vw, vh)`.
   - Generates a visual contact sheet (`comics/<book_id>/<comic_id>/video/frames_sheet.jpg`) and an editable shot plan (`comics/<book_id>/<comic_id>/video/storyboard.json`).
   - Automatically pairs consecutive same-location panels into `interpolate` shots (`image` + `lastFrame`, 8s) and inserts hard-cut `single` shots (`image` only, 4/6/8s) at scene changes, title/bio cards, or explicit `video: { cut: true }` hints.
2. **Inspect & Refine Storyboard (zero API cost):**
   - Visually inspect `video/frames_sheet.jpg` to verify every recomposed frame looks clean (no clipped heads, no stretched characters). If a specific panel needs fallback framing, set `video: { framing: 'pad' }` or pass `--framing=pad|crop`.
   - Review `video/storyboard.json` (edit shot pairings, durations, or motion prompts, or run `--plan --enrich-prompts` for a Gemini Flash motion-prompt polish).
   - Run `--dry-run` to inspect exact Veo 3.1 parameters, SHA-1 hashes, clip counts, and total estimated seconds.
3. **Pilot 1–2 Shots First (confirm before spending video API quota):**
   - Always confirm with the user before making live API calls if they haven't explicitly asked to spend quota yet.
   - Start with `--shot=1` using the default Gemini API video model (`gemini-omni-1.2-flash` via `/v1beta/interactions`, `720p`, native audio `--audio=veo`; note that `veo-3.1-*-preview` on `generativelanguage.googleapis.com` was retired Oct 22, 2026 — passing `--model=veo-...` still routes to `:predictLongRunning` if needed).
   - Video generation requires a Pay-as-you-go / billing-enabled `GEMINI_API_KEY` in Google AI Studio (Free Tier returns `RESOURCE_EXHAUSTED`).
4. **Generate Remaining Shots & Assemble (`out/video.mp4`):**
   - Generate a page (`--page=2`) or the full comic.
   - All takes are SHA-1 cached in `video/takes/` and in-flight Veo operation IDs are persisted immediately to `video/index.json` so interrupted runs resume polling without double-billing.
   - `ffmpeg` normalizes clips (24fps, `yuv420p`, 48kHz stereo AAC), trims duplicate boundary frames on chained `interpolate` clips, writes `out/video.srt`, and applies clean subtitles (`--overlays=subtitles`, default `--subtitles=burn`, or `--subtitles=soft`) into `comics/<book_id>/<comic_id>/out/video.mp4`.

---

## 2. Commands

```sh
# 1. Zero-cost plan + export 16:9 Studio frames + contact sheet
npm run comic:video -- <comic_id> --plan
npm run comic:video -- <comic_id> --plan --page=2 --aspect=16:9

# 2. Zero-cost dry-run (inspect Veo payloads, hashes & estimated runtime)
npm run comic:video -- <comic_id> --dry-run
npm run comic:video -- <comic_id> --dry-run --page=2

# 3. Pilot a single shot (requires GEMINI_API_KEY in env or .env)
npm run comic:video -- <comic_id> --shot=1

# 4. Generate a page or full comic + assemble final MP4 with burned subtitles
npm run comic:video -- <comic_id> --page=2
npm run comic:video -- <comic_id>

# 5. Re-roll a single shot at higher quality or switch takes
npm run comic:video -- <comic_id> --shot=3 --quality --force
npm run comic:video -- <comic_id> --shot=3 --approve=v1

# 6. Re-assemble with different subtitle/overlay options (zero Veo cost)
npm run comic:video -- <comic_id> --assemble-only --overlays=subtitles --subtitles=soft
npm run comic:video -- <comic_id> --assemble-only --overlays=none
npm run comic:video -- <comic_id> --assemble-only --overlays=lettering
```

---

## 3. Optional Per-Panel Hints in `comic.js`

Any panel inside `comic.js` can optionally include a `video` block to guide the planner without editing `storyboard.json` manually:

```js
video: {
  cut: true,          // force a hard cut before this panel
  cutAfter: true,     // force a hard cut after this panel
  mode: 'single',     // never pair into an interpolate shot
  duration: 6,        // 4 | 6 | 8 seconds (single shots at 720p)
  framing: 'pad',     // 'recompose' (default) | 'pad' | 'crop'
  skip: true,         // omit from video (e.g., cover/credits)
  motion: 'Gentle zoom-in as Eve waves happily.',
}
```

---

## 4. Reference Files & Verification

- `docs/COMIC_TO_VIDEO_ACTION_PLAN.md`: architecture and design specification.
- `engine/comic.js`: panel recomposition (`computeVideoCanvasSize`, `renderComicPage` video options).
- `scripts/build_comic.mjs`: headless `--video-frames`, `--overlays`, and contact-sheet renderer.
- `scripts/comic_video_plan.mjs`: auto-storyboard grouping, 2D style-locked Veo prompt builder, and SRT generator.
- `scripts/comic_to_video.mjs`: Veo 3.1 REST client, resumable polling, SHA-1 caching, and `ffmpeg` assembler.
- Offline test suite (zero API cost):
  ```sh
  node scripts/test-comic-video.mjs
  node scripts/test-comics.mjs
  ```

### Git Tracking Rules
- `comics/**/video/storyboard.json` may be committed when curated.
- `comics/**/video/frames/`, `overlays/`, `takes/`, `clips/`, `index.json`, `frames_sheet*.jpg`, `out/*.srt`, and `*.mp4` are gitignored and regenerable.
