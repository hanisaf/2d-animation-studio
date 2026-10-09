(() => {
  const ink = '#5A5364';
  const box = (x, y, w, h, fill) => shape(rectPts(x, y, w, h), { fill, stroke: ink, lwPx: 2, smooth: .06 });
  function text(s, x, y, size, color = ink) {
    X.font = `600 ${size}px ${FONT_TALK}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillStyle = color; X.fillText(s, x, y);
  }
  LOCATIONS.home_clinic = {
    MARK: { x: -130, z: 1000 },
    back(P, t, o = {}) {
      const mode = o.mode || P.cam.mode || 'home', outside = mode === 'outside', office = mode === 'office';
      X.fillStyle = outside ? linGrad(0, 0, 0, H, [[0, '#B6DDEF'], [1, '#EDF5E5']]) : office ? '#DDE7EF' : '#F7E8D8';
      X.fillRect(0, 0, W, H);
      const ground = P.poly([[-1500, 0, P.cam.z + 16], [1500, 0, P.cam.z + 16], [1500, 0, 2500], [-1500, 0, 2500]]);
      if (ground) shape(ground, { fill: outside ? '#A6CFA0' : office ? '#ABBCCB' : '#D7B598', stroke: null });
      P.plane(1350, () => {
        if (outside) {
          ellipse(-400, -430, 70, 19, { fill: '#F6FBFC', stroke: null });
          ellipse(320, -400, 90, 22, { fill: '#F6FBFC', stroke: null });
          box(-200, -240, 400, 240, '#FFF1D6');
          shape([[-230, -232], [0, -350], [230, -232]], { fill: '#C16F70', stroke: ink, lwPx: 3 });
          box(-155, -130, 50, 130, '#493E51'); box(-100, -130, 14, 130, '#CFB396');
          circle(-113, -60, 3, { fill: '#E8BC5E', stroke: null });
          [0, 115].forEach(x => { box(x, -160, 65, 80, '#C8E8EE'); line([[x + 32, -160], [x + 32, -80]], { stroke: ink, lwPx: 2 }); });
          box(-170, 0, 95, 8, '#E4D9C8');
          return;
        }
        box(-700, -500, 1400, 500, office ? '#DDE7EF' : '#F7E8D8');
        box(-700, -12, 1400, 12, office ? '#7F98AD' : '#C89E80');
        if (office) {
          box(-260, -245, 155, 125, '#F6F6EF');
          text('Clinic Office', -182, -204, 20); text('Clinic administration', -182, -170, 11);
          box(180, -230, 135, 220, '#8B9CAA');
          for (let i = 0; i < 4; i++) { box(188, -219 + i * 51, 119, 45, '#C9D7E0'); box(230, -205 + i * 51, 32, 8, '#F9F5DF'); }
        } else {
          box(-290, -225, 145, 135, '#FFFDF5'); box(-282, -217, 129, 119, '#B9E0E5');
          line([[-218, -217], [-218, -98]], { stroke: ink, lwPx: 3 });
          line([[-282, -158], [-153, -158]], { stroke: ink, lwPx: 3 });
          box(90, -100, 230, 70, '#B893AD'); box(77, -65, 256, 45, '#CBA4BF');
          box(94, -20, 15, 20, '#785F66'); box(302, -20, 15, 20, '#785F66');
          box(205, -270, 95, 70, '#FFFCF2'); text('HOME', 252, -235, 18, '#92766A');
        }
      });
    },
    front(P, t, o = {}) {
      if ((o.mode || P.cam.mode) !== 'office') return;
      P.plane(900, () => { box(-245, -46, 420, 12, '#B08C7C'); box(-228, -34, 385, 34, '#907363'); box(-196, -72, 69, 26, '#F5E4B8'); text('Administration', -161, -59, 9); });
    },
    spots: { 'Living room': { x: -130, y: 0, z: 1000 }, 'Office': { x: 0, y: 0, z: 1000 }, 'Front door': { x: -130, y: 0, z: 1350 } },
    cameras: {
      Home: { x: 0, y: 130, z: 680, f: 1100, hy: 583 },
      Office: { x: 0, y: 130, z: 680, f: 1100, hy: 583, mode: 'office' },
      Outside: { x: 0, y: 140, z: 450, f: 1100, hy: 750, mode: 'outside' },
    },
  };
})();
