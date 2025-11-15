# Over-Explanation Detector

A single-file HTML tool for writers who tend to **over-explain** their ideas.

- No login
- No tracking
- No backend
- Everything runs locally in your browser

Perfect for essays, philosophy, long-form arguments, and misanthropic manifestos.

---

## Files

- `index.html` — the entire app (UI + logic). Open this in any modern browser.
- `README.md` — this file.

---

## How to Use

1. Open `index.html` in your browser (Chrome, Firefox, Edge, etc.).  
2. Paste your draft into the **Draft** editor on the left, or start typing.  
3. Click **Run Analysis** (or press `Ctrl`/`Cmd` + `Enter`).  
4. Switch to the **Debug View** tab to see your text with highlights.

### What it detects

The right-hand **Over-Talk Report** breaks down your writing into:

- **Intro Clauses** — “In today’s society…”, “Since the dawn of time…”, etc.
- **Throat Clearing** — “I believe that…”, “I would argue that…”, “It seems to me that…”.  
- **Doubling Back** — “What I mean is…”, “In other words…”, “To put it another way…”.  
- **Circular Explanations** — sentences that repeat the previous one with minor wording changes.  
- **Thesis Restatements** — later sentences that keep rephrasing the same core idea.  
- **Meta-Writing** — “This paragraph will…”, “In this section I will…”, etc.

Click any snippet in the report to jump to the matching highlight in the **Debug View**.

### Word / sentence / paragraph stats

Along the bottom of the editor you’ll see:

- Total words  
- Sentence count  
- Paragraph count  

Useful for seeing how bloated a section is as you trim it down.

---

## Themes & Modes

### Dark / Light Theme

- **Ink After Midnight** — default dark mode, good for night writing.  
- **White Page Mode** — clean light mode, book-page style.

Use the **theme toggle** in the top-right of the header. Your choice is saved locally.

### Writing Mode vs Analysis Mode

The **Writing + Analysis** chip in the header controls the right-hand panel:

- **Writing + Analysis** — editor and report visible.  
- **Writing-only** — hides the report so you can focus on drafting.

You can switch mode at any time; your text is never lost.

---

## Debug View & Highlights

The **Debug View** tab shows a **read-only highlighted version** of your draft.

You can also toggle how strong the highlights appear:

- Default: full background highlights for each category.  
- **Raw underlines only**: tones things down to dotted underlines only.

This lets you choose between “full diagnostic mode” and a more subtle view.

---

## Exporting Your Work

Buttons in the toolbar let you export your draft:

- **.md** — downloads your current draft as `draft.md` (plain Markdown / text).  
- **Annotated** — downloads an `annotated-draft.html` file containing your text with all highlights preserved.

Both exports run locally; nothing leaves your machine.

---

## Autosave

Your draft is automatically stored in `localStorage` in your browser:

- Close the tab, reopen `index.html` later — your text should still be there.
- If you want to clear it, simply delete the text and close the tab.

(As always, don’t treat the browser as the only copy of important work — save backups.)

---

## Customisation Ideas

Because this is a pure HTML file, you can:

- Edit the pattern lists in the `<script>` section to match your own bad habits.  
- Tweak the CSS variables at the top of `<style>` to change colours, borders, spacing.  
- Add new panels to the report for things like:
  - “Hedge word density”
  - “Adverb overuse”
  - “Rhetorical question spam”

This is meant to be a **seed tool**: simple, hackable, and easy to remix.

---

## Keyboard Shortcuts

- **Run analysis** — `Ctrl` + `Enter` (Windows/Linux) or `Cmd` + `Enter` (macOS).  
- **Save page as file** — Use your browser’s normal “Save page as…” or `Ctrl/Cmd + S`.

---

## Requirements

- Any modern browser.  
- JavaScript enabled.  
- No network connection required after the file is opened.

Enjoy slicing all the unnecessary scaffolding off your arguments.
