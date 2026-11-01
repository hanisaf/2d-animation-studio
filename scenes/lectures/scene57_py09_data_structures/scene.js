// Scene 57: Python lecture, Module 9 · Built-In Data Structures. The black board takes centre stage; ten panels chalk
// themselves on in step with the voice-over (asset.js → narration). Built with scene 49's lecture_kit.js.
// Board coords: 1320 × 680, y down; the header sits above y 100 and the footer at y 650.
(() => {
  const C = LK;
  const res = (code, out, x, y, k, size = 24, ox) => { lkPyLine(code, x, y, size, k); lkCode('→ ' + out, ox ?? x + lkMeasure(code, size, 500, LK_MONO) + 24, y, size, C.red, k); };
  const seq = (b, line, d0, step) => i => lkK(b(line), d0 + i * step, .6);

  const panels = [
    { title: 'Built-In Data Structures', draw(u, b) {
      lkTitle(u, b, 9, 'Built-In Data Structures', [['lists and', 'tuples', 2, .6], ['dictionaries', 'key → value', 2, 3], ['sets', 'unique values', 2, 5], ['counting', 'frequencies', 2, 6.6]]);
    } },

    { title: 'Four collection types', draw(u, b) {
      const rows = [['list', '[1, 2, 3]', 'ordered, changeable', 1, .3], ['tuple', '(1, 2, 3)', 'ordered, unchangeable', 1, 4], ['dict', '{"a": 1, "b": 2}', 'unique keys → values', 2, .3], ['set', '{1, 2, 3}', 'unique values, unordered', 2, 2.6]];
      lkTable(140, 130, [{ label: 'Type', w: 180, col: C.red }, { label: 'Example', w: 380 }, { label: 'Description', w: 420, mono: false }], rows.map(r => r.slice(0, 3)),
        { size: 27, rh: 64, kRow: i => i < 0 ? lkK(b(0), .3, .6) : lkK(b(rows[i][3]), rows[i][4], .7) });
      [['[ ]', 'list', 1, .6], ['( )', 'tuple', 1, 4.4], ['{k: v}', 'dict', 2, .8], ['{ }', 'set', 2, 3]].forEach(([s, n, l, d], i) => { const k = lkK(b(l), d, .6), x = 240 + i * 280; lkCode(s, x, 500, 40, C.chalk, k, 'center'); lkText(n, x, 550, 22, C.red, k, 'center', 700); });
      lkText('{}  is an empty dict;  set()  is an empty set', 660, 610, 22, C.dim, lkK(b(2), 6, 1), 'center');
    } },

    { title: 'Lists', draw(u, b) {
      lkCodeBlock(40, 125, 640, ['prices = [19.99, 5.49, 3.75, 12.00]', 'prices.append(7.25)         # one item at the end', 'prices.extend([2.99, 8.50])  # several items', 'prices.insert(0, 99.00)      # at position 0',
        'removed = prices.pop()       # remove the last', 'prices.remove(99.00)         # first equal item'], { size: 19, lh: 34, k: lkK(b(0), .2, .6), kLine: i => i === 0 ? lkK(b(0), .6, .8) : lkK(b(1), (i - 1) * 2, .7) });
      res('sorted(sizes)', '[1, 2, 5, 8]  a new list', 40, 395, lkK(b(2), .4, .7), 21);
      res('sizes.sort(reverse=True)', 'in place, returns None', 40, 440, lkK(b(2), 3.2, .7), 21);
      // indexing diagram
      const L = [2, 3, 5, 7, 11], x0 = 760, cw = 96;
      L.forEach((v, i) => { const k = lkK(b(3), .2 + i * .15, .4), x = x0 + i * cw, edited = b(3) > 5 && i < 3; lkRect(x, 150, cw, 64, k, edited ? C.red : C.chalk, 3, edited ? C.redFill : null);
        lkCode(String(edited ? [100, 55, 56][i] : v), x + cw / 2, 184, 26, C.chalk, k, 'center'); lkCode(String(i), x + cw / 2, 236, 19, C.dim, k, 'center'); lkCode(String(i - 5), x + cw / 2, 262, 19, C.red, k, 'center'); });
      [['L[0], L[-1]', '2 11'], ['L[1:3]', '[3, 5]'], ['L[::-1]', '[11, 7, 5, 3, 2]']].forEach(([c, r], i) => res(c, r, 760, 310 + i * 44, lkK(b(3), 1 + i * .9, .6), 21, 960));
      lkCodeBlock(740, 450, 520, ['L[0] = 100', 'L[1:3] = [55, 56]'], { size: 21, k: lkK(b(3), 4.4, .6), kLine: seq(b, 3, 4.6, .6) });
      lkText('lists can change; strings can\'t', 1000, 575, 21, C.red, lkK(b(3), 5, .7), 'center', 700);
    } },

    { title: 'Tuples', draw(u, b) {
      lkPyLine('point = (33.95, -83.37)   # Athens, GA', 60, 160, 24, lkK(b(0), 2, 1));
      res('point[0]', '33.95', 60, 210, lkK(b(0), 4, .6), 24);
      lkCodeBlock(60, 260, 720, ['point[0] = 34.0', { err: "TypeError: 'tuple' object does not support item assignment" }], { size: 21, k: lkK(b(1), .2, .6), kLine: seq(b, 1, .4, .8) });
      lkText('a fixed group of values that belong together', 1040, 330, 22, C.dim, lkK(b(0), 5, 1), 'center');
      lkCodeBlock(60, 400, 560, ['latitude, longitude = point', 'a, b = 1, 2', 'a, b = b, a', 'print(a, b)', { out: '2 1' }], { size: 23, lh: 34, k: lkK(b(2), .2, .6), kLine: seq(b, 2, 2, 1.2) });
      lkText('unpacking', 760, 440, 30, C.red, lkK(b(2), 2.2, .7), 'left', 700); lkText('a swap in one line', 760, 500, 24, C.chalk, lkK(b(2), 6, .7));
      lkArrow([[700, 515], [620, 475]], lkK(b(2), 6.4, .5), C.red, 3, { head: 10 });
    } },

    { title: 'Dictionaries', draw(u, b) {
      lkPyLine('stock = {"apples": 120, "bananas": 75, "cherries": 0}', 40, 145, 22, lkK(b(0), 1, 1));
      // key → value diagram
      const entries = [['"apples"', b(1) > 1 ? '100' : '120'], ['"bananas"', '75'], ['"cherries"', '0'], ['"dates"', '40']];
      entries.forEach(([kk, v], i) => { const k = i < 3 ? lkK(b(0), 3 + i * .5, .6) : lkK(b(1), .4, .6), y = 210 + i * 56; lkRect(60, y - 22, 190, 44, k, C.chalk, 3); lkCode(kk, 155, y, 21, C.chalk, k, 'center');
        lkArrow([[258, y], [318, y]], k, C.red, 3, { head: 10 }); lkRect(325, y - 22, 90, 44, k, i === 0 && b(1) > 1 || i === 3 ? C.red : C.chalk, 3); lkCode(v, 370, y, 21, C.chalk, k, 'center'); });
      lkText('keys', 155, 445, 20, C.dim, lkK(b(0), 4.4, .6), 'center'); lkText('values', 370, 445, 20, C.dim, lkK(b(0), 4.4, .6), 'center');
      lkCodeBlock(470, 180, 400, ['stock["dates"] = 40    # add', 'stock["apples"] -= 20  # update'], { size: 20, k: lkK(b(1), .2, .6), kLine: seq(b, 1, .3, 1) });
      lkCodeBlock(470, 290, 400, ['stock["figs"]', { err: "KeyError: 'figs'" }, 'stock.get("figs", 0)', { out: '0' }], { size: 20, k: lkK(b(2), .2, .6), kLine: seq(b, 2, .4, .8) });
      lkCodeBlock(900, 180, 380, ['for fruit, qty in stock.items():', '    if qty == 0:', '        print("Reorder", fruit)', { out: 'Reorder cherries' }], { size: 18, k: lkK(b(3), .2, .6), kLine: seq(b, 3, 3, .7) });
      lkCodeBlock(470, 470, 810, ['employee = {"name": "Ada", "address": {"city": "Athens"}}', 'employee["address"]["city"]', { out: "'Athens'" }],
        { size: 17, k: lkK(b(3), 5.4, .6), kLine: seq(b, 3, 5.6, .9) });
    } },

    { title: 'Counting with a dictionary', draw(u, b) {
      lkCode('grades = ["A", "B", "B+", "C", "D", "C", "A", "A-", "B+", "A"]', 60, 150, 22, C.chalk, lkK(b(0), .4, 1.2));
      lkCodeBlock(60, 190, 620, ['counts = {}', 'for grade in grades:', '    counts[grade] = counts.get(grade, 0) + 1', 'counts'], { size: 22, k: lkK(b(1), .2, .6), kLine: seq(b, 1, .4, 1.2) });
      lkLoop(472, 284, 142, 20, lkK(b(1), 5, .7)); lkText('0 the first time', 470, 340, 21, C.red, lkK(b(1), 5.4, .7), 'left', 700);
      const counts = [['A', 3], ['B', 1], ['B+', 2], ['C', 2], ['D', 1], ['A-', 1]], x0 = 770, base = 540;
      counts.forEach(([g, n], i) => { const k = lkK(b(2), .2 + i * .35, .6), x = x0 + i * 82; lkRect(x, base - n * 100, 56, n * 100, k, n === 3 ? C.red : C.chalk, 3, n === 3 ? C.redFill : null); lkCode(g, x + 28, base + 26, 22, C.chalk, k, 'center'); lkCode(String(n), x + 28, base - n * 100 - 20, 20, C.red, k, 'center'); });
      lkCode("{'A': 3, 'B': 1, 'B+': 2, 'C': 2, 'D': 1, 'A-': 1}", 60, 430, 21, C.red, lkK(b(2), .2, 1.2));
    } },

    { title: 'Sets', draw(u, b) {
      res('set(grades)', "{'A', 'A-', 'B', 'B+', 'C', 'D'}", 60, 150, lkK(b(0), 1.4, .8), 23);
      lkText('duplicates removed', 60, 192, 20, C.dim, lkK(b(0), 3, .7));
      // the Venn diagram
      const kV = lkK(b(1), .2, .9), mode = b(2) > 2.4 ? 3 : b(2) > 0 ? 2 : b(1) > 6 ? 1 : 0;
      X.save(); X.globalAlpha *= kV;
      const fillL = mode === 1 || mode === 2 || mode === 3, fillR = mode === 1 || mode === 3, fillM = mode === 0 || mode === 1;
      X.beginPath(); X.ellipse(420, 400, 160, 120, 0, 0, TAU); X.fillStyle = fillL ? C.redFill : 'rgba(0,0,0,0)'; X.fill();
      X.beginPath(); X.ellipse(620, 400, 160, 120, 0, 0, TAU); X.fillStyle = fillR ? C.redFill : 'rgba(0,0,0,0)'; X.fill();
      if (mode === 3 || mode === 2) { X.save(); X.beginPath(); X.ellipse(420, 400, 160, 120, 0, 0, TAU); X.clip(); X.beginPath(); X.ellipse(620, 400, 160, 120, 0, 0, TAU); X.fillStyle = '#060606'; X.fill(); X.restore(); }
      if (mode === 0) { X.save(); X.beginPath(); X.ellipse(420, 400, 160, 120, 0, 0, TAU); X.clip(); X.beginPath(); X.ellipse(620, 400, 160, 120, 0, 0, TAU); X.fillStyle = C.redFill; X.fill(); X.restore(); }
      X.restore();
      lkCircle(420, 400, 160, kV, C.chalk, 4, null, 120); lkCircle(620, 400, 160, kV, C.chalk, 4, null, 120);
      lkText('laptop', 330, 270, 24, C.chalk, kV, 'center', 700); lkText('mouse', 710, 270, 24, C.chalk, kV, 'center', 700);
      [['Ann', 360, 380], ['Cara', 360, 430], ['Ben', 520, 380], ['Dev', 520, 430], ['Eli', 690, 405]].forEach(([n, x, y]) => lkText(n, x, y, 24, C.chalk, kV, 'center'));
      [['&', 'intersection: both', 1, .4], ['|', 'union: either', 1, 4], ['-', 'difference: laptop, no mouse', 2, .3], ['^', 'symmetric diff.: exactly one', 2, 2.6]].forEach(([o, t, l, d], i) => {
        const k = lkK(b(l), d, .6), y = 280 + i * 52, on = mode === i; lkCode(o, 860, y, 30, on ? C.red : C.chalk, k, 'center'); lkText(t, 900, y, 23, on ? C.red : C.chalk, k, 'left', on ? 700 : 600); });
      lkText('list · tuple · dict · set: order · fixed group · look up · unique', 660, 600, 22, C.dim, lkK(b(3), .5, 1.6), 'center');
    } },

    { title: 'Workout: trending words', draw(u, b) {
      ['Hurricane Dorian leaves terrible damage and stranded residents in Bahamas', 'Boris Johnson has just taken a huge gamble over Brexit', 'Walmart ends all handgun ammunition sales and asks customers…', '…'].forEach((h, i) => lkText(h, 60, 145 + i * 30, 19, C.dim, lkK(b(0), 2 + i * .5, .8)));
      lkCodeBlock(40, 270, 620, ['text = headlines.lower()', 'for mark in ".,?!\'":', '    text = text.replace(mark, "")', 'words = text.split()', 'len(words), len(set(words))', { out: '(214, 145)' }],
        { size: 19, lh: 31, k: lkK(b(1), .2, .6), kLine: seq(b, 1, .5, 1.1) });
      lkCodeBlock(700, 270, 580, ['frequency = {}', 'for word in words:', '    frequency[word] = frequency.get(word, 0) + 1', 'sorted(frequency.items(),', '       key=lambda item: item[1], reverse=True)'],
        { size: 17, lh: 31, k: lkK(b(2), .2, .6), kLine: seq(b, 2, .4, .8) });
      [['to', 8], ['and', 7], ['the', 6], ['in', 5], ['what', 5]].forEach(([w, n], i) => { const k = lkK(b(3), .3 + i * .4, .5), y = 470 + i * 30; lkCode(w, 760, y, 21, C.chalk, k); lkLine([[860, y], [860 + n * 40, y]], k, C.red, 12); lkCode(String(n), 870 + n * 40, y, 19, C.dim, k); });
      lkText('function words', 1100, 440, 22, C.red, lkK(b(3), 2.6, .7), 'center', 700);
    } },

    { title: 'Workout: without the stop words', draw(u, b) {
      lkCodeBlock(40, 125, 620, ['stop_words = {"a", "about", "and", "the", "to", …}', null, 'content_words = [w for w in words', '                 if w not in stop_words]'], { size: 19, k: lkK(b(0), .2, .6), kLine: seq(b, 0, .6, .8) });
      lkText('a set: fast membership checks', 60, 300, 21, C.red, lkK(b(0), 3.6, .7), 'left', 700);
      const top = [['hurricane', 4], ['dorian', 4], ['california', 3], ['brexit', 3], ['guns', 3], ['residents', 2], ['bahamas', 2], ['dive', 2], ['boat', 2], ['boris', 2]];
      top.forEach(([w, n], i) => { const k = lkK(b(1), .3 + i * .35, .5), y = 140 + i * 40, x = 760; lkCode(w, x, y, 22, C.chalk, k); lkLine([[x + 170, y], [x + 170 + n * 70, y]], k, i < 5 ? C.red : C.dim, 16); lkCode(String(n), x + 185 + n * 70, y, 19, C.dim, k); });
      lkCodeBlock(40, 380, 620, ['from collections import Counter', 'Counter(content_words).most_common(10)'], { size: 21, k: lkK(b(2), .2, .6), kLine: seq(b, 2, 1, 1.2) });
      lkText('the same ranking in two lines', 60, 500, 21, C.dim, lkK(b(2), 4, .8));
    } },

    { title: 'Summary', draw(u, b) {
      lkList(110, 170, [
        { text: 'Lists [ … ] are ordered and mutable: append, extend, insert, pop, remove, sort.', mark: 'check', k: lkK(b(1), .2, .9) },
        { text: 'Tuples ( … ) are ordered and immutable; unpack them with a, b = pair.', mark: 'check', k: lkK(b(1), 2.6, .9) },
        { text: 'Dictionaries {key: value} look up by key; loop with .items(); count with get.', mark: 'check', k: lkK(b(2), .2, .9) },
        { text: 'Sets { … } hold unique values and support  &  |  -  ^', mark: 'check', k: lkK(b(3), .2, .9) },
        { text: 'Indexing and slicing work the same on lists, tuples, and strings.', mark: 'check', k: lkK(b(3), 3, .9) },
      ], { size: 25, gap: 76 });
      lkText('Next: the Module 9 drill  →  Module 10: Comprehensions', 660, 600, 26, C.red, lkK(b(3), 6, 1), 'center', 700);
    } },
  ];

  lecture({
    footer: 'BUSN 3030E · Module 9 · Built-In Data Structures',
    panels,
    focus: [{ panel: 9, line: 1, to: 2, rect: [740, 115, 540, 420] }],
  });
})();
