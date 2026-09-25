// engine/core.js: the frame, math + timing helpers, seeded "boil" jitter, drawing primitives, 2D camera and screen FX.
//
// Every frame is a PURE FUNCTION OF t. Frames render in parallel and out of order, so: no state that carries between
// frames and no Math.random(). Use hash(i) for stable per-object randomness and jit(a) for hand-drawn wobble.

const W = 1920, H = 1080, TAU = Math.PI * 2;
const BOIL = 12;                 // outlines re-jitter 12x per second, like hand-drawn animation
let X = null;                    // CanvasRenderingContext2D of the frame being painted (set by the studio)
let T = 0;                       // time of the frame being painted

const PAL = {
  ink: '#3B2530', inkSoft: '#5A3B47', cream: '#FFF8EC', white: '#FFFDF8',
  crimson: '#A3294B', plum: '#6E2A5A', gold: '#E2A93B', goldDk: '#A97B22', goldLt: '#F7D57A',
  blue: '#4166B8', green: '#4DA650', orange: '#EE8A2C', sky: '#A9D8E8', rose: '#E27A92', pink: '#F2B8C6',
};

// ---------- math ----------
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, x) => a + (b - a) * x;
const frac = x => x - Math.floor(x);
const seg = (t, a, b) => clamp((t - a) / (b - a));              // 0..1 progress of t through [a, b]
const ease = x => { x = clamp(x); return x * x * (3 - 2 * x); };
const easeOut = x => 1 - Math.pow(1 - clamp(x), 3);
const easeIn = x => Math.pow(clamp(x), 3);
const backOut = x => { x = clamp(x); const s = 1.9; return 1 + (s + 1) * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2); };
const elasticOut = x => { x = clamp(x); return x === 0 || x === 1 ? x : Math.pow(2, -10 * x) * Math.sin((x * 10 - .75) * (TAU / 3)) + 1; };
const wob = (t, f = 1, ph = 0) => Math.sin((t * f + ph) * TAU);
const hash = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const mixPt = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];
// damped "boing" after an impulse at t0: 0 before, 1 at t0, oscillates and dies away
const boing = (t, t0, freq = 3, decay = 5) => t < t0 ? 0 : Math.exp(-(t - t0) * decay) * Math.cos((t - t0) * freq * TAU);
const kick = (t, t0, decay = 6) => t < t0 ? 0 : Math.exp(-(t - t0) * decay);   // 1 at t0, decays
// keyframes: kf(t, [[t0, v0], [t1, v1], ...], easeFn). Values may be numbers or arrays of numbers.
function kf(t, keys, e = ease) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    if (t < keys[i][0]) {
      const [a, va] = keys[i - 1], [b, vb] = keys[i], k = e((t - a) / (b - a));
      return Array.isArray(va) ? va.map((v, j) => lerp(v, vb[j], k)) : lerp(va, vb, k);
    }
  }
  return keys[keys.length - 1][1];
}
function mixCol(a, b, k) {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16), c = i => Math.round(lerp((pa >> i) & 255, (pb >> i) & 255, clamp(k)));
  return '#' + ((1 << 24) + (c(16) << 16) + (c(8) << 8) + c(0)).toString(16).slice(1);
}
const rgba = (hex, a) => { const p = parseInt(hex.slice(1), 16); return `rgba(${p >> 16 & 255},${p >> 8 & 255},${p & 255},${a})`; };

// ---------- beat (no soundtrack yet: scenes pick a tempo so hits land on a grid; swap in the song's BPM later) ----------
let BPM = 100, BEAT_OFF = 0;
const beatPos = t => (t - BEAT_OFF) * BPM / 60;
const pulse = (t, k = 6) => Math.exp(-frac(beatPos(t)) * k);      // 1 on each beat, decays after

