
// rephrase-tool/app.js
// Rule-based rephrase helper: tone, length, light fluency fixes, optional sensory prompts.

(function() {
  const input = document.getElementById("input-text");
  const output = document.getElementById("output-text");
  const notes = document.getElementById("notes-text");

  const btnClear = document.getElementById("btn-clear");
  const btnRun = document.getElementById("btn-run");
  const btnCopy = document.getElementById("btn-copy");

  const selectTone = document.getElementById("select-tone");
  const selectLength = document.getElementById("select-length");
  const chkFluency = document.getElementById("chk-fluency");
  const chkSensory = document.getElementById("chk-sensory");

  function applySubstitutions(text, map) {
    let result = text;
    Object.keys(map).forEach(key => {
      const pattern = new RegExp("\\b" + key.replace(/ /g, "\\s+") + "\\b", "gi");
      result = result.replace(pattern, (m) => {
        // Preserve capitalization of first letter
        const replacement = map[key];
        if (!m) return replacement;
        if (m[0] === m[0].toUpperCase()) {
          return replacement.charAt(0).toUpperCase() + replacement.slice(1);
        }
        return replacement;
      });
    });
    return result;
  }

  function shorten(text) {
    // Remove hedges & filler phrases, compress some structures.
    const removeList = [
      "really",
      "very",
      "quite",
      "actually",
      "kind of",
      "sort of",
      "basically",
      "in fact",
      "just",
      "perhaps",
      "maybe"
    ];
    let result = text;
    removeList.forEach(w => {
      const re = new RegExp("\\b" + w.replace(/ /g, "\\s+") + "\\b", "gi");
      result = result.replace(re, "");
    });
    result = applySubstitutions(result, {
      "in order to": "to",
      "due to the fact that": "because",
      "for the purpose of": "to",
      "as a result of": "because"
    });
    // Collapse double spaces created.
    result = result.replace(/\s{2,}/g, " ");
    return result.trim();
  }

  function lengthen(text) {
    // Light padding: add softeners and small clarifications in a few places.
    // We try to not break meaning; this is intentionally gentle.
    let result = text;
    // Add small clarifiers after sentence beginnings occasionally.
    result = result.replace(/(\.\s+)([A-Z])/g, function(match, sep, letter) {
      // 50% chance to insert a soft clause
      if (Math.random() < 0.4) {
        const fillers = [
          " In many ways,",
          " In other words,",
          " In this context,",
          " In practical terms,"
        ];
        const filler = fillers[Math.floor(Math.random() * fillers.length)];
        return "." + filler + " " + letter;
      }
      return match;
    });
    return result;
  }

  function formalize(text) {
    const map = {
      "can't": "cannot",
      "won't": "will not",
      "don't": "do not",
      "doesn't": "does not",
      "didn't": "did not",
      "isn't": "is not",
      "aren't": "are not",
      "wasn't": "was not",
      "weren't": "were not",
      "couldn't": "could not",
      "shouldn't": "should not",
      "wouldn't": "would not",
      "i'm": "I am",
      "you're": "you are",
      "we're": "we are",
      "they're": "they are",
      "it's": "it is",
      "that's": "that is",
      "there's": "there is",
      "here's": "here is",
      "gonna": "going to",
      "wanna": "want to",
      "kinda": "somewhat",
      "sorta": "somewhat",
      "a lot": "a great deal",
      "stuff": "material",
      "things": "aspects",
      "kids": "children",
      "guy": "person",
      "bad": "poor",
      "good": "effective"
    };
    return applySubstitutions(text, map);
  }

  function informalize(text) {
    const map = {
      "cannot": "can't",
      "will not": "won't",
      "do not": "don't",
      "does not": "doesn't",
      "did not": "didn't",
      "is not": "isn't",
      "are not": "aren't",
      "was not": "wasn't",
      "were not": "weren't",
      "could not": "couldn't",
      "should not": "shouldn't",
      "would not": "wouldn't",
      "I am": "I'm",
      "you are": "you're",
      "we are": "we're",
      "they are": "they're",
      "it is": "it's",
      "that is": "that's",
      "there is": "there's",
      "here is": "here's",
      "children": "kids",
      "difficult": "hard",
      "difficulties": "problems",
      "assistance": "help",
      "utilize": "use",
      "attempt": "try",
      "purchases": "buys"
    };
    return applySubstitutions(text, map);
  }

  function fluencyPolish(text) {
    // Tiny set of smoothing replacements.
    let result = text;
    result = applySubstitutions(result, {
      "and and": "and",
      "but but": "but",
      "very very": "very",
      "because because": "because",
      "that that": "that"
    });
    // Fix spacing around punctuation
    result = result.replace(/\s+([,.;:!?])/g, "$1");
    result = result.replace(/([,.;:!?])(\S)/g, "$1 $2");
    return result;
  }

  function extractSensorySuggestions(text) {
    // Use simple keywords to suggest extra detail prompts.
    const lower = text.toLowerCase();
    const prompts = [];
    const topics = [
      { key: "room", prompt: "Describe the air, light, and temperature in the room." },
      { key: "street", prompt: "What sounds and smells define the street at that moment?" },
      { key: "kitchen", prompt: "Add a detail about heat, utensils, or the smell of cooking." },
      { key: "night", prompt: "Lean into the quality of the darkness: sound, sky, and distance." },
      { key: "body", prompt: "Add a small physical sensation: pulse, ache, tension, or fatigue." },
      { key: "bar", prompt: "Mention glass, smoke, sticky surfaces, or the mix of voices." },
      { key: "office", prompt: "Describe light, screens, paper, or the hum of machines." },
      { key: "rain", prompt: "Use one tactile or auditory detail about the rain itself." }
    ];
    topics.forEach(t => {
      if (lower.includes(t.key)) {
        prompts.push(t.prompt);
      }
    });
    if (!prompts.length) {
      prompts.push("Choose one concrete smell, one sound, and one tactile detail you could layer into this paragraph.");
    }
    return prompts;
  }

  function run() {
    const text = input.value.trim();
    if (!text) {
      output.value = "";
      notes.value = "";
      return;
    }
    let result = text;

    // Tone
    const tone = selectTone.value;
    if (tone === "formal") {
      result = formalize(result);
    } else if (tone === "informal") {
      result = informalize(result);
    }

    // Length
    const lenMode = selectLength.value;
    if (lenMode === "shorter") {
      result = shorten(result);
    } else if (lenMode === "longer") {
      result = lengthen(result);
    }

    // Fluency
    if (chkFluency.checked) {
      result = fluencyPolish(result);
    }

    output.value = result;

    // Sensory suggestions
    if (chkSensory.checked) {
      const prompts = extractSensorySuggestions(result);
      notes.value = prompts.map((p, i) => (i+1) + ". " + p).join("\n");
    } else {
      notes.value = "";
    }
  }

  btnRun.addEventListener("click", run);
  btnClear.addEventListener("click", () => {
    input.value = "";
    output.value = "";
    notes.value = "";
  });

  btnCopy.addEventListener("click", () => {
    if (!output.value) return;
    navigator.clipboard && navigator.clipboard.writeText(output.value).catch(() => {});
  });
})();
