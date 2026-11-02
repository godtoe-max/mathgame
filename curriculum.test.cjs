const assert=require('node:assert/strict'),C=require('./curriculum.js'),P=require('./path.js');
let count=0;
for(const l of P.levels)for(let tier=0;tier<4;tier++)for(let stage=0;stage<10;stage++)for(let n=0;n<5;n++){
 const p=C.make(l,tier,stage);assert(Number.isInteger(p.answer)&&p.answer>=0);assert(p.b>0);
 const primary=l.key==='add'?p.a+p.b:l.key==='subtract'?p.a-p.b:l.key==='multiply'?p.a*p.b:p.a/p.b;
 assert.equal(p.primaryAnswer,primary);assert(Number.isInteger(primary)&&primary>=0);
 const expected=p.missing==='a'?p.a:p.missing==='b'?p.b:p.secondary?(p.secondary.symbol==='−'?primary-p.secondary.value:primary+p.secondary.value):primary;
 assert.equal(p.answer,expected);assert(p.story.includes(l.friend));assert(C.hint(p).length>30);
 const lesson=C.lesson(l,tier,stage);assert.equal(lesson.steps.length,3);assert(!/NaN|undefined/.test(JSON.stringify(lesson)));
 const [left,right]=lesson.equation.split(' = ');const expression=left.replaceAll('−','-').replaceAll('×','*').replaceAll('÷','/');assert(/^[\d\s+*\/\-]+$/.test(expression));assert.equal(Function('return ('+expression+')')(),Number(right));count++;
}
assert.equal(new Set(P.levels.map(l=>l.key+':'+l.title)).size,48);
assert.equal(P.levels.reduce((sum,l)=>sum+l.required,0),248);
console.log('Passed '+count+' curriculum problems and worked examples: 48 distinct topics, missing numbers, exact sharing, nonnegative results and 248 minimum tasks.');
