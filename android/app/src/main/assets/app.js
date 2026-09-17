'use strict';
/* Same CSS as styles.css, kept in sync, embedded so a self-contained statement
   file can be exported without fetch() (the CSP forbids connect-src). */
const STYLE_CSS=`:root{--paper:#eceee9;--card:#f7f8f5;--ink:#1b2a4a;--soft:#5b6672;--edge:#c6ccc4;
 --rule:#9fb8c4;--stamp:#2f6b4f;--bad:#a8322a;--amber:#8a6a1f;--od:#2f4f8a}
*{box-sizing:border-box}
html{max-width:100%}
body{max-width:100%;overflow-x:clip}
input[type=file]{max-width:100%;font-size:13px;padding:6px}
body{margin:0;background:var(--paper);color:var(--ink);font:16px/1.5 "Segoe UI",Roboto,-apple-system,"Noto Sans Tamil",sans-serif;font-variant-numeric:tabular-nums;padding-bottom:78px;-webkit-text-size-adjust:100%}
.wrap{max-width:1200px;margin:auto;padding:0 14px}
header.mast{padding:20px 0 14px;border-bottom:2px solid var(--ink)}
h1{font:600 26px/1.1 Georgia,serif;margin:0}
.sub{font-size:14px;color:var(--soft);margin:2px 0 0}
.credit{font-size:11px;color:var(--soft);margin:10px 0 0}
.regbar{display:flex;gap:8px;align-items:center;margin-top:12px}
.regbar select{flex:1 1 auto;min-width:0;font-weight:600;font-size:14px;padding:8px 9px}
.regbar button{white-space:nowrap;padding:8px 11px;font-size:13px}
h2{font:600 18px/1.2 Georgia,serif;margin:0 0 6px}
.hint{font-size:13.5px;color:var(--soft);margin:0 0 14px;max-width:66ch}
section{display:none;padding:18px 0}
section.on{display:block}
label{display:block;font-size:12px;color:var(--soft);margin-bottom:4px;font-weight:600}
input,select,textarea{width:100%;font:inherit;font-size:15px;padding:9px 10px;border:1px solid var(--edge);border-radius:3px;background:var(--card);color:var(--ink)}
textarea{min-height:140px;resize:vertical}
:focus-visible{outline:2px solid var(--ink);outline-offset:2px}
.grid3{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:10px;margin-bottom:12px}
.btn{font:inherit;font-size:14px;font-weight:600;padding:9px 14px;border:1px solid var(--ink);border-radius:3px;background:var(--ink);color:var(--paper);cursor:pointer}
.btn.g{background:transparent;color:var(--ink)}
.btn.d{border-color:var(--bad);color:var(--bad);background:transparent}
.btn:disabled{opacity:.35;cursor:not-allowed}
.acts{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;align-items:center}
#saveBadge{position:fixed;right:10px;bottom:62px;z-index:60;font:600 11px/1 sans-serif;
 padding:6px 9px;border-radius:3px;background:var(--stamp);color:#fff;opacity:0;
 transition:opacity .25s;pointer-events:none}
#saveBadge.show{opacity:.94}
#saveBadge.bad{background:var(--bad);opacity:1}
nav.tabs{position:fixed;bottom:0;left:0;right:0;background:var(--card);border-top:1px solid var(--edge);display:grid;grid-template-columns:repeat(5,1fr);z-index:40;padding-bottom:env(safe-area-inset-bottom)}
nav.tabs button{border:0;background:none;padding:11px 2px;font:600 11px/1.2 sans-serif;color:var(--soft);cursor:pointer}
nav.tabs button[aria-selected=true]{color:var(--ink);box-shadow:inset 0 3px 0 var(--ink)}
.scroll{overflow:auto;border:1px solid var(--edge);border-radius:4px;background:var(--card);max-height:72vh}
table.m{border-collapse:separate;border-spacing:0;font-size:12px;width:max-content;min-width:100%}
table.m th,table.m td{border-right:1px solid var(--edge);border-bottom:1px solid var(--edge);padding:3px 4px;background:var(--card);white-space:nowrap;text-align:center}
table.m thead th{position:sticky;top:0;z-index:2;background:#e4e7e1;font:600 11px/1.3 sans-serif;color:var(--soft)}
table.m td.nm,table.m th.nm{position:sticky;left:0;z-index:4;text-align:left;
  min-width:150px;max-width:170px;background:var(--card);
  box-shadow:2px 0 0 0 var(--edge),6px 0 8px -6px rgba(27,42,74,.35)}
table.m td.nm span.nmi{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
table.m thead th.nm{z-index:6;background:#e4e7e1}
.c{width:26px;height:26px;padding:0;border:1px solid var(--edge);border-radius:3px;background:var(--card);font:700 11px/1 sans-serif;color:var(--soft);cursor:pointer}
.c{transition:transform .07s ease}
.c:active{transform:scale(.88)}
.c.P{background:rgba(47,107,79,.18);border-color:var(--stamp);color:var(--stamp)}
.c.A{background:rgba(168,50,42,.12);border-color:var(--bad);color:var(--bad)}
.c.O{background:rgba(47,79,138,.14);border-color:var(--od);color:var(--od)}

.rn{display:block;font-size:10px;color:var(--soft);font-weight:400}
.c.M{background:rgba(138,106,31,.16);border-color:var(--amber);color:var(--amber)}
.c.D{width:44px}
label.dow{display:inline-flex;gap:5px;align-items:center;font-size:13px;font-weight:600;margin:0 8px 6px 0;color:var(--ink)}
label.dow input{width:auto;margin:0}
.dayrow{display:flex;gap:6px;align-items:center;padding:5px 0;border-bottom:1px solid var(--edge);flex-wrap:wrap}
.dlab{min-width:94px;font-size:12px;font-weight:600}
.dlab.off{color:var(--soft);font-weight:400}
input.dnote{width:auto;flex:1 1 130px;font-size:12px;padding:4px 6px}
.mhead{font:600 12px/1.4 Georgia,serif;color:var(--soft);padding:10px 0 2px;border-bottom:2px solid var(--edge)}
details.fold{border:1px solid var(--edge);border-radius:4px;background:var(--card);margin-top:8px}
details.fold>summary{cursor:pointer;padding:10px 12px;font:600 14px/1.2 Georgia,serif;list-style:none}
details.fold>summary::-webkit-details-marker{display:none}
details.fold>summary::before{content:'\\25b8 ';color:var(--soft)}
details.fold[open]>summary::before{content:'\\25be '}
details.fold .body{padding:0 12px 12px}
#regWrap{border:1px solid var(--edge);border-radius:4px;background:var(--paper-deep);overflow:auto;max-height:46vh}
#regCanvas{display:block;width:100%;height:auto}
#stripWrap{border:1px solid var(--edge);border-radius:4px;background:#fff;overflow:hidden;margin-bottom:8px}
#stripCanvas{display:block;width:100%;height:auto}
#wizard{border:2px solid var(--ink);border-radius:4px;padding:12px;margin-top:12px;background:var(--card)}
#photoPane{position:sticky;top:0;z-index:5;background:var(--paper);padding-bottom:6px}
#photoBox{overflow:auto;max-height:42vh;border:1px solid var(--edge);border-radius:4px;background:#e4e7e1}
#photoBox img{display:block;max-width:none}
.c.x{background:#e4e7e1;border-color:var(--edge);color:#aab;cursor:not-allowed}
.dayhd{border-left:2px solid var(--ink)!important}
.dayhd small{display:block;font-weight:400;font-size:10px}
select.mini,button.mini{width:auto}
.mini{font:600 10px/1 sans-serif;padding:3px 5px;border:1px solid var(--edge);border-radius:3px;background:var(--card);color:var(--ink);cursor:pointer;margin:1px}
.mini.on{background:var(--stamp);border-color:var(--stamp);color:#fff}
.pager{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:0 0 10px}
.pager b{font-weight:600}
table.s{width:100%;border-collapse:collapse;font-size:13.5px;margin-top:10px}
table.s th,table.s td{text-align:left;padding:6px 7px;border-bottom:1px solid var(--edge)}
table.s th{font:600 11.5px/1.3 sans-serif;color:var(--soft)}
table.s td.n{text-align:right}
tr.band{background:rgba(168,50,42,.08)}
tr.gone{opacity:.45}
.flag{color:var(--bad);font-weight:600}.ok{color:var(--stamp);font-weight:600}.warn{color:var(--amber);font-weight:600}
.stat{font-size:13.5px;color:var(--soft);margin-top:10px}.stat b{color:var(--ink)}
.note{border-left:3px solid var(--amber);padding:8px 0 8px 12px;font-size:13.5px;color:var(--soft);margin-top:14px;max-width:68ch}
.note.bad{border-left-color:var(--bad)}.note.good{border-left-color:var(--stamp)}
.legend{display:flex;gap:14px;flex-wrap:wrap;font-size:12px;color:var(--soft);margin:8px 0}
.legend i{width:11px;height:11px;display:inline-block;vertical-align:-1px;margin-right:4px;border:2px solid;border-radius:2px}
ul.ck{list-style:none;padding:0;margin:10px 0 0;font-size:13.5px}
ul.ck li{padding:8px 0 8px 22px;border-bottom:1px solid var(--edge);position:relative}
ul.ck li::before{position:absolute;left:0;top:8px}
li.p::before{content:"✓";color:var(--stamp)}li.f::before{content:"!";color:var(--bad);font-weight:700}
#stmt{display:none}
body.printing>.wrap>section,body.printing nav.tabs,body.printing #saveBadge,
body.printing header.mast{display:none!important}
body.printing #stmt{display:block}
#stmt .sheet{background:#fff;color:#000;padding:18px;border:1px solid var(--edge);border-radius:4px;
  font:13px/1.45 Georgia,"Times New Roman",serif}
#stmt h3{text-align:center;margin:0 0 2px;font:700 16px/1.3 Georgia,serif;letter-spacing:.02em}
#stmt .inst{text-align:center;font-weight:700;font-size:14px;margin:0}
#stmt .sub{text-align:center;font-size:12px;margin:0 0 10px}
#stmt table{width:100%;border-collapse:collapse;font-size:11.5px;margin-top:8px}
#stmt th,#stmt td{border:1px solid #444;padding:3px 5px;text-align:left}
#stmt th{background:#eee;font-weight:700}
#stmt td.n{text-align:right}
#stmt .meta{width:100%;border:0;font-size:12px;margin:0}
#stmt .meta td{border:0;padding:1px 4px 1px 0}
#stmt .cert{margin-top:12px;font-size:12px}
#stmt .sign{display:flex;justify-content:space-between;margin-top:34px;gap:12px}
#stmt .sign div{flex:1;text-align:center;font-size:11.5px;border-top:1px solid #000;padding-top:4px}
#stmt .foot{margin-top:14px;font-size:10px;color:#444;text-align:center}
@media print{
 @page{size:A4 portrait;margin:12mm}
 body.printing{background:#fff}
 #stmt .sheet{border:0;padding:0}
 #stmt table{font-size:10px}
 #stmt thead{display:table-header-group}
 #stmt tr{break-inside:avoid}
 #stmt .sign{break-inside:avoid}
 nav.tabs,.acts,.pager,.hint,#photoPane,.legend,header.mast .credit{display:none!important}
 section{display:none!important}section.on{display:block!important}
 .scroll{max-height:none!important;overflow:visible!important;border:0}
 body{padding:0;background:#fff}
 table.m th,table.m td{border:1px solid #999;background:#fff!important}
 table.m td.nm,table.m th.nm,table.m thead th{position:static!important;box-shadow:none!important}
 .c{border:1px solid #999;background:#fff!important;color:#000!important}
}
@media(max-width:640px){.wrap{padding:0 10px}table.m td.nm,table.m th.nm{min-width:112px;max-width:118px}.c{width:24px;height:24px}}
`;
const IDX='varugai.v15.index',CUR='varugai.v15.current';
let curId=null;
const regKey=id=>'varugai.v15.'+id;
const readIdx=()=>{try{return JSON.parse(localStorage.getItem(IDX)||'[]');}catch(e){return[];}};
const writeIdx=v=>{try{localStorage.setItem(IDX,JSON.stringify(v));}catch(e){}};
const regLabel=m=>[m.courseCode,m.className,m.semester].filter(Boolean).join(' \u00b7 ')||m.courseTitle||'Untitled register';
const $=id=>document.getElementById(id);
let badgeT=null;
function badge(msg,bad){
  const b=$('saveBadge');if(!b)return;
  b.textContent=msg;b.className=bad?'show bad':'show';
  clearTimeout(badgeT);
  if(!bad)badgeT=setTimeout(()=>{b.className='';},1400);
}
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pad=n=>String(n).padStart(2,'0');
const iso=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const DOW=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const wd=s=>DOW[new Date(s+'T00:00:00').getDay()];
const nice=s=>{const[y,m,d]=s.split('-');return `${d}/${m}`};
const CYC={'-':'P','P':'A','A':'O','O':'-'};

