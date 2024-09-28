import { Request, Response, NextFunction } from "express";
import Recommend, { IRecommend } from "../models/Recommend";
import validateRequest from "../joiSchemas/validate";
import { newRecommendSchema } from "../joiSchemas/schemas"; // Updated name as requested
import { IUser } from "../models/User";

// Get all recommendations for a user
export const getRecommends = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user as IUser;
    const recommendsIds = user.recommends;

    const recommends = await Recommend.find({ _id: { $in: recommendsIds } });

    res.status(200).json(recommends);
  } catch (err) {
    next(err);
  }
};

// Create a new recommendation
export const createRecommend = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user as IUser;

    // Validate request body
    const { value } = validateRequest(req.body, newRecommendSchema);
    const { name, recommendedBy, category } = value;

    // Create new recommend document
    const recommend = new Recommend({
      name,
      recommendedBy,
      category,
    }) as IRecommend;

    // Add the recommend ID to the user's recommends list
    user.recommends.push(recommend._id);

    // Save the recommend and update the user
    await user.save();
    await recommend.save();

    res.status(200).json(recommend);
  } catch (err) {
    next(err);
  }
};
