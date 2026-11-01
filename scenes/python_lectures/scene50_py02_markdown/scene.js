// Scene 50: Python lecture, Module 2 · Jupyter Notebooks and Markdown. The black board takes centre stage; ten panels
// chalk themselves on in step with the voice-over (asset.js → narration). Built with scene 49's lecture_kit.js.
// Board coords: 1320 × 680, y down; the header sits above y 100 and the footer at y 650.
(() => {
  const C = LK;
  // Markdown source on the left, how it renders on the right.
  function pair(src, kBox, render, kR, o = {}) {
    const y0 = o.y ?? 130, h = o.h ?? 470, sw = o.sw ?? 560, size = o.size ?? 24, lh = o.lh ?? size * 1.55;
    lkText('Markdown source', 50, y0, 22, C.red, kBox, 'left', 700);
    lkRect(40, y0 + 22, sw, h, kBox, C.dim, 3, C.chalkFill);
    src.forEach(([txt, k], i) => lkCode(txt, 60, y0 + 22 + lh * (i + .9), size, txt.startsWith('#') || txt.startsWith('>') ? C.chalk : C.chalk, k));
    const rx = 40 + sw + 70;
    lkArrow([[50 + sw, y0 + 22 + h / 2], [rx - 14, y0 + 22 + h / 2]], kR, C.red, 4, { head: 12 });
    lkText('renders as', rx, y0, 22, C.red, kR, 'left', 700);
    render(rx, y0 + 22);
  }
  const bullet = (x, y, k) => circle(x, y, 5, { fill: C.chalk, stroke: null, alpha: k });

  const panels = [
    { title: 'Jupyter Notebooks and Markdown', draw(u, b) {
      lkTitle(u, b, 2, 'Jupyter Notebooks and Markdown', [['format text', 'with Markdown', 1, 1], ['present', 'tables', 2, .4], ['write math', 'with LaTeX', 2, 2.2], ['narrative', '+ code', 2, 4]]);
    } },

    { title: 'Why Markdown?', draw(u, b) {
      lkText('An analysis is only useful', 660, 160, 40, C.chalk, lkK(b(0), .2, 1.2), 'center', 700);
      lkText('if others can follow it.', 660, 210, 40, C.red, lkK(b(0), 1.2, 1), 'center', 700);
      // explanation next to code
      const k1 = lkK(b(1), .2, .8);
      lkRect(120, 270, 470, 64, k1, C.faint, 3); lkText('Here we compute total revenue…', 140, 302, 24, C.chalk, lkK(b(1), .6, 1));
      lkCell(250, 350, 340, { n: 1, lines: ['revenue * 3'], size: 24, k: k1, kc: lkK(b(1), 1.6, .6) });
      lkText('explanation', 600, 302, 22, C.red, lkK(b(1), 2.4, .6), 'left', 700); lkText('code', 600, 382, 22, C.red, lkK(b(1), 2.8, .6), 'left', 700);
      // a handful of symbols
      ['#', '*', '-'].forEach((sym, i) => { const k = lkK(b(2), 3 + i * .7, .6), x = 860 + i * 130; lkCircle(x, 300, 44, k, C.red, 4); lkCode(sym, x, 302, 48, C.chalk, k, 'center'); });
      lkText('plain text + a few symbols', 990, 380, 26, C.dim, lkK(b(2), 5.2, 1), 'center');
      // how to make one
      lkList(140, 470, [
        { text: 'Press M to turn a cell into Markdown', mark: 1, k: lkK(b(3), .3, .9) },
        { text: 'Run the cell to render it', mark: 2, k: lkK(b(3), 2.8, .9) },
        { text: 'Double-click to see the source again', mark: 3, k: lkK(b(3), 4.4, .9) },
      ], { size: 26, gap: 52 });
    } },

    { title: 'Headings and emphasis', draw(u, b) {
      const kE = i => lkK(b(2), .3 + i * .9, .8);
      pair([['# Heading level 1', lkK(b(0), 1, .8)], ['## Heading level 2', lkK(b(0), 2, .8)], ['### Heading level 3', lkK(b(0), 3, .8)], ['', 0],
        ['Make some words **bold**,', kE(0)], ['others *italic*,', kE(1)], ['and others ~~struck~~.', kE(2)]], lkK(b(0), .1, .6), (x, y) => {
        lkText('Heading level 1', x, y + 50, 46, C.chalk, lkK(b(0), 1.4, .8), 'left', 700);
        lkText('Heading level 2', x, y + 112, 36, C.chalk, lkK(b(0), 2.4, .8), 'left', 700);
        lkText('Heading level 3', x, y + 164, 28, C.chalk, lkK(b(0), 3.4, .8), 'left', 700);
        lkText('title · sections · subsections', x, y + 210, 21, C.red, lkK(b(1), 1, 1));
        let xx = x; const y2 = y + 300;
        xx += lkText('Make some words ', xx, y2, 27, C.chalk, kE(0)); xx += lkText('bold', xx, y2, 27, C.chalk, kE(0), 'left', 800) + 4;
        lkText(',', xx, y2, 27, C.chalk, kE(0));
        X.save(); X.translate(x, y2 + 44); X.transform(1, 0, -.2, 1, 0, 0); lkText('others italic,', 0, 0, 27, C.chalk, kE(1), 'left', 500); X.restore();
        const w = lkText('and others struck', x, y2 + 88, 27, C.chalk, kE(2), 'left', 600);
        lkLine([[x + lkMeasure('and others ', 27), y2 + 88], [x + w, y2 + 88]], kE(2), C.chalk, 3);
      }, lkK(b(0), .8, .6));
    } },

    { title: 'Lists', draw(u, b) {
      const kL = i => lkK(b(0), 1 + i * .6, .7), kS = i => lkK(b(1), .4 + i * .6, .7);
      pair([['Numbered lists:', kL(0)], ['', 0], ['1. Acquire the data', kL(1)], ['2. Prepare the data', kL(2)], ['3. Explore the data', kL(3)], ['', 0],
        ['- Python', kL(5)], ['- R', kL(6)], ['  - tidyverse', kS(0)], ['  - ggplot2', kS(1)]], lkK(b(0), .1, .6), (x, y) => {
        lkText('Numbered lists:', x, y + 34, 26, C.chalk, kL(0));
        ['Acquire the data', 'Prepare the data', 'Explore the data'].forEach((t, i) => { lkText(`${i + 1}.  ${t}`, x + 24, y + 84 + i * 40, 26, C.chalk, kL(i + 1)); });
        [['Python', 0, kL(5)], ['R', 0, kL(6)], ['tidyverse', 1, kS(0)], ['ggplot2', 1, kS(1)]].forEach(([t, d, k], i) => {
          const xx = x + 30 + d * 40, yy = y + 250 + i * 40; if (d) lkCircle(xx, yy, 5, k, C.chalk, 2); else bullet(xx, yy, k); lkText(t, xx + 20, yy, 26, C.chalk, k);
        });
        lkText('← two spaces = a sub-item', x + 190, y + 330, 22, C.red, lkK(b(1), 1.6, .8), 'left', 700);
      }, lkK(b(0), .8, .6), { size: 23, lh: 40 });
      lkRule('Leave a blank line before a list', 950, 600, 560, lkK(b(2), .4, .9), 24);
    } },

    { title: 'Links and images', draw(u, b) {
      const kA = lkK(b(0), .3, 1), kI = lkK(b(1), .3, 1);
      lkCode('[text](address)', 330, 175, 44, C.chalk, kA, 'center'); lkCode('![alt text](address)', 990, 175, 44, C.chalk, kI, 'center');
      lkText('a link', 330, 235, 26, C.red, lkK(b(0), 1.4, .6), 'center', 700); lkText('an image', 990, 235, 26, C.red, lkK(b(1), 1.4, .6), 'center', 700);
      lkLoop(990 - lkMeasure('![alt text](address)', 44, 500, LK_MONO) / 2 + 13, 175, 24, 34, lkK(b(1), .8, .6));   // the !
      lkLine([[660, 140], [660, 590]], lkK(b(1), 0, .6), C.ghost, 3);
      // example link
      lkCode('Read the [pandas documentation]', 60, 320, 22, C.chalk, lkK(b(0), 2.4, 1));
      lkCode('(https://pandas.pydata.org/docs/).', 60, 352, 22, C.dim, lkK(b(0), 3, 1));
      lkArrow([[330, 385], [330, 425]], lkK(b(0), 3.8, .5), C.red, 4, { head: 11 });
      let xx = 80 + lkText('Read the ', 80, 470, 28, C.chalk, lkK(b(0), 4.2, .8));
      const w = lkText('pandas documentation', xx, 470, 28, C.red, lkK(b(0), 4.6, .8)); lkLine([[xx, 488], [xx + w, 488]], lkK(b(0), 5, .5), C.red, 2.5);
      // example image: a frame, its picture, and the alt text it falls back to
      lkCode('![The Python logo](https://www.python.org/', 700, 320, 21, C.chalk, lkK(b(1), 2.2, 1));
      lkCode('  static/community_logos/python-logo.png)', 700, 350, 21, C.dim, lkK(b(1), 2.8, 1));
      const kP = lkK(b(1), 3.6, .8);
      lkRect(760, 410, 220, 150, kP, C.chalk, 3);
      lkLine([[780, 540], [840, 470], [880, 515], [910, 485], [960, 540]], kP, C.dim, 3); lkCircle(930, 445, 14, kP, C.dim, 3);
      lkArrow([[995, 485], [1040, 485]], lkK(b(2), .6, .5), C.red, 4, { head: 11 });
      lkText('"The Python logo"', 1060, 470, 24, C.chalk, lkK(b(2), 1, .8)); lkText('if it can\'t load', 1060, 505, 21, C.dim, lkK(b(2), 1.8, .8));
    } },

    { title: 'Quotes, code, and rules', draw(u, b) {
      const kQ = lkK(b(0), 1.4, .8), kI = lkK(b(1), .3, .8), kB = lkK(b(2), .3, .8), kH = lkK(b(3), .3, .8);
      pair([['> Without data, you\'re just', kQ], ['> another person with an opinion.', kQ], ['', 0], ['Use the `print()` function.', kI], ['', 0],
        ['```python', kB], ['revenue = 1200', lkK(b(2), .9, .6)], ['print(revenue)', lkK(b(2), 1.4, .6)], ['```', lkK(b(2), 1.9, .4)], ['', 0], ['---', kH]],
      lkK(b(0), .1, .6), (x, y) => {
        lkLine([[x, y + 22], [x, y + 92]], kQ, C.red, 6);
        lkText('Without data, you\'re just another', x + 20, y + 40, 24, C.dim, kQ); lkText('person with an opinion.', x + 20, y + 74, 24, C.dim, kQ);
        let xx = x + lkText('Use the ', x, y + 150, 26, C.chalk, kI);
        lkRect(xx, y + 132, lkMeasure('print()', 24, 500, LK_MONO) + 16, 36, kI, C.faint, 2, C.chalkFill); lkCode('print()', xx + 8, y + 150, 24, C.chalk, kI);
        lkText('function.', xx + lkMeasure('print()', 24, 500, LK_MONO) + 26, y + 150, 26, C.chalk, kI);
        lkCodeBlock(x, y + 200, 470, ['revenue = 1200', 'print(revenue)'], { size: 24, k: kB, kLine: i => lkK(b(2), 1 + i * .5, .6) });
        lkText('syntax highlighting', x + 300, y + 330, 20, C.red, lkK(b(2), 3, .8), 'left', 700);
        lkLine([[x, y + 400], [x + 470, y + 400]], kH, C.chalk, 3);
      }, lkK(b(0), .8, .6), { size: 21, lh: 39, sw: 560 });
      lkText('— attributed to W. Edwards Deming', 1270, 600, 18, C.faint, kQ, 'right');
    } },

    { title: 'Tables', draw(u, b) {
      const kR = i => lkK(b(0), .8 + i * .8, .7);
      const src = ['| Product  | Units | Price |', '|:---------|------:|------:|', '| Laptop   |    12 | \\$999 |', '| Monitor  |    30 | \\$249 |', '| Keyboard |   115 |  \\$49 |'];
      src.forEach((s, i) => lkCode(s, 60, 175 + i * 46, 25, i === 1 ? C.red : C.chalk, i === 1 ? lkK(b(1), .3, 1) : kR(i)));
      lkText('alignment row', 110, 420, 22, C.red, lkK(b(1), 1.4, .8), 'left', 700);
      [[':---', 'left', 1.8], ['---:', 'right', 3], [':---:', 'center', 4.2]].forEach(([s, w, d], i) => { const k = lkK(b(1), d, .7); lkCode(s, 110 + i * 170, 460, 24, C.red, k); lkText(w, 110 + i * 170, 494, 22, C.dim, k); });
      lkArrow([[620, 270], [680, 270]], lkK(b(0), 4, .5), C.red, 4, { head: 12 });
      lkTable(700, 170, [{ label: 'Product', w: 210 }, { label: 'Units', w: 130, align: 'right' }, { label: 'Price', w: 150, align: 'right' }],
        [['Laptop', '12', '$999'], ['Monitor', '30', '$249'], ['Keyboard', '115', '$49']], { size: 26, rh: 50, mono: false, kRow: i => lkK(b(0), 4.4 + (i + 1) * .5, .5), headCol: C.chalk });
      // the dollar-sign warning
      const kW = lkK(b(2), .2, .9);
      lkRect(680, 420, 600, 150, kW, C.red, 4, C.redFill);
      lkText('Watch out for dollar signs!', 980, 455, 27, C.chalk, kW, 'center', 700);
      lkCode('$...$', 760, 505, 24, C.chalk, lkK(b(2), 1.6, .8)); lkText('is math', 860, 505, 23, C.dim, lkK(b(2), 1.6, .8));
      lkCode('\\$', 1040, 505, 24, C.red, lkK(b(2), 4.4, .8)); lkText('shows $', 1090, 505, 23, C.chalk, lkK(b(2), 4.4, .8));
    } },

    { title: 'Math with LaTeX', draw(u, b) {
      lkText('Jupyter renders LaTeX notation', 660, 150, 30, C.dim, lkK(b(0), .3, 1.2), 'center');
      // inline
      const kI = lkK(b(1), .3, .9);
      lkCode('The sample mean is $\\bar{x} = \\frac{1}{n}\\sum_{i=1}^{n} x_i$.', 60, 240, 22, C.chalk, kI);
      lkText('inline: $ … $', 60, 200, 22, C.red, kI, 'left', 700);
      const kIR = lkK(b(1), 2.4, .9);
      lkText('The sample mean is', 300, 330, 30, C.chalk, kIR);
      // x̄ = (1/n) Σ x_i, chalked as a formula
      const fx = 600;
      lkText('x̄  =', fx, 330, 34, C.chalk, kIR, 'left', 600);
      lkText('1', fx + 95, 307, 26, C.chalk, kIR, 'center'); lkLine([[fx + 80, 330], [fx + 110, 330]], kIR, C.chalk, 2.5); lkText('n', fx + 95, 354, 26, C.chalk, kIR, 'center');
      lkText('Σ', fx + 150, 330, 52, C.chalk, kIR, 'center', 500); lkText('n', fx + 150, 288, 18, C.chalk, kIR, 'center'); lkText('i=1', fx + 150, 376, 18, C.chalk, kIR, 'center');
      lkText('xᵢ', fx + 190, 330, 32, C.chalk, kIR);
      lkLine([[40, 410], [1280, 410]], lkK(b(2), 0, .6), C.ghost, 3);
      // displayed
      const kD = lkK(b(2), .3, .9);
      lkText('displayed: $$ … $$', 60, 450, 22, C.red, kD, 'left', 700);
      lkCode('$$\\text{Profit} = \\text{Revenue} - \\text{Cost}$$', 60, 492, 22, C.chalk, kD);
      lkText('Profit = Revenue − Cost', 660, 575, 44, C.chalk, lkK(b(2), 2.2, 1.2), 'center', 500);
    } },

    { title: 'Workout: from plain text to a table', draw(u, b) {
      const raw = ['MIST 4600  Computer Programming in Business      3 credits', 'MIST 4610  Data Management and Analytics          3 credits',
        'MIST 4630  Network-Based Application Development  3 credits', 'BUSN 3030E Python Programming Skills for …     1.5 credits'];
      lkText('plain text export', 60, 140, 22, C.red, lkK(b(0), .3, .7), 'left', 700);
      raw.forEach((s, i) => lkCode(s, 60, 180 + i * 34, 19, C.dim, lkK(b(0), 1 + i * .5, .7)));
      lkArrow([[660, 330], [660, 370]], lkK(b(1), .2, .5), C.red, 4, { head: 12 });
      const rows = [['MIST 4600', 'Computer Programming in Business', '3'], ['MIST 4610', 'Data Management and Analytics', '3'],
        ['MIST 4630', 'Network-Based Application Development', '3'], ['BUSN 3030E', 'Python Programming Skills for Business Analytics I', '1.5']];
      lkTable(70, 385, [{ label: 'Number', w: 200, col: C.red }, { label: 'Title', w: 860 }, { label: 'Credits', w: 120, align: 'right' }], rows,
        { size: 22, rh: 40, mono: false, headCol: C.chalk, kRow: i => lkK(b(1), .8 + (i + 1) * .6, .6) });
      rows.forEach((r, i) => { const k = lkK(b(2), .3 + i * .4, .5), w = lkMeasure(r[0], 22); lkLine([[82, 385 + 40 * (i + 1.5) + 14], [82 + w, 385 + 40 * (i + 1.5) + 14]], k, C.red, 2.5); });
      lkText('links', 1270, 140, 22, C.red, lkK(b(2), 1.4, .6), 'right', 700);
      lkText('pandas will do this for us later', 1270, 180, 22, C.dim, lkK(b(3), 3, 1), 'right');
    } },

    { title: 'Summary', draw(u, b) {
      const rows = [['Heading', '# Title   ## Section   ### Subsection', 1], ['Bold / italic', '**bold**   *italic*', 1], ['Lists', '1. item    - item', 1],
        ['Link / image', '[text](url)   ![alt](url)', 2], ['Quote / code', '> quote   `code`   ```block```', 3], ['Table', '| a | b |   |---|---:|', 3],
        ['Math', '$inline$   $$displayed$$', 3], ['Dollar sign', '\\$', 3]];
      lkTable(160, 120, [{ label: 'To get', w: 300 }, { label: 'Write', w: 700, col: C.chalk, mono: true }], rows.map(r => [r[0], r[1]]),
        { size: 24, rh: 52, mono: false, kRow: i => i < 0 ? lkK(b(0), .2, .6) : lkK(b(rows[i][2]), .3 + (i % 3) * .9, .6) });
      lkText('Next: the Module 2 drill  →  Module 3: Variables', 660, 610, 26, C.red, lkK(b(4), .3, 1), 'center', 700);
    } },
  ];

  lecture({
    footer: 'BUSN 3030E · Module 2 · Jupyter Notebooks and Markdown',
    panels,
    focus: [{ panel: 7, line: 0, to: 1, rect: [40, 140, 600, 260] }, { panel: 8, line: 1, to: 2, rect: [40, 180, 1240, 220] }],
  });
})();
