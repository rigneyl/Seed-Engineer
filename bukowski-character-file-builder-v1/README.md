# Bukowski’s Character File Builder

A tiny, HTML-first, local-only tool to build your own grimy, flawed “Chinaski”-style character.

No accounts. No backend. No tracking. Just one page, your browser, and a pile of vices.

---

## Files

- `index.html` – open this in your browser to use the tool.
- `style.css` – minimal dark UI styling. Tweak or replace with your own base CSS.
- `app.js` – all logic lives here.
- `LICENSE.txt` – simple permissive license.

You can drop this whole folder anywhere (desktop, Dropbox, USB stick) and open `index.html` directly.

---

## What it does

The builder helps you create a **deeply human, unromanticised character** by focusing on:

- rough visual sketch (“Sketch & Face”)
- flaws, addictions, freedoms, debts, vices (“Grit Ledger”)
- their room and bar environment
- their job and neighborhood
- a vice progression timeline
- what they deserve vs what they actually get
- a self-insertion slider (how much of them is secretly you)

As you add details, it:

- **unlocks writing prompts** tailored to your choices
- computes rough scores:
  - **Character Dirt Score**
  - **Human Mess Index**
  - **Realism vs Romance**
  - **Self-insertion Fingerprint**
- lets you **export everything** as:
  - Markdown (`*_character.md`)
  - JSON (`*_character.json`)

The app is intentionally “seed-like”: small, inspectable, easy to remix or extend.

---

## How to use

1. **Open the app**

   - Double-click `index.html`  
   - Or drag it into a browser window  
   - Works fully offline.

2. **Name your character**

   - Top-right: add a **Name** and **Tagline**.  
   - The tagline is one sharp line that sums them up.

3. **Sketch & Face**

   - Click chips like “Tired eyes”, “Cigarette”, “Bottle in hand”.
   - They appear in the **Sketch** box as tokens.
   - Each one adds at least one **prompt** to the right-hand side.

4. **Grit Ledger**

   - Go to the **Grit Ledger** tab.
   - For each category (Flaws, Addictions, Freedoms, Debts, Vices), click `+ Add`.
   - Enter **short, sharp sentences**:
     - “Jealous of anyone who seems content.”
     - “Drinks alone to avoid talking.”
   - Each entry adds extra prompts.

5. **Room & Bar**

   - In **Room & Bar**, pick objects like:
     - Mattress on floor
     - Overflowing bin
     - Wobbly bar stool
     - Jukebox, neon sign, bartender
   - Click an object chip, then click cells in the grid to place it.
   - Clicking a filled cell with no chip selected clears it.
   - Every placed item adds another prompt.

6. **Job & Neighborhood**

   - Pick a **Job** (factory worker, dishwasher, call centre grunt…) and a **Neighborhood**.
   - Use the textareas to describe:
     - Smells, noise, routines, tiny daily humiliations.
   - These feed into the analysis and prompt pool too.

7. **Extras**

   - **Bukowski Line Generator** – click for a random line to spark a scene.
   - **Vice Progression Timeline** – fill in:
     - Childhood crack
     - First escape
     - When habit became chain
     - Current mess
   - **What They Deserve vs What They Get** – add harsh side-by-side entries.
   - **Self-insertion Slider** – set how much of this character is secretly you.
     - The label explains the range in plain language.

8. **Analysis**

   - In the **Analysis** section (right column) click **Recalculate Metrics** any time.
   - You’ll see:
     - Dirt Score & note
     - Mess Index & note
     - Realism vs Romance
     - Self-insertion Fingerprint

   These are not scientific, just playful nudges to help you push the character away from clichés.

9. **Export**

   - Use:
     - **Download Character (Markdown)** – for your notes / project files.
     - **Download Character (JSON)** – for saving & reloading in this tool.
   - A short Markdown preview appears in the bottom textarea.

10. **Load from JSON**

    - If you’ve exported JSON before, you can reload it:
      - Click **Load from JSON** file picker.
      - Choose a previously exported `*_character.json` file.
      - The UI will repopulate with all your choices.

---

## Customising / Remixing

- **Change copy & prompts**

  Open `app.js` and look for:

  - `SKETCH_ELEMENTS`
  - `ROOM_ITEMS`
  - `BAR_ITEMS`
  - `JOBS`
  - `NEIGHBORHOODS`
  - `BUKOWSKI_LINES`

  You can:
  - rename elements,
  - add your own entries,
  - change or extend prompts.

- **Change the aesthetic**

  - Tweak colors, radius, and fonts in `style.css`.
  - Or delete most of the CSS and attach your own `base.css`.

- **Integrate into a bigger system**

  - This tool is self-contained.
  - You can embed it in a larger site or app by:
    - copying the layout into your existing HTML,
    - wiring `app.js` to your module system if needed.

---

## Notes

- No external libraries.
- No frameworks.
- No network calls.
- Everything stays in your browser until you hit Export, and even then the files are local downloads.

It’s meant to feel like a little **seed**: grim, useful, and easy to plant inside your own bigger writing lab. 
