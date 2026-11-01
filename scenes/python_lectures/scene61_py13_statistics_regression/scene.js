// Scene 61: Python lecture, Module 13 · Statistics and Regression. The black board takes centre stage; eleven panels chalk
// themselves on in step with the voice-over (asset.js → narration). Built with scene 49's lecture_kit.js.
// Board coords: 1320 × 680, y down; the header sits above y 100 and the footer at y 650.
(() => {
  const C = LK;
  const res = (code, out, x, y, k, size = 24, ox) => { lkPyLine(code, x, y, size, k); if (out !== '') lkCode('→ ' + out, ox ?? x + lkMeasure(code, size, 500, LK_MONO) + 24, y, size, C.red, k); };
  const seq = (b, line, d0, step) => i => lkK(b(line), d0 + i * step, .6);

  const panels = [
    { title: 'Statistics and Regression', draw(u, b) {
      lkTitle(u, b, 13, 'Statistics and Regression', [['describe', 'variables', 1, .6], ['compare groups,', 'correlation', 1, 3], ['linear', 'regression', 2, 1], ['logistic', 'regression', 2, 3]]);
    } },

    { title: 'Describing numeric variables', draw(u, b) {
      lkText('1,338 policyholders', 60, 145, 28, C.chalk, lkK(b(0), 3, .8), 'left', 700);
      ['age', 'sex', 'bmi', 'children', 'smoker', 'region', 'charges'].forEach((c, i) => { const k = lkK(b(1), .3 + i * .5, .5), x = 420 + i * 125; lkRect(x - 55, 128, 110, 36, k, i === 6 ? C.red : C.faint, 2.5); lkCode(c, x, 146, 18, C.chalk, k, 'center'); });
      lkPyLine('insurance.describe().round(2)', 60, 210, 22, lkK(b(2), .2, .8));
      const rows = [['count', '1338', '1338', '1338', '1338'], ['mean', '39.21', '30.66', '1.09', '13270.42'], ['std', '14.05', '6.10', '1.21', '12110.01'], ['min', '18', '15.96', '0', '1121.87'],
        ['25%', '27', '26.30', '0', '4740.29'], ['50%', '39', '30.40', '1', '9382.03'], ['75%', '51', '34.69', '2', '16639.91'], ['max', '64', '53.13', '5', '63770.43']];
      lkTable(100, 235, [{ label: '', w: 110, col: C.red }, { label: 'age', w: 120, align: 'right' }, { label: 'bmi', w: 120, align: 'right' }, { label: 'children', w: 140, align: 'right' }, { label: 'charges', w: 170, align: 'right' }], rows,
        { size: 19, rh: 40, kRow: i => lkK(b(2), .8 + (i + 1) * .5, .5), hl: i => i === 5 && b(2) > 9 });
      lkText('count · mean · std · min · max · quartiles', 1010, 330, 21, C.dim, lkK(b(2), 2, 1), 'center');
      lkText('50% = the median', 1010, 380, 24, C.red, lkK(b(2), 9, .7), 'center', 700);
    } },

    { title: 'Skewed data: mean versus median', draw(u, b) {
      // a right-skewed histogram of charges
      const S = lkScale(80, 160, 640, 330, [0, 64000], [0, 1]), kA = lkK(b(0), .2, .8);
      lkAxes(80, 160, 640, 330, kA, { xl: 'annual charges ($)', xt: [[S(0, 0)[0], '0'], [S(20000, 0)[0], '20k'], [S(40000, 0)[0], '40k'], [S(60000, 0)[0], '60k']] });
      const h = [.62, 1, .92, .66, .42, .22, .14, .12, .1, .13, .11, .08, .06, .03, .02, .015];
      h.forEach((v, i) => { const k = lkK(b(0), .6 + i * .12, .4), [x0, y0] = S(i * 4000, v), [x1] = S((i + 1) * 4000, 0); lkRect(x0 + 2, y0, x1 - x0 - 4, S(0, 0)[1] - y0, k, C.chalk, 2.5, C.chalkFill); });
      const kM = lkK(b(0), 3, .6), [mx] = S(13270, 0), [dx] = S(9382, 0);
      lkLine([[dx, 170], [dx, 490]], kM, C.chalk, 4, { dash: [10, 8] }); lkText('median 9,382 (dashed)', mx + 8, 245, 20, C.chalk, kM, 'left', 700);
      lkLine([[mx, 200], [mx, 490]], kM, C.red, 4); lkText('mean 13,270', mx + 8, 210, 20, C.red, kM, 'left', 700);
      lkArrow([[S(50000, .25)[0], S(50000, .25)[1]], [S(30000, .25)[0], S(30000, .25)[1]]], lkK(b(1), .5, .7), C.red, 3); lkText('a few expensive policies', S(50000, .3)[0], S(50000, .32)[1], 18, C.red, lkK(b(1), .8, .7), 'center');
      lkRule('skewed → report the median', 1000, 220, 480, lkK(b(1), 3, .9), 24);
      [['charges.mean()', '13,270.42'], ['charges.median()', '9,382.03'], ['charges.std()', '12,110.01'], ['charges.quantile(0.9)', '34,831.72']].forEach(([c, r], i) => res(c, r, 780, 340 + i * 46, lkK(b(2), .4 + i * .8, .6), 21, 1100));
    } },

    { title: 'Describing categorical variables', draw(u, b) {
      lkPyLine('insurance.describe(exclude="number")', 40, 145, 22, lkK(b(0), .3, .9));
      lkTable(60, 175, [{ label: '', w: 110, col: C.red }, { label: 'sex', w: 110 }, { label: 'smoker', w: 110 }, { label: 'region', w: 160 }], [['count', '1338', '1338', '1338'], ['unique', '2', '2', '4'], ['top', 'male', 'no', 'southeast'], ['freq', '676', '1064', '364']],
        { size: 20, rh: 40, kRow: i => lkK(b(0), 1.4 + (i + 1) * .5, .5) });
      lkPyLine('insurance["smoker"].value_counts()', 680, 145, 21, lkK(b(1), .3, .9));
      const S = [['no', 1064], ['yes', 274]];
      S.forEach(([n, v], i) => { const k = lkK(b(1), 1.6 + i * .6, .6), y = 200 + i * 56; lkCode(n, 700, y, 22, C.chalk, k); lkRect(760, y - 18, v / 1064 * 420, 36, k, i ? C.red : C.chalk, 3, i ? C.redFill : null); lkCode(String(v), 770 + v / 1064 * 420, y, 21, C.chalk, k); });
      lkPyLine('insurance["region"].value_counts(normalize=True)', 40, 395, 21, lkK(b(2), .3, .9));
      [['southeast', .272], ['southwest', .243], ['northwest', .243], ['northeast', .242]].forEach(([r, p], i) => { const k = lkK(b(2), 2 + i * .4, .5), x = 100 + i * 290; lkRect(x, 580 - p * 400, 120, p * 400, k, C.chalk, 3, C.chalkFill); lkText(r, x + 60, 603, 19, C.dim, k, 'center'); lkCode(p.toFixed(3), x + 60, 563 - p * 400, 19, C.red, k, 'center'); });
    } },

    { title: 'Comparing groups', draw(u, b) {
      lkPyLine('insurance.groupby("smoker")["charges"].mean()', 40, 145, 22, lkK(b(0), .4, 1));
      lkText('split', 120, 190, 22, C.red, lkK(b(0), 2.4, .5), 'center', 700); lkText('→ apply', 270, 190, 22, C.red, lkK(b(0), 3, .5), 'center', 700); lkText('→ combine', 440, 190, 22, C.red, lkK(b(0), 3.6, .5), 'center', 700);
      [['no', 8434.27], ['yes', 32050.23]].forEach(([n, v], i) => { const k = lkK(b(1), .4 + i * 1.6, .6), x = 140 + i * 230, hh = v / 32050 * 270; lkRect(x, 520 - hh, 130, hh, k, i ? C.red : C.chalk, 3, i ? C.redFill : C.chalkFill); lkText(n, x + 65, 545, 22, C.chalk, k, 'center', 700); lkCode('$' + Math.round(v).toLocaleString('en-US'), x + 65, 505 - hh, 21, C.chalk, k, 'center'); });
      lkText('smoker', 255, 585, 20, C.dim, lkK(b(1), .4, .6), 'center');
      lkPyLine('insurance.groupby(["region", "smoker"])["charges"].mean().unstack()', 600, 245, 16.5, lkK(b(2), .3, 1.2));
      lkTable(660, 270, [{ label: 'region', w: 190 }, { label: 'no', w: 130, align: 'right' }, { label: 'yes', w: 130, align: 'right', col: C.red }, { label: 'ratio', w: 120, align: 'right' }],
        [['northeast', '9,166', '29,674', '3.2×'], ['northwest', '8,556', '30,192', '3.5×'], ['southeast', '8,032', '34,845', '4.3×'], ['southwest', '8,019', '32,269', '4.0×']], { size: 20, rh: 42, kRow: i => lkK(b(2), 2.6 + (i + 1) * .5, .5) });
      lkText('smokers pay 3–4× in every region', 945, 515, 23, C.red, lkK(b(2), 6.4, .8), 'center', 700);
    } },

    { title: 'Correlation', draw(u, b) {
      // the r scale with three little scatter plots
      const kS = lkK(b(0), .3, .9);
      lkLine([[160, 230], [1160, 230]], kS, C.chalk, 4); [[-1, 'perfect −'], [0, 'none'], [1, 'perfect +']].forEach(([v, n], i) => { const x = 660 + v * 500; lkLine([[x, 218], [x, 242]], kS, C.chalk, 4); lkCode(String(v), x, 265, 22, C.red, kS, 'center'); lkText(n, x, 295, 19, C.dim, kS, 'center'); });
      [[-1, 160], [0, 660], [1, 1160]].forEach(([r, x], j) => { const pts = lkCloud(18, 7 + j * 13, -1, 1, v => r * v, r ? .08 : .6).map(([a, c]) => [x - 50 + (a + 1) * 50, 175 - c * 40]); lkDots(pts, lkK(b(0), 1.5 + j * .8, .7), C.chalk, 3.5); });
      lkPyLine('insurance.corr(numeric_only=True).round(3)', 40, 350, 21, lkK(b(1), .2, .9));
      lkTable(60, 375, [{ label: '', w: 130, col: C.red }, { label: 'age', w: 100, align: 'right' }, { label: 'bmi', w: 100, align: 'right' }, { label: 'children', w: 120, align: 'right' }, { label: 'charges', w: 120, align: 'right' }],
        [['age', '1.000', '0.109', '0.042', '0.299'], ['bmi', '0.109', '1.000', '0.013', '0.198'], ['children', '0.042', '0.013', '1.000', '0.068'], ['charges', '0.299', '0.198', '0.068', '1.000']],
        { size: 18, rh: 36, kRow: i => lkK(b(1), 1 + (i + 1) * .4, .5) });
      lkLoop(591, 429, 40, 17, lkK(b(1), 4.4, .6)); lkLoop(591, 465, 40, 17, lkK(b(1), 6.6, .6));
      lkText('Pearson (default): linear', 700, 430, 22, C.chalk, lkK(b(2), .3, .8), 'left', 700);
      lkText('corr(method="spearman"): ranks', 700, 475, 22, C.chalk, lkK(b(2), 3, .8), 'left', 700);
      lkText('robust to outliers · any monotonic curve', 700, 515, 20, C.dim, lkK(b(2), 6, 1));
    } },

    { title: 'Linear regression', draw(u, b) {
      lkText('y = β₀ + β₁x₁ + β₂x₂ + … + ε', 340, 155, 34, C.chalk, lkK(b(1), .2, 1.2), 'center', 500);
      // a scatter with the least-squares line and residuals
      const S = lkScale(80, 200, 500, 270, [18, 64], [0, 30000]), pts = lkCloud(36, 3, 18, 64, a => 3166 + 257.7 * a, 4200).map(([a, c]) => [a, Math.max(800, c)]);
      lkAxes(80, 200, 500, 270, lkK(b(1), 1, .6), { xl: 'age', yl: 'charges' });
      lkDots(pts.map(([a, c]) => S(a, c)), lkK(b(1), 1.4, 1), C.chalk, 4);
      const kL = lkK(b(1), 3, .9); lkLine([S(18, 3166 + 257.7 * 18), S(64, 3166 + 257.7 * 64)], kL, C.red, 5);
      pts.slice(0, 10).forEach(([a, c]) => lkLine([S(a, c), S(a, 3166 + 257.7 * a)], lkK(b(1), 4.4, .6), C.red, 1.5, { alpha: .6 }));
      lkText('minimize the sum of squared errors', 330, 520, 20, C.red, lkK(b(1), 5, .8), 'center', 700);
      lkCodeBlock(640, 130, 640, ['model = smf.ols("charges ~ age", data=insurance)  # describe', 'results = model.fit()                             # fit', 'print(results.summary())                          # inspect'],
        { size: 15.5, k: lkK(b(2), .2, .6), kLine: seq(b, 2, .5, .9) });
      const rows = [['coef of age', '257.7', '+$258 per year of age'], ['Intercept', '3,165.9', 'at age 0: an anchor'], ['P>|t| of age', '0.000', '< 0.05: significant'], ['R-squared', '0.089', 'age explains 8.9%']];
      rows.forEach(([q, v, m], i) => { const k = lkK(b(3), .5 + i * 2.4, .7), y = 290 + i * 66; lkText(q, 660, y, 22, C.chalk, k, 'left', 700); lkCode(v, 940, y, 24, C.red, k, 'right'); lkText(m, 970, y, 20, C.dim, k); });
    } },

    { title: 'Multiple regression and prediction', draw(u, b) {
      lkCode('smf.ols("charges ~ age + bmi + children + smoker + sex + region", data=insurance).fit()', 30, 145, 17, C.chalk, lkK(b(0), .3, 1.4));
      lkText('text columns → dummy variables vs. a baseline', 40, 185, 20, C.dim, lkK(b(0), 3.4, 1));
      const coefs = [['smoker[T.yes]', 23848.5, '0.000'], ['age', 256.9, '0.000'], ['bmi', 339.2, '0.000'], ['children', 475.5, '0.001'], ['sex[T.male]', -131.3, '0.693'], ['region[T.southeast]', -1035.0, '0.031']];
      lkTable(60, 210, [{ label: 'term', w: 270 }, { label: 'coef', w: 150, align: 'right', col: C.red }, { label: 'P>|t|', w: 110, align: 'right' }], coefs.map(([t, c, p]) => [t, c.toLocaleString('en-US', { maximumFractionDigits: 1 }), p]),
        { size: 19, rh: 40, kRow: i => i < 0 ? lkK(b(1), .2, .5) : lkK(b(i < 3 ? 1 : 2), i < 3 ? .5 + i * 3 : (i - 3) * 1.2, .6), hl: i => (i === 0 && b(1) > 0 && b(2) < 0) || (i === 4 && b(2) > 0 && b(3) < 0) });
      lkText('baseline: non-smoker, female, northeast', 340, 510, 18, C.dim, lkK(b(1), 2, .8), 'center');
      res('full.rsquared', '0.751', 60, 560, lkK(b(2), 4.4, .7), 22); lkText('75% of the variation', 360, 560, 22, C.red, lkK(b(2), 5, .7), 'left', 700);
      lkText('predict two applicants', 940, 230, 24, C.chalk, lkK(b(3), .3, .7), 'center', 700); lkText('age 30 · BMI 27 · 1 child · female · southeast', 940, 268, 18, C.dim, lkK(b(3), .6, .8), 'center');
      [['non-smoker', '$4,365.85'], ['smoker', '$28,214.39']].forEach(([n, v], i) => { const k = lkK(b(3), 1.6 + i * 1, .6), y = 330 + i * 60; lkText(n, 760, y, 24, C.chalk, k); lkCode(v, 1230, y, 26, i ? C.red : C.chalk, k, 'right'); });
      lkLine([[760, 420], [1240, 420]], lkK(b(3), 3, .5), C.dim, 2); lkText('difference = 23,848.54 = the smoker coefficient', 1000, 450, 19, C.red, lkK(b(3), 3.4, .8), 'center', 700);
    } },

    { title: 'Warmup: the diabetes data', draw(u, b) {
      lkText('768 women · 8 measurements · Outcome: 1 = diabetes', 660, 140, 24, C.chalk, lkK(b(0), .4, 1.2), 'center', 700);
      lkPyLine('(diabetes[["Glucose", "BloodPressure", "SkinThickness", "Insulin", "BMI"]] == 0).sum()', 30, 195, 16.5, lkK(b(1), 1, 1.2));
      [['Glucose', 5], ['BloodPressure', 35], ['SkinThickness', 227], ['Insulin', 374], ['BMI', 11]].forEach(([v, n], i) => { const k = lkK(b(1), 3 + i * .5, .5), y = 240 + i * 40; lkCode(v, 60, y, 20, C.chalk, k); lkLine([[260, y], [260 + n * .9, y]], k, n > 300 ? C.red : C.chalk, 16); lkCode(String(n), 270 + n * .9, y, 19, n > 300 ? C.red : C.dim, k); });
      lkText('min = 0 → impossible → missing!', 280, 460, 23, C.red, lkK(b(1), 6, .8), 'center', 700); lkText('374 of 768 insulin values', 280, 500, 20, C.dim, lkK(b(1), 9, .8), 'center');
      lkPyLine('diabetes["Outcome"].value_counts(normalize=True)', 700, 250, 16.5, lkK(b(2), .2, .8)); lkCode('→ 0: 0.651   1: 0.349', 720, 282, 18, C.red, lkK(b(2), 1.4, .7));
      lkTable(720, 320, [{ label: 'Outcome', w: 130 }, { label: 'Glucose', w: 130, align: 'right', col: C.red }, { label: 'BMI', w: 100, align: 'right' }, { label: 'Age', w: 100, align: 'right' }], [['0', '110.0', '30.3', '31.2'], ['1', '141.3', '35.1', '37.1']],
        { size: 20, rh: 40, kRow: i => lkK(b(2), 3 + (i + 1) * .5, .5) });
      lkText('glucose: the strongest correlation (r = 0.467)', 960, 470, 21, C.red, lkK(b(2), 6, .8), 'center', 700);
    } },

    { title: 'Workout: logistic regression', draw(u, b) {
      // the S-curve on a 0/1 outcome
      const S = lkScale(80, 160, 520, 260, [40, 200], [0, 1]);
      lkAxes(80, 160, 520, 260, lkK(b(0), .2, .6), { xl: 'glucose', yl: 'P(diabetes)', yt: [[S(0, 0)[1], '0'], [S(0, 1)[1], '1']] });
      lkDots(lkCloud(30, 11, 50, 195, () => 0, 0).map(([g], i) => S(g, hash(i * 3.3) < 1 / (1 + Math.exp(-(g - 150) / 15)) ? 1 : 0)), lkK(b(0), .8, .8), C.dim, 4.5);
      lkLine([S(45, -.08), S(195, 1.25)], lkK(b(0), 2.4, .8), C.chalk, 3, { dash: [8, 8] }); lkText('a straight line leaves [0, 1]', 470, 205, 19, C.dim, lkK(b(0), 3, .8), 'center');
      const curve = []; for (let g = 40; g <= 200; g += 4) curve.push(S(g, 1 / (1 + Math.exp(-(g - 140) / 14))));
      lkLine(curve, lkK(b(1), .3, 1.4), C.red, 5, { smooth: true });
      lkText('P(y = 1) = 1 / (1 + e^−(β₀ + β₁x₁ + …))', 340, 520, 22, C.chalk, lkK(b(1), 2, 1), 'center', 500);
      lkCode('smf.logit("Outcome ~ Pregnancies + Glucose + BMI + …", data=diabetes).fit()', 30, 580, 16.5, C.chalk, lkK(b(1), 4, 1.2));
      res('np.exp(logit.params)["Glucose"]', '1.033', 660, 175, lkK(b(2), .4, .8), 20);
      lkText('odds ratio: × 1.033 per glucose point', 680, 225, 22, C.chalk, lkK(b(2), 2.6, .8));
      lkText('30 points: 1.033³⁰ ≈ 2.7 × the odds', 680, 265, 22, C.red, lkK(b(2), 7, .8), 'left', 700);
      lkText('two 40-year-old women, otherwise identical', 970, 340, 20, C.dim, lkK(b(3), .3, .9), 'center');
      [['glucose 100', '13.6%'], ['glucose 160', '53.1%']].forEach(([g, p], i) => { const k = lkK(b(3), 2.4 + i * 1.6, .6), y = 400 + i * 70; lkText(g, 720, y, 26, C.chalk, k); lkCode(p, 1230, y, 34, i ? C.red : C.chalk, k, 'right'); });
    } },

    { title: 'Summary', draw(u, b) {
      const rows = [['Summary statistics', 'df.describe()   df.describe(exclude="number")', 1, .2], ['Single statistics', 's.mean()  s.median()  s.std()  s.quantile(q)', 1, 1.4], ['Frequencies', 's.value_counts(normalize=True)', 1, 2.6],
        ['Group comparison', 'df.groupby("g")["v"].agg(["mean", "median"])', 1, 3.6], ['Correlation', 'df.corr(numeric_only=True)', 1, 4.6], ['Linear regression', 'smf.ols("y ~ x1 + x2", data=df).fit()', 2, .2],
        ['Logistic regression', 'smf.logit("y ~ x1 + x2", data=df).fit()', 2, 2], ['Results', '.summary()  .params  .pvalues  .rsquared  .predict(new_df)', 2, 4.4]];
      lkTable(70, 115, [{ label: 'Task', w: 270, mono: false }, { label: 'Code', w: 910, col: C.chalk }], rows.map(r => [r[0], r[1]]), { size: 20, rh: 50, kRow: i => i < 0 ? lkK(b(0), .2, .6) : lkK(b(rows[i][2]), rows[i][3], .6) });
      lkText('Describe before you model.  Next: Module 14 · Relationships and distributions', 660, 612, 24, C.red, lkK(b(3), .5, 1.2), 'center', 700);
    } },
  ];

  lecture({
    footer: 'BUSN 3030E · Module 13 · Statistics and Regression',
    panels,
  });
})();