let S={meta:{defHours:5,passMark:75,condFloor:65,bandPts:3,minHours:50},
       days:{},roster:[],marks:{},audit:[]};
let win=0;

/* ---------- persistence ---------- */
function save(){
  try{
    localStorage.setItem(regKey(curId),JSON.stringify(S));
    const ix=readIdx(),e=ix.find(r=>r.id===curId);
    if(e)e.label=regLabel(S.meta);else ix.push({id:curId,label:regLabel(S.meta)});
    writeIdx(ix);localStorage.setItem(CUR,curId);
    $('dataStat').textContent='';drawRegs();badge('Saved on device',false);
    snapshotRecovery();
    return true;}
  catch(e){$('dataStat').innerHTML='<span class="flag">Could not save on this device — storage is full or blocked. Export a backup now.</span>';
    badge('NOT SAVED — storage full',true);return false;}
}
/* Desktop-only safety net: after every successful save, ask the host app to keep an
   atomic rolling recovery snapshot on disk (outside localStorage). No-op in a browser,
   and never allowed to affect the save it is piggybacking on. */
function snapshotRecovery(){
  try{
    const N=window.VarugaiNative||window.VarugaiAndroid;
    if(N&&typeof N.recoverySnapshot==='function')N.recoverySnapshot(curId,JSON.stringify(S));
  }catch(e){/* recovery is best-effort only */}
}
const newSid=()=>'S'+Date.now().toString(36)+Math.random().toString(36).slice(2,7);
function migrate(){
  let changed=false;
  S.roster.forEach(r=>{if(!r.sid){r.sid=newSid();changed=true;}});
  if(S.schema!==2){                                  // marks were keyed by roll number
    const byRoll={};S.roster.forEach(r=>byRoll[r.roll]=r.sid);
    Object.keys(S.marks).forEach(d=>{
      const src=S.marks[d],out={};
      Object.keys(src).forEach(k=>{out[byRoll[k]||k]=src[k];});
      S.marks[d]=out;});
    (S.audit||[]).forEach(a=>{if(a.roll&&!a.sid)a.sid=byRoll[a.roll]||a.roll;});
    S.schema=2;changed=true;
  }
  if(changed)save();
}
const blank=()=>({meta:{defHours:5,passMark:75,condFee:65,condMed:50,bandPts:3,minHours:50},
  days:{},roster:[],marks:{},audit:[],schema:2});
function load(){
  let ix=readIdx();
  const legacy=localStorage.getItem('varugai.v15');
  if(!ix.length&&legacy){                          // one-time move of the single old register
    try{localStorage.setItem(regKey('r1'),legacy);ix=[{id:'r1',label:'Register 1'}];writeIdx(ix);}catch(e){}
  }
  if(!ix.length){ix=[{id:'r1',label:'Register 1'}];writeIdx(ix);}
  curId=localStorage.getItem(CUR);
  if(!ix.some(r=>r.id===curId))curId=ix[0].id;
  S=blank();
  try{const d=JSON.parse(localStorage.getItem(regKey(curId))||'null');if(d)S=Object.assign(S,d);}catch(e){}
  if(S.meta.condFee==null)S.meta.condFee=S.meta.condFloor||65;   // old single-floor files
  if(S.meta.condMed==null)S.meta.condMed=50;
  migrate();drawRegs();
  const m=S.meta;
  ['institution','department','faculty','className','semester','acadYear','courseCode','courseTitle','rulesetLabel','startDate','endDate',
   'defHours','passMark','condFee','condMed','bandPts','minHours']
    .forEach(k=>{if($(k)&&m[k]!=null)$(k).value=m[k];});
  $('rosterText').value=S.roster.map(r=>`${r.roll}, ${r.name}`).join('\n');
}
function grabMeta(){
  ['institution','department','faculty','className','semester','acadYear','courseCode','courseTitle','rulesetLabel','startDate','endDate'].forEach(k=>S.meta[k]=$(k).value.trim());
  ['defHours','passMark','condFee','condMed','bandPts','minHours'].forEach(k=>S.meta[k]=+$(k).value);
}

function drawRegs(){
  const sel=$('regSel');if(!sel)return;
  sel.innerHTML=readIdx().map(r=>`<option value="${r.id}" ${r.id===curId?'selected':''}>${esc(r.label)}</option>`).join('');
}
function redrawAll(){load();drawDays();drawRoster();fillJump();drawMatrix();drawSummary();}
document.addEventListener('change',e=>{
  if(e.target.id!=='regSel')return;
  grabMeta();save();localStorage.setItem(CUR,e.target.value);redrawAll();
});
document.addEventListener('click',e=>{
  if(e.target.id==='newReg'){
    grabMeta();save();
    const id='r'+Date.now().toString(36);
    const fresh=blank();
    const m=S.meta||{};
    ['institution','department','faculty','acadYear','passMark','condFee','condMed','bandPts','minHours','defHours','rulesetLabel']
      .forEach(k=>{if(m[k]!=null&&m[k]!=='')fresh.meta[k]=m[k];});   // same college, same rules
    const ix=readIdx();ix.push({id,label:'New register'});writeIdx(ix);
    localStorage.setItem(CUR,id);
    try{localStorage.setItem(regKey(id),JSON.stringify(fresh));}catch(err){
      alert('Not enough storage to create another register. Export a backup and delete a finished one first.');return;}
    redrawAll();
    $('courseCode').focus();
  }
  if(e.target.id==='dupReg'){
    if(!S.roster.length){alert('There is no roster to duplicate.');return;}
    if(!confirm(`Create a new register with the same ${S.roster.length} student(s) and the same calendar, `+
      `but no attendance?\n\nThe two registers are independent afterwards — a change in one never affects the other.`))return;
    grabMeta();save();
    const id='r'+Date.now().toString(36);
    const copy=blank();
    copy.meta=Object.assign({},S.meta,{courseCode:'',courseTitle:''});
    copy.roster=S.roster.map(r=>Object.assign({},r));
    copy.days={};Object.keys(S.days).forEach(d=>{const o=S.days[d];
      copy.days[d]={hours:o.hours,on:o.on,done:false,note:o.note||''};});
    const ix=readIdx();ix.push({id,label:'Copy of '+regLabel(S.meta)});writeIdx(ix);
    try{localStorage.setItem(regKey(id),JSON.stringify(copy));}catch(err){
      alert('Not enough storage on this device to duplicate. Export a backup and delete a finished register first.');return;}
    localStorage.setItem(CUR,id);redrawAll();
    $('courseCode').focus();
    alert('New register created. Give it a course code and title — the selector at the top switches between them.');
    return;
  }
  if(e.target.id==='delReg'){
    const ix=readIdx();
    if(ix.length<2){alert('This is the only register. Create another before deleting this one.');return;}
    if(!confirm(`Delete the register "${regLabel(S.meta)}" and every mark in it? Export a backup first — this cannot be undone.`))return;
    localStorage.removeItem(regKey(curId));
    writeIdx(ix.filter(r=>r.id!==curId));
    localStorage.setItem(CUR,readIdx()[0].id);
    redrawAll();
  }
});

/* ---------- tabs ---------- */
$('nav').addEventListener('click',e=>{
  const b=e.target.closest('button[data-t]');if(!b)return;
  [...$('nav').children].forEach(x=>x.setAttribute('aria-selected',x===b));
  document.querySelectorAll('section').forEach(s=>s.classList.toggle('on',s.id==='t-'+b.dataset.t));
  if(b.dataset.t==='grid')drawMatrix();
  if(b.dataset.t==='summary'){drawSummary();drawChecks();}
  if(b.dataset.t==='data'){drawAudit();drawStore();}
  window.scrollTo(0,0);
});

