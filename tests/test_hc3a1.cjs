// HC-3A.1 coding-only QA. This test does not launch a browser or use the network.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

const root=path.resolve(__dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const publicFiles=[];
function collect(directory){
  for(const entry of fs.readdirSync(path.join(root,directory),{withFileTypes:true})){
    const relative=path.join(directory,entry.name);
    if(entry.isDirectory())collect(relative);
    else if(/\.(html|js|json|xml)$/.test(entry.name))publicFiles.push(relative);
  }
}
for(const directory of ['assets','host-consulting','En/host-consulting'])collect(directory);
for(const file of ['host-consulting.html','En/host-consulting.html'])publicFiles.push(file);

const INTRO='https://calendar.app.google/GfiTX1axiVnAnA8HA';
const PAID=[
  'https://calendar.app.google/JYGHsyb2GVDDQnbC8',
  'https://calendar.app.google/9tn4EaEmTEGAmCWL6',
  'https://calendar.app.google/Zuj5QRmHUny644QU6',
];
let checks=0;
const check=(condition,message)=>{assert.ok(condition,message);checks++;};

for(const file of publicFiles){
  const content=read(file);
  check(!/calendly/i.test(content),`Calendly reference remains in ${file}`);
  for(const url of PAID)check(!content.includes(url),`Gated URL exposed in ${file}`);
}

for(const language of ['','En/']){
  const intro=read(`${language}host-consulting/intro-call.html`);
  check((intro.match(new RegExp(INTRO.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'g'))||[]).length===2,
    `${language||'ES'} Intro Call must contain two exact schedule links`);
  check(intro.includes('data-exploratory-call')&&intro.includes('data-scheduling')&&
    intro.includes('data-session-type="exploratory_15"'),'Scheduling analytics metadata missing');
  check(intro.includes('Google Calendar'),'Provider confirmation copy is stale');
  const home=read(`${language}host-consulting.html`);
  check((home.match(new RegExp(INTRO.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'g'))||[]).length===4,
    'Host Consulting page must contain four exact schedule links');
  check(home.includes('data-exploratory-call')&&home.includes('data-scheduling'),
    'Host Consulting scheduler analytics metadata is missing');
}

const form=read('assets/consulting-form.js');
check(form.includes(`action.href = '${INTRO}'`),'Application success does not use Google Calendar');
check(form.includes("plan === 'launch_pro' || plan === 'growth_advisory'"),
  'Launch/Growth application branch changed');
check(form.includes("action.setAttribute('data-scheduling', '')"),
  'Application success scheduling analytics is missing');
check(!form.includes('diagnostic_90')&&!form.includes('follow_up_60')&&!form.includes('growth_60'),
  'Paid session type leaked into public intake code');

const analytics=read('assets/lead-analytics.js');
check(analytics.includes("'exploratory_call_click'")&&analytics.includes("'scheduling_click'"),
  'New scheduling events are not allowlisted');
check(analytics.includes('session_type: link.dataset.sessionType'),'session_type is not collected');
check(analytics.includes("properties.session_type = sessionType"),'session_type is not emitted');
check(!analytics.includes('calendly_click'),'Calendly event remains in analytics');
check(analytics.includes("'intro_call_click'"),'Legacy GA4 continuity event was removed unexpectedly');

// Execute analytics in a minimal DOM sandbox and verify event names and properties.
const listeners={};const emitted=[];
const document={
  documentElement:{lang:'en'},
  head:{appendChild(){}},
  createElement(){return {};},
  addEventListener(type,handler){listeners[type]=handler;},
};
const window={PPA_CONFIG:{gaMeasurementId:'G-ABCDEFGHIJ'},
  gtag(...args){emitted.push(args);}};
const context={window,document,location:{pathname:'/En/host-consulting/intro-call.html'},URL,
  encodeURIComponent,Date,Set,String};
vm.runInNewContext(analytics,context);
const link={dataset:{plan:'launch_pro',source:'application_success',sessionType:'exploratory_15'},
  hasAttribute(name){return ['data-exploratory-call','data-scheduling'].includes(name);},
  getAttribute(name){return name==='href'?INTRO:'';}};
listeners.click({target:{closest(){return link;}}});
const tracked=emitted.filter(item=>item[0]==='event');
for(const eventName of ['exploratory_call_click','scheduling_click','intro_call_click'])
  check(tracked.some(item=>item[1]===eventName),`${eventName} was not emitted`);
for(const item of tracked){
  check(item[2].plan==='launch_pro'&&item[2].language==='en'&&
    item[2].source==='application_success'&&item[2].session_type==='exploratory_15',
    `Incomplete analytics properties for ${item[1]}`);
}

// Parse every changed JavaScript source without evaluating application code.
for(const file of ['assets/lead-analytics.js','assets/consulting-form.js','tests/test_hc3a_browser.cjs']){
  new vm.Script(read(file),{filename:file});checks++;
}

console.log(`PASS ${checks} HC-3A.1 coding-only assertions.`);
