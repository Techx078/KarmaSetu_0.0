import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

export const ServiceProviderAuthContext = createContext();

export default function ServiceProviderAuthProvider({ children }) {
  const [serviceProvider, setServiceProvider] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:3000/service/prof2", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setServiceProvider(response.data.serviceProvider); 
        })
        .catch((error) => {
          setServiceProvider(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

 

  return (
    <ServiceProviderAuthContext.Provider value={{ serviceProvider, setServiceProvider }}>
      {!loading && children} 
    </ServiceProviderAuthContext.Provider>
  );
}

export const useServiceProviderAuth = () => useContext(ServiceProviderAuthContext);