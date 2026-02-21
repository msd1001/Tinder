const mongoose = require("mongoose");
// Below we have created user Schema
// After connecting database and server in app file , define schema. STEP 0(B) then step1 will start from creating API
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  emailId: {
    type: String,
  },
  password: {
    type: String,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
  },
});

// Now we will be creating Mongoose model
// Below we have created user Model
const User = mongoose.model("User", userSchema);

// agr new user create kerna hai then we need to create new instance from model
module.exports = User;

// create api to add data to database
