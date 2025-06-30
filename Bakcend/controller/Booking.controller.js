
const Booking = require("../models/BookingRequest");
const User = require("../models/User");
const ServiceProviderModel = require("../models/ServiceProvider");
const { sendBookingNotifications } = require("../utility/whatsapp");
const Razorpay = require("razorpay");
const crypto = require("node:crypto");
const Payment = require("../models/Payment");
const AppError = require("../utility/AppError")
const catchAsync = require('../utility/catchAsync')
const io = global.io;

// Helper to get socket ID and log missing sockets
function getSocketId(id) {
  const socketId = global.activeSockets[id];
  if (!socketId) {
    console.warn(`No active socket found for ID: ${id}`);
  }
  return socketId || null;
}

const razorpay = new Razorpay({
  key_id: "rzp_test_yRMDkhTpavxga5",
  key_secret: "E3E0SBemg9rspZR2cCp5By9D",
});

// Create a new booking

module.exports.BookMyService = catchAsync(async (req, res, next) => {
  const {
    ServiceProvider_name,
    Service_Phone,
    User_Phone,
    User_name,
    serviceProviderId,
    userId,
  } = req.body;

  if (!userId || !serviceProviderId || !User_Phone || !Service_Phone || !ServiceProvider_name || !User_name) {
    return next(new AppError('Missing required fields', 400));
  }

  // Normalize phone numbers
  let normalizedUserPhone = User_Phone;
  let normalizedServicePhone = Service_Phone;
  const cleanUserPhone = User_Phone.replace(/\D/g, "");
  const cleanServicePhone = Service_Phone.replace(/\D/g, "");

  if (cleanUserPhone.length === 10 && !User_Phone.startsWith("+")) {
    normalizedUserPhone = `+91${cleanUserPhone}`;
  }
  if (cleanServicePhone.length === 10 && !Service_Phone.startsWith("+")) {
    normalizedServicePhone = `+91${cleanServicePhone}`;
  }

  // Validate phone number format
  if (
    !normalizedUserPhone.startsWith("+91") ||
    normalizedUserPhone.replace(/\D/g, "").length !== 12
  ) {
    return next(
      new AppError(
        "User phone must be a 10-digit Indian number or +91 followed by 10 digits",
        400
      )
    );
  }
  if (
    !normalizedServicePhone.startsWith("+91") ||
    normalizedServicePhone.replace(/\D/g, "").length !== 12
  ) {
    return next(
      new AppError(
        "Service provider phone must be a 10-digit Indian number or +91 followed by 10 digits",
        400
      )
    );
  }

  // Create new booking with pending status
  const newBooking = new Booking({
    User: userId,
    serviceProvider: serviceProviderId,
    status: "Pending",
  });

  const savedBooking = await newBooking.save();

  // Emit booking to sockets
  const response = await Booking.findById(savedBooking._id)
    .populate("User")
    .populate("serviceProvider")
    .select(
      "status serviceDate startTime endTime price totalPrice transactionId createdAt"
    );

  const userSocketId = getSocketId(userId);
  const spSocketId = getSocketId(serviceProviderId);
  if( !userSocketId || !spSocketId ){
    return next(new AppError('socketId error', 400));
  }
  io.to(userSocketId).emit("pendingU", response);
  io.to(spSocketId).emit("pendingS", response);

  // Send WhatsApp notifications
  const notificationResult = await sendBookingNotifications({
    whatsappClient: global.whatsappClient,
    io: global.io,
    userId,
    serviceProviderId,
    bookingId: savedBooking._id,
    User_name,
    ServiceProvider_name,
    User_Phone: normalizedUserPhone,
    Service_Phone: normalizedServicePhone,
  });

  if (!notificationResult.success) {
    return next(new AppError(notificationResult.error, 500));
  }

  res.status(200).json({
    message: "Booking created successfully and notifications sent",
    id: savedBooking._id,
  });
});

