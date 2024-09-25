import mongoose, { Document, Model } from "mongoose";

// Define an interface for the User document
export interface IUser extends Document {
  _id: string;
  email: string;
  googleId?: string;
  password?: string;
  name?: string;
  role: "user" | "admin";
  recommends: string[];
  provider: "google" | "local";
}

// Create the schema
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
    recommends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recommend",
      },
    ],
    provider: {
      type: String,
      enum: ["google", "local"],
      required: true,
    },
  },
  { timestamps: true }
);

// Export the model with the IUser type
const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);
export default User;
