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
    res.status(400).send(err.message);
  }
});

// GET users by Email id;
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const users = await User.find({ emailId: userEmail });
    if (users.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Something Went Wrong");
  }
});

// GET oldest users by Email id if there are more than one user by same email id

/*
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const user = await User.findOne({ emailId: userEmail });
    if (user.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Something Went Wrong");
  }
});
*/

// Feed API - Get/feed  get all users from database
app.get("/feed", async (req, res) => {
  // From which modal we want to Get data ===> user Modal, we want to get user data.
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something Went Wrong");
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body._id;
  console.log(userId);

  try {
    const user = await User.findOneAndDelete({ _id: userId });
    // const user = await User.findByIdAndDelete(userId);
    res.send("User deleted Successfully");
  } catch (err) {
    res.send(400).send("Something Went Wrong");
  }
});

// Update data of the user

app.patch("/user", async (req, res) => {
  // req.body is coming from postman
  // console.log(req.body);
  const userId = req.body._id;
  const data = req.body;
  // if in the data we are sending some field which is not defined in the userSchema then that will not be updated

  try {
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });
    res.send("Data updated Successfully");
  } catch (err) {
    res.status(400).send(err.message);
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
