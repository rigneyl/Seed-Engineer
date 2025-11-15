// Seed engineered for misanthropic writers.
// Local-only. No tracking. No saving unless you copy it yourself.

const editor = document.getElementById('editor');

const wordCountEl = document.getElementById('wordCount');
const charCountEl = document.getElementById('charCount');

const gritBar = document.getElementById('gritBar');
const pretensionBar = document.getElementById('pretensionBar');
const rawnessBar = document.getElementById('rawnessBar');
const whiskeyBar = document.getElementById('whiskeyBar');

const gritValueEl = document.getElementById('gritValue');
const pretensionValueEl = document.getElementById('pretensionValue');
const rawnessValueEl = document.getElementById('rawnessValue');
const whiskeyValueEl = document.getElementById('whiskeyValue');

const poeticList = document.getElementById('poeticList');
const academicList = document.getElementById('academicList');
const hedgeList = document.getElementById('hedgeList');
const sentenceList = document.getElementById('sentenceList');

const notesEl = document.getElementById('notes');

// Word lists (tunable)
const poeticWords = [
  "ethereal","glimmer","glow","radiant","shimmer","celestial","fragile","tender",
  "luminous","bloom","whisper","silken","delicate","glowing","angelic","sacred"
];

const metaphorMarks = [" like ", " as if ", " as though ", " as a ", " as an "];

const academicWords = [
  "therefore","however","subsequently","consequently","moreover","furthermore",
  "regarding","whereas","nonetheless","hence","thus","articulate","phenomenon",
  "utilise","utilize","paradigm","nuance","discourse","framework","existential"
];

const fancyToPlain = {
  "utilize": "use",
  "utilise": "use",
  "endeavor": "try",
  "endeavour": "try",
  "commence": "start",
  "ameliorate": "fix",
  "assist": "help",
  "obtain": "get",
  "consume": "eat",
  "demonstrate": "show",
  "individual": "person"
};

const hedges = [
  "maybe","perhaps","kind of","sort of","somewhat","i think","i guess","a little",
  "a bit","apparently","probably","possibly","seems","seemed","i feel like"
];

const softeners = [
  "honestly","truly","really","very","quite","rather","slightly"
];

const strongWords = [
  "hate","loathe","love","burn","break","crash","kill","ruin","wreck","crush",
  "fight","hit","beat","drink","smoke","suffer","bleed"
];

const curseWords = [
  "fuck","fucking","shit","bullshit","asshole","bastard","bitch","damn","crap",
  "cunt","motherfucker"
];

const concreteWords = [
  "bar","street","beer","whiskey","whisky","cigarette","smoke","stool","table",
  "floor","hands","teeth","blood","vomit","train","bus","car","motel","room",
  "toilet","sink","neon","window","bed","chair"
];

