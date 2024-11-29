// Öffne Add Task Modal und setze die Kategorie
function openAddTaskModal(type) {
  selectedType = type || "todo"; // Setze die Kategorie basierend auf Spalte
  resetAddTaskModal(); // Modal zurücksetzen
  document.getElementById("addTaskModal").style.display = "block";
  fetchContacts((contacts) => {
    populateContactsDropdown(contacts); // Kontakte laden
  });
}

function addTaskToBoard(task) {
  const status = task.type || "todo";
  const boardColumn = document.querySelector(
    `.board-column[data-status="${status}"]`
  );
  if (!boardColumn) return console.error(`No column found for type: ${status}`);
  const tasksContainer = boardColumn.querySelector(".tasks-container");
  if (!tasksContainer) return;
  const taskCard = createTaskCard(task); // Task-Karte erstellen
  tasksContainer.appendChild(taskCard);

  // Drag-and-Drop-Events hinzufügen
  taskCard.addEventListener("dragstart", (e) => startDragging(e, taskCard));
  taskCard.addEventListener("dragend", () => (currentDraggedTask = null));

  updateNoTasksMessage(boardColumn); // Aktualisiere "No Tasks"-Nachricht
}

function handleTaskSubmit(e) {
  e.preventDefault(); // Verhindert das Standardverhalten des Formulars
  try {
    console.log("handleTaskSubmit aufgerufen, selectedType:", selectedType);

    // Überprüfe, ob alle Pflichtfelder ausgefüllt sind
    const isCategoryValid = checkCategory();
    const isTitleValid = checkTitle();
    const isDateValid = checkDueDate();

    if (isCategoryValid && isTitleValid && isDateValid) {
      const typeInput = document.getElementById("taskTypeInput");
      const task = {
        title: document.getElementById("taskTitle").value,
        description: document.getElementById("taskDescription").value,
        dueDate: document.getElementById("taskDueDate").value,
        type: selectedType || "todo", // Spalte (z. B. todo, in-progress)
        category: typeInput.value, // Kategorie der Aufgabe
        priority: selectedPriority || "Medium",
        subtasks: subtasksArray,
        members: selectedMembers,
      };

      saveTaskToFirebase(task); // Speichere die Task
      closeModal(); // Schließe das Modal
      resetAddTaskModal(); // Setze die Inhalte des Modals zurück
    }
  } catch (error) {
    console.error("Fehler in handleTaskSubmit:", error);
  }
}

function checkTitle() {
  const titleInput = document.getElementById("taskTitle");
  const titleError = document.getElementById("titleError");

  if (!titleInput.value.trim()) {
    titleError.classList.remove("hidden");
    titleInput.focus();
    return false;
  } else {
    titleError.classList.add("hidden");
    return true;
  }
}

function checkDueDate() {
  const dateInput = document.getElementById("taskDueDate");
  const dateError = document.getElementById("dueDateError");

  if (!dateInput.value) {
    dateError.classList.remove("hidden");
    dateInput.focus();
    return false;
  } else {
    dateError.classList.add("hidden");
    return true;
  }
}

function checkCategory() {
  const typeInput = document.getElementById("taskTypeInput");
  const categoryError = document.getElementById("msg-box");

  if (!typeInput.value) {
    categoryError.classList.remove("hidden");
    return false;
  } else {
    categoryError.classList.add("hidden");
    return true;
  }
}

function updatePriorityIcon(priority) {
  const priorityIcon = document.getElementById("taskDetailPriorityIcon");
  if (priorityIcon) {
    if (priority === "Urgent") {
      priorityIcon.innerHTML =
        '<img src="./assets/icons/urgent.png" alt="Urgent">';
    } else if (priority === "Medium") {
      priorityIcon.innerHTML =
        '<img src="./assets/icons/medium.png" alt="Medium">';
    } else if (priority === "Low") {
      priorityIcon.innerHTML = '<img src="./assets/icons/low.png" alt="Low">';
    } else {
      priorityIcon.innerHTML = ""; // Keine Priorität
    }
  }
}

function resetAddTaskModal() {
  document.getElementById("taskTitle").value = ""; // Titel leeren
  document.getElementById("taskDescription").value = ""; // Beschreibung leeren
  document.getElementById("taskDueDate").value = ""; // Datum leeren
  document.getElementById("subtaskInput").value = ""; // Subtask-Eingabe leeren
  subtasksArray = []; // Subtasks zurücksetzen
  updateSubtasksList(); // Subtask-Liste aktualisieren
  document
    .querySelectorAll(".priority-btn")
    .forEach((btn) => btn.classList.remove("active")); // Prioritäten zurücksetzen
  document.getElementById("taskCategorySelectedText").textContent =
    "Select task category"; // Kategorie-Text zurücksetzen
  document.getElementById("taskTypeInput").value = ""; // Standardkategorie
  selectedMembers = []; // Ausgewählte Mitglieder leeren
  updateSelectedMembers(); // Mitgliederanzeige zurücksetzen

  hideErrorMessages(); // Fehlermeldungen ausblenden
}

function hideErrorMessages() {
  const titleError = document.getElementById("titleError");
  const dateError = document.getElementById("dueDateError");
  const categoryError = document.getElementById("msg-box");

  if (titleError) titleError.classList.add("hidden");
  if (dateError) dateError.classList.add("hidden");
  if (categoryError) categoryError.classList.add("hidden");
}

// Funktion zum Schließen des Modals
function closeModal() {
  const addTaskModal = document.getElementById("addTaskModal");
  addTaskModal.style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  const categoryDropdown = document.getElementById("taskCategoryDropdown");
  const categoryOptions = document.getElementById("taskCategoryOptions");
  const categorySelectedText = document.getElementById(
    "taskCategorySelectedText"
  );
  const typeInput = document.getElementById("taskTypeInput");

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
        typeInput.value = selectedCategory; // Setzt den Wert im versteckten Input-Feld
        categoryOptions.classList.add("hidden"); // Dropdown schließen
      });
    });

  // Dropdown schließen, wenn außerhalb geklickt wird
  document.addEventListener("click", () => {
    categoryOptions.classList.add("hidden");
  });
});
