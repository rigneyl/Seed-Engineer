# McCarthy Minimalism Engine

A tiny, HTML-first writing tool that pushes your prose toward Cormac McCarthy–style austerity.

- **Local-only.** No backend, no tracking, no external dependencies.
- **Single-page app.** Just open `index.html` in your browser.
- **Heuristic-based.** No AI calls — everything is simple JS rules.

---

## Files

- `index.html` – main UI and layout.
- `style.css` – styling for the app (dark, desert-coded).
- `script.js` – all analysis logic and interactions.
- `README.md` – this file.

You can drop these into any folder and open `index.html` directly in your browser.

---

## How It Works

The engine analyzes your text using simple, local heuristics:

### 1. Comma Overuse

- Counts commas per sentence.
- Flags sentences using more than **one comma** as overuse.
- Shown under the **Commas** metric and **Violations** tab.

### 2. Adjectives

- Uses suffix-based heuristics to guess adjectives: `-ous`, `-ive`, `-able`, `-less`, `-al`, etc.
- Tracks how many per sentence.
- If a sentence has more than **1 adjective**, it is counted as a violation.

### 3. Adverbs

- Anything ending in `-ly` (with a few exceptions) is treated as an adverb.
- Adverbs are heavily penalized in the **Minimalist Purity Index**.
- You can click **“Strip adverbs”** to automatically remove them.

### 4. Abstract Nouns

Looks for a curated set of vague, floaty words like:

> truth, morality, society, justice, meaning, purpose, identity, humanity, evil, virtue, progress, civilization…

Detected abstract nouns:

- Are counted in the metrics.
- Are shown as pills under the **Lexicon** tab.
- Penalize the purity score (especially if there are many).

### 5. Dialogue Structure

The tool scans for:

- **Quotation marks** – McCarthy tends to omit them.
- **Ellipses (`...`)** – flagged as “modern softness”.
- **Dialogue tags** like `said`, `asked`, `whispered`, etc.

Any of these will be listed under the **Dialogue & Quotes** tab and affect the purity score.

### 6. Cadence & Sentence Length

- Splits your text into simple sentences.
- Computes average sentence length (in words).
- Builds a **cadence bar chart** to show short / medium / long sentences.

A rough guide:

- Short sentences → more **The Road**.
- Long wave-like sentences → more **Blood Meridian**.

---

## Modes

The **Mode** selector biases the scoring slightly to fit different McCarthy “flavors”:

### Blood Meridian Mode

- Prefers longer, wave-like sentences.
- Rewards **biblical tone markers**.
- Penalizes clipped, too-modern brevity.

### The Road Mode

- Prefers short, bare sentences.
- Penalizes long, wandering lines and adverb use.

### Suttree Mode

- Allows more middle-length, descriptive prose.
- Still punishes obvious bloat and abstraction.

---

## Minimalist Purity Index

A 0–100 score influenced by:

- Comma overuse  
- Adverb count  
- Abstract nouns  
- Adjectives per sentence  
- Dialogue “softness” (quotes, ellipses, tags)  
- Sentence cadence vs selected mode  

The score is accompanied by a short line such as:

- “Austere as bone in desert light.”  
- “Modern softness has crept into the prose.”  
- “The line has wandered far from the desert.”

Think of it as a **tone gauge**, not an absolute judgment.

---

## “Make it Biblical” Button

This is a playful, rules-based transform:

- Takes either the current selection or the last sentence.
- Strips quotes and soft openings.
- Prepends a random McCarthy-ish biblical starter (e.g. `and he`, `and they`).
- Ensures it ends with punctuation.

It is intentionally rough and stylized, meant as a **starting nudge**, not a perfect rewrite.

---

## How to Use

1. Open `index.html` in any modern browser (Chrome, Edge, Firefox).
2. Type or paste your text in the **Text** panel.
3. Choose a **Mode** (Blood Meridian / The Road / Suttree).
4. Watch the **Minimalist Purity Index** and metrics update live.
5. Use:
   - **Violations** tab to see what to fix.
   - **Cadence & Tone** tab to see sentence lengths and cadence hints.
   - **Dialogue & Quotes** tab for quote/ellipses/tag issues.
   - **Lexicon** tab for abstract nouns and biblical markers.

---

## Customizing the Tool

- To change the style:
  - Edit `style.css` (colors, borders, fonts).
- To change the word lists:
  - Adjust `abstractNouns`, `dialogueTags`, `biblicalMarkers`, and `mccarthyWords` in `script.js`.

You can also:

- Embed this engine inside a bigger “writer OS”.
- Add export buttons (save text to `.txt` or `.md`).
- Wire in additional rules for your own personal minimalist canon.

---

## License

This template is intended as a **seed tool**: simple, local, and meant to be forked, remixed, and expanded.

If you're selling it as part of your own bundle, you can:

- Rebrand the UI
- Extend the heuristics
- Integrate with your existing writer dashboards

Just keep it local-first and respectful to your users’ privacy.