/* ---------- setup ---------- */
$('saveMeta').onclick=()=>{grabMeta();save();drawDays();drawSummary();};
['passMark','condFee','condMed','bandPts','minHours'].forEach(k=>$(k).addEventListener('input',()=>{grabMeta();save();drawSummary();}));
$('genDays').onclick=()=>{
  grabMeta();
  const s=S.meta.startDate,e=S.meta.endDate;
  if(!s||!e||e<s){alert('Enter a valid start and end date.');return;}
  const keep=Object.keys(S.days).length;
  if(keep&&!confirm('Regenerate the calendar? Days you switched off or re-houred will be reset. Marks already entered are kept.'))return;
  const pick=[0,1,2,3,4,5,6].filter(n=>$('dow'+n).checked);
  if(!pick.length){alert('Tick at least one weekday.');return;}
  const H=S.meta.defHours||5,out={};
  let d=new Date(s+'T00:00:00');const end=new Date(e+'T00:00:00');
  while(d<=end){
    const k=iso(d);
    if(pick.includes(d.getDay()))out[k]={hours:H,on:true,done:false,note:''};
    else out[k]={hours:H,on:false,done:false,note:d.getDay()===0?'Sunday':d.getDay()===6?'Saturday':'Not a teaching day'};
    d.setDate(d.getDate()+1);}
  Object.keys(S.days).forEach(k=>{ if(out[k]) out[k]=S.days[k]; });
  S.days=out;save();drawDays();fillJump();
};
function logDay(date,note){S.audit.push({ts:Date.now(),kind:'day',date,note});}
function dayKeys(){return Object.keys(S.days).sort()}
function activeDays(){return dayKeys().filter(d=>S.days[d].on)}
function hasMarks(d){
  const m=S.marks[d];
  return !!m&&Object.keys(m).some(k=>/[PAO]/.test(m[k]||''));
}
function drawCopy(){
  const sel=$('copyFrom');if(!sel)return;
  const others=readIdx().filter(r=>r.id!==curId);
  sel.innerHTML=others.length?others.map(r=>`<option value="${r.id}">${esc(r.label)}</option>`).join('')
                            :'<option value="">No other register</option>';
}
function drawDays(){
  const ks=dayKeys();
  if(!ks.length){$('dayList').innerHTML='<p class="stat">No calendar generated yet.</p>';drawCopy();return;}
  let out='',month='';
  ks.forEach(d=>{
    const x=S.days[d],mk=d.slice(0,7);
    if(mk!==month){month=mk;
      const dt=new Date(d+'T00:00:00');
      out+=`<div class="mhead">${dt.toLocaleString('en-GB',{month:'long'})} ${dt.getFullYear()}</div>`;}
    out+=`<div class="dayrow">`+
      `<span class="dlab ${x.on?'':'off'}">${nice(d)} ${wd(d)}${x.done?' \u2713':''}</span>`+
      `<button class="mini ${x.on?'on':''}" data-tog="${d}">${x.on?'Working':'Holiday'}</button>`+
      `<select class="mini" data-hr="${d}" ${x.on?'':'disabled'}>`+
        [1,2,3,4,5,6,7,8].map(n=>`<option value="${n}" ${n===x.hours?'selected':''}>${n}h</option>`).join('')+
      `</select>`+
      `<input class="dnote" data-note="${d}" value="${esc(x.note||'')}" placeholder="reason / note">`+
      `</div>`;
  });
  $('dayList').innerHTML=out;

  $('dayList').querySelectorAll('[data-tog]').forEach(b=>b.onclick=()=>{
    const d=b.dataset.tog,x=S.days[d];
    if(x.on&&hasMarks(d)&&!confirm(
      `${nice(d)} already has attendance recorded${x.done?' and is marked COMPLETE':''}.\n\n`+
      `Making it a holiday removes all ${x.hours} hour(s) from every student's denominator and every percentage will change. `+
      `The marks stay in storage but stop counting.\n\nThis will be recorded in the correction log. Proceed?`))return;
    const was=x.on;x.on=!x.on;
    if(!x.on)x.done=false;
    if(hasMarks(d)||x.done)logDay(d,`${was?'working \u2192 holiday':'holiday \u2192 working'}${x.note?' ('+x.note+')':''}`);
    save();drawDays();fillJump();drawMatrix();drawSummary();
  });
  $('dayList').querySelectorAll('[data-hr]').forEach(sel=>sel.onchange=()=>{
    const d=sel.dataset.hr,x=S.days[d],n=+sel.value,old=x.hours;
    if(n===old)return;
    if(x.done){
      if(n<old&&!confirm(`${nice(d)} is COMPLETE with ${old} hours recorded. Reducing it to ${n} discards hour(s) ${n+1}\u2013${old} for every student and lowers every denominator.\n\nRecorded in the correction log. Proceed?`)){sel.value=old;return;}
      if(n>old&&!confirm(`${nice(d)} is COMPLETE. Raising it to ${n} hours leaves hour(s) ${old+1}\u2013${n} unentered, so the day reverts to open until you fill them.\n\nProceed?`)){sel.value=old;return;}
      logDay(d,`hours ${old} \u2192 ${n}`);
      if(n>old)x.done=false;
    }
    x.hours=n;save();drawDays();fillJump();drawMatrix();drawSummary();
  });
  $('dayList').querySelectorAll('[data-note]').forEach(inp=>inp.onchange=()=>{
    S.days[inp.dataset.note].note=inp.value.trim();save();
  });
  drawCopy();
}
document.addEventListener('click',e=>{
  const b=e.target.closest('[data-bulk]');
  if(b){
    const k=b.dataset.bulk,ks=dayKeys();let touched=0,risky=[];
    ks.forEach(d=>{const g=new Date(d+'T00:00:00').getDay();
      const want=k==='satOn'?(g===6?true:null):k==='satOff'?(g===6?false:null):(g===0?false:null);
      if(want===null||S.days[d].on===want)return;
      if(!want&&hasMarks(d))risky.push(d);
      touched++;});
    if(!touched){alert('Nothing to change.');return;}
    if(risky.length&&!confirm(`${risky.length} of those date(s) already have attendance recorded: ${risky.map(nice).join(', ')}.\n\nExcluding them removes their hours from every denominator. Proceed?`))return;
    ks.forEach(d=>{const g=new Date(d+'T00:00:00').getDay();
      if(k==='satOn'&&g===6){S.days[d].on=true;S.days[d].note=S.days[d].note||'Special working Saturday';}
      if(k==='satOff'&&g===6){if(S.days[d].on){S.days[d].on=false;S.days[d].done=false;S.days[d].note=S.days[d].note||'Saturday';}}
      if(k==='sunOff'&&g===0){if(S.days[d].on){S.days[d].on=false;S.days[d].done=false;S.days[d].note=S.days[d].note||'Sunday';}}});
    risky.forEach(d=>logDay(d,'excluded by a bulk calendar change'));
    save();drawDays();fillJump();drawMatrix();drawSummary();return;
  }
  if(e.target.id==='addDay'){
    const d=$('addDate').value,n=+$('addHours').value;
    if(!d){alert('Pick a date.');return;}
    if(S.days[d]&&S.days[d].on){alert(nice(d)+' is already a working day.');return;}
    S.days[d]={hours:n,on:true,done:false,note:S.days[d]?'Special working day':'Added outside the generated calendar'};
    save();drawDays();fillJump();drawMatrix();drawSummary();
    $('addDate').value='';
  }
  if(e.target.id==='doCopy'){
    const src=$('copyFrom').value;if(!src){alert('There is no other register to copy from.');return;}
    let other=null;try{other=JSON.parse(localStorage.getItem(regKey(src))||'null');}catch(err){}
    if(!other||!other.days){alert('That register has no calendar.');return;}
    const n=Object.keys(other.days).length;
    if(!confirm(`Replace this register's calendar with a COPY of ${n} date(s) from the other register?\n\nIt is a one-time copy, not a link — later changes in either register do not affect the other. Marks already entered here are kept but any date not in the copied calendar stops counting.`))return;
    S.days={};Object.keys(other.days).forEach(d=>{const o=other.days[d];
      S.days[d]={hours:o.hours,on:o.on,done:false,note:o.note||''};});   // completion never copies
    save();drawDays();fillJump();drawMatrix();drawSummary();
  }
});
/* ---------- roster ---------- */
$('impRoster').onclick=()=>{
  const useReg=$('hasRegNo').value==='1';
  const lines=$('rosterText').value.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
  if(!lines.length){alert('Paste at least one student.');return;}
  const next=[],seen=new Set();
  for(let i=0;i<lines.length;i++){
    const parts=lines[i].split(/[\t,]/);
    let roll,regno='',name;
    if(useReg){
      if(parts.length<3){alert('Line '+(i+1)+' needs "roll, register number, name".');return;}
      roll=parts.shift().trim();regno=parts.shift().trim();name=parts.join(',').trim();
    }else if(parts.length>=2){roll=parts.shift().trim();name=parts.join(',').trim();}
    else{roll=String(i+1);name=lines[i];}
    if(!roll||!name){alert('Line '+(i+1)+' is not "roll, name".');return;}
    if(seen.has(roll)){alert('Duplicate roll number: '+roll);return;}
    seen.add(roll);
    let old=S.roster.find(r=>r.roll===roll);
    let renamed=null;
    if(!old){                                       // same person, corrected roll number?
      const byName=S.roster.filter(r=>r.name.toLowerCase().replace(/[^a-z0-9]/g,'')===name.toLowerCase().replace(/[^a-z0-9]/g,''));
      if(byName.length===1&&!seen.has(byName[0].roll)&&!lines.some((l,j)=>j!==i&&l.split(/[\t,]/)[0].trim()===byName[0].roll)){
        old=byName[0];renamed=old.roll;}
    }
    next.push({sid:old?old.sid:newSid(),roll,regno:regno||(old?old.regno:'')||'',name,from:old?old.from:null,to:old?old.to:null,_was:renamed});
  }
  // guard against silently orphaning attendance when a roll changes
  const moved=next.filter(r=>r._was);
  if(moved.length&&!confirm(
     `${moved.length} roll number(s) changed but the name matches an existing student, so their attendance history will follow them:\n\n`+
     moved.map(r=>`  ${r._was} → ${r.roll}  ${r.name}`).join('\n')+
     `\n\nIs that correct?`))return;
  const held=new Set();
  Object.values(S.marks).forEach(day=>Object.keys(day).forEach(k=>held.add(k)));
  const keep=new Set(next.map(r=>r.sid));
  const orphan=S.roster.filter(r=>held.has(r.sid)&&!keep.has(r.sid));
  if(orphan.length&&!confirm(
     `${orphan.length} student(s) with attendance already recorded are not in the new list:\n\n`+
     orphan.slice(0,8).map(r=>`  ${r.roll}  ${r.name}`).join('\n')+(orphan.length>8?'\n  …':'')+
     `\n\nTheir marks stay in storage but stop counting and stop being visible. Continue?`))return;
  moved.forEach(r=>S.audit.push({ts:Date.now(),kind:'day',date:today(),note:`roll ${r._was} → ${r.roll} for ${r.name}; attendance history carried over`}));
  next.forEach(r=>delete r._was);
  S.roster=next;S.schema=2;save();drawRoster();drawMatrix();
};
/* ---------- upload an existing name list ---------- */
function parseDelim(text){
  const rows=[];let row=[],f='',q=false;
  for(let i=0;i<text.length;i++){
    const ch=text[i];
    if(q){ if(ch==='"'){ if(text[i+1]==='"'){f+='"';i++;} else q=false; } else f+=ch; }
    else if(ch==='"')q=true;
    else if(ch===','||ch==='\t'){row.push(f);f='';}
    else if(ch==='\n'){row.push(f);f='';rows.push(row);row=[];}
    else if(ch!=='\r')f+=ch;
  }
  row.push(f);rows.push(row);
  return rows.map(r=>r.map(x=>x.trim())).filter(r=>r.some(Boolean));
}
async function unzip(buf){
  const dv=new DataView(buf),u8=new Uint8Array(buf);
  let eocd=-1;
  for(let i=u8.length-22;i>=0&&i>u8.length-66000;i--)if(dv.getUint32(i,true)===0x06054b50){eocd=i;break;}
  if(eocd<0)throw new Error('not a zip archive');
  const n=dv.getUint16(eocd+10,true);let p=dv.getUint32(eocd+16,true);
  const out={};
  for(let k=0;k<n;k++){
    const method=dv.getUint16(p+10,true),csize=dv.getUint32(p+20,true);
    const nl=dv.getUint16(p+28,true),el=dv.getUint16(p+30,true),cl=dv.getUint16(p+32,true);
    const lho=dv.getUint32(p+42,true);
    const name=new TextDecoder().decode(u8.subarray(p+46,p+46+nl));
    const lnl=dv.getUint16(lho+26,true),lel=dv.getUint16(lho+28,true);
    const st=lho+30+lnl+lel;
    out[name]={method,data:u8.subarray(st,st+csize)};
    p+=46+nl+el+cl;
  }
  return out;
}
async function entryText(e){
  if(e.method===0)return new TextDecoder().decode(e.data);
  if(typeof DecompressionStream!=='function')
    throw new Error('this browser cannot unpack .xlsx — save the sheet as CSV instead');
  const st=new Blob([e.data]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
  return new TextDecoder().decode(await new Response(st).arrayBuffer());
}
const colIdx=r=>{let n=0;for(const ch of r.replace(/[0-9]/g,''))n=n*26+(ch.charCodeAt(0)-64);return n-1;};
async function parseXlsx(buf){
  const z=await unzip(buf);
  const shared=[];
  if(z['xl/sharedStrings.xml']){
    const doc=new DOMParser().parseFromString(await entryText(z['xl/sharedStrings.xml']),'application/xml');
    doc.querySelectorAll('si').forEach(si=>shared.push([...si.querySelectorAll('t')].map(t=>t.textContent).join('')));
  }
  const sheet=Object.keys(z).filter(k=>/^xl\/worksheets\/sheet\d+\.xml$/.test(k)).sort()[0];
  if(!sheet)throw new Error('no worksheet found in that file');
  const doc=new DOMParser().parseFromString(await entryText(z[sheet]),'application/xml');
  const rows=[];
  doc.querySelectorAll('row').forEach(r=>{
    const out=[];
    r.querySelectorAll('c').forEach(c=>{
      const i=colIdx(c.getAttribute('r')||'A1'),t=c.getAttribute('t');
      let v='';
      if(t==='s')v=shared[+(c.querySelector('v')?.textContent||0)]||'';
      else if(t==='inlineStr')v=[...c.querySelectorAll('t')].map(x=>x.textContent).join('');
      else v=c.querySelector('v')?.textContent||'';
      out[i]=String(v).trim();
    });
    for(let i=0;i<out.length;i++)if(out[i]==null)out[i]='';
    if(out.some(Boolean))rows.push(out);
  });
  return rows;
}
async function parseDocx(buf){
  const z=await unzip(buf);
  const part=z['word/document.xml'];
  if(!part)throw new Error('no document body found — if this is an old .doc, open it in Word and save as .docx');
  const doc=new DOMParser().parseFromString(await entryText(part),'application/xml');
  const kids=(el,nm)=>[...el.childNodes].filter(n=>n.nodeType===1&&n.localName===nm);
  const textOf=el=>[...el.getElementsByTagName('*')]
    .filter(n=>n.localName==='t').map(n=>n.textContent).join('').replace(/\s+/g,' ').trim();
  const all=[...doc.getElementsByTagName('*')];
  let rows=[];

  const trs=all.filter(n=>n.localName==='tr');
  if(trs.length){
    trs.forEach(tr=>{
      const cells=kids(tr,'tc').map(textOf);
      if(cells.some(Boolean))rows.push(cells);
    });
  }
  if(!rows.length){                                   // no table: take the paragraphs
    all.filter(n=>n.localName==='p').forEach(pa=>{
      const t=textOf(pa);if(t)rows.push([t]);});
  }
  // a typed list often arrives as "1. Abishek J.B" in one column — split it
  if(rows.length&&Math.max(...rows.map(r=>r.length))===1){
    const re=/^\s*(\d{1,3})\s*[).\.\-:]?\s+(.{2,})$/;
    const hit=rows.filter(r=>re.test(r[0])).length;
    if(hit>rows.length*0.6)
      rows=rows.map(r=>{const m=re.exec(r[0]);return m?[m[1],m[2].trim()]:['',r[0]];});
    else
      rows=rows.map(r=>{const parts=r[0].split(/\t|\s{2,}/).map(x=>x.trim()).filter(Boolean);
        return parts.length>1?parts:r;});
  }
  if(!rows.length)throw new Error('the document contains no text rows');
  return rows;
}
let up=null;
$('listFile').onchange=async e=>{
  const f=e.target.files[0];if(!f)return;
  $('mapPane').innerHTML='<p class="stat">Reading…</p>';
  try{
    let rows;
    if(/\.xlsx$/i.test(f.name))rows=await parseXlsx(await f.arrayBuffer());
    else if(/\.docx$/i.test(f.name))rows=await parseDocx(await f.arrayBuffer());
    else if(/\.docx?$/i.test(f.name))throw new Error('old .doc files cannot be read — open it in Word and save as .docx');
    else rows=parseDelim(await f.text());
    if(!rows.length)throw new Error('the file has no rows');
    const wide=Math.max(...rows.map(r=>r.length));
    rows=rows.map(r=>{const c=r.slice();while(c.length<wide)c.push('');return c;});
    up={rows,wide};
    drawMap();
  }catch(err){
    $('mapPane').innerHTML=`<p class="stat"><span class="flag">Could not read that file: ${esc(err.message)}</span></p>`;
  }
  e.target.value='';
};
function guessCols(rows,wide,hasHead){
  const head=hasHead?rows[0].map(x=>x.toLowerCase()):[];
  const body=rows.slice(hasHead?1:0);
  const find=re=>head.findIndex(h=>re.test(h));
  let roll=find(/roll|s\.?\s*no|serial|sl/),reg=find(/reg/),name=find(/name|student/);
  const score=i=>body.reduce((a,r)=>a+((r[i]||'').length),0)/Math.max(1,body.length);
  if(name<0){let b=0,bi=0;for(let i=0;i<wide;i++){const v=score(i);if(v>b){b=v;bi=i;}}name=bi;}
  if(roll<0){for(let i=0;i<wide;i++){if(i===name)continue;
    if(body.filter(r=>/^\d{1,3}$/.test(r[i]||'')).length>body.length*0.7){roll=i;break;}}}
  if(roll<0)roll=-1;
  return{roll,reg,name};
}
function drawMap(){
  if(!up)return;
  const hasHead=$('upHead')?$('upHead').checked:/[a-z]/i.test((up.rows[0]||[]).join('')) && !/^\d+$/.test((up.rows[0]||[])[0]||'');
  const g=guessCols(up.rows,up.wide,hasHead);
  const cur=id=>$(id)?+$(id).value:null;
  const roll=cur('mRoll')??g.roll, reg=cur('mReg')??g.reg, name=cur('mName')??g.name;
  const opts=(sel,none)=>(none?`<option value="-1" ${sel<0?'selected':''}>— none —</option>`:'')+
    Array.from({length:up.wide},(_,i)=>`<option value="${i}" ${i===sel?'selected':''}>Column ${String.fromCharCode(65+i)}</option>`).join('');
  const body=up.rows.slice(hasHead?1:0);
  const prev=body.slice(0,4).map((r,i)=>`<tr><td>${roll>=0?esc(r[roll]||''):i+1}</td>`+
    `<td>${reg>=0?esc(r[reg]||''):''}</td><td>${esc(r[name]||'')}</td></tr>`).join('');
  const blanks=body.filter(r=>!(r[name]||'').trim()).length;
  const rolls=roll>=0?body.map(r=>(r[roll]||'').trim()):body.map((_,i)=>String(i+1));
  const dup=rolls.filter((v,i)=>v&&rolls.indexOf(v)!==i);
  $('mapPane').innerHTML=
    `<div class="acts" style="margin:12px 0 8px"><label class="dow"><input type="checkbox" id="upHead" ${hasHead?'checked':''}>First row is a header</label></div>`+
    `<div class="row">`+
      `<div><label>Roll number</label><select id="mRoll">${opts(roll,true)}</select></div>`+
      `<div><label>Register number</label><select id="mReg">${opts(reg,true)}</select></div>`+
      `<div><label>Name</label><select id="mName">${opts(name,false)}</select></div>`+
    `</div>`+
    `<table class="s"><thead><tr><th>Roll</th><th>Reg. No</th><th>Name</th></tr></thead><tbody>${prev}</tbody></table>`+
    `<p class="stat"><b>${body.length}</b> row(s) found`+
      (blanks?` · <span class="flag">${blanks} with no name</span>`:'')+
      (dup.length?` · <span class="flag">duplicate roll(s): ${esc([...new Set(dup)].slice(0,6).join(', '))}</span>`:'')+
      (roll<0?' · roll numbers will be generated 1, 2, 3…':'')+`</p>`+
    `<div class="acts"><button class="btn" id="useList">Use this list</button>`+
    `<button class="btn g" id="dropList">Cancel</button></div>`;
  ['upHead','mRoll','mReg','mName'].forEach(id=>{const el=$(id);if(el)el.onchange=drawMap;});
}
document.addEventListener('click',e=>{
  if(e.target.id==='dropList'){up=null;$('mapPane').innerHTML='';return;}
  if(e.target.id!=='useList'||!up)return;
  const hasHead=$('upHead').checked,roll=+$('mRoll').value,reg=+$('mReg').value,name=+$('mName').value;
  const body=up.rows.slice(hasHead?1:0);
  const lines=body.map((r,i)=>{
    const rl=roll>=0?(r[roll]||'').trim()||String(i+1):String(i+1);
    const nm=(r[name]||'').trim();
    return reg>=0?`${rl}, ${(r[reg]||'').trim()}, ${nm}`:`${rl}, ${nm}`;
  });
  $('hasRegNo').value=reg>=0?'1':'0';
    $('rosterText').value=lines.join('\n');
  up=null;$('mapPane').innerHTML='';
  $('rosterStat').innerHTML=`<b>${lines.length}</b> row(s) loaded from the file. Check them, then press <b>Import / update roster</b> to commit.`;
  $('rosterText').scrollIntoView({block:'center'});
});

