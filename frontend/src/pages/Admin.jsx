import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Sidebar from "../assets/commponents/Sidebar";
import Dashboard from "../assets/commponents/Dashboard";
import Revenue from "../assets/commponents/Revenue";
import Reports from "../assets/commponents/Reports";
import Users from "../assets/commponents/Users";
import Notifications from "../assets/commponents/Notifications";
import Settings from "../assets/commponents/Settings";

const Admin = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sectionComponent, setSectionComponent] = useState(<Dashboard />);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const sections = {
    dashboard: <Dashboard />,
    revenue: <Revenue />,
    reports: <Reports />,
    users: <Users />,
    notifications: <Notifications />,
    settings: <Settings />,
  };

  useEffect(() => {
    try {
      setSectionComponent(sections[activeSection]);
    } catch (error) {
      toast.error("Something went wrong while loading section.");
      navigate("/error", {
        state: {
          message: error.message || "Admin section failed to load.",
        },
      });
    }
  }, [activeSection]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        setActiveSection={setActiveSection}
      />
      <div className="flex-1 p-6">
        {sectionComponent}
      </div>
    </div>
  );
};

export default Admin;
