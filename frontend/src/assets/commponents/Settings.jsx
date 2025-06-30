import React, { useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";

const Settings = () => {
  // State for Fees Management
  const [fees, setFees] = useState([
    { id: 1, service: "Electrician", feeType: "percentage", value: 10 },
    { id: 2, service: "Carpenter", feeType: "fixed", value: 500 },
  ]);
  const [newFee, setNewFee] = useState({ service: "", feeType: "percentage", value: "" });

  // State for Role Management
  const [roles, setRoles] = useState(["Admin", "Manager", "Supervisor"]);
  const [newRole, setNewRole] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // State for Categories Management
  const [categories, setCategories] = useState(["Plumbing", "Masonry", "Painting"]);
  const [newCategory, setNewCategory] = useState("");

  // Handle Fee Change
  const handleFeeChange = (id, key, value) => {
    setFees(fees.map(fee => (fee.id === id ? { ...fee, [key]: value } : fee)));
  };

  // Add Fee
  const addFee = () => {
    if (!newFee.service || !newFee.value) return;
    setFees([...fees, { id: Date.now(), ...newFee }]);
    setNewFee({ service: "", feeType: "percentage", value: "" });
  };

  // Remove Fee
  const removeFee = (id) => {
    setFees(fees.filter(fee => fee.id !== id));
  };

  // Add Role
  const addRole = () => {
    if (!newRole.trim() || roles.includes(newRole)) return;
    setRoles([...roles, newRole]);
    setNewRole("");
  };

  // Filter Roles for Search
  const filteredRoles = roles.filter(role => role.toLowerCase().includes(searchTerm.toLowerCase()));

  // Add Category
  const addCategory = () => {
    if (!newCategory.trim() || categories.includes(newCategory)) return;
    setCategories([...categories, newCategory]);
    setNewCategory("");
  };

  // Remove Category
  const removeCategory = (category) => {
    setCategories(categories.filter(cat => cat !== category));
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Admin Settings</h2>

      {/* Fee Management */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-3">Fee Management</h3>
        <div className="overflow-x-auto">
          <table className="w-full bg-white border border-gray-300 rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Service</th>
                <th className="py-3 px-6 text-left">Fee Type</th>
                <th className="py-3 px-6 text-left">Value</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {fees.map((fee) => (
                <tr key={fee.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-6">{fee.service}</td>
                  <td className="py-3 px-6">
                    <select
                      value={fee.feeType}
                      onChange={(e) => handleFeeChange(fee.id, "feeType", e.target.value)}
                      className="border border-gray-300 p-2 rounded-md"
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed</option>
                    </select>
                  </td>
                  <td className="py-3 px-6">
                    <input
                      type="number"
                      value={fee.value}
                      onChange={(e) => handleFeeChange(fee.id, "value", e.target.value)}
                      className="border border-gray-300 p-2 w-20 rounded-md"
                    />
                  </td>
                  <td className="py-3 px-6 text-center">
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removeFee(fee.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add New Fee */}
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            placeholder="Service"
            value={newFee.service}
            onChange={(e) => setNewFee({ ...newFee, service: e.target.value })}
            className="border p-2 w-1/3 rounded-md"
          />
          <select
            value={newFee.feeType}
            onChange={(e) => setNewFee({ ...newFee, feeType: e.target.value })}
            className="border p-2 w-1/3 rounded-md"
          >
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed</option>
          </select>
          <input
            type="number"
            placeholder="Value"
            value={newFee.value}
            onChange={(e) => setNewFee({ ...newFee, value: e.target.value })}
            className="border p-2 w-1/3 rounded-md"
          />
          <button className="bg-green-500 text-white px-4 py-2 rounded-md" onClick={addFee}>
            <FaPlus />
          </button>
        </div>
      </div>

      {/* Role Management */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-3">Role Management</h3>
        <input
          type="text"
          placeholder="Search Role"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 w-full rounded-md mb-2"
        />
        <ul className="mt-3">
          {filteredRoles.map((role) => (
            <li
              key={role}
              className="flex justify-between p-2 border border-gray-300 rounded-md bg-gray-50"
            >
              {role}{" "}
            </li>
          ))}
        </ul>
        <div className="flex mt-3 gap-2">
          <input
            type="text"
            placeholder="Add Role"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            className="border p-2 w-full rounded-md"
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={addRole}>
            <FaPlus />
          </button>
        </div>
      </div>

      {/* Category Management */}
      <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-3">Service Categories</h3>
        <ul className="mt-3">
          {categories.map((category) => (
            <li
              key={category}
              className="flex justify-between p-2 border border-gray-300 rounded-md bg-gray-50"
            >
              {category}{" "}
              <button className="text-red-500 hover:text-red-700" onClick={() => removeCategory(category)}>
                <FaTrash />
              </button>
            </li>
          ))}
        </ul>
        <div className="flex mt-3 gap-2">
          <input
            type="text"
            placeholder="Add Category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="border p-2 w-full rounded-md"
          />
          <button className="bg-purple-500 text-white px-4 py-2 rounded-md" onClick={addCategory}>
            <FaPlus />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
