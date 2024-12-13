const logedUser = sessionStorage.getItem("User");
let selectedPriority = "Medium";
let enableDragCounter = 0;
let selectedMembers = [];
let subtasksArray = [];
let currentTaskId = null;
let selectedCategory = "";
let isEditMode = false;
let currentDraggedTask = null;
let draggedTask = null;
let selectedType = "todo";
let tasksMap = {};
fetchTasks((tasks) => {
  tasksMap = tasks;
});

function fetchUsers(callback) {
  firebase
    .database()
    .ref("/contacts/")
    .once("value")
    .then((snapshot) => {
      callback(snapshot.val());
    });
}

function fetchTasks(callback) {
  firebase
    .database()
    .ref("/tasks/")
    .once("value")
    .then((snapshot) => {
      const tasks = snapshot.val();
      if (!tasks) {
        return;
      }

      callback(tasks);
    })
    .catch(() => {});
}

function renderTasks(tasks) {
  for (let taskId in tasks) {
    const task = tasks[taskId];
    if (!task || typeof task !== "object" || !task.title) {
      continue;
    }
    addTaskToBoard(task);
  }
}

function renderTasksOnBoard() {
  fetchTasks((tasks) => {
    document.querySelectorAll(".board-column").forEach((column) => {
      const columnType = column.getAttribute("data-type");
      const tasksContainer = column.querySelector(".tasks-container");
      tasksContainer.innerHTML = "";
      Object.values(tasks)
        .filter((task) => task.type === columnType)
        .forEach((task) => {
          const taskCard = createTaskCard(task);
          tasksContainer.appendChild(taskCard);
        });
        updateNoTasksMessage(column);
    });
    enableDragAndDrop();
  });
}


function updateNoTasksMessage(column) {
  const tasksContainer = column.querySelector(".tasks-container");
  const noTasksMessage = column.querySelector(".no-tasks");
  if (!tasksContainer || !noTasksMessage) {
    return;
  }
  const hasTasks = tasksContainer.children.length > 0;
  noTasksMessage.style.display = hasTasks ? "none" : "block";
}

function createAssignedToList(task) {
  const members = task.members || [];
  return members
    .map(
      (member) =>
        `<div class="avatar" style="background-color: ${getColorForContact(
          member
        )};">${getInitials(member)}</div>`
    )
    .join("");
}

function openEditTaskModal() {
  if (currentTask) {
    isEditMode = true;
    currentTaskId = currentTask.id;
    populateEditTaskForm(currentTask);
    document.getElementById("addTaskModal").style.display = "block";
  }
}

function collectSubtasksData() {
  const subtasks = [];
  document.querySelectorAll(".edit-subtask").forEach((subtaskElement) => {
    subtasks.push({
      title: subtaskElement.querySelector(".subtask-title").value,
      completed: subtaskElement.querySelector(".subtask-checkbox").checked,
    });
  });
  return subtasks;
}

function updateTaskInFirebase(taskId, updatedData) {
  firebase
    .database()
    .ref(`/tasks/${taskId}`)
    .update(updatedData)
    .then(() => {
      updateTaskOnBoard(taskId, updatedData);
    })
    .catch(() => {
    });
}

function updateTaskOnBoard(taskId, taskData) {
  removeTaskFromBoard(taskId);
  taskData.id = taskId;
  addTaskToBoard(taskData);
}

function loadTasksFromFirebase() {
  const tasksRef = firebase.database().ref("tasks");
  tasksRef.once("value", (snapshot) => {
    const tasks = snapshot.val();
    Object.values(tasks).forEach((task) => {
      const column = document.querySelector(
        `.board-column[data-type="${task.type}"] .tasks-container`
      );
      if (column) {
        const taskCard = createTaskCard(task);
        column.appendChild(taskCard);
      }
    });
    enableDragAndDrop();
  });
}

function populateEditTaskForm(task) {
  document.getElementById("taskTitle").value = task.title || "";
  document.getElementById("taskDescription").value = task.description || "";
  document.getElementById("taskDueDate").value = task.dueDate || "";
  selectedPriority = task.priority || "Medium";
  updatePriorityButtons();
  selectedType = task.type;
  document.getElementById("taskTypeInput").value = task.category || ""; 
  document.getElementById("secondDropdownSelectedText").textContent =
    task.category || "Select a category";
  selectedMembers = task.members || [];
  updateSelectedMembers();
  subtasksArray = task.subtasks || [];
  updateSubtasksList();
  const actionButton = document.getElementById("createTaskButton");
  actionButton.textContent = "Edit Task";
}

function closeTaskDetailsModal() {
  document.getElementById("taskDetailsModal").style.display = "none";
}

function deleteCurrentTask() {
  if (currentTaskId) {
    deleteTaskFromFirebase(currentTaskId)
      .then(() => {
        removeTaskFromBoard(currentTaskId);
        closeTaskDetailsModal();
      })
      .catch(() => {});
  }
}

function deleteTaskFromFirebase(taskId) {
  return firebase
    .database()
    .ref("/tasks/" + taskId)
    .remove();
}

function removeTaskFromBoard(taskId) {
  const taskCard = document.querySelector(`.task-card[data-id="${taskId}"]`);
  if (taskCard) {
    const tasksContainer = taskCard.parentElement;
    taskCard.remove();
    updateNoTasksMessage(tasksContainer.closest(".board-column"));
  }
}

function resetAddTaskForm() {
  document.getElementById("addTaskForm").reset();
  selectedMembers = [];
  updateSelectedMembers();
}

