// Author Comparator · Local Style Lab
// All logic is in this single file. No external dependencies. No tracking.
// Seed signature: made for Luke / Seed Engineer Lab.

const defaultAuthors = [
  {
    id: "marquez",
    name: "Gabriel García Márquez",
    tag: "magical realism · lyrical",
    description: "Magical realism blending ordinary and fantastical; lush imagery, long lyrical sentences, deep nostalgia.",
    example: "The world was so recent that many things lacked names, and in order to indicate them, it was necessary to point.",
    features: {
      avgSentenceLength: 32,
      adverbRatio: 0.06,
      dialogueRatio: 0.18,
      abstractRatio: 0.16,
      typeTokenRatio: 0.55
    },
    tags: ["magical realism", "latin american", "lyrical", "imagistic", "nostalgic"]
  },
  {
    id: "woolf",
    name: "Virginia Woolf",
    tag: "stream of consciousness",
    description: "Innovative stream-of-consciousness; interiority, sensory detail, long fluid sentences that weave past and present.",
    example: "What a lark! What a plunge! For so it always seemed to her when, with a little squeak of the hinges, which she could hear now, she burst open the French windows and plunged at Bourton into the open air.",
    features: {
      avgSentenceLength: 30,
      adverbRatio: 0.07,
      dialogueRatio: 0.12,
      abstractRatio: 0.18,
      typeTokenRatio: 0.58
    },
    tags: ["modernist", "interiority", "fluid", "introspective"]
  },
  {
    id: "hemingway",
    name: "Ernest Hemingway",
    tag: "iceberg minimalism",
    description: "Short, simple sentences; understatement and subtext; concrete language and strong dialogue.",
    example: "The world breaks everyone and afterward many are strong at the broken places.",
    features: {
      avgSentenceLength: 11,
      adverbRatio: 0.01,
      dialogueRatio: 0.45,
      abstractRatio: 0.08,
      typeTokenRatio: 0.42
    },
    tags: ["minimalist", "plain", "dialogue-heavy", "understated"]
  },
  {
    id: "morrison",
    name: "Toni Morrison",
    tag: "lyrical gravity",
    description: "Lyrical, image-rich prose rooted in Black experience; symbolism, emotional depth, and haunted histories.",
    example: "She is a friend of my mind. She gather me, man. The pieces I am, she gather them and give them back to me in all the right order.",
    features: {
      avgSentenceLength: 24,
      adverbRatio: 0.05,
      dialogueRatio: 0.26,
      abstractRatio: 0.2,
      typeTokenRatio: 0.6
    },
    tags: ["lyrical", "symbolic", "historical", "emotional"]
  },
  {
    id: "murakami",
    name: "Haruki Murakami",
    tag: "quiet surrealism",
    description: "Blends mundane life with surreal events; detached, introspective tone with clean, understated prose.",
    example: "I have this strange feeling that I’m not myself anymore. It’s hard to put into words, but I guess it’s like I was fast asleep, and someone came, disassembled me, and hurriedly put me back together again.",
    features: {
      avgSentenceLength: 20,
      adverbRatio: 0.04,
      dialogueRatio: 0.25,
      abstractRatio: 0.16,
      typeTokenRatio: 0.5
    },
    tags: ["surreal", "introspective", "cool", "dislocated"]
  },
  {
    id: "bukowski",
    name: "Charles Bukowski",
    tag: "raw & abrasive",
    description: "Raw, gritty, stripped-down language; dark humour and self-loathing; ordinary life, booze, failure.",
    example: "I never met another man I’d rather be. And even if that’s a delusion, it’s a lucky one.",
    features: {
      avgSentenceLength: 13,
      adverbRatio: 0.02,
      dialogueRatio: 0.35,
      abstractRatio: 0.08,
      typeTokenRatio: 0.38
    },
    tags: ["raw", "colloquial", "misanthropic", "autobiographical"]
  },
  {
    id: "austen",
    name: "Jane Austen",
    tag: "wry social precision",
    description: "Wit, irony, and social commentary; precise syntax and fine-grained observation of manners.",
    example: "Vanity and pride are different things, though the words are often used synonymously. A person may be proud without being vain.",
    features: {
      avgSentenceLength: 27,
      adverbRatio: 0.05,
      dialogueRatio: 0.38,
      abstractRatio: 0.18,
      typeTokenRatio: 0.55
    },
    tags: ["witty", "social", "elegant", "ironic"]
  },
  {
    id: "kafka",
    name: "Franz Kafka",
    tag: "existential bureaucracy",
    description: "Precise prose about absurd, oppressive systems; atmosphere of guilt, shame, and alienation.",
    example: "It was as if the shame of it should outlive him.",
    features: {
      avgSentenceLength: 23,
      adverbRatio: 0.03,
      dialogueRatio: 0.14,
      abstractRatio: 0.22,
      typeTokenRatio: 0.52
    },
    tags: ["surreal", "bureaucratic", "claustrophobic", "existential"]
  },
  {
    id: "borges",
    name: "Jorge Luis Borges",
    tag: "labyrinthine intellect",
    description: "Concise, philosophical stories; metafictional games with time, identity, and infinity.",
    example: "The universe (which others call the Library) is composed of an indefinite, perhaps infinite, number of hexagonal galleries.",
    features: {
      avgSentenceLength: 22,
      adverbRatio: 0.03,
      dialogueRatio: 0.05,
      abstractRatio: 0.28,
      typeTokenRatio: 0.62
    },
    tags: ["philosophical", "metafiction", "labyrinth", "conceptual"]
  },
  {
    id: "angelou",
    name: "Maya Angelou",
    tag: "lyrical resilience",
    description: "Lyrical, rhythmic prose blending poetry and narrative; resilience, dignity, and uplift from pain.",
    example: "You may not control all the events that happen to you, but you can decide not to be reduced by them.",
    features: {
      avgSentenceLength: 20,
      adverbRatio: 0.05,
      dialogueRatio: 0.18,
      abstractRatio: 0.24,
      typeTokenRatio: 0.56
    },
    tags: ["memoir", "lyrical", "dignity", "resilient"]
  },
  {
    id: "faulkner",
    name: "William Faulkner",
    tag: "dense southern sprawl",
    description: "Long, intricate sentences; multiple viewpoints and tangled Southern histories.",
    example: "My mother is a fish.",
    features: {
      avgSentenceLength: 34,
      adverbRatio: 0.04,
      dialogueRatio: 0.22,
      abstractRatio: 0.2,
      typeTokenRatio: 0.6
    },
    tags: ["southern gothic", "dense", "non-linear", "polyphonic"]
  },
  {
    id: "wharton",
    name: "Edith Wharton",
    tag: "elegant social critique",
    description: "Elegant prose dissecting upper-class society and constrained desire.",
    example: "Each time you happen to me all over again.",
    features: {
      avgSentenceLength: 26,
      adverbRatio: 0.05,
      dialogueRatio: 0.32,
      abstractRatio: 0.21,
      typeTokenRatio: 0.55
    },
    tags: ["elegant", "social critique", "romantic tension"]
  },
  {
    id: "mishima",
    name: "Yukio Mishima",
    tag: "aesthetic violence",
    description: "Precise, poetic prose; intense attention to beauty, ritual, and death.",
    example: "The air of the temple was laden with the fragrance of flowers, and the graves, laid out on the mountain slopes like gardens of stone, lay quietly under the haze.",
    features: {
      avgSentenceLength: 24,
      adverbRatio: 0.04,
      dialogueRatio: 0.16,
      abstractRatio: 0.18,
      typeTokenRatio: 0.58
    },
    tags: ["aesthetic", "ritual", "violent", "poetic"]
  },
  {
    id: "dostoevsky",
    name: "Fyodor Dostoevsky",
    tag: "moral vertigo",
    description: "Psychological depth and moral wrestling; intense interior debate and contradiction.",
    example: "Above all, don’t lie to yourself. The man who lies to himself and listens to his own lie comes to a point that he cannot distinguish the truth within him.",
    features: {
      avgSentenceLength: 28,
      adverbRatio: 0.04,
      dialogueRatio: 0.3,
      abstractRatio: 0.26,
      typeTokenRatio: 0.58
    },
    tags: ["psychological", "religious", "philosophical", "tormented"]
  },
  {
    id: "capote",
    name: "Truman Capote",
    tag: "reportorial lushness",
    description: "Journalistic detail braided with literary style; close, cinematic scenes and atmosphere.",
    example: "The village of Holcomb stands on the high wheat plains of western Kansas, a lonesome area that other Kansans call ‘out there.’",
    features: {
      avgSentenceLength: 20,
      adverbRatio: 0.04,
      dialogueRatio: 0.22,
      abstractRatio: 0.18,
      typeTokenRatio: 0.54
    },
    tags: ["reportage", "cinematic", "precise", "true crime"]
  }
];

