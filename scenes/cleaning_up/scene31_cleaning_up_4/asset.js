// scenes/cleaning_up/scene31_cleaning_up_4/asset.js: what this folder contains (read by the studio and the renderer).
// A music video, the finale of the Cleaning Up arc (scenes 28–30). The song (audio.mp3, "Athens: The Fin-tastic Showdown",
// generated with Gemini) is the soundtrack and every voice, so there is no synthesized music or dialogue.
// The word timings and beat times in lyrics.js were measured from the recording.
asset({
  title: 'Cleaning Up 4 · Robots vs. Titans',
  logline: 'The finale of the Cleaning Up arc, as a music video. A giant Robo-Safadi, still running Housam\'s clean-up program, vacuums the citizens of ancient Athens into his chest. The kids race to the Roman bath, where Professor Safadi lectures on "know thyself" until Dr. Sami cuts him off: no time to think! The twins summon King Neptune, who rises out of the sea taller than the Acropolis, overloads the robot and frees the citizens. "The best kind of cleaning is done by… YOU!" "That\'s fin-tastic!"',
  files: ['props.js', 'lyrics.js', 'scene.js'],      // backdrops and props, the song and karaoke, then the shots
  docs: 'README.md',                                 // synopsis, song map, shot list
  audio: 'audio.mp3',                                // "Athens: The Fin-tastic Showdown" (175.3 s)
  cast: ['robo_safadi', 'neptune', 'housam', 'alma', 'jenna', 'danny', 'safadi', 'sami', 'student'],
  locations: ['ancient_athens', 'roman_bath'],
});