/* ---------- row-by-row name entry ---------- */
const undoStack=[];
function pushUndo(date,label){
  undoStack.push({date,label,marks:JSON.parse(JSON.stringify(S.marks[date]||{})),done:!!(S.days[date]&&S.days[date].done)});
  if(undoStack.length>12)undoStack.shift();
  const b=$('undoBtn');if(b){b.disabled=false;b.textContent='Undo '+label;}
}
function doUndo(){
  const u=undoStack.pop();if(!u)return;
  S.marks[u.date]=u.marks;
  if(S.days[u.date])S.days[u.date].done=u.done;
  save();drawMatrix();drawSummary();
  const b=$('undoBtn');
  if(b){const n=undoStack[undoStack.length-1];b.disabled=!n;b.textContent=n?('Undo '+n.label):'Undo';}
}
function drawRoster(){
  $('rosterStat').innerHTML=S.roster.length?`<b>${S.roster.length}</b> students, in register order.`:'No roster yet.';
  if(!S.roster.length){$('rosterTable').innerHTML='';return;}
  $('rosterTable').innerHTML='<table class="s"><thead><tr><th>Roll</th><th>Reg. No</th><th>Name</th><th>Counts from</th><th>Counts until</th></tr></thead><tbody>'+
    S.roster.map((r,i)=>`<tr class="${r.to?'gone':''}" style="${(r.from||r.to)?'background:rgba(138,106,31,.10)':''}"><td>${esc(r.roll)}</td>`+
      `<td><input data-i="${i}" data-f="regno" value="${esc(r.regno||'')}" placeholder="—" style="padding:4px 6px;font-size:13px"></td>`+
      `<td>${esc(r.name)}</td>`+
      `<td><input type="date" data-i="${i}" data-f="from" value="${r.from||''}"></td>`+
      `<td><input type="date" data-i="${i}" data-f="to" value="${r.to||''}"></td></tr>`).join('')+'</tbody></table>';
  $('rosterTable').querySelectorAll('input').forEach(inp=>inp.onchange=()=>{
    const f=inp.dataset.f;S.roster[+inp.dataset.i][f]=f==='regno'?inp.value.trim():(inp.value||null);save();drawRoster();drawSummary();drawMatrix();
  });
}
const inRoll=(r,d)=>(!r.from||d>=r.from)&&(!r.to||d<=r.to);

