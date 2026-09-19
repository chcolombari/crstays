// HC-2 browser → actual local HTTP API → disposable PostgreSQL. Brevo is a fake.
// Requires Playwright, a Python environment with pgserver, and the paired backend.
const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {spawn}=require('node:child_process');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const backend=process.env.HC2_BACKEND_ROOT||path.resolve(root,'../crstays-ppa');
const python=process.env.HC2_PYTHON||'python3';
const out=process.env.HC2_QA_OUTPUT||'/private/tmp/hc2-browser-evidence';fs.mkdirSync(out,{recursive:true});
const plans=['diagnostic_session','host_starter','launch_pro','growth_advisory'];
const stages=['not_published','preparing','active','relaunch'];
let checks=0;const cases=[];
const child=spawn(python,[path.join(backend,'qa_hc2_server.py'),'--qa-only'],{cwd:backend,stdio:['ignore','pipe','pipe']});
let diagnostics='';child.stderr.on('data',data=>{diagnostics+=data;});
const ready=new Promise((resolve,reject)=>{
 let buffer='';const timer=setTimeout(()=>reject(new Error('QA API startup timeout: '+diagnostics)),30000);
 child.stdout.on('data',data=>{buffer+=data;const line=buffer.split('\n').find(line=>line.startsWith('{"api"'));if(line){clearTimeout(timer);resolve(JSON.parse(line).api);}});
 child.on('exit',code=>{clearTimeout(timer);reject(new Error('QA API stopped: '+code+' '+diagnostics));});
});
const web=http.createServer((req,res)=>{
 const pathname=new URL(req.url,'http://localhost').pathname;
 const file=path.resolve(root,'.'+decodeURIComponent(pathname)+(pathname.endsWith('/')?'index.html':''));
 if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
 fs.readFile(file,(error,data)=>{if(error){res.writeHead(404).end();return;}
 res.setHeader('Content-Type',({'.js':'text/javascript','.json':'application/json','.css':'text/css','.png':'image/png','.jpg':'image/jpeg'})[path.extname(file)]||'text/html');res.setHeader('Cache-Control','no-store');res.end(data);});
});
const json=async(url,data)=>{const r=await fetch(url,data?{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)}:undefined);return r.json();};
(async()=>{
 let browser;
 try{
  const api=await ready;await new Promise(r=>web.listen(0,'127.0.0.1',r));const origin=`http://127.0.0.1:${web.address().port}`;
  await json(api+'/__qa/config',{origin});
  browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
  async function open(lang,plan,stage,width=390,authorized=true){
   const payload=await json(api+`/__qa/example?plan=${plan}&stage=${stage}&language=${lang}`);
   const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
   const errors=[],requests=[],responses=[];
   page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.method()==='POST')requests.push(r);});
   page.on('response',r=>{if(r.status()>=400&&r.url().startsWith(origin))responses.push(r.url());});
   await page.route('**/*',route=>{
    const url=route.request().url();
    if(url.endsWith('/assets/consulting-config.js'))return route.fulfill({contentType:'text/javascript',body:`window.CONSULTING_CONFIG={apiBaseUrl:${JSON.stringify(api)}};`});
    if(url.startsWith(api)||url.startsWith(origin)||url.startsWith('https://fonts.googleapis.com/')||url.startsWith('https://fonts.gstatic.com/'))return route.continue();
    return route.fulfill({body:''});
   });
   const slug=plan==='diagnostic_session'?'diagnostic-session':plan.replaceAll('_','-');
   const url=origin+(lang==='en'?'/En':'')+'/host-consulting/intake.html?plan='+slug;
   await page.goto(url+(plan==='diagnostic_session'&&authorized?'#intake_token='+encodeURIComponent(payload.intake_token):''),{waitUntil:'networkidle'});
   if(plan!=='diagnostic_session'||authorized)await page.locator('#consulting-form').waitFor({state:'visible'});
   return {page,payload,errors,requests,responses};
  }
  async function fill(page,payload){
   await page.locator('[name=listing_status]').selectOption(payload.listing_status);
   const flat={...payload,...payload.form_data};
   // has_airbnb_listing controls the URL field, so set it before remaining values.
   if(flat.has_airbnb_listing)await page.locator('[name=has_airbnb_listing]').selectOption(flat.has_airbnb_listing);
   for(const [key,value] of Object.entries(flat)){
    if(['listing_status','has_airbnb_listing','property_stage','project_stage'].includes(key))continue;
    const control=page.locator(`[name="${key}"]`);if(!await control.count())continue;
    if(!await control.first().isVisible())continue;
    if(Array.isArray(value)){for(const item of value)await page.locator(`[name="${key}"][value="${item}"]`).check();}
    else if(await control.evaluate(el=>el.tagName)==='SELECT')await control.selectOption(String(value));
    else await control.fill(String(value));
   }
  }
  for(const lang of ['es','en'])for(const width of [390,1280])for(const plan of plans)for(const stage of stages){
   const {page,payload,errors,requests,responses}=await open(lang,plan,stage,width);
   await fill(page,payload);
   const pre=['not_published','preparing'].includes(stage);
   if(plan==='growth_advisory'){
    assert.equal(await page.locator('[name=estimated_launch_date]').isVisible(),pre);checks++;
    assert.equal(await page.locator('[name=occupancy_optional]').isVisible(),!pre);checks++;
    assert.equal(await page.locator('[name=desired_changes]').isVisible(),stage==='relaunch');checks++;
   }
   if(plan==='launch_pro'){assert.equal(await page.locator('[data-field=prelaunch_challenges]').isVisible(),pre);assert.equal(await page.locator('[data-field=active_challenges]').isVisible(),!pre);checks+=2;}
   assert.equal(await page.locator('[name=airbnb_url]').isVisible(),!pre);checks++;
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);assert.equal(overflow,false);checks++;
   const a11y=await page.evaluate(()=>[...document.querySelectorAll('input,select,textarea')].filter(el=>!el.disabled).filter(el=>!el.labels?.length).map(el=>el.name));
   assert.deepEqual(a11y,[]);checks++;
   assert.equal(await page.locator('h1').count(),1);checks++;
   const button=await page.locator('button[type=submit]').boundingBox();assert.ok(button.height>=44);checks++;
   if((stage==='not_published'||plan==='growth_advisory'&&stage==='relaunch')){
    await page.evaluate(()=>{document.activeElement?.blur();scrollTo(0,0);});
    await page.screenshot({path:path.join(out,`${lang}-${plan}-${stage}-${width}.png`),fullPage:true});
   }
   await page.locator('button[type=submit]').click();
   await page.locator('#intake-success').waitFor({state:'visible'});
   assert.equal(requests.length,1);checks++;
   assert.equal(requests[0].url(),api+'/api/consulting-leads');checks++;
   const sent=requests[0].postDataJSON();assert.equal(sent.plan,plan);assert.equal(sent.language,lang);checks+=2;
   if(pre){assert.ok(!('occupancy_optional' in sent.form_data));assert.ok(!sent.airbnb_url);checks+=2;}
   const state=await json(api+'/__qa/state');const row=state.rows.at(-1);
   assert.equal(row.plan,plan);assert.equal(row.language,lang);assert.equal(row.listing_status,stage);assert.equal(row.notification_status,'sent');checks+=4;
   assert.ok(!await page.evaluate(()=>!!window.PPA_CONFIG||!!window.consultationTrack||!!window.dataLayer));checks++;
   assert.equal(await page.locator('#intake-success').evaluate(el=>document.activeElement===el),true);checks++;
   assert.deepEqual(errors,[]);assert.deepEqual(responses,[]);checks+=2;
   cases.push({language:lang,width,plan,stage,persisted:true,notification:'sent',overflow:false});await page.close();
  }
  console.log('PASS 64 ES/EN × mobile/desktop × plan/stage end-to-end cases.');
  for(const lang of ['es','en']){
   // Diagnostic remains gated even if someone guesses the public intake URL.
   let ctx=await open(lang,'diagnostic_session','active',390,false);
   assert.equal(await ctx.page.locator('#consulting-form').isVisible(),false);assert.equal(ctx.requests.length,0);checks+=2;await ctx.page.close();
   // Required fields, malformed email/URL, optional blank metrics and changing branches.
   ctx=await open(lang,'growth_advisory','active');let {page,payload,requests}=ctx;
   await page.locator('button[type=submit]').click();assert.equal(requests.length,0);assert.ok(await page.locator('#intake-errors').isVisible());checks+=2;
   await fill(page,payload);await page.locator('[name=email]').fill('wrong@');await page.locator('button[type=submit]').click();assert.equal(requests.length,0);checks++;
   await page.locator('[name=email]').fill('test@example.com');await page.locator('[name=airbnb_url]').fill('https://airbnb.com.evil.example/');await page.locator('button[type=submit]').click();assert.equal(requests.length,0);checks++;
   await page.locator('[name=occupancy_optional]').fill('72');
   await page.locator('[name=listing_status]').selectOption('not_published');assert.equal(await page.locator('[name=occupancy_optional]').inputValue(),'');assert.equal(await page.locator('[name=airbnb_url]').inputValue(),'');checks+=2;
   const pre=await json(api+`/__qa/example?plan=growth_advisory&stage=not_published&language=${lang}`);await fill(page,pre);
   await page.locator('button[type=submit]').click();await page.locator('#intake-success').waitFor();assert.ok(!('occupancy_optional' in requests[0].postDataJSON().form_data));checks++;await page.close();
   // API storage failure keeps user input. Retry is durable, duplicate submit is guarded.
   ctx=await open(lang,'host_starter','preparing');({page,payload,requests}=ctx);await fill(page,payload);
   await json(api+'/__qa/config',{storage_fail:true});const initial=(await json(api+'/__qa/state')).rows.length;
   await page.locator('button[type=submit]').click();await page.locator('#intake-errors').waitFor();
   assert.equal(await page.locator('[name=full_name]').inputValue(),payload.full_name);assert.equal((await json(api+'/__qa/state')).rows.length,initial);checks+=2;
   await json(api+'/__qa/config',{storage_fail:false,notify_fail:true,delay:.3});
   await page.locator('#consulting-form').evaluate(form=>{form.requestSubmit();form.requestSubmit();});
   await page.locator('#intake-success').waitFor();let state=await json(api+'/__qa/state');assert.equal(state.rows.length,initial+1);assert.equal(state.rows.at(-1).notification_status,'failed');checks+=2;
   assert.equal(requests.length,2);assert.equal(requests[0].postDataJSON().submission_id,requests[1].postDataJSON().submission_id);checks+=2;
   await page.screenshot({path:path.join(out,`${lang}-success-brevo-failure-390.png`),fullPage:false});await page.close();
   await json(api+'/__qa/config',{notify_fail:false,delay:0});
   // Lost HTTP response AFTER persistence: resubmitting creates neither a lead nor an email.
   ctx=await open(lang,'launch_pro','active');({page,payload,requests}=ctx);await fill(page,payload);let first=true;
   await page.route(api+'/api/consulting-leads',async route=>{if(first){first=false;await route.fetch();return route.abort('failed');}return route.continue();});
   const before=await json(api+'/__qa/state');await page.locator('button[type=submit]').click();await page.locator('#intake-errors').waitFor();
   await page.locator('button[type=submit]').click();await page.locator('#intake-success').waitFor();state=await json(api+'/__qa/state');
   assert.equal(state.rows.length,before.rows.length+1);assert.equal(state.notifications.length,before.notifications.length+1);checks+=2;await page.close();
  }
  const final=await json(api+'/__qa/state');
  fs.writeFileSync(path.join(out,'browser-results.json'),JSON.stringify({checks,cases,storedSyntheticLeads:final.rows.length,provider:'fake Brevo',database:'local PostgreSQL 16.2',productionRequests:0},null,2));
  console.log(`PASS ${checks} assertions; validation, branches, persistence, duplicate prevention, API errors and Brevo failure retention.`);
 }finally{
  if(browser)await browser.close();await new Promise(resolve=>web.close(resolve));
  if(child.exitCode===null){child.kill('SIGTERM');await new Promise(resolve=>child.once('exit',resolve));}
 }
})().catch(error=>{console.error(error);process.exitCode=1;});
