// comics/sami_and_jenna/book.js: the "Sami & Jenna Adventures" comic book manifest.
book({
  title: 'Sami & Jenna Adventures',
  category: "Sami's Studio",
  logline: 'Warm storybook family comics starring Dr. Sami, Jenna, and Fafy the giraffe.',
  size: { width: 1700, height: 2200, trim: 'Letter', dpi: 200 },
  style: {
    prompt: 'Warm hand-painted children’s storybook comic illustration, soft watercolor gouache shading, clean warm-ink linework, expressive faces, cozy pastel palette.',
    refs: ['style_refs/storybook_anchor_1.png'],
  },
  defaults: {
    cast: ['sami', 'jenna'],
    locations: [],
    illustration: {
      model: 'gemini-nano-banana-2.1',
      mode: 'page',
      resolution: '2K',
      thinkingLevel: 'medium',
    },
  },
  comics: [
    'ice_skating',
  ],
});
