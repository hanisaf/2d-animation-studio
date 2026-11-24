// comics/sami_and_jenna/ice_skating/asset.js: manifest for "Ice Skating Adventure".
asset({
  title: 'Ice Skating Adventure',
  logline: 'Jenna teaches Dr. Sami to glide, dip, jump, and turn at the Minnesota ice rink.',
  cast: ['sami', 'jenna'],
  locations: [],
  files: ['comic.js'],
  docs: 'README.md',
  refs: ['Original Drawing.jpg', 'Original Drawing 2.jpg'],
  illustrated: 'illustrated/manifest.js',
  illustration: {
    model: 'gemini-nano-banana-2.1',
    mode: 'page',
    resolution: '2K',
    stylePrompt: '',
    thinkingLevel: 'medium',
  },
});
