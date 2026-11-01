// Scene 54: Python lecture, Module 6 · Strings. The black board takes centre stage; ten panels chalk themselves on in
// step with the voice-over (asset.js → narration). Built with scene 49's lecture_kit.js.
// Board coords: 1320 × 680, y down; the header sits above y 100 and the footer at y 650.
(() => {
  const C = LK;
  const res = (code, out, x, y, k, size = 24, ox) => { lkPyLine(code, x, y, size, k); if (out !== '') lkCode('→ ' + out, ox ?? x + lkMeasure(code, size, 500, LK_MONO) + 24, y, size, C.red, k); };

  const panels = [
    { title: 'Strings', draw(u, b) {
      lkTitle(u, b, 6, 'Strings', [['index', 'and slice', 2, .4], ['clean and', 'search text', 2, 3], ['split', 'and join', 2, 5.2], ['load text', 'from the web', 2, 7.2]]);
    } },

    { title: 'Creating strings', draw(u, b) {
      res(`"It's a good day"`, `"It's a good day"`, 60, 160, lkK(b(0), .5, .8), 21, 360); res(`'He said "good bye"'`, `'He said "good bye"'`, 60, 210, lkK(b(0), 2.4, .8), 21, 360);
      lkText('pick the quote that doesn\'t clash', 60, 255, 21, C.dim, lkK(b(0), 4, .8));
      lkCodeBlock(60, 300, 560, ['address = """Terry College of Business', '600 South Lumpkin Street', 'Athens, GA 30602"""'], { size: 22, k: lkK(b(1), .2, .6), kLine: i => lkK(b(1), .5 + i * .7, .6) });
      lkText('triple quotes: several lines', 60, 450, 22, C.red, lkK(b(1), 2.6, .8), 'left', 700);
      lkLine([[680, 140], [680, 600]], lkK(b(2), 0, .5), C.ghost, 3);
      [['\\n', 'new line'], ['\\t', 'tab'], ['\\"', 'a double quote'], ['\\\\', 'a backslash']].forEach(([e, m], i) => { const k = lkK(b(2), 1.2 + i * .9, .6), y = 170 + i * 50; lkCode(e, 730, y, 28, C.red, k); lkText(m, 820, y, 24, C.chalk, k); });
      lkPyLine('print("Name:\\tAda\\nRole:\\tAnalyst")', 720, 420, 21, lkK(b(2), 4.4, .9));
      lkCode('Name:   Ada', 740, 470, 22, C.red, lkK(b(2), 5.6, .6)); lkCode('Role:   Analyst', 740, 502, 22, C.red, lkK(b(2), 6, .6));
    } },

    { title: 'Indexing and slicing', draw(u, b) {
      const w = 'Analytics', x0 = 220, cw = 98;
      [...w].forEach((ch, i) => { const k = lkK(b(0), .3 + i * .15, .4), x = x0 + i * cw; lkRect(x, 140, cw, 70, k, C.chalk, 3); lkCode(ch, x + cw / 2, 177, 36, C.chalk, k, 'center');
        lkCode(String(i), x + cw / 2, 232, 22, C.dim, lkK(b(0), 2, .6), 'center'); lkCode(String(i - 9), x + cw / 2, 262, 22, C.red, lkK(b(0), 4, .6), 'center'); });
      lkText('index', x0 - 20, 232, 20, C.dim, lkK(b(0), 2, .6), 'right'); lkText('negative', x0 - 20, 262, 20, C.red, lkK(b(0), 4, .6), 'right');
      // highlights for the current slice
      const hl = (a, z, k) => { if (k > 0) lkRect(x0 + a * cw + 4, 144, (z - a) * cw - 8, 62, k, C.red, 5, C.redFill); };
      if (b(1) > 0 && b(2) < 0) hl(0, 4, lkK(b(1), 1, .6));
      if (b(1) > 4 && b(2) < 0) hl(6, 9, lkK(b(1), 4, .6));
      [['word[0:4]', "'Anal'", 1, 1], ['word[:4]', "'Anal'", 1, 2.6], ['word[-3:]', "'ics'", 1, 4], ['word[::-1]', "'scitylanA'", 2, .3]].forEach(([c, r, l, d], i) => res(c, r, 80 + (i % 2) * 600, 330 + Math.floor(i / 2) * 56, lkK(b(l), d, .7), 26, 340 + (i % 2) * 600));
      lkText('up to, but not including, stop', 330, 450, 21, C.dim, lkK(b(1), 6, .8), 'center');
      lkCodeBlock(80, 490, 1160, ['word[0] = "a"', { err: "TypeError: 'str' object does not support item assignment" }], { size: 23, k: lkK(b(3), .2, .6), kLine: i => lkK(b(3), .5 + i * 1.2, .6) });
    } },

    { title: 'Changing case and cleaning', draw(u, b) {
      lkCode('fox = "tHe qUICk bROWn fOx."', 60, 150, 24, C.chalk, lkK(b(0), .2, .8));
      [['upper()', 'THE QUICK BROWN FOX.'], ['lower()', 'the quick brown fox.'], ['title()', 'The Quick Brown Fox.'], ['capitalize()', 'The quick brown fox.'], ['swapcase()', 'ThE QuicK BrowN FoX.']]
        .forEach(([m, r], i) => res('fox.' + m, r, 60, 200 + i * 44, lkK(b(0), 1 + i * .9, .6), 22, 300));
      lkPyLine('"Python".lower() == "PYTHON".lower()', 60, 450, 22, lkK(b(1), .5, 1)); lkCode('→ True', 600, 450, 22, C.red, lkK(b(1), 2.4, .6));
      lkLine([[700, 140], [700, 600]], lkK(b(2), 0, .5), C.ghost, 3);
      lkPyLine('"   this is the content   ".strip()', 730, 170, 21, lkK(b(2), .4, .9)); lkCode("→ 'this is the content'", 750, 210, 22, C.red, lkK(b(2), 1.8, .6));
      lkText('lstrip() · rstrip(): one end', 730, 270, 22, C.dim, lkK(b(2), 3, .8));
      lkPyLine('"000000000000435".lstrip("0")', 730, 340, 21, lkK(b(2), 5.6, .9)); lkCode("→ '435'", 750, 380, 22, C.red, lkK(b(2), 7, .6));
      lkText('remove given characters', 730, 425, 22, C.dim, lkK(b(2), 7.6, .8));
    } },

    { title: 'Searching and replacing', draw(u, b) {
      lkCode('line = "the quick brown fox jumped over a lazy dog"', 60, 150, 22, C.chalk, lkK(b(0), .2, 1));
      res('line.find("fox")', '16', 60, 220, lkK(b(0), 2, .6)); res('line.find("bear")', '-1', 60, 265, lkK(b(0), 3.2, .6));
      res('line.count("o")', '4', 60, 345, lkK(b(1), 3.4, .6));
      lkCodeBlock(620, 200, 640, ['line.index("bear")', { err: 'ValueError: substring not found' }], { size: 22, k: lkK(b(1), .2, .6), kLine: i => lkK(b(1), .5 + i, .6) });
      res('line.startswith("the")', 'True', 60, 425, lkK(b(2), .3, .6)); res('line.endswith("cat")', 'False', 60, 470, lkK(b(2), 1.4, .6)); res('"fox" in line', 'True', 620, 425, lkK(b(2), 2.6, .6));
      res('line.replace("brown", "red")', "'the quick red fox jumped over a lazy dog'", 60, 560, lkK(b(3), .5, 1), 21);
    } },

    { title: 'Splitting and joining', draw(u, b) {
      lkPyLine('line.split()', 60, 160, 24, lkK(b(0), .5, .6));
      lkCode("['the', 'quick', 'brown', 'fox', 'jumped', 'over', 'a', 'lazy', 'dog']", 80, 205, 19, C.red, lkK(b(0), 1.8, 1.2));
      res('"2026-08-17".split("-")', "['2026', '08', '17']", 60, 275, lkK(b(1), .4, .7));
      res('address.splitlines()', "['Terry College…', '600 South…', 'Athens…']", 60, 330, lkK(b(1), 3.6, .7));
      lkText('a string → a list', 1100, 160, 24, C.red, lkK(b(0), 3, .6), 'left', 700);
      lkLine([[60, 380], [1260, 380]], lkK(b(2), 0, .5), C.ghost, 3);
      lkText('join: the inverse of split', 660, 420, 28, C.chalk, lkK(b(2), .2, .8), 'center', 700);
      lkCodeParts([['"--"', C.red], ['.join(["1", "2", "3"])', C.chalk]], 200, 490, 30, lkK(b(2), 2, .9)); lkCode("→ '1--2--3'", 760, 490, 30, C.red, lkK(b(2), 3.4, .6));
      lkLoop(237, 490, 44, 30, lkK(b(2), 5, .6)); lkText('called on the separator', 237, 545, 22, C.red, lkK(b(2), 5.4, .7), 'center', 700);
      res('" ".join(["Hello", "analytics", "world"])', "'Hello analytics world'", 200, 595, lkK(b(2), 6.4, .8), 22);
    } },

    { title: 'Inspecting and aligning text', draw(u, b) {
      [['"2026".isdigit()', 'True'], ['"20.26".isdigit()', 'False'], ['"Athens".isalpha()', 'True'], ['"Athens GA".isalpha()', 'False']].forEach(([c, r], i) => res(c, r, 80, 160 + i * 50, lkK(b(0), 1 + i * 1.2, .6), 24, 460));
      lkLine([[660, 140], [660, 400]], lkK(b(1), 0, .5), C.ghost, 3);
      [['<', 'left'], ['>', 'right'], ['^', 'center']].forEach(([s, n], i) => { const k = lkK(b(1), 1.5 + i * 1, .6); lkCode(s, 720, 170 + i * 52, 30, C.red, k); lkText('aligns ' + n, 770, 170 + i * 52, 24, C.chalk, k); });
      lkCodeBlock(80, 420, 1160, ["print(f\"|{'left':<10}|{'right':>10}|{'center':^10}|\")", { out: '|left      |     right|  center  |' }, "print(f\"|{'Revenue':<10}|{1234.5:>10,.2f}|\")", { out: '|Revenue   |  1,234.50|' }],
        { size: 22, lh: 36, k: lkK(b(1), 4, .6), kLine: i => lkK(b(1), 4.4 + i * 1.2, .7) });
    } },

    { title: 'Loading text from the web', draw(u, b) {
      lkCodeBlock(40, 125, 820, ['from urllib.request import urlopen', null, 'with urlopen(DATA_URL + "poem.txt") as response:', '    poem = response.read().decode("utf-8")'],
        { size: 21, lh: 32, k: lkK(b(0), .2, .6), kLine: i => i < 2 ? lkK(b(0), 2, .7) : lkK(b(1), (i - 2) * 1.6, .8) });
      lkText('bytes → decode → str', 880, 220, 24, C.red, lkK(b(1), 3, .8), 'left', 700); lkText('with closes the connection', 880, 260, 21, C.dim, lkK(b(1), 5, .8));
      ['Two roads diverged in a yellow wood,', 'And sorry I could not travel both', 'And be one traveler, long I stood…'].forEach((l, i) => lkText(l, 80, 320 + i * 36, 25, C.dim, lkK(b(1), 6 + i * .5, .8)));
      [['len(poem)', '751', 'characters'], ['len(poem.splitlines())', '23', 'lines'], ['len(poem.split())', '144', 'words']].forEach(([c, r, n], i) => { const k = lkK(b(2), 2 + i * 1.6, .6), y = 470 + i * 46; res(c, r, 80, y, k, 23, 460); lkText(n, 600, y, 22, C.dim, k); });
      lkText('"roads" appears twice', 1000, 530, 24, C.chalk, lkK(b(2), 7, .8), 'center');
    } },

    { title: 'Workout: extracting text', draw(u, b) {
      lkCode('… my email address is james.bond@mi6.co.uk Do not …', 60, 140, 21, C.dim, lkK(b(0), .3, 1));
      lkLoop(60 + 32 * lkMeasure('M', 21, 500, LK_MONO), 140, 11 * lkMeasure('M', 21, 500, LK_MONO), 20, lkK(b(0), 2, .7));
      lkCodeBlock(40, 175, 620, ['at = text.find("@")', 'start = text.rfind(" ", 0, at) + 1', 'end = text.find(" ", at)', 'text[start:end]', { out: "'james.bond@mi6.co.uk'" }],
        { size: 20, lh: 31, k: lkK(b(1), .2, .6), kLine: i => lkK(b(1), .6 + i * 1.3, .6) });
      lkCodeBlock(680, 175, 600, ['before, after = msg.split("@")', 'before.split()[-1] + "@" + after.split()[0]', { out: "'james.bond@mi6.co.uk'" }],
        { size: 20, lh: 31, k: lkK(b(2), .2, .6), kLine: i => lkK(b(2), .6 + i * 1.8, .6) });
      lkText('① find the boundaries', 60, 380, 22, C.red, lkK(b(1), .4, .6), 'left', 700); lkText('② split around the @', 700, 300, 22, C.red, lkK(b(2), .4, .6), 'left', 700);
      // the cow
      const kC = lkK(b(3), .2, .8);
      [' ____________________________________', '/ "An ounce of prevention is worth a \\', '\\ pound of purge."                   /', ' ------------------------------------', '        \\   ^__^', '         \\  (oo)\\_______'].forEach((l, i) => lkCode(l, 40, 430 + i * 24, 17, C.dim, kC));
      lkText('r"""…"""  keeps backslashes', 560, 470, 22, C.red, lkK(b(3), 2, .7), 'left', 700);
      lkPyLine('" ".join(wisdom.replace("\\\\", " ").split())', 560, 530, 20, lkK(b(4), 2, 1));
      lkCode("→ 'An ounce of prevention is worth a pound of purge.'", 560, 575, 18, C.red, lkK(b(4), 4.4, 1));
    } },

    { title: 'Summary', draw(u, b) {
      const rows = [['Access characters', 's[i]   s[start:stop]   s[::-1]', 1, .2], ['Change case', 'upper()  lower()  title()  capitalize()', 1, 2.6], ['Clean', 'strip()  lstrip()  rstrip()  replace()', 1, 4.6],
        ['Search', 'find()  rfind()  index()  count()  startswith()  in', 2, .2], ['Split and join', 'split()  splitlines()  sep.join(list)', 2, 3.4], ['Inspect', 'isdigit()  isalpha()', 2, 5], ['Load from the web', 'urlopen(url).read().decode("utf-8")', 3, .3]];
      lkTable(110, 120, [{ label: 'Task', w: 300, mono: false }, { label: 'Tool', w: 800, col: C.chalk }], rows.map(r => [r[0], r[1]]), { size: 23, rh: 56, kRow: i => i < 0 ? lkK(b(0), .2, .6) : lkK(b(rows[i][2]), rows[i][3], .6) });
      lkText('Next: the Module 6 drill  →  Module 7: Control flow', 660, 610, 26, C.red, lkK(b(3), 4, 1), 'center', 700);
    } },
  ];

  lecture({
    footer: 'BUSN 3030E · Module 6 · Strings',
    panels,
    focus: [{ panel: 9, line: 3, rect: [30, 410, 1260, 210] }],
  });
})();
