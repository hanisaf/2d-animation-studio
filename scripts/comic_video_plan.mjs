// scripts/comic_video_plan.mjs
// Storyboard auto-planner, 2D Studio style-locked Veo 3.1 prompt builder,
// optional Gemini text prompt enrichment, and SRT subtitle generator.

import { relative } from 'node:path';

export const STYLE_LOCK_2D =
  '2D hand-drawn cartoon animation strictly preserving the exact flat-shaded vector art style, warm dark-brown ink outlines, pastel color palette, and character proportions of the provided Studio frame(s). ' +
  'Keep smooth 2D cel-animation motion with expressive squash-and-stretch. ' +
  'NEVER render as 3D CGI, claymation, or photorealistic live-action. ' +
  'NEVER draw speech bubbles, caption boxes, floating text, watermarks, or comic borders.';

const SCENE_KEYWORDS = [
  ['portal', /\b(portal|vortex|wormhole|dimension)\b/i],
  ['rink', /\b(ice\s*arena|ice\s*rink|skating\s*rink|glossy\s*ice|on\s+the\s+ice|ice\s+shavings|figure\s*skates?|star\s+jump|dip\s+trick)\b/i],
  ['mudroom', /\b(mud\s*room|mudroom|coat\s*hooks?)\b/i],
  ['doorway', /\b(doorway|front\s*door|entryway|porch)\b/i],
  ['hallway', /\b(hallway|corridor|stairs)\b/i],
  ['living_room', /\b(living\s*room|fireplace|at\s*home|oval\s+(?:pastel\s+)?rug|pastel\s+oval\s+rug)\b/i],
  ['kitchen', /\b(kitchen|stove|skillet|frying\s*pan|pancake|breakfast)\b/i],
  ['bedroom', /\b(bedroom|earth-themed\s*bed|asleep|nightstand)\b/i],
  ['forest', /\b(forest|woods|clearing)\b/i],
];

export function normalizeBaseLocation(loc) {
  if (!loc) return null;
  return String(loc)
    .toLowerCase()
    .trim()
    .replace(/_(night|day|morning|evening|dusk|dawn)$/, '');
}

export function inferSceneGroup(panel) {
  if (panel.location) return normalizeBaseLocation(panel.location);
  // Prefer explicit setting cues in panel id or scene captions before scanning prose prompts
  const primary = `${panel.id || ''} ${(panel.captions || []).join(' ')}`;
  for (const [group, re] of SCENE_KEYWORDS) {
    if (re.test(primary)) return group;
  }
  const prompt = String(panel.prompt || '');
  for (const [group, re] of SCENE_KEYWORDS) {
    if (re.test(prompt)) return group;
  }
  return null;
}

export function isTitleOrBioPanel(panel) {
  if (panel.video?.kind === 'title' || panel.video?.kind === 'bio') return true;
  if (/(^|[_-])(cover|title|bio|card|credits)([_-]|$)/i.test(String(panel.id || ''))) return true;
  return false;
}

export function sharesCast(castA = [], castB = []) {
  if (!castA.length || !castB.length) return true;
  const setA = new Set(castA);
  return castB.some(c => setA.has(c));
}

export function canInterpolatePair(a, b) {
  if (!a || !b) return false;
  if (a.video?.skip || b.video?.skip) return false;
  if (a.video?.mode === 'single' || b.video?.mode === 'single') return false;
  if (a.video?.cutAfter === true || b.video?.cut === true) return false;
  if (isTitleOrBioPanel(a) || isTitleOrBioPanel(b)) return false;

  const locA = inferSceneGroup(a);
  const locB = inferSceneGroup(b);
  if (locA && locB) {
    if (locA !== locB) return false;
  } else if (locA || locB) {
    // One panel has an explicit/inferred location and the other doesn't -> safer to cut
    return false;
  }

  return sharesCast(a.cast || [], b.cast || []);
}

function selectCastBible(bookMeta, castIds = []) {
  const bible = bookMeta?.castBible || {};
  const keys = Object.keys(bible);
  if (!keys.length) return [];
  const matched = [];
  const seen = new Set();
  for (const cid of castIds) {
    if (bible[cid] && !seen.has(cid)) {
      seen.add(cid);
      matched.push(bible[cid]);
    }
  }
  return matched.length ? matched : keys.map(k => bible[k]);
}

