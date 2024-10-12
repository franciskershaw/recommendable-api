import express from "express";
import asyncHandler from "express-async-handler";
import { authenticateToken } from "../middleware/authMiddleware";
import { getUserInfo, updateUserPreferences } from "../controllers/users";

const router = express.Router();

router.get("/", authenticateToken, asyncHandler(getUserInfo));

router.patch(
  "/preferences",
  authenticateToken,
  asyncHandler(updateUserPreferences)
);

export default router;
