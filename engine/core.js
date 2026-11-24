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

// Feature toggles (default on). Overridable via setFx(), SCENE.fx, Studio UI, URL (?m2=0&m3=0), or render.mjs (--no-m2 / --no-m3).
//   m2: tapered brush strokes, motion trails, smears and spring overshoot
//   m3: unified directional lighting, cel-shading, cast floor shadows and reflections
const FX = { m2: true, m3: true };
function setFx(o = {}) { if (o.m2 != null) FX.m2 = !!o.m2; if (o.m3 != null) FX.m3 = !!o.m3; return { ...FX }; }
function fxEnabled(key) {
  if (typeof SCENE !== 'undefined' && SCENE?.fx && SCENE.fx[key] != null) return !!SCENE.fx[key];
  return FX[key] !== false;
}

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
// Damped spring transition 0 → 1 starting at t0 (overshoots when damp < 1; falls back to smooth ease when M2 is off).
function spring(t, t0, { freq = 2.6, damp = .45 } = {}) {
  const dt = t - t0;
  if (dt <= 0) return 0;
  if (!fxEnabled('m2')) return ease(clamp(dt / .35));
  const w = freq * TAU, z = clamp(damp, .05, .99), wd = w * Math.sqrt(1 - z * z);
  return 1 - Math.exp(-z * w * dt) * (Math.cos(wd * dt) + (z * w / wd) * Math.sin(wd * dt));
}
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
const _HEX_CACHE = new Map();
function _parseHex(hex) {
  let p = _HEX_CACHE.get(hex);
  if (p === undefined) {
    let s = hex.charCodeAt(0) === 35 ? hex.slice(1) : hex;
    if (s.length === 3) s = s[0] + s[0] + s[1] + s[1] + s[2] + s[2];
    p = parseInt(s, 16);
    _HEX_CACHE.set(hex, p);
  }
  return p;
}
function mixCol(a, b, k) {
  const pa = _parseHex(a), pb = _parseHex(b), kk = clamp(k);
  const r = Math.round(lerp((pa >> 16) & 255, (pb >> 16) & 255, kk));
  const g = Math.round(lerp((pa >> 8) & 255, (pb >> 8) & 255, kk));
  const bl = Math.round(lerp(pa & 255, pb & 255, kk));
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + bl).toString(16).slice(1);
}
const rgba = (hex, a) => { const p = _parseHex(hex); return `rgba(${p >> 16 & 255},${p >> 8 & 255},${p & 255},${a})`; };

// ---------- beat (no soundtrack yet: scenes pick a tempo so hits land on a grid; swap in the song's BPM later) ----------
let BPM = 100, BEAT_OFF = 0;
const beatPos = t => (t - BEAT_OFF) * BPM / 60;
const pulse = (t, k = 6) => Math.exp(-frac(beatPos(t)) * k);      // 1 on each beat, decays after

