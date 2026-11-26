#!/usr/bin/env node
// scripts/comic_to_video.mjs
// General Comic-to-Video pipeline: converts any registered comic directly from clean Studio JS-rendered
// frames into an animated MP4 using Veo 3.1 (native audio) + ffmpeg (subtitles/overlays & assembly).
//
// Usage:
//   npm run comic:video -- <comic_id> --plan [--page=2] [--aspect=16:9|9:16] [--framing=recompose|pad|crop] [--enrich-prompts]
//   npm run comic:video -- <comic_id> --dry-run [--page=2] [--shot=1] [--quality]
//   GEMINI_API_KEY=... npm run comic:video -- <comic_id> [--page=2] [--shot=1] [--quality] [--resolution=720p|1080p]
//                                             [--audio=veo|mute] [--overlays=subtitles|none|lettering] [--subtitles=burn|soft]
//                                             [--force] [--approve=<take_id>] [--assemble-only]

import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { REGISTRY, BOOKS, comicDir } from './registry.mjs';
import { buildComic, videoDimensions } from './build_comic.mjs';
import { buildStoryboard, enrichStoryboardPrompts, generateSrtFromStoryboard } from './comic_video_plan.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// Veo 3.1 preview models on generativelanguage.googleapis.com were retired Oct 22, 2026 in favor of
// Gemini Omni 1.2 Flash via the Interactions API (/v1beta/interactions). Veo model IDs (veo-*) remain
// supported automatically via :predictLongRunning when explicitly selected with --model=veo-...
export const DEFAULT_VIDEO_MODEL = 'gemini-omni-1.2-flash';
export const DEFAULT_VEO_MODEL_FAST = 'veo-3.1-fast-generate-preview';
export const DEFAULT_VEO_MODEL_QUALITY = 'veo-3.1-generate-preview';

export function isVeoModel(model) {
  return /^veo-/i.test(String(model || ''));
}

const MIME_BY_EXT = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
};

