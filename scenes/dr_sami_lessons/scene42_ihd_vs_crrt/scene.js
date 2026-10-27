// Scene 42: initial iHD versus CRRT in vasopressor-dependent shock.
(() => {
  const ID='scene42_ihd_vs_crrt',LINES=ASSETS.scene[ID].dialogue,HALL=LOCATIONS.lecture_hall;
  const C={dark:'#173644',panel:'#294B58',mint:'#8AE5B3',gold:'#FFD684',red:'#FF9B91',blue:'#83D8FF',white:'#EDF9F6',muted:'#BBD1D6'};
  const TITLES=['QUESTION 2 · SEPTIC SHOCK','RRT IS INDICATED','THE MODALITY QUESTION','WHICH STATEMENT IS ACCURATE?','THE LAST TWO CHOICES','COMMIT TO AN ANSWER','ANSWER: B','ICRAKI · PRIMARY OUTCOME','ICRAKI · 90-DAY MORTALITY','THE PARADIGM CHANGED','CLINICAL IMPLICATIONS'];
  function icTxt(s,x,y,size=30,color=C.white,weight=600,align='left'){X.font=weight+' '+size+'px '+FONT_TALK;X.fillStyle=color;X.textAlign=align;X.textBaseline='middle';X.fillText(s,x,y);}
  function icBox(x,y,w,h,fill=C.panel,stroke=null,r=.05){shape(rectPts(x,y,w,h),{fill,stroke,lwPx:2,smooth:r});}
  function icRule(y){line([[35,y],[1085,y]],{stroke:'#456671',lwPx:2});}
  function icWrap(s,x,y,w,size=28,color=C.white,lh=1.25,weight=600){X.font=weight+' '+size+'px '+FONT_TALK;const words=s.split(' '),rows=[];let row='';words.forEach(word=>{const test=row?row+' '+word:word;if(X.measureText(test).width>w&&row){rows.push(row);row=word;}else row=test;});if(row)rows.push(row);rows.forEach((l,i)=>icTxt(l,x,y+i*size*lh,size,color,weight));return rows.length;}
  function icPill(s,x,y,w,color=C.mint){icBox(x,y-22,w,44,'#355966');icTxt(s,x+14,y,24,color,800);}
  function icMetric(label,value,x,y,color=C.mint){icBox(x,y,315,116);icTxt(label,x+18,y+29,22,C.muted,700);icTxt(value,x+18,y+76,36,color,800);}
  function icBullet(s,y,color=C.mint,size=28){circle(49,y,6,{fill:color,stroke:null});icWrap(s,72,y,995,size,C.white,1.2,600);}
  function icChoice(letter,text,y,active=false,bad=false){const col=active?C.mint:(bad?C.red:C.blue);icBox(35,y,1050,92,active?'#315F59':C.panel,col);circle(78,y+46,25,{fill:col,stroke:null});icTxt(letter,78,y+47,26,C.dark,900,'center');icWrap(text,120,y+27,925,25,active?C.white:C.muted,1.18,active?800:600);}
  function icDialysis(x,y,w,h,label,color,continuous,t){
    icBox(x,y,w,h,'#233F4B',color);icTxt(label,x+w/2,y+42,31,color,900,'center');
    const base=y+h-47;line([[x+34,base],[x+w-34,base]],{stroke:'#53717A',lwPx:3});
    if(continuous){line([[x+40,base-55],[x+w-40,base-55]],{stroke:color,lwPx:12});for(let i=0;i<7;i++)circle(x+50+((i*61+t*25)%(w-100)),base-55,6,{fill:C.white,stroke:null});}
    else {for(let i=0;i<4;i++){const px=x+55+i*100;shape([[px,base],[px+25,base-105],[px+50,base]],{fill:color,stroke:null,alpha:.88});}}
  }
  function icBoard(t,index){
    X.save();X.translate(715,275);icBox(-10,-10,1140,725,'#FFF9E9',PAL.ink);icBox(0,0,1120,705,C.dark);icTxt(String(index+1).padStart(2,'0')+' / 11',35,48,23,C.mint,800);icTxt(TITLES[index],180,48,30,C.white,800);icRule(84);
    if(index===0){
      icWrap('64-year-old man in the ICU',35,130,1015,42,C.white,1.2,800);icMetric('STATE','Septic shock',35,230,C.red);icMetric('PRESSOR','Norepinephrine',402,230,C.gold);icMetric('KIDNEY','Oligoanuric AKI',769,230,C.red);
      icBox(35,390,1050,175);icTxt('HEMODYNAMICS',65,430,24,C.muted,800);icTxt('UNSTABLE',65,492,51,C.red,900);icTxt('Vasopressor-dependent critical illness',395,492,31,C.white,700);
    } else if(index===1){
      icPill('A CLEAR INDICATION EXISTS',35,133,385,C.gold);icTxt('RRT',560,260,112,C.white,900,'center');circle(560,260,150,{fill:null,stroke:C.mint,lwPx:9});
      icTxt('TIMING',205,475,27,C.muted,800,'center');icTxt('SETTLED',205,525,39,C.mint,900,'center');icTxt('MODALITY',835,475,27,C.muted,800,'center');icTxt('DEBATED',835,525,39,C.gold,900,'center');line([[355,500],[685,500]],{stroke:C.blue,lwPx:4,dash:[12,10]});
      icTxt('The question is no longer whether to dialyze.',560,615,28,C.white,700,'center');
    } else if(index===2){
      icDialysis(35,145,500,300,'iHD',C.gold,false,t);icDialysis(585,145,500,300,'CRRT',C.mint,true,t);
      icTxt('INTERMITTENT',285,490,25,C.gold,800,'center');icTxt('CONTINUOUS',835,490,25,C.mint,800,'center');
      icBox(35,545,1050,80,'#315F59',C.mint);icTxt('DOES THE INITIAL MODALITY AFFECT OUTCOME?',560,585,34,C.white,900,'center');
    } else if(index===3){
      icChoice('A','Large RCTs consistently show iHD reduces 90-day mortality.',110);
      icChoice('B','ICRAKI: iHD was not noninferior and had higher 90-day mortality.',220);
      icChoice('C','CRRT is contraindicated in hemodynamically unstable patients.',330);
      icBox(35,463,1050,120,'#233F4B');icTxt('READ THE ABSOLUTES CAREFULLY',65,503,25,C.muted,800);icTxt('“consistently” · “contraindicated”',65,552,34,C.gold,900);
    } else if(index===4){
      icChoice('D','All randomized trials show perfect equivalence for every outcome.',135);
      icChoice('E','Modality has no bearing on cerebral edema risk in acute brain injury.',257);
      icBox(35,420,1050,160,'#233F4B');icTxt('ONE BEST ANSWER',65,460,24,C.muted,800);icTxt('A · B · C · D · E',65,520,52,C.white,900);icTxt('Choose before the reveal.',745,520,29,C.gold,800);
    } else if(index===5){
      const left=Math.max(0,Math.ceil(76-t));icTxt('YOUR DECISION',560,155,31,C.muted,800,'center');circle(560,350,128,{fill:C.panel,stroke:C.gold,lwPx:7});icTxt(left?String(left):'✓',560,350,left?112:90,left?C.gold:C.mint,900,'center');icTxt(left?'SECONDS':'LOCKED IN',560,505,30,left?C.muted:C.mint,800,'center');icTxt('Which claim survives the evidence?',560,585,34,C.white,700,'center');
    } else if(index===6){
      icChoice('B','ICRAKI: iHD was not noninferior to CRRT.',115,true);icTxt('AND:',35,255,26,C.muted,800);icTxt('HIGHER 90-DAY MORTALITY WITH iHD',35,325,45,C.gold,900);
      icBox(35,400,1050,180,'#315F59',C.mint);icTxt('2026 · MULTICENTER · RANDOMIZED',65,442,25,C.muted,800);icTxt('554 critically ill adults',65,500,42,C.white,900);icTxt('Trial stopped early after the noninferiority result.',65,550,27,C.mint,700);
    } else if(index===7){
      icTxt('MAJOR ADVERSE KIDNEY EVENT BY DAY 90',35,125,25,C.muted,800);icBox(35,165,500,205);icBox(585,165,500,205);icTxt('iHD',285,207,31,C.gold,900,'center');icTxt('78.1%',285,285,67,C.red,900,'center');icTxt('CRRT',835,207,31,C.mint,900,'center');icTxt('71.6%',835,285,67,C.mint,900,'center');
      icRule(420);icTxt('NONINFERIORITY',35,475,25,C.muted,800);icTxt('NOT MET',35,535,50,C.red,900);icTxt('The trial was stopped early.',540,535,32,C.white,700);
    } else if(index===8){
      icTxt('90-DAY MORTALITY',35,125,25,C.muted,800);icBox(35,165,500,160);icBox(585,165,500,160);icTxt('iHD',65,202,25,C.gold,800);icTxt('63.1%',65,270,62,C.red,900);icTxt('CRRT',615,202,25,C.mint,800);icTxt('53.5%',615,270,62,C.mint,900);
      icMetric('HAZARD RATIO','1.30',35,380,C.gold);icMetric('95% CI','1.04–1.63',402,380,C.gold);icMetric('DIRECTION','Favors CRRT',769,380,C.mint);
      icTxt('Association in this randomized strategy comparison',35,560,25,C.muted,600);icTxt('Higher mortality with initial iHD',35,610,34,C.red,900);
    } else if(index===9){
      icPill('OLDER EVIDENCE',35,130,240,C.blue);icBullet('Prior RCTs and meta-analyses: no clear mortality or renal-recovery difference.',190,C.blue,27);icBullet('Hemodiafe 60-day survival: 32% versus 33%; P = 0.98.',300,C.blue,28);
      icPill('2026 ICRAKI',35,405,245,C.gold);icBullet('Failed iHD noninferiority and found higher 90-day mortality.',465,C.gold,29);
      icBox(35,560,1050,65,'#315F59',C.mint);icTxt('THE PRIOR EQUIVALENCE PARADIGM WAS CHALLENGED',560,593,29,C.mint,900,'center');
    } else {
      const late=t>=142;if(!late){
        icChoice('A','Wrong: older trials did not show iHD mortality superiority.',105,false,true);icChoice('C','Wrong: CRRT is generally preferred during hemodynamic instability.',215,false,true);icChoice('D','Wrong: “perfectly equivalent for every outcome” overstates older data.',325,false,true);
        icBox(35,458,1050,130,'#315F59',C.mint);icTxt('IN VASOPRESSOR-DEPENDENT SHOCK',65,500,25,C.muted,800);icTxt('Slower, continuous fluid and solute removal is often favored.',65,551,31,C.mint,900);
      }else{
        icChoice('E','Wrong: modality can affect osmotic disequilibrium and cerebral edema risk.',105,false,true);
        icDialysis(35,230,430,220,'iHD · FASTER SHIFTS',C.red,false,t);icDialysis(655,230,430,220,'CRRT · GENTLER',C.mint,true,t);icTxt('OSMOTIC SHIFT →',485,340,27,C.gold,900);icTxt('BRAIN',560,385,26,C.white,900,'center');circle(560,340,55,{fill:'#D9B3D4',stroke:C.gold,lwPx:4});
        icBox(35,500,1050,105,'#315F59',C.mint);icTxt('FAVOR CRRT WHEN CEREBRAL EDEMA IS A CONCERN',560,538,30,C.mint,900,'center');icTxt('Acute brain injury · fulminant hepatic failure',560,578,25,C.white,700,'center');icTxt('Answer: B',1085,650,31,C.gold,900,'right');
      }
    }
    X.restore();
  }
  function icShot(t,index){
    const k=3.2+.018*Math.sin(t*.2),z=1990,y=HALL.STAGE.y;const P=persp({x:-110+3*Math.sin(t*.17),y:190,z:z-1800/k,f:1800,hy:990-(190-y)*k});layer(()=>HALL.back(P,t,{splitZ:z,screen:0}),{blur:2});
    const speaking=LINES.some(l=>{const n=(t-l.at-.2)*l.cps;return n>0&&n<l.text.replace(/\*/g,'').length;});const [sx,sy,scale]=P.p(-295,y,z),pause=index===5,reveal=index>=6;
    const A=sami(sx,sy,SAMI_UNIT*scale,{t,turn:.08,tilt:.018*Math.sin(t*.8),lookX:.35,eyes:pause?'narrow':'open',brows:pause?'quizzical':reveal?'up':'focused',bulb:index===6?ease(seg(t,76,78)):0,handL:pause?[.8,-16.1]:[-5.3,-12.4+.3*Math.sin(t)],handR:pause?[4.4,-8.1]:[5.8,-16.5+.6*Math.sin(t*.7)],handPoseL:pause?'fist':'palm',handPoseR:pause?'fist':'point',mouth:lipFlap(t,speaking,pause?'smirk':'smile')});
    HALL.front(P,t,{splitZ:z});icBoard(t,index);icTxt('DR. SAMI',95,1020,30,'#355867',800);icTxt('RRT MODALITY · iHD vs CRRT',715,1030,27,'#355867',800);
    for(const l of LINES)callout(l.text,A.mouth[0]+40,A.mouth[1],t-l.at,{dx:1120-A.mouth[0]-40,dy:155-A.mouth[1],size:31,maxW:1000,cps:l.cps,hold:l.hold,accent:'#247B69'});
    icBox(715,1050,1120,6,'#BCD2D7');icBox(715,1050,1120*t/154,6,'#247B69');
  }
  const starts=[0,14,28,42,56,68,76,88,102,116,128];scene({duration:154,fps:24,bpm:88,shots:starts.map((at,i)=>[at,t=>icShot(t,i)])});
})();
