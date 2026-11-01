// Scene 63: Python lecture, Module 15 · Categorical Data and Regression Plots. The black board takes centre stage; eleven
// panels chalk themselves on in step with the voice-over (asset.js → narration). The charts are chalk sketches of what
// each seaborn call draws. Built with scene 49's lecture_kit.js.
// Board coords: 1320 × 680, y down; the header sits above y 100 and the footer at y 650.
(() => {
  const C = LK;
  function chart(x, y, w, h, xr, yr, k, o = {}) {
    lkAxes(x, y, w, h, k, { size: 16, ...o });
    if (o.title) lkText(o.title, x + w / 2, y - 22, 18, C.dim, k, 'center');
    return lkScale(x, y, w, h, xr, yr);
  }
  const DAYS = ['Thur', 'Fri', 'Sat', 'Sun'], MED = [16, 15.5, 18, 19.5];
  // a box: q1, median, q3, whisker low/high, at board x, through scale S (x is a board coordinate)
  function box(S, x, w, q, k, col = C.chalk) {
    if (k <= 0) return;
    const [, y1] = S(0, q[0]), [, ym] = S(0, q[1]), [, y3] = S(0, q[2]), [, ylo] = S(0, q[3]), [, yhi] = S(0, q[4]);
    lkRect(x - w / 2, y3, w, y1 - y3, k, col, 3, col === C.red ? C.redFill : C.chalkFill); lkLine([[x - w / 2, ym], [x + w / 2, ym]], k, col, 5);
    lkLine([[x, y1], [x, ylo]], k, col, 2.5); lkLine([[x, y3], [x, yhi]], k, col, 2.5); lkLine([[x - w / 4, ylo], [x + w / 4, ylo]], k, col, 2.5); lkLine([[x - w / 4, yhi], [x + w / 4, yhi]], k, col, 2.5);
  }
  // half or whole violin from a bell
  function violin(cx, cy0, cy1, width, mu, sd, k, col, side = 0) {
    if (k <= 0) return;
    const L = [], R = [];
    for (let i = 0; i <= 30; i++) { const y = cy0 + (cy1 - cy0) * i / 30, t = mu + (i / 30 - .5) * 6 * sd, d = Math.exp(-.5 * ((t - mu) / sd) ** 2) * width; L.push([cx - (side >= 0 ? d : 0), y]); R.push([cx + (side <= 0 ? d : 0), y]); }
    shape([...L, ...R.reverse()], { fill: col === C.red ? C.redFill : C.chalkFill, stroke: col, lw: 2.5, alpha: k, smooth: true });
  }

  const panels = [
    { title: 'Categorical Data and Regression Plots', draw(u, b) {
      lkTitle(u, b, 15, 'Categorical Data and Regression Plots', [['compare', 'groups', 2, .6], ['estimates', 'per group', 2, 2.6], ['regression', 'plots', 2, 4.6], ['an open-ended', 'analysis', 2, 7.2]]);
    } },

    { title: 'One interface: catplot()', draw(u, b) {
      lkCode('sns.catplot(data=…, x=…, y=…, kind=…)', 660, 155, 32, C.chalk, lkK(b(0), .3, 1.2), 'center');
      const rows = [['Categorical scatter', '"strip" (default)  "swarm"', 'every observation', .3], ['Distribution', '"box"  "violin"  "boxen"', 'the shape of each group', 3.2], ['Estimate', '"bar"  "point"  "count"', 'one number per group', 6.2]];
      lkTable(110, 220, [{ label: 'Family', w: 300, mono: false }, { label: 'kind=', w: 480, col: C.red }, { label: 'Shows', w: 320, mono: false }], rows.map(r => r.slice(0, 3)),
        { size: 24, rh: 70, kRow: i => i < 0 ? lkK(b(1), 0, .6) : lkK(b(1), rows[i][3], .7) });
      lkText('as relplot() and displot() did', 660, 560, 22, C.dim, lkK(b(0), 4, 1), 'center');
    } },

    { title: 'Categorical scatter plots', draw(u, b) {
      const S = chart(70, 160, 330, 270, [0, 4], [0, 52], lkK(b(0), .2, .6), { xl: 'day', yl: 'total_bill', title: 'kind="strip"' });
      DAYS.forEach((d, i) => { lkText(d, S(i + .5, 0)[0], 445, 16, C.dim, lkK(b(0), .2, .6), 'center'); lkDots(lkCloud(16, i * 11, -.25, .25, () => MED[i], 7).map(([a, c]) => S(i + .5 + a, Math.max(4, c))), lkK(b(0), .8 + i * .4, .8), C.chalk, 4); });
      const T = chart(490, 160, 330, 270, [0, 4], [0, 52], lkK(b(1), .2, .6), { xl: 'day', title: 'kind="swarm", hue="sex"' });
      DAYS.forEach((d, i) => { const vals = lkCloud(16, i * 17 + 3, 0, 1, () => MED[i], 7).map(([, c]) => Math.max(4, c)).sort((p, q) => p - q);
        vals.forEach((v, j) => { const k = lkK(b(1), .8 + i * .4 + j * .03, .4), side = (j % 2 ? 1 : -1) * Math.ceil((j % 6) / 2) * 7, [x, y] = T(i + .5, v); circle(x + side, y, 4, { fill: j % 3 ? C.chalk : C.red, stroke: null, alpha: k }); }); });
      lkText('never overlap · small data only', 655, 490, 18, C.dim, lkK(b(1), 3, .8), 'center');
      const H = chart(920, 160, 320, 270, [0, 52], [0, 4], lkK(b(2), .2, .6), { xl: 'total_bill', title: 'y="day", order=[…]' });
      DAYS.forEach((d, i) => { lkText(d, 905, H(0, 3.5 - i)[1], 16, C.dim, lkK(b(2), .3, .6), 'right'); lkDots(lkCloud(14, i * 5 + 40, -.2, .2, () => MED[i], 7).map(([a, c]) => H(Math.max(4, c), 3.5 - i + a)), lkK(b(2), .8 + i * .3, .7), C.chalk, 4); });
    } },

    { title: 'Distributions within categories', draw(u, b) {
      const S = chart(70, 160, 360, 290, [0, 4], [0, 52], lkK(b(0), .2, .6), { xl: 'day', yl: 'total_bill', title: 'kind="box"' });
      DAYS.forEach((d, i) => { lkText(d, S(i + .5, 0)[0], 465, 16, C.dim, lkK(b(0), .2, .6), 'center'); box(S, S(i + .5, 0)[0], 50, [MED[i] - 5, MED[i], MED[i] + 7, MED[i] - 9, MED[i] + 17], lkK(b(0), 1 + i * .4, .7)); });
      [[MED[2] + 26, 'outlier']].forEach(([v]) => circle(S(2.5, 0)[0], S(0, v)[1], 5, { fill: null, stroke: C.red, lw: 2, alpha: lkK(b(0), 9, .6) }));
      const kL = lkK(b(0), 4, .8); lkText('median', 455, S(0, MED[3])[1], 17, C.red, kL); lkText('middle 50%', 455, S(0, MED[3] + 4)[1] - 14, 17, C.dim, kL); lkText('whisker ≤ 1.5 × box', 455, S(0, MED[3] + 16)[1], 17, C.dim, lkK(b(0), 6, .8));
      const T = chart(660, 160, 280, 290, [0, 2], [0, 52], lkK(b(1), .2, .6), { xl: 'day', title: 'hue="smoker"' });
      [0, 1].forEach(i => { box(T, T(i + .5, 0)[0] - 26, 40, [MED[i + 2] - 5, MED[i + 2], MED[i + 2] + 6, MED[i + 2] - 8, MED[i + 2] + 14], lkK(b(1), .6 + i * .6, .7)); box(T, T(i + .5, 0)[0] + 26, 40, [MED[i + 2] - 3, MED[i + 2] + 2, MED[i + 2] + 10, MED[i + 2] - 7, MED[i + 2] + 20], lkK(b(1), .9 + i * .6, .7), C.red); });
      const V = chart(1010, 160, 260, 290, [0, 2], [0, 52], lkK(b(2), .2, .6), { title: 'violin, split=True' });
      [0, 1].forEach(i => { const cx = V(i + .5, 0)[0]; violin(cx, V(0, 46)[1], V(0, 4)[1], 44, 0, 1, lkK(b(2), 1 + i * .5, .8), C.chalk, 1); violin(cx, V(0, 48)[1], V(0, 6)[1], 40, 0, 1.1, lkK(b(2), 1.3 + i * .5, .8), C.red, -1); });
      lkText('a mirrored density per side', 1140, 500, 17, C.dim, lkK(b(2), 3, .8), 'center');
      lkCode('inner="quart"', 1140, 535, 15, C.dim, lkK(b(2), 7, .8), 'center'); lkText('+ a swarm on a light violin', 1140, 565, 16, C.dim, lkK(b(2), 7.6, .8), 'center');
    } },

    { title: 'Estimates within categories', draw(u, b) {
      const S = chart(70, 160, 340, 280, [0, 2], [0, 1], lkK(b(0), .2, .6), { xl: 'sex', yl: 'survival rate', title: 'kind="bar", hue="class"' });
      [[.37, .16, .14], [.97, .92, .5]].forEach((rates, si) => { lkText(['male', 'female'][si], S(si + .5, 0)[0], 455, 16, C.dim, lkK(b(1), .2, .6), 'center');
        rates.forEach((r, ci) => { const k = lkK(b(1), .4 + si * .9 + ci * .3, .6), x = S(si + .5, 0)[0] + (ci - 1) * 40, [, y] = S(0, r), [, y0] = S(0, 0); lkRect(x - 17, y, 34, y0 - y, k, ci === 2 ? C.red : C.chalk, 2.5, ci === 2 ? C.redFill : C.chalkFill); lkLine([[x, y - 14], [x, y + 14]], k, C.chalk, 2); }); });
      lkText('mean of 0/1 = a rate', 240, 495, 18, C.red, lkK(b(1), 2, .7), 'center', 700);
      const T = chart(500, 160, 300, 280, [0, 7], [0, 60], lkK(b(2), .2, .6), { xl: 'deck', title: 'kind="count"' });
      [15, 47, 59, 33, 32, 13, 4].forEach((n, i) => { const k = lkK(b(2), .5 + i * .2, .5), [x0, y] = T(i + .15, n), [x1, y0] = T(i + .85, 0); lkRect(x0, y, x1 - x0, y0 - y, k, C.chalk, 2.5, C.chalkFill); lkText('ABCDEFG'[i], (x0 + x1) / 2, 455, 15, C.dim, k, 'center'); });
      const P = chart(890, 160, 340, 280, [0, 3], [0, 1], lkK(b(3), .2, .6), { xl: 'class', title: 'kind="point", hue="sex"' });
      [[[.97, .92, .5], C.red, 'women'], [[.37, .16, .14], C.chalk, 'men']].forEach(([r, col, n], j) => { const pts = r.map((v, i) => P(i + .5, v)), k = lkK(b(3), 1 + j * 1.6, 1); lkLine(pts, k, col, 4, { dash: j ? [10, 8] : null }); pts.forEach(([x, y]) => circle(x, y, 7, { fill: col, stroke: null, alpha: k })); lkText(n, 1240, pts[2][1], 18, col, k, 'left', 700); });
      ['First', 'Second', 'Third'].forEach((c, i) => lkText(c, P(i + .5, 0)[0], 455, 15, C.dim, lkK(b(3), .3, .6), 'center'));
      lkText('slopes reveal an interaction', 1060, 495, 18, C.red, lkK(b(3), 4.4, .7), 'center', 700);
    } },

    { title: 'Regression plots', draw(u, b) {
      const S = chart(70, 160, 360, 280, [0, 52], [0, 10], lkK(b(0), .2, .6), { xl: 'total_bill', yl: 'tip', title: 'sns.lmplot(x=, y=)' });
      lkDots(lkCloud(40, 8, 4, 48, v => .92 + .105 * v, 1).map(([a, c]) => S(a, Math.max(1, c))), lkK(b(0), .8, 1.2), C.chalk, 4);
      const band = [], top = [], bot = []; for (let x = 4; x <= 50; x += 2) { const y = .92 + .105 * x, w = .25 + .0006 * (x - 20) ** 2; top.push(S(x, y + w)); bot.push(S(x, y - w)); band.push(S(x, y)); }
      const kB = lkK(b(0), 3, 1); if (kB > 0) shape([...top, ...bot.reverse()], { fill: C.redFill, stroke: null, alpha: kB }); lkLine(band, kB, C.red, 4);
      lkText('the fit + a 95% band', 250, 490, 18, C.red, lkK(b(0), 4, .7), 'center', 700);
      const T = chart(510, 160, 320, 280, [.5, 6.5], [0, 7], lkK(b(1), .2, .6), { xl: 'size', title: 'x_estimator=np.mean' });
      [2.1, 3.0, 3.4, 4.1, 4.0, 5.2].forEach((m, i) => { const k = lkK(b(1), .8 + i * .3, .5), [x, y] = T(i + 1, m); circle(x, y, 7, { fill: C.chalk, stroke: null, alpha: k }); lkLine([[x, y - 18 - i * 4], [x, y + 18 + i * 4]], k, C.chalk, 2.5); });
      lkLine([T(.8, 1.75), T(6.2, 5.6)], lkK(b(1), 3, .7), C.red, 4);
      ['Lunch', 'Dinner'].forEach((t, j) => { const P = chart(910 + j * 190, 200, 150, 240, [0, 52], [0, 10], lkK(b(2), .2 + j * .5, .6), { title: t });
        lkDots(lkCloud(14, 70 + j, 4, 48, v => .9 + .105 * v, 1).map(([a, c]) => P(a, Math.max(1, c))), lkK(b(2), 1 + j * .5, .8), C.chalk, 3);
        lkLine([P(4, 1.3), P(50, j ? 5.6 : 6.6)], lkK(b(2), 2.4, .6), C.red, 3); lkLine([P(4, 1.6), P(50, j ? 6.4 : 5.4)], lkK(b(2), 2.8, .6), C.dim, 3, { dash: [8, 6] }); });
      lkCode('hue="smoker", col="time"', 1060, 490, 16, C.red, lkK(b(2), .5, .7), 'center');
    } },

    { title: 'When a straight line is not enough', draw(u, b) {
      const ans = [[x => 3 + .5 * x + (hash(x * 3.1) - .5) * 2.2, 'I'], [x => -5.996 + 2.781 * x - .1267 * x * x, 'II'], [x => x === 13 ? 12.74 : 4 + .345 * x, 'III'], [x => 7 + .5 * (hash(x * 7.7) - .5) * 4, 'IV']];
      ans.forEach(([f, n], j) => { const x0 = 50 + j * 160, S = chart(x0, 170, 120, 120, [3, 15], [2, 13], lkK(b(0), .4 + j * .5, .6), { title: n });
        lkDots((n === 'IV' ? [8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 19 - 4] : [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]).map((x, i) => S(n === 'IV' && i === 10 ? 14.5 : x, n === 'IV' ? (i === 10 ? 12.5 : 5.5 + 3.4 * hash(i * 2.2)) : f(x))), lkK(b(0), 1 + j * .5, .7), C.chalk, 3.5);
        lkLine([S(3.5, 3 + .5 * 3.5), S(14.5, 3 + .5 * 14.5)], lkK(b(0), 3 + j * .3, .6), C.red, 2.5); });
      lkRule('same stats, different stories: always plot your data', 340, 380, 600, lkK(b(0), 5, .9), 20);
      // fixes for II and III
      const Q = chart(720, 160, 240, 170, [3, 15], [2, 11], lkK(b(1), .3, .6), { title: 'II · order=2' });
      lkDots([4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map(x => Q(x, ans[1][0](x))), lkK(b(1), .6, .6), C.chalk, 4);
      const curve = []; for (let x = 4; x <= 14; x += .5) curve.push(Q(x, ans[1][0](x))); lkLine(curve, lkK(b(1), 1.2, .9), C.red, 4, { smooth: true });
      const R = chart(1030, 160, 240, 170, [3, 15], [2, 13], lkK(b(1), 3.6, .6), { title: 'III · robust=True' });
      lkDots([4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map(x => R(x, ans[2][0](x))), lkK(b(1), 3.9, .6), C.chalk, 4); lkLoop(R(13, 12.74)[0], R(13, 12.74)[1], 16, 16, lkK(b(1), 4.6, .5)); lkLine([R(3.5, 5.21), R(14.5, 9.0)], lkK(b(1), 5, .7), C.red, 4);
      // residuals of II: the arch
      const E = chart(720, 420, 240, 150, [3, 15], [-2.2, 1.6], lkK(b(2), .3, .6), { title: 'residplot · II' }), lin = x => 3 + .5 * x;
      lkLine([E(3, 0), E(15, 0)], lkK(b(2), .6, .6), C.dim, 2, { dash: [6, 6] }); lkDots([4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map(x => E(x, ans[1][0](x) - lin(x))), lkK(b(2), 1, 1), C.red, 4.5);
      lkText('an arch: ∩', 1060, 470, 22, C.red, lkK(b(2), 4.6, .7), 'left', 700);
      // logistic
      const G = chart(70, 450, 300, 120, [0, 52], [0, 1], lkK(b(3), .3, .6), { title: 'logistic=True' }), lc = []; for (let x = 2; x <= 52; x += 2) lc.push(G(x, 1 / (1 + Math.exp((x - 22) / 7))));
      lkLine(lc, lkK(b(3), .8, 1), C.red, 4, { smooth: true }); lkText('P(tip > 15%) falls with the bill', 420, 520, 19, C.chalk, lkK(b(3), 3.4, .8), 'left', 700);
    } },

    { title: 'Warmup: discovering exoplanets', draw(u, b) {
      const S = chart(80, 170, 1120, 220, [1989, 2015], [0, 140], lkK(b(0), .3, .6), { xl: 'year of discovery', yl: 'planets', xt: [1990, 1995, 2000, 2005, 2010].map(y => [lkScale(80, 170, 1120, 220, [1989, 2015], [0, 1])(y + .5, 0)[0], String(y)]) });
      const counts = [1, 0, 1, 0, 0, 1, 2, 1, 6, 5, 6, 12, 11, 13, 17, 16, 19, 26, 32, 49, 50, 64, 95, 98, 118, 52];
      counts.forEach((n, i) => { const yr = 1989 + i, k = lkK(b(0), 1 + i * .12, .5), [x0, y] = S(yr + .12, n), [x1, y0] = S(yr + .88, 0), tr = yr >= 2009 && b(2) > 1; lkRect(x0, y, x1 - x0, y0 - y, k, tr ? C.red : C.chalk, 2, tr ? C.redFill : C.chalkFill); });
      lkCode('sns.catplot(data=planets, x="year", kind="count", aspect=2)', 80, 470, 18, C.chalk, lkK(b(0), 2, 1));
      lkCode('g.set_xticklabels(step=5)', 80, 505, 18, C.red, lkK(b(1), .6, .8)); lkText('aspect=2: twice as wide as tall', 520, 505, 18, C.dim, lkK(b(1), 2, .8));
      lkLine([S(2009, 0), S(2009, 140)], lkK(b(2), 4, .6), C.red, 2, { dash: [8, 8] }); lkText('Kepler (2009)', S(2009, 140)[0] - 8, 180, 18, C.red, lkK(b(2), 4, .6), 'right', 700);
      lkText('hue="method": the transit method takes over', 660, 565, 22, C.chalk, lkK(b(2), 1, 1), 'center', 700);
    } },

    { title: 'Workout: marathon pacing', draw(u, b) {
      lkTable(40, 120, [{ label: 'age', w: 70, align: 'right' }, { label: 'gender', w: 100 }, { label: 'split', w: 140 }, { label: 'final', w: 140 }], [['33', 'M', '01:05:38', '02:08:51'], ['32', 'M', '01:06:26', '02:09:28'], ['…', '', '', '']],
        { size: 19, rh: 36, kRow: i => lkK(b(0), 1 + (i + 1) * .4, .5) });
      lkText('37,250 runners', 270, 280, 22, C.chalk, lkK(b(0), 3, .7), 'center', 700);
      lkPyLine('pd.to_timedelta(marathon["split"]).dt.total_seconds()', 30, 330, 17, lkK(b(1), .3, 1)); lkCode('→ 3938.0', 400, 365, 19, C.red, lkK(b(1), 3, .6));
      const S = chart(580, 150, 300, 260, [3000, 16000], [6000, 32000], lkK(b(2), .2, .6), { xl: 'split (s)', yl: 'final (s)' });
      lkDots(lkCloud(60, 91, 3600, 12000, v => 2.2 * v, 900).map(([a, c]) => S(a, c)), lkK(b(2), .6, 1), C.chalk, 3);
      lkLine([S(4000, 8000), S(16000, 32000)], lkK(b(2), 2, .7), C.red, 3, { dash: [4, 6] }); lkText('final = 2 × split', 860, 160, 18, C.red, lkK(b(2), 2.4, .7), 'right', 700);
      lkText('nearly everyone slows down', 730, 475, 18, C.dim, lkK(b(2), 5, .8), 'center');
      lkText('split fraction = 1 − 2 × split / final', 1100, 170, 21, C.chalk, lkK(b(3), .3, 1), 'center', 700);
      const H = chart(960, 220, 300, 190, [-.15, .4], [0, 1], lkK(b(3), 2, .6), { xl: 'split fraction' });
      bell(H, lkBell(-.15, .4, [[.13, .06, 1]]), lkK(b(3), 2.4, 1), C.chalk);
      lkLine([H(0, 0), H(0, 1)], lkK(b(3), 3, .6), C.red, 2, { dash: [6, 6] });
      lkText('251 runners (0.7%) < 0', 1110, 475, 19, C.red, lkK(b(3), 5, .8), 'center', 700);
      function bell(Sc, pts, k, col) { if (k <= 0) return; lkLine(pts.map(([x, y]) => Sc(x, y)), k, col, 4, { smooth: true }); }
    } },

    { title: 'Workout: who keeps an even pace?', draw(u, b) {
      const S = chart(70, 160, 300, 220, [7000, 22000], [-.1, .45], lkK(b(0), .2, .6), { xl: 'final (s)', yl: 'split fraction' });
      lkDots(lkCloud(60, 13, 7500, 21000, v => .02 + (v - 7500) / 13500 * .2, .05).map(([a, c]) => S(a, c)), lkK(b(0), .6, 1), C.chalk, 3);
      lkText('faster runners: a more even pace', 220, 430, 18, C.dim, lkK(b(0), 3.4, .8), 'center');
      const K = chart(470, 160, 300, 220, [-.1, .4], [0, 8], lkK(b(1), .2, .6), { xl: 'split fraction', title: 'common_norm=False' });
      const Kpts = (bb) => lkBell(-.1, .4, bb).map(([x, y]) => K(x, y));
      lkLine(Kpts([[.15, .045, 5.6], [.05, .03, 2.6]]), lkK(b(1), .6, 1), C.chalk, 3.5, { smooth: true }); lkLine(Kpts([[.16, .04, 7.6], [.06, .03, 1.2]]), lkK(b(1), 1.4, 1), C.red, 3.5, { smooth: true });
      lkText('men', 560, 240, 18, C.chalk, lkK(b(1), 2, .6), 'center', 700); lkText('women', 700, 190, 18, C.red, lkK(b(1), 2.4, .6), 'center', 700);
      lkText('more men near an even split', 620, 430, 18, C.dim, lkK(b(1), 3.4, .8), 'center');
      const V = chart(870, 160, 380, 220, [0, 6], [-.1, .45], lkK(b(2), .2, .6), { xl: 'age decade', title: 'split violins' });
      [20, 30, 40, 50, 60, 70].forEach((d, i) => { const cx = V(i + .5, 0)[0]; lkText(String(d), cx, 395, 14, C.dim, lkK(b(2), .3, .6), 'center');
        violin(cx, V(0, .35)[1], V(0, -.05)[1], 22, 0, 1, lkK(b(2), .8 + i * .3, .6), C.red, 1); violin(cx, V(0, .33)[1], V(0, -.07)[1], 22, 0, 1.1, lkK(b(2), 1 + i * .3, .6), C.chalk, -1); });
      lkText('80s: only 15 runners', 1060, 430, 18, C.dim, lkK(b(2), 5, .8), 'center');
      lkCode('sns.lmplot(data=marathon, x="final_sec", y="split_frac", col="gender")  ·  g.refline(y=0.1)', 660, 500, 16, C.chalk, lkK(b(3), .4, 1.2), 'center');
      lkRule('finish under ~15,000 s (≈ 4 h 10 min) → split fraction mostly < 0.1', 660, 575, 1120, lkK(b(3), 3.4, .9), 23);
    } },

    { title: 'Summary and course wrap-up', draw(u, b) {
      lkList(100, 160, [
        { text: 'sns.catplot(kind=…): strip · swarm · box · violin · boxen · bar · point · count', mark: 'check', k: lkK(b(1), .2, .9) },
        { text: 'sns.lmplot(): regression fits · order · robust · logistic · x_estimator', mark: 'check', k: lkK(b(1), 4.6, .9) },
        { text: 'sns.residplot(): check the residuals of a linear fit', mark: 'check', k: lkK(b(1), 8, .9) },
      ], { size: 24, gap: 60 });
      pipelineDone(b);
      lkText('Thank you, and congratulations!', 660, 590, 36, C.red, lkK(b(3), 3.4, 1.4), 'center', 700);
    } },
  ];
  // the analytics pipeline, all five stages checked
  function pipelineDone(b) {
    ['Acquire', 'Prepare', 'Explore', 'Model', 'Communicate'].forEach((n, i) => { const k = lkK(b(2), .6 + i * 1.2, .7), x = 70 + i * 240;
      lkRect(x, 380, 200, 70, k, C.red, 4, C.redFill); lkText(n, x + 100, 415, 26, C.chalk, k, 'center', 700); if (i < 4) lkArrow([[x + 206, 415], [x + 234, 415]], k, C.red, 3, { head: 9 }); lkCheck(x + 180, 375, 22, lkK(b(2), 1.2 + i * 1.2, .5), C.chalk); });
    lkText('fifteen modules · the whole analytics pipeline', 660, 495, 24, C.dim, lkK(b(2), 7, 1), 'center');
  }

  lecture({
    footer: 'BUSN 3030E · Module 15 · Categorical Data and Regression Plots',
    panels,
    focus: [{ panel: 7, line: 2, to: 3, rect: [690, 380, 600, 230] }],
  });
})();