function loadDotEnv() {
  const envPath = join(ROOT, '.env');
  if (!existsSync(envPath)) return;
  for (const raw of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq <= 0) continue;
    const k = line.slice(0, eq).trim();
    const v = line.slice(eq + 1).trim().replace(/^(['"])(.*)\1$/, '$2');
    if (k && process.env[k] == null && v) process.env[k] = v;
  }
}

let _ffmpegBin = null;
export async function resolveFfmpeg() {
  if (_ffmpegBin) return _ffmpegBin;
  if (process.env.FFMPEG) {
    _ffmpegBin = process.env.FFMPEG;
    return _ffmpegBin;
  }
  const sys = spawnSync('ffmpeg', ['-version'], { stdio: 'ignore' });
  if (sys.status === 0) {
    _ffmpegBin = 'ffmpeg';
    return _ffmpegBin;
  }
  const mod = await import('ffmpeg-static');
  _ffmpegBin = mod.default;
  return _ffmpegBin;
}

export function resolveVeoDuration(requested, { hasLastFrame = false, resolution = '720p', model = DEFAULT_VIDEO_MODEL } = {}) {
  const n = Math.round(Number(requested) || 6);
  if (isVeoModel(model)) {
    // Veo 3.1 requires 8 seconds for first+last frame interpolation and for 1080p/4k outputs
    if (hasLastFrame || resolution === '1080p' || resolution === '4k') return 8;
    if (n === 4 || n === 6 || n === 8) return n;
    return 6;
  }
  // Gemini Omni 1.2 Flash supports whole seconds 3..15 (3..10 for first+last frame interpolation)
  const maxSec = hasLastFrame ? 10 : 15;
  return Math.max(3, Math.min(maxSec, n));
}

export function buildInteractionsRequestPayload({
  model = DEFAULT_VIDEO_MODEL,
  prompt,
  firstFramePath,
  lastFramePath = null,
  aspectRatio = '16:9',
  resolution = '720p',
  durationSeconds = 6,
}) {
  if (!existsSync(firstFramePath)) {
    throw new Error(`Missing first frame on disk: ${firstFramePath}`);
  }
  const hasLastFrame = Boolean(lastFramePath);
  const resolvedDuration = resolveVeoDuration(durationSeconds, { hasLastFrame, resolution, model });
  const firstMime = MIME_BY_EXT[extname(firstFramePath).toLowerCase()] || 'image/png';
  const promptText = hasLastFrame
    ? `The first attached image is the exact STARTING frame and the second attached image is the exact ENDING frame. Animate a smooth transition between them.\n${prompt}`
    : `The attached image is the exact STARTING frame. Animate it cleanly while preserving its 2D style.\n${prompt}`;

  const input = [
    { type: 'text', text: promptText },
    {
      type: 'image',
      mime_type: firstMime,
      data: readFileSync(firstFramePath).toString('base64'),
    },
  ];
  if (hasLastFrame) {
    if (!existsSync(lastFramePath)) {
      throw new Error(`Missing last frame on disk: ${lastFramePath}`);
    }
    const lastMime = MIME_BY_EXT[extname(lastFramePath).toLowerCase()] || 'image/png';
    input.push({
      type: 'image',
      mime_type: lastMime,
      data: readFileSync(lastFramePath).toString('base64'),
    });
  }

  const normRes = ['360p', '720p', '1080p', '4k'].includes(resolution) ? resolution : '720p';
  return {
    model,
    background: true,
    input,
    response_modalities: ['video'],
    generation_config: {
      video_config: {
        task: 'image_to_video',
      },
    },
    response_format: {
      type: 'video',
      aspect_ratio: aspectRatio === '9:16' ? '9:16' : '16:9',
      duration: `${resolvedDuration}s`,
      resolution: normRes,
    },
  };
}

export function extractVideoFromInteraction(json) {
  const walk = node => {
    if (!node || typeof node !== 'object') return null;
    if (Array.isArray(node)) {
      for (const item of node) {
        const hit = walk(item);
        if (hit) return hit;
      }
      return null;
    }
    if ((node.type === 'video' || String(node.mime_type || '').startsWith('video/')) && (node.data || node.uri)) {
      return { data: node.data || null, uri: node.uri || null, mimeType: node.mime_type || 'video/mp4' };
    }
    if (node.output_video?.data || node.output_video?.uri) {
      return { data: node.output_video.data || null, uri: node.output_video.uri || null, mimeType: node.output_video.mime_type || 'video/mp4' };
    }
    for (const [k, v] of Object.entries(node)) {
      if (k === 'user_input') continue;
      const hit = walk(v);
      if (hit) return hit;
    }
    return null;
  };
  return walk(json?.outputs || json?.steps || json);
}

async function startInteraction({ apiKey, payload }) {
  const endpoint = 'https://generativelanguage.googleapis.com/v1beta/interactions';
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'x-goog-api-key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json().catch(() => ({}));
    if (res.ok && json.id) {
      return json;
    }
    const retryable = res.status === 429 || res.status >= 500 || !res.status;
    if (!retryable || attempt >= 5) {
      throw new Error(`Gemini Interactions API failed (${res.status}): ${json.error?.message || JSON.stringify(json).slice(0, 260)}`);
    }
    const waitMs = 4000 * attempt;
    console.log(`  retrying submit in ${(waitMs / 1000).toFixed(0)}s (HTTP ${res.status})`);
    await new Promise(r => setTimeout(r, waitMs));
  }
}

async function pollInteraction({ apiKey, interactionId, pollIntervalSec = 10, maxWaitSec = 900 }) {
  const url = `https://generativelanguage.googleapis.com/v1beta/interactions/${encodeURIComponent(interactionId)}`;
  const started = Date.now();
  let polls = 0;
  while (true) {
    polls++;
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'x-goog-api-key': apiKey },
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      if ((res.status === 429 || res.status >= 500) && (Date.now() - started) / 1000 < maxWaitSec) {
        await new Promise(r => setTimeout(r, pollIntervalSec * 1000));
        continue;
      }
      throw new Error(`Interaction poll failed (${res.status}): ${json.error?.message || JSON.stringify(json).slice(0, 240)}`);
    }
    if (json.status === 'failed' || json.status === 'cancelled') {
      const errs = Array.isArray(json.errors) ? json.errors : [];
      const first = errs[0] || {};
      const hint = first.code === 'RESOURCE_EXHAUSTED'
        ? ' (Check that Pay-as-you-go billing / video generation quota is enabled for this GEMINI_API_KEY in Google AI Studio.)'
        : '';
      throw new Error(`Video generation ${json.status} [${first.code || 'ERROR'}]: ${first.message || JSON.stringify(errs).slice(0, 240)}${hint}`);
    }
    if (json.status !== 'in_progress' && json.status !== 'pending' && json.status !== 'queued') {
      const media = extractVideoFromInteraction(json);
      if (!media) {
        throw new Error(`Interaction finished with status "${json.status}" but returned no video output.`);
      }
      return { media, interaction: json };
    }
    const elapsed = Math.round((Date.now() - started) / 1000);
    if (elapsed >= maxWaitSec) {
      throw new Error(`Interaction timed out after ${elapsed}s (saved to index.json for resume: ${interactionId})`);
    }
    if (polls === 1 || polls % 3 === 0) {
      console.log(`  … waiting on Gemini Omni (${elapsed}s elapsed)`);
    }
    await new Promise(r => setTimeout(r, pollIntervalSec * 1000));
  }
}

export function buildVeoRequestPayload({
  prompt,
  firstFramePath,
  lastFramePath = null,
  aspectRatio = '16:9',
  resolution = '720p',
  durationSeconds = 6,
}) {
  if (!existsSync(firstFramePath)) {
    throw new Error(`Missing first frame on disk: ${firstFramePath}`);
  }
  const firstMime = MIME_BY_EXT[extname(firstFramePath).toLowerCase()] || 'image/png';
  const instance = {
    prompt,
    image: {
      mimeType: firstMime,
      bytesBase64Encoded: readFileSync(firstFramePath).toString('base64'),
    },
  };
  const hasLastFrame = Boolean(lastFramePath);
  if (hasLastFrame) {
    if (!existsSync(lastFramePath)) {
      throw new Error(`Missing last frame on disk: ${lastFramePath}`);
    }
    const lastMime = MIME_BY_EXT[extname(lastFramePath).toLowerCase()] || 'image/png';
    // CRITICAL Veo 3.1 REST rule: lastFrame must live inside instances[0], NOT parameters
    instance.lastFrame = {
      mimeType: lastMime,
      bytesBase64Encoded: readFileSync(lastFramePath).toString('base64'),
    };
  }
  const resolvedDuration = resolveVeoDuration(durationSeconds, { hasLastFrame, resolution, model: DEFAULT_VEO_MODEL_FAST });
  return {
    instances: [instance],
    parameters: {
      aspectRatio: aspectRatio === '9:16' ? '9:16' : '16:9',
      resolution: resolution === '1080p' ? '1080p' : '720p',
      durationSeconds: resolvedDuration,
      sampleCount: 1,
    },
  };
}

