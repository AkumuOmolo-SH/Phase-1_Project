// document.addEventListener("DOMContentLoaded", () => {
//   let allDrugs = [];
//   let savedDrugs = [];

//   const drugListContainer = document.getElementById("drug-list");
//   const savedList = document.getElementById("saved-drug-list");
//   const searchInput = document.getElementById("search-input");
//   const clearButton = document.getElementById("clear-search");
//   const noteForm = document.getElementById("note-form");
//   const noteContent = document.getElementById("note-content");
//   const notesList = document.getElementById("notes-list");

//   const purposeSelect = document.getElementById("filter-purpose");
//   const effectSelect = document.getElementById("filter-effect");
//   const resetButton = document.getElementById("reset-filters");

//   // Fetch savedDrugs first, then allDrugs
//   fetch("http://localhost:3000/savedDrugs")
//     .then(response => response.json())
//     .then(data => {
//       savedDrugs = data;
//       renderSavedDrugs();
//       return fetch("http://localhost:3000/drugs");
//     })
//     .then(response => response.json())
//     .then(data => {
//       allDrugs = data;
//       displayDrugs(allDrugs);
//       populateFilters(allDrugs);
//       // renderSideEffectButtons(); 
//     });


//   // Search
//   searchInput.addEventListener("keyup", () => {
//     triggerSearch(searchInput.value);
//   });

//   clearButton.addEventListener("click", () => {
//     searchInput.value = "";
//     displayDrugs(allDrugs);
//   });

//   loadNotes(); // Show notes on page load

//   function displayDrugs(drugs) {
//     drugListContainer.innerHTML = "";

//      if (drugs.length === 0) {
//     container.innerHTML = `<p>No drugs found.</p>`;
//     return;
//   }

//     drugs.forEach(drug => {
//       const card = document.createElement("div");
//       card.className = "drug-card";

//       const sideEffects = drug.sideEffects.length > 0
//       ? drug.sideEffects.join(", ")
//       : "None";

//       const isSaved = savedDrugs.some(saved => saved.id === drug.id);

//       card.innerHTML = `
//         <img src="${drug.image}" alt="${drug.name}" width="600">
//         <h3>${drug.name}</h3>
//         <p>Purpose: ${drug.purpose}</p>
//         <p>Side Effects: ${drug.sideEffects.join(", ")}</p>
//       `;

//       container.appendChild(card);

//       const saveButton = document.createElement("button");
//       saveButton.className = "save-btn";
//       saveButton.dataset.id = drug.id;
//       saveButton.textContent = isSaved ? "Saved" : "Save";
//       saveButton.disabled = isSaved;

//       card.appendChild(saveButton);
//       drugListContainer.appendChild(card);
//     });
//   }

//   function renderSavedDrugs() {
//     savedList.innerHTML = "";

//     savedDrugs.forEach(drug => {
//       const card = document.createElement("div");
//       card.className = "drug-card";

//       card.innerHTML = `
//         <img src="${drug.image}" alt="${drug.name}" width="450">
//         <h3>${drug.name}</h3>
//         <p>Purpose: ${drug.purpose}</p>
//         <p>Side Effects: ${drug.sideEffects.join(", ")}</p>
//         <button class="remove-btn" data-id="${drug.id}">Remove</button>
//       `;

//       savedList.appendChild(card);
//     });
//   }

//   // Save button
//   drugListContainer.addEventListener("click", function (event) {
//     if (event.target.classList.contains("save-btn")) {
//       const drugId = event.target.dataset.id;
//       const drugToSave = allDrugs.find(drug => drug.id == drugId);

//       if (drugToSave && !savedDrugs.some(saved => saved.id == drugId)) {
//         savedDrugs.push(drugToSave);
//         renderSavedDrugs();

//         event.target.disabled = true;
//         event.target.textContent = "Saved";

//         fetch("http://localhost:3000/savedDrugs", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json"
//           },
//           body: JSON.stringify(drugToSave)
//         });
//       }
//     }
//   });

//   // Remove saved
//   savedList.addEventListener("click", function (event) {
//     if (event.target.classList.contains("remove-btn")) {
//       const drugId = event.target.dataset.id;

//       savedDrugs = savedDrugs.filter(drug => drug.id != drugId);
//       renderSavedDrugs();

//       fetch(`http://localhost:3000/savedDrugs/${drugId}`, {
//         method: "DELETE"
//       }).then(() => {
//         displayDrugs(allDrugs);
//       });
//     }
//   });

// searchInput.addEventListener("keyup", () => {
//   applyFilters();
// });

// clearButton.addEventListener("click", () => {
//     searchInput.value = "";
//     applyFilters();
//   });

