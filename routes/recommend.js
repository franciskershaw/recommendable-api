const express = require("express");
const { Recommend } = require("../models/Recommend");
const { validateRequest } = require("../joiSchemas/validate");
const { recommendSchema } = require("../joiSchemas/schemas");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const user = req.user;
    const recommendsIds = user.recommends;

    const recommends = await Recommend.find({ _id: { $in: recommendsIds } });

    res.status(200).json(recommends);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const user = req.user;
    const { value } = validateRequest(req.body, recommendSchema);
    const { name, recommendedBy, category } = value;

    const recommend = new Recommend({
      name,
      recommendedBy,
      category,
    });

    user.recommends.push(recommend._id);

    await user.save();
    await recommend.save();
    res.status(200).json(recommend);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
