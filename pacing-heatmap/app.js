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
const chunks = [];
const size = Math.max(1, Math.floor(s.sentences.length/6));
for(let i=0;i<s.sentences.length;i+=size){
  const seg = s.sentences.slice(i,i+size).join(' ');
  const st = TextUtils.getTextStats(seg);
  chunks.push({ words:st.wordCount, asl:st.avgSentenceLength, text:seg });
}
resultsHeading.textContent='Pacing Heatmap (chunked)';
chunks.forEach((c,i)=>{
 let item=document.createElement('div');
 item.className='result-item';
 item.innerHTML = `<div class='result-item-header'><div class='result-label'>Chunk ${i+1}</div>
 <div class='result-score'>${c.asl.toFixed(1)} avg length</div></div>
 <div class='result-body'>${c.text.substring(0,200)}...</div>`;
 resultsList.appendChild(item);
});

};
})();