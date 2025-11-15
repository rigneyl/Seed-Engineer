# Plot Machine — Non‑AI Beat Expander (MVP)

A local‑only, single‑page app that turns a one‑line idea into an editable story skeleton using classic structures.

## Features
- **Templates:** 12‑Beat Skeleton, Save the Cat (15 beats), Hero’s Journey (12 stages)
- **Non‑AI:** Deterministic, rule‑based scaffolding — no servers, no model calls
- **Editable:** Click any beat title/summary to edit; add beats; reorder via ▲/▼
- **Exports:**
  - **Markdown** outline (`.md`)
  - **OPML** outline (`.opml`) — importable into Scrivener as an outline (File → Import → OPML)
  - **JSON** — re‑import later
- **Persistence:** Save / load to browser `localStorage`
- **Print:** Printer‑friendly view

## Scrivener Import Tips
- Scrivener can import **OPML** to create a binder outline. Each beat becomes a document; the beat summary is stored in the _note field.
- Alternatively, you can import the **Markdown** file and use “Split at Headings” to create documents.

## How to Use
1. Open `index.html` in your browser (no build step required).
2. Enter a logline, pick a template, press **Generate**.
3. Tweak beats, reorder, add/remove.
4. Export to `.md` or `.opml`.

## Files
- `index.html` — UI
- `styles.css` — dark‑minimal aesthetic
- `script.js` — logic (no dependencies)
- `README.md` — this file

## License
MIT — do anything, but no warranty.
