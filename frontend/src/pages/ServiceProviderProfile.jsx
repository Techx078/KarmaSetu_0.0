import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../assets/commponents/Navbar";
import AboutUsSection from "../assets/commponents/AboutUsSection ";
import axios from "axios";
import { toast } from "react-toastify";
import { useSocket } from "../context/Socket.context";
import {
  FaClock,
  FaMoneyBillWave,
  FaCheckCircle,
  FaAngleDown,
} from "react-icons/fa";

const ServiceProviderProfile = () => {
  const { socket } = useSocket();
  const { id } = useParams();
  const [profile, setProfile] = useState({});
  const [previousWork, setPreviousWork] = useState([
    { id: 1, address: "123 Main St, New York, NY", description: "Installed new wiring." },
    { id: 2, address: "456 Elm St, New York, NY", description: "Repaired circuit breaker." },
    { id: 3, address: "789 Maple St, New York, NY", description: "Rewired the office." },
    { id: 4, address: "321 Oak St, New York, NY", description: "Upgraded electrical panel." },
    { id: 5, address: "654 Pine St, New York, NY", description: "Installed lighting fixtures." },
  ]);
  const [dataAfterEndService, setDataAfterEndService] = useState(null);
  const [acceptedRequest, setAcceptedRequest] = useState([]);
  const [completedRequest, setCompletedRequest] = useState([]);
  const [ongoingRequest, setOngoingRequest] = useState([]);
  const [pendingRequest, setPendingRequest] = useState([]);
  const [newPost, setNewPost] = useState({ address: "", description: "" });
  const [gallery, setGallery] = useState([]);
  const [newGalleryImage, setNewGalleryImage] = useState({ image: "", description: "" });
  const [showMoreGallery, setShowMoreGallery] = useState(false);
  const [editGalleryId, setEditGalleryId] = useState(null);
  const [showMoreWork, setShowMoreWork] = useState(false);
  const [reviews, setReviews] = useState([
    { id: 1, user: "Alice", rating: 5, comment: "Excellent service!" },
    { id: 2, user: "Bob", rating: 4, comment: "Very professional." },
  ]);
  const [services, setServices] = useState([
    { id: 1, name: "Electrical Repair", price: 500, timing: "9:00 AM - 5:00 PM" },
  ]);
  const [newService, setNewService] = useState({ name: "", price: "", timing: "" });
  const [activeSection, setActiveSection] = useState('pending');

  // Fetch bookings for the service provider
  async function fetchBookings() {
    try {
      const res = await axios.get(`http://localhost:3000/booking/get_booking/${id}`);
      const result = res.data.response || [];
      setAcceptedRequest(result.filter((req) => req.status === "Accepted"));
      setCompletedRequest(result.filter((req) => ["Completed", "Paid"].includes(req.status)));
      setOngoingRequest(result.filter((req) => req.status === "Ongoing"));
      setPendingRequest(result.filter((req) => req.status === "Pending"));
    } catch (error) {
       const errorMsg1 = error.response?.data?.message || error.message || error.response?.data?.error || "get booking error"  ;
         navigate("/error", { state: { message: errorMsg1 } });
    }
  }

  // Initialize profile, bookings, and Socket.IO
  useEffect(() => {
    console.log('[Provider] Socket:', socket); // Debug socket value
    fetchBookings();

    if (socket) {
      socket.emit("join", id);
      console.log(`[Provider] Joined room: ${id}`);

      const moveBooking = (booking, removeFrom, addTo, removeSetter, addSetter) => {
        removeSetter((prev) => prev.filter((b) => b._id !== booking._id));
        addSetter((prev) => [...prev, booking]);
      };

      socket.on("pendingS", (booking) => {
        console.log("[Socket] pendingS:", booking);
        setPendingRequest((prev) => [...prev, booking]);
        toast.success("You have a new request!!!!");
      });

      socket.on("pendingToAcceptS", (booking) => {
        console.log("[Socket] pendingToAcceptS:", booking);
        moveBooking(booking, "Pending", "Accepted", setPendingRequest, setAcceptedRequest);
      });

      socket.on("acceptToStartS", (booking) => {
        console.log("[Socket] acceptToStartS:", booking);
        moveBooking(booking, "Accepted", "Ongoing", setAcceptedRequest, setOngoingRequest);
        toast.success("booking started by the user !");
      });

      socket.on("startToEndS", (booking) => {
        console.log("[Socket] startToEnd:", booking);
        moveBooking(booking, "Ongoing", "Completed", setOngoingRequest, setCompletedRequest);
      });

      socket.on("paymentReceived", (data) => {
        console.log(`[Provider] Payment received:`, data);
        toast.success(`Payment of ₹${data.amount} received for Booking ID: ${data.bookingId}`);
        fetchBookings();
      });
    } else {
      console.warn('[Provider] Socket not available yet');
    }

    const fetchServiceProviders = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/service/profile/${id}`);
        const result = res.data.sp;
        const newProfile = {
          name: `${result.firstName} ${result.lastName}`,
          profession: result.service.name,
          experience: `Good working in ${result.service.name} service`,
          bio: `Passionate ${result.service.name} with extensive experience in residential and commercial projects.`,
          profileImage: result.profileImage.url,
        };
        setProfile(newProfile);
        console.log(`[Provider] Profile fetched:`, newProfile);
      } catch (error) {
         const errorMsg1 = error.response?.data?.message || error.message || error.response?.data?.error || "profile error in sp error"  ;
         navigate("/error", { state: { message: errorMsg1 } });
      }
    };
    fetchServiceProviders();

    return () => {
      if (socket) {
        socket.off("paymentReceived");
        socket.off("pendingS");
        socket.off("pendingToAcceptS");
        socket.off("acceptToStartS");
        socket.off("startToEndS");
      }
    };
  }, [id, socket]);

  // Handle profile image upload
  const handleProfileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfile({ ...profile, profileImage: imageUrl });
      console.log(`[Provider] Profile image updated`);
    }
  };

  // Handle adding previous work
  const handlePostUpload = () => {
    if (newPost.address && newPost.description) {
      setPreviousWork([...previousWork, { ...newPost, id: previousWork.length + 1 }]);
      setNewPost({ address: "", description: "" });
      console.log(`[Provider] New previous work added`);
    }
  };

  // Handle gallery image upload/edit
  const handleGalleryUpload = () => {
    if (newGalleryImage.image && newGalleryImage.description) {
      if (editGalleryId) {
        setGallery(gallery.map((item) => (item.id === editGalleryId ? { ...item, ...newGalleryImage } : item)));
        setEditGalleryId(null);
        console.log(`[Provider] Gallery item updated`);
      } else {
        setGallery([...gallery, { ...newGalleryImage, id: gallery.length + 1 }]);
        console.log(`[Provider] New gallery item added`);
      }
      setNewGalleryImage({ image: "", description: "" });
    }
  };

  // Delete gallery image
  const handleDeleteGalleryImage = (id) => {
    setGallery(gallery.filter((item) => item.id !== id));
    console.log(`[Provider] Gallery item deleted: ${id}`);
  };

  // Edit gallery image
  const handleEditGalleryImage = (item) => {
    setNewGalleryImage({ image: item.image, description: item.description });
    setEditGalleryId(item.id);
    console.log(`[Provider] Editing gallery item: ${item.id}`);
  };

  // Add new service
  const handleAddService = () => {
    if (newService.name && newService.price && newService.timing) {
      setServices([...services, { ...newService, id: services.length + 1 }]);
      setNewService({ name: "", price: "", timing: "9:00 AM - 5:00 PM" });
      console.log(`[Provider] New service added`);
    }
  };

  // Accept a booking
  const handleAcceptedServiceRequest = async (Bid) => {
    try {
      await axios.put(
        `http://localhost:3000/booking/Update_to_accept_Booking/${Bid}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      toast.success("Service accepted by you!");
      fetchBookings();
    } catch (error) {
       const errorMsg1 = error.response?.data?.message || error.message || error.response?.data?.error || "update to accept error"  ;
        navigate("/error", { state: { message: errorMsg1 } });
    }
  };

  // Reject a booking
  const handleRejectServiceRequest = async (Bid) => {
    try {
      await axios.put(
        `http://localhost:3000/booking/Update_to_reject_Booking/${Bid}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      toast.success("Service request rejected!");
      fetchBookings();
    } catch (error) {
       const errorMsg1 = error.response?.data?.message || error.message || error.response?.data?.error || "update to reject error";
         navigate("/error", { state: { message: errorMsg1 } });
    }
  };

  // End a booking
  const handleEndServiceRequest = async (Bid) => {
    try {
      const response = await axios.patch(`http://localhost:3000/booking/end/${Bid}`);
      setDataAfterEndService(response.data.response || null);
      fetchBookings();
      toast.success("Service ended successfully!");
    } catch (err) {
      const errorMsg1 = error.response?.data?.message || error.message || error.response?.data?.error || "end error"  ;
      navigate("/error", { state: { message: errorMsg1 } });
    }
  };

  // Component to display request details
  const RequestDetails = ({ request, showButtons = false, onAccept, onReject, onEnd }) => (
    <div className="bg-white rounded-xl p-4 sm:p-6 mb-4 border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <p className="text-xs sm:text-sm font-semibold text-indigo-600">User Name:</p>
          <p className="text-gray-800 text-sm sm:text-base">{request.User.fullname.firstName} {request.User.fullname.lastName}</p>
        </div>
        <div>
          <p className="text-xs sm:text-sm font-semibold text-indigo-600">Phone:</p>
          <p className="text-gray-800 text-sm sm:text-base">{request.User.phone}</p>
        </div>
        <div className="sm:col-span-2">
          <p className="text-xs sm:text-sm font-semibold text-indigo-600">Address:</p>
          <p className="text-gray-800 text-sm sm:text-base">
            {request.User.Address.Local}, {request.User.Address.District}, {request.User.Address.State}
          </p>
        </div>
        <div>
          <p className="text-xs sm:text-sm font-semibold text-indigo-600">Requested At:</p>
          <p className="text-gray-800 flex items-center text-sm sm:text-base">
            <FaClock className="mr-2 text-indigo-500" />
            {new Date(request.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
      {showButtons && (
        <div className="mt-3 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          {onAccept && (
            <button
              onClick={() => onAccept(request._id)}
              className="px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all transform hover:scale-105 w-full sm:w-auto shadow-md text-sm sm:text-base"
            >
              Accept
            </button>
          )}
          {onEnd && (
            <button
              onClick={() => onEnd(request._id)}
              className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all transform hover:scale-105 w-full sm:w-auto shadow-md text-sm sm:text-base"
            >
              End Service
            </button>
          )}
          {onAccept && (
            <button
              onClick={() => onReject(request._id)}
              className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all transform hover:scale-105 w-full sm:w-auto shadow-md text-sm sm:text-base"
            >
              Reject
            </button>
          )}
        </div>
      )}
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
          <p className="text-gray-500 text-center py-4 text-sm sm:text-lg">No pending requests</p>
        ) : (
          <>
            {displayRequests.map((request) => (
              <RequestDetails
                key={request._id}
                request={request}
                showButtons={true}
                onAccept={handleAcceptedServiceRequest}
                onReject={handleRejectServiceRequest}
              />
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
  const AcceptedRequests = ({ acceptedRequest }) => {
    const [showAll, setShowAll] = useState(false);
    const displayRequests = showAll ? acceptedRequest : acceptedRequest.slice(0, 5);

    return (
      <div className="bg-white shadow-xl rounded-2xl p-4 sm:p-8 transform transition-all hover:shadow-2xl">
        <h3 className="text-lg sm:text-2xl font-bold text-indigo-700 mb-4 sm:mb-6 flex items-center">
          <FaCheckCircle className="mr-2 sm:mr-3 text-indigo-500" /> Accepted Requests
        </h3>
        {acceptedRequest.length === 0 ? (
          <p className="text-gray-500 text-center py-4 text-sm sm:text-lg">No accepted requests</p>
        ) : (
          <>
            {displayRequests.map((request) => (
              <RequestDetails key={request._id} request={request} />
            ))}
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
          <p className="text-gray-500 text-center py-4 text-sm sm:text-lg">No ongoing requests</p>
        ) : (
          <>
            {displayRequests.map((request) => (
              <RequestDetails
                key={request._id}
                request={request}
                showButtons={true}
                onEnd={handleEndServiceRequest}
              />
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

  // Component for End Service Details
  const EndServiceDetails = ({ dataAfterEndService }) => (
    <div className="bg-white shadow-xl rounded-2xl p-4 sm:p-8 transform transition-all hover:shadow-2xl">
      <h3 className="text-lg sm:text-2xl font-bold text-indigo-700 mb-4 sm:mb-6 flex items-center">
        <FaMoneyBillWave className="mr-2 sm:mr-3 text-indigo-500" /> End Service Details
      </h3>
      {dataAfterEndService ? (
        <div className="bg-indigo-50 p-4 rounded-lg shadow-inner">
          <p className="text-lg font-semibold text-gray-800 mb-2">{dataAfterEndService.message}</p>
          <p className="text-gray-700 flex items-center mb-2 text-sm sm:text-base">
            <FaClock className="mr-2 text-indigo-500" /> Duration: {dataAfterEndService.durationInMinutes} min
          </p>
          <p className="text-gray-700 flex items-center mb-2 text-sm sm:text-base">
            <FaMoneyBillWave className="mr-2 text-indigo-500" /> Rate: ₹{dataAfterEndService.ratePerMinute}/min
          </p>
          <p className="text-lg sm:text-xl font-bold text-indigo-800 flex items-center text-sm sm:text-lg">
            <FaMoneyBillWave className="mr-2 text-indigo-500" /> Total: ₹{dataAfterEndService.totalPrice}
          </p>
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4 text-sm sm:text-lg">No data for ended services</p>
      )}
    </div>
  );

  // Component for Completed Requests
  const CompletedRequests = ({ completedRequest }) => {
    const [showAll, setShowAll] = useState(false);
    const displayRequests = showAll ? completedRequest : completedRequest.slice(0, 5);

    return (
      <div className="bg-white shadow-xl rounded-2xl p-4 sm:p-8 transform transition-all hover:shadow-2xl">
        <h3 className="text-lg sm:text-2xl font-bold text-indigo-700 mb-4 sm:mb-6 flex items-center">
          <FaCheckCircle className="mr-2 sm:mr-3 text-indigo-500" /> Completed Requests
        </h3>
        {completedRequest.length === 0 ? (
          <p className="text-gray-500 text-center py-4 text-sm sm:text-lg">No completed requests</p>
        ) : (
          <>
            {displayRequests.map((request) => (
              <div key={request._id} className="mb-4">
                <RequestDetails request={request} />
                <p className="text-gray-700 mt-2 text-sm sm:text-base">
                  Status: <span className={request.status === "Paid" ? "text-green-600 font-semibold" : "text-gray-600"}>{request.status}</span>
                </p>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8 sm:py-12 max-w-4xl sm:max-w-7xl">
        {/* Profile Section */}
        <div className="bg-white shadow-lg sm:shadow-2xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 mb-6 sm:mb-8">
          <h3 className="text-xl sm:text-3xl font-bold sm:font-extrabold text-indigo-800 mb-4 sm:mb-6 flex items-center">
            <FaCheckCircle className="mr-2 sm:mr-3 text-indigo-500" /> Service Provider Profile
          </h3>
          {Object.keys(profile).length === 0 ? (
            <p className="text-gray-500 text-center py-4 text-sm sm:text-lg">Data Not Found</p>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <div className="relative">
                <img
                  src={profile.profileImage || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWAZLocXwjrQ1roL5oGFpxlt81NuoertoPmw&s"}
                  alt="Profile"
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-indigo-200 shadow-md sm:shadow-lg transform hover:scale-105 transition-all duration-300"
                />
                <input
                  type="file"
                  onChange={handleProfileUpload}
                  className="hidden"
                  id="profileImageUpload"
                />
                <label
                  htmlFor="profileImageUpload"
                  className="absolute bottom-0 right-0 bg-indigo-500 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-600 transition-all"
                >
                  <FaCheckCircle />
                </label>
              </div>
              <div className="text-center sm:text-left flex-1">
                <p className="text-xl sm:text-3xl font-bold text-gray-900">{profile.name}</p>
                <p className="text-indigo-600 text-sm sm:text-lg mt-1">{profile.profession}</p>
                <p className="text-sm sm:text-base text-gray-600 mt-1">Experience: {profile.experience}</p>
                <p className="mt-2 text-gray-700 text-sm sm:text-base">{profile.bio}</p>
              </div>
            </div>
          )}
        </div>

        {/* Request Type Buttons */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-center gap-2 sm:gap-4 mb-6 sm:mb-8">
          <button
            onClick={() => setActiveSection('pending')}
            className={`py-2 sm:px-6 sm:py-3 rounded-full text-white font-medium sm:font-semibold text-sm sm:text-base transition-all transform sm:hover:scale-105 ${
              activeSection === 'pending' ? 'bg-indigo-600' : 'bg-indigo-400 hover:bg-indigo-500'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setActiveSection('accepted')}
            className={`py-2 sm:px-6 sm:py-3 rounded-full text-white font-medium sm:font-semibold text-sm sm:text-base transition-all transform sm:hover:scale-105 ${
              activeSection === 'accepted' ? 'bg-green-600' : 'bg-green-400 hover:bg-green-500'
            }`}
          >
            Accepted
          </button>
          <button
            onClick={() => setActiveSection('ongoing')}
            className={`py-2 sm:px-6 sm:py-3 rounded-full text-white font-medium sm:font-semibold text-sm sm:text-base transition-all transform sm:hover:scale-105 ${
              activeSection === 'ongoing' ? 'bg-yellow-600' : 'bg-yellow-400 hover:bg-yellow-500'
            }`}
          >
            Ongoing
          </button>
          <button
            onClick={() => setActiveSection('completed')}
            className={`py-2 sm:px-6 sm:py-3 rounded-full text-white font-medium sm:font-semibold text-sm sm:text-base transition-all transform sm:hover:scale-105 ${
              activeSection === 'completed' ? 'bg-blue-600' : 'bg-blue-400 hover:bg-blue-500'
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setActiveSection('endService')}
            className={`py-2 sm:px-6 sm:py-3 rounded-full text-white font-medium sm:font-semibold text-sm sm:text-base transition-all transform sm:hover:scale-105 ${
              activeSection === 'endService' ? 'bg-red-600' : 'bg-red-400 hover:bg-red-500'
            }`}
          >
            End Service
          </button>
        </div>

        {/* Selected Request Section */}
        <div className="animate-fade-in">
          {activeSection === 'pending' && (
            <PendingRequests pendingRequest={pendingRequest} />
          )}
          {activeSection === 'accepted' && (
            <AcceptedRequests acceptedRequest={acceptedRequest} />
          )}
          {activeSection === 'ongoing' && (
            <OngoingRequests ongoingRequest={ongoingRequest} />
          )}
          {activeSection === 'completed' && (
            <CompletedRequests completedRequest={completedRequest} />
          )}
          {activeSection === 'endService' && (
            <EndServiceDetails dataAfterEndService={dataAfterEndService} />
          )}
        </div>

        {/* Services Section */}
        <div className="bg-white shadow-xl rounded-2xl p-4 sm:p-8 mt-6 sm:mt-8 transform transition-all hover:shadow-2xl">
          <h3 className="text-lg sm:text-2xl font-bold text-green-600 mb-4 sm:mb-6">Services Offered</h3>
          <div className="space-y-4">
            {services.map((service) => (
              <div key={service.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-green-300 transition-all">
                <div>
                  <p className="font-semibold text-gray-800 text-sm sm:text-base">{service.name}</p>
                  <p className="text-gray-600 text-xs sm:text-sm">Price: ₹{service.price} | Timing: {service.timing}</p>
                </div>
                <button className="text-red-600 hover:text-red-800 transition-colors font-medium text-sm sm:text-base">Remove</button>
              </div>
            ))}
          </div>
          <h4 className="mt-4 sm:mt-6 text-base sm:text-lg font-semibold text-gray-800">Add New Service</h4>
          <div className="mt-4 space-y-4">
            <input
              type="text"
              placeholder="Service Name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm text-sm sm:text-base"
              value={newService.name}
              onChange={(e) => setNewService({ ...newService, name: e.target.value })}
            />
            <input
              type="number"
              placeholder="Price"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm text-sm sm:text-base"
              value={newService.price}
              onChange={(e) => setNewService({ ...newService, price: e.target.value })}
            />
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm text-sm sm:text-base"
              value={newService.timing}
              onChange={(e) => setNewService({ ...newService, timing: e.target.value })}
            >
              <option value="9:00 AM - 5:00 PM">9:00 AM - 5:00 PM</option>
              <option value="10:00 AM - 6:00 PM">10:00 AM - 6:00 PM</option>
              <option value="11:00 AM - 7:00 PM">11:00 AM - 7:00 PM</option>
            </select>
            <button
              onClick={handleAddService}
              className="w-full sm:w-auto px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all transform hover:scale-105 shadow-md text-sm sm:text-base"
            >
              Add Service
            </button>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="bg-white shadow-xl rounded-2xl p-4 sm:p-8 mt-6 sm:mt-8 transform transition-all hover:shadow-2xl">
          <h3 className="text-lg sm:text-2xl font-bold text-blue-600 mb-4 sm:mb-6">Gallery</h3>
          <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Add to Gallery</h4>
          <div className="space-y-4">
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) setNewGalleryImage({ ...newGalleryImage, image: URL.createObjectURL(file) });
              }}
              className="hidden"
              id="galleryImageUpload"
            />
            <label
              htmlFor="galleryImageUpload"
              className="inline-block px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all transform hover:scale-105 shadow-md cursor-pointer text-sm sm:text-base"
            >
              Upload Image
            </label>
            <input
              type="text"
              placeholder="Description"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-sm sm:text-base"
              value={newGalleryImage.description}
              onChange={(e) => setNewGalleryImage({ ...newGalleryImage, description: e.target.value })}
            />
            <button
              onClick={handleGalleryUpload}
              className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all transform hover:scale-105 shadow-md text-sm sm:text-base"
            >
              {editGalleryId ? "Update" : "Add to Gallery"}
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-4 sm:mt-6">
            {gallery.slice(0, showMoreGallery ? gallery.length : 3).map((item) => (
              <div key={item.id} className="bg-gray-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-all border border-gray-200 hover:border-blue-300">
                <img src={item.image} alt="work" className="w-full h-40 object-cover rounded-md mb-3" />
                <p className="text-sm text-gray-700 text-center">{item.description}</p>
                <div className="mt-3 flex justify-center space-x-4">
                  <button
                    onClick={() => handleEditGalleryImage(item)}
                    className="text-blue-600 hover:text-blue-800 transition-colors font-medium text-sm sm:text-base"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteGalleryImage(item.id)}
                    className="text-red-600 hover:text-red-800 transition-colors font-medium text-sm sm:text-base"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          {gallery.length > 3 && (
            <button
              onClick={() => setShowMoreGallery(!showMoreGallery)}
              className="mt-4 sm:mt-6 text-blue-600 hover:text-blue-800 transition-colors font-medium text-sm sm:text-base"
            >
              {showMoreGallery ? "See Less" : "See More"}
            </button>
          )}
        </div>

        {/* Previous Work Section */}
        <div className="bg-white shadow-xl rounded-2xl p-4 sm:p-8 mt-6 sm:mt-8 transform transition-all hover:shadow-2xl">
          <h3 className="text-lg sm:text-2xl font-bold text-orange-600 mb-4 sm:mb-6">Previous Work</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Address"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm text-sm sm:text-base"
              value={newPost.address}
              onChange={(e) => setNewPost({ ...newPost, address: e.target.value })}
            />
            <input
              type="text"
              placeholder="Description"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm text-sm sm:text-base"
              value={newPost.description}
              onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
            />
            <button
              onClick={handlePostUpload}
              className="w-full sm:w-auto px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-all transform hover:scale-105 shadow-md text-sm sm:text-base"
            >
              Add Work
            </button>
            {previousWork.slice(0, showMoreWork ? previousWork.length : 3).map((work) => (
              <div key={work.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-orange-300 transition-all">
                <p className="text-gray-600 text-xs sm:text-sm font-medium">Address: {work.address}</p>
                <p className="text-gray-800 mt-1 text-sm sm:text-base">{work.description}</p>
              </div>
            ))}
          </div>
          {previousWork.length > 3 && (
            <button
              onClick={() => setShowMoreWork(!showMoreWork)}
              className="mt-4 sm:mt-6 text-blue-600 hover:text-blue-800 transition-colors font-medium text-sm sm:text-base"
            >
              {showMoreWork ? "See Less" : "See More"}
            </button>
          )}
        </div>

        {/* Reviews Section */}
        <div className="bg-white shadow-xl rounded-2xl p-4 sm:p-8 mt-6 sm:mt-8 transform transition-all hover:shadow-2xl">
          <h3 className="text-lg sm:text-2xl font-bold text-purple-600 mb-4 sm:mb-6">Reviews & Ratings</h3>
          {reviews.map((review) => (
            <div key={review.id} className="bg-gray-50 p-4 rounded-lg mb-3 border border-gray-200 hover:border-purple-300 transition-all">
              <p className="font-semibold text-gray-800 text-sm sm:text-base">{review.user}</p>
              <p className="text-yellow-500 mt-1 text-sm sm:text-base">{"⭐".repeat(review.rating)}</p>
              <p className="text-gray-700 mt-2 text-sm sm:text-base">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
      <AboutUsSection />
    </div>
  );
};

export default ServiceProviderProfile;