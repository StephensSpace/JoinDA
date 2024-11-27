// Funktion zum Hinzufügen einer Subtask
function addSubtask(title) {
  if (title) {
    subtasksArray.push({ title, completed: false });
    updateSubtasksList(); // Liste aktualisieren
    subtaskInput.value = ""; // Eingabefeld leeren
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

// Event-Listener für Bearbeiten und Löschen
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

// Speichert die bearbeitete Subtask
function saveEditedSubtask(index, newTitle) {
  if (newTitle) {
    subtasksArray[index].title = newTitle; // Aktualisiere die Subtask
  }
  updateSubtasksList(); // Liste aktualisieren
}

// Löschen einer Subtask
function deleteSubtask(index) {
  subtasksArray.splice(index, 1); // Subtask entfernen
  updateSubtasksList(); // Liste aktualisieren
}

function createSubtasksList(task) {
  if (task.subtasks && task.subtasks.length > 0) {
    return task.subtasks.map((st) => `<li>${st.title}</li>`).join("");
  }
  return "<li>No subtasks</li>";
}
