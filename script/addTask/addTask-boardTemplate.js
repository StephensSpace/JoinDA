/**
 * Creates a task card element based on the given task details.
 * @param {Object} task - The task object containing details like title, category, priority, and subtasks.
 * @returns {HTMLElement} The created task card element.
 */

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

/**
 * Generates the initials from a given name.
 * @param {string} name - The full name of the contact.
 * @returns {string} The initials of the name in uppercase.
 */

function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

/**
 * Creates a progress bar and text for a task's subtasks.
 * @param {Object} task - The task object containing subtasks.
 * @returns {string} The HTML string for the subtasks progress UI.
 */

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

/**
 * Displays the details of a task in a modal, including category, title, description, due date, priority, and members.
 * @param {Object} task - The task object to display.
 */

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

  /**
   * Renders the subtasks of a task into the subtasks container element in the UI.
   * @param {Object} task - The task object containing subtasks.
   * @param {Array} task.subtasks - The array of subtasks, each with a title and completion state.
   */

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

/**
 * Adds a new subtask with the given title to the subtasks array and updates the list UI.
 * @param {string} title - The title of the subtask to add.
 */

function addSubtask(title) {
  if (title) {
    subtasksArray.push({ title, completed: false });
    updateSubtasksList();
    subtaskInput.value = "";
  }
}

/**
 * Updates the UI for the subtask list based on the current subtasks array.
 */

function updateSubtasksList() {
  const subtaskList = document.getElementById("subtaskList");
  subtaskList.innerHTML = "";

  subtasksArray.slice(0, 6).forEach((subtask, index) => {
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

  setupSubtaskActions();
}

/**
 * Sets up event listeners for subtask action buttons (edit and delete).
 */

function setupSubtaskActions() {
  const editIcons = document.querySelectorAll(".subtask-edit-icon");
  const deleteIcons = document.querySelectorAll(".subtask-delete-icon");
  editIcons.forEach((icon) => {
    icon.addEventListener("click", () => {
      const index = icon.dataset.index;
      editSubtask(index);
    });
  });
  deleteIcons.forEach((icon) => {
    icon.addEventListener("click", () => {
      const index = icon.dataset.index;
      deleteSubtask(index);
    });
  });
}

/**
 * Edits the title of a subtask and updates the subtask list.
 * @param {number} index - The index of the subtask to edit.
 */

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

/**
 * Saves the edited title of a subtask and updates the subtask list.
 * @param {number} index - The index of the subtask to update.
 * @param {string} newTitle - The new title for the subtask.
 */

function saveEditedSubtask(index, newTitle) {
  if (newTitle) {
    subtasksArray[index].title = newTitle;
  }
  updateSubtasksList();
}

/**
 * Deletes a subtask by its index and updates the subtask list.
 * @param {number} index - The index of the subtask to delete.
 */

function deleteSubtask(index) {
  subtasksArray.splice(index, 1);
  updateSubtasksList();
}

/**
 * Creates a list of subtasks with their completion states.
 * @param {Object} task - The task object containing subtasks.
 * @returns {string} The HTML string for the subtasks list.
 */

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

/**
 * Updates the task details modal with the given task's information.
 * @param {Object} task - The task object to display in the modal.
 */

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
  const priorityContainer = document.getElementById("taskDetailPriority");
  priorityContainer.innerHTML = "";
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

/**
 * Creates avatar elements for all members assigned to a task.
 * @param {Object} task - The task object containing member details.
 * @returns {string} The HTML string for the avatar elements.
 */

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

/**
 * Populates the contacts dropdown with the available contacts for task assignment.
 * @param {Object} contacts - An object containing contact details.
 */

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
      +assignedToUserCounter();
    });
    optionsContainer.appendChild(option);
  });
}
