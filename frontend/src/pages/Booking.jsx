import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../assets/commponents/Navbar";
import AboutUsSection from "../assets/commponents/AboutUsSection ";
import { FaStar, FaCalendarAlt, FaMoneyBillWave } from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../context/UserContextProvider";





const BookingPage = () => {
  const { sid, id } = useParams();
  const navigate = useNavigate();
  const { authUser } = useAuth();

  const [serviceType, setServiceType] = useState("");
  const [booking, setBooking] = useState({ date: "", time: "", duration: 1 });
  const [serviceProvider, setServiceProvider] = useState({});
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [price, setPrice] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const fetchServiceProvider = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/service/profile/${sid}`);
        const provider = res.data.sp;

        const newsp = {
          id: provider._id,
          profileImage: provider.profileImage.url,
          name: `${provider.firstName} ${provider.lastName}`,
          rating:
            provider.reviews.length > 0
              ? (
                  provider.reviews.reduce((sum, review) => sum + review.rating, 0) / provider.reviews.length
                ).toFixed(1)
              : "N/A",
          description: provider.description || `Expert ${provider.service.name} with quality service.`,
          Address: `${provider.Address.Local},${provider.Address.District},${provider.Address.State}`,
          experience: provider.experience,
          service: provider.service.name,
          price: provider.service.price,
          availability: provider.availability,
          pricingModel:
            provider.service.pricingModel === "Hourly"
              ? `₹${provider.service.price}/hr`
              : `₹${provider.service.price} (Fixed)`,
        };

        setServiceProvider(newsp);
      } catch (error) {
        toast.error("Failed to fetch service provider.");
         const errorMsg1 = error.response?.data?.message || error.message || error.response?.data?.error || "register error"  ;
         navigate("/error", { state: { message: errorMsg1 } });
      }
    };

    fetchServiceProvider();
  }, [sid, navigate]);

  useEffect(() => {
    if (serviceProvider) {
      const totalPrice =
        serviceProvider?.pricingModel === "Hourly"
          ? serviceProvider?.price * booking.duration
          : serviceProvider?.price;
      setPrice(totalPrice);
    }
  }, [serviceProvider, booking.duration]);

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBooking((prev) => ({ ...prev, [name]: value }));
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();

    if (
      !booking.date ||
      !booking.time ||
      (serviceProvider?.pricingModel === "Hourly" && !booking.duration)
    ) {
      toast.error("Please complete all fields.");
      return;
    }

    setPaymentStatus("ready");
  };

  const handlePayment = async () => {
    setPaymentStatus("processing");

    try {
      await axios.post("http://localhost:3000/booking/book-my-service", {
        user: authUser._id,
        serviceProvider: serviceProvider.id,
        serviceDate: booking.date,
        transactionId: "123", // Replace with actual txnId from payment gateway
        price: price,
      });

      toast.success("Service booked successfully!");
      setPaymentStatus("completed");
    } catch (error) {
      toast.error(error.response?.data?.error || "Payment failed.");
      setPaymentStatus("failed");

      navigate("/error", {
        state: {
          message: error.response?.data?.error || "Something went wrong during payment.",
        },
      });
    }
  };

  const totalPrice =
    serviceProvider.pricingModel === "Hourly"
      ? serviceProvider.price * booking.duration
      : serviceProvider.price;

  return (
    <div className="relative">
      <Navbar />
      <div
        className="pt-[120px] min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-100 to-gray-300"
        style={{ zIndex: 10 }}
      >
        <div className="max-w-5xl mx-auto">
          {/* Profile Card */}
          <div className="relative bg-white rounded-3xl shadow-2xl p-6 mb-8 transform hover:scale-[1.02] transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-3xl -z-10"></div>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <img
                src={serviceProvider.profileImage}
                alt={serviceProvider.name}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-indigo-500 shadow-lg object-cover transform hover:rotate-6 transition-all duration-300"
              />
              <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                  {serviceProvider.name}
                </h1>
                <p className="text-lg font-semibold text-gray-700">{serviceProvider.service}</p>
                <p className="text-gray-600">
                  <FaMoneyBillWave className="inline mr-2 text-green-500" />
                  {serviceProvider.pricingModel}
                </p>
                <p className="text-gray-600">
                  📍 {serviceProvider.Address} | Exp: {serviceProvider.experience} years
                </p>
                <p
                  className={`mt-2 text-sm font-medium ${
                    serviceProvider.availability ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {serviceProvider.availability ? "Available Now" : "Currently Unavailable"}
                </p>
              </div>
            </div>
          </div>

          {/* Request Accepted Notification */}
          {/* { (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-8 rounded-lg">
              <p className="font-semibold">Request Accepted!</p>
              <p>The service provider has accepted your booking request. Proceed with payment to confirm.</p>
            </div>
          )} */}

          {/* Booking Form */}
          {paymentStatus === "pending" && (
            <div className="bg-white rounded-3xl shadow-2xl p-6 mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-indigo-600 mb-6 flex items-center">
                <FaCalendarAlt className="mr-2" /> Schedule Your Booking
              </h2>
              <form onSubmit={handleBookingSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={booking.date}
                      onChange={handleBookingChange}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Time</label>
                    <input
                      type="time"
                      name="time"
                      value={booking.time}
                      onChange={handleBookingChange}
                      className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                      required
                    />
                  </div>
                </div>
                {serviceProvider.pricingModel === "Hourly" && (
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Duration (Hours)</label>
                    <input
                      type="number"
                      name="duration"
                      value={booking.duration}
                      onChange={handleBookingChange}
                      min="1"
                      max="24"
                      className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                      required
                    />
                  </div>
                )}
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-700 mb-4">Total: ₹{totalPrice || 0}</p>
                  <button
                    type="submit"
                    disabled={!serviceProvider.availability}
                    className={`w-full sm:w-auto px-8 py-3 bg-gradient-to-r ${
                      serviceProvider.availability
                        ? "from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                        : "from-gray-500 to-gray-600 cursor-not-allowed"
                    } text-white rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50`}
                  >
                    Proceed to Payment
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Payment Section */}
          {paymentStatus !== "pending" && (
            <div className="bg-white rounded-3xl shadow-2xl p-6 mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-blue-600 mb-6 flex items-center">
                <FaMoneyBillWave className="mr-2" /> Payment
              </h2>
              {paymentStatus === "ready" && (
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-700 mb-4">Total Amount: ₹{totalPrice || 0}</p>
                  <button
                    onClick={handlePayment}
                    className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg shadow-lg hover:from-green-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105"
                  >
                    Pay Now
                  </button>
                </div>
              )}
              {paymentStatus === "processing" && (
                <div className="text-center">
                  <p className="text-gray-600 mb-4 animate-pulse">Processing Payment...</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-indigo-600 h-2.5 rounded-full animate-pulse"
                      style={{ width: "75%" }}
                    ></div>
                  </div>
                </div>
              )}
              {paymentStatus === "completed" && (
                <div className="text-center">
                  <p className="text-green-600 font-semibold text-lg">Payment Successful!</p>
                  <p className="text-gray-600 mt-2">Your booking is confirmed.</p>
                </div>
              )}
              {paymentStatus === "failed" && (
                <div className="text-center">
                  <p className="text-red-600 font-semibold text-lg">Payment Failed!</p>
                  <p className="text-gray-600 mt-2">Please try again.</p>
                  <button
                    onClick={() => setPaymentStatus("ready")}
                    className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg shadow-lg hover:from-red-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 mt-4"
                  >
                    Retry Payment
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <AboutUsSection />
      </div>
    </div>
  );
};

export default BookingPage;