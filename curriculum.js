(function(root){
const topics={
 add:[['Counting on','count','clovers'],['Making the next ten','bridge','berries'],['Doubles and near doubles','double','flowers'],['Tens and ones','tens','invitations'],['Regrouping ones','regroup','seeds'],['Three collections','three','shells'],['Hundreds, tens and ones','hundreds','leaves'],['Crossing a hundred','large','lanterns'],['Find the missing collection','missing','ribbons'],['Plan, then set some aside','two','snacks'],['Meadow review stop','review','decorations'],['The meadow checkpoint','checkpoint','festival supplies']],
 subtract:[['Counting back','count','pebbles'],['Back through a ten','bridge','pinecones'],['Compare two collections','compare','scarves'],['Take away tens and ones','tens','blankets'],['Regroup to take away','regroup','candles'],['What is left from a hundred?','hundred','logs'],['Subtract larger collections','hundreds','buttons'],['Subtract across zeroes','large','lights'],['Find what was used','missing','travel packs'],['Find the starting collection','start','mittens'],['Use some, then restock','two','snacks'],['The woodland checkpoint','checkpoint','festival supplies']],
 multiply:[['Build equal groups','groups','feathers'],['Groups of two','fact2','flowers'],['Groups of five','fact5','shells'],['Groups of ten','fact10','ribbons'],['Groups of three','fact3','streamers'],['Double, then double again','fact4','candles'],['Five groups and one more','fact6','lanterns'],['Ten groups minus one','fact9','beads'],['Split a bigger factor','large','flags'],['Find the missing group','missing','baskets'],['Groups, then extra supplies','two','flowers'],['The sands checkpoint','checkpoint','festival supplies']],
 divide:[['Share into equal groups','groups','berries'],['Share between two','fact2','apples'],['Share between five','fact5','shells'],['Share between ten','fact10','ribbons'],['Share between three','fact3','pebbles'],['Share between four','fact4','candles'],['Share between six','fact6','snacks'],['Share between nine','fact9','flowers'],['Split a larger total','large','beads'],['Find the missing group count','missing','baskets'],['Fair shares, then extras','two','treats'],['The garden checkpoint','checkpoint','festival supplies']]
};
const symbols={add:'+',subtract:'−',multiply:'×',divide:'÷'},names={add:'Addition',subtract:'Subtraction',multiply:'Multiplication',divide:'Division'};
function tier(state,l){const base={gentle:0,growing:1,challenge:2}[state.difficulty]??1;return Math.min(3,Math.max(base+Math.floor(l.index/4),Math.min(state.skills[l.key].level,base+1)));}
function make(l,level,stage=0,random=Math.random){
 const r=(a,b)=>a+Math.floor(random()*(b-a+1)),key=l.key,topic=topics[key][l.index],planned=topic[1];
 let type=planned;if(type==='review'||type==='checkpoint'){const pool=key==='add'?['regroup','three','missing','two']:key==='subtract'?['regroup','missing','start','two']:['large','missing','two'];type=pool[(stage+l.index)%pool.length];}
 const cap=[20,100,500,2000][level];let a,b,answer,secondary=null,missing=null;
 if(key==='add'){
  a=r(1,cap);b=r(1,Math.max(5,Math.floor(cap/2)));
  if(type==='count'){a=r(3,Math.max(9,Math.floor(cap/2)));b=r(2,9);}
  if(type==='bridge'||type==='regroup'){a=r(1,level===0?1:level===1?8:30)*10+r(6,9);b=type==='bridge'?r(5,9):r(1,level<2?7:20)*10+r(5,9);}
  if(type==='double'){a=r(2,[9,25,75,200][level]);b=a+r(0,1);}
  if(type==='tens'){a=r(1,[5,9,30,100][level])*10+r(1,4);b=r(1,[4,8,20,80][level])*10+r(1,4);}
  if(type==='hundreds'||type==='large'){a=r(1,[2,4,8,18][level])*100+r(60,99);b=r(30,[99,199,499,999][level]);}
  answer=a+b;
  if(type==='three'){secondary={symbol:'+',value:r(2,[9,30,100,300][level])};answer+=secondary.value;}
  if(type==='two'){secondary={symbol:'−',value:r(1,Math.min(30,answer))};answer-=secondary.value;}
  if(type==='missing')missing='b';
 }else if(key==='subtract'){
  a=r(10,cap+10);b=r(1,a);if(type==='count'){b=r(2,9);a=r(b+1,Math.max(b+2,Math.floor(cap/2)));}
  if(type==='bridge'||type==='regroup'){a=r(2,[3,9,30,100][level])*10+r(0,4);b=type==='bridge'?r(5,9):r(1,Math.floor(a/10)-1)*10+r(5,9);}
  if(type==='compare'){b=r(4,Math.max(8,cap-10));a=b+r(2,12);}
  if(type==='tens'){a=r(3,[6,9,40,150][level])*10+r(5,9);b=r(1,Math.floor(a/10)-1)*10+r(1,4);}
  if(type==='hundred'){a=[100,100,500,1000][level];b=r(12,a-10);}
  if(type==='hundreds'||type==='large'){a=r(2,[4,8,12,20][level])*100+(type==='large'?r(0,3):r(10,90));b=r(11,a-1);}
  answer=a-b;if(type==='two'){secondary={symbol:'+',value:r(2,30)};answer+=secondary.value;}
  if(type==='missing')missing='b';if(type==='start')missing='a';
 }else{
  const fact=Number(type.replace('fact',''));b=Number.isInteger(fact)&&fact>0?fact:r(2,level<2?6:12);
  const count=r(2,[5,10,20,40][level]);
  if(key==='multiply'){a=count;if(type==='large'){a=r(11,[15,19,25,35][level]);b=r(11,[12,15,19,25][level]);}answer=a*b;}
  else{answer=type==='large'?r(11,[15,25,50,100][level]):count;a=b*answer;}
  if(type==='two'){secondary={symbol:'+',value:r(2,20)};answer+=secondary.value;}
  if(type==='missing')missing='b';
 }
 const primaryAnswer=key==='add'?a+b:key==='subtract'?a-b:key==='multiply'?a*b:a/b;
 const p={key,name:names[key],symbol:symbols[key],a,b,answer,primaryAnswer,secondary,type,planned,level,missing,noun:topic[2],friend:l.friend};
 if(missing){p.answer=missing==='a'?a:b;p.question=(missing==='a'?'?':a)+' '+p.symbol+' '+(missing==='b'?'?':b)+' = '+primaryAnswer;p.solution=a+' '+p.symbol+' '+b+' = '+primaryAnswer;}
 else{p.question=a+' '+p.symbol+' '+b+(secondary?' '+secondary.symbol+' '+secondary.value:'')+' = ?';p.solution=p.question.replace('?',String(answer));}
 const n=p.noun;
 p.story=key==='add'?`${l.friend} has ${a} ${n} and finds ${b} more. How many are there altogether?`:key==='subtract'?`${l.friend} has ${a} ${n} and uses ${b}. How many are left?`:key==='multiply'?`${l.friend} is making ${a} groups with ${b} ${n} in each. How many are needed altogether?`:`${l.friend} shares ${a} ${n} equally among ${b} groups. How many go in each group?`;
 if(type==='compare')p.story=`${l.friend} has ${a} ${n}. Maggie has ${b}. How many more does ${l.friend} have?`;
 if(missing)p.story=key==='add'?`${l.friend} starts with ${a} ${n} and ends with ${primaryAnswer}. How many were added?`:key==='subtract'?(missing==='a'?`${l.friend} uses ${b} ${n} and has ${primaryAnswer} left. How many were there at the start?`:`${l.friend} starts with ${a} ${n} and has ${primaryAnswer} left. How many were used?`):key==='multiply'?`${l.friend} makes ${a} equal groups using ${primaryAnswer} ${n}. How many belong in each group?`:`${l.friend} shares ${a} ${n} with ${primaryAnswer} in each group. How many equal groups are there?`;
 if(secondary)p.story+=' '+(secondary.symbol==='−'?`Then set aside ${secondary.value} for tomorrow. How many remain for today?`:type==='three'?`A third collection has ${secondary.value} more. What is the total of all three collections?`:key==='divide'?`Each group receives ${secondary.value} extra. How many does each group have now?`:`Then add ${secondary.value} extra ${n}. How many are ready now?`);
 return p;
}
function hint(p){
 if(p.missing)return p.key==='add'?`Find the missing collection by subtracting the starting ${p.a} from the final ${p.primaryAnswer}. Check by adding it back.`:p.key==='subtract'?(p.missing==='a'?`The starting amount must include both the ${p.b} used and the ${p.primaryAnswer} left. Add those two parts.`:`Find the amount used by subtracting the ${p.primaryAnswer} left from the starting ${p.a}.`):p.key==='multiply'?`Use the inverse operation: share ${p.primaryAnswer} into ${p.a} equal groups.`:`Use division to count groups: how many groups of ${p.primaryAnswer} fit into ${p.a}?`;
 let text;
 if(p.type==='double')text=`Double ${p.a}. ${p.a===p.b?'Both collections are the same size.':'Then add one more, because the second collection is one bigger.'}`;
 else if(p.type==='bridge'&&p.key==='add')text=`From ${p.a}, add ${10-p.a%10} to reach the next ten. Split ${p.b} into that part and the rest, then add the rest.`;
 else if(p.type==='compare')text=`Count up from ${p.b} to ${p.a}, or subtract the smaller collection from the larger collection.`;
 else if(p.type==='fact4'&&p.key==='multiply')text=`Double ${p.a}, then double that result again. Four groups are two groups doubled.`;
 else if(p.type==='fact6'&&p.key==='multiply')text=`Work out five groups of ${p.a}, then add one more ${p.a}.`;
 else if(p.type==='fact9'&&p.key==='multiply')text=`Find ten groups of ${p.a}, then take away one ${p.a}.`;
 else{const M=typeof module!=='undefined'?require('./math.js'):root.MathGarden;text=M.operations[p.key].teach(p.a,p.b);}
 if(p.secondary)text+=` Write down the first result. Then ${p.secondary.symbol==='−'?'take away':'add'} ${p.secondary.value} to finish the second step.`;
 return text;
}
function lesson(l,level,stage){
 const p=make(l,level,stage,()=>.42),first=p.primaryAnswer;
 const start=p.missing?'We know the final amount and one part. The question mark is the part we need to find.':p.secondary?'Read both parts of the task. Work out the first operation before changing that result.':'First, identify what the animal needs: '+({add:'combine collections',subtract:'find what is left or the difference',multiply:'count equal groups',divide:'share equally or count groups'}[p.key])+'.';
 const worked=p.missing?(p.key==='add'?`${first} − ${p.a} = ${p.b}. The missing collection is ${p.b}.`:p.key==='subtract'?(p.missing==='a'?`${p.b} + ${first} = ${p.a}. The starting amount was ${p.a}.`:`${p.a} − ${first} = ${p.b}. That is the amount used.`):p.key==='multiply'?`${first} ÷ ${p.a} = ${p.b}. Each group has ${p.b}.`:`${p.a} ÷ ${first} = ${p.b}. There are ${p.b} groups.`):`${p.a} ${p.symbol} ${p.b} = ${first}.`+(p.secondary?` Now ${first} ${p.secondary.symbol} ${p.secondary.value} = ${p.answer}.`:'');
 return {title:topics[l.key][l.index][0],equation:p.solution,steps:[start,hint(p),worked+' Check the result against the animal’s question.']};
}
const api={topics,tier,make,hint,lesson};if(typeof module!=='undefined')module.exports=api;else root.PathCurriculum=api;
})(typeof window!=='undefined'?window:globalThis);
