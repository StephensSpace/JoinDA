function redirectAddTaskButtons() {
  const addTaskButton = document.getElementById("addTaskButton");
  const columnAddButtons = document.querySelectorAll(".add-task-btn-category");

  // Funktion zur Weiterleitung
  const redirectToAddTask = () => {
    if (window.innerWidth <= 660) {
      window.location.href = "./addTask.html";
    }
  };

  // Event-Listener für den Haupt-Button
  if (addTaskButton) {
    addTaskButton.addEventListener("click", redirectToAddTask);
  }

  // Event-Listener für die + Buttons in den Spalten
  columnAddButtons.forEach((button) => {
    button.addEventListener("click", redirectToAddTask);
  });
}

// Direkt beim Laden ausführen
document.addEventListener("DOMContentLoaded", redirectAddTaskButtons);
