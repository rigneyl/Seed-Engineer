// Idea → Launch Manuscript Studio v3 - Polished Edition
// Adds: PWA support, auto-save, toast notifications, drag-and-drop, storage monitoring,
// offline indicators, Markdown export, and enhanced UX

const STORAGE_KEY = "ideaLaunchStudioState_v1";
const THEME_KEY = "ideaLaunchStudioTheme_v1";
const AUTO_SAVE_DELAY = 1500;

const defaultState = {
  ideas: [],
  selectedIdeaId: null,
  outline: [],
  drafts: {},
  sessionNotes: "",
  wordCountGoals: {},
  totalWordCountGoal: null,
  ideaSortBy: 'date-desc',
  distractionFreeMode: false
};

let state = loadState();
let autoSaveTimeout = null;
let deferredPrompt = null;

// === Browser Compatibility Check ===

(function checkBrowserCompatibility() {
  const requiredFeatures = {
    'localStorage': typeof Storage !== 'undefined',
    'JSON': typeof JSON !== 'undefined' && typeof JSON.parse === 'function',
    'querySelector': typeof document.querySelector === 'function',
    'addEventListener': typeof window.addEventListener === 'function',
    'fetch': typeof fetch === 'function',
    'Promise': typeof Promise !== 'undefined'
  };

  const unsupported = Object.keys(requiredFeatures).filter(
    feature => !requiredFeatures[feature]
  );

  if (unsupported.length > 0) {
    const message = `Your browser is missing required features: ${unsupported.join(', ')}. ` +
      'Please update to a modern browser (Chrome, Firefox, Safari, or Edge) for the best experience.';
    
    // Show alert for truly ancient browsers
    if (typeof alert === 'function') {
      alert(message);
    }
    
    // Try to show visual warning
    setTimeout(() => {
      const body = document.body;
      if (body) {
        const warning = document.createElement('div');
        warning.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#ff4444;color:#fff;padding:16px;text-align:center;z-index:10000;';
        warning.textContent = message;
        body.insertBefore(warning, body.firstChild);
      }
    }, 100);
  }
})();

// === PWA & Service Worker ===

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => console.log('Service Worker registered'))
      .catch(err => console.log('Service Worker registration failed:', err));
  });
}

// PWA install prompt
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const installPrompt = document.getElementById('install-prompt');
  if (installPrompt) {
    installPrompt.classList.remove('hidden');
  }
});

function setupInstallButton() {
  const installBtn = document.getElementById('install-btn');
  if (!installBtn) return;
  
  installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      showToast('App installed successfully!', 'success');
    }
    
    deferredPrompt = null;
    document.getElementById('install-prompt').classList.add('hidden');
  });
}

// === Toast Notifications ===

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icon = document.createElement('span');
  icon.className = 'toast-icon';
  icon.textContent = type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ';
  
  const messageEl = document.createElement('span');
  messageEl.className = 'toast-message';
  messageEl.textContent = message;
  
  toast.appendChild(icon);
  toast.appendChild(messageEl);
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('hiding');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 3000);
}

// === Connection Status ===

function updateConnectionStatus() {
  const statusEl = document.getElementById('connection-status');
  const statusText = statusEl?.querySelector('.status-text');
  
  if (!statusEl || !statusText) return;
  
  if (navigator.onLine) {
    statusEl.classList.remove('offline');
    statusText.textContent = 'Online';
  } else {
    statusEl.classList.add('offline');
    statusText.textContent = 'Offline';
  }
}

window.addEventListener('online', () => {
  updateConnectionStatus();
  showToast('Back online', 'success');
});

window.addEventListener('offline', () => {
  updateConnectionStatus();
  showToast('You are offline. All changes are saved locally.', 'info');
});

// === Auto-save Indicator ===

function showAutoSaveIndicator(status = 'saving') {
  const indicator = document.getElementById('auto-save-indicator');
  if (!indicator) return;
  
  indicator.className = `auto-save-indicator ${status}`;
  
  if (status === 'saving') {
    indicator.textContent = 'Saving...';
  } else if (status === 'saved') {
    indicator.textContent = 'Auto-saved';
    setTimeout(() => {
      indicator.className = 'auto-save-indicator';
      indicator.textContent = 'Auto-saved';
    }, 2000);
  }
}

// === Storage Monitoring ===

function updateStorageInfo() {
  try {
    const data = JSON.stringify(state);
    const bytes = new Blob([data]).size;
    const kb = (bytes / 1024).toFixed(1);
    
    const storageText = document.getElementById('storage-text');
    const storageBar = document.getElementById('storage-bar');
    
    if (storageText) {
      storageText.textContent = `Storage: ${kb} KB used`;
    }
    
    if (storageBar) {
      const estimatedLimit = 5 * 1024;
      const percentage = Math.min((bytes / 1024 / estimatedLimit) * 100, 100);
      storageBar.style.width = `${percentage}%`;
      
      storageBar.className = 'storage-bar';
      if (percentage > 80) {
        storageBar.classList.add('danger');
        if (percentage > 95) {
          showToast('Storage almost full! Download a backup and clear old data.', 'error');
        }
      } else if (percentage > 60) {
        storageBar.classList.add('warning');
      }
    }
  } catch (e) {
    console.warn('Could not update storage info', e);
  }
}

