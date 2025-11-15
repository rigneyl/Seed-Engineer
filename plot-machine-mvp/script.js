/* Plot Machine MVP (Non‑AI) */
(function(){
  const idea = document.getElementById('idea');
  const templateSel = document.getElementById('template');
  const toneSel = document.getElementById('tone');
  const generateBtn = document.getElementById('generate');
  const addBeatBtn = document.getElementById('addBeat');
  const beatList = document.getElementById('beatList');
  const exportMDBtn = document.getElementById('exportMD');
  const exportOPMLBtn = document.getElementById('exportOPML');
  const saveLocalBtn = document.getElementById('saveLocal');
  const loadLocalBtn = document.getElementById('loadLocal');
  const exportJSONBtn = document.getElementById('exportJSON');
  const importJSONInput = document.getElementById('importJSON');
  const printViewBtn = document.getElementById('printView');

  const TEMPLATES = {
    twelve: [
      ["Opening Image","The first impression; a snapshot of the world before disruption."],
      ["Catalyst","The inciting disturbance that knocks equilibrium off balance."],
      ["Debate","Hesitation, stakes, and the cost of action."],
      ["Break into Act II","A decision that commits the protagonist to the journey."],
      ["Fun & Games","Promise of the premise; exploration of the new mode/arena."],
      ["Midpoint Shift","A reveal or reversal that changes the stakes/rules."],
      ["Bad Guys Close In","Antagonistic forces tighten; inner flaws press."],
      ["All Is Lost","A symbolic death or collapse."],
      ["Dark Night of the Soul","Reckoning; meaning extracted from the loss."],
      ["Break into Act III","A synthesis plan born from what was learned."],
      ["Climax & Resolution","Confrontation, transformation, and outcome."],
      ["Aftermath","A new equilibrium; echoes of change."]
    ],
    stc: [
      ["Opening Image","A visual tone‑setter of status quo."],
      ["Theme Stated","A line/gesture foreshadowing the core argument."],
      ["Set‑Up","Introduce world, hero, flaws, stakes; plant B‑story seeds."],
      ["Catalyst","Disruptive event."],
      ["Debate","Should I go? Can I change?"],
      ["Break into Two","Decision launches the journey."],
      ["B Story","The relationship or counter‑argument thread."],
      ["Fun & Games","The trailer moments; premise in action."],
      ["Midpoint","False victory/defeat; stakes shift."],
      ["Bad Guys Close In","Internal + external pressure intensifies."],
      ["All Is Lost","Whiff of death; loss."],
      ["Dark Night of the Soul","Moment of meaning and choice."],
      ["Break into Three","A new plan synthesizing A + B stories."],
      ["Finale","Execute plan; transform."],
      ["Final Image","Mirror/echo of opening; demonstrate change."]
    ],
    hero: [
      ["Ordinary World","The hero in their normal life."],
      ["Call to Adventure","An invitation or challenge."],
      ["Refusal of the Call","Fear, doubt, obligation."],
      ["Meeting the Mentor","Guidance, tool, or insight."],
      ["Crossing the Threshold","Entering the special world."],
      ["Tests, Allies, Enemies","Learning rules; forming bonds; opposition arises."],
      ["Approach to the Inmost Cave","Near the heart of conflict; preparation."],
      ["Ordeal","Central crisis; symbolic death and rebirth."],
      ["Reward (Seizing the Sword)","Gain insight, object, or reconciliation."],
      ["The Road Back","Retaliation or countdown; return begins."],
      ["Resurrection","Final test; purification through conflict."],
      ["Return with the Elixir","Bring change/benefit back to the ordinary world."]
    ]
  };

  function defaultSummary(title, logline, tone){
    const t = tone ? ` in a ${tone.toLowerCase()} mode` : "";
    // Simple, deterministic scaffolding using the logline nouns/verbs heuristics
    const base = logline?.trim() ? `Anchored to: ${logline.trim()}.` : "Anchored to your logline.";
    return `${title}: define intention, stakes, and visible turn${t}. ${base}`;
  }

  function stateFromUI(){
    const rows = [...beatList.querySelectorAll('.beat-row')];
    return rows.map(r => ({
      title: r.querySelector('.beat-title').textContent.trim(),
      summary: r.querySelector('.beat-desc').textContent.trim()
    }));
  }

  function render(beats){
    beatList.innerHTML = '';
    const tmpl = document.getElementById('beatRowTmpl');
    beats.forEach((b,i)=>{
      const node = tmpl.content.cloneNode(true);
      node.querySelector('.index').textContent = String(i+1).padStart(2,'0');
      node.querySelector('.beat-title').textContent = b.title;
      node.querySelector('.beat-desc').textContent = b.summary;
      const row = node.querySelector('.beat-row');
      row.querySelector('.up').addEventListener('click', ()=>moveRow(row,-1));
      row.querySelector('.down').addEventListener('click', ()=>moveRow(row,1));
      row.querySelector('.del').addEventListener('click', ()=>{ row.remove(); reindex(); });
      beatList.appendChild(node);
    });
  }

  function reindex(){
    [...beatList.querySelectorAll('.beat-row .index')].forEach((el,i)=>el.textContent=String(i+1).padStart(2,'0'));
  }

  function moveRow(row, delta){
    const nodes = [...beatList.children];
    const idx = nodes.indexOf(row);
    const target = idx + delta;
    if(target < 0 || target >= nodes.length) return;
    if(delta < 0) beatList.insertBefore(row, nodes[target]);
    else beatList.insertBefore(row, nodes[target].nextSibling);
    reindex();
  }

  function generateFromTemplate(key){
    const logline = idea.value;
    const tone = toneSel.value;
    const beats = (TEMPLATES[key] || []).map(([title, hint])=>({
      title,
      summary: `${hint} ${defaultSummary(title, logline, tone)}`.trim()
    }));
    render(beats);
  }

  generateBtn.addEventListener('click', ()=>{
    const key = templateSel.value;
    generateFromTemplate(key);
  });

  addBeatBtn.addEventListener('click', ()=>{
    const node = document.getElementById('beatRowTmpl').content.cloneNode(true);
    node.querySelector('.beat-title').textContent = "New Beat";
    node.querySelector('.beat-desc').textContent = "Describe what turns, stakes, and visible actions occur.";
    const row = node.querySelector('.beat-row');
    row.querySelector('.up').addEventListener('click', ()=>moveRow(row,-1));
    row.querySelector('.down').addEventListener('click', ()=>moveRow(row,1));
    row.querySelector('.del').addEventListener('click', ()=>{ row.remove(); reindex(); });
    beatList.appendChild(node);
    reindex();
  });

  function download(filename, text, type="text/plain"){
    const blob = new Blob([text], {type});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(()=>URL.revokeObjectURL(url), 1000);
  }

  function toMarkdown(){
    const beats = stateFromUI();
    const lines = [];
    const title = "Plot Machine — Outline";
    lines.push(`# ${title}`);
    const ll = idea.value.trim();
    if(ll) lines.push(`\n> Logline: ${ll}\n`);
    lines.push(`\n**Template:** ${templateSel.options[templateSel.selectedIndex].text}`);
    const tone = toneSel.value;
    if(tone) lines.push(`\n**Tone:** ${tone}`);
    lines.push("\n---\n");
    beats.forEach((b,i)=>{
      lines.push(`\n## ${String(i+1).padStart(2,'0')}. ${b.title}\n`);
      lines.push(`${b.summary}\n`);
    });
    return lines.join('\n');
  }

  function xmlEscape(s){
    return s.replace(/[<>&'"]/g, c => ({
      '<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'
    }[c]));
  }

  function toOPML(){
    const beats = stateFromUI();
    const now = new Date().toISOString();
    const title = "Plot Machine Outline";
    const ll = idea.value.trim();
    const head =
`<?xml version="1.0" encoding="UTF-8"?>
<opml version="2.0">
  <head>
    <title>${xmlEscape(title)}</title>
    <dateCreated>${now}</dateCreated>
    <ownerName>Plot Machine</ownerName>
  </head>
  <body>
    <outline text="${xmlEscape(title)}">`;
    const tail = `
    </outline>
  </body>
</opml>`;
    const nodes = beats.map((b,i)=>{
      const text = `${String(i+1).padStart(2,'0')}. ${b.title}`;
      const note = (ll?`Logline: ${ll}\n`:"") + b.summary;
      return `      <outline text="${xmlEscape(text)}" _note="${xmlEscape(note)}"/>`;
    }).join('\n');
    return head + '\n' + nodes + tail;
  }

  exportMDBtn.addEventListener('click', ()=> download("plot-machine-outline.md", toMarkdown(), "text/markdown"));
  exportOPMLBtn.addEventListener('click', ()=> download("plot-machine-outline.opml", toOPML(), "text/xml"));

  saveLocalBtn.addEventListener('click', ()=>{
    const data = {
      idea: idea.value,
      template: templateSel.value,
      tone: toneSel.value,
      beats: stateFromUI()
    };
    localStorage.setItem('plot-machine-save', JSON.stringify(data));
    flash(saveLocalBtn, "Saved!");
  });

  loadLocalBtn.addEventListener('click', ()=>{
    try {
      const raw = localStorage.getItem('plot-machine-save');
      if(!raw) return;
      const data = JSON.parse(raw);
      idea.value = data.idea || '';
      templateSel.value = data.template || 'twelve';
      toneSel.value = data.tone || '';
      render((data.beats||[]).map(b=>({title:b.title, summary:b.summary})));
      flash(loadLocalBtn, "Loaded!");
    } catch(e){
      alert("Nothing saved yet, or data is corrupted.");
    }
  });

  exportJSONBtn.addEventListener('click', ()=>{
    const data = {
      idea: idea.value,
      template: templateSel.value,
      tone: toneSel.value,
      beats: stateFromUI()
    };
    download("plot-machine-outline.json", JSON.stringify(data, null, 2), "application/json");
  });

  importJSONInput.addEventListener('change', (ev)=>{
    const file = ev.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = ()=>{
      try{
        const data = JSON.parse(reader.result);
        idea.value = data.idea || '';
        templateSel.value = data.template || 'twelve';
        toneSel.value = data.tone || '';
        render((data.beats||[]).map(b=>({title:b.title, summary:b.summary})));
      }catch(e){
        alert("Invalid JSON");
      }
    };
    reader.readAsText(file);
    importJSONInput.value = '';
  });

  function flash(btn, text){
    const old = btn.textContent;
    btn.textContent = text;
    btn.disabled = true;
    setTimeout(()=>{ btn.textContent = old; btn.disabled = false; }, 900);
  }

  printViewBtn.addEventListener('click', (e)=>{ e.preventDefault(); window.print(); });

  // Seed example for quick demo
  idea.value = "A disgraced cartographer must map a forbidden forest before it consumes her hometown.";
  generateFromTemplate('twelve');
})();