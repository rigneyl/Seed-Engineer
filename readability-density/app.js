// readability-density/app.js
// Readability & Density Analyzer
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

    
    const r = TextUtils.computeReadability(text);
    const {
      wordCount,
      sentenceCount,
      avgSentenceLength,
      avgSyllablesPerWord,
      fleschReadingEase,
      fleschKincaidGrade,
      lexicalDensity
    } = r;

    let levelLabel = "Unknown";
    if (fleschReadingEase !== null) {
      if (fleschReadingEase >= 70) levelLabel = "Easy";
      else if (fleschReadingEase >= 50) levelLabel = "Moderate";
      else if (fleschReadingEase >= 30) levelLabel = "Dense";
      else levelLabel = "Very dense";
    }

    const badgeClass =
      fleschReadingEase !== null && fleschReadingEase < 40 ? "badge-danger" :
      fleschReadingEase !== null && fleschReadingEase < 55 ? "" :
      "badge-muted";

    const badge = document.createElement("div");
    badge.className = `badge ${badgeClass}`;
    const dot = document.createElement("span");
    dot.className = "badge-dot";
    const label = document.createElement("span");
    label.textContent = levelLabel;
    badge.appendChild(dot);
    badge.appendChild(label);
    tagRow.appendChild(badge);

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
    stat("Lexical density", (lexicalDensity * 100).toFixed(0) + "%", "Non-stopwords");
    stat("Flesch score", fleschReadingEase !== null ? fleschReadingEase.toFixed(1) : "–", "Higher = easier");
    stat("Grade approx.", fleschKincaidGrade !== null ? fleschKincaidGrade.toFixed(1) : "–", "School years");

    const ldChip = document.createElement("div");
    ldChip.className = lexicalDensity > 0.55 ? "chip chip-strong" :
                       lexicalDensity < 0.35 ? "chip" :
                       "chip";
    ldChip.textContent = `Density ${(lexicalDensity * 100).toFixed(0)}%`;
    tagRow.appendChild(ldChip);

    resultsHeading.textContent = "Readability breakdown by segment";

    const sentences = r.sentences;
    const listEl = resultsList;

    if (!sentences.length) {
      const msg = document.createElement("div");
      msg.className = "hint-text";
      msg.textContent = "Type or paste a few lines to see per-sentence difficulty.";
      listEl.appendChild(msg);
      return;
    }

    sentences.forEach((s, idx) => {
      const segStats = TextUtils.getTextStats(s);
      const w = segStats.wordCount;
      const syl = segStats.syllables;
      const sc = segStats.sentenceCount || 1;
      const ASL = w / sc || 0;
      const ASW = w ? syl / w : 0;
      const FRE = w && sc ? 206.835 - (1.015 * ASL) - (84.6 * ASW) : null;

      const item = document.createElement("div");
      item.className = "result-item";

      const header = document.createElement("div");
      header.className = "result-item-header";

      const label = document.createElement("div");
      label.className = "result-label";
      label.textContent = `Sentence ${idx + 1}`;

      const score = document.createElement("div");
      score.className = "result-score";
      if (FRE === null) {
        score.textContent = `${w} words`;
      } else {
        score.textContent = `${w} w · Flesch ${FRE.toFixed(0)}`;
      }

      header.appendChild(label);
      header.appendChild(score);
      item.appendChild(header);

      const body = document.createElement("div");
      body.className = "result-body";
      body.textContent = s;

      item.appendChild(body);
      listEl.appendChild(item);
    });

  });
})();
