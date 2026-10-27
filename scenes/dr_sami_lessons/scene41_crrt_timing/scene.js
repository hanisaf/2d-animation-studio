// Scene 41: question, deliberate pause, answer, and evidence.
(() => {
  const ID='scene41_crrt_timing', LINES=ASSETS.scene[ID].dialogue, HALL=LOCATIONS.lecture_hall;
  const C={dark:'#173644',panel:'#294B58',mint:'#8AE5B3',gold:'#FFD684',red:'#FF9B91',blue:'#83D8FF',white:'#EDF9F6',muted:'#BBD1D6'};
  const TITLES=['QUESTION 1 · ICU SETUP','KIDNEY TRAJECTORY','CURRENT DATA','WHAT WOULD YOU DO?','THE LAST TWO CHOICES','COMMIT TO AN ANSWER','ANSWER: C','DOES HE NEED RRT RIGHT NOW?','STARRT-AKI · 3,019 PATIENTS','THE EVIDENCE IS CONSISTENT','WHY THE OTHER CHOICES FAIL'];
  function crTxt(s,x,y,size=30,color=C.white,weight=600,align='left') { X.font=weight+' '+size+'px '+FONT_TALK;X.fillStyle=color;X.textAlign=align;X.textBaseline='middle';X.fillText(s,x,y); }
  function crBox(x,y,w,h,fill=C.panel,stroke=null,r=.05){shape(rectPts(x,y,w,h),{fill,stroke,lwPx:2,smooth:r});}
  function crRule(y){line([[35,y],[1085,y]],{stroke:'#456671',lwPx:2});}
  function crWrap(s,x,y,w,size=28,color=C.white,lh=1.25,weight=600){
    X.font=weight+' '+size+'px '+FONT_TALK;const words=s.split(' '),lines=[];let row='';
    words.forEach(word=>{const test=row?row+' '+word:word;if(X.measureText(test).width>w&&row){lines.push(row);row=word;}else row=test;});if(row)lines.push(row);
    lines.forEach((l,i)=>crTxt(l,x,y+i*size*lh,size,color,weight));return lines.length;
  }
  function crPill(s,x,y,w,color=C.mint){crBox(x,y-22,w,44,'#355966');crTxt(s,x+14,y,24,color,800);}
  function crMetric(label,value,x,y,color=C.mint){crBox(x,y,315,116);crTxt(label,x+18,y+29,22,C.muted,700);crTxt(value,x+18,y+76,36,color,800);}
  function crBullet(s,y,color=C.mint,size=29){circle(49,y,6,{fill:color,stroke:null});crWrap(s,72,y,995,size,C.white,1.2,600);}
  function crChoice(letter,text,y,active=false,bad=false){
    const col=active?C.mint:(bad?C.red:C.blue);crBox(35,y,1050,92,active?'#315F59':'#294B58',col);
    circle(78,y+46,25,{fill:col,stroke:null});crTxt(letter,78,y+47,26,C.dark,900,'center');crWrap(text,120,y+27,925,25,active?C.white:C.muted,1.18,active?800:600);
  }
  function crBoard(t,index){
    X.save();X.translate(715,275);crBox(-10,-10,1140,725,'#FFF9E9',PAL.ink);crBox(0,0,1120,705,C.dark);
    crTxt(String(index+1).padStart(2,'0')+' / 11',35,48,23,C.mint,800);crTxt(TITLES[index],180,48,30,C.white,800);crRule(84);
    if(index===0){
      crPill('BASELINE CREATININE 1.4 mg/dL',35,128,410,C.gold);
      crWrap('64-year-old man with diabetic CKD',35,184,1015,42,C.white,1.2,800);
      crMetric('SOURCE','Pneumonia',35,285,C.red);crMetric('STATE','Septic shock',402,285,C.red);crMetric('SUPPORT','Norepinephrine',769,285,C.gold);
      crBox(35,435,1050,174);crTxt('ICU',65,472,24,C.muted,800);crTxt('MECHANICALLY VENTILATED',65,526,38,C.blue,800);crTxt('Nephrology is consulted as kidney function worsens.',65,579,27,C.white,600);
    } else if(index===1){
      crTxt('CREATININE',35,130,24,C.muted,800);crTxt('1.4',100,245,62,C.mint,900,'center');crTxt('→',350,245,58,C.gold,900,'center');crTxt('3.9 mg/dL',635,245,62,C.red,900,'center');
      line([[100,315],[635,315]],{stroke:C.gold,lwPx:6});circle(100,315,14,{fill:C.mint,stroke:null});circle(635,315,14,{fill:C.red,stroke:null});
      crPill('OVER 36 HOURS',760,315,250,C.gold);crBox(35,400,1050,180);crTxt('URINE OUTPUT',65,442,25,C.muted,800);crTxt('OLIGURIA · 12 HOURS',65,510,52,C.gold,900);crTxt('Severe AKI — but severity and urgency are different questions.',65,558,25,C.white,600);
    } else if(index===2){
      crMetric('POTASSIUM','5.1 mEq/L',35,120,C.gold);crMetric('BICARBONATE','19 mEq/L',402,120,C.gold);crMetric('pH','7.31',769,120,C.gold);
      crMetric('BUN','68 mg/dL',35,275,C.gold);crMetric('FLUID BALANCE','+4 L',402,275,C.blue);crMetric('OXYGEN','FiO2 0.40',769,275,C.mint);
      crBox(35,455,1050,135,'#315F59',C.mint);crTxt('OXYGENATING ADEQUATELY',65,495,35,C.mint,900);crTxt('No hypoxemic pulmonary edema is described.',65,548,28,C.white,600);
    } else if(index===3){
      crChoice('A','Start CRRT now: early initiation lowers mortality in stage 3 AKI.',115);
      crChoice('B','Start intermittent hemodialysis now for faster solute clearance.',225);
      crChoice('C','Defer RRT with close monitoring; start for urgency or persistence.',335);
      crBox(35,468,1050,120,'#233F4B');crTxt('TIMING QUESTION',65,505,24,C.muted,800);crTxt('Does severe AKI require dialysis before an urgent indication?',65,554,30,C.gold,800);
    } else if(index===4){
      crChoice('D','Wait until BUN exceeds 140 mg/dL, regardless of oliguria duration.',135);
      crChoice('E','Use a furosemide stress test; response rules out later RRT.',257);
      crBox(35,420,1050,160,'#233F4B');crTxt('ONE BEST ANSWER',65,460,24,C.muted,800);crTxt('A · B · C · D · E',65,520,52,C.white,900);crTxt('Choose before the reveal.',745,520,29,C.gold,800);
    } else if(index===5){
      const left=Math.max(0,Math.ceil(76-t));crTxt('YOUR DECISION',560,155,31,C.muted,800,'center');circle(560,350,128,{fill:'#294B58',stroke:C.gold,lwPx:7});crTxt(left?String(left):'✓',560,350,left?112:90,left?C.gold:C.mint,900,'center');
      crTxt(left?'SECONDS':'LOCKED IN',560,505,30,left?C.muted:C.mint,800,'center');crTxt('Start now — or watch carefully?',560,585,34,C.white,700,'center');
    } else if(index===6){
      crChoice('C','Defer RRT with close monitoring.',115,true);crTxt('START IF:',35,255,26,C.muted,800);
      crBullet('an urgent indication develops',315,C.mint,34);crBullet('oliguria or azotemia becomes prolonged',390,C.mint,34);
      crBox(35,490,1050,105,'#315F59',C.mint);crTxt('WATCHFUL WAITING ≠ DOING NOTHING',65,525,32,C.mint,900);crTxt('Reassess potassium, acid-base status, oxygenation, volume, and uremia.',65,569,25,C.white,600);
    } else if(index===7){
      const rows=[['K','5.1 · not refractory'],['ACID','pH 7.31 · not severe'],['LUNGS','oxygenating on 40%'],['UREMIA','no complication described']];
      rows.forEach((r,i)=>{const y=115+i*112;crBox(35,y,1050,88,'#294B58',C.mint);circle(77,y+44,20,{fill:C.mint,stroke:null});crTxt('✓',77,y+45,24,C.dark,900,'center');crTxt(r[0],115,y+29,22,C.muted,800);crTxt(r[1],330,y+44,31,C.white,800);});
      crTxt('Severe AKI? YES.     Emergency dialysis indication? NO.',35,617,31,C.gold,900);
    } else if(index===8){
      crTxt('90-DAY MORTALITY',35,125,24,C.muted,800);crBox(35,160,500,115);crBox(585,160,500,115);crTxt('ACCELERATED',65,192,23,C.muted,800);crTxt('≈ 44%',65,238,42,C.white,900);crTxt('STANDARD',615,192,23,C.muted,800);crTxt('≈ 44%',615,238,42,C.white,900);
      crRule(315);crMetric('RRT DEPENDENCE','10.4% accelerated',35,355,C.red);crMetric('STANDARD ARM','6.0%',402,355,C.mint);crMetric('NEVER NEEDED RRT','≈ 38%',769,355,C.gold);
      crTxt('Earlier RRT: more adverse events, especially hypotension and hypophosphatemia.',35,535,27,C.white,600);crTxt('No mortality benefit.',35,592,39,C.gold,900);
    } else if(index===9){
      crBullet('AKIKI: no survival benefit; many delayed-arm patients recovered without dialysis.',135,C.mint,27);
      crBullet('IDEAL-ICU: same conclusion in septic shock.',245,C.mint,29);
      crBullet('Gaudry individual-patient-data meta-analysis: no mortality benefit.',335,C.mint,28);
      crBox(35,465,1050,120,'#315F59',C.mint);crTxt('THE BENEFIT OF WAITING',65,505,26,C.muted,800);crTxt('Some patients recover — and avoid RRT entirely.',65,552,36,C.mint,900);
    } else {
      const late=t>=142; if(!late){
        crChoice('A','ELAIN was single-center; larger multicenter trials did not reproduce its benefit.',108,false,true);
        crChoice('B','Modality does not answer timing. If needed on pressors, CRRT is generally favored.',218,false,true);
        crChoice('D','BUN >140 regardless of duration is unsafe. AKIKI-2 warns against excessive delay.',328,false,true);
        crBox(35,462,1050,120,'#233F4B');crTxt('WATCHFUL WAITING HAS A LIMIT',65,500,32,C.gold,900);crTxt('Do not extend delay through prolonged oliguria or azotemia.',65,549,28,C.white,600);
      } else {
        crChoice('E','A furosemide stress response predicts progression; it cannot rule out later RRT.',115,false,true);
        crBox(35,250,1050,280,'#315F59',C.mint);crTxt('TEACHING POINT',65,295,25,C.muted,800);crWrap('KDIGO stage 3 AKI without an urgent indication:',65,350,965,33,C.white,1.2,800);crTxt('DEFER RRT · MONITOR CLOSELY',65,435,45,C.mint,900);crTxt('Start when urgency appears or persistence makes further delay unsafe.',65,492,27,C.white,600);
        crTxt('Answer: C',1085,625,31,C.gold,900,'right');
      }
    }
    X.restore();
  }
  function crShot(t,index){
    const k=3.2+.018*Math.sin(t*.2),z=1990,y=HALL.STAGE.y;const P=persp({x:-110+3*Math.sin(t*.17),y:190,z:z-1800/k,f:1800,hy:990-(190-y)*k});
    layer(()=>HALL.back(P,t,{splitZ:z,screen:0}),{blur:2});
    const speaking=LINES.some(l=>{const n=(t-l.at-.2)*l.cps;return n>0&&n<l.text.replace(/\*/g,'').length;});const [sx,sy,scale]=P.p(-295,y,z);
    const pause=index===5,reveal=index>=6;const A=sami(sx,sy,SAMI_UNIT*scale,{t,turn:.08,tilt:.018*Math.sin(t*.8),lookX:.35,eyes:pause?'narrow':'open',brows:pause?'quizzical':reveal?'up':'focused',bulb:index===6?ease(seg(t,76,78)):0,handL:pause?[.8,-16.1]:[-5.3,-12.4+.3*Math.sin(t)],handR:pause?[4.4,-8.1]:[5.8,-16.5+.6*Math.sin(t*.7)],handPoseL:pause?'fist':'palm',handPoseR:pause?'fist':'point',mouth:lipFlap(t,speaking,pause?'smirk':'smile')});
    HALL.front(P,t,{splitZ:z});crBoard(t,index);crTxt('DR. SAMI',95,1020,30,'#355867',800);crTxt('AKI · WHEN TO START RRT',715,1030,27,'#355867',800);
    for(const l of LINES)callout(l.text,A.mouth[0]+40,A.mouth[1],t-l.at,{dx:1120-A.mouth[0]-40,dy:155-A.mouth[1],size:31,maxW:1000,cps:l.cps,hold:l.hold,accent:'#247B69'});
    crBox(715,1050,1120,6,'#BCD2D7');crBox(715,1050,1120*t/154,6,'#247B69');
  }
  const starts=[0,14,28,42,56,68,76,88,102,116,128];
  scene({duration:154,fps:24,bpm:88,shots:starts.map((at,i)=>[at,t=>crShot(t,i)])});
})();
