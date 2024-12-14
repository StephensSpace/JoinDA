/**
 * Sets up click event listeners for the "Add Task" buttons to redirect to the "Add Task" page on small screens.
 * Redirects to `addTask.html` if the screen width is 660 pixels or less.
 */

function redirectAddTaskButtons() {
  const addTaskButton = document.getElementById("addTaskButton");
  const columnAddButtons = document.querySelectorAll(".add-task-btn-category");
  const redirectToAddTask = () => {
    if (window.innerWidth <= 660) {
      window.location.href = "./addTask.html";
    }
  };
  if (addTaskButton) {
    addTaskButton.addEventListener("click", redirectToAddTask);
  }
  columnAddButtons.forEach((button) => {
    button.addEventListener("click", redirectToAddTask);
  });
}
document.addEventListener("DOMContentLoaded", redirectAddTaskButtons);
