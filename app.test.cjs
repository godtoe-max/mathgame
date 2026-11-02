const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');const elements=new Map();
function el(id){if(!elements.has(id))elements.set(id,{textContent:'',value:'',hidden:false,disabled:false,open:false,classList:{toggle(){}},setAttribute(){},addEventListener(){},focus(){},append(){},replaceChildren(){},showModal(){this.open=true},close(){this.open=false}});return elements.get(id);}
const saved={},S=require('./story.js');let adventureConfig;
const Adventure={encounters:S.keys.map((key,i)=>({key,name:['Bunny','Kitten','Chicken','Bear'][i]})),init(config){adventureConfig=config;config.onAreaChange(config.initialArea)},visit(i){adventureConfig.onEncounter(this.encounters[i].key,this.encounters[i]);},setArea(n){adventureConfig.onAreaChange(n);},celebrate(){},festival(){}};
const box={MathGarden:require('./math.js'),Storybook:S,PathCurriculum:require('./curriculum.js'),LearningPath:require('./path.js'),PathMap:{init(){},render(){}},MathLessons:require('./lessons.js'),Adventure,Arcade:{init(){},openMenu(){}},document:{getElementById:el,querySelector:el,querySelectorAll(){return []},createElement:()=>el(Math.random())},localStorage:{getItem:k=>saved[k]||null,setItem:(k,v)=>saved[k]=v},confirm:()=>true,console};vm.createContext(box);vm.runInContext(fs.readFileSync('app.js','utf8'),box);
assert(el('storyScene').open);el('sceneContinue').onclick();el('challenge').onclick();assert(el('math').open);assert(el('answer').hidden);const submit=()=>el('answerForm').onsubmit({preventDefault(){}});
submit();assert(el('answer').hidden);while(!el('nextTeach').hidden)el('nextTeach').onclick();submit();assert(!el('answer').hidden);assert(!el('explanation').hidden);el('answer').value='-1';submit();assert.match(el('feedback').textContent,/thoughtful try/);el('answer').value=String(vm.runInContext('problem.answer',box));submit();assert.equal(vm.runInContext('state.stars',box),1);assert.equal(vm.runInContext('state.skills.add.level',box),0);assert(el('answer').disabled);
el('review').onclick();assert(el('answer').hidden);while(!el('nextTeach').hidden)el('nextTeach').onclick();submit();assert(!el('answer').disabled);el('close').onclick();
el('difficulty').value='challenge';el('applyDifficulty').onclick();assert.equal(vm.runInContext('state.skills.add.level',box),2);assert.equal(vm.runInContext('state.stars',box),1);el('reset').onclick();assert.equal(vm.runInContext('state.stars',box),0);assert.equal(vm.runInContext('state.difficulty',box),'growing');assert.deepEqual(JSON.parse(vm.runInContext('JSON.stringify(state.multiLessons)',box)),{});assert(el('storyScene').open);
el('sceneContinue').onclick();
for(const key of S.keys){
 vm.runInContext(`state.learningPath.selected=S.keys.indexOf('${key}')*12+('${key}'==='add'?9:10);state.learningPath.progress[S.keys.indexOf('${key}')*12+('${key}'==='add'?9:10)]={count:2,independent:1};state.multiLessons['${key}']=2;begin('${key}',{});`,box);
 el('hint').onclick();
 const p=vm.runInContext('problem',box);
 assert(p.secondary);
 assert.match(el('explanation').textContent,/Write down the first result/);
 assert(el('explanation').textContent.includes((p.secondary.symbol==='−'?'take away ':'add ')+p.secondary.value));
 el('close').onclick();
}
console.log('Passed UI logic: teaching gate, guided practice, retries, lesson replay, difficulty, reset, and complete two-step hints for all four operations.');
