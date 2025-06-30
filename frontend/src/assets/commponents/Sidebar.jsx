import React from "react";
import { FaChartBar, FaFileInvoiceDollar, FaUsers, FaBell, FaCogs, FaBars, FaTimes } from "react-icons/fa";

const Sidebar = ({ isSidebarOpen, toggleSidebar, setActiveSection }) => {
  return (
    <>
      {/* Toggle Button - Appears Only When Sidebar is Hidden */}
      {!isSidebarOpen && (
        <button 
          className="fixed top-4 left-4 bg-gray-900 text-white p-2 rounded  z-50" 
          onClick={toggleSidebar}
        >
          <FaBars size={24} />
        </button>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 bg-gray-900 z-50 text-white w-64 p-6 transition-all duration-300 
                      ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:hidden"} lg:translate-x-0 lg:relative`}>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Admin Panel</h2>
          {/* Close Button - Visible When Sidebar is Open */}
          <button className="lg:block" onClick={toggleSidebar}>
            <FaTimes size={24} />
          </button>
        </div>

        <nav className="mt-6">
          <ul>
            <li className="py-2 flex items-center cursor-pointer hover:bg-gray-700 p-2 rounded" 
                onClick={() => setActiveSection("dashboard")}>
              <FaChartBar className="mr-3" /> Dashboard
            </li>
            <li className="py-2 flex items-center cursor-pointer hover:bg-gray-700 p-2 rounded" 
                onClick={() => setActiveSection("revenue")}>
              <FaFileInvoiceDollar className="mr-3" /> Revenue
            </li>
            <li className="py-2 flex items-center cursor-pointer hover:bg-gray-700 p-2 rounded" 
                onClick={() => setActiveSection("reports")}>
              <FaChartBar className="mr-3" /> Reports
            </li>
            <li className="py-2 flex items-center cursor-pointer hover:bg-gray-700 p-2 rounded" 
                onClick={() => setActiveSection("users")}>
              <FaUsers className="mr-3" /> Users
            </li>
            <li className="py-2 flex items-center cursor-pointer hover:bg-gray-700 p-2 rounded" 
                onClick={() => setActiveSection("notifications")}>
              <FaBell className="mr-3" /> Notifications
            </li>
            <li className="py-2 flex items-center cursor-pointer hover:bg-gray-700 p-2 rounded" 
                onClick={() => setActiveSection("settings")}>
              <FaCogs className="mr-3" /> Settings
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
