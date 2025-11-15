// overused-repeated/app.js
// Overused & Repeated Words Scanner
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

  analyzeBtn.addEventListener("click", () => {
    const text = input.value.trim();
    if (!text) {
      clearAll();
      resultsHeading.textContent = "Nothing to analyze yet.";
      return;
    }
    statsGrid.innerHTML = "";
    resultsList.innerHTML = "";
    tagRow.innerHTML = "";

    
    const stats = TextUtils.getTextStats(text);
    const { wordCount, freqMap } = stats;
    const sorted = TextUtils.sortedFrequencies(freqMap);
    const CRUTCH = TextUtils.crutchWords;

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

    stat("Words", wordCount || 0, "Total tokens");

    const topN = sorted.slice(0, 20);
    const crutchHits = topN.filter(([w]) => CRUTCH.includes(w)).length;
    const uniqueWords = sorted.length;
    const typeTokenRatio = wordCount ? (uniqueWords / wordCount) : 0;

    stat("Unique words", uniqueWords, "Different tokens");
    stat("Type-token", (typeTokenRatio * 100).toFixed(1) + "%", "Higher = more variety");
    stat("Crutch hits", crutchHits, "Top 20 soft words");

    const badge = document.createElement("div");
    const badgeClass = crutchHits >= 5 ? "badge-danger" :
                       crutchHits >= 2 ? "" :
                       "badge-muted";
    badge.className = `badge ${badgeClass}`;
    const dot = document.createElement("span");
    dot.className = "badge-dot";
    const label = document.createElement("span");
    label.textContent = crutchHits === 0 ? "No obvious crutches" :
                         crutchHits >= 5 ? "Heavy crutch usage" :
                         "Some crutch words";
    badge.appendChild(dot);
    badge.appendChild(label);
    tagRow.appendChild(badge);

    const chip = document.createElement("div");
    chip.className = "chip";
    chip.textContent = `Top ${topN.length} words shown`;
    tagRow.appendChild(chip);

    resultsHeading.textContent = "Most frequent & overused words";

    const listEl = resultsList;
    if (!topN.length) {
      const msg = document.createElement("div");
      msg.className = "hint-text";
      msg.textContent = "No words found. Paste some text above to see a frequency table.";
      listEl.appendChild(msg);
      return;
    }

    topN.forEach(([w, c], idx) => {
      const item = document.createElement("div");
      item.className = "result-item";

      const header = document.createElement("div");
      header.className = "result-item-header";

      const label = document.createElement("div");
      label.className = "result-label";
      label.textContent = `${idx + 1}. ${w}`;

      const score = document.createElement("div");
      score.className = "result-score";
      const pct = wordCount ? ((c / wordCount) * 100).toFixed(1) : "0.0";
      score.textContent = `${c} · ${pct}%`;

      header.appendChild(label);
      header.appendChild(score);
      item.appendChild(header);

      const body = document.createElement("div");
      body.className = "result-body";

      const isCrutch = CRUTCH.includes(w);
      const isStop = TextUtils.isStopword(w);

      const tags = [];
      if (isCrutch) tags.push("crutch");
      if (isStop) tags.push("stopword");
      if (!isStop && !isCrutch) tags.push("content");

      body.textContent = tags.length ? `Tags: ${tags.join(", ")}` : "Tags: –";

      if (isCrutch) {
        const mark = document.createElement("div");
        mark.className = "hint-text";
        mark.textContent = "Consider swapping or cutting this if you overuse it.";
        body.appendChild(document.createElement("br"));
        body.appendChild(mark);
      }

      item.appendChild(body);
      listEl.appendChild(item);
    });

  });
})();
