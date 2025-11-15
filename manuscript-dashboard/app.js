
// manuscript-dashboard/app.js
// Stitched overview from mechanics + depth + spice metrics.

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

  function snapshotCard(title, pill, bodyHTML) {
    const card = document.createElement("div");
    card.className = "snapshot-card";
    const header = document.createElement("div");
    header.className = "snapshot-card-header";
    const t = document.createElement("div");
    t.className = "snapshot-card-title";
    t.textContent = title;
    const p = document.createElement("div");
    p.className = "snapshot-pill";
    p.textContent = pill;
    header.appendChild(t);
    header.appendChild(p);
    const body = document.createElement("div");
    body.className = "snapshot-body";
    body.innerHTML = bodyHTML;
    card.appendChild(header);
    card.appendChild(body);
    return card;
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

    const stats = TextUtils.getTextStats(text);
    const read = TextUtils.computeReadability(text);
    const { wordCount, sentenceCount, lexicalDensity, avgSentenceLength } = read;

    // ----- Overview stats -----
    statCard("Words", wordCount || 0, "Total tokens in snapshot");
    statCard("Sentences", sentenceCount || 0, "Rough split on .!?");
    statCard("Avg length", sentenceCount ? avgSentenceLength.toFixed(1) : "–", "Words per sentence");
    statCard("Lexical density", (lexicalDensity * 100).toFixed(0) + "%", "Non-stopword share");

    const fre = read.fleschReadingEase;
    const fk = read.fleschKincaidGrade;
    if (fre !== null) {
      let label = "Unknown density";
      if (fre >= 70) label = "Easy";
      else if (fre >= 50) label = "Moderate";
      else if (fre >= 30) label = "Dense";
      else label = "Very dense";
      statCard("Flesch", fre.toFixed(1), label);
    }
    if (fk !== null) {
      statCard("Grade approx.", fk.toFixed(1), "Flesch–Kincaid");
    }

    // Badges
    const densityBadge = document.createElement("div");
    densityBadge.className = "badge";
    const dDot = document.createElement("span");
    dDot.className = "badge-dot";
    const dLabel = document.createElement("span");
    dLabel.textContent = lexicalDensity > 0.55 ? "Dense prose" :
                         lexicalDensity < 0.35 ? "Light prose" :
                         "Balanced prose";
    densityBadge.appendChild(dDot);
    densityBadge.appendChild(dLabel);
    tagRow.appendChild(densityBadge);

    const sizeBadge = document.createElement("div");
    sizeBadge.className = "badge badge-muted";
    const sDot = document.createElement("span");
    sDot.className = "badge-dot";
    const sLabel = document.createElement("span");
    sLabel.textContent = wordCount < 500 ? "Very short sample" :
                         wordCount < 800 ? "Short sample" :
                         wordCount > 4000 ? "Long chunk" :
                         "Good snapshot";
    sizeBadge.appendChild(sDot);
    sizeBadge.appendChild(sLabel);
    tagRow.appendChild(sizeBadge);

    resultsHeading.textContent = "Manuscript snapshot";

    const grid = document.createElement("div");
    grid.className = "snapshot-grid";

    // ----- Mechanics (clarity/passive/repetition) -----
    (function() {
      const sentences = stats.sentences;

      // Passive & weak verbs
      const passiveRe = /\b(?:was|were|is|are|been|being|be)\s+\w+ed\b/gi;
      const weakPhrases = [
        "seems to","seemed to","started to","begin to","began to",
        "decided to","tried to","attempted to"
      ];
      let passiveCount = 0, weakCount = 0, passiveSentences = 0, weakSentences = 0;
      sentences.forEach(s => {
        const lower = s.toLowerCase();
        const pm = s.match(passiveRe);
        if (pm && pm.length) {
          passiveCount += pm.length;
          passiveSentences++;
        }
        let hasWeak = false;
        weakPhrases.forEach(p => {
          const re = new RegExp("\\b" + p.replace(" ", "\\s+") + "\\b", "gi");
          const m = lower.match(re);
          if (m && m.length) {
            weakCount += m.length;
            hasWeak = true;
          }
        });
        if (hasWeak) weakSentences++;
      });
      const pd = sentenceCount ? (passiveSentences / sentenceCount) * 100 : 0;
      const wd = sentenceCount ? (weakSentences / sentenceCount) * 100 : 0;

      // Long / clunky
      const longThreshold = 25;
      let longCount = 0;
      sentences.forEach(s => {
        const wc = TextUtils.getTextStats(s).wordCount;
        if (wc >= longThreshold) longCount++;
      });

      const lines = [];
      lines.push(`<strong>Passive / weak verbs</strong>`);
      lines.push(`• Passive in ${pd.toFixed(0)}% of sentences`);
      lines.push(`• Weak verbs in ${wd.toFixed(0)}% of sentences`);
      lines.push(`<strong>Line length</strong>`);
      lines.push(`• ${longCount} long sentences (≥ ${longThreshold} words)`);
      lines.push(`• Avg length: ${sentenceCount ? avgSentenceLength.toFixed(1) : "–"} words`);

      grid.appendChild(snapshotCard("Mechanics snapshot", "verbs + length", lines.join("<br>")));
    })();

    // ----- Repetition & vocabulary -----
    (function() {
      const sorted = TextUtils.sortedFrequencies(stats.freqMap);
      const CRUTCH = TextUtils.crutchWords;
      const topN = sorted.slice(0, 8);
      const uniqueWords = sorted.length;
      const ttr = wordCount ? (uniqueWords / wordCount) : 0;
      const crutchTop = topN.filter(([w]) => CRUTCH.includes(w)).map(([w]) => w);

      const lines = [];
      lines.push(`<strong>Variety</strong>`);
      lines.push(`• Unique words: ${uniqueWords}`);
      lines.push(`• Type–token ratio: ${(ttr * 100).toFixed(1)}%`);
      if (crutchTop.length) {
        lines.push(`<strong>Crutch words in top 8</strong>`);
        lines.push(`• ${crutchTop.join(", ")}`);
      }
      if (topN.length) {
        const items = topN.map(([w,c]) => {
          const pct = wordCount ? ((c / wordCount) * 100).toFixed(1) : "0.0";
          return `<li>${w} — ${c} (${pct}%)</li>`;
        }).join("");
        lines.push(`<strong>Top words</strong><ul>${items}</ul>`);
      }

      grid.appendChild(snapshotCard("Repetition & lexicon", "word use", lines.join("<br>")));
    })();

    // ----- Pacing -----
    (function() {
      const sentences = stats.sentences;
      const chunks = [];
      if (sentences.length) {
        const chunkSize = Math.max(1, Math.floor(sentences.length / 6));
        for (let i = 0; i < sentences.length; i += chunkSize) {
          const seg = sentences.slice(i, i + chunkSize).join(" ");
          const st = TextUtils.getTextStats(seg);
          chunks.push({ words: st.wordCount, asl: st.avgSentenceLength });
        }
      }
      let slow = 0, fast = 0, even = 0;
      const lines = [];
      if (!chunks.length) {
        lines.push("Not enough sentences to assess pacing.");
      } else {
        chunks.forEach((c, idx) => {
          let label = "even";
          if (c.asl >= avgSentenceLength * 1.2) { label = "slow"; slow++; }
          else if (c.asl <= avgSentenceLength * 0.8) { label = "fast"; fast++; }
          else even++;
          lines.push(`Chunk ${idx + 1}: ${c.asl.toFixed(1)} words · ${label}`);
        });
      }
      const summary = [];
      if (chunks.length) {
        summary.push(`<strong>Mix</strong>`);
        summary.push(`• Fast: ${fast} · Even: ${even} · Slow: ${slow}`);
      }
      grid.appendChild(snapshotCard("Pacing overview", "flow", summary.concat(lines).join("<br>")));
    })();

    // ----- Sensory detail -----
    (function() {
      const lists = {
        sight: [ "dark","light","look","see","glow","shadow","bright","dim","color","vision" ],
        sound: [ "noise","silent","quiet","echo","bang","whisper","scream","shout","ring","hum" ],
        smell: [ "odor","smell","stink","aroma","scent","reek" ],
        taste: [ "taste","bitter","sweet","sour","salty","bland" ],
        touch: [ "cold","warm","rough","smooth","pressure","soft","hard","heat","chill" ]
      };
      const counts = { sight:0, sound:0, smell:0, taste:0, touch:0 };
      const words = stats.words.map(w => w.toLowerCase());
      words.forEach(w => {
        for (const k in lists) {
          if (lists[k].includes(w)) counts[k]++;
        }
      });
      const totalSense = Object.values(counts).reduce((a,b)=>a+b,0);
      const lines = [];
      lines.push(`<strong>Total sensory hits</strong> — ${totalSense}`);
      const byChan = Object.entries(counts).map(([k,v]) => `${k}: ${v}`).join(" · ");
      lines.push(byChan || "No obvious sense words detected.");

      grid.appendChild(snapshotCard("Sensory balance", "sight / sound / etc.", lines.join("<br>")));
    })();

    // ----- Tone: distance + mood -----
    (function() {
      const warmWords = [
        "love","loved","loving","care","cared","kind","kindness","warm","gentle","soft",
        "hope","hopeful","believe","believing","together","friend","friends","forgive","forgiveness",
        "compassion","empathy","humanity","warmth","kindhearted"
      ];
      const coldWords = [
        "void","nothing","empty","hollow","cold","distant","distance","machine","mechanical","sterile",
        "indifferent","indifference","nihil","misanthropy","misanthrope","ruin","decay","rotting","futile","futility"
      ];
      let warmHits = 0, coldHits = 0;
      const w = stats.words.map(x => x.toLowerCase());
      w.forEach(token => {
        if (warmWords.includes(token)) warmHits++;
        if (coldWords.includes(token)) coldHits++;
      });
      const totalMarked = warmHits + coldHits || 1;
      const distancePct = (coldHits / totalMarked) * 100;

      const moodLists = {
        despair: [ "hopeless","despair","worthless","pointless","futile","futility","meaningless","nihil","void","empty","nothing" ],
        aggression: [ "hate","hated","loath","loathing","violence","violent","rage","fury","anger","spite","attack","destroy" ],
        melancholy: [ "sad","sorrow","melancholy","blue","lonely","alone","isolation","grief","mourning" ],
        contempt: [ "idiot","stupid","pathetic","disgust","vile","vermin","scum","trash","worthless","clown" ],
        hope: [ "hope","hopeful","light","future","possible","possibility","chance","redemption","healing" ],
        numb: [ "numb","blank","empty","dull","detached","disconnected","drained" ]
      };
      const moodCounts = { despair:0, aggression:0, melancholy:0, contempt:0, hope:0, numb:0 };
      w.forEach(token => {
        for (const key in moodLists) {
          if (moodLists[key].includes(token)) moodCounts[key]++;
        }
      });
      let dominant = "neutral";
      let maxMood = 0;
      for (const key in moodCounts) {
        if (moodCounts[key] > maxMood) { maxMood = moodCounts[key]; dominant = key; }
      }

      const lines = [];
      lines.push(`<strong>Inhuman distance</strong> — ${distancePct.toFixed(0)}% cold vs warm word balance`);
      lines.push(`<strong>Dominant mood</strong> — ${dominant}`);
      const moodLine = Object.entries(moodCounts)
        .map(([k,v]) => v ? `${k}: ${v}` : null)
        .filter(Boolean)
        .join(" · ") || "No strong mood lexicon detected.";
      lines.push(moodLine);

      grid.appendChild(snapshotCard("Tone & mood", "distance + mood", lines.join("<br>")));
    })();

    // ----- Style flavour: brutality + minimalism (very approximate) -----
    (function() {
      const words = stats.words;
      // Fancy words: length >= 11 or containing rare letters
      let fancyCount = 0;
      words.forEach(w => {
        if (w.length >= 11 || /[jzq]/.test(w)) fancyCount++;
      });

      const hedges = TextUtils.crutchWords;
      let hedgeHits = 0;
      const lower = text.toLowerCase();
      hedges.forEach(h => {
        const re = new RegExp("\\b" + h.replace(" ", "\\s+") + "\\b", "gi");
        const m = lower.match(re);
        if (m) hedgeHits += m.length;
      });

      const lenScore = Math.max(0, 1 - (avgSentenceLength / 30));
      const fancyScore = Math.max(0, 1 - (fancyCount / Math.max(10, (sentenceCount || 1) * 2)));
      const hedgeScore = Math.max(0, 1 - (hedgeHits / Math.max(8, (sentenceCount || 1) * 2)));
      const rawness = (lenScore * 0.4 + fancyScore * 0.3 + hedgeScore * 0.3) * 100;

      let adverbCount = 0;
      words.forEach(w => {
        if (/ly$/.test(w) && !/(only|family|supply|reply)$/.test(w)) adverbCount++;
      });
      let adjApprox = 0;
      words.forEach(w => {
        if (w.length >= 6 && !/ly$/.test(w) && !/(ing|ed)$/.test(w)) adjApprox++;
      });
      const commaMatches = (text.match(/,/g) || []).length;
      const modifierRate = (adverbCount + adjApprox) / Math.max(1, wordCount || 1);
      const commaRate = commaMatches / Math.max(1, sentenceCount || 1);
      const modScore = Math.max(0, 1 - modifierRate * 40);
      const commaScore = Math.max(0, 1 - commaRate * 0.8);
      const lengthScore = avgSentenceLength ? Math.min(1, avgSentenceLength / 24) : 0.5;
      const purity = (modScore * 0.5 + commaScore * 0.3 + lengthScore * 0.2) * 100;

      const lines = [];
      lines.push(`<strong>Brutality (approx.)</strong> — rawness score ${rawness.toFixed(0)}/100`);
      lines.push(`• Fancy words: ${fancyCount}, hedges: ${hedgeHits}`);
      lines.push(`<strong>Minimalism (approx.)</strong> — purity ${purity.toFixed(0)}/100`);
      lines.push(`• Adverbs: ${adverbCount}, approx. adjectives: ${adjApprox}, commas: ${commaMatches}`);

      grid.appendChild(snapshotCard("Style flavour", "brutality + minimalism", lines.join("<br>")));
    })();

    resultsList.appendChild(grid);
  });
})();
