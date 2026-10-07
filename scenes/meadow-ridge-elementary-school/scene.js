(() => {
  const R = LOCATIONS['meadow-ridge-elementary-school'];
  function view(t, lt, name) {
    const cam = { ...R.cameras[name] };
    cam.z += lt * 12;
    const P = persp(cam);
    R.back(P, t);
    R.front(P, t);
  }
  scene({ duration: 12, fps: 24, bpm: 100, shots: [
    [0, (t, lt) => view(t, lt, 'Courtyard wide')],
    [6, (t, lt) => view(t, lt, 'Entrance')],
  ] });
})();
