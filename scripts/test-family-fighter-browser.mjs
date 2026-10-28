import puppeteer from 'puppeteer-core';
import assert from 'node:assert/strict';
import {mkdtemp,copyFile,rm,mkdir,readFile,access} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
const dir=await mkdtemp(join(tmpdir(),'family-fighter-'));
const browser=await puppeteer.launch({executablePath:process.env.CHROME,headless:true,args:['--no-sandbox']});
try{
 for(const file of ['index.html','style.css','runtime.js'])await copyFile('games/family-fighter/'+file,join(dir,file));
 const page=await browser.newPage(),errors=[],requests=[];page.on('pageerror',e=>errors.push(e.message));
 await page.setRequestInterception(true);page.on('request',r=>{if(/^https?:/.test(r.url())){requests.push(r.url());r.abort();}else r.continue();});
 await page.setViewport({width:1200,height:1000});await page.goto(pathToFileURL(join(dir,'index.html')).href);
 await page.waitForSelector('.fighter');assert.equal(await page.$$('.fighter').then(a=>a.length),13);assert.deepEqual(errors,[]);
 await page.click('[data-hero="sami"]');await page.click('#start');await new Promise(r=>setTimeout(r,1500));
 await page.keyboard.down('ArrowRight');await page.keyboard.down('KeyJ');await new Promise(r=>setTimeout(r,900));await page.keyboard.up('ArrowRight');await page.keyboard.up('KeyJ');
 await page.keyboard.press('KeyP');assert.equal(await page.$eval('#message',e=>e.textContent),'TAKE A BREATHER');
 await page.click('#continue');assert.equal(await page.$eval('#overlay',e=>e.hidden),true);
 await mkdir('out',{recursive:true});await page.screenshot({path:'out/family-fighter-desktop.png',fullPage:true});
 for(const [width,height]of [[320,740],[390,844],[844,390],[1024,768]]){
  await page.setViewport({width,height,isMobile:true,hasTouch:true});
  await new Promise(r=>setTimeout(r,200));await page.waitForSelector('.fighter');if(await page.$eval('#cabinet',e=>e.hidden)){await page.click('#start');await new Promise(r=>setTimeout(r,1500));}
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  await page.evaluate(()=>scrollTo(0,0));
  const boxes=await page.$$eval('#pad,.actions button,#pause',els=>els.map(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,b:r.bottom};}));
  assert.ok(boxes.every(b=>b.w>=44&&b.h>=44),JSON.stringify({width,boxes}));
  if(width>height&&height<600)assert.ok(boxes.every(b=>b.y>=0&&b.b<=height),'landscape controls fit '+JSON.stringify(boxes));
  if(height>=600)await page.$eval('.controls',e=>e.scrollIntoView({block:'center'}));
  const session=await page.createCDPSession();const positions=await page.$$eval('#pad,[data-input="punch"]',els=>els.map((e,id)=>{const r=e.getBoundingClientRect();return {x:r.x+r.width*(id===0?.8:.5),y:r.y+r.height/2,id:id+1};}));
  await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:positions});
  assert.equal(await page.$eval('#pad',e=>e.classList.contains('active')),true);assert.equal(await page.$eval('[data-input="punch"]',e=>e.classList.contains('active')),true);
  positions[0].y-=25;await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:positions});
  await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[positions[1]]});await new Promise(r=>setTimeout(r,80));assert.equal(await page.$eval('[data-input="punch"]',e=>e.classList.contains('active')),false);assert.equal(await page.$eval('#pad',e=>e.classList.contains('active')),true);
  await session.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});assert.equal(await page.$eval('#pad',e=>e.classList.contains('active')),false);
  await page.click('#pause');await page.click('#continue');
  await page.screenshot({path:`out/family-fighter-${width}.png`,fullPage:true});
 }
 await page.click('#choose');
 for(const [width,height]of [[320,740],[844,390]]){
  await page.setViewport({width,height,isMobile:true,hasTouch:true});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'selection fits');
  await page.screenshot({path:`out/family-fighter-select-${width}.png`,fullPage:true});
 }
 await page.click('[data-hero="dragon"]');await page.click('#start');
 assert.equal(await page.$eval('#selection',e=>e.hidden),true);assert.deepEqual(errors,[]);assert.deepEqual(requests,[]);
 const html=await readFile('games/index.html','utf8');for(const [,slug]of html.matchAll(/href="([\w-]+)\/"/g))await access(`games/${slug}/index.html`);
 for(const [width,height]of [[1200,1000],[320,740]]){
  await page.setViewport({width,height,isMobile:true,hasTouch:true});await page.goto(pathToFileURL(join(process.cwd(),'games/index.html')).href);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'arcade fits');
  await page.screenshot({path:`out/family-fighter-arcade-${width}.png`,fullPage:true});
 }
 console.log('Browser passed: offline copied distribution, all fighters, keyboard, pause, real multi-touch and cancellation, four responsive layouts, selection, arcade links; no script errors or network requests.');
}finally{await browser.close();await rm(dir,{recursive:true,force:true});}
