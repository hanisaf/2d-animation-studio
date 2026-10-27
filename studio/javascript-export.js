// Self-contained scene bundles. Source stays ordinary JavaScript: no eval or remote runtime.
async function exportSceneJavaScript({ id, sound = false, signal, onProgress = () => {} }) {
  const sc = SCENES[id];
  if (!sc) throw new Error('Unknown scene ' + id);
  if (location.protocol === 'file:') throw new Error('Start the studio with npm run studio to export JavaScript');
  const stop = () => { if (signal?.aborted) throw new DOMException('Export cancelled', 'AbortError'); };
  const read = async path => {
    stop(); const res = await fetch(path, { signal });
    if (!res.ok) throw new Error('Could not bundle ' + path + ' (HTTP ' + res.status + ')');
    return res.text();
  };
  const dataURL = blob => new Promise((resolve, reject) => {
    const reader = new FileReader(); reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error); reader.readAsDataURL(blob);
  });
  stop();
  // Start rendering during export, before file fetches, so audio preparation
  // overlaps bundling. Reuse a finished or in-progress studio render.
  const soundtrack = sound && (sc.music || sc.dialogue?.length) ? synthesizeSceneAudio(sc) : null;
  soundtrack?.catch(() => {}); // Awaited and reported by this export below.
  onProgress(0, 'Bundling drawing engine and scene…');
  const code = await Promise.all(['engine/core.js', 'engine/persp.js', 'engine/callout.js', 'engine/timeline.js'].map(read));
  // Rigs and sets can share helpers outside their declared cast. Include the shared library
  // in studio load order, but only the selected scene. Each mount gets its own private scope.
  const assets = [...REGISTRY.characters.map(id => ASSETS.character[id]),
    ...REGISTRY.locations.map(id => ASSETS.location[id]), ASSETS.scene[id]];
  for (let i = 0; i < assets.length; i++) {
    const a = assets[i], meta = { ...a, refs: [], docs: null, audio: null };
    if (!sound) delete meta.music; // dialogue text is also used by speech bubbles
    code.push('CURRENT_ASSET = ' + JSON.stringify({ kind: a.kind, id: a.id, dir: a.dir }) + ';\nasset(' + JSON.stringify(meta) + ');');
    code.push(...await Promise.all(a.files.map(f => read(a.dir + '/' + f))));
    onProgress(.1 + .5 * (i + 1) / assets.length, 'Bundling ' + a.title + '…');
  }
  code.push('CURRENT_ASSET = null;');
  let audio = null;
  if (sound) {
    if (sc.music || sc.dialogue?.length) {
      onProgress(.65, 'Rendering and embedding soundtrack...');
      const buffer = await soundtrack;
      stop();
      if (!buffer) throw new Error('Scene soundtrack could not be rendered');
      audio = await dataURL(sceneWavBlob(buffer));
    } else if (sc.audio) {
      const res = await fetch(sc.audio, { signal });
      if (!res.ok) throw new Error('Could not embed soundtrack (HTTP ' + res.status + ')');
      audio = await dataURL(await res.blob());
    }
  }
  onProgress(.7, 'Embedding fonts…');
  // Freeze the exact font stylesheet and all its subsets into the download.
  const fonts = [];
  for (const link of document.querySelectorAll('link[rel="stylesheet"]')) {
    if (!link.href.startsWith('https://fonts.googleapis.com/')) continue;
    const css = await read(link.href);
    for (const match of css.matchAll(/@font-face\s*\{([^}]+)\}/g)) {
      const block = match[1], prop = name => block.match(new RegExp(name + '\\s*:\\s*([^;]+)'))?.[1].trim();
      const url = prop('src')?.match(/url\((['"]?)(.*?)\1\)/)?.[2];
      if (!url) throw new Error('Could not find font file in stylesheet');
      const res = await fetch(url, { signal });
      if (!res.ok) throw new Error('Could not embed font (HTTP ' + res.status + ')');
      fonts.push({ family: prop('font-family').replace(/['"]/g, ''), src: await dataURL(await res.blob()),
        descriptors: { weight: prop('font-weight') || 'normal', style: prop('font-style') || 'normal',
          unicodeRange: prop('unicode-range') || 'U+0-10FFFF' } });
    }
  }
  if (!fonts.length) throw new Error('Scene fonts were not found; reload the studio before exporting');
  stop(); onProgress(1, 'JavaScript ready');
  const config = { id, sound: sound && !!audio, audio, fonts };
  const source = '// Safadi Animation Studio — ' + id + (sound ? ' (with sound)' : ' (without sound)') + '\n' +
    '// Embed: <script src="' + id + (sound ? '.with-sound.js' : '.silent.js') + '" data-mount="#animation" data-loop="true"></script>\n' +
    '(function () {\n"use strict";\nconst config = ' + JSON.stringify(config) + ';\n' +
    'let fontReady;\nasync function createPlayer(target, options = {}) {\n' + code.join('\n;\n') + '\n' +
    sceneJavaScriptPlayer.toString() + '\nreturn await sceneJavaScriptPlayer(config, target, options, () => fontReady ||= Promise.all(config.fonts.map(async f => { const face = new FontFace(f.family, "url(" + f.src + ")", f.descriptors); await face.load(); document.fonts.add(face); })));\n}\n' +
    'window.SafadiScenes ||= Object.create(null);\nwindow.SafadiScenes[config.id] = Object.freeze({ id: config.id, mount: createPlayer, sound: config.sound });\n' +
    'window.MyScene = window.SafadiScenes[config.id];\n' +
    sceneJavaScriptAutoMount.toString() + '\nsceneJavaScriptAutoMount(document.currentScript, window.MyScene);\n})();\n';
  return new Blob([source], { type: 'text/javascript;charset=utf-8' });
}

// Serialized into each bundle inside its private engine scope.
async function sceneJavaScriptPlayer(config, target, options, loadFonts) {
  const host = typeof target === 'string' ? document.querySelector(target) : target;
  if (!host || typeof host.appendChild !== 'function') throw new Error('Scene mount target was not found');
  await loadFonts();
  const box = document.createElement('div'), root = box.attachShadow({ mode: 'open' });
  root.innerHTML = '<style>:host{display:block}canvas{display:block;width:100%;height:auto;aspect-ratio:16/9}.controls{display:flex;align-items:center;gap:5px;padding:5px 0;font:12px system-ui}.controls[hidden]{display:none}button,select{box-sizing:border-box;font:inherit;min-height:28px;padding:3px 7px;cursor:pointer;border:1px solid #c9cdd3;border-radius:5px;background:#fff;color:#263442}button:disabled{cursor:default;opacity:.55}.seek{flex:1;min-width:40px;margin:0;accent-color:#247b69}.time{font-variant-numeric:tabular-nums;white-space:nowrap;font-size:11px}.status{display:block;font:12px system-ui}.status:empty{display:none}</style><canvas></canvas><div class="controls"><button class="play" type="button" aria-label="Play">Play</button><input class="seek" type="range" min="0" step="0.01" value="0" aria-label="Seek playback"><span class="time"></span><button class="mute" type="button" aria-label="Unmute" aria-pressed="true">Unmute</button><select class="speed" aria-label="Playback speed"><option value="0.5">0.5x</option><option value="0.75">0.75x</option><option value="1" selected>1x</option><option value="1.25">1.25x</option><option value="1.5">1.5x</option><option value="2">2x</option></select></div><span class="status" role="status"></span>';
  const canvas = root.querySelector('canvas'), button = root.querySelector('.play'), status = root.querySelector('.status');
  const slider = root.querySelector('.seek'), muteButton = root.querySelector('.mute'), speed = root.querySelector('.speed'), time = root.querySelector('.time');
  canvas.width = W; canvas.height = H; canvas.setAttribute('aria-label', SCENES[config.id].title || config.id);
  X = canvas.getContext('2d'); useScene(config.id);
  const sc = SCENE;
  let t = 0, playing = false, destroyed = false, raf = 0, origin = 0, generation = 0;
  let muted = options.muted !== false, playbackRate = 1;
  let audio = config.sound ? new Audio() : null, soundActive = false, soundGeneration = 0;
  slider.max = String(sc.duration);
  muteButton.disabled = !audio;
  if (!audio) { muteButton.textContent = 'No sound'; muteButton.setAttribute('aria-label', 'This export has no sound'); }
  if (audio) {
    audio.preload = 'auto'; audio.muted = muted; audio.playbackRate = playbackRate;
    if (config.audio) audio.src = config.audio;
  }
  if (options.controls === false) root.querySelector('.controls').hidden = true;
  const formatTime = seconds => Math.floor(seconds / 60) + ':' + String(Math.floor(seconds % 60)).padStart(2, '0');
  function syncControls() {
    slider.value = String(t); slider.setAttribute('aria-valuetext', formatTime(t) + ' of ' + formatTime(sc.duration));
    time.textContent = formatTime(t) + ' / ' + formatTime(sc.duration);
    button.setAttribute('aria-label', button.textContent);
    if (audio) { muteButton.textContent = muted ? 'Unmute' : 'Mute'; muteButton.setAttribute('aria-label', muteButton.textContent); muteButton.setAttribute('aria-pressed', String(muted)); }
  }
  const draw = () => { drawFrame(Math.min(t, sc.duration - 1e-6)); syncControls(); };
  function currentClock(now = performance.now()) {
    return clamp(soundActive && audio?.src && !audio.paused ? audio.currentTime : (now / 1000 - origin) * playbackRate, 0, sc.duration);
  }
  function resetClock() { origin = performance.now() / 1000 - t / playbackRate; }
  async function startSound() {
    if (!audio || muted || !playing || destroyed) return;
    const token = ++soundGeneration;
    // The soundtrack is embedded at export; call play inside the click gesture.
    t = currentClock(); resetClock(); soundActive = false; audio.pause();
    status.textContent = 'Starting sound...';
    try {
      if (!audio.src) { status.textContent = ''; return; }
      t = currentClock(); resetClock(); audio.currentTime = t;
      audio.muted = false; audio.playbackRate = playbackRate;
      await audio.play();
      if (destroyed || !playing || muted || token !== soundGeneration) {
        if (destroyed || !playing || muted) audio.pause();
        return;
      }
      soundActive = true; status.textContent = '';
    } catch (error) {
      if (destroyed || token !== soundGeneration) return;
      soundActive = false; audio.pause();
      status.textContent = error.name === 'NotAllowedError' ? 'Sound blocked. Click Unmute to retry.' : 'Sound failed: ' + error.message;
      // Return to muted playback so Unmute can retry from a user gesture.
      muted = true; audio.muted = true; syncControls();
    }
  }
  function pause() {
    if (playing) { t = currentClock(); resetClock(); }
    generation++; soundGeneration++; playing = false; soundActive = false;
    audio?.pause(); cancelAnimationFrame(raf); button.textContent = 'Play'; syncControls();
  }
  async function play() {
    if (destroyed) throw new Error('Scene player was destroyed');
    if (playing) return;
    generation++;
    if (t >= sc.duration) t = 0;
    resetClock(); playing = true; status.textContent = '';
    button.textContent = 'Pause'; draw(); raf = requestAnimationFrame(tick);
    if (!muted) await startSound();
  }
  function tick(now) {
    if (!playing || destroyed) return;
    t = currentClock(now);
    if (t >= sc.duration || (soundActive && audio?.ended)) {
      t = sc.duration; pause(); draw();
      if (options.loop) { t = 0; play().catch(() => {}); }
      else { button.textContent = 'Replay'; syncControls(); }
      return;
    }
    draw(); raf = requestAnimationFrame(tick);
  }
  function seek(seconds) {
    if (destroyed) throw new Error('Scene player was destroyed');
    if (!Number.isFinite(seconds)) throw new Error('Seek time must be finite');
    t = clamp(seconds, 0, sc.duration); resetClock();
    if (audio?.src) audio.currentTime = t;
    draw();
  }
  function setMuted(value) {
    if (destroyed) throw new Error('Scene player was destroyed');
    if (playing) { t = currentClock(); resetClock(); }
    muted = Boolean(value);
    if (audio) {
      audio.muted = muted;
      if (muted) { soundGeneration++; soundActive = false; audio.pause(); status.textContent = ''; }
      else if (playing) startSound();
    }
    syncControls();
  }
  function setPlaybackRate(value) {
    if (destroyed) throw new Error('Scene player was destroyed');
    if (!Number.isFinite(value) || value < .25 || value > 4) throw new Error('Playback speed must be between 0.25 and 4');
    if (playing) t = currentClock();
    playbackRate = value; origin = performance.now() / 1000 - t / playbackRate;
    if (audio) audio.playbackRate = playbackRate;
    if (![...speed.options].some(option => Number(option.value) === value)) {
      const option = document.createElement('option'); option.value = String(value); option.textContent = value + 'x'; speed.appendChild(option);
    }
    speed.value = String(value); draw();
  }
  function destroy() {
    if (destroyed) return;
    pause(); destroyed = true;
    if (audio) { audio.removeAttribute('src'); audio.load(); }
    box.remove();
  }
  button.onclick = () => { if (playing) pause(); else play().catch(() => {}); };
  slider.oninput = () => seek(Number(slider.value));
  muteButton.onclick = () => setMuted(!muted);
  speed.onchange = () => setPlaybackRate(Number(speed.value));
  if (options.playbackRate !== undefined) setPlaybackRate(options.playbackRate);
  host.appendChild(box); draw();
  if (options.autoplay !== false) play().catch(() => {});
  return { play, pause, seek, destroy, setMuted, setPlaybackRate, canvas, get muted() { return muted; }, get playbackRate() { return playbackRate; }, get currentTime() { return t; }, get duration() { return sc.duration; }, get playing() { return playing; } };
}

// Read attributes from the actual downloaded script; no scene identifier to copy or guess.
function sceneJavaScriptAutoMount(script, entry) {
  if (!script?.dataset.mount) return;
  const start = () => {
    script.scenePlayer = entry.mount(script.dataset.mount, {
      autoplay: script.dataset.autoplay !== 'false',
      loop: script.dataset.loop === 'true',
      controls: script.dataset.controls !== 'false',
      muted: script.dataset.muted !== 'false',
      playbackRate: script.dataset.speed === undefined ? 1 : Number(script.dataset.speed)
    });
    script.scenePlayer.catch(error => console.error('Could not embed scene ' + entry.id + ':', error));
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
}
