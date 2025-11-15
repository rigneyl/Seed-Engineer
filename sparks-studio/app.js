
// sparks-studio/app.js
// Sparks Edit & Inspire: light rule-based editing + idea prompts.

(function() {
  const editInput = document.getElementById("edit-input");
  const editOutput = document.getElementById("edit-output");
  const inspireInput = document.getElementById("inspire-input");
  const inspireOutput = document.getElementById("inspire-output");

  const btnEditClear = document.getElementById("btn-edit-clear");
  const btnEditRun = document.getElementById("btn-edit-run");
  const btnInspireUseEdit = document.getElementById("btn-inspire-use-edit");
  const btnInspireRun = document.getElementById("btn-inspire-run");

  const selectTense = document.getElementById("select-tense");
  const selectPerson = document.getElementById("select-person");
  const chkReadability = document.getElementById("chk-readability");
  const chkSensoryHook = document.getElementById("chk-sensory-hook");

  function applyMap(text, map) {
    let result = text;
    Object.keys(map).forEach(key => {
      const pattern = new RegExp("\\b" + key.replace(/ /g, "\\s+") + "\\b", "gi");
      result = result.replace(pattern, (m) => {
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

  function readabilityPass(text) {
    let result = text;
    // Hedge cleaning
    const hedges = [
      "really","very","quite","actually","kind of","sort of","basically","in fact","just","perhaps","maybe"
    ];
    hedges.forEach(w => {
      const re = new RegExp("\\b" + w.replace(/ /g, "\\s+") + "\\b", "gi");
      result = result.replace(re, "");
    });
    // Phrase tightening
    result = applyMap(result, {
      "in order to": "to",
      "due to the fact that": "because",
      "for the purpose of": "to",
      "as a result of": "because"
    });
    // Double-word and spacing cleanup
    result = applyMap(result, {
      "and and": "and",
      "but but": "but",
      "that that": "that"
    });
    result = result.replace(/\s+([,.;:!?])/g, "$1");
    result = result.replace(/([,.;:!?])(\S)/g, "$1 $2");
    result = result.replace(/\s{2,}/g, " ");
    return result.trim();
  }

  function tenseTransform(text, mode) {
    if (mode === "keep") return text;
    let result = text;
    if (mode === "past") {
      result = applyMap(result, {
        "am": "was",
        "is": "was",
        "are": "were",
        "have": "had",
        "has": "had",
        "do": "did",
        "does": "did",
        "go": "went"
      });
    } else if (mode === "present") {
      result = applyMap(result, {
        "was": "is",
        "were": "are",
        "had": "has",
        "did": "does",
        "went": "go"
      });
    }
    return result;
  }

  function personTransform(text, mode) {
    if (mode === "keep") return text;
    let result = text;
    if (mode === "first") {
      result = applyMap(result, {
        "you": "I",
        "your": "my",
        "yourself": "myself",
        "yourselves": "ourselves",
        "we": "I",
        "our": "my",
        "ours": "mine"
      });
    } else if (mode === "third") {
      result = applyMap(result, {
        "I": "they",
        "me": "them",
        "my": "their",
        "mine": "theirs",
        "we": "they",
        "us": "them",
        "our": "their",
        "ours": "theirs",
        "you": "they",
        "your": "their"
      });
    } else if (mode === "second") {
      result = applyMap(result, {
        "I": "you",
        "me": "you",
        "my": "your",
        "mine": "yours",
        "we": "you",
        "us": "you",
        "our": "your",
        "ours": "yours"
      });
    }
    return result;
  }

  function sensoryHookLine(text) {
    const lower = text.toLowerCase();
    const hooks = [];
    if (lower.includes("room")) hooks.push("Add one detail about the air, light, or temperature in the room.");
    if (lower.includes("street")) hooks.push("Add a sound or smell that defines the street right now.");
    if (lower.includes("night")) hooks.push("Lean into the texture of the night — sky, noise, or silence.");
    if (lower.includes("kitchen")) hooks.push("Drop in a smell or texture from the kitchen (heat, steam, metal).");
    if (lower.includes("bar")) hooks.push("Use one tiny detail from the bar: glass, stickiness, smoke, or neon.");
    if (lower.includes("office")) hooks.push("Mention light, screens, paper, or the hum of machines.");
    if (lower.includes("rain")) hooks.push("Show how the rain feels or sounds against something.");
    if (!hooks.length) {
      hooks.push("Choose one smell, one sound, and one tactile detail you could layer into this paragraph.");
    }
    return "[Sensory hook] " + hooks[0];
  }

  function runEdit() {
    const base = editInput.value.trim();
    if (!base) {
      editOutput.value = "";
      return;
    }
    let result = base;

    if (chkReadability.checked) {
      result = readabilityPass(result);
    }
    result = tenseTransform(result, selectTense.value);
    result = personTransform(result, selectPerson.value);

    if (chkSensoryHook.checked) {
      const hook = sensoryHookLine(result);
      result = result.replace(/\s+$/,"");
      result += "\n\n" + hook;
    }

    editOutput.value = result;
  }

  function buildInspireIdeas(source) {
    const text = source.trim();
    if (!text) return "";
    const stats = TextUtils.getTextStats(text);
    const freqs = TextUtils.sortedFrequencies(stats.freqMap);
    const anchors = [];
    for (const [word, count] of freqs) {
      if (anchors.length >= 5) break;
      if (word.length < 4) continue;
      if (TextUtils.isStopword(word)) continue;
      anchors.push(word);
    }

    const anchorStr = anchors.length ? anchors.join(", ") : "your key images or objects";

    const lines = [];
    lines.push("SPARKS EDIT & INSPIRE");
    lines.push("---------------------");
    lines.push("");
    lines.push("1. Dialogue spark");
    lines.push("Write a short exchange where one of these anchors matters: " + anchorStr + ". Let one character want something the other refuses to give.");
    lines.push("");
    lines.push("2. Emotional shift");
    lines.push("Pick one character and describe how their feelings about " + (anchors[0] || "the central situation") + " change across a single moment or gesture — without naming the emotion outright.");
    lines.push("");
    lines.push("3. Sensory deepening");
    lines.push("Add one smell, one sound, and one tactile detail that could only belong to this specific place or scene.");
    lines.push("");
    lines.push("4. Obstacle or turn");
    lines.push("Introduce a small but concrete obstacle tied to " + (anchors[1] || "the setting") + " that forces the characters to act differently.");
    lines.push("");
    lines.push("5. Next-beat nudge");
    lines.push("Write 2–3 sentences that could plausibly follow your current scene, making sure at least one anchor (" + (anchors[2] || "any image you like") + ") reappears in a new light.");
    lines.push("");
    return lines.join("\n");
  }

  function runInspire() {
    let text = inspireInput.value.trim();
    if (!text) text = editInput.value.trim();
    if (!text) {
      inspireOutput.value = "";
      return;
    }
    inspireOutput.value = buildInspireIdeas(text);
  }

  btnEditRun.addEventListener("click", runEdit);
  btnEditClear.addEventListener("click", () => {
    editInput.value = "";
    editOutput.value = "";
  });

  btnInspireUseEdit.addEventListener("click", () => {
    inspireInput.value = editInput.value;
  });

  btnInspireRun.addEventListener("click", runInspire);
})();
