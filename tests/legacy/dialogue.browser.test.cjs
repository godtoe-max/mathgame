const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const M=require('./math.js'),S=require('./story.js');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const errors=[],topics=[[/clovers/i,/pebbles/i,/lantern/i,/berries/i],[/blanket/i,/pinecones/i,/lights/i,/supplies/i],[/shell/i,/candles/i,/decorations/i,/festival/i]];
  for(let chapter=0;chapter<3;chapter++){
   const fixture=S.init(M.fresh());fixture.adventure.introSeen=true;fixture.adventure.visited=[0,1,2];fixture.adventure.currentChapter=chapter;
   for(let n=0;n<chapter;n++)for(const key of S.keys)fixture.adventure.quests[n+':'+key]={count:3,independent:1};
   const page=await browser.newPage({viewport:{width:chapter===2?390:1440,height:900}});
   page.on('pageerror',e=>errors.push(e.message));
   await page.addInitScript(state=>localStorage.setItem('lilly-little-wilds-v1',JSON.stringify(state)),fixture);
   await page.goto('http://localhost:4173');await page.waitForFunction(()=>Adventure.snapshot().ready);
   assert.equal((await page.evaluate(()=>Adventure.snapshot())).area,chapter);
   if(chapter===1){
    await page.locator('#look').click();
    const box=await page.locator('#world').boundingBox();
    await page.mouse.click(box.x+870/1100*box.width,box.y+370/620*box.height);
    assert.match(await page.locator('#message').innerText(),/lights/i,'Chicken should be clickable below the Lantern Shop sign');
    await page.locator('#talk').click();
    await page.mouse.click(box.x+870/1100*box.width,box.y+370/620*box.height);
    await page.locator('#math').waitFor({state:'visible'});assert.match(await page.locator('#story').innerText(),/lights/i);
    assert(await page.locator('#arcadeDialog').isHidden());await page.locator('#close').click();
   }
   for(let i=0;i<4;i++){
    await page.locator('#look').click();
    const point=await page.evaluate(index=>{const f=Adventure.encounters[index],t=Adventure.snapshot().sceneTime;return {x:f.x+Math.sin(t*.6+f.x)*11,y:f.y+Math.cos(t*.4+f.y)*4-25};},i);
    const box=await page.locator('#world').boundingBox();await page.mouse.click(box.x+point.x/1100*box.width,box.y+point.y/620*box.height);
    assert.match(await page.locator('#message').innerText(),topics[chapter][i]);
    assert(await page.locator('#math').isHidden());
    await page.locator('[data-friend="'+i+'"]').click();assert.match(await page.locator('#message').innerText(),topics[chapter][i]);
    await page.locator('#math').waitFor({state:'visible'});assert.match(await page.locator('#story').innerText(),topics[chapter][i]);
    await page.locator('#close').click();
   }
   await page.locator('#journal').click();assert.match(await page.locator('#fieldJournal').innerText(),/supplies you collect in the meadow, snowy woods, and oasis/);
   await page.locator('#closeJournal').click();assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   await page.close();
  }
  const complete=S.init(M.fresh());complete.adventure.introSeen=true;complete.adventure.visited=[0,1,2];complete.adventure.currentChapter=2;
  for(let n=0;n<3;n++)for(const key of S.keys)complete.adventure.quests[n+':'+key]={count:3,independent:1};
  const page=await browser.newPage({viewport:{width:390,height:844}});page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(state=>localStorage.setItem('lilly-little-wilds-v1',JSON.stringify(state)),complete);
  await page.goto('http://localhost:4173');await page.waitForFunction(()=>Adventure.snapshot().ready);
  await page.locator('[data-friend="0"]').click();assert.match(await page.locator('#message').innerText(),/shell garland.*practice together again/s);
  await page.locator('#math').waitFor({state:'visible'});await page.locator('#close').click();
  assert.match(await page.locator('#satchel').innerText(),/12 \/ 12/);assert.deepEqual(errors,[]);
  for(const [area,x,y,title] of [[0,440,358,/Number Trail/],[1,880,338,/Lantern Shop/],[2,685,368,/Fair Share Picnic/]]){
   await page.locator('[data-area="'+area+'"]').click();
   const box=await page.locator('#world').boundingBox();await page.mouse.click(box.x+x/1100*box.width,box.y+y/620*box.height);
   await page.locator('#arcadeDialog').waitFor({state:'visible'});assert.match(await page.locator('#arcadeTitle').innerText(),title);
   await page.locator('#closeArcade').click();
  }
  assert.deepEqual(errors,[]);
  console.log('Passed all 12 chapter greetings, journal, phone layout/replay, Chicken selection below the shop sign, and all three festival sign targets.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
