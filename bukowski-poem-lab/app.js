
// Bukowski Poem Lab — standalone JS
// Rough heuristic analysis of how Bukowski-ish a poem feels.
// Focus: line length, profanity + booze, first person, "fancy" words, abstract drift.

(function() {
  const input = document.getElementById("poem-input");
  const btnRun = document.getElementById("btn-run");
  const btnClear = document.getElementById("btn-clear");
  const btnSample = document.getElementById("btn-sample");

  const tagRow = document.getElementById("tag-row");
  const statsGrid = document.getElementById("stats-grid");
  const resultsHeading = document.getElementById("results-heading");
  const resultsList = document.getElementById("results-list");
  const biasRange = document.getElementById("bias-range");
  const biasLabel = document.getElementById("bias-label");
  const lexSwears = document.getElementById("lex-swears");
  const lexBooze = document.getElementById("lex-booze");
  const lexGrind = document.getElementById("lex-grind");
  const lexAbstract = document.getElementById("lex-abstract");
  const lexApply = document.getElementById("lex-apply");
  const lexReset = document.getElementById("lex-reset");

  let swearWords = [
    "fuck","fucks","fucking","fucked","fuckers","motherfucker","motherfuckers",
    "shit","shits","shitty","bullshit","goddamn","damn","damned",
    "ass","asses","asshole","assholes","bitch","bitches","bastard","bastards",
    "cunt","cunts","dick","dicks","prick","pricks","piss","pissed","crap","hell"
  ];

  let boozeWords = [
    "beer","beers","lager","ale","wine","wines",
    "whiskey","whisky","bourbon","vodka","gin","rum","brandy",
    "bar","bars","tavern","taverns","dive","dives","saloon","saloones",
    "bottle","bottles","bottleful","booze","boozed","boozing",
    "drunk","drunks","drunkard","drunkards","hungover","hangover","hangovers"
  ];

  let grindWords = [
    "factory","factories","plant","plants","warehouse","warehouses",
    "office","offices","desk","desks","job","jobs","shift","shifts",
    "boss","bosses","supervisor","supervisors","manager","managers",
    "rent","bills","bill","wages","paycheck","cheque","overtime",
    "line","linework","machine","machines","typing","clerks","clerk",
    "post office","post-office"
  ];

  let abstractWords = [
    "truth","beauty","purpose","meaning","society","humanity","mankind",
    "morality","justice","destiny","fate",
    "soul","souls","heaven","redemption","virtue","values","ethics",
    "progress","hope","future","ideal","ideals","freedom","peace",
    "infinity","eternity","eternal","spirit","spiritual","sublime"
  ];

  const fancySuffixes = ["tion","sion","ment","ence","ance","ology","ism","ity","tude","ance","ence"];

  const firstPerson = ["i","me","my","mine","myself"];

  // Bias slider: 0 = light, 1 = medium, 2 = heavy
  function getBiasFactor() {
    if (!biasRange) return 1;
    const val = parseInt(biasRange.value, 10) || 1;
    if (val === 0) return 0.6;
    if (val === 2) return 1.4;
    return 1.0;
  }

  function updateBiasLabel() {
    if (!biasLabel || !biasRange) return;
    const val = parseInt(biasRange.value, 10) || 1;
    biasLabel.textContent = val === 0 ? "Light" : (val === 2 ? "Heavy" : "Medium");
  }

  function listToTextarea(list) {
    return list.join(", ");
  }

  function textareaToList(text) {
    return text
      .split(",")
      .map(x => x.trim().toLowerCase())
      .filter(Boolean);
  }

  function initLexiconEditor() {
    if (!lexSwears) return;
    lexSwears.value = listToTextarea(swearWords);
    lexBooze.value = listToTextarea(boozeWords);
    lexGrind.value = listToTextarea(grindWords);
    lexAbstract.value = listToTextarea(abstractWords);
  }

  function applyLexiconChanges() {
    if (!lexSwears) return;
    swearWords = textareaToList(lexSwears.value);
    boozeWords = textareaToList(lexBooze.value);
    grindWords = textareaToList(lexGrind.value);
    abstractWords = textareaToList(lexAbstract.value);
  }

  function resetLexiconsToDefaults() {
    // Reload page is simplest to restore from source, but we'll keep it inline-friendly:
    window.location.reload();
  }


  function tokenizeWords(text) {
    const m = text.toLowerCase().match(/[a-zA-Z']+/g);
    return m ? m : [];
  }

  function splitSentences(text) {
    // Very rough but fine for stats
    const raw = text
      .replace(/\n+/g, " ")
      .split(/(?<=[.!?])\s+/);
    return raw.filter(s => s.trim().length > 0);
  }

  function statCard(label, value, note) {
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
    badge.className = "badge-style" + (muted ? " badge-style-muted" : "");
    const dot = document.createElement("span");
    dot.className = "badge-style-dot";
    const label = document.createElement("span");
    label.textContent = text;
    badge.appendChild(dot);
    badge.appendChild(label);
    tagRow.appendChild(badge);
  }

  function computeFeatures(text) {
    const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
    const words = tokenizeWords(text);
    const sentences = splitSentences(text);

    const wordCount = words.length;
    const lineCount = lines.length || 1;
    const avgLineLen = wordCount / lineCount;

    let lowercaseStarts = 0;
    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) return;
      const firstChar = trimmed[0];
      if (firstChar === firstChar.toLowerCase() && firstChar.toLowerCase() !== firstChar.toUpperCase()) {
        lowercaseStarts++;
      }
    });

    let swearCount = 0;
    let boozeCount = 0;
    let grindCount = 0;
    let abstractCount = 0;
    let fancyCount = 0;
    let firstCount = 0;

    const fancyWordsList = [];
    const abstractWordsList = [];
    const grindWordsList = [];
    const boozeWordsList = [];
    const swearWordsList = [];

    words.forEach(w => {
      if (swearWords.includes(w)) {
        swearCount++;
        if (!swearWordsList.includes(w)) swearWordsList.push(w);
      }
      if (boozeWords.includes(w)) {
        boozeCount++;
        if (!boozeWordsList.includes(w)) boozeWordsList.push(w);
      }
      if (grindWords.includes(w)) {
        grindCount++;
        if (!grindWordsList.includes(w)) grindWordsList.push(w);
      }
      if (abstractWords.includes(w)) {
        abstractCount++;
        if (!abstractWordsList.includes(w)) abstractWordsList.push(w);
      }
      if (firstPerson.includes(w)) {
        firstCount++;
      }
      if (w.length >= 6) {
        const suf = fancySuffixes.some(s => w.endsWith(s));
        if (suf && !fancyWordsList.includes(w)) {
          fancyCount++;
          fancyWordsList.push(w);
        }
      }
    });

    const wordsPerLine = avgLineLen;
    const swearRate = wordCount ? (swearCount / wordCount) * 100 : 0;
    const boozeRate = wordCount ? (boozeCount / wordCount) * 100 : 0;
    const grindRate = wordCount ? (grindCount / wordCount) * 100 : 0;
    const abstractRate = wordCount ? (abstractCount / wordCount) * 100 : 0;
    const fancyRate = wordCount ? (fancyCount / wordCount) * 100 : 0;
    const firstRate = wordCount ? (firstCount / wordCount) * 100 : 0;
    const lowerStartRate = lineCount ? (lowercaseStarts / lineCount) * 100 : 0;

    // Scores: all are 0–100
    const gritScore = Math.min(100, (swearRate * 8) + (boozeRate * 5) + (grindRate * 4));
    const simplicityScore = Math.max(0, 100 - (fancyRate * 20) - (abstractRate * 15));
    const confessionScore = Math.min(100, (firstRate * 12) + (swearRate * 4));
    const linePunchScore = Math.max(0, 100 - Math.abs(wordsPerLine - 7) * 8); // sweet spot around 5–9 words
    const antiPretensionScore = Math.max(0, 100 - (abstractRate * 25) - (fancyRate * 25));

    // Overall Bukowski index: weighted blend, scaled by bias slider for corpus-heavy weighting
    const bias = getBiasFactor();
    const bukowskiIndex = Math.max(0, Math.min(100,
      gritScore * (0.25 * bias) +
      simplicityScore * (0.25 * bias) +
      confessionScore * 0.2 +
      linePunchScore * 0.2 +
      antiPretensionScore * (0.1 * bias)
    ));

    return {
      lines,
      words,
      wordCount,
      lineCount,
      wordsPerLine,
      lowercaseStarts,
      lowerStartRate,
      swearCount,
      boozeCount,
      grindCount,
      abstractCount,
      fancyCount,
      firstCount,
      swearRate,
      boozeRate,
      grindRate,
      abstractRate,
      fancyRate,
      firstRate,
      gritScore,
      simplicityScore,
      confessionScore,
      linePunchScore,
      antiPretensionScore,
      bukowskiIndex,
      lists: {
        fancyWordsList,
        abstractWordsList,
        grindWordsList,
        boozeWordsList,
        swearWordsList,
      }
    };
  }

  function buildScoreBlock(f) {
    const block = document.createElement("div");
    block.className = "result-item";

    const header = document.createElement("div");
    header.className = "result-item-header";

    const label = document.createElement("div");
    label.className = "result-label";
    label.textContent = "Bukowski index";

    const score = document.createElement("div");
    score.className = "result-score";
    score.textContent = f.bukowskiIndex.toFixed(0) + "/100";

    header.appendChild(label);
    header.appendChild(score);
    block.appendChild(header);

    const body = document.createElement("div");
    body.className = "result-body";

    const grid = document.createElement("div");
    grid.className = "metric-grid";

    function addMetric(name, value, note) {
      const row = document.createElement("div");
      row.className = "metric-row";
      const l = document.createElement("div");
      l.className = "metric-label";
      l.textContent = name;
      const vwrap = document.createElement("div");
      vwrap.style.textAlign = "right";
      const v = document.createElement("div");
      v.className = "metric-val";
      v.textContent = value;
      const n = document.createElement("div");
      n.className = "metric-note";
      n.textContent = note;
      vwrap.appendChild(v);
      vwrap.appendChild(n);
      row.appendChild(l);
      row.appendChild(vwrap);
      grid.appendChild(row);
    }

    addMetric("Grit", f.gritScore.toFixed(0) + "/100", "swears · booze · grind");
    addMetric("Simplicity", f.simplicityScore.toFixed(0) + "/100", "low -ology / -ism");
    addMetric("Confession", f.confessionScore.toFixed(0) + "/100", "first person + heat");
    addMetric("Line punch", f.linePunchScore.toFixed(0) + "/100", "short, punchy lines");
    addMetric("Anti-pretension", f.antiPretensionScore.toFixed(0) + "/100", "few abstract nouns");

    body.appendChild(grid);
    block.appendChild(body);

    return block;
  }

  function buildStatsBlock(f) {
    const block = document.createElement("div");
    block.className = "result-item";

    const header = document.createElement("div");
    header.className = "result-item-header";
    const label = document.createElement("div");
    label.className = "result-label";
    label.textContent = "Basic stats";
    const score = document.createElement("div");
    score.className = "result-score";
    score.textContent = f.wordCount + " words";
    header.appendChild(label);
    header.appendChild(score);
    block.appendChild(header);

    const body = document.createElement("div");
    body.className = "result-body";

    const p = document.createElement("p");
    p.innerHTML = [
      "<strong>Lines:</strong> " + f.lineCount,
      "<strong>Avg words / line:</strong> " + f.wordsPerLine.toFixed(1),
      "<strong>Lines starting lowercase:</strong> " + f.lowerStartRate.toFixed(0) + "%"
    ].join(" · ");
    body.appendChild(p);

    const extra = document.createElement("p");
    extra.className = "hint-text";
    extra.textContent = "Bukowski often runs short, blunt lines, often starting lowercase and ending without ornate punctuation.";
    body.appendChild(extra);

    block.appendChild(body);
    return block;
  }

  function buildFlagBlock(f) {
    const block = document.createElement("div");
    block.className = "result-item";

    const header = document.createElement("div");
    header.className = "result-item-header";
    const label = document.createElement("div");
    label.className = "result-label";
    label.textContent = "Flagged language";
    const score = document.createElement("div");
    score.className = "result-score";
    score.textContent = "words / phrases";
    header.appendChild(label);
    header.appendChild(score);
    block.appendChild(header);

    const body = document.createElement("div");
    body.className = "result-body";

    function section(title, arr, hint) {
      const wrap = document.createElement("div");
      wrap.className = "flagged-list";
      const strong = document.createElement("strong");
      strong.textContent = title + ": ";
      wrap.appendChild(strong);
      if (!arr.length) {
        wrap.appendChild(document.createTextNode("none spotted."));
      } else {
        wrap.appendChild(document.createTextNode(arr.join(", ")));
      }
      if (hint) {
        const h = document.createElement("div");
        h.className = "hint-text";
        h.textContent = hint;
        wrap.appendChild(h);
      }
      body.appendChild(wrap);
    }

    section("Swears", f.lists.swearWordsList,
      "High grit; if everything is gentle, you may be off Bukowski's register.");
    section("Booze / bar", f.lists.boozeWordsList,
      "Bars, bottles, hangovers — the usual ecosystem.");
    section("Grind / work", f.lists.grindWordsList,
      "Factories, jobs, bosses, rent — the losing end of capitalism.");
    section("Abstract / lofty", f.lists.abstractWordsList,
      "These can push you away from Bukowski's gutter toward essayistic tone.");
    section("Fancy suffixes", f.lists.fancyWordsList,
      "You can keep some. But a wall of -tion / -ology words breaks the plain-spoken spell.");

    block.appendChild(body);
    return block;
  }

  function clearAll() {
    input.value = "";
    tagRow.innerHTML = "";
    statsGrid.innerHTML = "";
    resultsList.innerHTML = "";
    resultsHeading.textContent = "Waiting for a poem…";
  }

  function run() {
    const text = input.value.trim();
    if (!text) {
      clearAll();
      return;
    }

    tagRow.innerHTML = "";
    statsGrid.innerHTML = "";
    resultsList.innerHTML = "";
    resultsHeading.textContent = "Bukowski-style analysis";

    const f = computeFeatures(text);

    // Top-level stat cards
    statCard("Lines", f.lineCount, "non-empty");
    statCard("Words", f.wordCount, "total tokens");
    statCard("Swears / 100", f.swearRate.toFixed(1), "rough heat");
    statCard("First-person %", f.firstRate.toFixed(1) + "%", "I / me / my");

    // Badges summarising
    if (f.bukowskiIndex >= 75) {
      addBadge("Strong Bukowski vibe", false);
    } else if (f.bukowskiIndex >= 45) {
      addBadge("Some Bukowski traits", false);
    } else {
      addBadge("Far from Bukowski on these metrics", true);
    }

    if (f.simplicityScore < 50) {
      addBadge("High abstraction / theory", true);
    }
    if (f.gritScore > 60) {
      addBadge("High grit", false);
    }
    if (f.confessionScore > 60) {
      addBadge("Confessional", false);
    }

    const list = document.createElement("div");
    list.className = "results-list-inner";

    list.appendChild(buildScoreBlock(f));
    list.appendChild(buildStatsBlock(f));
    list.appendChild(buildFlagBlock(f));

    resultsList.appendChild(list);
  }

  function loadSample() {
    const sample = [
      "the rent notice is on the table",
      "next to an empty bottle",
      "and an ashtray full of things",
      "i said i wouldn't do again.",
      "",
      "the neighbor's radio bleeds through the wall",
      "some cheerful song about forever",
      "while the toilet runs like a bad joke",
      "and the ceiling stain grows another continent.",
      "",
      "i light the last cigarette",
      "with the last match",
      "and watch the smoke try harder",
      "than i do."
    ].join("\n");
    input.value = sample;
  }

  btnRun.addEventListener("click", run);
  btnClear.addEventListener("click", clearAll);
  btnSample.addEventListener("click", loadSample);

  if (biasRange) {
    biasRange.addEventListener("input", updateBiasLabel);
    updateBiasLabel();
  }
  initLexiconEditor();
  if (lexApply) {
    lexApply.addEventListener("click", function() {
      applyLexiconChanges();
      run();
    });
  }
  if (lexReset) {
    lexReset.addEventListener("click", function() {
      resetLexiconsToDefaults();
    });
  }
})();