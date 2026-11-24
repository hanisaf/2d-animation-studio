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
// location), the scenes it borrows helpers from (`uses`, followed all the way, in studio load order), any cross-asset
// `uses` declared by characters/locations (e.g. 'character:jester_fester'), then itself.
function sceneDeps(id) {
  const m = ASSETS.scene[id]; if (!m) throw new Error('unknown scene ' + id);
  const uses = new Set(), follow = sid => (ASSETS.scene[sid]?.uses || []).forEach(dep => { if (!uses.has(dep)) { uses.add(dep); follow(dep); } });
  follow(id);
  const scenes = REGISTRY.scenes.filter(sid => uses.has(sid) && sid !== id).concat(id), all = !m.cast;
  const chars = new Set(), locs = new Set();
  const addAsset = (kind, aid) => {
    const bucket = kind === 'character' ? chars : kind === 'location' ? locs : null;
    if (!bucket || bucket.has(aid)) return;
    bucket.add(aid);
    for (const ref of ASSETS[kind]?.[aid]?.uses || []) {
      const i = ref.indexOf(':');
      const rk = i >= 0 ? ref.slice(0, i) : kind, rid = i >= 0 ? ref.slice(i + 1) : ref;
      addAsset(rk, rid);
    }
  };
  for (const sid of scenes) {
    (ASSETS.scene[sid].cast || []).forEach(c => addAsset('character', c));
    (ASSETS.scene[sid].locations || []).forEach(l => addAsset('location', l));
  }
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
function useScene(id) { SCENE = SCENES[id] || null; if (typeof clearStaticLayers === 'function') clearStaticLayers(); if (SCENE) { BPM = SCENE.bpm ?? 100; BEAT_OFF = SCENE.beatOffset ?? 0; } return SCENE; }

// Animated 12 fps tiled paper grain (4 small tiles) + cached radial vignette.
const _GRAIN_SIZE = 256, _GRAIN_SEEDS = [5, 17, 31, 47];
let _GRAIN_TILES = null;
const _GRAIN_PATS = new WeakMap(), _VIGNETTES = new WeakMap();
function _makeGrainTile(seed) {
  const cv = document.createElement('canvas'); cv.width = cv.height = _GRAIN_SIZE;
  const c = cv.getContext('2d'), id = c.createImageData(_GRAIN_SIZE, _GRAIN_SIZE), d = id.data, r = mulberry(seed);
  // Black with baked alpha replaces the costly full-frame multiply pass.
  // Keep the same random samples/quantization as the old tile; only its subtle blue-channel tint is omitted.
  for (let i = 0; i < d.length; i += 4) { const v = 255 - (r() < .5 ? r() * r() * 22 : 0); d[i + 3] = 255 - Math.round(v); }
  c.putImageData(id, 0, 0);
  return cv;
}
function _grainPatterns() {
  if (!_GRAIN_TILES) _GRAIN_TILES = _GRAIN_SEEDS.map(_makeGrainTile);
  let pats = _GRAIN_PATS.get(X);
  if (!pats) { pats = _GRAIN_TILES.map(cv => X.createPattern(cv, 'repeat')); _GRAIN_PATS.set(X, pats); }
  return pats;
}
function _vignetteGrad() {
  let g = _VIGNETTES.get(X);
  if (!g) {
    g = X.createRadialGradient(W / 2, H / 2, H * .5, W / 2, H / 2, H * 1.1);
    g.addColorStop(0, 'rgba(110,80,70,0)'); g.addColorStop(1, 'rgba(110,80,70,.28)');
    _VIGNETTES.set(X, g);
  }
  return g;
}
function drawPaperFinish(t) {
  const gAmt = SCENE?.grain ?? 1, vAmt = SCENE?.vignette ?? 1;
  if (gAmt > .01) {
    const f = Math.floor(t * BOIL + 1e-6), pat = _grainPatterns()[((f % 4) + 4) % 4];
    const ox = Math.floor(hash(f * 3.17 + 1) * _GRAIN_SIZE), oy = Math.floor(hash(f * 7.31 + 5) * _GRAIN_SIZE);
    X.save();
    X.globalCompositeOperation = 'source-over';
    if (gAmt < .999) X.globalAlpha = clamp(gAmt);
    X.translate(-ox, -oy);
    X.fillStyle = pat;
    X.fillRect(ox, oy, W, H);
    X.restore();
  }
  if (vAmt > .01) {
    X.save();
    X.globalCompositeOperation = 'source-over';
    if (vAmt < .999) X.globalAlpha = clamp(vAmt);
    X.fillStyle = _vignetteGrad();
    X.fillRect(0, 0, W, H);
    X.restore();
  }
}

// Paint one complete frame with any painter fn(): resets per-frame state, then colour grade, paper grain + vignette, then overlays.
// Scenes go through drawFrame(); the studio's character / location views call paintFrame() directly.
function paintFrame(t, fn, { transparent = false } = {}) {
  if (typeof _trackCtx === 'function') _trackCtx(X);
  T = t; boilSeed(t); OVERLAYS = []; CAM = null; JIT = 0; LIGHT = null; GRADE = null;
  X.setTransform(1, 0, 0, 1, 0, 0); X.globalAlpha = 1; X.globalCompositeOperation = 'source-over';
  if (transparent) X.clearRect(0, 0, W, H);
  else { X.fillStyle = '#1E1418'; X.fillRect(0, 0, W, H); }
  X.save(); fn(t); X.restore();
  CAM = null; JIT = 0; LIGHT = null; X.setTransform(1, 0, 0, 1, 0, 0);
  if (!transparent) {
    applyGrade();
    drawPaperFinish(t);
  } else GRADE = null;
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
