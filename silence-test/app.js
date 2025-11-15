/* The Silence Test — MVP heuristic remover (client-side only) */

const STOPWORDS = new Set([
  // intensifiers / fillers (adverbs/particles)
  "very","really","just","quite","rather","so","too","extremely","incredibly","highly","fairly","pretty","somewhat","remarkably","awfully","terribly","hugely","deeply","strongly","truly","utterly","absolutely","completely","totally","entirely","literally","virtually","basically","kinda","sorta","maybe","perhaps","almost","nearly","barely","hardly","simply","surely","clearly","obviously","honestly","frankly",
  // vague quantifiers often used adjectivally
  "many","much","few","several","various","numerous","countless","multiple",
  // generic adjectives
  "good","bad","great","small","large","big","little","long","short","old","young","new","high","low","early","late","important","different","same",
  "huge","tiny","massive","giant","major","minor","close","distant","near","far","best","worst","better","worse",
  "red","blue","green","black","white","yellow","orange","purple","pink","brown","gray","grey",
  "beautiful","ugly","happy","sad","angry","calm","dark","light","bright","dim","quiet","loud","noisy","silent",
  "quick","slow","easy","hard","simple","complex","strong","weak","heavy","light","hot","cold","warm","cool",
  "narrow","wide","deep","shallow","sharp","blunt","soft","rough","smooth","clean","dirty","dry","wet","empty","full","busy","clear","vague",
  "fine","nice","poor","rich","smart","dumb","clever","stupid","funny","serious","weird","strange","odd","normal","typical","common","rare"
]);

const ENDINGS_ADVERB = [/ly$/i, /wards?$/i, /wise$/i];
const ENDINGS_ADJ_AGGR = [/ous$/i,/ive$/i,/able$/i,/ible$/i,/al$/i,/ic$/i,/ary$/i,/ory$/i,/y$/i];
// Words to keep even if they match suffix rules (nouns with -y etc.)
const WHITELIST = new Set(["story","memory","history","victory","glory","body","energy","policy","economy","library","factory","country","city","quality","privacy","democracy","apology","fantasy","theory","technology","biology","chemistry","music","logic","poetry","electric","specific","public","basic","classic","magic","tragic","traffic","topic","comic","plastic","static","clinic","panic"]);

