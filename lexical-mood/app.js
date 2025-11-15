// lexical-mood/app.js
// Lexical Mood Scanner
(function() {
  const input = document.getElementById("input-text");
  const analyzeBtn = document.getElementById("btn-analyze");
  const clearBtn = document.getElementById("btn-clear");
  const statsGrid = document.getElementById("stats-grid");
  const resultsHeading = document.getElementById("results-heading");
  const resultsList = document.getElementById("results-list");
  const tagRow = document.getElementById("tag-row");

  function clearAll() {
    input.value = "";
    statsGrid.innerHTML = "";
    resultsList.innerHTML = "";
    tagRow.innerHTML = "";
    resultsHeading.textContent = "Waiting for input…";
  }

  clearBtn.addEventListener("click", clearAll);

  function stat(label, value, note) {
    const card = document.createElement("div");
    card.className = "stat-card";
    const l = document.createElement("div");
    l.className = "stat-label";
    l.textContent = label;
    const v = document.createElement("div");
    v.className = "stat-value";
    v.textContent = value;
    const n = document.createElement("div");
    n.className = "stat-note";
    n.textContent = note;
    card.appendChild(l);
    card.appendChild(v);
    card.appendChild(n);
    statsGrid.appendChild(card);
  }

  analyzeBtn.addEventListener("click", () => {
    const text = input.value.trim();
    if (!text) {
      clearAll();
      return;
    }
    statsGrid.innerHTML = "";
    resultsList.innerHTML = "";
    tagRow.innerHTML = "";

    const stats = TextUtils.getTextStats(text);
    const { wordCount, words } = stats;
    const w = words.map(x => x.toLowerCase());

    const lists = {
      despair: [ "hopeless","despair","worthless","pointless","futile","futility","meaningless","nihil","void","empty","nothing" ],
      aggression: [ "hate","hated","loath","loathing","violence","violent","rage","fury","anger","spite","attack","destroy" ],
      melancholy: [ "sad","sorrow","melancholy","blue","lonely","alone","isolation","grief","mourning" ],
      contempt: [ "idiot","stupid","pathetic","disgust","vile","vermin","scum","trash","worthless","clown" ],
      hope: [ "hope","hopeful","light","future","possible","possibility","chance","redemption","healing" ],
      numb: [ "numb","blank","empty","dull","detached","disconnected","drained" ]
    };

    const counts = { despair:0, aggression:0, melancholy:0, contempt:0, hope:0, numb:0 };

    w.forEach(token => {
      for (const key in lists) {
        if (lists[key].includes(token)) counts[key]++;
      }
    });

    const totalHits = Object.values(counts).reduce((a,b)=>a+b,0) || 1;

    const badge = document.createElement("div");
    badge.className = "badge";
    const dot = document.createElement("span");
    dot.className = "badge-dot";
    const label = document.createElement("span");
    // dominant mood
    let dominant = "neutral";
    let maxMood = 0;
    for (const key in counts) {
      if (counts[key] > maxMood) { maxMood = counts[key]; dominant = key; }
    }
    label.textContent = `Dominant: ${dominant}`;
    badge.appendChild(dot);
    badge.appendChild(label);
    tagRow.appendChild(badge);

    stat("Words", wordCount || 0, "Total tokens");
    stat("Mood hits", totalHits === 1 ? 0 : totalHits, "Lexicon matches");

    resultsHeading.textContent = "Lexical mood distribution";

    const listEl = resultsList;

    for (const key in counts) {
      const val = counts[key];
      const pct = ((val / totalHits) * 100).toFixed(0);
      const item = document.createElement("div");
      item.className = "result-item";
      const header = document.createElement("div");
      header.className = "result-item-header";
      const lab = document.createElement("div");
      lab.className = "result-label";
      lab.textContent = key;
      const score = document.createElement("div");
      score.className = "result-score";
      score.textContent = `${val} · ${pct}%`;
      header.appendChild(lab);
      header.appendChild(score);
      item.appendChild(header);

      const body = document.createElement("div");
      body.className = "result-body";
      body.textContent = val ? `Mood presence detected in this channel.` : "No obvious lexicon hits here.";
      item.appendChild(body);
      listEl.appendChild(item);
    }

    if (totalHits === 1) {
      const msg = document.createElement("div");
      msg.className = "hint-text";
      msg.textContent = "Very few mood words were detected. This text may be more abstract, technical, or neutral.";
      listEl.appendChild(msg);
    }

  });
})();
