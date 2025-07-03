import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaBolt,
  FaHammer,
  FaTools,
  FaWrench,
  FaPaintRoller,
  FaBroom,
  FaBug,
  FaHome,
  FaSnowflake,
  FaCar,
  FaMotorcycle,
  FaTruck,
  FaBabyCarriage,
  FaStethoscope,
  FaHandsHelping,
  FaDumbbell,
  FaSpa,
  FaCut,
  FaCamera,
  FaVideo,
  FaGlassCheers,
  FaMusic,
  FaUtensils,
  FaBook,
  FaGuitar,
  FaRunning,
  FaLanguage,
  FaLaptopCode,
  FaMobileAlt,
  FaCameraRetro,
  FaTruckMoving,
  FaChair,
  FaTruckPickup,
  FaBalanceScale,
  FaMoneyBill,
  FaShieldAlt,
  FaUserShield,
  FaCookieBite,
  FaPaw,
  FaLeaf,
  FaTshirt,
} from "react-icons/fa";
import Navbar from "../assets/commponents/Navbar";
import AboutUsSection from "../assets/commponents/AboutUsSection ";
import { useAuth } from "../context/UserContextProvider";
import toast from "react-hot-toast";

const categoryIcons = {
  mason: <FaTools className="text-teal-600 text-xl" />,
  plumber: <FaWrench className="text-blue-600 text-xl" />,
  electrician: <FaBolt className="text-yellow-500 text-xl" />,
  carpenter: <FaHammer className="text-orange-600 text-xl" />,
  painter: <FaPaintRoller className="text-red-500 text-xl" />,
  "house cleaner": <FaBroom className="text-green-500 text-xl" />,
  "pest control specialist": <FaBug className="text-brown-500 text-xl" />,
  "interior designer": <FaHome className="text-purple-500 text-xl" />,
  "ac repair technician": <FaSnowflake className="text-blue-400 text-xl" />,
  "car washer": <FaCar className="text-blue-700 text-xl" />,
  "bike mechanic": <FaMotorcycle className="text-gray-600 text-xl" />,
  "car mechanic": <FaCar className="text-gray-700 text-xl" />,
  "auto electrician": <FaBolt className="text-yellow-600 text-xl" />,
  "car towing service": <FaTruck className="text-orange-700 text-xl" />,
  babysitter: <FaBabyCarriage className="text-pink-500 text-xl" />,
  "home nurse": <FaStethoscope className="text-red-600 text-xl" />,
  "elderly caregiver": <FaHandsHelping className="text-teal-500 text-xl" />,
  "fitness trainer": <FaDumbbell className="text-green-600 text-xl" />,
  "yoga instructor": <FaSpa className="text-purple-600 text-xl" />,
  "massage therapist": <FaSpa className="text-blue-500 text-xl" />,
  beautician: <FaCut className="text-pink-600 text-xl" />,
  "hair stylist": <FaCut className="text-purple-700 text-xl" />,
  "makeup artist": <FaPaintRoller className="text-rose-500 text-xl" />,
  photographer: <FaCamera className="text-gray-800 text-xl" />,
  videographer: <FaVideo className="text-black-500 text-xl" />,
  "wedding planner": <FaGlassCheers className="text-pink-700 text-xl" />,
  "event decorator": <FaHome className="text-yellow-700 text-xl" />,
  "dj & sound system provider": <FaMusic className="text-indigo-600 text-xl" />,
  "catering services": <FaUtensils className="text-orange-500 text-xl" />,
  "private tutor": <FaBook className="text-blue-800 text-xl" />,
  "music teacher": <FaGuitar className="text-brown-600 text-xl" />,
  "dance instructor": <FaRunning className="text-red-700 text-xl" />,
  "language trainer": <FaLanguage className="text-green-700 text-xl" />,
  "computer repair technician": <FaLaptopCode className="text-gray-500 text-xl" />,
  "mobile repair specialist": <FaMobileAlt className="text-blue-900 text-xl" />,
  "cctv installation technician": <FaCameraRetro className="text-black-600 text-xl" />,
  "smart home installation expert": <FaHome className="text-teal-700 text-xl" />,
  "packers & movers": <FaTruckMoving className="text-orange-800 text-xl" />,
  "furniture assembler": <FaChair className="text-brown-700 text-xl" />,
  "delivery assistant": <FaTruckPickup className="text-gray-900 text-xl" />,
  "legal consultant": <FaBalanceScale className="text-purple-800 text-xl" />,
  "tax consultant": <FaMoneyBill className="text-green-800 text-xl" />,
  "financial advisor": <FaMoneyBill className="text-yellow-800 text-xl" />,
  "security guard": <FaShieldAlt className="text-blue-700 text-xl" />,
  bouncer: <FaUserShield className="text-gray-700 text-xl" />,
  "cook/chef": <FaCookieBite className="text-orange-900 text-xl" />,
  "pet trainer": <FaPaw className="text-brown-800 text-xl" />,
  gardener: <FaLeaf className="text-green-900 text-xl" />,
  "laundry & ironing services": <FaTshirt className="text-blue-600 text-xl" />,
  tailor: <FaTshirt className="text-purple-900 text-xl" />,
};

