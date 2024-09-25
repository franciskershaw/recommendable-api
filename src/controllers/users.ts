import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/User";

// Get the authenticated user's information
export const getUserInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user as IUser | undefined;

    if (!user || !user._id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const userInfo = await User.findById(user._id);
    res.json(userInfo);
  } catch (err) {
    next(err);
  }
};