//   purposeSelect.addEventListener("change", applyFilters);
//   effectSelect.addEventListener("change", applyFilters);

//   resetButton.addEventListener("click", () => {
//     searchInput.value = "";
//     purposeSelect.value = "";
//     effectSelect.value = "";
//     displayDrugs(allDrugs);
//   });

//   function applyFilters() {
//     const query = searchInput.value.toLowerCase().trim();
//     const selectedPurpose = purposeSelect.value;
//     const selectedEffect = effectSelect.value;

//     let filtered = [...allDrugs];

//     if (query) {
//       filtered = filtered.filter(drug =>
//         drug.name.toLowerCase().includes(query) ||
//         drug.sideEffects.some(effect =>
//           effect.toLowerCase().includes(query)
//         )
//       );
//     }

//     if (selectedPurpose) {
//       filtered = filtered.filter(drug =>
//         drug.purpose === selectedPurpose
//       );
//     }

//     if (selectedEffect) {
//       filtered = filtered.filter(drug =>
//         drug.sideEffects.includes(selectedEffect)
//       );
//     }

//     displayDrugs(filtered);
//   }

//   function populateFilters(drugs) {
//     const purposes = [...new Set(drugs.map(d => d.purpose))];
//     const effects = [...new Set(drugs.flatMap(d => d.sideEffects))];

//     purposes.forEach(p => {
//       const option = document.createElement("option");
//       option.value = p;
//       option.textContent = p;
//       purposeSelect.appendChild(option);
//     });

//     effects.forEach(e => {
//       const option = document.createElement("option");
//       option.value = e;
//       option.textContent = e;
//       effectSelect.appendChild(option);
//     });
//   }

// function getAllUniqueSideEffects() {
//   const effects = new Set();

//   allDrugs.forEach(drug => {
//     if (drug.sideEffects.length === 0) {
//       effects.add("None");
//     } else {
//       drug.sideEffects.forEach(effect => effects.add(effect));
//     }
//   });

//   return Array.from(effects);
// }

// function renderFilterTags() {
//   const tagContainer = document.getElementById("filter-tags");
//   tagContainer.innerHTML = "";

//   const purposes = [...new Set(allDrugs.map(d => d.purpose))];
//   const sideEffects = getAllUniqueSideEffects();

//   [...purposes, ...sideEffects].forEach(tag => {
//     const tagElement = document.createElement("button");
//     tagElement.textContent = tag;
//     tagElement.className = "filter-tag";
//     tagElement.addEventListener("click", () => {
//       applyTagFilter(tag);
//     });
//     tagContainer.appendChild(tagElement);
//   });
// }


//   function triggerSearch(queryText) {
//     const query = queryText.toLowerCase().trim();

//     const byName = allDrugs.filter(drug =>
//       drug.name.toLowerCase().includes(query)
//     );

//     const bySideEffect = allDrugs.filter(drug =>
//       drug.sideEffects.some(effect =>
//         effect.toLowerCase().includes(query)
//       )
//     );

//     const allResults = [...new Set([...byName, ...bySideEffect])];

//     if (allResults.length > 0) {
//       displayDrugs(allResults);
//     } else {
//       drugListContainer.innerHTML = "<p>No drug found.</p>";
//     }
//   }

//   // Notes section
//   function wordCount(str) {
//     return str.trim().split(/\s+/).length;
//   }

//   function loadNotes() {
//     fetch("http://localhost:3000/notes")
//       .then(res => res.json())
//       .then(notes => renderNotes(notes));
//   }

//   function renderNotes(notes) {
//     notesList.innerHTML = "";
//     notes.forEach(note => {
//       const li = document.createElement("li");
//       li.innerHTML = `
//         <p class="note-content" data-id="${note.id}">${note.content}</p>
//         <textarea class="note-editor" data-id="${note.id}" style="display:none;"></textarea>
//         <button class="edit-note" data-id="${note.id}">Edit</button>
//         <button class="delete-note" data-id="${note.id}">Delete</button>
//       `;
//       notesList.appendChild(li);
//     });
//   }

//   notesList.addEventListener("click", function (e) {
//     const id = e.target.dataset.id;

//     if (e.target.classList.contains("delete-note")) {
//       fetch(`http://localhost:3000/notes/${id}`, {
//         method: "DELETE"
//       }).then(() => loadNotes());
//     }

//     if (e.target.classList.contains("edit-note")) {
//       const li = e.target.closest("li");
//       const p = li.querySelector(".note-content");
//       const textarea = li.querySelector("textarea");

