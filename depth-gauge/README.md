
# Depth Gauge

A local-first HTML tool that estimates the **philosophical depth** of your writing using handcrafted lexical signals.

No AI. No backend. No tracking. Just static HTML, CSS, and JavaScript.

---

## What it does

Paste text and click **Analyze Depth**. The tool computes:

- **Depth Meter (0–100)**  
  A composite score based on:
  - abstraction ratio  
  - negation ratio  
  - existential keyword density  
  - bleak metaphor clusters  
  - contrast / tension density  
  - coldness vs emotional intensity

- **Signal Counts**
  - Abstractions  
  - Negations  
  - Paradoxical constructions  
  - Existential keywords  
  - Bleak metaphor clusters  
  - Contrast pairs (inside/outside, light/dark, etc.)

- **Ratios & Mood**
  - abstraction ratio  
  - negation ratio  
  - existential density  
  - bleak cluster density  
  - contrast density  
  - coldness ratio  
  - emotion ratio  

- **Warnings**
  The app will warn when your text looks:
  - too shallow  
  - too abstract  
  - too on-the-nose  
  - too emotional  
  - or when “depth leaks” (casual phrases / clichés) appear.

- **Depth Leaks**
  Highlights phrases like “kind of”, “pretty much”, “honestly”, etc.

- **Sentence Breakdown**
  Shows each sentence (up to 40), with tags:
  - `ABS` — abstract terms  
  - `NEG` — negation  
  - `VOID` — existential terms  
  - `BLEAK` — bleak field words  
  - `PARA` — paradox markers (“yet”, “but”, “despite”, “although”)  
  - `TENSION` — contrast pairs present

---

## Files

- `index.html` — Main interface (open this in a browser)
- `styles.css` — Visual styling, dark + light theme
- `script.js` — All logic (pure JS)
- `README.md` — This file

---

## How to use

1. **Download & unzip** the package.
2. Open `index.html` in your browser (Chrome, Edge, Firefox, etc.).
3. Paste any text into the **Text to Analyze** area.
4. Click **Analyze Depth**.
5. Read the **Depth Meter**, **Warnings**, and **Sentence Breakdown**.
6. Adjust your writing and re-run to compare changes.

Everything runs locally in your browser. Your text never leaves your machine.

---

## Customising the tool

You can tweak the behaviour without adding any external dependencies.

### 1. Modify lexical lists

Open `script.js` and look for these arrays near the top:

- `abstractions`
- `existential`
- `bleakFieldWords`
- `negations`
- `contrastPairs`
- `emotionalMarkers`
- `emotionalIntensifiers`
- `coldPronouns`
- `leaks`

Add or remove entries to tune the detector for your style, genre, or language.

### 2. Adjust scoring

The `computeDepthScore` function controls how the overall depth score is calculated.
You can change the weights to make different signals matter more or less.

```js
function computeDepthScore(stats) {
  const {
    abstractionRatio,
    negationRatio,
    existentialRatio,
    metaphorDensity,
    contrastDensity,
    coldnessRatio,
    emotionRatio
  } = stats;

  let score =
    abstractionRatio * 100 * 0.25 +
    negationRatio * 100 * 0.15 +
    existentialRatio * 100 * 0.25 +
    metaphorDensity * 20 * 0.15 +
    contrastDensity * 20 * 0.2 +
    coldnessRatio * 50 * 0.05 -
    emotionRatio * 70 * 0.05;

  // ...
}
```

Change the coefficients to match what **you** think depth should feel like.

### 3. Change depth zones

The labels for ranges (Surface, Reflective, Existential, Abyssal) are in `depthZoneLabel`.
You can rename and re-range them as you like.

---

## Theme

- Default is **dark mode**.
- Click **Toggle Theme** in the header to switch between **dark** and **light**.
- The choice is stored in `localStorage` under the key `depth-gauge-theme`.

Visual tweaks (colors, fonts, radii) all live in `styles.css`.

---

## Notes

- This is **not** a scientific measure of depth. It’s a playful, deterministic lens.
- Results are best used as a provocation, not a verdict.
- Because it’s vanilla HTML/JS, you can drop this into any static site or tool library.

Feel free to fork, bend, and break it for your own misanthropic or existential experiments.


## v1.3 – Depth Modes

Header selector lets you choose:

- **Mode A – Writerly Depth (`writerly`)**
  Rewards abstractions, paradox density, contrast pairs, bleak metaphors.
- **Mode B – Existential/Bleak (`existential`)**
  Rewards existential keywords, bleak metaphors, negations, coldness.
- **Mode C – Hybrid (`hybrid`)**
  Balanced mix of structure + existential weight.

The Depth Meter score now depends on the selected mode.
