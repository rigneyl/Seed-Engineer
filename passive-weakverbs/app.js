// passive-weakverbs/app.js
// Passive Voice & Weak Verbs Finder
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
    const { sentences } = stats;

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

    const passiveRe = /\b(?:was|were|is|are|been|being|be)\s+\w+ed\b/gi;
    const weakPhrases = [
      "seems to", "seemed to",
      "started to", "begin to", "began to",
      "decided to", "tried to", "attempted to"
    ];

    let passiveCount = 0;
    let weakCount = 0;

    const flagged = [];

    sentences.forEach((s, idx) => {
      const lower = s.toLowerCase();
      let hasPassive = false;
      let hasWeak = false;

      const passiveMatches = s.match(passiveRe);
      if (passiveMatches && passiveMatches.length) {
        hasPassive = true;
        passiveCount += passiveMatches.length;
      }

      const foundWeak = [];
      weakPhrases.forEach(p => {
        const re = new RegExp("\\b" + p.replace(" ", "\\s+") + "\\b", "gi");
        const m = lower.match(re);
        if (m && m.length) {
          hasWeak = true;
          weakCount += m.length;
          foundWeak.push(p);
        }
      });

      if (hasPassive || hasWeak) {
        flagged.push({ index: idx, sentence: s, passiveMatches: passiveMatches || [], weakPhrases: foundWeak });
      }
    });

    const totalSentences = sentences.length || 0;
    const passiveDensity = totalSentences ? (flagged.filter(f => f.passiveMatches.length > 0).length / totalSentences) : 0;
    const weakDensity = totalSentences ? (flagged.filter(f => f.weakPhrases.length > 0).length / totalSentences) : 0;

    stat("Sentences", totalSentences, "Total");
    stat("Passive hits", passiveCount, "Pattern: was/were + verb-ed");
    stat("Weak-verb hits", weakCount, "Seems to / started to …");
    stat("Passive coverage", (passiveDensity * 100).toFixed(0) + "%", "Sentences with passive");
    stat("Weak coverage", (weakDensity * 100).toFixed(0) + "%", "Sentences with weak verbs");

    const badge = document.createElement("div");
    const badgeClass =
      passiveDensity > 0.35 || weakDensity > 0.35 ? "badge-danger" :
      passiveDensity > 0.18 || weakDensity > 0.18 ? "" :
      "badge-muted";
    badge.className = `badge ${badgeClass}`;
    const dot = document.createElement("span");
    dot.className = "badge-dot";
    const label = document.createElement("span");
    label.textContent =
      passiveDensity > 0.35 || weakDensity > 0.35 ? "Heavily softened" :
      passiveDensity > 0.18 || weakDensity > 0.18 ? "Some softening" :
      "Mostly direct";
    badge.appendChild(dot);
    badge.appendChild(label);
    tagRow.appendChild(badge);

    resultsHeading.textContent = "Passive voice & weak verbs";

    const listEl = resultsList;

    if (!flagged.length) {
      const msg = document.createElement("div");
      msg.className = "hint-text";
      msg.textContent = "No obvious passive patterns or weak verb phrases detected. This draft reads fairly direct.";
      listEl.appendChild(msg);
      return;
    }

    flagged.forEach(({ index, sentence, passiveMatches, weakPhrases }) => {
      const item = document.createElement("div");
      item.className = "result-item";

      const header = document.createElement("div");
      header.className = "result-item-header";

      const label = document.createElement("div");
      label.className = "result-label";
      label.textContent = `Sentence ${index + 1}`;

      const score = document.createElement("div");
      score.className = "result-score";
      const tags = [];
      if (passiveMatches.length) tags.push("passive");
      if (weakPhrases.length) tags.push("weak");
      score.textContent = tags.join(" · ");

      header.appendChild(label);
      header.appendChild(score);
      item.appendChild(header);

      let highlighted = sentence;

      passiveMatches.forEach(m => {
        const re = new RegExp(m.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
        highlighted = highlighted.replace(re, "<mark class=\"bad\">" + m + "</mark>");
      });

      weakPhrases.forEach(p => {
        const re = new RegExp("(\\b" + p.replace(" ", "\\s+") + "\\b)", "gi");
        highlighted = highlighted.replace(re, "<mark>$1</mark>");
      });

      const body = document.createElement("div");
      body.className = "result-body";
      body.innerHTML = highlighted;

      item.appendChild(body);
      listEl.appendChild(item);
    });

  });
})();
