// mccarthy-minimalism/app.js
// McCarthy Minimalism Engine
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
    const { wordCount, sentenceCount, avgSentenceLength, words } = stats;

    // Crude adverb detection: -ly ending (exclude "only", "family" etc lightly)
    let adverbCount = 0;
    words.forEach(w => {
      if (/ly$/.test(w) && !/(only|family|supply|reply)$/.test(w)) adverbCount++;
    });

    // Approx adjectives: very naive – longish words not ending in -ly/-ing/-ed
    let adjCount = 0;
    words.forEach(w => {
      if (w.length >= 6 && !/ly$/.test(w) && !/(ing|ed)$/.test(w)) adjCount++;
    });

    const commaMatches = (text.match(/,/g) || []).length;

    const modifierRate = (adverbCount + adjCount) / Math.max(1, wordCount);
    const commaRate = commaMatches / Math.max(1, sentenceCount || 1);

    // Minimalist purity: fewer modifiers & commas, slightly longer cadence
    const modScore = Math.max(0, 1 - modifierRate * 40);
    const commaScore = Math.max(0, 1 - commaRate * 0.8);
    const lengthScore = avgSentenceLength ? Math.min(1, avgSentenceLength / 24) : 0.5;
    const purity = (modScore * 0.5 + commaScore * 0.3 + lengthScore * 0.2) * 100;

    const badge = document.createElement("div");
    badge.className = purity >= 70 ? "badge" : purity >= 45 ? "badge-muted" : "badge-danger";
    const dot = document.createElement("span");
    dot.className = "badge-dot";
    const label = document.createElement("span");
    label.textContent = purity >= 70 ? "Austere" :
                        purity >= 45 ? "Half-minimal" : "Over-decorated";
    badge.appendChild(dot);
    badge.appendChild(label);
    tagRow.appendChild(badge);

    const chip = document.createElement("div");
    chip.className = "chip";
    chip.textContent = `Minimalist purity: ${purity.toFixed(0)} / 100`;
    tagRow.appendChild(chip);

    stat("Words", wordCount || 0, "Total tokens");
    stat("Sentences", sentenceCount || 0, "Rough split on .!?");
    stat("Avg length", sentenceCount ? avgSentenceLength.toFixed(1) : "–", "Words per sentence");
    stat("Adverbs", adverbCount, "-ly endings");
    stat("Adj. approx.", adjCount, "Longish descriptors");
    stat("Commas", commaMatches, "Punctuation breaks");

    resultsHeading.textContent = "Modifier-heavy sentences";

    const sentences = stats.sentences;
    const listEl = resultsList;

    sentences.forEach((s, idx) => {
      const wStats = TextUtils.getTextStats(s);
      const w = wStats.wordCount;
      if (!w) return;
      const advIn = (TextUtils.splitWords(s).filter(x => /ly$/.test(x)).length);
      const commasIn = (s.match(/,/g) || []).length;
      if (advIn === 0 && commasIn === 0 && w <= 18) return; // already minimal

      const item = document.createElement("div");
      item.className = "result-item";
      const header = document.createElement("div");
      header.className = "result-item-header";
      const lab = document.createElement("div");
      lab.className = "result-label";
      lab.textContent = `Sentence ${idx + 1}`;
      const score = document.createElement("div");
      score.className = "result-score";
      score.textContent = `${w} w · ${advIn} adv · ${commasIn} commas`;
      header.appendChild(lab);
      header.appendChild(score);
      item.appendChild(header);

      let highlighted = s.replace(/,/g, "<mark>,</mark>");
      highlighted = highlighted.replace(/\b(\w+ly)\b/g, "<mark class='bad'>$1</mark>");

      const body = document.createElement("div");
      body.className = "result-body";
      body.innerHTML = highlighted;
      item.appendChild(body);
      listEl.appendChild(item);
    });

    if (!resultsList.children.length) {
      const msg = document.createElement("div");
      msg.className = "hint-text";
      msg.textContent = "Very few modifiers or commas detected. This is already close to an austere line.";
      resultsList.appendChild(msg);
    }

  });
})();
