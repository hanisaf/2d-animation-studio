// Scene 23: The Secret Potion. Dialogue drives the bubbles, mouths and voices; music is synthesized from the score below.
// A `group` lists the characters who share one bubble; the other voices in it are silentBubble entries.
asset({
  title: 'The Secret Potion',
  logline: 'In the gym, Jenna\'s cartwheels make Alma want to learn. Professor Safadi explains explicit knowledge (the what, in books) and tacit knowledge (the how, only by practice). Housam practices; Danny wants a secret potion instead, and the Safadi brothers give him one: broccoli juice with unsweet tea. A week later, Alma lands her cartwheel. "Nothing beats watching the kids grow their skills."',
  files: ['props.js', 'scene.js'],              // the bench, the potion, the cube, the cards; then the shots
  docs: 'README.md',                            // synopsis, script, shot list, notes for editing
  cast: ['safadi', 'sami', 'jenna', 'alma', 'housam', 'danny'],
  locations: ['school_gym'],
  dialogue: [
    // cartwheels
    { at: 1.2, speaker: 'jenna', text: 'I practice here *every day*! Watch this, Alma!', cps: 18, hold: .4, energy: 1.15 },
    { at: 7.8, speaker: 'alma', text: "WOW! Jenna, that's *awesome*!", cps: 15, hold: .5, energy: 1.25 },
    { at: 10.6, speaker: 'alma', text: 'My turn!', cps: 11, hold: .4, energy: 1.2 },
    { at: 14.6, speaker: 'alma', text: 'I want to do a cartwheel *just like you*, Jenna!', cps: 16, hold: .6, energy: .95 },
    { at: 19.0, speaker: 'housam', text: 'Professor, do you have a *book* explaining how to do cartwheels?', cps: 19, hold: .4, energy: 1.05 },
    // the lesson
    { at: 24.8, speaker: 'safadi', text: 'Hmm... an *excellent* question, Housam!', cps: 15, hold: .4, energy: 1.1 },
    { at: 28.2, speaker: 'safadi', text: 'There are *two kinds* of knowledge.', cps: 14, hold: .4 },
    { at: 31.4, speaker: 'safadi', text: '*Explicit* knowledge is the *what*. You can find it in *books*.', cps: 17, hold: .4 },
    { at: 36.4, speaker: 'safadi', text: 'Want to learn countries and their capitals? Pick up an *atlas*!', cps: 18, hold: .4, energy: 1.1 },
    { at: 41.0, speaker: 'safadi', text: 'But *tacit* knowledge is the *how*.', cps: 13, hold: .5 },
    { at: 44.8, speaker: 'safadi', text: 'It lives *inside* you. You can only learn it by *practice*.', cps: 16, hold: .5 },
    { at: 49.6, speaker: 'safadi', text: 'Alma, to learn a cartwheel, practice *every day* with Jenna.', cps: 17, hold: .5, energy: 1.05 },
    { at: 54.4, speaker: 'alma', text: 'Every day? Yes! Come on, Jenna!', cps: 16, hold: .3, energy: 1.3 },
    // meanwhile
    { at: 66.6, speaker: 'danny', text: 'WHOA! Housam, *teach me*! Teach me!', cps: 15, hold: .4, kind: 'shout', energy: 1.35 },
    { at: 70.0, speaker: 'housam', text: '*Ahem.* Soccer skills are *tacit knowledge*, Danny.', cps: 15, hold: .4, energy: .95 },
    { at: 74.4, speaker: 'housam', text: 'The *only* way to learn them is to *practice*. Practice with me!', cps: 17, hold: .4, energy: 1.1 },
    { at: 79.0, speaker: 'danny', text: 'Practice? Nooo...', cps: 11, hold: .4, energy: .7 },
    { at: 81.4, speaker: 'danny', text: 'I want a *secret potion* that gives me soccer *super skills*!', cps: 17, hold: .6, energy: 1.2 },
    // the brothers
    { at: 87.6, speaker: 'sami', text: 'Brother... how about we give them a *secret potion*?', cps: 16, hold: .4, kind: 'whisper', energy: .85 },
    { at: 91.4, speaker: 'safadi', text: 'A *healthy* secret potion.', cps: 13, hold: .4, kind: 'whisper', energy: .85 },
    { at: 94.2, speaker: 'sami', text: '*Broccoli juice*...', cps: 11, hold: .3, kind: 'whisper', energy: .9 },
    { at: 96.2, speaker: 'safadi', text: '...with *unsweet tea*!', cps: 12, hold: .3, kind: 'whisper', energy: .95 },
    { at: 98.4, speaker: 'sami', text: 'HA HA HA!', cps: 10, hold: .6, kind: 'shout', energy: 1.3, group: ['safadi', 'sami'] },
    { at: 98.4, speaker: 'safadi', text: 'HA HA HA!', cps: 10, hold: .6, energy: 1.3, silentBubble: true },
    // the potion
    { at: 103.2, speaker: 'sami', text: 'Danny, drink this potion *every day* for a week.', cps: 16, hold: .4 },
    { at: 107.4, speaker: 'sami', text: 'But I must warn you... it is *not* delicious.', cps: 15, hold: .4, energy: .9 },
    { at: 110.6, speaker: 'danny', text: 'Hmph. Fine...', cps: 10, hold: .3, energy: .7 },
    { at: 114.6, speaker: 'danny', text: 'BLEEECH!', cps: 10, hold: .6, kind: 'shout', energy: 1.45 },
    { at: 118.8, speaker: 'housam', text: "No thanks, Doctor Sami. I'd rather *practice* than drink *that*!", cps: 17, hold: .6, energy: 1.1 },
    // the week
    { at: 141.6, speaker: 'alma', text: 'I DID IT!', cps: 10, hold: .4, kind: 'shout', energy: 1.45 },
    { at: 142.6, speaker: 'jenna', text: 'YAY!', cps: 8, hold: .3, kind: 'shout', energy: 1.4 },
    // the bench
    { at: 144.4, speaker: 'safadi', text: 'Nothing beats watching the kids *grow* their skills.', cps: 15, hold: .6, energy: .95 },
    { at: 149.0, speaker: 'sami', text: '...and drinking *broccoli juice* with *unsweet tea*!', cps: 16, hold: .5, energy: 1.15 },
    { at: 153.4, speaker: 'safadi', text: 'HA HA HA!', cps: 10, hold: .6, kind: 'shout', energy: 1.3, group: ['safadi', 'sami'] },
    { at: 153.4, speaker: 'sami', text: 'HA HA HA!', cps: 10, hold: .6, energy: 1.3, silentBubble: true },
  ],
  music: {
    prompt: 'A bouncy, sneaker-squeak PE-class groove: whooshes on each cartwheel, a comic bonk when Alma flops, a thoughtful, plucky "lesson" texture under Safadi\'s explanation with plips as the boards chalk in, a punchy run for Housam\'s tricks topped by a ding-and-swish, a sneaky tiptoe sting for the brothers\' wink, gulps and a sour honk for the potion, a ticking "week goes by" motif with a ding for each day, a triumphant lift for Alma\'s first cartwheel and a warm, chuckling close into the to-be-continued.',
    bpm: 116, tonic: 62, motif: [0, 2, 4, 7, 9, 7, 4, 2], chords: [0, 5, 3, 4],
    sections: [
      { at: 0, energy: .6 }, { at: 4.6, energy: .8 }, { at: 11.6, energy: .5 }, { at: 13.2, energy: .3 }, { at: 19.0, energy: .45 },
      { at: 24.8, energy: .3 }, { at: 41.0, energy: .35 }, { at: 54.4, energy: .75 }, { at: 57.6, energy: .7 }, { at: 61.4, energy: .95 },
      { at: 66.2, energy: .7 }, { at: 70.0, energy: .35 }, { at: 79.0, energy: .25 }, { at: 86.0, energy: .2 }, { at: 98.4, energy: .6 },
      { at: 100.4, energy: .3 }, { at: 112.2, energy: .2 }, { at: 114.6, energy: .6 }, { at: 116.0, energy: .3 }, { at: 123.4, energy: .55 },
      { at: 139.4, energy: .8 }, { at: 141.6, energy: 1 }, { at: 143.6, energy: .35 }, { at: 153.4, energy: .6 }, { at: 155.6, energy: .7 },
      { at: 157.0, energy: .35 }, { at: 161.6, energy: 0 },
    ],
    cues: [
      { at: 4.6, type: 'whoosh' }, { at: 6.0, type: 'whoosh' }, { at: 7.4, type: 'pop' }, { at: 13.1, type: 'bonk' }, { at: 19.6, type: 'plip' },
      { at: 31.6, type: 'plip' }, { at: 41.2, type: 'plip' }, { at: 55.0, type: 'whoosh' }, { at: 57.6, type: 'ding' }, { at: 61.4, type: 'whoosh' },
      { at: 64.3, type: 'pop' }, { at: 65.85, type: 'ding' }, { at: 66.0, type: 'whoosh' }, { at: 86.4, type: 'ding' }, { at: 87.0, type: 'ding' },
      { at: 101.4, type: 'pop' }, { at: 112.6, type: 'gulp' }, { at: 113.2, type: 'gulp' }, { at: 113.8, type: 'gulp' }, { at: 114.6, type: 'scratch' },
      { at: 117.0, type: 'pop' }, { at: 123.4, type: 'ding' }, { at: 125.0, type: 'ding' }, { at: 126.0, type: 'bonk' }, { at: 126.9, type: 'gulp' },
      { at: 128.6, type: 'ding' }, { at: 130.5, type: 'gulp' }, { at: 132.2, type: 'ding' }, { at: 134.1, type: 'gulp' }, { at: 135.8, type: 'ding' },
      { at: 137.7, type: 'gulp' }, { at: 139.4, type: 'ding' }, { at: 140.2, type: 'whoosh' }, { at: 141.6, type: 'pop' }, { at: 149.6, type: 'gulp' },
      { at: 150.8, type: 'scratch' }, { at: 155.6, type: 'ding' },
    ],
  },
});
