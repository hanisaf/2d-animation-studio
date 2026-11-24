// comics/__BOOK__/__NAME__/asset.js: manifest for "__TITLE__".
asset({
  title: '__TITLE__',
  logline: '<one-line comic description>',
  cast: ['sami', 'jenna'],                      // character rigs to load from characters/
  locations: [],                                // ONLY registered LOCATIONS ids actually drawn by comic.js
  files: ['comic.js'],
  docs: 'README.md',
  refs: [],                                     // optional hand-drawn sketches / reference art in this folder
  illustration: {
    model: 'gemini-nano-banana-2.1',
    mode: 'page',                               // 'page' (full page) | 'panel' (per-panel + vector lettering)
    resolution: '2K',                           // '1K' | '2K' | '4K'
    stylePrompt: '',                            // optional override appended to book.style.prompt
    thinkingLevel: 'medium',
  },
});
