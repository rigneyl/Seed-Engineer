(function(){
const input=document.getElementById('input-text');
const clearBtn=document.getElementById('btn-clear');
const analyzeBtn=document.getElementById('btn-analyze');
const statsGrid=document.getElementById('stats-grid');
const resultsHeading=document.getElementById('results-heading');
const resultsList=document.getElementById('results-list');
const tagRow=document.getElementById('tag-row');

function clearAll(){input.value='';statsGrid.innerHTML='';resultsList.innerHTML='';tagRow.innerHTML='';resultsHeading.textContent='Waiting for input…';}
clearBtn.onclick=clearAll;

analyzeBtn.onclick=()=>{
 let text=input.value.trim();
 if(!text) return clearAll();
 statsGrid.innerHTML=''; resultsList.innerHTML=''; tagRow.innerHTML='';
 
const lists = {
 sight:[ 'dark','light','look','see','glow','shadow','bright','dim' ],
 sound:[ 'noise','silent','quiet','echo','bang','whisper','scream' ],
 smell:[ 'odor','smell','stink','aroma' ],
 taste:[ 'taste','bitter','sweet','sour' ],
 touch:[ 'cold','warm','rough','smooth','pressure','soft' ]
};
const counts = {sight:0,sound:0,smell:0,taste:0,touch:0};
const words = TextUtils.splitWords(text);
words.forEach(w=>{
 for(let k in lists){ if(lists[k].includes(w)) counts[k]++; }
});
resultsHeading.textContent='Sensory Detail Frequency';
for(let k in counts){
 let item=document.createElement('div');
 item.className='result-item';
 item.innerHTML = `<div class='result-item-header'><div class='result-label'>${k}</div>
 <div class='result-score'>${counts[k]}</div></div>`;
 resultsList.appendChild(item);
}

};
})();