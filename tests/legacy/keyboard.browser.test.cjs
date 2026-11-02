const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const page=await browser.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://localhost:4173');await page.waitForFunction(()=>Adventure.snapshot().ready);
  await page.locator('#sceneContinue').click();
  const position=()=>page.evaluate(()=>Adventure.snapshot().player);
  await page.locator('details summary').click();await page.locator('#difficulty').focus();
  const start=await position();
  await page.keyboard.press('ArrowDown');
  assert.equal(await page.locator('#difficulty').inputValue(),'challenge');
  await page.waitForTimeout(200);assert.equal((await position()).y,start.y);
  await page.locator('#applyDifficulty').focus();await page.keyboard.press('Enter');
  assert.match(await page.locator('#message').innerText(),/Ready for a challenge/);
  await page.locator('#world').focus();
  await page.keyboard.down('ArrowRight');await page.waitForTimeout(350);
  assert((await position()).x>start.x+25);
  await page.keyboard.press('Tab');const stopped=await position();
  await page.waitForTimeout(250);assert.equal((await position()).x,stopped.x);
  await page.keyboard.up('ArrowRight');
  await page.locator('#world').focus();await page.keyboard.down('w');await page.waitForTimeout(250);
  await page.keyboard.up('w');assert((await position()).y<stopped.y-20);
  await page.locator('#games').click();await page.locator('[data-game="challenge"]').click();
  await page.locator('#arcadeLevel').focus();await page.keyboard.press('ArrowDown');
  assert.equal(await page.locator('#arcadeLevel').inputValue(),'3');
  const paused=await position();await page.waitForTimeout(200);assert.equal((await position()).x,paused.x);
  assert.deepEqual(errors,[]);
  console.log('Passed native keyboard difficulty selection, keyboard apply, arrow/WASD movement, Tab stops walking, and arcade selector/world pause.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
