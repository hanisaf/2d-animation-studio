// Deterministic scene soundtrack: procedural music and cartoon dialogue share one timeline.
// One OfflineAudioContext render supplies studio playback and both video exporters.
const SCENE_AUDIO_CACHE = new Map();

function synthesizeSceneAudio(sc, sampleRate = 48000) {
  if (!sc.music && !sc.dialogue?.length) return Promise.resolve(null);
  const key = `${sc.id}:${sampleRate}`;
  if (!SCENE_AUDIO_CACHE.has(key)) SCENE_AUDIO_CACHE.set(key, buildSceneAudio(sc, sampleRate).catch(e => { SCENE_AUDIO_CACHE.delete(key); throw e; }));
  return SCENE_AUDIO_CACHE.get(key);
}

async function buildSceneAudio(sc, sampleRate) {
  const ctx = new OfflineAudioContext(2, Math.ceil(sc.duration * sampleRate), sampleRate);
  const master = ctx.createGain(), musicBus = ctx.createGain(), voiceBus = ctx.createGain(), limiter = ctx.createDynamicsCompressor();
  master.gain.value = 1.8;
  limiter.threshold.value = -9; limiter.knee.value = 8; limiter.ratio.value = 5;
  master.connect(limiter).connect(ctx.destination);
  musicBus.connect(master); voiceBus.connect(master);

  if (sc.music) {
    const score = sc.music;
    const scale = [0, 2, 4, 5, 7, 9, 11], tonic = score.tonic ?? 60;
    const frequency = degree => {
      const octave = Math.floor(degree / 7), step = ((degree % 7) + 7) % 7;
      return 440 * 2 ** ((tonic + scale[step] + octave * 12 - 69) / 12);
    };
    function tone(at, dur, freq, level, wave = 'sine', pan = 0, brightness = 1) {
      if (at < 0 || at >= sc.duration || dur <= 0) return;
      const osc = ctx.createOscillator(), env = ctx.createGain(), filter = ctx.createBiquadFilter(), stereo = ctx.createStereoPanner();
      osc.type = wave; osc.frequency.setValueAtTime(freq, at);
      filter.type = 'lowpass'; filter.frequency.value = Math.min(9000, Math.max(250, freq * brightness));
      stereo.pan.value = pan;
      const end = Math.min(sc.duration, at + dur), peak = Math.min(end, at + .018);
      env.gain.setValueAtTime(.0001, at);
      env.gain.linearRampToValueAtTime(Math.max(.0002, level), peak);
      env.gain.exponentialRampToValueAtTime(.0001, end);
      osc.connect(filter).connect(env).connect(stereo).connect(musicBus);
      osc.start(at); osc.stop(end);
    }
    function bell(at, degree, level = .08, dur = .55) {
      const f = frequency(degree);
      tone(at, dur, f, level, 'sine', -.18, 8);
      tone(at, dur * .55, f * 2.01, level * .25, 'sine', .22, 8);
    }
    function thump(at, level = .1) {
      if (at < 0 || at >= sc.duration) return;
      const osc = ctx.createOscillator(), env = ctx.createGain(), end = Math.min(sc.duration, at + .22);
      osc.type = 'sine'; osc.frequency.setValueAtTime(180, at); osc.frequency.exponentialRampToValueAtTime(68, end);
      env.gain.setValueAtTime(.0001, at); env.gain.linearRampToValueAtTime(level, Math.min(end, at + .008)); env.gain.exponentialRampToValueAtTime(.0001, end);
      osc.connect(env).connect(musicBus); osc.start(at); osc.stop(end);
    }

    const beat = 60 / (score.bpm || 100), motif = score.motif || [0, 2, 4, 2, 5, 4, 2, 1], chords = score.chords || [0, 3, 4, 0];
    const sections = [...(score.sections || [{ at: 0, energy: .5 }])].sort((a, b) => a.at - b.at);
    const sectionAt = t => { let current = sections[0]; for (const section of sections) { if (section.at > t) break; current = section; } return current; };
    for (let step = 0; step * beat / 2 < sc.duration; step++) {
      const at = step * beat / 2, section = sectionAt(at), energy = section.energy ?? .5;
      if (energy <= 0) continue;
      const bar = Math.floor(step / 8), chord = chords[bar % chords.length], halfBeat = step % 2;
      if (!halfBeat) {
        const pulse = (step / 2) % 4;
        if (pulse === 0 || pulse === 2) tone(at, beat * .75, frequency(chord - 14), .14 * energy, 'triangle', -.08, 5);
        if (pulse === 1 || pulse === 3) for (const degree of [chord, chord + 2, chord + 4]) tone(at, beat * .46, frequency(degree - 7), .035 * energy, 'triangle', .12, 3);
        if (energy >= .55 && pulse === 0) thump(at, .045 * energy);
      }
      if ((energy >= .48 || !halfBeat) && (step % 8 !== 7 || energy >= .7)) {
        const degree = chord + motif[step % motif.length];
        bell(at, degree, .075 * energy, beat * (halfBeat ? .38 : .65));
      }
    }

    for (const cue of score.cues || []) {
      const at = cue.at;
      if (cue.type === 'pop') { bell(at, 14, .17, .22); bell(at + .075, 18, .11, .28); }
      else if (cue.type === 'ding') { bell(at, 18, .22, 1.25); bell(at + .015, 21, .08, .85); }
      else if (cue.type === 'bonk') { thump(at, .24); bell(at + .045, 2, .055, .25); }
      else if (cue.type === 'whoosh') for (let i = 0; i < 6; i++) bell(at + i * .045, 7 + i, .045, .16);
      else if (cue.type === 'plip') { bell(at, 16, .12, .32); bell(at + .08, 21, .08, .45); }
    }
  }

  // Bubble text is the timing source: each word gets short vowel-like syllables while its letters appear.
  // The text remains in the bubble; these sounds intentionally do not attempt intelligible speech.
  const lines = [...(sc.dialogue || [])].sort((a, b) => a.at - b.at);
  for (const [lineIndex, line] of lines.entries()) {
    if (line.kind === 'think' || line.silent) continue;
    const plain = line.text.replace(/\*/g, ''), cps = line.cps ?? 18;
    const voice = ASSETS.character[line.speaker]?.voice || {};
    const wordPattern = /[A-Za-z]+(?:'[A-Za-z]+)?/g;
    let word, syllableIndex = 0;
    while ((word = wordPattern.exec(plain))) {
      const vowels = word[0].match(/[aeiouy]+/gi) || [];
      const count = Math.min(3, Math.max(1, vowels.length));
      const spacing = word[0].length / cps / count;
      for (let i = 0; i < count; i++) {
        const at = line.at + .2 + (word.index + (i + .18) * word[0].length / count) / cps;
        const style = voice.style || 'bouncy';
        const length = { measured: 1.08, sporty: .67, melodic: 1, bouncy: .85, regal: .76, rumble: 1.14 }[style] ?? .85;
        const dur = Math.min(.28, Math.max(.07, spacing * length));
        cartoonSyllable(ctx, voiceBus, at, dur, { ...voice, level: (voice.level ?? .13) * (line.energy ?? 1) }, lineIndex * 97 + syllableIndex++, vowels[i]?.[0] || 'a');
      }
    }
  }
  if (sc.music && lines.length) {
    musicBus.gain.setValueAtTime(1, 0);
    // Merge overlapping spoken ranges so a second line cannot lift the music during the first.
    const ranges = [];
    for (const line of lines) {
      if (line.kind === 'think' || line.silent) continue;
      const end = Math.min(sc.duration, line.at + .2 + line.text.replace(/\*/g, '').length / (line.cps ?? 18) + .18);
      if (ranges.length && line.at <= ranges[ranges.length - 1][1] + .25) ranges[ranges.length - 1][1] = Math.max(end, ranges[ranges.length - 1][1]);
      else ranges.push([line.at, end]);
    }
    for (const [start, end] of ranges) {
      musicBus.gain.setValueAtTime(1, start);
      musicBus.gain.linearRampToValueAtTime(.48, Math.min(end, start + .13));
      musicBus.gain.setValueAtTime(.48, end);
      musicBus.gain.linearRampToValueAtTime(1, Math.min(sc.duration, end + .38));
    }
  }
  return ctx.startRendering();
}

function cartoonSyllable(ctx, bus, at, dur, voice, seed, vowel) {
  if (at < 0 || at >= ctx.length / ctx.sampleRate) return;
  const end = Math.min(at + dur, ctx.length / ctx.sampleRate);
  const shape = { a: [780, 1450], e: [540, 2050], i: [420, 2300], o: [570, 1050], u: [410, 900], y: [470, 2050] }[vowel.toLowerCase()] || [650, 1400];
  const osc = ctx.createOscillator(), envelope = ctx.createGain(), pan = ctx.createStereoPanner();
  const first = ctx.createBiquadFilter(), second = ctx.createBiquadFilter();
  const mix1 = ctx.createGain(), mix2 = ctx.createGain();
  const style = voice.style || 'bouncy', variation = Math.sin(seed * 12.9898 + 3.4);
  const notes = { measured: [0, 0, -1, 1, -2], sporty: [0, 3, -1, 4, 1], melodic: [0, 3, 5, 2, 7, 4], bouncy: [0, 2, -1, 4], regal: [0, -2, -1, -3, -4], rumble: [0, 1, -2, 2, -1] }[style] || [0, 2, -1, 4];
  const pitch = (voice.baseHz ?? 220) * 2 ** ((notes[seed % notes.length] + variation * (style === 'measured' ? .35 : .8)) / 12);
  const bend = { measured: 1.018, sporty: 1.12, melodic: 1.15, bouncy: 1.07, regal: .98, rumble: 1.035 }[style] ?? 1.07;
  osc.type = style === 'sporty' || style === 'regal' ? 'square' : 'sawtooth';
  osc.frequency.setValueAtTime(pitch * (style === 'melodic' ? .96 : .91), at);
  osc.frequency.linearRampToValueAtTime(pitch * bend, Math.min(end, at + dur * .46));
  osc.frequency.linearRampToValueAtTime(pitch * (style === 'measured' ? .97 : 1), end);
  first.type = second.type = 'bandpass'; first.Q.value = .8; second.Q.value = 1.1;
  first.frequency.value = shape[0] * (voice.brightness ?? 1);
  second.frequency.value = shape[1] * (voice.brightness ?? 1);
  mix1.gain.value = .8; mix2.gain.value = .34;
  envelope.gain.setValueAtTime(.0001, at);
  const attack = style === 'sporty' ? .008 : style === 'measured' || style === 'rumble' ? .026 : .018;
  const release = style === 'sporty' || style === 'regal' ? .024 : style === 'measured' || style === 'rumble' ? .06 : .045;
  envelope.gain.linearRampToValueAtTime(voice.level ?? .13, Math.min(end, at + attack));
  envelope.gain.setValueAtTime(voice.level ?? .13, Math.max(at + attack, end - release));
  envelope.gain.exponentialRampToValueAtTime(.0001, end);
  pan.pan.value = Math.max(-.4, Math.min(.4, voice.pan ?? 0));
  osc.connect(first).connect(mix1).connect(envelope);
  osc.connect(second).connect(mix2).connect(envelope);
  envelope.connect(pan).connect(bus);
  osc.start(at); osc.stop(end);
}

function sceneWavBlob(buffer) {
  const length = buffer.length, bytes = new ArrayBuffer(44 + length * 4), view = new DataView(bytes);
  const label = (at, value) => { for (let i = 0; i < value.length; i++) view.setUint8(at + i, value.charCodeAt(i)); };
  label(0, 'RIFF'); view.setUint32(4, bytes.byteLength - 8, true); label(8, 'WAVE'); label(12, 'fmt ');
  view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 2, true);
  view.setUint32(24, buffer.sampleRate, true); view.setUint32(28, buffer.sampleRate * 4, true);
  view.setUint16(32, 4, true); view.setUint16(34, 16, true); label(36, 'data'); view.setUint32(40, length * 4, true);
  const left = buffer.getChannelData(0), right = buffer.getChannelData(1);
  for (let i = 0; i < length; i++) {
    view.setInt16(44 + i * 4, Math.round(Math.max(-1, Math.min(1, left[i])) * 32767), true);
    view.setInt16(46 + i * 4, Math.round(Math.max(-1, Math.min(1, right[i])) * 32767), true);
  }
  return new Blob([bytes], { type: 'audio/wav' });
}

async function sceneWavBase64(id) {
  const buffer = await synthesizeSceneAudio(SCENES[id]);
  if (!buffer) return null;
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1]);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(sceneWavBlob(buffer));
  });
}
