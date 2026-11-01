// Scene 60: Python lecture, Module 12 · DataFrame and Series. The black board takes centre stage; ten panels chalk
// themselves on in step with the voice-over (asset.js → narration). Built with scene 49's lecture_kit.js.
// Board coords: 1320 × 680, y down; the header sits above y 100 and the footer at y 650.
(() => {
  const C = LK;
  const res = (code, out, x, y, k, size = 24, ox) => { lkPyLine(code, x, y, size, k); if (out !== '') lkCode('→ ' + out, ox ?? x + lkMeasure(code, size, 500, LK_MONO) + 24, y, size, C.red, k); };
  const seq = (b, line, d0, step) => i => lkK(b(line), d0 + i * step, .6);
  const POP = [['California', '39431263'], ['Texas', '31290831'], ['Florida', '23372215'], ['New York', '19867248'], ['Pennsylvania', '13078751']];
  // a Series drawn as index | values
  function series(x, y, rows, k, o = {}) {
    const rh = o.rh ?? 38, size = o.size ?? 21, iw = o.iw ?? 170, vw = o.vw ?? 140;
    rows.forEach(([i, v], j) => { const kk = typeof k === 'function' ? k(j) : k, yy = y + j * rh, hl = o.hl?.(j);
      if (hl && kk > 0) lkRect(x - 6, yy - rh / 2 + 2, iw + vw + 12, rh - 4, kk, C.red, 3, C.redFill);
      lkCode(i, x, yy, size, o.idxCol ?? C.dim, kk); lkCode(v, x + iw + vw, yy, size, C.chalk, kk, 'right'); });
    if (o.label) lkText(o.label, x, y + rows.length * rh, 18, C.faint, typeof k === 'function' ? k(rows.length - 1) : k);
  }

  const panels = [
    { title: 'DataFrame and Series', draw(u, b) {
      lkTitle(u, b, 12, 'DataFrame and Series', [['Series and', 'DataFrames', 1, .6], ['.loc and', '.iloc', 1, 3.4], ['filter and', 'add columns', 1, 5.4], ['load and', 'inspect data', 2, .4]]);
    } },

    { title: 'Meet pandas', draw(u, b) {
      lkText('Module 11: a loop for every question…', 660, 150, 26, C.dim, lkK(b(0), .3, 1.4), 'center');
      const kS = lkK(b(2), .3, .9);
      lkText('Series', 300, 230, 40, C.red, kS, 'center', 700); lkText('one column with labels', 300, 280, 22, C.chalk, kS, 'center');
      series(190, 340, [['0', '0.25'], ['1', '0.50'], ['2', '0.75'], ['3', '1.00']], kS, { iw: 80, vw: 140 });
      lkRect(285, 318, 135, 160, kS, C.chalk, 3);
      const kD = lkK(b(2), 3.6, .9);
      lkText('DataFrame', 900, 230, 40, C.red, kD, 'center', 700); lkText('a table of Series sharing row labels', 900, 280, 22, C.chalk, kD, 'center');
      [0, 1, 2].forEach(c => lkRect(760 + c * 110, 318, 100, 160, kD, C.chalk, 3)); ['index', 'a', 'b', 'c'].forEach((h, i) => lkCode(h, i ? 700 + i * 110 + 10 : 700, 305, 18, C.dim, kD, i ? 'center' : 'right'));
      lkCode('import pandas as pd', 660, 570, 34, C.chalk, lkK(b(3), .2, .9), 'center');
    } },

    { title: 'Series', draw(u, b) {
      lkCode('data = pd.Series([0.25, 0.5, 0.75, 1.0])', 40, 145, 21, C.chalk, lkK(b(0), .2, 1));
      series(80, 200, [['0', '0.25'], ['1', '0.50'], ['2', '0.75'], ['3', '1.00']], lkK(b(0), 1.4, .6), { iw: 60, vw: 120, label: 'dtype: float64' });
      lkText('index', 80, 375, 20, C.red, lkK(b(0), 3, .6), 'left', 700); lkText('values', 230, 375, 20, C.red, lkK(b(0), 3, .6), 'left', 700);
      res('data.index', 'RangeIndex(start=0, stop=4, step=1)', 40, 440, lkK(b(0), 6, .8), 19);
      lkCodeBlock(585, 125, 700, ['population = pd.Series({', '    "California": 39_431_263, "Texas": 31_290_831,', '    "Florida": 23_372_215, "New York": 19_867_248,', '    "Pennsylvania": 13_078_751})'],
        { size: 18, lh: 30, k: lkK(b(1), .2, .6), kLine: seq(b, 1, .5, .6) });
      series(640, 300, POP, j => lkK(b(1), 3 + j * .3, .5), { size: 21, label: 'dtype: int64' });
      lkText('keys → index', 1110, 360, 22, C.red, lkK(b(1), 4.6, .6), 'left', 700); lkText('2024 Census estimates', 1110, 400, 18, C.faint, lkK(b(1), 5, .6));
    } },

    { title: 'Selecting: .loc and .iloc', draw(u, b) {
      const sl = b(1) > 0 && b(1) < 4.4 ? [1, 3] : b(1) >= 4.4 && b(2) < 0 ? [1, 2] : null;
      series(60, 150, POP, lkK(b(0), .2, .6), { size: 21, hl: j => sl && j >= sl[0] && j <= sl[1] });
      POP.forEach((p, j) => lkCode(String(j), 40, 150 + j * 38, 17, C.red, lkK(b(0), 3, .6), 'right'));
      lkText('position', 30, 345, 16, C.red, lkK(b(0), 3, .6), 'left');
      res('population.loc["Texas"]', '31290831', 480, 160, lkK(b(0), 1.4, .7), 22); res('population.iloc[1]', '31290831', 480, 205, lkK(b(0), 3.4, .7), 22);
      lkText('.loc = label · .iloc = position', 480, 250, 22, C.red, lkK(b(0), 4.4, .7), 'left', 700);
      res('population.loc["Texas":"New York"]', '3 states: end included', 480, 310, lkK(b(1), 2, .8), 22);
      res('population.iloc[1:3]', '2 states: end excluded', 480, 355, lkK(b(1), 4.6, .8), 22);
      lkCodeBlock(40, 420, 760, ['population[0]', { err: 'KeyError: 0     (pandas 3: [int] is always a label)' }], { size: 21, k: lkK(b(2), .2, .6), kLine: seq(b, 2, .5, 1.6) });
      lkRule('.loc for labels · .iloc for positions', 1030, 470, 440, lkK(b(2), 7, .9), 22);
    } },

    { title: 'Vectorized operations and masks', draw(u, b) {
      lkCode('population / area', 60, 150, 26, C.chalk, lkK(b(1), .3, .8));
      const area = [['Texas', '261232'], ['California', '155779'], ['Florida', '53625'], ['Pennsylvania', '44743'], ['New York', '47126']];
      series(60, 200, area, lkK(b(1), 1, .6), { size: 18, rh: 32, iw: 150, vw: 90 });
      lkArrow([[330, 260], [380, 260]], lkK(b(1), 3, .5), C.red, 4);
      series(400, 200, [['California', '253.1'], ['Florida', '435.8'], ['New York', '421.6'], ['Pennsylvania', '292.3'], ['Texas', '119.8']], lkK(b(1), 3.4, .6), { size: 18, rh: 32, iw: 150, vw: 80, label: 'matched by label' });
      lkText('no loop: every value at once', 60, 395, 21, C.dim, lkK(b(0), .3, .9));
      res('population > 20_000_000', 'True / False per state', 700, 160, lkK(b(2), .4, .8), 20);
      res('population[population > 20_000_000]', 'CA, TX, FL', 700, 210, lkK(b(2), 3.4, .8), 20);
      lkText('a Boolean mask keeps the True rows', 700, 255, 20, C.red, lkK(b(2), 5, .7), 'left', 700);
      [['&', 'and'], ['|', 'or'], ['~', 'not']].forEach(([o, w], i) => { const k = lkK(b(3), .6 + i * .6, .5); lkCode(o, 720 + i * 170, 330, 34, C.red, k); lkText(w, 755 + i * 170, 330, 24, C.chalk, k); });
      lkPyLine('population[(population > 15_000_000) & (density > 300)]', 520, 430, 19, lkK(b(3), 3, 1)); lkCode('→ Florida, New York', 900, 470, 20, C.red, lkK(b(3), 5, .7));
      lkText('parentheses around each condition', 900, 510, 20, C.dim, lkK(b(3), 6, .7), 'center');
    } },

    { title: 'DataFrames', draw(u, b) {
      lkCode('states = pd.DataFrame({"population": population, "area": area})', 40, 145, 20, C.chalk, lkK(b(0), .3, 1.2));
      const dens = ['253.123097', '435.845501', '421.577219', '292.308316', '119.781769'], showD = b(2) > 4;
      lkTable(60, 180, [{ label: '', w: 190, col: C.dim }, { label: 'population', w: 170, align: 'right' }, { label: 'area', w: 120, align: 'right' }, ...(showD ? [{ label: 'density', w: 170, align: 'right' }] : [])],
        [['California', '39431263', '155779', dens[0]], ['Florida', '23372215', '53625', dens[1]], ['New York', '19867248', '47126', dens[2]], ['Pennsylvania', '13078751', '44743', dens[3]], ['Texas', '31290831', '261232', dens[4]]].map(r => showD ? r : r.slice(0, 3)),
        { size: 19, rh: 36, kRow: i => lkK(b(0), 1.6 + (i + 1) * .3, .5) });
      lkText('index', 70, 420, 18, C.red, lkK(b(1), .4, .5), 'left', 700); lkText('columns', 360, 165, 18, C.red, lkK(b(1), 1.6, .5), 'left', 700);
      res('states.shape', '(5, 2)', 840, 200, lkK(b(1), 3.6, .7), 22);
      res('states["area"]', 'a Series', 840, 260, lkK(b(2), .4, .7), 22); res('states[["area"]]', 'a DataFrame', 840, 305, lkK(b(2), 2, .7), 22);
      lkCodeBlock(40, 470, 940, ['states["density"] = states["population"] / states["area"]'], { size: 21, k: lkK(b(2), 3.6, .6), kLine: () => lkK(b(2), 3.8, 1) });
    } },

    { title: 'Selecting rows, cells, and filtering', draw(u, b) {
      lkCode('df.loc[rows, columns]    df.iloc[i, j]    : means "all"', 660, 150, 24, C.chalk, lkK(b(0), .3, 1.2), 'center');
      [['states.loc["Florida"]', 'one row (a Series)'], ['states.loc["Florida", "density"]', '435.845…'], ['states.loc[["Texas", "Florida"], ["population", "area"]]', 'a smaller table'], ['states.iloc[:2, :2]', 'first two rows and columns']]
        .forEach(([c, r], i) => { const k = lkK(b(1), .3 + i * 1.6, .7), y = 220 + i * 48; lkPyLine(c, 60, y, 21, k); lkCode('→ ' + r, 800, y, 20, C.red, k); });
      lkPyLine('states[states["density"] > 300].sort_values("density", ascending=False)', 40, 440, 19, lkK(b(2), .4, 1.2));
      lkTable(160, 470, [{ label: '', w: 160, col: C.dim }, { label: 'population', w: 170, align: 'right' }, { label: 'area', w: 110, align: 'right' }, { label: 'density', w: 160, align: 'right', col: C.red }],
        [['Florida', '23372215', '53625', '435.845501'], ['New York', '19867248', '47126', '421.577219']], { size: 19, rh: 36, kRow: i => lkK(b(2), 2.4 + (i + 1) * .4, .5) });
    } },

    { title: 'Avoid chained assignment', draw(u, b) {
      lkCodeBlock(40, 130, 760, ['states["area"]["Florida"] = 54_000   # chained: don\'t'], { size: 22, k: lkK(b(0), 1, .6), kLine: () => lkK(b(0), 1.4, 1) });
      lkCross(850, 160, 40, lkK(b(0), 6, .5));
      lkCode('ChainedAssignmentError: … never works to update the original …', 40, 230, 18, C.red, lkK(b(1), .2, 1));
      // copy-on-write sketch
      const kC = lkK(b(1), 2, .8);
      lkRect(80, 290, 220, 140, kC, C.chalk, 3); lkText('states', 190, 320, 22, C.chalk, kC, 'center', 700); lkCode('53625', 190, 380, 26, C.chalk, kC, 'center');
      lkArrow([[310, 360], [420, 360]], lkK(b(1), 3, .6), C.dim, 3, { dash: [8, 8] }); lkText('a copy', 365, 335, 18, C.dim, lkK(b(1), 3, .6), 'center');
      lkRect(440, 290, 220, 140, lkK(b(1), 3.4, .7), C.red, 3, C.redFill); lkText('temporary', 550, 320, 22, C.chalk, lkK(b(1), 3.4, .7), 'center', 700); lkCode('54000', 550, 380, 26, C.red, lkK(b(1), 4.4, .7), 'center');
      lkText('Copy-on-Write (pandas 3): the original is unchanged', 370, 470, 21, C.dim, lkK(b(1), 6, .9), 'center');
      lkCodeBlock(720, 290, 560, ['states.loc["Florida", "area"] = 54_000', 'states.loc["Florida", "area"]', { out: '54000' }], { size: 20, k: lkK(b(2), .3, .6), kLine: seq(b, 2, 1, 1.2) });
      lkCheck(1240, 330, 34, lkK(b(2), 3, .5), C.red);
      lkRule('One step: df.loc[row, column] = value', 660, 575, 800, lkK(b(2), 4.6, .9), 26);
    } },

    { title: 'Loading and exploring Gapminder', draw(u, b) {
      lkCode('gapminder = pd.read_csv(DATA_URL + "gapminder.tsv", sep="\\t")', 40, 140, 20, C.chalk, lkK(b(0), .3, 1.2));
      lkText('142 countries · 1952–2007 · life expectancy, population, GDP per capita', 40, 180, 19, C.dim, lkK(b(0), 4, 1.2));
      lkCodeBlock(40, 210, 520, ['gapminder.info()', { out: 'RangeIndex: 1704 entries' }, { out: 'country    1704 non-null  str' }, { out: 'year       1704 non-null  int64' }, { out: 'lifeExp    1704 non-null  float64' }],
        { size: 18, lh: 30, k: lkK(b(1), .2, .6), kLine: seq(b, 1, .4, .7) });
      lkText('pandas 3: text is str (pandas 2: object)', 40, 408, 19, C.dim, lkK(b(1), 4.4, .8));
      lkCodeBlock(600, 210, 680, ['latest = gapminder[gapminder["year"] == 2007]', 'latest.sort_values("lifeExp", ascending=False).head(5)'], { size: 18, lh: 30, k: lkK(b(2), .2, .6), kLine: seq(b, 2, .5, 1.2) });
      [['Japan', '82.6'], ['Hong Kong, China', '82.2'], ['Iceland', '81.8'], ['Switzerland', '81.7'], ['Australia', '81.2']].forEach(([c, v], i) => { const k = lkK(b(2), 3 + i * .5, .5), y = 310 + i * 32; lkText(c, 640, y, 21, C.chalk, k); lkCode(v, 960, y, 21, C.red, k, 'right'); });
      res('gapminder["year"].isin([1952, 2007])', 'US GDP ×5.9 in real terms', 40, 500, lkK(b(3), .4, .9), 20);
      lkText('$2,204 B (1952)  →  $12,934 B (2007)', 400, 560, 24, C.chalk, lkK(b(3), 3, .9), 'center', 700);
    } },

    { title: 'Summary', draw(u, b) {
      const rows = [['Create', 'pd.Series(list_or_dict)   pd.DataFrame({"col": series})', 1, .2], ['Inspect', '.head()  .tail()  .shape  .info()  .index  .columns', 1, 3], ['Select columns', 'df["col"]   df[["col1", "col2"]]', 2, .2],
        ['By label / position', 'df.loc[row, col]   df.iloc[i, j]', 2, 2.4], ['Filter rows', 'df[df["col"] > value]   & | ~', 2, 4.6], ['Sort', 'df.sort_values("col", ascending=False)', 2, 6.4], ['Add / change', 'df["new"] = …   df.loc[row, "col"] = value', 3, .3], ['Load', 'pd.read_csv(url, sep=…)', 3, 3]];
      lkTable(90, 115, [{ label: 'Task', w: 280, mono: false }, { label: 'Code', w: 870, col: C.chalk }], rows.map(r => [r[0], r[1]]), { size: 21, rh: 50, kRow: i => i < 0 ? lkK(b(0), .2, .6) : lkK(b(rows[i][2]), rows[i][3], .6) });
      lkText('Next: the Module 12 drill  →  Module 13: Statistics and regression', 660, 612, 25, C.red, lkK(b(3), 4.4, 1), 'center', 700);
    } },
  ];

  lecture({
    footer: 'BUSN 3030E · Module 12 · DataFrame and Series',
    panels,
    focus: [{ panel: 4, line: 1, to: 2, rect: [40, 130, 900, 260] }],
  });
})();