// ---------- seeded jitter ("boil") ----------
function mulberry(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
let _rnd = mulberry(1);
function boilSeed(t) { _rnd = mulberry(1000 + Math.floor(t * BOIL + 1e-6)); }
const jit = a => (_rnd() * 2 - 1) * a;
let JIT = 0;                                                      // current boil amplitude in SCREEN px (0 = rock steady)
function withBoil(px, fn) { const o = JIT; JIT = px; try { return fn(); } finally { JIT = o; } }
function pxScale() { const m = X.getTransform(); return Math.hypot(m.a, m.b) || 1; }

// ---------- paths ----------
// smooth: false = straight segments, true (or 0..1 tension) = Catmull-Rom curve through the points.
function tracePath(pts, closed = true, smooth = false) {
  const n = pts.length; if (!n) return;
  if (JIT) { const a = JIT / pxScale(); pts = pts.map(p => [p[0] + jit(a), p[1] + jit(a)]); }
  X.beginPath();
  if (!smooth || n < 3) {
    X.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < n; i++) X.lineTo(pts[i][0], pts[i][1]);
    if (closed) X.closePath(); return;
  }
  const k = smooth === true ? 1 : smooth, P = i => closed ? pts[(i + n) % n] : pts[clamp(i, 0, n - 1)];
  X.moveTo(pts[0][0], pts[0][1]);
  for (let i = 0, last = closed ? n : n - 1; i < last; i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
    X.bezierCurveTo(p1[0] + (p2[0] - p0[0]) / 6 * k, p1[1] + (p2[1] - p0[1]) / 6 * k,
                    p2[0] - (p3[0] - p1[0]) / 6 * k, p2[1] - (p3[1] - p1[1]) / 6 * k, p2[0], p2[1]);
  }
  if (closed) X.closePath();
}
// Fill and/or stroke the current path. o: fill, stroke (default ink; null = none), lw (local units) or lwPx (screen px), alpha, dash.
function paintPath(o) {
  const a = o.alpha;
  if (a != null) { X.save(); X.globalAlpha *= a; }
  if (o.fill) { X.fillStyle = o.fill; X.fill(o.rule || 'nonzero'); }
  if (o.stroke !== null) {
    X.strokeStyle = o.stroke || PAL.ink; X.lineJoin = 'round'; X.lineCap = o.cap || 'round';
    X.lineWidth = o.lwPx != null ? o.lwPx / pxScale() : (o.lw ?? 2.2 / pxScale());
    if (o.dash) X.setLineDash(o.dash.map(d => d / (o.lwPx != null ? pxScale() : 1)));
    X.stroke();
    if (o.dash) X.setLineDash([]);
  }
  if (a != null) X.restore();
}
function shape(pts, o = {}) { if (!pts || pts.length < 2) return; tracePath(pts, o.closed !== false, o.smooth ?? false); paintPath(o); }
function line(pts, o = {}) { if (!pts || pts.length < 2) return; tracePath(pts, false, o.smooth ?? false); paintPath({ ...o, fill: null, stroke: o.stroke ?? o.col ?? PAL.ink }); }
function ellipse(cx, cy, rx, ry, o = {}) {
  if (rx <= 0 || ry <= 0) return;
  const j = JIT ? JIT / pxScale() : 0;
  X.beginPath(); X.ellipse(cx + jit(j * .5), cy + jit(j * .5), Math.max(.01, rx + jit(j * .5)), Math.max(.01, ry + jit(j * .5)), o.rot || 0, 0, TAU);
  paintPath(o);
}
const circle = (cx, cy, r, o) => ellipse(cx, cy, r, r, o);
const rectPts = (x, y, w, h) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
function ellPts(cx, cy, rx, ry, n = 24, rot = 0) { const p = []; for (let i = 0; i < n; i++) { const a = rot + i / n * TAU; p.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); } return p; }
function starPts(cx, cy, r, inner = .45, n = 5, rot = -Math.PI / 2) { const p = []; for (let i = 0; i < n * 2; i++) { const a = rot + i * Math.PI / n, q = i % 2 ? r * inner : r; p.push([cx + Math.cos(a) * q, cy + Math.sin(a) * q]); } return p; }
const linGrad = (x0, y0, x1, y1, stops) => { const g = X.createLinearGradient(x0, y0, x1, y1); stops.forEach(([o, c]) => g.addColorStop(o, c)); return g; };
const radGrad = (x, y, r0, r1, stops) => { const g = X.createRadialGradient(x, y, r0, x, y, r1); stops.forEach(([o, c]) => g.addColorStop(o, c)); return g; };

