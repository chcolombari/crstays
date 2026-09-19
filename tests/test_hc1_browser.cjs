// Run with Playwright available in NODE_PATH. Uses local pages; no submissions.
const {chromium} = require('playwright');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const slugs = ['diagnostic-session','host-starter','launch-pro','growth-advisory'];
const routes = ['', '/En'].flatMap(prefix => [prefix+'/host-consulting.html', ...slugs.map(s=>prefix+'/host-consulting/'+s+'.html')]);
const out = process.env.HC_QA_OUTPUT || '/private/tmp/hc1-qa';
fs.mkdirSync(out,{recursive:true});
const server=http.createServer((req,res)=>{
  const url=new URL(req.url,'http://localhost');
  const file=path.resolve(root,'.'+decodeURIComponent(url.pathname)+(url.pathname.endsWith('/')?'index.html':''));
  if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  fs.readFile(file,(error,data)=>{
    if(error){res.writeHead(404).end();return;}
    const ext=path.extname(file);
    res.setHeader('Content-Type',({'.js':'text/javascript','.css':'text/css','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml'})[ext]||'text/html');
    res.setHeader('Cache-Control','no-store');res.end(data);
  });
});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const origin=`http://127.0.0.1:${server.address().port}`;
 let browser;let checks=0;const results=[];
 try{
  browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
  for(const route of routes){
   for(const width of [320,360,390,768,1024,1440]){
    const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
    const errors=[];const failures=[];const requests=[];
    page.on('pageerror',error=>errors.push(error.message));
    page.on('response',response=>{if(response.url().startsWith(origin)&&response.status()>=400)failures.push(response.url());});
    page.on('request',request=>requests.push(request.url()));
    await page.route('**/*',request=>{
      const url=request.request().url();
      if(url.endsWith('/analyzer/config.js'))return request.fulfill({contentType:'text/javascript',body:'window.PPA_CONFIG={};'});
      if(url.startsWith(origin)||url.startsWith('https://fonts.googleapis.com/')||url.startsWith('https://fonts.gstatic.com/'))return request.continue();
      return request.fulfill({body:''});
    });
    await page.goto(origin+route,{waitUntil:'networkidle'});
    await page.evaluate(()=>document.fonts.ready);
    const actual=await page.evaluate(()=>({width:document.documentElement.scrollWidth,lang:document.documentElement.lang,h1:document.querySelectorAll('h1').length,ids:[...document.querySelectorAll('[id]')].map(x=>x.id),links:[...document.querySelectorAll('a[href]')].map(x=>x.getAttribute('href')),canonical:document.querySelector('link[rel="canonical"]').href,forms:document.forms.length,text:document.querySelector('main').innerText,fonts:document.fonts.check('16px Montserrat')&&document.fonts.check('16px "Hammersmith One"')}));
    assert.ok(actual.width<=width,`${route} @${width}: overflow ${actual.width}`);checks++;
    assert.equal(actual.h1,1);assert.equal(actual.forms,0);checks+=2;
    assert.equal(actual.lang,route.startsWith('/En/')?'en':'es');checks++;
    assert.equal(new Set(actual.ids).size,actual.ids.length,`${route}: duplicate IDs`);checks++;
    assert.equal(actual.canonical,'https://www.crstays.com'+route);checks++;
    assert.ok(!/[\u{1F300}-\u{1FAFF}\u{1F1E6}-\u{1F1FF}]/u.test(actual.text));checks++;
    assert.ok(!requests.some(u=>/supabase|calendly|brevo|\/api\//i.test(u)));checks++;
    assert.deepEqual(errors,[]);assert.deepEqual(failures,[]);checks+=2;
    for(const href of actual.links){
      if(/^(mailto:|https?:)/.test(href))continue;
      assert.notEqual(href,'#','No empty destinations');
      const url=new URL(href,origin+route);
      const local=path.join(root,url.pathname)+(url.pathname.endsWith('/')?'index.html':'');
      assert.ok(fs.existsSync(local),`${route}: missing ${href}`);checks++;
      if(url.hash){const html=fs.readFileSync(local,'utf8');assert.ok(html.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`),`${route}: missing fragment ${href}`);checks++;}
    }
    for(const selector of ['.hero-btns .btn-gold','.hero-btns .btn-outline']){
      for(const el of await page.locator(selector).all()){
        const box=await el.boundingBox();assert.ok(box.height>=44&&box.width>=44);checks++;
        assert.ok(!(await el.getAttribute('href')).includes('wa.me'));checks++;
      }
    }
    if(width<951){
      await page.locator('.menu-toggle').click();assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'true');checks++;
      assert.ok(await page.locator('#site-navigation').isVisible());checks++;
      await page.keyboard.press('Escape');assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');checks++;
    }
    const main=route.endsWith('/host-consulting.html');
    if(main){
      assert.equal(await page.locator('#for-you .hc-card').count(),6);assert.equal(await page.locator('#kit .kit-item').count(),10);checks+=2;
      const columns=await page.locator('#for-you .hc-grid').evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length);
      assert.equal(columns,width<=700?1:3);checks++;
      const pillarCols=await page.locator('#work-together .hc-grid').evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length);
      assert.equal(pillarCols,width<=700?1:2);checks++;
      await page.locator('.faq-item summary').first().click();assert.ok(await page.locator('.faq-item').first().getAttribute('open')!==null);checks++;
      await page.locator('.hc-hero .btn-gold').click();assert.ok(/#(packages|paquetes)$/.test(page.url()));checks++;
      for(let i=0;i<slugs.length;i++){assert.ok((await page.locator('.plan-card .btn-gold').nth(i).getAttribute('href')).endsWith('/'+slugs[i]+'.html'));checks++;}
    }else{
      if(route.endsWith('/diagnostic-session.html')){
        await page.locator('.hc-hero .btn-gold').click();assert.ok(page.url().endsWith('#next-steps'));checks++;
        assert.ok(await page.locator('#next-steps a[href^="mailto:"]').isVisible());checks++;
      }else{
        const slug=path.basename(route,'.html');
        const intake=(route.startsWith('/En/')?'/En':'')+'/host-consulting/intake.html?plan='+slug;
        assert.equal(await page.locator('.hc-hero .btn-gold').getAttribute('href'),intake);checks++;
        assert.equal(await page.locator('#next-steps .btn-gold').getAttribute('href'),intake);checks++;
      }
    }
    const opposite=route.startsWith('/En/')?route.slice(3):'/En'+route;
    assert.equal(await page.locator('.lang-switch').getAttribute('href'),opposite);checks++;
    if(width===390||width===1440){
      await page.evaluate(()=>scrollTo(0,0));
      const name=(route.startsWith('/En/')?'en':'es')+'-'+(main?'main':path.basename(route,'.html'))+'-'+width;
      await page.screenshot({path:path.join(out,name+'.png'),fullPage:true});
      if(main){await page.locator('#for-you').screenshot({path:path.join(out,name+'-audience.png')});await page.locator('.plan-card').first().scrollIntoViewIfNeeded();await page.locator(route.startsWith('/En/')?'#packages':'#paquetes').screenshot({path:path.join(out,name+'-plans.png')});}
    }
    results.push({route,width,fontsLoaded:actual.fonts,overflow:false});
    await page.locator('.lang-switch').click();
    assert.equal(new URL(page.url()).pathname,opposite);checks++;
    await page.close();
   }
   console.log(`PASS ${route}: 320, 360, 390, 768, 1024, 1440px`);
  }
  // Static content and language switching remain available if JavaScript is disabled.
  const nojs=await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:844}});
  for(const route of routes){await nojs.goto(origin+route);assert.ok(await nojs.locator('h1').isVisible());assert.ok(await nojs.locator('#site-navigation').isVisible());assert.ok(await nojs.locator('.lang-switch').isVisible());checks+=3;}
  await nojs.close();
  fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({checks,results},null,2));
  console.log(`PASS ${checks} assertions; 60 viewport/page combinations; no-JS navigation on all 10 pages.`);
 }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(error=>{console.error(error);process.exitCode=1;});
