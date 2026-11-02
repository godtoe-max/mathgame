const assert = require('node:assert/strict');
const M = require('./math.js');
for (const key of Object.keys(M.operations)) for(let level=0;level<4;level++) for(let i=0;i<200;i++) {
 const p=M.generate(key,level);assert(Number.isInteger(p.answer));assert(p.answer>=0);
 if(key==='add')assert.equal(p.answer,p.a+p.b);
 if(key==='subtract')assert.equal(p.answer,p.a-p.b);
 if(key==='multiply')assert.equal(p.answer,p.a*p.b);
 if(key==='divide'){assert(p.b>0);assert.equal(p.a/p.b,p.answer);}
}
let s=M.fresh();M.record(s,'add',true);M.record(s,'add',true);assert.equal(s.skills.add.level,0);M.record(s,'add',true);assert.equal(s.skills.add.level,1);M.record(s,'add',false);assert.equal(s.skills.add.streak,0);assert.equal(s.stars,4);
for(let i=0;i<20;i++)M.record(s,'add',true);assert.equal(s.skills.add.level,3);
console.log('Passed: 3,200 generated problems, exact division, nonnegative subtraction, mastery progression, assisted practice, and level cap.');
