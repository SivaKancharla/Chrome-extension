// --- DOM Elements ---
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const modeButtons = document.querySelectorAll('.mode-button');
const cyclesCompletedDisplay = document.getElementById('cyclesCompleted');

// --- Timer Variables ---
let timerInterval;
let remainingTime; // Time in seconds
let currentMode = 'pomodoro'; // 'pomodoro', 'shortBreak', 'longBreak'
let cyclesCompleted = 0;
let isRunning = false;

// --- Pomodoro Settings (in seconds) ---
const settings = {
    pomodoro: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
};

// --- Initial Setup ---
function initializeTimer() {
    remainingTime = settings[currentMode];
    updateDisplay();
    cyclesCompletedDisplay.textContent = cyclesCompleted;
    updateButtonVisibility();
}

// --- Update Timer Display ---
function updateDisplay() {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    minutesDisplay.textContent = String(minutes).padStart(2, '0');
    secondsDisplay.textContent = String(seconds).padStart(2, '0');
}

// --- Start Timer ---
function startTimer() {
    if (isRunning) return; // Prevent multiple intervals
    isRunning = true;
    updateButtonVisibility();

    timerInterval = setInterval(() => {
        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            isRunning = false;
            handleTimerEnd();
        } else {
            remainingTime--;
            updateDisplay();
        }
    }, 1000);
}

// --- Pause Timer ---
function pauseTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    updateButtonVisibility();
}

// --- Reset Timer ---
function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    initializeTimer(); // Reset to current mode's default time
    updateButtonVisibility();
}

// --- Handle Timer End (e.g., transition to break, play sound) ---
function handleTimerEnd() {
    // Play a sound (Optional: Add an audio element in HTML and play it)
    // new Audio('path/to/notification.mp3').play();
    alert(`${currentMode} finished!`);

    if (currentMode === 'pomodoro') {
        cyclesCompleted++;
        cyclesCompletedDisplay.textContent = cyclesCompleted;
        if (cyclesCompleted % 4 === 0) { // After 4 pomodoros, go to long break
            switchMode('longBreak');
        } else {
            switchMode('shortBreak');
        }
    } else { // If it was a break, go back to pomodoro
        switchMode('pomodoro');
    }
    startTimer(); // Auto-start the next phase
}

// --- Switch Timer Modes ---
function switchMode(newMode) {
    currentMode = newMode;
    clearInterval(timerInterval);
    isRunning = false;
    remainingTime = settings[currentMode];
    updateDisplay();
    updateButtonVisibility();

    // Update active button styling
    modeButtons.forEach(button => {
        button.classList.remove('active');
        if (button.dataset.mode === newMode) {
            button.classList.add('active');
        }
    });
}

// --- Update Button Visibility (Start/Pause) ---
function updateButtonVisibility() {
    if (isRunning) {
        startBtn.classList.add('d-none');
        pauseBtn.classList.remove('d-none');
    } else {
        startBtn.classList.remove('d-none');
        pauseBtn.classList.add('d-none');
    }
}

// --- Event Listeners ---
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

modeButtons.forEach(button => {
    button.addEventListener('click', () => {
        switchMode(button.dataset.mode);
    });
});

// --- Initial Call ---
initializeTimer();








let todoItemsContainer = document.getElementById("todoItemsContainer");
let addTodoButton = document.getElementById("addTodoButton");
let saveTodoButton = document.getElementById("saveTodoButton");

function getTodoListFromLocalStorage() {
  let stringifiedTodoList = localStorage.getItem("todoList");
  let parsedTodoList = JSON.parse(stringifiedTodoList);
  if (parsedTodoList === null) {
    return [];
  } else {
    return parsedTodoList;
  }
}

let todoList = getTodoListFromLocalStorage();
let todosCount = todoList.length;

saveTodoButton.onclick = function() {
  localStorage.setItem("todoList", JSON.stringify(todoList));
};

