// Funktion zur Berechnung der Initialen
function getInitials(name) {
  return name
    .split(" ") // Split into words
    .map((n) => n[0]) // Get first letter of each word
    .join("") // Join them together
    .toUpperCase(); // Convert to uppercase
}

// Funktion zur Berechnung der Hintergrundfarbe basierend auf dem Namen
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
  let index = name.charCodeAt(0) % colors.length; // Basierend auf dem ersten Buchstaben
  return colors[index];
}

function getColorForMember(name) {
  let colors = ["#ff8a65", "#4db6ac", "#9575cd", "#f06292"];
  let index = name.charCodeAt(0) % colors.length;
  return colors[index];
}
