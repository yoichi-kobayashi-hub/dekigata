import { useState } from "react";

const OD_DCIP={75:93.0,100:118.0,150:169.0,200:220.0,250:271.6,300:322.8,400:425.6};
const OD_HPPE={75:89.0,100:114.0,150:165.0};
const DIAS_DCIP=[75,100,150,200,250,300,400];
const DIAS_HPPE=[75,100,150];
const ROADS=[{key:"shidou",label:"市道",D:1000},{key:"kendou",label:"県道",D:1200}];
const SURFACES=[{key:"asphalt",label:"アスファルト"},{key:"gravel",label:"砕石"}];

function mkDCIP(road,surface,D){
  const Hs=D-300; const isG=surface==="gravel";
  if(road==="shidou"){
    const s=[
      {id:1,name:"掘削",inputs:["H","B"],tKey:null,prevRef:null,extra:[]},
      {id:2,name:"管布設",inputs:["D"],tKey:null,prevRef:null,extra:[]},
      {id:3,name:"砂埋戻し",inputs:["H","B"],tKey:"t1",tDef:100,prevRef:"D",extra:[]},
      {id:4,name:"発生土埋戻し",inputs:["H","B"],tKey:"t2",tDef:200,prevRef:3,extra:[
        {key:"Hs",label:"埋設シート",design:Hs,minus:30,plus:30},
        {key:"Dm",label:"マーカーピン",design:700,minus:30,plus:30},
      ]},
      {id:5,name:"発生土埋戻し",inputs:["H","B"],tKey:"t3",tDef:200,prevRef:4,extra:[]},
      {id:6,name:"発生土埋戻し",inputs:["H","B"],tKey:"t4",tDef:isG?200:160,prevRef:5,extra:[]},
      {id:7,name:"路盤砕石",inputs:["H","B"],tKey:"t5",tDef:150,prevRef:6,extra:[]},
      {id:8,name:"路盤砕石",inputs:["H","B"],tKey:"t6",tDef:150,prevRef:7,extra:[]},
    ];
    if(!isG)s.push({id:9,name:"舗装",inputs:["Ba","ta"],tKey:null,prevRef:null,extra:[]});
    return s;
  }
  const s=[
    {id:1,name:"掘削",inputs:["H","B"],tKey:null,prevRef:null,extra:[]},
    {id:2,name:"管布設",inputs:["D"],tKey:null,prevRef:null,extra:[]},
    {id:3,name:"砂埋戻し",inputs:["H","B"],tKey:"t1",tDef:100,prevRef:"D",extra:[]},
    {id:4,name:"発生土埋戻し",inputs:["H","B"],tKey:"t2",tDef:200,prevRef:3,extra:[
      {key:"Hs",label:"埋設シート",design:Hs,minus:30,plus:30},
    ]},
    {id:5,name:"発生土埋戻し",inputs:["H","B"],tKey:"t3",tDef:200,prevRef:4,extra:[
      {key:"Dm",label:"マーカーピン",design:700,minus:30,plus:30},
    ]},
    {id:6,name:"発生土埋戻し",inputs:["H","B"],tKey:"t4",tDef:200,prevRef:5,extra:[]},
    {id:7,name:"発生土埋戻し",inputs:["H","B"],tKey:"t5",tDef:isG?200:160,prevRef:6,extra:[]},
    {id:8,name:"路盤砕石",inputs:["H","B"],tKey:"t6",tDef:150,prevRef:7,extra:[]},
    {id:9,name:"路盤砕石",inputs:["H","B"],tKey:"t7",tDef:150,prevRef:8,extra:[]},
  ];
  if(!isG)s.push({id:10,name:"舗装",inputs:["Ba","ta"],tKey:null,prevRef:null,extra:[]});
  return s;
}

