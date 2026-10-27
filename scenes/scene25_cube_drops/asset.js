// Scene 25: The Cube Drops. The script is laid out on one timeline, as in scene 24: say() places a line right after the
// previous one, beat() reserves time for action. Both record their start under an id in `beats`, which scene.js reads,
// so the shots, bubbles, voices and music cues stay in sync when a line changes.
asset((() => {
  const B = {}, lines = [];
  let now = 0;
  const len = s => s.replace(/\*/g, '').length;
  function beat(id, dur) { B[id] = now; now += dur; }
  function say(id, speaker, text, o = {}) {
    const l = { id, at: +(now + (o.lead ?? 0)).toFixed(2), speaker, text, cps: o.cps ?? 16, hold: o.hold ?? .45, ...o };
    delete l.lead; delete l.gap;
    lines.push(l); B[id] = l.at;
    now = l.at + .25 + len(text) / l.cps + l.hold + (o.gap ?? .25);
  }

  // ---- the cheer, and Part 1: the catch ----
  beat('open', 1.0);
  say('cheer', 'jenna', 'Danny! Make us *proud*!', { cps: 13, kind: 'shout', energy: 1.4, chorus: ['alma', 'housam'] });
  say('dn1', 'danny', 'Everyone! Look at my *Rubik\'s cube*!', { cps: 16, energy: 1.25 });
  beat('toss1', 2.6);                           // up… and caught
  beat('clap1', 1.8);
  beat('roll1', .9);
  say('d1', 'dragon', 'Ooh! What a catch! *10*!', { energy: 1.25 });
  say('f1', 'jester_fester', 'Hmm... *5*.', { cps: 10, energy: .85 });
  say('p1', 'princess_pearl', '*Zero.*', { cps: 6, hold: .7, energy: .7 });
  say('p1b', 'princess_pearl', 'What is that? *Everyone* can catch it!', { cps: 16, energy: .85 });
  // ---- Part 2: the solve ----
  say('dn2', 'danny', "I'm not done yet!", { cps: 15, energy: 1.2 });
  say('dn3', 'danny', '*Part 2!*', { cps: 9, kind: 'shout', energy: 1.4 });
  say('dn4', 'danny', 'Everyone... look at my *Rubik\'s cube*.', { cps: 15, energy: 1.0 });
  beat('zoom1', 2.0);                           // the close-up: scrambled
  beat('solve', 4.2);                           // click-click-click… solved
  beat('clap2', 3.0);                           // everybody cheers
  beat('roll2', .9);
  say('d2', 'dragon', 'WOW! *10*!', { cps: 12, kind: 'shout', energy: 1.4 });
  say('f2', 'jester_fester', '*10*! I can *juggle*, but I can\'t solve *puzzles*!', { cps: 16, energy: 1.3 });
  say('p2', 'princess_pearl', 'Hmm. *5*.', { cps: 10, energy: .8 });
  say('p2b', 'princess_pearl', 'Solving a puzzle is *not enough*!', { cps: 15, energy: .9 });
  // ---- Part 3: the juggle-and-solve ----
  say('dn5', 'danny', "I'm not done yet!", { cps: 15, energy: 1.3 });
  say('dn6', 'danny', '*Part 3!*', { cps: 9, kind: 'shout', energy: 1.5 });
  beat('scram', 3.0);                           // the close-up: he scrambles it again
  beat('toss3', 3.6);                           // a high spinning throw, a blur of hands on the catch
  beat('zoom3', 2.4);                           // the close-up: solved!
  beat('clap3', 3.0);
  beat('roll3', .9);
  say('d3', 'dragon', 'AMAZING! *10*!', { cps: 13, kind: 'shout', energy: 1.45 });
  say('f3', 'jester_fester', '*10*! A *juggle* and a *puzzle*!', { cps: 15, energy: 1.3 });
  say('d3b', 'dragon', 'A... *puggle*?', { cps: 10, hold: .5, energy: 1.0 });
  beat('laugh', 2.6);                           // everybody laughs
  say('p3', 'princess_pearl', 'This puggle is *perfect*! *10*!', { cps: 14, energy: 1.25 });
  // ---- the trophies ----
  beat('trophy', 6.4);                          // on stage, one golden trophy at a time
  // ---- the proud brothers ----
  say('sf1', 'safadi', "I'm *so* proud of you, children.", { cps: 15, energy: 1.0 });
  say('sf2', 'safadi', 'You *practiced*, and you *earned* it.', { cps: 14, energy: 1.0 });
  say('sm1', 'sami', 'Danny, I was *so* afraid you wouldn\'t perform well.', { cps: 16, energy: 1.0 });
  say('sm2', 'sami', 'You didn\'t *practice*!', { cps: 14, energy: 1.1 });
  say('dn7', 'danny', 'I *did*! I knew the secret potion was a *joke*!', { cps: 16, energy: 1.2 });
  say('dn8', 'danny', 'I did not imagine it would be *broccoli*, though!', { cps: 16, hold: .6, energy: 1.0 });
  say('dn9', 'danny', 'But I took it as a chance to hone my *Rubik\'s cube* skills!', { cps: 17, energy: 1.2 });
  say('sf3', 'safadi', 'You see? With *practice*, you grow your *skill*.', { cps: 15, energy: 1.0 });
  say('sf4', 'safadi', 'But Danny... yours was a *mic drop* moment!', { cps: 15, energy: 1.2 });
  say('al1', 'alma', 'A mic drop? I thought he dropped the *cube*?', { cps: 15, energy: 1.1 });
  beat('samiLaugh', 1.6);
  say('je1', 'jenna', 'What is a *mic drop*?', { cps: 13, energy: 1.0 });
  say('sf5', 'safadi', 'Let me *explain*!', { cps: 12, kind: 'shout', energy: 1.35 });
  beat('freeze', 6.0);                          // freeze; to be continued
  const END = +now.toFixed(2);

  // ---- music cues, on the same timeline ----
  const cues = [];
  const cue = (at, type, o = {}) => cues.push({ at: +at.toFixed(2), type, ...o });
  cue(B.cheer, 'pop');
  cue(B.toss1 + .5, 'whoosh'); cue(B.toss1 + 1.6, 'plip');
  [['clap1', 1.8, .6], ['clap2', 3.0, 1.0], ['clap3', 3.0, 1.1]].forEach(([id, d, lv]) => cue(B[id], 'applause', { dur: d + 1.2, level: lv }));
  for (const r of ['1', '2', '3']) { cue(B['roll' + r], 'drumroll', { dur: B['d' + r] - B['roll' + r] }); for (const j of ['d', 'f', 'p']) cue(B[j + r], 'ding'); }
  cue(B.p1 + .3, 'scratch'); cue(B.p2 + .3, 'scratch');
  cue(B.dn3, 'pop'); cue(B.dn6, 'pop'); cue(B.zoom1, 'whoosh');
  for (let i = 0; i < 14; i++) cue(B.solve + .3 + i * .24, 'plip');           // the solve: click-click-click
  cue(B.solve + 3.8, 'ding');
  for (let i = 0; i < 8; i++) cue(B.scram + .6 + i * .22, 'plip');            // scrambling it again
  cue(B.toss3 + .5, 'whoosh'); cue(B.toss3 + 1.1, 'whoosh');
  for (let i = 0; i < 6; i++) cue(B.toss3 + 1.9 + i * .12, 'plip');          // the blur of hands on the catch
  cue(B.zoom3, 'whoosh'); cue(B.zoom3 + .45, 'ding');
  cue(B.laugh, 'bonk');
  cue(B.trophy + .9, 'ding'); cue(B.trophy + 2.0, 'ding'); cue(B.trophy + 3.1, 'ding'); cue(B.trophy + 4.2, 'ding');
  cue(B.trophy, 'applause', { dur: 6.4, level: .9 });
  cue(B.dn8 + 2.6, 'gulp');
  cue(B.samiLaugh, 'pop'); cue(B.sf5, 'pop'); cue(B.freeze + .9, 'ding');

  return {
    title: 'The Cube Drops',
    logline: 'Danny\'s Rubik\'s cube act, in three parts. Part 1, a toss and a catch: 10, 5, and a zero from Pearl ("Everyone can catch it!"). Part 2, a solve in seconds: 10, 10, 5 ("Solving a puzzle is not enough!"). Part 3, a throw he solves while catching: "A juggle and a puzzle!" "A... puggle?" Pearl: "This puggle is perfect!" 10, 10, 10. Golden trophies for all four kids; Danny reveals he knew the secret potion was a joke and practiced his cube instead. "Yours was a mic drop moment." "I thought he dropped the cube?" "Let me explain!" To be continued.',
    files: ['props.js', 'scene.js'],            // trophies and the close-up cube; then the shots (also uses scene 24's props)
    uses: ['scene24_competition_begins'],       // the cb* judges' table, chairs and score cards
    docs: 'README.md',                          // synopsis, script, shot list, notes for editing
    cast: ['danny', 'alma', 'jenna', 'housam', 'dragon', 'jester_fester', 'princess_pearl', 'safadi', 'sami', 'student'],
    locations: ['school_gym'],
    beats: { ...B, END },
    dialogue: lines,
    music: {
      prompt: 'The talent-show groove from scene 24, lighter: a hopeful, clap-along bounce under Danny\'s act; a snare drumroll and a ding for every score card (a record scratch on Pearl\'s zero and her five); quick ticking clicks as the cube is solved and scrambled; whooshes for the throws; a big crowd cheer and a golden fanfare of dings for the trophies; a warm, gentle texture under the proud parents, and a playful sting into to-be-continued.',
      bpm: 120, tonic: 62, motif: [0, 2, 4, 7, 9, 7, 4, 2], chords: [0, 5, 3, 4],
      sections: [
        { at: 0, energy: .8 }, { at: B.dn1, energy: .45 }, { at: B.toss1, energy: .7 }, { at: B.roll1, energy: .25 }, { at: B.dn2, energy: .5 },
        { at: B.zoom1, energy: .3 }, { at: B.solve, energy: .85 }, { at: B.roll2, energy: .25 }, { at: B.dn5, energy: .6 },
        { at: B.scram, energy: .5 }, { at: B.toss3, energy: 1 }, { at: B.roll3, energy: .25 }, { at: B.laugh, energy: .7 },
        { at: B.trophy, energy: 1 }, { at: B.sf1, energy: .35 }, { at: B.dn7, energy: .45 }, { at: B.sf4, energy: .55 },
        { at: B.freeze + .9, energy: .6 }, { at: END - 1.2, energy: 0 },
      ],
      cues,
    },
  };
})());
