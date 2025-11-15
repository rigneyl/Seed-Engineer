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
 
const s = TextUtils.getTextStats(text);
let dialogue=0, narration=0;
s.sentences.forEach(x=>{ if(x.includes('"')) dialogue++; else narration++; });
resultsHeading.textContent='Dialogue vs Narration';
['Dialogue', dialogue, 'Narration', narration].forEach((v,i)=>{
 if(i%2===0) return;
 let item=document.createElement('div');
 item.className='result-item';
 item.innerHTML = `<div class='result-item-header'><div class='result-label'>${arguments[i-1]}</div>
 <div class='result-score'>${v}</div></div>`;
 resultsList.appendChild(item);
});

};
})();