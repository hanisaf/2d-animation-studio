asset({
  title: 'The Etiquette of Employment',
  logline: 'Workplace satire: Dr. Sami asks to transfer clinics. Dr. P threatens an aerial delivery—one enormous etiquette textbook, by parachute.',
  files: ['scene.js'], docs: 'README.md', cast: ['sami', 'patrick'], locations: ['home_clinic'],
  dialogue: [
    { at: 1, speaker: 'sami', text: 'May I transfer clinics?', cps: 18, hold: 2 },
    { at: 6.5, speaker: 'patrick', text: 'Don’t you dare, or else.', cps: 15, hold: 2 },
    { at: 11.5, speaker: 'sami', text: 'Or else what?', cps: 13, hold: 2 },
    { at: 15.5, speaker: 'patrick', text: 'Or else you’ll see something floating above your house.', cps: 18, hold: 2.5 },
  ],
  music: {
    prompt: 'Quiet, dry comic pizzicato-style synthesized bells and bass. A mock ominous pause under the threat, curious notes for the hovering drone, a gentle flourish for the parachute, and a deadpan final chord. Leave room for cartoon voices.',
    bpm: 90, tonic: 60, motif: [0, 2, 1, 0, 4, 2, 1, 0], chords: [0, 3, 4, 0],
    sections: [{ at: 0, energy: .17 }, { at: 15, energy: .09 }, { at: 22, energy: .2 },
      { at: 28, energy: .27 }, { at: 36, energy: .12 }, { at: 40, energy: .04 }],
  },
});
