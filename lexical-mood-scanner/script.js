// --- Lexical lists (editable) ---

const moodLexicon = {
  despair: [
    "hopeless", "void", "empty", "meaningless", "ruined", "broken",
    "worthless", "pointless", "lost", "collapsed", "futile", "doom",
    "failed", "failure", "nothing", "nowhere", "darkness", "numb",
    "despair", "abyss"
  ],
  aggression: [
    "rage", "violent", "violence", "attack", "destroy", "crush", "cut",
    "slash", "hurt", "smash", "damage", "hate", "hated", "hatred",
    "brutal", "strike", "harsh", "spite", "venom", "hostile"
  ],
  melancholy: [
    "melancholy", "sad", "sadness", "lonely", "alone", "solitude",
    "distant", "quiet", "weary", "tired", "aching", "hollow",
    "longing", "regret", "autumn", "fading", "slow", "soft", "dim",
    "grey", "gray"
  ],
  contempt: [
    "pathetic", "pitiful", "stupid", "idiot", "idiotic", "inferior",
    "worthless", "vile", "rotten", "disgusting", "laughable", "trivial",
    "insignificant", "clown", "vermin", "filth", "garbage", "trash"
  ],
  hope: [
    "hope", "hopeful", "bright", "light", "dawn", "renew", "reborn",
    "begin", "start", "build", "grow", "repair", "heal", "healing",
    "rebuild", "future", "possible", "chance", "open", "breathe"
  ],
  numb: [
    "numb", "blank", "neutral", "still", "flat", "detached", "vacant",
    "mute", "muted", "empty", "hushed", "remote", "absent", "cold",
    "clinical", "sterile"
  ]
};

// Build a lookup map: word -> [categories]
const wordToCategories = (() => {
  const map = new Map();
  Object.entries(moodLexicon).forEach(([category, words]) => {
    words.forEach((w) => {
      const key = w.toLowerCase();
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(category);
    });
  });
  return map;
})();

