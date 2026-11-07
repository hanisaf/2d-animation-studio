// Scene 64: The Card Collectors. Dialogue drives the bubbles, mouths and voices; music is synthesized from the score below.
// A `group` on a line draws one bubble for everyone in it (the other speakers' entries are silentBubble, so they still voice).
// The five reasons come from Housam's article "The Success of the Pokemon TCG" (see README.md).
asset({
  title: 'Pokemon 1 · The Card Collectors',
  logline: 'In Housam\'s bedroom, Housam and Alma sort their Pokemon cards: a shiny dragon, a superhero dolphin. Jenna and Danny drop by: "Are those… stickers?" "They are Pokemon cards! They have made 34 billion dollars!" "Allow me to explain!" Five reasons: cute and cool creatures, amazing art, a real game (a 60-card deck, cards for less than a dollar, BOOM), promo cards you only get in special boxes or at events, and a huge market for the cards everybody wants. Jenna and Danny want in, and the four kids plan a Pokemon TCG tournament. "LET\'S DO IT!" To be continued…',
  files: ['props.js', 'scene.js'],              // the trading cards, binder, boxes and the full-frame explainer inserts, then the shots
  docs: 'README.md',                            // synopsis, script, shot list, notes for editing
  cast: ['housam', 'alma', 'jenna', 'danny'],
  locations: ['housam_bedroom'],
  dialogue: [
    // part 1: the collections
    { at: 2.4, speaker: 'housam', text: 'Look, Alma! I finally pulled the *shiny dragon*!', cps: 16, hold: .5, energy: 1.1 },
    { at: 6.3, speaker: 'alma', text: 'No way! And I got the *superhero dolphin*!', cps: 16, hold: .5, energy: 1.1 },
    { at: 9.9, speaker: 'housam', text: 'Our collections are getting *huge*.', cps: 15, hold: .6 },
    // part 2: Jenna and Danny drop by
    { at: 15.8, speaker: 'jenna', text: 'Hi! What are you two doing?', cps: 15, hold: .4 },
    { at: 18.6, speaker: 'danny', text: 'Are those... *stickers*?', cps: 12, hold: .5 },
    { at: 21.5, speaker: 'alma', text: 'No, silly! They are *Pokemon cards*!', cps: 15, hold: .5, energy: 1.05 },
    { at: 24.7, speaker: 'jenna', text: 'Poke-what?', cps: 11, hold: .5 },
    { at: 26.7, speaker: 'housam', text: 'Pokemon cards have made *34 billion dollars*!', cps: 15, hold: .5, energy: 1.15 },
    { at: 30.5, speaker: 'danny', text: 'BILLION?!', cps: 9, hold: .8, kind: 'shout', energy: 1.4 },
    { at: 32.8, speaker: 'jenna', text: 'How can pieces of *cardboard* make that much money?', cps: 16, hold: .5 },
    { at: 36.9, speaker: 'housam', text: 'Allow me to explain!', cps: 13, hold: .6, energy: 1.1 },
    { at: 39.5, speaker: 'alma', text: 'You sound just like *the Professor*...', cps: 14, hold: .5, energy: .8 },
    // reason 1: cute and cool creatures
    { at: 43.1, speaker: 'alma', text: 'Reason one: the creatures are *cute and cool*!', cps: 16, hold: .4 },
    { at: 46.7, speaker: 'alma', text: 'Who doesn\'t want a *superhero dolphin*, or a *giant red dragon*?', cps: 17, hold: .5 },
    { at: 51.3, speaker: 'housam', text: 'Kids *and* grown-ups love them, more than other card games.', cps: 17, hold: .5 },
    // reason 2: the art
    { at: 56.3, speaker: 'housam', text: 'Reason two: the *art* is amazing.', cps: 15, hold: .4 },
    { at: 59.2, speaker: 'alma', text: 'Some cards look better than *modern art*!', cps: 16, hold: .5 },
    { at: 62.7, speaker: 'jenna', text: 'Ooh, it\'s *sparkly*!', cps: 13, hold: .5, energy: 1.1 },
    // reason 3: it's a game
    { at: 65.7, speaker: 'housam', text: 'Reason three: it\'s not just cards. It\'s a *game*!', cps: 16, hold: .4, energy: 1.1 },
    { at: 69.5, speaker: 'housam', text: 'You build a deck of *60 cards* and battle your friends.', cps: 17, hold: .4 },
    { at: 73.6, speaker: 'alma', text: 'And it\'s easy to start: plan a deck online, buy the cards for *less than a dollar* each...', cps: 18, hold: .3 },
    { at: 79.1, speaker: 'housam', text: 'BOOM! Your deck is *ready*!', cps: 12, hold: .6, kind: 'shout', energy: 1.3 },
    // reason 4: promo cards
    { at: 82.9, speaker: 'alma', text: 'Reason four: *promo cards*!', cps: 14, hold: .4 },
    { at: 85.5, speaker: 'alma', text: 'You can\'t get them in a pack, only in *special boxes*, or at *events*.', cps: 17, hold: .5 },
    { at: 90.4, speaker: 'danny', text: 'So you *have* to buy the box?', cps: 13, hold: .4 },
    { at: 93.3, speaker: 'jenna', text: 'Sneaky... and *smart*!', cps: 12, hold: .5 },
    // reason 5: the market
    { at: 96.6, speaker: 'housam', text: 'And reason five: people *sell* the cards!', cps: 16, hold: .4 },
    { at: 99.9, speaker: 'housam', text: 'Every set has a few cards *everybody* wants, and those are worth a lot.', cps: 18, hold: .4 },
    { at: 104.7, speaker: 'danny', text: 'So cards are like *treasure*!', cps: 13, hold: .6, energy: 1.15 },
    // the summary
    { at: 108.5, speaker: 'alma', text: 'Cute creatures, great art, a real game, promo cards...', cps: 17, hold: .3 },
    { at: 112.3, speaker: 'housam', text: '...and a *giant* market. That\'s how cardboard makes *billions*!', cps: 17, hold: .6, energy: 1.1 },
    // the plan
    { at: 117.4, speaker: 'jenna', text: 'I want my own *collection*!', cps: 13, hold: .4, energy: 1.25 },
    { at: 120.2, speaker: 'danny', text: 'I want to build a *deck* and battle!', cps: 14, hold: .4, energy: 1.25 },
    { at: 123.6, speaker: 'alma', text: 'Then let\'s all enter a *Pokemon TCG tournament*!', cps: 15, hold: .5, energy: 1.3 },
    { at: 127.7, speaker: 'housam', text: 'We build our decks... and we *battle*!', cps: 14, hold: .5, energy: 1.25 },
    { at: 131.5, speaker: 'housam', text: 'LET\'S DO IT!', cps: 9, hold: .9, kind: 'shout', energy: 1.5, group: ['danny', 'jenna', 'alma', 'housam'] },
    { at: 131.5, speaker: 'alma', text: 'LET\'S DO IT!', cps: 9, hold: .9, energy: 1.5, silentBubble: true },
    { at: 131.5, speaker: 'jenna', text: 'LET\'S DO IT!', cps: 9, hold: .9, energy: 1.5, silentBubble: true },
    { at: 131.5, speaker: 'danny', text: 'LET\'S DO IT!', cps: 9, hold: .9, energy: 1.5, silentBubble: true },
  ],
  music: {
    prompt: 'A bright, curious bedroom groove: a plucky marimba and soft brushes while Housam and Alma flip through their binders, a sparkling harp glint for the shiny dragon, a knock at the door, a friendly walking bass as Jenna and Danny come in, a cash-register ding and a rising brass swell for "34 billion dollars", a "here we go" drumroll for "Allow me to explain!", then five little chapters that each open with a chime: a cute bouncy tune for the creatures, a shimmering gallery pad for the art, a punchy battle beat with a BOOM for the deck, a sneaky pizzicato for the promo box, a treasure-chest glitter for the market, a recap that ticks off five checkmarks, and a building, triumphant tournament fanfare with a cheer and the to-be-continued sting.',
    bpm: 116, tonic: 62, motif: [0, 4, 7, 9, 7, 4, 2, 4], chords: [0, 5, 3, 4],
    sections: [
      { at: 0, energy: .3 }, { at: 4.2, energy: .45 }, { at: 9.9, energy: .35 }, { at: 13.9, energy: .2 }, { at: 14.6, energy: .4 },
      { at: 26.7, energy: .6 }, { at: 30.5, energy: .85 }, { at: 32.6, energy: .4 }, { at: 36.9, energy: .6 }, { at: 39.5, energy: .3 },
      { at: 42.5, energy: .55 }, { at: 46.6, energy: .7 }, { at: 51.1, energy: .5 }, { at: 55.7, energy: .45 }, { at: 59.0, energy: .6 },
      { at: 65.1, energy: .6 }, { at: 69.4, energy: .75 }, { at: 73.6, energy: .6 }, { at: 79.1, energy: 1 }, { at: 81.6, energy: .5 },
      { at: 82.3, energy: .45 }, { at: 85.4, energy: .55 }, { at: 90.3, energy: .4 }, { at: 96.0, energy: .5 }, { at: 99.8, energy: .7 },
      { at: 104.6, energy: .6 }, { at: 107.9, energy: .55 }, { at: 116.8, energy: .7 }, { at: 123.6, energy: .85 }, { at: 131.5, energy: 1 },
      { at: 134.0, energy: .8 }, { at: 136.0, energy: .4 }, { at: 138.0, energy: 0 },
    ],
    cues: [
      { at: 1.2, type: 'plip' }, { at: 4.3, type: 'harp' }, { at: 4.5, type: 'ding' }, { at: 6.9, type: 'harp' }, { at: 13.9, type: 'bonk' }, { at: 14.2, type: 'bonk' },
      { at: 14.7, type: 'whoosh' }, { at: 26.8, type: 'ding' }, { at: 29.2, type: 'ding' }, { at: 30.5, type: 'bonk' }, { at: 36.9, type: 'drumroll', dur: 1.2 }, { at: 39.6, type: 'gulp' },
      { at: 42.6, type: 'ding' }, { at: 46.8, type: 'pop' }, { at: 47.3, type: 'pop' }, { at: 47.8, type: 'pop' }, { at: 55.8, type: 'ding' }, { at: 59.1, type: 'harp' },
      { at: 62.8, type: 'harp' }, { at: 65.2, type: 'ding' }, { at: 69.6, type: 'whoosh' }, { at: 72.0, type: 'ding' }, { at: 76.0, type: 'plip' }, { at: 76.6, type: 'plip' },
      { at: 77.2, type: 'plip' }, { at: 79.1, type: 'bonk' }, { at: 79.2, type: 'scratch' }, { at: 82.4, type: 'ding' }, { at: 86.4, type: 'pop' }, { at: 87.0, type: 'harp' },
      { at: 93.4, type: 'plip' }, { at: 96.1, type: 'ding' }, { at: 100.6, type: 'ding' }, { at: 101.6, type: 'ding' }, { at: 102.6, type: 'ding' }, { at: 104.8, type: 'harp' },
      { at: 108.6, type: 'plip' }, { at: 109.6, type: 'plip' }, { at: 110.4, type: 'plip' }, { at: 111.2, type: 'plip' }, { at: 112.6, type: 'plip' }, { at: 115.0, type: 'applause', dur: 1.2 },
      { at: 117.5, type: 'harp' }, { at: 123.7, type: 'drumroll', dur: 1.4 }, { at: 125.6, type: 'ding' }, { at: 131.5, type: 'ding' }, { at: 131.6, type: 'applause', dur: 2.2 }, { at: 134.0, type: 'ding' },
    ],
  },
});