// === Theme handling ===

function applyTheme(theme) {
  const body = document.body;
  const btn = document.getElementById("theme-toggle-btn");
  if (theme === "light") {
    body.classList.add("theme-light");
    if (btn) btn.textContent = "☀ Light";
  } else {
    body.classList.remove("theme-light");
    if (btn) btn.textContent = "☾ Dark";
  }
}

function getTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  return stored === "light" ? "light" : "dark";
}

function setTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
  applyTheme(theme);
}

// === Persistence helpers ===

function loadState() {
  if (!isLocalStorageAvailable()) {
    console.warn("localStorage not available, using default state");
    setTimeout(() => {
      showToast('localStorage disabled. Your work will not be saved.', 'error');
    }, 1000);
    return { ...defaultState };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultState };
    
    const parsed = JSON.parse(raw);
    
    // Validate that parsed state has expected structure
    if (typeof parsed !== 'object' || parsed === null) {
      console.warn("Invalid state structure, resetting");
      return { ...defaultState };
    }
    
    // Ensure all required properties exist, adding defaults only for missing ones
    const loadedState = {};
    for (const key in defaultState) {
      loadedState[key] = (key in parsed) ? parsed[key] : defaultState[key];
    }
    
    return loadedState;
  } catch (e) {
    console.error("Failed to load state, resetting:", e);
    
    // Notify user that state was corrupted
    setTimeout(() => {
      showToast('Previous session data corrupted. Starting fresh.', 'error');
    }, 1000);
    
    return { ...defaultState };
  }
}

function saveState(showIndicator = true) {
  // Check if localStorage is available
  if (!isLocalStorageAvailable()) {
    showToast('localStorage is disabled. Enable it in browser settings to save your work.', 'error');
    return false;
  }

  try {
    const stateString = JSON.stringify(state);
    
    // Check approximate size before saving
    const sizeInBytes = new Blob([stateString]).size;
    const sizeInKB = Math.round(sizeInBytes / 1024);
    
    // Warn if getting close to typical 5-10MB limits
    if (sizeInKB > 4000) {
      showToast(`Your project is ${sizeInKB}KB. Consider downloading a backup soon.`, 'info');
    }
    
    localStorage.setItem(STORAGE_KEY, stateString);
    
    if (showIndicator) {
      showAutoSaveIndicator('saved');
    }
    updateStorageInfo();
    return true;
  } catch (e) {
    console.error("Failed to save state:", e);
    
    if (e.name === 'QuotaExceededError') {
      showToast('Storage full! Download backup now to prevent data loss.', 'error');
      // Try to at least save theme
      try {
        const currentTheme = document.body.classList.contains('theme-light') ? 'light' : 'dark';
        localStorage.setItem(THEME_KEY, currentTheme);
      } catch {}
    } else {
      showToast('Failed to save. Check browser settings or download a backup.', 'error');
    }
    return false;
  }
}

// Check if localStorage is available and working
function isLocalStorageAvailable() {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

function autoSave() {
  if (autoSaveTimeout) {
    clearTimeout(autoSaveTimeout);
  }
  
  showAutoSaveIndicator('saving');
  
  autoSaveTimeout = setTimeout(() => {
    saveState(true);
  }, AUTO_SAVE_DELAY);
}

// === DOM helpers ===

function $(selector) {
  return document.querySelector(selector);
}

function createEl(tag, className) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  return el;
}

// === Tab navigation ===

function setupTabs() {
  const navButtons = document.querySelectorAll(".nav-btn");
  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabName = btn.dataset.tab;
      document
        .querySelectorAll(".nav-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      document
        .querySelectorAll(".tab")
        .forEach((tab) => tab.classList.remove("active"));
      const tabSection = document.getElementById(`tab-${tabName}`);
      if (tabSection) tabSection.classList.add("active");
    });
  });
}

function switchToTab(tabName) {
  const btn = document.querySelector(`.nav-btn[data-tab="${tabName}"]`);
  if (!btn) return;
  btn.click();
}

// === Ideas ===

