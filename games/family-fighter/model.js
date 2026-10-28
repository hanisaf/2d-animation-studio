export const ARENAS = [
 {id:'throne_room',name:'Pearl’s Throne Room'},
 {id:'safadi_study',name:'Safadi’s Study'},
 {id:'school_gym',name:'Dove Creek Gym'},
 {id:'ancient_athens',name:'Ancient Athens'},
 {id:'soccer_field',name:'County Soccer Field'},
 {id:'sami_clinic',name:'Sami’s Clinic'},
 {id:'roman_bath',name:'Roman Bath'},
 {id:'science_room',name:'Science Room'},
 {id:'alma_bedroom',name:'Alma’s Bedroom'},
 {id:'housam_bedroom',name:'Housam’s Bedroom'},
 {id:'school_library',name:'School Library'},
 {id:'house',name:'Family House'}
];
export const ROSTER = [
 ['jester_fester','Jester Fester',30],['princess_pearl','Princess Pearl',22],['safadi','Professor Safadi',31],['alma','Alma',24],['dragon','Dragon',28],['housam','Housam',32],['danny','Danny',29],['sami','Doctor Sami',31],['jenna','Jenna',30],['robo_safadi','Robo Safadi',32],['clawd','Clawd',13],['neptune','Neptune',23],['sarah','Sarah',36]
];
export const ATTACKS = {
 punch: {move:'light punch', duration:.55, range:108, damage:9},
 kick: {move:'heavy kick', duration:.8, range:142, damage:15},
 special: {move:'special', duration:1.2, range:235, damage:23}
};
export class Tournament {
 constructor(random = Math.random) { this.random=random; this.state='select'; this.elapsed=0; }
 start(id) { this.hero=id; this.opponents=ROSTER.map(r=>r[0]).filter(x=>x!==id); this.index=0; this.matchVictories=0; this.match(); }
 get arena() { return ARENAS[Math.min(this.index ?? 0,(this.opponents?.length ?? 1)-1) % ARENAS.length]; }
 match() { this.wins=[0,0]; this.round=1; this.newRound(); }
 newRound() {
  this.fighters=[this.make(this.hero,300,1),this.make(this.opponents[this.index],660,-1)];
  this.timer=60; this.phaseTime=1.3; this.state='intro'; this.aiTime=.3; this.flash=0; this.message=`ROUND ${this.round}`;
 }
 make(id,x,facing) { return {id,x,facing,hp:100,y:0,vy:0,move:'stance',moveTime:0,attack:null,stun:0,block:false,crouch:false,energy:100}; }
 pause() { if(['fight','intro','roundEnd','matchWin','matchLost'].includes(this.state)) { this.previous=this.state; this.state='paused'; } else if(this.state==='paused') this.state=this.previous; }
 next() {
  if(this.state==='roundEnd'&&this.resultTime<=0) { if(this.winner!==-1)this.round++; this.newRound(); }
  else if(['matchWin','matchLost'].includes(this.state)&&this.resultTime<=0) {
   if(this.state==='matchWin')this.matchVictories++;
   this.index++;
   if(this.index===this.opponents.length){
    this.state=this.matchVictories===this.opponents.length?'champion':'complete';
    this.message=this.state==='champion'?'FAMILY CHAMPION!':'TOURNAMENT COMPLETE!';
   }else this.match();
  }
 }
 endRound() {
  // A tied timer is a draw: replay the round without awarding either fighter a win.
  const [a,b]=this.fighters;
  this.winner=a.hp===b.hp ? -1 : a.hp>b.hp ? 0:1;
  if(this.winner>=0) this.wins[this.winner]++;
  this.message=this.winner<0?'DRAW · REPLAY ROUND':this.winner===0?'YOU WIN THE ROUND':'RIVAL WINS THE ROUND';
  this.state=this.wins[0]===2?'matchWin':this.wins[1]===2?'matchLost':'roundEnd';
  this.resultTime=this.state==='roundEnd'?5:4;
  if(this.state==='matchWin')this.message='MATCH WON!';
  if(this.state==='matchLost')this.message='RIVAL WINS THE MATCH';
  for(let i=0;i<2;i++){const f=this.fighters[i];f.attack=null;f.move=i===this.winner?'victory':'defeat';f.moveTime=0;}
 }
 update(dt,input={}) {
  if(['roundEnd','matchWin','matchLost'].includes(this.state)){
   this.elapsed+=dt;
   for(const f of this.fighters)f.moveTime+=dt;
   this.resultTime=Math.max(0,this.resultTime-dt);
   if(this.resultTime===0)this.next();
   return;
  }
  if(!['fight','intro'].includes(this.state))return;
  this.elapsed+=dt;this.flash=Math.max(0,this.flash-dt);
  if(this.state==='intro'){this.phaseTime-=dt;if(this.phaseTime<=0)this.state='fight';return;}
  this.timer=Math.max(0,this.timer-dt);
  const [a,b]=this.fighters, gap=Math.abs(a.x-b.x);
  this.aiTime-=dt;
  if(this.aiTime<=0){this.aiTime=.22+this.random()*.35;const r=this.random();this.ai={left:gap>112&&b.x>a.x,right:gap>112&&b.x<a.x,block:!!a.attack&&r<.48,crouch:r>.92,jump:r>.96,punch:gap<115&&r<.55,kick:gap<150&&r>=.55&&r<.85,special:gap<230&&r>=.85};}
  this.control(a,input,dt);this.control(b,this.ai||{},dt);
  // Preserve readable spacing and prevent fighters walking through one another.
  if(Math.abs(a.x-b.x)<74){const direction=a.x<b.x?1:-1,mid=(a.x+b.x)/2;a.x=mid-37*direction;b.x=mid+37*direction;}
  for(const f of this.fighters)f.x=Math.max(100,Math.min(860,f.x));
  if(Math.abs(a.x-b.x)<74){const left=a.x<b.x?a:b,right=left===a?b:a;if(left.x===100)right.x=174;else left.x=right.x-74;}
  a.facing=a.x<b.x?1:-1;b.facing=-a.facing;
  // Resolve both strikes before deciding the round, allowing a double knockout draw.
  for(const [attacker,target] of [[a,b],[b,a]]){
   const attack=attacker.attack;
   if(attack&&!attack.hit&&attacker.moveTime>=attack.duration*.4){
    attack.hit=true;
    if(Math.abs(attacker.x-target.x)<=attack.range&&Math.abs(attacker.y-target.y)<100){
     const blocked=target.block&&target.stun<=0;
     const damage=blocked?Math.ceil(attack.damage*.15):attack.damage;
     target.hp=Math.max(0,target.hp-damage);target.stun=blocked?.17:.3;
     target.move=blocked?(target.crouch?'block recoil low':'block recoil high'):'hit body';target.moveTime=0;
     if(!blocked)target.attack=null;
     target.x=Math.max(100,Math.min(860,target.x+attacker.facing*(blocked?7:20)));
     this.onEvent?.(blocked?'block':'hit');
     this.flash=.12; this.lastHit={x:(attacker.x+target.x)/2,y:target.y,blocked};
    }
   }
  }
  if(a.hp<=0||b.hp<=0||this.timer<=0)this.endRound();
 }
 control(f,i,dt) {
  f.moveTime+=dt;f.stun=Math.max(0,f.stun-dt);f.energy=Math.min(100,f.energy+dt*10);
  if(f.y>0||f.vy>0){f.vy-=850*dt;f.y=Math.max(0,f.y+f.vy*dt);if(!f.y)f.vy=0;}
  if(f.attack&&f.moveTime>=f.attack.duration){f.attack=null;f.moveTime=0;}
  if(f.stun>0)return;
  f.block=!!i.block&&!f.attack&&!f.y;f.crouch=!!i.crouch&&!f.y;
  if(f.attack)return;
  if(!f.block){for(const key of ['special','kick','punch'])if(i[key]&&(key!=='special'||f.energy>=40)){
   this.onEvent?.(key);f.attack={...ATTACKS[key],hit:false};f.move=f.attack.move;f.moveTime=0;if(key==='special')f.energy-=40;return;
  }}
  if(i.jump&&!f.y&&!f.crouch&&!f.block){this.onEvent?.('jump');f.vy=410;f.y=1;f.moveTime=0;}
  const direction=Number(!!i.right)-Number(!!i.left);
  if(!f.block&&!f.crouch)f.x+=direction*190*dt;
  f.move=f.block?(f.crouch?'block low':'block high'):f.y?'jump':f.crouch?'crouch':direction?(direction===f.facing?'walk forward':'walk backward'):'stance';
 }
}
