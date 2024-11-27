function openAddTaskModal(category) {
  selectedCategory = category || "todo"; // Ausgewählte Kategorie setzen
  document.getElementById("addTaskModal").style.display = "block";
  resetAddTaskForm();
  // Kontakte abrufen und Dropdown füllen
  fetchContacts((contacts) => {
    populateContactsDropdown(contacts);
  });
}

function addTaskToBoard(task) {
  let status = task.category || "todo";
  let boardColumn = document.querySelector(
    `.board-column[data-status="${status}"]`
  );
  if (boardColumn) {
    let tasksContainer = boardColumn.querySelector(".tasks-container");
    if (tasksContainer) {
      let taskCard = createTaskCard(task);
      tasksContainer.appendChild(taskCard);
      updateNoTasksMessage(boardColumn);
    }
  }
}

function createTaskCard(task) {
  let card = document.createElement("div");
  card.className = "task-card";
  card.dataset.id = task.id;
  card.innerHTML = `
          <div class="tag">${task.type || "Task"}</div>
          <h3>${task.title}</h3>
          <p>${task.Description}</p>
          ${createSubtasksProgress(task)}
          ${createAssignedAvatars(task)}
          <div class="icon menu-icon">&#9776;</div>
        `;
  card.addEventListener("click", () => showTaskDetails(task));
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
