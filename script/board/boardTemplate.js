function createTaskCard(task) {
  if (!task || typeof task !== "object") {
    console.error("Ungültige Aufgabe übergeben:", task);
    return null;
  }
  const members = Array.isArray(task.members) ? task.members : [];
  const subtasks = Array.isArray(task.subtasks) ? task.subtasks : [];
  const totalSubtasks = subtasks.length;
  const completedSubtasks = subtasks.filter((st) => st.completed).length;
  const progressPercent =
    totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;
  const card = document.createElement("div");
  card.className = "task-card";
  card.setAttribute("draggable", "true");
  card.dataset.id = task.id;
  card.innerHTML = `
    <div class="task-category" style="background-color: ${
      task.category === "User Story" ? "#0038FF" : "#1FD7C1"
    }; color: white;">
      ${task.category || "Technical Task"}
    </div>
    <h3>${task.title || "Untitled Task"}</h3>
    <p>${task.description || "No description provided"}</p>
    <div class="progress-container">
      <div class="progress">
        <div class="progress-bar" style="width: ${progressPercent}%;"></div>
      </div>
      <div class="progress-text">
        <span>${completedSubtasks}/${totalSubtasks} Subtasks</span>
      </div>
    </div>
    <div class="task-footer">
      <div class="avatars">
        ${members
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
      <img src="./assets/icons/${task.priority?.toLowerCase() || "low"}.png" 
           alt="${task.priority || "Low"}" 
           class="priority-icon" />
    </div>
  `;
  card.addEventListener("dragstart", (e) => startDragging(e, card));
  card.addEventListener("dragend", () => {
    currentDraggedTask = null;
    draggedTask = null;
  });
  card.addEventListener("click", () => showTaskDetails(task));
  return card;
}


function renderSubtaskUI(subtaskElement, subtask) {
  subtaskElement.src = `./assets/icons/${
    subtask.completed ? "checked" : "unchecked"
  }.png`;
  subtaskElement.dataset.completed = subtask.completed;
}

function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

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
  let index = name.charCodeAt(0) % colors.length;
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
  renderTaskSubtasks(task);
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
  document.getElementById("taskDetailsModal").style.display = "block";
}

function renderTaskSubtasks(task) {
  const subtasksContainer = document.getElementById("taskSubtasks");
  if (!subtasksContainer) {
    return;
  }
  if (task.subtasks && task.subtasks.length > 0) {
    subtasksContainer.innerHTML = task.subtasks
      .map(
        (subtask, index) => `
                <li data-id="${index}">
                  <img 
                    src="./assets/icons/${
                      subtask.completed ? "checked" : "unchecked"
                    }.png" 
                    class="subtask-icon" 
                    alt="${subtask.title}" 
                    data-completed="${subtask.completed}" 
                    data-task-id="${task.id}" 
                  />
                  <span>${subtask.title}</span>
                </li>`
      )
      .join("");
  } else {
    subtasksContainer.innerHTML = "<p>No subtasks</p>";
  }
  setupSubtaskIconClickListeners(task);
}

function setupSubtaskIconClickListeners(task) {
  const subtasksContainer = document.getElementById("taskSubtasks");
  if (!subtasksContainer) {
    return;
  }
  subtasksContainer.querySelectorAll(".subtask-icon").forEach((icon) => {
    icon.addEventListener("click", (event) => {
      event.stopPropagation();
      const subtaskIndex = parseInt(icon.parentElement.dataset.id);
      if (isNaN(subtaskIndex)) {
        return;
      }
      if (!task.subtasks || !task.subtasks[subtaskIndex]) {
        return;
      }
      const completed = icon.dataset.completed === "true";
      task.subtasks[subtaskIndex].completed = !completed;
      updateSubtaskInFirebase(
        task.id,
        subtaskIndex,
        task.subtasks[subtaskIndex].completed
      );
      icon.dataset.completed = String(task.subtasks[subtaskIndex].completed);
      icon.src = `./assets/icons/${
        task.subtasks[subtaskIndex].completed ? "checked" : "unchecked"
      }.png`;
      updateTaskProgress(task);
    });
  });
}

function addSubtask(title) {
  if (title) {
    subtasksArray.push({ title, completed: false });
    updateSubtasksList();
    subtaskInput.value = "";
  }
}

function updateSubtasksList() {
  const subtaskList = document.getElementById("subtaskList");
  subtaskList.innerHTML = "";
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
  setupSubtaskActions();
}

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

function initializeSubtaskListeners(taskCard, task) {
  taskCard.querySelectorAll(".subtask-icon").forEach((icon) => {
    icon.addEventListener("click", () => {
      const subtaskIndex = parseInt(icon.parentElement.dataset.id);
      if (isNaN(subtaskIndex)) {
        return;
      }
      const taskId = task.id;
      const completed = icon.dataset.completed === "true";
      task.subtasks[subtaskIndex].completed = !completed;
      updateSubtaskInFirebase(
        taskId,
        subtaskIndex,
        task.subtasks[subtaskIndex].completed
      );
      icon.dataset.completed = String(task.subtasks[subtaskIndex].completed);
      icon.src = `./assets/icons/${
        task.subtasks[subtaskIndex].completed ? "checked" : "unchecked"
      }.png`;
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
