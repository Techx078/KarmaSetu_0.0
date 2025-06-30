import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Start = () => {
  const navigate = useNavigate();
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Simulate some async operation (e.g. loading config) which might fail
    const simulateLoad = async () => {
      try {
        // Here you could put any async code that might throw
        // For demonstration, just a timeout that resolves normally
        await new Promise((resolve) => setTimeout(resolve, 2000));
        
        // After successful "load", navigate to /Home after 1 second
        setTimeout(() => {
          navigate("/Home");
        }, 1000);
      } catch (err) {
        console.error("Error during startup:", err);
        setHasError(true);
      }
    };

    simulateLoad();
  }, [navigate]);

  useEffect(() => {
    if (hasError) {
      // Redirect to error page if error occurs
      navigate("/error");
    }
  }, [hasError, navigate]);

  return (
    <div className="flex items-center flex-col justify-center bg-gradient-to-r from-[#04040b] via-[#360136] to-purple-950 w-screen h-screen">
      <motion.div
        className="w-[200px] h-[200px] rounded-full border-none"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <img
          className="w-full h-full rounded-full object-cover p-1 bg-white"
          src="/images/logo1.png"
          alt="KarmaSetu Logo"
        />
      </motion.div>

      <motion.h1
        className="text-center text-[1rem] text-white font-semibold mt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
      >
        Find The Best Community of Service-Provider
      </motion.h1>
    </div>
  );
};

export default Start;
