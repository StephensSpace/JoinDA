// Drag starten
function startDragging(event, taskCard) {
  currentDraggedTask = {
    id: taskCard.dataset.id,
    category: taskCard.dataset.category,
  };
  event.dataTransfer.setData("text/plain", taskCard.dataset.id); // Task-ID speichern
}

function dropTask(event, newCategory) {
  event.preventDefault();
  const taskId = event.dataTransfer.getData("text/plain");
  const taskCard = document.querySelector(`.task-card[data-id="${taskId}"]`);
  if (taskCard) {
    const task = { ...currentDraggedTask, category: newCategory }; // Kategorie aktualisieren
    saveTaskToFirebase(task); // Aktualisiere Firebase
    renderTasksOnBoard(); // Aktualisiere das Board
  }
}

function enableDragAndDrop() {
  document.querySelectorAll(".task-card").forEach((task) => {
    task.setAttribute("draggable", "true");
    task.addEventListener("dragstart", () => {
      draggedTask = task;
    });
    task.addEventListener("dragend", () => {
      draggedTask = null;
    });
  });

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
        tasksContainer.appendChild(draggedTask); // Task verschieben
        const newCategory = column.getAttribute("data-status");
        const taskId = draggedTask.dataset.id;

        // Firebase-Update für die neue Kategorie
        updateTaskCategoryInFirebase(taskId, newCategory);

        // Aktualisiere "No tasks"-Nachricht für beide Spalten
        updateNoTasksMessage(column);

        const previousCategory = draggedTask.dataset.category;
        const previousColumn = document.querySelector(
          `.board-column[data-status="${previousCategory}"]`
        );
        if (previousColumn) {
          updateNoTasksMessage(previousColumn);
        }

        // Aktualisiere die Kategorie der Task
        draggedTask.dataset.category = newCategory;
      }
    });
  });
}

function updateTaskCategoryInFirebase(taskId, newCategory) {
  firebase
    .database()
    .ref(`/tasks/${taskId}`)
    .update({ category: newCategory })
    .then(() => {
      console.log(`Task ${taskId} verschoben nach ${newCategory}`);
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
        currentTask.subtasks[subtaskIndex].completed = event.target.checked;

        updateTaskProgressOnBoard(currentTaskId, currentTask);
      }
    });
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

function updateSubtaskProgress(taskId) {
  const taskCard = document.querySelector(`.task-card[data-id="${taskId}"]`);
  if (!taskCard) {
    console.error("Task card not found for ID:", taskId);
    return;
  }

  const progressBarInner = taskCard.querySelector(".progress-bar-inner");
  const progressText = taskCard.querySelector(".progress span");

  // Calculate progress based on subtasks
  const totalSubtasks = currentTask.subtasks.length;
  const completedSubtasks = currentTask.subtasks.filter(
    (st) => st.completed
  ).length;
  const progressPercent =
    totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  if (progressBarInner) {
    progressBarInner.style.width = `${progressPercent}%`; // Fill the bar based on progress
    console.log("Progress bar inner updated:", progressPercent + "%");
  }

  if (progressText) {
    progressText.innerText = `${completedSubtasks}/${totalSubtasks} Subtasks`;
    console.log(
      "Progress text updated:",
      `${completedSubtasks}/${totalSubtasks}`
    );
  }
}

function attachSubtaskProgressListener(task) {
  document
    .getElementById("taskSubtasks")
    .addEventListener("change", (event) => {
      if (event.target.type === "checkbox") {
        const subtaskIndex = event.target.dataset.index;
        task.subtasks[subtaskIndex].completed = event.target.checked;

        // Update the progress on the board card
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
      }
    });
}

function setupSubtaskCheckboxListener() {
  const subtaskContainer = document.getElementById("taskSubtasks");
  subtaskContainer.addEventListener("change", (event) => {
    if (event.target.type === "checkbox") {
      const subtaskIndex = [
        ...event.target.parentElement.parentElement.children,
      ].indexOf(event.target.parentElement);
      currentTask.subtasks[subtaskIndex].completed = event.target.checked;

      // Update progress bar for the task
      updateSubtaskProgress(currentTask.id);

      // Optionally save changes to the backend (e.g., Firebase)
      saveTaskToFirebase(currentTask);
    }
  });
}
