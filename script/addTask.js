// Öffne Add Task Modal und setze die Kategorie
function openAddTaskModal(category) {
  selectedCategory = category || "todo"; // Setze die Kategorie basierend auf Spalte
  resetAddTaskModal(); // Modal zurücksetzen
  document.getElementById("addTaskModal").style.display = "block";
  fetchContacts((contacts) => {
    populateContactsDropdown(contacts); // Kontakte laden
  });
}

function addTaskToBoard(task) {
  const status = task.category || "todo";
  const boardColumn = document.querySelector(
    `.board-column[data-status="${status}"]`
  );
  if (!boardColumn)
    return console.error(`No column found for category: ${status}`);
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

  const task = {
    title: document.getElementById("taskTitle").value,
    description: document.getElementById("taskDescription").value,
    dueDate: document.getElementById("taskDueDate").value,
    category: selectedCategory || "todo", // Spalte (z. B. todo, in-progress)
    type: document.getElementById("taskTypeInput").value || "Technical Task", // Typ der Task
    priority: selectedPriority || "Medium",
    subtasks: subtasksArray,
    members: selectedMembers,
  };

  saveTaskToFirebase(task); // Speichere die Task
  closeModal(); // Schließe das Modal
  resetAddTaskModal(); // Setze die Inhalte des Modals zurück
}

function createTaskCard(task) {
  const card = document.createElement("div");
  card.className = "task-card";
  card.setAttribute("draggable", "true"); // Drag-and-Drop aktivieren
  card.dataset.id = task.id; // Task-ID für spätere Referenz
  card.dataset.category = task.category; // Kategorie zuweisen

  card.innerHTML = `
        <div class="tag">${task.type || "Task"}</div>
        <h3>${task.title}</h3>
        <p>${task.description || "No description provided"}</p>
        <div class="progress">
          <span>${task.subtasks ? task.subtasks.length : 0} Subtasks</span>
        </div>
        <div class="avatars">${createAssignedAvatars(task)}</div>
      `;

  card.addEventListener("click", () => showTaskDetails(task)); // Details anzeigen

  // Drag-and-Drop Event Listener hinzufügen
  card.addEventListener("dragstart", (e) => {
    startDragging(e, card);
    draggedTask = card; // 'draggedTask' setzen
  });

  card.addEventListener("dragend", () => {
    currentDraggedTask = null;
    draggedTask = null;
  });

  return card;
}

function createSubtasksProgress(task) {
  let total = task.subtasks ? task.subtasks.length : 0;
  if (total > 0) {
    let completed = task.subtasks.filter((st) => st.completed).length;
    let percent = (completed / total) * 100;
    return `
            <div class="progress">
              <div class="progress-bar" style="width: ${percent}%"></div>
              <span>${completed}/${total} Subtasks</span>
            </div>
          `;
  }
  return "";
}

function updatePriorityIcon(priority) {
  const priorityIcon = document.getElementById("taskDetailPriorityIcon");
  if (priorityIcon) {
    // Set the icon or styling based on priority
    if (priority === "Urgent") {
      priorityIcon.innerHTML =
        '<img src="./assets/icons/urgent.png" alt="Urgent">';
    } else if (priority === "Medium") {
      priorityIcon.innerHTML =
        '<img src="./assets/icons/medium.png" alt="Medium">';
    } else if (priority === "Low") {
      priorityIcon.innerHTML = '<img src="./assets/icons/low.png" alt="Low">';
    } else {
      priorityIcon.innerHTML = "";
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
  document.getElementById("taskTypeInput").value = "todo"; // Standardkategorie
  selectedMembers = []; // Ausgewählte Mitglieder leeren
  updateSelectedMembers(); // Mitgliederanzeige zurücksetzen
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
