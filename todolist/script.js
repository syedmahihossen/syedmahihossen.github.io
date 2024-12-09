const todoValue = document.getElementById("todoText");
const todoAlert = document.getElementById("Alert");
const listItems = document.getElementById("list-items");
const addUpdate = document.getElementById("AddUpdateClick");
const taskCounter = document.getElementById("TaskCounter");
const searchText = document.getElementById("searchText");

let todo = JSON.parse(localStorage.getItem("todo-list")) || [];
let updateIndex = null;

function updateTaskCounter() {
  taskCounter.innerText = `Total Tasks: ${todo.length}`;
}

// Initialize UI with stored items
function ReadToDoItems() {
  listItems.innerHTML = "";
  todo.forEach((element, index) => {
    let li = document.createElement("li");
    const completedStyle = element.status ? "style='text-decoration: line-through'" : "";
    const todoItems = `
      <div ${completedStyle} ondblclick="CompletedToDoItems(${index})">${element.item}</div>
      <div>
        ${!element.status
        ? `<img class="edit todo-controls" onclick="UpdateToDoItems(${index})" src="./Images/edit.png" />`
        : ""
      }
        <img class="delete todo-controls" onclick="DeleteToDoItems(${index})" src="./Images/delete.png" />
      </div>`;
    li.innerHTML = todoItems;
    listItems.appendChild(li);
  });
  updateTaskCounter();
}

// Add or update to-do items
function CreateToDoItems() {
  const task = todoValue.value.trim();

  if (task === "") {
    setAlertMessage("Please enter your todo text!", "red");
    return;
  }

  if (updateIndex !== null) {
    if (todo.some((el, idx) => el.item === task && idx !== updateIndex)) {
      setAlertMessage("This item already exists!", "red");
      return;
    }
    todo[updateIndex].item = task;
    setAlertMessage("Todo item updated successfully!", "blue");
    updateIndex = null;
    addUpdate.setAttribute("onclick", "CreateToDoItems()");
    addUpdate.setAttribute("src", "./Images/plus.gif");
  } else {
    if (todo.some((el) => el.item === task)) {
      setAlertMessage("This item already exists!", "red");
      return;
    }
    todo.push({ item: task, status: false });
    setAlertMessage("Todo item created successfully!", "green");
  }

  todoValue.value = "";
  setLocalStorage();
  ReadToDoItems();
}

// Mark item as complete
function CompletedToDoItems(index) {
  todo[index].status = true;
  setLocalStorage();
  setAlertMessage("Todo item marked as completed!", "green");
  ReadToDoItems();
}

// Prepare item for editing
function UpdateToDoItems(index) {
  todoValue.value = todo[index].item;
  updateIndex = index;
  addUpdate.setAttribute("onclick", "CreateToDoItems()");
  addUpdate.setAttribute("src", "./Images/refresh.png");
  todoValue.focus();
}

// Delete item
function DeleteToDoItems(index) {
  if (confirm(`Are you sure you want to delete "${todo[index].item}"?`)) {
    todo.splice(index, 1);
    setLocalStorage();
    setAlertMessage("Todo item deleted successfully!", "red");
    ReadToDoItems();
  }
}

// Search for tasks using binary search
function SearchToDoItems() {
  const query = searchText.value.trim().toLowerCase();

  if (!query) {
    ReadToDoItems(); // Show all tasks if no query is entered
    return;
  }

  // Filter tasks that start with the typed query or contain it
  const filteredTasks = todo.filter(item => item.item.toLowerCase().startsWith(query));

  if (filteredTasks.length > 0) {
    listItems.innerHTML = ""; // Clear the list
    filteredTasks.forEach(task => {
      const li = document.createElement("li");
      li.textContent = task.item;
      listItems.appendChild(li);
    });
    setAlertMessage(`Tasks starting with "${query}" found!`, "blue");
  } else {
    listItems.innerHTML = "<li>No tasks found!</li>";
    setAlertMessage(`No tasks starting with "${query}"!`, "red");
  }
}


// Sort tasks alphabetically using merge sort
function SortToDoItems() {
  todo = mergeSort(todo, (a, b) => a.item.localeCompare(b.item));
  setLocalStorage();
  setAlertMessage("Tasks sorted successfully!", "green");
  ReadToDoItems();
}

// Merge sort algorithm
function mergeSort(array, comparator) {
  if (array.length <= 1) return array;

  const mid = Math.floor(array.length / 2);
  const left = mergeSort(array.slice(0, mid), comparator);
  const right = mergeSort(array.slice(mid), comparator);

  return merge(left, right, comparator);
}

function merge(left, right, comparator) {
  let result = [];
  while (left.length && right.length) {
    if (comparator(left[0], right[0]) < 0) result.push(left.shift());
    else result.push(right.shift());
  }
  return [...result, ...left, ...right];
}

// Binary search algorithm
function binarySearch(array, target) {
  let left = 0;
  let right = array.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (array[mid] === target) return mid;
    else if (array[mid] < target) left = mid + 1;
    else right = mid - 1;
  }

  return -1;
}

// Update local storage
function setLocalStorage() {
  localStorage.setItem("todo-list", JSON.stringify(todo));
}

// Display alert messages
function setAlertMessage(message, color) {
  todoAlert.innerText = message;
  todoAlert.style.color = color;
  todoAlert.classList.remove("toggleMe");
  setTimeout(() => {
    todoAlert.classList.add("toggleMe");
  }, 3000);
}

// Initial call
ReadToDoItems();
