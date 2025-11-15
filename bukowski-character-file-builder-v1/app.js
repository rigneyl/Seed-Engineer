// Bukowski's Character File Builder
// Local-only, no backend. Everything lives in memory & your downloads.

const state = {
  name: "",
  tagline: "",
  sketchElements: [],
  traits: {
    flaws: [],
    addictions: [],
    freedoms: [],
    debts: [],
    vices: []
  },
  roomCells: Array(8).fill(null),
  barCells: Array(8).fill(null),
  job: "",
  jobNotes: "",
  neighborhood: "",
  hoodNotes: "",
  prompts: new Set(),
  timeline: {
    childhood: "",
    escape: "",
    addiction: "",
    now: ""
  },
  deserveGet: [],
  selfInsert: 40
};

// Option catalogues & prompt mappings

const SKETCH_ELEMENTS = [
  { id: "tired_eyes", label: "Tired eyes", icon: "👁️", prompt: "Describe the last week that carved those circles under their eyes." },
  { id: "crooked_nose", label: "Crooked nose", icon: "👃", prompt: "Who broke their nose, and what lie they tell about it now." },
  { id: "slouch", label: "Permanent slouch", icon: "〰️", prompt: "Write the moment they stopped walking upright with any pride." },
  { id: "cheap_shirt", label: "Cheap shirt", icon: "👕", prompt: "List the three stains on their favorite shirt and where each came from." },
  { id: "bottle", label: "Bottle in hand", icon: "🍾", prompt: "Write about the night their drink of choice betrayed them." },
  { id: "cigarette", label: "Cigarette", icon: "🚬", prompt: "The first cigarette, the first lie it helped them tell themselves." },
  { id: "notebook", label: "Beat-up notebook", icon: "📓", prompt: "What do they write when they think no one will ever read it?" },
  { id: "boots", label: "Ruined boots", icon: "🥾", prompt: "Every place those boots have been that they hope never to see again." }
];

const ROOM_ITEMS = [
  { id: "mattress_floor", label: "Mattress on floor", prompt: "Explain why they never bought a bed frame. Be honest, not poetic." },
  { id: "overflowing_bin", label: "Overflowing bin", prompt: "List everything rotting in their trash, literal and metaphorical." },
  { id: "cheap_lamp", label: "Cheap lamp", prompt: "What do they do in that weak circle of light?" },
  { id: "empty_bottles", label: "Empty bottles", prompt: "Describe the night represented by each different bottle." },
  { id: "ashtray", label: "Ashtray", prompt: "What memory sticks to them like the smell of that ashtray?" },
  { id: "unpaid_bills", label: "Unpaid bills", prompt: "Write the conversation they rehearse in their head when the landlord calls." },
  { id: "old_radio", label: "Old radio", prompt: "What station do they leave on at night just to feel less alone?" },
  { id: "peeling_wall", label: "Peeling wall", prompt: "The worst thing this wall has overheard." }
];

const BAR_ITEMS = [
  { id: "bar_stool", label: "Wobbly bar stool", prompt: "Which regular they silently compete with for this stool, and why." },
  { id: "bartender", label: "Bartender", prompt: "What the bartender really thinks of them, said in one cruel sentence." },
  { id: "jukebox", label: "Jukebox", prompt: "The one song that ruins them every time it plays." },
  { id: "neon_sign", label: "Flickering neon sign", prompt: "What promise the sign makes that the bar never keeps." },
  { id: "two_regulars", label: "Two regulars", prompt: "Describe the unspoken truce between the two quietest drunks." },
  { id: "corner_table", label: "Corner table", prompt: "What deals or confessions this table has absorbed." },
  { id: "toilet_door", label: "Toilet door", prompt: "The worst thing written or carved into that door." },
  { id: "late_tv", label: "Late night TV", prompt: "What reruns play in the background when their life falls apart again." }
];

