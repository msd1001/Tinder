const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

profileRouter.get("/profile", userAuth, async (req, res) => {
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

    const user = req.user;
    console.log(user);
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR " + err.message);
  }
});

module.exports = profileRouter;
