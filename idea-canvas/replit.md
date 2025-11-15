# Idea → Launch Manuscript Studio

## Overview

Idea → Launch Manuscript Studio is a lightweight, offline-first Progressive Web Application (PWA) for book writing. It provides a structured workflow that guides writers from brainstorming multiple book concepts to producing a complete, export-ready manuscript. The application runs entirely in the browser with no backend dependencies, storing all data locally using localStorage.

The tool implements a four-stage writing process:
1. **Idea Canvas** - Rapid capture of book concepts with metadata (title, hook, genre, type, excitement level)
2. **Outline** - Transform selected ideas into structured outlines using templates (nonfiction linear, nonfiction playbook, fiction 3-act)
3. **Draft** - Section-by-section writing with real-time word counts and independent save states
4. **Export** - Compile drafts into a unified manuscript with multiple export formats (plain text, Markdown, JSON backup)

The application emphasizes focused, modular writing by breaking manuscripts into manageable sections, reducing the intimidation of blank pages while maintaining overall structure.

## Recent Changes

**November 10, 2025** - Professional Polish v5 Release (Production Ready):
- **CRITICAL FIX**: Resolved data integrity bug in state loading that could cause data contamination when loading backups or sample projects
- Enhanced localStorage error handling with quota monitoring, size warnings, and graceful fallback messaging
- Added comprehensive mobile/tablet responsive CSS with touch-friendly targets (44px minimum) and breakpoints at 960px, 768px, and 480px
- Implemented landscape orientation support for mobile devices
- Added three new outline templates: Memoir (personal transformation arc), Business Book (executive structure), and Self-Help (progressive change framework)
- Added browser compatibility check that warns users of very old browsers lacking required features
- Improved export format to properly preserve paragraph breaks in both plain text and Markdown outputs
- Enhanced sample project loader to completely replace state without property leakage
- Updated service worker cache to v10 for production deployment
- Verified all state-loading mechanisms (localStorage, backup restore, sample project) perform clean overwrites

**November 10, 2025** - Professional Polish v4 Release (Workflow Enhancements):
- Implemented idea sorting/filtering with dropdown (sort by excitement, date added, or type/genre)
- Added drag-and-drop reordering for outline sections with visual drag handles and smooth animations
- Implemented keyboard navigation in draft tab (arrow keys to navigate between sections)
- Added distraction-free writing mode toggle that hides right sidebar for focused sessions
- Fixed drag-and-drop insertion bug when moving items downward
- Extended state with `ideaSortBy`, `distractionFreeMode`, and `wordCountGoals` properties
- Ideas now include `createdAt` timestamps for sorting functionality

**November 10, 2025** - Professional Polish v3 Release:
- Added toast notification system for non-blocking user feedback on all major actions
- Implemented auto-save with visual indicator (1500ms debounce)
- Enhanced export system with Markdown format option alongside plain text
- Added drag-and-drop support for backup file imports
- Implemented localStorage quota monitoring with visual storage bar and warnings
- Added offline/online connection status indicator in footer
- Created PWA install prompt with custom button in header
- Enhanced UI with smooth transitions, hover effects, and loading states
- Added keyboard shortcuts documentation in Help tab
- Improved backup/restore workflow with file validation

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Single-Page Application (SPA)**: Vanilla JavaScript implementation without framework dependencies, using a tab-based navigation system. State management is centralized in a single global state object that syncs with localStorage.

**Component Structure**: The UI is organized into functional tabs (Ideas, Outline, Draft, Export, About, Help) with dynamic rendering controlled by data-driven templates. Each tab represents a discrete stage in the writing workflow.

**State Management**: Application state follows an immutable update pattern where state modifications trigger both localStorage persistence and UI re-rendering. The state object contains:
- `ideas[]` - Array of book concept objects (each with `createdAt` timestamp for sorting)
- `selectedIdeaId` - Currently active idea
- `outline[]` - Section structure for the selected idea
- `drafts{}` - Key-value map of section titles to draft text
- `sessionNotes` - Freeform notes area
- `ideaSortBy` - Current sort order for ideas list (excitement, date, type/genre)
- `distractionFreeMode` - Boolean toggle for focused writing mode
- `wordCountGoals` - Section and total manuscript word count targets

**Progressive Enhancement**: The application implements PWA features including service worker caching, offline support, installability, and connection status monitoring. Auto-save functionality (1500ms debounce) prevents data loss.

### Data Storage Solutions

**localStorage as Primary Database**: All application data persists in browser localStorage using JSON serialization. Two storage keys are used:
- `ideaLaunchStudioState_v1` - Complete application state
- `ideaLaunchStudioTheme_v1` - User theme preference (light/dark)

**Backup/Restore System**: Users can export complete projects as downloadable JSON files and restore them later, enabling cross-device transfer and version control outside the application.

**No Backend Rationale**: The decision to use exclusively client-side storage eliminates hosting costs, simplifies deployment (static files only), ensures user privacy (no data leaves the device), and provides instant offline functionality. Trade-offs include lack of cross-device sync and dependency on browser storage limits.

