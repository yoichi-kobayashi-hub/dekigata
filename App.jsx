import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";

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
const APP_VERSION="2.1.8";
const PL={DCIP:"DCIP(GX)",HPPE:"HPPE",SHIKIRI:"仕切弁筐"};
// キーワード判定（URLの ?ky=shinano でも解除。一度解除した端末は記憶）
function kwOk(v){const t=String(v||"").trim();return t.toLowerCase()==="shinano"||t==="信濃";}
function initialLocked(){try{const q=new URLSearchParams(window.location.search);for(const [k,v] of q.entries()){if(["ky","key"].includes(k.toLowerCase())&&kwOk(v)){try{localStorage.setItem("dekigata_unlocked","1");}catch(e){}return false;}}if(localStorage.getItem("dekigata_unlocked")==="1")return false;}catch(e){}return true;}
function nextPointName(points){const nums=(points||[]).map(p=>{const m=String(p&&p.name||"").match(/^No\.?\s*(\d+)/i);return m?Number(m[1]):null;}).filter(n=>n!==null);return `No.${nums.length?Math.max(...nums)+1:0}`;}
function pipeText(pipeType,dia,pipe2){if(!pipe2)return`${PL[pipeType]} φ${dia}`;const t2=pipe2.pipeType||pipeType;if(t2===pipeType&&Number(pipe2.diameter)===Number(dia))return`${PL[pipeType]} φ${dia}×2条`;return`${PL[pipeType]}φ${dia}+${PL[t2]}φ${pipe2.diameter}`;}
const DIM_LABELS=["深さ","幅","厚さ","延長","高さ","径"];
const ZONE_A=["t1","t2","t3","t4"],ZONE_B=["t5","t6","t7"];
// 状況写真の記入項目（項目名の部分一致で決定。該当なし=null→汎用チップ、fields空=📷のみ）
const MACHINE_OPTS=["0.1㎥","0.14㎥","0.2㎥","0.25㎥"];
const PHOTO_FIELDS=[
  {match:"剥ぎ取り",fields:[]},
  {match:"掘削状況",fields:[{k:"機械",t:"choice",o:MACHINE_OPTS}]},
  {match:"路盤厚",fields:[{k:"As厚",t:"num",u:"mm"},{k:"路盤厚",t:"num",u:"mm"},{k:"合計",t:"sum",of:["As厚","路盤厚"],u:"mm"}]},
  {match:"管布設",fields:[{k:"管径",t:"auto"},{k:"トルク",t:"choice",o:["60N·m","100N·m","直管"]}]},
  {match:"発生土転圧",fields:[{k:"層",t:"choice",o:["①","②","③"]}]},
  {match:"砕石転圧",fields:[{k:"層",t:"choice",o:["①","②"]}]},
  {match:"舗装切断",fields:[]},{match:"積込",fields:[]},{match:"床均し",fields:[]},{match:"明示テープ",fields:[]},
  {match:"ポリスリーブ",fields:[]},{match:"砂埋戻し転圧",fields:[]},{match:"乳剤",fields:[]},{match:"舗装完了",fields:[]},{match:"表示シート",fields:[]},
];
function photoSpec(name){const n=String(name||"");if(/転圧/.test(n)&&/[①②③④⑤]/.test(n))return[];const hit=PHOTO_FIELDS.find(p=>n.includes(p.match));return hit?hit.fields:null;}
// キャンバス用の文字折り返し（日本語は1文字単位）。maxLinesを超えたら末尾を…に
function wrapCanvas(ctx,text,maxW,maxLines){
  const chars=Array.from(String(text||""));const out=[];let buf="";let i=0;
  for(;i<chars.length;i++){const ch=chars[i];
    if(buf&&ctx.measureText(buf+ch).width>maxW){out.push(buf);buf="";if(out.length===maxLines)break;}
    buf+=ch;}
  if(out.length<maxLines){if(buf||!out.length)out.push(buf);}
  else if(i<chars.length){let last=out[maxLines-1];while(last.length&&ctx.measureText(last+"…").width>maxW)last=last.slice(0,-1);out[maxLines-1]=last+"…";}
  return out;
}
// 工事名向け: 「年度」「地区」「工事」などの切れ目で、なるべく左右均等に2行へ
function breakLines(ctx,text,maxW,maxLines){
  const t=String(text||"");
  if(ctx.measureText(t).width<=maxW)return[t];
  if(maxLines>=2){
    const toks=["年度","地区","工区","工事","線"];const cands=new Set();
    toks.forEach(k=>{let i=t.indexOf(k);while(i>=0){cands.add(i+k.length);i=t.indexOf(k,i+1);}});
    let best=null;
    [...cands].filter(c=>c>0&&c<t.length).forEach(c=>{const a=t.slice(0,c),b=t.slice(c);if(ctx.measureText(a).width<=maxW&&ctx.measureText(b).width<=maxW){const sc=Math.abs(a.length-b.length);if(!best||sc<best.sc)best={sc,lines:[a,b]};}});
    if(best)return best.lines;
  }
  return wrapCanvas(ctx,t,maxW,maxLines);
}
function sumField(f,get){const vs=(f.of||[]).map(k=>get(k));if(!vs.length||!vs.every(v=>v!==undefined&&v!==null&&String(v).trim()!==""&&!isNaN(Number(v))))return null;return Math.round(vs.reduce((a,v)=>a+Number(v),0)*10)/10;}
function fieldPairs(spec,get,autoVal){return (spec||[]).map(f=>{if(f.t==="auto")return[f.k,autoVal(f.k)];if(f.t==="sum"){const sm=sumField(f,get);return sm===null?null:[f.k,`${sm}${f.u||""}`];}const v=get(f.k);return(v!==undefined&&v!==null&&String(v).trim()!=="")?[f.k,`${v}${f.u||""}`]:null;}).filter(Boolean);}
// 測点の実測D①（主管）。埋戻し以降の設計H起点に使う（未入力ならnull→設計D起点）
function measuredD(steps,measured){const ps=steps.find(s=>s.inputs.includes("D"));if(!ps||!measured)return null;const v=measured[`${ps.id}_D`];if(v===undefined||v===""||isNaN(Number(v)))return null;return Number(v);}
// t自動計算: 前工程H（最初は実測D）− 今工程H
function calcTm(step,steps,meas){if(!step||!step.tKey||step.prevRef===null||step.prevRef===undefined||!meas)return null;let pv;if(step.prevRef==="D"){const ds=steps.find(s=>s.inputs.includes("D"));pv=ds?meas[`${ds.id}_D`]:null;}else pv=meas[`${step.prevRef}_H`];const ch=meas[`${step.id}_H`];if(pv===undefined||pv===null||pv===""||ch===undefined||ch===null||ch==="")return null;return Number(pv)-Number(ch);}
// Hs/Dm 自動計算: シート・ピンは発生土①天端 → Dm=そのH, Hs=実測D①−H
function autoExtra(ex,step,steps,meas){if(!ex||!step||!meas)return null;const h=meas[`${step.id}_H`];if(h===undefined||h===""||isNaN(Number(h)))return null;if(ex.key==="Dm")return Math.round(Number(h));if(ex.key==="Hs"){const dm=measuredD(steps,meas);if(dm===null)return null;return Math.round(dm-Number(h));}const v=meas[`${step.id}_${ex.key}`];return(v===undefined||v==="")?null:Number(v);}
// 設計H（全画面・黒板・PDF共通）
//  掘削=H0／基礎砂=H0−t0
//  砂（管のすぐ上の層）=実測D①(未入力なら設計D)−t1
//  発生土①から上=設計Dから測った標準のH（v2.1.8〜：土被りのズレは発生土①の厚さで吸収 → シート・ピンはいつもの深さ）
//  路盤砕石=地表基準：舗装厚ta＋その上に残る路盤厚（最終の路盤＝舗装厚）
//  発生土の最終層=舗装厚＋路盤全厚（砕石ゾーンへの引き渡し）
function isRobanStep(s){return !!(s&&s.tKey&&String(s.name||"").includes("路盤"));}
function surfaceRefKind(step,steps){if(!step||!step.tKey)return null;const robans=steps.filter(isRobanStep);if(!robans.length)return null;const ri=robans.findIndex(x=>x.id===step.id);if(ri>=0)return ri===robans.length-1?"ta":"ta+roban";const fills=steps.filter(x=>x.tKey&&x.tKey!=="t0"&&!isRobanStep(x));if(fills.length&&fills[fills.length-1].id===step.id)return "handoff";return null;}
function designHFor(step,steps,design,H0,D,measured,surfaceType){
  if(!step)return null;
  if(step.id===1)return H0;
  const bs=steps.find(x=>x.tKey==="t0");if(bs&&step.id===bs.id)return H0-(Number(design.t0)||0);
  const taD=surfaceType==="gravel"?0:(Number(design.ta)||40);
  const robans=steps.filter(isRobanStep);
  const kind=surfaceRefKind(step,steps);
  if(kind==="ta"||kind==="ta+roban"){const ri=robans.findIndex(x=>x.id===step.id);return Math.round(taD+robans.slice(ri+1).reduce((acc,x)=>acc+(Number(design[x.tKey])||0),0));}
  if(kind==="handoff")return Math.round(taD+robans.reduce((acc,x)=>acc+(Number(design[x.tKey])||0),0));
  const dm=measuredD(steps,measured);
  const sand=sandStepOf(steps);
  const sandTop=sand?(dm!==null?dm:D)-(Number(design[sand.tKey])||0):null;
  if(sand&&step.id===sand.id)return Math.round(sandTop);
  let h=D;let ap=false;
  for(const x of steps){if(x.inputs.includes("D")){ap=true;continue;}if(!ap)continue;if(typeof x.id==="number"&&typeof step.id==="number"&&x.id>step.id)break;if(x.tKey&&x.tKey!=="t0"&&design[x.tKey])h-=Number(design[x.tKey]);}
  // 一応：土被りがかなり浅くて砂の天端が標準のHより浅くなる時は、厚さがマイナスにならないよう砂の天端に合わせる
  if(sandTop!==null&&h>sandTop)h=sandTop;
  return Math.round(h);
}
// 砂（管のすぐ上の層＝実測Dから測る層）
function sandStepOf(steps){return (steps||[]).find(x=>x&&x.prevRef==="D"&&x.tKey)||null;}
// 土被りのズレを吸収する層（砂の次の層＝発生土①）
function absorbStepOf(steps){const sd=sandStepOf(steps);if(!sd)return null;return (steps||[]).find(x=>x&&x.tKey&&x.prevRef===sd.id&&!isRobanStep(x))||null;}
function judge(e,f,m){const meta=m||FM[f];if(!meta||e===null||isNaN(e))return null;if(meta.minus!==null&&e<-meta.minus)return"×";if(meta.plus!==null&&e>meta.plus)return"×";return"○";}
// ═══ 狙いH（v2.1.8）═══
// 層ごとに「ここに仕上げれば全部○」になるHの範囲を出す。満たす条件：
//  H（設計H±30）／厚さt（前の層の実測H、砂は実測D①からの厚さ±30）／シートHs（実測D①−H＝300±30）／ピンDm（H＝700±30）／
//  最後の路盤は舗装厚の下限（舗装厚≒最後の路盤のH）
// 前から：実測済みの層はその値から、まだの層は前の層の範囲から順に計算する
// 後ろから：次の層に余裕（WIN_NARROW）が残るように、手前の層の狙いを絞る（砂を厚くしすぎて発生土①が窮屈になる、などを先に防ぐ）
const WIN_NARROW=20; // 狙いの幅がこれ未満なら「余裕が少ない」
function planWindows(steps,design,H0,D,measured,surfaceType){
  const meas=measured||{};
  const num=(v)=>(v===undefined||v===null||v===""||isNaN(Number(v)))?null:Number(v);
  const dM=measuredD(steps,meas);
  const taD=surfaceType==="gravel"?0:(Number(design.ta)||40);
  const robans=steps.filter(isRobanStep);const lastRoban=robans.length?robans[robans.length-1]:null;
  const chain=steps.filter(s=>s&&!s.photoOnly&&s.inputs&&s.inputs.includes("H"));
  const info={};
  // その層だけで決まる条件（H・ピン・シート・舗装厚）
  for(const s of chain){
    const dH=designHFor(s,steps,design,H0,D,meas,surfaceType);
    if(dH===null||dH===undefined||isNaN(dH))continue;
    let lo=dH-FM.H.minus,hi=dH+FM.H.plus;const why=["H"];
    for(const ex of (s.extra||[])){
      if(ex.key==="Dm"){lo=Math.max(lo,ex.design-ex.minus);hi=Math.min(hi,ex.design+ex.plus);why.push("Dm");}
      else if(ex.key==="Hs"&&dM!==null){lo=Math.max(lo,dM-ex.design-ex.plus);hi=Math.min(hi,dM-ex.design+ex.minus);why.push("Hs");}
    }
    if(lastRoban&&s.id===lastRoban.id&&taD>0&&FM.ta.minus!==null){lo=Math.max(lo,taD-FM.ta.minus);why.push("ta");}
    const tRaw=s.tKey?design[s.tKey]:undefined;
    const tD=(s.tKey&&s.prevRef!==null&&s.prevRef!==undefined&&tRaw!==undefined&&tRaw!==null&&tRaw!==""&&!isNaN(Number(tRaw)))?Number(tRaw):null;
    info[s.id]={dH:Math.round(dH),B:{lo,hi},why,tD,fm:(s.tKey&&FM[s.tKey])||{minus:30,plus:30},m:num(meas[`${s.id}_H`])};
  }
  // 前から（厚さtは前の層の実測、まだなら前の層の範囲から）
  const F={};
  for(const s of chain){const I=info[s.id];if(!I)continue;
    let {lo,hi}=I.B;
    if(I.tD!==null){
      let P=null;
      if(s.prevRef==="D"){if(dM!==null)P={lo:dM,hi:dM};}
      else{const pi=info[s.prevRef];if(pi)P=pi.m!==null?{lo:pi.m,hi:pi.m}:((F[s.prevRef]&&F[s.prevRef].lo<=F[s.prevRef].hi)?F[s.prevRef]:pi.B);}
      if(P){if(I.fm.plus!==null)lo=Math.max(lo,P.lo-I.tD-I.fm.plus);if(I.fm.minus!==null)hi=Math.min(hi,P.hi-I.tD+I.fm.minus);if(!I.why.includes("t"))I.why.push("t");}
    }
    F[s.id]={lo,hi};
  }
  // 後ろから（次の層が○になる余地を margin mm 以上残す）
  const back=(margin)=>{
    const G={};
    for(let i=chain.length-1;i>=0;i--){const s=chain[i];const I=info[s.id];if(!I)continue;
      let {lo,hi}=F[s.id];
      const n=chain.find(x=>x.prevRef===s.id&&info[x.id]&&info[x.id].tD!==null);
      if(n&&I.m===null){const N=info[n.id];
        if(N.m!==null){if(N.fm.minus!==null)lo=Math.max(lo,N.m+N.tD-N.fm.minus);if(N.fm.plus!==null)hi=Math.min(hi,N.m+N.tD+N.fm.plus);}
        else{const A=G[n.id];if(A&&A.lo<=A.hi){const mm=Math.min(margin,A.hi-A.lo);
          if(N.fm.minus!==null)lo=Math.max(lo,A.lo+mm+N.tD-N.fm.minus);if(N.fm.plus!==null)hi=Math.min(hi,A.hi-mm+N.tD+N.fm.plus);}}
      }
      G[s.id]={lo,hi};
    }
    return G;
  };
  const G0=back(0),G1=back(WIN_NARROW);
  const out={};
  for(const s of chain){const I=info[s.id];if(!I)continue;
    const f=F[s.id],g0=G0[s.id],g1=G1[s.id];
    const okF=Math.ceil(g0.lo)<=Math.floor(g0.hi);
    const comfy=Math.ceil(g1.lo)<=Math.floor(g1.hi);
    const pick=comfy?g1:g0;const lo=Math.ceil(pick.lo),hi=Math.floor(pick.hi);
    const room=okF?Math.floor(g0.hi)-Math.ceil(g0.lo):-1;
    out[s.id]={lo,hi,ok:okF,tight:okF&&(!comfy||room<WIN_NARROW),room,dH:I.dH,why:I.why,measured:I.m,
      ahead:okF&&(lo>Math.ceil(f.lo)||hi<Math.floor(f.hi)),own:{lo:Math.ceil(f.lo),hi:Math.floor(f.hi)}};
  }
  return out;
}
// 「あとで×になりそう」：実測を入れた層（D・H）ごとに、その後のまだ入れていない層を見て
//  範囲が無い（どう仕上げても×）→ng／範囲が狭い（WIN_NARROW未満）→warn
//  最後の路盤は、Hが○でも舗装厚の下限に届かない時（このままだと舗装で×）→ng
function laterRisks(steps,win,measured,design,surfaceType){
  const meas=measured||{};const out={};
  const has=(k)=>meas[k]!==undefined&&meas[k]!==null&&meas[k]!==""&&!isNaN(Number(meas[k]));
  const taD=surfaceType==="gravel"?0:(Number(design&&design.ta)||40);
  const robans=steps.filter(isRobanStep);const lastRoban=robans.length?robans[robans.length-1]:null;
  const pave=steps.find(s=>s&&!s.photoOnly&&s.inputs&&s.inputs.includes("ta"));
  let cause=null;
  const put=(r)=>{if(cause===null)return;const o=out[cause];if(!o||(o.kind==="warn"&&r.kind==="ng"))out[cause]=r;};
  for(const s of steps){
    if(!s||s.photoOnly||!s.inputs)continue;
    if(s.inputs.includes("D")){if(has(`${s.id}_D`))cause=s.id;continue;}
    if(!s.inputs.includes("H"))continue;
    if(has(`${s.id}_H`)){
      cause=s.id;
      if(lastRoban&&s.id===lastRoban.id&&taD>0&&pave&&!has(`${pave.id}_ta`)&&FM.ta.minus!==null){
        const h=Number(meas[`${s.id}_H`]);const need=taD-FM.ta.minus;
        if(h<need)put({kind:"ng",target:pave.id,pave:true,need,h:Math.round(h*10)/10});
      }
      continue;
    }
    const w=win[s.id];if(!w||cause===null)continue;
    if(!w.ok)put({kind:"ng",target:s.id,lo:w.lo,hi:w.hi});
    else if(w.tight)put({kind:"warn",target:s.id,lo:w.lo,hi:w.hi});
  }
  return out;
}
const WHY_LABEL={H:"H",t:"厚さ",Hs:"シート",Dm:"ピン",ta:"舗装厚"};
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
.step-photo img{width:100% !important;height:100% !important;object-fit:contain !important}
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
.step-photo img{width:100%;height:100%;object-fit:contain;object-position:center;display:block;background:#fff}
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
    html+=`<tr><td class="lbl">種　　別</td><td colspan="4">${pipeText(pipeType,dia,pipe2)}</td><td class="lbl" style="font-size:6px">主任技術者</td><td colspan="2"></td></tr></table>`;

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

  const designHOf=(step,pt)=>designHFor(step,steps,design,H0,D,pt.measured,surfaceType);
  const boardLines=(step,pt)=>{
    const L=[];
    L.push(["工事名",header.projectName||""]);L.push(["分類",mode==="status"?"施工状況":(step.photoOnly?"施工状況":"出来形管理")]);L.push(["測点",pt.name||""]);
    L.push(["工程",step.photoOnly?step.name:`${step.id}.${step.name}`]);
    L.push(["管種",pipeText(pipeType,dia,pipe2)]);
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
      html+=`<div class="step-page"><div class="step-hdr"><span>${pt.name} — ${mode==="status"?"施工状況写真":"出来形管理写真"}</span><span style="font-size:10px;color:#888">${pipeText(pipeType,dia,pipe2)} ${road.label}　${pt.date||""}</span></div>`;
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
          html+=`<div style="font-size:11px;color:#666">施工状況</div>`;
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
.al-photo img{width:100%;max-height:80mm;object-fit:contain;display:block;background:#fff}
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
    body:JSON.stringify({name,data:{...data,_meta:deviceMeta()},updated_at:new Date().toISOString()})});
  if(!res.ok)throw new Error("patch failed");
  const rows=await res.json();
  return rows.length>0?{ok:true,row:rows[0]}:{conflict:true};
}
async function sbInsertProject(id,name,data){
  const res=await fetch(`${SB_URL}/rest/v1/dekigata_projects?select=id,updated_at`,{
    method:"POST",headers:{...sbHeaders,"Prefer":"return=representation"},
    body:JSON.stringify({id,name,data:{...data,_meta:deviceMeta()},updated_at:new Date().toISOString()})});
  if(res.status===409)return{conflict:true};
  if(!res.ok)throw new Error("insert failed");
  const rows=await res.json();if(!rows||rows.length===0)return{deleted:true};return{ok:true,row:rows[0]};
}
// 3wayマージ: 自分がbase（読んだ時点）から変えた項目だけをcloudに重ねる。写真は両方残す
function mergeProjectData(local,cloud,base){
  const b=base||{};const l=local||{};const c=cloud||{};
  const same=(a,bb)=>JSON.stringify(a===undefined?null:a)===JSON.stringify(bb===undefined?null:bb);
  const pick=(lv,cv,bv)=>same(lv,bv)?cv:lv;
  const mergeObj=(lo,co,bo)=>{lo=lo||{};co=co||{};bo=bo||{};const out={...co};new Set([...Object.keys(lo),...Object.keys(bo)]).forEach(k=>{if(!same(lo[k],bo[k])){if(lo[k]===undefined)delete out[k];else out[k]=lo[k];}});return out;};
  // 同じ写真の判定は id か URL のどちらかが一致すればOK（二重登録しない）
  // 同じ写真が両方にある時は、片方にしか無い「元写真(raw)・撮影情報(exif)」を引き継ぐ（元写真の送信待ちが消えないように）
  const unionPhotos=(la,ca)=>{la=Array.isArray(la)?la:[];ca=Array.isArray(ca)?ca:[];const seenId=new Map(),seenUrl=new Map();const out=[];[...ca,...la].forEach(ph=>{if(!ph)return;const id=ph.id||null;const url=(typeof ph.data==="string"&&!ph.data.startsWith("data:"))?ph.data:null;if(!id&&!ph.data)return;
    const hit=(id&&seenId.has(id))?seenId.get(id):(url&&seenUrl.has(url))?seenUrl.get(url):-1;
    if(hit>=0){const k=out[hit];const fill={};if(!k.raw&&ph.raw)fill.raw=ph.raw;else if(typeof k.raw==="string"&&k.raw.startsWith("idb:")&&typeof ph.raw==="string"&&/^https?:/.test(ph.raw))fill.raw=ph.raw;if(!k.exif&&ph.exif)fill.exif=ph.exif;if(Object.keys(fill).length)out[hit]={...k,...fill};return;}
    if(!id&&!url&&out.some(x=>x&&x.data===ph.data))return;const i=out.length;if(id)seenId.set(id,i);if(url)seenUrl.set(url,i);out.push(ph);});return out;};
  const mergePhotoMap=(lm,cm)=>{lm=lm||{};cm=cm||{};const out={...cm};Object.keys(lm).forEach(k=>{out[k]=unionPhotos(lm[k],cm[k]);});return out;};
  const mergePoint=(lp,cp,bp)=>{if(!cp)return lp;if(!lp)return cp;const bb=bp||{};return{...cp,name:pick(lp.name,cp.name,bb.name),date:pick(lp.date,cp.date,bb.date),measured:mergeObj(lp.measured,cp.measured,bb.measured),dates:mergeObj(lp.dates,cp.dates,bb.dates),photos:mergePhotoMap(lp.photos,cp.photos)};};
  const lps=l.points||[],cps=c.points||[],bps=b.points||[];
  const byName=(arr)=>{const m={};arr.forEach(pt=>{if(pt&&pt.name)m[pt.name]=pt;});return m;};
  const cm=byName(cps),bm=byName(bps),lm=byName(lps);
  const outPoints=lps.map(lp=>mergePoint(lp,cm[lp.name],bm[lp.name]));
  // 測点を消すボタンは無い → この端末で測点数が減っていたら事故。クラウド側の測点は消さずに残す
  const lostLocally=lps.length<bps.length;
  cps.forEach(cp=>{if(!lm[cp.name]&&(!bm[cp.name]||lostLocally))outPoints.push(cp);});
  return stripTrashed({
    pipeType:pick(l.pipeType,c.pipeType,b.pipeType),roadType:pick(l.roadType,c.roadType,b.roadType),surfaceType:pick(l.surfaceType,c.surfaceType,b.surfaceType),
    header:mergeObj(l.header,c.header,b.header),design:mergeObj(l.design,c.design,b.design),points:outPoints,
    albumPhotos:unionPhotos(l.albumPhotos,c.albumPhotos),albumPositions:pick(l.albumPositions,c.albumPositions,b.albumPositions),
    checkItems:pick(l.checkItems,c.checkItems,b.checkItems),checkPhotos:mergePhotoMap(l.checkPhotos,c.checkPhotos),
    checkNotes:mergeObj(l.checkNotes,c.checkNotes,b.checkNotes),checkDims:mergeObj(l.checkDims,c.checkDims,b.checkDims),
    // ゴミ箱は全端末ぶんを合わせる（消した写真はどの端末からも戻ってこない。戻した写真は戻る）
    photoTrash:unionTrash(l.photoTrash,c.photoTrash),
  });
}
// 起動時・工事切替時の最初の画面: 設定済みなら入力画面（公共=現場入力、簡易=撮影チェックリスト）、未設定なら工事情報
function landingFor(n){const h=(n&&n.header)||{};if(!String(h.projectName||"").trim())return"setup";if(h.projectType==="simple")return((n.checkItems||[]).length?"check":"setup");return((n.points||[]).length?"list":"setup");}
// 測点にデータ（写真・実測値）があるか
function hasPtData(pt){if(!pt)return false;if(Object.values(pt.photos||{}).some(a=>Array.isArray(a)&&a.length>0))return true;return Object.values(pt.measured||{}).some(v=>v!==undefined&&v!==null&&String(v).trim()!=="");}
// 保存ガード: 最後に同期した版より測点が減っていたら、消えた測点を戻してから保存（測点を消すボタンは無い＝減るのは事故）
function guardLostPoints(local,base){
  const lps=(local&&local.points)||[];const bps=(base&&base.points)||[];
  if(!bps.length||lps.length>=bps.length)return null;
  const names=new Set(lps.map(p=>p&&p.name));
  const add=bps.filter(bp=>bp&&bp.name&&!names.has(bp.name));
  if(!add.length)return null;
  return{data:{...local,points:[...lps,...add]},restored:add.length};
}
// 救出: この端末に残っている測点が、クラウドから消えていたら戻す（2026/9/25 20:59 の件）
//  ・クラウドに無い測点（写真・実測あり／または測点数そのものが減っている）→ 戻す
//  ・クラウドの同名測点が空っぽで、この端末にはデータあり → この端末の方で置き換え
//  ・他の端末で名前を変えただけの測点（写真が全部クラウド側にある）は戻さない
//  ・測点以外（工事情報・設計値など）はクラウド（新しい方）のまま
function rescueMerge(local,cloud){
  const L=local||{},C=cloud||{};
  const lps=(L.points||[]).filter(p=>p&&p.name),cps=(C.points||[]).filter(Boolean);
  if(!lps.length)return null;
  const cBy=new Map();cps.forEach(p=>{if(p.name&&!cBy.has(p.name))cBy.set(p.name,p);});
  const keys=new Set();cps.forEach(p=>Object.values(p.photos||{}).forEach(a=>(Array.isArray(a)?a:[]).forEach(ph=>{if(!ph)return;if(ph.id)keys.add("i:"+ph.id);if(typeof ph.data==="string"&&!ph.data.startsWith("data:"))keys.add("d:"+ph.data);})));
  const photosOf=(p)=>{const r=[];Object.values(p.photos||{}).forEach(a=>(Array.isArray(a)?a:[]).forEach(ph=>{if(ph)r.push(ph);}));return r;};
  const movedAway=(p)=>{const ph=photosOf(p);return ph.length>0&&ph.every(x=>(x.id&&keys.has("i:"+x.id))||(typeof x.data==="string"&&keys.has("d:"+x.data)));};
  const drop=cps.length<lps.length;
  let restored=0;const out=[];const placed=new Set();
  lps.forEach(lp=>{
    const cp=cBy.get(lp.name);
    if(cp&&!placed.has(cp)){placed.add(cp);if(!hasPtData(cp)&&hasPtData(lp)){out.push({...cp,...lp,name:cp.name});restored++;}else out.push(cp);return;}
    if(movedAway(lp))return;
    if(hasPtData(lp)||drop){out.push(lp);restored++;}
  });
  cps.forEach(cp=>{if(!placed.has(cp))out.push(cp);});
  if(!restored)return null;
  return{data:{...C,points:out},restored};
}
// ═══════════════════════════════════════
// 復元の仕組み（v2.1.6）: 端末の控え／写真のゴミ箱／倉庫の写真との照合／クラウドの履歴
// ═══════════════════════════════════════
// 写真ファイル名に「どの測点・工程の写真か」を読める形で入れる（倉庫の写真だけからでも組み直せる）
function b64u(s){try{const b=new TextEncoder().encode(String(s??""));let bin="";b.forEach(x=>{bin+=String.fromCharCode(x);});return btoa(bin).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");}catch(e){return"";}}
function unb64u(s){try{const t=String(s||"").replace(/-/g,"+").replace(/_/g,"/");const bin=atob(t+(t.length%4?"=".repeat(4-t.length%4):""));const b=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)b[i]=bin.charCodeAt(i);return new TextDecoder().decode(b);}catch(e){return null;}}
function photoFileName(c){const ts=Date.now(),r=Math.random().toString(36).slice(2,6);
  if(c.kind==="ck")return`ck.${b64u(c.item)}.${ts}.${r}.jpg`;
  if(c.kind==="al")return`al.${b64u(c.phase)}.${b64u(c.position)}.${ts}.${r}.jpg`;
  return`pt.${b64u(c.point)}.${b64u(c.step)}.${ts}.${r}.jpg`;}
// 倉庫のファイル名 → {kind, point, step, item, phase, position, ts}。新しい名前も昔の名前（ハッシュ入り）も読む
function parsePhotoName(file,known){
  const k=known||{};const f=String(file||"");
  const parts=f.split(".");
  if(parts.length>=5&&parts[parts.length-1]==="jpg"&&/^\d{13}$/.test(parts[parts.length-3])&&["pt","ck","al"].includes(parts[0])){
    const ts=Number(parts[parts.length-3]);const mid=parts.slice(1,parts.length-3).map(unb64u);
    if(mid.some(x=>x===null))return null;
    if(parts[0]==="pt"&&mid.length===2)return{kind:"pt",point:mid[0],step:mid[1],ts};
    if(parts[0]==="ck"&&mid.length===1)return{kind:"ck",item:mid[0],ts};
    if(parts[0]==="al"&&mid.length===2)return{kind:"al",phase:mid[0],position:mid[1],ts};
    return null;
  }
  const m=f.match(/^(.+)_(\d{13})_([0-9a-z]{1,8})\.jpg$/);if(!m)return null;
  const head=m[1],ts=Number(m[2]);
  const findKey=(key,cands)=>{for(const c of (cands||[])){if(safeKey(String(c))===key)return String(c);}return null;};
  if(head.startsWith("check_")){const key=head.slice(6);const item=findKey(key,k.items);return{kind:"ck",item:item||null,rawKey:key,ts};}
  if(head.startsWith("album_")){const key=head.slice(6);return{kind:"al",phase:key==="pre"||key==="comp"?key:null,position:null,rawKey:key,ts};}
  const cut=head.lastIndexOf("_");if(cut<=0)return null;
  const pk=head.slice(0,cut),sk=head.slice(cut+1);
  const point=findKey(pk,k.points)||((/^[A-Za-z0-9._-]{1,40}$/.test(pk)&&!/^k[0-9a-z]{4,8}$/.test(pk))?pk:null);
  const step=findKey(sk,k.steps);
  return{kind:"pt",point,step,rawStep:step?null:sk,ts};
}
const isB64=(ph)=>!!ph&&typeof ph.data==="string"&&ph.data.startsWith("data:");
const photoUrlOf=(ph)=>(ph&&typeof ph.data==="string"&&/^https?:/.test(ph.data))?ph.data:null;
const samePhoto=(a,b)=>!!a&&!!b&&((a.id&&b.id&&a.id===b.id)||(!!photoUrlOf(a)&&photoUrlOf(a)===photoUrlOf(b)));
// ゴミ箱（消した写真はここへ。最後の操作が「消した」なら非表示、「戻した」なら表示）
const trashKeyOf=(t)=>(t&&(t.id||(t.data&&!String(t.data).startsWith("data:")?t.data:null)))||null;
const trashActive=(t)=>!!t&&(t.deletedAt||"")>(t.restoredAt||"");
function unionTrash(a,b){const m=new Map();[...(Array.isArray(a)?a:[]),...(Array.isArray(b)?b:[])].forEach(t=>{const k=trashKeyOf(t);if(!k)return;const p=m.get(k);const tv=(x)=>[x.deletedAt||"",x.restoredAt||""].sort().pop();if(!p||tv(t)>tv(p)||(tv(t)===tv(p)&&!isB64(t)&&isB64(p)))m.set(k,t);});return[...m.values()];}
function trashedKeys(trash){const s=new Set();(Array.isArray(trash)?trash:[]).forEach(t=>{if(!trashActive(t))return;if(t.id)s.add("i:"+t.id);const u=t.data&&!String(t.data).startsWith("data:")?t.data:null;if(u)s.add("d:"+u);});return s;}
const isTrashed=(ph,tk)=>!!ph&&tk.size>0&&((ph.id&&tk.has("i:"+ph.id))||(photoUrlOf(ph)&&tk.has("d:"+photoUrlOf(ph))));
// ゴミ箱に入っている写真は、どの端末から来ても表示しない（削除が全端末に伝わる）
function stripTrashed(d){const tk=trashedKeys(d.photoTrash);if(!tk.size)return d;const keep=(arr)=>(Array.isArray(arr)?arr:[]).filter(ph=>!isTrashed(ph,tk));
  const points=(d.points||[]).map(pt=>{if(!pt||!pt.photos)return pt;let ch=false;const ph={};Object.keys(pt.photos).forEach(k=>{const a=keep(pt.photos[k]);if(a.length!==(pt.photos[k]||[]).length)ch=true;ph[k]=a;});return ch?{...pt,photos:ph}:pt;});
  const checkPhotos={};Object.keys(d.checkPhotos||{}).forEach(k=>{checkPhotos[k]=keep(d.checkPhotos[k]);});
  return{...d,points,checkPhotos,albumPhotos:keep(d.albumPhotos)};}
// 写真を元の場所（測点・工程／チェック項目／台帳）へ足す。すでにある写真は足さない
function placePhotos(data,entries){
  const D=JSON.parse(JSON.stringify(data||{}));D.points=D.points||[];D.checkPhotos=D.checkPhotos||{};D.albumPhotos=D.albumPhotos||[];D.checkItems=D.checkItems||[];D.albumPositions=(D.albumPositions&&D.albumPositions.length)?D.albumPositions:["始点","中間点","終点"];
  let added=0,newPoints=0;const skipped=[];
  (entries||[]).forEach(e=>{
    const ph={id:e.id||hashStr(e.data),data:e.data,time:e.time||"",...(e.note?{note:e.note}:{}),...(e.restored?{restored:e.restored}:{}),...(e.raw?{raw:e.raw}:{}),...(e.exif?{exif:e.exif}:{})};
    if(!ph.data){skipped.push(e);return;}
    if(e.kind==="ck"){if(!e.item){skipped.push(e);return;}if(!D.checkItems.includes(e.item))D.checkItems.push(e.item);const a=D.checkPhotos[e.item]=D.checkPhotos[e.item]||[];if(a.some(x=>samePhoto(x,ph)))return;a.push(ph);added++;return;}
    if(e.kind==="al"){const pos=e.position||"位置不明";if(!D.albumPositions.includes(pos))D.albumPositions.push(pos);if(D.albumPhotos.some(x=>samePhoto(x,ph)))return;D.albumPhotos.push({...ph,phase:e.phase||"pre",position:pos});added++;return;}
    if(!e.point||e.step===null||e.step===undefined||e.step===""){skipped.push(e);return;}
    let pt=D.points.find(p=>p&&p.name===e.point);
    if(!pt){pt={name:e.point,date:e.date||"",measured:{},photos:{},dates:{}};D.points.push(pt);newPoints++;}
    pt.photos=pt.photos||{};pt.dates=pt.dates||{};const sk=String(e.step);
    const a=pt.photos[sk]=pt.photos[sk]||[];if(a.some(x=>samePhoto(x,ph)))return;a.push(ph);added++;
    if(e.date&&!pt.dates[sk])pt.dates[sk]=e.date;if(e.date&&!pt.date)pt.date=e.date;
  });
  // 新しく作った測点は No.番号順に並べ直す（既存の並びは崩さない）
  if(newPoints>0){const num=(p)=>{const m=String(p&&p.name||"").match(/^No\.?\s*(\d+)/i);return m?Number(m[1]):Infinity;};const allNum=D.points.every(p=>num(p)!==Infinity);if(allNum)D.points.sort((a,b)=>num(a)-num(b));}
  return{data:D,added,newPoints,skipped};
}
// 過去の版・バックアップから「足りない分だけ」戻す（今の入力は上書きしない）
function additiveRestore(cur,old){
  const C=JSON.parse(JSON.stringify(cur||{}));const O=old||{};const tk=trashedKeys(unionTrash(C.photoTrash,O.photoTrash));
  C.points=C.points||[];C.checkPhotos=C.checkPhotos||{};C.albumPhotos=C.albumPhotos||[];C.checkItems=C.checkItems||[];
  let addP=0,addPh=0,addV=0;const empty=(v)=>v===undefined||v===null||String(v).trim()==="";
  const byName=new Map(C.points.filter(p=>p&&p.name).map(p=>[p.name,p]));
  (O.points||[]).forEach(op=>{if(!op||!op.name)return;let cp=byName.get(op.name);
    if(!cp){cp={name:op.name,date:op.date||"",measured:{},photos:{},dates:{}};C.points.push(cp);byName.set(op.name,cp);addP++;}
    cp.photos=cp.photos||{};cp.measured=cp.measured||{};cp.dates=cp.dates||{};
    Object.entries(op.photos||{}).forEach(([k,arr])=>(Array.isArray(arr)?arr:[]).forEach(ph=>{if(!ph||isB64(ph)||isTrashed(ph,tk))return;const l=cp.photos[k]=cp.photos[k]||[];if(!l.some(x=>samePhoto(x,ph))){l.push(ph);addPh++;}}));
    Object.entries(op.measured||{}).forEach(([k,v])=>{if(!empty(v)&&empty(cp.measured[k])){cp.measured[k]=v;addV++;}});
    Object.entries(op.dates||{}).forEach(([k,v])=>{if(v&&!cp.dates[k])cp.dates[k]=v;});
    if(!cp.date&&op.date)cp.date=op.date;});
  Object.entries(O.checkPhotos||{}).forEach(([k,arr])=>(Array.isArray(arr)?arr:[]).forEach(ph=>{if(!ph||isB64(ph)||isTrashed(ph,tk))return;const l=C.checkPhotos[k]=C.checkPhotos[k]||[];if(!l.some(x=>samePhoto(x,ph))){l.push(ph);addPh++;if(!C.checkItems.includes(k))C.checkItems.push(k);}}));
  (O.albumPhotos||[]).forEach(ph=>{if(!ph||isB64(ph)||isTrashed(ph,tk))return;if(!C.albumPhotos.some(x=>samePhoto(x,ph))){C.albumPhotos.push(ph);addPh++;}});
  ["checkNotes","checkDims"].forEach(f=>{const src=O[f]||{};C[f]=C[f]||{};Object.keys(src).forEach(k=>{if(C[f][k]===undefined){C[f][k]=src[k];addV++;}});});
  ["header","design"].forEach(f=>{const src=O[f]||{};C[f]=C[f]||{};Object.keys(src).forEach(k=>{if(empty(C[f][k])&&!empty(src[k])){C[f][k]=src[k];addV++;}});});
  if((!C.checkItems||!C.checkItems.length)&&(O.checkItems||[]).length){C.checkItems=O.checkItems;addV++;}
  C.photoTrash=unionTrash(C.photoTrash,O.photoTrash);
  return{data:C,addP,addPh,addV};
}
// ═══════════════════════════════════════
// 変更の記録（v2.1.7）: 保存のたびに「何が・何から・何へ」を1件ずつ残す（端末＋倉庫）。1件ずつ元に戻せる
// ═══════════════════════════════════════
// キーの順番に左右されない比較
function stab(v){if(typeof v==="string"&&v.length>200&&v.startsWith("data:"))return JSON.stringify("data:"+v.length+":"+v.slice(-24));if(Array.isArray(v))return"["+v.map(stab).join(",")+"]";if(v&&typeof v==="object")return"{"+Object.keys(v).filter(k=>v[k]!==undefined).sort().map(k=>JSON.stringify(k)+":"+stab(v[k])).join(",")+"}";return JSON.stringify(v===undefined?null:v);}
const jsEq=(a,b)=>stab(a)===stab(b);
// 端末内の未送信写真（base64）は記録に入れない
function slimV(v){if(v===undefined)return null;if(typeof v==="string")return v.startsWith("data:")?"(未送信の写真)":v;if(Array.isArray(v))return v.map(slimV);if(v&&typeof v==="object"){const o={};Object.keys(v).forEach(k=>{if(v[k]!==undefined)o[k]=slimV(v[k]);});return o;}return v;}
const pkeyOf=(ph)=>(ph&&typeof ph==="object")?(ph.id||ph.data||null):JSON.stringify(ph);
const isPendRef=(v)=>typeof v==="string"&&(v.startsWith("data:")||v.startsWith("idb:"));
// 送信待ち→URLへの置き換えは「変更」に数えない
function photoSame(a,b){const strip=(p)=>{const o={...(p||{})};["data","raw"].forEach(k=>{if(o[k]===undefined||o[k]===null||isPendRef(o[k]))delete o[k];});return o;};const A=strip(a),B=strip(b);["data","raw"].forEach(k=>{if((A[k]===undefined)!==(B[k]===undefined)){delete A[k];delete B[k];}});return jsEq(A,B);}
function diffData(A,B){
  const a=A||{},b=B||{};const out=[];const add=(r)=>out.push(r);
  const isObj=(x)=>x&&typeof x==="object"&&!Array.isArray(x);
  ["pipeType","roadType","surfaceType"].forEach(k=>{if(!jsEq(a[k],b[k]))add({area:"type",pt:null,fld:k,kind:"set",old:slimV(a[k]),new:slimV(b[k])});});
  const dObj=(area,pt,x,y)=>{x=isObj(x)?x:{};y=isObj(y)?y:{};new Set([...Object.keys(x),...Object.keys(y)]).forEach(k=>{if(jsEq(x[k],y[k]))return;add({area,pt,fld:k,kind:(x[k]===undefined)?"add":(y[k]===undefined)?"del":"set",old:slimV(x[k]),new:slimV(y[k])});});};
  const dPh=(area,pt,fld,x,y)=>{x=Array.isArray(x)?x:[];y=Array.isArray(y)?y:[];const yk=new Map(y.map(p=>[pkeyOf(p),p]));const xk=new Map(x.map(p=>[pkeyOf(p),p]));
    x.forEach(p=>{const k=pkeyOf(p);if(!yk.has(k))add({area,pt,fld,kind:"del",old:slimV(p),new:null});else if(!photoSame(p,yk.get(k)))add({area,pt,fld,kind:"set",old:slimV(p),new:slimV(yk.get(k))});});
    y.forEach(p=>{if(!xk.has(pkeyOf(p)))add({area,pt,fld,kind:"add",old:null,new:slimV(p)});});};
  ["header","design","checkNotes","checkDims"].forEach(k=>dObj(k,null,a[k],b[k]));
  ["checkItems","albumPositions"].forEach(k=>{if(!jsEq(a[k],b[k]))add({area:k,pt:null,fld:null,kind:"set",old:slimV(a[k]),new:slimV(b[k])});});
  const ca=isObj(a.checkPhotos)?a.checkPhotos:{},cb=isObj(b.checkPhotos)?b.checkPhotos:{};new Set([...Object.keys(ca),...Object.keys(cb)]).forEach(k=>dPh("checkPhotos",null,k,ca[k],cb[k]));
  dPh("albumPhotos",null,null,a.albumPhotos,b.albumPhotos);
  const byN=(arr)=>{const m=new Map();(Array.isArray(arr)?arr:[]).forEach(p=>{if(isObj(p)&&p.name&&!m.has(p.name))m.set(p.name,p);});return m;};
  const pa=byN(a.points),pb=byN(b.points);
  [...new Set([...pa.keys(),...pb.keys()])].forEach(n=>{const x=pa.get(n),y=pb.get(n);if(x===y||jsEq(x,y))return;
    if(!x){add({area:"point",pt:n,fld:null,kind:"add",old:null,new:slimV(y)});return;}
    if(!y){add({area:"point",pt:n,fld:null,kind:"del",old:slimV(x),new:null});return;}
    if(!jsEq(x.date,y.date))add({area:"pt.date",pt:n,fld:null,kind:"set",old:slimV(x.date),new:slimV(y.date)});
    dObj("pt.measured",n,x.measured,y.measured);dObj("pt.dates",n,x.dates,y.dates);
    const xp=isObj(x.photos)?x.photos:{},yp=isObj(y.photos)?y.photos:{};new Set([...Object.keys(xp),...Object.keys(yp)]).forEach(k=>dPh("pt.photos",n,k,xp[k],yp[k]));
    new Set([...Object.keys(x),...Object.keys(y)]).forEach(k=>{if(["name","date","measured","dates","photos"].includes(k))return;if(!jsEq(x[k],y[k]))add({area:"pt.other",pt:n,fld:k,kind:"set",old:slimV(x[k]),new:slimV(y[k])});});});
  const known=["_meta","points","header","design","checkNotes","checkDims","checkItems","albumPositions","checkPhotos","albumPhotos","photoTrash","pipeType","roadType","surfaceType"];
  new Set([...Object.keys(a),...Object.keys(b)]).forEach(k=>{if(known.includes(k))return;if(!jsEq(a[k],b[k]))add({area:"other",pt:null,fld:k,kind:"set",old:slimV(a[k]),new:slimV(b[k])});});
  return out;
}
// 端末ごとの通し番号（記録のキー＝端末ID:番号。同じ記録が端末と倉庫の両方にあっても1件に数える）
function nextLogSeq(){try{const n=Number(localStorage.getItem("dekigata_log_seq")||0)+1;localStorage.setItem("dekigata_log_seq",String(n));return n;}catch(e){return Date.now()*1000+Math.floor(Math.random()*1000);}}
// 表示用：打ちかけの途中経過（1→11→115→1150 のように、10秒以内に同じ項目へ書き足しただけ）は1件にまとめる。
// 消した・書き換えた途中の値（1150→115 など）は、戻せるように必ず別の1件で残す
function buildChangeList(recs,showAll){
  const valueAreas=new Set(["type","header","design","checkNotes","checkDims","pt.measured","pt.dates","pt.date","pt.other","other","checkItems","albumPositions"]);
  const asc=[...recs].sort((x,y)=>String(x.at).localeCompare(String(y.at))||((x.seq||0)-(y.seq||0)));
  const merged=[];
  asc.forEach(r=>{
    const prev=merged[merged.length-1];
    const isEdit=(x)=>!x.via||x.via==="edit";
    const typing=!!prev&&isEdit(prev)&&isEdit(r)&&valueAreas.has(r.area)&&prev.area===r.area&&prev.dev===r.dev&&(prev.pt||"")===(r.pt||"")&&(prev.fld||"")===(r.fld||"")
      &&typeof prev.new==="string"&&typeof r.new==="string"&&r.new.length>prev.new.length&&r.new.startsWith(prev.new)&&jsEq(r.old,prev.new)
      &&Date.parse(r.at)-Date.parse(prev.atLast||prev.at)<=10000;
    if(typing){prev.new=r.new;prev.atLast=r.at;prev.keys.push(r.key);return;}
    merged.push({...r,keys:[r.key]});});
  // 測点名の変更（同じ保存で「消えた名前」と「増えた名前」が1つずつ）
  const groups=new Map();merged.forEach(r=>{if(r.area==="point"){const g=`${r.dev}|${r.at}`;if(!groups.has(g))groups.set(g,[]);groups.get(g).push(r);}});
  groups.forEach(g=>{const dels=g.filter(r=>r.kind==="del"),adds=g.filter(r=>r.kind==="add");if(dels.length===1&&adds.length===1){dels[0].renameTo=adds[0].pt;adds[0].hidden=true;}});
  const out=merged.filter(r=>!r.hidden&&!(r.old===null&&r.new===null)&&!(jsEq(r.old,r.new)));
  const shown=showAll?out:out.filter(r=>r.kind==="del"||r.kind==="set"||r.renameTo);
  return shown.reverse();
}
// ── 倉庫（Storage）にJSONを置く：変更の記録・過去の版。倉庫は消せない設定なので、上書き・削除されない ──
async function sbUploadJson(path,obj,keepalive){try{const body=JSON.stringify(obj);const res=await fetch(`${SB_URL}/storage/v1/object/dekigata-photos/${path}`,{method:"POST",headers:{"apikey":SB_KEY,"Authorization":`Bearer ${SB_KEY}`,"Content-Type":"application/json"},body,keepalive:!!keepalive&&body.length<60000});return res.ok;}catch(e){return false;}}
async function sbListFolder(prefix){const out=[];for(let off=0;off<10000;off+=1000){const res=await fetch(`${SB_URL}/storage/v1/object/list/dekigata-photos`,{method:"POST",headers:sbHeaders,body:JSON.stringify({prefix,limit:1000,offset:off,sortBy:{column:"name",order:"asc"}})});if(!res.ok)throw new Error("list failed");const rows=await res.json();(rows||[]).forEach(r=>{if(r&&r.name&&r.id!==null)out.push(r);});if(!rows||rows.length<1000)break;}return out;}
async function sbGetJson(path){const res=await fetch(`${SB_URL}/storage/v1/object/public/dekigata-photos/${path}`);if(!res.ok)throw new Error("get failed");return res.json();}
// データベース側の記録（入っていれば使う。無ければ空）
async function sbFetchDbChanges(pid){try{const r=await fetch(`${SB_URL}/rest/v1/dekigata_changes?id=eq.${pid}&select=cid,at,area,pt,fld,kind,old_v,new_v,by_device,app_v&order=cid.desc&limit=1000`,{headers:sbHeaders});if(!r.ok)return[];const rows=await r.json();return(Array.isArray(rows)?rows:[]).map(x=>({key:"db:"+x.cid,seq:x.cid,at:x.at,dev:x.by_device||"",v:x.app_v||"",via:"",area:x.area,pt:x.pt,fld:x.fld,kind:x.kind,old:x.old_v===undefined?null:x.old_v,new:x.new_v===undefined?null:x.new_v,src:"db"}));}catch(e){return[];}}
// 削除した工事：データベースの仕組みがあればそれで戻す。無ければ中身を読んで「新しい工事として」戻す
function countPhotosIn(d){d=d||{};let n=0;(d.points||[]).forEach(pt=>Object.values((pt&&pt.photos)||{}).forEach(a=>{n+=(Array.isArray(a)?a.length:0);}));Object.values(d.checkPhotos||{}).forEach(a=>{n+=(Array.isArray(a)?a.length:0);});n+=Array.isArray(d.albumPhotos)?d.albumPhotos.length:0;return n;}
async function sbListDeleted(){
  try{const r=await fetch(`${SB_URL}/rest/v1/rpc/dekigata_list_deleted`,{method:"POST",headers:sbHeaders,body:"{}"});if(r.ok){const rows=await r.json();if(Array.isArray(rows))return{rpc:true,rows};}}catch(e){}
  const r2=await fetch(`${SB_URL}/rest/v1/dekigata_deleted?select=id,name,deleted_at,data&order=deleted_at.desc&limit=50`,{headers:sbHeaders});if(!r2.ok)throw new Error("deleted list failed");const rows=await r2.json();
  return{rpc:false,rows:(Array.isArray(rows)?rows:[]).map(x=>({id:x.id,name:x.name,deleted_at:x.deleted_at,n_points:((x.data&&x.data.points)||[]).length,n_photos:countPhotosIn(x.data),data:x.data}))};}
async function sbRestoreDeletedRpc(id){try{const r=await fetch(`${SB_URL}/rest/v1/rpc/dekigata_restore_deleted`,{method:"POST",headers:sbHeaders,body:JSON.stringify({p_id:id})});if(!r.ok)return null;return await r.json();}catch(e){return null;}}
// ── 撮影情報（EXIF）を読む：日時・機種・位置（入っていれば） ──
function readExif(buf){try{const v=new DataView(buf);if(v.byteLength<4||v.getUint16(0)!==0xFFD8)return null;let o=2;
  while(o+4<=v.byteLength){const mk=v.getUint16(o);if((mk&0xFF00)!==0xFF00)break;const sz=v.getUint16(o+2);
    if(mk===0xFFE1&&o+10<=v.byteLength&&v.getUint32(o+4)===0x45786966)return parseTiff(v,o+10);
    if(mk===0xFFDA)break;o+=2+sz;}
  return null;}catch(e){return null;}}
function parseTiff(v,t){const le=v.getUint16(t)===0x4949;const u16=(p)=>v.getUint16(p,le),u32=(p)=>v.getUint32(p,le);if(u16(t+2)!==42)return null;
  const str=(p,n)=>{let s="";for(let i=0;i<n&&p+i<v.byteLength;i++){const c=v.getUint8(p+i);if(!c)break;s+=String.fromCharCode(c);}return s.trim();};
  const sizes={1:1,2:1,3:2,4:4,5:8,7:1,9:4,10:8};
  const readIfd=(off)=>{const out={};if(!off||t+off+2>v.byteLength)return out;const n=u16(t+off);for(let i=0;i<n;i++){const e=t+off+2+i*12;if(e+12>v.byteLength)break;const tag=u16(e),type=u16(e+2),cnt=u32(e+4);const sz=(sizes[type]||1)*cnt;const vp=sz>4?t+u32(e+8):e+8;if(vp+Math.min(sz,8)>v.byteLength)continue;
    if(type===2)out[tag]=str(vp,cnt);else if(type===3)out[tag]=u16(vp);else if(type===4)out[tag]=u32(vp);else if(type===5){const a=[];for(let j=0;j<cnt&&vp+j*8+8<=v.byteLength;j++){const nn=u32(vp+j*8),dd=u32(vp+j*8+4);a.push(dd?nn/dd:0);}out[tag]=cnt===1?a[0]:a;}}return out;};
  const i0=readIfd(u32(t+4));const ex=i0[0x8769]?readIfd(i0[0x8769]):{};const gp=i0[0x8825]?readIfd(i0[0x8825]):{};
  const r={};if(i0[0x010F])r.make=i0[0x010F];if(i0[0x0110])r.model=i0[0x0110];
  const dt=ex[0x9003]||i0[0x0132];if(dt)r.dt=dt;if(ex[0x9011])r.tz=ex[0x9011];
  const dms=(a)=>Array.isArray(a)&&a.length===3?a[0]+a[1]/60+a[2]/3600:null;const la=dms(gp[2]),lo=dms(gp[4]);
  if(la!==null&&lo!==null&&(la||lo)){r.lat=Math.round((gp[1]==="S"?-la:la)*1e6)/1e6;r.lon=Math.round((gp[3]==="W"?-lo:lo)*1e6)/1e6;}
  return Object.keys(r).length?r:null;}
const rawTries=new Map();
// 入力済みの「出来形」（工程番号で保存される実測値・写真）があるか → 種別を変えると工程がずれるのでロック
function hasDekigataData(pts){return(pts||[]).some(pt=>pt&&(Object.entries(pt.measured||{}).some(([k,v])=>/^\d+_/.test(k)&&v!==undefined&&v!==null&&String(v).trim()!=="")||Object.entries(pt.photos||{}).some(([k,a])=>/^\d+$/.test(k)&&Array.isArray(a)&&a.length>0)));}
// ── 端末の控え（IndexedDB）: 撮った写真は、クラウドに届いたと確認できるまで端末に別保存 ──
// v2.1.7: 同じ箱に「変更の記録(changes)」と「過去の版(snaps)」も入れる。開けない時は4秒で諦める（保存は止めない）
const JDB="dekigata_journal",JSTORE="shots",JCHG="changes",JSNAP="snaps",JBASE="bases";let jdbP=null;const journalIds=new Set();
function jdb(){if(!jdbP){jdbP=new Promise((res,rej)=>{try{if(typeof indexedDB==="undefined")return rej(new Error("no idb"));
  const to=setTimeout(()=>rej(new Error("idb timeout")),4000);
  const r=indexedDB.open(JDB,2);
  r.onupgradeneeded=()=>{const db=r.result;
    if(!db.objectStoreNames.contains(JSTORE)){const s=db.createObjectStore(JSTORE,{keyPath:"id"});s.createIndex("projectId","projectId");}
    if(!db.objectStoreNames.contains(JCHG)){const s=db.createObjectStore(JCHG,{keyPath:"key"});s.createIndex("projectId","projectId");}
    if(!db.objectStoreNames.contains(JSNAP)){const s=db.createObjectStore(JSNAP,{keyPath:"sid",autoIncrement:true});s.createIndex("projectId","projectId");}
    if(!db.objectStoreNames.contains(JBASE))db.createObjectStore(JBASE,{keyPath:"pid"});};
  r.onsuccess=()=>{clearTimeout(to);const db=r.result;db.onversionchange=()=>{try{db.close();}catch(e){}jdbP=null;};res(db);};
  r.onerror=()=>{clearTimeout(to);rej(r.error);};
}catch(e){rej(e);}}).catch(e=>{jdbP=null;throw e;});}return jdbP;}
async function jTxS(store,mode,fn){const db=await jdb();return new Promise((res,rej)=>{const tx=db.transaction(store,mode);const st=tx.objectStore(store);let out;try{out=fn(st);}catch(e){rej(e);return;}tx.oncomplete=()=>res(out&&out.result!==undefined?out.result:out);tx.onerror=()=>rej(tx.error);tx.onabort=()=>rej(tx.error);});}
async function jTx(mode,fn){return jTxS(JSTORE,mode,fn);}
async function jChgPut(rows){if(!rows||!rows.length)return true;try{await jTxS(JCHG,"readwrite",st=>{rows.forEach(r=>st.put(r));return null;});return true;}catch(e){return false;}}
async function jChgAll(pid){try{const r=await jTxS(JCHG,"readonly",st=>st.index("projectId").getAll(pid));return Array.isArray(r)?r:[];}catch(e){return[];}}
async function jChgMarkUp(keys){try{await jTxS(JCHG,"readwrite",st=>{keys.forEach(k=>{const g=st.get(k);g.onsuccess=()=>{if(g.result)st.put({...g.result,up:1});};});return null;});return true;}catch(e){return false;}}
async function jChgPrune(pid,keep){try{const all=await jChgAll(pid);if(all.length<=keep)return;const del=all.filter(r=>r.up).sort((a,b)=>(a.seq||0)-(b.seq||0)).slice(0,all.length-keep).map(r=>r.key);if(del.length)await jTxS(JCHG,"readwrite",st=>{del.forEach(k=>st.delete(k));return null;});}catch(e){}}
async function jSnapPut(rec){try{await jTxS(JSNAP,"readwrite",st=>st.add(rec));return true;}catch(e){return false;}}
async function jSnapAll(pid){try{const r=await jTxS(JSNAP,"readonly",st=>st.index("projectId").getAll(pid));return Array.isArray(r)?r:[];}catch(e){return[];}}
// 同期の「元」（最後にクラウドと合わせた版）。未送信のまま閉じても、次に開いた時に正しく3者照合できるように残す
async function jBasePut(pid,updatedAt,data){if(!pid||!updatedAt)return false;try{await jTxS(JBASE,"readwrite",st=>st.put({pid,updatedAt,data:data||{}}));return true;}catch(e){return false;}}
async function jBaseGet(pid){try{const r=await jTxS(JBASE,"readonly",st=>st.get(pid));return r||null;}catch(e){return null;}}
async function jSnapPrune(pid,keep){try{const all=await jSnapAll(pid);if(all.length<=keep)return;const del=all.sort((a,b)=>a.sid-b.sid).slice(0,all.length-keep).map(r=>r.sid);await jTxS(JSNAP,"readwrite",st=>{del.forEach(k=>st.delete(k));return null;});}catch(e){}}
async function jPut(rec){try{await jTx("readwrite",st=>st.put(rec));if(rec&&rec.id)journalIds.add(rec.id);return true;}catch(e){return false;}}
async function jAll(projectId){try{const r=await jTx("readonly",st=>projectId?st.index("projectId").getAll(projectId):st.getAll());const arr=Array.isArray(r)?r:[];arr.forEach(e=>{if(e&&e.id&&(e.data||e.url))journalIds.add(e.id);});return arr;}catch(e){return[];}}
async function jPatch(id,patch){try{await jTx("readwrite",st=>{const g=st.get(id);g.onsuccess=()=>{if(g.result)st.put({...g.result,...patch});};return null;});return true;}catch(e){return false;}}
async function jDel(ids){try{await jTx("readwrite",st=>{(ids||[]).forEach(id=>st.delete(id));return null;});return true;}catch(e){return false;}}
// ── この端末の名前（履歴に「どの端末が書いたか」を残す） ──
function deviceId(){try{let v=localStorage.getItem("dekigata_device_id");if(!v){v=genUUID().slice(0,8);localStorage.setItem("dekigata_device_id",v);}return v;}catch(e){return"x";}}
function uaKind(ua){ua=String(ua||(typeof navigator!=="undefined"?navigator.userAgent:""));if(/iPhone/.test(ua))return"iPhone";if(/iPad/.test(ua)||(/Macintosh/.test(ua)&&typeof navigator!=="undefined"&&navigator.maxTouchPoints>1))return"iPad";if(/Macintosh/.test(ua))return"Mac/iPad";if(/Android/.test(ua))return"Android";if(/Windows/.test(ua))return"PC";return"端末";}
function deviceLabel(){try{const v=localStorage.getItem("dekigata_device_label");if(v&&v.trim())return v.trim();}catch(e){}return`${uaKind()}-${deviceId().slice(0,4)}`;}
function deviceMeta(){return{device:deviceLabel(),deviceId:deviceId(),v:APP_VERSION,at:new Date().toISOString()};}
// ── 端末への保存（容量オーバーでも、写真を控えに逃がして保存を続ける） ──
let storageWarnSetter=null;let localWriteFull=false;
function writeLocalProjects(list){
  try{localStorage.setItem("dekigata_projects",JSON.stringify(list));localWriteFull=false;return true;}catch(e){localWriteFull=true;}
  try{const slim=(list||[]).map(p=>{const sw=(ph)=>isB64(ph)&&ph.id&&journalIds.has(ph.id)?{...ph,data:"idb:"+ph.id}:ph;return{...p,points:(p.points||[]).map(pt=>pt&&pt.photos?{...pt,photos:Object.fromEntries(Object.entries(pt.photos).map(([k,a])=>[k,(a||[]).map(sw)]))}:pt),checkPhotos:Object.fromEntries(Object.entries(p.checkPhotos||{}).map(([k,a])=>[k,(a||[]).map(sw)])),albumPhotos:(p.albumPhotos||[]).map(sw),photoTrash:(p.photoTrash||[]).map(sw)};});
    localStorage.setItem("dekigata_projects",JSON.stringify(slim));}catch(e){if(storageWarnSetter)storageWarnSetter(true);return false;}
  if(storageWarnSetter)storageWarnSetter(true);return true;
}
async function sbListPhotos(projectId){
  const out=[];for(let off=0;off<5000;off+=1000){const res=await fetch(`${SB_URL}/storage/v1/object/list/dekigata-photos`,{method:"POST",headers:sbHeaders,body:JSON.stringify({prefix:projectId,limit:1000,offset:off,sortBy:{column:"name",order:"asc"}})});if(!res.ok)throw new Error("list failed");const rows=await res.json();(rows||[]).forEach(r=>{if(r&&r.name&&r.id!==null)out.push(r);});if(!rows||rows.length<1000)break;}
  return out;
}
async function sbFetchHistory(projectId){const res=await fetch(`${SB_URL}/rest/v1/dekigata_history?id=eq.${projectId}&select=hid,archived_at,updated_at,reason,n_points,n_photos,new_n_points,new_n_photos,by_device,by_ua&order=archived_at.desc&limit=200`,{headers:sbHeaders});if(!res.ok)throw new Error("history failed");return res.json();}
async function sbFetchHistoryData(hid){const res=await fetch(`${SB_URL}/rest/v1/dekigata_history?hid=eq.${hid}&select=data`,{headers:sbHeaders});if(!res.ok)throw new Error("history failed");const rows=await res.json();return rows[0]?rows[0].data:null;}
function fmtJst(iso){try{return new Date(iso).toLocaleString("ja-JP",{month:"numeric",day:"numeric",hour:"2-digit",minute:"2-digit"});}catch(e){return String(iso||"");}}
function tsDate(ts){const d=new Date(ts);return`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;}
function tsTime(ts){return new Date(ts).toLocaleTimeString("ja-JP",{hour:"2-digit",minute:"2-digit"});}
async function sbFetchDeleted(){const res=await fetch(`${SB_URL}/rest/v1/dekigata_deleted?select=id`,{headers:sbHeaders});if(!res.ok)throw new Error("deleted fetch failed");const rows=await res.json();return new Set(rows.map(r=>r.id));}
function getPendingDel(){try{return JSON.parse(localStorage.getItem("dekigata_pending_del")||"[]");}catch(e){return[];}}
function setPendingDel(a){try{localStorage.setItem("dekigata_pending_del",JSON.stringify(a||[]));}catch(e){}}
async function flushPendingDeletes(){const pend=getPendingDel();if(!pend.length)return;const left=[];for(const id of pend){try{const ok=await sbDeleteProject(id);if(!ok)left.push(id);}catch(e){left.push(id);}}setPendingDel(left);}
// 名前も測点も写真もない工事はクラウドに送らない（空の工事が量産されないように）
function isEmptyProject(d){d=d||{};if(d.header&&String(d.header.projectName||"").trim())return false;if((d.points||[]).length)return false;if((d.albumPhotos||[]).length)return false;if(Object.values(d.checkPhotos||{}).some(a=>(a||[]).length))return false;return true;}
async function sbDeleteProject(id){
  const res=await fetch(`${SB_URL}/rest/v1/dekigata_projects?id=eq.${id}`,{method:"DELETE",headers:sbHeaders});
  return res.ok;
}
// Storageのキーは英数字と . _ - のみ。日本語や記号はハッシュに置換
function countBase64(d){let n=0;const isB=(ph)=>ph&&typeof ph.data==="string"&&(ph.data.startsWith("data:")||ph.data.startsWith("idb:"));(d.points||[]).forEach(pt=>Object.values(pt.photos||{}).forEach(arr=>(arr||[]).forEach(ph=>{if(isB(ph))n++;})));(d.albumPhotos||[]).forEach(ph=>{if(isB(ph))n++;});Object.values(d.checkPhotos||{}).forEach(arr=>(arr||[]).forEach(ph=>{if(isB(ph))n++;}));return n;}
// 元写真（黒板なし）の送信待ち。黒板入りの写真が送れていれば「未送信」表示には数えないが、同期は続ける
function countRawPending(d){d=d||{};let n=0;const isP=(ph)=>ph&&typeof ph.raw==="string"&&ph.raw.startsWith("idb:");(d.points||[]).forEach(pt=>Object.values((pt&&pt.photos)||{}).forEach(arr=>(arr||[]).forEach(ph=>{if(isP(ph))n++;})));(d.albumPhotos||[]).forEach(ph=>{if(isP(ph))n++;});Object.values(d.checkPhotos||{}).forEach(arr=>(arr||[]).forEach(ph=>{if(isP(ph))n++;}));(d.photoTrash||[]).forEach(ph=>{if(isP(ph))n++;});return n;}
// 全体を見るハッシュ（過去の版が「変わったか」の判定用。hashStrは先頭だけを見るので使わない）
function fullHash(t){t=String(t||"");let h=2166136261;for(let i=0;i<t.length;i++){h^=t.charCodeAt(i);h=Math.imul(h,16777619);}return(h>>>0).toString(36)+":"+t.length;}
function hashStr(t){t=String(t||"");const samp=t.slice(0,4000)+"|"+t.length;let h=0;for(let i=0;i<samp.length;i++){h=(h*31+samp.charCodeAt(i))|0;}return "h"+(h>>>0).toString(36);}
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
  const[locked,setLocked]=useState(initialLocked);
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
  const[pendingShot,setPendingShot]=useState(null);
  const[previewZoom,setPreviewZoom]=useState(false);
  const[vp,setVp]=useState(()=>({w:window.innerWidth,h:window.innerHeight}));
  useEffect(()=>{const on=()=>setVp({w:window.innerWidth,h:window.innerHeight});const onOri=()=>{on();setTimeout(on,350);};window.addEventListener("resize",on);window.addEventListener("orientationchange",onOri);return()=>{window.removeEventListener("resize",on);window.removeEventListener("orientationchange",onOri);};},[]);
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
  const[unsynced,setUnsynced]=useState(0);
  const[rescueInfo,setRescueInfo]=useState("");
  const[newVer,setNewVer]=useState(false);
  const[fontScale,setFontScale]=useState(()=>{try{const v=localStorage.getItem("dekigata_zoom");return v?Number(v):1.15;}catch(e){return 1.15;}});
  const setZoom=(z)=>{setFontScale(z);try{localStorage.setItem("dekigata_zoom",String(z));}catch(e){}};
  const[checkDims,setCheckDims]=useState({});
  const[photoTrash,setPhotoTrash]=useState([]);
  const[storageWarn,setStorageWarn]=useState(false);storageWarnSetter=setStorageWarn;
  const[restoreOpen,setRestoreOpen]=useState(false);
  const[rc,setRc]=useState({});
  const[devLabel,setDevLabel]=useState(()=>deviceLabel());
  const[projects,setProjects]=useState([]);
  const[currentProjId,setCurrentProjId]=useState(null);
  const[loaded,setLoaded]=useState(false);
  const[showProjList,setShowProjList]=useState(false);
  const[delMode,setDelMode]=useState(false);const[delSel,setDelSel]=useState([]);
  const[syncStatus,setSyncStatus]=useState("init");
  const syncTimer=useRef(null);
  const projToData=(p)=>{const{id,updatedAt,...rest}=p;return rest;};
  const snapRef=useRef({updatedAt:null,data:null});
  const dirtyRef=useRef(false);
  const lastAppliedRef=useRef(null);
  const stateRef=useRef({});
  const normData=(d)=>{d=d||{};return stripTrashed({pipeType:d.pipeType||"DCIP",roadType:d.roadType||"shidou",surfaceType:d.surfaceType||"asphalt",header:d.header||{projectName:"",location:"",diameter:150},design:d.design||{},points:d.points||[],albumPhotos:d.albumPhotos||[],albumPositions:(d.albumPositions&&d.albumPositions.length)?d.albumPositions:["始点","中間点","終点"],checkItems:d.checkItems||[],checkPhotos:d.checkPhotos||{},checkNotes:d.checkNotes||{},checkDims:d.checkDims||{},photoTrash:Array.isArray(d.photoTrash)?d.photoTrash:[]});};
  // 変更の記録: 前回記録した時点の状態（工事IDつき）からの差分を、端末の箱(IndexedDB)に1件ずつ残す
  const logBaseRef=useRef(null);
  const queueLog=(pid,recs,via)=>{if(!pid||!recs||!recs.length)return;const at=new Date().toISOString();const dev=deviceLabel(),did=deviceId();
    const rows=recs.map(r=>{const seq=nextLogSeq();return{...r,key:`${did}:${seq}`,seq,projectId:pid,at,dev,did,v:APP_VERSION,via:via||"edit",up:0};});jChgPut(rows);};
  const flushLog=()=>{const pid=currentProjIdRef.current;const cur=stateRef.current;const base=logBaseRef.current;if(!pid)return;
    if(!base||base.pid!==pid){logBaseRef.current={pid,data:cur};return;}if(base.data===cur)return;
    let recs=[];try{recs=diffData(base.data,cur);}catch(e){recs=[];}logBaseRef.current={pid,data:cur};if(recs.length)queueLog(pid,recs,"edit");};
  const flushLogRef=useRef(null);flushLogRef.current=flushLog;
  // 新しい版のアプリが出ていたら知らせる（端末に古い版が残らないように）
  const verAtRef=useRef(0);const verCheckRef=useRef(null);
  verCheckRef.current=async(force)=>{if(!force&&Date.now()-verAtRef.current<10*60e3)return;verAtRef.current=Date.now();
    try{const cur=[...document.querySelectorAll("script[src]")].map(s=>s.getAttribute("src")||"").find(s=>/\/assets\/index-[^/]+\.js/.test(s));if(!cur)return;
      const res=await fetch(`/?v=${Date.now()}`,{cache:"no-store"});if(!res.ok)return;const html=await res.text();const m=html.match(/\/assets\/index-[^"'\s>]+\.js/);if(m&&!cur.includes(m[0]))setNewVer(true);}catch(e){}};
  // via を付けた時は「この端末の操作（復元など）」として記録する。付けない時は他端末・読み込み（記録しない）
  const applyData=(d,via)=>{
    flushLog();
    const n=normData(d);
    if(via){try{const recs=diffData(stateRef.current,n);if(recs.length)queueLog(currentProjIdRef.current,recs,via);}catch(e){}}
    setPipeType(n.pipeType);setRoadType(n.roadType);setSurfaceType(n.surfaceType);
    setHeader(n.header);setDesign(n.design);setPoints(n.points);
    setAlbumPhotos(n.albumPhotos);setAlbumPositions(n.albumPositions);
    setCheckItems(n.checkItems);setCheckPhotos(n.checkPhotos);setCheckNotes(n.checkNotes);setCheckDims(n.checkDims);setPhotoTrash(n.photoTrash);
    lastAppliedRef.current=JSON.stringify(n);stateRef.current=n;
    logBaseRef.current={pid:currentProjIdRef.current,data:n};
    return n;
  };
  const resetSync=()=>{snapRef.current={updatedAt:null,data:null};lastAppliedRef.current=null;dirtyRef.current=false;};
  // 未送信（localDirty）の時は「どのクラウド版を元に書き換えたか（baseAt）」も残す → 次に開いた時、他の端末の変更を消さずに3者照合できる
  const mirrorLocal=(id,d,updatedAt,dirty,baseAtArg)=>{const snapAt=(currentProjIdRef.current===id&&snapRef.current&&snapRef.current.updatedAt)||null;
    setProjects(prev=>{const idx=prev.findIndex(p=>p.id===id);const old=idx>=0?prev[idx]:null;const{baseAt:_ba,...dd}=d||{};
      const rec={id,...dd,updatedAt:updatedAt||new Date().toISOString(),localDirty:!!dirty};
      if(dirty){const b=baseAtArg||snapAt||(old&&old.baseAt)||null;if(b)rec.baseAt=b;}
      let next;if(idx<0)next=[...prev,rec];else{next=[...prev];next[idx]=rec;}writeLocalProjects(next);return next;});};
  // 同期の元（クラウドの版）を決める時は必ずここを通す：その工事を開いている時だけ snapRef に入れ、端末の箱にも残す
  const setSnap=(pid,updatedAt,data)=>{if(currentProjIdRef.current===pid)snapRef.current={updatedAt,data};if(updatedAt)jBasePut(pid,updatedAt,data);};

  // 起動時: Supabase優先で読み込み、オフライン時はlocalStorage
  useEffect(()=>{
    (async()=>{
      let cloudOk=false;let cloudProjects=[];let deleted=new Set();
      try{await flushPendingDeletes();}catch(e){}
      try{
        const rows=await sbFetchProjects();
        cloudProjects=rows.map(r=>({id:r.id,...(r.data||{}),updatedAt:r.updated_at}));
        cloudOk=true;
      }catch(e){console.warn("cloud fetch failed",e);}
      try{deleted=await sbFetchDeleted();}catch(e){}
      getPendingDel().forEach(id=>deleted.add(id));
      let local=[];
      try{const raw=localStorage.getItem("dekigata_projects");if(raw)local=JSON.parse(raw);}catch(e){}
      local=(local||[]).filter(lp=>lp&&!deleted.has(lp.id));
      let rescuedN=0;
      if(cloudOk){
        cloudProjects=cloudProjects.filter(c=>!deleted.has(c.id));
        for(const lp of local){
          const ci=cloudProjects.findIndex(c=>c.id===lp.id);
          // 圏外で編集済み(localDirty)はローカル版を優先（開いた時にクラウドとマージ保存される）
          if(ci>=0&&lp.localDirty){cloudProjects[ci]={...lp};continue;}
          // 同期済みの端末でも、クラウドから消えた測点がこの端末に残っていれば救出（上書きで消さない）
          if(ci>=0){const rs=rescueMerge(lp,cloudProjects[ci]);if(rs){cloudProjects[ci]={...rs.data,id:lp.id,updatedAt:cloudProjects[ci].updatedAt,localDirty:true};rescuedN+=rs.restored;}continue;}
          // クラウドに無い工事：未送信（圏外で作成・編集）だけ送る。
          // 送信済みなのにクラウドに無い＝他の端末で削除された → 復活させない（2026/9/23 22:53 の件）
          const legacy=String(lp.id).startsWith("p_");
          if(!lp.localDirty&&!legacy)continue;
          const nid=legacy?genUUID():lp.id;
          const proj={...lp,id:nid,localDirty:true};
          cloudProjects.push(proj);
          const{localDirty:_ld,...pd0}=proj;const pd=projToData(pd0);
          if(!isEmptyProject(pd))sbInsertProject(nid,(proj.header&&proj.header.projectName)||"",pd).then(r=>{if(r&&r.deleted){setProjects(prev=>{const next=prev.filter(p=>p.id!==nid);writeLocalProjects(next);return next;});}}).catch(()=>{});
        }
        setProjects(cloudProjects);
        setSyncStatus("synced");
        writeLocalProjects(cloudProjects);
        if(rescuedN>0)setRescueInfo(`この端末に残っていたデータから ${rescuedN}測点 を戻しました（自動でクラウドに保存します）`);
      }else{
        setProjects(local);
        setSyncStatus("offline");
      }
      const cid=localStorage.getItem("dekigata_currentId");
      if(cid&&!deleted.has(cid))setCurrentProjId(cid);
      setLoaded(true);
    })();
  },[]);

  const currentProjIdRef=useRef(null);currentProjIdRef.current=currentProjId;
  // 端末の控え（IndexedDB）と突き合わせ: 画面・端末保存から消えた写真があれば元の場所へ戻す
  const hydrateRef=useRef(null);
  hydrateRef.current=async(pid)=>{
    if(!pid)return;
    const entries=await jAll(pid);
    const now=Date.now();
    const old=entries.filter(e=>e.syncedAt&&now-e.syncedAt>14*86400e3).map(e=>e.id);if(old.length)jDel(old);
    // 黒板入りはクラウドで確認済み（本体を外した）＋元写真も無い（送り済み・最初から無い）控えは「済」にする
    const fin=entries.filter(e=>!e.syncedAt&&e.url&&!e.data&&!e.plain);fin.forEach(e=>jPatch(e.id,{syncedAt:now}));const finIds=new Set(fin.map(e=>e.id));
    const pending=entries.filter(e=>!e.syncedAt&&!finIds.has(e.id));
    pending.forEach(e=>journalPendingRef.current.add(e.id));
    if(!pending.length||currentProjIdRef.current!==pid)return;
    const byId=new Map(pending.map(e=>[e.id,e]));
    const D=JSON.parse(JSON.stringify(stateRef.current||{}));let filled=0;
    const fill=(ph)=>{let out=ph;if(ph&&typeof ph.data==="string"&&ph.data.startsWith("idb:")){const e=byId.get(ph.data.slice(4));const v=e&&(e.url||e.data);if(v){filled++;out={...out,data:v};}}
      // 元写真（黒板なし）の送信待ちの印が消えていたら付け直す
      const e2=out&&out.id?byId.get(out.id):null;if(e2&&(e2.rawUrl||e2.plain)){const want=e2.rawUrl||("idb:"+e2.id);if(!out.raw||(typeof out.raw==="string"&&out.raw.startsWith("idb:")&&e2.rawUrl)){if(out.raw!==want){filled++;out={...out,raw:want};}}}
      return out;};
    D.points=(D.points||[]).map(pt=>pt&&pt.photos?{...pt,photos:Object.fromEntries(Object.entries(pt.photos).map(([k,a])=>[k,(a||[]).map(fill)]))}:pt);
    D.checkPhotos=Object.fromEntries(Object.entries(D.checkPhotos||{}).map(([k,a])=>[k,(a||[]).map(fill)]));
    D.albumPhotos=(D.albumPhotos||[]).map(fill);D.photoTrash=(D.photoTrash||[]).map(fill);
    const present=new Set();const col=(ph)=>{if(ph&&ph.id)present.add(ph.id);};
    (D.points||[]).forEach(pt=>Object.values((pt&&pt.photos)||{}).forEach(a=>(a||[]).forEach(col)));Object.values(D.checkPhotos||{}).forEach(a=>(a||[]).forEach(col));(D.albumPhotos||[]).forEach(col);(D.photoTrash||[]).forEach(col);
    const missing=pending.filter(e=>!present.has(e.id)&&(e.url||e.data)).map(e=>({...e,data:e.url||e.data,raw:e.rawUrl||(e.plain?"idb:"+e.id:undefined)}));
    const r=placePhotos(D,missing);
    if(!filled&&!r.added)return;
    if(currentProjIdRef.current!==pid)return;
    const n=applyData(r.data,"journal");
    dirtyRef.current=true;mirrorLocal(pid,n,null,true);
    if(r.added)setRescueInfo(`この端末の控えから写真 ${r.added}枚 を元の場所に戻しました（自動でクラウドに保存します）`);
    setTimeout(()=>{if(syncSaveRef.current)syncSaveRef.current();},300);
  };
  // 現在のプロジェクトが変わったら復元
  useEffect(()=>{
    if(!loaded||!currentProjId)return;
    const pj=projects.find(p=>p.id===currentProjId);
    if(pj){
      const{localDirty,...rest}=pj;const d=projToData(rest);
      const n=applyData(d);
      if(localDirty){
        // 未送信のまま閉じた工事：元にしたクラウドの版（baseAt）が分かれば、それを元に3者照合して保存する（他の端末の変更を消さない）
        const bAt=pj.baseAt||null;const pid0=currentProjId;
        snapRef.current={updatedAt:bAt,data:null};dirtyRef.current=true;
        if(bAt)jBaseGet(pid0).then(b=>{if(b&&b.updatedAt===bAt&&currentProjIdRef.current===pid0&&snapRef.current.updatedAt===bAt&&!snapRef.current.data)snapRef.current={updatedAt:bAt,data:b.data||{}};});
        setTimeout(()=>{if(syncSaveRef.current)syncSaveRef.current();},1500);}
      else{setSnap(currentProjId,pj.updatedAt||null,n);dirtyRef.current=false;}
      const nb=countBase64(n);setUnsynced(nb);
      if(nb>0||countRawPending(n)>0){dirtyRef.current=true;setTimeout(()=>{if(syncSaveRef.current)syncSaveRef.current();},1500);}
      setInited(true);
      // 設定済みの工事は、いきなり入力画面から（工事情報→設計値を毎回通らない）
      setScreen(landingFor(n));
      const pid=currentProjId;setTimeout(()=>{if(hydrateRef.current)hydrateRef.current(pid);},200);
      // 前回送り切れなかった変更の記録を倉庫へ
      setTimeout(()=>{if(uploadLogsRef.current&&currentProjIdRef.current===pid)uploadLogsRef.current(true,false);},4000);
    }
  // eslint-disable-next-line
  },[currentProjId,loaded]);

  // 現在の状態を常にrefに（保存処理が最新値を読むため）
  stateRef.current={pipeType,roadType,surfaceType,header,design,points,albumPhotos,albumPositions,checkItems,checkPhotos,checkNotes,checkDims,photoTrash};

  // クラウド保存: 条件付き更新 → 衝突したら取得→3wayマージ→再試行（他端末の入力を消さない）
  const savingRef=useRef(false);const rerunRef=useRef(false);
  const syncSave=async()=>{
    const id=currentProjId;if(!id)return;
    if(savingRef.current){rerunRef.current=true;return;}
    savingRef.current=true;
    try{await syncSaveCore(id);}finally{savingRef.current=false;if(rerunRef.current){rerunRef.current=false;setTimeout(()=>{if(syncSaveRef.current)syncSaveRef.current();},300);}}
  };
  // 端末内の写真（base64／控え"idb:"）を倉庫へ送る。ファイル名に測点・工程を入れる（倉庫だけでも組み直せる）
  // mode: "photos"=黒板入りの写真だけ（保存の前） / "raw"=元写真だけ（保存が済んでから、別に送る）
  const flushBase64=async(id,local,mode)=>{
    const doRaw=mode==="raw";
    let changed=false;let remain=0;const repl=new Map();
    const up=async(dataUrl,fname)=>{try{const blob=await(await fetch(dataUrl)).blob();return await sbUploadPhoto(`${id}/${fname}`,blob);}catch(e){return null;}};
    let jmap=null,jok=true;const jget=async(jid)=>{if(!jmap){try{const arr=await jTx("readonly",st=>st.index("projectId").getAll(id));jmap=new Map((Array.isArray(arr)?arr:[]).map(e=>[e.id,e]));}catch(e){jok=false;jmap=new Map();}}return jmap.get(jid);};
    const send=async(ph,ctx)=>{
      if(!ph||typeof ph.data!=="string")return;
      const key=ph.data;
      if(key.startsWith("idb:")){const e=await jget(key.slice(4));
        if(e&&e.url){ph.data=e.url;repl.set(key,e.url);changed=true;return;}
        if(e&&typeof e.data==="string"&&e.data.startsWith("data:")){const u=await up(e.data,photoFileName(ctx));if(u){ph.data=u;repl.set(key,u);changed=true;jPatch(e.id,{url:u});}else remain++;return;}
        remain++;return;}
      if(!key.startsWith("data:"))return;
      if(!ph.id)ph.id=hashStr(key);
      {const e=await jget(ph.id);if(e&&e.url){ph.data=e.url;repl.set(key,e.url);changed=true;return;}} // 送り済み（URLが控えにある）なら送り直さない
      const u=await up(key,photoFileName(ctx));
      if(u){ph.data=u;repl.set(key,u);changed=true;jPatch(ph.id,{url:u});}else remain++;
    };
    if(!doRaw){
    for(const pt of (local.points||[])){for(const k of Object.keys(pt.photos||{})){for(const ph of (pt.photos[k]||[]))await send(ph,{kind:"pt",point:pt.name,step:k});}}
    for(const ph of (local.albumPhotos||[]))await send(ph,{kind:"al",phase:ph.phase,position:ph.position});
    for(const k of Object.keys(local.checkPhotos||{})){for(const ph of (local.checkPhotos[k]||[]))await send(ph,{kind:"ck",item:k});}
    for(const t of (local.photoTrash||[]))await send(t,t.kind==="ck"?{kind:"ck",item:t.item}:t.kind==="al"?{kind:"al",phase:t.phase,position:t.position}:{kind:"pt",point:t.point,step:t.step});
    }
    // 元写真（黒板なし）は、黒板入りの写真の保存が済んでから別に送る（電波が弱い時も、大事な方の保存を待たせない）
    const rawRepl=new Map();let rawRemain=0;
    if(doRaw){
    const sendRaw=async(ph)=>{
      if(!ph||typeof ph.raw!=="string"||!ph.raw.startsWith("idb:"))return;
      const u=photoUrlOf(ph);if(!u){rawRemain++;return;}
      const e=await jget(ph.raw.slice(4));
      if(e&&e.rawUrl){ph.raw=e.rawUrl;rawRepl.set(ph.id,e.rawUrl);changed=true;return;}
      if(e&&typeof e.plain==="string"&&e.plain.startsWith("data:")){const base=u.split("/").pop().split("?")[0].replace(/\.jpg$/i,"");const r=await up(e.plain,`raw/${base}.${Math.random().toString(36).slice(2,6)}.jpg`);
        if(r){ph.raw=r;rawRepl.set(ph.id,r);changed=true;jPatch(e.id,{rawUrl:r,plain:null});}else rawRemain++;return;}
      // 控えは読めたのに元写真が無い → 待つのをやめる（黒板入りの写真は無事）。控え自体が3回読めない時も同じ
      if(!jok){const n=(rawTries.get(ph.id)||0)+1;rawTries.set(ph.id,n);if(n<3){rawRemain++;return;}}
      delete ph.raw;rawRepl.set(ph.id,null);changed=true;};
    for(const pt of (local.points||[])){for(const k of Object.keys(pt.photos||{})){for(const ph of (pt.photos[k]||[]))await sendRaw(ph);}}
    for(const ph of (local.albumPhotos||[]))await sendRaw(ph);
    for(const k of Object.keys(local.checkPhotos||{})){for(const ph of (local.checkPhotos[k]||[]))await sendRaw(ph);}
    for(const t of (local.photoTrash||[]))await sendRaw(t);
    }
    return{changed,remain,repl,rawRepl,rawRemain};
  };
  // URLへの置き換えを「今の状態」にだけ当てる（保存中に撮った写真・入力を上書きで消さない）
  const fixPh=(x,repl,rawRepl)=>{let y=x;if(y&&typeof y.data==="string"&&repl&&repl.has(y.data))y={...y,data:repl.get(y.data)};
    if(y&&y.id&&rawRepl&&rawRepl.has(y.id)&&typeof y.raw==="string"&&y.raw.startsWith("idb:")){const r=rawRepl.get(y.id);y={...y};if(r)y.raw=r;else delete y.raw;}return y;};
  const replPhotos=(arr,repl,rawRepl)=>{if(!Array.isArray(arr))return arr;let ch=false;const out=arr.map(x=>{const y=fixPh(x,repl,rawRepl);if(y!==x)ch=true;return y;});return ch?out:arr;};
  const replPhotoMap=(m,repl,rawRepl)=>{if(!m)return m;let ch=false;const out={};Object.keys(m).forEach(k=>{const a=replPhotos(m[k],repl,rawRepl);if(a!==m[k])ch=true;out[k]=a;});return ch?out:m;};
  const replPoints=(pts,repl,rawRepl)=>{if(!Array.isArray(pts))return pts;let ch=false;const out=pts.map(pt=>{if(!pt||!pt.photos)return pt;const ph=replPhotoMap(pt.photos,repl,rawRepl);if(ph===pt.photos)return pt;ch=true;return{...pt,photos:ph};});return ch?out:pts;};
  const replData=(d,repl,rawRepl)=>({...d,points:replPoints(d.points,repl,rawRepl),checkPhotos:replPhotoMap(d.checkPhotos,repl,rawRepl),albumPhotos:replPhotos(d.albumPhotos,repl,rawRepl),photoTrash:replPhotos(d.photoTrash,repl,rawRepl)});
  const applyRepl=(repl,rawRepl)=>{if((!repl||!repl.size)&&(!rawRepl||!rawRepl.size))return;
    setPoints(p=>replPoints(p,repl,rawRepl));setCheckPhotos(m=>replPhotoMap(m,repl,rawRepl));setAlbumPhotos(a=>replPhotos(a,repl,rawRepl));setPhotoTrash(t=>replPhotos(t,repl,rawRepl));
    setCur(p=>{if(!p||!p.photos)return p;const ph=replPhotoMap(p.photos,repl,rawRepl);return ph===p.photos?p:{...p,photos:ph};});};
  // クラウドへ送る中身: 倉庫にまだ無い写真（base64・控え）は入れない（DBが重くならない。次の送信で入る）。元写真の送信待ちの印も入れない
  const forCloud=(d)=>{const ok=(ph)=>!(ph&&typeof ph.data==="string"&&(ph.data.startsWith("data:")||ph.data.startsWith("idb:")));const cl=(ph)=>{if(ph&&typeof ph.raw==="string"&&ph.raw.startsWith("idb:")){const{raw,...rest}=ph;return rest;}return ph;};const keep=(a)=>Array.isArray(a)?a.filter(ok).map(cl):a;
    return{...d,points:(d.points||[]).map(pt=>pt&&pt.photos?{...pt,photos:Object.fromEntries(Object.entries(pt.photos).map(([k,a])=>[k,keep(a)]))}:pt),checkPhotos:Object.fromEntries(Object.entries(d.checkPhotos||{}).map(([k,a])=>[k,keep(a)])),albumPhotos:keep(d.albumPhotos||[]),photoTrash:keep(d.photoTrash||[])};};
  // 端末の控え: クラウドに届いた写真は、控えから写真本体を外す（2週間後に記録ごと消す）
  const journalPendingRef=useRef(new Set());
  // 黒板入りが届いたら控えの写真本体を外す。元写真（黒板なし）も届いたら「済」（2週間後に記録ごと消す）
  // 元写真は、記録に倉庫のURLが入ったのを見てから外す（印が一時的に消えていても、まだ送っていない元写真を消さない）
  const markJournalSynced=(d)=>{const pend=journalPendingRef.current;if(!pend.size)return;const done=[],half=[];const chk=(ph)=>{if(ph&&ph.id&&pend.has(ph.id)&&photoUrlOf(ph)){if(typeof ph.raw==="string"&&/^https?:/.test(ph.raw))done.push(ph.id);else half.push(ph.id);}};
    (d.points||[]).forEach(pt=>Object.values((pt&&pt.photos)||{}).forEach(a=>(a||[]).forEach(chk)));Object.values(d.checkPhotos||{}).forEach(a=>(a||[]).forEach(chk));(d.albumPhotos||[]).forEach(chk);(d.photoTrash||[]).forEach(chk);
    done.forEach(id=>{pend.delete(id);jPatch(id,{syncedAt:Date.now(),data:null,plain:null});});half.forEach(id=>{jPatch(id,{data:null});});};
  const syncSaveCore=async(id)=>{
    // 途中で別の工事に切り替わったら、そのあとは「その工事の端末保存」以外にさわらない（別の工事に中身が混ざらないように）
    const still=()=>currentProjIdRef.current===id;
    try{
      if(!still())return;
      // 未送信(base64)写真を先にStorageへ → DBには URL だけを入れる
      const work=JSON.parse(JSON.stringify(stateRef.current));
      const fl=await flushBase64(id,work,"photos");
      if(!still())return; // 送れた写真のURLは端末の控えに残る → 次にその工事を開いた時に入る
      // 送れた写真はURLに置き換え（今の状態に当てるだけ。保存中に撮った写真は消さない）
      const anyRepl=fl.repl.size>0||fl.rawRepl.size>0;
      let local=anyRepl?replData(stateRef.current,fl.repl,fl.rawRepl):stateRef.current;
      if(anyRepl){applyRepl(fl.repl,fl.rawRepl);lastAppliedRef.current=JSON.stringify(local);}
      setUnsynced(countBase64(local));
      let snap=snapRef.current;
      // 保存ガード: 測点が減った状態は絶対にクラウドへ送らない（消えた測点を戻してから送る）
      const g=guardLostPoints(local,snap.data);
      if(g){local=g.data;applyData(local,"guard");stateRef.current=local;setRescueInfo(`消えかけた ${g.restored}測点 を元に戻しました`);}
      if(!snap.updatedAt&&isEmptyProject(local)){setSyncStatus("synced");return;}
      const saved=(row,payload)=>{const cur=still();const pendPh=countBase64(local)>0;const pend=pendPh||countRawPending(local)>0;
        if(cur){snapRef.current={updatedAt:row.updated_at,data:payload};dirtyRef.current=pend;lastAppliedRef.current=JSON.stringify(normData(local));}
        jBasePut(id,row.updated_at,payload);
        // 元写真（黒板なし）だけが送信待ちの時は「未送信」にしない（次に開いた時、古い版で他の端末の変更を上書きしないように）
        mirrorLocal(id,local,row.updated_at,pendPh,row.updated_at);markJournalSynced(local);
        if(cur){setSyncStatus(pendPh?"offline":"synced");if(afterSaveRef.current)afterSaveRef.current(id,payload);}};
      for(let attempt=0;attempt<3;attempt++){
        const name=(local.header&&local.header.projectName)||"";
        const payload=forCloud(local);
        if(JSON.stringify(payload).length>2500000){setSyncStatus("offline");setToast("データが大きすぎて送れません（写真以外を確認）");setTimeout(()=>setToast(""),3000);return;}
        let r;
        if(snap.updatedAt)r=await sbConditionalUpdate(id,name,payload,snap.updatedAt);
        else r=await sbInsertProject(id,name,payload);
        if(r.ok){saved(r.row,payload);return;}
        if(r.deleted){if(still())handleRemoteDeleted();return;}
        if(!still())return;
        // 衝突: クラウドの最新を取ってマージ
        const cloudRow=await sbFetchProject(id);
        if(!still())return;
        if(!cloudRow){const ins=await sbInsertProject(id,name,payload);if(ins.ok){saved(ins.row,payload);return;}if(ins.deleted){if(still())handleRemoteDeleted();return;}if(!still())return;continue;}
        const merged=mergeProjectData(local,cloudRow.data||{},snap.data||{});
        applyData(merged);
        setSnap(id,cloudRow.updated_at,cloudRow.data||{});
        local=merged;snap=snapRef.current;stateRef.current=merged;
        setToast("他端末の更新と統合しました");setTimeout(()=>setToast(""),3000);
      }
      if(still())setSyncStatus("offline");
    }catch(e){console.warn("sync err",e);if(still())setSyncStatus("offline");}
  };
  const syncSaveRef=useRef(null);syncSaveRef.current=syncSave;

  // ── 変更の記録を倉庫へ（3分に1回まで。画面を閉じる時は必ず。送れなかった分は端末の箱に残り、次に送る） ──
  const logUpRef=useRef({at:0,busy:false});
  const uploadLogs=async(force,keepalive)=>{
    const pid=currentProjIdRef.current;if(!pid)return;const st=logUpRef.current;if(st.busy)return;if(!force&&Date.now()-st.at<180000)return;
    st.busy=true;
    try{const all=await jChgAll(pid);const pend=all.filter(r=>!r.up).sort((a,b)=>(a.seq||0)-(b.seq||0));
      for(let i=0;i<pend.length;i+=150){const part=pend.slice(i,i+150);
        const body={app:"dekigata",kind:"log",v:APP_VERSION,device:deviceLabel(),deviceId:deviceId(),projectId:pid,at:new Date().toISOString(),rows:part.map(({up,projectId,...r})=>r)};
        const ok=await sbUploadJson(`${pid}/log/${Date.now()}_${deviceId()}_${Math.random().toString(36).slice(2,6)}.json`,body,keepalive);
        if(!ok)break;await jChgMarkUp(part.map(r=>r.key));}
      st.at=Date.now();jChgPrune(pid,3000);
    }catch(e){}finally{st.busy=false;}};
  const uploadLogsRef=useRef(null);uploadLogsRef.current=uploadLogs;
  // ── 過去の版：この端末に10分おき（変わった時だけ・最新60件）、倉庫に3時間おき ──
  const snapMemRef=useRef({});
  const snapLocal=(pid,data)=>{if(!pid||!data)return;const sig=fullHash(JSON.stringify(data));const m=snapMemRef.current[pid]||{};if(m.sig===sig||(m.at&&Date.now()-m.at<600000))return;
    snapMemRef.current[pid]={at:Date.now(),sig};jSnapPut({projectId:pid,at:new Date().toISOString(),dev:deviceLabel(),v:APP_VERSION,np:(data.points||[]).length,nph:countPhotosIn(data),data}).then(()=>jSnapPrune(pid,60));};
  const snapCloud=async(pid,data)=>{if(!pid||!data)return;const k=`dekigata_snapc_${pid}`;let m={};try{m=JSON.parse(localStorage.getItem(k)||"{}")||{};}catch(e){}
    const sig=fullHash(JSON.stringify(data));if(m.sig===sig||(m.at&&Date.now()-m.at<3*3600e3))return;
    const ok=await sbUploadJson(`${pid}/snap/${Date.now()}_${deviceId()}_${b64u(deviceLabel()).slice(0,60)}.json`,{app:"dekigata",kind:"snap",v:APP_VERSION,device:deviceLabel(),deviceId:deviceId(),projectId:pid,at:new Date().toISOString(),np:(data.points||[]).length,nph:countPhotosIn(data),data},false);
    if(ok){try{localStorage.setItem(k,JSON.stringify({at:Date.now(),sig}));}catch(e){}}};
  // ── 元写真（黒板なし）は保存が済んでから別に送る。送れたら自動保存でクラウドにURLが入る ──
  const rawBusyRef=useRef(false);
  const uploadRaws=async()=>{const id=currentProjIdRef.current;if(!id||rawBusyRef.current)return;if(!countRawPending(stateRef.current))return;rawBusyRef.current=true;
    try{const work=JSON.parse(JSON.stringify(stateRef.current));const fl=await flushBase64(id,work,"raw");
      if(fl.rawRepl.size&&currentProjIdRef.current===id)applyRepl(null,fl.rawRepl);
    }catch(e){}finally{rawBusyRef.current=false;}};
  const uploadRawsRef=useRef(null);uploadRawsRef.current=uploadRaws;
  const afterSaveRef=useRef(null);
  afterSaveRef.current=(pid,payload)=>{snapLocal(pid,payload);snapCloud(pid,payload).catch(()=>{});uploadLogs(false,false);setTimeout(()=>{if(uploadRawsRef.current)uploadRawsRef.current();},300);};

  // 自動保存: 状態変化 → ローカル即時 + 2秒後にクラウド（条件付き）
  useEffect(()=>{
    if(!loaded||!inited||!currentProjId)return;
    if(lastAppliedRef.current!==null&&JSON.stringify(stateRef.current)===lastAppliedRef.current)return;
    dirtyRef.current=true;
    mirrorLocal(currentProjId,stateRef.current,null,true);
    setSyncStatus("syncing");
    if(syncTimer.current)clearTimeout(syncTimer.current);
    syncTimer.current=setTimeout(()=>{flushLog();try{snapLocal(currentProjIdRef.current,forCloud(stateRef.current));}catch(e){}if(syncSaveRef.current)syncSaveRef.current();},2000);
  // eslint-disable-next-line
  },[header,design,points,albumPhotos,albumPositions,checkItems,checkPhotos,checkNotes,checkDims,photoTrash,pipeType,roadType,surfaceType,loaded,inited,currentProjId]);

  // 前面復帰・一覧に戻った時・回線復帰: クラウドの最新を取り込む（未保存があればマージ）
  const refreshRef=useRef(null);
  refreshRef.current=async()=>{
    if(!loaded||!currentProjId||screen==="entry")return;
    const pid=currentProjId;const still=()=>currentProjIdRef.current===pid;
    try{
      const row=await sbFetchProject(pid);
      if(!still())return; // 読んでいる間に別の工事に切り替わった → 何もしない
      if(!row){
        let del=new Set();try{del=await sbFetchDeleted();}catch(e){}
        if(!still())return;
        if(del.has(pid)){handleRemoteDeleted();return;}
        if(dirtyRef.current&&syncSaveRef.current)syncSaveRef.current();
        return;
      }
      if(row.updated_at===snapRef.current.updatedAt){if(dirtyRef.current&&syncSaveRef.current)syncSaveRef.current();return;}
      if(dirtyRef.current){
        const merged=mergeProjectData(stateRef.current,row.data||{},snapRef.current.data||{});
        applyData(merged);
        setSnap(pid,row.updated_at,row.data||{});
        if(syncSaveRef.current)syncSaveRef.current();
      }else{
        // 他の端末の版で測点が消えていたら、取り込まずにこの端末のデータで戻す
        const rs=rescueMerge(stateRef.current,row.data||{});
        if(rs){
          applyData(rs.data,"rescue");
          setSnap(pid,row.updated_at,row.data||{});
          dirtyRef.current=true;mirrorLocal(pid,rs.data,row.updated_at,true);
          setRescueInfo(`他の端末で消えた ${rs.restored}測点 を、この端末のデータから戻しました`);
          if(syncSaveRef.current)syncSaveRef.current();
          return;
        }
        applyData(row.data||{});
        setSnap(pid,row.updated_at,row.data||{});
        mirrorLocal(pid,row.data||{},row.updated_at,false);
        setSyncStatus("synced");setToast("他端末の更新を取り込みました");setTimeout(()=>setToast(""),2500);
        const nb2=countBase64(row.data||{});setUnsynced(nb2);if(nb2>0){dirtyRef.current=true;setTimeout(()=>{if(syncSaveRef.current)syncSaveRef.current();},1000);}
      }
    }catch(e){}
  };
  // 一覧をクラウドと突き合わせ（他端末で作った工事が出る／削除された工事が消える）
  const reconcileRef=useRef(null);
  reconcileRef.current=async()=>{
    if(!loaded)return;
    try{
      await flushPendingDeletes();
      const rows=await sbFetchProjects();
      let deleted=new Set();try{deleted=await sbFetchDeleted();}catch(e){}
      getPendingDel().forEach(id=>deleted.add(id));
      const cloud=rows.filter(r=>!deleted.has(r.id)).map(r=>({id:r.id,...(r.data||{}),updatedAt:r.updated_at}));
      const cloudIds=new Set(cloud.map(c=>c.id));
      setProjects(prev=>{
        const prevMap=new Map(prev.map(p=>[p.id,p]));
        const out=cloud.map(c=>{const lp=prevMap.get(c.id);if(lp&&(lp.localDirty||lp.id===currentProjId))return lp;if(lp){const rs=rescueMerge(lp,c);if(rs)return{...rs.data,id:c.id,updatedAt:c.updatedAt,localDirty:true};}return c;});
        prev.forEach(lp=>{if(cloudIds.has(lp.id)||deleted.has(lp.id))return;if(lp.localDirty||lp.id===currentProjId)out.push(lp);});
        writeLocalProjects(out);
        return out;
      });
      if(currentProjId&&deleted.has(currentProjId)&&currentProjIdRef.current===currentProjId)handleRemoteDeleted();
    }catch(e){}
  };
  useEffect(()=>{if(showProjList){setDelMode(false);setDelSel([]);if(reconcileRef.current)reconcileRef.current();}},[showProjList]);
  useEffect(()=>{
    // 画面を離れる時は、変更の記録を必ず書き出して倉庫へ送る（送り切れなくても端末の箱に残る）
    const onHide=()=>{try{if(flushLogRef.current)flushLogRef.current();}catch(e){}if(uploadLogsRef.current)uploadLogsRef.current(true,document.visibilityState==="hidden");};
    const onVis=()=>{if(document.visibilityState==="visible"){if(refreshRef.current)refreshRef.current();if(reconcileRef.current)reconcileRef.current();if(verCheckRef.current)verCheckRef.current(false);}else onHide();};
    const onOnline=()=>{if(dirtyRef.current&&syncSaveRef.current)syncSaveRef.current();else if(refreshRef.current)refreshRef.current();};
    document.addEventListener("visibilitychange",onVis);window.addEventListener("focus",onVis);window.addEventListener("online",onOnline);window.addEventListener("pagehide",onHide);
    return()=>{document.removeEventListener("visibilitychange",onVis);window.removeEventListener("focus",onVis);window.removeEventListener("online",onOnline);window.removeEventListener("pagehide",onHide);};
  },[]);
  useEffect(()=>{if(screen==="list"){if(refreshRef.current)refreshRef.current();if(reconcileRef.current)reconcileRef.current();}},[screen]);
  // 版の確認：開いて5秒後と30分ごと
  useEffect(()=>{const t=setTimeout(()=>{if(verCheckRef.current)verCheckRef.current(true);},5000);const iv=setInterval(()=>{if(verCheckRef.current)verCheckRef.current(false);},30*60e3);return()=>{clearTimeout(t);clearInterval(iv);};},[]);

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
    flushLog();
    resetSync();
    const id=genUUID();
    setCurrentProjId(id);localStorage.setItem("dekigata_currentId",id);
    setPipeType("DCIP");setRoadType("shidou");setSurfaceType("asphalt");
    setHeader({projectName:"",location:"",diameter:150,projectType:""});
    setDesign({});setPoints([]);setAlbumPhotos([]);setAlbumPositions(["始点","中間点","終点"]);setCheckItems([]);setCheckPhotos({});setCheckNotes({});setCheckDims({});setPhotoTrash([]);setInited(false);
    setScreen("setup");setShowProjList(false);
    setToast("新規プロジェクト作成");setTimeout(()=>setToast(""),2000);
  };
  const switchProject=(id)=>{
    flushLog();
    resetSync();
    setCurrentProjId(id);localStorage.setItem("dekigata_currentId",id);
    setShowProjList(false);setScreen("setup");
    setToast("プロジェクト切替");setTimeout(()=>setToast(""),2000);
  };
  const startBlankState=()=>{setHeader({projectName:"",location:"",diameter:150,projectType:""});setDesign({});setPoints([]);setAlbumPhotos([]);setAlbumPositions(["始点","中間点","終点"]);setCheckItems([]);setCheckPhotos({});setCheckNotes({});setCheckDims({});setPhotoTrash([]);setInited(false);};
  const switchAwayFrom=(removedIds)=>{
    flushLog();
    if(syncTimer.current)clearTimeout(syncTimer.current);
    const remaining=projects.filter(p=>!removedIds.has(p.id));
    resetSync();startBlankState();
    if(remaining.length>0){const latest=[...remaining].sort((a,b)=>(b.updatedAt||"").localeCompare(a.updatedAt||""))[0];setCurrentProjId(latest.id);try{localStorage.setItem("dekigata_currentId",latest.id);}catch(e){}}
    else{const nid=genUUID();setCurrentProjId(nid);try{localStorage.setItem("dekigata_currentId",nid);}catch(e){}}
    setScreen("setup");
  };
  // 開いていた工事が他の端末で削除されていた時
  const handleRemoteDeleted=()=>{
    const id=currentProjId;if(!id)return;
    try{if(dirtyRef.current){const o=JSON.parse(localStorage.getItem("dekigata_orphans")||"[]");o.unshift({id,savedAt:new Date().toISOString(),data:stateRef.current});localStorage.setItem("dekigata_orphans",JSON.stringify(o.slice(0,5)));}}catch(e){}
    setProjects(prev=>{const next=prev.filter(p=>p.id!==id);writeLocalProjects(next);return next;});
    switchAwayFrom(new Set([id]));
    setToast("この工事は他の端末で削除されました");setTimeout(()=>setToast(""),3500);
  };
  const deleteProjects=async(ids)=>{
    const idset=new Set(ids);const fail=[];
    for(const id of ids){let ok=false;try{ok=await sbDeleteProject(id);}catch(e){}if(!ok)fail.push(id);}
    if(fail.length){const a=getPendingDel();fail.forEach(id=>{if(!a.includes(id))a.push(id);});setPendingDel(a);}
    setProjects(prev=>{const next=prev.filter(p=>!idset.has(p.id));writeLocalProjects(next);return next;});
    if(idset.has(currentProjId))switchAwayFrom(idset);
    return{n:ids.length,pend:fail.length};
  };
  const deleteProject=async(id)=>{
    const pj=projects.find(p=>p.id===id);
    if(!confirm(`「${(pj&&pj.header&&pj.header.projectName)||"(名称未設定)"}」を削除しますか?\n全端末から消えます。`))return;
    const r=await deleteProjects([id]);
    setToast(r.pend?"削除しました（電波が戻ったらクラウドからも消します）":"削除しました");setTimeout(()=>setToast(""),2500);
  };
  const bulkDelete=async()=>{
    if(!delSel.length)return;
    if(!confirm(`チェックした${delSel.length}件を削除しますか?\n全端末から消えます。`))return;
    const r=await deleteProjects(delSel);
    setDelSel([]);setDelMode(false);
    setToast(`${r.n}件削除しました${r.pend?`（${r.pend}件は電波復帰後にクラウドから削除）`:""}`);setTimeout(()=>setToast(""),3000);
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

  // 種別を変えた時は設計厚を初期値に（B・Baは残す）。測点・写真には一切さわらない（9/25 の事故の原因だった）
  const applyTypeDefaults=(p,r,sf)=>{const st=getSteps(p,r,sf,ROADS.find(x=>x.key===r).D);setDesign(d=>({...getDefaults(st),B:d.B||"",Ba:d.Ba||""}));};
  if(!inited&&loaded&&currentProjId&&!projects.find(p=>p.id===currentProjId)){applyTypeDefaults("DCIP","shidou","asphalt");setInited(true);}
  // 出来形の入力（工程番号で保存される実測値・写真）がある工事は種別を変えさせない（数字・写真が別の工程にずれるため）
  const typeLocked=hasDekigataData(points);
  const typeChangeOk=()=>{
    if(typeLocked){window.alert("出来形の入力（実測値・出来形の写真）がある工事は、管種・道路・路面を変えられません。\n\n変えると、入力済みの数字や写真が別の工程にずれてしまうためです。\n種別が違っていた時は、新しい工事を作って入れ直してください。");return false;}
    if(!(points||[]).some(hasPtData))return true;return window.confirm("この工事には入力済みの測点があります。\n\n変更しても測点・写真は消えません。\n各層の設計厚は新しい種別の初期値になります。\n\n変更しますか？");};

  const calcDesignH=(sid,measured)=>designHFor(steps.find(s=>s.id===sid),steps,design,H0,D,measured||cur.measured,surfaceType);
  const dv=(f,sid,m)=>{if(f==="H")return calcDesignH(sid,m);if(f==="B")return design.B?Number(design.B):null;if(f==="Ba")return design.Ba?Number(design.Ba):null;if(f==="D")return D;if(f==="D2")return D2;if(f==="ta")return Number(design.ta)||40;return design[f]?Number(design[f]):null;};
  const calcT=(step,meas)=>calcTm(step,steps,meas);
  const prevLbl=(step)=>{if(!step.prevRef)return"";if(step.prevRef==="D"){const ds=steps.find(s=>s.inputs.includes("D"));return`D(${ds?.id})−H(${step.id})`;}return`H(${step.prevRef})−H(${step.id})`;};

  // 同じボタンをもう一度押しても何も起きない。入力済みの測点がある時は確認してから
  const selPipe=(k)=>{if(k===pipeType)return;if(!typeChangeOk())return;setPipeType(k);const ds=getDias(k);if(ds.length&&!ds.includes(header.diameter))setHeader(h=>({...h,diameter:ds[0]}));applyTypeDefaults(k,roadType,surfaceType);};
  const selRoad=(k)=>{if(k===roadType)return;if(!typeChangeOk())return;setRoadType(k);applyTypeDefaults(pipeType,k,surfaceType);};
  const selSurface=(k)=>{if(k===surfaceType)return;if(!typeChangeOk())return;setSurfaceType(k);applyTypeDefaults(pipeType,roadType,k);};
  const bulkCreate=()=>{const pts=[];for(let i=0;i<bulkCount;i++)pts.push({name:`No.${i}`,date:"",measured:{},photos:{},dates:{}});setPoints(p=>(p&&p.length)?p:pts);};
  const rescueBanner=(<>{rescueInfo?(<div onClick={()=>setRescueInfo("")} style={{background:"#E8F5E9",border:"2px solid #2E7D32",borderRadius:10,padding:"10px 12px",margin:"0 4px 10px",fontSize:14,fontWeight:700,color:"#1B5E20",cursor:"pointer"}}>✅ {rescueInfo}<div style={{fontSize:11,fontWeight:500,color:"#555",marginTop:2}}>（タップで閉じる）</div></div>):null}
    {storageWarn&&<div style={{background:"#FFEBEE",border:"1.5px solid #C62828",borderRadius:10,padding:"8px 12px",margin:"0 4px 10px",fontSize:13,fontWeight:700,color:"#B71C1C"}}>⚠ この端末の保存領域がいっぱいです。撮った写真は端末の控えに保存済み。電波のある所で開いて同期してください</div>}
    {newVer&&<div onClick={()=>{try{flushLog();}catch(e){}window.location.reload();}} style={{background:"#FFF3E0",border:"2px solid #E65100",borderRadius:10,padding:"10px 12px",margin:"0 4px 10px",fontSize:14,fontWeight:700,color:"#BF360C",cursor:"pointer"}}>🔄 アプリの新しい版があります（今 v{APP_VERSION}）。ここを押すと更新します<div style={{fontSize:11,fontWeight:500,color:"#555",marginTop:2}}>入力・写真は消えません</div></div>}</>);

  // ═══ 🛟 復元センター ═══
  const commitData=(d,msg)=>{const n=applyData(d,"restore");dirtyRef.current=true;mirrorLocal(currentProjId,n,null,true);if(msg)setRescueInfo(msg);setTimeout(()=>{if(syncSaveRef.current)syncSaveRef.current();},300);};
  const stepLabel=(sid)=>{const s=mergedSteps.find(x=>String(x.id)===String(sid))||steps.find(x=>String(x.id)===String(sid));return s?(s.photoOnly?s.name:`${s.id}.${s.name}`):`工程${sid}`;};
  const whereLabel=(o)=>o.kind==="ck"?`チェック「${o.item||"?"}」`:o.kind==="al"?`台帳 ${o.phase==="comp"?"完成":"着手前"}・${o.position||"位置不明"}`:`${o.point||"?"}・${stepLabel(o.step)}`;
  const openRestore=()=>{setShowProjList(false);setRc({});setRestoreOpen(true);};
  const rcScanStorage=async()=>{
    const pid=currentProjId;if(!pid)return;
    setRc(r=>({...r,scanLoading:true,scanErr:null}));
    try{
      // 削除から「新しい工事として」戻した工事は、元の工事の写真の場所も調べる
      const origin=((stateRef.current&&stateRef.current.header)||{}).originId;
      const files=(await sbListPhotos(pid)).map(f=>({...f,_pfx:pid}));
      if(origin&&origin!==pid){try{(await sbListPhotos(origin)).forEach(f=>files.push({...f,_pfx:origin}));}catch(e){}}
      const d=stateRef.current;const linked=new Set();const col=(ph)=>{const u=photoUrlOf(ph);if(u)linked.add(u);};
      (d.points||[]).forEach(pt=>Object.values((pt&&pt.photos)||{}).forEach(a=>(a||[]).forEach(col)));Object.values(d.checkPhotos||{}).forEach(a=>(a||[]).forEach(col));(d.albumPhotos||[]).forEach(col);(d.photoTrash||[]).forEach(col);
      const known={points:(d.points||[]).map(p=>p&&p.name).filter(Boolean),steps:[...new Set([...mergedSteps,...steps].map(s=>String(s.id)))],items:d.checkItems||[]};
      const urlOf=(f)=>`${SB_URL}/storage/v1/object/public/dekigata-photos/${f._pfx}/${f.name}`;
      const place=(p)=>p.kind==="ck"?`ck|${p.item}`:p.kind==="al"?`al|${p.phase}|${p.position||""}`:`pt|${p.point}|${p.step}`;
      const parsed=files.map(f=>({name:f.name,url:urlOf(f),size:(f.metadata&&f.metadata.size)||0,p:parsePhotoName(f.name,known)}));
      const seen=new Set();parsed.filter(x=>linked.has(x.url)&&x.p).forEach(x=>{if(x.size)seen.add(place(x.p)+"|"+x.size);});
      const orphans=[],dups=[],unknown=[];
      parsed.filter(x=>!linked.has(x.url)).sort((a,b)=>((a.p&&a.p.ts)||0)-((b.p&&b.p.ts)||0)).forEach(x=>{
        const p=x.p;if(!p||(p.kind==="pt"&&(!p.point||!p.step))||(p.kind==="ck"&&!p.item)){unknown.push(x);return;}
        const k=place(p)+"|"+x.size;if(x.size&&seen.has(k)){dups.push(x);return;}seen.add(k);orphans.push(x);});
      // 初めからチェックを入れるのは「今その場所に写真が無い」所の、いちばん新しい1枚だけ（テスト写真などを誤って取り込まない）
      const slotHas=(p)=>{if(p.kind==="ck")return((d.checkPhotos||{})[p.item]||[]).length>0;if(p.kind==="al")return(d.albumPhotos||[]).some(x=>x&&(x.phase||"pre")===(p.phase||"pre")&&(x.position||"")===(p.position||""));const pt=(d.points||[]).find(q=>q&&q.name===p.point);return !!pt&&((pt.photos||{})[String(p.step)]||[]).length>0;};
      const latest=new Map();orphans.forEach(o=>{const k=place(o.p);const pv=latest.get(k);if(!pv||((o.p.ts||0)>(pv.p.ts||0)))latest.set(k,o);});
      setRc(r=>({...r,scanLoading:false,scanned:true,total:files.length,orphans,dups,unknown,sel:Object.fromEntries(orphans.map(o=>[o.url,!slotHas(o.p)&&latest.get(place(o.p))===o]))}));
    }catch(e){setRc(r=>({...r,scanLoading:false,scanErr:"倉庫を読めませんでした（電波を確認してもう一度）"}));}
  };
  const rcImportOrphans=()=>{
    const pick=(rc.orphans||[]).filter(o=>rc.sel&&rc.sel[o.url]);if(!pick.length)return;
    const entries=pick.map(o=>({kind:o.p.kind,point:o.p.point,step:o.p.step,item:o.p.item,phase:o.p.phase,position:o.p.position,data:o.url,id:hashStr(o.url),time:tsTime(o.p.ts),date:tsDate(o.p.ts),restored:"storage"}));
    const r=placePhotos(stateRef.current,entries);
    if(!r.added){setToast("取り込む写真はありませんでした");setTimeout(()=>setToast(""),2500);return;}
    commitData(r.data,`倉庫の写真 ${r.added}枚 を元の測点・工程に戻しました${r.newPoints?`（測点${r.newPoints}つ追加）`:""}`);
    setRc(r0=>({...r0,orphans:(r0.orphans||[]).filter(o=>!(r0.sel&&r0.sel[o.url])),sel:{}}));
  };
  // ── ② 過去の版（クラウドの履歴・倉庫の控え・この端末の控え）をまとめて新しい順に ──
  const rcLoadHistory=async()=>{const pid=currentProjId;setRc(r=>({...r,histLoading:true,histErr:null}));
    const out=[];let err=null;
    try{const rows=await sbFetchHistory(pid);(rows||[]).forEach(h=>out.push({key:"h"+h.hid,src:"cloud",at:h.archived_at,h}));}catch(e){err="クラウドの履歴を読めませんでした（電波を確認）";}
    try{const files=await sbListFolder(`${pid}/snap`);files.forEach(f=>{const m=String(f.name).match(/^(\d{13})_([^_]+)_?([^.]*)\.json$/);const dev=m&&m[3]?(unb64u(m[3])||""):"";out.push({key:"s"+f.name,src:"storage",at:m?new Date(Number(m[1])).toISOString():(f.created_at||""),path:`${pid}/snap/${f.name}`,dev});});}catch(e){}
    try{(await jSnapAll(pid)).forEach(s=>out.push({key:"l"+s.sid,src:"device",at:s.at,dev:s.dev,np:s.np,nph:s.nph,data:s.data}));}catch(e){}
    out.sort((a,b)=>String(b.at).localeCompare(String(a.at)));
    setRc(r=>({...r,histLoading:false,histErr:out.length?null:err,history:out,histN:40}));};
  const rcRestoreVersion=async(v)=>{
    let old=null,label="";
    try{if(v.src==="cloud"){old=await sbFetchHistoryData(v.h.hid);label=`${fmtJst(v.at)} の版`;}
      else if(v.src==="storage"){const j=await sbGetJson(v.path);old=j&&j.data;label=`${fmtJst(v.at)} の版（倉庫）`;}
      else{old=v.data;label=`${fmtJst(v.at)} の版（この端末）`;}}catch(e){}
    if(!old){setToast("この版を読めませんでした");setTimeout(()=>setToast(""),2500);return;}
    const r=additiveRestore(stateRef.current,old);
    if(!r.addP&&!r.addPh&&!r.addV){setToast("この版から戻せる分はありませんでした（今の方がそろっています）");setTimeout(()=>setToast(""),3000);return;}
    if(!window.confirm(`${label}から\n測点 ${r.addP}・写真 ${r.addPh}枚・入力値 ${r.addV}件 を足します。\n（今の入力は上書きしません）`))return;
    commitData(r.data,`${label}から 測点${r.addP}・写真${r.addPh}枚・入力値${r.addV}件 を戻しました`);
  };
  const rcRestoreTrash=(t)=>{
    const now=new Date().toISOString();const d=JSON.parse(JSON.stringify(stateRef.current));
    d.photoTrash=(d.photoTrash||[]).map(x=>trashKeyOf(x)===trashKeyOf(t)?{...x,restoredAt:now}:x);
    const r=placePhotos(d,[{kind:t.kind,point:t.point,step:t.step,item:t.item,phase:t.phase,position:t.position,data:t.data,id:t.id,time:t.time,note:t.note,raw:t.raw,exif:t.exif}]);
    commitData(r.data,`ゴミ箱から写真を戻しました（${whereLabel(t)}）`);
  };
  // ── ① 変更の記録（1件ずつ戻す）：この端末の箱＋倉庫（全端末ぶん）＋データベース（入っていれば） ──
  const rcLoadChanges=async()=>{const pid=currentProjId;if(!pid)return;setRc(r=>({...r,chgLoading:true,chgErr:null}));
    try{flushLog();await new Promise(res=>setTimeout(res,200));
      const local=(await jChgAll(pid)).map(r=>({...r,src:"device"}));
      const cloud=[];let cloudErr=false;
      try{const files=await sbListFolder(`${pid}/log`);const names=files.map(f=>f.name).sort().slice(-100);
        const got=await Promise.all(names.map(n=>sbGetJson(`${pid}/log/${n}`).catch(()=>null)));
        got.forEach(j=>{if(j&&Array.isArray(j.rows))j.rows.forEach(r=>{if(r&&r.key)cloud.push({...r,src:"storage",dev:r.dev||j.device||""});});});}catch(e){cloudErr=true;}
      const db=await sbFetchDbChanges(pid);
      const byKey=new Map();[...cloud,...local].forEach(r=>byKey.set(r.key,r));
      const all=[...byKey.values()];
      if(db.length){const sig=(r)=>`${r.area}|${r.pt||""}|${r.fld||""}|${r.kind}|${stab(r.old)}|${stab(r.new)}`;const have=new Map();all.forEach(r=>{const s=sig(r);if(!have.has(s))have.set(s,[]);have.get(s).push(Date.parse(r.at));});
        db.forEach(r=>{const ts=have.get(sig(r))||[];if(!ts.some(t=>Math.abs(t-Date.parse(r.at))<180000))all.push(r);});}
      setRc(r=>({...r,chgLoading:false,changes:all,chgCloudErr:cloudErr,chgN:60}));
    }catch(e){setRc(r=>({...r,chgLoading:false,chgErr:"記録を読めませんでした"}));}};
  const typeValLabel={DCIP:"DCIP(GX)",HPPE:"HPPE",SHIKIRI:"仕切弁筐",shidou:"市道",kendou:"県道",asphalt:"アスファルト",gravel:"砕石",public:"公共工事",simple:"簡易"};
  const fmtVal=(v,area)=>{if(v===null||v===undefined||v==="")return"（空）";if((area==="type"||area==="header")&&typeof v==="string"&&typeValLabel[v])return typeValLabel[v];
    if(typeof v==="string")return v.length>36?v.slice(0,36)+"…":v;if(typeof v==="number"||typeof v==="boolean")return String(v);
    if(Array.isArray(v))return`${v.length}件`;
    if(typeof v==="object"){if(v.name&&("measured" in v||"photos" in v))return`測点 ${v.name}`;if("data" in v||"id" in v)return"写真";const s=Object.entries(v).filter(([k,x])=>x!==""&&x!==null&&x!==undefined&&typeof x!=="object").map(([k,x])=>`${k}${x}`).join(" ");return s?(s.length>36?s.slice(0,36)+"…":s):"（空）";}
    return String(v);};
  const fName={H:"H（深さ）",B:"B（幅）",Ba:"Ba（舗装幅）",D:"D（埋設深）",D2:"D②",ta:"ta（舗装厚）",A:"A（弁芯距離）",Hs:"Hs（シート）",Dm:"Dm（マーカー）"};
  const hdrName={projectName:"工事名",location:"工事箇所",diameter:"口径",projectType:"工事の種類",workKind:"工種",pipe2:"2条目",originId:"元の工事"};
  const typeName={pipeType:"管種",roadType:"道路種別",surfaceType:"路面"};
  const measLabel=(k)=>{let m=String(k||"").match(/^(\d+)_(f_)?(.+)$/);if(m)return`${stepLabel(m[1])} ${m[2]?m[3]:(fName[m[3]]||m[3])}`;m=String(k||"").match(/^(p:.+?)_f_(.+)$/);if(m)return`${stepLabel(m[1])} ${m[2]}`;return String(k||"");};
  const designLabel=(k)=>{if(k==="B")return"床付幅B";if(k==="Ba")return"舗装幅Ba";if(k==="ta")return"舗装厚ta";const st=steps.find(s=>s.tKey===k);return st?`${k}（${st.name}）`:String(k);};
  const chgWhere=(r)=>{const pt=r.pt?`${r.pt}・`:"";switch(r.area){
    case"type":return typeName[r.fld]||r.fld;case"header":return hdrName[r.fld]||r.fld;case"design":return`設計値 ${designLabel(r.fld)}`;
    case"pt.measured":return pt+measLabel(r.fld);case"pt.dates":return`${pt}${stepLabel(r.fld)} の日付`;case"pt.date":return`${pt}測点の日付`;
    case"pt.photos":return`${pt}${stepLabel(r.fld)} の写真`;case"pt.other":return`${pt}${r.fld}`;
    case"point":return r.renameTo?`測点名 ${r.pt} → ${r.renameTo}`:`測点 ${r.pt}`;
    case"checkNotes":return`「${r.fld}」のメモ`;case"checkDims":return`「${r.fld}」の寸法`;case"checkPhotos":return`「${r.fld}」の写真`;
    case"albumPhotos":return"着手前及び完成の写真";case"checkItems":return"撮影項目の並び";case"albumPositions":return"写真台帳の位置";
    case"project":return"削除した工事を戻した";default:return r.fld||r.area;}};
  const isValueArea=(a)=>["type","header","design","checkNotes","checkDims","pt.measured","pt.dates","pt.date","pt.other","checkItems","albumPositions"].includes(a);
  const curValOf=(r)=>{const d=stateRef.current||{};const pt=r.pt?(d.points||[]).find(p=>p&&p.name===r.pt):null;switch(r.area){
    case"type":return d[r.fld];case"header":case"design":case"checkNotes":case"checkDims":return(d[r.area]||{})[r.fld];
    case"pt.measured":return pt?(pt.measured||{})[r.fld]:undefined;case"pt.dates":return pt?(pt.dates||{})[r.fld]:undefined;case"pt.date":return pt?pt.date:undefined;case"pt.other":return pt?pt[r.fld]:undefined;
    case"checkItems":case"albumPositions":return d[r.area];default:return undefined;}};
  const photoPresent=(r,ph)=>{if(!ph)return false;const d=stateRef.current||{};const has=(arr)=>(arr||[]).some(x=>x&&((ph.id&&x.id===ph.id)||(photoUrlOf(ph)&&photoUrlOf(x)===photoUrlOf(ph))));
    if(r.area==="pt.photos"){const pt=(d.points||[]).find(p=>p&&p.name===r.pt);return !!pt&&has((pt.photos||{})[r.fld]);}
    if(r.area==="checkPhotos")return has((d.checkPhotos||{})[r.fld]);if(r.area==="albumPhotos")return has(d.albumPhotos);return false;};
  // 記録を当てる：useNew=false なら「前の値に戻す」、true なら「この値にする」（別の端末の値を採りたい時）
  const rcApplyChange=async(r,useNew)=>{
    const say=(m)=>{setToast(m);setTimeout(()=>setToast(""),3000);};
    // 出来形の入力がある工事は、種別（管種・道路・路面）を記録からも変えない（数字・写真が別の工程にずれるため）
    if(r.area==="type"&&hasDekigataData((stateRef.current||{}).points)){say("出来形の入力があるので、管種・道路・路面は戻せません（数字や写真が別の工程にずれるため）");return;}
    const isPh=["pt.photos","checkPhotos","albumPhotos"].includes(r.area)&&r.kind==="del";
    // 写真の中身を先に探す（端末の控えを読む間に他の更新が入っても、その後の状態から写しを取るので消さない）
    let ph=null;
    if(isPh){ph=r.old&&typeof r.old==="object"?{...r.old}:null;if(!ph){say("戻せませんでした");return;}
      if(!photoUrlOf(ph)){const tr=((stateRef.current||{}).photoTrash||[]).find(x=>x&&ph.id&&x.id===ph.id&&typeof x.data==="string"&&!x.data.startsWith("("));
        if(tr)ph.data=tr.data;else{const all=await jAll(currentProjId);const e=all.find(x=>x.id===ph.id);if(e&&(e.url||e.data))ph.data=e.url||e.data;}}
      if(!ph.data||String(ph.data).startsWith("(")){say("写真の中身が見つかりませんでした");return;}}
    const target=useNew?r.new:r.old;const d=JSON.parse(JSON.stringify(stateRef.current||{}));
    const setKey=(obj,k,v)=>{if(v===null||v===undefined)delete obj[k];else obj[k]=v;};
    const findPt=(n)=>(d.points||[]).find(p=>p&&p.name===n);
    let msg="";
    if(isValueArea(r.area)){
      const curV=curValOf(r);
      if(!useNew&&!jsEq(curV,r.new)&&!window.confirm(`今の値（${fmtVal(curV,r.area)}）は、この記録のあとにも変わっています。\n「${fmtVal(r.old,r.area)}」に戻しますか？`))return;
      if(r.area==="type"){if(typeof target!=="string"){say("戻せませんでした");return;}d[r.fld]=target;}
      else if(["header","design","checkNotes","checkDims"].includes(r.area)){d[r.area]=d[r.area]||{};setKey(d[r.area],r.fld,target);}
      else if(r.area==="checkItems"||r.area==="albumPositions"){if(!Array.isArray(target)){say("戻せませんでした");return;}if(!window.confirm(`${chgWhere(r)}を、この時の内容（${target.length}件）にしますか？`))return;d[r.area]=target;}
      else{const p=findPt(r.pt);if(!p){say(`測点「${r.pt}」が今はありません`);return;}
        if(r.area==="pt.measured"){p.measured=p.measured||{};setKey(p.measured,r.fld,target);}
        else if(r.area==="pt.dates"){p.dates=p.dates||{};setKey(p.dates,r.fld,target);}
        else if(r.area==="pt.date"){p.date=target||"";}
        else setKey(p,r.fld,target);}
      msg=`${chgWhere(r)} を「${fmtVal(target,r.area)}」にしました`;
    }else if(isPh){
      if(photoPresent(r,ph)){say("その写真は今も入っています");return;}
      d.photoTrash=(d.photoTrash||[]).map(x=>(x&&((ph.id&&x.id===ph.id)||(photoUrlOf(x)&&photoUrlOf(x)===photoUrlOf(ph)))&&trashActive(x))?{...x,restoredAt:new Date().toISOString()}:x);
      const e=r.area==="pt.photos"?{kind:"pt",point:r.pt,step:r.fld}:r.area==="checkPhotos"?{kind:"ck",item:r.fld}:{kind:"al",phase:ph.phase,position:ph.position};
      const res=placePhotos(d,[{...e,data:ph.data,id:ph.id,time:ph.time,note:ph.note,raw:(typeof ph.raw==="string"&&/^https?:/.test(ph.raw))?ph.raw:undefined,exif:ph.exif}]);
      commitData(res.data,`写真を戻しました（${chgWhere(r)}）`);return;
    }else if(r.area==="point"&&r.kind==="del"){
      if(r.renameTo){const p=findPt(r.renameTo);if(!p||findPt(r.pt)){say("名前を戻せませんでした（今の測点名を確認してください）");return;}if(!window.confirm(`測点名「${r.renameTo}」を「${r.pt}」に戻しますか？`))return;p.name=r.pt;msg=`測点名を「${r.pt}」に戻しました`;}
      else{if(findPt(r.pt)){say("その測点は今もあります");return;}if(!r.old||typeof r.old!=="object"){say("戻せませんでした");return;}
        const p=JSON.parse(JSON.stringify(r.old));Object.keys(p.photos||{}).forEach(k=>{p.photos[k]=(p.photos[k]||[]).filter(x=>x&&photoUrlOf(x));});
        d.points=[...(d.points||[]),p];msg=`測点 ${r.pt} を戻しました`;}
    }else return;
    commitData(d,msg);};
  // ── ⑦ 削除した工事 ──
  const rcLoadDeleted=async()=>{setRc(r=>({...r,delLoading:true,delErr:null}));
    try{const res=await sbListDeleted();const active=new Set(projects.map(p=>p.id));const from=new Set(projects.map(p=>p.header&&p.header.originId).filter(Boolean));
      setRc(r=>({...r,delLoading:false,deleted:(res.rows||[]).filter(x=>x&&!active.has(x.id)&&!from.has(x.id)),delRpc:res.rpc}));}
    catch(e){setRc(r=>({...r,delLoading:false,delErr:"読めませんでした（電波を確認）"}));}};
  const rcRestoreDeleted=async(row)=>{
    if(!window.confirm(`削除した工事「${row.name||"(名称未設定)"}」を戻しますか？`))return;
    const say=(m)=>{setToast(m);setTimeout(()=>setToast(""),3500);};
    const r=await sbRestoreDeletedRpc(row.id);
    if(r&&r.ok){if(reconcileRef.current)await reconcileRef.current();setRc(x=>({...x,deleted:(x.deleted||[]).filter(y=>y.id!==row.id)}));say("戻しました（≡の一覧に出ます）");return;}
    // データベースに戻す仕組みが無い時：中身を写して「新しい工事」として戻す（写真は元の場所のまま使える）
    let data=row.data;
    if(!data){try{const res=await fetch(`${SB_URL}/rest/v1/dekigata_deleted?id=eq.${row.id}&select=data`,{headers:sbHeaders});const rows=await res.json();data=rows&&rows[0]&&rows[0].data;}catch(e){}}
    if(!data){say("中身を読めませんでした");return;}
    const nid=genUUID();const{_meta,...rest}=data;const d={...rest,header:{...(rest.header||{}),originId:row.id}};
    let ins=null;try{ins=await sbInsertProject(nid,row.name||(d.header&&d.header.projectName)||"",d);}catch(e){}
    if(!ins||!ins.ok){say("戻せませんでした（電波を確認）");return;}
    setProjects(prev=>{const next=[...prev,{id:nid,...d,updatedAt:ins.row.updated_at,localDirty:false}];writeLocalProjects(next);return next;});
    setRc(x=>({...x,deleted:(x.deleted||[]).filter(y=>y.id!==row.id)}));
    say("新しい工事として戻しました（≡の一覧から開けます）");};
  const rcJournal=async()=>{const all=await jAll(currentProjId);setRc(r=>({...r,journal:{total:all.length,pending:all.filter(e=>!e.syncedAt).length,raw:all.filter(e=>e.plain).length}}));};
  const rcExport=()=>{try{const d={app:"dekigata",v:APP_VERSION,exportedAt:new Date().toISOString(),device:deviceLabel(),id:currentProjId,data:forCloud(stateRef.current)};const blob=new Blob([JSON.stringify(d)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`出来形_${String(header.projectName||"工事").slice(0,24)}_${today()}.json`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);setToast("バックアップを保存しました");setTimeout(()=>setToast(""),2500);}catch(e){setToast("保存できませんでした");setTimeout(()=>setToast(""),2500);}};
  const importRef=useRef(null);
  const rcImportFile=(e)=>{const f=e.target.files&&e.target.files[0];if(!f)return;const rd=new FileReader();rd.onload=()=>{try{const j=JSON.parse(String(rd.result||""));const old=j&&j.app==="dekigata"&&j.data?j.data:null;if(!old)throw new Error("bad");
      const r=additiveRestore(stateRef.current,old);if(!r.addP&&!r.addPh&&!r.addV){setToast("このファイルから戻せる分はありませんでした");setTimeout(()=>setToast(""),3000);return;}
      if(!window.confirm(`バックアップ（${fmtJst(j.exportedAt)}）から\n測点 ${r.addP}・写真 ${r.addPh}枚・入力値 ${r.addV}件 を足します。\n（今の入力は上書きしません）`))return;
      commitData(r.data,`バックアップから 測点${r.addP}・写真${r.addPh}枚・入力値${r.addV}件 を戻しました`);}catch(err){setToast("出来形かんたんのバックアップファイルではありません");setTimeout(()=>setToast(""),3000);}};rd.readAsText(f);e.target.value="";};
  const renameDevice=()=>{const v=window.prompt("この端末の名前（履歴に残ります。例：現場iPad、洋一iPhone）",devLabel);if(v===null)return;const t=v.trim().slice(0,20);try{if(t)localStorage.setItem("dekigata_device_label",t);else localStorage.removeItem("dekigata_device_label");}catch(e){}setDevLabel(deviceLabel());};
  const reasonLabel={periodic:"定期",points_down:"測点が減る更新の前",photos_down:"写真が減る更新の前",guard:"🛡 測点の消去を防いだ"};
  const rcBox={background:"#fff",border:"1px solid #ddd",borderRadius:12,padding:12,marginBottom:12};
  const rcBtn={padding:"10px 14px",fontSize:14,fontWeight:700,borderRadius:10,border:"1.5px solid #1565C0",background:"#E3F2FD",color:"#1565C0",cursor:"pointer"};
  const rcSmall={...rcBtn,padding:"6px 10px",fontSize:13};
  const srcLabel={cloud:"クラウド",storage:"倉庫",device:"この端末",db:"クラウド"};
  const changeRows=useMemo(()=>(restoreOpen&&rc.changes)?buildChangeList(rc.changes,!!rc.chgAll):[],[restoreOpen,rc.changes,rc.chgAll]);
  const restoreCenter=restoreOpen?createPortal(
    <div style={{position:"fixed",inset:0,background:"#f4f6f8",zIndex:10001,overflowY:"auto",WebkitOverflowScrolling:"touch",fontFamily:'"Helvetica Neue","Hiragino Sans",sans-serif',WebkitTextSizeAdjust:"100%"}}>
      <div style={{maxWidth:560,margin:"0 auto",padding:"12px 12px 60px"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
          <h2 style={{fontSize:19,fontWeight:800,margin:0}}>🛟 復元センター</h2>
          <button onClick={()=>{setRestoreOpen(false);setRc({});}} style={{...rcBtn,background:"#fff",color:"#555",border:"1px solid #ccc"}}>閉じる</button></div>
        <div style={{fontSize:13,fontWeight:700,color:"#333",marginBottom:4}}>{header.projectName||"(名称未設定)"}</div>
        <div style={{fontSize:12,color:"#666",marginBottom:12,lineHeight:1.6}}>入力の書き換えは1件ずつ記録しています。写真ファイルは倉庫から消えず、黒板を入れる前の元写真も残します。消した写真はゴミ箱へ。どの戻し方も、今の入力を勝手に上書きしません。</div>
        {rescueInfo&&<div style={{...rcBox,background:"#E8F5E9",border:"2px solid #2E7D32",color:"#1B5E20",fontWeight:700,fontSize:14}}>✅ {rescueInfo}</div>}

        <div style={rcBox}><div style={{fontSize:15,fontWeight:800,marginBottom:6}}>① 変更の記録（1件ずつ戻す）</div>
          <div style={{fontSize:12,color:"#666",marginBottom:8}}>数字・設定・写真の書き換えと削除を、全部の端末ぶん新しい順に出します。間違えて書き換えた値や消した写真を、1件ずつ元に戻せます。</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
            <button style={rcBtn} disabled={rc.chgLoading} onClick={rcLoadChanges}>{rc.chgLoading?"読み込み中…":rc.changes?"更新":"変更の記録を見る"}</button>
            {rc.changes&&<label style={{fontSize:12,color:"#555",display:"flex",alignItems:"center",gap:4}}><input type="checkbox" checked={!!rc.chgAll} onChange={e=>{const on=e.target.checked;setRc(r=>({...r,chgAll:on}));}}/>追加したものも出す</label>}</div>
          {rc.chgErr&&<div style={{color:"#C62828",fontSize:13,marginTop:6}}>{rc.chgErr}</div>}
          {rc.chgCloudErr&&<div style={{color:"#E65100",fontSize:12,marginTop:6}}>倉庫の記録を読めませんでした（この端末の記録だけ出しています）</div>}
          {rc.changes&&changeRows.length===0&&<div style={{fontSize:13,color:"#888",marginTop:8}}>{rc.chgAll?"まだ記録はありません":"書き換え・削除の記録はありません（「追加したものも出す」で全部見られます）"}</div>}
          {changeRows.slice(0,rc.chgN||60).map(r=>{const val=isValueArea(r.area);const ph=["pt.photos","checkPhotos","albumPhotos"].includes(r.area);const cv=val?curValOf(r):undefined;
            const atOld=val&&jsEq(cv,r.old);const atNew=val&&jsEq(cv,r.new);
            const thumb=ph?(photoUrlOf(r.old)||photoUrlOf(r.new)):null;
            return(<div key={r.keys.join(",")} style={{padding:"8px 0",borderBottom:"1px solid #eee"}}>
              <div style={{fontSize:12,color:"#777"}}>{fmtJst(r.atLast||r.at)}・{r.dev||"端末不明"}{r.via&&r.via!=="edit"?`（${{restore:"復元",guard:"自動ガード",rescue:"自動救出",journal:"控えから"}[r.via]||r.via}）`:""}{r.src?`・${srcLabel[r.src]||""}`:""}</div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                {thumb&&<img src={thumb} onClick={()=>setViewPhoto(thumb)} style={{width:56,height:42,objectFit:"cover",borderRadius:6,background:"#ddd"}}/>}
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:14,fontWeight:700}}>{chgWhere(r)}</div>
                  {val&&<div style={{fontSize:13}}><span style={{color:"#C62828"}}>{fmtVal(r.old,r.area)}</span> → <span style={{color:"#1565C0"}}>{fmtVal(r.new,r.area)}</span>{!atNew&&!atOld?<span style={{fontSize:11,color:"#888"}}>（今は {fmtVal(cv,r.area)}）</span>:null}</div>}
                  {!val&&<div style={{fontSize:13,color:r.kind==="del"?"#C62828":"#2E7D32"}}>{r.renameTo?"測点名の変更":r.kind==="del"?"消えた":r.kind==="add"?"追加":"変更"}</div>}
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:4,flexShrink:0}}>
                  {val&&!atOld&&<button style={rcSmall} onClick={()=>rcApplyChange(r,false)}>前の値に戻す</button>}
                  {val&&atOld&&!atNew&&r.new!==null&&r.new!==undefined&&r.new!==""&&<button style={rcSmall} onClick={()=>rcApplyChange(r,true)}>この値にする</button>}
                  {ph&&r.kind==="del"&&<button style={rcSmall} onClick={()=>rcApplyChange(r,false)}>写真を戻す</button>}
                  {r.area==="point"&&r.kind==="del"&&<button style={rcSmall} onClick={()=>rcApplyChange(r,false)}>{r.renameTo?"名前を戻す":"測点を戻す"}</button>}
                </div></div></div>);})}
          {changeRows.length>(rc.chgN||60)&&<button style={{...rcBtn,width:"100%",marginTop:8,background:"#fff"}} onClick={()=>setRc(r=>({...r,chgN:(r.chgN||60)+60}))}>もっと見る（あと{changeRows.length-(rc.chgN||60)}件）</button>}
        </div>

        <div style={rcBox}><div style={{fontSize:15,fontWeight:800,marginBottom:6}}>② 過去の版（まるごとの控え）</div>
          <div style={{fontSize:12,color:"#666",marginBottom:8}}>クラウドの履歴（10分おき・消える前は必ず）と、倉庫・この端末に残した控えです。選んだ版から、今足りない測点・写真・入力値だけを足します。</div>
          <button style={rcBtn} disabled={rc.histLoading} onClick={rcLoadHistory}>{rc.histLoading?"読み込み中…":rc.history?"更新":"履歴を見る"}</button>
          {rc.histErr&&<div style={{color:"#C62828",fontSize:13,marginTop:6}}>{rc.histErr}</div>}
          {rc.history&&rc.history.length===0&&<div style={{fontSize:13,color:"#888",marginTop:8}}>まだ履歴はありません（保存のたびに残っていきます）</div>}
          {(rc.history||[]).slice(0,rc.histN||40).map(v=>(<div key={v.key} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 0",borderBottom:"1px solid #eee"}}>
            <div style={{flex:1,minWidth:0}}>
              {v.src==="cloud"?(<><div style={{fontSize:14,fontWeight:700}}>{fmtJst(v.at)} <span style={{fontSize:12,fontWeight:600,color:v.h.reason==="guard"?"#C62828":"#666"}}>{reasonLabel[v.h.reason]||v.h.reason}</span></div>
                <div style={{fontSize:12,color:"#666"}}>クラウド・測点{v.h.n_points}・写真{v.h.n_photos}枚{v.h.new_n_points!==null&&v.h.new_n_points!==undefined?` → 上書き後 測点${v.h.new_n_points}・写真${v.h.new_n_photos}枚`:""}{v.h.by_device?`（${v.h.by_device}）`:v.h.by_ua?`（${uaKind(v.h.by_ua)}）`:""}</div></>)
              :(<><div style={{fontSize:14,fontWeight:700}}>{fmtJst(v.at)} <span style={{fontSize:12,fontWeight:600,color:"#666"}}>{v.src==="storage"?"倉庫の控え":"この端末の控え"}</span></div>
                <div style={{fontSize:12,color:"#666"}}>{v.np!==undefined?`測点${v.np}・写真${v.nph}枚`:""}{v.dev?`（${v.dev}）`:""}</div></>)}
            </div>
            <button style={{...rcBtn,padding:"8px 10px",fontSize:13}} onClick={()=>rcRestoreVersion(v)}>足りない分を戻す</button></div>))}
          {(rc.history||[]).length>(rc.histN||40)&&<button style={{...rcBtn,width:"100%",marginTop:8,background:"#fff"}} onClick={()=>setRc(r=>({...r,histN:(r.histN||40)+40}))}>もっと見る</button>}
        </div>

        <div style={rcBox}><div style={{fontSize:15,fontWeight:800,marginBottom:6}}>③ 倉庫の写真と照合</div>
          <div style={{fontSize:12,color:"#666",marginBottom:8}}>倉庫にあるのに、この工事に入っていない写真を探して元の測点・工程に戻します。</div>
          <button style={rcBtn} disabled={rc.scanLoading} onClick={rcScanStorage}>{rc.scanLoading?"調べています…":rc.scanned?"もう一度調べる":"調べる"}</button>
          {rc.scanErr&&<div style={{color:"#C62828",fontSize:13,marginTop:6}}>{rc.scanErr}</div>}
          {rc.scanned&&<div style={{marginTop:10}}>
            <div style={{fontSize:13,fontWeight:700}}>倉庫の写真 {rc.total}枚 のうち、入っていない写真 {(rc.orphans||[]).length}枚</div>
            {(rc.orphans||[]).some(o=>!(rc.sel&&rc.sel[o.url]))&&<div style={{fontSize:12,color:"#888"}}>今その場所に写真がある分と、同じ場所の古い写真（テスト撮影など）は、チェックを外してあります</div>}
            {(rc.dups||[]).length>0&&<div style={{fontSize:12,color:"#888"}}>同じ写真の二重送信 {(rc.dups||[]).length}枚 は取り込みません</div>}
            {(rc.unknown||[]).length>0&&<div style={{fontSize:12,color:"#888"}}>場所が分からない写真 {(rc.unknown||[]).length}枚（今の工程にない）</div>}
            {(rc.orphans||[]).map(o=>(<label key={o.url} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid #eee",cursor:"pointer"}}>
              <input type="checkbox" checked={!!(rc.sel&&rc.sel[o.url])} onChange={e=>{const on=e.target.checked;setRc(r=>({...r,sel:{...(r.sel||{}),[o.url]:on}}));}} style={{width:22,height:22}}/>
              <img src={o.url} onClick={(ev)=>{ev.preventDefault();setViewPhoto(o.url);}} style={{width:64,height:48,objectFit:"cover",borderRadius:6,background:"#ddd"}}/>
              <div style={{flex:1,minWidth:0}}><div style={{fontSize:14,fontWeight:700}}>{whereLabel(o.p)}</div><div style={{fontSize:12,color:"#666"}}>{fmtJst(o.p.ts)} 撮影分</div></div></label>))}
            {(rc.orphans||[]).length>0&&<button style={{...rcBtn,width:"100%",marginTop:10,background:"#1565C0",color:"#fff"}} onClick={rcImportOrphans}>チェックした {(rc.orphans||[]).filter(o=>rc.sel&&rc.sel[o.url]).length}枚 を取り込む</button>}
          </div>}
        </div>

        <div style={rcBox}><div style={{fontSize:15,fontWeight:800,marginBottom:6}}>④ ゴミ箱（消した写真）</div>
          {(()=>{const list=(photoTrash||[]).filter(trashActive).slice().sort((a,b)=>String(b.deletedAt).localeCompare(String(a.deletedAt)));
            if(!list.length)return(<div style={{fontSize:13,color:"#888"}}>ゴミ箱は空です</div>);
            return list.map(t=>(<div key={trashKeyOf(t)} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid #eee"}}>
              <img src={t.data} onClick={()=>setViewPhoto(t.data)} style={{width:64,height:48,objectFit:"cover",borderRadius:6,background:"#ddd"}}/>
              <div style={{flex:1,minWidth:0}}><div style={{fontSize:14,fontWeight:700}}>{whereLabel(t)}</div><div style={{fontSize:12,color:"#666"}}>{fmtJst(t.deletedAt)} に削除{t.by?`（${t.by}）`:""}</div></div>
              <button style={{...rcBtn,padding:"8px 12px"}} onClick={()=>rcRestoreTrash(t)}>戻す</button></div>));})()}
        </div>

        <div style={rcBox}><div style={{fontSize:15,fontWeight:800,marginBottom:6}}>⑤ この端末の控え</div>
          <div style={{fontSize:12,color:"#666",marginBottom:8}}>この端末で撮った写真（黒板入り・元写真）は、クラウドに届いたと確認できるまで端末にも別に保存しています。開くたびに自動で照合します。</div>
          <button style={rcBtn} onClick={async()=>{await rcJournal();if(hydrateRef.current)await hydrateRef.current(currentProjId);await rcJournal();}}>今すぐ照合</button>
          {rc.journal&&<div style={{fontSize:13,marginTop:8}}>控え {rc.journal.total}件（クラウド未確認 {rc.journal.pending}件{rc.journal.raw?`・元写真の送信待ち ${rc.journal.raw}件`:""}）</div>}
        </div>

        <div style={rcBox}><div style={{fontSize:15,fontWeight:800,marginBottom:6}}>⑥ バックアップ</div>
          <div style={{fontSize:12,color:"#666",marginBottom:8}}>工事のデータ（写真の場所・入力値）をファイルに保存。写真そのものは倉庫にあります。</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            <button style={rcBtn} onClick={rcExport}>ファイルに保存</button>
            <button style={rcBtn} onClick={()=>importRef.current&&importRef.current.click()}>ファイルから戻す</button>
            <input ref={importRef} type="file" accept="application/json,.json" style={{display:"none"}} onChange={rcImportFile}/></div>
        </div>

        <div style={rcBox}><div style={{fontSize:15,fontWeight:800,marginBottom:6}}>⑦ 削除した工事</div>
          <div style={{fontSize:12,color:"#666",marginBottom:8}}>≡ の一覧で削除した工事も、中身ごと残っています。ここから戻せます。</div>
          <button style={rcBtn} disabled={rc.delLoading} onClick={rcLoadDeleted}>{rc.delLoading?"読み込み中…":rc.deleted?"更新":"削除した工事を見る"}</button>
          {rc.delErr&&<div style={{color:"#C62828",fontSize:13,marginTop:6}}>{rc.delErr}</div>}
          {rc.deleted&&rc.deleted.length===0&&<div style={{fontSize:13,color:"#888",marginTop:8}}>削除した工事はありません</div>}
          {(rc.deleted||[]).map(x=>(<div key={x.id} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 0",borderBottom:"1px solid #eee"}}>
            <div style={{flex:1,minWidth:0}}><div style={{fontSize:14,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{x.name||"(名称未設定)"}</div>
              <div style={{fontSize:12,color:"#666"}}>{x.deleted_at?`${fmtJst(x.deleted_at)} に削除・`:""}測点{x.n_points}・写真{x.n_photos}枚</div></div>
            <button style={{...rcBtn,padding:"8px 10px",fontSize:13}} onClick={()=>rcRestoreDeleted(x)}>この工事を戻す</button></div>))}
        </div>
        <div style={{fontSize:12,color:"#888",textAlign:"center"}}>この端末の名前：{devLabel}　<button onClick={renameDevice} style={{...S.sm,fontSize:12}}>変更</button></div>
      </div>
      {viewPhoto&&(<div onClick={()=>setViewPhoto(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:10002,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}><img src={viewPhoto} style={{maxWidth:"100%",maxHeight:"90vh",borderRadius:12}}/></div>)}
      {toast&&<div style={{...S.to,zIndex:10003}}>{toast}</div>}
    </div>,document.body):null;
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
      if(f.t==="sum"){const sm=sumField(f,get);return(<div key={f.k} style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:12,fontWeight:700,minWidth:44}}>{f.k}</span>
        <span style={{width:96,textAlign:"right",fontSize:17,fontWeight:800,color:sm!==null?"#1565C0":"#bbb",padding:"7px 8px"}}>{sm!==null?sm:"—"}</span><span style={{fontSize:11,color:"#888"}}>{f.u||""}（自動）</span></div>);}
      if(f.t==="num")return(<div key={f.k} style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:12,fontWeight:700,minWidth:44}}>{f.k}</span>
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
  // 保存: 写真をいったん端末内データで反映 → 自動同期が倉庫(Storage)へ送ってURLに置き換える
  const applyShot=(t,data,extra)=>{
    const ex=extra||{};
    // 撮影情報（日時など）は写真の記録に付ける。元写真（黒板なし）は端末の控えに置き、同期の時に倉庫の raw/ へ送る
    const rec={id:genUUID(),data,time:nowTime(),...(ex.exif?{exif:ex.exif}:{})};
    if(ex.plain)rec.raw="idb:"+rec.id;
    // 端末の控えにも同時に保存（クラウドに届いたと確認できるまで消さない）
    const jb={id:rec.id,projectId:currentProjId,time:rec.time,date:today(),data,url:null,plain:ex.plain||null,rawUrl:null,exif:ex.exif||null,createdAt:Date.now(),syncedAt:null,device:deviceLabel()};
    journalPendingRef.current.add(rec.id);
    // 端末の保存がいっぱいの時は、控えへの保存が終わってから端末保存をやり直す（写真は控え参照に置き換わる）
    const afterJ=(ok)=>{if(ok&&localWriteFull)setTimeout(()=>{mirrorLocal(currentProjIdRef.current,stateRef.current,null,true);},50);};
    if(t.kind==="check"){jPut({...jb,kind:"ck",item:t.checkTarget,note:t.note||""}).then(afterJ);setCheckPhotos(p=>({...p,[t.checkTarget]:[...(p[t.checkTarget]||[]),{...rec,note:t.note}]}));}
    else if(t.kind==="album"){jPut({...jb,kind:"al",phase:t.album.phase,position:t.album.position}).then(afterJ);setAlbumPhotos(p=>[...p,{...rec,phase:t.album.phase,position:t.album.position}]);}
    else{const sid=t.photoStep;jPut({...jb,kind:"pt",point:cur.name,step:String(sid)}).then(afterJ);setCur(p=>{const ph={...(p.photos||{})};ph[sid]=[...(ph[sid]||[]),rec];const ds={...(p.dates||{})};if(!ds[sid])ds[sid]=today();return{...p,photos:ph,dates:ds,date:p.date||today()};});}
  };
  // 写真を消す＝ゴミ箱へ（あとで戻せる。削除は全端末に伝わる）
  const trashOf=(ph,ctx)=>({...ph,...ctx,deletedAt:new Date().toISOString(),restoredAt:null,by:deviceLabel()});
  const toTrash=(entries)=>{if(!entries.length)return;setPhotoTrash(t=>unionTrash(t,entries));setToast(entries.length>1?`${entries.length}枚をゴミ箱へ（🛟から戻せます）`:"ゴミ箱へ移しました（🛟から戻せます）");setTimeout(()=>setToast(""),2500);};
  useEffect(()=>{if(!pendingShot)return;const o=document.body.style.overflow;document.body.style.overflow="hidden";return()=>{document.body.style.overflow=o;};},[!!pendingShot]);
  const saveShot=()=>{const ps=pendingShot;if(!ps||!ps.data)return;applyShot(ps.tgt,ps.data,{plain:ps.plain,exif:ps.exif});setPendingShot(null);setToast("保存しました");setTimeout(()=>setToast(""),1800);};
  const retakeShot=()=>{setPendingShot(null);if(fileRef.current){fileRef.current.value="";fileRef.current.click();}};
  const cancelShot=()=>{setPendingShot(null);};
  // 確認画面: 端末と向きでレイアウト切替（iPhone縦=写真+黒板拡大／iPhone横=左右／タブレット=写真1枚）
  const shotPreview=(()=>{
    if(!pendingShot)return null;
    const isTablet=Math.min(vp.w,vp.h)>=600;const isLand=vp.w>vp.h;
    const mode=isTablet?"tablet":(isLand?"phoneLand":"phonePort");
    const ov={position:"fixed",inset:0,background:"#111",zIndex:10000,display:"flex",WebkitTextSizeAdjust:"100%",fontFamily:'"Helvetica Neue","Hiragino Sans",sans-serif'};
    const title=pendingShot.loading?"黒板を合成中…":`確認：${pendingShot.label||""}`;
    const btnRow=(compact)=>(<div style={{display:"flex",gap:compact?8:10}}>
      <button onClick={retakeShot} style={{flex:1,padding:compact?"11px 6px":"15px",fontSize:compact?15:17,fontWeight:700,borderRadius:12,border:"2px solid #fff",background:"transparent",color:"#fff",cursor:"pointer"}}>↺ 撮り直す</button>
      <button onClick={saveShot} style={{flex:1.4,padding:compact?"11px 6px":"15px",fontSize:compact?16:18,fontWeight:800,borderRadius:12,border:"none",background:"#2E7D32",color:"#fff",cursor:"pointer"}}>✓ 保存する</button></div>);
    const cancelBtn=(compact)=>(<button onClick={cancelShot} style={{width:"100%",marginTop:compact?4:6,padding:compact?"6px":"8px",fontSize:compact?12:14,borderRadius:10,border:"none",background:"transparent",color:"#aaa",cursor:"pointer"}}>やめる（保存しない）</button>);
    const fitImg=(src,extra)=>(<img src={src} style={{maxWidth:"100%",maxHeight:"100%",objectFit:"contain",display:"block",borderRadius:6,...(extra||{})}}/>);
    const zoomPane=(<div style={{width:"100%",height:"100%",overflow:"auto",WebkitOverflowScrolling:"touch"}} onClick={()=>setPreviewZoom(false)}><img src={pendingShot.data} style={{width:"250%",maxWidth:"none",display:"block"}}/></div>);
    let body;
    if(pendingShot.loading){
      body=(<div style={{...ov,flexDirection:"column",alignItems:"center",justifyContent:"center",color:"#ccc",fontSize:15}}>{title}<div style={{fontSize:12,color:"#888",marginTop:6}}>少々お待ちください</div></div>);
    }else if(mode==="tablet"){
      // タブレット: 写真1枚を画面いっぱい（スクロールなし）
      body=(<div style={{...ov,flexDirection:"column"}}>
        <div style={{color:"#fff",fontSize:17,fontWeight:700,textAlign:"center",padding:"12px 10px 8px",flexShrink:0}}>{title}</div>
        <div style={{flex:1,minHeight:0,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 12px"}} onClick={()=>{if(!previewZoom)setPreviewZoom(true);}}>
          {previewZoom?zoomPane:fitImg(pendingShot.data)}
        </div>
        <div style={{flexShrink:0,padding:"10px 16px calc(12px + env(safe-area-inset-bottom,0px))",maxWidth:720,width:"100%",margin:"0 auto",boxSizing:"border-box"}}>
          <div style={{color:"#ccc",fontSize:13,textAlign:"center",paddingBottom:8}}>黒板の工程・数値・日付を確認して保存{previewZoom?"（タップで元に戻す）":"（写真タップで拡大）"}</div>
          {btnRow(false)}{cancelBtn(false)}
        </div>
      </div>);
    }else if(mode==="phoneLand"){
      // iPhone横: 左=写真全体／右=黒板拡大＋ボタン（スクロールなし）
      body=(<div style={{...ov,flexDirection:"row"}}>
        <div style={{flex:"1 1 58%",minWidth:0,display:"flex",alignItems:"center",justifyContent:"center",padding:"6px 6px 6px calc(6px + env(safe-area-inset-left,0px))"}} onClick={()=>{if(!previewZoom)setPreviewZoom(true);}}>
          {previewZoom?zoomPane:fitImg(pendingShot.data)}
        </div>
        <div style={{flex:"0 0 42%",minWidth:0,display:"flex",flexDirection:"column",padding:"6px calc(8px + env(safe-area-inset-right,0px)) calc(4px + env(safe-area-inset-bottom,0px)) 4px",boxSizing:"border-box"}}>
          <div style={{color:"#fff",fontSize:13,fontWeight:700,padding:"2px 0 4px",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",flexShrink:0}}>{title}</div>
          <div style={{flex:1,minHeight:0,display:"flex",alignItems:"center",justifyContent:"center",paddingBottom:6}}>
            {pendingShot.boardData?fitImg(pendingShot.boardData,{border:"2px solid #f5f5dc"}):fitImg(pendingShot.data)}
          </div>
          <div style={{flexShrink:0}}>{btnRow(true)}{cancelBtn(true)}</div>
        </div>
      </div>);
    }else{
      // iPhone縦: 写真全体＋黒板拡大（スクロール）
      body=(<div style={{...ov,flexDirection:"column"}}>
        <div style={{color:"#fff",fontSize:15,fontWeight:700,textAlign:"center",padding:"10px 8px 6px",flexShrink:0}}>{title}</div>
        <div style={{flex:1,minHeight:0,overflow:"auto",WebkitOverflowScrolling:"touch",padding:"0 6px"}}>
          <div onClick={()=>setPreviewZoom(z=>!z)} style={{overflow:"auto",WebkitOverflowScrolling:"touch",borderRadius:6}}>
            <img src={pendingShot.data} style={{width:previewZoom?"260%":"100%",maxWidth:"none",display:"block"}}/>
          </div>
          <div style={{color:"#9e9e9e",fontSize:11,textAlign:"right",padding:"3px 2px 8px"}}>{previewZoom?"タップで元に戻す":"写真をタップで拡大"}</div>
          {pendingShot.boardData&&(<>
            <div style={{color:"#f5f5dc",fontSize:13,fontWeight:700,padding:"2px 2px 6px"}}>▼ 黒板（拡大）</div>
            <img src={pendingShot.boardData} style={{width:"100%",display:"block",borderRadius:6,border:"2px solid #f5f5dc"}}/>
          </>)}
          <div style={{height:8}}/>
        </div>
        <div style={{flexShrink:0,padding:"8px 10px calc(10px + env(safe-area-inset-bottom,0px))",borderTop:"1px solid #333"}}>
          <div style={{color:"#ccc",fontSize:12,textAlign:"center",paddingBottom:8}}>黒板の工程・数値・日付を確認して保存</div>
          {btnRow(false)}{cancelBtn(false)}
        </div>
      </div>);
    }
    return createPortal(body,document.body);
  })();
  const takePhoto=(stepId)=>{setAlbumTarget(null);setCheckTarget(null);setPhotoStep(stepId);if(fileRef.current){fileRef.current.value="";fileRef.current.click();}};
  const takeAlbumPhoto=(phase,position)=>{setPhotoStep(null);setCheckTarget(null);setAlbumTarget({phase,position});if(fileRef.current){fileRef.current.value="";fileRef.current.click();}};
  const takeCheckPhoto=(item)=>{setPhotoStep(null);setAlbumTarget(null);setCheckTarget(item);if(fileRef.current){fileRef.current.value="";fileRef.current.click();}};
  const onPhotoTaken=(e)=>{
    const file=e.target.files?.[0];if(!file||(photoStep===null&&!albumTarget&&!checkTarget))return;
    setPendingShot({loading:true});
    // 撮影情報（EXIF：撮影日時・機種・位置）を読む。読めなくても撮影は続ける
    const shotAt=new Date().toISOString();
    const exifP=(async()=>{try{const b=await file.slice(0,262144).arrayBuffer();return readExif(b);}catch(err){return null;}})();
    const reader=new FileReader();
    reader.onload=(ev)=>{
      const img=new Image();
      img.onload=async()=>{
        const canvas=document.createElement("canvas");
        const MAXPX=1600;const sc=Math.min(1,MAXPX/Math.max(img.width,img.height));
        canvas.width=Math.round(img.width*sc);canvas.height=Math.round(img.height*sc);
        const ctx=canvas.getContext("2d");
        ctx.drawImage(img,0,0,canvas.width,canvas.height);
        // 黒板を入れる前の元写真（同じ大きさ）を残す。埋め戻した後に測点名の間違いに気づいても、元写真から作り直せる
        let plain=null;try{plain=canvas.toDataURL("image/jpeg",0.82);}catch(err){plain=null;}
        let exif=null;try{exif=await exifP;}catch(err){exif=null;}
        exif={...(exif||{}),shotAt,...(file.lastModified?{fileTime:new Date(file.lastModified).toISOString()}:{}),w:img.width,h:img.height,...(file.size?{bytes:file.size}:{})};
        const cw=canvas.width,chh=canvas.height;
        // 黒板（左下）。内容量に合わせて高さ可変、工事名などは2行まで折り返し
        const FF=`"Hiragino Sans","MS Gothic",sans-serif`;
        const u=Math.min(cw,chh);
        const bbW=Math.round(Math.min(cw*0.45,Math.max(cw*0.32,u*0.43)));
        const bbX=Math.round(cw*0.02);
        const pad=Math.round(bbW*0.04);
        const minBbH=Math.round(u*0.30),maxBbH=Math.round(chh*0.5);
        const fitLayout=(mk)=>{let k=1,L=mk(k);for(let it=0;it<6&&L.h>maxBbH;it++){k*=Math.max(0.6,(maxBbH/L.h)*0.98);L=mk(k);}return L;};
        // 表組み（蔵衛門型）: 工事件名/分類/工種/場所 ＋ 中央の大きい文字
        const tableLayout=(k,rowsDef,center)=>{
          const rowH=Math.round(u*0.039*k),labelW=Math.round(bbW*0.24);
          const fsL=Math.round(u*0.0165*k),fsV=Math.round(u*0.018*k);
          const valX=bbX+3+labelW+Math.round(pad*0.6);const maxW=bbX+bbW-3-Math.round(pad*0.6)-valX;
          ctx.font=`bold ${fsV}px ${FF}`;
          const rows=rowsDef.map(([lab,v])=>{const vl=breakLines(ctx,v,maxW,2);return{lab,vl,h:vl.length>1?Math.round(rowH*1.65):rowH};});
          const rowsH=rows.reduce((acc,r)=>acc+r.h,0);
          const c=center(k);
          return{h:3+rowsH+c.h,draw:(top,H)=>{
            ctx.strokeStyle="#f5f5dc";ctx.lineWidth=Math.max(1.5,bbW*0.004);
            let ry=top+3;
            rows.forEach(r=>{
              ctx.strokeRect(bbX+3,ry,labelW,r.h);ctx.strokeRect(bbX+3+labelW,ry,bbW-6-labelW,r.h);
              ctx.font=`bold ${fsL}px ${FF}`;ctx.fillText(r.lab,bbX+3+Math.round(labelW*0.08),ry+r.h/2+fsL*0.36);
              if(r.vl.length>1){const f2=Math.round(fsV*0.92);ctx.font=`bold ${f2}px ${FF}`;const gap=f2*1.15;const y0=ry+r.h/2-gap/2+f2*0.36;r.vl.forEach((ln,i)=>ctx.fillText(ln,valX,y0+gap*i));}
              else{ctx.font=`bold ${fsV}px ${FF}`;ctx.fillText(r.vl[0]||"",valX,ry+r.h/2+fsV*0.36);}
              ry+=r.h;
            });
            c.draw(ry,top+H);
          }};
        };
        const checkCenter=(k)=>{
          let bigFs=Math.round(u*0.039*k);
          ctx.font=`bold ${bigFs}px ${FF}`;
          while(bigFs>10&&ctx.measureText(checkTarget).width>bbW-pad*2){bigFs-=2;ctx.font=`bold ${bigFs}px ${FF}`;}
          const note=composeNote(checkTarget);
          const nfs=Math.round(u*0.0255*k),dfs=Math.round(u*0.0195*k);
          ctx.font=`bold ${nfs}px ${FF}`;
          const noteLines=note?wrapCanvas(ctx,note,bbW-pad*2,2):[];
          const contentH=bigFs*1.25+noteLines.length*nfs*1.3+dfs*1.6;
          return{h:pad*2+contentH,draw:(y0,y1)=>{
            let y=y0+Math.max(pad,((y1-y0)-contentH)/2);
            ctx.textAlign="center";
            ctx.font=`bold ${bigFs}px ${FF}`;y+=bigFs;ctx.fillText(checkTarget,bbX+bbW/2,y);y+=bigFs*0.25;
            ctx.font=`bold ${nfs}px ${FF}`;noteLines.forEach(ln=>{y+=nfs*1.3;ctx.fillText(ln,bbX+bbW/2,y-nfs*0.3);});
            ctx.font=`bold ${dfs}px ${FF}`;y+=dfs*1.4;ctx.fillText(today(),bbX+bbW/2,y);
            ctx.textAlign="left";
          }};
        };
        const albumCenter=(k)=>{
          const bigFs=Math.round(u*0.0405*k);const contentH=bigFs*2.5;
          return{h:pad*2+contentH,draw:(y0,y1)=>{
            const phaseLabel=albumTarget.phase==="pre"?"着手前":"完成";
            const y=y0+Math.max(pad,((y1-y0)-contentH)/2);
            ctx.textAlign="center";ctx.font=`bold ${bigFs}px ${FF}`;
            ctx.fillText(phaseLabel,bbX+bbW/2,y+bigFs);
            ctx.fillText(String(albumTarget.position||""),bbX+bbW/2,y+bigFs*2.25);
            ctx.textAlign="left";
          }};
        };
        // 工程用（項目: 値）
        const kvLayout=(k,lines)=>{
          const labelFs=Math.round(u*0.0195*k),valueFs=Math.round(u*0.0235*k),lineH=Math.round(u*0.03*k);
          const labelW=Math.round(bbW*0.22);
          const valX=bbX+pad+labelW;const maxW=bbX+bbW-pad-valX;
          ctx.font=`bold ${valueFs}px ${FF}`;
          const rows=lines.map(([kk,v])=>({k:kk,vl:breakLines(ctx,String(v),maxW,(kk==="工事名"||kk==="工程"||kk==="管種")?2:1)}));
          const n=rows.reduce((acc,r)=>acc+r.vl.length,0);
          return{h:pad*2+n*lineH,draw:(top)=>{
            let ty=top+pad+Math.round(lineH*0.78);
            rows.forEach(r=>{
              ctx.font=`bold ${labelFs}px ${FF}`;ctx.fillText(r.k,bbX+pad,ty);
              ctx.font=`bold ${valueFs}px ${FF}`;
              r.vl.forEach((ln,i)=>{ctx.fillText(ln,valX,ty);ty+=(i<r.vl.length-1)?Math.round(lineH*0.88):lineH;});
            });
          }};
        };
        let L;
        if(checkTarget){
          const rowsDef=[["工事件名",header.projectName||""],["分　類","工事写真"],["工　種",`${header.workKind||""}${header.diameter?` φ${header.diameter}`:""}`.trim()],["場　所",header.location||""]];
          L=fitLayout(k=>tableLayout(k,rowsDef,checkCenter));
        }else if(albumTarget){
          const rowsDef=[["工事件名",header.projectName||""],["分　類","着手前及び完成"],["工　種",""],["場　所",header.location||""]];
          L=fitLayout(k=>tableLayout(k,rowsDef,albumCenter));
        }else{
          const step=mergedSteps.find(s=>s.id===photoStep)||steps.find(s=>s.id===photoStep);
          const lines=[];
          if(header.projectName)lines.push(["工事名",header.projectName]);
          lines.push(["分類",step.photoOnly?"施工状況":"出来形管理・施工状況"]);
          lines.push(["測点",cur.name||""]);
          lines.push(["工程",step.photoOnly?step.name:`${step.id}.${step.name}`]);
          if(step.photoOnly){const spec=photoSpec(step.name);if(spec)fieldPairs(spec,(k)=>cur.measured[`${step.id}_f_${k}`],autoFieldVal).forEach(([k,v])=>lines.push([k,v]));}
          lines.push(["管種",pipeText(pipeType,dia,pipe2)]);
          if(!step.photoOnly){
            const hVal=designHFor(steps.find(x=>x.id===step.id)||step,steps,design,H0,D,cur.measured,surfaceType);
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
          L=fitLayout(k=>kvLayout(k,lines));
        }
        const bbH=Math.max(minBbH,Math.min(maxBbH,Math.round(L.h)));
        const bbY=chh-bbH-Math.round(chh*0.02);
        ctx.fillStyle="#0a4d2e";ctx.fillRect(bbX,bbY,bbW,bbH);
        ctx.strokeStyle="#f5f5dc";ctx.lineWidth=Math.max(2,bbW*0.006);
        ctx.strokeRect(bbX+3,bbY+3,bbW-6,bbH-6);
        ctx.fillStyle="#f5f5dc";
        L.draw(bbY,bbH);
        // 保存はまだしない → 確認画面（黒板入りの写真）を出す
        const stepObj=(!checkTarget&&!albumTarget)?(mergedSteps.find(x=>x.id===photoStep)||steps.find(x=>x.id===photoStep)):null;
        const label=checkTarget?checkTarget:albumTarget?`${albumTarget.phase==="pre"?"着手前":"完成"}・${albumTarget.position}`:`${cur.name||""}・${stepObj?(stepObj.photoOnly?stepObj.name:`${stepObj.id}.${stepObj.name}`):""}`;
        let boardData=null;
        try{const m=Math.round(bbW*0.03);const x0=Math.max(0,bbX-m),y0=Math.max(0,bbY-m);const w=Math.min(cw-x0,bbW+m*2),h=Math.min(chh-y0,bbH+m*2);
          const c2=document.createElement("canvas");c2.width=w;c2.height=h;c2.getContext("2d").drawImage(canvas,x0,y0,w,h,0,0,w,h);boardData=c2.toDataURL("image/jpeg",0.92);}catch(e){}
        setPreviewZoom(false);
        setPendingShot({data:canvas.toDataURL("image/jpeg",0.85),boardData,label,plain,exif,tgt:{kind:checkTarget?"check":albumTarget?"album":"step",checkTarget,album:albumTarget?{...albumTarget}:null,photoStep,note:checkTarget?composeNote(checkTarget):""}});
      };
      img.src=ev.target.result;
    };
    reader.readAsDataURL(file);
  };
  const delPhoto=(sid,idx)=>{const dph=((cur.photos||{})[sid]||[])[idx];if(dph)toTrash([trashOf(dph,{kind:"pt",point:cur.name,step:String(sid)})]);setCur(p=>{const ph={...p.photos};const a=[...(ph[sid]||[])];a.splice(idx,1);ph[sid]=a;return{...p,photos:ph};});};
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
  if(locked){const tryUnlock=()=>{if(kwOk(keyword)){try{localStorage.setItem("dekigata_unlocked","1");}catch(e){}setLocked(false);}else{setKwError(true);setKeyword("");}};
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
    const hasAnyData=(points||[]).some(hasPtData)||Object.values(checkPhotos||{}).some(a=>Array.isArray(a)&&a.length>0);
    const selSimple=(tpl)=>{if(workMode==="simple"&&header.workKind===tpl.name)return;if(hasAnyData&&!window.confirm(`工種を「${tpl.name}」に切り替えますか？\n（撮影済みの写真・測点は消えません）`))return;setHeader(h=>({...h,projectType:"simple",workKind:tpl.name,diameter:""}));setCheckItems(Array.isArray(tpl.items)?tpl.items:[]);};
    const selPublic=()=>{if(workMode==="public")return;if(hasAnyData&&!window.confirm("工種を「公共工事・配水管布設」に切り替えますか？\n（撮影済みの写真・測点は消えません）"))return;setHeader(h=>({...h,projectType:"public",workKind:"",diameter:h.diameter&&Number(h.diameter)>0?Number(h.diameter):150}));if(!(checkItems||[]).some(i=>String(i).trim().startsWith("@"))&&seqTpls[0])setCheckItems(seqTpls[0].items);};
    return(<div style={{...S.w,zoom:fontScale}}>
    <div style={S.top}><h1 style={S.logo}>出来形かんたん <span style={{fontSize:10,color:"#bbb",fontWeight:500}}>v{APP_VERSION}</span></h1><div style={{display:"flex",alignItems:"center",gap:6}}><span style={S.bg}>{workMode==="simple"?"簡易":"1/3"}</span><button style={{...S.bk,fontSize:20,padding:"4px 8px"}} onClick={()=>setShowProjList(true)} title="プロジェクト一覧">≡</button></div></div>
    {rescueBanner}{restoreCenter}
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
          <div style={{fontSize:12,opacity:.6}}>{seqTpls[0]?`工程テンプレ「${seqTpls[0].name}」で施工状況と出来形管理を一本の流れに展開`:"測点・検測・検査記録表・写真台帳フル装備"}</div></button>
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
    {typeLocked&&<div style={{...S.c,background:"#FFF8E1",border:"1px solid #FFCC80",fontSize:13,color:"#8D6E00",fontWeight:700}}>🔒 出来形の入力があるので、管種・道路・路面は変えられません（数字や写真が別の工程にずれないように）</div>}
    <div style={{...S.c,...(typeLocked?{opacity:.55}:{})}}><div style={S.ch}>管種</div><div style={{display:"flex",gap:6}}>
      {["DCIP","HPPE"].map(k=>(<button key={k} onClick={()=>selPipe(k)} style={{...S.sel,flex:1,...(pipeType===k?S.selOn:{})}}><div style={{fontSize:14,fontWeight:700}}>{PL[k]}</div><div style={{fontSize:12,opacity:.6}}>{k==="DCIP"?"ダクタイル鋳鉄管":"ポリエチレン管"}</div></button>))}
      <button onClick={()=>selPipe("SHIKIRI")} style={{...S.sel,flex:.7,...(pipeType==="SHIKIRI"?S.selOn:{})}}><div style={{fontSize:12,fontWeight:700}}>仕切弁筐</div></button></div></div>
    {pipeType!=="SHIKIRI"&&<>
      <div style={{...S.c,...(typeLocked?{opacity:.55}:{})}}><div style={S.ch}>道路種別</div><div style={{display:"flex",gap:8}}>
        {ROADS.map(r=>(<button key={r.key} onClick={()=>selRoad(r.key)} style={{...S.rb,...(roadType===r.key?S.rbOn:{})}}><span style={{fontSize:22,fontWeight:700}}>{r.label}</span><span style={{fontSize:12,opacity:.7}}>D={r.D}</span></button>))}</div></div>
      <div style={{...S.c,...(typeLocked?{opacity:.55}:{})}}><div style={S.ch}>路面</div><div style={{display:"flex",gap:8}}>
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
            {["DCIP","HPPE"].map(k=>(<button key={k} onClick={()=>setHeader(h=>{const ds=getDias(k);const cd=Number(h.pipe2?.diameter);return{...h,pipe2:{pipeType:k,diameter:ds.includes(cd)?cd:ds[0]}};})} style={{...S.sel,flex:1,...((header.pipe2.pipeType||pipeType)===k?S.selOn:{})}}><div style={{fontSize:13,fontWeight:700}}>{PL[k]}</div></button>))}
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
        <button style={{...S.exp,marginBottom:10,background:"#E8F5E9",color:"#1B5E20",border:"1px solid #A5D6A7"}} onClick={openRestore}>🛟 復元・履歴（この工事）</button>
        <div style={{fontSize:12,color:"#888",margin:"-4px 0 10px"}}>この端末の名前：{devLabel}　<button onClick={renameDevice} style={{...S.sm,fontSize:12}}>変更</button></div>
        <button style={{...S.pri,marginBottom:12}} onClick={newProject}>+ 新規プロジェクト</button>
        <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
          <button onClick={()=>{setDelMode(m=>!m);setDelSel([]);}} style={{padding:"7px 12px",borderRadius:8,border:"1px solid #ddd",background:delMode?"#FFEBEE":"#fff",color:delMode?"#C62828":"#555",fontSize:13,fontWeight:700,cursor:"pointer"}}>{delMode?"✕ まとめて削除をやめる":"🗑 まとめて削除"}</button>
          {delMode&&<button onClick={()=>setDelSel(projects.filter(p=>!(p.header&&String(p.header.projectName||"").trim())).map(p=>p.id))} style={{padding:"7px 12px",borderRadius:8,border:"1px solid #ddd",background:"#fff",color:"#555",fontSize:13,fontWeight:700,cursor:"pointer"}}>名称なしを全選択</button>}
        </div>
        {delMode&&<button disabled={delSel.length===0} onClick={bulkDelete} style={{...S.pri,marginBottom:12,background:delSel.length?"#C62828":"#ccc"}}>チェックした {delSel.length} 件を削除</button>}
        {projects.length===0?(<div style={{textAlign:"center",padding:"20px 0",color:"#888",fontSize:13}}>プロジェクトなし</div>):(
          [...projects].sort((a,b)=>(b.updatedAt||"").localeCompare(a.updatedAt||"")).map(pj=>{
            const isCurrent=pj.id===currentProjId;
            const pipeLabel=pj.header?.workKind||PL[pj.pipeType||"DCIP"];
            const nameShow=pj.header?.projectName||"(名称未設定)";
            const ptsN=pj.points?.length||0;
            const dt=pj.updatedAt?new Date(pj.updatedAt).toLocaleString("ja-JP",{month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"}):"";
            return(<div key={pj.id} style={{border:isCurrent?"2px solid #1565C0":"1px solid #ddd",borderRadius:10,padding:"10px 12px",marginBottom:8,background:isCurrent?"#E3F2FD":"#fff"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:15,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{nameShow}{isCurrent&&<span style={{fontSize:12,color:"#1565C0",marginLeft:6}}>（現在）</span>}{pj.localDirty&&<span style={{fontSize:11,color:"#E65100",marginLeft:6}}>📱未同期</span>}</div>
                  <div style={{fontSize:12,color:"#888",marginTop:2}}>{pipeLabel} φ{pj.header?.diameter||"—"} / {ptsN}測点 / {dt}</div>
                </div>
                <div style={{display:"flex",gap:4,flexShrink:0,alignItems:"center"}}>
                  {delMode?(<input type="checkbox" checked={delSel.includes(pj.id)} onChange={e=>{const on=e.target.checked;setDelSel(p=>on?[...p,pj.id]:p.filter(x=>x!==pj.id));}} style={{width:24,height:24,cursor:"pointer"}}/>):(<>
                  {!isCurrent&&<button style={{...S.sm,fontSize:13,background:"#E3F2FD",padding:"6px 10px",borderRadius:6}} onClick={()=>switchProject(pj.id)}>開く</button>}
                  <button style={{...S.sm,fontSize:13,color:"#C62828",padding:"6px 10px"}} onClick={()=>deleteProject(pj.id)}>削除</button></>)}
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
        <span style={{fontSize:14,fontWeight:700,color:s.id===1?"#E65100":"#1565C0"}}>H={calcDesignH(s.id,{})}</span></div>);})}
    </div>
    <button style={S.pri} onClick={()=>{if(!points.length)setScreen("bulk");else setScreen("list");}}>{!points.length?"測点作成 →":"現場入力 →"}</button></div>);}

  // ═══ BULK ═══
  if(screen==="bulk"){return(<div style={{...S.w,zoom:fontScale}}>
    <div style={S.top}><button style={S.bk} onClick={()=>setScreen("design")}>← 設計値</button><span style={S.bg}>測点作成</span></div>
    <div style={S.c}><div style={{display:"flex",alignItems:"center",gap:12,justifyContent:"center",marginBottom:16}}>
      <button style={S.cb} onClick={()=>setBulkCount(c=>Math.max(1,c-1))}>−</button>
      <div style={{fontSize:36,fontWeight:700,width:60,textAlign:"center"}}>{bulkCount}</div>
      <button style={S.cb} onClick={()=>setBulkCount(c=>Math.min(20,c+1))}>+</button></div></div>
    <button style={S.pri} onClick={()=>{bulkCreate();setScreen("list");}}>{bulkCount>1?`No.0〜No.${bulkCount-1}`:"No.0"} を作成（{bulkCount}測点・起点No.0）</button></div>);}

  // ═══ ENTRY ═══
  if(screen==="entry"){
    const doneState=(st)=>{const ph=((cur.photos&&cur.photos[st.id])||[]).length>0;if(st.photoOnly)return ph?"done":"none";const filled=st.inputs.length>0&&st.inputs.every(f=>{const v=cur.measured[`${st.id}_${f}`];return v!==undefined&&v!=="";});if(filled&&ph)return"done";if(filled||ph)return"partial";return"none";};
    const doneN=mergedSteps.filter(st=>doneState(st)==="done").length;
    const firstOpen=mergedSteps.findIndex(st=>doneState(st)!=="done");
    const jumpTo=(i)=>{const el=document.getElementById(`stepcard-${i}`);if(el)el.scrollIntoView({behavior:"smooth",block:"start"});};
    const stCol=(d)=>d==="done"?"#2E7D32":d==="partial"?"#F9A825":"#ccc";
    // 狙いH と「あとで×になりそう」（v2.1.8）
    const winMap=planWindows(steps,design,H0,D,cur.measured,surfaceType);
    const riskMap=laterRisks(steps,winMap,cur.measured,design,surfaceType);
    const stepLabel=(id)=>{const s=steps.find(x=>x.id===id);return s?`${s.id}.${s.name}`:"";};
    const whyText=(w)=>Array.from(new Set((w.why||[]).map(k=>WHY_LABEL[k]).filter(Boolean))).join("・");
    const hasM=(k)=>{const v=cur.measured[k];return v!==undefined&&v!==null&&v!==""&&!isNaN(Number(v));};
    const fmtWin=(lo,hi)=>(lo===hi?`${lo} ちょうど`:`${lo}〜${hi}`)+(lo<0?"（マイナスは地表より上）":"");
    const boxS=(tone)=>({marginTop:6,padding:"8px 10px",borderRadius:8,fontSize:13,fontWeight:700,lineHeight:1.45,
      background:tone==="ng"?"#FFEBEE":tone==="warn"?"#FFF8E1":"#E3F2FD",border:`1px solid ${tone==="ng"?"#C62828":tone==="warn"?"#F9A825":"#1565C0"}55`,color:tone==="ng"?"#B71C1C":tone==="warn"?"#E65100":"#0D47A1"});
    const aimBox=(step)=>{
      const w=step.tKey?winMap[step.id]:null;if(!w||w.measured!==null)return null;
      const ready=step.prevRef==="D"?measuredD(steps,cur.measured)!==null:(step.prevRef!==null&&step.prevRef!==undefined&&hasM(`${step.prevRef}_H`));
      const narrowed=(w.hi-w.lo)<(FM.H.minus+FM.H.plus);
      if(!w.ok){const ownBad=w.own.lo>w.own.hi;return(<div style={boxS("ng")}>🔴 {ownBad?<>この層は、どう仕上げても×が出ます（{whyText(w)}が同時に○になりません）</>:<>この層をどう仕上げても、このあとの層で×が出ます</>}<div style={{fontSize:11,fontWeight:500,color:"#555"}}>前の層やDを直せるなら今のうち</div></div>);}
      if(!ready&&!narrowed)return null;
      return(<div style={boxS(w.tight?"warn":"aim")}>🎯 狙いH {fmtWin(w.lo,w.hi)}{w.tight?`　⚠ 余裕${Math.max(0,w.room)}mm`:""}<div style={{fontSize:11,fontWeight:500,color:"#555"}}>この範囲に仕上げれば {whyText(w)} が全部○{w.ahead?"（次の層の余裕も残る範囲）":""}</div></div>);
    };
    const riskBox=(step)=>{
      const r=riskMap[step.id];if(!r)return null;
      if(r.pave)return(<div style={boxS("ng")}>🔴 このHのままだと、舗装厚が足りません（舗装は {r.need}mm 以上必要、今のHだと約 {r.h}mm）<div style={{fontSize:11,fontWeight:500,color:"#555"}}>直すなら舗装の前に</div></div>);
      if(r.kind==="ng")return(<div style={boxS("ng")}>🔴 この値のままだと、あとで「{stepLabel(r.target)}」で×が出ます（どう仕上げても全部○になりません）<div style={{fontSize:11,fontWeight:500,color:"#555"}}>直すなら今のうち</div></div>);
      const rw=winMap[r.target];const room=rw?Math.max(0,rw.room):Math.max(0,r.hi-r.lo);
      return(<div style={boxS("warn")}>⚠ この値だと「{stepLabel(r.target)}」の余裕が {room}mm しかありません（狙いH {fmtWin(r.lo,r.hi)}）</div>);
    };
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
            <span style={{fontSize:15,fontWeight:700,flex:1,color:done?"#2E7D32":"#222"}}>{step.name}<span style={{fontSize:12,color:"#999",marginLeft:6,fontWeight:500}}>施工状況</span></span>
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
        const nextId=idx>=0&&idx<zsteps.length-1?zsteps[idx+1].id:null;
        return{zk,isLast,remainLayers,cum,hM,need,nextId};
      })();
      const dState=dSt;
      return(<div key={step.id} id={`stepcard-${stepIdx}`} style={{...S.c,borderLeft:`5px solid ${isNext?"#1565C0":stCol(dState)}`,background:dState==="done"?"#F1F8E9":isNext?"#F5F9FF":S.c.background,scrollMarginTop:90,...cardFrame}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
          {seqBadge}
          <span style={S.sn}>{step.id}</span><span style={{fontSize:15,fontWeight:700,flex:1}}>{step.name}<span style={{fontSize:12,color:"#999",marginLeft:6,fontWeight:500}}>出来形管理</span>{dState==="partial"&&<span style={{fontSize:12,color:"#E65100",marginLeft:6}}>{photos.length>0?"（数値未入力）":"（写真未撮影）"}</span>}</span>
          {statusTag}
          {(()=>{const sd=(cur.dates||{})[step.id]||"";return(<label style={{display:"flex",alignItems:"center",gap:2,fontSize:12,color:sd?"#1565C0":"#999",flexShrink:0}}>📅<input type="date" value={sd||cur.date||""} onChange={e=>setCur(p=>({...p,dates:{...(p.dates||{}),[step.id]:e.target.value}}))} style={{border:"none",background:"transparent",fontSize:12,color:"inherit",padding:0,width:112}}/></label>);})()}
          </div>
        {step.inputs.map(f=>{
          const d=dv(f,step.id);const key=`${step.id}_${f}`;const mv=cur.measured[key]??"";
          const err=d!==null&&mv!==""?Number(mv)-Number(d):null;const j=err!==null?judge(err,f):null;
          return(<div key={f} style={S.er}>
            <div style={{flex:1.2}}><span style={{fontSize:16,fontWeight:700}}>{fl(f)}</span><div style={{fontSize:12,color:"#1565C0",fontWeight:600}}>{d!==null?Math.round(d):"—"}<span style={{fontSize:12,color:"#999",marginLeft:4}}>({crit(f)})</span>{f==="H"&&step.id!==1&&!(step.tKey==="t0")&&(()=>{const k=surfaceRefKind(steps.find(x=>x.id===step.id)||step,steps);if(k==="ta")return(<span style={{fontSize:11,color:"#1565C0",marginLeft:4,fontWeight:700}}>＝舗装厚</span>);if(k==="ta+roban")return(<span style={{fontSize:11,color:"#1565C0",marginLeft:4,fontWeight:700}}>＝舗装厚＋路盤</span>);if(k==="handoff")return(<span style={{fontSize:11,color:"#1565C0",marginLeft:4,fontWeight:700}}>＝舗装厚＋路盤全厚</span>);const dmv=measuredD(steps,cur.measured);const sdS=sandStepOf(steps);if(sdS&&step.id===sdS.id)return dmv!==null?(<span style={{fontSize:11,color:"#E65100",marginLeft:4}}>実測D起点</span>):null;const abS=absorbStepOf(steps);if(abS&&step.id===abS.id&&dmv!==null&&Math.round(dmv)!==Math.round(D)){const dd=Math.round(dmv-D);return(<span style={{fontSize:11,color:"#E65100",marginLeft:4}}>Dのズレ{dd>0?"+":""}{dd}をこの層で吸収</span>);}return null;})()}</div></div>
            <div style={{flex:1.3}}><input type="number" inputMode="decimal" style={S.mi} value={mv} placeholder="実測" onChange={e=>setCur(p=>({...p,measured:{...p.measured,[key]:e.target.value}}))}/></div>
            <div style={{width:48,textAlign:"center",fontSize:14,fontWeight:700,color:err!==null?j==="×"?"#C62828":"inherit":"#ccc"}}>{err!==null?(err>0?`+${err}`:err):"—"}</div>
            <div style={{width:28,textAlign:"center",fontSize:20,fontWeight:800,color:j==="○"?"#2E7D32":j==="×"?"#C62828":"#ddd"}}>{j??"·"}</div></div>);})}
        {aimBox(step)}
        {riskBox(step)}
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
          // 舗装への残り深さは舗装厚の下限（−7）で見る（路盤のHが○でも舗装厚で×になるため）
          const rawDiff=z.hM-z.need;const diff=Math.round(rawDiff*10)/10;const bad=(z.zk==="B"&&z.need>0)?(rawDiff< -(FM.ta.minus??30)||rawDiff>30):Math.abs(rawDiff)>30;
          return(<div style={{marginTop:6,padding:"8px 10px",borderRadius:8,background:bg,border:`1px solid ${col}55`}}>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <div style={{flex:1,fontSize:12,fontWeight:700,color:col}}>{zname} 累計 {sign}mm ／ 許容±30</div>
              <div style={{fontSize:12,fontWeight:700,color:col}}>{tag}</div></div>
            {!z.isLast&&(()=>{const nw=z.nextId!==null&&z.nextId!==undefined?winMap[z.nextId]:null;if(!nw||nw.measured!==null)return null;if(riskMap[step.id]&&riskMap[step.id].target===z.nextId)return null;const tight=nw.ok&&nw.tight;
              return(<div style={{fontSize:12,color:!nw.ok?"#C62828":tight?"#E65100":"#555",marginTop:3,fontWeight:!nw.ok||tight?700:400}}>{nw.ok?`次の「${stepLabel(z.nextId)}」の狙いH：${fmtWin(nw.lo,nw.hi)}${tight?`（余裕${Math.max(0,nw.room)}mm）`:""}`:`次の「${stepLabel(z.nextId)}」は、どう仕上げても×が出ます`}</div>);})()}
            {z.isLast&&<div style={{fontSize:12,color:bad?"#C62828":"#333",marginTop:3,fontWeight:bad?700:400}}>{z.zk==="A"?"砕石ゾーンへ渡す深さ":"舗装への残り深さ"}：実測 {Math.round(z.hM*10)/10} ／ 必要 {z.need}（{diff>0?"+":""}{diff}）{bad&&z.zk==="A"&&(diff<0?" ⚠ このまま進むと路盤が薄くなります":" ⚠ 路盤が厚くなり舗装高が合いません")}{bad&&z.zk==="B"&&(diff<0?" ⚠ 舗装厚が確保できません":" ⚠ 舗装が厚くなります")}</div>}
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
    {shotPreview}
    {viewPhoto&&(<div onClick={()=>setViewPhoto(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <img src={viewPhoto} style={{maxWidth:"100%",maxHeight:"90vh",borderRadius:12}}/></div>)}
  </div>);}

  // ═══ CHECK（撮影チェックリスト） ═══
  if(screen==="check"){
    const delCheckPhoto=(item,idx)=>{const dph=(checkPhotos[item]||[])[idx];if(dph)toTrash([trashOf(dph,{kind:"ck",item})]);setCheckPhotos(p=>{const n={...p};const a=[...(n[item]||[])];a.splice(idx,1);n[item]=a;return n;});};
    const delItem=(item)=>{
      if((checkPhotos[item]||[]).length>0){if(!confirm(`「${item}」の写真はゴミ箱へ移ります（🛟から戻せます）。項目を削除しますか?`))return;}
      toTrash((checkPhotos[item]||[]).map(ph=>trashOf(ph,{kind:"ck",item})));
      setCheckItems(p=>p.filter(x=>x!==item));
      setCheckPhotos(p=>{const n={...p};delete n[item];return n;});
      setCheckNotes(p=>{const n={...p};delete n[item];return n;});
      setCheckDims(p=>{const n={...p};delete n[item];return n;});
    };
    const addItem=()=>{const n=newItemName.trim();if(!n||checkItems.includes(n))return;setCheckItems(p=>[...p,n]);setNewItemName("");};
    const applyTpl=(tpl)=>{setCheckItems(Array.isArray(tpl.items)?tpl.items:[]);setToast(`「${tpl.name}」を適用`);setTimeout(()=>setToast(""),2000);};
    const resetTpl=()=>{if(!confirm("チェックリストをリセットしますか?（撮影済み写真はゴミ箱へ移ります）"))return;toTrash(Object.entries(checkPhotos||{}).flatMap(([it,a])=>(a||[]).map(ph=>trashOf(ph,{kind:"ck",item:it}))));setCheckItems([]);setCheckPhotos({});setCheckNotes({});setCheckDims({});};
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
          <div style={{fontSize:12,color:"#555"}}>📐＝出来形管理（@で位置指定）／📷＝施工状況。撮影は各測点の画面で行います。項目の追加・削除で順序を調整できます。</div>
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
              <span style={{fontSize:13,fontWeight:600,flex:1,color:isA?"#1565C0":"#333"}}>{isA?String(item).trim().slice(1)+"（出来形管理）":item}</span>
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
      {shotPreview}
    {viewPhoto&&(<div onClick={()=>setViewPhoto(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
        <img src={viewPhoto} style={{maxWidth:"100%",maxHeight:"90vh",borderRadius:12}}/></div>)}
      {toast&&<div style={S.to}>{toast}</div>}
    </div>);}

  // ═══ ALBUM（着手前及び完成 写真台帳） ═══
  if(screen==="album"){
    const delAlbumPhoto=(id)=>{const dph=albumPhotos.find(x=>x.id===id);if(dph)toTrash([trashOf(dph,{kind:"al",phase:dph.phase,position:dph.position})]);setAlbumPhotos(p=>p.filter(x=>x.id!==id));};
    const addPos=()=>{const n=newPosName.trim();if(!n||albumPositions.includes(n))return;setAlbumPositions(p=>[...p,n]);setNewPosName("");};
    const delPos=(pos)=>{if(albumPhotos.some(p=>p.position===pos)){if(!confirm(`「${pos}」の写真はゴミ箱へ移ります。位置を削除しますか?`))return;toTrash(albumPhotos.filter(x=>x.position===pos).map(ph=>trashOf(ph,{kind:"al",phase:ph.phase,position:ph.position})));setAlbumPhotos(p=>p.filter(x=>x.position!==pos));}setAlbumPositions(p=>p.filter(x=>x!==pos));};
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
      {shotPreview}
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
    {rescueBanner}{restoreCenter}
    <div style={{display:"flex",gap:6,fontSize:12,color:"#888",padding:"0 4px",marginBottom:10,flexWrap:"wrap"}}>
      <span>{PL[pipeType]}</span><span>φ{dia}</span><span>{road.label}</span><span>{steps.length}工程</span></div>
    {points.length===0?(<div style={{textAlign:"center",padding:"40px 16px",color:"#888"}}>
      <div style={{fontSize:40,marginBottom:8}}>📐</div>
      <button style={{...S.pri,marginTop:16}} onClick={()=>setScreen("bulk")}>測点を一括作成</button></div>):(
    <>{points.map((pt,idx)=>{
      let total=0,ok=0,ng=0;
      steps.forEach(step=>{step.inputs.forEach(f=>{total++;const d=dv(f,step.id,pt.measured||{});const key=`${step.id}_${f}`;const mv=pt.measured[key];
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
      <button style={{...S.pri,background:"#fff",color:"#1565C0",border:"2px solid #1565C0"}} onClick={()=>setPoints(p=>[...p,{name:nextPointName(p),date:"",measured:{},photos:{},dates:{}}])}>+ 測点追加</button>
      {(()=>{
        if(hasAnchors||header.projectType==="simple")return null;
        const seq=(templates||[]).filter(t=>(Array.isArray(t.items)?t.items:[]).some(i=>String(i).trim().startsWith("@")));
        if(seq.length===0)return null;
        const hasPhotos=Object.values(checkPhotos||{}).some(a=>Array.isArray(a)&&a.length>0);
        return(<div style={{...S.c,background:"#FFF8E1",border:"2px solid #FFB300"}}>
          <div style={{fontSize:14,fontWeight:700,color:"#E65100",marginBottom:4}}>⚠ 施工状況と出来形管理が別画面になっています</div>
          <div style={{fontSize:12,color:"#555",marginBottom:8}}>工程テンプレを適用すると、各測点の画面で「施工状況📷 → 出来形管理📐」が{(seq[0].items||[]).length}項目の一本流れになります。{hasPhotos?"（今のチェックリストの写真は残ります）":""}</div>
          <button style={S.pri} onClick={()=>{setCheckItems(seq[0].items);setToast(`「${seq[0].name}」を適用 → 測点を開いてください`);setTimeout(()=>setToast(""),3000);}}>一本流れにする（{seq[0].name}）</button>
        </div>);})()}
      <button style={{...S.exp,background:"#FFF3E0",color:"#E65100",border:"1px solid #FFCC80"}} onClick={()=>setScreen("album")}>📷 着手前及び完成（写真台帳）</button>
      <button style={{...S.exp,background:!hasAnchors&&checkItems.length>0&&checkItems.filter(it=>!((checkPhotos[it]||[]).length>0)).length>0?"#FFEBEE":"#F5F5F5",color:!hasAnchors&&checkItems.length>0&&checkItems.filter(it=>!((checkPhotos[it]||[]).length>0)).length>0?"#C62828":"#555",border:"1px solid #ddd"}} onClick={()=>setScreen("check")}>{hasAnchors?"🗂 工程リスト（撮影順を編集）":`✓ 撮影チェックリスト${checkItems.length>0?(()=>{const r=checkItems.filter(it=>!((checkPhotos[it]||[]).length>0)).length;return r>0?`（未撮影 ${r}件）`:"（完了✅）";})():""}`}</button>
      <button style={S.exp} onClick={handlePDF}>出来形PDF（検査記録表＋各測点{steps.length}枚・豆図付き）</button>
      <button style={{...S.exp,background:"#E3F2FD",color:"#1565C0",border:"1px solid #90CAF9"}} onClick={handleStatusPDF}>施工状況写真PDF（各測点{mergedSteps.length}枚・黒板欄付き）</button>
      <button style={{...S.exp,background:"#E3F2FD",color:"#1565C0",border:"1px solid #90CAF9"}} onClick={()=>{
        let csv="\uFEFF";csv+=`工事名,${header.projectName}\n\n`;csv+=`測点,工程,項目,設計,実測,誤差,判定,日付\n`;
        points.forEach(pt=>{steps.forEach(step=>{step.inputs.forEach(f=>{const d=dv(f,step.id,pt.measured||{});const key=`${step.id}_${f}`;const mv=pt.measured[key]??"";const err=d!==null&&mv!==""?Number(mv)-Number(d):"";const j=err!==""?judge(err,f):"";
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
        <button style={{...S.exp,marginBottom:10,background:"#E8F5E9",color:"#1B5E20",border:"1px solid #A5D6A7"}} onClick={openRestore}>🛟 復元・履歴（この工事）</button>
        <div style={{fontSize:12,color:"#888",margin:"-4px 0 10px"}}>この端末の名前：{devLabel}　<button onClick={renameDevice} style={{...S.sm,fontSize:12}}>変更</button></div>
        <button style={{...S.pri,marginBottom:12}} onClick={newProject}>+ 新規プロジェクト</button>
        <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
          <button onClick={()=>{setDelMode(m=>!m);setDelSel([]);}} style={{padding:"7px 12px",borderRadius:8,border:"1px solid #ddd",background:delMode?"#FFEBEE":"#fff",color:delMode?"#C62828":"#555",fontSize:13,fontWeight:700,cursor:"pointer"}}>{delMode?"✕ まとめて削除をやめる":"🗑 まとめて削除"}</button>
          {delMode&&<button onClick={()=>setDelSel(projects.filter(p=>!(p.header&&String(p.header.projectName||"").trim())).map(p=>p.id))} style={{padding:"7px 12px",borderRadius:8,border:"1px solid #ddd",background:"#fff",color:"#555",fontSize:13,fontWeight:700,cursor:"pointer"}}>名称なしを全選択</button>}
        </div>
        {delMode&&<button disabled={delSel.length===0} onClick={bulkDelete} style={{...S.pri,marginBottom:12,background:delSel.length?"#C62828":"#ccc"}}>チェックした {delSel.length} 件を削除</button>}
        {projects.length===0?(<div style={{textAlign:"center",padding:"20px 0",color:"#888",fontSize:13}}>プロジェクトなし</div>):(
          [...projects].sort((a,b)=>(b.updatedAt||"").localeCompare(a.updatedAt||"")).map(pj=>{
            const isCurrent=pj.id===currentProjId;
            const pipeLabel=pj.header?.workKind||PL[pj.pipeType||"DCIP"];
            const nameShow=pj.header?.projectName||"(名称未設定)";
            const ptsN=pj.points?.length||0;
            const dt=pj.updatedAt?new Date(pj.updatedAt).toLocaleString("ja-JP",{month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"}):"";
            return(<div key={pj.id} style={{border:isCurrent?"2px solid #1565C0":"1px solid #ddd",borderRadius:10,padding:"10px 12px",marginBottom:8,background:isCurrent?"#E3F2FD":"#fff"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:15,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{nameShow}{isCurrent&&<span style={{fontSize:12,color:"#1565C0",marginLeft:6}}>（現在）</span>}{pj.localDirty&&<span style={{fontSize:11,color:"#E65100",marginLeft:6}}>📱未同期</span>}</div>
                  <div style={{fontSize:12,color:"#888",marginTop:2}}>{pipeLabel} φ{pj.header?.diameter||"—"} / {ptsN}測点 / {dt}</div>
                </div>
                <div style={{display:"flex",gap:4,flexShrink:0,alignItems:"center"}}>
                  {delMode?(<input type="checkbox" checked={delSel.includes(pj.id)} onChange={e=>{const on=e.target.checked;setDelSel(p=>on?[...p,pj.id]:p.filter(x=>x!==pj.id));}} style={{width:24,height:24,cursor:"pointer"}}/>):(<>
                  {!isCurrent&&<button style={{...S.sm,fontSize:13,background:"#E3F2FD",padding:"6px 10px",borderRadius:6}} onClick={()=>switchProject(pj.id)}>開く</button>}
                  <button style={{...S.sm,fontSize:13,color:"#C62828",padding:"6px 10px"}} onClick={()=>deleteProject(pj.id)}>削除</button></>)}
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
