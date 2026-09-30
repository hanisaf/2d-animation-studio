// characters/sami/asset.js: what this folder contains (read by the studio and the renderer).
asset({
  title: 'Doctor Sami',
  logline: 'A smart and humble doctor (and Professor Safadi\'s twin brother!) who educates kids about health in a funny way.',
  files: ['sami.js'],                           // code, in load order
  docs: 'README.md',                            // description, look, personality, rig API
  refs: ['reference.jpeg'],                      // reference art in this folder
  voice: {
    prompt: 'Warm, upbeat doctor; energetic phrases with goofy inflection to make kids laugh.',
    style: 'energetic', baseHz: 175, brightness: .85, level: .22, pan: .05,
  },
});
