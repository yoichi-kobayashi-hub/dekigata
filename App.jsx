import { useState, useRef, useEffect, useCallback } from "react";

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
// PDF出力（印刷ベース）
// ═══════════════════════════════════════
function generatePDF({header,pipeType,roadType,surfaceType,design,points,steps,dia,od,D,H0}){
  const allItems=["B","Ba","H","t1","t2","t3","t4","t5","t6","ta","D","Hs","Dm"];
  const road=ROADS.find(r=>r.key===roadType);
  const designVals={};
  allItems.forEach(it=>{
    if(it==="H")designVals[it]=H0;else if(it==="D")designVals[it]=D;
    else if(it==="B")designVals[it]=design.B?Number(design.B):null;
    else if(it==="Ba")designVals[it]=design.Ba?Number(design.Ba):null;
    else if(it==="ta")designVals[it]=Number(design.ta)||40;
    else if(it==="Hs")designVals[it]=300;else if(it==="Dm")designVals[it]=700;
    else designVals[it]=design[it]?Number(design[it]):null;
  });
  const judgeItem=(it,mv)=>{if(mv===null||designVals[it]===null)return"";const err=mv-designVals[it];const meta=FM[it];if(!meta)return"";if(meta.minus!==null&&err<-meta.minus)return"×";if(meta.plus!==null&&err>meta.plus)return"×";return"○";};
  const getMeasured=(pt,it)=>{for(const s of steps){const k=`${s.id}_${it}`;if(pt.measured[k]!==undefined&&pt.measured[k]!=="")return Number(pt.measured[k]);for(const ex of s.extra){if(ex.key===it){const ek=`${s.id}_${it}`;if(pt.measured[ek]!==undefined&&pt.measured[ek]!=="")return Number(pt.measured[ek]);}}}return null;};

  const css=`*{margin:0;padding:0;box-sizing:border-box}
html,body{margin:0;padding:0}
body{font-family:"Hiragino Sans","MS Gothic",sans-serif;font-size:12px;color:#000;line-height:1.3}
@media print{@page{size:A4 portrait;margin:6mm}body{margin:0}
svg{display:block}
.mid-l svg{height:auto !important;max-height:97mm !important}
.step-photo img{width:100% !important;height:100% !important;object-fit:cover !important}
.page,.step-page{transform:scale(0.97);transform-origin:top left;width:103.1%}}
.page{page-break-after:always;width:100%;display:flex;flex-direction:column;height:270mm;overflow:hidden}
table{border-collapse:collapse;width:100%}
td,th{border:0.5px solid #333;padding:3px 5px;font-size:12px;vertical-align:middle}
.lbl{background:#f5f5f0;text-align:center;font-weight:bold;font-size:11px;color:#333}
.title{font-size:20px;font-weight:bold;text-align:center;letter-spacing:6px;padding:4px 0 6px}
.seal{text-align:center;font-size:9px;color:#666;width:48px}
.seal-box{height:28px}
.mid{display:grid;grid-template-columns:58% 42%;border:0.5px solid #333;height:105mm}
.mid-l{border-right:0.5px solid #333;padding:3mm;text-align:center;display:flex;flex-direction:column;align-items:stretch;justify-content:stretch;overflow:hidden}
.mid-l svg{width:100%;height:100%;display:block;flex:1;max-height:100mm}
.mid-r{padding:6px;font-size:11px;overflow:hidden}
.mid-r table td{font-size:11px;padding:3px 5px}
.chk{border:0.5px solid #333;padding:5px 8px;font-size:11px;color:#333;margin-top:-0.5px}
.dt{flex:1;overflow:hidden}
.dt td,.dt th{font-size:12px;text-align:center;padding:4px 3px;height:auto}
.dt th{background:#f5f5f0;font-size:11px;padding:4px 3px}
.dt .no{font-weight:bold;background:#fafaf5;font-size:13px}
.dt .itm{text-align:left;padding-left:8px;color:#333;font-weight:bold;font-size:13px}
.dt .sep{border-left:1.5px solid #000}
.ok{color:#006633;font-weight:bold;font-size:15px}
.ng{color:#cc0000;font-weight:bold;font-size:15px}
.note{font-size:10px;color:#666;padding:2px 0}
.step-page{page-break-after:always;display:flex;flex-direction:column;height:270mm;overflow:hidden}
.step-hdr{font-size:14px;font-weight:bold;margin-bottom:3mm;display:flex;justify-content:space-between;padding-bottom:2mm;border-bottom:1px solid #333;flex-shrink:0}
.step-card{border:0.5px solid #333;margin-bottom:2mm;padding:2.5mm;display:grid;grid-template-columns:1.8fr 1fr;grid-template-rows:1fr auto;gap:2.5mm;flex:1;overflow:hidden;min-height:0}
.step-photo{grid-row:1/3;border:1px solid #ccc;display:flex;align-items:center;justify-content:center;font-size:12px;color:#999;background:#fafafa;overflow:hidden;position:relative}
.step-photo img{width:100%;height:100%;object-fit:cover;display:block}
.step-mz{border:0.5px solid #ddd;padding:3px;display:flex;align-items:stretch;justify-content:stretch;background:#fafafa;overflow:hidden}
.step-mz svg{width:100%;height:100%;display:block;flex:1}
.step-info{font-size:11px;display:flex;flex-direction:column;overflow:hidden}
.step-info table td{font-size:11px;padding:2px 4px}
.step-info table th{font-size:10px;padding:2px 4px}
.step-title{font-weight:bold;font-size:12px;margin-bottom:2mm;padding-bottom:1mm;border-bottom:1px solid #ddd}
.ftr{font-size:10px;color:#666;display:flex;justify-content:space-between;margin-top:2mm;padding-top:2mm;border-top:0.5px solid #ccc;flex-shrink:0}`;

  let html=`<html><head><meta charset="utf-8"><title>出来形_${header.projectName||""}</title><style>${css}</style></head><body>`;

  const coverPages=Math.ceil(points.length/2);
  for(let p=0;p<coverPages;p++){
    const ptL=points[p*2];const ptR=points[p*2+1]||null;
    html+=`<div class="page"><div class="title">検 査 記 録 表</div>`;
    html+=`<table><tr><td class="lbl" style="width:60px">工 事 名</td><td colspan="4">${header.projectName||""}</td>`;
    html+=`<td class="seal">総括監督員<div class="seal-box"></div></td><td class="seal">主任監督員<div class="seal-box"></div></td><td class="seal">監督員<div class="seal-box"></div></td></tr>`;
    html+=`<tr><td class="lbl">工事箇所</td><td colspan="7">${header.location||""}</td></tr>`;
    html+=`<tr><td class="lbl">工　　種</td><td colspan="7">配管工</td></tr>`;
    html+=`<tr><td class="lbl">種　　別</td><td colspan="4">${PL[pipeType]} φ${dia}</td><td class="lbl" style="font-size:6px">主任技術者</td><td colspan="2"></td></tr></table>`;

    // SVG豆図生成
    const ls=pipeType==="HPPE"
      ?[{k:"ta",t:40,n:"AS"},{k:"t6",t:Number(design.t6)||150,n:"路盤(RC40-0)"},{k:"t5",t:Number(design.t5)||150,n:"路盤(RC40-0)"},{k:"t4",t:Number(design.t4)||160,n:"発生土埋戻"},{k:"t3",t:Number(design.t3)||200,n:"発生土埋戻"},{k:"t2",t:Number(design.t2)||200,n:"発生土埋戻"},{k:"t1",t:Number(design.t1)||100,n:"保護砂"},{k:"pipe",t:od,n:""},{k:"t0",t:Number(design.t0)||100,n:"基礎砂"}]
      :[{k:"ta",t:40,n:"AS"},{k:"t6",t:Number(design.t6)||150,n:"路盤(RC40-0)"},{k:"t5",t:Number(design.t5)||150,n:"路盤(RC40-0)"},{k:"t4",t:Number(design.t4)||160,n:"発生土埋戻"},{k:"t3",t:Number(design.t3)||200,n:"発生土埋戻"},{k:"t2",t:Number(design.t2)||200,n:"発生土埋戻"},{k:"t1",t:Number(design.t1)||100,n:"保護砂"},{k:"pipe",t:od,n:""}];
    const totalT=ls.reduce((s,l)=>s+l.t,0);
    const svgW=260,svgH=280,mzW=160,mzH=210,mzX=50,mzY=20;
    let mzSvg=`<svg viewBox="0 0 ${svgW} ${svgH}" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">`;
    mzSvg+=`<rect x="${mzX}" y="${mzY}" width="${mzW}" height="${mzH}" fill="none" stroke="#333" stroke-width="0.8"/>`;
    let yy=mzY,pipeY=0,pipeLh=0,bt23=0;
    ls.forEach(l=>{
      const lh=mzH*(l.t/totalT);
      mzSvg+=`<rect x="${mzX}" y="${yy}" width="${mzW}" height="${lh}" fill="none" stroke="#bbb" stroke-width="0.3"/>`;
      if(l.k==="pipe"){pipeY=yy;pipeLh=lh;}
      else if(lh>6){mzSvg+=`<text x="${mzX+mzW/2}" y="${yy+lh/2+3}" text-anchor="middle" fill="#333" font-size="11" font-family="sans-serif">${l.n}</text>`;mzSvg+=`<text x="${mzX+5}" y="${yy+lh/2+3}" fill="#888" font-size="10" font-weight="bold" font-family="sans-serif">${l.k}</text>`;}
      if(l.k==="t3")bt23=yy+lh;
      yy+=lh;
    });
    const pr=pipeLh/2,pcx=mzX+mzW/2,pcy=pipeY+pipeLh/2;
    mzSvg+=`<circle cx="${pcx}" cy="${pcy}" r="${pr}" fill="none" stroke="#333" stroke-width="0.8"/>`;
    mzSvg+=`<text x="${pcx}" y="${pcy+3}" text-anchor="middle" fill="#555" font-size="11" font-weight="bold" font-family="sans-serif">φ${dia}</text>`;
    mzSvg+=`<line x1="${pcx-pr}" y1="${bt23}" x2="${pcx+pr}" y2="${bt23}" stroke="#1565C0" stroke-width="1.2"/>`;
    let zp=`M ${pcx-pr} ${bt23+1}`;
    for(let zi=0;zi<Math.floor(pr*2/3);zi++){const zx=(pcx-pr)+zi*3;zp+=` L ${zx+1.5} ${bt23+3} L ${zx+3} ${bt23+1}`;}
    mzSvg+=`<path d="${zp}" fill="none" stroke="#1565C0" stroke-width="0.4"/>`;
    mzSvg+=`<line x1="${pcx}" y1="${bt23-9}" x2="${pcx}" y2="${bt23+7}" stroke="#1565C0" stroke-width="1.2"/>`;
    mzSvg+=`<line x1="${pcx-4}" y1="${bt23-9}" x2="${pcx+4}" y2="${bt23-9}" stroke="#1565C0" stroke-width="1.5"/>`;
    mzSvg+=`<text x="${pcx}" y="${mzY-6}" text-anchor="middle" fill="#333" font-size="14" font-weight="bold" font-family="sans-serif">Ba</text>`;
    mzSvg+=`<text x="${pcx}" y="${mzY+mzH+14}" text-anchor="middle" fill="#333" font-size="14" font-weight="bold" font-family="sans-serif">B</text>`;
    const rx1=mzX+mzW+6,rx2=rx1+18,rx3=rx2+18,hsY=mzY+mzH*(700/totalT);
    const dm=(x,y1,y2,lb,c)=>{mzSvg+=`<line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" stroke="${c}" stroke-width="0.5"/>`;mzSvg+=`<line x1="${x-3}" y1="${y1}" x2="${x+3}" y2="${y1}" stroke="${c}" stroke-width="0.5"/>`;mzSvg+=`<line x1="${x-3}" y1="${y2}" x2="${x+3}" y2="${y2}" stroke="${c}" stroke-width="0.5"/>`;mzSvg+=`<text x="${x+2}" y="${(y1+y2)/2+4}" text-anchor="middle" fill="${c}" font-size="12" font-weight="bold" font-family="sans-serif">${lb}</text>`;};
    dm(rx1,pipeY,hsY,"Hs","#E65100");
    dm(rx2,mzY,hsY,"Dm","#1565C0");
    dm(rx3,mzY,pipeY,"D","#333");
    dm(rx3+18,mzY,mzY+mzH,"H","#000");
    const lx=mzX-10;
    const dmL=(y1,y2,lb)=>{mzSvg+=`<line x1="${lx}" y1="${y1}" x2="${lx}" y2="${y2}" stroke="#555" stroke-width="0.4"/>`;mzSvg+=`<line x1="${lx-3}" y1="${y1}" x2="${lx+3}" y2="${y1}" stroke="#555" stroke-width="0.4"/>`;mzSvg+=`<line x1="${lx-3}" y1="${y2}" x2="${lx+3}" y2="${y2}" stroke="#555" stroke-width="0.4"/>`;mzSvg+=`<text x="${lx-3}" y="${(y1+y2)/2+4}" text-anchor="end" fill="#555" font-size="11" font-weight="bold" font-family="sans-serif">${lb}</text>`;};
    const taH=mzH*(40/totalT);
    dmL(mzY,mzY+taH,"40");
    const gH=mzH*(300/totalT);
    dmL(mzY+taH,mzY+taH+gH,"300");
    const sH=mzH*(660/totalT);
    dmL(mzY+taH+gH,mzY+taH+gH+sH,"660");
    mzSvg+=`</svg>`;
    html+=`<div class="mid"><div class="mid-l"><div style="font-size:7px;color:#666;margin-bottom:2px">検測位置図</div>${mzSvg}</div>`;

    html+=`<div class="mid-r"><div style="font-weight:bold;text-align:center;margin-bottom:2px">管理基準</div>`;
    html+=`<table><tr><th>項目</th><th style="width:25px">-mm</th><th style="width:25px">+mm</th></tr>`;
    html+=`<tr><td>床付幅B</td><td>-50</td><td></td></tr><tr><td>舗装幅Ba</td><td>-25</td><td></td></tr>`;
    html+=`<tr><td>掘削深H</td><td>-30</td><td>30</td></tr><tr><td>埋戻厚tn</td><td>-30</td><td>30</td></tr>`;
    html+=`<tr><td>舗装厚ta</td><td>-7</td><td></td></tr><tr><td>埋設深D</td><td>-30</td><td>30</td></tr>`;
    html+=`<tr><td>Hs※1</td><td>-30</td><td>30</td></tr><tr><td>Dm※2</td><td>-30</td><td>30</td></tr></table>`;
    html+=`<div class="note">※1 埋設シート位置 管上0.3m</div><div class="note">※2 マーカー位置 DP=0.70m</div></div></div>`;

    html+=`<div class="chk">検測区分（いずれかに○）・段階確認　・出来形管理（段階確認以外）　・その他（　　　）</div>`;

    html+=`<table class="dt"><tr><th>測点</th><th>設計</th><th>検測</th><th>誤差</th><th>日付</th><th>判定</th>`;
    html+=`<th class="sep">測点</th><th>設計</th><th>検測</th><th>誤差</th><th>日付</th><th>判定</th></tr>`;
    html+=`<tr><td class="no">${ptL.name}</td><td colspan="5"></td>`;
    html+=ptR?`<td class="no sep">${ptR.name}</td><td colspan="5"></td>`:`<td class="sep" colspan="6"></td>`;
    html+=`</tr>`;
    allItems.forEach(it=>{
      const dv=designVals[it];if(dv===null)return;
      const mL=getMeasured(ptL,it);const eL=mL!==null?mL-dv:null;const jL=mL!==null?judgeItem(it,mL):"";
      html+=`<tr><td class="itm">${it}</td><td>${dv}</td><td>${mL!==null?mL:""}</td><td>${eL!==null?(eL>0?"+":"")+eL:""}</td><td>${ptL.date||""}</td><td class="${jL==="○"?"ok":jL==="×"?"ng":""}">${jL}</td>`;
      if(ptR){const mR=getMeasured(ptR,it);const eR=mR!==null?mR-dv:null;const jR=mR!==null?judgeItem(it,mR):"";
        html+=`<td class="itm sep">${it}</td><td>${dv}</td><td>${mR!==null?mR:""}</td><td>${eR!==null?(eR>0?"+":"")+eR:""}</td><td>${ptR.date||""}</td><td class="${jR==="○"?"ok":jR==="×"?"ng":""}">${jR}</td>`;
      }else html+=`<td class="sep" colspan="6"></td>`;
      html+=`</tr>`;
    });
    html+=`</table><div class="ftr"><span>有限会社信濃住宅設備</span><span>${p+1} / ${coverPages}</span></div></div>`;
  }

  // 工程別豆図生成
  const mkStepMz=(step,pt)=>{
    const ls=pipeType==="HPPE"
      ?[{k:"ta",t:40,n:"AS"},{k:"t6",t:Number(design.t6)||150,n:"路盤"},{k:"t5",t:Number(design.t5)||150,n:"路盤"},{k:"t4",t:Number(design.t4)||160,n:"発生土"},{k:"t3",t:Number(design.t3)||200,n:"発生土"},{k:"t2",t:Number(design.t2)||200,n:"発生土"},{k:"t1",t:Number(design.t1)||100,n:"保護砂"},{k:"pipe",t:od,n:""},{k:"t0",t:Number(design.t0)||100,n:"基礎砂"}]
      :[{k:"ta",t:40,n:"AS"},{k:"t6",t:Number(design.t6)||150,n:"路盤"},{k:"t5",t:Number(design.t5)||150,n:"路盤"},{k:"t4",t:Number(design.t4)||160,n:"発生土"},{k:"t3",t:Number(design.t3)||200,n:"発生土"},{k:"t2",t:Number(design.t2)||200,n:"発生土"},{k:"t1",t:Number(design.t1)||100,n:"保護砂"},{k:"pipe",t:od,n:""}];
    const tot=ls.reduce((s,l)=>s+l.t,0);
    const filled={};let ap=false;
    for(const s2 of steps){
      if(s2.id>step.id)break;
      if(s2.tKey)filled[s2.tKey]=true;
      if(s2.inputs.includes("D"))filled["pipe"]=true;
    }
    const hiKeys={};
    if(step.tKey)hiKeys[step.tKey]=true;
    if(step.inputs.includes("D"))hiKeys["pipe"]=true;
    if(step.id===1)hiKeys["_excav"]=true;
    const W=200,H=180,mx=24,my=12,mw=120,mh=150;
    let s=`<svg viewBox="0 0 ${W} ${H}" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" style="display:block">`;
    if(hiKeys["_excav"])s+=`<rect x="${mx-1}" y="${my-1}" width="${mw+2}" height="${mh+2}" fill="rgba(29,158,117,0.08)" stroke="#1D9E75" stroke-width="1" stroke-dasharray="3 2"/>`;
    s+=`<rect x="${mx}" y="${my}" width="${mw}" height="${mh}" fill="none" stroke="#333" stroke-width="0.6"/>`;
    let y=my,pipeY=0,pipeLh=0,bt23=0;
    const lyMap={};
    ls.forEach(l=>{
      const lh=mh*(l.t/tot);
      lyMap[l.k]={top:y,bot:y+lh,h:lh};
      const isHi=hiKeys[l.k];const isFill=filled[l.k];
      const fill=isHi?"#1565C0":isFill?"#E3F2FD":"none";
      s+=`<rect x="${mx}" y="${y}" width="${mw}" height="${lh}" fill="${fill}" stroke="#bbb" stroke-width="0.3"/>`;
      if(l.k==="pipe"){pipeY=y;pipeLh=lh;}
      else if(lh>4){
        const tc=isHi?"#fff":"#666";
        s+=`<text x="${mx+mw/2}" y="${y+lh/2+2}" text-anchor="middle" fill="${tc}" font-size="9" font-family="sans-serif">${l.n}</text>`;
        s+=`<text x="${mx+2}" y="${y+lh/2+2}" fill="${isHi?'#fff':'#999'}" font-size="9" font-family="sans-serif">${l.k}</text>`;
      }
      if(l.k==="t3")bt23=y+lh;
      y+=lh;
    });
    const pr=pipeLh/2,pcx=mx+mw/2,pcy=pipeY+pipeLh/2;
    const isHiP=hiKeys["pipe"];
    s+=`<circle cx="${pcx}" cy="${pcy}" r="${pr}" fill="${isHiP?'#1565C0':filled["pipe"]?'#E3F2FD':'none'}" stroke="#333" stroke-width="0.6"/>`;
    s+=`<text x="${pcx}" y="${pcy+2}" text-anchor="middle" fill="${isHiP?'#fff':'#555'}" font-size="9" font-family="sans-serif">φ${dia}</text>`;
    const blue="#1565C0";
    s+=`<line x1="${pcx-pr}" y1="${bt23}" x2="${pcx+pr}" y2="${bt23}" stroke="${blue}" stroke-width="1"/>`;
    let zp=`M ${pcx-pr} ${bt23+0.8}`;
    for(let zi=0;zi<Math.floor(pr*2/2.5);zi++){const zx=(pcx-pr)+zi*2.5;zp+=` L ${zx+1.25} ${bt23+2.5} L ${zx+2.5} ${bt23+0.8}`;}
    s+=`<path d="${zp}" fill="none" stroke="${blue}" stroke-width="0.3"/>`;
    s+=`<line x1="${pcx}" y1="${bt23-7}" x2="${pcx}" y2="${bt23+5}" stroke="${blue}" stroke-width="1"/>`;
    s+=`<line x1="${pcx-3}" y1="${bt23-7}" x2="${pcx+3}" y2="${bt23-7}" stroke="${blue}" stroke-width="1.2"/>`;
    // H寸法（左外、現工程の深さまで）
    const calcH=(sid)=>{if(sid===1)return tot;const bs=steps.find(s=>s.tKey==="t0");if(bs&&sid===bs.id)return tot-(Number(design.t0)||0);let h=D;let a=false;for(const x of steps){if(x.inputs.includes("D")){a=true;continue;}if(!a)continue;if(x.id>sid)break;if(x.tKey&&x.tKey!=="t0"&&design[x.tKey])h-=Number(design[x.tKey]);}return h;};
    const hVal=calcH(step.id);
    if(hVal>0){
      const hBot=my+mh*(hVal/tot);const hx=mx-5;
      s+=`<line x1="${hx}" y1="${my}" x2="${hx}" y2="${hBot}" stroke="#333" stroke-width="0.6"/>`;
      s+=`<path d="M${hx-2} ${my+3}L${hx} ${my}L${hx+2} ${my+3}" fill="none" stroke="#333" stroke-width="0.6"/>`;
      s+=`<path d="M${hx-2} ${hBot-3}L${hx} ${hBot}L${hx+2} ${hBot-3}" fill="none" stroke="#333" stroke-width="0.6"/>`;
      s+=`<text x="${hx-2}" y="${(my+hBot)/2+2}" text-anchor="end" fill="#333" font-size="13" font-weight="bold" font-family="sans-serif">H</text>`;
    }
    // t寸法（左外、現工程の層）
    if(step.tKey&&step.tKey!=="ta"){
      const tl=lyMap[step.tKey];
      if(tl){
        const tx=mx-16;
        s+=`<line x1="${tx}" y1="${tl.top}" x2="${tx}" y2="${tl.bot}" stroke="#C62828" stroke-width="0.6"/>`;
        s+=`<path d="M${tx-2} ${tl.top+3}L${tx} ${tl.top}L${tx+2} ${tl.top+3}" fill="none" stroke="#C62828" stroke-width="0.6"/>`;
        s+=`<path d="M${tx-2} ${tl.bot-3}L${tx} ${tl.bot}L${tx+2} ${tl.bot-3}" fill="none" stroke="#C62828" stroke-width="0.6"/>`;
        s+=`<text x="${tx-2}" y="${(tl.top+tl.bot)/2+2}" text-anchor="end" fill="#C62828" font-size="11" font-weight="bold" font-family="sans-serif">${step.tKey}</text>`;
      }
    }
    // ta左右（舗装工程）
    if(step.tKey==="ta"){
      const tl=lyMap["ta"];
      if(tl){
        const txL=mx+mw*0.25,txR=mx+mw*0.75;
        [[txL,"ta(左)"],[txR,"ta(右)"]].forEach(([tx,lb])=>{
          s+=`<line x1="${tx}" y1="${tl.top}" x2="${tx}" y2="${tl.bot}" stroke="#E65100" stroke-width="0.6"/>`;
          s+=`<text x="${tx}" y="${tl.top-2}" text-anchor="middle" fill="#E65100" font-size="9" font-weight="bold" font-family="sans-serif">${lb}</text>`;
        });
      }
    }
    // extra (Hs/Dm) 表示
    step.extra.forEach(ex=>{
      const hsY=my+mh*(700/tot);
      if(ex.key==="Hs"){
        const ex1=mx+mw+3;
        s+=`<line x1="${ex1}" y1="${pipeY}" x2="${ex1}" y2="${hsY}" stroke="#E65100" stroke-width="0.6"/>`;
        s+=`<text x="${ex1+1}" y="${(pipeY+hsY)/2+2}" fill="#E65100" font-size="11" font-weight="bold" font-family="sans-serif">Hs</text>`;
      }
      if(ex.key==="Dm"){
        const ex2=mx+mw+15;
        s+=`<line x1="${ex2}" y1="${my}" x2="${ex2}" y2="${hsY}" stroke="${blue}" stroke-width="0.6"/>`;
        s+=`<text x="${ex2+1}" y="${(my+hsY)/2+2}" fill="${blue}" font-size="11" font-weight="bold" font-family="sans-serif">Dm</text>`;
      }
    });
    s+=`<text x="${pcx}" y="${my-3}" text-anchor="middle" fill="#666" font-size="10" font-family="sans-serif">Ba</text>`;
    s+=`<text x="${pcx}" y="${my+mh+8}" text-anchor="middle" fill="#666" font-size="10" font-family="sans-serif">B</text>`;
    s+=`</svg>`;
    return s;
  };

  const perPage=3;
  points.forEach(pt=>{
    for(let sIdx=0;sIdx<steps.length;sIdx+=perPage){
      html+=`<div class="step-page"><div class="step-hdr"><span>${pt.name} — 工程写真</span><span style="font-size:10px;color:#888">${PL[pipeType]} φ${dia} ${road.label}　${pt.date||""}</span></div>`;
      for(let i=0;i<perPage&&sIdx+i<steps.length;i++){
        const step=steps[sIdx+i];
        const stepPhotos=(pt.photos&&pt.photos[step.id])||[];
        const photoContent=stepPhotos.length>0
          ?`<img src="${stepPhotos[0].data}" alt="${pt.name} ${step.name}"/>`
          :`<span>写真未撮影（${pt.name} ${step.name}）</span>`;
        html+=`<div class="step-card"><div class="step-photo">${photoContent}</div><div class="step-mz">${mkStepMz(step,pt)}</div><div class="step-info">`;
        html+=`<div class="step-title">${step.id}. ${step.name}</div>`;
        html+=`<table><tr><th>項目</th><th>設計</th><th>実測</th><th>判定</th></tr>`;
        step.inputs.forEach(f=>{
          let dVal=null;
          if(f==="H"){let hh=D;let ap=false;for(const s2 of steps){if(s2.inputs.includes("D")){ap=true;continue;}if(!ap)continue;if(s2.id>step.id)break;if(s2.tKey&&s2.tKey!=="t0"&&design[s2.tKey])hh-=Number(design[s2.tKey]);}dVal=step.id===1?H0:Math.round(hh);}
          else if(f==="B")dVal=design.B?Number(design.B):null;
          else if(f==="Ba")dVal=design.Ba?Number(design.Ba):null;
          else if(f==="D")dVal=D;
          else if(f==="ta")dVal=Number(design.ta)||40;
          const key=`${step.id}_${f}`;const mv=pt.measured[key]??"";
          const err=dVal!==null&&mv!==""?Number(mv)-dVal:null;
          const j=err!==null?judge(err,f):null;
          html+=`<tr><td>${f}</td><td>${dVal!==null?dVal:""}</td><td>${mv}</td><td class="${j==="○"?"ok":j==="×"?"ng":""}">${j||""}</td></tr>`;
        });
        if(step.tKey){
          const tD=design[step.tKey]?Number(design[step.tKey]):null;
          html+=`<tr><td>${step.tKey}</td><td>${tD||""}</td><td></td><td></td></tr>`;
        }
        step.extra.forEach(ex=>{
          const key=`${step.id}_${ex.key}`;const mv=pt.measured[key]??"";
          const err=mv!==""?Number(mv)-ex.design:null;const j=err!==null?judge(err,ex.key,ex):null;
          html+=`<tr><td>${ex.key}</td><td>${ex.design}</td><td>${mv}</td><td class="${j==="○"?"ok":j==="×"?"ng":""}">${j||""}</td></tr>`;
        });
        html+=`</table></div></div>`;
      }
      html+=`<div class="ftr"><span>有限会社信濃住宅設備</span></div></div>`;
    }
  });

  html+=`</body></html>`;
  const w=window.open("","_blank");
  w.document.write(html);w.document.close();
  setTimeout(()=>{w.print();},500);
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
  const[bulkCount,setBulkCount]=useState(1);
  const[inited,setInited]=useState(false);
  const[viewPhoto,setViewPhoto]=useState(null);
  const[camStep,setCamStep]=useState(null);
  const fileRef=useRef(null);
  const[photoStep,setPhotoStep]=useState(null);
  const[projects,setProjects]=useState([]);
  const[currentProjId,setCurrentProjId]=useState(null);
  const[loaded,setLoaded]=useState(false);
  const[showProjList,setShowProjList]=useState(false);

  // 起動時: localStorage から全プロジェクト読み込み
  useEffect(()=>{
    try{
      const raw=localStorage.getItem("dekigata_projects");
      if(raw){const pj=JSON.parse(raw);setProjects(pj);}
      const cid=localStorage.getItem("dekigata_currentId");
      if(cid)setCurrentProjId(cid);
    }catch(e){console.warn("load err",e);}
    setLoaded(true);
  },[]);

  // 現在のプロジェクトが変わったら復元
  useEffect(()=>{
    if(!loaded||!currentProjId)return;
    const pj=projects.find(p=>p.id===currentProjId);
    if(pj){
      setPipeType(pj.pipeType||"DCIP");
      setRoadType(pj.roadType||"shidou");
      setSurfaceType(pj.surfaceType||"asphalt");
      setHeader(pj.header||{projectName:"",location:"",diameter:150});
      setDesign(pj.design||{});
      setPoints(pj.points||[]);
      setInited(true);
    }
  // eslint-disable-next-line
  },[currentProjId,loaded]);

  // 自動保存: 状態変化のたびに保存
  useEffect(()=>{
    if(!loaded||!inited||!currentProjId)return;
    const save={id:currentProjId,pipeType,roadType,surfaceType,header,design,points,updatedAt:new Date().toISOString()};
    setProjects(prev=>{
      const idx=prev.findIndex(p=>p.id===currentProjId);
      let next;
      if(idx<0)next=[...prev,save];
      else{next=[...prev];next[idx]=save;}
      try{localStorage.setItem("dekigata_projects",JSON.stringify(next));}catch(e){console.warn("save err",e);}
      return next;
    });
  // eslint-disable-next-line
  },[header,design,points,pipeType,roadType,surfaceType,loaded,inited,currentProjId]);

  // 初期プロジェクト作成 or 既存ロード
  useEffect(()=>{
    if(!loaded)return;
    if(currentProjId&&projects.find(p=>p.id===currentProjId))return;
    if(projects.length>0){
      // 最新のプロジェクトを自動選択
      const latest=[...projects].sort((a,b)=>(b.updatedAt||"").localeCompare(a.updatedAt||""))[0];
      setCurrentProjId(latest.id);
      localStorage.setItem("dekigata_currentId",latest.id);
    }else{
      // 新規作成
      const id="p_"+Date.now();
      setCurrentProjId(id);
      localStorage.setItem("dekigata_currentId",id);
    }
  // eslint-disable-next-line
  },[loaded]);

  const newProject=()=>{
    const id="p_"+Date.now();
    setCurrentProjId(id);localStorage.setItem("dekigata_currentId",id);
    setPipeType("DCIP");setRoadType("shidou");setSurfaceType("asphalt");
    setHeader({projectName:"",location:"",diameter:150});
    setDesign({});setPoints([]);setInited(false);
    setScreen("setup");setShowProjList(false);
    setToast("新規プロジェクト作成");setTimeout(()=>setToast(""),2000);
  };
  const switchProject=(id)=>{
    setCurrentProjId(id);localStorage.setItem("dekigata_currentId",id);
    setShowProjList(false);setScreen("setup");
    setToast("プロジェクト切替");setTimeout(()=>setToast(""),2000);
  };
  const deleteProject=(id)=>{
    if(!confirm("このプロジェクトを削除しますか?"))return;
    setProjects(prev=>{
      const next=prev.filter(p=>p.id!==id);
      try{localStorage.setItem("dekigata_projects",JSON.stringify(next));}catch(e){}
      if(id===currentProjId){
        if(next.length>0){setCurrentProjId(next[0].id);localStorage.setItem("dekigata_currentId",next[0].id);}
        else{const nid="p_"+Date.now();setCurrentProjId(nid);localStorage.setItem("dekigata_currentId",nid);setHeader({projectName:"",location:"",diameter:150});setDesign({});setPoints([]);setInited(false);}
      }
      return next;
    });
  };

  const road=ROADS.find(r=>r.key===roadType);
  const D=road.D;const dia=header.diameter;const od=getOD(pipeType,dia);
  const H0=pipeType==="SHIKIRI"?0:calcH0(pipeType,D,dia);
  const steps=getSteps(pipeType,roadType,surfaceType,D);
  const tSum=steps.reduce((s,st)=>s+(st.tKey&&design[st.tKey]?Number(design[st.tKey]):0),0)+(design.ta?Number(design.ta):0);

  const rebuild=(p,r,sf)=>{const st=getSteps(p,r,sf,ROADS.find(x=>x.key===r).D);setDesign(d=>({...getDefaults(st),B:d.B||"",Ba:d.Ba||""}));setPoints([]);};
  if(!inited&&loaded&&currentProjId&&!projects.find(p=>p.id===currentProjId)){rebuild("DCIP","shidou","asphalt");setInited(true);}

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
  const onPhotoTaken=(e)=>{
    const file=e.target.files?.[0];if(!file||photoStep===null)return;
    const reader=new FileReader();
    reader.onload=(ev)=>{
      const img=new Image();
      img.onload=()=>{
        const step=steps.find(s=>s.id===photoStep);
        const canvas=document.createElement("canvas");
        canvas.width=img.width;canvas.height=img.height;
        const ctx=canvas.getContext("2d");
        ctx.drawImage(img,0,0);
        // 黒板（写真の約1/6、左下に配置）
        const bbW=Math.round(img.width*0.32);
        const bbH=Math.round(img.height*0.30);
        const bbX=Math.round(img.width*0.02);
        const bbY=img.height-bbH-Math.round(img.height*0.02);
        // 深緑背景 + 白枠
        ctx.fillStyle="#0a4d2e";ctx.fillRect(bbX,bbY,bbW,bbH);
        ctx.strokeStyle="#f5f5dc";ctx.lineWidth=Math.max(3,bbW*0.008);
        ctx.strokeRect(bbX+4,bbY+4,bbW-8,bbH-8);
        // チョーク風白文字
        ctx.fillStyle="#f5f5dc";
        const pad=Math.round(bbW*0.04);
        const baseFs=Math.round(bbH*0.10);
        const lineH=Math.round(bbH*0.115);
        ctx.font=`bold ${Math.round(baseFs*0.85)}px "Hiragino Sans","MS Gothic",sans-serif`;
        let ty=bbY+pad+baseFs;
        const lines=[];
        if(header.projectName)lines.push(["工事名",header.projectName.length>12?header.projectName.slice(0,12)+"…":header.projectName]);
        lines.push(["測点",cur.name||""]);
        lines.push(["工程",`${step.id}.${step.name}`]);
        lines.push(["管種",`${PL[pipeType]} φ${dia}`]);
        const hVal=(()=>{if(step.id===1)return H0;const bs=steps.find(s=>s.tKey==="t0");if(bs&&step.id===bs.id)return H0-(Number(design.t0)||0);let h=D;let a=false;for(const x of steps){if(x.inputs.includes("D")){a=true;continue;}if(!a)continue;if(x.id>step.id)break;if(x.tKey&&x.tKey!=="t0"&&design[x.tKey])h-=Number(design[x.tKey]);}return h;})();
        if(step.inputs.includes("H"))lines.push(["設計H",`${hVal}mm`]);
        if(step.inputs.includes("D"))lines.push(["設計D",`${D}mm`]);
        if(step.inputs.includes("Ba"))lines.push(["設計Ba",`${design.Ba||""}mm`]);
        if(step.tKey&&design[step.tKey])lines.push([step.tKey,`${design[step.tKey]}mm`]);
        lines.push(["日付",cur.date||today()]);
        lines.push(["会社","(有)信濃住宅設備"]);
        lines.forEach(([k,v])=>{
          if(ty>bbY+bbH-pad)return;
          ctx.font=`bold ${Math.round(baseFs*0.7)}px "Hiragino Sans","MS Gothic",sans-serif`;
          ctx.fillText(k,bbX+pad,ty);
          ctx.font=`bold ${Math.round(baseFs*0.85)}px "Hiragino Sans","MS Gothic",sans-serif`;
          ctx.fillText(String(v),bbX+pad+Math.round(bbW*0.22),ty);
          ty+=lineH;
        });
        const composited=canvas.toDataURL("image/jpeg",0.85);
        setCur(p=>{const ph={...p.photos};const a=ph[photoStep]||[];ph[photoStep]=[...a,{data:composited,time:nowTime()}];return{...p,photos:ph};});
      };
      img.src=ev.target.result;
    };
    reader.readAsDataURL(file);
  };
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
    <div style={S.top}><h1 style={S.logo}>出来形かんたん</h1><div style={{display:"flex",alignItems:"center",gap:6}}><span style={S.bg}>1/3</span><button style={{...S.bk,fontSize:20,padding:"4px 8px"}} onClick={()=>setShowProjList(true)} title="プロジェクト一覧">≡</button></div></div>
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
    <button style={S.pri} onClick={()=>setScreen("design")}>設計値確認 →</button>
    {showProjList&&(<div onClick={()=>setShowProjList(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:9999,display:"flex",alignItems:"flex-start",justifyContent:"center",padding:20,paddingTop:60}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:12,padding:20,maxWidth:480,width:"100%",maxHeight:"80vh",overflowY:"auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <h2 style={{fontSize:18,fontWeight:700,margin:0}}>プロジェクト一覧</h2>
          <button style={{background:"none",border:"none",fontSize:24,cursor:"pointer",color:"#888",padding:"0 8px"}} onClick={()=>setShowProjList(false)}>×</button>
        </div>
        <button style={{...S.pri,marginBottom:16}} onClick={newProject}>+ 新規プロジェクト</button>
        {projects.length===0?(<div style={{textAlign:"center",padding:"20px 0",color:"#888",fontSize:13}}>プロジェクトなし</div>):(
          projects.sort((a,b)=>(b.updatedAt||"").localeCompare(a.updatedAt||"")).map(pj=>{
            const isCurrent=pj.id===currentProjId;
            const pipeLabel=PL[pj.pipeType||"DCIP"];
            const nameShow=pj.header?.projectName||"(名称未設定)";
            const ptsN=pj.points?.length||0;
            const dt=pj.updatedAt?new Date(pj.updatedAt).toLocaleString("ja-JP",{month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"}):"";
            return(<div key={pj.id} style={{border:isCurrent?"2px solid #1565C0":"1px solid #ddd",borderRadius:10,padding:"10px 12px",marginBottom:8,background:isCurrent?"#E3F2FD":"#fff"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:15,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{nameShow}{isCurrent&&<span style={{fontSize:10,color:"#1565C0",marginLeft:6}}>（現在）</span>}</div>
                  <div style={{fontSize:11,color:"#888",marginTop:2}}>{pipeLabel} φ{pj.header?.diameter||"—"} / {ptsN}測点 / {dt}</div>
                </div>
                <div style={{display:"flex",gap:4,flexShrink:0}}>
                  {!isCurrent&&<button style={{...S.sm,fontSize:13,background:"#E3F2FD",padding:"6px 10px",borderRadius:6}} onClick={()=>switchProject(pj.id)}>開く</button>}
                  <button style={{...S.sm,fontSize:13,color:"#C62828",padding:"6px 10px"}} onClick={()=>deleteProject(pj.id)}>削除</button>
                </div>
              </div>
            </div>);
          })
        )}
      </div>
    </div>)}
    {toast&&<div style={S.to}>{toast}</div>}
    </div>);}

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
      <h1 style={{fontSize:16,fontWeight:700,margin:0,flex:1,textAlign:"center",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{header.projectName||"出来形管理"}</h1>
      <button style={{...S.bk,fontSize:18,padding:"4px 8px"}} onClick={()=>setShowProjList(true)} title="プロジェクト一覧">≡</button></div>
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
    {toast&&<div style={S.to}>{toast}</div>}
    {showProjList&&(<div onClick={()=>setShowProjList(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:9999,display:"flex",alignItems:"flex-start",justifyContent:"center",padding:20,paddingTop:60}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:12,padding:20,maxWidth:480,width:"100%",maxHeight:"80vh",overflowY:"auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <h2 style={{fontSize:18,fontWeight:700,margin:0}}>プロジェクト一覧</h2>
          <button style={{background:"none",border:"none",fontSize:24,cursor:"pointer",color:"#888",padding:"0 8px"}} onClick={()=>setShowProjList(false)}>×</button>
        </div>
        <button style={{...S.pri,marginBottom:16}} onClick={newProject}>+ 新規プロジェクト</button>
        {projects.length===0?(<div style={{textAlign:"center",padding:"20px 0",color:"#888",fontSize:13}}>プロジェクトなし</div>):(
          projects.sort((a,b)=>(b.updatedAt||"").localeCompare(a.updatedAt||"")).map(pj=>{
            const isCurrent=pj.id===currentProjId;
            const pipeLabel=PL[pj.pipeType||"DCIP"];
            const nameShow=pj.header?.projectName||"(名称未設定)";
            const ptsN=pj.points?.length||0;
            const dt=pj.updatedAt?new Date(pj.updatedAt).toLocaleString("ja-JP",{month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"}):"";
            return(<div key={pj.id} style={{border:isCurrent?"2px solid #1565C0":"1px solid #ddd",borderRadius:10,padding:"10px 12px",marginBottom:8,background:isCurrent?"#E3F2FD":"#fff"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:15,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{nameShow}{isCurrent&&<span style={{fontSize:10,color:"#1565C0",marginLeft:6}}>（現在）</span>}</div>
                  <div style={{fontSize:11,color:"#888",marginTop:2}}>{pipeLabel} φ{pj.header?.diameter||"—"} / {ptsN}測点 / {dt}</div>
                </div>
                <div style={{display:"flex",gap:4,flexShrink:0}}>
                  {!isCurrent&&<button style={{...S.sm,fontSize:13,background:"#E3F2FD",padding:"6px 10px",borderRadius:6}} onClick={()=>switchProject(pj.id)}>開く</button>}
                  <button style={{...S.sm,fontSize:13,color:"#C62828",padding:"6px 10px"}} onClick={()=>deleteProject(pj.id)}>削除</button>
                </div>
              </div>
            </div>);
          })
        )}
      </div>
    </div>)}
    </div>);
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