const ABSTRACT_WORDS = [
  "truth","morality","society","justice","freedom","power","guilt","shame",
  "beauty","death","life","meaning","identity","history","love","hope","despair",
  "memory","time","self","consciousness","sin","grace","evil","faith","violence"
];

const STORAGE_KEY = "authorComparator.customAuthors.v1";
const THEME_KEY = "authorComparator.theme.v1";

function getTextStats(text) {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (!cleaned) {
    return {
      wordCount: 0,
      sentenceCount: 0,
      avgSentenceLength: 0,
      adverbCount: 0,
      adverbRatio: 0,
      abstractCount: 0,
      abstractRatio: 0,
      typeTokenRatio: 0,
      dialogueRatio: 0
    };
  }

  const words = cleaned.toLowerCase().match(/[a-zA-Z’']+/g) || [];
  const wordCount = words.length;

  const sentences = cleaned.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);
  const sentenceCount = sentences.length || 1;

  const avgSentenceLength = wordCount / sentenceCount;

  const adverbCount = words.filter(w => w.endsWith("ly")).length;
  const adverbRatio = adverbCount / wordCount;

  const abstractCount = words.filter(w => ABSTRACT_WORDS.includes(w)).length;
  const abstractRatio = abstractCount / wordCount;

  const uniqueWords = new Set(words);
  const typeTokenRatio = uniqueWords.size / wordCount;

  const dialogueSentences = sentences.filter(s => /["“”']/.test(s)).length;
  const dialogueRatio = dialogueSentences / sentenceCount;

  return {
    wordCount,
    sentenceCount,
    avgSentenceLength,
    adverbCount,
    adverbRatio,
    abstractCount,
    abstractRatio,
    typeTokenRatio,
    dialogueRatio
  };
}

function computeSimilarity(textStats, author) {
  const f = author.features;
  const t = textStats;

  if (t.wordCount === 0) return 0;

  function diff(val, target, scale) {
    return Math.abs(val - target) / scale;
  }

  let totalDiff =
    diff(t.avgSentenceLength, f.avgSentenceLength, 25) +
    diff(t.adverbRatio, f.adverbRatio, 0.15) +
    diff(t.dialogueRatio, f.dialogueRatio, 0.6) +
    diff(t.abstractRatio, f.abstractRatio, 0.2) +
    diff(t.typeTokenRatio, f.typeTokenRatio, 0.4);

  const score = Math.max(0, 100 - totalDiff * 32);
  return Math.round(score);
}

function loadCustomAuthors() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr;
  } catch (e) {
    console.warn("Failed to parse custom authors", e);
    return [];
  }
}

function saveCustomAuthors(authors) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authors));
  } catch (e) {
    console.warn("Failed to save custom authors", e);
  }
}

