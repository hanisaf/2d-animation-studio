// All Arabic text is painted as shaped, complete RTL lines.
(() => {
  const ID='scene44_imru_al_qays', H=LOCATIONS.lecture_hall, L=ASSETS.scene[ID].dialogue;
  const ink='#193F49', gold='#F2C56F', mint='#8AE5B3';
  const titles=['فرس امرئ القيس','لَهُ أَيْطَلَا ظَبْيٍ','وَسَاقَا نَعَامَةٍ','وَإِرْخَاءُ سَرْحَانٍ','وَتَقْرِيبُ تَتْفُلِ','أربع صور... وفرس واحد'];
  const notes=[['من معلّقة امرئ القيس','وصف الفرس بصفات من عالم الحيوان'],['الأَيْطَلان: الخاصرتان','ضمور الخاصرتين ورشاقة الجسم'],['ساقان كساقَي النعامة','طول الساقين وسرعة العدو'],['السِّرْحان: الذئب','الإرخاء: عدو سهل ممتد'],['التَّتْفُل: ولد الثعلب','التقريب: عدو بوثبات متقاربة'],['ضمور الظبي • طول ساقَي النعامة','سلاسة عدو الذئب • خفة ولد الثعلب']];
  function txt(s,x,y,size=38,color='#F7F1DF') {
    X.save();X.direction='rtl';X.font=`600 ${size}px "Noto Naskh Arabic", "Amiri", serif`;X.textAlign='center';X.textBaseline='middle';X.fillStyle=color;X.fillText(s,x,y);X.restore();
  }
  function box(x,y,w,h,color){shape(rectPts(x,y,w,h),{fill:color,stroke:null,smooth:.025});}
  function animal(kind,x,y,s,t){
    X.save();X.translate(x,y);X.scale(s,s);
    const bird=kind==='ostrich',fox=kind==='fox',wolf=kind==='wolf',horse=kind==='horse';
    const color=bird?'#52616A':fox?'#D58B47':wolf?'#91A5AE':horse?'#B67B55':'#D9AD72';
    const bounce=fox?-10*Math.abs(Math.sin(t*5)):3*Math.sin(t*5);X.translate(0,bounce);
    ellipse(0,8,110,12,{fill:'rgba(0,0,0,.15)',stroke:null});
    for(let i=0;i<4;i++){
      const root=-60+i*39, phase=t*(fox?8:5)+i*2,foot=root+Math.sin(phase)*24;
      line([[root,-66],[root+Math.sin(phase)*12,-35],[foot,0]],{stroke:kind==='ostrich'?gold:color,lwPx:bird?8:11});
      line([[foot-6,0],[foot+10,0]],{stroke:ink,lwPx:5});
    }
    if(bird){
      ellipse(-15,-98,80,49,{fill:color,stroke:ink,lwPx:3});line([[38,-113],[65,-200],[70,-236]],{stroke:'#D6B99A',lwPx:17});
      ellipse(75,-242,22,17,{fill:'#D6B99A',stroke:ink,lwPx:3});shape([[91,-246],[119,-237],[92,-233]],{fill:gold,stroke:ink,lwPx:2});
      ellipse(-25,-102,44,26,{fill:'#75838A',stroke:null});circle(81,-248,3,{fill:ink,stroke:null});
    }else{
      ellipse(0,-100,94,43,{fill:color,stroke:ink,lwPx:3});
      shape([[-75,-108],[-125,-145],[-160,-110],[-111,-120],[-80,-83]],{fill:color,stroke:ink,lwPx:3});
      if(fox)shape([[-149,-116],[-160,-110],[-127,-115],[-131,-130]],{fill:'#FFF4D9',stroke:null});
      line([[62,-105],[90,horse?-183:-142]],{stroke:color,lwPx:horse?40:30});
      ellipse(103,horse?-188:-149,horse?37:33,23,{fill:color,stroke:ink,lwPx:3});
      shape([[80,horse?-204:-164],[83,horse?-240:-196],[100,horse?-207:-168]],{fill:color,stroke:ink,lwPx:3});
      circle(111,horse?-197:-157,4,{fill:ink,stroke:null});
      if(horse){line([[72,-175],[54,-137],[57,-112]],{stroke:'#674A40',lwPx:13});}
      if(kind==='gazelle'){
        line([[86,-171],[74,-206],[77,-234]],{stroke:ink,lwPx:5});line([[97,-172],[90,-212],[94,-240]],{stroke:ink,lwPx:5});
        ellipse(0,-101,32,34,{fill:null,stroke:mint,lwPx:5});
      }
    }
    X.restore();
  }
  function shot(t,index){
    const k=3.2+.025*Math.sin(t*.15),z=1990,y=H.STAGE.y;
    const P=persp({x:-110+4*Math.sin(t*.15),y:190,z:z-1800/k,f:1800,hy:990-(190-y)*k});
    layer(()=>H.back(P,t,{splitZ:z,screen:0}),{blur:2});
    const [sx,sy,scale]=P.p(-295,y,z),d=L[index],age=t-d.at;
    const speaking=age>.2&&age<.2+d.text.length/d.cps;
    const A=sami(sx,sy,SAMI_UNIT*scale,{t,turn:.08,lookX:.35,tilt:.02*Math.sin(t),brows:'up',eyes:'open',mouth:lipFlap(t,speaking),handL:[-5.3,-12.4],handR:[5.8,-17+.5*Math.sin(t*1.4)],handPoseL:'palm',handPoseR:'point',bulb:index===5?ease(seg(t,60,61)):0});
    H.front(P,t,{splitZ:z});
    box(690,280,1160,705,'#F8EED5');box(705,295,1130,675,ink);
    txt(titles[index],1270,355,48,gold);
    line([[750,405],[1790,405]],{stroke:'#507078',lwPx:2});
    if(index===0){
      txt('لَهُ أيْطَلا ظَبْيٍ، وَسَاقَا نَعَامَةٍ',1270,505,49);
      txt('وإِرْخَاءُ سَرْحَانٍ، وَتَقْرِيْبُ تَتْفُلِ',1270,585,49);
      animal('horse',1270,812,.68,t);
    }else{
      animal(['','gazelle','ostrich','wolf','fox','horse'][index],1270,785,index===4?1.15:1.3,t);
      if(index===5){txt('ظبي',880,530,32,mint);txt('نعامة',1650,530,32,gold);txt('ذئب',880,700,32,mint);txt('ولد الثعلب',1650,700,32,gold);}
    }
    txt(notes[index][0],1270,855,38,mint);txt(notes[index][1],1270,917,35);
    // A dedicated RTL speech panel preserves contextual Arabic glyph joining.
    if(age>=0){
      X.save();X.globalAlpha=ease(seg(age,0,.4));
      shape([[630,178],[720,170],[720,205]],{fill:'#FFFDF5',stroke:ink,lwPx:3});
      shape(rectPts(705,75,1130,150),{fill:'#FFFDF5',stroke:ink,lwPx:3,smooth:.06});
      txt(d.text,1270,150,36,ink);X.restore();
    }
    txt('د. سامي',330,1030,34,ink);txt('بلاغة التصوير في الشعر العربي',1270,1015,30,ink);
    box(705,1050,1130,6,'#B9CDC8');box(705,1050,1130*t/72,6,'#32866F');
  }
  scene({duration:72,fps:24,bpm:80,shots:[0,12,24,36,48,60].map((at,i)=>[at,t=>shot(t,i)])});
})();
