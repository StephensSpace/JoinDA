// Funktion, um Daten aus Firebase zu laden
async function getFirebaseData(path = "/") {
  const SNAPSHOT = await firebase.database().ref(path).once("value");
  const RESULT = SNAPSHOT.val(); // Ergebnis als Object
  return RESULT;
}

document.addEventListener("DOMContentLoaded", async () => {
  // Variableninitialisierung
  const addTaskModalTitle = document.getElementById("addTaskModalTitle");
  const taskCards = document.querySelectorAll(".task-card");
  const columns = document.querySelectorAll(".board-column");
  const taskDetailsModal = document.getElementById("taskDetailsModal");
  const addTaskModal = document.getElementById("addTaskModal");
  const addTaskButton = document.getElementById("addTaskButton");
  const addTaskForm = document.getElementById("addTaskForm");
  const closeButton = document.querySelectorAll(".close-button");
  const cancelButton = document.getElementById("cancelButton");
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
  const selectedContactsContainer = document.getElementById(
    "selectedContactsContainer"
  );
  const taskCategorySelectedText = document.getElementById(
    "taskCategorySelectedText"
  );
  const taskCategoryDropdown = document.getElementById("taskCategoryDropdown");
  const taskCategoryPlaceholder = taskCategoryDropdown.querySelector(
    ".dropdown-placeholder"
  );
  const taskCategoryOptions = document.getElementById("taskCategoryOptions");
  const taskCategoryInput = document.getElementById("taskCategoryInput");
  const taskCategoryArrow = document.getElementById("taskCategoryArrow"); // Pfeil-Icon

  let users = [];
  let draggedTask = null;
  let selectedPriority = null; // Variable zum Speichern der ausgewählten Priorität
  let currentTaskId = null; // Speichert die ID der aktuellen Aufgabe für Bearbeitung/Löschung

  await loadAssignedToOptions();
  await loadTasksFromFirebase();
  updateNoTasksMessages();

  // Öffnen/Schließen des Dropdowns beim Klicken auf den Platzhalter
  taskCategoryPlaceholder.addEventListener("click", (event) => {
    event.stopPropagation();
    taskCategoryOptions.classList.toggle("hidden");
    taskCategoryArrow.classList.toggle("rotate"); // Pfeil drehen
  });

  // Auswahl einer Kategorie
  taskCategoryOptions.querySelectorAll(".dropdown-option").forEach((option) => {
    option.addEventListener("click", () => {
      taskCategorySelectedText.textContent = option.textContent;
      taskCategoryInput.value = option.getAttribute("data-value");

      const taskTypeInput = document.getElementById("taskTypeInput");
      if (taskTypeInput) {
        taskTypeInput.value = option.getAttribute("data-value");
      } else {
        console.error("Element mit ID 'taskTypeInput' nicht gefunden.");
      }
    });
  });

  // Schließt das Dropdown, wenn außerhalb geklickt wird
  document.addEventListener("click", (event) => {
    if (!taskCategoryDropdown.contains(event.target)) {
      taskCategoryOptions.classList.add("hidden");
      taskCategoryArrow.classList.remove("rotate"); // Pfeil zurückdrehen
    }
  });

  // Toggle Dropdown Visibility
  dropdown.addEventListener("click", toggleAssignedToDropdown);

  function resetFormFields() {
    addTaskForm.reset();
    selectedPriority = null;
    const taskTitleInput = document.getElementById("taskTitle");
    if (!taskTitleInput) {
      console.error("taskTitleInput nicht gefunden.");
      return;
    }
    taskTitleInput.value = ""; // Titel auf einen leeren Wert setzen

    const taskDescriptionTextarea = document.getElementById("taskDescription");
    if (taskDescriptionTextarea) {
      taskDescriptionTextarea.value = "";
    }

    // Priorität zurücksetzen
    selectedPriority = null;
    document
      .querySelectorAll(".priority-btn")
      .forEach((button) => button.classList.remove("clicked"));
    document
      .querySelectorAll(".priority-icon")
      .forEach((iconElem) => (iconElem.style.filter = "none"));

    // "Assigned to" Dropdown zurücksetzen
    options.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
      checkbox.checked = false;
      // Entferne die ausgewählte Klasse
      const item = checkbox.closest(".dropdown-item");
      if (item) {
        item.classList.remove("selected");
      }
    });
    updateSelectedContactsDisplay();

    // Kategorie-Dropdown zurücksetzen
    taskCategoryInput.value = "todo"; // Standardkategorie setzen
    taskCategorySelectedText.textContent = "Select category"; // Platzhaltertext zurücksetzen
    taskCategoryOptions.classList.add("hidden");
    taskCategoryArrow.classList.remove("rotate");

    // Subtasks zurücksetzen
    const confirmedSubtasks = document.getElementById("confirmedSubtasks");
    if (confirmedSubtasks) {
      confirmedSubtasks.innerHTML = "";
    }

    // Offenstehende Dropdowns schließen
    const assignedToOptions = document.getElementById("taskAssignedOptions");
    assignedToOptions.classList.add("hidden");
    arrow.classList.remove("up");
  }

  async function loadAssignedToOptions() {
    try {
      // Kontakte aus Firebase laden
      const snapshot = await firebase.database().ref("contacts").once("value");
      const data = snapshot.val();

      if (!data) {
        console.warn("Keine Benutzer in Firebase gefunden.");
        return;
      }

      users = Object.values(data);

      const optionsContainer = document.getElementById("taskAssignedOptions");

      // Kontakte dynamisch hinzufügen
      users.forEach((user) => {
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
        const label = document.createElement("label");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = user.name;

        const customCheckbox = document.createElement("span");
        customCheckbox.classList.add("custom-checkbox");
        customCheckbox.style.width = "20px";
        customCheckbox.style.height = "20px";
        customCheckbox.style.display = "inline-block";
        customCheckbox.style.backgroundImage =
          "url('./assets/icons/property-default.png')";
        customCheckbox.style.backgroundSize = "cover";
        customCheckbox.style.cursor = "pointer";

        //----------------------------------------------------------------//

        // Struktur zusammensetzen
        label.appendChild(checkbox);
        label.appendChild(customCheckbox);

        // Element zusammenfügen
        item.appendChild(avatar);
        item.appendChild(name);
        item.appendChild(label); // Entfernt die direkte Einfügung der Checkbox
        optionsContainer.appendChild(item);

        // Funktion zur Aktualisierung des Checkbox-Aussehens
        function updateCheckboxAppearance() {
          if (checkbox.checked) {
            customCheckbox.style.backgroundImage =
              "url('./assets/icons/property-checked.png')";
            customCheckbox.style.filter = "brightness(0) invert(1)"; // Icon weiß färben
          } else {
            customCheckbox.style.backgroundImage =
              "url('./assets/icons/property-default.png')";
            customCheckbox.style.filter = ""; // Filter zurücksetzen
          }
        }

        // Event Listener zum Item hinzufügen
        item.addEventListener("click", (event) => {
          event.stopPropagation(); // Verhindert das Schließen des Dropdowns
          // Wenn Checkbox geklickt wird, nichts tun (um Doppeltoggeln zu vermeiden)
          if (event.target === checkbox) {
            return;
          }
          // Toggle Checkbox Zustand
          checkbox.checked = !checkbox.checked;

          // Aktualisieren des Checkbox-Aussehens
          updateCheckboxAppearance();

          // Toggle selected class for background color
          item.classList.toggle("selected", checkbox.checked);

          // Update der Auswahlanzeige
          updateSelectedContactsDisplay();
          updateSelectedCategoryDisplay();
        });

        // Event Listener für Checkbox
        checkbox.addEventListener("change", () => {
          updateCheckboxAppearance();
          updateSelectedContactsDisplay();
          updateSelectedCategoryDisplay();
        });

        // Event Listener für Hover-Effekte
        item.addEventListener("mouseover", () => {
          // Wenn die Checkbox nicht ausgewählt ist, Icon weiß färben
          if (!checkbox.checked) {
            customCheckbox.style.filter = "brightness(0) invert(1)";
          }
        });

        item.addEventListener("mouseout", () => {
          // Wenn die Checkbox nicht ausgewählt ist, Filter zurücksetzen
          if (!checkbox.checked) {
            customCheckbox.style.filter = "";
          }
        });
      });
    } catch (error) {
      console.error("Fehler beim Laden der Kontakte aus Firebase:", error);
    }
  }

  function getRandomColor() {
    const colors = [
      "#ff8a65",
      "#4db6ac",
      "#9575cd",
      "#f06292",
      "#ba68c8",
      "#7986cb",
      "#ffb74d",
      "#4dd0e1",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // Funktion: Dropdown für "Assigned to" öffnen/schließen
  function toggleAssignedToDropdown(event) {
    event.stopPropagation(); // Verhindert das Schließen beim Klicken auf das Dropdown
    const dropdownOptions = document.getElementById("taskAssignedOptions");

    // Toggle "hidden" Klasse, um Dropdown zu zeigen oder zu verstecken
    dropdownOptions.classList.toggle("hidden");

    // Pfeil-Icon umdrehen
    arrow.classList.toggle("up");
  }

  // Funktion: Schließen des Dropdowns, wenn außerhalb geklickt wird
  function closeAssignedToDropdown(event) {
    const dropdownContainer = document.getElementById("taskAssignedContainer");

    // Prüfen, ob der Klick außerhalb des Dropdowns war
    if (!dropdownContainer.contains(event.target)) {
      options.classList.add("hidden");

      // Stelle sicher, dass das Pfeil-Icon zurückgesetzt wird
      arrow.classList.remove("up");

      // Aktualisiere die Anzeige der ausgewählten Kontakte
      updateSelectedContactsDisplay();
    }
  }

  // Funktion zum Aktualisieren der Anzeige der ausgewählten Kontakte
  function updateSelectedContactsDisplay() {
    const optionsContainer = document.getElementById("taskAssignedOptions");
    const selectedInputs = optionsContainer.querySelectorAll(
      "input[type='checkbox']:checked"
    );

    const selectedContacts = Array.from(selectedInputs).map(
      (input) => input.value
    );

    selectedContactsContainer.innerHTML = ""; // Vorherigen Inhalt löschen

    if (selectedContacts.length > 0) {
      // Für jeden ausgewählten Kontakt ein Avatar erstellen
      selectedContacts.forEach((name) => {
        const user = users.find((u) => u.name === name);
        if (user) {
          const avatar = document.createElement("div");
          avatar.classList.add("avatar");
          avatar.textContent = user.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
          avatar.style.backgroundColor = user.color || getRandomColor();

          selectedContactsContainer.appendChild(avatar);
        }
      });
      // Aktualisiere die Anzeige der ausgewählten Kategorie
      updateSelectedCategoryDisplay();
    }
  }

  function updateSelectedCategoryDisplay() {
    const selectedCategoryContainer = document.getElementById(
      "selectedCategoryContainer"
    );
    if (!selectedCategoryContainer) {
      console.warn("Element 'selectedCategoryContainer' nicht gefunden.");
      return;
    }

    const optionsContainer = document.getElementById("taskCategoryOptions");
    if (!optionsContainer) {
      console.warn("Element 'taskCategoryOptions' nicht gefunden.");
      return;
    }

    const selectedInputs = optionsContainer.querySelectorAll(
      "input[type='checkbox']:checked"
    );

    const selectedCategories = Array.from(selectedInputs).map(
      (input) => input.value
    );

    selectedCategoryContainer.innerHTML = ""; // Vorherigen Inhalt löschen

    if (selectedCategories.length > 0) {
      const categories = [
        { name: "User Story", color: "#ff0000" },
        { name: "Technical Task", color: "#00ff00" },
      ];

      selectedCategories.forEach((categoryName) => {
        const category = categories.find((c) => c.name === categoryName);
        if (category) {
          const categoryDiv = document.createElement("div");
          categoryDiv.classList.add("category-item");
          categoryDiv.textContent = category.name;
          categoryDiv.style.backgroundColor = category.color;

          selectedCategoryContainer.appendChild(categoryDiv);
        }
      });
    }
  }

  // Sicherstellen, dass das Eingabe-Element vorhanden ist
  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("addTaskForm");
    form.addEventListener("submit", (event) => {
      event.preventDefault(); // Verhindert das Standard-Formularverhalten

      const titleInput = document.getElementById("taskTitle");
      if (!titleInput) {
        console.error("Element 'taskTitle' nicht gefunden.");
        return; // Bricht ab, wenn das Element fehlt
      }

      const title = titleInput.value.trim();
      if (!title) {
        console.error("Das Feld 'taskTitle' ist leer.");
        return; // Bricht ab, wenn das Feld leer ist
      }

      console.log("Task Title:", title);

      // Weiterverarbeitung des Formulars hier...
    });
  });

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

      const priorityIconsHTML = {
        Urgent:
          '<img src="./assets/icons/urgent.png" alt="Urgent" class="priority-icon">',
        Medium:
          '<img src="./assets/icons/medium.png" alt="Medium" class="priority-icon">',
        Low: '<img src="./assets/icons/low.png" alt="Low" class="priority-icon">',
      };

      taskDetailPriority.innerHTML = `${task.dataset.priority} ${
        priorityIconsHTML[task.dataset.priority] || ""
      }`;

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
    // Dragover erlaubt das Ablegen innerhalb der Spalte
    column.addEventListener("dragover", (e) => {
      e.preventDefault(); // Verhindert Standardaktionen (z. B. Textauswahl)
      column.classList.add("drag-over"); // Optional: Visuelles Feedback
    });

    // Entferne visuelles Feedback, wenn Drag endet
    column.addEventListener("dragleave", () => {
      column.classList.remove("drag-over");
    });

    // Drop-Event
    column.addEventListener("drop", async (e) => {
      e.preventDefault();

      if (draggedTask) {
        const tasksContainer = column.querySelector(".tasks-container");

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
      const snapshot = await firebase.database().ref("tasks").once("value");
      const tasks = snapshot.val(); // Liefert ein Objekt mit allen Tasks

      if (tasks) {
        console.log("Geladene Tasks:", tasks);
        Object.keys(tasks).forEach((taskId) => {
          const task = tasks[taskId];
          task.id = taskId;

          if (!task.title || !task.category) {
            console.warn(
              `Task mit ID ${taskId} hat unvollständige Daten und wird übersprungen.`,
              task
            );
            return;
          }

          // Validierung: Standardwert für subtasks setzen, falls nicht vorhanden
          if (!Array.isArray(task.subtasks)) {
            task.subtasks = [];
          }

          displayTask(task, task.category);
        });
      }
    } catch (error) {
      console.error("Fehler beim Laden der Tasks aus Firebase:", error);
    }
  }

  // Aufgabe auf dem Kanban-Board anzeigen
  function displayTask(task, category) {
    console.log("Task:", task);
    console.log("Category:", category);
    if (!category) {
      console.error("Kategorie ist nicht definiert für Task:", task);
      return;
    }

    const statusMapping = {
      "To Do": "todo",
      "In Progress": "in-progress",
      "Await Feedback": "await-feedback",
      Done: "done",
    };
    const sanitizedCategory =
      statusMapping[category] || category.toLowerCase().replace(/\s+/g, "");
    console.log("Sanitized Category:", sanitizedCategory);
    const targetColumn = document.querySelector(
      `.board-column[data-status="${sanitizedCategory}"] .tasks-container`
    );

    if (!targetColumn) {
      console.warn(
        `Kategorie "${sanitizedCategory}" hat keine passende Spalte. Task wird übersprungen.`,
        task
      );
      return;
    }

    const taskElement = document.createElement("div");
    taskElement.classList.add("task-card");
    taskElement.dataset.id = task.id;

    // Inhalte des Task-Elements
    taskElement.innerHTML = `
    <div class="tag">${task.type || "Task"}</div>
    <h3>${task.title}</h3>
    <p>${task.description}</p>
    <div class="priority">${task.priority}</div>
    <div class="avatars"></div>
  `;

    // Validierung und Zuweisung von subtasks
    taskElement.dataset.subtasks = Array.isArray(task.subtasks)
      ? task.subtasks.join(", ")
      : "";

    const priorityIconsHTML = {
      Urgent:
        '<img src="./assets/icons/urgent.png" alt="Urgent" class="priority-icon">',
      Medium:
        '<img src="./assets/icons/medium.png" alt="Medium" class="priority-icon">',
      Low: '<img src="./assets/icons/low.png" alt="Low" class="priority-icon">',
    };

    // Aktualisiere die Avatare
    const avatarsContainer = taskElement.querySelector(".avatars");
    avatarsContainer.innerHTML = ""; // Beispielhaft leer lassen, oder weitere Logik einfügen
    if (task.assignedTo) {
      if (typeof task.assignedTo === "object") {
        // Extrahiere die Namen aus `assignedTo`, falls es ein Objekt ist
        const assignedToNames = Object.values(task.assignedTo);
        avatarsContainer.innerHTML = assignedToNames
          .map(
            (name) =>
              `<div class="avatar" style="background-color:${getRandomColor()}">
                ${name.trim().charAt(0)}
              </div>`
          )
          .join("");
      } else if (typeof task.assignedTo === "string") {
        // Falls es ein String ist, nutze .split(",")
        avatarsContainer.innerHTML = task.assignedTo
          .split(",")
          .map(
            (name) =>
              `<div class="avatar" style="background-color:${getRandomColor()}">
                ${name.trim().charAt(0)}
              </div>`
          )
          .join("");
      } else {
        console.warn(
          "task.assignedTo hat ein unerwartetes Format:",
          task.assignedTo
        );
        avatarsContainer.innerHTML = ""; // Fallback für ungültige Werte
      }
    } else {
      avatarsContainer.innerHTML = ""; // Keine Avatare anzeigen
    }

    // Füge zusätzliche Klassen hinzu, z.B. 'user-story' oder 'technical-task'
    if (task.type === "User Story") {
      taskElement.classList.add("user-story");
    } else if (task.type === "Technical Task") {
      taskElement.classList.add("technical-task");
    }

    taskElement.setAttribute("draggable", "true");

    // Datenattribute setzen
    taskElement.dataset.id = task.id;
    taskElement.dataset.title = task.title;
    taskElement.dataset.description = task.description;
    taskElement.dataset.dueDate = task.dueDate;
    taskElement.dataset.priority = task.priority;
    taskElement.dataset.assignedTo = JSON.stringify(task.assignedTo); // Falls notwendig, als String speichern
    taskElement.dataset.subtasks = Array.isArray(task.subtasks)
      ? task.subtasks.join(", ")
      : "";
    taskElement.dataset.category = task.category;
    taskElement.dataset.type = task.type;

    // Aktualisiere den Inhalt des Task-Elements
    taskElement.querySelector("h3").textContent = task.title || "No Title";
    taskElement.querySelector("p").textContent =
      task.description || "No Description";
    taskElement.querySelector(".priority").innerHTML = `${task.priority} ${
      priorityIconsHTML[task.priority] || ""
    }`;

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
      const categoryField = document.getElementById("taskCategoryInput");
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
    resetFormFields();
    addTaskModal.style.right = "-100%";
    setTimeout(() => {
      addTaskModal.style.display = "none";
    }, 500);
  });

  // Add Task Modal
  addTaskButton.addEventListener("click", () => {
    resetFormFields();
    addTaskModalTitle.textContent = "Add Task";
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

    const title = document.getElementById("taskTitle").value.trim();
    const description = document.getElementById("taskDescription").value;
    const dueDate = document.getElementById("taskDueDate").value;
    const priority = selectedPriority || "Medium";
    const assignedToInputs = options.querySelectorAll(
      "input[type='checkbox']:checked"
    );
    const assignedTo = Array.from(assignedToInputs)
      .map((input) => input.value)
      .join(", ");
    const subtaskElements = document.querySelectorAll(
      "#subtaskList .subtask-text"
    );
    const subtasks = Array.from(subtaskElements).map((elem) =>
      elem.textContent.trim()
    );
    const category = document.getElementById("taskCategoryInput").value.trim();
    const taskType = document.getElementById("taskTypeInput").value.trim();

    try {
      const taskRef = firebase.database().ref("tasks");
      const newTaskRef = taskRef.push();
      await newTaskRef.set({
        title,
        description,
        dueDate,
        priority,
        category,
        taskType,
        assignedTo,
        subtasks: [],
      });

      const newTask = {
        id: newTaskRef.key,
        title,
        description,
        dueDate,
        priority,
        category,
        taskType,
        assignedTo,
        subtasks: [],
      };

      // Aufgabe auf dem Board anzeigen
      displayTask(newTask, category);
      resetFormFields();

      // Modal schließen und Formular zurücksetzen
      addTaskForm.reset();
      selectedPriority = null;
      document
        .querySelectorAll(".priority-btn")
        .forEach((button) => button.classList.remove("clicked"));
      document
        .querySelectorAll(".priority-icon")
        .forEach((iconElem) => (iconElem.style.filter = "none"));

      // Zurücksetzen der ausgewählten Kontakte
      options.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
        checkbox.checked = false;
        // Entferne die ausgewählte Klasse
        const item = checkbox.closest(".dropdown-item");
        if (item) {
          item.classList.remove("selected");
        }
      });
      updateSelectedContactsDisplay();

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
      // Schließe das Task-Detail-Modal
      taskDetailsModal.style.display = "none";

      // Setze den Modaltitel auf 'Edit Task'
      addTaskModalTitle.textContent = "Edit Task";

      // Fülle das Add Task Modal mit den aktuellen Task-Daten
      const taskRef = firebase.database().ref(`tasks/${currentTaskId}`);
      try {
        const snapshot = await taskRef.once("value");
        const taskData = snapshot.val();

        if (!taskData) {
          console.error(`Keine Daten für Task-ID ${currentTaskId} gefunden.`);
          return;
        }

        // Setze die Werte im Formular
        document.getElementById("taskTitle").value = taskData.title || "";
        document.getElementById("taskDescription").value =
          taskData.description || "";
        document.getElementById("taskDueDate").value = taskData.dueDate || "";
        document.getElementById("taskCategoryInput").value =
          taskData.category || "todo";
        document.getElementById("taskCategorySelectedText").textContent =
          taskData.type || "Select category";

        // Setze die ausgewählten Kontakte
        const assignedToNames = taskData.assignedTo
          ? taskData.assignedTo.split(", ").map((name) => name.trim())
          : [];
        options
          .querySelectorAll("input[type='checkbox']")
          .forEach((checkbox) => {
            checkbox.checked = assignedToNames.includes(checkbox.value);
            const item = checkbox.closest(".dropdown-item");
            if (item) {
              item.classList.toggle("selected", checkbox.checked);
            }
          });
        updateSelectedContactsDisplay();

        // Subtasks setzen
        const subtaskList = document.getElementById("subtaskList");
        subtaskList.innerHTML = "";
        if (taskData.subtasks) {
          taskData.subtasks.forEach((subtask) => {
            addSubtask(subtask.replace("✔", "").trim());
          });
        }

        // Priorität setzen
        selectedPriority = taskData.priority;
        document.querySelectorAll(".priority-btn").forEach((button) => {
          button.classList.remove("clicked", "urgent", "medium", "low");
        });
        document
          .querySelectorAll(".priority-icon")
          .forEach((iconElem) => (iconElem.style.filter = "none"));

        if (selectedPriority === "Urgent") {
          handleButtonClick(urgentBtn, document.getElementById("urgentIcon"));
        } else if (selectedPriority === "Medium") {
          handleButtonClick(mediumBtn, document.getElementById("mediumIcon"));
        } else if (selectedPriority === "Low") {
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
    // Inhalt wie oben, daher nicht wiederholt
  }

  // Submit Handler für das Aktualisieren einer bestehenden Aufgabe
  async function updateTaskHandler(e) {
    e.preventDefault();

    const title = document.getElementById("taskTitle").value.trim();
    const description = document.getElementById("taskDescription").value.trim();
    const dueDate = document.getElementById("taskDueDate").value;
    const priority = selectedPriority || "Medium";
    const assignedToInputs = options.querySelectorAll(
      "input[type='checkbox']:checked"
    );
    const assignedTo = Array.from(assignedToInputs)
      .map((input) => input.value)
      .join(", ");
    const subtaskElements = document.querySelectorAll(
      "#subtaskList .subtask-text"
    );
    const subtasks = Array.from(subtaskElements).map((elem) =>
      elem.textContent.trim()
    );
    const category = document.getElementById("taskCategoryInput").value.trim();
    const type = document.getElementById(
      "taskCategorySelectedText"
    ).textContent;

    // Validierung
    if (!title || !category) {
      alert("Bitte fülle alle erforderlichen Felder aus.");
      return;
    }

    const updatedTask = {
      title,
      description,
      dueDate,
      priority,
      category,
      type,
      assignedTo,
      subtasks,
    };

    try {
      // Aktualisiere die Aufgabe in Firebase
      await firebase
        .database()
        .ref(`tasks/${currentTaskId}`)
        .update(updatedTask);

      // Entferne die alte Task-Element
      const oldTaskElement = document.querySelector(
        `.task-card[data-id="${currentTaskId}"]`
      );
      if (oldTaskElement) {
        oldTaskElement.remove();
      }

      // Zeige die aktualisierte Aufgabe auf dem Board
      updatedTask.id = currentTaskId; // Füge die ID hinzu
      displayTask(updatedTask, updatedTask.category);

      // Modal schließen und Formular zurücksetzen
      addTaskForm.reset();
      selectedPriority = null;
      document
        .querySelectorAll(".priority-btn")
        .forEach((button) => button.classList.remove("clicked"));
      document
        .querySelectorAll(".priority-icon")
        .forEach((iconElem) => (iconElem.style.filter = "none"));

      // Zurücksetzen der ausgewählten Kontakte
      options.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
        checkbox.checked = false;
        // Entferne die ausgewählte Klasse
        const item = checkbox.closest(".dropdown-item");
        if (item) {
          item.classList.remove("selected");
        }
      });
      updateSelectedContactsDisplay();

      addTaskModal.style.right = "-100%";
      setTimeout(() => {
        addTaskModal.style.display = "none";
      }, 500);

      // Entferne den temporären Submit Handler und setze den Standard-Handler wieder ein
      addTaskForm.removeEventListener("submit", updateTaskHandler);
      addTaskForm.addEventListener("submit", addTaskFormSubmitHandler);
    } catch (error) {
      console.error("Fehler beim Aktualisieren der Aufgabe:", error);
    }
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
});

