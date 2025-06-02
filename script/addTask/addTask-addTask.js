/**
 * Opens the "Add Task" modal, resets its fields, and populates the contacts dropdown.
 * @param {string} [type] - The type of task to pre-select in the modal.
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
 * Adds a task to the appropriate column on the board.
 * @param {Object} task - The task object containing its details.
 */

function addTaskToBoard(task) {
  const status = task.type || "todo";
  const boardColumn = document.querySelector(`.board-column[data-status="${status}"]`);
  if (!boardColumn) return;
  const tasksContainer = boardColumn.querySelector(".tasks-container");
  if (!tasksContainer) return;
  const taskCard = createTaskCard(task);
  tasksContainer.appendChild(taskCard);
  taskCard.addEventListener("dragstart", () => { draggedTask = taskCard;
  });
  taskCard.addEventListener("dragend", () => { draggedTask = null;
  });
  updateNoTasksMessage(boardColumn);
}

/**
 * Handles the submission of the "Add Task" form, validates inputs, and saves the task.
 * @param {Event} e - The submit event triggered by the form.
 */

function handleTaskSubmit(e) {
  e.preventDefault();
  const isCategoryValid = checkCategory();
  const isTitleValid = checkTitle();
  const isDateValid = checkDueDate();
  if (isCategoryValid && isTitleValid && isDateValid) {
    const task = taskList();
    if (isEditMode && currentTaskId) {
      updateTaskInFirebase(currentTaskId, task).then(() => {updateTaskOnBoard(currentTaskId, task);
        renderTasks();
      });
    } else {
      saveTaskToFirebase(task).then(() => {});
    }
    closeModal();
    resetAddTaskModal();
  }
}

/**
 * Constructs and returns a task object from the modal's input fields.
 * @returns {Object} The task object containing all relevant task details.
 */

function taskList() {
  const typeInput = document.getElementById("taskTypeInput");
  const task = {
    title: document.getElementById("taskTitle").value,
    description: document.getElementById("taskDescription").value,
    dueDate: document.getElementById("taskDueDate").value,
    type: selectedType || "todo",
    category: typeInput.value,
    priority: selectedPriority || "Medium",
    subtasks: subtasksArray,
    members: selectedMembers,
  };
  return task;
}

/**
 * Validates the title input field of the task.
 * @returns {boolean} `true` if the title is valid, otherwise `false`.
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
 * Validates the due date input field of the task.
 * @returns {boolean} `true` if the due date is valid, otherwise `false`.
 */

function checkDueDate() {
  const dateInput = document.getElementById("taskDueDate");
  const dateError = document.getElementById("dueDateError");
  const today = new Date().toISOString().split("T")[0];
  if (!dateInput.value) {
    showDateError(dateError, "Bitte ein Datum auswählen.", dateInput);
    return false;
  }
  if (dateInput.value < today) {showDateError(dateError,
      "Das Datum darf nicht in der Vergangenheit liegen.",
      dateInput
    );
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
 * Validates the category input field of the task.
 * @returns {boolean} `true` if the category is valid, otherwise `false`.
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

/**
 * Resets all fields in the "Add Task" modal to their default state.
 */

function resetAddTaskModal() {
  document.getElementById("taskTitle").value = "";
  document.getElementById("taskDescription").value = "";
  document.getElementById("taskDueDate").value = "";
  document.getElementById("subtaskInput").value = "";
  subtasksArray = [];
  updateSubtasksList();
  document
    .querySelectorAll(".priority-btn")
    .forEach((btn) => btn.classList.remove("active"));
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
 * Resets the selected members and updates the dropdown options.
 */

function resetSelectedMembers() {
  selectedMembers = [];
  updateSelectedMembers();
  document.querySelectorAll(".dropdown-option").forEach((option) => {
    option.classList.remove("selected");
    option.style.backgroundColor = "";
    option.style.color = "";
  });
  resetSelectedMembers();
}

/**
 * Resets the input fields and subtasks in the Add Task modal.
 * Clears task title, description, due date, subtask input, and hides subtask error messages.
 */

function resetFieldsAndSubtasks() {
  document.getElementById("taskTitle").value = "";
  document.getElementById("taskDescription").value = "";
  document.getElementById("taskDueDate").value = "";
  document.getElementById("subtaskInput").value = "";
  subtasksArray = [];
  updateSubtasksList();
  const subtaskError = document.getElementById("subtaskError");
  if (subtaskError) {
    subtaskError.classList.add("hidden");
  }
}

/**
 * Resets the priority to "Medium" and updates the visual state of the priority buttons.
 */

function resetPriority() {
  selectedPriority = "Medium";
  const mediumPriorityButton = document.querySelector(
    ".priority-btn[data-priority='Medium']"
  );
  document
    .querySelectorAll(".priority-btn")
    .forEach((btn) => btn.classList.remove("active"));
  if (mediumPriorityButton) {
    mediumPriorityButton.classList.add("active");
    const icon = mediumPriorityButton.querySelector(".priority-icon");
    if (icon) icon.style.filter = "brightness(0) invert(1)";
  }
}

/**
 * Resets the category selection and clears the visual state of the dropdown.
 */

function resetCategory() {
  selectedCategory = "";
  document.getElementById("taskTypeInput").value = "";
  const categoryPlaceholder = document.getElementById(
    "secondDropdownSelectedText"
  );
  if (categoryPlaceholder) {
    categoryPlaceholder.textContent = "Select task category";
  }
  const categoryOptions = document.querySelectorAll(".dropdown-option");
  categoryOptions.forEach((option) => {
    option.classList.remove("selected");
    option.style.backgroundColor = "";
    option.style.color = "";
  });
}

/**
 * Resets the selected contacts and hides all error messages in the Add Task modal.
 * Also resets the "Create Task" button text to its default state.
 */

function resetContactsAndErrors() {
  selectedMembers = [];
  updateSelectedMembers();
  document.querySelectorAll(".dropdown-option").forEach((option) => {
    option.classList.remove("selected");
    option.style.backgroundColor = "";
    option.style.color = "";
  });
  hideErrorMessages();
  const actionButton = document.getElementById("createTaskButton");
  actionButton.textContent = "Create Task";
}

/**
 * Resets the entire Add Task modal by clearing all inputs, selections, and error messages.
 */

function resetAddTaskModal() {
  resetFieldsAndSubtasks();
  resetContactsAndErrors();
  resetPriority();
  resetCategory();
}

/**
 * Hides all error messages in the "Add Task" modal.
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
 * Closes the "Add Task" modal and redirects to the referring page or board.
 */

function closeModal() {
  if (document.referrer) {
    window.location.href = document.referrer;
  } else {
    window.location.href = "./board.html";
  }
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
  secondDropdown.addEventListener("click", (event) => {
    event.stopPropagation();
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
 * @param {HTMLElement} arrow - The dropdown arrow element.
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

/**
 * Manages the display of selected contacts in the "Assigned To" section.
 *
 * - If more than 4 contacts are selected, hides additional contacts and displays a "+N" badge.
 * - If the number of selected contacts is 4 or fewer, ensures the "+N" badge is removed.
 * - Calls `assignedToUserCounterDeleteUser` to update the display if users are removed.
 */

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

/**
 * Ensures that the first 4 selected contacts in the "Assigned To" section are always visible.
 *
 * - Checks if any of the first 4 contacts are hidden.
 * - If a hidden contact is found, makes it visible by setting its `display` property to "flex".
 */

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
