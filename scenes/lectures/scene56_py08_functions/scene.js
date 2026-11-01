// Scene 56: Python lecture, Module 8 · Functions. The black board takes centre stage; ten panels chalk themselves on in
// step with the voice-over (asset.js → narration). Built with scene 49's lecture_kit.js.
// Board coords: 1320 × 680, y down; the header sits above y 100 and the footer at y 650.
(() => {
  const C = LK;
  const res = (code, out, x, y, k, size = 24, ox) => { lkPyLine(code, x, y, size, k); lkCode('→ ' + out, ox ?? x + lkMeasure(code, size, 500, LK_MONO) + 24, y, size, C.red, k); };
  const seq = (b, line, d0, step) => i => lkK(b(line), d0 + i * step, .6);

  const panels = [
    { title: 'Functions', draw(u, b) {
      lkTitle(u, b, 8, 'Functions', [['def, return,', 'docstrings', 2, .6], ['defaults and', 'keywords', 2, 3.4], ['lambda', 'expressions', 2, 5.4], ['functions as', 'arguments', 2, 6.6]]);
      lkText('write once · use many times · test in small pieces', 660, 610, 24, C.dim, lkK(b(1), 2, 1.4), 'center');
    } },

    { title: 'Calling functions', draw(u, b) {
      ['print()', 'len()', 'type()', 'round()'].forEach((f, i) => lkCode(f, 200 + i * 300, 160, 32, C.chalk, lkK(b(0), 1.4 + i * .5, .5), 'center'));
      res('print("Q1", "Q2", "Q3")', 'Q1 Q2 Q3', 120, 270, lkK(b(1), .3, .7), 28);
      res('print("Q1", "Q2", "Q3", sep=" | ")', 'Q1 | Q2 | Q3', 120, 340, lkK(b(1), 3, .7), 28);
      lkText('positional', 300, 390, 22, C.dim, lkK(b(1), 1.2, .6), 'center'); lkText('keyword argument', 600, 390, 22, C.red, lkK(b(1), 4, .6), 'center', 700);
      lkLoop(600, 340, 86, 24, lkK(b(1), 4.4, .6));
      lkRule('help(print)   or   print?', 660, 530, 600, lkK(b(2), .3, .9), 30);
    } },

    { title: 'Defining a function', draw(u, b) {
      const kD = lkK(b(0), .2, .6);
      lkCodeBlock(60, 130, 760, ['def net_price(price, discount):', '    """Return the price after a fractional discount."""', '    return price * (1 - discount)', null, 'net_price(80, 0.25)', { out: '60.0' }],
        { size: 20, lh: 36, k: kD, kLine: i => i === 0 ? lkK(b(0), .6, 1) : i === 1 ? lkK(b(2), .3, 1.2) : i === 2 ? lkK(b(1), .3, .8) : lkK(b(1), 2.4 + (i - 4) * .8, .6) });
      [['def', 85], ['name', 240], ['parameters', 420]].forEach(([w, x], i) => lkText(w, x, 115, 18, C.red, lkK(b(0), 1.6 + i * .8, .5), 'center', 700));
      lkText('docstring', 840, 202, 22, C.red, lkK(b(2), 1.4, .6), 'left', 700); lkText('return', 840, 238, 22, C.red, lkK(b(1), 1, .6), 'left', 700);
      lkLine([[78, 182], [78, 250]], lkK(b(0), 4, .6), C.red, 4); lkText('indented body', 840, 267, 22, C.red, lkK(b(0), 4.4, .6), 'left', 700);
      res('net_price(80, 0.25) + net_price(120, 0.10)', '168.0', 60, 420, lkK(b(3), .3, .8), 21);
      lkCodeBlock(60, 455, 760, ['def summarize(values):', '    return min(values), max(values), sum(values) / len(values)', 'low, high, average = summarize([1200, 950, 1430, 870, 1610])'],
        { size: 18, lh: 32, k: lkK(b(3), 4, .6), kLine: seq(b, 3, 4.2, .8) });
      lkCode('870 1610 1212.0', 860, 560, 22, C.red, lkK(b(3), 7.4, .7)); lkText('several values, unpacked', 860, 520, 20, C.dim, lkK(b(3), 7, .7));
    } },

    { title: 'return versus print', draw(u, b) {
      lkCodeBlock(60, 140, 560, ['def add_tax_print(amount):', '    print(amount * 1.08)', null, 'total = add_tax_print(50) + 10'], { size: 22, k: lkK(b(0), .2, .6), kLine: seq(b, 0, .6, .6) });
      lkCodeBlock(700, 140, 560, ['def add_tax(amount):', '    return amount * 1.08', null, 'total = add_tax(50) + 10'], { size: 22, k: lkK(b(2), .2, .6), kLine: seq(b, 2, .4, .6) });
      lkCode('54.0', 80, 330, 22, C.red, lkK(b(1), .4, .6)); lkCode('TypeError: NoneType + int', 80, 370, 21, C.red, lkK(b(1), 3, .7));
      lkText('returns None: the result is lost', 340, 430, 23, C.chalk, lkK(b(1), 4, .8), 'center', 700); lkCross(340, 490, 46, lkK(b(1), 5, .6));
      lkCode('total → 64.0', 720, 330, 22, C.red, lkK(b(2), 2.6, .6)); lkCheck(980, 490, 46, lkK(b(2), 3.4, .6), C.red);
      lkRule('return the value; print it where you call the function', 660, 590, 1000, lkK(b(2), 1.4, .9), 25);
    } },

    { title: 'Default and keyword arguments', draw(u, b) {
      lkCodeBlock(40, 125, 820, ['def net_price(price, discount=0.0, tax_rate=0.08):', '    return price * (1 - discount) * (1 + tax_rate)'], { size: 21, k: lkK(b(0), .2, .6), kLine: seq(b, 0, .6, 1) });
      lkText('defaults come after the parameters without them', 880, 160, 20, C.red, lkK(b(0), 4, .8), 'left', 700);
      res('net_price(100)', '108.0', 60, 260, lkK(b(1), .4, .7), 24, 560); res('net_price(100, 0.2)', '86.4', 60, 310, lkK(b(1), 4, .7), 24, 560);
      res('net_price(100, tax_rate=0.0, discount=0.5)', '50.0', 60, 380, lkK(b(2), .4, .8), 24, 760);
      lkText('any order · self-explanatory', 60, 425, 21, C.dim, lkK(b(2), 2.6, .8));
      lkCodeBlock(40, 465, 820, ['def catch_all(*args, **kwargs): print(args, kwargs)', 'catch_all(1, 2, 3, a=4, b=5)', { out: "(1, 2, 3) {'a': 4, 'b': 5}" }], { size: 20, k: lkK(b(3), .2, .6), kLine: seq(b, 3, .5, 1.2) });
      lkText('*args → a tuple', 900, 520, 22, C.chalk, lkK(b(3), 3, .6)); lkText('**kwargs → a dict', 900, 560, 22, C.chalk, lkK(b(3), 3.8, .6));
    } },

    { title: 'Variables inside functions are local', draw(u, b) {
      lkCodeBlock(60, 140, 560, ['def add_tax(amount):', '    tax = amount * 0.08   # local', '    return amount + tax', null, 'print(add_tax(50))', { out: '54.0' }, 'print(tax)', { err: "NameError: name 'tax' is not defined" }],
        { size: 21, lh: 36, k: lkK(b(0), .2, .6), kLine: i => i < 6 ? lkK(b(0), .6 + i * .6, .6) : lkK(b(1), .4 + (i - 6) * 1.2, .6) });
      // a sealed box: inside / outside
      const kB = lkK(b(0), 2, .8);
      lkRect(720, 170, 500, 230, kB, C.red, 4, C.redFill); lkText('inside add_tax', 970, 200, 22, C.red, kB, 'center', 700);
      lkCode('amount', 830, 270, 26, C.chalk, kB, 'center'); lkCode('tax', 1110, 270, 26, C.chalk, kB, 'center');
      lkText('exists only while it runs', 970, 350, 21, C.dim, lkK(b(0), 3.4, .8), 'center');
      lkArrow([[620, 285], [715, 285]], lkK(b(2), .4, .6), C.chalk, 4); lkText('arguments in', 660, 255, 18, C.dim, lkK(b(2), .4, .6), 'center');
      lkArrow([[1225, 300], [1280, 300], [1280, 450], [970, 450]], lkK(b(2), 3, .8), C.chalk, 4); lkText('return out', 1120, 475, 18, C.dim, lkK(b(2), 3, .6), 'center');
    } },

    { title: 'lambda and functions as arguments', draw(u, b) {
      res('add = lambda x, y: x + y;  add(1, 2)', '3', 60, 150, lkK(b(0), .4, .9), 23);
      lkText('one expression, returned automatically', 60, 192, 20, C.dim, lkK(b(0), 3, .8));
      lkCodeBlock(60, 225, 560, ['def apply_twice(f, x):', '    return f(f(x))', 'apply_twice(increase, 4)', { out: '6' }, 'apply_twice(lambda x: x * x, 5)', { out: '625' }], { size: 20, lh: 32, k: lkK(b(1), .2, .6), kLine: seq(b, 1, .5, .9) });
      lkText('increase, not increase(): the function itself', 340, 470, 19, C.red, lkK(b(1), 5, .8), 'center', 700);
      lkCode('numbers = [2, 4, 3, 5, 1, 6, -2, -20]', 680, 150, 20, C.chalk, lkK(b(2), .3, .8));
      [['sorted(numbers)', '[-20, -2, 1, 2, 3, 4, 5, 6]'], ['sorted(numbers, key=abs)', '[1, 2, -2, 3, 4, 5, 6, -20]'], ['sorted(numbers, key=lambda x: -x)', '[6, 5, 4, 3, 2, 1, -2, -20]']]
        .forEach(([c, r], i) => { const k = lkK(b(2), 1.4 + i * 1.6, .7), y = 205 + i * 72; lkPyLine(c, 680, y, 20, k); lkCode('→ ' + r, 700, y + 30, 20, C.red, k); });
      lkPyLine('sorted(departments, key=len, reverse=True)', 680, 440, 19, lkK(b(2), 7, .8)); lkCode("→ ['Operations', 'Marketing', 'Finance', 'IT', 'HR']", 700, 472, 19, C.red, lkK(b(2), 8, .7));
      lkRule('key = a function that computes what to sort by', 660, 575, 900, lkK(b(2), 3, .9), 24);
    } },

    { title: 'Warmup: masking text', draw(u, b) {
      lkCodeBlock(40, 125, 600, ['def mask(text):', '    return "*" * len(text)', 'mask("342-33-4432")', { out: "'***********'" }], { size: 21, k: lkK(b(0), .2, .6), kLine: seq(b, 0, .6, .8) });
      lkCodeBlock(40, 330, 600, ['mask = lambda text: "*" * len(text)', null, 'def mask(text, masking_character="*"):', '    return masking_character * len(text)', 'mask("342-33-4432", "#")', { out: "'###########'" }],
        { size: 20, lh: 34, k: lkK(b(1), .2, .6), kLine: seq(b, 1, .4, .8) });
      lkCodeBlock(680, 125, 600, ['def is_number(word):', '    has_digit = False', '    for character in word:', '        if character not in "0123456789-":', '            return False', '        if character.isdigit():', '            has_digit = True', '    return has_digit'],
        { size: 18, lh: 30, k: lkK(b(2), .2, .6), kLine: seq(b, 2, .3, .45) });
      lkCodeBlock(680, 410, 600, ['def is_number(word):', '    return word.replace("-", "").isdigit()', 'is_number("333-333"), is_number("--")', { out: '(True, False)' }],
        { size: 18, lh: 30, k: lkK(b(2), 5, .6), kLine: seq(b, 2, 5.4, .8) });
    } },

    { title: 'Workout: classify a message', draw(u, b) {
      lkCodeBlock(40, 125, 760, ['def classify(message, is_sensitive=is_number):', '    for word in message.split():', '        if is_sensitive(word):', '            message = message.replace(word, mask(word))', '    return message'],
        { size: 20, lh: 33, k: lkK(b(0), .2, .6), kLine: i => i === 0 ? lkK(b(1), 2.6, 1) : lkK(b(0), .5 + i * .7, .6) });
      lkLoop(452, 152, 142, 20, lkK(b(1), 4, .7)); lkText('a function as a parameter', 830, 158, 22, C.red, lkK(b(1), 4.4, .7), 'left', 700);
      lkCode('def is_email(word): return "@" in word and not word.startswith("@")', 40, 340, 18, C.chalk, lkK(b(1), 1, 1));
      lkPyLine('classify(msg, lambda word: is_email(word) or is_number(word))', 40, 400, 21, lkK(b(2), .5, 1));
      ['the client number is ************ and her social', 'is *********** email is **************************'].forEach((l, i) => lkCode(l, 60, 450 + i * 34, 20, C.red, lkK(b(2), 3 + i * .6, .8)));
      lkRule('new sensitive data → a new test function, same classify', 660, 580, 1000, lkK(b(3), .3, .9), 24);
    } },

    { title: 'Summary', draw(u, b) {
      lkList(110, 170, [
        { text: 'def name(parameters): with a docstring; send results back with return.', mark: 'check', k: lkK(b(1), .2, .9) },
        { text: 'Parameters can have defaults; pass arguments by position or by keyword.', mark: 'check', k: lkK(b(2), .2, .9) },
        { text: 'Variables created inside a function are local to it.', mark: 'check', k: lkK(b(2), 4, .9) },
        { text: 'lambda arguments: expression creates a small anonymous function.', mark: 'check', k: lkK(b(3), .2, .9) },
        { text: 'Functions are objects: pass them to other functions, e.g. sorted(items, key=len).', mark: 'check', k: lkK(b(3), 3, .9) },
      ], { size: 25, gap: 76 });
      lkText('Next: the Module 8 drill  →  Module 9: Built-in data structures', 660, 600, 26, C.red, lkK(b(3), 6, 1), 'center', 700);
    } },
  ];

  lecture({
    footer: 'BUSN 3030E · Module 8 · Functions',
    panels,
    focus: [{ panel: 3, line: 0, to: 3, rect: [40, 110, 1000, 260] }],
  });
})();
