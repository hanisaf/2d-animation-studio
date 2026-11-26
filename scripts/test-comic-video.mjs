#!/usr/bin/env node
// scripts/test-comic-video.mjs
// Offline automated test suite (zero Veo API cost) verifying the general Comic-to-Video workflow:
// - Phase 1: 16:9 & 9:16 Studio frame export dimensions, framing modes, transparent overlays, and contact sheets
// - Phase 2: Auto-storyboard grouping (cut detection vs. same-location interpolation), 2D style lock, castBible routing, SRT timing
// - Phase 3: Veo 3.1 REST payload schema (lastFrame inside instances[0], duration clamping), SHA-1 caching, pending resume metadata
// - Phase 4: Real ffmpeg normalization, chained boundary-frame trimming, burned subtitles, soft subtitles, and lettering overlay compositing

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildComic, videoDimensions } from './build_comic.mjs';
import {
  STYLE_LOCK_2D,
  canInterpolatePair,
  generateSrtFromStoryboard,
  inferSceneGroup,
} from './comic_video_plan.mjs';
import {
  DEFAULT_VIDEO_MODEL,
  DEFAULT_VEO_MODEL_FAST,
  assembleComicVideo,
  buildInteractionsRequestPayload,
  buildVeoRequestPayload,
  comicToVideo,
  computeShotHash,
  extractVideoFromInteraction,
  extractVideoUriFromOperation,
  probeMedia,
  resolveFfmpeg,
  resolveVeoDuration,
} from './comic_to_video.mjs';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));

