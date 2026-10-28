export const WIDTH = 960, HEIGHT = 496;
const bound = (n,a,b) => Math.max(a,Math.min(b,n));
const distance = (a,b) => Math.hypot(a.x-b.x,a.y-b.y);
export class Match {
  constructor(hero='sami',team=0) { this.reset(hero,team); }
  reset(hero=this.hero,team=this.team??0) {
    this.events=[]; this.team=team; this.hero=hero; this.state='ready'; this.time=90; this.clock=0; this.score=[0,0]; this.cooldown=0; this.stamina=1; this.notice=''; this.celebration=0; this.kickoff();
  }
  kickoff() {
    this.grownups=[{id:this.hero,team:0,x:235,y:320,face:1,moving:false},
      {id:this.hero==='sami'?'safadi':'sami',team:0,x:165,y:235,face:1,moving:false}];
    this.kids=[{id:'housam',x:510,y:270},{id:'danny',x:615,y:390},{id:'jenna',x:700,y:225},{id:'alma',x:850,y:315}].map(k=>({...k,team:1,face:-1,moving:false}));
    this.player=this.team===0?this.grownups[0]:this.kids[0];
    this.ball={x:this.player.x+(this.team===0?20:-20),y:this.player.y,z:0,vx:0,vy:0,vz:0,owner:this.player.id,lock:0}; this.cooldown=.4;
    if(this.state==='playing') this.events.push('kickoff');
  }
  drainEvents() { return this.events.splice(0); }
  start() { this.state='playing'; this.events.push('kickoff'); }
  pause() { if(this.state==='playing') this.state='paused'; }
  resume() { if(this.state==='paused') this.state='playing'; }
  goal(team) { this.events.push(team===0?'goal':'kids-goal'); this.score[team]++; this.celebration=1.8; this.notice=team===0?'GROWN-UPS SCORE!':'KIDS’ TEAM SCORES!'; this.ball.owner=null; this.ball.vx=0; this.ball.vy=0; }
  shoot(chip,aim=0) {
    const b=this.ball;
    if(b.owner!==this.player.id||this.cooldown>0) return false;
    b.owner=null; b.vx=(this.player.team===0?1:-1)*(chip?440:620); b.vy=(315-b.y)*.68+aim*105; b.vz=chip?260:0; b.z=chip?5:0; b.lock=.22; this.cooldown=.4;
    this.events.push(chip?'chip':'shot'); this.notice=chip?'CHIP SHOT!':'SHOT!'; return true;
  }
  get actors() { return [...this.grownups,...this.kids]; }
  pass() {
    const b=this.ball,p=this.player;
    if(b.owner!==p.id||this.cooldown>0) return false;
    const target=this.actors.filter(a=>a.team===p.team&&a!==p).sort((a,c)=>distance(a,p)-distance(c,p))[0];
    const dx=target.x-b.x,dy=target.y-b.y,length=Math.hypot(dx,dy)||1;
    b.owner=null; b.vx=dx/length*360; b.vy=dy/length*360; b.z=0; b.vz=0; b.lock=.12;
    this.cooldown=.35; this.events.push('shot'); this.notice='PASS!'; return true;
  }
  takeBall(actor) {
    const old=this.player;
    this.ball.owner=actor.id; if(actor.team===this.team) this.player=actor; this.ball.lock=.6; this.cooldown=.25;
    this.notice=actor.team===this.team?'TEAMMATE ON THE BALL!':'POSSESSION CHANGES!';
  }
  update(dt,input={}) {
    if(this.state!=='playing') return;
    this.clock+=dt;
    if(this.celebration>0) { this.celebration-=dt; if(this.celebration<=0) { this.kickoff(); this.notice='KICK OFF!'; } return; }
    this.time=Math.max(0,this.time-dt);
    if(this.time<=0) { this.events.push('fulltime'); this.state='finished'; this.notice=this.score[this.team]>this.score[1-this.team]?'WORLD CHAMPION!':this.score[0]===this.score[1]?'HONORS EVEN!':`${this.team===0?'KIDS':'GROWN-UPS'}’ TEAM WINS!`; return; }
    this.cooldown=Math.max(0,this.cooldown-dt);
    const b=this.ball;
    const owner=this.actors.find(a=>a.id===b.owner);
    if(owner?.team===this.team) this.player=owner;
    else {
      this.player=this.actors.filter(a=>a.team===this.team).sort((a,c)=>distance(a,b)-distance(c,b))[0];
    }
    const p=this.player;
    let dx=Number(!!input.right)-Number(!!input.left),dy=Number(!!input.down)-Number(!!input.up),mag=Math.hypot(dx,dy);
    const sprint=input.sprint&&this.stamina>.03&&mag>0;
    this.stamina=bound(this.stamina+(sprint?-.38:.23)*dt,0,1);
    p.moving=mag>0;
    if(mag) { const speed=sprint?240:163; p.x=bound(p.x+dx/mag*speed*dt,85,865); p.y=bound(p.y+dy/mag*speed*dt,174,462); if(dx) p.face=Math.sign(dx); }
    if(input.chip||input.shoot) this.shoot(!!input.chip,dy);
    if(input.pass) this.pass();
    // Opposing carriers dribble toward their goal and shoot within range.
    if(owner && owner.team!==this.team) {
      const direction=owner.team===0?1:-1, target=owner.team===0?865:95;
      const dx=target-owner.x,dy=315-owner.y,length=Math.hypot(dx,dy)||1;
      owner.x+=dx/length*114*dt; owner.y+=dy/length*114*dt; owner.face=direction; owner.moving=true;
      if((owner.team===0?owner.x>650:owner.x<310)&&b.lock===0) {
        b.owner=null; b.vx=direction*440; b.vy=(315-owner.y)*1.4; b.vz=0; b.z=0; b.lock=.25;
        this.events.push('shot'); this.notice='OPPONENT SHOOTS!';
      }
    }
    // Every off-ball actor supports, marks, or chases a loose ball.
    for(const team of [0,1]) {
      const others=this.actors.filter(a=>a.team===team&&a!==p&&a!==owner);
      const nearest=[...others].sort((a,c)=>distance(a,b)-distance(c,b))[0];
      for(const [i,a] of others.entries()) {
        const direction=team===0?1:-1;
        let tx,ty,speed=112;
        if(!b.owner || team!==(owner?.team??p.team)) {
          if(a===nearest) { tx=b.x; ty=b.y; speed=138; }
          else { tx=bound(b.x-direction*(100+i*45),105,850); ty=bound(b.y+(i%2?85:-85),190,445); }
        } else {
          tx=bound((owner??p).x+direction*(110+i*45),110,850); ty=bound((owner??p).y+(i%2?90:-90),190,445); speed=132;
        }
        if(a.id==='alma'&&a!==nearest) { tx=850; ty=bound(b.y,264,378); }
        const dx=tx-a.x,dy=ty-a.y,length=Math.hypot(dx,dy);
        a.moving=length>4; if(dx) a.face=Math.sign(dx);
        if(length>4) { const move=Math.min(length,speed*dt); a.x+=dx/length*move; a.y+=dy/length*move; }
      }
    }
    b.lock=Math.max(0,b.lock-dt);
    if(b.owner) {
      const carrier=this.actors.find(a=>a.id===b.owner);
      b.x=carrier.x+(carrier.team===0?20:-20); b.y=carrier.y; b.z=0;
      if(b.lock===0&&this.cooldown===0) {
        const tackler=this.actors.find(a=>a.team!==carrier.team&&distance(a,b)<24);
        if(tackler) { this.takeBall(tackler); this.events.push('steal'); }
      }
    } else {
      b.x+=b.vx*dt; b.y+=b.vy*dt; b.z=Math.max(0,b.z+b.vz*dt); b.vz-=490*dt;
      if(b.z===0) { b.vz=0; b.vx*=Math.pow(.83,dt); b.vy*=Math.pow(.83,dt); }
      if(b.y<168||b.y>470) { b.y=bound(b.y,168,470); b.vy*=-.8; this.events.push('bounce'); }
      if(b.x>890||b.x<70) {
        if(b.y>252&&b.y<390&&b.z<65) { this.goal(b.x>890?0:1); return; }
        b.x=bound(b.x,70,890); b.vx*=-.7; this.events.push('bounce'); this.notice=b.z>=65?'OVER THE BAR!':'OFF THE BOARDS!';
      }
      if(b.lock===0&&b.z<23) {
        const receiver=this.actors.filter(a=>distance(a,b)<(a.id==='alma'?30:26)).sort((a,c)=>distance(a,b)-distance(c,b))[0];
        if(receiver) { this.takeBall(receiver); this.events.push(receiver.id==='alma'?'save':'tackle'); }

      }
    }
  }
}
