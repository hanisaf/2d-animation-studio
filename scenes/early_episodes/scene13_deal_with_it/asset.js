// Scene 13: Deal With It. Dialogue drives the bubbles, mouths and voices; music is synthesized from the score below.
// A `group` on a line draws one bubble for everyone in it (the other speakers' entries are silentBubble, so they still voice).
asset({
  title: 'Deal With It',
  logline: 'Safadi lectures Housam and Alma on soccer until they challenge him to a match. He calls in his twin, Doctor Sami: "Deal with it." The kids call in Jenna and Danny: "DEAL WITH IT!" Referee Fester blows the whistle. To be continued...',
  files: ['scene.js'],
  docs: 'README.md',
  cast: ['safadi', 'housam', 'alma', 'sami', 'jenna', 'danny', 'jester_fester'],
  locations: ['soccer_field'],
  dialogue: [
    // the lecture
    { at: 4.2, speaker: 'safadi', text: 'Soccer, my young friends, is a game of *science*.', cps: 18, hold: .5 },
    { at: 7.6, speaker: 'safadi', text: 'Lesson one: *passing*. Always make a *triangle*.', cps: 18, hold: .5 },
    { at: 11.4, speaker: 'safadi', text: 'Lesson two: *dribbling*. Small touches, head up.', cps: 18, hold: .5 },
    { at: 15.2, speaker: 'safadi', text: 'Lesson three: *shooting*. Find the *angle*.', cps: 18, hold: .5 },
    { at: 18.4, speaker: 'housam', text: '(Twenty-seven degrees...)', cps: 15, hold: .4, energy: .7 },
    { at: 20.4, speaker: 'safadi', text: 'And lesson four, the most important: *teamwork*.', cps: 18, hold: .5 },
    { at: 24.6, speaker: 'safadi', text: 'Any questions?', cps: 15, hold: .6 },
    // the challenge
    { at: 27.2, speaker: 'housam', text: 'Professor... soccer is a *sport*.', cps: 17, hold: .3 },
    { at: 29.6, speaker: 'housam', text: "You can't *lecture* about it.", cps: 17, hold: .3 },
    { at: 31.8, speaker: 'housam', text: "Let's *play*! You against us!", cps: 17, hold: .4, energy: 1.15 },
    { at: 36.2, speaker: 'safadi', text: 'Very well...', cps: 11, hold: .5, energy: .9 },
    { at: 37.9, speaker: 'safadi', text: 'SAMI!', cps: 10, hold: .7, kind: 'shout', energy: 1.3 },
    // two against two
    { at: 43.5, speaker: 'alma', text: 'There are... *two* of you?!', cps: 17, hold: .5, energy: 1.15 },
    { at: 45.6, speaker: 'safadi', text: 'Kids... meet my *brother*.', cps: 17, hold: .4 },
    { at: 47.6, speaker: 'sami', text: "Hi! I'm *Doctor Sami*!", cps: 17, hold: .5, energy: 1.1 },
    { at: 49.6, speaker: 'safadi', text: 'Two against two.', cps: 15, hold: .4 },
    { at: 51.2, speaker: 'sami', text: "Let's see who *wins*!", cps: 16, hold: .5 },
    { at: 53.0, speaker: 'alma', text: 'No fair! Adults against *kids*!', cps: 17, hold: .5, kind: 'shout', energy: 1.25 },
    { at: 56.4, speaker: 'safadi', text: 'Deal with it.', cps: 12, hold: .9, group: ['safadi', 'sami'] },
    { at: 56.4, speaker: 'sami', text: 'Deal with it.', cps: 12, hold: .9, silentBubble: true },
    // four against two
    { at: 61.6, speaker: 'jenna', text: 'Team Kids, reporting for duty!', cps: 18, hold: .5, energy: 1.1 },
    { at: 65.2, speaker: 'danny', text: 'Did somebody say *SOCCER*?!', cps: 17, hold: .5, kind: 'shout', energy: 1.25 },
    { at: 67.6, speaker: 'housam', text: 'Meet our *cousins*. Four against two!', cps: 18, hold: .5 },
    { at: 70.4, speaker: 'safadi', text: "Four against two? That's not *fair*!", cps: 18, hold: .5, energy: 1.1 },
    { at: 73.0, speaker: 'danny', text: 'Here!', cps: 10, hold: .3 },
    { at: 75.0, speaker: 'housam', text: 'DEAL WITH IT!', cps: 12, hold: 1.2, kind: 'shout', energy: 1.35, group: ['housam', 'alma', 'jenna', 'danny'] },
    { at: 75.0, speaker: 'alma', text: 'DEAL WITH IT!', cps: 12, hold: 1.2, energy: 1.35, silentBubble: true },
    { at: 75.0, speaker: 'jenna', text: 'DEAL WITH IT!', cps: 12, hold: 1.2, energy: 1.35, silentBubble: true },
    { at: 75.0, speaker: 'danny', text: 'DEAL WITH IT!', cps: 12, hold: 1.2, energy: 1.35, silentBubble: true },
    // the referee
    { at: 82.2, speaker: 'jester_fester', text: 'Did somebody say... *unfair*?', cps: 16, hold: .4 },
    { at: 84.8, speaker: 'jester_fester', text: 'Then you need a *REFEREE*!', cps: 15, hold: .6, kind: 'shout', energy: 1.3 },
  ],
  music: {
    prompt: 'A jaunty, slightly pompous "lecture" theme with plucky bass and bells that turns into a playful Western stand-off: it drops out for "SAMI!", swells for each "deal with it" (a whoosh as the sunglasses slide on and a ding), bounces as the cousins arrive, and builds to the referee whistle and a final "to be continued" hit.',
    bpm: 116, tonic: 60, motif: [0, 4, 7, 4, 9, 7, 4, 2], chords: [0, 5, 3, 4],
    sections: [
      { at: 0, energy: .5 }, { at: 4.0, energy: .25 }, { at: 26.8, energy: .3 }, { at: 37.9, energy: 0 }, { at: 39.2, energy: .4 },
      { at: 42.4, energy: .25 }, { at: 55.6, energy: .65 }, { at: 58.6, energy: .3 }, { at: 59.2, energy: .6 }, { at: 67.4, energy: .3 },
      { at: 75.0, energy: .9 }, { at: 77.8, energy: .1 }, { at: 79.4, energy: .5 }, { at: 82.0, energy: .3 }, { at: 88.4, energy: .9 },
      { at: 89.4, energy: .55 }, { at: 93.2, energy: 0 },
    ],
    cues: [
      { at: 13.9, type: 'plip' }, { at: 26.6, type: 'bonk' }, { at: 33.0, type: 'whoosh' }, { at: 33.8, type: 'bonk' }, { at: 37.9, type: 'pop' },
      { at: 42.5, type: 'pop' }, { at: 42.9, type: 'pop' }, { at: 55.7, type: 'whoosh' }, { at: 56.3, type: 'ding' },
      { at: 59.2, type: 'whistle' }, { at: 60.1, type: 'whoosh' }, { at: 61.4, type: 'ding' }, { at: 63.8, type: 'whoosh' },
      { at: 73.6, type: 'pop' }, { at: 73.9, type: 'pop' }, { at: 74.2, type: 'pop' }, { at: 74.5, type: 'pop' }, { at: 74.9, type: 'ding' },
      { at: 78.4, type: 'gulp' }, { at: 79.4, type: 'whistle' }, { at: 88.4, type: 'whistle' }, { at: 89.4, type: 'ding' },
    ],
  },
});
