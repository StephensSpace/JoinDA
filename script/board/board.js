const logedUser = sessionStorage.getItem("User");
let selectedPriority = "Medium";
let enableDragCounter = 0;
let selectedMembers = [];
let subtasksArray = [];
let currentTaskId = null;
let selectedCategory = "";
let isEditMode = false;
let currentDraggedTask = null;
let draggedTask = null;
let selectedType = "todo";
let tasksMap = {};
fetchTasks((tasks) => {
  tasksMap = tasks;
});

/**
 * Fetches user contacts from Firebase and executes a callback with the results.
 * @param {Function} callback - The callback function to handle the fetched contacts.
 */

function fetchUsers(callback) {
  firebase
    .database()
    .ref("/contacts/")
    .once("value")
    .then((snapshot) => {
      callback(snapshot.val());
    });
}

/**
 * Fetches tasks from Firebase and executes a callback with the task data.
 * @param {Function} callback - The callback function to process the fetched tasks.
 */

function fetchTasks(callback) {
  firebase
    .database()
    .ref("/tasks/")
    .once("value")
    .then((snapshot) => {
      const tasks = snapshot.val();
      if (!tasks) {
        return;
      }
      callback(tasks);
    })
    .catch(() => {});
}

/**
 * Renders tasks onto the board by iterating over each task object.
 * @param {Object} tasks - An object containing all task details.
 */

function renderTasks(tasks) {
  for (let taskId in tasks) {
    const task = tasks[taskId];
    if (!task || typeof task !== "object" || !task.title) {
      continue;
    }
    addTaskToBoard(task);
  }
  checkAllColumnsForTasks();
  enableDragAndDrop();
}

/**
 * Fetches and renders tasks onto the board columns.
 */

function renderTasksOnBoard() {
  fetchTasks((tasks) => {
    document.querySelectorAll(".board-column").forEach((column) => {
      const columnType = column.getAttribute("data-type");
      const tasksContainer = column.querySelector(".tasks-container");
      tasksContainer.innerHTML = "";
      Object.values(tasks)
        .filter((task) => task.type === columnType)
        .forEach((task) => {
          const taskCard = createTaskCard(task);
          tasksContainer.appendChild(taskCard);
        });
      updateNoTasksMessage(column);
    });
    checkAllColumnsForTasks();
    enableDragAndDrop();
  });
}

/**
 * Loads tasks from Firebase and populates the respective board columns.
 */

function loadTasksFromFirebase() {
  const tasksRef = firebase.database().ref("tasks");
  tasksRef.once("value", (snapshot) => {
    const tasks = snapshot.val();
    Object.values(tasks).forEach((task) => {
      const column = document.querySelector(
        `.board-column[data-type="${task.type}"] .tasks-container`
      );
      if (column) {
        const taskCard = createTaskCard(task);
        column.appendChild(taskCard);
      }
    });
    enableDragAndDrop();
  });
}

/**
 * Updates the "No Tasks" message in a column based on the number of tasks present.
 * @param {HTMLElement} column - The board column to check.
 */

function updateNoTasksMessage(column) {
  const tasksContainer = column.querySelector(".tasks-container");
  const noTasksMessage = column.querySelector(".no-tasks");

  if (tasksContainer && noTasksMessage) {
    const visibleTasks = tasksContainer.querySelectorAll(".task-card");
    noTasksMessage.style.display = visibleTasks.length ? "none" : "block";
  } else {
  }
}

/**
 * Creates the HTML structure for the list of assigned users in a task.
 * @param {Object} task - The task object containing member details.
 * @returns {string} The HTML string of assigned members.
 */

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

/**
 * Opens the modal for editing a task and populates it with the current task's data.
 */

function openEditTaskModal() {
  if (currentTask) {
    isEditMode = true;
    currentTaskId = currentTask.id;
    populateEditTaskForm(currentTask);
    document.getElementById("addTaskModal").style.display = "block";
  }
}

/**
 * Collects the subtasks data from the edit modal inputs.
 * @returns {Array} An array of subtask objects with title and completion status.
 */

function collectSubtasksData() {
  const subtasks = [];
  document.querySelectorAll(".edit-subtask").forEach((subtaskElement) => {
    subtasks.push({
      title: subtaskElement.querySelector(".subtask-title").value,
      completed: subtaskElement.querySelector(".subtask-checkbox").checked,
    });
  });
  return subtasks;
}

/**
 * Updates a task's data in Firebase and refreshes it on the board.
 * @param {string} taskId - The ID of the task to update.
 * @param {Object} updatedData - The updated task data to save in Firebase.
 */

