// engine/timeline.js: asset manifests, registries, and the per-frame dispatcher.
//
// Every asset is a self-contained folder: characters/<id>/, locations/<id>/ or scenes/<series>/<id>/. Each folder holds an
// asset.js manifest that calls asset({...}) (title, logline, code files, docs, reference art, …), its code, its
// README.md and its reference art. registry.js only lists the folder names (and the movie order).
//
// A scene file calls scene({ duration, fps, bpm, shots: [[t0, fn], ...] }). The id, title and audio come from the
// scene folder's asset.js. A shot fn is called as fn(t, lt, dur): t = scene time, lt = time since the shot started,
// dur = shot length. It paints the WHOLE frame (background included). Cuts land on each shot's start time.
// Characters and locations register themselves on CHARACTERS / LOCATIONS so scenes can find them by id.

// ASSETS.character / .location / .scene: the manifests, with paths resolved relative to the project root.
const ASSETS = { character: {}, location: {}, scene: {} };
let CURRENT_ASSET = null;             // set by the loader while an asset folder's files run
function asset(meta) {
  const a = CURRENT_ASSET; if (!a) throw new Error('asset() must be called from an asset folder\'s asset.js');
  const at = f => f && (/^(https?:|data:|\/)/.test(f) ? f : `${a.dir}/${f}`);
  Object.assign(a, meta, { docs: at(meta.docs ?? 'README.md'), refs: (meta.refs || []).map(at), audio: at(meta.audio), files: meta.files || [] });
  ASSETS[a.kind][a.id] = a;
  return a;
}
// Recorded voice clips for a scene's dialogue (written by scripts/tts_gemini.mjs into the scene's voice.js).
// voiceClips({ '<line text without *>': { dur, src: 'data:audio/mpeg;base64,…' } }). A line with a clip plays it
// (from line.at + .2, when its bubble starts typing) instead of the synthesized cartoon syllables.
const VOICE_CLIPS = {};
function voiceClips(clips) { const a = CURRENT_ASSET; if (a) VOICE_CLIPS[a.id] = { ...VOICE_CLIPS[a.id], ...clips }; }
const voiceClipFor = (sceneId, line) => VOICE_CLIPS[sceneId]?.[line.text.replace(/\*/g, '')];
// ---------- loading (browser only) ----------
// The studio reads every manifest up front (series.js + asset.js: small) but only loads an asset's code when it is
// needed: loadAsset('character', 'alma'), or requireScene(id) for a scene and everything it uses.
// Scripts download in parallel but run in the order they were queued (async = false), so an asset's files still run one
// after another; tiny data: scripts queued between them set CURRENT_ASSET / CURRENT_SERIES, as a sequential loader would.
function runScripts(items) {
  return Promise.all(items.map(it => new Promise((ok, bad) => {
    const s = document.createElement('script'); s.async = false;
    if (typeof it === 'string') { s.src = it; s.onerror = () => bad(new Error('failed to load ' + it)); }
    else { s.vars = it; s.src = 'data:text/javascript,' + encodeURIComponent('({ CURRENT_ASSET, CURRENT_SERIES } = document.currentScript.vars)'); s.onerror = ok; }
    s.onload = ok; document.body.appendChild(s);
  })));
}
const unset = { CURRENT_ASSET: null, CURRENT_SERIES: null };
// Every series file, then every asset.js. Scenes come from the series files (engine/series.js): scenes/<series>/<id>.
async function loadManifests() {
  await runScripts([...REGISTRY.series.flatMap(sid => [{ ...unset, CURRENT_SERIES: sid }, `scenes/${sid}/series.js`]), unset])
    .catch(e => { throw new Error(`${e.message} (every series folder needs a series.js: see docs/HANDBOOK.md)`); });
  expandSeries();
  const items = [];
  for (const [kind, key] of [['character', 'characters'], ['location', 'locations'], ['scene', 'scenes']]) {
    for (const id of REGISTRY[key]) {
      const dir = kind === 'scene' ? sceneDir(id) : `${key}/${id}`;
      items.push({ ...unset, CURRENT_ASSET: { kind, id, dir } }, `${dir}/asset.js`);
    }
  }
  await runScripts([...items, unset]).catch(e => { throw new Error(`${e.message} (every asset folder needs an asset.js: see docs/HANDBOOK.md)`); });
}
// One asset's code files, once. Resolves when they have run.
const LOADING = {};
function loadAsset(kind, id) {
  const a = ASSETS[kind][id]; if (!a) return Promise.reject(new Error(`unknown ${kind} "${id}"`));
  return LOADING[kind + ':' + id] ??= runScripts([{ ...unset, CURRENT_ASSET: a }, ...a.files.map(f => `${a.dir}/${f}`), unset]);
}
// What a scene needs: its cast and locations (from its asset.js; a scene without a cast list gets every character and
// location), the scenes it borrows helpers from (`uses`, followed all the way, in studio load order), then itself.
function sceneDeps(id) {
  const m = ASSETS.scene[id]; if (!m) throw new Error('unknown scene ' + id);
  const uses = new Set(), follow = sid => (ASSETS.scene[sid]?.uses || []).forEach(dep => { if (!uses.has(dep)) { uses.add(dep); follow(dep); } });
  follow(id);
  const scenes = REGISTRY.scenes.filter(sid => uses.has(sid) && sid !== id).concat(id), all = !m.cast;
  const chars = new Set(), locs = new Set();
  for (const sid of scenes) { (ASSETS.scene[sid].cast || []).forEach(c => chars.add(c)); (ASSETS.scene[sid].locations || []).forEach(l => locs.add(l)); }
  return [...REGISTRY.characters.filter(c => all || chars.has(c)).map(c => ['character', c]),
    ...REGISTRY.locations.filter(l => all || locs.has(l)).map(l => ['location', l]), ...scenes.map(s => ['scene', s])];
}
const requireScene = id => Promise.all(sceneDeps(id).map(([kind, aid]) => loadAsset(kind, aid))).then(() => SCENES[id]);
// Everything, in the old load order (tests and tools that walk every CHARACTERS / LOCATIONS / SCENES entry).
const loadAll = () => Promise.all([['character', 'characters'], ['location', 'locations'], ['scene', 'scenes']].flatMap(([kind, key]) => REGISTRY[key].map(id => loadAsset(kind, id))));

