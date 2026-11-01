// Scene 53: Python lecture, Module 5 · Built-In Types. The black board takes centre stage; ten panels chalk themselves on
// in step with the voice-over (asset.js → narration). Built with scene 49's lecture_kit.js.
// Board coords: 1320 × 680, y down; the header sits above y 100 and the footer at y 650.
(() => {
  const C = LK;
  const res = (code, out, x, y, k, size = 26, ox) => { lkPyLine(code, x, y, size, k); if (out !== '') lkCode('→ ' + out, ox ?? x + lkMeasure(code, size, 500, LK_MONO) + 24, y, size, C.red, k); };

  const panels = [
    { title: 'Built-In Types', draw(u, b) {
      lkTitle(u, b, 5, 'Built-In Types', [['int, float, str,', 'bool, None', 1, .8], ['inexact', 'floats', 2, 1], ['convert', 'and test truth', 2, 4.4], ['format with', 'f-strings', 2, 7]]);
    } },

    { title: 'Simple types', draw(u, b) {
      const rows = [['int', 'x = 1', 'whole numbers'], ['float', 'x = 1.0', 'real numbers'], ['complex', 'x = 1 + 2j', 'complex numbers'], ['bool', 'x = True', 'True or False'], ['str', "x = 'abc'", 'text'], ['NoneType', 'x = None', '"no value"']];
      lkTable(50, 120, [{ label: 'Type', w: 170, col: C.red }, { label: 'Example', w: 200 }, { label: 'Holds', w: 230, mono: false }], rows,
        { size: 23, rh: 54, kRow: i => i < 0 ? lkK(b(0), .3, .6) : lkK(b(1), .3 + i * 1.6, .6) });
      lkPyLine('2 ** 200', 730, 160, 26, lkK(b(2), .3, .7));
      lkCode('1606938044258990275541962092341', 730, 210, 21, C.red, lkK(b(2), 1.4, 1)); lkCode('162602522202993782792835301376', 730, 240, 21, C.red, lkK(b(2), 2, 1));
      lkText('unlimited precision: no overflow', 730, 290, 22, C.dim, lkK(b(2), 3, .8));
      res('6 / 2', '3.0', 730, 390, lkK(b(3), .6, .7), 30); res('6 // 2', '3', 730, 450, lkK(b(3), 4, .7), 30);
      lkText('/ always gives a float', 1000, 390, 22, C.red, lkK(b(3), 2, .7), 'left', 700); lkText('// keeps an int', 1000, 450, 22, C.red, lkK(b(3), 5, .7), 'left', 700);
    } },

    { title: 'Floats are approximations', draw(u, b) {
      res('5e-6 == 0.000005', 'True', 60, 160, lkK(b(0), 1, .7), 24); res('1.4e6', '1400000.0', 60, 210, lkK(b(0), 3, .7), 24);
      lkText('e = "times ten to the power"', 60, 255, 21, C.dim, lkK(b(0), 4, .8));
      lkText('0.1 in binary:', 700, 160, 24, C.chalk, lkK(b(1), 2, .8)); lkCode('0.000110011001100110011…', 700, 205, 24, C.red, lkK(b(1), 3.4, 1.4)); lkText('never ends', 700, 245, 21, C.dim, lkK(b(1), 5, .8));
      res('0.1 + 0.2', '0.30000000000000004', 120, 340, lkK(b(2), .3, .8), 34);
      res('0.1 + 0.2 == 0.3', 'False', 120, 400, lkK(b(2), 2, .8), 34);
      lkList(140, 480, [
        { text: 'Never test floats with ==', sub: 'round(0.1 + 0.2, 2) == 0.3   math.isclose(0.1 + 0.2, 0.3)', subCode: true, mark: 1, k: lkK(b(3), .3, .9) },
        { text: 'Round only for display, at the very end', mark: 2, k: lkK(b(3), 6, .9) },
      ], { size: 26, gap: 92 });
    } },

    { title: 'Converting between types', draw(u, b) {
      const rows = [['float(3)', '3.0', 1, .3, 'int → float'], ['int(3.99)', '3', 1, 2, 'truncates!'], ['round(3.99)', '4', 1, 5.4, 'rounds'], ['str(42) + "!"', "'42!'", 2, .4, 'number → text'], ['int("42") + 8', '50', 2, 2.4, 'text → number']];
      rows.forEach(([c, r, l, d, n], i) => { const k = lkK(b(l), d, .7), y = 160 + i * 66; res(c, r, 120, y, k, 30, 520); lkText(n, 700, y, 24, i === 1 ? C.red : C.dim, k, 'left', i === 1 ? 700 : 600); });
      lkText('the type names are conversion functions', 660, 125, 22, C.dim, lkK(b(0), .3, 1), 'center');
      lkCodeBlock(120, 500, 1080, ['int("forty-two")', { err: "ValueError: invalid literal for int() with base 10: 'forty-two'" }], { size: 24, k: lkK(b(3), .2, .6), kLine: i => lkK(b(3), .6 + i * 1.6, .7) });
    } },

    { title: 'None', draw(u, b) {
      lkCode('None', 330, 220, 90, C.red, lkK(b(0), .2, 1), 'center');
      lkText('nothing · missing', 330, 300, 28, C.dim, lkK(b(0), 2, 1), 'center'); lkText('the only value of NoneType', 330, 345, 22, C.dim, lkK(b(0), 1, 1), 'center');
      lkCodeBlock(640, 160, 620, ['return_value = print("abc")', { out: 'abc' }, 'print(return_value, type(return_value))', { out: "None <class 'NoneType'>" }],
        { size: 22, k: lkK(b(1), .2, .6), kLine: i => lkK(b(1), 2 + i * 1.3, .7) });
      lkText('print shows text but returns None', 950, 390, 22, C.red, lkK(b(1), 7, .8), 'center', 700);
      lkRule('if value is None:', 660, 540, 520, lkK(b(2), .3, .9), 32);
    } },

    { title: 'Booleans and truthiness', draw(u, b) {
      res('4 < 5', 'True', 80, 160, lkK(b(0), .4, .7), 26); lkCode("<class 'bool'>", 360, 160, 22, C.dim, lkK(b(0), 1.4, .7));
      lkText('falsy', 280, 240, 32, C.red, lkK(b(1), .4, .7), 'center', 700); lkText('truthy', 900, 240, 32, C.chalk, lkK(b(1), 3, .7), 'center', 700);
      lkLine([[600, 220], [600, 480]], lkK(b(1), .2, .5), C.ghost, 3);
      ['None', '0', '0.0', '""', '[]'].forEach((v, i) => { const k = lkK(b(1), 1 + i * .3, .6); lkRect(70 + i * 102, 290, 86, 56, k, C.red, 3, C.redFill); lkCode(v, 113 + i * 102, 318, 24, C.chalk, k, 'center'); });
      ['2014', '3.14', '"abc"', '[1, 2, 3]'].forEach((v, i) => { const k = lkK(b(1), 3.4 + i * .3, .6), w = [100, 100, 110, 170][i], x = [660, 780, 900, 1030][i]; lkRect(x, 290, w, 56, k, C.chalk, 3); lkCode(v, x + w / 2, 318, 24, C.chalk, k, 'center'); });
      lkText('None, zero, and empty things are False', 300, 400, 22, C.dim, lkK(b(1), 2.2, .9), 'center'); lkText('everything else is True', 920, 400, 22, C.dim, lkK(b(1), 4.6, .9), 'center');
      lkCodeBlock(200, 440, 520, ['user_text = ""', 'if user_text:', '    print("Thank you!")', 'else:', '    print("Please enter a value.")'], { size: 20, lh: 28, k: lkK(b(2), .2, .6), kLine: i => lkK(b(2), .4 + i * .6, .6) });
      lkCode('Please enter a value.', 780, 515, 24, C.red, lkK(b(2), 4, .8));
    } },

    { title: 'Formatting with f-strings', draw(u, b) {
      lkCodeParts([['f', C.red], ['"Revenue: ', C.str], ['{revenue', C.chalk], [':,.2f', C.red], ['}', C.chalk], ['"', C.str]], 120, 160, 34, lkK(b(0), .4, 1.4));
      lkText('expression', 520, 205, 20, C.dim, lkK(b(0), 3, .7), 'center'); lkText('format spec', 640, 205, 20, C.red, lkK(b(1), .4, .7), 'center', 700);
      lkTable(120, 250, [{ label: 'Spec', w: 160, col: C.red }, { label: 'Meaning', w: 280, mono: false }, { label: 'Example', w: 300 }, { label: 'Shows', w: 200 }],
        [[':.2f', '2 decimal places', 'f"{3.14159:.2f}"', '3.14'], [':,', 'thousands separator', 'f"{1234567:,}"', '1,234,567'], [':,.2f', 'both', 'f"{1234.5:,.2f}"', '1,234.50'], [':.1%', 'percentage', 'f"{0.256:.1%}"', '25.6%']],
        { size: 23, rh: 50, kRow: i => i < 0 ? lkK(b(1), .3, .6) : lkK(b(1), [1.2, 3, 5.2, 6.6][i], .7) });
      lkRule('only the display changes; the value keeps full precision', 660, 575, 980, lkK(b(2), .3, .9), 25);
    } },

    { title: 'Warmup: a sentence from data', draw(u, b) {
      lkCodeBlock(60, 130, 600, ['student = "Sammy"', 'grade = 88.444'], { size: 24, k: lkK(b(0), .2, .6), kLine: i => lkK(b(0), .6 + i * .6, .6) });
      const lines = [['"The grade of " + student + " is " + str(grade) + "%"', 0, .3], ['"The grade of {} is {}%".format(student, grade)', 0, 3.6], ['f"The grade of {student} is {grade}%"', 0, 6]];
      lines.forEach(([c, l, d], i) => lkPyLine(c, 60, 270 + i * 50, 19, lkK(b(1), d, 1)));
      lkCode('The grade of Sammy is 88.444%', 60, 420, 22, C.red, lkK(b(1), 7.4, .8)); lkLoop(220, 370, 200, 24, lkK(b(1), 8, .8), C.red, 4);
      lkLine([[740, 140], [740, 600]], lkK(b(2), 0, .5), C.ghost, 3);
      res('f"{int(88.6)}%"', "'88%'", 780, 200, lkK(b(2), 2, .8), 25); lkText('int truncates', 800, 245, 22, C.dim, lkK(b(2), 3, .7));
      res('f"{88.6:.0f}%"', "'89%'", 780, 330, lkK(b(2), 4.6, .8), 25); lkText('the spec rounds', 800, 375, 22, C.red, lkK(b(2), 5.6, .7), 'left', 700);
    } },

    { title: 'Workout: a one-line report', draw(u, b) {
      lkCodeBlock(40, 130, 820, ['units = 1250', 'previous_units = 1100', 'price = 19.99', null, 'revenue = units * price', 'growth = (units - previous_units) / previous_units', null,
        'print(f"Revenue: ${revenue:,.2f} | Unit growth: {growth:.1%}")', { out: 'Revenue: $24,987.50 | Unit growth: 13.6%' }],
      { size: 20, lh: 33, k: lkK(b(0), .2, .6), kLine: i => i < 3 ? lkK(b(0), 1 + i * .8, .6) : i < 6 ? lkK(b(1), (i - 4) * 2 + .4, .7) : lkK(b(2), (i - 7) * 2.6 + .4, 1) });
      lkText('round(2.675, 2)', 900, 170, 28, C.chalk, lkK(b(3), .6, .8), 'left', 500); lkCode('→ 2.67 ?!', 1120, 210, 26, C.red, lkK(b(3), 2.6, .7));
      lkText('stored as 2.67499999…', 900, 270, 22, C.dim, lkK(b(3), 5, .8)); lkText('round at the end', 900, 320, 24, C.red, lkK(b(3), 9, .8), 'left', 700);
    } },

    { title: 'Summary', draw(u, b) {
      lkList(120, 160, [
        { text: 'int and float hold numbers; / returns a float, // keeps integers.', mark: 'check', k: lkK(b(1), .2, .9) },
        { text: 'Floats are approximations: don\'t compare them with ==; round only for display.', mark: 'check', k: lkK(b(2), .2, .9) },
        { text: 'Convert with int(), float(), str(), bool(); int() truncates, round() rounds.', mark: 'check', k: lkK(b(3), .2, .9) },
        { text: 'None means "no value": test it with is None.', mark: 'check', k: lkK(b(3), 3, .9) },
        { text: 'None, zero and empty things are falsy; everything else is truthy.', mark: 'check', k: lkK(b(3), 5, .9) },
        { text: 'f-strings format output:  f"{value:,.2f}"', mark: 'check', k: lkK(b(4), .2, .9) },
      ], { size: 25, gap: 66 });
      lkText('Next: the Module 5 drill  →  Module 6: Strings', 660, 610, 26, C.red, lkK(b(4), 3, 1), 'center', 700);
    } },
  ];

  lecture({
    footer: 'BUSN 3030E · Module 5 · Built-In Types',
    panels,
    focus: [{ panel: 7, line: 0, to: 1, rect: [100, 120, 700, 110] }, { panel: 9, line: 2, to: 3, rect: [30, 120, 840, 340] }],
  });
})();
