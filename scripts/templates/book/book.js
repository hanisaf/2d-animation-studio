// comics/__NAME__/book.js: the "__TITLE__" comic book manifest.
book({
  title: '__TITLE__',
  category: '__CATEGORY__',
  logline: '',
  size: { width: 1700, height: 2200, trim: 'Letter', dpi: 200 },
  style: {
    prompt: 'Warm hand-painted children’s storybook comic illustration, soft watercolor gouache shading, clean warm-ink linework, expressive faces.',
    refs: [],                                   // drop 1–4 anchor images in style_refs/ and list them here
  },
  defaults: {
    cast: ['sami', 'jenna'],
    locations: [],
    illustration: {
      model: 'gemini-nano-banana-2.1',
      mode: 'page',                             // 'page' | 'panel'
      resolution: '2K',                         // '1K' | '2K' | '4K'
      thinkingLevel: 'medium',
    },
  },
  comics: [
  ],
});
