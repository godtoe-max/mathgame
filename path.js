(function(root){
const S=typeof module!=='undefined'?require('./story.js'):root.Storybook;
const C=typeof module!=='undefined'?require('./curriculum.js'):root.PathCurriculum;
const perWorld=12;
const worlds=[
 {key:'add',name:'Addition Meadow',skill:'Addition',image:'meadow',description:'Put collections together, then grow into bigger totals.',friends:[['Bunny',1],['Bird',3],['Tiny Kitten',2]]},
 {key:'subtract',name:'Subtraction Woods',skill:'Subtraction',image:'snow',description:'Find what is left, using smaller steps for bigger numbers.',friends:[['Kitten',2],['Tiger',5],['Cheetah',4]]},
 {key:'multiply',name:'Multiplication Sands',skill:'Multiplication',image:'sand',description:'Build equal groups and discover ways to count them quickly.',friends:[['Chicken',7],['Bird',3],['Little Chicken',7]]},
 {key:'divide',name:'Division Gardens',skill:'Division',image:'meadow',description:'Share fairly, then check each share with multiplication.',friends:[['Bear',6],['Bunny',1],['Tiger',5]]}
];
const animals=[['Bunny',1],['Bird',3],['Tiny Kitten',2],['Bear',6],['Chicken',7],['Tiger',5],['Cheetah',4],['Kitten',2]];
const levels=worlds.flatMap((world,w)=>C.topics[world.key].map(([title,type,noun],index)=>{const [friend,sprite]=animals[(index+w*2)%animals.length];return {id:w*perWorld+index,world:w,index,chapter:Math.floor(index/4),key:world.key,friend,sprite,title,type,noun,label:(w+1)+'–'+(index+1),required:index===11?7:5,independent:index===11?3:2};}));
function progress(state,id){const p=state.learningPath?.progress?.[id];return p&&Number.isInteger(p.count)&&Number.isInteger(p.independent)?{count:Math.max(0,Math.min(levels[id]?.required||5,p.count)),independent:Math.max(0,p.independent)}:{count:0,independent:0};}
const done=(state,id)=>{const p=progress(state,id);return !!levels[id]&&p.count>=levels[id]?.required&&p.independent>=levels[id]?.independent;};
const unlocked=(state,id)=>!!levels[id]&&levels.slice(0,id).every(l=>done(state,l.id));
const available=(state,id)=>done(state,id)||unlocked(state,id);
const next=state=>levels.find(l=>!done(state,l.id))||null;
const finished=state=>!next(state);
const worldDone=(state,w)=>levels.filter(l=>l.world===w).every(l=>done(state,l.id));
const worldUnlocked=(state,w)=>w===0||worlds.slice(0,w).every((_,i)=>worldDone(state,i));
function init(state){
 S.init(state);const saved=state.learningPath;let records={},selected=0;
 if(saved?.version===3&&saved.progress&&typeof saved.progress==='object'&&!Array.isArray(saved.progress)){records=saved.progress;selected=saved.selected;}
 else if(saved?.version===2){for(let oldId=0;oldId<12;oldId++){const p=saved.progress?.[oldId];if(!p||!Number.isInteger(p.count)||!Number.isInteger(p.independent))continue;const id=Math.floor(oldId/3)*perWorld+oldId%3;records[id]=p.count>=3&&p.independent>=1?{count:levels[id].required,independent:levels[id].independent}:{count:Math.max(0,p.count),independent:Math.max(0,p.independent)};}selected=Number.isInteger(saved.selected)?Math.floor(saved.selected/3)*perWorld+saved.selected%3:0;}
 state.learningPath={version:3,progress:records,taught:saved?.version===3&&saved.taught&&typeof saved.taught==='object'?saved.taught:{},selected:0,introSeen:!!saved?.introSeen};
 state.learningPath.selected=Number.isInteger(selected)&&available(state,selected)?selected:(next(state)?.id||0);return state;
}
function record(state,id,independent){if(!levels[id])throw Error('Unknown level');const before=done(state,id),p=progress(state,id);p.count=Math.min(levels[id].required,p.count+1);if(independent)p.independent++;state.learningPath.progress[id]=p;return {newReward:!before&&done(state,id),finished:finished(state)};}
function quest(l){return {title:l.title,request:l.friend+' needs help preparing '+l.noun+'. Maggie will teach a strategy for this task.',reward:l.friend+'’s '+l.noun+' badge',success:l.friend+' finishes the '+l.noun+' with your help. You checked your plan and finished the task!',parts:Array(7).fill('Help with the next collection.')};}
const api={worlds,levels,perWorld,progress,record,done,unlocked,available,next,finished,worldDone,worldUnlocked,init,quest};
if(typeof module!=='undefined')module.exports=api;else root.LearningPath=api;
})(typeof window!=='undefined'?window:globalThis);
