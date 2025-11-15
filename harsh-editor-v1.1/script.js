// The Harsh Editor logic

// DOM references
const draftInput = document.getElementById("draftInput");
const analyzeBtn = document.getElementById("analyzeBtn");
const scoreValue = document.getElementById("scoreValue");
const scoreFill = document.getElementById("scoreFill");
const sentenceCountEl = document.getElementById("sentenceCount");
const wordCountEl = document.getElementById("wordCount");
const violSummary = document.getElementById("violSummary");
const violList = document.getElementById("violList");
const pillArea = document.getElementById("pillArea");
const coachMessage = document.getElementById("coachMessage");
const punishToggle = document.getElementById("punishToggle");
const modeSelect = document.getElementById("modeSelect");

const rewriteOverlay = document.getElementById("rewriteOverlay");
const rewriteTitle = document.getElementById("rewriteTitle");
const rewriteDescription = document.getElementById("rewriteDescription");
const rewriteGuidance = document.getElementById("rewriteGuidance");
const rewriteCloseBtn = document.getElementById("rewriteCloseBtn");

// Rewrite guidance mapping
const rewriteGuidanceByType = {
  "Hedging": {
    title: "Rewrite hedged sentences",
    description: "Remove hedging and choose a clear stance.",
    guidance:
      "1. Locate the sentence containing the hedge.\\n" +
      "2. Delete words like 'maybe', 'sort of', 'kind of', 'probably'.\\n" +
      "3. Rewrite the sentence as a direct claim you are willing to stand behind."
  },
  "Softeners": {
    title: "Rewrite softened sentences",
    description: "Cut padding phrases and keep the blow intact.",
    guidance:
      "1. Remove words like 'just', 'a bit', 'somewhat', 'really'.\\n" +
      "2. Keep the core statement.\\n" +
      "3. Shorten the sentence if possible so it lands harder."
  },
  "Emotional qualifiers": {
    title: "Rewrite emotional qualifiers",
    description: "Replace emotional commentary with clinical description.",
    guidance:
      "1. Remove adverbs like 'unfortunately', 'luckily', 'sadly', 'hopefully'.\\n" +
      "2. Restate the situation using neutral terms.\\n" +
      "3. Focus on what happened, not how you feel about it."
  },
  "Passive voice": {
    title: "Rewrite passive voice",
    description: "Make someone clearly responsible for the action.",
    guidance:
      "1. Find the verb phrase with 'was/were/is/are' + past tense.\\n" +
      "2. Identify who actually did the action.\\n" +
      "3. Rewrite as 'Subject + verb + object' in active form."
  },
  "Modifiers": {
    title: "Rewrite with stronger nouns and verbs",
    description: "Remove intensifiers and replace them with precision.",
    guidance:
      "1. Delete words like 'very', 'extremely', 'absolutely', 'totally'.\\n" +
      "2. Choose a stronger verb or more exact noun.\\n" +
      "3. If the sentence survives without the modifier, keep it lean."
  },
  "Clichés": {
    title: "Rewrite clichés",
    description: "Replace worn-out phrases with concrete language or silence.",
    guidance:
      "1. Remove the cliché entirely.\\n" +
      "2. If the idea matters, express it with fresh, specific details.\\n" +
      "3. If it adds nothing, delete the sentence."
  }
};

// Dictionaries

const hedgingWords = [
  "maybe",
  "perhaps",
  "sort of",
  "kind of",
  "might",
  "could",
  "seems",
  "seemed",
  "i think",
  "probably",
  "likely",
  "possibly",
  "appears to",
  "appeared to"
];

const softeners = [
  "just",
  "a little",
  "a bit",
  "somewhat",
  "arguably",
  "really",
  "quite",
  "rather",
  "pretty much"
];

const emotionalQualifiers = [
  "unfortunately",
  "fortunately",
  "sadly",
  "happily",
  "hopefully",
  "thankfully",
  "honestly",
  "frankly",
  "regrettably",
  "luckily"
];

