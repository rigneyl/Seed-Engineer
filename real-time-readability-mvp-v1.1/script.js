(function () {
  const editor = document.getElementById("editor");
  const charCountEl = document.getElementById("charCount");
  const wordCountEl = document.getElementById("wordCount");
  const sentenceStream = document.getElementById("sentenceStream");
  const suggestionsList = document.getElementById("suggestionsList");

  const fkScoreEl = document.getElementById("fkScore");
  const fkBandEl = document.getElementById("fkBand");
  const fogScoreEl = document.getElementById("fogScore");
  const fogBandEl = document.getElementById("fogBand");
  const sentenceCountEl = document.getElementById("sentenceCount");
  const avgWordsPerSentenceEl = document.getElementById("avgWordsPerSentence");

  const sampleBtn = document.getElementById("sampleBtn");
  const clearBtn = document.getElementById("clearBtn");

  function debounce(fn, delay) {
    let timer = null;
    return function () {
      const args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(null, args);
      }, delay);
    };
  }

  function tokenizeWords(text) {
    if (!text) return [];
    const tokens = text
      .toLowerCase()
      .replace(/[^a-z0-9'\-\s]/gi, " ")
      .split(/\s+/)
      .filter(Boolean);
    return tokens;
  }

  function countSyllables(word) {
    if (!word) return 0;
    word = word.toLowerCase();
    word = word.replace(/[^a-z]/g, "");
    if (!word) return 0;

    const specials = {
      "the": 1,
      "are": 1,
      "were": 1,
      "you": 1,
      "your": 1,
      "their": 1,
      "they": 1,
      "some": 1,
      "one": 1,
      "done": 1,
      "people": 2,
      "because": 2,
      "business": 2,
      "science": 2
    };
    if (specials[word] != null) {
      return specials[word];
    }

    word = word.replace(/e$/i, "");

    const matches = word.match(/[aeiouy]+/g);
    if (!matches) return 1;

    let syllables = matches.length;
    if (syllables === 0) syllables = 1;
    return syllables;
  }

  function isComplexWord(word) {
    const syllables = countSyllables(word);
    if (syllables >= 3) {
      return true;
    }
    return false;
  }

  function splitSentences(text) {
    if (!text) return [];
    const parts = text
      .replace(/([.!?])+/g, "$1|")
      .split("|")
      .map(function (s) { return s.trim(); })
      .filter(function (s) { return s.length > 0; });
    return parts;
  }

  function computeMetrics(text) {
    const sentences = splitSentences(text);
    const words = tokenizeWords(text);

    const sentenceCount = sentences.length || 1;
    const wordCount = words.length;
    let syllableCount = 0;
    let complexWordCount = 0;

    words.forEach(function (w) {
      const syl = countSyllables(w);
      syllableCount += syl;
      if (isComplexWord(w)) {
        complexWordCount += 1;
      }
    });

    const avgWordsPerSentence = wordCount && sentenceCount ? wordCount / sentenceCount : 0;
    const avgSyllablesPerWord = wordCount ? syllableCount / wordCount : 0;

    let fkGrade = null;
    let fogIndex = null;

    if (wordCount > 0 && sentenceCount > 0) {
      fkGrade = 0.39 * avgWordsPerSentence + 11.8 * avgSyllablesPerWord - 15.59;
      fogIndex = 0.4 * (avgWordsPerSentence + 100 * (complexWordCount / wordCount));
    }

    return {
      sentences: sentences,
      sentenceCount: sentences.length,
      wordCount: wordCount,
      syllableCount: syllableCount,
      complexWordCount: complexWordCount,
      avgWordsPerSentence: avgWordsPerSentence,
      avgSyllablesPerWord: avgSyllablesPerWord,
      fkGrade: fkGrade,
      fogIndex: fogIndex
    };
  }

  function bandForGrade(grade) {
    if (grade == null || isNaN(grade)) return { band: "none", label: "Waiting for text…" };
    if (grade <= 6) return { band: "good", label: "Very accessible (Year 6 and below)" };
    if (grade <= 10) return { band: "good", label: "Accessible (Year 7–10)" };
    if (grade <= 14) return { band: "warn", label: "Academic / technical (Year 11–14)" };
    return { band: "bad", label: "Highly technical (postgraduate level)" };
  }

  function bandForFog(fog) {
    if (fog == null || isNaN(fog)) return { band: "none", label: "Waiting for text…" };
    if (fog < 10) return { band: "good", label: "Easy to read" };
    if (fog < 14) return { band: "good", label: "Fairly clear" };
    if (fog < 18) return { band: "warn", label: "Academic / somewhat complex" };
    return { band: "bad", label: "Very complex" };
  }

  const PHRASE_SUGGESTIONS = [
    { pattern: /in order to/gi, replace: "to", label: "Wordy phrase" },
    { pattern: /due to the fact that/gi, replace: "because", label: "Wordy phrase" },
    { pattern: /utilize/gi, replace: "use", label: "Simpler verb" },
    { pattern: /leverage/gi, replace: "use", label: "Simpler verb" },
    { pattern: /with respect to/gi, replace: "about", label: "Simpler phrase" },
    { pattern: /at this point in time/gi, replace: "now", label: "Wordy phrase" },
    { pattern: /a number of/gi, replace: "many", label: "Simpler phrase" },
    { pattern: /for the purpose of/gi, replace: "to", label: "Wordy phrase" },
    { pattern: /in order that/gi, replace: "so that", label: "Wordy phrase" }
  ];

  function findSuggestions(sentences) {
    const suggestions = [];
    sentences.forEach(function (sentence, index) {
      const wordCount = tokenizeWords(sentence).length;

      if (wordCount >= 30) {
        suggestions.push({
          type: "length",
          sentenceIndex: index,
          text: "Long sentence (" + wordCount + " words). Consider splitting into two or more sentences."
        });
      }

      PHRASE_SUGGESTIONS.forEach(function (rule) {
        const match = sentence.match(rule.pattern);
        if (match) {
          suggestions.push({
            type: "phrase",
            sentenceIndex: index,
            text: "Instead of \"" + match[0] + "\", try \"" + rule.replace + "\"."
          });
        }
      });
    });

    return suggestions;
  }

  function updateUI() {
    const text = editor.value || "";
    const stats = computeMetrics(text);

    charCountEl.textContent = text.length + " characters";
    wordCountEl.textContent = stats.wordCount + " words";

    sentenceCountEl.textContent = stats.sentenceCount || 0;
    const avgWords = stats.avgWordsPerSentence || 0;
    avgWordsPerSentenceEl.textContent = avgWords ? avgWords.toFixed(1) : "0";

    const fkGrade = stats.fkGrade;
    const fogIndex = stats.fogIndex;

    if (fkGrade != null && !isNaN(fkGrade)) {
      fkScoreEl.textContent = fkGrade.toFixed(1);
    } else {
      fkScoreEl.textContent = "–";
    }
    if (fogIndex != null && !isNaN(fogIndex)) {
      fogScoreEl.textContent = fogIndex.toFixed(1);
    } else {
      fogScoreEl.textContent = "–";
    }

    const fkBand = bandForGrade(fkGrade);
    const fogBand = bandForFog(fogIndex);

    fkBandEl.textContent = fkBand.label;
    fogBandEl.textContent = fogBand.label;

    ["good", "warn", "bad"].forEach(function (cls) {
      fkScoreEl.parentElement.classList.remove(cls);
      fogScoreEl.parentElement.classList.remove(cls);
    });
    if (fkBand.band !== "none") {
      fkScoreEl.parentElement.classList.add(fkBand.band);
    }
    if (fogBand.band !== "none") {
      fogScoreEl.parentElement.classList.add(fogBand.band);
    }

    renderSentences(stats.sentences);
    renderSuggestions(stats.sentences);
  }

  const updateUIDebounced = debounce(updateUI, 80);

  function renderSentences(sentences) {
    sentenceStream.innerHTML = "";
    if (!sentences.length) {
      const placeholder = document.createElement("div");
      placeholder.textContent = "Sentences will appear here with complexity highlights.";
      placeholder.style.color = "#6b7280";
      placeholder.style.fontSize = "0.78rem";
      sentenceStream.appendChild(placeholder);
      return;
    }

    sentences.forEach(function (sentence) {
      const sentenceStats = computeMetrics(sentence);
      const w = sentenceStats.wordCount;
      const grade = sentenceStats.fkGrade || 0;

      let band = "ok";
      if (w > 35 || grade > 16) {
        band = "bad";
      } else if (w > 22 || grade > 12) {
        band = "warn";
      }

      const chip = document.createElement("span");
      chip.className = "sentence-chip " + band;
      chip.title = "Approx. grade " + (grade ? grade.toFixed(1) : "–") + ", " + w + " words";

      const textSpan = document.createElement("span");
      textSpan.textContent = sentence + " ";
      chip.appendChild(textSpan);

      const meta = document.createElement("span");
      meta.className = "sentence-chip-meta";
      const badges = [];
      badges.push(w + "w");
      if (grade) {
        badges.push("G" + grade.toFixed(1));
      }
      meta.innerHTML = "<span>" + badges.join(" · ") + "</span>";
      chip.appendChild(meta);

      sentenceStream.appendChild(chip);
    });
  }

  function renderSuggestions(sentences) {
    suggestionsList.innerHTML = "";

    if (!sentences.length) {
      const li = document.createElement("li");
      li.textContent = "Keep typing — suggestions will appear here.";
      suggestionsList.appendChild(li);
      return;
    }

    const suggestions = findSuggestions(sentences);

    if (!suggestions.length) {
      const li = document.createElement("li");
      li.textContent = "Nice work — no obvious wordiness or long sentences detected.";
      suggestionsList.appendChild(li);
      return;
    }

    suggestions.forEach(function (suggestion) {
      const li = document.createElement("li");
      const tag = document.createElement("span");
      tag.className = "tag";
      tag.textContent = suggestion.type === "length" ? "LENGTH" : "PHRASE";
      li.appendChild(tag);

      const textNode = document.createTextNode("Sentence " + (suggestion.sentenceIndex + 1) + ": " + suggestion.text);
      li.appendChild(textNode);
      suggestionsList.appendChild(li);
    });
  }

  function loadSample() {
    const sample = "In recent years, the rapid expansion of digital platforms has significantly transformed the way academic knowledge is produced, shared, and evaluated. " +
      "However, despite the apparent accessibility of these tools, many writers continue to rely on overly complex sentence structures that obscure their core arguments rather than clarifying them for the reader. " +
      "This brief example demonstrates how shorter, more direct sentences can often communicate the same idea with greater clarity and impact.";

    editor.value = sample;
    updateUI();
    editor.focus();
    editor.setSelectionRange(editor.value.length, editor.value.length);
  }

  function clearAll() {
    editor.value = "";
    updateUI();
    editor.focus();
  }

  editor.addEventListener("input", updateUIDebounced);
  sampleBtn.addEventListener("click", loadSample);
  clearBtn.addEventListener("click", clearAll);

  updateUI();
})();
