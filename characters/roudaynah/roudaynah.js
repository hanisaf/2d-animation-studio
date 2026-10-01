// Roudaynah: floor origin, local IK targets, deterministic animation and transformed props.
const ROUDAYNAH_UNIT = 4.9;
const RD = {
  ink: '#292630', skin: '#F0C4A8', shade: '#CD9885', blush: '#CF858B',
  hijab: '#F1EFF5', fold: '#CBC7D4', light: '#FFFCFF',
  tunic: '#C5B7D3', seam: '#A08DAF', embroidery: '#E1D8E9',
  pants: '#302E3A', shoe: '#41404D', sole: '#EBE9EC', iris: '#624333',
  laptop: '#736884', screen: '#243447', code: '#A1E7D3',
  heart: '#E879A1', gold: '#F3CA70',
};

function rdLimb(points, width, fill, lw) {
  withBoil(0, () => {
    line(points, { stroke: RD.ink, lw: width + lw * 2 });
    line(points, { stroke: fill, lw: width });
  });
}
function rdHeart(x, y, r, alpha = 1) {
  shape([[x,y+r*.8],[x-r,y],[x-r*.85,y-r*.65],[x-r*.35,y-r*.8],
    [x,y-r*.4],[x+r*.35,y-r*.8],[x+r*.85,y-r*.65],[x+r,y]],
  { fill: rgba(RD.heart,alpha), stroke: null, smooth: .7 });
}
function rdHand(p, angle, lw, kind = 'open') {
  X.save(); X.translate(...p); X.rotate(angle);
  shape(kind === 'fist' ? [[-.3,-.5],[.55,-.55],[.9,-.25],[.9,.4],[.3,.55],[-.3,.2]] :
    [[-.3,-.5],[.55,-.55],[1.55,-.3],[1.75,.05],[1.5,.35],[.7,.5],[.35,.85],[-.3,.2]],
    { fill: RD.skin, stroke: RD.ink, lw, smooth: .6 });
  for (let i=0;i<3;i++) line([[.65,-.2+i*.2],[kind==='fist'?.85:1.4,-.15+i*.17]], { stroke: RD.shade, lw: .08 });
  X.restore();
}
function roudaynah(x, y, s, o = {}) {
  const t = o.t ?? T, A = {}, lw = clamp(s * .14, 1.4, 5) / s;
  X.save(); X.translate(x,y); X.scale(s * (o.flip ? -1 : 1),s);
  if (!o.noShadow) ellipse(0,.2,4.3,.65,{ fill: 'rgba(45,30,55,.18)', stroke: null });
  X.translate(0,-(o.jump || 0));
  if (o.rot) { X.translate(0,-17); X.rotate(o.rot); X.translate(0,17); }
  if (o.sq) X.scale(1+o.sq*.4,1-o.sq);
  withBoil(o.boil ?? .35, () => {
    for (const sd of [-1,1]) {
      const foot = o[sd < 0 ? 'footL' : 'footR'] || [sd*1.7,-1];
      const hip = [sd*1.6,-16+(o.dy || 0)];
      const { joint,end } = ik2(hip,foot,7.4,7.65,[sd*.3,.3]);
      rdLimb([hip,joint,end],2.5,RD.pants,lw);
      line([[joint[0]+sd*.5,joint[1]-.4],[joint[0],joint[1]+.4]],{stroke:RD.ink,lw:.12});
      X.save(); X.translate(...end); X.scale(sd,1);
      shape([[-1.05,-.7],[.45,-.7],[1.8,.2],[1.9,.75],[.5,1],[-1.05,.8]],
        { fill: RD.shoe, stroke: RD.ink, lw, smooth: .4 });
      shape([[.6,-.15],[1.6,.12],[1.85,.55],[.65,.6]],{fill:RD.sole,stroke:RD.ink,lw:lw*.65,smooth:.5});
      line([[-.95,.65],[.4,.8],[1.8,.65]],{ stroke: RD.sole, lw: .24,smooth:true });
      for(let i=0;i<4;i++) line([[-.55+i*.17,-.5+i*.2],[.25+i*.17,-.4+i*.2]],{stroke:RD.ink,lw:.12});
      line([[-.7,-1.6],[-.3,-1.3],[.6,-1.5]],{stroke:RD.ink,lw:.12,smooth:true}); X.restore();
      A[sd<0?'footL':'footR'] = toPx(...end);
      A[sd<0?'kneeL':'kneeR'] = toPx(...joint);
    }
    X.save(); X.translate(0,o.dy || 0); X.translate(0,-14); X.rotate(o.lean || 0); X.translate(0,14);
    // Reference proportions: shorter lavender top, ribbed hem, long charcoal trousers.
    shape([[-1.8,-26.2],[-3.4,-25.3],[-3.8,-22],[-3.6,-18],[-3.8,-15.5],
      [-2.5,-15.1],[0,-15],[2.5,-15.1],[3.8,-15.5],[3.6,-18],[3.8,-22],[3.4,-25.3],[1.8,-26.2]],
      { fill: RD.tunic, stroke: RD.ink, lw, smooth: .5 });
    line([[-3.2,-23],[-2.9,-19],[-3.3,-16]],{ stroke: RD.seam, lw:.16,smooth:true });
    line([[3.2,-23],[2.9,-19],[3.3,-16]],{ stroke: RD.seam, lw:.16,smooth:true });
    line([[-3.6,-16.3],[0,-16.1],[3.6,-16.3]],{ stroke: RD.ink, lw:.13,smooth:true });
    line([[1.4,-21.5],[.5,-19],[-.9,-17.5]],{stroke:RD.seam,lw:.2,smooth:true});
    line([[2.1,-25],[2.7,-23.6],[2.2,-22],[2.6,-20.7]],{stroke:RD.seam,lw:.15,smooth:true});
    for (let i=0;i<3;i++) {
      const cx=2.5+(i%2?-.35:.2), cy=-24.4+i*1.1;
      for (let j=0;j<5;j++) {
        const a=j*TAU/5; ellipse(cx+.28*Math.cos(a),cy+.28*Math.sin(a),.2,.24,{fill:RD.embroidery,stroke:RD.seam,lw:.07});
      }
      circle(cx,cy,.13,{fill:RD.fold,stroke:null});
    }
    A.chest=toPx(0,-21); A.belly=toPx(0,-14.5);
    // Articulated sleeves remain behind the scarf and laptop.
    const hands={};
    for (const sd of [-1,1]) {
      const key=sd<0?'handL':'handR';
      const target=o[key] || (o.laptop ? [sd*2.2,-17] : [sd*4.3,-14.5]);
      const root=[sd*3.2,-24.5], {joint,end}=ik2(root,target,5,5.2,[sd*1,.5]);
      rdLimb([root,joint,end],2.15,RD.tunic,lw);
      line([[joint[0]-sd*.6,joint[1]-.2],[joint[0],joint[1]-.5],[joint[0]+sd*.6,joint[1]-.1]],
        {stroke:RD.seam,lw:.14,smooth:true});
      const angle=Math.atan2(end[1]-joint[1],end[0]-joint[0]);
      X.save(); X.translate(...end); X.rotate(angle);
      shape(rectPts(-.65,-1.05,.65,2.1),{fill:RD.tunic,stroke:RD.ink,lw:lw*.75}); X.restore();
      rdHand(end,angle,lw,o[sd<0?'handPoseL':'handPoseR']);
      if (o.busy && sd<0) {
        ellipse(end[0],end[1]-.55,.62,.3,{fill:RD.gold,stroke:RD.ink,lw:lw*.6});
        circle(end[0],end[1]-.6,.28,{fill:RD.light,stroke:RD.ink,lw:lw*.5});
        line([[end[0],end[1]-.8],[end[0],end[1]-.6],[end[0]+.15,end[1]-.6]],{stroke:RD.ink,lw:.08});
      }
      hands[key]=end; A[key]=toPx(...end);
    }
    X.save(); X.translate(0,-30); X.rotate(o.tilt || 0); X.scale(.72,.72);
    // Full head covering and draped front: no exposed hair.
    shape([[0,-7.1],[3.4,-5.6],[4.3,-2],[4.2,2],[4.8,7],[3.5,9.5],
      [1,11],[-1.3,10.6],[-3.7,8.2],[-4.6,4],[-4.2,-1],[-3.4,-5.6]],
      {fill:RD.hijab,stroke:RD.ink,lw,smooth:.75});
    shape([[-3.7,1],[-3.1,4],[0,6],[3.8,3.8],[3.1,7.1],[.4,9],[-2.4,7.1]],
      {fill:RD.fold,stroke:null,smooth:.8});
    line([[-3.9,2],[-2.8,5.6],[.2,7.2],[3.3,5.7]],{stroke:RD.light,lw:.3,smooth:true});
    line([[-3.1,6],[-1.5,8.8],[.6,9.8],[2.5,8.8]],{stroke:RD.fold,lw:.18,smooth:true});
    const turn=clamp(o.turn || 0,-1,1)*.45;
    shape([[0,-4.9],[2.6,-3.9],[3.1,-1.8],[2.95,1],[1.8,3.1],[0,3.7],[-1.8,3.1],[-2.95,1],[-3.1,-1.8],[-2.6,-3.9]],
      {fill:RD.skin,stroke:RD.ink,lw:lw*.85,smooth:.8});
    line([[-3.4,-1.8],[-2.7,-4.5],[0,-6],[2.7,-4.5],[3.4,-1.8]],{stroke:RD.fold,lw:.22,smooth:true});
    for (const sd of [-1,1]) {
      const cx=sd*1.4+turn,cy=-.9;
      rdEye(cx,cy,sd,o,t,lw); A[sd<0?'eyeL':'eyeR']=toPx(cx,cy);
      const up=o.brows==='up'?-.3:0, worry=o.brows==='worried'?-.35:o.brows==='angry'?.45:0;
      line([[cx-.8,-2.25+up+sd*worry],[cx,-2.5+up],[cx+.8,-2.25+up-sd*worry]],
        {stroke:RD.ink,lw:.25,smooth:true});
      ellipse(sd*2.1+turn,.65,.5,.22,{fill:rgba(RD.blush,.2),stroke:null});
    }
    line([[turn+.2,-.7],[turn,.45],[turn+.4,.55]],{stroke:RD.shade,lw:.16,smooth:true});
    const mouth=o.mouth || 'grin';
    if (mouth==='open') {
      ellipse(turn,1.75,.72,.68,{fill:RD.ink,stroke:RD.ink,lw:lw*.6});
      ellipse(turn,2.07,.42,.2,{fill:RD.blush,stroke:null});
    } else if (mouth==='grin') {
      const pts=[[turn-1.2,1.25],[turn,1.5],[turn+1.2,1.25],[turn+.6,2.25],[turn-.6,2.25]];
      shape(pts,{fill:RD.blush,stroke:RD.ink,lw:lw*.8,smooth:.6});
      X.save(); tracePath(pts,true,.6); X.clip();
      shape(rectPts(turn-1.2,1.2,2.4,.6),{fill:RD.light,stroke:null}); X.restore();
    } else line([[turn-1,1.55],[turn,mouth==='flat'?1.55:mouth==='frown'?1.25:1.95],[turn+1,1.55]],
      {stroke:RD.ink,lw:lw*.8,smooth:true});
    A.head=toPx(0,0); A.top=toPx(0,-7.1); A.mouth=toPx(turn,1.7);
    X.restore();
    if (o.laptop) rdLaptop(t,lw,A,hands);
    if (o.busy) rdChecklist(t,lw);
    if (o.love) rdLove(t,clamp(o.love));
    if (o.ideas) rdIdeas(t,clamp(o.ideas),lw,A);
    X.restore();
  });
  X.restore(); return A;
}
function rdEye(cx,cy,sd,o,t,lw) {
  const kind=o.eyes || 'open', ph=((t+.6)%4.2+4.2)%4.2;
  const blink=clamp(o.blink ?? (ph<.17?Math.sin(ph/.17*Math.PI):0));
  if (kind==='closed' || kind==='happy' || (kind==='wink' && sd>0) || blink>.92) {
    line([[cx-.75,cy],[cx,cy+(kind==='happy'?-.3:.2)],[cx+.75,cy]],{stroke:RD.ink,lw:lw*1.3,smooth:true}); return;
  }
  const ry=(kind==='wide'?.8:kind==='narrow'?.28:.55)*(1-blink);
  const pts=[[cx-.8,cy],[cx-.35,cy-ry],[cx+.35,cy-ry],[cx+.8,cy],[cx+.3,cy+ry*.7],[cx-.3,cy+ry*.7]];
  shape(pts,{fill:RD.light,stroke:RD.ink,lw:lw*.6,smooth:.7});
  X.save(); tracePath(pts,true,.7); X.clip();
  const ix=cx+.2*clamp(o.lookX || 0,-1,1),iy=cy+.16*clamp(o.lookY || 0,-1,1);
  circle(ix,iy,.43,{fill:RD.iris,stroke:null}); circle(ix,iy,.27,{fill:RD.ink,stroke:null});
  circle(ix-.13,iy-.16,.12,{fill:RD.light,stroke:null}); X.restore();
  line(pts.slice(0,4),{stroke:RD.ink,lw:lw*1.3,smooth:true});
  line([[cx+sd*.6,cy-.18],[cx+sd*.95,cy-.4]],{stroke:RD.ink,lw:lw*.8});
}
function rdLaptop(t,lw,A,hands) {
  // Screen faces the viewer so code is readable; palms support the keyboard below.
  shape([[-4.4,-22],[4.4,-22],[4,-16.8],[-4,-16.8]],{fill:RD.laptop,stroke:RD.ink,lw,smooth:.12});
  shape([[-3.9,-21.5],[3.9,-21.5],[3.55,-17.3],[-3.55,-17.3]],{fill:RD.screen,stroke:null});
  for (let i=0;i<5;i++) {
    const yy=-20.7+i*.62, offset=i%2*.45;
    line([[-3.2+offset,yy],[-1.8+offset,yy]],{stroke:i%2?RD.gold:RD.code,lw:.15});
    line([[-1.3+offset,yy],[.6+(i%3)*.65,yy]],{stroke:'#BCA8E4',lw:.14});
  }
  line([[2.4,-18.2],[2.4,-17.8]],{stroke:rgba(RD.code,.5+.5*Math.sin(t*5)),lw:.18});
  shape([[-4,-16.8],[4,-16.8],[5,-15.5],[-5,-15.5]],{fill:RD.fold,stroke:RD.ink,lw,smooth:.15});
  for (let i=0;i<9;i++) line([[-3.4+i*.85,-16.65],[-3.6+i*.9,-15.9]],{stroke:RD.laptop,lw:.09});
  line([[-4.2,-16.15],[4.2,-16.15]],{stroke:RD.laptop,lw:.09});
  shape(rectPts(-.7,-15.95,1.4,.3),{fill:RD.light,stroke:RD.laptop,lw:.08});
  for (const sd of [-1,1]) {
    const p=hands[sd<0?'handL':'handR'];
    for (let j=0;j<3;j++) ellipse(p[0]+sd*j*.2,p[1]+.8+.12*Math.sin(t*9+j+sd),.17,.28,
      {fill:RD.skin,stroke:RD.ink,lw:lw*.4});
  }
  A.laptop=toPx(0,-19);
}
function rdLove(t,k) {
  for (let i=0;i<7;i++) {
    const u=frac(t*.32+i/7), alpha=Math.sin(u*Math.PI)*k;
    rdHeart((i%2?1:-1)*(4.8+u*3)+.4*Math.sin(t*2+i),-19-u*16,.45+u*.35,alpha);
  }
  rdHeart(0,-21,.65+.08*Math.sin(t*4),k);
}
function rdIdeas(t,k,lw,A) {
  // Three little invention cards connect the laptop to a bright idea bulb.
  line([[4.3,-22],[6.8,-24],[7.4,-29]],{stroke:rgba(RD.gold,k*.7),lw:.15,dash:[.3,.3],smooth:true});
  for (let i=0;i<3;i++) {
    const cx=6.6+i*.65,cy=-23.6-i*2+.2*Math.sin(t*2+i);
    shape(rectPts(cx-.75,cy-.55,1.5,1.1),{fill:rgba(RD.light,k),stroke:rgba(RD.seam,k),lw:lw*.6,smooth:.15});
    if (i===0) line([[cx-.4,cy],[cx-.15,cy-.25],[cx+.15,cy+.25],[cx+.4,cy]],{stroke:rgba(RD.code,k),lw:.13});
    if (i===1) rdHeart(cx,cy,.3,k);
    if (i===2) shape(starPts(cx,cy,.4,.18,5),{fill:rgba(RD.gold,k),stroke:null});
  }
  const bx=7.6,by=-31+.25*Math.sin(t*2);
  circle(bx,by,2,{fill:rgba(RD.gold,k*.12),stroke:null});
  circle(bx,by,1,{fill:rgba(RD.gold,k),stroke:rgba(RD.ink,k),lw});
  shape(rectPts(bx-.45,by+.7,.9,.8),{fill:rgba(RD.laptop,k),stroke:rgba(RD.ink,k),lw:lw*.7});
  line([[bx-.35,by],[bx,by+.4],[bx+.35,by]],{stroke:rgba(RD.light,k),lw:.16});
  for(let i=0;i<7;i++) {
    const a=i*TAU/7+t*.15;
    line([[bx+1.5*Math.cos(a),by+1.5*Math.sin(a)],[bx+2.1*Math.cos(a),by+2.1*Math.sin(a)]],{stroke:rgba(RD.gold,k),lw:.15});
  }
  A.idea=toPx(bx,by);
}
function rdChecklist(t,lw) {
  X.save(); X.translate(6.4,-20+.25*Math.sin(t*3)); X.rotate(.07);
  shape(rectPts(-1.2,-2.2,2.4,4.1),{fill:RD.light,stroke:RD.ink,lw,smooth:.15});
  shape(rectPts(-.6,-2.4,1.2,.5),{fill:RD.gold,stroke:RD.ink,lw:lw*.6});
  for(let i=0;i<3;i++) {
    const yy=-1.35+i*.95;
    line([[-.15,yy],[.8,yy]],{stroke:RD.fold,lw:.13});
    line([[-.9,yy],[-.65,yy+.2],[-.35,yy-.2]],{stroke:RD.code,lw:.16});
  }
  X.restore();
}
function roudaynahAbility(t,ability,o={}) {
  const k=clamp(o.k ?? 1), q=Math.sin(t*6);
  if (ability==='hug') return {handL:[-9,-22],handR:[9,-22],eyes:'happy',mouth:'smile',lean:.02*Math.sin(t*2)};
  if (ability==='love') return {...roudaynahAbility(t,'hug'),love:k,handL:[-8.3,-24],handR:[8.3,-24],mouth:'grin'};
  if (ability==='coding' || ability==='ideas') return {laptop:true,ideas:ability==='ideas'?k:0,
    handL:[-2.2,-17],handR:[2.2,-17],lookY:.8,tilt:.035*Math.sin(t*2),mouth:ability==='ideas'?'grin':'smile',brows:ability==='ideas'?'up':'normal'};
  if (ability==='busy') return {busy:true,dy:.12*Math.cos(t*12),lean:.04,handL:[-4.8,-19+.7*q],handR:[4.8,-19-.7*q],
    footL:[-1.7+.8*q,-1-Math.max(0,q)*.65],footR:[1.7-.8*q,-1-Math.max(0,-q)*.65],mouth:'smile'};
  if (ability==='upset') return {handL:[1.8,-20.4],handR:[-1.8,-19.2],brows:'worried',
    mouth:'flat',lookX:-.6,tilt:-.05+.015*Math.sin(t*2),dy:.08*Math.sin(t*2)};
  if (ability==='sad') return {handL:[-4,-14.5],handR:[4,-14.5],brows:'worried',mouth:'frown',
    lookY:.9,tilt:.14,dy:.5+.08*Math.sin(t*1.5),lean:.04};
  if (ability==='angry') return {handL:[-3.7,-19],handR:[3.7,-19],brows:'angry',eyes:'narrow',
    mouth:'frown',footL:[-2,-1],footR:[2,-1],tilt:.025*Math.sin(t*3)};
  if (ability==='mad') {
    const stomp=Math.max(0,Math.sin(t*5));
    return {handL:[-5.3,-17.8],handR:[5.3,-17.8],handPoseL:'fist',handPoseR:'fist',
      brows:'angry',eyes:'narrow',mouth:'open',lean:.025*Math.sin(t*5),dy:.12*Math.cos(t*10),
      footL:[-2.1,-1],footR:[2.1,-1-stomp*.85]};
  }
  return {};
}
function roudaynahPerform(x,y,s,t,ability,o={}) {
  return roudaynah(x,y,s,{...roudaynahAbility(t,ability,o),...o,t});
}
CHARACTERS.roudaynah = {
  draw:roudaynah, unit:ROUDAYNAH_UNIT, palette:RD, size:[23,39],
  poses:{
    'rest':(x,y,s,t)=>roudaynah(x,y,s,{t,dy:.1*Math.sin(t*2)}),
    'hello':(x,y,s,t)=>roudaynah(x,y,s,{t,handR:[5.5,-27+.4*Math.sin(t*5)],mouth:'grin',brows:'up'}),
    'listening':(x,y,s,t)=>roudaynah(x,y,s,{t,tilt:-.12,lookX:.4}),
    'talk':(x,y,s,t)=>roudaynah(x,y,s,{t,handR:[5,-21+.4*Math.sin(t*3)],mouth:Math.sin(t*10)>.2?'open':'smile'}),
    'warm hug':(x,y,s,t)=>roudaynahPerform(x,y,s,t,'hug'),
    'busy mom':(x,y,s,t)=>roudaynahPerform(x,y,s,t,'busy'),
    'programming':(x,y,s,t)=>roudaynahPerform(x,y,s,t,'coding'),
    'original ideas':(x,y,s,t)=>roudaynahPerform(x,y,s,t,'ideas'),
    'love superpower':(x,y,s,t)=>roudaynahPerform(x,y,s,t,'love'),
    'happy':(x,y,s,t)=>roudaynah(x,y,s,{t,eyes:'happy',mouth:'grin',dy:.15*Math.sin(t*4)}),
    'thinking':(x,y,s,t)=>roudaynah(x,y,s,{t,handR:[3.4,-28.5],lookX:.7,lookY:-.6,tilt:.1}),
    'reassuring':(x,y,s,t)=>roudaynah(x,y,s,{t,handL:[-1.7,-20],handR:[5.7,-20],tilt:-.06}),
    'upset':(x,y,s,t)=>roudaynahPerform(x,y,s,t,'upset'),
    'sad':(x,y,s,t)=>roudaynahPerform(x,y,s,t,'sad'),
    'angry':(x,y,s,t)=>roudaynahPerform(x,y,s,t,'angry'),
    'mad':(x,y,s,t)=>roudaynahPerform(x,y,s,t,'mad'),
  },
};
