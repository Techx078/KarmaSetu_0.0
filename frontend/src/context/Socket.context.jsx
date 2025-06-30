import React, { createContext, useContext, useState, useEffect } from "react";
import io from "socket.io-client";
import { useAuth } from "./UserContextProvider";
import { useServiceProviderAuth } from "./ServiceProviderContextProvider";

export const SocketContext = createContext();

export default function SocketProvider({ children }) {
  const { authUser } = useAuth();
  const { serviceProvider } = useServiceProviderAuth();

  const [socket, setSocket] = useState(null);

  const connectedToSocket = () => {
    const userId = authUser?._id;
    const serviceProviderId = serviceProvider?._id;
    
    const socketTemp = io("http://localhost:3000", {
      transports: ["websocket"],
      withCredentials: true,
      query: {
        userId: userId || "",
        serviceProviderId: serviceProviderId || "",
      },
    });
  
    socketTemp.on("connect", () => {
      console.log("✅ Socket connected:", socketTemp.id);
      setSocket(socketTemp);
    });
  
    socketTemp.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });
  
    socketTemp.on("connect_error", (err) => {
      console.error("⚠️ Connection failed:", err.message);
    });
  };
  

  const disConnectedToSocket = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      console.log("🔌 Socket manually disconnected");
    }
  };

  useEffect(() => {
    if (authUser || serviceProvider) {
        console.log(serviceProvider);
      connectedToSocket();
    }

    return () => {
      if (socket) {
        socket.disconnect();
        console.log("🔌 Socket disconnected on cleanup");
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser, serviceProvider]); // reconnect when user or provider changes

  return (
    <SocketContext.Provider value={{ socket, setSocket, connectedToSocket, disConnectedToSocket }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