const modifiers = [
  "very",
  "extremely",
  "really",
  "highly",
  "absolutely",
  "totally",
  "completely",
  "utterly"
];

const cliches = [
  "at the end of the day",
  "think outside the box",
  "silver lining",
  "in the long run",
  "easier said than done",
  "time will tell",
  "it is what it is",
  "only time will tell",
  "the fact of the matter",
  "last but not least"
];

// Passive voice heuristic: forms of 'to be' followed by a word ending in 'ed' (very naive)
const passiveAux = [
  "was",
  "were",
  "is",
  "are",
  "been",
  "being",
  "be"
];

const militaryCoachLines = [
  "Your sentence is cowardly. Rewrite it.",
  "This draft apologizes for existing. Fix that.",
  "Stop hiding behind qualifiers.",
  "Say it or delete it.",
  "You are padding. Strip it down.",
  "Stop negotiating with the reader. State it.",
  "Your prose is flinching. Make it look."
];

const monasticCoachLines = [
  "Remove the unnecessary. Keep only what stands.",
  "Silence is better than soft language.",
  "Cut what does not carry weight.",
  "Clarity is a form of mercy. Practice it.",
  "What you cannot say cleanly, do not say.",
  "Precision is discipline made visible."
];

const misanthropeCoachLines = [
  "Language collapses under your hesitations. Strip them away.",
  "Your doubt infects every sentence. Cure it or delete it.",
  "You are decorating a corpse. Simplify.",
  "Human softness is the root problem. Do not imitate it in prose.",
  "Confidence is an illusion. Clarity is not.",
  "If the world burns, this draft will not be missed. Improve it."
];

// Utils

function splitSentences(text) {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (!cleaned) return [];
  return cleaned.split(/(?<=[.!?])\s+/);
}

function splitWords(text) {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  return words;
}

function countPassiveInstances(text) {
  const lower = text.toLowerCase();
  let count = 0;
  passiveAux.forEach(aux => {
    // e.g., "was tested"
    const pattern = new RegExp("\\b" + aux + "\\s+\\w+ed\\b", "g");
    const matches = lower.match(pattern);
    if (matches) count += matches.length;
  });
  return count;
}

function collectPhraseMatches(text, phrases) {
  const lower = text.toLowerCase();
  const matches = [];
  phrases.forEach(phrase => {
    const pattern = new RegExp("\\b" + phrase.replace(/\s+/g, "\\s+") + "\\b", "g");
    const found = lower.match(pattern);
    if (found) {
      matches.push({ phrase, count: found.length });
    }
  });
  return matches;
}

// Main analysis

