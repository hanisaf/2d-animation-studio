// Scene 51: Python lecture, Module 3 · Variables. The black board takes centre stage; ten panels chalk themselves on in
// step with the voice-over (asset.js → narration). Built with scene 49's lecture_kit.js.
// Board coords: 1320 × 680, y down; the header sits above y 100 and the footer at y 650.
(() => {
  const C = LK;
  // a name tag pointing at an object box
  function ref(name, nx, ny, ox, oy, k, o = {}) {
    if (k <= 0) return;
    lkCode(name, nx, ny, o.size ?? 32, C.chalk, k, 'center');
    lkArrow([[nx + (o.dx ?? 30), ny], [ox - 12, oy]], k, o.col ?? C.red, 4, { head: 12, dash: o.dash });
  }
  const obj = (txt, x, y, w, k, sub, col = C.chalk) => {
    if (k <= 0) return;
    lkRect(x, y - 34, w, 68, k, col, 4, C.chalkFill); lkCode(txt, x + w / 2, y, 28, C.chalk, k, 'center');
    if (sub) lkText(sub, x + w / 2, y + 58, 20, C.dim, k, 'center');
  };

  const panels = [
    { title: 'Variables', draw(u, b) {
      lkTitle(u, b, 3, 'Variables', [['read Python', 'syntax', 1, 1], ['create and', 'name variables', 1, 3.4], ['variables as', 'references', 2, .6], ['types and', 'methods', 2, 3.6]]);
    } },

    { title: 'Anatomy of a Python program', draw(u, b) {
      const code = ['# set the midpoint', 'midpoint = 5', null, 'lower = []', 'upper = []', null, 'for i in range(10):', '    if i < midpoint:',
        '        lower.append(i)', '    else:', '        upper.append(i)', null, 'print("lower:", lower)'];
      const sz = 20, lh = 31, top = 118, cw = lkMeasure('M', sz, 500, LK_MONO), lx = 56, ly = i => top + 16 * .7 + lh * (i + .5);
      lkCodeBlock(40, top, 560, code, { size: sz, lh, k: lkK(b(0), .2, .6), kLine: i => lkK(b(0), .6 + i * .35, .5) });
      // annotations
      const kc = lkK(b(1), 1, .8); lkLoop(lx + 9 * cw, ly(0), 9.5 * cw + 14, 18, kc); lkText('comments: # …', 680, 156, 26, C.chalk, kc, 'left', 700);
      lkText('Python ignores the rest of the line', 680, 190, 21, C.dim, lkK(b(1), 2.4, .8));
      const ks = lkK(b(2), .3, .8); lkText('one statement per line, no ;', 680, 250, 26, C.chalk, ks, 'left', 700);
      lkArrow([[670, 250], [lx + 13 * cw, ly(1)]], ks, C.red, 3, { head: 11 });
      const ki = lkK(b(3), .3, .8); lkText('a colon : opens an indented block', 680, 320, 26, C.chalk, ki, 'left', 700);
      lkLoop(lx + 18.5 * cw, ly(6), 14, 16, lkK(b(3), 1.2, .5)); lkLoop(lx + 19.5 * cw, ly(7), 14, 16, lkK(b(3), 1.4, .5));
      lkLine([[lx + cw, ly(7) - 12], [lx + cw, ly(10) + 12]], lkK(b(3), 2, .8), C.red, 4);
      lkLine([[lx + 5 * cw, ly(8) - 12], [lx + 5 * cw, ly(8) + 12]], lkK(b(3), 3, .6), C.red, 4); lkLine([[lx + 5 * cw, ly(10) - 12], [lx + 5 * cw, ly(10) + 12]], lkK(b(3), 3.2, .6), C.red, 4);
      lkText('four spaces per level', 680, 354, 21, C.dim, lkK(b(3), 4.5, .8));
      const kp = lkK(b(4), .3, .8); lkText('parentheses group or call', 680, 420, 26, C.chalk, kp, 'left', 700);
      lkCode('2 * (3 + 4)', 700, 470, 24, C.chalk, lkK(b(4), 1, .7)); lkText('group  → 14', 900, 470, 22, C.red, lkK(b(4), 1.6, .7));
      lkCode('print("lower:", lower)', 700, 515, 24, C.chalk, lkK(b(4), 2.2, .7)); lkText('call', 1080, 515, 22, C.red, lkK(b(4), 2.8, .7));
      lkCode('lower: [0, 1, 2, 3, 4]', 56, 600, 20, C.red, lkK(b(0), 6, .6)); lkCode('upper: [5, 6, 7, 8, 9]', 356, 600, 20, C.red, lkK(b(0), 6.6, .6));
    } },

    { title: 'Creating variables', draw(u, b) {
      lkCode('name = value', 660, 160, 44, C.chalk, lkK(b(0), .3, 1), 'center');
      lkText('name', 545, 210, 22, C.red, lkK(b(0), 3, .6), 'center', 700); lkText('value', 790, 210, 22, C.red, lkK(b(0), 3.6, .6), 'center', 700);
      lkCodeBlock(80, 250, 520, ['price = 19.99', 'quantity = 3', 'revenue = price * quantity', 'revenue', { out: '59.97' }],
        { size: 26, k: lkK(b(0), 4, .6), kLine: i => i < 4 ? lkK(b(0), 4.4 + i * .8, .6) : lkK(b(1), 1.6, .6) });
      // = means assign
      const kA = lkK(b(2), .2, .8);
      lkText('=  means  assign,  not  equals', 960, 270, 30, C.red, kA, 'center', 700);
      lkCode('quantity = quantity + 1', 960, 340, 28, C.chalk, lkK(b(2), 1.6, .9), 'center');
      lkText('nonsense in algebra…', 960, 390, 22, C.dim, lkK(b(2), 3.4, .8), 'center');
      lkText('① compute  quantity + 1  → 4', 760, 450, 25, C.chalk, lkK(b(3), .6, 1));
      lkText('② make quantity refer to it', 760, 495, 25, C.chalk, lkK(b(3), 2.6, 1));
      obj('4', 1140, 570, 90, lkK(b(3), 3.8, .6)); ref('quantity', 900, 570, 1140, 570, lkK(b(3), 4.2, .6), { dx: 82, size: 26 });
    } },

    { title: 'Naming variables', draw(u, b) {
      lkText('Rules', 60, 150, 32, C.red, lkK(b(0), .2, .6), 'left', 700);
      lkList(80, 210, [
        { text: 'letters, digits and _', mark: 'check', k: lkK(b(0), .6, .8) },
        { text: 'not starting with a digit', sub: '2nd_quarter', subCode: true, mark: 'cross', k: lkK(b(0), 2.6, .8) },
        { text: 'not a keyword', sub: 'for   if   class', subCode: true, mark: 'cross', k: lkK(b(0), 4.6, .8) },
        { text: 'case sensitive: Revenue ≠ revenue', mark: 'dot', k: lkK(b(1), .3, .9) },
      ], { size: 26, gap: 92 });
      lkLine([[660, 140], [660, 600]], lkK(b(2), 0, .6), C.ghost, 3);
      lkText('Conventions', 700, 150, 32, C.red, lkK(b(2), .2, .6), 'left', 700);
      lkText('snake_case: lowercase, words joined by _', 710, 210, 25, C.chalk, lkK(b(2), .8, 1.2));
      lkCode('total_revenue   seconds_per_hour', 710, 255, 24, C.chalk, lkK(b(2), 3, 1));
      lkText('describe the content', 710, 335, 25, C.chalk, lkK(b(3), .3, .9));
      [['unit_price', 'check'], ['p', 'cross'], ['x1', 'cross']].forEach(([n, m], i) => {
        const k = lkK(b(3), 1.2 + i * .8, .6), y = 400 + i * 60;
        (m === 'check' ? lkCheck : lkCross)(730, y, 26, k, C.red); lkCode(n, 770, y, 28, C.chalk, k);
      });
      lkCodeBlock(700, 570, 580, ['x = 59.97   # legal, but says nothing'], { size: 21, k: lkK(b(3), 3.6, .6), kLine: () => lkK(b(3), 3.8, .8) });
    } },

    { title: 'Variables are references', draw(u, b) {
      lkText('A variable refers to an object in memory', 660, 150, 32, C.chalk, lkK(b(0), .4, 1.6), 'center', 700);
      // memory: three objects; x points to each in turn
      const objs = [['1', 'int', 300], ['"hello"', 'str', 600], ['[1, 2, 3]', 'list', 930]];
      const step = b(1) < 0 ? -1 : b(1) < 2.4 ? 0 : b(1) < 4.4 ? 1 : 2;
      lkRect(160, 260, 1000, 200, lkK(b(0), 2, .8), C.faint, 3); lkText('memory', 180, 285, 20, C.dim, lkK(b(0), 2, .8));
      objs.forEach(([v, t, x], i) => obj(v, x - 90, 380, 180, lkK(b(1), i * 2.2 - .2, .6), t));
      lkCode('x', 660, 560, 40, C.chalk, lkK(b(1), 0, .6), 'center');
      if (step >= 0) lkArrow([[660, 530], [objs[step][2], 420]], lkK(b(1), [0, 2.4, 4.4][step], .5), C.red, 5, { head: 14 });
      lkText('dynamically typed', 1000, 560, 24, C.red, lkK(b(1), 5, .8), 'left', 700);
      lkText('the type belongs to the object, not the name', 660, 615, 24, C.dim, lkK(b(2), .3, 1.2), 'center');
    } },

    { title: 'Two names, one object', draw(u, b) {
      // a shared list
      lkCodeBlock(40, 130, 380, ['x = [1, 2, 3]', 'y = x', 'x.append(4)', 'print("y =", y)', { out: 'y = [1, 2, 3, 4]' }],
        { size: 23, k: lkK(b(0), .2, .6), kLine: i => lkK(b(1), [0, 1.2, 3, 4.8, 6][i], .6) });
      const kL = lkK(b(1), .3, .6), grown = b(1) > 3.4;
      obj(grown ? '[1, 2, 3, 4]' : '[1, 2, 3]', 470, 230, 230, kL); lkText('one list', 715, 230, 20, C.dim, kL);
      ref('x', 540, 380, 560, 270, lkK(b(1), .6, .5), { dx: 0 }); ref('y', 640, 380, 620, 270, lkK(b(1), 1.6, .5), { dx: 0 });
      lkText('changed through x, seen through y', 590, 440, 21, C.red, lkK(b(1), 5, .8), 'center', 700);
      lkLine([[770, 130], [770, 600]], lkK(b(2), 0, .5), C.ghost, 3);
      // numbers: a new object
      lkText('numbers and strings can\'t change in place', 1040, 150, 22, C.dim, lkK(b(2), .3, 1), 'center');
      lkCodeBlock(810, 190, 260, ['x = 10', 'y = x', 'x = x + 5'], { size: 23, k: lkK(b(2), 1, .6), kLine: i => lkK(b(3), i * .9, .6) });
      const k10 = lkK(b(3), .2, .5), k15 = lkK(b(3), 2.2, .6);
      obj('10', 830, 430, 120, k10); obj('15', 1110, 430, 120, k15, null, C.red); lkText('a new object', 1170, 372, 20, C.red, k15, 'center', 700);
      lkCode('y', 890, 560, 32, C.chalk, k10, 'center'); lkArrow([[890, 535], [890, 475]], k10, C.red, 4, { head: 12 });
      lkCode('x', 1170, 560, 32, C.chalk, k10, 'center');
      lkArrow([[1160, 535], b(3) > 2.6 ? [1170, 475] : [910, 475]], k10, C.red, 4, { head: 12 });
      lkText('only x moves', 1170, 610, 21, C.red, lkK(b(3), 3.4, .7), 'center', 700);
    } },

    { title: 'Everything is an object', draw(u, b) {
      [['type(4)', 'int'], ['type("hello")', 'str'], ['type(3.14159)', 'float']].forEach(([c, r], i) => {
        const k = lkK(b(0), 2.4 + i * .9, .6), y = 160 + i * 52; lkPyLine(c, 80, y, 26, k); lkCode(r, 400, y, 26, C.red, k);
      });
      lkText('the type is attached to the object', 80, 330, 22, C.dim, lkK(b(0), 5, .9));
      lkText('attributes = data · methods = functions', 900, 160, 25, C.chalk, lkK(b(1), .3, 1.2), 'center', 700);
      lkCode('object.method()', 900, 210, 34, C.red, lkK(b(1), 3, .8), 'center');
      lkText('a dot, then parentheses to call it', 900, 255, 20, C.dim, lkK(b(1), 4.2, .8), 'center');
      const rows = [['greeting = "hello"', null], ['greeting.upper()', "'HELLO'"], ['amount = 4.5', null], ['amount.is_integer()', 'False'], ['amount.as_integer_ratio()', '(9, 2)']];
      rows.forEach(([c, r], i) => { const k = lkK(b(2), .3 + i * 1.1, .6), y = 360 + i * 44; lkPyLine(c, 600, y, 24, k); if (r) lkCode('→ ' + r, 1000, y, 24, C.red, k); });
      lkRule('Tip: name + . + Tab lists methods ·  name?  shows help', 660, 600, 1100, lkK(b(3), .3, .9), 24);
    } },

    { title: 'Values typed by a user', draw(u, b) {
      lkCodeBlock(80, 140, 760, ['answer = input("Enter a temperature: ")'], { size: 26, k: lkK(b(0), .2, .6), kLine: () => lkK(b(0), .6, 1) });
      lkText('the user types 33', 880, 177, 24, C.dim, lkK(b(0), 2.6, .8));
      const kS = lkK(b(1), .3, .8);
      obj('"33"', 140, 330, 160, kS, 'str: text!', C.red);
      lkText('always a string, even if it looks like a number', 360, 330, 25, C.chalk, lkK(b(1), 1, 1.4));
      lkCodeBlock(80, 420, 660, ['answer = "33"', 'temperature = float(answer)', 'print(type(temperature), temperature)', { out: "<class 'float'> 33.0" }],
        { size: 23, k: lkK(b(2), .2, .6), kLine: i => lkK(b(2), .6 + i * 1.2, .6) });
      lkText('int()  or  float()', 1000, 480, 30, C.red, lkK(b(2), 1.4, .8), 'center', 700);
      lkText('before doing arithmetic', 1000, 525, 23, C.dim, lkK(b(2), 2.4, .8), 'center');
    } },

    { title: 'Workout: types and errors', draw(u, b) {
      const vals = [['4', 'int'], ['3.1415', 'float'], ['1.0', 'float'], ['2+4j', 'complex'], ["'Hello'", 'str']];
      vals.forEach(([v, t], i) => { const k = lkK(b(0), .6 + i * .5, .5), x = 120 + i * 230; lkCode(v, x, 160, 28, C.chalk, k, 'center'); lkCode(t, x, 205, 24, C.red, lkK(b(i < 2 ? 0 : 1), i < 2 ? 2.5 : (i - 2) * 2 + .4, .5), 'center'); });
      lkLoop(580, 183, 70, 46, lkK(b(1), .2, .7));
      lkCodeBlock(60, 260, 560, ['str1 + " " + str2', { out: 'Hello World' }, '4 * str1', { out: 'HelloHelloHelloHello' }],
        { size: 23, k: lkK(b(2), .2, .6), kLine: i => lkK(b(2), .5 + i * .9, .6) });
      lkText('+ concatenates · * repeats', 340, 470, 22, C.dim, lkK(b(2), 4, .8), 'center');
      lkCodeBlock(680, 260, 600, ['str1 - str2', { err: "TypeError: unsupported operand type(s) for -" }, 'str1 + 4', { err: 'TypeError: can only concatenate str (not "int")' }],
        { size: 22, k: lkK(b(3), .2, .6), kLine: i => lkK(b(3), .5 + i * 1.1, .6) });
      lkRule('Read error messages from the bottom line', 980, 545, 580, lkK(b(4), .3, .9), 24);
    } },

    { title: 'Summary', draw(u, b) {
      lkList(120, 170, [
        { text: 'A program is a sequence of statements; indentation defines blocks; # starts a comment.', mark: 'check', k: lkK(b(1), .2, .9) },
        { text: 'name = value creates or updates a variable; use descriptive snake_case names.', mark: 'check', k: lkK(b(2), .2, .9) },
        { text: 'Variables are references to objects; two names can share one object.', mark: 'check', k: lkK(b(3), .2, .9) },
        { text: 'Every object has a type (type(x)) and methods (x.method()).', mark: 'check', k: lkK(b(3), 3, .9) },
        { text: 'input() returns a string: convert with int() or float().', mark: 'check', k: lkK(b(4), .2, .9) },
      ], { size: 26, gap: 76 });
      lkText('Next: the Module 3 drill  →  Module 4: Operators', 660, 600, 26, C.red, lkK(b(4), 2, 1), 'center', 700);
    } },
  ];

  lecture({
    footer: 'BUSN 3030E · Module 3 · Variables',
    panels,
    focus: [{ panel: 2, line: 3, to: 4, rect: [40, 120, 620, 500] }, { panel: 9, line: 3, to: 4, rect: [670, 250, 620, 200] }],
  });
})();
