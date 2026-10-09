const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const KEY='safescroll_responses';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let mem=[],adminFlag=false;
const load=()=>{try{return JSON.parse(localStorage.getItem(KEY))||[]}catch(e){return mem}};
const save=d=>{mem=d;try{localStorage.setItem(KEY,JSON.stringify(d))}catch(e){}};

/* ---------- routing ---------- */
function show(id){
  if(!$('#'+id))id='home';
  $$('.page').forEach(p=>p.hidden=p.id!==id);
  $$('nav a').forEach(a=>a.classList.toggle('on',a.dataset.p===id));
  if(id==='admin')renderAdmin();
  if(id==='home')homeStats();
  scrollTo(0,0);
}
document.addEventListener('click',e=>{const a=e.target.closest('[data-p]');if(a){e.preventDefault();location.hash=a.dataset.p;}});
addEventListener('hashchange',()=>show(location.hash.slice(1)||'home'));

/* ---------- learn ---------- */
const tips=[
['What is a digital footprint?','It is the trail of data you leave online. Active footprint: things you post on purpose. Passive footprint: things collected about you, like location, cookies and browsing history.'],
['Passwords and 2-step login','Use a long, unique password for each important account and turn on two-step verification. Never share an OTP with anyone, even if they say they are from the bank or the app.'],
['Privacy settings','Make your account private, check who can tag you, and turn off live location sharing. Review these settings every few months because apps change them.'],
['Spotting scams and fake profiles','Be careful with "you won a prize" messages, urgent money requests, and new accounts using a friend\'s photo. Pause, check with the person on a call, and report the account.'],
['Cyberbullying: what to do','Do not reply in anger. Save screenshots, block the person, report the content and tell someone you trust. In India you can also report at cybercrime.gov.in or call 1930 for financial fraud.'],
['Think before you post','Ask yourself: would I be okay if my family, teacher or future boss saw this? Avoid sharing your address, school or college ID, travel dates and documents.'],
['Cleaning up your footprint','Search your own name, delete old posts you dislike, remove unused accounts and check which apps have access to your profile.']];
$('#tips').innerHTML=tips.map(t=>`<details><summary>${t[0]}</summary><p>${t[1]}</p></details>`).join('');
const myths=[['"Deleted means gone."','Not really. Others may have screenshots, and copies can stay on servers.'],['"Private account = totally safe."','It helps, but followers can still share or screenshot your content.'],['"Only famous people get targeted."','Scammers target everyday users because they are easier to fool.'],['"Incognito hides everything."','It only hides history on your device. Websites and networks can still see you.']];
$('#myths').innerHTML=myths.map(m=>`<div class="card"><h3>${m[0]}</h3><p>${m[1]}</p></div>`).join('');

/* ---------- footprint check ---------- */
const habits=['I use a different password for each important account','I have two-step verification on my main accounts','My social media accounts are private','I never share OTPs or passwords with anyone','I check app permissions like location and contacts','I do not post my phone number or home address','I think before tagging or posting friends\' photos','I accept requests only from people I know','I have searched my own name online','I log out on shared or public devices'];
$('#checklist').innerHTML=habits.map((h,i)=>`<label class="check"><input type="checkbox" id="h${i}"> <span>${h}</span></label>`).join('');
$('#calc').onclick=()=>{
  const n=habits.filter((_,i)=>$('#h'+i).checked).length;
  let t,c,m;
  if(n>=8){t='Footprint champion 🏆';c='var(--teal)';m='Great habits! Keep reviewing your settings and help a friend do the same.'}
  else if(n>=5){t='On the right track 🌱';c='var(--sun)';m='You are doing many things right. Work on the unticked habits first, starting with two-step login.'}
  else{t='Needs attention ⚠️';c='var(--coral)';m='No worries, everyone starts somewhere. Pick two unticked habits and fix them today.'}
  const r=$('#checkResult');r.hidden=false;r.style.borderColor=c;
  r.innerHTML=`<h3>${t}</h3><p><b>${n} / ${habits.length}</b> habits ticked. ${m}</p><a class="btn" data-p="learn" href="#learn">Read the tips</a>`;
};

/* ---------- survey ---------- */
$('#surveyForm').addEventListener('submit',e=>{
  e.preventDefault();
  const f=new FormData(e.target);
  const need=['age','hours','privacy','scam','know','rate'];
  if(need.some(k=>!f.get(k))){$('#surveyErr').hidden=false;return}
  $('#surveyErr').hidden=true;
  const d=load();
  d.push({id:Date.now(),time:new Date().toLocaleString(),name:(f.get('name')||'Anonymous').trim()||'Anonymous',age:f.get('age'),plat:f.getAll('plat'),hours:f.get('hours'),privacy:f.get('privacy'),scam:f.get('scam'),know:f.get('know'),rate:+f.get('rate'),idea:(f.get('idea')||'').trim()});
  save(d);e.target.reset();$('#thanks').hidden=false;
});

/* ---------- home stats ---------- */
function homeStats(){
  const d=load(),n=d.length;
  const avg=n?(d.reduce((s,x)=>s+x.rate,0)/n).toFixed(1):'–';
  const priv=n?Math.round(d.filter(x=>x.privacy.startsWith('Yes')).length/n*100)+'%':'–';
  $('#homeStats').innerHTML=[[n,'people took the survey'],[avg,'average awareness (out of 5)'],[priv,'keep all accounts private']].map(s=>`<div class="card"><div class="stat">${s[0]}</div>${s[1]}</div>`).join('');
}

