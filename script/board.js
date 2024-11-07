document.addEventListener("DOMContentLoaded", () => {
  const taskCards = document.querySelectorAll(".task-card");
  const columns = document.querySelectorAll(".board-column");
  const taskDetailsModal = document.getElementById("taskDetailsModal");
  const addTaskModal = document.getElementById("addTaskModal");
  const taskContent = document.getElementById("taskContent");
  const addTaskButton = document.getElementById("addTaskButton");
  const addTaskForm = document.getElementById("addTaskForm");

  // Drag and Drop
  let draggedTask = null;

  taskCards.forEach((task) => {
    task.addEventListener("dragstart", (e) => {
      draggedTask = task;
      e.dataTransfer.setData("text/plain", task.dataset.task);
    });
  });

  columns.forEach((column) => {
    column.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    column.addEventListener("drop", (e) => {
      e.preventDefault();
      if (draggedTask) {
        column.appendChild(draggedTask);
        draggedTask = null;
      }
    });
  });

  // Task Details Modal
  taskCards.forEach((task) => {
    task.addEventListener("click", () => {
      taskContent.textContent = task.dataset.task;
      taskDetailsModal.style.display = "block";
    });
  });

  // Close Modals
  document.querySelectorAll(".close-button").forEach((btn) => {
    btn.addEventListener("click", () => {
      taskDetailsModal.style.display = "none";
      addTaskModal.style.display = "none";
    });
  });

  // Add Task Modal
  addTaskButton.addEventListener("click", () => {
    addTaskModal.style.display = "block";
  });

  // Submit Add Task Form
  addTaskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("taskTitle").value;
    const description = document.getElementById("taskDescription").value;

    const newTask = document.createElement("div");
    newTask.classList.add("task-card");
    newTask.setAttribute("draggable", "true");
    newTask.dataset.task = `${title}: ${description}`;
    newTask.textContent = title;

    // Add new task to "To do" column
    document.querySelector('[data-status="todo"]').appendChild(newTask);

    // Reset form and close modal
    addTaskForm.reset();
    addTaskModal.style.display = "none";

    // Make new task draggable and clickable
    newTask.addEventListener("dragstart", (e) => {
      draggedTask = newTask;
      e.dataTransfer.setData("text/plain", newTask.dataset.task);
    });
    newTask.addEventListener("click", () => {
      taskContent.textContent = newTask.dataset.task;
      taskDetailsModal.style.display = "block";
    });
  });
});
