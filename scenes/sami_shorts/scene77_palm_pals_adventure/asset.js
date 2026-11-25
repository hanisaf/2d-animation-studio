// scenes/sami_shorts/scene77_palm_pals_adventure/asset.js
(() => {
  const V_EVE = { style: 'bouncy', baseHz: 375, brightness: 1.15, level: .13, pan: -.14 };
  const V_ZELIE = { style: 'melodic', baseHz: 468, brightness: 1.28, level: .13, pan: .14 };
  const V_DAD = { style: 'measured', baseHz: 176, brightness: .92, level: .14, pan: -.08 };
  const V_PAPA = { style: 'rumble', baseHz: 158, brightness: .95, level: .14, pan: .10 };

  asset({
    title: 'Palm Pals: The Adventure',
    logline: 'Eve Earth and Zelie Pink Lemonade go from pancake-loving rivals to portal-hopping best friends in a 3-minute animated adaptation of Jenna Safadi’s comic.',
    files: ['scene.js'],
    docs: 'README.md',
    cast: ['palm_pals'],
    locations: [],
    music: {
      prompt: 'Playful storybook plushie cartoon score: cozy music-box bells for morning and pancakes, bouncy cheeky pizzicato for sneaking and rivalry, shimmering harp and adventurous energy for the blue portal and bear chase, warm tender chords for making up and time-out friendship, and a cheeky comic stinger for the ending gag.',
      bpm: 112,
      tonic: 62,
      motif: [0, 2, 4, 7, 5, 4, 2, 0],
      chords: [0, 3, 4, 0, 5, 3, 4, 0],
      sections: [
        { at: 0, energy: .52 },     // Cover splash & bios
        { at: 15, energy: .20 },    // Nighttime sleepy bedroom
        { at: 19.5, energy: .42 },  // Sunny morning wake-up
        { at: 30, energy: .48 },    // Kitchen pancakes
        { at: 47, energy: .34 },    // Sneaky pancake mission
        { at: 55.5, energy: .50 },  // Pancake heaven daydream
        { at: 65, energy: .46 },    // Meeting Zelie
        { at: 82, energy: .64 },    // Rival showdown & pancake blitz
        { at: 101, energy: .36 },   // Mysterious button
        { at: 105.5, energy: .72 }, // Blue portal opens!
        { at: 120, energy: .58 },   // Adventure World
        { at: 131.5, energy: .82 }, // 10 hours later & bear chase!
        { at: 139, energy: .38 },   // Laughing & apologizing
        { at: 153, energy: .10 },   // Deadpan "bro." beat
        { at: 156, energy: .74 },   // Golden portal home!
        { at: 164, energy: .26 },   // Busted! Time out
        { at: 168.5, energy: .48 }, // Best friends in time out
        { at: 174, energy: .22 },   // The End
        { at: 175.6, energy: .00 }, // ...or is it? dramatic silence
        { at: 177.2, energy: .68 }, // JUST KIDDING! Finale!
      ],
      cues: [
        { at: 0.4, type: 'harp' },
        { at: 5.6, type: 'pop' },
        { at: 10.3, type: 'pop' },
        { at: 19.8, type: 'harp' },
        { at: 28.4, type: 'whoosh' },
        { at: 36.4, type: 'whoosh' },
        { at: 41.0, type: 'ding' },
        { at: 41.28, type: 'plip' },
        { at: 46.2, type: 'whoosh' },
        { at: 51.8, type: 'pop' },
        { at: 53.8, type: 'gulp' },
        { at: 55.8, type: 'harp' },
        { at: 61.9, type: 'scratch' },
        { at: 64.2, type: 'whoosh' },
        { at: 67.6, type: 'bonk' },
        { at: 82.0, type: 'bonk' },
        { at: 91.2, type: 'whoosh' },
        { at: 99.6, type: 'whoosh' },
        { at: 104.2, type: 'pop' },
        { at: 105.4, type: 'harp' },
        { at: 112.4, type: 'bonk' },
        { at: 114.6, type: 'whoosh' },
        { at: 119.2, type: 'whoosh' },
        { at: 120.3, type: 'pop' },
        { at: 125.6, type: 'bonk' },
        { at: 133.2, type: 'whistle' },
        { at: 135.2, type: 'bonk' },
        { at: 147.2, type: 'ding' },
        { at: 153.6, type: 'cricket' },
        { at: 157.0, type: 'pop' },
        { at: 157.8, type: 'harp' },
        { at: 160.5, type: 'whoosh' },
        { at: 161.8, type: 'pop' },
        { at: 164.2, type: 'bonk' },
        { at: 174.1, type: 'harp' },
        { at: 175.6, type: 'scratch' },
        { at: 177.2, type: 'ding' },
        { at: 177.4, type: 'applause', dur: 2.4, level: .65 },
      ],
    },
    dialogue: [
      // Shot 1: Title Splash & Character Bios (0–15)
      { at: 6.0, speaker: 'eve', voice: V_EVE, text: 'Oh! Hi, my name is *Eve Earth*!', cps: 20, hold: 1.8 },
      { at: 10.6, speaker: 'zelie', voice: V_ZELIE, text: "I'm Zelie Pink Lemonade—*just call me Zelie*!", cps: 21, hold: 1.8 },
      // Shot 2: Good Morning Wake-Up (15–30)
      { at: 20.5, speaker: 'eve', voice: V_EVE, text: 'Mmm... what a cozy morning!', cps: 19, hold: 1.5 },
      { at: 24.4, speaker: 'eve', voice: V_EVE, text: 'Oooh! Do I smell *breakfast*?!', cps: 20, hold: 1.6 },
      // Shot 3: Sizzling Pancakes & Doorbell (30–47)
      { at: 30.8, speaker: 'eve', voice: V_EVE, text: "Hey Daddy, what's for *breakfast*?", cps: 20, hold: 1.2 },
      { at: 33.8, speaker: 'eve_dad', voice: V_DAD, text: '*Pancakes!* Warm and fluffy!', cps: 20, hold: 1.4 },
      { at: 37.3, speaker: 'eve', voice: V_EVE, text: 'Oooh, *yummy*!', cps: 18, hold: 1.5 },
      { at: 41.6, speaker: 'eve_dad', voice: V_DAD, text: 'Oooh, the *guests* are here!', cps: 21, hold: 1.0 },
      { at: 43.9, speaker: 'eve', voice: V_EVE, kind: 'think', text: 'Guests...?', cps: 18, hold: 1.0 },
      { at: 45.1, speaker: 'eve_dad', voice: V_DAD, text: "I'll get the *door*!", cps: 22, hold: 0.9 },
      // Shot 4: Sneaking a Bite (47–65)
      { at: 47.6, speaker: 'eve', voice: V_EVE, kind: 'think', text: 'Hmmm... maybe just a tiny *bite*!', cps: 20, hold: 1.5 },
      { at: 55.9, speaker: 'eve', voice: V_EVE, text: 'Mmm!! Best pancake *ever*!', cps: 19, hold: 1.8 },
      { at: 60.5, speaker: 'eve_dad', voice: V_DAD, kind: 'shout', text: '*Eve Earth!* Come meet the guests!', cps: 22, hold: 1.2 },
      { at: 62.6, speaker: 'eve', voice: V_EVE, text: "Shoot! I'm *coming*!", cps: 22, hold: 1.1 },
      // Shot 5: Meeting the "Enemy" (65–82)
      { at: 65.4, speaker: 'eve_dad', voice: V_DAD, text: 'Here are the *guests*!', cps: 20, hold: 1.4 },
      { at: 68.1, speaker: 'eve', voice: V_EVE, kind: 'think', text: 'No way... my worst enemy: *Zelie*!', cps: 21, hold: 1.6 },
      { at: 71.1, speaker: 'zelie_papa', voice: V_PAPA, text: "Honey, I'll be at the *table*.", cps: 20, hold: 1.0 },
      { at: 73.6, speaker: 'zelie', voice: V_ZELIE, text: 'Ok, *Papa*!', cps: 20, hold: 1.0 },
      { at: 75.8, speaker: 'zelie', voice: V_ZELIE, text: 'Eve Earth, what are *you* doing here?!', cps: 21, hold: 1.2 },
      { at: 78.7, speaker: 'eve', voice: V_EVE, text: 'This is *my house*! What do you think?!', cps: 21, hold: 1.3 },
      // Shot 6: Rival Showdown & Pancake Blitz (82–101)
      { at: 82.4, speaker: 'eve', voice: V_EVE, text: 'Why did *you* have to come?!', cps: 21, hold: 1.0 },
      { at: 84.7, speaker: 'zelie', voice: V_ZELIE, text: 'I was *invited*!', cps: 21, hold: 1.0 },
      { at: 86.7, speaker: 'eve', voice: V_EVE, kind: 'shout', text: "YOU'RE SO *ANNOYING*!", cps: 22, hold: 0.9 },
      { at: 88.2, speaker: 'zelie', voice: V_ZELIE, kind: 'shout', text: "I DON'T *CARE*!", cps: 22, hold: 0.8 },
      { at: 89.6, speaker: 'eve_dad', voice: V_DAD, text: 'Kids! Time for *breakfast*!', cps: 22, hold: 1.0 },
      { at: 91.1, speaker: 'eve', voice: V_EVE, text: '*Yessss!*', cps: 20, hold: 0.8 },
      { at: 91.9, speaker: 'zelie', voice: V_ZELIE, kind: 'think', text: 'Since when did he love pancakes?', cps: 24, hold: 0.7 },
      { at: 93.4, speaker: 'zelie_papa', voice: V_PAPA, text: 'Mm, *delicious*!', cps: 20, hold: 1.0 },
      { at: 95.3, speaker: 'eve_dad', voice: V_DAD, text: "Slow down, Eve Earth! Don't *choke*!", cps: 22, hold: 1.2 },
      { at: 98.2, speaker: 'eve', voice: V_EVE, text: "*Done!* I'm going to my room!", cps: 22, hold: 1.2 },
      // Shot 7: The Blue Portal (101–120)
      { at: 101.4, speaker: 'eve', voice: V_EVE, text: "Hmm... let's *test* this button!", cps: 20, hold: 1.3 },
      { at: 106.2, speaker: 'eve', voice: V_EVE, text: 'Whoa!! A *portal*?!', cps: 19, hold: 1.8 },
      { at: 110.7, speaker: 'zelie', voice: V_ZELIE, text: 'Hi! *Oooo!* Shiny!', cps: 21, hold: 0.9 },
      { at: 112.7, speaker: 'eve', voice: V_EVE, kind: 'shout', text: 'Zelie, *NO*!', cps: 22, hold: 0.9 },
      { at: 114.1, speaker: 'zelie', voice: V_ZELIE, text: "I'm going *in*!", cps: 21, hold: 1.0 },
      { at: 116.2, speaker: 'eve', voice: V_EVE, text: '*ARRG!* I guess I have to get her!', cps: 21, hold: 1.3 },
      // Shot 8: Adventure World & 10 Hours Later (120–139)
      { at: 121.0, speaker: 'eve', voice: V_EVE, text: "Zelie! Let's go *back*!", cps: 20, hold: 1.2 },
      { at: 123.5, speaker: 'zelie', voice: V_ZELIE, text: 'Hehe... *nice hat*.', cps: 19, hold: 1.2 },
      { at: 126.4, speaker: 'zelie', voice: V_ZELIE, text: "Look, dummy! Find the *key*! Let's look!", cps: 22, hold: 1.2 },
      { at: 129.3, speaker: 'eve', voice: V_EVE, text: 'Grr... ugh, *fine*.', cps: 19, hold: 1.1 },
      { at: 135.4, speaker: 'eve', voice: V_EVE, text: 'No key! I *hate* looking!', cps: 20, hold: 1.1 },
      { at: 137.4, speaker: 'zelie', voice: V_ZELIE, text: 'We got chased by a *bear*!', cps: 21, hold: 1.0 },
      // Shot 9: Laughing, Forgiving & Under My Hat (139–156)
      { at: 141.3, speaker: 'eve', voice: V_EVE, text: 'Sorry, Zelie... yeah.', cps: 19, hold: 1.0 },
      { at: 143.0, speaker: 'zelie', voice: V_ZELIE, text: "Sorry, Eve Earth. You're *fun*!", cps: 21, hold: 1.0 },
      { at: 145.0, speaker: 'eve', voice: V_EVE, text: 'Wait... my hat is *itchy*...', cps: 19, hold: 1.1 },
      { at: 147.8, speaker: 'eve', voice: V_EVE, text: 'Oh! The *key*! It was under my hat!', cps: 21, hold: 1.4 },
      { at: 151.3, speaker: 'eve', voice: V_EVE, text: "Sorry, I didn't *know*!", cps: 20, hold: 1.1 },
      { at: 153.6, speaker: 'zelie', voice: V_ZELIE, text: '*bro.*', cps: 16, hold: 1.7 },
      // Shot 10: Golden Portal Home (156–164)
      { at: 158.1, speaker: 'eve', voice: V_EVE, text: '*Yay!* Time to go home!', cps: 22, hold: 1.0 },
      { at: 162.0, speaker: 'zelie', voice: V_ZELIE, text: '*Home!* Safe and sound!', cps: 21, hold: 1.1 },
      // Shot 11: Time Out & Best Friends (164–174)
      { at: 164.6, speaker: 'eve_dad', voice: V_DAD, text: '*Time out.*', cps: 18, hold: 1.1 },
      { at: 166.1, speaker: 'eve', voice: V_EVE, text: '*Awww!*', cps: 18, hold: 0.9 },
      { at: 167.9, speaker: 'zelie', voice: V_ZELIE, text: "Hey Eve Earth, let's *talk*!", cps: 22, hold: 1.1 },
      { at: 170.0, speaker: 'zelie_papa', voice: V_PAPA, text: 'Tell them time out is over?', cps: 22, hold: 1.0 },
      { at: 171.9, speaker: 'eve_dad', voice: V_DAD, text: "Nah—now they're *friends*!", cps: 21, hold: 1.3 },
      // Shot 12: Epilogue Punchline (174–180)
      { at: 177.5, speaker: 'eve', voice: V_EVE, text: '*The.*', cps: 18, hold: 1.8 },
      { at: 178.2, speaker: 'zelie', voice: V_ZELIE, text: '*end.*', cps: 18, hold: 1.5 },
    ],
  });
})();
