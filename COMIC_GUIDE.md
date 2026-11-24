# Safadi Studio Comic Guide

How to write, lay out, render, and illustrate comics in `2d-animation-studio` using shared character rigs (`characters/`), 3D sets (`locations/`), `engine/comic.js`, and Gemini Nano Banana 2.1 (`gemini-nano-banana-2.1`).

---

## 1. Two-Stage Workflow

0. **Starting from Hand-Drawn Pictures (Optional)**
   - Save user-provided pictures or sketches directly inside `comics/<book_id>/<comic_id>/` as original drawings (`Original Drawing.jpg`, or `Original Drawing 1.jpg`, `Original Drawing 2.jpg`, …) and list them in `asset.js` under `refs: [...]`.
   - Analyze every drawing panel-by-panel (panel layout, characters, outfits, props, settings, expressions, captions, SFX, and speech bubbles) to draft the storyline and panel script.
   - Clarify any ambiguities (hard-to-read handwriting, speaker attribution, panel order, unnamed characters/props, book choice) with the author before writing `comic.js` or running Gemini illustration.
1. **Stage 1 — Studio Edition (Code-Rendered Blueprint, zero API cost)**
   - Scaffold a book (`scripts/new.sh book <book_id>`) and comic (`scripts/new.sh comic <book_id> <comic_id>`).
   - Write the story description, character notes, and panel script in `README.md` first.
   - Author `comic.js` using `engine/comic.js` and existing character rigs (`sami`, `jenna`, etc.).
   - Iterate on framing, poses, outfits, expressions, and dialogue live in `studio.html` under **Comics**.
2. **Stage 2 — Illustrated Edition (Gemini Nano Banana 2.1)**
   - Once blocking and dialogue are locked, run `npm run comic:illustrate -- <comic_id>` (or click **✨ Refine with Gemini** inside `studio.html` while running `npm run studio`).
   - Compare **Studio (Code)**, **Illustrated (Gemini)**, and **Side by Side** views in `studio.html`, and print or export multi-page PDFs with `npm run comic:build -- <comic_id> --pdf`.

---

## 2. Folder Layout & Git Tracking

```text
comics/
└── <book_id>/                      # e.g. sami_and_jenna/
    ├── book.js                     # book({ title, category, logline, size, style, defaults, comics })
    ├── style_refs/                 # 1–4 style anchor images (git-tracked)
    └── <comic_id>/                 # e.g. ice_skating/
        ├── asset.js                # asset({ title, logline, cast, locations, files, docs, refs, illustrated, illustration })
        ├── README.md               # Story & panel script
        ├── comic.js                # Calls comic({ pages: [...] })
        ├── Original Drawing.jpg    # Optional reference art (git-tracked)
        ├── studio/                 # Studio PNGs: page-01.png + panel PNGs (git-tracked)
        ├── illustrated/
        │   ├── manifest.js         # Active/approved manifest loaded by Studio (git-tracked)
        │   ├── page-01.png         # Active/approved illustrated PNG(s) (git-tracked)
        │   ├── index.json          # Local SHA-1 cache & take metadata (gitignored)
        │   └── takes/              # Historical takes (gitignored)
        └── out/                    # Regenerable print PDFs: studio.pdf, illustrated.pdf (gitignored)
```

Studio PNG outputs (`studio/`), active/approved `illustrated/*.png`, `illustrated/manifest.js`, `style_refs/`, and top-level comic reference images are tracked in git; `out/`, `illustrated/takes/`, and `illustrated/index.json` remain gitignored.

---

## 3. Authoring `book.js` & `asset.js`

- **`comics/<book_id>/book.js`** owns trim size (`{ width, height, trim, dpi }`), art style (`style: { prompt, refs }`), default cast/illustration settings, and the ordered `comics: [...]` list.
- **`comics/<book_id>/<comic_id>/asset.js`** declares `title`, `logline`, `cast`, `locations`, `files: ['comic.js']`, `docs: 'README.md'`, optional `refs`, optional `illustrated: 'illustrated/manifest.js'` (automatically set by `scripts/illustrate_comic.mjs`), and `illustration: { model, mode, resolution, stylePrompt, thinkingLevel }`.
- **Important**: Only list registered `LOCATIONS` IDs in `asset.locations` that `comic.js` actually draws. Custom 2D panel backgrounds do not need entries in `locations`.

---

## 4. Authoring `comic.js` (`engine/comic.js`)

Separate every panel into **visual art (`draw(pw, ph)`)** and **declarative lettering (`lettering`)**:

```js
comic({
  paper: '#FFFDF7',
  margin: 52,
  gutter: 20,
  pages: [
    {
      id: 'page-01',
      masthead: { title: 'MY COMIC!', subtitle: 'Book subtitle' },
      rows: [
        {
          height: 380,            // fixed px height, or omit and use `weight: 1`
          panels: [
            {
              id: 'p1_opening',
              weight: 1,          // or fixed pixel `width`
              cast: ['sami', 'jenna'],
              prompt: 'Optional scene description for per-panel Gemini mode.',
              draw(pw, ph) {
                // Draw background, props, and character rigs ONLY (no bubbles/captions/SFX)
              },
              lettering: {
                captions: [{ text: 'AT HOME', x: 14, y: 14, size: 22 }],
                sfx:      [{ text: 'ZIP!', x: 0.78, y: 0.55, size: 48, rot: -0.12, fill: '#FFD84D' }],
                bubbles:  [{ speaker: 'sami', text: 'Hello!', cx: 0.75, cy: 0.24, tx: 0.60, ty: 0.44, size: 23, maxW: 280 }],
              },
            },
          ],
        },
      ],
    },
  ],
});
```

### Coordinate Rules in Declarative `lettering`
- Values in `(0, 1]` are normalized panel fractions (`pw * v`, `ph * v`).
- Values `< 0` are offsets from the right/bottom edge (`pw + v`, `ph + v`), e.g. `{ x: -16, y: -58, align: 'right' }`.
- Values `> 1` are literal panel pixels.

### Key `engine/comic.js` Helpers
- `drawPanelFrame(x, y, w, h, paintFn, opts)` — clipped panel with drop shadow and ink frame.
- `drawCaptionBox(text, x, y, opts)` — yellow narration/location box (`align: 'left' | 'center' | 'right'`).
- `drawSpeechBubble(text, cx, cy, tx, ty, opts)` — word-wrapped comic bubble with curved tail pointing at `(tx, ty)`.
- `drawComicSfx(text, x, y, opts)` — bold outlined display SFX (`Luckiest Guy`).
- `toPanelLocal(pt)` — converts `toPx(...)` rig anchors back into panel-local coordinates.
- `drawLocationInPanel(pw, ph, render1080pFn)` — renders any 3D `LOCATIONS.*` set at `1920×1080` offscreen and cover-blits it cleanly into `(pw, ph)` without affecting `W`/`H`.
- `computePageLayout(comicDef, pageIndex)` / `extractPageScript(comicDef, pageIndex)` — deterministic geometry and verbatim script extraction.

---

## 5. Refinement Modes & Gemini Nano Banana 2.1

| Mode | Best For | How It Works |
|---|---|---|
| `mode: 'page'` | Cohesive storybook pages in a single API call | Sends full Studio page PNG (with lettering) + book style refs + cast refs + verbatim dialogue script. |
| `mode: 'panel'` | Maximum detail, surgical per-panel re-rolls, editable dialogue | Exports borderless bubble-free panel PNGs (`lettering: false`), refines each panel full-bleed with zero text, and composites vector frames + lettering on top. |

### Reference Budgets & Aspect Ratios
- `gemini-nano-banana-2.1` accepts up to **14 reference images total**, capped at **4 character references** and **4 style references** (plus the Studio blueprint PNG). Specify per-panel `cast: [...]` when a book has more than 4 characters.
- `scripts/illustrate_comic.mjs` automatically snaps each page or panel `(w, h)` to the closest supported Gemini aspect ratio (`1:1`, `2:3`, `3:2`, `3:4`, `4:3`, `4:5`, `5:4`, `9:16`, `16:9`, `21:9`, `1:4`, `4:1`, `1:8`, `8:1`), and `engine/comic.js` composites illustrated panels with aspect-fill (`cover`) center-crop and full pages with `contain` so nothing stretches or clips.

---

## 6. CLI Commands

```bash
# Scaffold a new book or comic
scripts/new.sh book my_book "Sami's Studio"
scripts/new.sh comic sami_and_jenna snow_day

# Build Studio PNGs, clean bubble-free panel PNGs, and print PDFs
npm run comic:build -- ice_skating --panels --pdf

# Preview reference payload, snapped aspect ratios, and cache hashes (no API call)
npm run comic:illustrate -- ice_skating --dry-run
npm run comic:illustrate -- ice_skating --dry-run --mode=panel --panel=5

# Refine with Gemini Nano Banana 2.1 (set GEMINI_API_KEY in env or .env)
GEMINI_API_KEY=... npm run comic:illustrate -- ice_skating
GEMINI_API_KEY=... npm run comic:illustrate -- ice_skating --mode=panel --panel=5 --force

# Promote a previous cached take to active/approved
npm run comic:illustrate -- ice_skating --page=1 --approve=v2
```