function extractSubtitles(panels) {
  const subs = [];
  const seen = new Set();
  for (const p of panels) {
    for (const c of p.captions || []) {
      const text = String(c).trim();
      if (!text) continue;
      const key = `caption:${text}`;
      if (!seen.has(key)) {
        seen.add(key);
        subs.push({ kind: 'caption', speaker: '', text });
      }
    }
    for (const b of p.bubbles || []) {
      const text = String(b.text || '').trim();
      if (!text) continue;
      const speaker = String(b.speaker || '').trim();
      const key = `dialogue:${speaker}:${text}`;
      if (!seen.has(key)) {
        seen.add(key);
        subs.push({ kind: 'dialogue', speaker, text });
      }
    }
  }
  return subs;
}

function extractSfx(panels) {
  const out = [];
  const seen = new Set();
  for (const p of panels) {
    for (const s of p.sfx || []) {
      const t = String(s).trim();
      if (t && !seen.has(t)) {
        seen.add(t);
        out.push(t);
      }
    }
  }
  return out;
}

export function buildVeoPrompt({
  mode,
  startPanel,
  endPanel = null,
  audioPanels = null,
  customMotion = '',
  bookMeta = null,
  audioMode = 'veo',
  castIds = [],
}) {
  const lines = [STYLE_LOCK_2D];

  const activePanels = audioPanels || (endPanel ? [startPanel, endPanel] : [startPanel]);
  const bibleEntries = selectCastBible(bookMeta, castIds);
  if (bibleEntries.length) {
    const charBits = bibleEntries.map(c => {
      const bits = [c.description].filter(Boolean);
      if (c.avoid?.length) bits.push(`Avoid: ${c.avoid.join('; ')}`);
      return `${c.name}: ${bits.join(' ')}`;
    });
    lines.push(`Characters: ${charBits.join(' | ')}`);
  }

  const invariants = (bookMeta?.invariants || []).slice(0, 4);
  if (invariants.length) {
    lines.push(`Visual rules: ${invariants.join(' ')}`);
  }

  const startDesc = (startPanel.prompt || `Comic beat "${startPanel.id}"`).trim();
  if (mode === 'interpolate' && endPanel) {
    const endDesc = (endPanel.prompt || `Comic beat "${endPanel.id}"`).trim();
    lines.push(
      `Animation: Smoothly animate the continuous 2D cartoon action from the starting frame to the ending frame. ` +
      `Start: ${startDesc} Transition fluidly into: ${endDesc}`
    );
  } else {
    lines.push(
      `Animation: Bring this 2D cartoon frame to life with expressive character acting, lively blinks, gestures, and gentle camera motion. ` +
      `Scene: ${startDesc}`
    );
  }

  if (customMotion) {
    lines.push(`Motion direction: ${customMotion.trim()}`);
  }

  const subs = extractSubtitles(activePanels);
  const sfx = extractSfx(activePanels);

  if (audioMode === 'veo') {
    const audioParts = [];
    const dialogue = subs.filter(s => s.kind === 'dialogue');
    const captions = subs.filter(s => s.kind === 'caption');
    if (dialogue.length) {
      const spoken = dialogue
        .map(d => (d.speaker ? `${d.speaker} says "${d.text}"` : `"${d.text}"`))
        .join(' Then ');
      audioParts.push(`Spoken cartoon dialogue with matching lip movement: ${spoken}.`);
    } else if (captions.length) {
      audioParts.push(`Warm friendly cartoon narrator says: "${captions.map(c => c.text).join(' ')}"`);
    }
    if (sfx.length) {
      audioParts.push(`Cartoon sound effects: ${sfx.join(', ')}.`);
    }
    if (!audioParts.length) {
      audioParts.push('Light playful cartoon foley and cozy ambient sound.');
    }
    lines.push(`Audio: ${audioParts.join(' ')}`);
  } else {
    lines.push('Audio: Silent / subtle ambient motion only, no spoken words or voiceover.');
  }

  return lines.join('\n');
}

function defaultSingleDuration(panel) {
  const explicit = panel.video?.durationSeconds ?? panel.video?.duration;
  if ([4, 6, 8].includes(explicit)) return explicit;
  const wordCount = [
    ...(panel.captions || []),
    ...(panel.bubbles || []).map(b => b.text || ''),
  ].join(' ').trim().split(/\s+/).filter(Boolean).length;
  if (isTitleOrBioPanel(panel) && wordCount <= 10) return 4;
  if (wordCount <= 6) return 4;
  if (wordCount <= 16) return 6;
  return 8;
}

