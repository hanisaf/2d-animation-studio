---
name: build-arcade-game
description: Create, modify, or delete standalone browser arcade games in this animation studio and maintain their arcade index listings, using existing character rigs, Canvas rendering, offline HTML/CSS/JavaScript packaging, and gameplay tests. Use for playable games and their controls, graphics, or distribution; not for ordinary animation scenes or character exports.
---

# Build an arcade game

Create a playable game using this project's artwork. Follow the user's chosen mechanics and scope. Use Robo Invader · The Ultimate Edition as a working reference, not as a requirement to make every game a shooter.

All repository paths below are relative to the project root. Locate the root from this skill's `.agents/skills/build-arcade-game/` directory or Git, rather than assuming the shell starts there.

## Reference implementation

Inspect only the files needed for the change:

- `games/robo-invaders/page.html`: editable page structure and source script list.
- `games/robo-invaders/style.css`: responsive arcade presentation and touch controls.
- `games/robo-invaders/model.js`: gameplay state and fixed-step updates, independent of the DOM.
- `games/robo-invaders/game.js`: rendering, character sprite cache, input, and UI.
- `scripts/build-robo-invaders.mjs`: bundles shared engine, character rigs, model, and renderer into an offline runtime.
- `scripts/test-robo-invaders.mjs`: gameplay checks.
- `scripts/test-robo-invaders-browser.mjs`: browser checks, including playing a copied distribution outside the repository with networking blocked.

For a new game, choose its own `games/<slug>/` folder and adapt the relevant patterns. Preserve other games and unrelated work. Add a studio Arcade link when useful, but keep game startup independent of the studio.

## Keep the arcade index current

Whenever a game is created, changed, renamed, moved, or deleted, update `games/index.html` in the same task. This is the public arcade directory; the repository-root `index.html` opens it. Unlike each game's generated entry page, `games/index.html` is edited directly.

- For a new game, add a compact card to `.games` with its title, a short description, and a relative link to its playable `games/<slug>/index.html` (for example, `href="<slug>/"`).
- For a changed game, review and update its card so the title, version, description, and destination reflect the delivered game. If those details are unchanged, leave the accurate card intact and report that the listing was checked.
- For a renamed or moved game, update its existing card and link instead of leaving a stale or duplicate listing.
- For a deleted game, remove its card and any links to it from the index. Remove stale studio Arcade links if present.

Preserve the compact cards between Dr. Sami and Professor Safadi, their animated skeptical portraits, and the screen-time humor unless the user requests a redesign. Keep links relative so publishing either the repository root or the `games` directory continues to work. Do not list source pages, assets, or support folders as games.

After updating the directory, check that every game card points to an existing playable entry page and that no removed game remains linked. Inspect desktop and phone layouts when cards or their presentation change. See `games/README.md` for the publishing layout; updating the index does not require deploying the site.

## Reuse the artwork

Read the selected characters' `asset.js`, rig source, and relevant README API before drawing them. Registry entries identify assets for the studio; the standalone game bundles its own dependencies and does not need to load every registered asset.

The rigs use shared browser globals from `engine/core.js`, including `X` (drawing context), `T` (time), seeded jitter, and drawing primitives. Other engine files provide helpers or registries used by individual rigs. Determine the needed files and their order from the actual rig dependencies and the reference page. Do not copy the studio's asset-loading UI into a game.

When switching contexts to cache a character, set `X` to the cache context and restore the main context afterward. Initialize frame time and boil seed when painting. Reset or flush queued overlays deliberately. `flushOverlays()` resets the transform to identity while executing callbacks, so account for render scaling if a game uses overlay callbacks.

Cache repeated detailed characters in a few animation frames; draw the player live when expressive posing is useful. Draw at the cache's native resolution and pass explicit destination width and height to `drawImage`, so increasing pixel density does not enlarge the character accidentally.

## Separate gameplay size from pixel density

Keep movement, projectile positions, and collisions in logical game coordinates. Drive updates with a fixed step and render using `requestAnimationFrame`; cap elapsed time after stalls and pause when focus or visibility is lost.

Use a higher-resolution backing canvas with a drawing transform. Robo Invader · The Ultimate Edition uses a 960×540 logical field, a 1920×1080 backing canvas, and a 2× transform. CSS controls the displayed size and preserves the aspect ratio. Reapply the base transform each frame instead of accumulating scales. Canvas shadow blur does not scale with the transform; scale it explicitly when needed.

Treat character size as a separate choice. If changing size, update hitboxes, projectile origins, boundary clamps, formation spacing, and defeat thresholds to match the visible art. Do not scale gameplay speeds merely to increase raster resolution.

## Playable controls and feedback

Provide keyboard controls and touch buttons that support simultaneous movement and firing. Track held keys and pointer IDs; handle pointer cancellation and lost capture, and release input on blur, pause, and restart. Prevent scrolling for gameplay keys without breaking focused buttons or links.

Include the start, pause/resume, defeat, and restart states relevant to the game. Make score, lives, and progression visible when those mechanics apply. Keep keyboard focus usable, label controls, and announce significant state changes without announcing every frame. Inspect the actual desktop and phone layouts.

## Deliver an offline game

The established distribution is three neighboring files:

- `index.html`: generated entry page.
- `style.css`: standalone stylesheet.
- `runtime.js`: generated classic JavaScript bundle containing the engine dependencies, rigs, and game logic.

Keep these files independently playable by opening `index.html` directly from disk, as well as through HTTP. No studio startup, CDN, fetched assets, external fonts, or runtime repository paths should be needed. A classic script bundle avoids the `file://` restrictions that break module imports and fetches. If adding assets, include them locally and update the documented distribution contents and offline checks.

Retain editable source files in the repository. Edit `page.html`, `game.js`, `model.js`, and `style.css`, then rebuild; do not make source changes only in generated `index.html` or `runtime.js`. For Robo Invader · The Ultimate Edition run `npm run build:game`. Rebuild after changes to bundled rigs or engine code too. Its lightweight bundler understands the existing source shape; adapt it explicitly if adding module dependencies rather than assuming it resolves arbitrary imports.

For a new game, supply a reproducible build command and document which files to share. Keep source and distribution roles clear; users can omit source files from a sharing folder without deleting them from the project.

## Verify the result

Run checks appropriate to the mechanics changed. Test meaningful behaviors such as movement boundaries, collisions, scoring, cooldowns, immunity, wave progression, restart, and frozen state while paused. Keep simulation tests independent of rendering where practical.

For Robo Invader · The Ultimate Edition:

```sh
npm run build:game
node scripts/test-robo-invaders.mjs
CHROME=/path/to/chrome node scripts/test-robo-invaders-browser.mjs
```

Use the available Chrome executable; do not hardcode one developer's machine path. Browser checks should cover startup, rendering, keyboard and touch input, pause/resume, and responsive layout. Test the distributable files copied into a temporary directory outside the repository, open them with `file://`, block network requests, and check for script errors. For resolution changes, verify both backing-canvas and sprite-cache dimensions and their displayed size. Visually inspect character spacing and clipping; correct dimensions alone do not establish that the game looks right.

Report how to open the finished game, the relevant controls, and which checks passed. Keep remaining limitations explicit.