const JOBS = [
  { id: "factory_worker", label: "Factory worker", prompt: "The sound that follows them home from the factory and into their dreams." },
  { id: "postal_clerk", label: "Postal clerk", prompt: "The letters they wish they could open and read, and why." },
  { id: "dishwasher", label: "Dishwasher", prompt: "What their hands look like after a shift, and what they scrub at that isn’t there." },
  { id: "call_centre", label: "Call centre grunt", prompt: "The one caller that broke something in them permanently." },
  { id: "night_security", label: "Night shift security", prompt: "Everything they’ve seen while the rest of the city slept." },
  { id: "gig_driver", label: "Gig driver", prompt: "The one passenger they still think about against their will." }
];

const NEIGHBORHOODS = [
  { id: "industrial_outskirts", label: "Industrial outskirts", prompt: "The smell of the air at 3am and what it reminds them of." },
  { id: "decaying_suburb", label: "Decaying suburb", prompt: "How the houses pretend everything is fine." },
  { id: "downtown_grime", label: "Downtown grime strip", prompt: "The loudest sound here and the quietest heartbreak." },
  { id: "motel_district", label: "Cheap motel district", prompt: "Describe three strangers they pass every week but never speak to." },
  { id: "railway_edge", label: "Near the railway", prompt: "What they think about every time a train passes." },
  { id: "inner_cold", label: "Inner city cold room", prompt: "How the city uses them up and forgets their name." }
];

const BUKOWSKI_LINES = [
  "He wasn’t complicated, just tired in very specific ways.",
  "She had two settings: endure or disappear.",
  "Hope, for him, was a side-effect he tried not to indulge.",
  "They drank not to forget but to make remembering survivable.",
  "The city didn’t hate him; it just didn’t notice.",
  "She collected almosts instead of victories.",
  "He treated tomorrow like a rumor.",
  "Her dreams cost more than her rent and paid less than her shifts.",
  "He was the kind of lonely you can only be in a crowd.",
  "Every good intention arrived late and left drunk."
];

// Utility helpers

function $(selector) {
  return document.querySelector(selector);
}
function createEl(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text) el.textContent = text;
  return el;
}

// Init

document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  initSketch();
  initLedger();
  initRoomAndBar();
  initWork();
  initExtras();
  initExports();
  hydrateHeader();
  recalcMetrics();
});

// Tabs

function initTabs() {
  const buttons = document.querySelectorAll(".tab-button");
  const panels = document.querySelectorAll(".tab-panel");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      panels.forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      const tabId = btn.dataset.tab;
      const panel = document.getElementById(`tab-${tabId}`);
      if (panel) panel.classList.add("active");
    });
  });
}

// Header fields

function hydrateHeader() {
  const nameInput = $("#charName");
  const tagInput = $("#charTagline");
  nameInput.addEventListener("input", () => {
    state.name = nameInput.value.trim();
  });
  tagInput.addEventListener("input", () => {
    state.tagline = tagInput.value.trim();
  });
}

// Sketch

function initSketch() {
  const container = $("#sketchElements");
  const canvas = $("#sketchCanvas");

  SKETCH_ELEMENTS.forEach(el => {
    const chip = createEl("button", "chip");
    chip.dataset.id = el.id;
    chip.innerHTML = `<span class="icon">${el.icon}</span><span>${el.label}</span>`;
    chip.addEventListener("click", () => {
      toggleSketchElement(el.id);
    });
    container.appendChild(chip);
  });

  function toggleSketchElement(id) {
    const index = state.sketchElements.indexOf(id);
    if (index === -1) {
      state.sketchElements.push(id);
      const entry = SKETCH_ELEMENTS.find(e => e.id === id);
      if (entry) {
        addPrompt(entry.prompt);
      }
    } else {
      state.sketchElements.splice(index, 1);
    }
    renderSketchCanvas();
    recalcMetrics();
  }

  function renderSketchCanvas() {
    canvas.innerHTML = "";
    if (state.sketchElements.length === 0) {
      const p = createEl("p", "empty-hint", "Their outline appears here as rough symbols.");
      canvas.appendChild(p);
      document.querySelectorAll(".chip").forEach(ch => ch.classList.remove("active"));
      return;
    }
    state.sketchElements.forEach(id => {
      const entry = SKETCH_ELEMENTS.find(e => e.id === id);
      if (!entry) return;
      const token = createEl("div", "sketch-token");
      token.innerHTML = `<span class="icon">${entry.icon}</span><span class="label">${entry.label}</span>`;
      canvas.appendChild(token);
    });
    document.querySelectorAll(".chip").forEach(ch => {
      const id = ch.dataset.id;
      if (state.sketchElements.includes(id)) ch.classList.add("active");
      else ch.classList.remove("active");
    });
  }
}

