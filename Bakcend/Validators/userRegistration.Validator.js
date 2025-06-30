const Joi = require("joi");

const registerUserSchema = Joi.object({
  firstName: Joi.string().required().messages({
    "string.empty": "First name is required",
  }),
  lastName: Joi.string().required().messages({
    "string.empty": "Last name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Email must be valid",
    "string.empty": "Email is required",
  }),
  phone: Joi.string().min(10).required().messages({
    "string.min": "Phone must be at least 10 digits",
    "string.empty": "Phone is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "string.empty": "Password is required",
  }),
  State: Joi.string().required(),
  District: Joi.string().required(),
  Local: Joi.string().required(),
  latitude: Joi.any().required(),
  longitude: Joi.any().required(),
});

module.exports = { registerUserSchema };
