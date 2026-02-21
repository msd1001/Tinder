const express = require("express");
const app = express();
const { adminAuth, userAuth } = require("./middlewares/auth");

// Single route could have multiple route handler fn; // There is no hard rule that we cannot say middleware a route handler fn
/*
app.use("/user", [
  (req, res, next) => {
    // Middleware fn is those fn in which we write next()
    console.log("Handling the route user!!");
    // res.send("Response!!!");
    next();
  },
  (req, res) => {
    // Routhandler fn is those which actually send the response
    console.log("Handling the route user 2!!!");
    res.send("Response 2 !!!");
  },
]);

*/

// Another way of writing multiple route handler fn

/*
app.use("/user", (req, res, next) => {
  console.log("Handling the new route user!!");
  next();
});
app.use("/user", (req, res, next) => {
  res.send("New Response");
});

*/

// Below middleware will be called for only admin routes , for admin api call we want to check authorization so we have put authorization concept at middleware instead of puttig in all admin routes, if api starts with  admin/getAlluser etc  then also middleware will called.

app.use("/admin", adminAuth);
// app.use("/user", userAuth);

app.get("/admin/getAllUser", (req, res) => {
  res.send("All Data Sent");
});
app.get("/admin/deleteUser", (req, res) => {
  res.send("Deleted a user");
});

// user Login does not need authorization
app.get("/user/login", (req, res) => {
  res.send("User logged in Successfully");
});

// user data need authorization
app.get("/user/data", userAuth, (req, res) => {
  res.send("User Data Sent");
});

app.listen(7777, () => {
  console.log("Server is Successfully running at 7777....*");
});