export function buildStoryboard({
  comicInfo,
  bookMeta = null,
  comicDirAbs,
  framePathsByKey = {},
  overlayPathsByKey = {},
  opts = {},
}) {
  const aspect = opts.aspect || comicInfo.video?.aspect || '16:9';
  const resolution = opts.resolution || comicInfo.video?.resolution || '720p';
  const framing = opts.framing || comicInfo.video?.framing || 'recompose';
  const audio = opts.audio || comicInfo.video?.audio || 'veo';
  const overlays = opts.overlays || comicInfo.video?.overlays || 'subtitles';
  const pageFilter = opts.page != null ? Number(opts.page) : null;
  const noInterpolate = opts.interpolate === false;

  // Flatten ordered panels (respecting optional page filter and panel.video.skip)
  const flatPanels = [];
  for (let pIdx = 0; pIdx < comicInfo.pages.length; pIdx++) {
    if (pageFilter != null && pIdx + 1 !== pageFilter) continue;
    const pageObj = comicInfo.pages[pIdx];
    const pageId = pageObj.layout.pageId;
    if (pageObj.script.video?.skip) continue;
    for (const panelScript of pageObj.script.panels) {
      if (panelScript.video?.skip) continue;
      const key = `${pageId}_${panelScript.id}`;
      const cast = panelScript.cast?.length
        ? panelScript.cast
        : (pageObj.script.cast?.length ? pageObj.script.cast : (comicInfo.cast || []));
      const location = panelScript.location || pageObj.script.location || null;
      flatPanels.push({
        ...panelScript,
        pageIndex: pIdx,
        pageNumber: pIdx + 1,
        pageId,
        key,
        cast,
        location,
        sceneGroup: inferSceneGroup({ ...panelScript, location }),
      });
    }
  }

  // Group into continuous runs of panels that can interpolate
  const runs = [];
  for (const panel of flatPanels) {
    const curRun = runs[runs.length - 1];
    if (!noInterpolate && curRun && canInterpolatePair(curRun[curRun.length - 1], panel)) {
      curRun.push(panel);
    } else {
      runs.push([panel]);
    }
  }

  const toRel = absPath => (absPath && comicDirAbs ? relative(comicDirAbs, absPath).replace(/\\/g, '/') : absPath || null);

  const shots = [];
  let shotIndex = 0;

  for (const run of runs) {
    if (run.length === 1) {
      const p = run[0];
      shotIndex++;
      const durationSeconds = resolution === '1080p' ? 8 : defaultSingleDuration(p);
      const prompt = buildVeoPrompt({
        mode: 'single',
        startPanel: p,
        customMotion: p.video?.motion || '',
        bookMeta,
        audioMode: audio,
        castIds: p.cast,
      });
      shots.push({
        id: `shot-${String(shotIndex).padStart(2, '0')}`,
        index: shotIndex,
        pageNumber: p.pageNumber,
        pageId: p.pageId,
        mode: 'single',
        durationSeconds,
        chainedFromPrev: false,
        panels: [p.id],
        panelKeys: [p.key],
        firstFrame: toRel(framePathsByKey[p.key]) || `video/frames/${p.key}.png`,
        lastFrame: null,
        overlay: toRel(overlayPathsByKey[p.key]) || null,
        cast: [...new Set(p.cast || [])],
        location: p.location || p.sceneGroup || null,
        subtitles: extractSubtitles([p]),
        sfx: extractSfx([p]),
        prompt,
      });
    } else {
      // K panels in a continuous run -> K-1 chained Veo interpolation clips
      for (let i = 0; i < run.length - 1; i++) {
        const a = run[i];
        const b = run[i + 1];
        shotIndex++;
        const combinedCast = [...new Set([...(a.cast || []), ...(b.cast || [])])];
        // Avoid duplicating dialogue from shared middle panels across chained shots:
        // first clip speaks panel A (plus panel B only if this is the final clip of the run)
        const isLastInRun = i === run.length - 2;
        const subPanels = isLastInRun ? [a, b] : [a];
        const prompt = buildVeoPrompt({
          mode: 'interpolate',
          startPanel: a,
          endPanel: b,
          audioPanels: subPanels,
          customMotion: a.video?.motion || b.video?.motion || '',
          bookMeta,
          audioMode: audio,
          castIds: combinedCast,
        });
        shots.push({
          id: `shot-${String(shotIndex).padStart(2, '0')}`,
          index: shotIndex,
          pageNumber: a.pageNumber,
          pageId: a.pageId,
          mode: 'interpolate',
          durationSeconds: 8, // Veo 3.1 lastFrame interpolation requires 8s
          chainedFromPrev: i > 0,
          panels: [a.id, b.id],
          panelKeys: [a.key, b.key],
          firstFrame: toRel(framePathsByKey[a.key]) || `video/frames/${a.key}.png`,
          lastFrame: toRel(framePathsByKey[b.key]) || `video/frames/${b.key}.png`,
          overlay: toRel(overlayPathsByKey[a.key]) || null,
          cast: combinedCast,
          location: a.location || b.location || a.sceneGroup || null,
          subtitles: extractSubtitles(subPanels),
          sfx: extractSfx(subPanels),
          prompt,
        });
      }
    }
  }

  return {
    version: 1,
    comicId: comicInfo.id,
    bookId: comicInfo.book,
    title: comicInfo.title,
    aspect,
    resolution,
    framing,
    audio,
    overlays,
    pageFilter,
    generatedAt: new Date().toISOString(),
    totalPanels: flatPanels.length,
    totalShots: shots.length,
    estimatedDurationSeconds: shots.reduce((sum, s) => sum + s.durationSeconds, 0),
    shots,
  };
}

