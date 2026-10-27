export const WIDTH = 960, HEIGHT = 540;
export class Game {
  constructor(random = Math.random) { this.random = random; this.reset(); this.state = 'ready'; }
  reset() {
    this.state = 'playing'; this.score = 0; this.lives = 3; this.wave = 1; this.time = 0;
    this.player = { x: WIDTH / 2, y: 516, immune: 1.5 }; this.cooldown = 0;
    this.bolts = []; this.drops = []; this.sparks = []; this.nextWave = 0; this.spawn();
  }
  spawn() {
    this.invaders = [];
    for (let row = 0; row < 3; row++) for (let col = 0; col < 6; col++)
      this.invaders.push({ x: 240 + col * 96, y: 150 + row * 84, row, col });
    this.direction = 1; this.fireTimer = 1.2; this.nextWave = 0;
    this.player.immune = Math.max(this.player.immune, 1.5);
  }
  burst(x, y, color) {
    for (let i = 0; i < 12; i++) {
      const angle = i / 12 * Math.PI * 2;
      this.sparks.push({ x, y, vx: Math.cos(angle) * 110, vy: Math.sin(angle) * 110, life: .5, color });
    }
  }
  hurt() {
    if (this.player.immune > 0 || this.state !== 'playing') return;
    this.lives--; this.player.immune = 2; this.burst(this.player.x, 473, '#ff8b9c');
    if (!this.lives) this.state = 'over';
  }
  update(dt, input = {}) {
    if (this.state !== 'playing') return;
    this.time += dt;
    this.player.immune = Math.max(0, this.player.immune - dt);
    this.player.x = Math.max(60, Math.min(WIDTH - 60, this.player.x + ((input.right ? 1 : 0) - (input.left ? 1 : 0)) * 360 * dt));
    this.cooldown -= dt;
    if (input.fire && this.cooldown <= 0) {
      this.bolts.push({ x: this.player.x + 38, y: this.player.y - 122 }); this.cooldown = .22;
    }
    for (const bolt of this.bolts) {
      bolt.y -= 650 * dt;
      const target = this.invaders.find(e => Math.abs(e.x - bolt.x) < 26 && bolt.y > e.y - 78 && bolt.y < e.y + 5);
      if (target) {
        this.invaders.splice(this.invaders.indexOf(target), 1); bolt.y = -100;
        this.score += 350; this.burst(target.x, target.y - 28, '#FFE066');
      }
    }
    this.bolts = this.bolts.filter(b => b.y > -20);
    if (this.invaders.length) {
      const speed = 21 + (this.wave - 1) * 8 + (18 - this.invaders.length) * 2.6;
      const movement = this.direction * speed * dt;
      if (this.invaders.some(e => e.x + movement < 50 || e.x + movement > WIDTH - 50)) {
        this.direction *= -1;
        this.invaders.forEach(e => e.y += 22);
      } else this.invaders.forEach(e => e.x += movement);
      if (this.invaders.some(e => e.y >= 414)) this.state = 'over';
      this.fireTimer -= dt;
      if (this.fireTimer <= 0) {
        // Only the lowest surviving robot in each column can fire.
        const front = this.invaders.filter(e => !this.invaders.some(other => other.col === e.col && other.y > e.y));
        const shooter = front[Math.floor(this.random() * front.length)];
        this.drops.push({ x: shooter.x, y: shooter.y, speed: Math.min(350, 175 + this.wave * 14) });
        this.fireTimer = Math.max(.24, 1.05 - this.wave * .065) * (.7 + this.random() * .6);
      }
    } else {
      this.nextWave += dt;
      if (this.nextWave > 1.8) { this.wave++; this.drops = []; this.bolts = []; this.spawn(); }
    }
    for (const drop of this.drops) {
      drop.y += drop.speed * dt;
      if (Math.abs(drop.x - this.player.x) < 29 && drop.y > 433 && drop.y < 516) { this.hurt(); drop.y = HEIGHT + 30; }
    }
    this.drops = this.drops.filter(d => d.y < HEIGHT + 20);
    for (const p of this.sparks) { p.life -= dt; p.x += p.vx * dt; p.y += p.vy * dt; }
    this.sparks = this.sparks.filter(p => p.life > 0);
  }
}