function mkHPPE(road,surface,D){
  const Hs=D-300; const isG=surface==="gravel";
  if(road==="shidou"){
    const s=[
      {id:1,name:"掘削",inputs:["H","B"],tKey:null,prevRef:null,extra:[]},
      {id:2,name:"基礎砂",inputs:["H","B"],tKey:"t0",tDef:100,prevRef:1,extra:[]},
      {id:3,name:"管布設",inputs:["D"],tKey:null,prevRef:null,extra:[]},
      {id:4,name:"砂埋戻し",inputs:["H","B"],tKey:"t1",tDef:100,prevRef:"D",extra:[]},
      {id:5,name:"発生土埋戻し",inputs:["H","B"],tKey:"t2",tDef:200,prevRef:4,extra:[
        {key:"Hs",label:"埋設シート",design:Hs,minus:30,plus:30},
        {key:"Dm",label:"マーカーピン",design:700,minus:30,plus:30},
      ]},
      {id:6,name:"発生土埋戻し",inputs:["H","B"],tKey:"t3",tDef:200,prevRef:5,extra:[]},
      {id:7,name:"発生土埋戻し",inputs:["H","B"],tKey:"t4",tDef:isG?200:160,prevRef:6,extra:[]},
      {id:8,name:"路盤砕石",inputs:["H","B"],tKey:"t5",tDef:150,prevRef:7,extra:[]},
      {id:9,name:"路盤砕石",inputs:["H","B"],tKey:"t6",tDef:150,prevRef:8,extra:[]},
    ];
    if(!isG)s.push({id:10,name:"舗装",inputs:["Ba","ta"],tKey:null,prevRef:null,extra:[]});
    return s;
  }
  const s=[
    {id:1,name:"掘削",inputs:["H","B"],tKey:null,prevRef:null,extra:[]},
    {id:2,name:"基礎砂",inputs:["H","B"],tKey:"t0",tDef:100,prevRef:1,extra:[]},
    {id:3,name:"管布設",inputs:["D"],tKey:null,prevRef:null,extra:[]},
    {id:4,name:"砂埋戻し",inputs:["H","B"],tKey:"t1",tDef:100,prevRef:"D",extra:[]},
    {id:5,name:"発生土埋戻し",inputs:["H","B"],tKey:"t2",tDef:200,prevRef:4,extra:[
      {key:"Hs",label:"埋設シート",design:Hs,minus:30,plus:30},
    ]},
    {id:6,name:"発生土埋戻し",inputs:["H","B"],tKey:"t3",tDef:200,prevRef:5,extra:[
      {key:"Dm",label:"マーカーピン",design:700,minus:30,plus:30},
    ]},
    {id:7,name:"発生土埋戻し",inputs:["H","B"],tKey:"t4",tDef:200,prevRef:6,extra:[]},
    {id:8,name:"発生土埋戻し",inputs:["H","B"],tKey:"t5",tDef:isG?200:160,prevRef:7,extra:[]},
    {id:9,name:"路盤砕石",inputs:["H","B"],tKey:"t6",tDef:150,prevRef:8,extra:[]},
    {id:10,name:"路盤砕石",inputs:["H","B"],tKey:"t7",tDef:150,prevRef:9,extra:[]},
  ];
  if(!isG)s.push({id:11,name:"舗装",inputs:["Ba","ta"],tKey:null,prevRef:null,extra:[]});
  return s;
}

function getSteps(p,r,sf,D){
  if(p==="SHIKIRI")return[{id:1,name:"弁筐設置",inputs:["A","H"],tKey:null,prevRef:null,extra:[]}];
  return p==="DCIP"?mkDCIP(r,sf,D):mkHPPE(r,sf,D);
}
function getDefaults(steps){const d={};steps.forEach(s=>{if(s.tKey&&s.tDef)d[s.tKey]=s.tDef;});if(steps.some(s=>s.inputs?.includes("ta")))d.ta=40;return d;}
function getOD(p,d){return(p==="DCIP"?OD_DCIP:p==="HPPE"?OD_HPPE:{})[d]||0;}
function getDias(p){return p==="DCIP"?DIAS_DCIP:p==="HPPE"?DIAS_HPPE:[];}
function calcH0(p,D,d){const od=getOD(p,d);return p==="HPPE"?D+od+100:D+od;}