function setupIdeaForm() {
  const form = $("#idea-form");
  const scoreInput = $("#idea-score");
  const scoreLabel = $("#idea-score-label");
  const clearBtn = $("#clear-ideas");

  scoreInput.addEventListener("input", () => {
    scoreLabel.textContent = `${scoreInput.value} / 5`;
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = $("#idea-title").value.trim();
    const hook = $("#idea-hook").value.trim();
    const type = $("#idea-type").value;
    const genre = $("#idea-genre").value.trim();
    const notes = $("#idea-notes").value.trim();
    const score = parseInt($("#idea-score").value, 10) || 3;

    if (!title) return;

    const idea = {
      id: Date.now().toString(),
      title,
      hook,
      type,
      genre,
      notes,
      score,
      createdAt: Date.now()
    };

    state.ideas.unshift(idea);
    autoSave();
    renderIdeas();
    updateStats();

    form.reset();
    $("#idea-score").value = score;
    scoreLabel.textContent = `${score} / 5`;
    
    showToast(`Idea "${title}" added`, 'success');
  });

  clearBtn.addEventListener("click", () => {
    if (!state.ideas.length) return;
    const sure = confirm("Clear all saved ideas? This cannot be undone.");
    if (!sure) return;
    state.ideas = [];
    state.selectedIdeaId = null;
    state.outline = [];
    state.drafts = {};
    saveState();
    renderIdeas();
    renderSelectedIdea();
    renderOutline();
    renderDraftOutline();
    updateStats();
    showToast('All ideas cleared', 'success');
  });
  
  const sortSelect = $("#idea-sort");
  if (sortSelect) {
    sortSelect.value = state.ideaSortBy || 'date-desc';
    sortSelect.addEventListener("change", (e) => {
      state.ideaSortBy = e.target.value;
      autoSave();
      renderIdeas();
    });
  }
}

function getSortedIdeas() {
  const ideas = [...state.ideas];
  
  switch (state.ideaSortBy) {
    case 'excitement-desc':
      return ideas.sort((a, b) => b.score - a.score);
    case 'excitement-asc':
      return ideas.sort((a, b) => a.score - b.score);
    case 'title-asc':
      return ideas.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    case 'title-desc':
      return ideas.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
    case 'date-asc':
      return ideas.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
    case 'date-desc':
    default:
      return ideas.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  }
}

function renderIdeas() {
  const list = $("#idea-list");
  const badge = $("#idea-count-badge");

  if (!state.ideas.length) {
    list.className = "idea-list empty-state";
    list.innerHTML = "<p>No ideas yet. Capture the first one above.</p>";
    badge.textContent = "0";
    return;
  }

  list.className = "idea-list";
  list.innerHTML = "";
  badge.textContent = state.ideas.length.toString();

  const sortedIdeas = getSortedIdeas();
  sortedIdeas.forEach((idea) => {
    const card = createEl("div", "idea-card");

    const header = createEl("div", "idea-card-header");
    const titleEl = createEl("div", "idea-card-title");
    titleEl.textContent = idea.title || "Untitled idea";

    const typeEl = createEl("div", "idea-card-type");
    typeEl.textContent = formatType(idea.type);

    header.appendChild(titleEl);
    header.appendChild(typeEl);

    const hookEl = createEl("div", "idea-card-hook");
    hookEl.textContent = idea.hook || "No hook yet.";

    const metaRow = createEl("div", "idea-card-meta");
    const leftMeta = createEl("div");
    if (idea.genre) {
      const genreChip = createEl("span", "chip");
      genreChip.textContent = idea.genre;
      leftMeta.appendChild(genreChip);
    }

    const rightMeta = createEl("div");
    rightMeta.textContent = `Excitement: ${idea.score}/5`;

    metaRow.appendChild(leftMeta);
    metaRow.appendChild(rightMeta);

    const actions = createEl("div", "actions-row");
    const useBtn = createEl("button", "secondary small");
    useBtn.type = "button";
    useBtn.textContent = "Use for Outline";
    useBtn.addEventListener("click", () => {
      state.selectedIdeaId = idea.id;
      autoSave();
      renderSelectedIdea();
      switchToTab("outline");
      showToast(`"${idea.title}" selected for outline`, 'success');
    });

    const deleteBtn = createEl("button", "ghost small");
    deleteBtn.type = "button";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => {
      const ok = confirm("Delete this idea?");
      if (!ok) return;
      state.ideas = state.ideas.filter((i) => i.id !== idea.id);
      if (state.selectedIdeaId === idea.id) {
        state.selectedIdeaId = null;
        state.outline = [];
        state.drafts = {};
      }
      saveState();
      renderIdeas();
      renderSelectedIdea();
      renderOutline();
      renderDraftOutline();
      updateStats();
      showToast('Idea deleted', 'info');
    });

    actions.appendChild(useBtn);
    actions.appendChild(deleteBtn);

    card.appendChild(header);
    card.appendChild(hookEl);
    card.appendChild(metaRow);
    card.appendChild(actions);

    list.appendChild(card);
  });
}

function formatType(type) {
  switch (type) {
    case "nonfiction":
      return "Non-fiction";
    case "fiction":
      return "Fiction";
    case "hybrid":
      return "Hybrid / Experimental";
    default:
      return "Other";
  }
}

// === Selected idea & outline ===

function getSelectedIdea() {
  if (!state.selectedIdeaId) return null;
  return state.ideas.find((i) => i.id === state.selectedIdeaId) || null;
}

