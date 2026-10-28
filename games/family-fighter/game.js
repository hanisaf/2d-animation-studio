import {Tournament,ROSTER} from './model.js';
const $=id=>document.getElementById(id),canvas=$('game'),ctx=canvas.getContext('2d');
const game=new Tournament(),keys=new Set(),pointers=new Map();let selected=ROSTER[0][0],previous='',time=0;
const mapping={ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',ArrowUp:'jump',KeyW:'jump',ArrowDown:'crouch',KeyS:'crouch',KeyJ:'punch',KeyK:'kick',KeyL:'special',Space:'block'};
function clear(){keys.clear();pointers.clear();document.querySelectorAll('.active').forEach(e=>e.classList.remove('active'));}
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
$('start').onclick=()=>{clear();game.start(selected);$('selection').hidden=true;$('cabinet').hidden=false;focus();sync();};
$('choose').onclick=()=>{clear();game.state='select';$('selection').hidden=false;$('cabinet').hidden=true;document.querySelector(`[data-hero="${selected}"]`).focus({preventScroll:true});};
function pause(){clear();game.pause();sync();}
$('pause').onclick=pause;
$('continue').onclick=()=>{clear();if(game.state==='paused')game.pause();else if(game.state==='champion'){$('choose').click();return;}else{if(game.winner===-1)game.round--;game.next();}focus();sync();};
addEventListener('keydown',e=>{
 if(e.target.closest('button,a,input,select')&&e.code!=='KeyP')return;
 if(e.code==='KeyP'&&game.state!=='select'){e.preventDefault();if(!e.repeat)pause();return;}
 if(mapping[e.code]&&['fight','intro'].includes(game.state)){e.preventDefault();keys.add(e.code);}
});addEventListener('keyup',e=>keys.delete(e.code));
function inactive(){clear();if(['fight','intro'].includes(game.state)){game.pause();sync();}}
addEventListener('blur',inactive);document.addEventListener('visibilitychange',()=>{if(document.hidden)inactive();});
function bind(element,read){
 const release=e=>{pointers.delete(e.pointerId);element.classList.toggle('active',[...pointers.keys()].some(id=>element.hasPointerCapture(id)));};
 element.addEventListener('pointerdown',e=>{if(e.button!==0||game.state!=='fight')return;e.preventDefault();element.setPointerCapture(e.pointerId);pointers.set(e.pointerId,read(e));element.classList.add('active');focus();});
 element.addEventListener('pointermove',e=>{if(pointers.has(e.pointerId))pointers.set(e.pointerId,read(e));});
 for(const type of ['pointerup','pointercancel','lostpointercapture'])element.addEventListener(type,release);
}
bind($('pad'),e=>{const r=$('pad').getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;return {left:x<-.16,right:x>.16,jump:y<-.23,crouch:y>.23};});
for(const button of document.querySelectorAll('[data-input]'))bind(button,()=>({[button.dataset.input]:true}));
function sync(){
 const state=game.state,show=['paused','roundEnd','matchWin','matchLost','champion'].includes(state);
 $('overlay').hidden=!show;$('pause').textContent=state==='paused'?'Resume':'Pause';$('pause').disabled=!['fight','intro','paused'].includes(state);
 if(game.hero)$('progress').textContent=`Rival ${Math.min(12,game.index+1)} / 12 · Round ${game.round} / 3`;
 if(show){$('message').textContent=state==='paused'?'TAKE A BREATHER':game.message;$('detail').textContent=state==='matchWin'?`${name(game.hero)} advances. ${game.index+1} of 12 rivals defeated.`:state==='matchLost'?'Try this rival again. Your tournament progress is saved.':state==='champion'?'All twelve rivals defeated. The family crown is yours.':state==='paused'?'The arena is paused.':`Round wins: ${game.wins[0]} – ${game.wins[1]}`;$('continue').textContent=state==='paused'?'Resume →':state==='matchLost'?'Rematch →':state==='champion'?'Choose fighter →':state==='matchWin'?(game.index===11?'Claim the crown →':'Next rival →'):'Next round →';}
 if(previous!==state){clear();$('announce').textContent=state==='fight'?`Fight! ${name(game.hero)} versus ${name(game.opponents[game.index])}`:show?$('message').textContent:game.message;previous=state;}
}
function rect(x,y,w,h,color){ctx.fillStyle=color;ctx.fillRect(x,y,w,h);}
function text(s,x,y,size=18,color='#fff3db',align='left'){ctx.fillStyle=color;ctx.font=`bold ${size}px system-ui`;ctx.textAlign=align;ctx.fillText(s,x,y);}
function render(){
 ctx.setTransform(2,0,0,2,0,0);
 const sky=ctx.createLinearGradient(0,0,0,540);sky.addColorStop(0,'#151730');sky.addColorStop(.7,'#59314f');sky.addColorStop(1,'#ed9a73');ctx.fillStyle=sky;ctx.fillRect(0,0,960,540);
 ctx.fillStyle='#f8d9a7';ctx.beginPath();ctx.arc(740,173,66,0,Math.PI*2);ctx.fill();
 for(let i=0;i<13;i++){rect(i*85-20,240-(i%3)*25,65,210,'#24243c');for(let j=0;j<3;j++)rect(i*85,260+j*36,9,15,'#836879');}
 rect(0,414,960,126,'#242238');rect(0,414,960,6,'#c79b8b');
 ctx.strokeStyle='#514158';ctx.lineWidth=1;for(let i=-3;i<14;i++){ctx.beginPath();ctx.moveTo(480+(i-5)*70,420);ctx.lineTo(480+(i-5)*160,540);ctx.stroke();}for(const y of [448,487,537])rect(0,y,960,1,'#514158');
 text('SAFADIS’ FAMILY TOURNAMENT',480,190,16,'#e4b99a','center');
 if(!game.fighters)return;
 const [a,b]=game.fighters;
 for(const [i,f]of game.fighters.entries()){
  const x=i?550:40;rect(x,42,370,24,'#131222');rect(i?x+370*(1-f.hp/100):x,42,370*f.hp/100,24,f.hp<25?'#ff706a':i?'#fa9472':'#74dfcc');
  text(name(f.id),i?920:40,30,18,'#fff3db',i?'right':'left');text(`${'●'.repeat(game.wins[i])}${'○'.repeat(2-game.wins[i])}`,i?920:40,92,22,'#ffe096',i?'right':'left');
  rect(x,103,370,6,'#131222');rect(x,103,370*f.energy/100,6,'#a18bff');
  ctx.save();const seconds=f.move==='crouch'||f.move.startsWith('block')?1:f.moveTime;
  rig(f.id,ctx,f.x,420-f.y,190,f.move,seconds,f.facing);ctx.restore();
 }
 text(String(Math.ceil(game.timer)).padStart(2,'0'),480,65,36,'#ffe096','center');text(`ROUND ${game.round}`,480,92,12,'#c0aec9','center');
 if(game.flash&&game.lastHit){const h=game.lastHit;ctx.strokeStyle=h.blocked?'#80e9ff':'#ffe096';ctx.lineWidth=4;ctx.beginPath();ctx.arc(h.x,330-h.y,25*(1-game.flash/.16),0,Math.PI*2);ctx.stroke();text(h.blocked?'BLOCK':'POW!',h.x,290-h.y,18,ctx.strokeStyle,'center');}
 if(game.state==='intro'){text(`ROUND ${game.round}`,480,246,48,'#ffe096','center');text(`${name(a.id)}  vs  ${name(b.id)}`,480,285,20,'#fff3db','center');}
}
let last=performance.now(),acc=0;
function frame(now){const dt=Math.min(.1,(now-last)/1000);last=now;acc+=dt;while(acc>=1/60){game.update(1/60,input());acc-=1/60;}time=game.elapsed;sync();render();requestAnimationFrame(frame);}requestAnimationFrame(frame);
