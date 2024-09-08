const { BadRequestError } = require("../utils/errors");

const validateRequest = (payload, schema) => {
  const { value, error } = schema.validate(payload);
  if (error) {
    throw new BadRequestError(error.details[0].message);
  }
  return value;
};

export default validateRequest;
