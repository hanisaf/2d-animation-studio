// Scene 17: a deterministic, time-seekable clinical teaching board.
(() => {
  const ID = 'scene17_access_recirculation', LINES = ASSETS.scene[ID].dialogue;
  const HALL = LOCATIONS.lecture_hall;
  const C = { dark: '#173644', mint: '#8AE5B3', fresh: '#FFA680', clear: '#83D8FF', gold: '#FFD684', white: '#EDF9F6', muted: '#BCD2D7' };
  const titles = ["Good flow. Poor clearance?","First: the normal route","The short circuit","Fresh inflow cannot keep up","Why an AV access recirculates","Why a catheter recirculates","Local loop versus heart–lung loop","Measure the right phenomenon","A and V: sample at full flow","S: the revised slow–stop method","Turn three BUN values into a percentage","Interpret carefully. Investigate the access."];
  function txt(s,x,y,size=30,color=C.white,weight=600) {
    X.font = weight+' '+size+'px '+FONT_TALK; X.fillStyle=color; X.textAlign='left'; X.textBaseline='middle'; X.fillText(s,x,y);
  }
  function box(x,y,w,h,fill,stroke=null) { shape(rectPts(x,y,w,h),{fill,stroke,lwPx:2,smooth:.06}); }
  function arrow(a,b,col,width=5) {
    line([a,b],{stroke:col,lwPx:width}); const ang=Math.atan2(b[1]-a[1],b[0]-a[0]);
    shape([b,[b[0]-17*Math.cos(ang-.5),b[1]-17*Math.sin(ang-.5)],[b[0]-17*Math.cos(ang+.5),b[1]-17*Math.sin(ang+.5)]],{fill:col,stroke:null});
  }
  // Walk a polyline by distance: particles keep their speed through corners.
  function route(pts,t,color,count=9,speed=.17) {
    line(pts,{stroke:color,lwPx:8});
    const lengths=pts.slice(1).map((p,i)=>Math.hypot(p[0]-pts[i][0],p[1]-pts[i][1]));
    const total=lengths.reduce((a,b)=>a+b,0);
    for(let i=0;i<count;i++) {
      let d=(((t*speed+i/count)%1+1)%1)*total,j=0;
      while(j<lengths.length-1 && d>lengths[j])d-=lengths[j++];
      const u=d/lengths[j],a=pts[j],b=pts[j+1];
      circle(lerp(a[0],b[0],u),lerp(a[1],b[1],u),7,{fill:color,stroke:C.dark,lwPx:2});
    }
    arrow(pts[pts.length-2],pts[pts.length-1],color,3);
  }
  function rows(items,y=130) { items.forEach((s,i)=>{circle(42,y+i*76,5,{fill:C.mint,stroke:null});txt(s,65,y+i*76,30);}); }
  function tag(s,x,y,color=C.mint) { box(x,y-23,380,46,'#30515F');txt(s,x+16,y,27,color); }
  function circuit(t,recirc=false,low=false) {
    txt('SYSTEMIC BLOOD',34,124,29,C.fresh); txt('ACCESS',414,124,29,C.white);txt('DIALYZER',804,124,29,C.white);
    box(800,205,185,247,'#30515F',C.clear);
    for(let i=0;i<7;i++)line([[822+i*23,228],[822+i*23,430]],{stroke:C.clear,lwPx:3});
    txt('Solutes out',816,485,24,C.mint);arrow([986,327],[1040,327],C.mint);
    route([[45,270],[425,270]],t,C.fresh,7);
    route([[425,270],[605,270],[605,212],[800,212]],t,C.fresh,7);
    route([[985,420],[630,420],[630,565],[425,565],[45,565]],t,C.clear,10);
    txt('A: arterial pickup',352,225,25,C.fresh); txt('V: venous return',350,612,25,C.clear);
    txt('Fresh / solute-rich',36,312,23,C.fresh);txt('Cleared / solute-poor',35,523,23,C.clear);
    if(recirc) {
      route([[425,565],[425,430],[425,270]],t,C.gold,6,.24);
      txt('LOCAL SHORTCUT',145,412,27,C.gold);
      circle(425,270,20+3*Math.sin(t*2),{fill:null,stroke:C.gold,lwPx:3});
    } else arrow([186,565],[65,565],C.clear);
    if(low)tag('Qb > fresh access inflow',570,560,C.gold);
    txt(recirc?'Cleared blood returns before systemic mixing.':'Arterial → dialyzer → venous → systemic mixing.',35,670,27,recirc?C.gold:C.mint);
  }
  function causeAV(t) {
    txt('AV FISTULA / GRAFT',35,125,36,C.mint);
    route([[45,260],[330,260],[530,260],[755,260],[1030,260]],t,C.fresh,14);
    shape([[720,230],[755,248],[795,230],[795,290],[755,272],[720,290]],{fill:C.gold,stroke:null});
    txt('Downstream stenosis',660,185,26,C.gold);
    arrow([340,255],[340,390],C.fresh);arrow([550,390],[550,265],C.clear);
    route([[550,290],[340,290]],t,C.gold,5);
    txt('A',325,425,32,C.fresh);txt('V',535,425,32,C.clear);
    rows(['Reduced access flow relative to pump withdrawal','Check needle spacing, direction, and placement'],515);
  }
  function causeCath(t) {
    txt('CATHETER: LOCAL FLOW GEOMETRY',35,120,34,C.mint);
    box(95,175,925,240,'#244552');
    route([[100,375],[1020,375]],t,C.fresh,12,.11);
    line([[220,188],[520,188],[520,275]],{stroke:C.fresh,lwPx:19});
    line([[270,225],[630,225],[630,315]],{stroke:C.clear,lwPx:19});
    route([[630,315],[576,320],[520,275]],t,C.gold,4,.3);
    txt('A lumen',175,145,25,C.fresh);txt('V lumen',520,145,25,C.clear);
    rows(['Tips too close or malpositioned','Fibrin sheath redirects returned blood','Reversed lines can increase recirculation'],480);
  }
  function loops(t) {
    box(30,126,495,300,'#30515F');box(555,126,495,300,'#30515F');
    txt('LOCAL ACCESS LOOP',55,165,29,C.gold);
    route([[95,240],[435,240],[435,350],[95,350],[95,240]],t,C.gold,8);
    txt('V → A without systemic mixing',55,395,25);
    txt('CARDIOPULMONARY LOOP',575,165,29,C.mint);
    route([[620,335],[620,230],[980,230],[980,335],[620,335]],t,C.mint,10,.12);
    txt('Heart → lungs → AV access',635,284,26);
    txt('Before full tissue mixing',590,395,25);
    rows(['Small physiologic component with AV access','Thermodilution baseline can be about 5–7%','Interpret with the specific measurement method'],500);
  }
  function methods() {
    rows(['Ultrasound / saline dilution: reference approach','Urea: revised slow–stop alternative','Automated thermal / ionic methods: device-specific'],150);
    box(30,420,1020,220,'#3F4650');
    txt('SAMPLING PITFALL',55,463,32,C.gold);
    txt('Opposite-arm peripheral BUN can give a false result.',55,520,29);
    txt('Use the validated systemic sampling technique. [4,5]',55,585,27,C.mint);
  }
  function samples(t,systemic) {
    const labels=systemic?['S  •  systemic BUN']:['A  •  arterial BUN','V  •  venous BUN'];
    labels.forEach((s,i)=>{const x=systemic?445:210+i*500;box(x,152,120,200,'#30515F',i?C.clear:C.fresh);box(x+8,240,104,103,i?C.clear:C.fresh);box(x-4,142,128,22,C.muted);txt(s,x-115,402,30,i?C.clear:C.fresh);});
    if(!systemic) {
      tag('Normal operating Qb',345,492);txt('Draw A and V simultaneously.',220,575,36,C.mint);
      txt('Keep line connections in their normal position.',145,645,27);
    } else {
      const elapsed=Math.min(10,Math.max(0,t-127));
      tag('Qb = '+(t<137?'120 mL/min':'STOPPED'),35,495,C.gold);
      txt('Wait: '+elapsed.toFixed(0)+' / 10 seconds',510,495,34,C.mint);
      box(40,545,990,15,'#30515F');box(40,545,990*elapsed/10,15,C.mint);
      txt(t<137?'Allow the local recirculation component to clear.':'Stop pump → draw S from the arterial line.',40,625,30);
      txt('Trained staff • validated unit sampling protocol [5]',40,680,24,C.muted);
    }
  }
  function math(t) {
    txt('R =',70,185,64,C.mint);txt('S − A',410,132,60);line([[320,185],[730,185]],{stroke:C.white,lwPx:4});txt('S − V',410,239,60);txt('× 100%',780,185,55,C.mint);
    txt('S = systemic     A = arterial     V = venous',100,330,31,C.muted);
    tag('Example BUN values (mg/dL)',55,405);
    txt('S = 60       A = 54       V = 20',85,475,40);
    if(t>=147){txt('(60 − 54) / (60 − 20) × 100',65,555,40);txt('= 15%',740,555,56,C.gold);}
    txt('Same units for all samples. S = V: result undefined.',55,670,27,C.muted);
  }
  function finish() {
    txt('UREA SLOW–STOP INTERPRETATION [5]',35,125,31,C.mint);
    txt('Single value >10%',55,213,43,C.gold);txt('Strong evidence of true recirculation',55,270,30);
    txt('Repeated values >5%',55,355,43,C.gold);txt('Likely significant; verify technique and investigate',55,412,28);
    line([[35,470],[1045,470]],{stroke:'#43616B',lwPx:2});
    txt('Good displayed Qb ≠ adequate delivered clearance',40,525,31,C.mint);
    txt('Review access, line position, and delivered Kt/V.',40,590,30);
    txt('Full references and sampling caveats: scene Docs',40,663,26,C.muted);
  }
  function board(t,index) {
    X.save();X.translate(715,275);
    box(-10,-10,1140,725,'#FFF9E9',PAL.ink);box(0,0,1120,705,C.dark);
    txt(String(index+1).padStart(2,'0')+' / 12',35,49,24,C.mint);
    txt(titles[index],185,49,32,C.white,800);
    line([[35,85],[1085,85]],{stroke:'#43616B',lwPx:2});
    if(index===0){txt('PUMP DISPLAY',45,150,30,C.muted);txt('Qb 400 mL/min',45,232,55,C.mint);txt('DELIVERED DOSE',45,350,30,C.muted);txt('Kt/V lower than expected',45,425,45,C.gold);rows(['Persistent hyperkalemia or azotemia are clues','Check recirculation and other causes of low dose'],540);}
    else if(index<=3)circuit(t,index>=2,index===3);
    else if(index===4)causeAV(t);
    else if(index===5)causeCath(t);
    else if(index===6)loops(t);
    else if(index===7)methods();
    else if(index===8)samples(t,false);
    else if(index===9)samples(t,true);
    else if(index===10)math(t);
    else finish();
    X.restore();
  }
  function shot(t,index) {
    const k=3.2+.018*Math.sin(t*.2),z=1990,y=HALL.STAGE.y;
    const P=persp({x:-110+3*Math.sin(t*.17),y:190,z:z-1800/k,f:1800,hy:990-(190-y)*k});
    layer(()=>HALL.back(P,t,{splitZ:z,screen:0}),{blur:2});
    const speaking=LINES.some(l=>{const n=(t-l.at-.2)*l.cps;return n>0 && n<l.text.replace(/\*/g,'').length;});
    const [sx,sy,scale]=P.p(-295,y,z);
    const A=sami(sx,sy,SAMI_UNIT*scale,{t,turn:.08,tilt:.018*Math.sin(t*.8),lookX:.35,
      handL:[-5.3,-12.4+.35*Math.sin(t)],handR:[5.8,-16.5+.7*Math.sin(t*.7)],
      handPoseL:'palm',handPoseR:'point',mouth:lipFlap(t,speaking,'smile'),brows:'up'});
    HALL.front(P,t,{splitZ:z});board(t,index);
    txt('DR. SAMI',95,1020,30,'#355867',800);txt('ACCESS RECIRCULATION',715,1030,27,'#355867',800);
    // A single bubble in the header band, above the diagram and beside Sami.
    for(const l of LINES)callout(l.text,A.mouth[0]+40,A.mouth[1],t-l.at,{dx:1120-A.mouth[0]-40,dy:155-A.mouth[1],size:32,maxW:1000,cps:l.cps,hold:l.hold,accent:'#247B69'});
    box(715,1050,1120,6,'#BCD2D7');box(715,1050,1120*t/168,6,'#247B69');
  }
  scene({duration:168,fps:24,bpm:90,shots:titles.map((_,i)=>[i*14,t=>shot(t,i)])});
})();
