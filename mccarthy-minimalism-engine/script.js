// McCarthy Minimalism Engine
// Local-only heuristic analyzer. No AI. All in-browser.

(function () {
  const editor = document.getElementById('editor');
  const modeSelect = document.getElementById('modeSelect');
  const purityScoreLabel = document.getElementById('purityScoreLabel');
  const purityBarFill = document.getElementById('purityBarFill');
  const puritySentence = document.getElementById('puritySentence');

  const charCountEl = document.getElementById('charCount');
  const wordCountEl = document.getElementById('wordCount');
  const sentenceCountEl = document.getElementById('sentenceCount');

  const commaCountEl = document.getElementById('commaCount');
  const commaOveruseEl = document.getElementById('commaOveruse');
  const adjCountEl = document.getElementById('adjCount');
  const adjOverLimitEl = document.getElementById('adjOverLimit');
  const advCountEl = document.getElementById('advCount');
  const abstractCountEl = document.getElementById('abstractCount');
  const stripAdverbsBtn = document.getElementById('stripAdverbsBtn');

  const violationsList = document.getElementById('violationsList');
  const cadenceBarsEl = document.getElementById('cadenceBars');
  const avgSentenceLengthEl = document.getElementById('avgSentenceLength');
  const cadenceLabelEl = document.getElementById('cadenceLabel');

  const dialogueList = document.getElementById('dialogueList');
  const abstractList = document.getElementById('abstractList');
  const biblicalList = document.getElementById('biblicalList');

  const clearTextBtn = document.getElementById('clearTextBtn');
  const makeBiblicalBtn = document.getElementById('makeBiblicalBtn');

  const tabButtons = Array.from(document.querySelectorAll('.tab-btn'));
  const tabContents = {
    violations: document.getElementById('tab-violations'),
    cadence: document.getElementById('tab-cadence'),
    dialogue: document.getElementById('tab-dialogue'),
    lexicon: document.getElementById('tab-lexicon')
  };

  // Lexicons / heuristics
  const abstractNouns = [
    'truth', 'morality', 'society', 'justice', 'meaning', 'purpose',
    'identity', 'humanity', 'freedom', 'hope', 'despair', 'suffering',
    'redemption', 'virtue', 'sin', 'evil', 'good', 'love', 'hate',
    'faith', 'fate', 'destiny', 'order', 'chaos', 'consciousness',
    'ethics', 'values', 'culture', 'progress', 'civilization'
  ];

  const dialogueTags = [
    'said', 'asked', 'replied', 'whispered', 'shouted', 'yelled',
    'murmured', 'muttered', 'answered', 'cried', 'called', 'told'
  ];

  const biblicalMarkers = [
    'and he', 'and she', 'and they',
    'and the', 'and in that', 'and there was',
    'and it was', 'in the beginning', 'for he',
    'for they', 'for the',
    'unto him', 'unto them', 'in the dust',
    'in the darkness', 'in the west', 'in the east'
  ];

  const mccarthyWords = [
    'dust', 'ash', 'ruin', 'blood', 'horse', 'road',
    'darkness', 'desert', 'bone', 'sky', 'stone',
    'river', 'guns', 'border', 'dead', 'fire', 'cold'
  ];

  function splitSentences(text) {
    // Simple split on . ! ? preserving basic cleanliness
    const raw = text
      .replace(/([.!?])\s+/g, '$1|')
      .split('|')
      .map(s => s.trim())
      .filter(Boolean);
    return raw;
  }

  function countWords(sentence) {
    if (!sentence) return 0;
    const words = sentence
      .replace(/[^\w\s']/g, ' ')
      .split(/\s+/)
      .filter(Boolean);
    return words.length;
  }

  function getWords(text) {
    if (!text) return [];
    return text
      .toLowerCase()
      .replace(/[^\w\s']/g, ' ')
      .split(/\s+/)
      .filter(Boolean);
  }

  function isAdverb(word) {
    // Simple heuristic: -ly ending and not some common exceptions
    if (word.length <= 3) return false;
    if (['family', 'reply', 'supply'].includes(word)) return false;
    return word.endsWith('ly');
  }

  function isAdjective(word) {
    // Heuristic: common adjective suffixes
    const suffixes = [
      'ous', 'ive', 'able', 'ible', 'less', 'ful', 'al',
      'ic', 'ish', 'y', 'ary', 'ant', 'ent'
    ];
    if (word.length <= 4) return false;
    return suffixes.some(sfx => word.endsWith(sfx));
  }

  function analyzeText() {
    const text = editor.value || '';
    const sentences = splitSentences(text);
    const words = getWords(text);

    // Basic counts
    const chars = text.length;
    const wordCount = words.length;
    const sentenceCount = sentences.length || 0;

    charCountEl.textContent = chars + ' chars';
    wordCountEl.textContent = wordCount + ' words';
    sentenceCountEl.textContent = sentenceCount + (sentenceCount === 1 ? ' sentence' : ' sentences');

    // Commas
    const totalCommas = (text.match(/,/g) || []).length;
    let commaOveruse = 0;
    sentences.forEach(s => {
      const c = (s.match(/,/g) || []).length;
      if (c > 1) commaOveruse++;
    });

    // Adverbs & adjectives per sentence
    let totalAdverbs = 0;
    let totalAdjectives = 0;
    let adjectiveOverLimit = 0;

    sentences.forEach(s => {
      const sWords = getWords(s);
      let adjInSentence = 0;
      sWords.forEach(w => {
        if (isAdverb(w)) totalAdverbs++;
        if (isAdjective(w)) {
          totalAdjectives++;
          adjInSentence++;
        }
      });
      if (adjInSentence > 1) {
        adjectiveOverLimit++;
      }
    });

    // Abstract nouns
    const abstractFoundSet = new Set();
    words.forEach(w => {
      if (abstractNouns.includes(w)) {
        abstractFoundSet.add(w);
      }
    });

    // Dialogue and quotes
    const dialogueIssues = [];
    const hasQuotes = /["“”]/.test(text);
    if (hasQuotes) {
      dialogueIssues.push({
        type: 'Quotes',
        msg: 'Quotation marks detected. McCarthy typically omits them.'
      });
    }

    const hasEllipses = /\.\.\./.test(text);
    if (hasEllipses) {
      dialogueIssues.push({
        type: 'Ellipses',
        msg: 'Ellipses detected. These tend to feel modern and soft.'
      });
    }

    const tagHits = [];
    words.forEach(w => {
      if (dialogueTags.includes(w)) tagHits.push(w);
    });

    if (tagHits.length > 0) {
      dialogueIssues.push({
        type: 'Tags',
        msg: 'Dialogue tags like "' + Array.from(new Set(tagHits)).join(', ') + '" found. Consider reducing tags.'
      });
    }

    // Cadence analysis (sentence length buckets)
    const lengths = sentences.map(countWords).filter(n => n > 0);
    const avgLen = lengths.length
      ? Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length)
      : 0;

    let cadenceLabel = 'No sentences yet.';
    if (avgLen > 0 && avgLen <= 9) {
      cadenceLabel = 'Short, bare, Road-like.';
    } else if (avgLen >= 10 && avgLen <= 20) {
      cadenceLabel = 'Measured and austere.';
    } else if (avgLen > 20) {
      cadenceLabel = 'Long, wave-like, nearing Blood Meridian.';
    }

    // Biblical markers
    const biblicalFoundSet = new Set();
    const lowerText = text.toLowerCase();
    biblicalMarkers.forEach(phrase => {
      if (lowerText.includes(phrase)) {
        biblicalFoundSet.add(phrase);
      }
    });

    // McCarthy lexicon hints
    const mccarthyFoundSet = new Set();
    words.forEach(w => {
      if (mccarthyWords.includes(w)) {
        mccarthyFoundSet.add(w);
      }
    });

    // Purity index scoring
    const mode = modeSelect.value;

    let score = 100;
    score -= commaOveruse * 3;
    score -= totalAdverbs * 4;
    score -= abstractFoundSet.size * 5;
    score -= adjectiveOverLimit * 3;

    if (hasQuotes) score -= 10;
    if (hasEllipses) score -= 5;
    score -= tagHits.length * 1.5;

    if (avgLen > 0 && avgLen < 5) score -= 5; // too clipped
    if (avgLen > 35) score -= 5; // overly long trainwreck

    const abstractPenalty = abstractFoundSet.size;
    if (abstractPenalty > 3) score -= (abstractPenalty - 3) * 2;

    if (mode === 'blood') {
      if (avgLen < 15) score -= 5;
      if (biblicalFoundSet.size === 0) score -= 5;
    } else if (mode === 'road') {
      if (avgLen > 15) score -= 5;
      if (totalAdverbs > 0) score -= 3;
    } else if (mode === 'suttree') {
      if (avgLen < 8 || avgLen > 28) score -= 3;
    }

    score = Math.max(0, Math.min(100, Math.round(score)));

    // Update UI
    commaCountEl.textContent = totalCommas;
    commaOveruseEl.textContent = commaOveruse;
    adjCountEl.textContent = totalAdjectives;
    adjOverLimitEl.textContent = adjectiveOverLimit;
    advCountEl.textContent = totalAdverbs;
    abstractCountEl.textContent = abstractFoundSet.size;

    purityScoreLabel.textContent = score;
    purityBarFill.style.width = score + '%';

    purityBarFill.style.filter =
      score >= 85
        ? 'saturate(1.4)'
        : score >= 60
        ? 'saturate(1.1)'
        : 'saturate(0.9)';

    puritySentence.textContent = puritySentenceFromScore(score);

    // Violations list
    violationsList.innerHTML = '';
    function addViolation(tag, msg) {
      const li = document.createElement('li');
      const span = document.createElement('span');
      span.className = 'tag';
      span.textContent = tag.toUpperCase();
      li.appendChild(span);
      li.appendChild(document.createTextNode(msg));
      violationsList.appendChild(li);
    }

    if (commaOveruse > 0) {
      addViolation('comma', `${commaOveruse} sentence(s) use more than one comma. Consider splitting or simplifying.`);
    }
    if (adjectiveOverLimit > 0) {
      addViolation('adjectives', `${adjectiveOverLimit} sentence(s) exceed the 1-adjective rule.`);
    }
    if (totalAdverbs > 0) {
      addViolation('adverbs', `${totalAdverbs} adverb(s) detected. McCarthy prefers the deed, not the adverb.`);
    }
    if (abstractFoundSet.size > 0) {
      addViolation('abstract', `${abstractFoundSet.size} abstract noun(s) haunting the page.`);
    }
    if (hasQuotes) {
      addViolation('dialogue', 'Quotation marks detected. Strip them for McCarthy-style dialogue.');
    }
    if (hasEllipses) {
      addViolation('dialogue', 'Ellipses detected. These soften the edge of the line.');
    }
    if (tagHits.length > 0) {
      addViolation('tags', `Dialogue tags (${Array.from(new Set(tagHits)).join(', ')}) present. Consider cutting back.`);
    }
    if (violationsList.children.length === 0) {
      const li = document.createElement('li');
      li.textContent = 'No major violations detected by the current heuristics.';
      violationsList.appendChild(li);
    }

    // Cadence visualization
    cadenceBarsEl.innerHTML = '';
    lengths.forEach(len => {
      const bar = document.createElement('div');
      bar.className = 'cadence-bar';
      const fill = document.createElement('div');
      fill.classList.add('cadence-bar-fill');
      if (len <= 9) {
        fill.classList.add('short');
      } else if (len <= 20) {
        fill.classList.add('medium');
      } else {
        fill.classList.add('long');
      }
      bar.title = len + ' words';
      bar.appendChild(fill);
      cadenceBarsEl.appendChild(bar);
    });
    avgSentenceLengthEl.textContent = avgLen;
    cadenceLabelEl.textContent = cadenceLabel;

    // Dialogue tab details
    dialogueList.innerHTML = '';
    if (dialogueIssues.length === 0) {
      const li = document.createElement('li');
      li.textContent = 'No explicit dialogue issues detected.';
      dialogueList.appendChild(li);
    } else {
      dialogueIssues.forEach(issue => {
        const li = document.createElement('li');
        const span = document.createElement('span');
        span.className = 'tag';
        span.textContent = issue.type.toUpperCase();
        li.appendChild(span);
        li.appendChild(document.createTextNode(issue.msg));
        dialogueList.appendChild(li);
      });
    }

    // Lexicon pill lists
    abstractList.innerHTML = '';
    Array.from(abstractFoundSet).sort().forEach(w => {
      const li = document.createElement('li');
      li.textContent = w;
      abstractList.appendChild(li);
    });
    if (!abstractFoundSet.size) {
      const li = document.createElement('li');
      li.textContent = 'None detected.';
      abstractList.appendChild(li);
    }

    biblicalList.innerHTML = '';
    Array.from(biblicalFoundSet).sort().forEach(p => {
      const li = document.createElement('li');
      li.textContent = p;
      biblicalList.appendChild(li);
    });
    if (!biblicalFoundSet.size) {
      const li = document.createElement('li');
      li.textContent = 'No obvious biblical cadences detected.';
      biblicalList.appendChild(li);
    }
  }

  function puritySentenceFromScore(score) {
    if (score >= 90) {
      return 'Austere as bone in desert light.';
    } else if (score >= 75) {
      return 'The land is lean and the language nearly so.';
    } else if (score >= 60) {
      return 'Modern softness has crept into the prose.';
    } else if (score >= 40) {
      return 'The page is heavy with excess decoration.';
    } else if (score >= 20) {
      return 'This is not of McCarthy’s world yet.';
    } else {
      return 'The line has wandered far from the desert.';
    }
  }

  function stripAdverbs() {
    let text = editor.value || '';
    if (!text) return;

    const tokens = text.split(/(\b)/);
    const result = tokens.map(tok => {
      const lower = tok.toLowerCase();
      if (isAdverb(lower)) {
        return '';
      }
      return tok;
    }).join('');

    editor.value = result;
    analyzeText();
  }

  function makeSentenceMoreBiblical(sentence) {
    const trimmed = sentence.trim();
    if (!trimmed) return sentence;

    let s = trimmed.replace(/^[\"“”']+|[\"“”']+$/g, '').trim();

    s = s.replace(/^(he|she|they|it|the|a|an)\s+/i, '');
    s = s.charAt(0).toLowerCase() + s.slice(1);

    const starters = [
      'and he',
      'and she',
      'and they',
      'and the man',
      'and the child',
      'and in that place',
      'and in the dark'
    ];
    const chosen = starters[Math.floor(Math.random() * starters.length)];

    let result = chosen + ' ' + s;
    if (!/[.!?]$/.test(result)) {
      result += '.';
    }
    return result;
  }

  function applyMakeBiblical() {
    const text = editor.value || '';
    if (!text) return;

    let selection = '';
    const start = editor.selectionStart;
    const end = editor.selectionEnd;

    if (start !== end) {
      selection = text.slice(start, end);
    }

    if (!selection) {
      const sentences = splitSentences(text);
      if (!sentences.length) return;
      const last = sentences[sentences.length - 1];
      const biblical = makeSentenceMoreBiblical(last);

      const idx = text.lastIndexOf(last);
      if (idx !== -1) {
        const before = text.slice(0, idx);
        const after = text.slice(idx + last.length);
        editor.value = before + biblical + after;
      }
    } else {
      const biblical = makeSentenceMoreBiblical(selection);
      editor.setRangeText(biblical, start, end, 'end');
    }

    analyzeText();
  }

  // Tabs
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const tabName = btn.dataset.tab;
      Object.entries(tabContents).forEach(([name, el]) => {
        el.classList.toggle('hidden', name !== tabName);
      });
    });
  });

  // Events
  editor.addEventListener('input', () => {
    analyzeText();
  });

  modeSelect.addEventListener('change', () => {
    analyzeText();
  });

  stripAdverbsBtn.addEventListener('click', stripAdverbs);
  makeBiblicalBtn.addEventListener('click', applyMakeBiblical);

  clearTextBtn.addEventListener('click', () => {
    editor.value = '';
    analyzeText();
  });

  // Seed example text
  editor.value = 'He walked out into the ruined light and the road was empty but for the ash.\n\nThe sky was a dead vault and there were no birds there.';
  analyzeText();
})();
