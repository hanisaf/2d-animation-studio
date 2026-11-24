#!/usr/bin/env node
// Record a scene's dialogue with Gemini TTS and make the bubbles follow the recording.
//   GEMINI_API_KEY=… node scripts/tts_gemini.mjs scene27_dynamics_of_mirroring [--no-retime] [--force]
//
// Reads the scene's asset.js: `dialogue` and `tts: { model, voice, style, level, gap, panelGap, tempo }`.
// For every line it asks Gemini for speech (24 kHz PCM), trims the silence, and stores an MP3 in scenes/<series>/<id>/voice/
// (cached by model + voice + style + text, so re-running only records new or changed lines; --force re-records all).
// Then it writes scenes/<series>/<id>/voice.js (the clips as data URLs; works from file:// in the renderer and in the studio),
// sped up by `tempo` (pitch-preserving ffmpeg atempo; 1 = as recorded; the takes in voice/ stay untouched)
// and, unless --no-retime, rewrites each line's `at` and `cps` in asset.js so lines follow each other with `gap`
// seconds of silence (`panelGap` when the line's `slide` changes) and each bubble types exactly as long as it's spoken.
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import vm from 'node:vm';
import { REGISTRY, sceneDir } from './registry.mjs';

process.chdir(resolve(import.meta.dirname, '..'));
const args = process.argv.slice(2), id = args.find(a => !a.startsWith('--'));
const force = args.includes('--force'), retime = !args.includes('--no-retime');
const envOnly = args.includes('--envelopes'), allEnvs = args.includes('--all-envelopes');
if (!id && !allEnvs) { console.log('usage: node scripts/tts_gemini.mjs <scene_id> [--no-retime] [--force] [--envelopes]\n       node scripts/tts_gemini.mjs --all-envelopes'); process.exit(1); }
if (id && !REGISTRY.scenes.includes(id)) { console.error(`unknown scene "${id}"`); process.exit(1); }
const KEY = process.env.GEMINI_API_KEY;
if (!envOnly && !allEnvs && !KEY) { console.error('GEMINI_API_KEY is not set'); process.exit(1); }
const FFMPEG = process.env.FFMPEG || (spawnSync('ffmpeg', ['-version']).status === 0 ? 'ffmpeg' : (await import('ffmpeg-static')).default);
const RATE = 24000, ENV_FPS = 24;

// Quantize 24 kHz 16-bit LE mono PCM into a compact 24 fps mouth-shape envelope string:
// '.' = closed/pause, 's' = slight/spread, 'o' = rounded/low-ZCR, 'a' = wide open.
function computeEnvelope(pcm, rate = RATE, fps = ENV_FPS) {
  const s = new Int16Array(pcm.buffer, pcm.byteOffset, pcm.length >> 1);
  const win = Math.max(1, Math.round(rate / fps)), n = Math.ceil(s.length / win);
  const rms = new Float32Array(n), zcr = new Float32Array(n);
  for (let f = 0; f < n; f++) {
    const a = f * win, b = Math.min(s.length, a + win), len = b - a || 1;
    let sum = 0, cross = 0, prev = s[a] >= 0;
    for (let i = a; i < b; i++) {
      const v = s[i] / 32768; sum += v * v;
      const cur = s[i] >= 0; if (cur !== prev) { cross++; prev = cur; }
    }
    rms[f] = Math.sqrt(sum / len);
    zcr[f] = cross / len;
  }
  const sorted = Array.from(rms).filter(v => v > .005).sort((a, b) => a - b);
  const ref = sorted[Math.floor(sorted.length * .88)] || .15;
  let out = '';
  for (let f = 0; f < n; f++) {
    const e = rms[f] / ref;
    if (e < .16) out += '.';
    else if (e >= .62) out += 'a';
    else if (zcr[f] < .11) out += 'o';
    else out += 's';
  }
  return out;
}
function mp3ToPcm(buf) {
  const r = spawnSync(FFMPEG, ['-loglevel', 'error', '-f', 'mp3', '-i', 'pipe:0', '-ar', String(RATE), '-ac', '1', '-f', 's16le', 'pipe:1'], { input: buf, maxBuffer: 1 << 26 });
  if (r.status) throw new Error(`ffmpeg decode: ${r.stderr}`);
  return r.stdout;
}
function backfillVoiceFile(sceneId) {
  const vPath = `${sceneDir(sceneId)}/voice.js`;
  if (!existsSync(vPath)) return false;
  const raw = readFileSync(vPath, 'utf8'), header = raw.split('\n')[0];
  let recorded = null;
  vm.runInNewContext(raw, { voiceClips: c => { recorded = c; } });
  if (!recorded) return false;
  const rows = Object.entries(recorded).map(([text, c]) => {
    const mp3Buf = Buffer.from(c.src.slice(c.src.indexOf(',') + 1), 'base64');
    const env = computeEnvelope(mp3ToPcm(mp3Buf));
    return `  ${JSON.stringify(text)}: { dur: ${c.dur}, env: ${JSON.stringify(env)}, src: '${c.src}' },`;
  });
  writeFileSync(vPath, `${header}\nvoiceClips({\n${rows.join('\n')}\n});\n`);
  console.log(`updated envelopes in ${vPath} (${rows.length} clips)`);
  return true;
}
if (allEnvs || envOnly) {
  const targets = allEnvs ? REGISTRY.scenes : [id];
  let count = 0;
  for (const sid of targets) if (backfillVoiceFile(sid)) count++;
  console.log(`backfilled lip-sync envelopes for ${count} scene${count === 1 ? '' : 's'}`);
  process.exit(0);
}

