import mongoose, { Document, Model } from "mongoose";
import {
  CATEGORY_FILMS,
  CATEGORY_TV,
  CATEGORY_MUSIC,
  CATEGORY_EVENTS,
  CATEGORY_PLACES,
} from "../utils/constants";

export interface IUser {
  _id: mongoose.Types.ObjectId;
  email: string;
  googleId?: string;
  password?: string;
  name?: string;
  role: "user" | "admin";
  recommends: {
    [key in
      | typeof CATEGORY_FILMS
      | typeof CATEGORY_TV
      | typeof CATEGORY_MUSIC
      | typeof CATEGORY_EVENTS
      | typeof CATEGORY_PLACES]: mongoose.Types.ObjectId[];
  };
  provider: "google" | "local";
}

const categorySchemaDefinition = () => [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recommend",
  },
];

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    password: {
      type: String,
      select: false,
    },
    name: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    recommends: {
      [CATEGORY_FILMS]: categorySchemaDefinition(),
      [CATEGORY_TV]: categorySchemaDefinition(),
      [CATEGORY_MUSIC]: categorySchemaDefinition(),
      [CATEGORY_EVENTS]: categorySchemaDefinition(),
      [CATEGORY_PLACES]: categorySchemaDefinition(),
    },
    provider: {
      type: String,
      enum: ["google", "local"],
      required: true,
    },
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);
export default User;