// Ledger

function initLedger() {
  const groups = ["flaws", "addictions", "freedoms", "debts", "vices"];
  groups.forEach(group => {
    const btn = document.querySelector(`.tiny-button[data-add="${group}"]`);
    if (!btn) return;
    btn.addEventListener("click", () => {
      const text = window.prompt(`Add ${group.slice(0, -1)}:`);
      if (!text) return;
      const trimmed = text.trim();
      if (!trimmed) return;
      state.traits[group].push(trimmed);
      addPromptFromTrait(group, trimmed);
      renderLedgerGroup(group);
      recalcMetrics();
    });
    renderLedgerGroup(group);
  });
}

function renderLedgerGroup(group) {
  const list = document.getElementById(`ledger-${group}`);
  if (!list) return;
  list.innerHTML = "";
  state.traits[group].forEach((entry, idx) => {
    const li = createEl("li", "ledger-item");
    const textSpan = createEl("span", null, entry);
    const removeBtn = createEl("button", null, "×");
    removeBtn.title = "Remove";
    removeBtn.addEventListener("click", () => {
      state.traits[group].splice(idx, 1);
      renderLedgerGroup(group);
      recalcMetrics();
    });
    li.appendChild(textSpan);
    li.appendChild(removeBtn);
    list.appendChild(li);
  });
}

function addPrompt(text) {
  if (!text) return;
  state.prompts.add(text);
  renderPrompts();
}

function addPromptFromTrait(group, value) {
  let prompt;
  switch (group) {
    case "flaws":
      prompt = `Write a scene where this flaw – “${value}” – costs them something important.`;
      break;
    case "addictions":
      prompt = `Describe the first time their addiction to “${value}” felt like a choice, and the first time it didn’t.`;
      break;
    case "freedoms":
      prompt = `Explain the price they paid to earn the freedom of “${value}”.`;
      break;
    case "debts":
      prompt = `Who or what do they owe when it comes to “${value}”, and how badly are they avoiding it?`;
      break;
    case "vices":
      prompt = `Show them indulging in “${value}” on their worst day, in unflattering detail.`;
      break;
  }
  addPrompt(prompt);
}

function renderPrompts() {
  const container = $("#promptsList");
  container.innerHTML = "";
  if (state.prompts.size === 0) {
    const p = createEl("p", "hint", "As you add dirt, vices, places and jobs, prompts will pile up here.");
    container.appendChild(p);
    return;
  }
  Array.from(state.prompts).forEach(text => {
    const div = createEl("div", "prompt-chip");
    div.textContent = text;
    container.appendChild(div);
  });
}

// Room & bar

