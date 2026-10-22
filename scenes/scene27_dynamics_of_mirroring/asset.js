// Scene 27: Professor Safadi explains "Dynamics of Mirroring" (Safadi & Tiwana, JAIS 2026) at the big chalkboard.
// Each line carries the board panel it belongs to (slide 1–12) and the gesture Safadi makes while he says it:
// wave · open · up · board (pointer at the board) · talk · think · shrug · idea (bulb) · power (super explain).
// Safadi's voice is Gemini TTS (voice.js, made by scripts/tts_gemini.mjs); that script also re-times `at` and `cps`
// below so each bubble types along with the recorded line. The music follows the panel start times.
(() => {
  const dialogue = [
      { at: 1, slide: 1, gesture: 'wave', speaker: 'safadi', text: "Welcome, everyone! Today I want to walk you through a paper Amrit Tiwana and I wrote: *Dynamics of Mirroring*.", cps: 15.4, hold: 1.0 },
      { at: 8.66, slide: 1, gesture: 'open', speaker: 'safadi', text: "It's about how open-source teams and their code *grow up together*.", cps: 16.32, hold: 0.75 },
      { at: 13.29, slide: 1, gesture: 'up', speaker: 'safadi', text: "And it ends with a surprising idea: a little *misalignment* can be good for a project.", cps: 15.97, hold: 0.75 },
      { at: 20.26, slide: 2, gesture: 'board', speaker: 'safadi', text: "Let's start with the *mirroring hypothesis*.", cps: 16.82, hold: 1.0 },
      { at: 23.4, slide: 2, gesture: 'talk', speaker: 'safadi', text: "It says the structure of a team should *mirror* the structure of the product it builds.", cps: 18.65, hold: 0.75 },
      { at: 28.61, slide: 2, gesture: 'board', speaker: 'safadi', text: "If Alice builds the user interface and Bob builds the data layer, they barely need to talk...", cps: 17.8, hold: 0.75 },
      { at: 34.48, slide: 2, gesture: 'talk', speaker: 'safadi', text: "...because the *interface* between their modules does the coordinating for them.", cps: 22.05, hold: 0.75 },
      { at: 38.67, slide: 2, gesture: 'open', speaker: 'safadi', text: "Ties between people line up with dependencies between modules. That's *mirroring*.", cps: 16.43, hold: 0.75 },
      { at: 44.19, slide: 2, gesture: 'up', speaker: 'safadi', text: "It saves scarce attention, and mirrored systems tend to be *more successful*.", cps: 17.61, hold: 0.75 },
      { at: 50.15, slide: 3, gesture: 'think', speaker: 'safadi', text: "But here's the puzzle. Open-source software is famously *modular*...", cps: 14.76, hold: 1.0 },
      { at: 55.27, slide: 3, gesture: 'talk', speaker: 'safadi', text: "...and its developers specialize. So we'd expect *strong* mirroring.", cps: 17.12, hold: 0.75 },
      { at: 59.78, slide: 3, gesture: 'board', speaker: 'safadi', text: "Yet in a major review, *56%* of studies of open collaboration found *no support* for it.", cps: 13.25, hold: 0.75 },
      { at: 66.77, slide: 3, gesture: 'shrug', speaker: 'safadi', text: "So why does mirroring seem to *vanish* in open source?", cps: 14.48, hold: 1.0 },
      { at: 72.06, slide: 4, gesture: 'board', speaker: 'safadi', text: "One answer: the code itself coordinates people, so they don't need to talk.", cps: 18.13, hold: 1.0 },
      { at: 76.84, slide: 4, gesture: 'board', speaker: 'safadi', text: "Another: digital tools stand in for sitting in the same building.", cps: 15.59, hold: 0.75 },
      { at: 81.66, slide: 4, gesture: 'think', speaker: 'safadi', text: "We asked a different question. What if we've been looking at a *snapshot*...", cps: 15.51, hold: 0.75 },
      { at: 87.08, slide: 4, gesture: 'idea', speaker: 'safadi', text: "...when we should be watching the *movie*?", cps: 23.61, hold: 1.0 },
      { at: 90.48, slide: 5, gesture: 'talk', speaker: 'safadi', text: "So we separate two things. The *state* of mirroring is how well team and code match *right now*.", cps: 16.01, hold: 1.0 },
      { at: 96.87, slide: 5, gesture: 'board', speaker: 'safadi', text: "We measure each structure's modularity, *Q*: zero for monolithic, one for fully modular.", cps: 13.91, hold: 0.75 },
      { at: 103.71, slide: 5, gesture: 'board', speaker: 'safadi', text: "Mirroring is high when the two Qs are *close* to each other.", cps: 16.31, hold: 0.75 },
      { at: 107.91, slide: 5, gesture: 'open', speaker: 'safadi', text: "The *dynamics* are how that match changes from one quarter to the next.", cps: 16.43, hold: 0.75 },
      { at: 112.76, slide: 5, gesture: 'board', speaker: 'safadi', text: "When the match improves, we call it *mirror focusing*.", cps: 17.03, hold: 0.75 },
      { at: 116.47, slide: 5, gesture: 'board', speaker: 'safadi', text: "When it slips, we call it *mirror misting*, like breath fogging up a mirror.", cps: 16.35, hold: 0.75 },
      { at: 122.69, slide: 6, gesture: 'board', speaker: 'safadi', text: "Picture a two-by-two: team structure across the top, project architecture down the side.", cps: 17.92, hold: 1.0 },
      { at: 128.25, slide: 6, gesture: 'board', speaker: 'safadi', text: "In *A*, a monolithic team builds monolithic code. In *D*, a modular team builds modular code.", cps: 11.26, hold: 0.75 },
      { at: 136.81, slide: 6, gesture: 'talk', speaker: 'safadi', text: "Both are mirrored. *B* and *C* are the mismatches.", cps: 12.7, hold: 0.75 },
      { at: 141.08, slide: 6, gesture: 'board', speaker: 'safadi', text: "Stepping out of A or D *mists* the mirror. Stepping back in *focuses* it.", cps: 14.16, hold: 0.75 },
      { at: 146.61, slide: 6, gesture: 'up', speaker: 'safadi', text: "That's eight possible moves: four mistings and four focusings.", cps: 14.06, hold: 0.75 },
      { at: 152.72, slide: 7, gesture: 'open', speaker: 'safadi', text: "To watch this happen, we went straight to the *source code*.", cps: 19.54, hold: 1.0 },
      { at: 156.33, slide: 7, gesture: 'board', speaker: 'safadi', text: "We studied *1,279* Java projects on GitHub...", cps: 9.65, hold: 0.75 },
      { at: 161.44, slide: 7, gesture: 'board', speaker: 'safadi', text: "...rebuilding every codebase quarter by quarter: *25,947* project-quarters in all.", cps: 11.19, hold: 0.75 },
      { at: 169.24, slide: 7, gesture: 'up', speaker: 'safadi', text: "No surveys. Every measure comes from the code and the *commit logs* themselves.", cps: 17.01, hold: 0.75 },
      { at: 175.46, slide: 8, gesture: 'talk', speaker: 'safadi', text: "Each quarter, we build three networks.", cps: 16.05, hold: 1.0 },
      { at: 178.48, slide: 8, gesture: 'board', speaker: 'safadi', text: "First, the *architecture*: classes, linked when one uses or inherits from another.", cps: 15.5, hold: 0.75 },
      { at: 184.29, slide: 8, gesture: 'board', speaker: 'safadi', text: "Second, the *activity*: which developers committed to which files.", cps: 14.61, hold: 0.75 },
      { at: 189.32, slide: 8, gesture: 'board', speaker: 'safadi', text: "Third, the *team*: two developers are linked when they change the same file.", cps: 15.38, hold: 0.75 },
      { at: 194.78, slide: 8, gesture: 'open', speaker: 'safadi', text: "The modularity of the first gives us the project architecture. The third gives us the team structure.", cps: 18.98, hold: 0.75 },
      { at: 201.8, slide: 9, gesture: 'up', speaker: 'safadi', text: "Finding one: the mirror *oscillates*.", cps: 11.24, hold: 1.0 },
      { at: 205.57, slide: 9, gesture: 'board', speaker: 'safadi', text: "As a state, mirroring is a little sticky from one quarter to the next...", cps: 15.18, hold: 0.75 },
      { at: 210.96, slide: 9, gesture: 'board', speaker: 'safadi', text: "...but focusing is followed by misting, and misting by focusing. The coefficient is *minus 0.41*.", cps: 15.04, hold: 0.75 },
      { at: 217.93, slide: 9, gesture: 'think', speaker: 'safadi', text: "So weak mirroring in a snapshot may really be *strong dynamics* in motion.", cps: 12.54, hold: 0.75 },
      { at: 225.37, slide: 10, gesture: 'up', speaker: 'safadi', text: "Finding two: *focusing* drives evolution.", cps: 10.99, hold: 1.0 },
      { at: 229.57, slide: 10, gesture: 'board', speaker: 'safadi', text: "We measured two kinds of change. *System-wide*: files added or removed...", cps: 15.32, hold: 0.75 },
      { at: 234.85, slide: 10, gesture: 'board', speaker: 'safadi', text: "...and *module-level*: code rewritten inside the files that stay.", cps: 15.28, hold: 0.75 },
      { at: 239.63, slide: 10, gesture: 'board', speaker: 'safadi', text: "Mirror focusing pushes both of them *up*, especially change inside modules.", cps: 13.94, hold: 0.75 },
      { at: 245.51, slide: 10, gesture: 'board', speaker: 'safadi', text: "But a high, *static* mirroring state pushes evolution *down*. That's the *mirroring trap*.", cps: 13.79, hold: 0.75 },
      { at: 252.26, slide: 10, gesture: 'shrug', speaker: 'safadi', text: "A perfectly matched project can *freeze* in place.", cps: 14.11, hold: 0.75 },
      { at: 257.36, slide: 11, gesture: 'up', speaker: 'safadi', text: "Finding three: *direction* matters.", cps: 11.97, hold: 1.0 },
      { at: 260.77, slide: 11, gesture: 'board', speaker: 'safadi', text: "Focusing pays off when it lands in *D*: a modular team on modular code.", cps: 12.47, hold: 0.75 },
      { at: 266.95, slide: 11, gesture: 'board', speaker: 'safadi', text: "B to D and C to D boost *both* kinds of evolution.", cps: 12.32, hold: 0.75 },
      { at: 271.5, slide: 11, gesture: 'board', speaker: 'safadi', text: "One exception: B to A helps change *inside* modules, but not across the whole system.", cps: 14.69, hold: 0.75 },
      { at: 278.85, slide: 12, gesture: 'think', speaker: 'safadi', text: "So what does it all mean?", cps: 14.77, hold: 1.0 },
      { at: 281.19, slide: 12, gesture: 'open', speaker: 'safadi', text: "Misting isn't a failure. It's how developers *explore*, tinker, and learn other parts of the system.", cps: 15.46, hold: 0.75 },
      { at: 288.18, slide: 12, gesture: 'talk', speaker: 'safadi', text: "Focusing is where that learning gets *put to work*.", cps: 16.1, hold: 0.75 },
      { at: 291.87, slide: 12, gesture: 'power', speaker: 'safadi', text: "Misting is a stressor that makes the project *stronger*. Taleb would call that *antifragile*.", cps: 14.48, hold: 0.75 },
      { at: 298.67, slide: 12, gesture: 'up', speaker: 'safadi', text: "For managers: don't lock the mirror in place. Leave room for *bottom-up* tinkering.", cps: 15.47, hold: 0.75 },
      { at: 304.55, slide: 12, gesture: 'power', speaker: 'safadi', text: "The future of mirroring research lies not in optimizing configurations...", cps: 16.16, hold: 0.75 },
      { at: 309.72, slide: 12, gesture: 'power', speaker: 'safadi', text: "...but in *orchestrating oscillations*.", cps: 14.28, hold: 0.75 },
      { at: 312.96, slide: 12, gesture: 'wave', speaker: 'safadi', text: "Thank you!", cps: 11.03, hold: 1.4 },
  ];
  const panel = n => dialogue.find(l => l.slide === n).at, last = dialogue[dialogue.length - 1];
  const energy = [.2, .14, .16, .14, .12, .14, .16, .16, .22, .22, .22, .14];      // per panel; lifts for the three findings
  asset({
    title: 'Dynamics of Mirroring',
    logline: 'Alone in the lecture hall, Professor Safadi walks the camera through his paper on mirroring in open-source software, one chalk panel at a time: the mirror mists, the mirror focuses, and projects evolve.',
    files: ['voice.js', 'board.js', 'scene.js'],
    docs: 'README.md',
    cast: ['safadi'],
    locations: ['lecture_hall'],
    tts: {                                         // scripts/tts_gemini.mjs scene27_dynamics_of_mirroring
      model: 'gemini-3.1-flash-tts-preview', voice: 'Charon', level: .62,
      style: "Say in a warm, friendly, engaging professor's voice, at a lively, natural conversational pace:",
      gap: .45, panelGap: 1.5,                     // seconds of silence between lines, and before a new board panel
      tempo: 1.15,                                 // play the takes 15% faster (pitch kept)
    },
    dialogue,
    music: {
      prompt: 'A quiet, curious lecture underscore: soft felt piano and warm bass, sparse bells. It stays well under the voice, lifts a little for each of the three findings, and resolves on one bright chime at "orchestrating oscillations". Instrumental.',
      bpm: 80, tonic: 55, motif: [0, 2, 4, 7, 4, 2, 1, 2], chords: [0, 5, 3, 4],
      sections: [
        ...energy.map((e, i) => ({ at: i ? panel(i + 1) - .8 : 0, energy: e })),
        { at: dialogue[dialogue.length - 3].at, energy: .3 }, { at: last.at - .5, energy: .36 }, { at: last.at + 4.5, energy: .06 },
      ],
      cues: [
        ...energy.slice(1).map((e, i) => ({ at: panel(i + 2) - .6, type: 'plip' })),
        { at: dialogue[dialogue.length - 2].at + .3, type: 'ding' },
      ],
    },
  });
})();
