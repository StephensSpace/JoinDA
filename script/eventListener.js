document.addEventListener("DOMContentLoaded", () => {
  // Initialize the Board
  fetchTasks((tasks) => {
    renderTasks(tasks);
    enableDragAndDrop(); // Aktiviert Drag-and-Drop für alle geladenen Tasks
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

  // Event Listener für den "Create Task"-Button im "Add Task"-Modal
  const createTaskButton = document.getElementById("createTaskButton");
  if (createTaskButton) {
    createTaskButton.addEventListener("click", handleTaskSubmit);
  }

  // "Add Task"-Button
  const addTaskButton = document.getElementById("addTaskButton");
  if (addTaskButton) {
    addTaskButton.addEventListener("click", () => {
      openAddTaskModal("todo"); // Oder den gewünschten Standardtyp
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

  // Event Listener für den "Cancel"-Button im "Add Task"-Modal
  const cancelButton = document.getElementById("cancelButton");
  if (cancelButton) {
    cancelButton.addEventListener("click", (event) => {
      event.preventDefault(); // Verhindert unerwünschtes Standardverhalten
      resetAddTaskModal(); // Modal-Inhalte zurücksetzen
      closeModal(); // Modal schließen
    });
  }

  // Event Listener für die Prioritätsbuttons
  const priorityButtons = document.querySelectorAll(".priority-btn");
  priorityButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Entferne die aktive Klasse von allen Buttons
      priorityButtons.forEach((btn) => {
        btn.classList.remove("active");
        const icon = btn.querySelector(".priority-icon");
        if (icon) {
          icon.style.filter = "none"; // Standardfarbe wiederherstellen
        }
      });
      button.classList.add("active");
      const icon = button.querySelector(".priority-icon");
      if (icon) {
        icon.style.filter = "brightness(0) invert(1)"; // Icon in Weiß färben
      }
    });
  });

  // Event Listener für den "Delete"-Button
  const deleteButton = document.querySelector(".delete-btn");
  if (deleteButton) {
    deleteButton.addEventListener("click", () => {
      deleteCurrentTask();
    });
  }

  // Event Listener für die "+"-Buttons in den Spalten
  const addTaskTypeButtons = document.querySelectorAll(
    ".add-task-btn-category"
  );
  addTaskTypeButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const type = button.getAttribute("data-type"); // Typ aus Attribut
      console.log("Button geklickt in Spalte mit Typ:", type);
      openAddTaskModal(type); // Modal öffnen und Typ setzen
    });
  });

  // Event Listener für den "Subtask hinzufügen"-Button
  const subtaskInput = document.getElementById("subtaskInput");
  const subtaskAddButton = document.querySelector(".subtask-add-button");
  subtaskAddButton.addEventListener("click", () => {
    addSubtask(subtaskInput.value.trim());
  });
  subtaskInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addSubtask(subtaskInput.value.trim());
    }
  });

  // Weitere Event Listener und Initialisierungscode hier...
});