// Polyline helpers (for limbs and paths): point at fraction f of the length, and the sub-path between two fractions.
function polyLen(p) { let L = 0; for (let i = 1; i < p.length; i++) L += Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); return L; }
function polyAt(p, f) {
  let s = clamp(f) * polyLen(p);
  for (let i = 1; i < p.length; i++) {
    const d = Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]);
    if (s <= d || i === p.length - 1) { const k = d ? clamp(s / d) : 0; return [lerp(p[i - 1][0], p[i][0], k), lerp(p[i - 1][1], p[i][1], k)]; }
    s -= d;
  }
  return p[p.length - 1];
}
function polySlice(p, f0, f1) {
  const out = [polyAt(p, f0)], L = polyLen(p); let acc = 0;
  for (let i = 1; i < p.length; i++) { acc += Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); const f = acc / L; if (f > f0 && f < f1) out.push(p[i]); }
  out.push(polyAt(p, f1)); return out;
}
// Two-bone IK: from root s to target t with bone lengths a, b. Picks the bend whose joint lies further along `pref`.
function ik2(s, t, a, b, pref) {
  let dx = t[0] - s[0], dy = t[1] - s[1], d = Math.hypot(dx, dy) || 1e-6;
  const mx = (a + b) * .999, mn = Math.abs(a - b) + 1e-3;
  if (d > mx) { dx *= mx / d; dy *= mx / d; d = mx; } else if (d < mn) { dx *= mn / d; dy *= mn / d; d = mn; }
  const base = Math.atan2(dy, dx), ang = Math.acos(clamp((a * a + d * d - b * b) / (2 * a * d), -1, 1));
  const j1 = [s[0] + Math.cos(base + ang) * a, s[1] + Math.sin(base + ang) * a], j2 = [s[0] + Math.cos(base - ang) * a, s[1] + Math.sin(base - ang) * a];
  const sc = j => j[0] * pref[0] + j[1] * pref[1];
  return { joint: sc(j1) >= sc(j2) ? j1 : j2, end: [s[0] + dx, s[1] + dy] };
}
// Local point → screen px under the current transform (use it to hand anchors back to the scene).
function toPx(x, y) { const m = X.getTransform(); return [m.a * x + m.c * y + m.e, m.b * x + m.d * y + m.f]; }

// ---------- 2D camera (screen-level zoom / roll / shake on top of whatever the shot paints) ----------
let CAM = null;
function camBegin(cx = W / 2, cy = H / 2, zoom = 1, rot = 0) { X.save(); X.translate(W / 2, H / 2); X.rotate(rot); X.scale(zoom, zoom); X.translate(-cx, -cy); CAM = { cx, cy, zoom, rot }; }
function camEnd() { X.restore(); CAM = null; }
function toScreen(x, y) {
  if (!CAM) return [x, y];
  const c = Math.cos(CAM.rot), s = Math.sin(CAM.rot), dx = (x - CAM.cx) * CAM.zoom, dy = (y - CAM.cy) * CAM.zoom;
  return [W / 2 + dx * c - dy * s, H / 2 + dx * s + dy * c];
}
// deterministic shake, changes at 24 fps: returns [dx, dy]
const shakeXY = (t, amt) => { const f = Math.floor(t * 24); return [(hash(f * 1.7) - .5) * 2 * amt, (hash(f * 2.3 + 9) - .5) * 2 * amt]; };