function initRoomAndBar() {
  const roomPalette = $("#roomPalette");
  const barPalette = $("#barPalette");
  const roomGrid = $("#roomGrid");
  const barGrid = $("#barGrid");

  ROOM_ITEMS.forEach(item => {
    const chip = createEl("button", "chip");
    chip.dataset.id = item.id;
    chip.textContent = item.label;
    chip.addEventListener("click", () => {
      currentRoomItem = item;
    });
    roomPalette.appendChild(chip);
  });

  BAR_ITEMS.forEach(item => {
    const chip = createEl("button", "chip");
    chip.dataset.id = item.id;
    chip.textContent = item.label;
    chip.addEventListener("click", () => {
      currentBarItem = item;
    });
    barPalette.appendChild(chip);
  });

  let currentRoomItem = null;
  let currentBarItem = null;

  // Build simple 2x4 grids
  for (let i = 0; i < 8; i++) {
    const cell = createEl("div", "grid-cell");
    cell.dataset.index = i;
    cell.textContent = "+";
    cell.addEventListener("click", () => {
      if (!currentRoomItem) {
        // allow clearing
        if (state.roomCells[i]) {
          state.roomCells[i] = null;
          renderGrid(roomGrid, state.roomCells, ROOM_ITEMS);
          recalcMetrics();
        }
        return;
      }
      state.roomCells[i] = currentRoomItem.id;
      const entry = ROOM_ITEMS.find(r => r.id === currentRoomItem.id);
      if (entry) addPrompt(entry.prompt);
      renderGrid(roomGrid, state.roomCells, ROOM_ITEMS);
      recalcMetrics();
    });
    roomGrid.appendChild(cell);
  }

  for (let i = 0; i < 8; i++) {
    const cell = createEl("div", "grid-cell");
    cell.dataset.index = i;
    cell.textContent = "+";
    cell.addEventListener("click", () => {
      if (!currentBarItem) {
        if (state.barCells[i]) {
          state.barCells[i] = null;
          renderGrid(barGrid, state.barCells, BAR_ITEMS);
          recalcMetrics();
        }
        return;
      }
      state.barCells[i] = currentBarItem.id;
      const entry = BAR_ITEMS.find(r => r.id === currentBarItem.id);
      if (entry) addPrompt(entry.prompt);
      renderGrid(barGrid, state.barCells, BAR_ITEMS);
      recalcMetrics();
    });
    barGrid.appendChild(cell);
  }

  function renderGrid(gridEl, cells, catalogue) {
    const children = gridEl.querySelectorAll(".grid-cell");
    children.forEach((cell, idx) => {
      const id = cells[idx];
      if (!id) {
        cell.classList.remove("filled");
        cell.textContent = "+";
        return;
      }
      const entry = catalogue.find(e => e.id === id);
      cell.classList.add("filled");
      cell.textContent = entry ? entry.label : "?";
    });
  }

  renderGrid(roomGrid, state.roomCells, ROOM_ITEMS);
  renderGrid(barGrid, state.barCells, BAR_ITEMS);
}

// Work

function initWork() {
  const jobSelect = $("#jobSelect");
  const hoodSelect = $("#hoodSelect");
  const jobNotes = $("#jobNotes");
  const hoodNotes = $("#hoodNotes");

  JOBS.forEach(j => {
    const opt = document.createElement("option");
    opt.value = j.id;
    opt.textContent = j.label;
    jobSelect.appendChild(opt);
  });
  NEIGHBORHOODS.forEach(h => {
    const opt = document.createElement("option");
    opt.value = h.id;
    opt.textContent = h.label;
    hoodSelect.appendChild(opt);
  });

  jobSelect.addEventListener("change", () => {
    state.job = jobSelect.value;
    const entry = JOBS.find(j => j.id === state.job);
    if (entry) addPrompt(entry.prompt);
    recalcMetrics();
  });

  hoodSelect.addEventListener("change", () => {
    state.neighborhood = hoodSelect.value;
    const entry = NEIGHBORHOODS.find(h => h.id === state.neighborhood);
    if (entry) addPrompt(entry.prompt);
    recalcMetrics();
  });

  jobNotes.addEventListener("input", () => {
    state.jobNotes = jobNotes.value;
  });
  hoodNotes.addEventListener("input", () => {
    state.hoodNotes = hoodNotes.value;
  });
}

// Extras

