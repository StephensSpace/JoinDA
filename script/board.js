// Fetch Users
function fetchUsers(callback) {
  firebase
    .database()
    .ref("/User/")
    .once("value")
    .then((snapshot) => {
      callback(snapshot.val());
    });
}

// Fetch Tasks
function fetchTasks(callback) {
  firebase
    .database()
    .ref("/tasks/")
    .once("value")
    .then((snapshot) => {
      let tasks = snapshot.val();
      for (let key in tasks) {
        if (!Array.isArray(tasks[key].members)) {
          tasks[key].members = [];
        }
      }
      callback(tasks);
    });
}

let selectedPriority = "Medium"; // Default priority
let selectedMembers = []; // Globales Array für ausgewählte Kontakte
let subtasksArray = []; // Filled when adding subtasks
let currentTaskId = null;
let selectedCategory = "todo"; // Standardkategorie
let isEditMode = false;

function renderTasks(tasks) {
  for (let taskId in tasks) {
    let task = tasks[taskId];
    addTaskToBoard(task);
  }
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

function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function getColorForMember(name) {
  let colors = ["#ff8a65", "#4db6ac", "#9575cd", "#f06292"];
  let index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

function updateNoTasksMessage(column) {
  let tasksContainer = column.querySelector(".tasks-container");
  let noTasksMessage = column.querySelector(".no-tasks");
  if (tasksContainer && noTasksMessage) {
    noTasksMessage.style.display = tasksContainer.children.length
      ? "none"
      : "block";
  }
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

function showTaskDetails(task) {
  currentTask = task; // Speichere die aktuelle Aufgabe
  currentTaskId = task.id; // Speichere die Task-ID
  document.getElementById("taskType").innerText = task.type || "Task";
  document.getElementById("taskDetailTitle").innerText = task.title;
  document.getElementById("taskDetailDescription").innerText = task.Description;
  document.getElementById("taskDetailDueDate").innerText = task.Date;
  document.getElementById("taskDetailPriority").innerText = task.Prio;
  document.getElementById("taskAssignedTo").innerHTML =
    createAssignedToList(task);
  document.getElementById("taskSubtasks").innerHTML = createSubtasksList(task);
  document.getElementById("taskDetailsModal").style.display = "block";
  updatePriorityIcon(task.Prio);
}

function updateTaskDetailsModal(task) {
  document.getElementById("taskType").innerText = task.type || "Task";
  document.getElementById("taskDetailTitle").innerText = task.title;
  document.getElementById("taskDetailDescription").innerText = task.Description;
  document.getElementById("taskDetailDueDate").innerText = task.Date;
  document.getElementById("taskDetailPriority").innerText = task.Prio;
  updatePriorityIcon(task.Prio);
  document.getElementById("taskAssignedTo").innerHTML =
    createAssignedToList(task);
  document.getElementById("taskSubtasks").innerHTML = createSubtasksList(task);
}

function createAssignedToList(task) {
  const members = task.members || [];
  if (members.length > 0) {
    return members.map((member) => `<li>${member}</li>`).join("");
  } else {
    return "<li>No assigned members</li>";
  }
}

function createSubtasksList(task) {
  if (task.subtasks && task.subtasks.length > 0) {
    return task.subtasks.map((st) => `<li>${st.title}</li>`).join("");
  }
  return "<li>No subtasks</li>";
}

document.addEventListener("DOMContentLoaded", () => {
  // Initialize the Board
  fetchTasks((tasks) => {
    renderTasks(tasks);
  });
  fetchContacts((contacts) => {
    populateContactsDropdown(contacts);
  });

  // Event Listener für den "Edit"-Button im Task-Detail-Modal
  const editButton = document.querySelector(".edit-btn");
  if (editButton) {
    editButton.addEventListener("click", () => {
      openEditTaskModal();
    });
  }

  // Schließen des Task-Detail-Modals
  const taskDetailsCloseBtn = document.querySelector(
    "#taskDetailsModal .close-button"
  );
  if (taskDetailsCloseBtn) {
    taskDetailsCloseBtn.addEventListener("click", () => {
      document.getElementById("taskDetailsModal").style.display = "none";
    });
  }

  // "Add Task"-Button
  const addTaskButton = document.getElementById("addTaskButton");
  if (addTaskButton) {
    addTaskButton.addEventListener("click", () => {
      document.getElementById("addTaskModal").style.display = "block";
      resetAddTaskForm();
      // Fetch contacts and populate dropdown
      fetchContacts((contacts) => {
        populateContactsDropdown(contacts);
      });
    });
  }

  // Schließen des "Add Task"-Modals
  const addTaskCloseBtn = document.querySelector("#addTaskModal .close-button");
  if (addTaskCloseBtn) {
    addTaskCloseBtn.addEventListener("click", () => {
      document.getElementById("addTaskModal").style.display = "none";
    });
  }

  // Event Listener for Dropdown Toggle
  const taskAssignedDropdown = document.getElementById("taskAssignedDropdown");
  if (taskAssignedDropdown) {
    taskAssignedDropdown.addEventListener("click", (event) => {
      event.stopPropagation();
      const optionsContainer = document.getElementById("taskAssignedOptions");
      optionsContainer.classList.toggle("hidden");
    });
  }

  // Close Dropdown When Clicking Outside
  document.addEventListener("click", () => {
    const optionsContainer = document.getElementById("taskAssignedOptions");
    optionsContainer.classList.add("hidden");
  });

  // "Add Task"-Formularübermittlung
  const addTaskForm = document.getElementById("addTaskForm");
  if (addTaskForm) {
    addTaskForm.addEventListener("submit", function (event) {
      event.preventDefault();
      let taskData = collectFormData();
      if (isEditMode) {
        updateTaskInFirebase(currentTask.id, taskData);
      } else {
        saveTaskToFirebase(taskData);
      }
      document.getElementById("addTaskModal").style.display = "none";
      resetAddTaskForm();
    });
  }

  // Event Listener für den "Cancel"-Button im "Add Task"-Modal
  const cancelButton = document.getElementById("cancelButton");
  if (cancelButton) {
    cancelButton.addEventListener("click", () => {
      document.getElementById("addTaskModal").style.display = "none";
    });
  }

  // Event Listener für die Prioritätsbuttons
  const priorityButtons = document.querySelectorAll(".priority-btn");
  if (priorityButtons.length > 0) {
    priorityButtons.forEach((button) => {
      button.addEventListener("click", () => {
        selectedPriority = button.dataset.priority;
        updatePriorityButtons();
      });
    });
  }

  // Event Listener für den "Delete"-Button
  const deleteButton = document.querySelector(".delete-btn");
  if (deleteButton) {
    deleteButton.addEventListener("click", () => {
      deleteCurrentTask();
    });
  }

  // Event Listener für die "+"-Buttons in den Spalten
  const addTaskCategoryButtons = document.querySelectorAll(
    ".add-task-btn-category"
  );
  addTaskCategoryButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const category = button.getAttribute("data-category");
      openAddTaskModal(category);
    });
  });

  // Event Listener für den "Subtask hinzufügen"-Button
  const subtaskAddButton = document.querySelector(".subtask-add-button");
  if (subtaskAddButton) {
    subtaskAddButton.addEventListener("click", () => {
      let input = document.getElementById("subtaskInput");
      if (input.value.trim()) {
        subtasksArray.push({ title: input.value.trim(), completed: false });
        updateSubtasksList();
        input.value = "";
      }
    });
  }

  // Weitere Event Listener und Initialisierungscode hier...
});

