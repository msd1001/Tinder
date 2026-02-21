const express = require("express");
const app = express();

// First way of handling error
/*
app.get("/getUserData", (req, res) => {
  // Logic of DB call and get the user Data
  throw new Error("Error");
  // if we throw error it will go to below routes('/')
  res.send("User Data Sent");
});

app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("Something went wrong");
  }
});
*/
// Second way of handling error

app.get("/getUserData", (req, res) => {
  try {
    // Logic of DB call and get the user Data
    throw new Error("Error");
    res.send("User Data Sent");
  } catch {
    res.status(500).send("Something went wrong Contact Support team");
  }
});

app.listen(7777, () => {
  console.log("Server is Successfully running at 7777....*");
});
