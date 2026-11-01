// Scene 52: Python lecture, Module 4 · Operators. The black board takes centre stage; ten panels chalk themselves on in
// step with the voice-over (asset.js → narration). Built with scene 49's lecture_kit.js.
// Board coords: 1320 × 680, y down; the header sits above y 100 and the footer at y 650.
(() => {
  const C = LK;
  const res = (code, out, x, y, k, size = 26, ox) => { lkPyLine(code, x, y, size, k); lkCode('→ ' + out, ox ?? x + lkMeasure(code, size, 500, LK_MONO) + 24, y, size, C.red, k); };

  const panels = [
    { title: 'Operators', draw(u, b) {
      lkTitle(u, b, 4, 'Operators', [['arithmetic', 'and its order', 1, .8], ['augmented', 'assignment', 1, 3.6], ['compare and', 'combine', 2, .8], ['identity and', 'membership', 2, 3.4]]);
    } },

    { title: 'Arithmetic operators', draw(u, b) {
      const rows = [['a + b', 'addition', '7 + 2', '9'], ['a - b', 'subtraction', '7 - 2', '5'], ['a * b', 'multiplication', '7 * 2', '14'], ['a / b', 'true division', '7 / 2', '3.5'],
        ['a // b', 'floor division', '7 // 2', '3'], ['a % b', 'modulus (remainder)', '7 % 2', '1'], ['a ** b', 'exponentiation', '7 ** 2', '49']];
      lkTable(50, 120, [{ label: 'Operator', w: 140 }, { label: 'Name', w: 260, mono: false }, { label: 'Example', w: 140 }, { label: 'Result', w: 110, align: 'right', col: C.red }], rows,
        { size: 23, rh: 52, kRow: i => i < 0 ? lkK(b(0), .2, .6) : lkK(b(0), 1 + i * 1, .6), hl: i => b(1) > 0 && b(2) < 0 && (i === 3 || i === 4 || i === 5) });
      // precedence
      const kP = lkK(b(2), .2, .8);
      lkText('Order of operations', 760, 150, 28, C.chalk, kP, 'left', 700);
      [['**', 'first'], ['*   /   //   %', 'then'], ['+   -', 'last']].forEach(([o, w], i) => { const k = lkK(b(2), 1.2 + i * 1.2, .6); lkBadge(i + 1, 780, 210 + i * 56, 20, k); lkCode(o, 815, 210 + i * 56, 26, C.chalk, k); lkText(w, 1090, 210 + i * 56, 22, C.dim, k); });
      res('2 + 4 * 5', '22', 780, 430, lkK(b(3), .4, .7), 28);
      res('(2 + 4) * 5', '30', 780, 490, lkK(b(3), 4, .7), 28);
      lkText('use parentheses when in doubt', 780, 550, 22, C.red, lkK(b(3), 5, .8), 'left', 700);
    } },

    { title: 'Floor division, modulus, and powers', draw(u, b) {
      lkCodeBlock(60, 140, 600, ['minutes = 135', 'hours = minutes // 60', 'leftover = minutes % 60', 'print(hours, "hours and", leftover, "minutes")', { out: '2 hours and 15 minutes' }],
        { size: 21, k: lkK(b(0), .3, .6), kLine: i => i === 0 ? lkK(b(0), 1, .6) : lkK(b(1), (i - 1) * 1.2, .7) });
      // a clock: 2 full hours + 15 minutes
      const kC = lkK(b(1), 1.5, 1);
      [0, 1, 2].forEach(i => { const cx = 820 + i * 150, cy = 230, k = lkK(b(1), 1.5 + i * .8, .7); lkCircle(cx, cy, 55, k, i < 2 ? C.chalk : C.red, 4, i < 2 ? C.chalkFill : null);
        if (i < 2) lkText('60', cx, cy, 30, C.chalk, k, 'center', 700);
        else { X.save(); X.globalAlpha *= k; X.beginPath(); X.moveTo(cx, cy); X.arc(cx, cy, 55, -Math.PI / 2, 0); X.closePath(); X.fillStyle = C.redFill; X.fill(); X.restore(); lkText('15', cx + 18, cy - 14, 24, C.chalk, k, 'center', 700); } });
      lkText('// 60 → 2 hours', 820, 330, 24, C.chalk, kC, 'center'); lkText('% 60 → 15 min', 1120, 330, 24, C.red, lkK(b(1), 3.2, .7), 'center', 700);
      lkLine([[60, 400], [1260, 400]], lkK(b(2), 0, .6), C.ghost, 3);
      lkText('Future value of $1,000 at 5% for 10 years', 60, 450, 26, C.chalk, lkK(b(2), .3, 1.2), 'left', 700);
      lkText('1000 × (1 + 0.05)¹⁰', 60, 520, 40, C.chalk, lkK(b(2), 2.4, 1.4), 'left', 500);
      res('1000 * (1 + 0.05) ** 10', '1628.894626777442', 600, 520, lkK(b(2), 5, 1), 24);
      lkText('≈ $1,629', 1100, 580, 30, C.red, lkK(b(3), .3, .8), 'center', 700);
    } },

    { title: 'Augmented assignment', draw(u, b) {
      lkCode('a += b', 330, 180, 48, C.red, lkK(b(1), .2, .8), 'center'); lkText('means', 560, 180, 28, C.dim, lkK(b(1), 1, .6), 'center'); lkCode('a = a + b', 820, 180, 48, C.chalk, lkK(b(1), 1.4, .8), 'center');
      ['-=', '*=', '/=', '//=', '%=', '**='].forEach((o, i) => lkCode(o, 300 + i * 130, 260, 30, C.chalk, lkK(b(1), 3 + i * .3, .5), 'center'));
      lkText('a shorthand for every arithmetic operator', 660, 310, 22, C.dim, lkK(b(0), 2, 1), 'center');
      lkCodeBlock(100, 370, 520, ['balance = 100', 'balance += 25    # deposit', 'balance -= 40    # withdrawal', 'balance *= 1.02  # 2% interest', 'balance', { out: '86.7' }],
        { size: 23, lh: 34, k: lkK(b(2), .2, .6), kLine: i => lkK(b(2), .6 + i * 1.1, .6) });
      const vals = ['100', '125', '85', '86.7']; vals.forEach((v, i) => { const k = lkK(b(2), .8 + i * 1.1, .6), x = 720 + i * 140; lkCircle(x, 460, 46, k, i === 3 ? C.red : C.chalk, 4); lkCode(v, x, 462, 24, C.chalk, k, 'center'); if (i) lkArrow([[x - 92, 460], [x - 50, 460]], k, C.red, 3, { head: 10 }); });
    } },

    { title: 'Comparison operators', draw(u, b) {
      lkTable(60, 125, [{ label: 'Operator', w: 140 }, { label: 'Meaning', w: 330, mono: false }], [['a == b', 'equal to'], ['a != b', 'not equal to'], ['a < b', 'less than'], ['a > b', 'greater than'], ['a <= b', 'less than or equal to'], ['a >= b', 'greater than or equal to']],
        { size: 23, rh: 46, kRow: i => i < 0 ? lkK(b(1), .1, .6) : lkK(b(1), .4 + i * .8, .6) });
      lkText('→ True or False', 330, 470, 26, C.red, lkK(b(0), 1, .8), 'center', 700);
      lkRule('=  assigns    ==  compares', 330, 560, 500, lkK(b(2), .3, .9), 28);
      lkCode('inventory = 25', 700, 150, 28, C.chalk, lkK(b(3), .2, .7));
      [['inventory == 25', 'True', .8], ['inventory < 10', 'False', 2.8], ['inventory % 2 == 1', 'True', 5]].forEach(([c, r, d], i) => res(c, r, 700, 220 + i * 60, lkK(b(3), d, .7), 26, 1080));
      lkText('(25 is odd)', 1190, 340, 20, C.dim, lkK(b(3), 7.5, .7), 'left');
      res('15 < inventory < 30', 'True', 700, 440, lkK(b(4), 2, .8), 26, 1080);
      lkText('chained, as in math', 700, 490, 22, C.red, lkK(b(4), 3, .8), 'left', 700);
    } },

    { title: 'Boolean operators', draw(u, b) {
      const T = 'True', F = 'False';
      lkTable(60, 130, [{ label: 'a', w: 110 }, { label: 'b', w: 110 }, { label: 'a and b', w: 150 }, { label: 'a or b', w: 140 }, { label: 'not a', w: 130 }],
        [[T, T, T, T, F], [T, F, F, T, F], [F, T, F, T, T], [F, F, F, F, T]], { size: 23, rh: 56, kRow: i => lkK(b(1), .2 + (i + 1) * .9, .6) });
      lkText('and: both · or: at least one · not: flips', 380, 470, 23, C.dim, lkK(b(1), 5, 1), 'center');
      lkCodeBlock(720, 140, 560, ['credit_score = 710', 'income = 52000', null, '# approve: good score AND enough income', '(credit_score >= 680) and (income >= 40000)', { out: 'True' }],
        { size: 19, lh: 34, k: lkK(b(2), .2, .6), kLine: i => lkK(b(2), .5 + i * 1.1, .6) });
      lkCheck(740, 450, 30, lkK(b(2), 6.8, .5)); lkText('710 ≥ 680', 780, 450, 24, C.chalk, lkK(b(2), 6.8, .6)); lkCheck(950, 450, 30, lkK(b(2), 7.4, .5)); lkText('52,000 ≥ 40,000', 990, 450, 24, C.chalk, lkK(b(2), 7.4, .6));
      lkText('loan approved', 1000, 510, 28, C.red, lkK(b(2), 8.4, .8), 'center', 700);
    } },

    { title: 'Identity and membership', draw(u, b) {
      [['a is b', 'the same object'], ['a in b', 'a is a member of b']].forEach(([o, m], i) => { const k = lkK(b(0), .4 + i * 2.6, .7); lkCode(o, 80, 150 + i * 46, 26, C.red, k); lkText(m, 230, 150 + i * 46, 24, C.chalk, k); });
      lkCodeBlock(60, 250, 420, ['a = [1, 2, 3]', 'b = [1, 2, 3]', 'a == b', { out: 'True' }, 'a is b', { out: 'False' }], { size: 23, lh: 33, k: lkK(b(1), .2, .6), kLine: i => lkK(b(1), .4 + i * .9, .6) });
      const kO = lkK(b(1), 2.4, .7);
      [0, 1].forEach(i => { lkRect(530 + i * 190, 300, 160, 56, kO, C.chalk, 3); lkCode('[1, 2, 3]', 610 + i * 190, 328, 22, C.chalk, kO, 'center'); lkCode('ab'[i], 610 + i * 190, 400, 28, C.chalk, kO, 'center'); lkArrow([[610 + i * 190, 380], [610 + i * 190, 362]], kO, C.red, 3, { head: 8 }); });
      lkText('equal, but two objects', 705, 450, 22, C.red, lkK(b(1), 5, .7), 'center', 700);
      lkRule('use == for values · use is for None', 340, 580, 560, lkK(b(2), .3, .9), 24);
      [['2 in [1, 2, 3]', 'True'], ['"there" in "Hello there"', 'True']].forEach(([c, r], i) => res(c, r, 680, 500 + i * 56, lkK(b(3), .8 + i * 2, .7), 24, 1080));
      lkText('lists and strings', 1210, 528, 22, C.dim, lkK(b(3), 3.6, .8), 'left');
    } },

    { title: 'Operators on strings and lists', draw(u, b) {
      [['"data" + "base"', "'database'"], ['"ha" * 3', "'hahaha'"], ['[1, 2] + [3, 4]', '[1, 2, 3, 4]']].forEach(([c, r], i) => res(c, r, 60, 160 + i * 56, lkK(b(1), .2 + i * 1.2, .7), 26, 380));
      lkText('+ joins · * repeats', 230, 340, 24, C.dim, lkK(b(1), 4, .8), 'center');
      lkCodeBlock(640, 130, 640, ['num1 + hard_skills', { err: 'TypeError: unsupported operand type(s) for +' }, 'hard_skills + [num1]', { out: "['Java', 'Python', 5]" },
        'word1 + str(num1)', { out: "'Java5'" }], { size: 20, lh: 34, k: lkK(b(2), .2, .6), kLine: i => lkK(b(2), .4 + i * .9, .6) });
      lkLine([[40, 400], [1280, 400]], lkK(b(3), 0, .5), C.ghost, 3);
      lkText('Strings compare character by character, by character code', 660, 440, 26, C.chalk, lkK(b(3), .2, 1.4), 'center', 700);
      res('"Java" < "Python"', 'True', 220, 510, lkK(b(3), 3.6, .7), 26);
      lkText('"J" comes before "P"', 340, 560, 22, C.dim, lkK(b(3), 4.4, .7), 'center');
      res('"Zebra" < "apple"', 'True', 760, 510, lkK(b(3), 7.4, .7), 26);
      lkText('uppercase before lowercase', 900, 560, 22, C.red, lkK(b(3), 8.2, .7), 'center', 700);
    } },

    { title: 'Workout', draw(u, b) {
      lkCodeBlock(40, 125, 600, ['import random', 'random.seed(3030)   # reproducible', 'number = random.randint(1, 10)', 'number % 2 == 1          # arithmetic', 'number in [1, 3, 5, 7, 9]   # membership'],
        { size: 20, lh: 34, k: lkK(b(0), .2, .6), kLine: i => i < 3 ? lkK(b(0), .8 + i * .8, .6) : lkK(b(1), (i - 3) * 3.4 + .8, .8) });
      // the decision tree
      const kT = i => lkK(b(2), .3 + i * .7, .6), red = C.red;
      lkText('Outlook?', 870, 150, 28, C.chalk, kT(0), 'center', 700);
      [['Sunny', 720, 'Humidity?', [['High', 'don\'t play'], ['Normal', 'play']]], ['Overcast', 880, null, 'play'], ['Rain', 1080, 'Wind?', [['Strong', 'don\'t play'], ['Weak', 'play']]]].forEach(([n, x, q, leaf], i) => {
        lkLine([[870, 170], [x, 215]], kT(i + 1), C.dim, 3); lkText(n, x, 235, 23, C.chalk, kT(i + 1), 'center', 700);
        if (!q) { lkText(leaf, x, 300, 23, red, kT(i + 1), 'center', 700); return; }
        lkText(q, x, 285, 22, C.chalk, kT(i + 1), 'center'); leaf.forEach(([a, r], j) => { const xx = x - 70 + j * 140; lkLine([[x, 300], [xx, 330]], kT(i + 1), C.dim, 2); lkText(a, xx, 348, 19, C.dim, kT(i + 1), 'center'); lkText(r, xx, 376, 20, r === 'play' ? red : C.chalk, kT(i + 1), 'center', 700); });
      });
      lkCodeBlock(40, 420, 1240, ['play = ((outlook == "Sunny" and humidity == "Normal")', '        or outlook == "Overcast"', '        or (outlook == "Rain" and wind == "Weak"))'],
        { size: 22, lh: 34, k: lkK(b(3), .2, .6), kLine: i => lkK(b(3), .6 + i * 1.4, .8) });
    } },

    { title: 'Summary', draw(u, b) {
      lkList(120, 170, [
        { text: 'Arithmetic:  +  -  *  /  //  %  **  — parentheses make the order explicit.', mark: 'check', k: lkK(b(1), .2, .9) },
        { text: 'x += 1 is shorthand for x = x + 1 (works for every operator).', mark: 'check', k: lkK(b(2), .2, .9) },
        { text: 'Comparisons return True / False and can be chained.', mark: 'check', k: lkK(b(3), .2, .9) },
        { text: 'Combine conditions with and, or, not.', mark: 'check', k: lkK(b(3), 2.6, .9) },
        { text: '== compares values; is compares identity (use it with None); in tests membership.', mark: 'check', k: lkK(b(4), .2, .9) },
      ], { size: 26, gap: 76 });
      lkText('Next: the Module 4 drill  →  Module 5: Built-in types', 660, 600, 26, C.red, lkK(b(4), 4, 1), 'center', 700);
    } },
  ];

  lecture({
    footer: 'BUSN 3030E · Module 4 · Operators',
    panels,
  });
})();
