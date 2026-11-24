// comics/__BOOK__/__NAME__/comic.js: code-rendered blueprint for "__TITLE__".
// Write the story description and panel script in README.md first.
// Keep visual art inside `draw(pw, ph)` and all text inside declarative `lettering` so per-panel illustration works cleanly.

(() => {
  const INK = COMIC_INK;

  function drawSkyBg(pw, ph) {
    const sky = linGrad(0, 0, 0, ph * 0.72, [[0, '#C8EAFA'], [1, '#EEF8FF']]);
    X.fillStyle = sky;
    X.fillRect(0, 0, pw, ph * 0.72);
    X.fillStyle = '#A8D89A';
    X.fillRect(0, ph * 0.72, pw, ph * 0.28);
    line([[0, ph * 0.72], [pw, ph * 0.72]], { stroke: INK, lwPx: 3.5 });
  }

  comic({
    paper: '#FFFDF7',
    margin: 52,
    gutter: 20,
    pages: [
      {
        id: 'page-01',
        masthead: {
          title: '__TITLE__'.toUpperCase(),
          subtitle: 'Safadi Studio Comics',
        },
        rows: [
          {
            weight: 1,
            panels: [
              {
                id: 'p1_opening',
                weight: 1,
                cast: ['sami', 'jenna'],
                prompt: 'Bright sunny park; Dr. Sami and Jenna smile warmly as they kick off a new adventure.',
                draw(pw, ph) {
                  drawSkyBg(pw, ph);
                  jenna(pw * 0.38, ph * 0.88, 9.5, { boil: 0, eyes: 'happy', mouth: 'grin', lookX: 0.5 });
                  sami(pw * 0.62, ph * 0.90, 12.0, { boil: 0, breathe: false, eyes: 'happy', mouth: 'grin', lookX: -0.5 });
                },
                lettering: {
                  captions: [{ text: 'OPENING', x: 14, y: 14, size: 22 }],
                  bubbles: [
                    { speaker: 'sami', text: 'Ready for a new comic?', cx: 0.80, cy: 0.24, tx: 0.64, ty: 0.44, size: 24, maxW: 280 },
                    { speaker: 'jenna', text: "Let's go!", cx: 0.22, cy: 0.30, tx: 0.36, ty: 0.50, size: 24, maxW: 200 },
                  ],
                },
              },
            ],
          },
          {
            weight: 1,
            panels: [
              {
                id: 'p2_action',
                weight: 1,
                cast: ['jenna'],
                prompt: 'Jenna leaps happily across the park.',
                draw(pw, ph) {
                  drawSkyBg(pw, ph);
                  jenna(pw * 0.50, ph * 0.86, 10.5, { boil: 0, jump: 3.5, eyes: 'happy', mouth: 'grin' });
                },
                lettering: {
                  sfx: [{ text: 'WHOOSH!', x: 0.26, y: 0.20, size: 48, rot: -0.1, fill: '#FF7EA5' }],
                },
              },
              {
                id: 'p3_finale',
                weight: 1,
                cast: ['sami', 'jenna'],
                prompt: 'Dr. Sami and Jenna celebrate together.',
                draw(pw, ph) {
                  drawSkyBg(pw, ph);
                  sami(pw * 0.35, ph * 0.90, 11.5, { boil: 0, breathe: false, eyes: 'happy', mouth: 'grin' });
                  jenna(pw * 0.68, ph * 0.88, 9.5, { boil: 0, eyes: 'happy', mouth: 'grin' });
                },
                lettering: {
                  bubbles: [
                    { speaker: 'jenna', text: 'Best day ever!', cx: 0.72, cy: 0.22, tx: 0.68, ty: 0.46, size: 24, maxW: 240 },
                  ],
                },
              },
            ],
          },
        ],
      },
    ],
  });
})();