function updateTaskInFirebase(taskId, updatedData) {
  firebase
    .database()
    .ref(`/tasks/${taskId}`)
    .update(updatedData)
    .then(() => {
      tasksMap[taskId] = { ...tasksMap[taskId], ...updatedData };
      updateTaskOnBoard(taskId, tasksMap[taskId]);
    })
    .catch(() => {});
}

/**
 * Updates a task's representation on the board.
 * @param {string} taskId - The ID of the task.
 * @param {Object} taskData - The updated task data.
 */

function updateTaskOnBoard(taskId, taskData) {
  removeTaskFromBoard(taskId);
  taskData.id = taskId;
  addTaskToBoard(taskData);
  checkAllColumnsForTasks();
}

/**
 * Populates the edit task modal form with the details of the selected task.
 * @param {Object} task - The task object containing all details.
 */

function populateEditTaskForm(task) {
  document.getElementById("taskTitle").value = task.title || "";
  document.getElementById("taskDescription").value = task.description || "";
  document.getElementById("taskDueDate").value = task.dueDate || "";
  selectedPriority = task.priority || "Medium";
  updatePriorityButtons();
  selectedType = task.type;
  document.getElementById("taskTypeInput").value = task.category || "";
  document.getElementById("secondDropdownSelectedText").textContent =
    task.category || "Select a category";
  selectedMembers = task.members || [];
  updateSelectedMembers();
  subtasksArray = task.subtasks || [];
  updateSubtasksList();
  const actionButton = document.getElementById("createTaskButton");
  actionButton.textContent = "Edit Task";
}

/**
 * Closes the task details modal.
 */

function closeTaskDetailsModal() {
  document.getElementById("taskDetailsModal").style.display = "none";
}

/**
 * Deletes the currently selected task from Firebase and the board.
 */

function deleteCurrentTask() {
  if (currentTaskId) {
    deleteTaskFromFirebase(currentTaskId)
      .then(() => {
        removeTaskFromBoard(currentTaskId);
        closeTaskDetailsModal();
      })
      .catch(() => {});
  }
}

/**
 * Deletes a task from Firebase.
 * @param {string} taskId - The ID of the task to delete.
 * @returns {Promise<void>} A promise resolving when the task is deleted.
 */

function deleteTaskFromFirebase(taskId) {
  return firebase
    .database()
    .ref("/tasks/" + taskId)
    .remove();
}

/**
 * Removes a task from the board.
 * @param {string} taskId - The ID of the task to remove.
 */

function removeTaskFromBoard(taskId) {
  const taskCard = document.querySelector(`.task-card[data-id="${taskId}"]`);
  if (taskCard) {
    const tasksContainer = taskCard.parentElement;
    taskCard.remove();
    updateNoTasksMessage(tasksContainer.closest(".board-column"));
  }
}

/**
 * Resets the "Add Task" form inputs and states.
 */

function resetAddTaskForm() {
  document.getElementById("addTaskForm").reset();
  selectedMembers = [];
  updateSelectedMembers();
}

/**
 * Fetches contacts from Firebase and executes a callback with the results.
 * @param {Function} callback - The callback function to process the fetched contacts.
 */

function fetchContacts(callback) {
  firebase
    .database()
    .ref("/contacts/")
    .once("value")
    .then((snapshot) => {
      const contacts = snapshot.val();
      callback(contacts);
    })
    .catch(() => {});
}

/**
 * Fügt einen Klick-Listener hinzu, um das Dropdown-Menü zu öffnen oder zu schließen.
 *
 * @param {HTMLElement} dropdown - Das Dropdown-Element.
 * @param {HTMLElement} optionsContainer - Der Container mit den Optionen.
 */

function setupDropdownTrigger(dropdown, optionsContainer) {
    const dropdownTrigger = dropdown.querySelector(".dropdown-placeholder");
    dropdownTrigger.addEventListener("click", (event) => {
      event.stopPropagation();
      const isOpen = dropdown.classList.toggle("open");
      optionsContainer.classList.toggle("hidden", !isOpen);
    });
    document.addEventListener("click", (event) => {
      if (!dropdown.contains(event.target)) {
        optionsContainer.classList.add("hidden");
        dropdown.classList.remove("open");
      }
    });
}
  
