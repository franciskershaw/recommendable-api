const mongoose = require("mongoose");

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
      sparse: true, // Allows this field to be optional and avoid index issues for local users
    },
    password: {
      type: String,
      select: false, // Do not return the password in queries by default
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

module.exports = mongoose.model("User", UserSchema);
