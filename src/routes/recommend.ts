import express from "express";
import Recommend, { IRecommend } from "../models/Recommend";
import validateRequest from "../joiSchemas/validate";
import { recommendSchema } from "../joiSchemas/schemas"; // rename this to 'newRecommendSchema'
import { IUser } from "../models/User";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const user = req.user as IUser;
    const recommendsIds = user.recommends;

    const recommends = await Recommend.find({ _id: { $in: recommendsIds } });

    res.status(200).json(recommends);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const user = req.user as IUser;
    const { value } = validateRequest(req.body, recommendSchema);
    const { name, recommendedBy, category } = value;

    const recommend = new Recommend({
      name,
      recommendedBy,
      category,
    }) as IRecommend;

    user.recommends.push(recommend._id);

    await user.save();
    await recommend.save();
    res.status(200).json(recommend);
  } catch (err) {
    next(err);
  }
});

export default router;