function initExtras() {
  const lineBtn = $("#generateLine");
  const lineOutput = $("#lineOutput");
  lineBtn.addEventListener("click", () => {
    const line = BUKOWSKI_LINES[Math.floor(Math.random() * BUKOWSKI_LINES.length)];
    lineOutput.textContent = line;
  });

  const timelineIds = ["childhood", "escape", "addiction", "now"];
  timelineIds.forEach(id => {
    const el = document.getElementById(`timeline-${id}`);
    if (!el) return;
    el.addEventListener("input", () => {
      state.timeline[id] = el.value;
    });
  });

  const deserveInput = $("#deserveInput");
  const getInput = $("#getInput");
  const addBtn = $("#addDeserveGet");
  const body = $("#deserveGetBody");

  addBtn.addEventListener("click", () => {
    const d = deserveInput.value.trim();
    const g = getInput.value.trim();
    if (!d || !g) return;
    state.deserveGet.push({ deserve: d, get: g });
    deserveInput.value = "";
    getInput.value = "";
    renderDeserveGet();
  });

  function renderDeserveGet() {
    body.innerHTML = "";
    state.deserveGet.forEach((row, idx) => {
      const tr = document.createElement("tr");
      const td1 = createEl("td", null, row.deserve);
      const td2 = createEl("td", null, row.get);
      const td3 = createEl("td");
      const btn = createEl("button", null, "×");
      btn.title = "Remove row";
      btn.addEventListener("click", () => {
        state.deserveGet.splice(idx, 1);
        renderDeserveGet();
      });
      td3.appendChild(btn);
      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      body.appendChild(tr);
    });
  }

  const selfRange = $("#selfInsertRange");
  const selfLabel = $("#selfInsertLabel");
  const updateLabel = () => {
    const v = parseInt(selfRange.value, 10);
    state.selfInsert = v;
    let note;
    if (v < 15) note = "Barely you. You’re wearing thick fictional gloves.";
    else if (v < 40) note = "Some shared bones. Enough to hurt a little.";
    else if (v < 65) note = "This is you in a dirtier mirror.";
    else if (v < 90) note = "You changed the name and a few details. We see you.";
    else note = "You gave them your wallet, your wounds, and your handwriting.";
    selfLabel.textContent = `${v}% – ${note}`;
    recalcMetrics();
  };
  selfRange.addEventListener("input", updateLabel);
  updateLabel();
}

// Metrics

