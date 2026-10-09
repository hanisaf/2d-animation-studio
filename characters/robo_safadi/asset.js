// characters/robo_safadi/asset.js: what this folder contains (read by the studio and the renderer).
asset({
  title: 'Robo-Safadi',
  logline: "The robot professor Alma and Jenna dreamed up for Halloween: Safadi's hair and suit on a riveted box body, LED eyes that ACTIVATE red, and one mission: EAT. YOUR. BROCCOLI.",
  files: ['robo_safadi.js'],                    // code, in load order
  docs: 'README.md',                            // description, look, personality, rig API
  refs: ['reference.jpg'],                      // the model sheet (re-render: node render.mjs --modelsheet=robo_safadi)
  voice: {
    prompt: 'A flat, buzzy robot monotone: square-wave syllables, clipped and evenly spaced, an occasional low "error" drop and a high beep.',
    style: 'robot', baseHz: 150, brightness: 1.25, level: .14, pan: .05,
  },
});
