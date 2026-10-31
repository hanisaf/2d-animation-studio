// scenes/halloween/scene20b_broccoli_reboot/asset.js: what this folder contains (read by the studio and the renderer).
// A music video: the song (audio.mp3, "The Broccoli Penalty", made with Gemini) is the soundtrack and every voice. The Halloween
// backdrops and props (bd*) are scene 17's halloween.js; the monster costumes are Alma's drawing, cut out for scene 48.
asset({
  title: 'The Broccoli Directive 2.0',
  logline: 'One year later, on Halloween night. The kids pull the sheet off Robo-Safadi, and he reboots with an update: DIRECTIVE 2.0. Four little monsters (the kids in Alma\'s costumes) come knocking, and his scanners can\'t see who\'s inside, so every monster gets a tongue twister: twist it or eat it. Danny and Housam nail theirs (CANDY!); Jenna and Alma flub (BROCCOLI!). Then the winners share, and everybody eats broccoli… and candy. "Game over, humans! See you next Halloween!"',
  files: ['lyrics.js', 'scene.js'],              // the karaoke, then the costumes, picture cards and shots
  uses: ['scene17_broccoli_directive'],          // its halloween.js: the bd* backdrops and props
  docs: 'README.md',                             // synopsis, song map, shot list, timing notes
  audio: 'audio.mp3',                            // "The Broccoli Penalty" (122 s; the song ends at about 118 s)
  refs: ['../../the_trolls/scene48_the_trolls/costumes/pumpkin.png', '../../the_trolls/scene48_the_trolls/costumes/bee.png',
    '../../the_trolls/scene48_the_trolls/costumes/bird.png', '../../the_trolls/scene48_the_trolls/costumes/pink_ghost.png'],
  cast: ['robo_safadi', 'danny', 'jenna', 'housam', 'alma'],
  locations: [],                                 // motion-graphics backdrops, no set
});
