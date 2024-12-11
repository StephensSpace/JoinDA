function openAddTaskModal(type) {
  resetAddTaskModal();
  selectedType = type || "";
  document.getElementById("addTaskModal").style.display = "block";
  fetchContacts((contacts) => {
    populateContactsDropdown(contacts);
  });
}

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

function handleTaskSubmit(e) {
  e.preventDefault();
  const isCategoryValid = checkCategory();
  const isTitleValid = checkTitle();
  const isDateValid = checkDueDate();
  if (isCategoryValid && isTitleValid && isDateValid) {
    if (isEditMode) {
      updateTaskInFirebase(currentTaskId, task);
    } else {
      saveTaskToFirebase(task);
    }
    closeModal();
    resetAddTaskModal();
  }
  taskList();
}

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
  if (document.referrer) {
    window.location.href = document.referrer;
  } else {
    window.location.href = "./board.html";
  }
}

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
  const typeInput = document.getElementById("taskTypeInput");
  secondDropdown.addEventListener("click", (event) => {
    event.stopPropagation();
    const isOpen = secondDropdown.classList.toggle("open");
    secondOptionsContainer.classList.toggle("hidden", !isOpen);
    secondArrow.classList.toggle("open", isOpen);
  });
  secondOptionsContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("second-dropdown-option")) {
      const selectedCategory = event.target.dataset.value;
      secondSelectedText.textContent = selectedCategory;
      typeInput.value = selectedCategory;
      secondOptionsContainer
        .querySelectorAll(".second-dropdown-option")
        .forEach((option) => {
          option.classList.remove("selected");
        });
      event.target.classList.add("selected");
      secondDropdown.classList.remove("open");
      secondOptionsContainer.classList.add("hidden");
      secondArrow.classList.remove("open");
    }
  });
  document.addEventListener("click", (event) => {
    if (!secondDropdown.contains(event.target)) {
      secondDropdown.classList.remove("open");
      secondOptionsContainer.classList.add("hidden");
      secondArrow.classList.remove("open");
    }
  });
}
