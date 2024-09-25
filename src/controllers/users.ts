import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/User";
import { generateAccessToken } from "../utils/jwt";

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

    const userInfo = await User.findById(user._id).lean();

    if (!userInfo) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const accessToken = generateAccessToken(user);
    console.log(accessToken);

    // Return the user information along with the access token
    res.json({ ...userInfo, accessToken });
  } catch (err) {
    next(err);
  }
};
