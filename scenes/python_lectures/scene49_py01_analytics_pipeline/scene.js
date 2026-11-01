// Scene 49: Python lecture, Module 1 · The Analytics Pipeline. The black board takes centre stage for about five
// minutes; ten panels chalk themselves on in step with the voice-over (asset.js → narration). No characters.
// Board coords: 1320 × 680, y down; the header sits above y 100 and the footer at y 650.
(() => {
  const C = LK;

  // panel 3 and the recap share the five stages
  const STAGES = [
    ['Acquire', 'Where do the data', 'come from?', 'Modules 6, 11, 12'],
    ['Prepare', 'Are the data clean and', 'in the right shape?', 'Modules 3–11'],
    ['Explore', 'What do the data', 'look like?', 'Modules 12–15'],
    ['Model', 'What relationships', 'explain the outcome?', 'Module 13'],
    ['Communicate', 'How do we tell', 'the story?', 'Modules 2, 14, 15'],
  ];
  function pipeline(x0, y, bw, bh, step, kBox, kQ, hi = -1, o = {}) {
    STAGES.forEach(([name, q1, q2, mods], i) => {
      const x = x0 + i * step, k = kBox(i), on = i === hi;
      lkRect(x, y, bw, bh, k, on ? C.red : C.chalk, on ? 5 : 4, on ? C.redFill : null);
      lkText(name, x + bw / 2, y + bh / 2, o.size ?? 30, on ? C.chalk : C.chalk, k, 'center', 700);
      if (i < 4) lkArrow([[x + bw + 8, y + bh / 2], [x + step - 8, y + bh / 2]], kBox(i + 1), C.red, 4, { head: 12 });
      if (!kQ) return;
      const kq = kQ(i);
      lkText(q1, x + bw / 2, y + bh + 44, 23, C.dim, kq, 'center', 600);
      lkText(q2, x + bw / 2, y + bh + 74, 23, C.dim, kq, 'center', 600);
      lkText(mods, x + bw / 2, y + bh + 120, 22, C.red, kq, 'center', 700);
    });
  }

  const panels = [
    { title: 'The Analytics Pipeline', draw(u, b) {                              // 1 · title card
      lkText('MODULE 1', 660, 175, 34, C.red, lkK(u, .1, .8), 'center', 700);
      lkText('The Analytics Pipeline', 660, 257, 92, C.chalk, lkK(u, .5, 1.6), 'center', 700);
      lkText('BUSN 3030E · Python Programming Skills for Business Analytics I', 660, 337, 28, C.dim, lkK(u, 1.8, 1.4), 'center', 600);
      lkLine([[330, 377], [990, 377]], lkK(u, 2.6, .8), C.redDk, 4);
      // what you'll be able to do (line 1), and the data (line 2)
      const goals = [['describe the', 'pipeline stages'], ['work in a', 'Jupyter notebook'], ['make an analysis', 'reproducible'], ['load real data', 'from the web']];
      goals.forEach(([a, c], i) => {
        const k = i < 3 ? lkK(b(1), 1 + i * 1.8, .8) : lkK(b(2), .3, .8), x = 240 + i * 280;
        lkBadge(i + 1, x, 465, 28, k);
        lkText(a, x, 527, 28, C.chalk, k, 'center', 600); lkText(c, x, 563, 28, C.chalk, k, 'center', 600);
      });
    } },

    { title: 'Why Python for business analytics?', draw(u, b) {                  // 2
      const cols = [200, 660, 1120];
      const head = (i, n, txt) => { const k = lkK(b(i), .2, .8); lkBadge(n, cols[n - 1] - 130, 170, 26, k); lkText(txt, cols[n - 1] - 92, 170, 36, C.chalk, k, 'left', 700); return k; };
      // 1 · readable syntax
      const k1 = head(1, 1, 'Readable');
      lkRect(40, 240, 330, 170, k1, C.dim, 3, C.chalkFill);
      lkCodeParts([['if ', C.red], ['sales > goal:', C.chalk]], 64, 295, 29, lkK(b(1), 1, 1));
      lkCode('    celebrate()', 64, 350, 29, C.chalk, lkK(b(1), 1.9, .8));
      lkText('reads almost', 205, 470, 27, C.dim, lkK(b(1), 2.6, 1), 'center'); lkText('like English', 205, 506, 27, C.dim, lkK(b(1), 3.2, 1), 'center');
      // 2 · ecosystem
      head(2, 2, 'Rich ecosystem');
      [['pandas', 'data'], ['statsmodels', 'statistics'], ['seaborn', 'charts']].forEach(([lib, use], i) => {
        const k = lkK(b(2), 1 + i * 1.1, .7), y = 270 + i * 100;
        lkRect(490, y - 32, 220, 64, k, C.chalk, 3); lkCode(lib, 600, y, 27, C.chalk, k, 'center');
        lkArrow([[722, y], [768, y]], k, C.red, 3, { head: 10 }); lkText(use, 780, y, 27, C.dim, k);
      });
      lkText('the entire workflow', 660, 590, 26, C.dim, lkK(b(2), 4.6, 1), 'center');
      // 3 · automation and reproducibility: a script of steps, then the same result again
      const k3 = head(3, 3, 'Reproducible');
      lkRect(970, 230, 230, 190, k3, C.dim, 3, C.chalkFill);
      ['1  load', '2  clean', '3  analyze'].forEach((s, i) => lkCode(s, 992, 272 + i * 52, 27, C.chalk, lkK(b(3), 1 + i * .6, .6)));
      lkArrow([[1210, 275], [1262, 275], [1262, 395], [1215, 395]], lkK(b(3), 3, 1), C.red, 4, { head: 12 });
      ['you', 'a colleague', 'an auditor'].forEach((s, i) => {
        const k = lkK(b(3), 5 + i * .9, .6);
        lkCheck(1000, 470 + i * 44, 24, k, C.red); lkText(s, 1026, 470 + i * 44, 27, C.chalk, k);
      });
      lkText('same result, every time', 1100, 610, 24, C.dim, lkK(b(3), 7.4, 1), 'center');
      lkLine([[430, 150], [430, 600]], lkK(b(2), 0, .6), C.ghost, 3); lkLine([[900, 150], [900, 600]], lkK(b(3), 0, .6), C.ghost, 3);
    } },

    { title: 'The analytics pipeline', draw(u, b) {                              // 3
      lkText('Most projects move through the same five stages:', 660, 150, 30, C.dim, lkK(b(0), .3, 1.4), 'center');
      const cur = [1, 2, 3, 4, 5].reduce((c, i) => (b(i) > 0 ? i - 1 : c), -1);       // the stage being named turns red
      pipeline(46, 250, 210, 92, 252, i => lkK(b(i + 1), .1, .7), i => lkK(b(i + 1), .6, .9), cur);
      lkText('This course follows the pipeline from end to end.', 660, 580, 28, C.chalk, lkK(b(5), .6, 1.4), 'center', 600);
    } },

    { title: 'Jupyter notebooks', draw(u, b) {                                   // 4
      // the notebook: a Markdown cell and two code cells
      const nx = 200, cw = 470, kN = lkK(b(0), .2, 1);
      lkRect(40, 130, 800, 470, kN, C.faint, 3);
      lkText('analysis.ipynb', 60, 158, 22, C.dim, kN);
      const kM = lkK(b(1), .1, .8);
      lkCell(nx, 195, cw, { md: true, lines: ['Sales report'], size: 30, k: kM, kc: lkK(b(1), .5, .8) });
      lkText('Markdown', 690, 230, 23, C.red, lkK(b(1), 1.2, .6), 'left', 700);
      const kC = lkK(b(2), .1, .8), hl = b(4) > .3;
      lkCell(nx, 295, cw, { n: 1, lines: ['revenue = 1200'], k: kC, kc: lkK(b(2), .4, .8), hl });
      lkCell(nx, 395, cw, { n: 2, lines: ['revenue * 3'], k: kC, kc: lkK(b(2), 1.2, .8), out: ['3600'], ko: lkK(b(2), 2.4, .5), hl });
      lkText('Code', 690, 330, 23, C.red, lkK(b(2), 1.2, .6), 'left', 700); lkText('Code', 690, 430, 23, C.red, lkK(b(2), 1.2, .6), 'left', 700);
      lkText('output', 330, 476, 22, C.dim, lkK(b(2), 3, .6), 'left');
      if (hl) { lkLoop(138, 330, 64, 30, lkK(b(4), .3, .8)); lkLoop(138, 430, 64, 30, lkK(b(4), .8, .8)); lkText('run order', 138, 545, 24, C.red, lkK(b(4), 1.4, .6), 'center', 700); }
      // the kernel: a running Python process that remembers variables
      const kK = lkK(b(3), .1, 1), kx = 900;
      lkRect(kx, 250, 380, 250, kK, C.red, 4, C.redFill);
      lkText('KERNEL', kx + 195, 285, 32, C.chalk, kK, 'center', 700);
      lkText('runs your code', kx + 195, 330, 24, C.dim, lkK(b(3), 1.2, .8), 'center');
      lkText('remembers variables', kx + 195, 365, 24, C.dim, lkK(b(3), 2.4, .8), 'center');
      lkRect(kx + 60, 400, 270, 60, lkK(b(3), 3.4, .8), C.chalk, 3);
      lkCode('revenue → 1200', kx + 195, 430, 24, C.chalk, lkK(b(3), 3.8, .8), 'center');
      lkArrow([[846, 360], [kx - 6, 360]], lkK(b(3), .6, .8), C.chalk, 3, { head: 12, dash: [10, 9] });
    } },

    { title: 'Running code', draw(u, b) {                                        // 5
      const x = 150;
      let y = lkCell(x, 140, 520, { n: 1, lines: ['1 + 2'], k: lkK(b(0), .2, .7), kc: lkK(b(0), 1, .6), out: b(1) > 0 ? ['3'] : [], ko: lkK(b(1), 0, .4) });
      lkText('Shift + Enter', 700, 166, 26, C.red, lkK(b(0), 2.2, .7), 'left', 700);
      lkText('the last value is displayed', 700, 236, 24, C.dim, lkK(b(1), 1.5, .9));
      y = lkCell(x, y + 40, 560, { n: 2, lines: [[['print', C.red], ['("Hello, analytics!")', C.chalk]], [['print', C.red], ['("Two plus three is", 2 + 3)', C.chalk]]],
        size: 24, k: lkK(b(2), .2, .7), kc: lkK(b(2), .8, 1.4), out: ['Hello, analytics!', 'Two plus three is 5'], ko: lkK(b(2), 2.6, 1) });
      // keyboard shortcuts
      const rows = [['Shift + Enter', 'run the cell, move on'], ['Enter / Esc', 'edit mode / command mode'], ['A  /  B', 'insert a cell above / below'],
        ['M  /  Y', 'Markdown / code cell'], ['D , D', 'delete the cell']];
      const tx = 800, kT = lkK(b(3), .2, .8);
      lkText('Shortcuts', tx, 330, 30, C.chalk, kT, 'left', 700); lkLine([[tx, 356], [1290, 356]], kT, C.redDk, 3);
      rows.forEach(([key, what], i) => {
        const k = lkK(b(4), .2 + i * 1.6, .7), yy = 390 + i * 46;
        lkCode(key, tx, yy, 22, C.red, k); lkText(what, tx + 200, yy, 22, C.chalk, k);
      });
      lkText('(command mode)', 1290, 620, 18, C.faint, lkK(b(4), 4, .8), 'right');
    } },

    { title: 'Reproducible analytics', draw(u, b) {                              // 6
      lkText('Anyone can run it again from scratch… and get the same result.', 660, 140, 28, C.dim, lkK(b(0), 2.4, 1.6), 'center');
      // three cells, run out of order: [1], [3], [2]
      const x = 130, k0 = lkK(b(1), .1, .8);
      lkCell(x, 190, 430, { n: 1, lines: ['price = 10'], size: 26, k: k0, kc: k0 });
      lkCell(x, 270, 430, { n: 3, lines: ['total = price * 3'], size: 26, k: k0, kc: k0, out: b(2) > 0 ? ['36'] : [], ko: lkK(b(2), .3, .5), hl: b(1) > 2 });
      lkCell(x, 400, 430, { n: 2, lines: ['price = 12'], size: 26, k: k0, kc: k0, hl: b(1) > 2 });
      lkText('ran 1 → 2 → 3, not top to bottom', 345, 510, 22, C.red, lkK(b(1), 3, 1), 'center', 700);
      const kX = lkK(b(2), 4, .6);
      lkText('expected 30', 640, 340, 26, C.chalk, kX, 'left', 700); lkCross(626, 375, 30, lkK(b(2), 5, .5));
      lkText('shows 36', 660, 377, 26, C.red, lkK(b(2), 5, .6), 'left', 700);
      lkLine([[860, 170], [860, 600]], lkK(b(3), 0, .6), C.ghost, 3);
      // the two habits
      lkText('Two habits', 900, 200, 32, C.chalk, lkK(b(3), .2, .8), 'left', 700);
      lkBadge(1, 920, 270, 22, lkK(b(3), .6, .6)); lkText('Run top to bottom:', 955, 262, 25, C.chalk, lkK(b(3), .8, 1));
      lkText('define it before you use it', 955, 296, 22, C.dim, lkK(b(3), 2.4, 1));
      lkBadge(2, 920, 370, 22, lkK(b(4), .2, .6)); lkText('Restart & Run All', 955, 370, 25, C.chalk, lkK(b(4), .4, 1));
      const kR = lkK(b(4), 2.2, .8);
      lkRect(950, 410, 300, 64, kR, C.red, 4, C.redFill);
      lkText('⟳  Restart & Run All', 1100, 442, 26, C.chalk, kR, 'center', 700);
      lkText('fresh kernel, every cell in order', 1100, 508, 21, C.dim, lkK(b(4), 3.2, 1), 'center');
      lkText('before you submit any drill!', 1100, 556, 24, C.red, lkK(b(4), 5.4, 1), 'center', 700);
    } },

    { title: 'Loading data from the web', draw(u, b) {                           // 7
      // GitHub → every notebook
      const kG = lkK(b(1), .2, 1);
      lkRect(40, 135, 270, 170, kG, C.chalk, 4);
      lkText('GitHub', 175, 182, 34, C.chalk, kG, 'center', 700);
      lkCode('data/', 175, 232, 26, C.red, lkK(b(1), 1, .8), 'center');
      lkText('stable · shared', 175, 274, 22, C.dim, lkK(b(1), 1.6, .8), 'center');
      lkArrow([[320, 220], [380, 220]], lkK(b(1), 2.5, .8), C.red, 5, { head: 13 });
      lkText('not a file that lives only on your laptop', 175, 330, 20, C.red, lkK(b(0), 2.8, 1.4), 'left', 700);
      // the code
      const s = 20, kc = i => lkK(b(2), .3 + i * 1.3, 1);
      lkRect(395, 128, 895, 180, lkK(b(2), 0, .6), C.dim, 3, C.chalkFill);
      lkCodeParts([['import ', C.red], ['pandas ', C.chalk], ['as ', C.red], ['pd', C.chalk]], 415, 158, s, kc(0));
      lkCodeParts([['DATA_URL = ', C.chalk], ['"https://raw.githubusercontent.com/hanisaf/', C.dim]], 415, 194, s, kc(1));
      lkCode('           python-programming-skills/main/data/"', 415, 224, s, C.dim, kc(1.5));
      lkCodeParts([['salaries = pd.', C.chalk], ['read_csv', C.red], ['(DATA_URL + "Cambridge_Budget_Salaries.csv")', C.chalk]], 415, 260, s, kc(2.4));
      lkCodeParts([['salaries.', C.chalk], ['head', C.red], ['()', C.chalk]], 415, 290, s, lkK(b(3), .2, .7));
      // the first five rows
      const cols = [{ label: 'Fiscal Year', w: 160 }, { label: 'Department', w: 260 }, { label: 'Job Title', w: 360 }, { label: 'Total Salary', w: 220, align: 'right' }];
      const rows = [[2017, 'Police', 'Police Officer', '74558'], [2017, 'City Clerk', 'Principal Clerk', '48788'], [2017, 'Animal Commission', 'Dir/Animal Commission', '92359'],
        [2017, 'Animal Commission', 'Animal Control Officer', '60197'], [2017, 'Animal Commission', 'Animal Control Officer', '60197']];
      lkTable(160, 365, cols, rows, { size: 21, rh: 36, kRow: i => lkK(b(3), 1.2 + (i + 1) * .5, .5) });
      lkText('Cambridge, MA · city salaries', 1270, 610, 22, C.dim, lkK(b(3), 4.4, 1), 'right');
    } },

    { title: 'A first look at the data', draw(u, b) {                            // 8
      const x = 220, w = 560;
      lkText('pandas features from Module 12, but the names explain themselves', 660, 140, 24, C.dim, lkK(b(0), 1.5, 1.6), 'center');
      lkCell(x, 190, w, { n: 2, lines: [[['salaries.', C.chalk], ['shape', C.red]]], size: 26, k: lkK(b(1), .1, .6), kc: lkK(b(1), .4, .7), out: [], hl: false });
      lkCode('(7024, 7)', 830, 216, 30, C.red, lkK(b(1), 1.6, .7)); lkText('rows, columns', 1010, 216, 22, C.dim, lkK(b(1), 2.6, .8));
      lkCell(x, 280, w, { n: 3, lines: [[['list(salaries.', C.chalk], ['columns', C.red], [')', C.chalk]]], size: 26, k: lkK(b(2), .1, .6), kc: lkK(b(2), .4, .7) });
      ['Fiscal Year', 'Service', 'Department', 'Division', 'Position Number', 'Job Title', 'Total Salary'].forEach((c, i) => {
        const k = lkK(b(2), 1.4 + i * .35, .5), cx = 120 + (i % 4) * 280, cy = 380 + Math.floor(i / 4) * 52, wd = lkMeasure(c, 22) + 30;
        lkRect(cx, cy - 20, wd, 40, k, C.faint, 2.5); lkText(c, cx + 15, cy, 22, C.chalk, k);
      });
      lkCell(x, 500, w, { n: 4, lines: [[['salaries["Total Salary"].', C.chalk], ['max', C.red], ['()', C.chalk]]], size: 26, k: lkK(b(3), .1, .6), kc: lkK(b(3), .4, .9) });
      const kM = lkK(b(3), 1.8, .7);
      lkCode('3500000', 830, 526, 40, C.red, kM); lkLoop(912, 526, 112, 36, lkK(b(3), 2.8, .8), C.chalk, 4);
    } },

    { title: 'Question surprising values', draw(u, b) {                          // 9
      lkText('$3,500,000', 340, 200, 76, C.red, lkK(b(0), .2, 1.2), 'center', 700);
      lkText('for one city employee?', 340, 268, 30, C.chalk, lkK(b(0), 1.5, 1), 'center', 600);
      const kQ = lkK(b(0), 3, .4); if (kQ > 0) lkText('?!', 600, 190, 70, C.chalk, kQ, 'left', 700);
      // the record behind it
      const fields = [['Fiscal Year', '2018'], ['Service', 'Public Safety'], ['Department', 'Fire'], ['Division', 'Headquarters & Fire Stations'],
        ['Position Number', 'FY18-001'], ['Job Title', 'FY18 Settlement'], ['Total Salary', '3500000']];
      const rx = 690, ry = 140, kR = lkK(b(1), .1, .8);
      lkRect(rx, ry, 600, 330, kR, C.dim, 3, C.chalkFill);
      fields.forEach(([f, v], i) => {
        const k = lkK(b(1), .6 + i * .35, .5), y = ry + 34 + i * 44;
        lkText(f, rx + 22, y, 22, C.dim, k); lkCode(v, rx + 212, y, 21, i === 5 ? C.red : C.chalk, k);
      });
      lkLoop(rx + 312, ry + 34 + 5 * 44, 125, 26, lkK(b(1), 4, .8), C.red, 4);
      // what it really is
      const kS = lkK(b(2), .2, 1);
      lkText('a labor settlement:', 340, 360, 28, C.chalk, kS, 'center', 700);
      lkText('a lump-sum budget line', 340, 400, 26, C.chalk, lkK(b(2), 1.3, 1), 'center');
      lkText('≠ an individual\'s pay', 340, 440, 26, C.red, lkK(b(2), 2.4, 1), 'center', 700);
      // the rule
      const kL = lkK(b(3), .2, .9);
      lkRect(150, 515, 1020, 76, kL, C.red, 5, C.redFill);
      lkText('Always question surprising values before you report them.', 660, 553, 30, C.chalk, lkK(b(3), .6, 1.8), 'center', 700);
    } },

    { title: 'Summary', draw(u, b) {                                             // 10
      pipeline(80, 140, 190, 70, 236, i => lkK(b(1), .3 + i * .7, .6), null, -1, { size: 26 });
      const items = [
        [2, 'A notebook mixes Markdown cells (text) with code cells (Python);', 'the kernel runs the code and remembers variables.'],
        [3, 'Reproducible notebooks run from top to bottom:', 'verify with Restart & Run All.'],
        [4, 'Course datasets load from the web:', 'DATA_URL + "file name"'],
      ];
      items.forEach(([i, l1, l2], j) => {
        const y = 285 + j * 96, k = lkK(b(i), .2, .8);
        lkCheck(130, y + 14, 30, k, C.red);
        lkText(l1, 170, y, 27, C.chalk, lkK(b(i), .4, 1.4)); (j === 2 ? lkCode : lkText)(l2, 170, y + 36, 25, j === 2 ? C.red : C.dim, lkK(b(i), 1.6, 1.2));
      });
      const kN = lkK(b(5), .2, .9);
      lkText('Next: the Module 1 drill  →  Module 2: Jupyter notebooks and Markdown', 660, 600, 27, C.red, kN, 'center', 700);
    } },
  ];

  lecture({
    narration: ASSETS.scene.scene49_py01_analytics_pipeline.narration,
    pace: ASSETS.scene.scene49_py01_analytics_pipeline.pace,
    footer: 'BUSN 3030E · Module 1 · The Analytics Pipeline',
    panels,
    focus: [
      { panel: 5, line: 3, rect: [780, 300, 530, 335] },                       // the shortcuts list
      { panel: 7, line: 2, to: 3, rect: [385, 118, 915, 200] },                 // the read_csv code
      { panel: 9, line: 1, to: 2, rect: [680, 130, 620, 350] },                 // the settlement record
    ],
  });
})();
