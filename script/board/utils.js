function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

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

function updateSubtaskInFirebase(taskId, subtaskIndex, completed) {
  firebase
    .database()
    .ref(`/tasks/${taskId}/subtasks/${subtaskIndex}`)
    .update({ completed })
    .then(() => {
      console.log("Subtask erfolgreich aktualisiert.");
    })
    .catch((error) => {
      console.error(
        "Fehler beim Aktualisieren der Subtask in Firebase:",
        error
      );
    });
}