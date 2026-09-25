// studio/studio.js: the Jester Fester studio.
//
// Loads every asset in registry.js, then offers three browsers:
//   Scenes      play / scrub / step, shot timeline, audio preview, export the scene or the whole movie to MP4
//   Docs        every asset's README (description, script, API) beside it, cross-linked; project docs in the sidebar
//   Characters  any registered pose big (on paper or standing in a location at true scale), or the full model sheet
//   Locations   fly a free perspective camera through the set (presets, sliders, mouse, keys), copy the camera as code,
//               drop a character on the stage mark for scale
// With ?render the page only exposes the API the Node renderer uses (renderAt, renderSheet, setScene, sceneInfo).

(async () => {
  const $ = s => document.querySelector(s);
  const load = src => new Promise((ok, bad) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = () => bad(new Error('failed to load ' + src)); document.body.appendChild(s); });
  await loadAssets(load);                                            // every asset folder: asset.js, then its files

  const canvas = $('#out'); X = canvas.getContext('2d');
  await Promise.race([Promise.all([document.fonts.load('600 50px Fredoka'), document.fonts.load('50px "Luckiest Guy"')]), new Promise(r => setTimeout(r, 6000))]);

  // ---------- renderer API (used by render.mjs) ----------
  const q = new URLSearchParams(location.search);
  useScene(q.get('scene') || REGISTRY.movie[0]);
  window.setScene = id => { if (!useScene(id)) throw new Error('unknown scene ' + id); return sceneInfo(); };
  window.sceneInfo = () => ({ id: SCENE.id, title: SCENE.title, duration: SCENE.duration, fps: SCENE.fps, audio: SCENE.audio || null });
  window.renderAt = async (t, type = 'image/png', qual = .92) => { drawFrame(t); return canvas.toDataURL(type, qual); };
  window.renderSheet = async (times, cols = 3, w = 640) => {
    const h = Math.round(w * 9 / 16), rows = Math.ceil(times.length / cols), sc = document.createElement('canvas');
    sc.width = cols * w; sc.height = rows * h; const c = sc.getContext('2d'), ms = [];
    for (let i = 0; i < times.length; i++) {
      const t0 = performance.now(); drawFrame(times[i]); ms.push(Math.round(performance.now() - t0));
      const x = (i % cols) * w, y = Math.floor(i / cols) * h;
      c.drawImage(canvas, x, y, w, h); c.fillStyle = 'rgba(0,0,0,.65)'; c.fillRect(x, y, 84, 24); c.fillStyle = '#fff'; c.font = '16px sans-serif'; c.fillText(times[i].toFixed(2) + 's', x + 6, y + 17);
    }
    return { url: sc.toDataURL('image/jpeg', .88), ms };
  };
  window.ready = true;
  if (q.has('render')) return;

  // =====================================================================================
  // Interactive studio
  const S = { mode: 'scene', id: null, t: 0, playing: false, speed: 1, loop: false, dirty: true, exporting: false,
    char: { pose: null, view: 'pose', backdrop: '', zoom: 1 }, loc: { cam: null, character: '', pose: '', spot: '' } };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const fmt = n => (Math.round(n * 100) / 100).toString();

  // ---------- sidebar ----------
  const META = (kind, id) => ASSETS[kind][id] || { id, title: id, refs: [] };
  const PROJECT_DOCS = [['README.md', 'Project README'], ['SERIES.md', 'Series bible'], ['ANIMATION_GUIDE.md', 'Animation guide'], ['docs/HANDBOOK.md', 'Handbook']];
  function buildSidebar() {
    const movie = REGISTRY.movie, li = (mode, id, ico, title, sub, tip) => `<li data-mode="${mode}" data-id="${esc(id)}" title="${esc(tip || '')}"><span class="ico">${ico}</span>${esc(title)}<span class="sub">${sub}</span></li>`;
    $('#list-scenes').innerHTML = REGISTRY.scenes.filter(id => SCENES[id]).map(id => { const m = META('scene', id), n = movie.indexOf(id); return li('scene', id, '🎬', m.title, `${n >= 0 ? '#' + (n + 1) + ' · ' : ''}${SCENES[id].duration}s`, m.logline); }).join('');
    $('#list-characters').innerHTML = REGISTRY.characters.filter(id => CHARACTERS[id]).map(id => { const m = META('character', id); return li('character', id, '🎭', m.title, `${Object.keys(CHARACTERS[id].poses || {}).length} poses`, m.logline); }).join('');
    $('#list-locations').innerHTML = REGISTRY.locations.filter(id => LOCATIONS[id]).map(id => { const m = META('location', id); return li('location', id, '🏰', m.title, `${Object.keys(LOCATIONS[id].cameras || {}).length} cams`, m.logline); }).join('');
    $('#list-docs').innerHTML = PROJECT_DOCS.map(([f, t]) => li('doc', f, '📄', t, f.split('/').pop(), f)).join('');
    document.querySelectorAll('#side li').forEach(el => el.onclick = () => select(el.dataset.mode, el.dataset.id));
  }

  function select(mode, id, keepT = false) {
    if (S.mode !== 'doc' && S.id) S.last = [S.mode, S.id];
    pause(); S.mode = mode; S.id = id; if (!keepT) S.t = 0;
    document.querySelectorAll('#side li').forEach(li => li.classList.toggle('on', li.dataset.mode === mode && li.dataset.id === id));
    canvas.classList.toggle('grab', mode === 'location');
    $('#work').hidden = mode === 'doc'; $('#docs').classList.toggle('full', mode === 'doc');
    if (mode === 'doc') { showDoc(id, (PROJECT_DOCS.find(d => d[0] === id) || [])[1] || id, true); history.replaceState(null, '', `?doc=${id}`); return; }
    if (mode === 'scene') { useScene(id); scenePanel(SCENES[id]); }
    if (mode === 'character') { const e = CHARACTERS[id]; S.char.pose = Object.keys(e.poses || {})[0] || null; charPanel(e); play(); }
    if (mode === 'location') { const l = LOCATIONS[id]; S.loc.cam = { ...(Object.values(l.cameras || {})[0] || { x: 0, y: 150, z: 0, f: 1000, hy: 540 }) }; locPanel(l); play(); }
    const m = META(mode, id); showDoc(m.docs, m.title, S.docsOpen);
    history.replaceState(null, '', `?${mode}=${id}`);
    S.dirty = true;
  }

  // ---------- docs pane: each asset's README (and the project docs), rendered from Markdown ----------
  S.docsOpen = (() => { try { return localStorage.getItem('studio.docs') !== '0'; } catch { return true; } })();
  let docPath = null;
  async function showDoc(path, title, open) {
    const pane = $('#docs'); docPath = path;
    pane.hidden = !open; document.querySelectorAll('.docbtn').forEach(b => b.classList.toggle('on', !!open));
    if (!open) return;
    $('#doctitle').textContent = title || path || 'Docs'; $('#docraw').href = path || '#';
    const art = $('#doc');
    if (!path) { art.innerHTML = '<p class="muted">This asset has no README.md yet.</p>'; return; }
    art.innerHTML = '<p class="muted">Loading…</p>';
    try {
      const res = await fetch(path, { cache: 'no-store' }); if (!res.ok) throw new Error(res.status === 404 ? 'not found' : 'HTTP ' + res.status);
      const md = await res.text(); if (docPath !== path) return;
      art.innerHTML = mdToHtml(md, path.split('/').slice(0, -1).join('/')); art.scrollTop = 0; pane.scrollTop = 0;
    } catch (e) {
      art.innerHTML = location.protocol === 'file:'
        ? `<p>Docs can't be read when the studio is opened from disk (<code>file://</code>).</p><p>Start it with <code>npm run studio</code> (http://localhost:5173), or open <a href="${esc(path)}" target="_blank">${esc(path)}</a> directly.</p>`
        : `<p class="muted">Couldn't load <code>${esc(path)}</code> (${esc(e.message)}).</p>`;
    }
  }
  function toggleDocs() {
    if (S.mode === 'doc') return;
    S.docsOpen = !S.docsOpen; try { localStorage.setItem('studio.docs', S.docsOpen ? '1' : '0'); } catch {}
    const m = META(S.mode, S.id); showDoc(m.docs, m.title, S.docsOpen);
  }
  $('#docclose').onclick = () => { if (S.mode === 'doc') select(...(S.last || ['scene', REGISTRY.movie[0]])); else toggleDocs(); };
  // links inside docs: an asset's README opens that asset, a project doc opens in the reader, anything else a new tab
  $('#doc').addEventListener('click', e => {
    const a = e.target.closest('a[data-href]'); if (!a) return;
    const h = a.dataset.href.split('#')[0], m = /^(characters|locations|scenes)\/([\w-]+)\/README\.md$/.exec(h);
    if (m) { e.preventDefault(); const kind = { characters: 'character', locations: 'location', scenes: 'scene' }[m[1]]; if ((kind === 'scene' ? SCENES : kind === 'character' ? CHARACTERS : LOCATIONS)[m[2]]) select(kind, m[2]); return; }
    if (/\.md$/.test(h) && !/^[a-z]+:/i.test(h)) { e.preventDefault(); select('doc', h); return; }
    if (a.getAttribute('href').startsWith('#')) return;
    e.preventDefault(); window.open(a.href, '_blank');
  });
  // cross-links between assets: a scene's cast + locations, and where a character / location appears
  function linksHtml(kind, id) {
    const chip = (k, i) => `<button class="chip link" data-go="${k}:${i}">${k === 'character' ? '🎭' : k === 'location' ? '🏰' : '🎬'} ${esc(META(k, i).title)}</button>`;
    const scenesWith = key => REGISTRY.scenes.filter(sid => (META('scene', sid)[key] || []).includes(id));
    if (kind === 'scene') { const m = META('scene', id); return [['Cast', (m.cast || []).map(c => chip('character', c))], ['Location', (m.locations || []).map(l => chip('location', l))]].filter(([, v]) => v.length).map(([k, v]) => `<span class="muted">${k}</span> ${v.join('')}`).join(' '); }
    const list = scenesWith(kind === 'character' ? 'cast' : 'locations');
    return list.length ? `<span class="muted">Appears in</span> ${list.map(sid => chip('scene', sid)).join('')}` : '<span class="muted">Not in any scene yet</span>';
  }
  function bindLinks() { document.querySelectorAll('[data-go]').forEach(b => b.onclick = () => { const [k, i] = b.dataset.go.split(':'); select(k, i); }); document.querySelectorAll('.docbtn').forEach(b => b.onclick = toggleDocs); }
  const docBtn = () => `<button class="docbtn${S.docsOpen ? ' on' : ''}" title="show / hide this asset's README">📄 Docs</button>`;

  // ---------- rendering ----------
  function render() {
    if (S.mode === 'scene') drawFrame(S.t, SCENES[S.id]);
    else if (S.mode === 'character') { const e = CHARACTERS[S.id]; paintFrame(S.t, t => S.char.view === 'sheet' ? drawModelSheet(e, t) : drawCharacterView(e, S.char.pose, t, { location: S.char.backdrop, zoom: S.char.zoom })); }
    else if (S.mode === 'location') paintFrame(S.t, t => drawLocationView(LOCATIONS[S.id], S.loc.cam, t, { character: S.loc.character, pose: S.loc.pose, spot: S.loc.spot }));
    hud();
  }
  let last = performance.now();
  function loop(now) {
    const dt = Math.min(.1, (now - last) / 1000); last = now;
    if (!S.exporting) {
      if (S.playing) {
        S.t += dt * (S.mode === 'scene' ? S.speed : 1);
        if (S.mode === 'scene') {
          const d = SCENES[S.id].duration;
          if (S.t >= d) { if (S.loop) { S.t = 0; syncAudio(true); } else { S.t = d - 1e-3; pause(); } }
          syncAudio();
        }
        S.dirty = true;
      }
      if (S.dirty) { render(); S.dirty = false; }
    }
    requestAnimationFrame(loop);
  }

  // ---------- playback + audio ----------
  let audio = null, audioOk = false;
  function setupAudio(sc) {
    if (audio) { audio.pause(); audio = null; } audioOk = false;
    const tag = $('#aud'); if (!tag) return;
    if (!sc.audio) { tag.textContent = 'none'; return; }
    tag.textContent = 'loading…';
    audio = new Audio(sc.audio); audio.preload = 'auto';
    audio.oncanplay = () => { audioOk = true; tag.textContent = '♪ ' + sc.audio; };
    audio.onerror = () => { audioOk = false; tag.textContent = `none yet (add ${sc.audio})`; };
  }
  function syncAudio(force) {
    if (!audio || !audioOk || !S.playing) return;
    if (force || Math.abs(audio.currentTime - S.t) > .12) audio.currentTime = S.t;
    audio.playbackRate = S.speed;
  }
  function play() { S.playing = true; if (S.mode === 'scene' && audio && audioOk) { audio.currentTime = S.t; audio.playbackRate = S.speed; audio.play().catch(() => {}); } playBtn(); }
  function pause() { S.playing = false; audio?.pause(); playBtn(); }
  function toggle() { if (S.playing) pause(); else { if (S.mode === 'scene' && S.t >= SCENES[S.id].duration - .01) S.t = 0; play(); } }
  function seek(t) {
    const d = S.mode === 'scene' ? SCENES[S.id].duration - 1e-3 : Infinity;
    S.t = clamp(t, 0, d); S.dirty = true; if (audio && audioOk && S.playing) audio.currentTime = S.t;
  }
  function step(frames) { pause(); const fps = S.mode === 'scene' ? SCENES[S.id].fps : 24; seek(Math.round(S.t * fps + frames) / fps); }
  function playBtn() { const b = $('#play'); if (b) b.textContent = S.playing ? '❚❚ Pause' : '▶ Play'; const a = $('#anim'); if (a) a.checked = S.playing; }

  // ---------- panels ----------
  function refsHtml(list) { return list?.length ? `<div class="refs">${list.map(src => `<img src="${src}" alt="reference" title="reference: ${src}">`).join('')}</div>` : ''; }
  function bindRefs() { document.querySelectorAll('.refs img').forEach(img => img.onclick = () => { $('#lightbox img').src = img.src; $('#lightbox').classList.add('on'); }); }
  $('#lightbox').onclick = () => $('#lightbox').classList.remove('on');
  const exportRow = (sceneButtons) => `
    <div class="row">
      ${sceneButtons ? `<button id="exp-scene" class="accent">⬇ Export scene MP4</button><button id="exp-movie">⬇ Export movie MP4</button>
      <select id="quality" title="video bitrate"><option value="16000000">High · 16 Mbps</option><option value="8000000" selected>Standard · 8 Mbps</option><option value="4000000">Small · 4 Mbps</option></select>` : ''}
      <button id="snap">📷 Snapshot PNG</button>
      <div class="progress" id="progress" hidden><div class="track"><div class="bar"></div></div><button id="cancel">Cancel</button></div>
      <span id="status"></span>
    </div>`;
  function bindSnap(name) { $('#snap').onclick = () => canvas.toBlob(b => { downloadBlob(b, `${name()}.png`); status(`Saved ${name()}.png`, 'ok'); }, 'image/png'); }
  function status(msg, cls = '') { const s = $('#status'); if (s) { s.textContent = msg; s.className = cls; } }

  function scenePanel(sc) {
    const fps = sc.fps, N = Math.ceil(sc.duration * fps - 1e-6), inMovie = REGISTRY.movie.includes(sc.id);
    $('#panel').innerHTML = `
      <div class="head"><div class="txt"><h2>${esc(META('scene', sc.id).title)}</h2><div class="muted">${esc(META('scene', sc.id).logline || '')}</div>
        <div class="muted mono">${sc.dir || sc.id} · ${sc.duration} s · ${fps} fps · ${N} frames · ${sc.shots.length} shots · ${inMovie ? 'movie #' + (REGISTRY.movie.indexOf(sc.id) + 1) : 'not in movie'} · audio: <span id="aud">none</span></div>
        <div class="row links">${linksHtml('scene', sc.id)}</div></div>${docBtn()}</div>
      <div class="timeline"><div class="shots" id="shots">${sc.shots.map(([t0, fn], i) => {
        const t1 = i + 1 < sc.shots.length ? sc.shots[i + 1][0] : sc.duration;
        return `<div class="seg" data-i="${i}" data-t="${t0}" style="left:${t0 / sc.duration * 100}%;width:${(t1 - t0) / sc.duration * 100}%" title="${esc(fn.name || 'shot ' + (i + 1))} · ${fmt(t0)}–${fmt(t1)} s">${esc(fn.name || 'shot ' + (i + 1))}</div>`; }).join('')}</div>
        <input type="range" id="scrub" min="0" max="${sc.duration}" step="${1 / fps}" value="0"></div>
      <div class="row">
        <button id="start" title="Home">⏮</button><button id="prev" title="←">◀︎</button><button id="play" class="primary">▶ Play</button><button id="next" title="→">▶︎</button><button id="end" title="End">⏭</button>
        <select id="speed" title="playback speed"><option value=".25">¼×</option><option value=".5">½×</option><option value="1" selected>1×</option><option value="2">2×</option></select>
        <label class="ck"><input type="checkbox" id="loopck"> loop</label>
        <span class="spacer"></span><span id="tt" class="mono"></span>
      </div>
      ${exportRow(true)}`;
    $('#scrub').oninput = e => { pause(); seek(+e.target.value); };
    document.querySelectorAll('.seg').forEach(s => s.onclick = () => { seek(+s.dataset.t); });
    $('#start').onclick = () => { pause(); seek(0); }; $('#end').onclick = () => { pause(); seek(sc.duration); };
    $('#prev').onclick = () => step(-1); $('#next').onclick = () => step(1); $('#play').onclick = toggle;
    $('#speed').value = S.speed; $('#speed').onchange = e => { S.speed = +e.target.value; syncAudio(); };
    $('#loopck').checked = S.loop; $('#loopck').onchange = e => { S.loop = e.target.checked; };
    $('#exp-scene').onclick = () => runExport([sc.id], `${sc.id}.mp4`);
    $('#exp-movie').onclick = () => runExport(REGISTRY.movie, 'movie.mp4');
    $('#exp-movie').title = 'All scenes in movie order: ' + REGISTRY.movie.join(' → ');
    bindSnap(() => `${sc.id}_f${String(Math.round(S.t * fps)).padStart(5, '0')}`);
    setupAudio(sc); playBtn(); bindLinks();
  }

  function charPanel(e) {
    const locs = Object.entries(LOCATIONS);
    $('#panel').innerHTML = `
      <div class="head"><div class="txt"><h2>${esc(META('character', S.id).title)}</h2><div class="muted">${esc(META('character', S.id).logline || '')}</div>
        <div class="muted mono">characters/${S.id} · unit ${e.unit} world units · ${Object.keys(e.poses || {}).length} poses</div>
        <div class="row links">${linksHtml('character', S.id)}</div></div>${refsHtml(META('character', S.id).refs)}${docBtn()}</div>
      <div class="row">
        <div class="chips"><button class="chip" data-v="pose">Pose</button><button class="chip" data-v="sheet">Model sheet</button></div>
        <label class="ck">Backdrop <select id="bd"><option value="">Paper</option>${locs.map(([id]) => `<option value="${id}">${esc(META('location', id).title)} (true scale)</option>`).join('')}</select></label>
        <label class="ck">Zoom <input type="range" id="zoom" min=".5" max="2.5" step=".05" value="${S.char.zoom}"></label>
        <label class="ck"><input type="checkbox" id="anim" checked> animate</label>
      </div>
      <div class="chips" id="poses">${Object.keys(e.poses || {}).map(p => `<button class="chip" data-p="${esc(p)}">${esc(p)}</button>`).join('')}</div>
      ${exportRow(false)}`;
    const mark = () => {
      document.querySelectorAll('[data-v]').forEach(b => b.classList.toggle('on', b.dataset.v === S.char.view));
      document.querySelectorAll('[data-p]').forEach(b => { b.classList.toggle('on', b.dataset.p === S.char.pose); b.disabled = S.char.view === 'sheet'; });
      $('#bd').disabled = $('#zoom').disabled = S.char.view === 'sheet';
    };
    document.querySelectorAll('[data-v]').forEach(b => b.onclick = () => { S.char.view = b.dataset.v; mark(); S.dirty = true; });
    document.querySelectorAll('[data-p]').forEach(b => b.onclick = () => { S.char.pose = b.dataset.p; mark(); S.dirty = true; });
    $('#bd').value = S.char.backdrop; $('#bd').onchange = ev => { S.char.backdrop = ev.target.value; S.dirty = true; };
    $('#zoom').oninput = ev => { S.char.zoom = +ev.target.value; S.dirty = true; };
    $('#anim').onchange = ev => ev.target.checked ? play() : pause();
    bindSnap(() => `${S.id}_${S.char.view === 'sheet' ? 'sheet' : S.char.pose.replace(/\W+/g, '-')}`); bindRefs(); bindLinks(); mark();
  }

  const CAM_RANGES = { x: [-900, 900, 1], y: [0, 1300, 1], z: [-800, 2380, 1], f: [300, 3000, 10], hy: [-1000, 3000, 1] };
  const CAM_LABELS = { x: 'x · pan', y: 'y · eye height', z: 'z · dolly', f: 'f · focal', hy: 'hy · tilt' };
  function locPanel(l) {
    const chars = Object.entries(CHARACTERS);
    $('#panel').innerHTML = `
      <div class="head"><div class="txt"><h2>${esc(META('location', S.id).title)}</h2><div class="muted">${esc(META('location', S.id).logline || '')}</div>
        <div class="muted mono">locations/${S.id} · spots: ${Object.entries(l.spots || { 'stage mark': { ...l.MARK, y: 0 } }).map(([n, p]) => `${esc(n)} (${p.x}, ${p.y ?? 0}, ${p.z})`).join(' · ')}</div>
        <div class="row links">${linksHtml('location', S.id)}</div></div>${refsHtml(META('location', S.id).refs)}${docBtn()}</div>
      <div class="chips" id="cams">${Object.keys(l.cameras || {}).map(c => `<button class="chip" data-c="${esc(c)}">${esc(c)}</button>`).join('')}</div>
      <div class="sliders">${Object.keys(CAM_RANGES).map(k => `<label>${CAM_LABELS[k]}<input type="range" data-k="${k}" min="${CAM_RANGES[k][0]}" max="${CAM_RANGES[k][1]}" step="${CAM_RANGES[k][2]}"><output data-o="${k}"></output></label>`).join('')}</div>
      <div class="row">
        <input type="text" id="camtxt" readonly size="46" class="mono" title="paste into a scene: persp(<this>)"><button id="copycam">Copy camera</button>
        <label class="ck">Stand-in <select id="who"><option value="">none</option>${chars.map(([id]) => `<option value="${id}">${esc(META('character', id).title)}</option>`).join('')}</select></label>
        <select id="whopose" hidden></select>
        <select id="spot" hidden title="where the stand-in goes">${Object.keys(l.spots || {}).map(p => `<option>${esc(p)}</option>`).join('')}</select>
        <label class="ck"><input type="checkbox" id="anim" checked> animate</label>
      </div>
      ${exportRow(false)}`;
    document.querySelectorAll('[data-c]').forEach(b => b.onclick = () => { S.loc.cam = { ...l.cameras[b.dataset.c] }; camUI(); });
    document.querySelectorAll('[data-k]').forEach(r => r.oninput = () => { S.loc.cam[r.dataset.k] = +r.value; camUI(); });
    $('#copycam').onclick = async () => { const txt = $('#camtxt').value; try { await navigator.clipboard.writeText(txt); } catch { $('#camtxt').select(); document.execCommand('copy'); } status('Camera copied: paste it into persp(…) in a scene', 'ok'); };
    const whoUI = () => {
      const sel = $('#whopose'), e = CHARACTERS[S.loc.character]; sel.hidden = !e; $('#spot').hidden = !e || !l.spots;
      if (e) { sel.innerHTML = Object.keys(e.poses || {}).map(p => `<option>${esc(p)}</option>`).join(''); if (!e.poses[S.loc.pose]) S.loc.pose = Object.keys(e.poses)[0]; sel.value = S.loc.pose; }
      S.dirty = true;
    };
    $('#who').value = S.loc.character; $('#who').onchange = ev => { S.loc.character = ev.target.value; whoUI(); };
    $('#whopose').onchange = ev => { S.loc.pose = ev.target.value; S.dirty = true; };
    if (!l.spots?.[S.loc.spot]) S.loc.spot = Object.keys(l.spots || {})[0] || '';
    $('#spot').value = S.loc.spot; $('#spot').onchange = ev => { S.loc.spot = ev.target.value; S.dirty = true; };
    $('#anim').onchange = ev => ev.target.checked ? play() : pause();
    bindSnap(() => `${S.id}_z${Math.round(S.loc.cam.z)}`); bindRefs(); bindLinks(); whoUI(); camUI();
  }
  function camUI() {
    const c = S.loc.cam;
    for (const k of Object.keys(CAM_RANGES)) { const r = document.querySelector(`[data-k="${k}"]`), o = document.querySelector(`[data-o="${k}"]`); if (r) r.value = c[k]; if (o) o.textContent = Math.round(c[k]); }
    const t = $('#camtxt'); if (t) t.value = `{ x: ${Math.round(c.x)}, y: ${Math.round(c.y)}, z: ${Math.round(c.z)}, f: ${Math.round(c.f)}, hy: ${Math.round(c.hy)} }`;
    const l = LOCATIONS[S.id]; document.querySelectorAll('[data-c]').forEach(b => { const p = l.cameras[b.dataset.c]; b.classList.toggle('on', Object.keys(CAM_RANGES).every(k => Math.abs(p[k] - c[k]) < .5)); });
    S.dirty = true;
  }

  // ---------- HUD ----------
  function hud() {
    if (S.mode !== 'scene') return;
    const sc = SCENES[S.id], fps = sc.fps, N = Math.ceil(sc.duration * fps - 1e-6), sh = shotAt(sc, clamp(S.t, 0, sc.duration - 1e-6));
    const tt = $('#tt'); if (tt) tt.textContent = `${S.t.toFixed(2)} s · frame ${Math.min(N - 1, Math.round(S.t * fps))} / ${N - 1} · ${sh.fn.name || 'shot'} +${(S.t - sh.t0).toFixed(2)} s`;
    const sb = $('#scrub'); if (sb && document.activeElement !== sb) sb.value = S.t;
    document.querySelectorAll('.seg').forEach(s => s.classList.toggle('on', +s.dataset.i === sh.index));
  }

  // ---------- export ----------
  let ctrl = null;
  async function runExport(ids, name) {
    if (S.exporting) return;
    pause(); S.exporting = true; ctrl = new AbortController();
    const prog = $('#progress'), bar = prog.querySelector('.bar');
    prog.hidden = false; bar.style.width = '0%'; document.querySelectorAll('#exp-scene,#exp-movie,#snap').forEach(b => b.disabled = true);
    $('#cancel').onclick = () => ctrl.abort();
    try {
      const blob = await exportVideo({ scenes: ids, bitrate: +$('#quality').value, signal: ctrl.signal, onProgress: (p, msg) => { bar.style.width = (p * 100).toFixed(1) + '%'; status(msg); } });
      downloadBlob(blob, name);
      status(`Saved ${name}: ${blob.frames} frames, ${(blob.size / 1e6).toFixed(1)} MB, encoded in ${blob.seconds.toFixed(1)} s` + (blob.warnings.length ? ` · ⚠ ${blob.warnings.join(' · ')}` : ''), blob.warnings.length ? 'warn' : 'ok');
    } catch (e) {
      status(e.name === 'AbortError' ? 'Export cancelled' : '⚠ ' + e.message, 'warn'); if (e.name !== 'AbortError') console.error(e);
    } finally {
      S.exporting = false; prog.hidden = true; document.querySelectorAll('#exp-scene,#exp-movie,#snap').forEach(b => b.disabled = false);
      useScene(S.id); S.dirty = true;
    }
  }

  // ---------- canvas mouse + keyboard ----------
  let drag = null;
  canvas.addEventListener('pointerdown', e => { if (S.mode !== 'location') return; drag = { x: e.clientX, y: e.clientY, cam: { ...S.loc.cam } }; canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener('pointermove', e => {
    if (!drag) return; const k = W / canvas.clientWidth, dz = Math.max(200, 1200 - drag.cam.z);
    S.loc.cam.x = clamp(drag.cam.x - (e.clientX - drag.x) * k * dz / drag.cam.f, -900, 900);
    S.loc.cam.hy = clamp(drag.cam.hy + (e.clientY - drag.y) * k, -1000, 3000); camUI();
  });
  canvas.addEventListener('pointerup', () => { drag = null; });
  canvas.addEventListener('wheel', e => {
    if (S.mode !== 'location') return; e.preventDefault(); const c = S.loc.cam;
    if (e.shiftKey || e.altKey) c.f = clamp(c.f * Math.exp(-(e.deltaY || e.deltaX) * .0015), 300, 3000); else c.z = clamp(c.z - e.deltaY * 1.2, -800, 2380);
    camUI();
  }, { passive: false });
  addEventListener('keydown', e => {
    if (e.target.matches('input[type=text], select') || S.mode === 'doc') return;
    if (e.code === 'Space') { e.preventDefault(); toggle(); return; }
    if (S.mode === 'location') {
      const c = S.loc.cam, m = e.shiftKey ? 4 : 1, keys = { KeyW: ['z', 30], KeyS: ['z', -30], KeyA: ['x', -20], KeyD: ['x', 20], KeyQ: ['y', 15], KeyE: ['y', -15], KeyR: ['hy', 20], KeyF: ['hy', -20] };
      if (keys[e.code]) { const [k, d] = keys[e.code]; c[k] = clamp(c[k] + d * m, CAM_RANGES[k][0], CAM_RANGES[k][1]); camUI(); }
      return;
    }
    if (S.mode !== 'scene') return;
    if (e.code === 'ArrowLeft') { e.preventDefault(); e.shiftKey ? seek(S.t - 1) : step(-1); }
    if (e.code === 'ArrowRight') { e.preventDefault(); e.shiftKey ? seek(S.t + 1) : step(1); }
    if (e.code === 'Home') seek(0);
    if (e.code === 'End') seek(SCENES[S.id].duration);
  });

  // ---------- start ----------
  buildSidebar();
  if (q.has('doc')) { select('scene', REGISTRY.movie[0]); select('doc', q.get('doc')); }
  else {
    const [mode, id] = q.has('character') ? ['character', q.get('character')] : q.has('location') ? ['location', q.get('location')] : ['scene', q.get('scene') || REGISTRY.movie[0]];
    const ok = (mode === 'scene' ? SCENES : mode === 'character' ? CHARACTERS : LOCATIONS)[id];
    select(ok ? mode : 'scene', ok ? id : REGISTRY.movie[0]);
  }
  if (q.has('t')) seek(+q.get('t'));
  window.studio = { S, select, seek, runExport };
  requestAnimationFrame(loop);
})().catch(e => { document.body.insertAdjacentHTML('afterbegin', `<pre id="err">${e.stack || e}</pre>`); console.error(e); });
