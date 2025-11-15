# Seed Engineer Lab · Writer Mechanics Suite · v1.10

This bundle includes a primary focus-writing space, a stitched manuscript dashboard, plus sixteen diagnostic tools,
all HTML-first and offline.

Go way beyond basic grammar checking. Dig into exactly how to perfect your writing with reports that check for
overused words, tired clichés, awkward phrasings, and more.

## Main workspace

- Focus Writer (`focus-writer/`)
  - Minimalistic writing space
  - Local autosave in the browser
  - Open `.txt` / `.md` files
  - Download plain-text copies

## Overview

- Manuscript Snapshot Dashboard (`manuscript-dashboard/`)
  - Paste a long chunk and see stitched metrics:
    - Mechanics snapshot (length, passive/weak verbs)
    - Repetition & lexicon
    - Pacing overview
    - Sensory balance
    - Tone & mood (distance + lexical mood)
    - Style flavour (brutality + minimalism approximations)

## Core mechanics

- Snippets Library (`snippets/`)
- Rephrase Studio (`rephrase-tool/`)
- Beyond Grammar Report (`beyond-grammar/`)
- Clarity & Clunkiness Checker (`clarity-clunkiness/`)
- Readability & Density Analyzer (`readability-density/`)
- Overused & Repeated Words Scanner (`overused-repeated/`)
- Passive Voice & Weak Verbs Finder (`passive-weakverbs/`)


## Sparks tools

- Sparks Edit & Inspire (`sparks-studio/`)
  - Sparks Edit: improve readability and fluency, nudge toward a different tense or person, and optionally attach a sensory hook line.
  - Sparks Inspire: generate structured prompts for new dialogue, emotional shifts, and sensory or setting expansion.

## Fiction / depth tools

- Pacing Heatmap (`pacing-heatmap/`)
- Sensory Detail Meter (`sensory-meter/`)
- Sensory Report (`sensory-report/`)
- Dialogue & Balance Report (`dialogue-balance/`)
- Author Comparison Lab (`author-compare/`)

## Niche spice (misanthropic / stylistic)

- Bukowski Brutality Editor (`bukowski-brutality/`)
- McCarthy Minimalism Engine (`mccarthy-minimalism/`)
- Inhuman Distance Checker (`inhuman-distance`)
- Lexical Mood Scanner (`lexical-mood/`)

All tools share:

- `shared/base.css` — layout + styling
- `shared/utils.js` — tokenisation & text stats

## Launcher

Open the root `index.html` to see a launcher page with cards for the Focus Writer, the Manuscript Snapshot Dashboard,
the Beyond Grammar Report, and all other diagnostics. Click any card to open that tool in the same browser.

Everything runs locally. No backend, no tracking, no external dependencies.
