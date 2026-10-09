# Safadi Animation Studio

A 2D cartoon animated entirely in code. Every frame is a pure function of time, painted on an HTML canvas in headless Chrome and encoded with ffmpeg. The architecture follows [PDoomVideo](../PDoomVideo): a storyboard, an animation guide, character rigs as functions, and a renderer that makes contact sheets for checking the work.

## Layout

| Path | What it is |
|---|---|
| [`characters/`](characters/) | One self-contained folder per character: `asset.js` (manifest), `README.md` (who they are, look, rig API), the rig code and reference art |
| [`locations/`](locations/) | One folder per set: `asset.js`, `README.md` (description, layout, spots, cameras), the 3D set code and reference art |
| [`scenes/`](scenes/) | One folder per scene: `asset.js` (title, cast, locations, optional synthesized music or audio), `README.md` (synopsis, script, shot list), `scene.js` |
| [`engine/`](engine/) | Shared code: drawing primitives and timing (`core.js`), 3D perspective (`persp.js`), speech bubbles (`callout.js`), scene registry and frame dispatch (`timeline.js`) |
| [`registry.js`](registry.js) | The asset folder names and the movie's scene order |
| [`studio.html`](studio.html) + [`studio/`](studio/) | **The studio**: browse scenes, characters and locations; play; export MP4 right in the browser |
| [`serve.mjs`](serve.mjs) | Tiny local server for the studio (`npm run studio`) |
| [`render.mjs`](render.mjs) | Renderer: contact sheets, stills, clips, full frames, encoding, movie assembly |
| [`scripts/`](scripts/) | Shell shortcuts: build a scene, build the movie, preview, scaffold new assets |
| [`docs/HANDBOOK.md`](docs/HANDBOOK.md) | **Complete documentation:** moving to a new machine, architecture, full API, scenes, workflows, troubleshooting |
| [`SERIES.md`](SERIES.md) | The series bible: premise, tone, look, and links to every character, set and episode |
| [`ANIMATION_GUIDE.md`](ANIMATION_GUIDE.md) | How to write a scene or rig, and the style rules |

## Setup

You need Node.js 18+ and Google Chrome. ffmpeg comes with the project (`ffmpeg-static`), so a system install isn't needed. On a new machine, see [docs/HANDBOOK.md §2](docs/HANDBOOK.md#2-moving-to-a-new-machine).

```bash
npm install
node render.mjs --doctor      # checks Node, Chrome, ffmpeg and fonts, and renders a test frame
```

## The studio

```bash
npm run studio                                 # → http://localhost:5173
```

- **Scenes**: play/scrub with a shot timeline and audio preview; **Export scene MP4** straight from the browser (WebCodecs; Chrome/Edge). Scene 01 synthesizes music and cartoon dialogue from `scenes/scene01_juggling/asset.js`. **Copy play link** gives a URL such as `studio.html?scene=scene01_juggling&play=true`, which starts playback in a full-window view without the tools. If the browser blocks autoplay with sound, click **Tap for sound**; after the scene ends, **Replay with sound** starts it again.
- **Movie composer**: choose scenes, set in/out points, reorder or remove clips, preview the cut, and export the selected movie as MP4. The composition is saved in this browser.
- **Characters**: every pose (on paper or standing in a location at true scale) and the full model sheet, next to the reference art.
- **📄 Docs**: each asset's `README.md` (description, script, shot list, API) beside its preview, cross-linked (a scene ↔ its cast ↔ its locations); project docs in the sidebar.
- **Locations**: fly a camera through the set (presets, sliders, drag/wheel, WASD, **⇄ Reverse** for a reverse angle), drop a character on a spot for scale, and **Copy camera** as code for your scene.

## Compile a scene to video from the command line

```bash
scripts/build_scene.sh scene01_juggling        # → out/scene01_juggling/scene01_juggling.mp4
```

The script paints every frame in parallel into `out/<scene>/frames/`, then encodes 1080p H.264. A scene with `music` or `dialogue` in its `asset.js` gets a synthesized soundtrack; otherwise an optional audio file is used, or a silent track if neither exists.

## Synthesized music

Scene 01's `asset.js` contains a human-readable music prompt plus a deterministic score: tempo, melody motif, chord progression, energy sections, and cues tied to actions. The prompt describes the intended sound; the score fields produce it consistently during playback, scrubbing, movie trims, and exports. Add a `music` object to another scene manifest to use the same synthesizer without supplying an audio file.

## Cartoon voices

Scene 01 also has a `dialogue` list in its `asset.js`. Each line supplies the bubble text, speaker, start time, typing speed, and hold time. Jester's `voice` in `characters/jester_fester/asset.js` defines his pitch and tone. The soundtrack synthesizer makes short vowel-like syllables as the words appear, and lowers the music during speech. The bubbles remain responsible for the actual words. Playback and both MP4 exporters use the same rendered soundtrack. Add matching `dialogue` entries and a character `voice` profile to try this in another scene.

