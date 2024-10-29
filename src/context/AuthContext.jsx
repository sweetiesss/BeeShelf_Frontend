import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { createContext, useEffect, useState } from "react";
import useAxios from "../services/CustomizeAxios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
 

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const storedAuth = localStorage.getItem("Authenticated");
    return storedAuth ? JSON.parse(storedAuth) : false;
  });

  const [rememberMe, setRememberMe] = useState(false);

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
      const response = await axios.post(process.env.REACT_APP_BASE_URL_API+"auth/refresh-token", {
        jwt: isAuthenticated,
      });
      setIsAuthenticated(response.data); // Update token
      console.log(response);
      
    } catch (error) {
      console.error("Failed to refresh token:", error);
      handleLogout();
    }
  };

  // const setExpiry = () => {
  //   const now = new Date();
  //   let expiryTime;

  //   if (rememberMe) {
  //     expiryTime = now.getTime() + 1000 * 60 * 60 * 24 * 30; // 1 month
  //   } else {
  //     expiryTime = now.getTime() + 1000 * 60 * 60 * 24; // 1 day
  //   }

  //   setExpiryDate(expiryTime);
  // };

  const handleLogin = (userData, rememberMeFlag) => {
    setUserInfor(userData);
    setRememberMe(rememberMeFlag);
  };
  const handleLogout = () => {
    localStorage.removeItem("UserInfor");
    localStorage.removeItem("Authenticated");
    localStorage.removeItem("UserExpiry");
    setIsAuthenticated(null);
    setUserInfor(null);
  };

  useEffect(() => {
    const checkTokenExpiration=()=>{
      const now=new Date().getTime();
      console.log("refreshing");
      console.log(now);
      console.log(expiryDate);
      console.log(now>expiryDate);
      
      
      

      if(expiryDate&&now>expiryDate){
          console.log("heere");
          refreshAccessToken();
       
      }
    }
    const interval = setInterval(checkTokenExpiration, 60000);
    return () => clearInterval(interval);
  }, [expiryDate, rememberMe, isAuthenticated]);

  return (
    <AuthContext.Provider
    value={{
      isAuthenticated,
      setIsAuthenticated,
      userInfor,
      setUserInfor,
      rememberMe,
      setRememberMe,
      handleLogin,
      handleLogout,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
}
