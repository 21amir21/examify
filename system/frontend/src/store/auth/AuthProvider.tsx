import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext, { IAuthContext } from "./AuthContext";

let logoutTimer: number;

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [username, setUsername] = useState("");
  const [id, setID] = useState("");
  const [role, setRole] = useState("");
  const [token, setToken] = useState("");
  const [expirationDate, setExpirationDate] = useState<Date | null>(null);

  const navigate = useNavigate();

  const login = useCallback(
    (
      id: string,
      username: string,
      role: string,
      token: string,
      existingExpiryDate?: Date
    ) => {
      setID(id);
      setUsername(username);
      setRole(role);
      setToken(token);

      const currentDateTime = new Date().getTime();
      const expiryDate =
        existingExpiryDate || new Date(currentDateTime + 3 * 60 * 60 * 1000); // 3 hours
      setExpirationDate(expiryDate);

      localStorage.setItem(
        "user",
        JSON.stringify({
          id,
          username,
          role,
          token,
          tokenExpiryDate: expiryDate.toISOString(),
        })
      );
    },
    []
  );

  const logout = useCallback(() => {
    setUsername("");
    setID("");
    setToken("");
    setRole("");
    setExpirationDate(null);
    localStorage.removeItem("user");
    navigate("/login");
  }, [navigate]);

  useEffect(() => {
    const storedData = localStorage.getItem("user");

    if (storedData) {
      const parsedData = JSON.parse(storedData);
      if (parsedData.token) {
        const existingExpiryDate = new Date(parsedData.tokenExpiryDate);
        if (existingExpiryDate > new Date()) {
          login(
            parsedData.id,
            parsedData.username,
            parsedData.role,
            parsedData.token,
            existingExpiryDate
          );
        }
      }
    }
  }, [login]);

  useEffect(() => {
    if (token && expirationDate) {
      const remainingTime = expirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, expirationDate, logout]);

  const contextValue: IAuthContext = {
    username,
    id,
    token,
    role,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
