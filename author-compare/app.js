
// author-compare/app.js
// Author Comparison Lab: compares simple style fingerprint against a set of author profiles.
// Not AI; just rule-based feature extraction + distance scoring.

(function() {
  const input = document.getElementById("input-text");
  const btnClear = document.getElementById("btn-clear");
  const btnRun = document.getElementById("btn-run");
  const tagRow = document.getElementById("tag-row");
  const statsGrid = document.getElementById("stats-grid");
  const resultsHeading = document.getElementById("results-heading");
  const resultsList = document.getElementById("results-list");

  function clearAll() {
    input.value = "";
    tagRow.innerHTML = "";
    statsGrid.innerHTML = "";
    resultsList.innerHTML = "";
    resultsHeading.textContent = "Waiting for input…";
  }

  btnClear.addEventListener("click", clearAll);

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

  function addBadge(text) {
    const badge = document.createElement("div");
    badge.className = "badge-author";
    const dot = document.createElement("span");
    dot.className = "badge-author-dot";
    const label = document.createElement("span");
    label.textContent = text;
    badge.appendChild(dot);
    badge.appendChild(label);
    tagRow.appendChild(badge);
  }

  // Approximate author profiles: values are "typical" centres +/- tolerance.
  // Metrics:
  //  avgSentence   -> average sentence length in words
  //  lexical       -> lexical density (0-1)
  //  adverbRate    -> % words ending in -ly
  //  commaRate     -> commas per 100 words
  //  dialogueShare -> % of sentences containing quotes
  //  pronoun1p     -> % of tokens that are I/me/my etc.
  //  darkness      -> score based on "dark" vs "warm" lexicons (0-1)
  const profiles = [
    {
      id: "king",
      name: "Stephen King",
      tag: "commercial horror",
      avgSentence: 18,
      lexical: 0.52,
      adverbRate: 4,
      commaRate: 5,
      dialogueShare: 35,
      pronoun1p: 6,
      darkness: 0.7
    },
    {
      id: "howey",
      name: "Hugh Howey",
      tag: "SF / indie",
      avgSentence: 17,
      lexical: 0.54,
      adverbRate: 3,
      commaRate: 4,
      dialogueShare: 30,
      pronoun1p: 5,
      darkness: 0.6
    },
    {
      id: "hoover",
      name: "Colleen Hoover",
      tag: "romance / contemporary",
      avgSentence: 14,
      lexical: 0.5,
      adverbRate: 4,
      commaRate: 4,
      dialogueShare: 45,
      pronoun1p: 9,
      darkness: 0.4
    },
    {
      id: "gaiman",
      name: "Neil Gaiman",
      tag: "fantasy / mythic",
      avgSentence: 19,
      lexical: 0.55,
      adverbRate: 3,
      commaRate: 5,
      dialogueShare: 30,
      pronoun1p: 6,
      darkness: 0.6
    },
    {
      id: "bukowski",
      name: "Charles Bukowski",
      tag: "raw realism",
      avgSentence: 12,
      lexical: 0.48,
      adverbRate: 2,
      commaRate: 3,
      dialogueShare: 40,
      pronoun1p: 10,
      darkness: 0.75
    },
    {
      id: "mccarthy",
      name: "Cormac McCarthy",
      tag: "minimalist / biblical",
      avgSentence: 24,
      lexical: 0.6,
      adverbRate: 1,
      commaRate: 2,
      dialogueShare: 15,
      pronoun1p: 4,
      darkness: 0.85
    },
    {
      id: "ligotti",
      name: "Thomas Ligotti",
      tag: "cosmic horror",
      avgSentence: 26,
      lexical: 0.62,
      adverbRate: 3,
      commaRate: 6,
      dialogueShare: 10,
      pronoun1p: 3,
      darkness: 0.9
    },
    {
      id: "cioran",
      name: "Emil Cioran",
      tag: "aphoristic misanthropy",
      avgSentence: 19,
      lexical: 0.64,
      adverbRate: 2,
      commaRate: 4,
      dialogueShare: 0,
      pronoun1p: 5,
      darkness: 0.95
    },
    {
      id: "generic",
      name: "General commercial",
      tag: "median baseline",
      avgSentence: 17,
      lexical: 0.5,
      adverbRate: 4,
      commaRate: 4,
      dialogueShare: 30,
      pronoun1p: 6,
      darkness: 0.5
    }
  ];

  const weights = {
    avgSentence: 1.0,
    lexical: 1.0,
    adverbRate: 0.7,
    commaRate: 0.6,
    dialogueShare: 0.8,
    pronoun1p: 0.7,
    darkness: 1.0
  };

  function computeFeatures(text) {
    const stats = TextUtils.getTextStats(text);
    const read = TextUtils.computeReadability(text);
    const wordCount = read.wordCount || 0;
    const sentenceCount = read.sentenceCount || 0;
    const avgSentence = sentenceCount ? read.avgSentenceLength : 0;
    const lexical = read.lexicalDensity || 0;

    const words = stats.words.map(w => w.toLowerCase());
    const sentences = stats.sentences;

    let adverbTokens = 0;
    words.forEach(w => {
      if (w.length > 4 && w.endsWith("ly")) adverbTokens++;
    });
    const adverbRate = wordCount ? (adverbTokens / wordCount) * 100 : 0;

    const commaCount = (text.match(/,/g) || []).length;
    const commaRate = wordCount ? (commaCount / wordCount) * 100 : 0;

    let dialogueSentences = 0;
    sentences.forEach(s => {
      if (s.indexOf('"') !== -1 || s.indexOf("'") !== -1) {
        dialogueSentences++;
      }
    });
    const dialogueShare = sentenceCount ? (dialogueSentences / sentenceCount) * 100 : 0;

    const firstPronouns = ["i","me","my","mine","we","us","our","ours"];
    let firstCount = 0;
    words.forEach(w => {
      if (firstPronouns.includes(w)) firstCount++;
    });
    const pronoun1p = wordCount ? (firstCount / wordCount) * 100 : 0;

    const darkLex = [
      "void","nothing","nothingness","ruin","ash","ashes","decay","rot","rotting","blood",
      "corpse","corpses","empty","emptiness","alone","lonely","despair","futile","futility",
      "worthless","hopeless","nihil","hate","hated","hating","ruined","broken","cold","bleak"
    ];
    const warmLex = [
      "hope","hopes","hopeful","light","warmth","love","loved","loving","tender","gentle",
      "kind","kindness","bright","joy","joyful","comfort","safe","saving","mercy","grace"
    ];
    let darkHits = 0, warmHits = 0;
    words.forEach(w => {
      if (darkLex.includes(w)) darkHits++;
      if (warmLex.includes(w)) warmHits++;
    });
    const totalToneHits = darkHits + warmHits;
    let darkness = 0.5;
    if (totalToneHits > 0) {
      darkness = darkHits / totalToneHits;
    }

    return {
      wordCount,
      sentenceCount,
      avgSentence,
      lexical,
      adverbRate,
      commaRate,
      dialogueShare,
      pronoun1p,
      darkness
    };
  }

  function scoreProfile(features, profile) {
    function norm(val, centre, scale) {
      if (scale === 0) return 0;
      return Math.abs(val - centre) / scale;
    }

    // Reasonable scales (rough ranges)
    const dAvg = norm(features.avgSentence, profile.avgSentence, 10);
    const dLex = norm(features.lexical, profile.lexical, 0.15);
    const dAdv = norm(features.adverbRate, profile.adverbRate, 5);
    const dComma = norm(features.commaRate, profile.commaRate, 4);
    const dDial = norm(features.dialogueShare, profile.dialogueShare, 25);
    const dPron = norm(features.pronoun1p, profile.pronoun1p, 6);
    const dDark = norm(features.darkness, profile.darkness, 0.5);

    const dist =
      dAvg * weights.avgSentence +
      dLex * weights.lexical +
      dAdv * weights.adverbRate +
      dComma * weights.commaRate +
      dDial * weights.dialogueShare +
      dPron * weights.pronoun1p +
      dDark * weights.darkness;

    // Convert distance into similarity (0–100)
    const sim = Math.max(0, 100 - dist * 25);
    return sim;
  }

  function buildMetricBlock(features) {
    const block = document.createElement("div");
    block.className = "result-item";
    const header = document.createElement("div");
    header.className = "result-item-header";
    const label = document.createElement("div");
    label.className = "result-label";
    label.textContent = "Your fingerprint";
    const score = document.createElement("div");
    score.className = "result-score";
    score.textContent = features.wordCount + " words";
    header.appendChild(label);
    header.appendChild(score);
    block.appendChild(header);

    const body = document.createElement("div");
    body.className = "result-body";

    const rows = document.createElement("div");
    rows.style.display = "grid";
    rows.style.gap = "4px";

    function addRow(name, value, note) {
      const row = document.createElement("div");
      row.className = "metric-row";
      const left = document.createElement("div");
      left.className = "metric-name";
      left.textContent = name;
      const right = document.createElement("div");
      right.style.textAlign = "right";
      const val = document.createElement("div");
      val.className = "metric-val";
      val.textContent = value;
      const n = document.createElement("div");
      n.className = "metric-note";
      n.textContent = note;
      right.appendChild(val);
      right.appendChild(n);
      row.appendChild(left);
      row.appendChild(right);
      rows.appendChild(row);
    }

    addRow("Avg sentence", features.avgSentence.toFixed(1), "words per sentence");
    addRow("Lexical density", (features.lexical * 100).toFixed(0) + "%", "non-stopwords");
    addRow("Adverb load", features.adverbRate.toFixed(1) + "/100", "words ending in “-ly”");
    addRow("Comma density", features.commaRate.toFixed(1) + "/100", "commas per 100 words");
    addRow("Dialogue share", features.dialogueShare.toFixed(0) + "%", "sentences with quotes");
    addRow("1st-person", features.pronoun1p.toFixed(1) + "%", "I / me / my / we / our");
    addRow("Darkness", (features.darkness * 100).toFixed(0) + "%", "dark vs warm lexicon hits");

    body.appendChild(rows);
    block.appendChild(body);
    return block;
  }

  function buildAuthorTable(scored) {
    const block = document.createElement("div");
    block.className = "result-item";

    const header = document.createElement("div");
    header.className = "result-item-header";
    const label = document.createElement("div");
    label.className = "result-label";
    label.textContent = "Closest author profiles";
    const score = document.createElement("div");
    score.className = "result-score";
    score.textContent = "Top 5";
    header.appendChild(label);
    header.appendChild(score);
    block.appendChild(header);

    const body = document.createElement("div");
    body.className = "result-body";

    const table = document.createElement("table");
    table.className = "author-table";
    const thead = document.createElement("thead");
    const trh = document.createElement("tr");
    ["Author", "Match", "Tag"].forEach(h => {
      const th = document.createElement("th");
      th.textContent = h;
      trh.appendChild(th);
    });
    thead.appendChild(trh);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    scored.slice(0, 5).forEach(item => {
      const tr = document.createElement("tr");
      const tdName = document.createElement("td");
      tdName.className = "author-name";
      tdName.textContent = item.profile.name;
      const tdScore = document.createElement("td");
      const pill = document.createElement("span");
      pill.className = "score-pill";
      const icon = document.createElement("span");
      icon.textContent = "◎";
      const val = document.createElement("span");
      val.textContent = item.score.toFixed(0) + "%";
      pill.appendChild(icon);
      pill.appendChild(val);
      tdScore.appendChild(pill);
      const tdTag = document.createElement("td");
      tdTag.textContent = item.profile.tag;
      tr.appendChild(tdName);
      tr.appendChild(tdScore);
      tr.appendChild(tdTag);
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    body.appendChild(table);

    block.appendChild(body);
    return block;
  }

  function buildClusterBlock(scored) {
    const block = document.createElement("div");
    block.className = "result-item";

    const header = document.createElement("div");
    header.className = "result-item-header";
    const label = document.createElement("div");
    label.className = "result-label";
    label.textContent = "Cluster hints";
    const score = document.createElement("div");
    score.className = "result-score";
    score.textContent = "Directional only";
    header.appendChild(label);
    header.appendChild(score);
    block.appendChild(header);

    const body = document.createElement("div");
    body.className = "result-body";

    const top = scored[0];
    const text = [];
    text.push("Top match: " + top.profile.name + " (" + top.profile.tag + ") at about " + top.score.toFixed(0) + "% similarity by these metrics.");
    const second = scored[1];
    if (second) {
      text.push("Runner-up: " + second.profile.name + " at " + second.score.toFixed(0) + "%.");
    }

    const dark = scored.find(s => s.profile.darkness >= 0.8);
    const mis = scored.find(s => s.profile.id === "cioran" || s.profile.id === "ligotti" || s.profile.id === "mccarthy");
    if (mis) {
      text.push("You sit relatively close to one of the misanthropic / dark-stoic profiles (" + mis.profile.name + ").");
    } else if (dark) {
      text.push("Your darkness score leans into the bleaker side of the palette.");
    }

    text.push("Use this as a compass, not a cage: nudge specific levers (sentence length, adverbs, dialogue share) if you want to drift toward or away from a profile.");

    body.textContent = text.join(" ");

    block.appendChild(body);
    return block;
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
    resultsHeading.textContent = "Author-style comparison";

    const features = computeFeatures(text);

    // Quick sanity badge on length
    if (features.wordCount < 300) {
      addBadge("Sample is short – results will be coarse");
    } else if (features.wordCount > 2000) {
      addBadge("Long sample – good for stable fingerprint");
    } else {
      addBadge("Medium sample – reasonably stable");
    }

    // Stats cards
    statCard("Words", features.wordCount, "Sample size");
    statCard("Sentences", features.sentenceCount, "Total sentences");
    statCard("Avg sentence", features.avgSentence.toFixed(1), "Words per sentence");
    statCard("Darkness", (features.darkness * 100).toFixed(0) + "%", "Dark vs warm lexicon");

    // Similarity scores
    const scored = profiles.map(p => ({
      profile: p,
      score: scoreProfile(features, p)
    })).sort((a,b) => b.score - a.score);

    // Badges for top authors
    scored.slice(0, 3).forEach(s => {
      addBadge(s.profile.name + " " + s.score.toFixed(0) + "%");
    });

    // Build results list
    const list = document.createElement("div");
    list.className = "results-list-inner";

    list.appendChild(buildMetricBlock(features));
    list.appendChild(buildAuthorTable(scored));
    list.appendChild(buildClusterBlock(scored));

    resultsList.appendChild(list);
  }

  btnRun.addEventListener("click", run);
})();
