const assert=require('node:assert/strict'),P=require('./path.js'),S=require('./story.js'),M=require('./math.js');
const state=P.init(M.fresh());assert.equal(P.next(state).id,0);
for(let id=0;id<P.levels.length;id++){
 const l=P.levels[id];assert(P.unlocked(state,id));assert.equal(P.next(state).id,id);
 if(id<P.levels.length-1)assert(!P.unlocked(state,id+1));
 for(let i=0;i<l.required;i++)P.record(state,id,false);
 assert(!P.done(state,id));if(id<P.levels.length-1)assert(!P.unlocked(state,id+1));
 for(let n=0;n<l.independent;n++)P.record(state,id,true);assert(P.done(state,id));
 if(id%P.perWorld===P.perWorld-1){assert(P.worldDone(state,l.world));if(l.world<3)assert(P.worldUnlocked(state,l.world+1));}
}
assert(P.finished(state));
const old=S.init(M.fresh());old.stars=19;old.adventure.quests['0:subtract']={count:2,independent:1};old.adventure.quests['0:add']={count:3,independent:1};
P.init(old);assert.equal(P.next(old).id,0);assert.equal(old.learningPath.selected,0);assert(!P.done(old,0));assert.equal(old.stars,19);assert.equal(S.progress(old,0,'subtract').count,2);
old.learningPath.selected=11;P.init(old);assert.equal(old.learningPath.selected,0);
const before=JSON.stringify(old.adventure.quests);S.applyDifficulty(old,'challenge');assert.equal(JSON.stringify(old.adventure.quests),before);
assert.match(P.quest(P.levels[1]).success,/Bird/);assert.equal(P.levels.length,48);
const completedLegacy=S.init(M.fresh());completedLegacy.adventure.quests['0:add']={count:3,independent:1};completedLegacy.learningPath={version:1,selected:1,introSeen:true};P.init(completedLegacy);assert(!P.done(completedLegacy,0));assert.equal(completedLegacy.adventure.quests['0:add'].count,3);P.record(completedLegacy,0,false);P.init(completedLegacy);assert.equal(P.progress(completedLegacy,0).count,1);assert(!P.done(completedLegacy,0));for(let i=0;i<4;i++)P.record(completedLegacy,0,true);P.init(completedLegacy);assert(P.done(completedLegacy,0));assert(P.unlocked(completedLegacy,1));
const savedMap=M.fresh();savedMap.learningPath={version:2,selected:4,introSeen:true,progress:{0:{count:3,independent:1},3:{count:3,independent:1},4:{count:2,independent:1}}};P.init(savedMap);assert(P.done(savedMap,0));assert(P.done(savedMap,12));assert.equal(P.progress(savedMap,13).count,2);assert.equal(savedMap.learningPath.version,3);P.init(savedMap);assert(P.done(savedMap,0));
console.log('Passed 48-level linear progression, four world gates, independent requirement, save migration, invalid selection recovery, difficulty preservation and animal names.');
