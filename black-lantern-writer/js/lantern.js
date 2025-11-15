// THE BLACK LANTERN WRITER
// Pure JS · No dependencies · Local-only

(function () {
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  // --- Simple lexicons ---
  const LEX = {
    darkness: [
      "night","shadow","shadows","dark","darkness","void","silence","cold","black","ashen","gloom","eclipse","midnight"
    ],
    existential: [
      "nothing","absence","emptiness","meaningless","void","nihil","futility","pointless","never","no one","no-one","hopeless"
    ],
    decay: [
      "rot","decay","ruin","corruption","failed","failure","filth","disease","vermin","waste","broken","cruel","cruelty"
    ],
    hope: [
      "hope","light","kindness","love","redemption","forgiveness","together","healing","faith","grace","promise"
    ],
    noise: [
      "traffic","crowd","voices","shouting","laughter","music","screens","notifications","sirens","buzz","hum"
    ],
    quiet: [
      "quiet","silence","stillness","hush","muted","calm","hollow","empty"
    ],
    hedges: [
      "maybe","sort of","kind of","perhaps","seems","a bit","a little","somehow","probably"
    ],
    cliches: [
      "at the end of the day","light at the end of the tunnel","it is what it is","time will tell","only time will tell"
    ],
    pretension: [
      "ontological","epistemic","dialectic","palimpsest","hypertrophy","apotheosis","semiotic","hermeneutic"
    ],
    adverbs: [
      "quickly","slowly","softly","quietly","loudly","suddenly","gently","carefully","brightly","darkly","coldly"
    ],
    bukowski: [
      "bar","booze","beer","whiskey","cigarette","street","cheap","rent","hangover","piss","shit","fuck"
    ],
    cioran: [
      "futility","despair","nothing","nihilism","weariness","void","boredom","suicide","torment","lament","wound"
    ],
    ligotti: [
      "puppet","mannequin","doll","mask","void","unreal","faceless","wax","puppetry","horror","dread"
    ],
    mccarthy: [
      "dust","horse","blood","road","gun","ashes","desert","sun","bone","rifle","ragged"
    ]
  };

  function tokenize(text) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s']/g, " ")
      .split(/\s+/)
      .filter(Boolean);
  }

  function countMatches(words, lexicon) {
    const set = new Set(lexicon);
    let count = 0;
    for (const w of words) {
      if (set.has(w)) count++;
    }
    return count;
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function setMeter(barId, valueId, value, max = 100) {
    const pct = max ? clamp(Math.round((value / max) * 100), 0, 100) : 0;
    const bar = $(barId);
    const label = $(valueId);
    if (bar) bar.style.width = pct + "%";
    if (label) label.textContent = max === 100 ? pct + "%" : String(value);
  }

  function setText(id, text) {
    const el = $(id);
    if (el) el.textContent = text;
  }

  // --- Panel 1: Embers ---
  function analyzeEmbers() {
    const text = $("#embersInput").value.trim();
    if (!text) {
      setText("#archetypeBlend", "Write something first; the lantern cannot read empty smoke.");
      return;
    }
    const words = tokenize(text);
    const total = words.length || 1;

    const darkCount = countMatches(words, LEX.darkness);
    const existCount = countMatches(words, LEX.existential);
    const decayCount = countMatches(words, LEX.decay);

    const darknessScore = clamp((darkCount / total) * 800, 0, 100);
    const existentialScore = clamp((existCount / total) * 900, 0, 100);
    const decayScore = clamp((decayCount / total) * 900, 0, 100);

    setMeter("#darknessBar", "#darknessValue", darknessScore);
    setMeter("#existentialBar", "#existentialValue", existentialScore);
    setMeter("#decayBar", "#decayValue", decayScore);

    // Archetype blend
    const buko = countMatches(words, LEX.bukowski);
    const cior = countMatches(words, LEX.cioran);
    const ligo = countMatches(words, LEX.ligotti);
    const mcc = countMatches(words, LEX.mccarthy);
    const sum = buko + cior + ligo + mcc || 1;
    const mix = {
      Bukowski: Math.round((buko / sum) * 100),
      Cioran: Math.round((cior / sum) * 100),
      Ligotti: Math.round((ligo / sum) * 100),
      McCarthy: Math.round((mcc / sum) * 100)
    };

    const blendText = `Bukowski ${mix.Bukowski}% · Cioran ${mix.Cioran}% · Ligotti ${mix.Ligotti}% · McCarthy ${mix.McCarthy}%`;
    setText("#archetypeBlend", blendText);

    // Idea type classification
    const len = text.length;
    let type = "Unclear fragment";
    let path = "Write more until the form suggests itself.";

    if (existentialScore > 60 && len < 320) {
      type = "Cioran-style aphorism";
      path = "Fragment → Knife → Manuscript";
    } else if (darknessScore > 50 && decayScore > 40 && len >= 400 && len <= 1600) {
      type = "Dark essay / polemic";
      path = "Shape → Pit → Knife → Manuscript";
    } else if (darknessScore > 40 && len < 500) {
      type = "Dread fragment";
      path = "Shape (dread) → Pit → Manuscript";
    } else if (mix.McCarthy > 40 && len > 600) {
      type = "Minimal narrative vignette";
      path = "Shape (narrative) → Pit → Knife → Manuscript";
    } else if (mix.Bukowski > 35) {
      type = "Confessional rant";
      path = "Shape (rant) → Pit → Knife → Manuscript";
    }

    setText("#ideaType", type);
    setText("#ideaPath", path);
  }

  // --- Panel 2: Shape ---
  function generateSkeleton() {
    const mode = $("#modeSelect").value;
    const thesis = $("#thesisInput").value.trim() || "— your central wound / thesis —";
    const out = $("#skeletonOutput");
    if (!out) return;

    function block(title, prompt) {
      return (
        '<div class="skeleton-section">' +
        `<div class="skeleton-section-title">${title}</div>` +
        `<p class="skeleton-prompt">${prompt}</p>` +
        "</div>"
      );
    }

    let html = "";
    if (mode === "essay") {
      html += block("1 · Thesis", `State, in one brutal line, what you believe: “${thesis}”. No caveats.`);
      html += block("2 · Contradiction", "Show how everyday behaviour mocks this belief. Use at least one concrete scene.");
      html += block("3 · Descent", "Trace the logical collapse outward: individuals → society → history. Keep the tone cold.");
      html += block("4 · Refusal of Hope", "Explicitly reject the usual fixes, solutions, or comforting narratives.");
      html += block("5 · Final Ash", "End on an image or line that accepts the wound without redeeming it.");
      setText("#vizDarkness", "Descending slope into acceptance of futility.");
      setText("#vizDetachment", "High, with occasional human spikes.");
      setText("#vizDread", "Gentle rise, never fully resolved.");
      setText("#vizFlow", "Thesis → Contradiction → Descent → Refusal → Ash.");
    } else if (mode === "aphorisms") {
      html += block("1 · Opening Wound", `One or two lines that stab directly at “${thesis}”.`);
      html += block("2 · Contradiction", "A short line that undermines even that certainty.");
      html += block("3 · Universalisation", "Turn the wound into a law of existence.");
      html += block("4 · Self-Negation", "Turn the blade back on the narrator. Make them complicit.");
      html += block("5 · Quiet Echo", "End with a short, quiet line that could stand alone in a notebook.");
      setText("#vizDarkness", "Flat and steady; no rescue attempts.");
      setText("#vizDetachment", "Very high, almost clinical.");
      setText("#vizDread", "A low persistent hum.");
      setText("#vizFlow", "Wound → Contradiction → Law → Self → Echo.");
    } else if (mode === "dread") {
      html += block("1 · Ordinary Setup", "Describe a normal scene with one slightly off detail.");
      html += block("2 · Hairline Crack", `Let “${thesis}” seep in as an unspoken suspicion.`);
      html += block("3 · Unraveling", "Increase the wrongness. Objects, people, or time behave almost right.");
      html += block("4 · Void Glimpse", "Give a brief, unsettling glimpse of the underlying horror. Never name it fully.");
      html += block("5 · Anti-Resolution", "Return to the ordinary, but with one irreversible change.");
      setText("#vizDarkness", "Curved, steepening near the end.");
      setText("#vizDetachment", "Moderate; the narrator is unsettled but not hysterical.");
      setText("#vizDread", "Clear crescendo, then cut to black.");
      setText("#vizFlow", "Ordinary → Crack → Unravel → Void → Aftermath.");
    } else if (mode === "narrative") {
      html += block("1 · Bare Scene", `Open on a place and a body. No backstory. Hint, don’t explain “${thesis}”.`);
      html += block("2 · Movement", "Something must cross a distance: a road, a river, a hallway.");
      html += block("3 · Violence / Event", "Let an event occur that reveals the moral weather without speechifying.");
      html += block("4 · Silence", "After the event, use landscape and gesture instead of commentary.");
      html += block("5 · Dust", "End with the world indifferent. A sky, a road, a piece of trash in the wind.");
      setText("#vizDarkness", "Level and pitiless throughout.");
      setText("#vizDetachment", "High. Almost godlike distance.");
      setText("#vizDread", "Slow, geological."); 
      setText("#vizFlow", "Place → Movement → Event → Silence → Dust.");
    } else if (mode === "rant") {
      html += block("1 · Provocation", `Start mid-anger: a line that spits on “${thesis}” or embraces it fully.`);
      html += block("2 · Confession", "Confess how you’ve failed, degraded, or simply stopped caring.");
      html += block("3 · Target Practice", "Aim at society, work, love, art — pick something and tear into it.");
      html += block("4 · Collapse", "Let the rant turn a little pathetic. Show the exhaustion behind the anger.");
      html += block("5 · Walk Away", "End suddenly, like someone closing a bar tab and stepping into the night.");
      setText("#vizDarkness", "Jagged but always low to the ground.");
      setText("#vizDetachment", "Low to moderate; the voice is personal.");
      setText("#vizDread", "Spiky, more anger than cosmic terror.");
      setText("#vizFlow", "Spark → Confession → Attack → Collapse → Exit.");
    }

    out.innerHTML = html;
  }

  function loadFromEmbers() {
    const src = $("#embersInput").value.trim();
    if (!src) {
      alert("Nothing in Embers yet. Free-write there first.");
      return;
    }
    const line = src.split(/\n+/)[0] || src;
    $("#thesisInput").value = line.slice(0, 200);
  }

  // --- Panel 3: The Pit ---
  function analyzePit() {
    const text = $("#pitDraft").value.trim();
    if (!text) return;
    const words = tokenize(text);
    const total = words.length || 1;

    const dark = countMatches(words, LEX.darkness);
    const exist = countMatches(words, LEX.existential);
    const decay = countMatches(words, LEX.decay);
    const quiet = countMatches(words, LEX.quiet);
    const noise = countMatches(words, LEX.noise);
    const hope = countMatches(words, LEX.hope);
    const hedges = countMatches(words, LEX.hedges);
    const clicheHits = LEX.cliches.reduce((acc, phrase) => acc + (text.toLowerCase().includes(phrase) ? 1 : 0), 0);
    const pret = countMatches(words, LEX.pretension);
    const adv = countMatches(words, LEX.adverbs);

    const bleakness = clamp(((dark + decay + exist) / total) * 700, 0, 100);
    const coldness = clamp((exist / total) * 900, 0, 100);
    const minimalPenalty = adv + hedges;
    const minimal = clamp(100 - minimalPenalty * 3, 0, 100);
    const raw = clamp(((decay + dark) / total) * 600, 0, 100);
    const uncanny = clamp((countMatches(words, LEX.ligotti) / total) * 1000, 0, 100);
    const loathing = clamp((decay / total) * 1000, 0, 100);
    const quietScore = clamp((quiet / (quiet + noise + 1)) * 100, 0, 100);
    const noiseScore = clamp((noise / total) * 900, 0, 100);
    const pretension = clamp(pret * 10, 0, 100);

    setMeter("#bleaknessBar", "#bleaknessValue", bleakness, 100);
    setMeter("#coldnessBar", "#coldnessValue", coldness, 100);
    setMeter("#minimalBar", "#minimalValue", minimal, 100);
    setMeter("#rawBar", "#rawValue", raw, 100);
    setMeter("#uncannyBar", "#uncannyValue", uncanny, 100);
    setMeter("#loathingBar", "#loathingValue", loathing, 100);
    setMeter("#quietBar", "#quietValue", quietScore, 100);
    setMeter("#noiseBar", "#noiseValue", noiseScore, 100);
    setMeter("#pretensionBar", "#pretensionValue", pretension, 100);

    const leakList = $("#leakList");
    if (leakList) {
      leakList.innerHTML = "";
      const items = [
        ["Hope leaks", hope],
        ["Softening hedges", hedges],
        ["Clichés", clicheHits],
        ["Purple adverbs", adv]
      ];
      for (const [label, value] of items) {
        const li = document.createElement("li");
        li.innerHTML = `<span class="leak-item-label">${label}</span>: <span class="leak-item-count">${value}</span>`;
        leakList.appendChild(li);
      }
    }

    // style lean
    const buko = countMatches(words, LEX.bukowski);
    const cior = countMatches(words, LEX.cioran);
    const ligo = countMatches(words, LEX.ligotti);
    const mcc = countMatches(words, LEX.mccarthy);
    const sum = buko + cior + ligo + mcc || 1;
    const dominant = [
      ["Bukowski", buko],
      ["Cioran", cior],
      ["Ligotti", ligo],
      ["McCarthy", mcc]
    ].sort((a, b) => b[1] - a[1])[0][0];

    const leanText = `Leaning toward: ${dominant}. (${Math.round((Math.max(buko,cior,ligo,mcc) / sum) * 100) || 0}% of lexicon hits)`;
    setText("#styleLean", leanText);
  }

  function sendToManuscript() {
    $("#manuscriptText").value = $("#pitDraft").value;
  }

  // --- Panel 4: The Knife ---
  function runKnife() {
    const text = $("#knifeInput").value.trim();
    if (!text) {
      setText("#knifeSuggestions", "Paste some text to slice first.");
      return;
    }
    const words = tokenize(text);
    const rawVal = parseInt($("#rawSlider").value, 10);
    const coldVal = parseInt($("#coldSlider").value, 10);
    const minVal = parseInt($("#minimalSlider").value, 10);
    const dreadVal = parseInt($("#dreadSlider").value, 10);

    const advCount = countMatches(words, LEX.adverbs);
    const hedgeCount = countMatches(words, LEX.hedges);
    const hopeCount = countMatches(words, LEX.hope);
    const clicheHits = LEX.cliches.filter(ph => text.toLowerCase().includes(ph));
    const pretCount = countMatches(words, LEX.pretension);

    const suggestions = [];

    if (minVal > 60 && (advCount > 0 || hedgeCount > 0)) {
      suggestions.push("• You chose high Minimalism: cut the following softeners and adverbs where possible.");
      if (advCount) suggestions.push(`  - Adverbs detected: ${advCount}. Try replacing them with stronger verbs.`);
      if (hedgeCount) suggestions.push(`  - Hedges detected: ${hedgeCount}. Remove them to let the line stand naked.`);
    }

    if (coldVal > 60 && hopeCount > 0) {
      suggestions.push("• Coldness is high, but hope words remain. Consider amputating any lines that attempt comfort.");
    }

    if (rawVal > 65 && pretCount > 0) {
      suggestions.push("• Rawness and pretension are fighting. Replace ornate theoretical terms with blunt, physical ones.");
    }

    if (dreadVal > 60) {
      suggestions.push("• For Dread, ensure at least one ordinary object is made slightly wrong. Add a detail that feels misaligned with reality.");
    }

    if (clicheHits.length) {
      suggestions.push("• Clichés detected:");
      clicheHits.forEach(ph => suggestions.push(`  - “${ph}” — kill it or twist it beyond recognition.`));
    }

    if (!suggestions.length) {
      suggestions.push("• This passage is already relatively sharp. Now try cutting one entire sentence and see if it reads colder.");
    }

    const html = "<p class='small-text'>Guidance based on your sliders:</p><ul>" +
      suggestions.map(s => `<li>${s}</li>`).join("") +
      "</ul>";
    const box = $("#knifeSuggestions");
    if (box) box.innerHTML = html;
  }

  function loadFromPitSelection() {
    const pit = $("#pitDraft");
    if (!pit) return;
    const selection = pit.value.substring(pit.selectionStart, pit.selectionEnd);
    $("#knifeInput").value = selection || pit.value;
  }

  // --- Panel 5: Manuscript ---
  function runFinalChecks() {
    const text = $("#manuscriptText").value.trim();
    if (!text) return;
    const words = tokenize(text);
    const total = words.length || 1;

    const dark = countMatches(words, LEX.darkness);
    const exist = countMatches(words, LEX.existential);
    const decay = countMatches(words, LEX.decay);
    const hope = countMatches(words, LEX.hope);
    const noise = countMatches(words, LEX.noise);
    const quiet = countMatches(words, LEX.quiet);

    const bleakness = (dark + exist + decay) / total;
    const hopeRatio = hope / (dark + exist + decay + 1);
    const noiseQuiet = (noise + 1) / (quiet + 1);

    const cohesion = bleakness > 0.08 ? "Coherent dark register." : "Light register; consider deepening the wound.";
    const voiceConsistency = hopeRatio < 0.15 ? "Consistent voice with minimal redemption." : "Voice occasionally reaches for consolation.";
    const toneDrift = hope > 0 && decay + dark > 0 ? "Some drift between despair and comfort; decide which side you serve." : "Tone is largely stable.";
    const darkStability = bleakness > 0.12 && hopeRatio < 0.1 ? "Darkness is stable and unrepentant." : "Darkness is punctured by soft spots.";
    const noiseQuietReport = noiseQuiet > 1.2 ? "More noise than quiet — consider carving out still moments." : "Quiet and noise are balanced or skewed toward stillness.";

    setText("#reportCohesion", cohesion);
    setText("#reportVoice", voiceConsistency);
    setText("#reportTone", toneDrift);
    setText("#reportDark", darkStability);
    setText("#reportNoiseQuiet", noiseQuietReport);
  }

  function downloadFile(filename, content) {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function exportMarkdown() {
    const text = $("#manuscriptText").value;
    downloadFile("black-lantern-manuscript.md", text);
  }

  function exportHtml() {
    const text = $("#manuscriptText").value;
    const tpl = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Black Lantern Manuscript</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { background:#050509; color:#f5f5f1; font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; margin:0; padding:2.5rem 1.5rem;}
    .page { max-width: 720px; margin:0 auto; line-height:1.6; }
    h1 { font-size:1.2rem; letter-spacing:0.18em; text-transform:uppercase; margin-bottom:1.6rem; }
    pre { white-space:pre-wrap; font-family: "EB Garamond","Times New Roman",serif; font-size:1rem; }
  </style>
</head>
<body>
  <div class="page">
    <h1>Black Lantern Manuscript</h1>
    <pre>${text.replace(/</g,"&lt;").replace(/>/g,"&gt;")}</pre>
  </div>
</body>
</html>`;
    downloadFile("black-lantern-manuscript.html", tpl);
  }

  // --- UI plumbing ---
  function bindTabs() {
    const buttons = $$(".tab-button");
    const panels = $$(".panel");
    const workflowSteps = $$(".workflow-step");

    buttons.forEach((btn, idx) => {
      btn.addEventListener("click", () => {
        buttons.forEach(b => b.classList.remove("active"));
        panels.forEach(p => p.classList.remove("active"));
        workflowSteps.forEach(w => w.classList.remove("active"));

        btn.classList.add("active");
        const target = btn.getAttribute("data-target");
        const panel = document.getElementById(target);
        if (panel) panel.classList.add("active");
        if (workflowSteps[idx]) workflowSteps[idx].classList.add("active");
      });
    });
  }

  function bindThemeToggle() {
    const btn = $("#themeToggle");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const body = document.body;
      if (body.classList.contains("theme-dark")) {
        body.classList.remove("theme-dark");
        body.classList.add("theme-light");
      } else {
        body.classList.remove("theme-light");
        body.classList.add("theme-dark");
      }
    });
  }

  function init() {
    bindTabs();
    bindThemeToggle();

    $("#analyzeEmbersBtn")?.addEventListener("click", analyzeEmbers);
    $("#clearEmbersBtn")?.addEventListener("click", () => { $("#embersInput").value = ""; });
    $("#generateSkeletonBtn")?.addEventListener("click", generateSkeleton);
    $("#loadFromEmbersBtn")?.addEventListener("click", loadFromEmbers);

    $("#analyzePitBtn")?.addEventListener("click", analyzePit);
    $("#sendToManuscriptBtn")?.addEventListener("click", sendToManuscript);

    $("#runKnifeBtn")?.addEventListener("click", runKnife);
    $("#loadFromPitBtn")?.addEventListener("click", loadFromPitSelection);

    $("#runFinalChecksBtn")?.addEventListener("click", runFinalChecks);
    $("#exportMdBtn")?.addEventListener("click", exportMarkdown);
    $("#exportHtmlBtn")?.addEventListener("click", exportHtml);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
