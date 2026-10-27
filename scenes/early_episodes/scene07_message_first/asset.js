// Scene 07: Safadi's lecture on restraint. Dialogue here drives the bubbles, his mouth and the synthesized voice.
asset({
  title: 'The Message Comes First',
  logline: 'In the lecture hall, Professor Safadi reminds the class that AI can make everything move, but the message should get the spotlight. Housam and Alma listen, nod and trade glances.',
  files: ['scene.js'],
  docs: 'README.md',
  cast: ['safadi', 'housam', 'alma'],
  locations: ['lecture_hall'],
  dialogue: [
    { at: 0.8, speaker: 'safadi', text: 'With AI, a sketch can become a *character*...', cps: 21, hold: .7 },
    { at: 4.0, speaker: 'safadi', text: '...and a character can come to *life*.', cps: 20, hold: 1.0 },
    { at: 7.5, speaker: 'safadi', text: 'Work that once took hours, days, or a team of professionals can now happen *much faster*.', cps: 22, hold: 1.0 },
    { at: 13.5, speaker: 'safadi', text: 'That opens up *wonderful possibilities*.', cps: 20, hold: .9 },
    { at: 16.8, speaker: 'safadi', text: 'We can experiment, tell stories, and try ideas we might never have attempted.', cps: 22, hold: .8 },
    { at: 21.7, speaker: 'safadi', text: 'And once we discover we can make *everything* move...', cps: 21, hold: .5 },
    { at: 25.1, speaker: 'safadi', text: "...we're *tempted* to make everything move.", cps: 19, hold: 1.0, energy: 1.1 },
    { at: 29.4, speaker: 'safadi', text: 'But before adding another effect, ask: *what am I trying to say?*', cps: 20, hold: 1.1 },
    { at: 34.2, speaker: 'safadi', text: 'Does the animation help someone *understand*?', cps: 21, hold: .7 },
    { at: 37.4, speaker: 'safadi', text: 'Does it make the idea easier to *remember*?', cps: 21, hold: .7 },
    { at: 40.6, speaker: 'safadi', text: 'Or does it just give them *more to look at*?', cps: 19, hold: 1.0 },
    { at: 44.9, speaker: 'safadi', text: 'Sometimes movement makes an idea *clear*.', cps: 20, hold: .8 },
    { at: 48.1, speaker: 'safadi', text: 'Sometimes a simple image, a few words, or a quiet moment does the job *beautifully*.', cps: 21, hold: 1.1 },
    { at: 53.9, speaker: 'safadi', text: 'Just because we can make something flashy...', cps: 20, hold: .4 },
    { at: 57.0, speaker: 'safadi', text: "...doesn't mean that's what it *needs*.", cps: 18, hold: 1.2 },
    { at: 62.8, speaker: 'safadi', text: 'Give the message the *spotlight*.', cps: 15, hold: 1.8, energy: .9 },
  ],
  music: {
    prompt: 'Soft, thoughtful lecture-hall underscore: warm bass and a few sparse bells. It swells with sparkle while Safadi is tempted to make everything move, drops almost to silence when he stops himself, and ends on one small, bright chime for the spotlight. Instrumental under dialogue.',
    bpm: 84, tonic: 57, motif: [0, 2, 4, 2, 1, 2, 4, 5], chords: [0, 5, 3, 4],
    sections: [
      { at: 0, energy: .22 }, { at: 13.2, energy: .3 }, { at: 21.8, energy: .5 }, { at: 25, energy: .72 },
      { at: 28.7, energy: .05 }, { at: 34, energy: .18 }, { at: 44.6, energy: .22 }, { at: 53.7, energy: .2 },
      { at: 60.8, energy: .06 }, { at: 63.8, energy: .34 }, { at: 66.6, energy: .08 },
    ],
    cues: [
      { at: 21.9, type: 'whoosh' }, { at: 23.6, type: 'ding' }, { at: 28.8, type: 'plip' }, { at: 63.9, type: 'ding' },
    ],
  },
});