function renderSelectedIdea() {
  const panelEmpty = $("#selected-idea-empty");
  const details = $("#selected-idea-details");

  const idea = getSelectedIdea();
  if (!idea) {
    panelEmpty.style.display = "block";
    details.classList.add("hidden");
    return;
  }

  panelEmpty.style.display = "none";
  details.classList.remove("hidden");

  $("#sel-idea-title").textContent = idea.title;
  $("#sel-idea-hook").textContent = idea.hook || "No hook yet.";
  $("#sel-idea-type").textContent = formatType(idea.type);
  $("#sel-idea-genre").textContent = idea.genre || "No genre";
  $("#sel-idea-score").textContent = idea.score.toString();
}

function setupOutline() {
  $("#generate-outline").addEventListener("click", () => {
    const structure = $("#outline-structure").value;
    const idea = getSelectedIdea();
    if (!idea) {
      showToast("Select an idea first (on the Ideas tab)", 'error');
      return;
    }
    state.outline = generateOutlineFor(structure, idea);
    state.drafts = {};
    saveState();
    renderOutline();
    renderDraftOutline();
    updateStats();
    showToast('Outline generated', 'success');
  });
}

function generateOutlineFor(structure, idea) {
  const baseTitle = idea.title || "Your Book";
  if (structure === "nf_linear") {
    return [
      { title: "Introduction — Why " + baseTitle + "?", notes: "" },
      { title: "The Problem", notes: "" },
      { title: "Why Existing Approaches Fail", notes: "" },
      { title: "Your Core Framework", notes: "" },
      { title: "Applying the Framework", notes: "" },
      { title: "Case Studies / Examples", notes: "" },
      { title: "Common Pitfalls", notes: "" },
      { title: "Action Plan & Next Steps", notes: "" },
      { title: "Closing Thoughts", notes: "" }
    ];
  }
  if (structure === "nf_playbook") {
    return [
      { title: "Orientation & Promise", notes: "" },
      { title: "Step 1 — Foundation", notes: "" },
      { title: "Step 2 — Setup", notes: "" },
      { title: "Step 3 — Execution", notes: "" },
      { title: "Step 4 — Optimization", notes: "" },
      { title: "Step 5 — Integration", notes: "" },
      { title: "Resources & Checklists", notes: "" },
      { title: "Long-Term Maintenance", notes: "" }
    ];
  }
  if (structure === "memoir") {
    return [
      { title: "Prologue — The Moment That Changed Everything", notes: "" },
      { title: "Before — The World As It Was", notes: "" },
      { title: "The Catalyst — What Shattered Normal", notes: "" },
      { title: "The Journey Begins — First Steps Into Unknown", notes: "" },
      { title: "The Low Point — When All Hope Faded", notes: "" },
      { title: "The Turning Point — Discovery & Realization", notes: "" },
      { title: "The Climb — Rebuilding & Growing", notes: "" },
      { title: "The Transformation — Who I Became", notes: "" },
      { title: "Reflections — What It All Means Now", notes: "" }
    ];
  }
  if (structure === "business") {
    return [
      { title: "Executive Overview — The Business Case", notes: "" },
      { title: "Chapter 1 — The Market Opportunity", notes: "" },
      { title: "Chapter 2 — The Core Strategy", notes: "" },
      { title: "Chapter 3 — Implementation Framework", notes: "" },
      { title: "Chapter 4 — Metrics & Measurement", notes: "" },
      { title: "Chapter 5 — Overcoming Obstacles", notes: "" },
      { title: "Chapter 6 — Scaling & Growth", notes: "" },
      { title: "Chapter 7 — Real-World Case Studies", notes: "" },
      { title: "Chapter 8 — Your Action Plan", notes: "" },
      { title: "Appendix — Tools & Resources", notes: "" }
    ];
  }
  if (structure === "self_help") {
    return [
      { title: "Introduction — Your Journey Starts Here", notes: "" },
      { title: "Part 1 — Understanding the Problem", notes: "" },
      { title: "Part 2 — Shift Your Mindset", notes: "" },
      { title: "Part 3 — Build Your Foundation", notes: "" },
      { title: "Part 4 — Daily Practices That Work", notes: "" },
      { title: "Part 5 — Overcoming Setbacks", notes: "" },
      { title: "Part 6 — Create Lasting Change", notes: "" },
      { title: "Part 7 — Inspire Others", notes: "" },
      { title: "Conclusion — Your New Beginning", notes: "" }
    ];
  }
  return [
    { title: "Act I — Opening Image & Mood", notes: "" },
    { title: "Act I — Ordinary World", notes: "" },
    { title: "Act I — Inciting Incident", notes: "" },
    { title: "Act I — First Plot Point", notes: "" },
    { title: "Act II — Early Tests & Allies", notes: "" },
    { title: "Act II — Midpoint Shift", notes: "" },
    { title: "Act II — Crisis / All Is Lost", notes: "" },
    { title: "Act III — Climax", notes: "" },
    { title: "Act III — Resolution & Aftermath", notes: "" }
  ];
}