/* ---------- marks ---------- */
function cell(date,roll,h){const s=(S.marks[date]||{})[roll];return s?s[h]||'-':'-';}
function setCell(date,roll,h,v,logged){
  const day=S.marks[date]||(S.marks[date]={});
  const n=S.days[date].hours;
  let s=day[roll]||'-'.repeat(n);
  if(s.length<n)s=s.padEnd(n,'-');
  const old=s[h];if(old===v)return;
  day[roll]=s.slice(0,h)+v+s.slice(h+1);
  if(logged&&S.days[date].done)
    S.audit.push({ts:Date.now(),kind:'cell',sid:roll,date,hour:h+1,from:old,to:v});
}

/* ---------- semester matrix ---------- */
['winSize','dayFilter'].forEach(k=>$(k).onchange=()=>{win=0;drawMatrix();});
function visibleDays(){
  const A=activeDays();
  return $('dayFilter').value==='pending'?A.filter(d=>!S.days[d].done):A;
}
function winN(){
  const v=+$('winSize').value;
  return v===0?Math.max(1,visibleDays().length):v;
}
$('prevW').onclick=()=>{win=Math.max(0,win-1);drawMatrix();};
$('undoBtn').onclick=doUndo;
$('todayBtn').onclick=()=>{
  const A=visibleDays();
  if(!A.length){alert('No working days to show. Check the calendar and the filter.');return;}
  const t=iso(new Date());
  let i=A.findIndex(d=>d>=t);
  if(i<0)i=A.length-1;
  win=Math.floor(i/winN());drawMatrix();
  const hit=A[i];
  $('gridStat').innerHTML=(hit===t?'Showing <b>today</b>.':`Today is not a working day — showing the next one, <b>${nice(hit)}</b>.`)+
    ' '+$('gridStat').innerHTML;
};
$('nextW').onclick=()=>{const A=visibleDays(),n=winN();win=Math.min(Math.max(0,Math.ceil(A.length/n)-1),win+1);drawMatrix();};
function fillJump(){
  const A=visibleDays(),n=winN(),pages=Math.ceil(A.length/n);
  $('jumpTo').innerHTML=Array.from({length:pages},(_,i)=>
    `<option value="${i}">${nice(A[i*n])} → ${nice(A[Math.min(A.length-1,i*n+n-1)])}</option>`).join('');
  $('jumpTo').value=win;
}
$('jumpTo').onchange=()=>{win=+$('jumpTo').value;drawMatrix();};

function dayState(d,sid){
  const n=S.days[d].hours;let p=0,a=0,o=0,bl=0;
  for(let i=0;i<n;i++){const v=cell(d,sid,i);
    if(v==='P')p++;else if(v==='A')a++;else if(v==='O')o++;else bl++;}
  if(bl===n)return{k:'-',t:''};
  if(p===n)return{k:'P',t:'\u2713'};
  if(o===n)return{k:'O',t:'OD'};
  if(a===n)return{k:'A',t:'A'};
  return{k:'M',t:(p+o)+'/'+n};
}
function setDay(d,sid,v){for(let i=0;i<S.days[d].hours;i++)setCell(d,sid,i,v,true);}

function drawMatrix(){
  const A=visibleDays(),n=winN(),hidden=activeDays().length-A.length;
  if(!S.roster.length||!activeDays().length){
    $('matrix').innerHTML='';
    $('gridStat').innerHTML='<span class="flag">Add a roster and generate the calendar first.</span>';return;
  }
  if(!A.length){
    $('matrix').innerHTML='';$('winLabel').innerHTML='';
    $('gridStat').innerHTML=`<span class="ok">Every working day is entered and complete.</span> `+
      `All ${hidden} day(s) are hidden — switch the filter to <b>All days</b> to review or correct them.`;return;
  }
  const pages=Math.ceil(A.length/n);win=Math.min(win,pages-1);
  const slice=A.slice(win*n,win*n+n);
  $('winLabel').innerHTML=`<b>${nice(slice[0])}</b> to <b>${nice(slice[slice.length-1])}</b> \u00b7 page ${win+1} of ${pages} \u00b7 ${A.length} working days`;
  fillJump();

  let h='<thead><tr><th class="nm">Student</th>';
  slice.forEach(d=>{
    const x=S.days[d];
    h+=`<th class="dayhd"><span>${nice(d)} ${wd(d)}</span>`+
       `<small>${x.done?'<span style="color:var(--stamp)">complete</span>':x.hours+'h open'}</small>`+
       `<button class="mini" data-allp="${d}">All P</button>`+
       `<button class="mini" data-clear="${d}">Clear</button>`+
       `<button class="mini ${x.done?'on':''}" data-done="${d}">${x.done?'Reopen':'Complete'}</button></th>`;
  });
  h+='<th>%</th></tr></thead><tbody>';

  const T=totals();
  S.roster.forEach((r,ri)=>{
    h+=`<tr><td class="nm" title="${esc(r.roll)} ${esc(r.name)}">`+
       `<span class="nmi">${esc(r.roll)} ${esc(r.name)}</span>`+
       `${r.regno?`<span class="rn">${esc(r.regno)}</span>`:''}</td>`;
    slice.forEach(d=>{
      if(!inRoll(r,d)){
        const why=r.from&&d<r.from?`joins ${nice(r.from)}`:r.to?`left after ${nice(r.to)}`:'not enrolled';
        h+=`<td class="dayhd"><button class="c D x" disabled title="${esc(r.name)} \u2014 ${why}">\u00b7</button></td>`;
        return;}
      const st=dayState(d,r.sid);
      h+=`<td class="dayhd"><button class="c D ${st.k==='-'?'':st.k}" data-day="${d}" data-r="${r.sid}" `+
         `title="${nice(d)} \u00b7 ${S.days[d].hours}h">${st.t}</button></td>`;
    });
    const t=T[ri],pct=t.h?100*t.p/t.h:null;
    h+=`<td><b>${pct===null?'\u2014':pct.toFixed(0)}</b></td></tr>`;
  });
  $('matrix').innerHTML=h+'</tbody>';

  let open=0,blank=0,part=0;
  const locked=new Map();
  slice.forEach(d=>{ if(!S.days[d].done)open++;
    S.roster.forEach(r=>{
      if(!inRoll(r,d)){
        if(!locked.has(r.sid))locked.set(r.sid,r);
        return;}
      const st=dayState(d,r.sid);
      if(st.k==='M')part++; else if(st.k==='-')blank++; }); });
  $('gridStat').innerHTML=`On this page: <b>${open}</b> day(s) still open, <b>${blank}</b> student-day(s) not entered`+
    (part?`, <b class="warn">${part}</b> part-day(s) held over from hour-level entry`:'')+
    `. Nothing on an open day affects any percentage.`+
    (hidden?` <b>${hidden}</b> completed day(s) hidden.`:'')+
    (locked.size?`<br><span class="warn">${locked.size} student(s) cannot be marked on some of these dates</span> because of their enrolment dates: `+
      [...locked.values()].slice(0,6).map(r=>`${esc(r.roll)} ${esc(r.name)} (${r.from?'from '+nice(r.from):''}${r.from&&r.to?', ':''}${r.to?'until '+nice(r.to):''})`).join('; ')+
      (locked.size>6?' …':'')+`. Clear those dates in the Roster tab if they were set by mistake.`:'');
}

/* one delegated listener for the whole matrix */
$('matrix').addEventListener('click',e=>{
  const c=e.target.closest('button');if(!c)return;

  if(c.dataset.day!==undefined&&c.dataset.r!==undefined){
    const d=c.dataset.day,sid=c.dataset.r,st=dayState(d,sid);
    if(S.days[d].done&&!confirm(`${nice(d)} is marked complete. Change it anyway? The correction will be logged.`))return;
    if(st.k==='M'&&!confirm(`This day was recorded hour by hour (${st.t} hours attended).\n\nSetting it as a whole day present replaces that detail. Proceed?`))return;
    const nextv = st.k==='-'?'P' : st.k==='P'?'A' : st.k==='A'?'O' : st.k==='O'?(S.days[d].done?'P':'-') : 'P';
    pushUndo(d,'cell');
    setDay(d,sid,nextv);
    const r=S.roster.find(x=>x.sid===sid);
    badge((r?r.name.split(' ')[0]+' \u2014 ':'')+
      (nextv==='P'?'present':nextv==='A'?'absent':nextv==='O'?'on duty':'cleared'),false);
    save();drawMatrix();return;
  }

  if(c.dataset.clear){
    const d=c.dataset.clear,x=S.days[d];
    let n=0;
    S.roster.forEach(r=>{if(inRoll(r,d)&&dayState(d,r.sid).k!=='-')n++;});
    if(!n){alert(nice(d)+' has nothing entered.');return;}
    if(!confirm(`Clear every mark on ${nice(d)}?\n\n${n} student-day(s) go back to not entered`+
      (x.done?', and the day is reopened so it stops counting in every percentage':'')+
      `.\n\nUndo is available immediately afterwards.`))return;
    pushUndo(d,'clear '+nice(d));
    delete S.marks[d];
    if(x.done){x.done=false;S.audit.push({ts:Date.now(),kind:'autofill',date:d,
      note:`completed day cleared — ${n} student-day(s) erased and the day reopened`});}
    save();drawMatrix();drawSummary();return;
  }
  if(c.dataset.allp){
    const d=c.dataset.allp;
    if(S.days[d].done){alert('That day is complete. Reopen it first.');return;}
    pushUndo(d,'All P');
    S.roster.forEach(r=>{if(!inRoll(r,d))return;
      for(let i=0;i<S.days[d].hours;i++)setCell(d,r.sid,i,'P',false);});
    save();drawMatrix();return;
  }

  if(c.dataset.done){
    const d=c.dataset.done,x=S.days[d];
    if(x.done){
      if(!confirm(`Reopen ${nice(d)} for correction? Edits from now on are logged.`))return;
      pushUndo(d,'reopen');
      x.done=false;
    }else{
      let blanks=0;
      S.roster.forEach(r=>{if(!inRoll(r,d))return;if(dayState(d,r.sid).k==='-')blanks++;});
      if(blanks&&!confirm(`${blanks} student(s) on ${nice(d)} have nothing entered.\n\nCompleting the day records them ABSENT for all ${x.hours} hour(s) and puts the day into everyone's percentage.\n\nProceed?`))return;
      pushUndo(d,'complete');
      const filled=[];
      S.roster.forEach(r=>{if(!inRoll(r,d))return;
        for(let i=0;i<x.hours;i++)if(cell(d,r.sid,i)==='-'){setCell(d,r.sid,i,'A',false);}
        if(dayState(d,r.sid).k==='A')filled.push(r.roll);});
      if(blanks)S.audit.push({ts:Date.now(),kind:'autofill',date:d,note:`${blanks} student(s) with nothing entered recorded as absent on completion`,cells:filled});
      x.done=true;
    }
    save();drawMatrix();return;
  }
});

