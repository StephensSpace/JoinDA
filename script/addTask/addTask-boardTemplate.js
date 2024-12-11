function createTaskCard(task) {
  const card = document.createElement("div");
  card.className = "task-card";
  card.setAttribute("draggable", "true");
  card.dataset.id = task.id;
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
        <div class="progress-container">
          <div class="progress">
            <div class="progress-bar" style="width: ${progressPercent}%;"></div>
          </div>
          <div class="progress-text">
            <span>${completedSubtasks}/${totalSubtasks} Subtasks</span>
          </div>
        </div>
        <ul class="subtasks-list">
          ${task.subtasks
            .map(
              (subtask, index) => `
            <li class="subtask-item" data-id="${subtask.id}">
              <div class="subtask-checkbox" data-index="${index}">
                <img 
                  src="./assets/icons/${
                    subtask.completed ? "checked" : "unchecked"
                  }.png" 
                  alt="${subtask.completed ? "Completed" : "Incomplete"}" 
                  class="subtask-icon" 
                  data-completed="${subtask.completed}" 
                />
              </div>
              <span>${subtask.title}</span>
            </li>`
            )
            .join("")}
        </ul>
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
  card.addEventListener("dragstart", (e) => startDragging(e, card));
  card.addEventListener("dragend", () => {
    currentDraggedTask = null;
    draggedTask = null;
  });
  setupSubtaskIconClickListeners(task);
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
  const total = task.subtasks ? task.subtasks.length : 0;
  const completed = task.subtasks
    ? task.subtasks.filter((st) => st.completed).length
    : 0;
  const percent = total > 0 ? (completed / total) * 100 : 0;

  if (total > 0) {
    return `
        <div class="progress-container">
          <div class="progress">
            <div class="progress-bar" style="width: ${percent}%;"></div>
          </div>
          <span class="progress-text">${completed}/${total} Subtasks</span>
        </div>
      `;
  }
  return "<span>No Subtasks</span>";
}

function showTaskDetails(task) {
  currentTask = task;
  currentTaskId = task.id;
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
  renderTaskSubtasks(task);

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
  function renderTaskSubtasks(task) {
    const subtasksContainer = document.getElementById("taskSubtasks");
    subtasksContainer.innerHTML = createSubtasksList(task);
    if (!subtasksContainer) {
      console.error("Subtasks container element not found.");
      return;
    }
    if (task.subtasks && task.subtasks.length > 0) {
      subtasksContainer.innerHTML = task.subtasks
        .map(
          (st, index) => `
            <div class="subtask-item">
              <input type="checkbox" class="subtask-checkbox" ${
                st.completed ? "checked" : ""
              } data-index="${index}" />
              <span>${st.title}</span>
            </div>`
        )
        .join("");
    } else {
      subtasksContainer.innerHTML = "<p>No subtasks</p>";
    }
    attachSubtaskProgressListener(task);
    setupSubtaskIconClickListeners(task);
  }
  document.getElementById("taskDetailsModal").style.display = "block";
  attachSubtaskProgressListener(task);
}

function addSubtask(title) {
  if (title) {
    subtasksArray.push({ title, completed: false });
    updateSubtasksList();
    subtaskInput.value = "";
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

function saveEditedSubtask(index, newTitle) {
  if (newTitle) {
    subtasksArray[index].title = newTitle;
  }
  updateSubtasksList();
}

function deleteSubtask(index) {
  subtasksArray.splice(index, 1);
  updateSubtasksList();
}

function createSubtasksList(task) {
  if (task.subtasks && task.subtasks.length > 0) {
    return task.subtasks
      .map(
        (subtask, index) => `
            <li class="subtask-item" data-id="${subtask.id}">
              <div class="subtask-checkbox" data-index="${index}">
                <img 
                  src="./assets/icons/${
                    subtask.completed ? "checked" : "unchecked"
                  }.png" 
                  alt="${subtask.completed ? "Completed" : "Incomplete"}" 
                  class="subtask-icon" 
                  data-completed="${subtask.completed}" 
                  data-index="${index}"
                />
              </div>
              <span>${subtask.title}</span>
            </li>
          `
      )
      .join("");
  }
  return "<li>No subtasks</li>";
}

// Event Listener for Subtask Icons
function setupSubtaskIconClickListeners(task) {
  const taskCard = document.querySelector(`.task-card[data-id="${task.id}"]`);
  if (!taskCard) {
    console.error(`Task card with ID ${task.id} not found.`);
    return;
  }

  const subtaskItems = taskCard.querySelectorAll(".subtask-item");

  subtaskItems.forEach((item) => {
    const checkbox = item.querySelector(".subtask-checkbox img");

    if (!checkbox) {
      console.error("Subtask icon not found.");
      return;
    }

    checkbox.addEventListener("click", () => {
      const subtaskIndex = parseInt(item.dataset.index, 10);
      if (isNaN(subtaskIndex) || !task.subtasks[subtaskIndex]) {
        console.error("Invalid subtask index.");
        return;
      }

      // Toggle the subtask's completion state
      const subtask = task.subtasks[subtaskIndex];
      subtask.completed = !subtask.completed;

      // Update the icon
      checkbox.src = `./assets/icons/${
        subtask.completed ? "checked" : "unchecked"
      }.png`;

      // Update progress bar and text
      updateTaskProgress(task);
    });
  });
}

function updateTaskDetailsModal(task) {
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
  // Stelle sicher, dass das Prio-Icon zurückgesetzt wird
  const priorityContainer = document.getElementById("taskDetailPriority");
  priorityContainer.innerHTML = ""; // Zurücksetzen
  const priorityIcon =
    task.priority === "Urgent"
      ? "./assets/icons/urgent.png"
      : task.priority === "Medium"
      ? "./assets/icons/medium.png"
      : "./assets/icons/low.png";
  priorityContainer.innerHTML = `
          ${task.priority || "Medium"} 
          <img src="${priorityIcon}" alt="${
    task.priority
  }" class="priority-icon" />
      `;
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
}

function createAssignedAvatars(task) {
  if (task.members && task.members.length > 0) {
    let avatars = task.members
      .map((member) => {
        let initials = getInitials(member);
        let color = getColorForMember(member);
        return `<div class="avatar" style="background-color: ${color}">${initials}</div>`;
      })
      .join("");
    return `<div class="avatars">${avatars}</div>`;
  }
  return "";
}

function populateContactsDropdown(contacts) {
  const optionsContainer = document.getElementById("taskAssignedOptions");
  const selectedContainer = document.getElementById(
    "selectedContactsContainer"
  );
  optionsContainer.innerHTML = "";
  if (!contacts) {
    optionsContainer.innerHTML =
      '<div class="no-contacts">No contacts available</div>';
    return;
  }
  Object.keys(contacts).forEach((contactId) => {
    const contact = contacts[contactId];
    const initials = getInitials(contact.name);
    const color = getColorForContact(contact.name);
    const option = document.createElement("div");
    option.className = "dropdown-option";
    option.dataset.value = contact.name;
    option.innerHTML = `
          <span class="contact-initials" style="background-color: ${color}">
            ${initials}
          </span>
          <span>${contact.name}</span>
          <img class="select-icon" src="./assets/icons/property-default.png" alt="Select Icon">
      <img class="selected-icon" src="./assets/icons/property-checked.png" alt="Selected Icon">
        `;
    option.addEventListener("click", () => {
      toggleContactSelection(option, initials, color, selectedContainer);
    });
    optionsContainer.appendChild(option);
  });
}
