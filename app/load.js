const loginCheck = async (username, password) => {
  let returnResult;
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  var raw = {
    userName: "",
    password: "",
  };
  raw.userName = username;
  raw.password = password;
  raw = JSON.stringify(raw);
  var requestData = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };
  await fetch("/auth", requestData)
    .then((response) => response.json())
    .then((result) => {
      returnResult = result.message;
    })
    .catch((error) => {
      if (confirm("Error server not respond..", error) == true) {
      }
    });
  return returnResult;
};
const signupUser = async (username, email, password) => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  var raw = {
    userName: "",
    email: "",
    password: "",
  };
  raw.userName = username;
  raw.email = email;
  raw.password = password;
  raw = JSON.stringify(raw);
  var requestData = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };
  await fetch("/signup", requestData)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      if (confirm("Error server not respond.. ", error) == true)
        location.reload();
    });
};
let userName;
const getUserName = async () => {
  await fetch("/userName")
    .then((response) => response.json())
    .then((result) => {
      userName = result.name;
    })
    .catch((error) => {
      if (confirm("Error while fetching user Name", error) == true)
        location.reload();
    });
  return userName;
};
var requestOptions1 = {
  method: "GET",
  redirect: "follow",
};
const loadTask = async () => {
  let taskList;
  await fetch("/loadTask?name=" + userName, requestOptions1)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      taskList = result;
    })
    .catch((error) => {
      if (
        confirm(
          "Error while fetching data, click ok to reload the page...2 ",
          error
        ) == true
      )
        location.reload();
    });
  return taskList;
};
var requestOptions2 = {
  method: "GET",
  redirect: "follow",
};
const logOutDataUpdate = async (taskList) => {
  await fetch("/logOutDataUpdate?list=" + taskList, requestOptions2).catch(
    (error) => {
      if (confirm("Error while fetching data, log out ", error) == true)
        location.reload();
    }
  );
  return taskList;
};

const TaskUpadteToServer = async (taskList) => {
  await fetch("/logOutDataUpdate?list=" + taskList, requestOptions2).catch(
    (error) => {
      if (confirm("Error while fetching data, log out ", error) == true)
        location.reload();
    }
  );
  return;
};
const loadNewFile = async (file) => {
  var x = await fetch("/loadNewFile?file=" + file, requestOptions2).catch(
    (error) => {
      if (confirm("Error while fetching data, log out ", error) == true)
        location.reload();
    }
  );
  if (!x.ok) {
    alert("File not found");
  }
  return;
};
