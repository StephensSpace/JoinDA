const defaultTasks = [
  {
    id: "task1",
    title: "Setup Git Repository",
    description: "Initialize the Git repository and create the main branch.",
    dueDate: "2024-12-01",
    priority: "Urgent",
    category: "Technical Task",
    type: "await-feedback",
    members: ["John Doe", "Jane Smith"],
    subtasks: [
      { title: "Install Git", completed: true },
      { title: "Create Repository", completed: false },
    ],
  },
  {
    id: "task2",
    title: "Design Landing Page",
    description: "Create a wireframe and design for the landing page.",
    dueDate: "2024-12-05",
    priority: "Medium",
    category: "User Story",
    type: "in-progress",
    members: ["Emily Davis"],
    subtasks: [
      { title: "Draft Wireframe", completed: true },
      { title: "Create Design Mockup", completed: false },
    ],
  },
  {
    id: "task3",
    title: "Write Unit Tests",
    description: "Ensure all critical features have unit tests.",
    dueDate: "2024-12-10",
    priority: "Low",
    category: "Technical Task",
    type: "done",
    members: ["Alex Johnson", "Chris Lee"],
    subtasks: [
      { title: "Setup Test Framework", completed: true },
      { title: "Write Tests for Login", completed: true },
      { title: "Write Tests for Registration", completed: true },
    ],
  },
  {
    id: "task4",
    title: "Conduct User Research",
    description: "Interview users to gather feedback for the new feature.",
    dueDate: "2024-12-15",
    priority: "Low",
    category: "User Story",
    type: "todo",
    members: ["Sophia Brown"],
    subtasks: [
      { title: "Prepare Questions", completed: false },
      { title: "Interview Users", completed: false },
    ],
  },
  {
    id: "task5",
    title: "Optimize Database",
    description: "Improve database queries for faster response times.",
    dueDate: "2024-12-20",
    priority: "Medium",
    category: "Technical Task",
    type: "in-progress",
    members: ["Michael Wilson"],
    subtasks: [
      { title: "Analyze Current Queries", completed: true },
      { title: "Implement Indexing", completed: false },
    ],
  },
];

function saveDefaultTasks() {
  const tasksRef = firebase.database().ref("/tasks/");
  defaultTasks.forEach((task) => {
    tasksRef.child(task.id).set(task);
  });
}