export function computeShotHash({
  model,
  prompt,
  aspectRatio,
  resolution,
  durationSeconds,
  firstFramePath,
  lastFramePath = null,
}) {
  const h = createHash('sha1');
  h.update([model, aspectRatio, resolution, String(durationSeconds), prompt].join('\0'));
  h.update('\0first\0');
  h.update(readFileSync(firstFramePath));
  if (lastFramePath) {
    h.update('\0last\0');
    h.update(readFileSync(lastFramePath));
  }
  return h.digest('hex').slice(0, 12);
}

async function startVeoOperation({ apiKey, model, payload }) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:predictLongRunning`;
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'x-goog-api-key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json().catch(() => ({}));
    if (res.ok && json.name) {
      return json.name;
    }
    const retryable = res.status === 429 || res.status >= 500 || !res.status;
    if (!retryable || attempt >= 5) {
      throw new Error(`Veo predictLongRunning failed (${res.status}): ${json.error?.message || JSON.stringify(json).slice(0, 260)}`);
    }
    const retrySec = parseFloat(JSON.stringify(json).match(/"retryDelay":"([\d.]+)s"/)?.[1] || '0');
    const waitMs = retrySec > 0 ? (retrySec + 1) * 1000 : 4000 * attempt;
    console.log(`  retrying Veo submit in ${(waitMs / 1000).toFixed(0)}s (HTTP ${res.status} ${json.error?.status || ''})`);
    await new Promise(r => setTimeout(r, waitMs));
  }
}

export function extractVideoUriFromOperation(opJson) {
  const samples = opJson?.response?.generateVideoResponse?.generatedSamples;
  if (Array.isArray(samples) && samples[0]?.video?.uri) {
    return samples[0].video.uri;
  }
  const videos = opJson?.response?.videos;
  if (Array.isArray(videos) && videos[0]?.uri) {
    return videos[0].uri;
  }
  return null;
}

async function pollVeoOperation({ apiKey, operationName, pollIntervalSec = 12, maxWaitSec = 900 }) {
  const opPath = operationName.startsWith('http')
    ? operationName
    : `https://generativelanguage.googleapis.com/v1beta/${operationName.replace(/^\/+/, '')}`;
  const started = Date.now();
  let polls = 0;

  while (true) {
    polls++;
    const res = await fetch(opPath, {
      method: 'GET',
      headers: { 'x-goog-api-key': apiKey },
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      if ((res.status === 429 || res.status >= 500) && (Date.now() - started) / 1000 < maxWaitSec) {
        await new Promise(r => setTimeout(r, pollIntervalSec * 1000));
        continue;
      }
      throw new Error(`Veo poll failed (${res.status}): ${json.error?.message || JSON.stringify(json).slice(0, 240)}`);
    }
    if (json.done) {
      if (json.error) {
        throw new Error(`Veo operation error (${json.error.code || 'unknown'}): ${json.error.message || JSON.stringify(json.error)}`);
      }
      const uri = extractVideoUriFromOperation(json);
      if (!uri) {
        const filtered = json?.response?.generateVideoResponse?.raiMediaFilteredReasons;
        const reason = Array.isArray(filtered) && filtered.length ? ` (filtered: ${filtered.join('; ')})` : '';
        throw new Error(`Veo operation finished without a downloadable video URI${reason}`);
      }
      return { uri, operation: json };
    }
    const elapsed = Math.round((Date.now() - started) / 1000);
    if (elapsed >= maxWaitSec) {
      throw new Error(`Veo operation timed out after ${elapsed}s (operation saved to index.json for resume: ${operationName})`);
    }
    if (polls === 1 || polls % 3 === 0) {
      console.log(`  … waiting on Veo (${elapsed}s elapsed)`);
    }
    await new Promise(r => setTimeout(r, pollIntervalSec * 1000));
  }
}