function renderOutline() {
  const list = $("#outline-list");
  const badge = $("#outline-count-badge");

  if (!state.outline.length) {
    list.className = "outline-list empty-state";
    list.innerHTML = "<p>No outline yet. Choose a structure and generate one.</p>";
    badge.textContent = "0";
    return;
  }

  list.className = "outline-list";
  list.innerHTML = "";
  badge.textContent = state.outline.length.toString();

  state.outline.forEach((section, index) => {
    const item = createEl("div", "outline-item");
    item.draggable = true;
    item.dataset.index = index;
    
    item.addEventListener('dragstart', (e) => {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', index);
      item.classList.add('dragging');
    });
    
    item.addEventListener('dragend', () => {
      item.classList.remove('dragging');
    });
    
    item.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      const afterElement = getDragAfterElement(list, e.clientY);
      const draggingItem = document.querySelector('.dragging');
      if (afterElement == null) {
        list.appendChild(draggingItem);
      } else {
        list.insertBefore(draggingItem, afterElement);
      }
    });
    
    item.addEventListener('drop', (e) => {
      e.preventDefault();
      const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
      let toIndex = parseInt(item.dataset.index);
      if (fromIndex !== toIndex) {
        const movedSection = state.outline.splice(fromIndex, 1)[0];
        if (fromIndex < toIndex) {
          toIndex--;
        }
        state.outline.splice(toIndex, 0, movedSection);
        autoSave();
        renderOutline();
        renderDraftOutline();
        showToast('Section reordered', 'success');
      }
    });

    const dragHandle = createEl("div", "drag-handle");
    dragHandle.innerHTML = '⋮⋮';
    dragHandle.title = "Drag to reorder";

    const contentContainer = createEl("div");

    const titleInput = createEl("input", "outline-item-title");
    titleInput.value = section.title;
    titleInput.addEventListener("input", (e) => {
      state.outline[index].title = e.target.value;
      autoSave();
      renderDraftOutline();
      updateStats();
    });

    const notesArea = createEl("textarea", "outline-item-notes");
    notesArea.rows = 2;
    notesArea.placeholder = "Optional notes or beats for this section.";
    notesArea.value = section.notes || "";
    notesArea.addEventListener("input", (e) => {
      state.outline[index].notes = e.target.value;
      autoSave();
      if (
        getCurrentSectionTitle() === state.outline[index].title &&
        $("#current-section-note")
      ) {
        $("#current-section-note").textContent = e.target.value;
      }
    });

    contentContainer.appendChild(titleInput);
    contentContainer.appendChild(notesArea);

    item.appendChild(dragHandle);
    item.appendChild(contentContainer);

    list.appendChild(item);
  });
}

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.outline-item:not(.dragging)')];
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// === Drafting ===

let currentSectionIndex = null;

function getCurrentSectionTitle() {
  if (currentSectionIndex == null) return null;
  const section = state.outline[currentSectionIndex];
  return section ? section.title : null;
}

function setupDrafting() {
  const textarea = $("#draft-textarea");
  const saveBtn = $("#save-draft");
  const clearBtn = $("#clear-section");
  const dfToggle = $("#distraction-free-toggle");

  textarea.addEventListener("input", () => {
    autoSave();
    updateDraftWordcount();
  });

  saveBtn.addEventListener("click", () => {
    saveCurrentDraft();
    showToast('Draft saved', 'success');
  });

  clearBtn.addEventListener("click", () => {
    if (currentSectionIndex == null) return;
    if (!confirm("Clear draft text for this section?")) return;
    const title = getCurrentSectionTitle();
    if (!title) return;
    state.drafts[title] = "";
    saveState();
    textarea.value = "";
    updateDraftWordcount();
    renderDraftOutline();
    updateStats();
    showToast('Section cleared', 'info');
  });
  
  if (dfToggle) {
    dfToggle.addEventListener("click", () => {
      state.distractionFreeMode = !state.distractionFreeMode;
      document.body.classList.toggle('distraction-free', state.distractionFreeMode);
      const icon = $("#df-icon");
      if (state.distractionFreeMode) {
        dfToggle.textContent = '✕ Exit Focus';
        icon.textContent = '✕';
        showToast('Focus mode enabled', 'success');
      } else {
        dfToggle.innerHTML = '<span id="df-icon">📝</span> Focus Mode';
        showToast('Focus mode disabled', 'info');
      }
      autoSave();
    });
    if (state.distractionFreeMode) {
      document.body.classList.add('distraction-free');
      dfToggle.textContent = '✕ Exit Focus';
    }
  }
  
  document.addEventListener('keydown', (e) => {
    const isInDraftTab = document.getElementById('tab-draft')?.classList.contains('active');
    if (!isInDraftTab || !state.outline.length) return;
    
    const isDraftTextarea = document.activeElement === textarea;
    if (isDraftTextarea && e.key !== 'Escape') return;
    
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      navigateSection(1);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      navigateSection(-1);
    } else if (e.key === 'Enter' && !isDraftTextarea) {
      e.preventDefault();
      textarea.focus();
    }
  });
}

