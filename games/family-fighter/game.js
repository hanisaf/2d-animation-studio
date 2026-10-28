import {Tournament,ROSTER} from './model.js';
import {drawArena} from './arenas.js';
const $=id=>document.getElementById(id),canvas=$('game'),ctx=canvas.getContext('2d');
const game=new Tournament(),keys=new Set(),pointers=new Map();let selected=ROSTER[0][0],previous='',time=0;
// Selection can start outside the arena and extend across touch controls.
// Cancel it throughout this standalone game without blocking page pan or zoom.
function cancelSelection(){
 const selection=window.getSelection();
 if(selection?.rangeCount)selection.removeAllRanges();
}
document.addEventListener('selectstart',event=>event.preventDefault());
document.addEventListener('selectionchange',cancelSelection);
document.addEventListener('dragstart',event=>event.preventDefault());
document.addEventListener('contextmenu',event=>{
 if(document.body.classList.contains('playing'))event.preventDefault();
});
// Local Web Audio effects keep the three-file game fully offline.
let audioContext,master,soundEnabled=true;
const voices=new Set();
function unlockAudio(){
 if(!soundEnabled)return;
 try{
  const Audio=window.AudioContext||window.webkitAudioContext;
  if(!Audio)return;
  if(!audioContext){audioContext=new Audio();master=audioContext.createGain();master.gain.value=.18;master.connect(audioContext.destination);}
  if(audioContext.state==='suspended')audioContext.resume().catch(()=>{});
 }catch{/* Sound is optional when Web Audio is unavailable. */}
}
function silence(){for(const voice of voices){try{voice.stop();}catch{}}voices.clear();}
function note(from,to,duration,type='triangle',delay=0){
 const start=audioContext.currentTime+delay,osc=audioContext.createOscillator(),gain=audioContext.createGain();
 osc.type=type;osc.frequency.setValueAtTime(from,start);osc.frequency.exponentialRampToValueAtTime(to,start+duration);
 gain.gain.setValueAtTime(.0001,start);gain.gain.exponentialRampToValueAtTime(.3,start+.008);gain.gain.exponentialRampToValueAtTime(.0001,start+duration);
 osc.connect(gain);gain.connect(master);voices.add(osc);
 osc.onended=()=>{voices.delete(osc);osc.disconnect();gain.disconnect();};osc.start(start);osc.stop(start+duration+.02);
}
function playSound(kind){
 if(!soundEnabled||audioContext?.state!=='running')return;
 const effects={punch:[340,70,.11,'triangle'],kick:[180,40,.18,'triangle'],special:[180,1100,.38,'square'],hit:[110,32,.14,'sawtooth'],block:[850,380,.09,'square'],jump:[260,650,.16,'sine']};
 if(effects[kind]){note(...effects[kind]);return;}
 const melodies={fight:[440,660],win:[392,494,587,784],lose:[330,277,220],draw:[330,330],champion:[392,494,587,784,988,1175]};
 melodies[kind]?.forEach((frequency,i)=>note(frequency,frequency,.16,'triangle',i*.12));
}
game.onEvent=playSound;
// Capture gestures before gameplay handlers so mobile browsers can unlock audio.
document.addEventListener('pointerdown',unlockAudio,{capture:true});
document.addEventListener('keydown',unlockAudio,{capture:true});
$('sound').onclick=()=>{
 soundEnabled=!soundEnabled;silence();
 if(master)master.gain.value=soundEnabled?.18:0;
 $('sound').textContent=`Sound: ${soundEnabled?'on':'off'}`;
 $('sound').setAttribute('aria-pressed',String(soundEnabled));
 $('sound').setAttribute('aria-label',`Sound effects ${soundEnabled?'enabled':'muted'}`);
 if(soundEnabled)unlockAudio();focus();
};
const mapping={ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',ArrowUp:'jump',KeyW:'jump',ArrowDown:'crouch',KeyS:'crouch',KeyJ:'punch',KeyZ:'punch',KeyK:'kick',KeyX:'kick',KeyL:'special',KeyC:'special',Space:'block'};
const pad=$('pad'), owners=new Map();
function resetPad(){
 pad.style.setProperty('--stick-x','0px');pad.style.setProperty('--stick-y','0px');pad.dataset.direction='';
}
function clear(){
 keys.clear();pointers.clear();
 const captured=[...owners];owners.clear();
 for(const [id,element]of captured)if(element.hasPointerCapture(id))element.releasePointerCapture(id);
 document.querySelectorAll('.active').forEach(e=>e.classList.remove('active'));
 document.querySelectorAll('[data-input]').forEach(e=>e.setAttribute('aria-pressed','false'));
 resetPad();
}
function input(){const result={};for(const key of keys)result[mapping[key]]=true;for(const entry of pointers.values())for(const [key,value]of Object.entries(entry))if(value)result[key]=true;return result;}
function focus(){canvas.focus({preventScroll:true});}
function name(id){return ROSTER.find(r=>r[0]===id)[1];}
function rig(id,context,x,y,height,move='stance',seconds=0,facing=1){
 X=context;T=time;boilSeed(time);JIT=0;OVERLAYS=[];CAM=null;
 const h=ROSTER.find(r=>r[0]===id)[2];CHARACTERS[id].fighting.draw(move,x,y,height/h,seconds,{facing,loop:['stance','walk forward','walk backward','block high','block low'].includes(move)});OVERLAYS=[];
}
for(const [id,title] of ROSTER){
 const portrait=document.createElement('canvas');portrait.width=300;portrait.height=300;
 rig(id,portrait.getContext('2d'),150,274,id==='dragon'?155:195);
 const button=document.createElement('button');button.className='fighter';button.dataset.hero=id;button.setAttribute('aria-pressed',String(selected===id));
 const img=new Image();img.src=portrait.toDataURL();img.alt='';img.draggable=false;button.append(img,document.createTextNode(title));
 button.onclick=()=>{selected=id;clear();document.querySelectorAll('.fighter').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));};$('roster').append(button);
}
$('start').onclick=()=>{cancelSelection();clear();game.start(selected);$('selection').hidden=true;$('cabinet').hidden=false;document.body.classList.add('playing');focus();sync();};
$('restart').onclick=()=>{silence();clear();game.start(selected);focus();sync();};
$('choose').onclick=()=>{silence();clear();game.state='select';document.body.classList.remove('playing');$('selection').hidden=false;$('cabinet').hidden=true;document.querySelector(`[data-hero="${selected}"]`).focus({preventScroll:true});};
function pause(){silence();clear();game.pause();sync();}
$('pause').onclick=pause;
$('continue').onclick=()=>{clear();if(game.state==='paused')game.pause();else if(['champion','complete'].includes(game.state)){$('choose').click();return;}else game.next();focus();sync();};
addEventListener('keydown',e=>{
 if(e.target.closest('button,a,input,select')&&e.code!=='KeyP')return;
 if(e.code==='KeyP'&&game.state!=='select'){e.preventDefault();if(!e.repeat)pause();return;}
 if(mapping[e.code]&&['fight','intro'].includes(game.state)){e.preventDefault();keys.add(e.code);}
});addEventListener('keyup',e=>keys.delete(e.code));
function inactive(){silence();clear();if(['fight','intro','roundEnd','matchWin','matchLost'].includes(game.state)){game.pause();sync();}}
addEventListener('blur',inactive);document.addEventListener('visibilitychange',()=>{if(document.hidden)inactive();});
function bind(element,read){
 const feedback=()=>{
  const active=[...owners.values()].includes(element);
  element.classList.toggle('active',active);
  if(element.matches('button'))element.setAttribute('aria-pressed',String(active));
  if(element===pad&&!active)resetPad();
 };
 const release=e=>{
  if(owners.get(e.pointerId)!==element)return;
  pointers.delete(e.pointerId);owners.delete(e.pointerId);
  if(element.hasPointerCapture(e.pointerId))element.releasePointerCapture(e.pointerId);
  feedback();
 };
 element.addEventListener('pointerdown',e=>{
  if(e.button!==0||game.state!=='fight'||[...owners.values()].includes(element))return;
  e.preventDefault();element.setPointerCapture(e.pointerId);owners.set(e.pointerId,element);
  pointers.set(e.pointerId,read(e));feedback();focus();
 });
 element.addEventListener('pointermove',e=>{
  if(owners.get(e.pointerId)===element){e.preventDefault();pointers.set(e.pointerId,read(e));}
 });
 for(const type of ['pointerup','pointercancel','lostpointercapture'])element.addEventListener(type,release);
}
bind(pad,e=>{
 const r=pad.getBoundingClientRect(),radius=r.width/2;
 const dx=e.clientX-r.left-radius,dy=e.clientY-r.top-r.height/2;
 const length=Math.hypot(dx,dy),limit=radius*.45,scale=length>limit?limit/length:1;
 pad.style.setProperty('--stick-x',`${dx*scale}px`);pad.style.setProperty('--stick-y',`${dy*scale}px`);
 const dead=radius*.25,left=dx<-dead,right=dx>dead,jump=dy<-dead,crouch=dy>dead;
 pad.dataset.direction=[jump?'up':crouch?'down':'',left?'left':right?'right':''].filter(Boolean).join('-');
 return {left,right,jump,crouch};
});
for(const button of document.querySelectorAll('[data-input]')){
 button.setAttribute('aria-pressed','false');bind(button,()=>({[button.dataset.input]:true}));
}
function sync(){
 const state=game.state,matchEnded=['matchWin','matchLost'].includes(state),finished=['champion','complete'].includes(state),show=['paused','roundEnd','matchWin','matchLost','champion','complete'].includes(state);
 $('overlay').hidden=!show;$('overlay').classList.toggle('victory-result',matchEnded||state==='roundEnd');$('pause').textContent=state==='paused'?'Resume':'Pause';$('pause').disabled=!['fight','intro','roundEnd','matchWin','matchLost','paused'].includes(state);
 if(game.hero)$('progress').textContent=`Rival ${Math.min(12,game.index+1)} / 12 · Round ${game.round} / 3`;
 if(show){
  $('message').textContent=state==='paused'?'TAKE A BREATHER':game.message;
  $('detail').textContent=matchEnded?`${game.index+1} of 12 matches played. The tournament continues.`:finished?`${game.matchVictories} wins · ${12-game.matchVictories} losses. All twelve rivals played.`:state==='paused'?'The arena is paused.':`Round wins: ${game.wins[0]} – ${game.wins[1]}`;
  $('continue').textContent=state==='paused'?'Resume →':finished?'Choose fighter →':matchEnded?`${game.index===11?'Tournament results':'Next rival'} in ${Math.ceil(game.resultTime)}…`:`${game.winner===-1?'Replay round':'Next round'} in ${Math.ceil(game.resultTime)}…`;
 }
 $('continue').disabled=matchEnded||state==='roundEnd';
 if(previous!==state){
  if(state==='paused'||state==='select')silence();
  else if(state==='fight'&&previous!=='paused')playSound('fight');
  else if(['roundEnd','matchWin','matchLost'].includes(state)&&previous!=='paused')playSound(game.winner===0?'win':game.winner===1?'lose':'draw');
  else if(finished)playSound(state==='champion'?'champion':'win');
  clear();$('announce').textContent=state==='fight'?`Fight! ${name(game.hero)} versus ${name(game.opponents[game.index])} at ${game.arena.name}`:show?$('message').textContent:game.message;previous=state;}
}
function rect(x,y,w,h,color){ctx.fillStyle=color;ctx.fillRect(x,y,w,h);}
function text(s,x,y,size=18,color='#fff3db',align='left'){ctx.fillStyle=color;ctx.font=`bold ${size}px system-ui`;ctx.textAlign=align;ctx.fillText(s,x,y);}
const arenaCache=new Map();
function render(){
 ctx.setTransform(2,0,0,2,0,0);
 const arena=game.arena;
 if(!arenaCache.has(arena.id)){
  const background=document.createElement('canvas');background.width=1920;background.height=1080;
  const context=background.getContext('2d');context.scale(2,2);drawArena(context,arena.id);arenaCache.set(arena.id,background);
 }
 ctx.drawImage(arenaCache.get(arena.id),0,0,960,540);
 text(arena.name.toUpperCase(),480,17,13,'#fff3db','center');
 if(!game.fighters)return;
 const [a,b]=game.fighters;
 for(const [i,f]of game.fighters.entries()){
  const x=i?550:40;rect(x,66,370,24,'#131222');rect(i?x+370*(1-f.hp/100):x,66,370*f.hp/100,24,f.hp<25?'#ff706a':i?'#fa9472':'#74dfcc');
  text(name(f.id),i?920:40,54,18,'#fff3db',i?'right':'left');text(`${'●'.repeat(game.wins[i])}${'○'.repeat(2-game.wins[i])}`,i?920:40,116,22,'#ffe096',i?'right':'left');
  rect(x,127,370,6,'#131222');rect(x,127,370*f.energy/100,6,'#a18bff');
  ctx.save();const seconds=f.move==='crouch'||f.move.startsWith('block')?1:f.moveTime;
  rig(f.id,ctx,f.x,420-f.y,190,f.move,seconds,f.facing);ctx.restore();
 }
 text(String(Math.ceil(game.timer)).padStart(2,'0'),480,89,36,'#ffe096','center');text(`ROUND ${game.round}`,480,116,12,'#c0aec9','center');
 if(game.flash&&game.lastHit){const h=game.lastHit;ctx.strokeStyle=h.blocked?'#80e9ff':'#ffe096';ctx.lineWidth=4;ctx.beginPath();ctx.arc(h.x,330-h.y,25*(1-game.flash/.16),0,Math.PI*2);ctx.stroke();text(h.blocked?'BLOCK':'POW!',h.x,290-h.y,18,ctx.strokeStyle,'center');}
 if(game.state==='intro'){rect(190,205,580,96,'#17172bcc');text(`ROUND ${game.round}`,480,246,48,'#ffe096','center');text(`${name(a.id)}  vs  ${name(b.id)}`,480,285,20,'#fff3db','center');}
}
let last=performance.now(),acc=0;
function frame(now){const dt=Math.min(.1,(now-last)/1000);last=now;acc+=dt;while(acc>=1/60){game.update(1/60,input());acc-=1/60;}time=game.elapsed;sync();render();requestAnimationFrame(frame);}requestAnimationFrame(frame);