document.addEventListener("DOMContentLoaded", () => {
  const inputText = document.getElementById("input-text");
  const highlightWrapper = document.getElementById("highlight-wrapper");
  const highlightedOutput = document.getElementById("highlighted-output");
  const scanBtn = document.getElementById("scan-btn");
  const sampleBtn = document.getElementById("sample-text-btn");
  const toggleHighlights = document.getElementById("toggle-highlights");
  const targetMoodSelect = document.getElementById("target-mood");
  const leakList = document.getElementById("leak-list");
  const barChart = document.getElementById("bar-chart");
  const statTotalWords = document.getElementById("stat-total-words");
  const statEmotionalWords = document.getElementById("stat-emotional-words");
  const statDominantMood = document.getElementById("stat-dominant-mood");
  const targetFeedback = document.getElementById("target-feedback");
  const reportOutput = document.getElementById("report-output");
  const downloadReportBtn = document.getElementById("download-report-btn");

  // Toggle highlighted view visibility
  toggleHighlights.addEventListener("change", () => {
    highlightWrapper.classList.toggle("hidden", !toggleHighlights.checked);
  });

  // Load sample text
  sampleBtn.addEventListener("click", () => {
    inputText.value = sampleText;
    runScan();
  });

  // Scan button
  scanBtn.addEventListener("click", () => {
    runScan();
  });

  // Download report
  downloadReportBtn.addEventListener("click", () => {
    if (!reportOutput.value.trim()) return;
    const blob = new Blob([reportOutput.value], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lexical-mood-report.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  function tokenize(text) {
    // returns array of {word, raw, index}
    const tokens = [];
    const regex = /[A-Za-zÀ-ÖØ-öø-ÿ']+/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
      tokens.push({
        word: match[0].toLowerCase(),
        raw: match[0],
        index: match.index
      });
    }
    return tokens;
  }

  function analyse(text) {
    const tokens = tokenize(text);
    const totalWords = tokens.length;
    const counts = {
      despair: 0,
      aggression: 0,
      melancholy: 0,
      contempt: 0,
      hope: 0,
      numb: 0,
      neutral: 0
    };

    const tokenCategories = new Array(tokens.length).fill(null).map(() => []);
    let emotionalWords = 0;

    tokens.forEach((tok, i) => {
      const cats = wordToCategories.get(tok.word);
      if (cats && cats.length > 0) {
        emotionalWords++;
        cats.forEach((cat) => {
          counts[cat]++;
          tokenCategories[i].push(cat);
        });
      } else {
        counts.neutral++;
      }
    });

    // Percentages relative to total words
    const percentages = {};
    Object.keys(counts).forEach((cat) => {
      percentages[cat] = totalWords > 0 ? (counts[cat] / totalWords) * 100 : 0;
    });

    // Dominant mood (excluding neutral)
    const moodCats = ["despair", "aggression", "melancholy", "contempt", "hope", "numb"];
    let dominant = null;
    let maxCount = 0;
    moodCats.forEach((cat) => {
      if (counts[cat] > maxCount) {
        maxCount = counts[cat];
        dominant = counts[cat] > 0 ? cat : null;
      }
    });

    // Leak detection: categories < 10% of total but with at least 1 word, and not neutral
    const leakThresholdPct = 10;
    const leakWords = [];
    tokens.forEach((tok, i) => {
      const cats = tokenCategories[i];
      if (!cats || cats.length === 0) return;
      cats.forEach((cat) => {
        if (
          cat !== dominant &&
          cat !== "neutral" &&
          percentages[cat] > 0 &&
          percentages[cat] < leakThresholdPct
        ) {
          leakWords.push({
            word: tok.raw,
            category: cat,
            index: i
          });
        }
      });
    });

    return {
      tokens,
      tokenCategories,
      counts,
      percentages,
      totalWords,
      emotionalWords,
      dominant,
      leakWords
    };
  }

  function buildBarChart(percentages) {
    const order = [
      "melancholy",
      "despair",
      "contempt",
      "aggression",
      "hope",
      "numb",
      "neutral"
    ];

    barChart.innerHTML = "";

    order.forEach((cat) => {
      const pct = percentages[cat] || 0;
      const row = document.createElement("div");
      row.className = "bar-row";

      const label = document.createElement("div");
      label.className = "bar-label";
      label.textContent = cat === "numb" ? "numb/detached" : cat;

      const track = document.createElement("div");
      track.className = "bar-track";

      const fill = document.createElement("div");
      fill.className = `bar-fill ${cat}`;
      fill.style.width = `${pct.toFixed(1)}%`;

      const value = document.createElement("div");
      value.className = "bar-value";
      value.textContent = `${pct.toFixed(1)}%`;

      track.appendChild(fill);
      row.appendChild(label);
      row.appendChild(track);
      row.appendChild(value);
      barChart.appendChild(row);
    });
  }

  function buildHighlights(text, analysis) {
    const { tokens, tokenCategories, leakWords } = analysis;

    if (!text.trim()) {
      highlightedOutput.textContent = "";
      return;
    }

    const leakIndexes = new Set(leakWords.map((w) => w.index));

    let result = "";
    let cursor = 0;

    tokens.forEach((tok, i) => {
      const start = tok.index;
      const end = tok.index + tok.raw.length;

      // Add untouched text between tokens
      if (cursor < start) {
        result += escapeHtml(text.slice(cursor, start));
      }

      const cats = tokenCategories[i];
      if (!cats || cats.length === 0) {
        // Neutral word
        result += escapeHtml(text.slice(start, end));
      } else {
        const classes = ["token"].concat(cats);
        if (leakIndexes.has(i)) {
          classes.push("leak");
        }

        const span = `<span class="${classes.join(" ")}">${escapeHtml(
          text.slice(start, end)
        )}</span>`;
        result += span;
      }

      cursor = end;
    });

    // Tail after last token
    if (cursor < text.length) {
      result += escapeHtml(text.slice(cursor));
    }

    highlightedOutput.innerHTML = result;
  }

  function buildLeaksList(leakWords) {
    leakList.innerHTML = "";

    if (!leakWords.length) {
      leakList.classList.add("empty");
      const li = document.createElement("li");
      li.className = "empty-message";
      li.textContent = "No leaks detected.";
      leakList.appendChild(li);
      return;
    }

    leakList.classList.remove("empty");
    leakWords.forEach((entry) => {
      const li = document.createElement("li");
      const wordSpan = document.createElement("span");
      wordSpan.className = "leak-word";
      wordSpan.textContent = entry.word;

      const catSpan = document.createElement("span");
      catSpan.className = "leak-category";
      catSpan.textContent = `(${entry.category})`;

      li.appendChild(wordSpan);
      li.appendChild(catSpan);
      leakList.appendChild(li);
    });
  }

  function updateStats(analysis) {
    statTotalWords.textContent = analysis.totalWords;
    statEmotionalWords.textContent = analysis.emotionalWords;
    statDominantMood.textContent = analysis.dominant ? analysis.dominant : "–";
  }

  function updateTargetFeedback(analysis) {
    const target = targetMoodSelect.value;
    if (!target) {
      targetFeedback.textContent = "No target mood selected.";
      return;
    }

    const pct = analysis.percentages[target] || 0;

    let msg;
    if (pct === 0) {
      msg = `Target: ${target} · No ${target} markers detected.`;
    } else if (pct < 15) {
      msg = `Target: ${target} · Very faint (${pct.toFixed(
        1
      )}%). Consider sharpening the mood vocabulary.`;
    } else if (pct < 40) {
      msg = `Target: ${target} · Present but moderate (${pct.toFixed(
        1
      )}%). Subtle, balanced tone.`;
    } else if (pct < 70) {
      msg = `Target: ${target} · Strong (${pct.toFixed(
        1
      )}%). The dominant emotional color of the text.`;
    } else {
      msg = `Target: ${target} · Overwhelming (${pct.toFixed(
        1
      )}%). Nearly everything is saturated with this mood.`;
    }

    targetFeedback.textContent = msg;
  }

  function buildReport(text, analysis) {
    const {
      totalWords,
      emotionalWords,
      counts,
      percentages,
      dominant,
      leakWords
    } = analysis;

    const lines = [];
    lines.push("# Lexical Mood Scanner Report");
    lines.push("");
    lines.push(`Text length: ${totalWords} words`);
    lines.push(`Emotional words: ${emotionalWords}`);
    lines.push("");

    lines.push("## Mood distribution (percentage of total words)");
    lines.push("");
    const ordered = [
      "melancholy",
      "despair",
      "contempt",
      "aggression",
      "hope",
      "numb",
      "neutral"
    ];
    ordered.forEach((cat) => {
      const label = cat === "numb" ? "numb/detached" : cat;
      lines.push(
        `- ${capitalize(label)}: ${counts[cat]} (${percentages[cat].toFixed(
          1
        )}%)`
      );
    });
    lines.push("");

    lines.push("## Dominant mood");
    lines.push("");
    lines.push(dominant ? `- ${capitalize(dominant)}` : "- None detected");
    lines.push("");

    lines.push("## Emotional leaks");
    lines.push("");
    if (!leakWords.length) {
      lines.push("- No leaks detected.");
    } else {
      leakWords.forEach((entry) => {
        lines.push(`- \`${entry.word}\` (${entry.category})`);
      });
    }
    lines.push("");

    lines.push("## Original text");
    lines.push("");
    lines.push("```");
    lines.push(text.trim());
    lines.push("```");
    lines.push("");

    return lines.join("\n");
  }

  function runScan() {
    const text = inputText.value || "";
    const analysis = analyse(text);

    updateStats(analysis);
    buildBarChart(analysis.percentages);
    buildHighlights(text, analysis);
    buildLeaksList(analysis.leakWords);
    updateTargetFeedback(analysis);

    const report = buildReport(text, analysis);
    reportOutput.value = report;
    downloadReportBtn.disabled = !text.trim();
  }

  // Utility helpers
  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const sampleText = `
The room was quiet in that heavy, exhausted way, as if the walls themselves were tired of listening.
He sat at the desk, blinking at the empty document, feeling the familiar hollow ache in his chest.
Nothing felt urgent anymore. Not work, not friends, not the vague future people kept talking about as if it were a prize.

Outside, a bright morning pretended to be hopeful, all clean light and fresh air.
It made everything worse.
The world kept dressing itself in optimism like a joke that ran too long.

He thought about starting over, again, the way he always did.
New plans, new routines, new notebooks lined up like promises.
He knew they would fade into the same soft grey exhaustion as every other attempt, but the idea of renewal still leaked in at the edges, like light under a door he refused to open.

People called this "burnout" as if it were a tidy diagnosis, a solvable glitch.
He preferred to think of it as clarity.
The noise had burned away and what remained was simple:
most things were meaningless, most people were ridiculous, and most days were just a slow performance of pretending otherwise.
`;

});
