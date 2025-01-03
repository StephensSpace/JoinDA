/**
 * Generates the initials from a given name.
 * @param {string} name - The full name of the contact.
 * @returns {string} The initials of the name in uppercase.
 */

function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

/**
 * Assigns a unique color to a contact based on their name.
 * @param {string} name - The contact's name.
 * @returns {string} The color code associated with the contact.
 */

function getColorForContact(name) {
  const colors = [
    "#FF7A00",
    "#6E52FF",
    "#9327FF",
    "#FC71FF",
    "#FFBB2B",
    "#1FD7C1",
    "#462F8A",
    "#FF4646",
    "#00BEE8",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

/**
 * Updates the completion status of a specific subtask in Firebase.
 * @param {string} taskId - The ID of the task containing the subtask.
 * @param {number} subtaskIndex - The index of the subtask in the task's subtasks array.
 * @param {boolean} completed - The new completion status of the subtask.
 */

function updateSubtaskInFirebase(taskId, subtaskIndex, completed) {
  firebase
    .database()
    .ref(`/tasks/${taskId}/subtasks/${subtaskIndex}`)
    .update({ completed })
    .then(() => {})
    .catch((error) => {
      console.error(error);
    });
}

/**
 * Fügt eine Subtask hinzu und aktualisiert die Liste, falls das Limit nicht überschritten ist.
 * @param {string} title - Titel der Subtask.
 */

function addSubtask(title) {
  const subtaskList = document.getElementById("subtaskList");
  if (subtasksArray.length >= 6 || subtaskList.children.length >= 6) {
    return;
  }
  subtasksArray.push({ title, completed: false });
  updateSubtasksList();
}