function countOccurrences(text, list) {
  const lower = text.toLowerCase();
  let count = 0;
  list.forEach(word => {
    const pattern = new RegExp("\\b" + escapeRegExp(word.toLowerCase()) + "\\b", "g");
    const matches = lower.match(pattern);
    if (matches) count += matches.length;
  });
  return count;
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function updateStats() {
  const text = editor.value || "";
  const lower = text.toLowerCase();

  const words = text.trim().length ? text.trim().split(/\s+/) : [];
  const wordCount = words.length;
  const charCount = text.length;

  wordCountEl.textContent = wordCount + (wordCount === 1 ? " word" : " words");
  charCountEl.textContent = charCount + (charCount === 1 ? " character" : " characters");

  // Reset lists
  poeticList.innerHTML = "";
  academicList.innerHTML = "";
  hedgeList.innerHTML = "";
  sentenceList.innerHTML = "";

  if (!text.trim()) {
    setMeter(gritBar, gritValueEl, 0, "%");
    setMeter(pretensionBar, pretensionValueEl, 0, "%");
    setMeter(rawnessBar, rawnessValueEl, 0, "");
    setMeter(whiskeyBar, whiskeyValueEl, 0, " : 1");
    notesEl.textContent = "Start typing on the left. This panel will call you out for metaphors, academic phrasing, hedging, softness, and sentences that drag on.";
    return;
  }

  // Line-level checks
  const lines = text.split(/\n/);
  let poeticHits = 0;
  let metaphorHits = 0;
  let academicHits = 0;
  let hedgeHits = 0;
  let longSentences = 0;

  lines.forEach((line, index) => {
    const l = line.toLowerCase();
    if (!l.trim()) return;

    const hasPoetic = poeticWords.some(w => l.includes(w));
    const hasMetaphor = metaphorMarks.some(m => l.includes(m));
    if (hasPoetic || hasMetaphor) {
      poeticHits++;
      const label = hasPoetic && hasMetaphor ? "poetic + metaphor" : hasPoetic ? "too poetic" : "metaphor heavy";
      addListItem(poeticList, `Line ${index + 1}: ${label} — “${line.trim().slice(0, 80)}${line.trim().length > 80 ? "..." : ""}"`);
      if (hasMetaphor) metaphorHits++;
    }

    const acadMatches = academicWords.filter(w => l.includes(w));
    if (acadMatches.length) {
      academicHits += acadMatches.length;
      addListItem(academicList, `Line ${index + 1}: academic tone (${acadMatches.join(", ")})`);
    }

    const hedgeMatches = hedges.filter(w => l.includes(w));
    const softMatches = softeners.filter(w => l.includes(w));
    if (hedgeMatches.length || softMatches.length) {
      hedgeHits += hedgeMatches.length + softMatches.length;
      const tags = [];
      if (hedgeMatches.length) tags.push("hedging: " + hedgeMatches.join(", "));
      if (softMatches.length) tags.push("softening: " + softMatches.join(", "));
      addListItem(hedgeList, `Line ${index + 1}: ${tags.join(" | ")}`);
    }
  });

  // Sentence checks
  const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);
  let totalSentenceLen = 0;
  let shortSentences = 0;

  sentences.forEach((s, idx) => {
    const sWords = s.split(/\s+/).filter(Boolean);
    const len = sWords.length;
    if (!len) return;
    totalSentenceLen += len;
    if (len <= 8) shortSentences++;
    if (len > 18) {
      longSentences++;
      addListItem(sentenceList, `Sentence ${idx + 1}: ${len} words — “${s.slice(0, 80)}${s.length > 80 ? "..." : ""}"`);
    }
  });

  // Counts for metrics
  const avgWordLen = wordCount ? words.join("").length / wordCount : 0;
  const academicCount = countOccurrences(lower, academicWords);
  const fancyCount = Object.keys(fancyToPlain).reduce((acc, key) => {
    const pattern = new RegExp("\\b" + escapeRegExp(key.toLowerCase()) + "\\b", "g");
    const matches = lower.match(pattern);
    return acc + (matches ? matches.length : 0);
  }, 0);
  const hedgeCount = countOccurrences(lower, hedges);
  const softenerCount = countOccurrences(lower, softeners);
  const strongCount = countOccurrences(lower, strongWords);
  const curseCount = countOccurrences(lower, curseWords);
  const concreteCount = countOccurrences(lower, concreteWords);

  // Metrics
  const grit = clamp(((concreteCount + curseCount + strongCount) / (wordCount || 1)) * 220, 0, 100);
  const pretensionRaw = (avgWordLen * 10) + (academicCount * 8) + (fancyCount * 6) + (metaphorHits * 5);
  const pretension = clamp(pretensionRaw / (wordCount || 1) * 100, 0, 100);

  const sentenceTightness = sentences.length ? (shortSentences / sentences.length) : 0;
  const hedgePenalty = clamp((hedgeCount + softenerCount) / (wordCount || 1), 0, 1);
  let rawness = (sentenceTightness * 60) + ((curseCount + strongCount) / (wordCount || 1) * 40) - (hedgePenalty * 30);
  rawness = clamp(rawness, 0, 100);

  const whiskeyNumerator = strongCount + curseCount + concreteCount;
  const whiskeyDenominator = hedgeCount + softenerCount || 1;
  const whiskeyRatio = whiskeyNumerator / whiskeyDenominator;

  setMeter(gritBar, gritValueEl, Math.round(grit), "%");
  setMeter(pretensionBar, pretensionValueEl, Math.round(pretension), "%");
  setMeter(rawnessBar, rawnessValueEl, Math.round(rawness), "");
  setWhiskeyMeter(whiskeyBar, whiskeyValueEl, whiskeyRatio);

  // Notes
  const noteParts = [];

  if (longSentences > 0) {
    noteParts.push(`You have ${longSentences} sentence${longSentences === 1 ? "" : "s"} dragging past 18 words. Split them.`);
  }

  if (poeticHits > 0) {
    noteParts.push(`Detected ${poeticHits} line${poeticHits === 1 ? "" : "s"} that drift into poetic/lyrical territory.`);
  }

  if (academicHits > 0) {
    noteParts.push(`Academic tone spotted ${academicHits} time${academicHits === 1 ? "" : "s"}. This isn't a journal article.`);
  }

  if (hedgeHits > 0) {
    noteParts.push(`You hedged or softened your blows ${hedgeHits} time${hedgeHits === 1 ? "" : "s"}. Say it cleaner.`);
  }

  if (curseCount === 0 && concreteCount === 0) {
    noteParts.push("Almost no concrete grime or profanity. Add bars, streets, stains, and failed mornings.");
  }

  if (!noteParts.length) {
    noteParts.push("This is relatively blunt and unpretentious. Keep going and don't polish it to death.");
  }

  notesEl.textContent = noteParts.join(" ");
}

function addListItem(listEl, text) {
  const li = document.createElement('li');
  li.textContent = text;
  listEl.appendChild(li);
}

function setMeter(bar, label, value, suffix) {
  const safe = clamp(value, 0, 100);
  bar.style.width = safe + "%";
  if (suffix === "%") {
    label.textContent = safe + "%";
  } else if (suffix === "") {
    label.textContent = safe;
  } else {
    label.textContent = safe + suffix;
  }
  colorizeBar(bar, safe);
}

function setWhiskeyMeter(bar, label, ratio) {
  const capped = clamp(ratio, 0, 12);
  const percent = (capped / 12) * 100;
  bar.style.width = percent + "%";
  colorizeBar(bar, percent);
  const display = ratio === 0 ? "0 : 1" : ratio.toFixed(1) + " : 1";
  label.textContent = display;
}

function colorizeBar(bar, value) {
  if (value < 30) {
    bar.style.background = "linear-gradient(90deg, rgba(255,255,255,0.18), #ff5c7a)";
  } else if (value < 70) {
    bar.style.background = "linear-gradient(90deg, rgba(255,255,255,0.18), #ffb648)";
  } else {
    bar.style.background = "linear-gradient(90deg, rgba(255,255,255,0.18), #e3b341)";
  }
}

function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

// Initial
updateStats();
editor.addEventListener('input', updateStats);
