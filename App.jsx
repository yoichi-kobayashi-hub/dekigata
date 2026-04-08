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

  const css=`*{margin:0;padding:0;box-sizing:border-box}body{font-family:"Hiragino Sans","MS Gothic",sans-serif;font-size:9px;color:#000}
@media print{@page{size:A4 portrait;margin:8mm}}.page{page-break-after:always;width:100%;max-width:190mm;margin:0 auto;padding:4mm 0}
table{border-collapse:collapse;width:100%}td,th{border:0.5px solid #333;padding:2px 3px;font-size:8px;vertical-align:middle}
.lbl{background:#f5f5f0;text-align:center;font-weight:bold;font-size:7px;color:#333}
.title{font-size:14px;font-weight:bold;text-align:center;letter-spacing:4px;padding:4px 0 6px}
.seal{text-align:center;font-size:6px;color:#666;width:40px}.seal-box{height:20px}
.mid{display:grid;grid-template-columns:55% 45%;border:0.5px solid #333}
.mid-l{border-right:0.5px solid #333;padding:4px;text-align:center}.mid-r{padding:4px;font-size:7px}
.mid-r table td{font-size:7px;padding:1px 3px}
.chk{border:0.5px solid #333;padding:2px 4px;font-size:7px;color:#333;margin-top:-0.5px}
.dt td,.dt th{font-size:7px;text-align:center;height:12px;padding:1px 2px}
.dt th{background:#f5f5f0;font-size:6px}.dt .no{font-weight:bold;background:#fafaf5}
.dt .itm{text-align:left;padding-left:4px;color:#555}.dt .sep{border-left:1.5px solid #000}
.ok{color:#006633}.ng{color:#cc0000;font-weight:bold}
.note{font-size:6px;color:#666;padding:1px 0}
.step-page{page-break-after:always;padding:2mm 0}
.step-hdr{font-size:10px;font-weight:bold;margin-bottom:3mm;display:flex;justify-content:space-between}
.step-card{border:0.5px solid #333;margin-bottom:3mm;padding:3mm;display:grid;grid-template-columns:1fr 1fr;gap:3mm}
.step-photo{aspect-ratio:4/3;border:0.5px solid #ccc;display:flex;align-items:center;justify-content:center;font-size:8px;color:#ccc}
.step-info{font-size:7px}.step-info table td{font-size:7px;padding:1px 2px}
.step-title{font-weight:bold;font-size:8px;margin-bottom:2mm}
.ftr{font-size:6px;color:#888;display:flex;justify-content:space-between;margin-top:2mm}`;

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

    html+=`<div class="mid"><div class="mid-l"><div style="font-size:7px;color:#666;margin-bottom:2px">検測位置図</div>`;
    html+=`<div style="font-size:8px">Ba<br>┌────────────┐<br>`;
    const layerNames=["ta AS(40)","t6 路盤(150)","t5 路盤(150)","t4 発生土(160)","t3 発生土(200)","t2 発生土(200)","t1 保護砂(100)","　　管 φ"+dia+"(OD"+od+")"];
    if(pipeType==="HPPE")layerNames.push("t0 基礎砂(100)");
    layerNames.forEach(l=>{html+=`│ ${l}<br>`;});
    html+=`└────────────┘<br>B</div></div>`;

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

  const perPage=3;
  steps.forEach(step=>{
    for(let p=0;p<points.length;p+=perPage){
      html+=`<div class="step-page"><div class="step-hdr"><span>${step.id}. ${step.name}</span><span style="font-size:7px;color:#888">${PL[pipeType]} φ${dia} ${road.label}</span></div>`;
      for(let i=0;i<perPage&&p+i<points.length;i++){
        const pt=points[p+i];
        html+=`<div class="step-card"><div class="step-photo">写真（${pt.name} ${step.name}）</div><div class="step-info">`;
        html+=`<div class="step-title">${pt.name} — ${step.name}　${pt.date||""}</div>`;
        html+=`<table><tr><th>項目</th><th>設計</th><th>実測</th><th>誤差</th><th>判定</th></tr>`;
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
          html+=`<tr><td>${f}</td><td>${dVal!==null?dVal:""}</td><td>${mv}</td><td>${err!==null?(err>0?"+":"")+err:""}</td><td class="${j==="○"?"ok":j==="×"?"ng":""}">${j||""}</td></tr>`;
        });
        if(step.tKey){
          const tD=design[step.tKey]?Number(design[step.tKey]):null;
          html+=`<tr><td>${step.tKey}</td><td>${tD||""}</td><td></td><td></td><td></td></tr>`;
        }
        step.extra.forEach(ex=>{
          const key=`${step.id}_${ex.key}`;const mv=pt.measured[key]??"";
          const err=mv!==""?Number(mv)-ex.design:null;const j=err!==null?judge(err,ex.key,ex):null;
          html+=`<tr><td>${ex.key}</td><td>${ex.design}</td><td>${mv}</td><td>${err!==null?(err>0?"+":"")+err:""}</td><td class="${j==="○"?"ok":j==="×"?"ng":""}">${j||""}</td></tr>`;
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
