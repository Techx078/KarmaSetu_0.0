const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    User: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    serviceProvider: { type: mongoose.Schema.Types.ObjectId, ref: "ServiceProvider", required: true },
    status: { 
      type: String, 
      enum: ["Pending", "Accepted", "Ongoing", "Completed", "Paid"], // Added "Paid"
      default: "Pending" 
    },
    serviceDate: { type: Date },
    serviceTime: { type: Date },
    startTime: { type: Date },
    endTime: { type: Date },
    price: { type: Number }, // rate per minute or hour
    totalPrice: { type: Number }, // total calculated cost
    transactionId: { type: String }, // payment transaction ID
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);