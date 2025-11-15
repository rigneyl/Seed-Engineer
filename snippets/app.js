
// snippets/app.js
// Local snippets manager: save, list, copy, and buffer frequently used text.

(function() {
  const STORAGE_KEY = "seed_snippets_v1";

  const nameInput = document.getElementById("snippet-name");
  const textInput = document.getElementById("snippet-text");
  const bufferText = document.getElementById("buffer-text");

  const listContainer = document.getElementById("snippets-list");

  const btnSave = document.getElementById("btn-save");
  const btnClear = document.getElementById("btn-clear");
  const btnCopyBuffer = document.getElementById("btn-copy-buffer");

  function loadSnippets() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed;
    } catch (e) {
      return [];
    }
  }

  function saveSnippets(snippets) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snippets));
  }

  function createId() {
    return "s_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 7);
  }

  function renderSnippets() {
    const snippets = loadSnippets();
    listContainer.innerHTML = "";
    if (!snippets.length) {
      const empty = document.createElement("div");
      empty.className = "snippet-empty";
      empty.textContent = "No snippets yet. Create one on the left and save it.";
      listContainer.appendChild(empty);
      return;
    }

    snippets.forEach(snippet => {
      const card = document.createElement("div");
      card.className = "snippet-card";

      const titleRow = document.createElement("div");
      titleRow.className = "snippet-title-row";

      const title = document.createElement("div");
      title.className = "snippet-title";
      title.textContent = snippet.name || "(untitled snippet)";

      const meta = document.createElement("div");
      meta.className = "snippet-meta";
      if (snippet.createdAt) {
        const date = new Date(snippet.createdAt);
        meta.textContent = date.toLocaleDateString();
      } else {
        meta.textContent = "";
      }

      titleRow.appendChild(title);
      titleRow.appendChild(meta);

      const preview = document.createElement("div");
      preview.className = "snippet-preview";
      preview.textContent = snippet.text || "";

      const actions = document.createElement("div");
      actions.className = "snippet-actions";

      const btnAdd = document.createElement("button");
      btnAdd.type = "button";
      btnAdd.className = "btn-secondary btn";
      btnAdd.textContent = "Add to buffer";
      btnAdd.addEventListener("click", () => {
        const existing = bufferText.value.trim();
        if (existing) {
          bufferText.value = existing + "\n\n" + (snippet.text || "");
        } else {
          bufferText.value = snippet.text || "";
        }
      });

      const btnCopy = document.createElement("button");
      btnCopy.type = "button";
      btnCopy.className = "btn-secondary btn";
      btnCopy.textContent = "Copy";
      btnCopy.addEventListener("click", () => {
        if (!snippet.text) return;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(snippet.text).catch(() => {});
        } else {
          // Fallback: put text in buffer and let user copy manually
          bufferText.value = snippet.text;
        }
      });

      const btnDelete = document.createElement("button");
      btnDelete.type = "button";
      btnDelete.className = "btn-secondary btn";
      btnDelete.textContent = "Delete";
      btnDelete.addEventListener("click", () => {
        const current = loadSnippets();
        const filtered = current.filter(s => s.id !== snippet.id);
        saveSnippets(filtered);
        renderSnippets();
      });

      actions.appendChild(btnAdd);
      actions.appendChild(btnCopy);
      actions.appendChild(btnDelete);

      card.appendChild(titleRow);
      card.appendChild(preview);
      card.appendChild(actions);

      listContainer.appendChild(card);
    });
  }

  function handleSave() {
    const name = nameInput.value.trim();
    const text = textInput.value;
    if (!text.trim()) {
      return;
    }
    const snippets = loadSnippets();
    const snippet = {
      id: createId(),
      name,
      text,
      createdAt: Date.now()
    };
    snippets.unshift(snippet);
    saveSnippets(snippets);
    renderSnippets();
    textInput.value = "";
    // Keep the name — often you'll save a few variants with similar label.
  }

  function handleClear() {
    nameInput.value = "";
    textInput.value = "";
  }

  function handleCopyBuffer() {
    const text = bufferText.value;
    if (!text) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
  }

  btnSave.addEventListener("click", handleSave);
  btnClear.addEventListener("click", handleClear);
  btnCopyBuffer.addEventListener("click", handleCopyBuffer);

  renderSnippets();
})();
