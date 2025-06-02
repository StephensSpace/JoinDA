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
  newTaskRef.set(task).then(() => {
    window.location.href = "board.html";
  });
}

/**
 * Adds a subtask with the given title to the subtasks array and updates the UI.
 * @param {string} title - The title of the subtask to add.
 */

function addSubtask(title) {
  if (title && !subtasksArray.some((subtask) => subtask.title === title)) {
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

/**
 * Updates the visibility of selection icons (select and selected) based on the selection state.
 *
 * @param {HTMLElement} option - The dropdown option element containing the icons.
 * @param {boolean} isSelected - Indicates whether the option is selected (true) or deselected (false).
 */

function updateIcons(option, isSelected) {
  const selectIcon = option.querySelector(".select-icon");
  const selectedIcon = option.querySelector(".selected-icon");
  if (isSelected) {
    selectIcon.classList.remove("icon-visible");
    selectIcon.classList.add("icon-hidden");
    selectedIcon.classList.remove("icon-hidden");
    selectedIcon.classList.add("icon-visible");
  } else {
    selectIcon.classList.add("icon-visible");
    selectIcon.classList.remove("icon-hidden");
    selectedIcon.classList.add("icon-hidden");
    selectedIcon.classList.remove("icon-visible");
  }
}

/**
 * Adds a contact's initials to the selected container.
 * @param {string} initials - The initials of the contact.
 * @param {string} color - The background color associated with the contact.
 * @param {HTMLElement} selectedContainer - The container for selected contacts.
 */

function addInitialToSelected(initials, color, selectedContainer) {
  const span = document.createElement("span");
  span.className = "selected-contact-initials";
  span.textContent = initials;
  span.style.backgroundColor = color;
  selectedContainer.appendChild(span);
}

/**
 * Removes a contact's initials from the selected container.
 * @param {string} initials - The initials of the contact.
 * @param {HTMLElement} selectedContainer - The container for selected contacts.
 */

function removeInitialFromSelected(initials, selectedContainer) {
  const spans = selectedContainer.querySelectorAll(
    ".selected-contact-initials"
  );
  spans.forEach((span) => {
    if (span.textContent === initials) {
      span.remove();
    }
  });
}

/**
 * Updates the appearance of priority buttons based on the selected priority.
 */

function updatePriorityButtons() {
  document.querySelectorAll(".priority-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.priority === selectedPriority);
    const icon = btn.querySelector(".priority-icon");
    if (icon) {
      icon.style.filter =
        btn.dataset.priority === selectedPriority
          ? "brightness(0) invert(1)"
          : "none";
    }
  });
}

/**
 * Handhabt die Auswahl oder Deselektion eines Kontakts.
 *
 * @param {HTMLElement} option - Das Dropdown-Optionselement.
 * @param {string} initials - Die Initialen des Kontakts.
 * @param {string} color - Die Farbe des Kontakts.
 * @param {HTMLElement} selectedContainer - Der Container für ausgewählte Kontakte.
 */

function toggleContactSelection(option, initials, color, selectedContainer) {
  const contactName = option.dataset.value;
  const isSelected = option.classList.contains("selected");
  if (isSelected) {
    deselectContacts(option, initials, selectedContainer, contactName);
  } else {
    selectContacts(option, initials, color, selectedContainer, contactName);
  }
}

/**
 * Markiert einen Kontakt als ausgewählt.
 *
 * @param {HTMLElement} option - Das Dropdown-Optionselement.
 * @param {string} initials - Die Initialen des Kontakts.
 * @param {string} color - Die Farbe des Kontakts.
 * @param {HTMLElement} selectedContainer - Der Container für ausgewählte Kontakte.
 */

function selectContacts(
  option,
  initials,
  color,
  selectedContainer,
  contactName
) {
  option.classList.add("selected");
  option.style.backgroundColor = "#091931";
  option.style.color = "white";
  addInitialToSelected(initials, color, selectedContainer);
  if (!selectedMembers.includes(contactName)) {
    selectedMembers.push(contactName);
  }
  updateIcons(option, true);
}

/**
 * Deselects a contact from the dropdown, removes its styling, and updates the selected members list.
 *
 * @param {HTMLElement} option - The dropdown option element representing the contact.
 * @param {string} initials - The initials of the contact being deselected.
 * @param {HTMLElement} selectedContainer - The container displaying selected contacts.
 * @param {string} contactName - The name of the contact being deselected.
 */

function deselectContacts(option, initials, selectedContainer, contactName) {
  option.classList.remove("selected");
  option.style.backgroundColor = "";
  option.style.color = "";
  removeInitialFromSelected(initials, selectedContainer);
  selectedMembers = selectedMembers.filter((member) => member !== contactName);
  updateIcons(option, false);
}

/**
 * Sets up click listeners for selecting contacts in the dropdown.
 */

function setupContactsSelection() {
  document
    .querySelectorAll("#taskAssignedOptions .dropdown-option")
    .forEach((option) => {
      option.addEventListener("click", () => {
        selectedMembers.push(option.dataset.value);
        updateSelectedMembers();
      });
    });
}

/**
 * Adds a contact to the selected members list if not already added.
 * @param {string} contactName - The name of the contact to select.
 */

function selectContact(contactName) {
  if (!selectedMembers.includes(contactName)) {
    selectedMembers.push(contactName);
    updateSelectedMembers();
  }
}

/**
 * Updates the UI to display the currently selected members.
 */

function updateSelectedMembers() {
  const selectedContainer = document.getElementById(
    "selectedContactsContainer"
  );
  selectedContainer.innerHTML = "";
  const maxVisibleContacts = 4;
  selectedMembers.slice(0, maxVisibleContacts).forEach((member) => {
    const initials = getInitials(member);
    const color = getColorForContact(member);
    const span = document.createElement("span");
    span.className = "selected-contact-initials";
    span.textContent = initials;
    span.style.backgroundColor = color;
    selectedContainer.appendChild(span);
  });
}
fetchContacts((contacts) => {
  populateContactsDropdown(Object.values(contacts));
});

/**
 * Adds a "more" indicator to the selected contacts container if the total number of selected contacts exceeds the maximum visible limit.
 *
 * @param {number} totalSelected - The total number of selected contacts.
 * @param {number} maxVisibleContacts - The maximum number of contacts to display without showing the "more" indicator.
 * @param {HTMLElement} selectedContainer - The container element where selected contacts are displayed.
 */

function addMoreIndicator(
  totalSelected,
  maxVisibleContacts,
  selectedContainer
) {
  if (totalSelected > maxVisibleContacts) {
    const remainingCount = totalSelected - maxVisibleContacts;
    const moreSpan = document.createElement("span");
    moreSpan.className = "selected-contact-more";
    moreSpan.textContent = `+${remainingCount}`;
    moreSpan.style.backgroundColor = "#ccc";
    selectedContainer.appendChild(moreSpan);
  }
}

/**
 * Sets up click listeners for subtask checkboxes.
 * @param {Object} task - The task object containing subtasks.
 */

function setupSubtaskIconClickListeners(task) {
    const taskCard = getTaskCard(task.id);
    if (!taskCard) return;
    initializeSubtaskClickListeners(task, taskCard);
}
  
/**
   * Retrieves the task card element by task ID.
   * @param {string} taskId - The ID of the task.
   * @returns {HTMLElement|null} The task card element or null if not found.
   */

function getTaskCard(taskId) {
    return document.querySelector(`.task-card[data-id="${taskId}"]`);
}
  
/**
   * Adds click event listeners to subtask checkboxes within the task card.
   * @param {Object} task - The task object containing subtasks.
   * @param {HTMLElement} taskCard - The task card element.
   */

function initializeSubtaskClickListeners(task, taskCard) {
    const subtaskItems = taskCard.querySelectorAll(".subtask-item");
    subtaskItems.forEach((item) => {
      const checkbox = item.querySelector(".subtask-checkbox img");
      if (!checkbox) return;
      setupSubtaskCheckboxClick(checkbox, task, item);
    });
}
  
/**
   * Sets up the click event listener for a specific subtask checkbox.
   * @param {HTMLElement} checkbox - The subtask checkbox element.
   * @param {Object} task - The task object containing subtasks.
   * @param {HTMLElement} item - The subtask item element.
   */

function setupSubtaskCheckboxClick(checkbox, task, item) {
    checkbox.addEventListener("click", () => {
      const subtaskIndex = parseInt(item.dataset.index, 10);
      if (isNaN(subtaskIndex) || !task.subtasks[subtaskIndex]) return;
      const subtask = task.subtasks[subtaskIndex];
      subtask.completed = !subtask.completed;
      checkbox.src = `./assets/icons/${
        subtask.completed ? "checked" : "unchecked"
      }.png`;
      updateTaskProgress(task);
    });
}
  