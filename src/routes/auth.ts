import express from "express";
import passport from "passport";

import { Strategy as LocalStrategy } from "passport-local";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { refreshTokens } from "../middleware/authMiddleware";
import bcrypt from "bcryptjs";
import User, { IUser } from "../models/User";
import { GOOGLE_PROVIDER, LOCAL_PROVIDER } from "../utils/constants";

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
        // Find the user and explicitly include the password field
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
          // Artificial bcrypt comparison to prevent timing attacks
          await bcrypt.compare(password, INVALID_BCRYPT_HASH);
          return done(null, false, { message: "Invalid email or password." });
        }

        // Check if password exists before comparison
        if (!user.password) {
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
passport.serializeUser((user: Express.User, done) => {
  const typedUser = user as IUser & { _id: string }; // Cast to the correct type
  done(null, typedUser._id); // Ensure _id is used as a string
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
    const user = req.user as IUser | undefined;

    if (!user) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Send tokens to the client
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    res.json({ user, accessToken });
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
    failureRedirect: process.env.FRONTEND_URL, // Handle failure case
  }),
  (req, res) => {
    try {
      // req.user is populated by Passport if the strategy succeeds
      const user = req.user as IUser | undefined;

      if (!user) {
        return res.status(401).json({ message: "Authentication failed" });
      }

      // Generate token
      const refreshToken = generateRefreshToken(user);

      // Set refreshToken in a cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });

      // Redirect user to frontend
      res.redirect(`${process.env.FRONTEND_URL}films`);
    } catch (err) {
      console.error("Error during Google callback:", err);
      res.status(500).json({
        message: "An unexpected error occurred, please try again later.",
      });
    }
  }
);

router.post("/logout", (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
});

router.get("/refresh-token", refreshTokens);

export default router;
