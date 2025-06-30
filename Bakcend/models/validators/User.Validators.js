const { body } = require("express-validator");

module.exports.userValidationRules = [
  body("fullname.firstName")
    .trim() 
    .isAlpha()
    .withMessage("First name must contain only letters"),

  body("fullname.lastName")
    .optional()
    .trim()
    .isAlpha()
    .withMessage("Last name must contain only letters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),

  body("Address.State")
    .notEmpty()
    .trim()
    .isAlpha()
    .withMessage("State is required "),

  body("Address.District")
    .notEmpty()
    .trim()
    .isAlpha()
    .withMessage("District is required "),
    
  body("Address.Local")
    .notEmpty()
    .trim()
    .isAlpha()
    .withMessage("Local is required "),

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

  body("profileImage").optional().isString().withMessage("Invalid image URL"),

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
];

module.exports.userValidationRulesLogin=[
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
]


