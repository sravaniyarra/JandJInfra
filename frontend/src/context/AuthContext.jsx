import { createContext, useContext, useState } from "react";
import { api } from "../api/client";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("adminToken") || "");
  const [admin, setAdmin] = useState(
    JSON.parse(localStorage.getItem("adminData") || "null")
  );

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    setToken(data.token);
    setAdmin(data.admin);
    localStorage.setItem("adminToken", data.token);
    localStorage.setItem("adminData", JSON.stringify(data.admin));
  };

  const logout = () => {
    setToken("");
    setAdmin(null);
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
  };

  return (
    <AuthContext.Provider value={{ token, admin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