async function downloadVeoVideo({ apiKey, uri, destPath }) {
  const res = await fetch(uri, {
    method: 'GET',
    headers: { 'x-goog-api-key': apiKey },
    redirect: 'follow',
  });
  if (!res.ok) {
    throw new Error(`Veo video download failed (HTTP ${res.status})`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 1024) {
    throw new Error(`Downloaded Veo video looks empty (${buf.length} bytes)`);
  }
  mkdirSync(dirname(destPath), { recursive: true });
  writeFileSync(destPath, buf);
  return buf.length;
}

export function probeMedia(ffmpeg, filePath) {
  const res = spawnSync(ffmpeg, ['-i', filePath], { encoding: 'utf8' });
  const stderr = res.stderr || '';
  const durMatch = stderr.match(/Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/);
  const duration = durMatch
    ? Number(durMatch[1]) * 3600 + Number(durMatch[2]) * 60 + Number(durMatch[3])
    : null;
  const hasAudio = /Stream\s+#\d+:\d+.*:\s*Audio:/i.test(stderr);
  return { duration, hasAudio };
}

function escapeFfmpegFilterPath(p) {
  // Escape backslashes, colons, single quotes, and brackets for ffmpeg's subtitles filter
  return p
    .replace(/\\/g, '/')
    .replace(/:/g, '\\:')
    .replace(/'/g, "\\'")
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]');
}

function runFfmpeg(ffmpeg, args, label = 'ffmpeg') {
  const r = spawnSync(ffmpeg, args, { encoding: 'utf8', maxBuffer: 1 << 25 });
  if (r.status !== 0) {
    throw new Error(`${label} failed (exit ${r.status}): ${(r.stderr || r.stdout || '').slice(-600)}`);
  }
  return r;
}

export async function assembleComicVideo({
  storyboard,
  comicDirAbs,
  clipPathsByShotId,
  outputPath,
  srtPath = null,
  overlays = 'subtitles',
  subtitlesMode = 'burn',
  quiet = false,
}) {
  const ffmpeg = await resolveFfmpeg();
  const dims = videoDimensions(storyboard.aspect || '16:9', storyboard.resolution || '720p');
  const tmpDir = join(comicDirAbs, 'video', '.assemble_tmp');
  rmSync(tmpDir, { recursive: true, force: true });
  mkdirSync(tmpDir, { recursive: true });

  const assembledShots = [];
  const normFiles = [];
  const actualDurations = [];

  try {
    for (const shot of storyboard.shots) {
      const srcClip = clipPathsByShotId[shot.id];
      if (!srcClip || !existsSync(srcClip)) continue;
      assembledShots.push(shot);

      const probe = probeMedia(ffmpeg, srcClip);
      const rawDur = probe.duration || shot.durationSeconds || 6;
      // Trim 2 frames (~0.084s at 24fps) off the start of chained interpolation clips to prevent shared-frame stutter
      const trimStart = shot.chainedFromPrev && rawDur > 1.0 ? 0.084 : 0;
      const effectiveDur = Math.max(0.5, rawDur - trimStart);

      const normPath = join(tmpDir, `${shot.id}_norm.mp4`);
      const overlayAbs = overlays === 'lettering' && shot.overlay ? join(comicDirAbs, shot.overlay) : null;
      const useLettering = Boolean(overlayAbs && existsSync(overlayAbs));

      const scaleFilter = `scale=${dims.width}:${dims.height}:force_original_aspect_ratio=decrease,pad=${dims.width}:${dims.height}:(ow-iw)/2:(oh-ih)/2:black,fps=24,format=yuv420p`;
      const args = ['-y', '-loglevel', 'error'];
      if (trimStart > 0) args.push('-ss', trimStart.toFixed(3));
      args.push('-i', srcClip);

      if (useLettering) {
        args.push('-i', overlayAbs);
      }
      if (!probe.hasAudio) {
        args.push('-f', 'lavfi', '-i', 'anullsrc=channel_layout=stereo:sample_rate=48000');
      }

      if (useLettering) {
        const showStart = Math.min(0.35, effectiveDur * 0.1).toFixed(2);
        const showEnd = Math.max(0.5, effectiveDur - 0.25).toFixed(2);
        args.push(
          '-filter_complex',
          `[0:v]${scaleFilter}[bg];[1:v]scale=${dims.width}:${dims.height},format=rgba[ov];[bg][ov]overlay=0:0:enable='between(t,${showStart},${showEnd})'[vout]`,
          '-map', '[vout]'
        );
      } else {
        args.push('-vf', scaleFilter, '-map', '0:v:0');
      }

      if (probe.hasAudio) {
        args.push('-map', '0:a:0');
      } else {
        const silentIdx = useLettering ? 2 : 1;
        args.push('-map', `${silentIdx}:a:0`, '-shortest');
      }

      args.push(
        '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18', '-pix_fmt', 'yuv420p',
        '-c:a', 'aac', '-ar', '48000', '-ac', '2', '-b:a', '128k',
        '-movflags', '+faststart',
        normPath
      );
      runFfmpeg(ffmpeg, args, `normalize ${shot.id}`);

      const normProbe = probeMedia(ffmpeg, normPath);
      actualDurations.push(normProbe.duration || effectiveDur);
      normFiles.push(normPath);
    }

    if (!normFiles.length) {
      throw new Error('No generated shot clips found to assemble.');
    }

    const concatTxt = join(tmpDir, 'concat.txt');
    writeFileSync(
      concatTxt,
      normFiles.map(f => `file '${f.replace(/'/g, "'\\''")}'`).join('\n') + '\n'
    );
    const joinedPath = join(tmpDir, 'joined.mp4');
    runFfmpeg(ffmpeg, [
      '-y', '-loglevel', 'error',
      '-f', 'concat', '-safe', '0', '-i', concatTxt,
      '-c', 'copy',
      joinedPath,
    ], 'concat clips');

    mkdirSync(dirname(outputPath), { recursive: true });
    const srtContent = generateSrtFromStoryboard(assembledShots, actualDurations);
    const finalSrtPath = srtPath || outputPath.replace(/\.mp4$/i, '.srt');
    const hasSubtitles = Boolean(srtContent.trim());
    if (hasSubtitles) {
      mkdirSync(dirname(finalSrtPath), { recursive: true });
      writeFileSync(finalSrtPath, srtContent);
    }

    if (overlays === 'subtitles' && hasSubtitles) {
      if (subtitlesMode === 'soft') {
        runFfmpeg(ffmpeg, [
          '-y', '-loglevel', 'error',
          '-i', joinedPath,
          '-i', finalSrtPath,
          '-c:v', 'copy', '-c:a', 'copy', '-c:s', 'mov_text',
          '-metadata:s:s:0', 'language=eng',
          '-movflags', '+faststart',
          outputPath,
        ], 'mux soft subtitles');
      } else {
        const escaped = escapeFfmpegFilterPath(finalSrtPath);
        const fontSize = dims.aspect === '9:16' ? 18 : 22;
        const style = `FontName=Arial,FontSize=${fontSize},Bold=1,PrimaryColour=&H00FFFFFF,OutlineColour=&H0030253B,BackColour=&H70000000,BorderStyle=1,Outline=2,Shadow=1,MarginV=28`;
        runFfmpeg(ffmpeg, [
          '-y', '-loglevel', 'error',
          '-i', joinedPath,
          '-vf', `subtitles='${escaped}':force_style='${style}'`,
          '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p',
          '-c:a', 'copy',
          '-movflags', '+faststart',
          outputPath,
        ], 'burn subtitles');
      }
    } else {
      copyFileSync(joinedPath, outputPath);
    }

    const finalProbe = probeMedia(ffmpeg, outputPath);
    if (!quiet) {
      console.log(`✔ Assembled ${relative(ROOT, outputPath)} (${assembledShots.length} shots, ${(finalProbe.duration || 0).toFixed(1)}s${hasSubtitles ? `, subtitles: ${overlays === 'subtitles' ? subtitlesMode : 'srt saved'}` : ''})`);
    }
    return {
      outputPath,
      srtPath: hasSubtitles ? finalSrtPath : null,
      shotCount: assembledShots.length,
      durationSeconds: finalProbe.duration || actualDurations.reduce((a, b) => a + b, 0),
    };
  } finally {
    rmSync(tmpDir, { recursive: true, force: true });
  }
}

function loadIndex(indexPath) {
  if (!existsSync(indexPath)) return { updatedAt: new Date().toISOString(), shots: {} };
  return JSON.parse(readFileSync(indexPath, 'utf8'));
}

function saveIndex(indexPath, index) {
  index.updatedAt = new Date().toISOString();
  mkdirSync(dirname(indexPath), { recursive: true });
  writeFileSync(indexPath, JSON.stringify(index, null, 2));
}

function matchShotFilter(shot, shotArg) {
  if (shotArg == null) return true;
  const s = String(shotArg).trim();
  return shot.id === s || String(shot.index) === s || shot.id === `shot-${s.padStart(2, '0')}`;
}

export async function comicToVideo(comicId, opts = {}) {
  loadDotEnv();
  if (!REGISTRY.comics?.includes(comicId)) {
    throw new Error(`Unknown comic "${comicId}". Registered comics: ${(REGISTRY.comics || []).join(', ') || '(none)'}`);
  }

  const bookId = REGISTRY.comicBook[comicId];
  const bookMeta = BOOKS[bookId];
  const dirAbs = resolve(ROOT, comicDir(comicId));
  const videoDir = join(dirAbs, 'video');
  const takesDir = join(videoDir, 'takes');
  const clipsDir = join(videoDir, 'clips');
  const outDir = join(dirAbs, 'out');
  const storyboardPath = join(videoDir, 'storyboard.json');
  const indexPath = join(videoDir, 'index.json');

  // 1. Handle --approve without touching Chrome or Veo
  if (opts.approve) {
    if (!opts.shot) throw new Error('--approve requires --shot=<id|number>');
    const index = loadIndex(indexPath);
    const shotKey = Object.keys(index.shots || {}).find(k =>
      k === String(opts.shot) || k === `shot-${String(opts.shot).padStart(2, '0')}`
    );
    if (!shotKey) throw new Error(`No takes recorded for shot "${opts.shot}"`);
    const bucket = index.shots[shotKey];
    const take = (bucket.takes || []).find(t => t.id === opts.approve || t.hash === opts.approve);
    if (!take) {
      throw new Error(`Take "${opts.approve}" not found for ${shotKey}. Available: ${(bucket.takes || []).map(t => t.id).join(', ') || '(none)'}`);
    }
    const takeAbs = join(dirAbs, take.video);
    if (!existsSync(takeAbs)) throw new Error(`Take file missing on disk: ${takeAbs}`);
    mkdirSync(clipsDir, { recursive: true });
    const activeRel = `video/clips/${shotKey}.mp4`;
    copyFileSync(takeAbs, join(dirAbs, activeRel));
    bucket.active = take.id;
    bucket.clip = activeRel;
    saveIndex(indexPath, index);
    if (!opts.quiet) console.log(`✔ Approved ${shotKey} take "${take.id}" → ${activeRel}`);
    return { ok: true, approved: take.id, shot: shotKey, clip: activeRel };
  }

  const aspect = opts.aspect || '16:9';
  const resolution = opts.resolution || (opts.quality ? '1080p' : '720p');
  const framing = opts.framing || 'recompose';
  const audio = opts.audio || 'veo';
  const overlays = opts.overlays || 'subtitles';
  const subtitlesMode = opts.subtitles || 'burn';
  const model = opts.model || DEFAULT_VIDEO_MODEL;

  // 2. Handle --assemble-only directly from existing storyboard + clips
  if (opts.assembleOnly) {
    if (!existsSync(storyboardPath)) {
      throw new Error(`No storyboard found at ${relative(ROOT, storyboardPath)}. Run --plan first.`);
    }
    const storyboard = JSON.parse(readFileSync(storyboardPath, 'utf8'));
    const clipMap = {};
    for (const shot of storyboard.shots) {
      if (opts.page != null && shot.pageNumber !== Number(opts.page)) continue;
      const p = join(clipsDir, `${shot.id}.mp4`);
      if (existsSync(p)) clipMap[shot.id] = p;
    }
    const outName = opts.page != null ? `video_page-${String(opts.page).padStart(2, '0')}.mp4` : 'video.mp4';
    const assembled = await assembleComicVideo({
      storyboard,
      comicDirAbs: dirAbs,
      clipPathsByShotId: clipMap,
      outputPath: join(outDir, outName),
      overlays,
      subtitlesMode,
      quiet: !!opts.quiet,
    });
    return { ok: true, assembled };
  }

  // 3. Export clean Studio JS video frames (+ contact sheet, + optional lettering overlays)
  const wantOverlaysRender = overlays === 'lettering';
  const built = await buildComic(comicId, {
    page: opts.page,
    videoFrames: true,
    overlays: wantOverlaysRender,
    contactSheet: true,
    renderPages: false,
    panels: false,
    pdf: false,
    aspect,
    resolution,
    framing,
    quiet: !!opts.quiet,
    chrome: opts.chrome,
  });

  const framePathsByKey = Object.fromEntries(built.rendered.videoFrames.map(f => [f.key, f.path]));
  const overlayPathsByKey = Object.fromEntries(built.rendered.overlays.map(o => [o.key, o.path]));

  // 4. Load existing curated storyboard.json (unless --plan or --rebuild-plan or missing)
  let storyboard;
  const shouldRebuildPlan = opts.plan || opts.rebuildPlan || !existsSync(storyboardPath);
  if (shouldRebuildPlan) {
    storyboard = buildStoryboard({
      comicInfo: built.info,
      bookMeta,
      comicDirAbs: dirAbs,
      framePathsByKey,
      overlayPathsByKey,
      opts: { aspect, resolution, framing, audio, overlays, page: opts.page, interpolate: opts.interpolate },
    });
    if (opts.enrichPrompts) {
      const apiKey = process.env.GEMINI_API_KEY;
      const readmePath = join(dirAbs, 'README.md');
      const readmeText = existsSync(readmePath) ? readFileSync(readmePath, 'utf8') : '';
      if (!opts.quiet) console.log('✦ Enriching storyboard motion prompts with Gemini…');
      await enrichStoryboardPrompts({ storyboard, readmeText, apiKey });
    }
    mkdirSync(videoDir, { recursive: true });
    writeFileSync(storyboardPath, JSON.stringify(storyboard, null, 2));
    if (!opts.quiet) {
      console.log(`✔ Wrote ${relative(ROOT, storyboardPath)} (${storyboard.totalPanels} panels → ${storyboard.totalShots} shots, ~${storyboard.estimatedDurationSeconds}s)`);
    }
  } else {
    storyboard = JSON.parse(readFileSync(storyboardPath, 'utf8'));
    if (opts.aspect) storyboard.aspect = aspect;
    if (opts.resolution) storyboard.resolution = resolution;
    if (opts.overlays) storyboard.overlays = overlays;
    if (opts.audio) storyboard.audio = audio;
  }

  if (opts.plan) {
    return {
      ok: true,
      planOnly: true,
      storyboardPath,
      contactSheet: built.rendered.contactSheet,
      storyboard,
    };
  }

  // 5. Filter target shots
  const targetShots = storyboard.shots.filter(s => {
    if (opts.page != null && s.pageNumber !== Number(opts.page)) return false;
    if (!matchShotFilter(s, opts.shot)) return false;
    return true;
  });
  if (!targetShots.length) {
    throw new Error(`No matching shots found in storyboard (page=${opts.page ?? 'all'}, shot=${opts.shot ?? 'all'}).`);
  }

  const index = loadIndex(indexPath);
  const dryReport = [];
  let generated = 0;
  let cached = 0;
  let resumed = 0;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!opts.dryRun && !apiKey) {
    throw new Error('GEMINI_API_KEY is not set (export GEMINI_API_KEY=... or add it to .env)');
  }

  for (const shot of targetShots) {
    const firstAbs = join(dirAbs, shot.firstFrame);
    const lastAbs = shot.mode === 'interpolate' && shot.lastFrame ? join(dirAbs, shot.lastFrame) : null;
    const effDuration = resolveVeoDuration(shot.durationSeconds, {
      hasLastFrame: Boolean(lastAbs),
      resolution: storyboard.resolution || resolution,
      model,
    });
    const effAspect = storyboard.aspect || aspect;
    const effRes = storyboard.resolution || resolution;

    const hash = computeShotHash({
      model,
      prompt: shot.prompt,
      aspectRatio: effAspect,
      resolution: effRes,
      durationSeconds: effDuration,
      firstFramePath: firstAbs,
      lastFramePath: lastAbs,
    });
    const hash8 = hash.slice(0, 8);
    const bucket = (index.shots[shot.id] ??= { active: null, clip: null, pending: null, takes: [] });
    const existing = (bucket.takes || []).find(t => t.hash === hash && existsSync(join(dirAbs, t.video)));
    const hasPending = Boolean(bucket.pending?.hash === hash && bucket.pending?.operationName);

    if (opts.dryRun) {
      dryReport.push({
        id: shot.id,
        pageId: shot.pageId,
        mode: shot.mode,
        panels: shot.panels,
        model,
        api: isVeoModel(model) ? 'predictLongRunning' : 'interactions',
        aspectRatio: effAspect,
        resolution: effRes,
        durationSeconds: effDuration,
        chainedFromPrev: shot.chainedFromPrev,
        firstFrame: shot.firstFrame,
        lastFrame: shot.lastFrame,
        hash,
        cached: Boolean(existing),
        resumablePending: hasPending,
        subtitlesCount: (shot.subtitles || []).length,
        promptPreview: shot.prompt.slice(0, 320),
      });
      continue;
    }

    mkdirSync(takesDir, { recursive: true });
    mkdirSync(clipsDir, { recursive: true });
    const activeRel = `video/clips/${shot.id}.mp4`;

    if (!opts.force && existing) {
      copyFileSync(join(dirAbs, existing.video), join(dirAbs, activeRel));
      bucket.active = existing.id;
      bucket.clip = activeRel;
      bucket.pending = null;
      saveIndex(indexPath, index);
      cached++;
      if (!opts.quiet) console.log(`↷ Cache hit for ${shot.id} (${existing.id}, ${hash8})`);
      continue;
    }

    const takeNum = (bucket.takes?.length || 0) + 1;
    const takeId = `v${takeNum}`;
    const takeRel = `video/takes/${shot.id}_${hash8}.mp4`;
    const takeAbs = join(dirAbs, takeRel);
    let bytes = 0;

    if (isVeoModel(model)) {
      let operationName;
      if (!opts.force && hasPending) {
        operationName = bucket.pending.operationName;
        resumed++;
        if (!opts.quiet) console.log(`↻ Resuming pending Veo operation for ${shot.id}: ${operationName}`);
      } else {
        const payload = buildVeoRequestPayload({
          prompt: shot.prompt,
          firstFramePath: firstAbs,
          lastFramePath: lastAbs,
          aspectRatio: effAspect,
          resolution: effRes,
          durationSeconds: effDuration,
        });
        if (!opts.quiet) {
          console.log(`✦ Generating ${comicId}/${shot.id} (${shot.mode}, ${model}, ${effAspect} ${effRes} ${effDuration}s)…`);
        }
        operationName = await startVeoOperation({ apiKey, model, payload });
        bucket.pending = {
          operationName,
          api: 'predictLongRunning',
          hash,
          model,
          aspectRatio: effAspect,
          resolution: effRes,
          durationSeconds: effDuration,
          startedAt: new Date().toISOString(),
        };
        saveIndex(indexPath, index);
      }

      const { uri } = await pollVeoOperation({
        apiKey,
        operationName,
        pollIntervalSec: opts.pollInterval || 12,
      });
      bytes = await downloadVeoVideo({ apiKey, uri, destPath: takeAbs });
    } else {
      // Gemini Omni Flash via Interactions API (/v1beta/interactions)
      let interactionId;
      if (!opts.force && hasPending) {
        interactionId = bucket.pending.operationName;
        resumed++;
        if (!opts.quiet) console.log(`↻ Resuming pending Gemini Omni interaction for ${shot.id}: ${interactionId}`);
      } else {
        const payload = buildInteractionsRequestPayload({
          model,
          prompt: shot.prompt,
          firstFramePath: firstAbs,
          lastFramePath: lastAbs,
          aspectRatio: effAspect,
          resolution: effRes,
          durationSeconds: effDuration,
        });
        if (!opts.quiet) {
          console.log(`✦ Generating ${comicId}/${shot.id} (${shot.mode}, ${model}, ${effAspect} ${effRes} ${effDuration}s)…`);
        }
        const created = await startInteraction({ apiKey, payload });
        interactionId = created.id;
        bucket.pending = {
          operationName: interactionId,
          api: 'interactions',
          hash,
          model,
          aspectRatio: effAspect,
          resolution: effRes,
          durationSeconds: effDuration,
          startedAt: new Date().toISOString(),
        };
        saveIndex(indexPath, index);
      }

      try {
        const { media } = await pollInteraction({
          apiKey,
          interactionId,
          pollIntervalSec: opts.pollInterval || 10,
        });
        if (media.data) {
          const buf = Buffer.from(media.data, 'base64');
          mkdirSync(dirname(takeAbs), { recursive: true });
          writeFileSync(takeAbs, buf);
          bytes = buf.length;
        } else if (media.uri) {
          bytes = await downloadVeoVideo({ apiKey, uri: media.uri, destPath: takeAbs });
        } else {
          throw new Error('Interaction video payload missing both data and uri.');
        }
      } catch (err) {
        // Clear pending if server marked interaction failed/cancelled so retries submit fresh
        if (/Video generation (failed|cancelled)/i.test(err.message)) {
          bucket.pending = null;
          saveIndex(indexPath, index);
        }
        throw err;
      }
    }

    copyFileSync(takeAbs, join(dirAbs, activeRel));

    bucket.takes = [...(bucket.takes || []), {
      id: takeId,
      video: takeRel,
      hash,
      model,
      aspectRatio: effAspect,
      resolution: effRes,
      durationSeconds: effDuration,
      bytes,
      createdAt: new Date().toISOString(),
    }];
    bucket.active = takeId;
    bucket.clip = activeRel;
    bucket.pending = null;
    saveIndex(indexPath, index);
    generated++;
    if (!opts.quiet) console.log(`✔ Wrote ${activeRel} (take ${takeId}, ${(bytes / 1048576).toFixed(2)} MB)`);
  }

  if (opts.dryRun) {
    const summary = {
      comicId,
      model,
      aspect: storyboard.aspect,
      resolution: storyboard.resolution,
      framing: storyboard.framing,
      audio: storyboard.audio,
      overlays: storyboard.overlays,
      subtitlesMode,
      contactSheet: built.rendered.contactSheet ? relative(ROOT, built.rendered.contactSheet) : null,
      storyboard: relative(ROOT, storyboardPath),
      totalTargetShots: dryReport.length,
      estimatedDurationSeconds: dryReport.reduce((sum, s) => sum + s.durationSeconds, 0),
      shots: dryReport,
    };
    if (!opts.quiet) console.log(JSON.stringify(summary, null, 2));
    return { ok: true, dryRun: true, ...summary };
  }

  // 6. Assemble available approved clips into final MP4 (skip auto-assembly if user only requested a single shot unless --assemble passed)
  let assembled = null;
  const shouldAssemble = opts.assemble !== false && (opts.shot == null || opts.assemble === true);
  if (shouldAssemble) {
    const clipMap = {};
    for (const shot of storyboard.shots) {
      if (opts.page != null && shot.pageNumber !== Number(opts.page)) continue;
      const p = join(clipsDir, `${shot.id}.mp4`);
      if (existsSync(p)) clipMap[shot.id] = p;
    }
    if (Object.keys(clipMap).length) {
      const outName = opts.page != null ? `video_page-${String(opts.page).padStart(2, '0')}.mp4` : 'video.mp4';
      assembled = await assembleComicVideo({
        storyboard,
        comicDirAbs: dirAbs,
        clipPathsByShotId: clipMap,
        outputPath: join(outDir, outName),
        overlays: storyboard.overlays || overlays,
        subtitlesMode,
        quiet: !!opts.quiet,
      });
    }
  }

  return { ok: true, generated, cached, resumed, assembled };
}

