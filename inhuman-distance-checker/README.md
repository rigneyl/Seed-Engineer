# Inhuman Distance Checker

Local-only HTML seed tool that measures how emotionally **distant** your writing is from humanity.

## What it does

- Scans your text for **warmth leaks**:
  - empathy
  - sentimentality
  - “I believe in humanity” tones
  - warmth / intimacy
  - redemption / moral framing
  - compassion-heavy vocabulary
- Calculates an **Inhuman Distance %** (0–100)
- Shows:
  - total warmth hits
  - warmth contaminants list
  - flagged channels (empathy, sentimentality, etc.)
  - sentence-by-sentence **tone map** (`cold / neutral / warm`)
- Offers **purification hints** to push the voice toward:
  - analytic misanthropy
  - cold observation
  - existential dissociation

No AI. No backend. No tracking. Everything runs in your browser, in a single file.

## Files

- `index.html` — the entire app (HTML + CSS + JS inline).
- `README.md` — this file.

## How to use

1. Open `index.html` in any modern browser (Chrome, Edge, Firefox, etc.).
2. Paste or type your text into **Source text**.
3. Click **“Analyze warmth leakage”**.
4. Read the **Inhuman Distance %** and the report:
   - If you see many **warmth contaminants**, consider rewriting those phrases.
   - Use the **Tone drift by sentence** section as a debug view.
5. Optionally click **“Sterilize warmth (rewrite suggestions)”** to apply deterministic
   replacements (e.g. “love” → “attachment mechanism”, “hope” → “predictive bias”).
6. Use **“Export report (.md)”** to download a Markdown summary of the current analysis.

## Customising the tool

You can tweak the lexicon or behaviour by editing the script section inside `index.html`:

- Add or remove **warmth terms** in the `LEXICON` object.
- Adjust the distance sensitivity by changing the multiplier in:

```js
let distanceRaw = 100 - warmthDensity * 300;
```

- Modify or add replacements under `STERILIZE_MAP` to control the “Sterilize warmth” behaviour.

## Notes

- This is a **heuristic**, not a moral judgement.
- You can absolutely use warmth on purpose. The tool just makes sure you know *where* and *how much*.
- Perfect as a **last pass** over misanthropic essays, bleak meditations, and detached philosophical fragments.

## License

You are free to modify, fork, and resell this as a template or seed tool. Consider leaving a small note or “easter egg” somewhere in the code if you remix.