// ---------- seeded jitter ("boil") ----------
function mulberry(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
let _rnd = mulberry(1);
function _seedHash(s) {
  if (typeof s === 'number') return Math.imul(s | 0, 2654435761) | 0;
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h | 0;
}
function boilSeed(t) { _rnd = mulberry(1000 + Math.floor(t * BOIL + 1e-6)); }
const jit = a => (_rnd() * 2 - 1) * a;
let JIT = 0;                                                      // current boil amplitude in SCREEN px (0 = rock steady)
// Optional `seed` isolates this block's boil stream so objects appearing earlier cannot shift its jitter.
function withBoil(px, fn, seed) {
  const o = JIT, scoped = seed != null, r = scoped ? _rnd : null;
  JIT = px;
  if (scoped) _rnd = mulberry((1000 + Math.floor(T * BOIL + 1e-6)) ^ _seedHash(seed));
  try { return fn(); } finally { JIT = o; if (scoped) _rnd = r; }
}
// Zero-allocation affine transform tracker attached once per CanvasRenderingContext2D.
// Mirrors [a, b, c, d, e, f] + cached pxScale across save/restore/translate/scale/rotate/transform/setTransform/resetTransform
// so pxScale() and toPx() never allocate DOMMatrix objects via X.getTransform().
const _MTRACK = Symbol('mtrack');
function _trackCtx(ctx) {
  if (!ctx || ctx[_MTRACK] || typeof ctx.getSvg === 'function' || typeof ctx.save !== 'function') return ctx;
  const st = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0, sc: 1, stack: new Float64Array(7 * 64), sp: 0 };
  ctx[_MTRACK] = st;
  const _save = ctx.save.bind(ctx);
  const _restore = ctx.restore.bind(ctx);
  const _translate = ctx.translate.bind(ctx);
  const _scale = ctx.scale.bind(ctx);
  const _rotate = ctx.rotate.bind(ctx);
  const _transform = ctx.transform.bind(ctx);
  const _setTransform = ctx.setTransform.bind(ctx);
  const _resetTransform = typeof ctx.resetTransform === 'function' ? ctx.resetTransform.bind(ctx) : null;
  ctx.save = function () {
    if (st.sp + 7 > st.stack.length) {
      const next = new Float64Array(st.stack.length * 2);
      next.set(st.stack);
      st.stack = next;
    }
    const s = st.stack; let i = st.sp;
    s[i++] = st.a; s[i++] = st.b; s[i++] = st.c; s[i++] = st.d; s[i++] = st.e; s[i++] = st.f; s[i++] = st.sc;
    st.sp = i;
    return _save();
  };
  ctx.restore = function () {
    if (st.sp >= 7) {
      const s = st.stack; let i = st.sp;
      st.sc = s[--i]; st.f = s[--i]; st.e = s[--i]; st.d = s[--i]; st.c = s[--i]; st.b = s[--i]; st.a = s[--i];
      st.sp = i;
    }
    return _restore();
  };
  ctx.translate = function (x, y) {
    if (Number.isFinite(x) && Number.isFinite(y)) {
      st.e += st.a * x + st.c * y;
      st.f += st.b * x + st.d * y;
    }
    return _translate(x, y);
  };
  ctx.scale = function (x, y) {
    if (Number.isFinite(x) && Number.isFinite(y)) {
      st.a *= x; st.b *= x; st.c *= y; st.d *= y; st.sc = -1;
    }
    return _scale(x, y);
  };
  ctx.rotate = function (r) {
    if (Number.isFinite(r)) {
      const cs = Math.cos(r), sn = Math.sin(r);
      const na = st.a * cs + st.c * sn, nb = st.b * cs + st.d * sn;
      st.c = st.c * cs - st.a * sn; st.d = st.d * cs - st.b * sn;
      st.a = na; st.b = nb; st.sc = -1;
    }
    return _rotate(r);
  };
  ctx.transform = function (a, b, c, d, e, f) {
    if (Number.isFinite(a) && Number.isFinite(b) && Number.isFinite(c) && Number.isFinite(d) && Number.isFinite(e) && Number.isFinite(f)) {
      const na = st.a * a + st.c * b, nb = st.b * a + st.d * b;
      const nc = st.a * c + st.c * d, nd = st.b * c + st.d * d;
      st.e += st.a * e + st.c * f; st.f += st.b * e + st.d * f;
      st.a = na; st.b = nb; st.c = nc; st.d = nd; st.sc = -1;
    }
    return _transform(a, b, c, d, e, f);
  };
  ctx.setTransform = function (a, b, c, d, e, f) {
    if (typeof a === 'object' && a !== null) {
      st.a = a.a ?? 1; st.b = a.b ?? 0; st.c = a.c ?? 0; st.d = a.d ?? 1; st.e = a.e ?? 0; st.f = a.f ?? 0;
      st.sc = -1;
      return _setTransform(a);
    }
    if (arguments.length === 0) {
      st.a = 1; st.b = 0; st.c = 0; st.d = 1; st.e = 0; st.f = 0; st.sc = 1;
      return _setTransform();
    }
    if (Number.isFinite(a) && Number.isFinite(b) && Number.isFinite(c) && Number.isFinite(d) && Number.isFinite(e) && Number.isFinite(f)) {
      st.a = a; st.b = b; st.c = c; st.d = d; st.e = e; st.f = f; st.sc = -1;
    }
    return _setTransform(a, b, c, d, e, f);
  };
  if (_resetTransform) {
    ctx.resetTransform = function () {
      st.a = 1; st.b = 0; st.c = 0; st.d = 1; st.e = 0; st.f = 0; st.sc = 1;
      return _resetTransform();
    };
  }
  if (typeof ctx.getTransform === 'function') {
    const m = ctx.getTransform();
    st.a = m.a; st.b = m.b; st.c = m.c; st.d = m.d; st.e = m.e; st.f = m.f; st.sc = -1;
  }
  return ctx;
}
function pxScale() {
  const st = X && X[_MTRACK];
  if (st) {
    if (st.sc < 0) st.sc = Math.hypot(st.a, st.b) || 1;
    return st.sc;
  }
  const m = X.getTransform(); return Math.hypot(m.a, m.b) || 1;
}

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
    const sc = (o.lwPx != null || o.lw == null) ? pxScale() : 1;
    X.lineWidth = o.lwPx != null ? o.lwPx / sc : (o.lw ?? 2.2 / sc);
    if (o.dash) X.setLineDash(o.lwPx != null ? o.dash.map(d => d / sc) : o.dash);
    X.stroke();
    if (o.dash) X.setLineDash([]);
  }
  if (a != null) X.restore();
}
function shape(pts, o = {}) { if (!pts || pts.length < 2) return; tracePath(pts, o.closed !== false, o.smooth ?? false); paintPath(o); }
function line(pts, o = {}) { if (!pts || pts.length < 2) return; tracePath(pts, false, o.smooth ?? false); paintPath({ ...o, fill: null, stroke: o.stroke ?? o.col ?? PAL.ink }); }
// Sample a Catmull-Rom curve into a polyline (for variable-width strokes and motion smears).
function sampleCurve(pts, smooth = true, segs = 7) {
  const n = pts.length;
  if (!smooth || n < 3) return pts;
  const k = smooth === true ? 1 : smooth, P = i => pts[clamp(i, 0, n - 1)], out = [pts[0]];
  for (let i = 0; i < n - 1; i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
    const c1x = p1[0] + (p2[0] - p0[0]) / 6 * k, c1y = p1[1] + (p2[1] - p0[1]) / 6 * k;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6 * k, c2y = p2[1] - (p3[1] - p1[1]) / 6 * k;
    for (let s = 1; s <= segs; s++) {
      const u = s / segs, v = 1 - u;
      out.push([
        v * v * v * p1[0] + 3 * v * v * u * c1x + 3 * v * u * u * c2x + u * u * u * p2[0],
        v * v * v * p1[1] + 3 * v * v * u * c1y + 3 * v * u * u * c2y + u * u * u * p2[1],
      ]);
    }
  }
  return out;
}
// Variable-width tapered brush stroke (emits a pure vector polygon; SVG-export safe).
// Falls back to a uniform stroke via line() when M2 is disabled.
// o: { w0, w1, wMid, lwPx, profile, fill, col, stroke, lw, outlinePx, smooth, segs, alpha }
function taperStroke(pts, o = {}) {
  if (!pts || pts.length < 2) return;
  if (!fxEnabled('m2')) {
    return line(pts, {
      stroke: o.fill ?? o.col ?? PAL.ink,
      lwPx: o.lwPx,
      lw: o.lwPx != null ? undefined : ((o.wMid ?? Math.max(o.w0 ?? 0, o.w1 ?? 0)) || 2.5),
      smooth: o.smooth, alpha: o.alpha,
    });
  }
  const sc = pxScale();
  if (JIT) { const a = JIT / sc; pts = pts.map(p => [p[0] + jit(a), p[1] + jit(a)]); }
  const raw = o.smooth ? sampleCurve(pts, o.smooth, o.segs ?? 7) : pts;
  const ps = [raw[0]];
  for (let i = 1; i < raw.length; i++) {
    if (Math.hypot(raw[i][0] - ps[ps.length - 1][0], raw[i][1] - ps[ps.length - 1][1]) > 1e-4) ps.push(raw[i]);
  }
  if (ps.length < 2) return;
  const lens = [0];
  for (let i = 1; i < ps.length; i++) lens.push(lens[i - 1] + Math.hypot(ps[i][0] - ps[i - 1][0], ps[i][1] - ps[i - 1][1]));
  const total = lens[lens.length - 1] || 1, unit = o.lwPx != null ? 1 / sc : 1;
  const w0 = (o.w0 ?? (o.lwPx != null ? o.lwPx * .2 : .12)) * unit;
  const w1 = (o.w1 ?? (o.lwPx != null ? o.lwPx * .2 : .12)) * unit;
  const wMid = o.wMid != null ? o.wMid * unit : (o.lwPx != null ? o.lwPx * unit : Math.max(w0, w1));
  const widthAt = o.profile
    ? u => Math.max(0, o.profile(u) * unit)
    : u => (o.wMid != null || (o.w0 == null && o.w1 == null))
      ? (u < .5 ? lerp(w0, wMid, ease(u * 2)) : lerp(wMid, w1, ease((u - .5) * 2)))
      : lerp(w0, w1, u);
  const L = [], R = [];
  for (let i = 0; i < ps.length; i++) {
    const a = ps[Math.max(0, i - 1)], b = ps[Math.min(ps.length - 1, i + 1)];
    let tx = b[0] - a[0], ty = b[1] - a[1], d = Math.hypot(tx, ty) || 1;
    tx /= d; ty /= d;
    const nx = -ty, ny = tx, r = widthAt(lens[i] / total) * .5;
    L.push([ps[i][0] + nx * r, ps[i][1] + ny * r]);
    R.push([ps[i][0] - nx * r, ps[i][1] - ny * r]);
  }
  withBoil(0, () => shape([...L, ...R.reverse()], {
    fill: o.fill ?? o.col ?? PAL.ink, stroke: o.stroke ?? null,
    lw: o.lw, lwPx: o.outlinePx, alpha: o.alpha, closed: true, smooth: false,
  }));
}
// Motion trail: replays fn(t - i*dt, frac) at previous sub-frame times with decaying alpha, then paints fn(t, 0).
function trail(t, fn, o = {}) {
  if (!fxEnabled('m2')) return o.drawCurrent === false ? undefined : fn(t, 0);
  const steps = o.steps ?? 4, dt = o.dt ?? .022, maxA = o.alpha ?? .32, fade = o.fade ?? 1.4;
  const savedT = T;
  for (let i = steps; i >= 1; i--) {
    const f = 1 - (i - 1) / steps, a = maxA * Math.pow(f, fade);
    if (a <= .01) continue;
    const ov = OVERLAYS.length;
    T = t - i * dt;
    X.save(); X.globalAlpha *= a;
    try { fn(T, i / steps); } finally { X.restore(); OVERLAYS.length = ov; T = savedT; }
  }
  return o.drawCurrent === false ? undefined : fn(t, 0);
}
// Swept motion-blur smear connecting two polylines (current and previous positions).
function smear(ptsNow, ptsPrev, o = {}) {
  if (!fxEnabled('m2') || !ptsNow?.length || !ptsPrev?.length) return;
  shape([...ptsNow, ...[...ptsPrev].reverse()], { fill: o.fill ?? 'rgba(255,255,255,.35)', stroke: o.stroke ?? null, smooth: o.smooth ?? .35, alpha: o.alpha });
}
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
function toPx(x, y) {
  const st = X && X[_MTRACK];
  if (st) return [st.a * x + st.c * y + st.e, st.b * x + st.d * y + st.f];
  const m = X.getTransform(); return [m.a * x + m.c * y + m.e, m.b * x + m.d * y + m.f];
}

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

