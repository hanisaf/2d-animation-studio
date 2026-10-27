// scenes/scene12_umn/asset.js: what this folder contains (read by the studio and the renderer).
asset({
  title: 'Umn',
  logline: 'Doctor Sami visits the University of Minnesota',
  files: ['scene.js'],                          // the shots
  docs: 'README.md',                            // synopsis, script, shot list, notes for editing
  cast: ['sami', 'alma', 'housam', 'jenna', 'danny', 'roudaynah', 'sarah', 'safadi'],                      // character ids (the studio links them)
  locations: ['umn'],                   // location ids
  dialogue: [
    { at: 1.0, speaker: 'sami', text: 'Welcome to the U of M!', cps: 20, hold: 1.5 },
    { at: 3.5, speaker: 'alma', text: 'Dr. Sami! Could you bring our cousins Jenna and Danny to the show?', cps: 20, hold: 1.5 },
    { at: 7.5, speaker: 'housam', text: 'Yeah, they would love to see it!', cps: 20, hold: 1.5 },
    { at: 10.5, speaker: 'sami', text: 'Of course! The more, the merrier!', cps: 20, hold: 1.5 },
    { at: 15.0, speaker: 'sami', text: "All right, let's get started.", cps: 22, hold: 1.0 },
    { at: 20.2, speaker: 'jenna', text: 'Should we get Derp and Gummy Blob married?', cps: 20, hold: 1.0 },
    { at: 26.4, speaker: 'danny', text: "Let's play Mario Kart", cps: 20, hold: 1.0 },
    { at: 30.6, speaker: 'sami', text: 'Screen time can wait. Make time to play and move, too!', cps: 23, hold: .6 },
    { at: 34.1, speaker: 'safadi', text: 'Take breaks, and put screens away before bedtime.', cps: 22, hold: .6 },
    { at: 37.5, speaker: 'sami', text: 'Now, Switch down. Our show is starting!', cps: 22, hold: .8 },
    { at: 41.7, speaker: 'sarah', text: 'I wish I could come.', cps: 20, hold: 1.3 }
  ]
});
