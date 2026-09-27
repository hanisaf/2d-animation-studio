// characters/jester_fester/asset.js: what this folder contains (read by the studio and the renderer).
asset({
  title: 'Jester Fester',
  logline: 'The court jester: juggles, tells chicken jokes, gets bonked. It is the story of his life.',
  files: ['jester_fester.js', 'juggling.js'],   // code, in load order
  docs: 'README.md',                            // who he is, look, personality, rig API
  refs: ['reference.webp'],                     // reference art
  voice: {
    prompt: 'Bright, bouncy cartoon syllables with a playful upward lilt; speech bubbles carry the words.',
    style: 'bouncy', baseHz: 240, brightness: 1.15, level: .15,
  },
});