// Funktion zum Anzeigen der Task-Details im Modal
function displayTaskDetails(taskElement) {
  currentTaskId = taskElement.dataset.id;

  const taskDetailsModal = document.getElementById("taskDetailsModal");
  const taskTypeElement = document.getElementById("taskType");
  const taskDetailTitle = document.getElementById("taskDetailTitle");
  const taskDetailDescription = document.getElementById(
    "taskDetailDescription"
  );
  const taskDetailDueDate = document.getElementById("taskDetailDueDate");
  const taskDetailPriority = document.getElementById("taskDetailPriority");
  const taskAssignedTo = document.getElementById("taskAssignedTo");
  const taskSubtasks = document.getElementById("taskSubtasks");

  if (
    !taskTypeElement ||
    !taskDetailTitle ||
    !taskDetailDescription ||
    !taskDetailDueDate ||
    !taskDetailPriority ||
    !taskAssignedTo ||
    !taskSubtasks
  ) {
    console.error(
      "Ein oder mehrere Elemente für die Task-Details wurden nicht gefunden."
    );
    return;
  }

  // Aktualisiere die Task-Details
  taskTypeElement.textContent = taskElement.dataset.type || "Task";
  taskTypeElement.style.backgroundColor =
    taskElement.dataset.type === "Technical Task" ? "#26a69a" : "#2962ff";
  taskDetailTitle.textContent =
    taskElement.dataset.title || "No title provided";
  taskDetailDescription.textContent =
    taskElement.dataset.description || "No description provided";
  taskDetailDueDate.textContent = taskElement.dataset.dueDate || "No due date";

  // Priorität
  taskDetailPriority.innerHTML = `${
    taskElement.dataset.priority
  } ${getPriorityIcon(taskElement.dataset.priority)}`;

  // Update priority
  const priorityMap = {
    Urgent:
      '<img src="./assets/icons/urgent.png" alt="Urgent" class="priority-icon">',
    Medium:
      '<img src="./assets/icons/medium.png" alt="Medium" class="priority-icon">',
    Low: '<img src="./assets/icons/low.png" alt="Low" class="priority-icon">',
  };
  taskDetailPriority.innerHTML = `${task.dataset.priority || "No priority"} ${
    priorityMap[task.dataset.priority] || ""
  }`;

  // Assigned To
  taskAssignedTo.innerHTML = "";
  if (taskElement.dataset.assignedTo) {
    const assignedContacts = taskElement.dataset.assignedTo
      .split(",")
      .map((name) => name.trim());
    taskAssignedTo.innerHTML = assignedContacts
      .map((contact) => `<li>${contact}</li>`)
      .join("");
  }

  // Subtasks
  taskSubtasks.innerHTML = "";
  if (taskElement.dataset.subtasks) {
    const subtasks = taskElement.dataset.subtasks
      .split(",")
      .map((subtask) => subtask.trim());
    subtasks.forEach((subtask) => {
      const listItem = document.createElement("li");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = subtask.startsWith("✔");
      listItem.appendChild(checkbox);
      listItem.appendChild(
        document.createTextNode(subtask.replace("✔", "").trim())
      );
      taskSubtasks.appendChild(listItem);
    });
  } else {
    taskSubtasks.innerHTML = "<li>No subtasks</li>";
  }

  // Anzeigen des Modals
  taskDetailsModal.style.display = "block";
}

