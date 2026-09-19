// Run: NODE_PATH=<directory containing playwright> node tests/test_phase5f_browser.cjs
// Uses installed Chrome, local files and mocked API/GA only. No production requests.
const {chromium} = require('playwright');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname,'..');
(async () => {
  const server = http.createServer((req,res) => {
    const pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    let file = path.join(root,pathname);
    if (pathname.endsWith('/')) file += 'index.html';
    if (!file.startsWith(root + path.sep)) {res.writeHead(403).end();return;}
    fs.readFile(file,(err,data) => {
      if(err) {res.writeHead(404).end();return;}
      res.setHeader('Cache-Control','no-store');
      res.setHeader('Content-Type', file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : file.endsWith('.png') ? 'image/png' : file.endsWith('.jpg') ? 'image/jpeg' : 'text/html');
      res.end(data);
    });
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  let browser;
  try {
    browser = await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
    let checks=0;
    for (const lang of ['es','en']) for (const width of [390,1280]) {
      const page=await browser.newPage({viewport:{width,height:844}});
      const errors=[]; page.on('pageerror',e=>errors.push(e.message));
      const submissions=[];let fail=true;
      const origin=`http://127.0.0.1:${server.address().port}`;
      await page.route('**/*',async route=>{
        const url=route.request().url();
        if(url.endsWith('/analyzer/config.js')) return route.fulfill({contentType:'text/javascript',body:'window.PPA_CONFIG={apiBaseUrl:"https://test.invalid",gaMeasurementId:"G-1234567890"};'});
        if(url==='https://test.invalid/api/consultation-leads') {
          submissions.push(route.request().postDataJSON());
          await new Promise(r=>setTimeout(r,100));
          return route.fulfill({status:fail?503:201,contentType:'application/json',body:JSON.stringify({status:fail?'unavailable':'received'})});
        }
        if(!url.startsWith(origin)) return route.fulfill({status:200,body:''});
        return route.continue();
      });
      const homepage=lang==='en'?'En/index.html':'index.html';
      const baseline=require('node:child_process').execFileSync('git',['show','a4222ebe649e98879a25361343551cf2ce5982f1:'+homepage],{cwd:root,encoding:'utf8'});
      await page.route(origin+'/baseline',route=>route.fulfill({contentType:'text/html',body:baseline}));
      await page.goto(origin+'/baseline');
      const baselineWidth=await page.evaluate(()=>document.documentElement.scrollWidth);
      await page.goto(origin+(lang==='en'?'/En/':'/'));
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth)<=baselineWidth); checks++;
      console.log(`Existing main page width ${lang}/${width}: ${baselineWidth}; no new overflow.`);
      await page.locator('#consultation-form button').click();
      assert.equal(submissions.length,0);checks++;
      for(const [key,value] of Object.entries({name:'Test Owner',email:'owner@example.com',phone:'+506 88881234',property_location:'Escazú'})) await page.locator(`[name="${key}"]`).fill(value);
      await page.locator('[name="currently_operating"]').selectOption('false');
      await page.locator('[name="requested_service"]').selectOption('operational_management');
      await page.locator('#consultation-form button').click();
      await page.locator('#consultation-error').waitFor({state:'visible'});
      assert.equal(await page.locator('[name="name"]').inputValue(),'Test Owner');checks++;
      fail=false;
      await page.locator('#consultation-form button').click();
      await page.locator('#consultation-form').evaluate(f => { f.dispatchEvent(new Event('submit',{cancelable:true})); });
      await page.locator('#consultation-success').waitFor({state:'visible'});
      assert.equal(await page.locator('#consultation-form').isVisible(),false);checks++;
      assert.equal(submissions.length,2);checks++;
      assert.equal(submissions[1].language,lang);assert.equal(submissions[1].currently_operating,false);checks+=2;
      assert.equal(submissions[1].source,'homepage_private_consultation');checks++;
      assert.ok((await page.locator('#consultation-success').innerText()).includes(lang==='en'?'Thank you. We received your request.':'Gracias. Recibimos tu solicitud.'));checks++;
      assert.ok(await page.locator('.consultation-secondary a').isVisible());checks++;
      const events=await page.evaluate(()=>dataLayer.filter(x=>x[0]==='event').map(x=>[x[1],x[2]]));
      assert.equal(events.filter(x=>x[0]==='consultation_form_started').length,1);checks++;
      assert.equal(events.filter(x=>x[0]==='consultation_form_submitted').length,1);checks++;
      assert.ok(events.some(x=>x[0]==='consultation_form_error'));checks++;
      assert.ok(!JSON.stringify(events).includes('owner@example.com'));checks++;
      const contactOverflow=await page.locator('#contacto').evaluate(section=>[section,...section.querySelectorAll('*')].filter(x=>x.getBoundingClientRect().width && (x.getBoundingClientRect().right>innerWidth+1 || x.getBoundingClientRect().left < -1)).map(x=>x.className)); assert.deepEqual(contactOverflow,[]);checks++;
      assert.deepEqual(errors,[]);checks++;
      await page.screenshot({path:`/private/tmp/phase5f-${lang}-${width}.png`,fullPage:false});
      await page.close();
    }
    const page = await browser.newPage();
    const origin=`http://127.0.0.1:${server.address().port}`;
    await page.route('**/*', route => {
      const url=route.request().url();
      if(url.endsWith('/analyzer/config.js')) return route.fulfill({contentType:'text/javascript',body:'window.PPA_CONFIG={gaMeasurementId:"G-1234567890"};'});
      if(!url.startsWith(origin)) return route.fulfill({body:''});
      return route.continue();
    });
    for(const route of ['/','/En/']) {
      await page.goto(origin+route);
      await page.evaluate(()=>{
        document.querySelector('a[href="#contacto"]').click();
        document.querySelector('a[href*="host-consulting.html"]').addEventListener('click',e=>e.preventDefault());
        document.querySelector('a[href*="host-consulting.html"]').click();
        const wa=document.querySelector('a[href*="wa.me"]');wa.addEventListener('click',e=>e.preventDefault());wa.click();
      });
      const events=await page.evaluate(()=>dataLayer.filter(x=>x[0]==='event').map(x=>x[1]));
      for(const event of ['property_management_cta_clicked','host_consulting_cta_clicked','whatsapp_clicked']) {assert.ok(events.includes(event));checks++;}
    }
    for(const route of ['/host-consulting.html','/En/host-consulting.html']) {
      await page.goto(origin+route);
      await page.evaluate(()=>{const wa=document.querySelector('a[href*="wa.me"]');wa.addEventListener('click',e=>e.preventDefault());wa.click();});
      const events=await page.evaluate(()=>dataLayer.filter(x=>x[0]==='event').map(x=>x[1]));
      assert.ok(events.includes('host_consulting_cta_clicked'));assert.ok(events.includes('whatsapp_clicked'));checks+=2;
    }
    await page.close();
    console.log(`PASS ${checks} browser assertions: ES/EN × mobile/desktop; validation, errors, retry, success, privacy, layout.`);
  } finally {if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(e=>{console.error(e);process.exitCode=1;});
