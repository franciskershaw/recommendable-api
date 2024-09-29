import express from "express";
import {
  getRecommends,
  createRecommend,
  editRecommend,
  deleteRecommend,
} from "../controllers/recommends";
import { authenticateToken } from "../middleware/authMiddleware";

const router = express.Router();

// Get recommendations
router.get("/", authenticateToken, getRecommends);

// Create a new recommendation
router.post("/", authenticateToken, createRecommend);

// Edit a recommendation
router.put("/:id", authenticateToken, editRecommend);

// Delete a recommendation
router.delete("/:id", authenticateToken, deleteRecommend);

export default router;
