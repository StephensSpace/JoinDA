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
  const boardColumn = document.querySelector(
    `.board-column[data-status="${status}"]`
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
      updateTaskInFirebase(currentTaskId, task).then(() => {
        updateTaskOnBoard(currentTaskId, task);
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
  if (!dateInput.value) {
    dateError.textContent = "Bitte ein Datum auswählen.";
    dateError.classList.remove("hidden");
    dateInput.focus();
    return false;
  }
  const today = new Date().toISOString().split("T")[0];
  if (dateInput.value < today) {
    dateError.textContent = "Das Datum darf nicht in der Vergangenheit liegen.";
    dateError.classList.remove("hidden");
    dateInput.focus();
    return false;
  }
  dateError.classList.add("hidden");
  return true;
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
  selectedMembers = [];
  updateSelectedMembers();
  selectedPriority = "Medium";
  selectedCategory = "";
  document.getElementById("taskTypeInput").value = "";
  const actionButton = document.getElementById("createTaskButton");
  actionButton.textContent = "Create Task";
  hideErrorMessages();
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
 * Sets up the dropdown menu for selecting a task category.
 */

function setupSecondDropdown() {
  const secondDropdown = document.getElementById("secondDropdown");
  const secondOptionsContainer = document.getElementById(
    "secondOptionsContainer"
  );
  const secondArrow = document.getElementById("secondDropdownArrow");
  const secondSelectedText = document.getElementById(
    "secondDropdownSelectedText"
  );
  const categoryInput = document.getElementById("taskCategoryInput");
  const taskTypeInput = document.getElementById("taskTypeInput");

  secondDropdown.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleSecondDropdown(secondDropdown, secondOptionsContainer, secondArrow);
  });

  secondOptionsContainer.addEventListener("click", (event) => {
    handleOptionSelection(
      event,
      secondDropdown,
      secondOptionsContainer,
      secondArrow,
      secondSelectedText,
      taskTypeInput
    );
  });

  document.addEventListener("click", (event) => {
    if (!secondDropdown.contains(event.target)) {
      secondDropdown.classList.remove("open");
      secondOptionsContainer.classList.add("hidden");
      secondArrow.classList.remove("open");
    }
  });
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

function handleOptionSelection(
  event,
  secondDropdown,
  secondOptionsContainer,
  secondArrow,
  secondSelectedText,
  taskTypeInput
) {
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
