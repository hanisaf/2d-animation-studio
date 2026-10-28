import assert from 'node:assert/strict';
import { Match } from '../games/world-champion/model.js';
const step=(m,n=1,input={})=>{for(let i=0;i<n;i++)m.update(1/60,input);};
const m=new Match('safadi');assert.equal(m.player.id,'safadi');assert.deepEqual(m.kids.map(k=>k.id),['housam','danny','jenna','alma']);
assert.deepEqual(m.drainEvents(),[]);m.start();assert.deepEqual(m.drainEvents(),['kickoff']);step(m,300,{left:true,up:true});assert(m.player.x>=85&&m.player.x<=865);assert(m.player.y>=174&&m.player.y<=462);
m.pause();const snapshot=JSON.stringify(m);step(m,60,{shoot:true});assert.equal(JSON.stringify(m),snapshot);m.resume();
m.reset('sami');m.start();step(m,25);assert(m.shoot(true));assert.equal(m.ball.owner,null);assert(m.ball.vz>0);assert(!m.shoot(true),'cannot shoot a ball already in flight');assert.deepEqual(m.drainEvents(),['kickoff','chip']);
m.reset();m.start();m.ball={x:887,y:320,z:0,vx:600,vy:0,vz:0,owner:null,lock:1};step(m);assert.deepEqual(m.score,[1,0]);assert.deepEqual(m.drainEvents(),['kickoff','goal']);step(m,120);assert.equal(m.ball.owner,m.hero);
m.ball={x:73,y:320,z:0,vx:-600,vy:0,vz:0,owner:null,lock:1};step(m);assert.deepEqual(m.score,[1,1]);assert(m.drainEvents().includes('kids-goal'));
m.reset();m.start();m.ball={x:887,y:320,z:90,vx:600,vy:0,vz:0,owner:null,lock:1};step(m);assert.equal(m.score[0],0);assert(m.ball.vx<0,'overbar rebounds');assert(m.drainEvents().includes('bounce'));
m.reset('sami',1);m.start();m.ball={x:849,y:315,z:0,vx:0,vy:0,vz:0,owner:null,lock:0};step(m);assert.equal(m.ball.owner,'alma');assert.equal(m.player.id,'alma');assert(m.drainEvents().includes('save'));step(m,20,{left:true});assert(m.player.x<849,'control follows kid carrier');assert(m.shoot(false));assert(m.ball.vx<0,'kids shoot left');
m.reset('sami',0);m.start();m.kids[0].x=258;m.kids[0].y=320;m.cooldown=0;step(m);assert.equal(m.ball.owner,'housam');assert.equal(m.player.team,0,'control stays on chosen team');assert(m.drainEvents().includes('steal'));
m.reset();m.start();const helper=m.grownups[1];const startX=helper.x;step(m,25);assert(helper.x>startX,'teammate supports attack');assert(m.pass());assert.equal(m.ball.owner,null);step(m,50);assert.equal(m.ball.owner,helper.id,'pass reaches supporting teammate');assert.equal(m.player,helper,'control follows pass');
m.reset();m.start();step(m,60,{right:true,sprint:true});assert(m.stamina<.7);const tired=m.stamina;step(m,60);assert(m.stamina>tired);
m.score=[2,1];m.time=.01;step(m);assert.equal(m.state,'finished');assert.equal(m.notice,'WORLD CHAMPION!');assert(m.drainEvents().includes('fulltime'));const done=JSON.stringify(m);step(m,100);assert.equal(JSON.stringify(m),done);
m.reset();assert.equal(m.time,90);assert.deepEqual(m.score,[0,0]);assert.equal(m.state,'ready');
console.log('Model checks passed: roster, boundaries, pause, chips, scoring, overbar, keeper possession, steals, carrier switching, support runs, passing, stamina, full time, restart and sound event dispatch.');

for(const team of [0,1]) {
 const game=new Match('sami',team);game.start();assert.equal(game.player.team,team);assert.equal(game.ball.owner,game.player.id);
 game.takeBall(game.actors.find(a=>a.team!==team));step(game,60,{right:true});assert.equal(game.player.team,team,'defending control remains on chosen team');
 const enemy=game.actors.find(a=>a.id===game.ball.owner);assert(enemy.x!==(enemy.team===0?235:510),'opponent moves with possession');
 game.reset();assert.equal(game.team,team);assert.equal(game.player.team,team,'restart retains team');
 game.start();game.score[team]=2;game.time=.001;step(game);assert.equal(game.notice,'WORLD CHAMPION!');
}
