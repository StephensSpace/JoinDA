function startDragging(event, taskCard) {
  currentDraggedTask = {
    id: taskCard.dataset.id,
    type: taskCard.dataset.type,
  };
  event.dataTransfer.setData("text/plain", taskCard.dataset.id);
}

function onTaskDrop(event, taskId, newType) {
  event.preventDefault();
  updateTaskTypeInFirebase(taskId, newType);
  const taskCard = document.querySelector(`.task-card[data-id="${taskId}"]`);
  const newColumn = document.querySelector(
    `.board-column[data-type="${newType}"] .tasks-container`
  );
  newColumn.appendChild(taskCard);
}

function updateTaskTypeInFirebase(taskId, newType) {
  const taskRef = firebase.database().ref(`/tasks/${taskId}`);
  taskRef
    .update({ type: newType })
    .then(() => {
      console.log(
        `Task ${taskId} erfolgreich aktualisiert: Typ ist jetzt ${newType}.`
      );
    })
    .catch((error) => {
      console.error(
        `Fehler beim Aktualisieren des Task-Typs für ${taskId}:`,
        error
      );
    });
}

function enableDragAndDrop() {
  const taskCards = document.querySelectorAll(".task-card");
  const dropZones = document.querySelectorAll(".board-column");
  taskCards.forEach((card) => {
    card.setAttribute("draggable", "true");
    card.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", card.dataset.id);
      currentDraggedTask = card;
      console.log("Task gestartet:", card.dataset.id);
    });
    card.addEventListener("dragend", () => {
      currentDraggedTask = null;
      console.log("Drag beendet.");
    });
  });
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

function handleDragStart(event) {
  console.log("Drag gestartet: ", event.target.dataset.id);
  event.dataTransfer.setData("text/plain", event.target.dataset.id);
  currentDraggedTask = event.target;
}

function handleDragEnd() {
  currentDraggedTask = null;
}

function allowDrop(event) {
  event.preventDefault();
}

function handleDrop(event, zone) {
  event.preventDefault();
  const draggedTaskId = event.dataTransfer.getData("text/plain");
  const newStatus = zone.getAttribute("data-status");
  if (!draggedTaskId) {
    return;
  }
  const draggedTask = document.querySelector(
    `.task-card[data-id="${draggedTaskId}"]`
  );
  if (!draggedTask) {
    return;
  }
  zone.querySelector(".tasks-container").appendChild(draggedTask);
  if (typeof updateTaskTypeInFirebase === "function") {
    updateTaskTypeInFirebase(draggedTaskId, newStatus);
  }
  checkAllColumnsForTasks();
}

function checkAllColumnsForTasks() {
  const columns = document.querySelectorAll(".board-column");
  columns.forEach((column) => updateNoTasksMessage(column));
}

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

function handleSubtaskCompletion(taskId, subtaskIndex, completed) {
  const task = tasksMap[taskId];
  if (!task || !Array.isArray(task.subtasks)) {
    console.error("Task oder Subtasks nicht gefunden:", taskId);
    return;
  }
  if (task.subtasks[subtaskIndex]) {
    task.subtasks[subtaskIndex].completed = completed;
    updateSubtaskInFirebase(taskId, subtaskIndex, completed);
    updateTaskProgressOnBoard(taskId, task);
  } else {
    console.error("Subtask nicht gefunden:", subtaskIndex);
  }
}

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
  const taskCard = document.querySelector(`.task-card[data-id="${task.id}"]`);
  if (taskCard) {
    const cardProgressBar = taskCard.querySelector(".progress-bar");
    const cardProgressText = taskCard.querySelector(".progress-text span");
    if (cardProgressBar) cardProgressBar.style.width = `${progressPercent}%`;
    if (cardProgressText)
      cardProgressText.textContent = `${completedSubtasks}/${totalSubtasks} Subtasks`;
  }
}

function attachSubtaskProgressListener(task) {
  const subtasksContainer = document.getElementById("taskSubtasks");
  subtasksContainer.addEventListener("change", (event) => {
    if (event.target.type === "checkbox") {
      const subtaskIndex = parseInt(event.target.dataset.index, 10);
      task.subtasks[subtaskIndex].completed = event.target.checked;
      const taskCard = document.querySelector(
        `.task-card[data-id="${task.id}"]`
      );
      if (taskCard) {
        const totalSubtasks = task.subtasks.length;
        const completedSubtasks = task.subtasks.filter(
          (st) => st.completed
        ).length;
        const progressBar = taskCard.querySelector(".progress-bar");
        const progressText = taskCard.querySelector(".progress span");
        if (progressBar) {
          progressBar.style.width = `${
            (completedSubtasks / totalSubtasks) * 100
          }%`;
        }
        if (progressText) {
          progressText.innerText = `${completedSubtasks}/${totalSubtasks} Subtasks`;
        }
      }
      updateSubtaskProgress(task);
    }
  });
}

function setupSubtaskCheckboxListener() {
  const subtaskContainer = document.getElementById("taskSubtasks");
  subtaskContainer.addEventListener("change", (event) => {
    if (event.target.type === "checkbox") {
      const subtaskIndex = event.target.dataset.index;
      currentTask.subtasks[subtaskIndex].completed = event.target.checked;
      updateSubtaskProgress(currentTask.id);
      renderTaskSubtasks(currentTask);
      saveTaskToFirebase(currentTask);
    }
  });
}
