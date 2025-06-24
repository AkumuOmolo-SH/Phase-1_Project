// let allDrugs = [];
// let savedDrugs = [];
//  const searchInput = document.getElementById("search-input");
// const drugListContainer = document.getElementById("drug-list");
// const clearButton = document.getElementById("clear-search");



// //Fetch saved drugs, then all drugs
// fetch("http://localhost:3000/savedDrugs")
// .then (response => response.json() )
// .then (data => {
//     savedDrugs = data;
//     renderSavedDrugs();
//     return fetch("http://localhost:3000/drugs")
// })
//     .then(response => response.json())
//     .then(data => {
//         allDrugs = data;
//         displayDrugs(allDrugs);
//         renderSideEffectButtons(); 
//         addSearchListener();
//     });

//  //Search setup   
// function addSearchListener(){
//     searchInput.addEventListener("keyup", function () {
//         console.log("User typing", searchInput.value);
//         triggerSearch(searchInput.value);
//     });
// }

// function triggerSearch(queryText) {
//   const query = queryText.toLowerCase().trim();

//   const byName = allDrugs.filter(drug =>
//     drug.name.toLowerCase().includes(query)
//   );

//   const bySideEffect = allDrugs.filter(drug =>
//     drug.sideEffects.some(effect =>
//       effect.toLowerCase().includes(query)
//     )
//   );

//   const allResults = [...new Set([...byName, ...bySideEffect])];

//   if (allResults.length > 0) {
//     displayDrugs(allResults);
//   } else {
//     drugListContainer.innerHTML = "<p>No drug found.</p>";
//   }
// }

// //Display all drugs
// function displayDrugs(drugs) {
//   drugListContainer.innerHTML = "";

//   drugs.forEach(drug => {
//     const card = document.createElement("div");
//     card.className = "drug-card";

//     const isSaved = savedDrugs.some(saved => saved.id === drug.id);

//     card.innerHTML = `
//       <img src="${drug.image}" alt="${drug.name}" width="450">
//       <h3>${drug.name}</h3>
//       <p>Purpose: ${drug.purpose}</p>
//       <p>Side Effects: ${drug.sideEffects.join(", ")}</p>
//     `;

//     const saveButton = document.createElement("button");
//     saveButton.className = "save-btn";
//     saveButton.dataset.id = drug.id;
//     saveButton.textContent = isSaved? "Saved" : "Save";
//     saveButton.disabled = isSaved;

//     card.appendChild(saveButton);
//     drugListContainer.appendChild(card);

//   });
// }


// //Saved drugs
// function renderSavedDrugs () {
//     const savedList = document.getElementById("saved-drug-list");
//     savedList.innerHTML = "";

//     savedDrugs.forEach(drug => {
//         const card = document.createElement("div");
//         card.className = "drug-card";
        
//     card.innerHTML = `
//       <img src="${drug.image}" alt="${drug.name}" width="450">
//       <h3>${drug.name}</h3>
//       <p>Purpose: ${drug.purpose}</p>
//       <p>Side Effects: ${drug.sideEffects.join(", ")}</p>
//       <button class="remove-btn" data-id="${drug.id}">Remove</button>
//     `;

//     savedList.appendChild(card);
//     });
// }

// //Save button logic
// drugListContainer.addEventListener("click", function (event) {
//     if (event.target.classList.contains("save-btn")) {
//         const drugId = event.target.dataset.id;
//         const drugToSave = allDrugs.find(drug => drug.id == drugId);

//     if (drugToSave && !savedDrugs.some(saved => saved.id == drugId)) {
//         savedDrugs.push(drugToSave);
//         renderSavedDrugs();

//     event.target.disabled = true;
//     event.target.textContent = "Saved";

//     fetch("http://localhost:3000/savedDrugs", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"},
//         body: JSON.stringify(drugToSave)
//     });
// }
//     }
// });

//  document.getElementById("saved-drug-list").addEventListener("click", function (event) {
//         if (event.target.classList.contains("remove-btn")) {
//             const drugId = event.target.dataset.id;

//             savedDrugs = savedDrugs.filter(drug => drug.id !=drugId);
//             renderSavedDrugs();

//             fetch(`http://localhost:3000/savedDrugs/${drugId}`, {
//                 method: "DELETE"
//             }).then(() => {   
//                 displayDrugs(allDrugs);
//             });
//         }
//     });

let allDrugs = [];
let savedDrugs = [];

const drugListContainer = document.getElementById("drug-list");
const savedList = document.getElementById("saved-drug-list");
const searchInput = document.getElementById("search-input");
const clearButton = document.getElementById("clear-search");

// Fetch savedDrugs first, then allDrugs
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
  });

// Add search listener
document.addEventListener("DOMContentLoaded", () => {
  searchInput.addEventListener("keyup", () => {
    triggerSearch(searchInput.value);
  });

  clearButton.addEventListener("click", () => {
    searchInput.value = "";
    displayDrugs(allDrugs);
  });
});

function triggerSearch(queryText) {
  const query = queryText.toLowerCase().trim();

  const byName = allDrugs.filter(drug =>
    drug.name.toLowerCase().includes(query)
  );

  const bySideEffect = allDrugs.filter(drug =>
    drug.sideEffects.some(effect =>
      effect.toLowerCase().includes(query)
    )
  );

  const allResults = [...new Set([...byName, ...bySideEffect])];

  if (allResults.length > 0) {
    displayDrugs(allResults);
  } else {
    drugListContainer.innerHTML = "<p>No drug found.</p>";
  }
}

function displayDrugs(drugs) {
  drugListContainer.innerHTML = "";

  drugs.forEach(drug => {
    const card = document.createElement("div");
    card.className = "drug-card";

    const isSaved = savedDrugs.some(saved => saved.id === drug.id);

    card.innerHTML = `
      <img src="${drug.image}" alt="${drug.name}" width="450">
      <h3>${drug.name}</h3>
      <p>Purpose: ${drug.purpose}</p>
      <p>Side Effects: ${drug.sideEffects.join(", ")}</p>
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

// Save button logic
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

// Remove from saved list
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

