# Minimalist Editor · v1.3  
Modes: McCarthy / Hemingway / Bukowski (tuned) / Ligotti

Single-page, HTML-first constraint sandbox with four stylistic engines.

This version tightens **Bukowski** mode so it behaves more like:  
“Loose, spoken, no sermons, no TED talk about ‘the human condition’.”

---

## Bukowski (tuned)

New heuristics in this build:

- **Adjective limit:** 4 per paragraph (you can sprawl a bit, but not gush)
- **Adverbs:** barely a problem (light penalty)
- **Commas:** light penalty (rambling is allowed)
- **Metaphors:** lightly penalised
- **Abstractions & Latinate words:** punished very hard  
  (no “humanity”, “society”, “purpose”, “civilization”, etc.)
- **Long sentences:** any sentence over ~25 words is treated as a **sermon** and heavily penalised

Export condition:

- Purity ≥ **80**
- All violation counters = **0**

If you drift into long, abstract, Latinate-heavy sentences, the score crashes.  
If you stick to spoken, plain, concrete language, the score stays high.

The UI messaging for Bukowski reflects this:

- Mid-score hint:  
  > “You might be getting a bit pretty. Cut the sermon, keep the story.”
- Low-score hint (especially with long sentences):  
  > “Sounds like you’re on a stage, not a barstool. Break the long rants into real sentences.”

---

## Other modes (unchanged from v1.2)

- **McCarthy** – brutal minimalism:  
  - 1 adjective per paragraph  
  - Strong punishment for abstractions, Latinate drift, metaphors, extra commas  
  - Export: purity ≥ 90, all violations 0

- **Hemingway** – clean, practical minimalism:  
  - 3 adjectives per paragraph  
  - Hates comma-sprawl more than adjectives  
  - Export: purity ≥ 85, all violations 0

- **Ligotti** – controlled dread:  
  - Soft adjective limit (effectively off)  
  - Expects some metaphors & abstractions; punishes their total absence  
  - Export: purity ≥ 80, all violations 0

---

## How to use

1. Open `index.html` in any modern browser.
2. Switch modes via the top-right pill: McCarthy / Hemingway / Bukowski / Ligotti.
3. Type in the left editor.
4. Watch violation counts (adverbs, adjectives, commas, metaphors, abstractions, Latinate drift).
5. The **Purity** score changes based on the current mode’s rules.
6. When purity ≥ the mode’s threshold and all violations are 0, the **Export Clean Draft** button unlocks and downloads a `.txt` file named with the mode and timestamp.

Shortcuts:

- **Ctrl+E** / **⌘+E** – export (if allowed)
- **Esc** – clear draft (with confirmation)

---

## Files

- `index.html` – everything in one file.
- `README.md` – this explanation.

This is still pure HTML/CSS/JS – no build, no bundler. Drop it into your tool library, zip it, sell it, or bundle it in a Writer’s Lab pack.
