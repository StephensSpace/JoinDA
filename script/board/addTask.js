function openAddTaskModal(type) {
  resetAddTaskModal();
  selectedType = type || "";
  document.getElementById("addTaskModal").style.display = "block";
  fetchContacts((contacts) => {
    populateContactsDropdown(contacts);
  });
}

function addTaskToBoard(task) {
  const type = task.type || '';
  const boardColumn = document.querySelector(`.board-column[data-type="${type}"]`);
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

function handleTaskSubmit(e) {
  e.preventDefault();
  const isCategoryValid = checkCategory();
  const isTitleValid = checkTitle();
  const isDateValid = checkDueDate();
  if (isCategoryValid && isTitleValid && isDateValid) {
    const task = taskList();
    if (!task) {
      return;
    }
    if (isEditMode && currentTaskId) {
      updateTaskInFirebase(currentTaskId, task);
      firebase.database().ref(`/tasks/${currentTaskId}`).once("value").then((snapshot) => {
        const updatedTask = snapshot.val();
        Object.assign(currentTask, updatedTask);
        showTaskDetails(currentTask);
        closeModal();
        resetAddTaskModal();
      });
    } else {
      saveTaskToFirebase(task);
      closeModal();
      resetAddTaskModal();
    }
  }
}

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

function checkDueDate() {
  const dateInput = document.getElementById("taskDueDate");
  const dateError = document.getElementById("dueDateError");
  if (!dateInput.value) {
    dateError.classList.remove("hidden");
    dateInput.focus();
    return false;
  } else {
    dateError.classList.add("hidden");
    return true;
  }
}

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

function hideErrorMessages() {
  const titleError = document.getElementById("titleError");
  const dateError = document.getElementById("dueDateError");
  const categoryError = document.getElementById("msg-box");
  if (titleError) titleError.classList.add("hidden");
  if (dateError) dateError.classList.add("hidden");
  if (categoryError) categoryError.classList.add("hidden");
}

function closeModal() {
  const addTaskModal = document.getElementById("addTaskModal");
  addTaskModal.style.display = "none";
  isEditMode = false;
  currentTaskId = null;
}

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
    handleOptionSelection(event, secondDropdown, secondOptionsContainer, secondArrow, secondSelectedText, taskTypeInput);
  });

  document.addEventListener("click", (event) => {
    if (!secondDropdown.contains(event.target)) {
      secondDropdown.classList.remove("open");
      secondOptionsContainer.classList.add("hidden");
      secondArrow.classList.remove("open");
    }
  });
}

function toggleSecondDropdown(secondDropdown, secondOptionsContainer, secondArrow) {
  const isOpen = secondDropdown.classList.toggle("open");
  secondOptionsContainer.classList.toggle("hidden", !isOpen);
  secondArrow.classList.toggle("open", isOpen);
}

function handleOptionSelection(event, secondDropdown, secondOptionsContainer, secondArrow, secondSelectedText, taskTypeInput) {
  if (!event.target.classList.contains("second-dropdown-option")) return;
  const selectedCategory = event.target.dataset.value;
  secondSelectedText.textContent = selectedCategory;
  taskTypeInput.value = selectedCategory;
  secondOptionsContainer.querySelectorAll(".second-dropdown-option").forEach((option) => option.classList.remove("selected"));
  event.target.classList.add("selected");
  secondDropdown.classList.remove("open");
  secondOptionsContainer.classList.add("hidden");
  secondArrow.classList.remove("open");
}