/* ---------- totals ---------- */
function totals(){
  const out=S.roster.map(()=>({p:0,od:0,a:0,h:0,eq:0}));
  activeDays().forEach(d=>{
    if(!S.days[d].done)return;                 // open days never count
    const n=S.days[d].hours;
    S.roster.forEach((r,i)=>{
      if(!inRoll(r,d))return;
      for(let k=0;k<n;k++){
        const v=cell(d,r.sid,k);
        if(v==='-')continue;                   // defensive: completed days have none
        out[i].h++;
        if(v==='P'){out[i].p++;out[i].eq+=1/n;}
        else if(v==='O'){out[i].p++;out[i].od++;out[i].eq+=1/n;}
        else out[i].a++;
      }
    });
  });
  return out;
}
function standing(pct){
  const m=S.meta;
  let cat,label,cls;
  if(pct>=m.passMark)     {cat='elig';label='Eligible';cls='ok';}
  else if(pct>=m.condFee) {cat='fee'; label='Condonation \u2014 fee';cls='warn';}
  else if(pct>=m.condMed) {cat='med'; label='Condonation \u2014 fee + medical certificate';cls='warn';}
  else                    {cat='rep'; label='Repeat course';cls='flag';}
  // the band is a prompt to check the paper register, never a classification of its own
  const near=Math.abs(pct-m.passMark)<=m.bandPts;
  return {cat,label,cls,near};
}
const standingText=(t,m)=>{
  if(t.h<m.minHours)return 'Too few hours';
  const r=standing(100*t.p/t.h);
  return r.label+(r.near?' \u00b7 verify against register':'');
};
function forecast(t){
  const m=S.meta,pass=m.passMark;
  if(!t.h)return'';
  const pct=100*t.p/t.h;
  if(pct>=pass){
    const y=Math.floor((100*t.p-pass*t.h)/pass);
    return y>0?`may miss ${y}`:'no margin';
  }
  if(pass>=100)return'cannot recover';
  const x=Math.ceil((pass*t.h-100*t.p)/(100-pass));
  return `attend next ${x}`;
}

/* ---------- summary ---------- */
function enrolNote(r){
  if(!r.from&&!r.to)return '';
  const a=r.from?'from '+nice(r.from):'';
  const b=r.to?'until '+nice(r.to):'';
  return `<span class="warn">${a}${a&&b?', ':''}${b}</span>`;
}
function drawSummary(){
  if(!S.roster.length){$('sumTable').innerHTML='<p class="stat">No roster.</p>';$('sumStats').innerHTML='';return;}
  const A=activeDays(),done=A.filter(d=>S.days[d].done);
  const doneHrs=done.reduce((x,d)=>x+S.days[d].hours,0);
  const planHrs=A.reduce((x,d)=>x+S.days[d].hours,0);
  $('sumStats').innerHTML=`<b>${esc(regLabel(S.meta))}</b>`+
    (S.meta.rulesetLabel?` \u00b7 scored under <b>${esc(S.meta.rulesetLabel)}</b>`
                        :' \u00b7 <span class="warn">no regulation recorded</span>')+
    `<br>Working days <b>${A.length}</b> \u00b7 completed <b>${done.length}</b> \u00b7 `+
    `hours counted <b>${doneHrs}</b> of <b>${planHrs}</b> planned \u00b7 students <b>${S.roster.length}</b>`;

  const T=totals(),m=S.meta;
  const filt=$('sumFilter')?$('sumFilter').value:'all';
  const tally={elig:0,fee:0,med:0,rep:0,band:0,thin:0};
  let shown=0;
  let h='<table class="s"><thead><tr><th>Roll</th><th>Reg. No</th><th>Name</th><th>Enrolled</th>'+
        '<th class="n">Present</th><th class="n">OD</th><th class="n">Absent</th>'+
        '<th class="n">Counted</th><th class="n">Eq. days</th><th class="n">%</th>'+
        '<th>Standing</th><th>Forecast</th></tr></thead><tbody>';

  S.roster.forEach((r,i)=>{
    const t=T[i];
    let pct=null,label,cls,rowCls='',cat,near=false;
    if(t.h<m.minHours){ cat='thin'; label='Too few hours yet'; cls='warn'; }
    else{
      pct=100*t.p/t.h;
      const r0=standing(pct);
      label=r0.label; cls=r0.cls; cat=r0.cat; near=r0.near;
      rowCls = near?'band':'';
      if(near)label+=' <span class="flag">\u00b7 verify</span>';
    }
    tally[cat]++; if(near)tally.band++;
    if(filt==='band'){ if(!near)return; }
    else if(filt!=='all'&&filt!==cat)return;
    shown++;
    let st=`<span class="${cls}">${label}</span>`;
    if(t.u)st+=` <span class="flag">\u00b7 ${t.u} unread</span>`;
    h+=`<tr class="${rowCls} ${r.to?'gone':''}">`+
       `<td>${esc(r.roll)}</td><td>${esc(r.regno||'')}</td><td>${esc(r.name)}</td>`+
       `<td>${enrolNote(r)||'<span style="color:var(--soft)">full term</span>'}</td>`+
       `<td class="n">${t.p-t.od}</td><td class="n">${t.od||''}</td><td class="n">${t.a}</td>`+
       `<td class="n">${t.h}</td><td class="n">${t.eq.toFixed(1)}</td>`+
       `<td class="n"><b>${pct===null?'\u2014':pct.toFixed(2)}</b></td>`+
       `<td>${st}</td><td class="stat" style="margin:0">${esc(forecast(t))}</td></tr>`;
  });

  $('sumTable').innerHTML=h+'</tbody></table>'+
    (shown?'':'<p class="stat">No student is in that category.</p>')+
    `<p class="stat">Eligible <b>${tally.elig}</b> \u00b7 condonation (fee) <b>${tally.fee}</b> \u00b7 `+
    `condonation (fee + medical) <b>${tally.med}</b> \u00b7 repeat <b>${tally.rep}</b> \u00b7 `+
    `<b class="flag">${tally.band}</b> within ${m.bandPts} points of ${m.passMark}% \u2014 check these against the paper `+
    `register before any decision \u00b7 <b>${tally.thin}</b> with too few hours to judge.<br>`+
    `Forecast assumes every remaining hour is attended; it is a projection, not an entitlement.</p>`;
}

function drawAttention(){
  const host=$('attnBox');if(!host)return;
  const done=activeDays().filter(d=>S.days[d].done);
  if(!done.length){host.innerHTML='<p class="stat">No completed day yet.</p>';return;}
  const last=done[done.length-1];
  const absent=S.roster.filter(r=>inRoll(r,last)&&dayState(last,r.sid).k==='A');
  const runs=[];
  S.roster.forEach(r=>{
    let n=0;
    for(let i=done.length-1;i>=0;i--){
      const d=done[i];
      if(!inRoll(r,d))continue;
      if(dayState(d,r.sid).k==='A')n++; else break;
    }
    if(n>=3)runs.push({r,n});
  });
  runs.sort((x,y)=>y.n-x.n);
  host.innerHTML=
    `<p class="stat">Absent on the last completed day (<b>${nice(last)}</b>): `+
    (absent.length?`<b>${absent.length}</b> \u2014 ${absent.map(r=>esc(r.roll)+' '+esc(r.name)).join(', ')}`
                  :'<span class="ok">nobody</span>')+'</p>'+
    (runs.length
      ? '<table class="s"><thead><tr><th>Roll</th><th>Name</th><th class="n">Consecutive days absent</th></tr></thead><tbody>'+
        runs.map(x=>`<tr class="band"><td>${esc(x.r.roll)}</td><td>${esc(x.r.name)}</td><td class="n"><b>${x.n}</b></td></tr>`).join('')+
        '</tbody></table><p class="stat">Three or more completed days in a row. Worth a word before it becomes a shortage case.</p>'
      : '<p class="stat"><span class="ok">Nobody has missed three or more completed days in a row.</span></p>');
}

function drawChecks(){
  const L=[],add=(ok,t)=>L.push(`<li class="${ok?'p':'f'}">${t}</li>`);
  const A=activeDays();
  if(!S.roster.length||!A.length){$('checks').innerHTML='<li class="f">Set up the calendar and roster first.</li>';$('gapBox').innerHTML='';return;}
  const open=A.filter(d=>!S.days[d].done);
  add(!open.length,open.length?`${open.length} working day(s) are still open and excluded from every percentage.`
                              :'Every working day is complete.');
  const T=totals(),hs=[...new Set(S.roster.map((r,i)=>(!r.from&&!r.to)?T[i].h:null).filter(v=>v!==null))];
  add(hs.length<=1,hs.length<=1?'All continuously enrolled students share one denominator.'
    :`Continuously enrolled students have ${hs.length} different denominators (${hs.sort((a,b)=>a-b).join(', ')}). Something was entered twice or half-entered.`);
  const maxH=Math.max(0,...T.map(t=>t.h));
  add(maxH>=S.meta.minHours,maxH>=S.meta.minHours?`Largest denominator is ${maxH} hours.`
    :`Largest denominator is only ${maxH} hours — percentages stay hidden below ${S.meta.minHours}.`);
  let ragged=[];
  A.filter(d=>S.days[d].done).forEach(d=>{
    const n=S.days[d].hours;
    const bad=S.roster.some(r=>inRoll(r,d)&&(()=>{for(let k=0;k<n;k++)if(cell(d,r.sid,k)==='-')return true;return false;})());
    if(bad)ragged.push(d);
  });
  add(!ragged.length,ragged.length
    ?`${ragged.length} day(s) are marked complete but contain unentered hours — the day length was changed after completion: ${ragged.map(nice).join(', ')}`
    :'Every completed day is fully entered.');
  const late=S.roster.filter(r=>r.from||r.to);
  if(late.length)L.push(`<li class="p">${late.length} student(s) have a shorter enrolment period, so their denominators are `+
    `correctly smaller: ${late.slice(0,5).map(r=>esc(r.roll)+' '+esc(r.name)+' ('+(r.from?'from '+nice(r.from):'')+(r.from&&r.to?', ':'')+(r.to?'until '+nice(r.to):'')+')').join('; ')}`+
    `${late.length>5?' …':''}</li>`);
  const noMark=S.roster.filter((r,i)=>T[i].h===0).length;
  add(!noMark,noMark?`${noMark} student(s) have no counted hours at all. Check their start dates.`:'Every student has counted hours.');
  $('checks').innerHTML=L.join('');
  drawAttention();
  $('gapBox').innerHTML=open.length
    ?`<div class="note">Open days: ${open.map(nice).join(', ')}</div>`:'<div class="note good">No open days.</div>';
}

