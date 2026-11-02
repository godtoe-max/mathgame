(function(root){
let config,previousId=null,walkTimer;
const $=id=>document.getElementById(id),P=LearningPath;
function init(options){config=options;}
function render(state){
 const selected=P.levels[state.learningPath.selected],world=P.worlds[selected.world],current=P.next(state),q=P.quest(selected);
 $('worldTabs').replaceChildren();P.worlds.forEach((w,i)=>{const b=document.createElement('button');b.textContent=`${i+1}. ${w.skill}`;b.disabled=!P.worldUnlocked(state,i);b.classList.toggle('active',i===selected.world);b.setAttribute('aria-current',i===selected.world?'page':'false');b.onclick=()=>config.onWorld(i);$('worldTabs').append(b);});
 $('mapTitle').textContent=world.name;$('mapDescription').textContent=world.description;$('mapWorld').textContent=`MATH WORLD ${selected.world+1} OF 4`;
 $('levelMap').style.backgroundImage=`linear-gradient(180deg,rgba(15,37,28,.25),rgba(15,37,28,.08) 50%,rgba(15,37,28,.42)),url('assets/${world.image}.png')`;
 $('levelNodes').replaceChildren();
 const positions=[[18,23],[50,23],[82,23],[82,44],[50,44],[18,44],[18,65],[50,65],[82,65],[82,86],[50,86],[18,86]];
 P.levels.filter(l=>l.world===selected.world).forEach((l,i)=>{
  const q=P.quest(l),complete=P.done(state,l.id),p=P.progress(state,l.id),button=document.createElement('button');
  button.className='levelNode'+(complete?' cleared':'')+(l.id===selected.id?' selected':'');button.dataset.level=l.id;button.disabled=!P.available(state,l.id);button.style.left=positions[i][0]+'%';button.style.top=positions[i][1]+'%';
  button.setAttribute('aria-label',`Level ${l.label}: Help ${l.friend}. ${q.title}. ${complete?'Cleared. Practice again.':button.disabled?'Locked. Finish the previous level.':p.count+' of '+l.required+' tasks finished.'}`);
  if(l.id===current?.id)button.setAttribute('aria-current','step');
  const number=document.createElement('b');number.className='nodeNumber';number.textContent=complete?'✓':l.label;
  const portrait=document.createElement('i');portrait.className='mapAnimal';portrait.style.backgroundPosition=(l.sprite%4)*100/3+'% '+Math.floor(l.sprite/4)*100+'%';portrait.setAttribute('aria-hidden','true');
  const name=document.createElement('span');name.className='nodeName';name.textContent=l.friend;
  const status=document.createElement('small');status.textContent=complete?'CLEARED':button.disabled?'LOCKED':p.count?`${p.count}/${l.required} TASKS`:'PLAY';
  const topic=document.createElement('span');topic.className='nodeTopic';topic.textContent=l.title;button.append(number,portrait,name,topic,status);button.onclick=()=>{config.onSelect(l.id);config.onEnter(l.id);};$('levelNodes').append(button);
 });
 const position=positions[selected.index];
 if(previousId!==null&&previousId!==selected.id){$('mapParty').classList.add('travelling');clearTimeout(walkTimer);walkTimer=setTimeout(()=>$('mapParty').classList.remove('travelling'),600);}
 previousId=selected.id;$('mapParty').style.left=position[0]+'%';$('mapParty').style.top=position[1]+'%';
 const clear=P.worldDone(state,selected.world);$('worldGate').disabled=!clear;$('worldGate').textContent=clear?(selected.world===3?'Celebrate! ✦':`Next: ${P.worlds[selected.world+1].skill} →`):'Clear all 12 levels';$('worldGate').onclick=()=>config.onGate(selected.world);
 $('worldClear').textContent=clear?'WORLD CLEARED':`${P.levels.filter(l=>l.world===selected.world&&P.done(state,l.id)).length} / 12 LEVELS CLEARED`;
 $('missionLevel').textContent=`LEVEL ${selected.label} · ${world.skill.toUpperCase()}`;$('missionTitle').textContent=`Help ${selected.friend}: ${q.title}`;$('missionRequest').textContent=q.request;
 $('missionSteps').textContent=(selected.index===11?'FINAL CHECKPOINT · ':selected.type==='review'?'REVIEW STOP · ':'')+'Learn with Maggie → Try together → Try on your own';
 $('missionStatus').textContent=P.done(state,selected.id)?'Level cleared! You can practice here again.':`Finish ${selected.required} tasks, including ${selected.independent} on your own, to open the next level. ${P.progress(state,selected.id).count} / ${selected.required} finished.`;
 $('enterLevel').textContent=P.done(state,selected.id)?'Practice this level →':'Help '+selected.friend+' →';$('enterLevel').onclick=()=>config.onEnter(selected.id);
}
root.PathMap={init,render};
})(window);
