import axios from "axios";
import { jwtDecode } from "jwt-decode";
import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import AxiosOthers from "../services/Others";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const storedAuth = localStorage.getItem("Authenticated");
    return storedAuth ? JSON.parse(storedAuth) : null;
  });

  const [userInfor, setUserInfor] = useState(() => {
    const storedData = localStorage.getItem("UserInfor");
    return storedData ? JSON.parse(storedData) : null;
  });

  const [expiryDate, setExpiryDate] = useState(() => {
    const storedExpiry = localStorage.getItem("Authenticated");
    return storedExpiry ? jwtDecode(storedExpiry).exp * 1000 : null;
  });
  const [authWallet, setAuthWallet] = useState();
  const [banksList, setBanksList] = useState();
  const [provinces, setProvinences] = useState();
  const [ocopCategoriesList, setOcopCategoriesList] = useState();

  const { getBanks } = AxiosOthers();
  const { getOcopCategoryBy100, getProvinces } = AxiosOthers();

  const [refrestAuthWallet, setRefrestAuthWallet] = useState(false);

  useEffect(() => {
    fetchBankList();
    fetchOcopCategoriesList();
    fetchgetProvincesList();
  }, []);

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

  const fetchOcopCategoriesList = async () => {
    try {
      const ocopCategories = await getOcopCategoryBy100(0);
      setOcopCategoriesList(ocopCategories);
      console.log("ocopCategories", ocopCategories);
    } catch (e) {
      console.log(e);
    }
  };
  const fetchgetProvincesList = async () => {
    try {
      const provinces = await getProvinces();
      setProvinences(provinces);
      console.log("provinces", provinces);
    } catch (e) {
      console.log(e);
    }
  };
  const fetchBankList = async () => {
    try {
      const banks = await getBanks();
      setBanksList(banks);
      console.log("banks", banks);
    } catch (e) {
      console.log(e);
    }
  };

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

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        userInfor,
        setUserInfor,
        handleLogin,
        handleLogout,
        authWallet,
        banksList,
        setAuthWallet,
        ocopCategoriesList,
        refrestAuthWallet,
        setRefrestAuthWallet,
        provinces,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
