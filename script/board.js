const logedUser = sessionStorage.getItem("User");

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
          tasks[key].members = []; // Sicherstellen, dass `members` ein Array ist
        }
      }
      callback(tasks);
    });
}

let selectedPriority = "Medium"; // Default priority
let selectedMembers = []; // Globales Array für ausgewählte Kontakte
let subtasksArray = []; // Filled when adding subtasks
let currentTaskId = null;
let selectedCategory = ""; // Standardkategorie
let isEditMode = false;
let currentDraggedTask = null;
let draggedTask = null;
let selectedType = "todo"; // Standardwert

function renderTasks(tasks) {
  for (let taskId in tasks) {
    let task = tasks[taskId];
    addTaskToBoard(task);
  }
}

function renderTasksOnBoard() {
  fetchTasks((tasks) => {
    document.querySelectorAll(".board-column").forEach((column) => {
      const category = column.getAttribute("data-status");
      const tasksContainer = column.querySelector(".tasks-container");
      tasksContainer.innerHTML = ""; // Vorherige Tasks entfernen

      tasks
        .filter((task) => task.category === category)
        .forEach((task) => {
          addTaskToBoard(task); // Tasks hinzufügen
        });
    });

    setupDropZones(); // Spalten nach dem Rendern vorbereiten
  });
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

function updateNoTasksMessage(column) {
  const tasksContainer = column.querySelector(".tasks-container");
  const noTasksMessage = column.querySelector(".no-tasks");
  if (tasksContainer && noTasksMessage) {
    noTasksMessage.style.display = tasksContainer.children.length
      ? "none"
      : "block";
  }
}

function updateTaskDetailsModal(task) {
  document.getElementById("taskType").innerText = task.type || "Task";
  document.getElementById("taskDetailTitle").innerText = task.title;
  document.getElementById("taskDetailDescription").innerText =
    task.description || "No description provided";
  document.getElementById("taskDetailDueDate").innerText =
    task.dueDate || "No due date";
  document.getElementById("taskDetailPriority").innerText =
    task.priority || "None";
  updatePriorityIcon(task.priority);
  document.getElementById("taskAssignedTo").innerHTML =
    createAssignedToList(task);
  document.getElementById("taskSubtasks").innerHTML = createSubtasksList(task);
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
  const selectedContainer = document.getElementById(
    "selectedContactsContainer"
  );
  optionsContainer.innerHTML = ""; // Bestehende Optionen leeren

  if (!contacts) {
    optionsContainer.innerHTML =
      '<div class="no-contacts">No contacts available</div>';
    return;
  }

  Object.keys(contacts).forEach((contactId) => {
    const contact = contacts[contactId];
    const initials = getInitials(contact.name); // Initialen berechnen
    const color = getColorForContact(contact.name); // Hintergrundfarbe berechnen

    const option = document.createElement("div");
    option.className = "dropdown-option";
    option.dataset.value = contact.name;

    // Initialen und Name hinzufügen
    option.innerHTML = `
        <span class="contact-initials" style="background-color: ${color}">
          ${initials}
        </span>
        <span>${contact.name}</span>
      `;

    // Klick-Event für Auswahl
    option.addEventListener("click", () => {
      toggleContactSelection(option, initials, color, selectedContainer);
    });

    optionsContainer.appendChild(option);
  });
}

// Funktion zur Auswahl eines Kontakts
function toggleContactSelection(option, initials, color, selectedContainer) {
  const isSelected = option.classList.contains("selected");

  if (isSelected) {
    // Kontakt abwählen
    option.classList.remove("selected");
    option.style.backgroundColor = ""; // Hintergrundfarbe zurücksetzen
    option.style.color = ""; // Textfarbe zurücksetzen
    removeInitialFromSelected(initials, selectedContainer);
    const contactName = option.dataset.value;
    selectedMembers = selectedMembers.filter(
      (member) => member !== contactName
    );
  } else {
    option.classList.add("selected");
    option.style.backgroundColor = "#091931"; // Hintergrundfarbe der ausgewählten Option
    option.style.color = "white"; // Textfarbe ändern
    addInitialToSelected(initials, color, selectedContainer);
    const contactName = option.dataset.value;
    if (!selectedMembers.includes(contactName)) {
      selectedMembers.push(contactName);
    }
  }
}

// Initialen zum ausgewählten Bereich hinzufügen
function addInitialToSelected(initials, color, selectedContainer) {
  const span = document.createElement("span");
  span.className = "selected-contact-initials";
  span.textContent = initials;
  span.style.backgroundColor = color; // Gleiche Farbe wie im Dropdown
  selectedContainer.appendChild(span);
}

// Initialen aus dem ausgewählten Bereich entfernen
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

// Aufrufen der Funktion
filterTasks();

function collectFormData() {
  return {
    title: document.getElementById("taskTitle").value,
    Description: document.getElementById("taskDescription").value,
    Date: document.getElementById("taskDueDate").value,
    Prio: selectedPriority,
    category: document.getElementById("taskTypeInput").value,
    members: selectedMembers, // Include selected contacts here
    subtasks: subtasksArray,
    type: document.getElementById("taskCategoryInput").value || "Task",
  };
}

function saveTaskToFirebase(task) {
  console.log("Ausgewählte Mitglieder:", selectedMembers);
  const newTaskRef = firebase.database().ref("/tasks/").push();
  task.id = newTaskRef.key; // Generiere eine eindeutige ID für die Task
  newTaskRef
    .set(task)
    .then(() => {
      addTaskToBoard(task); // Zeige die Task direkt auf dem Board
    })
    .catch((error) => {
      console.error("Fehler beim Speichern der Aufgabe in Firebase:", error);
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
  container.innerHTML = ""; // Vorherige Mitglieder entfernen

  selectedMembers.forEach((member) => {
    const span = document.createElement("span");
    span.className = "selected-contact-initials";
    span.textContent = getInitials(member); // Initialen anzeigen
    container.appendChild(span);
  });
}

fetchContacts((contacts) => {
  populateContactsDropdown(Object.values(contacts));
});
