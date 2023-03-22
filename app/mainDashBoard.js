let logUserName = document.getElementById("logged-username");
let currentLogContainer = document.querySelector("#no-log");
let taskContainer = document.querySelector("#log-container");
let addTaskClick = document.getElementById("add-task-container");
let editTaskClick = document.getElementById("edit-task-container");
let exportTaskClick = document.getElementById("export-task-container");
let importTaskClick = document.getElementById("import-task-container");
let editName = document.getElementById("edit-task-name-form");
let taskName = document.getElementById("task-name-form");
let importName = document.getElementById("import-file-name-form");
let taskList = [];
let Interval;
let TaskInterval;
document
  .getElementById("logout-click")
  .addEventListener("click", () => logout());
document
  .getElementById("add-task-button")
  .addEventListener("click", () => addTask());
document
  .getElementById("add-task-current-log")
  .addEventListener("click", () => addTask());
document
  .getElementById("register-task-button")
  .addEventListener("click", () => registerTask());
document
  .getElementById("edit-task-button")
  .addEventListener("click", () => editTaskName());
document
  .getElementById("export-task-button")
  .addEventListener("click", () => exportTaskName());
document
  .getElementById("export-task-window-button")
  .addEventListener("click", () => exportTask());
document
  .getElementById("import-task-button")
  .addEventListener("click", () => importTaskName());
document
  .getElementById("import-task-window-button")
  .addEventListener("click", () => importTask());
document
  .getElementById("cancel-task-button")
  .addEventListener("click", () => cancelTask());
document
  .getElementById("cancel-edit-task-button")
  .addEventListener("click", () => cancelTask());
document
  .getElementById("cancel-export-task-button")
  .addEventListener("click", () => cancelTask());
document
  .getElementById("cancel-import-task-button")
  .addEventListener("click", () => cancelTask());
