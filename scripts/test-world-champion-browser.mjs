import { checkGameTouch } from './check-game-touch.mjs';
import puppeteer from 'puppeteer-core';
import assert from 'node:assert/strict';
import { mkdtemp,copyFile,readFile,access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
const dir=await mkdtemp(join(tmpdir(),'world-champion-'));
for(const name of ['index.html','style.css','runtime.js']) await copyFile('games/world-champion/'+name,join(dir,name));
const browser=await puppeteer.launch({executablePath:process.env.CHROME,headless:true,args:['--no-sandbox']});
try{
 const page=await browser.newPage(),errors=[],requests=[];page.on('pageerror',e=>errors.push(e.message));
 await page.evaluateOnNewDocument(()=>{
   window.playedSounds=[];
   const start=OscillatorNode.prototype.start;
   OscillatorNode.prototype.start=function(...args){window.playedSounds.push(this.type);return start.apply(this,args);};
 });
 await page.setRequestInterception(true);page.on('request',r=>{if(/^https?:/.test(r.url())){requests.push(r.url());r.abort();}else r.continue();});
 await page.setViewport({width:1280,height:1000});await page.goto(pathToFileURL(join(dir,'index.html')).href);
 await page.waitForFunction(()=>document.querySelector('#portrait-sami').src.startsWith('data:'));
 assert.deepEqual(errors,[]);assert.equal(await page.$eval('#overlay-title',e=>e.textContent),'CHOOSE YOUR TEAM');
 assert.deepEqual(await page.evaluate(()=>window.playedSounds),[],'silent before user starts');await page.screenshot({path:'/tmp/world-champion-picker.png',fullPage:true});
 for(const id of ['1','0']){await page.click(`[data-team="${id}"]`);assert.equal(await page.$eval(`[data-team="${id}"]`,e=>e.getAttribute('aria-pressed')),'true');await page.click('#start');assert.equal(await page.$eval('#overlay',e=>e.hidden),true);assert((await page.$eval('#status',e=>e.textContent)).includes(id==='1'?'KIDS':'GROWN-UPS'),'selected team controls kickoff');await page.click('#choose');}
 const playerX=()=>page.$eval('#game',c=>{const d=c.getContext('2d').getImageData(0,542,1920,26).data;let total=0,n=0;for(let y=0;y<26;y++)for(let x=140;x<1780;x++){const i=(y*1920+x)*4;if(d[i]>240&&d[i+1]>215&&d[i+1]<240&&d[i+2]>120&&d[i+2]<160){total+=x;n++;}}return total/n;});
 await page.click('#start');await new Promise(r=>setTimeout(r,40));const before=await playerX();await page.keyboard.down('ArrowRight');await new Promise(r=>setTimeout(r,450));await page.keyboard.up('ArrowRight');assert(await playerX()>before+80,'keyboard moves the player');await page.keyboard.press('KeyP');assert.equal(await page.$eval('#overlay-title',e=>e.textContent),'HALF-TIME BREATHER');
 const timer=await page.$eval('#timer',e=>e.textContent);await new Promise(r=>setTimeout(r,1100));assert.equal(await page.$eval('#timer',e=>e.textContent),timer);
 await page.click('#start');await page.keyboard.down('KeyX');await new Promise(r=>setTimeout(r,180));await page.keyboard.up('KeyX');assert.equal(await page.$eval('#status',e=>e.textContent),'CHIP SHOT!');assert((await page.evaluate(()=>window.playedSounds)).includes('sine'),'kickoff whistle');assert((await page.evaluate(()=>window.playedSounds)).includes('triangle'),'chip kick sound');await page.screenshot({path:'/tmp/world-champion-desktop.png',fullPage:true});
 assert.equal(await page.$eval('#game',e=>e.getContext('2d').getImageData(1919,991,1,1).data[3]),255);
 await page.click('#sound');assert.equal(await page.$eval('#sound',e=>e.getAttribute('aria-pressed')),'false');
 const mutedCount=await page.evaluate(()=>window.playedSounds.length);await page.click('#restart');await page.keyboard.down('Space');await new Promise(r=>setTimeout(r,500));await page.keyboard.up('Space');
 assert.equal(await page.evaluate(()=>window.playedSounds.length),mutedCount,'muting silences kickoff and shot');
 await page.click('#sound');assert.equal(await page.$eval('#sound',e=>e.getAttribute('aria-pressed')),'true');
 await page.click('#restart');await new Promise(r=>setTimeout(r,50));assert(await page.evaluate(()=>window.playedSounds.length)>mutedCount,'unmute restores sounds');assert.equal(await page.$eval('#player-score',e=>e.textContent),'0');
 await page.setViewport({width:390,height:844,isMobile:true,hasTouch:true});await page.click('#choose');
 await page.screenshot({path:'/tmp/world-champion-mobile-picker.png',fullPage:true});
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 const fits=await page.$eval('#start',e=>{const a=e.getBoundingClientRect(),b=document.querySelector('.screen').getBoundingClientRect();return a.bottom<=b.bottom&&a.top>=b.top;});assert(fits,'phone picker fits the pitch');
 await page.click('#start');const session=await page.createCDPSession();
 const points=await page.$$eval('.joystick,[data-control="shoot"]',buttons=>buttons.map((b,i)=>{const r=b.getBoundingClientRect();return{x:r.x+r.width*(b.classList.contains('joystick')?.8:.5),y:r.y+r.height/2,id:i+1};}));
 const beforeTouch=await playerX();await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:points});assert.equal(await page.$$eval('.active',e=>e.length),2);await new Promise(r=>setTimeout(r,400));
 assert(await playerX()>beforeTouch+70,'touch moves while shooting');await session.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});assert.equal(await page.$$eval('.active',e=>e.length),0);
 await page.screenshot({path:'/tmp/world-champion-mobile.png',fullPage:true});
 await page.evaluate(()=>window.dispatchEvent(new Event('blur')));assert.equal(await page.$eval('#overlay-title',e=>e.textContent),'HALF-TIME BREATHER');
 assert.deepEqual(errors,[]);assert.deepEqual(requests,[]);

await checkGameTouch(page, 'world-champion');
 for(const viewport of [{width:1280,height:1000},{width:390,height:844}]){
 await page.setViewport(viewport);await page.goto(pathToFileURL(join(process.cwd(),'games/index.html')).href);await page.screenshot({path:`/tmp/world-champion-arcade-${viewport.width}.png`,fullPage:true});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 }
 assert.deepEqual(errors,[]);const index=await readFile('games/index.html','utf8');for(const [,href]of index.matchAll(/href="([^"#]+\/)">Play/g))await access(join('games',href,'index.html'));
 console.log('Browser checks passed: offline three-file copy, both teams, keyboard, pause, restart, touch multitouch/cancel, blur, 2x rendering, desktop/phone layouts, synthesized effects, mute/unmute and arcade links. Screenshots: /tmp/world-champion-*.png');
}finally{await browser.close();}
