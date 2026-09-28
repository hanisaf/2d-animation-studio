// engine/persp.js: one-point perspective for 3D sets (rooms, halls, streets).
//
// World axes: X right, Y UP (the floor is Y = 0), Z into the screen. Units are "world units" (the jester is ~170 tall).
// cam = { x, y (eye height), z, f (focal length in px; bigger = more telephoto), hy (screen y of the horizon), dir }
// Raising hy tilts the view up (the world slides down the screen); moving z dollies through the set.
// dir: 1 (default) looks toward +Z; -1 is the reverse angle (the camera turned 180°, looking toward −Z, so +X is screen-left).
// Same world, same spots: a set drawn with P.depth() for its draw order works from both sides.
//
//   const P = persp({ x: 0, y: 150, z: 0, f: 1000, hy: 540 });
//   P.p(X, Y, Z)        → [sx, sy, k]  screen point + scale (px per world unit) at that depth
//   P.poly([[X,Y,Z]..]) → screen polygon, clipped at the near plane (null if fully behind the camera)
//   P.line([[X,Y,Z]..]) → screen polyline, clipped at the near plane
//   P.plane(Z, fn)      → draw fn(k) in WORLD units on the screen-facing plane at depth Z (local x = X, local y = -Y)
//   P.floorCircle(X, Z, r, Y = 0, n) → a horizontal circle (basins, rugs, steps) as a screen polygon
//   P.depth(Z)          → distance in front of the camera along its view (Z − cam.z, or cam.z − Z when dir = −1)
//   P.dir               → 1 or −1. In a reverse-angle plane(), local x runs right-to-left: flip text with X.scale(P.dir, 1)

function persp(cam) {
  const c = { x: 0, y: 150, z: 0, f: 1000, hy: 540, dir: 1, ...cam }, NEAR = 15, dir = c.dir < 0 ? -1 : 1;
  const depth = z => (z - c.z) * dir, zn = () => c.z + NEAR * dir, inside = z => depth(z) >= NEAR;
  const p = (x, y, z) => { const k = c.f / Math.max(depth(z), 1e-3); return [W / 2 + (x - c.x) * dir * k, c.hy + (c.y - y) * k, k]; };
  const cut = (a, b) => { const f = (zn() - a[2]) / (b[2] - a[2]); return [lerp(a[0], b[0], f), lerp(a[1], b[1], f), zn()]; };
  return {
    cam: c, p, dir, depth,
    k: z => c.f / Math.max(depth(z), 1e-3),
    visible: z => depth(z) > NEAR,
    poly(pts) {
      const out = [];
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i], b = pts[(i + 1) % pts.length], ina = inside(a[2]), inb = inside(b[2]);
        if (ina) out.push(a);
        if (ina !== inb) out.push(cut(a, b));
      }
      return out.length >= 3 ? out.map(v => p(v[0], v[1], v[2])) : null;
    },
    line(pts) {
      const out = [];
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i], ina = inside(a[2]), prev = pts[i - 1];
        if (prev && inside(prev[2]) !== ina) out.push(cut(prev, a));
        if (ina) out.push(a);
      }
      return out.length >= 2 ? out.map(v => p(v[0], v[1], v[2])) : null;
    },
    plane(z, fn) {
      if (depth(z) < NEAR) return;
      const k = c.f / depth(z);
      X.save(); X.translate(W / 2 - c.x * dir * k, c.hy + c.y * k); X.scale(k * dir, k); fn(k); X.restore();
    },
    floorCircle(x, z, r, y = 0, n = 32) { const q = []; for (let i = 0; i < n; i++) { const a = i / n * TAU; q.push([x + Math.cos(a) * r, y, z + Math.sin(a) * r]); } return this.poly(q); },
  };
}
