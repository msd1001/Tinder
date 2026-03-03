const validator = require("validator");

// Another way of validating the data coming from postman or form
const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is not Valid");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not Valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not Valid");
  }
};

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "photoUrl",
    "age",
    "gender",
    "about",
    "skills",
  ];
  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field),
  );

  return isEditAllowed;
};

module.exports = { validateSignUpData, validateEditProfileData };
