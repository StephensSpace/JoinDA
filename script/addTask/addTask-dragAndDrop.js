/**
 * Initializes the drag event for a task card and sets its data for transfer.
 * @param {DragEvent} event - The dragstart event triggered by the task card.
 * @param {HTMLElement} taskCard - The task card being dragged.
 */

function startDragging(event, taskCard) {
  currentDraggedTask = {
    id: taskCard.dataset.id,
  };
  event.dataTransfer.setData("text/plain", taskCard.dataset.id);
}

/**
 * Enables drag-and-drop functionality for task cards and sets up drop zones.
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
}

/**
 * Fügt Drag-and-Drop-Ereignisse zu den angegebenen Drop-Zonen hinzu.
 * @param {NodeListOf<Element>} dropZones - Die Drop-Zonen, die Drag-and-Drop unterstützen sollen.
 * @param {Function} handleDrop - Die Funktion, die beim Drop-Ereignis aufgerufen wird.
 */

function initializeDropZoneEvents(dropZones, handleDrop) {
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
const dropZones = document.querySelectorAll(".board-column");
initializeDropZoneEvents(dropZones, handleDrop);

/**
 * Handles the start of a drag event for a task card.
 * @param {DragEvent} event - The dragstart event.
 */

function handleDragStart(event) {
  event.dataTransfer.setData("text/plain", event.target.dataset.id);
  currentDraggedTask = event.target;
}

/**
 * Handles the end of a drag event by resetting the dragged task state.
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
 * Handles the drop event, moves the task to the new column, and updates its type in Firebase.
 * @param {DragEvent} event - The drop event.
 * @param {HTMLElement} zone - The drop zone where the task is dropped.
 */

function handleDrop(event, zone) {
  event.preventDefault();
  const draggedTaskId = event.dataTransfer.getData("text/plain");
  const newType = zone.getAttribute("data-type");
  if (!draggedTaskId) {
    return;
  }
  const draggedTask = document.querySelector(`.task-card[data-id="${draggedTaskId}"]`
  );
  if (!draggedTask) {
    return;
  }
  zone.querySelector(".tasks-container").appendChild(draggedTask);
  if (typeof updateTaskStatusInFirebase === "function") { updateTaskStatusInFirebase(draggedTaskId, newType);
  }
  checkAllColumnsForTasks();
}

/**
 * Checks all board columns and updates the "No Tasks" message if needed.
 */

function checkAllColumnsForTasks() {
  const columns = document.querySelectorAll(".board-column");
  columns.forEach((column) => updateNoTasksMessage(column));
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
 * Updates the completion status of a subtask in the task object and Firebase.
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
    updateTaskProgress(taskId, task);
  } else {
  }
}

/**
 * Updates the progress bar and text for a task based on its completed subtasks.
 * @param {Object} task - The task object containing subtasks.
 */

function updateTaskProgress(task) {
  const taskCard = document.querySelector(`.task-card[data-id="${task.id}"]`);
  if (!taskCard) {
    return;
  }
  const totalSubtasks = task.subtasks.length;
  const completedSubtasks = task.subtasks.filter((st) => st.completed).length;
  const progressPercent =
    totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;
  const progressBar = taskCard.querySelector(".progress-bar");
  if (progressBar) {
    progressBar.style.width = `${progressPercent}%`;
  }
  const progressText = taskCard.querySelector(".progress-text span");
  if (progressText) {
    progressText.textContent = `${completedSubtasks}/${totalSubtasks} Subtasks`;
  }
}

/**
 * Updates the progress bar and text for a specific task card.
 * @param {HTMLElement} taskCard - The task card element.
 * @param {Object} task - The task object containing subtasks.
 */

function updateSubtaskProgress(taskCard, task) {
  const totalSubtasks = task.subtasks.length;
  const completedSubtasks = task.subtasks.filter((st) => st.completed).length;
  const progressPercent = (completedSubtasks / totalSubtasks) * 100;
  const progressBar = taskCard.querySelector(".progress-bar");
  const progressText = taskCard.querySelector(".progress-text span");
  if (progressBar) {
    progressBar.style.width = `${progressPercent}%`;
  }
  if (progressText) {
    progressText.textContent = `${completedSubtasks}/${totalSubtasks} Subtasks`;
  }
}
