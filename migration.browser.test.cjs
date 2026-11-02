const assert=require('node:assert/strict'),M=require('./math.js'),S=require('./story.js');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
function solve(t){const s=t.replace(/= \?/g,'').replaceAll('−','-').replaceAll('×','*').replaceAll('÷','/');assert(/^[\d\s+*\/\-]+$/.test(s));return Function('return ('+s+')')();}
(async()=>{const b=await chromium.launch({channel:'msedge',headless:true});try{
 const old=S.init(M.fresh());old.stars=27;for(let c=0;c<3;c++)for(const key of S.keys)old.adventure.quests[c+':'+key]={count:3,independent:1};
 for(const alreadyImported of [false,true]){
  const fixture=JSON.parse(JSON.stringify(old));if(alreadyImported)fixture.learningPath={version:1,selected:1,introSeen:true};
  const p=await b.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto('http://localhost:4173');await p.evaluate(state=>localStorage.setItem('lilly-little-wilds-v1',JSON.stringify(state)),fixture);await p.reload();
  if(await p.locator('#storyScene').isVisible())await p.locator('#sceneContinue').click();
  const first=p.locator('[data-level="0"]');assert.equal(await first.locator('small').innerText(),'PLAY');assert(!await first.evaluate(el=>el.classList.contains('cleared')));assert(await p.locator('[data-level="1"]').isDisabled());assert(await p.locator('#worldTabs button').nth(1).isDisabled());assert.match(await p.locator('#satchel').innerText(),/0 \/ 48/);assert.match(await p.locator('#stars').innerText(),/27 kindness/);
  if(alreadyImported){
   const submit=p.locator('#answerForm [type="submit"]');await p.locator('#enterLevel').click();
   for(let task=0;task<5;task++){
    if(await p.locator('#nextTeach').isVisible()){while(await p.locator('#nextTeach').isVisible())await p.locator('#nextTeach').click();await submit.click();}
    await p.locator('#answer').fill(String(solve(await p.locator('#equation').innerText())));await submit.click();
    if(task===0){await p.reload();assert.equal(await first.locator('small').innerText(),'1/5 TASKS');assert(await p.locator('[data-level="1"]').isDisabled());await p.locator('#enterLevel').click();}else await submit.click();
   }
   await p.locator('#sceneContinue').click();await p.reload();assert.equal(await first.locator('small').innerText(),'CLEARED');assert(await p.locator('[data-level="1"]').isEnabled());
   const saved=await p.evaluate(()=>JSON.parse(localStorage.getItem('lilly-little-wilds-v1')));assert.equal(saved.learningPath.version,3);assert.equal(saved.learningPath.progress[0].count,5);assert(saved.learningPath.progress[0].independent>=2);assert.equal(saved.stars,32);assert.deepEqual(saved.adventure.quests,old.adventure.quests);
  }
  assert.deepEqual(errors,[]);await p.close();
 }
 const earned=M.fresh();earned.stars=33;earned.learningPath={version:2,selected:4,introSeen:true,progress:{0:{count:3,independent:1},3:{count:3,independent:1},4:{count:2,independent:1}}};const page=await b.newPage();await page.goto('http://localhost:4173');await page.evaluate(s=>localStorage.setItem('lilly-little-wilds-v1',JSON.stringify(s)),earned);await page.reload();assert.equal(await page.locator('[data-level="0"] small').innerText(),'CLEARED');assert.match(await page.locator('#satchel').innerText(),/2 \/ 48/);await page.locator('#enterLevel').click();const migrated=await page.evaluate(()=>JSON.parse(localStorage.getItem('lilly-little-wilds-v1')));assert.equal(migrated.learningPath.version,3);assert.equal(migrated.learningPath.progress[13].count,2);assert.equal(migrated.stars,33);await page.close();
 console.log('Passed old/adventure-import saves start at uncleared level1; partial work stays incomplete; actual level completion persists; old records/stars preserved.');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1});
