import axios from "axios";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export function useAxios() {
  const instance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL_API,
  });
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
      return Promise.reject(error);
    }
  );
  const [response, setResponse] = useState(null);

  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useContext(AuthContext);

  const fetchDataBearer = async ({ url, method, data = {}, params = {} }) => {
    console.log(isAuthenticated);

    setLoading(true);
    try {
      const resultPromise = instance({
        url,
        method,
        headers: {
          Authorization: `Bearer ${isAuthenticated}`,
        },
        data,
        params,
      });
      return resultPromise;
    } catch (error) {
      const errorMessage = error.response ? error.response.data : error.message;

      return Promise.reject(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  return { response, loading, fetchDataBearer };
}
