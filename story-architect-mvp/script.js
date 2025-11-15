// Story Architect MVP — draggable beats + templates + export Markdown
const el = (sel,scope=document)=>scope.querySelector(sel);
const els = (sel,scope=document)=>Array.from(scope.querySelectorAll(sel));
const statusbar = el('#statusbar');

// --- Templates ---
const Templates = {
  threeAct: {
    id:'threeAct', name:'3-Act',
    lanes:[
      { id:'act1', title:'Act I', beats:[
        'Opening Image','Setup','Catalyst','Debate','Break into Act II'
      ]},
      { id:'act2', title:'Act II', beats:[
        'Fun & Games','Midpoint','Bad Guys Close In','All Is Lost','Dark Night of the Soul'
      ]},
      { id:'act3', title:'Act III', beats:[
        'Break into Act III','Finale','Aftermath'
      ]},
    ]
  },
  fourAct: {
    id:'fourAct', name:'4-Act',
    lanes:[
      { id:'act1', title:'Act I', beats:['Opening Image','Setup','Catalyst']},
      { id:'act2a', title:'Act II‑A', beats:['Debate','Break into Act II','Fun & Games']},
      { id:'act2b', title:'Act II‑B', beats:['Midpoint Shift','Bad Guys Close In','All Is Lost','Dark Night of the Soul']},
      { id:'act3', title:'Act III', beats:['Break into Act III','Climax & Resolution','Aftermath']},
    ]
  },
  twelveBeat: {
    id:'twelveBeat', name:'12-Beat',
    lanes:[
      { id:'col1', title:'Setup', beats:['Opening Image','Catalyst','Debate']},
      { id:'col2', title:'Act II (A)', beats:['Break into Act II','Fun & Games','Midpoint Shift']},
      { id:'col3', title:'Act II (B)', beats:['Bad Guys Close In','All Is Lost','Dark Night of the Soul']},
      { id:'col4', title:'Act III', beats:['Break into Act III','Climax & Resolution','Aftermath']},
    ]
  }
};

// --- State ---
let state = {
  template: 'threeAct',
  projectTitle: '',
  logline: '',
  lanes: [] // [{id,title, beats:[{id,title,summary}]}]
};

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
  // Restore or default
  const saved = localStorage.getItem('storyArchitect.v1');
  if(saved){
    try { state = JSON.parse(saved); } catch{}
  } else {
    loadTemplate('threeAct', true);
  }

  // Controls
  el('#templateSelect').value = state.template;
  el('#templateSelect').addEventListener('change', (e)=>{
    const val = e.target.value;
    const ok = confirm('Switch template? This will load default beats (your current timeline stays saved until you press Reset).');
    if(ok){ loadTemplate(val, true); toast(`Loaded template: ${Templates[val].name}`); }
    else { e.target.value = state.template; }
  });

  el('#addBeatBtn').addEventListener('click', addCustomBeat);
  el('#exportMdBtn').addEventListener('click', exportMarkdown);
  el('#exportJsonBtn').addEventListener('click', exportJson);
  el('#importJsonInput').addEventListener('change', importJson);
  el('#saveBtn').addEventListener('click', save);
  el('#resetBtn').addEventListener('click', resetProject);

  el('#projectTitle').value = state.projectTitle || '';
  el('#logline').value = state.logline || '';
  el('#projectTitle').addEventListener('input', e=>{ state.projectTitle = e.target.value; autosave(); });
  el('#logline').addEventListener('input', e=>{ state.logline = e.target.value; autosave(); });

  renderTimeline();
});

function loadTemplate(key, overwrite=false){
  const t = Templates[key];
  state.template = key;
  if(overwrite){
    state.lanes = t.lanes.map(l => ({
      id: l.id,
      title: l.title,
      beats: l.beats.map(title => newBeat(title))
    }));
  }
  renderTimeline();
  autosave();
}

function newBeat(title='New Beat'){
  return { id: crypto.randomUUID(), title, summary:'' };
}

function renderTimeline(){
  const timeline = el('#timeline');
  timeline.classList.remove('four','twelve');
  if(state.template === 'fourAct') timeline.classList.add('four');
  if(state.template === 'twelveBeat') timeline.classList.add('twelve');

  timeline.innerHTML = '';
  state.lanes.forEach((lane, laneIndex) => {
    const laneEl = document.createElement('div');
    laneEl.className = 'lane';
    laneEl.dataset.laneId = lane.id;

    laneEl.innerHTML = `
      <div class="lane-header">
        <div class="lane-title">${lane.title}</div>
        <div class="lane-count"><span>${lane.beats.length}</span> beats</div>
      </div>
      <div class="lane-body" aria-label="Drop zone"></div>
    `;
    const body = el('.lane-body', laneEl);

    lane.beats.forEach((beat, idx) => body.appendChild(renderBeat(beat, lane.id, idx)));
    // Drag-n-drop
    enableLaneDnD(laneEl);

    timeline.appendChild(laneEl);
  });
}

