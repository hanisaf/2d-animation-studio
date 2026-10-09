// scenes/scene19_if_else_explain/props.js: the programming station of scene 19.
//
//   ieCart(P, X, Z, t)                an AV cart (top at IE_CART.top) with a lower shelf and casters
//   ieLaptop(P, X, Z, t, glow)        a laptop on the cart: the keyboard faces +Z (Housam), we see the lid's back and sticker.
//                                     Returns the screen point of the keyboard (for Housam's typing hands).
//   ieCable(P, from, to)              the cable from the laptop to the robot (world points)
//   ieHolo(P, Z, cx, cy, w, h, k, fn) a cyan hologram panel projected from the laptop: fn draws its content in world units
//                                     (origin at the panel centre, y down); k fades it in and out
//   ieEditor(t, o)                    a full-frame insert of the laptop screen: the code editor (o.code lines, typed by
//                                     o.chars), and the right-hand panel (o.panel: 'status' | 'llm', with o.prompt / o.promptRed
//                                     and o.clawd: Clawd's pose)
//   ieItem(kind, x, y, r, rot)        an "unpredictable output" icon (screen px): dice, star, duck, heart, note, ?, fish, rainbow

const IE_CART = { w: 160, d: 50, top: 64 };
const IE = { ink: '#3B2530', cart: '#4C7CC0', cartDk: '#35609E', cartLt: '#7BA6DE', steel: '#9AA3AA', lid: '#C3C9CE', lidDk: '#8E979E',
  holo: '#7FE3FF', holoDk: '#2E9BB8', editor: '#1E2230', editorDk: '#161925', gutter: '#5B6278', text: '#F2F3F7',
  kw: '#FF79C6', fn: '#8BE9FD', str: '#F1FA8C', num: '#BD93F9', cmt: '#7A86A8', cursor: '#FFFFFF', red: '#FF6B6B' };

function ieCart(P, x, z, t) {
  const { w, d, top } = IE_CART, x0 = x - w / 2, x1 = x + w / 2, z0 = z - d / 2, z1 = z + d / 2;
  const face = (pts, fill) => { const q = P.poly(pts); if (q) shape(q, { fill, stroke: IE.ink, lwPx: 1.4 }); };
  for (const [lx, lz] of [[x0 + 6, z0 + 6], [x1 - 6, z0 + 6], [x0 + 6, z1 - 6], [x1 - 6, z1 - 6]]) {         // legs and casters
    const l = P.line([[lx, 6, lz], [lx, top - 4, lz]]); if (l) line(l, { stroke: IE.steel, lwPx: clamp(3 * P.k(lz), 1, 6) });
    const [cx, cy, k] = P.p(lx, 4, lz); if (P.visible(lz)) circle(cx, cy, 4 * k, { fill: '#2A2E33', stroke: null });
  }
  face([[x0, 22, z0], [x1, 22, z0], [x1, 22, z1], [x0, 22, z1]], IE.cartLt);                                 // lower shelf
  if (P.cam.z < z0) face([[x0, 16, z0], [x1, 16, z0], [x1, 22, z0], [x0, 22, z0]], IE.cartDk);
  face([[x0, top, z0], [x1, top, z0], [x1, top, z1], [x0, top, z1]], IE.cartLt);                           // top
  if (P.cam.z < z0) face([[x0, top - 8, z0], [x1, top - 8, z0], [x1, top, z0], [x0, top, z0]], IE.cart);
  if (P.cam.x < x0) face([[x0, top - 8, z0], [x0, top - 8, z1], [x0, top, z1], [x0, top, z0]], IE.cartDk);
  if (P.cam.x > x1) face([[x1, top - 8, z0], [x1, top - 8, z1], [x1, top, z1], [x1, top, z0]], IE.cartDk);
  const [bx, by, k] = P.p(x0 + 30, 26, z0 + 10); if (P.visible(z0)) { shape(rectPts(bx - 14 * k, by - 18 * k, 28 * k, 18 * k), { fill: '#E9E2D0', stroke: IE.ink, lwPx: 1 }); }   // a book on the shelf
}