/* ---------- audit ---------- */
function drawStore(){
  const host=$('storeBox');if(!host)return;
  let used=0;
  try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);
    if(k&&k.startsWith('varugai.'))used+=k.length+(localStorage.getItem(k)||'').length;}}catch(e){}
  const kb=used/1024, cap=5120, pct=Math.min(100,100*kb/cap);
  const cls=pct>80?'flag':pct>55?'warn':'ok';
  host.innerHTML=`<p class="stat">Device storage used by VARUGAI: <b class="${cls}">${kb.toFixed(0)} KB</b> of roughly `+
    `${cap} KB available to this app (<b>${pct.toFixed(0)}%</b>), across <b>${readIdx().length}</b> register(s). `+
    (pct>80?'<span class="flag">Close to the limit — export and delete a finished register.</span>':'Export a backup at the end of every session.')+`</p>`;
}
function drawAudit(){
  if(!S.audit.length){$('auditBox').innerHTML='<p class="stat">No corrections recorded.</p>';return;}
  $('auditBox').innerHTML='<table class="s"><thead><tr><th>When</th><th>Date</th><th>What changed</th></tr></thead><tbody>'+
    S.audit.slice().reverse().map(a=>{
      let what;
      if(a.kind==='day')what=`<span class="warn">Calendar</span> — ${esc(a.note)}`;
      else if(a.kind==='autofill')what=`<span class="warn">Completion</span> — ${esc(a.note)}`+
        (a.cells?`<br><span class="stat">${esc(a.cells.slice(0,40).join(', '))}${a.cells.length>40?' …':''}</span>`:'');
      else{const st=S.roster.find(r=>r.sid===a.sid)||S.roster.find(r=>r.roll===a.roll);
        what=`${esc(st?st.roll:a.roll||'?')} ${esc(st?st.name:'')} · H${a.hour} · ${a.from==='-'?'blank':a.from} → ${a.to==='-'?'blank':a.to}`;}
      return `<tr><td>${new Date(a.ts).toLocaleString('en-IN')}</td><td>${esc(a.date)}</td><td>${what}</td></tr>`;
    }).join('')+'</tbody></table>';
}

/* ---------- XLSX (store-only ZIP, no library) ---------- */
const te=new TextEncoder();let crcT=null;
function crc32(b){if(!crcT){crcT=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=(c&1)?(0xedb88320^(c>>>1)):(c>>>1);crcT[n]=c>>>0;}}
  let c=0xffffffff;for(const x of b)c=crcT[(c^x)&255]^(c>>>8);return (c^0xffffffff)>>>0;}
const u16=n=>new Uint8Array([n&255,(n>>>8)&255]);
const u32=n=>new Uint8Array([n&255,(n>>>8)&255,(n>>>16)&255,(n>>>24)&255]);
function cat(a){const L=a.reduce((s,x)=>s+x.length,0),o=new Uint8Array(L);let p=0;for(const x of a){o.set(x,p);p+=x.length;}return o;}
function zipStore(files){const loc=[],cen=[];let off=0;
  for(const f of files){const nm=te.encode(f.name),dt=te.encode(f.data),cr=crc32(dt);
    const lh=cat([u32(0x04034b50),u16(20),u16(0x0800),u16(0),u16(0),u16(0),u32(cr),u32(dt.length),u32(dt.length),u16(nm.length),u16(0),nm]);
    loc.push(lh,dt);
    cen.push(cat([u32(0x02014b50),u16(20),u16(20),u16(0x0800),u16(0),u16(0),u16(0),u32(cr),u32(dt.length),u32(dt.length),u16(nm.length),u16(0),u16(0),u16(0),u16(0),u32(0),u32(off),nm]));
    off+=lh.length+dt.length;}
  const cd=cat(cen),body=cat(loc);
  return new Blob([body,cd,cat([u32(0x06054b50),u16(0),u16(0),u16(files.length),u16(files.length),u32(cd.length),u32(body.length),u16(0)])],
    {type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});}
const xe=v=>String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
function colN(n){let s='';while(n){n--;s=String.fromCharCode(65+n%26)+s;n=Math.floor(n/26);}return s;}
function sheetXml(rows){let x='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0"><pane xSplit="3" ySplit="1" topLeftCell="D2" activePane="bottomRight" state="frozen"/></sheetView></sheetViews><sheetData>';
  rows.forEach((r,ri)=>{x+=`<row r="${ri+1}">`;r.forEach((v,ci)=>{if(v===null||v===undefined||v==='')return;
    const ref=colN(ci+1)+(ri+1);
    x+=(typeof v==='number'&&Number.isFinite(v))?`<c r="${ref}"><v>${v}</v></c>`:`<c r="${ref}" t="inlineStr"><is><t>${xe(v)}</t></is></c>`;});
    x+='</row>';});
  return x+'</sheetData></worksheet>';}
