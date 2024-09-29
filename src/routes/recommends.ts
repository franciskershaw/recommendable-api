import express from "express";
import { getRecommends, createRecommend } from "../controllers/recommends";
import { authenticateToken } from "../middleware/authMiddleware";

const router = express.Router();

// Get recommendations
router.get("/", authenticateToken, getRecommends);

// Create a new recommendation
router.post("/", authenticateToken, createRecommend);

router.put("/:id", authenticateToken, createRecommend);

export default router;