const FM={H:{label:"深さ",minus:30,plus:30},B:{label:"幅",minus:50,plus:null},Ba:{label:"舗装幅",minus:25,plus:null},D:{label:"埋設深",minus:30,plus:30},ta:{label:"舗装厚",minus:7,plus:null},t0:{label:"基礎砂",minus:30,plus:30},t1:{label:"保護砂",minus:30,plus:30},t2:{label:"発生土",minus:30,plus:30},t3:{label:"発生土",minus:30,plus:30},t4:{label:"発生土",minus:30,plus:30},t5:{label:"発生土/路盤",minus:30,plus:30},t6:{label:"路盤",minus:30,plus:30},t7:{label:"路盤",minus:30,plus:30},A:{label:"弁芯距離",minus:null,plus:25}};
const PL={DCIP:"DCIP",HPPE:"HPPE",SHIKIRI:"仕切弁筐"};
function judge(e,f,m){const meta=m||FM[f];if(!meta||e===null||isNaN(e))return null;if(meta.minus!==null&&e<-meta.minus)return"×";if(meta.plus!==null&&e>meta.plus)return"×";return"○";}
function today(){const d=new Date();return`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;}
function crit(f,m){const meta=m||FM[f];if(!meta)return"";let p=[];if(meta.minus!==null)p.push(`-${meta.minus}`);if(meta.plus!==null)p.push(`+${meta.plus}`);return p.join("/");}

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
  const[cur,setCur]=useState({name:"",date:today(),measured:{}});
  const[editIdx,setEditIdx]=useState(null);
  const[toast,setToast]=useState("");
  const[bulkCount,setBulkCount]=useState(10);
  const[inited,setInited]=useState(false);

  const road=ROADS.find(r=>r.key===roadType);
  const D=road.D;const dia=header.diameter;const od=getOD(pipeType,dia);
  const H0=pipeType==="SHIKIRI"?0:calcH0(pipeType,D,dia);
  const steps=getSteps(pipeType,roadType,surfaceType,D);
  const tSum=steps.reduce((s,st)=>s+(st.tKey&&design[st.tKey]?Number(design[st.tKey]):0),0)+(design.ta?Number(design.ta):0);

  const rebuild=(p,r,sf)=>{
    const st=getSteps(p,r,sf,ROADS.find(x=>x.key===r).D);
    setDesign(d=>({...getDefaults(st),B:d.B||"",Ba:d.Ba||""}));
    setPoints([]);
  };
  if(!inited){rebuild("DCIP","shidou","asphalt");setInited(true);}

  // ★ 修正: Hは「その工程の埋戻し後」= 自分のtを含む
  const calcDesignH=(sid)=>{
    if(sid===1)return H0; // 掘削 = D + OD (+ 基礎砂)
    // HPPE基礎砂: 掘削H - t0
    const bStep=steps.find(s=>s.tKey==="t0");
    if(bStep&&sid===bStep.id)return H0-(Number(design.t0)||0);
    // 管布設以降: Dから自分のtまで全部引く
    let h=D; let afterPipe=false;
    for(const s of steps){
      if(s.inputs.includes("D")){afterPipe=true;continue;}
      if(!afterPipe)continue;
      if(s.id>sid)break; // ★ s.id > sid (自分のtを含む)
      if(s.tKey&&s.tKey!=="t0"&&design[s.tKey])h-=Number(design[s.tKey]);
    }
    return Math.round(h);
  };

  const dv=(f,sid)=>{
    if(f==="H")return calcDesignH(sid);
    if(f==="B")return design.B?Number(design.B):null;
    if(f==="Ba")return design.Ba?Number(design.Ba):null;
    if(f==="D")return D;
    if(f==="ta")return Number(design.ta)||40;
    return design[f]?Number(design[f]):null;
  };

  const calcT=(step,meas)=>{
    if(!step.tKey||step.prevRef===null)return null;
    let pv;
    if(step.prevRef==="D"){const ds=steps.find(s=>s.inputs.includes("D"));pv=ds?meas[`${ds.id}_D`]:null;}
    else pv=meas[`${step.prevRef}_H`];
    const ch=meas[`${step.id}_H`];
    if(!pv||pv===""||!ch||ch==="")return null;
    return Number(pv)-Number(ch);
  };

  const prevLbl=(step)=>{
    if(!step.prevRef)return"";
    if(step.prevRef==="D"){const ds=steps.find(s=>s.inputs.includes("D"));return`D(${ds?.id})−H(${step.id})`;}
    return`H(${step.prevRef})−H(${step.id})`;
  };

  const selPipe=(k)=>{setPipeType(k);const ds=getDias(k);if(ds.length&&!ds.includes(header.diameter))setHeader(h=>({...h,diameter:ds[0]}));rebuild(k,roadType,surfaceType);};
  const selRoad=(k)=>{setRoadType(k);rebuild(pipeType,k,surfaceType);};
  const selSurface=(k)=>{setSurfaceType(k);rebuild(pipeType,roadType,k);};
  const bulkCreate=()=>{const pts=[];for(let i=0;i<bulkCount;i++)pts.push({name:`No.${i}`,date:"",measured:{}});setPoints(pts);};
  const editPoint=(i)=>{setCur(JSON.parse(JSON.stringify(points[i])));setEditIdx(i);setScreen("entry");};
  const savePoint=()=>{if(editIdx!==null)setPoints(p=>{const n=[...p];n[editIdx]={...cur};return n;});setScreen("list");};

  const exportCSV=()=>{
    let csv="\uFEFF";const sf=surfaceType==="asphalt"?"アスファルト":"砕石";
    csv+=`工事名,${header.projectName}\n工事箇所,${header.location}\n管種,${PL[pipeType]}\n口径,φ${dia}(OD=${od})\n道路,${road.label}（D=${D} H=${H0}）\n路面,${sf}\n\n`;
    csv+=`測点,#,工程,項目,設計値,検測値,誤差,判定,日付\n`;
    points.forEach(pt=>{steps.forEach(step=>{
      step.inputs.forEach(f=>{const d=dv(f,step.id);const key=`${step.id}_${f}`;const mv=pt.measured[key]??"";
        const err=d!==null&&mv!==""?Number(mv)-Number(d):"";const j=err!==""?judge(err,f):"";
        csv+=`${pt.name},${step.id},${step.name},${f},${d!==null?Math.round(d):""},${mv},${err},${j},${pt.date}\n`;});
      if(step.tKey){const tM=calcT(step,pt.measured);const tD=design[step.tKey]?Number(design[step.tKey]):null;
        const tErr=tM!==null&&tD!==null?tM-tD:"";const tJ=tErr!==""?judge(tErr,step.tKey):"";
        csv+=`${pt.name},${step.id},${step.name},${step.tKey}(自動),${tD??""},${tM??""},${tErr},${tJ},${pt.date}\n`;}
      step.extra.forEach(ex=>{const key=`${step.id}_${ex.key}`;const mv=pt.measured[key]??"";
        const err=mv!==""?Number(mv)-ex.design:"";const j=err!==""?judge(err,ex.key,ex):"";
        csv+=`${pt.name},${step.id},${step.name},${ex.key},${ex.design},${mv},${err},${j},${pt.date}\n`;});
    });csv+="\n";});
    const blob=new Blob([csv],{type:"text/csv;charset=utf-8;"});const url=URL.createObjectURL(blob);
    const a=document.createElement("a");a.href=url;a.download=`出来形_${header.projectName||"data"}_${today()}.csv`;a.click();
    URL.revokeObjectURL(url);setToast("ダウンロード完了");setTimeout(()=>setToast(""),3000);
  };

  // ═══ LOCK SCREEN ═══
  if(locked){
    const tryUnlock=()=>{
      if(keyword.toLowerCase()==="shinano"||keyword==="信濃"){setLocked(false);setKwError(false);}
      else{setKwError(true);setKeyword("");}
    };
    return(<div style={{...S.w,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"80vh"}}>
      <div style={{fontSize:40,marginBottom:16}}>🔒</div>
      <h1 style={{fontSize:20,fontWeight:700,marginBottom:4}}>出来形かんたん</h1>
      <div style={{fontSize:12,color:"#888",marginBottom:24}}>関係者専用</div>
      <input style={{...S.inp,width:220,textAlign:"center",fontSize:18,letterSpacing:2}}
        value={keyword} onChange={e=>setKeyword(e.target.value)}
        onKeyDown={e=>{if(e.key==="Enter")tryUnlock();}}
        placeholder="キーワード" autoFocus/>
      {kwError&&<div style={{fontSize:12,color:"#C62828",marginTop:8}}>キーワードが違います</div>}
      <button style={{...S.pri,width:220,marginTop:12}} onClick={tryUnlock}>入場</button>
    </div>);
  }

  // ═══ SETUP ═══
  if(screen==="setup"){const dias=getDias(pipeType);return(<div style={S.w}>
    <div style={S.top}><h1 style={S.logo}>出来形かんたん</h1><span style={S.bg}>1/3</span></div>
    <div style={S.c}><div style={S.ch}>管種</div>
      <div style={{display:"flex",gap:6}}>
        {["DCIP","HPPE"].map(k=>(<button key={k} onClick={()=>selPipe(k)} style={{...S.sel,flex:1,...(pipeType===k?S.selOn:{})}}>
          <div style={{fontSize:14,fontWeight:700}}>{k}</div><div style={{fontSize:10,opacity:.6}}>{k==="DCIP"?"ダクタイル鋳鉄管":"ポリエチレン管"}</div></button>))}
        <button onClick={()=>selPipe("SHIKIRI")} style={{...S.sel,flex:.7,...(pipeType==="SHIKIRI"?S.selOn:{})}}><div style={{fontSize:12,fontWeight:700}}>仕切弁筐</div></button>
      </div></div>
    {pipeType!=="SHIKIRI"&&<>
      <div style={S.c}><div style={S.ch}>道路種別</div><div style={{display:"flex",gap:8}}>
        {ROADS.map(r=>(<button key={r.key} onClick={()=>selRoad(r.key)} style={{...S.rb,...(roadType===r.key?S.rbOn:{})}}>
          <span style={{fontSize:22,fontWeight:700}}>{r.label}</span><span style={{fontSize:12,opacity:.7}}>D={r.D}</span></button>))}</div></div>
      <div style={S.c}><div style={S.ch}>路面</div><div style={{display:"flex",gap:8}}>
        {SURFACES.map(sf=>(<button key={sf.key} onClick={()=>selSurface(sf.key)} style={{...S.sfb,...(surfaceType===sf.key?S.sfbOn:{})}}>
          <span style={{fontSize:16,fontWeight:700}}>{sf.label}</span><span style={{fontSize:11,opacity:.6}}>{sf.key==="asphalt"?"舗装あり":"舗装なし"}</span></button>))}</div></div>
      <div style={S.c}><div style={S.ch}>口径</div><div style={{display:"flex",flexWrap:"wrap",gap:6}}>
        {dias.map(d=>(<button key={d} onClick={()=>setHeader(h=>({...h,diameter:d}))} style={{...S.db,...(dia===d?S.dbOn:{})}}>
          <div style={{fontSize:15,fontWeight:700}}>φ{d}</div><div style={{fontSize:10,opacity:.6}}>OD {getOD(pipeType,d)}</div></button>))}</div></div>
      <div style={{...S.c,background:"#E8F5E9",border:"none"}}>
        <div style={{fontSize:13,color:"#2E7D32",fontWeight:600,marginBottom:6}}>自動計算</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4,fontSize:13}}>
          <span>D</span><span style={{fontWeight:700}}>{D}mm</span>
          <span>OD</span><span style={{fontWeight:700}}>{od}mm</span>
          {pipeType==="HPPE"&&<><span>基礎砂</span><span style={{fontWeight:700}}>100mm</span></>}
          <span>掘削H</span><span style={{fontWeight:700,color:"#1B5E20"}}>{H0}mm</span>
          <span>路面</span><span style={{fontWeight:700}}>{surfaceType==="asphalt"?"AS":"砕石"}</span>
          <span>工程数</span><span style={{fontWeight:700}}>{steps.length}</span>
        </div></div>
    </>}
    <div style={S.c}><div style={S.ch}>工事情報</div>
      {[["projectName","工事名"],["location","工事箇所"]].map(([k,l])=>(<div key={k} style={{marginBottom:8}}>
        <label style={S.lb}>{l}</label><input style={S.inp} value={header[k]} onChange={e=>setHeader(h=>({...h,[k]:e.target.value}))} placeholder={l}/></div>))}</div>
    <button style={S.pri} onClick={()=>setScreen("design")}>設計値確認 →</button>
  </div>);}

  // ═══ DESIGN ═══
  if(screen==="design"){const hasTa=steps.some(s=>s.inputs?.includes("ta"));return(<div style={S.w}>
    <div style={S.top}><button style={S.bk} onClick={()=>setScreen("setup")}>← 設定</button><span style={S.bg}>2/3 設計値</span></div>
    <div style={{...S.c,background:"#E3F2FD",border:"none",padding:12}}>
      <div style={{fontSize:13,fontWeight:600,color:"#1565C0"}}>{surfaceType==="asphalt"?"B と Ba を入力":"B だけ入力"}</div></div>
    <div style={S.c}><div style={S.ch}>自動設定</div>
      <div style={S.ar}><span>D</span><span style={S.av}>{D}</span></div>
      <div style={S.ar}><span>H（掘削）</span><span style={S.av}>{H0}</span></div>
      <div style={S.ar}><span>Hs（シート）</span><span style={S.av}>{D-300}</span></div>
      <div style={{...S.ar,borderBottom:"none"}}><span>Dm（マーカー）</span><span style={S.av}>700</span></div></div>
    <div style={S.c}><div style={S.ch}>手入力</div>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
        <div style={{flex:1,fontSize:14,fontWeight:600}}>床付幅 B</div>
        <input type="number" inputMode="decimal" style={{...S.ni,width:100,border:"2px solid #FFB300",background:"#FFFDE7"}}
          value={design.B??""} placeholder="mm" onChange={e=>setDesign(d=>({...d,B:e.target.value}))}/><span style={{fontSize:12,color:"#999"}}>mm</span></div>
      {surfaceType==="asphalt"&&<div style={{display:"flex",alignItems:"center",gap:8}}>
        <div style={{flex:1,fontSize:14,fontWeight:600}}>舗装幅 Ba</div>
        <input type="number" inputMode="decimal" style={{...S.ni,width:100,border:"2px solid #FFB300",background:"#FFFDE7"}}
          value={design.Ba??""} placeholder="mm" onChange={e=>setDesign(d=>({...d,Ba:e.target.value}))}/><span style={{fontSize:12,color:"#999"}}>mm</span></div>}</div>
    <div style={S.c}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
      <div style={S.ch}>各層の設計厚</div>
      <div style={{fontSize:11,fontWeight:600,color:tSum===D?"#2E7D32":"#C62828"}}>計{tSum} {tSum===D?"=D ✓":`≠D(${D})`}</div></div>
      {steps.map(s=>{if(!s.tKey)return null;return(<div key={s.id} style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
        <span style={S.sd}>{s.id}</span><div style={{flex:1}}><span style={{fontSize:13,fontWeight:600}}>{s.tKey}</span><span style={{fontSize:11,color:"#888",marginLeft:4}}>{s.name}</span></div>
        <input type="number" inputMode="decimal" style={{...S.ni,width:70}} value={design[s.tKey]??""} placeholder="mm"
          onChange={e=>setDesign(d=>({...d,[s.tKey]:e.target.value}))}/><span style={{fontSize:12,color:"#999",width:24}}>mm</span></div>);})}
      {hasTa&&<div style={{display:"flex",alignItems:"center",gap:6}}><span style={S.sd}>▪</span><div style={{flex:1}}><span style={{fontSize:13,fontWeight:600}}>ta</span><span style={{fontSize:11,color:"#888",marginLeft:4}}>舗装</span></div>
        <input type="number" inputMode="decimal" style={{...S.ni,width:70}} value={design.ta??""} placeholder="mm"
          onChange={e=>setDesign(d=>({...d,ta:e.target.value}))}/><span style={{fontSize:12,color:"#999",width:24}}>mm</span></div>}</div>
    <div style={S.c}><div style={S.ch}>各工程の設計H ★修正済み</div>
      {steps.map(s=>{if(!s.inputs.includes("H"))return null;const h=calcDesignH(s.id);
        return(<div key={s.id} style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
          <span style={S.sd}>{s.id}</span><span style={{flex:1,fontSize:13}}>{s.name}
            {s.extra.map(ex=><span key={ex.key} style={{marginLeft:4,fontSize:10,color:"#1565C0",background:"#E3F2FD",padding:"1px 5px",borderRadius:4}}>+{ex.key}</span>)}</span>
          <span style={{fontSize:14,fontWeight:700,fontVariantNumeric:"tabular-nums",color:s.id===1?"#E65100":"#1565C0"}}>H={h}</span></div>);})}
    </div>
    <button style={S.pri} onClick={()=>{if(!points.length)setScreen("bulk");else setScreen("list");}}>{!points.length?"測点作成 →":"現場入力 →"}</button>
  </div>);}

  // ═══ BULK ═══
  if(screen==="bulk"){return(<div style={S.w}>
    <div style={S.top}><button style={S.bk} onClick={()=>setScreen("design")}>← 設計値</button><span style={S.bg}>測点作成</span></div>
    <div style={S.c}><div style={S.ch}>測点を一括作成</div>
      <div style={{fontSize:12,color:"#888",marginBottom:12}}>総距離÷40m = 測点数</div>
      <div style={{display:"flex",alignItems:"center",gap:12,justifyContent:"center",marginBottom:16}}>
        <button style={S.cb} onClick={()=>setBulkCount(c=>Math.max(1,c-1))}>−</button>
        <div style={{fontSize:36,fontWeight:700,width:60,textAlign:"center"}}>{bulkCount}</div>
        <button style={S.cb} onClick={()=>setBulkCount(c=>Math.min(20,c+1))}>+</button></div>
      <div style={{display:"flex",flexWrap:"wrap",gap:6,justifyContent:"center"}}>
        {Array.from({length:bulkCount},(_,i)=>(<span key={i} style={S.pp}>No.{i}</span>))}</div></div>
    <button style={S.pri} onClick={()=>{bulkCreate();setScreen("list");}}>No.0〜No.{bulkCount-1} を作成</button>
  </div>);}

  // ═══ ENTRY ═══
  if(screen==="entry"){return(<div style={S.w}>
    <div style={S.top}><button style={S.bk} onClick={()=>setScreen("list")}>← 戻る</button><span style={S.bg}>{cur.name}</span></div>
    <div style={S.c}><div style={{display:"flex",gap:8}}>
      <div style={{flex:1}}><label style={S.lb}>測点</label><input style={{...S.inp,fontWeight:700,fontSize:18}} value={cur.name} onChange={e=>setCur(p=>({...p,name:e.target.value}))}/></div>
      <div style={{flex:1}}><label style={S.lb}>日付</label><input type="date" style={S.inp} value={cur.date} onChange={e=>setCur(p=>({...p,date:e.target.value}))}/></div></div></div>
    {steps.map(step=>{
      const tM=step.tKey?calcT(step,cur.measured):null;const tD=step.tKey&&design[step.tKey]?Number(design[step.tKey]):null;
      const tErr=tM!==null&&tD!==null?tM-tD:null;const tJ=tErr!==null?judge(tErr,step.tKey):null;
      return(<div key={step.id} style={S.c}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
          <span style={S.sn}>{step.id}</span><span style={{fontSize:14,fontWeight:600}}>{step.name}</span>
          {step.extra.length>0&&<span style={{fontSize:10,color:"#1565C0",background:"#E3F2FD",padding:"2px 6px",borderRadius:4}}>+{step.extra.map(e=>e.key).join(",")}</span>}</div>
        {step.inputs.map(f=>{
          const d=dv(f,step.id);const key=`${step.id}_${f}`;const mv=cur.measured[key]??"";
          const err=d!==null&&mv!==""?Number(mv)-Number(d):null;const j=err!==null?judge(err,f):null;
          return(<div key={f} style={S.er}>
            <div style={{flex:1.2,minWidth:0}}>
              <div style={{display:"flex",alignItems:"baseline",gap:4}}><span style={{fontSize:16,fontWeight:700}}>{f}</span><span style={{fontSize:11,color:"#aaa"}}>{FM[f]?.label}</span></div>
              <div style={{fontSize:12,color:"#1565C0",fontWeight:600,fontVariantNumeric:"tabular-nums"}}>{d!==null?Math.round(d):"—"}<span style={{fontSize:10,color:"#999",fontWeight:400,marginLeft:4}}>({crit(f)})</span></div></div>
            <div style={{flex:1.3,padding:"0 4px"}}><input type="number" inputMode="decimal" style={S.mi} value={mv} placeholder="実測"
              onChange={e=>setCur(p=>({...p,measured:{...p.measured,[key]:e.target.value}}))}/></div>
            <div style={{width:48,textAlign:"center",fontSize:14,fontWeight:700,fontVariantNumeric:"tabular-nums",color:err!==null?j==="×"?"#C62828":"var(--color-text-primary)":"#ccc"}}>{err!==null?(err>0?`+${err}`:err):"—"}</div>
            <div style={{width:28,textAlign:"center",fontSize:20,fontWeight:800,color:j==="○"?"#2E7D32":j==="×"?"#C62828":"#ddd"}}>{j??"·"}</div></div>);})}
        {step.tKey&&(<div style={{marginTop:6,padding:"8px 10px",borderRadius:8,background:tJ==="○"?"#E8F5E9":tJ==="×"?"#FFEBEE":"var(--color-background-tertiary,#f5f5f5)",display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
          <div style={{flex:1,minWidth:120}}><div style={{fontSize:13,fontWeight:600,color:tJ==="○"?"#2E7D32":tJ==="×"?"#C62828":"#888"}}>{step.tKey} = {tM!==null?`${tM}mm`:"—"}</div>
            <div style={{fontSize:11,color:"#999"}}>{prevLbl(step)} ／ 設計:{tD??"-"}mm</div></div>
          {tErr!==null&&<div style={{fontSize:13,fontWeight:700,color:tJ==="○"?"#2E7D32":"#C62828"}}>{tErr>0?`+${tErr}`:tErr} {tJ}</div>}</div>)}
        {step.extra.map(ex=>{const key=`${step.id}_${ex.key}`;const mv=cur.measured[key]??"";
          const err=mv!==""?Number(mv)-ex.design:null;const j=err!==null?judge(err,ex.key,ex):null;
          return(<div key={ex.key} style={{marginTop:6,padding:"8px 10px",borderRadius:8,border:"1px dashed #1565C0",background:"#E3F2FD22",display:"flex",alignItems:"center",gap:6}}>
            <div style={{flex:1,minWidth:0}}><div style={{fontSize:13,fontWeight:600,color:"#1565C0"}}>{ex.key} {ex.label}</div>
              <div style={{fontSize:11,color:"#888"}}>設計:{ex.design}mm（{crit(ex.key,ex)}）</div></div>
            <input type="number" inputMode="decimal" style={{...S.mi,width:90}} value={mv} placeholder="実測"
              onChange={e=>setCur(p=>({...p,measured:{...p.measured,[key]:e.target.value}}))}/> 
            <div style={{width:48,textAlign:"center",fontSize:14,fontWeight:700,color:err!==null?j==="×"?"#C62828":"var(--color-text-primary)":"#ccc"}}>{err!==null?(err>0?`+${err}`:err):"—"}</div>
            <div style={{width:28,textAlign:"center",fontSize:18,fontWeight:800,color:j==="○"?"#2E7D32":j==="×"?"#C62828":"#ddd"}}>{j??"·"}</div></div>);})}
      </div>);})}
    <button style={S.pri} onClick={savePoint}>更新 ✓</button>
  </div>);}

  // ═══ LIST ═══
  return(<div style={S.w}>
    <div style={S.top}><button style={S.bk} onClick={()=>setScreen("design")}>← 設計値</button>
      <h1 style={{fontSize:16,fontWeight:700,margin:0}}>{header.projectName||"出来形管理"}</h1></div>
    <div style={{display:"flex",gap:6,fontSize:11,color:"#888",padding:"0 4px",marginBottom:10,flexWrap:"wrap"}}>
      <span>{PL[pipeType]}</span><span>φ{dia}</span><span>{road.label}</span>
      <span>{surfaceType==="asphalt"?"AS":"砕石"}</span><span>H={H0}</span><span>{steps.length}工程</span></div>
    {points.length===0?(<div style={{textAlign:"center",padding:"40px 16px",color:"#888"}}>
      <div style={{fontSize:40,marginBottom:8}}>📐</div><div style={{fontSize:15,fontWeight:600}}>まだ測点がありません</div>
      <button style={{...S.pri,marginTop:16}} onClick={()=>setScreen("bulk")}>測点を一括作成</button></div>):(
    <>{points.map((pt,idx)=>{
      let total=0,ok=0,ng=0;
      steps.forEach(step=>{step.inputs.forEach(f=>{total++;const d=dv(f,step.id);const key=`${step.id}_${f}`;const mv=pt.measured[key];
        if(d!==null&&mv&&mv!==""){const j=judge(Number(mv)-Number(d),f);if(j==="○")ok++;if(j==="×")ng++;}});
        if(step.tKey){total++;const tM=calcT(step,pt.measured);const tD=design[step.tKey]?Number(design[step.tKey]):null;
          if(tM!==null&&tD!==null){const j=judge(tM-tD,step.tKey);if(j==="○")ok++;if(j==="×")ng++;}}
        step.extra.forEach(ex=>{total++;const key=`${step.id}_${ex.key}`;const mv=pt.measured[key];
          if(mv&&mv!==""){const j=judge(Number(mv)-ex.design,ex.key,ex);if(j==="○")ok++;if(j==="×")ng++;}});});
      const fl=ok+ng;
      return(<div key={idx} style={{...S.pc,borderLeft:fl===0?"3px solid #ddd":fl<total?"3px solid #FFB300":ng>0?"3px solid #C62828":"3px solid #2E7D32"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:16,fontWeight:700}}>{pt.name}</span><span style={{fontSize:11,color:"#999"}}>{pt.date}</span></div>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <span style={{...S.sb,background:fl===0?"#f5f5f5":fl<total?"#FFF8E1":ng>0?"#FFEBEE":"#E8F5E9",
              color:fl===0?"#999":fl<total?"#E65100":ng>0?"#C62828":"#2E7D32"}}>
              {fl===0?"未入力":fl<total?`${fl}/${total}`:ng>0?`${ng}件NG`:"全OK"}</span>
            <button style={{...S.sm,fontSize:14,fontWeight:700}} onClick={()=>editPoint(idx)}>入力→</button></div></div></div>);})}
    <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:12}}>
      <button style={{...S.pri,background:"#fff",color:"#1565C0",border:"2px solid #1565C0"}}
        onClick={()=>setPoints(p=>[...p,{name:`No.${p.length}`,date:"",measured:{}}])}>+ 測点追加</button>
      <button style={S.exp} onClick={exportCSV}>CSV出力</button></div></>)}
    {toast&&<div style={S.to}>{toast}</div>}
  </div>);
}