function workbook(){
  const A=activeDays().filter(d=>S.days[d].done),T=totals(),m=S.meta;
  const dHead=['Roll','Reg. No','Name'];A.forEach(d=>dHead.push(`${d} (${S.days[d].hours}h)`));dHead.push('Hours attended');
  const detail=[dHead];
  S.roster.forEach(r=>{const row=[r.roll,r.regno||'',r.name];let tot=0;
    A.forEach(d=>{
      if(!inRoll(r,d)){row.push('');return;}
      const st=dayState(d,r.sid);
      for(let i=0;i<S.days[d].hours;i++){const v=cell(d,r.sid,i);if(v==='P'||v==='O')tot++;}
      row.push(st.k==='-'?'':st.k==='P'?'P':st.k==='O'?'OD':st.k==='A'?'A':st.t);});
    row.push(tot);detail.push(row);});
  const fin=[['Roll','Reg. No','Name','Present hours','OD hours','Absent hours','Counted hours','Equivalent days','Percent','Standing','Forecast']];
  S.roster.forEach((r,i)=>{const t=T[i];const pct=t.h?100*t.p/t.h:0;
    const st=standingText(t,m);
    fin.push([r.roll,r.regno||'',r.name,t.p-t.od,t.od,t.a,t.h,+t.eq.toFixed(2),t.h?+pct.toFixed(2):'',st,forecast(t)]);});
  const meta=[['VARUGAI 15 attendance export'],['Course code',m.courseCode||''],['Course title',m.courseTitle||''],['Class',m.className||''],['Semester',m.semester||''],['Academic year',m.acadYear||''],
    ['Completed working days',A.length],['Hours counted',A.reduce((s,d)=>s+S.days[d].hours,0)],
    ['Rule','P = 1 hour, OD = 1 hour, A = 0. Open days are excluded entirely.'],['Eligibility basis','Course-wise, per MSU guidelines in force from 2018-19.'],['Regulation applied',m.rulesetLabel||'NOT RECORDED'],
    ['Pass mark',m.passMark],['Condonation \u2014 fee only',m.condFee],['Condonation \u2014 fee + medical',m.condMed],['Verify band',m.bandPts],['Generated',new Date().toLocaleString('en-IN')]];
  const aud=[['When','Date','Kind','Roll','Name','Hour','From','To','Note']];
  const who=sid=>S.roster.find(r=>r.sid===sid)||null;
  S.audit.forEach(a=>{
    const st=a.sid?who(a.sid):null;
    aud.push([
      new Date(a.ts).toLocaleString('en-GB'),
      a.date||'',
      a.kind==='day'?'Calendar':a.kind==='autofill'?'Completion':'Correction',
      st?st.roll:(a.roll||''),
      st?st.name:'',
      a.hour?'H'+a.hour:'',
      a.from==='-'?'blank':(a.from||''),
      a.to==='-'?'blank':(a.to||''),
      a.note||''
    ]);});
  const sheets=[['Metadata',meta],['Detailed Attendance',detail],['Final Summary',fin],['Correction Log',aud]];
  const wb='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>'+
    sheets.map((s,i)=>`<sheet name="${xe(s[0])}" sheetId="${i+1}" r:id="rId${i+1}"/>`).join('')+'</sheets></workbook>';
  const rels='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'+
    sheets.map((s,i)=>`<Relationship Id="rId${i+1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i+1}.xml"/>`).join('')+'</Relationships>';
  const ct='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'+
    sheets.map((s,i)=>`<Override PartName="/xl/worksheets/sheet${i+1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('')+'</Types>';
  const root='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>';
  const files=[{name:'[Content_Types].xml',data:ct},{name:'_rels/.rels',data:root},
    {name:'xl/workbook.xml',data:wb},{name:'xl/_rels/workbook.xml.rels',data:rels}];
  sheets.forEach((s,i)=>files.push({name:`xl/worksheets/sheet${i+1}.xml`,data:sheetXml(s[1])}));
  return zipStore(files);
}

/* ---------- export ---------- */
const csvSafe=v=>/^[=+\-@\t\r]/.test(String(v))?"'"+v:String(v);
const today=()=>new Date().toISOString().slice(0,10);
const b64=blob=>new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(String(r.result).split(',')[1]);r.onerror=()=>rej(r.error);r.readAsDataURL(blob);});
function stmtHtml(){
  const m=S.meta,T=totals();
  const A=activeDays(),done=A.filter(d=>S.days[d].done);
  const hrs=done.reduce((x,d)=>x+S.days[d].hours,0);
  const filt=$('stFilter')?$('stFilter').value:'all';
  const dated=$('stDate')&&$('stDate').value?$('stDate').value:today();
  const rows=[];
  S.roster.forEach((r,i)=>{
    const t=T[i];
    if(!t.h)return;
    const pct=100*t.p/t.h;
    const r0=standing(pct);
    const thin=t.h<m.minHours;
    const lab=thin?'Too few hours to certify':(r0.label+(r0.near?' \u00b7 verify':''));
    const cat = thin?'thin':r0.cat;
    const near=!thin&&r0.near;
    if(filt==='short'&&pct>=m.passMark)return;
    if(filt==='band'){ if(!near)return; }
    else if(filt!=='all'&&filt!=='short'&&filt!==cat)return;
    rows.push({r,t,pct,lab,i});
  });
  const period=done.length?`${nice(done[0])} to ${nice(done[done.length-1])}`:'—';
  const L=(k,v)=>v?`<tr><td><b>${k}</b></td><td>${esc(v)}</td></tr>`:'';
  return `<div class="sheet">
    <p class="inst">${esc(m.institution||'Government Arts and Science College, Nagercoil - 4')}</p>
    <p class="sub">Department of ${esc(m.department||'—')}</p>
    <h3>STATEMENT OF ATTENDANCE</h3>
    <table class="meta">
      ${L('Programme / Class',m.className)}${L('Semester',m.semester)}${L('Academic year',m.acadYear)}
      ${L('Course',[m.courseCode,m.courseTitle].filter(Boolean).join(' — '))}
      ${L('Faculty in charge',m.faculty)}
      ${L('Period covered',period)}
      ${L('Working days completed',String(done.length))}
      ${L('Hours held',String(hrs))}
      ${L('Regulation applied',m.rulesetLabel||'NOT RECORDED')}
    </table>
    <table>
      <thead><tr><th>Sl.</th><th>Roll</th><th>Reg. No</th><th>Name of the Student</th><th>Admitted w.e.f.</th>
      <th class="n">Present</th><th class="n">OD</th><th class="n">Absent</th>
      <th class="n">Held</th><th class="n">%</th><th>Standing</th></tr></thead>
      <tbody>${rows.length?rows.map((x,k)=>`<tr>
        <td class="n">${k+1}</td><td>${esc(x.r.roll)}</td><td>${esc(x.r.regno||'')}</td><td>${esc(x.r.name)}</td>
        <td>${x.r.from?esc(nice(x.r.from)):'—'}${x.r.to?' to '+esc(nice(x.r.to)):''}</td>
        <td class="n">${x.t.p-x.t.od}</td><td class="n">${x.t.od||''}</td><td class="n">${x.t.a}</td>
        <td class="n">${x.t.h}</td><td class="n">${x.pct.toFixed(2)}</td><td>${esc(x.lab)}</td></tr>`).join('')
        :'<tr><td colspan="11">No student falls in the selected category.</td></tr>'}</tbody>
    </table>
    <p class="cert">Certified that the attendance shown above has been compiled from the class attendance
    register maintained for this course and has been verified against it. Percentages are calculated on the
    hours actually held and completed up to the period stated; hours not yet taken are excluded.
    ${rows.some(x=>x.r.from||x.r.to)?`Where a date appears under <b>Admitted w.e.f.</b>, that student joined
    after the course began or left before it ended; the percentage for such a student is calculated only on
    the hours held during that student\u2019s own period of enrolment, and the hours held before admission
    are not counted against the student.`:''}</p>
    <div class="sign"><div>Faculty in charge</div><div>Head of the Department</div><div>Principal</div></div>
    <p class="foot">${esc([m.courseCode,m.className].filter(Boolean).join(' · ')||'VARUGAI')} ·
      ${rows.length} student(s) listed · statement dated ${esc(dated)} ·
      generated by VARUGAI on ${new Date().toLocaleString('en-GB')}</p>
  </div>`;
}
$('stBuild').onclick=()=>{
  if(!stmtReady())return;
  $('stmt').innerHTML=stmtHtml();
  document.body.classList.add('printing');
  window.scrollTo(0,0);
  if(!$('stmtBack')){
    const b=document.createElement('button');
    b.id='stmtBack';b.className='btn g';b.textContent='← Back to the app';
    b.style.cssText='position:fixed;left:10px;bottom:14px;z-index:70';
    b.onclick=()=>{document.body.classList.remove('printing');b.remove();};
    document.body.appendChild(b);
  }
};
$('stPrint').onclick=()=>{
  if(!$('stmt').innerHTML){alert('Build the statement first.');return;}
  const B=window.VarugaiAndroid||window.VarugaiNative;
  if(B&&typeof B.printPage==='function'){B.printPage();return;}
  if(typeof window.print==='function'){window.print();return;}
  alert('Printing is not available here. Use "Save as a file" and print it from a browser or a computer.');
};
function stmtReady(){
  if(!S.roster.length){alert('The roster is empty.');return false;}
  if(!activeDays().some(d=>S.days[d].done)){
    alert('No day has been completed yet, so there is nothing to certify. Mark a day and press Complete first.');return false;}
  return true;
}
$('stSave').onclick=async()=>{
  if(!stmtReady())return;
  if(!$('stmt').innerHTML)$('stmt').innerHTML=stmtHtml();
  const doc='<!doctype html><html><head><meta charset="utf-8"><title>Attendance statement</title>'+
    '<style>'+STYLE_CSS+'\nbody{background:#fff}#stmt{display:block}</style></head><body class="printing"><div id="stmt">'+
    $('stmt').innerHTML+'</div></body></html>';
  await deliver('VARUGAI_statement_'+(S.meta.courseCode||'course').replace(/[^A-Za-z0-9_-]+/g,'_')+'_'+today()+'.html',
    new Blob([doc],{type:'text/html'}),'text/html');
};
/* Desktop-native "Save statement as PDF" — additive; does not replace Print or Save-as-file. */
$('stPdf').onclick=async()=>{
  if(!stmtReady())return;
  const N=window.VarugaiNative||window.VarugaiAndroid;
  if(!N||typeof N.savePdf!=='function'){alert('Saving as PDF needs the VARUGAI desktop app. Use "Save as a file" or Print instead.');return;}
  if(!$('stmt').innerHTML)$('stmt').innerHTML=stmtHtml();
  document.body.classList.add('printing');
  try{
    const name='VARUGAI_statement_'+(S.meta.courseCode||'course').replace(/[^A-Za-z0-9_-]+/g,'_')+'_'+today()+'.pdf';
    const r=await N.savePdf(name);
    $('dataStat').textContent = r&&r.canceled ? '' : 'Choose where to save '+name;
  }catch(err){
    $('dataStat').innerHTML='<span class="flag">Could not create the PDF: '+esc(err&&err.message||err)+'</span>';
  }finally{
    document.body.classList.remove('printing');
  }
};

async function deliver(name,blob,mime){
  const B=window.VarugaiNative||window.VarugaiAndroid;
  const data=await b64(blob);
  if(B&&typeof B.saveExcel==='function'){B.saveExcel(name,data);$('dataStat').textContent='Choose where to save '+name;return;}
  if(B&&typeof B.saveBase64==='function'){B.saveBase64(name,data,mime);$('dataStat').textContent='Saved to Downloads/VARUGAI: '+name;return;}
  const a=document.createElement('a');            // data: URI, never blob: — the wrapper blocks blob downloads
  a.href='data:'+mime+';base64,'+data;a.download=name;a.click();
  $('dataStat').textContent='Downloaded '+name;
}
$('expXlsx').onclick=async()=>{
  if(!S.roster.length){alert('Import a roster first.');return;}
  if(!activeDays().some(d=>S.days[d].done)){alert('No day has been completed yet. Complete at least one day.');return;}
  await deliver(`VARUGAI_${(S.meta.courseCode||S.meta.className||'class').replace(/[^A-Za-z0-9_-]+/g,'_')}_${today()}.xlsx`,
    workbook(),'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
};
$('clearDates').onclick=()=>{
  const n=S.roster.filter(r=>r.from||r.to).length;
  if(!n){alert('No student has an enrolment date set.');return;}
  if(!confirm(`${n} student(s) have a "counts from" or "counts until" date.\n\n`+
    `Clearing them makes every student markable on every working day. Only do this if the dates were set by mistake — a genuine late admission needs its start date.\n\nProceed?`))return;
  S.roster.forEach(r=>{r.from=null;r.to=null;});
  save();drawRoster();drawMatrix();drawSummary();
};
$('rosterXlsx').onclick=async()=>{
  if(!S.roster.length){alert('The roster is empty.');return;}
  const m=S.meta;
  const info=[['Student roster'],['Course code',m.courseCode||''],['Course title',m.courseTitle||''],
    ['Class',m.className||''],['Semester',m.semester||''],['Academic year',m.acadYear||''],
    ['Students',S.roster.length],
    ['Source','typed, pasted or uploaded from a file'],
    ['Order','Register order as entered — never sorted'],
    ['Generated',new Date().toLocaleString('en-GB')]];
  const roll=[['Sl.No','Roll','Reg. No','Name of the Student','Counts from','Counts until']];
  S.roster.forEach((r,i)=>roll.push([i+1,r.roll,r.regno||'',r.name,r.from||'',r.to||'']));
  const sheets=[['Roll List',roll],['Details',info]];
  const wbx='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>'+
    sheets.map((s2,i)=>`<sheet name="${xe(s2[0])}" sheetId="${i+1}" r:id="rId${i+1}"/>`).join('')+'</sheets></workbook>';
  const rels='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'+
    sheets.map((s2,i)=>`<Relationship Id="rId${i+1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i+1}.xml"/>`).join('')+'</Relationships>';
  const ct='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'+
    sheets.map((s2,i)=>`<Override PartName="/xl/worksheets/sheet${i+1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('')+'</Types>';
  const root='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>';
  const files=[{name:'[Content_Types].xml',data:ct},{name:'_rels/.rels',data:root},
    {name:'xl/workbook.xml',data:wbx},{name:'xl/_rels/workbook.xml.rels',data:rels}];
  sheets.forEach((s2,i)=>files.push({name:`xl/worksheets/sheet${i+1}.xml`,data:sheetXml(s2[1])}));
  await deliver(`VARUGAI_roster_${(m.courseCode||m.className||'class').replace(/[^A-Za-z0-9_-]+/g,'_')}_${today()}.xlsx`,
    zipStore(files),'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
};
$('expCsv').onclick=async()=>{
  const T=totals(),m=S.meta;
  let c='Course,Roll,RegNo,Name,PresentHours,ODHours,AbsentHours,CountedHours,EquivalentDays,Percent,Standing,Forecast\n';
  S.roster.forEach((r,i)=>{const t=T[i];const pct=t.h?100*t.p/t.h:0;
    const st=standingText(t,m);
    c+=`"${csvSafe(S.meta.courseCode||S.meta.className||'')}",${csvSafe(r.roll)},"${csvSafe(r.regno||'').replace(/"/g,'""')}","${csvSafe(r.name).replace(/"/g,'""')}",${t.p-t.od},${t.od},${t.a},${t.h},${t.eq.toFixed(2)},${t.h?pct.toFixed(2):''},${st}\n`;});
  await deliver('VARUGAI_summary_'+today()+'.csv',new Blob([c],{type:'text/csv'}),'text/csv');
};
const APPVER='15.1.0';
function fnv(str){let h=0x811c9dc5;for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,0x01000193)>>>0;}return h.toString(16).padStart(8,'0');}
function makeBackup(){
  const payload=JSON.stringify(S);
  return JSON.stringify({format:'varugai-backup',schema:2,appVersion:APPVER,
    created:new Date().toISOString(),register:regLabel(S.meta),
    students:S.roster.length,checksum:fnv(payload),data:JSON.parse(payload)},null,1);
}
$('expJson').onclick=async()=>
  await deliver('VARUGAI_backup_'+today()+'.json',new Blob([makeBackup()],{type:'application/json'}),'application/json');
$('impBtn').onclick=()=>$('impFile').click();
$('impFile').onchange=e=>{
  const f=e.target.files[0];if(!f)return;
  const r=new FileReader();
  r.onload=()=>{try{
    const raw=JSON.parse(r.result);
    let d,note='';
    if(raw&&raw.format==='varugai-backup'){
      if(!raw.data||!raw.data.roster||!raw.data.days)
        throw new Error('the file is a VARUGAI backup but contains no register');
      if(raw.schema>2)
        throw new Error('written by a newer version of VARUGAI ('+esc(raw.appVersion||'?')+'). Update the app first.');
      const sum=fnv(JSON.stringify(raw.data));
      if(raw.checksum&&raw.checksum!==sum)
        throw new Error('checksum mismatch — the file was altered or truncated in transit. Nothing has been restored.');
      d=raw.data;
      note=` Written ${new Date(raw.created).toLocaleString('en-GB')} by version ${esc(raw.appVersion||'?')}.`;
    }else if(raw&&raw.roster&&raw.days){
      d=raw;
      note=' <span class="warn">Older unchecked backup format — verify the totals against the register.</span>';
    }else throw new Error('this is not a VARUGAI backup file');
    const nd=Object.keys(d.days||{}).length;
    if(!confirm(`Restore ${d.roster.length} student(s) and ${nd} calendar date(s)?\n\nEverything currently in this register is replaced.`))return;
    S=d;save();
    load();                      // re-reads and runs migrate() on the restored data
    drawDays();drawRoster();fillJump();drawMatrix();drawSummary();drawChecks();drawAudit();drawStore();
    $('dataStat').innerHTML='<span class="ok">Backup restored.</span>'+note;
  }catch(err){$('dataStat').innerHTML='<span class="flag">Restore refused: '+esc(err.message)+'</span>';}};
  r.readAsText(f);e.target.value='';
};

/* ---------- boot ---------- */
load();drawDays();drawRoster();fillJump();drawMatrix();drawSummary();
