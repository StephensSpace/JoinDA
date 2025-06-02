/**
 * Opens the "Add Task" modal, resets its state, and fetches contacts.
 * @param {string} [type] - Optional type of task to pre-select in the modal.
 */

function openAddTaskModal(type) {
  resetAddTaskModal();
  selectedType = type || "";
  document.getElementById("addTaskModal").style.display = "block";
  fetchContacts((contacts) => {
    populateContactsDropdown(contacts);
  });
}

/**
 * Adds a task card to the corresponding column on the board.
 * @param {Object} task - The task object containing all task details.
 */

function addTaskToBoard(task) {
  const type = task.type || "";
  const boardColumn = document.querySelector(
    `.board-column[data-type="${type}"]`
  );
  if (!boardColumn) return;
  const tasksContainer = boardColumn.querySelector(".tasks-container");
  if (!tasksContainer) return;
  const taskCard = createTaskCard(task);
  tasksContainer.appendChild(taskCard);
  taskCard.addEventListener("dragstart", () => {
    draggedTask = taskCard;
  });
  taskCard.addEventListener("dragend", () => {
    draggedTask = null;
  });
  updateNoTasksMessage(boardColumn);
}

/**
 * Überprüft die Gültigkeit von Kategorie, Titel und Datum.
 * @returns {boolean} Gibt `true` zurück, wenn alle Felder gültig sind, sonst `false`.
 */

function validateTaskFields() {
    const isCategoryValid = checkCategory();
    const isTitleValid = checkTitle();
    const isDateValid = checkDueDate();
    return isCategoryValid && isTitleValid && isDateValid;
}
  
/**
 * Verarbeitet und speichert die Task-Daten.
 * @param {Object} task - Die Task-Daten.
 */

function processTaskData(task) {
    if (isEditMode && currentTaskId) {
      updateTaskInFirebase(currentTaskId, task);
      updateTaskDetailsFromFirebase(currentTaskId);
    } else {
      saveTaskToFirebase(task);
      closeModalAndReset();
    }
}
  
/**
   * Aktualisiert die aktuellen Task-Details aus Firebase.
   * @param {string} taskId - Die ID der Task.
   */

function updateTaskDetailsFromFirebase(taskId) {
    firebase
      .database()
      .ref(`/tasks/${taskId}`)
      .once("value")
      .then((snapshot) => {
        const updatedTask = snapshot.val();
        Object.assign(currentTask, updatedTask);
        showTaskDetails(currentTask);
        closeModalAndReset();
      });
}
  
/**
 * Haupt-Handler für das Abschicken des Task-Formulars.
 * @param {Event} e - Das Event-Objekt.
 */

function handleTaskSubmit(e) {
    e.preventDefault();
    if (!validateTaskFields()) {
      return;
    }
    const task = taskList();
    if (!task) {
      return;
    }
    processTaskData(task);
}
  
/**
   * Schließt das Modal und setzt es zurück.
   */

function closeModalAndReset() {
    closeModal();
    resetAddTaskModal();
}
  

/**
 * Constructs a task object from the modal input fields.
 * @returns {Object} The task object containing all relevant data.
 */

function taskList() {
  const typeInput = document.getElementById("taskTypeInput");
  const task = {
    title: document.getElementById("taskTitle").value,
    description: document.getElementById("taskDescription").value,
    dueDate: document.getElementById("taskDueDate").value,
    type: selectedType,
    category: typeInput.value,
    priority: selectedPriority || "Medium",
    subtasks: subtasksArray,
    members: selectedMembers,
  };
  return task;
}

/**
 * Validates the task title input.
 * @returns {boolean} True if the title is valid, otherwise false.
 */

function checkTitle() {
  const titleInput = document.getElementById("taskTitle");
  const titleError = document.getElementById("titleError");
  if (!titleInput.value.trim()) {
    titleError.classList.remove("hidden");
    titleInput.focus();
    return false;
  } else {
    titleError.classList.add("hidden");
    return true;
  }
}

/**
 * Validates the task due date input.
 * @returns {boolean} True if the due date is valid, otherwise false.
 */

function checkDueDate() {
    const dateInput = document.getElementById("taskDueDate");
    const dateError = document.getElementById("dueDateError");
    const today = new Date().toISOString().split("T")[0];
    if (!dateInput.value) {showDateError(dateError, "Bitte ein Datum auswählen.", dateInput);
      return false;
    }
    if (dateInput.value < today) {showDateError(dateError, "Das Datum darf nicht in der Vergangenheit liegen.", dateInput);
      return false;
    }
    dateError.classList.add("hidden");
    return true;
}