export async function enrichStoryboardPrompts({
  storyboard,
  readmeText = '',
  apiKey,
  model = 'gemini-2.5-flash',
}) {
  if (!apiKey) throw new Error('GEMINI_API_KEY is required for --enrich-prompts');
  const shotSummaries = storyboard.shots.map(s => ({
    id: s.id,
    mode: s.mode,
    durationSeconds: s.durationSeconds,
    panels: s.panels,
    location: s.location,
    subtitles: s.subtitles,
    sfx: s.sfx,
    currentPrompt: s.prompt,
  }));

  const instruction = [
    'You are an animation director refining Veo 3.1 video prompts for a 2D hand-drawn cartoon comic adaptation.',
    'For each shot, rewrite ONLY the motion/camera/acting direction into a vivid, concise 2-3 sentence Veo prompt that:',
    '- Strictly preserves the 2D hand-drawn flat-shaded vector cartoon look (no 3D CGI, no photorealism, no text/speech bubbles in video).',
    '- Describes smooth, physically coherent character acting between the start frame and end frame (for interpolate shots) or lively acting within the frame (for single shots).',
    '- Keeps any spoken dialogue lines verbatim if audio mode is "veo".',
    '',
    readmeText ? `Comic Story README:\n${readmeText.slice(0, 4000)}\n` : '',
    `Audio mode: ${storyboard.audio}`,
    `Shots JSON:\n${JSON.stringify(shotSummaries, null, 2)}`,
    '',
    'Return ONLY a JSON object mapping shot id -> refined prompt string (e.g. {"shot-01": "..."}).',
  ].join('\n');

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'x-goog-api-key': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: instruction }] }],
      generationConfig: { responseMimeType: 'application/json' },
    }),
  });
  const json = await res.json().catch(() => ({}));
  const text = json.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('') || '';
  if (!res.ok || !text) {
    throw new Error(`Gemini prompt enrichment failed (${res.status}): ${json.error?.message || text.slice(0, 200)}`);
  }
  const map = JSON.parse(text);
  for (const shot of storyboard.shots) {
    if (typeof map[shot.id] === 'string' && map[shot.id].trim()) {
      shot.prompt = `${STYLE_LOCK_2D}\n${map[shot.id].trim()}`;
    }
  }
  storyboard.enrichedWith = model;
  return storyboard;
}

function formatSrtTime(sec) {
  const msTotal = Math.max(0, Math.round(sec * 1000));
  const hrs = Math.floor(msTotal / 3600000);
  const mins = Math.floor((msTotal % 3600000) / 60000);
  const secs = Math.floor((msTotal % 60000) / 1000);
  const ms = msTotal % 1000;
  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')},${String(ms).padStart(3, '0')}`;
}

export function generateSrtFromStoryboard(shots, actualDurations = null) {
  const blocks = [];
  let cursor = 0;
  let cueNum = 1;

  for (let i = 0; i < shots.length; i++) {
    const shot = shots[i];
    const dur = Math.max(0.5, Number(actualDurations?.[i] ?? shot.durationSeconds ?? 6));
    const lines = (shot.subtitles || []).filter(s => s.text && s.text.trim());
    if (lines.length) {
      const padStart = Math.min(0.25, dur * 0.08);
      const padEnd = Math.min(0.25, dur * 0.08);
      const usable = Math.max(0.4, dur - padStart - padEnd);
      const weights = lines.map(l => Math.max(6, l.text.length));
      const totalW = weights.reduce((a, b) => a + b, 0);
      let subCursor = cursor + padStart;

      lines.forEach((line, idx) => {
        const seg = usable * (weights[idx] / totalW);
        const start = subCursor;
        const end = idx === lines.length - 1
          ? cursor + dur - padEnd
          : Math.max(start + 0.35, subCursor + seg - 0.08);
        subCursor += seg;
        const formatted = line.speaker ? `${line.speaker}: ${line.text}` : line.text;
        blocks.push(`${cueNum++}\n${formatSrtTime(start)} --> ${formatSrtTime(end)}\n${formatted}\n`);
      });
    }
    cursor += dur;
  }

  return blocks.join('\n');
}
