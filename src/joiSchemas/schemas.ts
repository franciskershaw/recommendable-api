import Joi from "joi";
import {
  CATEGORY_FILMS,
  CATEGORY_TV,
  CATEGORY_MUSIC,
  CATEGORY_EVENTS,
  CATEGORY_PLACES,
  SORT_OPTIONS,
  CATEGORY_BARS_RESTAURANTS,
} from "../utils/constants";

export const newRecommendSchema = Joi.object({
  name: Joi.string().trim().max(50).required().messages({
    "string.empty": "Please add a name",
    "string.max": "Name cannot be more than 50 characters",
  }),
  recommendedBy: Joi.string()
    .trim()
    .max(50)
    .optional()
    .allow("")
    .default("")
    .messages({
      "string.max": "Name cannot be more than 50 characters",
    }),
  category: Joi.string()
    .valid(
      CATEGORY_FILMS,
      CATEGORY_TV,
      CATEGORY_MUSIC,
      CATEGORY_EVENTS,
      CATEGORY_PLACES,
      CATEGORY_BARS_RESTAURANTS
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
  recommendedBy: Joi.string()
    .trim()
    .max(50)
    .optional()
    .allow("")
    .default("")
    .messages({
      "string.max": "Name cannot be more than 50 characters",
    }),
});

export const updateUserPreferencesSchema = Joi.object({
  sortPreferences: Joi.object({
    [CATEGORY_FILMS]: Joi.string()
      .valid(...SORT_OPTIONS)
      .optional()
      .messages({
        "any.only": "Invalid sorting option for films",
      }),
    [CATEGORY_TV]: Joi.string()
      .valid(...SORT_OPTIONS)
      .optional()
      .messages({
        "any.only": "Invalid sorting option for TV",
      }),
    [CATEGORY_MUSIC]: Joi.string()
      .valid(...SORT_OPTIONS)
      .optional()
      .messages({
        "any.only": "Invalid sorting option for music",
      }),
    [CATEGORY_EVENTS]: Joi.string()
      .valid(...SORT_OPTIONS)
      .optional()
      .messages({
        "any.only": "Invalid sorting option for events",
      }),
    [CATEGORY_PLACES]: Joi.string()
      .valid(...SORT_OPTIONS)
      .optional()
      .messages({
        "any.only": "Invalid sorting option for places",
      }),
    [CATEGORY_BARS_RESTAURANTS]: Joi.string()
      .valid(...SORT_OPTIONS)
      .optional()
      .messages({
        "any.only": "Invalid sorting option for bars and restaurants",
      }),
  })
    .min(1)
    .required()
    .messages({
      "object.min": "At least one sort preference must be provided",
      "object.base": "Sort preferences must be provided",
    }),
});
