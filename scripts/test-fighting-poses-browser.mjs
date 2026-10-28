import puppeteer from 'puppeteer-core';
import { readFile, mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
const root = new URL('../', import.meta.url).pathname;
await mkdir(root + 'out', { recursive: true });
const ids='jester_fester princess_pearl safadi alma dragon housam danny sami jenna robo_safadi clawd neptune sarah'.split(' ');
const browser=await puppeteer.launch({executablePath:process.env.CHROME,headless:true,args:['--no-sandbox']});
try {
const page=await browser.newPage(); const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.setContent('<canvas id="out" width="2340" height="2600"></canvas>');
for(const path of ['engine/core.js','engine/timeline.js']) await page.addScriptTag({content:await readFile(root+path,'utf8')});
for(const id of ids) {
 await page.evaluate(id=>{CURRENT_ASSET={id,kind:'character',dir:'characters/'+id};},id);
 await page.addScriptTag({content:await readFile(root+'characters/'+id+'/asset.js','utf8')});
 const files=await page.evaluate(()=>CURRENT_ASSET.files);
 for(const file of files) await page.addScriptTag({content:await readFile(root+'characters/'+id+'/'+file,'utf8')});
}
const result=await page.evaluate(ids=>{
 X=document.querySelector('canvas').getContext('2d');
 const report=[];
 for (const id of ids) {
  const e=CHARACTERS[id], f=e.fighting;
  if(!f)throw Error(id+' missing fighting API');
  for(const [move,duration]of Object.entries(f.durations))for(const facing of [-1,1])for(const u of [0,.2,.42,.58,.84,1]){
   X.resetTransform();X.clearRect(0,0,2340,2600);T=u*duration;
   const a=f.draw(move,500,500,8,T,{facing});flushOverlays();
   const matrix=X.getTransform();
   if(!matrix.isIdentity)throw Error(id+' '+move+' leaked canvas transform');
   for(const point of Object.values(a))if(Array.isArray(point)&&point.some(n=>!Number.isFinite(n)))throw Error(id+' '+move+' invalid anchors');
   if(u===.42&&!X.getImageData(200,100,600,450).data.some((n,i)=>i%4===3&&n))throw Error(id+' '+move+' empty drawing');
  }
  const registered=Object.keys(e.poses).filter(name=>name.startsWith('fight: ')).sort();
  const expected=Object.keys(f.durations).map(move=>'fight: '+move).sort();
  if(JSON.stringify(registered)!==JSON.stringify(expected))throw Error(id+' must expose only complete fighting moves');
  X.clearRect(0,0,2340,2600);T=.25;f.draw('heavy punch',500,500,8,.25);
  const first=document.querySelector('canvas').toDataURL();
  T=7;f.draw('victory',500,500,8,7);
  X.clearRect(0,0,2340,2600);T=.25;f.draw('heavy punch',500,500,8,.25);
  if(first!==document.querySelector('canvas').toDataURL())throw Error(id+' scrubbing is not deterministic');
  const right=f.draw('light punch',500,500,8,.23,{facing:1});
  const left=f.draw('light punch',500,500,8,.23,{facing:-1});
  for(const key of Object.keys(right))if(Array.isArray(right[key])) {
   if(Math.abs(right[key][0]+left[key][0]-1000)>.001||Math.abs(right[key][1]-left[key][1])>.001)throw Error(id+' '+key+' mirror mismatch');
  }
  report.push({id,moves:Object.keys(f.durations).length,poses:Object.keys(e.poses).filter(n=>n.startsWith('fight:')).length});
 }
 X.resetTransform(); X.fillStyle='#f4eee1';X.fillRect(0,0,2340,2600);
 const cols=['stance','light punch','heavy kick','crouch','block high','hit body','grounded','special','victory'];
 ids.forEach((id,row)=>cols.forEach((move,col)=>{
   const x=col*260+130,y=row*200+175,e=CHARACTERS[id],d=e.fighting.durations[move];
   X.fillStyle='#302739';X.font='12px sans-serif';X.fillText(id+' / '+move,col*260+8,row*200+18);
   T=d*(move==='crouch'||move==='grounded'?1:.42);
   e.fighting.draw(move,x,y,120/({clawd:13,princess_pearl:22,neptune:23}[id]||30),T);flushOverlays();
 }));
 return report;
},ids);
assert.deepEqual(errors,[]);console.log(result);
await page.screenshot({path:root+'out/fighting-poses.png',captureBeyondViewport:true,clip:{x:0,y:0,width:2340,height:2600}});
}finally{await browser.close();}
