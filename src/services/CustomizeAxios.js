import axios from "axios";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export function useAxios() {
  const instance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL_API,
  });
  const navigate = useNavigate();
  instance.interceptors.request.use(
    function (config) {
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );
  instance.interceptors.response.use(
    function (response) {
      console.log("response", response);

      return response;
    },
    function (error) {
      if (error.response?.status === 401) {
        navigate("/authorize/signin");
      }
      return Promise.reject(error);
    }
  );
  const [response, setResponse] = useState(null);

  const [loading, setLoading] = useState(false);

  const fetchData = async ({
    url,
    method,
    headers,
    data = {},
    params = {},
  }) => {
    setLoading(true);
    try {
      const resultPromise = instance({
        url,
        method,
        headers,
        data,
        params,
      });
      return resultPromise;
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/authorize/signin");
      }
      console.log(error);
      return error;
    } finally {
      setLoading(false);
    }
  };
  return { response, loading, fetchData };
}
export default function useAxiosBearer() {
  const instance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL_API,
  });
  const navigate = useNavigate();
  instance.interceptors.request.use(
    function (config) {
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );
  instance.interceptors.response.use(
    function (response) {
      console.log("response", response);

      return response;
    },
    function (error) {
      if (error.response?.status === 401) {
        navigate("/login");
      }
      return Promise.reject(error);
    }
  );
  const [response, setResponse] = useState(null);

  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useContext(AuthContext);

  const fetchDataBearer = async ({
    url,
    method,
    data = {},
    params = {},
    header = {},
  }) => {

    setLoading(true);
    try {
      const resultPromise = instance({
        url,
        method,
        headers: {
          ...header,
          Authorization: `Bearer ${isAuthenticated}`,
        },
        data,
        params,
      });
      return resultPromise;
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/login");
      }
      const errorMessage = error.response ? error.response.data : error.message;

      return Promise.reject(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  return { response, loading, fetchDataBearer };
}
