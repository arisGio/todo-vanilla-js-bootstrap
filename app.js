const todoForm = document.querySelector("form");
const todoList = document.querySelector(".todos");
const totalTasks = document.querySelector("#total-tasks");
const remainingTasks = document.querySelector("#remaining-tasks");
const completedTasks = document.querySelector("#completed-tasks");
const mainInput = document.querySelector("form input");

/**
 * Load tasks, if any, from local storage
 */
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

/**
 * If not empty then create tasks
 */
if (localStorage.getItem("tasks")) {
  tasks.map((task) => {
    createTask(task);
  });
}

/**
 * Listens for form submission
 */
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

/**
 * Listens for click on a specific task
 */
todoList.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("remove-task") ||
    e.target.parentElement.classList.contains("remove-task")
  ) {
    const taskId = e.target.closest("div").id;
    removeTask(taskId);
  }
});

/**
 * Listens for task edit text
 */
todoList.addEventListener("input", (e) => {
  const taskId = e.target.parentElement.parentElement.id;
  console.log("yooooooo");
  updateTask(taskId, e.target);
});

/**
 * Listens for enter pressed and prevent new line, exit edit mode
 */
todoList.addEventListener("keydown", (e) => {
  if (e.keyCode === 13) {
    e.preventDefault();
    e.target.blur();
  }
});

/**
 * Create a task
 * @param task
 */
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

/**
 * Count remaining, completed and total tasks
 */
function countTasks() {
  const completedTasksArray = tasks.filter((task) => task.isCompleted);
  totalTasks.textContent = tasks.length;
  completedTasks.textContent = completedTasksArray.length;
  remainingTasks.textContent = tasks.length - completedTasksArray.length;
}

/**
 * Delete a task by id
 * @param id
 */
function removeTask(id) {
  tasks = tasks.filter((task) => task.id !== parseInt(id));

  localStorage.setItem("tasks", JSON.stringify(tasks));

  document.getElementById(id).remove();

  countTasks();
}

/**
 * Updates a task on content edit or box checked
 * @param {*} id
 * @param {*} elem
 */
function updateTask(id, elem) {
  const task = tasks.find((item) => item.id === parseInt(id));

  if (elem.hasAttribute("contenteditable")) {
    task.name = elem.textContent;
  } else {
    const label = elem.nextElementSibling;
    task.isCompleted = !task.isCompleted;

    if (task.isCompleted) {
      label.removeAttribute("contenteditable");
      label.classList.add("text-decoration-line-through");
    } else {
      label.setAttribute("contenteditable", "true");
      label.classList.remove("text-decoration-line-through");
    }
  }

  localStorage.setItem("tasks", JSON.stringify(tasks));

  countTasks();
}
