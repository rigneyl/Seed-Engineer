// inhuman-distance/app.js
// Inhuman Distance Checker
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
    const { wordCount, sentences } = stats;

    const warmWords = [
      "love","loved","loving","care","cared","kind","kindness","warm","gentle","soft",
      "hope","hopeful","believe","believing","together","friend","friends","forgive","forgiveness",
      "compassion","empathy","humanity","warmth","kindhearted"
    ];
    const coldWords = [
      "void","nothing","empty","hollow","cold","distant","distance","machine","mechanical","sterile",
      "indifferent","indifference","nihil","misanthropy","misanthrope","ruin","decay","rotting","futile","futility"
    ];

    let warmHits = 0;
    let coldHits = 0;

    const lowerWords = stats.words.map(w => w.toLowerCase());
    lowerWords.forEach(w => {
      if (warmWords.includes(w)) warmHits++;
      if (coldWords.includes(w)) coldHits++;
    });

    const totalMarked = warmHits + coldHits || 1;
    const distancePct = (coldHits / totalMarked) * 100;

    const badge = document.createElement("div");
    badge.className = distancePct >= 70 ? "badge" :
                      distancePct >= 40 ? "badge-muted" : "badge-danger";
    const dot = document.createElement("span");
    dot.className = "badge-dot";
    const label = document.createElement("span");
    label.textContent = distancePct >= 70 ? "Inhumanly distant" :
                        distancePct >= 40 ? "Cool tone" : "Too warm";
    badge.appendChild(dot);
    badge.appendChild(label);
    tagRow.appendChild(badge);

    const chip = document.createElement("div");
    chip.className = "chip";
    chip.textContent = `Inhuman distance: ${distancePct.toFixed(0)}%`;
    tagRow.appendChild(chip);

    stat("Words", wordCount || 0, "Total tokens");
    stat("Sentences", sentences.length || 0, "Lines considered");
    stat("Warm hits", warmHits, "Compassion / hope lexicon");
    stat("Cold hits", coldHits, "Void / misanthropy lexicon");

    resultsHeading.textContent = "Warm leaks & cold streaks";

    const listEl = resultsList;

    sentences.forEach((s, idx) => {
      const lower = s.toLowerCase();
      const hasWarm = warmWords.some(w => lower.includes(w));
      const hasCold = coldWords.some(w => lower.includes(w));
      if (!hasWarm && !hasCold) return;

      const item = document.createElement("div");
      item.className = "result-item";
      const header = document.createElement("div");
      header.className = "result-item-header";
      const lab = document.createElement("div");
      lab.className = "result-label";
      lab.textContent = `Sentence ${idx + 1}`;
      const score = document.createElement("div");
      score.className = "result-score";
      const tags = [];
      if (hasWarm) tags.push("warm");
      if (hasCold) tags.push("cold");
      score.textContent = tags.join(" · ");
      header.appendChild(lab);
      header.appendChild(score);
      item.appendChild(header);

      let highlighted = s;
      warmWords.forEach(w => {
        const re = new RegExp("(\\b" + w + "\\b)", "gi");
        highlighted = highlighted.replace(re, "<mark>$1</mark>");
      });
      coldWords.forEach(w => {
        const re = new RegExp("(\\b" + w + "\\b)", "gi");
        highlighted = highlighted.replace(re, "<mark class='bad'>$1</mark>");
      });

      const body = document.createElement("div");
      body.className = "result-body";
      body.innerHTML = highlighted;
      item.appendChild(body);
      listEl.appendChild(item);
    });

    if (!resultsList.children.length) {
      const msg = document.createElement("div");
      msg.className = "hint-text";
      msg.textContent = "No obvious warm or cold lexicon flagged. Tone may be neutral or abstract.";
      resultsList.appendChild(msg);
    }

  });
})();
