// engine/persp.js: perspective projection for 3D sets (rooms, halls, streets, rinks).
//
// World axes: X right, Y UP (the floor is Y = 0), Z into the screen. Units are "world units" (the jester is ~170 tall).
// cam = { x, y (eye height), z, f (focal length in px; bigger = more telephoto), hy (screen y of the horizon), dir,
//         yaw, pitch, roll (optional 3D camera angles in rad), lookAt: [X, Y, Z] (optional target to aim at) }
// Raising hy tilts the view up (the world slides down the screen); moving z dollies through the set.
// dir: 1 (default) looks toward +Z; -1 is the reverse angle (the camera turned 180°, looking toward −Z, so +X is screen-left).
// When yaw, pitch, roll and lookAt are omitted, uses the exact 1-point perspective fast path.
//
//   const P = persp({ x: 0, y: 150, z: 0, f: 1000, hy: 540 });
//   P.p(X, Y, Z)        → [sx, sy, k]  screen point + scale (px per world unit) at that depth
//   P.poly([[X,Y,Z]..]) → screen polygon, clipped at the near plane (null if fully behind the camera)
//   P.line([[X,Y,Z]..]) → screen polyline, clipped at the near plane
//   P.plane(Z, fn)      → draw fn(k) in WORLD units on the screen-facing plane at depth Z (local x = X, local y = -Y)
//   P.billboard(X,Y,Z,fn) → draw fn(k, sx, sy) facing the camera at world point (X, Y, Z)
//   P.floorCircle(X, Z, r, Y = 0, n) → a horizontal circle (basins, rugs, steps) as a screen polygon
//   P.depth(Z | [X,Y,Z])→ distance in front of the camera along its view axis
//   P.dir               → 1 or −1. In a reverse-angle plane(), local x runs right-to-left: flip text with X.scale(P.dir, 1)
//
//   const st = depthStage(P); st.add(zOrPt, fn); st.char(zOrPt, fn, o); st.flush();  // multi-depth far→near painter

