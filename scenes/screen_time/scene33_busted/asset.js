// Scene 33: Busted! Dialogue drives the bubbles, mouths and voices; music is synthesized from the score below.
// A `group` on a line draws one bubble for everyone in it (the other speakers' entries are silentBubble, so they still voice).
asset({
  title: 'Busted!',
  logline: 'Sent outside after Screen Time, the kids mope on the lawn. "What do you think Professor Safadi and Doctor Sami are doing?" Housam spies through the living-room window: "They are on their laptops!" "We busted them!" A closer look: the professor is playing Robo Invasion, the doctor World Champion. "NOT FAIR!" "What should we do now?" Housam: "EUREKA!" Alma: "Not again…" A big grin. To be continued…',
  files: ['scene.js'],
  uses: ['scene32_screen_time'],                // the st* game screens and face glow
  docs: 'README.md',                            // synopsis, script, shot list, notes for editing
  cast: ['housam', 'danny', 'alma', 'jenna', 'safadi', 'sami', 'robo_safadi', 'neptune'],
  locations: ['house', 'living_room'],
  dialogue: [
    { at: 4.6, speaker: 'danny', text: 'What do you think *Professor Safadi* and *Doctor Sami* are doing?', cps: 17, hold: .6, energy: .8 },
    { at: 21.6, speaker: 'housam', text: 'They are on their *laptops*!', cps: 15, hold: .7, kind: 'whisper', energy: .9 },
    { at: 24.8, speaker: 'danny', text: 'We *busted* them!', cps: 13, hold: .6, kind: 'shout', energy: 1.3 },
    { at: 27.0, speaker: 'alma', text: 'Professor Safadi is *probably* researching his book.', cps: 16, hold: .6, energy: .85 },
    { at: 30.8, speaker: 'jenna', text: 'Doctor Sami is *likely* looking up medical information.', cps: 16, hold: .6, energy: .85 },
    { at: 35.0, speaker: 'housam', text: 'Let us take a *closer look*.', cps: 14, hold: .6, kind: 'whisper', energy: .9 },
    { at: 66.2, speaker: 'housam', text: 'They are playing *video games*!', cps: 15, hold: .7, kind: 'shout', energy: 1.3, group: ['housam', 'danny'] },
    { at: 66.2, speaker: 'danny', text: 'They are playing *video games*!', cps: 15, hold: .7, energy: 1.3, silentBubble: true },
    { at: 69.0, speaker: 'housam', text: 'NOT FAIR!', cps: 10, hold: .8, kind: 'shout', energy: 1.5, group: ['jenna', 'danny', 'housam', 'alma'] },
    { at: 69.0, speaker: 'danny', text: 'NOT FAIR!', cps: 10, hold: .8, energy: 1.5, silentBubble: true },
    { at: 69.0, speaker: 'jenna', text: 'NOT FAIR!', cps: 10, hold: .8, energy: 1.5, silentBubble: true },
    { at: 69.0, speaker: 'alma', text: 'NOT FAIR!', cps: 10, hold: .8, energy: 1.5, silentBubble: true },
    { at: 71.0, speaker: 'danny', text: 'What should we do *now*?', cps: 14, hold: .7, energy: .8 },
    { at: 77.4, speaker: 'housam', text: 'EUREKA!', cps: 10, hold: .9, kind: 'shout', energy: 1.45 },
    { at: 79.4, speaker: 'alma', text: 'Not *again*...', cps: 10, hold: .9, energy: .7 },
  ],
  music: {
    prompt: 'A mopey, slow autumn vamp: a lonely bassoon and plucked strings while the kids sulk, a curious rising plip on Danny\'s question, then sneaky tiptoe pizzicato (a classic spy bass line) as Housam creeps to the window, a hush and a suspense tremolo as he rises, a muffled chiptune leaking through the glass, a "gotcha!" brass hit on "We busted them!", a sarcastic little slide for each air-quoted excuse, more spy pizzicato for the closer look, the full Robo Invasion chiptune muffled behind the glass with zaps, a bouncy spring BOING for every jump of Danny\'s, the stadium roar of World Champion, a running scurry back, an indignant brass stab on "NOT FAIR!", a thinking vamp with crickets and a falling leaf, a bright ding on "EUREKA!", a slap, then a villainous low organ and thunder for his grin and the to-be-continued sting.',
    bpm: 112, tonic: 57, motif: [0, 3, 7, 6, 7, 3, 2, 0], chords: [0, 5, 3, 4],
    sections: [
      { at: 0, energy: .2 }, { at: 4.6, energy: .25 }, { at: 9.2, energy: .45 }, { at: 12.6, energy: .2 }, { at: 15.2, energy: .1 },
      { at: 17.4, energy: .35 }, { at: 21.4, energy: .25 }, { at: 24.8, energy: .7 }, { at: 26.4, energy: .3 }, { at: 34.6, energy: .4 },
      { at: 37.4, energy: .6 }, { at: 39.4, energy: .9 }, { at: 43.8, energy: .2 }, { at: 45.6, energy: .55 }, { at: 48.8, energy: .45 },
      { at: 53.0, energy: .6 }, { at: 55.0, energy: .9 }, { at: 60.1, energy: 1 }, { at: 61.0, energy: .2 }, { at: 62.6, energy: .6 },
      { at: 66.2, energy: .6 }, { at: 69.0, energy: .95 }, { at: 70.6, energy: .3 }, { at: 73.2, energy: .1 }, { at: 77.4, energy: .85 },
      { at: 79.0, energy: .3 }, { at: 82.0, energy: .55 }, { at: 86.4, energy: .9 }, { at: 88.0, energy: .45 }, { at: 92.0, energy: 0 },
    ],
    cues: [
      { at: 1.6, type: 'plip' }, { at: 2.8, type: 'bonk' }, { at: 4.8, type: 'plip' }, { at: 9.4, type: 'pop' }, { at: 10.0, type: 'pop' },
      { at: 10.6, type: 'pop' }, { at: 11.2, type: 'pop' }, { at: 11.8, type: 'pop' }, { at: 13.4, type: 'whoosh' }, { at: 15.4, type: 'plip' },
      { at: 17.6, type: 'pop' }, { at: 18.6, type: 'pop' }, { at: 24.8, type: 'ding' }, { at: 25.0, type: 'bonk' }, { at: 28.6, type: 'scratch' },
      { at: 32.4, type: 'scratch' }, { at: 35.8, type: 'pop' }, { at: 39.8, type: 'pop' }, { at: 40.6, type: 'pop' }, { at: 41.4, type: 'pop' },
      { at: 42.0, type: 'pop' }, { at: 42.7, type: 'pop' }, { at: 43.9, type: 'ding' }, { at: 46.0, type: 'whoosh' },
      { at: 49.2, type: 'bonk' }, { at: 49.9, type: 'bonk' }, { at: 50.6, type: 'bonk' }, { at: 51.3, type: 'bonk' }, { at: 52.0, type: 'bonk' },
      { at: 55.2, type: 'whistle' }, { at: 59.1, type: 'drumroll', dur: 1.0 }, { at: 60.1, type: 'ding' }, { at: 60.1, type: 'applause', dur: 2.6 },
      { at: 61.1, type: 'ding' }, { at: 62.8, type: 'whoosh' }, { at: 66.3, type: 'bonk' }, { at: 69.0, type: 'ding' }, { at: 69.1, type: 'bonk' },
      { at: 74.2, type: 'cricket' }, { at: 75.6, type: 'cricket' }, { at: 76.4, type: 'plip' }, { at: 77.4, type: 'ding' }, { at: 77.6, type: 'whoosh' },
      { at: 79.2, type: 'bonk' }, { at: 83.0, type: 'drumroll', dur: .8 }, { at: 83.8, type: 'bonk' }, { at: 86.4, type: 'ding' }, { at: 86.8, type: 'ding' },
    ],
  },
});
