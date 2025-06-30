import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    activeUsers: 0,
    pendingRequests: 0,
    totalServices: 0,
    completedRequests: 0,
    ongoingServices: 0,
  });

  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:3000/admin");
        setStats({
          totalRevenue: res.data.totalRevenue,
          activeUsers: res.data.activeUsers,
          pendingRequests: res.data.pendingRequests,
          totalServices: res.data.totalServices,
          completedRequests: res.data.completedRequests,
          ongoingServices: res.data.ongoingServices,
        });
        setRevenueData(res.data.revenueData);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Admin Dashboard</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { title: "Total Revenue", value: `₹${stats.totalRevenue.toLocaleString()}`, color: "bg-blue-500" },
          { title: "Active Users", value: stats.activeUsers, color: "bg-green-500" },
          { title: "Pending Requests", value: stats.pendingRequests, color: "bg-yellow-500" },
          { title: "Total Services", value: stats.totalServices, color: "bg-purple-500" },
          { title: "Completed Requests", value: stats.completedRequests, color: "bg-red-500" },
          { title: "Ongoing Services", value: stats.ongoingServices, color: "bg-teal-500" },
        ].map((stat, index) => (
          <div key={index} className={`${stat.color} text-white p-4 rounded shadow-md min-h-[120px] flex flex-col justify-center`}>
            <h3 className="text-sm sm:text-base font-bold">{stat.title}</h3>
            <p className="text-lg sm:text-xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="mt-8 bg-white p-4 sm:p-4 rounded shadow-md w-[100%] mx-auto">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 text-center">Revenue Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" fill="#4CAF50" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;