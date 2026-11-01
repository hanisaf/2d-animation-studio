// Scene 55: Python lecture, Module 7 · Control Flow. The black board takes centre stage; ten panels chalk themselves on
// in step with the voice-over (asset.js → narration). Built with scene 49's lecture_kit.js.
// Board coords: 1320 × 680, y down; the header sits above y 100 and the footer at y 650.
(() => {
  const C = LK;
  const res = (code, out, x, y, k, size = 24, ox) => { lkPyLine(code, x, y, size, k); if (out !== '') lkCode('→ ' + out, ox ?? x + lkMeasure(code, size, 500, LK_MONO) + 24, y, size, C.red, k); };
  const seq = (b, line, d0, step) => i => lkK(b(line), d0 + i * step, .6);

  const panels = [
    { title: 'Control Flow', draw(u, b) {
      lkTitle(u, b, 7, 'Control Flow', [['if · elif', '· else', 2, .6], ['for and', 'while loops', 2, 2.4], ['break and', 'continue', 2, 4.4], ['try and', 'except', 2, 7.4]]);
    } },

    { title: 'Conditional statements', draw(u, b) {
      lkCodeBlock(60, 130, 560, ['order_total = 72.50', null, 'if order_total >= 100:', '    shipping = 0.00', 'elif order_total >= 50:', '    shipping = 4.99', 'else:', '    shipping = 9.99',
        null, 'print(f"Shipping: ${shipping:.2f}")', { out: 'Shipping: $4.99' }], { size: 22, lh: 37, k: lkK(b(0), .2, .6), kLine: i => i < 2 ? lkK(b(0), .8, .6) : i < 8 ? lkK(b(1), (i - 2) * .8, .6) : lkK(b(2), 6 + (i - 8) * .8, .6) });
      // the decision as a flow
      const k = i => lkK(b(2), .4 + i * 1.3, .6), x = 860;
      [['≥ 100 ?', 'free', 190], ['≥ 50 ?', '$4.99', 310], ['else', '$9.99', 430]].forEach(([q, r, y], i) => {
        const on = i === 1 && b(2) > 4;
        lkRect(x - 100, y - 30, 200, 60, k(i), on ? C.red : C.chalk, on ? 5 : 3, on ? C.redFill : null); lkText(q, x, y, 26, C.chalk, k(i), 'center', 700);
        lkArrow([[x + 110, y], [x + 190, y]], k(i), C.dim, 3, { head: 10 }); lkText(r, x + 205, y, 26, on ? C.red : C.chalk, k(i), 'left', 700);
        if (i < 2) { lkArrow([[x, y + 32], [x, y + 88]], k(i + 1), C.dim, 3, { head: 10 }); lkText('no', x + 14, y + 60, 18, C.dim, k(i + 1)); }
      });
      lkText('first True wins; the rest are skipped', 940, 520, 23, C.red, lkK(b(2), 5, .8), 'center', 700);
      lkText('elif: any number · elif and else: optional', 940, 570, 22, C.dim, lkK(b(3), .3, 1), 'center');
    } },

    { title: 'for loops and range()', draw(u, b) {
      lkCodeBlock(40, 130, 640, ['for region in ["North", "South", "East", "West"]:', '    print("Preparing report for", region)'], { size: 19, k: lkK(b(0), .2, .6), kLine: seq(b, 0, .6, 1) });
      ['North', 'South', 'East', 'West'].forEach((r, i) => lkCode('Preparing report for ' + r, 80, 240 + i * 30, 20, C.red, lkK(b(0), 3 + i * .4, .5)));
      res('for character in "Python": print(character, end=" ")', 'P y t h o n', 60, 400, lkK(b(0), 5.2, 1), 19);
      lkLine([[700, 140], [700, 360]], lkK(b(1), 0, .5), C.ghost, 3);
      res('list(range(5))', '[0, 1, 2, 3, 4]', 740, 170, lkK(b(1), .6, .7), 24);
      lkText('from 0 up to, not including, n', 740, 215, 21, C.dim, lkK(b(1), 3, .8));
      res('list(range(5, 10))', '[5, 6, 7, 8, 9]', 740, 270, lkK(b(2), .2, .7), 24);
      res('list(range(0, 20, 5))', '[0, 5, 10, 15]', 740, 320, lkK(b(2), 1.6, .7), 24);
      lkCode('range(start, stop, step)', 660, 500, 36, C.chalk, lkK(b(2), .4, .9), 'center');
      [['start', 585], ['stop', 725], ['step', 855]].forEach(([w, x], i) => lkText(w, x, 548, 20, C.red, lkK(b(2), 2.4 + i * .4, .5), 'center', 700));
    } },

    { title: 'The accumulator pattern', draw(u, b) {
      lkCodeBlock(60, 130, 640, ['daily_sales = [1200, 950, 1430, 870, 1610, 2050, 1780]', null, 'total = 0', 'big_days = 0', 'for sales in daily_sales:', '    total += sales', '    if sales > 1500:', '        big_days += 1'],
        { size: 19, lh: 36, k: lkK(b(0), .2, .6), kLine: i => i < 2 ? lkK(b(0), 1, .8) : i < 4 ? lkK(b(1), .4 + (i - 2) * .6, .6) : lkK(b(1), 2 + (i - 4) * .7, .6) });
      lkText('before the loop', 470, 225, 21, C.red, lkK(b(1), 1, .6), 'left', 700); lkText('inside the loop', 470, 330, 21, C.red, lkK(b(1), 3.6, .6), 'left', 700);
      lkLine([[76, 330], [76, 440]], lkK(b(3), .3, .6), C.red, 4); lkLine([[124, 400], [124, 440]], lkK(b(3), 1.6, .6), C.red, 4);
      // bars for the week
      const sales = [1200, 950, 1430, 870, 1610, 2050, 1780], bx = 760, base = 470;
      sales.forEach((v, i) => { const k = lkK(b(2), .2 + i * .4, .5), h = v / 2050 * 260, big = v > 1500; lkRect(bx + i * 70, base - h, 50, h, k, big ? C.red : C.chalk, 3, big ? C.redFill : null); lkText('MTWTFSS'[i], bx + 25 + i * 70, base + 22, 18, C.dim, k, 'center'); });
      lkLine([[bx - 10, base - 1500 / 2050 * 260], [bx + 490, base - 1500 / 2050 * 260]], lkK(b(2), 3, .6), C.red, 2, { dash: [8, 8] }); lkText('1,500', bx + 500, base - 1500 / 2050 * 260, 18, C.red, lkK(b(2), 3, .6));
      lkCode('Weekly total: 9890', 760, 540, 24, C.red, lkK(b(2), 3.6, .7)); lkCode('Days above $1,500: 3', 760, 580, 24, C.red, lkK(b(2), 4.6, .7));
    } },

    { title: 'while loops', draw(u, b) {
      lkCodeBlock(60, 140, 620, ['balance = 1000', 'years = 0', 'while balance < 2000:', '    balance *= 1.07', '    years += 1', null, 'print(f"{years} years, final balance ${balance:,.2f}")', { out: '11 years, final balance $2,104.85' }],
        { size: 20, lh: 36, k: lkK(b(0), .3, .6), kLine: i => i < 6 ? lkK(b(1), i * .7, .6) : lkK(b(1), 4.4 + (i - 6) * .8, .7) });
      lkText('repeats while the condition is True', 980, 170, 23, C.chalk, lkK(b(0), 1, 1), 'center', 700);
      // the balance growing year by year
      const sx = lkScale(760, 220, 470, 220, [0, 11], [1000, 2150]), kG = lkK(b(1), 1.6, 3.4);
      lkAxes(760, 220, 470, 220, lkK(b(1), 1.4, .6), { xl: 'years', yl: '' });
      const pts = []; for (let y = 0; y <= 11; y++) pts.push(sx(y, 1000 * 1.07 ** y));
      lkDots(pts, kG, C.chalk, 6); lkLine([sx(0, 2000), sx(11, 2000)], lkK(b(1), 1.6, .6), C.red, 2, { dash: [8, 8] }); lkText('$2,000', 1240, sx(11, 2000)[1] - 18, 18, C.red, lkK(b(1), 1.6, .6), 'right');
      lkRule('Beware of infinite loops: ■ stop · Kernel → Interrupt Kernel', 660, 570, 1100, lkK(b(2), .3, .9), 25);
    } },

    { title: 'break, continue, and a loop\'s else', draw(u, b) {
      lkCodeBlock(40, 125, 600, ['for n in range(10):', '    if n % 2 == 0:', '        continue      # skip even numbers', '    print(n, end=" ")', { out: '1 3 5 7 9' }], { size: 20, lh: 33, k: lkK(b(0), .2, .6), kLine: seq(b, 0, 2, .5) });
      lkText('break: exit the loop', 700, 160, 26, C.chalk, lkK(b(0), .4, .7), 'left', 700); lkText('continue: next iteration', 700, 200, 26, C.chalk, lkK(b(0), 2, .7), 'left', 700);
      lkCodeBlock(30, 320, 630, ['for day, sales in enumerate(daily_sales, start=1):', '    if sales > 2000:', '        print(f"First day above $2,000: day {day}")', '        break'],
        { size: 17.5, lh: 33, k: lkK(b(1), .2, .6), kLine: seq(b, 1, .5, .8) });
      lkCode('First day above $2,000: day 6', 60, 495, 20, C.red, lkK(b(1), 4, .7));
      lkText('enumerate(): position + item', 340, 535, 21, C.dim, lkK(b(1), 6, .8), 'center');
      lkCodeBlock(680, 320, 600, ['for sales in daily_sales:', '    if sales < 500:', '        print("Found a slow day:", sales)', '        break', 'else:', '    print("No day below $500.")', { out: 'No day below $500.' }],
        { size: 19, lh: 30, k: lkK(b(2), .2, .6), kLine: seq(b, 2, .6, .6) });
      lkText('else runs when no break happened', 980, 285, 22, C.red, lkK(b(2), 3, .8), 'center', 700);
    } },

    { title: 'Errors and exceptions', draw(u, b) {
      const rows = [['NameError', 'a variable that was never defined'], ['ZeroDivisionError', 'dividing by zero'], ['TypeError', 'an operation on the wrong type'], ['ValueError', 'right type, unacceptable value']];
      lkTable(40, 120, [{ label: 'Exception', w: 270, col: C.red }, { label: 'Typical cause', w: 400, mono: false }], rows, { size: 21, rh: 44, kRow: i => i < 0 ? lkK(b(0), 1, .6) : lkK(b(1), .2 + i * 1.6, .6) });
      lkCodeBlock(30, 360, 770, ['for numerator, denominator in [("10", "4"), ("10", "0"), ("ten", "2")]:', '    try:', '        print(float(numerator) / float(denominator))',
        '    except ZeroDivisionError:', '        print("cannot divide by zero")', '    except ValueError:', '        print("only numbers are allowed")'],
        { size: 17.5, lh: 30, k: lkK(b(2), .2, .6), kLine: seq(b, 2, .5, .7) });
      ['2.5', 'cannot divide by zero', 'only numbers are allowed'].forEach((r, i) => lkCode(r, 830, 420 + i * 40, 21, C.red, lkK(b(2), 6 + i * .6, .6)));
      lkRule('Name the exceptions you expect', 1020, 220, 470, lkK(b(3), .3, .9), 24);
      lkText('a bare except: hides bugs', 1020, 290, 21, C.dim, lkK(b(3), 2, .8), 'center');
    } },

    { title: 'Warmup: loops that stop', draw(u, b) {
      lkCodeBlock(40, 125, 560, ['guess_me, start = 7, 1', 'while True:', '    if start < guess_me:', '        print("too low")', '    elif start == guess_me:', '        print("found it!")', '        break', '    else:', '        print("oops")', '        break', '    start += 1'],
        { size: 19, lh: 31, k: lkK(b(0), .2, .6), kLine: seq(b, 0, .5, .35) });
      lkCode('too low × 6 · found it!', 620, 160, 22, C.red, lkK(b(0), 5, .8));
      lkText('while True + break: the exit test', 620, 230, 23, C.chalk, lkK(b(1), .4, .8), 'left', 700); lkText('sits in the middle of the loop', 620, 265, 23, C.chalk, lkK(b(1), 1.6, .8), 'left', 700);
      lkCodeBlock(620, 330, 660, ['emails = []', 'for word in msg.split():', '    if "@" in word:', '        emails.append(word)', 'emails', { out: "['james.bond@mi6.co.uk', 'Miss.Moneypenny@mi6.co.uk']" }],
        { size: 18, lh: 31, k: lkK(b(2), .2, .6), kLine: seq(b, 2, .5, .8) });
    } },

    { title: 'Workout: secret numbers and a calendar', draw(u, b) {
      lkCode('… client number is 444-222-5555 and her social is 345-22-5556', 40, 140, 19, C.dim, lkK(b(0), .3, 1));
      lkCodeBlock(40, 170, 600, ['for word in secret.split():', '    is_number = True', '    for character in word:', '        if character not in "0123456789-":', '            is_number = False', '            break', '    if is_number:', '        print(word)'],
        { size: 18, lh: 29, k: lkK(b(1), .2, .6), kLine: seq(b, 1, .4, .5) });
      lkCodeBlock(680, 170, 600, ['for word in secret.split():', '    for character in word:', '        if character not in "0123456789-":', '            break', '    else:', '        print(word)'],
        { size: 18, lh: 29, k: lkK(b(2), .2, .6), kLine: seq(b, 2, .4, .5) });
      lkText('① a flag', 40, 435, 21, C.red, lkK(b(1), .3, .6), 'left', 700); lkText('② for–else', 680, 380, 21, C.red, lkK(b(2), .3, .6), 'left', 700);
      lkCode('444-222-5555   345-22-5556', 680, 420, 21, C.red, lkK(b(2), 4, .7));
      lkCodeBlock(40, 470, 1240, ['for month in range(1, 13):', '    for day in range(1, days_in_month + 1):   # 29 in February (leap year)', '        dates.append(f"{month}-{day}")'],
        { size: 19, lh: 30, k: lkK(b(3), .2, .6), kLine: seq(b, 3, .4, .8) });
      lkCode('→ 366 dates · …, 2-28, 2-29, 3-1, …', 1270, 600, 20, C.red, lkK(b(3), 6, .8), 'right');
    } },

    { title: 'Summary', draw(u, b) {
      lkList(110, 160, [
        { text: 'if / elif / else runs the block of the first true condition.', mark: 'check', k: lkK(b(1), .2, .9) },
        { text: 'for item in sequence: repeats a block; range() generates integers.', mark: 'check', k: lkK(b(1), 3.4, .9) },
        { text: 'while condition: repeats until the condition is False.', mark: 'check', k: lkK(b(2), .2, .9) },
        { text: 'break exits; continue skips ahead; a loop\'s else runs with no break.', mark: 'check', k: lkK(b(2), 2.4, .9) },
        { text: 'Accumulators: initialize before the loop, update inside it.', mark: 'check', k: lkK(b(3), .2, .9) },
        { text: 'try / except SomeError: handles the errors you anticipate.', mark: 'check', k: lkK(b(3), 3, .9) },
      ], { size: 25, gap: 66 });
      lkText('Next: the Module 7 drill  →  Module 8: Functions', 660, 610, 26, C.red, lkK(b(3), 6, 1), 'center', 700);
    } },
  ];

  lecture({
    footer: 'BUSN 3030E · Module 7 · Control Flow',
    panels,
    focus: [{ panel: 7, line: 2, to: 3, rect: [30, 350, 1000, 230] }],
  });
})();
