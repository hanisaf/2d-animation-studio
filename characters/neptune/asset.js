// characters/neptune/asset.js: what this folder contains (read by the studio and the renderer).
asset({
  title: 'Neptune',
  logline: 'A plush blue dolphin with a rainbow-striped belly who calls himself "King Neptune" (he is not a king). Hilarious, kind, and packing ultra-awesome water powers.',
  files: ['neptune.js', '../fighting-poses.js'],                        // code, in load order
  docs: 'README.md',                            // description, look, personality, rig API
  refs: ['reference.webp'],                     // reference art in this folder
  voice: {
    prompt: 'Big, goofy, booming dolphin mumble: a royal announcer who keeps cracking himself up; bouncy rises and chirpy clicks.',
    style: 'bouncy', baseHz: 205, brightness: 1.08, level: .17, pan: -.15,
  },
});