function recalcMetrics() {
  // Dirt score: traits + room/bar + job/hood
  const flawCount = state.traits.flaws.length;
  const addictionCount = state.traits.addictions.length;
  const viceCount = state.traits.vices.length;
  const debtCount = state.traits.debts.length;
  const freedomCount = state.traits.freedoms.length;
  const roomCount = state.roomCells.filter(Boolean).length;
  const barCount = state.barCells.filter(Boolean).length;

  let dirtScore = flawCount * 5 + addictionCount * 7 + viceCount * 4 + debtCount * 4 + (roomCount + barCount) * 2;
  dirtScore = Math.min(100, dirtScore);

  $("#metric-dirt").textContent = dirtScore.toString();
  let dirtNote;
  if (dirtScore === 0) dirtNote = "Too clean. Give them some cracks.";
  else if (dirtScore < 25) dirtNote = "A little tarnish. They still get invited to brunch.";
  else if (dirtScore < 50) dirtNote = "Nicely grubby. A believable mess-in-progress.";
  else if (dirtScore < 75) dirtNote = "They reek of bad decisions in a good way.";
  else dirtNote = "Catastrophic but honest. Chinaski would nod.";
  $("#metric-dirt-note").textContent = dirtNote;

  // Human mess index: debts + addictions + timeline + deserve/get
  const timelineWeight = Object.values(state.timeline).filter(Boolean).length * 4;
  const deserveGetWeight = state.deserveGet.length * 3;
  let messIndex = addictionCount * 8 + debtCount * 5 + timelineWeight + deserveGetWeight;
  messIndex = Math.min(100, messIndex);
  $("#metric-mess").textContent = messIndex.toString();
  let messNote;
  if (messIndex === 0) messNote = "You haven’t broken them enough yet.";
  else if (messIndex < 30) messNote = "Manageable chaos. They still think they’re in control.";
  else if (messIndex < 60) messNote = "Life is juggling them and dropping them often.";
  else if (messIndex < 85) messNote = "Functional disaster. They pass for okay in bad lighting.";
  else messNote = "Held together with nicotine, denial, and a bar tab.";
  $("#metric-mess-note").textContent = messNote;

  // Realism vs romance
  const realismSignals =
    addictionCount +
    viceCount +
    debtCount +
    roomCount +
    barCount +
    (state.job ? 2 : 0) +
    (state.neighborhood ? 2 : 0);
  const romanceSignals = freedomCount + (state.tagline ? 1 : 0);

  $("#metric-realism").textContent = `${realismSignals} / ${romanceSignals}`;
  let realNote;
  if (realismSignals === 0 && romanceSignals === 0) {
    realNote = "No bones yet. Add life before you analyse it.";
  } else if (realismSignals >= romanceSignals * 2) {
    realNote = "Firmly in the gutter. Very little romantic haze.";
  } else if (romanceSignals > realismSignals * 2) {
    realNote = "Careful: you might be romanticising their ruin.";
  } else {
    realNote = "Good balance of grime and poetry.";
  }
  $("#metric-realism-note").textContent = realNote;

  // Self-insertion
  $("#metric-self").textContent = `${state.selfInsert}%`;
  $("#metric-self-note").textContent = $("#selfInsertLabel").textContent.replace(/^[0-9]+% – /, "");
}

// Export & import

function initExports() {
  const exportMdBtn = $("#exportMarkdown");
  const exportJsonBtn = $("#exportJson");
  const loadInput = $("#loadJsonFile");
  const summary = $("#summaryPreview");
  const recalcBtn = $("#recalcButton");

  exportMdBtn.addEventListener("click", () => {
    const md = buildMarkdown();
    summary.value = md.slice(0, 800);
    downloadFile(`${safeFilename()}_character.md`, md, "text/markdown");
  });

  exportJsonBtn.addEventListener("click", () => {
    const json = JSON.stringify(state, null, 2);
    summary.value = buildMarkdown().slice(0, 800);
    downloadFile(`${safeFilename()}_character.json`, json, "application/json");
  });

  loadInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        loadStateFromJson(data);
      } catch (err) {
        alert("Could not parse JSON file. Make sure it was exported from this tool.");
      }
    };
    reader.readAsText(file);
  });

  recalcBtn.addEventListener("click", () => {
    recalcMetrics();
  });
}

function safeFilename() {
  const name = state.name || "bukowski_character";
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}