// Update booking status to Accepted
module.exports.BookingfterAccepted = catchAsync(async (req, res, next) => {
  const Bid = req.params.Bid;

  if (!Bid) {
    return next(new AppError('Booking ID is required', 400));
  }

  const updatedBooking = await Booking.findByIdAndUpdate(
    Bid,
    { status: "Accepted" },
    { new: true }
  );

  if (!updatedBooking) {
    return next(new AppError('Booking not found', 404));
  }

  // io emit booking to sp and user
  const response = await Booking.findById(updatedBooking._id)
    .populate("User")
    .populate("serviceProvider")
    .select(
      "status serviceDate startTime endTime price totalPrice transactionId createdAt"
    );

  const userSocketId = getSocketId(updatedBooking.User);
  const spSocketId = getSocketId(updatedBooking.serviceProvider);
  if( !userSocketId || !spSocketId ){
    return next(new AppError('socketId error ', 400));
  }

  io.to(userSocketId).emit("pendingToAcceptU", response);
  io.to(spSocketId).emit("pendingToAcceptS", response);

  const user = await User.findById(updatedBooking.User);
  const serviceProvider = await ServiceProviderModel.findById(
    updatedBooking.serviceProvider
  );

  if (!user || !serviceProvider) {
    console.error("User or Service Provider not found in DB");
  }

  const User_name = user?.name || "User";
  const ServiceProvider_name = serviceProvider?.name || "Service Provider";
  let User_Phone = user?.phone || req.body.User_Phone;
  let Service_Phone = serviceProvider?.phone || req.body.Service_Phone;

  let normalizedUserPhone = User_Phone;
  let normalizedServicePhone = Service_Phone;
  const cleanUserPhone = User_Phone.replace(/\D/g, "");
  const cleanServicePhone = Service_Phone.replace(/\D/g, "");
  if (cleanUserPhone.length === 10 && !User_Phone.startsWith("+")) {
    normalizedUserPhone = `+91${cleanUserPhone}`;
  }
  if (cleanServicePhone.length === 10 && !Service_Phone.startsWith("+")) {
    normalizedServicePhone = `+91${cleanServicePhone}`;
  }

  if (!normalizedUserPhone || !normalizedServicePhone) {
    console.warn("Phone numbers missing, skipping notifications");
  } else if (
    !normalizedUserPhone.startsWith("+91") ||
    normalizedUserPhone.replace(/\D/g, "").length !== 12
  ) {
    console.warn("User phone invalid, skipping notifications");
  } else if (
    !normalizedServicePhone.startsWith("+91") ||
    normalizedServicePhone.replace(/\D/g, "").length !== 12
  ) {
    console.warn("Service provider phone invalid, skipping notifications");
  } else {
    const notificationResult = await sendBookingNotifications({
      whatsappClient: global.whatsappClient,
      io: global.io,
      userId: updatedBooking.User,
      serviceProviderId: updatedBooking.serviceProvider,
      bookingId: Bid,
      User_name,
      ServiceProvider_name,
      User_Phone: normalizedUserPhone,
      Service_Phone: normalizedServicePhone,
      type: "accept",
    });

    if (!notificationResult.success) {
      console.error(
        "Failed to send acceptance notifications:",
        notificationResult.error
      );
    }
  }

  res.status(200).json({
    message: "Booking accepted",
    booking: updatedBooking,
  });
});