function analyzeText() {
  const text = draftInput.value || "";
  const trimmed = text.trim();

  document.body.classList.toggle("has-text", !!trimmed);

  const sentences = splitSentences(text);
  const words = splitWords(text);

  const wordCount = words.length;
  const sentenceCount = sentences.length;

  sentenceCountEl.textContent = sentenceCount;
  wordCountEl.textContent = wordCount;

  if (!trimmed) {
    scoreValue.textContent = "–";
    scoreFill.style.width = "0%";
    violSummary.innerHTML = '<li>No text yet. Start writing.</li>';
    violList.innerHTML = '<p class="empty">No violations detected. Unlikely.</p>';
    pillArea.innerHTML = '<p class="empty">Weak phrases will appear here.</p>';
    coachMessage.innerHTML = 'Write a paragraph, then hit <strong>Analyze</strong>. The Harsh Editor does not offer comfort.';
    document.body.classList.remove("has-violations");
    return;
  }

  const hedgingMatches = collectPhraseMatches(text, hedgingWords);
  const softenerMatches = collectPhraseMatches(text, softeners);
  const emotionalMatches = collectPhraseMatches(text, emotionalQualifiers);
  const modifierMatches = collectPhraseMatches(text, modifiers);
  const clicheMatches = collectPhraseMatches(text, cliches);
  const passiveCount = countPassiveInstances(text);

  const hedgingCount = hedgingMatches.reduce((acc, m) => acc + m.count, 0);
  const softenerCount = softenerMatches.reduce((acc, m) => acc + m.count, 0);
  const emotionalCount = emotionalMatches.reduce((acc, m) => acc + m.count, 0);
  const modifierCount = modifierMatches.reduce((acc, m) => acc + m.count, 0);
  const clicheCount = clicheMatches.reduce((acc, m) => acc + m.count, 0);

  let score = 100;

  // Penalties (roughly as specced)
  if (hedgingCount > 0) score -= 20;
  if (softenerCount > 0) score -= 15;
  if (emotionalCount > 0) score -= 10;
  score -= passiveCount * 5;
  score -= clicheCount * 25;
  score -= Math.floor(modifierCount / 3) * 10;

  // Long-sentence penalty
  if (sentenceCount > 0) {
    sentences.forEach(s => {
      const len = splitWords(s).length;
      if (len > 20) {
        score -= Math.floor((len - 20) / 15);
      }
    });
  }

  // Positive points (simplified)
  sentences.forEach(s => {
    const len = splitWords(s).length;
    if (len <= 8) score += 2;
    if (len <= 4) score += 3;
    if (/\b(i|we|they|he|she|it)\b.*\b\w+ed\b/i.test(s)) {
      score += 2;
    }
  });

  score = Math.max(0, Math.min(100, score));

  scoreValue.textContent = score.toString();
  scoreFill.style.width = score + "%";

  // Summary
  const summaryItems = [];
  if (hedgingCount > 0) summaryItems.push(`${hedgingCount}× hedging`);
  if (softenerCount > 0) summaryItems.push(`${softenerCount}× softeners`);
  if (emotionalCount > 0) summaryItems.push(`${emotionalCount}× emotional qualifiers`);
  if (modifierCount > 0) summaryItems.push(`${modifierCount}× modifiers`);
  if (clicheCount > 0) summaryItems.push(`${clicheCount}× clichés`);
  if (passiveCount > 0) summaryItems.push(`${passiveCount}× passive constructions`);

  if (summaryItems.length === 0) {
    violSummary.innerHTML = "<li>No obvious weakness detected. Either this is strong, or the detector is naive.</li>";
  } else {
    violSummary.innerHTML = summaryItems.map(item => `<li>${item}</li>`).join("");
  }

  // Detailed list
  const chunks = [];

  function pushViol(type, totalCount, matches, note) {
    if (totalCount <= 0) return;
    const examples = matches
      .slice(0, 4)
      .map(m => `<span><strong>${m.phrase}</strong> ×${m.count}</span>`)
      .join("");
    const html = `
      <div class="viol-item" data-viol-type="${type}">
        <div class="viol-item-header">
          <span class="viol-type">${type}</span>
          <span class="viol-count">${totalCount} match${totalCount !== 1 ? "es" : ""}</span>
        </div>
        <div class="viol-examples">${examples || "Specific phrases detected."}</div>
        <div class="viol-note">${note}</div>
        <button class="btn rewrite-btn" type="button">Rewrite this now</button>
      </div>
    `;
    chunks.push(html);
  }

  pushViol(
    "Hedging",
    hedgingCount,
    hedgingMatches,
    "Hedging dilutes meaning. Remove indecision."
  );
  pushViol(
    "Softeners",
    softenerCount,
    softenerMatches,
    "Softness is laziness. Cut the padding."
  );
  pushViol(
    "Emotional qualifiers",
    emotionalCount,
    emotionalMatches,
    "Emotion is irrelevant. State facts."
  );
  if (passiveCount > 0) {
    const htmlPassive = `
      <div class="viol-item" data-viol-type="Passive voice">
        <div class="viol-item-header">
          <span class="viol-type">Passive voice</span>
          <span class="viol-count">${passiveCount} instance${passiveCount !== 1 ? "s" : ""}</span>
        </div>
        <div class="viol-examples">Forms of "to be" followed by past participles detected.</div>
        <div class="viol-note">Passive voice evades responsibility. Use active verbs.</div>
        <button class="btn rewrite-btn" type="button">Rewrite this now</button>
      </div>
    `;
    chunks.push(htmlPassive);
  }
  pushViol(
    "Modifiers",
    modifierCount,
    modifierMatches,
    "Modifiers are crutches. Strength comes from nouns and verbs."
  );
  pushViol(
    "Clichés",
    clicheCount,
    clicheMatches,
    "Clichés are intellectual decay. Replace them."
  );

  violList.innerHTML =
    chunks.length > 0 ? chunks.join("") : '<p class="empty">No violations detected. Unusual.</p>';

  // Toggle body class for pulsing
  document.body.classList.toggle("has-violations", chunks.length > 0);

  // Pills
  const pillChunks = [];

  function addPills(matches, label) {
    matches.forEach(m => {
      pillChunks.push(
        `<span class="pill">${m.phrase}<small>${label}</small></span>`
      );
    });
  }

  addPills(hedgingMatches, "hedge");
  addPills(softenerMatches, "softener");
  addPills(emotionalMatches, "emotional");
  addPills(modifierMatches, "modifier");
  addPills(clicheMatches, "cliché");

  pillArea.innerHTML =
    pillChunks.length > 0 ? pillChunks.join("") : '<p class="empty">Weak phrases will appear here.</p>';

  // Coach line
  const punishOn = document.body.classList.contains("punish-on");
  let line = "";

  if (punishOn) {
    const mode = modeSelect ? modeSelect.value : "military";
    let pool = militaryCoachLines;
    if (mode === "monastic") pool = monasticCoachLines;
    if (mode === "misanthrope") pool = misanthropeCoachLines;
    line = pool[Math.floor(Math.random() * pool.length)];
  } else {
    if (summaryItems.length === 0 && score > 85) {
      line = "This is relatively clean. You can always cut further.";
    } else if (score < 40) {
      line = "This draft is padded with softness. Start deleting.";
    } else {
      line = "Tighten at least one category per revision. Hedging, softeners, or clichés must go.";
    }
  }

  coachMessage.textContent = line;
}

