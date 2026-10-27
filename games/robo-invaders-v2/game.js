import { Game, WIDTH, HEIGHT } from './model.js';
const $ = id => document.getElementById(id);
const canvas = $('game'), ctx = canvas.getContext('2d'), game = new Game();
const RENDER_SCALE = 2, CHARACTER_SCALE = 1.1, ROBOT_SIZE = 110;
canvas.width = WIDTH * RENDER_SCALE; canvas.height = HEIGHT * RENDER_SCALE;
const input = { left: false, right: false, fire: false }, keys = new Set(), touches = new Map();
X = ctx;
// Cache the detailed rig once for each marching frame, rather than repainting every robot.
const robots = Array.from({ length: 4 }, (_, i) => {
  const sprite = document.createElement('canvas'); sprite.width = ROBOT_SIZE * RENDER_SCALE; sprite.height = ROBOT_SIZE * RENDER_SCALE;
  X = sprite.getContext('2d'); X.scale(RENDER_SCALE * CHARACTER_SCALE, RENDER_SCALE * CHARACTER_SCALE); T = i / 8; boilSeed(T);
  roboSafadi(50, 88, 2.5, { t: T, red: 1, hum: false, noShadow: true, boil: 0, mouth: 'teeth', brows: 'angry', handL: i % 2 ? [-6,-20] : [-6.5,-14], handR: i % 2 ? [6.5,-14] : [6,-20], handPoseL: 'claw', handPoseR: 'claw', antenna: i % 2 ? .3 : -.3 });
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
function start() { release(); game.reset(); canvas.focus(); sync(); announce('Game started. Three crowns.'); }
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
  $('lives').textContent = '♛ '.repeat(game.lives).trim() || '—';
  $('pause').disabled = !['playing', 'paused'].includes(game.state);
  $('pause').textContent = game.state === 'paused' ? 'Resume' : 'Pause';
  $('state-label').textContent = ({ ready: 'READY WHEN YOU ARE', playing: 'RAINBOW POWER ONLINE', paused: 'TAKE A BREATHER', over: 'THE ROBOTS GOT THROUGH' })[game.state];
  $('overlay').hidden = game.state === 'playing';
  $('wave-notice').hidden = game.state !== 'playing' || game.invaders.length > 0;
  const copy = {
    ready: ['PLAYER 1: PROF. SAFADI', 'ROBO INVASION!', 'Raise your trident. Clear the Robo-Safadis.\nThree crowns. Endless waves. Rainbow power.', 'Start game'],
    paused: ['TRIDENT DOWN. DEEP BREATH.', 'On a little break.', 'Your wave is waiting right here.\nReady to get back to the robots?', 'Resume game'],
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
  ctx.fillStyle = '#3BE07A'; ctx.fillRect(0, 518, WIDTH, 4);
  arcade('SCORE ' + String(game.score).padStart(6, '0'), 22, 26, 22, '#FFFFFF', 'left');
  arcade('ROBO INVASION', WIDTH / 2, 26, 27, '#FF5A5A');
  arcade('WAVE ' + String(game.wave).padStart(2,'0'), WIDTH - 22, 26, 22, '#FFE066', 'right');
  for (const enemy of game.invaders) {
    const frame = (Math.floor(game.time * 7) + enemy.col) % robots.length;
    ctx.drawImage(robots[frame], enemy.x - ROBOT_SIZE / 2, enemy.y - 88 * CHARACTER_SCALE, ROBOT_SIZE, ROBOT_SIZE);
  }
  ctx.save();
  if (game.player.immune > 0 && game.state === 'playing') ctx.globalAlpha = .55 + .45 * Math.sin(game.time * 25) ** 2;
  neptune(game.player.x, game.player.y, 5.2, { t: game.time, sit: 1, trident: true, tridentAng: -Math.PI / 2, eyes: 'smug', mouth: 'grin', headTilt: .1, power: .3, boil: 0, noShadow: true });
  ctx.restore();
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
    while (accumulator >= 1 / 120) { game.update(1 / 120, input); accumulator -= 1 / 120; }
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
