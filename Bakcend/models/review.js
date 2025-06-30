const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    serviceProvider: { type: mongoose.Schema.Types.ObjectId, ref: "ServiceProvider", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);