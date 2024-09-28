import mongoose, { Document, Model } from "mongoose";
import {
  CATEGORY_FILMS,
  CATEGORY_TV,
  CATEGORY_MUSIC,
  CATEGORY_EVENTS,
  CATEGORY_PLACES,
} from "../utils/constants";

// Define an interface for the Recommend document
export interface IRecommend extends Document {
  _id: string;
  name: string;
  recommendedBy: string;
  category:
    | typeof CATEGORY_FILMS
    | typeof CATEGORY_TV
    | typeof CATEGORY_MUSIC
    | typeof CATEGORY_EVENTS
    | typeof CATEGORY_PLACES;
}

// Create the schema
const RecommendSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
      maxlength: [50, "Name can not be more than 50 characters"],
    },
    recommendedBy: {
      type: String,
      required: [true, "Please add a recommendedBy"],
      trim: true,
      maxlength: [50, "Name can not be more than 50 characters"],
    },
    category: {
      type: String,
      enum: [
        CATEGORY_FILMS,
        CATEGORY_TV,
        CATEGORY_MUSIC,
        CATEGORY_EVENTS,
        CATEGORY_PLACES,
      ],
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Recommend: Model<IRecommend> = mongoose.model<IRecommend>(
  "Recommend",
  RecommendSchema
);
export default Recommend;
