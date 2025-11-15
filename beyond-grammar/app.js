
// beyond-grammar/app.js
// Composite report: overused words, clichés, awkward phrasings.

(function() {
  const input = document.getElementById("input-text");
  const clearBtn = document.getElementById("btn-clear");
  const analyzeBtn = document.getElementById("btn-analyze");
  const statsGrid = document.getElementById("stats-grid");
  const tagRow = document.getElementById("tag-row");
  const resultsHeading = document.getElementById("results-heading");
  const resultsList = document.getElementById("results-list");

  function clearAll() {
    input.value = "";
    statsGrid.innerHTML = "";
    tagRow.innerHTML = "";
    resultsList.innerHTML = "";
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

  function addBadge(text, muted) {
    const badge = document.createElement("div");
    badge.className = muted ? "badge badge-muted" : "badge";
    const dot = document.createElement("span");
    dot.className = "badge-dot";
    const label = document.createElement("span");
    label.textContent = text;
    badge.appendChild(dot);
    badge.appendChild(label);
    tagRow.appendChild(badge);
  }

  analyzeBtn.addEventListener("click", () => {
    const text = input.value.trim();
    if (!text) {
      clearAll();
      return;
    }

    statsGrid.innerHTML = "";
    tagRow.innerHTML = "";
    resultsList.innerHTML = "";
    resultsHeading.textContent = "Composite style report";

    const stats = TextUtils.getTextStats(text);
    const read = TextUtils.computeReadability(text);
    const { wordCount, sentenceCount, lexicalDensity, avgSentenceLength } = read;

    // ----- Overview stats -----
    stat("Words", wordCount || 0, "Total tokens");
    stat("Sentences", sentenceCount || 0, "Rough split on .!?");
    stat("Avg length", sentenceCount ? avgSentenceLength.toFixed(1) : "–", "Words per sentence");
    stat("Lexical density", (lexicalDensity * 100).toFixed(0) + "%", "Non-stopwords");

    const fre = read.fleschReadingEase;
    if (fre !== null) {
      let label = "Unknown density";
      if (fre >= 70) label = "Easy";
      else if (fre >= 50) label = "Moderate";
      else if (fre >= 30) label = "Dense";
      else label = "Very dense";
      stat("Flesch", fre.toFixed(1), label);
    }

    // ----- Overused words -----
    const sorted = TextUtils.sortedFrequencies(stats.freqMap);
    const CRUTCH = TextUtils.crutchWords;
    const topN = sorted.slice(0, 10);
    const uniqueWords = sorted.length;
    const ttr = wordCount ? (uniqueWords / wordCount) : 0;
    const crutchTop = topN.filter(([w]) => CRUTCH.includes(w)).map(([w]) => w);

    if (crutchTop.length) {
      addBadge("Crutch-heavy", false);
    } else {
      addBadge("No obvious crutch words in top 10", true);
    }

    // ----- Clichés & tired phrases -----
    const clichéList = [
      "at the end of the day",
      "needless to say",
      "the fact that",
      "in this day and age",
      "each and every",
      "if you will",
      "first and foremost",
      "the elephant in the room",
      "last but not least",
      "literally",
      "quite frankly",
      "to be honest",
      "for all intents and purposes"
    ];

    const lower = text.toLowerCase();
    const clichéHits = [];
    clichéList.forEach(phrase => {
      const re = new RegExp("\\b" + phrase.replace(/ /g, "\\s+") + "\\b", "gi");
      const matches = lower.match(re);
      if (matches && matches.length) {
        clichéHits.push({ phrase, count: matches.length });
      }
    });

    if (clichéHits.length) {
      addBadge("Clichés detected", false);
    } else {
      addBadge("No catalog clichés found", true);
    }

    // ----- Awkward phrasings (heuristic) -----
    const awkwardPatterns = [
      { label: "in order to", re: /\bin order to\b/gi },
      { label: "the reason is because", re: /\bthe reason is because\b/gi },
      { label: "double of (of the of)", re: /\bof\s+the\s+of\b/gi },
      { label: "stacked prepositions", re: /\b(in|on|at|with|from|to|for)\s+(the\s+)?(in|on|at|with|from|to|for)\b/gi },
      { label: "it was that", re: /\bit was that\b/gi }
    ];
    const awkwardHits = [];
    awkwardPatterns.forEach(p => {
      const matches = lower.match(p.re);
      if (matches && matches.length) {
        awkwardHits.push({ label: p.label, count: matches.length });
      }
    });

    if (awkwardHits.length) {
      addBadge("Awkward constructions flagged", false);
    } else {
      addBadge("No common awkward patterns found", true);
    }

    // ----- Build results sections -----
    const results = document.createElement("div");
    results.className = "results-list-inner";

    // Section 1: Overuse table
    (function() {
      const block = document.createElement("div");
      block.className = "result-item";

      const header = document.createElement("div");
      header.className = "result-item-header";
      const labelEl = document.createElement("div");
      labelEl.className = "result-label";
      labelEl.textContent = "Overused & repeated words";
      const scoreEl = document.createElement("div");
      scoreEl.className = "result-score";
      scoreEl.textContent = `TTR ${(ttr * 100).toFixed(1)}%`;
      header.appendChild(labelEl);
      header.appendChild(scoreEl);
      block.appendChild(header);

      const body = document.createElement("div");
      body.className = "result-body";
      let html = "";
      html += `<p><strong>Unique words:</strong> ${uniqueWords}</p>`;
      if (crutchTop.length) {
        html += `<p><strong>Crutch words in top 10:</strong> ${crutchTop.join(", ")}</p>`;
      } else {
        html += `<p><strong>Crutch words in top 10:</strong> none of the catalog list.</p>`;
      }
      if (topN.length) {
        html += "<p><strong>Top words:</strong></p><ul>";
        topN.forEach(([w,c]) => {
          const pct = wordCount ? ((c / wordCount) * 100).toFixed(1) : "0.0";
          html += `<li>${w} — ${c} (${pct}%)</li>`;
        });
        html += "</ul>";
      }
      body.innerHTML = html;
      block.appendChild(body);
      results.appendChild(block);
    })();

    // Section 2: Cliché report
    (function() {
      const block = document.createElement("div");
      block.className = "result-item";

      const header = document.createElement("div");
      header.className = "result-item-header";
      const labelEl = document.createElement("div");
      labelEl.className = "result-label";
      labelEl.textContent = "Tired clichés";
      const scoreEl = document.createElement("div");
      scoreEl.className = "result-score";
      scoreEl.textContent = clichéHits.length ? `${clichéHits.length} types` : "clean";
      header.appendChild(labelEl);
      header.appendChild(scoreEl);
      block.appendChild(header);

      const body = document.createElement("div");
      body.className = "result-body";
      let html = "";
      if (!clichéHits.length) {
        html = "<p>No phrases from the small built-in cliché list were detected.</p>";
      } else {
        html = "<p>The following phrases were flagged as tired or overused:</p><ul>";
        clichéHits.forEach(hit => {
          html += `<li>${hit.phrase} — ${hit.count}×</li>`;
        });
        html += "</ul><p>Consider cutting, compressing, or replacing them with more specific images.</p>";
      }
      body.innerHTML = html;
      block.appendChild(body);
      results.appendChild(block);
    })();

    // Section 3: Awkward phrasing
    (function() {
      const block = document.createElement("div");
      block.className = "result-item";

      const header = document.createElement("div");
      header.className = "result-item-header";
      const labelEl = document.createElement("div");
      labelEl.className = "result-label";
      labelEl.textContent = "Awkward phrasings";
      const scoreEl = document.createElement("div");
      scoreEl.className = "result-score";
      scoreEl.textContent = awkwardHits.length ? `${awkwardHits.length} patterns` : "none spotted";
      header.appendChild(labelEl);
      header.appendChild(scoreEl);
      block.appendChild(header);

      const body = document.createElement("div");
      body.className = "result-body";

      if (!awkwardHits.length) {
        body.innerHTML = "<p>No common awkward patterns from the small checklist were detected.</p>";
      } else {
        let html = "<p>These constructions can usually be tightened:</p><ul>";
        awkwardHits.forEach(hit => {
          html += `<li>${hit.label} — ${hit.count}×</li>`;
        });
        html += "</ul><p>Search for each phrase in your draft and see if a simpler version works.</p>";
        body.innerHTML = html;
      }
      block.appendChild(body);
      results.appendChild(block);
    })();

    // Section 4: Sentence-level hotspots (long + complex)
    (function() {
      const sentences = stats.sentences;
      const list = [];

      sentences.forEach((s, idx) => {
        const st = TextUtils.getTextStats(s);
        const wc = st.wordCount;
        const commaCount = (s.match(/,/g) || []).length;
        if (!wc) return;

        if (wc >= 30 || commaCount >= 3) {
          list.push({ index: idx + 1, text: s, wc, commaCount });
        }
      });

      const block = document.createElement("div");
      block.className = "result-item";

      const header = document.createElement("div");
      header.className = "result-item-header";
      const labelEl = document.createElement("div");
      labelEl.className = "result-label";
      labelEl.textContent = "Sentence hotspots";
      const scoreEl = document.createElement("div");
      scoreEl.className = "result-score";
      scoreEl.textContent = list.length ? `${list.length} candidates` : "none severe";
      header.appendChild(labelEl);
      header.appendChild(scoreEl);
      block.appendChild(header);

      const body = document.createElement("div");
      body.className = "result-body";

      if (!list.length) {
        body.innerHTML = "<p>No very long or heavily comma-spliced sentences were detected based on the simple thresholds.</p>";
      } else {
        let html = "<p>These sentences might feel clunky or overloaded. Try splitting or simplifying them:</p>";
        html += "<ul>";
        list.slice(0, 5).forEach(s => {
          html += `<li><strong>Sentence ${s.index}</strong> — ${s.wc} words, ${s.commaCount} commas<br>${s.text}</li>`;
        });
        if (list.length > 5) {
          html += `<li>…and ${list.length - 5} more.</li>`;
        }
        html += "</ul>";
        body.innerHTML = html;
      }

      block.appendChild(body);
      results.appendChild(block);
    })();

    resultsList.appendChild(results);
  });
})();
