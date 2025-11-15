# Lexicon Builder

A tiny HTML-first tool for building a custom lexicon for your writing voice — especially suited to misanthropic, existential, and darkly philosophical work.

## What it does

- Lets you define **terms**, **definitions**, **tones**, and **usage examples**.
- Filter by tone and search across terms/definitions/usages.
- Shows a small tone heatmap so you can see which moods dominate.
- Exports the current view as:
  - `lexicon.md` (Markdown)
  - `lexicon.json` (for later re-use)
- Imports a previous `lexicon.json` so you can keep iterating.

Everything runs locally in your browser. No servers, no logins, no tracking. It’s a seed tool you can keep, clone, or hack apart.

## Files

- `index.html` – main UI.
- `base.css` – styling (dark, minimal, noir-gold inspired).
- `lexicon.js` – logic and behaviour.
- `README.md` – this file.

## How to use

1. Open `index.html` in any modern browser (Chrome, Edge, Firefox, etc.).
2. Start editing the seed entries:
   - Click any cell to edit text.
   - Use the **Tone** dropdown to set the flavour (caustic, melancholic, clinical, etc.).
3. Add more entries with the **“+ Add Row”** button.
4. Filter by tone or use the search bar to focus on a subset.
5. Switch to **Preview Mode** to see a Markdown-style chapter of your lexicon.
6. When you’re happy:
   - Click **Export Markdown** → `lexicon.md`.
   - Or **Export JSON** → `lexicon.json` (re-importable later).

To load an old lexicon, click **Import JSON** and choose a previously exported file.

## Customising

This is intentionally lightweight:

- Change the tone list in `lexicon.js` near the top.
- Tweak colours, radius, and shadows in `base.css`.
- Swap fonts by editing the `body { font-family: ... }` rule.

## Licensing / usage

You can:

- Use this as-is for your own work.
- Bundle it as part of a writing toolkit.
- Modify and resell as a template (ideally with your own license text added).

If you want to hide an easter egg or credit line, add it to the footer in `index.html`.
