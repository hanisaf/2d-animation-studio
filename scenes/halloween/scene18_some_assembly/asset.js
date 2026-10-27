// Scene 18: Some Assembly Required. Dialogue drives the bubbles, mouths and voices; music is synthesized from the score below.
// A `group` on a line draws one bubble for everyone in it (the other speakers' entries are silentBubble, so they still voice).
asset({
  title: 'Some Assembly Required',
  logline: 'In the science room, Alma and Jenna bolt together Robo-Safadi for Halloween (trick gets you broccoli, treat gets you candy) but he won\'t switch on. Housam starts to explain (Professor Safadi pokes his head in: "It\'s a SECRET!"): they built the hardware; now it needs software. "Danny and I will help you!" "HOORAY!" To be continued…',
  files: ['props.js', 'scene.js'],              // the wrench, step stool, rolling whiteboard and parts box, then the shots
  docs: 'README.md',                            // synopsis, script, shot list, notes for editing
  cast: ['alma', 'jenna', 'housam', 'danny', 'robo_safadi', 'safadi'],
  locations: ['science_room'],
  dialogue: [
    // the assembly
    { at: 2.6, speaker: 'alma', text: 'Hold it steady... a little to the *left*...', cps: 17, hold: .4 },
    { at: 5.4, speaker: 'jenna', text: 'Head... going *ON*!', cps: 14, hold: .5, energy: 1.15 },
    // the boys drop by
    { at: 11.8, speaker: 'housam', text: 'Whoa! What are you *girls* doing?', cps: 18, hold: .5, energy: 1.1 },
    { at: 14.4, speaker: 'danny', text: 'Is that... Professor *Safadi*?!', cps: 16, hold: .6, energy: 1.15 },
    { at: 17.0, speaker: 'alma', text: "We're building a *special robot*... for *Halloween*!", cps: 18, hold: .5, energy: 1.1 },
    { at: 20.4, speaker: 'jenna', text: 'Meet... *ROBO-SAFADI*!', cps: 14, hold: .7, kind: 'shout', energy: 1.3 },
    { at: 22.8, speaker: 'housam', text: 'Cool! What will he *do* on Halloween?', cps: 18, hold: .5 },
    { at: 25.6, speaker: 'alma', text: '*Trick*... or *treat*!', cps: 13, hold: .6, energy: 1.2, group: ['alma', 'jenna'] },
    { at: 25.6, speaker: 'jenna', text: '*Trick*... or *treat*!', cps: 13, hold: .6, energy: 1.2, silentBubble: true },
    { at: 28.0, speaker: 'jenna', text: '*Trick* gets you... *broccoli*!', cps: 16, hold: .5 },
    { at: 31.0, speaker: 'alma', text: 'And *treat* gets you... *candy*!', cps: 16, hold: .5, energy: 1.15 },
    { at: 33.8, speaker: 'housam', text: 'HA HA HA HA!', cps: 12, hold: .9, kind: 'shout', energy: 1.3, group: ['danny', 'housam', 'alma', 'jenna'] },
    { at: 33.8, speaker: 'danny', text: 'HA HA HA HA!', cps: 12, hold: .9, energy: 1.3, silentBubble: true },
    { at: 33.9, speaker: 'alma', text: 'HA HA HA HA!', cps: 12, hold: .9, energy: 1.2, silentBubble: true },
    { at: 34.0, speaker: 'jenna', text: 'HA HA HA HA!', cps: 12, hold: .9, energy: 1.2, silentBubble: true },
    // it won't switch on
    { at: 37.2, speaker: 'danny', text: 'So... how does it *work*?', cps: 16, hold: .5 },
    { at: 39.4, speaker: 'alma', text: 'Um... you press this *button*...?', cps: 16, hold: .4, energy: .9 },
    { at: 42.4, speaker: 'jenna', text: "...Why isn't it *doing* anything?", cps: 17, hold: .6, energy: .85 },
    // Housam explains
    { at: 45.0, speaker: 'housam', text: 'I can *explain*!', cps: 14, hold: .4, energy: 1.15 },
    // the interruption
    { at: 47.0, speaker: 'safadi', text: 'I heard *explain*... and you know that is *my* job!', cps: 18, hold: .4, energy: 1.05 },
    { at: 50.4, speaker: 'safadi', text: 'What are you guys *doing*?', cps: 16, hold: .4 },
    { at: 53.6, speaker: 'danny', text: "It's a *SECRET*!", cps: 12, hold: .9, kind: 'shout', energy: 1.4, group: ['danny', 'housam', 'alma', 'jenna'] },
    { at: 53.6, speaker: 'housam', text: "It's a *SECRET*!", cps: 12, hold: .9, energy: 1.3, silentBubble: true },
    { at: 53.6, speaker: 'alma', text: "It's a *SECRET*!", cps: 12, hold: .9, energy: 1.3, silentBubble: true },
    { at: 53.6, speaker: 'jenna', text: "It's a *SECRET*!", cps: 12, hold: .9, energy: 1.3, silentBubble: true },
    { at: 55.6, speaker: 'safadi', text: 'Hmm... a *secret*?', cps: 12, hold: .6, energy: .85 },
    { at: 61.2, speaker: 'housam', text: "What you're creating is the *hardware*.", cps: 17, hold: .6 },
    { at: 65.0, speaker: 'housam', text: 'You need the *software* for the robot to work.', cps: 18, hold: .6 },
    { at: 69.0, speaker: 'alma', text: '*Software*?', cps: 11, hold: .7, group: ['alma', 'jenna', 'danny'] },
    { at: 69.0, speaker: 'jenna', text: '*Software*?', cps: 11, hold: .7, silentBubble: true },
    { at: 69.0, speaker: 'danny', text: '*Software*?', cps: 11, hold: .7, silentBubble: true },
    { at: 71.2, speaker: 'housam', text: 'Software is like *knowledge*.', cps: 16, hold: .6 },
    { at: 74.2, speaker: 'housam', text: "It's what makes the robot *sense* the world...", cps: 18, hold: .4 },
    { at: 77.6, speaker: 'housam', text: '...and decide how to *behave*.', cps: 16, hold: .7 },
    { at: 81.2, speaker: 'alma', text: "But... I don't know how to make *software*.", cps: 15, hold: .7, energy: .75 },
    { at: 85.0, speaker: 'housam', text: 'Creating software is called *programming*.', cps: 17, hold: .6 },
    { at: 88.6, speaker: 'housam', text: "Don't worry! Danny and I will *help* you.", cps: 18, hold: .4, energy: 1.1 },
    { at: 91.4, speaker: 'housam', text: 'We know how to *program*!', cps: 16, hold: .5, energy: 1.15 },
    { at: 93.3, speaker: 'danny', text: 'Yeah!', cps: 10, hold: .3, energy: 1.3 },
    { at: 94.4, speaker: 'alma', text: 'HOORAY!', cps: 10, hold: .8, kind: 'shout', energy: 1.4, group: ['alma', 'jenna'] },
    { at: 94.4, speaker: 'jenna', text: 'HOORAY!', cps: 10, hold: .8, energy: 1.4, silentBubble: true },
  ],
  music: {
    prompt: 'A bouncy, tinkering workshop groove: plucky marimba and muted clicks like a toolbox, a CLANK on the wrench, a CLUNK when the head goes on, a hollow "bonk" rattle for Mr. Bones, a nosy door creak and a shove-bonk when Safadi pokes in, a big laugh hit, a sad slide-whistle droop when the robot flops, then a curious, rising "explainer" figure for the hardware/software lesson, a hopeful lift on "we know how to program", and a cheering sting into the to-be-continued hit.',
    bpm: 112, tonic: 62, motif: [0, 2, 4, 7, 4, 2, 5, 4], chords: [0, 5, 3, 4],
    sections: [
      { at: 0, energy: .45 }, { at: 7.4, energy: .6 }, { at: 8.4, energy: .4 }, { at: 17.0, energy: .5 }, { at: 20.4, energy: .75 },
      { at: 22.0, energy: .45 }, { at: 25.6, energy: .6 }, { at: 33.8, energy: .9 }, { at: 36.8, energy: .35 }, { at: 41.2, energy: .1 },
      { at: 45.0, energy: .45 }, { at: 46.3, energy: .3 }, { at: 52.8, energy: .8 }, { at: 55.4, energy: .2 }, { at: 57.9, energy: .45 }, { at: 69.0, energy: .3 }, { at: 71.0, energy: .5 }, { at: 81.0, energy: .15 }, { at: 85.0, energy: .45 },
      { at: 88.6, energy: .65 }, { at: 94.4, energy: .95 }, { at: 96.0, energy: .3 }, { at: 96.8, energy: .9 }, { at: 98.0, energy: .5 },
      { at: 101.4, energy: 0 },
    ],
    cues: [
      { at: .8, type: 'bonk' }, { at: 1.6, type: 'bonk' }, { at: 4.0, type: 'bonk' }, { at: 7.4, type: 'bonk' }, { at: 7.5, type: 'ding' },
      { at: 9.9, type: 'scratch' }, { at: 20.5, type: 'ding' }, { at: 28.3, type: 'pop' }, { at: 31.3, type: 'pop' }, { at: 33.8, type: 'ding' },
      { at: 40.6, type: 'plip' }, { at: 41.2, type: 'scratch' }, { at: 41.5, type: 'bonk' }, { at: 41.7, type: 'bonk' }, { at: 46.3, type: 'whoosh' }, { at: 52.8, type: 'bonk' }, { at: 53.0, type: 'scratch' }, { at: 53.6, type: 'ding' }, { at: 55.5, type: 'plip' }, { at: 57.95, type: 'bonk' }, { at: 60.2, type: 'whoosh' },
      { at: 61.6, type: 'pop' }, { at: 65.4, type: 'pop' }, { at: 70.9, type: 'whoosh' }, { at: 74.4, type: 'pop' }, { at: 76.6, type: 'pop' },
      { at: 77.8, type: 'pop' }, { at: 84.6, type: 'whoosh' }, { at: 85.2, type: 'ding' }, { at: 94.4, type: 'ding' }, { at: 96.0, type: 'plip' },
      { at: 96.8, type: 'ding' },
    ],
  },
});
