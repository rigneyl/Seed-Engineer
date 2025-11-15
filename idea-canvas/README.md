# Idea → Launch Manuscript Studio (MVP v2)

A lightweight in-browser tool to help you:

1. Capture lots of **book ideas** quickly.  
2. Turn a chosen idea into a **structured outline**.  
3. Draft each **section in focused chunks**.  
4. Compile everything into a **single manuscript file** you can copy or download.  
5. Back up & restore full projects via simple JSON files.

All data is stored **locally in your browser (localStorage)** – no account, no backend.

---

## What’s new in v2

- **Polished idea cards**  
  Ideas now display in a responsive grid, so cards line up cleanly at different screen sizes.

- **Light / Dark theme toggle**  
  - Dark mode (default) emphasizes a focused, studio-like feel.  
  - Light mode gives you a clean “paper on desk” look.  
  - Your choice is remembered in `localStorage`.

- **Sample project loader**  
  - “Load Sample Project” in the header populates:
    - A couple of example ideas
    - A partial outline
    - Some drafted text and notes  
  - Great for demoing or onboarding.

- **About & Help tabs**  
  - **About** explains the philosophy of the tool (Capture → Structure → Draft → Compile).  
  - **Help** gives you a quick “how to use it” plus keyboard shortcuts.

- **Keyboard shortcuts**
  - `Alt + 1` → Ideas  
  - `Alt + 2` → Outline  
  - `Alt + 3` → Draft  
  - `Alt + 4` → Export  
  - `Alt + 5` → About  
  - `Alt + 6` → Help  
  - `Ctrl/Cmd + Shift + S` → Save draft for current section  
  - `Ctrl/Cmd + Shift + E` → Refresh export preview and jump to Export tab  

- **Project backup & restore**
  - Download your whole project as a `.json` backup.
  - Load that backup later (or on another machine) to restore all ideas, outline sections, drafts, and notes.

---

## Core Features

### Idea Canvas
- Add title, hook, type (fiction / non-fiction / hybrid), genre, notes, and an excitement rating.
- See a grid of saved ideas with clean cards.
- Pick any idea as the basis for an outline (“Use for Outline”).

### Outline Builder
- Shows the currently selected idea.
- Choose a structure:
  - Non-fiction · Linear (Problem → Solution)
  - Non-fiction · Playbook / Steps
  - Fiction · 3-Act
- Auto-generates an outline with editable section titles + notes.

### Draft Workspace
- Left: list of outline sections with status (Empty / Drafted).
- Right: drafting area for the selected section.
- Word count for the current section.
- Per-section save + clear.

### Export & Backup
- Compile selected idea, outline, and drafts into a single manuscript preview.
- One click to:
  - Refresh preview
  - Copy to clipboard
  - Download as `.txt`
- Backup:
  - Download a `.json` file containing all project data.
  - Load a `.json` backup to restore a project (“previously created file”).

---

## How to run

1. Download and unzip the project.
2. Open `index.html` in any modern browser (Chrome, Edge, Firefox, Safari).
3. (Optional) Click **Load Sample Project** in the header to see a pre-populated example.

No build step or server is required – everything is plain HTML/CSS/JS.

---

## Files

- `index.html` — main UI layout and tab structure.
- `style.css` — light/dark theme styling and polished card layout.
- `app.js` — application logic, keyboard shortcuts, sample data, and backup import/export.
- `README.md` — this file.

---

## Notes & Possible Extensions

- Multi-project support (switch between separate books).
- Custom outline templates.
- Export to Markdown / simple EPUB-ready markup.
- Time-tracking & streak visualizations.
- Integration with your other tools (WriterOS, Ink After Midnight, etc.).
