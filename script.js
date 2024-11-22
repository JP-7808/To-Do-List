document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("taskInput");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const taskList = document.getElementById("taskList");
    const searchInput = document.getElementById("searchInput");
  
    // Load tasks from localStorage on page load
    loadTasks();
  
    // Add task
    addTaskBtn.addEventListener("click", () => {
      addTask();
    });
  
    taskInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        addTask();
      }
    });
  
    function addTask() {
      const task = taskInput.value.trim();
      if (task) {
        addTaskToList(task);
        saveTaskToLocalStorage(task);
        taskInput.value = "";
      }
    }
  
    // Search tasks
    searchInput.addEventListener("input", () => {
      const filter = searchInput.value.toLowerCase();
      const tasks = document.querySelectorAll("#taskList li");
      tasks.forEach((task) => {
        const text = task.querySelector(".task-text").textContent.toLowerCase();
        task.style.display = text.includes(filter) ? "flex" : "none";
      });
    });
  
    // Add task to the list
    function addTaskToList(task) {
      const li = document.createElement("li");
  
      const taskText = document.createElement("span");
      taskText.className = "task-text";
      taskText.textContent = task;
  
      const menu = document.createElement("div");
      menu.className = "menu";
  
      const menuBtn = document.createElement("button");
      menuBtn.className = "menu-btn";
      menuBtn.textContent = "...";
  
      const menuOptions = document.createElement("div");
      menuOptions.className = "menu-options";
  
      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.addEventListener("click", () =>
        enableEditing(taskText, li, menuOptions)
      );
  
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", () => {
        removeTaskFromLocalStorage(taskText.textContent);
        li.remove();
      });
  
      menuOptions.append(editBtn, deleteBtn);
      menu.append(menuBtn, menuOptions);
  
      menuBtn.addEventListener("click", () => {
        menuOptions.style.display =
          menuOptions.style.display === "block" ? "none" : "block";
      });
  
      li.append(taskText, menu);
      taskList.appendChild(li);
    }
  
    // Enable inline editing
    function enableEditing(taskText, li, menuOptions) {
      menuOptions.style.display = "none"; // Hide menu options
  
      const input = document.createElement("input");
      input.type = "text";
      input.value = taskText.textContent;
      input.className = "edit-input";
  
      input.addEventListener("blur", () => saveTask(input, taskText, li)); // Save on losing focus
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          saveTask(input, taskText, li); // Save on pressing Enter
        }
      });
  
      li.replaceChild(input, taskText);
      input.focus(); // Focus on the input field
    }
  
    // Save edited task
    function saveTask(input, taskText, li) {
      const oldTask = taskText.textContent;
      const newTask = input.value.trim() || oldTask;
  
      updateTaskInLocalStorage(oldTask, newTask);
      taskText.textContent = newTask;
      li.replaceChild(taskText, input); // Replace input with updated task
    }
  
    // Save task to localStorage
    function saveTaskToLocalStorage(task) {
      const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      tasks.push(task);
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  
    // Load tasks from localStorage
    function loadTasks() {
      const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      tasks.forEach((task) => {
        addTaskToList(task);
      });
    }
  
    // Remove task from localStorage
    function removeTaskFromLocalStorage(task) {
      const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      const updatedTasks = tasks.filter((t) => t !== task);
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    }
  
    // Update task in localStorage
    function updateTaskInLocalStorage(oldTask, newTask) {
      const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      const index = tasks.indexOf(oldTask);
      if (index !== -1) {
        tasks[index] = newTask;
        localStorage.setItem("tasks", JSON.stringify(tasks));
      }
    }
  });
  