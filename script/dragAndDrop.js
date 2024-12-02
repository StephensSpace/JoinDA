function startDragging(event, taskCard) {
  currentDraggedTask = {
    id: taskCard.dataset.id,
    category: taskCard.dataset.category,
  };
  event.dataTransfer.setData("text/plain", taskCard.dataset.id);
}

function dropTask(event, newCategory) {
  event.preventDefault();
  const taskId = event.dataTransfer.getData("text/plain");

  if (taskId) {
    updateTaskCategoryInFirebase(taskId, newCategory);
  }
}

function enableDragAndDrop() {
  document.querySelectorAll(".task-card").forEach((task) => {
    task.setAttribute("draggable", "true");
    task.addEventListener("dragstart", () => {
      draggedTask = task;
      document.querySelectorAll(".board-column").forEach((column) => {
        const tasksContainer = column.querySelector(".tasks-container");
        column.addEventListener("dragover", (e) => e.preventDefault());
        column.addEventListener("dragenter", () =>
          column.classList.add("dragover")
        );
        column.addEventListener("dragleave", () =>
          column.classList.remove("dragover")
        );
        column.addEventListener("drop", () => {
          column.classList.remove("dragover");
          if (draggedTask && tasksContainer) {
            tasksContainer.appendChild(draggedTask);
            const newCategory = column.getAttribute("data-status");
            const taskId = draggedTask.dataset.id;
            updateTaskCategoryInFirebase(taskId, newCategory);
            updateNoTasksMessage(column);
            const previousCategory = draggedTask.dataset.category;
            const previousColumn = document.querySelector(
              `.board-column[data-status="${previousCategory}"]`
            );
            if (previousColumn) {
              updateNoTasksMessage(previousColumn);
            }
            draggedTask.dataset.category = newCategory;
          }
        });
      });
    });
  });
}

function updateTaskCategoryInFirebase(taskId, newCategory) {
  firebase
    .database()
    .ref(`/tasks/${taskId}`)
    .update({ category: newCategory })
    .then(() => {
      console.log(`Task ${taskId} erfolgreich in ${newCategory} verschoben.`);
    })
    .catch((error) => {
      console.error("Fehler beim Aktualisieren der Kategorie:", error);
    });
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

function updateTaskProgressOnBoard(taskId, task) {
  const taskCard = document.querySelector(`.task-card[data-id="${taskId}"]`);
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

function updateSubtaskInFirebase(taskId, subtaskIndex, completed) {
  if (!taskId || subtaskIndex === undefined || completed === undefined) {
    console.error("Ungültige Parameter für Subtask-Update:", {
      taskId,
      subtaskIndex,
      completed,
    });
    return;
  }
  firebase
    .database()
    .ref(`/tasks/${taskId}/subtasks/${subtaskIndex}`)
    .update({ completed })
    .then(() => {
      console.log(
        `Subtask ${subtaskIndex} von Task ${taskId} erfolgreich aktualisiert.`
      );
    })
    .catch((error) => {
      console.error(
        "Fehler beim Aktualisieren der Subtask in Firebase:",
        error
      );
    });
}
