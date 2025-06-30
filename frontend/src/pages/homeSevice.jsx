import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../assets/commponents/Navbar"; // Fixed import path
import AboutUsSection from "../assets/commponents/AboutUsSection "; // Fixed import path
import axios from "axios";
import { useAuth } from "../context/UserContextProvider";
import toast from "react-hot-toast";

const HomeService = () => {
 const { authUser } = useAuth();
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState({});
  const navigate = useNavigate();

  const API_URL = "http://localhost:3000";

  const handleViewProfile = (provider) => {
    navigate(`/Service-provider-Profile-Details/${provider._id}`, {
      state: { scrollToTop: true },
    });
  };

  const handleBookNow = async (provider) => {
    if (!authUser?._id) {
      navigate("/login", {
        state: { redirectTo: `/booking/user/${provider._id}` },
      });
      return;
    }

    setBookingLoading((prev) => ({ ...prev, [provider._id]: true }));

    const requestData = {
      User_name: `${authUser.fullname?.firstName || ""} ${authUser.fullname?.lastName || ""}`,
      ServiceProvider_name: `${provider.firstName || ""} ${provider.lastName || ""}`,
      User_Phone: authUser.phone || "",
      Service_Phone: provider.phone || "",
      userId: authUser._id,
      serviceProviderId: provider._id,
    };

    try {
      const response = await axios.post(`${API_URL}/booking/book-my-service`, requestData);
      toast.success(response.data.message || "Booking request sent successfully!");
      navigate(`/user/${authUser._id}`);
    } catch (error) {
       const errorMsg1 = error.response?.data?.message || error.message || error.response?.data?.error || "register error"  ;
         navigate("/error", { state: { message: errorMsg1 } });
    } finally {
      setBookingLoading((prev) => ({ ...prev, [provider._id]: false }));
    }
  };

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const res = await axios.get(`${API_URL}/service/get-service/${id}`);
        const serviceData = res.data.service;

        if (!serviceData) {
          toast.error("Service not found.");
          navigate("/error", {
            state: { message: "Service not found." },
          });
          return;
        }

        setService(serviceData);
      } catch (error) {
        const errorMsg1 = error.response?.data?.message || error.message || error.response?.data?.error || "register error"  ;
         navigate("/error", { state: { message: errorMsg1 } });
      } finally {
        setLoading(false);
      }
    };

    fetchServiceData();
  }, [id, API_URL, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-600 text-lg">Service not found.</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Service Header */}
        <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-200 flex flex-col sm:flex-row items-center gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">{service.name}</h2>
        </div>

        {/* Providers List */}
        {service.providers?.length > 0 ? (
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-700 text-center sm:text-left">
              Available Service Providers:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {service.providers.map((provider) => (
                <div
                  key={provider._id}
                  className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 transform transition duration-300 hover:scale-105"
                >
                  <div className="flex flex-col items-center text-center sm:text-left sm:items-start">
                    <h4 className="text-lg font-semibold text-gray-800">
                      {provider.firstName} {provider.lastName}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {provider.experience || 0} years of experience
                    </p>
                    <p className="text-gray-700 text-sm">
                      📍 {provider.Address?.Local || "N/A"}, {provider.Address?.District || "N/A"},{" "}
                      {provider.Address?.State || "N/A"}
                    </p>
                    <p className="font-semibold text-green-600 text-sm mt-2">
                      💰 ₹{provider.service?.price || "N/A"} /hr
                    </p>
                    <button
                      onClick={() => handleViewProfile(provider)}
                      className="mt-4 px-4 py-2 w-full bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all"
                    >
                      View More Details
                    </button>
                    <button
                      onClick={() => handleBookNow(provider)}
                      disabled={bookingLoading[provider._id]}
                      className={`mt-4 px-4 py-2 w-full bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all ${
                        bookingLoading[provider._id] ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {bookingLoading[provider._id] ? "Booking..." : "Book Now"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="mt-6 text-center text-gray-500">No service providers available for this category.</p>
        )}
      </div>
      <AboutUsSection />
    </>
  );
};

export default HomeService;