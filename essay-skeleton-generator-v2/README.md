# Essay Skeleton Generator (Thesis-aware)

Version 2 — now automatically weaves your thesis into each generated question.

## What's new

- A **"Weave thesis into each question"** toggle (on by default).
- When you click **Generate skeleton**:
  - Each question prompt is rewritten to explicitly reference your thesis.
  - A banner at the top of the skeleton shows the current thesis.
- The rest of the behaviour is the same:
  - Argumentative / Reflective / Polemic modes.
  - Custom mode with localStorage preset.
  - Auto-resizing fields.
  - Markdown export, download, and keyboard shortcuts.

## How the thesis weaving works

When the toggle is ON and you have typed a thesis:

- Some questions get the phrase adapted directly, for example:
  - `What is the core claim I am making in this essay?`
  - becomes
  - `What is the core claim I am making in this essay about "Humanity is on its last legs"?`
- Other generic questions get an extra clause added:
  - `What pattern emerges when I put several examples side by side?`
  - becomes
  - `What pattern emerges when I put several examples side by side (specifically about: "Humanity is on its last legs")?`

This is done with simple, transparent string operations — no AI calls, no network requests.

If the thesis is very long, it is truncated for readability with an ellipsis.

If you turn the toggle OFF, the generator falls back to the original generic questions.

Everything is still:

- **HTML-first**
- **Local-only**
- **Single-page** (index.html + base.css)

Replace `base.css` with your own shared base styles to integrate it into your tool ecosystem.
