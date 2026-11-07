// scenes/pokemon/scene67_everybody_wins/asset.js: the finale of the Pokemon series, a music video.
// The song (audio.mp3, generated with Gemini from SONG.md) is the soundtrack and every voice; there is no synthesized music or
// dialogue. lyrics.js holds its lines and word times (from a transcription of the recording), and scene.js cuts to them.
asset({
  title: 'Pokemon 4 · Everybody Wins',
  logline: 'The brothers\' "You shall see!" was a Grand Tournament. In a night stadium eight trainers walk out with their Pokemon: Housam and Blazewyrm, Alma and Captain Fin, Jenna and Sproutbun, Danny and Starpaw, Jester Fester and Bellbop, Princess Pearl and Coralia, Neptune and Shelldon, Dragon and Puffling. Four duels on the beat, a power-up bridge, an eight-way clash on the drop, and nobody faints: it\'s a tie. Professor Safadi and Doctor Sami hand every trainer a trophy. EVERYBODY WINS! A group photo, fireworks, THE END.',
  files: ['lyrics.js', 'props.js', 'scene.js'], // the song's lines and word times; the stadium, creatures, attacks and trophies; the shots
  audio: 'audio.mp3',                           // "Everybody Wins" (181 s), made with Gemini
  docs: 'README.md',                            // synopsis, song map, shot list
  uses: ['scene65_deck_builders'],              // DK (cards) and, through scene 64, PK (the creatures)
  cast: ['housam', 'alma', 'jenna', 'danny', 'jester_fester', 'princess_pearl', 'neptune', 'dragon', 'safadi', 'sami'],
  locations: [],
});
