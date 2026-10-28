import { Game, WIDTH, HEIGHT } from './model.js';
const $ = id => document.getElementById(id);
const canvas = $('game'), ctx = canvas.getContext('2d'), game = new Game();
const RENDER_SCALE = 2, CHARACTER_SCALE = 1.1, ROBOT_SIZE = 110;
canvas.width = WIDTH * RENDER_SCALE; canvas.height = HEIGHT * RENDER_SCALE;
const input = { left: false, right: false, fire: false }, keys = new Set(), touches = new Map();
const heroes = {
  neptune: { name: 'Neptune', draw: neptune, scale: 5.2 },
  jester_fester: { name: 'Jester Fester', draw: jester, scale: 4.4 },
  safadi: { name: 'Professor Safadi', draw: safadi, scale: 4 },
  sami: { name: 'Dr Sami', draw: sami, scale: 4 },
  housam: { name: 'Housam', draw: housam, scale: 3.75 },
  alma: { name: 'Alma', draw: alma, scale: 5 },
  danny: { name: 'Danny', draw: danny, scale: 4.1 },
  jenna: { name: 'Jenna', draw: jenna, scale: 4.1 },
};
let heroId = 'neptune', audioContext, soundEnabled = true;
// Short, locally synthesized arcade effects; audio is unlocked by a user gesture.
function unlockAudio() {
  if (!soundEnabled) return;
  try {
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (Audio) { audioContext ||= new Audio(); audioContext.resume().catch(() => {}); }
  } catch { /* Gameplay also works in browsers without audio support. */ }
}
function playSound(kind) {
  if (!soundEnabled || audioContext?.state !== 'running') return;
  const now = audioContext.currentTime;
  const [from, to, duration, type] = {
    shot: [1000, 180, .09, 'square'], hit: [260, 55, .16, 'sawtooth'], hurt: [140, 35, .25, 'triangle'],
  }[kind];
  const oscillator = audioContext.createOscillator(), gain = audioContext.createGain();
  oscillator.type = type; oscillator.frequency.setValueAtTime(from, now);
  oscillator.frequency.exponentialRampToValueAtTime(to, now + duration);
  gain.gain.setValueAtTime(.0001, now); gain.gain.exponentialRampToValueAtTime(.055, now + .005);
  gain.gain.exponentialRampToValueAtTime(.0001, now + duration);
  oscillator.connect(gain); gain.connect(audioContext.destination);
  oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
  oscillator.start(now); oscillator.stop(now + duration);
}
$('sound').onclick = () => {
  soundEnabled = !soundEnabled; $('sound').textContent = `Sound: ${soundEnabled ? 'on' : 'off'}`;
  $('sound').setAttribute('aria-pressed', String(soundEnabled));
  if (soundEnabled) unlockAudio();
};
const heroIds = Object.keys(heroes);
const taglines = ['Ruler of the seven seas', 'The last laugh is yours', 'Knowledge is power', 'A healthy dose of heroism', 'Quick feet. Brilliant mind.', 'Let your rainbow powers shine', 'Small hero. Big adventure.', 'Creativity takes the crown'];
const portraits = {};
// Paint the original rigs into local portraits so the selection screen also works offline.
for (const [index, id] of heroIds.entries()) {
  const portrait = document.createElement('canvas'); portrait.width = 300; portrait.height = 360;
  X = portrait.getContext('2d'); T = 0; boilSeed(T); OVERLAYS = []; CAM = null; JIT = 0;
  const hero = heroes[id];
  hero.draw(150, 335, hero.scale * 2.35, { t: 0, sit: 1, mouth: 'grin', eyes: 'open', boil: 0, noShadow: true });
  OVERLAYS = [];
  portraits[id] = portrait.toDataURL();
  const button = document.createElement('button');
  button.type = 'button'; button.className = 'hero-card'; button.dataset.hero = id;
  button.setAttribute('aria-pressed', String(id === heroId)); button.tabIndex = id === heroId ? 0 : -1;
  const img = document.createElement('img'); img.src = portraits[id]; img.alt = ''; img.draggable = false;
  const name = document.createElement('span'); name.textContent = hero.name;
  const number = document.createElement('small'); number.textContent = `0${index + 1}`;
  button.append(number, img, name); button.onclick = () => selectHero(id);
  $('hero-grid').append(button);
}
function selectHero(id, focus = false) {
  heroId = id;
  for (const button of document.querySelectorAll('.hero-card')) {
    const selected = button.dataset.hero === id;
    button.setAttribute('aria-pressed', String(selected)); button.tabIndex = selected ? 0 : -1;
    if (selected && focus) button.focus();
  }
  $('hero-preview').src = portraits[id]; $('hero-preview').alt = heroes[id].name;
  $('hero-name').textContent = heroes[id].name;
  $('hero-tagline').textContent = taglines[heroIds.indexOf(id)];
  announce(`${heroes[id].name} selected.`);
}
selectHero(heroId);
$('hero-grid').addEventListener('keydown', e => {
  const columns = getComputedStyle($('hero-grid')).gridTemplateColumns.split(' ').length;
  const offset = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -columns, ArrowDown: columns }[e.code];
  if (offset !== undefined) {
    e.preventDefault(); selectHero(heroIds[(heroIds.indexOf(heroId) + offset + heroIds.length) % heroIds.length], true);
  } else if (e.code === 'Enter') { e.preventDefault(); start(); }
});
$('confirm-hero').onclick = start;
$('choose-hero').onclick = () => {
  release(); game.reset(); game.state = 'ready'; sync();
  document.querySelector(`[data-hero="${heroId}"]`).focus();
};
X = ctx;
// Cache the detailed rig once for each marching frame, rather than repainting every robot.
const robots = Array.from({ length: 4 }, (_, i) => {
  const sprite = document.createElement('canvas'); sprite.width = ROBOT_SIZE * RENDER_SCALE; sprite.height = ROBOT_SIZE * RENDER_SCALE;
  X = sprite.getContext('2d'); X.scale(RENDER_SCALE * CHARACTER_SCALE, RENDER_SCALE * CHARACTER_SCALE); T = i / 8; boilSeed(T);
  roboSafadi(50, 88, 2.5, { t: T, red: 1, hum: false, noShadow: true, boil: 0, mouth: 'teeth', brows: 'angry', handL: i % 2 ? [-6,-20] : [-6.5,-14], handR: i % 2 ? [6.5,-14] : [6,-20], handPoseL: 'claw', handPoseR: 'claw', antenna: i % 2 ? .3 : -.3 });
  return sprite;
});
X = ctx;
// Keep only the selected hero's four-second loop, at the same density as the field.
// Build before play, so the render loop only copies a sprite (movement stays smooth).
const HERO_FPS = 12, HERO_FRAMES = 48, HERO_SIZE = 224, HERO_X = 112, HERO_Y = 160;
let heroAnimation;
function cacheHeroAnimation() {
  if (heroAnimation?.id === heroId) return;
  if (heroAnimation) {
    for (const frame of heroAnimation.frames) { frame.width = 0; frame.height = 0; }
    heroAnimation = null;
  }
  const hero = heroes[heroId], frames = [];
  const saved = { X, T, OVERLAYS, CAM, JIT };
  try {
    for (let i = 0; i < HERO_FRAMES; i++) {
      const frame = document.createElement('canvas');
      frame.width = frame.height = HERO_SIZE * RENDER_SCALE;
      X = frame.getContext('2d'); X.scale(RENDER_SCALE, RENDER_SCALE);
      T = i / HERO_FPS; boilSeed(T); OVERLAYS = []; CAM = null; JIT = 0;
      const pose = heroId === 'neptune'
        ? { sit: 1, trident: true, tridentAng: -Math.PI / 2, eyes: 'smug', headTilt: .1, power: .3 }
        : { eyes: 'open', handR: [5, -16], handPoseR: 'fist' };
      hero.draw(HERO_X, HERO_Y, hero.scale, { ...pose, t: T, mouth: 'grin', boil: 0, noShadow: true });
      flushOverlays();
      frames.push(frame);
    }
    heroAnimation = { id: heroId, frames };
  } finally {
    ({ X, T, OVERLAYS, CAM, JIT } = saved);
    boilSeed(T);
  }
}
const stars = Array.from({ length: 65 }, (_, i) => ({ x: hash(i * 3 + 1) * WIDTH, y: hash(i * 3 + 2) * 490, r: .6 + hash(i * 3 + 3) * 1.2 }));
function controls() {
  const held = new Set([...touches.values()].flatMap(v => v.split('-')));
  input.left = keys.has('ArrowLeft') || keys.has('KeyA') || held.has('left');
  input.right = keys.has('ArrowRight') || keys.has('KeyD') || held.has('right');
  input.fire = keys.has('Space') || held.has('fire');
}
function release() { resetJoystick(); keys.clear(); touches.clear(); controls(); document.querySelectorAll('.touch button').forEach(b => b.classList.remove('active')); }
function announce(text) { $('announcement').textContent = text; }
function start() { unlockAudio(); release(); cacheHeroAnimation(); game.reset(); sync(); canvas.focus({preventScroll:true}); announce(`${heroes[heroId].name} started. Three crowns.`); }
function pause() {
  if (!['playing', 'paused'].includes(game.state)) return;
  unlockAudio();
  game.state = game.state === 'playing' ? 'paused' : 'playing'; release(); sync();
  if (game.state === 'playing') canvas.focus({preventScroll:true});
}
$('start').onclick = () => game.state === 'paused' ? pause() : start();
$('restart').onclick = start; $('pause').onclick = pause;
window.addEventListener('keydown', e => {
  if (['KeyP', 'Escape'].includes(e.code)) {
    e.preventDefault(); if (!e.repeat) pause(); return;
  }
  if (e.target instanceof HTMLButtonElement || e.target instanceof HTMLAnchorElement || e.target instanceof HTMLSelectElement) return;
  if (['ArrowLeft', 'ArrowRight', 'Space', 'KeyA', 'KeyD', 'KeyP', 'Escape'].includes(e.code)) e.preventDefault();
  if (['KeyP', 'Escape'].includes(e.code) && !e.repeat) pause();
  else { keys.add(e.code); controls(); }
});
window.addEventListener('keyup', e => { keys.delete(e.code); controls(); });
window.addEventListener('blur', () => { release(); if (game.state === 'playing') pause(); });
document.addEventListener('visibilitychange', () => { if (document.hidden) { release(); if (game.state === 'playing') pause(); } });