function renderAuthorList(authors) {
  const listEl = document.getElementById("authorList");
  listEl.innerHTML = "";

  if (!authors.length) {
    listEl.innerHTML = '<div class="muted" style="padding:8px 10px;font-size:0.8rem;">No authors found.</div>';
    return;
  }

  authors.forEach(author => {
    const row = document.createElement("div");
    row.className = "author-row";
    row.dataset.id = author.id;

    const left = document.createElement("div");
    left.className = "author-name";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "author-checkbox";
    checkbox.dataset.id = author.id;

    const name = document.createElement("span");
    name.textContent = author.name;

    const tagline = document.createElement("span");
    tagline.className = "tagline";
    tagline.textContent = author.tag;

    left.appendChild(checkbox);
    left.appendChild(name);
    left.appendChild(tagline);

    const scoreSpan = document.createElement("span");
    scoreSpan.className = "score-pill weak";
    scoreSpan.textContent = "–";

    row.appendChild(left);
    row.appendChild(scoreSpan);

    row.addEventListener("click", (e) => {
      if (e.target.tagName.toLowerCase() === "input") return;
      checkbox.checked = !checkbox.checked;
    });

    listEl.appendChild(row);
  });
}

function getAllAuthors() {
  return [...defaultAuthors, ...loadCustomAuthors()];
}

