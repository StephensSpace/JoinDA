// Funktion, um Daten aus Firebase zu laden
async function getFirebaseData(path = "/") {
  const SNAPSHOT = await firebase.database().ref(path).once("value");
  const RESULT = SNAPSHOT.val(); // Ergebnis als Object
  return RESULT;
}

document.addEventListener("DOMContentLoaded", async () => {
  const taskCards = document.querySelectorAll(".task-card");
  const columns = document.querySelectorAll(".board-column");
  const taskDetailsModal = document.getElementById("taskDetailsModal");
  const addTaskModal = document.getElementById("addTaskModal");
  const addTaskButton = document.getElementById("addTaskButton");
  const addTaskForm = document.getElementById("addTaskForm");
  const closeButton = document.querySelectorAll(".close-button");
  const cancelButton = document.getElementById("cancelButton");
  const categoryField = document.getElementById("taskCategory");
  const addTaskButtonsByCategory = document.querySelectorAll(
    ".add-task-btn-category"
  );
  const taskDetailTitle = document.getElementById("taskDetailTitle");
  const taskDetailDescription = document.getElementById(
    "taskDetailDescription"
  );
  const taskDetailDueDate = document.getElementById("taskDetailDueDate");
  const taskDetailPriority = document.getElementById("taskDetailPriority");
  const taskAssignedTo = document.getElementById("taskAssignedTo");
  const taskSubtasks = document.getElementById("taskSubtasks");
  const deleteTaskButton = document.querySelector(".delete-btn");
  const editTaskButton = document.querySelector(".edit-btn");
  const dropdown = document.getElementById("taskAssignedDropdown");
  const options = document.getElementById("taskAssignedOptions");
  const arrow = document.getElementById("dropdownArrow");
  await loadAssignedToOptions();
  await loadTasksFromFirebase();
  updateNoTasksMessages();

  let draggedTask = null;
  let selectedPriority = null; // Variable zum Speichern der ausgewählten Priorität
  let currentTaskId = null; // Speichert die ID der aktuellen Aufgabe für Bearbeitung/Löschung

  // Toggle Dropdown Visibility
  dropdown.addEventListener("click", () => {
    options.classList.toggle("hidden");
    arrow.classList.toggle("up");
  });

  async function loadAssignedToOptions() {
    try {
      // Kontakte aus Firebase laden
      const snapshot = await firebase.database().ref("contacts").once("value");
      const users = snapshot.val();

      if (!users) {
        console.warn("Keine Benutzer in Firebase gefunden.");
        return;
      }

      const dropdown = document.getElementById("taskAssignedDropdown");
      const optionsContainer = document.getElementById("taskAssignedOptions");

      // Kontakte dynamisch hinzufügen
      Object.values(users).forEach((user) => {
        const item = document.createElement("div");
        item.classList.add("dropdown-item");

        // Avatar erstellen (Initialen)
        const avatar = document.createElement("div");
        avatar.classList.add("avatar");
        avatar.textContent = user.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase();

        avatar.style.backgroundColor = user.color || getRandomColor();

        // Name hinzufügen
        const name = document.createElement("div");
        name.classList.add("name");
        name.textContent = user.name;

        // Checkbox erstellen
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = user.name;

        // Element zusammenfügen
        item.appendChild(avatar);
        item.appendChild(name);
        item.appendChild(checkbox);
        optionsContainer.appendChild(item);
      });

      // Dropdown öffnen und schließen
      dropdown.addEventListener("click", () => {
        optionsContainer.classList.toggle("hidden");
      });

      // Auswahl anzeigen
      optionsContainer.addEventListener("click", (event) => {
        const checkbox = event.target.closest("input[type='checkbox']");
        if (checkbox) {
          const selectedContacts = Array.from(
            optionsContainer.querySelectorAll("input[type='checkbox']:checked")
          )
            .map((input) => input.value)
            .join(", ");

          document.querySelector(".dropdown-placeholder").textContent =
            selectedContacts || "Select contacts to assign";
        }
      });
    } catch (error) {
      console.error("Fehler beim Laden der Kontakte aus Firebase:", error);
    }
  }

  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  // Funktion: Dropdown für "Assigned to" öffnen/schließen
  function toggleAssignedToDropdown() {
    const dropdown = document.getElementById("taskAssignedOptions");
    const placeholder = document.querySelector(".dropdown-placeholder");

    // Toggle "hidden" Klasse, um Dropdown zu zeigen oder zu verstecken
    dropdown.classList.toggle("hidden");

    // Pfeil-Icon in der Placeholder umdrehen
    placeholder.classList.toggle("open");
  }

  // Funktion: Schließen des Dropdowns, wenn außerhalb geklickt wird
  function closeAssignedToDropdown(event) {
    const dropdown = document.getElementById("taskAssignedOptions");
    const dropdownContainer = document.getElementById("taskAssignedContainer");

    // Prüfen, ob der Klick außerhalb des Dropdowns war
    if (!dropdownContainer.contains(event.target)) {
      dropdown.classList.add("hidden");

      // Stelle sicher, dass das Pfeil-Icon zurückgesetzt wird
      document.querySelector(".dropdown-placeholder").classList.remove("open");
    }
  }

  // Event Listener: Dropdown öffnen/schließen
  document
    .querySelector(".dropdown-placeholder")
    .addEventListener("click", toggleAssignedToDropdown);

  // Event Listener: Klick außerhalb des Dropdowns
  document.addEventListener("click", closeAssignedToDropdown);

  // Funktion zum Hinzufügen der Drag & Drop Listener zu einer Aufgabe
  function addDragAndDropListeners(task) {
    task.setAttribute("draggable", "true");

    task.addEventListener("dragstart", (e) => {
      console.log("Drag gestartet:", task);
      draggedTask = task;
      e.dataTransfer.setData("text/plain", task.dataset.task);
      task.classList.add("dragging");
    });

    task.addEventListener("dragend", () => {
      draggedTask = null;
      task.classList.remove("dragging");
    });

    // Klick auf Task öffnet das Details-Modal
    task.addEventListener("click", () => {
      if (draggedTask) return;

      currentTaskId = task.dataset.id; // Speichere die ID der aktuellen Aufgabe

      taskDetailTitle.textContent = task.dataset.title || "No title";
      taskDetailDescription.textContent =
        task.dataset.description || "No description available.";
      taskDetailDueDate.textContent = task.dataset.dueDate || "No due date";
      taskDetailPriority.textContent = task.dataset.priority || "No priority";

      taskAssignedTo.innerHTML = "";
      if (task.dataset.assignedTo) {
        task.dataset.assignedTo.split(",").forEach((person) => {
          const listItem = document.createElement("li");
          listItem.textContent = person.trim();
          taskAssignedTo.appendChild(listItem);
        });
      } else {
        taskAssignedTo.innerHTML = "<li>No one assigned</li>";
      }

      taskSubtasks.innerHTML = "";
      if (task.dataset.subtasks) {
        task.dataset.subtasks.split(",").forEach((subtask) => {
          const listItem = document.createElement("li");
          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.checked = subtask.includes("✔");
          listItem.appendChild(checkbox);
          listItem.appendChild(
            document.createTextNode(subtask.replace("✔", "").trim())
          );
          taskSubtasks.appendChild(listItem);
        });
      } else {
        taskSubtasks.innerHTML = "<li>No subtasks</li>";
      }

      taskDetailsModal.style.display = "block";
    });
  }

  // Funktion zum Hinzufügen der Drag & Drop Listener zu den Spalten
  function addColumnDragAndDropListeners(column) {
    const tasksContainer = column.querySelector(".tasks-container");

    // Dragover erlaubt das Ablegen innerhalb der Spalte
    tasksContainer.addEventListener("dragover", (e) => {
      e.preventDefault(); // Verhindert Standardaktionen (z. B. Textauswahl)
      column.classList.add("drag-over"); // Optional: Visuelles Feedback
    });

    // Entferne visuelles Feedback, wenn Drag endet
    tasksContainer.addEventListener("dragleave", () => {
      column.classList.remove("drag-over");
    });

    // Drop-Event
    tasksContainer.addEventListener("drop", async (e) => {
      e.preventDefault();

      if (draggedTask) {
        console.log("Task wird verschoben:", draggedTask);

        // Füge den Task in die neue Spalte ein
        tasksContainer.appendChild(draggedTask);

        // Aktualisiere die Kategorie des Tasks
        const newCategory = column.dataset.status;
        draggedTask.dataset.category = newCategory;

        // Speichere die Änderungen in Firebase
        try {
          const taskId = draggedTask.dataset.id;
          const updates = { category: newCategory };
          await firebase.database().ref(`tasks/${taskId}`).update(updates);
          console.log("Task erfolgreich aktualisiert:", taskId, updates);
        } catch (error) {
          console.error("Fehler beim Aktualisieren in Firebase:", error);
        }

        column.classList.remove("drag-over"); // Entferne visuelles Feedback
      }
      updateNoTasksMessages();
    });
  }

  // Tasks aus Firebase laden
  async function loadTasksFromFirebase() {
    try {
      const tasksSnapshot = await firebase
        .database()
        .ref("tasks")
        .once("value");
      const tasks = tasksSnapshot.val();

      if (tasks) {
        Object.keys(tasks).forEach((taskId) => {
          const task = tasks[taskId];
          task.id = taskId; // Speichere die ID für spätere Updates
          displayTask(task, task.category);
        });
      } else {
        console.log("Keine Tasks in der Datenbank gefunden.");
      }
    } catch (error) {
      console.error("Fehler beim Laden der Tasks aus Firebase:", error);
    }
  }

  // Aufgabe auf dem Kanban-Board anzeigen
  function displayTask(task, category) {
    const targetColumn = document.querySelector(
      `.board-column[data-status="${category}"] .tasks-container`
    );

    if (!targetColumn) {
      return;
    }

    const taskElement = document.createElement("div");
    taskElement.classList.add("task-card");

    // Füge zusätzliche Klassen hinzu, z.B. 'user-story' oder 'technical-task'
    if (task.type === "User Story") {
      taskElement.classList.add("user-story");
    } else if (task.type === "Technical Task") {
      taskElement.classList.add("technical-task");
    }

    taskElement.setAttribute("draggable", "true");

    // Datenattribute setzen
    taskElement.dataset.id = task.id; // Speichere die ID für spätere Updates
    taskElement.dataset.title = task.title;
    taskElement.dataset.description = task.description;
    taskElement.dataset.dueDate = task.dueDate;
    taskElement.dataset.priority = task.priority;
    taskElement.dataset.assignedTo = task.assignedTo;
    taskElement.dataset.subtasks = task.subtasks ? task.subtasks.join(",") : "";
    taskElement.dataset.category = task.category;
    taskElement.dataset.type = task.type;
    taskElement.dataset.completedSubtasks = task.completedSubtasks || "0";

    document
      .getElementById("addSubtaskButton")
      .addEventListener("click", function () {
        document.getElementById("subtaskOptions").style.display = "block";
      });

    document
      .getElementById("cancelSubtask")
      .addEventListener("click", function () {
        document.getElementById("subtaskOptions").style.display = "none";
      });

    document
      .getElementById("confirmSubtask")
      .addEventListener("click", function () {
        var subtaskSelect = document.getElementById("subtaskSelect");
        var subtaskName = subtaskSelect.value;
        var confirmedSubtasksDiv = document.getElementById("confirmedSubtasks");

        // Überprüfen, ob der Subtask bereits hinzugefügt wurde
        var existingSubtasks =
          confirmedSubtasksDiv.getElementsByClassName("subtask-text");
        for (var i = 0; i < existingSubtasks.length; i++) {
          if (existingSubtasks[i].textContent === subtaskName) {
            document.getElementById("subtaskOptions").style.display = "none";
            return;
          }
        }

        // Erstelle ein neues Subtask-Element
        var subtaskItem = document.createElement("div");
        subtaskItem.classList.add("subtask-item");

        // Subtask-Text
        var subtaskText = document.createElement("span");
        subtaskText.textContent = subtaskName;
        subtaskText.classList.add("subtask-text");

        // Editier-Button
        var editButton = document.createElement("button");
        editButton.innerHTML = "✏️";
        editButton.classList.add("edit-subtask-button");

        // Lösch-Button
        var deleteButton = document.createElement("button");
        deleteButton.innerHTML = "❌";
        deleteButton.classList.add("delete-subtask-button");

        // Zusammenfügen der Elemente
        subtaskItem.appendChild(subtaskText);
        subtaskItem.appendChild(editButton);
        subtaskItem.appendChild(deleteButton);

        confirmedSubtasksDiv.appendChild(subtaskItem);
        document.getElementById("subtaskOptions").style.display = "none";

        // Funktion zum Editieren
        function handleEdit() {
          var inputField = document.createElement("input");
          inputField.type = "text";
          inputField.value = subtaskText.textContent;
          subtaskItem.replaceChild(inputField, subtaskText);
          editButton.innerHTML = "💾";

          // Speichern des neuen Textes
          editButton.onclick = function () {
            subtaskText.textContent = inputField.value;
            subtaskItem.replaceChild(subtaskText, inputField);
            editButton.innerHTML = "✏️";
            editButton.onclick = handleEdit;
          };
        }

        editButton.onclick = handleEdit;

        // Funktion zum Löschen
        deleteButton.addEventListener("click", function () {
          confirmedSubtasksDiv.removeChild(subtaskItem);
        });
      });

    let avatarsHtml = "";
    if (task.assignedTo) {
      avatarsHtml = `
      <div class="avatars">
        ${task.assignedTo
          .split(",")
          .map(
            (person) => `<div class="avatar">${person.trim().charAt(0)}</div>`
          )
          .join("")}
      </div>
    `;
    }

    taskElement.innerHTML = `
    <div class="tag">${task.type || "Task"}</div>
    <h3>${task.title}</h3>
    <p>${task.description}</p>
    ${subtasksHtml}
    ${avatarsHtml}
    <div class="icon menu-icon">&#9776;</div>
  `;

    // Drag & Drop Listener hinzufügen
    addDragAndDropListeners(taskElement);

    // Task zur Kategorie hinzufügen
    targetColumn.appendChild(taskElement);

    updateNoTasksMessages();
  }

  // "+" Buttons neben den Überschriften
  addTaskButtonsByCategory.forEach((btn) => {
    btn.addEventListener("click", () => {
      const category = btn.dataset.category; // Kategorie aus dem Button-Attribut
      categoryField.value = category; // Kategorie im Modal setzen
      addTaskModal.style.display = "block";
      setTimeout(() => {
        addTaskModal.style.right = "0";
      }, 10);
    });
  });

  // Close Modals
  closeButton.forEach((btn) => {
    btn.addEventListener("click", () => {
      taskDetailsModal.style.display = "none";
      addTaskModal.style.display = "none";
    });
  });

  cancelButton.addEventListener("click", () => {
    addTaskModal.style.right = "-100%";
    setTimeout(() => {
      addTaskModal.style.display = "none";
    }, 500);
  });

  // Add Task Modal
  addTaskButton.addEventListener("click", () => {
    addTaskModal.style.display = "block";
    setTimeout(() => {
      addTaskModal.style.right = "0";
    }, 10);
  });

  // Priority Buttons
  const urgentBtn = document.getElementById("urgentBtn");
  const mediumBtn = document.getElementById("mediumBtn");
  const lowBtn = document.getElementById("lowBtn");

  const handleButtonClick = (btn, icon) => {
    document
      .querySelectorAll(".priority-btn")
      .forEach((button) => button.classList.remove("clicked"));
    document
      .querySelectorAll(".priority-icon")
      .forEach((iconElem) => (iconElem.style.filter = "none"));

    btn.classList.add("clicked");
    icon.style.filter = "brightness(0) invert(1)";

    selectedPriority = btn.dataset.priority;
  };

  urgentBtn.addEventListener("click", () =>
    handleButtonClick(urgentBtn, document.getElementById("urgentIcon"))
  );
  mediumBtn.addEventListener("click", () =>
    handleButtonClick(mediumBtn, document.getElementById("mediumIcon"))
  );
  lowBtn.addEventListener("click", () =>
    handleButtonClick(lowBtn, document.getElementById("lowIcon"))
  );

  // Submit Add Task Form
  addTaskForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("taskTitle").value;
    const description = document.getElementById("taskDescription").value;
    const dueDate = document.getElementById("taskDueDate").value;
    const priority = selectedPriority || "Low";
    const assignedTo = document.getElementById("taskAssigned").value;
    const subtasksInput = document.getElementById("taskSubtasks").value;
    const subtasks = subtasksInput ? subtasksInput.split(",") : [];
    const category = document.getElementById("taskCategory").value;

    const newTask = {
      title,
      description,
      dueDate,
      priority,
      category,
      assignedTo,
      subtasks,
    };

    try {
      // Task in Firebase speichern
      const taskRef = firebase.database().ref("tasks");
      const newTaskRef = taskRef.push();
      await newTaskRef.set(newTask);
      newTask.id = newTaskRef.key; // Speichere die ID

      // Aufgabe auf dem Board anzeigen
      displayTask(newTask, category);

      // Modal schließen und Formular zurücksetzen
      addTaskForm.reset();
      selectedPriority = null;
      document
        .querySelectorAll(".priority-btn")
        .forEach((button) => button.classList.remove("clicked"));
      document
        .querySelectorAll(".priority-icon")
        .forEach((iconElem) => (iconElem.style.filter = "none"));

      addTaskModal.style.right = "-100%";
      setTimeout(() => {
        addTaskModal.style.display = "none";
      }, 500);
    } catch (error) {
      console.error("Fehler beim Speichern der Aufgabe in Firebase:", error);
    }
  });

  // Funktion zum Aktualisieren der "No tasks"-Nachrichten
  function updateNoTasksMessages() {
    const columns = document.querySelectorAll(".board-column");

    columns.forEach((column) => {
      const tasksContainer = column.querySelector(".tasks-container");
      const noTasksMessage = column.querySelector(".no-tasks");

      if (tasksContainer && noTasksMessage) {
        const tasks = tasksContainer.querySelectorAll(".task-card");

        if (tasks.length === 0) {
          noTasksMessage.style.display = "block";
        } else {
          noTasksMessage.style.display = "none";
        }
      }
    });
  }

  // Event Listener zu bestehenden Tasks hinzufügen
  taskCards.forEach((task) => {
    addDragAndDropListeners(task);
  });

  // Event Listener zu den Spalten hinzufügen
  columns.forEach((column) => {
    addColumnDragAndDropListeners(column);
  });

  // Event Listener für das Löschen einer Aufgabe
  deleteTaskButton.addEventListener("click", async () => {
    if (currentTaskId) {
      try {
        await firebase.database().ref(`tasks/${currentTaskId}`).remove();
        // Entferne die Aufgabe vom Board
        const taskElement = document.querySelector(
          `.task-card[data-id="${currentTaskId}"]`
        );
        if (taskElement) {
          taskElement.remove();
        }
        taskDetailsModal.style.display = "none";
        updateNoTasksMessages();
      } catch (error) {
        console.error("Fehler beim Löschen der Aufgabe:", error);
      }
    }
  });

  // Event Listener für das Bearbeiten einer Aufgabe
  editTaskButton.addEventListener("click", async () => {
    if (currentTaskId) {
      // Fülle das Add Task Modal mit den aktuellen Task-Daten
      const taskRef = firebase.database().ref(`tasks/${currentTaskId}`);
      try {
        const snapshot = await taskRef.once("value");
        const taskData = snapshot.val();

        // Setze die Werte im Formular
        document.getElementById("taskTitle").value = taskData.title;
        document.getElementById("taskDescription").value = taskData.description;
        document.getElementById("taskDueDate").value = taskData.dueDate;
        document.getElementById("taskAssigned").value = taskData.assignedTo;
        document.getElementById("taskSubtasks").value = taskData.subtasks
          ? taskData.subtasks.join(",")
          : "";
        document.getElementById("taskCategory").value = taskData.category;

        // Priorität setzen
        selectedPriority = taskData.priority;
        document
          .querySelectorAll(".priority-btn")
          .forEach((button) => button.classList.remove("clicked"));
        document
          .querySelectorAll(".priority-icon")
          .forEach((iconElem) => (iconElem.style.filter = "none"));

        if (selectedPriority === "Urgent") {
          handleButtonClick(urgentBtn, document.getElementById("urgentIcon"));
        } else if (selectedPriority === "Medium") {
          handleButtonClick(mediumBtn, document.getElementById("mediumIcon"));
        } else {
          handleButtonClick(lowBtn, document.getElementById("lowIcon"));
        }

        // Öffne das Add Task Modal zum Bearbeiten
        addTaskModal.style.display = "block";
        setTimeout(() => {
          addTaskModal.style.right = "0";
        }, 10);

        // Ändere den Submit Handler temporär für das Update
        addTaskForm.removeEventListener("submit", addTaskFormSubmitHandler);
        addTaskForm.addEventListener("submit", updateTaskHandler);
      } catch (error) {
        console.error("Fehler beim Laden der Aufgabendaten:", error);
      }
    }
  });

  // Standard Submit Handler für das Hinzufügen einer neuen Aufgabe
  async function addTaskFormSubmitHandler(e) {
    e.preventDefault();

    // (Inhalt wie oben, daher nicht wiederholt)
  }

  // Submit Handler für das Aktualisieren einer bestehenden Aufgabe
  async function updateTaskHandler(e) {
    e.preventDefault();

    const title = document.getElementById("taskTitle").value;
    const description = document.getElementById("taskDescription").value;
    const dueDate = document.getElementById("taskDueDate").value;
    const priority = selectedPriority || "Low";
    const assignedTo = document.getElementById("taskAssigned").value;
    const subtasksInput = document.getElementById("taskSubtasks").value;
    const subtasks = subtasksInput ? subtasksInput.split(",") : [];
    const category = document.getElementById("taskCategory").value;

    const updatedTask = {
      title,
      description,
      dueDate,
      priority,
      category,
      assignedTo,
      subtasks,
    };

    try {
      // Aktualisiere die Aufgabe in Firebase
      await firebase
        .database()
        .ref(`tasks/${currentTaskId}`)
        .update(updatedTask);

      // Aktualisiere die Aufgabe auf dem Board
      const taskElement = document.querySelector(
        `.task-card[data-id="${currentTaskId}"]`
      );
      if (taskElement) {
        // Entferne die Aufgabe aus der alten Kategorie
        taskElement.remove();
        // Aktualisiere die Datenattribute
        taskElement.dataset.title = updatedTask.title;
        taskElement.dataset.description = updatedTask.description;
        taskElement.dataset.dueDate = updatedTask.dueDate;
        taskElement.dataset.priority = updatedTask.priority;
        taskElement.dataset.assignedTo = updatedTask.assignedTo;
        taskElement.dataset.subtasks = updatedTask.subtasks
          ? updatedTask.subtasks.join(",")
          : "";
        taskElement.dataset.category = updatedTask.category;

        // Aktualisiere den Textinhalt
        taskElement.textContent = updatedTask.title;

        // Füge die Aufgabe in der neuen Kategorie hinzu
        displayTask(updatedTask, updatedTask.category);
      }

      // Modal schließen und Formular zurücksetzen
      addTaskForm.reset();
      selectedPriority = null;
      document
        .querySelectorAll(".priority-btn")
        .forEach((button) => button.classList.remove("clicked"));
      document
        .querySelectorAll(".priority-icon")
        .forEach((iconElem) => (iconElem.style.filter = "none"));

      addTaskModal.style.right = "-100%";
      setTimeout(() => {
        addTaskModal.style.display = "none";
      }, 500);

      // Entferne den temporären Submit Handler und setze den Standard-Handler wieder ein
      addTaskForm.removeEventListener("submit", updateTaskHandler);
      addTaskForm.addEventListener("submit", addTaskFormSubmitHandler);
    } catch (error) {}
  }

  // Priority Buttons
  const priorityButtons = document.querySelectorAll(".priority-btn");
  priorityButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      priorityButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  // Due Date Validation
  const dueDateInput = document.getElementById("taskDueDate");
  const dueDateError = document.getElementById("dueDateError");
  dueDateInput.addEventListener("input", () => {
    if (!dueDateInput.value) {
      dueDateError.classList.remove("hidden");
    } else {
      dueDateError.classList.add("hidden");
    }
  });

  // Initialer Aufruf: Tasks aus Firebase laden
  await loadTasksFromFirebase();
  updateNoTasksMessages();
});