function readPngDimensions(filePath) {
  const buf = readFileSync(filePath);
  assert.equal(buf.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', `valid PNG header: ${filePath}`);
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

// 1. Dimension helper & Veo duration guardrails
assert.deepEqual(videoDimensions('16:9', '720p'), { width: 1280, height: 720, aspect: '16:9', resolution: '720p' });
assert.deepEqual(videoDimensions('16:9', '1080p'), { width: 1920, height: 1080, aspect: '16:9', resolution: '1080p' });
assert.deepEqual(videoDimensions('9:16', '720p'), { width: 720, height: 1280, aspect: '9:16', resolution: '720p' });
assert.equal(resolveVeoDuration(4, { hasLastFrame: false, resolution: '720p', model: DEFAULT_VEO_MODEL_FAST }), 4);
assert.equal(resolveVeoDuration(6, { hasLastFrame: false, resolution: '720p', model: DEFAULT_VEO_MODEL_FAST }), 6);
assert.equal(resolveVeoDuration(4, { hasLastFrame: true, resolution: '720p', model: DEFAULT_VEO_MODEL_FAST }), 8, 'Veo lastFrame forces 8s');
assert.equal(resolveVeoDuration(4, { hasLastFrame: false, resolution: '1080p', model: DEFAULT_VEO_MODEL_FAST }), 8, 'Veo 1080p forces 8s');
assert.equal(resolveVeoDuration(12, { hasLastFrame: false, resolution: '720p', model: DEFAULT_VIDEO_MODEL }), 12, 'Gemini Omni allows up to 15s');
assert.equal(resolveVeoDuration(12, { hasLastFrame: true, resolution: '720p', model: DEFAULT_VIDEO_MODEL }), 10, 'Gemini Omni clamps interpolation to 10s');
console.log('✔ Dimension helpers and Veo 3.1 duration rules passed');

// 2. Scene grouping & interpolation cut detection unit checks
assert.equal(inferSceneGroup({ id: 'p2_asleep', location: 'bedroom_night' }), 'bedroom');
assert.equal(inferSceneGroup({ id: 'p2_yawn', location: 'bedroom_day' }), 'bedroom');
assert.equal(
  canInterpolatePair(
    { id: 'p2_asleep', location: 'bedroom_night', cast: ['eve'] },
    { id: 'p2_yawn', location: 'bedroom_day', cast: ['eve'] }
  ),
  true,
  'night->day in same bedroom with same cast can interpolate'
);
assert.equal(
  canInterpolatePair(
    { id: 'p2_intro', location: 'bedroom_day', cast: ['eve'] },
    { id: 'p2_whats_for_breakfast', location: 'kitchen', cast: ['eve', 'eve_dad'] }
  ),
  false,
  'bedroom->kitchen must be a hard cut'
);
assert.equal(
  canInterpolatePair(
    { id: 'p1_bio_eve', location: null, cast: ['eve'] },
    { id: 'p1_bio_zelie', location: null, cast: ['zelie'] }
  ),
  false,
  'bio cards must never interpolate'
);
console.log('✔ Storyboard grouping and cut-detection heuristics passed');

// 3. Phase 1: Export 16:9 Studio video frames + transparent overlays + contact sheet on ice_skating
const iceBuilt16 = await buildComic('ice_skating', {
  page: 1,
  videoFrames: true,
  overlays: true,
  contactSheet: true,
  aspect: '16:9',
  resolution: '720p',
  framing: 'recompose',
  quiet: true,
});
assert.equal(iceBuilt16.rendered.videoFrames.length, 9, 'ice_skating page 1 has 9 panels');
assert.equal(iceBuilt16.rendered.overlays.length, 9, 'ice_skating page 1 renders 9 transparent overlays');
assert.ok(iceBuilt16.rendered.contactSheet && existsSync(iceBuilt16.rendered.contactSheet), 'contact sheet written');
for (const f of iceBuilt16.rendered.videoFrames) {
  assert.ok(statSync(f.path).size > 4000, `non-empty video frame: ${f.path}`);
  const dims = readPngDimensions(f.path);
  assert.deepEqual(dims, { width: 1280, height: 720 }, `16:9 frame dimensions for ${f.key}`);
}
for (const ov of iceBuilt16.rendered.overlays) {
  const dims = readPngDimensions(ov.path);
  assert.deepEqual(dims, { width: 1280, height: 720 }, `16:9 overlay dimensions for ${ov.key}`);
}

// Also verify 9:16 portrait export + 'pad' framing on a single panel
const iceBuilt916 = await buildComic('ice_skating', {
  page: 1,
  panel: 1,
  videoFrames: true,
  contactSheet: false,
  aspect: '9:16',
  resolution: '720p',
  framing: 'pad',
  quiet: true,
});
assert.equal(iceBuilt916.rendered.videoFrames.length, 1);
assert.deepEqual(
  readPngDimensions(iceBuilt916.rendered.videoFrames[0].path),
  { width: 720, height: 1280 },
  '9:16 pad frame dimensions'
);
console.log('✔ Phase 1 Studio frame export (16:9 recompose, 9:16 pad, overlays, contact sheet) passed');

// 4. Phase 2 & 3: --plan & --dry-run on BOTH existing comics (ice_skating + the_adventure Page 2)
const icePlan = await comicToVideo('ice_skating', { plan: true, aspect: '16:9', resolution: '720p', quiet: true });
assert.equal(icePlan.ok, true);
assert.ok(existsSync(icePlan.storyboardPath), 'ice_skating storyboard.json written');
assert.ok(existsSync(icePlan.contactSheet), 'ice_skating contact sheet written');
assert.ok(icePlan.storyboard.totalShots >= 3 && icePlan.storyboard.totalShots <= 11);

const iceDry = await comicToVideo('ice_skating', { dryRun: true, quiet: true });
assert.equal(iceDry.ok, true);
assert.equal(iceDry.model, DEFAULT_VIDEO_MODEL);
assert.equal(iceDry.shots.length, icePlan.storyboard.totalShots);
assert.ok(iceDry.shots.every(s => s.promptPreview.includes('2D hand-drawn cartoon animation')));

const advPlan = await comicToVideo('the_adventure', { plan: true, page: 2, aspect: '16:9', resolution: '720p', quiet: true });
assert.equal(advPlan.ok, true);
assert.equal(advPlan.storyboard.totalPanels, 9, 'the_adventure page 2 has 9 panels');
assert.ok(
  advPlan.storyboard.shots.some(s => s.mode === 'interpolate' && s.panels.includes('p2_asleep') && s.panels.includes('p2_yawn')),
  'Page 2 chains bedroom wake-up panels into an interpolate shot'
);
assert.ok(
  advPlan.storyboard.shots.some(s => s.mode === 'single' && s.panels[0] === 'p2_dash'),
  'Page 2 isolates hallway dash as a hard-cut single shot'
);
assert.ok(
  advPlan.storyboard.shots.some(s => s.prompt.includes('Eve Earth') && s.prompt.includes(STYLE_LOCK_2D)),
  'Prompts include 2D style lock and castBible character locks'
);
console.log(`✔ Phase 2 planning & dry-run passed (ice_skating: ${icePlan.storyboard.totalShots} shots; the_adventure p2: ${advPlan.storyboard.totalShots} shots)`);

// 5. Phase 3: Veo 3.1 REST payload schema, operation URI extraction, and SHA-1 hashing
const advDirAbs = join(ROOT, 'comics/palm_pals_adventures/the_adventure');
const interpShot = advPlan.storyboard.shots.find(s => s.mode === 'interpolate');
assert.ok(interpShot, 'found an interpolate shot on page 2');
const singleShot = advPlan.storyboard.shots.find(s => s.mode === 'single');
assert.ok(singleShot, 'found a single shot on page 2');

const interpPayload = buildVeoRequestPayload({
  prompt: interpShot.prompt,
  firstFramePath: join(advDirAbs, interpShot.firstFrame),
  lastFramePath: join(advDirAbs, interpShot.lastFrame),
  aspectRatio: '16:9',
  resolution: '720p',
  durationSeconds: 6,
});
assert.equal(interpPayload.instances.length, 1);
assert.equal(interpPayload.instances[0].image.mimeType, 'image/png');
assert.ok(interpPayload.instances[0].image.bytesBase64Encoded.length > 1000);
assert.equal(interpPayload.instances[0].lastFrame.mimeType, 'image/png', 'lastFrame lives inside instances[0]');
assert.equal('lastFrame' in interpPayload.parameters, false, 'lastFrame must NOT be in parameters');
assert.equal(interpPayload.parameters.durationSeconds, 8, 'interpolate forces 8s duration');
assert.equal(interpPayload.parameters.aspectRatio, '16:9');

const singlePayload = buildVeoRequestPayload({
  prompt: singleShot.prompt,
  firstFramePath: join(advDirAbs, singleShot.firstFrame),
  lastFramePath: null,
  aspectRatio: '16:9',
  resolution: '720p',
  durationSeconds: 4,
});
assert.equal('lastFrame' in singlePayload.instances[0], false, 'single shot omits lastFrame');
assert.equal(singlePayload.parameters.durationSeconds, 4);

const hashA = computeShotHash({
  model: DEFAULT_VEO_MODEL_FAST,
  prompt: interpShot.prompt,
  aspectRatio: '16:9',
  resolution: '720p',
  durationSeconds: 8,
  firstFramePath: join(advDirAbs, interpShot.firstFrame),
  lastFramePath: join(advDirAbs, interpShot.lastFrame),
});
const hashB = computeShotHash({
  model: DEFAULT_VEO_MODEL_FAST,
  prompt: interpShot.prompt + ' extra',
  aspectRatio: '16:9',
  resolution: '720p',
  durationSeconds: 8,
  firstFramePath: join(advDirAbs, interpShot.firstFrame),
  lastFramePath: join(advDirAbs, interpShot.lastFrame),
});
assert.equal(hashA.length, 12);
assert.notEqual(hashA, hashB, 'SHA-1 hash changes when prompt changes');

const omniInterpPayload = buildInteractionsRequestPayload({
  model: DEFAULT_VIDEO_MODEL,
  prompt: interpShot.prompt,
  firstFramePath: join(advDirAbs, interpShot.firstFrame),
  lastFramePath: join(advDirAbs, interpShot.lastFrame),
  aspectRatio: '16:9',
  resolution: '720p',
  durationSeconds: 8,
});
assert.equal(omniInterpPayload.model, DEFAULT_VIDEO_MODEL);
assert.equal(omniInterpPayload.background, true);
assert.equal(omniInterpPayload.input.length, 3, 'text + first image + last image');
assert.equal(omniInterpPayload.response_format.type, 'video');
assert.equal(omniInterpPayload.response_format.aspect_ratio, '16:9');
assert.equal(omniInterpPayload.response_format.duration, '8s');
assert.equal(omniInterpPayload.generation_config.video_config.task, 'image_to_video');
assert.deepEqual(
  extractVideoFromInteraction({
    steps: [{ type: 'model_output', content: [{ type: 'video', mime_type: 'video/mp4', data: 'AAAA' }] }],
  }),
  { data: 'AAAA', uri: null, mimeType: 'video/mp4' }
);

const sampleOp = {
  done: true,
  response: {
    generateVideoResponse: {
      generatedSamples: [{ video: { uri: 'https://generativelanguage.googleapis.com/v1beta/files/abc:download?alt=media' } }],
    },
  },
};
assert.equal(
  extractVideoUriFromOperation(sampleOp),
  'https://generativelanguage.googleapis.com/v1beta/files/abc:download?alt=media'
);
console.log('✔ Phase 3 Veo 3.1 REST payload schema, SHA-1 cache hashing, and operation parsing passed');

// 6. Phase 4: Real ffmpeg assembly test (chained frame trim, burned subtitles, soft subtitles, lettering overlay)
const ffmpeg = await resolveFfmpeg();
const tmpTestDir = join(ROOT, 'out', '.test-comic-video');
rmSync(tmpTestDir, { recursive: true, force: true });
mkdirSync(join(tmpTestDir, 'video', 'clips'), { recursive: true });
mkdirSync(join(tmpTestDir, 'out'), { recursive: true });

try {
  // Synthesize two tiny 1.5s clips (one with audio, one silent to test anullsrc injection)
  const clip1 = join(tmpTestDir, 'video', 'clips', 'shot-01.mp4');
  const clip2 = join(tmpTestDir, 'video', 'clips', 'shot-02.mp4');
  const mk1 = spawnSync(ffmpeg, [
    '-y', '-loglevel', 'error',
    '-f', 'lavfi', '-i', 'color=c=#7AC3EB:s=640x360:r=24:d=1.5',
    '-f', 'lavfi', '-i', 'sine=frequency=440:duration=1.5',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-c:a', 'aac', clip1,
  ], { encoding: 'utf8' });
  assert.equal(mk1.status, 0, `make clip1: ${mk1.stderr}`);
  const mk2 = spawnSync(ffmpeg, [
    '-y', '-loglevel', 'error',
    '-f', 'lavfi', '-i', 'color=c=#F682B0:s=1280x720:r=24:d=1.5',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', clip2,
  ], { encoding: 'utf8' });
  assert.equal(mk2.status, 0, `make clip2: ${mk2.stderr}`);

  const mockStoryboard = {
    aspect: '16:9',
    resolution: '720p',
    shots: [
      {
        id: 'shot-01',
        durationSeconds: 1.5,
        chainedFromPrev: false,
        overlay: null,
        subtitles: [{ kind: 'dialogue', speaker: 'Eve', text: 'Good morning!' }],
      },
      {
        id: 'shot-02',
        durationSeconds: 1.5,
        chainedFromPrev: true,
        overlay: null,
        subtitles: [{ kind: 'dialogue', speaker: 'Dad', text: 'Pancakes!' }],
      },
    ],
  };

  const srtPreview = generateSrtFromStoryboard(mockStoryboard.shots, [1.5, 1.416]);
  assert.ok(srtPreview.includes('Eve: Good morning!'));
  assert.ok(srtPreview.includes('Dad: Pancakes!'));

  // Test burned subtitles assembly
  const burnOut = join(tmpTestDir, 'out', 'burned.mp4');
  const burnRes = await assembleComicVideo({
    storyboard: mockStoryboard,
    comicDirAbs: tmpTestDir,
    clipPathsByShotId: { 'shot-01': clip1, 'shot-02': clip2 },
    outputPath: burnOut,
    overlays: 'subtitles',
    subtitlesMode: 'burn',
    quiet: true,
  });
  assert.ok(existsSync(burnOut) && statSync(burnOut).size > 5000, 'burned MP4 written');
  assert.ok(burnRes.srtPath && existsSync(burnRes.srtPath), 'SRT written alongside MP4');
  const burnProbe = probeMedia(ffmpeg, burnOut);
  assert.equal(burnProbe.hasAudio, true, 'assembled video has normalized audio track');
  assert.ok(burnProbe.duration > 2.5 && burnProbe.duration < 3.1, `chained trim duration ~2.9s (got ${burnProbe.duration})`);

  // Test soft subtitles assembly
  const softOut = join(tmpTestDir, 'out', 'soft.mp4');
  await assembleComicVideo({
    storyboard: mockStoryboard,
    comicDirAbs: tmpTestDir,
    clipPathsByShotId: { 'shot-01': clip1, 'shot-02': clip2 },
    outputPath: softOut,
    overlays: 'subtitles',
    subtitlesMode: 'soft',
    quiet: true,
  });
  assert.ok(existsSync(softOut) && statSync(softOut).size > 5000, 'soft-subtitle MP4 written');

  // Test transparent lettering overlay assembly using a real rendered overlay PNG from ice_skating
  const realOverlaySrc = iceBuilt16.rendered.overlays[0].path;
  mkdirSync(join(tmpTestDir, 'video', 'overlays'), { recursive: true });
  writeFileSync(join(tmpTestDir, 'video', 'overlays', 'ov1.png'), readFileSync(realOverlaySrc));
  mockStoryboard.shots[0].overlay = 'video/overlays/ov1.png';
  const letOut = join(tmpTestDir, 'out', 'lettering.mp4');
  await assembleComicVideo({
    storyboard: mockStoryboard,
    comicDirAbs: tmpTestDir,
    clipPathsByShotId: { 'shot-01': clip1, 'shot-02': clip2 },
    outputPath: letOut,
    overlays: 'lettering',
    quiet: true,
  });
  assert.ok(existsSync(letOut) && statSync(letOut).size > 5000, 'lettering-overlay MP4 written');
  console.log('✔ Phase 4 ffmpeg assembly (normalization, chained trim, burned & soft subtitles, lettering overlay) passed');
} finally {
  rmSync(tmpTestDir, { recursive: true, force: true });
}

console.log('ALL COMIC-TO-VIDEO TESTS PASSED!');
