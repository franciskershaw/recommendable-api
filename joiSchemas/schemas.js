const Joi = require("joi");

const categorySchema = Joi.object({
  name: Joi.string().required().min(1).max(100),
  icon: Joi.string().required().min(1).max(12),
});

module.exports = { categorySchema };
