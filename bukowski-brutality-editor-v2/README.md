# Bukowski Brutality Editor

A live, local-only text editor that bullies your prose toward Bukowski-style rawness.

No accounts. No backend. No tracking. Just a single-page HTML app.

---

## What it does

As you type on the left, the right-hand **Brutality Dashboard** updates live and calls you out for:

- **Overly poetic lines** — lyrical fluff gets flagged.
- **Metaphor overload** — too many "like/as if" constructions.
- **Academic phrasing** — seminar-room weasel words.
- **Sentences that run too long** — anything past ~18 words.
- **Fancy vocabulary** — Latinate words with plain Anglo-Saxon alternatives.
- **Emotional dishonesty** — hedges and softening language.

It also computes:

- **Grit Level** — how concrete, coarse, and grounded your language is.
- **Pretension Warning** — the MFA / academic / poetic index.
- **Rawness Score** — short, blunt, and unsentimental expression.
- **Whiskey-to-Weakness Ratio** — strong words vs hedges and softeners.

All analysis is heuristic and rule-based. No AI, no requests to the internet.

---

## Files

- `index.html` — main app page  
- `style.css` — all styling for the layout and dashboard  
- `script.js` — the live analysis logic  
- `README.md` — you are here  

You can open `index.html` directly in any modern browser.

---

## How to use

1. **Unzip** the package somewhere on your machine.
2. Double-click `index.html` (or open it with your browser).
3. Start typing in the **Your Text** panel (left).
4. Watch the **Brutality Dashboard** (right) update with:
   - live meters
   - counts
   - lists of specific lines and sentences to fix

There is no auto-save. If you like what you wrote, **copy/paste it into your own editor** or save the page’s text manually.

---

## Customising the rules (optional)

All the analysis rules live in `script.js`.

You can edit the word lists to match your own taste:

- `poeticWords` — anything you consider too flowery / lyrical.
- `metaphorMarks` — patterns that suggest metaphor or simile.
- `academicWords` — seminar / journal-speak.
- `fancyToPlain` — mapping of “fancy” words to blunt alternatives.
- `hedges` and `softeners` — phrases that weaken the impact.
- `strongWords`, `curseWords`, `concreteWords` — things that boost grit and rawness.

You can also tweak thresholds:

- Sentence length limit (currently 18+ words counts as “long”).
- Weighting of different factors in the grit / pretension / rawness scores.

---

## Notes

- Everything runs in your browser, on your machine.
- There is **no network activity** and no external libraries.
- This is a **seed tool** – you can fork it into your own “brutality editors” or integrate it into a bigger offline writing lab.

Hidden comment in `script.js`:

> `// Seed engineered for misanthropic writers.`

Use it, break it, ship your own version.
