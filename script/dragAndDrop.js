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
