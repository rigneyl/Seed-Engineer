# The Harsh Editor

A tiny, local-first discipline tool for training a ruthless, declarative writing style.

It does not praise you.  
It scans your text for softness and shows you where you are weak.

---

## What it does

Paste or write text in the left panel and click **Analyze**.

The right-hand dashboard will:

- Compute a **Harshness Score** (0–100).
- Count:
  - Hedging
  - Softeners
  - Emotional qualifiers
  - Passive voice (naive detection)
  - Clichés
  - Modifier overuse
- Show:
  - A weakness summary
  - Detailed violation cards
  - A list of flagged phrases as chips
  - A short, unfriendly coaching line

### Punishment mode

Toggle **Punishment mode** in the header:

- The draft area border turns aggressive red.
- Coaching lines become harsher and more misanthropic.
- The tool expects you to fix weaknesses rather than admire them.

---

## How to use

1. Open `index.html` in any modern browser (Chrome, Edge, Firefox, etc.).
2. Type or paste your text into **Your Draft**.
3. Click **Analyze**.
4. Review:
   - The **Harshness Score**.
   - Each violation category.
   - The flagged phrases.
5. Edit your draft to:
   - Remove hedging and softeners.
   - Strip emotional qualifiers.
   - Replace passive constructions with active verbs.
   - Replace clichés with concrete language—or silence.
   - Reduce modifier bloat.

Click **Analyze** again after each revision round.

---

## What it looks for (roughly)

The detection is deterministic and deliberately simple. It is **not AI**.

- **Hedging**:  
  `maybe`, `perhaps`, `sort of`, `kind of`, `might`, `could`, `seems`, `i think`, `probably`, etc.

- **Softeners**:  
  `just`, `a little`, `a bit`, `somewhat`, `arguably`, `really`, `quite`, etc.

- **Emotional qualifiers**:  
  `unfortunately`, `fortunately`, `sadly`, `happily`, `hopefully`, `thankfully`, `honestly`, etc.

- **Modifiers**:  
  `very`, `extremely`, `really`, `highly`, `absolutely`, `totally`, `completely`, etc.

- **Clichés** (small sample):  
  `at the end of the day`, `think outside the box`, `silver lining`, `easier said than done`, `time will tell`, etc.

- **Passive voice** (very naive):  
  Looks for forms of "to be" followed by a past-tense-like word ending in `ed`.

Because this is rule-based, it will miss things and flag some false positives.  
That is acceptable. The point is pressure, not perfection.

---

## Customising the rules

If you want to tune it to your own style:

1. Open `script.js` in a text editor.
2. Edit the word lists near the top:

   - `hedgingWords`
   - `softeners`
   - `emotionalQualifiers`
   - `modifiers`
   - `cliches`

3. Add or remove phrases as you like.

You can also tweak the scoring logic inside `analyzeText()` if you want a harsher or more forgiving scale.

---

## Files

- `index.html` — main UI shell.
- `style.css` — layout and visual style (dark, noir-inspired).
- `script.js` — all analysis logic and interaction.
- `README.md` — this file.

---

## Notes

- No build step, no backend, no tracking.
- Pure HTML/CSS/JS.
- Designed to be a **seed tool**: a small, janky but focused starting point you (or others) can fork and extend.

Use it to train yourself to write in a colder, more declarative voice—  
or use it as a base to build a more elaborate “harsh style suite.”