function isWord(token){ return /^[\p{L}\p{M}\-’']+$/u.test(token); }
function isAdverbLike(w){
  if(STOPWORDS.has(w)) return true;
  return ENDINGS_ADVERB.some(rx=>rx.test(w));
}
function isAdjLike(w, aggressive){
  if(STOPWORDS.has(w)) return true;
  if(!aggressive) return false;
  if(WHITELIST.has(w)) return false;
  return ENDINGS_ADJ_AGGR.some(rx=>rx.test(w));
}

function tokenize(text){
  // Split words and punctuation, preserve quotes and dashes
  const re = /([\p{L}\p{M}’']+|[.,!?;:()\[\]{}"“”'’—\-…]+)/gu;
  return (text.match(re) || []);
}

function detokenize(tokens){
  // Simple space rules: no space before .,!?;:)] — etc.; tighten quotes/dashes
  const noSpaceBefore = new Set([",",".","!","?",";",":",")","]","}","”","’","—"]);
  const noSpaceAfter = new Set(["(","[","{","“","‘","—"]);
  let out = "";
  for(let i=0;i<tokens.length;i++){
    const t = tokens[i];
    const prev = tokens[i-1];
    const addSpace = i>0 && !noSpaceBefore.has(t) && !noSpaceAfter.has(prev);
    out += (addSpace ? " " : "") + t;
  }
  return cleanupPunctuation(out);
}

function cleanupPunctuation(s){
  // Collapse spaces, fix stray commas/semicolons, remove punctuation duplicates
  s = s.replace(/\s+/g," ").trim();
  s = s.replace(/\s+([,;:.!?])/g, "$1");
  s = s.replace(/([,;:.!?]){2,}/g, "$1");
  s = s.replace(/(^|[\s(])[,;:]+/g, "$1"); // leading commas/semicolons
  s = s.replace(/[,;:]+(\s*[)\]]|$)/g, "$1"); // dangling before closing
  s = s.replace(/"\s*"/g,'"'); // empty quotes
  s = s.replace(/\(\s*\)/g,""); // empty parens
  s = s.replace(/\s+—\s+/g," — ");
  return s;
}

function stripToSilence(text, aggressive=false, smartComma=true){
  const tokens = tokenize(text);
  const removedMask = new Array(tokens.length).fill(false);
  let removed = 0, totalWords = 0;

  for(let i=0;i<tokens.length;i++){
    const raw = tokens[i];
    const w = raw.toLowerCase();
    if(isWord(raw)){
      totalWords++;
      const kill = isAdverbLike(w) || isAdjLike(w, aggressive);
      if(kill){
        removedMask[i]=true;
        removed++;
        // if preceding token is a comma and smartComma on, mark it too
        if(smartComma && i>0 && tokens[i-1]===","){ removedMask[i-1]=true; }
      }
    }
  }

  // Build preview (strike removed words) and the silent text
  const previewTokens = tokens.map((t, i)=> removedMask[i] && isWord(t) ? `~~${t}~~` : t);
  // Also hide commas that were marked
  const preview = previewTokens.join(" ").replace(/\s+([,.;:!?])/g,"$1").replace(/\s+/g," ").trim();

  const silentTokens = tokens.filter((_,i)=>!removedMask[i]);
  const silence = detokenize(silentTokens);

  return { preview, silence, removed, totalWords };
}

function markdownStrikeToHTML(md){
  // Convert ~~word~~ into <del>word</del>
  return md.replace(/~~(.*?)~~/g, "<del>$1</del>");
}

function setMetrics(m){
  const el = document.getElementById("metrics");
  if(!m){ el.textContent = ""; return; }
  const pct = m.totalWords ? Math.round(100*m.removed/m.totalWords) : 0;
  el.innerHTML = `<strong>${m.removed}</strong> removed of <strong>${m.totalWords}</strong> words (${pct}%).`;
}

function run(){
  const text = document.getElementById("input").value;
  const aggressive = document.getElementById("aggressive").checked;
  const smartComma = document.getElementById("smartComma").checked;
  const keepColor = document.getElementById("keepColor").checked;

  const res = stripToSilence(text, aggressive, smartComma);
  setMetrics(res);

  // Tabs: fill preview and silence
  const prev = document.getElementById("preview");
  const sil = document.getElementById("silence");
  prev.innerHTML = keepColor ? markdownStrikeToHTML(res.preview) : "";
  sil.textContent = res.silence;

  // Switch to preview if enabled else silence tab
  activateTab(keepColor ? "preview" : "silence");
}

function copySilent(){
  const sil = document.getElementById("silence").textContent;
  navigator.clipboard.writeText(sil).then(()=>{
    flash("Copied silent text.");
  });
}

function downloadSilent(){
  const sil = document.getElementById("silence").textContent;
  const blob = new Blob([sil], {type:"text/plain"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "silence.txt";
  a.click();
  URL.revokeObjectURL(a.href);
}

function flash(msg){
  const m = document.createElement("div");
  m.className = "toast";
  m.textContent = msg;
  document.body.appendChild(m);
  setTimeout(()=>m.classList.add("show"),10);
  setTimeout(()=>{ m.classList.remove("show"); m.remove(); }, 1800);
}

function wire(){
  document.getElementById("btnRun").addEventListener("click", run);
  document.getElementById("btnCopy").addEventListener("click", copySilent);
  document.getElementById("btnDownload").addEventListener("click", downloadSilent);
  document.getElementById("btnReset").addEventListener("click", ()=>{
    document.getElementById("input").value="";
    document.getElementById("preview").innerHTML="";
    document.getElementById("silence").textContent="";
    setMetrics(null);
  });
  document.getElementById("btnSample").addEventListener("click", ()=>{
    const sample = `The small, quietly beautiful room smelled faintly of warm bread and overly sweet coffee. A perfectly polite clerk spoke very slowly, offering a wonderfully detailed explanation that was completely unnecessary. The city was loud and strangely bright; the night, frankly, was unbearably soft.`;
    document.getElementById("input").value = sample;
    run();
  });

  // Tabs
  document.querySelectorAll(".tab").forEach(btn=>{
    btn.addEventListener("click", ()=> activateTab(btn.dataset.tab));
  });
}
function activateTab(id){
  document.querySelectorAll(".tab, .tabpane").forEach(el=>el.classList.remove("active"));
  document.querySelector(`.tab[data-tab="${id}"]`).classList.add("active");
  document.getElementById(id).classList.add("active");
}

window.addEventListener("DOMContentLoaded", wire);

// Tiny toast style injected here to keep files minimal:
const style = document.createElement("style");
style.textContent = `.toast{position:fixed;bottom:14px;left:50%;transform:translateX(-50%) translateY(10px);background:#1a1e2c;color:#e6e6e6;border:1px solid #232738;padding:8px 12px;border-radius:10px;opacity:0;transition:.2s} .toast.show{opacity:1;transform:translateX(-50%) translateY(0)}`;
document.head.appendChild(style);
