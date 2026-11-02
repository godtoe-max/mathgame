const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const storageKey='lilly-little-wilds-v1';
function solve(text){const s=text.replace(/= \?/g,'').trim().replaceAll('−','-').replaceAll('×','*').replaceAll('÷','/');assert(/^[\d\s+*\/\-]+$/.test(s));return Function('return ('+s+')')();}
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1100}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  const saved=()=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)),storageKey);
  async function ready(){await page.waitForFunction(()=>Adventure.snapshot().ready);}
  async function lesson(){if(await page.locator('#nextTeach').isVisible()){while(await page.locator('#nextTeach').isVisible())await page.locator('#nextTeach').click();await page.locator('#answerForm [type="submit"]').click();}}
  async function encounter(i){await page.locator('[data-friend="'+i+'"]').click();await page.locator('#math').waitFor({state:'visible'});await lesson();}
  async function answer(){const expr=await page.locator('#equation').innerText();await page.locator('#answer').fill(String(solve(expr)));await page.locator('#answerForm [type="submit"]').click();}
  async function reload(){await page.reload();await ready();assert(await page.locator('#storyScene').isHidden());}
  await page.goto('http://localhost:4173');await ready();await page.locator('#sceneContinue').click();
  await encounter(0);await answer();
  let state=await saved();assert.equal(state.adventure.quests['0:add'].count,1);assert.equal(state.stars,1);
  await reload();assert.match(await page.locator('#objective').innerText(),/1 of 3/);
  await encounter(0);assert.match(await page.locator('#skill').innerText(),/YOUR TURN/);await answer();
  state=await saved();assert.equal(state.adventure.quests['0:add'].count,2);assert.equal(state.adventure.quests['0:add'].independent,1);
  await reload();await encounter(0);
  assert.equal((await page.locator('#equation').innerText()).match(/[+−×÷]/g).length,2);
  await page.locator('#hint').click();assert.match(await page.locator('#explanation').innerText(),/Then take away \d+.*Write down the first result/s);
  await answer();assert.match(await page.locator('#feedback').innerText(),/earned Glowing clover invitations/);
  await reload();assert.match(await page.locator('#satchel').innerText(),/1 \/ 12/);
  await encounter(0);await answer();await page.locator('#answerForm [type="submit"]').click();
  assert(await page.locator('#math').isVisible());state=await saved();assert.equal(state.adventure.quests['0:add'].count,3);assert.equal(state.stars,4);
  assert.match(await page.locator('#satchel').innerText(),/1 \/ 12/);await page.locator('#close').click();
  for(let friend=1;friend<4;friend++){
   await encounter(friend);
   for(let stage=0;stage<3;stage++){await lesson();await answer();await page.locator('#answerForm [type="submit"]').click();}
   await page.locator('#sceneContinue').click();
   if(friend===3)await page.locator('#sceneContinue').click();
  }
  state=await saved();assert.equal(state.adventure.currentChapter,1);
  await encounter(0);await answer();await reload();
  assert.equal((await page.evaluate(()=>Adventure.snapshot())).area,1);
  assert.match(await page.locator('#objective').innerText(),/1 of 3/);assert.match(await page.locator('#satchel').innerText(),/4 \/ 12/);
  await encounter(0);await answer();await page.locator('#answerForm [type="submit"]').click();await lesson();
  await page.setViewportSize({width:390,height:844});await page.locator('#hint').click();
  assert.match(await page.locator('#explanation').innerText(),/Write down the first result/);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await answer();await reload();assert.equal((await page.evaluate(()=>Adventure.snapshot())).area,1);
  assert.match(await page.locator('#satchel').innerText(),/5 \/ 12/);
  assert.deepEqual(errors,[]);
  console.log('Passed real browser partial quest persistence, independent attempts, compound hints, reward replay, chapter resume, and mobile compound input.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
