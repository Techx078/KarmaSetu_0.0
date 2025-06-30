import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useServiceProviderAuth } from "../context/ServiceProviderContextProvider";
import { useAuth } from "../context/UserContextProvider";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const [userType, setUserType] = useState("Simple User");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const navigate = useNavigate();
const { setServiceProvider } = useServiceProviderAuth();
const { setAuthUser } = useAuth();

const submitHandlerSp = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post("http://localhost:3000/service/login", { email, password });
    toast.success("Service Provider Login Successfully...");
    localStorage.setItem("token", res.data.token);
    setServiceProvider(res.data.serviceProvider);
    setAuthUser(res.data.User);
    navigate("/home");
  } catch (err) {
    console.error("Service Provider login error:", err.response?.data || err.message);
    const errorMessage = err.response?.data?.message || err.message;
    // If it's a known error (e.g. 401, 400), stay on login
    if (err.response && [400, 401].includes(err.response.status)) {
      toast.error("Service Provider Login Failed: " + errorMessage);
      navigate("/login");
    } else {
      toast.error("Unexpected error occurred. Redirecting...");
       const errorMsg1 = err.response?.data?.message || err.message || err.response?.data?.error || "login error"  ;
         navigate("/error", { state: { message: errorMsg1 } });
    }
  }
};

const submithandler = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post("http://localhost:3000/user/login", { email, password });
    console.log("User login response:", res.data);
    toast.success("User Login Successfully...");
    localStorage.setItem("token", res.data.token);
    setAuthUser(res.data.User);
    navigate("/home");
  } catch (err) {
    console.error("User login error:", err.response?.data || err.message);

    const errorMessage = err.response?.data?.message || err.message;

    if (err.response && [400, 401].includes(err.response.status)) {
      toast.error("User Login Failed: " + errorMessage);
      navigate("/login");
    } else {
       const errorMsg1 = err.response?.data?.message || err.message || err.response?.data?.error || "login error"  ;
         navigate("/error", { state: { message: errorMsg1 } });
    }
  }
};

const handleSubmit = (e) => {
  if (userType === "Simple User") {
    submithandler(e);
  } else {
    submitHandlerSp(e);
  }
};


  return (
    <div className="flex items-center justify-center h-screen min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-gray-700">Welcome Back</h2>
        <p className="text-center text-gray-500">Please sign in to continue</p>

        <form className="mt-4" onSubmit={handleSubmit}>
          <select
            className="w-full p-3 border rounded-lg mb-3"
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
          >
            <option value="Simple User">Simple User</option>
            <option value="Service Provider">Service Provider</option>
          </select>

          <label className="block mb-2 text-gray-600">Email or Mobile Number</label>
          <input
            type="text"
            className="w-full p-3 border rounded-lg mb-3"
            placeholder="Enter your email or mobile"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="block mb-2 text-gray-600">Password</label>
          <input
            type="password"
            className="w-full p-3 border rounded-lg mb-3"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="w-full bg-yellow-500 text-white py-3 rounded-lg">
            Login
          </button>
        </form>

        <p className="text-center mt-4">
          Don't have an account? <Link to="/signup" className="text-yellow-500">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;