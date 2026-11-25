---
name: create-comic
description: Create, adapt, edit, or illustrate comics and comic books in Safadi Animation Studio using existing character rigs, engine/comic.js, Studio Edition blueprints, and Gemini Nano Banana 2.1. Use whenever the user asks to create or update a comic, turn hand-drawn pictures or sketches into a comic, or build/illustrate comic pages and PDFs; not for animation scenes or arcade games.
---

# Create a Comic

Help the user turn ideas or hand-drawn pictures into finished, print-ready comics using Safadi Animation Studio's two-stage pipeline: **Stage 1 (Studio Edition code blueprint)** → **Stage 2 (Gemini Nano Banana 2.1 Illustrated Edition)**.

All repository paths below are relative to the project root. Locate the root from this skill's `.agents/skills/create-comic/` directory or Git, rather than assuming the shell starts there.

---

## 1. Intake User Pictures & Analyze the Storyline First

Whenever the user provides one or more pictures, photos, or hand-drawn sketches of a comic:

1. **Save the pictures as original drawings inside the comic folder**:
   - Determine the target book (`comics/<book_id>/`) and comic ID (`<comic_id>`). Scaffold first if needed (`scripts/new.sh book <book_id> [category]` and `scripts/new.sh comic <book_id> <comic_id>`).
   - Save the user's image(s) directly inside `comics/<book_id>/<comic_id>/` using clear original-drawing names (preserving extension):
     - Single picture: `Original Drawing.jpg` (or `.png` / `.jpeg` / `.webp`)
     - Multiple pictures / pages: `Original Drawing 1.jpg`, `Original Drawing 2.jpg`, … (in reading order)
   - List every saved drawing in `comics/<book_id>/<comic_id>/asset.js` under `refs: [...]` so they appear as reference thumbnails in `studio.html` and stay tracked in git (`.gitignore` allowlists `comics/*/*/*.{png,jpg,jpeg,webp}`).
2. **Analyze every drawing thoroughly to draft the storyline**:
   - Inspect each image panel by panel and extract:
     - Page count, panel grid layout, and reading order
     - Characters in each panel (mapping to existing rigs in `characters/` or noting new props/outfits/characters needed)
     - Settings, backgrounds, signs, and visual gags/details
     - Poses, facial expressions, and action beats
     - Every caption box, sound effect (SFX), and speech bubble (exact wording + speaker)
3. **Ask the user to clarify any ambiguities BEFORE writing `comic.js`**:
   - Present a concise panel-by-panel summary of the interpreted storyline and explicitly ask about anything uncertain, such as:
     - Hard-to-read handwriting, uncertain spelling/wording, or who says a given line
     - Ambiguous panel order, missing transitions, or page breaks
     - Unclear characters, outfits, props, or settings
     - Which book (`comics/<book_id>/`) the comic belongs to, or whether to create a new book & style direction
     - Whether to target **Full-Page** (`mode: 'page'`) or **Per-Panel + Vector Lettering** (`mode: 'panel'`) illustration
   - Do **not** guess silently on unclear dialogue or story beats—get user confirmation first, then finalize `README.md` with the approved story description and panel script.

If the user starts from a text prompt (without drawings), still confirm the target book, cast, page/panel breakdown, and script in `README.md` before coding `comic.js`.

---

## 2. Reference Implementation

Inspect only the files needed for the task:

- `COMIC_GUIDE.md`: authoring guide for `book.js`, `asset.js`, `engine/comic.js`, and CLI commands.
- `comics/sami_and_jenna/book.js`: reference book manifest (trim size, art style prompt, `style_refs/`, defaults, ordered `comics` list).
- `comics/sami_and_jenna/ice_skating/asset.js`: reference comic manifest (`cast`, `locations`, `files`, `docs`, `refs`, `illustrated`, `illustration`).
- `comics/sami_and_jenna/ice_skating/README.md`: story description and panel-by-panel script written before code.
- `comics/sami_and_jenna/ice_skating/comic.js`: 9-panel canonical reference using `engine/comic.js` with `sami` and `jenna` rigs.
- `engine/comic.js`: layout solver (`computePageLayout`), script extractor (`extractPageScript`), lettering primitives (`drawCaptionBox`, `drawSpeechBubble`, `drawComicSfx`), `toPanelLocal`, `drawLocationInPanel`, and `renderComicPage`.
- `scripts/build_comic.mjs`: headless Chrome renderer for Studio PNGs, clean bubble-free panel PNGs, and multi-page print PDFs.
- `scripts/illustrate_comic.mjs`: Gemini Nano Banana 2.1 refinement pipeline with SHA-1 caching and manifest updates.

---

## 3. Build Stage 1 — Studio Edition Blueprint

1. **Scaffold & register**:
   ```sh
   scripts/new.sh book <book_id> "<Category>"      # only if creating a new book
   scripts/new.sh comic <book_id> <comic_id>
   ```
