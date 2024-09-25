import express from "express";
import { getRecommends, createRecommend } from "../controllers/recommend";

const router = express.Router();

// Get recommendations
router.get("/", getRecommends);

// Create a new recommendation
router.post("/", createRecommend);

export default router;