// Close modal on click
document.addEventListener("DOMContentLoaded", () => {
  const closeButton = document.querySelector(".close-button");
  if (closeButton) {
    closeButton.addEventListener("click", () => {
      document.getElementById("taskDetailsModal").style.display = "none";
    });
  }
});

// Event Listener: Subtasks hinzufügen
document.addEventListener("DOMContentLoaded", () => {
  const subtaskAddButton = document.querySelector(".subtask-add-button");
  if (subtaskAddButton) {
    subtaskAddButton.addEventListener("click", () => {
      const subtaskInput = document.getElementById("subtaskInput");
      const subtaskText = subtaskInput ? subtaskInput.value.trim() : "";

      if (subtaskText) {
        addSubtask(subtaskText);
        subtaskInput.value = ""; // Eingabefeld zurücksetzen
      }
    });
  } else {
    console.warn("Element '.subtask-add-button' wurde nicht gefunden.");
  }
});

// Funktion zum Hinzufügen eines Subtasks
function addSubtask(text) {
  const subtaskList = document.getElementById("subtaskList");
  if (!subtaskList) {
    console.error('Element mit ID "subtaskList" nicht gefunden.');
    return;
  }

  // Subtask-Container erstellen
  const subtaskItem = document.createElement("li");
  subtaskItem.classList.add("subtask-item");

  // Checkbox hinzufügen
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.classList.add("subtask-checkbox");

  // Subtask-Text
  const subtaskText = document.createElement("span");
  subtaskText.textContent = text;
  subtaskText.classList.add("subtask-text");

  // Bearbeiten-Button hinzufügen
  const editButton = document.createElement("button");
  editButton.classList.add("edit-subtask");
  editButton.innerHTML = `<img src="./assets/icons/edit_hover.png" alt="Edit" />`;

  // Löschen-Button hinzufügen
  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete-subtask");
  deleteButton.innerHTML = `<img src="./assets/icons/delete_hover.png" alt="Delete" />`;

  // Event Listener für Bearbeiten
  editButton.addEventListener("click", () => {
    const newText = prompt("Edit subtask:", subtaskText.textContent);
    if (newText !== null) {
      subtaskText.textContent = newText.trim() || subtaskText.textContent;
      updateSubtasksInFirebase();
    }
  });

  // Event Listener für Löschen
  deleteButton.addEventListener("click", () => {
    if (confirm("Möchtest du diesen Subtask wirklich löschen?")) {
      subtaskList.removeChild(subtaskItem);
      updateSubtasksInFirebase();
    }
  });

  // Struktur zusammensetzen
  subtaskItem.appendChild(checkbox);
  subtaskItem.appendChild(subtaskText);
  subtaskItem.appendChild(editButton);
  subtaskItem.appendChild(deleteButton);

  // Subtask zur Liste hinzufügen
  subtaskList.appendChild(subtaskItem);

  // Aktualisiere die Subtasks in Firebase
  updateSubtasksInFirebase();
}

// Funktion zum Aktualisieren der Subtasks in Firebase
function updateSubtasksInFirebase() {
  if (!currentTaskId) {
    console.error(
      "currentTaskId ist nicht gesetzt. Subtasks können nicht aktualisiert werden."
    );
    return; // Brich die Funktion ab
  }
  const subtaskList = document.getElementById("subtaskList");
  if (!subtaskList) return;

  const subtasks = Array.from(subtaskList.children).map((li) => {
    const text = li.querySelector(".subtask-text").textContent.trim();
    const isCompleted = li.querySelector(".subtask-checkbox").checked;
    return isCompleted ? `✔ ${text}` : text;
  });
  firebase.database().ref(`tasks/${currentTaskId}/subtasks`).set(subtasks);
}
