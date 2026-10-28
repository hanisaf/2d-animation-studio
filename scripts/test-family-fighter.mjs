import assert from 'node:assert/strict';
import {Tournament, ROSTER} from '../games/family-fighter/model.js';
const step=(g,i={},n=60)=>{for(let k=0;k<n;k++)g.update(1/60,i);};
const ready=()=>{const g=new Tournament(()=>.5);g.start('sami');step(g,{},80);g.aiTime=1000;g.ai={};return g;};
let g=ready();assert.equal(g.opponents.length,12);assert.ok(!g.opponents.includes('sami'));
step(g,{left:true},180);assert.equal(g.fighters[0].x,100);step(g,{right:true},600);assert.ok(g.fighters[1].x-g.fighters[0].x>=74);
g=ready();g.fighters[0].x=400;g.fighters[1].x=495;step(g,{punch:true},20);assert.equal(g.fighters[1].hp,91);step(g,{},4);assert.equal(g.fighters[1].hp,91,'one hit per strike');
g=ready();g.fighters[0].x=400;g.fighters[1].x=495;g.ai={block:true};step(g,{punch:true},20);assert.equal(g.fighters[1].hp,98);
g=ready();step(g,{punch:true},40);assert.equal(g.fighters[1].hp,100,'out of range');
g=ready();g.fighters[0].energy=20;step(g,{special:true},1);assert.equal(g.fighters[0].attack,null);step(g,{jump:true},10);assert.ok(g.fighters[0].y>0);
g.pause();const snapshot=JSON.stringify(g);step(g,{right:true},100);assert.equal(JSON.stringify(g),snapshot);g.pause();assert.equal(g.state,'fight');
g=ready();g.timer=.001;step(g,{},1);assert.equal(g.winner,-1);assert.deepEqual(g.wins,[0,0]);
g=ready();for(let match=0;match<12;match++){for(let r=0;r<2;r++){g.fighters[1].hp=0;g.endRound();if(r===0){assert.equal(g.state,'roundEnd');g.next();}}assert.equal(g.state,'matchWin');g.next();}assert.equal(g.state,'champion');
g=ready();for(let r=0;r<2;r++){g.fighters[0].hp=0;g.endRound();if(!r)g.next();}assert.equal(g.state,'matchLost');g.next();assert.equal(g.index,0);assert.deepEqual(g.wins,[0,0]);
for(const [id]of ROSTER){g.start(id);assert.equal(new Set(g.opponents).size,12);assert.ok(!g.opponents.includes(id));}
console.log('Family Fighter model: damage, range, blocking, recovery, energy, jumping, spacing, pause, draws, retries and full tournament passed.');
