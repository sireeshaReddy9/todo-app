const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const { validateSignUpData } = require("../utils/validation.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { userAuth } = require("../middleware/auth.js");


router.post("/signUp", async (req, res) => {
  try {
    // validate data
    validateSignUpData(req);
    const { name, email, password } = req.body;
    // encrypt password
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);
    // creating a new instance of user model
    const user = new User({
      name,
      email,
      password: passwordHash,
    });
    await user.save();
    res.send("data inserted successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("internal error" + error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
     
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h"
    });

    res.cookie("token", token, {
      httpOnly: true,      
      sameSite: "none",      
      secure: true,        
      path: "/"            
    });
      return res.status(200).json({ message: "Logged in" });
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
   return res.status(400).send("ERROR " + error);
  }
});

router.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("something went wrong" + error.message);
  }
});

router.post("/logout", (req, res) => {
  try {
    res.clearCookie("token", { path: "/" });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(400).json({ error: "Failed to logout" });
  }
});


module.exports=router;
