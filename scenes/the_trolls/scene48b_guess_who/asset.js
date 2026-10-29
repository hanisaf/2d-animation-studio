// Scene 48b: The Trolls · Guess Who, a second take on the finale of The Trolls series (scenes 45–47), cut to a different song.
// The song "Twist It, Troll It" (generated with Gemini) is audio.mp3; the karaoke words and times are in lyrics.js. The costumes
// are Alma's real drawing (scene47's alma_monsters.jpg), cut out into costumes/*.png and worn over the characters, legs showing.
// Nobody's name appears on screen: the song asks the audience to guess who is inside each monster.
asset({
  title: 'The Trolls · Guess Who',
  logline: 'The finale of The Trolls as a guessing game. The family marches on Dove Creek Elementary dressed as the monsters Alma drew, with only their legs showing. The song gives riddles (one fang and a love of explaining, three silly eyes and Rubik\'s cubes, a skull ghost with a laptop, the tallest rebel cat) and the audience has to guess who is inside, while the monsters tongue-twist every class and the whole gym. The masks come off, everyone laughs, and the students ask Princess Pearl, King Neptune and Dragon to take off their costumes too. "Wait, these are real?"',
  files: ['lyrics.js', 'scene.js'],              // the karaoke, then the costumes and the shots
  audio: 'audio.mp3',                            // "Twist It, Troll It" (182.5 s)
  docs: 'README.md',                             // synopsis, section map, the riddles, notes for editing
  refs: ['costumes/bat.png', 'costumes/owl.png', 'costumes/pumpkin.png', 'costumes/white_ghost.png', 'costumes/cat.png', 'costumes/pink_ghost.png', 'costumes/bird.png', 'costumes/bee.png'],
  cast: ['safadi', 'sami', 'housam', 'alma', 'danny', 'jenna', 'sarah', 'roudaynah', 'dr_g', 'student', 'princess_pearl', 'neptune', 'dragon'],
  locations: ['dces', 'science_room', 'school_library', 'school_gym'],
});
