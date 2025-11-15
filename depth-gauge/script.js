
(function () {
  const textarea = document.getElementById('inputText');
  const analyzeBtn = document.getElementById('analyzeBtn');
  const wordCountEl = document.getElementById('wordCount');

  const depthScoreValue = document.getElementById('depthScoreValue');
  const depthBarFill = document.getElementById('depthBarFill');
  const depthZone = document.getElementById('depthZone');
  const depthSummary = document.getElementById('depthSummary');

  const abstractionsCountEl = document.getElementById('abstractionsCount');
  const negationsCountEl = document.getElementById('negationsCount');
  const paradoxCountEl = document.getElementById('paradoxCount');
  const existentialCountEl = document.getElementById('existentialCount');
  const bleakMetaphorCountEl = document.getElementById('bleakMetaphorCount');
  const contrastCountEl = document.getElementById('contrastCount');

  const abstractionRatioEl = document.getElementById('abstractionRatio');
  const negationRatioEl = document.getElementById('negationRatio');
  const existentialRatioEl = document.getElementById('existentialRatio');
  const metaphorDensityEl = document.getElementById('metaphorDensity');
  const contrastDensityEl = document.getElementById('contrastDensity');
  const coldnessRatioEl = document.getElementById('coldnessRatio');
  const emotionRatioEl = document.getElementById('emotionRatio');

  const warningsList = document.getElementById('warningsList');
  const leaksList = document.getElementById('leaksList');
  const sentenceList = document.getElementById('sentenceList');
  const sentenceCountEl = document.getElementById('sentenceCount');

  const themeToggle = document.getElementById('themeToggle');
  const modeSelect = document.getElementById('modeSelect');

  // Lexical lists
  const abstractions = [
    'existence', 'meaning', 'truth', 'void', 'self', 'being', 'consciousness', 'inevitability',
    'ephemera', 'identity', 'morality', 'nothingness', 'essence', 'purpose', 'freedom',
    'absurdity', 'destiny', 'nihilism', 'choice', 'fate', 'time', 'infinity'
  ];

  const existential = [
    'void', 'futility', 'absurd', 'entropy', 'collapse', 'decay', 'dread', 'inevitable',
    'alienation', 'desolation', 'meaningless', 'meaninglessness', 'nothingness',
    'emptiness', 'hollow', 'ruin', 'ruined', 'doomed', 'fatal', 'doom', 'pointless',
    'hopeless', 'abandonment', 'annihilation', 'self-annihilation', 'oblivion',
    'catastrophe', 'catastrophic', 'apathy', 'despair', 'wasteland'
  ];

  const bleakFieldWords = [
    'dark', 'darkness', 'shadow', 'shadows', 'abyss', 'pit', 'grave', 'ruin', 'ruins',
    'rot', 'rotting', 'ash', 'ashes', 'dust', 'cold', 'knife', 'knives', 'blood',
    'bleeding', 'void', 'dead', 'death', 'decay', 'concrete', 'machine', 'machinery',
    'rust', 'broken', 'fracture', 'fractured', 'ghost', 'ghosts', 'emptiness'
  ];

  const negations = [
    'not', 'no', 'never', 'nothing', 'nowhere', 'without', 'none', 'neither', 'nor',
    'cannot', "can't", "dont", "don't", "isnt", "isn't", "wasnt", "wasn't",
    "werent", "weren't", "wont", "won't", "shouldnt", "shouldn't", "couldnt",
    "couldn't", "didnt", "didn't", "doesnt", "doesn't", "hasnt", "hasn't",
    "havent", "haven't", "hadnt", "hadn't"
  ];

  const contrastPairs = [
    ['inside', 'outside'],
    ['light', 'dark'],
    ['silence', 'noise'],
    ['order', 'chaos'],
    ['self', 'world'],
    ['human', 'machine'],
    ['mind', 'body'],
    ['here', 'elsewhere'],
    ['present', 'absent']
  ];

  const emotionalMarkers = [
    'i feel', "i can't", 'i cant', 'i hate', 'i love', 'i need', 'i want',
    'i miss', 'i wish', "i'm sorry", 'im sorry', "i'm scared", 'im scared'
  ];

  const emotionalIntensifiers = [
    'really', 'deeply', 'truly', 'honestly', 'so much', 'too much',
    'extremely', 'intensely', 'completely', 'totally', 'absolutely'
  ];

  const coldPronouns = ['one', 'a person', 'humans', 'humanity', 'people', 'the individual'];

  const leaks = [
    'kind of', 'kinda', 'sort of', 'pretty much', 'honestly', 'to be honest',
    'at the end of the day', 'like,', 'lol', 'haha', 'literally', 'basically',
    'whatever', 'you know', 'i guess'
  ];

  function tokenize(text) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s'-]/g, ' ')
      .split(/\s+/)
      .filter(Boolean);
  }

  function splitSentences(text) {
    return text
      .split(/(?<=[.!?])\s+/)
      .map(s => s.trim())
      .filter(Boolean);
  }

  function countOccurrences(tokens, list) {
    const set = new Set(list.map(w => w.toLowerCase()));
    let count = 0;
    for (const t of tokens) {
      if (set.has(t)) count++;
    }
    return count;
  }

  function sentenceHasPair(sentence, pair) {
    const s = sentence.toLowerCase();
    return s.includes(pair[0]) && s.includes(pair[1]);
  }

  function detectBleakClusters(sentences) {
    let clusterCount = 0;
    const lexSet = new Set(bleakFieldWords);
    for (const s of sentences) {
      const tokens = tokenize(s);
      let present = 0;
      for (const t of tokens) {
        if (lexSet.has(t)) present++;
      }
      if (present >= 2) clusterCount++;
    }
    return clusterCount;
  }

  function detectParadoxes(sentences) {
    const paradoxMarkers = [' yet ', ' but ', ' despite ', ' although '];
    let count = 0;
    sentences.forEach(s => {
      const lower = ' ' + s.toLowerCase() + ' ';
      if (paradoxMarkers.some(m => lower.includes(m))) {
        const tokens = tokenize(lower);
        const existentialHit = tokens.some(t => existential.includes(t));
        const bleakHit = tokens.some(t => bleakFieldWords.includes(t));
        if (existentialHit || bleakHit) count++;
      }
    });
    return count;
  }

  function detectContrastPairs(sentences) {
    let count = 0;
    sentences.forEach(s => {
      contrastPairs.forEach(pair => {
        if (sentenceHasPair(s, pair)) count++;
      });
    });
    return count;
  }

  function detectLeaks(text) {
    const lower = text.toLowerCase();
    const found = [];
    leaks.forEach(phrase => {
      if (lower.includes(phrase)) found.push(phrase);
    });
    return Array.from(new Set(found));
  }

  function detectEmotion(tokens, textLower) {
    let emotionHits = 0;
    emotionalMarkers.forEach(p => {
      if (textLower.includes(p)) emotionHits++;
    });
    emotionalIntensifiers.forEach(p => {
      if (textLower.includes(p)) emotionHits++;
    });
    return emotionHits;
  }

  function detectColdness(textLower) {
    let hits = 0;
    coldPronouns.forEach(p => {
      if (textLower.includes(p)) hits++;
    });
    return hits;
  }

  function computeDepthScore(stats, mode) {
    const {
      abstractionRatio,
      negationRatio,
      existentialRatio,
      metaphorDensity,
      contrastDensity,
      coldnessRatio,
      emotionRatio,
      paradoxDensity
    } = stats;

    let score = 0;
    const m = mode || 'writerly';

    if (m === 'writerly') {
      // Mode A – Writerly Depth: reward structure, paradox, contrast, abstraction
      score =
        abstractionRatio * 100 * 0.30 +
        existentialRatio * 100 * 0.15 +
        metaphorDensity * 25 * 0.15 +
        contrastDensity * 30 * 0.20 +
        paradoxDensity * 30 * 0.20 -
        emotionRatio * 100 * 0.05;
    } else if (m === 'existential') {
      // Mode B – Existential/Bleak: reward existential and bleak language
      score =
        existentialRatio * 100 * 0.35 +
        metaphorDensity * 25 * 0.20 +
        negationRatio * 100 * 0.15 +
        abstractionRatio * 100 * 0.10 +
        contrastDensity * 20 * 0.10 +
        coldnessRatio * 50 * 0.10 -
        emotionRatio * 100 * 0.10;
    } else {
      // Mode C – Hybrid: balanced
      score =
        existentialRatio * 100 * 0.25 +
        abstractionRatio * 100 * 0.20 +
        metaphorDensity * 25 * 0.15 +
        contrastDensity * 30 * 0.15 +
        paradoxDensity * 30 * 0.15 +
        negationRatio * 100 * 0.05 +
        coldnessRatio * 50 * 0.05 -
        emotionRatio * 100 * 0.10;
    }

    if (score < 0) score = 0;
    if (score > 100) score = 100;
    return score;
  }

  function depthZoneLabel(score) {
    if (score < 20) return 'Surface';
    if (score < 40) return 'Reflective';
    if (score < 60) return 'Darkly Observational';
    if (score < 80) return 'Existential';
    return 'Abyssal';
  }

  function summarizeDepth(score) {
    if (score < 20) {
      return 'Currently reading as mostly surface-level — consider adding tension, contradiction, or philosophical pressure.';
    } else if (score < 40) {
      return 'Mildly reflective. There are hints of depth but it still feels anchored in the everyday.';
    } else if (score < 60) {
      return 'Darkly observational. You’re dissecting the human mess with some distance and clarity.';
    } else if (score < 80) {
      return 'Existential territory. The text leans heavily into meaning, futility, and structural doubt.';
    }
    return 'Abyssal. This reads like a dispatch from the void — dense, bleak, and philosophically saturated.';
  }

  function renderWarnings(stats, leaksFound) {
    const {
      depthScore,
      abstractionRatio,
      existentialRatio,
      metaphorDensity,
      contrastDensity,
      emotionRatio
    } = stats;

    warningsList.innerHTML = '';

    function addWarning(text, subtle = false) {
      const li = document.createElement('li');
      li.textContent = text;
      if (subtle) li.classList.add('subtle');
      warningsList.appendChild(li);
    }

    if (depthScore < 15) {
      addWarning('Too shallow: mostly surface-level. Add tension, contradiction, or existential friction.');
    }

    if (abstractionRatio > 0.09 && metaphorDensity < 0.2 && contrastDensity < 0.15) {
      addWarning('Too abstract: drifting into conceptual fog. Anchor the ideas in concrete images or scenes.');
    }

    if (existentialRatio > 0.09) {
      addWarning('Too on-the-nose: heavy concentration of existential terms. Consider a subtler, oblique approach.');
    }

    if (emotionRatio > 0.06) {
      addWarning('Too emotional: confessional intensity is high. Restraint may increase philosophical sharpness.');
    }

    if (leaksFound.length > 0) {
      addWarning('Depth leaks detected: casual or cliché phrases are puncturing the mood.', true);
    }

    if (!warningsList.children.length) {
      const li = document.createElement('li');
      li.textContent = 'No major issues flagged. Tune manually according to your own taste for despair.';
      li.classList.add('subtle');
      warningsList.appendChild(li);
    }
  }

  function renderLeaks(leaksFound) {
    leaksList.innerHTML = '';
    if (!leaksFound.length) {
      const li = document.createElement('li');
      li.textContent = 'No obvious leaks detected.';
      leaksList.appendChild(li);
      return;
    }
    leaksFound.forEach(phrase => {
      const li = document.createElement('li');
      li.textContent = `“${phrase}”`;
      leaksList.appendChild(li);
    });
  }

  function renderSentences(sentences, tokensBySentence) {
    sentenceList.innerHTML = '';
    sentenceCountEl.textContent = `${sentences.length} sentence${sentences.length === 1 ? '' : 's'}`;

    const maxToShow = 40;
    const absSet = new Set(abstractions);
    const existSet = new Set(existential);
    const bleakSet = new Set(bleakFieldWords);
    const negSet = new Set(negations);

    sentences.slice(0, maxToShow).forEach((s, idx) => {
      const tokens = tokensBySentence[idx] || [];
      const tags = [];

      if (tokens.some(t => absSet.has(t))) tags.push('ABS');
      if (tokens.some(t => negSet.has(t))) tags.push('NEG');
      if (tokens.some(t => existSet.has(t))) tags.push('VOID');
      if (tokens.some(t => bleakSet.has(t))) tags.push('BLEAK');

      const lower = ' ' + s.toLowerCase() + ' ';
      if ([' yet ', ' but ', ' despite ', ' although '].some(m => lower.includes(m))) {
        tags.push('PARA');
      }
      contrastPairs.forEach(pair => {
        if (sentenceHasPair(s, pair)) tags.push('TENSION');
      });

      const row = document.createElement('div');
      row.className = 'sentence-row';

      const textDiv = document.createElement('div');
      textDiv.className = 'sentence-text';
      textDiv.textContent = s;
      row.appendChild(textDiv);

      if (tags.length) {
        const tagRow = document.createElement('div');
        tagRow.className = 'sentence-tags';
        Array.from(new Set(tags)).forEach(t => {
          const pill = document.createElement('span');
          pill.className = 'tag-pill';
          pill.textContent = t;
          tagRow.appendChild(pill);
        });
        row.appendChild(tagRow);
      }

      sentenceList.appendChild(row);
    });
  }

  function analyze() {
    const text = textarea.value || '';
    const trimmed = text.trim();

    const tokens = tokenize(trimmed);
    const totalWords = tokens.length || 1;
    wordCountEl.textContent = `${totalWords} word${totalWords === 1 ? '' : 's'}`;

    const sentences = splitSentences(trimmed);
    const tokensBySentence = sentences.map(s => tokenize(s));

    const abstractionCount = countOccurrences(tokens, abstractions);
    const negationCount = countOccurrences(tokens, negations);
    const existentialCount = countOccurrences(tokens, existential);
    const bleakClusters = detectBleakClusters(sentences);
    const paradoxCount = detectParadoxes(sentences);
    const contrastCount = detectContrastPairs(sentences);

    const textLower = trimmed.toLowerCase();
    const leaksFound = detectLeaks(textLower);
    const emotionHits = detectEmotion(tokens, textLower);
    const coldHits = detectColdness(textLower);

    const sentenceCount = sentences.length || 1;

    const abstractionRatio = abstractionCount / totalWords;
    const negationRatio = negationCount / totalWords;
    const existentialRatio = existentialCount / totalWords;
    const metaphorDensity = bleakClusters / sentenceCount;
    const contrastDensity = contrastCount / sentenceCount;
    const coldnessRatio = coldHits / sentenceCount;
    const emotionRatio = emotionHits / sentenceCount;
    const paradoxDensity = paradoxCount / sentenceCount;

    const depthScore = computeDepthScore({
      abstractionRatio,
      negationRatio,
      existentialRatio,
      metaphorDensity,
      contrastDensity,
      coldnessRatio,
      emotionRatio,
      paradoxDensity
    }, modeSelect ? modeSelect.value : 'writerly');

    // Update stats
    abstractionsCountEl.textContent = abstractionCount;
    negationsCountEl.textContent = negationCount;
    paradoxCountEl.textContent = paradoxCount;
    existentialCountEl.textContent = existentialCount;
    bleakMetaphorCountEl.textContent = bleakClusters;
    contrastCountEl.textContent = contrastCount;

    abstractionRatioEl.textContent = abstractionRatio.toFixed(2);
    negationRatioEl.textContent = negationRatio.toFixed(2);
    existentialRatioEl.textContent = existentialRatio.toFixed(2);
    metaphorDensityEl.textContent = metaphorDensity.toFixed(2);
    contrastDensityEl.textContent = contrastDensity.toFixed(2);
    coldnessRatioEl.textContent = coldnessRatio.toFixed(2);
    emotionRatioEl.textContent = emotionRatio.toFixed(2);

    // Depth meter
    depthScoreValue.textContent = Math.round(depthScore);
    depthBarFill.style.width = depthScore.toFixed(0) + '%';
    const zoneLabel = depthZoneLabel(depthScore);
    depthZone.textContent = zoneLabel;
    depthSummary.textContent = summarizeDepth(depthScore);

    renderWarnings({ depthScore, abstractionRatio, existentialRatio, metaphorDensity, contrastDensity, emotionRatio }, leaksFound);
    renderLeaks(leaksFound);
    renderSentences(sentences, tokensBySentence);
  }

  // Theme handling
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try {
      localStorage.setItem('depth-gauge-theme', next);
    } catch (e) {}
  }

  function initTheme() {
    let stored = null;
    try {
      stored = localStorage.getItem('depth-gauge-theme');
    } catch (e) {}
    if (stored === 'light' || stored === 'dark') {
      applyTheme(stored);
    } else {
      applyTheme('dark');
    }
  }

  // Events
  analyzeBtn.addEventListener('click', analyze);
  textarea.addEventListener('input', () => {
    const tokens = tokenize(textarea.value);
    const totalWords = tokens.length;
    wordCountEl.textContent = `${totalWords} word${totalWords === 1 ? '' : 's'}`;
  });
  themeToggle.addEventListener('click', toggleTheme);

  initTheme();
})();
