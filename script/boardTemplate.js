function createTaskCard(task) {
  const card = document.createElement("div");
  card.className = "task-card";
  card.setAttribute("draggable", "true");
  card.dataset.id = task.id; // Task-ID for reference

  // Calculate progress
  const totalSubtasks = task.subtasks ? task.subtasks.length : 0;
  const completedSubtasks = task.subtasks
    ? task.subtasks.filter((st) => st.completed).length
    : 0;
  const progressPercent =
    totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  card.innerHTML = `
      <div class="task-category" style="background-color: ${
        task.category === "User Story" ? "#0038FF" : "#1FD7C1"
      }; color: white;">
        ${task.category || "Technical Task"}
      </div>
      <h3>${task.title}</h3>
      <p>${task.description || "No description provided"}</p>
      <div class="progress">
        <div class="progress-bar" style="width: ${progressPercent}%;"></div>
        <span>${completedSubtasks}/${totalSubtasks} Subtasks</span>
      </div>
      <div class="task-footer">
        <div class="avatars">
          ${task.members
            .map(
              (name) => `
              <div class="avatar" style="background-color: ${getColorForContact(
                name
              )};">
                ${getInitials(name)}
              </div>`
            )
            .join("")}
        </div>
        <img src="./assets/icons/${task.priority.toLowerCase()}.png" alt="${
    task.priority
  }" class="priority-icon" />
      </div>
    `;

  // Add Event Listeners for Dragging and Details
  card.addEventListener("dragstart", (e) => startDragging(e, card));
  card.addEventListener("dragend", () => {
    currentDraggedTask = null;
    draggedTask = null;
  });
  card.addEventListener("click", () => showTaskDetails(task));

  return card;
}

// Funktion zur Berechnung der Initialen
function getInitials(name) {
  if (!name) return "?"; // Fallback für leere Namen
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

// Funktion zur Berechnung der Hintergrundfarbe basierend auf dem Namen
function getColorForContact(name) {
  const colors = [
    "#FF7A00",
    "#6E52FF",
    "#9327FF",
    "#FC71FF",
    "#FFBB2B",
    "#1FD7C1",
    "#462F8A",
    "#FF4646",
    "#00BEE8",
  ];
  let index = name.charCodeAt(0) % colors.length; // Basierend auf dem ersten Buchstaben
  return colors[index];
}

function createSubtasksProgress(task) {
  let total = task.subtasks ? task.subtasks.length : 0;
  if (total > 0) {
    let completed = task.subtasks.filter((st) => st.completed).length;
    let percent = (completed / total) * 100;
    return `
              <div class="progress">
                <div class="progress-bar" style="width: ${percent}%"></div>
                <div class="progress-text">
                <span>${completed}/${total} Subtasks</span>
                </div>
              </div>
              
            `;
  }
  return "";
}

function showTaskDetails(task) {
  currentTask = task;
  currentTaskId = task.id;

  // Display Task Type with its Color
  document.getElementById("taskType").innerHTML = `
      <div style="background-color: ${
        task.category === "User Story" ? "#0038FF" : "#1FD7C1"
      }; color: white; padding: 5px 10px; border-radius: 5px;">
        ${task.category || "Technical Task"}
      </div>`;

  document.getElementById("taskDetailTitle").innerText = task.title;
  document.getElementById("taskDetailDescription").innerText =
    task.description || "No description provided";
  document.getElementById("taskDetailDueDate").innerText =
    task.dueDate || "N/A";

  // Priority Display with Icon
  const priorityIcon =
    task.priority === "Urgent"
      ? "./assets/icons/urgent.png"
      : task.priority === "Medium"
      ? "./assets/icons/medium.png"
      : "./assets/icons/low.png";

  document.getElementById("taskDetailPriority").innerHTML = `
      ${task.priority || "Medium"} 
      <img src="${priorityIcon}" alt="${task.priority}" class="priority-icon" />
    `;

  // Display Assigned Contacts with Colors
  document.getElementById("taskAssignedTo").innerHTML = task.members
    ? task.members
        .map(
          (name) => `
            <div class="avatar-container">
              <div class="avatar" style="background-color: ${getColorForContact(
                name
              )};">${getInitials(name)}</div>
              <span>${name}</span>
            </div>`
        )
        .join("")
    : "<p>No members assigned</p>";

  // Display Subtasks with Checkbox
  document.getElementById("taskSubtasks").innerHTML = task.subtasks
    ? task.subtasks
        .map(
          (st, index) => `
            <div class="subtask-item">
              <input type="checkbox" ${
                st.completed ? "checked" : ""
              } data-index="${index}" />
              <span>${st.title}</span>
            </div>`
        )
        .join("")
    : "<p>No subtasks</p>";

  document.getElementById("taskDetailsModal").style.display = "block";

  // Attach Event Listener for Subtasks Progress
  attachSubtaskProgressListener(task);
}

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
    return task.subtasks
      .map(
        (subtask) => `
          <li>
            <input type="checkbox" ${
              subtask.completed ? "checked" : ""
            } data-id="${subtask.id}">
            <span>${subtask.title}</span>
          </li>
        `
      )
      .join("");
  }
  return "<li>No subtasks</li>";
}
