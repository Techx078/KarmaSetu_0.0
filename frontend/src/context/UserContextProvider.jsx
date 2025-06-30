import axios from "axios";
import React, { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:3000/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setAuthUser(response.data.user); 
        })
        .catch((error) => {
          setAuthUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      {!loading && children} 
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);