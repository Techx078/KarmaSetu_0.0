const express = require("express");
const router = express.Router()
const UserController = require("../controller/User.controller")
const UserValidator = require("../models/validators/User.Validators")
const UserAuth = require("../Middleware/UserAuth.Middleware")
const multer = require("multer");
const { storage } = require("../cloudConfig");
const Uploads = multer({ storage });
router.post("/register",UserValidator.userValidationRules,Uploads.single("file"),UserController.register)
router.post("/login",UserValidator.userValidationRulesLogin,UserController.login)
router.get("/profile",UserAuth.UserAuth,UserController.profile)
router.get("/user-profile/:id",UserController.get_user_profile)
module.exports = router;

// UserValidator.userValidationRules

