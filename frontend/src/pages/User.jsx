import { useEffect, useState } from "react";
import Navbar from "../assets/commponents/Navbar";
import AboutUsSection from "../assets/commponents/AboutUsSection ";
import { useAuth } from "../context/UserContextProvider";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import LocationTracker from "../assets/commponents/LocationTracker ";
import {
  FaUser,
  FaClock,
  FaMoneyBillWave,
  FaCheckCircle,
  FaAngleDown,
} from "react-icons/fa";

const socket = io("http://localhost:3000", {
  transports: ["websocket"],
  withCredentials: true,
});

// RequestDetails Component
const RequestDetails = ({ request }) => (
  <div className="bg-white rounded-xl p-4 sm:p-6 mb-4 border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
      <div>
        <p className="text-xs sm:text-sm font-semibold text-indigo-600">
          Provider Name:
        </p>
        <p className="text-gray-800 text-sm sm:text-base">
          {request.serviceProvider.firstName} {request.serviceProvider.lastName}
        </p>
      </div>
      <div>
        <p className="text-xs sm:text-sm font-semibold text-indigo-600">
          Service:
        </p>
        <p className="text-gray-800 text-sm sm:text-base">
          {request.serviceProvider.service.name}
        </p>
      </div>
      <div>
        <p className="text-xs sm:text-sm font-semibold text-indigo-600">
          Phone:
        </p>
        <p className="text-gray-800 text-sm sm:text-base">
          {request.serviceProvider.phone}
        </p>
      </div>
      <div>
        <p className="text-xs sm:text-sm font-semibold text-indigo-600">
          Address:
        </p>
        <p className="text-gray-800 text-sm sm:text-base">
          {request.serviceProvider.Address.Local},{" "}
          {request.serviceProvider.Address.District},{" "}
          {request.serviceProvider.Address.State}
        </p>
      </div>
      <div>
        <p className="text-xs sm:text-sm font-semibold text-indigo-600">
          Price ({request.serviceProvider.service.pricingModel}):
        </p>
        <p className="text-gray-800 font-semibold text-sm sm:text-base">
          ₹{request.serviceProvider.service.price}
        </p>
      </div>
      <div>
        <p className="text-xs sm:text-sm font-semibold text-indigo-600">
          Requested:
        </p>
        <p className="text-gray-800 flex items-center text-sm sm:text-base">
          <FaClock className="mr-2 text-indigo-500" />
          {new Date(request.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  </div>
);

// Component for Pending Requests
const PendingRequests = ({ pendingRequest }) => {
  const [showAll, setShowAll] = useState(false);
  const displayRequests = showAll ? pendingRequest : pendingRequest.slice(0, 5);

  return (
    <div className="bg-white shadow-xl rounded-2xl p-4 sm:p-8 transform transition-all hover:shadow-2xl">
      <h3 className="text-lg sm:text-2xl font-bold text-indigo-700 mb-4 sm:mb-6 flex items-center">
        <FaClock className="mr-2 sm:mr-3 text-indigo-500" /> Pending Requests
      </h3>
      {pendingRequest.length === 0 ? (
        <p className="text-gray-500 text-center py-4 text-sm sm:text-lg">
          No pending requests
        </p>
      ) : (
        <>
          {displayRequests.map((request) => (
            <RequestDetails key={request._id} request={request} />
          ))}
          {pendingRequest.length > 5 && !showAll && (
            <button
              onClick={() => setShowAll(true)}
              className="mt-4 w-full sm:w-auto py-2 px-4 bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-200 transition-all flex items-center justify-center text-sm sm:text-base"
            >
              See More <FaAngleDown className="ml-2" />
            </button>
          )}
        </>
      )}
    </div>
  );
};

// Component for Accepted Requests
const AcceptedRequests = ({ acceptedRequest, startServiceHandler }) => {
  const [showAll, setShowAll] = useState(false);
  const displayRequests = showAll
    ? acceptedRequest
    : acceptedRequest.slice(0, 5);

  return (
    <div className="bg-white shadow-xl rounded-2xl p-4 sm:p-8 transform transition-all hover:shadow-2xl">
      <h3 className="text-lg sm:text-2xl font-bold text-indigo-700 mb-4 sm:mb-6 flex items-center">
        <FaCheckCircle className="mr-2 sm:mr-3 text-indigo-500" /> Accepted
        Requests
      </h3>
      {acceptedRequest.length === 0 ? (
        <p className="text-gray-500 text-center py-4 text-sm sm:text-lg">
          No accepted requests
        </p>
      ) : (
        <>
          {displayRequests.map((request) => {
            // ⚡ Simulated locations (temporary)
            const userLocation = { lat: 23.0225, lng: 72.5714 }; // Ahmedabad
            const providerLocation = { lat: 23.03, lng: 72.58 }; // Slightly nearby

            return (
              <div key={request._id} className="mb-6">
                <RequestDetails request={request} />
                <button
                  onClick={() => startServiceHandler(request._id)}
                  className="mt-2 w-full sm:w-auto py-2 px-6 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-all transform hover:scale-105 text-sm sm:text-base"
                >
                  Start Service
                </button>

                {/* ✨ Add Live Location Tracker Here */}
                <LocationTracker
                  userLocation={userLocation}
                  providerLocation={providerLocation}
                />
              </div>
            );
          })}
          {acceptedRequest.length > 5 && !showAll && (
            <button
              onClick={() => setShowAll(true)}
              className="mt-4 w-full sm:w-auto py-2 px-4 bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-200 transition-all flex items-center justify-center text-sm sm:text-base"
            >
              See More <FaAngleDown className="ml-2" />
            </button>
          )}
        </>
      )}
    </div>
  );
};

// Component for Ongoing Requests
const OngoingRequests = ({ ongoingRequest }) => {
  const [showAll, setShowAll] = useState(false);
  const displayRequests = showAll ? ongoingRequest : ongoingRequest.slice(0, 5);

  return (
    <div className="bg-white shadow-xl rounded-2xl p-4 sm:p-8 transform transition-all hover:shadow-2xl">
      <h3 className="text-lg sm:text-2xl font-bold text-indigo-700 mb-4 sm:mb-6 flex items-center">
        <FaClock className="mr-2 sm:mr-3 text-indigo-500" /> Ongoing Service
      </h3>
      {ongoingRequest.length === 0 ? (
        <p className="text-gray-500 text-center py-4 text-sm sm:text-lg">
          No ongoing requests
        </p>
      ) : (
        <>
          {displayRequests.map((request) => (
            <RequestDetails key={request._id} request={request} />
          ))}
          {ongoingRequest.length > 5 && !showAll && (
            <button
              onClick={() => setShowAll(true)}
              className="mt-4 w-full sm:w-auto py-2 px-4 bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-200 transition-all flex items-center justify-center text-sm sm:text-base"
            >
              See More <FaAngleDown className="ml-2" />
            </button>
          )}
        </>
      )}
    </div>
  );
};

// Component for Completed Requests
const CompletedRequests = ({
  completedRequest,
  paymentDetails,
  handlePayment,
}) => {
  const [showAll, setShowAll] = useState(false);
  const displayRequests = showAll
    ? completedRequest
    : completedRequest.slice(0, 5);

  return (
    <div className="bg-white shadow-xl rounded-2xl p-4 sm:p-8 transform transition-all hover:shadow-2xl">
      <h3 className="text-lg sm:text-2xl font-bold text-indigo-700 mb-4 sm:mb-6 flex items-center">
        <FaMoneyBillWave className="mr-2 sm:mr-3 text-indigo-500" /> Completed
        Requests
      </h3>
      {completedRequest.length === 0 ? (
        <p className="text-gray-500 text-center py-4 text-sm sm:text-lg">
          No completed requests
        </p>
      ) : (
        <>
          {displayRequests.map((request) => (
            <div key={request._id} className="mb-4">
              {paymentDetails[request._id] &&
                request.status === "Completed" && (
                  <div className="mt-3 bg-indigo-50 p-3 sm:p-4 rounded-lg shadow-inner">
                    <div className="bg-white rounded-xl p-4 sm:p-6 mb-4 border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <p className="text-xs sm:text-sm font-semibold text-indigo-600">
                            Provider Name:
                          </p>
                          <p className="text-gray-800 text-sm sm:text-base">
                            {request.serviceProvider.firstName}{" "}
                            {request.serviceProvider.lastName}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-semibold text-indigo-600">
                            Service:
                          </p>
                          <p className="text-gray-800 text-sm sm:text-base">
                            {request.serviceProvider.service.name}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-semibold text-indigo-600">
                            Phone:
                          </p>
                          <p className="text-gray-800 text-sm sm:text-base">
                            {request.serviceProvider.phone}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-semibold text-indigo-600">
                            Address:
                          </p>
                          <p className="text-gray-800 text-sm sm:text-base">
                            {request.serviceProvider.Address.Local},{" "}
                            {request.serviceProvider.Address.District},{" "}
                            {request.serviceProvider.Address.State}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-semibold text-indigo-600">
                            Price (
                            {request.serviceProvider.service.pricingModel}
                            ):
                          </p>
                          <p className="text-gray-800 font-semibold text-sm sm:text-base">
                            ₹{request.serviceProvider.service.price}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-semibold text-indigo-600">
                            Requested:
                          </p>
                          <p className="text-gray-800 flex items-center text-sm sm:text-base">
                            <FaClock className="mr-2 text-indigo-500" />
                            {new Date(request.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 flex items-center mb-2 text-sm sm:text-base">
                      <FaClock className="mr-2 text-indigo-500" /> Duration:{" "}
                      {paymentDetails[request._id].durationInMinutes} min
                    </p>
                    <p className="text-gray-700 flex items-center mb-2 text-sm sm:text-base">
                      <FaMoneyBillWave className="mr-2 text-indigo-500" /> Rate:
                      ₹{paymentDetails[request._id].ratePerMinute}/min
                    </p>
                    <p className="text-lg font-bold text-indigo-800 flex items-center mb-3 text-sm sm:text-lg">
                      <FaMoneyBillWave className="mr-2 text-indigo-500" />{" "}
                      Total: ₹{paymentDetails[request._id].totalPrice}
                    </p>
                    <button
                      onClick={() =>
                        handlePayment(
                          request._id,
                          paymentDetails[request._id].totalPrice
                        )
                      }
                      className="w-full sm:w-auto py-2 px-6 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all transform hover:scale-105 text-sm sm:text-base"
                    >
                      Pay Now
                    </button>
                    <p className="text-gray-700 mt-2 font-medium text-sm sm:text-base">
                      Status: {request.status}
                    </p>
                  </div>
                )}
            </div>
          ))}
          {completedRequest.length > 5 && !showAll && (
            <button
              onClick={() => setShowAll(true)}
              className="mt-4 w-full sm:w-auto py-2 px-4 bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-200 transition-all flex items-center justify-center text-sm sm:text-base"
            >
              See More <FaAngleDown className="ml-2" />
            </button>
          )}
        </>
      )}
    </div>
  );
};

const User = () => {
  const { id } = useParams();
  const { authUser } = useAuth();
  const [Profile, setProfile] = useState(null);
  const [acceptedRequest, setAcceptedRequest] = useState([]);
  const [completedRequest, setCompletedRequest] = useState([]);
  const [ongoingRequest, setOngoingRequest] = useState([]);
  const [pendingRequest, setPendingRequest] = useState([]);
  const [paymentDetails, setPaymentDetails] = useState({});
  const [activeSection, setActiveSection] = useState("pending");
  
  useEffect(() => {
    function setProfile_User() {
      if (authUser) {
        const newProfile = {
          name: ` ${authUser.fullname.firstName} ${authUser.fullname.lastName}`,
          ProfieImage: authUser.profileImage.url,
        };
        setProfile(newProfile);
      } else {
        return "user not found";
      }
    }
    setProfile_User();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/booking/get_booking_user/${id}`
      );
      const result = res.data.response || [];
      setAcceptedRequest(result.filter((req) => req.status === "Accepted"));
      setCompletedRequest(
        result.filter((req) => ["Completed", "Paid"].includes(req.status))
      );
      setOngoingRequest(result.filter((req) => req.status === "Ongoing"));
      setPendingRequest(result.filter((req) => req.status === "Pending"));
      result.forEach((req) => {
        if (
          req.status === "Completed" &&
          req.totalPrice &&
          !paymentDetails[req._id]
        ) {
          setPaymentDetails((prev) => ({
            ...prev,
            [req._id]: {
              totalPrice: req.totalPrice,
              durationInMinutes: req.durationInMinutes || 0,
              ratePerMinute: req.ratePerMinute || req.price || 5,
            },
          }));
        }
      });
    } catch (error) {
       const errorMsg1 = error.response?.data?.message || error.message || error.response?.data?.error || "booking error"  ;
         navigate("/error", { state: { message: errorMsg1 } });
    }
  };

  const startServiceHandler = async (bookingId) => {
    try {
      const response = await axios.patch(
        `http://localhost:3000/booking/start/${bookingId}`
      );
      fetchBookings();
      toast.success("Service started!");
    } catch (error) {
       const errorMsg1 = error.response?.data?.message || error.message || error.response?.data?.error || "start service error"  ;
         navigate("/error", { state: { message: errorMsg1 } });
    }
  };

  const handlePayment = async (bookingId, amount) => {
    try {
      const orderResponse = await axios.post(
        "http://localhost:3000/api/create-order",
        { amount, bookingId }
      );
      const { id: order_id, currency } = orderResponse.data;

      const options = {
        key: "rzp_test_yRMDkhTpavxga5",
        amount: amount * 100,
        currency,
        name: "Service Payment",
        description: `Payment for Booking ID: ${bookingId}`,
        order_id,
        handler: async (response) => {
          try {
            const verifyResponse = await axios.post(
              `http://localhost:3000/api/verify-payment`,
              {
                paymentResponse: {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                },
                bookingData: {
                  userId: id,
                  serviceProviderId: completedRequest.find(
                    (req) => req._id === bookingId
                  )?.serviceProvider,
                  serviceDate: new Date().toISOString(),
                  price: amount,
                  paymentMethod: "UPI",
                  bookingId,
                },
              }
            );
            toast.success("Payment successful!");
            setPaymentDetails((prev) => ({ ...prev, [bookingId]: undefined }));
            fetchBookings();
          } catch (error) {
             const errorMsg1 = error.response?.data?.message || error.message || error.response?.data?.error || "booking error"  ;
            navigate("/error", { state: { message: errorMsg1 } });
          }
        },
        prefill: { contact: authUser?.phone || "8460878378" },
        theme: { color: "#F37254" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
       const errorMsg1 = error.response?.data?.message || error.message || error.response?.data?.error || "payment error";
         navigate("/error", { state: { message: errorMsg1 } });
    }
  };

  useEffect(() => {
    fetchBookings();
    socket.on("connect", () =>
      console.log(`[User] Socket connected: ${socket.id}`)
    );
    socket.on("connect_error", (err) =>
      console.error(`[User] Socket connect error: ${err.message}`)
    );
    socket.emit("join", id);
    socket.on("bookingEnded", (data) => {
      setPaymentDetails((prev) => {
        const updated = {
          ...prev,
          [data.bookingId]: {
            totalPrice: data.totalPrice,
            durationInMinutes: data.durationInMinutes,
            ratePerMinute: data.ratePerMinute,
          },
        };
        return updated;
      });
      fetchBookings();
    });

    return () => {
      socket.off("bookingEnded");
      socket.off("connect");
      socket.off("connect_error");
    };
  }, [id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8 sm:py-12 max-w-4xl sm:max-w-7xl">
        {/* User Profile */}
        <div className="bg-white shadow-lg sm:shadow-2xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 mb-6 sm:mb-8">
          <h3 className="text-xl sm:text-3xl font-bold sm:font-extrabold text-indigo-800 mb-4 sm:mb-6 flex items-center">
            <FaUser className="mr-2 sm:mr-3 text-indigo-500" /> User Profile
          </h3>
          {Profile === null ? (
            <p className="text-gray-500 text-center py-4 text-sm sm:text-lg">
              Data Not Found
            </p>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <img
                src={Profile.ProfieImage}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-indigo-200 shadow-md sm:shadow-lg transform hover:scale-105 transition-all duration-300"
                alt="Profile"
              />
              <div className="text-center sm:text-left">
                <p className="text-xl sm:text-3xl font-bold text-gray-900">
                  {Profile.name}
                </p>
                <p className="text-indigo-600 text-sm sm:text-lg mt-1">
                  Service User
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Request Type Buttons */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-center gap-2 sm:gap-4 mb-6 sm:mb-8">
          <button
            onClick={() => setActiveSection("pending")}
            className={`py-2 sm:px-6 sm:py-3 rounded-full text-white font-medium sm:font-semibold text-sm sm:text-base transition-all transform sm:hover:scale-105 ${
              activeSection === "pending"
                ? "bg-red-600 underline"
                : "bg-indigo-400 hover:bg-indigo-500"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setActiveSection("accepted")}
            className={`py-2 sm:px-6 sm:py-3 rounded-full text-white font-medium sm:font-semibold text-sm sm:text-base transition-all transform sm:hover:scale-105 ${
              activeSection === "accepted"
                ? "bg-red-600 underline"
                : "bg-green-400 hover:bg-green-500"
            }`}
          >
            Accepted
          </button>
          <button
            onClick={() => setActiveSection("ongoing")}
            className={`py-2 sm:px-6 sm:py-3 rounded-full text-white font-medium sm:font-semibold text-sm sm:text-base transition-all transform sm:hover:scale-105 ${
              activeSection === "ongoing"
                ? "bg-red-600 underline"
                : "bg-yellow-400 hover:bg-yellow-500"
            }`}
          >
            Ongoing
          </button>
          <button
            onClick={() => setActiveSection("completed")}
            className={`py-2 sm:px-6 sm:py-3 rounded-full text-white font-medium sm:font-semibold text-sm sm:text-base transition-all transform sm:hover:scale-105 ${
              activeSection === "completed"
                ? "bg-red-600 underline"
                : "bg-blue-400 hover:bg-blue-500"
            }`}
          >
            Completed
          </button>
        </div>

        {/* Selected Request Section */}
        <div className="animate-fade-in">
          {activeSection === "pending" && (
            <PendingRequests pendingRequest={pendingRequest.reverse()} />
          )}
          {activeSection === "accepted" && (
            <AcceptedRequests
              acceptedRequest={acceptedRequest.reverse()}
              startServiceHandler={startServiceHandler}
            />
          )}
          {activeSection === "ongoing" && (
            <OngoingRequests ongoingRequest={ongoingRequest.reverse()} />
          )}
          {activeSection === "completed" && (
            <CompletedRequests
              completedRequest={completedRequest}
              paymentDetails={paymentDetails}
              handlePayment={handlePayment}
            />
          )}
        </div>
      </div>
      <AboutUsSection />
    </div>
  );
};

export default User;
