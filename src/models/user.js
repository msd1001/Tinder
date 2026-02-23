const mongoose = require("mongoose");
// Below we have created user Schema
// After connecting database and server in app file , define schema. STEP 0(B) then step1 will start from creating API
const userSchema = new mongoose.Schema(
  {
    // mongoose will not allow insertion of record in database if required field value is not entered while doing registeration
    // required check is added
    // unique check
    // All these check we are putting at database level
    // All these are schema vaidation

    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      type: String,
    },
    // We cannot create a new user with already existing email-ID
    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      // Custom validatons will work by default on new document insert , to enable it to work for update also we need to add runValidators : true in put and patch method.
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender data is not valid");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2E1ISMWr2Xdz5yB3pjWAgs0drcWCw9vya5A&s",
    },
    // if user did  not pass about field then it will be automatically created with default value in db because of default value check
    about: {
      type: String,
      default: "This is default about user",
    },

    // if  type is an array and value is not provided then it will automatically take empty value in array.
    skills: {
      type: [String],
    },
  },
  { timestamps: true },
);

// Now we will be creating Mongoose model
// Below we have created user Model
const User = mongoose.model("User", userSchema);

// agr new user create kerna hai then we need to create new instance from model
module.exports = User;

// create api to add data to database
