# SourceShadow · Local Style Alignment Lab

SourceShadow is a single-page, local-only writing tool.

You:

- Paste in a **source passage** from another writer (e.g. a page of McCarthy, Bukowski, Ligotti, Cioran, etc.)
- Start writing in the **left editor**
- Watch the **Shadow Dashboard** quietly track how your style drifts from the source

No accounts. No backend. No tracking. Just HTML, CSS, and JavaScript.

---

## Files

- `index.html` — the entire app (HTML, CSS, JS in one file)
- `README.md` — this file

Everything runs in your browser, offline, once opened.

---

## How to use

1. **Open the tool**

   - Double–click `index.html`  
   - Or drag it into a browser window (Chrome, Edge, Firefox, etc.)

2. **Load a source text**

   You have two options:

   **A. Load from a `.txt` file**

   - Click **“Load source (.txt)”**
   - Pick a plain text file
   - The contents will be loaded into the “Source” textarea and locked in

   **B. Paste manually**

   - Paste 1–3 pages of text into the **Source** textarea on the right
   - Click **“Use manual source”** to lock that text in

   > Tip: Give it at least ~80–100 words so the pattern is meaningful.

3. **Start writing**

   - Write into the **left “Writing Surface”** panel
   - The tool will autosave your writing and source in your browser
   - After a few seconds of typing, the **Shadow Dashboard** updates

4. **Read the metrics**

   - **Similarity**: a rough 0–100 score of how close you are to the surface pattern
   - **Avg Sentence Length**: words per sentence (source → you)
   - **Punctuation Density**: commas per 100 words
   - **Dialogue %**: sentences starting with quotes
   - **Lexical Variety**: type–token ratio (unique vs total words)
   - **Tone Vector**:
     - Harsh / Soft
     - Bleak / Hope

5. **Use Focus Mode**

   - Press **F** or click **“Toggle Focus (F)”**
   - The right dashboard fades away
   - The editor grows and becomes a more immersive page
   - Press **F** again to bring the analytics back

6. **Force a manual analysis**

   - Press **Ctrl + Enter** (or Cmd + Enter on Mac)
   - This triggers an immediate recalculation

---

## What the numbers actually mean

This is NOT AI. It’s a rule-based approximation of style using:

- Sentence boundaries and word counts
- Simple dialogue detection (`"` at the start of a sentence)
- Comma counting for rhythm
- Type–token ratio for lexical variety
- Tiny, opinionated word lists for “harsh / soft / bleak / hope” tone signals

It’s meant as **a meter**, not a judge.

Use it to:

- Push your work closer to a model writer
- Or deliberately drift away while watching the gauges
- Or just learn what your **default baseline** looks like

---

## Local storage

The app uses `localStorage` to remember:

- Your current writing
- Your current source text
- The last source you locked in

If you want to “reset” everything:

- Clear your browser’s site data for the file origin
- Or open the file in a different browser

---

## Customising

Because it’s a single HTML file, you’re free to:

- Edit the CSS theme
- Change fonts
- Swap out the tone lexicons in the JS
- Add more metrics or your own experimental gauges

If you remix it, consider leaving a small credit comment somewhere in the code.

---

## Known limitations

- It just looks at **surface-level patterns** (sentence length, punctuation, rough tone words)
- It doesn’t understand meaning or deep structure
- Source and writing samples shorter than ~80 words will produce unstable scores

That’s fine. It’s designed as a **lab instrument**, not a literary oracle.

---

## License

You’re free to use, modify, and sell this as part of your own tools/packages.  
Remove or change branding as you like.

If you want a starting credit line:

> Built from a SourceShadow seed prototype (HTML-only, local-first).
