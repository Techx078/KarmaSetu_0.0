const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    serviceProvider: { type: mongoose.Schema.Types.ObjectId, ref: "ServiceProvider", required: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["Pending", "Completed", "Failed"], default: "Pending" },
    paymentMethod: { type: String, enum: ["UPI", "Credit Card", "Debit Card", "Net Banking", "Cash"], required: true },
    transactionId: { type: String }, // Added for consistency with verifyPayment
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);