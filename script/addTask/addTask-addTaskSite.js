/**
 * Saves a task to Firebase and assigns it a unique ID.
 * Redirects to the "board.html" page upon successful save.
 * @param {Object} task - The task object containing all task details.
 */

function saveTaskToFirebase(task) {
  const newTaskRef = firebase.database().ref("/tasks/").push();
  task.id = newTaskRef.key;

  if (!task.category || task.category.trim() === "") {
    return;
  }

  newTaskRef
    .set(task)
    .then(() => {
      window.location.href = "board.html";
    })
}

/**
 * Adds a subtask with the given title to the subtasks array and updates the UI.
 * @param {string} title - The title of the subtask to add.
 */

function addSubtask(title) {
  if (title && !subtasksArray.some(subtask => subtask.title === title)) {
    subtasksArray.push({ title, completed: false });
    updateSubtasksList();
  }
}

/**
 * Updates the display of selected members in the UI.
 * Joins the selected members into a single string and displays them.
 */

function updateSelectedMembers() {
  const selectedContainer = document.getElementById(
    "selectedContactsContainer"
  );
  selectedContainer.innerHTML = selectedMembers.join(", ");
}

/**
 * Initializes the "Add Subtask" button with a click event listener.
 * Adds a subtask to the list when the button is clicked.
 */

document.addEventListener("DOMContentLoaded", () => {
  const subtaskAddButton = document.getElementById("subtaskAddButton");
  if (subtaskAddButton) {
    subtaskAddButton.addEventListener("click", () => {
      const subtaskInput = document.getElementById("subtaskInput");
      if (subtaskInput) {
        addSubtask(subtaskInput.value.trim());
        subtaskInput.value = "";
      }
    });
  }
});
