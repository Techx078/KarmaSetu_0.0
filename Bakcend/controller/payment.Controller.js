const Razorpay = require("razorpay");
const crypto = require("node:crypto");
const Booking = require("../models/BookingRequest");
const Payment = require("../models/Payment");
const ServiceProviderModel = require("../models/ServiceProvider");
const User = require("../models/User");
const { sendBookingNotifications } = require("../utility/whatsapp");
const AppError = require("../utility/AppError")
const catchAsync = require('../utility/catchAsync')

const razorpay = new Razorpay({
  key_id: "rzp_test_yRMDkhTpavxga5",
  key_secret: "E3E0SBemg9rspZR2cCp5By9D",
});

const createOrder = catchAsync(async (req, res, next) => {
  const { amount, bookingId } = req.body;

  if (!amount || !bookingId) {
    return next(new AppError("Amount and bookingId are required", 400));
  }

  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt: `booking_${bookingId}`,
    payment_capture: 1,
  };

  const order = await razorpay.orders.create(options);
  if( !order ){
    return next(new AppError("creating order error", 401));
  }
  res.status(200).json({ ...order, bookingId });
});

const verifyPayment = catchAsync(async (req, res, next) => {
  const { paymentResponse, bookingData } = req.body;

  if (!paymentResponse || !bookingData) {
    return next(new AppError("Payment response and booking data required", 400));
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentResponse;
  const { userId, serviceProviderId, price, paymentMethod, bookingId } = bookingData;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !bookingId) {
    return next(new AppError("Missing required payment or booking data", 400));
  }

  const expectedSignature = crypto
    .createHmac("sha256", "E3E0SBemg9rspZR2cCp5By9D")
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return next(new AppError("Invalid payment signature", 400));
  }

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    return next(new AppError("Booking not found", 404));
  }

  const payment = new Payment({
    user: userId,
    serviceProvider: serviceProviderId,
    booking: bookingId,
    amount: price,
    status: "Completed",
    paymentMethod: paymentMethod || "UPI",
    transactionId: razorpay_payment_id,
  });
  await payment.save();

  booking.status = "Paid";
  booking.transactionId = razorpay_payment_id;
  await booking.save();

  const user = await User.findById(userId);
  const serviceProvider = await ServiceProviderModel.findById(serviceProviderId);

  const User_name = user?.name || "User";
  const ServiceProvider_name = serviceProvider?.name || "Service Provider";
  const User_Phone = user?.phone;
  const Service_Phone = serviceProvider?.phone;

  if (global.io) {
    global.io.to(serviceProviderId.toString()).emit("paymentReceived", {
      bookingId,
      amount: price,
      userId,
      paymentMethod: paymentMethod || "UPI",
      transactionId: razorpay_payment_id,
    });
  }

  if (User_Phone && Service_Phone) {
    const notificationResult = await sendBookingNotifications({
      whatsappClient: global.whatsappClient,
      io: global.io,
      userId: userId.toString(),
      serviceProviderId: serviceProviderId.toString(),
      bookingId,
      User_name,
      ServiceProvider_name,
      User_Phone,
      Service_Phone,
      type: "payment",
      amount: price,
    });

    if (!notificationResult.success) {
      console.error(`[Backend] Failed to send payment notifications: ${notificationResult.error}`);
    }
  }

  res.status(200).json({
    message: "Payment verified",
    bookingId,
    paymentId: razorpay_payment_id,
  });
});

module.exports = { createOrder, verifyPayment };
