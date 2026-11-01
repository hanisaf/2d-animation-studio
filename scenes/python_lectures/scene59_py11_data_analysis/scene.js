// Scene 59: Python lecture, Module 11 · Data Analysis in Pure Python. The black board takes centre stage; ten panels
// chalk themselves on in step with the voice-over (asset.js → narration). Built with scene 49's lecture_kit.js.
// Board coords: 1320 × 680, y down; the header sits above y 100 and the footer at y 650.
(() => {
  const C = LK;
  const res = (code, out, x, y, k, size = 24, ox) => { lkPyLine(code, x, y, size, k); if (out !== '') lkCode('→ ' + out, ox ?? x + lkMeasure(code, size, 500, LK_MONO) + 24, y, size, C.red, k); };
  const seq = (b, line, d0, step) => i => lkK(b(line), d0 + i * step, .6);

  const panels = [
    { title: 'Data Analysis in Pure Python', draw(u, b) {
      lkTitle(u, b, 11, 'Data Analysis in Pure Python', [['read CSV', 'and JSON', 1, .4], ['clean raw', 'values', 1, 3.4], ['answer', 'questions', 1, 5.6], ['present', 'a report', 1, 8.2]]);
    } },

    { title: 'Records as dictionaries', draw(u, b) {
      // a little spreadsheet becomes a list of dicts
      const kT = lkK(b(0), .3, .8);
      lkTable(60, 140, [{ label: 'Company', w: 150 }, { label: 'Country', w: 130 }, { label: 'MarketCap', w: 150 }], [['Apple', 'USA', '$547'], ['Google', 'USA', '$510'], ['…', '', '']],
        { size: 21, rh: 44, mono: false, kRow: i => kT });
      lkText('records × fields', 275, 340, 22, C.dim, lkK(b(0), 2.4, .8), 'center');
      lkArrow([[520, 230], [600, 230]], lkK(b(1), .3, .6), C.red, 5);
      lkCodeBlock(620, 140, 660, ['data = [', '    {"Company": "Apple",  "Country": "USA", …},', '    {"Company": "Google", "Country": "USA", …},', '    …', ']'],
        { size: 17, lh: 32, k: lkK(b(1), .4, .6), kLine: seq(b, 1, .8, .7) });
      [['data[0]', 'the first record'], ['data[0]["Country"]', 'one field'], ['[r["Country"] for r in data]', 'a whole column']].forEach(([c, n], i) => {
        const k = lkK(b(2), .2 + i * 1.6, .7), y = 420 + i * 56; lkPyLine(c, 160, y, 26, k); lkText(n, 760, y, 24, C.red, k, 'left', 700); });
    } },

    { title: 'Reading CSV files', draw(u, b) {
      ['Company,Country,MarketCap,Cash,Revenue', 'Apple,USA, $547 , $233 , $235 ', 'Google/Alphabet,USA, $510 , $79 , $75 ', '…'].forEach((l, i) => lkCode(l, 60, 150 + i * 32, 20, i ? C.dim : C.red, lkK(b(0), .6 + i * .6, .7)));
      lkText('header line: the field names', 760, 150, 21, C.red, lkK(b(0), 3, .7), 'left', 700);
      lkCodeBlock(40, 290, 820, ['import csv', 'from urllib.request import urlopen', 'with urlopen(DATA_URL + "InternetCompanies.csv") as response:', '    lines = response.read().decode("utf-8").splitlines()', 'data = list(csv.DictReader(lines))', 'len(data)', { out: '20' }],
        { size: 19, lh: 31, k: lkK(b(1), .2, .6), kLine: seq(b, 1, .4, .7) });
      lkText('Why not line.split(",")?', 900, 330, 25, C.chalk, lkK(b(2), .3, .8), 'left', 700);
      lkCode('"Athens, GA"', 920, 390, 28, C.chalk, lkK(b(2), 3, .7)); lkLoop(1046, 393, 14, 20, lkK(b(2), 3.8, .5));
      lkText('commas inside quoted fields', 900, 440, 22, C.dim, lkK(b(2), 4, .8)); lkText('csv handles them correctly', 900, 480, 22, C.red, lkK(b(2), 6, .8), 'left', 700);
    } },

    { title: 'Reading JSON and joining', draw(u, b) {
      lkCodeBlock(40, 125, 1240, ['courses = [json.loads(line) for line in response.read().decode("utf-8").splitlines()]', { out: "{'cid': 0, 'number': '4600', 'major': 'MIST', …, 'currentInstructor': 4}" }],
        { size: 17, k: lkK(b(0), .3, .6), kLine: i => lkK(b(1), .3 + i * 2, .8) });
      lkText('JSON objects look like Python dicts · null → None', 660, 245, 22, C.dim, lkK(b(1), 5, 1), 'center');
      lkCodeBlock(40, 280, 700, ['instructor_by_id = {p["id"]: p["name"] for p in instructors}', null, 'for course in courses:', '    name = instructor_by_id.get(course["currentInstructor"],', '                                "(not assigned)")'],
        { size: 17, lh: 30, k: lkK(b(2), .2, .6), kLine: seq(b, 2, .6, .9) });
      const rows = [['MIST 4600', 'Computer Programming in Business', 'Karen Aguar'], ['MIST 4610', 'Data Managment and Analytics', 'Nikhil Srinivasan'], ['MIST 4630', 'Network-Based App. Development', 'Craig Piercy'],
        ['MIST 5730', 'Advanced Data Management…', 'Hani Safadi'], ['BUSN 3700', 'Principles of FinTech', '(not assigned)']];
      rows.forEach((r, i) => { const k = lkK(b(2), 5 + i * .5, .5), y = 300 + i * 40; lkCode(r[0], 770, y, 18, C.chalk, k); lkText(r[2], 1270, y, 19, i === 4 ? C.red : C.chalk, k, 'right'); });
      lkRule('a dictionary lookup by id = a join', 400, 580, 640, lkK(b(2), 8, .9), 26);
    } },

    { title: 'The case: Internet companies (2015)', draw(u, b) {
      lkTable(40, 125, [{ label: 'Company', w: 200 }, { label: 'Country', w: 110 }, { label: 'MarketCap', w: 140, align: 'right' }, { label: 'Cash', w: 100, align: 'right' }, { label: 'Revenue', w: 120, align: 'right' }],
        [['Apple', 'USA', ' $547 ', ' $233 ', ' $235 '], ['Google/Alphabet', 'USA', ' $510 ', ' $79 ', ' $75 '], ['Amazon', 'USA', ' $341 ', ' $16 ', ' $107 '], ['…', '', '', '', ''], ['Uber', 'USA', ' $63 ', ' $-   ', ' $-   ']],
        { size: 20, rh: 42, kRow: i => lkK(b(0), .4 + (i + 1) * .5, .5), hl: i => i === 4 && b(1) > 0 });
      lkText('$ billions', 710, 112, 20, C.dim, lkK(b(0), 4, .7), 'right');
      lkText('private: no cash, no revenue', 400, 400, 22, C.red, lkK(b(1), 2, .8), 'center', 700);
      const qs = ['average market cap', 'average cash', 'average cash ÷ revenue', 'ratio below 0.5?', 'how many report no cash?', 'companies per country', 'a lower-case name?', 'market cap per country'];
      qs.forEach((q, i) => { const k = lkK(b(2), .4 + i * .5, .5), y = 145 + i * 52; lkBadge(i + 1, 820, y, 17, k); lkText(q, 850, y, 23, C.chalk, k); });
    } },

    { title: 'Extract, transform, load', draw(u, b) {
      res('data[7]', "{'Company': 'Uber', …, 'Cash': ' $-   ', …}", 40, 145, lkK(b(0), .4, .9), 21);
      lkCodeBlock(40, 185, 720, ['BILLION = 1_000_000_000', null, 'def to_dollars(raw):', '    value = raw.strip().lstrip("$").strip()', '    if value == "-":', '        return None', '    return int(value) * BILLION'],
        { size: 20, lh: 32, k: lkK(b(1), .2, .6), kLine: seq(b, 1, .4, .8) });
      lkPyLine('to_dollars(" $547 "), to_dollars(" $-   ")', 40, 440, 19, lkK(b(1), 6.6, .8)); lkCode('→ (547000000000, None)', 60, 474, 19, C.red, lkK(b(1), 7.2, .8));
      lkCodeBlock(800, 185, 480, ['def clean_record(record):', '    return {', '        "Company": record["Company"],', '        "MarketCap": to_dollars(…),', '        …', '    }', null, 'companies = [clean_record(r)', '             for r in data]'],
        { size: 17, lh: 29, k: lkK(b(2), .2, .6), kLine: seq(b, 2, .4, .6) });
      lkRule('small functions: test one value, then apply to all', 660, 560, 900, lkK(b(2), 5.6, .9), 24);
    } },

    { title: 'Analytics: averages and ratios', draw(u, b) {
      lkCodeBlock(40, 125, 640, ['def average(values):', '    present = [v for v in values if v is not None]', '    return round(sum(present) / len(present), 2)'], { size: 19, k: lkK(b(0), .2, .6), kLine: seq(b, 0, 2, .8) });
      [['1', 'average market cap', '$138,250,000,000'], ['2', 'average cash', '$29,733,333,333']].forEach(([n, q, r], i) => { const k = lkK(b(1), .4 + i * 2.6, .7), y = 300 + i * 50; lkBadge(n, 60, y, 17, k); lkText(q, 90, y, 23, C.chalk, k); lkCode(r, 420, y, 23, C.red, k); });
      lkCodeBlock(720, 125, 560, ['ratios = {c["Company"]: c["Cash"] / c["Revenue"]', '          for c in companies', '          if c["Cash"] is not None', '          and c["Revenue"] is not None}'], { size: 17, lh: 29, k: lkK(b(2), .2, .6), kLine: seq(b, 2, .4, .6) });
      [['3', 'average cash ÷ revenue', '0.91'], ['4', 'ratio below 0.5', "['Amazon', 'JD.com', 'Netflix']"], ['5', 'companies without cash', '5']].forEach(([n, q, r], i) => {
        const k = i < 2 ? lkK(b(2), 3.4 + i * 3, .7) : lkK(b(3), .3, .7), y = 420 + i * 56; lkBadge(n, 60, y, 17, k); lkText(q, 90, y, 23, C.chalk, k); lkCode(r, 420, y, 23, C.red, k); });
    } },

    { title: 'Analytics: counting and grouping', draw(u, b) {
      lkCodeBlock(40, 125, 640, ['companies_per_country = {}', 'for c in companies:', '    country = c["Country"]', '    companies_per_country[country] = \\', '        companies_per_country.get(country, 0) + 1'],
        { size: 18, lh: 30, k: lkK(b(0), .2, .6), kLine: seq(b, 0, .8, .7) });
      [['USA', 12], ['China', 7], ['Japan', 1]].forEach(([c, n], i) => { const k = lkK(b(0), 4 + i * .5, .6), y = 160 + i * 56; lkText(c, 760, y, 25, C.chalk, k); lkLine([[860, y], [860 + n * 30, y]], k, C.red, 20); lkCode(String(n), 875 + n * 30, y, 22, C.chalk, k); });
      res('[c["Company"] for c in companies if c["Company"][0].islower()]', "['eBay']", 40, 340, lkK(b(1), .5, 1), 20);
      lkCodeBlock(30, 390, 900, ['market_cap_per_country = {', '    country: sum(c["MarketCap"] for c in companies if c["Country"] == country)', '    for country in companies_per_country}'],
        { size: 17, lh: 30, k: lkK(b(2), .2, .6), kLine: seq(b, 2, .4, .9) });
      lkCode("{'USA': 2101000000000, 'China': 638000000000, 'Japan': 26000000000}", 40, 530, 19, C.red, lkK(b(2), 3.4, 1));
    } },

    { title: 'Communicating the results', draw(u, b) {
      lkCode('2101000000000', 330, 170, 52, C.dim, lkK(b(0), .3, .8), 'center'); lkText('hard to read', 330, 230, 24, C.red, lkK(b(0), 2, .7), 'center', 700);
      const k = i => lkK(b(1), .4 + i * .7, .7);
      lkCode('Country  Companies  Market cap ($B)   Share', 640, 150, 22, C.chalk, k(0)); lkCode('-------------------------------------------', 640, 180, 22, C.dim, k(0));
      lkCode('USA             12            2,101   76.0%', 640, 212, 22, C.chalk, k(1)); lkCode('China            7              638   23.1%', 640, 244, 22, C.chalk, k(2)); lkCode('Japan            1               26    0.9%', 640, 276, 22, C.chalk, k(3));
      lkCode('f"{country:<8}{n:>10}{cap / BILLION:>17,.0f}{share:>8.1%}"', 640, 330, 16.5, C.red, lkK(b(1), 3.6, 1));
      // the share as a bar
      const kB = lkK(b(2), .4, 1.2), x0 = 160, w = 1000;
      [[.760, 'USA 76.0%', C.red], [.231, 'China 23.1%', C.chalk], [.009, '', C.dim]].reduce((x, [f, lab, col]) => { lkRect(x, 420, w * f, 70, kB, col, 3, col === C.red ? C.redFill : null); if (lab) lkText(lab, x + w * f / 2, 455, 24, C.chalk, kB, 'center', 700); return x + w * f; }, x0);
      lkText('Japan 0.9%', x0 + w + 10, 455, 20, C.dim, kB);
      lkText('a chart makes it clearer: Modules 14–15', 660, 560, 24, C.dim, lkK(b(2), 4, 1), 'center');
    } },

    { title: 'Summary', draw(u, b) {
      lkList(110, 170, [
        { text: 'A list of dictionaries: a simple representation of tabular data.', mark: 'check', k: lkK(b(1), .2, .9) },
        { text: 'csv.DictReader and json.loads build it; urlopen reads from the web.', mark: 'check', k: lkK(b(1), 3.4, .9) },
        { text: 'Clean with small, testable functions; handle None explicitly.', mark: 'check', k: lkK(b(2), .2, .9) },
        { text: 'Counting and grouping: dictionaries. Filtering and transforming: comprehensions.', mark: 'check', k: lkK(b(3), .2, .9) },
        { text: 'All this by hand takes effort: pandas does most of it in one line.', mark: 'check', k: lkK(b(3), 4.4, .9) },
      ], { size: 25, gap: 76 });
      lkText('Next: the Module 11 drill  →  Module 12: DataFrame and Series', 660, 600, 26, C.red, lkK(b(3), 8, 1), 'center', 700);
    } },
  ];

  lecture({
    footer: 'BUSN 3030E · Module 11 · Data Analysis in Pure Python',
    panels,
    focus: [{ panel: 6, line: 1, to: 2, rect: [30, 130, 740, 340] }],
  });
})();
