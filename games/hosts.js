// Editable animation driver; run node scripts/build-arcade-hosts.mjs after editing.
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const hosts = [...document.querySelectorAll('.host img')].map((image, index) => {
  const canvas = document.createElement('canvas');
  canvas.width = 480;
  canvas.height = 600;
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', image.alt);
  image.after(canvas);
  return { image, canvas, index, context: canvas.getContext('2d') };
});
// Each brother reacts briefly every six seconds, then returns to his skeptical pose.
const reactions = [
  { eyes: 'narrow', brows: 'focused', mouth: 'frown', lookX: -.8, lookY: .2, tilt: -.035 },
  { eyes: 'wide', brows: 'up', mouth: 'o', lookX: .1, lookY: 0, tilt: .025 },
  { eyes: 'narrow', brows: 'quizzical', mouth: 'smirk', lookX: .9, lookY: -.4, tilt: .04 },
  { eyes: 'narrow', brows: 'worried', mouth: 'flat', lookX: -.5, lookY: -.8, tilt: .03 },
];
function faceAt(t, index, still) {
  const base = { eyes: 'narrow', brows: 'quizzical', mouth: index ? 'smirk' : 'flat',
    lookX: index ? -.5 : .5, lookY: 0, tilt: index ? .07 : -.07 };
  if (still) return { ...base, blink: 0, browShift: 0 };
  const phase = t % 6;
  const reaction = reactions[(Math.floor(t / 6) + index * 2) % reactions.length];
  const reacting = phase >= 4 && phase < 5.8;
  const face = reacting ? reaction : base;
  const strength = ease(seg(phase, 3.7, 4.3)) * (1 - ease(seg(phase, 5.5, 6)));
  // Close the eyes briefly at expression changes to soften the transition.
  const blinkAt = (center, duration) => Math.max(0, 1 - Math.abs(phase - center) / duration);
  const blink = Math.max(blinkAt(1.2, .11), blinkAt(4, .13), blinkAt(5.8, .13));
  return { ...face, blink, browShift: Math.sin(t * 1.5) * .12,
    lookX: lerp(base.lookX, reaction.lookX, strength),
    lookY: lerp(base.lookY, reaction.lookY, strength),
    tilt: base.tilt + reaction.tilt * strength };
}
function draw(time) {
  for (const { image, canvas, index, context } of hosts) {
    X = context;
    X.clearRect(0, 0, 480, 600);
    const t = reducedMotion.matches ? 0 : time + index * 1.7;
    CHARACTERS[index ? 'safadi' : 'sami'].draw(240, 565, 17, {
      t, boil: 0, breathe: false, ...faceAt(t, index, reducedMotion.matches),
      handL: [-3.2, -9.5], handPoseL: 'fist',
      handR: index ? [5.3, -12.6] : [.8, -16.1], handPoseR: index ? 'palm' : 'fist',
    });
    image.hidden = true;
    canvas.hidden = false;
  }
}
let frame;
let last = -Infinity;
function animate(now) {
  if (now - last >= 1000 / 30) { draw(now / 1000); last = now; }
  frame = requestAnimationFrame(animate);
}
function sync() {
  cancelAnimationFrame(frame);
  if (document.hidden || reducedMotion.matches) draw(0);
  else frame = requestAnimationFrame(animate);
}
reducedMotion.addEventListener('change', sync);
document.addEventListener('visibilitychange', sync);
sync();
