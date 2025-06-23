let allDrugs = [];
let savedDrugs = [];

fetch("http://localhost:3000/drugs") 
    .then(response => response.json())
    .then(data => {
        allDrugs = data;
        displayDrugs(allDrugs);
    });

fetch("http://localhost:3000/savedDrugs")
.then (response => response.json() )
.then (data => {
    savedDrugs = data;
    renderSavedDrugs();
});

const searchInput = document.getElementById("search-input");
const drugListContainer = document.getElementById("drug-list");

function displayDrugs(drugs) {
  drugListContainer.innerHTML = "";

  drugs.forEach(drug => {
    const card = document.createElement("div");
    card.className = "drug-card";

    card.innerHTML = `
      <img src="${drug.image}" alt="${drug.name}" width="450">
      <h3>${drug.name}</h3>
      <p>Purpose: ${drug.purpose}</p>
      <p>Side Effects: ${drug.sideEffects.join(", ")}</p>
      <button class="save-btn" data-id="${drug.id}">Save</button>
    `;

    drugListContainer.appendChild(card);
  });
}

function renderSavedDrugs () {
    const savedList = document.getElementById("saved-drug-list");
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

document.getElementById("drug-list").addEventListener("click", function (event) {
    if (event.target.classList.contains("save-btn")) {
        const drugId = event.target.dataset.id;

        const drugToSave = allDrugs.find(drug => drug.id == drugId);

    if (drugToSave && !savedDrugs.includes(drugToSave)) {
        savedDrugs.push(drugToSave);
        renderSavedDrugs();

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

 document.getElementById("saved-drug-list").addEventListener("click", function (event) {
        if (event.target.classList.contains("remove-btn")) {
            const drugId = event.target.dataset.id;

            savedDrugs = savedDrugs.filter(drug => drug.id !=drugId);
            renderSavedDrugs();

            fetch(`http://localhost:3000/savedDrugs/${drugId}`, {
                method: "DELETE"
            });


        }
    });