// ---------- layers (depth of field, bloom, lighting, cast shadows, colour grading) ----------
// Paint fn() into an offscreen layer, then composite it with a CSS filter, blend mode, or downscaled blur.
// o: { blur, filter, composite, alpha, scale (auto ramps from 1 to 0.5 over blur 0.5–1.5) }
const _blurScale = blur => 1 - .5 * ease(blur - .5);
const _layers = [];
let _layerDepth = 0;
let _probe = null;
const _isVectorCtx = () => !X || typeof X.getSvg === 'function' || X === _probe;
function _getLayer(depth, w = W, h = H) {
  let cv = _layers[depth];
  if (!cv) cv = _layers[depth] = Object.assign(document.createElement('canvas'), { width: w, height: h });
  else if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; if (cv._ctx?.[_MTRACK]) cv._ctx[_MTRACK].sp = 0; }
  if (!cv._ctx) cv._ctx = _trackCtx(cv.getContext('2d'));
  return cv;
}
function layer(fn, o = {}) {
  const blur = o.blur || 0, comp = o.composite || 'source-over', alpha = o.alpha ?? 1;
  const scale = o.scale ?? _blurScale(blur);
  const f = [blur > .05 ? `blur(${(blur * scale).toFixed(2)}px)` : '', o.filter || ''].join(' ').trim();
  const needBuf = !!(f || comp !== 'source-over' || alpha < .999 || scale !== 1);
  if (!needBuf || _isVectorCtx()) return fn();
  const lw = Math.max(1, Math.round(W * scale)), lh = Math.max(1, Math.round(H * scale));
  const cv = _getLayer(_layerDepth, lw, lh), c = cv._ctx, outer = X;
  c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, lw, lh);
  const m = outer[_MTRACK] || outer.getTransform();
  c.setTransform(m.a * scale, m.b * scale, m.c * scale, m.d * scale, m.e * scale, m.f * scale);
  X = c; _layerDepth++;
  let res;
  try { res = fn(); } finally { _layerDepth--; X = outer; }
  let source = cv;
  if (f) {
    const filtered = _getLayer(_layerDepth + 1, lw, lh), fc = filtered._ctx;
    fc.save(); fc.setTransform(1, 0, 0, 1, 0, 0); fc.clearRect(0, 0, lw, lh);
    fc.filter = f; fc.drawImage(cv, 0, 0); fc.restore();
    source = filtered;
  }
  X.save(); X.setTransform(1, 0, 0, 1, 0, 0);
  if (f) X.filter = 'none';
  X.globalCompositeOperation = comp;
  X.globalAlpha *= alpha;
  X.drawImage(source, 0, 0, lw, lh, 0, 0, W, H);
  X.restore();
  return res;
}
// Cached offscreen layer for static backgrounds (LRU of 4 canvases, auto-cleared on scene switch, bypassed on SVG/probe).
// Bakes CSS blur/filter once on cache miss so cache hits are a single drawImage() with zero redraw or blur cost.
const _STATIC_LAYERS = new Map(), _STATIC_MAX = 4;
function clearStaticLayers() { for (const v of _STATIC_LAYERS.values()) { v.cv.width = 0; v.cv.height = 0; } _STATIC_LAYERS.clear(); }
function staticLayer(key, fn, o = {}) {
  if (key == null || _isVectorCtx()) return layer(fn, o);
  const blur = o.blur || 0, comp = o.composite || 'source-over', alpha = o.alpha ?? 1;
  const scale = o.scale ?? _blurScale(blur);
  const f = [blur > .05 ? `blur(${(blur * scale).toFixed(2)}px)` : '', o.filter || ''].join(' ').trim();
  const sid = typeof SCENE !== 'undefined' && SCENE ? SCENE.id : '';
  const matrix = X[_MTRACK] || X.getTransform();
  const k = JSON.stringify([sid, fxEnabled('m2'), fxEnabled('m3'), scale, f,
    matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f, key]);
  let entry = _STATIC_LAYERS.get(k);
  if (entry) {
    _STATIC_LAYERS.delete(k); _STATIC_LAYERS.set(k, entry);
  } else {
    let cv;
    if (_STATIC_LAYERS.size >= _STATIC_MAX) {
      const oldestKey = _STATIC_LAYERS.keys().next().value;
      cv = _STATIC_LAYERS.get(oldestKey).cv;
      _STATIC_LAYERS.delete(oldestKey);
    } else {
      cv = document.createElement('canvas');
    }
    const lw = Math.max(1, Math.round(W * scale)), lh = Math.max(1, Math.round(H * scale));
    if (cv.width !== lw || cv.height !== lh) { cv.width = lw; cv.height = lh; if (cv._ctx?.[_MTRACK]) cv._ctx[_MTRACK].sp = 0; }
    const c = cv._ctx ??= _trackCtx(cv.getContext('2d'));
    const outer = X, m = outer[_MTRACK] || outer.getTransform();
    if (f) {
      const scv = _getLayer(_layerDepth, lw, lh), sc = scv._ctx;
      sc.setTransform(1, 0, 0, 1, 0, 0); sc.clearRect(0, 0, lw, lh);
      sc.setTransform(m.a * scale, m.b * scale, m.c * scale, m.d * scale, m.e * scale, m.f * scale);
      X = sc; _layerDepth++;
      try { fn(); } finally { _layerDepth--; X = outer; }
      c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, lw, lh);
      c.filter = f; c.drawImage(scv, 0, 0); c.restore();
    } else {
      c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, lw, lh);
      c.setTransform(m.a * scale, m.b * scale, m.c * scale, m.d * scale, m.e * scale, m.f * scale);
      X = c; _layerDepth++;
      try { fn(); } finally { _layerDepth--; X = outer; }
    }
    entry = { cv, lw, lh };
    _STATIC_LAYERS.set(k, entry);
  }
  X.save(); X.setTransform(1, 0, 0, 1, 0, 0);
  X.globalCompositeOperation = comp;
  X.globalAlpha *= alpha;
  X.drawImage(entry.cv, 0, 0, entry.lw, entry.lh, 0, 0, W, H);
  X.restore();
}
// Downscaled bloom pass: paints fn() once, blits it sharp (unless glowOnly), then overlays a 1/4-res blurred glow.
function bloom(fn, o = {}) {
  if (_isVectorCtx()) return fn();
  const scale = o.scale ?? .25, rad = o.radius ?? 18, strength = o.strength ?? .55, comp = o.composite || 'screen';
  const d0 = _layerDepth, cv1 = _getLayer(d0, W, H), c1 = cv1._ctx, outer = X;
  const m = outer[_MTRACK] || outer.getTransform();
  c1.setTransform(1, 0, 0, 1, 0, 0); c1.clearRect(0, 0, W, H); c1.setTransform(m.a, m.b, m.c, m.d, m.e, m.f);
  X = c1; _layerDepth = d0 + 1;
  let res;
  try { res = fn(); } finally { _layerDepth = d0; X = outer; }
  if (!o.glowOnly) { X.save(); X.setTransform(1, 0, 0, 1, 0, 0); X.drawImage(cv1, 0, 0); X.restore(); }
  const lw = Math.max(1, Math.round(W * scale)), lh = Math.max(1, Math.round(H * scale));
  const cv2 = _getLayer(d0 + 1, lw, lh), c2 = cv2._ctx;
  c2.setTransform(1, 0, 0, 1, 0, 0); c2.clearRect(0, 0, lw, lh); c2.drawImage(cv1, 0, 0, W, H, 0, 0, lw, lh);
  X.save(); X.setTransform(1, 0, 0, 1, 0, 0);
  X.filter = `blur(${(rad * scale).toFixed(2)}px)`;
  X.globalCompositeOperation = comp;
  X.globalAlpha *= strength;
  X.drawImage(cv2, 0, 0, lw, lh, 0, 0, W, H);
  X.restore();
  return res;
}