Every scene with spoken bubbles now uses the same vocalization system. Fester sounds bouncy, Pearl clipped and regal, Safadi measured and warm, Housam quick and percussive, and Alma melodic. Dragon has a gentle low voice profile ready for a future spoken line. Scene 06 is a 110-second lesson outside DCES.

```bash
scripts/build_movie.sh                         # every scene in REGISTRY.movie, joined → out/movie.mp4
```

## Preview while animating

```bash
scripts/preview.sh studio                      # same as npm run studio
scripts/preview.sh sheet scene01_juggling 1,5,9.5,14,21.6,28.9
scripts/preview.sh clip scene01_juggling 20:26
```

## Add new things

```bash
scripts/new.sh character princess_petunia     # characters/princess_petunia/ {asset.js, README.md, rig} + registry
scripts/new.sh location castle_kitchen        # locations/castle_kitchen/ {asset.js, README.md, set} + registry
scripts/new.sh scene scene03_auditions        # scenes/scene03_auditions/ {asset.js, README.md, scene.js} + movie order
```

Each new folder is self-contained: describe the asset in its `README.md` (for a scene: synopsis, script, shot list), put reference art in the folder and list it in `asset.js`, then write the code. See [ANIMATION_GUIDE.md](ANIMATION_GUIDE.md) and [docs/HANDBOOK.md §8](docs/HANDBOOK.md#8-assets-characters-locations-scenes).

> **Note on Naming Conflicts:** All character, location, and scene scripts are loaded into the same global environment without module isolation (no `import`/`export`). To avoid naming collisions that can cause scripts to silently overwrite each other or throw syntax errors, always namespace your internal helper functions and constants (e.g., prefixing them with `sm` for Sami, `sf` for Safadi, etc.) instead of using generic names.

## Embed a scene in a web page

Select a scene in the studio and choose **Export JavaScript (without sound)** or
**Export JavaScript (with sound)**. Each download includes the drawing engine,
shared character and location code, the selected scene, and embedded fonts.
The sound version renders the scene's music and cartoon voices during export and
embeds the finished WAV soundtrack (or its existing audio file). Long tracks render
in short overlapping sections to keep soundtrack preparation responsive. Downloaded players
need no audio synthesis: Unmute starts the embedded track at the current scene time.
Sound exports take longer to create and contain the full audio data, making them
larger than silent exports. The silent version keeps speech bubbles and omits audio. No studio server, CDN, or extra files are required by the downloaded player.
Export from the studio served by npm run studio; font embedding needs an internet
connection during export. A failed font or soundtrack download stops the export.

Put the downloaded JavaScript file beside index.html (or use its correct relative
path), then embed it with the following. Use your actual exported filename:

~~~html
<div id="animation"></div>
<script src="scene01_juggling.silent.js"
        data-mount="#animation" data-loop="true"></script>
~~~

The script mounts its own scene, so no scene identifier is needed. This also works
with async or defer and scripts placed in the head: it waits for the page content.
Set data-autoplay="false" or data-controls="false" as needed.

For manual control of a single export, load the script before calling:

~~~javascript
const player = await MyScene.mount('#animation', { loop: true });
// player.pause(); player.seek(8); await player.play(); player.destroy();
~~~

MyScene always refers to the most recently loaded export. For multiple exports,
use SafadiScenes['the-exact-scene-id'].mount(...). The scene ID is printed in the
first line of the downloaded file and is available as MyScene.id. For IDs containing
hyphens, use bracket notation. Do not keep scene01_juggling in manual code when
loading a different scene. An undefined mount error means that scene ID is absent
from the registry, or the downloaded script has not loaded yet. Check the script
filename/path and browser Network/Console errors. With manual code and async/defer,
wait for the script load event before calling mount.


For sound, change the script filename to scene01_juggling.with-sound.js.
Exported players start **muted**, play immediately without waiting for sound
preparation, and provide compact Play/Pause, a seek slider,
elapsed/total time, Mute/Unmute, and playback speed (0.5x–2x). Silent exports
disable the sound button. Re-export existing files to get the updated controls.
Use `data-muted="false"` to start with sound or `data-speed="1.5"` for a different
initial speed. Browsers may block audible autoplay; click Play to enable sound.
Each mount has independent playback and drawing state; several scenes or instances
can coexist. mount returns a promise for a player with play, pause, seek(seconds),
destroy, setMuted(boolean), setPlaybackRate(number), canvas, currentTime, duration,
playing, muted, and playbackRate. Manual mount options also accept muted (default
true) and playbackRate (default 1; supported range 0.25–4). Set autoplay: false for a still
first frame, or controls: false when providing your own controls. The canvas scales
to the container's width. Loading both variants for the same scene makes the last
loaded variant the one used by subsequent mounts.
