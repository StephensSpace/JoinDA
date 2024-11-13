async function getFirebaseData(path = "/") {
  const SNAPSHOT = await firebase.database().ref(path).once("value");
  const RESULT = SNAPSHOT.val(); // Ergebnis als Object
  return RESULT;
}

document.addEventListener("DOMContentLoaded", () => {
  const taskCards = document.querySelectorAll(".task-card");
  const columns = document.querySelectorAll(".board-column");
  const taskDetailsModal = document.getElementById("taskDetailsModal");
  const addTaskModal = document.getElementById("addTaskModal");
  const addTaskButton = document.getElementById("addTaskButton");
  const addTaskForm = document.getElementById("addTaskForm");
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
      e.dataTransfer.setData("text/plain", task.dataset.task);
      task.classList.add("dragging");
    });

    task.addEventListener("dragend", () => {
      draggedTask = null;
      task.classList.remove("dragging");
    });
  });

  columns.forEach((column) => {
    column.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    column.addEventListener("drop", (e) => {
      e.preventDefault();
      if (draggedTask) {
        column.appendChild(draggedTask);
        draggedTask.classList.remove("dragging");
        draggedTask = null;
      }
    });
  });

  // Task Details Modal - Show the modal with task details
  taskCards.forEach((task) => {
    task.addEventListener("click", () => {
      if (draggedTask) return;

      taskDetailTitle.textContent = task.dataset.title || "No title";
      taskDetailDescription.textContent =
        task.dataset.description || "No description available.";
      taskDueDate.textContent = task.dataset.dueDate || "No due date";
      taskPriority.textContent = task.dataset.priority || "No priority";

      taskAssignedTo.innerHTML = "";
      if (task.dataset.assignedTo) {
        task.dataset.assignedTo.split(",").forEach((person) => {
          const listItem = document.createElement("li");
          listItem.textContent = person.trim();
          taskAssignedTo.appendChild(listItem);
        });
      } else {
        taskAssignedTo.innerHTML = "<li>No one assigned</li>";
      }

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
        taskSubtasks.innerHTML = "<li>No subtasks</li>";
      }

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
      addTaskModal.style.right = "0";
    }, 10);
  });

  document.querySelectorAll(".add-task-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      addTaskModal.style.display = "block";
      setTimeout(() => {
        addTaskModal.style.right = "0";
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
    ).value;
    const assignedTo = Array.from(
      document.querySelectorAll(".assigned-to-checkbox:checked")
    )
      .map((checkbox) => checkbox.value)
      .join(", ");
    const subtasks = document
      .getElementById("taskSubtasksInput")
      .value.split(",");

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

    document.querySelector('[data-status="todo"]').appendChild(newTask);

    addTaskForm.reset();
    addTaskModal.style.right = "-100%";
    setTimeout(() => {
      addTaskModal.style.display = "none";
    }, 500);

    newTask.addEventListener("dragstart", (e) => {
      draggedTask = newTask;
      e.dataTransfer.setData("text/plain", newTask.dataset.task);
      newTask.classList.add("dragging");
    });

    newTask.addEventListener("dragend", () => {
      draggedTask = null;
      newTask.classList.remove("dragging");
    });

    newTask.addEventListener("click", () => {
      if (draggedTask) return;

      taskDetailTitle.textContent = newTask.dataset.title;
      taskDetailDescription.textContent = newTask.dataset.description;
      taskDueDate.textContent = newTask.dataset.dueDate;
      taskPriority.textContent = newTask.dataset.priority;

      taskAssignedTo.innerHTML = "";
      newTask.dataset.assignedTo.split(",").forEach((person) => {
        const listItem = document.createElement("li");
        listItem.textContent = person.trim();
        taskAssignedTo.appendChild(listItem);
      });

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

      task.style.display =
        matchesSearch && matchesStatus && matchesPriority ? "block" : "none";
    });
  });

  // Priority Buttons
  const urgentBtn = document.getElementById("urgentBtn");
  const mediumBtn = document.getElementById("mediumBtn");
  const lowBtn = document.getElementById("lowBtn");

  const handleButtonClick = (btn, icon, color) => {
    document
      .querySelectorAll(".priority-btn")
      .forEach((button) => button.classList.remove("clicked"));
    document
      .querySelectorAll(".priority-icon")
      .forEach((icon) => (icon.style.filter = "grayscale(0%)"));

    btn.classList.add("clicked");
    icon.style.filter = "grayscale(100%)";
    btn.style.backgroundColor = color;
  };

  urgentBtn.addEventListener("click", () =>
    handleButtonClick(urgentBtn, document.getElementById("urgentIcon"), "red")
  );
  mediumBtn.addEventListener("click", () =>
    handleButtonClick(
      mediumBtn,
      document.getElementById("mediumIcon"),
      "yellow"
    )
  );
  lowBtn.addEventListener("click", () =>
    handleButtonClick(lowBtn, document.getElementById("lowIcon"), "green")
  );
});
