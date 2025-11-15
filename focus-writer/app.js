
// focus-writer/app.js
// Minimalistic writing space with local autosave + open/save files.

(function() {
  const editor = document.getElementById("fw-editor");
  const btnNew = document.getElementById("fw-new");
  const btnOpen = document.getElementById("fw-open");
  const btnSave = document.getElementById("fw-save");
  const btnClearStorage = document.getElementById("fw-clear-storage");
  const fileInput = document.getElementById("fw-file-input");

  const countsLabel = document.getElementById("fw-counts");
  const readingLabel = document.getElementById("fw-reading");
  const fileLabel = document.getElementById("fw-file-label");
  const autosaveLabel = document.getElementById("fw-autosave-label");

  const STORAGE_KEY = "focusWriter_lastDraft_v1";
  const STORAGE_META_KEY = "focusWriter_lastMeta_v1";

  let currentFilename = null;
  let autosaveTimer = null;

  function updateCounts() {
    const text = editor.value;
    const stats = TextUtils.getTextStats(text);
    const words = stats.wordCount || 0;
    const chars = text.length;
    countsLabel.textContent = words + " words · " + chars + " chars";
    const minutes = words ? Math.max(1, Math.round(words / 250)) : 0;
    readingLabel.textContent = "~" + minutes + " min read";
  }

  function setAutosaveStatus(msg) {
    autosaveLabel.textContent = msg;
  }

  function loadFromStorage() {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      const metaRaw = window.localStorage.getItem(STORAGE_META_KEY);
      if (stored) {
        editor.value = stored;
        updateCounts();
        if (metaRaw) {
          const meta = JSON.parse(metaRaw);
          fileLabel.textContent = meta.filename || "Unsaved draft";
          setAutosaveStatus("Draft restored from browser storage");
        } else {
          fileLabel.textContent = "Unsaved draft";
          setAutosaveStatus("Draft restored");
        }
      }
    } catch (e) {
      console.warn("Unable to restore draft", e);
    }
  }

  function autosave() {
    try {
      const text = editor.value;
      window.localStorage.setItem(STORAGE_KEY, text);
      const meta = { filename: currentFilename, ts: Date.now() };
      window.localStorage.setItem(STORAGE_META_KEY, JSON.stringify(meta));
      setAutosaveStatus("Autosaved locally");
    } catch (e) {
      console.warn("Autosave failed", e);
      setAutosaveStatus("Autosave disabled");
    }
  }

  function scheduleAutosave() {
    setAutosaveStatus("Editing…");
    if (autosaveTimer) window.clearTimeout(autosaveTimer);
    autosaveTimer = window.setTimeout(autosave, 800);
  }

  function newDocument() {
    if (editor.value.trim() && !confirm("Start a new document? Unsaved changes will still be in browser autosave.")) {
      return;
    }
    editor.value = "";
    currentFilename = null;
    fileLabel.textContent = "No file loaded";
    updateCounts();
    setAutosaveStatus("New document");
    autosave();
  }

  function openFile() {
    fileInput.value = "";
    fileInput.click();
  }

  fileInput.addEventListener("change", (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(ev) {
      editor.value = ev.target.result || "";
      currentFilename = file.name;
      fileLabel.textContent = "Loaded: " + file.name;
      updateCounts();
      setAutosaveStatus("Loaded from file");
      autosave();
    };
    reader.readAsText(file);
  });

  function downloadFile() {
    const text = editor.value || "";
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    const url = URL.createObjectURL(blob);
    a.href = url;
    const safeName = (currentFilename || "focus-writer-draft.txt").replace(/[^a-zA-Z0-9_.-]+/g, "_");
    a.download = safeName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setAutosaveStatus("Downloaded .txt copy");
  }

  function clearAutosave() {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.removeItem(STORAGE_META_KEY);
      setAutosaveStatus("Autosave cleared");
    } catch (e) {
      console.warn("Failed to clear autosave", e);
    }
  }

  editor.addEventListener("input", () => {
    updateCounts();
    scheduleAutosave();
  });

  btnNew.addEventListener("click", newDocument);
  btnOpen.addEventListener("click", openFile);
  btnSave.addEventListener("click", downloadFile);
  btnClearStorage.addEventListener("click", clearAutosave);

  // Initial
  updateCounts();
  loadFromStorage();
})();
