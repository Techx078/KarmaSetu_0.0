import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/UserContextProvider";
import { useServiceProviderAuth } from "../../context/ServiceProviderContextProvider";
import axios from "axios";

const Navbar = () => {
  const { authUser, setAuthUser } = useAuth();
  const { serviceProvider, setServiceProvider } = useServiceProviderAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchPlaceholder, setSearchPlaceholder] = useState("Search services...");
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  const serviceTypes = [
    "Search for Electrician",
    "Search for Carpenter",
    "Search for Plumber",
    "Search for Painter",
  ];

  // Fetch services from backend
  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await axios.get("http://localhost:3000/service/get-services");
        setServices(res.data.result || []);
      } catch (err) {
        toast.error("Failed to fetch services");
      }
    }
    fetchServices();
  }, []);

  // Placeholder animation
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setSearchPlaceholder(serviceTypes[index]);
      index = (index + 1) % serviceTypes.length;
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const scrollToAbout = (e) => {
    e.preventDefault();
    const aboutSection = document.getElementById("about-us");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth", block: "start" });
      setMobileMenuOpen(false);
    }
  };

  const handleLoginSignup = () => {
    navigate("/signup");
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
      const res = await axios.post(
        "http://localhost:3000/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Logged out successfully");
      localStorage.removeItem("token");
      setAuthUser(null);
      setServiceProvider(null);
      navigate("/home");
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Something went wrong!";
      navigate("/error", { state: { message: errorMsg } });                     /////////////////////////////
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      setSuggestions([]);
    } else {
      const filteredSuggestions = services.filter((service) =>
        service.name.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion?.name);                           //////////////////////////////////////
    setSuggestions([]);
    navigate(`/homeSevice/${suggestion._id}`);
  };

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      const matchedService = services.find((service) =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (matchedService) {
        navigate(`/homeSevice/${matchedService._id}`);
      } else {
        toast.error("Service not found!");
      }
      setSuggestions([]);
    }
  };

  const logoUrl = "/images/logo1.png";

  return (
    <nav className="bg-black shadow-md p-4 flex items-center justify-between z-50 sticky top-0">
      {/* Logo */}
      <Link to="/home" className="flex items-center">
        <img
          src={logoUrl}
          alt="KarmaSetu Logo"
          className="h-[100px] w-[100px] object-cover aspect-auto rounded-full"
        />
      </Link>

      {/* Desktop Nav Links */}
      <ul className="hidden md:flex space-x-6 ml-5">
        <li>
          <Link to="/home" className="text-white hover:text-blue-600">
            Home
          </Link>
        </li>
        <li>
          <Link to="/services" className="text-white hover:text-blue-600">
            Services
          </Link>
        </li>
        <li>
          <Link
            to="/home"
            onClick={scrollToAbout}
            className="text-white hover:text-blue-600"
          >
            About Us
          </Link>
        </li>
        <li>
          <Link to="/GetContect" className="text-white hover:text-blue-600">
            Contact
          </Link>
        </li>
      </ul>

      {/* Search Bar */}
      <div className="relative flex-1 mx-2 hidden md:block">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyPress={handleSearchSubmit}
          placeholder={searchPlaceholder}
          className="px-4 py-2 mx-2 border rounded-lg w-3/5 focus:outline-none focus:ring focus:border-blue-300"
        />
        {suggestions.length > 0 && (
          <ul className="absolute top-12 left-0 w-full bg-white border rounded-lg shadow-md max-h-60 overflow-y-auto z-50">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion._id}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
              >
                {suggestion.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Auth Buttons */}
      {authUser || serviceProvider ? (
        <button
          className="bg-yellow-600 text-white px-4 py-2 mr-3 rounded-lg hover:bg-yellow-700 hidden md:block"
          onClick={handleLogout}
        >
          Logout
        </button>
      ) : (
        <button
          className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 hidden md:block"
          onClick={handleLoginSignup}
        >
          Login/Signup
        </button>
      )}

      {/* Profile Buttons */}
      {authUser && (
        <button
          onClick={() => navigate(`/user/${authUser._id}`)}
          className="bg-yellow-600 text-white px-4 py-2 mr-2 rounded-lg hover:bg-yellow-700 hidden md:block"
        >
          User
        </button>
      )}
      {serviceProvider && (
        <button
          onClick={() =>
            navigate(`/Service-provider-Profile/${serviceProvider._id}`)
          }
          className="bg-yellow-600 text-white px-4 py-2 mr-2 rounded-lg hover:bg-yellow-700 hidden md:block"
        >
          Service Provider
        </button>
      )}

      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden text-white"
      >
        {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-center space-y-4 py-4 md:hidden z-50">
          <Link
            to="/home"
            className="text-gray-600 hover:text-blue-600"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/services"
            className="text-gray-600 hover:text-blue-600"
            onClick={() => setMobileMenuOpen(false)}
          >
            Services
          </Link>
          <Link
            to="/home"
            onClick={scrollToAbout}
            className="text-gray-600 hover:text-blue-600"
          >
            About Us
          </Link>
          <Link
            to="/GetContect"
            className="text-gray-600 hover:text-blue-600"
            onClick={() => setMobileMenuOpen(false)}
          >
            Contact
          </Link>
          <div className="relative w-full px-6">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyPress={handleSearchSubmit}
              placeholder={searchPlaceholder}
              className="px-4 py-2 border rounded-lg w-full focus:outline-none focus:ring focus:border-blue-300"
            />
            {suggestions.length > 0 && (
              <ul className="absolute top-12 left-6 right-6 bg-white border rounded-lg shadow-md max-h-60 overflow-y-auto z-50">
                {suggestions.map((suggestion) => (
                  <li
                    key={suggestion._id}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                  >
                    {suggestion.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {authUser || serviceProvider ? (
            <button
              className="bg-[#fcce4b] text-white px-4 py-2 rounded-lg hover:bg-yellow-500 w-3/4"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <button
              className="bg-[#fcce4b] text-white px-4 py-2 rounded-lg hover:bg-yellow-500 w-3/4"
              onClick={handleLoginSignup}
            >
              Login/Signup
            </button>
          )}
          {authUser && (
            <button
              onClick={() => {
                navigate(`/user/${authUser._id}`);
                setMobileMenuOpen(false);
              }}
              className="bg-[#fcce4b] text-white px-4 py-2 rounded-lg hover:bg-yellow-500 w-3/4"
            >
              User
            </button>
          )}
          {serviceProvider && (
            <button
              onClick={() => {
                navigate(`/Service-provider-Profile/${serviceProvider._id}`);
                setMobileMenuOpen(false);
              }}
              className="bg-[#fcce4b] text-white px-4 py-2 rounded-lg hover:bg-yellow-500 w-3/4"
            >
              Service Provider
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;