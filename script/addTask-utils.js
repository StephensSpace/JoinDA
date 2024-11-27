// utils.js

// Funktion zur Berechnung der Initialen
function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
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

// Funktion zum Abrufen der Kontakte
function fetchContacts(callback) {
  firebase
    .database()
    .ref("/contacts/")
    .once("value")
    .then((snapshot) => {
      const contacts = snapshot.val();
      callback(contacts);
    })
    .catch((error) => {
      console.error("Error fetching contacts:", error);
    });
}

// Funktion zum Befüllen des Kontakt-Dropdowns
function populateContactsDropdown(contacts) {
  const optionsContainer = document.getElementById("taskAssignedOptions");
  optionsContainer.innerHTML = ""; // Bestehende Optionen leeren

  if (!contacts) {
    optionsContainer.innerHTML =
      '<div class="no-contacts">No contacts available</div>';
    return;
  }

  Object.keys(contacts).forEach((contactId) => {
    const contact = contacts[contactId];
    const initials = getInitials(contact.name); // Initialen berechnen
    const color = getColorForContact(contact.name); // Hintergrundfarbe berechnen

    const option = document.createElement("div");
    option.className = "dropdown-option";
    option.dataset.value = contact.name;

    // Initialen und Name hinzufügen
    option.innerHTML = `
          <span class="contact-initials" style="background-color: ${color}">
            ${initials}
          </span>
          <span>${contact.name}</span>
        `;

    // Klick-Event für Auswahl
    option.addEventListener("click", () => {
      toggleContactSelection(option, initials, color);
    });

    optionsContainer.appendChild(option);
  });
}

// Funktion zur Auswahl eines Kontakts
function toggleContactSelection(option, initials, color) {
  const isSelected = option.classList.contains("selected");

  if (isSelected) {
    // Kontakt abwählen
    option.classList.remove("selected");
    option.style.backgroundColor = ""; // Hintergrundfarbe zurücksetzen
    option.style.color = ""; // Textfarbe zurücksetzen
    selectedMembers = selectedMembers.filter(
      (member) => member !== option.dataset.value
    );
    removeInitialFromSelected(initials);
  } else {
    // Kontakt auswählen
    option.classList.add("selected");
    option.style.backgroundColor = "#091931"; // Hintergrundfarbe der ausgewählten Option
    option.style.color = "white"; // Textfarbe ändern
    selectedMembers.push(option.dataset.value);
    addInitialToSelected(initials, color);
  }
}

// Initialen zum ausgewählten Bereich hinzufügen
function addInitialToSelected(initials, color) {
  const selectedContainer = document.getElementById(
    "selectedContactsContainer"
  );
  const span = document.createElement("span");
  span.className = "selected-contact-initials";
  span.textContent = initials;
  span.style.backgroundColor = color; // Gleiche Farbe wie im Dropdown
  selectedContainer.appendChild(span);
}

// Initialen aus dem ausgewählten Bereich entfernen
function removeInitialFromSelected(initials) {
  const selectedContainer = document.getElementById(
    "selectedContactsContainer"
  );
  const spans = selectedContainer.querySelectorAll(
    ".selected-contact-initials"
  );
  spans.forEach((span) => {
    if (span.textContent === initials) {
      span.remove();
    }
  });
}

// Funktion zum Aktualisieren der ausgewählten Mitglieder (falls benötigt)
function updateSelectedMembers() {
  // Diese Funktion kann angepasst oder entfernt werden, wenn sie nicht benötigt wird
}
