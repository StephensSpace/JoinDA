document.addEventListener("DOMContentLoaded", () => {
  const categoryDropdown = document.getElementById("taskCategoryDropdown");
  const categoryOptions = document.getElementById("taskCategoryOptions");
  const categorySelectedText = document.getElementById(
    "taskCategorySelectedText"
  );
  const categoryInput = document.getElementById("taskTypeInput");

  // Dropdown öffnen/schließen
  categoryDropdown.addEventListener("click", (e) => {
    e.stopPropagation(); // Verhindert sofortiges Schließen
    categoryOptions.classList.toggle("hidden"); // Dropdown zeigen/verstecken
  });

  // Kategorie auswählen
  document
    .querySelectorAll("#taskCategoryOptions .dropdown-option")
    .forEach((option) => {
      option.addEventListener("click", () => {
        const selectedCategory = option.dataset.value; // Ausgewählte Kategorie
        categorySelectedText.textContent = selectedCategory; // Zeigt die Kategorie im Dropdown
        categoryInput.value = selectedCategory; // Setzt den Wert im versteckten Input-Feld
        categoryOptions.classList.add("hidden"); // Dropdown schließen
      });
    });

  // Dropdown schließen, wenn außerhalb geklickt wird
  document.addEventListener("click", () => {
    categoryOptions.classList.add("hidden");
  });
});
