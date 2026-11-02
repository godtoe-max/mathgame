const assert=require('node:assert/strict'),fs=require('node:fs');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
function solve(text){const [lhs,rhs]=text.split(' = ');if(rhs==='?'){const x=lhs.replaceAll('−','-').replaceAll('×','*').replaceAll('÷','/');assert(/^[\d\s+*\/\-]+$/.test(x));return Function('return ('+x+')')();}const [a,op,b]=lhs.split(' '),n=Number(rhs);if(a==='?')return op==='+'?n-Number(b):op==='−'?n+Number(b):op==='×'?n/Number(b):n*Number(b);return op==='+'?n-Number(a):op==='−'?Number(a)-n:op==='×'?n/Number(a):Number(a)/n;}
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 const page=await browser.newPage({viewport:{width:1400,height:1100}}),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 await page.goto('http://localhost:4173');await page.locator('#sceneContinue').click();
 const submit=page.locator('#answerForm [type="submit"]');
 async function lesson(){if(await page.locator('#nextTeach').isVisible()){assert(await submit.isDisabled());while(await page.locator('#nextTeach').isVisible())await page.locator('#nextTeach').click();await submit.click();}}
 async function answer(){await page.locator('#answer').fill(String(solve(await page.locator('#equation').innerText())));await submit.click();}
 assert.equal(await page.locator('#worldTabs button').count(),4);assert(await page.locator('#worldTabs button').nth(1).isDisabled());assert(await page.locator('[data-level="1"]').isDisabled());assert(await page.locator('[data-level="2"]').isDisabled());
 fs.mkdirSync('tests/artifacts',{recursive:true});await page.screenshot({path:'tests/artifacts/math-path-desktop.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:'tests/artifacts/math-path-mobile.png',fullPage:true});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.setViewportSize({width:1400,height:1100});
 await page.locator('#games').click();assert(await page.locator('[data-game="trail"]').isDisabled());await page.locator('[data-game="challenge"]').click();
 await page.locator('#arcadeLevel').selectOption('3');await page.locator('#arcadeOperation').selectOption('multiply');
 for(let i=0;i<3;i++){await page.locator('#arcadeInput').fill(String(solve(await page.locator('#arcadeQuestion').innerText())));await page.locator('#arcadeSubmit').click();assert.match(await page.locator('#arcadeFeedback').innerText(),/Lovely/);await page.locator('#arcadeSubmit').click();}await page.locator('#closeArcade').click();
 let tasks=0;
 for(let id=0;id<48;id++){
  const w=Math.floor(id/12),stage=id%12;
  assert.match(await page.locator('#missionLevel').innerText(),new RegExp((w+1)+'–'+(stage+1)));
  assert(await page.locator('[data-level="'+id+'"]').isEnabled());if(stage<11)assert(await page.locator('[data-level="'+(id+1)+'"]').isDisabled());
  await page.locator('#enterLevel').click();
  for(let task=0;task<(stage===11?7:5);task++){
   await lesson();
   if(id===0&&task===0){await page.locator('#answer').fill('-99');await submit.click();assert.match(await page.locator('#feedback').innerText(),/thoughtful try/);await page.locator('#counterToggle').click();await page.locator('#addHundredCounter').click();await page.locator('#addTenCounter').click();await page.locator('#addCounter').click();assert.match(await page.locator('#counterCount').innerText(),/111 counters/);}
   if(task===(stage===11?6:4)){await page.locator('#hint').click();assert(await page.locator('#explanation').isVisible());}
   await answer();tasks++;
   if(id===0&&task===0){await page.reload();assert(await page.locator('#storyScene').isHidden());assert.match(await page.locator('#missionStatus').innerText(),/1 \/ 5/);await page.locator('#enterLevel').click();continue;}
   await submit.click();
  }
  if(id<47){assert(await page.locator('#storyScene').isVisible());if(stage===11)assert.match(await page.locator('#sceneTitle').innerText(),/world cleared/);await page.locator('#sceneContinue').click();if(stage===11)assert(await page.locator('#worldTabs button').nth(w+1).isEnabled());}
  else{assert.match(await page.locator('#sceneTitle').innerText(),/Every math world/);await page.locator('#sceneContinue').click();}
  console.log('Cleared level '+(w+1)+'–'+(stage+1));
 }
 assert.equal(tasks,248);assert(await page.locator('[data-game="trail"]').isEnabled());await page.locator('#closeArcadeMenu').click();assert.match(await page.locator('#satchel').innerText(),/48 \/ 48/);
 await page.screenshot({path:'tests/artifacts/math-path-finished.png',fullPage:true});
 await page.locator('#journal').click();assert.match(await page.locator('#journalEntries').innerText(),/World 4: Division Gardens/);assert.equal(await page.locator('#journalEntries p').count(),48);await page.locator('#closeJournal').click();
 // Existing minigame checks exercise actual choices, bag ordering and sharing controls.
 await require('./tests/minigame-check.cjs')(page,assert,solve);
 await page.locator('details summary').click();await page.locator('#difficulty').focus();await page.keyboard.press('ArrowDown');assert.equal(await page.locator('#difficulty').inputValue(),'challenge');await page.locator('#applyDifficulty').click();
 await page.reload();assert.match(await page.locator('#satchel').innerText(),/48 \/ 48/);assert.equal(await page.locator('#difficulty').inputValue(),'challenge');
 await page.locator('#worldTabs button').nth(0).click();await page.locator('[data-level="8"]').click();await lesson();assert.match(await page.locator('#skill').innerText(),/STEP 4/);
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:'tests/artifacts/math-path-lesson-mobile.png',fullPage:true});await answer();await submit.click();assert(await page.locator('#math').isVisible());assert.match(await page.locator('#satchel').innerText(),/48 \/ 48/);await page.locator('#close').click();
 await page.locator('details summary').click();page.once('dialog',d=>d.accept());await page.locator('#reset').click();await page.locator('#sceneContinue').click();assert.match(await page.locator('#satchel').innerText(),/0 \/ 48/);assert(await page.locator('#worldTabs button').nth(1).isDisabled());assert(await page.locator('[data-level="1"]').isDisabled());
 await page.reload();assert(await page.locator('#storyScene').isHidden());assert.match(await page.locator('#missionLevel').innerText(),/1–1/);assert.deepEqual(errors,[]);
 console.log('Passed all 48 map levels/248 tasks, world gates, save/resume, teaching, compound hints, counters, challenge, all minigames, harder settings, replay, reset and mobile.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
