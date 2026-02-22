const express = require("express");
const app = express();
// to run database
const connectDB = require("./config/database");

const User = require("./models/user");

// STEP 1 : create an API to insert data into database. with app.post method post api will be created

// we have used middleware so that we can receive  the data from postman dynamically otherwise we will get undefined error

app.use(express.json());

app.post("/signup", async (req, res) => {
  console.log(req.body);
  // Now our plan is to receive the data coming from postman body dynamically and send to server so that server read that data and send to database in this way we are removing dummy data

  // Dummy Data
  // const userObj = {
  //   firstName: "MS",
  //   lastName: "Dhoni",
  //   emailId: "Ms.Dhoni@gmail.com",
  //   password: "Dhoni@123",
  // };

  // Now we want to save this data in User Collection on database , we need to create new instance of the user modal

  //STEP2:  By creating new  instance of user modal
  //  i am creating a new user.

  // const user = new User(userObj);
  const user = new User(req.body);
  // STEP3: from below fn data will be saved to database
  try {
    // database operation must be performed in try & catch block
    // with help of below code we r able to save data to database
    await user.save();
    res.send(" User Added Successfully");
  } catch (err) {
    res.status(400).send("Bad Request", err.message);
  }
});

// STEP 0 (A) B.B.B.IMP first connect to Database then connect to server // connect to server means we are sending api request
connectDB()
  .then(() => {
    console.log("Database connection established");
    app.listen(7777, () => {
      console.log("Server is Successfully running at 7777....*");
    });
  })
  .catch((error) => {
    console.error("Database cannot be connected");
  });

// app.listen(7777, () => {
//   console.log("Server is Successfully running at 7777....*");
// });
