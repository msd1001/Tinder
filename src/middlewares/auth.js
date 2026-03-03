const jwt = require("jsonwebtoken");
const User = require("../models/user");

/*
const adminAuth = (req, res, next) => {
  console.log("Admin Auth is getting checked");
  const token = "xyz";
  const isAuthenticated = token === "xyz";
  if (!isAuthenticated) {
    res.status(401).send("unauthorized Request");
  } else {
    next();
  }
};
const userAuth = (req, res, next) => {
  console.log("userAuth Auth is getting checked");
  const token = "xyz";
  const isAuthenticated = token === "xyz";
  if (!isAuthenticated) {
    res.status(401).send("unauthorized Request");
  } else {
    next();
  }
};

module.exports = {
  adminAuth,
  userAuth,
};
*/

// auth middleware is written so that we can do authentication for all api in one place . we are not doing authentication of api individually.
const userAuth = async (req, res, next) => {
  // Reading token from cookies

  try {
    const { token } = req.cookies;

    if (!token) {
      throw new Error("Token is not valid !!!!!!!");
    }

    // validate the token
    const decodedObj = await jwt.verify(token, "DEV@Tinder$790");

    const { _id } = decodedObj;

    const user = await User.findById(_id);
    req.user = user;
    if (!user) {
      throw new Error(" User not found");
    }
    next();
  } catch (err) {
    res.status(400).send("ERROR " + err.message);
  }

  // find the user
};

module.exports = {
  userAuth,
};
