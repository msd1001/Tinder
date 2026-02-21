/*
const express = require("express");

const app = express();

*/
// Routes check from top to bottom ,
// order of routes matter a lot.

// this will match only get HTTP method  call

// app.get("/user", (req, res) => {
//   res.send({ FirstName: " Madhuresh", LastName: "Singh" });
// });

// app.post("/user", (req, res) => {
//   // saving data to DB
//   res.send("Data successfully saved to the database");
// });

// app.delete("/user", (req, res) => {
//   res.send("Deleted Successfully");
// });

/*ADVANCED ROUTING CONCEPT */

// app.get("/user", (req, res) => {
//   console.log(req.query);
//   res.send("HAHAHAHAHAHAH");
// });

// app.get("/user/:userId", (req, res) => {
//   console.log(req.params);
//   res.send("HAHAHAHAHAHAH");
// });

// userId,name and password coming from server

// app.get("/user/:userId/:name/:password", (req, res) => {
//   console.log(req.params);
//   res.send("HAHAHAHAHAHAH");
// });

// Routes check from top to bottom ,
// order of routes matter a lot.

/* this will match all HTTP method API calls (like get,post,put) all will give same result 

app.use("/hello/2", (req, res) => {
  res.send("Abara ka Dabara");
});

app.use("/hello", (req, res) => {
  res.send("Hello");
});

app.use("/test", (req, res) => {
  res.send("Hello from test");
});
app.use("/", (req, res) => {
  res.send(" Madhuresh");
});

*/

// app.listen(7777, () => {
//   console.log("Server is Successfully running at 7777....*");
// });