function openEditTaskModal() {
  if (currentTask) {
    isEditMode = true; // Bearbeitungsmodus aktivieren
    document.getElementById("addTaskModalTitle").textContent = "Edit Task";
    document.getElementById("addTaskModal").style.display = "block";
    populateEditTaskForm(currentTask);
  }
}

function updateTaskInFirebase(taskId, taskData) {
  firebase
    .database()
    .ref("/tasks/" + taskId)
    .update(taskData)
    .then(() => {
      updateTaskOnBoard(taskId, taskData);

      // Update the currentTask variable
      if (currentTask && currentTask.id === taskId) {
        // Merge the updated data into currentTask
        currentTask = { ...currentTask, ...taskData };
        updateTaskDetailsModal(currentTask);
      }
    })
    .catch((error) => {
      console.error("Error updating task:", error);
    });
}

function updateTaskOnBoard(taskId, taskData) {
  // Entferne die alte Task-Karte vom Board
  removeTaskFromBoard(taskId);
  // Füge die aktualisierte Aufgabe dem Board hinzu
  taskData.id = taskId; // Stelle sicher, dass die ID gesetzt ist
  addTaskToBoard(taskData);
}

function populateEditTaskForm(task) {
  document.getElementById("taskTitle").value = task.title;
  document.getElementById("taskDescription").value = task.Description;
  document.getElementById("taskDueDate").value = task.Date;

  selectedPriority = task.Prio;
  updatePriorityButtons();

  selectedCategory = task.category;
  document.getElementById("taskTypeInput").value = task.category;

  selectedMembers = task.members || [];
  updateSelectedMembers();

  subtasksArray = task.subtasks || [];
  updateSubtasksList();
}