const dir = sceneDir(id), assetPath = `${dir}/asset.js`, voiceDir = `${dir}/voice`;
let meta = null;
vm.runInNewContext(readFileSync(assetPath, 'utf8'), { asset: m => { meta = m; } });
const tts = { model: 'gemini-3.1-flash-tts-preview', voice: 'Charon', style: '', gap: .45, panelGap: 1.5, tempo: 1, ...meta.tts };
const plain = l => l.text.replace(/\*/g, '');
mkdirSync(voiceDir, { recursive: true });
const indexPath = `${voiceDir}/index.json`, index = existsSync(indexPath) ? JSON.parse(readFileSync(indexPath, 'utf8')) : {};

async function speak(text) {
  const body = { contents: [{ parts: [{ text: tts.style ? `${tts.style} ${text}` : text }] }],
    generationConfig: { responseModalities: ['AUDIO'], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: tts.voice } } } } };
  for (let attempt = 1; ; attempt++) {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${tts.model}:generateContent`,
      { method: 'POST', headers: { 'x-goog-api-key': KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const j = await r.json().catch(() => ({}));
    const data = j.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;
    if (r.ok && data) return Buffer.from(data, 'base64');
    const wait = r.status === 429 ? 1000 * (parseFloat(JSON.stringify(j).match(/"retryDelay":"([\d.]+)s"/)?.[1] || 20) + 1) : 3000 * attempt;
    if (attempt >= 6) throw new Error(`TTS failed for "${text.slice(0, 40)}…": ${r.status} ${j.error?.message || 'no audio'}`);
    console.log(`  retry in ${(wait / 1000).toFixed(0)} s (${r.status} ${j.error?.status || 'no audio'})`);
    await new Promise(res => setTimeout(res, wait));
  }
}
// Trim leading / trailing silence (keeps a short tail so the last syllable isn't clipped). PCM is 16-bit LE mono.
function trim(pcm) {
  const s = new Int16Array(pcm.buffer, pcm.byteOffset, pcm.length >> 1), loud = i => Math.abs(s[i]) > 400;
  let a = 0, b = s.length - 1; while (a < b && !loud(a)) a++; while (b > a && !loud(b)) b--;
  a = Math.max(0, a - .03 * RATE | 0); b = Math.min(s.length, b + .12 * RATE | 0);
  return Buffer.from(s.slice(a, b).buffer);
}
function mp3(pcm, out) {
  const r = spawnSync(FFMPEG, ['-y', '-loglevel', 'error', '-f', 's16le', '-ar', String(RATE), '-ac', '1', '-i', 'pipe:0', '-c:a', 'libmp3lame', '-b:a', '64k', out], { input: pcm });
  if (r.status) throw new Error(`ffmpeg: ${r.stderr}`);
}

// ---------- record (sequentially: the preview TTS models have tight rate limits) ----------
const lines = meta.dialogue, clips = {};
for (const [i, l] of lines.entries()) {
  const text = plain(l), key = createHash('sha1').update([tts.model, tts.voice, tts.style, text].join('|')).digest('hex').slice(0, 12);
  const file = `${voiceDir}/${key}.mp3`;
  if (force || !existsSync(file) || !index[key]) {
    process.stdout.write(`  ${String(i + 1).padStart(2)}/${lines.length} recording: ${text.slice(0, 60)}${text.length > 60 ? '…' : ''}\n`);
    const pcm = trim(await speak(text));
    mp3(pcm, file);
    index[key] = { text, dur: +(pcm.length / 2 / RATE).toFixed(3) };
    writeFileSync(indexPath, JSON.stringify(index, null, 1));
  }
  clips[text] = { key, dur: +(index[key].dur / tts.tempo).toFixed(3) };
}

// drop recordings no line uses any more (old takes, changed text)
const used = new Set(Object.values(clips).map(c => c.key));
for (const key of Object.keys(index)) if (!used.has(key)) { delete index[key]; rmSync(`${voiceDir}/${key}.mp3`, { force: true }); }
writeFileSync(indexPath, JSON.stringify(index, null, 1));

// ---------- voice.js ----------
function take(key) {                                          // the take as it goes in voice.js: at `tempo`, pitch kept
  const file = `${voiceDir}/${key}.mp3`;
  if (tts.tempo === 1) return readFileSync(file);
  const r = spawnSync(FFMPEG, ['-loglevel', 'error', '-i', file, '-filter:a', `atempo=${tts.tempo}`, '-c:a', 'libmp3lame', '-b:a', '64k', '-f', 'mp3', 'pipe:1'], { maxBuffer: 1 << 26 });
  if (r.status) throw new Error(`ffmpeg: ${r.stderr}`);
  return r.stdout;
}
const body = Object.entries(clips).map(([text, c]) => {
  const buf = take(c.key), env = computeEnvelope(mp3ToPcm(buf));
  return `  ${JSON.stringify(text)}: { dur: ${c.dur}, env: ${JSON.stringify(env)}, src: 'data:audio/mpeg;base64,${buf.toString('base64')}' },`;
}).join('\n');
writeFileSync(`${dir}/voice.js`, `// Recorded voice for ${id}: generated by scripts/tts_gemini.mjs (${tts.model}, voice ${tts.voice}, tempo ${tts.tempo}). Don't edit by hand.\nvoiceClips({\n${body}\n});\n`);
console.log(`wrote ${dir}/voice.js (${Object.keys(clips).length} clips, ${(Object.values(clips).reduce((s, c) => s + c.dur, 0) / 60).toFixed(1)} min of speech)`);

// ---------- retime asset.js: `at` follows the recording, `cps` makes the bubble type as long as the line is spoken ----------
if (retime) {
  let at = lines[0].at, prev = null;
  const timed = lines.map(l => {
    if (prev) at = prev.at + .2 + clips[plain(prev)].dur + (l.slide !== prev.slide ? tts.panelGap : tts.gap);
    const t = { at: +at.toFixed(2), cps: +(plain(l).length / clips[plain(l)].dur).toFixed(2) };
    prev = { ...l, at }; return t;
  });
  let src = readFileSync(assetPath, 'utf8'), n = 0;
  src = src.split('\n').map(row => {
    const m = row.match(/text: ("(?:[^"\\]|\\.)*")/);
    if (!m || !/\bat: [\d.]+/.test(row) || !/\bcps: [\d.]+/.test(row)) return row;
    const l = lines[n], t = timed[n++];
    if (JSON.parse(m[1]) !== l.text) throw new Error(`asset.js line order doesn't match dialogue at "${l.text.slice(0, 40)}"`);
    return row.replace(/\bat: [\d.]+/, `at: ${t.at}`).replace(/\bcps: [\d.]+/, `cps: ${t.cps}`);
  }).join('\n');
  if (n !== lines.length) throw new Error(`found ${n} of ${lines.length} dialogue rows in asset.js (one line per row is expected)`);
  writeFileSync(assetPath, src);
  const end = timed.at(-1).at + .2 + clips[plain(lines.at(-1))].dur;
  console.log(`retimed ${n} lines in ${assetPath}: speech ends at ${(end / 60 | 0)}:${(end % 60).toFixed(1).padStart(4, '0')}`);
}
