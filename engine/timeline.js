// engine/timeline.js: asset manifests, registries, and the per-frame dispatcher.
//
// Every asset is a self-contained folder: characters/<id>/, locations/<id>/ or scenes/<id>/. Each folder holds an
// asset.js manifest that calls asset({...}) (title, logline, code files, docs, reference art, …), its code, its
// README.md and its reference art. registry.js only lists the folder names (and the movie order).
//
// A scene file calls scene({ duration, fps, bpm, shots: [[t0, fn], ...] }). The id, title and audio come from the
// scene folder's asset.js. A shot fn is called as fn(t, lt, dur): t = scene time, lt = time since the shot started,
// dur = shot length. It paints the WHOLE frame (background included). Cuts land on each shot's start time.
// Characters and locations register themselves on CHARACTERS / LOCATIONS so scenes can find them by id.

// ASSETS.character / .location / .scene: the manifests, with paths resolved relative to the project root.
const ASSETS = { character: {}, location: {}, scene: {} };
let CURRENT_ASSET = null;             // set by the loader while an asset folder's files are loading
function asset(meta) {
  const a = CURRENT_ASSET; if (!a) throw new Error('asset() must be called from an asset folder\'s asset.js');
  const at = f => f && (/^(https?:|data:|\/)/.test(f) ? f : `${a.dir}/${f}`);
  Object.assign(a, meta, { docs: at(meta.docs ?? 'README.md'), refs: (meta.refs || []).map(at), audio: at(meta.audio), files: meta.files || [] });
  ASSETS[a.kind][a.id] = a;
  return a;
}
// Load every asset listed in REGISTRY (browser only): asset.js first, then the files it lists, in order.
async function loadAssets(load) {
  for (const [kind, dir] of [['character', 'characters'], ['location', 'locations'], ['scene', 'scenes']]) {
    for (const id of REGISTRY[dir]) {
      CURRENT_ASSET = { kind, id, dir: `${dir}/${id}` };
      try { await load(`${dir}/${id}/asset.js`); } catch { throw new Error(`${dir}/${id}/asset.js is missing (every asset folder needs one: see docs/HANDBOOK.md)`); }
      for (const f of CURRENT_ASSET.files) await load(`${dir}/${id}/${f}`);
    }
  }
  CURRENT_ASSET = null;
}

const SCENES = {}, CHARACTERS = {}, LOCATIONS = {};
let SCENE = null;
function scene(def) {
  const a = CURRENT_ASSET?.kind === 'scene' ? CURRENT_ASSET : null;
  def.id ??= a?.id; def.title ??= a?.title; def.audio ??= a?.audio; def.dir ??= a?.dir;
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
function paintFrame(t, fn) {
  T = t; boilSeed(t); OVERLAYS = []; CAM = null; JIT = 0;
  X.setTransform(1, 0, 0, 1, 0, 0); X.globalAlpha = 1; X.globalCompositeOperation = 'source-over';
  X.fillStyle = '#1E1418'; X.fillRect(0, 0, W, H);
  X.save(); fn(t); X.restore();
  CAM = null; JIT = 0; X.setTransform(1, 0, 0, 1, 0, 0);
  if (!GRAIN) GRAIN = makeGrain();
  X.globalCompositeOperation = 'multiply'; X.drawImage(GRAIN, 0, 0); X.globalCompositeOperation = 'source-over';
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
