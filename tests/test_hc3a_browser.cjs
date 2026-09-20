// HC-3A browser QA: bilingual Intro Call routing, application success CTAs and payment gates.
const {chromium}=require('playwright-core');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
let checks=0;const cases=[];
const web=http.createServer((req,res)=>{
  const pathname=new URL(req.url,'http://localhost').pathname;
  const file=path.resolve(root,'.'+decodeURIComponent(pathname)+(pathname.endsWith('/')?'index.html':''));
  if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  fs.readFile(file,(error,data)=>{if(error){res.writeHead(404).end();return;}
    res.setHeader('Content-Type',({'.js':'text/javascript','.json':'application/json','.css':'text/css','.png':'image/png','.jpg':'image/jpeg'})[path.extname(file)]||'text/html');
    res.setHeader('Cache-Control','no-store');res.end(data);
  });
});
async function fillRequired(page){
  for(let pass=0;pass<4;pass++){
    const controls=page.locator('#consulting-form input:visible, #consulting-form select:visible, #consulting-form textarea:visible');
    for(let i=0;i<await controls.count();i++){
      const control=controls.nth(i);if(!await control.isEnabled())continue;
      const tag=await control.evaluate(el=>el.tagName),type=await control.getAttribute('type'),name=await control.getAttribute('name');
      if(type==='checkbox')continue;
      if(tag==='SELECT'&&!await control.inputValue()){
        const values=await control.locator('option').evaluateAll(options=>options.map(o=>o.value).filter(Boolean));
        if(values.length)await control.selectOption(values[0]);
      }else if(!await control.inputValue()){
        const value=type==='email'?'qa.hc3a@example.com':type==='tel'?'+50670000000':type==='url'?'https://www.airbnb.com/rooms/123456':type==='date'?'2027-01-15':type==='number'?'50':name==='full_name'?'QA HC3A Browser':'QA HC3A test value';
        await control.fill(value);
      }
    }
    const groups=page.locator('#consulting-form fieldset.intake-field:visible');
    for(let i=0;i<await groups.count();i++){
      const group=groups.nth(i),checked=group.locator('input[type=checkbox]:checked');
      if(!await checked.count())await group.locator('input[type=checkbox]').first().check();
    }
  }
}
(async()=>{
  let browser;
  try{
    await new Promise(resolve=>web.listen(0,'127.0.0.1',resolve));
    const origin=`http://127.0.0.1:${web.address().port}`;
    browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
    for(const lang of ['es','en'])for(const width of [390,1440]){
      const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'}),errors=[];
      page.on('pageerror',error=>errors.push(error.message));
      await page.route('https://fonts.googleapis.com/**',route=>route.fulfill({body:''}));
      await page.route('https://fonts.gstatic.com/**',route=>route.fulfill({body:''}));
      await page.route('https://www.googletagmanager.com/**',route=>route.fulfill({contentType:'text/javascript',body:''}));
      await page.route(origin+'/analyzer/config.js',route=>route.fulfill({contentType:'text/javascript',body:"window.PPA_CONFIG={gaMeasurementId:'G-ABCDEFGHIJ'};"}));
      const route=(lang==='en'?'/En':'')+'/host-consulting/intro-call.html';
      await page.goto(origin+route,{waitUntil:'networkidle'});
      assert.equal(await page.locator('h1').count(),1);checks++;
      assert.equal(await page.locator('a[href="https://calendly.com/crstays/15min"]').count(),2);checks++;
      assert.equal(await page.locator('.btn-gold[href="https://calendly.com/crstays/15min"]').first().innerText(),lang==='es'?'AGENDAR LLAMADA INTRODUCTORIA GRATUITA':'SCHEDULE FREE INTRODUCTORY CALL');checks++;
      assert.equal(await page.locator('.next-steps li').count(),5);checks++;
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);checks++;
      assert.ok((await page.locator('.btn-gold').first().boundingBox()).height>=44);checks++;
      await page.locator('a[href="https://calendly.com/crstays/15min"]').first().evaluate(el=>el.addEventListener('click',event=>event.preventDefault()));
      await page.locator('a[href="https://calendly.com/crstays/15min"]').first().click();
      const tracked=await page.evaluate(()=>window.dataLayer.filter(item=>item[0]==='event').map(item=>item[1]));
      assert.ok(tracked.includes('intro_call_click'));assert.ok(tracked.includes('calendly_click'));checks+=2;
      assert.deepEqual(errors,[]);checks++;
      cases.push({language:lang,width,page:'intro_call',calendlyUrl:'https://calendly.com/crstays/15min',overflow:false,consoleErrors:0});
      await page.close();
    }
    for(const lang of ['es','en'])for(const plan of ['launch-pro','growth-advisory']){
      const page=await browser.newPage({viewport:{width:390,height:900}}),errors=[];
      page.on('pageerror',error=>errors.push(error.message));
      await page.route(origin+'/assets/consulting-config.js',route=>route.fulfill({contentType:'text/javascript',body:`window.CONSULTING_CONFIG={apiBaseUrl:${JSON.stringify(origin)}};`}));
      await page.route(origin+'/api/consulting-leads',route=>route.fulfill({status:201,contentType:'application/json',body:'{"status":"received"}'}));
      await page.goto(origin+(lang==='en'?'/En':'')+'/host-consulting/intake.html?plan='+plan,{waitUntil:'networkidle'});
      await fillRequired(page);await page.locator('button[type=submit]').click();
      await page.locator('#intake-success').waitFor({state:'visible'});
      const action=page.locator('#success-action');
      assert.equal(await action.getAttribute('href'),'https://calendly.com/crstays/15min');checks++;
      assert.equal(await action.innerText(),lang==='es'?'AGENDAR LLAMADA INTRODUCTORIA GRATUITA':'SCHEDULE FREE INTRODUCTORY CALL');checks++;
      assert.equal(await action.getAttribute('data-plan'),plan.replaceAll('-','_'));checks++;
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);checks++;
      assert.deepEqual(errors,[]);checks++;
      cases.push({language:lang,width:390,page:'application_success',plan,calendlyUrl:'https://calendly.com/crstays/15min'});
      await page.close();
    }
    for(const lang of ['es','en']){
      let page=await browser.newPage({viewport:{width:390,height:900}});
      await page.goto(origin+(lang==='en'?'/En':'')+'/host-consulting/intake.html?plan=host-starter',{waitUntil:'networkidle'});
      assert.ok((await page.locator('#success-action').getAttribute('href')).startsWith('mailto:'));checks++;
      assert.equal(await page.locator('a[href="https://calendly.com/crstays/15min"]').count(),0);checks++;
      await page.close();
      page=await browser.newPage({viewport:{width:390,height:900}});
      await page.goto(origin+(lang==='en'?'/En':'')+'/host-consulting/intake.html?plan=diagnostic-session',{waitUntil:'networkidle'});
      assert.equal(await page.locator('#consulting-form').isVisible(),false);checks++;
      assert.ok((await page.locator('#intake-notice').innerText()).toLowerCase().includes(lang==='es'?'pago previo':'payment first'));checks++;
      assert.equal(await page.locator('a[href="https://calendly.com/crstays/15min"]').count(),0);checks++;
      await page.close();
      cases.push({language:lang,width:390,page:'payment_gates',hostStarterBypass:false,diagnosticBypass:false});
    }
    console.log(`PASS ${checks} HC-3A browser assertions.`);
    console.log(JSON.stringify({checks,cases},null,2));
  }finally{if(browser)await browser.close();await new Promise(resolve=>web.close(resolve));}
})().catch(error=>{console.error(error);process.exitCode=1;});
