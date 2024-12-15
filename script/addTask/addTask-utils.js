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
  if (!taskId || subtaskIndex === undefined || completed === undefined) {
    console.error("Ungültige Parameter für Subtask-Update:", {
      taskId,
      subtaskIndex,
      completed,
    });
    return;
  }
  firebase
    .database()
    .ref(`/tasks/${taskId}/subtasks/${subtaskIndex}`)
    .update({ completed })
    .catch((error) =>
      console.error("Fehler beim Aktualisieren der Subtask:", error)
    );
}