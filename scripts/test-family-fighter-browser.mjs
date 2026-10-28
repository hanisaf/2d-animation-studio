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
 await page.evaluateOnNewDocument(()=>{
  window.audioEvents=[];
  const start=OscillatorNode.prototype.start;
  OscillatorNode.prototype.start=function(...args){window.audioEvents.push({type:this.type});return start.apply(this,args);};
 });
 await page.setRequestInterception(true);page.on('request',r=>{if(/^https?:/.test(r.url())){requests.push(r.url());r.abort();}else r.continue();});
 await page.setViewport({width:1200,height:1000});await page.goto(pathToFileURL(join(dir,'index.html')).href);
 await page.waitForSelector('.fighter');assert.equal(await page.$$('.fighter').then(a=>a.length),13);assert.deepEqual(errors,[]);
 await page.click('[data-hero="sami"]');await page.click('#start');await new Promise(r=>setTimeout(r,1500));
 await page.keyboard.down('ArrowRight');await page.keyboard.down('KeyJ');await new Promise(r=>setTimeout(r,900));await page.keyboard.up('ArrowRight');await page.keyboard.up('KeyJ');
 assert.ok(await page.evaluate(()=>window.audioEvents.length>0),'gesture unlocks synthesized effects');
 await page.keyboard.down('KeyX');await new Promise(r=>setTimeout(r,200));await page.keyboard.up('KeyX');
 await new Promise(r=>setTimeout(r,900));
 await page.keyboard.down('KeyC');await new Promise(r=>setTimeout(r,200));await page.keyboard.up('KeyC');
 assert.ok(await page.evaluate(()=>window.audioEvents.some(e=>e.type==='square')),'special effect plays');
 await page.click('#sound');assert.equal(await page.$eval('#sound',e=>e.getAttribute('aria-pressed')),'false');
 const mutedCount=await page.evaluate(()=>window.audioEvents.length);
 await page.keyboard.down('KeyZ');await new Promise(r=>setTimeout(r,800));await page.keyboard.up('KeyZ');
 assert.equal(await page.evaluate(()=>window.audioEvents.length),mutedCount,'muting silences player and AI effects');
 await page.click('#sound');assert.equal(await page.$eval('#sound',e=>e.getAttribute('aria-pressed')),'true');
 await page.keyboard.press('KeyP');assert.equal(await page.$eval('#message',e=>e.textContent),'TAKE A BREATHER');
 await page.click('#continue');assert.equal(await page.$eval('#overlay',e=>e.hidden),true);
 await mkdir('out',{recursive:true});await page.screenshot({path:'out/family-fighter-desktop.png',fullPage:true});
 // Selection beginning in instructions or headers must not reach gameplay controls.
 for(const selector of ['header','footer','#progress','[data-input="punch"]']){
  assert.equal(await page.$eval(selector,e=>getComputedStyle(e).userSelect),'none');
 }
 const instructions=await page.$eval('footer',e=>{const r=e.getBoundingClientRect();return {x:r.x+8,y:r.y+6,w:r.width};});
 await page.mouse.move(instructions.x,instructions.y);await page.mouse.down();
 await page.mouse.move(instructions.x+instructions.w*.7,instructions.y+15,{steps:12});await page.mouse.up();
 assert.equal(await page.evaluate(()=>getSelection().toString()),'','dragging instructions cannot select text');
 await page.focus('#game');await page.keyboard.down('Control');await page.keyboard.press('KeyA');await page.keyboard.up('Control');
 assert.equal(await page.evaluate(()=>getSelection().toString()),'','select all cannot leave text highlighted');
 assert.equal(await page.$eval('footer',e=>e.dispatchEvent(new Event('selectstart',{bubbles:true,cancelable:true}))),false);
 await page.$eval('footer',e=>{const range=document.createRange();range.selectNodeContents(e);getSelection().addRange(range);});
 await page.waitForFunction(()=>getSelection().rangeCount===0);

 for(const [width,height]of [[320,568],[390,844],[667,375],[844,390],[1024,768]]){
  await page.setViewport({width,height,isMobile:true,hasTouch:true});
  await new Promise(r=>setTimeout(r,200));await page.waitForSelector('.fighter');if(await page.$eval('#cabinet',e=>e.hidden)){await page.click('#start');await new Promise(r=>setTimeout(r,1500));}
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  await page.evaluate(()=>scrollTo(0,0));
  const boxes=await page.$$eval('#pad,.actions button,#pause,#restart,#sound',els=>els.map(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,b:r.bottom};}));
  assert.ok(boxes.every(b=>b.w>=44&&b.h>=44),JSON.stringify({width,boxes}));
  if(width>height&&height<600)assert.ok(boxes.every(b=>b.y>=0&&b.b<=height),'landscape controls fit '+JSON.stringify(boxes));
  const field=await page.$eval('#game',e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,right:r.right,bottom:r.bottom};});
  const touchBoxes=await page.$$eval('#pad,.actions',els=>els.map(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,right:r.right,bottom:r.bottom};}));
  assert.ok(touchBoxes.every(r=>r.x>=field.x&&r.y>=field.y&&r.right<=field.right&&r.bottom<=field.bottom),'controls inside field');
  if(width<900){assert.ok(boxes.every(b=>b.y>=0&&b.b<=height),'all phone controls visible');assert.ok(field.y>=0&&field.bottom<=height,'field visible with controls');}
  const session=await page.createCDPSession();const positions=await page.$$eval('#pad,[data-input="punch"]',els=>els.map((e,id)=>{const r=e.getBoundingClientRect();return {x:r.x+r.width*(id===0?.8:.5),y:r.y+r.height*(id===0?.2:.5),id:id+1};}));
  await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:positions});
  assert.equal(await page.$eval('#pad',e=>e.classList.contains('active')),true);assert.equal(await page.$eval('[data-input="punch"]',e=>e.classList.contains('active')),true);
  assert.equal(await page.$eval('#pad',e=>e.dataset.direction),'up-right');
  const rect=await page.$eval('#pad',e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height};});
  positions[0].x=rect.x+rect.w*.2;positions[0].y=rect.y+rect.h*.8;
  await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:positions});
  await page.waitForFunction(()=>document.querySelector('#pad').dataset.direction==='down-left');
  assert.notEqual(await page.$eval('#pad',e=>e.style.getPropertyValue('--stick-x')),'0px');
  positions[0].x=rect.x+rect.w/2;positions[0].y=rect.y+rect.h/2;
  await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:positions});
  await page.waitForFunction(()=>document.querySelector('#pad').dataset.direction==='');
  await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[positions[1]]});await new Promise(r=>setTimeout(r,80));assert.equal(await page.$eval('[data-input="punch"]',e=>e.classList.contains('active')),false);assert.equal(await page.$eval('#pad',e=>e.classList.contains('active')),true);
  await session.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});assert.equal(await page.$eval('#pad',e=>e.classList.contains('active')),false);
  assert.equal(await page.$eval('#pad',e=>e.style.getPropertyValue('--stick-x')),'0px');
  // Pausing and restarting while an action is held must require fresh input.
  await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[positions[1]]});
  await page.$eval('#pause',e=>e.click());
  assert.equal(await page.$$('.active').then(a=>a.length),0);
  await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await page.tap('#continue');
  assert.equal(await page.$eval('#game',e=>document.activeElement===e),true);
  await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[positions[1]]});
  await page.$eval('#restart',e=>e.click());
  assert.equal(await page.$$('.active').then(a=>a.length),0);
  await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await new Promise(r=>setTimeout(r,1500));
  // Losing capture releases steering, including the knob and direction indicator.
  await page.$eval('#pad',e=>e.addEventListener('pointerdown',event=>window.heldPointer=event.pointerId,{once:true}));
  positions[0].x=rect.x+rect.w*.8;
  await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[positions[0]]});
  positions[0].x+=1;await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[positions[0]]});
  await page.$eval('#pad',e=>e.releasePointerCapture(window.heldPointer));
  positions[0].x+=1;await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[positions[0]]});
  await page.waitForFunction(()=>!document.querySelector('#pad').classList.contains('active'));
  assert.equal(await page.$eval('#pad',e=>e.dataset.direction),'');
  await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  assert.equal(await page.$eval('#pad',e=>getComputedStyle(e).touchAction),'none');
  assert.equal(await page.$eval('#selection',e=>getComputedStyle(e).touchAction),'auto');
  await session.detach();
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
 console.log('Browser passed: offline copied distribution, all fighters, keyboard, pause, real multi-touch and cancellation, five responsive layouts, in-field joystick, diagonal sliding, lost capture, held-input reset on restart, selection, arcade links; no script errors or network requests.');
}finally{await browser.close();await rm(dir,{recursive:true,force:true});}