/**
 * Zeigt eine Fehlermeldung für ein Eingabefeld an und setzt den Fokus auf das Feld.
 *
 * @param {HTMLElement} errorElement - Das HTML-Element, in dem die Fehlermeldung angezeigt wird.
 * @param {string} message - Die Fehlermeldung, die angezeigt werden soll.
 * @param {HTMLElement} inputElement - Das Eingabefeld, auf das der Fokus gesetzt werden soll.
 */
  
function showDateError(errorElement, message, inputElement) {
    errorElement.textContent = message;
    errorElement.classList.remove("hidden");
    inputElement.focus();
}

/**
 * Validates the task category input.
 * @returns {boolean} True if the category is valid, otherwise false.
 */

function checkCategory() {
  const typeInput = document.getElementById("taskTypeInput");
  const categoryError = document.getElementById("msg-box");
  if (!typeInput.value) {
    categoryError.classList.remove("hidden");
    return false;
  } else {
    categoryError.classList.add("hidden");
    return true;
  }
}

/**
 * Updates the priority icon in the task details based on the selected priority.
 * @param {string} priority - The priority level ("Urgent", "Medium", or "Low").
 */

function updatePriorityIcon(priority) {
  const priorityIcon = document.getElementById("taskDetailPriorityIcon");
  if (priorityIcon) {
    if (priority === "Urgent") {
      priorityIcon.innerHTML =
        '<img src="./assets/icons/urgent.png" alt="Urgent">';
    } else if (priority === "Medium") { priorityIcon.innerHTML =
        '<img src="./assets/icons/medium.png" alt="Medium">';
    } else if (priority === "Low") { priorityIcon.innerHTML = '<img src="./assets/icons/low.png" alt="Low">';
    } else { priorityIcon.innerHTML = "";
    }
  }
}

/**
 * Resets input fields and subtasks in the Add Task modal.
 */

function resetAddTaskModal() {
    document.getElementById("taskTitle").value = "";
    document.getElementById("taskDescription").value = "";
    document.getElementById("taskDueDate").value = "";
    document.getElementById("subtaskInput").value = "";
    subtasksArray = [];
    updateSubtasksList();
    resetPriorityToMedium();
}
  
/**
 * Resets the priority to Medium and updates the UI.
 */

function resetPriorityToMedium() {
    document.querySelectorAll(".priority-btn").forEach((btn) =>
      btn.classList.remove("active")
    );
    const mediumPriorityButton = document.querySelector(
      ".priority-btn[data-priority='Medium']"
    );
    if (mediumPriorityButton) {
      mediumPriorityButton.classList.add("active");
      const icon = mediumPriorityButton.querySelector(".priority-icon");
      if (icon) icon.style.filter = "brightness(0) invert(1)";
    }
}

/**
 * Resets selected members and clears the dropdown options.
 */
function resetSelectedMembers() {
    selectedMembers = [];
    updateSelectedMembers();
    document.querySelectorAll(".dropdown-option").forEach((option) => {
      option.classList.remove("selected");
      option.style.backgroundColor = "";
      option.style.color = "";
    });
}
  
/**
 * Resets the task form fields, category, and button text.
 */

function resetTaskForm() {
    selectedCategory = "";
    document.getElementById("taskTypeInput").value = "";
    const subtaskError = document.getElementById("subtaskError");
    if (subtaskError) {
      subtaskError.classList.add("hidden");
    }
    const actionButton = document.getElementById("createTaskButton");
    actionButton.textContent = "Create Task";
    hideErrorMessages();
}
  

/**
 * Hides all error messages in the modal.
 */

function hideErrorMessages() {
  const titleError = document.getElementById("titleError");
  const dateError = document.getElementById("dueDateError");
  const categoryError = document.getElementById("msg-box");
  if (titleError) titleError.classList.add("hidden");
  if (dateError) dateError.classList.add("hidden");
  if (categoryError) categoryError.classList.add("hidden");
}

/**
 * Closes the "Add Task" modal and resets editing states.
 */

function closeModal() {
  const addTaskModal = document.getElementById("addTaskModal");
  addTaskModal.style.display = "none";
  isEditMode = false;
  currentTaskId = null;
}

/**
 * Sets up event listeners for the second dropdown and handles its toggle behavior.
 */

