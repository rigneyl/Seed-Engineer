# Author Comparator · Local Style Lab

A tiny, HTML-first writing tool to compare your prose against a set of literary authors — all running **locally in your browser**, with no tracking, no logins, and no backend.

Built for experimentation, not perfection: it uses simple, transparent heuristics (sentence length, adverb density, dialogue ratio, etc.) to approximate how close your text feels to authors like:

- Gabriel García Márquez  
- Virginia Woolf  
- Ernest Hemingway  
- Toni Morrison  
- Haruki Murakami  
- Charles Bukowski  
- Jane Austen  
- Franz Kafka  
- Jorge Luis Borges  
- Maya Angelou  
- William Faulkner  
- Edith Wharton  
- Yukio Mishima  
- Fyodor Dostoevsky  
- Truman Capote  

…and lets you **add your own authors** to the comparison arsenal.

---

## Files

- `index.html` – the main single-page app  
- `app.js` – all logic for analysis, similarity scoring, and custom authors  
- `README.md` – this file  

Everything is front-end only. No external libraries.

---

## How to Use

1. **Open the tool**

   - Double-click `index.html` or open it in any modern browser (Chrome, Edge, Firefox, etc.).

2. **Paste or write text**

   - Use the left panel’s big text area.
   - Word count, sentence count, and basic stats update live.

3. **Pick authors**

   - In the right panel, use the filter box to search (e.g. `surreal`, `modernist`, `misanthropic`).
   - Tick the authors you want to compare your text against.
   - If you leave everything unchecked, the tool compares against **all** authors.

4. **Click `Analyze`**

   - You’ll get:
     - Global metrics (word count, sentences, averages).
     - One card per author, with:
       - A similarity score (0–100).
       - A short style description.
       - A sample sentence.
       - A tiny differences summary (how your rhythm/lexicon differ).

5. **Adjust your text**

   - Change your prose and re-run Analyze to see the score shifts.

---

## Adding New Authors

You can extend the tool with your own author profiles.

### 1. Use the “Add Author” panel

In the right-hand panel, scroll to **Add Author**:

- **Name** – e.g. `Cormac McCarthy`
- **Style note** – 1–2 lines describing their style.
- **Example sentence** – a representative line or short passage.
- **Avg sentence length** – rough words per sentence (e.g. `12` for minimalists, `30+` for Faulkner).
- **Adverb ratio** – approximate proportion of `-ly` adverbs to words (e.g. `0.02` for sparse, `0.1` for adverb-happy).
- **Dialogue ratio** – rough portion of sentences that are dialogue (0–0.9).
- **Abstract noun ratio** – how much they lean on abstract concepts (0–0.4).
- **Lexical hints** – comma-separated favourite words/themes (optional).

Click **“Save author (local)”**.

This:

- Stores the author in your browser’s `localStorage`.
- Immediately adds them to the author list.
- Keeps them available next time you open `index.html` in the same browser on the same machine.

> Note: this does **not** write any files; it just stores data locally in your browser.

---

## How the Similarity Works (Heuristics)

For each author, the tool keeps a **feature fingerprint**:

- Average sentence length  
- Adverb ratio  
- Dialogue ratio  
- Abstract noun ratio  
- Lexical variety (type-token ratio)  

When you analyze your text, it computes the same stats and then compares them to each author’s fingerprint, producing a **similarity score out of 100**.

This is deliberately simple:

- It **does not** “understand” themes or plot.
- It **does not** use AI or external APIs.
- It only measures surface-level traits: rhythm, density, and lexical patterns.

Treat it as a **craft dashboard**, not a truth oracle.

---

## Theme & Local Data

- The theme toggle (dark/light) is stored in `localStorage`.
- Custom authors are stored under the key:
  - `authorComparator.customAuthors.v1`

If you want a clean reset:

1. Open dev tools in your browser.
2. Clear localStorage for the file origin.
3. Reload `index.html`.

---

## Known Limitations

- Sentence detection is naive (split on `. ! ?`).
- Adverbs are approximated by words ending in `-ly`.
- Abstract words are taken from a small hand-picked list.
- Similarity scores are relative and approximate, not definitive.

For your use case (Seed Engineer style tools), this is a feature: transparent, hackable, and easy to modify.

---

## Modding the Seed

If you want to hard-code additional authors instead of using the UI:

1. Open `app.js`.
2. Add a new object to the `defaultAuthors` array.
3. Refresh `index.html` in the browser.

You can treat this as a base for your own branded “style labs” or bundles.

---

## License

This seed is provided as a simple template. You can:

- Modify it
- Reskin it
- Package it into your own products

Add your own license terms here for buyers if you’re reselling within your ecosystem.
