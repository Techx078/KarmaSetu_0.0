// src/StatsCard.js
import React, { useEffect, useState } from "react";
import axios from "axios"; // You forgot to import axios!

const StatsCard = () => {
  const [activeUser, setActiveUser] = useState(0);
  const [serviceProvider, setServiceProvider] = useState(0);
  const [project, setProject] = useState(0);
  const [visiter, setVisiter] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:3000/admin");
        setActiveUser(res.data.activeUsers || 0);
        setProject(res.data.ongoingServices || 0);

        const res1 = await axios.get("http://localhost:3000/admin/users");
        setServiceProvider(res1.data.length || 0);

        // Set visiter after both are fetched
        setVisiter((res.data.activeUsers || 0) + (res1.data.length || 0));
      } catch (err) {
        const errorMsg = err.response?.data?.message || "Failed to fetch services!";
        navigate("/error", { state: { message: errorMsg } });
      }
    };

    fetchStats();
  }, []);

  return (
    <>
      <div className="flex flex-wrap relative justify-center p-6 mt-[10px] pt-[100px] bg-gray-200">
        <div className="bg-black shadow-md rounded-lg p-4 md:p-6 mx-2 mb-4 w-full sm:w-48 text-center flex-grow">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            {activeUser}
          </h2>
          <p className="text-sm sm:text-base text-gray-400">Users</p>
        </div>

        <div className="bg-black shadow-md rounded-lg p-4 md:p-6 mx-2 mb-4 w-full sm:w-48 text-center flex-grow">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            {serviceProvider}
          </h2>
          <p className="text-sm sm:text-base text-gray-400">Services</p>
        </div>

        <div className="bg-black shadow-md rounded-lg p-4 md:p-6 mx-2 mb-4 w-full sm:w-48 text-center flex-grow">
          <h2 className="text-xl sm:text-2xl font-bold text-white">{visiter}</h2>
          <p className="text-sm sm:text-base text-gray-400">Visitors</p>
        </div>

        <div className="bg-black shadow-md rounded-lg p-4 md:p-6 mx-2 mb-4 w-full sm:w-48 text-center flex-grow">
          <h2 className="text-xl sm:text-2xl font-bold text-white">{project}</h2>
          <p className="text-sm sm:text-base text-gray-400">Active Projects</p>
        </div>
      </div>
    </>
  );
};

export default StatsCard;