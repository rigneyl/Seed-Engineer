// bukowski-brutality/app.js
// Bukowski Brutality Editor
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
    const { wordCount, sentenceCount, avgSentenceLength, lexicalDensity, words } = stats;

    // Approx "fancy" words: long tokens or containing uncommon letters
    let fancyCount = 0;
    const fancyWords = [];
    words.forEach(w => {
      if (w.length >= 11 || /[jzq]/.test(w)) {
        fancyCount++;
        if (fancyWords.length < 20) fancyWords.push(w);
      }
    });

    // Crutch / hedge words from shared list
    const hedges = TextUtils.crutchWords;
    let hedgeHits = 0;
    const lower = text.toLowerCase();
    hedges.forEach(h => {
      const re = new RegExp("\\b" + h.replace(" ", "\\s+") + "\\b", "gi");
      const m = lower.match(re);
      if (m) hedgeHits += m.length;
    });

    // Brutality index: prefer shorter sentences, low fancy, low hedges
    const lenScore = Math.max(0, 1 - (avgSentenceLength / 30));
    const fancyScore = Math.max(0, 1 - (fancyCount / Math.max(10, sentenceCount * 2)));
    const hedgeScore = Math.max(0, 1 - (hedgeHits / Math.max(8, sentenceCount * 2)));
    const rawness = (lenScore * 0.4 + fancyScore * 0.3 + hedgeScore * 0.3) * 100;

    // Badges
    const badge = document.createElement("div");
    badge.className = rawness >= 70 ? "badge" : rawness >= 45 ? "badge-muted" : "badge-danger";
    const dot = document.createElement("span");
    dot.className = "badge-dot";
    const label = document.createElement("span");
    label.textContent = rawness >= 70 ? "Pretty raw" :
                        rawness >= 45 ? "Half-brutal" : "Too polite";
    badge.appendChild(dot);
    badge.appendChild(label);
    tagRow.appendChild(badge);

    const chip = document.createElement("div");
    chip.className = "chip";
    chip.textContent = `Rawness score: ${rawness.toFixed(0)} / 100`;
    tagRow.appendChild(chip);

    // Stats
    stat("Words", wordCount || 0, "Total tokens");
    stat("Sentences", sentenceCount || 0, "Rough split on .!?");
    stat("Avg length", sentenceCount ? avgSentenceLength.toFixed(1) : "–", "Words per sentence");
    stat("Fancy words", fancyCount, "Long / ornate tokens");
    stat("Hedges", hedgeHits, "Crutch & softeners");

    resultsHeading.textContent = "Brutality & pretension hotspots";

    const sentences = stats.sentences;
    const listEl = resultsList;

    sentences.forEach((s, idx) => {
      const segStats = TextUtils.getTextStats(s);
      const w = segStats.wordCount;
      if (!w) return;
      const hasHedge = /\b(just|really|maybe|kind of|sort of|perhaps|actually|literally)\b/i.test(s);
      const hasFancy = /[jzq]/i.test(s) || /\b(?:transcendent|ethereal|paradigm|ontology|discourse|aesthetic)\b/i.test(s);
      if (w <= 8 && !hasHedge && !hasFancy) return; // likely fine, skip

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
      if (w > 20) tags.push("long");
      if (hasFancy) tags.push("fancy");
      if (hasHedge) tags.push("hedged");
      score.textContent = `${w} w · ${tags.join(" · ") || "soft"}`;
      header.appendChild(lab);
      header.appendChild(score);
      item.appendChild(header);

      let highlighted = s;
      // highlight hedges
      ["just","really","maybe","kind of","sort of","perhaps","actually","literally"].forEach(h => {
        const re = new RegExp("(\\b" + h.replace(" ", "\\s+") + "\\b)", "gi");
        highlighted = highlighted.replace(re, "<mark>$1</mark>");
      });
      // highlight a few fancy indicator words
      ["transcendent","ethereal","paradigm","ontology","discourse","aesthetic"].forEach(h => {
        const re = new RegExp("(\\b" + h + "\\b)", "gi");
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
      msg.textContent = "Nothing obviously over-poetic or hedged. This already reads fairly brutal.";
      resultsList.appendChild(msg);
    }

  });
})();
