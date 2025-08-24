const validator = require("validator");

const validateSignUpData = (req) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new Error("all fields are required");
  } else if (!validator.isEmail(email)) {
    throw new Error("Email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password!");
  }
};

module.exports={validateSignUpData};