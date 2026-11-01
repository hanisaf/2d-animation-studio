// Scene 58: Python lecture, Module 10 · Comprehensions. The black board takes centre stage; ten panels chalk themselves on
// in step with the voice-over (asset.js → narration). Built with scene 49's lecture_kit.js.
// Board coords: 1320 × 680, y down; the header sits above y 100 and the footer at y 650.
(() => {
  const C = LK;
  const res = (code, out, x, y, k, size = 24, ox) => { lkPyLine(code, x, y, size, k); if (out !== '') lkCode('→ ' + out, ox ?? x + lkMeasure(code, size, 500, LK_MONO) + 24, y, size, C.red, k); };
  const seq = (b, line, d0, step) => i => lkK(b(line), d0 + i * step, .6);

  const panels = [
    { title: 'Comprehensions', draw(u, b) {
      lkTitle(u, b, 10, 'Comprehensions', [['lists without', 'loops', 1, .6], ['filter and', 'transform', 1, 3], ['sets and', 'dictionaries', 1, 6], ['map · filter', '· reduce', 2, 4]]);
    } },

    { title: 'List comprehensions', draw(u, b) {
      lkCodeBlock(60, 125, 480, ['squares = []', 'for n in range(12):', '    squares.append(n ** 2)'], { size: 23, k: lkK(b(0), .3, .6), kLine: seq(b, 0, 2.4, .8) });
      lkArrow([[560, 190], [640, 190]], lkK(b(1), .2, .6), C.red, 5);
      lkCodeBlock(660, 150, 600, ['[n ** 2 for n in range(12)]'], { size: 28, k: lkK(b(1), .4, .6), kLine: () => lkK(b(1), .8, 1.2) });
      lkCode('→ [0, 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121]', 660, 250, 21, C.red, lkK(b(1), 2.4, 1));
      lkCode('[expression for variable in iterable]', 660, 340, 38, C.chalk, lkK(b(2), 4, 1.2), 'center');
      [['expression', 375], ['variable', 694], ['iterable', 968]].forEach(([w, x], i) => lkText(w, x, 390, 22, C.red, lkK(b(2), 5.6 + i * .5, .5), 'center', 700));
      lkText('"the list of n ** 2 for each n in range(12)"', 660, 440, 24, C.dim, lkK(b(2), .3, 1.4), 'center');
      res('[round(price * 0.85, 2) for price in prices]', '[16.99, 4.67, 3.19, 10.2]', 120, 550, lkK(b(3), .4, 1), 24);
    } },

    { title: 'Filtering with a condition', draw(u, b) {
      res('[n for n in range(20) if n % 3 > 0]', '', 60, 160, lkK(b(0), 2, 1), 24);
      lkCode('→ [1, 2, 4, 5, 7, 8, 10, 11, 13, 14, 16, 17, 19]', 80, 205, 22, C.red, lkK(b(0), 3.4, 1));
      lkCode('orders = [120, 45, 300, 80, 15, 210]', 60, 270, 24, C.chalk, lkK(b(0), 5, .8));
      res('[order for order in orders if order >= 100]', '[120, 300, 210]', 60, 320, lkK(b(0), 6, 1), 24);
      lkLoop(557, 320, 120, 24, lkK(b(0), 7.6, .6)); lkText('filter', 557, 365, 22, C.red, lkK(b(0), 7.8, .6), 'center', 700);
      lkCodeBlock(60, 420, 560, ['large = []', 'for order in orders:          # for …', '    if order >= 100:          # if …', '        large.append(order)   # expression'],
        { size: 21, k: lkK(b(1), .2, .6), kLine: seq(b, 1, .4, .9) });
      lkArrow([[640, 470], [720, 470]], lkK(b(1), 4, .6), C.red, 4);
      lkText('the same parts, in the same order', 760, 470, 24, C.chalk, lkK(b(1), 4.4, 1), 'left', 700);
    } },

    { title: 'Transforming with a conditional expression', draw(u, b) {
      lkCode('value_if_true if condition else value_if_false', 660, 160, 30, C.chalk, lkK(b(0), .4, 1.6), 'center');
      res('"overdrawn" if balance < 0 else "ok"', "'overdrawn'", 220, 230, lkK(b(0), 4, .8), 24);
      res('["large" if order >= 100 else "small" for order in orders]', '', 60, 330, lkK(b(1), .6, 1.2), 23);
      lkCode("→ ['large', 'small', 'large', 'small', 'small', 'large']", 80, 375, 22, C.red, lkK(b(1), 3, 1));
      lkText('nothing is dropped', 1050, 375, 22, C.dim, lkK(b(1), 5, .7), 'center');
      const kR = lkK(b(2), .2, .9);
      lkRect(110, 450, 500, 120, kR, C.red, 4, C.redFill); lkRect(710, 450, 500, 120, kR, C.chalk, 4);
      lkCode('[x for x in xs if c]', 360, 490, 26, C.chalk, lkK(b(2), .6, .8), 'center'); lkText('if at the end FILTERS', 360, 535, 24, C.red, lkK(b(2), 1, .8), 'center', 700);
      lkCode('[a if c else b for x in xs]', 960, 490, 26, C.chalk, lkK(b(2), 2, .8), 'center'); lkText('if … else at the front TRANSFORMS', 960, 535, 24, C.chalk, lkK(b(2), 2.4, .8), 'center', 700);
    } },

    { title: 'More comprehensions', draw(u, b) {
      res('[(size, color) for size in "SML" for color in ["red", "blue"]]', '', 40, 160, lkK(b(0), .6, 1.2), 21);
      lkCode("→ [('S', 'red'), ('S', 'blue'), ('M', 'red'), ('M', 'blue'), ('L', 'red'), ('L', 'blue')]", 60, 205, 18, C.red, lkK(b(0), 3, 1));
      lkText('several for clauses = nested loops', 60, 245, 21, C.dim, lkK(b(0), 4.4, .8));
      res('{n % 3 for n in range(1000)}', '{0, 1, 2}', 40, 330, lkK(b(1), .4, .9), 26);
      lkText('{ } with values: a set', 900, 330, 22, C.red, lkK(b(1), 2.6, .7), 'left', 700);
      lkCodeBlock(30, 400, 1010, ['{product: round(price * 0.85, 2)', ' for product, price in [("pen", 2.50), ("notebook", 4.00), ("bag", 30.00)]}', { out: "{'pen': 2.12, 'notebook': 3.4, 'bag': 25.5}" }],
        { size: 19, k: lkK(b(2), .2, .6), kLine: seq(b, 2, .5, 1.2) });
      lkText('key: value → a dict', 1060, 450, 22, C.red, lkK(b(2), 2, .7), 'left', 700);
    } },

    { title: 'Summarizing data', draw(u, b) {
      lkTable(40, 120, [{ label: 'Function', w: 200, col: C.red }, { label: 'Returns', w: 330, mono: false }], [['len(x)', 'the number of items'], ['sum(x)', 'the total'], ['min(x), max(x)', 'smallest, largest item'], ['any(x)', 'True if at least one is true'], ['all(x)', 'True if every item is true']],
        { size: 21, rh: 44, kRow: i => i < 0 ? lkK(b(0), .2, .6) : lkK(b(0), .6 + i * 1.3, .6) });
      lkText('generator expression: no [ ] needed', 900, 150, 24, C.chalk, lkK(b(1), 5, .9), 'center', 700);
      [['sum(order for order in orders if order >= 100)', '630'], ['any(order > 250 for order in orders)', 'True'], ['all(order > 0 for order in orders)', 'True']].forEach(([c, r], i) => {
        const k = lkK(b(2), .2 + i * 2.2, .8), y = 220 + i * 56; lkPyLine(c, 620, y, 20, k); lkCode('→ ' + r, 1200, y, 20, C.red, k); });
      res('max(["data", "analytics", "is", "fun"], key=len)', "'analytics'", 120, 470, lkK(b(3), 2.4, 1), 23);
      lkText('min · max · sorted accept a key function', 660, 540, 23, C.dim, lkK(b(3), .2, 1), 'center');
    } },

    { title: 'Map, filter, reduce', draw(u, b) {
      const cols = [['map', 'apply f to every item', '[f(x) for x in items]', 1, .3], ['filter', 'keep items that pass a test', '[x for x in items if test(x)]', 1, 2.6], ['reduce', 'combine all into one value', 'sum(…)  max(…)  reduce(f, items)', 2, .3]];
      cols.forEach(([n, d, c, l, dl], i) => { const k = lkK(b(l), dl, .8), x = 220 + i * 440; lkText(n, x, 170, 40, C.red, k, 'center', 700); lkText(d, x, 225, 22, C.chalk, k, 'center'); lkCode(c, x, 275, 19, C.dim, k, 'center'); });
      // pictograms: map turns ● into ■, filter drops some, reduce merges
      [0, 1, 2, 3].forEach(i => { const k = lkK(b(1), 1 + i * .2, .5); circle(120 + i * 60, 340, 12, { fill: C.chalk, stroke: null, alpha: k }); lkArrow([[120 + i * 60, 360], [120 + i * 60, 392]], k, C.dim, 2, { head: 7 }); shape(rectPts(108 + i * 60, 400, 24, 24), { fill: C.red, stroke: null, alpha: k }); });
      [0, 1, 2, 3].forEach(i => { const k = lkK(b(1), 3.4 + i * .2, .5), keep = i % 2 === 0; circle(570 + i * 60, 340, 12, { fill: C.chalk, stroke: null, alpha: k }); if (keep) { lkArrow([[570 + i * 60, 360], [570 + i * 60, 392]], k, C.dim, 2, { head: 7 }); circle(570 + i * 60, 412, 12, { fill: C.chalk, stroke: null, alpha: k }); } else lkCross(570 + i * 60, 376, 18, k); });
      [0, 1, 2, 3].forEach(i => { const k = lkK(b(2), 1 + i * .2, .5); circle(1010 + i * 60, 340, 12, { fill: C.chalk, stroke: null, alpha: k }); lkLine([[1010 + i * 60, 356], [1100, 400]], k, C.dim, 2); });
      circle(1100, 412, 20, { fill: C.red, stroke: null, alpha: lkK(b(2), 2, .5) });
      res('reduce(lambda total, x: total + x, [1, 2, 3, 4])', '10', 200, 495, lkK(b(2), 3.4, 1), 22);
      lkRule('Prefer built-ins; if a comprehension gets complicated, use a loop', 660, 590, 1100, lkK(b(3), .3, .9), 24);
    } },

    { title: 'Warmup: dates and dictionaries', draw(u, b) {
      res('january = [f"1-{day}" for day in range(1, 32)]', '1-1 … 1-31', 40, 150, lkK(b(0), .3, 1), 21);
      res('[f"{m}-{d}" for m in range(1, 13) for d in range(1, 32)]', '372', 40, 200, lkK(b(0), 4, 1), 21);
      lkCodeBlock(40, 245, 820, ['year = [f"{month}-{day}"', '        for month in range(1, 13)', '        for day in range(1, 32)', '        if valid_date(month, day)]', 'len(year), year[57:60]', { out: "(365, ['2-27', '2-28', '3-1'])" }],
        { size: 20, lh: 33, k: lkK(b(1), .2, .6), kLine: seq(b, 1, .4, .8) });
      lkCodeBlock(40, 510, 1240, ['e2f = {"hi": "bonjour", "bye": "au revoir", "bread": "pain", "water": "eau"}', 'f2e = {french: english for english, french in e2f.items()}'],
        { size: 20, k: lkK(b(2), .2, .6), kLine: seq(b, 2, .4, 1.2) });
      lkText('a filter that calls a function', 1080, 330, 22, C.red, lkK(b(1), 2.4, .8), 'center', 700);
    } },

    { title: 'Workout: words and emails', draw(u, b) {
      lkCodeBlock(40, 125, 1240, ['" ".join("*" * len(word) if "@" in word else word for word in msg.split())'], { size: 21, k: lkK(b(0), .2, .6), kLine: () => lkK(b(0), .6, 1.4) });
      lkCode('… an email such as ********************* replace it with stars, another one is ******************', 60, 215, 18, C.red, lkK(b(0), 4, 1));
      [['max_length = max(len(w) for w in msg.split())', '[w for w in msg.split() if len(w) == max_length]', 'all the ties', .3], ['max(msg.split(), key=len)', null, 'the first one', 3.4],
        ['reduce(lambda w1, w2: w1 if len(w1) >= len(w2) else w2, msg.split())', null, 'the first one', 5.6]].forEach(([c1, c2, note, d], i) => {
        const k = lkK(b(1), d, .9), y = 280 + i * 70 + (i ? 30 : 0); lkBadge(i + 1, 60, y, 18, k); lkPyLine(c1, 95, y, 19, k); if (c2) lkPyLine(c2, 95, y + 32, 19, k); lkText(note, 1270, y, 20, C.dim, k, 'right'); });
      lkCode("→ 'doctor.fun@python.org'", 95, 535, 21, C.red, lkK(b(1), 7, .7));
      res('max((w for w in msg.split() if "@" not in w), key=len)', "'possible'", 40, 595, lkK(b(2), .4, 1), 21);
    } },

    { title: 'Summary', draw(u, b) {
      const rows = [['Transform (map)', '[f(x) for x in items]', 1, .2], ['Filter', '[x for x in items if condition]', 1, 2.4], ['Transform conditionally', '[a if condition else b for x in items]', 1, 4.4],
        ['Nested loops', '[… for x in xs for y in ys]', 2, .2], ['Set / dictionary', '{x for x in items}   {k: v for k, v in pairs}', 2, 2.4], ['Reduce', 'sum()  max()  any()  all()  functools.reduce(f, items)', 3, .3]];
      lkTable(90, 125, [{ label: 'Pattern', w: 330, mono: false }, { label: 'Syntax', w: 820, col: C.chalk }], rows.map(r => [r[0], r[1]]), { size: 23, rh: 60, kRow: i => i < 0 ? lkK(b(0), .2, .6) : lkK(b(rows[i][2]), rows[i][3], .6) });
      lkText('Next: the Module 10 drill  →  Module 11: Data analysis in pure Python', 660, 610, 26, C.red, lkK(b(3), 4, 1), 'center', 700);
    } },
  ];

  lecture({
    footer: 'BUSN 3030E · Module 10 · Comprehensions',
    panels,
    focus: [{ panel: 2, line: 2, to: 3, rect: [300, 300, 760, 120] }],
  });
})();