function setupSecondDropdown() {
    const secondDropdown = document.getElementById("secondDropdown");
    const secondOptionsContainer = document.getElementById("secondOptionsContainer");
    const secondArrow = document.getElementById("secondDropdownArrow");
    const secondSelectedText = document.getElementById("secondDropdownSelectedText");
    const categoryInput = document.getElementById("taskCategoryInput");
    const taskTypeInput = document.getElementById("taskTypeInput");
    secondDropdown.addEventListener("click", (event) => {event.stopPropagation();
    toggleSecondDropdown(secondDropdown, secondOptionsContainer, secondArrow);
    });
    secondOptionsContainer.addEventListener("click", (event) => {
      handleOptionSelection(event,secondDropdown,secondOptionsContainer,secondArrow,secondSelectedText,taskTypeInput);
    });
  }
  
  /**
   * Handles clicks outside the dropdown to close it.
   * @param {HTMLElement} dropdown - The dropdown element.
   * @param {HTMLElement} optionsContainer - The container for dropdown options.
   * @param {HTMLElement} arrow - The dropdown arrow element.
   */
  function handleOutsideClick(dropdown, optionsContainer, arrow) {
      document.addEventListener("click", (event) => {
        if (!dropdown.contains(event.target)) {
          closeDropdown(dropdown, optionsContainer, arrow);
        }
      });
}
    
/**
 * Closes the dropdown by updating its classes.
 * @param {HTMLElement} dropdown - The dropdown element.
 * @param {HTMLElement} optionsContainer - The container for dropdown options.
 *  * @param {HTMLElement} arrow - The dropdown arrow element.
 */
  
function closeDropdown(dropdown, optionsContainer, arrow) {
    dropdown.classList.remove("open");
    optionsContainer.classList.add("hidden");
    arrow.classList.remove("open");
    handleOutsideClick(secondDropdown, secondOptionsContainer, secondArrow);
}

/**
 * Toggles the visibility and state of the second dropdown menu.
 * @param {HTMLElement} secondDropdown - The dropdown element.
 * @param {HTMLElement} secondOptionsContainer - The options container element.
 * @param {HTMLElement} secondArrow - The dropdown arrow element.
 */

function toggleSecondDropdown(
  secondDropdown,
  secondOptionsContainer,
  secondArrow
) {
  const isOpen = secondDropdown.classList.toggle("open");
  secondOptionsContainer.classList.toggle("hidden", !isOpen);
  secondArrow.classList.toggle("open", isOpen);
}

/**
 * Handles selection of an option in the second dropdown menu.
 * @param {Event} event - The click event on the dropdown option.
 * @param {HTMLElement} secondDropdown - The dropdown element.
 * @param {HTMLElement} secondOptionsContainer - The options container element.
 * @param {HTMLElement} secondArrow - The dropdown arrow element.
 * @param {HTMLElement} secondSelectedText - The element displaying the selected option text.
 * @param {HTMLElement} taskTypeInput - The input element to store the selected type.
 */

function handleOptionSelection(event,secondDropdown,secondOptionsContainer,secondArrow,secondSelectedText,taskTypeInput) {
  if (!event.target.classList.contains("second-dropdown-option")) return;
  const selectedCategory = event.target.dataset.value;
  secondSelectedText.textContent = selectedCategory;
  taskTypeInput.value = selectedCategory;
  secondOptionsContainer
    .querySelectorAll(".second-dropdown-option")
    .forEach((option) => option.classList.remove("selected"));
  event.target.classList.add("selected");
  secondDropdown.classList.remove("hidden");
  secondOptionsContainer.classList.add("hidden");
  secondArrow.classList.remove("open");
}

function assignedToUserCounter() {
  if (document.getElementsByClassName("selected-contact-initials").length > 4) {
    for (let i = 4; i < document.getElementsByClassName("selected-contact-initials").length; i++) {
      document.getElementsByClassName("selected-contact-initials")[i].style.display = "none";
      document.getElementsByClassName("numb")[0]?.remove();
      document.getElementById("selectedContactsContainer").innerHTML += `<span class="numb">+${i - 3}</span>`;
    }
  } else {
    document.getElementsByClassName("numb")[0]?.remove();
  }
  assignedToUserCounterDeleteUser();
}

function assignedToUserCounterDeleteUser() {
  if (
    document.getElementsByClassName("selected-contact-initials")[0]?.style.display == "none" ||
    document.getElementsByClassName("selected-contact-initials")[1]?.style.display == "none" ||
    document.getElementsByClassName("selected-contact-initials")[2]?.style.display == "none" ||
    document.getElementsByClassName("selected-contact-initials")[3]?.style.display == "none"
  ) {
    for (let index = 0; index < 4; index++) {
      document.getElementsByClassName("selected-contact-initials")[index].style.display = "flex";
    }
  }
}
