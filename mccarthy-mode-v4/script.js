// Textarea build: guaranteed LTR typing, live analysis on input, safe rendering in preview
(function(){
  const src = document.getElementById('source');
  const preview = document.getElementById('preview');
  const signalsEl = document.getElementById('signals');
  const dialogueHints = document.getElementById('dialogueHints');
  const presetSel = document.getElementById('preset');
  const status = document.getElementById('status');
  const btnExport = document.getElementById('exportBtn');
  const btnImport = document.getElementById('importBtn');
  const btnClear = document.getElementById('clearBtn');
  const btnConvertDialogue = document.getElementById('convertDialogue');
  const tooltipTpl = document.getElementById('tooltip');

  const STORAGE_KEY = 'mccarthy-mode-textarea-v1';
  const ROLLBACK_KEY = 'mccarthy-mode-rollback';
  const BIDI_RE = /[\u202A-\u202E\u2066-\u2069]/g;

  const PRESETS = {
    light: { maxCommasPerSentence: 4, adverbRateWarn:.08, adjectiveRateWarn:.14, preferAndChains:true },
    strict: { maxCommasPerSentence: 2, adverbRateWarn:.05, adjectiveRateWarn:.10, preferAndChains:true },
    dialogue: { maxCommasPerSentence: 5, adverbRateWarn:.09, adjectiveRateWarn:.16, preferAndChains:false }
  };
  let currentPreset='light';

  const SENT_SPLIT = /(?<=[\.\!\?])\s+/g;
  const WORD_RE = /[A-Za-z']+/g;
  const ADVERB_RE = /\b\w+ly\b/gi;

  function cleanPlain(s){ return (s||'').replace(BIDI_RE,'').replace(/\r/g,''); }
  function save(){ try{ localStorage.setItem(STORAGE_KEY, src.value); status.textContent='Saved'; setTimeout(()=>status.textContent='',900); }catch(e){} }
  function load(){ const t=localStorage.getItem(STORAGE_KEY); if(t!=null){ src.value=t; } }

  function escapeHTML(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  function words(str){ return (str.match(WORD_RE)||[]).map(w=>w.toLowerCase()); }
  function count(arr, fn){ return arr.reduce((n,x)=>n+(fn(x)?1:0),0); }
  function sentenceStats(s){
    const tokens = words(s);
    const len = tokens.length;
    const commas = (s.match(/,/g)||[]).length;
    const exclaims = (s.match(/!/g)||[]).length;
    const ands = count(tokens,t=>t==='and');
    const adverbs = (s.match(ADVERB_RE)||[]).length;
    const adjectives = count(tokens, t => /(?:ous|ive|ial|ical|ful|less|able|ible|ant|ent|ate|ory|ean|ish|y)$/.test(t));
    return {len, commas, exclaims, ands, adverbs, adjectives};
  }
  function avg(a){ return a.length ? a.reduce((x,y)=>x+y,0)/a.length : 0; }
  function median(nums){ if(!nums.length)return 0; const s=[...nums].sort((a,b)=>a-b); const m=Math.floor(s.length/2); return s.length%2?s[m]:(s[m-1]+s[m])/2; }
  function makeCard(k,v){ const el=document.createElement('div'); el.className='card'; el.innerHTML=`<div class="k">${k}</div><div class="v">${v}</div>`; return el; }

  function render(){
    const plain = cleanPlain(src.value);
    // preview highlights
    let out = escapeHTML(plain);
    out = out.replace(/([\"“”])/g, '<mark class="bad" data-tip="Quoted dialogue detected. Consider omitting quotes.">$1</mark>');
    out = out.replace(/(;)/g, '<mark class="warn" data-tip="Semicolons discouraged.">$1</mark>');
    out = out.replace(/(!)/g, '<mark class="warn" data-tip="Exclamation marks are rare in this style.">$1</mark>');
    out = out.replace(/\b(\w+ly)\b/gi, '<mark class="note" data-tip="Adverb (-ly). Consider cutting.">$1</mark>');
    out = out.replace(/([^\.!\?\n]{0,200}(?:,[^\.!\?\n]{0,200}){2,})/g, '<mark class="info" data-tip="Many commas. Try and-chains or split.">$1</mark>');
    preview.innerHTML = out;
    attachTooltipHandlers();

    // signals
    const sents = plain.split(SENT_SPLIT).filter(Boolean);
    const stats = sents.map(sentenceStats);
    const lengths = stats.map(s=>s.len);
    const commas = stats.map(s=>s.commas);
    const ands = stats.map(s=>s.ands);
    const adverbs = stats.map(s=>s.adverbs);
    const adjectives = stats.map(s=>s.adjectives);

    const meanLen = avg(lengths).toFixed(1);
    const medLen = median(lengths).toFixed(1);
    const meanCommas = avg(commas).toFixed(2);
    const meanAnds = avg(ands).toFixed(2);
    const advRate = (avg(adverbs)/Math.max(avg(lengths),1)).toFixed(3);
    const adjRate = (avg(adjectives)/Math.max(avg(lengths),1)).toFixed(3);

    signalsEl.innerHTML='';
    signalsEl.appendChild(makeCard('Mean sentence length', `${meanLen} words`));
    signalsEl.appendChild(makeCard('Median sentence length', `${medLen} words`));
    signalsEl.appendChild(makeCard('Avg commas / sentence', `${meanCommas}`));
    signalsEl.appendChild(makeCard('Avg “and” / sentence', `${meanAnds}`));
    signalsEl.appendChild(makeCard('Adverb rate (-ly / word)', `${advRate}`));
    signalsEl.appendChild(makeCard('Adj rate (suffix-guess)', `${adjRate}`));

    // dialogue lint
    const lines = plain.split(/\n/);
    dialogueHints.innerHTML='';
    const items=[];
    lines.forEach((line,i)=>{
      const t=line.trim();
      if(/^["“].*["”]$/.test(t)) items.push(`Line ${i+1}: Quoted dialogue — consider removing quotes.`);
      if(/\b(said|asked)\s+\w+ly\b/i.test(t)) items.push(`Line ${i+1}: Adverbial tag (“said softly”). Prefer “he said”.`);
      if(/\b(whispered|murmured|hissed|grinned|smiled|laughed)\b/i.test(t)) items.push(`Line ${i+1}: Fancy tag. Prefer “said/asked” or none.`);
    });
    if(!items.length){ const ok=document.createElement('li'); ok.textContent='No dialogue issues detected.'; dialogueHints.appendChild(ok); }
    else items.forEach(t=>{ const li=document.createElement('li'); li.textContent=t; dialogueHints.appendChild(li); });

    save();
  }

  function attachTooltipHandlers(){
    const nodes = preview.querySelectorAll('mark[data-tip]');
    let tipEl = document.querySelector('.tooltip');
    if(!tipEl){ tipEl = tooltipTpl.content.firstElementChild.cloneNode(true); document.body.appendChild(tipEl); }
    nodes.forEach(n=>{
      n.addEventListener('mouseenter', ()=>{
        tipEl.textContent = n.getAttribute('data-tip') || '';
        const rect=n.getBoundingClientRect();
        tipEl.style.left = Math.min(rect.left, window.innerWidth-340)+'px';
        tipEl.style.top = (rect.bottom+6)+'px';
        tipEl.classList.add('show');
      });
      n.addEventListener('mouseleave', ()=> tipEl.classList.remove('show'));
    });
  }

  function convertDialogue(){
    const out = src.value.split('\\n').map(line=>{
      const t=line.trim();
      if(/^["“].*["”]$/.test(t)){
        let core = t.replace(/^[“"]|[”"]$/g,'');
        core = core.replace(/\\s*,?\\s*(he|she)\\s+(said|asked)\\b.*$/i, (m,p1,p2)=>` ${p1.toLowerCase()} ${p2.toLowerCase()}`);
        return core;
      }
      return line;
    }).join('\\n');
    src.value = out;
    render();
  }

  // wiring
  let t; function debouncedRender(){ clearTimeout(t); t=setTimeout(render, 120); }
  src.addEventListener('input', debouncedRender);
  src.addEventListener('paste', (e)=>{
    e.preventDefault();
    const text=(e.clipboardData||window.clipboardData).getData('text/plain')||'';
    const start=src.selectionStart, end=src.selectionEnd;
    const cleaned = (text||'').replace(BIDI_RE,'');
    src.setRangeText(cleaned, start, end, 'end'); debouncedRender();
  });

  document.getElementById('exportBtn').addEventListener('click', ()=>{
    const blob=new Blob([src.value],{type:'text/plain'});
    const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='mccarthy_mode.txt'; a.click();
    setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  });
  document.getElementById('importBtn').addEventListener('click', ()=>{
    const inp=document.createElement('input'); inp.type='file'; inp.accept='.txt,text/plain';
    inp.onchange=()=>{ const f=inp.files[0]; if(!f) return; const r=new FileReader(); r.onload=()=>{ src.value = r.result; render(); }; r.readAsText(f); };
    inp.click();
  });
  document.getElementById('clearBtn').addEventListener('click', ()=>{
    localStorage.setItem(ROLLBACK_KEY, src.value || ''); src.value=''; render(); status.textContent='Cleared'; setTimeout(()=>status.textContent='',800);
  });
  document.getElementById('convertDialogue').addEventListener('click', convertDialogue);
  presetSel.addEventListener('change', ()=>{ currentPreset=presetSel.value; render(); });

  // init
  load(); render();
})();