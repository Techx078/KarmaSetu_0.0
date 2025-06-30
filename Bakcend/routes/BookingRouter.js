
const express = require("express");
const router = express.Router();
const BookingController = require("../controller/Booking.controller");

// Route to create a new booking
router.post("/book-my-service", BookingController.BookMyService);

// Route to start a booking
router.patch("/start/:Bid", BookingController.startBooking);

// Route to end a booking
router.patch("/end/:Bid", BookingController.endBooking);

// Route to fetch bookings for a user
router.get("/get_booking_user/:id", BookingController.getBookingFromServereForUser);

// Route to fetch bookings for a service provider
router.get("/get_booking/:id", BookingController.getBookingFromServereForServiceProvider);

// Route to update booking status to Accepted
router.put(
  "/Update_to_accept_Booking/:Bid",
  BookingController.BookingfterAccepted
);

module.exports = router;