function buildMarkdown() {
  const sections = [];
  const n = state.name || "Unnamed";
  const tagline = state.tagline || "";

  sections.push(`# ${n}`);
  if (tagline) sections.push(`> ${tagline}`, "");

  // Sketch
  if (state.sketchElements.length) {
    sections.push("## Sketch & Outline");
    const labels = state.sketchElements
      .map(id => {
        const entry = SKETCH_ELEMENTS.find(e => e.id === id);
        return entry ? `- ${entry.label}` : null;
      })
      .filter(Boolean)
      .join("\n");
    if (labels) sections.push(labels, "");
  }

  // Grit ledger
  sections.push("## Grit Ledger");
  Object.entries(state.traits).forEach(([key, arr]) => {
    if (!arr.length) return;
    const title = key.charAt(0).toUpperCase() + key.slice(1);
    sections.push(`### ${title}`);
    arr.forEach(item => sections.push(`- ${item}`));
    sections.push("");
  });

  // Room & bar
  if (state.roomCells.some(Boolean)) {
    sections.push("## Room");
    state.roomCells.forEach(id => {
      if (!id) return;
      const entry = ROOM_ITEMS.find(e => e.id === id);
      if (entry) sections.push(`- ${entry.label}`);
    });
    sections.push("");
  }
  if (state.barCells.some(Boolean)) {
    sections.push("## Bar");
    state.barCells.forEach(id => {
      if (!id) return;
      const entry = BAR_ITEMS.find(e => e.id === id);
      if (entry) sections.push(`- ${entry.label}`);
    });
    sections.push("");
  }

  // Job & neighborhood
  sections.push("## Job & Neighborhood");
  if (state.job) {
    const j = JOBS.find(j => j.id === state.job);
    sections.push(`**Job:** ${j ? j.label : state.job}`);
    if (state.jobNotes) sections.push("", state.jobNotes);
  }
  if (state.neighborhood) {
    const h = NEIGHBORHOODS.find(h => h.id === state.neighborhood);
    sections.push("", `**Neighborhood:** ${h ? h.label : state.neighborhood}`);
    if (state.hoodNotes) sections.push("", state.hoodNotes);
  }
  sections.push("");

  // Timeline
  if (Object.values(state.timeline).some(Boolean)) {
    sections.push("## Vice Progression Timeline");
    if (state.timeline.childhood) sections.push(`- **Childhood crack:** ${state.timeline.childhood}`);
    if (state.timeline.escape) sections.push(`- **First escape:** ${state.timeline.escape}`);
    if (state.timeline.addiction) sections.push(`- **Habit to chain:** ${state.timeline.addiction}`);
    if (state.timeline.now) sections.push(`- **Current mess:** ${state.timeline.now}`);
    sections.push("");
  }

  // Deserve/Get
  if (state.deserveGet.length) {
    sections.push("## What They Deserve vs What They Get");
    state.deserveGet.forEach(row => {
      sections.push(`- Deserve: ${row.deserve}`);
      sections.push(`  Get: ${row.get}`);
    });
    sections.push("");
  }

  // Metrics
  sections.push("## Analysis");
  sections.push(`- Character Dirt Score: ${$("#metric-dirt").textContent} — ${$("#metric-dirt-note").textContent}`);
  sections.push(`- Human Mess Index: ${$("#metric-mess").textContent} — ${$("#metric-mess-note").textContent}`);
  sections.push(`- Realism vs Romance: ${$("#metric-realism").textContent} — ${$("#metric-realism-note").textContent}`);
  sections.push(`- Self-insertion Fingerprint: ${$("#metric-self").textContent} — ${$("#metric-self-note").textContent}`);
  sections.push("");

  // Prompts
  if (state.prompts.size) {
    sections.push("## Unlocked Writing Prompts");
    Array.from(state.prompts).forEach(p => sections.push(`- ${p}`));
    sections.push("");
  }

  sections.push("_Generated with Bukowski’s Character File Builder – HTML-first, local-only._");

  return sections.join("\n");
}

function downloadFile(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 0);
}

