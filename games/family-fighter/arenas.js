// Side-view adaptations of the studio locations. Decorative props sit behind
// the shared y=420 fighting line; arena choice never changes combat geometry.
export function drawArena(ctx,id){
 const box=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(x,y,w,h);};
 const line=(points,c,w=2)=>{ctx.strokeStyle=c;ctx.lineWidth=w;ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();};
 const poly=(points,c)=>{ctx.fillStyle=c;ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fill();};
 const oval=(x,y,rx,ry,c)=>{ctx.fillStyle=c;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill();};
 const label=(s,x,y,size=20,c='#f8e8bd')=>{ctx.fillStyle=c;ctx.font=`bold ${size}px system-ui`;ctx.textAlign='center';ctx.fillText(s,x,y);};
 const gradient=(top,bottom)=>{const g=ctx.createLinearGradient(0,0,0,540);g.addColorStop(0,top);g.addColorStop(1,bottom);box(0,0,960,540,g);};
 const tiles=(base,ink)=>{box(0,360,960,180,base);for(const y of [382,416,467,539])line([[0,y],[960,y]],ink,1);for(let x=-600;x<1600;x+=120)line([[480+(x-480)*.35,360],[x,540]],ink,1);};
 const planks=(base,ink)=>{box(0,360,960,180,base);for(let y=360;y<540;y+=18){line([[0,y],[960,y]],ink,1);for(let x=(y%36?0:95);x<960;x+=190)line([[x,y],[x,y+18]],ink,1);}};
 const column=(x,y,h)=>{box(x-18,y,36,h,'#f4e5c6');box(x-18,y,8,h,'#d3bd9c');for(const dx of [-7,3,11])line([[x+dx,y+8],[x+dx,y+h-4]],'#cbb892',1);box(x-29,y-8,58,12,'#e5c789');box(x-27,y+h-3,54,12,'#e5c789');};
 const tree=(x,y,scale=1,c='#527555')=>{box(x-6*scale,y-60*scale,12*scale,65*scale,'#85654b');for(let i=0;i<5;i++)oval(x+Math.cos(i*2)*28*scale,y-65*scale+Math.sin(i*2)*20*scale,40*scale,27*scale,c);};
 const cloud=(x,y)=>{oval(x,y,55,13,'#fff5e6');oval(x-17,y-8,26,17,'#fff5e6');oval(x+16,y-12,23,18,'#fff5e6');};
 const window=(x,y,w,h)=>{box(x-5,y-5,w+10,h+10,'#ede2c6');box(x,y,w,h,'#a4d4df');line([[x+w/2,y],[x+w/2,y+h]],'#ede2c6',4);line([[x,y+h/2],[x+w,y+h/2]],'#ede2c6',4);};
 const heart=(x,y,r,c)=>{ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(x,y+r*.8);ctx.bezierCurveTo(x-r*1.8,y-r*.2,x-r*.8,y-r*1.5,x,y-r*.5);ctx.bezierCurveTo(x+r*.8,y-r*1.5,x+r*1.8,y-r*.2,x,y+r*.8);ctx.fill();};
 const ball=(x,y,r)=>{oval(x,y,r,r,'#f4eddb');poly([[x,y-r*.5],[x+r*.5,y-r*.15],[x+r*.3,y+r*.45],[x-r*.3,y+r*.45],[x-r*.5,y-r*.15]],'#3d5265');};
 const bookshelf=(x,y,w,h)=>{box(x,y,w,h,'#8c7055');box(x+7,y+7,w-14,h-14,'#665e54');for(let row=0;row<4;row++){const bottom=y+45+row*(h-16)/4;for(let col=0;col<12;col++){const bx=x+12+col*(w-22)/12,bh=19+(row*7+col*11)%16;box(bx,bottom-bh,(w-22)/12-3,bh,['#a48eaa','#93b5aa','#cbb17e','#b88072','#8aabc0'][(row+col)%5]);line([[bx+2,bottom-bh+5],[bx+(w-22)/12-5,bottom-bh+5]],'#e4d2ab',1);}box(x+4,bottom+1,w-8,6,'#baa077');}};
 ctx.save();
 if(id==='throne_room'){
  gradient('#eed3cd','#d49eb1');
  // Vaulted pastel hall, jewel windows and Princess Pearl's gold throne.
  for(const x of [140,480,820]){
   ctx.fillStyle='#cf9cbb';ctx.beginPath();ctx.moveTo(x-83,320);ctx.lineTo(x-83,204);ctx.bezierCurveTo(x-83,76,x+83,76,x+83,204);ctx.lineTo(x+83,320);ctx.fill();
   for(let row=0;row<4;row++)for(let col=0;col<3;col++)box(x-63+col*43,166+row*35,39,31,['#bba4dd','#94cbbb','#f5d193','#eaaaaf'][(row+col)%4]);
   line([[x,124],[x,312]],'#f6dfad',6);
  }
  for(const x of [42,255,705,918])column(x,106,247);
  box(0,330,960,30,'#b47799');tiles('#427662','#719382');
  poly([[387,360],[573,360],[660,540],[300,540]],'#a8c8a9');
  for(let i=0;i<3;i++)box(378-i*16,342+i*8,204+i*32,10,'#ead0b6');
  box(430,230,100,112,'#d4a343');box(439,239,82,97,'#c86a96');
  poly([[430,230],[438,210],[458,227],[480,196],[502,227],[522,210],[530,230]],'#f6d27e');
  for(let y=250;y<325;y+=22)for(let x=450;x<520;x+=22)oval(x,y,2,2,'#f7c8d7');
  box(422,305,116,13,'#f4ce78');box(422,310,11,38,'#c89539');box(527,310,11,38,'#c89539');
  for(const x of [330,630]){line([[x,0],[x,156]],'#9a6e4c',3);oval(x,158,48,9,'#d6aa4b');for(const dx of [-32,0,32]){box(x+dx-3,136,6,20,'#fff2d6');oval(x+dx,131,3,6,'#ffce6d');}}
 }else if(id==='safadi_study'){
  gradient('#284c45','#4d705b');planks('#a37450','#815237');
  box(0,306,960,54,'#68462e');for(let x=0;x<960;x+=60)box(x+4,312,51,42,'#7c5536');
  for(const x of [32,725]){
   box(x,126,204,221,'#432f29');
   for(let row=0;row<4;row++){
    for(let col=0;col<12;col++){const h=23+(col*7+row*11)%19,bx=x+10+col*15;box(bx,166+row*48-h,11,h,['#a34f53','#d3ad68','#668b76','#586b88'][(row+col)%4]);box(bx+2,164+row*48-h,7,2,'#ead3a1');}
    box(x+4,168+row*48,196,7,'#976b43');
   }
  }
  box(287,131,386,153,'#ac8653');box(297,141,366,133,'#193e37');
  label('KNOWLEDGE IS POWER',480,170,17,'#e9dba8');label('2 · 3 · 5 · 7 · 11 · 13 · 17',480,203,18,'#c7dfcf');label('ζ(s) = Σ 1/nˢ',480,243,23,'#83d6cf');
  box(385,286,190,70,'#655750');box(410,300,140,56,'#252a2b');
  for(let i=0;i<7;i++)poly([[420+i*16,354],[426+i*16,314+(i%3)*9],[444+i*16,354]],i%2?'#e9b653':'#dd7955');
  box(369,280,222,12,'#b69b7d');
  oval(480,458,200,39,'#8a4554');oval(480,458,178,30,'#c58f65');oval(480,458,165,25,'#7a3e4d');
  for(const x of [267,690]){box(x,325,8,35,'#775435');oval(x+4,305,24,23,'#7bafa4');line([[x+4,283],[x+4,327]],'#ceba80',2);}
 }else if(id==='school_gym'){
  gradient('#c3d5d0','#ece3ca');
  for(let y=100;y<350;y+=24)line([[0,y],[960,y]],'#b3c4bd',1);
  for(const x of [35,220,680,865])window(x,115,60,65);
  box(0,244,960,12,'#2c6f73');box(0,260,960,6,'#d8ad55');
  for(const x of [0,720])for(let row=0;row<4;row++){box(x,294+row*16,240,13,row%2?'#b7804d':'#c9965e');}
  box(337,152,286,108,'#1a3e52');label('DOVE CREEK DOVES',480,179,18);label('HOME      GUEST',480,208,12,'#b8d1c8');label('00   :   00',480,243,28,'#f6d57b');
  for(const x of [130,830]){box(x-42,188,84,60,'#edf1e8');box(x-16,213,32,26,'#34585d');line([[x-27,246],[x+27,246]],'#cb7248',5);poly([[x-25,250],[x+25,250],[x+14,278],[x-14,278]],'#fcf0ce66');for(const dx of [-15,0,15])line([[x+dx,250],[x+dx*.6,275]],'#f4e5bf',1);}
  planks('#d9af76','#bd915d');
  for(const x of [0,790])box(x,365,170,120,'#488582');
  line([[480,360],[480,540]],'#eee4c4',3);ctx.strokeStyle='#efe4c8';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(480,447,118,49,0,0,Math.PI*2);ctx.stroke();
  poly([[450,443],[423,424],[460,432],[480,417],[501,434],[539,424],[514,446],[480,462]],'#faf3df');
  label('BE A GOOD SPORT!',480,329,15,'#2a6267');
 }else if(id==='ancient_athens'){
  gradient('#88b9cd','#f3d8a8');oval(780,151,45,45,'#ffe0a1');cloud(200,157);cloud(650,119);
  poly([[0,328],[230,213],[395,278],[559,176],[800,266],[960,208],[960,370],[0,370]],'#9aacaa');
  poly([[267,338],[364,231],[575,211],[671,338]],'#b89f7c');
  box(357,209,249,12,'#f4dfb6');poly([[344,208],[481,163],[620,208]],'#e6c99c');box(380,213,201,63,'#9b8b72');
  for(let x=369;x<=595;x+=37)column(x,224,69);
  box(350,295,266,10,'#e4cea7');
  // Side stoa and olive trees frame the distant Acropolis.
  box(0,211,220,17,'#dfb78a');poly([[0,211],[98,181],[234,211]],'#ad6c56');for(const x of [26,104,188])column(x,236,112);
  tree(792,353,1.05,'#7e946d');tree(925,347,.8,'#687f65');
  tiles('#dbc49e','#bba782');box(0,351,960,12,'#e7d2ad');
  oval(480,398,150,28,'#b59d7f');oval(480,391,140,23,'#f0dcbc');
  column(696,282,65);oval(696,263,15,17,'#9c8060');for(const x of [689,703]){oval(x,260,6,7,'#e9d8aa');oval(x,260,2,3,'#333e3f');}
 }else if(id==='soccer_field'){
  gradient('#6ca8cc','#d4e5c4');cloud(150,163);cloud(575,134);cloud(845,198);
  poly([[0,290],[140,231],[340,270],[520,210],[760,262],[960,240],[960,370],[0,370]],'#8eaf95');
  for(let x=0;x<1000;x+=65)tree(x,319,.65,x%2?'#68966e':'#4f815e');
  box(0,325,960,215,'#5b9362');for(let y=360;y<540;y+=48)box(0,y,960,24,'#68a16b');
  for(const x of [30,725])for(let r=0;r<3;r++){box(x,312+r*15,205,10,'#a9b8b3');for(let i=0;i<10;i++){oval(x+11+i*19,303+r*15,5,5,'#d5b28a');box(x+7+i*19,308+r*15,9,8,['#c77d70','#e3c67b','#6682b0'][i%3]);}}
  line([[359,360],[359,280],[601,280],[601,360]],'#faf0dc',5);
  for(let x=374;x<600;x+=19)line([[x,282],[x,360]],'#ecf1d199',1);for(let y=297;y<360;y+=16)line([[360,y],[600,y]],'#ecf1d199',1);
  for(const x of [91,870]){box(x,115,6,215,'#697f83');box(x-25,113,57,14,'#f6e7ad');}
  line([[0,392],[960,392]],'#dfe9c5',3);line([[480,392],[480,540]],'#dfe9c5',3);
  ctx.strokeStyle='#dfe9c5';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(480,464,140,50,0,0,Math.PI*2);ctx.stroke();
  box(675,195,177,69,'#2d5a56');label('COUNTY PARK',763,219,14);label('FAMILY CUP',763,246,18,'#e2cd86');
 }else if(id==='sami_clinic'){
  gradient('#d9eeea','#b6d6ce');box(0,292,960,8,'#68bdb1');box(0,302,960,6,'#e5b974');
  window(40,133,143,134);for(let y=136;y<268;y+=14)line([[40,y],[183,y]],'#eff3dc',4);
  box(227,156,91,133,'#f8f3dc');label('E',272,187,27,'#526c70');label('F P',272,212,21,'#526c70');label('T O Z',272,238,17,'#526c70');label('L P E D',272,263,13,'#526c70');
  box(348,154,227,145,'#719fa2');box(357,163,209,127,'#244b65');
  line([[462,174],[462,278]],'#b5dce1',5);for(let i=0;i<6;i++){const y=184+i*13;line([[453,y],[404,y+5],[388,y-2]],'#b5dce1',4);line([[471,y],[520,y+5],[536,y-2]],'#b5dce1',4);}
  box(628,157,166,97,'#65968d');box(636,165,150,79,'#173d3f');line([[644,208],[670,208],[682,192],[694,222],[706,177],[718,208],[777,208]],'#85e0bd',3);
  box(37,306,194,52,'#a4d2c3');box(27,300,214,10,'#f7f3e4');box(72,318,115,6,'#6eaaa2');
  box(665,313,209,20,'#5caaa6');box(665,305,135,10,'#faf1da');box(678,333,20,27,'#8caeaa');box(842,333,20,27,'#8caeaa');
  tiles('#d5e2dc','#adc6c1');
  for(let i=0;i<6;i++)oval(430+i*22,391+(i%2)*13,5,9,i%2?'#e8b870':'#73bdb2');
  tree(915,350,.55,'#7ca67a'); }else if(id==='roman_bath'){
  gradient('#efe4ca','#e1c8a8');
  // Sea-facing arches, blue frescoes and a pool behind the fighting terrace.
  for(const x of [230,480,730]){
   ctx.save();ctx.beginPath();ctx.moveTo(x-86,304);ctx.lineTo(x-86,195);ctx.arc(x,195,86,Math.PI,0);ctx.lineTo(x+86,304);ctx.closePath();ctx.clip();
   box(x-90,100,180,206,'#9dc8d5');box(x-90,245,180,60,'#5a9fb5');cloud(x+9,170);
   poly([[x-95,262],[x-48,225],[x+13,253],[x+90,236],[x+90,306],[x-95,306]],'#8ca587');
   for(let y=267;y<305;y+=11)line([[x-80,y],[x+75,y]],'#c2e1da',1);
   ctx.restore();ctx.strokeStyle='#fbf2d9';ctx.lineWidth=12;ctx.beginPath();ctx.moveTo(x-86,305);ctx.lineTo(x-86,195);ctx.arc(x,195,86,Math.PI,0);ctx.lineTo(x+86,305);ctx.stroke();
  }
  box(0,291,960,24,'#579baa');
  for(let x=10;x<960;x+=45)line([[x,306],[x+10,297],[x+22,306],[x+33,297]],'#dceee1',2);
  for(const x of [41,118,842,919])column(x,145,200);
  box(282,315,396,40,'#f6e9cf');box(297,323,366,25,'#73c5c4');
  for(let x=310;x<660;x+=45)line([[x,336],[x+22,331],[x+35,336]],'#c0ede3',2);
  oval(480,300,19,19,'#b49455');oval(480,300,10,13,'#d4ba79');line([[480,310],[480,336]],'#b9e7df',4);
  for(let i=0;i<5;i++){const x=342+i*65;ctx.strokeStyle='#ffffff66';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x,320);ctx.bezierCurveTo(x-18,301,x+18,286,x,271);ctx.stroke();}
  tiles('#e9dcc2','#c4b497');
  for(let y=365;y<540;y+=39)for(let x=0;x<960;x+=78)box(x+(y%2?0:39),y,37,17,'#d4cbb7');
  for(const x of [190,770]){oval(x,333,20,22,'#bc7958');box(x-11,303,22,14,'#cf926b');line([[x-16,318],[x+16,318]],'#edc897',3);}
 }else if(id==='science_room'){
  gradient('#e8e7c6','#c5ddd1');box(0,315,960,45,'#7aafa6');
  // A colourful periodic table over the whiteboard and demonstration bench.
  box(268,159,422,115,'#719593');box(277,168,404,96,'#f1f1db');
  label('STAY CURIOUS!',480,191,18,'#478b88');label('E = mc²     H₂O     F = ma',480,231,23,'#526d77');
  for(let row=0;row<3;row++)for(let col=0;col<12;col++){const x=316+col*27,y=100+row*16;box(x,y,24,13,['#cda783','#90c8b0','#8dbbcf','#c5a5cd'][(row+col)%4]);}
  box(227,300,506,60,'#488a86');box(215,290,530,12,'#344f54');
  for(const [x,c]of [[300,'#9bcf78'],[365,'#b3a1db'],[625,'#eeac77']]){
   box(x-7,249,14,20,'#b9d9d4');poly([[x-7,262],[x+7,262],[x+22,286],[x-22,286]],'#e7f1de');poly([[x-14,275],[x+14,275],[x+20,284],[x-20,284]],c);oval(x-4,272,2,2,'#fff8e9');
   for(let i=0;i<3;i++)oval(x+(i%2?6:-4),237-i*9,3,3,'#90b7a1');
  }
  box(40,147,139,189,'#719698');box(48,155,123,169,'#c0d8cf');
  for(let row=0;row<3;row++){box(49,202+row*52,121,5,'#7a9c95');for(let col=0;col<4;col++){const x=58+col*29,y=174+row*52;box(x,y,20,26,['#c0a6cb','#b4ca96','#dbb98d'][row]);box(x+2,y-4,16,5,'#719593');}}
  box(790,165,132,177,'#8ca9a5');box(800,176,112,112,'#446d72');box(810,270,92,10,'#c6e3a9');oval(855,248,19,19,'#94cf82');box(848,220,14,14,'#c0dfc4');
  line([[770,108],[923,108]],'#6a8b8b',3);for(let i=0;i<5;i++){const x=788+i*28;line([[x,108],[x,128+(i%2)*15]],'#77949a',1);oval(x,137+(i%2)*15,7+i%3,7+i%3,['#dfa469','#b9bc95','#85aeb4','#bca6c6','#dcbd79'][i]);}
  tiles('#e4e6cd','#b9c4b2');for(let y=368;y<540;y+=43)for(let x=0;x<960;x+=110)box(x+(y%2?0:55),y,52,20,'#bacbb8');
  label('GOGGLES ON',480,329,16,'#dce7c4');
 }else if(id==='alma_bedroom'){
  gradient('#eed1dc','#e8b9cf');for(let x=0;x<960;x+=52)box(x,110,25,220,'#f6dfe5');
  box(0,310,960,50,'#faf0df');for(let x=20;x<960;x+=65)box(x,318,50,33,'#e4d8ce');planks('#c59571','#b1805f');
  window(45,148,139,134);for(const x of [28,173])poly([[x,140],[x+28,140],[x+24,209],[x+35,278],[x-4,278],[x+3,210]],'#d897b5');
  box(41,304,151,45,'#fff1df');box(35,298,164,10,'#d593b3');heart(116,322,9,'#d78eaf');
  for(let x=270;x<700;x+=33){const y=138+Math.sin((x-270)/430*Math.PI)*20;oval(x,y,3,4,'#fff5b0');}
  line([[344,163],[615,163]],'#ab7da3',1);
  for(let i=0;i<4;i++){const x=380+i*66;poly([[x-23,164],[x+23,164],[x,198]],['#c4a5da','#e2a1c1','#f8eddb','#a7cbbc'][i]);label('ALMA'[i],x,184,15,'#8d6184');}
  box(365,256,230,85,'#fbefdf');heart(480,258,45,'#da91b2');box(376,293,208,50,'#d798b8');box(382,284,85,18,'#fff3e5');box(490,284,85,18,'#fff3e5');
  for(let x=387;x<585;x+=23)for(let y=311;y<339;y+=16)oval(x,y,3,3,'#fce6e5');
  box(358,337,244,17,'#f8e9d9');
  box(732,148,178,101,'#c49b89');for(let i=0;i<3;i++){box(743+i*52,161,44,67,['#faf0d4','#ead2e0','#dce8d0'][i]);heart(765+i*52,187,9,['#e6acbb','#b5a1cb','#a3c3ad'][i]);}
  box(729,298,185,12,'#fff0dd');box(742,310,10,45,'#dca0bb');box(890,310,10,45,'#dca0bb');box(777,274,75,20,'#c19dcb');
  oval(480,451,190,50,'#fae7e1');oval(480,451,163,38,'#e0a2bf');oval(480,451,132,28,'#f8ddde');
  for(const x of [372,588])heart(x,450,11,'#ba85ac');
 }else if(id==='housam_bedroom'){
  gradient('#b9d6df','#c7e0df');box(0,270,960,20,'#344e71');box(0,346,960,14,'#f0eee1');planks('#c09268','#a77955');
  window(44,144,153,133);box(37,136,168,24,'#405777');
  line([[54,343],[54,299],[185,299],[185,343]],'#f5f2dd',4);for(let x=65;x<185;x+=16)line([[x,300],[x,344]],'#e3e9d5',1);for(let y=311;y<344;y+=12)line([[55,y],[185,y]],'#e3e9d5',1);
  box(369,158,222,123,'#526679');box(379,168,202,103,'#f2ecd8');
  poly([[430,188],[450,177],[468,183],[492,183],[510,177],[530,188],[514,210],[503,204],[503,255],[457,255],[457,204],[446,210]],'#3c6e9c');label('10',480,235,32,'#f9eedb');
  box(355,295,250,58,'#344e71');box(367,286,226,24,'#e4ecdf');box(366,312,228,32,'#5b87a4');for(const x of [391,457,523,574])ball(x,328,9);
  box(723,147,191,110,'#8ca2a6');box(730,154,177,96,'#f8f1dc');label('v = d / t',818,180,19,'#4c6f87');line([[750,236],[750,195]],'#849b97',1);line([[750,236],[893,236]],'#849b97',1);ctx.strokeStyle='#ca9d59';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(755,233);ctx.quadraticCurveTo(820,163,885,231);ctx.stroke();
  box(710,304,218,12,'#f5eedc');box(724,316,12,40,'#405777');box(902,316,12,40,'#405777');box(766,265,96,41,'#344350');box(773,271,82,27,'#648f9a');box(755,304,118,4,'#a4b6b6');
  // Clawd's little orange face on the laptop screen.
  box(798,278,30,15,'#d99471');box(804,282,4,6,'#394552');box(818,282,4,6,'#394552');
  for(const x of [260,662]){box(x-33,233,66,7,'#f5e9ca');oval(x,208,16,13,'#dab46b');box(x-4,216,8,14,'#cda35d');box(x-15,227,30,5,'#9b7e4f');}
  box(295,395,370,113,'#56885f');for(let x=300;x<660;x+=45)box(x,400,22,102,'#60966b');line([[304,403],[656,403],[656,499],[304,499],[304,403]],'#e1e9c6',2);line([[480,403],[480,499]],'#e1e9c6',2);ctx.strokeStyle='#e1e9c6';ctx.beginPath();ctx.ellipse(480,451,44,26,0,0,Math.PI*2);ctx.stroke();
 }else if(id==='school_library'){
  gradient('#d4e4df','#adc9d2');box(0,324,960,36,'#bb9972');
  bookshelf(26,137,220,214);bookshelf(716,137,220,214);
  box(281,158,398,151,'#c49a6f');box(291,168,378,131,'#a8c5a4');
  label('READING IS AN ADVENTURE',480,189,16,'#385f61');
  // Reading-dragon mural and branching tree from the story corner.
  box(353,224,16,66,'#897553');line([[360,249],[404,218]],'#897553',9);oval(365,221,60,28,'#7aa583');oval(432,244,24,20,'#5b9e7e');oval(450,229,17,16,'#6daf87');oval(456,225,3,4,'#fff7df');oval(457,225,1,2,'#334e57');poly([[419,253],[438,249],[455,257],[439,270],[418,263]],'#f2e2b9');
  box(519,207,132,60,'#fcf0cf');label('QUIET',585,231,18,'#667875');label('PLEASE!',585,255,18,'#667875');
  for(let i=0;i<12;i++){const x=24+i*82;poly([[x,117],[x+40,117],[x+20,142]],['#c4a5ce','#dcba76','#80b5b2','#df9d97'][i%4]);}
  box(317,319,327,36,'#af865c');box(306,312,349,10,'#d1af7d');label('CHECK OUT HERE',480,344,14,'#f5e7c9');
  for(const x of [360,600]){box(x-3,286,6,26,'#af9562');oval(x,284,25,11,'#5c9581');box(x-13,309,26,4,'#ac8b55');}
  tiles('#7192a3','#678597');
  for(let i=0;i<5;i++)oval(480,458,185-i*26,48-i*6,['#b68eaa','#dcaf8b','#e5d39d','#a0b9a3','#8daac4'][i]);
 }else if(id==='house'){
  gradient('#94bed0','#dfe1b9');cloud(135,169);cloud(840,142);tree(63,350,1.5,'#6d9976');tree(914,347,1.6,'#7f9e76');
  box(176,163,596,180,'#b37863');box(180,149,28,71,'#9c685b');poly([[150,176],[241,119],[710,119],[802,176]],'#657078');
  for(let y=181;y<345;y+=15){line([[177,y],[770,y]],'#cf9e7f',1);for(let x=180+(y%2)*22;x<770;x+=44)line([[x,y],[x,y+15]],'#cf9e7f',1);}
  for(const x of [230,337,548,657])window(x,191,53,59);
  // Cream cross gable and four-column front porch.
  poly([[345,184],[480,108],[615,184]],'#eee0c6');for(let y=144;y<182;y+=9)line([[402-(y-144)*1.7,y],[558+(y-144)*1.7,y]],'#d2c8b2',1);oval(480,151,16,16,'#c4c4ad');for(let y=141;y<166;y+=5)line([[469,y],[491,y]],'#8d9e9a',1);
  box(359,249,242,91,'#a77363');box(453,260,54,80,'#eee7d2');box(462,272,36,31,'#a3c5c3');oval(499,317,3,3,'#b59d69');
  poly([[324,265],[365,240],[595,240],[636,265]],'#637477');box(326,265,310,9,'#f3e7d2');for(const x of [344,413,547,616]){box(x,273,9,70,'#f6edda');box(x-4,338,17,5,'#ded5c3');}
  box(323,343,318,10,'#b9b7a4');box(312,353,340,9,'#d0c9b1');
  box(0,360,960,180,'#83a578');for(let y=360;y<540;y+=38)box(0,y,960,19,'#8eaf80');
  poly([[444,362],[516,362],[601,540],[359,540]],'#d4cdb7');
  for(const x of [191,251,710,773])oval(x,349,35,19,'#5e865d');
  for(let i=0;i<30;i++){const x=(i*113+59)%960,y=380+(i*41)%155;if(x>365&&x<595)continue;for(let j=0;j<3;j++)oval(x+Math.cos(j*2.1)*4,y+Math.sin(j*2.1)*3,4,3,'#71976b');if(i%3===0)oval(x,y-4,3,4,'#d9adb0');}
  // Garden gnome beside the front path.
  poly([[653,336],[664,308],[674,336]],'#c77c6d');oval(664,340,9,9,'#e6c4a1');box(655,348,19,13,'#6a8f9b');

 }
 // Common HUD shade maintains readable health bars against every palette.
 const shade=ctx.createLinearGradient(0,0,0,155);shade.addColorStop(0,'#11152beF');shade.addColorStop(1,'#11152b00');box(0,0,960,155,shade);
 ctx.restore();
}