function onAddTodo() {
  let userInputElement = document.getElementById("todoUserInput");
  let userInputValue = userInputElement.value;

  if (userInputValue === "") {
    alert("Enter Valid Text");
    return;
  }

  todosCount = todosCount + 1;

  let newTodo = {
    text: userInputValue,
    uniqueNo: todosCount,
    isChecked: false
  };
  todoList.push(newTodo);
  createAndAppendTodo(newTodo);
  userInputElement.value = "";
}

addTodoButton.onclick = function() {
  onAddTodo();
};

function onTodoStatusChange(checkboxId, labelId, todoId,deleteIconId) {
  let checkboxElement = document.getElementById(checkboxId);
  let labelElement = document.getElementById(labelId);
  let deleteIcon=document.getElementById(deleteIconId);
  labelElement.classList.toggle("checked");
  deleteIcon.classList.toggle("fa-trash");
  deleteIcon.classList.toggle("fa-trash-can");

  let todoObjectIndex = todoList.findIndex(function(eachTodo) {
    let eachTodoId = "todo" + eachTodo.uniqueNo;

    if (eachTodoId === todoId) {
      return true;
    } else {
      return false;
    }
  });

  let todoObject = todoList[todoObjectIndex];

  if(todoObject.isChecked === true){
    todoObject.isChecked = false;
  } else {
    todoObject.isChecked = true;
  }

}

function onDeleteTodo(todoId) {
  let todoElement = document.getElementById(todoId);
  todoItemsContainer.removeChild(todoElement);

  let deleteElementIndex = todoList.findIndex(function(eachTodo) {
    let eachTodoId = "todo" + eachTodo.uniqueNo;
    if (eachTodoId === todoId) {
      return true;
    } else {
      return false;
    }
  });

  todoList.splice(deleteElementIndex, 1);

}

function createAndAppendTodo(todo) {
  let todoId = "todo" + todo.uniqueNo;
  let checkboxId = "checkbox" + todo.uniqueNo;
  let labelId = "label" + todo.uniqueNo;
  let deleteIconId="delIcon" + todo.uniqueNo;
  let todoElement = document.createElement("li");
  todoElement.classList.add("todo-item-container", "d-flex", "flex-row");
  todoElement.id = todoId;
  todoItemsContainer.appendChild(todoElement);

  // let divofcheckbox=document.createElement("div");
  // inputElement.classList.add("div-checkbox-style");



  let inputElement = document.createElement("input");
  inputElement.type = "checkbox";
  inputElement.id = checkboxId;
  inputElement.checked = todo.isChecked;

  inputElement.onclick = function () {
    onTodoStatusChange(checkboxId, labelId, todoId,deleteIconId);
  };

  inputElement.classList.add("checkbox-input");
  todoElement.appendChild(inputElement);

  let labelContainer = document.createElement("div");
  labelContainer.classList.add("label-container", "d-flex", "flex-row");
  todoElement.appendChild(labelContainer);

  let labelElement = document.createElement("label");
  labelElement.setAttribute("for", checkboxId);
  labelElement.id = labelId;
  labelElement.classList.add("checkbox-label");
  labelElement.textContent = todo.text;
  if (todo.isChecked === true) {
    labelElement.classList.add("checked");
  }
  labelContainer.appendChild(labelElement);

  let deleteIconContainer = document.createElement("div");
  deleteIconContainer.classList.add("delete-icon-container");
  labelContainer.appendChild(deleteIconContainer);

  let deleteIcon = document.createElement("i");
  deleteIcon.id=deleteIconId;
  deleteIcon.classList.add("fa-solid","fa-trash-can");
  deleteIcon.classList.add("fa-trash-can");
  // if (todo.isChecked === true) {
  //   deleteIcon.classList.toggle("fa-solid","fa-trash-can");
  //   deleteIcon.classList.toggle("fa-solid","fa-trash");
  // }

  deleteIcon.onclick = function () {
    onDeleteTodo(todoId);
  };

  deleteIconContainer.appendChild(deleteIcon);
}

for (let todo of todoList) {
  createAndAppendTodo(todo);
}