import React, { useState, useEffect } from "react";
import axios from "axios";

const Users = () => {
  const [serviceProviders, setServiceProviders] = useState([]);

  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCommunity, setSelectedCommunity] = useState("");

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await axios.get("http://localhost:3000/admin/users"); // Update this URL if needed
        setServiceProviders(res.data || []);
      } catch (err) {
        console.error("Failed to fetch service providers", err);
      }
    };

    fetchProviders();
  }, []);

  const uniqueStates = [...new Set(serviceProviders.map(sp => sp.state))];
  const uniqueCommunities = [...new Set(serviceProviders.map(sp => sp.community))];

  const availableCities = [...new Set(
    serviceProviders
      .filter(sp => (!selectedState || sp.state === selectedState) &&
                    (!selectedCommunity || sp.community === selectedCommunity))
      .map(sp => sp.city)
  )];

  const filteredProviders = serviceProviders.filter(sp =>
    (!selectedState || sp.state === selectedState) &&
    (!selectedCity || sp.city === selectedCity) &&
    (!selectedCommunity || sp.community === selectedCommunity)
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Registered Service Providers</h2>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <select
          className="p-2 border rounded"
          value={selectedState}
          onChange={(e) => {
            setSelectedState(e.target.value);
            setSelectedCity("");
          }}
        >
          <option value="">Select State</option>
          {uniqueStates.map((state, idx) => (
            <option key={state-`${idx}`} value={state}>{state}</option>
          ))}
        </select>

        <select
          className="p-2 border rounded"
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          disabled={!selectedState}
        >
          <option value="">Select City</option>
          {availableCities.map((city, idx) => (
            <option key={city-`${idx}`} value={city}>{city}</option>
          ))}
        </select>

        <select
          className="p-2 border rounded"
          value={selectedCommunity}
          onChange={(e) => {
            setSelectedCommunity(e.target.value);
            setSelectedCity("");
          }}
        >
          <option value="">Select Community</option>
          {uniqueCommunities.map((community, idx) => (
            <option key={community-`${idx}`} value={community}>{community}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white p-6 rounded shadow-md">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Service Providers List</h3>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Community</th>
              <th className="p-3 text-left">State</th>
              <th className="p-3 text-left">City</th>
              <th className="p-3 text-left">Experience (Years)</th>
              <th className="p-3 text-left">Rating</th>
            </tr>
          </thead>
          <tbody>
            {filteredProviders.length > 0 ? (
              filteredProviders.map((provider, index) => (
                <tr key={provider-`${provider.name}`-`${index}`} className="border-b">
                  <td className="p-3">{provider.name}</td>
                  <td className="p-3">{provider.community}</td>
                  <td className="p-3">{provider.state}</td>
                  <td className="p-3">{provider.city}</td>
                  <td className="p-3">{provider.experience}</td>
                  <td className="p-3">{provider.rating} ⭐</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-3">No service providers found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;