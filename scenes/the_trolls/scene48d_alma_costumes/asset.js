// Scene 48d: The Trolls · Who's Inside? (Alma's Costumes), a fourth take on the finale of The Trolls series (scenes 45–47).
// Scene 48c's song, riddles and shots, with Alma's real drawing (../scene48_the_trolls/costumes/*.png, cut out by its cut.py) worn
// over each person as in scene 48, big enough to hide them completely. The song and the karaoke (WI_LYRICS) are scene 48c's.
asset({
  title: "The Trolls · Who's Inside? (Alma's Costumes)",
  logline: 'Who\'s Inside?, with the costumes Alma really drew. One at a time, seven of her monsters take the stage, each drawing worn over someone and big enough that not a hair or a shoe shows. Each sings the audience a tongue-twister riddle, told on screen in picture cards, gives them two beats to guess, then POP: the drawing flies off, the person inside springs up out of it, and the follow-up twister says who it was while they show off. Danny, Alma, Housam, Jenna, Sarah, then the twins: Doctor Sami, and Professor Safadi.',
  files: ['scene.js'],                           // the worn costumes, the stage, the picture clues and the shots
  uses: ['scene48c_who_is_inside'],              // its lyrics.js: the karaoke (WI_LYRICS, wiKaraoke)
  docs: 'README.md',                             // what's different from 48c, how the costumes hide their wearers
  audio: '../scene48c_who_is_inside/audio.mp3',  // "Who's Inside?" (214 s), made with Lyria
  refs: ['../scene48_the_trolls/costumes/pumpkin.png', '../scene48_the_trolls/costumes/pink_ghost.png', '../scene48_the_trolls/costumes/bird.png', '../scene48_the_trolls/costumes/bee.png',
    '../scene48_the_trolls/costumes/cat.png', '../scene48_the_trolls/costumes/owl.png', '../scene48_the_trolls/costumes/bat.png'],
  cast: ['danny', 'alma', 'housam', 'jenna', 'sarah', 'sami', 'safadi'],
  locations: [],
});
