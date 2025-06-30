const express = require("express");
const router = express.Router();
const reviewController = require("../controller/Review.controller");
const UserValidator = require("../models/validators/User.Validators")
const {UserAuth} = require("../Middleware/UserAuth.Middleware")


// POST review
router.post("/",UserAuth, reviewController.createReview);

// GET reviews for a service provider
router.get("/:serviceProviderId", reviewController.getReviews);
//delet review 
router.delete("/:reviewId",UserAuth, reviewController.deleteReview);
module.exports = router;