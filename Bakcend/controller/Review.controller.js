const ServiceProvider = require("../models/ServiceProvider");
const Review = require("../models/review");
const AppError = require("../utility/AppError")
const catchAsync = require('../utility/catchAsync')

// Create a new review
module.exports.createReview = catchAsync(async (req, res, next) => {
  const { serviceProviderId, rating, comment } = req.body;
  if( !serviceProviderId || !rating || !comment ){
    return next(new AppError("Rating or comment not found", 400));
  }
  const userId = req.User._id;
  if( !userId ){
    return next(new AppError("user not found", 400));
  }
  const review = new Review({
    user: userId,
    serviceProvider: serviceProviderId,
    rating,
    comment,
  });
  await review.save();

  // Update average rating
  const reviews = await Review.find({ serviceProvider: serviceProviderId });
  const average = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

  const updatedSP = await ServiceProvider.findByIdAndUpdate(
    serviceProviderId,
    {
      rating: {
        average: average.toFixed(1),
        totalRatings: reviews.length,
      },
    },
    { new: true }
  );

  res.status(201).json({ message: "Review added successfully", review, updatedSP });
});

// Get all reviews for a service provider
module.exports.getReviews = catchAsync(async (req, res, next) => {
  const { serviceProviderId } = req.params;

  const reviews = await Review.find({ serviceProvider: serviceProviderId })
    .populate("user")
    .sort({ createdAt: -1 });
  if( !reviews ){
    return next(new AppError("Review not found for this service provider", 404));
  }
  res.status(200).json({ reviews });
});

// Delete a review
module.exports.deleteReview = catchAsync(async (req, res, next) => {
  const { reviewId } = req.params;

  const review = await Review.findById(reviewId);
  if (!review) {
    return next(new AppError("Review not found", 404));
  }

  // Check if current user owns the review
  if (!review.user.equals(req.User._id)) {
    return next(new AppError("Unauthorized to delete this review", 403));
  }

  await Review.findByIdAndDelete(reviewId);

  res.status(200).json({ message: "Review deleted successfully" });
});
