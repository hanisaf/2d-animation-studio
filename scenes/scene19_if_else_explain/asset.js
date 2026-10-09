// Scene 19: If, Else, Explain! Dialogue drives the bubbles, mouths and voices; music is synthesized from the score below.
// A `group` on a line draws one bubble for everyone in it (the other speakers' entries are silentBubble, so they still voice).
asset({
  title: 'If, Else, Explain!',
  logline: 'Housam and Danny program Robo-Safadi: an if/else for trick or treat, then a large language model (Clawd!) to make him less predictable. The prompt: "Do something interesting and surprising! Robot goes haywire!" The trigger: Professor Safadi\'s favorite word. "EXPLAIN!" To be continued…',
  files: ['props.js', 'scene.js'],              // the cart, laptop, hologram panel and code editor, then the shots
  docs: 'README.md',                            // synopsis, script, shot list, notes for editing
  cast: ['housam', 'danny', 'clawd', 'robo_safadi'],
  locations: ['science_room'],
  dialogue: [
    // the conditional
    { at: 2.4, speaker: 'danny', text: 'So... how are we going to program the *trick or treat*?', cps: 17, hold: .4 },
    { at: 5.8, speaker: 'housam', text: 'With a *conditional statement*!', cps: 15, hold: .4, energy: 1.1 },
    { at: 8.4, speaker: 'housam', text: 'It creates a *branch*... based on whether a *condition* is true.', cps: 18, hold: .4 },
    { at: 12.4, speaker: 'housam', text: 'Like... *if* someone presses the *trick* button...', cps: 17, hold: .2 },
    { at: 15.4, speaker: 'housam', text: '...*or* the *treat* button!', cps: 15, hold: .5 },
    { at: 17.9, speaker: 'danny', text: "This is *awesome*, Housam! You're as brainy as *Professor Safadi*!", cps: 19, hold: .4, energy: 1.15 },
    { at: 21.8, speaker: 'danny', text: 'I wonder *why*...?', cps: 12, hold: .6, energy: .9 },
    { at: 23.8, speaker: 'housam', text: 'Heh heh heh!', cps: 12, hold: .6, group: ['housam', 'danny'] },
    { at: 23.8, speaker: 'danny', text: 'Heh heh heh!', cps: 12, hold: .6, silentBubble: true },
    // the if/else
    { at: 30.0, speaker: 'housam', text: 'I think this will *do*.', cps: 15, hold: .6 },
    { at: 32.6, speaker: 'danny', text: 'But this is *boring*... the robot is *repetitive* and *predictable*.', cps: 18, hold: .3, energy: .85 },
    { at: 36.6, speaker: 'danny', text: 'We want it more *fun*... more *interesting*! But *how*?', cps: 18, hold: .4 },
    // the large language model
    { at: 42.4, speaker: 'housam', text: 'We can use a... *large language model*!', cps: 16, hold: .5, energy: 1.2 },
    { at: 45.4, speaker: 'danny', text: 'A *large language model*! What is *that*?', cps: 17, hold: .4, energy: 1.1 },
    { at: 48.2, speaker: 'housam', text: "It's an *artificial intelligence* model...", cps: 17, hold: .2 },
    { at: 51.2, speaker: 'housam', text: '...that can create *unpredictable* output!', cps: 17, hold: .8 },
    { at: 55.6, speaker: 'danny', text: 'Cool! How are we going to *program* it?', cps: 17, hold: .4 },
    { at: 58.4, speaker: 'housam', text: 'We give it a beginning... called a *prompt*.', cps: 16, hold: .3 },
    { at: 61.6, speaker: 'housam', text: 'Then it *follows* the prompt. What do you want to say?', cps: 18, hold: .4 },
    { at: 65.4, speaker: 'danny', text: 'How about... *Do something interesting and surprising!*', cps: 16, hold: .4, energy: 1.1 },
    { at: 69.6, speaker: 'housam', text: 'Hmm... this would *work*.', cps: 13, hold: .4, energy: .9 },
    { at: 72.8, speaker: 'housam', text: "Let's *spice it up*!", cps: 13, hold: .5, group: ['housam', 'danny'] },
    { at: 72.8, speaker: 'danny', text: "Let's *spice it up*!", cps: 13, hold: .5, silentBubble: true },
    { at: 74.8, speaker: 'housam', text: 'heh heh heh...', cps: 12, hold: .3, kind: 'whisper', energy: .5, group: ['housam', 'danny'] },
    { at: 74.8, speaker: 'danny', text: 'heh heh heh...', cps: 12, hold: .3, kind: 'whisper', energy: .5, silentBubble: true },
    { at: 77.2, speaker: 'housam', text: '*Robot goes haywire!*', cps: 14, hold: .7, energy: 1.25, group: ['housam', 'danny'] },
    { at: 77.2, speaker: 'danny', text: '*Robot goes haywire!*', cps: 14, hold: .7, energy: 1.25, silentBubble: true },
    // the trigger
    { at: 80.8, speaker: 'housam', text: 'We need another *branch* to activate the large language model.', cps: 19, hold: .3 },
    { at: 84.6, speaker: 'housam', text: 'What would be the *trigger*?', cps: 15, hold: .5 },
    { at: 87.6, speaker: 'danny', text: 'Well... this is *Robo-Safadi*...', cps: 14, hold: .2 },
    { at: 90.2, speaker: 'danny', text: "...so we use Professor Safadi's *favorite word*!", cps: 17, hold: .4, energy: 1.1 },
    { at: 93.4, speaker: 'housam', text: 'EXPLAIN!', cps: 10, hold: .8, kind: 'shout', energy: 1.45, group: ['housam', 'danny'] },
    { at: 93.4, speaker: 'danny', text: 'EXPLAIN!', cps: 10, hold: .8, energy: 1.45, silentBubble: true },
    { at: 99.6, speaker: 'housam', text: 'And... *done*!', cps: 12, hold: .5, energy: 1.1 },
    { at: 101.2, speaker: 'housam', text: 'HA HA HA HA!', cps: 12, hold: .9, kind: 'shout', energy: 1.3, group: ['housam', 'danny'] },
    { at: 101.2, speaker: 'danny', text: 'HA HA HA HA!', cps: 12, hold: .9, energy: 1.3, silentBubble: true },
  ],
  music: {
    prompt: 'A clicky, curious coding groove: keyboard-tap percussion, a bubbly synth arpeggio, a bright "branch" ding on each if/else, a hush and a thinking-ticks vamp while Housam thinks, a sparkly pop when Clawd jumps out of the laptop, random boops for the unpredictable output, a sneaky pizzicato for "spice it up", a glitchy wobble on "Robot goes haywire!", a big hit on "EXPLAIN!", and a cheeky sting into the to-be-continued.',
    bpm: 116, tonic: 64, motif: [0, 4, 7, 4, 9, 7, 4, 2], chords: [0, 3, 5, 4],
    sections: [
      { at: 0, energy: .45 }, { at: 5.8, energy: .55 }, { at: 17.9, energy: .6 }, { at: 23.8, energy: .7 }, { at: 26.2, energy: .4 },
      { at: 32.6, energy: .2 }, { at: 39.8, energy: .1 }, { at: 42.4, energy: .8 }, { at: 45.4, energy: .5 }, { at: 51.2, energy: .75 },
      { at: 55.4, energy: .45 }, { at: 65.4, energy: .55 }, { at: 69.6, energy: .3 }, { at: 72.8, energy: .6 }, { at: 77.2, energy: .85 },
      { at: 80.6, energy: .4 }, { at: 87.6, energy: .25 }, { at: 93.4, energy: 1 }, { at: 95.2, energy: .5 }, { at: 101.2, energy: .85 },
      { at: 104.0, energy: .9 }, { at: 105.4, energy: .5 }, { at: 109.4, energy: 0 },
    ],
    cues: [
      { at: 8.8, type: 'ding' }, { at: 10.2, type: 'pop' }, { at: 12.9, type: 'ding' }, { at: 15.8, type: 'ding' }, { at: 22.6, type: 'plip' },
      { at: 29.8, type: 'ding' }, { at: 40.6, type: 'plip' }, { at: 41.4, type: 'plip' }, { at: 42.6, type: 'whoosh' }, { at: 42.9, type: 'pop' },
      { at: 51.6, type: 'pop' }, { at: 52.0, type: 'pop' }, { at: 52.4, type: 'plip' }, { at: 52.8, type: 'pop' }, { at: 53.2, type: 'plip' },
      { at: 53.6, type: 'pop' }, { at: 54.0, type: 'pop' }, { at: 58.8, type: 'ding' }, { at: 68.8, type: 'ding' }, { at: 78.2, type: 'scratch' },
      { at: 82.0, type: 'ding' }, { at: 85.0, type: 'plip' }, { at: 93.4, type: 'ding' }, { at: 93.5, type: 'whoosh' }, { at: 98.6, type: 'ding' },
      { at: 102.6, type: 'scratch' }, { at: 104.0, type: 'ding' },
    ],
  },
});
