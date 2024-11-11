document.addEventListener("DOMContentLoaded", () => {
  const taskCards = document.querySelectorAll(".task-card");
  const columns = document.querySelectorAll(".board-column");
  const taskDetailsModal = document.getElementById("taskDetailsModal");
  const addTaskModal = document.getElementById("addTaskModal");
  const addTaskButton = document.getElementById("addTaskButton");
  const addTaskForm = document.getElementById("addTaskForm");
  const taskContent = document.getElementById("taskContent");
  const closeButton = document.querySelectorAll(".close-button");

  // Task Details Modal elements
  const taskDetailTitle = document.getElementById("taskDetailTitle");
  const taskDetailDescription = document.getElementById(
    "taskDetailDescription"
  );
  const taskDueDate = document.getElementById("taskDueDate");
  const taskPriority = document.getElementById("taskPriority");
  const taskAssignedTo = document.getElementById("taskAssignedTo");
  const taskSubtasks = document.getElementById("taskSubtasks");

  let draggedTask = null;

  // Drag and Drop Functionality
  taskCards.forEach((task) => {
    task.setAttribute("draggable", "true");

    task.addEventListener("dragstart", (e) => {
      draggedTask = task;
      e.dataTransfer.setData("text/plain", task.dataset.task); // Store task's dataset in drag
      task.classList.add("dragging");
    });

    task.addEventListener("dragend", () => {
      draggedTask = null; // Clear the draggedTask once the drag ends
      task.classList.remove("dragging");
    });
  });

  columns.forEach((column) => {
    column.addEventListener("dragover", (e) => {
      e.preventDefault(); // Allow dropping in columns
    });

    column.addEventListener("drop", (e) => {
      e.preventDefault();
      if (draggedTask) {
        column.appendChild(draggedTask); // Move task to the new column
        draggedTask.classList.remove("dragging"); // Clean up dragging class
        draggedTask = null; // Reset draggedTask
      }
    });
  });

  // Task Details Modal - Show the modal with task details
  taskCards.forEach((task) => {
    task.addEventListener("click", () => {
      // Check if task is being dragged, if so, prevent opening modal
      if (draggedTask) return;

      // Populate modal with task details
      taskDetailTitle.textContent = task.dataset.title || "No title"; // Default value if title is missing
      taskDetailDescription.textContent =
        task.dataset.description || "No description available."; // Default value if description is missing
      taskDueDate.textContent = task.dataset.dueDate || "No due date"; // Default value if dueDate is missing
      taskPriority.textContent = task.dataset.priority || "No priority"; // Default value if priority is missing

      // Assign people
      taskAssignedTo.innerHTML = "";
      if (task.dataset.assignedTo) {
        task.dataset.assignedTo.split(",").forEach((person) => {
          const listItem = document.createElement("li");
          listItem.textContent = person.trim();
          taskAssignedTo.appendChild(listItem);
        });
      } else {
        taskAssignedTo.innerHTML = "<li>No one assigned</li>"; // Default text if no one is assigned
      }

      // Subtasks
      taskSubtasks.innerHTML = "";
      if (task.dataset.subtasks) {
        task.dataset.subtasks.split(",").forEach((subtask) => {
          const listItem = document.createElement("li");
          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.checked = subtask.includes("✔");
          listItem.appendChild(checkbox);
          listItem.appendChild(
            document.createTextNode(subtask.replace("✔", "").trim())
          );
          taskSubtasks.appendChild(listItem);
        });
      } else {
        taskSubtasks.innerHTML = "<li>No subtasks</li>"; // Default text if no subtasks
      }

      // Show task details modal
      taskDetailsModal.style.display = "block";
    });
  });

  // Close Modals
  closeButton.forEach((btn) => {
    btn.addEventListener("click", () => {
      taskDetailsModal.style.display = "none";
      addTaskModal.style.display = "none";
    });
  });

  // Add Task Modal
  addTaskButton.addEventListener("click", () => {
    addTaskModal.style.display = "block";
    setTimeout(() => {
      addTaskModal.style.right = "0"; // Slide the modal from the right
    }, 10);
  });

  // Open Add Task Modal from "+" buttons in columns
  document.querySelectorAll(".add-task-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      addTaskModal.style.display = "block";
      setTimeout(() => {
        addTaskModal.style.right = "0"; // Slide the modal from the right
      }, 10);
    });
  });

  // Submit Add Task Form
  addTaskForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("taskTitle").value;
    const description = document.getElementById("taskDescription").value;
    const dueDate = document.getElementById("taskDueDate").value;
    const priority = document.querySelector(
      "input[name='priority']:checked"
    ).value; // Priority value
    const assignedTo = Array.from(
      document.querySelectorAll(".assigned-to-checkbox:checked")
    )
      .map((checkbox) => checkbox.value)
      .join(", ");
    const subtasks = document
      .getElementById("taskSubtasksInput")
      .value.split(","); // Split by comma for subtasks

    const newTask = document.createElement("div");
    newTask.classList.add("task-card");
    newTask.setAttribute("draggable", "true");
    newTask.dataset.task = `${title}: ${description}`;
    newTask.dataset.title = title;
    newTask.dataset.description = description;
    newTask.dataset.dueDate = dueDate;
    newTask.dataset.priority = priority;
    newTask.dataset.assignedTo = assignedTo;
    newTask.dataset.subtasks = subtasks.join(",");

    newTask.textContent = title;

    // Add new task to "To do" column (default)
    document.querySelector('[data-status="todo"]').appendChild(newTask);

    // Reset form and close modal
    addTaskForm.reset();
    addTaskModal.style.right = "-100%"; // Slide the modal out
    setTimeout(() => {
      addTaskModal.style.display = "none";
    }, 500);

    // Make new task draggable and clickable
    newTask.addEventListener("dragstart", (e) => {
      draggedTask = newTask;
      e.dataTransfer.setData("text/plain", newTask.dataset.task); // Store task's dataset in drag
      newTask.classList.add("dragging");
    });

    newTask.addEventListener("dragend", () => {
      draggedTask = null; // Clear the draggedTask once the drag ends
      newTask.classList.remove("dragging");
    });

    newTask.addEventListener("click", () => {
      if (draggedTask) return; // Prevent modal from opening during drag

      taskDetailTitle.textContent = newTask.dataset.title;
      taskDetailDescription.textContent = newTask.dataset.description;
      taskDueDate.textContent = newTask.dataset.dueDate;
      taskPriority.textContent = newTask.dataset.priority;

      // Assign people
      taskAssignedTo.innerHTML = "";
      newTask.dataset.assignedTo.split(",").forEach((person) => {
        const listItem = document.createElement("li");
        listItem.textContent = person.trim();
        taskAssignedTo.appendChild(listItem);
      });

      // Subtasks
      taskSubtasks.innerHTML = "";
      newTask.dataset.subtasks.split(",").forEach((subtask) => {
        const listItem = document.createElement("li");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = subtask.includes("✔");
        listItem.appendChild(checkbox);
        listItem.appendChild(
          document.createTextNode(subtask.replace("✔", "").trim())
        );
        taskSubtasks.appendChild(listItem);
      });

      // Show task details modal
      taskDetailsModal.style.display = "block";
    });
  });

  // Search and Filter Functionality
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");
  const statusFilter = document.getElementById("statusFilter");
  const priorityFilter = document.getElementById("priorityFilter");

  searchButton.addEventListener("click", () => {
    const searchQuery = searchInput.value.toLowerCase();
    const selectedStatus = statusFilter.value;
    const selectedPriority = priorityFilter.value;

    taskCards.forEach((task) => {
      const title = task.dataset.title.toLowerCase();
      const taskStatus = task.dataset.status.toLowerCase();
      const taskPriority = task.dataset.priority.toLowerCase();

      const matchesSearch = title.includes(searchQuery);
      const matchesStatus = selectedStatus
        ? taskStatus === selectedStatus
        : true;
      const matchesPriority = selectedPriority
        ? taskPriority === selectedPriority
        : true;

      if (matchesSearch && matchesStatus && matchesPriority) {
        task.style.display = "block"; // Show matching task
      } else {
        task.style.display = "none"; // Hide non-matching task
      }
    });
  });

  // Priority Buttons
  const urgentBtn = document.getElementById("urgentBtn");
  const mediumBtn = document.getElementById("mediumBtn");
  const lowBtn = document.getElementById("lowBtn");

  const handleButtonClick = (btn, icon, color) => {
    // Setze alle anderen Buttons zurück
    document.querySelectorAll(".priority-btn").forEach((button) => {
      button.classList.remove("clicked");
    });
    document.querySelectorAll(".priority-icon").forEach((icon) => {
      icon.style.filter = "grayscale(0%)"; // Setze alle Icons auf die Standardfarbe
    });

    // Färbe den angeklickten Button und ändere das Icon
    btn.classList.add("clicked");
    icon.style.filter = "grayscale(100%)"; // Icon wird weiß
    btn.style.backgroundColor = color; // Hintergrundfarbe für den geklickten Button
  };

  // Event Listener für die Buttons
  urgentBtn.addEventListener("click", () => {
    handleButtonClick(urgentBtn, document.getElementById("urgentIcon"), "red");
  });

  mediumBtn.addEventListener("click", () => {
    handleButtonClick(
      mediumBtn,
      document.getElementById("mediumIcon"),
      "yellow"
    );
  });

  lowBtn.addEventListener("click", () => {
    handleButtonClick(lowBtn, document.getElementById("lowIcon"), "green");
  });
});
