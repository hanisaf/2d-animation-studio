// locations/__NAME__/__NAME__.js: the 3D set for __TITLE__. Description and layout live in README.md; reference art next to it.
//
// A 3D set in one-point perspective (engine/persp.js); follow throne_room.js for the pattern:
//   __NAME__.back(P, t, o)   everything farther than o.splitZ (walls, floor, far props). Call first.
//   __NAME__.front(P, t, o)  props nearer than o.splitZ. Call after the characters.
// World: X right, Y up (floor = 0), Z into the screen. A character ~170 world units tall.

const __NAME__ = (() => {
  const HW = 700, BACK = 2000, WALL_H = 900;
  const C = { wall: '#E9D8C4', floor: '#B98A5E', line: '#6B4A52' };
  function items(P, t, o) { return []; /* [{ z, draw: () => ... }] sorted far → near */ }
  return {
    MARK: { x: 0, z: 1100 }, HW, BACK,
    back(P, t, o = {}) {
      X.fillStyle = C.wall; X.fillRect(0, 0, W, H);
      const f = P.poly([[-HW, 0, P.cam.z - 200], [HW, 0, P.cam.z - 200], [HW, 0, BACK], [-HW, 0, BACK]]);
      if (f) shape(f, { fill: C.floor, stroke: null });
      P.plane(BACK, () => shape(rectPts(-HW, -WALL_H, 2 * HW, WALL_H), { fill: C.wall, stroke: C.line, lwPx: 1.6 }));
      for (const it of items(P, t, o)) if (it.z > (o.splitZ ?? -Infinity)) it.draw();
    },
    front(P, t, o = {}) { for (const it of items(P, t, o)) if (it.z <= (o.splitZ ?? -Infinity)) it.draw(); },
  };
})();

// Registration: the studio's location browser reads this (camera presets are paste-ready for scenes).
LOCATIONS.__NAME__ = Object.assign(__NAME__, {
  spots: { 'Stage mark': { x: 0, y: 0, z: 1100 } },
  cameras: { 'Wide': { x: 0, y: 160, z: 0, f: 1000, hy: 560 }, 'Close': { x: 0, y: 120, z: 800, f: 1000, hy: 700 } },
});
