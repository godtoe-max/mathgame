const assert=require('node:assert/strict'),M=require('./math.js'),P=require('./path.js');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
(async()=>{const b=await chromium.launch({channel:'msedge',headless:true});try{
 const p=await b.newPage(),state=P.init(M.fresh());state.learningPath.introSeen=true;
 for(const l of P.levels)state.learningPath.progress[l.id]={count:l.required,independent:l.independent};
 await p.goto('http://localhost:4173');await p.evaluate(s=>localStorage.setItem('lilly-little-wilds-v1',JSON.stringify(s)),state);await p.reload();
 const overlap=(a,b)=>a.x<b.x+b.width&&a.x+a.width>b.x&&a.y<b.y+b.height&&a.y+a.height>b.y;
 for(const width of [320,390,1400]){await p.setViewportSize({width,height:1000});for(let world=0;world<4;world++){
  await p.locator('#worldTabs button').nth(world).click();const nodes=await p.locator('.levelNode').all();assert.equal(nodes.length,12);
  const boxes=await Promise.all(nodes.map(n=>n.boundingBox())),gate=await p.locator('.worldFinish').boundingBox(),score=await p.locator('#worldClear').boundingBox();
  for(let i=0;i<boxes.length;i++){assert(!overlap(boxes[i],gate),'Gate overlaps level '+i+' at '+width);for(let j=i+1;j<boxes.length;j++)assert(!overlap(boxes[i],boxes[j]),'Level markers overlap at '+width);}
  assert(!overlap(gate,score));assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  if(world===0&&width===390)await p.locator('#levelMap').screenshot({path:'tests/artifacts/expanded-map-mobile.png'});
 }}
 console.log('Passed all four twelve-marker maps at320px/390px/1400px: no marker/gate overlap or horizontal overflow.');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1});