2. **Write `README.md` and `asset.js` first**:
   - Put the confirmed storyline, cast notes, and page/panel script in `README.md`.
   - In `asset.js`, list every character rig used in `cast: [...]`, original drawings in `refs: [...]`, and **only registered `LOCATIONS` IDs** in `locations: [...]` (leave `locations: []` if panels paint custom 2D backgrounds inline).
   - Read each cast character's `characters/<id>/README.md` and `asset.js` before posing them so rig options, anchors, and scale match canonical APIs.
3. **Author `comic.js` with clean art vs. lettering separation**:
   - Wrap the entire file in an IIFE `(() => { ... })()` to avoid global name collisions.
   - Keep visual art inside each panel's `draw(pw, ph)` callback and put all captions, SFX, and speech bubbles in declarative `lettering: { captions, sfx, bubbles }` (using normalized `(0, 1]` panel fractions or negative edge offsets like `-16`). Never depend on runtime rig anchors inside `lettering` so per-panel illustrated mode can composite vector lettering cleanly.
   - List per-panel `cast: [...]` and `prompt: '...'` on panels whenever a comic has >4 characters or uses `mode: 'panel'`.
   - To render a registered 3D set (`LOCATIONS.*`) inside a panel without mutating `W`/`H`, use `drawLocationInPanel(pw, ph, () => { ... })`.
4. **Render & visually inspect the Studio blueprint**:
   ```sh
   npm run comic:build -- <comic_id> --panels --pdf
   ```
   Inspect `comics/<book_id>/<comic_id>/studio/page-01.png` (and any additional pages) visually to verify:
   - Zero overlapping speech bubbles or text clipped by panel borders
   - Speech bubble tails point cleanly toward the speaking character's mouth
   - Character proportions, outfits, props, and expressions faithfully match the user's original drawings and approved script
   - Iterate on `comic.js` until the Studio Edition looks right before moving to Stage 2.

---

## 4. Build Stage 2 — Illustrated Edition (Gemini Nano Banana 2.1)

Only run Stage 2 once the user approves the Studio Edition (or explicitly asks to illustrate right away):

0. **Lock Character & Setting Consistency FIRST (Stage 1.5)**:
   - Ensure `comics/<book_id>/book.js` defines `castBible` (per-character descriptions, `traits`, `avoid` rules, and painted `ref` portraits), `invariants` (book-wide visual rules), `style.castSheet` (a single illustrated model sheet showing every recurring character in the book's exact medium), and `locationRefs` for recurring rooms/skies.
   - Tag every panel in `comic.js` with `cast: [...]` and (where relevant) `location: '...'` so `scripts/illustrate_comic.mjs` routes only the matching character and location references and injects focused design locks into every prompt.
   - For multi-page books in `mode: 'page'`, enable `chainPreviousPage: true` in `book.js` so Page `N` stays visually anchored to Page `N-1`. For maximum face/eye fidelity and zero lettering typos, prefer `mode: 'panel'` (per-panel `2K` art + vector lettering on top).
1. **Dry-run first** (zero API cost) to verify reference budgets (`<= 4` character refs, `<= 14` total), snapped aspect ratios, routed `castBibleKeys`, and extracted verbatim dialogue:
   ```sh
   npm run comic:illustrate -- <comic_id> --dry-run
   ```
2. **Confirm before spending API quota** if the user hasn't already asked to call Gemini.
3. **Run illustration** (requires `GEMINI_API_KEY` in environment or `.env`):
   ```sh
   npm run comic:illustrate -- <comic_id>
   # or per-panel surgical re-roll:
   npm run comic:illustrate -- <comic_id> --mode=panel --panel=5 --force
   ```
4. **Inspect the generated artwork** (`comics/<book_id>/<comic_id>/illustrated/page-01.png` or panel PNGs):
   - Check character likeness, layout fidelity, and exact spelling of every caption, bubble, and SFX.
   - Re-roll individual pages/panels or promote a better take with `--approve=<take_id>` if needed.
   - Rebuild PDFs (`npm run comic:build -- <comic_id> --pdf`) so `out/illustrated.pdf` stays current.
5. **Respect Git tracking rules**:
   - Keep `comics/<book_id>/style_refs/*`, top-level `Original Drawing*` files, `studio/*.png` picture outputs, active/approved `illustrated/*.png`, `illustrated/manifest.js`, and `out/*.pdf` print PDFs ready to commit.
   - Never force-add gitignored cache files (`illustrated/takes/`, `illustrated/index.json`).

---

## 5. Verify Before Reporting Done

Run:
```sh
node scripts/test-comics.mjs
npm run comic:build -- <comic_id> --panels --pdf
```
Verify the comic opens cleanly in `studio.html?comic=<comic_id>` with zero console errors, works in Studio / Illustrated / Side-by-Side views, and report how the user can view it (`npm run studio` → `http://localhost:5173/studio.html?comic=<comic_id>`), print/export PDFs, or refine further.
