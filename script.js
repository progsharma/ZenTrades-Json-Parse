// Global variables to store available and displayed fields
let availableFieldOptions = ["subcategory", "title", "price", "popularity"];
let displayedFieldOptions = [];

// Function to populate the fields list
function populateFieldsList() {
  const availableFieldsList = document.getElementById("availableFields");
  const displayedFieldsList = document.getElementById("displayedFields");

  // Clear previous options
  availableFieldsList.innerHTML = "";
  displayedFieldsList.innerHTML = "";

  availableFieldOptions.forEach((option) => {
    const opt = document.createElement("option");
    opt.value = option;
    opt.textContent = option;
    availableFieldsList.appendChild(opt);
  });

  displayedFieldOptions.forEach((option) => {
    const opt = document.createElement("option");
    opt.value = option;
    opt.textContent = option;
    displayedFieldsList.appendChild(opt);
  });
}

// Function to move selected field(s) to the displayed list
function moveToDisplayed() {
  const availableFieldsList = document.getElementById("availableFields");
  const selectedOptions = Array.from(availableFieldsList.selectedOptions);

  selectedOptions.forEach((option) => {
    const index = availableFieldOptions.indexOf(option.value);
    if (index !== -1) {
      const removedOption = availableFieldOptions.splice(index, 1);
      displayedFieldOptions.push(removedOption[0]);
    }
  });

  populateFieldsList();
  updateDisplayedFields();
}

// Function to move selected field(s) to the available list
function moveToAvailable() {
  const displayedFieldsList = document.getElementById("displayedFields");
  const selectedOptions = Array.from(displayedFieldsList.selectedOptions);

  selectedOptions.forEach((option) => {
    const index = displayedFieldOptions.indexOf(option.value);
    if (index !== -1) {
      const removedOption = displayedFieldOptions.splice(index, 1);
      availableFieldOptions.push(removedOption[0]);
    }
  });

  populateFieldsList();
  updateDisplayedFields();
}

// Function to update displayed fields in the table
function updateDisplayedFields(jsonData) {
  const selectedFields = displayedFieldOptions;

  const dataTable = document.getElementById("dataTable");
  dataTable.innerHTML = "";

  if (jsonData && jsonData.products) {
    const products = jsonData.products;
    const productIds = Object.keys(products);

    if (productIds.length > 0) {
      const table = document.createElement("table");
      const headerRow = document.createElement("tr");

      // Create table header with selected fields
      selectedFields.forEach((field) => {
        const th = document.createElement("th");
        th.textContent = field;
        headerRow.appendChild(th);
      });

      table.appendChild(headerRow);

      // Create table rows with data based on selected fields
      productIds.forEach((productId) => {
        const productData = products[productId];
        const tr = document.createElement("tr");

        selectedFields.forEach((field) => {
          const td = document.createElement("td");
          td.textContent = productData[field] || ""; // Display empty string if field is missing
          tr.appendChild(td);
        });

        table.appendChild(tr);
      });

      dataTable.appendChild(table);
    } else {
      console.error("No product data available.");
      dataTable.textContent = "No data available";
    }
  } else {
    console.error("Invalid JSON data format.");
    dataTable.textContent = "No data available";
  }
}

// Function to handle file import
function importDataFromFile() {
  const fileInput = document.getElementById("jsonDataFile");
  const file = fileInput.files[0];

  if (!file) {
    alert("Please select a file.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (event) {
    try {
      const jsonData = JSON.parse(event.target.result);
      updateDisplayedFields(jsonData);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      alert("Error parsing JSON file.");
    }
  };

  reader.readAsText(file);
}

// Call populateFieldsList to initialize the field options
populateFieldsList();
