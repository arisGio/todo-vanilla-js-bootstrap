const todoForm = document.querySelector("form");
const todoList = document.querySelector(".todos");
const totalTasks = document.querySelector("#total-tasks");
const remainingTasks = document.querySelector("#remaining-tasks");
const completedTasks = document.querySelector("#completed-tasks");
const mainInput = document.querySelector("form input");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

if (localStorage.getItem("tasks")) {
  tasks.map((task) => {
    createTask(task);
  });
}

todoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputValue = mainInput.value;
  if (inputValue == "") {
    return;
  }

  const task = {
    id: new Date().getTime(),
    name: mainInput.value,
    isCompleted: false,
  };

  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  createTask(task);

  todoForm.reset();
  mainInput.focus();
});

todoList.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-task")) {
    const taskId = e.target.closest("div").id;
    removeTask(taskId);
  }
});

function createTask(task) {
  const taskEl = document.createElement("div");
  taskEl.setAttribute("id", task.id);
  taskEl.classList.add(
    "row",
    "align-items-center",
    "bg-warning",
    "rounded",
    "p-2",
    "justify-content-between",
    "col-12",
    "col-lg-6",
    "mx-auto",
    "mb-1"
  );

  const taskElMarkup = `
          <div class="form-check col-5">
            <input
              class="form-check-input"
              type="checkbox"
              value=""
              id="${task.id}-checkbox"
              ${task.isCompleted ? "checked" : ""}
            />
            <label
              class="form-check-label ${
                task.isCompleted ? "text-decoration-line-through" : ""
              }"
              for="${task.id}-checkbox"
              ${!task.isCompleted ? "contenteditable" : ""}
            >
              ${task.name}
            </label>
          </div>
          <button title='Remove the "${
            task.name
          }" task' class="btn btn-danger col-1 remove-task" type="button">
            <i class="fa fa-trash"></i>
          </button>
  `;

  taskEl.innerHTML = taskElMarkup;

  todoList.appendChild(taskEl);

  countTasks();
}

function countTasks() {
  const completedTasksArray = tasks.filter((task) => task.isCompleted);
  totalTasks.textContent = tasks.length;
  completedTasks.textContent = completedTasksArray.length;
  remainingTasks.textContent = tasks.length - completedTasksArray.length;
}

function removeTask(id) {
  tasks = tasks.filter((task) => task.id !== parseInt(id));

  localStorage.setItem("tasks", JSON.stringify(tasks));

  document.getElementById(id).remove();

  countTasks();
}