function navigateSection(direction) {
  if (!state.outline.length) return;
  
  let newIndex = currentSectionIndex;
  if (newIndex === null) {
    newIndex = 0;
  } else {
    newIndex += direction;
  }
  
  if (newIndex < 0) newIndex = state.outline.length - 1;
  if (newIndex >= state.outline.length) newIndex = 0;
  
  currentSectionIndex = newIndex;
  const pills = document.querySelectorAll('.draft-section-pill');
  pills.forEach(p => p.classList.remove('active'));
  if (pills[newIndex]) {
    pills[newIndex].classList.add('active');
    pills[newIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  loadDraftForCurrentSection();
}

function saveCurrentDraft() {
  if (currentSectionIndex == null) return;
  const title = getCurrentSectionTitle();
  if (!title) return;
  const textarea = $("#draft-textarea");
  state.drafts[title] = textarea.value;
  saveState();
  renderDraftOutline();
  updateDraftWordcount();
  updateStats();
}

function renderDraftOutline() {
  const list = $("#draft-outline-list");
  if (!state.outline.length) {
    list.className = "draft-outline-list empty-state";
    list.innerHTML = "<p>No outline loaded. Create one in the Outline tab.</p>";
    disableDraftEditor(true);
    return;
  }

  list.className = "draft-outline-list";
  list.innerHTML = "";

  state.outline.forEach((section, index) => {
    const pill = createEl("div", "draft-section-pill");
    const label = createEl("span");
    label.textContent = section.title || `Section ${index + 1}`;

    const status = createEl("span", "pill-status");
    const draftText = state.drafts[section.title] || "";
    status.textContent = draftText.trim().length ? "Drafted" : "Empty";

    pill.appendChild(label);
    pill.appendChild(status);

    pill.addEventListener("click", () => {
      currentSectionIndex = index;
      document
        .querySelectorAll(".draft-section-pill")
        .forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      loadDraftForCurrentSection();
    });

    list.appendChild(pill);
  });

  if (currentSectionIndex == null && state.outline.length) {
    currentSectionIndex = 0;
    const firstPill = list.querySelector(".draft-section-pill");
    if (firstPill) firstPill.classList.add("active");
    loadDraftForCurrentSection();
  } else {
    const pills = list.querySelectorAll(".draft-section-pill");
    if (
      currentSectionIndex != null &&
      pills[currentSectionIndex] &&
      !pills[currentSectionIndex].classList.contains("active")
    ) {
      pills[currentSectionIndex].classList.add("active");
      loadDraftForCurrentSection();
    }
  }
}

function disableDraftEditor(disabled) {
  $("#draft-textarea").disabled = disabled;
  $("#save-draft").disabled = disabled;
  $("#clear-section").disabled = disabled;
  if (disabled) {
    $("#current-section-title").textContent = "No section selected";
    $("#current-section-note").textContent = "";
    $("#draft-textarea").value = "";
    $("#draft-wordcount").textContent = "0 words";
  }
}

function loadDraftForCurrentSection() {
  const section = state.outline[currentSectionIndex];
  if (!section) {
    disableDraftEditor(true);
    return;
  }

  $("#current-section-title").textContent =
    section.title || `Section ${currentSectionIndex + 1}`;
  $("#current-section-note").textContent = section.notes || "";

  const key = section.title;
  const draftText = state.drafts[key] || "";
  $("#draft-textarea").value = draftText;
  disableDraftEditor(false);
  updateDraftWordcount();
}

function updateDraftWordcount() {
  const text = $("#draft-textarea").value || "";
  const words = countWords(text);
  $("#draft-wordcount").textContent = `${words} word${words === 1 ? "" : "s"}`;
}

// === Export ===

function setupExport() {
  $("#refresh-export").addEventListener("click", () => {
    generateExportPreview();
    showToast('Export preview updated', 'success');
  });
  
  $("#copy-export").addEventListener("click", () => {
    copyExportToClipboard();
  });
  
  $("#download-export").addEventListener("click", () => {
    downloadExportFile();
  });

  $("#download-backup").addEventListener("click", () => {
    downloadBackupFile();
  });

  const loadInput = $("#load-backup-input");
  loadInput.addEventListener("change", (e) => {
    loadBackupFromFile(e.target.files && e.target.files[0]);
    e.target.value = "";
  });
  
  setupDragAndDrop();
}

function setupDragAndDrop() {
  const dropZone = document.getElementById('backup-drop-zone');
  if (!dropZone) return;

  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
  });

  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
  });

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/json') {
      loadBackupFromFile(file);
    } else {
      showToast('Please drop a valid JSON backup file', 'error');
    }
  });
}

function loadBackupFromFile(file) {
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const parsed = JSON.parse(ev.target.result);
      if (!parsed || typeof parsed !== "object") {
        showToast("Backup file is invalid", 'error');
        return;
      }
      const confirmReplace = confirm(
        "Load this backup? This will replace your current ideas, outline, drafts, and notes."
      );
      if (!confirmReplace) return;
      
      // Ensure all required properties exist, adding defaults only for missing ones
      const loadedState = {};
      for (const key in defaultState) {
        loadedState[key] = (key in parsed) ? parsed[key] : defaultState[key];
      }
      
      state = loadedState;
      saveState();
      renderAll();
      showToast("Backup loaded successfully", 'success');
    } catch (err) {
      console.error(err);
      showToast("Could not read backup file", 'error');
    }
  };
  reader.readAsText(file);
}

