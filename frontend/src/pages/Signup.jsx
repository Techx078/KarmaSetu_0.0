import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoChevronBackCircle } from "react-icons/io5";
import { toast } from "react-toastify";
import axios from "axios";
import { useServiceProviderAuth } from "../context/ServiceProviderContextProvider";
import { useAuth } from "../context/UserContextProvider";
import indiaData from "../assets/indiaData.json"
import  AdressComponenets from "../assets/commponents/AdressComponenets"
function Signup() {

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const { setServiceProvider } = useServiceProviderAuth();
  const { setAuthUser } = useAuth();

  const [userType, setUserType] = useState("Simple User");
  const [isClick, setIsClick] = useState(false);
  const [Visible, setVisible] = useState(true);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [servicename, setServicename] = useState("");
  const [district, setDistrict] = useState("");
  const [experience, setExperience] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [pricingModel, setPricingModel] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const states = Object.keys(indiaData);
  const districts = state ? indiaData[state] : [];
  const services = [
    "Mason",
    "Plumber",
    "Electrician",
    "Carpenter",
    "Painter",
    "House Cleaner",
    "Pest Control Specialist",
    "Interior Designer",
    "AC Repair Technician",
    "Car Washer",
    "Bike Mechanic",
    "Car Mechanic",
  ];
  const pricingModels = ["Hourly", "Fixed"];

  const boxRef = useRef(null);
  const navigate = useNavigate();

  const toggleVisibility = () => setVisible((prev) => !prev);

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setPassword("");
    setProfileImage(null);
    setCity("");
    setState("");
    setDistrict("");
    setServicename("");
    setPrice("");
    setPricingModel("");
    setError("");
    setExperience("");
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePhone = (phone) => {
    const regex = /^[0-9]{10}$/;
    return regex.test(phone);
  };

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const validateForm = () => {
    if (!validateEmail(email)) {
      setError("Invalid email address");
      toast.error("Invalid email address");
      return false;
    }
    if (!validatePhone(phone)) {
      setError("Mobile number must be 10 digits only");
      toast.error("Mobile number must be 10 digits only");
      return false;
    }
    if (!validatePassword(password)) {
      setError(
        "Password must be at least 8 characters, include uppercase, lowercase, number, and special character"
      );
      toast.error(
        "Password must be at least 8 characters, include uppercase, lowercase, number, and special character"
      );
      return false;
    }
    return true;
  };

  const handleSubmitServiceProvider = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!profileImage) {
      setError("Please select an image");
      toast.error("Please select an image");
      return;
    }
    if (!city || !state) {
      setError("City and State are required");
      toast.error("City and State are required");
      return;
    }

    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.append("file", profileImage);
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("password", password);
    formData.append("Local", city);
    formData.append("State", state);
    formData.append("District", district);
    formData.append("serviceName", servicename);
    formData.append("pricingModel", pricingModel);
    formData.append("price", price);
    formData.append("experience", experience);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);

    try {
      const response = await axios.post(
        "http://localhost:3000/service/register",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      localStorage.setItem("token", response.data.token);
      setServiceProvider(response.data.SPdb);
      toast.success("Service Provider registration successful");
      resetForm();
      navigate("/home");
    } catch (error) {
      const status = error.response?.status || 500;
      const errorMsg =
        error.response?.data?.error || error.message || "An error occurred.";

      if (status >= 400 && status < 500) {
        // Client errors - show toast
        setError(errorMsg);
        toast.error(errorMsg);
      } else {
        // Server or unknown error - navigate to error page
         const errorMsg1 = error.response?.data?.message || error.message || error.response?.data?.error || "register error"  ;
         navigate("/error", { state: { message: errorMsg1 } });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitUser = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!profileImage) {
      setError("Please select an image");
      toast.error("Please select an image");
      return;
    }
    if (!city || !state) {
      setError("City and State are required");
      toast.error("City and State are required");
      return;
    }

    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.append("file", profileImage);
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("password", password);
    formData.append("Local", city);
    formData.append("State", state);
    formData.append("District", district);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);

    try {
      const response = await axios.post(
        "http://localhost:3000/user/register",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      localStorage.setItem("token", response.data.token);
      setAuthUser(response.data.User);
      toast.success("User registration successful");
      resetForm();
      navigate("/home");
    } catch (error) {
      const status = error.response?.status || 500;
      const errorMsg =
        error.response?.data?.error || error.message || "An error occurred.";

      if (status >= 400 && status < 500) {
        // Client errors - show toast
        setError(errorMsg);
        toast.error(errorMsg);
      } else {
        const errorMsg1 = error.response?.data?.message || error.message || error.response?.data?.error || "register error"  ;
         navigate("/error", { state: { message: errorMsg1 } });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    if (userType === "Simple User") {
      handleSubmitUser(e);
    } else {
      handleSubmitServiceProvider(e);
    }
  };


  return (
    <div className="flex items-center justify-center h-full mb-1 min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">


      <div className=" w-full max-w-md relative overflow-hidden mb-[50px]">
        <div
          className="border border-gray-200 rounded-md p-4"
          style={{ display: Visible ? "block" : "none" }}
        >
          <div className="relative w-full h-60 bg-yellow-400 rounded-br-full">
            <h2 className="text-4xl font-bold text-center text-white relative z-10">
              Create Account
            </h2>
            <p className="text-center text-black relative z-10">
              Please sign up to continue
            </p>
          </div>

          <form
            ref={boxRef}
            className="mt-[10px]"
            onSubmit={(e) => e.preventDefault()}
          >
            <label className="block mb-2 text-gray-600">Select Category</label>
            <select
              className="w-full p-3 border rounded-lg mb-3"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
            >
              <option value="Simple User">Simple User</option>
              <option value="Service Provider">Service Provider</option>
            </select>
            <button
              type="button"
              className="w-full bg-yellow-500 mb-9 mt-9 text-white py-3 rounded-lg hover:bg-yellow-600 transition"
              onClick={() => {
                setIsClick(true);
                toggleVisibility();
              }}
            >
              Next
            </button>
          </form>
        </div>

        {isClick && userType === "Simple User" && (
          <form
            className="mt-4 h-full"
            encType="multipart/form-data"
            onSubmit={handleSubmit}
          >
            <button
              type="button"
              className="flex items-center justify-between gap-2 mb-2 text-xl"
              onClick={() => {
                setIsClick(false);
                toggleVisibility();
              }}
            >
              <IoChevronBackCircle />Back
            </button>
            <label className="block mb-2 text-black">First Name</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg mb-3"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your first name"
              required
            />
            <label className="block mb-2 text-black">Last Name</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg mb-3"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter your last name"
              required
            />
            <label className="block mb-2 text-black">Email Address</label>
            <input
              type="email"
              className="w-full p-3 border rounded-lg mb-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
            <label className="block mb-2 text-black">Mobile Number</label>
            <input
              type="tel"
              className="w-full p-3 border rounded-lg mb-3"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your mobile number"
              required
            />

          <AdressComponenets setLatitude={setLatitude} setLongitude={setLongitude} />   

          <div className="flex items-center justify-center gap-5">
                <div className="w-1/3">
                  <label className="mb-2 text-black">State</label>
                  <select
                    className="w-full p-3 border rounded-lg mb-3"
                    value={state}
                    onChange={(e) => {
                      setState(e.target.value);
                      setDistrict("");
                      setCity("");
                    }}
                    required
                  >
                    <option value="">Select State</option>
                    {states.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                    
                <div className="w-1/3">
                  <label className="mb-2 text-black">District</label>
                  <select
                    className="w-full p-3 border rounded-lg mb-3"
                    value={district}
                    onChange={(e) => {
                      setDistrict(e.target.value);
                      setCity("");
                    }}
                    disabled={!state}
                    required
                  >
                    <option value="">Select District</option>
                    {districts.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div className="w-1/3">
                  <label className="mb-2 text-black">City</label>
                  <input
                    type="text"
                    className="w-full p-3 border rounded-lg mb-3"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter City (Optional)"
                  />
                </div>
              </div>

            <label className="mb-2 text-black">Profile Image</label>
            <input
              type="file"
              className="w-full p-3 border rounded-lg mb-3"
              onChange={(e) => setProfileImage(e.target.files[0])}
              required
            />
            <label className="block mb-2 text-black">Password</label>
            <input
              type="password"
              className="w-full p-3 border rounded-lg mb-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            {error && <p className="text-red-500 mb-3">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-yellow-500 text-white py-3 rounded-lg transition ${
                loading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-yellow-600"
              }`}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>
        )}

        {isClick && userType === "Service Provider" && (
          <div className="pt-2 pb-5 h-full">
            <button
              type="button"
              onClick={() => {
                setIsClick(false);
                toggleVisibility();
              }}
            >
              <IoChevronBackCircle />
            </button>
            <form
              className="mt-4"
              encType="multipart/form-data"
              onSubmit={handleSubmit}
            >
              <label className="mb-2 text-black">First Name</label>
              <input
                type="text"
                className="w-full p-3 border rounded-lg mb-3"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
                required
              />
              <label className="mb-2 text-black">Last Name</label>
              <input
                type="text"
                className="w-full p-3 border rounded-lg mb-3"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your last name"
                required
              />
              <label className="mb-2 text-black">Mobile Number</label>
              <input
                type="tel"
                className="w-full p-3 border rounded-lg mb-3"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your mobile number"
                required
              />
              <label className="mb-2 text-black">Email Address</label>
              <input
                type="email"
                className="w-full p-3 border rounded-lg mb-3"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
          <AdressComponenets setLatitude={setLatitude} setLongitude={setLongitude} />   

          <div className="flex items-center justify-center gap-5">
                <div className="w-1/3">
                  <label className="mb-2 text-black">State</label>
                  <select
                    className="w-full p-3 border rounded-lg mb-3"
                    value={state}
                    onChange={(e) => {
                      setState(e.target.value);
                      setDistrict("");
                      setCity("");
                    }}
                    required
                  >
                    <option value="">Select State</option>
                    {states.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="w-1/3">
                  <label className="mb-2 text-black">District</label>
                  <select
                    className="w-full p-3 border rounded-lg mb-3"
                    value={district}
                    onChange={(e) => {
                      setDistrict(e.target.value);
                      setCity("");
                    }}
                    disabled={!state}
                    required
                  >
                    <option value="">Select District</option>
                    {districts.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div className="w-1/3">
                  <label className="mb-2 text-black">City</label>
                  <input
                    type="text"
                    className="w-full p-3 border rounded-lg mb-3"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter City (Optional)"
                  />
                </div>
              </div>
              <label className="block text-black">Experience</label>
              <input
                type="number"
                name="experience"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full p-2 border rounded-lg mb-3"
                required
                placeholder="Enter Price"
              />
              <label className="mb-2 text-black">Profile Image</label>
              <input
                type="file"
                className="w-full p-3 border rounded-lg mb-3"
                onChange={(e) => setProfileImage(e.target.files[0])}
                required
              />
              <label className="mb-2 text-black">Password</label>
              <input
                type="password"
                className="w-full p-3 border rounded-lg mb-3"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <div>
                <label className="block text-black">Service</label>
                <select
                  name="servicename"
                  value={servicename}
                  onChange={(e) => setServicename(e.target.value)}
                  className="w-full p-2 border rounded-lg mb-3"
                  required
                >
                  <option value="">Select Service</option>
                  {services.map((service, index) => (
                    <option key={index} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-black">Pricing Model</label>
                <select
                  name="pricingModel"
                  value={pricingModel}
                  onChange={(e) => setPricingModel(e.target.value)}
                  className="w-full p-2 border rounded-lg mb-3"
                  required
                >
                  <option value="">Select Pricing Model</option>
                  {pricingModels.map((model, index) => (
                    <option key={index} value={model}>
                      {model}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-black">Price</label>
                <input
                  type="number"
                  name="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full p-2 border rounded-lg mb-3"
                  required
                  placeholder="Enter Price"
                />
              </div>
              {error && <p className="text-red-500 mb-3">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-yellow-500 text-white py-3 rounded-lg transition ${
                  loading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-yellow-600"
                }`}
              >
                {loading ? "Signing Up..." : "Sign Up"}
              </button>
            </form>
          </div>
        )}

        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-yellow-500">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