//       if (e.target.textContent === "Edit") {
//         textarea.value = p.textContent;
//         p.style.display = "none";
//         textarea.style.display = "block";
//         textarea.focus();
//         e.target.textContent = "Save";
//       } else {
//         const newContent = textarea.value.trim();

//         if (wordCount(newContent) > 100) {
//           alert("Note cannot exceed 100 words.");
//           return;
//         }

//         fetch(`http://localhost:3000/notes/${id}`, {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ content: newContent })
//         }).then(() => loadNotes());
//       }
//     }
//   });

//   noteForm.addEventListener("submit", function (e) {
//     e.preventDefault();
//     const content = noteContent.value.trim();

//     if (wordCount(content) > 100) {
//       alert("Note cannot exceed 100 words.");
//       return;
//     }

//     fetch("http://localhost:3000/notes")
//       .then(res => res.json())
//       .then(notes => {
//         if (notes.length >= 4) {
//           alert("Maximum of 4 notes allowed.");
//           return;
//         }

//         const newNote = {content};

//         fetch("http://localhost:3000/notes", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(newNote),
//         })
//           .then(() => {
//             noteForm.reset();
//             loadNotes();
//           });
//       });
//   });
// });

document.addEventListener("DOMContentLoaded", () => {
  let allDrugs = [];
  let savedDrugs = [];

  const drugListContainer = document.getElementById("drug-list");
  const savedList = document.getElementById("saved-drug-list");
  const searchInput = document.getElementById("search-input");
  const clearButton = document.getElementById("clear-search");
  const noteForm = document.getElementById("note-form");
  const noteContent = document.getElementById("note-content");
  const notesList = document.getElementById("notes-list");
  const tagContainer = document.getElementById("filter-tags");
  const resetButton = document.getElementById("reset-filters");

  fetch("http://localhost:3000/savedDrugs")
    .then(response => response.json())
    .then(data => {
      savedDrugs = data;
      renderSavedDrugs();
      return fetch("http://localhost:3000/drugs");
    })
    .then(response => response.json())
    .then(data => {
      allDrugs = data;
      displayDrugs(allDrugs);
      renderFilterTags();
    });

  searchInput.addEventListener("keyup", () => {
    applyFilters();
  });

  clearButton.addEventListener("click", () => {
    searchInput.value = "";
    applyFilters();
  });

  resetButton.addEventListener("click", () => {
    searchInput.value = "";
    document.querySelectorAll(".filter-tag.active").forEach(tag => tag.classList.remove("active"));
    displayDrugs(allDrugs);
  });

  function applyTagFilter(tagText) {
    document.querySelectorAll(".filter-tag").forEach(tag => {
      tag.classList.remove("active");
    });
    const selectedTag = [...document.querySelectorAll(".filter-tag")].find(tag => tag.textContent === tagText);
    if (selectedTag) selectedTag.classList.add("active");

    let filtered = allDrugs.filter(drug => {
      return (
        drug.purpose === tagText ||
        drug.sideEffects.includes(tagText) ||
        (tagText === "None" && drug.sideEffects.length === 0)
      );
    });

    displayDrugs(filtered);
  }

  function renderFilterTags() {
    tagContainer.innerHTML = "";

    const purposes = [...new Set(allDrugs.map(d => d.purpose))];
    const sideEffects = getAllUniqueSideEffects();

    [...purposes, ...sideEffects].forEach(tag => {
      const tagElement = document.createElement("button");
      tagElement.textContent = tag;
      tagElement.className = "filter-tag";
      tagElement.addEventListener("click", () => {
        applyTagFilter(tag);
      });
      tagContainer.appendChild(tagElement);
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

      const sideEffects = drug.sideEffects.length > 0
        ? drug.sideEffects.join(", ")
        : "None";

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

        fetch("http://localhost:3000/savedDrugs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
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

      fetch(`http://localhost:3000/savedDrugs/${drugId}`, {
        method: "DELETE"
      }).then(() => {
        displayDrugs(allDrugs);
      });
    }
  });

  function wordCount(str) {
    return str.trim().split(/\s+/).length;
  }

  function loadNotes() {
    fetch("http://localhost:3000/notes")
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
      fetch(`http://localhost:3000/notes/${id}`, {
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

        fetch(`http://localhost:3000/notes/${id}`, {
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

    fetch("http://localhost:3000/notes")
      .then(res => res.json())
      .then(notes => {
        if (notes.length >= 4) {
          alert("Maximum of 4 notes allowed.");
          return;
        }

        const newNote = { content };

        fetch("http://localhost:3000/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newNote),
        })
          .then(() => {
            noteForm.reset();
            loadNotes();
          });
      });
  });
});