function refreshAuthorList() {
  const filterValue = (document.getElementById("authorFilter").value || "").toLowerCase();
  const all = getAllAuthors();
  const filtered = all.filter(a => {
    if (!filterValue) return true;
    return (
      a.name.toLowerCase().includes(filterValue) ||
      (a.description && a.description.toLowerCase().includes(filterValue)) ||
      (a.tags && a.tags.some(t => t.toLowerCase().includes(filterValue)))
    );
  });
  renderAuthorList(filtered);
}

function getSelectedAuthorIds() {
  const checkboxes = document.querySelectorAll(".author-checkbox");
  const ids = [];
  checkboxes.forEach(cb => {
    if (cb.checked) {
      ids.push(cb.dataset.id);
    }
  });
  return ids;
}

function analyzeText() {
  const text = document.getElementById("userText").value;
  const stats = getTextStats(text);
  updateEditorStats(stats);

  const selectedIds = getSelectedAuthorIds();
  const outputEl = document.getElementById("authorCards");
  const globalMetricsEl = document.getElementById("globalMetrics");

  globalMetricsEl.innerHTML = "";
  outputEl.innerHTML = "";

  if (!text.trim()) {
    outputEl.innerHTML = '<p class="muted">Add some text first, then hit Analyze.</p>';
    return;
  }

  globalMetricsEl.appendChild(makeMetricPill(`Words: ${stats.wordCount}`));
  globalMetricsEl.appendChild(makeMetricPill(`Sentences: ${stats.sentenceCount}`));
  globalMetricsEl.appendChild(makeMetricPill(`Avg length: ${stats.avgSentenceLength.toFixed(1)}`));
  globalMetricsEl.appendChild(makeMetricPill(`Adverbs: ${stats.adverbCount} (${(stats.adverbRatio * 100).toFixed(1)}%)`));
  globalMetricsEl.appendChild(makeMetricPill(`Abstract words: ${stats.abstractCount} (${(stats.abstractRatio * 100).toFixed(1)}%)`));
  globalMetricsEl.appendChild(makeMetricPill(`Dialogue sentences: ${(stats.dialogueRatio * 100).toFixed(0)}%`));
  globalMetricsEl.appendChild(makeMetricPill(`Lexical richness (TTR): ${(stats.typeTokenRatio * 100).toFixed(1)}%`));

  const allAuthors = getAllAuthors();
  const selected = selectedIds.length
    ? allAuthors.filter(a => selectedIds.includes(a.id))
    : allAuthors;

  if (!selected.length) {
    outputEl.innerHTML = '<p class="muted">No authors selected. Either pick some from the list, or leave them all unchecked to compare against the entire set.</p>';
    return;
  }

  const scores = selected.map(author => {
    return {
      author,
      score: computeSimilarity(stats, author)
    };
  }).sort((a, b) => b.score - a.score);

  // update small scores in list
  const rows = document.querySelectorAll(".author-row");
  rows.forEach(row => {
    const id = row.dataset.id;
    const pill = row.querySelector(".score-pill");
    const match = scores.find(s => s.author.id === id);
    if (!match) {
      pill.textContent = "–";
      pill.classList.remove("strong");
      pill.classList.add("weak");
    } else {
      pill.textContent = `${match.score}`;
      pill.classList.toggle("strong", match.score >= 60);
      pill.classList.toggle("weak", match.score < 60);
    }
  });

  scores.forEach((entry, index) => {
    const card = document.createElement("div");
    card.className = "author-card";

    const header = document.createElement("div");
    header.className = "author-card-header";

    const h4 = document.createElement("h4");
    h4.textContent = entry.author.name;

    const sim = document.createElement("div");
    sim.className = "sim";
    sim.textContent = `${entry.score}/100`;

    header.appendChild(h4);
    header.appendChild(sim);

    card.appendChild(header);

    const desc = document.createElement("p");
    desc.className = "tiny";
    desc.textContent = entry.author.description;
    card.appendChild(desc);

    if (entry.author.example) {
      const quote = document.createElement("blockquote");
      quote.textContent = entry.author.example;
      card.appendChild(quote);
    }

    const diffNote = document.createElement("p");
    diffNote.className = "tiny";
    diffNote.innerHTML = makeDiffSummary(stats, entry.author);
    card.appendChild(diffNote);

    const badgeRow = document.createElement("div");
    badgeRow.className = "badge-row";

    const topBadge = document.createElement("span");
    topBadge.className = "mini-badge hot";
    topBadge.textContent = index === 0 ? "Closest match" : "Secondary match";
    badgeRow.appendChild(topBadge);

    (entry.author.tags || []).slice(0, 3).forEach(tag => {
      const b = document.createElement("span");
      b.className = "mini-badge";
      b.textContent = tag;
      badgeRow.appendChild(b);
    });

    card.appendChild(badgeRow);

    outputEl.appendChild(card);
  });
}