function persp(cam) {
  const c = { x: 0, y: 150, z: 0, f: 1000, hy: 540, dir: 1, yaw: 0, pitch: 0, roll: 0, ...cam }, NEAR = 15, dir = c.dir < 0 ? -1 : 1;
  const is3D = !!(c.yaw || c.pitch || c.roll || c.lookAt);

  if (!is3D) {
    const depth = v => ((Array.isArray(v) ? v[2] : v) - c.z) * dir, zn = () => c.z + NEAR * dir, inside = z => (z - c.z) * dir >= NEAR;
    const p = (x, y, z) => { const k = c.f / Math.max((z - c.z) * dir, 1e-3); return [W / 2 + (x - c.x) * dir * k, c.hy + (c.y - y) * k, k]; };
    const cut = (a, b) => { const f = (zn() - a[2]) / (b[2] - a[2]); return [lerp(a[0], b[0], f), lerp(a[1], b[1], f), zn()]; };
    return {
      cam: c, p, dir, depth,
      k: v => c.f / Math.max(depth(v), 1e-3),
      visible: v => depth(v) > NEAR,
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
      billboard(x, y, z, fn) {
        if (depth(z) < NEAR) return;
        const [sx, sy, k] = p(x, y, z);
        X.save(); X.translate(sx, sy); X.scale(k, k); fn(k, sx, sy); X.restore();
      },
      floorCircle(x, z, r, y = 0, n = 32) { const q = []; for (let i = 0; i < n; i++) { const a = i / n * TAU; q.push([x + Math.cos(a) * r, y, z + Math.sin(a) * r]); } return this.poly(q); },
    };
  }

  // 3D rotated camera basis (R = right, U = up, F = forward)
  let az = (dir < 0 ? Math.PI : 0) + (c.yaw || 0), pt = c.pitch || 0, rl = c.roll || 0;
  if (c.lookAt) {
    const dx = c.lookAt[0] - c.x, dy = c.lookAt[1] - c.y, dz = c.lookAt[2] - c.z;
    az = Math.atan2(dx, dz) + (c.yaw || 0);
    pt = Math.atan2(dy, Math.hypot(dx, dz) || 1e-6) + (c.pitch || 0);
  }
  const sa = Math.sin(az), ca = Math.cos(az), sp = Math.sin(pt), cp = Math.cos(pt), sr = Math.sin(rl), cr = Math.cos(rl);
  const F = [cp * sa, sp, cp * ca];
  const R1 = [ca, 0, -sa], U1 = [-sp * sa, cp, -sp * ca];
  const R = [cr * R1[0] + sr * U1[0], cr * R1[1] + sr * U1[1], cr * R1[2] + sr * U1[2]];
  const U = [-sr * R1[0] + cr * U1[0], -sr * R1[1] + cr * U1[1], -sr * R1[2] + cr * U1[2]];
  const toCam = (x, y, z) => {
    const dx = x - c.x, dy = y - c.y, dz = z - c.z;
    return [dx * R[0] + dy * R[1] + dz * R[2], dx * U[0] + dy * U[1] + dz * U[2], dx * F[0] + dy * F[1] + dz * F[2]];
  };
  const proj = v => { const k = c.f / Math.max(v[2], 1e-3); return [W / 2 + v[0] * k, c.hy - v[1] * k, k]; };
  const p = (x, y, z) => proj(toCam(x, y, z));
  const depth = v => Array.isArray(v) ? toCam(v[0], v[1], v[2])[2] : (v - c.z) * F[2];
  const cutCam = (a, b) => { const f = (NEAR - a[2]) / (b[2] - a[2]); return [lerp(a[0], b[0], f), lerp(a[1], b[1], f), NEAR]; };

  return {
    cam: c, p, dir, depth,
    k: v => c.f / Math.max(depth(v), 1e-3),
    visible: v => depth(v) > NEAR,
    poly(pts) {
      const cv = pts.map(v => toCam(v[0], v[1], v[2])), out = [];
      for (let i = 0; i < cv.length; i++) {
        const a = cv[i], b = cv[(i + 1) % cv.length], ina = a[2] >= NEAR, inb = b[2] >= NEAR;
        if (ina) out.push(a);
        if (ina !== inb) out.push(cutCam(a, b));
      }
      return out.length >= 3 ? out.map(proj) : null;
    },
    line(pts) {
      const cv = pts.map(v => toCam(v[0], v[1], v[2])), out = [];
      for (let i = 0; i < cv.length; i++) {
        const a = cv[i], ina = a[2] >= NEAR, prev = cv[i - 1];
        if (prev && (prev[2] >= NEAR) !== ina) out.push(cutCam(prev, a));
        if (ina) out.push(a);
      }
      return out.length >= 2 ? out.map(proj) : null;
    },
    plane(z, fn) {
      if (depth([0, 0, z]) < NEAR) return;
      const o = p(0, 0, z), px = p(100, 0, z), py = p(0, -100, z), k = o[2];
      X.save();
      X.transform((px[0] - o[0]) / 100, (px[1] - o[1]) / 100, (py[0] - o[0]) / 100, (py[1] - o[1]) / 100, o[0], o[1]);
      fn(k);
      X.restore();
    },
    billboard(x, y, z, fn) {
      if (depth([x, y, z]) < NEAR) return;
      const [sx, sy, k] = p(x, y, z);
      X.save(); X.translate(sx, sy); if (rl) X.rotate(rl); X.scale(k, k); fn(k, sx, sy); X.restore();
    },
    floorCircle(x, z, r, y = 0, n = 32) { const q = []; for (let i = 0; i < n; i++) { const a = i / n * TAU; q.push([x + Math.cos(a) * r, y, z + Math.sin(a) * r]); } return this.poly(q); },
  };
}

// Multi-depth painter's-algorithm stage: queue background props, characters, and foreground pieces at any Z or [X,Y,Z].
function depthStage(P) {
  const items = [];
  let order = 0;
  const add = (zOrPt, fn, bias = 0) => {
    const d = P.depth(zOrPt);
    if (d > 15) items.push({ d: d + bias, order: order++, fn });
  };
  return {
    add,
    char(zOrPt, fn, o = {}) {
      add(zOrPt, () => {
        if (o.shadow) {
          const foot = o.foot || (Array.isArray(zOrPt) ? P.p(zOrPt[0], zOrPt[1], zOrPt[2]) : null);
          if (foot) {
            const sh = o.shadow === true ? {} : (o.light != null && o.shadow.light == null ? { ...o.shadow, light: o.light } : o.shadow);
            return castShadow(fn, foot[0], foot[1], sh);
          }
        }
        if (o.light) return lit(fn, o.light === true ? undefined : o.light);
        return fn();
      }, o.bias || 0);
    },
    flush() {
      items.sort((a, b) => (b.d - a.d) || (a.order - b.order));
      for (const it of items) it.fn();
      items.length = 0;
    },
  };
}
