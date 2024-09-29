import { Request, Response, NextFunction } from "express";
import Recommend, { IRecommend } from "../models/Recommend";
import validateRequest from "../joiSchemas/validate";
import { newRecommendSchema, editRecommendSchema } from "../joiSchemas/schemas";
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

// Edit an existing recommendation
export const editRecommend = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = (req.user as IUser)._id;
    const recommendId = req.params.id;

    const user = await User.findById(userId).session(session);

    if (!user) {
      throw new Error("User not found");
    }

    if (!user.recommends.includes(recommendId)) {
      throw new Error("Recommendation not found for the user");
    }

    const value = validateRequest(req.body, editRecommendSchema);
    const { name, recommendedBy } = value;

    const recommend = await Recommend.findByIdAndUpdate(
      recommendId,
      { name, recommendedBy },
      { new: true, session }
    );

    if (!recommend) {
      throw new Error("Recommendation not found");
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json(recommend);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
};

// Delete a recommendation
export const deleteRecommend = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = (req.user as IUser)._id;
    const recommendId = req.params.id;

    const user = await User.findById(userId).session(session);

    if (!user) {
      throw new Error("User not found");
    }

    if (!user.recommends.includes(recommendId)) {
      throw new Error("Recommendation not found for the user");
    }

    // Remove the recommendation from the user's list
    user.recommends = user.recommends.filter(
      (id) => id.toString() !== recommendId
    );

    // Save the updated user
    await user.save({ session });

    // Delete the recommendation document
    const recommend = await Recommend.findByIdAndDelete(recommendId).session(
      session
    );

    if (!recommend) {
      throw new Error("Recommendation not found");
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: "Recommendation successfully deleted" });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
};
