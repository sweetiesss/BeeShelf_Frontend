import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const storedAuth = localStorage.getItem("Authenticated");
    return storedAuth ? JSON.parse(storedAuth) : false;
  });

  const [rememberMe, setRememberMe] = useState(false);

  const [userInfor, setUserInfor] = useState(() => {
    const storedData = localStorage.getItem("UserInfor");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const now = new Date().getTime();
      if (parsedData?.expiry && parsedData?.expiry > now) {
        return parsedData.value;
      } else {
        localStorage.removeItem("UserInfor");
        return null;
      }
    }
    return null;
  });
  useEffect(() => {
    if (userInfor) {
      const storedData = localStorage.getItem("UserInfor");
      let parsedData = storedData ? JSON.parse(storedData) : null;

      if (parsedData && parsedData?.expiry) {
        localStorage.setItem(
          "UserInfor",
          JSON.stringify({ value: userInfor, expiry: parsedData.expiry })
        );
      } else {
        const now = new Date();
        let expiryTime;
        if (rememberMe) {
          expiryTime = now.getTime() + 1000 * 60 * 60 * 24 * 30; 
        } else {
          expiryTime = now.getTime() + 1000 * 60 * 60 * 24; 
        }
        localStorage.setItem(
          "UserInfor",
          JSON.stringify({ value: userInfor, expiry: expiryTime })
        );
      }
    }
    localStorage.setItem("Authenticated", JSON.stringify(isAuthenticated));
  }, [isAuthenticated, userInfor, rememberMe]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        userInfor,
        setUserInfor,
        rememberMe,
        setRememberMe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
