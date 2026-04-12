import { createContext, useContext, useState } from "react";
import { api } from "../api/client";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("adminToken") || "");
  const [admin, setAdmin] = useState(
    JSON.parse(localStorage.getItem("adminData") || "null")
  );

  const setSession = (newToken, adminData) => {
    setToken(newToken);
    setAdmin(adminData);
    localStorage.setItem("adminToken", newToken);
    localStorage.setItem("adminData", JSON.stringify(adminData));
  };

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    setSession(data.token, data.admin);
  };

  const logout = () => {
    setToken("");
    setAdmin(null);
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
  };

  return (
    <AuthContext.Provider value={{ token, admin, login, setSession, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
