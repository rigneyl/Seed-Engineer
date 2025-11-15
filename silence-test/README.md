# The Silence Test — MVP

This is a minimal, client‑side web app that lets you paste prose and hear it in *silence* by removing adjectives/adverbs and cleaning punctuation.

## How it works
- Heuristic removal:
  - Adverbs: common intensifiers (very/really/just/etc.), words ending in **-ly**, **-ward(s)**, **-wise**.
  - Adjectives: a curated list (good/bad/small/large/…); optional **Aggressive mode** removes words ending in **-ous/‑ive/‑al/‑ic/‑able/‑ible/‑y** (with a whitelist to avoid obvious nouns like *story*, *music*, etc.).
- Punctuation reflow:
  - Collapses extra spaces and duplicate punctuation.
  - Removes stray commas introduced by removals (optional **Smart comma cleanup**).
  - Fixes spacing around quotes, dashes, and sentence punctuation.

This is meant as an MVP for rhythm/clarity exploration — not a full POS tagger. The rules are transparent and adjustable in `app.js`.

## Files
- `index.html` — UI
- `styles.css` — minimal calm theme
- `app.js` — remover/cleanup logic
- `README.md`

## Use
Open `index.html` in any modern browser (offline is fine). Paste text → **Strip to Silence**. Toggle options as needed. Copy or download the silent output.

## Notes / Roadmap
- Add a real POS tagger (e.g., WebAssembly + spaCy or compromise.js) behind a toggle.
- Provide a dictionary pane to customize adjective/adverb lists per user.
- “A/B rhythm” view with syllable counts per sentence.
- Keyboard shortcuts and drag‑drop text files.
