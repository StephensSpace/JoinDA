/**
 * Initializes the drag event for a task card and sets its data.
 * @param {DragEvent} event - The dragstart event triggered by the task card.
 * @param {HTMLElement} taskCard - The task card being dragged.
 */

function startDragging(event, taskCard) {
  currentDraggedTask = {
    id: taskCard.dataset.id,
    type: taskCard.dataset.type,
  };
  event.dataTransfer.setData("text/plain", taskCard.dataset.id);
}

/**
 * Updates the type (column) of a task in Firebase.
 * @param {string} taskId - The ID of the task to update.
 * @param {string} newType - The new type (column) for the task.
 */

function updateTaskTypeInFirebase(taskId, newType) {
  if (!taskId || !newType) {
    return;
  }
  firebase
    .database()
    .ref(`/tasks/${taskId}`)
    .update({ type: newType })
    .then(() => {
      checkAllColumnsForTasks();
    })
    .catch(() => {
    });
}

/**
 * Enables drag-and-drop functionality for all task cards and sets up drop zones.
 */

function enableDragAndDrop() {
  const taskCards = document.querySelectorAll(".task-card");
  taskCards.forEach((card) => {
    card.setAttribute("draggable", "true");
    card.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", card.dataset.id);
      currentDraggedTask = card;
    });
    card.addEventListener("dragend", () => {
      currentDraggedTask = null;
    });
  });
  dropZones();
}

/**
 * Sets up drop zones for columns and attaches dragover, dragleave, and drop event listeners.
 */

function dropZones() {
  const dropZones = document.querySelectorAll(".board-column");
  dropZones.forEach((zone) => {
    zone.addEventListener("dragover", (event) => {
      event.preventDefault();
      zone.classList.add("drag-over");
    });
    zone.addEventListener("dragleave", () => {
      zone.classList.remove("drag-over");
    });
    zone.addEventListener("drop", (event) => {
      event.preventDefault();
      zone.classList.remove("drag-over");
      handleDrop(event, zone);
    });
  });
}

/**
 * Handles the start of a drag event for a task card.
 * @param {DragEvent} event - The dragstart event.
 */

function handleDragStart(event) {
  event.dataTransfer.setData("text/plain", event.target.dataset.id);
  currentDraggedTask = event.target;
}

/**
 * Handles the end of a drag event by resetting the dragged task.
 */

function handleDragEnd() {
  currentDraggedTask = null;
}

/**
 * Allows a drop event to occur on a valid drop zone.
 * @param {DragEvent} event - The dragover event.
 */

function allowDrop(event) {
  event.preventDefault();
}

/**
 * Handles the drop event, moves the task to the new column, and updates Firebase.
 * @param {DragEvent} event - The drop event.
 * @param {HTMLElement} zone - The drop zone element.
 */

function handleDrop(event, zone) {
  event.preventDefault();
  const draggedTaskId = event.dataTransfer.getData("text/plain");
  const newType = zone.getAttribute("data-type");
  if (!draggedTaskId || !newType) {
    return;
  }
  const draggedTask = document.querySelector(`.task-card[data-id="${draggedTaskId}"]`);
  if (!draggedTask) {
    return;
  }
  zone.querySelector(".tasks-container").appendChild(draggedTask);
  updateTaskTypeInFirebase(draggedTaskId, newType);
  renderTasksOnBoard();
  checkAllColumnsForTasks();
}

/**
 * Checks all board columns for tasks and toggles the "No Tasks" message accordingly.
 */

function checkAllColumnsForTasks() {
  const columns = document.querySelectorAll(".board-column");
  columns.forEach((column) => {
    const tasksContainer = column.querySelector(".tasks-container");
    const noTasksMessage = column.querySelector(".no-tasks");

    if (!tasksContainer || !noTasksMessage) {
      return;
    }
    if (tasksContainer.children.length > 0) {
      noTasksMessage.style.display = "none";
    } else {
      noTasksMessage.style.display = "block";
    }
  });
}

/**
 * Sets up a listener for subtask progress updates and handles checkbox changes.
 */

function handleSubtaskProgressUpdate() {
  document
    .getElementById("taskSubtasks")
    .addEventListener("change", (event) => {
      if (event.target.type === "checkbox") {
        const subtaskIndex = [
          ...event.target.parentElement.parentElement.children,
        ].indexOf(event.target.parentElement);
        handleSubtaskCompletion(
          currentTaskId,
          subtaskIndex,
          event.target.checked
        );
      }
    });
}

/**
 * Updates the completion status of a subtask in Firebase and on the board.
 * @param {string} taskId - The ID of the task containing the subtask.
 * @param {number} subtaskIndex - The index of the subtask in the task's subtasks array.
 * @param {boolean} completed - Whether the subtask is completed.
 */