function generateExportPreview() {
  const format = $("#export-format").value;
  const idea = getSelectedIdea();
  const customTitle = $("#export-title").value.trim();
  const title = customTitle || (idea ? idea.title : "Untitled Manuscript");

  let lines = [];
  
  if (format === 'md') {
    lines.push(`# ${title}`);
    lines.push("");
    
    if (idea && idea.hook) {
      lines.push(`**Hook:** ${idea.hook}`);
      lines.push("");
    }

    if (!state.outline.length) {
      lines.push("[No outline sections yet. Create an outline to compile text.]");
    } else {
      state.outline.forEach((section) => {
        const heading = section.title || "Section";
        lines.push(`## ${heading}`);
        lines.push("");
        const draftText = state.drafts[section.title] || "";
        if (draftText.trim().length) {
          // Preserve paragraph breaks by keeping the original line breaks
          lines.push(draftText.trim());
        } else {
          lines.push("*[No draft text for this section yet.]*");
        }
        lines.push("");
      });
    }
  } else {
    lines.push(title);
    lines.push("".padEnd(title.length, "="));
    lines.push("");

    if (idea && idea.hook) {
      lines.push("Hook: " + idea.hook);
      lines.push("");
    }

    if (!state.outline.length) {
      lines.push("[No outline sections yet. Create an outline to compile text.]");
    } else {
      state.outline.forEach((section) => {
        const heading = section.title || "Section";
        lines.push(heading);
        lines.push("".padEnd(heading.length, "-"));
        lines.push("");
        const draftText = state.drafts[section.title] || "";
        if (draftText.trim().length) {
          // Preserve paragraph breaks by keeping the original line breaks
          lines.push(draftText.trim());
        } else {
          lines.push("[No draft text for this section yet.]");
        }
        lines.push("");
      });
    }
  }

  $("#export-textarea").value = lines.join("\n");
}

function copyExportToClipboard() {
  const text = $("#export-textarea").value;
  if (!text.trim().length) {
    showToast("Nothing to copy. Generate an export preview first", 'error');
    return;
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(text)
      .then(() => showToast("Export copied to clipboard", 'success'))
      .catch((err) => {
        console.warn("Clipboard failed, falling back.", err);
        fallbackCopy(text);
      });
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.left = "-9999px";
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  try {
    document.execCommand("copy");
    showToast("Export copied to clipboard", 'success');
  } catch (e) {
    showToast("Unable to copy automatically", 'error');
  }
  document.body.removeChild(ta);
}

function downloadExportFile() {
  const text = $("#export-textarea").value;
  if (!text.trim().length) {
    showToast("Nothing to download. Generate an export preview first", 'error');
    return;
  }
  
  const format = $("#export-format").value;
  const idea = getSelectedIdea();
  const customTitle = $("#export-title").value.trim();
  const baseTitle = (customTitle || (idea ? idea.title : "manuscript"))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const extension = format === 'md' ? 'md' : 'txt';
  const filename = baseTitle ? `${baseTitle}.${extension}` : `manuscript.${extension}`;

  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 0);
  
  showToast(`Manuscript downloaded as ${filename}`, 'success');
}

function downloadBackupFile() {
  const backup = JSON.stringify(state, null, 2);
  const filename = "idea-launch-backup-" + new Date().toISOString().slice(0, 10) + ".json";
  const blob = new Blob([backup], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 0);
  
  showToast(`Backup saved as ${filename}`, 'success');
}

// === Stats & notes ===

function updateStats() {
  const totalIdeas = state.ideas.length;
  const outlineSections = state.outline.length;
  let draftedSections = 0;
  let totalWords = 0;

  state.outline.forEach((section) => {
    const text = state.drafts[section.title] || "";
    if (text.trim().length) {
      draftedSections++;
      totalWords += countWords(text);
    }
  });

  $("#stat-ideas").textContent = totalIdeas.toString();
  $("#stat-outline").textContent = outlineSections.toString();
  $("#stat-drafted").textContent = draftedSections.toString();
  $("#stat-words").textContent = totalWords.toString();
}

function setupSessionNotes() {
  const notesArea = $("#session-notes");
  notesArea.value = state.sessionNotes || "";
  notesArea.addEventListener("input", (e) => {
    state.sessionNotes = e.target.value;
    autoSave();
  });
}

// === Sample data ===

