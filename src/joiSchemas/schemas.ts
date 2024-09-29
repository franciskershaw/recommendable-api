import Joi from "joi";
import {
  CATEGORY_FILMS,
  CATEGORY_TV,
  CATEGORY_MUSIC,
  CATEGORY_EVENTS,
  CATEGORY_PLACES,
} from "../utils/constants";

export const newRecommendSchema = Joi.object({
  name: Joi.string().trim().max(50).required().messages({
    "string.empty": "Please add a name",
    "string.max": "Name cannot be more than 50 characters",
  }),
  recommendedBy: Joi.string().trim().max(50).default("").messages({
    "string.max": "Name cannot be more than 50 characters",
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
      "any.only": "Category must be one of the predefined values",
      "string.empty": "Category is required",
    }),
});

export const editRecommendSchema = Joi.object({
  name: Joi.string().trim().max(50).required().messages({
    "string.empty": "Please add a name",
    "string.max": "Name cannot be more than 50 characters",
  }),
  recommendedBy: Joi.string().trim().max(50).default("").messages({
    "string.max": "Name cannot be more than 50 characters",
  }),
});
