import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/User";
import { generateAccessToken } from "../utils/jwt";
import validateRequest from "../joiSchemas/validate";
import { updateUserPreferencesSchema } from "../joiSchemas/schemas";

// Get the authenticated user's information
export const getUserInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user as IUser;

    const userInfo = await User.findById(user._id).lean();

    if (!userInfo) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const accessToken = generateAccessToken(user);

    res.json({ ...userInfo, accessToken });
  } catch (err) {
    next(err);
  }
};

export const updateUserPreferences = async (
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

    const value = validateRequest(req.body, updateUserPreferencesSchema);

    user.sortPreferences = {
      ...user.sortPreferences,
      ...value.sortPreferences,
    };

    await user.save();

    res.status(200).json({ message: "Preferences updated successfully" });
  } catch (err) {
    next(err);
  }
};
