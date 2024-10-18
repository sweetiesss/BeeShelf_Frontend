import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const storedAuth = localStorage.getItem("Authenticated");
    return storedAuth ? JSON.parse(storedAuth) : false;
  });

  const [rememberMe, setRememberMe] = useState(false);

  // Manage user info separately
  const [userInfor, setUserInfor] = useState(() => {
    const storedData = localStorage.getItem("UserInfor");
    return storedData ? JSON.parse(storedData) : null;
  });

  // Manage expiry date independently
  const [expiryDate, setExpiryDate] = useState(() => {
    const storedExpiry = localStorage.getItem("UserExpiry");
    return storedExpiry ? parseInt(storedExpiry) : null;
  });

  // Effect for handling user info and setting expiry
  useEffect(() => {
    localStorage.setItem("UserInfor", JSON.stringify(userInfor));
  }, [userInfor]);

  // Effect for handling the expiration logic
  useEffect(() => {
    localStorage.setItem("UserExpiry", expiryDate); // Store the expiry date in a separate localStorage key
  }, [expiryDate]);

  // Effect for handling the authentication state
  useEffect(() => {
    localStorage.setItem("Authenticated", JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  // Function to set the expiry date based on rememberMe choice
  const setExpiry = () => {
    const now = new Date();
    let expiryTime;

    if (rememberMe) {
      expiryTime = now.getTime() + 1000 * 60 * 60 * 24 * 30; // 1 month
    } else {
      expiryTime = now.getTime() + 1000 * 60 * 60 * 24; // 1 day
    }

    setExpiryDate(expiryTime);
  };

  const handleLogin = (userData, rememberMeFlag) => {
    setUserInfor(userData);
    setRememberMe(rememberMeFlag);
    setExpiry();
  };
  const handleLogout = () => {
    localStorage.removeItem("UserInfor");
    localStorage.removeItem("Authenticated");
    localStorage.removeItem("UserExpiry");
  };

  useEffect(() => {
    const now = new Date().getTime();
    if (expiryDate && now > expiryDate) {
      // Clear the stored data if expired
      handleLogout();
    }
  }, [expiryDate]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        userInfor,
        setUserInfor,
        rememberMe,
        setRememberMe,
        setExpiryDate,
        handleLogin,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
