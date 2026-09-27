// characters/safadi/asset.js: what this folder contains (read by the studio and the renderer).
asset({
  title: 'Professor Safadi',
  logline: 'A big-headed professor in a tan three-piece suit with super explanatory powers: glowing chalk formulas, idea bulbs and floating chalkboards.',
  files: ['safadi.js'],                         // code, in load order
  docs: 'README.md',                            // description, look, personality, rig API
  refs: ['reference.jpg'],                      // reference art in this folder
  voice: {
    prompt: 'Patient, warm, low-pitched professor mumble; measured phrases with gentle falling cadences.',
    style: 'measured', baseHz: 166, brightness: .82, level: .18, pan: -.05,
  },
});
