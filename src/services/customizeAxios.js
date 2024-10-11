
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
const useAxios = () => {
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
      console.log("response", response.data);

      return response;
    },
    function (error) {
      return Promise.reject(error);
    }
  );
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = async ({ url, method, data = {}, params = {} }) => {
    setLoading(true);
    try {
      const resultPromise = instance({
        url,
        method,
        data,
        params,
      });
      return resultPromise;
    } catch (error) {
      const errorMessage = error.response ? error.response.data : error.message;
      setError(errorMessage);
      return Promise.reject(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  return { response, error, loading, fetchData };
};

export default useAxios;
