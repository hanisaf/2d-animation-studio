// engine/showcase.js: drawing for the studio's asset browser (and the model-sheet test scenes).
//
// Characters register poses for it:  CHARACTERS.<name> = { draw, unit, size: [w, h] (local units), title, ref, poses }
//   poses = { 'Pose name': (x, y, s, t) => { ...draw the character (and any props) standing at (x, y), scale s } }
// Locations register cameras:        LOCATIONS.<name> = { back, front, MARK, title, refs, cameras: { name: cam }, spots: { name: { x, y, z } } }

const PAPER = '#F4E6D6';
function paperBackdrop() {
  X.fillStyle = PAPER; X.fillRect(0, 0, W, H);
  X.fillStyle = linGrad(0, H * .72, 0, H, [[0, 'rgba(180,140,110,0)'], [1, 'rgba(180,140,110,.25)']]); X.fillRect(0, H * .72, W, H * .28);
}
const poseNames = entry => Object.keys(entry.poses || {});
function drawPose(entry, name, x, y, s, t) {
  const f = entry.poses?.[name] || Object.values(entry.poses || {})[0];
  return f ? f(x, y, s, t) : entry.draw(x, y, s, {});
}
// Every pose on one page, labelled.
function drawModelSheet(entry, t) {
  paperBackdrop();
  const names = poseNames(entry), n = names.length, cols = Math.min(n, Math.ceil(Math.sqrt(n * 2.2))), rows = Math.ceil(n / cols);
  const cw = W / cols, ch = H / rows, [uw, uh] = entry.size || [12, 28], s = Math.min(cw * .78 / uw, (ch - 70) * .88 / uh);
  names.forEach((nm, i) => {
    const cx = cw * (i % cols + .5), gy = ch * (Math.floor(i / cols) + 1) - 58;
    drawPose(entry, nm, cx, gy, s, t);
    overlay(() => { X.font = '600 26px ' + FONT_TALK; X.fillStyle = '#6a4a50'; X.textAlign = 'center'; X.fillText(nm, cx, gy + 42); });
  });
}
// One pose, big: on paper, or standing on a location's stage mark at true scale.
function drawCharacterView(entry, pose, t, o = {}) {
  const [uw, uh] = entry.size || [12, 28], zoom = o.zoom ?? 1, loc = o.location && LOCATIONS[o.location];
  if (loc) {
    const m = loc.MARK || { x: 0, z: 1200 }, hgt = uh * entry.unit, z = m.z - hgt * 2.1 / zoom, y = hgt * .55, k = 1000 / (m.z - z);
    const P = persp({ x: m.x, y, z, f: 1000, hy: H * .9 - y * k });
    layer(() => loc.back(P, t, { splitZ: m.z }), { blur: 2.4 });
    const [sx, sy] = P.p(m.x, 0, m.z);
    drawPose(entry, pose, sx, sy, entry.unit * k, t);
    loc.front(P, t, { splitZ: m.z });
  } else {
    paperBackdrop();
    const s = Math.min(H * .78 / uh, W * .8 / uw) * zoom;
    drawPose(entry, pose, W / 2, H * .9, s, t);
  }
}
// A location through a free camera, optionally with a character placed on one of its spots (default: the stage mark).
function drawLocationView(loc, cam, t, o = {}) {
  const P = persp(cam), m = (o.spot && loc.spots?.[o.spot]) || { y: 0, ...(loc.MARK || { x: 0, z: 1200 }) };
  loc.back(P, t, { splitZ: o.character ? m.z : -Infinity });
  if (o.character && P.visible(m.z)) { const e = CHARACTERS[o.character], [sx, sy, k] = P.p(m.x, m.y || 0, m.z); drawPose(e, o.pose, sx, sy, e.unit * k, t); }
  if (o.character) loc.front(P, t, { splitZ: m.z });
  return P;
}
