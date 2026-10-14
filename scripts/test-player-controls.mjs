// Player control regression checks without Chrome, fonts, or audio hardware.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
const source = await readFile(new URL('../studio/javascript-export.js', import.meta.url), 'utf8');
function harness(sound, { synthesized = false, prepare = async () => ({}), playError = null } = {}) {
  let preparations = 0;
  let now = 0, callback, audio;
  const element = () => ({ value: '', textContent: '', hidden: false, attributes: {}, setAttribute(k,v) { this.attributes[k]=v; } });
  const nodes = Object.fromEntries(['canvas','.play','.status','.seek','.mute','.speed','.time','.controls'].map(k=>[k,element()]));
  nodes.canvas.getContext = () => ({});
  nodes['.speed'].options = [.5,.75,1,1.25,1.5,2].map(value=>({value:String(value)}));
  nodes['.speed'].appendChild = option => nodes['.speed'].options.push(option);
  const shadow = { querySelector: k => nodes[k] };
  const box = { attachShadow: () => shadow, remove() { this.removed=true; } };
  const host = { appendChild: () => {} };
  class FakeAudio {
    constructor() { audio=this; this.paused=true;this.currentTime=0;this.ended=false; }
    play() { if (playError) return Promise.reject(playError); this.paused=false;return Promise.resolve(); }
    pause() { this.paused=true; }
    removeAttribute() { this.src=''; }
    load() {}
  }
  const context=vm.createContext({ document: { createElement: tag=>tag==='div'?box:element() }, Audio:FakeAudio,
    synthesizeSceneAudio: () => { preparations++; return prepare(); }, sceneWavBlob: () => ({}), URL: { createObjectURL: () => 'blob:test', revokeObjectURL() {} },
    performance: { now:()=>now }, requestAnimationFrame: fn=>{callback=fn;return 1;}, cancelAnimationFrame:()=>{callback=null;},
    W:1920,H:1080,SCENES:{demo:{title:'Demo',duration:30}},SCENE:null,X:null,
    useScene() { context.SCENE=context.SCENES.demo; },drawFrame:()=>{},clamp:(v,a,b)=>Math.max(a,Math.min(b,v)) });
  vm.runInContext(source,context);
  return { mount: options=>context.sceneJavaScriptPlayer({id:'demo',sound,synthesized,audio:sound && !synthesized?'data:audio/wav;base64,test':null},host,{autoplay:false,...options},async()=>{}),
    nodes,box,get preparations(){return preparations;},get audio(){return audio;},advance(seconds){now+=seconds*1000;const tick=callback;callback=null;tick?.(now);} };
}
const silent=harness(false), p=await silent.mount();
assert.equal(p.muted,true);assert.equal(silent.nodes['.mute'].disabled,true);
assert.equal(silent.nodes['.seek'].max,'30');
silent.nodes['.seek'].value='8';silent.nodes['.seek'].oninput();assert.equal(p.currentTime,8);
assert.equal(silent.nodes['.time'].textContent,'0:08 / 0:30');
await p.play();silent.advance(1);assert.equal(p.currentTime,9);
silent.nodes['.speed'].value='2';silent.nodes['.speed'].onchange();assert.equal(p.currentTime,9);
silent.advance(1);assert.equal(p.currentTime,11);
p.seek(4);silent.advance(1);assert.equal(p.currentTime,6);
p.pause();silent.advance(1);assert.equal(p.currentTime,6);
p.setPlaybackRate(.5);await p.play();silent.advance(2);assert.equal(p.currentTime,7);
assert.throws(()=>p.setPlaybackRate(0));assert.throws(()=>p.setPlaybackRate(NaN));
p.seek(29);silent.advance(3);assert.equal(p.currentTime,30);assert.equal(p.playing,false);
assert.equal(silent.nodes['.play'].textContent,'Replay');
await p.play();assert.equal(p.currentTime,0);p.destroy();p.destroy();assert.equal(silent.box.removed,true);
const voiced=harness(true), v=await voiced.mount();
assert.equal(voiced.audio.muted,true);assert.equal(voiced.nodes['.mute'].textContent,'Unmute');
voiced.nodes['.mute'].onclick();assert.equal(v.muted,false);assert.equal(voiced.audio.muted,false);
assert.equal(voiced.nodes['.mute'].textContent,'Mute');
v.setMuted(true);assert.equal(voiced.audio.muted,true);
v.setPlaybackRate(1.5);assert.equal(voiced.audio.playbackRate,1.5);
v.seek(10);assert.equal(voiced.audio.currentTime,10);await v.play();
voiced.audio.currentTime=11.5;voiced.advance(1);assert.equal(v.currentTime,11.5);
v.setPlaybackRate(2);assert.equal(v.currentTime,11.5);assert.equal(voiced.audio.playbackRate,2);
v.pause();assert.equal(voiced.audio.paused,true);v.destroy();
const custom=harness(true), c=await custom.mount({muted:false,playbackRate:1.75,controls:false});
assert.equal(custom.audio.muted,false);assert.equal(c.playbackRate,1.75);
assert.equal(custom.nodes['.speed'].value,'1.75');assert.equal(custom.nodes['.controls'].hidden,true);c.destroy();
const slow=harness(true,{synthesized:true,prepare:()=>new Promise(()=>{})}), slowPlayer=await slow.mount();
// Reproduce a slow or stalled soundtrack: clicking Play must still animate muted.
slow.nodes['.play'].onclick();await Promise.resolve();assert.equal(slowPlayer.playing,true);
assert.equal(slow.preparations,0);slow.advance(1);assert.equal(slowPlayer.currentTime,1);
slow.nodes['.play'].onclick();assert.equal(slowPlayer.playing,false);slowPlayer.destroy();
const blocked=harness(true,{playError:Object.assign(new Error('autoplay'),{name:'NotAllowedError'})}), blockedPlayer=await blocked.mount({muted:false});
await blockedPlayer.play();assert.equal(blockedPlayer.playing,true);assert.equal(blockedPlayer.muted,true);
assert.match(blocked.nodes['.status'].textContent,/Sound blocked/);blocked.advance(1);assert.equal(blockedPlayer.currentTime,1);blockedPlayer.destroy();
const failed=harness(true,{playError:new Error('audio unavailable')}), failedPlayer=await failed.mount({muted:false});
await failedPlayer.play();assert.equal(failedPlayer.playing,true);assert.match(failed.nodes['.status'].textContent,/audio unavailable/);
failed.advance(1);assert.equal(failedPlayer.currentTime,1);failedPlayer.destroy();
const live=harness(true), livePlayer=await live.mount({muted:false});await livePlayer.play();
live.audio.currentTime=4;live.advance(1);assert.equal(livePlayer.currentTime,4);
livePlayer.setMuted(true);live.advance(1);assert.equal(livePlayer.currentTime,5);
livePlayer.setMuted(false);for(let i=0;i<6;i++)await Promise.resolve();
assert.equal(live.audio.currentTime,5);assert.equal(live.audio.paused,false);livePlayer.destroy();
assert.ok(!source.includes('×'), 'Speed labels must use ASCII x');
console.log('PASS: seek slider, time display, default mute and toggles, audio/silent speed changes, seek while playing, pause, end/replay, custom options, and destroy.');