function renderBeat(beat, laneId, idx){
  const card = document.createElement('div');
  card.className = 'beat';
  card.draggable = true;
  card.dataset.beatId = beat.id;
  card.innerHTML = `
    <div class="beat-header">
      <span class="beat-handle" title="Drag">⋮⋮</span>
      <button class="pill delete" title="Delete">Delete</button>
    </div>
    <input class="title" value="${escapeHtml(beat.title)}" />
    <textarea class="summary" placeholder="Optional: describe the scene/beat…">${escapeHtml(beat.summary)}</textarea>
  `;

  // Editing
  el('.title', card).addEventListener('input', e => {
    const b = findBeat(beat.id);
    b.title = e.target.value;
    autosave();
  });
  el('.summary', card).addEventListener('input', e => {
    const b = findBeat(beat.id);
    b.summary = e.target.value;
    autosave();
  });
  el('.delete', card).addEventListener('click', () => {
    if(confirm('Delete this beat?')){
      removeBeat(beat.id);
      renderTimeline();
      autosave();
      toast('Beat deleted');
    }
  });

  // Dragging
  card.addEventListener('dragstart', (e)=>{
    card.classList.add('dragging');
    e.dataTransfer.setData('text/plain', JSON.stringify({beatId: beat.id, fromLane: laneId}));
    e.dataTransfer.effectAllowed = 'move';
  });
  card.addEventListener('dragend', ()=> card.classList.remove('dragging'));
  return card;
}

function enableLaneDnD(laneEl){
  const body = el('.lane-body', laneEl);
  let placeholder = null;

  body.addEventListener('dragover', (e)=>{
    e.preventDefault();
    const dragging = document.querySelector('.beat.dragging');
    if(!dragging) return;
    if(!placeholder){
      placeholder = document.createElement('div');
      placeholder.className = 'placeholder';
    }
    // Find insertion point
    const after = getDragAfterElement(body, e.clientY);
    if(after == null){ body.appendChild(placeholder); }
    else { body.insertBefore(placeholder, after); }
  });

  body.addEventListener('dragleave', (e)=>{
    if(e.target === body && placeholder && !body.contains(document.querySelector('.beat.dragging'))){
      placeholder.remove(); placeholder = null;
    }
  });

  body.addEventListener('drop', (e)=>{
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
    const destLaneId = laneEl.dataset.laneId;
    const beat = findBeat(data.beatId);
    if(!beat) return;

    // Remove from old lane
    removeBeat(beat.id, false);

    // Determine new index via placeholder
    const index = placeholder ? Array.from(body.children).indexOf(placeholder) : state.lanes.find(l=>l.id===destLaneId).beats.length;
    const lane = state.lanes.find(l=>l.id===destLaneId);
    lane.beats.splice(index, 0, beat);

    renderTimeline();
    autosave();
    toast('Beat moved');
  });
}

function getDragAfterElement(container, y){
  const draggableElements = [...container.querySelectorAll('.beat:not(.dragging)')];
  return draggableElements.reduce((closest, child)=>{
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height/2;
    if(offset < 0 && offset > closest.offset){
      return { offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// --- CRUD helpers ---
function findBeat(id){
  for(const lane of state.lanes){
    const b = lane.beats.find(x=>x.id===id);
    if(b) return b;
  }
  return null;
}
function removeBeat(id, reRender=true){
  for(const lane of state.lanes){
    const idx = lane.beats.findIndex(x=>x.id===id);
    if(idx>-1){ lane.beats.splice(idx,1); }
  }
  if(reRender) renderTimeline();
}
function addCustomBeat(){
  const lane = state.lanes[0];
  lane.beats.push(newBeat('Custom Beat'));
  renderTimeline(); autosave(); toast('Beat added');
}

// --- Exporters ---
function exportMarkdown(){
  const title = state.projectTitle || 'Untitled Project';
  const logline = state.logline || '';
  let md = `# ${title}\n\n`;
  if(logline) md += `> ${logline}\n\n`;
  for(const lane of state.lanes){
    md += `## ${lane.title}\n\n`;
    lane.beats.forEach((b, i)=>{
      md += `### ${i+1}. ${b.title}\n\n`;
      if(b.summary?.trim()) md += `${b.summary.trim()}\n\n`;
    });
    md += '\n';
  }
  downloadFile(slug(title)+'.md', md);
  toast('Markdown exported');
}

function exportJson(){
  const data = JSON.stringify(state, null, 2);
  const title = state.projectTitle || 'story-architect-project';
  downloadFile(slug(title)+'.json', data, 'application/json');
  toast('JSON exported');
}

function importJson(ev){
  const file = ev.target.files?.[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try{
      const obj = JSON.parse(reader.result);
      if(!obj?.lanes) throw new Error('Invalid file');
      state = obj;
      el('#templateSelect').value = state.template || 'threeAct';
      el('#projectTitle').value = state.projectTitle || '';
      el('#logline').value = state.logline || '';
      renderTimeline(); autosave(); toast('Project imported');
    }catch(err){
      alert('Could not import JSON: '+ err.message);
    }
  };
  reader.readAsText(file);
}

// --- Persistence ---
function autosave(){ localStorage.setItem('storyArchitect.v1', JSON.stringify(state)); }
function save(){ autosave(); toast('Saved to browser'); }
function resetProject(){
  if(confirm('Start a brand new project? This clears current data (but you can re‑import JSON later).')){
    state = { template:'threeAct', projectTitle:'', logline:'', lanes:[] };
    loadTemplate('threeAct', true);
    el('#projectTitle').value=''; el('#logline').value='';
    toast('Reset complete');
  }
}

// --- Utils ---
function toast(msg){
  statusbar.textContent = msg;
  setTimeout(()=> statusbar.textContent = 'Ready.', 2500);
}
function slug(s){
  return (s||'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
}
function downloadFile(filename, content, mime='text/markdown'){
  const blob = new Blob([content], {type:mime});
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
}
function escapeHtml(str=''){
  return str.replace(/[&<>"']/g, m => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'
  })[m]);
}