function makeDiffSummary(stats, author) {
  const f = author.features;
  const t = stats;
  const parts = [];

  function describeDiff(label, val, target, unit) {
    const delta = val - target;
    const abs = Math.abs(delta);
    if (abs < (unit === "words" ? 3 : 0.03)) return;
    const moreLess = delta > 0 ? "more" : "less";
    const u = unit === "words" ? "words per sentence" : unit;
    parts.push(`${label}: you tend to use ${moreLess} ${u} than ${author.name}.`);
  }

  describeDiff("Sentence length", t.avgSentenceLength, f.avgSentenceLength, "words");
  describeDiff("Adverbs", t.adverbRatio, f.adverbRatio, "adverbs");
  describeDiff("Dialogue", t.dialogueRatio, f.dialogueRatio, "dialogue");
  describeDiff("Abstraction", t.abstractRatio, f.abstractRatio, "abstract terms");
  describeDiff("Lexical range", t.typeTokenRatio, f.typeTokenRatio, "variety");

  if (!parts.length) {
    return `Your metrics sit close to this author’s typical ranges — at least on the surface level of rhythm and lexical patterning.`;
  }

  return parts.join(" ");
}

function makeMetricPill(text) {
  const span = document.createElement("span");
  span.className = "metric-pill";
  span.textContent = text;
  return span;
}

function updateEditorStats(stats) {
  const statsEl = document.getElementById("editorStats");
  statsEl.innerHTML = "";
  const items = [
    `Words: ${stats.wordCount}`,
    `Sentences: ${stats.sentenceCount}`,
    `Avg sentence length: ${stats.avgSentenceLength.toFixed(1)}`,
    `Adverbs (-ly): ${stats.adverbCount}`
  ];
  items.forEach(t => {
    const span = document.createElement("span");
    span.textContent = t;
    statsEl.appendChild(span);
  });
}