exports.startBooking = catchAsync(async (req, res, next) => {
  const bookingId = req.params.Bid;

  if (!bookingId) {
    return next(new AppError("Booking ID is required", 400));
  }

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    return next(new AppError("Booking not found", 404));
  }

  if (booking.status !== "Accepted") {
    return next(new AppError("Booking must be accepted before starting", 400));
  }

  booking.startTime = new Date();
  booking.status = "Ongoing";
  const updatedBooking = await booking.save();

  // io emit booking to frontend
  const response = await Booking.findById(updatedBooking._id)
    .populate("User")
    .populate("serviceProvider")
    .select(
      "status serviceDate startTime endTime price totalPrice transactionId createdAt"
    );

  const userSocketId = getSocketId(updatedBooking.User);
  const spSocketId = getSocketId(updatedBooking.serviceProvider);

  io.to(userSocketId).emit("acceptToStartU", response);
  io.to(spSocketId).emit("acceptToStartS", response);

  const user = await User.findById(booking.User);
  const serviceProvider = await ServiceProviderModel.findById(
    booking.serviceProvider
  );

  if (!user || !serviceProvider) {
    console.error("User or Service Provider not found in DB");
  }

  const User_name = user?.name || "User";
  const ServiceProvider_name = serviceProvider?.name || "Service Provider";
  let User_Phone = user?.phone || req.body.User_Phone;
  let Service_Phone = serviceProvider?.phone || req.body.Service_Phone;

  let normalizedUserPhone = User_Phone;
  let normalizedServicePhone = Service_Phone;
  const cleanUserPhone = User_Phone.replace(/\D/g, "");
  const cleanServicePhone = Service_Phone.replace(/\D/g, "");
  if (cleanUserPhone.length === 10 && !User_Phone.startsWith("+")) {
    normalizedUserPhone = `+91${cleanUserPhone}`;
  }
  if (cleanServicePhone.length === 10 && !Service_Phone.startsWith("+")) {
    normalizedServicePhone = `+91${cleanServicePhone}`;
  }

  if (!normalizedUserPhone || !normalizedServicePhone) {
    console.warn("Phone numbers missing, skipping notifications");
  } else if (
    !normalizedUserPhone.startsWith("+91") ||
    normalizedUserPhone.replace(/\D/g, "").length !== 12
  ) {
    console.warn("User phone invalid, skipping notifications");
  } else if (
    !normalizedServicePhone.startsWith("+91") ||
    normalizedServicePhone.replace(/\D/g, "").length !== 12
  ) {
    console.warn("Service provider phone invalid, skipping notifications");
  } else {
    const notificationResult = await sendBookingNotifications({
      whatsappClient: global.whatsappClient,
      io: global.io,
      userId: booking.User,
      serviceProviderId: booking.serviceProvider,
      bookingId,
      User_name,
      ServiceProvider_name,
      User_Phone: normalizedUserPhone,
      Service_Phone: normalizedServicePhone,
      type: "start",
    });

    if (!notificationResult.success) {
      console.error(
        "Failed to send start notifications:",
        notificationResult.error
      );
    }
  }

  res.status(200).json({ message: "Service started", booking });
});

