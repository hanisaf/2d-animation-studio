// Scene 36: Dream Mode, a music video, the finale of the Screen Time arc (32–35).
// The song "High Scores and Hugs" (generated with Gemini from gemini/PROMPT.md) is song_gemini.mp3; audio.mp3 is that song with
// synthesized alarm-clock rings mixed in (sfx/make_alarm.py). The karaoke words and times are in lyrics.js.
asset({
  title: 'Dream Mode',
  logline: 'The finale of the Screen Time arc, as a music video. Asleep on the sofa after game night, the Safadi brothers dream they are inside their video games with the kids: PRESS START, character select, then Robo Invasion (mission: research… space), World Champion (Housam\'s bicycle kick, off Fester\'s head, GOAL), Craft Blocks (a Broccreeper, a mountain-sized Rubik\'s cube) and Fight Planet (brother vs brother: DOUBLE K.O., FAMILY-TY!). The final boss is THE ALARM CLOCK. CONTINUE? They wake up to the kids, a ringing clock and the board games. THE END.',
  files: ['props.js', 'lyrics.js', 'scene.js'],  // the dream worlds and game furniture, the karaoke, then the shots
  uses: ['scene18_some_assembly', 'scene28_cleaning_up', 'scene31_cleaning_up_4', 'scene32_screen_time'], // SA colors, cuGame, the rvt* effects and stArcade
  audio: 'audio.mp3',                           // "High Scores and Hugs" + the alarm rings (180.2 s)
  docs: 'README.md',                            // synopsis, section map, song brief, notes for editing
  cast: ['safadi', 'sami', 'housam', 'alma', 'jenna', 'danny', 'robo_safadi', 'neptune', 'clawd', 'jester_fester', 'princess_pearl', 'dragon'],
  locations: ['living_room'],
});
