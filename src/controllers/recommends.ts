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

// Get all recommendations (non-archived or archived) for a user
export const getRecommends = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req.user as IUser)._id;
    const isArchived = req.query.isArchived === "true";

    const user = await User.findById(userId)
      .populate({
        path: "recommends.films",
        match: { isArchived },
      })
      .populate({
        path: "recommends.tv",
        match: { isArchived },
      })
      .populate({
        path: "recommends.music",
        match: { isArchived },
      })
      .populate({
        path: "recommends.events",
        match: { isArchived },
      })
      .populate({
        path: "recommends.places",
        match: { isArchived },
      });

    if (!user) {
      throw new Error("User not found");
    }

    const categorisedRecommends = {
      [CATEGORY_FILMS]: user.recommends.films,
      [CATEGORY_TV]: user.recommends.tv,
      [CATEGORY_MUSIC]: user.recommends.music,
      [CATEGORY_EVENTS]: user.recommends.events,
      [CATEGORY_PLACES]: user.recommends.places,
    };

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
    const { name, category } = value;
    let { recommendedBy } = value;

    if (!recommendedBy || recommendedBy.trim() === "") {
      recommendedBy = user.name;
    }

    const recommend = new Recommend({
      name,
      recommendedBy,
      category,
    }) as IRecommend;

    await recommend.save({ session });

    const validCategory = category as keyof typeof user.recommends;
    user.recommends[validCategory].push(recommend._id);

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

    const user = await User.findOne({
      _id: userId,
      $or: [
        { "recommends.films": recommendId },
        { "recommends.tv": recommendId },
        { "recommends.music": recommendId },
        { "recommends.events": recommendId },
        { "recommends.places": recommendId },
      ],
    }).session(session);

    if (!user) {
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

    const user = await User.findOneAndUpdate(
      {
        _id: userId,
        $or: [
          { "recommends.films": recommendId },
          { "recommends.tv": recommendId },
          { "recommends.music": recommendId },
          { "recommends.events": recommendId },
          { "recommends.places": recommendId },
        ],
      },
      {
        $pull: {
          "recommends.films": recommendId,
          "recommends.tv": recommendId,
          "recommends.music": recommendId,
          "recommends.events": recommendId,
          "recommends.places": recommendId,
        },
      },
      { new: true, session }
    );

    if (!user) {
      throw new Error("Recommendation not found for the user");
    }

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

// Archive a recommendation
export const archiveRecommend = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req.user as IUser)._id;
    const recommendId = req.params.id;

    const user = await User.findOne({
      _id: userId,
      $or: [
        { "recommends.films": recommendId },
        { "recommends.tv": recommendId },
        { "recommends.music": recommendId },
        { "recommends.events": recommendId },
        { "recommends.places": recommendId },
      ],
    });

    if (!user) {
      throw new Error("Recommendation not found for the user");
    }

    const recommend = await Recommend.findByIdAndUpdate(
      recommendId,
      { isArchived: true },
      { new: true }
    );

    if (!recommend) {
      throw new Error("Recommendation not found");
    }

    res.status(200).json(recommend);
  } catch (err) {
    next(err);
  }
};

// Unarchive a recommendation
export const unarchiveRecommend = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req.user as IUser)._id;
    const recommendId = req.params.id;

    const user = await User.findOne({
      _id: userId,
      $or: [
        { "recommends.films": recommendId },
        { "recommends.tv": recommendId },
        { "recommends.music": recommendId },
        { "recommends.events": recommendId },
        { "recommends.places": recommendId },
      ],
    });

    if (!user) {
      throw new Error("Recommendation not found for the user");
    }

    const recommend = await Recommend.findByIdAndUpdate(
      recommendId,
      { isArchived: false },
      { new: true }
    );

    if (!recommend) {
      throw new Error("Recommendation not found");
    }

    res.status(200).json(recommend);
  } catch (err) {
    next(err);
  }
};
