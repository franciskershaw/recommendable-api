const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { generateToken } = require("../utils/jwt");
const { registerSchema, loginSchema } = require("../utils/schemas");

const router = express.Router();

// Registration route
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const { error } = registerSchema.validate({ email, password });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

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
  const { email, password } = req.body;

  // Validate request body using Joi
  const { error } = loginSchema.validate({ email, password });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

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

// Google OAuth route
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback route
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  (req, res) => {
    // On success, generate a JWT and redirect or respond with the token
    const token = generateToken(req.user);
    res.json({ token });
  }
);

module.exports = router;