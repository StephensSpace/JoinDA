document.addEventListener("DOMContentLoaded", () => {
  setupDropdownSearchInline();
  setupSubtaskIconClickListeners();
  setupSecondDropdown();
  enableDragAndDrop();
  saveDefaultTasks();
  fetchTasks((tasks) => {
    renderTasks(tasks);
  });
  fetchContacts((contacts) => {
    populateContactsDropdown(contacts);
  });

  const editButton = document.querySelector(".edit-btn");
  if (editButton) {
    editButton.addEventListener("click", () => {
      openEditTaskModal();
    });
  }

  const taskDetailsCloseBtn = document.querySelector(
    "#taskDetailsModal .close-button"
  );
  if (taskDetailsCloseBtn) {
    taskDetailsCloseBtn.addEventListener("click", () => {
      document.getElementById("taskDetailsModal").style.display = "none";
    });
  }

  const createTaskButton = document.getElementById("createTaskButton");
  if (createTaskButton) {
    createTaskButton.addEventListener("click", handleTaskSubmit);
  }

  const addTaskButton = document.getElementById("addTaskButton");
  if (addTaskButton) {
    addTaskButton.addEventListener("click", () => {
      openAddTaskModal("todo");
      fetchContacts((contacts) => {
        populateContactsDropdown(contacts);
      });
    });
  }

  const addTaskCloseBtn = document.querySelector("#addTaskModal .close-button");
  if (addTaskCloseBtn) {
    addTaskCloseBtn.addEventListener("click", () => {
      document.getElementById("addTaskModal").style.display = "none";
    });
  }

  const cancelButton = document.getElementById("cancelButton");
  if (cancelButton) {
    cancelButton.addEventListener("click", (event) => {
      event.preventDefault();
      resetAddTaskModal();
      closeModal();
    });
  }

  const priorityButtons = document.querySelectorAll(".priority-btn");
  priorityButtons.forEach((button) => {
    button.addEventListener("click", () => {
      priorityButtons.forEach((btn) => {
        btn.classList.remove("active");
        const icon = btn.querySelector(".priority-icon");
        if (icon) {
          icon.style.filter = "none";
        }
      });
      button.classList.add("active");
      selectedPriority = button.dataset.priority;
      const icon = button.querySelector(".priority-icon");
      if (icon) {
        icon.style.filter = "brightness(0) invert(1)";
      }
    });
  });

  const deleteButton = document.querySelector(".delete-btn");
  if (deleteButton) {
    deleteButton.addEventListener("click", () => {
      deleteCurrentTask();
    });
  }

  const addTaskTypeButtons = document.querySelectorAll(
    ".add-task-btn-category"
  );
  addTaskTypeButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const type = button.getAttribute("data-type");
      openAddTaskModal(type);
    });
  });

  const subtaskInput = document.getElementById("subtaskInput");
  const subtaskAddButton = document.querySelector(".subtask-add-button");
  subtaskAddButton.addEventListener("click", () => {
    addSubtask(subtaskInput.value.trim());
  });
  subtaskInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addSubtask(subtaskInput.value.trim());
    }
  });
});
