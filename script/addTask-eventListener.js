// eventListener.js

document.addEventListener("DOMContentLoaded", () => {
  // Formular zurücksetzen und Kontakte laden
  resetAddTaskForm();
  fetchContacts((contacts) => {
    populateContactsDropdown(contacts);
  });

  // Event Listener für das "Add Task"-Formular
  const addTaskForm = document.getElementById("addTaskForm");
  if (addTaskForm) {
    addTaskForm.addEventListener("submit", function (event) {
      event.preventDefault();
      let taskData = collectFormData();
      saveTaskToFirebase(taskData);
    });
  }

  // Event Listener für den "Cancel"-Button
  const cancelButton = document.getElementById("cancelButton");
  if (cancelButton) {
    cancelButton.addEventListener("click", (event) => {
      event.preventDefault();
      resetAddTaskForm();
      // Optional: Zurück zur Board-Seite navigieren
      window.location.href = "board.html";
    });
  }

  // Event Listener für die Prioritätsbuttons
  const priorityButtons = document.querySelectorAll(".priority-btn");
  priorityButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Entferne die aktive Klasse von allen Buttons
      priorityButtons.forEach((btn) => {
        btn.classList.remove("active");
        const icon = btn.querySelector(".priority-icon");
        if (icon) {
          icon.style.filter = "none"; // Standardfarbe wiederherstellen
        }
      });
      button.classList.add("active");
      const icon = button.querySelector(".priority-icon");
      if (icon) {
        icon.style.filter = "brightness(0) invert(1)"; // Icon in Weiß färben
      }
      selectedPriority = button.dataset.priority;
    });
  });

  // Event Listener für den "Subtask hinzufügen"-Button
  const subtaskInput = document.getElementById("subtaskInput");
  const subtaskAddButton = document.querySelector(".subtask-add-button");
  subtaskAddButton.addEventListener("click", () => {
    addSubtask(subtaskInput.value.trim());
  });
  subtaskInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addSubtask(subtaskInput.value.trim());
    }
  });

  // Event Listener für den "Assigned to"-Dropdown
  const taskAssignedDropdown = document.getElementById("taskAssignedDropdown");
  if (taskAssignedDropdown) {
    taskAssignedDropdown.addEventListener("click", (event) => {
      event.stopPropagation();
      const optionsContainer = document.getElementById("taskAssignedOptions");
      optionsContainer.classList.toggle("hidden");
    });
  }

  // Close Dropdown When Clicking Outside
  document.addEventListener("click", () => {
    const optionsContainer = document.getElementById("taskAssignedOptions");
    optionsContainer.classList.add("hidden");
  });

  // Event Listener für den Kategorie-Dropdown
  const categoryDropdown = document.getElementById("taskCategoryDropdown");
  const categoryOptions = document.getElementById("taskCategoryOptions");
  const categorySelectedText = document.getElementById(
    "taskCategorySelectedText"
  );
  const categoryInput = document.getElementById("taskCategoryInput");

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
