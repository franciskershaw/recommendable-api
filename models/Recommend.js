const mongoose = require("mongoose");
const {
  CATEGORY_FILMS,
  CATEGORY_TV,
  CATEGORY_MUSIC,
  CATEGORY_EVENTS,
  CATEGORY_PLACES,
} = require("../utils/constants");

const RecommendSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
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
});

module.exports = mongoose.model("Recommend", RecommendSchema);
