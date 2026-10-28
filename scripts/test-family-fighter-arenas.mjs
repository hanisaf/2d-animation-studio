import puppeteer from 'puppeteer-core';
import {readFile,mkdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {ARENAS} from '../games/family-fighter/model.js';
const browser=await puppeteer.launch({executablePath:process.env.CHROME,headless:true,args:['--no-sandbox']});
try{
 const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.setViewport({width:1920,height:3240});await page.setContent('<canvas width="1920" height="3240"></canvas><style>body{margin:0}</style>');
 await page.addScriptTag({content:(await readFile('games/family-fighter/arenas.js','utf8')).replace(/^export /gm,'')});
 for(const path of ['engine/core.js','engine/timeline.js'])await page.addScriptTag({content:await readFile(path,'utf8')});
 for(const id of ['sami','dragon']){
  await page.evaluate(id=>{CURRENT_ASSET={id,kind:'character',dir:'characters/'+id};},id);
  await page.addScriptTag({content:await readFile(`characters/${id}/asset.js`,'utf8')});
  const files=await page.evaluate(()=>CURRENT_ASSET.files);
  for(const file of files)await page.addScriptTag({content:await readFile(`characters/${id}/${file}`,'utf8')});
 }
 const hashes=await page.evaluate(arenas=>{
  const sheet=document.querySelector('canvas').getContext('2d'),results=[];
  for(const [i,arena]of arenas.entries()){
   const bg=document.createElement('canvas');bg.width=1920;bg.height=1080;
   const context=bg.getContext('2d');context.scale(2,2);drawArena(context,arena.id);
   const m=context.getTransform();if(m.a!==2||m.d!==2||m.e||m.f)throw Error('Arena leaked transform');
   const pixels=context.getImageData(0,0,1920,1080).data;
   for(let p=3;p<pixels.length;p+=4)if(pixels[p]!==255)throw Error(arena.id+' contains unpainted pixels');
   const hash=pixels.filter((v,j)=>j%1600===0).reduce((n,v)=>Math.imul(n,31)+v|0,0);results.push(hash);
   X=context;T=.2;JIT=0;OVERLAYS=[];CAM=null;boilSeed(T);
   CHARACTERS.sami.fighting.draw('stance',300,420,190/31,.2,{facing:1});
   CHARACTERS.dragon.fighting.draw('heavy punch',660,420,190/28,.3,{facing:-1});OVERLAYS=[];
   context.font='bold 17px system-ui';context.textAlign='center';context.fillStyle='#fff3db';context.fillText(arena.name,480,18);
   sheet.drawImage(bg,(i%2)*960,Math.floor(i/2)*540,960,540);
  }
  return results;
 },ARENAS);
 assert.equal(new Set(hashes).size,ARENAS.length,'twelve distinct complete arena renders');assert.deepEqual(errors,[]);
 await mkdir('out',{recursive:true});await page.screenshot({path:'out/family-fighter-arenas.png',fullPage:true});
 console.log('Twelve arenas rendered with fighters: distinct, opaque, restored transforms; contact sheet saved.');
}finally{await browser.close();}
