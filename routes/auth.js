const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { generateAccessToken, generateRefreshToken } = require("../utils/jwt");
const { refreshTokens } = require("../middleware/authMiddleware");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { GOOGLE_PROVIDER, LOCAL_PROVIDER } = require("../utils/constants");

const router = express.Router();

const INVALID_BCRYPT_HASH = "$2b$12$invalidsaltinvalidhash";

// Local strategy configuration
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
          await bcrypt.compare(password, INVALID_BCRYPT_HASH);
          return done(null, false, { message: "Invalid email or password." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Invalid email or password." });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Local login route
router.post(
  "/login",
  passport.authenticate(LOCAL_PROVIDER, {
    session: false,
    failureRedirect: "/login",
  }),
  (req, res) => {
    const user = req.user;
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Send tokens to the client
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    res.json({ accessToken });
  }
);

// Google OAuth route
router.get(
  "/google",
  passport.authenticate(GOOGLE_PROVIDER, { scope: ["profile", "email"] })
);

// Google OAuth callback route
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  (req, res) => {
    const user = req.user;
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Send tokens to the client
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    res.json({ accessToken });
  }
);

router.post("/logout", (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
});

router.post("/refresh-token", refreshTokens);

module.exports = router;
