import { useState, useRef, useEffect, useCallback } from "react";
import jsPDF from "jspdf";

const OD_DCIP={75:93.0,100:118.0,150:169.0,200:220.0,250:271.6,300:322.8,400:425.6};
const OD_HPPE={75:89.0,100:114.0,150:165.0};
const DIAS_DCIP=[75,100,150,200,250,300,400];
const DIAS_HPPE=[75,100,150];
const ROADS=[{key:"shidou",label:"市道",D:1000},{key:"kendou",label:"県道",D:1200}];
const SURFACES=[{key:"asphalt",label:"アスファルト"},{key:"gravel",label:"砕石"}];

function mkDCIP(road,surface,D){
  const Hs=D-300;const isG=surface==="gravel";
  if(road==="shidou"){const s=[
    {id:1,name:"掘削",inputs:["H","B"],tKey:null,prevRef:null,extra:[]},
    {id:2,name:"管布設",inputs:["D"],tKey:null,prevRef:null,extra:[]},
    {id:3,name:"砂埋戻し",inputs:["H","B"],tKey:"t1",tDef:100,prevRef:"D",extra:[]},
    {id:4,name:"発生土埋戻し",inputs:["H","B"],tKey:"t2",tDef:200,prevRef:3,extra:[{key:"Hs",label:"埋設シート",design:Hs,minus:30,plus:30},{key:"Dm",label:"マーカーピン",design:700,minus:30,plus:30}]},
    {id:5,name:"発生土埋戻し",inputs:["H","B"],tKey:"t3",tDef:200,prevRef:4,extra:[]},
    {id:6,name:"発生土埋戻し",inputs:["H","B"],tKey:"t4",tDef:isG?200:160,prevRef:5,extra:[]},
    {id:7,name:"路盤砕石",inputs:["H","B"],tKey:"t5",tDef:150,prevRef:6,extra:[]},
    {id:8,name:"路盤砕石",inputs:["H","B"],tKey:"t6",tDef:150,prevRef:7,extra:[]},
  ];if(!isG)s.push({id:9,name:"舗装",inputs:["Ba","ta"],tKey:null,prevRef:null,extra:[]});return s;}
  const s=[
    {id:1,name:"掘削",inputs:["H","B"],tKey:null,prevRef:null,extra:[]},
    {id:2,name:"管布設",inputs:["D"],tKey:null,prevRef:null,extra:[]},
    {id:3,name:"砂埋戻し",inputs:["H","B"],tKey:"t1",tDef:100,prevRef:"D",extra:[]},
    {id:4,name:"発生土埋戻し",inputs:["H","B"],tKey:"t2",tDef:200,prevRef:3,extra:[{key:"Hs",label:"埋設シート",design:Hs,minus:30,plus:30}]},
    {id:5,name:"発生土埋戻し",inputs:["H","B"],tKey:"t3",tDef:200,prevRef:4,extra:[{key:"Dm",label:"マーカーピン",design:700,minus:30,plus:30}]},
    {id:6,name:"発生土埋戻し",inputs:["H","B"],tKey:"t4",tDef:200,prevRef:5,extra:[]},
    {id:7,name:"発生土埋戻し",inputs:["H","B"],tKey:"t5",tDef:isG?200:160,prevRef:6,extra:[]},
    {id:8,name:"路盤砕石",inputs:["H","B"],tKey:"t6",tDef:150,prevRef:7,extra:[]},
    {id:9,name:"路盤砕石",inputs:["H","B"],tKey:"t7",tDef:150,prevRef:8,extra:[]},
  ];if(!isG)s.push({id:10,name:"舗装",inputs:["Ba","ta"],tKey:null,prevRef:null,extra:[]});return s;
}
function mkHPPE(road,surface,D){
  const Hs=D-300;const isG=surface==="gravel";
  if(road==="shidou"){const s=[
    {id:1,name:"掘削",inputs:["H","B"],tKey:null,prevRef:null,extra:[]},
    {id:2,name:"基礎砂",inputs:["H","B"],tKey:"t0",tDef:100,prevRef:1,extra:[]},
    {id:3,name:"管布設",inputs:["D"],tKey:null,prevRef:null,extra:[]},
    {id:4,name:"砂埋戻し",inputs:["H","B"],tKey:"t1",tDef:100,prevRef:"D",extra:[]},
    {id:5,name:"発生土埋戻し",inputs:["H","B"],tKey:"t2",tDef:200,prevRef:4,extra:[{key:"Hs",label:"埋設シート",design:Hs,minus:30,plus:30},{key:"Dm",label:"マーカーピン",design:700,minus:30,plus:30}]},
    {id:6,name:"発生土埋戻し",inputs:["H","B"],tKey:"t3",tDef:200,prevRef:5,extra:[]},
    {id:7,name:"発生土埋戻し",inputs:["H","B"],tKey:"t4",tDef:isG?200:160,prevRef:6,extra:[]},
    {id:8,name:"路盤砕石",inputs:["H","B"],tKey:"t5",tDef:150,prevRef:7,extra:[]},
    {id:9,name:"路盤砕石",inputs:["H","B"],tKey:"t6",tDef:150,prevRef:8,extra:[]},
  ];if(!isG)s.push({id:10,name:"舗装",inputs:["Ba","ta"],tKey:null,prevRef:null,extra:[]});return s;}
  const s=[
    {id:1,name:"掘削",inputs:["H","B"],tKey:null,prevRef:null,extra:[]},
    {id:2,name:"基礎砂",inputs:["H","B"],tKey:"t0",tDef:100,prevRef:1,extra:[]},
    {id:3,name:"管布設",inputs:["D"],tKey:null,prevRef:null,extra:[]},
    {id:4,name:"砂埋戻し",inputs:["H","B"],tKey:"t1",tDef:100,prevRef:"D",extra:[]},
    {id:5,name:"発生土埋戻し",inputs:["H","B"],tKey:"t2",tDef:200,prevRef:4,extra:[{key:"Hs",label:"埋設シート",design:Hs,minus:30,plus:30}]},
    {id:6,name:"発生土埋戻し",inputs:["H","B"],tKey:"t3",tDef:200,prevRef:5,extra:[{key:"Dm",label:"マーカーピン",design:700,minus:30,plus:30}]},
    {id:7,name:"発生土埋戻し",inputs:["H","B"],tKey:"t4",tDef:200,prevRef:6,extra:[]},
    {id:8,name:"発生土埋戻し",inputs:["H","B"],tKey:"t5",tDef:isG?200:160,prevRef:7,extra:[]},
    {id:9,name:"路盤砕石",inputs:["H","B"],tKey:"t6",tDef:150,prevRef:8,extra:[]},
    {id:10,name:"路盤砕石",inputs:["H","B"],tKey:"t7",tDef:150,prevRef:9,extra:[]},
  ];if(!isG)s.push({id:11,name:"舗装",inputs:["Ba","ta"],tKey:null,prevRef:null,extra:[]});return s;
}
function getSteps(p,r,sf,D){if(p==="SHIKIRI")return[{id:1,name:"弁筐設置",inputs:["A","H"],tKey:null,prevRef:null,extra:[]}];return p==="DCIP"?mkDCIP(r,sf,D):mkHPPE(r,sf,D);}
function getDefaults(steps){const d={};steps.forEach(s=>{if(s.tKey&&s.tDef)d[s.tKey]=s.tDef;});if(steps.some(s=>s.inputs?.includes("ta")))d.ta=40;return d;}
function getOD(p,d){return(p==="DCIP"?OD_DCIP:p==="HPPE"?OD_HPPE:{})[d]||0;}
function getDias(p){return p==="DCIP"?DIAS_DCIP:p==="HPPE"?DIAS_HPPE:[];}
function calcH0(p,D,d){const od=getOD(p,d);return p==="HPPE"?D+od+100:D+od;}
const FM={H:{label:"深さ",minus:30,plus:30},B:{label:"幅",minus:50,plus:null},Ba:{label:"舗装幅",minus:25,plus:null},D:{label:"埋設深",minus:30,plus:30},ta:{label:"舗装厚",minus:7,plus:null},t0:{label:"基礎砂",minus:30,plus:30},t1:{label:"保護砂",minus:30,plus:30},t2:{label:"発生土",minus:30,plus:30},t3:{label:"発生土",minus:30,plus:30},t4:{label:"発生土",minus:30,plus:30},t5:{label:"路盤",minus:30,plus:30},t6:{label:"路盤",minus:30,plus:30},t7:{label:"路盤",minus:30,plus:30},A:{label:"弁芯距離",minus:null,plus:25},Hs:{label:"シート",minus:30,plus:30},Dm:{label:"マーカー",minus:30,plus:30}};
const PL={DCIP:"DCIP",HPPE:"HPPE",SHIKIRI:"仕切弁筐"};
function judge(e,f,m){const meta=m||FM[f];if(!meta||e===null||isNaN(e))return null;if(meta.minus!==null&&e<-meta.minus)return"×";if(meta.plus!==null&&e>meta.plus)return"×";return"○";}
function today(){const d=new Date();return`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;}
function nowTime(){return new Date().toLocaleTimeString("ja-JP",{hour:"2-digit",minute:"2-digit"});}

// ═══════════════════════════════════════
// PDF出力
// ═══════════════════════════════════════
function generatePDF({header,pipeType,roadType,surfaceType,design,points,steps,dia,od,D,H0}){
  const doc=new jsPDF("p","mm","a4");
  const W=210,H=297,M=10;
  const allItems=["B","Ba","H","t1","t2","t3","t4","t5","t6","ta","D","Hs","Dm"];
  const road=ROADS.find(r=>r.key===roadType);

  const calcDesignH=(sid)=>{
    if(sid===1)return H0;
    const bStep=steps.find(s=>s.tKey==="t0");
    if(bStep&&sid===bStep.id)return H0-(Number(design.t0)||0);
    let h=D;let ap=false;
    for(const s of steps){if(s.inputs.includes("D")){ap=true;continue;}if(!ap)continue;if(s.id>sid)break;if(s.tKey&&s.tKey!=="t0"&&design[s.tKey])h-=Number(design[s.tKey]);}
    return Math.round(h);
  };
  const dv=(f,sid)=>{if(f==="H")return calcDesignH(sid);if(f==="B")return design.B?Number(design.B):null;if(f==="Ba")return design.Ba?Number(design.Ba):null;if(f==="D")return D;if(f==="ta")return Number(design.ta)||40;if(f==="Hs")return 300;if(f==="Dm")return 700;return design[f]?Number(design[f]):null;};

  const designVals={};
  allItems.forEach(it=>{
    if(it==="H")designVals[it]=H0;
    else if(it==="D")designVals[it]=D;
    else if(it==="B")designVals[it]=design.B?Number(design.B):null;
    else if(it==="Ba")designVals[it]=design.Ba?Number(design.Ba):null;
    else if(it==="ta")designVals[it]=Number(design.ta)||40;
    else if(it==="Hs")designVals[it]=300;
    else if(it==="Dm")designVals[it]=700;
    else designVals[it]=design[it]?Number(design[it]):null;
  });

  // ── 豆図描画 ──
  function drawMamizu(doc,ox,oy,w,h){
    const layers=[
      {t:40,n:"AS"},{t:Number(design.t6)||150,n:"路盤"},{t:Number(design.t5)||150,n:"路盤"},
      {t:Number(design.t4)||160,n:"発生土"},{t:Number(design.t3)||200,n:"発生土"},
      {t:Number(design.t2)||200,n:"発生土"},{t:Number(design.t1)||100,n:"保護砂"},{t:od,n:"管"},
    ];
    if(pipeType==="HPPE")layers.push({t:100,n:"基礎砂"});
    const total=layers.reduce((s,l)=>s+l.t,0);
    doc.setDrawColor(60);doc.setLineWidth(0.3);doc.rect(ox,oy,w,h);
    let y=oy;let pipeY=0,pipeLh=0,bt23=0;
    layers.forEach((l,i)=>{
      const lh=h*(l.t/total);
      doc.setDrawColor(180);doc.setLineWidth(0.1);doc.rect(ox,y,w,lh);
      doc.setFontSize(5);doc.setTextColor(100);
      if(lh>3)doc.text(l.n,ox+w/2,y+lh/2+1,{align:"center"});
      if(l.n==="管"){pipeY=y;pipeLh=lh;}
      if(i===4)bt23=y+lh;
      y+=lh;
    });
    const pr=pipeLh/2,pcx=ox+w/2,pcy=pipeY+pipeLh/2;
    doc.setDrawColor(60);doc.setLineWidth(0.2);doc.circle(pcx,pcy,pr);
    doc.setDrawColor(30);doc.setLineWidth(0.3);
    doc.line(pcx-pr*0.8,bt23,pcx+pr*0.8,bt23);
    doc.line(pcx,bt23-3,pcx,bt23+2.5);
    doc.line(pcx-1.5,bt23-3,pcx+1.5,bt23-3);
    const rx=ox+w+2;
    doc.setFontSize(4);doc.setTextColor(60);
    doc.line(rx+8,oy,rx+8,oy+h);doc.text("H",rx+9,(oy+oy+h)/2);
    doc.line(rx+4,oy,rx+4,pipeY);doc.text("D",rx+5,(oy+pipeY)/2);
    const hsY=oy+h*(700/total);
    doc.line(rx,pipeY,rx,hsY);doc.text("Hs",rx+1,(pipeY+hsY)/2);
    doc.line(rx+12,oy,rx+12,hsY);doc.text("Dm",rx+13,(oy+hsY)/2);
    doc.setFontSize(4);doc.text("Ba",ox+w/2,oy-1,{align:"center"});
    doc.text("B",ox+w/2,oy+h+3,{align:"center"});
  }

  // ── 表紙ページ ──
  function drawCoverPage(doc,ptL,ptR,pgNum,totalPg){
    doc.setFontSize(12);doc.setTextColor(0);
    doc.text("検 査 記 録 表",W/2,M+6,{align:"center"});

    let ty=M+10;const lm=M,cw=W-2*M;
    doc.setFontSize(7);doc.setDrawColor(80);doc.setLineWidth(0.2);
    const rows=[
      ["工 事 名",header.projectName||""],
      ["工事箇所",header.location||""],
      ["工　　種","配管工"],
      ["種　　別",`床掘検測（${PL[pipeType]} φ${dia}）`],
    ];
    rows.forEach(r=>{
      doc.rect(lm,ty,22,6);doc.rect(lm+22,ty,cw-22,6);
      doc.setTextColor(100);doc.text(r[0],lm+2,ty+4);
      doc.setTextColor(0);doc.text(r[1],lm+24,ty+4);
      ty+=6;
    });
    const sealX=W-M-60;
    ["総括監督員","主任監督員","監督員"].forEach((s,i)=>{
      const sx=sealX+i*20;
      doc.rect(sx,M+10,20,6);doc.rect(sx,M+16,20,12);
      doc.setFontSize(5);doc.setTextColor(100);doc.text(s,sx+10,M+14,{align:"center"});
    });
    doc.rect(sealX,M+28,30,6);doc.setFontSize(5);doc.text("主任技術者",sealX+2,M+32);

    const mzTop=ty+2;const mzH=60;const mzW=55;
    drawMamizu(doc,lm+5,mzTop,mzW,mzH);

    const crX=lm+mzW+25;const crTop=mzTop;
    doc.setFontSize(6);doc.setTextColor(0);doc.text("管理基準",crX+20,crTop+3,{align:"center"});
    doc.setLineWidth(0.15);
    const crItems=[["項目","-mm","+mm"],["床付幅B","-50",""],["舗装幅Ba","-25",""],["掘削深H","-30","30"],["埋戻厚tn","-30","30"],["舗装厚ta","-7",""],["埋設深D","-30","30"],["Hs※1","-30","30"],["Dm※2","-30","30"]];
    let cry=crTop+5;
    crItems.forEach(r=>{
      doc.setFontSize(5);doc.setTextColor(r[0]==="項目"?100:0);
      doc.rect(crX,cry,25,4);doc.rect(crX+25,cry,12,4);doc.rect(crX+37,cry,12,4);
      doc.text(r[0],crX+1,cry+3);doc.text(r[1],crX+31,cry+3,{align:"center"});doc.text(r[2],crX+43,cry+3,{align:"center"});
      cry+=4;
    });
    doc.setFontSize(4);doc.setTextColor(100);
    doc.text("※1 埋設シート位置 管上0.3m",crX,cry+3);
    doc.text("※2 マーカー位置 DP=0.70m",crX,cry+6);

    let dy=mzTop+mzH+4;
    doc.setFontSize(5);doc.setTextColor(100);
    doc.text("検測区分（いずれかに○）・段階確認　・出来形管理（段階確認以外）　・その他（　　　）",lm,dy+3);
    dy+=5;

    doc.setLineWidth(0.15);doc.setDrawColor(80);
    const colW=[16,14,14,12,14,10];
    const th=["測点","設計","検測","誤差","日付","判定"];
    const drawRow=(x,y,vals,isHdr)=>{
      let cx=x;
      vals.forEach((v,i)=>{
        const cw2=colW[i];
        doc.rect(cx,y,cw2,4);
        doc.setFontSize(isHdr?4.5:5);
        doc.setTextColor(isHdr?100:0);
        if(v==="○")doc.setTextColor(0,100,50);
        if(v==="×")doc.setTextColor(200,0,0);
        doc.text(String(v),cx+cw2/2,y+3,{align:"center"});
        cx+=cw2;
      });
    };
    const halfW=colW.reduce((s,w2)=>s+w2,0);
    drawRow(lm,dy,th,true);drawRow(lm+halfW+2,dy,th,true);dy+=4;

    const drawPtData=(pt,x,startY)=>{
      if(!pt)return;
      let yy=startY;
      doc.setFontSize(5);doc.setTextColor(0);
      drawRow(x,yy,[pt.name,"","","","",""],false);yy+=4;
      allItems.forEach(it=>{
        const dVal=designVals[it];if(dVal===null)return;
        const key=steps.find(s=>s.inputs.includes(it))?`${steps.find(s=>s.inputs.includes(it)).id}_${it}`:`1_${it}`;
        let mv=null;
        for(const s of steps){
          const k=`${s.id}_${it}`;
          if(pt.measured[k]!==undefined&&pt.measured[k]!==""){mv=Number(pt.measured[k]);break;}
          for(const ex of s.extra){if(ex.key===it){const ek=`${s.id}_${it}`;if(pt.measured[ek]!==undefined&&pt.measured[ek]!=="")mv=Number(pt.measured[ek]);}}
        }
        const err=mv!==null?mv-dVal:null;
        const j=err!==null?judge(err,it):null;
        drawRow(x,yy,[it,dVal,mv!==null?mv:"",err!==null?(err>0?"+":"")+err:"",pt.date||"",j||""],false);
        yy+=4;
      });
    };
    drawPtData(ptL,lm,dy);drawPtData(ptR,lm+halfW+2,dy);

    doc.setFontSize(4);doc.setTextColor(150);
    doc.text(`${pgNum} / ${totalPg}`,W-M,H-M+2,{align:"right"});
    doc.text("有限会社信濃住宅設備",lm,H-M+2);
  }

  // ── 工程シート（3分割） ──
  function drawStepSheet(doc,step,pt,ox,oy,sw,sh,stepIdx){
    doc.setDrawColor(100);doc.setLineWidth(0.15);doc.rect(ox,oy,sw,sh);
    doc.setFontSize(6);doc.setTextColor(0);
    doc.text(`${pt.name}  ${step.id}.${step.name}`,ox+2,oy+4);
    doc.setFontSize(4);doc.setTextColor(100);
    doc.text(pt.date||"",ox+sw-2,oy+4,{align:"right"});

    const photoW=sw*0.45,photoH=sh*0.45;
    doc.setDrawColor(180);doc.rect(ox+2,oy+6,photoW,photoH);
    doc.setFontSize(5);doc.setTextColor(180);doc.text("写真",ox+2+photoW/2,oy+6+photoH/2,{align:"center"});

    const mzX=ox+photoW+6,mzW=sw-photoW-10,mzH=photoH;
    drawMamizu(doc,mzX,oy+6,mzW,mzH);

    let dy=oy+6+photoH+3;
    doc.setLineWidth(0.1);doc.setDrawColor(120);
    const cols=[18,16,16,14,10];
    const hdr=["項目","設計","実測","誤差","判定"];
    let cx=ox+2;
    hdr.forEach((h2,i)=>{doc.rect(cx,dy,cols[i],3.5);doc.setFontSize(4);doc.setTextColor(100);doc.text(h2,cx+cols[i]/2,dy+2.5,{align:"center"});cx+=cols[i];});
    dy+=3.5;

    step.inputs.forEach(f=>{
      const d2=dv(f,step.id);const key=`${step.id}_${f}`;const mv=pt.measured[key]??"";
      const err=d2!==null&&mv!==""?Number(mv)-d2:null;const j=err!==null?judge(err,f):null;
      cx=ox+2;
      const vals=[f,d2!==null?Math.round(d2):"",mv,err!==null?(err>0?"+":"")+err:"",j||""];
      vals.forEach((v,i)=>{
        doc.rect(cx,dy,cols[i],3.5);doc.setFontSize(4.5);
        doc.setTextColor(v==="○"?[0,100,50]:v==="×"?[200,0,0]:[0,0,0]);
        doc.text(String(v),cx+cols[i]/2,dy+2.5,{align:"center"});cx+=cols[i];
      });
      dy+=3.5;
    });

    if(step.tKey){
      const tD=design[step.tKey]?Number(design[step.tKey]):null;
      let tM=null;
      if(step.prevRef!==null){
        let pv;
        if(step.prevRef==="D"){const ds=steps.find(s=>s.inputs.includes("D"));pv=ds?pt.measured[`${ds.id}_D`]:null;}
        else pv=pt.measured[`${step.prevRef}_H`];
        const ch=pt.measured[`${step.id}_H`];
        if(pv&&pv!==""&&ch&&ch!=="")tM=Number(pv)-Number(ch);
      }
      const tErr=tM!==null&&tD!==null?tM-tD:null;const tJ=tErr!==null?judge(tErr,step.tKey):null;
      cx=ox+2;
      [step.tKey,tD,tM!==null?tM:"",tErr!==null?(tErr>0?"+":"")+tErr:"",tJ||""].forEach((v,i)=>{
        doc.rect(cx,dy,cols[i],3.5);doc.setFontSize(4.5);
        doc.setTextColor(v==="○"?[0,100,50]:v==="×"?[200,0,0]:[0,0,0]);
        doc.text(String(v),cx+cols[i]/2,dy+2.5,{align:"center"});cx+=cols[i];
      });dy+=3.5;
    }

    step.extra.forEach(ex=>{
      const key=`${step.id}_${ex.key}`;const mv=pt.measured[key]??"";
      const err=mv!==""?Number(mv)-ex.design:null;const j=err!==null?judge(err,ex.key,ex):null;
      cx=ox+2;
      [ex.key,ex.design,mv,err!==null?(err>0?"+":"")+err:"",j||""].forEach((v,i)=>{
        doc.rect(cx,dy,cols[i],3.5);doc.setFontSize(4.5);
        doc.setTextColor(v==="○"?[0,100,50]:v==="×"?[200,0,0]:[0,0,0]);
        doc.text(String(v),cx+cols[i]/2,dy+2.5,{align:"center"});cx+=cols[i];
      });dy+=3.5;
    });
  }

  // ── PDF生成実行 ──
  const coverPages=Math.ceil(points.length/2);
  for(let p=0;p<coverPages;p++){
    if(p>0)doc.addPage();
    drawCoverPage(doc,points[p*2],points[p*2+1]||null,p+1,coverPages);
  }

  const sheetH=90;const perPage=3;
  steps.forEach(step=>{
    for(let p=0;p<points.length;p+=perPage){
      doc.addPage();
      doc.setFontSize(7);doc.setTextColor(0);
      doc.text(`${step.id}. ${step.name}`,M,M+4);
      doc.setFontSize(4);doc.setTextColor(100);
      doc.text(`${PL[pipeType]} φ${dia} ${road.label}`,W-M,M+4,{align:"right"});
      for(let i=0;i<perPage&&p+i<points.length;i++){
        drawStepSheet(doc,step,points[p+i],M,M+7+i*sheetH,W-2*M,sheetH-2,i);
      }
      doc.setFontSize(4);doc.setTextColor(150);
      doc.text("有限会社信濃住宅設備",M,H-M+2);
    }
  });

  doc.save(`出来形_${header.projectName||"data"}_${today()}.pdf`);
}

// ═══════════════════════════════════════
// メインApp
// ═══════════════════════════════════════
export default function App(){
  const[locked,setLocked]=useState(true);
  const[keyword,setKeyword]=useState("");
  const[kwError,setKwError]=useState(false);
  const[screen,setScreen]=useState("setup");
  const[pipeType,setPipeType]=useState("DCIP");
  const[roadType,setRoadType]=useState("shidou");
  const[surfaceType,setSurfaceType]=useState("asphalt");
  const[header,setHeader]=useState({projectName:"",location:"",diameter:150});
  const[design,setDesign]=useState({});
  const[points,setPoints]=useState([]);
  const[cur,setCur]=useState({name:"",date:"",measured:{},photos:{}});
  const[editIdx,setEditIdx]=useState(null);
  const[toast,setToast]=useState("");
  const[bulkCount,setBulkCount]=useState(10);
  const[inited,setInited]=useState(false);
  const[viewPhoto,setViewPhoto]=useState(null);
  const[camStep,setCamStep]=useState(null);
  const fileRef=useRef(null);
  const[photoStep,setPhotoStep]=useState(null);

  const road=ROADS.find(r=>r.key===roadType);
  const D=road.D;const dia=header.diameter;const od=getOD(pipeType,dia);
  const H0=pipeType==="SHIKIRI"?0:calcH0(pipeType,D,dia);
  const steps=getSteps(pipeType,roadType,surfaceType,D);
  const tSum=steps.reduce((s,st)=>s+(st.tKey&&design[st.tKey]?Number(design[st.tKey]):0),0)+(design.ta?Number(design.ta):0);

  const rebuild=(p,r,sf)=>{const st=getSteps(p,r,sf,ROADS.find(x=>x.key===r).D);setDesign(d=>({...getDefaults(st),B:d.B||"",Ba:d.Ba||""}));setPoints([]);};
  if(!inited){rebuild("DCIP","shidou","asphalt");setInited(true);}

  const calcDesignH=(sid)=>{
    if(sid===1)return H0;const bStep=steps.find(s=>s.tKey==="t0");
    if(bStep&&sid===bStep.id)return H0-(Number(design.t0)||0);
    let h=D;let ap=false;
    for(const s of steps){if(s.inputs.includes("D")){ap=true;continue;}if(!ap)continue;if(s.id>sid)break;if(s.tKey&&s.tKey!=="t0"&&design[s.tKey])h-=Number(design[s.tKey]);}
    return Math.round(h);
  };
  const dv=(f,sid)=>{if(f==="H")return calcDesignH(sid);if(f==="B")return design.B?Number(design.B):null;if(f==="Ba")return design.Ba?Number(design.Ba):null;if(f==="D")return D;if(f==="ta")return Number(design.ta)||40;return design[f]?Number(design[f]):null;};
  const calcT=(step,meas)=>{if(!step.tKey||step.prevRef===null)return null;let pv;if(step.prevRef==="D"){const ds=steps.find(s=>s.inputs.includes("D"));pv=ds?meas[`${ds.id}_D`]:null;}else pv=meas[`${step.prevRef}_H`];const ch=meas[`${step.id}_H`];if(!pv||pv===""||!ch||ch==="")return null;return Number(pv)-Number(ch);};
  const prevLbl=(step)=>{if(!step.prevRef)return"";if(step.prevRef==="D"){const ds=steps.find(s=>s.inputs.includes("D"));return`D(${ds?.id})−H(${step.id})`;}return`H(${step.prevRef})−H(${step.id})`;};

  const selPipe=(k)=>{setPipeType(k);const ds=getDias(k);if(ds.length&&!ds.includes(header.diameter))setHeader(h=>({...h,diameter:ds[0]}));rebuild(k,roadType,surfaceType);};
  const selRoad=(k)=>{setRoadType(k);rebuild(pipeType,k,surfaceType);};
  const selSurface=(k)=>{setSurfaceType(k);rebuild(pipeType,roadType,k);};
  const bulkCreate=()=>{const pts=[];for(let i=1;i<=bulkCount;i++)pts.push({name:`No.${i}`,date:"",measured:{},photos:{}});setPoints(pts);};
  const editPoint=(i)=>{const p=JSON.parse(JSON.stringify(points[i]));if(!p.photos)p.photos={};setCur(p);setEditIdx(i);setScreen("entry");};
  const savePoint=()=>{if(editIdx!==null)setPoints(p=>{const n=[...p];n[editIdx]={...cur};return n;});setScreen("list");};

  const takePhoto=(stepId)=>{setPhotoStep(stepId);if(fileRef.current){fileRef.current.value="";fileRef.current.click();}};
  const onPhotoTaken=(e)=>{const file=e.target.files?.[0];if(!file||photoStep===null)return;const reader=new FileReader();reader.onload=(ev)=>{setCur(p=>{const ph={...p.photos};const a=ph[photoStep]||[];ph[photoStep]=[...a,{data:ev.target.result,time:nowTime()}];return{...p,photos:ph};});};reader.readAsDataURL(file);};
  const delPhoto=(sid,idx)=>{setCur(p=>{const ph={...p.photos};const a=[...(ph[sid]||[])];a.splice(idx,1);ph[sid]=a;return{...p,photos:ph};});};
  const totalPhotos=(pt)=>{if(!pt.photos)return 0;return Object.values(pt.photos).reduce((s,a)=>s+a.length,0);};

  const handlePDF=()=>{
    generatePDF({header,pipeType,roadType,surfaceType,design,points,steps,dia,od,D,H0});
    setToast("PDF出力完了");setTimeout(()=>setToast(""),3000);
  };

  const crit=(f,m)=>{const meta=m||FM[f];if(!meta)return"";let p=[];if(meta.minus!==null)p.push(`-${meta.minus}`);if(meta.plus!==null)p.push(`+${meta.plus}`);return p.join("/");};

  // ═══ LOCK ═══
  if(locked){const tryUnlock=()=>{if(keyword.toLowerCase()==="shinano"||keyword==="信濃"){setLocked(false);}else{setKwError(true);setKeyword("");}};
    return(<div style={{...S.w,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"80vh"}}>
      <div style={{fontSize:40,marginBottom:16}}>🔒</div><h1 style={{fontSize:20,fontWeight:700,marginBottom:4}}>出来形かんたん</h1>
      <div style={{fontSize:12,color:"#888",marginBottom:24}}>関係者専用</div>
      <input style={{...S.inp,width:220,textAlign:"center",fontSize:18,letterSpacing:2}} value={keyword} onChange={e=>setKeyword(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")tryUnlock();}} placeholder="キーワード" autoFocus/>
      {kwError&&<div style={{fontSize:12,color:"#C62828",marginTop:8}}>キーワードが違います</div>}
      <button style={{...S.pri,width:220,marginTop:12}} onClick={tryUnlock}>入場</button></div>);}

  // ═══ SETUP ═══
  if(screen==="setup"){const dias=getDias(pipeType);return(<div style={S.w}>
    <div style={S.top}><h1 style={S.logo}>出来形かんたん</h1><span style={S.bg}>1/3</span></div>
    <div style={S.c}><div style={S.ch}>管種</div><div style={{display:"flex",gap:6}}>
      {["DCIP","HPPE"].map(k=>(<button key={k} onClick={()=>selPipe(k)} style={{...S.sel,flex:1,...(pipeType===k?S.selOn:{})}}><div style={{fontSize:14,fontWeight:700}}>{k}</div><div style={{fontSize:10,opacity:.6}}>{k==="DCIP"?"ダクタイル鋳鉄管":"ポリエチレン管"}</div></button>))}
      <button onClick={()=>selPipe("SHIKIRI")} style={{...S.sel,flex:.7,...(pipeType==="SHIKIRI"?S.selOn:{})}}><div style={{fontSize:12,fontWeight:700}}>仕切弁筐</div></button></div></div>
    {pipeType!=="SHIKIRI"&&<>
      <div style={S.c}><div style={S.ch}>道路種別</div><div style={{display:"flex",gap:8}}>
        {ROADS.map(r=>(<button key={r.key} onClick={()=>selRoad(r.key)} style={{...S.rb,...(roadType===r.key?S.rbOn:{})}}><span style={{fontSize:22,fontWeight:700}}>{r.label}</span><span style={{fontSize:12,opacity:.7}}>D={r.D}</span></button>))}</div></div>
      <div style={S.c}><div style={S.ch}>路面</div><div style={{display:"flex",gap:8}}>
        {SURFACES.map(sf=>(<button key={sf.key} onClick={()=>selSurface(sf.key)} style={{...S.sfb,...(surfaceType===sf.key?S.sfbOn:{})}}><span style={{fontSize:16,fontWeight:700}}>{sf.label}</span><span style={{fontSize:11,opacity:.6}}>{sf.key==="asphalt"?"舗装あり":"舗装なし"}</span></button>))}</div></div>
      <div style={S.c}><div style={S.ch}>口径</div><div style={{display:"flex",flexWrap:"wrap",gap:6}}>
        {dias.map(d=>(<button key={d} onClick={()=>setHeader(h=>({...h,diameter:d}))} style={{...S.db,...(dia===d?S.dbOn:{})}}><div style={{fontSize:15,fontWeight:700}}>φ{d}</div><div style={{fontSize:10,opacity:.6}}>OD {getOD(pipeType,d)}</div></button>))}</div></div>
    </>}
    <div style={S.c}><div style={S.ch}>工事情報</div>
      {[["projectName","工事名"],["location","工事箇所"]].map(([k,l])=>(<div key={k} style={{marginBottom:8}}><label style={S.lb}>{l}</label><input style={S.inp} value={header[k]} onChange={e=>setHeader(h=>({...h,[k]:e.target.value}))} placeholder={l}/></div>))}</div>
    <button style={S.pri} onClick={()=>setScreen("design")}>設計値確認 →</button></div>);}

  // ═══ DESIGN ═══
  if(screen==="design"){return(<div style={S.w}>
    <div style={S.top}><button style={S.bk} onClick={()=>setScreen("setup")}>← 設定</button><span style={S.bg}>2/3 設計値</span></div>
    <div style={S.c}><div style={S.ch}>手入力</div>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><div style={{flex:1,fontSize:14,fontWeight:600}}>床付幅 B</div>
        <input type="number" inputMode="decimal" style={{...S.ni,width:100}} value={design.B??""} placeholder="mm" onChange={e=>setDesign(d=>({...d,B:e.target.value}))}/></div>
      {surfaceType==="asphalt"&&<div style={{display:"flex",alignItems:"center",gap:8}}><div style={{flex:1,fontSize:14,fontWeight:600}}>舗装幅 Ba</div>
        <input type="number" inputMode="decimal" style={{...S.ni,width:100}} value={design.Ba??""} placeholder="mm" onChange={e=>setDesign(d=>({...d,Ba:e.target.value}))}/></div>}</div>
    <div style={S.c}><div style={S.ch}>各層の設計厚</div>
      {steps.map(s=>{if(!s.tKey)return null;return(<div key={s.id} style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
        <span style={S.sd}>{s.id}</span><div style={{flex:1}}><span style={{fontSize:13,fontWeight:600}}>{s.tKey}</span><span style={{fontSize:11,color:"#888",marginLeft:4}}>{s.name}</span></div>
        <input type="number" inputMode="decimal" style={{...S.ni,width:70}} value={design[s.tKey]??""} placeholder="mm" onChange={e=>setDesign(d=>({...d,[s.tKey]:e.target.value}))}/></div>);})}
    </div>
    <div style={S.c}><div style={S.ch}>各工程の設計H</div>
      {steps.map(s=>{if(!s.inputs.includes("H"))return null;return(<div key={s.id} style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
        <span style={S.sd}>{s.id}</span><span style={{flex:1,fontSize:13}}>{s.name}</span>
        <span style={{fontSize:14,fontWeight:700,color:s.id===1?"#E65100":"#1565C0"}}>H={calcDesignH(s.id)}</span></div>);})}
    </div>
    <button style={S.pri} onClick={()=>{if(!points.length)setScreen("bulk");else setScreen("list");}}>{!points.length?"測点作成 →":"現場入力 →"}</button></div>);}

  // ═══ BULK ═══
  if(screen==="bulk"){return(<div style={S.w}>
    <div style={S.top}><button style={S.bk} onClick={()=>setScreen("design")}>← 設計値</button><span style={S.bg}>測点作成</span></div>
    <div style={S.c}><div style={{display:"flex",alignItems:"center",gap:12,justifyContent:"center",marginBottom:16}}>
      <button style={S.cb} onClick={()=>setBulkCount(c=>Math.max(1,c-1))}>−</button>
      <div style={{fontSize:36,fontWeight:700,width:60,textAlign:"center"}}>{bulkCount}</div>
      <button style={S.cb} onClick={()=>setBulkCount(c=>Math.min(20,c+1))}>+</button></div></div>
    <button style={S.pri} onClick={()=>{bulkCreate();setScreen("list");}}>No.1〜No.{bulkCount} を作成</button></div>);}

  // ═══ ENTRY ═══
  if(screen==="entry"){return(<div style={S.w}>
    <input ref={fileRef} type="file" accept="image/*" capture="environment" style={{display:"none"}} onChange={onPhotoTaken}/>
    <div style={S.top}><button style={S.bk} onClick={()=>setScreen("list")}>← 戻る</button><span style={S.bg}>{cur.name}</span></div>
    <div style={S.c}><div style={{display:"flex",gap:8}}>
      <div style={{flex:1}}><label style={S.lb}>測点</label><input style={{...S.inp,fontWeight:700,fontSize:18}} value={cur.name} onChange={e=>setCur(p=>({...p,name:e.target.value}))}/></div>
      <div style={{flex:1}}><label style={S.lb}>日付</label><input type="date" style={S.inp} value={cur.date} onChange={e=>setCur(p=>({...p,date:e.target.value}))}/></div></div></div>
    {steps.map(step=>{
      const tM=step.tKey?calcT(step,cur.measured):null;const tD=step.tKey&&design[step.tKey]?Number(design[step.tKey]):null;
      const tErr=tM!==null&&tD!==null?tM-tD:null;const tJ=tErr!==null?judge(tErr,step.tKey):null;
      const photos=(cur.photos&&cur.photos[step.id])||[];
      return(<div key={step.id} style={S.c}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
          <span style={S.sn}>{step.id}</span><span style={{fontSize:14,fontWeight:600,flex:1}}>{step.name}</span>
          <button onClick={()=>takePhoto(step.id)} style={S.camBtn}>📷{photos.length>0?` ${photos.length}`:""}</button></div>
        {step.inputs.map(f=>{
          const d=dv(f,step.id);const key=`${step.id}_${f}`;const mv=cur.measured[key]??"";
          const err=d!==null&&mv!==""?Number(mv)-Number(d):null;const j=err!==null?judge(err,f):null;
          return(<div key={f} style={S.er}>
            <div style={{flex:1.2}}><span style={{fontSize:16,fontWeight:700}}>{f}</span><div style={{fontSize:12,color:"#1565C0",fontWeight:600}}>{d!==null?Math.round(d):"—"}<span style={{fontSize:10,color:"#999",marginLeft:4}}>({crit(f)})</span></div></div>
            <div style={{flex:1.3}}><input type="number" inputMode="decimal" style={S.mi} value={mv} placeholder="実測" onChange={e=>setCur(p=>({...p,measured:{...p.measured,[key]:e.target.value}}))}/></div>
            <div style={{width:48,textAlign:"center",fontSize:14,fontWeight:700,color:err!==null?j==="×"?"#C62828":"inherit":"#ccc"}}>{err!==null?(err>0?`+${err}`:err):"—"}</div>
            <div style={{width:28,textAlign:"center",fontSize:20,fontWeight:800,color:j==="○"?"#2E7D32":j==="×"?"#C62828":"#ddd"}}>{j??"·"}</div></div>);})}
        {step.tKey&&(<div style={{marginTop:6,padding:"8px 10px",borderRadius:8,background:tJ==="○"?"#E8F5E9":tJ==="×"?"#FFEBEE":"#f5f5f5",display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
          <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:tJ==="○"?"#2E7D32":tJ==="×"?"#C62828":"#888"}}>{step.tKey}={tM!==null?`${tM}mm`:"—"}</div>
            <div style={{fontSize:11,color:"#999"}}>{prevLbl(step)} / 設計:{tD??"-"}mm</div></div>
          {tErr!==null&&<div style={{fontSize:13,fontWeight:700,color:tJ==="○"?"#2E7D32":"#C62828"}}>{tErr>0?`+${tErr}`:tErr} {tJ}</div>}</div>)}
        {step.extra.map(ex=>{const key=`${step.id}_${ex.key}`;const mv=cur.measured[key]??"";const err=mv!==""?Number(mv)-ex.design:null;const j=err!==null?judge(err,ex.key,ex):null;
          return(<div key={ex.key} style={{marginTop:6,padding:"8px 10px",borderRadius:8,border:"1px dashed #1565C0",display:"flex",alignItems:"center",gap:6}}>
            <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:"#1565C0"}}>{ex.key} {ex.label}</div><div style={{fontSize:11,color:"#888"}}>設計:{ex.design}mm</div></div>
            <input type="number" inputMode="decimal" style={{...S.mi,width:90}} value={mv} placeholder="実測" onChange={e=>setCur(p=>({...p,measured:{...p.measured,[key]:e.target.value}}))}/> 
            <div style={{width:48,textAlign:"center",fontSize:14,fontWeight:700,color:err!==null?j==="×"?"#C62828":"inherit":"#ccc"}}>{err!==null?(err>0?`+${err}`:err):"—"}</div>
            <div style={{width:28,textAlign:"center",fontSize:18,fontWeight:800,color:j==="○"?"#2E7D32":j==="×"?"#C62828":"#ddd"}}>{j??"·"}</div></div>);})}
        {photos.length>0&&(<div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap"}}>
          {photos.map((ph,pi)=>(<div key={pi} style={{position:"relative"}}>
            <img src={ph.data} onClick={()=>setViewPhoto(ph.data)} style={{width:64,height:64,objectFit:"cover",borderRadius:8,border:"1px solid #ddd",cursor:"pointer"}}/>
            <button onClick={()=>delPhoto(step.id,pi)} style={{position:"absolute",top:-6,right:-6,width:20,height:20,borderRadius:10,background:"#C62828",color:"#fff",border:"none",fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>×</button></div>))}</div>)}
      </div>);})}
    <button style={S.pri} onClick={savePoint}>更新 ✓</button>
    {viewPhoto&&(<div onClick={()=>setViewPhoto(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <img src={viewPhoto} style={{maxWidth:"100%",maxHeight:"90vh",borderRadius:12}}/></div>)}
  </div>);}

  // ═══ LIST ═══
  return(<div style={S.w}>
    <div style={S.top}><button style={S.bk} onClick={()=>setScreen("design")}>← 設計値</button>
      <h1 style={{fontSize:16,fontWeight:700,margin:0}}>{header.projectName||"出来形管理"}</h1></div>
    <div style={{display:"flex",gap:6,fontSize:11,color:"#888",padding:"0 4px",marginBottom:10,flexWrap:"wrap"}}>
      <span>{PL[pipeType]}</span><span>φ{dia}</span><span>{road.label}</span><span>{steps.length}工程</span></div>
    {points.length===0?(<div style={{textAlign:"center",padding:"40px 16px",color:"#888"}}>
      <div style={{fontSize:40,marginBottom:8}}>📐</div>
      <button style={{...S.pri,marginTop:16}} onClick={()=>setScreen("bulk")}>測点を一括作成</button></div>):(
    <>{points.map((pt,idx)=>{
      let total=0,ok=0,ng=0;
      steps.forEach(step=>{step.inputs.forEach(f=>{total++;const d=dv(f,step.id);const key=`${step.id}_${f}`;const mv=pt.measured[key];
        if(d!==null&&mv&&mv!==""){const j=judge(Number(mv)-Number(d),f);if(j==="○")ok++;if(j==="×")ng++;}});
        if(step.tKey){total++;const tM=calcT(step,pt.measured);const tD=design[step.tKey]?Number(design[step.tKey]):null;if(tM!==null&&tD!==null){const j=judge(tM-tD,step.tKey);if(j==="○")ok++;if(j==="×")ng++;}}
        step.extra.forEach(ex=>{total++;const key=`${step.id}_${ex.key}`;const mv=pt.measured[key];if(mv&&mv!==""){const j=judge(Number(mv)-ex.design,ex.key,ex);if(j==="○")ok++;if(j==="×")ng++;}});});
      const fl=ok+ng;const pc=totalPhotos(pt);
      return(<div key={idx} style={{...S.pc,borderLeft:fl===0?"3px solid #ddd":ng>0?"3px solid #C62828":"3px solid #2E7D32"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:16,fontWeight:700}}>{pt.name}</span><span style={{fontSize:11,color:"#999"}}>{pt.date}</span>
            {pc>0&&<span style={{fontSize:11,color:"#1565C0"}}>📷{pc}</span>}</div>
          <button style={{...S.sm,fontSize:14,fontWeight:700}} onClick={()=>editPoint(idx)}>入力→</button></div></div>);})}
    <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:12}}>
      <button style={{...S.pri,background:"#fff",color:"#1565C0",border:"2px solid #1565C0"}} onClick={()=>setPoints(p=>[...p,{name:`No.${p.length+1}`,date:"",measured:{},photos:{}}])}>+ 測点追加</button>
      <button style={S.exp} onClick={handlePDF}>PDF出力（表紙+各工程）</button>
      <button style={{...S.exp,background:"#E3F2FD",color:"#1565C0",border:"1px solid #90CAF9"}} onClick={()=>{
        let csv="\uFEFF";csv+=`工事名,${header.projectName}\n\n`;csv+=`測点,工程,項目,設計,実測,誤差,判定,日付\n`;
        points.forEach(pt=>{steps.forEach(step=>{step.inputs.forEach(f=>{const d=dv(f,step.id);const key=`${step.id}_${f}`;const mv=pt.measured[key]??"";const err=d!==null&&mv!==""?Number(mv)-Number(d):"";const j=err!==""?judge(err,f):"";
          csv+=`${pt.name},${step.name},${f},${d!==null?Math.round(d):""},${mv},${err},${j},${pt.date}\n`;});});});
        const blob=new Blob([csv],{type:"text/csv;charset=utf-8;"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`出来形_${header.projectName||"data"}.csv`;a.click();
        setToast("CSV出力完了");setTimeout(()=>setToast(""),3000);
      }}>CSV出力</button>
    </div></>)}
    {toast&&<div style={S.to}>{toast}</div>}</div>);
}

const S={
  w:{maxWidth:540,margin:"0 auto",padding:"8px 0",fontFamily:'"Helvetica Neue","Hiragino Sans",sans-serif',color:"var(--color-text-primary,#1a1a1a)"},
  top:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,padding:"0 4px"},
  logo:{fontSize:20,fontWeight:700,margin:0},bg:{fontSize:11,fontWeight:600,background:"#E3F2FD",color:"#1565C0",padding:"3px 10px",borderRadius:20},
  c:{background:"var(--color-background-secondary,#fafafa)",border:"0.5px solid var(--color-border-tertiary,#e0e0e0)",borderRadius:12,padding:14,marginBottom:10},
  ch:{fontSize:14,fontWeight:600,marginBottom:10},lb:{display:"block",fontSize:12,fontWeight:500,color:"#666",marginBottom:3},
  inp:{width:"100%",padding:"10px 12px",fontSize:15,border:"1px solid #ddd",borderRadius:8,background:"#fff",color:"inherit",boxSizing:"border-box",outline:"none"},
  ni:{padding:"8px 6px",fontSize:15,border:"2px solid #FFB300",borderRadius:8,textAlign:"center",background:"#FFFDE7",color:"inherit",boxSizing:"border-box",outline:"none"},
  mi:{width:"100%",padding:"10px 8px",fontSize:17,fontWeight:600,border:"2px solid #FFB300",borderRadius:8,textAlign:"center",background:"#FFFDE7",color:"inherit",boxSizing:"border-box",outline:"none"},
  sel:{padding:"10px",border:"1.5px solid #ddd",borderRadius:10,background:"#fff",cursor:"pointer",textAlign:"center"},selOn:{borderColor:"#1565C0",background:"#E3F2FD"},
  rb:{flex:1,padding:"14px 12px",border:"2px solid #ddd",borderRadius:12,background:"#fff",cursor:"pointer",textAlign:"center",display:"flex",flexDirection:"column",gap:4,alignItems:"center"},rbOn:{borderColor:"#1565C0",background:"#E3F2FD",color:"#1565C0"},
  sfb:{flex:1,padding:"12px",border:"2px solid #ddd",borderRadius:12,background:"#fff",cursor:"pointer",textAlign:"center",display:"flex",flexDirection:"column",gap:2,alignItems:"center"},sfbOn:{borderColor:"#E65100",background:"#FFF3E0",color:"#E65100"},
  db:{padding:"8px 14px",border:"1.5px solid #ddd",borderRadius:10,background:"#fff",cursor:"pointer",textAlign:"center"},dbOn:{borderColor:"#1565C0",background:"#E3F2FD",color:"#1565C0"},
  sn:{width:22,height:22,borderRadius:11,background:"#1565C0",color:"#fff",fontSize:12,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},
  sd:{width:20,height:20,borderRadius:10,background:"#ddd",color:"#666",fontSize:11,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},
  er:{display:"flex",alignItems:"center",padding:"8px 0",borderBottom:"0.5px solid #eee",gap:4},
  pri:{width:"100%",padding:"14px",fontSize:16,fontWeight:700,background:"#1565C0",color:"#fff",border:"none",borderRadius:12,cursor:"pointer"},
  exp:{width:"100%",padding:"12px",fontSize:14,fontWeight:600,background:"#E8F5E9",color:"#2E7D32",border:"1px solid #A5D6A7",borderRadius:12,cursor:"pointer"},
  bk:{background:"none",border:"none",fontSize:14,color:"#1565C0",cursor:"pointer",fontWeight:500,padding:"4px 0"},
  pc:{background:"#fafafa",border:"0.5px solid #e0e0e0",borderRadius:10,padding:"10px 12px",marginBottom:6},
  sm:{background:"none",border:"none",fontSize:13,color:"#1565C0",cursor:"pointer",fontWeight:500},
  cb:{width:44,height:44,borderRadius:22,border:"2px solid #1565C0",background:"#fff",color:"#1565C0",fontSize:22,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"},
  to:{position:"fixed",bottom:20,left:"50%",transform:"translateX(-50%)",background:"#333",color:"#fff",padding:"10px 24px",borderRadius:8,fontSize:14,fontWeight:500,zIndex:999},
  camBtn:{padding:"6px 12px",border:"1.5px solid #1565C0",borderRadius:8,background:"#E3F2FD",color:"#1565C0",fontSize:13,fontWeight:600,cursor:"pointer",flexShrink:0},
};
