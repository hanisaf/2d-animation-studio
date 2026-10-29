// Scene 48c: The Trolls · Who's Inside?, a third take on the finale of The Trolls series (scenes 45–47).
// The song "Who's Inside?" is audio.mp3, made with Lyria from lyria/PROMPT.txt (the seven riddles) and lyria/FINALE.txt (the
// encore), joined on the 120 bpm grid; see lyria/README.md. The section times in scene.js follow it.
// The costumes are Alma's real drawing, cut out by ../scene48b_guess_who/costumes/cut.py (crayon stand-ins are drawn without them).
asset({
  title: "The Trolls · Who's Inside?",
  logline: 'The finale of The Trolls as seven riddles. One at a time, seven of Alma\'s monsters take the stage, with nothing at all to give away who is inside. Each sings the audience a tongue-twister riddle, told on screen in picture cards (a soccer ball and a grass block, a disco ball and a crayon, a stethoscope and a broccoli), gives them two beats to guess, then POP: the costume flies off, and the follow-up twister says who it was while they show off. Danny, Alma, Housam, Jenna, Sarah, then the twins: Doctor Sami, and Professor Safadi. Then everyone dances, and the empty costumes bounce over their heads.',
  files: ['scene.js'],                           // the costumes, the stage, the picture clues and the shots
  docs: 'README.md',                             // synopsis, the riddles and their lyrics, section map, notes for editing
  audio: 'audio.mp3',                            // "Who's Inside?" (214 s), made with Lyria
  refs: ['../scene48b_guess_who/costumes/pumpkin.png', '../scene48b_guess_who/costumes/pink_ghost.png', '../scene48b_guess_who/costumes/bird.png', '../scene48b_guess_who/costumes/bee.png',
    '../scene48b_guess_who/costumes/cat.png', '../scene48b_guess_who/costumes/owl.png', '../scene48b_guess_who/costumes/bat.png'],
  cast: ['danny', 'alma', 'housam', 'jenna', 'sarah', 'sami', 'safadi'],
  locations: [],
});