const S={
  w:{maxWidth:540,margin:"0 auto",padding:"8px 0",fontFamily:'"Helvetica Neue","Hiragino Sans",sans-serif',color:"var(--color-text-primary,#1a1a1a)"},
  top:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,padding:"0 4px"},
  logo:{fontSize:20,fontWeight:700,margin:0,letterSpacing:"-.02em"},
  bg:{fontSize:11,fontWeight:600,background:"#E3F2FD",color:"#1565C0",padding:"3px 10px",borderRadius:20},
  c:{background:"var(--color-background-secondary,#fafafa)",border:"0.5px solid var(--color-border-tertiary,#e0e0e0)",borderRadius:12,padding:14,marginBottom:10},
  ch:{fontSize:14,fontWeight:600,marginBottom:10},
  lb:{display:"block",fontSize:12,fontWeight:500,color:"var(--color-text-secondary,#666)",marginBottom:3},
  inp:{width:"100%",padding:"10px 12px",fontSize:15,border:"1px solid var(--color-border-tertiary,#ddd)",borderRadius:8,background:"var(--color-background-primary,#fff)",color:"var(--color-text-primary)",boxSizing:"border-box",outline:"none"},
  ni:{padding:"8px 6px",fontSize:15,border:"1px solid var(--color-border-tertiary,#ddd)",borderRadius:8,textAlign:"center",background:"var(--color-background-primary,#fff)",color:"var(--color-text-primary)",boxSizing:"border-box",outline:"none",fontVariantNumeric:"tabular-nums"},
  mi:{width:"100%",padding:"10px 8px",fontSize:17,fontWeight:600,border:"2px solid #FFB300",borderRadius:8,textAlign:"center",background:"#FFFDE7",color:"var(--color-text-primary)",boxSizing:"border-box",outline:"none",fontVariantNumeric:"tabular-nums"},
  sel:{padding:"10px",border:"1.5px solid var(--color-border-tertiary,#ddd)",borderRadius:10,background:"var(--color-background-primary,#fff)",cursor:"pointer",textAlign:"center"},
  selOn:{borderColor:"#1565C0",background:"#E3F2FD"},
  rb:{flex:1,padding:"14px 12px",border:"2px solid var(--color-border-tertiary,#ddd)",borderRadius:12,background:"var(--color-background-primary,#fff)",cursor:"pointer",textAlign:"center",display:"flex",flexDirection:"column",gap:4,alignItems:"center"},
  rbOn:{borderColor:"#1565C0",background:"#E3F2FD",color:"#1565C0"},
  sfb:{flex:1,padding:"12px",border:"2px solid var(--color-border-tertiary,#ddd)",borderRadius:12,background:"var(--color-background-primary,#fff)",cursor:"pointer",textAlign:"center",display:"flex",flexDirection:"column",gap:2,alignItems:"center"},
  sfbOn:{borderColor:"#E65100",background:"#FFF3E0",color:"#E65100"},
  db:{padding:"8px 14px",border:"1.5px solid var(--color-border-tertiary,#ddd)",borderRadius:10,background:"var(--color-background-primary,#fff)",cursor:"pointer",textAlign:"center"},
  dbOn:{borderColor:"#1565C0",background:"#E3F2FD",color:"#1565C0"},
  sn:{width:22,height:22,borderRadius:11,background:"#1565C0",color:"#fff",fontSize:12,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},
  sd:{width:20,height:20,borderRadius:10,background:"var(--color-border-tertiary,#ddd)",color:"var(--color-text-secondary,#666)",fontSize:11,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},
  ar:{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"0.5px solid var(--color-border-tertiary,#eee)",fontSize:14},
  av:{fontWeight:700,color:"#1565C0",fontVariantNumeric:"tabular-nums"},
  er:{display:"flex",alignItems:"center",padding:"8px 0",borderBottom:"0.5px solid var(--color-border-tertiary,#eee)",gap:4},
  pri:{width:"100%",padding:"14px",fontSize:16,fontWeight:700,background:"#1565C0",color:"#fff",border:"none",borderRadius:12,cursor:"pointer"},
  exp:{width:"100%",padding:"12px",fontSize:14,fontWeight:600,background:"#E8F5E9",color:"#2E7D32",border:"1px solid #A5D6A7",borderRadius:12,cursor:"pointer"},
  bk:{background:"none",border:"none",fontSize:14,color:"#1565C0",cursor:"pointer",fontWeight:500,padding:"4px 0"},
  pc:{background:"var(--color-background-secondary,#fafafa)",border:"0.5px solid var(--color-border-tertiary,#e0e0e0)",borderRadius:10,padding:"10px 12px",marginBottom:6},
  sb:{fontSize:10,fontWeight:600,padding:"2px 8px",borderRadius:6},
  sm:{background:"none",border:"none",fontSize:13,color:"#1565C0",cursor:"pointer",fontWeight:500,padding:"2px 0"},
  cb:{width:44,height:44,borderRadius:22,border:"2px solid #1565C0",background:"#fff",color:"#1565C0",fontSize:22,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"},
  pp:{fontSize:12,fontWeight:500,padding:"4px 10px",borderRadius:6,background:"var(--color-background-tertiary,#f0f0f0)",color:"var(--color-text-secondary,#666)"},
  to:{position:"fixed",bottom:20,left:"50%",transform:"translateX(-50%)",background:"#333",color:"#fff",padding:"10px 24px",borderRadius:8,fontSize:14,fontWeight:500,zIndex:999},
};
