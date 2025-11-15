
// sensory-report/app.js
// Five-sense breakdown: sight, sound, smell, taste, touch.

(function() {
  const input = document.getElementById("input-text");
  const btnClear = document.getElementById("btn-clear");
  const btnRun = document.getElementById("btn-run");

  const tagRow = document.getElementById("tag-row");
  const statsGrid = document.getElementById("stats-grid");
  const resultsHeading = document.getElementById("results-heading");
  const resultsList = document.getElementById("results-list");

  function clearAll() {
    input.value = "";
    tagRow.innerHTML = "";
    statsGrid.innerHTML = "";
    resultsList.innerHTML = "";
    resultsHeading.textContent = "Waiting for input…";
  }

  btnClear.addEventListener("click", clearAll);

  function statCard(label, value, note) {
    const card = document.createElement("div");
    card.className = "stat-card";
    const l = document.createElement("div");
    l.className = "stat-label";
    l.textContent = label;
    const v = document.createElement("div");
    v.className = "stat-value";
    v.textContent = value;
    const n = document.createElement("div");
    n.className = "stat-note";
    n.textContent = note;
    card.appendChild(l);
    card.appendChild(v);
    card.appendChild(n);
    statsGrid.appendChild(card);
  }

  function addBadge(text, muted) {
    const badge = document.createElement("div");
    badge.className = muted ? "badge badge-muted" : "badge";
    const dot = document.createElement("span");
    dot.className = "badge-dot";
    const label = document.createElement("span");
    label.textContent = text;
    badge.appendChild(dot);
    badge.appendChild(label);
    tagRow.appendChild(badge);
  }

  function run() {
    const text = input.value.trim();
    if (!text) {
      clearAll();
      return;
    }
    tagRow.innerHTML = "";
    statsGrid.innerHTML = "";
    resultsList.innerHTML = "";
    resultsHeading.textContent = "Sensory breakdown";

    const stats = TextUtils.getTextStats(text);
    const read = TextUtils.computeReadability(text);
    const wordCount = read.wordCount || 0;

    // Lexicons for each sense
    const lex = {
      sight: [
        "dark","light","glow","shadow","shadows","bright","dim","color","colours","colour","colors",
        "vision","see","seen","saw","stare","stared","staring","look","looked","looking","glare","gleam",
        "glint","shine","shone","glitter","blur","blurry","clear","obscured","visible","invisible"
      ],
      sound: [
        "noise","noises","silent","silence","quiet","echo","echoes","bang","bangs","whisper","whispers",
        "whispered","scream","screams","screamed","shout","shouts","shouted","ring","rings","ringing",
        "hum","hums","humming","clatter","clank","thud","thuds","thudding","murmur","murmurs","murmured"
      ],
      smell: [
        "odor","odour","smell","smells","stink","stinks","stinking","aroma","aromas","scent","scents",
        "reek","reeks","perfume","perfumed","fragrance","fragrances","musty","rancid","acrid"
      ],
      taste: [
        "taste","tastes","tasted","bitter","sweet","sour","salty","bland","flavor","flavour","flavors",
        "flavours","aftertaste","spice","spicy","sugary","acidic"
      ],
      touch: [
        "cold","colder","warm","warmer","hot","heat","rough","roughness","smooth","smoothness","pressure",
        "soft","softer","hard","harder","itch","itching","itchy","ache","aching","aching","sting","stinging",
        "tingle","tingling","numb","numbness","chill","chilling","damp","dampness","wet","wetness","dry","dryness"
      ]
    };

    const counts = { sight: 0, sound: 0, smell: 0, taste: 0, touch: 0 };
    const words = stats.words.map(w => w.toLowerCase());

    words.forEach(w => {
      for (const sense in lex) {
        if (lex[sense].includes(w)) {
          counts[sense]++;
        }
      }
    });

    const totalHits = Object.values(counts).reduce((a,b) => a + b, 0);

    // Stats cards
    statCard("Words", wordCount, "Total word count");
    statCard("Sensory hits", totalHits, "Total sense-related tokens");
    const per100 = wordCount ? (totalHits / wordCount) * 100 : 0;
    statCard("Density", per100.toFixed(1) + " / 100 words", "Overall sensory density");

    // Badges
    const sensesSorted = Object.entries(counts).sort((a,b) => b[1] - a[1]);
    if (totalHits === 0) {
      addBadge("No obvious sensory lexicon detected", true);
    } else {
      const top = sensesSorted[0][0];
      const bottom = sensesSorted[sensesSorted.length - 1][0];
      addBadge("Dominant sense: " + top, false);
      if (counts[bottom] === 0) {
        addBadge("Neglected: " + bottom, true);
      } else {
        addBadge("Weakest sense: " + bottom, true);
      }
    }

    // Build bar view + summary
    const container = document.createElement("div");
    container.className = "results-block-inner";

    const barCol = document.createElement("div");
    const infoCol = document.createElement("div");

    const barsWrapper = document.createElement("div");
    barsWrapper.className = "sense-bars";

    function makeRow(nameKey, label) {
      const row = document.createElement("div");
      row.className = "sense-row";
      const labelRow = document.createElement("div");
      labelRow.className = "sense-label-row";
      const nameEl = document.createElement("div");
      nameEl.className = "sense-name";
      nameEl.textContent = label;
      const valueEl = document.createElement("div");
      valueEl.className = "sense-value";

      let pct = 0;
      if (totalHits > 0) {
        pct = (counts[nameKey] / totalHits) * 100;
      }
      valueEl.textContent = counts[nameKey] + " · " + (totalHits ? pct.toFixed(0) + "%" : "0%");

      labelRow.appendChild(nameEl);
      labelRow.appendChild(valueEl);

      const outer = document.createElement("div");
      outer.className = "sense-bar-outer";
      const inner = document.createElement("div");
      inner.className = "sense-bar-inner";
      inner.style.transform = "scaleX(" + (pct / 100).toFixed(3) + ")";
      outer.appendChild(inner);

      row.appendChild(labelRow);
      row.appendChild(outer);
      return row;
    }

    barsWrapper.appendChild(makeRow("sight", "Sight"));
    barsWrapper.appendChild(makeRow("sound", "Sound"));
    barsWrapper.appendChild(makeRow("smell", "Smell"));
    barsWrapper.appendChild(makeRow("taste", "Taste"));
    barsWrapper.appendChild(makeRow("touch", "Touch"));

    const note = document.createElement("div");
    note.className = "sense-note";
    note.textContent = "Percentages are relative to all sensory hits, not to total words. Aim for a mix that suits your scene, not a perfect 20/20/20/20/20 split.";

    barCol.appendChild(barsWrapper);
    barCol.appendChild(note);

    const summary = document.createElement("div");
    summary.className = "sense-summary";

    const dominance = totalHits
      ? sensesSorted.map(([s,c]) => s + " (" + c + ")").join(" → ")
      : "no clear sensory footprint yet";

    let summaryHtml = "";
    summaryHtml += "<p><strong>Balance overview</strong></p>";
    summaryHtml += "<p>Order of emphasis: " + dominance + ".</p>";

    summaryHtml += "<p><strong>Quick guidance</strong></p><ul>";
    summaryHtml += "<li>If sight dominates and smell/taste/touch are near zero, your prose may feel detached — add one concrete non-visual detail per paragraph.</li>";
    summaryHtml += "<li>If sound is strong, consider one contrasting moment of silence to sharpen it.</li>";
    summaryHtml += "<li>Smell and taste are powerful in small doses; even a single hit can carry a scene.</li>";
    summaryHtml += "<li>Touch (temperature, texture, pressure) grounds bodies in space — helpful for physical or intimate scenes.</li>";
    summaryHtml += "</ul>";

    summary.innerHTML = summaryHtml;
    infoCol.appendChild(summary);

    container.appendChild(barCol);
    container.appendChild(infoCol);

    resultsList.appendChild(container);
  }

  btnRun.addEventListener("click", run);
})();
