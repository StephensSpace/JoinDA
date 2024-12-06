// Funktion zur Speicherung der Aufgabe
function saveTaskToFirebase(task) {
  const newTaskRef = firebase.database().ref("/tasks/").push();
  task.id = newTaskRef.key;

  if (!task.category || task.category.trim() === "") {
    console.error(
      "Kategorie nicht gesetzt. Aufgabe kann nicht gespeichert werden."
    );
    return;
  }

  newTaskRef
    .set(task)
    .then(() => {
      // Nach Erstellung zur board.html navigieren
      window.location.href = "board.html";
    })
    .catch((error) => {
      console.error("Fehler beim Speichern der Aufgabe in Firebase:", error);
    });
}

// Subtask hinzufügen
function addSubtask(title) {
  if (title) {
    subtasksArray.push({ title, completed: false });
    updateSubtasksList();
  }
}

// Ausgewählte Kontakte anzeigen
function updateSelectedMembers() {
  const selectedContainer = document.getElementById(
    "selectedContactsContainer"
  );
  selectedContainer.innerHTML = selectedMembers.join(", ");
}

// Event-Listener für Subtasks hinzufügen
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
