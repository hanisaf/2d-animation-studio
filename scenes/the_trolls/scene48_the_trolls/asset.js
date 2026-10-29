// Scene 48: The Trolls, a music video, the finale of The Trolls series (scenes 45–47).
// The song "Broccoli Socks, Slippery Shoes" (generated with Gemini from gemini/PROMPT.md) is audio.mp3; the karaoke words and times
// are in lyrics.js. The costumes are Alma's real drawing (scene47's alma_monsters.jpg), cut out into costumes/*.png.
asset({
  title: 'The Trolls',
  logline: 'The finale of The Trolls, as a music video. Dressed as the monsters Alma drew (a grumpy top-hat owl, a big bat, a fuzzy pumpkin, a pink ghost, a blue bird, a bee, a cat, a white ghost and one broccoli in a sock), the family marches on Dove Creek Elementary and challenges every class to tongue twisters: foam in the science room, a whisper battle in the library, numbers in math, then a gym-sized tournament. The heads come off, everyone laughs, and the students ask Princess Pearl, King Neptune and Dragon to take off their costumes too. "These ARE our faces!" And for the first time ever, Pearl laughs.',
  files: ['lyrics.js', 'scene.js'],              // the karaoke, then the costumes and the shots
  audio: 'audio.mp3',                            // "Broccoli Socks, Slippery Shoes" (182.4 s)
  docs: 'README.md',                             // synopsis, section map, notes for editing
  refs: ['costumes/owl.png', 'costumes/bat.png', 'costumes/pumpkin.png', 'costumes/pink_ghost.png', 'costumes/bird.png', 'costumes/bee.png', 'costumes/cat.png', 'costumes/white_ghost.png'],
  cast: ['safadi', 'sami', 'housam', 'alma', 'danny', 'jenna', 'sarah', 'roudaynah', 'dr_g', 'student', 'princess_pearl', 'neptune', 'dragon'],
  locations: ['dces', 'science_room', 'school_library', 'school_gym'],
});
