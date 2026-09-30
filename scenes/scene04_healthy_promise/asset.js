// scenes/scene04_healthy_promise/asset.js: what this folder contains (read by the studio and the renderer).
asset({
  title: 'The healthy promise',
  logline: 'Walking Alma to school, Professor Safadi explains why healthy food matters. Candy for breakfast? Not after this. "I promise… every day!"',
  files: ['scene.js'],                          // the shots
  docs: 'README.md',                            // synopsis, script, shot list, notes for editing
  cast: ['safadi', 'alma'],
  locations: ['dces'],
  // Dialogue lives in scene.js (LINES); this score plays under it and ducks while they speak.
  music: {
    prompt: 'Sunny morning walk-to-school underscore: a light strolling bass, warm chords and skipping bells at Alma\'s dance tempo. Easy on the walk, hushed for "May I explain?", sparkling when the powers switch on, a rising zoom and a thud for the sugar crash, near-silent for "Hmmm…", then a bright lift at the idea bulb that builds to a full celebration for the twirl. Drops to a sneaky tiptoe as Safadi eyes the lollipop, a ding on the wink, and a tiny flourish for the iris-out. Instrumental under dialogue.',
    bpm: 112, tonic: 62, motif: [0, 2, 4, 7, 4, 2, 4, 1], chords: [0, 3, 4, 0],
    sections: [
      { at: 0, energy: .45 }, { at: 4.3, energy: .38 }, { at: 12.0, energy: .25 }, { at: 15.2, energy: .18 },
      { at: 16.9, energy: .55 }, { at: 24.0, energy: .32 }, { at: 28.0, energy: .45 }, { at: 30.8, energy: .22 },
      { at: 34.0, energy: .08 }, { at: 36.3, energy: .6 }, { at: 41.0, energy: .8 }, { at: 43.0, energy: .55 },
      { at: 46.6, energy: .95 }, { at: 48.2, energy: .62 }, { at: 50.5, energy: .12 }, { at: 51.8, energy: 0 },
      { at: 52.45, energy: .3 }, { at: 53.4, energy: .5 },
    ],
    cues: [
      { at: 16.9, type: 'whoosh' }, { at: 18.3, type: 'ding' }, { at: 21.8, type: 'plip' },      // powers on; the plate board
      { at: 29.4, type: 'whoosh' }, { at: 30.8, type: 'bonk' }, { at: 32.4, type: 'plip' },      // zoom… crash… veggies steady
      { at: 36.3, type: 'ding' }, { at: 41.2, type: 'pop' },                                      // idea bulb; star eyes
      { at: 43.6, type: 'plip' }, { at: 46.7, type: 'whoosh' }, { at: 47.9, type: 'ding' },      // hand-off; the twirl
      { at: 51.85, type: 'pop' }, { at: 52.45, type: 'ding' }, { at: 54.0, type: 'plip' },       // freeze; wink; iris-out
    ],
  },
});
