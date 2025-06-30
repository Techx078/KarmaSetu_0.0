import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../assets/commponents/Navbar"; // Corrected import path
import AboutUsSection from "../assets/commponents/AboutUsSection "; // Corrected import path
import axios from "axios";
import { useAuth } from "../context/UserContextProvider";
import toast from "react-hot-toast";

const ServiceDetails = () => {
 
    const { authUser } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Fetch profile data with error handling and redirect
  useEffect(() => {
    const fetchServiceProviders = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`http://localhost:3000/service/profile/${id}`);
        const result = res.data.sp;

        if (!result) {
          setError("Service provider not found.");
          setLoading(false);
          return;
        }

        const newProfile = {
          _id: result._id,
          name: `${result.firstName} ${result.lastName}`,
          Phone: result.phone,
          profession: result.service.name,
          address: `${result.Address.Local}, ${result.Address.District}, ${result.Address.State}`,
          experience: result.experience ? `${result.experience} years` : "Not specified",
          bio:
            result.bio ||
            `Passionate ${result.service.name} with extensive experience in residential and commercial projects. Committed to providing top-tier service with attention to detail.`,
          profileImage: result.profileImage?.url ?? "https://via.placeholder.com/150",
          rating: result.rating?.average ?? "N/A",
          totalRatings: result.rating?.totalRatings || 0,
          pricing:
            result.service.pricingModel === "Hourly"
              ? `₹${result.service.price}/hr`
              : `₹${result.service.price} (Fixed)`,
          availability: result.availability ? "Available" : "Busy",
          isVerified: result.isVerified || false,
        };

        setProfile(newProfile);
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err.response ? err.response.data : err.message);

        if (err.response && err.response.status === 404) {
          setError("Service provider not found.");
          setLoading(false);
        } else {
           const errorMsg1 = err.response?.data?.message || err.message || err.response?.data?.error || "sp profile error"  ;
         navigate("/error", { state: { message: errorMsg1 } });
        }
      }
    };

    fetchServiceProviders();
  }, [id, navigate]);

  // Dummy previous work data
  const [previousWork] = useState([
    { id: 1, address: "123 Main St, New York, NY", description: "Installed new wiring." },
    { id: 2, address: "456 Elm St, New York, NY", description: "Repaired circuit breaker." },
    { id: 3, address: "789 Maple St, New York, NY", description: "Rewired the office." },
    { id: 4, address: "321 Oak St, New York, NY", description: "Upgraded electrical panel." },
    { id: 5, address: "654 Pine St, New York, NY", description: "Installed lighting fixtures." },
  ]);
  const [showMoreWork, setShowMoreWork] = useState(false);

  // Reviews state and fetch logic
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/Review_api/${id}`);
        setReviews(res.data.reviews);
      } catch (error) {
         const errorMsg1 = error.response?.data?.message || error.message || error.response?.data?.error || "review  error"  ;
         navigate("/error", { state: { message: errorMsg1 } });
      }
    };

    fetchReviews();
  }, [id]);

  // New review state
  const [newReview, setNewReview] = useState({ rating: "", comment: "" });

  // Handle review submit
  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!newReview.rating) {
      setMessage("Please select a rating");
      return;
    } else {
      setMessage("");
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3000/Review_api",
        {
          serviceProviderId: id,
          rating: newReview.rating,
          comment: newReview.comment,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNewReview({ rating: "", comment: "" });

      // Refresh reviews after submit
      const res = await axios.get(`http://localhost:3000/Review_api/${id}`);
      setReviews(res.data.reviews);
    } catch (error) {
      console.error("Review submit failed:", error);
      toast.error("Failed to submit review.");
       const errorMsg1 = error.response?.data?.message || error.message || error.response?.data?.error || "review error"  ;
         navigate("/error", { state: { message: errorMsg1 } });
    }
  };

  // Delete review handler
  const handleDeleteReview = async (reviewId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/Review_api/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
      toast.success("Review deleted.");
    } catch (err) {
      console.error("Failed to delete review", err);
      toast.error("Failed to delete review.");
       const errorMsg1 = error.response?.data?.message || error.message || error.response?.data?.error || "delete review error"  ;
         navigate("/error", { state: { message: errorMsg1 } });
    }
  };

  // Book now with error handling and redirect on critical errors
  async function handleBookNow(provider) {
    if (!authUser || !authUser._id) {
      navigate("/login", { state: { redirectTo: `/booking/user/${provider._id}` } });
      return;
    }

    const requestData = {
      User_name: `${authUser.fullname.firstName} ${authUser.fullname.lastName}`,
      ServiceProvider_name: provider.name,
      User_Phone: authUser.phone,
      Service_Phone: provider.Phone,
      userId: authUser._id,
      serviceProviderId: provider._id,
    };

    try {
      const response = await axios.post("http://localhost:3000/booking/book-my-service", requestData);
      toast.success(response.data.message);
      navigate(`/user/${authUser._id}`);
    } catch (error) {
      console.error("Error sending request:", error.response?.data || error.message);

      if (error.response && [400, 401, 403].includes(error.response.status)) {
        toast.error(error.response.data.message || "Failed to send booking request.");
      } else {
        toast.error("Unexpected error occurred. Redirecting...");
         const errorMsg1 = error.response?.data?.message || error.message || error.response?.data?.error || "register error"  ;
         navigate("/error", { state: { message: errorMsg1 } });
      }
    }
  }

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  // Render error message
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }


  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all hover:shadow-2xl">
          {loading ? (
            <div className="p-6 animate-pulse">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-32 h-32 bg-gray-300 rounded-full"></div>
                <div className="flex-1 space-y-4">
                  <div className="h-8 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-300 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          ) : error ? (
            <p className="p-6 text-center text-red-500 text-lg font-semibold">{error}</p>
          ) : (
            <>
              {/* Profile Section */}
              <div className="p-6 bg-white border-b border-gray-200 animate-fade-in">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                  <div className="relative group">
                    <img
                      src={profile.profileImage}
                      alt={`${profile.name}'s profile`}
                      className="w-32 h-32 rounded-full object-cover border-4 border-indigo-500 shadow-lg transition-transform duration-300 group-hover:scale-105"
                    />
                    {profile.isVerified && (
                      <span className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow">
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="flex-1 space-y-4 text-center md:text-left">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900">{profile.name}</h2>
                      <p className="text-xl text-indigo-600 capitalize mt-1">{profile.profession}</p>
                    </div>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                      <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700 hover:bg-gray-200 transition-colors">
                        <span className="text-gray-500">📍</span>
                        <span>{profile.address}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700 hover:bg-gray-200 transition-colors">
                        <span className="text-gray-500">🕒</span>
                        <span>{profile.experience}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700 hover:bg-gray-200 transition-colors">
                        <span className="text-yellow-400">⭐</span>
                        <span>
                          {profile.rating} ({profile.totalRatings} reviews)
                        </span>
                      </div>
                      <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700 hover:bg-gray-200 transition-colors">
                        <span className="text-green-500">💰</span>
                        <span>{profile.pricing}</span>
                      </div>
                      <div
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                          profile.availability === "Available"
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-red-100 text-red-700 hover:bg-red-200"
                        } transition-colors`}
                      >
                        <span>{profile.availability}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{profile.bio}</p>
                    <button
                      onClick={() => handleBookNow(profile)}
                      className="mt-4 px-4 py-2 w-full bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>

              {/* Previous Work Section */}
              <div className="p-6 bg-white border-b border-gray-200">
                <h3 className="text-xl font-bold text-orange-600 mb-4">Previous Work</h3>
                <div className="space-y-4">
                  {previousWork.slice(0, showMoreWork ? previousWork.length : 3).map((work) => (
                    <div
                      key={work.id}
                      className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200 hover:border-orange-300 transition-all"
                    >
                      <p className="text-gray-500 text-sm font-medium">📍 {work.address}</p>
                      <p className="text-gray-700 mt-1">{work.description}</p>
                    </div>
                  ))}
                </div>
                {previousWork.length > 3 && (
                  <button
                    onClick={() => setShowMoreWork(!showMoreWork)}
                    className="mt-4 text-blue-500 hover:text-blue-700 transition-colors font-medium focus:outline-none"
                  >
                    {showMoreWork ? "See Less" : "See More"}
                  </button>
                )}
              </div>

              {/* Reviews & Ratings Section */}
              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <h3 className="text-xl font-bold text-purple-600 mb-4">Reviews & Ratings</h3>
                {reviews.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No reviews yet.</p>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div
                        key={review._id}
                        className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:border-purple-300 transition-all"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-gray-800">
                              {review.user?.fullname.firstName || "Anonymous"}
                            </p>
                            <p className="text-yellow-500 text-sm">
                              {"⭐".repeat(review.rating)} ({review.rating}/5)
                            </p>
                            <p className="text-gray-600 mt-1">{review.comment}</p>
                          </div>
                          {currentUserId === review.user?._id && (
                            <button
                              onClick={() => handleDeleteReview(review._id)}
                              className="text-red-500 hover:text-red-700 transition-colors font-medium focus:outline-none"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add Review Section */}
              {token && (
                <div className="p-6 border-t border-gray-200 bg-white">
                  <h3 className="text-lg font-semibold mb-4 text-indigo-700">Add Your Review</h3>
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    {message ? (
                      <>
                        <h2 className="text-red-500">{message}</h2>
                        <div className="flex gap-1 justify-center md:justify-start">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setNewReview({ ...newReview, rating: star })}
                              className={`text-3xl transition duration-200 focus:outline-none ${
                                star <= newReview.rating ? "text-yellow-400" : "text-gray-300"
                              } hover:text-yellow-500`}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="flex gap-1 justify-center md:justify-start">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewReview({ ...newReview, rating: star })}
                            className={`text-3xl transition duration-200 focus:outline-none ${
                              star <= newReview.rating ? "text-yellow-400" : "text-gray-300"
                            } hover:text-yellow-500`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    )}

                    <textarea
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      placeholder="Leave a comment"
                      rows={3}
                      className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm transition-all hover:border-indigo-300"
                    />

                    <button
                      type="submit"
                      className="bg-indigo-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-indigo-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    >
                      Submit Review
                    </button>
                  </form>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <AboutUsSection />
    </>
  );
};

export default ServiceDetails;