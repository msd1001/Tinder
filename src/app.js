const express = require("express");

const app = express();

// Single route could have multiple route handler fn;
app.use("/user", [
  (req, res, next) => {
    // Request Handler
    console.log("Handling the route user!!");
    // res.send("Response!!!");
    next();
  },
  (req, res) => {
    //
    console.log("Handling the route user 2!!!");
    res.send("Response 2 !!!");
  },
]);

app.listen(7777, () => {
  console.log("Server is Successfully running at 7777....*");
});
