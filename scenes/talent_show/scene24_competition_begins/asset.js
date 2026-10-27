// Scene 24: The Competition Begins. The script below is laid out on one timeline: say() places a line right after the
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

  // ---- the group dance, and the judges are lukewarm ----
  beat('dance', 10.0);                          // five students dance; finale pose at 9.0
  beat('clap1', 3.2);                           // the parents applaud
  beat('roll1', 1.0);                           // drumroll
  say('d1', 'dragon', 'Wonderful! I give it a *9*!', { energy: 1.15 });
  say('f1', 'jester_fester', 'Nice moves... *7*.', { cps: 14 });
  say('p1', 'princess_pearl', '*3.*', { cps: 5, hold: .8, energy: .7 });
  say('p1b', 'princess_pearl', 'Somebody blinked off the beat. I *saw* it.', { cps: 17, energy: .8 });
  say('aww', 'student', 'Awwww...', { cps: 8, hold: .4, energy: .7 });
  // ---- the individual talents ----
  say('host1', 'jester_fester', 'And now... the *individual* talents!', { cps: 16, energy: 1.25 });
  say('host1b', 'jester_fester', 'First up... *ALMA!*', { cps: 13, kind: 'shout', energy: 1.4 });
  beat('almaIn', 2.0);                          // Alma skips on stage
  say('a1', 'alma', "Hi! I'm *Alma*! I love dancing, drawing...", { energy: 1.2 });
  say('a2', 'alma', '...and *falling over*.', { cps: 13, hold: .6, energy: .9 });
  say('a3', 'alma', 'But today, I am *skipping* the falling-over part!', { cps: 17, energy: 1.2 });
  say('s1', 'safadi', 'Go Alma! Make us *proud*!', { cps: 15, kind: 'shout', energy: 1.35 });
  beat('almaAct', 5.6);                         // three cartwheels and a ta-da
  beat('clap2', 2.8);
  beat('roll2', .9);
  say('d2', 'dragon', 'Ooh! A perfect *10*!', { energy: 1.25 });
  say('f2', 'jester_fester', 'Lovely! *9*!', { cps: 13, energy: 1.1 });
  say('p2', 'princess_pearl', 'Hmm. Not bad. *8*.', { cps: 12, energy: .9 });
  say('host2', 'jester_fester', 'Next up... *JENNA!*', { cps: 13, kind: 'shout', energy: 1.4 });
  beat('jennaIn', 2.0);
  say('j1', 'jenna', "Hi, I'm *Jenna*! I've done so many cartwheels...", { energy: 1.15 });
  say('j2', 'jenna', '...my brain thinks the *ceiling* is the *floor*!', { cps: 16, hold: .6, energy: 1.2 });
  say('s2', 'sami', 'Go Jenna! Make us *proud*!', { cps: 15, kind: 'shout', energy: 1.35 });
  beat('jennaAct', 7.4);                        // four cartwheels, one back, an aerial twirl
  beat('clap3', 2.8);
  beat('roll3', .9);
  say('d3', 'dragon', 'WOW! *10*!', { cps: 12, kind: 'shout', energy: 1.4 });
  say('f3', 'jester_fester', 'Amazing! *9*!', { cps: 13, energy: 1.2 });
  say('p3', 'princess_pearl', 'Ooh! Now *that* was elegant. *9*!', { cps: 15, energy: 1.15 });
  say('host3', 'jester_fester', 'Next up... *HOUSAM!*', { cps: 13, kind: 'shout', energy: 1.4 });
  beat('housamIn', 2.6);                        // the stage hoop winches down; Housam dribbles in
  say('h1', 'housam', "Hey! I'm *Housam*. I'm a *soccer* player...", { energy: 1.1 });
  say('h2', 'housam', '...in a *basketball* gym. This ball is *so* confused.', { cps: 17, hold: .6, energy: 1.05 });
  say('s3', 'safadi', 'Go Housam! Make us *proud*!', { cps: 15, kind: 'shout', energy: 1.35 });
  beat('housamAct', 7.6);                       // dribbles, flick, bicycle kick, SWISH
  beat('clap4', 2.8);
  beat('roll4', .9);
  say('d4', 'dragon', '*10*! Right in the hoop!', { energy: 1.35 });
  say('f4', 'jester_fester', '*10*! Even *I* can\'t do that!', { cps: 16, energy: 1.3 });
  say('p4', 'princess_pearl', 'Bravo! *9*!', { cps: 12, energy: 1.2 });
  say('host4', 'jester_fester', 'And last but not least... *DANNY!*', { cps: 16, kind: 'shout', energy: 1.4 });
  beat('dannyIn', 3.0);                         // Danny dribbles in, Rubik's cube in hand
  say('dn1', 'danny', "Hi! I'm *Danny*! I can dribble, I can solve a *Rubik's cube*...", { cps: 18, energy: 1.2 });
  say('dn2', 'danny', '...and I can drink *broccoli juice* without crying.', { cps: 17, hold: .3, energy: 1.0 });
  say('dn3', 'danny', '...Almost.', { cps: 9, hold: .6, energy: .7 });
  // ---- the brothers ----
  beat('freak', 1.2);                           // Sami's face falls
  say('sm1', 'sami', 'Brother... maybe we should *not* have given him *broccoli juice*...', { cps: 17, energy: 1.1 });
  say('sm2', 'sami', '...and insisted he *practiced* instead!', { cps: 15, energy: 1.2 });
  say('sm3', 'sami', "I'm *so* afraid Danny won't do well in the competition!", { cps: 17, energy: 1.25 });
  say('sf1', 'safadi', "Don't worry, brother. Danny is *smart*.", { cps: 15, energy: .95 });
  say('sf2', 'safadi', "I'm sure he will make us *proud*.", { cps: 14, hold: .6, energy: 1.0 });
  say('sm4', 'sami', 'I hope so...', { cps: 9, hold: .7, energy: .75 });
  beat('freeze', 6.0);                          // Danny on the court; freeze; to be continued
  const END = +now.toFixed(2);

  // ---- music cues, on the same timeline ----
  const cues = [];
  const cue = (at, type, o = {}) => cues.push({ at: +at.toFixed(2), type, ...o });
  cue(9.0, 'pop');
  [['clap1', 3.2], ['clap2', 2.8], ['clap3', 2.8], ['clap4', 2.8]].forEach(([id, d], i) => cue(B[id], 'applause', { dur: d + 1.2, level: .8 + .1 * i }));
  for (const r of ['1', '2', '3', '4']) { cue(B['roll' + r], 'drumroll', { dur: B['d' + r] - B['roll' + r] }); for (const j of ['d', 'f', 'p']) cue(B[j + r], 'ding'); }
  cue(B.p1 + .3, 'scratch'); cue(B.aww, 'bonk');
  for (const id of ['host1b', 'host2', 'host3', 'host4']) cue(B[id], 'pop');
  const A0 = B.almaAct + .5; for (let i = 0; i < 3; i++) cue(A0 + i * .8, 'whoosh'); cue(A0 + 2.5, 'pop');
  const J0 = B.jennaAct + .4; for (let i = 0; i < 5; i++) cue(J0 + i * .7, 'whoosh'); cue(J0 + 4.0, 'whoosh'); cue(J0 + 5.1, 'pop');
  const H0 = B.housamAct; cue(H0 + 4.0, 'plip'); cue(H0 + 4.6, 'whoosh'); cue(H0 + 5.1, 'bonk'); cue(H0 + 6.1, 'ding');
  cue(B.housamIn + .2, 'scratch');                // the hoop winch
  cue(B.dannyIn + 2.8, 'pop'); cue(B.freak, 'scratch'); cue(B.sm4 + 1.2, 'gulp'); cue(B.freeze + .9, 'ding');

  return {
    title: 'The Competition Begins',
    logline: 'The DCES talent competition, judged by Princess Pearl, Jester Fester and Dragon, with the Safadi brothers among the parents. The group dance gets a lukewarm 9, 7 and 3. Then the individual talents: Alma\'s cartwheels (10, 9, 8), Jenna\'s cartwheels (10, 9, 9), Housam\'s bicycle kick into the basketball hoop (10, 10, 9). Then Danny dribbles in with his Rubik\'s cube, and Doctor Sami panics about the broccoli juice. "I hope so..." To be continued.',
    files: ['props.js', 'scene.js'],            // judges' table, score cards, chairs, banner, cube; then the shots
    docs: 'README.md',                          // synopsis, script, shot list, notes for editing
    cast: ['princess_pearl', 'jester_fester', 'dragon', 'safadi', 'sami', 'alma', 'jenna', 'housam', 'danny', 'student'],
    locations: ['school_gym'],
    beats: { ...B, END },
    dialogue: lines,
    music: {
      prompt: 'A bright talent-show groove: a funky, clap-along dance number for the group finale, crowd applause after every act, a snare drumroll and a ding for each judge\'s score card (with a record scratch on Pearl\'s 3), whooshes for the cartwheels, a winch scratch as the hoop comes down, a bonk and a ding for the bicycle kick, and a nervous, thinning texture under Doctor Sami\'s panic into a suspenseful to-be-continued.',
      bpm: 120, tonic: 60, motif: [0, 4, 7, 9, 7, 4, 2, 4], chords: [0, 5, 3, 4],
      sections: [
        { at: 0, energy: 1 }, { at: 9.4, energy: .7 }, { at: B.roll1, energy: .25 }, { at: B.host1, energy: .7 }, { at: B.a1, energy: .4 },
        { at: B.almaAct, energy: .9 }, { at: B.roll2, energy: .25 }, { at: B.host2, energy: .7 }, { at: B.j1, energy: .4 },
        { at: B.jennaAct, energy: 1 }, { at: B.roll3, energy: .25 }, { at: B.host3, energy: .7 }, { at: B.h1, energy: .4 },
        { at: B.housamAct, energy: .95 }, { at: B.roll4, energy: .25 }, { at: B.host4, energy: .75 }, { at: B.dn1, energy: .45 },
        { at: B.freak, energy: .2 }, { at: B.sf1, energy: .35 }, { at: B.sm4, energy: .15 }, { at: B.freeze + .9, energy: .6 }, { at: END - 1.2, energy: 0 },
      ],
      cues,
    },
  };
})());
