const express = require("express");
// created one router
const authRouter = express.Router();

const { validateSignUpData } = require("../utils/validation.js");
const User = require("../models/user.js");
const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

//app.use("/test",authmiddleware,()=>{}) is similiar to authRouter.use("/test",authmiddleware,()=>{})
// app.post is similiar to authRouter.post
authRouter.post("/signup", async (req, res) => {
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

authRouter.post("/login", async (req, res) => {
  try {
    // req.body mtlb postman sai kuch mil rha hai
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });

    // console.log("user====>", user);

    if (!user) {
      throw new Error("Invalid Credentials");
    }
    // old method of password creation, for new method check user.js

    // const isPasswordValid = await bcrypt.compare(password, user.password);

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      // create JWT Token

      // with help of expiresIn, we are expiring the token

      //  const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$790", {
      //   expiresIn: "1d",
      // });

      // Instead of creating JWT token here , we will create it on user.js

      // agar password valid hai mtlb jis user ka email & password diya hai wahi user db sai mila hai

      const token = await user.getJWT();
      // console.log(token);

      // Add token into cookies & send response back to the user( from where post login api is hit)
      //  we are setting cookie with help of express.js
      // we can also expire cookie with help of expires field
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      // res.send mtlb hmlog kuch send kr rhe hai
      res.send("Login Successful");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR " + err.message);
  }
});

module.exports = authRouter;
