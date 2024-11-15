import mongoose, { Document, Model } from "mongoose";
import {
  CATEGORY_FILMS,
  CATEGORY_TV,
  CATEGORY_MUSIC,
  CATEGORY_EVENTS,
  CATEGORY_PLACES,
  CATEGORY_BARS_RESTAURANTS,
  SORT_BY_MOST_RECENT,
  SORT_OPTIONS,
} from "../utils/constants";

export interface IUser extends Document {
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
      | typeof CATEGORY_PLACES
      | typeof CATEGORY_BARS_RESTAURANTS]: mongoose.Types.ObjectId[];
  };
  provider: "google" | "local";
  sortPreferences: {
    [key in
      | typeof CATEGORY_FILMS
      | typeof CATEGORY_TV
      | typeof CATEGORY_MUSIC
      | typeof CATEGORY_EVENTS
      | typeof CATEGORY_PLACES
      | typeof CATEGORY_BARS_RESTAURANTS]?: (typeof SORT_OPTIONS)[number];
  };
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
      [CATEGORY_BARS_RESTAURANTS]: categorySchemaDefinition(),
    },
    provider: {
      type: String,
      enum: ["google", "local"],
      required: true,
    },
    sortPreferences: {
      [CATEGORY_FILMS]: {
        type: String,
        enum: SORT_OPTIONS,
        default: SORT_BY_MOST_RECENT,
      },
      [CATEGORY_TV]: {
        type: String,
        enum: SORT_OPTIONS,
        default: SORT_BY_MOST_RECENT,
      },
      [CATEGORY_MUSIC]: {
        type: String,
        enum: SORT_OPTIONS,
        default: SORT_BY_MOST_RECENT,
      },
      [CATEGORY_EVENTS]: {
        type: String,
        enum: SORT_OPTIONS,
        default: SORT_BY_MOST_RECENT,
      },
      [CATEGORY_PLACES]: {
        type: String,
        enum: SORT_OPTIONS,
        default: SORT_BY_MOST_RECENT,
      },
      [CATEGORY_BARS_RESTAURANTS]: {
        type: String,
        enum: SORT_OPTIONS,
        default: SORT_BY_MOST_RECENT,
      },
    },
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);
export default User;
