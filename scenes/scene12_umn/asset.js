// scenes/scene12_umn/asset.js: what this folder contains (read by the studio and the renderer).
asset({
  title: 'Umn',
  logline: 'Doctor Sami visits the University of Minnesota',
  files: ['scene.js'],                          // the shots
  docs: 'README.md',                            // synopsis, script, shot list, notes for editing
  cast: ['sami', 'alma', 'housam'],                      // character ids (the studio links them)
  locations: ['umn'],                   // location ids
  dialogue: [
    { at: 1.0, speaker: 'sami', text: 'Welcome to the U of M!', cps: 20, hold: 1.5 },
    { at: 3.5, speaker: 'alma', text: 'Dr. Sami! Could you bring our cousins Jenna and Danny to the show?', cps: 20, hold: 1.5 },
    { at: 7.5, speaker: 'housam', text: 'Yeah, they would love to see it!', cps: 20, hold: 1.5 },
    { at: 10.5, speaker: 'sami', text: 'Of course! The more, the merrier!', cps: 20, hold: 1.5 }
  ]
});