const joystick = document.querySelector('.joystick');
let steeringPointer = null;
function resetJoystick() {
  steeringPointer = null;
  joystick.classList.remove('active');
  joystick.style.setProperty('--stick-x', '0px');
  joystick.style.setProperty('--stick-y', '0px');
  joystick.dataset.direction = '';
}
function steer(e) {
  const r = joystick.getBoundingClientRect(), radius = r.width / 2;
  // This game has one movement axis; vertical thumb drift must not affect steering.
  const dx = e.clientX - r.x - radius, travel = radius * .5;
  joystick.style.setProperty('--stick-x', `${Math.max(-travel, Math.min(travel, dx))}px`);
  joystick.style.setProperty('--stick-y', '0px');
  const directions = [];
  if (Math.abs(dx) > radius * .18) directions.push(dx < 0 ? 'left' : 'right');
  const direction = directions.join('-');
  touches.set(e.pointerId, direction);
  joystick.dataset.direction = direction;
  controls();
}
joystick.addEventListener('pointerdown', e => {
  if (game.state !== 'playing' || steeringPointer !== null || (e.pointerType === 'mouse' && e.button !== 0)) return;
  unlockAudio();
  e.preventDefault(); steeringPointer = e.pointerId;
  joystick.setPointerCapture(e.pointerId); joystick.classList.add('active'); steer(e);
});
joystick.addEventListener('pointermove', e => { if (steeringPointer === e.pointerId) { e.preventDefault(); steer(e); } });
function endSteering(e) {
  if (steeringPointer !== e.pointerId) return;
  touches.delete(e.pointerId); resetJoystick(); controls();
}
for (const event of ['pointerup', 'pointercancel', 'lostpointercapture']) joystick.addEventListener(event, endSteering);
for (const button of document.querySelectorAll('[data-control]')) {
  button.addEventListener('pointerdown', e => {
    if (game.state !== 'playing' || (e.pointerType === 'mouse' && e.button !== 0)) return;
    unlockAudio(); e.preventDefault(); button.setPointerCapture(e.pointerId);
    touches.set(e.pointerId, button.dataset.control); button.classList.add('active'); controls();
  });
  const up = e => {
    touches.delete(e.pointerId); controls();
    button.classList.toggle('active', [...touches.values()].includes(button.dataset.control));
  };
  button.addEventListener('pointerup', up); button.addEventListener('pointercancel', up); button.addEventListener('lostpointercapture', up);
}
let lastUi = '';
function sync() {
  const signature = [game.score, game.wave, game.lives, game.state, game.invaders.length === 0].join(':');
  if (signature === lastUi) return;
  lastUi = signature;
  const selecting = game.state === 'ready';
  document.body.classList.toggle('play-session', !selecting);
  $('fighter-select').hidden = !selecting;
  canvas.hidden = selecting;
  canvas.parentElement.classList.toggle('selecting', selecting);
  $('choose-hero').disabled = selecting;
  $('restart').disabled = selecting;
  $('score').textContent = String(game.score).padStart(5, '0');
  $('wave').textContent = String(game.wave).padStart(2, '0');
  $('lives').textContent = '♛ '.repeat(game.lives).trim() || '—';
  $('pause').disabled = !['playing', 'paused'].includes(game.state);
  $('pause').textContent = game.state === 'paused' ? 'Resume' : 'Pause';
  $('state-label').textContent = ({ ready: 'READY WHEN YOU ARE', playing: 'RAINBOW POWER ONLINE', paused: 'TAKE A BREATHER', over: 'THE ROBOTS GOT THROUGH' })[game.state];
  $('overlay').hidden = ['playing', 'ready'].includes(game.state);
  $('wave-notice').hidden = game.state !== 'playing' || game.invaders.length > 0;
  const copy = {
    ready: [`YOUR HERO: ${heroes[heroId].name.toUpperCase()}`, 'ROBO INVASION!', 'Choose your hero above. Clear the Robo-Safadis.\nThree crowns. Endless waves. Rainbow power.', 'Start game'],
    paused: ['POWER DOWN. DEEP BREATH.', 'On a little break.', 'Your wave is waiting right here.\nReady to get back to the robots?', 'Resume game'],
    over: ['THE SEVEN SEAS NEED YOU', 'The robots win. For now.', `You scored ${game.score} points and reached wave ${game.wave}.\nReady for another invasion?`, 'Play again'],
  }[game.state];
  if (copy) {
    $('overlay-label').textContent = copy[0]; $('overlay-title').textContent = copy[1];
    $('overlay-copy').textContent = copy[2]; $('overlay-copy').style.whiteSpace = 'pre-line';
    $('start').textContent = copy[3] + ' ↗';
  }
}
const rainbow = ['#FF5A5A', '#FFAF49', '#FFE066', '#7CFF9B', '#7FD3FF', '#C9A0FF'];
function arcade(text, x, y, size, color, align = 'center') {
  ctx.font = `900 ${size}px Impact, 'Arial Black', sans-serif`; ctx.textAlign = align; ctx.textBaseline = 'middle';
  ctx.lineJoin = 'round'; ctx.lineWidth = size * .18; ctx.strokeStyle = '#0B0B14'; ctx.strokeText(text,x,y);
  ctx.fillStyle = color; ctx.fillText(text,x,y);
}
function render() {
  X = ctx; T = game.time; boilSeed(T); OVERLAYS = []; CAM = null; JIT = 0;
  ctx.setTransform(RENDER_SCALE, 0, 0, RENDER_SCALE, 0, 0);
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  const sky = ctx.createLinearGradient(0, 0, 0, HEIGHT); sky.addColorStop(0, '#070A1C'); sky.addColorStop(1, '#1B1240');
  ctx.fillStyle = sky; ctx.fillRect(0, 0, WIDTH, HEIGHT);
  for (const star of stars) { ctx.globalAlpha = .4 + star.r * .2; ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(star.x, (star.y + game.time * 12 * star.r) % HEIGHT, star.r, 0, Math.PI * 2); ctx.fill(); }
  ctx.globalAlpha = 1;
  arcade('SCORE ' + String(game.score).padStart(6, '0'), 22, 26, 22, '#FFFFFF', 'left');
  arcade('ROBO INVASION', WIDTH / 2, 26, 27, '#FF5A5A');
  arcade('WAVE ' + String(game.wave).padStart(2,'0'), WIDTH - 22, 26, 22, '#FFE066', 'right');
  for (const enemy of game.invaders) {
    const frame = (Math.floor(game.time * 7) + enemy.col) % robots.length;
    ctx.drawImage(robots[frame], enemy.x - ROBOT_SIZE / 2, enemy.y - 88 * CHARACTER_SCALE, ROBOT_SIZE, ROBOT_SIZE);
  }
  if (game.state !== 'ready' && heroAnimation?.id === heroId) {
    const frame = Math.floor(game.time * HERO_FPS) % HERO_FRAMES;
    ctx.drawImage(heroAnimation.frames[frame], game.player.x - HERO_X, game.player.y - HERO_Y, HERO_SIZE, HERO_SIZE);
  }
  for (const bolt of game.bolts) {
    ctx.shadowColor = '#7FD3FF'; ctx.shadowBlur = 12 * RENDER_SCALE;
    rainbow.forEach((color,i) => { ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(bolt.x + (i-2.5)*2, bolt.y + 21); ctx.lineTo(bolt.x + (i-2.5)*2, bolt.y - 12); ctx.stroke(); });
  }
  ctx.shadowBlur = 0;
  ctx.strokeStyle = '#FF4A4A'; ctx.lineWidth = 3;
  for (const drop of game.drops) { ctx.beginPath(); ctx.moveTo(drop.x-4,drop.y-12); ctx.lineTo(drop.x+4,drop.y-5); ctx.lineTo(drop.x-4,drop.y+2); ctx.lineTo(drop.x+4,drop.y+9); ctx.stroke(); }
  if (game.player.immune > 0 && game.state === 'playing') {
    ctx.strokeStyle = '#7FD3FF66'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(game.player.x, 471, 49, 48, 0, 0, Math.PI * 2); ctx.stroke();
  }
  for (const p of game.sparks) { ctx.globalAlpha = Math.max(0, p.life * 2); ctx.fillStyle = p.color; ctx.fillRect(p.x - 2, p.y - 2, 4, 4); }
  ctx.globalAlpha = 1;
  flushOverlays();
  ctx.fillStyle = '#00000016'; for (let y=0; y<HEIGHT; y+=4) ctx.fillRect(0,y,WIDTH,1);
  const shade = ctx.createRadialGradient(480,270,220,480,270,570); shade.addColorStop(0,'#0000'); shade.addColorStop(1,'#0008'); ctx.fillStyle=shade; ctx.fillRect(0,0,WIDTH,HEIGHT);
}
let previous = 0, accumulator = 0, previousState = game.state, previousWave = game.wave, previousLives = game.lives;
function tick(now) {
  const elapsed = previous ? Math.min((now - previous) / 1000, .1) : 0; previous = now;
  if (game.state === 'playing') {
    accumulator += elapsed;
    while (accumulator >= 1 / 120) { game.update(1 / 120, input);
      for (const event of game.events.splice(0)) playSound(event);
      accumulator -= 1 / 120; }
  } else accumulator = 0;
  if (game.state !== previousState || game.wave !== previousWave || game.lives !== previousLives) {
    if (game.state === 'over') announce(`Game over. Score ${game.score}. Wave ${game.wave}.`);
    else if (game.wave !== previousWave) announce(`Wave ${game.wave}.`);
    else if (game.lives !== previousLives) announce(`${game.lives} crowns remaining.`);
    previousState = game.state; previousWave = game.wave; previousLives = game.lives;
  }
  sync(); render(); requestAnimationFrame(tick);
}
sync(); render(); requestAnimationFrame(tick);
