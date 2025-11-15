
// shared/utils.js
// Tiny text utilities reused across tools. No external dependencies.

const TextUtils = (() => {
  const sentenceSplitRegex = /(?<=[.!?])\s+(?=[A-Z0-9"'])/g;

  const stopwords = new Set([
    "a","an","the","and","or","but","if","then","else","when","while","of","for","to",
    "in","on","at","by","with","from","up","down","into","over","after","before",
    "is","am","are","was","were","be","been","being","i","you","he","she","it","we",
    "they","them","this","that","these","those","there","here","as","so","than",
    "too","very","can","could","should","would","may","might","will","just","really",
    "about","also","only","even","not","no","yes","do","does","did","have","has",
    "had","some","any","more","most","such"
  ]);

  const glueWords = [
    "very","really","just","that","sort of","kind of","maybe","perhaps","quite",
    "rather","seems","seemed","actually","literally","basically","probably","perhaps",
    "somewhat","somehow"
  ];

  const crutchWords = [
    "just","really","very","actually","literally","maybe","kind of","sort of","honestly",
    "probably","perhaps","like","definitely","basically","pretty","quite","rather"
  ];

  function normalizeWhitespace(text) {
    return text.replace(/\s+/g, " ").trim();
  }

  function splitSentences(text) {
    const cleaned = normalizeWhitespace(text);
    if (!cleaned) return [];
    const rough = cleaned.split(sentenceSplitRegex).map(s => s.trim()).filter(Boolean);
    return rough;
  }

  function splitWords(text) {
    const cleaned = text.toLowerCase().replace(/[^a-z0-9\s']/g, " ");
    const parts = cleaned.split(/\s+/).filter(Boolean);
    return parts;
  }

  function countSyllables(word) {
    const cleaned = word.toLowerCase().replace(/[^a-z]/g, "");
    if (!cleaned) return 0;
    if (cleaned.length <= 3) return 1;
    let w = cleaned.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/i, "");
    w = w.replace(/^y/, "");
    const matches = w.match(/[aeiouy]{1,2}/g);
    return matches ? matches.length : 1;
  }

  function getTextStats(text) {
    const sentences = splitSentences(text);
    const words = splitWords(text);
    const wordCount = words.length;
    const sentenceCount = sentences.length || (wordCount ? 1 : 0);
    let syllables = 0;
    for (const w of words) syllables += countSyllables(w);
    const avgSentenceLength = sentenceCount ? wordCount / sentenceCount : 0;
    const avgSyllablesPerWord = wordCount ? syllables / wordCount : 0;

    const freqMap = new Map();
    for (const w of words) {
      freqMap.set(w, (freqMap.get(w) || 0) + 1);
    }

    let lexical = 0;
    for (const w of words) {
      if (!stopwords.has(w)) lexical += 1;
    }
    const lexicalDensity = wordCount ? (lexical / wordCount) : 0;

    return {
      sentences,
      words,
      wordCount,
      sentenceCount,
      syllables,
      avgSentenceLength,
      avgSyllablesPerWord,
      freqMap,
      lexicalDensity
    };
  }

  function computeReadability(text) {
    const stats = getTextStats(text);
    const { wordCount, sentenceCount, syllables } = stats;
    if (!wordCount || !sentenceCount) {
      return {
        fleschReadingEase: null,
        fleschKincaidGrade: null,
        ...stats
      };
    }
    const ASL = wordCount / sentenceCount;
    const ASW = syllables / wordCount;

    const FRE = 206.835 - (1.015 * ASL) - (84.6 * ASW);
    const FKGL = (0.39 * ASL) + (11.8 * ASW) - 15.59;

    return {
      fleschReadingEase: FRE,
      fleschKincaidGrade: FKGL,
      ...stats
    };
  }

  function sortedFrequencies(freqMap) {
    return Array.from(freqMap.entries())
      .sort((a, b) => b[1] - a[1]);
  }

  function isStopword(w) {
    return stopwords.has(w.toLowerCase());
  }

  return {
    getTextStats,
    computeReadability,
    sortedFrequencies,
    glueWords,
    crutchWords,
    isStopword
  };
})();