function addTask() {
  taskName.value = "";
  addTaskClick.setAttribute("style", "display:flex");
}
function exportTaskName() {
  exportTaskClick.setAttribute("style", "display:flex");
}
function importTaskName() {
  importTaskClick.setAttribute("style", "display:flex");
}
async function importTask() {
  clearInterval(TaskInterval);
  clearInterval(Interval);
  await loadNewFile(importName.value);
  taskList = await loadTask();
  await taskLogLoad();
  TaskInterval = setInterval(TaskUpadte, 1000);
  importName.value = "";
  importTaskClick.setAttribute("style", "display:none");
}
function exportTask() {
  download_csv_file();
}
function cancelTask() {
  addTaskClick.setAttribute("style", "display:none");
  editTaskClick.setAttribute("style", "display:none");
  exportTaskClick.setAttribute("style", "display:none");
  importTaskClick.setAttribute("style", "display:none");
}
async function logout() {
  let temp = true;
  timeUpdate();
  for (let task of taskList) {
    if (task.run === "run") {
      temp = false;
      break;
    }
  }
  if (temp) {
    logOutUser();
  } else {
    if (confirm("All running tasks are stopped") == true) {
      logOutUser();
    }
  }
}
async function logOutUser() {
  let list = [];
  for (let task of taskList) {
    list.push(JSON.stringify(task));
  }
  console.log(list);
  await logOutDataUpdate(list);
  window.location = parent.window.document.location.origin;
}
async function userNameUpdate() {
  logUserName.innerText = await getUserName();
}
const registerTask = async () => {
  if (taskName.value != "" && taskName.value != null) {
    addTaskClick.setAttribute("style", "display:none");
    newTask();
  } else {
    confirm("Task Name must not be empty");
  }
};
const newTask = async () => {
  timeUpdate();
  await logAdd(taskName.value, "00:00", "run");
  await taskLogLoad();
};
const logAdd = async (name, time) => {
  stopAll();
  task = { TaskName: name, time: "00:00", run: "run" };
  taskList.push(task);
};
const deleteTaskdata = async (id) => {
  clearInterval(Interval);
  timeUpdate();
  deleteTask(id);
  taskLogLoad();
};
function deleteTask(id) {
  if (id === "deleteq") {
    let index = 0;
    for (let task of taskList) {
      if (task.run === "run") {
        id = "delete" + index;
      }
      index++;
    }
  }
  taskList.splice(id.slice(6), 1);
}
let editId;
const editTaskName = async () => {
  if (editName.value != "" && editName.value != null) {
    editTask(editId, editName.value);
    editTaskClick.setAttribute("style", "display:none");
    document.getElementById("taskName" + editId.slice(4)).innerText =
      editName.value;
    currentTaskAdd();
  } else {
    confirm("Task Name must not be empty");
  }
};
const editTaskdata = async (id) => {
  editId = id;
  if (editId === "editq") {
    let index = 0;
    for (let task of taskList) {
      if (task.run === "run") {
        editId = "edit" + index;
      }
      index++;
    }
  }
  editName.value = "";
  editTaskClick.setAttribute("style", "display:flex");
};
function editTask(id, name) {
  index = 0;
  for (let task of taskList) {
    if (index === parseInt(id.slice(4))) {
      task.TaskName = name;
    }
    index++;
  }
}
function stopAll() {
  clearInterval(Interval);
  for (let task of taskList) {
    task.run = "no";
  }
  for (let i = 0; i < taskList.length; i++) {
    document
      .getElementById("start" + i)
      .setAttribute("style", 'background-image: url("../assets/start.svg")');
    document.getElementById("start" + i).name = "1";
  }
}
const runTaskData = async (runId) => {
  if (runId === "startq") {
    let index = 0;
    for (let task of taskList) {
      if (task.run === "run") {
        runId = "start" + index;
      }
      index++;
    }
  }
  if (document.getElementById(runId).name === "1") {
    stopAll();
    taskList[runId.slice(5)].run = "run";
    document.getElementById(runId).name = "0";
    document
      .getElementById(runId)
      .setAttribute("style", 'background-image: url("../assets/pause.svg")');
    currentTime = document.getElementById("time" + runId.slice(5)).name;
    min = parseInt(currentTime.slice(0, 2));
    sec = parseInt(currentTime.slice(3));
    clearInterval(Interval);
    Interval = setInterval(startTimer, 1000, runId.slice(5));
  } else {
    clearInterval(Interval);
    document.getElementById(runId).name = "1";
    document
      .getElementById(runId)
      .setAttribute("style", 'background-image: url("../assets/start.svg")');
  }
  currentTaskAdd();
};
function startTimer(id) {
  let timeId = "time" + id;
  let updateTime;
  sec++;
  if (sec === 60) {
    min++;
    sec = 0;
  }
  if (min < 10) {
    updateTime = "0" + min;
  } else {
    updateTime = min;
  }
  if (sec < 10) {
    updateTime += ":0" + sec;
  } else {
    updateTime += ":" + sec;
  }
  document.getElementById(timeId).innerText = updateTime;
  document.getElementById("timeq").innerText = updateTime;
  document.getElementById(timeId).name = updateTime;
  timeUpdate();
}
function timeUpdate() {
  index = 0;
  for (let task of taskList) {
    task.time = document.getElementById("time" + index).name;
    index++;
  }
}
const taskLogLoad = async (newtask = true) => {
  let index = 0;
  let saveIndex = -1;
  document.getElementById("log-list").replaceChildren();
  for (let task of taskList) {
    let clone = taskContainer.cloneNode(true);
    clone.querySelector("#task-name").innerText = task.TaskName;
    clone.querySelector("#time").innerText = task.time;
    clone.querySelector("#task-name").id = "taskName" + index;
    clone.querySelector("#start").id = "start" + index;
    clone.querySelector("#time").id = "time" + index;
    clone.querySelector("#edit").id = "edit" + index;
    clone.querySelector("#delete").id = "delete" + index;
    document.getElementById("log-list").appendChild(clone);
    document.getElementById("time" + index).name = task.time;
    if (task.run === "run") {
      saveIndex = index;
    }
    index++;
  }
  if (saveIndex != -1) {
    document
      .getElementById("start" + saveIndex)
      .setAttribute("style", 'background-image: url("../assets/pause.svg")');
    clearInterval(Interval);
    runTaskData("start" + saveIndex);
  }
  currentTaskAdd();
};
async function currentTaskAdd() {
  let list = [];
  for (let task of taskList) {
    list.push(JSON.stringify(task));
  }
  console.log(list);
  await logOutDataUpdate(list);
  let index = 0;
  for (let task in taskList) {
    if (document.getElementById("start" + index).name === "0") {
      document.getElementById("current-log").replaceChildren();
      let currentClone = taskContainer.cloneNode(true);
      currentClone.querySelector("#task-name").innerText =
        taskList[task].TaskName;
      currentClone.querySelector("#start").name = "0";
      currentClone
        .querySelector("#start")
        .setAttribute("style", 'background-image: url("../assets/pause.svg")');
      currentClone.querySelector("#start").id = "start" + "q";
      currentClone.querySelector("#time").id = "time" + "q";
      currentClone.querySelector("#edit").id = "edit" + "q";
      currentClone.querySelector("#delete").id = "delete" + "q";
      document.getElementById("current-log").appendChild(currentClone);
      addTaskClick.setAttribute("style", "display:none");
      return;
    }
    index++;
  }
  document.getElementById("current-log").replaceChildren();
  let currentClone = currentLogContainer.cloneNode(true);
  document.getElementById("current-log").appendChild(currentClone);
}

async function TaskUpadte() {
  let list = [];
  for (let task of taskList) {
    list.push(JSON.stringify(task));
  }
  await TaskUpadteToServer(list);
}

//create a user-defined function to download CSV file
function download_csv_file() {
  //define the heading for each row of the data
  var csv = "TaskName, time, run\n";
  //merge the data with CSV
  for (let task in taskList) {
    csv +=
      taskList[task].TaskName +
      "," +
      taskList[task].time +
      "," +
      taskList[task].time +
      "\n";
    console.log(task);
  }
  console.log(csv);
  //display the created CSV data on the web browser
  document.write(csv);
  var hiddenElement = document.createElement("a");
  hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
  hiddenElement.target = "_blank";
  //provide the name for the CSV file to be downloaded
  hiddenElement.download = `${logUserName.innerText}.csv`;
  hiddenElement.click();
  window.location = parent.window.document.location;
}

(async function () {
  userNameUpdate();
  taskList = await loadTask();
  clearInterval(TaskInterval);
  TaskInterval = setInterval(TaskUpadte, 1000);
  taskLogLoad();
})();
