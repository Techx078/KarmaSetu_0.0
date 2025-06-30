// components/ServiceProviderRoute.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useServiceProviderAuth } from "../context/ServiceProviderContextProvider";

const ServiceProviderProtector = ({ children }) => {
  const navigate = useNavigate();
  const { serviceProvider } = useServiceProviderAuth();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!serviceProvider) {
      navigate("/login");
    } else {
      setChecking(false);
    }
  }, [serviceProvider, navigate]);

  if (checking) {
    return null           // You can replace with a spinner
  }

  return children;
};

export default ServiceProviderProtector;
