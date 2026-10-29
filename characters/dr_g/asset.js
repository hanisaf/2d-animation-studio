// characters/dr_g/asset.js: what this folder contains (read by the studio and the renderer).
asset({
  title: 'Dr. G',
  logline: 'A doctor-teacher as kind as a kindergarten teacher, who loves healthy food, rules, books, cooking, fashion, nature and oriental music.',
  files: ['dr_g.js'],                           // code, in load order
  docs: 'README.md',                            // description, look, personality, rig API
  refs: ['reference.jpg'],                      // reference art in this folder
  voice: {
    prompt: 'Gentle, warm kindergarten-teacher doctor; patient, sing-song encouragement, firm but loving when she states a rule.',
    style: 'warm', baseHz: 230, brightness: .88, level: .18, pan: -.05,
  },
});
