// components/ProtectedRoute.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/UserContextProvider";

const UserProtector = ({ children }) => {
  const navigate = useNavigate();
  const { authUser } = useAuth();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!authUser) {
      navigate("/login");
    } else {
      setChecking(false);
    }
  }, []);

  if (checking) {
    return null;
  }

  return children;
};

export default UserProtector;
