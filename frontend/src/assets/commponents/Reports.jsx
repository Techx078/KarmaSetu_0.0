import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const Reports = () => {
  const [monthlyCompletedServices, setMonthlyCompletedServices] = useState([]);
  const [serviceTypeDistribution, setServiceTypeDistribution] = useState([]);
  const [topServiceProviders, setTopServiceProviders] = useState({});
  const [selectedCommunity, setSelectedCommunity] = useState("Electrical");

  const COLORS = ["#4CAF50", "#FF9800", "#3F51B5", "#E91E63", "#FF5722"];

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [monthlyRes, typeRes, providersRes] = await Promise.all([
          fetch("http://localhost:3000/admin/reports/monthly"),
          fetch("http://localhost:3000/admin/reports/distribution"),
          fetch("http://localhost:3000/admin/reports/top-providers"),
        ]);

        const monthlyData = await monthlyRes.json();
        const typeData = await typeRes.json();
        const providerData = await providersRes.json();

        setMonthlyCompletedServices(monthlyData);
        setServiceTypeDistribution(typeData);
        setTopServiceProviders(providerData);
        if (Object.keys(providerData).length > 0) {
          setSelectedCommunity(Object.keys(providerData)[0]);
        }
      } catch (error) {
        console.error("Error fetching report data:", error);
      }
    };

    fetchData();
  }, []);

  const totalCompleted = monthlyCompletedServices.reduce(
    (sum, m) => sum + (m.completed || 0),
    0
  );
  const averageTime = "2h 40m"; // You can calculate this from backend if needed
  const averageRating = "4.5";  // Static or calculate from backend

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Service Completion Reports</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-500 text-white p-6 rounded shadow-md">
          <h3 className="text-lg font-bold">Total Completed Requests</h3>
          <p className="text-2xl">{totalCompleted}</p>
        </div>
        <div className="bg-green-500 text-white p-6 rounded shadow-md">
          <h3 className="text-lg font-bold">Avg. Completion Time</h3>
          <p className="text-2xl">{averageTime}</p>
        </div>
        <div className="bg-yellow-500 text-white p-6 rounded shadow-md">
          <h3 className="text-lg font-bold">Avg. User Rating</h3>
          <p className="text-2xl">{averageRating} ⭐</p>
        </div>
      </div>

      {/* Graphs */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white p-6 rounded shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Monthly Completed Services</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyCompletedServices}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="completed" fill="#4CAF50" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Service Type Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={serviceTypeDistribution}
                dataKey="value"
                nameKey="type"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {serviceTypeDistribution.map((entry, index) => (
                  <Cell key={cell-`${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Service Providers */}
      <div className="mt-8 bg-white p-6 rounded shadow-md">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Top 10 Service Providers</h3>

        <select
          className="mb-4 p-2 border rounded"
          value={selectedCommunity}
          onChange={(e) => setSelectedCommunity(e.target.value)}
        >
          {Object.keys(topServiceProviders).map((community) => (
            <option key={community} value={community}>
              {community}
            </option>
          ))}
        </select>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Rating</th>
              <th className="p-3 text-left">Completed Services</th>
              <th className="p-3 text-left">Earnings</th>
            </tr>
          </thead>
          <tbody>
            {(topServiceProviders[selectedCommunity] || []).map((provider, index) => (
              <tr key={index} className="border-b">
                <td className="p-3">{provider.name}</td>
                <td className="p-3">{provider.rating} ⭐</td>
                <td className="p-3">{provider.completed}</td>
                <td className="p-3">₹{provider.earnings.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;