const fs=require('node:fs'),path=require('node:path');
const out=path.join(__dirname,'dist');fs.mkdirSync(path.join(out,'assets'),{recursive:true});
const obsoleteWorld=path.join(out,'world.js');if(fs.existsSync(obsoleteWorld))fs.unlinkSync(obsoleteWorld);
for(const file of ['index.html','style.css','math.js','app.js','curriculum.js','path.js','map.js','story.js','lessons.js','arcade.js'])fs.copyFileSync(path.join(__dirname,file),path.join(out,file));
for(const file of ['meadow.png','snow.png','sand.png','lilly.png','maggie.png','animals.png'])fs.copyFileSync(path.join(__dirname,'assets',file),path.join(out,'assets',file));
console.log('Built deployable game in dist/ — no dependencies required.');
