import express from "express";
import asyncHandler from "express-async-handler";
import { authenticateToken } from "../middleware/authMiddleware";
import User, { IUser } from "../models/User"; // Import the IUser interface

const router = express.Router();

router.get(
  "/",
  authenticateToken,
  asyncHandler(async (req, res, next) => {
    const user = req.user as IUser | undefined;

    if (!user || !user._id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const userInfo = await User.findById(user._id);
    res.json(userInfo);
    return;
  })
);

export default router;
