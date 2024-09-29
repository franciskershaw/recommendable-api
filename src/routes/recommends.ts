import express from "express";
import {
  getRecommends,
  getArchivedRecommends,
  createRecommend,
  editRecommend,
  deleteRecommend,
  archiveRecommend,
  unarchiveRecommend,
} from "../controllers/recommends";
import { authenticateToken } from "../middleware/authMiddleware";

const router = express.Router();

// Get recommendations
router.get("/", authenticateToken, getRecommends);
router.get("/archived", authenticateToken, getArchivedRecommends);

// Create a new recommendation
router.post("/", authenticateToken, createRecommend);

// Edit a recommendation
router.put("/:id", authenticateToken, editRecommend);

// Delete a recommendation
router.delete("/:id", authenticateToken, deleteRecommend);

// Archive and unarchive recommendations
router.put("/:id/archive", authenticateToken, archiveRecommend);
router.put("/:id/unarchive", authenticateToken, unarchiveRecommend);

export default router;