function fetchContacts(callback) {
  firebase
    .database()
    .ref("/contacts/")
    .once("value")
    .then((snapshot) => {
      const contacts = snapshot.val();
      callback(contacts);
    })
    .catch(() => {});
}

function setupDropdownSearchInline() {
  const dropdown = document.getElementById("taskAssignedDropdown");
  const optionsContainer = document.getElementById("taskAssignedOptions");
  const dropdownTrigger = dropdown.querySelector(".dropdown-placeholder");
  if (!dropdown || !optionsContainer || !searchInput) {
    return;
  }
  dropdownTrigger.addEventListener("click", (event) => {
    event.stopPropagation();
    const isOpen = dropdown.classList.toggle("open");
    optionsContainer.classList.toggle("hidden", !isOpen);
  });
  document.addEventListener("click", () => {
    optionsContainer.classList.add("hidden");
    dropdown.classList.remove("open");
  });
  fetchContacts((contacts) => {
    populateContactsDropdown(contacts);
  });
  searchInput();
}

function searchInput() {
  const searchInput = document.getElementById("taskSearchInput");
  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    const options = optionsContainer.querySelectorAll(".dropdown-option");
    options.forEach((option) => {
      const contactName = option.dataset.value.toLowerCase();
      option.style.display = contactName.includes(searchTerm)
        ? "block"
        : "none";
    });
  });
}

function toggleContactSelection(option, initials, color, selectedContainer) {
  const contactName = option.dataset.value;
  const selectIcon = option.querySelector(".select-icon");
  const selectedIcon = option.querySelector(".selected-icon");

  if (!selectIcon || !selectedIcon) {
    console.error("Icons für Auswahl nicht gefunden.");
    return;
  }

  const isSelected = option.classList.contains("selected");
  if (isSelected) {
    deselectContact(option, initials, selectedContainer, contactName, selectIcon, selectedIcon);
  } else {
    selectContact(option, initials, color, selectedContainer, contactName, selectIcon, selectedIcon);
  }
}

function deselectContact(option, initials, selectedContainer, contactName, selectIcon, selectedIcon) {
  option.classList.remove("selected");
  option.style.backgroundColor = "";
  option.style.color = "";
  removeInitialFromSelected(initials, selectedContainer);
  selectedMembers = selectedMembers.filter((member) => member !== contactName);

  toggleIcons(selectIcon, selectedIcon, false);
}

function toggleIcons(selectIcon, selectedIcon, isSelected) {
  if (isSelected) {
    selectIcon.classList.remove("icon-visible");
    selectIcon.classList.add("icon-hidden");
    selectedIcon.classList.remove("icon-hidden");
    selectedIcon.classList.add("icon-visible");
  } else {
    selectIcon.classList.remove("icon-hidden");
    selectIcon.classList.add("icon-visible");
    selectedIcon.classList.remove("icon-visible");
    selectedIcon.classList.add("icon-hidden");
  }
}

function addInitialToSelected(initials, color, selectedContainer) {
  const span = document.createElement("span");
  span.className = "selected-contact-initials";
  span.textContent = initials;
  span.style.backgroundColor = color;
  selectedContainer.appendChild(span);
}

function removeInitialFromSelected(initials, selectedContainer) {
  const spans = selectedContainer.querySelectorAll(
    ".selected-contact-initials"
  );
  spans.forEach((span) => {
    if (span.textContent === initials) {
      span.remove();
    }
  });
}

function filterTasks() {
  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    document.querySelectorAll(".task-card").forEach((task) => {
      const title = task.querySelector("h3").textContent.toLowerCase();
      task.style.display = title.includes(searchTerm) ? "block" : "none";
    });
    document.querySelectorAll(".board-column").forEach((column) => {
      const tasksContainer = column.querySelector(".tasks-container");
      const noTasksMessage = column.querySelector(".no-tasks");
      const visibleTasks = tasksContainer.querySelectorAll(
        ".task-card:not([style*='display: none'])"
      );
      noTasksMessage.style.display = visibleTasks.length ? "none" : "block";
    });
  });
}
filterTasks();

function saveTaskToFirebase(task) {
  const newTaskRef = firebase.database().ref("/tasks/").push();
  task.id = newTaskRef.key;

  if (!task.category || task.category.trim() === "") {
    return;
  }
  newTaskRef.set(task).then(() => {
    addTaskToBoard(task);
    enableDragAndDrop();
  });
}

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

function setupContactsSelection() {
  document
    .querySelectorAll("#taskAssignedOptions .dropdown-option")
    .forEach((option) => {
      option.addEventListener("click", () => {
        selectedMembers.push(option.dataset.value);
        updateSelectedMembers();
      });
    });
}

function selectContact(option, initials, color, selectedContainer, contactName, selectIcon, selectedIcon) {
  option.classList.add("selected");
  option.style.backgroundColor = "#091931";
  option.style.color = "white";
  addInitialToSelected(initials, color, selectedContainer);

  if (!selectedMembers.includes(contactName)) {
    selectedMembers.push(contactName);
  }

  toggleIcons(selectIcon, selectedIcon, true);
}

function updateSelectedMembers() {
  const selectedContainer = document.getElementById(
    "selectedContactsContainer"
  );
  selectedContainer.innerHTML = "";
  selectedMembers.forEach((member) => {
    const initials = getInitials(member);
    const color = getColorForContact(member);
    const span = document.createElement("span");
    span.className = "selected-contact-initials";
    span.textContent = initials;
    span.style.backgroundColor = color;
    selectedContainer.appendChild(span);
  });
}
fetchContacts((contacts) => {
  populateContactsDropdown(Object.values(contacts));
});