const serviceTypes = Object.keys(categoryIcons); // Define serviceTypes here

const CommunityPage = () => {
  const [category, setCategory] = useState("all");
  const [location, setLocation] = useState("all");
  const [serviceProviders, setServiceProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [states, setStates] = useState([]);
  const navigate = useNavigate();
  const { authUser } = useAuth();
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchServiceProviders = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3000/service/service-providers");
        const allProviders = response.data.serviceProviders;

        const uniqueStates = [...new Set(allProviders.map((p) => p.Address.State))];
        setStates(uniqueStates);

        let filtered = allProviders;
        if (category !== "all") {
          filtered = filtered.filter((p) => p.service.name.toLowerCase() === category);
        }
        if (location !== "all") {
          filtered = filtered.filter((p) => p.Address.State === location);
        }

        const mapped = filtered.map((p) => ({
          id: p._id,
          name: `${p.firstName} ${p.lastName}`,
          phone: p.phone,
          rating: p.rating?.average || "N/A",
          description:
            p.description || `Experienced ${p.service.name} with ${p.experience} years of expertise.`,
          Address: `${p.Address.Local}, ${p.Address.District}, ${p.Address.State}`,
          experience: p.experience,
          availability: p.availability ? "Available" : "Unavailable",
          isVerified: p.isVerified,
          hourlyPrice:
            p.service.pricingModel === "Hourly"
              ? `₹${p.service.price}/hr`
              : `₹${p.service.price} (Fixed)`,
          service: p.service.name.toLowerCase(),
        }));

        setServiceProviders(mapped);
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err.response?.data || err.message);
        toast.error("Failed to load service providers.");
        const errorMsg1 = err.response?.data?.message || err.message || err.response?.data?.error || "register error"  ;
        navigate("/error", { state: { message: errorMsg1 } });
      }
    };

    fetchServiceProviders();
  }, [category, location]);

  const handleViewProfile = (providerId) => {
    navigate(`/Service-provider-Profile-Details/${providerId}`, {
      state: { scrollToTop: true },
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBookNow2 = async (providerId, phone, serviceProvider_name) => {
    if (!authUser || !authUser._id) {
      navigate("/login", {
        state: { redirectTo: `/booking/user/${providerId}` },
      });
      return;
    }

    const requestData = {
      User_name: `${authUser.fullname.firstName} ${authUser.fullname.lastName}`,
      ServiceProvider_name: serviceProvider_name,
      User_Phone: authUser.phone,
      Service_Phone: phone,
      userId: authUser._id,
      serviceProviderId: providerId,
    };

    try {
      const response = await axios.post("http://localhost:3000/booking/book-my-service", requestData);
      toast.success(response.data.message);
      navigate(`/user/${authUser._id}`);
    } catch (error) {
      console.error("Error sending booking request:", error.response?.data || error.message);
      toast.error("Failed to send booking request.");
      const errorMsg1 = error.response?.data?.message || error.message || error.response?.data?.error || "booking error"  ;
       navigate("/error", { state: { message: errorMsg1 } });
    }
  };

 
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-6 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-5 mb-8 transform transition-all duration-300 hover:shadow-xl">
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 flex items-center gap-3">
              {category === "all" ? (
                <FaTools className="text-gray-700 text-3xl sm:text-4xl animate-pulse" />
              ) : (
                categoryIcons[category] || <FaTools className="text-gray-700 text-3xl sm:text-4xl" />
              )}
              Find Best{" "}
              {category === "all"
                ? "Service Providers"
                : category.charAt(0).toUpperCase() + category.slice(1)}
            </h1>
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-200 hover:bg-gray-50 text-sm sm:text-base"
              >
                <option value="all">All Categories</option>
                {serviceTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-3 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-200 hover:bg-gray-50 text-sm sm:text-base"
              >
                <option value="all">All Locations</option>
                {states.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 gap-6">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-md p-5 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>zz
                  <div className="h-4 bg-gray-100 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-100 rounded w-5/6 mb-2"></div>
                  <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <p className="text-center text-red-500 text-lg font-semibold animate-bounce">{error}</p>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {serviceProviders.length === 0 ? (
                <p className="text-center text-gray-500 text-lg font-medium animate-fade-in">
                  No service providers found for this category and location.
                </p>
              ) : (
                serviceProviders.map((provider) => (
                  <div
                    key={provider.id}
                    className="bg-white rounded-2xl shadow-lg p-5 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl border border-gray-100"
                  >
                    <div className="flex justify-between items-start">
                      <h2 className="text-lg sm:text-xl font-bold text-gray-800 truncate">
                        {provider.name}
                        {provider.isVerified && (
                          <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            Verified
                          </span>
                        )}
                      </h2>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          provider.availability === "Available"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {provider.availability}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-gray-600 text-sm">{provider.experience} years experience</p>
                      <span className="text-gray-400">|</span>
                      <p className="text-gray-600 text-sm flex items-center">
                        <span className="text-yellow-400 mr-1">⭐</span>
                        {provider.rating}
                      </p>
                      <span className="text-gray-400">|</span>
                      <p className="text-gray-600 text-sm flex items-center gap-1">
                        {categoryIcons[provider.service] && (
                          <span className="flex items-center justify-center">
                            {categoryIcons[provider.service]}
                          </span>
                        )}
                        <span>{provider.service.charAt(0).toUpperCase() + provider.service.slice(1)}</span>
                      </p>
                    </div>
                    <p className="text-gray-700 text-sm sm:text-base mt-2 line-clamp-3">{provider.description}</p>
                    <p className="font-semibold text-green-600 text-sm sm:text-base mt-2">
                      💰 {provider.hourlyPrice}
                    </p>
                    <div className="flex flex-col sm:flex-row justify-between items-center mt-3 gap-3">
                      <p className="text-gray-500 text-sm flex items-center">
                        <span className="mr-1">📍</span>
                        {provider.Address}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <button
                          onClick={() => handleViewProfile(provider.id)}
                          className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-700 text-white rounded-lg shadow-md hover:from-gray-600 hover:to-gray-800 transition-all duration-200 transform hover:scale-105 active:bg-gray-900"
                        >
                          View Profile
                        </button>
                        <button
                          onClick={() => handleBookNow2(provider.id,provider.phone,provider.name)}
                          // disabled={provider.availability !== "Available"}
                          className={`w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-md transition-all duration-200 transform hover:scale-105 active:bg-indigo-800 ${
                            provider.availability !== "Available"
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:from-blue-600 hover:to-indigo-700"
                          }`}
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
      <AboutUsSection />
    </>
  );
};

export default CommunityPage;