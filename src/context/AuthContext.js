import React, { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000;

          if (decodedToken.exp < currentTime) {
            // Token has expired
            logout();
          } else {
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error("Invalid token");
          logout();
        }
      }
    };
    // Check token expiration on initial mount
    checkTokenExpiration();
    // Set up interval to check token expiration periodically
    const intervalId = setInterval(checkTokenExpiration, 60 * 1000); // Check every 5 minutes
    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
