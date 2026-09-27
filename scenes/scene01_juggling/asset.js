// scenes/scene01_juggling/asset.js: what this folder contains (read by the studio and the renderer).
asset({
  title: 'Juggling in the throne room',
  logline: '"I\'m Jester Fester… and this is the story of my life!" He juggles, flings the balls into the chandelier, and they come back down on his head.',
  files: ['scene.js'],                          // the shots
  docs: 'README.md',                            // synopsis, script, shot list, notes for editing
  dialogue: [
    { at: 8.2, speaker: 'jester_fester', text: "I'm *Jester Fester*...", cps: 18, hold: 2.2 },
    { at: 14.45, speaker: 'jester_fester', text: '...and this is *the story of my life!*', cps: 18, hold: 2.0 },
  ],
  music: {
    prompt: 'Playful royal chamber music with bright bells and a bouncy bass. Begin gently, grow frantic with the five-ball juggling, pause for the chandelier, punctuate each bonk, and end with a tiny triumphant flourish. Instrumental only.',
    bpm: 100,
    tonic: 60,
    motif: [0, 2, 4, 2, 5, 4, 2, 1],
    chords: [0, 3, 4, 0],
    sections: [
      { at: 0, energy: .28 },
      { at: 5.5, energy: .48 },
      { at: 7.5, energy: .62 },
      { at: 14, energy: .9 },
      { at: 20.5, energy: .13 },
      { at: 23.3, energy: .04 },
      { at: 26.4, energy: .52 },
      { at: 29.3, energy: .15 },
    ],
    cues: [
      { at: 5.5, type: 'pop' }, { at: 13, type: 'whoosh' }, { at: 20.5, type: 'whoosh' },
      { at: 21.25, type: 'ding' },
      { at: 23.35, type: 'bonk' }, { at: 23.7, type: 'bonk' }, { at: 24.05, type: 'bonk' }, { at: 24.4, type: 'bonk' },
      { at: 28.75, type: 'plip' }, { at: 29.1, type: 'ding' },
    ],
  },
  cast: ['jester_fester'],
  locations: ['throne_room'],
});