// Events

analyzeBtn.addEventListener("click", analyzeText);

draftInput.addEventListener("input", () => {
  const text = draftInput.value;
  const words = splitWords(text);
  const sentences = splitSentences(text);
  sentenceCountEl.textContent = sentences.length;
  wordCountEl.textContent = words.length;
});

punishToggle.addEventListener("change", (e) => {
  document.body.classList.toggle("punish-on", e.target.checked);
  analyzeText();
});

violList.addEventListener("click", (e) => {
  const btn = e.target.closest(".rewrite-btn");
  if (!btn) return;
  const item = btn.closest(".viol-item");
  if (!item) return;
  const type = item.getAttribute("data-viol-type") || "Rewrite";
  const data = rewriteGuidanceByType[type] || {
    title: "Rewrite this",
    description: "Strip softness and rewrite in a direct, declarative form.",
    guidance: "1. Remove weak words.\\n2. Shorten the sentence.\\n3. State the core claim without apology."
  };
  rewriteTitle.textContent = data.title;
  rewriteDescription.textContent = data.description;
  rewriteGuidance.textContent = data.guidance;
  rewriteOverlay.classList.remove("hidden");
});

rewriteCloseBtn.addEventListener("click", () => {
  rewriteOverlay.classList.add("hidden");
});

rewriteOverlay.addEventListener("click", (e) => {
  if (e.target === rewriteOverlay) {
    rewriteOverlay.classList.add("hidden");
  }
});

if (modeSelect) {
  modeSelect.addEventListener("change", () => {
    analyzeText();
  });
}

// Initial
analyzeText();
