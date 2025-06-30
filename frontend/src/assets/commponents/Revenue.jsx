import React, { useState } from "react";

const Revenue = () => {
  // State for revenue data
  const [revenueData, setRevenueData] = useState([
    { month: "January", amount: 100000 },
    { month: "February", amount: 85000 },
    { month: "March", amount: 95500 },
    { month: "April", amount: 110000 },
    { month: "May", amount: 120000 },
  ]);

  const [newMonth, setNewMonth] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [sortOrder, setSortOrder] = useState("default");

  // Calculate total earnings
  const totalEarnings = revenueData.reduce((sum, entry) => sum + entry.amount, 0);

  // Add a new month revenue
  const addRevenue = () => {
    if (newMonth && newAmount) {
      setRevenueData([...revenueData, { month: newMonth, amount: parseInt(newAmount) }]);
      setNewMonth("");
      setNewAmount("");
    }
  };

  // Delete a revenue entry
  const deleteRevenue = (index) => {
    setRevenueData(revenueData.filter((_, i) => i !== index));
  };

  // Handle inline editing
  const editRevenue = (index, value) => {
    const updatedData = [...revenueData];
    updatedData[index].amount = parseInt(value) || 0;
    setRevenueData(updatedData);
  };

  // Sorting logic
  const sortedRevenue = [...revenueData].sort((a, b) => {
    if (sortOrder === "high-to-low") return b.amount - a.amount;
    if (sortOrder === "low-to-high") return a.amount - b.amount;
    return 0; // Default order
  });

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-md w-full max-w-3xl mx-auto">
      <h3 className="font-bold text-xl text-gray-800 border-b pb-2 mb-4">Monthly Earnings</h3>

      {/* Sorting */}
      <div className="mb-4 flex justify-between">
        <select 
          className="p-2 border rounded"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="default">Default Order</option>
          <option value="high-to-low">Highest to Lowest</option>
          <option value="low-to-high">Lowest to Highest</option>
        </select>
      </div>

      {/* Revenue List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sortedRevenue.map((item, index) => {
          const prevAmount = index > 0 ? sortedRevenue[index - 1].amount : null;
          const isIncrease = prevAmount !== null && item.amount > prevAmount;
          
          return (
            <div 
              key={index} 
              className="bg-white p-4 rounded-md shadow-sm hover:shadow-md transition duration-200 relative"
            >
              <h4 className="text-gray-700 font-semibold">{item.month}</h4>
              <input 
                type="number"
                className="text-lg font-bold text-green-600 bg-transparent focus:outline-none w-full"
                value={item.amount}
                onChange={(e) => editRevenue(index, e.target.value)}
              />
              {prevAmount !== null && (
                <span className={`absolute top-2 right-2 text-xs font-semibold ${isIncrease ? "text-green-500" : "text-red-500"}`}>
                  {isIncrease ? "↑ Increased" : "↓ Decreased"}
                </span>
              )}
              <button 
                className="absolute bottom-2 right-2 text-red-500 hover:text-red-700 text-xs"
                onClick={() => deleteRevenue(index)}
              >
                ❌ Remove
              </button>
            </div>
          );
        })}
      </div>

      {/* Total Earnings */}
      <div className="mt-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded">
        <h4 className="font-semibold text-lg">Total Earnings</h4>
        <p className="text-2xl font-bold">`₹{totalEarnings.toLocaleString()}`</p>
      </div>

      {/* Add New Revenue */}
      <div className="mt-6 bg-white p-4 rounded shadow">
        <h4 className="font-semibold mb-2">Add New Month</h4>
        <div className="flex space-x-2">
          <input 
            type="text" 
            placeholder="Month"
            className="p-2 border rounded w-full"
            value={newMonth}
            onChange={(e) => setNewMonth(e.target.value)}
          />
          <input 
            type="number"
            placeholder="Amount"
            className="p-2 border rounded w-full"
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
          />
          <button 
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            onClick={addRevenue}
          >
            ➕ Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default Revenue;