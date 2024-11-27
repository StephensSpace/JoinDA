function enableDragAndDrop() {
  let draggedTask = null;

  // Tasks draggable machen
  document.querySelectorAll(".task-card").forEach((task) => {
    task.setAttribute("draggable", "true");
    task.addEventListener("dragstart", () => {
      draggedTask = task;
    });
    task.addEventListener("dragend", () => {
      draggedTask = null;
    });
  });

  // Spalten als Drop-Ziele definieren
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
        const previousColumn = document.querySelector(
          `.board-column[data-status="${draggedTask.dataset.status}"]`
        );
        if (previousColumn) {
          updateNoTasksMessage(previousColumn);
        }

        // Aktualisiere den Status des Tasks
        draggedTask.dataset.status = newCategory;
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