function ieLaptop(P, x, z, t, glow = 1) {
  const y = IE_CART.top, hw = 34, b0 = z - 16, b1 = z + 18;
  const base = P.poly([[x - hw, y + 3, b0], [x + hw, y + 3, b0], [x + hw, y + 3, b1], [x - hw, y + 3, b1]]); if (base) shape(base, { fill: IE.lid, stroke: IE.ink, lwPx: 1.3 });
  const kb = P.poly([[x - hw + 5, y + 3.3, b0 + 6], [x + hw - 5, y + 3.3, b0 + 6], [x + hw - 5, y + 3.3, b1 - 8], [x - hw + 5, y + 3.3, b1 - 8]]); if (kb) shape(kb, { fill: '#3B4048', stroke: null });
  const lid = [[x - hw, y + 3, b0], [x + hw, y + 3, b0], [x + hw, y + 38, b0 - 8], [x - hw, y + 38, b0 - 8]];
  if (glow > .01) {                                                       // the screen's glow spills up past the lid
    const [gx, gy, k] = P.p(x, y + 30, b0); if (P.visible(b0)) circle(gx, gy, 60 * k, { fill: radGrad(gx, gy, 2, 60 * k, [[0, rgba(IE.holo, .35 * glow)], [1, rgba(IE.holo, 0)]]), stroke: null });
  }
  const q = P.poly(lid); if (q) shape(q, { fill: P.cam.z < b0 ? IE.lid : IE.editor, stroke: IE.ink, lwPx: 1.4 });
  if (P.cam.z < b0) {                                                     // a little orange Clawd-face sticker on the lid
    const [sx, sy, k] = P.p(x, y + 21, b0 - 4);
    shape(rectPts(sx - 9 * k, sy - 6 * k, 18 * k, 11 * k), { fill: '#D97757', stroke: IE.ink, lwPx: 1 });
    for (const ex of [-4, 3]) shape(rectPts(sx + ex * k, sy - 3 * k, 1.6 * k, 3.6 * k), { fill: IE.ink, stroke: null });
  }
  return P.p(x, y + 4, (b0 + b1) / 2 + 4);
}

function ieCable(P, a, b) {
  const pts = [a, [lerp(a[0], b[0], .2), a[1] * .4, lerp(a[2], b[2], .15)], [lerp(a[0], b[0], .35), 2, lerp(a[2], b[2], .4)], [lerp(a[0], b[0], .8), 2, lerp(a[2], b[2], .85)], b];
  const l = P.line(pts); if (l) { line(l, { stroke: IE.ink, lwPx: 5, smooth: true }); line(l, { stroke: '#3F7FD9', lwPx: 2.6, smooth: true }); }
}

function ieHolo(P, z, cx, cy, w, h, k, fn) {
  if (k < .01 || !P.visible(z)) return;
  P.plane(z, () => {
    X.save(); X.globalAlpha *= k; X.translate(cx, -cy);
    shape(rectPts(-w / 2, -h / 2, w, h), { fill: rgba('#0E3A4C', .55), stroke: IE.holo, lwPx: 2.5 });
    X.save(); X.beginPath(); X.rect(-w / 2, -h / 2, w, h); X.clip();
    for (let i = 0; i < 16; i++) { const yy = -h / 2 + frac(i / 16 + T * .25) * h; line([[-w / 2, yy], [w / 2, yy]], { stroke: rgba(IE.holo, .12), lwPx: 1 }); }
    fn && fn();
    X.restore();
    for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) line([[sx * w / 2, sy * (h / 2 - 12)], [sx * w / 2, sy * h / 2], [sx * (w / 2 - 12), sy * h / 2]], { stroke: '#E9FBFF', lwPx: 3 });
    X.restore();
  });
}
// Hologram text: centred, glowing cyan (world units, inside an ieHolo fn).
function ieHoloText(txt, x, y, size, col = '#E9FBFF', a = 1) {
  if (a <= 0) return;
  X.save(); X.globalAlpha *= clamp(a); X.font = `700 ${size}px ${FONT_TALK}`; X.textAlign = 'center'; X.textBaseline = 'middle';
  X.shadowColor = IE.holo; X.shadowBlur = 8; X.fillStyle = col; X.fillText(txt, x, y); X.restore();
}

