# Misanthropic Tone Studio v1.1

An enhanced single-file HTML application for analyzing writing tone with a focus on misanthropic clarity, identifying soft/hopeful language, and analyzing structural patterns.

## What's New in v1.1

### Quick-Win Improvements Implemented

#### 1. **Debounced Analysis** ⚡
- Analysis now runs 300ms after you stop typing
- Prevents performance issues with long texts
- Smooth, responsive user experience

#### 2. **LocalStorage Persistence** 💾
- Your text content is automatically saved to browser storage
- Profile selection and intensity settings are remembered
- Settings persist across sessions
- Auto-saves every 2 seconds while typing
- Restores your previous session on reload

#### 3. **Keyboard Shortcuts** ⌨️
- `Ctrl/Cmd + Enter` — Run analysis
- `Ctrl/Cmd + K` — Toggle focus mode (hide/show analysis panel)
- `Ctrl/Cmd + L` — Clear editor
- `Ctrl/Cmd + S` — Save to file
- `Ctrl/Cmd + Shift + C` — Copy editor content
- `?` — Show keyboard shortcuts help modal

#### 4. **Improved Mobile Responsive Layout** 📱
- Better breakpoints for tablets and phones
- Touch-friendly button sizing (44px min-height on mobile)
- Improved layout stacking on small screens
- Controls adapt to available space

#### 5. **Clear Button** 🗑️
- Added "Clear" button in editor toolbar
- Confirms before clearing to prevent accidents
- Quick way to start fresh

#### 6. **Analysis Timestamp** ⏰
- Shows when analysis was last run
- Displays time in your local timezone
- Updates with each analysis
- Helps track your work sessions

#### 7. **Extended Text Statistics** 📊
- **Paragraph count** — Track document structure
- **Longest sentence** — Identify complexity outliers
- **Average sentence length** — Already existed, now more prominent
- All stats update in real-time as you type

#### 8. **Copy-to-Clipboard Functionality** 📋
- Copy editor content with one click
- Copy highlighted preview text
- Toast notifications confirm successful copies
- Fallback support for older browsers

#### 9. **Toast Notifications** 🔔
- Visual feedback for user actions
- Notifications for: saved, copied, cleared, file loaded, analysis complete
- Auto-dismisses after 2.5 seconds
- Non-intrusive design

#### 10. **Keyboard Shortcuts Help Modal** ❓
- Press `?` to view all keyboard shortcuts
- Comprehensive feature documentation
- Tips for efficient usage
- Close with `Escape` or click outside

### Cross-Tab Data Sharing

**Per-Sentence Tone Map in REWRITE Tab**
- The complete per-sentence tone map from the TONE tab now also appears in the REWRITE tab
- No need to switch tabs to see sentence-by-sentence tone scores while working on rewrites
- Click any sentence in either tab to focus on it and see targeted prompts
- Helps you identify which sentences need rewriting based on their soft/misanthropic weights

## Additional Improvements

### Security
- Added Content Security Policy (CSP) meta tag
- Input sanitization for XSS prevention

### Accessibility
- ARIA labels on all interactive elements
- Keyboard navigation support throughout
- Screen reader friendly structure

### Code Quality
- Organized configuration into `CONFIG` object
- Debounce and autosave utilities
- Better error handling
- More maintainable code structure

## How to Use

1. **Open `index.html`** in any modern web browser
2. **Start writing** in the editor on the left
3. **Click "Analyze"** or press `Ctrl+Enter` to run analysis
4. **Review results** in the right panel (or toggle it off with `Ctrl+K`)

### Navigation Tabs

- **TONE**: Core misanthropic vs. soft/hopeful analysis with tone scores, per-sentence breakdown, and tone trajectory
- **STRUCTURE**: Grammar and pacing analysis including sentence length, passive voice, and filler detection
- **PSYCHOLOGY**: Pronoun alignment (I/we/you/they), moral vocabulary, and empathy stance assessment
- **REWRITE**: Actionable rewrite prompts with per-sentence tone map and focused suggestions
- **HELP**: Comprehensive feature guide explaining all analysis options, profiles, archetypes, and workflow tips
- **ABOUT**: Brief summary of what the tool is for and its philosophy

### Key Features

- **Tone Analysis**: Detects misanthropic vs. soft/hopeful language with weighted scoring
- **Sentence-by-Sentence Breakdown**: Click sentences to see focused prompts and tone metrics
- **Grammar & Structure**: Identifies long sentences, passive voice, filler words, and repetition
- **Psychological Calibration**: Analyzes pronoun usage and moral vocabulary patterns
- **Semantic Texture**: Evaluates descriptor density, visual imagery, and tense distribution
- **Rewrite Suggestions**: Context-aware prompts calibrated to your chosen profile and archetype
- **Export Report**: Print or save comprehensive diagnostic reports

### Profiles

- **Cold Analyst**: Surgical language, understatement over theatrics
- **Scorched-Earth Rant**: Controlled fury with coherent structure
- **Elegiac Ruin**: Contempt paired with imagery and mourning

### Archetypes

- **The Nihilist**: Explicit futility, no accidental redemption
- **The Cynic**: Sarcasm and cutting observations
- **The Stoic**: Neutral description, flattened affect
- **The Hermit**: Distance and solitude, outside the herd

## Technical Details

- **100% Client-Side**: No server required, all processing in browser
- **Single File**: Complete application in one HTML file
- **Zero Dependencies**: Pure vanilla JavaScript, HTML, and CSS
- **localStorage API**: For data persistence
- **Clipboard API**: For copy functionality
- **LanguageTool Integration**: Optional grammar checking (requires internet)

## Browser Compatibility

Works in all modern browsers:
- Chrome/Edge 88+
- Firefox 87+
- Safari 14+
- Opera 74+

## Privacy

- All data stays in your browser
- No analytics or tracking
- No external dependencies except optional LanguageTool API
- LocalStorage can be cleared at any time

## File Structure

```
.
├── index.html          # The complete application
├── README.md           # This file
└── attached_assets/    # Original file for reference
    └── index13_*.html
```

## Version History

### v1.1 (November 2025)
- Debounced analysis for better performance
- LocalStorage persistence
- Keyboard shortcuts
- Mobile responsive improvements
- Clear button
- Analysis timestamp
- Extended statistics (paragraphs, longest sentence)
- Copy-to-clipboard functionality
- Toast notifications
- Help modal
- Security & accessibility improvements
- Per-sentence tone map in REWRITE tab (cross-tab data sharing)
- New HELP tab with comprehensive feature documentation
- Simplified ABOUT tab with brief tool summary

### v1.0 (Original)
- Initial release with core tone analysis features

## License

This is a standalone tool. Use freely for your writing projects.

## Support

For issues or questions about the enhancements, refer to the keyboard shortcuts help (press `?` in the app) or review this README.

---

**Tip**: Try focus mode (`Ctrl+K`) for distraction-free writing, then analyze when ready!
