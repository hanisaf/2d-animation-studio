// engine/callout.js: comic speech bubbles ("callouts") anchored to a speaker's mouth.
//
// callout(text, ax, ay, age, o) → { talking, visible }
//   text   the line. Wrap words in *asterisks* to paint them in the accent colour.
//   ax, ay the speaker's mouth in screen px (or world coords of an active 2D camera). The tail points there.
//   age    seconds since the line started (negative = not yet).
//   o      { dx, dy: bubble centre offset from the mouth (px, default up-right) · size: font px (56) · maxW: wrap width (720)
//            cps: typing speed in chars/s (18) · hold: seconds the full line stays up after typing (1.6) · dur: override total
//            kind: 'talk' | 'shout' | 'think' | 'whisper' (small, dashed, soft grey text) | 'robot' (boxy panel, rivets,
//            monospaced capitals) · accent: colour for *words* · fill: bubble colour }
// While `talking` is true the words are still appearing: flap the speaker's mouth (see lipFlap).

// Shared deterministic syllable timeline for cartoon voices and audio-driven lip sync.
const _SYL_CACHE = new Map();
function dialogueSyllables(line, voice = {}) {
  const text = line.text || '', plain = text.replace(/\*/g, ''), cps = line.cps ?? 18, style = voice.style || 'bouncy';
  const key = `${plain}|${line.at ?? 0}|${cps}|${style}`;
  let list = _SYL_CACHE.get(key);
  if (list) return list;
  const length = { measured: 1.08, sporty: .67, melodic: 1, bouncy: .85, regal: .76, rumble: 1.14 }[style] ?? .85;
  const wordPattern = /[A-Za-z]+(?:'[A-Za-z]+)?/g;
  list = [];
  let word;
  while ((word = wordPattern.exec(plain))) {
    const vowels = word[0].match(/[aeiouy]+/gi) || [];
    const count = Math.min(3, Math.max(1, vowels.length));
    const spacing = word[0].length / cps / count;
    for (let i = 0; i < count; i++) {
      const at = (line.at ?? 0) + .2 + (word.index + (i + .18) * word[0].length / count) / cps;
      const dur = Math.min(.28, Math.max(.07, spacing * length));
      list.push({ at, dur, vowel: (vowels[i]?.[0] || 'a').toLowerCase() });
    }
  }
  _SYL_CACHE.set(key, list);
  return list;
}

const _VISEME_PREF = {
  wide: ['O', 'open', 'grin', 'o'],
  round: ['o', 'O', 'open', 'grin'],
  spread: ['grin', 'teeth', 'open', 'smile', 'o'],
};
function _pickViseme(bucket, rest, shapes) {
  if (!bucket || bucket === 'rest') return rest;
  const pref = _VISEME_PREF[bucket] || _VISEME_PREF.wide;
  for (const s of pref) if (shapes.includes(s)) return s;
  return shapes[0] ?? rest;
}
function _visemeForLine(t, line, sceneId) {
  if (!line || line.kind === 'think' || line.silent) return null;
  const clip = sceneId && typeof voiceClipFor === 'function' ? voiceClipFor(sceneId, line) : null;
  if (clip?.env) {
    const age = t - ((line.at ?? 0) + .2), idx = Math.floor(age * (clip.envFps || 24));
    if (idx < 0 || idx >= clip.env.length) return 'rest';
    const ch = clip.env[idx];
    return ch === 'a' ? 'wide' : ch === 'o' ? 'round' : ch === 's' ? 'spread' : 'rest';
  }
  const voice = line.voice || (typeof ASSETS !== 'undefined' && line.speaker ? (ASSETS.character[line.speaker]?.voice || {}) : {});
  const syls = dialogueSyllables(line, voice);
  for (let i = 0; i < syls.length; i++) {
    const s = syls[i];
    if (t >= s.at && t <= s.at + s.dur) {
      if (s.vowel === 'o' || s.vowel === 'u') return 'round';
      if (s.vowel === 'e' || s.vowel === 'i' || s.vowel === 'y') return 'spread';
      return 'wide';
    }
  }
  return 'rest';
}

function callout(text, ax, ay, age, o = {}) {
  const cps = o.cps ?? 18, plain = text.replace(/\*/g, ''), typeDur = plain.length / cps;
  const dur = o.dur ?? (.25 + typeDur + (o.hold ?? 1.6));
  if (age < 0 || age > dur) return { talking: false, visible: false, viseme: 'rest', mouth: 'smile' };
  [ax, ay] = toScreen(ax, ay);
  const typed = (age - .2) * cps, talking = typed > 0 && typed < plain.length;
  const k = backOut(age / .28) * (1 - easeIn(seg(age, dur - .22, dur)));
  overlay(() => drawBubble(text, ax, ay, typed, k, o));
  const viseme = talking && o.kind !== 'think'
    ? _visemeForLine(T, { text, at: T - age, cps, speaker: o.speaker, kind: o.kind }, typeof SCENE !== 'undefined' ? SCENE?.id : null)
    : 'rest';
  const mouth = _pickViseme(viseme, 'smile', ['grin', 'open', 'o', 'grin', 'smile', 'open']);
  return { talking, visible: true, viseme, mouth };
}

// Lip flap while talking: syncs to active dialogue syllables / TTS envelopes when available, otherwise cycles ~9x/s.
// `talking` may be a boolean, the object returned by callout(), or { line, speaker }.
function lipFlap(t, talking, rest = 'smile', shapes = ['grin', 'open', 'o', 'grin', 'smile', 'open']) {
  if (!talking) return rest;
  if (typeof talking === 'object') {
    if (talking.viseme !== undefined) return talking.talking ? _pickViseme(talking.viseme, rest, shapes) : rest;
    if (talking.line) return _pickViseme(_visemeForLine(t, talking.line, typeof SCENE !== 'undefined' ? SCENE?.id : null), rest, shapes);
    if (!talking.talking) return rest;
  }
  if (typeof SCENE !== 'undefined' && SCENE?.dialogue?.length) {
    const spk = typeof talking === 'object' ? talking.speaker : null;
    for (const l of SCENE.dialogue) {
      if (l.kind === 'think' || l.silent) continue;
      if (spk && l.speaker !== spk) continue;
      const clip = typeof voiceClipFor === 'function' ? voiceClipFor(SCENE.id, l) : null;
      const dur = clip ? clip.dur : l.text.replace(/\*/g, '').length / (l.cps ?? 18);
      if (t >= l.at + .2 && t <= l.at + .2 + dur) {
        return _pickViseme(_visemeForLine(t, l, SCENE.id), rest, shapes);
      }
    }
  }
  return shapes[Math.floor(hash(Math.floor(t * 9)) * shapes.length)];
}

// Memoized speech-bubble layout & per-character width cache (invalidated automatically when web fonts finish loading).
const _BUBBLE_CACHE = new Map(), _BUBBLE_MAX = 256;
let _bubbleFontGen = 0;
function _bubbleFontsLoaded() { _bubbleFontGen++; _BUBBLE_CACHE.clear(); }
if (typeof document !== 'undefined' && document.fonts && typeof document.fonts.addEventListener === 'function') {
  document.fonts.addEventListener('loadingdone', _bubbleFontsLoaded);
}
// Exported players own their engine scope. Remove its document listener on destroy so
// document.fonts cannot retain a discarded player's drawing state and asset caches.
function disposeCalloutCache() {
  if (typeof document !== 'undefined') document.fonts?.removeEventListener?.('loadingdone', _bubbleFontsLoaded);
  _BUBBLE_CACHE.clear();
}
function _bubbleLayout(text, font, maxW) {
  const fSize = (typeof document !== 'undefined' && document.fonts) ? document.fonts.size : 0;
  const key = `${_bubbleFontGen}:${fSize}|${font}|${maxW}|${text}`;
  let lay = _BUBBLE_CACHE.get(key);
  if (lay) return lay;
  const words = []; let emph = false;
  for (const raw of text.split(' ')) {
    let w = '', f = [];
    for (const ch of raw) { if (ch === '*') { emph = !emph; continue; } w += ch; f.push(emph); }
    const charWidths = new Float32Array(w.length);
    for (let ci = 0; ci < w.length; ci++) charWidths[ci] = X.measureText(w[ci]).width;
    const ww = X.measureText(w).width;
    words.push({ w, f, ww, charWidths });
  }
  const sp = X.measureText(' ').width, lines = [[]], widths = [0]; let lw = 0;
  for (const wd of words) {
    if (lines[lines.length - 1].length && lw + sp + wd.ww > maxW) { lines.push([]); widths.push(0); lw = 0; }
    lines[lines.length - 1].push(wd); lw += (lw ? sp : 0) + wd.ww; widths[widths.length - 1] = lw;
  }
  lay = { sp, lines, widths, maxLineW: Math.max(...widths) };
  if (_BUBBLE_CACHE.size >= _BUBBLE_MAX) _BUBBLE_CACHE.delete(_BUBBLE_CACHE.keys().next().value);
  _BUBBLE_CACHE.set(key, lay);
  return lay;
}

function drawBubble(text, ax, ay, typed, k, o) {
  if (k < .02) return;
  const kind = o.kind || 'talk', size = o.size ?? (kind === 'whisper' ? 42 : 56), maxW = o.maxW ?? 720, lh = size * 1.18, pad = size * .62;
  const accent = o.accent ?? (kind === 'robot' ? '#D7262E' : PAL.crimson), ink = kind === 'whisper' ? PAL.inkSoft : PAL.ink;
  const font = kind === 'robot' ? `700 ${size}px "Courier New", "Menlo", monospace` : kind === 'whisper' ? `italic 600 ${size}px ${FONT_TALK}` : `600 ${size}px ${FONT_TALK}`;
  X.save();
  X.font = font;
  const { sp, lines, widths, maxLineW } = _bubbleLayout(text, font, maxW);
  const bw = maxLineW + pad * 2, bh = lines.length * lh + pad * 1.3;
  const box = kind === 'robot', rx = bw / 2 * (box ? 1.04 : 1.1), ry = bh / 2 * (box ? 1.08 : 1.22), ext = kind === 'shout' ? 1.14 : 1.06, m = 24;
  // keep the whole bubble inside the frame (the tail stretches to reach the speaker)
  const cx = clamp(ax + (o.dx ?? bw / 2 + 80), rx * ext + m, W - rx * ext - m), cy = clamp(ay + (o.dy ?? -bh / 2 - 110), ry * ext + m, H - ry * ext - m);

  X.translate(ax, ay); X.scale(k, k); X.translate(-ax, -ay);               // pop from the speaker's mouth
  // bubble outline points (stable bumps + a little boil)
  const n = kind === 'shout' ? 26 : 30, pts = [];
  if (box) {                                                               // a rounded panel
    const r = Math.min(rx, ry) * .28, C = [[cx + rx - r, cy - ry + r, -Math.PI / 2], [cx + rx - r, cy + ry - r, 0], [cx - rx + r, cy + ry - r, Math.PI / 2], [cx - rx + r, cy - ry + r, Math.PI]];
    for (const [qx, qy, a0] of C) for (let i = 0; i <= 5; i++) { const a = a0 + i / 5 * Math.PI / 2; pts.push([qx + Math.cos(a) * r + jit(.8), qy + Math.sin(a) * r + jit(.8)]); }
  } else for (let i = 0; i < n; i++) {
    const a = i / n * TAU, spike = kind === 'shout' ? (i % 2 ? .82 : 1.12) : kind === 'think' ? 1 + .06 * Math.sin(i * 3.3) : kind === 'whisper' ? 1 + .04 * Math.sin(i * 4.1) : 1 + .025 * Math.sin(i * 2.1 + 1);
    pts.push([cx + Math.cos(a) * rx * spike + jit(1.4), cy + Math.sin(a) * ry * spike + jit(1.4)]);
  }
  // tail: a curved wedge from the bubble's rim toward the mouth, stopping short of it
  const ang = Math.atan2(ay - cy, ax - cx), dist = Math.hypot(ax - cx, ay - cy);
  const rim = a => box ? [cx + clamp(Math.cos(a) * rx * 1.6, -rx * .8, rx * .8), cy + clamp(Math.sin(a) * ry * 1.6, -ry * .8, ry * .8)] : [cx + Math.cos(a) * rx * .9, cy + Math.sin(a) * ry * .9];
  const tip = [cx + Math.cos(ang) * (dist - 26), cy + Math.sin(ang) * (dist - 26)], b1 = rim(ang - .2), b2 = rim(ang + .2);
  const bend = [lerp(b1[0], tip[0], .55) + Math.cos(ang + Math.PI / 2) * 24, lerp(b1[1], tip[1], .55) + Math.sin(ang + Math.PI / 2) * 24];
  const fill = o.fill ?? (box ? '#EEF3F1' : PAL.white), inkW = kind === 'whisper' ? 5 : 7, smoothOut = kind !== 'shout' && !box;
  const tail = () => { if (kind === 'think') return false; tracePath([b1, bend, tip, b2], true, .6); return true; };
  // soft drop shadow
  X.save(); X.translate(8, 10); tracePath(pts, true, smoothOut); X.fillStyle = 'rgba(40,20,30,.22)'; X.fill(); if (tail()) X.fill(); X.restore();
  // union outline: stroke everything thick, then fill everything (hides inner strokes)
  X.lineJoin = 'round'; X.lineWidth = inkW * 2; X.strokeStyle = ink;
  if (kind === 'whisper') X.setLineDash([22, 14]);
  tracePath(pts, true, smoothOut); X.stroke(); if (tail()) X.stroke();
  X.setLineDash([]);
  X.fillStyle = fill; tracePath(pts, true, smoothOut); X.fill(); if (tail()) X.fill();
  if (box) {                                                               // rivets and a scan line
    for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) circle(cx + sx * (rx - 16), cy + sy * (ry - 16), 5, { fill: '#9AA6AC', stroke: ink, lwPx: 2 });
    X.save(); X.globalAlpha = .08; for (let yy = cy - ry + 10; yy < cy + ry - 6; yy += 8) { X.fillStyle = '#2A6B5A'; X.fillRect(cx - rx + 10, yy, rx * 2 - 20, 3); } X.restore();
  }
  if (kind === 'think') [[.55, 22], [.78, 13]].forEach(([f, r]) => { const q = [lerp(cx, ax, f), lerp(cy, ay, f)]; circle(q[0], q[1], r, { fill, stroke: PAL.ink, lwPx: inkW }); });

  // text, typed out character by character; the newest letter pops
  X.font = font; X.textBaseline = 'middle'; X.textAlign = 'left';
  let shown = 0, lastCol = null;
  for (let li = 0; li < lines.length; li++) {
    const L = lines[li];
    let x = cx - widths[li] / 2; const y = cy - (lines.length - 1) * lh / 2 + li * lh + size * .04;
    for (let wi = 0; wi < L.length; wi++) {
      const wd = L[wi];
      if (wi) x += sp;
      const ws = wd.w, wf = wd.f, cwArr = wd.charWidths;
      for (let ci = 0; ci < ws.length; ci++) {
        const cw = cwArr[ci], age = typed - shown; shown++;
        if (age > 0) {
          const col = wf[ci] ? accent : ink;
          if (age >= 2.5) {
            if (col !== lastCol) { X.fillStyle = col; lastCol = col; }
            X.fillText(ws[ci], x, y);
          } else {
            const pop = 1 + .35 * (1 - age / 2.5);
            X.save(); X.translate(x + cw / 2, y); X.scale(pop, pop);
            X.fillStyle = col; X.fillText(ws[ci], -cw / 2, 0); X.restore();
            lastCol = null;
          }
        }
        x += cw;
      }
    }
  }
  X.restore();
}