// ---------- the laptop screen insert ----------
const IE_MONO = '600 50px ui-monospace, "SF Mono", Menlo, monospace';
function ieTokens(line) {                                                // a tiny Python highlighter
  const out = [], re = /(\s+)|("[^"]*"?)|(\b(?:if|elif|else|def|return)\b)|([A-Za-z_]\w*)(?=\()|([A-Za-z_]\w*)|(.)/g; let m;
  while ((m = re.exec(line))) {
    const [s] = m, col = m[2] ? IE.str : m[3] ? IE.kw : m[4] ? IE.fn : m[5] ? IE.text : IE.text;
    out.push([s, m[6] && /[():]/.test(s) ? '#C8CCD8' : col]);
  }
  return out;
}
function ieEditor(t, o = {}) {
  X.fillStyle = '#121418'; X.fillRect(0, 0, W, H);
  shape(rectPts(40, 30, W - 80, H - 60), { fill: IE.editor, stroke: '#3A3F4D', lwPx: 6, smooth: .04 });
  shape(rectPts(40, 30, W - 80, 64), { fill: IE.editorDk, stroke: null });                                // title bar + tab
  for (const [i, c] of [[0, '#FF5F57'], [1, '#FEBC2E'], [2, '#28C840']]) circle(78 + i * 30, 62, 9, { fill: c, stroke: null });
  shape(rectPts(190, 40, 330, 54), { fill: IE.editor, stroke: null });
  X.font = `600 26px ${FONT_TALK}`; X.fillStyle = IE.text; X.textAlign = 'left'; X.textBaseline = 'middle'; X.fillText('robo_safadi.py', 220, 68);
  // code
  const left = 110, top = 190, lh = 80, code = o.code || [];
  let budget = o.chars ?? Infinity, cur = null;
  code.forEach((ln, i) => {
    const y = top + i * lh;
    X.font = IE_MONO; X.fillStyle = IE.gutter; X.textAlign = 'right'; X.fillText(String(i + 1), left + 34, y);
    const n = Math.max(0, Math.min(ln.length, budget)); budget -= ln.length + 1;
    let x = left + 80; X.textAlign = 'left';
    let shown = 0;
    for (const [s, col] of ieTokens(ln)) { if (shown >= n) break; const part = s.slice(0, n - shown); X.fillStyle = (o.hl === i ? '#FFE9A0' : col); X.fillText(part, x, y); x += X.measureText(part).width; shown += part.length; }
    if (n < ln.length || (budget < 0 && cur == null)) cur = cur ?? [x, y];
    if (o.hl === i) { X.save(); X.globalAlpha = .12 + .08 * Math.sin(t * 6); X.fillStyle = '#FFE9A0'; X.fillRect(left + 60, y - lh / 2 + 4, 1060, lh - 8); X.restore(); }
  });
  if (!cur && code.length) { X.font = IE_MONO; const last = code[code.length - 1]; cur = [left + 80 + X.measureText(last).width, top + (code.length - 1) * lh]; }
  if (cur && frac(t * 1.8) < .6) shape(rectPts(cur[0] + 2, cur[1] - 30, 5, 60), { fill: IE.cursor, stroke: null });
  // the right-hand panel
  const px = 1240, pw = 600;
  shape(rectPts(px, 110, pw, H - 170), { fill: '#252A3A', stroke: '#3A3F4D', lwPx: 3 });
  if (o.panel === 'llm') {
    X.font = `700 40px ${FONT_TALK}`; X.fillStyle = '#F2A283'; X.textAlign = 'left'; X.fillText('LLM', px + 30, 160);
    X.font = `500 28px ${FONT_TALK}`; X.fillStyle = IE.cmt; X.fillText('large language model', px + 125, 162);
    const cA = clawd(px + pw / 2, 610, 26, { t, noShadow: true, ...(o.clawd || {}) });
    // the prompt box
    shape(rectPts(px + 30, 680, pw - 60, 260), { fill: '#1A1E2A', stroke: '#F2A283', lwPx: 3 });
    X.font = `700 28px ${FONT_TALK}`; X.fillStyle = '#F2A283'; X.fillText('PROMPT', px + 50, 716);
    const words = (o.prompt || '') + (o.promptRed || '');
    ieWrap(o.prompt || '', o.promptRed || '', px + 50, 772, pw - 100, 52, t);
    return cA;
  }
  X.font = `700 40px ${FONT_TALK}`; X.fillStyle = IE.fn; X.textAlign = 'left'; X.fillText('ROBO-SAFADI', px + 30, 160);
  X.font = `500 32px ${FONT_TALK}`; X.fillStyle = IE.text;
  [['status', 'connected', '#5AF78E'], ['buttons', 'TRICK  ·  TREAT', IE.text], ['brain', 'not yet...', IE.cmt]].forEach(([k, v, c], i) => {
    X.fillStyle = IE.cmt; X.fillText(k, px + 30, 240 + i * 64); X.fillStyle = c; X.fillText(v, px + 190, 240 + i * 64); });
  roboSafadi(px + pw / 2, 930, 14, { t, eyes: 'open', mouth: 'flat', noShadow: true });
}
function ieWrap(a, b, x, y, w, lh, t) {                                     // two-colour word wrap, with a typing cursor
  X.font = `600 38px ${FONT_TALK}`; X.textAlign = 'left';
  let cx = x, cy = y;
  const put = (txt, col) => { for (const word of txt.split(/(?<= )/)) { const ww = X.measureText(word).width; if (cx + ww > x + w && cx > x) { cx = x; cy += lh; } X.fillStyle = col; X.fillText(word, cx, cy); cx += ww; } };
  put(a, IE.text); put(b, IE.red);
  if (frac(t * 1.8) < .6) shape(rectPts(cx + 2, cy - 20, 3, 36), { fill: IE.cursor, stroke: null });
}

