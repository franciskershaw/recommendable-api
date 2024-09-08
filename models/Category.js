const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    icon: {
      type: String,
      required: [true, "Please choose an icon"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", CategorySchema);
