// Scene 62: Python lecture, Module 14 · Relationships and Distributions. The black board takes centre stage; eleven panels
// chalk themselves on in step with the voice-over (asset.js → narration). The charts are chalk sketches of what each
// seaborn call draws. Built with scene 49's lecture_kit.js.
// Board coords: 1320 × 680, y down; the header sits above y 100 and the footer at y 650.
(() => {
  const C = LK;
  // a small chart frame: axes, optional title, returns its scale
  function chart(x, y, w, h, xr, yr, k, o = {}) {
    lkAxes(x, y, w, h, k, { size: 16, ...o });
    if (o.title) lkText(o.title, x + w / 2, y - 22, 18, C.dim, k, 'center');
    return lkScale(x, y, w, h, xr, yr);
  }
  const tipsPts = (n, seed) => lkCloud(n, seed, 4, 48, v => .9 + .105 * v, 1.0).map(([a, c]) => [a, Math.max(1, c)]);
  // a filled bell curve from lkBell points through scale S
  function bell(S, pts, k, col, fill) {
    if (k <= 0) return;
    const P = pts.map(([x, y]) => S(x, y));
    if (fill) shape([S(pts[0][0], 0), ...P, S(pts[pts.length - 1][0], 0)], { fill, stroke: null, alpha: k });
    lkLine(P, k, col, 4, { smooth: true });
  }

  const panels = [
    { title: 'Relationships and Distributions', draw(u, b) {
      lkTitle(u, b, 14, 'Relationships and Distributions', [['scatter and', 'line plots', 1, 2], ['hue · style ·', 'size · facets', 1, 5], ['histograms,', 'KDEs, ECDFs', 2, 1], ['pair plots,', 'labels', 2, 4]]);
    } },

    { title: 'seaborn', draw(u, b) {
      lkCodeBlock(60, 130, 600, ['import seaborn as sns', 'sns.set_theme(style="whitegrid")', 'tips = sns.load_dataset("tips")'], { size: 23, k: lkK(b(0), .2, .6), kLine: i => i === 0 ? lkK(b(0), .6, .8) : lkK(b(1), (i - 1) * 2.6 + .3, .8) });
      lkText('built on matplotlib · speaks DataFrames', 360, 300, 22, C.dim, lkK(b(0), 3, 1), 'center');
      lkText('name the columns → seaborn does the rest', 360, 340, 24, C.red, lkK(b(0), 6, 1), 'center', 700);
      lkTable(700, 140, [{ label: 'total_bill', w: 140, align: 'right' }, { label: 'tip', w: 80, align: 'right' }, { label: 'sex', w: 100 }, { label: 'day', w: 70 }, { label: 'size', w: 70, align: 'right' }],
        [['16.99', '1.01', 'Female', 'Sun', '2'], ['10.34', '1.66', 'Male', 'Sun', '3'], ['21.01', '3.50', 'Male', 'Sun', '3'], ['23.68', '3.31', 'Male', 'Sun', '2']], { size: 18, rh: 36, kRow: i => lkK(b(1), 4 + (i + 1) * .4, .5) });
      lkText('244 restaurant bills', 940, 360, 24, C.chalk, lkK(b(1), 6.4, .8), 'center', 700);
    } },

    { title: 'Scatter plots', draw(u, b) {
      const pts = tipsPts(46, 5), sm = pts.map((p, i) => hash(i * 7.1) < .38);
      const S1 = chart(60, 170, 330, 260, [0, 52], [0, 10], lkK(b(0), .3, .6), { xl: 'total_bill', yl: 'tip' });
      lkDots(pts.map(([a, c]) => S1(a, c)), lkK(b(0), 1, 1.4), C.chalk, 4.5);
      lkCode('relplot(x="total_bill", y="tip")', 60, 500, 16, C.chalk, lkK(b(0), .5, 1));
      const S2 = chart(480, 170, 330, 260, [0, 52], [0, 10], lkK(b(1), .2, .6), { xl: 'total_bill' }), k2 = lkK(b(1), .8, 1.4);
      pts.slice(0, Math.round(k2 * pts.length)).forEach(([a, c], i) => { const [x, y] = S2(a, c); if (sm[i]) lkCross(x, y, 10, 1, C.red); else circle(x, y, 4.5, { fill: C.chalk, stroke: null, alpha: .85 }); });
      lkCode('hue="smoker", style="smoker"', 480, 500, 16, C.red, lkK(b(1), .5, 1));
      const S3 = chart(900, 170, 330, 260, [0, 52], [0, 10], lkK(b(2), .2, .6), { xl: 'total_bill' }), k3 = lkK(b(2), .6, 1.2);
      pts.slice(0, Math.round(k3 * pts.length)).forEach(([a, c], i) => { const [x, y] = S3(a, c), sz = 1 + Math.floor(hash(i * 3.7) * 5); circle(x, y, 2 + sz * 1.6, { fill: sz > 3 ? C.redFill : null, stroke: sz > 3 ? C.red : C.chalk, lw: 1.5, alpha: .9 }); });
      lkCode('hue="size", size="size"', 900, 500, 16, C.red, lkK(b(2), .4, 1));
      lkRule('Less is more: 2–3 variables per plot', 660, 580, 680, lkK(b(2), 4.4, .9), 24);
    } },

    { title: 'Line plots', draw(u, b) {
      const S = chart(80, 170, 500, 300, [1949, 1960], [100, 620], lkK(b(0), .3, .6), { xl: 'year', yl: 'passengers (thousands)' });
      const mean = y => 126 * Math.pow(1.12, y - 1949), kL = lkK(b(1), .2, 1.4), band = [], top = [], bot = [];
      for (let y = 1949; y <= 1960; y++) { top.push(S(y, mean(y) * 1.16)); bot.push(S(y, mean(y) * .86)); band.push(S(y, mean(y))); }
      if (kL > 0) shape([...top, ...bot.reverse()], { fill: C.redFill, stroke: null, alpha: kL });
      lkLine(band, kL, C.red, 5, { smooth: true });
      lkText('mean ± 95% CI', 470, 220, 20, C.red, lkK(b(1), 2, .7), 'center', 700);
      lkCode('sns.relplot(data=flights, x="year", y="passengers", kind="line")', 40, 540, 15.5, C.chalk, lkK(b(0), 1, 1.2));
      const S2 = chart(720, 170, 500, 300, [1949, 1960], [100, 620], lkK(b(2), .2, .6), { xl: 'year' });
      for (let m = 0; m < 12; m++) {
        const amp = .78 + .4 * Math.exp(-((m - 6.5) ** 2) / 4), pts = []; for (let y = 1949; y <= 1960; y++) pts.push(S2(y, mean(y) * amp));
        lkLine(pts, lkK(b(2), .8 + m * .25, .8), m === 6 || m === 7 ? C.red : C.dim, m === 6 || m === 7 ? 4 : 2, { smooth: true });
      }
      lkText('Jul, Aug', 1230, S2(1960, mean(1960) * 1.18)[1], 18, C.red, lkK(b(2), 4, .6), 'right', 700);
      lkCode('hue="month"', 720, 540, 18, C.red, lkK(b(2), .4, .8));
    } },

    { title: 'Small multiples and labels', draw(u, b) {
      ['Lunch', 'Dinner'].forEach((t, j) => { const S = chart(60 + j * 300, 170, 240, 200, [0, 52], [0, 10], lkK(b(0), .4 + j * .3, .6), { title: 'time = ' + t });
        lkDots(tipsPts(j ? 30 : 18, 9 + j).map(([a, c]) => S(a, c)), lkK(b(0), 1.4 + j * .5, 1), C.chalk, 4); });
      lkCode('col="time"', 60, 430, 18, C.red, lkK(b(0), 1, .6)); lkText('shared axes → easy comparison', 370, 470, 20, C.dim, lkK(b(0), 4, .8), 'center');
      lkCode('col="day", col_wrap=2, height=3, aspect=1.2', 60, 520, 17, C.chalk, lkK(b(1), .3, 1));
      // a labelled figure
      const kF = lkK(b(2), .2, .6); lkText('Tips rise with the size of the bill', 990, 160, 24, C.chalk, lkK(b(2), 3, 1), 'center', 700);
      const S = chart(800, 210, 380, 230, [0, 52], [0, 10], kF, { xl: 'Total bill ($)', yl: 'Tip ($)' });
      lkDots(tipsPts(36, 21).map(([a, c]) => S(a, c)), kF, C.chalk, 4);
      lkCodeBlock(700, 500, 580, ['g = sns.relplot(data=tips, x="total_bill", y="tip")', 'g.set_axis_labels("Total bill ($)", "Tip ($)")', 'g.figure.suptitle("Tips rise with the size of the bill")'],
        { size: 15, lh: 26, k: lkK(b(2), .4, .6), kLine: i => lkK(b(2), 1 + i * 1, .7) });
    } },

    { title: 'Histograms', draw(u, b) {
      const hist = (S, k, col, bump, w = 3) => { for (let x = 172; x < 232; x += w) { const v = bump(x + w / 2); const [x0, y0] = S(x, v), [x1, yb] = S(x + w, 0); lkRect(x0 + 1, y0, x1 - x0 - 2, yb - y0, k, col, 2, col === C.chalk ? C.chalkFill : C.redFill); } };
      const all = x => 34 * Math.exp(-.5 * ((x - 190) / 6.5) ** 2) + 28 * Math.exp(-.5 * ((x - 217) / 6) ** 2);
      const S = chart(70, 170, 480, 270, [170, 235], [0, 40], lkK(b(0), .4, .6), { xl: 'flipper_length_mm' });
      hist(S, lkK(b(0), 1.2, 1.2), C.chalk, all, b(2) > 0 ? 3 : 4);
      lkText('two peaks: bimodal', 310, 160, 22, C.red, lkK(b(1), .4, .7), 'center', 700);
      lkCode('sns.displot(data=penguins, x="flipper_length_mm")', 40, 500, 16, C.chalk, lkK(b(0), .3, 1)); lkCode('binwidth=3', 40, 535, 18, C.red, lkK(b(2), .4, .7)); lkText('check a few bin sizes', 200, 535, 20, C.dim, lkK(b(2), 1.2, .7));
      const S2 = chart(700, 170, 520, 270, [170, 235], [0, 40], lkK(b(3), .2, .6), { xl: 'flipper_length_mm' });
      [[x => 34 * Math.exp(-.5 * ((x - 190) / 6.5) ** 2), C.chalk, 'Adelie'], [x => 12 * Math.exp(-.5 * ((x - 196) / 7) ** 2), C.dim, 'Chinstrap'], [x => 28 * Math.exp(-.5 * ((x - 217) / 6) ** 2), C.red, 'Gentoo']].forEach(([f, col, n], i) => {
        const k = lkK(b(3), .8 + i * 1, .8), pts = []; for (let x = 172; x <= 234; x += 3) pts.push([x, f(x)]);
        const P = []; pts.forEach(([x, y]) => { P.push(S2(x - 1.5, y)); P.push(S2(x + 1.5, y)); }); lkLine(P, k, col, 3); lkText(n, 1230, 200 + i * 30, 19, col, k, 'right', 700); });
      lkCode('hue="species", element="step"', 700, 500, 17, C.red, lkK(b(3), .5, .8)); lkText('multiple="stack" · stat="density", common_norm=False', 700, 535, 17, C.dim, lkK(b(3), 4, 1));
    } },

    { title: 'Density curves and ECDFs', draw(u, b) {
      const S = chart(60, 170, 360, 230, [170, 235], [0, 1.1], lkK(b(0), .3, .6), { xl: 'flipper length', title: 'kind="kde"' });
      [[[[190, 6.5, 1]], C.chalk, 'rgba(246,246,242,.10)'], [[[196, 7, .55]], C.dim, null], [[[217, 6, .9]], C.red, C.redFill]].forEach(([bb, col, fill], i) => bell(S, lkBell(170, 235, bb), lkK(b(0), 1 + i * .8, 1), col, fill));
      const S2 = chart(500, 170, 340, 230, [-10, 52], [0, 1], lkK(b(1), .3, .6), { xl: 'total_bill', title: 'pitfall' });
      bell(S2, lkBell(-10, 52, [[18, 8, .95]]), lkK(b(1), 1, 1), C.chalk);
      lkLine([S2(0, 0), S2(0, 1)], lkK(b(1), 3, .6), C.red, 2, { dash: [6, 6] }); lkText('$0', S2(0, 0)[0], 425, 16, C.red, lkK(b(1), 3, .6), 'center');
      lkLoop(S2(-4, .1)[0], S2(-4, .1)[1], 26, 22, lkK(b(1), 4, .6));
      lkText('negative bills?!', 670, 455, 19, C.red, lkK(b(1), 4.4, .7), 'center', 700); lkCode('bw_adjust · cut=0 · kde=True', 670, 490, 16, C.dim, lkK(b(1), 6, .8), 'center');
      const S3 = chart(920, 170, 330, 230, [170, 235], [0, 1], lkK(b(2), .2, .6), { xl: 'flipper length', title: 'kind="ecdf"' });
      [[190, 6.5, C.chalk], [196, 7, C.dim], [217, 6, C.red]].forEach(([mu, sd, col], i) => { const pts = []; for (let x = 170; x <= 235; x += 1.5) pts.push(S3(x, .5 * (1 + Math.tanh((x - mu) / (sd * 1.2))))); lkLine(pts, lkK(b(2), .8 + i * .6, .9), col, 3); });
      lkLine([S3(170, .5), S3(235, .5)], lkK(b(2), 4, .6), C.red, 2, { dash: [6, 6] }); lkText('0.5 → the median', 1085, 455, 19, C.red, lkK(b(2), 4.4, .7), 'center', 700);
      lkText('no bins, no bandwidth', 1085, 490, 18, C.dim, lkK(b(2), 2.4, .7), 'center');
      lkText('smooth curves: easy to compare groups', 240, 455, 19, C.dim, lkK(b(0), 3.6, .8), 'center');
    } },

    { title: 'Many variables at once', draw(u, b) {
      // jointplot: scatter with marginals
      const k1 = lkK(b(0), .3, .7), S = chart(70, 220, 300, 230, [32, 60], [13, 22], k1, { xl: 'bill_length', yl: 'bill_depth' });
      [[39, 18.3, C.chalk], [48, 18.4, C.dim], [47.5, 15, C.red]].forEach(([mx, my, col], j) => lkCloud(16, 30 + j * 7, mx - 4, mx + 4, () => my, .7).forEach(([a, c], i) => { if (i / 16 < lkK(b(0), 1 + j * .5, .8)) { const [x, y] = S(a, c); circle(x, y, 4, { fill: col, stroke: null, alpha: .85 }); } }));
      const kM = lkK(b(0), 3, .8); bell(lkScale(70, 150, 300, 60, [32, 60], [0, 1.2]), lkBell(32, 60, [[39, 2.5, .9], [48, 3, .6]]), kM, C.dim);
      lkCode('sns.jointplot(…)', 70, 520, 18, C.chalk, kM);
      // pairplot: a 3×3 grid
      const g = 3, cs = 110, gx = 470, gy = 150, kP = lkK(b(1), .2, .6);
      for (let r = 0; r < g; r++) for (let c = 0; c < g; c++) { const x = gx + c * cs, y = gy + r * cs, k = lkK(b(1), .4 + (r * g + c) * .15, .5); lkRect(x, y, cs - 10, cs - 10, k, C.faint, 2);
        if (r === c) bell(lkScale(x + 6, y + 10, cs - 22, cs - 30, [0, 1], [0, 1.1]), lkBell(0, 1, [[.4 + .1 * r, .15, 1]]), k, C.red);
        else lkDots(lkCloud(14, r * 5 + c, 0, 1, v => (r + c) % 2 ? v : 1 - v, .15).map(([a, cc]) => [x + 8 + a * (cs - 26), y + cs - 18 - clamp(cc) * (cs - 30)]), k, C.chalk, 2.5); }
      lkCode('sns.pairplot(…)', 470, 520, 18, C.chalk, kP);
      const rows = [['two numeric', 'relplot(x=, y=)'], ['over time', 'kind="line"'], ['one variable', 'displot(x=)'], ['groups', 'hue= · col= · row='], ['a new dataset', 'pairplot(data)']];
      rows.forEach(([q, p], i) => { const k = lkK(b(2), .4 + i * 1.3, .6), y = 170 + i * 66; lkText(q, 830, y, 21, C.chalk, k, 'left', 700); lkCode(p, 1000, y, 18, C.red, k); });
    } },

    { title: 'Warmup: Gapminder', draw(u, b) {
      const pts = lkCloud(60, 41, 0, 1, () => 0, 0).map(([a], i) => { const g = Math.exp(5.6 + 5 * a), le = 30 + 9.5 * Math.log(g / 300) + 6 * (hash(i * 4.3) - .5); return [g, Math.min(82, Math.max(25, le))]; });
      const S = chart(70, 170, 330, 250, [0, 50000], [20, 85], lkK(b(0), .3, .6), { xl: 'gdpPercap', yl: 'lifeExp' });
      lkDots(pts.map(([g, l]) => S(Math.min(g, 50000), l)), lkK(b(0), 1, 1.2), C.chalk, 4); lkText('crowded on the left', 235, 500, 19, C.red, lkK(b(0), 4, .7), 'center', 700);
      const L = chart(480, 170, 330, 250, [5.6, 10.8], [20, 85], lkK(b(1), .2, .6), { xl: 'gdpPercap (log scale)' });
      lkDots(pts.map(([g, l]) => L(Math.log(g), l)), lkK(b(1), .6, 1.2), C.chalk, 4); lkCode('g.set(xscale="log")', 480, 500, 17, C.red, lkK(b(1), 1.6, .8));
      const kB = lkK(b(2), .3, .8), B = chart(890, 170, 330, 250, [5.6, 10.8], [35, 85], kB, { xl: '2007 · size = pop' });
      pts.slice(0, 26).forEach(([g, l], i) => { const k = lkK(b(2), .6 + i * .08, .5); const [x, y] = B(Math.log(g), Math.max(38, l)); circle(x, y, 4 + 20 * hash(i * 9.1) ** 3, { fill: i % 5 === 0 ? C.redFill : 'rgba(246,246,242,.08)', stroke: i % 5 === 0 ? C.red : C.chalk, lw: 1.5, alpha: k }); });
      lkText('the Gapminder bubble chart', 1055, 500, 19, C.chalk, lkK(b(2), 3, .8), 'center', 700);
      lkText('life expectancy rose on every continent; Africa stalled in the 1990s', 660, 560, 21, C.dim, lkK(b(2), 7, 1.2), 'center');
    } },

    { title: 'Workout: insurance charges', draw(u, b) {
      // three bands of charges against age
      const S = chart(70, 170, 340, 260, [18, 64], [0, 64000], lkK(b(0), .4, .6), { xl: 'age', yl: 'charges' });
      [[a => 2000 + 260 * a, C.chalk, 22], [a => 14000 + 260 * a, C.dim, 10], [a => 26000 + 280 * a, C.red, 16]].forEach(([f, col, n], j) => lkDots(lkCloud(n, 50 + j, 18, 64, f, 1500).map(([a, c]) => S(a, c)), lkK(b(0), 1.4 + j * .7, .9), col, 4));
      lkText('three bands; smokers (red) on top', 240, 500, 19, C.red, lkK(b(0), 4, .8), 'center', 700);
      const T = chart(500, 170, 360, 260, [16, 50], [0, 64000], lkK(b(1), .2, .6), { xl: 'bmi', yl: '' });
      lkDots(lkCloud(30, 61, 16, 50, () => 9000, 3500).map(([a, c]) => T(a, c)), lkK(b(1), .6, .9), C.chalk, 4);
      lkDots(lkCloud(14, 62, 16, 30, () => 21000, 2500).map(([a, c]) => T(a, c)), lkK(b(1), 2, .7), C.red, 4.5); lkDots(lkCloud(14, 63, 30, 50, () => 41000, 3500).map(([a, c]) => T(a, c)), lkK(b(1), 3, .7), C.red, 4.5);
      lkLine([T(30, 0), T(30, 62000)], lkK(b(1), 4.6, .6), C.red, 2, { dash: [8, 8] }); lkText('BMI 30', T(30, 0)[0], 165, 18, C.red, lkK(b(1), 4.6, .6), 'center', 700);
      lkText('smokers jump at BMI 30', 680, 500, 19, C.chalk, lkK(b(1), 5.4, .8), 'center', 700);
      lkText('same for women and men', 1080, 220, 22, C.chalk, lkK(b(2), .4, .8), 'center', 700);
      lkText('(sex not significant in Module 13)', 1080, 255, 18, C.dim, lkK(b(2), 1.6, .8), 'center');
      lkRule('an interaction', 1080, 350, 300, lkK(b(2), 5, .9), 26);
      lkText('the effect of BMI depends on smoking', 1080, 420, 19, C.dim, lkK(b(2), 6.4, .8), 'center');
    } },

    { title: 'Summary', draw(u, b) {
      const rows = [['sns.relplot()', 'scatter or line plots', 'hue  style  size  col  row  kind="line"', 1, .2], ['sns.displot()', 'histograms, KDEs, ECDFs', 'binwidth  bins  discrete  kind  multiple  stat', 2, .2],
        ['sns.jointplot()', 'bivariate + marginals', 'kind  hue', 2, 2.6], ['sns.pairplot()', 'all pairwise relationships', 'hue  vars  height', 2, 4], ['grid methods', 'labels and scales', 'g.set_axis_labels()  g.set(xscale="log")', 3, .3]];
      lkTable(50, 120, [{ label: 'Function', w: 250, col: C.red }, { label: 'Draws', w: 330, mono: false }, { label: 'Key options', w: 640, col: C.chalk }], rows.map(r => r.slice(0, 3)),
        { size: 19, rh: 62, kRow: i => i < 0 ? lkK(b(0), .2, .6) : lkK(b(rows[i][3]), rows[i][4], .6) });
      lkText('Next: the Module 14 drill  →  Module 15: Categorical data and regression plots', 660, 600, 24, C.red, lkK(b(3), 3, 1), 'center', 700);
    } },
  ];

  lecture({
    footer: 'BUSN 3030E · Module 14 · Relationships and Distributions',
    panels,
    focus: [{ panel: 10, line: 1, to: 2, rect: [440, 140, 460, 360] }],
  });
})();