const SCENES = {}, CHARACTERS = {}, LOCATIONS = {};
let SCENE = null;
function scene(def) {
  const a = CURRENT_ASSET?.kind === 'scene' ? CURRENT_ASSET : null;
  def.id ??= a?.id; def.title ??= a?.title; def.audio ??= a?.audio; def.music ??= a?.music; def.dialogue ??= a?.dialogue; def.tts ??= a?.tts; def.dir ??= a?.dir;
  def.shots.sort((x, y) => x[0] - y[0]); def.fps ??= 24; SCENES[def.id] = def; return def;
}
function useScene(id) { SCENE = SCENES[id] || null; if (SCENE) { BPM = SCENE.bpm ?? 100; BEAT_OFF = SCENE.beatOffset ?? 0; } return SCENE; }

let GRAIN = null;
function makeGrain() {
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const c = cv.getContext('2d'), id = c.createImageData(W, H), d = id.data, r = mulberry(5);
  for (let i = 0; i < d.length; i += 4) { const v = 255 - (r() < .5 ? r() * r() * 22 : 0); d[i] = v; d[i + 1] = v; d[i + 2] = v - 2; d[i + 3] = 255; }
  c.putImageData(id, 0, 0);
  const g = c.createRadialGradient(W / 2, H / 2, H * .5, W / 2, H / 2, H * 1.1); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(110,80,70,.30)');
  c.fillStyle = g; c.fillRect(0, 0, W, H);
  return cv;
}

// Paint one complete frame with any painter fn(): resets per-frame state, then paper grain + vignette, then overlays.
// Scenes go through drawFrame(); the studio's character / location views call paintFrame() directly.
function paintFrame(t, fn, { transparent = false } = {}) {
  T = t; boilSeed(t); OVERLAYS = []; CAM = null; JIT = 0;
  X.setTransform(1, 0, 0, 1, 0, 0); X.globalAlpha = 1; X.globalCompositeOperation = 'source-over';
  if (transparent) X.clearRect(0, 0, W, H);
  else { X.fillStyle = '#1E1418'; X.fillRect(0, 0, W, H); }
  X.save(); fn(t); X.restore();
  CAM = null; JIT = 0; X.setTransform(1, 0, 0, 1, 0, 0);
  if (!transparent) {
    if (!GRAIN) GRAIN = makeGrain();
    X.globalCompositeOperation = 'multiply'; X.drawImage(GRAIN, 0, 0); X.globalCompositeOperation = 'source-over';
  }
  flushOverlays();
}

// The shot playing at scene time t: { index, t0, end, fn }.
function shotAt(sc, t) {
  let i = 0; while (i + 1 < sc.shots.length && t >= sc.shots[i + 1][0]) i++;
  return { index: i, t0: sc.shots[i][0], end: i + 1 < sc.shots.length ? sc.shots[i + 1][0] : sc.duration, fn: sc.shots[i][1] };
}

function drawFrame(t, sc = SCENE) {
  paintFrame(t, () => {
    if (!sc) { X.fillStyle = '#fff'; X.font = '40px sans-serif'; X.fillText('no scene loaded', 80, 100); return; }
    const tt = clamp(t, 0, sc.duration - 1e-6), sh = shotAt(sc, tt);
    sh.fn(tt, tt - sh.t0, sh.end - sh.t0);
  });
}
