const { body } = require("express-validator");

module.exports.serviceProviderValidationRules = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isAlpha()
    .withMessage("First name must contain only letters"),

  body("lastName")
    .optional()
    .trim()
    .isAlpha()
    .withMessage("Last name must contain only letters"),
  
  body("Address.State")
    .notEmpty()
    .trim()
    .isAlpha()
    .withMessage("Address is required "),

  body("Address.District")
    .notEmpty()
    .trim()
    .isAlpha()
    .withMessage("Address is required "),
    
  body("Address.Local")
    .notEmpty()
    .trim()
    .isAlpha()
    .withMessage("Address is required "),  
    
  body("experience")
    .notEmpty()
    .trim()
    .withMessage("experience is required "),  

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Phone number must be a valid Indian mobile number"),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  body("profileImage")
    .optional()
    .isString()
    .withMessage("Invalid image URL"),

  body("location.latitude")
    .notEmpty()
    .withMessage("Latitude is required")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be between -90 and 90"),

  body("location.longitude")
    .notEmpty()
    .withMessage("Longitude is required")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be between -180 and 180"),

  body("service.name")
    .notEmpty()
    .withMessage("Service name is required")
    .isString()
    .withMessage("Service name must be a valid string"),

  body("service.pricingModel")
    .notEmpty()
    .withMessage("Pricing model is required")
    .isIn(["Hourly", "Fixed", "Custom"])
    .withMessage("Pricing model must be one of: Hourly, Fixed, Custom"),

  body("service.price")
    .if((value, { req }) => req.body.service.pricingModel !== "Custom")
    .notEmpty()
    .withMessage("Price is required for Hourly or Fixed pricing models")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
];

module.exports.serviceProviderValidationRulesLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];
