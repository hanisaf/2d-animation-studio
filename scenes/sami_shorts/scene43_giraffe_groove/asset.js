asset({
  title: 'Giraffe Groove',
  logline: 'Jenna dances with a towering, friendly giraffe while keeping her little plush giraffe tucked safely in her hand.',
  files: ['scene.js'],
  docs: 'README.md',
  cast: ['jenna'],
  locations: [],
  music: {
    prompt: 'A sunny, playful children’s dance tune with marimba, handclaps, warm bass and tiny brass pops. It starts with a curious tiptoe, grows into a joyful synchronized groove, then lands on a bright final pose.',
    bpm: 112, tonic: 62,
    motif: [0, 4, 7, 9, 7, 4, 2, 4], chords: [0, 3, 4, 0],
    sections: [
      { at: 0, energy: .35 }, { at: 3, energy: .62 }, { at: 7, energy: .78 },
      { at: 12, energy: .92 }, { at: 16, energy: .7 }, { at: 17.5, energy: .08 },
    ],
    cues: [
      { at: 2.8, type: 'pop' }, { at: 7, type: 'whoosh' },
      { at: 11.8, type: 'ding' }, { at: 17.1, type: 'bonk' },
    ],
  },
});
