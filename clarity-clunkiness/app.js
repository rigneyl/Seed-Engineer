// clarity-clunkiness/app.js
// Clarity & Clunkiness Checker
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
    const { sentences, wordCount, sentenceCount, avgSentenceLength } = stats;

    const GLUE = TextUtils.glueWords;

    // Tags
    const badgeLevel = avgSentenceLength > 28 ? "High clutter" : avgSentenceLength > 20 ? "Moderate clutter" : "Lean";
    const badgeClass = avgSentenceLength > 28 ? "badge-danger" : avgSentenceLength > 20 ? "" : "badge-muted";

    const badge = document.createElement("div");
    badge.className = `badge ${badgeClass}`;
    const dot = document.createElement("span");
    dot.className = "badge-dot";
    const label = document.createElement("span");
    label.textContent = badgeLevel;
    badge.appendChild(dot);
    badge.appendChild(label);
    tagRow.appendChild(badge);

    // Stats cards
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
    stat("Sentences", sentenceCount || 0, "Rough split on .!?");
    stat("Avg length", sentenceCount ? avgSentenceLength.toFixed(1) : "–", "Words per sentence");

    // Glue word count
    const words = stats.words;
    const glueCounts = {};
    for (const w of words) {
      GLUE.forEach(g => {
        const parts = g.split(" ");
        if (parts.length === 1) {
          if (w === g) glueCounts[g] = (glueCounts[g] || 0) + 1;
        }
      });
    }
    // naive multi-word glue detection
    const lowered = text.toLowerCase();
    GLUE.filter(g => g.includes(" ")).forEach(g => {
      const re = new RegExp("\\b" + g.replace(" ", "\\s+") + "\\b", "g");
      const matches = lowered.match(re);
      if (matches) glueCounts[g] = (glueCounts[g] || 0) + matches.length;
    });

    const totalGlue = Object.values(glueCounts).reduce((a,b) => a + b, 0);
    stat("Glue hits", totalGlue || 0, "Softeners & hedges");

    // Tag row chips
    const glueChip = document.createElement("div");
    glueChip.className = totalGlue > 8 ? "chip chip-strong" : "chip";
    glueChip.textContent = totalGlue > 0 ? `${totalGlue} glue words` : "Clean of glue words";
    tagRow.appendChild(glueChip);

    const longThreshold = 25;
    const veryLongThreshold = 35;

    resultsHeading.textContent = "Clunky sentences & glue word highlights";

    const listEl = resultsList;

    sentences.forEach((s, idx) => {
      const wordsInSentence = TextUtils.splitWords(s).length;
      if (wordsInSentence < longThreshold && !/\b(?:very|really|just|kind of|sort of)\b/i.test(s)) {
        return; // only render more suspect lines
      }

      const item = document.createElement("div");
      item.className = "result-item";

      const header = document.createElement("div");
      header.className = "result-item-header";

      const label = document.createElement("div");
      label.className = "result-label";
      label.textContent = `Sentence ${idx + 1}`;

      const score = document.createElement("div");
      score.className = "result-score";
      const labelText = wordsInSentence >= veryLongThreshold ? "very long" :
                        wordsInSentence >= longThreshold ? "long" : "glue-heavy";
      score.textContent = `${wordsInSentence} words · ${labelText}`;

      header.appendChild(label);
      header.appendChild(score);
      item.appendChild(header);

      let highlighted = s;
      GLUE.forEach(g => {
        const re = new RegExp("(\\b" + g.replace(" ", "\\s+") + "\\b)", "gi");
        highlighted = highlighted.replace(re, "<mark>$1</mark>");
      });

      if (wordsInSentence >= veryLongThreshold) {
        highlighted = "<mark class=\"bad\">" + highlighted + "</mark>";
      }

      const body = document.createElement("div");
      body.className = "result-body";
      body.innerHTML = highlighted;

      item.appendChild(body);
      listEl.appendChild(item);
    });

    if (!resultsList.children.length) {
      const msg = document.createElement("div");
      msg.className = "hint-text";
      msg.textContent = "No obviously clunky sentences detected. Try pasting a messier draft to see this tool stretch its legs.";
      resultsList.appendChild(msg);
    }

  });
})();
