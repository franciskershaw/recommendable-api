import Joi from "joi";
import {
  CATEGORY_FILMS,
  CATEGORY_TV,
  CATEGORY_MUSIC,
  CATEGORY_EVENTS,
  CATEGORY_PLACES,
} from "../utils/constants";

export const newRecommendSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "Name is required.",
  }),
  recommendedBy: Joi.string().required().messages({
    "any.required": "RecommendedBy is required.",
  }),
  category: Joi.string()
    .valid(
      CATEGORY_FILMS,
      CATEGORY_TV,
      CATEGORY_MUSIC,
      CATEGORY_EVENTS,
      CATEGORY_PLACES
    )
    .required()
    .messages({
      "any.required": "Category is required.",
    }),
});
