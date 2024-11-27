// addtask.js

// Initialisieren von Variablen
let selectedPriority = "Medium"; // Standardpriorität
let selectedMembers = []; // Ausgewählte Kontakte
let subtasksArray = []; // Subtasks

// Funktion zum Sammeln der Formulardaten
function collectFormData() {
  return {
    title: document.getElementById("taskTitle").value,
    description: document.getElementById("taskDescription").value,
    dueDate: document.getElementById("taskDueDate").value,
    priority: selectedPriority,
    category: document.getElementById("taskTypeInput").value || "todo",
    type: document.getElementById("taskCategoryInput").value || "Task",
    members: selectedMembers,
    subtasks: subtasksArray,
  };
}

// Funktion zum Speichern der Task in Firebase
function saveTaskToFirebase(task) {
  const newTaskRef = firebase.database().ref("/tasks/").push();
  task.id = newTaskRef.key; // Generiere Task-ID
  newTaskRef
    .set(task)
    .then(() => {
      // Nach dem Speichern zur Board-Seite navigieren
      window.location.href = "board.html";
    })
    .catch((error) => {
      console.error("Fehler beim Speichern der Aufgabe:", error);
      // Optional: Zeigen Sie eine Fehlermeldung an
    });
}

// Funktion zum Zurücksetzen des Formulars
function resetAddTaskForm() {
  document.getElementById("addTaskForm").reset();
  selectedMembers = [];
  subtasksArray = [];
  selectedPriority = "Medium";
  updateSelectedMembers();
  updateSubtasksList();
  updatePriorityButtons();
  document.getElementById("taskCategorySelectedText").textContent =
    "Select task category";
}

// Funktion zum Aktualisieren der Prioritätsbuttons
function updatePriorityButtons() {
  document.querySelectorAll(".priority-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.priority === selectedPriority);
    const icon = btn.querySelector(".priority-icon");
    if (icon) {
      icon.style.filter =
        btn.dataset.priority === selectedPriority
          ? "brightness(0) invert(1)"
          : "none";
    }
  });
}

// Funktion zum Hinzufügen einer Subtask
function addSubtask(title) {
  if (title) {
    subtasksArray.push({ title, completed: false });
    updateSubtasksList(); // Liste aktualisieren
    document.getElementById("subtaskInput").value = ""; // Eingabefeld leeren
  }
}

// Funktion zum Aktualisieren der Subtasks-Liste
function updateSubtasksList() {
  const subtaskList = document.getElementById("subtaskList");
  subtaskList.innerHTML = ""; // Liste leeren

  subtasksArray.forEach((subtask, index) => {
    const li = document.createElement("li");
    li.className = "subtask-item";
    li.innerHTML = `
      <span class="subtask-title">${subtask.title}</span>
      <div class="subtask-actions">
        <img
          src="./assets/icons/edit.png"
          alt="Edit"
          class="subtask-edit-icon"
          data-index="${index}"
        />
        <img
          src="./assets/icons/delete.png"
          alt="Delete"
          class="subtask-delete-icon"
          data-index="${index}"
        />
      </div>
    `;
    subtaskList.appendChild(li);
  });

  setupSubtaskActions(); // Bearbeiten- und Löschen-Listener hinzufügen
}

// Funktion zum Einrichten der Subtask-Aktionen
function setupSubtaskActions() {
  const editIcons = document.querySelectorAll(".subtask-edit-icon");
  const deleteIcons = document.querySelectorAll(".subtask-delete-icon");

  // Bearbeiten
  editIcons.forEach((icon) => {
    icon.addEventListener("click", () => {
      const index = icon.dataset.index;
      editSubtask(index);
    });
  });

  // Löschen
  deleteIcons.forEach((icon) => {
    icon.addEventListener("click", () => {
      const index = icon.dataset.index;
      deleteSubtask(index);
    });
  });
}

// Bearbeiten einer Subtask
function editSubtask(index) {
  const span = document.querySelectorAll(".subtask-title")[index];
  const input = document.createElement("input");
  input.type = "text";
  input.value = span.textContent;
  input.className = "subtask-edit-input";
  span.replaceWith(input);
  input.focus();
  const save = () => {
    if (input.value.trim()) subtasksArray[index].title = input.value.trim();
    updateSubtasksList();
  };
  input.addEventListener("keydown", (e) => e.key === "Enter" && save());
  input.addEventListener("blur", save);
}

// Löschen einer Subtask
function deleteSubtask(index) {
  subtasksArray.splice(index, 1); // Subtask entfernen
  updateSubtasksList(); // Liste aktualisieren
}

// Weitere Funktionen (z.B. getInitials, getColorForContact) in utils.js