function attachEventHandlers() {
  const textarea = document.getElementById("userText");
  textarea.addEventListener("input", () => {
    const stats = getTextStats(textarea.value);
    updateEditorStats(stats);
  });

  document.getElementById("analyzeBtn").addEventListener("click", analyzeText);

  document.getElementById("sampleBtn").addEventListener("click", () => {
    const sample = `The bar had been closing for ten years. At least that’s how it felt most nights: the same cracked neon sign humming like a dying insect, the same chipped glasses lined up like bad teeth, the same men permanently tilted toward defeat. Outside, the city made its usual promises. Inside, nobody believed in them anymore.\n\nI watched the door the way some people watch horizons. It was a stupid habit. Nothing good ever walked in and nothing good ever left, but you still stared, just in case the universe had made some clerical error and decided to send you a reprieve. It never did.`;
    textarea.value = sample;
    const stats = getTextStats(sample);
    updateEditorStats(stats);
  });

  document.getElementById("clearBtn").addEventListener("click", () => {
    textarea.value = "";
    updateEditorStats(getTextStats(""));
    document.getElementById("authorCards").innerHTML = '<p class="muted">Write some text and click Analyze to see how it stacks up against your chosen authors.</p>';
    document.getElementById("globalMetrics").innerHTML = "";
  });

  document.getElementById("authorFilter").addEventListener("input", refreshAuthorList);

  document.getElementById("selectAllBtn").addEventListener("click", () => {
    document.querySelectorAll(".author-checkbox").forEach(cb => cb.checked = true);
  });

  document.getElementById("clearSelectionBtn").addEventListener("click", () => {
    document.querySelectorAll(".author-checkbox").forEach(cb => cb.checked = false);
  });

  document.getElementById("saveAuthorBtn").addEventListener("click", saveNewAuthor);

  const themeToggle = document.getElementById("themeToggle");
  themeToggle.addEventListener("click", toggleTheme);
}

function saveNewAuthor() {
  const nameEl = document.getElementById("newAuthorName");
  const descEl = document.getElementById("newAuthorDesc");
  const sampleEl = document.getElementById("newAuthorSample");
  const avgLenEl = document.getElementById("newAvgLen");
  const advEl = document.getElementById("newAdverbRatio");
  const dialogEl = document.getElementById("newDialogRatio");
  const absEl = document.getElementById("newAbstractRatio");
  const lexEl = document.getElementById("newLexicon");
  const statusEl = document.getElementById("authorSaveStatus");

  const name = nameEl.value.trim();
  if (!name) {
    statusEl.textContent = "Name is required.";
    statusEl.classList.add("danger-text");
    return;
  }

  const id = "custom_" + name.toLowerCase().replace(/[^a-z0-9]+/g, "_");

  const avgSentenceLength = parseFloat(avgLenEl.value) || 20;
  const adverbRatio = parseFloat(advEl.value) || 0.04;
  const dialogueRatio = parseFloat(dialogEl.value) || 0.2;
  const abstractRatio = parseFloat(absEl.value) || 0.18;
  const typeTokenRatio = 0.5;

  const lexicon = (lexEl.value || "")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

  const customAuthors = loadCustomAuthors();
  const existingIndex = customAuthors.findIndex(a => a.id === id);

  const newAuthor = {
    id,
    name,
    tag: "custom",
    description: descEl.value.trim() || "Custom author profile.",
    example: sampleEl.value.trim(),
    features: {
      avgSentenceLength,
      adverbRatio,
      dialogueRatio,
      abstractRatio,
      typeTokenRatio
    },
    tags: ["custom", ...lexicon]
  };

  if (existingIndex >= 0) {
    customAuthors[existingIndex] = newAuthor;
  } else {
    customAuthors.push(newAuthor);
  }

  saveCustomAuthors(customAuthors);
  refreshAuthorList();

  statusEl.textContent = "Saved locally. This author will be available next time you open this file in this browser.";
  statusEl.classList.remove("danger-text");

  nameEl.value = "";
  descEl.value = "";
  sampleEl.value = "";
  avgLenEl.value = "";
  advEl.value = "";
  dialogEl.value = "";
  absEl.value = "";
  lexEl.value = "";
}

function applyStoredTheme() {
  let theme = "dark";
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") theme = saved;
  } catch (e) {}

  document.body.setAttribute("data-theme", theme);
}

function toggleTheme() {
  const current = document.body.getAttribute("data-theme") || "dark";
  const next = current === "dark" ? "light" : "dark";
  document.body.setAttribute("data-theme", next);
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch (e) {}
}

document.addEventListener("DOMContentLoaded", () => {
  applyStoredTheme();
  refreshAuthorList();
  attachEventHandlers();
  updateEditorStats(getTextStats(""));
});
