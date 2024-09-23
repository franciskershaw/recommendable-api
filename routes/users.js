const express = require("express");
const asyncHandler = require("express-async-handler");
const { authenticateToken } = require("../middleware/authMiddleware");
const User = require("../models/User");

const router = express.Router();

router.get(
  "/",
  authenticateToken,
  asyncHandler(async (req, res, next) => {
    try {
      console.log(req.user);
      const userInfo = await User.findById(req.user._id);
      res.json(userInfo);
    } catch (err) {
      next(err);
    }
  })
);

module.exports = router;
