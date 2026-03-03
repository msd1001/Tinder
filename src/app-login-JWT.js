/*
const express = require("express");
const app = express();
// to run database
const connectDB = require("./config/database");

const User = require("./models/user");

// Another way of data validation
const { validateSignUpData } = require("./utils/validation");

const bcrypt = require("bcrypt");

const cookieParser = require("cookie-parser");

const jwt = require("jsonwebtoken");

// for implementing Authentication at one time in all API
const { userAuth } = require("./middlewares/auth.js");

// STEP 1 : create an API to insert data into database. with app.post method post api will be created

// we have used middleware so that we can receive  the data from postman dynamically otherwise we will get undefined error

app.use(express.json());

// when request will come , we will be able to parse it. It is for cookies-parser middleware. from below cmd we are adding cookie-parser middleware

app.use(cookieParser());

app.post("/signup", async (req, res) => {
  console.log(req.body);
  // Now our plan is to receive the data coming from postman body dynamically and send to server so that server read that data and send to database in this way we are removing dummy data
  try {
    // Below fn will overwrite the schema and db level  validation message only still the schema and db level validation will work.

    validateSignUpData(req);

    // Encrypting the password

    const { firstName, lastName, emailId, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

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

    // const user = new User(userObj); // dummy data pass krne ka method

    // const user = new User(req.body); // this is bad way of receiving data from postman. use below method

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    // STEP3: from below fn data will be saved to database

    // database operation must be performed in try & catch block
    // with help of below code we r able to save data to database
    await user.save();
    res.send(" User Added Successfully");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    // req.body mtlb postman sai kuch mil rha hai
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });

    // console.log("user====>", user);

    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      // create JWT Token

      const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$790");
      // console.log(token);

      // Add token into cookies & send response back to the user( from where post login api is hit)
      //  we are setting cookie with help of express.js
      res.cookie("token", token);
      // res.send mtlb hmlog kuch send kr rhe hai
      res.send("Login Successful");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR " + err.message);
  }
});

// auth middleware is passed below before calling async request handler we call
// auth middleware if this middleware succedd then only request handler will be executed,
app.get("/profile", userAuth, async (req, res) => {
  // to read cookies we need middleware called cookie-parser
  try {
    /* Below steps i have done in auth.js . so that we do not need to do this
    // in each api call
    const cookies = req.cookies;
    // console.log(cookies);
    const { token } = cookies;

    if (!token) {
      throw new Error("Invalid Token");
    }

    // validate myToken

    const decodedMessage = await jwt.verify(token, "DEV@Tinder$790");
    // decodedMessage will contain the _id which we have sent through jwt.sign

    const { _id } = decodedMessage;
    // console.log(_id);

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }
    res.send(user);

    // res.send("Reading Cookies");
    */

//     const user = req.user;
//     console.log(user);
//     res.send(user);
//   } catch (err) {
//     res.status(400).send("ERROR " + err.message);
//   }
// });

// GET users by Email id;
// app.get("/user", async (req, res) => {
//   const userEmail = req.body.emailId;

//   try {
//     const users = await User.find({ emailId: userEmail });
//     if (users.length === 0) {
//       res.status(404).send("User not found");
//     } else {
//       res.send(users);
//     }
//   } catch (err) {
//     res.status(400).send("Something Went Wrong");
//   }
// });

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
// app.get("/feed", async (req, res) => {
//   // From which modal we want to Get data ===> user Modal, we want to get user data.
//   try {
//     const users = await User.find({});
//     res.send(users);
//   } catch (err) {
//     res.status(400).send("Something Went Wrong");
//   }
// });

// app.delete("/user", async (req, res) => {
//   const userId = req.body._id;
//   console.log(userId);

//   try {
//     const user = await User.findOneAndDelete({ _id: userId });
//     // const user = await User.findByIdAndDelete(userId);
//     res.send("User deleted Successfully");
//   } catch (err) {
//     res.send(400).send("Something Went Wrong");
//   }
// });

// Update data of the user
// app.patch("/user", async (req, res) => {
// app.patch("/user/:userId", async (req, res) => {
//   // req.body is coming from postman
//   // console.log(req.body);
//   // if we pass _id from body through postman then use below method
//   // const userId = req.body._id;
//   // or if we are passing _id from url instead of body then we use req.params.userId to access it
//   const userId = req.params.userId;
//   const data = req.body;
//   // if in the data we are sending some field which is not defined in the userSchema then that will not be updated

//   try {
//     // i do not want to change my _id,but i want the _id here so to know which document i am updating,
//     // Data sanitization or API validation
//     const ALLOWED_UPDATES = [
//       // "_id",
//       "photoUrl",
//       "about",
//       "gender",
//       "age",
//       "skills",
//       "emailId",
//     ];

//     const isUpdateAllowed = Object.keys(data).every((k) =>
//       ALLOWED_UPDATES.includes(k),
//     );

//     // Data sanitization or API LEVEL validation
//     if (!isUpdateAllowed) {
//       throw new Error("Updates not Allowed ");
//     }

//     if (data.skills.length > 10) {
//       throw new Error("Skills can not be more than 10");
//     }

//     const user = await User.findByIdAndUpdate({ _id: userId }, data, {
//       returnDocument: "after",
//       runValidators: true,
//     });
//     res.send("Data updated Successfully");
//   } catch (err) {
//     res.status(400).send(err.message);
//   }
// });

// STEP 0 (A) B.B.B.IMP first connect to Database then connect to server // connect to server means we are sending api request
// connectDB()
//   .then(() => {
//     console.log("Database connection established");
//     app.listen(7777, () => {
//       console.log("Server is Successfully running at 7777....*");
//     });
//   })
//   .catch((error) => {
//     console.error("Database cannot be connected");
//   });

// app.listen(7777, () => {
//   console.log("Server is Successfully running at 7777....*");
// });