### Theming System

**CSS Custom Properties**: Theme implementation uses CSS variables (`--bg`, `--text`, `--accent`, etc.) that are redefined under the `.theme-light` body class. This allows instant theme switching without reloading stylesheets.

**Theme Persistence**: User theme choice is stored independently in localStorage and applied on page load, maintaining consistency across sessions.

### PWA Implementation

**Service Worker Strategy**: Cache-first strategy for static assets (`index.html`, `style.css`, `app.js`, `manifest.json`). The service worker intercepts network requests, serving cached versions when available and falling back to network for uncached resources.

**Installation Prompt**: The application captures the `beforeinstallprompt` event to control install timing, showing a custom install button rather than relying on browser default prompts.

**Offline Indicators**: Connection status is monitored via `navigator.onLine` events, displaying visual feedback to users about their network state.

### Export System

**Multiple Format Support**: The export system generates manuscripts in three formats:
1. **Plain Text** - Simple concatenation of drafted sections
2. **Markdown** - Structured output with section headers for compatibility with publishing tools
3. **JSON** - Complete project backup including all metadata, outlines, and drafts

**Clipboard Integration**: Export preview includes one-click copy-to-clipboard functionality using the Clipboard API.

### User Experience Patterns

**Keyboard Shortcuts**: Global keyboard handlers provide quick navigation (`Alt + 1-6` for tabs) and common actions (`Ctrl/Cmd + Shift + S` for save, `Ctrl/Cmd + Shift + E` for export).

**Toast Notifications**: Non-blocking feedback system for user actions (save confirmations, errors, warnings) with auto-dismiss timers and sliding animations. Success messages use green accent, errors use red, and info messages use the default accent color.

**Drag-and-Drop**: Implemented for backup file imports with visual feedback (drop zone highlights on dragover). Users can drag JSON backup files directly onto the drop zone instead of using the file picker.

**Auto-save**: Debounced auto-save (1500ms delay) prevents data loss while minimizing localStorage write operations. Visual indicator shows "Saving..." during debounce period and "Auto-saved" confirmation with green accent when complete.

**Connection Status**: Real-time online/offline indicator in footer with pulsing dot animation. Displays toast notifications when connection state changes, reassuring users that offline work is preserved locally.

**Storage Monitoring**: Visual progress bar showing localStorage usage with color-coded warnings (green < 60%, orange 60-80%, red > 80%). Displays exact KB usage and alerts users when approaching quota limits.

**PWA Installation**: Custom install button appears in header when app is installable (before default browser prompt). Handles install flow with success/failure feedback via toast notifications.

### Template System

**Outline Templates**: Six predefined outline structures help users scaffold different book types:
- **Nonfiction Linear** - Sequential chapter-based structure for problem/solution books
- **Nonfiction Playbook** - Action-oriented sections with exercises/frameworks for step-by-step guides
- **Memoir** - Personal transformation arc from catalyst through low point to resolution
- **Business Book** - Executive overview, market analysis, strategy, and implementation framework
- **Self-Help** - Progressive change framework from understanding problems to creating lasting transformation
- **Fiction 3-Act** - Classic narrative structure with setup/confrontation/resolution

Templates generate starter outlines with editable section titles and placeholder notes, providing scaffolding while remaining fully customizable.

## External Dependencies

### Browser APIs

**localStorage API**: Primary data persistence layer. Requires browser support for JSON serialization and storage quota management.

**Service Worker API**: Enables offline functionality and app installation. Critical for PWA features.

**Clipboard API**: Provides copy-to-clipboard functionality in the export interface. Requires secure context (HTTPS or localhost).

**Navigation API**: Standard `window.navigator` for online/offline detection and service worker registration.

**beforeinstallprompt Event**: Browser-specific event for controlling PWA installation prompts (Chromium-based browsers primarily).

### Static Assets

**Icon System**: Uses inline SVG for the application icon with gradient effects. Separate PNG exports at 192x192 and 512x512 for PWA manifest icons.

**Web Font Stack**: Relies on system font stack (`system-ui`, `-apple-system`, `BlinkMacSystemFont`, `SF Pro Text`, `Inter`) to avoid external font loading and ensure instant rendering.

### Manifest Configuration

**PWA Manifest** (`manifest.json`): Defines application metadata for installation:
- Display mode: `standalone` (hides browser UI)
- Orientation: `any` (supports all device orientations)
- Theme colors: Matches accent color (`#f5b85c`)
- Shortcuts: Quick actions for new ideas and drafting

### No External Services

The application intentionally avoids external dependencies:
- **No authentication service** - No user accounts
- **No cloud storage** - All data remains local
- **No analytics** - No tracking or telemetry
- **No CDN resources** - No external CSS/JS libraries
- **No API integrations** - Fully self-contained

This architecture prioritizes user privacy, offline reliability, and zero operational costs while accepting limitations in collaboration and cross-device synchronization.