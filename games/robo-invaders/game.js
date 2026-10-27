import { Game, WIDTH, HEIGHT } from './model.js';
const $ = id => document.getElementById(id);
const canvas = $('game'), ctx = canvas.getContext('2d'), game = new Game();
const RENDER_SCALE = 2, CHARACTER_SCALE = 1.25, ROBOT_SIZE = 100 * CHARACTER_SCALE;
canvas.width = WIDTH * RENDER_SCALE; canvas.height = HEIGHT * RENDER_SCALE;
const input = { left: false, right: false, fire: false }, keys = new Set(), touches = new Map();
X = ctx;
// Cache the detailed rig once for each marching frame, rather than repainting every robot.
const robots = Array.from({ length: 4 }, (_, i) => {
  const sprite = document.createElement('canvas'); sprite.width = ROBOT_SIZE * RENDER_SCALE; sprite.height = ROBOT_SIZE * RENDER_SCALE;
  X = sprite.getContext('2d'); X.scale(RENDER_SCALE * CHARACTER_SCALE, RENDER_SCALE * CHARACTER_SCALE); T = i / 8; boilSeed(T);
  roboSafadi(50, 88, 2.15, { t: T, ...roboSafadiWalk(i / 4), red: .8, hum: false, noShadow: true, boil: .25 });
  return sprite;
});
X = ctx;
const stars = Array.from({ length: 65 }, (_, i) => ({ x: hash(i * 3 + 1) * WIDTH, y: hash(i * 3 + 2) * 490, r: .6 + hash(i * 3 + 3) * 1.2 }));
function controls() {
  const held = new Set(touches.values());
  input.left = keys.has('ArrowLeft') || keys.has('KeyA') || held.has('left');
  input.right = keys.has('ArrowRight') || keys.has('KeyD') || held.has('right');
  input.fire = keys.has('Space') || held.has('fire');
}
function release() { keys.clear(); touches.clear(); controls(); document.querySelectorAll('.touch button').forEach(b => b.classList.remove('active')); }
function announce(text) { $('announcement').textContent = text; }
function start() { release(); game.reset(); canvas.focus(); sync(); announce('Game started. Three lives.'); }
function pause() {
  if (!['playing', 'paused'].includes(game.state)) return;
  game.state = game.state === 'playing' ? 'paused' : 'playing'; release(); sync();
  if (game.state === 'playing') canvas.focus();
}
$('start').onclick = () => game.state === 'paused' ? pause() : start();
$('restart').onclick = start; $('pause').onclick = pause;
window.addEventListener('keydown', e => {
  if (['KeyP', 'Escape'].includes(e.code)) {
    e.preventDefault(); if (!e.repeat) pause(); return;
  }
  if (e.target instanceof HTMLButtonElement || e.target instanceof HTMLAnchorElement) return;
  if (['ArrowLeft', 'ArrowRight', 'Space', 'KeyA', 'KeyD', 'KeyP', 'Escape'].includes(e.code)) e.preventDefault();
  if (['KeyP', 'Escape'].includes(e.code) && !e.repeat) pause();
  else { keys.add(e.code); controls(); }
});
window.addEventListener('keyup', e => { keys.delete(e.code); controls(); });
window.addEventListener('blur', () => { release(); if (game.state === 'playing') pause(); });
document.addEventListener('visibilitychange', () => { if (document.hidden) { release(); if (game.state === 'playing') pause(); } });
for (const button of document.querySelectorAll('[data-control]')) {
  button.addEventListener('pointerdown', e => {
    e.preventDefault(); button.setPointerCapture(e.pointerId);
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
  $('score').textContent = String(game.score).padStart(5, '0');
  $('wave').textContent = String(game.wave).padStart(2, '0');
  $('lives').textContent = '♥ '.repeat(game.lives).trim() || '—';
  $('pause').disabled = !['playing', 'paused'].includes(game.state);
  $('pause').textContent = game.state === 'paused' ? 'Resume' : 'Pause';
  $('state-label').textContent = ({ ready: 'READY WHEN YOU ARE', playing: 'CHALK SYSTEMS ONLINE', paused: 'TAKE A BREATHER', over: 'THE BRIGADE GOT THROUGH' })[game.state];
  $('overlay').hidden = game.state === 'playing';
  $('wave-notice').hidden = game.state !== 'playing' || game.invaders.length > 0;
  const copy = {
    ready: ['THE BROCCOLI BRIGADE IS APPROACHING', 'The doctor is in.', 'Clear the replicas with glowing chalk bolts.\nThree lives. Endless waves. Stay curious.', 'Start game'],
    paused: ['CHALK DOWN. DEEP BREATH.', 'On a little break.', 'Your wave is waiting right here.\nReady to get back to the robots?', 'Resume game'],
    over: ['A VALIANT PRESCRIPTION', 'The robots win. For now.', `You scored ${game.score} points and reached wave ${game.wave}.\nTime for another appointment?`, 'Play again'],
  }[game.state];
  if (copy) {
    $('overlay-label').textContent = copy[0]; $('overlay-title').textContent = copy[1];
    $('overlay-copy').textContent = copy[2]; $('overlay-copy').style.whiteSpace = 'pre-line';
    $('start').textContent = copy[3] + ' ↗';
  }
}
function broccoli(x, y) {
  ctx.strokeStyle = '#a9d683'; ctx.lineWidth = 5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x, y + 7); ctx.lineTo(x, y - 5); ctx.stroke();
  ctx.fillStyle = '#69b96f'; ctx.strokeStyle = '#b4e594'; ctx.lineWidth = 1.3;
  for (const [dx, dy, r] of [[-5, -3, 5], [5, -3, 5], [0, -7, 6]]) {
    ctx.beginPath(); ctx.arc(x + dx, y + dy, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  }
}
function render() {
  X = ctx; T = game.time; boilSeed(T); OVERLAYS = []; CAM = null; JIT = 0;
  ctx.setTransform(RENDER_SCALE, 0, 0, RENDER_SCALE, 0, 0);
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  const sky = ctx.createLinearGradient(0, 0, 0, HEIGHT); sky.addColorStop(0, '#101e2a'); sky.addColorStop(1, '#203c3e');
  ctx.fillStyle = sky; ctx.fillRect(0, 0, WIDTH, HEIGHT);
  for (const star of stars) { ctx.globalAlpha = .3 + star.r * .2; ctx.fillStyle = '#c8e9d6'; ctx.fillRect(star.x, star.y, star.r, star.r); }
  ctx.globalAlpha = 1;
  ctx.strokeStyle = '#a9f4c712'; ctx.lineWidth = 1;
  for (let i = 0; i < 15; i++) { ctx.beginPath(); ctx.moveTo(480 + (i - 7) * 40, 498); ctx.lineTo(480 + (i - 7) * 150, HEIGHT); ctx.stroke(); }
  for (const y of [498, 518, 548, 590, 639]) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(WIDTH, y); ctx.stroke(); }
  ctx.strokeStyle = '#a9f4c738'; ctx.setLineDash([5, 8]); ctx.beginPath(); ctx.moveTo(0, 513); ctx.lineTo(WIDTH, 513); ctx.stroke(); ctx.setLineDash([]);
  for (const enemy of game.invaders) {
    const frame = (Math.floor(game.time * 7) + enemy.col) % robots.length;
    ctx.drawImage(robots[frame], enemy.x - ROBOT_SIZE / 2, enemy.y - 88 * CHARACTER_SCALE, ROBOT_SIZE, ROBOT_SIZE);
  }
  ctx.fillStyle = '#ddfff0'; ctx.shadowColor = '#a9ffcc'; ctx.shadowBlur = 16 * RENDER_SCALE;
  for (const bolt of game.bolts) { ctx.fillRect(bolt.x - 2.5, bolt.y - 15, 5, 20); }
  ctx.shadowBlur = 0;
  for (const drop of game.drops) broccoli(drop.x, drop.y);
  ctx.save();
  if (game.player.immune > 0 && game.state === 'playing') ctx.globalAlpha = .55 + .45 * Math.sin(game.time * 25) ** 2;
  const moving = input.left || input.right;
  sami(game.player.x, game.player.y, 2.7 * CHARACTER_SCALE, { t: game.time, ...(moving ? samiWalk(game.time * 3, .45) : {}),
    noShadow: true, boil: .3, handL: [-3.8, -12], handR: [0, -31], handPoseR: 'pointer', pointerAng: -Math.PI / 2, pointerLen: 4,
    mouth: 'smile', brows: 'focused', lookY: -.65 });
  ctx.restore();
  if (game.player.immune > 0 && game.state === 'playing') {
    ctx.strokeStyle = '#a9f4c755'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(game.player.x, 555, 44, 65, 0, 0, Math.PI * 2); ctx.stroke();
  }
  for (const p of game.sparks) { ctx.globalAlpha = Math.max(0, p.life * 2); ctx.fillStyle = p.color; ctx.fillRect(p.x - 2, p.y - 2, 4, 4); }
  ctx.globalAlpha = 1;
  flushOverlays();
}
let previous = 0, accumulator = 0, previousState = game.state, previousWave = game.wave, previousLives = game.lives;
function tick(now) {
  const elapsed = previous ? Math.min((now - previous) / 1000, .1) : 0; previous = now;
  if (game.state === 'playing') {
    accumulator += elapsed;
    while (accumulator >= 1 / 120) { game.update(1 / 120, input); accumulator -= 1 / 120; }
  } else accumulator = 0;
  if (game.state !== previousState || game.wave !== previousWave || game.lives !== previousLives) {
    if (game.state === 'over') announce(`Game over. Score ${game.score}. Wave ${game.wave}.`);
    else if (game.wave !== previousWave) announce(`Wave ${game.wave}.`);
    else if (game.lives !== previousLives) announce(`${game.lives} lives remaining.`);
    previousState = game.state; previousWave = game.wave; previousLives = game.lives;
  }
  sync(); render(); requestAnimationFrame(tick);
}
sync(); render(); requestAnimationFrame(tick);
