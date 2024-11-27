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

// Funktion zur Berechnung der Initialen
function getInitials(name) {
  return name
    .split(" ") // Split into words
    .map((n) => n[0]) // Get first letter of each word
    .join("") // Join them together
    .toUpperCase(); // Convert to uppercase
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

// Funktion zur Auswahl eines Kontakts
function toggleContactSelection(option, initials, color, selectedContainer) {
  const isSelected = option.classList.contains("selected");

  if (isSelected) {
    // Kontakt abwählen
    option.classList.remove("selected");
    option.style.backgroundColor = ""; // Hintergrundfarbe zurücksetzen
    option.style.color = ""; // Textfarbe zurücksetzen
    removeInitialFromSelected(initials, selectedContainer);
  } else {
    // Kontakt auswählen
    option.classList.add("selected");
    option.style.backgroundColor = "#091931"; // Hintergrundfarbe der ausgewählten Option
    option.style.color = "white"; // Textfarbe ändern
    addInitialToSelected(initials, color, selectedContainer);
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
  let newTaskRef = firebase.database().ref("/tasks/").push();
  task.id = newTaskRef.key;
  newTaskRef.set(task).then(() => {
    addTaskToBoard(task);
    enableDragAndDrop(); // Aktiviert Drag-and-Drop für die neue Task
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
