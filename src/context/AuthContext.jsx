import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { createContext, useEffect, useLayoutEffect, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const storedAuth = localStorage.getItem("Authenticated");
    return storedAuth ? JSON.parse(storedAuth) : false;
  });

  const [userInfor, setUserInfor] = useState(() => {
    const storedData = localStorage.getItem("UserInfor");
    return storedData ? JSON.parse(storedData) : null;
  });

  const [expiryDate, setExpiryDate] = useState(() => {
    const storedExpiry = localStorage.getItem("Authenticated");
    return storedExpiry ? jwtDecode(storedExpiry).exp * 1000 : null;
  });

  useEffect(() => {
    localStorage.setItem("UserInfor", JSON.stringify(userInfor));
  }, [userInfor]);

  useEffect(() => {
    localStorage.setItem("UserExpiry", expiryDate);
  }, [expiryDate]);

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem("Authenticated", JSON.stringify(isAuthenticated));
      const decoded = jwtDecode(isAuthenticated);
      setExpiryDate(decoded.exp * 1000);
    } else {
      localStorage.removeItem("Authenticated");
      setExpiryDate(null);
    }
  }, [isAuthenticated]);

  const refreshAccessToken = async () => {
    try {
      const response = await axios.post(
        process.env.REACT_APP_BASE_URL_API + "auth/refresh-token",
        {
          jwt: isAuthenticated,
        }
      );
      setIsAuthenticated(response.data);
    } catch (error) {
      handleLogout();
    }
  };

  const handleLogin = (userData) => {
    setUserInfor(userData);
  };
  const handleLogout = () => {
    localStorage.removeItem("UserInfor");
    localStorage.removeItem("Authenticated");
    localStorage.removeItem("UserExpiry");
    setIsAuthenticated(null);
    setUserInfor(null);
  };

  useLayoutEffect(() => {
    const checkTokenExpiration = () => {
      console.log("freshing");

      const now = new Date().getTime();
      if (expiryDate && now > expiryDate) {
        console.log("freshing 2");

        // refreshAccessToken();
      }
    };
    const interval = setInterval(checkTokenExpiration, 10000);
    return () => clearInterval(interval);
  }, [expiryDate, isAuthenticated]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        userInfor,
        setUserInfor,
        handleLogin,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