// ---------- unified lighting, cel shading & projected cast shadows ----------
let LIGHT = null;
function withLight(cfg, fn) { const prev = LIGHT; LIGHT = cfg; try { return fn(); } finally { LIGHT = prev; } }
function _applyLight(cvA, cA, d0, cfg) {
  const dir = cfg.dir || [-.7, -.7], dl = Math.hypot(dir[0], dir[1]) || 1, lx = dir[0] / dl, ly = dir[1] / dl;
  if (cfg.tint) {
    cA.save(); cA.setTransform(1, 0, 0, 1, 0, 0);
    cA.globalCompositeOperation = 'source-atop'; cA.globalAlpha = cfg.tintAlpha ?? 1;
    cA.fillStyle = cfg.tint; cA.fillRect(0, 0, W, H); cA.restore();
  }
  const edgePass = (dx, dy, col, comp, blurPx = 0) => {
    const cvB = _getLayer(d0 + 1, W, H), cB = cvB._ctx;
    cB.save(); cB.setTransform(1, 0, 0, 1, 0, 0); cB.clearRect(0, 0, W, H);
    cB.drawImage(cvA, 0, 0);
    cB.globalCompositeOperation = 'destination-out'; cB.drawImage(cvA, dx, dy);
    cB.globalCompositeOperation = 'source-in'; cB.fillStyle = col; cB.fillRect(0, 0, W, H);
    cB.restore();
    cA.save(); cA.setTransform(1, 0, 0, 1, 0, 0); cA.globalCompositeOperation = comp;
    if (blurPx > .05) cA.filter = `blur(${blurPx.toFixed(1)}px)`;
    cA.drawImage(cvB, 0, 0); cA.restore();
  };
  if (cfg.shade) edgePass(lx * (cfg.shadePx ?? 14), ly * (cfg.shadePx ?? 14), cfg.shade, 'source-atop', cfg.shadeBlur ?? 0);
  if (cfg.rim) edgePass(-lx * (cfg.rimPx ?? 5), -ly * (cfg.rimPx ?? 5), cfg.rim, cfg.rimComp || 'source-atop', cfg.rimBlur ?? 0);
}
// Paint fn() with directional rim highlight, cel shadow, and environmental tint; returns fn()'s anchors unchanged.
function lit(fn, o) {
  const cfg = o ? (LIGHT ? { ...LIGHT, ...o } : o) : LIGHT;
  if (!cfg || !fxEnabled('m3') || _isVectorCtx()) return fn();
  const d0 = _layerDepth, cvA = _getLayer(d0, W, H), cA = cvA._ctx, outer = X;
  const m = outer[_MTRACK] || outer.getTransform();
  cA.setTransform(1, 0, 0, 1, 0, 0); cA.clearRect(0, 0, W, H); cA.setTransform(m.a, m.b, m.c, m.d, m.e, m.f);
  X = cA; _layerDepth = d0 + 1;
  let res;
  try { res = fn(); } finally { _layerDepth = d0; X = outer; }
  _applyLight(cvA, cA, d0, cfg);
  X.save(); X.setTransform(1, 0, 0, 1, 0, 0); X.drawImage(cvA, 0, 0); X.restore();
  return res;
}
// Paint a projected ground shadow (and optional glossy floor/ice reflection) anchored at (footX, footY),
// then draw the subject (optionally lit by the active LIGHT) on top. Runs fn() only once and returns its anchors.
function castShadow(fn, footX, footY, o = {}) {
  if (!fxEnabled('m3') || _isVectorCtx()) return o.drawSubject === false ? undefined : fn();
  const cfg = o.light === false ? null : (o.light ? (LIGHT ? { ...LIGHT, ...o.light } : o.light) : LIGHT);
  const d0 = _layerDepth, cvA = _getLayer(d0, W, H), cA = cvA._ctx, outer = X;
  const m = outer[_MTRACK] || outer.getTransform();
  cA.setTransform(1, 0, 0, 1, 0, 0); cA.clearRect(0, 0, W, H); cA.setTransform(m.a, m.b, m.c, m.d, m.e, m.f);
  X = cA; _layerDepth = d0 + 1;
  let res;
  try { res = fn(); } finally { _layerDepth = d0; X = outer; }
  const sx = m.a * footX + m.c * footY + m.e, sy = m.b * footX + m.d * footY + m.f;
  if (o.reflect > .01) {
    X.save(); X.setTransform(1, 0, 0, 1, 0, 0);
    X.translate(sx, sy + (o.reflectDy ?? 0)); X.scale(1, -(o.reflectScale ?? .4)); X.translate(-sx, -sy);
    X.globalAlpha *= o.reflect;
    if (o.reflectBlur > .05) X.filter = `blur(${o.reflectBlur.toFixed(1)}px)`;
    X.drawImage(cvA, 0, 0);
    X.restore();
  }
  const blurPx = o.blur ?? 2, shScale = blurPx > .05 ? .5 : 1;
  const sw = Math.max(1, Math.round(W * shScale)), sh = Math.max(1, Math.round(H * shScale));
  const cvB = _getLayer(d0 + 1, sw, sh), cB = cvB._ctx;
  cB.save(); cB.setTransform(1, 0, 0, 1, 0, 0); cB.clearRect(0, 0, sw, sh);
  cB.drawImage(cvA, 0, 0, W, H, 0, 0, sw, sh);
  cB.globalCompositeOperation = 'source-in';
  cB.fillStyle = o.color ?? cfg?.shadowColor ?? 'rgba(38,20,34,.22)';
  cB.fillRect(0, 0, sw, sh);
  cB.restore();
  // Bake the blur at silhouette resolution before projecting/upscaling it. A filter on X
  // would still allocate a full-resolution filtered surface despite the smaller cvB.
  let shadow = cvB;
  if (blurPx > .05) {
    const cvC = _getLayer(d0 + 2, sw, sh), cC = cvC._ctx;
    cC.save(); cC.setTransform(1, 0, 0, 1, 0, 0); cC.clearRect(0, 0, sw, sh);
    cC.filter = `blur(${(blurPx * shScale).toFixed(2)}px)`; cC.drawImage(cvB, 0, 0); cC.restore();
    shadow = cvC;
  }
  const dir = cfg?.dir || [-.7, -.7];
  const skew = o.skew ?? cfg?.shadowSkew ?? clamp(dir[0] * .65, -1.2, 1.2);
  const scaleY = o.scaleY ?? cfg?.shadowScaleY ?? .26;
  X.save(); X.setTransform(1, 0, 0, 1, 0, 0);
  X.translate(sx, sy + (o.dy ?? 2));
  X.transform(1, 0, skew, scaleY, 0, 0);
  X.translate(-sx, -sy);
  X.drawImage(shadow, 0, 0, sw, sh, 0, 0, W, H);
  X.restore();
  if (o.drawSubject !== false) {
    if (cfg && (cfg.tint || cfg.rim || cfg.shade)) _applyLight(cvA, cA, d0, cfg);
    X.save(); X.setTransform(1, 0, 0, 1, 0, 0); X.drawImage(cvA, 0, 0); X.restore();
  }
  return res;
}