/**
   * Fügt eine Suchfunktion für das Dropdown-Menü hinzu.
   *
   * @param {HTMLElement} searchInput - Das Eingabefeld für die Suche.
   * @param {HTMLElement} optionsContainer - Der Container mit den Optionen.
   */
  
  function setupDropdownSearch(searchInput, optionsContainer) {
    searchInput.addEventListener("input", () => {
      const searchTerm = searchInput.value.toLowerCase();
      const options = optionsContainer.querySelectorAll(".dropdown-option");
      options.forEach((option) => {
        const contactName = option.dataset.value.toLowerCase();
        option.style.display = contactName.includes(searchTerm)
          ? "block"
          : "none";
      });
    });
}
  
/**
   * Ruft Kontakte ab und befüllt das Dropdown-Menü.
   *
   * @param {Function} fetchContacts - Funktion, um Kontakte abzurufen.
   */
  
function setupContactsDropdown(fetchContacts) {
    fetchContacts((contacts) => {
      populateContactsDropdown(contacts);
    });
}
  
  /**
   * Initialisiert das Dropdown-Menü mit Suchfunktion und Kontakten.
   */
  
  function setupDropdownSearchInline() {
    const dropdown = document.getElementById("taskAssignedDropdown");
    const optionsContainer = document.getElementById("taskAssignedOptions");
    const searchInput = document.getElementById("taskSearchInput");
    if (!dropdown || !optionsContainer || !searchInput) {
      return;
    }
    setupDropdownTrigger(dropdown, optionsContainer);
    setupDropdownSearch(searchInput, optionsContainer);
    setupContactsDropdown(fetchContacts);
}

/**
 * Toggles the selection of a contact in the dropdown.
 * @param {HTMLElement} option - The dropdown option element.
 * @param {string} initials - The contact's initials.
 * @param {string} color - The color associated with the contact.
 * @param {HTMLElement} selectedContainer - The container for selected contacts.
 */

function toggleContactSelection(option, initials, color, selectedContainer) {
  const contactName = option.dataset.value;
  const selectIcon = option.querySelector(".select-icon");
  const selectedIcon = option.querySelector(".selected-icon");
  if (!selectIcon || !selectedIcon) {
    return;
  }
  const isSelected = option.classList.contains("selected");
  if (isSelected) {
    deselectContact(option,initials,selectedContainer,contactName,selectIcon,selectedIcon);
  } else {
    selectContact(option,initials,color,selectedContainer,contactName,selectIcon,selectedIcon);
  }
  assignedToUserCounter();
}

/**
 * Deselects a contact from the dropdown and updates the UI accordingly.
 * @param {HTMLElement} option - The dropdown option element representing the contact.
 * @param {string} initials - The initials of the contact to deselect.
 * @param {HTMLElement} selectedContainer - The container where selected contacts are displayed.
 * @param {string} contactName - The name of the contact to deselect.
 * @param {HTMLElement} selectIcon - The icon element representing the unselected state.
 * @param {HTMLElement} selectedIcon - The icon element representing the selected state.
 */

function deselectContact(
  option,
  initials,
  selectedContainer,
  contactName,
  selectIcon,
  selectedIcon
) {
  option.classList.remove("selected");
  option.style.backgroundColor = "";
  option.style.color = "";
  removeInitialFromSelected(initials, selectedContainer);
  selectedMembers = selectedMembers.filter((member) => member !== contactName);

  toggleIcons(selectIcon, selectedIcon, false);
}

/**
 * Toggles the visibility of select and selected icons based on the selection state.
 * @param {HTMLElement} selectIcon - The icon element representing the unselected state.
 * @param {HTMLElement} selectedIcon - The icon element representing the selected state.
 * @param {boolean} isSelected - Indicates whether the contact is selected (`true`) or not (`false`).
 */

function toggleIcons(selectIcon, selectedIcon, isSelected) {
  if (isSelected) {
    selectIcon.classList.remove("icon-visible");
    selectIcon.classList.add("icon-hidden");
    selectedIcon.classList.remove("icon-hidden");
    selectedIcon.classList.add("icon-visible");
  } else {
    selectIcon.classList.remove("icon-hidden");
    selectIcon.classList.add("icon-visible");
    selectedIcon.classList.remove("icon-visible");
    selectedIcon.classList.add("icon-hidden");
  }
}

/**
 * Adds a contact's initials to the selected container with the specified background color.
 * @param {string} initials - The initials of the contact to add.
 * @param {string} color - The background color associated with the contact.
 * @param {HTMLElement} selectedContainer - The container where selected contacts are displayed.
 */

function addInitialToSelected(initials, color, selectedContainer) {
  const span = document.createElement("span");
  span.className = "selected-contact-initials";
  span.textContent = initials;
  span.style.backgroundColor = color;
  selectedContainer.appendChild(span);
}

