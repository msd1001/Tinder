const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Hello Madhuresh");
});
app.get("/hello", (req, res) => {
  res.send("Bye");
});
app.get("/test", (req, res) => {
  res.send("Hello from test");
});

app.listen(7777, () => {
  console.log("Server is Successfully running at 7777....*");
});
