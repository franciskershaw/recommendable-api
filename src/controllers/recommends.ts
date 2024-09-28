import { Request, Response, NextFunction } from "express";
import Recommend, { IRecommend } from "../models/Recommend";
import validateRequest from "../joiSchemas/validate";
import { newRecommendSchema } from "../joiSchemas/schemas"; // Updated name as requested
import User, { IUser } from "../models/User";
import {
  CATEGORY_FILMS,
  CATEGORY_TV,
  CATEGORY_MUSIC,
  CATEGORY_EVENTS,
  CATEGORY_PLACES,
} from "../utils/constants";
import mongoose from "mongoose";

// Get all recommendations for a user
export const getRecommends = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req.user as IUser)._id;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const recommendsIds = user.recommends;

    const recommends = await Recommend.find({ _id: { $in: recommendsIds } });

    const categorisedRecommends = recommends.reduce(
      (acc, recommend) => {
        return {
          ...acc,
          [recommend.category]: acc[recommend.category].concat(
            recommend.toObject()
          ),
        };
      },
      {
        [CATEGORY_FILMS]: [],
        [CATEGORY_TV]: [],
        [CATEGORY_MUSIC]: [],
        [CATEGORY_EVENTS]: [],
        [CATEGORY_PLACES]: [],
      }
    );

    res.status(200).json(categorisedRecommends);
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
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = (req.user as IUser)._id;

    const user = await User.findById(userId).session(session);

    if (!user) {
      throw new Error("User not found");
    }

    const value = validateRequest(req.body, newRecommendSchema);
    const { name, recommendedBy, category } = value;

    const recommend = new Recommend({
      name,
      recommendedBy,
      category,
    }) as IRecommend;

    await recommend.save({ session });

    user.recommends.push(recommend._id);

    await user.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json(recommend);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
};