// End a booking
module.exports.endBooking = catchAsync(async (req, res, next) => {
  const bookingId = req.params.Bid;
  console.log(`[Backend] Ending booking: ${bookingId}`);

  if (!bookingId) {
    return next(new AppError('Booking ID is required', 400));
  }

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    console.log(`[Backend] Booking not found: ${bookingId}`);
    return next(new AppError('Booking not found', 404));
  }

  if (booking.status !== 'Ongoing') {
    console.log(`[Backend] Invalid status for end: ${booking.status}`);
    return next(new AppError('Service must be ongoing to end it', 400));
  }

  const serviceProvider = await ServiceProviderModel.findById(booking.serviceProvider);
  if (!serviceProvider) {
    console.error(`[Backend] Service Provider not found: ${booking.serviceProvider}`);
  }

  booking.endTime = new Date();
  const durationInMs = booking.endTime - booking.startTime;
  const durationInMinutes = Math.ceil(durationInMs / (1000 * 60));
  const ratePerMinute = booking.price || 5;
  let total = durationInMinutes * ratePerMinute;

  if (serviceProvider?.service?.pricingModel === 'Fixed') {
    total = serviceProvider.service.price;
  }
  booking.totalPrice = total;
  booking.status = 'Completed';

  const updatedBooking = await booking.save();

  const response = await Booking.findById(updatedBooking._id)
    .populate('User')
    .populate('serviceProvider')
    .select('status serviceDate startTime endTime price totalPrice transactionId createdAt');

  const userSocketId = getSocketId(updatedBooking.User);
  const spSocketId = getSocketId(updatedBooking.serviceProvider);

  io.to(userSocketId).emit('startToEndU', response);
  io.to(spSocketId).emit('startToEndS', response);

  console.log(`[Backend] Booking completed: ${booking._id}, Total: ${total}`);

  const user = await User.findById(booking.User);
  if (!user) {
    console.error(`[Backend] User not found: ${booking.User}`);
  }

  const User_name = user?.name || 'User';
  const ServiceProvider_name = serviceProvider?.name || 'Service Provider';
  let User_Phone = user?.phone || req.body.User_Phone || '';
  let Service_Phone = serviceProvider?.phone || req.body.Service_Phone || '';

  // Normalize phones
  const normalizePhone = (phone) => {
    if (!phone) return '';
    const clean = phone.replace(/\D/g, '');
    return clean.length === 10 && !phone.startsWith('+') ? `+91${clean}` : phone;
  };

  const normalizedUserPhone = normalizePhone(User_Phone);
  const normalizedServicePhone = normalizePhone(Service_Phone);

  const eventData = {
    bookingId,
    totalPrice: total,
    durationInMinutes,
    ratePerMinute,
    serviceProvider: ServiceProvider_name,
  };

  if (!global.io) {
    console.warn('[Backend] Socket.IO not initialized, skipping event emission');
  } else {
    console.log(`[Backend] Emitting bookingEnded to: ${booking.User.toString()}`, eventData);
    global.io.to(booking.User.toString()).emit('bookingEnded', eventData);
  }

  // Validate phones before sending notifications
  const isValidPhone = (phone) =>
    phone.startsWith('+91') && phone.replace(/\D/g, '').length === 12;

  if (!normalizedUserPhone || !normalizedServicePhone) {
    console.warn(
      `[Backend] Phone numbers missing - User: ${normalizedUserPhone}, Provider: ${normalizedServicePhone}, skipping notifications`
    );
  } else if (!isValidPhone(normalizedUserPhone)) {
    console.warn(`[Backend] User phone invalid: ${normalizedUserPhone}, skipping notifications`);
  } else if (!isValidPhone(normalizedServicePhone)) {
    console.warn(
      `[Backend] Service provider phone invalid: ${normalizedServicePhone}, skipping notifications`
    );
  } else {
    console.log(`[Backend] Sending WhatsApp notifications for booking: ${bookingId}`);
    const notificationResult = await sendBookingNotifications({
      whatsappClient: global.whatsappClient,
      io: global.io,
      userId: booking.User.toString(),
      serviceProviderId: booking.serviceProvider.toString(),
      bookingId,
      User_name,
      ServiceProvider_name,
      User_Phone: normalizedUserPhone,
      Service_Phone: normalizedServicePhone,
      type: 'end',
    });

    if (!notificationResult.success) {
      console.error(`[Backend] Failed to send end notifications: ${notificationResult.error}`);
    } else {
      console.log(`[Backend] WhatsApp notifications sent successfully for booking: ${bookingId}`);
    }
  }

  const responseData = {
    message: 'Service completed',
    durationInMinutes,
    ratePerMinute,
    totalPrice: total,
    booking,
  };
  res.status(200).json({ response: responseData });
});

module.exports.getBookingFromServereForServiceProvider = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: "Service Provider ID is required" });
    }

    const bookings = await Booking.find({ serviceProvider: id })
      .populate("User")
      .populate("serviceProvider")
      .select(
        "status serviceDate startTime endTime price totalPrice transactionId createdAt"
      )
      .sort({ startTime: 1 });  // Sort by startTime ascending

    console.log(bookings);

    res.status(200).json({ bookings });
  } catch (e) {
    console.error("Error fetching bookings:", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Fetch bookings for a user
module.exports.getBookingFromServereForUser = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const bookings = await Booking.find({ User: id })
      .populate("User", "fullname profileImage")
      .populate("serviceProvider")
      .select(
        "status serviceDate startTime endTime price totalPrice transactionId createdAt"
      )
      .sort({ startTime: -1 }); // Sort by startTime descending (latest first)

    console.log(bookings);

    res.status(200).json({ bookings });
  } catch (error) {
    console.error("Error fetching bookings for user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