// ---------- CLI entry ----------
const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const argv = process.argv.slice(2);
  const comicId = argv.find(a => !a.startsWith('--'));
  if (!comicId || argv.includes('--help') || argv.includes('-h')) {
    console.log('Usage: npm run comic:video -- <comic_id> [options]');
    console.log('Options:');
    console.log('  --plan                      Export clean Studio frames + contact sheet + video/storyboard.json (no API cost)');
    console.log('  --dry-run                   Inspect Veo 3.1 shot payloads, hashes & estimated duration (no API cost)');
    console.log('  --page=<n>                  Process only page <n>');
    console.log('  --shot=<n|shot-01>          Process or approve a single shot');
    console.log('  --aspect=16:9|9:16          Target video aspect ratio (default: 16:9)');
    console.log('  --resolution=720p|1080p     Target resolution (default: 720p)');
    console.log('  --framing=recompose|pad|crop Panel framing mode (default: recompose)');
    console.log('  --audio=veo|mute            Audio mode (default: veo native audio)');
    console.log('  --overlays=subtitles|none|lettering Text overlay mode (default: subtitles)');
    console.log('  --subtitles=burn|soft       Subtitle rendering mode when --overlays=subtitles (default: burn)');
    console.log('  --quality                   Render at 1080p (default: 720p)');
    console.log(`  --model=<model_id>          Video model override (default: ${DEFAULT_VIDEO_MODEL}; veo-* routes to :predictLongRunning)`);
    console.log('  --no-interpolate            Generate single-panel clips instead of image+lastFrame transitions');
    console.log('  --enrich-prompts            Refine storyboard prompts with Gemini Flash (during --plan)');
    console.log('  --force                     Bypass SHA-1 take cache and re-generate');
    console.log('  --approve=<take_id>         Promote a cached take to active clip (requires --shot=...)');
    console.log('  --assemble-only             Stitch existing approved clips into out/video.mp4');
    console.log('Registered comics:', (REGISTRY.comics || []).join(', ') || '(none)');
    process.exit(comicId ? 0 : 1);
  }
  const flag = name => {
    const pref = `--${name}=`;
    const hit = argv.find(a => a.startsWith(pref));
    return hit ? hit.slice(pref.length) : undefined;
  };
  const opts = {
    plan: argv.includes('--plan'),
    rebuildPlan: argv.includes('--rebuild-plan'),
    dryRun: argv.includes('--dry-run'),
    assembleOnly: argv.includes('--assemble-only'),
    assemble: argv.includes('--no-assemble') ? false : (argv.includes('--assemble') ? true : undefined),
    page: flag('page') != null ? Number(flag('page')) : undefined,
    shot: flag('shot'),
    aspect: flag('aspect'),
    resolution: flag('resolution'),
    framing: flag('framing'),
    audio: flag('audio'),
    overlays: flag('overlays'),
    subtitles: flag('subtitles'),
    quality: argv.includes('--quality'),
    model: flag('model'),
    interpolate: argv.includes('--no-interpolate') ? false : undefined,
    enrichPrompts: argv.includes('--enrich-prompts'),
    force: argv.includes('--force'),
    approve: flag('approve'),
    pollInterval: flag('poll-interval') != null ? Number(flag('poll-interval')) : undefined,
    chrome: flag('chrome'),
  };
  try {
    await comicToVideo(comicId, opts);
  } catch (err) {
    console.error(`✖ ${err.message}`);
    process.exit(1);
  }
}