function loadStateFromJson(data) {
  // Shallow sanity
  if (!data || typeof data !== "object" || !data.traits) {
    alert("This file doesn't look like a valid character export.");
    return;
  }

  // Merge carefully, falling back to defaults
  state.name = data.name || "";
  state.tagline = data.tagline || "";
  state.sketchElements = Array.isArray(data.sketchElements) ? data.sketchElements : [];
  state.traits = Object.assign(
    { flaws: [], addictions: [], freedoms: [], debts: [], vices: [] },
    data.traits || {}
  );
  state.roomCells = Array.isArray(data.roomCells) ? data.roomCells.slice(0, 8).concat(Array(8).fill(null)).slice(0, 8) : Array(8).fill(null);
  state.barCells = Array.isArray(data.barCells) ? data.barCells.slice(0, 8).concat(Array(8).fill(null)).slice(0, 8) : Array(8).fill(null);
  state.job = data.job || "";
  state.jobNotes = data.jobNotes || "";
  state.neighborhood = data.neighborhood || "";
  state.hoodNotes = data.hoodNotes || "";
  state.timeline = Object.assign(
    { childhood: "", escape: "", addiction: "", now: "" },
    data.timeline || {}
  );
  state.deserveGet = Array.isArray(data.deserveGet) ? data.deserveGet : [];
  state.selfInsert = typeof data.selfInsert === "number" ? data.selfInsert : 40;

  // Rebuild prompts
  state.prompts = new Set(data.prompts || []);

  // Hydrate UI bits
  $("#charName").value = state.name;
  $("#charTagline").value = state.tagline;

  // Sketch chips
  SKETCH_ELEMENTS.forEach(el => {
    const chip = document.querySelector(`.chip[data-id="${el.id}"]`);
    if (chip) {
      if (state.sketchElements.includes(el.id)) chip.classList.add("active");
      else chip.classList.remove("active");
    }
  });
  const sketchCanvas = $("#sketchCanvas");
  sketchCanvas.innerHTML = "";
  if (state.sketchElements.length) {
    state.sketchElements.forEach(id => {
      const entry = SKETCH_ELEMENTS.find(e => e.id === id);
      if (!entry) return;
      const token = createEl("div", "sketch-token");
      token.innerHTML = `<span class="icon">${entry.icon}</span><span class="label">${entry.label}</span>`;
      sketchCanvas.appendChild(token);
    });
  } else {
    const p = createEl("p", "empty-hint", "Their outline appears here as rough symbols.");
    sketchCanvas.appendChild(p);
  }

  // Ledger
  ["flaws", "addictions", "freedoms", "debts", "vices"].forEach(renderLedgerGroup);

  // Room/bar grids
  const roomGrid = $("#roomGrid");
  const barGrid = $("#barGrid");
  const renderGrid = (gridEl, cells, catalogue) => {
    const children = gridEl.querySelectorAll(".grid-cell");
    children.forEach((cell, idx) => {
      const id = cells[idx];
      if (!id) {
        cell.classList.remove("filled");
        cell.textContent = "+";
        return;
      }
      const entry = catalogue.find(e => e.id === id);
      cell.classList.add("filled");
      cell.textContent = entry ? entry.label : "?";
    });
  };
  renderGrid(roomGrid, state.roomCells, ROOM_ITEMS);
  renderGrid(barGrid, state.barCells, BAR_ITEMS);

  // Job & neighborhood
  $("#jobSelect").value = state.job || "";
  $("#hoodSelect").value = state.neighborhood || "";
  $("#jobNotes").value = state.jobNotes;
  $("#hoodNotes").value = state.hoodNotes;

  // Timeline
  ["childhood", "escape", "addiction", "now"].forEach(id => {
    const el = document.getElementById(`timeline-${id}`);
    if (el) el.value = state.timeline[id] || "";
  });

  // Deserve/get
  const body = $("#deserveGetBody");
  body.innerHTML = "";
  state.deserveGet.forEach((row, idx) => {
    const tr = document.createElement("tr");
    const td1 = createEl("td", null, row.deserve);
    const td2 = createEl("td", null, row.get);
    const td3 = createEl("td");
    const btn = createEl("button", null, "×");
    btn.title = "Remove row";
    btn.addEventListener("click", () => {
      state.deserveGet.splice(idx, 1);
      // re-render
      const ev = new Event("dummy");
      document.dispatchEvent(ev); // not used; we'll just rebuild below
    });
    td3.appendChild(btn);
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    body.appendChild(tr);
  });

  // Self insertion
  const selfRange = $("#selfInsertRange");
  selfRange.value = state.selfInsert;
  const event = new Event("input");
  selfRange.dispatchEvent(event);

  renderPrompts();
  recalcMetrics();
}