function openAddTaskModal(category) {
  selectedCategory = category || "todo"; // Ausgewählte Kategorie setzen
  document.getElementById("addTaskModal").style.display = "block";
  resetAddTaskForm();
  // Kontakte abrufen und Dropdown füllen
  fetchContacts((contacts) => {
    populateContactsDropdown(contacts);
  });
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
      .catch((error) => {
        console.error("Fehler beim Löschen der Aufgabe:", error);
      });
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

// Reset Add Task Form
function resetAddTaskForm() {
  document.getElementById("addTaskForm").reset();
  selectedMembers = [];
  updateSelectedMembers();
  // Reset other form elements if necessary
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
    .catch((error) => {
      console.error("Error fetching contacts:", error);
    });
}

function populateContactsDropdown(contacts) {
  const optionsContainer = document.getElementById("taskAssignedOptions");
  optionsContainer.innerHTML = ""; // Clear existing options

  if (!contacts) {
    optionsContainer.innerHTML =
      '<div class="no-contacts">No contacts available</div>';
    return;
  }

  Object.keys(contacts).forEach((contactId) => {
    const contact = contacts[contactId];
    const option = document.createElement("div");
    option.className = "dropdown-option";
    option.dataset.value = contact.name;
    option.textContent = contact.name;
    option.addEventListener("click", () => {
      selectContact(contact.name);
      optionsContainer.classList.add("hidden"); // Close dropdown after selection
    });
    optionsContainer.appendChild(option);
  });
}

function collectFormData() {
  return {
    title: document.getElementById("taskTitle").value,
    Description: document.getElementById("taskDescription").value,
    Date: document.getElementById("taskDueDate").value,
    Prio: selectedPriority,
    category: selectedCategory,
    members: selectedMembers, // Include selected contacts here
    subtasks: subtasksArray,
    type: document.getElementById("taskCategoryInput").value || "Task",
  };
}

function saveTaskToFirebase(task) {
  let newTaskRef = firebase.database().ref("/tasks/").push();
  task.id = newTaskRef.key;
  newTaskRef.set(task).then(() => {
    addTaskToBoard(task);
  });
}

function updatePriorityButtons() {
  document.querySelectorAll(".priority-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.priority === selectedPriority);
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

function selectContact(contactName) {
  if (!selectedMembers.includes(contactName)) {
    selectedMembers.push(contactName);
    updateSelectedMembers();
  }
}

function updateSelectedMembers() {
  const container = document.getElementById("selectedContactsContainer");
  container.innerHTML = ""; // Clear existing selections

  selectedMembers.forEach((member) => {
    const memberSpan = document.createElement("span");
    memberSpan.textContent = member;
    container.appendChild(memberSpan);
  });
}

fetchContacts((contacts) => {
  populateContactsDropdown(Object.values(contacts));
});

function updateSubtasksList() {
  let list = document.getElementById("subtaskList");
  list.innerHTML = subtasksArray.map((st) => `<li>${st.title}</li>`).join("");
}