// ---------- shot/scene colour grade (applied before grain & overlays, skipped on transparent exports) ----------
let GRADE = null;
function grade(o) { GRADE = o ? { ...(GRADE || {}), ...o } : null; }
function applyGrade() {
  const g = GRADE; GRADE = null;
  if (!g || _isVectorCtx()) return;
  X.save(); X.setTransform(1, 0, 0, 1, 0, 0);
  if (g.warmth) {
    X.globalCompositeOperation = 'soft-light';
    X.globalAlpha = clamp(Math.abs(g.warmth), 0, 1) * .45;
    X.fillStyle = g.warmth > 0 ? '#FFBF73' : '#7AB8FF';
    X.fillRect(0, 0, W, H);
  }
  if (g.tint) {
    X.globalCompositeOperation = g.mode || 'soft-light';
    X.globalAlpha = g.alpha ?? .22;
    X.fillStyle = g.tint;
    X.fillRect(0, 0, W, H);
  }
  if (g.topGrad) {
    X.globalCompositeOperation = g.topMode || 'source-over';
    X.globalAlpha = g.topAlpha ?? 1;
    X.fillStyle = linGrad(0, 0, 0, H, g.topGrad);
    X.fillRect(0, 0, W, H);
  }
  X.restore();
}

// Run a draw call off-screen and return its result: use it to get a character's anchors (mouth, head…) before
// deciding its final pose, without painting it twice. measure(() => pearl(x, y, s, o)).mouth
function measure(fn) {
  _probe ??= _trackCtx(Object.assign(document.createElement('canvas'), { width: 1, height: 1 }).getContext('2d'));
  const outer = X, ov = OVERLAYS.length, rs = _rnd, m = outer[_MTRACK] || outer.getTransform();
  _probe.setTransform(m.a, m.b, m.c, m.d, m.e, m.f); X = _probe;
  try { return fn(); } finally { X = outer; OVERLAYS.length = ov; _rnd = rs; }
}
