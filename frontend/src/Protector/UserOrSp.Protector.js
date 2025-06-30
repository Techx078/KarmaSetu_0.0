// components/CommonProtectedRoute.js
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/UserContextProvider";
import { useServiceProviderAuth } from "../context/ServiceProviderContextProvider";
import { useEffect, useState } from "react";

const UserOrSp = ({ children }) => {
  const navigate = useNavigate();
  const { authUser } = useAuth();
  const { serviceProvider } = useServiceProviderAuth();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!authUser && !serviceProvider) {
      navigate("/login");
    } else {
      setChecking(false);
    }
  }, [authUser, serviceProvider, navigate]);

  if (checking) {
    return null// Or use a spinner component
  }

  return children;
};

export default UserOrSp;
