# Quiet Editor (MVP)
Fullscreen writing mode with a fading cursor, minimalist typography, and optional ambient audio (rain, train, hum). Auto-saves locally in Markdown.

## Features
- **Fading caret** that gently disappears when you pause, and returns on input
- **Ambient audio** generated in-browser (no files): Rain / Train / Hum with volume control
- **Local autosave** to `localStorage`
- **Import / Export** Markdown (`.md`)
- **Fullscreen** toggle and focused, elegant typography
- Keyboard: **Ctrl/Cmd+S** export · **Ctrl/Cmd+N** new · **F** fullscreen · **R/T/H** audio

## How to run
Just open `index.html` in any modern browser. No build step, no dependencies.

## Notes
- Audio is synthesized with the Web Audio API to keep the app self‑contained.
- Content is saved under the key `quietEditorContent.v1` in your browser.
