import React, { useState } from "react";

const Notifications = () => {
  // Dummy notifications data
  const initialNotifications = [
    { id: 1, type: "Payment", message: "Payment received from Priya", timestamp: "5 mins ago" },
    { id: 2, type: "General", message: "System maintenance scheduled for tomorrow", timestamp: "1 hour ago" },
  ];

  // Notification State
  const [notifications, setNotifications] = useState(initialNotifications);
  const [newNotification, setNewNotification] = useState({ type: "", message: "" });
  const [filter, setFilter] = useState("All"); // Default filter shows all notifications

  // Notification Types (Only Payment & General)
  const notificationTypes = ["Payment", "General"];

  // Handle Notification Addition
  const handleAddNotification = () => {
    if (newNotification.type && newNotification.message) {
      const newNotif = {
        id: notifications.length + 1,
        type: newNotification.type,
        message: newNotification.message,
        timestamp: "Just now",
      };
      setNotifications([newNotif, ...notifications]); // Add new notification at the top
      setNewNotification({ type: "", message: "" }); // Reset input fields
    }
  };

  // Handle Notification Deletion
  const handleDeleteNotification = (id) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
  };

  // Filtered Notifications
  const filteredNotifications =
    filter === "All" ? notifications : notifications.filter((notif) => notif.type === filter);

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h3 className="font-bold text-xl text-gray-800 mb-4">🔔 Recent Notifications</h3>

      {/* Notification Input Section */}
      <div className="mb-4 p-4 bg-gray-100 rounded-lg">
        <h4 className="font-semibold text-lg mb-2">📢 Create New Notification</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Notification Type */}
          <select
            className="p-2 border rounded"
            value={newNotification.type}
            onChange={(e) => setNewNotification({ ...newNotification, type: e.target.value })}
          >
            <option value="">Select Type</option>
            {notificationTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          {/* Notification Message */}
          <input
            type="text"
            className="p-2 border rounded"
            placeholder="Enter notification message"
            value={newNotification.message}
            onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
          />

          {/* Add Notification Button */}
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleAddNotification}
          >
            Add Notification
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="mb-4">
        <h4 className="font-semibold text-lg">📌 Filter Notifications</h4>
        <select
          className="p-2 border rounded mt-2"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All</option>
          {notificationTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Notifications List */}
      <div className="bg-white p-4 rounded-md shadow-md">
        <h4 className="font-semibold text-lg mb-2">📜 Notification List</h4>
        <ul>
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notif) => (
              <li key={notif.id} className="flex justify-between items-center border-b p-2">
                <div>
                  <span className="font-bold text-blue-600">{notif.type}:</span> {notif.message}
                  <span className="text-gray-500 text-sm ml-2">({notif.timestamp})</span>
                </div>
                {/* Delete Button */}
                <button
                  className="text-red-600 hover:text-red-800"
                  onClick={() => handleDeleteNotification(notif.id)}
                >
                  ❌
                </button>
              </li>
            ))
          ) : (
            <p className="text-gray-500 text-center">No notifications available.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Notifications;