/**
 * Removes a contact's initials from the selected container.
 * @param {string} initials - The initials of the contact to remove.
 * @param {HTMLElement} selectedContainer - The container where selected contacts are displayed.
 */

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

/**
 * Filters tasks on the board based on the search input value.
 */

function filterTasks() {
  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    document.querySelectorAll(".task-card").forEach((task) => {
      const title = task.querySelector("h3").textContent.toLowerCase();
      const description = task.querySelector("p")?.textContent.toLowerCase() || "";
      const matches = title.includes(searchTerm) || description.includes(searchTerm);
      task.style.display = matches ? "block" : "none";
    });
    document.querySelectorAll(".board-column").forEach((column) => {
      const tasksContainer = column.querySelector(".tasks-container");
      const noTasksMessage = column.querySelector(".no-tasks");
      const visibleTasks = tasksContainer.querySelectorAll(".task-card:not([style*='display: none'])");
      noTasksMessage.style.display = visibleTasks.length ? "none" : "block";
    });
  });
}
filterTasks();

/**
 * Saves a task to Firebase and updates the board.
 * @param {Object} task - The task object to save.
 */

function saveTaskToFirebase(task) {
  const taskId = firebase.database().ref("/tasks").push().key;
  task.id = taskId;
  firebase
    .database()
    .ref(`/tasks/${taskId}`)
    .set(task)
    .then(() => {
      console.log("Task successfully saved!");
      updateTaskOnBoard(taskId, task);
    })
    .catch((error) => console.error("Error saving task:", error));
}

/**
 * Updates the appearance of priority buttons based on the selected priority.
 */

function updatePriorityButtons() {
  document.querySelectorAll(".priority-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.priority === selectedPriority);
    const icon = btn.querySelector(".priority-icon");
    if (icon) {
      icon.style.filter =
        btn.dataset.priority === selectedPriority
          ? "brightness(0) invert(1)"
          : "none";
    }
  });
}

/**
 * Sets up event listeners for selecting contacts in the dropdown.
 */

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

/**
 * Selects a contact from the dropdown and updates the UI accordingly.
 * @param {HTMLElement} option - The dropdown option element representing the contact.
 * @param {string} initials - The initials of the selected contact.
 * @param {string} color - The background color associated with the selected contact.
 * @param {HTMLElement} selectedContainer - The container where selected contacts are displayed.
 * @param {string} contactName - The name of the selected contact.
 * @param {HTMLElement} selectIcon - The icon element representing the unselected state.
 * @param {HTMLElement} selectedIcon - The icon element representing the selected state.
 */

function selectContact(option,initials,color,selectedContainer,contactName,selectIcon,selectedIcon) {
  option.classList.add("selected");
  option.style.backgroundColor = "#091931";
  option.style.color = "white";
  addInitialToSelected(initials, color, selectedContainer);
  if (!selectedMembers.includes(contactName)) {
    selectedMembers.push(contactName);
  }
  toggleIcons(selectIcon, selectedIcon, true);
}

/**
 * Updates the UI to display the currently selected members.
 */

function updateSelectedMembers() {
    const selectedContainer = document.getElementById(
      "selectedContactsContainer"
    );
    selectedContainer.innerHTML = "";
    const maxVisibleContacts = 4;
    selectedMembers.slice(0, maxVisibleContacts).forEach((member) => {
      const initials = getInitials(member);
      const color = getColorForContact(member);
      const span = document.createElement("span");
      span.className = "selected-contact-initials";
      span.textContent = initials;
      span.style.backgroundColor = color;
      selectedContainer.appendChild(span);
    });
}
  fetchContacts((contacts) => {
    populateContactsDropdown(Object.values(contacts));
  });
  
/**
   * Adds a "more" indicator to the selected contacts container if the total number of selected contacts exceeds the maximum visible limit.
   *
   * @param {number} totalSelected - The total number of selected contacts.
   * @param {number} maxVisibleContacts - The maximum number of contacts to display without showing the "more" indicator.
   * @param {HTMLElement} selectedContainer - The container element where selected contacts are displayed.
   */

function addMoreIndicator(
    totalSelected,
    maxVisibleContacts,
    selectedContainer
  ) {
    if (totalSelected > maxVisibleContacts) {
      const remainingCount = totalSelected - maxVisibleContacts;
      const moreSpan = document.createElement("span");
      moreSpan.className = "selected-contact-more";
      moreSpan.textContent = `+${remainingCount}`;
      moreSpan.style.backgroundColor = "#ccc";
      selectedContainer.appendChild(moreSpan);
    }
}
