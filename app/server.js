const fs = require("fs");
const { appendFileSync } = require("fs");
const http = require("http");
const path = require("path");
const { parse } = require("csv-parse");
var express = require("express");
var app = express();
const logUser = [];
app.use(express.json());
app.get("/", function (req, res) {
  if (req.url.endsWith("/")) {
    app.use(express.static("./"));
    res.sendFile(path.join(__dirname, "../views/login.html"));
  }
});
app.get("/main.html", function (req, res) {
  app.use(express.static("./"));
  res.sendFile(path.join(__dirname, "../views/main.html"));
});
app.get("/userName", function (req, res) {
  res.send({ name: logUser[0] });
});
app.post("/auth", async function (req, res) {
  for (let user of data) {
    if (
      user.username == req.body.userName &&
      user.password == req.body.password
    ) {
      logUser[0] = await req.body.userName;
      res.send({ message: "ok" });
      return;
    }
  }
  res.send({ message: "not" });
});
app.post("/signup", function (req, res) {
  logUser[0] = req.body.userName;
  const csv = `\n${req.body.userName}, ${req.body.email}, ${req.body.password}`;
  const user_csv = `TaskName, time, run`;
  try {
    appendFileSync(path.join(__dirname, "../assets/user.csv"), csv);
    appendFileSync(
      path.join(__dirname, `../assets/users/${logUser[0]}.csv`),
      user_csv
    );
  } catch (err) {}
  logUser[0] = req.body.userName;
  userFileRead();
  res.send();
});
const data = [];
function userFileRead() {
  fs.createReadStream(path.join(__dirname, "../assets/user.csv"))
    .pipe(
      parse({
        delimiter: ",",
        columns: true,
        ltrim: true,
      })
    )
    .on("data", function (row) {
      data.push(row);
    })
    .on("error", function (error) {})
    .on("end", function () {});
}
const tasks = [];
app.get("/loadTask", async function (req, res) {
  tasks.length = 0;
  fs.createReadStream(path.join(__dirname, `../assets/users/${logUser[0]}.csv`))
    .pipe(
      parse({
        delimiter: ",",
        columns: true,
        ltrim: true,
      })
    )
    .on("data", function (row) {
      tasks.push(row);
    })
    .on("error", function (error) {})
    .on("end", function () {
      res.json(tasks);
    });
});
app.get("/logOutDataUpdate", async function (req, res) {
  writeData = JSON.parse("[" + req.query.list + "]");
  res.send();
  const csv = `TaskName, time, run`;
  fs.writeFileSync(
    path.join(__dirname, `../assets/users/${logUser[0]}.csv`),
    csv
  );
  for (let task of writeData) {
    user_csv = `\n${task.TaskName}, ${task.time}, no`;
    appendFileSync(
      path.join(__dirname, `../assets/users/${logUser[0]}.csv`),
      user_csv
    );
  }
});
app.get("/loadNewFile", async function (req, res) {
  fs.createReadStream(req.query.file)
    .pipe(
      parse({
        delimiter: ",",
        columns: true,
        ltrim: true,
      })
    )
    .on("data", function (row) {
      console.log(`${row.TaskName.trim()} ,${row.time.trim()} ,${row.run.trim()}`);
      user_csv = `\n${row.TaskName.trim()} ,${row.time.trim()} ,${row.run.trim()}`; 
      data.push(user_csv);
      appendFileSync(
        path.join(__dirname, `../assets/users/${logUser[0]}.csv`),
        user_csv
      );
    })
    .on("error", function (error) {}) 
    .on("end", function () {
      userFileRead();
      console.log(tasks);
      res.send("ok");
    });

});
userFileRead();

const server = http.createServer(app);
const port = 8000;
server.listen(port);

console.log(`Server running at http://127.0.0.1:${port}/`);