// components/AdminProtector.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/UserContextProvider";

const AdminProtector = ({ children }) => {
  const navigate = useNavigate();
  const { authUser } = useAuth(); 
  const [checking, setChecking] = useState(true);

  const ADMIN_EMAIL = "karmasetu2025@gmail.com"; 

  useEffect(() => {
    if (!authUser) {
      navigate("/login");
    } else if (authUser.email !== ADMIN_EMAIL) {
      navigate("/login"); 
    } else {
      setChecking(false); 
    }
  }, [authUser]);

  if (checking) {
    return null; 
  }

  return children;
};

export default AdminProtector;
