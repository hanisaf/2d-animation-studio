import { Match, WIDTH, HEIGHT } from './model.js';
const $=id=>document.getElementById(id), canvas=$('game'),ctx=canvas.getContext('2d'),match=new Match();
const audio=new SoccerAudio();
const names={sami:'Dr. Sami',safadi:'Professor Safadi',housam:'Housam',alma:'Alma',jenna:'Jenna',danny:'Danny'};
const rigs={sami,safadi,housam,alma,jenna,danny},scales={sami:2.7,safadi:2.7,housam:2.3,alma:2.6,jenna:2.35,danny:2.1};
const walks={sami:samiWalk,safadi:safadiWalk,housam:housamDribble,alma:almaSkip,jenna:jennaSkip,danny:dannyDribble};
const sprites={};
// Native 2x caches preserve the detailed studio artwork at a small gameplay size.
for(const id of Object.keys(rigs)) {
  sprites[id]=Array.from({length:4},(_,frame)=>{
    const c=document.createElement('canvas'); c.width=240;c.height=240; X=c.getContext('2d');X.scale(2,2);T=frame/8;boilSeed(T);OVERLAYS=[];CAM=null;JIT=0;
    rigs[id](60,108,scales[id],{...walks[id](frame/2),t:T,boil:0,noShadow:true,giraffe:false,mouth:'smile',lookX:id==='sami'||id==='safadi'?.4:-.4});OVERLAYS=[];return c;
  });
}
for(const id of ['sami','housam']) $('portrait-'+id).src=sprites[id][0].toDataURL();
X=ctx;
const keys=new Set(),pointers=new Map(); let last=0,accumulator=0,previousNotice='',hero='sami',team=0;
const mapping={ArrowUp:'up',KeyW:'up',ArrowDown:'down',KeyS:'down',ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',KeyC:'pass',Space:'shoot',KeyX:'chip',ShiftLeft:'sprint',ShiftRight:'sprint'};
function release(){resetJoystick();keys.clear();pointers.clear();document.querySelectorAll('[data-control]').forEach(b=>b.classList.remove('active'));}
function controls(){const result={};for(const k of keys) result[mapping[k]]=true;for(const v of pointers.values())for(const direction of v.split('-'))result[direction]=true;return result;}
function announce(message){$('announcement').textContent=message;}
function choose(value){release();audio.stop();team=Number(value);match.reset(hero,team);document.querySelectorAll('[data-team]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.team)===team)));sync();}
document.querySelectorAll('[data-team]').forEach(b=>b.onclick=()=>choose(b.dataset.team));
function start(){audio.stop();audio.unlock();release();if(match.state==='paused')match.resume();else{match.reset(hero,team);match.start();}sync();canvas.focus({preventScroll:true});}
function pause(){audio.stop();release();if(match.state==='playing')match.pause();else if(match.state==='paused')match.resume();sync();}
$('sound').onclick=()=>{audio.enabled=!audio.enabled;if(audio.enabled)audio.unlock();else audio.stop();$('sound').textContent=`Sound: ${audio.enabled?'on':'off'}`;$('sound').setAttribute('aria-pressed',String(audio.enabled));};
$('start').onclick=start;$('pause').onclick=pause;$('restart').onclick=()=>{match.reset(hero,team);start();};
$('choose').onclick=()=>{audio.stop();release();match.reset(hero,team);sync();document.querySelector(`[data-team="${team}"]`).focus();};
window.addEventListener('keydown',e=>{
  const focused=/^(BUTTON|A|INPUT)$/.test(e.target.tagName);
  if(e.code==='KeyP'&&!focused){e.preventDefault();pause();return;}
  if(mapping[e.code]&&match.state==='playing'&&!focused){e.preventDefault();keys.add(e.code);}
});
window.addEventListener('keyup',e=>keys.delete(e.code));

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
  const dx = e.clientX - r.x - radius, dy = e.clientY - r.y - radius;
  const distance = Math.hypot(dx, dy), travel = radius * .5;
  const scale = distance > travel ? travel / distance : 1;
  joystick.style.setProperty('--stick-x', `${dx * scale}px`);
  joystick.style.setProperty('--stick-y', `${dy * scale}px`);
  const directions = [];
  if (distance > radius * .18) {
    if (Math.abs(dy) > distance * .38) directions.push(dy < 0 ? 'up' : 'down');
    if (Math.abs(dx) > distance * .38) directions.push(dx < 0 ? 'left' : 'right');
  }
  const direction = directions.join('-');
  pointers.set(e.pointerId, direction);
  joystick.dataset.direction = direction;

}
joystick.addEventListener('pointerdown', e => {
  if (match.state !== 'playing' || steeringPointer !== null || (e.pointerType === 'mouse' && e.button !== 0)) return;
  audio.unlock();
  e.preventDefault(); steeringPointer = e.pointerId;
  joystick.setPointerCapture(e.pointerId); joystick.classList.add('active'); steer(e);
});
joystick.addEventListener('pointermove', e => { if (steeringPointer === e.pointerId) { e.preventDefault(); steer(e); } });
function endSteering(e) {
  if (steeringPointer !== e.pointerId) return;
  pointers.delete(e.pointerId); resetJoystick();
}
for (const event of ['pointerup', 'pointercancel', 'lostpointercapture']) joystick.addEventListener(event, endSteering);
for(const b of document.querySelectorAll('[data-control]')){
  b.addEventListener('pointerdown',e=>{if(match.state!=='playing'||(e.pointerType==='mouse'&&e.button!==0))return;audio.unlock();e.preventDefault();b.setPointerCapture(e.pointerId);pointers.set(e.pointerId,b.dataset.control);b.classList.add('active');});
  const feedback=()=>document.querySelectorAll('[data-control]').forEach(button=>button.classList.toggle('active',[...pointers.values()].includes(button.dataset.control)));
  const end=e=>{pointers.delete(e.pointerId);feedback();};
  b.addEventListener('pointerup',end);b.addEventListener('pointercancel',end);b.addEventListener('lostpointercapture',end);
}
window.addEventListener('blur',()=>{audio.stop();release();match.pause();sync();});
document.addEventListener('visibilitychange',()=>{if(document.hidden){audio.stop();release();match.pause();sync();}});
function sync(){
  document.body.classList.toggle('play-session',match.state!=='ready');
  const ready=match.state==='ready',paused=match.state==='paused',finished=match.state==='finished';
  $('overlay').hidden=match.state==='playing';$('selection').hidden=!ready;$('result-copy').hidden=!finished;
  $('overlay-title').textContent=ready?'CHOOSE YOUR TEAM':paused?'HALF-TIME BREATHER':match.notice;
  $('overlay-label').textContent=paused?'TAKE YOUR TIME':'SCENE 32 · SCREEN TIME';
  $('result-copy').textContent=`Grown-ups ${match.score[0]} — ${match.score[1]} Kids’ Team. ${match.score[team]>match.score[1-team]?'Your team takes the trophy! Now go play outside!':'Time for a rematch?'}`;
  $('start').textContent=ready?'KICK OFF →':paused?'RESUME →':'PLAY AGAIN →';
  $('pause').disabled=ready||finished;$('pause').textContent=paused?'Resume':'Pause';
  $('player-name').textContent='GROWN-UPS';
  $('player-score').textContent=match.score[0];$('kids-score').textContent=match.score[1];
  const seconds=Math.ceil(match.time);$('timer').textContent=`${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`;
  $('stamina').value=match.stamina;
  $('status').textContent=ready?'CHOOSE YOUR TEAM':paused?'MATCH PAUSED':finished?'FULL TIME':match.ball.owner===match.player.id?`${names[match.player.id].toUpperCase()} · ${match.player.team===0?'GROWN-UPS · ATTACK →':'KIDS · ← ATTACK'}`:match.ball.owner?'DEFEND · WIN THE BALL!':match.notice||'CHASE THE BALL!';
  const notice=match.state==='playing'?match.notice:match.state;
  if(notice!==previousNotice){previousNotice=notice;announce(ready?'Choose team grown-ups or team kids.':paused?'Match paused.':finished?match.notice:notice);}
}
function rect(x,y,w,h,color){ctx.fillStyle=color;ctx.fillRect(x,y,w,h);}
function line(x1,y1,x2,y2,color='#d7edc2',width=2){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();}
function label(text,x,y,size=12,color='#e9f0d6'){ctx.fillStyle=color;ctx.font=`800 ${size}px system-ui`;ctx.textAlign='center';ctx.fillText(text,x,y);}
function oval(x,y,rx,ry,color){ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill();}
function goal(x){
  rect(x,244,32,148,'#d7f1ec20');
  for(let y=246;y<393;y+=12)line(x,y,x+32,y,'#d7f1ec55',1);
  for(let xx=x;xx<=x+32;xx+=8)line(xx,244,xx,392,'#d7f1ec55',1);
  line(x,244,x+32,244,'#f7f4d9',4);line(x,244,x,392,'#f7f4d9',4);line(x+32,244,x+32,392,'#f7f4d9',4);
}
function render(){
  // Crop the 44 logical pixels vacated by the removed spectator rows.
  ctx.setTransform(2,0,0,2,0,-88);rect(0,44,WIDTH,HEIGHT,'#102f38');
  // Stadium tiers, colored spectators and warm floodlights.
  for(let row=0;row<2;row++){
    rect(0,64+row*22,960,18,row%2?'#224550':'#193b46');
    for(let i=0;i<70;i++){const h=hash(i+row*79);oval(8+i*14,73+row*22+Math.sin(match.clock*3+i)*1.3,3.5,4,['#dfb58c','#e0c565','#62bfa8','#a3baca','#c57583'][Math.floor(h*5)]);}
  }
  rect(0,108,960,34,'#09282d');label('WORLD CHAMPION',480,131,19,'#f6d57b');label('SAFADIS’ CUP',155,130,12,'#b6d7cb');label('KIDS’ TEAM · HOME END',795,130,11,'#b6d7cb');
  rect(38,148,884,340,'#1d7460');
  for(let i=0;i<10;i++)rect(70+i*82,160,82,310,i%2?'#328a67':'#2c805d');
  ctx.strokeStyle='#c3e5aa';ctx.lineWidth=2;ctx.strokeRect(70,160,820,310);line(480,160,480,470);
  ctx.beginPath();ctx.ellipse(480,315,75,64,0,0,Math.PI*2);ctx.stroke();oval(480,315,3,3,'#d7edc2');
  ctx.strokeRect(70,224,120,182);ctx.strokeRect(770,224,120,182);ctx.strokeRect(70,268,45,90);ctx.strokeRect(845,268,45,90);
  oval(160,315,3,3,'#d7edc2');oval(800,315,3,3,'#d7edc2');goal(38);goal(890);
  label('← KIDS ATTACK',170,513,11,'#95c7b1');label('DRIBBLE. DODGE. CHIP. GLORY.',480,513,11,'#e0cc8c');label('GROWN-UPS ATTACK →',790,513,11,'#e7d57a');
  const actors=match.actors.sort((a,b)=>a.y-b.y);
  for(const actor of actors){
    const player=actor===match.player,frame=actor.moving?Math.floor(match.clock*9)%4:0;
    oval(actor.x,actor.y+2,20,6,'#092c3545');
    if(player){ctx.strokeStyle='#ffe58e';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(actor.x,actor.y,24,9,0,0,Math.PI*2);ctx.stroke();}
    ctx.save();ctx.translate(actor.x,actor.y);if(actor.face<0)ctx.scale(-1,1);ctx.drawImage(sprites[actor.id][frame],-60,-108,120,120);ctx.restore();
    const top=actor.y-(actor.id==='alma'?70:actor.id==='danny'?72:90);
    label(player?'▼ YOU':names[actor.id].toUpperCase(),actor.x,top,9,player?'#ffe58e':actor.team===0?'#9ee5ff':'#ffbbb8');
  }
  const b=match.ball;oval(b.x,b.y+4,9+b.z*.02,3,'#092c3566');
  ctx.save();ctx.translate(b.x,b.y-8-b.z);ctx.rotate(b.x*.08);oval(0,0,8,8,'#fff9e6');ctx.strokeStyle='#172c35';ctx.lineWidth=1;ctx.stroke();
  for(let i=0;i<5;i++){const a=i*Math.PI*2/5;oval(Math.cos(a)*5,Math.sin(a)*5,2,2,'#172c35');}oval(0,0,2.7,2.7,'#172c35');ctx.restore();
  if(match.celebration>0){rect(200,195,560,105,'#082b32ed');label(match.notice,480,258,34,'#ffe18a');}
  if(match.state==='playing'&&match.clock<4)label('CONTROL FOLLOWS THE BALL · C TO PASS · GROWN-UPS → / ← KIDS',480,185,11,'#fff0b1');
}
function frame(now){const elapsed=last?Math.min((now-last)/1000,.1):0;last=now;accumulator+=elapsed;while(accumulator>=1/60){match.update(1/60,controls());for(const event of match.drainEvents())audio.play(event);accumulator-=1/60;}sync();render();requestAnimationFrame(frame);}
sync();requestAnimationFrame(frame);