// ---------- overlays: text and bubbles are queued and painted last, in screen space, above everything ----------
let OVERLAYS = [];
const overlay = fn => OVERLAYS.push(fn);
function flushOverlays() { const q = OVERLAYS; OVERLAYS = []; X.save(); X.setTransform(1, 0, 0, 1, 0, 0); q.forEach(fn => fn()); X.restore(); }

const FONT_SFX = '"Luckiest Guy", "Chalkboard SE", "Marker Felt", cursive';
const FONT_TALK = '"Fredoka", "Chalkboard SE", "Avenir Next Rounded", sans-serif';
// Comic sound effect: pops in at age 0, wobbles, fades out by `life` seconds. (x, y) in world coords of the active 2D camera.
function sfx(txt, x, y, size, col, age, o = {}) {
  const life = o.life ?? 1.1; if (age < 0 || age > life) return;
  [x, y] = toScreen(x, y);
  const k = backOut(age * 5) * (o.scale ?? 1), rot = (o.rot ?? -.08) + Math.sin(age * 22) * .04 * (1 - age / life), a = 1 - seg(age, life - .25, life);
  overlay(() => {
    X.save(); X.translate(x, y); X.rotate(rot); X.scale(k, k); X.globalAlpha = a;
    X.font = `${size}px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle';
    X.lineJoin = 'round'; X.lineWidth = size * .16; X.strokeStyle = PAL.ink; X.strokeText(txt, 0, 0);
    X.fillStyle = PAL.ink; X.fillText(txt, size * .05, size * .06);
    X.fillStyle = col; X.fillText(txt, 0, 0);
    X.restore();
  });
}

// ---------- full-frame effects (screen space) ----------
function flash(k, col = '#FFFDF6') { if (k > .01) overlay(() => { X.globalAlpha = clamp(k); X.fillStyle = col; X.fillRect(0, 0, W, H); X.globalAlpha = 1; }); }
// Everything OUTSIDE the circle goes to `col` (classic cartoon iris-out). Painted as an overlay above bubbles.
function iris(cx, cy, r, col = '#140C12') {
  overlay(() => {
    X.beginPath(); X.rect(-10, -10, W + 20, H + 20);
    if (r > 0) X.ellipse(cx, cy, r, r, 0, 0, TAU);
    X.fillStyle = col; X.fill('evenodd');
    if (r > 0) { X.lineWidth = 8; X.strokeStyle = PAL.ink; X.beginPath(); X.ellipse(cx, cy, r, r, 0, 0, TAU); X.stroke(); }
  });
}

// ---------- layers (depth of field, colour grading) ----------
// Paint fn() into an offscreen layer, then composite it with a CSS filter, e.g. layer(() => room(), { blur: 3 }) for a
// soft background that makes characters pop. filter: any extra CSS filter string ('saturate(.9) brightness(1.03)').
const _layers = [];
let _layerDepth = 0;
function layer(fn, o = {}) {
  const f = [o.blur > .05 ? `blur(${o.blur.toFixed(2)}px)` : '', o.filter || ''].join(' ').trim();
  if (!f) return fn();
  const cv = _layers[_layerDepth] ??= Object.assign(document.createElement('canvas'), { width: W, height: H });
  const c = cv.getContext('2d'), outer = X;
  c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, W, H); c.setTransform(outer.getTransform());
  X = c; _layerDepth++;
  try { fn(); } finally { _layerDepth--; X = outer; }
  X.save(); X.setTransform(1, 0, 0, 1, 0, 0); X.filter = f; X.drawImage(cv, 0, 0); X.restore();
}

// Run a draw call off-screen and return its result: use it to get a character's anchors (mouth, head…) before
// deciding its final pose, without painting it twice. measure(() => pearl(x, y, s, o)).mouth
let _probe = null;
function measure(fn) {
  _probe ??= Object.assign(document.createElement('canvas'), { width: 1, height: 1 }).getContext('2d');
  const outer = X, ov = OVERLAYS.length, rs = _rnd; _probe.setTransform(outer.getTransform()); X = _probe;
  try { return fn(); } finally { X = outer; OVERLAYS.length = ov; _rnd = rs; }
}