function handleSubtaskCompletion(taskId, subtaskIndex, completed) {
  const task = tasksMap[taskId];
  if (!task || !Array.isArray(task.subtasks)) {
    return;
  }
  if (task.subtasks[subtaskIndex]) {
    task.subtasks[subtaskIndex].completed = completed;
    updateSubtaskInFirebase(taskId, subtaskIndex, completed);
    updateTaskProgressOnBoard(taskId, task);
  } else {
  }
}

/**
 * Updates the progress of a task based on its completed subtasks and updates the board UI.
 * @param {Object} task - The task object containing subtasks.
 */

function updateTaskProgress(task) {
  const taskCard = document.querySelector(`.task-card[data-id="${task.id}"]`);
  if (!taskCard) return;
  const totalSubtasks = task.subtasks.length;
  const completedSubtasks = task.subtasks.filter((st) => st.completed).length;
  const progressPercent =
    totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;
  const progressBar = taskCard.querySelector(".progress-bar");
  const progressText = taskCard.querySelector(".progress-container span");
  if (progressBar) progressBar.style.width = `${progressPercent}%`;
  if (progressText)
    progressText.textContent = `${completedSubtasks}/${totalSubtasks} Subtasks`;
}

/**
 * Updates the subtask progress in the progress bar and text on the board UI.
 * @param {Object} task - The task object containing subtasks.
 */

function updateSubtaskProgress(task) {
  const totalSubtasks = task.subtasks.length;
  const completedSubtasks = task.subtasks.filter((st) => st.completed).length;
  const progressPercent =
    totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;
  const progressBar = document.querySelector(".progress-bar");
  const progressText = document.querySelector(".progress-text span");
  if (progressBar) progressBar.style.width = `${progressPercent}%`;
  if (progressText)
    progressText.textContent = `${completedSubtasks}/${totalSubtasks} Subtasks`;
}

/**
 * Updates the progress bar and progress text for a specific task on the board.
 * @param {Object} task - The task object containing subtasks.
 * @param {number} progressPercent - The progress percentage to display (0–100).
 * @param {number} completedSubtasks - The number of completed subtasks.
 * @param {number} totalSubtasks - The total number of subtasks in the task.
 */

function progressPercent() {
  const taskCard = document.querySelector(`.task-card[data-id="${task.id}"]`);
  if (taskCard) {
    const cardProgressBar = taskCard.querySelector(".progress-bar");
    const cardProgressText = taskCard.querySelector(".progress-text span");
    if (cardProgressBar) cardProgressBar.style.width = `${progressPercent}%`;
    if (cardProgressText)
      cardProgressText.textContent = `${completedSubtasks}/${totalSubtasks} Subtasks`;
  }
}

/**
 * Attaches a listener for subtask checkbox changes to update the progress.
 * @param {Object} task - The task object containing subtasks.
 */

function attachSubtaskProgressListener(task) {
  const subtasksContainer = document.getElementById("taskSubtasks");
  subtasksContainer.addEventListener("change", (event) => {
    if (event.target.type === "checkbox") {
      const subtaskIndex = parseInt(event.target.dataset.index, 10);
      task.subtasks[subtaskIndex].completed = event.target.checked;
      updateSubtaskProgress(task);
    }
  });
  progressBar();
}

/**
 * Updates the progress bar and progress text for a task on the board.
 * @param {Object} task - The task object containing subtasks.
 */

function progressBar() {
  const taskCard = document.querySelector(`.task-card[data-id="${task.id}"]`);
  if (taskCard) {
    const totalSubtasks = task.subtasks.length;
    const completedSubtasks = task.subtasks.filter((st) => st.completed).length;
    const progressBar = taskCard.querySelector(".progress-bar");
    const progressText = taskCard.querySelector(".progress span");
    if (progressBar) {
      progressBar.style.width = `${(completedSubtasks / totalSubtasks) * 100}%`;
    }
    if (progressText) {
      progressText.innerText = `${completedSubtasks}/${totalSubtasks} Subtasks`;
    }
  }
}

/**
 * Sets up a listener for subtask checkboxes and updates their progress on change.
 * @param {Object} task - The task object containing subtasks.
 */

function setupSubtaskCheckboxListener(task) {
  const subtaskContainer = document.getElementById("taskSubtasks");
  if (!subtaskContainer) return;
  subtaskContainer.addEventListener("change", (event) => {
    if (event.target.type === "checkbox") {
      const subtaskIndex = parseInt(event.target.dataset.index, 10);
      task.subtasks[subtaskIndex].completed = event.target.checked;
      updateSubtaskInFirebase(task.id, subtaskIndex, task.subtasks[subtaskIndex].completed);
      updateTaskProgress(task);
      updateTaskOnBoard(task.id, task);
    }
  });
}

