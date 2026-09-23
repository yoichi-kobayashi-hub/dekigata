import { useState, useRef, useEffect, useCallback } from "react";

const OD_DCIP={75:93.0,100:118.0,150:169.0,200:220.0,250:271.6,300:322.8,400:425.6};
const OD_HPPE={75:89.0,100:114.0,150:165.0};
const DIAS_DCIP=[75,100,150,200,250,300,400];
const DIAS_HPPE=[75,100,150];
const ROADS=[{key:"shidou",label:"市道",D:1000},{key:"kendou",label:"県道",D:1200}];
const SURFACES=[{key:"asphalt",label:"アスファルト"},{key:"gravel",label:"砕石"}];

function mkDCIP(road,surface,D){
  const Hs=300;const isG=surface==="gravel";
  if(road==="shidou"){const s=[
    {id:1,name:"掘削",inputs:["H","B"],tKey:null,prevRef:null,extra:[]},
    {id:2,name:"管布設",inputs:["D"],tKey:null,prevRef:null,extra:[]},
    {id:3,name:"砂埋戻し",inputs:["H","B"],tKey:"t1",tDef:100,prevRef:"D",extra:[]},
    {id:4,name:"発生土埋戻し①",inputs:["H","B"],tKey:"t2",tDef:200,prevRef:3,extra:[{key:"Hs",label:"埋設シート",design:Hs,minus:30,plus:30},{key:"Dm",label:"マーカーピン",design:700,minus:30,plus:30}]},
    {id:5,name:"発生土埋戻し②",inputs:["H","B"],tKey:"t3",tDef:200,prevRef:4,extra:[]},
    {id:6,name:"発生土埋戻し③",inputs:["H","B"],tKey:"t4",tDef:isG?200:160,prevRef:5,extra:[]},
    {id:7,name:"路盤砕石①",inputs:["H","B"],tKey:"t5",tDef:150,prevRef:6,extra:[]},
    {id:8,name:"路盤砕石②",inputs:["H","B"],tKey:"t6",tDef:150,prevRef:7,extra:[]},
  ];if(!isG)s.push({id:9,name:"舗装",inputs:["Ba","ta"],tKey:null,prevRef:null,extra:[]});return s;}
  const s=[
    {id:1,name:"掘削",inputs:["H","B"],tKey:null,prevRef:null,extra:[]},
    {id:2,name:"管布設",inputs:["D"],tKey:null,prevRef:null,extra:[]},
    {id:3,name:"砂埋戻し",inputs:["H","B"],tKey:"t1",tDef:100,prevRef:"D",extra:[]},
    {id:4,name:"発生土埋戻し①",inputs:["H","B"],tKey:"t2",tDef:200,prevRef:3,extra:[{key:"Hs",label:"埋設シート",design:Hs,minus:30,plus:30}]},
    {id:5,name:"発生土埋戻し②",inputs:["H","B"],tKey:"t3",tDef:200,prevRef:4,extra:[{key:"Dm",label:"マーカーピン",design:700,minus:30,plus:30}]},
    {id:6,name:"発生土埋戻し③",inputs:["H","B"],tKey:"t4",tDef:200,prevRef:5,extra:[]},
    {id:7,name:"発生土埋戻し④",inputs:["H","B"],tKey:"t5",tDef:isG?200:160,prevRef:6,extra:[]},
    {id:8,name:"路盤砕石①",inputs:["H","B"],tKey:"t6",tDef:150,prevRef:7,extra:[]},
    {id:9,name:"路盤砕石②",inputs:["H","B"],tKey:"t7",tDef:150,prevRef:8,extra:[]},
  ];if(!isG)s.push({id:10,name:"舗装",inputs:["Ba","ta"],tKey:null,prevRef:null,extra:[]});return s;
}
function mkHPPE(road,surface,D){
  const Hs=300;const isG=surface==="gravel";
  if(road==="shidou"){const s=[
    {id:1,name:"掘削",inputs:["H","B"],tKey:null,prevRef:null,extra:[]},
    {id:2,name:"基礎砂",inputs:["H","B"],tKey:"t0",tDef:100,prevRef:1,extra:[]},
    {id:3,name:"管布設",inputs:["D"],tKey:null,prevRef:null,extra:[]},
    {id:4,name:"砂埋戻し",inputs:["H","B"],tKey:"t1",tDef:100,prevRef:"D",extra:[]},
    {id:5,name:"発生土埋戻し①",inputs:["H","B"],tKey:"t2",tDef:200,prevRef:4,extra:[{key:"Hs",label:"埋設シート",design:Hs,minus:30,plus:30},{key:"Dm",label:"マーカーピン",design:700,minus:30,plus:30}]},
    {id:6,name:"発生土埋戻し②",inputs:["H","B"],tKey:"t3",tDef:200,prevRef:5,extra:[]},
    {id:7,name:"発生土埋戻し③",inputs:["H","B"],tKey:"t4",tDef:isG?200:160,prevRef:6,extra:[]},
    {id:8,name:"路盤砕石①",inputs:["H","B"],tKey:"t5",tDef:150,prevRef:7,extra:[]},
    {id:9,name:"路盤砕石②",inputs:["H","B"],tKey:"t6",tDef:150,prevRef:8,extra:[]},
  ];if(!isG)s.push({id:10,name:"舗装",inputs:["Ba","ta"],tKey:null,prevRef:null,extra:[]});return s;}
  const s=[
    {id:1,name:"掘削",inputs:["H","B"],tKey:null,prevRef:null,extra:[]},
    {id:2,name:"基礎砂",inputs:["H","B"],tKey:"t0",tDef:100,prevRef:1,extra:[]},
    {id:3,name:"管布設",inputs:["D"],tKey:null,prevRef:null,extra:[]},
    {id:4,name:"砂埋戻し",inputs:["H","B"],tKey:"t1",tDef:100,prevRef:"D",extra:[]},
    {id:5,name:"発生土埋戻し①",inputs:["H","B"],tKey:"t2",tDef:200,prevRef:4,extra:[{key:"Hs",label:"埋設シート",design:Hs,minus:30,plus:30}]},
    {id:6,name:"発生土埋戻し②",inputs:["H","B"],tKey:"t3",tDef:200,prevRef:5,extra:[{key:"Dm",label:"マーカーピン",design:700,minus:30,plus:30}]},
    {id:7,name:"発生土埋戻し③",inputs:["H","B"],tKey:"t4",tDef:200,prevRef:6,extra:[]},
    {id:8,name:"発生土埋戻し④",inputs:["H","B"],tKey:"t5",tDef:isG?200:160,prevRef:7,extra:[]},
    {id:9,name:"路盤砕石①",inputs:["H","B"],tKey:"t6",tDef:150,prevRef:8,extra:[]},
    {id:10,name:"路盤砕石②",inputs:["H","B"],tKey:"t7",tDef:150,prevRef:9,extra:[]},
  ];if(!isG)s.push({id:11,name:"舗装",inputs:["Ba","ta"],tKey:null,prevRef:null,extra:[]});return s;
}
function getSteps(p,r,sf,D){if(p==="SHIKIRI")return[{id:1,name:"弁筐設置",inputs:["A","H"],tKey:null,prevRef:null,extra:[]}];return p==="DCIP"?mkDCIP(r,sf,D):mkHPPE(r,sf,D);}
// テンプレ項目（"@工程名"=出来形工程の位置、それ以外=状況写真）と出来形工程を一本の流れにマージ
function mergeSteps(steps,items){
  const placed=new Set();const out=[];
  const placeUpTo=(k)=>{for(let i=0;i<=k;i++){if(!placed.has(i)){placed.add(i);out.push(steps[i]);}}};
  (items||[]).forEach(it=>{
    const s=String(it).trim();if(!s)return;
    if(s.startsWith("@")){
      const key=s.slice(1).replace(/[①②③④⑤⑥⑦⑧⑨]/g,"").trim();
      const k=steps.findIndex((st,i)=>!placed.has(i)&&(st.name.includes(key)||st.tKey===key));
      if(k>=0)placeUpTo(k);
    }else{
      out.push({id:"p:"+s,name:s,photoOnly:true,inputs:[],tKey:null,prevRef:null,extra:[]});
    }
  });
  for(let i=0;i<steps.length;i++){if(!placed.has(i)){placed.add(i);out.push(steps[i]);}}
  return out;
}
function getDefaults(steps){const d={};steps.forEach(s=>{if(s.tKey&&s.tDef)d[s.tKey]=s.tDef;});if(steps.some(s=>s.inputs?.includes("ta")))d.ta=40;return d;}
function getOD(p,d){return(p==="DCIP"?OD_DCIP:p==="HPPE"?OD_HPPE:{})[d]||0;}
function getDias(p){return p==="DCIP"?DIAS_DCIP:p==="HPPE"?DIAS_HPPE:[];}
function calcH0(p,D,d){const od=getOD(p,d);return p==="HPPE"?D+od+100:D+od;}
const FM={H:{label:"深さ",minus:30,plus:30},B:{label:"幅",minus:50,plus:null},Ba:{label:"舗装幅",minus:25,plus:null},D:{label:"埋設深",minus:30,plus:30},D2:{label:"埋設深②",minus:30,plus:30},ta:{label:"舗装厚",minus:7,plus:null},t0:{label:"基礎砂",minus:30,plus:30},t1:{label:"保護砂",minus:30,plus:30},t2:{label:"発生土",minus:30,plus:30},t3:{label:"発生土",minus:30,plus:30},t4:{label:"発生土",minus:30,plus:30},t5:{label:"路盤",minus:30,plus:30},t6:{label:"路盤",minus:30,plus:30},t7:{label:"路盤",minus:30,plus:30},A:{label:"弁芯距離",minus:null,plus:25},Hs:{label:"シート",minus:30,plus:30},Dm:{label:"マーカー",minus:30,plus:30}};
const APP_VERSION="1.9.4";
const PL={DCIP:"DCIP",HPPE:"HPPE",SHIKIRI:"仕切弁筐"};
const DIM_LABELS=["深さ","幅","厚さ","延長","高さ","径"];
const ZONE_A=["t1","t2","t3","t4"],ZONE_B=["t5","t6","t7"];
// 状況写真の記入項目（項目名の部分一致で決定。該当なし=null→汎用チップ、fields空=📷のみ）
const MACHINE_OPTS=["0.1㎥","0.14㎥","0.2㎥","0.25㎥"];
const PHOTO_FIELDS=[
  {match:"剥ぎ取り",fields:[{k:"機械",t:"choice",o:MACHINE_OPTS}]},
  {match:"掘削状況",fields:[{k:"機械",t:"choice",o:MACHINE_OPTS}]},
  {match:"路盤厚",fields:[{k:"厚さH",t:"num",u:"mm"}]},
  {match:"管布設",fields:[{k:"管径",t:"auto"},{k:"トルク",t:"choice",o:["60N·m","100N·m","直管"]}]},
  {match:"発生土転圧",fields:[{k:"層",t:"choice",o:["①","②","③"]}]},
  {match:"砕石転圧",fields:[{k:"層",t:"choice",o:["①","②"]}]},
  {match:"舗装切断",fields:[]},{match:"積込",fields:[]},{match:"床均し",fields:[]},{match:"明示テープ",fields:[]},
  {match:"ポリスリーブ",fields:[]},{match:"砂埋戻し転圧",fields:[]},{match:"乳剤",fields:[]},{match:"舗装完了",fields:[]},{match:"表示シート",fields:[]},
];
function photoSpec(name){const n=String(name||"");if(/転圧/.test(n)&&/[①②③④⑤]/.test(n))return[];const hit=PHOTO_FIELDS.find(p=>n.includes(p.match));return hit?hit.fields:null;}
function fieldPairs(spec,get,autoVal){return (spec||[]).map(f=>{if(f.t==="auto")return[f.k,autoVal(f.k)];const v=get(f.k);return(v!==undefined&&v!==null&&String(v).trim()!=="")?[f.k,`${v}${f.u||""}`]:null;}).filter(Boolean);}
// 測点の実測D①（主管）。埋戻し以降の設計H起点に使う（未入力ならnull→設計D起点）
function measuredD(steps,measured){const ps=steps.find(s=>s.inputs.includes("D"));if(!ps||!measured)return null;const v=measured[`${ps.id}_D`];if(v===undefined||v===""||isNaN(Number(v)))return null;return Number(v);}
// t自動計算: 前工程H（最初は実測D）− 今工程H
function calcTm(step,steps,meas){if(!step||!step.tKey||step.prevRef===null||step.prevRef===undefined||!meas)return null;let pv;if(step.prevRef==="D"){const ds=steps.find(s=>s.inputs.includes("D"));pv=ds?meas[`${ds.id}_D`]:null;}else pv=meas[`${step.prevRef}_H`];const ch=meas[`${step.id}_H`];if(pv===undefined||pv===null||pv===""||ch===undefined||ch===null||ch==="")return null;return Number(pv)-Number(ch);}
// Hs/Dm 自動計算: シート・ピンは発生土①天端 → Dm=そのH, Hs=実測D①−H
function autoExtra(ex,step,steps,meas){if(!ex||!step||!meas)return null;const h=meas[`${step.id}_H`];if(h===undefined||h===""||isNaN(Number(h)))return null;if(ex.key==="Dm")return Math.round(Number(h));if(ex.key==="Hs"){const dm=measuredD(steps,meas);if(dm===null)return null;return Math.round(dm-Number(h));}const v=meas[`${step.id}_${ex.key}`];return(v===undefined||v==="")?null:Number(v);}
function judge(e,f,m){const meta=m||FM[f];if(!meta||e===null||isNaN(e))return null;if(meta.minus!==null&&e<-meta.minus)return"×";if(meta.plus!==null&&e>meta.plus)return"×";return"○";}
function today(){const d=new Date();return`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;}
function nowTime(){return new Date().toLocaleTimeString("ja-JP",{hour:"2-digit",minute:"2-digit"});}

// ═══════════════════════════════════════
// PDF出力（印刷ベース）
// ═══════════════════════════════════════
function generatePDF({header,pipeType,roadType,surfaceType,design,points,steps:allSteps,dia,od,D,H0,pipe2,od2,D2,mode}){
  mode=mode||"dekigata";
  const steps=allSteps;
  const sheetSteps=mode==="status"?allSteps:allSteps.filter(st=>!st.photoOnly);
  const allItems=pipe2?["B","Ba","H","t1","t2","t3","t4","t5","t6","ta","D","D2","Hs","Dm"]:["B","Ba","H","t1","t2","t3","t4","t5","t6","ta","D","Hs","Dm"];
  const lbl=(it)=>pipe2&&it==="D"?"D①":it==="D2"?"D②":it;
  const road=ROADS.find(r=>r.key===roadType);
  const designVals={};
  allItems.forEach(it=>{
    if(it==="H")designVals[it]=H0;else if(it==="D")designVals[it]=D;else if(it==="D2")designVals[it]=D2;
    else if(it==="B")designVals[it]=design.B?Number(design.B):null;
    else if(it==="Ba")designVals[it]=design.Ba?Number(design.Ba):null;
    else if(it==="ta")designVals[it]=Number(design.ta)||40;
    else if(it==="Hs")designVals[it]=300;else if(it==="Dm")designVals[it]=700;
    else designVals[it]=design[it]?Number(design[it]):null;
  });
  const judgeItem=(it,mv)=>{if(mv===null||designVals[it]===null)return"";const err=mv-designVals[it];const meta=FM[it];if(!meta)return"";if(meta.minus!==null&&err<-meta.minus)return"×";if(meta.plus!==null&&err>meta.plus)return"×";return"○";};
  const dateFor=(pt,it)=>{const ds=pt.dates||{};let st=null;if(it==="Hs"||it==="Dm")st=steps.find(s=>s.extra&&s.extra.some(e=>e.key===it));else{st=steps.find(s=>s.tKey===it)||steps.find(s=>s.inputs.includes(it));}return(st&&ds[st.id])||pt.date||"";};
  const getMeasured=(pt,it)=>{const ts=steps.find(s=>s.tKey===it);if(ts){const tv=calcTm(ts,steps,pt.measured);return tv!==null?Math.round(tv):null;}for(const s of steps){const k=`${s.id}_${it}`;if(pt.measured[k]!==undefined&&pt.measured[k]!=="")return Number(pt.measured[k]);for(const ex of s.extra){if(ex.key===it){return autoExtra(ex,s,steps,pt.measured);}}}return null;};

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
.step-info{font-size:12px;display:flex;flex-direction:column;overflow:hidden}
.step-card.st{grid-template-columns:1.6fr 1fr;grid-template-rows:1fr}
.bb{border:1px solid #333;padding:4px 6px;font-size:12px;display:flex;flex-direction:column;gap:0;overflow:hidden;background:#fff}
.bb .bt{font-weight:bold;font-size:13px;border-bottom:1px solid #333;padding-bottom:2px;margin-bottom:3px}
.bb .br{display:grid;grid-template-columns:52px 1fr;border-bottom:0.4px solid #ccc;padding:2px 0;font-size:12px;line-height:1.3}
.bb .br .k{color:#555}.bb .br .v{font-weight:bold}
.step-info table td{font-size:11px;padding:2px 4px}
.step-info table th{font-size:10px;padding:2px 4px}
.step-title{font-weight:bold;font-size:12px;margin-bottom:2mm;padding-bottom:1mm;border-bottom:1px solid #ddd}
.ftr{font-size:10px;color:#666;display:flex;justify-content:space-between;margin-top:2mm;padding-top:2mm;border-top:0.5px solid #ccc;flex-shrink:0}`;

  let html=`<html><head><meta charset="utf-8"><title>出来形_${header.projectName||""}</title><style>${css}</style></head><body>`;

  const coverPages=mode==="status"?0:Math.ceil(points.length/2);
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
    let shL=pcx-pr,shR=pcx+pr;
    if(pipe2&&od2){
      const r2=pr*(od2/od);const gap=pr*0.3;const tw=pr*2+gap+r2*2;
      const cx1=pcx-tw/2+pr;const cx2=cx1+pr+gap+r2;const cy2=pipeY+pipeLh-r2;
      mzSvg+=`<circle cx="${cx1}" cy="${pcy}" r="${pr}" fill="none" stroke="#333" stroke-width="0.8"/>`;
      mzSvg+=`<text x="${cx1}" y="${pcy+3}" text-anchor="middle" fill="#555" font-size="8" font-weight="bold" font-family="sans-serif">φ${dia}</text>`;
      mzSvg+=`<circle cx="${cx2}" cy="${cy2}" r="${r2}" fill="none" stroke="#333" stroke-width="0.8"/>`;
      mzSvg+=`<text x="${cx2}" y="${cy2+3}" text-anchor="middle" fill="#555" font-size="8" font-weight="bold" font-family="sans-serif">φ${pipe2.diameter}</text>`;
      shL=cx1-pr;shR=cx2+r2;
    }else{
      mzSvg+=`<circle cx="${pcx}" cy="${pcy}" r="${pr}" fill="none" stroke="#333" stroke-width="0.8"/>`;
      mzSvg+=`<text x="${pcx}" y="${pcy+3}" text-anchor="middle" fill="#555" font-size="11" font-weight="bold" font-family="sans-serif">φ${dia}</text>`;
    }
    mzSvg+=`<line x1="${shL}" y1="${bt23}" x2="${shR}" y2="${bt23}" stroke="#1565C0" stroke-width="1.2"/>`;
    let zp=`M ${shL} ${bt23+1}`;
    for(let zi=0;zi<Math.floor((shR-shL)/3);zi++){const zx=shL+zi*3;zp+=` L ${zx+1.5} ${bt23+3} L ${zx+3} ${bt23+1}`;}
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
    html+=`<tr><td>舗装厚ta</td><td>-7</td><td></td></tr><tr><td>埋設深D${pipe2?"①②":""}</td><td>-30</td><td>30</td></tr>`;
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
      html+=`<tr><td class="itm">${lbl(it)}</td><td>${dv}</td><td>${mL!==null?mL:""}</td><td>${eL!==null?(eL>0?"+":"")+eL:""}</td><td>${dateFor(ptL,it)}</td><td class="${jL==="○"?"ok":jL==="×"?"ng":""}">${jL}</td>`;
      if(ptR){const mR=getMeasured(ptR,it);const eR=mR!==null?mR-dv:null;const jR=mR!==null?judgeItem(it,mR):"";
        html+=`<td class="itm sep">${lbl(it)}</td><td>${dv}</td><td>${mR!==null?mR:""}</td><td>${eR!==null?(eR>0?"+":"")+eR:""}</td><td>${dateFor(ptR,it)}</td><td class="${jR==="○"?"ok":jR==="×"?"ng":""}">${jR}</td>`;
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
    const filled={};
    const stepIdx=steps.indexOf(step);
    for(let si=0;si<=stepIdx&&si<steps.length;si++){
      const s2=steps[si];
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
    const pFill=isHiP?'#1565C0':filled["pipe"]?'#E3F2FD':'none';const pTxt=isHiP?'#fff':'#555';
    let shL=pcx-pr,shR=pcx+pr;
    if(pipe2&&od2){
      const r2=pr*(od2/od);const gap=pr*0.3;const tw=pr*2+gap+r2*2;
      const cx1=pcx-tw/2+pr;const cx2=cx1+pr+gap+r2;const cy2=pipeY+pipeLh-r2;
      s+=`<circle cx="${cx1}" cy="${pcy}" r="${pr}" fill="${pFill}" stroke="#333" stroke-width="0.6"/>`;
      s+=`<text x="${cx1}" y="${pcy+2}" text-anchor="middle" fill="${pTxt}" font-size="6" font-family="sans-serif">φ${dia}</text>`;
      s+=`<circle cx="${cx2}" cy="${cy2}" r="${r2}" fill="${pFill}" stroke="#333" stroke-width="0.6"/>`;
      s+=`<text x="${cx2}" y="${cy2+2}" text-anchor="middle" fill="${pTxt}" font-size="6" font-family="sans-serif">φ${pipe2.diameter}</text>`;
      shL=cx1-pr;shR=cx2+r2;
    }else{
      s+=`<circle cx="${pcx}" cy="${pcy}" r="${pr}" fill="${pFill}" stroke="#333" stroke-width="0.6"/>`;
      s+=`<text x="${pcx}" y="${pcy+2}" text-anchor="middle" fill="${pTxt}" font-size="9" font-family="sans-serif">φ${dia}</text>`;
    }
    const blue="#1565C0";
    s+=`<line x1="${shL}" y1="${bt23}" x2="${shR}" y2="${bt23}" stroke="${blue}" stroke-width="1"/>`;
    let zp=`M ${shL} ${bt23+0.8}`;
    for(let zi=0;zi<Math.floor((shR-shL)/2.5);zi++){const zx=shL+zi*2.5;zp+=` L ${zx+1.25} ${bt23+2.5} L ${zx+2.5} ${bt23+0.8}`;}
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

  const designHOf=(step,pt)=>{if(step.id===1)return H0;const bStep=steps.find(s=>s.tKey==="t0");if(bStep&&step.id===bStep.id)return H0-(Number(design.t0)||0);const dmP=measuredD(steps,pt.measured);let hh=dmP!==null?dmP:D;let ap=false;for(const s2 of steps){if(s2.inputs.includes("D")){ap=true;continue;}if(!ap)continue;if(typeof s2.id==="number"&&s2.id>step.id)break;if(s2.tKey&&s2.tKey!=="t0"&&design[s2.tKey])hh-=Number(design[s2.tKey]);}return Math.round(hh);};
  const boardLines=(step,pt)=>{
    const L=[];
    L.push(["工事名",header.projectName||""]);L.push(["測点",pt.name||""]);
    L.push(["工程",step.photoOnly?step.name:`${step.id}.${step.name}`]);
    L.push(["管種",pipe2?`${PL[pipeType]}φ${dia}+${PL[pipe2.pipeType||pipeType]}φ${pipe2.diameter}`:`${PL[pipeType]} φ${dia}`]);
    if(step.photoOnly){const spec=photoSpec(step.name);if(spec){fieldPairs(spec,(k)=>pt.measured[`${step.id}_f_${k}`],(k)=>k==="管径"?(pipe2?`φ${dia}+φ${pipe2.diameter}`:`φ${dia}`):"").forEach(([k,v])=>L.push([k,v]));}}
    else{
      const mv=(f)=>{const v=pt.measured[`${step.id}_${f}`];return(v===undefined||v==="")?null:Number(v);};
      const dl=(lbl,dsg,f)=>{const m=mv(f);if(m!==null&&dsg!==null&&dsg!==""){const j=judge(m-Number(dsg),f)||"";L.push([lbl,`設${dsg} 実${m} ${j}`]);}else L.push([lbl,`設計${dsg!==null&&dsg!==""?dsg:"—"}`]);};
      if(step.inputs.includes("H"))dl("H",designHOf(step,pt),"H");
      if(step.inputs.includes("B")&&mv("B")!==null)dl("B",design.B||"","B");
      if(step.inputs.includes("D"))dl(pipe2?"D①":"D",D,"D");
      if(step.inputs.includes("D2"))dl("D②",D2,"D2");
      if(step.inputs.includes("D")&&pt.measured[`${step.id}_f_トルク`]){const tv=pt.measured[`${step.id}_f_トルク`];L.push(tv==="直管"?["継手","直管(トルク無)"]:["トルク",tv]);}
      if(step.inputs.includes("Ba"))dl("Ba",design.Ba||"","Ba");
      if(step.inputs.includes("ta"))dl("ta",Number(design.ta)||40,"ta");
      if(step.tKey&&design[step.tKey]){const tD=Number(design[step.tKey]);const tM=calcTm(step,steps,pt.measured);if(tM!==null){const j=judge(tM-tD,step.tKey)||"";L.push([step.tKey,`設${tD} 実${Math.round(tM)} ${j}`]);}else L.push([step.tKey,`設計${tD}`]);}
      (step.extra||[]).forEach(ex=>{const m=autoExtra(ex,step,steps,pt.measured);if(m!==null){const j=judge(m-ex.design,ex.key,ex)||"";L.push([ex.key,`設${ex.design} 実${m} ${j}`]);}});
    }
    L.push(["日付",((pt.dates||{})[step.id])||pt.date||""]);
    L.push(["会社","(有)信濃住宅設備"]);
    return L;
  };
  const perPage=3;
  points.forEach(pt=>{
    for(let sIdx=0;sIdx<sheetSteps.length;sIdx+=perPage){
      html+=`<div class="step-page"><div class="step-hdr"><span>${pt.name} — ${mode==="status"?"施工状況写真":"出来形管理写真"}</span><span style="font-size:10px;color:#888">${PL[pipeType]} φ${dia} ${road.label}　${pt.date||""}</span></div>`;
      for(let i=0;i<perPage&&sIdx+i<sheetSteps.length;i++){
        const step=sheetSteps[sIdx+i];
        const stepPhotos=(pt.photos&&pt.photos[step.id])||[];
        const photoContent=stepPhotos.length>0
          ?`<img src="${stepPhotos[0].data}" alt="${pt.name} ${step.name}"/>`
          :`<span>写真未撮影（${pt.name} ${step.name}）</span>`;
        if(mode==="status"){
          const L=boardLines(step,pt);
          html+=`<div class="step-card st"><div class="step-photo">${photoContent}</div><div class="bb"><div class="bt">${sIdx+i+1}/${sheetSteps.length}　${step.photoOnly?step.name:`${step.id}. ${step.name}`}</div>`;
          L.forEach(([k,v])=>{html+=`<div class="br"><span class="k">${k}</span><span class="v">${v}</span></div>`;});
          html+=`</div></div>`;
          continue;
        }
        if(step.photoOnly){
          html+=`<div class="step-card"><div class="step-photo">${photoContent}</div><div class="step-mz">${mkStepMz(step,pt)}</div><div class="step-info">`;
          html+=`<div class="step-title">${step.name}</div>`;
          html+=`<div style="font-size:11px;color:#666">状況写真</div>`;
          {const spec=photoSpec(step.name);if(spec&&spec.length){const av=(k)=>k==="管径"?(pipe2?`φ${dia}+φ${pipe2.diameter}`:`φ${dia}`):"";const prs=fieldPairs(spec,(k)=>pt.measured[`${step.id}_f_${k}`],av);if(prs.length)html+=`<div style="font-size:11px;margin-top:3px">${prs.map(([k,v])=>`${k}：<b>${v}</b>`).join("　")}</div>`;}}
          html+=`<div style="font-size:10px;color:#888;margin-top:auto">${((pt.dates||{})[step.id])||pt.date||""}</div>`;
          html+=`</div></div>`;
          continue;
        }
        html+=`<div class="step-card"><div class="step-photo">${photoContent}</div><div class="step-mz">${mkStepMz(step,pt)}</div><div class="step-info">`;
        html+=`<div class="step-title">${step.id}. ${step.name}<span style="font-size:10px;color:#888;font-weight:normal;margin-left:6px">${((pt.dates||{})[step.id])||pt.date||""}</span></div>`;
        html+=`<table><tr><th>項目</th><th>設計</th><th>実測</th><th>判定</th></tr>`;
        step.inputs.forEach(f=>{
          let dVal=null;
          if(f==="H"){dVal=designHOf(step,pt);}
          else if(f==="B")dVal=design.B?Number(design.B):null;
          else if(f==="Ba")dVal=design.Ba?Number(design.Ba):null;
          else if(f==="D")dVal=D;
          else if(f==="D2")dVal=D2;
          else if(f==="ta")dVal=Number(design.ta)||40;
          const key=`${step.id}_${f}`;const mv=pt.measured[key]??"";
          const err=dVal!==null&&mv!==""?Number(mv)-dVal:null;
          const j=err!==null?judge(err,f):null;
          html+=`<tr><td>${lbl(f)}</td><td>${dVal!==null?dVal:""}</td><td>${mv}</td><td class="${j==="○"?"ok":j==="×"?"ng":""}">${j||""}</td></tr>`;
        });
        if(step.tKey){
          const tD=design[step.tKey]?Number(design[step.tKey]):null;
          const tM=calcTm(step,steps,pt.measured);
          const tj=(tM!==null&&tD!==null)?judge(tM-tD,step.tKey):null;
          html+=`<tr><td>${step.tKey}</td><td>${tD||""}</td><td>${tM!==null?Math.round(tM):""}</td><td class="${tj==="○"?"ok":tj==="×"?"ng":""}">${tj||""}</td></tr>`;
        }
        if(step.inputs.includes("D")&&pt.measured[`${step.id}_f_トルク`]){const tv=pt.measured[`${step.id}_f_トルク`];html+=tv==="直管"?`<tr><td>継手</td><td colspan="3">直管（トルク管理なし）</td></tr>`:`<tr><td>トルク</td><td colspan="3">${tv}</td></tr>`;}
        step.extra.forEach(ex=>{
          const av=autoExtra(ex,step,steps,pt.measured);const mv=av!==null?av:"";
          const err=av!==null?av-ex.design:null;const j=err!==null?judge(err,ex.key,ex):null;
          html+=`<tr><td>${ex.key}<span style="font-size:8px;color:#888">(自動)</span></td><td>${ex.design}</td><td>${mv}</td><td class="${j==="○"?"ok":j==="×"?"ng":""}">${j||""}</td></tr>`;
        });
        html+=`</table></div></div>`;
      }
      html+=`<div class="ftr"><span>有限会社信濃住宅設備</span></div></div>`;
    }
  });

  html+=`</body></html>`;
  const w=window.open("","_blank");
  w.document.write(html);w.document.close();
  const doPrint=()=>{try{w.print();}catch(e){}};
  setTimeout(()=>{
    const imgs=w.document.images;
    let pending=imgs.length;
    if(pending===0){doPrint();return;}
    let done=0;let printed=false;
    const check=()=>{done++;if(done>=pending&&!printed){printed=true;doPrint();}};
    for(const im of imgs){if(im.complete)check();else{im.onload=check;im.onerror=check;}}
    setTimeout(()=>{if(!printed){printed=true;doPrint();}},6000);
  },300);
}

// ═══════════════════════════════════════
// 写真台帳PDF（蔵衛門スタイル：着手前及び完成）
// ═══════════════════════════════════════
function generateAlbumPDF({header,albumPhotos,albumPositions}){
  const posIdx=(p)=>{const i=albumPositions.indexOf(p);return i<0?999:i;};
  const sortFn=(a,b)=>posIdx(a.position)-posIdx(b.position)||(a.time||"").localeCompare(b.time||"");
  const pre=albumPhotos.filter(p=>p.phase==="pre").sort(sortFn);
  const comp=albumPhotos.filter(p=>p.phase==="comp").sort(sortFn);
  const css=`*{margin:0;padding:0;box-sizing:border-box}
html,body{margin:0;padding:0}
body{font-family:"Hiragino Sans","MS Gothic",sans-serif;font-size:12px;color:#000;line-height:1.4}
@media print{@page{size:A4 portrait;margin:8mm}body{margin:0}
.al-cover{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
.al-cover{page-break-after:always;height:272mm;background:#5b87c5;border:2mm solid #4a76b4;display:flex;flex-direction:column;align-items:center;padding:14mm;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.al-title{color:#f7ecbe;font-size:46px;font-weight:bold;letter-spacing:12px;margin-top:38mm}
.al-cover-photo{margin-top:auto;margin-bottom:14mm;width:78%}
.al-cover-photo img{width:100%;display:block}
.al-page{page-break-after:always;height:272mm;display:flex;flex-direction:column;padding-top:10mm;position:relative}
.al-pgnum{position:absolute;top:0;right:2mm;font-size:15px}
.al-block{display:grid;gap:5mm;flex:1;min-height:0;margin-bottom:5mm;align-items:start}
.al-block.pl{grid-template-columns:57% 1fr}
.al-block.pr{grid-template-columns:1fr 57%}
.al-photo{display:flex;align-items:flex-start;height:100%}
.al-photo img{width:100%;max-height:80mm;object-fit:cover;display:block}
.al-txt{font-size:12px;padding-top:0.5mm}
.al-field{border-bottom:0.4px solid #888;padding:1px 0 2px;min-height:16px}
.al-gap{height:8px}
.al-line{border-bottom:0.4px solid #aaa;height:15px}`;
  let html=`<html><head><meta charset="utf-8"><title>写真台帳_${header.projectName||""}</title><style>${css}</style></head><body>`;
  const coverPhoto=pre[0]||comp[0];
  html+=`<div class="al-cover"><div class="al-title">着手前及び完成</div>${coverPhoto?`<div class="al-cover-photo"><img src="${coverPhoto.data}"/></div>`:""}</div>`;
  const batches=[];
  const maxLen=Math.max(pre.length,comp.length);
  for(let i=0;i<maxLen;i+=3){
    const pb=pre.slice(i,i+3);const cb=comp.slice(i,i+3);
    if(pb.length)batches.push(pb);
    if(cb.length)batches.push(cb);
  }
  let pgNum=0;
  batches.forEach(batch=>{
    pgNum++;
    const photoLeft=pgNum%2===1;
    html+=`<div class="al-page"><div class="al-pgnum">${pgNum}</div>`;
    batch.forEach(ph=>{
      const phaseLabel=ph.phase==="pre"?"着手前":"完成";
      const txt=`<div class="al-txt">
        <div class="al-field">分　類：着手前及び完成</div>
        <div class="al-field">工　種：</div>
        <div class="al-field">場　所：${header.location||""}</div>
        <div class="al-gap"></div>
        <div class="al-field">${phaseLabel}</div>
        <div class="al-field">${ph.position}</div>
        ${'<div class="al-line"></div>'.repeat(11)}
      </div>`;
      const pho=`<div class="al-photo"><img src="${ph.data}"/></div>`;
      html+=`<div class="al-block ${photoLeft?"pl":"pr"}">${photoLeft?pho+txt:txt+pho}</div>`;
    });
    html+=`</div>`;
  });
  html+=`</body></html>`;
  const w=window.open("","_blank");
  w.document.write(html);w.document.close();
  const doPrint=()=>{try{w.print();}catch(e){}};
  setTimeout(()=>{
    const imgs=w.document.images;
    let pending=imgs.length;
    if(pending===0){doPrint();return;}
    let done=0;let printed=false;
    const check=()=>{done++;if(done>=pending&&!printed){printed=true;doPrint();}};
    for(const im of imgs){if(im.complete)check();else{im.onload=check;im.onerror=check;}}
    setTimeout(()=>{if(!printed){printed=true;doPrint();}},6000);
  },300);
}

// ═══════════════════════════════════════
// メインApp
// ═══════════════════════════════════════
// Supabase 同期レイヤー
// ═══════════════════════════════════════
const SB_URL="https://xsptsrlbrherfqgayvna.supabase.co";
const SB_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzcHRzcmxicmhlcmZxZ2F5dm5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1NTgyNTMsImV4cCI6MjA5MTEzNDI1M30.Os6Uy6qlTgpq-vBpcI8X_g_L2olrmUhinpTcGfZWgY8";
const sbHeaders={"apikey":SB_KEY,"Authorization":`Bearer ${SB_KEY}`,"Content-Type":"application/json"};
const genUUID=()=>(typeof crypto!=="undefined"&&crypto.randomUUID)?crypto.randomUUID():'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,c=>{const r=Math.random()*16|0;return(c==='x'?r:(r&0x3|0x8)).toString(16);});
async function sbFetchProjects(){
  const res=await fetch(`${SB_URL}/rest/v1/dekigata_projects?select=*&order=updated_at.desc`,{headers:sbHeaders});
  if(!res.ok)throw new Error("fetch failed");
  return res.json();
}
async function sbUpsertProject(id,name,data){
  const res=await fetch(`${SB_URL}/rest/v1/dekigata_projects?on_conflict=id`,{
    method:"POST",
    headers:{...sbHeaders,"Prefer":"resolution=merge-duplicates"},
    body:JSON.stringify({id,name,data,updated_at:new Date().toISOString()})
  });
  return res.ok;
}
async function sbFetchProject(id){
  const res=await fetch(`${SB_URL}/rest/v1/dekigata_projects?id=eq.${id}&select=*`,{headers:sbHeaders});
  if(!res.ok)throw new Error("fetch failed");
  const rows=await res.json();return rows[0]||null;
}
// 条件付き更新: 読み込んだ時点のupdated_atと一致する時だけ書く（他端末が書いていたら書かない）
async function sbConditionalUpdate(id,name,data,baseUpdatedAt){
  const res=await fetch(`${SB_URL}/rest/v1/dekigata_projects?id=eq.${id}&updated_at=eq.${encodeURIComponent(baseUpdatedAt)}&select=id,updated_at`,{
    method:"PATCH",headers:{...sbHeaders,"Prefer":"return=representation"},
    body:JSON.stringify({name,data,updated_at:new Date().toISOString()})});
  if(!res.ok)throw new Error("patch failed");
  const rows=await res.json();
  return rows.length>0?{ok:true,row:rows[0]}:{conflict:true};
}
async function sbInsertProject(id,name,data){
  const res=await fetch(`${SB_URL}/rest/v1/dekigata_projects?select=id,updated_at`,{
    method:"POST",headers:{...sbHeaders,"Prefer":"return=representation"},
    body:JSON.stringify({id,name,data,updated_at:new Date().toISOString()})});
  if(res.status===409)return{conflict:true};
  if(!res.ok)throw new Error("insert failed");
  const rows=await res.json();return{ok:true,row:rows[0]};
}
// 3wayマージ: 自分がbase（読んだ時点）から変えた項目だけをcloudに重ねる。写真は両方残す
function mergeProjectData(local,cloud,base){
  const b=base||{};const l=local||{};const c=cloud||{};
  const same=(a,bb)=>JSON.stringify(a===undefined?null:a)===JSON.stringify(bb===undefined?null:bb);
  const pick=(lv,cv,bv)=>same(lv,bv)?cv:lv;
  const mergeObj=(lo,co,bo)=>{lo=lo||{};co=co||{};bo=bo||{};const out={...co};new Set([...Object.keys(lo),...Object.keys(bo)]).forEach(k=>{if(!same(lo[k],bo[k])){if(lo[k]===undefined)delete out[k];else out[k]=lo[k];}});return out;};
  const unionPhotos=(la,ca)=>{la=Array.isArray(la)?la:[];ca=Array.isArray(ca)?ca:[];const seen=new Set();const out=[];[...ca,...la].forEach(ph=>{const k=ph&&(ph.id||ph.data);if(!k||seen.has(k))return;seen.add(k);out.push(ph);});return out;};
  const mergePhotoMap=(lm,cm)=>{lm=lm||{};cm=cm||{};const out={...cm};Object.keys(lm).forEach(k=>{out[k]=unionPhotos(lm[k],cm[k]);});return out;};
  const mergePoint=(lp,cp,bp)=>{if(!cp)return lp;if(!lp)return cp;const bb=bp||{};return{...cp,name:pick(lp.name,cp.name,bb.name),date:pick(lp.date,cp.date,bb.date),measured:mergeObj(lp.measured,cp.measured,bb.measured),dates:mergeObj(lp.dates,cp.dates,bb.dates),photos:mergePhotoMap(lp.photos,cp.photos)};};
  const lps=l.points||[],cps=c.points||[],bps=b.points||[];
  const byName=(arr)=>{const m={};arr.forEach(pt=>{if(pt&&pt.name)m[pt.name]=pt;});return m;};
  const cm=byName(cps),bm=byName(bps),lm=byName(lps);
  const outPoints=lps.map(lp=>mergePoint(lp,cm[lp.name],bm[lp.name]));
  cps.forEach(cp=>{if(!lm[cp.name]&&!bm[cp.name])outPoints.push(cp);});
  return{
    pipeType:pick(l.pipeType,c.pipeType,b.pipeType),roadType:pick(l.roadType,c.roadType,b.roadType),surfaceType:pick(l.surfaceType,c.surfaceType,b.surfaceType),
    header:mergeObj(l.header,c.header,b.header),design:mergeObj(l.design,c.design,b.design),points:outPoints,
    albumPhotos:unionPhotos(l.albumPhotos,c.albumPhotos),albumPositions:pick(l.albumPositions,c.albumPositions,b.albumPositions),
    checkItems:pick(l.checkItems,c.checkItems,b.checkItems),checkPhotos:mergePhotoMap(l.checkPhotos,c.checkPhotos),
    checkNotes:mergeObj(l.checkNotes,c.checkNotes,b.checkNotes),checkDims:mergeObj(l.checkDims,c.checkDims,b.checkDims),
  };
}
async function sbDeleteProject(id){
  const res=await fetch(`${SB_URL}/rest/v1/dekigata_projects?id=eq.${id}`,{method:"DELETE",headers:sbHeaders});
  return res.ok;
}
// Storageのキーは英数字と . _ - のみ。日本語や記号はハッシュに置換
function safeKey(str){const t=String(str||"");if(/^[A-Za-z0-9._-]{1,40}$/.test(t))return t;let h=0;for(let i=0;i<t.length;i++){h=(h*31+t.charCodeAt(i))|0;}return "k"+(h>>>0).toString(36);}
async function sbUploadPhoto(path,blob){
  const res=await fetch(`${SB_URL}/storage/v1/object/dekigata-photos/${path}`,{
    method:"POST",
    headers:{"apikey":SB_KEY,"Authorization":`Bearer ${SB_KEY}`,"Content-Type":"image/jpeg"},
    body:blob
  });
  if(!res.ok)throw new Error("upload failed");
  return `${SB_URL}/storage/v1/object/public/dekigata-photos/${path}`;
}
async function sbFetchTemplates(){
  const res=await fetch(`${SB_URL}/rest/v1/dekigata_templates?select=*&order=sort_order.asc`,{headers:sbHeaders});
  if(!res.ok)throw new Error("tpl fetch failed");
  return res.json();
}
async function sbSaveTemplate(name,items){
  const res=await fetch(`${SB_URL}/rest/v1/dekigata_templates`,{method:"POST",headers:sbHeaders,body:JSON.stringify({name,items,sort_order:99})});
  return res.ok;
}

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
  const[albumTarget,setAlbumTarget]=useState(null);
  const[albumPhotos,setAlbumPhotos]=useState([]);
  const[albumPositions,setAlbumPositions]=useState(["始点","中間点","終点"]);
  const[newPosName,setNewPosName]=useState("");
  const[checkTarget,setCheckTarget]=useState(null);
  const[checkItems,setCheckItems]=useState([]);
  const[checkPhotos,setCheckPhotos]=useState({});
  const[templates,setTemplates]=useState([]);
  const[tplLoaded,setTplLoaded]=useState(false);
  const[newItemName,setNewItemName]=useState("");
  const[checkNotes,setCheckNotes]=useState({});
  const[fontScale,setFontScale]=useState(()=>{try{const v=localStorage.getItem("dekigata_zoom");return v?Number(v):1.15;}catch(e){return 1.15;}});
  const setZoom=(z)=>{setFontScale(z);try{localStorage.setItem("dekigata_zoom",String(z));}catch(e){}};
  const[checkDims,setCheckDims]=useState({});
  const[projects,setProjects]=useState([]);
  const[currentProjId,setCurrentProjId]=useState(null);
  const[loaded,setLoaded]=useState(false);
  const[showProjList,setShowProjList]=useState(false);
  const[syncStatus,setSyncStatus]=useState("init");
  const syncTimer=useRef(null);
  const projToData=(p)=>{const{id,updatedAt,...rest}=p;return rest;};
  const snapRef=useRef({updatedAt:null,data:null});
  const dirtyRef=useRef(false);
  const lastAppliedRef=useRef(null);
  const stateRef=useRef({});
  const normData=(d)=>{d=d||{};return{pipeType:d.pipeType||"DCIP",roadType:d.roadType||"shidou",surfaceType:d.surfaceType||"asphalt",header:d.header||{projectName:"",location:"",diameter:150},design:d.design||{},points:d.points||[],albumPhotos:d.albumPhotos||[],albumPositions:(d.albumPositions&&d.albumPositions.length)?d.albumPositions:["始点","中間点","終点"],checkItems:d.checkItems||[],checkPhotos:d.checkPhotos||{},checkNotes:d.checkNotes||{},checkDims:d.checkDims||{}};};
  const applyData=(d)=>{
    const n=normData(d);
    setPipeType(n.pipeType);setRoadType(n.roadType);setSurfaceType(n.surfaceType);
    setHeader(n.header);setDesign(n.design);setPoints(n.points);
    setAlbumPhotos(n.albumPhotos);setAlbumPositions(n.albumPositions);
    setCheckItems(n.checkItems);setCheckPhotos(n.checkPhotos);setCheckNotes(n.checkNotes);setCheckDims(n.checkDims);
    lastAppliedRef.current=JSON.stringify(n);stateRef.current=n;
    return n;
  };
  const resetSync=()=>{snapRef.current={updatedAt:null,data:null};lastAppliedRef.current=null;dirtyRef.current=false;};
  const mirrorLocal=(id,d,updatedAt,dirty)=>{setProjects(prev=>{const idx=prev.findIndex(p=>p.id===id);const rec={id,...d,updatedAt:updatedAt||new Date().toISOString(),localDirty:!!dirty};let next;if(idx<0)next=[...prev,rec];else{next=[...prev];next[idx]=rec;}try{localStorage.setItem("dekigata_projects",JSON.stringify(next));}catch(e){}return next;});};

  // 起動時: Supabase優先で読み込み、オフライン時はlocalStorage
  useEffect(()=>{
    (async()=>{
      let cloudOk=false;let cloudProjects=[];
      try{
        const rows=await sbFetchProjects();
        cloudProjects=rows.map(r=>({id:r.id,...(r.data||{}),updatedAt:r.updated_at}));
        cloudOk=true;
      }catch(e){console.warn("cloud fetch failed",e);}
      let local=[];
      try{const raw=localStorage.getItem("dekigata_projects");if(raw)local=JSON.parse(raw);}catch(e){}
      if(cloudOk){
        // 圏外で編集済み(localDirty)のプロジェクトはローカル版を優先（開いた時にクラウドとマージ保存される）
        for(const lp of local){
          if(lp.localDirty){const ci=cloudProjects.findIndex(c=>c.id===lp.id);if(ci>=0){cloudProjects[ci]={...lp};}}
        }
        // ローカルのみのプロジェクトをクラウドへ移行
        for(const lp of local){
          const exists=cloudProjects.find(c=>c.id===lp.id);
          if(!exists){
            const nid=String(lp.id).startsWith("p_")?genUUID():lp.id;
            const proj={...lp,id:nid};
            cloudProjects.push(proj);
            sbUpsertProject(nid,proj.header?.projectName||"",projToData(proj)).catch(()=>{});
          }
        }
        setProjects(cloudProjects);
        setSyncStatus("synced");
        try{localStorage.setItem("dekigata_projects",JSON.stringify(cloudProjects));}catch(e){}
      }else{
        setProjects(local);
        setSyncStatus("offline");
      }
      const cid=localStorage.getItem("dekigata_currentId");
      if(cid)setCurrentProjId(cid);
      setLoaded(true);
    })();
  },[]);

  // 現在のプロジェクトが変わったら復元
  useEffect(()=>{
    if(!loaded||!currentProjId)return;
    const pj=projects.find(p=>p.id===currentProjId);
    if(pj){
      const{localDirty,...rest}=pj;const d=projToData(rest);
      const n=applyData(d);
      if(localDirty){snapRef.current={updatedAt:null,data:null};dirtyRef.current=true;setTimeout(()=>{if(syncSaveRef.current)syncSaveRef.current();},1500);}
      else{snapRef.current={updatedAt:pj.updatedAt||null,data:n};dirtyRef.current=false;}
      setInited(true);
    }
  // eslint-disable-next-line
  },[currentProjId,loaded]);

  // 現在の状態を常にrefに（保存処理が最新値を読むため）
  stateRef.current={pipeType,roadType,surfaceType,header,design,points,albumPhotos,albumPositions,checkItems,checkPhotos,checkNotes,checkDims};

  // クラウド保存: 条件付き更新 → 衝突したら取得→3wayマージ→再試行（他端末の入力を消さない）
  const savingRef=useRef(false);const rerunRef=useRef(false);
  const[unsynced,setUnsynced]=useState(0);
  const syncSave=async()=>{
    const id=currentProjId;if(!id)return;
    if(savingRef.current){rerunRef.current=true;return;}
    savingRef.current=true;
    try{await syncSaveCore(id);}finally{savingRef.current=false;if(rerunRef.current){rerunRef.current=false;setTimeout(()=>{if(syncSaveRef.current)syncSaveRef.current();},300);}}
  };
  const flushBase64=async(id,local)=>{
    let changed=false;let remain=0;const repl=new Map();
    const up=async(dataUrl,tag)=>{try{const blob=await(await fetch(dataUrl)).blob();const u=await sbUploadPhoto(`${id}/${tag}_${Date.now()}_${Math.random().toString(36).slice(2,6)}.jpg`,blob);if(u)repl.set(dataUrl,u);return u;}catch(e){return null;}};
    for(const pt of (local.points||[])){for(const k of Object.keys(pt.photos||{})){for(const ph of (pt.photos[k]||[])){if(ph&&typeof ph.data==="string"&&ph.data.startsWith("data:")){const u=await up(ph.data,`${safeKey(pt.name)}_${safeKey(k)}`);if(u){ph.data=u;changed=true;}else remain++;}}}}
    for(const ph of (local.albumPhotos||[])){if(ph&&typeof ph.data==="string"&&ph.data.startsWith("data:")){const u=await up(ph.data,`album_${safeKey(ph.phase||"x")}`);if(u){ph.data=u;changed=true;}else remain++;}}
    for(const k of Object.keys(local.checkPhotos||{})){for(const ph of (local.checkPhotos[k]||[])){if(ph&&typeof ph.data==="string"&&ph.data.startsWith("data:")){const u=await up(ph.data,`check_${safeKey(k)}`);if(u){ph.data=u;changed=true;}else remain++;}}}
    if(repl.size>0)setCur(p=>{const ph={...(p.photos||{})};let ch=false;for(const k of Object.keys(ph)){ph[k]=(ph[k]||[]).map(x=>(x&&repl.has(x.data))?(ch=true,{...x,data:repl.get(x.data)}):x);}return ch?{...p,photos:ph}:p;});
    return{changed,remain};
  };
  const syncSaveCore=async(id)=>{
    try{
      // 未送信(base64)写真を先にStorageへ → DBには URL だけを入れる
      const work=JSON.parse(JSON.stringify(stateRef.current));
      const fl=await flushBase64(id,work);
      setUnsynced(fl.remain);
      if(fl.changed){applyData(work);}
      if(JSON.stringify(work).length>2500000){setSyncStatus("offline");setToast(`写真${fl.remain}枚が未送信（電波を確認）`);setTimeout(()=>setToast(""),3000);return;}
      let local=fl.changed?work:stateRef.current;let snap=snapRef.current;
      for(let attempt=0;attempt<3;attempt++){
        const name=(local.header&&local.header.projectName)||"";
        let r;
        if(snap.updatedAt)r=await sbConditionalUpdate(id,name,local,snap.updatedAt);
        else r=await sbInsertProject(id,name,local);
        if(r.ok){snapRef.current={updatedAt:r.row.updated_at,data:local};dirtyRef.current=false;lastAppliedRef.current=JSON.stringify(normData(local));mirrorLocal(id,local,r.row.updated_at,false);setSyncStatus("synced");return;}
        // 衝突: クラウドの最新を取ってマージ
        const cloudRow=await sbFetchProject(id);
        if(!cloudRow){const ins=await sbInsertProject(id,name,local);if(ins.ok){snapRef.current={updatedAt:ins.row.updated_at,data:local};dirtyRef.current=false;lastAppliedRef.current=JSON.stringify(normData(local));mirrorLocal(id,local,ins.row.updated_at,false);setSyncStatus("synced");return;}continue;}
        const merged=mergeProjectData(local,cloudRow.data||{},snap.data||{});
        applyData(merged);
        snapRef.current={updatedAt:cloudRow.updated_at,data:cloudRow.data||{}};
        local=merged;snap=snapRef.current;stateRef.current=merged;
        setToast("他端末の更新と統合しました");setTimeout(()=>setToast(""),3000);
      }
      setSyncStatus("offline");
    }catch(e){console.warn("sync err",e);setSyncStatus("offline");}
  };
  const syncSaveRef=useRef(null);syncSaveRef.current=syncSave;

  // 自動保存: 状態変化 → ローカル即時 + 2秒後にクラウド（条件付き）
  useEffect(()=>{
    if(!loaded||!inited||!currentProjId)return;
    if(lastAppliedRef.current!==null&&JSON.stringify(stateRef.current)===lastAppliedRef.current)return;
    dirtyRef.current=true;
    mirrorLocal(currentProjId,stateRef.current,null,true);
    setSyncStatus("syncing");
    if(syncTimer.current)clearTimeout(syncTimer.current);
    syncTimer.current=setTimeout(()=>{if(syncSaveRef.current)syncSaveRef.current();},2000);
  // eslint-disable-next-line
  },[header,design,points,albumPhotos,albumPositions,checkItems,checkPhotos,checkNotes,checkDims,pipeType,roadType,surfaceType,loaded,inited,currentProjId]);

  // 前面復帰・一覧に戻った時・回線復帰: クラウドの最新を取り込む（未保存があればマージ）
  const refreshRef=useRef(null);
  refreshRef.current=async()=>{
    if(!loaded||!currentProjId||screen==="entry")return;
    try{
      const row=await sbFetchProject(currentProjId);
      if(!row)return;
      if(row.updated_at===snapRef.current.updatedAt){if(dirtyRef.current&&syncSaveRef.current)syncSaveRef.current();return;}
      if(dirtyRef.current){
        const merged=mergeProjectData(stateRef.current,row.data||{},snapRef.current.data||{});
        applyData(merged);
        snapRef.current={updatedAt:row.updated_at,data:row.data||{}};
        if(syncSaveRef.current)syncSaveRef.current();
      }else{
        applyData(row.data||{});
        snapRef.current={updatedAt:row.updated_at,data:row.data||{}};
        mirrorLocal(currentProjId,row.data||{},row.updated_at,false);
        setSyncStatus("synced");setToast("他端末の更新を取り込みました");setTimeout(()=>setToast(""),2500);
      }
    }catch(e){}
  };
  useEffect(()=>{
    const onVis=()=>{if(document.visibilityState==="visible"&&refreshRef.current)refreshRef.current();};
    const onOnline=()=>{if(dirtyRef.current&&syncSaveRef.current)syncSaveRef.current();else if(refreshRef.current)refreshRef.current();};
    document.addEventListener("visibilitychange",onVis);window.addEventListener("focus",onVis);window.addEventListener("online",onOnline);
    return()=>{document.removeEventListener("visibilitychange",onVis);window.removeEventListener("focus",onVis);window.removeEventListener("online",onOnline);};
  },[]);
  useEffect(()=>{if(screen==="list"&&refreshRef.current)refreshRef.current();},[screen]);

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
      const id=genUUID();
      setCurrentProjId(id);
      localStorage.setItem("dekigata_currentId",id);
    }
  // eslint-disable-next-line
  },[loaded]);

  // チェックリスト画面に入ったらテンプレをSupabaseから取得
  useEffect(()=>{
    if((screen!=="check"&&screen!=="setup"&&screen!=="list")||tplLoaded)return;
    (async()=>{
      try{const rows=await sbFetchTemplates();setTemplates(rows||[]);}catch(e){console.warn("tpl fetch failed",e);}
      setTplLoaded(true);
    })();
  },[screen,tplLoaded]);

  const newProject=()=>{
    resetSync();
    const id=genUUID();
    setCurrentProjId(id);localStorage.setItem("dekigata_currentId",id);
    setPipeType("DCIP");setRoadType("shidou");setSurfaceType("asphalt");
    setHeader({projectName:"",location:"",diameter:150,projectType:""});
    setDesign({});setPoints([]);setAlbumPhotos([]);setAlbumPositions(["始点","中間点","終点"]);setCheckItems([]);setCheckPhotos({});setCheckNotes({});setCheckDims({});setInited(false);
    setScreen("setup");setShowProjList(false);
    setToast("新規プロジェクト作成");setTimeout(()=>setToast(""),2000);
  };
  const switchProject=(id)=>{
    resetSync();
    setCurrentProjId(id);localStorage.setItem("dekigata_currentId",id);
    setShowProjList(false);setScreen("setup");
    setToast("プロジェクト切替");setTimeout(()=>setToast(""),2000);
  };
  const deleteProject=(id)=>{
    if(!confirm("このプロジェクトを削除しますか?"))return;
    sbDeleteProject(id).catch(()=>{});
    setProjects(prev=>{
      const next=prev.filter(p=>p.id!==id);
      try{localStorage.setItem("dekigata_projects",JSON.stringify(next));}catch(e){}
      if(id===currentProjId){
        if(next.length>0){setCurrentProjId(next[0].id);localStorage.setItem("dekigata_currentId",next[0].id);}
        else{resetSync();const nid=genUUID();setCurrentProjId(nid);localStorage.setItem("dekigata_currentId",nid);setHeader({projectName:"",location:"",diameter:150,projectType:""});setDesign({});setPoints([]);setAlbumPhotos([]);setAlbumPositions(["始点","中間点","終点"]);setCheckItems([]);setCheckPhotos({});setCheckNotes({});setCheckDims({});setInited(false);}
      }
      return next;
    });
  };

  const road=ROADS.find(r=>r.key===roadType);
  const D=road.D;const dia=header.diameter;const od=getOD(pipeType,dia);
  const pipe2=(header.pipe2&&header.pipe2.diameter)?header.pipe2:null;
  const od2=pipe2?getOD(pipe2.pipeType||pipeType,Number(pipe2.diameter)):0;
  const H0=pipeType==="SHIKIRI"?0:(pipe2?D+Math.max(od,od2)+(pipeType==="HPPE"?100:0):calcH0(pipeType,D,dia));
  const D2=pipe2?H0-(pipeType==="HPPE"?100:0)-od2:null;
  const steps0=getSteps(pipeType,roadType,surfaceType,D);
  const steps=pipe2?steps0.map(st=>st.inputs.includes("D")?{...st,inputs:[...st.inputs,"D2"]}:st):steps0;
  const fl=(f)=>pipe2&&f==="D"?"D①":f==="D2"?"D②":f;
  const hasAnchors=(checkItems||[]).some(i=>String(i).trim().startsWith("@"));
  const mergedSteps=hasAnchors?mergeSteps(steps,checkItems):steps;
  const tSum=steps.reduce((s,st)=>s+(st.tKey&&design[st.tKey]?Number(design[st.tKey]):0),0)+(design.ta?Number(design.ta):0);

  const rebuild=(p,r,sf)=>{const st=getSteps(p,r,sf,ROADS.find(x=>x.key===r).D);setDesign(d=>({...getDefaults(st),B:d.B||"",Ba:d.Ba||""}));setPoints([]);};
  if(!inited&&loaded&&currentProjId&&!projects.find(p=>p.id===currentProjId)){rebuild("DCIP","shidou","asphalt");setInited(true);}

  const calcDesignH=(sid,measured)=>{
    if(sid===1)return H0;const bStep=steps.find(s=>s.tKey==="t0");
    if(bStep&&sid===bStep.id)return H0-(Number(design.t0)||0);
    const dm=measuredD(steps,measured||cur.measured);
    let h=dm!==null?dm:D;let ap=false;
    for(const s of steps){if(s.inputs.includes("D")){ap=true;continue;}if(!ap)continue;if(s.id>sid)break;if(s.tKey&&s.tKey!=="t0"&&design[s.tKey])h-=Number(design[s.tKey]);}
    return Math.round(h);
  };
  const dv=(f,sid)=>{if(f==="H")return calcDesignH(sid);if(f==="B")return design.B?Number(design.B):null;if(f==="Ba")return design.Ba?Number(design.Ba):null;if(f==="D")return D;if(f==="D2")return D2;if(f==="ta")return Number(design.ta)||40;return design[f]?Number(design[f]):null;};
  const calcT=(step,meas)=>calcTm(step,steps,meas);
  const prevLbl=(step)=>{if(!step.prevRef)return"";if(step.prevRef==="D"){const ds=steps.find(s=>s.inputs.includes("D"));return`D(${ds?.id})−H(${step.id})`;}return`H(${step.prevRef})−H(${step.id})`;};

  const selPipe=(k)=>{setPipeType(k);const ds=getDias(k);if(ds.length&&!ds.includes(header.diameter))setHeader(h=>({...h,diameter:ds[0]}));rebuild(k,roadType,surfaceType);};
  const selRoad=(k)=>{setRoadType(k);rebuild(pipeType,k,surfaceType);};
  const selSurface=(k)=>{setSurfaceType(k);rebuild(pipeType,roadType,k);};
  const bulkCreate=()=>{const pts=[];for(let i=1;i<=bulkCount;i++)pts.push({name:`No.${i}`,date:"",measured:{},photos:{}});setPoints(pts);};
  const editPoint=(i)=>{const p=JSON.parse(JSON.stringify(points[i]));if(!p.photos)p.photos={};setCur(p);setEditIdx(i);setScreen("entry");};
  const savePoint=()=>{if(editIdx!==null)setPoints(p=>{const n=[...p];n[editIdx]={...cur};return n;});setScreen("list");};
  // 測点編集中は cur の変更を即 points に反映（=自動保存→クラウドへ）。保存ボタン待ちで消える事故を構造で防ぐ
  useEffect(()=>{
    if(screen!=="entry"||editIdx===null)return;
    setPoints(p=>{
      if(!p[editIdx])return p;
      if(JSON.stringify(p[editIdx])===JSON.stringify(cur))return p;
      const n=[...p];n[editIdx]={...cur};return n;
    });
  // eslint-disable-next-line
  },[cur,screen,editIdx]);

  const autoFieldVal=(k)=>{if(k==="管径"){if(!header.diameter)return"—";return pipe2?`φ${dia}+φ${pipe2.diameter}`:`φ${header.diameter}`;}return"";};
  const renderFields=(spec,get,set)=>(<div style={{marginTop:8,display:"flex",flexDirection:"column",gap:6}}>
    {spec.map(f=>{
      if(f.t==="auto")return(<div key={f.k} style={{fontSize:12,color:"#1565C0",fontWeight:600}}>{f.k}：{autoFieldVal(f.k)}<span style={{fontSize:12,color:"#888",marginLeft:4}}>（設定から自動）</span></div>);
      if(f.t==="choice")return(<div key={f.k} style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}><span style={{fontSize:12,fontWeight:700,minWidth:40}}>{f.k}</span>
        {f.o.map(o=>{const on=get(f.k)===o;return(<button key={o} onClick={()=>set(f.k,on?"":o)} style={{padding:"6px 12px",borderRadius:14,border:`1.5px solid ${on?"#1565C0":"#ccc"}`,background:on?"#1565C0":"#fff",color:on?"#fff":"#555",fontSize:13,fontWeight:700,cursor:"pointer"}}>{o}</button>);})}</div>);
      if(f.t==="num")return(<div key={f.k} style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:12,fontWeight:700,minWidth:40}}>{f.k}</span>
        <input inputMode="decimal" style={{...S.inp,width:96,textAlign:"right",fontSize:16,fontWeight:700,padding:"7px 8px"}} value={get(f.k)||""} onChange={e=>set(f.k,e.target.value.replace(/[^0-9.\-]/g,""))} placeholder="0"/><span style={{fontSize:12,color:"#888"}}>{f.u||""}</span></div>);
      return null;})}
  </div>);
  const composeNote=(item)=>{
    const spec=photoSpec(item);
    if(spec){const free=(checkNotes[item]||"").trim();const pairs=fieldPairs(spec,(k)=>(checkDims[item]||{})[k],autoFieldVal).map(([k,v])=>`${k}${v}`);if(free)pairs.push(free);return pairs.join(" ");}
    const d=checkDims[item]||{};
    const parts=DIM_LABELS.filter(l=>d[l]!==undefined&&String(d[l]).trim()!=="").map(l=>`${l}${String(d[l]).trim()}`);
    const free=(checkNotes[item]||"").trim();
    if(free)parts.push(free);
    return parts.join(" ");
  };
  const takePhoto=(stepId)=>{setAlbumTarget(null);setCheckTarget(null);setPhotoStep(stepId);if(fileRef.current){fileRef.current.value="";fileRef.current.click();}};
  const takeAlbumPhoto=(phase,position)=>{setPhotoStep(null);setCheckTarget(null);setAlbumTarget({phase,position});if(fileRef.current){fileRef.current.value="";fileRef.current.click();}};
  const takeCheckPhoto=(item)=>{setPhotoStep(null);setAlbumTarget(null);setCheckTarget(item);if(fileRef.current){fileRef.current.value="";fileRef.current.click();}};
  const onPhotoTaken=(e)=>{
    const file=e.target.files?.[0];if(!file||(photoStep===null&&!albumTarget&&!checkTarget))return;
    const reader=new FileReader();
    reader.onload=(ev)=>{
      const img=new Image();
      img.onload=()=>{
        const canvas=document.createElement("canvas");
        const MAXPX=1600;const sc=Math.min(1,MAXPX/Math.max(img.width,img.height));
        canvas.width=Math.round(img.width*sc);canvas.height=Math.round(img.height*sc);
        const ctx=canvas.getContext("2d");
        ctx.drawImage(img,0,0,canvas.width,canvas.height);
        const cw=canvas.width,chh=canvas.height;
        // 黒板（写真の約1/6、左下に配置）
        const bbW=Math.round(cw*0.32);
        const bbH=Math.round(chh*0.30);
        const bbX=Math.round(cw*0.02);
        const bbY=chh-bbH-Math.round(chh*0.02);
        ctx.fillStyle="#0a4d2e";ctx.fillRect(bbX,bbY,bbW,bbH);
        ctx.strokeStyle="#f5f5dc";ctx.lineWidth=Math.max(2,bbW*0.006);
        ctx.strokeRect(bbX+3,bbY+3,bbW-6,bbH-6);
        ctx.fillStyle="#f5f5dc";
        const pad=Math.round(bbW*0.04);
        if(checkTarget){
          // ── チェックリスト用 表組み黒板（中央=項目名） ──
          const lw=Math.max(1.5,bbW*0.004);
          ctx.strokeStyle="#f5f5dc";ctx.lineWidth=lw;
          const rowH=Math.round(bbH*0.13);
          const labelW=Math.round(bbW*0.24);
          const rows=[["工事件名",header.projectName||""],["分　類","工事写真"],["工　種",`${header.workKind||""}${header.diameter?` φ${header.diameter}`:""}`.trim()],["場　所",header.location||""]];
          let ry=bbY+3;
          const fsL=Math.round(rowH*0.42);const fsV=Math.round(rowH*0.46);
          rows.forEach(([k,v])=>{
            ctx.strokeRect(bbX+3,ry,labelW,rowH);
            ctx.strokeRect(bbX+3+labelW,ry,bbW-6-labelW,rowH);
            ctx.font=`bold ${fsL}px "Hiragino Sans","MS Gothic",sans-serif`;
            ctx.fillText(k,bbX+3+Math.round(labelW*0.08),ry+rowH*0.66);
            ctx.font=`bold ${fsV}px "Hiragino Sans","MS Gothic",sans-serif`;
            let vv=String(v);
            const maxW=bbW-6-labelW-pad;
            while(vv&&ctx.measureText(vv).width>maxW)vv=vv.slice(0,-1);
            ctx.fillText(vv,bbX+3+labelW+Math.round(pad*0.6),ry+rowH*0.66);
            ry+=rowH;
          });
          const centerY=ry+(bbY+bbH-ry)/2;
          let bigFs=Math.round(bbH*0.13);
          ctx.textAlign="center";
          ctx.font=`bold ${bigFs}px "Hiragino Sans","MS Gothic",sans-serif`;
          while(bigFs>10&&ctx.measureText(checkTarget).width>bbW-pad*2){bigFs-=2;ctx.font=`bold ${bigFs}px "Hiragino Sans","MS Gothic",sans-serif`;}
          const note=composeNote(checkTarget);
          if(note){
            const nameY=centerY-bigFs*0.55;
            ctx.fillText(checkTarget,bbX+bbW/2,nameY);
            let nfs=Math.round(bbH*0.085);
            ctx.font=`bold ${nfs}px "Hiragino Sans","MS Gothic",sans-serif`;
            const maxW=bbW-pad*2;
            const noteLines=[];let buf="";
            for(const ch of note){
              if(ctx.measureText(buf+ch).width>maxW){noteLines.push(buf);buf=ch;if(noteLines.length>=2)break;}
              else buf+=ch;
            }
            if(buf&&noteLines.length<2)noteLines.push(buf);
            noteLines.forEach((ln,i)=>ctx.fillText(ln,bbX+bbW/2,nameY+bigFs*0.75+nfs*1.25*(i+1)-nfs*0.25));
            ctx.font=`bold ${Math.round(bbH*0.065)}px "Hiragino Sans","MS Gothic",sans-serif`;
            ctx.fillText(today(),bbX+bbW/2,Math.min(bbY+bbH-pad,nameY+bigFs*0.75+nfs*1.25*noteLines.length+bbH*0.09));
          }else{
            ctx.fillText(checkTarget,bbX+bbW/2,centerY);
            ctx.font=`bold ${Math.round(bbH*0.07)}px "Hiragino Sans","MS Gothic",sans-serif`;
            ctx.fillText(today(),bbX+bbW/2,centerY+bigFs*1.1);
          }
          ctx.textAlign="left";
        }else if(albumTarget){
          // ── 蔵衛門スタイル表組み黒板 ──
          const lw=Math.max(1.5,bbW*0.004);
          ctx.strokeStyle="#f5f5dc";ctx.lineWidth=lw;
          const rowH=Math.round(bbH*0.13);
          const labelW=Math.round(bbW*0.24);
          const rows=[["工事件名",header.projectName||""],["分　類","着手前及び完成"],["工　種",""],["場　所",header.location||""]];
          let ry=bbY+3;
          const fsL=Math.round(rowH*0.42);const fsV=Math.round(rowH*0.46);
          rows.forEach(([k,v])=>{
            ctx.strokeRect(bbX+3,ry,labelW,rowH);
            ctx.strokeRect(bbX+3+labelW,ry,bbW-6-labelW,rowH);
            ctx.font=`bold ${fsL}px "Hiragino Sans","MS Gothic",sans-serif`;
            ctx.fillText(k,bbX+3+Math.round(labelW*0.08),ry+rowH*0.66);
            ctx.font=`bold ${fsV}px "Hiragino Sans","MS Gothic",sans-serif`;
            let vv=String(v);
            const maxW=bbW-6-labelW-pad;
            while(vv&&ctx.measureText(vv).width>maxW)vv=vv.slice(0,-1);
            ctx.fillText(vv,bbX+3+labelW+Math.round(pad*0.6),ry+rowH*0.66);
            ry+=rowH;
          });
          // 中央に大きく「着手前/完成 + 位置」
          const phaseLabel=albumTarget.phase==="pre"?"着手前":"完成";
          const centerY=ry+(bbY+bbH-ry)/2;
          const bigFs=Math.round(bbH*0.135);
          ctx.font=`bold ${bigFs}px "Hiragino Sans","MS Gothic",sans-serif`;
          ctx.textAlign="center";
          ctx.fillText(phaseLabel,bbX+bbW/2,centerY-bigFs*0.2);
          ctx.fillText(albumTarget.position,bbX+bbW/2,centerY+bigFs*1.0);
          ctx.textAlign="left";
        }else{
          // ── 工程用 key-value黒板 ──
          const step=mergedSteps.find(s=>s.id===photoStep)||steps.find(s=>s.id===photoStep);
          const baseFs=Math.round(bbH*0.095);
          const lineH=Math.round(bbH*0.1);
          let ty=bbY+pad+baseFs;
          const lines=[];
          if(header.projectName)lines.push(["工事名",header.projectName.length>12?header.projectName.slice(0,12)+"…":header.projectName]);
          lines.push(["測点",cur.name||""]);
          lines.push(["工程",step.photoOnly?step.name:`${step.id}.${step.name}`]);
          if(step.photoOnly){const spec=photoSpec(step.name);if(spec)fieldPairs(spec,(k)=>cur.measured[`${step.id}_f_${k}`],autoFieldVal).forEach(([k,v])=>lines.push([k,v]));}
          lines.push(["管種",pipe2?`${PL[pipeType]}φ${dia}+${PL[pipe2.pipeType||pipeType]}φ${pipe2.diameter}`:`${PL[pipeType]} φ${dia}`]);
          if(!step.photoOnly){
            const hVal=(()=>{if(step.id===1)return H0;const bs=steps.find(s=>s.tKey==="t0");if(bs&&step.id===bs.id)return H0-(Number(design.t0)||0);const dmB=measuredD(steps,cur.measured);let h=dmB!==null?dmB:D;let a=false;for(const x of steps){if(x.inputs.includes("D")){a=true;continue;}if(!a)continue;if(x.id>step.id)break;if(x.tKey&&x.tKey!=="t0"&&design[x.tKey])h-=Number(design[x.tKey]);}return h;})();
            const mvB=(f)=>{const v=cur.measured[`${step.id}_${f}`];return(v===undefined||v==="")?null:Number(v);};
            const dl=(lbl,dsg,f)=>{const m=mvB(f);if(m!==null&&dsg!==null&&dsg!==""){const j=judge(m-Number(dsg),f)||"";lines.push([lbl,`設${dsg} 実${m}${j}`]);}else lines.push([lbl,`設計${dsg!==null&&dsg!==""?dsg:"—"}`]);};
            if(step.inputs.includes("H"))dl("H",hVal,"H");
            if(step.inputs.includes("B")&&mvB("B")!==null)dl("B",design.B||"","B");
            if(step.inputs.includes("D"))dl(pipe2?"D①":"D",D,"D");
            if(step.inputs.includes("D2"))dl("D②",D2,"D2");
            if(step.inputs.includes("D")&&cur.measured[`${step.id}_f_トルク`]){const tv=cur.measured[`${step.id}_f_トルク`];lines.push(tv==="直管"?["継手","直管(トルク無)"]:["トルク",tv]);}
            if(step.inputs.includes("Ba"))dl("Ba",design.Ba||"","Ba");
            if(step.inputs.includes("ta"))dl("ta",Number(design.ta)||40,"ta");
            if(step.tKey&&design[step.tKey]){const tD=Number(design[step.tKey]);const tM=calcTm(step,steps,cur.measured);if(tM!==null){const j=judge(tM-tD,step.tKey)||"";lines.push([step.tKey,`設${tD} 実${Math.round(tM)}${j}`]);}else lines.push([step.tKey,`設計${tD}`]);}
            step.extra.forEach(ex=>{const m=autoExtra(ex,step,steps,cur.measured);if(m!==null){const j=judge(m-ex.design,ex.key,ex)||"";lines.push([ex.key,`設${ex.design} 実${m}${j}`]);}});
          }
          lines.push(["日付",((cur.dates||{})[step.id])||today()]);
          lines.push(["会社","(有)信濃住宅設備"]);
          lines.forEach(([k,v])=>{
            if(ty>bbY+bbH-pad)return;
            ctx.font=`bold ${Math.round(baseFs*0.7)}px "Hiragino Sans","MS Gothic",sans-serif`;
            ctx.fillText(k,bbX+pad,ty);
            ctx.font=`bold ${Math.round(baseFs*0.85)}px "Hiragino Sans","MS Gothic",sans-serif`;
            ctx.fillText(String(v),bbX+pad+Math.round(bbW*0.22),ty);
            ty+=lineH;
          });
        }
        canvas.toBlob(async(blob)=>{
          let src=null;
          try{
            const tag=checkTarget?"check":albumTarget?`album_${albumTarget.phase}`:`${safeKey(cur.name||"pt")}_${safeKey(String(photoStep))}`;
            const path=`${currentProjId||"misc"}/${tag}_${Date.now()}.jpg`;
            src=await sbUploadPhoto(path,blob);
          }catch(e){console.warn("photo upload failed, using base64",e);}
          if(!src)src=canvas.toDataURL("image/jpeg",0.8);
          if(checkTarget){
            const it=checkTarget;const nt=composeNote(it);
            setCheckPhotos(p=>({...p,[it]:[...(p[it]||[]),{data:src,time:nowTime(),note:nt}]}));
          }else if(albumTarget){
            const at=albumTarget;
            setAlbumPhotos(p=>[...p,{id:genUUID(),phase:at.phase,position:at.position,data:src,time:nowTime()}]);
          }else{
            setCur(p=>{const ph={...p.photos};const a=ph[photoStep]||[];ph[photoStep]=[...a,{data:src,time:nowTime()}];const ds={...(p.dates||{})};if(!ds[photoStep])ds[photoStep]=today();return{...p,photos:ph,dates:ds,date:p.date||today()};});
          }
        },"image/jpeg",0.85);
      };
      img.src=ev.target.result;
    };
    reader.readAsDataURL(file);
  };
  const delPhoto=(sid,idx)=>{setCur(p=>{const ph={...p.photos};const a=[...(ph[sid]||[])];a.splice(idx,1);ph[sid]=a;return{...p,photos:ph};});};
  const totalPhotos=(pt)=>{if(!pt.photos)return 0;return Object.values(pt.photos).reduce((s,a)=>s+a.length,0);};

  const handlePDF=()=>{
    generatePDF({header,pipeType,roadType,surfaceType,design,points,steps:mergedSteps,dia,od,D,H0,pipe2,od2,D2,mode:"dekigata"});
    setToast("出来形PDF出力");setTimeout(()=>setToast(""),3000);
  };
  const handleStatusPDF=()=>{
    generatePDF({header,pipeType,roadType,surfaceType,design,points,steps:mergedSteps,dia,od,D,H0,pipe2,od2,D2,mode:"status"});
    setToast("施工状況写真PDF出力");setTimeout(()=>setToast(""),3000);
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
  if(screen==="setup"){const dias=getDias(pipeType);
    const workMode=header.projectType===undefined?"public":header.projectType;
    const seqTpls=(templates||[]).filter(t=>(Array.isArray(t.items)?t.items:[]).some(i=>String(i).trim().startsWith("@")));
    const simpleTpls=(templates||[]).filter(t=>!seqTpls.includes(t));
    const selSimple=(tpl)=>{setHeader(h=>({...h,projectType:"simple",workKind:tpl.name,diameter:""}));setCheckItems(Array.isArray(tpl.items)?tpl.items:[]);};
    const selPublic=()=>{setHeader(h=>({...h,projectType:"public",workKind:"",diameter:h.diameter&&Number(h.diameter)>0?Number(h.diameter):150}));if((checkItems||[]).length===0&&seqTpls[0])setCheckItems(seqTpls[0].items);};
    return(<div style={{...S.w,zoom:fontScale}}>
    <div style={S.top}><h1 style={S.logo}>出来形かんたん <span style={{fontSize:10,color:"#bbb",fontWeight:500}}>v{APP_VERSION}</span></h1><div style={{display:"flex",alignItems:"center",gap:6}}><span style={S.bg}>{workMode==="simple"?"簡易":"1/3"}</span><button style={{...S.bk,fontSize:20,padding:"4px 8px"}} onClick={()=>setShowProjList(true)} title="プロジェクト一覧">≡</button></div></div>
    <div style={S.c}><div style={S.ch}>工事情報</div>
      {[["projectName","工事名"],["location","工事箇所"]].map(([k,l])=>(<div key={k} style={{marginBottom:8}}><label style={S.lb}>{l}</label><input style={S.inp} value={header[k]||""} onChange={e=>setHeader(h=>({...h,[k]:e.target.value}))} placeholder={l}/></div>))}</div>
    <div style={S.c}><div style={S.ch}>工種を選ぶ</div>
      <div style={{display:"flex",flexDirection:"column",gap:6}}>
        {simpleTpls.map(tpl=>(<button key={tpl.id} onClick={()=>selSimple(tpl)} style={{...S.sel,textAlign:"left",padding:"10px 14px",...(workMode==="simple"&&header.workKind===tpl.name?S.selOn:{})}}>
          <div style={{fontSize:14,fontWeight:700}}>{tpl.name}</div>
          <div style={{fontSize:12,opacity:.6}}>{(Array.isArray(tpl.items)?tpl.items:[]).length}項目・撮影チェックリスト</div></button>))}
        {!tplLoaded&&<div style={{fontSize:12,color:"#888",textAlign:"center",padding:"6px 0"}}>工種テンプレ読込中…</div>}
        <button onClick={selPublic} style={{...S.sel,textAlign:"left",padding:"10px 14px",borderWidth:2,...(workMode==="public"?S.selOn:{})}}>
          <div style={{fontSize:14,fontWeight:700}}>公共工事・配水管布設（出来形管理）</div>
          <div style={{fontSize:12,opacity:.6}}>{seqTpls[0]?`工程テンプレ「${seqTpls[0].name}」で状況写真と出来形を一本の流れに展開`:"測点・検測・検査記録表・写真台帳フル装備"}</div></button>
      </div></div>
    {workMode==="simple"&&<>
      <div style={S.c}><div style={S.ch}>口径（任意）</div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:18,fontWeight:700}}>φ</span>
          <input inputMode="decimal" style={{...S.inp,width:110,fontSize:17,textAlign:"right",fontWeight:700}} value={header.diameter||""} onChange={e=>setHeader(h=>({...h,diameter:e.target.value.replace(/[^0-9.]/g,"")}))} placeholder="20"/>
          <span style={{fontSize:12,color:"#888"}}>黒板に入ります（空欄OK・後から変更可）</span></div></div>
      <button style={S.pri} onClick={()=>setScreen("check")}>📷 撮影スタート →</button>
    </>}
    {workMode==="public"&&<>
    <div style={S.c}><div style={S.ch}>管種</div><div style={{display:"flex",gap:6}}>
      {["DCIP","HPPE"].map(k=>(<button key={k} onClick={()=>selPipe(k)} style={{...S.sel,flex:1,...(pipeType===k?S.selOn:{})}}><div style={{fontSize:14,fontWeight:700}}>{k}</div><div style={{fontSize:12,opacity:.6}}>{k==="DCIP"?"ダクタイル鋳鉄管":"ポリエチレン管"}</div></button>))}
      <button onClick={()=>selPipe("SHIKIRI")} style={{...S.sel,flex:.7,...(pipeType==="SHIKIRI"?S.selOn:{})}}><div style={{fontSize:12,fontWeight:700}}>仕切弁筐</div></button></div></div>
    {pipeType!=="SHIKIRI"&&<>
      <div style={S.c}><div style={S.ch}>道路種別</div><div style={{display:"flex",gap:8}}>
        {ROADS.map(r=>(<button key={r.key} onClick={()=>selRoad(r.key)} style={{...S.rb,...(roadType===r.key?S.rbOn:{})}}><span style={{fontSize:22,fontWeight:700}}>{r.label}</span><span style={{fontSize:12,opacity:.7}}>D={r.D}</span></button>))}</div></div>
      <div style={S.c}><div style={S.ch}>路面</div><div style={{display:"flex",gap:8}}>
        {SURFACES.map(sf=>(<button key={sf.key} onClick={()=>selSurface(sf.key)} style={{...S.sfb,...(surfaceType===sf.key?S.sfbOn:{})}}><span style={{fontSize:16,fontWeight:700}}>{sf.label}</span><span style={{fontSize:12,opacity:.6}}>{sf.key==="asphalt"?"舗装あり":"舗装なし"}</span></button>))}</div></div>
      <div style={S.c}><div style={S.ch}>口径</div><div style={{display:"flex",flexWrap:"wrap",gap:6}}>
        {dias.map(d=>(<button key={d} onClick={()=>setHeader(h=>({...h,diameter:d}))} style={{...S.db,...(dia===d?S.dbOn:{})}}><div style={{fontSize:15,fontWeight:700}}>φ{d}</div><div style={{fontSize:12,opacity:.6}}>OD {getOD(pipeType,d)}</div></button>))}</div></div>
      <div style={S.c}><div style={S.ch}>2条配管</div>
        <div style={{display:"flex",gap:6}}>
          <button onClick={()=>setHeader(h=>{const n={...h};delete n.pipe2;return n;})} style={{...S.sel,flex:1,...(!header.pipe2?S.selOn:{})}}><div style={{fontSize:13,fontWeight:700}}>1条（通常）</div></button>
          <button onClick={()=>setHeader(h=>({...h,pipe2:h.pipe2||{pipeType:pipeType,diameter:dia}}))} style={{...S.sel,flex:1,...(header.pipe2?S.selOn:{})}}><div style={{fontSize:13,fontWeight:700}}>2条目あり</div><div style={{fontSize:12,opacity:.6}}>同一掘削に2本並列</div></button></div>
        {header.pipe2&&(<>
          <div style={{fontSize:12,color:"#888",margin:"8px 0 4px"}}>2条目の管種・口径（1条目は口径の大きい方＝主管にしてください）</div>
          <div style={{display:"flex",gap:6,marginBottom:6}}>
            {["DCIP","HPPE"].map(k=>(<button key={k} onClick={()=>setHeader(h=>{const ds=getDias(k);const cd=Number(h.pipe2?.diameter);return{...h,pipe2:{pipeType:k,diameter:ds.includes(cd)?cd:ds[0]}};})} style={{...S.sel,flex:1,...((header.pipe2.pipeType||pipeType)===k?S.selOn:{})}}><div style={{fontSize:13,fontWeight:700}}>{k}</div></button>))}
            <button onClick={()=>setHeader(h=>({...h,pipe2:{pipeType:pipeType,diameter:dia}}))} style={{...S.sel,flex:1}}><div style={{fontSize:12,fontWeight:700}}>1条目と同じ</div></button></div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {getDias(header.pipe2.pipeType||pipeType).map(d=>(<button key={d} onClick={()=>setHeader(h=>({...h,pipe2:{...h.pipe2,diameter:d}}))} style={{...S.db,...(Number(header.pipe2.diameter)===d?S.dbOn:{})}}><div style={{fontSize:14,fontWeight:700}}>φ{d}</div><div style={{fontSize:12,opacity:.6}}>OD {getOD(header.pipe2.pipeType||pipeType,d)}</div></button>))}</div>
          {od2>od&&<div style={{fontSize:12,color:"#C62828",marginTop:6,fontWeight:600}}>⚠ 2条目の方が大きい口径です。1条目（主管）と入れ替えてください</div>}
          <div style={{fontSize:12,color:"#1565C0",marginTop:6}}>設計H={H0}（大きい方のODで決定）／ 設計D①={D}　D②={D2}（同床付け・OD差分）</div>
        </>)}
      </div>
    </>}
    <button style={S.pri} onClick={()=>setScreen("design")}>設計値確認 →</button>
    </>}
    {showProjList&&(<div onClick={()=>setShowProjList(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:9999,display:"flex",alignItems:"flex-start",justifyContent:"center",padding:20,paddingTop:60}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:12,padding:20,maxWidth:480,width:"100%",maxHeight:"80vh",overflowY:"auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <h2 style={{fontSize:18,fontWeight:700,margin:0}}>プロジェクト一覧 <span style={{fontSize:11,color:"#999",fontWeight:500}}>v{APP_VERSION}</span></h2>
          <button style={{background:"none",border:"none",fontSize:24,cursor:"pointer",color:"#888",padding:"0 8px"}} onClick={()=>setShowProjList(false)}>×</button>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12,padding:"8px 10px",background:"#f5f5f5",borderRadius:8}}>
          <span style={{fontSize:13,fontWeight:600,flex:1}}>文字サイズ</span>
          {[["標準",1.0],["大",1.15],["特大",1.3]].map(([l,z])=>(<button key={l} onClick={()=>setZoom(z)} style={{padding:"6px 12px",borderRadius:14,border:`1.5px solid ${fontScale===z?"#1565C0":"#ccc"}`,background:fontScale===z?"#1565C0":"#fff",color:fontScale===z?"#fff":"#555",fontSize:13,fontWeight:700,cursor:"pointer"}}>{l}</button>))}
        </div>
        <button style={{...S.exp,marginBottom:10,background:"#f5f5f5",color:"#555",border:"1px solid #ddd"}} onClick={()=>{window.location.reload();}}>🔄 最新版に更新（v{APP_VERSION}）</button>
        <button style={{...S.pri,marginBottom:16}} onClick={newProject}>+ 新規プロジェクト</button>
        {projects.length===0?(<div style={{textAlign:"center",padding:"20px 0",color:"#888",fontSize:13}}>プロジェクトなし</div>):(
          projects.sort((a,b)=>(b.updatedAt||"").localeCompare(a.updatedAt||"")).map(pj=>{
            const isCurrent=pj.id===currentProjId;
            const pipeLabel=pj.header?.workKind||PL[pj.pipeType||"DCIP"];
            const nameShow=pj.header?.projectName||"(名称未設定)";
            const ptsN=pj.points?.length||0;
            const dt=pj.updatedAt?new Date(pj.updatedAt).toLocaleString("ja-JP",{month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"}):"";
            return(<div key={pj.id} style={{border:isCurrent?"2px solid #1565C0":"1px solid #ddd",borderRadius:10,padding:"10px 12px",marginBottom:8,background:isCurrent?"#E3F2FD":"#fff"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:15,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{nameShow}{isCurrent&&<span style={{fontSize:12,color:"#1565C0",marginLeft:6}}>（現在）</span>}</div>
                  <div style={{fontSize:12,color:"#888",marginTop:2}}>{pipeLabel} φ{pj.header?.diameter||"—"} / {ptsN}測点 / {dt}</div>
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
  if(screen==="design"){return(<div style={{...S.w,zoom:fontScale}}>
    <div style={S.top}><button style={S.bk} onClick={()=>setScreen("setup")}>← 設定</button><span style={S.bg}>2/3 設計値</span></div>
    {pipe2&&<div style={{...S.c,background:"#E3F2FD",border:"1px solid #90CAF9"}}><div style={{fontSize:13,fontWeight:700,color:"#1565C0"}}>2条配管：{PL[pipeType]}φ{dia} ＋ {PL[pipe2.pipeType||pipeType]}φ{pipe2.diameter}</div>
      <div style={{fontSize:12,color:"#333",marginTop:4}}>設計H={H0}mm（大きい方のOD）／ D①={D}mm　D②={D2}mm（同一床付け、OD差分で自動）</div></div>}
    <div style={S.c}><div style={S.ch}>手入力</div>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><div style={{flex:1,fontSize:14,fontWeight:600}}>床付幅 B</div>
        <input type="number" inputMode="decimal" style={{...S.ni,width:100}} value={design.B??""} placeholder="mm" onChange={e=>setDesign(d=>({...d,B:e.target.value}))}/></div>
      {surfaceType==="asphalt"&&<div style={{display:"flex",alignItems:"center",gap:8}}><div style={{flex:1,fontSize:14,fontWeight:600}}>舗装幅 Ba</div>
        <input type="number" inputMode="decimal" style={{...S.ni,width:100}} value={design.Ba??""} placeholder="mm" onChange={e=>setDesign(d=>({...d,Ba:e.target.value}))}/></div>}</div>
    <div style={S.c}><div style={S.ch}>各層の設計厚</div>
      {steps.map(s=>{if(!s.tKey)return null;return(<div key={s.id} style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
        <span style={S.sd}>{s.id}</span><div style={{flex:1}}><span style={{fontSize:13,fontWeight:600}}>{s.tKey}</span><span style={{fontSize:12,color:"#888",marginLeft:4}}>{s.name}</span></div>
        <input type="number" inputMode="decimal" style={{...S.ni,width:70}} value={design[s.tKey]??""} placeholder="mm" onChange={e=>setDesign(d=>({...d,[s.tKey]:e.target.value}))}/></div>);})}
    </div>
    <div style={S.c}><div style={S.ch}>各工程の設計H</div>
      {steps.map(s=>{if(!s.inputs.includes("H"))return null;return(<div key={s.id} style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
        <span style={S.sd}>{s.id}</span><span style={{flex:1,fontSize:13}}>{s.name}</span>
        <span style={{fontSize:14,fontWeight:700,color:s.id===1?"#E65100":"#1565C0"}}>H={calcDesignH(s.id)}</span></div>);})}
    </div>
    <button style={S.pri} onClick={()=>{if(!points.length)setScreen("bulk");else setScreen("list");}}>{!points.length?"測点作成 →":"現場入力 →"}</button></div>);}

  // ═══ BULK ═══
  if(screen==="bulk"){return(<div style={{...S.w,zoom:fontScale}}>
    <div style={S.top}><button style={S.bk} onClick={()=>setScreen("design")}>← 設計値</button><span style={S.bg}>測点作成</span></div>
    <div style={S.c}><div style={{display:"flex",alignItems:"center",gap:12,justifyContent:"center",marginBottom:16}}>
      <button style={S.cb} onClick={()=>setBulkCount(c=>Math.max(1,c-1))}>−</button>
      <div style={{fontSize:36,fontWeight:700,width:60,textAlign:"center"}}>{bulkCount}</div>
      <button style={S.cb} onClick={()=>setBulkCount(c=>Math.min(20,c+1))}>+</button></div></div>
    <button style={S.pri} onClick={()=>{bulkCreate();setScreen("list");}}>No.1〜No.{bulkCount} を作成</button></div>);}

  // ═══ ENTRY ═══
  if(screen==="entry"){
    const doneState=(st)=>{const ph=((cur.photos&&cur.photos[st.id])||[]).length>0;if(st.photoOnly)return ph?"done":"none";const filled=st.inputs.length>0&&st.inputs.every(f=>{const v=cur.measured[`${st.id}_${f}`];return v!==undefined&&v!=="";});if(filled&&ph)return"done";if(filled||ph)return"partial";return"none";};
    const doneN=mergedSteps.filter(st=>doneState(st)==="done").length;
    const firstOpen=mergedSteps.findIndex(st=>doneState(st)!=="done");
    const jumpTo=(i)=>{const el=document.getElementById(`stepcard-${i}`);if(el)el.scrollIntoView({behavior:"smooth",block:"start"});};
    const stCol=(d)=>d==="done"?"#2E7D32":d==="partial"?"#F9A825":"#ccc";
    return(<div style={{...S.w,zoom:fontScale}}>
    <input ref={fileRef} type="file" accept="image/*" capture="environment" style={{display:"none"}} onChange={onPhotoTaken}/>
    <div style={S.top}><button style={S.bk} onClick={()=>setScreen("list")}>← 戻る</button><span style={S.bg}>{cur.name}</span></div>
    <div style={{position:"sticky",top:0,zIndex:50,background:"var(--color-background-primary,#fff)",padding:"8px 6px",marginBottom:8,borderBottom:"1px solid #e0e0e0"}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:15,fontWeight:700}}>完了 {doneN} / {mergedSteps.length}{firstOpen>=0&&<span style={{fontSize:12,color:"#E65100",marginLeft:8}}>次：{mergedSteps[firstOpen].name}</span>}{firstOpen<0&&<span style={{fontSize:12,color:"#2E7D32",marginLeft:8}}>全工程 完了 ✅</span>}</div>
          <div style={{height:8,background:"#eee",borderRadius:4,marginTop:5,overflow:"hidden"}}><div style={{width:`${mergedSteps.length?Math.round(doneN/mergedSteps.length*100):0}%`,height:"100%",background:firstOpen<0?"#2E7D32":"#1565C0",transition:"width .3s"}}/></div>
        </div>
        {(()=>{const b=unsynced>0?{t:`⚠ 未送信${unsynced}枚`,c:"#C62828",bg:"#FFEBEE"}:syncStatus==="synced"?{t:"☁ 同期済",c:"#2E7D32",bg:"#E8F5E9"}:syncStatus==="syncing"?{t:"☁ 同期中…",c:"#E65100",bg:"#FFF3E0"}:{t:"⚠ オフライン",c:"#C62828",bg:"#FFEBEE"};return(<span style={{fontSize:11,fontWeight:700,color:b.c,background:b.bg,padding:"4px 8px",borderRadius:10,whiteSpace:"nowrap"}}>{b.t}</span>);})()}
        <button onClick={()=>jumpTo(firstOpen<0?mergedSteps.length-1:firstOpen)} style={{...S.camBtn,padding:"9px 12px",whiteSpace:"nowrap"}}>▼ 次へ</button>
      </div>
      <div style={{display:"flex",gap:3,marginTop:6,flexWrap:"wrap"}}>
        {mergedSteps.map((st,i)=>{const d=doneState(st);return(<button key={st.id} onClick={()=>jumpTo(i)} title={st.name} style={{width:14,height:14,borderRadius:3,border:"none",padding:0,background:stCol(d),cursor:"pointer",opacity:d==="none"?0.5:1}}/>);})}
      </div>
    </div>
    <div style={S.c}><div style={{display:"flex",gap:8}}>
      <div style={{flex:1}}><label style={S.lb}>測点</label><input style={{...S.inp,fontWeight:700,fontSize:18}} value={cur.name} onChange={e=>setCur(p=>({...p,name:e.target.value}))}/></div>
      <div style={{flex:1}}><label style={S.lb}>日付（既定・工程ごとに📅で上書き可）</label><input type="date" style={S.inp} value={cur.date||""} onChange={e=>setCur(p=>({...p,date:e.target.value}))}/></div></div></div>
    {mergedSteps.map((step,stepIdx)=>{
      const photos=(cur.photos&&cur.photos[step.id])||[];
      const seqBadge=(<span style={{fontSize:12,color:"#777",fontWeight:700,flexShrink:0,background:"#eee",borderRadius:6,padding:"2px 6px"}}>{stepIdx+1}/{mergedSteps.length}</span>);
      const isNext=stepIdx===firstOpen;
      const dSt=doneState(step);
      const statusTag=dSt==="done"?(<span style={{fontSize:12,fontWeight:700,color:"#2E7D32",background:"#E8F5E9",borderRadius:10,padding:"2px 8px",flexShrink:0}}>✅ 完了</span>)
        :isNext?(<span style={{fontSize:12,fontWeight:700,color:"#fff",background:"#1565C0",borderRadius:10,padding:"2px 8px",flexShrink:0}}>▶ 次はここ</span>)
        :dSt==="partial"?(<span style={{fontSize:12,fontWeight:700,color:"#E65100",background:"#FFF3E0",borderRadius:10,padding:"2px 8px",flexShrink:0}}>⏳ 途中</span>):null;
      const cardFrame=isNext?{border:"2.5px solid #1565C0",boxShadow:"0 0 0 3px #E3F2FD"}:{};
      const bigCam=(done)=>(<button onClick={()=>takePhoto(step.id)} style={{width:"100%",marginTop:10,padding:"14px",fontSize:17,fontWeight:700,borderRadius:12,border:done?"2px solid #A5D6A7":"none",background:done?"#fff":"#1565C0",color:done?"#2E7D32":"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>{done?`📷 追加で撮る（${photos.length}枚 撮影済）`:"📷 撮影する"}</button>);
      if(step.photoOnly){
        const done=photos.length>0;
        return(<div key={step.id} id={`stepcard-${stepIdx}`} style={{...S.c,padding:"12px 14px",background:done?"#F1F8E9":isNext?"#F5F9FF":"#FAFAF5",borderLeft:`5px solid ${done?"#2E7D32":isNext?"#1565C0":"#FFB74D"}`,scrollMarginTop:90,...cardFrame}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            {seqBadge}
            <span style={{fontSize:15,fontWeight:700,flex:1,color:done?"#2E7D32":"#222"}}>{step.name}<span style={{fontSize:12,color:"#999",marginLeft:6,fontWeight:500}}>状況写真</span></span>
            {statusTag}
            {(()=>{const sd=(cur.dates||{})[step.id]||"";return(<label style={{display:"flex",alignItems:"center",gap:2,fontSize:12,color:sd?"#1565C0":"#999",flexShrink:0}}>📅<input type="date" value={sd||cur.date||""} onChange={e=>setCur(p=>({...p,dates:{...(p.dates||{}),[step.id]:e.target.value}}))} style={{border:"none",background:"transparent",fontSize:12,color:"inherit",padding:0,width:112}}/></label>);})()}
            </div>
          {(()=>{const spec=photoSpec(step.name);if(!spec||spec.length===0)return null;return renderFields(spec,(k)=>cur.measured[`${step.id}_f_${k}`]||"",(k,v)=>setCur(p=>({...p,measured:{...p.measured,[`${step.id}_f_${k}`]:v}})));})()}
          {bigCam(done)}
          {done&&(<div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap"}}>
            {photos.map((ph,pi)=>(<div key={pi} style={{position:"relative"}}>
              <img src={ph.data} onClick={()=>setViewPhoto(ph.data)} style={{width:56,height:56,objectFit:"cover",borderRadius:8,border:"1px solid #ddd",cursor:"pointer"}}/>
              <button onClick={()=>delPhoto(step.id,pi)} style={{position:"absolute",top:-6,right:-6,width:20,height:20,borderRadius:10,background:"#C62828",color:"#fff",border:"none",fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>×</button></div>))}</div>)}
        </div>);
      }
      const tM=step.tKey?calcT(step,cur.measured):null;const tD=step.tKey&&design[step.tKey]?Number(design[step.tKey]):null;
      const tErr=tM!==null&&tD!==null?tM-tD:null;const tJ=tErr!==null?judge(tErr,step.tKey):null;
      const zoneInfo=(()=>{
        if(!step.tKey)return null;
        const zoneOf=(s2)=>!s2.tKey?null:s2.name.includes("路盤")?"B":(s2.name.includes("発生土")||s2.name.includes("砂埋戻し"))?"A":null;
        const zk=zoneOf(step);if(!zk)return null;
        const zsteps=steps.filter(s2=>zoneOf(s2)===zk);
        const idx=zsteps.indexOf(step);
        const isLast=idx===zsteps.length-1;const remainLayers=zsteps.length-1-idx;
        const hMraw=cur.measured[`${step.id}_H`];
        if(hMraw===undefined||hMraw==="")return{zk,isLast,cum:null};
        const hM=Number(hMraw);const hD=calcDesignH(step.id);
        let cum;
        if(zk==="A"){cum=Math.round(hD-hM);}
        else{
          const aSteps=steps.filter(s2=>zoneOf(s2)==="A");const lastA=aSteps[aSteps.length-1];
          const baseRaw=lastA?cur.measured[`${lastA.id}_H`]:undefined;
          const sumB=zsteps.slice(0,idx+1).reduce((a,s2)=>a+(Number(design[s2.tKey])||0),0);
          cum=(baseRaw!==undefined&&baseRaw!=="")?Math.round((Number(baseRaw)-hM)-sumB):Math.round(hD-hM);
        }
        const taNeed=surfaceType==="asphalt"?(Number(design.ta)||40):0;
        const need=zk==="A"?steps.filter(s2=>zoneOf(s2)==="B").reduce((a,s2)=>a+(Number(design[s2.tKey])||0),0)+taNeed:taNeed;
        return{zk,isLast,remainLayers,cum,hM,need};
      })();
      const dState=dSt;
      return(<div key={step.id} id={`stepcard-${stepIdx}`} style={{...S.c,borderLeft:`5px solid ${isNext?"#1565C0":stCol(dState)}`,background:dState==="done"?"#F1F8E9":isNext?"#F5F9FF":S.c.background,scrollMarginTop:90,...cardFrame}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
          {seqBadge}
          <span style={S.sn}>{step.id}</span><span style={{fontSize:15,fontWeight:700,flex:1}}>{step.name}<span style={{fontSize:12,color:"#999",marginLeft:6,fontWeight:500}}>出来形</span>{dState==="partial"&&<span style={{fontSize:12,color:"#E65100",marginLeft:6}}>{photos.length>0?"（数値未入力）":"（写真未撮影）"}</span>}</span>
          {statusTag}
          {(()=>{const sd=(cur.dates||{})[step.id]||"";return(<label style={{display:"flex",alignItems:"center",gap:2,fontSize:12,color:sd?"#1565C0":"#999",flexShrink:0}}>📅<input type="date" value={sd||cur.date||""} onChange={e=>setCur(p=>({...p,dates:{...(p.dates||{}),[step.id]:e.target.value}}))} style={{border:"none",background:"transparent",fontSize:12,color:"inherit",padding:0,width:112}}/></label>);})()}
          </div>
        {step.inputs.map(f=>{
          const d=dv(f,step.id);const key=`${step.id}_${f}`;const mv=cur.measured[key]??"";
          const err=d!==null&&mv!==""?Number(mv)-Number(d):null;const j=err!==null?judge(err,f):null;
          return(<div key={f} style={S.er}>
            <div style={{flex:1.2}}><span style={{fontSize:16,fontWeight:700}}>{fl(f)}</span><div style={{fontSize:12,color:"#1565C0",fontWeight:600}}>{d!==null?Math.round(d):"—"}<span style={{fontSize:12,color:"#999",marginLeft:4}}>({crit(f)})</span>{f==="H"&&step.id!==1&&!(step.tKey==="t0")&&measuredD(steps,cur.measured)!==null&&<span style={{fontSize:9,color:"#E65100",marginLeft:4}}>実測D起点</span>}</div></div>
            <div style={{flex:1.3}}><input type="number" inputMode="decimal" style={S.mi} value={mv} placeholder="実測" onChange={e=>setCur(p=>({...p,measured:{...p.measured,[key]:e.target.value}}))}/></div>
            <div style={{width:48,textAlign:"center",fontSize:14,fontWeight:700,color:err!==null?j==="×"?"#C62828":"inherit":"#ccc"}}>{err!==null?(err>0?`+${err}`:err):"—"}</div>
            <div style={{width:28,textAlign:"center",fontSize:20,fontWeight:800,color:j==="○"?"#2E7D32":j==="×"?"#C62828":"#ddd"}}>{j??"·"}</div></div>);})}
        {step.tKey&&(<div style={{marginTop:6,padding:"8px 10px",borderRadius:8,background:tJ==="○"?"#E8F5E9":tJ==="×"?"#FFEBEE":"#f5f5f5",display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
          <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:tJ==="○"?"#2E7D32":tJ==="×"?"#C62828":"#888"}}>{step.tKey}={tM!==null?`${tM}mm`:"—"}</div>
            <div style={{fontSize:12,color:"#999"}}>{prevLbl(step)} / 設計:{tD??"-"}mm</div></div>
          {tErr!==null&&<div style={{fontSize:13,fontWeight:700,color:tJ==="○"?"#2E7D32":"#C62828"}}>{tErr>0?`+${tErr}`:tErr} {tJ}</div>}</div>)}
        {step.inputs.includes("D")&&(<>
          {renderFields([{k:"トルク",t:"choice",o:["60N·m","100N·m","直管"]}],(k)=>cur.measured[`${step.id}_f_${k}`]||"",(k,v)=>setCur(p=>({...p,measured:{...p.measured,[`${step.id}_f_${k}`]:v}})))}
          <div style={{fontSize:12,color:"#888",marginTop:2}}>異形管（継手ボルト）の時だけ60/100。直管はトルク管理なし → 「直管」を選ぶか未選択でOK</div></>)}
        {zoneInfo&&(()=>{
          const z=zoneInfo;const zname=z.zk==="A"?"発生土ゾーン（砂〜発生土）":"砕石ゾーン（路盤）";
          if(z.cum===null)return(<div style={{marginTop:6,padding:"6px 10px",borderRadius:8,background:"#fafafa",fontSize:12,color:"#999"}}>{zname}：Hを入力するとゾーン累計が出ます</div>);
          const a=Math.abs(z.cum);const lvl=a<=15?"ok":a<=30?"warn":"ng";
          const col=lvl==="ok"?"#2E7D32":lvl==="warn"?"#E65100":"#C62828";const bg=lvl==="ok"?"#E8F5E9":lvl==="warn"?"#FFF3E0":"#FFEBEE";
          const tag=lvl==="ok"?"順調":lvl==="warn"?"⚠ 注意":"🔴 要調整";
          const sign=z.cum>0?`+${z.cum}`:`${z.cum}`;
          const diff=Math.round(z.hM-z.need);const bad=Math.abs(diff)>30;
          return(<div style={{marginTop:6,padding:"8px 10px",borderRadius:8,background:bg,border:`1px solid ${col}55`}}>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <div style={{flex:1,fontSize:12,fontWeight:700,color:col}}>{zname} 累計 {sign}mm ／ 許容±30</div>
              <div style={{fontSize:12,fontWeight:700,color:col}}>{tag}</div></div>
            {!z.isLast&&z.cum!==0&&<div style={{fontSize:12,color:"#555",marginTop:3}}>残り{z.remainLayers}層で {z.cum>0?"−":"+"}{a}mm 調整（1層あたり約 {z.cum>0?"−":"+"}{Math.round(a/z.remainLayers)}mm）</div>}
            {z.isLast&&<div style={{fontSize:12,color:bad?"#C62828":"#333",marginTop:3,fontWeight:bad?700:400}}>{z.zk==="A"?"砕石ゾーンへ渡す深さ":"舗装への残り深さ"}：実測 {Math.round(z.hM)} ／ 必要 {z.need}（{diff>0?"+":""}{diff}）{bad&&z.zk==="A"&&(diff<0?" ⚠ このまま進むと路盤が薄くなります":" ⚠ 路盤が厚くなり舗装高が合いません")}{bad&&z.zk==="B"&&(diff<0?" ⚠ 舗装厚が確保できません":" ⚠ 舗装が厚くなります")}</div>}
          </div>);})()}
        {step.extra.map(ex=>{const av=autoExtra(ex,step,steps,cur.measured);const err=av!==null?av-ex.design:null;const j=err!==null?judge(err,ex.key,ex):null;
          const formula=ex.key==="Dm"?"＝このH":"＝実測D①−H";
          return(<div key={ex.key} style={{marginTop:6,padding:"8px 10px",borderRadius:8,border:"1px dashed #1565C0",background:j==="○"?"#E8F5E9":j==="×"?"#FFEBEE":"#fff",display:"flex",alignItems:"center",gap:6}}>
            <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:"#1565C0"}}>{ex.key} {ex.label}<span style={{fontSize:12,color:"#888",marginLeft:4}}>自動{formula}</span></div><div style={{fontSize:12,color:"#888"}}>設計:{ex.design}mm</div></div>
            <div style={{width:90,textAlign:"center",fontSize:16,fontWeight:700,color:av!==null?"#1565C0":"#ccc"}}>{av!==null?`${av}`:"—"}</div> 
            <div style={{width:48,textAlign:"center",fontSize:14,fontWeight:700,color:err!==null?j==="×"?"#C62828":"inherit":"#ccc"}}>{err!==null?(err>0?`+${err}`:err):"—"}</div>
            <div style={{width:28,textAlign:"center",fontSize:18,fontWeight:800,color:j==="○"?"#2E7D32":j==="×"?"#C62828":"#ddd"}}>{j??"·"}</div></div>);})}
        {bigCam(photos.length>0)}
        {photos.length>0&&(<div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap"}}>
          {photos.map((ph,pi)=>(<div key={pi} style={{position:"relative"}}>
            <img src={ph.data} onClick={()=>setViewPhoto(ph.data)} style={{width:64,height:64,objectFit:"cover",borderRadius:8,border:"1px solid #ddd",cursor:"pointer"}}/>
            <button onClick={()=>delPhoto(step.id,pi)} style={{position:"absolute",top:-6,right:-6,width:20,height:20,borderRadius:10,background:"#C62828",color:"#fff",border:"none",fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>×</button></div>))}</div>)}
      </div>);})}
    <button style={S.pri} onClick={savePoint}>✓ 一覧に戻る（入力・写真は自動保存済み）</button>
    {viewPhoto&&(<div onClick={()=>setViewPhoto(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <img src={viewPhoto} style={{maxWidth:"100%",maxHeight:"90vh",borderRadius:12}}/></div>)}
  </div>);}

  // ═══ CHECK（撮影チェックリスト） ═══
  if(screen==="check"){
    const delCheckPhoto=(item,idx)=>{setCheckPhotos(p=>{const n={...p};const a=[...(n[item]||[])];a.splice(idx,1);n[item]=a;return n;});};
    const delItem=(item)=>{
      if((checkPhotos[item]||[]).length>0){if(!confirm(`「${item}」の写真も削除されます。削除しますか?`))return;}
      setCheckItems(p=>p.filter(x=>x!==item));
      setCheckPhotos(p=>{const n={...p};delete n[item];return n;});
      setCheckNotes(p=>{const n={...p};delete n[item];return n;});
      setCheckDims(p=>{const n={...p};delete n[item];return n;});
    };
    const addItem=()=>{const n=newItemName.trim();if(!n||checkItems.includes(n))return;setCheckItems(p=>[...p,n]);setNewItemName("");};
    const applyTpl=(tpl)=>{setCheckItems(Array.isArray(tpl.items)?tpl.items:[]);setToast(`「${tpl.name}」を適用`);setTimeout(()=>setToast(""),2000);};
    const resetTpl=()=>{if(!confirm("チェックリストをリセットしますか?（撮影済み写真も消えます）"))return;setCheckItems([]);setCheckPhotos({});setCheckNotes({});setCheckDims({});};
    const saveTpl=async()=>{
      const name=prompt("テンプレート名を入力（全工事で使い回せます）");
      if(!name)return;
      const ok=await sbSaveTemplate(name,checkItems).catch(()=>false);
      if(ok){setTplLoaded(false);setToast("テンプレート保存済み");}else{setToast("保存失敗（オフライン?）");}
      setTimeout(()=>setToast(""),2500);
    };
    const doneN=checkItems.filter(it=>((checkPhotos[it]||[]).length>0)).length;
    const remainN=checkItems.length-doneN;
    return(<div style={{...S.w,zoom:fontScale}}>
      <input ref={fileRef} type="file" accept="image/*" capture="environment" style={{display:"none"}} onChange={onPhotoTaken}/>
      <div style={S.top}><button style={S.bk} onClick={()=>setScreen(header.projectType==="simple"?"setup":"list")}>← 戻る</button><span style={S.bg}>{hasAnchors?"工程リスト（順序）":"撮影チェックリスト"}</span></div>
      {checkItems.length===0?(<>
        <div style={{fontSize:12,color:"#666",padding:"0 4px",marginBottom:10}}>工事種別テンプレを選ぶと撮影リストが展開されます。撮ると自動で✓が付き、取り忘れが一目で分かります。</div>
        {!tplLoaded?(<div style={{...S.c,textAlign:"center",color:"#888"}}>テンプレート読込中…</div>):(
          templates.length===0?(<div style={{...S.c,textAlign:"center",color:"#888",fontSize:12}}>テンプレートがありません。<br/>SupabaseでSQLを実行してください。<br/>（下の「空のリストで開始」でも使えます）</div>):(
            templates.map(tpl=>(<button key={tpl.id} onClick={()=>applyTpl(tpl)} style={{...S.c,width:"100%",textAlign:"left",cursor:"pointer",border:"1px solid #ddd"}}>
              <div style={{fontSize:15,fontWeight:700}}>{tpl.name}</div>
              <div style={{fontSize:12,color:"#888",marginTop:4}}>{(Array.isArray(tpl.items)?tpl.items:[]).length}項目：{(Array.isArray(tpl.items)?tpl.items:[]).slice(0,5).join(" / ")}{(tpl.items||[]).length>5?" …":""}</div>
            </button>))
          ))}
        {header.projectType!=="simple"&&<div style={{fontSize:11,color:"#E65100",marginBottom:6}}>※公共工事は「@」付きの工程テンプレ（配水管布設）を選ぶと測点画面が一本流れになります</div>}
        <button style={{...S.exp,marginTop:4}} onClick={()=>setCheckItems(["着手前","完了"])}>空のリストで開始（項目は自分で追加）</button>
      </>):(<>
        {hasAnchors?(<div style={{...S.c,background:"#E3F2FD",border:"1px solid #90CAF9"}}>
          <div style={{fontSize:13,fontWeight:700,color:"#1565C0",marginBottom:4}}>この順序で各測点の入力画面に展開されます</div>
          <div style={{fontSize:12,color:"#555"}}>📐＝出来形工程（@で位置指定）／📷＝状況写真。撮影は各測点の画面で行います。項目の追加・削除で順序を調整できます。</div>
          <button onClick={resetTpl} style={{...S.sm,fontSize:12,color:"#C62828",marginTop:6}}>リセット（テンプレ選び直し）</button></div>
        ):(<div style={{...S.c,display:"flex",alignItems:"center",gap:10,background:remainN>0?"#FFF3E0":"#E8F5E9",border:`1px solid ${remainN>0?"#FFCC80":"#A5D6A7"}`}}>
          <span style={{fontSize:22}}>{remainN>0?"📷":"✅"}</span>
          <div style={{flex:1}}>
            <div style={{fontSize:15,fontWeight:700,color:remainN>0?"#E65100":"#2E7D32"}}>{remainN>0?`未撮影 ${remainN}件`:"全項目 撮影済み!"}</div>
            <div style={{fontSize:12,color:"#888"}}>{doneN} / {checkItems.length} 完了</div></div>
          <button onClick={resetTpl} style={{...S.sm,fontSize:12,color:"#C62828"}}>リセット</button></div>)}
        {checkItems.map(item=>{
          const photos=checkPhotos[item]||[];
          const done=photos.length>0;
          if(hasAnchors){
            const isA=String(item).trim().startsWith("@");
            return(<div key={item} style={{...S.c,borderLeft:`4px solid ${isA?"#1565C0":"#FFB74D"}`,padding:"8px 14px",display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:16,width:24,textAlign:"center"}}>{isA?"📐":"📷"}</span>
              <span style={{fontSize:13,fontWeight:600,flex:1,color:isA?"#1565C0":"#333"}}>{isA?String(item).trim().slice(1)+"（出来形）":item}</span>
              <button onClick={()=>delItem(item)} style={{...S.sm,fontSize:12,color:"#C62828",padding:"4px 6px"}}>×</button></div>);
          }
          return(<div key={item} style={{...S.c,borderLeft:`4px solid ${done?"#2E7D32":"#FFB74D"}`,padding:"10px 14px"}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:18,width:24,textAlign:"center"}}>{done?"✅":"⬜"}</span>
              <span style={{fontSize:14,fontWeight:600,flex:1,color:done?"#2E7D32":"#333"}}>{item}</span>
              <button onClick={()=>takeCheckPhoto(item)} style={S.camBtn}>📷{done?` ${photos.length}`:""}</button>
              <button onClick={()=>delItem(item)} style={{...S.sm,fontSize:12,color:"#C62828",padding:"4px 6px"}}>×</button></div>
            {(()=>{const spec=photoSpec(item);
              if(spec===null)return(<>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:8}}>
              {DIM_LABELS.map(l=>{
                const active=(checkDims[item]||{})[l]!==undefined;
                return(<button key={l} onClick={()=>setCheckDims(p=>{const n={...p};const d={...(n[item]||{})};if(d[l]!==undefined)delete d[l];else d[l]="";n[item]=d;return n;})} style={{padding:"5px 12px",borderRadius:14,border:`1.5px solid ${active?"#1565C0":"#ccc"}`,background:active?"#E3F2FD":"#fff",color:active?"#1565C0":"#777",fontSize:12,fontWeight:600,cursor:"pointer"}}>{l}</button>);})}
            </div>
            {DIM_LABELS.some(l=>(checkDims[item]||{})[l]!==undefined)&&(
              <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:8,alignItems:"center"}}>
                {DIM_LABELS.filter(l=>(checkDims[item]||{})[l]!==undefined).map(l=>(
                  <div key={l} style={{display:"flex",alignItems:"center",gap:4}}>
                    <span style={{fontSize:13,fontWeight:700,color:"#1565C0"}}>{l}</span>
                    <input inputMode="decimal" style={{...S.inp,width:80,padding:"8px 8px",fontSize:16,textAlign:"right",fontWeight:700}} value={(checkDims[item]||{})[l]||""} onChange={e=>{const v=e.target.value.replace(/[^0-9.\-]/g,"");setCheckDims(p=>{const n={...p};const d={...(n[item]||{})};d[l]=v;n[item]=d;return n;});}} placeholder="0"/>
                  </div>))}
              </div>)}
            <input style={{...S.inp,marginTop:6,fontSize:13,padding:"7px 10px"}} value={checkNotes[item]||""} onChange={e=>setCheckNotes(p=>({...p,[item]:e.target.value}))} placeholder="自由入力（黒板に追記）例: 東側"/>
              </>);
              if(spec.length===0)return null;
              return renderFields(spec,(k)=>(checkDims[item]||{})[k]||"",(k,v)=>setCheckDims(p=>{const n={...p};const d={...(n[item]||{})};d[k]=v;n[item]=d;return n;}));
            })()}
            {composeNote(item)&&<div style={{fontSize:12,color:"#1565C0",marginTop:4,fontWeight:600}}>黒板: {composeNote(item)}</div>}
            {done&&(<div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap"}}>
              {photos.map((ph,pi)=>(<div key={pi} style={{position:"relative"}}>
                <img src={ph.data} onClick={()=>setViewPhoto(ph.data)} style={{width:56,height:56,objectFit:"cover",borderRadius:8,border:"1px solid #ddd",cursor:"pointer"}}/>
                <button onClick={()=>delCheckPhoto(item,pi)} style={{position:"absolute",top:-6,right:-6,width:20,height:20,borderRadius:10,background:"#C62828",color:"#fff",border:"none",fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>×</button></div>))}</div>)}
          </div>);})}
        <div style={S.c}>
          <div style={S.ch}>項目を追加</div>
          <div style={{display:"flex",gap:8}}>
            <input style={{...S.inp,flex:1}} value={newItemName} onChange={e=>setNewItemName(e.target.value)} placeholder={hasAnchors?"例: 乳剤散布 ／ @管布設（出来形の位置）":"例: 水圧試験"}/>
            <button style={{...S.camBtn,flexShrink:0}} onClick={addItem}>+ 追加</button></div></div>
        <button style={{...S.exp,background:"#E3F2FD",color:"#1565C0",border:"1px solid #90CAF9"}} onClick={saveTpl}>このリストをテンプレとして保存（全工事で使い回し）</button>
      </>)}
      {viewPhoto&&(<div onClick={()=>setViewPhoto(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
        <img src={viewPhoto} style={{maxWidth:"100%",maxHeight:"90vh",borderRadius:12}}/></div>)}
      {toast&&<div style={S.to}>{toast}</div>}
    </div>);}

  // ═══ ALBUM（着手前及び完成 写真台帳） ═══
  if(screen==="album"){
    const delAlbumPhoto=(id)=>setAlbumPhotos(p=>p.filter(x=>x.id!==id));
    const addPos=()=>{const n=newPosName.trim();if(!n||albumPositions.includes(n))return;setAlbumPositions(p=>[...p,n]);setNewPosName("");};
    const delPos=(pos)=>{if(albumPhotos.some(p=>p.position===pos)){if(!confirm(`「${pos}」の写真も削除されます。削除しますか?`))return;setAlbumPhotos(p=>p.filter(x=>x.position!==pos));}setAlbumPositions(p=>p.filter(x=>x!==pos));};
    const handleAlbumPDF=()=>{generateAlbumPDF({header,albumPhotos,albumPositions});setToast("写真台帳PDF出力");setTimeout(()=>setToast(""),3000);};
    return(<div style={{...S.w,zoom:fontScale}}>
      <input ref={fileRef} type="file" accept="image/*" capture="environment" style={{display:"none"}} onChange={onPhotoTaken}/>
      <div style={S.top}><button style={S.bk} onClick={()=>setScreen("list")}>← 戻る</button><span style={S.bg}>着手前及び完成</span></div>
      <div style={{fontSize:12,color:"#888",padding:"0 4px",marginBottom:10}}>位置ごとに着手前・完成を撮影。出来形の測点とは別に始点(0M)・終点も撮れます。</div>
      {albumPositions.map(pos=>{
        const prePhotos=albumPhotos.filter(p=>p.position===pos&&p.phase==="pre");
        const compPhotos=albumPhotos.filter(p=>p.position===pos&&p.phase==="comp");
        const thumb=(ph)=>(<div key={ph.id} style={{position:"relative"}}>
          <img src={ph.data} onClick={()=>setViewPhoto(ph.data)} style={{width:60,height:60,objectFit:"cover",borderRadius:8,border:"1px solid #ddd",cursor:"pointer"}}/>
          <button onClick={()=>delAlbumPhoto(ph.id)} style={{position:"absolute",top:-6,right:-6,width:20,height:20,borderRadius:10,background:"#C62828",color:"#fff",border:"none",fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>×</button></div>);
        return(<div key={pos} style={S.c}>
          <div style={{display:"flex",alignItems:"center",marginBottom:8}}>
            <span style={{fontSize:15,fontWeight:700,flex:1}}>{pos}</span>
            <button onClick={()=>delPos(pos)} style={{...S.sm,fontSize:12,color:"#C62828"}}>位置削除</button></div>
          <div style={{display:"flex",gap:8}}>
            <div style={{flex:1,padding:"8px",borderRadius:8,background:"#FFF8E1",border:"1px solid #FFE082"}}>
              <button onClick={()=>takeAlbumPhoto("pre",pos)} style={{...S.camBtn,width:"100%",background:"#FFF3E0",borderColor:"#E65100",color:"#E65100"}}>📷 着手前{prePhotos.length>0?` ${prePhotos.length}`:""}</button>
              {prePhotos.length>0&&<div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap"}}>{prePhotos.map(thumb)}</div>}
            </div>
            <div style={{flex:1,padding:"8px",borderRadius:8,background:"#E8F5E9",border:"1px solid #A5D6A7"}}>
              <button onClick={()=>takeAlbumPhoto("comp",pos)} style={{...S.camBtn,width:"100%",background:"#E8F5E9",borderColor:"#2E7D32",color:"#2E7D32"}}>📷 完成{compPhotos.length>0?` ${compPhotos.length}`:""}</button>
              {compPhotos.length>0&&<div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap"}}>{compPhotos.map(thumb)}</div>}
            </div>
          </div>
        </div>);})}
      <div style={S.c}>
        <div style={S.ch}>位置を追加</div>
        <div style={{display:"flex",gap:8}}>
          <input style={{...S.inp,flex:1}} value={newPosName} onChange={e=>setNewPosName(e.target.value)} placeholder="例: 中間点②"/>
          <button style={{...S.camBtn,flexShrink:0}} onClick={addPos}>+ 追加</button></div></div>
      <button style={S.exp} onClick={handleAlbumPDF}>写真台帳PDF出力（表紙+台帳）</button>
      {viewPhoto&&(<div onClick={()=>setViewPhoto(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
        <img src={viewPhoto} style={{maxWidth:"100%",maxHeight:"90vh",borderRadius:12}}/></div>)}
      {toast&&<div style={S.to}>{toast}</div>}
    </div>);}

  // ═══ LIST ═══
  const syncBadge=unsynced>0?{t:`⚠ 写真未送信${unsynced}枚`,c:"#C62828",bg:"#FFEBEE"}:syncStatus==="synced"?{t:"☁ 同期済",c:"#2E7D32",bg:"#E8F5E9"}:syncStatus==="syncing"?{t:"☁ 同期中…",c:"#E65100",bg:"#FFF3E0"}:{t:"⚠ オフライン",c:"#C62828",bg:"#FFEBEE"};
  return(<div style={{...S.w,zoom:fontScale}}>
    <div style={S.top}><button style={S.bk} onClick={()=>setScreen("design")}>← 設計値</button>
      <h1 style={{fontSize:16,fontWeight:700,margin:0,flex:1,textAlign:"center",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{header.projectName||"出来形管理"}</h1>
      <span style={{fontSize:12,fontWeight:600,color:syncBadge.c,background:syncBadge.bg,padding:"3px 8px",borderRadius:10,whiteSpace:"nowrap"}}>{syncBadge.t}</span>
      <button style={{...S.bk,fontSize:18,padding:"4px 8px"}} onClick={()=>setShowProjList(true)} title="プロジェクト一覧">≡</button></div>
    <div style={{display:"flex",gap:6,fontSize:12,color:"#888",padding:"0 4px",marginBottom:10,flexWrap:"wrap"}}>
      <span>{PL[pipeType]}</span><span>φ{dia}</span><span>{road.label}</span><span>{steps.length}工程</span></div>
    {points.length===0?(<div style={{textAlign:"center",padding:"40px 16px",color:"#888"}}>
      <div style={{fontSize:40,marginBottom:8}}>📐</div>
      <button style={{...S.pri,marginTop:16}} onClick={()=>setScreen("bulk")}>測点を一括作成</button></div>):(
    <>{points.map((pt,idx)=>{
      let total=0,ok=0,ng=0;
      steps.forEach(step=>{step.inputs.forEach(f=>{total++;const d=dv(f,step.id);const key=`${step.id}_${f}`;const mv=pt.measured[key];
        if(d!==null&&mv&&mv!==""){const j=judge(Number(mv)-Number(d),f);if(j==="○")ok++;if(j==="×")ng++;}});
        if(step.tKey){total++;const tM=calcT(step,pt.measured);const tD=design[step.tKey]?Number(design[step.tKey]):null;if(tM!==null&&tD!==null){const j=judge(tM-tD,step.tKey);if(j==="○")ok++;if(j==="×")ng++;}}
        step.extra.forEach(ex=>{total++;const av=autoExtra(ex,step,steps,pt.measured);if(av!==null){const j=judge(av-ex.design,ex.key,ex);if(j==="○")ok++;if(j==="×")ng++;}});});
      const fl=ok+ng;const pc=totalPhotos(pt);
      return(<div key={idx} style={{...S.pc,borderLeft:fl===0?"3px solid #ddd":ng>0?"3px solid #C62828":"3px solid #2E7D32"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:16,fontWeight:700}}>{pt.name}</span><span style={{fontSize:12,color:"#999"}}>{pt.date}</span>
            {pc>0&&<span style={{fontSize:12,color:"#1565C0"}}>📷{pc}</span>}</div>
          <button style={{...S.sm,fontSize:14,fontWeight:700}} onClick={()=>editPoint(idx)}>入力→</button></div></div>);})}
    <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:12}}>
      <button style={{...S.pri,background:"#fff",color:"#1565C0",border:"2px solid #1565C0"}} onClick={()=>setPoints(p=>[...p,{name:`No.${p.length+1}`,date:"",measured:{},photos:{},dates:{}}])}>+ 測点追加</button>
      {(()=>{
        if(hasAnchors||header.projectType==="simple")return null;
        const seq=(templates||[]).filter(t=>(Array.isArray(t.items)?t.items:[]).some(i=>String(i).trim().startsWith("@")));
        if(seq.length===0)return null;
        const hasPhotos=Object.values(checkPhotos||{}).some(a=>Array.isArray(a)&&a.length>0);
        return(<div style={{...S.c,background:"#FFF8E1",border:"2px solid #FFB300"}}>
          <div style={{fontSize:14,fontWeight:700,color:"#E65100",marginBottom:4}}>⚠ 状況写真と出来形が別画面になっています</div>
          <div style={{fontSize:12,color:"#555",marginBottom:8}}>工程テンプレを適用すると、各測点の画面で「状況写真📷 → 出来形📐」が{(seq[0].items||[]).length}項目の一本流れになります。{hasPhotos?"（今のチェックリストの写真は残ります）":""}</div>
          <button style={S.pri} onClick={()=>{setCheckItems(seq[0].items);setToast(`「${seq[0].name}」を適用 → 測点を開いてください`);setTimeout(()=>setToast(""),3000);}}>一本流れにする（{seq[0].name}）</button>
        </div>);})()}
      <button style={{...S.exp,background:"#FFF3E0",color:"#E65100",border:"1px solid #FFCC80"}} onClick={()=>setScreen("album")}>📷 着手前及び完成（写真台帳）</button>
      <button style={{...S.exp,background:!hasAnchors&&checkItems.length>0&&checkItems.filter(it=>!((checkPhotos[it]||[]).length>0)).length>0?"#FFEBEE":"#F5F5F5",color:!hasAnchors&&checkItems.length>0&&checkItems.filter(it=>!((checkPhotos[it]||[]).length>0)).length>0?"#C62828":"#555",border:"1px solid #ddd"}} onClick={()=>setScreen("check")}>{hasAnchors?"🗂 工程リスト（状況写真の順序を編集）":`✓ 撮影チェックリスト${checkItems.length>0?(()=>{const r=checkItems.filter(it=>!((checkPhotos[it]||[]).length>0)).length;return r>0?`（未撮影 ${r}件）`:"（完了✅）";})():""}`}</button>
      <button style={S.exp} onClick={handlePDF}>出来形PDF（検査記録表＋各測点{steps.length}枚・豆図付き）</button>
      <button style={{...S.exp,background:"#E3F2FD",color:"#1565C0",border:"1px solid #90CAF9"}} onClick={handleStatusPDF}>施工状況写真PDF（各測点{mergedSteps.length}枚・黒板欄付き）</button>
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
          <h2 style={{fontSize:18,fontWeight:700,margin:0}}>プロジェクト一覧 <span style={{fontSize:11,color:"#999",fontWeight:500}}>v{APP_VERSION}</span></h2>
          <button style={{background:"none",border:"none",fontSize:24,cursor:"pointer",color:"#888",padding:"0 8px"}} onClick={()=>setShowProjList(false)}>×</button>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12,padding:"8px 10px",background:"#f5f5f5",borderRadius:8}}>
          <span style={{fontSize:13,fontWeight:600,flex:1}}>文字サイズ</span>
          {[["標準",1.0],["大",1.15],["特大",1.3]].map(([l,z])=>(<button key={l} onClick={()=>setZoom(z)} style={{padding:"6px 12px",borderRadius:14,border:`1.5px solid ${fontScale===z?"#1565C0":"#ccc"}`,background:fontScale===z?"#1565C0":"#fff",color:fontScale===z?"#fff":"#555",fontSize:13,fontWeight:700,cursor:"pointer"}}>{l}</button>))}
        </div>
        <button style={{...S.exp,marginBottom:10,background:"#f5f5f5",color:"#555",border:"1px solid #ddd"}} onClick={()=>{window.location.reload();}}>🔄 最新版に更新（v{APP_VERSION}）</button>
        <button style={{...S.pri,marginBottom:16}} onClick={newProject}>+ 新規プロジェクト</button>
        {projects.length===0?(<div style={{textAlign:"center",padding:"20px 0",color:"#888",fontSize:13}}>プロジェクトなし</div>):(
          projects.sort((a,b)=>(b.updatedAt||"").localeCompare(a.updatedAt||"")).map(pj=>{
            const isCurrent=pj.id===currentProjId;
            const pipeLabel=pj.header?.workKind||PL[pj.pipeType||"DCIP"];
            const nameShow=pj.header?.projectName||"(名称未設定)";
            const ptsN=pj.points?.length||0;
            const dt=pj.updatedAt?new Date(pj.updatedAt).toLocaleString("ja-JP",{month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"}):"";
            return(<div key={pj.id} style={{border:isCurrent?"2px solid #1565C0":"1px solid #ddd",borderRadius:10,padding:"10px 12px",marginBottom:8,background:isCurrent?"#E3F2FD":"#fff"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:15,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{nameShow}{isCurrent&&<span style={{fontSize:12,color:"#1565C0",marginLeft:6}}>（現在）</span>}</div>
                  <div style={{fontSize:12,color:"#888",marginTop:2}}>{pipeLabel} φ{pj.header?.diameter||"—"} / {ptsN}測点 / {dt}</div>
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
  logo:{fontSize:20,fontWeight:700,margin:0},bg:{fontSize:12,fontWeight:600,background:"#E3F2FD",color:"#1565C0",padding:"3px 10px",borderRadius:20},
  c:{background:"var(--color-background-secondary,#fafafa)",border:"0.5px solid var(--color-border-tertiary,#e0e0e0)",borderRadius:12,padding:14,marginBottom:10},
  ch:{fontSize:14,fontWeight:600,marginBottom:10},lb:{display:"block",fontSize:12,fontWeight:500,color:"#666",marginBottom:3},
  inp:{width:"100%",padding:"10px 12px",fontSize:15,border:"1px solid #ddd",borderRadius:8,background:"#fff",color:"inherit",boxSizing:"border-box",outline:"none"},
  ni:{padding:"8px 6px",fontSize:15,border:"2px solid #FFB300",borderRadius:8,textAlign:"center",background:"#FFFDE7",color:"inherit",boxSizing:"border-box",outline:"none"},
  mi:{width:"100%",padding:"10px 8px",fontSize:17,fontWeight:600,border:"2px solid #FFB300",borderRadius:8,textAlign:"center",background:"#FFFDE7",color:"inherit",boxSizing:"border-box",outline:"none"},
  sel:{padding:"10px",border:"1.5px solid #ddd",borderRadius:10,background:"#fff",cursor:"pointer",textAlign:"center"},selOn:{borderColor:"#1565C0",background:"#E3F2FD"},
  rb:{flex:1,padding:"14px 12px",border:"2px solid #ddd",borderRadius:12,background:"#fff",cursor:"pointer",textAlign:"center",display:"flex",flexDirection:"column",gap:4,alignItems:"center"},rbOn:{borderColor:"#1565C0",background:"#E3F2FD",color:"#1565C0"},
  sfb:{flex:1,padding:"12px",border:"2px solid #ddd",borderRadius:12,background:"#fff",cursor:"pointer",textAlign:"center",display:"flex",flexDirection:"column",gap:2,alignItems:"center"},sfbOn:{borderColor:"#E65100",background:"#FFF3E0",color:"#E65100"},
  db:{padding:"8px 14px",border:"1.5px solid #ddd",borderRadius:10,background:"#fff",cursor:"pointer",textAlign:"center"},dbOn:{borderColor:"#1565C0",background:"#E3F2FD",color:"#1565C0"},
  sn:{width:24,height:24,borderRadius:12,background:"#1565C0",color:"#fff",fontSize:13,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},
  sd:{width:20,height:20,borderRadius:10,background:"#ddd",color:"#666",fontSize:12,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},
  er:{display:"flex",alignItems:"center",padding:"8px 0",borderBottom:"0.5px solid #eee",gap:4},
  pri:{width:"100%",padding:"14px",fontSize:16,fontWeight:700,background:"#1565C0",color:"#fff",border:"none",borderRadius:12,cursor:"pointer"},
  exp:{width:"100%",padding:"12px",fontSize:14,fontWeight:600,background:"#E8F5E9",color:"#2E7D32",border:"1px solid #A5D6A7",borderRadius:12,cursor:"pointer"},
  bk:{background:"none",border:"none",fontSize:14,color:"#1565C0",cursor:"pointer",fontWeight:500,padding:"4px 0"},
  pc:{background:"#fafafa",border:"0.5px solid #e0e0e0",borderRadius:10,padding:"10px 12px",marginBottom:6},
  sm:{background:"none",border:"none",fontSize:14,color:"#1565C0",cursor:"pointer",fontWeight:500},
  cb:{width:44,height:44,borderRadius:22,border:"2px solid #1565C0",background:"#fff",color:"#1565C0",fontSize:22,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"},
  to:{position:"fixed",bottom:20,left:"50%",transform:"translateX(-50%)",background:"#333",color:"#fff",padding:"10px 24px",borderRadius:8,fontSize:14,fontWeight:500,zIndex:999},
  camBtn:{padding:"7px 12px",border:"1.5px solid #1565C0",borderRadius:8,background:"#E3F2FD",color:"#1565C0",fontSize:14,fontWeight:600,cursor:"pointer",flexShrink:0},
};
