export const WIDTH = 960, HEIGHT = 540;
const bound = (n,a,b) => Math.max(a,Math.min(b,n));
const distance = (a,b) => Math.hypot(a.x-b.x,a.y-b.y);
export class Match {
  constructor(hero='sami') { this.reset(hero); }
  reset(hero=this.hero) {
    this.events=[]; this.hero=hero; this.state='ready'; this.time=90; this.clock=0; this.score=[0,0]; this.cooldown=0; this.stamina=1; this.notice=''; this.celebration=0; this.kickoff();
  }
  kickoff() {
    this.player={id:this.hero,x:235,y:320,face:1,moving:false};
    this.kids=[{id:'housam',x:510,y:270},{id:'danny',x:615,y:390},{id:'jenna',x:700,y:225},{id:'alma',x:850,y:315}];
    this.ball={x:260,y:320,z:0,vx:0,vy:0,vz:0,owner:'player',lock:0}; this.cooldown=.4;
    if(this.state==='playing') this.events.push('kickoff');
  }
  drainEvents() { return this.events.splice(0); }
  start() { this.state='playing'; this.events.push('kickoff'); }
  pause() { if(this.state==='playing') this.state='paused'; }
  resume() { if(this.state==='paused') this.state='playing'; }
  goal(team) { this.events.push(team===0?'goal':'kids-goal'); this.score[team]++; this.celebration=1.8; this.notice=team===0?'GOOOAL!':'KIDS’ TEAM SCORES!'; this.ball.owner=null; this.ball.vx=0; this.ball.vy=0; }
  shoot(chip,aim=0) {
    const b=this.ball;
    if(b.owner!=='player'||this.cooldown>0) return false;
    b.owner=null; b.vx=chip?440:620; b.vy=(315-b.y)*.68+aim*105; b.vz=chip?260:0; b.z=chip?5:0; b.lock=.22; this.cooldown=.4;
    this.events.push(chip?'chip':'shot'); this.notice=chip?'CHIP SHOT!':'SHOT!'; return true;
  }
  update(dt,input={}) {
    if(this.state!=='playing') return;
    this.clock+=dt;
    if(this.celebration>0) { this.celebration-=dt; if(this.celebration<=0) { this.kickoff(); this.notice='KICK OFF!'; } return; }
    this.time=Math.max(0,this.time-dt);
    if(this.time<=0) { this.events.push('fulltime'); this.state='finished'; this.notice=this.score[0]>this.score[1]?'WORLD CHAMPION!':this.score[0]===this.score[1]?'HONORS EVEN!':'KIDS’ TEAM WINS!'; return; }
    this.cooldown=Math.max(0,this.cooldown-dt);
    const p=this.player,b=this.ball;
    let dx=Number(!!input.right)-Number(!!input.left),dy=Number(!!input.down)-Number(!!input.up),mag=Math.hypot(dx,dy);
    const sprint=input.sprint&&this.stamina>.03&&mag>0;
    this.stamina=bound(this.stamina+(sprint?-.38:.23)*dt,0,1);
    p.moving=mag>0;
    if(mag) { const speed=sprint?240:163; p.x=bound(p.x+dx/mag*speed*dt,85,865); p.y=bound(p.y+dy/mag*speed*dt,174,462); if(dx) p.face=Math.sign(dx); }
    if(input.chip||input.shoot) this.shoot(!!input.chip,dy);
    // Housam presses the ball; Danny and Jenna cover passing lanes. Alma guards the right goal.
    const nearest=[...this.kids.slice(0,3)].sort((a,c)=>distance(a,b)-distance(c,b))[0];
    for(const [i,k] of this.kids.entries()) {
      let tx,ty,speed;
      if(k.id==='alma') { tx=850; ty=bound(b.y,264,378); speed=125; }
      else if(b.owner===k.id) { tx=105; ty=315; speed=114; }
      else if(k===nearest) { tx=b.x; ty=b.y; speed=k.id==='housam'?130:115; }
      else { tx=bound(b.x+95+i*60,350,770); ty=bound(b.y+(i===1?100:-95),190,445); speed=88; }
      const ax=tx-k.x,ay=ty-k.y,l=Math.hypot(ax,ay); k.moving=l>4; k.face=ax<0?-1:1;
      if(l>4) { k.x+=ax/l*speed*dt; k.y+=ay/l*speed*dt; }
    }
    b.lock=Math.max(0,b.lock-dt);
    if(b.owner==='player') { b.x=p.x+20; b.y=p.y; b.z=0;
      if(this.cooldown===0) for(const k of this.kids) if(distance(k,b)<23) { b.owner=k.id; b.lock=.65; this.events.push('steal'); this.notice=`${k.id.toUpperCase()} STEALS!`; break; }
    } else if(b.owner) {
      const k=this.kids.find(k=>k.id===b.owner); b.x=k.x-18; b.y=k.y; b.z=0;
      if(b.lock===0&&distance(p,b)<33) { b.owner='player'; this.cooldown=.3; this.events.push('tackle'); this.notice='GREAT TACKLE!'; }
      else if(k.x<340||(k.id==='alma'&&b.lock===0)) { this.events.push('shot'); b.owner=null; b.vx=-390; b.vy=(315-b.y)*1.4; b.vz=0; b.lock=.25; }
    } else {
      b.x+=b.vx*dt; b.y+=b.vy*dt; b.z=Math.max(0,b.z+b.vz*dt); b.vz-=490*dt;
      if(b.z===0) { b.vz=0; b.vx*=Math.pow(.83,dt); b.vy*=Math.pow(.83,dt); }
      if(b.y<168||b.y>470) { b.y=bound(b.y,168,470); b.vy*=-.8; this.events.push('bounce'); }
      if(b.x>890||b.x<70) {
        if(b.y>252&&b.y<390&&b.z<65) { this.goal(b.x>890?0:1); return; }
        b.x=bound(b.x,70,890); b.vx*=-.7; this.events.push('bounce'); this.notice=b.z>=65?'OVER THE BAR!':'OFF THE BOARDS!';
      }
      if(b.lock===0&&b.z<23) {
        if(distance(p,b)<29) { b.owner='player'; this.cooldown=.2; }
        else for(const k of this.kids) if(distance(k,b)<(k.id==='alma'?30:22)) { b.owner=k.id; b.lock=.65; this.events.push(k.id==='alma'?'save':'steal'); this.notice=k.id==='alma'?'ALMA SAVES!':''; break; }
      }
    }
  }
}