function setupSampleDataButton() {
  const btn = $("#sample-data-btn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const confirmReplace = confirm(
      "Load a sample project? This will replace your current ideas, outline, drafts, and notes."
    );
    if (!confirmReplace) return;

    const sampleIdeaId = "sample-idea-1";
    const sampleState = {
      ideas: [
        {
          id: sampleIdeaId,
          title: "The Quiet After Midnight",
          hook:
            "A misanthropic writer documents the slow collapse of a noisy city and the strange peace that follows.",
          type: "fiction",
          genre: "dark literary",
          notes:
            "Tone: elegiac, quiet, post-noise. Short, sharp scenes that feel like fragments.",
          score: 5,
          createdAt: Date.now() - 86400000
        },
        {
          id: "sample-idea-2",
          title: "BioCoach OS",
          hook:
            "A practical field manual for taking back control of your biology, one protocol at a time.",
          type: "nonfiction",
          genre: "health / optimization",
          notes:
            "Modular protocols, short essays, and checklists. Built for overwhelmed professionals.",
          score: 4,
          createdAt: Date.now() - 172800000
        }
      ],
      selectedIdeaId: sampleIdeaId,
      outline: [
        {
          title: "Act I — Opening Image & Mood",
          notes: "Night city, constant noise. Introduce narrator's exhausted inner monologue."
        },
        {
          title: "Act I — Ordinary World",
          notes: "Daily rituals, failed attempts to escape noise. Brief glimpses of other tenants."
        },
        {
          title: "Act I — Inciting Incident",
          notes: "One night, the city hum suddenly cuts out. No alarms, just absence."
        },
        {
          title: "Act I — First Plot Point",
          notes: "Deciding to stay in the silent city instead of evacuating."
        },
        {
          title: "Act II — Early Tests & Allies",
          notes: "Exploring the silent city, meeting others who stayed. New rules of existence."
        },
        {
          title: "Act II — Midpoint Shift",
          notes: "Discovering the silence isn't empty—something else is listening."
        },
        {
          title: "Act II — Crisis / All Is Lost",
          notes: "The group fractures. Some want to leave, others want to understand the silence."
        },
        {
          title: "Act III — Climax",
          notes: "Final confrontation with what the silence truly is."
        },
        {
          title: "Act III — Resolution & Aftermath",
          notes: "A new kind of quiet. The narrator finds peace in accepting the strangeness."
        }
      ],
      drafts: {
        "Act I — Opening Image & Mood":
          "By the time the city finally went quiet, he had forgotten there was such a thing as silence.\n\nNoise had become the wallpaper of his life: sirens, compressors, arguments, the high whine of delivery drones sawing the sky into strips...",
        "Act I — Ordinary World":
          "Days were measured in interruptions. The neighbours fought on a schedule more reliable than sunrise..."
      },
      sessionNotes:
        "Sample project loaded. Use this to get a feel for the flow: Ideas → Outline → Draft → Export.",
      wordCountGoals: {},
      totalWordCountGoal: null,
      ideaSortBy: 'date-desc',
      distractionFreeMode: false
    };

    state = sampleState;
    saveState();
    renderAll();
    showToast('Sample project loaded', 'success');
  });
}

// === Keyboard shortcuts ===

function setupKeyboardShortcuts() {
  document.addEventListener("keydown", (e) => {
    const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
    const ctrlOrCmd = isMac ? e.metaKey : e.ctrlKey;

    if (e.altKey && !e.shiftKey && !ctrlOrCmd) {
      switch (e.key) {
        case "1":
          e.preventDefault();
          switchToTab("ideas");
          break;
        case "2":
          e.preventDefault();
          switchToTab("outline");
          break;
        case "3":
          e.preventDefault();
          switchToTab("draft");
          break;
        case "4":
          e.preventDefault();
          switchToTab("export");
          break;
        case "5":
          e.preventDefault();
          switchToTab("about");
          break;
        case "6":
          e.preventDefault();
          switchToTab("help");
          break;
      }
    }

    if (ctrlOrCmd && e.shiftKey && e.key.toLowerCase() === "s") {
      e.preventDefault();
      saveCurrentDraft();
      showToast('Draft saved manually', 'success');
    }

    if (ctrlOrCmd && e.shiftKey && e.key.toLowerCase() === "e") {
      e.preventDefault();
      generateExportPreview();
      switchToTab("export");
      showToast('Export preview updated', 'success');
    }
  });
}

// === Utilities ===

function countWords(text) {
  if (!text) return 0;
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

function renderAll() {
  renderIdeas();
  renderSelectedIdea();
  renderOutline();
  renderDraftOutline();
  updateStats();
  setupSessionNotes();
  generateExportPreview();
}

// === Init ===

document.addEventListener("DOMContentLoaded", () => {
  applyTheme(getTheme());
  const themeBtn = $("#theme-toggle-btn");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const current = getTheme();
      const next = current === "dark" ? "light" : "dark";
      setTheme(next);
    });
  }

  setupTabs();
  setupIdeaForm();
  setupOutline();
  setupDrafting();
  setupExport();
  setupSessionNotes();
  setupSampleDataButton();
  setupKeyboardShortcuts();
  setupInstallButton();
  updateConnectionStatus();

  renderIdeas();
  renderSelectedIdea();
  renderOutline();
  renderDraftOutline();
  updateStats();

  generateExportPreview();
  updateStorageInfo();
});
