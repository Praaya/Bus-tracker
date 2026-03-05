import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../services/Api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      setUser(userInfo);
      api.defaults.headers.common["Authorization"] = `Bearer ${userInfo.token}`;
    }
    setLoading(false);
  }, []);

  const loginUser = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    const data = response.data;
    localStorage.setItem("userInfo", JSON.stringify(data));
    api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
    setUser(data);
    return data;
  };

  const logoutUser = () => {
    localStorage.removeItem("userInfo");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
