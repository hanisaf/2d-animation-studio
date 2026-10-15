// scenes/scene22_you_shall_see/asset.js: what this folder contains (read by the studio and the renderer).
// A music video for the whole cast. Until the real song exists (generate it from SONG.md, save it as audio.mp3), the
// soundtrack is a synthesized scratch arrangement at 120 BPM (`music` below) with cartoon-voice scratch vocals (the
// `dialogue` that scene.js builds from lyrics.js). Then: set `audio: 'audio.mp3'`, delete `music`, drop the scene's
// `dialogue`, and re-time lyrics.js to the recording.
asset({
  title: 'You Shall See',
  logline: 'The DCES Book Fair, judged by Princess Pearl, who has never laughed. Safadi, Sami, Dragon and Robo-Safadi all get "…Next." Then the kids\' secret plan: Jester Fester reads his memoir while Danny waits up the ladder with a juggling ball for one word. "Allow me to EXPLAIN—" BONK. Pearl laughs. Fester is HIRED. "Somebody… find me… ANOTHER PROFESSOR."',
  files: ['props.js', 'lyrics.js', 'scene.js'],       // props + backdrops, the song and karaoke, then the shots
  docs: 'README.md',                                  // synopsis, song map, shot list
  music: {
    prompt: 'Scratch arrangement of "You Shall See" (see SONG.md): a 120 BPM funk-pop showstopper. Fanfare intro, a strutting verse, a sneaky whispered pre-chorus, a huge chorus, a comic rapid-fire verse, a quiet bridge, a build to one beat of total silence, then the drop on a cartoon BONK, a party, a final chorus and a music-box tag.',
    bpm: 120,
    tonic: 60,
    motif: [4, 4, 5, 4, 2, 0, 2, 4],
    chords: [0, 5, 3, 4],
    sections: [
      { at: 0, energy: .32 }, { at: 2.3, energy: .2 }, { at: 8.3, energy: .35 }, { at: 10, energy: .62 }, { at: 30, energy: .3 },
      { at: 37.8, energy: .72 }, { at: 40, energy: .95 }, { at: 56, energy: .55 }, { at: 85.5, energy: .3 }, { at: 92.3, energy: .72 },
      { at: 94, energy: .95 }, { at: 110, energy: .2 }, { at: 122, energy: .58 }, { at: 131.5, energy: .4 }, { at: 139.5, energy: .26 },
      { at: 141.45, energy: 0 }, { at: 142, energy: 1 }, { at: 176.2, energy: .12 }, { at: 186.95, energy: 0 }, { at: 187.4, energy: .1 }, { at: 189.3, energy: 0 },
    ],
    cues: [
      { at: .5, type: 'pop' }, { at: 1.0, type: 'pop' }, { at: 1.5, type: 'pop' },
      { at: 15.25, type: 'pop' }, { at: 15.95, type: 'pop' }, { at: 16.65, type: 'pop' }, { at: 29.3, type: 'plip' },
      { at: 42.5, type: 'whoosh' }, { at: 45, type: 'whoosh' }, { at: 47.5, type: 'whoosh' }, { at: 50.5, type: 'whoosh' }, { at: 52.93, type: 'bonk' }, { at: 53.5, type: 'whoosh' },
      { at: 56, type: 'whoosh' }, { at: 61.1, type: 'pop' }, { at: 71.56, type: 'whoosh' }, { at: 71.6, type: 'bonk' }, { at: 78.6, type: 'whoosh' }, { at: 84.1, type: 'ding' },
      { at: 94, type: 'whoosh' }, { at: 96.5, type: 'whoosh' }, { at: 99, type: 'whoosh' }, { at: 101.5, type: 'whoosh' }, { at: 104.5, type: 'whoosh' }, { at: 106.93, type: 'bonk' }, { at: 107.5, type: 'whoosh' },
      { at: 110, type: 'whoosh' }, { at: 140.74, type: 'ding' }, { at: 142, type: 'bonk' }, { at: 142.08, type: 'bonk' },
      { at: 153.6, type: 'ding' }, { at: 158, type: 'whoosh' }, { at: 170.2, type: 'bonk' }, { at: 176.3, type: 'whoosh' },
      { at: 179.15, type: 'cricket' }, { at: 179.55, type: 'cricket' }, { at: 187.0, type: 'scratch' },
    ],
  },
  cast: ['safadi', 'princess_pearl', 'jester_fester', 'housam', 'alma', 'jenna', 'danny', 'sami', 'dragon', 'robo_safadi', 'clawd'],
  locations: ['school_library'],
});
