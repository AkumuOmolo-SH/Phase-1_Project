document.addEventListener("DOMContentLoaded", () => {
  // 🔄 Automatically switch between local and Render server
  const baseURL = window.location.hostname.includes("localhost")
    ? "http://localhost:3000"
    : "https://medsafe-lifx.onrender.com";

  let allDrugs = [];
  let savedDrugs = [];

  const drugListContainer = document.getElementById("drug-list");
  const savedList = document.getElementById("saved-drug-list");
  const searchInput = document.getElementById("search-input");
  const clearButton = document.getElementById("clear-search");
  const noteForm = document.getElementById("note-form");
  const noteContent = document.getElementById("note-content");
  const notesList = document.getElementById("notes-list");
  const resetButton = document.getElementById("reset-filters");
  const purposeTagContainer = document.getElementById("purpose-tags");
  const effectTagContainer = document.getElementById("effect-tags");

  // ✅ Load saved drugs first, then all drugs
  fetch(`${baseURL}/savedDrugs`)
    .then(res => res.json())
    .then(data => {
      savedDrugs = data;
      renderSavedDrugs();
      return fetch(`${baseURL}/drugs`);
    })
    .then(res => res.json())
    .then(data => {
      allDrugs = data;
      displayDrugs(allDrugs);
      renderFilterTags();
    });

  searchInput.addEventListener("keyup", () => applyFilters());

  clearButton.addEventListener("click", () => {
    searchInput.value = "";
    applyFilters();
  });

  resetButton.addEventListener("click", () => {
    searchInput.value = "";
    document.querySelectorAll(".filter-tag.active").forEach(tag => tag.classList.remove("active"));
    displayDrugs(allDrugs);
  });

  function applyFilters() {
    const text = searchInput.value.toLowerCase();
    const activeTags = Array.from(document.querySelectorAll(".filter-tag.active"))
      .map(tag => tag.textContent);

    const filtered = allDrugs.filter(drug => {
      const matchesSearch =
        drug.name.toLowerCase().includes(text) ||
        drug.purpose.toLowerCase().includes(text) ||
        drug.sideEffects.some(se => se.toLowerCase().includes(text));

      const matchesTags = activeTags.length === 0 ||
        activeTags.some(tag =>
          drug.purpose === tag ||
          drug.sideEffects.includes(tag) ||
          (tag === "None" && drug.sideEffects.length === 0)
        );

      return matchesSearch && matchesTags;
    });

    displayDrugs(filtered);
  }

  function applyTagFilter(tagText) {
    document.querySelectorAll(".filter-tag").forEach(tag => tag.classList.remove("active"));
    const tagElement = [...document.querySelectorAll(".filter-tag")].find(tag => tag.textContent === tagText);
    if (tagElement) tagElement.classList.add("active");
    applyFilters();
  }

  function renderFilterTags() {
    purposeTagContainer.innerHTML = "";
    effectTagContainer.innerHTML = "";

    const purposes = [...new Set(allDrugs.map(d => d.purpose))];
    const sideEffects = getAllUniqueSideEffects();

    purposes.forEach(tag => {
      const tagElement = document.createElement("button");
      tagElement.textContent = tag;
      tagElement.className = "filter-tag";
      tagElement.addEventListener("click", () => applyTagFilter(tag));
      purposeTagContainer.appendChild(tagElement);
    });

    sideEffects.forEach(tag => {
      const tagElement = document.createElement("button");
      tagElement.textContent = tag;
      tagElement.className = "filter-tag";
      tagElement.addEventListener("click", () => applyTagFilter(tag));
      effectTagContainer.appendChild(tagElement);
    });
  }

  function getAllUniqueSideEffects() {
    const effects = new Set();
    allDrugs.forEach(drug => {
      if (drug.sideEffects.length === 0) {
        effects.add("None");
      } else {
        drug.sideEffects.forEach(effect => effects.add(effect));
      }
    });
    return Array.from(effects);
  }

  function displayDrugs(drugs) {
    drugListContainer.innerHTML = "";
    if (drugs.length === 0) {
      drugListContainer.innerHTML = `<p>No drugs found.</p>`;
      return;
    }

    drugs.forEach(drug => {
      const card = document.createElement("div");
      card.className = "drug-card";

      const sideEffects = drug.sideEffects.length > 0 ? drug.sideEffects.join(", ") : "None";
      const isSaved = savedDrugs.some(saved => saved.id === drug.id);

      card.innerHTML = `
        <img src="${drug.image}" alt="${drug.name}" width="600">
        <h3>${drug.name}</h3>
        <p>Purpose: ${drug.purpose}</p>
        <p>Side Effects: ${sideEffects}</p>
      `;

      const saveButton = document.createElement("button");
      saveButton.className = "save-btn";
      saveButton.dataset.id = drug.id;
      saveButton.textContent = isSaved ? "Saved" : "Save";
      saveButton.disabled = isSaved;

      card.appendChild(saveButton);
      drugListContainer.appendChild(card);
    });
  }

  function renderSavedDrugs() {
    savedList.innerHTML = "";
    savedDrugs.forEach(drug => {
      const card = document.createElement("div");
      card.className = "drug-card";
      card.innerHTML = `
        <img src="${drug.image}" alt="${drug.name}" width="450">
        <h3>${drug.name}</h3>
        <p>Purpose: ${drug.purpose}</p>
        <p>Side Effects: ${drug.sideEffects.join(", ")}</p>
        <button class="remove-btn" data-id="${drug.id}">Remove</button>
      `;
      savedList.appendChild(card);
    });
  }

  drugListContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("save-btn")) {
      const drugId = event.target.dataset.id;
      const drugToSave = allDrugs.find(drug => drug.id == drugId);

      if (drugToSave && !savedDrugs.some(saved => saved.id == drugId)) {
        savedDrugs.push(drugToSave);
        renderSavedDrugs();

        event.target.disabled = true;
        event.target.textContent = "Saved";

        fetch(`${baseURL}/savedDrugs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(drugToSave)
        });
      }
    }
  });

  savedList.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-btn")) {
      const drugId = event.target.dataset.id;
      savedDrugs = savedDrugs.filter(drug => drug.id != drugId);
      renderSavedDrugs();

      fetch(`${baseURL}/savedDrugs/${drugId}`, {
        method: "DELETE"
      }).then(() => displayDrugs(allDrugs));
    }
  });

  function wordCount(str) {
    return str.trim().split(/\s+/).length;
  }

  function loadNotes() {
    fetch(`${baseURL}/notes`)
      .then(res => res.json())
      .then(notes => renderNotes(notes));
  }

  function renderNotes(notes) {
    notesList.innerHTML = "";
    notes.forEach(note => {
      const li = document.createElement("li");
      li.innerHTML = `
        <p class="note-content" data-id="${note.id}">${note.content}</p>
        <textarea class="note-editor" data-id="${note.id}" style="display:none;"></textarea>
        <button class="edit-note" data-id="${note.id}">Edit</button>
        <button class="delete-note" data-id="${note.id}">Delete</button>
      `;
      notesList.appendChild(li);
    });
  }

  notesList.addEventListener("click", function (e) {
    const id = e.target.dataset.id;

    if (e.target.classList.contains("delete-note")) {
      fetch(`${baseURL}/notes/${id}`, {
        method: "DELETE"
      }).then(() => loadNotes());
    }

    if (e.target.classList.contains("edit-note")) {
      const li = e.target.closest("li");
      const p = li.querySelector(".note-content");
      const textarea = li.querySelector("textarea");

      if (e.target.textContent === "Edit") {
        textarea.value = p.textContent;
        p.style.display = "none";
        textarea.style.display = "block";
        textarea.focus();
        e.target.textContent = "Save";
      } else {
        const newContent = textarea.value.trim();

        if (wordCount(newContent) > 100) {
          alert("Note cannot exceed 100 words.");
          return;
        }

        fetch(`${baseURL}/notes/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: newContent })
        }).then(() => loadNotes());
      }
    }
  });

  noteForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const content = noteContent.value.trim();

    if (wordCount(content) > 100) {
      alert("Note cannot exceed 100 words.");
      return;
    }

    fetch(`${baseURL}/notes`)
      .then(res => res.json())
      .then(notes => {
        if (notes.length >= 4) {
          alert("Sorry, maximum of 4 notes allowed.");
          return;
        }

        const newNote = { content };

        fetch(`${baseURL}/notes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newNote)
        }).then(() => {
          noteForm.reset();
          loadNotes();
        });
      });
  });

  loadNotes();
});
