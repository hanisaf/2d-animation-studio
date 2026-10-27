// Record the existing character drawing functions as editable SVG geometry.
function exportCharacterSvg({ entry, pose, view = 'pose', time = 0, zoom = 1 }) {
  if (!window.C2S) throw new Error('SVG exporter is unavailable. Run npm install and reload the studio.');
  const ctx = new C2S(W, H), matrix = document.createElement('canvas').getContext('2d');
  // canvas2svg predates the modern transform and ellipse Canvas APIs.
  for (const name of ['save', 'restore', 'translate', 'scale', 'rotate', 'transform']) {
    const original = ctx[name].bind(ctx);
    ctx[name] = (...args) => { matrix[name](...args); return original(...args); };
  }
  let currentPath;
  const beginPath = ctx.beginPath.bind(ctx);
  ctx.beginPath = () => { beginPath(); currentPath = ctx.__currentElement; };
  for (const name of ['fill', 'stroke', 'clip']) {
    const original = ctx[name].bind(ctx);
    ctx[name] = (...args) => {
      ctx.__currentElement = currentPath;
      if (name === 'clip') {
        // Clipping must not remove a shape that was already filled or stroked.
        const copy = currentPath.cloneNode(true);
        currentPath.parentNode.appendChild(copy);
        ctx.__currentElement = copy;
      }
      return original(...args);
    };
  }
  ctx.setLineDash = values => matrix.setLineDash(values);
  const stroke = ctx.stroke.bind(ctx);
  ctx.stroke = () => {
    stroke();
    const dash = matrix.getLineDash();
    if (dash.length) ctx.__currentElement.setAttribute('stroke-dasharray', dash.join(' '));
  };
  ctx.getTransform = () => matrix.getTransform();
  ctx.setTransform = (...args) => {
    const previous = matrix.getTransform();
    matrix.setTransform(...args);
    const delta = previous.inverse().multiply(matrix.getTransform());
    ctx.transform(delta.a, delta.b, delta.c, delta.d, delta.e, delta.f);
  };
  ctx.ellipse = (x, y, rx, ry, rotation, start, end, ccw = false) => {
    let sweep = end - start;
    if (!ccw && sweep >= TAU) sweep = TAU;
    else if (ccw && -sweep >= TAU) sweep = -TAU;
    else if (ccw) sweep = -((start - end) % TAU + TAU) % TAU;
    else sweep = (sweep % TAU + TAU) % TAU;
    const point = a => [x + rx * Math.cos(a) * Math.cos(rotation) - ry * Math.sin(a) * Math.sin(rotation),
      y + rx * Math.cos(a) * Math.sin(rotation) + ry * Math.sin(a) * Math.cos(rotation)];
    const first = point(start);
    if (ctx.__currentPosition?.x == null) ctx.moveTo(...first); else ctx.lineTo(...first);
    // Split full ellipses: a single SVG arc with identical endpoints is empty.
    const count = Math.max(1, Math.ceil(Math.abs(sweep) / Math.PI));
    for (let i = 1; i <= count; i++) {
      const p = point(start + sweep * i / count);
      ctx.__addPathCommand(`A ${rx} ${ry} ${rotation * 180 / Math.PI} 0 ${ccw ? 0 : 1} ${p[0]} ${p[1]}`);
      ctx.__currentPosition = { x: p[0], y: p[1] };
    }
  };
  const fill = ctx.fill.bind(ctx);
  ctx.fill = rule => { fill(); if (rule === 'evenodd') ctx.__currentElement.setAttribute('fill-rule', rule); };
  const outer = X, oldTime = T, oldRandom = _rnd, oldOverlays = OVERLAYS, oldCam = CAM, oldJitter = JIT;
  try {
    X = ctx; T = time; boilSeed(time); OVERLAYS = []; CAM = null; JIT = 0;
    if (view === 'sheet') {
      const names = poseNames(entry), cols = Math.max(1, Math.min(names.length, Math.ceil(Math.sqrt(names.length * 2.2))));
      const rows = Math.max(1, Math.ceil(names.length / cols)), cw = W / cols, ch = H / rows;
      const [uw, uh] = entry.size || [12, 28], scale = Math.min(cw * .78 / uw, (ch - 70) * .88 / uh);
      names.forEach((name, i) => {
        ctx.save();
        drawPose(entry, name, cw * (i % cols + .5), ch * (Math.floor(i / cols) + 1) - 58, scale, time);
        ctx.restore();
      });
    } else {
      const [uw, uh] = entry.size || [12, 28];
      drawPose(entry, pose, W / 2, H * .9, Math.min(H * .78 / uh, W * .8 / uw) * zoom, time);
    }
    flushOverlays();
    const svg = ctx.getSvg();
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    return new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml' });
  } finally {
    X = outer; T = oldTime; _rnd = oldRandom; OVERLAYS = oldOverlays; CAM = oldCam; JIT = oldJitter;
  }
}
