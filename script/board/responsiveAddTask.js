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
