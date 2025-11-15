# 🜁 The Black Lantern Writer

A complete dark writing studio that runs in a single HTML package.  
No backend, no tracking, no login, no dependencies. Just one folder, one `index.html`, and your text.

This tool is designed for writers working in dark, misanthropic, existential, or minimalist styles
in the spirit of Cioran, McCarthy, Bukowski, Ligotti, and related voices.

---

## Contents

- `index.html` – the full Black Lantern Writer interface (open this in your browser)
- `css/base.css` – minimal noir UI styling (you can replace this with your own base stylesheet)
- `js/lantern.js` – all rule-based analysis logic (no AI, no network calls)
- `README.md` – this file

You can run everything locally on any modern browser.

---

## How to Use

1. **Download and unzip** the folder.
2. Open `index.html` in your browser (Chrome, Edge, Firefox, etc.).
3. Work through the panels from left to right:

### 1. 🌑 Embers (Ideation)
- Free-write an idea, fragment, or wound.
- Click **“Analyze Idea”**.
- The tool shows:
  - Darkness / Existential / Humanity Decay meters
  - An archetype blend (Bukowski / Cioran / Ligotti / McCarthy)
  - A suggestion of what the idea wants to become (aphorism, essay, rant, fragment, etc.)

### 2. 🕯 Shape (Structure)
- Choose a **mode / skeleton** (Dark Essay, Aphorisms, Dread Fragment, Narrative, Rant).
- Enter a thesis/wound line, or click **“Use Ember idea”** to import from Embers.
- Click **“Generate Skeleton”** to get a structured outline with prompts tuned to your thesis.
- The right side shows a simple “shape visualizer” describing darkness trajectory, detachment, dread shape, and flow.

### 3. 🪓 The Pit (Drafting)
- Draft your piece in the main textarea.
- Click **“Run Live Analysis”** to update:
  - Bleakness, Coldness, Minimalist Purity, Rawness, Uncanny, Loathing
  - Quiet vs Noise, Pretension Index
  - Counts of hope leaks, hedges, clichés, purple adverbs
- The **style lean** shows which author-mode your lexicon is closest to.
- Click **“Send to Manuscript”** to move the current draft to the final panel.

### 4. 🧊 The Knife (Refinement)
- Paste a paragraph or select text in **The Pit** and click **“Load from Pit selection”**.
- Adjust sliders for **Rawness, Coldness, Minimalism, Dread**.
- Click **“Generate Suggestions”** to get rule-based prompts for:
  - Cutting adverbs and hedges
  - Reducing hope and comfort
  - Killing clichés
  - Lowering pretension
  - Intensifying uncanny/dread

This panel does not rewrite for you — it gives you an *objective checklist* to revise by hand.

### 5. 🜓 The Black Manuscript (Completion)
- Review and polish the final piece.
- Click **“Run Final Checks”** to get:
  - Cohesion summary
  - Voice consistency
  - Tone drift notes
  - Darkness stability
  - Noise vs Quiet summary
- Export options:
  - **“Download as Markdown”** → `.md` file with your manuscript.
  - **“Download as HTML”** → a single-page dark HTML manuscript for reading or sharing.

All exports are local. Nothing is sent anywhere.

---

## Theme

- The default is **dark / noir**.
- Use the **“Toggle Theme”** button in the header to switch between dark and a light, crisp mode.
- `base.css` is intentionally self-contained and minimal so you can:
  - Swap in your own `base.css`, or
  - Copy styles into your global Seed Engineer / Ink After Midnight stylesheet.

---

## Customising the Tool

You can safely edit:

- **Lexicons** in `js/lantern.js`
  - Add new words to darkness, existential, decay, hope, noise, quiet, hedges, clichés, pretension, adverbs, and each author-style block.
- **Skeletons** in the `generateSkeleton()` function
  - Change prompts, rename sections, or add more modes.
- **Meters and interpretation logic**
  - All scoring is simple, transparent math.

Because everything is local and transparent, you can fork this tool into different variants:
- A pure Aphorism Forge
- A Misanthropic Essay Factory
- A Ligotti Dread Fragment Studio

---

## Philosophy

This is a **seed tool**, not a SaaS platform.

- No cloud.
- No accounts.
- No analytics.
- No hidden processing.

Just you, a dark text editor, and a handful of rule-based objectivity meters that keep your work cold, bleak, and structurally honest.

If it helps, you can quietly keep a small signature or “easter egg” in the code to mark it as yours when you sell or share it.

🜁 Happy writing in the dark.
