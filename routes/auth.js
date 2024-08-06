const express = require("express");
const passport = require("passport");
const User = require("../models/User");
const { generateToken } = require("../utils/jwt");

const router = express.Router();

// Registration route
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = new User({ email, password });
    await user.save();

    const token = generateToken(user);
    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login route
router.post("/login", (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res
        .status(400)
        .json({ message: info ? info.message : "Login failed", user });
    }

    const token = generateToken(user);
    res.json({ token });
  })(req, res, next);
});

module.exports = router;