// ---------- "unpredictable output": things Clawd pulls out of thin air ----------
function ieItem(kind, x, y, r, rot = 0) {
  X.save(); X.translate(x, y); X.rotate(rot); const L = { stroke: IE.ink, lwPx: clamp(r * .12, 1, 4) };
  if (kind === 'dice') { shape(rectPts(-r, -r, 2 * r, 2 * r), { fill: '#FFFFFF', ...L }); for (const [dx, dy] of [[-.5, -.5], [0, 0], [.5, .5]]) circle(dx * r, dy * r, r * .16, { fill: IE.ink, stroke: null }); }
  else if (kind === 'star') shape(starPts(0, 0, r * 1.2), { fill: '#F7D57A', ...L });
  else if (kind === 'duck') { ellipse(0, r * .2, r, r * .65, { fill: '#F7D046', ...L }); circle(r * .5, -r * .45, r * .5, { fill: '#F7D046', ...L }); shape([[r * .9, -r * .5], [r * 1.4, -r * .35], [r * .9, -r * .25]], { fill: '#EE8A2C', ...L }); circle(r * .6, -r * .55, r * .08, { fill: IE.ink, stroke: null }); }
  else if (kind === 'heart') shape(ellPts(0, 0, r, r, 4, Math.PI / 4), { fill: '#E2476E', ...L });
  else if (kind === 'fish') { ellipse(0, 0, r, r * .55, { fill: '#5BB6E8', ...L }); shape([[-r * .9, 0], [-r * 1.5, -r * .5], [-r * 1.5, r * .5]], { fill: '#5BB6E8', ...L }); circle(r * .5, -r * .1, r * .1, { fill: IE.ink, stroke: null }); }
  else if (kind === 'rainbow') { ['#E2476E', '#EE8A2C', '#F7D046', '#4DA650', '#4166B8'].forEach((c, i) => { X.beginPath(); X.arc(0, r * .5, r * (1.2 - i * .14), Math.PI, 0); X.strokeStyle = c; X.lineWidth = r * .14; X.stroke(); }); }
  else { const size = r * 2.4; X.font = `${size}px ${FONT_SFX}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineWidth = size * .14; X.strokeStyle = IE.ink; X.strokeText(kind, 0, 0); X.fillStyle = kind === '?' ? '#8EC3E6' : '#BD93F9'; X.fillText(kind, 0, 0); }
  X.restore();
}
