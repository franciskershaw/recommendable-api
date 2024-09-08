const express = require("express");
const Category = require("../models/Category");
const validateRequest = require("../joiSchemas/validate");
const { categorySchema } = require("../joiSchemas/schemas");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const value = validateRequest(req.body, categorySchema);

    const category = new Category(value);
    await category.save();

    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", (req, res) => {});

router.delete("/:id", (req, res) => {});

module.exports = router;