/* ---------- admin ---------- */
const isAdmin=()=>adminFlag;
function doLogin(){
  const u=$('#u').value.trim().toLowerCase(),p=$('#p').value.trim();
  if(u==='admin'&&p==='admin123'){adminFlag=true;$('#loginErr').hidden=true;renderAdmin()}
  else $('#loginErr').hidden=false;
}
$('#loginBtn').onclick=doLogin;
$('#p').addEventListener('keydown',e=>{if(e.key==='Enter')doLogin()});
$('#u').addEventListener('keydown',e=>{if(e.key==='Enter')doLogin()});
$('#logout').onclick=()=>{adminFlag=false;$('#p').value='';renderAdmin()};
$('#clear').onclick=()=>{if(confirm('Delete all survey responses? This cannot be undone.')){save([]);renderAdmin()}};
$('#seed').onclick=()=>{
  const pick=a=>a[Math.floor(Math.random()*a.length)];
  const P=['Instagram','WhatsApp','YouTube','Snapchat','X / Twitter','Facebook','LinkedIn'],d=load();
  const names=['Aarav','Diya','Rohan','Sneha','Kabir','Meera','Ishaan','Anaya'];
  for(let i=0;i<10;i++)d.push({id:Date.now()+i,time:new Date().toLocaleString(),name:pick(names),age:pick(['Under 18','18-20','21-24','25+']),plat:[...new Set([pick(P),pick(P),'WhatsApp'])],hours:pick(['Less than 1 hour','1-3 hours','3-5 hours','More than 5 hours']),privacy:pick(['Yes, all of them','Some of them','No, all public']),scam:pick(['Yes','No','Not sure']),know:pick(['Yes, clearly','A little','No']),rate:1+Math.floor(Math.random()*5),idea:pick(['Use 2-step login','Do not accept unknown requests','','Think before posting'])});
  save(d);renderAdmin();
};
$('#csv').onclick=()=>{
  const d=load();if(!d.length)return alert('No data to download yet.');
  const h=['Time','Name','Age','Platforms','Hours','Privacy','Faced scam','Knew footprint','Awareness','Suggestion'];
  const q=v=>'"'+String(v).replace(/"/g,'""')+'"';
  const rows=d.map(x=>[x.time,x.name,x.age,x.plat.join('; '),x.hours,x.privacy,x.scam,x.know,x.rate,x.idea].map(q).join(','));
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([[h.map(q).join(','),...rows].join('\n')],{type:'text/csv'}));
  a.download='survey-responses.csv';a.click();
};
function count(arr){const o={};arr.forEach(v=>o[v]=(o[v]||0)+1);return o}
function bars(title,obj){
  const t=Math.max(1,Object.values(obj).reduce((a,b)=>a+b,0));
  const rows=Object.entries(obj).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`<div class="row"><span>${esc(k)}</span><div class="track"><div class="fill" style="width:${v/t*100}%"></div></div><b>${v}</b></div>`).join('')||'<p>No data yet.</p>';
  return `<div class="card"><h3>${title}</h3>${rows}</div>`;
}
function renderAdmin(){
  const on=isAdmin();
  $('#loginBox').hidden=on;$('#dash').hidden=!on;
  if(!on)return;
  const d=load(),n=d.length;
  const avg=n?(d.reduce((s,x)=>s+x.rate,0)/n).toFixed(1):'0';
  const pct=f=>n?Math.round(d.filter(f).length/n*100)+'%':'0%';
  $('#kpis').innerHTML=[[n,'Total responses'],[avg+' / 5','Average awareness'],[pct(x=>x.scam==='Yes'),'Faced a scam or bullying'],[pct(x=>x.know==='No'),'Did not know "digital footprint"']].map(k=>`<div class="card"><div class="stat">${k[0]}</div>${k[1]}</div>`).join('');
  $('#charts').innerHTML=bars('Age groups',count(d.map(x=>x.age)))+bars('Popular platforms',count(d.flatMap(x=>x.plat)))+bars('Daily screen time',count(d.map(x=>x.hours)))+bars('Private accounts?',count(d.map(x=>x.privacy)))+bars('Awareness rating',count(d.map(x=>x.rate+' star')));
  $('#tbl').innerHTML=n?`<table><tr><th>Time</th><th>Name</th><th>Age</th><th>Platforms</th><th>Hours</th><th>Private?</th><th>Scam?</th><th>Rating</th><th>Suggestion</th></tr>${d.slice().reverse().map(x=>`<tr><td>${esc(x.time)}</td><td>${esc(x.name)}</td><td>${esc(x.age)}</td><td>${esc(x.plat.join(', '))}</td><td>${esc(x.hours)}</td><td>${esc(x.privacy)}</td><td>${esc(x.scam)}</td><td>${x.rate}</td><td>${esc(x.idea)}</td></tr>`).join('')}</table>`:'<p style="padding:1rem">No responses yet. Share the survey or press "Add demo data" to preview the dashboard.</p>';
}
show(location.hash.slice(1)||'home');
